import { adminAPI, shopkeeperAPI } from '../../api';
import { toast } from 'react-toastify';
import { getUserId } from '../../utils/authUtils';
import { useEffect, useState } from 'react';
import PaymentModal from '../../Components/PaymentModal';


const DistributeRation = () => {
    const [cardNumber, setCardNumber] = useState('');
    const [citizenData, setCitizenData] = useState(null);
    const [entitlements, setEntitlements] = useState([]);
    const [selectedGrains, setSelectedGrains] = useState([]);
    const [loading, setLoading] = useState(false);
    const [citizens, setCitizens] = useState([]);

    const [showOtpModal, setShowOtpModal] = useState(false);
    const [otp, setOtp] = useState('');
    const [otpError, setOtpError] = useState('');
    const [otpLoading, setOtpLoading] = useState(false);

    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [paymentAmount, setPaymentAmount] = useState(0);
    const [isPaymentCompleted, setIsPaymentCompleted] = useState(false);



    useEffect(() => {
        fetchEntitlements();
        fetchMyCitizens();
    }, []);

    const fetchEntitlements = async () => {
        try {
            const data = await shopkeeperAPI.getEntitlements();
            setEntitlements(data || []);
        } catch (err) {
            console.error('Error fetching entitlements:', err);
            toast.error('Failed to load entitlements. Please contact admin.');
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
                await verifyCitizenStatus(localCitizen);
                return;
            }

            const shopkeeperId = getUserId();
            const data = await shopkeeperAPI.getCitizensUnderShop(shopkeeperId);
            const citizen = data.find(c => c.cardNumber === cardNum);

            if (!citizen) {
                toast.error('Citizen not found under your shop');
                setCitizenData(null);
            } else {
                await verifyCitizenStatus(citizen);
            }
        } catch {
            toast.error('Search failed');
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = () => {
        if (!cardNumber || cardNumber.length < 10) {
            toast.error('Enter valid ration card number');
            return;
        }
        performSearch(cardNumber);
    };

    const handleCitizenSelect = async (e) => {
        const value = e.target.value;
        setCardNumber(value);
        if (!value) {
            setCitizenData(null);
            setSelectedGrains([]);
            setOtp('');
            setIsPaymentCompleted(false);
            return;
        }
        const citizen = citizens.find(c => c.cardNumber === value);
        if (citizen) {
            await verifyCitizenStatus(citizen);
        } else {
            performSearch(value);
        }
    };

    const verifyCitizenStatus = async (citizen) => {
        setLoading(true);
        try {
            const data = await shopkeeperAPI.checkRationStatus(citizen.cardNumber);
            if (data.isDistributed) {
                toast.error(data.message, { autoClose: 5000 });
                // We still show data but maybe disable actions?
                // Or clear it? User asked "should not be allowed... it should display user already paid"
                setCitizenData(citizen);
                setIsPaymentCompleted(true); // Disable payment button as if paid/done
                // Add a visual indicator
            } else {
                setCitizenData(citizen);
                setIsPaymentCompleted(false);
                setSelectedGrains([]);
            }
        } catch (error) {
            console.error(error);
            setCitizenData(citizen); // Fallback
        } finally {
            setLoading(false);
        }
    };

    const toggleGrainSelection = (grain) => {
        setSelectedGrains(prev =>
            prev.includes(grain)
                ? prev.filter(g => g !== grain)
                : [...prev, grain]
        );
    };

    const calculateTotalAmount = () => {
        return selectedGrains.reduce((total, grain) => {
            const ent = entitlements.find(e => (e.grain || e.Grain) === grain);
            if (!ent) return total;
            const qty = (ent.quantityPerPerson || ent.QuantityPerPerson) * (citizenData.familyMemberCount);
            const price = ent.pricePerKg || 0;
            return total + (qty * price);
        }, 0);
    };

    const handleInitiateDistribution = () => {
        const total = calculateTotalAmount();
        setPaymentAmount(total);
        setShowPaymentModal(true);
    };

    const handlePaymentSuccess = async (details) => {
        // Payment successful, now generate OTP
        // details contains { transactionId, amount, etc. }
        try {
            const shopkeeperId = getUserId();
            const paymentPayload = {
                shopkeeperId: parseInt(shopkeeperId),
                citizenEmail: citizenData.citizenEmail,
                citizenName: citizenData.headOfFamilyName,
                transactionId: details.transactionId,
                amount: details.amount,
                paymentMethod: details.method || 'UPI'
            };

            // Save payment to backend
            await shopkeeperAPI.sendPaymentSuccessEmail(paymentPayload);
            toast.success('Payment recorded successfully');
        } catch (error) {
            console.error('Failed to save payment record:', error);
            // If payment fails (e.g., duplicate), we MUST STOP here.
            toast.error(error.response?.data?.message || 'Payment check failed. Possible duplicate.');
            return; // STOP FLOW
        }

        setShowPaymentModal(false);
        setIsPaymentCompleted(true);
        await generateOtp(details.transactionId);
    };

    const generateOtp = async (transactionId) => {
        if (selectedGrains.length === 0) {
            toast.error('Select at least one grain type');
            return;
        }

        if (!citizenData?.citizenEmail) {
            toast.error('Citizen email not found');
            return;

        }

        try {

            setOtpLoading(true);
            const shopkeeperId = getUserId();

            const payload = {
                shopkeeperId: parseInt(shopkeeperId),
                citizenEmail: citizenData.citizenEmail,
                cardNumber: cardNumber,
                transactionId: transactionId, // Pass transaction ID if needed
                amount: calculateTotalAmount()
            };

            await shopkeeperAPI.generateOtp(payload);

            toast.success('OTP sent to citizen email');
            setOtp('');
            setOtpError('');
            setShowOtpModal(true);
        } catch (err) {
            console.error('OTP Generation Error:', err);
            toast.error(err.response?.data?.message || 'Failed to generate OTP');
        } finally {
            setOtpLoading(false);
        }
    };

    const verifyOtpAndDistribute = async () => {
        if (otp.length !== 6) {
            setOtpError('Enter valid 6-digit OTP');
            return;
        }

        try {
            const payload = {
                cardNumber,
                grains: selectedGrains,
                otp
            };

            await shopkeeperAPI.distributeRation(payload);

            toast.success('Ration distributed successfully');
            setShowOtpModal(false);

            // Remove the processed citizen from the list locally to prevent re-selection
            setCitizens(prev => prev.filter(c => c.cardNumber !== cardNumber));
            // Reset form
            handleReset();

        } catch (err) {
            console.error('Distribution Error:', err);
            setOtpError(err?.response?.data?.message || 'Invalid OTP or Distribution failed');
        }
    };

    const handleReset = () => {
        setCardNumber('');
        setCitizenData(null);
        setSelectedGrains([]);
        setOtp('');
        setOtp('');
        setShowOtpModal(false);
        setIsPaymentCompleted(false);
    };

    return (
        <div className="animate-in fade-in duration-500">
            {/* <div className="mb-8 border-b-2 border-[#FFFBF0] pb-6">
                <h3 className="text-2xl font-bold text-[#003D82]">Ration Distribution Tab</h3>
            </div> */}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                <div className="space-y-6">
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm text-gray-400 font-bold uppercase mb-2">Select Citizen</label>
                                <select
                                    value={cardNumber}
                                    onChange={handleCitizenSelect}
                                    className="w-full px-4 py-3 border-2 border-gray-100 rounded-xl focus:border-black focus:outline-none transition-all bg-white font-medium"
                                >
                                    <option value="">-- Choose from Verified List --</option>
                                    {citizens.map(c => (
                                        <option key={c.cardNumber} value={c.cardNumber}>
                                            {c.headOfFamilyName} ({c.cardNumber})
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="relative py-4">
                                <div className="absolute inset-0 flex items-center">
                                    <span className="w-full border-t border-gray-100"></span>
                                </div>
                                <div className="relative flex justify-center text-xs uppercase">
                                    <span className="bg-white px-4 text-gray-400 font-bold ">or Manual Search</span>
                                </div>
                            </div>

                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    maxLength={16}
                                    value={cardNumber}
                                    onChange={e => setCardNumber(e.target.value)}
                                    className="flex-1 px-4 py-3 border-2 border-gray-100 rounded-xl focus:border-black  focus:outline-none transition-all font-mono"
                                    placeholder="Enter Card ID manually"
                                />
                                <button
                                    onClick={handleSearch}
                                    disabled={loading}
                                    className="px-6 py-3 bg-[#003D82] text-white rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-[#002A5C] transition-all shadow-md active:scale-95"
                                >
                                    {loading ? '...' : 'Verify'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>


                <div className="space-y-6">
                    {citizenData ? (
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 animate-in slide-in-from-right-4 duration-500">
                            <div><span className='text-sm mb-5 font-bold uppercase'>Citizen details</span></div>
                            <div className=" rounded-xl p-6 border  mb-8 grid grid-cols-2 gap-y-6 gap-x-4">
                                <div>
                                    <p className="text-[12px] font-bold uppercase mb-1">Ration Card Number</p>
                                    <p className="text-sm font-semibold text-[#1A1A2E] ">{citizenData.cardNumber}</p>
                                </div>
                                <div>
                                    <p className="text-[12px] font-bold uppercase mb-1">Head of Family</p>
                                    <p className="text-sm font-semibold text-[#1A1A2E]">{citizenData.headOfFamilyName}</p>
                                </div>
                                <div>
                                    <p className="text-[12px] font-bold uppercase mb-1">Family Members Count</p>
                                    <p className="text-lg font-semibold text-[#1A1A2E]">{citizenData.familyMemberCount} </p>
                                </div>
                                <div className="truncate">
                                    <p className="text-[12px] font-bold uppercase mb-1">Residential Area</p>
                                    <p className="text-xs font-semibold text-gray-600 truncate">{citizenData.address}</p>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div>
                                    <label className="block text-[12px] text-gray-400 font-bold mb-3 ml-1">Grain Type </label>
                                    <div className="grid grid-cols-1 gap-2">
                                        {entitlements.map(e => {
                                            const grain = e.grain || e.Grain;
                                            const isSelected = selectedGrains.includes(grain);
                                            const qty = (e.quantityPerPerson || e.QuantityPerPerson) * (citizenData.familyMemberCount);
                                            const price = e.pricePerKg || 0;
                                            const cost = qty * price;

                                            return (
                                                <div
                                                    key={e.entitlementId}
                                                    onClick={() => toggleGrainSelection(grain)}
                                                    className={`cursor-pointer px-4 py-3 border-2 rounded-xl transition-all flex justify-between items-center ${isSelected
                                                        ? 'border-green-600 bg-green-50'
                                                        : 'border-gray-100 hover:border-gray-300'
                                                        }`}
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <div className={`w-5 h-5 rounded border flex items-center justify-center ${isSelected ? 'bg-green-600 border-green-600' : 'border-gray-300'
                                                            }`}>
                                                            {isSelected && <span className="text-white text-xs">✓</span>}
                                                        </div>
                                                        <div>
                                                            <span className={`font-bold block ${isSelected ? 'text-green-800' : 'text-gray-700'}`}>
                                                                {grain}
                                                            </span>
                                                            <span className="text-[10px] text-gray-400 font-medium">₹{price}/kg</span>
                                                        </div>
                                                    </div>
                                                    <div className="text-right">
                                                        <span className="block text-sm font-bold text-gray-700">
                                                            {qty.toFixed(2)} KGs
                                                        </span>
                                                        <span className="text-xs font-semibold text-green-600">
                                                            ₹{cost.toFixed(2)}
                                                        </span>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>

                                {selectedGrains.length > 0 && (
                                    <div className="bg-blue-800 text-white rounded-lg px-6 py-4 shadow-lg">
                                        <p className="text-sm font-bold uppercase mb-2 opacity-80">Total Summary</p>
                                        <div className="space-y-1">
                                            {selectedGrains.map(g => {
                                                const ent = entitlements.find(e => (e.grain || e.Grain) === g);
                                                const qty = (ent.quantityPerPerson || ent.QuantityPerPerson) * (citizenData.familyMemberCount);
                                                const price = ent.pricePerKg || 0;
                                                const cost = qty * price;
                                                return (
                                                    <div key={g} className="flex justify-between text-sm">
                                                        <span>{g}  <span className="opacity-50 text-xs ml-1">({qty.toFixed(2)}kg x ₹{price})</span></span>
                                                        <span className="font-bold">₹{cost.toFixed(2)}</span>
                                                    </div>
                                                );
                                            })}
                                            <div className="border-t border-blue-600/50 mt-2 pt-2 flex justify-between text-base font-extrabold">
                                                <span>Total Payable</span>
                                                <span className="text-yellow-400">₹{calculateTotalAmount().toFixed(2)}</span>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <button
                                    onClick={handleInitiateDistribution}
                                    disabled={otpLoading || selectedGrains.length === 0 || isPaymentCompleted}
                                    className="w-full py-4 bg-green-700 text-white rounded-lg font-bold text-sm hover:bg-green-600 transition-all shadow-xl active:scale-95 uppercase tracking-widest disabled:bg-gray-200 disabled:shadow-none"
                                >
                                    {isPaymentCompleted ? 'Payment Completed - Verify OTP' : (otpLoading ? 'Processing...' : `Proceed to Pay ₹${calculateTotalAmount().toFixed(2)}`)}
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="h-full min-h-[400px] border-2 border-gray-200 rounded-2xl flex flex-col items-center justify-center text-center p-12 bg-gray-50/30">
                            <h4 className="text-lg font-bold text-gray-400 uppercase tracking-tight">Pending Resident Selection</h4>
                        </div>
                    )}
                </div>
            </div>

            {/* PAYMENT MODAL */}
            {showPaymentModal && (
                <PaymentModal
                    amount={paymentAmount}
                    citizenName={citizenData.headOfFamilyName}
                    onClose={() => setShowPaymentModal(false)}
                    onSuccess={handlePaymentSuccess}
                />
            )}

            {/* OTP VERIFICATION MODAL */}
            {showOtpModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-in fade-in duration-300">
                    <div className="bg-white rounded-3xl p-10 w-full max-w-md shadow-2xl ">
                        <div className="text-center mb-8">
                            <h2 className="text-2xl font-bold text-[#003D82] tracking-tight">OTP Verification</h2>
                            <p className="text-sm text-gray-500 mt-2">
                                Payment Received.<br />
                                An OTP has been Send to<br />
                                <strong className="text-gray-800">{citizenData.citizenEmail}</strong>
                            </p>
                        </div>

                        <div className="space-y-6">
                            <div>
                                <input
                                    type="text"
                                    maxLength={6}
                                    value={otp}
                                    onChange={e => setOtp(e.target.value)}
                                    className="w-full px-4 py-1 border-2 border-gray-100 rounded-2xl text-center text-xl  font-black tracking-[0.5em]  focus:outline-none transition-all shadow-inner bg-gray-50"
                                    placeholder="000000"
                                />
                                {otpError && (
                                    <p className="text-[12px] font-bold  mt-3 text-center animate-pulse">{otpError}</p>
                                )}
                            </div>

                            <div className="flex flex-col gap-3">
                                <button
                                    onClick={verifyOtpAndDistribute}
                                    className="w-full py-2 bg-[#003D82] text-white rounded-xl font-bold text-base hover:bg-[#002A5C] transition-all shadow-lg active:scale-95"
                                >
                                    Verify & Distribute
                                </button>
                                <button
                                    onClick={() => setShowOtpModal(false)}
                                    className="w-full py-3 text-xs font-bold text-gray-400 uppercase tracking-widest hover:text-red-500 transition-colors"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}


        </div>
    );
};

export default DistributeRation;
