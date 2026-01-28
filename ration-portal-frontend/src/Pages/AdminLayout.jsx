import React from 'react'

export const AdminLayout = () => {
    return (
        <>
            {/* Not in Use This was for Demo Purpose */}
            <div className="flex min-h-screen bg-gray-100">


                <aside className="w-64 bg-blue-900 text-white p-5">
                    <h2 className="text-xl font-bold mb-6">Admin Panel</h2>

                    <nav className="space-y-3">
                        <NavLink to="/dashboard">Dashboard</NavLink>
                        <NavLink to="/shopkeepers">Shopkeepers</NavLink>
                        <NavLink to="/shops">Shops</NavLink>
                        <NavLink to="/allocate">Allocate Ration</NavLink>
                        <NavLink to="/entitlements">Entitlements</NavLink>
                        <NavLink to="/families">Families</NavLink>
                        <NavLink to="/logs">Distribution Logs</NavLink>
                    </nav>
                </aside>

            </div>
        </>
    )
}
