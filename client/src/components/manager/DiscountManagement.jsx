import React, { useState, useEffect } from 'react';
import managerService from '../../services/managerService';

// NOTE: This requires new backend endpoints for Discount CRUD
// For now, we'll use mock data.
const mockDiscounts = [
    { _id: '1', code: 'SAVE10', type: 'percentage', value: 10, isActive: true, validUntil: '2024-12-31' },
    { _id: '2', code: 'HAPPYHOUR', type: 'percentage', value: 15, isActive: false, validUntil: '2024-11-30' },
];

const DiscountManagement = () => {
    const [discounts, setDiscounts] = useState(mockDiscounts);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        // TODO: Replace with actual API call
        // const fetchData = async () => {
        //     const data = await managerService.getDiscounts();
        //     setDiscounts(data);
        //     setLoading(false);
        // };
        // fetchData();
        setLoading(false);
    }, []);

    const handleToggleStatus = async (id) => {
        // TODO: Call API to toggle status
        setDiscounts(prev => prev.map(d => d._id === id ? { ...d, isActive: !d.isActive } : d));
    };

    if (loading) return <div>Loading Discounts...</div>;

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Discount & Offer Management</h1>
                <button onClick={() => setIsModalOpen(true)} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                    Create New Offer
                </button>
            </div>

            <div className="bg-white shadow rounded-lg overflow-hidden">
                <table className="min-w-full leading-normal">
                    <thead>
                        <tr>
                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Code</th>
                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Type</th>
                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Value</th>
                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Valid Until</th>
                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {discounts.map(discount => (
                            <tr key={discount._id}>
                                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm font-mono">{discount.code}</td>
                                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm capitalize">{discount.type}</td>
                                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">{discount.type === 'percentage' ? `${discount.value}%` : `$${discount.value}`}</td>
                                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">{new Date(discount.validUntil).toLocaleDateString()}</td>
                                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                    <button onClick={() => handleToggleStatus(discount._id)} className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${discount.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                        {discount.isActive ? 'Active' : 'Inactive'}
                                    </button>
                                </td>
                                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                    <button className="text-indigo-600 hover:text-indigo-900 mr-3">Edit</button>
                                    <button className="text-red-600 hover:text-red-900">Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {/* TODO: Add a Modal for creating/editing discounts, similar to MenuManagement */}
        </div>
    );
};

export default DiscountManagement;