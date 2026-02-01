import { useState, useEffect } from 'react';
import { shopkeeperAPI } from '../../api';
import DataTable from '../../components/DataTable';
import { toast } from 'react-toastify';

const PaymentHistory = () => {
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchPayments();
    }, []);

    const fetchPayments = async () => {
        try {
            const data = await shopkeeperAPI.getPaymentHistory();
            setPayments(data || []);
        } catch (error) {
            console.error('Error fetching payments:', error);
            // toast.error('Failed to load payment history');
        } finally {
            setLoading(false);
        }
    };

    const handlePrint = (payment) => {
        // Create a printable window
        const printWindow = window.open('', '', 'height=600,width=800');
        printWindow.document.write('<html><head><title>Payment Receipt</title>');
        printWindow.document.write('<style>');
        printWindow.document.write(`
            body { font-family: 'Courier New', Courier, monospace; padding: 20px; }
            .receipt { border: 2px dashed #333; padding: 20px; max-width: 400px; margin: 0 auto; }
            .header { text-align: center; border-bottom: 2px solid #333; padding-bottom: 10px; margin-bottom: 20px; }
            .row { display: flex; justify-content: space-between; margin-bottom: 10px; }
            .total { font-weight: bold; border-top: 1px solid #333; padding-top: 10px; margin-top: 10px; }
            .footer { text-align: center; margin-top: 20px; font-size: 12px; }
        `);
        printWindow.document.write('</style></head><body>');
        printWindow.document.write(`
            <div class="receipt">
                <div class="header">
                    <h2>RATION RECEIPT</h2>
                    <p>Transaction ID: ${payment.transactionId}</p>
                </div>
                <div class="row">
                    <span>Date:</span>
                    <span>${new Date(payment.timestamp).toLocaleString()}</span>
                </div>
                <div class="row">
                    <span>Citizen Name:</span>
                    <span>${payment.citizenName}</span>
                </div>
                <div class="row">
                    <span>Method:</span>
                    <span>${payment.paymentMethod}</span>
                </div>
                 <div class="row total">
                    <span>AMOUNT PAID:</span>
                    <span>₹${payment.amount}</span>
                </div>
                <div class="footer">
                    <p>Thank you for using Ration Sahayata.</p>
                </div>
            </div>
        `);
        printWindow.document.write('</body></html>');
        printWindow.document.close();
        printWindow.print();
    };

    const columns = [
        { key: 'transactionId', label: 'Txn ID' },
        {
            key: 'timestamp',
            label: 'Date & Time',
            render: (row) => new Date(row.timestamp).toLocaleString()
        },
        { key: 'citizenName', label: 'Citizen Name' },
        { key: 'amount', label: 'Amount (₹)' },
        {
            key: 'paymentMethod',
            label: 'Method',
            render: (row) => (
                <span className={`px-2 py-1 rounded text-xs font-bold ${row.paymentMethod === 'UPI' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>
                    {row.paymentMethod}
                </span>
            )
        },
        {
            key: 'action',
            label: 'Receipt',
            render: (row) => (
                <button
                    onClick={() => handlePrint(row)}
                    className="bg-gray-800 text-white px-3 py-1 rounded text-sm hover:bg-black transition-colors"
                >
                    Print
                </button>
            )
        }
    ];

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="border-b-2 border-[#FFFBF0] pb-4">
                <h2 className="text-2xl font-bold text-[#003D82]">Payment History</h2>
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

export default PaymentHistory;
