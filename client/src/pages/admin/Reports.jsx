// // import { useMemo, useState } from 'react';
// // import { useQuery } from '@tanstack/react-query';
// // import {
// //   ResponsiveContainer,
// //   LineChart,
// //   Line,
// //   BarChart,
// //   Bar,
// //   PieChart,
// //   Pie,
// //   XAxis,
// //   YAxis,
// //   CartesianGrid,
// //   Tooltip,
// // } from 'recharts';
// // import { CalendarDays, IndianRupee, Package2, ShoppingBag, TrendingUp } from 'lucide-react';
// // import api from '../../services/api';
// // import AdminSidebar from '../../components/admin/AdminSidebar';

// // const currency = new Intl.NumberFormat('en-IN', {
// //   style: 'currency',
// //   currency: 'INR',
// //   maximumFractionDigits: 0,
// // });

// // const PIE_COLORS = ['#d62828', '#f77f00', '#fcbf49', '#2a9d8f', '#457b9d', '#6c757d'];


// // const dateInput = (value) => {
// //   const date = new Date(value);
// //   const year = date.getFullYear();
// //   const month = `${date.getMonth() + 1}`.padStart(2, '0');
// //   const day = `${date.getDate()}`.padStart(2, '0');
// //   return `${year}-${month}-${day}`;
// // };

// // const quickRange = {
// //   today: () => {
// //     const today = new Date();
// //     return {
// //       startDate: dateInput(today),
// //       endDate: dateInput(today),
// //       groupBy: 'day',
// //       label: 'Today',
// //     };
// //   },
// //   weekly: () => {
// //     const end = new Date();
// //     const start = new Date();
// //     start.setDate(end.getDate() - 6);
// //     return {
// //       startDate: dateInput(start),
// //       endDate: dateInput(end),
// //       groupBy: 'day',
// //       label: 'Weekly Revenue',
// //     };
// //   },
// //   monthly: () => {
// //     const end = new Date();
// //     const start = new Date();
// //     start.setDate(end.getDate() - 29);
// //     return {
// //       startDate: dateInput(start),
// //       endDate: dateInput(end),
// //       groupBy: 'week',
// //       label: 'Monthly Revenue',
// //     };
// //   },
// // };

// // function MetricCard({ icon: Icon, label, value, tone }) {
// //   return (
// //     <div className="rounded-3xl border border-[#efe5de] bg-white p-5 shadow-sm">
// //       <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${tone}`}>
// //         <Icon size={20} />
// //       </div>
// //       <p className="mt-4 text-sm text-gray-500">{label}</p>
// //       <p className="mt-1 font-display text-3xl font-bold text-dark">{value}</p>
// //     </div>
// //   );
// // }

// // function formatAxisLabel(value, groupBy) {
// //   if (!value) return '';
// //   if (groupBy === 'week') return value.replace('Week of ', '');
// //   return value;
// // }

// // export default function Reports() {
// //   const initialRange = quickRange.monthly();
// //   const [draftFilters, setDraftFilters] = useState(initialRange);
// //   const [filters, setFilters] = useState(initialRange);
// //   const [activePreset, setActivePreset] = useState('monthly');

// //   const { data, isFetching } = useQuery({
// //     queryKey: ['admin-sales-report', filters],
// //     queryFn: async () => {
// //       const response = await api.get('/admin/reports/sales', { params: filters });
// //       return response.data;
// //     },
// //     staleTime: 60000,
// //     refetchOnWindowFocus: false,
// //   });

// //   const salesOverTime = data?.salesOverTime || [];
// //   const itemPerformance = data?.itemPerformance || [];
// //   const totalRevenue = Number(data?.totalRevenue || 0);
// //   const totalOrders = Number(data?.totalOrders || 0);
// //   const bestSeller = data?.bestSeller?.name || data?.bestSeller?._id || '-';
// //   const averageOrderValue = totalOrders ? totalRevenue / totalOrders : 0;

// //   const revenueSummary = useMemo(() => {
// //     const values = salesOverTime.map((entry) => Number(entry.revenue || 0));
// //     return {
// //       peak: values.length ? Math.max(...values) : 0,
// //       average: values.length ? totalRevenue / values.length : 0,
// //       tracked: values.length,
// //     };
// //   }, [salesOverTime, totalRevenue]);

// //   const chartData = useMemo(
// //     () =>
// //       salesOverTime.map((entry) => ({
// //         ...entry,
// //         label: formatAxisLabel(entry.label, filters.groupBy),
// //         revenue: Number(entry.revenue || 0),
// //       })),
// //     [filters.groupBy, salesOverTime]
// //   );

// //   const topItems = useMemo(
// //     () =>
// //       itemPerformance.slice(0, 10).map((item, index) => ({
// //         rank: index + 1,
// //         name: item.name || item._id || 'Unnamed item',
// //         unitsSold: Number(item.unitsSold || 0),
// //         revenue: Number(item.revenue || 0),
// //       })),
// //     [itemPerformance]
// //   );

// //   const handleDraftChange = (field, value) => {
// //     setDraftFilters((prev) => ({ ...prev, [field]: value }));
// //     setActivePreset(null);
// //   };

// //   const applyPreset = (presetKey) => {
// //     const next = quickRange[presetKey]();
// //     setDraftFilters(next);
// //     setFilters(next);
// //     setActivePreset(presetKey);
// //   };

// //   const generateReport = () => {
// //     setFilters(draftFilters);
// //   };

// //   const chartTitle = filters.groupBy === 'week'
// //     ? 'Monthly Revenue Report'
// //     : filters.groupBy === 'month'
// //       ? 'Yearly Revenue Report'
// //       : 'Revenue Over Time';

// //   return (
// //     <div className="flex min-h-screen bg-[#f7f4ef] font-body">
// //       <AdminSidebar />
// //       <main className="flex-1 overflow-auto p-6">
// //         <div className="mx-auto max-w-7xl">
// //           <div className="mb-6">
// //             <h1 className="font-display text-4xl font-bold text-dark">Reports</h1>
// //             <p className="mt-2 text-base text-gray-500">
// //               Day-wise, week-wise, and month-wise revenue with correct filters and cleaner graph scaling.
// //             </p>
// //           </div>

// //           <section className="mb-6 rounded-[28px] border border-[#eadfd5] bg-white p-6 shadow-sm">
// //             <div className="grid gap-4 xl:grid-cols-[1fr,1fr,1fr,320px]">
// //               <label className="text-sm font-medium text-gray-600">
// //                 <span className="mb-2 block uppercase tracking-[0.14em] text-gray-500">From Date</span>
// //                 <div className="flex items-center gap-3 rounded-2xl border border-[#e7ddd2] px-4 py-3">
// //                   <CalendarDays size={18} className="text-[#b27943]" />
// //                   <input
// //                     type="date"
// //                     value={draftFilters.startDate}
// //                     onChange={(event) => handleDraftChange('startDate', event.target.value)}
// //                     className="w-full bg-transparent text-lg text-dark outline-none"
// //                   />
// //                 </div>
// //               </label>

// //               <label className="text-sm font-medium text-gray-600">
// //                 <span className="mb-2 block uppercase tracking-[0.14em] text-gray-500">To Date</span>
// //                 <div className="flex items-center gap-3 rounded-2xl border border-[#e7ddd2] px-4 py-3">
// //                   <CalendarDays size={18} className="text-[#b27943]" />
// //                   <input
// //                     type="date"
// //                     value={draftFilters.endDate}
// //                     onChange={(event) => handleDraftChange('endDate', event.target.value)}
// //                     className="w-full bg-transparent text-lg text-dark outline-none"
// //                   />
// //                 </div>
// //               </label>

// //               <label className="text-sm font-medium text-gray-600">
// //                 <span className="mb-2 block uppercase tracking-[0.14em] text-gray-500">Group By</span>
// //                 <select
// //                   value={draftFilters.groupBy}
// //                   onChange={(event) => handleDraftChange('groupBy', event.target.value)}
// //                   className="w-full rounded-2xl border border-[#e7ddd2] bg-white px-4 py-3 text-lg text-dark outline-none"
// //                 >
// //                   <option value="day">Day</option>
// //                   <option value="week">Week</option>
// //                   <option value="month">Month</option>
// //                 </select>
// //               </label>

// //               <div className="flex items-end">
// //                 <button
// //                   type="button"
// //                   onClick={generateReport}
// //                   className="w-full rounded-2xl bg-[#f5a000] px-6 py-4 text-lg font-semibold text-white transition hover:bg-[#dd9300]"
// //                 >
// //                   {isFetching ? 'Loading...' : 'Generate Report'}
// //                 </button>
// //               </div>
// //             </div>

// //             <div className="mt-5 flex flex-wrap gap-3">
// //               {[
// //                 ['today', 'Today'],
// //                 ['weekly', 'Weekly Revenue'],
// //                 ['monthly', 'Monthly Revenue'],
// //               ].map(([key, label]) => (
// //                 <button
// //                   key={key}
// //                   type="button"
// //                   onClick={() => applyPreset(key)}
// //                   className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
// //                     activePreset === key
// //                       ? 'border-[#f5a000] bg-[#fff4db] text-[#b36c00]'
// //                       : 'border-[#e7ddd2] bg-white text-gray-600 hover:border-[#f5a000] hover:text-[#b36c00]'
// //                   }`}
// //                 >
// //                   {label}
// //                 </button>
// //               ))}
// //             </div>
// //           </section>

// //           <section className="mb-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
// //             <MetricCard icon={IndianRupee} label="Total Revenue" value={currency.format(totalRevenue)} tone="bg-emerald-100 text-emerald-700" />
// //             <MetricCard icon={ShoppingBag} label="Total Orders" value={totalOrders} tone="bg-blue-100 text-blue-700" />
// //             <MetricCard icon={TrendingUp} label="Best Seller" value={bestSeller} tone="bg-amber-100 text-amber-700" />
// //             <MetricCard icon={Package2} label="Avg Order Value" value={currency.format(averageOrderValue)} tone="bg-purple-100 text-purple-700" />
// //           </section>

// //           <section className="grid gap-6 xl:grid-cols-[1.35fr,1fr]">
// //             <div className="rounded-[28px] border border-[#eadfd5] bg-white p-6 shadow-sm">
// //               <div className="mb-5 flex items-start justify-between gap-4">
// //                 <div>
// //                   <h2 className="font-display text-2xl font-bold text-dark">{chartTitle}</h2>
// //                   <p className="mt-1 text-sm text-gray-500">
// //                     The graph now starts at zero and follows the exact day-wise or week-wise totals from your report filter.
// //                   </p>
// //                 </div>
// //                 <div className="rounded-2xl bg-[#fff2eb] px-4 py-3 text-right">
// //                   <p className="text-[11px] uppercase tracking-[0.16em] text-[#d06b37]">Selected Range</p>
// //                   <p className="mt-1 text-sm font-semibold text-[#a24e22]">{currency.format(totalRevenue)}</p>
// //                 </div>
// //               </div>

// //               <ResponsiveContainer width="100%" height={320}>
// //                 <LineChart data={chartData} margin={{ top: 10, right: 18, left: 8, bottom: 0 }}>
// //                   <CartesianGrid strokeDasharray="3 5" stroke="#ece5dd" vertical={false} />
// //                   <XAxis
// //                     dataKey="label"
// //                     axisLine={false}
// //                     tickLine={false}
// //                     tick={{ fill: '#8c7b6b', fontSize: 12 }}
// //                   />
// //                   <YAxis
// //                     axisLine={false}
// //                     tickLine={false}
// //                     tick={{ fill: '#8c7b6b', fontSize: 12 }}
// //                     tickFormatter={(value) => currency.format(value)}
// //                     domain={[0, 'auto']}
// //                     allowDecimals={false}
// //                     width={90}
// //                   />
// //                   <Tooltip
// //                     formatter={(value) => [currency.format(value), 'Revenue']}
// //                     labelFormatter={(label) => `Period: ${label}`}
// //                     contentStyle={{
// //                       borderRadius: 18,
// //                       border: '1px solid #f0e4d6',
// //                       boxShadow: '0 14px 35px rgba(15, 23, 42, 0.08)',
// //                     }}
// //                   />
// //                   <Line
// //                     type="monotone"
// //                     dataKey="revenue"
// //                     stroke="#d62828"
// //                     strokeWidth={3}
// //                     dot={{ r: 4, fill: '#ffffff', stroke: '#d62828', strokeWidth: 2 }}
// //                     activeDot={{ r: 6, fill: '#d62828', stroke: '#ffffff', strokeWidth: 2 }}
// //                     isAnimationActive={false}
// //                   />
// //                 </LineChart>
// //               </ResponsiveContainer>

// //               <div className="mt-5 grid gap-3 md:grid-cols-3">
// //                 <div className="rounded-2xl bg-[#faf7f2] px-4 py-4">
// //                   <p className="text-[11px] uppercase tracking-[0.18em] text-gray-500">Average</p>
// //                   <p className="mt-2 text-lg font-semibold text-dark">{currency.format(revenueSummary.average)}</p>
// //                 </div>
// //                 <div className="rounded-2xl bg-[#faf7f2] px-4 py-4">
// //                   <p className="text-[11px] uppercase tracking-[0.18em] text-gray-500">Peak Revenue</p>
// //                   <p className="mt-2 text-lg font-semibold text-dark">{currency.format(revenueSummary.peak)}</p>
// //                 </div>
// //                 <div className="rounded-2xl bg-[#faf7f2] px-4 py-4">
// //                   <p className="text-[11px] uppercase tracking-[0.18em] text-gray-500">Points Tracked</p>
// //                   <p className="mt-2 text-lg font-semibold text-dark">{revenueSummary.tracked}</p>
// //                 </div>
// //               </div>
// //             </div>

// //             {/* <div className="rounded-[28px] border border-[#eadfd5] bg-white p-6 shadow-sm"> */}
// //               {/* <div className="mb-5">
// //                 <h2 className="font-display text-2xl font-bold text-dark">Top Selling Items</h2>
// //                 <p className="mt-1 text-sm text-gray-500">
// //                   Best-selling items for the same report range, with units sold and revenue.
// //                 </p>
// //               </div> */}

// //               {/* <ResponsiveContainer width="100%" height={320}>
// //                 <BarChart data={topItems} margin={{ top: 10, right: 16, left: 0, bottom: 40 }}>
// //                   <CartesianGrid strokeDasharray="3 5" stroke="#ece5dd" vertical={false} />
// //                   <XAxis
// //                     dataKey="name"
// //                     angle={-28}
// //                     textAnchor="end"
// //                     interval={0}
// //                     height={80}
// //                     axisLine={false}
// //                     tickLine={false}
// //                     tick={{ fill: '#8c7b6b', fontSize: 11 }}
// //                   />
// //                   <YAxis
// //                     axisLine={false}
// //                     tickLine={false}
// //                     allowDecimals={false}
// //                     tick={{ fill: '#8c7b6b', fontSize: 12 }}
// //                   />
// //                   <Tooltip
// //                     formatter={(value) => [value, 'Units Sold']}
// //                     labelFormatter={(label) => label}
// //                     contentStyle={{
// //                       borderRadius: 18,
// //                       border: '1px solid #f0e4d6',
// //                       boxShadow: '0 14px 35px rgba(15, 23, 42, 0.08)',
// //                     }}
// //                   />
// //                   <Bar dataKey="unitsSold" radius={[8, 8, 0, 0]} fill="#f59e0b" />
// //                 </BarChart>
// //               </ResponsiveContainer> */}
// //             {/* </div> */}
// //           </section>

// //           {/* <section className="mt-6 rounded-[28px] border border-[#eadfd5] bg-white p-6 shadow-sm">
// //             <div className="mb-4">
// //               <h2 className="font-display text-2xl font-bold text-dark">Item Breakdown</h2>
// //               <p className="mt-1 text-sm text-gray-500">Detailed item-level performance for the current report window.</p>
// //             </div>

// //             <div className="overflow-x-auto">
// //               <table className="min-w-full text-left">
// //                 <thead>
// //                   <tr className="border-b border-[#efe5de] text-sm text-gray-500">
// //                     <th className="px-4 py-3">#</th>
// //                     <th className="px-4 py-3">Item</th>
// //                     <th className="px-4 py-3">Category</th>
// //                     <th className="px-4 py-3">Units Sold</th>
// //                     <th className="px-4 py-3">Revenue</th>
// //                   </tr>
// //                 </thead>
// //                 <tbody>
// //                   {itemPerformance.length ? (
// //                     itemPerformance.map((item, index) => (
// //                       <tr key={`${item.name || item._id}-${index}`} className="border-b border-[#f3ece6] text-sm text-dark">
// //                         <td className="px-4 py-3">{index + 1}</td>
// //                         <td className="px-4 py-3 font-medium">{item.name || item._id || 'Unnamed item'}</td>
// //                         <td className="px-4 py-3">{item.category || 'Uncategorized'}</td>
// //                         <td className="px-4 py-3">{item.unitsSold || 0}</td>
// //                         <td className="px-4 py-3">{currency.format(item.revenue || 0)}</td>
// //                       </tr>
// //                     ))
// //                   ) : (
// //                     <tr>
// //                       <td colSpan="5" className="px-4 py-10 text-center text-sm text-gray-400">
// //                         No report data found for this filter.
// //                       </td>
// //                     </tr>
// //                   )}
// //                 </tbody>
// //               </table>
// //             </div>
// //           </section> */}
     

// //       <section className="rounded-[28px] border border-gray-200 bg-white p-5 shadow-sm">
// //             <div className="mb-4">
// //               <h2 className="font-display text-xl font-bold text-dark">Top Selling Mix</h2>
// //               <p className="mt-1 text-sm text-gray-500">Best performers with share split and unit movement.</p>
// //             </div>

// //             <ResponsiveContainer width="100%" height={220}>
// //               <PieChart>
// //                 <Pie
// //                   data={topSellingBreakdown}
// //                   dataKey="sold"
// //                   nameKey="name"
// //                   innerRadius={52}
// //                   outerRadius={82}
// //                   paddingAngle={2}
// //                   stroke="none"
// //                 >
// //                   {topSellingBreakdown.map((item, index) => (
// //                     <Cell key={item.name} fill={PIE_COLORS[index % PIE_COLORS.length]} />
// //                   ))}
// //                 </Pie>
// //                 <Tooltip formatter={(value, _name, payload) => [`${value} sold`, `${payload?.payload?.name || 'Item'} (${payload?.payload?.share || 0}%)`]} />
// //               </PieChart>
// //             </ResponsiveContainer>

// //             <div className="mt-3 overflow-hidden rounded-2xl border border-gray-100">
// //               <table className="min-w-full text-sm">
// //                 <thead className="bg-gray-50 text-left text-gray-500">
// //                   <tr>
// //                     <th className="px-4 py-3 font-semibold">Rank</th>
// //                     <th className="px-4 py-3 font-semibold">Item</th>
// //                     <th className="px-4 py-3 font-semibold">Units</th>
// //                     <th className="px-4 py-3 font-semibold">Share</th>
// //                   </tr>
// //                 </thead>
// //                 <tbody className="divide-y divide-gray-100 bg-white">
// //                   {topSellingBreakdown.map((item) => (
// //                     <tr key={item.name}>
// //                       <td className="px-4 py-3 font-semibold text-dark">#{item.rank}</td>
// //                       <td className="px-4 py-3 text-dark">{item.name}</td>
// //                       <td className="px-4 py-3 text-gray-600">{item.sold}</td>
// //                       <td className="px-4 py-3 text-gray-600">{item.share}%</td>
// //                     </tr>
// //                   ))}
// //                   {!topSellingBreakdown.length ? (
// //                     <tr>
// //                       <td colSpan="4" className="px-4 py-6 text-center text-gray-400">No top-selling item data available.</td>
// //                     </tr>
// //                   ) : null}
// //                 </tbody>
// //               </table>
// //             </div>
// //           </section>
// //         </div>

// //         <div className="mb-6 grid gap-6 xl:grid-cols-[0.92fr,1.08fr]">
// //           <section className="rounded-[28px] border border-gray-200 bg-white p-5 shadow-sm">
// //             <h2 className="mb-4 font-display text-xl font-bold text-dark">Orders By Type</h2>
// //             <div className="space-y-4">
// //               {ordersByType.map((row) => {
// //                 const percent = overview.totalOrders ? Math.round((row.count / overview.totalOrders) * 100) : 0;
// //                 return (
// //                   <div key={row.type} className="rounded-2xl bg-gray-50 px-4 py-3">
// //                     <div className="mb-2 flex items-center justify-between text-sm">
// //                       <span className="font-semibold capitalize text-dark">{row.type}</span>
// //                       <span className="text-gray-500">{row.count} orders</span>
// //                     </div>
// //                     <div className="h-2 overflow-hidden rounded-full bg-white">
// //                       <div className="h-full rounded-full bg-primary" style={{ width: `${percent}%` }} />
// //                     </div>
// //                     <p className="mt-2 text-xs text-gray-400">{percent}% of total orders</p>
// //                   </div>
// //                 );
// //               })}
// //             </div>
// //           </section>

// //           <section className="rounded-[28px] border border-gray-200 bg-white p-5 shadow-sm">
// //             <h2 className="mb-4 font-display text-xl font-bold text-dark">Recent Deliveries</h2>
// //             <div className="overflow-x-auto">
// //               <table className="min-w-full text-sm">
// //                 <thead className="bg-gray-50 text-left text-gray-500">
// //                   <tr>
// //                     <th className="px-4 py-3 font-semibold">Order ID</th>
// //                     <th className="px-4 py-3 font-semibold">Customer</th>
// //                     <th className="px-4 py-3 font-semibold">Agent</th>
// //                     <th className="px-4 py-3 font-semibold">Status</th>
// //                     <th className="px-4 py-3 font-semibold">Address</th>
// //                   </tr>
// //                 </thead>
// //                 <tbody className="divide-y divide-gray-100 bg-white">
// //                   {recentDeliveries.map((delivery) => (
// //                     <tr key={delivery._id}>
// //                       <td className="px-4 py-3 font-semibold text-dark">{delivery.orderId}</td>
// //                       <td className="px-4 py-3 text-gray-700">{delivery.customer?.name || 'Customer'}</td>
// //                       <td className="px-4 py-3 text-gray-600">{delivery.deliveryAgent?.name || 'Unassigned'}</td>
// //                       <td className="px-4 py-3">
// //                         <span className={`badge ${delivery.status === 'delivered' ? 'badge-success' : delivery.status === 'out-for-delivery' ? 'badge-info' : 'badge-primary'}`}>
// //                           {delivery.status}
// //                         </span>
// //                       </td>
// //                       <td className="px-4 py-3 text-gray-600">{delivery.deliveryAddress?.text || 'No address provided'}</td>
// //                     </tr>
// //                   ))}
// //                   {!recentDeliveries.length ? (
// //                     <tr>
// //                       <td colSpan="5" className="px-4 py-6 text-center text-gray-400">No delivery records yet.</td>
// //                     </tr>
// //                   ) : null}
// //                 </tbody>
// //               </table>
// //             </div>
// //           </section>
// //         </div>

// //         <section className="rounded-[28px] border border-gray-200 bg-white p-5 shadow-sm">
// //           <h2 className="mb-4 font-display text-xl font-bold text-dark">Users By Role</h2>
// //           <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
// //             {usersByRole.map((row) => {
// //               const percent = overview.totalUsers ? Math.round((row.count / overview.totalUsers) * 100) : 0;
// //               return (
// //                 <div key={row.role} className="rounded-2xl bg-gray-50 px-4 py-3">
// //                   <div className="mb-2 flex items-center justify-between">
// //                     <span className="font-semibold capitalize text-dark">{row.role}</span>
// //                     <span className="text-sm text-gray-500">{row.count}</span>
// //                   </div>
// //                   <div className="h-2 overflow-hidden rounded-full bg-white">
// //                     <div className="h-full rounded-full bg-blue-600" style={{ width: `${percent}%` }} />
// //                   </div>
// //                   <p className="mt-2 text-xs text-gray-400">{percent}% of active user base</p>
// //                 </div>
// //               );
// //             })}
// //           </div>
// //         </section>
// //            {/* </div> */}
// //       </main>
// //     </div>
// //   );
// // }


// import { useEffect, useMemo } from 'react';
// import { useQuery, useQueryClient } from '@tanstack/react-query';
// import { io } from 'socket.io-client';
// import {
//   ResponsiveContainer,
//   LineChart,
//   Line,
//   PieChart,
//   Pie,
//   Cell,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
// } from 'recharts';
// import { TrendingUp, ShoppingBag, Users, Bike, ArrowUpRight, Star, MessageSquare } from 'lucide-react';
// import api from '../../services/api';
// import AdminSidebar from '../../components/admin/AdminSidebar';

// const currency = new Intl.NumberFormat('en-IN', {
//   style: 'currency',
//   currency: 'INR',
//   maximumFractionDigits: 0,
// });

// const PIE_COLORS = ['#d62828', '#f77f00', '#fcbf49', '#2a9d8f', '#457b9d', '#6c757d'];

// function MetricCard({ icon: Icon, label, value, accent }) {
//   return (
//     <div className="rounded-3xl border border-gray-200 bg-white p-4 shadow-sm">
//       <div className="mb-3 flex items-center justify-between">
//         <div className={`flex h-10 w-10 items-center justify-center rounded-2xl ${accent}`}>
//           <Icon size={18} />
//         </div>
//         <ArrowUpRight size={16} className="text-gray-300" />
//       </div>
//       <p className="text-[11px] uppercase tracking-[0.18em] text-gray-500">{label}</p>
//       <p className="mt-1 text-2xl font-display font-bold text-dark">{value}</p>
//     </div>
//   );
// }

// export default function Reports() {
//   const queryClient = useQueryClient();
//   const { data } = useQuery({
//     queryKey: ['admin-reports-overview'],
//     queryFn: () => api.get('/admin/reports/overview').then((r) => r.data),
//     refetchInterval: 20000,
//   });

//   useEffect(() => {
//     const socket = io(import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000');
//     const refreshReports = () => {
//       queryClient.invalidateQueries({ queryKey: ['admin-reports-overview'] });
//     };

//     socket.on('connect', () => socket.emit('join-room', { room: 'admin-map' }));
//     socket.on('delivery-order-changed', refreshReports);
//     socket.on('delivery-order-rejected', refreshReports);
//     socket.on('agent-status', refreshReports);
//     socket.on('agent-location', refreshReports);
//     socket.on('order-updated', refreshReports);

//     return () => {
//       socket.emit('leave-room', { room: 'admin-map' });
//       socket.close();
//     };
//   }, [queryClient]);

//   const overview = data?.overview || {};
//   const monthlyRevenueByDay = data?.monthlyRevenueByDay || [];
//   const topSellingItems = data?.topSellingItems || [];
//   const recentDeliveries = data?.recentDeliveries || [];
//   const reviewSummary = data?.reviewSummary || {};
//   const recentCustomerReviews = data?.recentCustomerReviews || [];

//   const usersByRole = useMemo(
//     () => Object.entries(data?.usersByRole || {}).map(([role, count]) => ({ role, count })),
//     [data]
//   );

//   const ordersByType = useMemo(
//     () => Object.entries(data?.ordersByType || {}).map(([type, count]) => ({ type, count })),
//     [data]
//   );

//   const topSellingTotal = useMemo(
//     () => topSellingItems.reduce((sum, item) => sum + (item.sold || 0), 0),
//     [topSellingItems]
//   );

//   const topSellingBreakdown = useMemo(
//     () =>
//       topSellingItems.map((item, index) => ({
//         rank: index + 1,
//         name: item._id || 'Unnamed item',
//         sold: item.sold || 0,
//         share: topSellingTotal ? Math.round(((item.sold || 0) / topSellingTotal) * 100) : 0,
//       })),
//     [topSellingItems, topSellingTotal]
//   );

//   const revenueSummary = useMemo(() => {
//     const values = monthlyRevenueByDay.map((item) => item.revenue || 0);
//     const total = values.reduce((sum, value) => sum + value, 0);
//     const peak = values.length ? Math.max(...values) : 0;
//     const average = values.length ? Math.round(total / values.length) : 0;
//     return { total, peak, average };
//   }, [monthlyRevenueByDay]);

//   return (
//     <div className="flex min-h-screen bg-[#f5f6f8] font-body">
//       <AdminSidebar />
//       <main className="flex-1 overflow-auto p-5 lg:p-6">
//         <div className="mb-6 rounded-[28px] bg-gradient-to-r from-[#fff7f5] via-white to-[#fff1eb] p-5 shadow-sm ring-1 ring-[#f3ddd6]">
//           <h1 className="font-display text-3xl font-bold text-dark">Reports</h1>
//           <p className="mt-1 max-w-2xl text-sm text-gray-500">
//             Sales, fulfilment, and customer activity arranged into a cleaner operations view.
//           </p>
//         </div>

//         <div className="mb-6 grid grid-cols-2 gap-4 xl:grid-cols-4">
//           <MetricCard icon={TrendingUp} label="Today Revenue" value={currency.format(overview.todayRevenue || 0)} accent="bg-rose-100 text-rose-600" />
//           <MetricCard icon={ShoppingBag} label="Total Orders" value={overview.totalOrders || 0} accent="bg-amber-100 text-amber-700" />
//           <MetricCard icon={Users} label="Active Users" value={overview.activeUsers || 0} accent="bg-blue-100 text-blue-700" />
//           <MetricCard icon={Bike} label="Delivery Online" value={overview.onlineDeliveryAgents || 0} accent="bg-emerald-100 text-emerald-700" />
//         </div>

//         <div className="mb-6 grid gap-6 xl:grid-cols-[1.35fr,0.85fr]">
//           <section className="rounded-[28px] border border-gray-200 bg-white p-5 shadow-sm">
//             <div className="mb-4 flex items-start justify-between gap-4">
//               <div>
//                 <h2 className="font-display text-xl font-bold text-dark">Monthly Revenue</h2>
//                 <p className="mt-1 text-sm text-gray-500">Current month performance with a clearer scale and smoother movement.</p>
//               </div>
//               <div className="rounded-2xl bg-rose-50 px-3 py-2 text-right">
//                 <p className="text-[11px] uppercase tracking-[0.16em] text-rose-500">Month Total</p>
//                 <p className="mt-1 text-sm font-semibold text-rose-700">{currency.format(revenueSummary.total)}</p>
//               </div>
//             </div>

//             <ResponsiveContainer width="100%" height={240}>
//               <LineChart data={monthlyRevenueByDay} margin={{ top: 8, right: 8, left: 4, bottom: 0 }}>
//                 <CartesianGrid strokeDasharray="3 5" stroke="#eceff3" vertical={false} />
//                 <XAxis
//                   dataKey="day"
//                   axisLine={false}
//                   tickLine={false}
//                   tick={{ fill: '#8b95a7', fontSize: 12 }}
//                 />
//                 <YAxis
//                   axisLine={false}
//                   tickLine={false}
//                   tick={{ fill: '#8b95a7', fontSize: 12 }}
//                   tickFormatter={(value) => currency.format(value)}
//                   width={80}
//                 />
//                 <Tooltip
//                   formatter={(value) => [currency.format(value), 'Revenue']}
//                   cursor={{ stroke: '#f3c6c6', strokeDasharray: '4 4' }}
//                   contentStyle={{ borderRadius: 16, border: '1px solid #f0e5e5', boxShadow: '0 10px 30px rgba(15,23,42,0.08)' }}
//                 />
//                 <Line
//                   type="natural"
//                   dataKey="revenue"
//                   stroke="#d62828"
//                   strokeWidth={3}
//                   dot={{ r: 3, fill: '#ffffff', stroke: '#d62828', strokeWidth: 2 }}
//                   activeDot={{ r: 5, fill: '#d62828', stroke: '#ffffff', strokeWidth: 2 }}
//                 />
//               </LineChart>
//             </ResponsiveContainer>

//             <div className="mt-4 grid grid-cols-3 gap-3">
//               <div className="rounded-2xl bg-gray-50 px-4 py-3">
//                 <p className="text-[11px] uppercase tracking-[0.16em] text-gray-500">Daily Avg</p>
//                 <p className="mt-1 text-sm font-semibold text-dark">{currency.format(revenueSummary.average)}</p>
//               </div>
//               <div className="rounded-2xl bg-gray-50 px-4 py-3">
//                 <p className="text-[11px] uppercase tracking-[0.16em] text-gray-500">Peak Day</p>
//                 <p className="mt-1 text-sm font-semibold text-dark">{currency.format(revenueSummary.peak)}</p>
//               </div>
//               <div className="rounded-2xl bg-gray-50 px-4 py-3">
//                 <p className="text-[11px] uppercase tracking-[0.16em] text-gray-500">Days Tracked</p>
//                 <p className="mt-1 text-sm font-semibold text-dark">{monthlyRevenueByDay.length}</p>
//               </div>
//             </div>

//             <div className="mt-4 rounded-[22px] border border-gray-100 bg-[#fcfcfd] p-4">
//               <div className="mb-3 flex items-start justify-between gap-3">
//                 <div>
//                   <h3 className="font-display text-lg font-bold text-dark">Ratings & Reviews</h3>
//                   <p className="mt-1 text-sm text-gray-500">Customer feedback summary placed below the monthly revenue highlights.</p>
//                 </div>
//                 <div className="rounded-2xl bg-amber-50 px-3 py-2 text-right">
//                   <p className="text-[11px] uppercase tracking-[0.16em] text-amber-500">Average</p>
//                   <p className="mt-1 flex items-center justify-end gap-1 text-sm font-semibold text-amber-700">
//                     <Star size={14} className="fill-amber-400 text-amber-400" />
//                     {Number(reviewSummary.averageRating || 0).toFixed(1)}
//                   </p>
//                 </div>
//               </div>

//               <div className="mb-3 rounded-2xl bg-white px-4 py-3">
//                 <p className="text-[11px] uppercase tracking-[0.16em] text-gray-500">Customer Rating</p>
//                 <div className="mt-2 flex items-center justify-between gap-3">
//                   <div className="flex items-center gap-2 text-amber-500">
//                     <Star size={16} className="fill-amber-400 text-amber-400" />
//                     <span className="text-base font-semibold text-dark">{Number(reviewSummary.averageRating || 0).toFixed(1)} / 5</span>
//                   </div>
//                   <span className="text-sm text-gray-500">{reviewSummary.totalReviews || 0} reviews</span>
//                 </div>
//               </div>

//               <div className="space-y-2">
//                 {recentCustomerReviews.length ? (
//                   recentCustomerReviews.map((review, index) => (
//                     <div key={`${review.title}-${index}`} className="rounded-2xl border border-gray-100 bg-white px-3 py-3">
//                       <div className="flex items-start justify-between gap-3">
//                         <div>
//                           <p className="font-semibold text-dark">{review.customerName}</p>
//                           <p className="text-xs uppercase tracking-[0.12em] text-gray-400">{review.type} • {review.title}</p>
//                         </div>
//                         <div className="flex items-center gap-1 text-amber-500">
//                           <Star size={13} className="fill-amber-400 text-amber-400" />
//                           <span className="text-sm font-semibold text-dark">{review.rating}</span>
//                         </div>
//                       </div>
//                       <p className="mt-2 text-sm text-gray-500">{review.comment || 'No written review shared.'}</p>
//                     </div>
//                   ))
//                 ) : (
//                   <div className="rounded-2xl border border-dashed border-gray-200 bg-white px-4 py-4 text-sm text-gray-400">
//                     <div className="flex items-center gap-2">
//                       <MessageSquare size={15} />
//                       No customer review activity available yet.
//                     </div>
//                   </div>
//                 )}
//               </div>
//             </div>
//           </section>

//           <section className="rounded-[28px] border border-gray-200 bg-white p-5 shadow-sm">
//             <div className="mb-4">
//               <h2 className="font-display text-xl font-bold text-dark">Top Selling Mix</h2>
//               <p className="mt-1 text-sm text-gray-500">Best performers with share split and unit movement.</p>
//             </div>

//             <ResponsiveContainer width="100%" height={220}>
//               <PieChart>
//                 <Pie
//                   data={topSellingBreakdown}
//                   dataKey="sold"
//                   nameKey="name"
//                   innerRadius={52}
//                   outerRadius={82}
//                   paddingAngle={2}
//                   stroke="none"
//                 >
//                   {topSellingBreakdown.map((item, index) => (
//                     <Cell key={item.name} fill={PIE_COLORS[index % PIE_COLORS.length]} />
//                   ))}
//                 </Pie>
//                 <Tooltip formatter={(value, _name, payload) => [`${value} sold`, `${payload?.payload?.name || 'Item'} (${payload?.payload?.share || 0}%)`]} />
//               </PieChart>
//             </ResponsiveContainer>

//             <div className="mt-3 overflow-hidden rounded-2xl border border-gray-100">
//               <table className="min-w-full text-sm">
//                 <thead className="bg-gray-50 text-left text-gray-500">
//                   <tr>
//                     <th className="px-4 py-3 font-semibold">Rank</th>
//                     <th className="px-4 py-3 font-semibold">Item</th>
//                     <th className="px-4 py-3 font-semibold">Units</th>
//                     <th className="px-4 py-3 font-semibold">Share</th>
//                   </tr>
//                 </thead>
//                 <tbody className="divide-y divide-gray-100 bg-white">
//                   {topSellingBreakdown.map((item) => (
//                     <tr key={item.name}>
//                       <td className="px-4 py-3 font-semibold text-dark">#{item.rank}</td>
//                       <td className="px-4 py-3 text-dark">{item.name}</td>
//                       <td className="px-4 py-3 text-gray-600">{item.sold}</td>
//                       <td className="px-4 py-3 text-gray-600">{item.share}%</td>
//                     </tr>
//                   ))}
//                   {!topSellingBreakdown.length ? (
//                     <tr>
//                       <td colSpan="4" className="px-4 py-6 text-center text-gray-400">No top-selling item data available.</td>
//                     </tr>
//                   ) : null}
//                 </tbody>
//               </table>
//             </div>
//           </section>
//         </div>

//         <div className="mb-6 grid gap-6 xl:grid-cols-[0.92fr,1.08fr]">
//           <section className="rounded-[28px] border border-gray-200 bg-white p-5 shadow-sm">
//             <h2 className="mb-4 font-display text-xl font-bold text-dark">Orders By Type</h2>
//             <div className="space-y-4">
//               {ordersByType.map((row) => {
//                 const percent = overview.totalOrders ? Math.round((row.count / overview.totalOrders) * 100) : 0;
//                 return (
//                   <div key={row.type} className="rounded-2xl bg-gray-50 px-4 py-3">
//                     <div className="mb-2 flex items-center justify-between text-sm">
//                       <span className="font-semibold capitalize text-dark">{row.type}</span>
//                       <span className="text-gray-500">{row.count} orders</span>
//                     </div>
//                     <div className="h-2 overflow-hidden rounded-full bg-white">
//                       <div className="h-full rounded-full bg-primary" style={{ width: `${percent}%` }} />
//                     </div>
//                     <p className="mt-2 text-xs text-gray-400">{percent}% of total orders</p>
//                   </div>
//                 );
//               })}
//             </div>
//           </section>

//           <section className="rounded-[28px] border border-gray-200 bg-white p-5 shadow-sm">
//             <h2 className="mb-4 font-display text-xl font-bold text-dark">Recent Deliveries</h2>
//             <div className="overflow-x-auto">
//               <table className="min-w-full text-sm">
//                 <thead className="bg-gray-50 text-left text-gray-500">
//                   <tr>
//                     <th className="px-4 py-3 font-semibold">Order ID</th>
//                     <th className="px-4 py-3 font-semibold">Customer</th>
//                     <th className="px-4 py-3 font-semibold">Agent</th>
//                     <th className="px-4 py-3 font-semibold">Status</th>
//                     <th className="px-4 py-3 font-semibold">Address</th>
//                   </tr>
//                 </thead>
//                 <tbody className="divide-y divide-gray-100 bg-white">
//                   {recentDeliveries.map((delivery) => (
//                     <tr key={delivery._id}>
//                       <td className="px-4 py-3 font-semibold text-dark">{delivery.orderId}</td>
//                       <td className="px-4 py-3 text-gray-700">{delivery.customer?.name || 'Customer'}</td>
//                       <td className="px-4 py-3 text-gray-600">{delivery.deliveryAgent?.name || 'Unassigned'}</td>
//                       <td className="px-4 py-3">
//                         <span className={`badge ${delivery.status === 'delivered' ? 'badge-success' : delivery.status === 'out-for-delivery' ? 'badge-info' : 'badge-primary'}`}>
//                           {delivery.status}
//                         </span>
//                       </td>
//                       <td className="px-4 py-3 text-gray-600">{delivery.deliveryAddress?.text || 'No address provided'}</td>
//                     </tr>
//                   ))}
//                   {!recentDeliveries.length ? (
//                     <tr>
//                       <td colSpan="5" className="px-4 py-6 text-center text-gray-400">No delivery records yet.</td>
//                     </tr>
//                   ) : null}
//                 </tbody>
//               </table>
//             </div>
//           </section>
//         </div>

//         <section className="rounded-[28px] border border-gray-200 bg-white p-5 shadow-sm">
//           <h2 className="mb-4 font-display text-xl font-bold text-dark">Users By Role</h2>
//           <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
//             {usersByRole.map((row) => {
//               const percent = overview.totalUsers ? Math.round((row.count / overview.totalUsers) * 100) : 0;
//               return (
//                 <div key={row.role} className="rounded-2xl bg-gray-50 px-4 py-3">
//                   <div className="mb-2 flex items-center justify-between">
//                     <span className="font-semibold capitalize text-dark">{row.role}</span>
//                     <span className="text-sm text-gray-500">{row.count}</span>
//                   </div>
//                   <div className="h-2 overflow-hidden rounded-full bg-white">
//                     <div className="h-full rounded-full bg-blue-600" style={{ width: `${percent}%` }} />
//                   </div>
//                   <p className="mt-2 text-xs text-gray-400">{percent}% of active user base</p>
//                 </div>
//               );
//             })}
//           </div>
//         </section>
//       </main>
//     </div>
//   );
// }

import { useEffect, useMemo, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { io } from 'socket.io-client';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';
import { TrendingUp, ShoppingBag, Users, Bike, ArrowUpRight, Star, MessageSquare } from 'lucide-react';
import api from '../../services/api';
import AdminSidebar from '../../components/admin/AdminSidebar';

const currency = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0,
});

const PIE_COLORS = ['#d62828', '#f77f00', '#fcbf49', '#2a9d8f', '#457b9d', '#6c757d'];

const REVENUE_FILTERS = [
  { key: 'today', label: 'Day' },
  { key: 'last7days', label: 'Week' },
  { key: 'last30days', label: 'Month' },
];

function MetricCard({ icon: Icon, label, value, accent }) {
  return (
    <div className="rounded-3xl border border-gray-200 bg-white p-4 shadow-sm transition-all hover:shadow-md">
      <div className="mb-3 flex items-center justify-between">
        <div className={`flex h-10 w-10 items-center justify-center rounded-2xl ${accent}`}>
          <Icon size={18} />
        </div>
        <ArrowUpRight size={16} className="text-gray-300" />
      </div>
      <p className="text-[11px] uppercase tracking-[0.18em] text-gray-500">{label}</p>
      <p className="mt-1 text-2xl font-display font-bold text-dark">{value}</p>
    </div>
  );
}

function StatusBadge({ status }) {
  const getStatusStyles = () => {
    switch (status) {
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'out-for-delivery':
        return 'bg-blue-100 text-blue-800';
      case 'preparing':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = () => {
    switch (status) {
      case 'delivered':
        return 'Delivered';
      case 'out-for-delivery':
        return 'Out for Delivery';
      case 'preparing':
        return 'Preparing';
      default:
        return status;
    }
  };

  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusStyles()}`}>
      {getStatusLabel()}
    </span>
  );
}

export default function Reports() {
  const queryClient = useQueryClient();

  // ✅ Revenue range filter state — default to last 7 days (Week)
  const [revenueRange, setRevenueRange] = useState('last7days');

  const { data, isLoading, error } = useQuery({
    // ✅ Include revenueRange in query key so it refetches on filter change
    queryKey: ['admin-reports-overview', revenueRange],
    queryFn: () => api.get(`/admin/reports/overview?range=${revenueRange}`).then((r) => r.data),
    refetchInterval: 20000,
  });

  useEffect(() => {
    const socket = io(import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000');
    const refreshReports = () => {
      queryClient.invalidateQueries({ queryKey: ['admin-reports-overview'] });
    };

    socket.on('connect', () => socket.emit('join-room', { room: 'admin-map' }));
    socket.on('delivery-order-changed', refreshReports);
    socket.on('delivery-order-rejected', refreshReports);
    socket.on('agent-status', refreshReports);
    socket.on('agent-location', refreshReports);
    socket.on('order-updated', refreshReports);

    return () => {
      socket.emit('leave-room', { room: 'admin-map' });
      socket.disconnect();
    };
  }, [queryClient]);

  const overview = data?.overview || {};
  const monthlyRevenueByDay = data?.monthlyRevenueByDay || [];
  const topSellingItems = data?.topSellingItems || [];
  const recentDeliveries = data?.recentDeliveries || [];
  const reviewSummary = data?.reviewSummary || {};
  const recentCustomerReviews = data?.recentCustomerReviews || [];

  // ✅ Chart title and summary label come from the backend based on active range
  const revenueChartTitle = data?.revenueChartTitle || 'Revenue';
  const revenueSummaryLabel = data?.revenueSummaryLabel || 'Total';

  const usersByRole = useMemo(
    () => Object.entries(data?.usersByRole || {}).map(([role, count]) => ({ role, count })),
    [data]
  );

  const ordersByType = useMemo(
    () => Object.entries(data?.ordersByType || {}).map(([type, count]) => ({ type, count })),
    [data]
  );

  const topSellingTotal = useMemo(
    () => topSellingItems.reduce((sum, item) => sum + (item.sold || 0), 0),
    [topSellingItems]
  );

  const topSellingBreakdown = useMemo(
    () =>
      topSellingItems.map((item, index) => ({
        rank: index + 1,
        name: item._id || item.name || 'Unnamed item',
        sold: item.sold || 0,
        share: topSellingTotal ? Math.round(((item.sold || 0) / topSellingTotal) * 100) : 0,
      })),
    [topSellingItems, topSellingTotal]
  );

  const revenueSummary = useMemo(() => {
    const values = monthlyRevenueByDay.map((item) => item.revenue || 0);
    const total = values.reduce((sum, value) => sum + value, 0);
    const peak = values.length ? Math.max(...values) : 0;
    const average = values.length ? Math.round(total / values.length) : 0;
    return { total, peak, average };
  }, [monthlyRevenueByDay]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen bg-[#f5f6f8]">
        <AdminSidebar />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading reports...</p>
          </div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen bg-[#f5f6f8]">
        <AdminSidebar />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-red-600">Error loading reports. Please try again later.</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#f5f6f8] font-body">
      <AdminSidebar />
      <main className="flex-1 overflow-auto p-5 lg:p-6">
        {/* Header Section */}
        <div className="mb-6 rounded-[28px] bg-gradient-to-r from-[#fff7f5] via-white to-[#fff1eb] p-5 shadow-sm ring-1 ring-[#f3ddd6]">
          <h1 className="font-display text-3xl font-bold text-dark">Reports</h1>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            Sales, fulfilment, and customer activity arranged into a cleaner operations view.
          </p>
        </div>

        {/* Metric Cards */}
        <div className="mb-6 grid grid-cols-2 gap-4 xl:grid-cols-4">
          <MetricCard
            icon={TrendingUp}
            label="Today Revenue"
            value={currency.format(overview.todayRevenue || 0)}
            accent="bg-rose-100 text-rose-600"
          />
          <MetricCard
            icon={ShoppingBag}
            label="Total Orders"
            value={overview.totalOrders || 0}
            accent="bg-amber-100 text-amber-700"
          />
          <MetricCard
            icon={Users}
            label="Active Users"
            value={overview.activeUsers || 0}
            accent="bg-blue-100 text-blue-700"
          />
          <MetricCard
            icon={Bike}
            label="Delivery Online"
            value={overview.onlineDeliveryAgents || 0}
            accent="bg-emerald-100 text-emerald-700"
          />
        </div>

        {/* Main Grid */}
        <div className="mb-6 grid gap-6 xl:grid-cols-[1.35fr,0.85fr]">
          {/* Monthly Revenue Section */}
          <section className="rounded-[28px] border border-gray-200 bg-white p-5 shadow-sm">

            {/* ✅ Header with Day / Week / Month filter buttons */}
            <div className="mb-4 flex flex-wrap items-start justify-between gap-4">
              <div>
                <h2 className="font-display text-xl font-bold text-dark">{revenueChartTitle}</h2>
                <p className="mt-1 text-sm text-gray-500">
                  Revenue performance with a clearer scale and smoother movement.
                </p>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                {/* Filter Buttons */}
                {/* <div className="flex items-center gap-1 rounded-2xl bg-gray-100 p-1">
                  {REVENUE_FILTERS.map(({ key, label }) => (
                    <button
                      key={key}
                      onClick={() => setRevenueRange(key)}
                      className={`rounded-xl px-3 py-1.5 text-xs font-semibold transition-all ${
                        revenueRange === key
                          ? 'bg-white text-rose-600 shadow-sm'
                          : 'text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div> */}
                {/* Summary Badge */}
                <div className="rounded-2xl bg-rose-50 px-3 py-2 text-right">
                  <p className="text-[11px] uppercase tracking-[0.16em] text-rose-500">
                    {revenueSummaryLabel}
                  </p>
                  <p className="mt-1 text-sm font-semibold text-rose-700">
                    {currency.format(revenueSummary.total)}
                  </p>
                </div>
              </div>
            </div>

            {/* ✅ Line Chart — domain starts at 0 so line never dips below baseline */}
            <div className="w-full" style={{ minHeight: '260px' }}>
              <ResponsiveContainer width="100%" height={260}>
                <LineChart data={monthlyRevenueByDay} margin={{ top: 10, right: 10, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 5" stroke="#eceff3" vertical={false} />
                  <XAxis
                    dataKey="day"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#8b95a7', fontSize: 12 }}
                    interval={revenueRange === 'last30days' ? 4 : 0}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#8b95a7', fontSize: 12 }}
                    tickFormatter={(value) => `₹${value.toLocaleString('en-IN')}`}
                    width={70}
                    domain={[0, 'auto']}
                  />
                  <Tooltip
                    formatter={(value) => [currency.format(value), 'Revenue']}
                    cursor={{ stroke: '#f3c6c6', strokeDasharray: '4 4' }}
                    contentStyle={{
                      borderRadius: 16,
                      border: '1px solid #f0e5e5',
                      boxShadow: '0 10px 30px rgba(15,23,42,0.08)',
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="revenue"
                    stroke="#d62828"
                    strokeWidth={3}
                    dot={{ r: 4, fill: '#ffffff', stroke: '#d62828', strokeWidth: 2 }}
                    activeDot={{ r: 6, fill: '#d62828', stroke: '#ffffff', strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Stats Cards */}
            <div className="mt-4 grid grid-cols-3 gap-3">
              <div className="rounded-2xl bg-gray-50 px-4 py-3">
                <p className="text-[11px] uppercase tracking-[0.16em] text-gray-500">
                  {revenueRange === 'today' ? 'Hourly Avg' : 'Daily Avg'}
                </p>
                <p className="mt-1 text-sm font-semibold text-dark">{currency.format(revenueSummary.average)}</p>
              </div>
              <div className="rounded-2xl bg-gray-50 px-4 py-3">
                <p className="text-[11px] uppercase tracking-[0.16em] text-gray-500">
                  {revenueRange === 'today' ? 'Peak Hour' : 'Peak Day'}
                </p>
                <p className="mt-1 text-sm font-semibold text-dark">{currency.format(revenueSummary.peak)}</p>
              </div>
              <div className="rounded-2xl bg-gray-50 px-4 py-3">
                <p className="text-[11px] uppercase tracking-[0.16em] text-gray-500">
                  {revenueRange === 'today' ? 'Hours Tracked' : 'Days Tracked'}
                </p>
                <p className="mt-1 text-sm font-semibold text-dark">{monthlyRevenueByDay.length}</p>
              </div>
            </div>

            {/* Ratings & Reviews Section */}
            <div className="mt-4 rounded-[22px] border border-gray-100 bg-[#fcfcfd] p-4">
              <div className="mb-3 flex items-start justify-between gap-3">
                <div>
                  <h3 className="font-display text-lg font-bold text-dark">Ratings & Reviews</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Customer feedback summary placed below the monthly revenue highlights.
                  </p>
                </div>
                <div className="rounded-2xl bg-amber-50 px-3 py-2 text-right">
                  <p className="text-[11px] uppercase tracking-[0.16em] text-amber-500">Average</p>
                  <p className="mt-1 flex items-center justify-end gap-1 text-sm font-semibold text-amber-700">
                    <Star size={14} className="fill-amber-400 text-amber-400" />
                    {Number(reviewSummary.averageRating || 0).toFixed(1)}
                  </p>
                </div>
              </div>

              <div className="mb-3 rounded-2xl bg-white px-4 py-3">
                <p className="text-[11px] uppercase tracking-[0.16em] text-gray-500">Customer Rating</p>
                <div className="mt-2 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2 text-amber-500">
                    <Star size={16} className="fill-amber-400 text-amber-400" />
                    <span className="text-base font-semibold text-dark">
                      {Number(reviewSummary.averageRating || 0).toFixed(1)} / 5
                    </span>
                  </div>
                  <span className="text-sm text-gray-500">{reviewSummary.totalReviews || 0} reviews</span>
                </div>
              </div>

              <div className="space-y-2">
                {recentCustomerReviews.length > 0 ? (
                  recentCustomerReviews.map((review, index) => (
                    <div key={`${review.title}-${index}`} className="rounded-2xl border border-gray-100 bg-white px-3 py-3">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="font-semibold text-dark">{review.customerName}</p>
                          <p className="text-xs uppercase tracking-[0.12em] text-gray-400">
                            {review.type} • {review.title}
                          </p>
                        </div>
                        <div className="flex items-center gap-1 text-amber-500">
                          <Star size={13} className="fill-amber-400 text-amber-400" />
                          <span className="text-sm font-semibold text-dark">{review.rating}</span>
                        </div>
                      </div>
                      <p className="mt-2 text-sm text-gray-500">
                        {review.comment || 'No written review shared.'}
                      </p>
                    </div>
                  ))
                ) : (
                  <div className="rounded-2xl border border-dashed border-gray-200 bg-white px-4 py-4 text-sm text-gray-400">
                    <div className="flex items-center gap-2">
                      <MessageSquare size={15} />
                      No customer review activity available yet.
                    </div>
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* Top Selling Mix Section */}
          <section className="rounded-[28px] border border-gray-200 bg-white p-5 shadow-sm">
            <div className="mb-4">
              <h2 className="font-display text-xl font-bold text-dark">Top Selling Mix</h2>
              <p className="mt-1 text-sm text-gray-500">
                Best performers with share split and unit movement.
              </p>
            </div>

            {/* Pie Chart */}
            <div className="w-full" style={{ minHeight: '240px' }}>
              <ResponsiveContainer width="100%" height={240}>
                <PieChart>
                  <Pie
                    data={topSellingBreakdown}
                    dataKey="sold"
                    nameKey="name"
                    innerRadius={55}
                    outerRadius={85}
                    paddingAngle={2}
                    stroke="none"
                  >
                    {topSellingBreakdown.map((item, index) => (
                      <Cell key={item.name} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value, name, props) => {
                      const item = props?.payload;
                      return [`${value} sold`, `${item?.name || 'Item'} (${item?.share || 0}%)`];
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Top Selling Table */}
            <div className="mt-3 overflow-hidden rounded-2xl border border-gray-100">
              <table className="min-w-full text-sm">
                <thead className="bg-gray-50 text-left text-gray-500">
                  <tr>
                    <th className="px-4 py-3 font-semibold">Rank</th>
                    <th className="px-4 py-3 font-semibold">Item</th>
                    <th className="px-4 py-3 font-semibold">Units</th>
                    <th className="px-4 py-3 font-semibold">Share</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 bg-white">
                  {topSellingBreakdown.length > 0 ? (
                    topSellingBreakdown.map((item) => (
                      <tr key={item.name}>
                        <td className="px-4 py-3 font-semibold text-dark">#{item.rank}</td>
                        <td className="px-4 py-3 text-dark">{item.name}</td>
                        <td className="px-4 py-3 text-gray-600">{item.sold}</td>
                        <td className="px-4 py-3 text-gray-600">{item.share}%</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="px-4 py-6 text-center text-gray-400">
                        No top-selling item data available.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </div>

        {/* Secondary Grid */}
        <div className="mb-6 grid gap-6 xl:grid-cols-[0.92fr,1.08fr]">
          {/* Orders By Type */}
          <section className="rounded-[28px] border border-gray-200 bg-white p-5 shadow-sm">
            <h2 className="mb-4 font-display text-xl font-bold text-dark">Orders By Type</h2>
            <div className="space-y-4">
              {ordersByType.length > 0 ? (
                ordersByType.map((row) => {
                  const percent = overview.totalOrders
                    ? Math.round((row.count / overview.totalOrders) * 100)
                    : 0;
                  return (
                    <div key={row.type} className="rounded-2xl bg-gray-50 px-4 py-3">
                      <div className="mb-2 flex items-center justify-between text-sm">
                        <span className="font-semibold capitalize text-dark">{row.type}</span>
                        <span className="text-gray-500">{row.count} orders</span>
                      </div>
                      <div className="h-2 overflow-hidden rounded-full bg-white">
                        <div
                          className="h-full rounded-full bg-primary"
                          style={{ width: `${percent}%`, backgroundColor: '#d62828' }}
                        />
                      </div>
                      <p className="mt-2 text-xs text-gray-400">{percent}% of total orders</p>
                    </div>
                  );
                })
              ) : (
                <div className="rounded-2xl bg-gray-50 px-4 py-6 text-center text-gray-400">
                  No order data available
                </div>
              )}
            </div>
          </section>

          {/* Recent Deliveries */}
          <section className="rounded-[28px] border border-gray-200 bg-white p-5 shadow-sm">
            <h2 className="mb-4 font-display text-xl font-bold text-dark">Recent Deliveries</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="bg-gray-50 text-left text-gray-500">
                  <tr>
                    <th className="px-4 py-3 font-semibold">Order ID</th>
                    <th className="px-4 py-3 font-semibold">Customer</th>
                    <th className="px-4 py-3 font-semibold">Agent</th>
                    <th className="px-4 py-3 font-semibold">Status</th>
                    <th className="px-4 py-3 font-semibold">Address</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 bg-white">
                  {recentDeliveries.length > 0 ? (
                    recentDeliveries.map((delivery) => (
                      <tr key={delivery._id}>
                        <td className="px-4 py-3 font-semibold text-dark">{delivery.orderId}</td>
                        <td className="px-4 py-3 text-gray-700">
                          {delivery.customer?.name || 'Customer'}
                        </td>
                        <td className="px-4 py-3 text-gray-600">
                          {delivery.deliveryAgent?.name || 'Unassigned'}
                        </td>
                        <td className="px-4 py-3">
                          <StatusBadge status={delivery.status} />
                        </td>
                        <td className="px-4 py-3 text-gray-600">
                          {delivery.deliveryAddress?.text || 'No address provided'}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="px-4 py-6 text-center text-gray-400">
                        No delivery records yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </div>

        {/* Users By Role Section */}
        <section className="rounded-[28px] border border-gray-200 bg-white p-5 shadow-sm">
          <h2 className="mb-4 font-display text-xl font-bold text-dark">Users By Role</h2>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {usersByRole.length > 0 ? (
              usersByRole.map((row) => {
                const percent = overview.totalUsers
                  ? Math.round((row.count / overview.totalUsers) * 100)
                  : 0;
                return (
                  <div key={row.role} className="rounded-2xl bg-gray-50 px-4 py-3">
                    <div className="mb-2 flex items-center justify-between">
                      <span className="font-semibold capitalize text-dark">
                        {row.role.replace(/_/g, ' ')}
                      </span>
                      <span className="text-sm text-gray-500">{row.count}</span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-white">
                      <div
                        className="h-full rounded-full bg-blue-600"
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                    <p className="mt-2 text-xs text-gray-400">{percent}% of active user base</p>
                  </div>
                );
              })
            ) : (
              <div className="col-span-full rounded-2xl bg-gray-50 px-4 py-6 text-center text-gray-400">
                No user data available
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
