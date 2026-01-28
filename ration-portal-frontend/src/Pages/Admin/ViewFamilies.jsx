import { useEffect, useState } from 'react';
import { adminAPI } from '../../api';
import { toast } from 'react-toastify';
import DataTable from '../../components/DataTable';

const ViewFamilies = () => {
    const [families, setFamilies] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchFamilies();
    }, []);

    const fetchFamilies = async () => {
        try {
            const data = await adminAPI.getAllFamilies();
            setFamilies(data || []);
        } catch (error) {
            console.error('Error fetching families:', error);
            toast.error('Failed to load families data');
        } finally {
            setLoading(false);
        }
    };

    const columns = [
        { key: 'cardNumber', label: 'Card Number' },
        { key: 'headOfFamilyName', label: 'Head of Family' },
        {
            key: 'familyMemberCount',
            label: 'Family Members',
            render: (row) => row.familyMemberCount,
        },
        { key: 'address', label: 'Address' },
        {
            key: 'shopName',
            label: 'Ration Shop',
            render: (row) => row.shopName,
        },
        {
            key: 'status',
            label: 'Status',
            render: (row) => (
                <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${row.status === 'Verified' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                        }`}
                >
                    {row.status}
                </span>
            ),
        },
        {
            key: 'issueDate',
            label: 'Issue Date',
            render: (row) => new Date(row.issueDate).toLocaleDateString(),
        },
    ];

    // if (loading) {
    //     return <div className="text-center text-gray-600">Loading...</div>;
    // }

    return (
        <div className='justify-stretch'>
            <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-700">All Families</h3>

            </div>

            <div className=" max-w-2xl bg-white rounded-lg shadow-md p-4 mb-4">
                <div className="grid justify-between grid-cols-1 md:grid-cols-4 gap-4 text-center">
                    <div className="bg-blue-50 p-4 rounded-lg">
                        <p className="text-sm text-gray-600">Total Families</p>
                        <p className="text-2xl font-bold text-blue-600">{families.length}</p>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg">
                        <p className="text-sm text-gray-600">Active Cards</p>
                        <p className="text-2xl font-bold text-green-600">
                            {families.filter(f => f.status === 'Verified').length}
                        </p>
                    </div>
                    <div className="bg-purple-50 p-4 rounded-lg">
                        <p className="text-sm text-gray-600">Total Members</p>
                        <p className="text-2xl font-bold text-purple-600">
                            {families.reduce((sum, f) => sum + f.familyMemberCount, 0)}
                        </p>
                    </div>
                    <div className="bg-yellow-50 p-4 rounded-lg">
                        <p className="text-sm text-gray-600">Avg Family Size</p>
                        <p className="text-2xl font-bold text-yellow-600">
                            {families.length > 0
                                ? (families.reduce((sum, f) => sum + f.familyMemberCount, 0) / families.length).toFixed(1)
                                : 0}
                        </p>
                    </div>
                </div>
            </div>

            <DataTable
                columns={columns}
                data={families}
                searchable
                searchPlaceholder="Search by card number or family head..."
            />
        </div>
    );
};

export default ViewFamilies;
