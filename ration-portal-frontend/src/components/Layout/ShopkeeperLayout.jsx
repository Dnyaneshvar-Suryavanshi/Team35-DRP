import { Link, useLocation, Outlet } from 'react-router-dom';
import { authAPI } from '../../api';

const ShopkeeperLayout = () => {
    const location = useLocation();
    const userName = localStorage.getItem('userName') || 'Shopkeeper';

    const isActive = (path) => location.pathname === path;

    const menuItems = [
        { path: '/shopkeeper/dashboard', label: 'Dashboard' },
        { path: '/shopkeeper/stock-management', label: 'Stock Management' },
        { path: '/shopkeeper/manage-citizens', label: 'Manage Citizens' },
        { path: '/shopkeeper/distribute-ration', label: 'Distribute Ration' },
        { path: '/shopkeeper/distribution-history', label: 'Distribution History' },
    ];

    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar */}
            <div className="w-64 bg-blue-800 text-white flex flex-col">
                <div className="p-6 border-b border-green-700">
                    <h1 className="text-xl font-bold">Ration Portal</h1>
                    <p className="text-sm text-green-200 mt-1">Shopkeeper Panel</p>
                </div>

                <nav className="flex-1 p-4">
                    {menuItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`flex items-center gap-3 px-4 py-3 mb-2 rounded-lg transition ${isActive(item.path)
                                ? 'bg-blue-700 text-white'
                                : 'text-green-100 hover:bg-blue-900'
                                }`}
                        >
                            <span className="text-xl">{item.icon}</span>
                            <span className="text-sm font-medium">{item.label}</span>
                        </Link>
                    ))}
                </nav>

                <div className="p-4 border-t border-green-700">
                    <button
                        onClick={authAPI.logout}
                        className="w-full bg-blue-950 text-white px-4 py-2 rounded-lg transition flex items-center justify-center gap-2"
                    >

                        <span>Logout</span>
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Header */}
                <header className="bg-white shadow-sm px-6 py-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-semibold text-gray-800">
                            {menuItems.find(item => isActive(item.path))?.label || 'Shopkeeper Dashboard'}
                        </h2>
                        <div className="flex items-center gap-2">
                            <span className="text-gray-600">Welcome,</span>
                            <span className="font-semibold text-gray-800">{userName}</span>
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 overflow-y-auto p-6">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default ShopkeeperLayout;
