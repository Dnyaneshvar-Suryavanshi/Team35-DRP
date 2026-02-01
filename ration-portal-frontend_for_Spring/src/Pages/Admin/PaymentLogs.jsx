import { useState, useEffect } from 'react';
import { adminAPI } from '../../api';
import DataTable from '../../components/DataTable';

const PaymentLogs = () => {
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchPayments();
    }, []);

    const fetchPayments = async () => {
        try {
            const data = await adminAPI.getAllPayments(); // Ensure this matches API method
            setPayments(data || []);
        } catch (error) {
            console.error('Error fetching payments:', error);
        } finally {
            setLoading(false);
        }
    };

    const columns = [
        { key: 'transactionId', label: 'Txn ID' },
        {
            key: 'timestamp',
            label: 'Date & Time',
            render: (row) => new Date(row.timestamp).toLocaleString()
        },
        { key: 'citizenName', label: 'Citizen Name' },
        {
            key: 'shopkeeperId',
            label: 'Shop ID',
            render: (row) => row.shopkeeperId
        },
        { key: 'amount', label: 'Amount (₹)' },
        {
            key: 'paymentMethod',
            label: 'Method',
            render: (row) => (
                <span className={`px-2 py-1 rounded text-xs font-bold ${row.paymentMethod === 'UPI' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>
                    {row.paymentMethod}
                </span>
            )
        }
    ];

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="border-b-2 border-[#FFFBF0] pb-4">
                <h2 className="text-2xl font-bold text-[#003D82]">Global Payment Logs</h2>
                <p className="text-gray-500 mt-1">Track all payments across all shops</p>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                {loading ? (
                    <div className="flex justify-center items-center h-40">Loading...</div>
                ) : (
                    <DataTable columns={columns} data={payments} />
                )}
            </div>
        </div>
    );
};

export default PaymentLogs;
