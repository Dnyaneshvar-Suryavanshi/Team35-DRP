import { Link, useLocation, Outlet } from 'react-router-dom';
import { authAPI } from '../../api';

const AdminLayout = () => {
    const location = useLocation();
    const userName = localStorage.getItem('userName') || 'Admin';

    const isActive = (path) => location.pathname === path;

    const menuItems = [
        { path: '/admin/dashboard', label: 'Dashboard' },
        { path: '/admin/pending-shopkeepers', label: 'Pending Shopkeepers' },
        { path: '/admin/manage-shops', label: 'Manage Shops' },
        { path: '/admin/allocate-stock', label: 'Allocate Stock' },
        { path: '/admin/monthly-entitlement', label: 'Monthly Entitlement' },
        { path: '/admin/view-families', label: 'View Families' },
        { path: '/admin/distribution-logs', label: 'Distribution Logs' },
        { path: '/admin/distribution-logs-summary', label: 'Distribution Report' },
    ];

    return (
        <div className="flex h-screen bg-gray-100">
            <div className="w-64 bg-blue-600 text-white flex flex-col min-h-screen">

                <div className="p-6 border-b border-indigo-700">
                    <h1 className="text-xl font-bold">Ration Portal</h1>
                    <p className="text-sm text-indigo-200 mt-1">Admin Panel</p>
                </div>


                <nav className="flex-1 px-4 py-4">
                    {menuItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`flex items-center gap-3 px-4 py-3 mb-1 rounded-lg transition ${isActive(item.path) ? 'bg-blue-700 text-white' : 'text-indigo-100'
                                }`}
                        >
                            <span className="text-xl">{item.icon}</span>
                            <span className="text-sm font-medium">{item.label}</span>
                        </Link>
                    ))}
                </nav>


                <div className="p-4 border-t border-indigo-700">
                    <button
                        onClick={authAPI.logout}
                        className="w-full bg-blue-950 text-sm text-white py-2 rounded-lg transition flex items-center justify-center gap-2"
                    >
                        <span>Logout</span>
                    </button>
                </div>
            </div>



            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Header */}
                <header className="bg-white shadow-sm px-6 py-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-semibold text-gray-800">
                            {menuItems.find(item => isActive(item.path))?.label || 'Admin Dashboard'}
                        </h2>
                        <div className="flex items-center gap-2">
                            <span className="text-gray-600">Welcome,</span>
                            <span className="font-semibold text-gray-800">{userName}</span>
                        </div>
                    </div>
                </header>


                <main className="flex-1 overflow-y-auto p-6">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;
