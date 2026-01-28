import { useEffect, useState } from 'react';
import { adminAPI } from '../../api';
import { toast } from 'react-toastify';
import DataTable from '../../components/DataTable';

const PendingShopkeepers = () => {
    const [shopkeepers, setShopkeepers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchPendingShopkeepers();
    }, []);

    const fetchPendingShopkeepers = async () => {
        try {
            const data = await adminAPI.getPendingShopkeepers();
            setShopkeepers(data || []);
        } catch (error) {
            console.error('Error fetching pending shopkeepers:', error);
            toast.error('Failed to load pending shopkeepers');
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (shopkeeperId) => {
        if (!confirm('Are you sure you want to approve this shopkeeper?')) return;

        try {
            await adminAPI.approveShopkeeper(shopkeeperId);
            toast.success('Shopkeeper approved successfully');
            fetchPendingShopkeepers(); // Refresh list
        } catch (error) {
            console.error('Error approving shopkeeper:', error);
            toast.error(error.response?.data?.message || 'Failed to approve shopkeeper');
        }
    };

    const columns = [
        { key: 'userId', label: 'ID' },
        { key: 'name', label: 'Name' },
        { key: 'email', label: 'Email' },
        {
            key: 'createdAt',
            label: 'Registered On',
            render: (row) => new Date(row.createdAt).toLocaleDateString(),
        },
        {
            key: 'actions',
            label: 'Actions',
            render: (row) => (
                <button
                    onClick={() => handleApprove(row.userId)}
                    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
                >
                    Approve
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
                <h3 className="text-lg font-semibold text-gray-700">
                    Pending Shopkeeper Approvals
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                    Review and approve shopkeeper account requests
                </p>
            </div>

            {shopkeepers.length === 0 ? (
                <div className="bg-white rounded-lg shadow-md p-8 text-center">
                    <p className="text-gray-500">No pending shopkeeper approvals</p>
                </div>
            ) : (
                <DataTable columns={columns} data={shopkeepers} searchable searchPlaceholder="Search by name or email..." />
            )}
        </div>
    );
};

export default PendingShopkeepers;
