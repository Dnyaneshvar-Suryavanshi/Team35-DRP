import React from "react";
export default function About() {
    return (
        <div className="min-h-screen bg-gray-50">


            <div className="bg-blue-600 text-white py-12">
                <h1 className="text-3xl font-bold text-center">
                    About Ration Portal
                </h1>
                <p className="text-center mt-2 text-blue-100">
                    Transparent • Secure • Digital Ration Distribution
                </p>
            </div>

            <div className="max-w-5xl mx-auto p-6">
                <div className="bg-white rounded-lg shadow p-6">
                    <h2 className="text-2xl font-semibold mb-4 text-blue-600">
                        Our Mission
                    </h2>
                    <p className="text-gray-700 mb-4">
                        The Ration Distribution Portal is designed to bring transparency,
                        efficiency, and accountability to the public distribution system.
                        It ensures that every eligible citizen receives their entitled
                        ration without delays or misuse.
                    </p>
                    <h2 className="text-2xl font-semibold mb-4 text-blue-600">
                        What This Portal Offers
                    </h2>
                    <ul className="list-disc list-inside text-gray-700 space-y-2">
                        <li>Role-based access for Admin, Shopkeeper, and Citizen</li>
                        <li>Digital ration card management</li>
                        <li>Secure login using JWT authentication</li>
                        <li>Stock allocation and distribution tracking</li>
                        <li>Complete transparency through reports and logs</li>
                    </ul>
                    <h2 className="text-2xl font-semibold mt-6 mb-4 text-blue-600">
                        Why Digital Ration System?
                    </h2>
                    <p className="text-gray-700">
                        A digital system minimizes corruption, reduces paperwork,
                        and allows the government to monitor distribution in real-time.
                        This portal empowers citizens while simplifying administration.
                    </p>
                </div>
            </div>
        </div>
    );
}