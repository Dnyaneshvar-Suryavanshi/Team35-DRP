import { useEffect, useState } from 'react';
import { adminAPI } from '../../api';
import { toast } from 'react-toastify';
import DataTable from '../../components/DataTable';

const MonthlyEntitlement = () => {
    const [entitlements, setEntitlements] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({
        grain: 'RICE',
        quantityPerPerson: '',
        pricePerKg: '',
    });

    const grainTypes = ['RICE', 'WHEAT', 'SUGAR', 'OIL'];

    useEffect(() => {
        fetchEntitlements();
    }, []);

    const fetchEntitlements = async () => {
        try {
            const data = await adminAPI.getAllEntitlements();
            setEntitlements(data || []);
        } catch (error) {
            console.error('Error fetching entitlements:', error);
            toast.error('Failed to load entitlements');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const dto = {
                grain: formData.grain,
                quantityPerPerson: parseFloat(formData.quantityPerPerson),
                pricePerKg: parseFloat(formData.pricePerKg),
            };
            if (editMode) {
                await adminAPI.updateEntitlement(dto);
                toast.success('Entitlement updated successfully');
            } else {
                await adminAPI.createEntitlement(dto);
                toast.success('Entitlement created successfully');
            }
            setShowForm(false);
            setEditMode(false);
            setFormData({
                grain: dto.grain,
                quantityPerPerson: '',
                pricePerKg: '',
            });
            fetchEntitlements();
        } catch (error) {
            console.error('Error saving entitlement:', error);
            toast.error(error.response?.data?.message || 'Failed to save entitlement');
        }
    };

    const handleEdit = (entitlement) => {
        setFormData({
            grain: entitlement.grain,
            quantityPerPerson: entitlement.quantityPerPerson,
            pricePerKg: entitlement.pricePerKg,
        });
        setEditMode(true);
        setShowForm(true);
    };

    const columns = [
        { key: 'entitlementId', label: 'Entitlement ID' },
        {
            key: 'grain',
            label: 'Grain',
            render: (row) => <span className="tracking-wide">{(row.grain || row.Grain || row.grainType || 'N/A').toUpperCase()}</span>
        },
        {
            key: 'quantityPerPerson',
            label: 'Per Person Allowance',
            render: (row) => <span className="font-semibold text-sm">{row.quantityPerPerson || row.QuantityPerPerson || 0} KG</span>,
        },
        {
            key: 'pricePerKg',
            label: 'Price per KG',
            render: (row) => <span className="font-semibold text-sm">₹{row.pricePerKg || 0}</span>,
        },
        {
            key: 'actions',
            label: <div className="text-center w-full text- font-semibold tracking-widest">Manage</div>,
            render: (row) => (
                <div className="flex justify-center gap-3">
                    <button
                        onClick={() => handleEdit(row)}
                        className="bg-blue-700 text-white px-5 py-1.5 rounded-lg text-l font-semibold hover:bg-[#002A5C] transition-all shadow-blue-100 shadow-md active:scale-95"
                    >
                        Edit
                    </button>
                </div>
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
            <div className="mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b-2 border-[#FFFBF0] pb-6">

                {!showForm && (
                    <button
                        onClick={() => {
                            setShowForm(true);
                            setEditMode(false);
                            setFormData({
                                grain: 'RICE',
                                quantityPerPerson: '',
                                pricePerKg: '',
                            });
                        }}
                        className="bg-blue-700 text-white px-6 py-2.5 rounded-lg font-bold hover:bg-blue-900 transition-all shadow-lg text-sm uppercase tracking-wider flex items-center gap-2"
                    >
                        ＋ Create New Policy
                    </button>
                )}
            </div>

            {showForm && (
                <div className=" rounded-xl border-2 p-8 mb-8 shadow-sm max-w-2xl">
                    <div className="flex justify-between items-center mb-6">
                        <h4 className="text-xl font-bold text-[#003D82] uppercase -tight">
                            {editMode ? 'Update Entitlement' : 'New Entitlement'}
                        </h4>
                        <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-red-500 transition-colors">✕ Cancel</button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-semibold uppercase mb-2 ml-1">
                                    Subsidy Category
                                </label>
                                <select
                                    required
                                    disabled={editMode}
                                    value={formData.grain}
                                    onChange={(e) => setFormData({ ...formData, grain: e.target.value })}
                                    className="w-full px-4 py-3 border-2 border-gray-100 rounded-xl focus:border-black focus:outline-none transition-all disabled:bg-gray-100 bg-white"
                                >
                                    {grainTypes.map((type) => (
                                        <option key={type} value={type}>
                                            {type}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold uppercase mb-2 ml-1">
                                    Quantity Allowance (KG per Person)
                                </label>
                                <input
                                    type="number"
                                    required
                                    min="0.1"
                                    step="0.1"
                                    value={formData.quantityPerPerson}
                                    onChange={(e) => setFormData({ ...formData, quantityPerPerson: e.target.value })}
                                    className="w-full px-4 py-3 border-2 border-gray-100 rounded-xl focus:border-black focus:outline-none transition-all"
                                    placeholder="Enter weight in Kilograms"
                                />
                                <p className="text-[10px] text-gray-600 mt-2 ">* This value will be multiplied by family size at point of sale.</p>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold uppercase mb-2 ml-1">
                                    Price (₹ per KG)
                                </label>
                                <input
                                    type="number"
                                    required
                                    min="0"
                                    step="0.1"
                                    value={formData.pricePerKg}
                                    onChange={(e) => setFormData({ ...formData, pricePerKg: e.target.value })}
                                    className="w-full px-4 py-3 border-2 border-gray-100 rounded-xl focus:border-black focus:outline-none transition-all"
                                    placeholder="Enter Price in Rupees"
                                />
                            </div>
                        </div>

                        <div className="pt-2">
                            <button
                                type="submit"
                                className="w-full bg-[#003D82] text-white px-10 py-3 rounded-lg font-bold text-base hover:bg-[#002A5C] transition-all shadow-xl active:scale-95"
                            >
                                {editMode ? 'Update Entitlement' : 'Add Entitlement'}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <DataTable columns={columns} data={entitlements} />
            </div>
        </div>
    );
};

export default MonthlyEntitlement;
