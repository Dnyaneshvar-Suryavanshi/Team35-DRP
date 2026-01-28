import { useEffect, useState } from 'react';
import { adminAPI } from '../../api';
import { toast } from 'react-toastify';
import DataTable from '../../components/DataTable';

const ManageShops = () => {
    const [shops, setShops] = useState([]);
    const [shopStatusToggle, setShopStatusToggle] = useState("Active");
    const [shopkeepers, setShopkeepers] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({
        shopName: '',
        location: '',
        shopkeeperId: '',
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [shopsData, shopkeepersData] = await Promise.all([
                adminAPI.getAllShops(),
                adminAPI.getAllShopkeepers(),
            ]);
            setShops(shopsData || []);
            // Filter only approved shopkeepers
            setShopkeepers((shopkeepersData || []).filter(sk => sk.status === 'Active'));
        } catch (error) {
            console.error('Error fetching data:', error);
            toast.error('Failed to load shops data');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const { shopkeeperId, ...shopData } = formData;
            await adminAPI.createShop(shopkeeperId, shopData);
            toast.success('Shop created successfully');
            setShowForm(false);
            setFormData({ shopName: '', location: '', shopkeeperId: '' });
            fetchData();
        } catch (error) {
            console.error('Error creating shop:', error);
            toast.error(error.response?.data?.message || 'Failed to create shop');
        }
    };

    const handleSuspend = async (shopkeeperId, status) => {

        console.log("Shopkeeper ID:", shopkeeperId);
        if (!shopkeeperId) {
            toast.error("Invalid shopkeeper ID");
            return;
        }
        if (!confirm(`Are you sure you want to ${status === "Active" ? "suspend" : "activate"} this shopkeeper?`)) return;

        try {
            await adminAPI.suspendShopkeeper(shopkeeperId);
            toast.success('Shopkeeper suspended successfully');
            fetchData();
        } catch (error) {
            console.error('Error suspending shopkeeper:', error);
            toast.error(error.response?.data?.message || 'Failed to suspend shopkeeper');
        }
    };

    const columns = [
        { key: 'shopId', label: 'Shop ID' },
        { key: 'shopName', label: 'Shop Name' },
        { key: 'location', label: 'Location' },
        {
            key: 'shopkeeperName',
            label: 'Shopkeeper',
        },
        {
            key: 'status',
            label: 'Shop Status',
            render: (row) => (
                <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${row.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}
                >
                    {row.status}
                </span>
            ),
        },
        {
            key: 'actions',
            label: <div className="text-center w-full">Actions</div>,

            render: (row) => (
                // console.log("ROW DATA:", row),
                <div className="flex justify-center gap-2">
                    <button
                        onClick={() => handleSuspend(row.shopkeeperId, row.status)}

                        className={`text-white px-3 mx-4 py-1 rounded text-sm transition
            ${row.status === "Active"
                                ? "bg-red-600 hover:bg-red-700"
                                : "bg-green-600 hover:bg-green-700"
                            }`}
                    >
                        {row.status === "Active" ? "Suspend Shop" : "Active Shop"}
                    </button>

                    {/* <button
                        onClick={() => handleSuspend(row.shopkeeperId)}
                        className="bg-yellow-400 text-black mx-4 px-3 py-1 rounded text-sm transition"
                        disabled={row.shopkeeperId?.status === 'Suspended'}
                    >
                        Resume Licence
                    </button> */}
                </div>


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
                    <h3 className="text-lg font-semibold text-gray-700">Manage Shops</h3>
                    <p className="text-sm text-gray-500 mt-1">Create and manage ration shops</p>
                </div>
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
                >
                    {showForm ? 'Cancel' : '+ Add New Shop'}
                </button>
            </div>

            {showForm && (
                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                    <h4 className="text-lg font-semibold text-gray-800 mb-4">Create New Shop</h4>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Shop Name
                            </label>
                            <input
                                type="text"
                                required
                                value={formData.shopName}
                                onChange={(e) => setFormData({ ...formData, shopName: e.target.value })}
                                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                placeholder="Enter shop name"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Location
                            </label>
                            <input
                                type="text"
                                required
                                value={formData.location}
                                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                placeholder="Enter shop location"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Select Shopkeeper
                            </label>
                            <select
                                required
                                value={formData.shopkeeperId}
                                onChange={(e) => setFormData({ ...formData, shopkeeperId: e.target.value })}
                                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            >
                                <option value="">-- Select Shopkeeper --</option>
                                {shopkeepers.map((sk) => (
                                    <option key={sk.userId} value={sk.userId}>
                                        {sk.name} ({sk.email})
                                    </option>
                                ))}
                            </select>
                        </div>

                        <button
                            type="submit"
                            className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition"
                        >
                            Create Shop
                        </button>
                    </form>
                </div>
            )}

            <DataTable columns={columns} data={shops} searchable searchPlaceholder="Search shops..." />
        </div>
    );
};

export default ManageShops;
