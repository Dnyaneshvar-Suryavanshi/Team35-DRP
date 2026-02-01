import { Link, useLocation, Outlet } from 'react-router-dom';
import { authAPI } from '../../api';

const ShopkeeperLayout = () => {
    const location = useLocation();
    const userName = localStorage.getItem('userName') || 'Shopkeeper';

    const isActive = (path) => location.pathname === path;

    const menuItems = [
        { path: '/shopkeeper/dashboard', label: 'Shopkeeper Dashboard' },
        { path: '/shopkeeper/stock-management', label: 'Inventory History' },
        { path: '/shopkeeper/manage-citizens', label: 'Citizen List' },
        { path: '/shopkeeper/distribute-ration', label: 'Distribute Ration' },
        { path: '/shopkeeper/distribution-history', label: 'Distribution History' },
        { path: '/shopkeeper/payment-history', label: 'Payment History' },
    ];

    return (
        <div className="flex h-screen">
            {/* Sidebar */}
            <div className="w-72 bg-[#1A1A2E] text-center text-white flex flex-col min-h-screen shadow-2xl">
                <div className="p-8 border-b border-gray-700 bg-[#003D82]">
                    <h1 className="text-xl font-bold tracking-tight">RATION SAHAYATA</h1>
                    <p className="text-[10px] text-center text-gray-200 mt-1 uppercase font-bold">Shop Keeper Panel</p>
                </div>

                <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
                    {menuItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 group ${isActive(item.path)
                                ? 'bg-blue-900 text-white shadow-lg'
                                : 'text-gray-300 hover:bg-blue-700 hover:text-white'
                                }`}
                        >
                            <span className={`text-sm font-semibold ${isActive(item.path) ? 'tracking-wide' : ''}`}>
                                {item.label}
                            </span>
                        </Link>
                    ))}
                </nav>

                <div className="p-2 border-t border-gray-700 bg-blue-95 0">
                    <button
                        onClick={authAPI.logout}
                        className="w-24 bg-blue-950 text-sm text-white py-3 rounded-lg font-semibold hover:bg-blue-800 transition-all duration-300 border border-gray-600"
                    >
                        Logout
                    </button>
                </div>
            </div>


            <div className="flex-1 flex flex-col overflow-hidden">
                <header className="bg-white border-b-2 px-8 py-5 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div className="flex flex-col">
                            <h2 className="text-2xl font-bold text-[#003D82] tracking-tight">
                                {menuItems.find(item => isActive(item.path))?.label || 'Operations Center'}
                            </h2>
                        </div>
                        <div className="flex items-center gap-4 bg-gray-50 px-4 py-2">
                            {/* <div className="w-8 h-8 bg-[#003D82] rounded-full flex items-center justify-center">
                                <span className="text-white text-xs font-bold">{userName.charAt(0)}</span>
                            </div> */}
                            <div className="flex flex-col">
                                {/* <span className="text-[10px] text-gray-400 font-bold uppercase">Authorized Seller</span> */}
                                <span className="text-sm font-bold text-gray-800">Welcome {userName}</span>
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

export default ShopkeeperLayout;
