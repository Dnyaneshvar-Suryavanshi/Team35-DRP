import { useEffect, useState } from 'react';
import { adminAPI } from '../../api';
import { toast } from 'react-toastify';

const AdminDashboard = () => {
    const [stats, setStats] = useState({
        pendingShopkeepers: 0,
        activeShops: 0,
        totalFamilies: 0,
        totalAllocations: 0,
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            const [shopkeepers, shops, families, allocations] = await Promise.all([
                adminAPI.getPendingShopkeepers(),
                adminAPI.getAllShops(),
                adminAPI.getAllFamilies(),
                adminAPI.getAllAllocations(),
            ]);

            setStats({
                pendingShopkeepers: shopkeepers.length || 0,
                activeShops: shops.length || 0,
                totalFamilies: families.length || 0,
                totalAllocations: allocations.length || 0,
            });
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
            toast.error('Failed to load dashboard data');
        } finally {
            setLoading(false);
        }
    };

    const statCards = [
        {
            title: 'Pending Shopkeepers',
            value: stats.pendingShopkeepers,


            link: '/admin/pending-shopkeepers',
        },
        {
            title: 'Active Shops',
            value: stats.activeShops,


            link: '/admin/manage-shops',
        },
        {
            title: 'Total Families',
            value: stats.totalFamilies,


            link: '/admin/view-families',
        },
        {
            title: 'Stock Allocations',
            value: stats.totalAllocations,


            link: '/admin/allocate-stock',
        },
    ];

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-gray-600">Loading dashboard...</div>
            </div>
        );
    }

    return (
        <div>
            <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-700 mb-4">Overview</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {statCards.map((card, index) => (
                        <div
                            key={index}
                            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition cursor-pointer"
                            onClick={() => window.location.href = card.link}
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600 mb-1">{card.title}</p>
                                    <p className="text-3xl font-bold text-gray-800">{card.value}</p>
                                </div>
                                <div className={`${card.color} w-14 h-14 rounded-full flex items-center justify-center text-2xl`}>
                                    {card.icon}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">



                <div className="bg-white rounded-lg shadow-md p-6">
                    <h4 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h4>
                    <div className="space-y-3">
                        <a
                            href="/admin/pending-shopkeepers"
                            className="block px-4 py-3 bg-yellow-50 border border-yellow-200 rounded-lg hover:bg-yellow-100 transition"
                        >
                            <span className="font-medium text-yellow-800">Approve Shopkeepers</span>
                        </a>
                        <a
                            href="/admin/manage-shops"
                            className="block px-4 py-3 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition"
                        >
                            <span className="font-medium text-blue-800">Create New Shop</span>
                        </a>
                        <a
                            href="/admin/allocate-stock"
                            className="block px-4 py-3 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 transition"
                        >
                            <span className="font-medium text-green-800">Allocate Stock</span>
                        </a>
                        <a
                            href="/admin/monthly-entitlement"
                            className="block px-4 py-3 bg-purple-50 border border-purple-200 rounded-lg hover:bg-purple-100 transition"
                        >
                            <span className="font-medium text-purple-800">Set Monthly Entitlement</span>
                        </a>
                    </div>
                </div>


                <div className="bg-white rounded-lg shadow-md p-6">
                    <h4 className="text-lg font-semibold text-gray-800 mb-4">System Information</h4>
                    <div className="space-y-3 text-sm text-gray-600">
                        <div className="flex justify-between py-2 border-b">
                            <span>Role:</span>
                            <span className="font-medium text-gray-800">Administrator</span>
                        </div>
                        <div className="flex justify-between py-2 border-b">
                            <span>Total Shops:</span>
                            <span className="font-medium text-gray-800">{stats.activeShops}</span>
                        </div>
                        <div className="flex justify-between py-2 border-b">
                            <span>Total Families:</span>
                            <span className="font-medium text-gray-800">{stats.totalFamilies}</span>
                        </div>
                        <div className="flex justify-between py-2">
                            <span>Pending Approvals:</span>
                            <span className="font-medium text-yellow-600">{stats.pendingShopkeepers}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
