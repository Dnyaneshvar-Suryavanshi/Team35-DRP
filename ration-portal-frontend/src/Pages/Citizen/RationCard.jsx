import { citizenAPI } from '../../api';
import { toast } from 'react-toastify';
import { getUserEmail } from '../../utils/authUtils';
import { useEffect, useState } from 'react';

const RationCard = () => {
    const [rationCard, setRationCard] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchRationCard();
    }, []);

    const fetchRationCard = async () => {
        try {
            const email = getUserEmail();
            const data = await citizenAPI.getMyRationCard(email);
            setRationCard(data);
        } catch (error) {
            console.error('Error fetching ration card:', error);
            toast.error('Failed to load ration card');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div className="text-center text-gray-600">Loading...</div>;
    }

    if (!rationCard) {
        return (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-yellow-800 mb-2">No Ration Card Found</h3>
                <p className="text-yellow-700">
                    You haven't been registered under any shop yet.
                </p>
            </div>
        );
    }

    return (
        <div>
            <div className="bg-white rounded-lg shadow-md p-8 max-w-3xl mx-auto">
                <div className="border-4 border-green-600 rounded-lg p-6">

                    <div className="text-center border-b-2 border-gray-300 pb-4 mb-6">
                        <h2 className="text-2xl font-bold text-green-800">My Details</h2>
                        <p className="text-sm text-gray-600 mt-1">Digital Ration Portal</p>
                    </div>


                    {/* <div className="bg-green-50 border-2 border-green-600 rounded-lg p-4 mb-6 text-center">
                        <p className="text-sm text-gray-600 mb-1">Card Number</p>
                        <p className="text-3xl font-bold text-green-800 tracking-wider">{rationCard.cardNumber}</p>
                    </div> */}

                    {/* Card Details */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <p className="text-sm text-gray-600 mb-1">Head of Family</p>
                            <p className="text-lg font-semibold text-gray-900">{rationCard.headOfFamilyName}</p>
                        </div>

                        <div >
                            <p className="text-sm text-gray-600 mb-1">Card Number</p>
                            <p className="text-lg font-semibold text-gray-900">{rationCard.cardNumber}</p>
                        </div>

                        <div>
                            <p className="text-sm text-gray-600 mb-1">Family Members</p>
                            <p className="text-lg font-semibold text-gray-900">{rationCard.familyMemberCount}</p>
                        </div>

                        <div className="md:col-span-2">
                            <p className="text-sm text-gray-600 mb-1">Address</p>
                            <p className="text-lg font-medium text-gray-900">{rationCard.address}</p>
                        </div>

                        <div>
                            <p className="text-sm text-gray-600 mb-1">Shop Name</p>
                            <p className="text-lg font-medium text-gray-900">{rationCard.shopName || 'N/A'}</p>
                        </div>

                        <div>
                            <p className="text-sm text-gray-600 mb-1">Shop Location</p>
                            <p className="text-lg font-medium text-gray-900">{rationCard.shopLocation || 'N/A'}</p>
                        </div>

                        <div>
                            <p className="text-sm text-gray-600 mb-1">Issue Date</p>
                            <p className="text-lg font-medium text-gray-900">
                                {new Date(rationCard.issueDate).toLocaleDateString()}
                            </p>
                        </div>

                        <div>
                            <p className="text-sm text-gray-600 mb-1">Status</p>
                            <span className={`inline-block px-4 py-2 rounded-full text-sm font-semibold ${rationCard.status === 'Active'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-gray-100 text-gray-800'
                                }`}>
                                {rationCard.status}
                            </span>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="border-t-2 border-gray-300 mt-6 pt-4 text-center">

                    </div>
                </div>

                {/* <div className="mt-6 text-center">
                    <button
                        onClick={() => window.print()}
                        className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
                    >
                        Print Ration Card
                    </button>
                </div> */}
            </div>
        </div>
    );
};

export default RationCard;
