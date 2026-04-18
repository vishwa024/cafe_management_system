import React, { useState, useEffect } from 'react';
import managerService from '../../services/managerService';

// NOTE: This requires a new backend endpoint: GET /api/manager/staff/performance
// For now, we'll use mock data.
const mockPerformanceData = [
    { _id: '1', name: 'Alice', role: 'Waiter', ordersHandled: 25 },
    { _id: '2', name: 'Bob', role: 'Cashier', ordersHandled: 42 },
    { _id: '3', name: 'Charlie', role: 'Waiter', ordersHandled: 31 },
];

const StaffPerformance = () => {
    const [performanceData, setPerformanceData] = useState(mockPerformanceData);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // TODO: Replace with actual API call
        // const fetchData = async () => {
        //     const data = await managerService.getStaffPerformance();
        //     setPerformanceData(data);
        //     setLoading(false);
        // };
        // fetchData();
        setLoading(false);
    }, []);

    if (loading) return <div>Loading Staff Performance...</div>;

    return (
        <div>
            <h1 className="text-3xl font-bold mb-6">Staff Performance</h1>
            <p className="mb-4 text-gray-600">Number of orders handled by each staff member this week.</p>
            
            <div className="bg-white shadow rounded-lg overflow-hidden">
                <table className="min-w-full leading-normal">
                    <thead>
                        <tr>
                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Staff Name</th>
                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Role</th>
                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Orders Handled</th>
                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {performanceData.map(staff => (
                            <tr key={staff._id}>
                                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm font-medium">{staff.name}</td>
                                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">{staff.role}</td>
                                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">{staff.ordersHandled}</td>
                                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                    <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                        Active
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default StaffPerformance;