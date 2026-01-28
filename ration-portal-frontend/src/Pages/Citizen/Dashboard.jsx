import { useEffect, useState } from 'react';
import { citizenAPI, adminAPI } from '../../api';
import { toast } from 'react-toastify';
import { getUserEmail } from '../../utils/authUtils';

const CitizenDashboard = () => {
    const [rationCard, setRationCard] = useState(null);
    const [entitlements, setEntitlements] = useState([]);
    // const [distributions, setDistributions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            const email = getUserEmail();

            // First get ration card to get cardNumber
            const card = await citizenAPI.getMyRationCard(email);
            setRationCard(card);

            if (card && card.cardNumber) {
                const [allEntitlements, dists] = await Promise.all([
                    adminAPI.getAllEntitlements(),
                    citizenAPI.getMyDistributions(card.cardNumber),
                ]);

                setEntitlements(allEntitlements || []);
                // setDistributions(dists || []);
            }
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
            toast.error('Failed to load dashboard data');
        } finally {
            setLoading(false);
        }
    };

    // const recentDistributions = distributions.slice(0, 5);s

    if (loading) {
        return <div className="text-center text-gray-600">Loading dashboard...</div>;
    }

    if (!rationCard) {
        return (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-yellow-800 mb-2">No Ration Card Found</h3>
                <p className="text-yellow-700">
                    You haven't been registered under any shop yet. Please contact your local ration shop to register.
                </p>
            </div>
        );
    }

    return (
        <div>

            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">My Ration Card</h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                        <p className="text-sm text-gray-600">Card Number</p>
                        <p className="text-lg font-semibold text-gray-900">{rationCard.cardNumber}</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-600">Head of Family</p>
                        <p className="text-lg font-semibold text-gray-900">{rationCard.headOfFamilyName}</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-600">Family Members</p>
                        <p className="text-lg font-semibold text-gray-900">{rationCard.familyMemberCount}</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-600">Status</p>
                        <span className="inline-block px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                            {rationCard.status}
                        </span>
                    </div>
                </div>
            </div>

            {/* Shop Information */}
            {/* <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Shop Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <p className="text-sm text-gray-600">Shop Name</p>
                        <p className="text-lg font-medium text-gray-900">{rationCard.shop?.shopName || 'N/A'}</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-600">Location</p>
                        <p className="text-lg font-medium text-gray-900">{rationCard.shop?.location || 'N/A'}</p>
                    </div>
                </div>
            </div> */}

            {/* Monthly Entitlements */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Monthly Entitlement (Current Month)</h3>
                {entitlements.length === 0 ? (
                    <p className="text-gray-500 text-center py-4">No entitlements set for this month</p>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        {entitlements.map((ent) => {
                            const totalQty = ent.quantityPerPerson * rationCard.familyMemberCount;
                            return (
                                <div key={ent.entitlementId} className="border border-gray-200 rounded-lg p-4 text-center bg-gray-50">
                                    <p className="text-sm text-gray-600 mb-1">{ent.grainType}</p>
                                    <p className="text-2xl font-bold text-gray-900">{totalQty}</p>
                                    <p className="text-xs text-gray-500 mt-1">kg ({ent.quantityPerPerson} kg/person)</p>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>


            {/* <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Distributions</h3>
                {recentDistributions.length === 0 ? (
                    <p className="text-gray-500 text-center py-4">No distributions yet</p>
                ) : (
                    <div className="space-y-3">
                        {recentDistributions.map((dist) => (
                            <div key={dist.distributionId} className="flex items-center justify-between border-b pb-3">
                                <div>
                                    <p className="font-medium text-gray-900">{dist.grain}</p>
                                    <p className="text-sm text-gray-500">
                                        {new Date(dist.distributionDate).toLocaleDateString()}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="font-semibold text-gray-900">{dist.quantityGiven} kg</p>
                                    <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-800">
                                        {dist.status}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
                {distributions.length > 5 && (
                    <div className="mt-4 text-center">
                        <a href="/citizen/distribution-history" className="text-blue-600 hover:underline text-sm">
                            View All Distributions
                        </a>
                    </div>
                )}
            </div> */}
        </div>
    );
};

export default CitizenDashboard;
