import { shopkeeperAPI, adminAPI } from '../../api';
import { toast } from 'react-toastify';
import { getUserId } from '../../utils/authUtils';
import { useEffect, useState } from 'react';

const DistributeRation = () => {
    const [cardNumber, setCardNumber] = useState('');
    const [citizenData, setCitizenData] = useState(null);
    const [entitlements, setEntitlements] = useState([]);
    const [grainType, setGrainType] = useState('');
    const [loading, setLoading] = useState(false);
    const [citizens, setCitizens] = useState([]);

    /* OTP STATES */
    const [showOtpModal, setShowOtpModal] = useState(false);
    const [otp, setOtp] = useState('');
    const [otpError, setOtpError] = useState('');
    const [otpLoading, setOtpLoading] = useState(false);

    useEffect(() => {
        fetchEntitlements();
        fetchMyCitizens();
    }, []);

    const fetchEntitlements = async () => {
        try {
            const data = await adminAPI.getAllEntitlements();
            setEntitlements(data || []);
        } catch (err) {
            console.error(err);
        }
    };

    const fetchMyCitizens = async () => {
        try {
            const shopkeeperId = getUserId();
            const data = await shopkeeperAPI.getCitizensUnderShop(shopkeeperId);
            setCitizens(data || []);
        } catch (err) {
            console.error(err);
        }
    };

    const performSearch = async (cardNum) => {
        setLoading(true);
        try {
            const localCitizen = citizens.find(c => c.cardNumber === cardNum);
            if (localCitizen) {
                setCitizenData(localCitizen);
                setGrainType('');
                return;
            }

            const shopkeeperId = getUserId();
            const data = await shopkeeperAPI.getCitizensUnderShop(shopkeeperId);
            const citizen = data.find(c => c.cardNumber === cardNum);

            if (!citizen) {
                toast.error('Citizen not found under your shop');
                setCitizenData(null);
            } else {
                setCitizenData(citizen);
                setGrainType('');
            }
        } catch {
            toast.error('Search failed');
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = () => {
        if (!cardNumber || cardNumber.length !== 12) {
            toast.error('Enter valid 12-digit card number');
            return;
        }
        performSearch(cardNumber);
    };

    const handleCitizenSelect = (e) => {
        const value = e.target.value;
        setCardNumber(value);
        if (!value) {
            setCitizenData(null);
            setGrainType('');
            return;
        }
        const citizen = citizens.find(c => c.cardNumber === value);
        citizen ? setCitizenData(citizen) : performSearch(value);
    };

    // 🔹 GENERATE OTP
    const handleDistributeClick = async () => {
        if (!grainType) {
            toast.error('Select grain type');
            return;
        }

        try {
            setOtpLoading(true);
            const shopkeeperId = getUserId();

            await shopkeeperAPI.generateOtp(
                shopkeeperId,
                cardNumber
            );

            toast.success('OTP sent to citizen email');
            setOtp('');
            setOtpError('');
            setShowOtpModal(true);
        } catch {
            toast.error('Failed to generate OTP');
        } finally {
            setOtpLoading(false);
        }
    };

    // 🔹 VERIFY OTP & DISTRIBUTE
    const verifyOtpAndDistribute = async () => {
        if (otp.length !== 6) {
            setOtpError('Enter valid 6-digit OTP');
            return;
        }

        try {
            const payload = {
                cardNumber,
                grain: grainType,
                otp
            };

            await shopkeeperAPI.distributeRation(payload);

            toast.success('Ration distributed successfully');
            setShowOtpModal(false);
            setCitizenData(null);
            setCardNumber('');
            setGrainType('');
            setOtp('');
        } catch (err) {
            setOtpError(err?.response?.data?.message || 'Invalid OTP');
        }
    };

    const selectedEntitlement = grainType
        ? entitlements.find(e => (e.grain || e.Grain) === grainType)
        : null;

    const qtyPerPerson = selectedEntitlement
        ? (selectedEntitlement.quantityPerPerson || selectedEntitlement.QuantityPerPerson)
        : 0;

    const calculatedQuantity = citizenData
        ? citizenData.familyMemberCount * qtyPerPerson
        : 0;

    return (
        <>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

                {/* SEARCH */}
                <div className="bg-white rounded-lg shadow p-4">
                    <h3 className="font-semibold mb-3">Find Citizen</h3>

                    <select
                        value={cardNumber}
                        onChange={handleCitizenSelect}
                        className="w-full md:w-1/2 px-3 py-2 border rounded-md text-sm mb-3"
                    >
                        <option value="">-- Select Citizen --</option>
                        {citizens.map(c => (
                            <option key={c.cardNumber} value={c.cardNumber}>
                                {c.headOfFamilyName} ({c.cardNumber})
                            </option>
                        ))}
                    </select>

                    <div className="text-xs text-gray-400 text-center mb-2">OR</div>

                    <div className="flex gap-2">
                        <input
                            type="text"
                            maxLength={12}
                            value={cardNumber}
                            onChange={e => setCardNumber(e.target.value)}
                            className="w-1/2 px-3 py-2 border rounded-md text-sm"
                            placeholder="12-digit card"
                        />
                        <button
                            onClick={handleSearch}
                            className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm"
                        >
                            Search
                        </button>
                    </div>
                </div>

                {/* DETAILS */}
                {citizenData && (
                    <div className="bg-white rounded-lg shadow p-4">
                        <h3 className="font-semibold mb-3">Citizen & Distribution</h3>

                        <div className="grid grid-cols-2 gap-3 text-sm mb-4">
                            <div>Card<br /><strong>{citizenData.cardNumber}</strong></div>
                            <div>Head<br /><strong>{citizenData.headOfFamilyName}</strong></div>
                            <div>Members<br /><strong>{citizenData.familyMemberCount}</strong></div>
                            <div className="col-span-2 truncate">
                                Address<br /><strong>{citizenData.address}</strong>
                            </div>
                        </div>

                        <div className="flex flex-wrap items-end gap-3">
                            <select
                                value={grainType}
                                onChange={e => setGrainType(e.target.value)}
                                className="w-full md:w-1/2 px-3 py-2 border rounded-md text-sm"
                            >
                                <option value="">Select Grain</option>
                                {entitlements.map(e => (
                                    <option key={e.entitlementId} value={e.grain || e.Grain}>
                                        {e.grain || e.Grain}
                                    </option>
                                ))}
                            </select>

                            {grainType && (
                                <div className="bg-blue-50 px-3 py-2 rounded-md text-sm">
                                    <strong>{calculatedQuantity} kg</strong>
                                </div>
                            )}

                            <button
                                onClick={handleDistributeClick}
                                disabled={otpLoading}
                                className="px-4 py-2 bg-green-600 text-white rounded-md text-sm"
                            >
                                {otpLoading ? 'Sending OTP...' : 'Generate OTP'}
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* OTP MODAL */}
            {showOtpModal && (
                <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-[420px] shadow-lg">
                        <h1 className="mb-2 text-center font-semibold">OTP Verification</h1>
                        <p className="mb-3 text-center text-sm">
                            OTP sent to <strong>{citizenData.citizenEmail}</strong>
                        </p>

                        <input
                            type="text"
                            maxLength={6}
                            value={otp}
                            onChange={e => setOtp(e.target.value)}
                            className="w-full px-3 py-2 mt-2 border rounded-md text-center text-lg tracking-widest"
                            placeholder="Enter OTP"
                        />

                        {otpError && (
                            <p className="text-red-500 text-sm mt-1">{otpError}</p>
                        )}

                        <div className="flex justify-end gap-2 mt-4">
                            <button
                                onClick={() => setShowOtpModal(false)}
                                className="px-4 py-2 text-sm border rounded-md"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={verifyOtpAndDistribute}
                                className="px-4 py-2 text-sm bg-green-600 text-white rounded-md"
                            >
                                Verify & Distribute
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default DistributeRation;
