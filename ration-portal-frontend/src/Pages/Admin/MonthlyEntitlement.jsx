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
    });
    const [editId, setEditId] = useState(null);

    const grainTypes = ['RICE', 'WHEAT', 'SUGAR', 'OIL'];
    const months = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];

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
            });
            fetchEntitlements();
        } catch (error) {
            console.error('Error saving entitlement:', error);
            toast.error(error.response?.data?.message || 'Failed to save entitlement');
        }
    };

    const handleEdit = (entitlement) => {
        setFormData({
            grain: entitlement.grainType,
            quantityPerPerson: entitlement.quantityPerPerson,
        });
        setEditMode(true);
        setShowForm(true);
    };

    const columns = [
        { key: 'entitlementId', label: 'ID' },
        { key: 'grain', label: 'Grain Type' },
        {
            key: 'quantityPerPerson',
            label: 'Quantity per Person (kg)',
            render: (row) => `${row.quantityPerPerson} kg`,
        },
        {
            key: 'actions',
            label: <div className="text-center w-full">Actions</div>,

            render: (row) => (
                <div className="flex justify-center gap-2">
                    <button
                        onClick={() => handleEdit(row)}
                        className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 transition"
                    >
                        Edit
                    </button>
                    <button
                        onClick={() => handleEdit(row)}
                        className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 transition"
                    >
                        Delete
                    </button>
                </div>

            ),
        },
    ];

    if (loading) {
        return <div className="text-center text-gray-600">Loading...</div>;
    }

    return (
        <div>
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h3 className="text-lg font-semibold text-gray-700">Monthly Entitlement</h3>
                    <p className="text-sm text-gray-500 mt-1">Manage monthly grain entitlement per person</p>
                </div>
                <button
                    onClick={() => {
                        setShowForm(!showForm);
                        setEditMode(false);
                        setFormData({
                            grain: 'RICE',
                            quantityPerPerson: '',
                        });
                    }}
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
                >
                    {showForm ? 'Cancel' : '+ Create Entitlement'}
                </button>
            </div>

            {showForm && (
                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                    <h4 className="text-lg font-semibold text-gray-800 mb-4">
                        {editMode ? 'Update Entitlement' : 'Create New Entitlement'}
                    </h4>
                    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Grain Type
                            </label>
                            <select
                                required
                                disabled={editMode}
                                value={formData.grain}
                                onChange={(e) => setFormData({ ...formData, grain: e.target.value })}
                                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none disabled:bg-gray-100"
                            >
                                {grainTypes.map((type) => (
                                    <option key={type} value={type}>
                                        {type}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Quantity per Person (kg)
                            </label>
                            <input
                                type="number"
                                required
                                min="0.1"
                                step="0.1"
                                value={formData.quantityPerPerson}
                                onChange={(e) => setFormData({ ...formData, quantityPerPerson: e.target.value })}
                                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                placeholder="e.g., 5"
                            />
                        </div>

                        <div className="md:col-span-2">
                            <button
                                type="submit"
                                className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition"
                            >
                                {editMode ? 'Update Entitlement' : 'Create Entitlement'}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            <DataTable columns={columns} data={entitlements} />
        </div>
    );
};

export default MonthlyEntitlement;
