import { useEffect, useState } from 'react';
import { adminAPI } from '../../api';
import { toast } from 'react-toastify';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const DistributionSummary = () => {
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

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#003D82]"></div>
            </div>
        );
    }

    const totalQuantity = logs.reduce((sum, log) => sum + (log.quantityGiven || 0), 0);
    const thisMonthLogs = logs.filter(log => {
        const logDate = new Date(log.distributionDate);
        const now = new Date();
        return logDate.getMonth() === now.getMonth() && logDate.getFullYear() === now.getFullYear();
    });

    return (
        <div className="animate-in fade-in duration-500">
            <div className="mb-8 border-b-2 border-[#FFFBF0] pb-6">
                <h3 className="text-2xl font-bold text-[#003D82]">Distribution Analytics</h3>

            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                <SummaryCard
                    label="Volume Distributed"
                    value={`${totalQuantity.toFixed(2)} KG`}
                    subtext="Total Aggregate Output"
                    color="text-[#003D82]"

                />
                <SummaryCard
                    label="Transaction Count"
                    value={logs.length}
                    subtext="Total Successful Dispatches"
                    color="text-[#FF6B35]"

                />
                <SummaryCard
                    label="Monthly Velocity"
                    value={thisMonthLogs.length}
                    subtext="Active Distribution This Month"
                    color="text-green-700"

                />
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 p-10 shadow-sm relative overflow-hidden flex flex-col md:flex-row gap-8">
                <div className="flex-1">
                    <h4 className="text-lg font-bold text-gray-700 mb-6">Grain Distribution Breakdown</h4>
                    <div className="h-64 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={Object.entries(logs.reduce((acc, log) => {
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
                                    {Object.entries(logs.reduce((acc, log) => {
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
        </div>
    );
};

const SummaryCard = ({ label, value, subtext, color, icon }) => (
    <div className="bg-white p-8 rounded-2xl border-2 border-gray-200 shadow-xl hover:shadow-2xl transition-all duration-300 group">
        <div className="flex justify-between items-start mb-4">
            <span className="text-l font-bold text-gray-600 ">{label}</span>
            <span className="text-2xl group-hover:scale-125 transition-transform">{icon}</span>
        </div>
        <div className={`text-4xl font-bold ${color} tracking-tight mb-2 uppercase`}>{value}</div>
        <p className="text-xs font-medium text-gray-400">{subtext}</p>
    </div>
);

export default DistributionSummary;
