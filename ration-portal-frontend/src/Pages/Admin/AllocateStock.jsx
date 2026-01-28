import { useEffect, useState } from 'react';
import { adminAPI } from '../../api';
import { toast } from 'react-toastify';
import DataTable from '../../components/DataTable';

const AllocateStock = () => {
    const [shops, setShops] = useState([]);
    const [allocations, setAllocations] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({
        shopId: '',
        grain: 'RICE',
        quantityAllocated: '',
        monthYear: new Date().toISOString().slice(0, 7), // "YYYY-MM"
        adminEmail: '',
        adminPassword: '',
    });

    const grainTypes = ['RICE', 'WHEAT', 'SUGAR', 'OIL'];

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [shopsData, allocationsData] = await Promise.all([
                adminAPI.getAllShops(),
                adminAPI.getAllAllocations(),
            ]);
            setShops(shopsData || []);
            setAllocations(allocationsData || []);
        } catch (error) {
            console.error('Error fetching data:', error);
            toast.error('Failed to load stock allocation data');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await adminAPI.allocateStock({
                ...formData,
                shopId: parseInt(formData.shopId),
                quantityAllocated: parseFloat(formData.quantityAllocated),
            });
            toast.success('Stock allocated successfully');
            setShowForm(false);
            setFormData({
                shopId: '',
                grain: 'RICE',
                quantityAllocated: '',
                monthYear: new Date().toISOString().slice(0, 7),
                adminEmail: '',
                adminPassword: '',
            });
            fetchData();
        } catch (error) {
            console.error('Error allocating stock:', error);
            toast.error(error.response?.data?.message || 'Failed to allocate stock');
        }
    };

    const columns = [
        { key: 'allocationId', label: 'Allocation ID' },
        {
            key: 'shopName',
            label: 'Shop Name',
        },
        { key: 'grain', label: 'Grain Type' },
        {
            key: 'quantityAllocated',
            label: 'Quantity (kg)',
            render: (row) => `${row.quantityAllocated} kg`,
        },
        {
            key: 'monthYear',
            label: 'Allocation Month',
        },
        {
            key: 'status',
            label: 'Status',
            render: (row) => (
                <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${row.status === 'Confirmed'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
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
                    <h3 className="text-lg font-semibold text-gray-700">Stock Allocation</h3>
                    <p className="text-sm text-gray-500 mt-1">Allocate stock to ration shops</p>
                </div>
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
                >
                    {showForm ? 'Cancel' : '+ Allocate Stock'}
                </button>
            </div>

            {showForm && (
                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                    <h4 className="text-lg font-semibold text-gray-800 mb-4">New Stock Allocation</h4>
                    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Select Shop
                            </label>
                            <select
                                required
                                value={formData.shopId}
                                onChange={(e) => setFormData({ ...formData, shopId: e.target.value })}
                                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            >
                                <option value="">-- Select Shop --</option>
                                {shops.map((shop) => (
                                    <option key={shop.shopId} value={shop.shopId}>
                                        {shop.shopName} - {shop.location}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Grain Type
                            </label>
                            <select
                                required
                                value={formData.grain}
                                onChange={(e) => setFormData({ ...formData, grain: e.target.value })}
                                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            >
                                {grainTypes.map((type) => (
                                    <option key={type} value={type}>
                                        {type}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Quantity (kg)
                            </label>
                            <input
                                type="number"
                                required
                                min="1"
                                step="0.01"
                                value={formData.quantityAllocated}
                                onChange={(e) => setFormData({ ...formData, quantityAllocated: e.target.value })}
                                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                placeholder="Enter quantity"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Allocation Month (YYYY-MM)
                            </label>
                            <input
                                type="month"
                                required
                                value={formData.monthYear}
                                onChange={(e) => setFormData({ ...formData, monthYear: e.target.value })}
                                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Admin Email
                            </label>
                            <input
                                type="email"
                                required
                                value={formData.adminEmail}
                                onChange={(e) => setFormData({ ...formData, adminEmail: e.target.value })}
                                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                placeholder="Enter your email"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Admin Password
                            </label>
                            <input
                                type="password"
                                required
                                value={formData.adminPassword}
                                onChange={(e) => setFormData({ ...formData, adminPassword: e.target.value })}
                                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                placeholder="Confirm with password"
                            />
                        </div>

                        <div className="md:col-span-2">
                            <button
                                type="submit"
                                className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition"
                            >
                                Allocate Stock
                            </button>
                        </div>
                    </form>
                </div>
            )}

            <DataTable columns={columns} data={allocations} searchable searchPlaceholder="Search allocations..." />
        </div>
    );
};

export default AllocateStock;
