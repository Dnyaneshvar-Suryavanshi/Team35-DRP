import { shopkeeperAPI } from '../../api';
import { toast } from 'react-toastify';
import DataTable from '../../components/DataTable';
import { getUserId } from '../../utils/authUtils';
import { useEffect, useState } from 'react';

const DistributionHistory = () => {
    const [distributions, setDistributions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDistributions();
    }, []);

    const fetchDistributions = async () => {
        try {
            const shopkeeperId = getUserId();
            const data = await shopkeeperAPI.getDistributionHistory(shopkeeperId);
            setDistributions(data || []);
        } catch (error) {
            console.error('Error fetching distribution history:', error);
            toast.error('Failed to load distribution history');
        } finally {
            setLoading(false);
        }
    };

    const columns = [
        { key: 'distributionId', label: 'ID' },
        {
            key: 'distributionDate',
            label: 'Date',
            render: (row) => new Date(row.distributionDate).toLocaleDateString(),
        },
        { key: 'cardNumber', label: 'Card Number' },
        {
            key: 'headOfFamily',
            label: 'Family Head',
        },
        { key: 'grain', label: 'Grain Type' },
        {
            key: 'quantityGiven',
            label: 'Quantity (kg)',
            render: (row) => `${row.quantityGiven} kg`,
        },
        {
            key: 'status',
            label: 'Status',
            render: (row) => (
                <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${row.status === 'Success'
                        ? 'bg-green-100 text-green-800'
                        : row.status === 'Pending'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                >
                    {row.status}
                </span>
            ),
        },
    ];

    if (loading) {
        return <div className="text-center text-gray-600">Loading...</div>;
    }

    return (
        <div>
            <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-700">Distribution History</h3>
                <p className="text-sm text-gray-500 mt-1">View all ration distributions from your shop</p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-4 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                    <div className="bg-blue-50 p-4 rounded-lg">
                        <p className="text-sm text-gray-600">Total Distributions</p>
                        <p className="text-2xl font-bold text-blue-600">{distributions.length}</p>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg">
                        <p className="text-sm text-gray-600">Total Quantity</p>
                        <p className="text-2xl font-bold text-green-600">
                            {distributions.reduce((sum, d) => sum + (d.quantityGiven || 0), 0).toFixed(2)} kg
                        </p>
                    </div>
                    <div className="bg-purple-50 p-4 rounded-lg">
                        <p className="text-sm text-gray-600">This Month</p>
                        <p className="text-2xl font-bold text-purple-600">
                            {distributions.filter(d => {
                                const distDate = new Date(d.distributionDate);
                                const now = new Date();
                                return distDate.getMonth() === now.getMonth() && distDate.getFullYear() === now.getFullYear();
                            }).length}
                        </p>
                    </div>
                </div>
            </div>

            <DataTable
                columns={columns}
                data={distributions}
                searchable
                searchPlaceholder="Search by card number or grain type..."
            />
        </div>
    );
};

export default DistributionHistory;
