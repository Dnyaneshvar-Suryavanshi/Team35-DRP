import { useEffect, useState } from 'react';
import { adminAPI } from '../../api';
import { toast } from 'react-toastify';
import DataTable from '../../components/DataTable';
import { Navigate, useNavigate } from 'react-router-dom';

const DistributionLogs = () => {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchLogs();
    }, []);

    const fetchLogs = async () => {
        try {
            const data = await adminAPI.getAllDistributionLogs();
            setLogs(data || []);
        } catch (error) {
            console.error('Error fetching distribution logs:', error);
            toast.error('Failed to load distribution logs');
        } finally {
            setLoading(false);
        }
    };
    const navigate = useNavigate();
    const handleNavigate = (id) => {
        // navigate to a details page for this row
        navigate(`/admin/distribution-logs/distribution-details/${id}`);
    };

    const columns = [
        { key: 'distributionId', label: 'ID' },
        {
            key: 'distributionDate',
            label: 'Date',
            render: (row) => new Date(row.distributionDate).toLocaleDateString(),
        },
        { key: 'cardNumber', label: 'Card Number' },
        // {
        //     key: 'rationCard',
        //     label: 'Family Head',
        //     render: (row) => row.rationCard?.headOfFamilyName || 'N/A',
        // },
        { key: 'grain', label: 'Grain' },
        {
            key: 'quantityGiven',
            label: 'Quantity (kg)',
            render: (row) => `${row.quantityGiven} kg`,
        },
        // {
        //     key: 'shop',
        //     label: 'Shop',
        //     render: (row) => row.shop?.shopName || 'N/A',
        // },
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
        {
            key: 'Info',
            label: 'More Info',
            render: (row) => (
                <button
                    onClick={() => handleNavigate(row.distributionId)}
                    className="text-blue-600 hover:underline text-sm"
                >
                    View Details
                </button>
            ),
        },
    ];

    if (loading) {
        return <div className="text-center text-gray-600">Loading...</div>;
    }

    return (
        <div>
            <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-700">Distribution Logs</h3>
                <p className="text-sm text-gray-500 mt-1">View complete distribution history across all shops</p>
            </div>

            {/* <div className="bg-white rounded-lg shadow-md p-4 mb-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                    <div className="bg-green-50 p-4 rounded-lg">
                        <p className="text-sm text-gray-600">Total Distributions</p>
                        <p className="text-2xl font-bold text-green-600">{logs.length}</p>
                    </div>
                    <div className="bg-blue-50 p-4 rounded-lg">
                        <p className="text-sm text-gray-600">Total Quantity</p>
                        <p className="text-2xl font-bold text-blue-600">
                            {logs.reduce((sum, log) => sum + log.quantityGiven, 0).toFixed(2)} kg
                        </p>
                    </div>
                    <div className="bg-purple-50 p-4 rounded-lg">
                        <p className="text-sm text-gray-600">This Month</p>
                        <p className="text-2xl font-bold text-purple-600">
                            {logs.filter(log => {
                                const logDate = new Date(log.distributionDate);
                                const now = new Date();
                                return logDate.getMonth() === now.getMonth() && logDate.getFullYear() === now.getFullYear();
                            }).length}
                        </p>
                    </div>
                </div>
            </div> */}

            <DataTable
                columns={columns}
                data={logs}
                searchable
                searchPlaceholder="Search by card number, grain type, shop..."
            />
        </div>
    );
};

export default DistributionLogs;
