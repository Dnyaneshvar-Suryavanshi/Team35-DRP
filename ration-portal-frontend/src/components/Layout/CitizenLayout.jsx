import { Link, useLocation, Outlet } from 'react-router-dom';
import { authAPI } from '../../api';

const CitizenLayout = () => {
    const location = useLocation();
    const userName = localStorage.getItem('userName') || 'Citizen';

    const isActive = (path) => location.pathname === path;

    const menuItems = [
        { path: '/citizen/dashboard', label: 'Dashboard' },
        { path: '/citizen/ration-card', label: 'My Ration Card' },
        { path: '/citizen/distribution-history', label: 'Distribution History' },
    ];

    return (
        <div className="flex h-screen bg-gray-100">

            <div className="w-64 bg-blue-800 text-white flex flex-col">
                <div className="p-6 border-b border-blue-700">
                    <h1 className="text-xl font-bold">Ration Portal</h1>
                    <p className="text-sm text-blue-200 mt-1">Citizen Panel</p>
                </div>

                <nav className="flex-1 p-4">
                    {menuItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`flex items-center gap-3 px-4 py-3 mb-2 rounded-lg transition ${isActive(item.path)
                                ? 'bg-blue-700 text-white'
                                : 'text-blue-100 hover:bg-blue-700'
                                }`}
                        >
                            <span className="text-xl">{item.icon}</span>
                            <span className="text-sm font-medium">{item.label}</span>
                        </Link>
                    ))}
                </nav>

                <div className="p-4 border-t border-blue-700">
                    <button
                        onClick={authAPI.logout}
                        className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg transition flex items-center justify-center gap-2"
                    >
                       
                        <span>Logout</span>
                    </button>
                </div>
            </div>

            
            <div className="flex-1 flex flex-col overflow-hidden">
               
                <header className="bg-white shadow-sm px-6 py-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-semibold text-gray-800">
                            {menuItems.find(item => isActive(item.path))?.label || 'Citizen Dashboard'}
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

export default CitizenLayout;
