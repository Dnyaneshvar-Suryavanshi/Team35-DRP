import { shopkeeperAPI } from '../../api';
import { toast } from 'react-toastify';
import DataTable from '../../components/DataTable';
import { getUserId } from '../../utils/authUtils';
import { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

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
        {
            key: 'distributionId',
            label: 'Transaction ID',
            render: (row) => <span className="font-mono text-gray-400 font-bold">{row.distributionId}</span>
        },
        {
            key: 'distributionDate',
            label: 'Timestamp',
            render: (row) => <span className="text-xs font-medium text-gray-500">{new Date(row.distributionDate).toLocaleDateString()}</span>,
        },
        {
            key: 'cardNumber',
            label: 'Ration Card ID',
            render: (row) => <span className="font-bold ">{row.cardNumber}</span>
        },
        {
            key: 'headOfFamily',
            label: 'Beneficiary',
            render: (row) => <span className="font-bold text-gray-800">{row.headOfFamily || 'N/A'}</span>
        },
        {
            key: 'grain',
            label: 'Commodity',
            render: (row) => <span className="text-[12px] font-bold uppercase tracking-widest text-[#1A1A2E]">{row.grain}</span>
        },
        {
            key: 'quantityGiven',
            label: 'Net Weight',
            render: (row) => <span className="font-mono font-bold text-gray-900">{row.quantityGiven} KG</span>,
        },
        {
            key: 'status',
            label: 'Audit Status',
            render: (row) => {
                const isSuccess = row.status === 'Success' || row.status === 'SUCCESS';
                return (
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${isSuccess ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {row.status || 'Verified'}
                    </span>
                );
            },
        },
    ];

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#003D82]"></div>
            </div>
        );
    }

    const totalQuantity = distributions.reduce((sum, d) => sum + (d.quantityGiven || 0), 0);
    const thisMonthLogs = distributions.filter(d => {
        const distDate = new Date(d.distributionDate);
        const now = new Date();
        return distDate.getMonth() === now.getMonth() && distDate.getFullYear() === now.getFullYear();
    });

    return (
        <div className="animate-in fade-in duration-500">
            <div className="mb-8 border-b-1 pb-6">
                <h3 className="text-2xl font-bold text-[#003D82]">Distribution Records</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                <SummaryCard
                    label="Aggregate Volume"
                    value={`${totalQuantity.toFixed(2)} KG`}
                    color="text-[#003D82]"
                />
                <SummaryCard
                    label="Lifetime Dispatches"
                    value={distributions.length}
                    color="text-[#FF6B35]"
                />
                <SummaryCard
                    label="Current Month Velocity"
                    value={thisMonthLogs.length}

                    color="text-green-700"
                />
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col md:flex-row gap-8 p-6 mb-8">
                <div className="flex-1">
                    <h4 className="text-lg font-bold text-gray-700 mb-6">Commodity Analysis</h4>
                    <div className="h-64 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={Object.entries(distributions.reduce((acc, log) => {
                                        acc[log.grain] = (acc[log.grain] || 0) + log.quantityGiven;
                                        return acc;
                                    }, {})).map(([name, value]) => ({ name, value }))}
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={80}
                                    fill="#8884d8"
                                    dataKey="value"
                                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                >
                                    {Object.entries(distributions.reduce((acc, log) => {
                                        acc[log.grain] = (acc[log.grain] || 0) + log.quantityGiven;
                                        return acc;
                                    }, {})).map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={['#0088FE', '#00C49F', '#FFBB28', '#FF8042'][index % 4]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="px-8 py-5 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
                    <h4 className="text-sm font-bold text-gray-400  ">Transaction Records</h4>
                </div>
                <DataTable
                    columns={columns}
                    data={distributions}
                    searchable
                    searchPlaceholder="Filter ledger by card ID, beneficiary or commodity..."
                />
            </div>
        </div>
    );
};

const SummaryCard = ({ label, value, icon, color }) => (
    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-md flex items-center gap-5 group hover:shadow-xl transition-all duration-300">
        <div className="text-4xl group-hover:scale-110 transition-transform">{icon}</div>
        <div>
            <p className="text-[10px] text-gray-400 uppercase font-bold tracking-widest mb-1">{label}</p>
            <p className={`text-3xl font-bold ${color} tracking-tight`}>{value}</p>
        </div>
    </div>
);

export default DistributionHistory;
