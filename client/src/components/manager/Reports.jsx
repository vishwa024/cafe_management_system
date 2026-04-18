import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import managerService from '../../services/managerService';

const Reports = () => {
    const [reportData, setReportData] = useState(null);
    const [dates, setDates] = useState({ startDate: '', endDate: '' });
    const [loading, setLoading] = useState(false);

    const handleGenerateReport = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const data = await managerService.getSalesReport(dates.startDate, dates.endDate);
            setReportData(data);
        } catch (error) {
            console.error("Failed to generate report:", error);
        } finally {
            setLoading(false);
        }
    };
    
    // Mock data for chart display
    const mockData = [
        { name: 'Mon', revenue: 4000 },
        { name: 'Tue', revenue: 3000 },
        { name: 'Wed', revenue: 5000 },
        { name: 'Thu', revenue: 2780 },
        { name: 'Fri', revenue: 6890 },
        { name: 'Sat', revenue: 7390 },
        { name: 'Sun', revenue: 5490 },
    ];

    return (
        <div>
            <h1 className="text-3xl font-bold mb-6">Sales Analytics & Reports</h1>
            
            {/* Date Range Picker */}
            <form onSubmit={handleGenerateReport} className="bg-white p-4 rounded-lg shadow mb-6">
                <div className="flex gap-4 items-end">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Start Date</label>
                        <input type="date" value={dates.startDate} onChange={(e) => setDates({...dates, startDate: e.target.value})} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" required />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">End Date</label>
                        <input type="date" value={dates.endDate} onChange={(e) => setDates({...dates, endDate: e.target.value})} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" required />
                    </div>
                    <button type="submit" disabled={loading} className="bg-indigo-600 text-white px-4 py-2 rounded-md">
                        {loading ? 'Generating...' : 'Generate Report'}
                    </button>
                </div>
            </form>

            {/* Report Summary */}
            {reportData && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white p-6 rounded-lg shadow">
                        <h2 className="text-xl font-semibold text-gray-700">Total Revenue</h2>
                        <p className="text-3xl font-bold text-green-600">${reportData.totalRevenue.toFixed(2)}</p>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow">
                        <h2 className="text-xl font-semibold text-gray-700">Total Orders</h2>
                        <p className="text-3xl font-bold text-blue-600">{reportData.totalOrders}</p>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow">
                        <h2 className="text-xl font-semibold text-gray-700">Avg. Order Value</h2>
                        <p className="text-3xl font-bold text-purple-600">${reportData.averageOrderValue.toFixed(2)}</p>
                    </div>
                </div>
            )}

            {/* Example Chart */}
            <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-xl font-semibold mb-4">Weekly Revenue Trend</h3>
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={mockData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="revenue" fill="#8884d8" />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default Reports;