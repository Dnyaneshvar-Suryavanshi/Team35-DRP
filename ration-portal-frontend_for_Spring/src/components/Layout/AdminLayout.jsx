import { Link, useLocation, Outlet } from 'react-router-dom';
import { authAPI } from '../../api';

const AdminLayout = () => {
    const location = useLocation();
    const userName = localStorage.getItem('userName') || 'Admin';

    const isActive = (path) => location.pathname === path;

    const menuItems = [
        { path: '/admin/dashboard', label: 'Admin Dashboard' },
        { path: '/admin/pending-shopkeepers', label: 'Pending Shopkeepers' },
        { path: '/admin/manage-shops', label: 'Manage Shops' },
        { path: '/admin/allocate-stock', label: 'Allocate Stock' },
        { path: '/admin/monthly-entitlement', label: 'Monthly Entitlement' },
        { path: '/admin/view-families', label: 'View Families' },
        { path: '/admin/distribution-logs', label: 'Distribution Logs' },
        { path: '/admin/distribution-logs-summary', label: 'Distribution Report' },
        { path: '/admin/payment-logs', label: 'Payment Logs' },
    ];

    return (
        <div className="flex h-screen bg-[#FFFBF0]">

            <div className="w-72 bg-blue-950 text-white  text-center flex flex-col min-h-screen shadow-2xl">
                <div className="p-8 border-b border-gray-700 bg-[#003D82]">
                    <h1 className="text-xl font-bold tracking-tight">RationSahayata Portal</h1>
                    <p className="text-sm text-gray-200 mt-1 font-bold">Admin Panel</p>
                </div>

                <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
                    {menuItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 group ${isActive(item.path)
                                ? 'bg-blue-700 text-white shadow-lg'
                                : 'text-gray-300 hover:bg-[#003D82] hover:text-white'
                                }`}
                        >
                            <span className={`text-sm font-semibold ${isActive(item.path) ? 'tracking-wide' : ''}`}>
                                {item.label}
                            </span>
                        </Link>
                    ))}
                </nav>

                <div className="p-6 border-t border-gray-700 ">
                    <button
                        onClick={authAPI.logout}
                        className="w-full bg-[#1A1A2E] text-sm text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-all duration-300 border border-gray-600 "
                    >
                        Logout
                    </button>
                </div>
            </div>


            <div className="flex-1 flex flex-col overflow-hidden bg-white">
                <header className="bg-white px-8 py-5 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div className="flex flex-col">
                            <h2 className="text-2xl font-bold text-[#003D82]">
                                {menuItems.find(item => isActive(item.path))?.label || 'Admin'}
                            </h2>
                        </div>
                        <div className="flex items-center gap-4 bg-white-50 px-4 py-2 ">

                            <div className="flex flex-col">
                                <span className="text-sm font-semibold text-gray-800">Welcome {userName}</span>
                            </div>
                        </div>
                    </div>
                </header>

                <main className="flex-1 overflow-y-auto p-8">
                    <div className="max-w-7xl mx-auto animate-in fade-in duration-500">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;
