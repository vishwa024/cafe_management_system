import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from 'chart.js';
import { LoadingSpinner } from '../../components/shared/StatusBadge';
import { io } from 'socket.io-client';
import toast from 'react-hot-toast';
import { 
  TrendingUp, Package, AlertTriangle, ShoppingBag, 
  CalendarDays, Clock, RefreshCw, LogOut,
  DollarSign, Users, Wifi, WifiOff, ChevronLeft, ChevronRight
} from 'lucide-react';

ChartJS.register(Tooltip, Legend, CategoryScale, LinearScale, BarElement);

export default function ManagerDashboard() {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [busyRange, setBusyRange] = useState('today');
  const busyRangeOptions = [
    { value: 'today', label: 'Today' },
    { value: 'yesterday', label: 'Yesterday' },
    { value: 'last7days', label: 'Last Week' },
    { value: 'last30days', label: 'Last Month' },
  ];

  const fetchDashboard = useCallback(async () => {
    try {
      const [dashboardRes, staffRes, onlineRes] = await Promise.all([
        api.get('/manager/dashboard', { params: { busyRange } }),
        api.get('/manager/staff'),
        api.get('/presence/online-users').catch(() => ({ data: [] })),
      ]);

      const staffList = Array.isArray(staffRes.data) ? staffRes.data : [];
      const onlineArray = Array.isArray(onlineRes.data) ? onlineRes.data : [];
      const onlineMap = new Map();

      onlineArray.forEach((user) => {
        const id = user?.userId || user?._id;
        if (id) {
          onlineMap.set(String(id), {
            isOnline: true,
            panel: user.panel,
            lastSeen: user.lastSeen,
          });
        }
      });

      setData(dashboardRes.data);
      setStaff(
        staffList.map((member) => {
          const presence = onlineMap.get(String(member._id));
          return {
            ...member,
            isOnline: !!presence,
            currentPanel: presence?.panel || null,
            lastSeen: presence?.lastSeen || member.lastSeen,
          };
        })
      );
      setError('');
    } catch (err) {
      console.error('Dashboard fetch error:', err.response || err);
      setError('Failed to load dashboard data.');
    } finally {
      setLoading(false);
    }
  }, [busyRange]);

  useEffect(() => {
    fetchDashboard();
    const t = setInterval(fetchDashboard, 30000);
    return () => clearInterval(t);
  }, [fetchDashboard]);

  useEffect(() => {
    const socket = io(import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000');

    socket.on('presence-update', fetchDashboard);
    socket.on('order-updated', fetchDashboard);
    socket.on('delivery-order-changed', fetchDashboard);
    socket.on('manager-delivery-rejection', (payload) => {
      fetchDashboard();
      if (payload?.orderId) {
        toast((t) => (
          <div className="min-w-[280px] rounded-xl border border-amber-200 bg-white px-4 py-3 shadow-lg">
            <p className="text-sm font-semibold text-[#3f3328]">Delivery request rejected</p>
            <p className="mt-1 text-xs text-[#6b5f54]">Order #{payload.orderId} needs a new rider.</p>
            {payload.reason ? <p className="mt-1 text-xs text-amber-700">Reason: {payload.reason}</p> : null}
            <button
              onClick={() => toast.dismiss(t.id)}
              className="mt-3 rounded-lg bg-[#b97844] px-3 py-1.5 text-xs font-medium text-white"
            >
              Ok
            </button>
          </div>
        ), { duration: 5000 });
      }
    });

    return () => {
      socket.close();
    };
  }, [fetchDashboard]);

  useEffect(() => {
    setCurrentPage(1);
  }, [data?.recentOrders?.length]);

  if (loading) return <LoadingSpinner />;

  if (error || !data) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-600">{error || 'Failed to load dashboard'}</p>
            <button onClick={fetchDashboard} className="mt-2 px-4 py-2 bg-red-500 text-white rounded-lg">Retry</button>
          </div>
        </div>
      </div>
    );
  }

  const pendingStatuses = ['placed', 'confirmed', 'preparing', 'ready', 'pending'];
  const pendingCount = data.statusCounts?.filter((s) => pendingStatuses.includes(String(s._id).toLowerCase()))?.reduce((sum, s) => sum + s.count, 0) || 0;
  const busyHours = Array.isArray(data.busyHours) ? data.busyHours : [];
  const hasBusyHourData = busyHours.some((slot) => slot.orders > 0);
  const busiestSlots = [...busyHours]
    .sort((a, b) => b.orders - a.orders)
    .filter((slot) => slot.orders > 0)
    .slice(0, 3);
  const selectedBusyRangeLabel =
    busyRangeOptions.find((option) => option.value === busyRange)?.label || data.busyRangeLabel || 'Today';
  const topSellingItems = Array.isArray(data.topItems)
    ? [...data.topItems]
        .sort((first, second) => (second?.quantity || 0) - (first?.quantity || 0))
        .slice(0, 5)
    : [];

  const barData = {
    labels: topSellingItems.map((item) => item.name?.length > 15 ? `${item.name.substring(0, 12)}...` : item.name),
    datasets: [{
      label: 'Units Sold',
      data: topSellingItems.map((item) => item.quantity || 0),
      backgroundColor: '#f59e0b',
      borderRadius: 8,
    }],
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: { legend: { display: false } },
    scales: { x: { ticks: { font: { size: 11 } } }, y: { beginAtZero: true, ticks: { font: { size: 11 } } } }
  };

  const pieOptions = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: { position: 'bottom', labels: { font: { size: 11 }, boxWidth: 10, padding: 8 } },
      tooltip: { callbacks: { label: (ctx) => `${ctx.label}: ₹${ctx.raw} (${((ctx.raw / ctx.dataset.data.reduce((a,b)=>a+b,0))*100).toFixed(1)}%)` } }
    }
  };

  const busyHoursData = {
    labels: busyHours.map((slot) => slot.label),
    datasets: [{
      label: 'Orders',
      data: busyHours.map((slot) => slot.orders),
      backgroundColor: busyHours.map((slot) =>
        slot.orders === (data.peakHour?.orders || 0) && slot.orders > 0 ? '#f59e0b' : '#fde68a'
      ),
      borderRadius: 8,
      maxBarThickness: 22,
    }],
  };

  const busyHoursOptions = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (ctx) => `${ctx.raw} order(s) at ${ctx.label}`,
        },
      },
    },
    scales: {
      x: {
        ticks: { autoSkip: true, maxTicksLimit: 8, font: { size: 11 } },
        grid: { display: false },
      },
      y: {
        beginAtZero: true,
        suggestedMax: hasBusyHourData ? undefined : 1,
        ticks: { precision: 0, font: { size: 11 } },
      },
    }
  };

  const teamCards = staff.map((member) => ({
    ...member,
    online: !!member.isOnline,
  }));

  const recentOrders = data.recentOrders || [];
  const totalItems = recentOrders.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedOrders = recentOrders.slice(startIndex, endIndex);

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

  const StatCard = ({ title, value, icon: Icon, subtitle, color }) => {
    const colors = {
      amber: 'bg-amber-50 text-amber-600',
      green: 'bg-green-50 text-green-600',
      blue: 'bg-blue-50 text-blue-600',
      red: 'bg-red-50 text-red-600',
    };
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">{title}</p>
            <p className="text-2xl font-bold text-gray-900 mt-2">{value}</p>
            {subtitle && <p className="text-xs text-gray-400 mt-1">{subtitle}</p>}
          </div>
          <div className={`p-3 rounded-xl ${colors[color]}`}>
            <Icon size={20} />
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Today's Revenue" value={`₹${Number(data.todaySales || 0).toFixed(0)}`} icon={DollarSign} subtitle="from yesterday" color="green" />
        <StatCard title="Today's Orders" value={data.todayOrderCount || 0} icon={ShoppingBag} subtitle={`${pendingCount} pending`} color="amber" />
        <StatCard title="Pending Orders" value={pendingCount} icon={Clock} subtitle="need attention" color="red" />
        <StatCard title="Low Stock Alerts" value={data.lowStockAlerts?.length || 0} icon={Package} subtitle="items below minimum" color="blue" />
      </div>

      {/* Low Stock Alert */}
      {data.lowStockAlerts?.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle size={16} className="text-red-600" />
            <span className="font-semibold text-red-800">Low Stock Items:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {data.lowStockAlerts.map((item) => (
              <span key={item._id} className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-medium">
                {item.name}: {item.currentStock} {item.unit}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Charts Row */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="flex h-full flex-col rounded-xl border border-gray-200 bg-white p-5">
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2">
              <Clock size={18} className="text-amber-600" />
              <div>
                <h3 className="font-semibold text-gray-900">Busy Hours</h3>
                <p className="text-xs text-gray-500">Best selling hours for {selectedBusyRangeLabel}</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {busyRangeOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => setBusyRange(option.value)}
                  className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                    busyRange === option.value
                      ? 'bg-amber-500 text-white'
                      : 'bg-amber-50 text-amber-700 hover:bg-amber-100'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
          <div className="mb-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="rounded-lg bg-amber-50 border border-amber-100 px-4 py-3">
              <p className="text-xs font-medium text-amber-700">Peak Order Time</p>
              <p className="mt-1 text-lg font-bold text-gray-900">{data.peakHour?.label || '--:--'}</p>
              <p className="text-xs text-gray-500">{data.peakHour?.orders || 0} order(s) in the busiest hour</p>
            </div>
            <div className="rounded-lg bg-gray-50 border border-gray-200 px-4 py-3">
              <p className="text-xs font-medium text-gray-700">Top Busy Slots</p>
              <p className="mt-1 text-sm font-semibold text-gray-900">
                {busiestSlots.length
                  ? busiestSlots.map((slot) => `${slot.label} (${slot.orders})`).join(', ')
                  : `No peak periods found for ${selectedBusyRangeLabel.toLowerCase()}`}
              </p>
            </div>
          </div>
          <div className="rounded-xl border border-gray-100 bg-white px-2 pt-3 pb-2">
            <div className="h-72">
              <Bar data={busyHoursData} options={busyHoursOptions} />
            </div>
          </div>
          {!hasBusyHourData && (
            <p className="mt-3 text-center text-sm text-gray-400">
              No order activity found for {selectedBusyRangeLabel.toLowerCase()}, but the hourly chart is ready for new data.
            </p>
          )}
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp size={18} className="text-amber-600" />
            <h3 className="font-semibold text-gray-900">Top 5 Selling Items</h3>
          </div>
          {topSellingItems.length > 0 ? (
            <div className="h-80">
              <Bar data={barData} options={barOptions} />
            </div>
          ) : (
            <div className="h-80 flex items-center justify-center text-gray-400">No sales data yet</div>
          )}
        </div>
      </div>

      {/* Team Status */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <Users size={18} className="text-amber-600" />
            <h3 className="font-semibold text-gray-900">Panel Status</h3>
            <span className="ml-auto text-sm text-gray-500">{teamCards.filter(m => m.online).length} online</span>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-gray-200">
          {teamCards.length ? (
            teamCards.map((member) => (
              <div key={member._id} className="p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${member.online ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`} />
                      <p className="font-semibold text-gray-900">{member.name}</p>
                    </div>
                    <p className="text-xs text-gray-500 mt-1 capitalize">{member.role || 'Staff'}</p>
                  </div>
                  <span className={`flex items-center gap-1 text-xs font-semibold ${member.online ? 'text-green-600' : 'text-gray-500'}`}>
                    {member.online ? <Wifi size={12} /> : <WifiOff size={12} />}
                    {member.online ? 'Online' : 'Offline'}
                  </span>
                </div>
                {member.currentPanel && (
                  <p className="mt-2 text-xs font-medium text-blue-600">
                    Active in: {member.currentPanel}
                  </p>
                )}
                <p className="text-xs text-gray-400 mt-2">
                  {member.lastSeen ? `Last seen ${new Date(member.lastSeen).toLocaleString()}` : 'No activity yet'}
                </p>
              </div>
            ))
          ) : (
            <div className="p-8 text-center text-gray-400 col-span-4">No team data available</div>
          )}
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center gap-2">
            <CalendarDays size={18} className="text-amber-600" />
            <h3 className="font-semibold text-gray-900">Recent Orders</h3>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500">Show:</span>
            <select
              value={itemsPerPage}
              onChange={(e) => { setItemsPerPage(Number(e.target.value)); setCurrentPage(1); }}
              className="px-2 py-1 text-sm border border-gray-200 rounded-lg bg-white"
            >
              <option value={5}>5 per page</option>
              <option value={10}>10 per page</option>
              <option value={15}>15 per page</option>
              <option value={20}>20 per page</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr className="text-gray-600">
                <th className="px-4 py-3 text-left">Order ID</th>
                <th className="px-4 py-3 text-left">Customer</th>
                <th className="px-4 py-3 text-left">Items</th>
                <th className="px-4 py-3 text-left">Total</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-left">Time</th>
                <th className="px-4 py-3 text-left">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {paginatedOrders.length > 0 ? (
                paginatedOrders.map((o) => {
                  const status = String(o.status || '').toLowerCase();
                  const statusStyles = {
                    completed: 'bg-green-100 text-green-700',
                    delivered: 'bg-green-100 text-green-700',
                    'out-for-delivery': 'bg-blue-100 text-blue-700',
                    cancelled: 'bg-red-100 text-red-700',
                    placed: 'bg-orange-100 text-orange-700',
                    pending: 'bg-orange-100 text-orange-700',
                    preparing: 'bg-purple-100 text-purple-700',
                    confirmed: 'bg-blue-100 text-blue-700',
                    ready: 'bg-emerald-100 text-emerald-700',
                  };
                  return (
                    <tr key={o._id} className="hover:bg-gray-50 transition">
                      <td className="px-4 py-3 font-mono text-xs text-amber-600">#{o._id.slice(-6)}</td>
                      <td className="px-4 py-3 font-medium">{o.customer?.name || 'Guest'}</td>
                      <td className="px-4 py-3 text-gray-500">{o.items?.length} item(s)</td>
                      <td className="px-4 py-3 font-semibold">₹{(o.totalAmount ?? 0).toFixed(0)}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${statusStyles[status] || 'bg-gray-100 text-gray-600'}`}>
                          {o.status === 'out-for-delivery' ? 'Out for Delivery' : o.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-500 text-xs">{new Date(o.createdAt).toLocaleTimeString()}</td>
                      <td className="px-4 py-3">
                        <button className="text-amber-600 hover:text-amber-700 text-sm font-medium">View</button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-gray-400">No recent orders</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalItems > itemsPerPage && (
          <div className="px-5 py-3 border-t border-gray-200 bg-gray-50 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <span className="text-xs text-gray-500">
              Showing {startIndex + 1} to {Math.min(endIndex, totalItems)} of {totalItems} orders
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-1.5 rounded border border-gray-200 bg-white disabled:opacity-50"
              >
                <ChevronLeft size={14} />
              </button>
              <div className="flex gap-1">
                {getPageNumbers().map((page, idx) => (
                  <button
                    key={idx}
                    onClick={() => typeof page === 'number' && setCurrentPage(page)}
                    className={`px-3 py-1 rounded text-sm font-medium ${currentPage === page ? 'bg-amber-500 text-white' : 'bg-white text-gray-600 border border-gray-200'}`}
                    disabled={page === '...'}
                  >
                    {page}
                  </button>
                ))}
              </div>
              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="p-1.5 rounded border border-gray-200 bg-white disabled:opacity-50"
              >
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
