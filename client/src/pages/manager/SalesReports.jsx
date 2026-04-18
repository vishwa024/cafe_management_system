import React, { useState } from 'react';
import { Bar, Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    LineElement,
    PointElement,
    Title,
    Tooltip,
    Legend,
    Filler
} from 'chart.js';
import { LoadingSpinner } from '../../components/shared/StatusBadge';
import { Calendar, Download, TrendingUp, ShoppingBag, DollarSign, Package, ChevronLeft, ChevronRight } from 'lucide-react';
import api from '../../services/api';

ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend, Filler);

export default function SalesReports() {
    const [report, setReport] = useState(null);
    const [loading, setLoading] = useState(false);
    const [filters, setFilters] = useState({
        startDate: new Date(Date.now() - 7 * 86400000).toISOString().slice(0, 10),
        endDate: new Date().toISOString().slice(0, 10),
        groupBy: 'day'
    });
    
    // Pagination state for item breakdown
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(6);

    const fetchReport = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams(filters);
            const res = await api.get(`/manager/reports/sales?${params}`);
            setReport(res.data);
            setCurrentPage(1);
        } catch (err) {
            alert('Failed to load report');
        } finally {
            setLoading(false);
        }
    };

    const applyPreset = (days) => {
        const start = new Date(Date.now() - days * 86400000).toISOString().slice(0, 10);
        setFilters(f => ({ ...f, startDate: start, endDate: new Date().toISOString().slice(0, 10) }));
    };

    const timeLabels = report ? Object.keys(report.salesOverTime || {}) : [];
    const revenueData = timeLabels.map(key => Number(report?.salesOverTime[key]?.revenue) || 0);

    // Improved Line Chart Options
    const lineOptions = {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
            legend: { position: 'top', labels: { font: { size: 11 }, usePointStyle: true, boxWidth: 8 } },
            tooltip: { mode: 'index', intersect: false, callbacks: { label: (ctx) => `Revenue: ₹${ctx.parsed.y.toFixed(0)}` } }
        },
        scales: {
            x: { grid: { display: false }, ticks: { font: { size: 10 }, maxRotation: 45, minRotation: 45 } },
            y: { beginAtZero: true, grid: { color: '#e5e7eb' }, ticks: { callback: (value) => `₹${value.toFixed(0)}`, font: { size: 10 } } }
        },
        elements: { point: { radius: 3, hoverRadius: 5 }, line: { tension: 0.3 } }
    };

    // Improved Bar Chart Options
    const barOptions = {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
            legend: { position: 'top', labels: { font: { size: 11 }, usePointStyle: true } },
            tooltip: { callbacks: { label: (ctx) => `${ctx.dataset.label}: ${ctx.parsed.y}` } }
        },
        scales: {
            x: { ticks: { font: { size: 9 }, maxRotation: 45, minRotation: 45 } },
            y: { beginAtZero: true, grid: { color: '#e5e7eb' }, ticks: { font: { size: 10 } } }
        }
    };

    const lineData = {
        labels: timeLabels.map(label => {
            const date = new Date(label);
            return date.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' });
        }),
        datasets: [{
            label: 'Revenue (₹)',
            data: revenueData,
            borderColor: '#f59e0b',
            backgroundColor: 'rgba(245, 158, 11, 0.08)',
            fill: true,
            tension: 0.4,
            pointRadius: 4,
            pointBackgroundColor: '#f59e0b',
            pointBorderColor: '#fff',
            pointBorderWidth: 2,
        }]
    };

    const barData = {
        labels: report?.itemPerformance?.slice(0, 15).map(i => i.name?.length > 18 ? i.name.slice(0, 15) + '…' : i.name) || [],
        datasets: [{
            label: 'Units Sold',
            data: report?.itemPerformance?.slice(0, 15).map(i => i.quantity) || [],
            backgroundColor: '#f59e0b',
            borderRadius: 6,
            barPercentage: 0.7,
            categoryPercentage: 0.8,
        }]
    };

    // Pagination for item breakdown
    const itemPerformance = report?.itemPerformance || [];
    const totalItems = itemPerformance.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedItems = itemPerformance.slice(startIndex, startIndex + itemsPerPage);

    const getPageNumbers = () => {
        const pages = [];
        const maxVisible = 5;
        if (totalPages <= maxVisible) {
            for (let i = 1; i <= totalPages; i++) pages.push(i);
        } else if (currentPage <= 3) {
            for (let i = 1; i <= 4; i++) pages.push(i);
            pages.push('...');
            pages.push(totalPages);
        } else if (currentPage >= totalPages - 2) {
            pages.push(1);
            pages.push('...');
            for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
        } else {
            pages.push(1);
            pages.push('...');
            for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i);
            pages.push('...');
            pages.push(totalPages);
        }
        return pages;
    };

    const formatCurrency = (value) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(value || 0);

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Sales Reports & Analytics</h1>
                <p className="text-sm text-gray-500 mt-1">Track your cafe's performance</p>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-xl border border-gray-200 p-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                    <div>
                        <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">From Date</label>
                        <input type="date" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-amber-400" value={filters.startDate} onChange={e => setFilters(f => ({ ...f, startDate: e.target.value }))} />
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">To Date</label>
                        <input type="date" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-amber-400" value={filters.endDate} onChange={e => setFilters(f => ({ ...f, endDate: e.target.value }))} />
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Group By</label>
                        <select className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:border-amber-400" value={filters.groupBy} onChange={e => setFilters(f => ({ ...f, groupBy: e.target.value }))}>
                            <option value="day">Day</option>
                            <option value="week">Week</option>
                            <option value="month">Month</option>
                        </select>
                    </div>
                    <div className="flex gap-2">
                        <button onClick={fetchReport} className="flex-1 px-4 py-2 bg-amber-500 text-white rounded-lg text-sm font-semibold hover:bg-amber-600 transition">Generate Report</button>
                    </div>
                </div>
                <div className="flex gap-2 mt-4 flex-wrap">
                    {[{ label: 'Today', days: 0 }, { label: 'Last 7 Days', days: 7 }, { label: 'Last 30 Days', days: 30 }].map(preset => (
                        <button key={preset.label} onClick={() => applyPreset(preset.days)} className="px-3 py-1 border border-gray-200 rounded-full text-xs hover:bg-gray-50 transition">{preset.label}</button>
                    ))}
                </div>
            </div>

            {loading ? <LoadingSpinner /> : report && (
                <>
                    {/* KPI Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-green-100 rounded-lg"><DollarSign size={20} className="text-green-600" /></div>
                                <div><p className="text-sm text-gray-500">Total Revenue</p><p className="text-2xl font-bold text-gray-900">{formatCurrency(report.totalRevenue)}</p></div>
                            </div>
                        </div>
                        <div className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-blue-100 rounded-lg"><ShoppingBag size={20} className="text-blue-600" /></div>
                                <div><p className="text-sm text-gray-500">Total Orders</p><p className="text-2xl font-bold text-gray-900">{report.totalOrders}</p></div>
                            </div>
                        </div>
                        <div className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-amber-100 rounded-lg"><TrendingUp size={20} className="text-amber-600" /></div>
                                <div><p className="text-sm text-gray-500">Best Seller</p><p className="text-lg font-bold text-gray-900 truncate">{report.bestSeller?.name || '—'}</p></div>
                            </div>
                        </div>
                        <div className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-purple-100 rounded-lg"><Package size={20} className="text-purple-600" /></div>
                                <div><p className="text-sm text-gray-500">Avg Order Value</p><p className="text-2xl font-bold text-gray-900">{formatCurrency((report.totalRevenue || 0) / (report.totalOrders || 1))}</p></div>
                            </div>
                        </div>
                    </div>

                    {/* Charts - Improved Layout */}
                    <div className="grid lg:grid-cols-2 gap-6">
                        <div className="bg-white rounded-xl border border-gray-200 p-5">
                            <h3 className="font-semibold text-gray-900 mb-4">Revenue Over Time</h3>
                            <div className="h-80">
                                <Line data={lineData} options={lineOptions} />
                            </div>
                        </div>
                        <div className="bg-white rounded-xl border border-gray-200 p-5">
                            <h3 className="font-semibold text-gray-900 mb-4">Top 15 Selling Items</h3>
                            <div className="h-80">
                                <Bar data={barData} options={barOptions} />
                            </div>
                        </div>
                    </div>

                    {/* Item Breakdown with Pagination */}
                    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                        <div className="px-5 py-4 border-b border-gray-200 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
                            <h3 className="font-semibold text-gray-900">Item Breakdown</h3>
                            <div className="flex items-center gap-3">
                                <span className="text-sm text-gray-500">Show:</span>
                                <select
                                    value={itemsPerPage}
                                    onChange={(e) => { setItemsPerPage(Number(e.target.value)); setCurrentPage(1); }}
                                    className="px-2 py-1 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:border-amber-400"
                                >
                                    <option value={10}>10 per page</option>
                                    <option value={25}>25 per page</option>
                                    <option value={50}>50 per page</option>
                                    <option value={100}>100 per page</option>
                                </select>
                            </div>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead className="bg-gray-50">
                                    <tr className="text-gray-600">
                                        <th className="px-4 py-3 text-left w-16">#</th>
                                        <th className="px-4 py-3 text-left">Item</th>
                                        <th className="px-4 py-3 text-left">Category</th>
                                        <th className="px-4 py-3 text-right">Units Sold</th>
                                        <th className="px-4 py-3 text-right">Revenue</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {paginatedItems.map((item, index) => (
                                        <tr key={item._id || index} className="hover:bg-gray-50 transition">
                                            <td className="px-4 py-3 text-gray-500 font-medium">{startIndex + index + 1}</td>
                                            <td className="px-4 py-3 font-medium text-gray-900">{item.name}</td>
                                            <td className="px-4 py-3 text-gray-500">
                                                <span className="px-2 py-0.5 bg-gray-100 rounded-full text-xs">{item.category || 'Other'}</span>
                                            </td>
                                            <td className="px-4 py-3 text-right font-semibold text-gray-700">{item.quantity}</td>
                                            <td className="px-4 py-3 text-right font-semibold text-green-600">{formatCurrency(item.revenue)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                                <tfoot className="bg-gray-50 border-t border-gray-200">
                                    <tr className="font-semibold">
                                        <td className="px-4 py-3" colSpan="3">Total</td>
                                        <td className="px-4 py-3 text-right">{itemPerformance.reduce((sum, i) => sum + (i.quantity || 0), 0)}</td>
                                        <td className="px-4 py-3 text-right text-green-600">{formatCurrency(itemPerformance.reduce((sum, i) => sum + (i.revenue || 0), 0))}</td>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>

                        {/* Pagination Controls */}
                        {totalPages > 1 && (
                            <div className="px-5 py-3 border-t border-gray-200 bg-gray-50 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
                                <span className="text-sm text-gray-500">
                                    Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, totalItems)} of {totalItems} items
                                </span>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                        disabled={currentPage === 1}
                                        className="p-1.5 rounded border border-gray-200 bg-white disabled:opacity-50 hover:bg-gray-50 transition"
                                    >
                                        <ChevronLeft size={14} />
                                    </button>
                                    <div className="flex gap-1">
                                        {getPageNumbers().map((page, idx) => (
                                            <button
                                                key={idx}
                                                onClick={() => typeof page === 'number' && setCurrentPage(page)}
                                                disabled={page === '...'}
                                                className={`px-3 py-1 rounded text-sm font-medium transition ${currentPage === page ? 'bg-amber-500 text-white' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'}`}
                                            >
                                                {page}
                                            </button>
                                        ))}
                                    </div>
                                    <button
                                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                        disabled={currentPage === totalPages}
                                        className="p-1.5 rounded border border-gray-200 bg-white disabled:opacity-50 hover:bg-gray-50 transition"
                                    >
                                        <ChevronRight size={14} />
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </>
            )}

            {!loading && !report && (
                <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
                    <div className="text-5xl mb-3">📊</div>
                    <p className="text-gray-500">Select a date range and click <strong>Generate Report</strong> to view analytics.</p>
                </div>
            )}
        </div>
    );
}