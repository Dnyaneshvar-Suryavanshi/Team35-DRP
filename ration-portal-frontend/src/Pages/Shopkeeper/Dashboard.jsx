import { useEffect, useState } from 'react';
import { shopkeeperAPI } from '../../api';
import { toast } from 'react-toastify';
import { getUserId } from '../../utils/authUtils';

const ShopkeeperDashboard = () => {
    const [shopInfo, setShopInfo] = useState(null);
    const [stock, setStock] = useState([]);
    const [allocations, setAllocations] = useState([]);
    const [citizens, setCitizens] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            const shopkeeperId = getUserId();

            // First get shop info to get shopId
            const shop = await shopkeeperAPI.getMyShop(shopkeeperId);
            setShopInfo(shop);

            if (shop && shop.shopId) {
                // Then get other data using shopkeeperId or shopId
                const [currentStock, allocs, citizensList] = await Promise.all([
                    shopkeeperAPI.viewCurrentStock(shop.shopId),
                    shopkeeperAPI.getMyAllocations(shopkeeperId),
                    shopkeeperAPI.getCitizensUnderShop(shopkeeperId),
                ]);

                setStock(currentStock || []);
                setAllocations(allocs || []);
                setCitizens(citizensList || []);
            }
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
            toast.error('Failed to load dashboard data');
        } finally {
            setLoading(false);
        }
    };

    const pendingAllocations = allocations.filter(a => a.status === 'Pending').length;

    if (loading) {
        return <div className="text-center text-gray-600">Loading dashboard...</div>;
    }

    if (!shopInfo) {
        return (
            <div className="bg-white rounded-lg shadow-md p-10 text-center">
                <h2 className="text-xl font-semibold text-gray-700 mb-2">
                    Shop Not Available
                </h2>
                <p className="text-gray-500">
                    Admin has not created this shop yet.
                </p>
            </div>
        );
    }

    return (
        <div>

            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Shop Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <p className="text-sm text-gray-600">Shop Name</p>
                        <p className="text-lg font-medium text-gray-900">{shopInfo?.shopName || 'N/A'}</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-600">Location</p>
                        <p className="text-lg font-medium text-gray-900">{shopInfo?.location || 'N/A'}</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-600">Status</p>
                        <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${shopInfo?.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                            }`}>
                            {shopInfo?.status || 'N/A'}
                        </span>
                    </div>
                </div>
            </div>

            {/* Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600 mb-1">Registered Citizens</p>
                            <p className="text-3xl font-bold text-gray-800">{citizens.length}</p>
                        </div>

                    </div>
                </div>

                {/* <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600 mb-1">Pending Allocations</p>
                            <p className="text-3xl font-bold text-gray-800">{pendingAllocations}</p>
                        </div>

                    </div>
                </div> */}

                <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600 mb-1">Stock Items</p>
                            <p className="text-3xl font-bold text-gray-800">{stock.length}</p>
                        </div>

                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600 mb-1">Total Allocations</p>
                            <p className="text-3xl font-bold text-gray-800">{allocations.length}</p>
                        </div>

                    </div>
                </div>
            </div>

            {/* Current Stock */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Current Stock</h3>
                {stock.length === 0 ? (
                    <p className="text-gray-500 text-center py-4">No stock available</p>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        {stock.map((item, index) => (
                            <div key={index} className="border rounded-lg p-4 text-center">
                                <p className="text-sm text-gray-600">{item.grain}</p>
                                <p className="text-2xl font-bold text-gray-900">{item.availableQuantity} kg</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {pendingAllocations > 0 && (
                        <a
                            href="/shopkeeper/stock-management"
                            className="block px-4 py-3 bg-yellow-50 border border-yellow-200 rounded-lg hover:bg-yellow-100 transition"
                        >
                            <span className="font-medium text-yellow-800">
                                Confirm Pending Stock ({pendingAllocations})
                            </span>
                        </a>
                    )}
                    <a
                        href="/shopkeeper/manage-citizens"
                        className="block px-4 py-3 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition"
                    >
                        <span className="font-medium text-blue-800">Add New Citizen</span>
                    </a>
                    <a
                        href="/shopkeeper/distribute-ration"
                        className="block px-4 py-3 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 transition"
                    >
                        <span className="font-medium text-green-800">Distribute Ration</span>
                    </a>
                    <a
                        href="/shopkeeper/distribution-history"
                        className="block px-4 py-3 bg-purple-50 border border-purple-200 rounded-lg hover:bg-purple-100 transition"
                    >
                        <span className="font-medium text-purple-800">View Distribution History</span>
                    </a>
                </div>
            </div>
        </div>
    );
};

export default ShopkeeperDashboard;
