import { useEffect, useState } from 'react';
import { adminAPI } from '../../api';
import { toast } from 'react-toastify';
import { Chart } from "react-google-charts";

const DistributionSummary = () => {
    const [logs, setLogs] = useState([]);
    const [allocations, setAllocations] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [logsData, allocationsData] = await Promise.all([
                adminAPI.getAllDistributionLogs(),
                adminAPI.getAllAllocations()
            ]);
            setLogs(logsData || []);
            setAllocations(allocationsData || []);
        } catch (error) {
            console.error('Error fetching analytics data:', error);
            toast.error('Failed to load distribution analytics');
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

    // Process Data for Calculations
    const totalQuantity = logs.reduce((sum, log) => sum + (log.quantityGiven || 0), 0);
    const thisMonthLogs = logs.filter(log => {
        const logDate = new Date(log.distributionDate);
        const now = new Date();
        return logDate.getMonth() === now.getMonth() && logDate.getFullYear() === now.getFullYear();
    });

    // Process Data for Google Chart (Last 6 Months)
    const chartData = (() => {
        const months = [];
        const today = new Date();

        for (let i = 5; i >= 0; i--) {
            const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
            const monthName = d.toLocaleString('default', { month: 'short' });
            const year = d.getFullYear();
            const label = `${monthName} ${year}`;

            // Filter Logs for this month
            const distributedInMonth = logs.filter(log => {
                const logDate = new Date(log.distributionDate);
                if (isNaN(logDate.getTime())) return false;
                return logDate.getMonth() === d.getMonth() && logDate.getFullYear() === year;
            }).reduce((sum, log) => {
                const val = Number(log.quantityGiven);
                return sum + (isNaN(val) ? 0 : val);
            }, 0);

            // Filter Allocations for this month
            const monthStr = `${year}-${String(d.getMonth() + 1).padStart(2, '0')}`;
            const allocatedInMonth = allocations.filter(alloc =>
                alloc.monthYear === monthStr
            ).reduce((sum, alloc) => {
                const val = Number(alloc.quantityAllocated);
                return sum + (isNaN(val) ? 0 : val);
            }, 0);

            months.push([label, allocatedInMonth, distributedInMonth]);
        }
        const finalData = [['Month', 'Allocated Ration', 'Distributed Stock'], ...months];
        console.log('Chart Data:', finalData);
        return finalData;
    })();

    const chartOptions = {
        title: 'Ration Allocation vs Distribution (Last 6 Months)',
        hAxis: { title: 'Month' },
        vAxis: { title: 'Quantity (KG)', minValue: 0 },
        colors: ['#003D82', '#FF6B35'],
        legend: { position: 'top' },
    };

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

            <div className="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm relative overflow-hidden flex flex-col gap-8">
                <div className="w-full">
                    <h4 className="text-lg font-bold text-gray-700 mb-6">Allocation vs Distribution Trends</h4>
                    <div className="h-[400px] w-full">
                        <Chart
                            chartType="ColumnChart"
                            width="100%"
                            height="100%"
                            data={chartData}
                            options={chartOptions}
                        />
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
