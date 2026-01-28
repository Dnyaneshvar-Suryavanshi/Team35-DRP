import { useEffect, useState } from 'react';
import { shopkeeperAPI } from '../../api';
import { toast } from 'react-toastify';
import DataTable from '../../components/DataTable';
import { getUserId } from '../../utils/authUtils';

const StockManagement = () => {
    const [allocations, setAllocations] = useState([]);
    const [currentStock, setCurrentStock] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const shopkeeperId = getUserId();
            const shop = await shopkeeperAPI.getMyShop(shopkeeperId);

            if (shop && shop.shopId) {
                const [allocs, stock] = await Promise.all([
                    shopkeeperAPI.getMyAllocations(shopkeeperId),
                    shopkeeperAPI.viewCurrentStock(shop.shopId),
                ]);
                setAllocations(allocs || []);
                setCurrentStock(stock || []);
            }
        } catch (error) {
            console.error('Error fetching stock data:', error);
            toast.error('Failed to load stock data');
        } finally {
            setLoading(false);
        }
    };

    const handleConfirmStock = async () => {
        const pendingCount = allocations.filter(a => a.status === 'Pending').length;
        if (pendingCount === 0) {
            toast.info('No pending allocations to confirm');
            return;
        }

        if (!confirm(`Confirm all ${pendingCount} pending allocations?`)) return;

        try {
            const shopkeeperId = getUserId();
            await shopkeeperAPI.confirmAllPendingStock(shopkeeperId);
            toast.success('Stock confirmed successfully');
            fetchData();
        } catch (error) {
            console.error('Error confirming stock:', error);
            toast.error(error.response?.data?.message || 'Failed to confirm stock');
        }
    };
    const receiveStockes = async (shopkeeperId) => {

        try {
            await shopkeeperAPI.confirmAllPendingStock(shopkeeperId)

        }
        catch (error) {
            console.error('Error confirming stock:', error);
            // toast.error(error.response?.data?.message || 'Failed to confirm stock');
        }

    }

    const allocationColumns = [
        { key: 'allocationId', label: 'ID' },
        { key: 'grain', label: 'Grain Type' },
        {
            key: 'quantityAllocated',
            label: 'Quantity (kg)',
            render: (row) => `${row.quantityAllocated} kg`,
        },
        {
            key: 'allocatedDate',
            label: 'Allocated On',
            render: (row) => new Date(row.allocatedDate).toLocaleDateString(),
        },
        {
            key: 'status',
            label: 'Status',
            render: (row) => (
                <button
                    className={`px-3 py-1 rounded-full text-xs font-medium ${row.status === 'Completed'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                        }`}
                    onClick={receiveStockes(row.shopkeeperId)}
                >
                    {row.status}
                </button>
            ),
        },
    ];

    const pendingAllocations = allocations.filter(a => a.status === 'Pending');

    if (loading) {
        return <div className="text-center text-gray-600">Loading...</div>;
    }

    return (
        <div>

            {/* Pending Allocations */}
            {pendingAllocations.length > 0 && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h4 className="font-semibold text-yellow-800">Pending Allocations</h4>
                            <p className="text-sm text-yellow-700 mt-1">
                                You have {pendingAllocations.length} pending stock allocations. Confirm to add them to your current stock.
                            </p>
                        </div>
                        <button
                            onClick={handleConfirmStock}
                            className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition"
                        >
                            Confirm All
                        </button>
                    </div>
                </div>
            )}

            {/* Allocations Table */}
            <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-700 mb-4">Stock Allocation History</h3>
                <DataTable columns={allocationColumns} data={allocations} />
            </div>
        </div>
    );
};

export default StockManagement;
