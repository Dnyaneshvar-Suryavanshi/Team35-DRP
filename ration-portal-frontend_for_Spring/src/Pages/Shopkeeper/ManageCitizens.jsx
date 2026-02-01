import { useEffect, useState } from 'react';
import { shopkeeperAPI } from '../../api';
import { toast } from 'react-toastify';
import DataTable from '../../components/DataTable';
import { getUserId } from '../../utils/authUtils';

const ManageCitizens = () => {
    const [citizens, setCitizens] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [loading, setLoading] = useState(true);
    const [selectedCitizen, setSelectedCitizen] = useState(null);
    const [editMode, setEditMode] = useState(false);

    const [formData, setFormData] = useState({
        cardNumber: '',
        citizenEmail: '',
        headOfFamilyName: '',
        familyMemberCount: '',
        address: '',
        city: '',
    });

    useEffect(() => {
        fetchCitizens();
    }, []);

    const fetchCitizens = async () => {
        try {
            const shopkeeperId = getUserId();
            const data = await shopkeeperAPI.getCitizensUnderShop(shopkeeperId);
            setCitizens(data || []);
        } catch (error) {
            console.error('Error fetching citizens:', error);
            toast.error('Failed to load citizens');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const shopkeeperId = getUserId();
            const fullAddress = formData.address.includes(formData.city) ? formData.address : formData.address + ", " + formData.city + ", Maharashtra";

            const payload = {
                cardNumber: formData.cardNumber,
                citizenEmail: formData.citizenEmail,
                headOfFamilyName: formData.headOfFamilyName,
                familyMemberCount: parseInt(formData.familyMemberCount),
                address: fullAddress,
            };

            if (editMode) {
                await shopkeeperAPI.updateCitizen(shopkeeperId, formData.cardNumber, {
                    headOfFamilyName: formData.headOfFamilyName,
                    familyMemberCount: parseInt(formData.familyMemberCount),
                    address: fullAddress,
                });
                toast.success('Citizen updated successfully');
            } else {
                await shopkeeperAPI.addCitizen(shopkeeperId, payload);
                toast.success('Citizen added successfully');
            }

            setShowForm(false);
            setEditMode(false);
            setFormData({
                cardNumber: '',
                citizenEmail: '',
                headOfFamilyName: '',
                familyMemberCount: '',
                address: '',
                city: '',
            });
            fetchCitizens();
        } catch (error) {
            console.error('Error saving citizen:', error);
            toast.error(error.response?.data?.message || 'Failed to save citizen');
        }
    };

    const handleEdit = (citizen) => {
        // Parse address to get base address and city
        const addressParts = citizen.address.split(', ');
        const city = addressParts[1] || '';
        const baseAddress = addressParts[0] || citizen.address;

        setFormData({
            cardNumber: citizen.cardNumber,
            citizenEmail: citizen.citizenEmail,
            headOfFamilyName: citizen.headOfFamilyName,
            familyMemberCount: citizen.familyMemberCount,
            address: baseAddress,
            city: city,
        });
        setEditMode(true);
        setShowForm(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDelete = async (citizen) => {
        if (!confirm(`Are you sure you want to delete citizen ${citizen.headOfFamilyName}?`)) return;

        try {
            const shopkeeperId = getUserId();
            await shopkeeperAPI.deleteCitizen(shopkeeperId, citizen.citizenEmail);
            toast.success('Citizen deleted successfully');
            fetchCitizens();
        } catch (error) {
            console.error('Error deleting citizen:', error);
            toast.error(error.response?.data?.message || 'Failed to delete citizen');
        }
    };

    const columns = [
        {
            key: 'cardNumber',
            label: 'Ration Card ID',
            render: (row) => <span className="font-mono font-bold">{row.cardNumber}</span>
        },
        {
            key: 'headOfFamilyName',
            label: 'Head of Family',
            render: (row) => <span className="font-bold">{row.headOfFamilyName}</span>
        },
        {
            key: 'status',
            label: 'Registry Status',
            render: (row) => {
                const isVerified = row.status === 'VERIFIED';
                return (
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${isVerified ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                        {row.status}
                    </span>
                );
            },
        },
        {
            key: 'actions',
            label: <div className='text-center'>Actions</div>,
            render: (row) => (
                <div className="flex justify-center gap-4">
                    <button
                        onClick={() => setSelectedCitizen(row)}
                        className="text-blue-800 hover:text-blue-700 font-bold text-xs uppercase tracking-widest border-b border-transparent transition-all"
                    >
                        View
                    </button>
                    <button
                        onClick={() => handleEdit(row)}
                        className="text-orange-600 hover:text-orange-500 font-bold text-xs uppercase tracking-widest border-b border-transparent transition-all"
                    >
                        Update
                    </button>
                    <button
                        onClick={() => handleDelete(row)}
                        className="text-red-600 hover:text-red-500 font-bold text-xs uppercase tracking-widest border-b border-transparent transition-all"
                    >
                        Delete
                    </button>
                </div>
            ),
        },
    ];

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#003D82]"></div>
            </div>
        );
    }

    return (
        <div className="animate-in fade-in duration-500">
            <div className="mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b-1 pb-6">
                <div>
                    <h3 className="text-2xl font-bold text-[#003D82]">Citizen Management</h3>
                </div>
                <button
                    onClick={() => {
                        setShowForm(!showForm);
                        if (showForm) {
                            setEditMode(false);
                            setFormData({
                                cardNumber: '',
                                citizenEmail: '',
                                headOfFamilyName: '',
                                familyMemberCount: '',
                                address: '',
                                city: '',
                            });
                        }
                    }}
                    className={`px-6 py-2.5 rounded-lg font-bold transition-all duration-300 shadow-lg text-sm uppercase tracking-wider flex items-center gap-2 ${showForm
                        ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        : 'bg-blue-900 text-white hover:bg-blue-800'}`}
                >
                    {showForm ? '✕ Close Form' : '＋ Enroll New Citizen'}
                </button>
            </div>

            {showForm && (
                <div className=" rounded-xl border-2  p-8 mb-8 shadow-sm">
                    <h4 className="text-xl font-bold text-[#003D82] mb-6 uppercase tracking-tight">
                        {editMode ? 'Update Citizen Details' : 'New Citizen Enrollment'}
                    </h4>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-2 ml-1">Ration Card ID</label>
                                <input
                                    type="text"
                                    required
                                    disabled={editMode}
                                    maxLength={16}
                                    value={formData.cardNumber}
                                    onChange={(e) => setFormData({ ...formData, cardNumber: e.target.value })}
                                    className={`w-full px-4 py-3 border-2 border-gray-100 rounded-xl focus:border-[#FF6B35] focus:outline-none transition-all ${editMode ? 'bg-gray-50 cursor-not-allowed text-gray-400' : ''}`}
                                    placeholder="Enter card number"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-2 ml-1">Contact Email</label>
                                <input
                                    type="email"
                                    required
                                    disabled={editMode}
                                    value={formData.citizenEmail}
                                    onChange={(e) => setFormData({ ...formData, citizenEmail: e.target.value })}
                                    className={`w-full px-4 py-3 border-2 border-gray-100 rounded-xl focus:border-black focus:outline-none transition-all ${editMode ? 'bg-gray-50 cursor-not-allowed text-gray-400' : ''}`}
                                    placeholder="citizen@email.com"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-2 ml-1">Head of Family Name</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.headOfFamilyName}
                                    onChange={(e) => setFormData({ ...formData, headOfFamilyName: e.target.value })}
                                    className="w-full px-4 py-3 border-2 border-gray-100 rounded-xl focus:border-black  focus:outline-none transition-all"
                                    placeholder="Full name as per ID"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-2 ml-1">Total Family Members</label>
                                <input
                                    type="number"
                                    required
                                    min="1"
                                    value={formData.familyMemberCount}
                                    onChange={(e) => setFormData({ ...formData, familyMemberCount: e.target.value })}
                                    className="w-full px-4 py-3 border-2 border-gray-100 rounded-xl focus:border-black focus:outline-none transition-all"
                                    placeholder="Count including head"
                                />
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-2 ml-1">Address</label>
                                <textarea
                                    required
                                    rows="2"
                                    value={formData.address}
                                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                    className="w-full px-4 py-3 border-2 border-gray-100 rounded-xl focus:border-black focus:outline-none transition-all"
                                    placeholder="House/Plot no, Area, Landmark"
                                />
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-2 ml-1">Select District</label>
                                <select
                                    required
                                    value={formData.city}
                                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                    className="w-full px-4 py-3 border-2 border-gray-100 rounded-xl focus:border-black focus:outline-none transition-all bg-white"
                                >
                                    <option value="">-- Choose Regional Cluster --</option>
                                    <option value="Mumbai">Mumbai </option>
                                    <option value="Pune">Pune </option>
                                    <option value="Nagpur">Nagpur </option>
                                    <option value="Nashik">Nashik </option>
                                    <option value="Aurangabad">Aurangabad </option>
                                    <option value="Kolhapur">Kolhapur </option>
                                </select>
                            </div>
                        </div>

                        <div className="pt-2">
                            <button
                                type="submit"
                                className="w-full sm:w-auto bg-[#003D82] text-white px-10 py-3 rounded-lg font-bold text-base hover:bg-[#002A5C] transition-all shadow-xl active:scale-95"
                            >
                                {editMode ? 'Update Citizen' : 'Add Citizen'}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <DataTable
                    columns={columns}
                    data={citizens}
                    searchable
                    searchPlaceholder="Filter registry by card ID or family head..."
                />
            </div>

            {/* Detailed View Modal */}
            {selectedCitizen && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-300">
                    <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden ">
                        <div className="px-8 py-6 flex justify-between items-center bg-gray-50 border-b">
                            <div className="flex flex-col">
                                <h3 className="text-2xl font-bold text-[#003D82] tracking-tight">Citizen Profile</h3>
                            </div>
                            <button
                                onClick={() => setSelectedCitizen(null)}
                                className="text-gray-400 hover:text-red-500 transition-colors text-3xl leading-none"
                            >×
                            </button>
                        </div>

                        <div className="p-10 space-y-8 bg-[#FFFBF0]/20">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <DetailItem label="Primary Beneficiary" value={selectedCitizen.headOfFamilyName} />
                                <DetailItem label="Ration Card ID" value={selectedCitizen.cardNumber} />
                                <DetailItem label="Communication Point" value={selectedCitizen.citizenEmail} />
                                <DetailItem label="Family Structure" value={`${selectedCitizen.familyMemberCount} Certified Members`} />
                                <div className="md:col-span-2">
                                    <DetailItem label="Primary Residential Domicile" value={selectedCitizen.address} />
                                </div>
                                <div className="pt-4 border-t border-gray-100 md:col-span-2">
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Registry Clearance Status</p>
                                    <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest ${selectedCitizen.status === 'VERIFIED' ? 'bg-green-100 text-green-700' : 'bg-[#FFFBF0] text-[#DAA520] border border-[#DAA520]'}`}>
                                        {selectedCitizen.status}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="px-8 py-6 bg-gray-50 flex justify-end">
                            <button
                                onClick={() => setSelectedCitizen(null)}
                                className="px-8 py-2.5 bg-[#003D82] text-white rounded-lg font-bold hover:bg-[#002A5C] transition-all shadow-md active:scale-95 uppercase tracking-widest text-xs"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

const DetailItem = ({ label, value }) => (
    <div className="space-y-1">
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{label}</p>
        <p className="text-[#1A1A2E] font-bold text-lg">{value || 'N/A'}</p>
    </div>
);

export default ManageCitizens;
