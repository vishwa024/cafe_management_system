// import { Link } from 'react-router-dom';
// import { useEffect, useMemo } from 'react';
// import { useQuery, useQueryClient } from '@tanstack/react-query';
// import { io } from 'socket.io-client';
// import {
//   ResponsiveContainer,
//   AreaChart,
//   Area,
//   CartesianGrid,
//   XAxis,
//   YAxis,
//   Tooltip,
//   BarChart,
//   Bar,
// } from 'recharts';
// import {
//   IndianRupee,
//   ShoppingBag,
//   Users,
//   AlertTriangle,
//   Briefcase,
//   ChefHat,
//   Bike,
//   ShieldCheck,
//   UserRound,
//   TrendingUp,
// } from 'lucide-react';
// import api from '../../services/api';
// import AdminSidebar from '../../components/admin/AdminSidebar';

// const currency = new Intl.NumberFormat('en-IN', {
//   style: 'currency',
//   currency: 'INR',
//   maximumFractionDigits: 0,
// });

// function StatCard({ icon: Icon, title, value, sub, tone, to }) {
//   const tones = {
//     revenue: 'bg-rose-100 text-rose-600',
//     orders: 'bg-orange-100 text-orange-700',
//     users: 'bg-blue-100 text-blue-700',
//     alerts: 'bg-amber-100 text-amber-700',
//   };

//   const body = (
//     <div className="card cursor-pointer p-4 transition-all hover:shadow-card-hover">
//       <div className={`mb-3 flex h-10 w-10 items-center justify-center rounded-2xl ${tones[tone]}`}>
//         <Icon size={18} />
//       </div>
//       <p className="text-2xl font-display font-bold text-dark">{value}</p>
//       <p className="mt-1 text-sm text-gray-500">{title}</p>
//       <p className="mt-1 text-xs font-semibold text-primary">{sub}</p>
//     </div>
//   );

//   return to ? <Link to={to}>{body}</Link> : body;
// }

// function RoleMiniCard({ icon: Icon, title, total, active, tone, to }) {
//   const tones = {
//     admin: 'bg-red-100 text-red-600',
//     manager: 'bg-orange-100 text-orange-700',
//     staff: 'bg-blue-100 text-blue-700',
//     kitchen: 'bg-emerald-100 text-emerald-700',
//     delivery: 'bg-amber-100 text-amber-700',
//     customer: 'bg-violet-100 text-violet-700',
//   };

//   const body = (
//     <div className="cursor-pointer rounded-2xl border border-gray-100 bg-gray-50 p-3 transition-all hover:border-primary/30">
//       <div className={`mb-2 flex h-9 w-9 items-center justify-center rounded-2xl ${tones[tone]}`}>
//         <Icon size={16} />
//       </div>
//       <p className="text-xs uppercase tracking-wide text-gray-500">{title}</p>
//       <p className="mt-1 text-2xl font-display font-bold text-dark">{total}</p>
//       <p className="mt-1 text-xs font-semibold text-primary">{active} active now</p>
//     </div>
//   );

//   return to ? <Link to={to}>{body}</Link> : body;
// }

// export default function AdminDashboard() {
//   const queryClient = useQueryClient();
//   const { data: dashboard } = useQuery({
//     queryKey: ['admin-dashboard'],
//     queryFn: () => api.get('/admin/dashboard').then((r) => r.data),
//     refetchInterval: 15000,
//   });

//   const { data: users = [] } = useQuery({
//     queryKey: ['admin-users-dashboard'],
//     queryFn: () => api.get('/admin/users').then((r) => r.data),
//     refetchInterval: 15000,
//   });

//   const { data: inventory = [] } = useQuery({
//     queryKey: ['admin-dashboard-inventory'],
//     queryFn: () => api.get('/kitchen/inventory').then((r) => r.data).catch(() => []),
//     refetchInterval: 15000,
//   });

//   useEffect(() => {
//     const socket = io(import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000');
//     const refreshDashboard = () => {
//       queryClient.invalidateQueries({ queryKey: ['admin-dashboard'] });
//       queryClient.invalidateQueries({ queryKey: ['admin-users-dashboard'] });
//       queryClient.invalidateQueries({ queryKey: ['admin-dashboard-inventory'] });
//     };

//     socket.on('connect', () => socket.emit('join-room', { room: 'admin-map' }));
//     socket.on('delivery-order-changed', refreshDashboard);
//     socket.on('delivery-order-rejected', refreshDashboard);
//     socket.on('agent-status', refreshDashboard);
//     socket.on('agent-location', refreshDashboard);
//     socket.on('order-updated', refreshDashboard);

//     return () => {
//       socket.emit('leave-room', { room: 'admin-map' });
//       socket.close();
//     };
//   }, [queryClient]);

//   const overview = dashboard?.overview || {};
//   const revenueByDay = dashboard?.revenueByDay || [];
//   const topSellingItems = dashboard?.topSellingItems || [];
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
//     const values = revenueByDay.map((item) => item.revenue || 0);
//     const total = values.reduce((sum, value) => sum + value, 0);
//     const peak = values.length ? Math.max(...values) : 0;
//     const average = values.length ? Math.round(total / values.length) : 0;
//     return { total, peak, average };
//   }, [revenueByDay]);
//   const revenueTrendInsights = useMemo(() => {
//     let profitDays = 0;
//     let lossDays = 0;

//     for (let index = 1; index < revenueByDay.length; index += 1) {
//       const previous = revenueByDay[index - 1]?.revenue || 0;
//       const current = revenueByDay[index]?.revenue || 0;

//       if (current > previous) profitDays += 1;
//       if (current < previous) lossDays += 1;
//     }

//     return { profitDays, lossDays };
//   }, [revenueByDay]);
//   const lowStockAlerts = useMemo(
//     () => inventory.filter((item) => item.currentStock <= item.minThreshold).length,
//     [inventory]
//   );

//   const stats = useMemo(() => {
//     const byRole = (role) => users.filter((u) => u.role === role);
//     const active = (role) => byRole(role).filter((u) => u.isActive).length;
//     const teamRoles = ['admin', 'manager', 'staff', 'kitchen', 'delivery'];
//     const teamUsers = users.filter((u) => teamRoles.includes(u.role));

//     return {
//       admins: { total: byRole('admin').length, active: active('admin') },
//       managers: { total: byRole('manager').length, active: active('manager') },
//       staff: { total: byRole('staff').length, active: active('staff') },
//       kitchen: { total: byRole('kitchen').length, active: active('kitchen') },
//       delivery: { total: byRole('delivery').length, active: active('delivery') },
//       customers: { total: byRole('customer').length, active: active('customer') },
//       teamTotal: teamUsers.length,
//       teamActive: teamUsers.filter((u) => u.isActive).length,
//     };
//   }, [users]);

//   return (
//     <div className="flex min-h-screen bg-gray-50 font-body">
//       <AdminSidebar />
//       <main className="flex-1 overflow-auto p-6 lg:p-8">
//         <div className="mb-6">
//           <p className="text-gray-500 text-sm">
//             Welcome back, Super Admin. Here&apos;s what&apos;s happening at Roller Coaster Cafe.
//           </p>
//         </div>

//         <div className="mb-6 grid grid-cols-2 gap-4 xl:grid-cols-4">
//           <StatCard
//             icon={IndianRupee}
//             title="Today's Revenue"
//             value={currency.format(overview.todayRevenue || 0)}
//             sub={`${overview.revenueDelta >= 0 ? '+' : ''}${overview.revenueDelta || 0}% vs yesterday`}
//             tone="revenue"
//             to="/admin/reports"
//           />
//           <StatCard
//             icon={ShoppingBag}
//             title="Active Orders"
//             value={overview.activeOrders || 0}
//             sub={`${dashboard?.ordersByStatus?.['out-for-delivery'] || 0} out for delivery`}
//             tone="orders"
//             to="/admin/orders"
//           />
//           <StatCard
//             icon={Users}
//             title="Total Team"
//             value={stats.teamTotal}
//             sub={`${stats.teamActive} active now`}
//             tone="users"
//             to="/admin/users"
//           />
//           <StatCard
//             icon={AlertTriangle}
//             title="Low Stock Alerts"
//             value={lowStockAlerts}
//             sub={lowStockAlerts ? 'Needs attention' : 'All items look healthy'}
//             tone="alerts"
//             to="/admin/menu"
//           />
//         </div>

//         <div className="card mb-6 p-5">
//           <div className="mb-4">
//             <h2 className="font-display text-2xl font-bold text-dark">Users Overview</h2>
//             <p className="text-gray-500 mt-1">All website users and all panel users</p>
//           </div>

//           <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
//             <RoleMiniCard icon={ShieldCheck} title="Admins" total={stats.admins.total} active={stats.admins.active} tone="admin" to="/admin/users" />
//             <RoleMiniCard icon={Briefcase} title="Managers" total={stats.managers.total} active={stats.managers.active} tone="manager" to="/admin/users" />
//             <RoleMiniCard icon={Users} title="Staff" total={stats.staff.total} active={stats.staff.active} tone="staff" to="/admin/users" />
//             <RoleMiniCard icon={ChefHat} title="Kitchen" total={stats.kitchen.total} active={stats.kitchen.active} tone="kitchen" to="/admin/users" />
//             <RoleMiniCard icon={Bike} title="Delivery" total={stats.delivery.total} active={stats.delivery.active} tone="delivery" to="/admin/users" />
//             <RoleMiniCard icon={UserRound} title="Customers" total={stats.customers.total} active={stats.customers.active} tone="customer" to="/admin/customers" />
//           </div>
//         </div>

//         <div className="grid gap-6 xl:grid-cols-[1.1fr,0.9fr]">
//           <div className="overflow-hidden rounded-[28px] border border-gray-200 bg-white p-5 shadow-sm">
//             <div className="mb-4 flex items-start justify-between gap-4">
//               <div>
//                 <div className="mb-2 flex items-center gap-2">
//                   <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-rose-100 text-rose-600">
//                     <TrendingUp size={18} />
//                   </div>
//                   <span className="text-xs font-semibold uppercase tracking-[0.18em] text-rose-500">Revenue Pulse</span>
//                 </div>
//                 <h2 className="font-display text-2xl font-bold text-dark">Weekly Revenue</h2>
//                 <p className="mt-1 text-sm text-gray-500">Track momentum across the last 7 days with a cleaner visual snapshot.</p>
//               </div>
//               <div className="rounded-2xl bg-rose-50 px-4 py-3 text-right shadow-sm ring-1 ring-rose-100">
//                 <p className="text-[11px] uppercase tracking-[0.16em] text-gray-500">7 Day Total</p>
//                 <p className="mt-1 text-lg font-bold text-dark">{currency.format(revenueSummary.total)}</p>
//               </div>
//             </div>

//             <ResponsiveContainer width="100%" height={230}>
//               <AreaChart data={revenueByDay} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
//                 <defs>
//                   <linearGradient id="dashboardRevenueFill" x1="0" y1="0" x2="0" y2="1">
//                     <stop offset="5%" stopColor="#ef4444" stopOpacity={0.32} />
//                     <stop offset="95%" stopColor="#ef4444" stopOpacity={0.04} />
//                   </linearGradient>
//                 </defs>
//                 <CartesianGrid strokeDasharray="3 5" stroke="#eceff3" vertical={false} />
//                 <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#8f8f95', fontSize: 12 }} />
//                 <YAxis
//                   axisLine={false}
//                   tickLine={false}
//                   tick={{ fill: '#8f8f95', fontSize: 12 }}
//                   tickFormatter={(v) => currency.format(v)}
//                   width={78}
//                 />
//                 <Tooltip
//                   formatter={(value) => [currency.format(value), 'Revenue']}
//                   contentStyle={{ borderRadius: 16, border: '1px solid #f4d5d2', boxShadow: '0 12px 30px rgba(15,23,42,0.08)' }}
//                   cursor={{ stroke: '#ef4444', strokeDasharray: '4 4', opacity: 0.3 }}
//                 />
//                 <Area
//                   type="monotone"
//                   dataKey="revenue"
//                   stroke="#dc2626"
//                   strokeWidth={3}
//                   fill="url(#dashboardRevenueFill)"
//                   dot={{ r: 3, fill: '#ffffff', stroke: '#dc2626', strokeWidth: 2 }}
//                   activeDot={{ r: 5, fill: '#dc2626', stroke: '#ffffff', strokeWidth: 2 }}
//                 />
//               </AreaChart>
//             </ResponsiveContainer>

//             <div className="mt-4 grid grid-cols-3 gap-3">
//               <div className="rounded-2xl bg-gray-50 px-4 py-3 ring-1 ring-gray-100">
//                 <p className="text-[11px] uppercase tracking-[0.16em] text-gray-500">Daily Avg</p>
//                 <p className="mt-1 text-sm font-semibold text-dark">{currency.format(revenueSummary.average)}</p>
//               </div>
//               <div className="rounded-2xl bg-gray-50 px-4 py-3 ring-1 ring-gray-100">
//                 <p className="text-[11px] uppercase tracking-[0.16em] text-gray-500">Profit Days</p>
//                 <p className="mt-1 text-sm font-semibold text-emerald-600">{revenueTrendInsights.profitDays}</p>
//               </div>
//               <div className="rounded-2xl bg-gray-50 px-4 py-3 ring-1 ring-gray-100">
//                 <p className="text-[11px] uppercase tracking-[0.16em] text-gray-500">Loss Days</p>
//                 <p className="mt-1 text-sm font-semibold text-rose-600">{revenueTrendInsights.lossDays}</p>
//               </div>
//             </div>

//             <div className="mt-3 rounded-2xl bg-gray-50 px-4 py-3 ring-1 ring-gray-100">
//               <div className="flex items-center justify-between gap-3 text-sm">
//                 <span className="font-medium text-dark">Best revenue day this week</span>
//                 <span className="font-semibold text-dark">{currency.format(revenueSummary.peak)}</span>
//               </div>
//             </div>
//           </div>

//           <div className="card p-5">
//             <h2 className="mb-4 font-display text-2xl font-bold text-dark">Top Selling Items</h2>
//             <ResponsiveContainer width="100%" height={190}>
//               <BarChart data={topSellingBreakdown} layout="vertical" barSize={16}>
//                 <XAxis type="number" hide />
//                 <YAxis type="category" dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#4b5563', fontSize: 14 }} width={140} />
//                 <Tooltip formatter={(value) => [`${value}`, 'Sold']} />
//                 <Bar dataKey="sold" fill="#ef4444" radius={[0, 8, 8, 0]} />
//               </BarChart>
//             </ResponsiveContainer>

//             <div className="mt-5 overflow-hidden rounded-2xl border border-gray-100">
//               <table className="min-w-full text-sm">
//                 <thead className="bg-gray-50 text-left text-gray-500">
//                   <tr>
//                     <th className="px-4 py-3 font-semibold">Rank</th>
//                     <th className="px-4 py-3 font-semibold">Item</th>
//                     <th className="px-4 py-3 font-semibold">Sold</th>
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
//                       <td colSpan="4" className="px-4 py-6 text-center text-gray-400">No sales data available yet.</td>
//                     </tr>
//                   ) : null}
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         </div>
//       </main>
//     </div>
//   );
// }


import { Link } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { io } from 'socket.io-client';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
} from 'recharts';
import {
  IndianRupee,
  ShoppingBag,
  Users,
  AlertTriangle,
  Briefcase,
  ChefHat,
  Bike,
  ShieldCheck,
  UserRound,
  TrendingUp,
} from 'lucide-react';
import api from '../../services/api';
import AdminSidebar from '../../components/admin/AdminSidebar';

const currency = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0,
});

function StatCard({ icon: Icon, title, value, sub, tone, to }) {
  const tones = {
    revenue: 'bg-rose-100 text-rose-600',
    orders: 'bg-amber-100 text-amber-700',
    users: 'bg-blue-100 text-blue-700',
    alerts: 'bg-orange-100 text-orange-700',
  };

  const body = (
    <div className="bg-white border border-[#e8e0d6] rounded-xl p-5 transition-all hover:shadow-md cursor-pointer">
      <div className={`mb-3 flex h-11 w-11 items-center justify-center rounded-xl ${tones[tone]}`}>
        <Icon size={18} />
      </div>
      <p className="text-2xl font-bold text-[#3f3328]">{value}</p>
      <p className="mt-1 text-sm text-[#6b5f54]">{title}</p>
      <p className="mt-1 text-xs font-semibold text-[#b97844]">{sub}</p>
    </div>
  );

  return to ? <Link to={to}>{body}</Link> : body;
}

function RoleMiniCard({ icon: Icon, title, total, active, tone, to }) {
  const tones = {
    admin: 'bg-red-100 text-red-600',
    manager: 'bg-orange-100 text-orange-700',
    staff: 'bg-blue-100 text-blue-700',
    kitchen: 'bg-emerald-100 text-emerald-700',
    delivery: 'bg-amber-100 text-amber-700',
    customer: 'bg-violet-100 text-violet-700',
  };

  const body = (
    <div className="bg-white border border-[#e8e0d6] rounded-xl p-4 transition-all hover:shadow-md cursor-pointer">
      <div className={`mb-2 flex h-10 w-10 items-center justify-center rounded-xl ${tones[tone]}`}>
        <Icon size={16} />
      </div>
      <p className="text-xs uppercase tracking-wide text-[#6b5f54]">{title}</p>
      <p className="mt-1 text-2xl font-bold text-[#3f3328]">{total}</p>
      <p className="mt-1 text-xs font-semibold text-[#b97844]">{active} active now</p>
    </div>
  );

  return to ? <Link to={to}>{body}</Link> : body;
}

export default function AdminDashboard() {
  const queryClient = useQueryClient();
  const [revenueRange, setRevenueRange] = useState('last7days');
  const { data: dashboard } = useQuery({
    queryKey: ['admin-dashboard', revenueRange],
    queryFn: () => api.get('/admin/dashboard', { params: { range: revenueRange } }).then((r) => r.data),
    refetchInterval: 60000,
    staleTime: 30000,
    refetchOnWindowFocus: false,
    placeholderData: (previousData) => previousData,
  });

  const { data: users = [] } = useQuery({
    queryKey: ['admin-users-dashboard'],
    queryFn: () => api.get('/admin/users').then((r) => r.data),
    refetchInterval: 60000,
    staleTime: 60000,
    refetchOnWindowFocus: false,
  });

  const { data: inventory = [] } = useQuery({
    queryKey: ['admin-dashboard-inventory'],
    queryFn: () => api.get('/kitchen/inventory').then((r) => r.data).catch(() => []),
    refetchInterval: 60000,
    staleTime: 60000,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    const socket = io(import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000');
    const refreshDashboard = () => {
      queryClient.invalidateQueries({ queryKey: ['admin-dashboard'] });
    };
    const refreshUsers = () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users-dashboard'] });
    };

    socket.on('connect', () => socket.emit('join-room', { room: 'admin-map' }));
    socket.on('delivery-order-changed', refreshDashboard);
    socket.on('delivery-order-rejected', refreshDashboard);
    socket.on('agent-status', refreshUsers);
    socket.on('agent-location', refreshDashboard);
    socket.on('order-updated', refreshDashboard);

    return () => {
      socket.emit('leave-room', { room: 'admin-map' });
      socket.close();
    };
  }, [queryClient]);

  const overview = dashboard?.overview || {};
  const revenueByDay = dashboard?.revenueByDay || [];
  const revenueChartTitle = dashboard?.revenueChartTitle || 'Revenue Last 7 Days';
  const revenueChartDescription = dashboard?.revenueChartDescription || 'Daily revenue view';
  const revenueSummaryLabel = dashboard?.revenueSummaryLabel || '7 Day Total';
  const topSellingItems = dashboard?.topSellingItems || [];
  const topSellingTotal = useMemo(
    () => topSellingItems.reduce((sum, item) => sum + (item.sold || 0), 0),
    [topSellingItems]
  );
  const topSellingBreakdown = useMemo(
    () =>
      topSellingItems.map((item, index) => ({
        rank: index + 1,
        name: item._id || 'Unnamed item',
        sold: item.sold || 0,
        share: topSellingTotal ? Math.round(((item.sold || 0) / topSellingTotal) * 100) : 0,
      })),
    [topSellingItems, topSellingTotal]
  );
  const revenueSummary = useMemo(() => {
    const values = revenueByDay.map((item) => item.revenue || 0);
    const total = values.reduce((sum, value) => sum + value, 0);
    const peak = values.length ? Math.max(...values) : 0;
    const average = values.length ? Math.round(total / values.length) : 0;
    return { total, peak, average };
  }, [revenueByDay]);
  const revenueTrendInsights = useMemo(() => {
    let profitDays = 0;
    let lossDays = 0;

    for (let index = 1; index < revenueByDay.length; index += 1) {
      const previous = revenueByDay[index - 1]?.revenue || 0;
      const current = revenueByDay[index]?.revenue || 0;

      if (current > previous) profitDays += 1;
      if (current < previous) lossDays += 1;
    }

    return { profitDays, lossDays };
  }, [revenueByDay]);
  const lowStockAlerts = useMemo(
    () => inventory.filter((item) => item.currentStock <= item.minThreshold).length,
    [inventory]
  );

  const stats = useMemo(() => {
    const byRole = (role) => users.filter((u) => u.role === role);
    const active = (role) => byRole(role).filter((u) => u.isActive).length;
    const teamRoles = ['admin', 'manager', 'staff', 'kitchen', 'delivery'];
    const teamUsers = users.filter((u) => teamRoles.includes(u.role));

    return {
      admins: { total: byRole('admin').length, active: active('admin') },
      managers: { total: byRole('manager').length, active: active('manager') },
      staff: { total: byRole('staff').length, active: active('staff') },
      kitchen: { total: byRole('kitchen').length, active: active('kitchen') },
      delivery: { total: byRole('delivery').length, active: active('delivery') },
      customers: { total: byRole('customer').length, active: active('customer') },
      teamTotal: teamUsers.length,
      teamActive: teamUsers.filter((u) => u.isActive).length,
    };
  }, [users]);

  return (
    <div className="flex min-h-screen bg-[#faf8f5]">
      <AdminSidebar />
      <main className="flex-1 overflow-auto p-6 lg:p-8">
        <div className="mb-6">
          <h1 className="font-display text-3xl font-bold text-[#3f3328]">Dashboard</h1>
          <p className="text-sm text-[#6b5f54] mt-1">
            Welcome back, Super Admin. Here's what's happening at Roller Coaster Cafe.
          </p>
        </div>

        <div className="mb-6 grid grid-cols-2 gap-4 xl:grid-cols-4">
          <StatCard
            icon={IndianRupee}
            title="Today's Revenue"
            value={currency.format(overview.todayRevenue || 0)}
            sub={`${overview.revenueDelta >= 0 ? '+' : ''}${overview.revenueDelta || 0}% vs yesterday`}
            tone="revenue"
            to="/admin/reports"
          />
          <StatCard
            icon={ShoppingBag}
            title="Active Orders"
            value={overview.activeOrders || 0}
            sub={`${dashboard?.ordersByStatus?.['out-for-delivery'] || 0} out for delivery`}
            tone="orders"
            to="/admin/orders"
          />
          <StatCard
            icon={Users}
            title="Total Team"
            value={stats.teamTotal}
            sub={`${stats.teamActive} active now`}
            tone="users"
            to="/admin/users"
          />
          <StatCard
            icon={AlertTriangle}
            title="Low Stock Alerts"
            value={lowStockAlerts}
            sub={lowStockAlerts ? 'Needs attention' : 'All items look healthy'}
            tone="alerts"
            to="/admin/menu"
          />
        </div>

        <div className="bg-white border border-[#e8e0d6] rounded-xl mb-6 p-6">
          <div className="mb-5">
            <h2 className="font-display text-2xl font-bold text-[#3f3328]">Users Overview</h2>
            <p className="text-sm text-[#6b5f54] mt-1">All website users and panel users</p>
          </div>

          <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
            <RoleMiniCard icon={ShieldCheck} title="Admins" total={stats.admins.total} active={stats.admins.active} tone="admin" to="/admin/users" />
            <RoleMiniCard icon={Briefcase} title="Managers" total={stats.managers.total} active={stats.managers.active} tone="manager" to="/admin/users" />
            <RoleMiniCard icon={Users} title="Staff" total={stats.staff.total} active={stats.staff.active} tone="staff" to="/admin/users" />
            <RoleMiniCard icon={ChefHat} title="Kitchen" total={stats.kitchen.total} active={stats.kitchen.active} tone="kitchen" to="/admin/users" />
            <RoleMiniCard icon={Bike} title="Delivery" total={stats.delivery.total} active={stats.delivery.active} tone="delivery" to="/admin/users" />
            <RoleMiniCard icon={UserRound} title="Customers" total={stats.customers.total} active={stats.customers.active} tone="customer" to="/admin/customers" />
          </div>
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.1fr,0.9fr]">
          <div className="bg-white border border-[#e8e0d6] rounded-xl p-6">
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <div className="mb-3 flex items-center gap-2">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-rose-100 text-rose-600">
                    <TrendingUp size={18} />
                  </div>
                  <span className="text-xs font-semibold uppercase tracking-wide text-rose-500">Revenue Pulse</span>
                </div>
                <h2 className="font-display text-2xl font-bold text-[#3f3328]">{revenueChartTitle}</h2>
                <p className="mt-1 text-sm text-[#6b5f54]">{revenueChartDescription}</p>
              </div>
              <div className="rounded-xl bg-rose-50 px-4 py-3 text-right">
                <p className="text-xs uppercase tracking-wide text-rose-500">{revenueSummaryLabel}</p>
                <p className="mt-1 text-lg font-bold text-[#3f3328]">{currency.format(revenueSummary.total)}</p>
              </div>
            </div>

            <ResponsiveContainer width="100%" height={230}>
              <AreaChart data={revenueByDay} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="dashboardRevenueFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#b97844" stopOpacity={0.32} />
                    <stop offset="95%" stopColor="#b97844" stopOpacity={0.04} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 5" stroke="#e8e0d6" vertical={false} />
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#a0968c', fontSize: 12 }} />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#a0968c', fontSize: 12 }}
                  tickFormatter={(v) => currency.format(v)}
                  width={78}
                />
                <Tooltip
                  formatter={(value) => [currency.format(value), 'Revenue']}
                  contentStyle={{ borderRadius: 12, border: '1px solid #e8e0d6', backgroundColor: 'white' }}
                  cursor={{ stroke: '#b97844', strokeDasharray: '4 4', opacity: 0.3 }}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#b97844"
                  strokeWidth={3}
                  fill="url(#dashboardRevenueFill)"
                  dot={{ r: 3, fill: '#ffffff', stroke: '#b97844', strokeWidth: 2 }}
                  activeDot={{ r: 5, fill: '#b97844', stroke: '#ffffff', strokeWidth: 2 }}
                />
              </AreaChart>
            </ResponsiveContainer>

            <div className="mt-5 grid grid-cols-3 gap-3">
              <div className="bg-[#faf8f5] rounded-xl px-4 py-3">
                <p className="text-xs uppercase tracking-wide text-[#a0968c]">Daily Avg</p>
                <p className="mt-1 text-sm font-semibold text-[#3f3328]">{currency.format(revenueSummary.average)}</p>
              </div>
              <div className="bg-[#faf8f5] rounded-xl px-4 py-3">
                <p className="text-xs uppercase tracking-wide text-[#a0968c]">Profit Days</p>
                <p className="mt-1 text-sm font-semibold text-emerald-600">{revenueTrendInsights.profitDays}</p>
              </div>
              <div className="bg-[#faf8f5] rounded-xl px-4 py-3">
                <p className="text-xs uppercase tracking-wide text-[#a0968c]">Loss Days</p>
                <p className="mt-1 text-sm font-semibold text-rose-600">{revenueTrendInsights.lossDays}</p>
              </div>
            </div>

            <div className="mt-4 bg-[#faf8f5] rounded-xl px-4 py-3">
              <div className="flex items-center justify-between gap-3 text-sm">
                <span className="font-medium text-[#3f3328]">Best revenue point in this filter</span>
                <span className="font-semibold text-[#3f3328]">{currency.format(revenueSummary.peak)}</span>
              </div>
            </div>
          </div>

          <div className="bg-white border border-[#e8e0d6] rounded-xl p-6">
            <h2 className="font-display text-2xl font-bold text-[#3f3328] mb-4">Top Selling Items</h2>
            <ResponsiveContainer width="100%" height={190}>
              <BarChart data={topSellingBreakdown} layout="vertical" barSize={16}>
                <XAxis type="number" hide />
                <YAxis type="category" dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#6b5f54', fontSize: 13 }} width={140} />
                <Tooltip formatter={(value) => [`${value}`, 'Sold']} />
                <Bar dataKey="sold" fill="#b97844" radius={[0, 8, 8, 0]} />
              </BarChart>
            </ResponsiveContainer>

            <div className="mt-5 overflow-hidden rounded-xl border border-[#e8e0d6]">
              <table className="min-w-full text-sm">
                <thead className="bg-[#faf8f5] text-left text-[#6b5f54]">
                  <tr>
                    <th className="px-4 py-3 font-semibold">Rank</th>
                    <th className="px-4 py-3 font-semibold">Item</th>
                    <th className="px-4 py-3 font-semibold">Sold</th>
                    <th className="px-4 py-3 font-semibold">Share</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#e8e0d6] bg-white">
                  {topSellingBreakdown.map((item) => (
                    <tr key={item.name}>
                      <td className="px-4 py-3 font-semibold text-[#3f3328]">#{item.rank}</td>
                      <td className="px-4 py-3 text-[#3f3328]">{item.name}</td>
                      <td className="px-4 py-3 text-[#6b5f54]">{item.sold}</td>
                      <td className="px-4 py-3 text-[#6b5f54]">{item.share}%</td>
                    </tr>
                  ))}
                  {!topSellingBreakdown.length ? (
                    <tr>
                      <td colSpan="4" className="px-4 py-6 text-center text-[#a0968c]">No sales data available yet.</td>
                    </tr>
                  ) : null}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
