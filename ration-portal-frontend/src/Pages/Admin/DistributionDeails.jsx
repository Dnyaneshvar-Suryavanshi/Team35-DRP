import React, { useEffect, useState } from 'react';
import { adminAPI } from '../../api';
import { toast } from 'react-toastify';
import { Navigate, useNavigate, useParams } from 'react-router-dom';

export const DistributionDeails = () => {
    const { id } = useParams(); // distributionId from URL
    const [distribution, setDistribution] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetchLogs();
    }, []);

    const fetchLogs = async () => {
        try {
            const data = await adminAPI.getAllDistributionLogs();

            const selected = data.find(
                log => log.distributionId === Number(id)
            );

            if (!selected) {
                toast.error("Distribution not found");
            } else {
                setDistribution(selected);
            }
        } catch (error) {
            console.error('Error fetching distribution logs:', error);
            toast.error('Failed to load distribution details');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <p className="text-center mt-10">Loading...</p>;
    }

    if (!distribution) {
        return <p className="text-center mt-10 text-red-600">No data available</p>;
    }

    return (
        <div className="max-w-xl mx-auto bg-white shadow-lg rounded-lg p-6 mt-6">
            <div className="flex items-center justify-between mb-6 border-b pb-2">
                <h2 className="text-xl font-bold">
                    Ration Distribution ID - {distribution.distributionId}
                </h2>

                <button
                    onClick={() => navigate(-1)}
                    className="bg-blue-600 text-white px-4 py-1.5 rounded-md text-sm hover:bg-blue-700 transition"
                >
                    Back
                </button>
            </div>
            <h2 className="text-xl font-bold text-center mb-6 border-b pb-2">
                Ration Distribution Slip
            </h2>

            <div className="space-y-3 text-sm">

                <table className="w-3/4 border border-gray-300 text-sm">
                    <tbody>

                        <TableRow label="Ration Card Number" value={distribution.cardNumber} />
                        <TableRow label="Head of Family" value={distribution.headOfFamily} />
                        <TableRow label="Shop Name" value={distribution.shopName} />
                        <TableRow label="Grain Type" value={distribution.grain} />
                        <TableRow
                            label="Quantity Given"
                            value={`${distribution.quantityGiven} kg`}
                        />
                        <TableRow
                            label="Distribution Month"
                            value={distribution.distributionMonth}
                        />
                        <TableRow
                            label="Date And Time"
                            value={new Date(distribution.distributionDate).toLocaleString()}
                        />
                        <TableRow
                            label="Status"
                            value={distribution.status}
                            valueClass={
                                distribution.status === 'Success'
                                    ? 'text-green-600 font-semibold'
                                    : 'text-red-600 font-semibold'
                            }
                        />
                    </tbody>
                </table>

            </div>
        </div>
    );
};


const TableRow = ({ label, value, valueClass = '' }) => (
    <tr className="border-b">
        <td className="px-4 py-2 font-medium text-gray-600 bg-gray-50 w-1/2">
            {label}
        </td>
        <td className={`px-4 py-2 text-gray-900 ${valueClass}`}>
            {value}
        </td>
    </tr>
);
