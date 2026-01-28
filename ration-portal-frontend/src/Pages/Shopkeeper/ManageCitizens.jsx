import { useEffect, useState } from 'react';
import { shopkeeperAPI } from '../../api';
import { toast } from 'react-toastify';
import DataTable from '../../components/DataTable';
import { getUserId } from '../../utils/authUtils';

const ManageCitizens = () => {
    const [citizens, setCitizens] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({
        cardNumber: '',
        citizenEmail: '',
        headOfFamilyName: '',
        familyMemberCount: '',
        address: '',
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

    const generateCardNumber = () => {
        const randomNum = Math.floor(100000000000 + Math.random() * 900000000000);
        setFormData({ ...formData, cardNumber: randomNum.toString() });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const shopkeeperId = getUserId();
            await shopkeeperAPI.addCitizen(shopkeeperId, {
                ...formData,
                familyMemberCount: parseInt(formData.familyMemberCount),
            });
            toast.success('Citizen added successfully');
            setShowForm(false);
            setFormData({
                cardNumber: '',
                citizenEmail: '',
                headOfFamilyName: '',
                familyMemberCount: '',
                address: '',
            });
            fetchCitizens();
        } catch (error) {
            console.error('Error adding citizen:', error);
            toast.error(error.response?.data?.message || 'Failed to add citizen');
        }
    };

    const columns = [
        { key: 'cardNumber', label: 'Card Number' },
        { key: 'headOfFamilyName', label: 'Head of Family' },
        { key: 'citizenEmail', label: 'Email' },
        {
            key: 'familyMemberCount',
            label: 'Family Members',
        },
        { key: 'address', label: 'Address' },
        {
            key: 'status',
            label: 'Status',
            render: (row) => (
                <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${row.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                        }`}
                >
                    {row.status}
                </span>
            ),
        },
    ];

    if (loading) {
        return <div className="text-center text-gray-600">Loading...</div>;
    }

    return (
        <div>
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h3 className="text-lg font-semibold text-gray-700">Manage Citizens</h3>
                    <p className="text-sm text-gray-500 mt-1">Add and manage citizens under your shop</p>
                </div>
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
                >
                    {showForm ? 'Cancel' : '+ Add Citizen'}
                </button>
            </div>

            {showForm && (
                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                    <h4 className="text-lg font-semibold text-gray-800 mb-4">Add New Citizen</h4>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Card Number
                                </label>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        required
                                        maxLength={12}
                                        minLength={12}
                                        value={formData.cardNumber}
                                        onChange={(e) => setFormData({ ...formData, cardNumber: e.target.value })}
                                        className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                        placeholder="12-digit card number"
                                    />

                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Citizen Email
                                </label>
                                <input
                                    type="email"
                                    required
                                    value={formData.citizenEmail}
                                    onChange={(e) => setFormData({ ...formData, citizenEmail: e.target.value })}
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                    placeholder="citizen@example.com"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Head of Family Name
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={formData.headOfFamilyName}
                                    onChange={(e) => setFormData({ ...formData, headOfFamilyName: e.target.value })}
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                    placeholder="Enter name"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Family Member Count
                                </label>
                                <input
                                    type="number"
                                    required
                                    min="1"
                                    max="20"
                                    value={formData.familyMemberCount}
                                    onChange={(e) => setFormData({ ...formData, familyMemberCount: e.target.value })}
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                    placeholder="Number of members"
                                />
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Address
                                </label>
                                <textarea
                                    required
                                    rows="3"
                                    value={formData.address}
                                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                    placeholder="Enter complete address"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition"
                        >
                            Add Citizen
                        </button>
                    </form>
                </div>
            )}

            <DataTable
                columns={columns}
                data={citizens}
                searchable
                searchPlaceholder="Search by card number or name..."
            />
        </div>
    );
};

export default ManageCitizens;
