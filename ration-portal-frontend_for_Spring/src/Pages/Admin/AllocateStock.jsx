import { useEffect, useState } from 'react';
import { adminAPI } from '../../api';
import { toast } from 'react-toastify';
import DataTable from '../../components/DataTable';

const AllocateStock = () => {
    const [shops, setShops] = useState([]);
    const [allocations, setAllocations] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({
        shopId: '',
        grain: 'RICE',
        quantityAllocated: '',
        monthYear: new Date().toISOString().slice(0, 7),
        adminEmail: '',
        adminPassword: '',
    });

    const grainTypes = ['RICE', 'WHEAT', 'SUGAR', 'OIL'];

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [shopsData, allocationsData] = await Promise.all([
                adminAPI.getAllShops(),
                adminAPI.getAllAllocations(),
            ]);
            setShops(shopsData || []);
            setAllocations(allocationsData || []);
        } catch (error) {
            console.error('Error fetching data:', error);
            toast.error('Failed to load stock allocation data');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await adminAPI.allocateStock({
                ...formData,
                shopId: parseInt(formData.shopId),
                quantityAllocated: parseFloat(formData.quantityAllocated),
            });
            toast.success('Stock allocated successfully');
            setShowForm(false);
            setFormData({
                shopId: '',
                grain: 'RICE',
                quantityAllocated: '',
                monthYear: new Date().toISOString().slice(0, 7),
                adminEmail: '',
                adminPassword: '',
            });
            fetchData();
        } catch (error) {
            console.error('Error allocating stock:', error);
            toast.error(error.response?.data?.message || 'Failed to allocate stock');
        }
    };

    const columns = [
        { key: 'allocationId', label: 'Allocation ID' },
        {
            key: 'shopName',
            label: 'Shop',
            render: (row) => <span className="font-semibold ">{row.shopName}</span>
        },
        {
            key: 'grain',
            label: 'Grain',
            render: (row) => <span className="font-semibold text-sm">{row.grain}</span>
        },
        {
            key: 'quantityAllocated',
            label: 'Net Weight (kg)',
            render: (row) => <span className="font-semibold text-sm">{row.quantityAllocated} KG</span>,
        },
        {
            key: 'monthYear',
            label: 'Allocation Month',
            render: (row) => <span className="text-gray-600 font-medium lowercase tracking-tight">{row.monthYear}</span>
        },
        {
            key: 'status',
            label: 'Status',
            render: (row) => (
                <span
                    className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${row.status === 'COMPLETED'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-[#FFFBF0] text-[#DAA520] border border-[#DAA520]'
                        }`}
                >
                    {row.status}
                </span>
            ),
        },
    ];

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#003D82]"></div>
            </div>
        );
    }

    return (
        <div className="animate-in fade-in duration-500">
            <div className="mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b-2 border-[#FFFBF0] pb-6 no-print">

                <div className="flex gap-4">
                    <button
                        onClick={() => setShowForm(!showForm)}
                        className={`px-6 py-2.5 rounded-lg font-bold transition-all duration-300 shadow-lg text-sm uppercase tracking-wider flex items-center gap-2 ${showForm
                            ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            : 'bg-blue-600 text-white hover:bg-blue-800'}`}
                    >
                        {showForm ? '✕ Cancel Dispatch' : '＋New Allocation'}
                    </button>
                    <button
                        onClick={() => window.print()}
                        className="px-6 py-2.5 rounded-lg font-bold transition-all duration-300 shadow-lg text-sm uppercase tracking-wider bg-green-600 text-white hover:bg-green-800 flex items-center gap-2"
                    >
                        Print Report
                    </button>
                </div>
            </div>

            <style>
                {`
                    @media print {
                        .no-print, header, nav, .sidebar {
                            display: none !important;
                        }
                        .animate-in {
                            animation: none !important;
                        }
                        body {
                            background-color: white;
                        }
                        .bg-white {
                            box-shadow: none;
                            border: none;
                        }
                    }
                `}
            </style>

            {showForm && (
                <div className=" rounded-xl border-2 p-8 mb-8 shadow-sm">
                    <h4 className="text-xl font-bold text-blue-900 mb-6 uppercase tracking-tight">New Stock Allocation</h4>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-2 ml-1">
                                    Ration Shop
                                </label>
                                <select
                                    required
                                    value={formData.shopId}
                                    onChange={(e) => setFormData({ ...formData, shopId: e.target.value })}
                                    className="w-full px-4 py-3 border-2 border-gray-100 rounded-xl focus:border-black focus:outline-none transition-all bg-white"
                                >
                                    <option value="">-- Choose Shop --</option>
                                    {shops.map((shop) => (
                                        <option key={shop.shopId} value={shop.shopId}>
                                            {shop.shopName} - {shop.location}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-2 ml-1">
                                    Commodity Type
                                </label>
                                <select
                                    required
                                    value={formData.grain}
                                    onChange={(e) => setFormData({ ...formData, grain: e.target.value })}
                                    className="w-full px-4 py-3 border-2 border-gray-100 rounded-xl focus:border-black focus:outline-none transition-all bg-white"
                                >
                                    {grainTypes.map((type) => (
                                        <option key={type} value={type}>
                                            {type}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-2 ml-1">
                                    Quantity for Dispatch (KG)
                                </label>
                                <input
                                    type="number"
                                    required
                                    min="1"
                                    step="0.01"
                                    value={formData.quantityAllocated}
                                    onChange={(e) => setFormData({ ...formData, quantityAllocated: e.target.value })}
                                    className="w-full px-4 py-3 border-2 border-gray-100 rounded-xl focus:border-black focus:outline-none transition-all"
                                    placeholder="Enter total weight"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-2 ml-1">
                                    Target Distribution Month
                                </label>
                                <input
                                    type="month"
                                    required
                                    value={formData.monthYear}
                                    onChange={(e) => setFormData({ ...formData, monthYear: e.target.value })}
                                    className="w-full px-4 py-3 border-2 border-gray-100 rounded-xl focus:border-black focus:outline-none transition-all"
                                />
                            </div>

                            <div className="p-5 bg-white rounded-xl border border-gray-200 md:col-span-2 space-y-4 shadow-inner">
                                <p className="text-sm text-black font-bold uppercase">Digital Signature Confirmation</p>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-semibold uppercase mb-1">Admin Email</label>
                                        <input
                                            type="email"
                                            required
                                            value={formData.adminEmail}
                                            onChange={(e) => setFormData({ ...formData, adminEmail: e.target.value })}
                                            className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none text-sm"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold uppercase mb-1">Admin Password</label>
                                        <input
                                            type="password"
                                            required
                                            value={formData.adminPassword}
                                            onChange={(e) => setFormData({ ...formData, adminPassword: e.target.value })}
                                            className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none text-sm"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="pt-2">
                            <button
                                type="submit"
                                className="w-full sm:w-auto bg-blue-700 text-white px-10 py-3 rounded-lg font-semibold text-base hover:bg-[#002A5C] transition-all shadow-xl active:scale-95"
                            >
                                Send Allocation
                            </button>
                        </div>
                    </form>
                </div>
            )}

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <DataTable
                    columns={columns}
                    data={allocations}
                    searchable
                    searchPlaceholder="Search dispatch logs..."
                />
            </div>
        </div>
    );
};

export default AllocateStock;
