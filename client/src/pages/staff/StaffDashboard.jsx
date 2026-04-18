import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { 
  LayoutDashboard, 
  ShoppingBag, 
  Users, 
  Settings, 
  LogOut,
  Bell,
  Menu,
  X,
  ChevronRight,
  Clock,
  CheckCircle,
  Package,
  Truck,
  ChefHat,
  CalendarDays,
  TrendingUp,
  UserCheck,
  UtensilsCrossed,
  Monitor,
  AlertCircle,
  Wifi,
  WifiOff,
  Table2,
  Phone,
  User
} from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { logoutUser } from '../../store/slices/authSlice';
import { useQuery } from '@tanstack/react-query';
import { io } from 'socket.io-client';
import api from '../../services/api';
import presenceService from '../../services/presenceService';

const getStatusBadge = (status) => {
  const styles = {
    placed: 'bg-amber-100 text-amber-700',
    confirmed: 'bg-blue-100 text-blue-700',
    preparing: 'bg-orange-100 text-orange-700',
    ready: 'bg-emerald-100 text-emerald-700',
    'out-for-delivery': 'bg-indigo-100 text-indigo-700',
    delivered: 'bg-green-100 text-green-700',
    cancelled: 'bg-red-100 text-red-700',
  };
  return styles[status] || 'bg-gray-100 text-gray-700';
};

const DEFAULT_TABLES = [
  { number: '1', capacity: 2, isAvailable: true, bookedBy: null, bookedPhone: null, bookedGuests: null, bookedAt: null },
  { number: '2', capacity: 4, isAvailable: true, bookedBy: null, bookedPhone: null, bookedGuests: null, bookedAt: null },
  { number: '3', capacity: 2, isAvailable: true, bookedBy: null, bookedPhone: null, bookedGuests: null, bookedAt: null },
  { number: '4', capacity: 6, isAvailable: true, bookedBy: null, bookedPhone: null, bookedGuests: null, bookedAt: null },
  { number: '5', capacity: 4, isAvailable: true, bookedBy: null, bookedPhone: null, bookedGuests: null, bookedAt: null },
  { number: '6', capacity: 8, isAvailable: true, bookedBy: null, bookedPhone: null, bookedGuests: null, bookedAt: null },
  { number: '7', capacity: 2, isAvailable: true, bookedBy: null, bookedPhone: null, bookedGuests: null, bookedAt: null },
  { number: '8', capacity: 4, isAvailable: true, bookedBy: null, bookedPhone: null, bookedGuests: null, bookedAt: null },
];

const getSocketBaseUrl = () => (
  import.meta.env.VITE_SOCKET_URL ||
  import.meta.env.VITE_API_URL?.replace('/api', '') ||
  'http://localhost:5000'
);

export default function StaffDashboard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [tableStatuses, setTableStatuses] = useState(DEFAULT_TABLES);
  const [socketConnected, setSocketConnected] = useState(false);
  const [socket, setSocket] = useState(null);
  const [tableDialog, setTableDialog] = useState({ mode: null, table: null });
  const [tableForm, setTableForm] = useState({ customerName: '', customerPhone: '', guestCount: '' });
  const [tableActionLoading, setTableActionLoading] = useState(false);

  const { data: ordersData, refetch } = useQuery({
    queryKey: ['staff-dashboard-orders'],
    queryFn: () => api.get('/orders', { params: { limit: 10 } }).then(res => res.data),
    refetchInterval: 30000,
  });

  const { data: tableData, refetch: refetchTables } = useQuery({
    queryKey: ['staff-dashboard-table-statuses'],
    queryFn: () => api.get('/tables/statuses').then((res) => res.data.tables || []),
    refetchInterval: 10000,
  });

  useEffect(() => {
    if (Array.isArray(tableData) && tableData.length > 0) {
      setTableStatuses(tableData);
    }
  }, [tableData]);

  const getStaffOrderTypeLabel = (order) => {
    if (order?.isPreOrder) {
      if (order.preOrderMethod === 'delivery') return 'Pre-Order Delivery';
      if (order.preOrderMethod === 'takeaway') return 'Pre-Order Takeaway';
      if (order.preOrderMethod === 'dine-in') return 'Pre-Order Dine-In';
      return 'Pre-Order';
    }
    if (order?.orderType === 'dine-in') return 'Dine-In';
    return order?.orderType || 'order';
  };

  const stats = [
    { label: 'Active Orders', value: ordersData?.orders?.filter(o => !['delivered', 'completed', 'cancelled'].includes(o.status)).length || 0, icon: Package, color: 'bg-amber-100 text-amber-600' },
    { label: 'Pre-Orders', value: ordersData?.orders?.filter(o => (o.isPreOrder || o.orderType === 'pre-order') && !['delivered', 'cancelled'].includes(o.status)).length || 0, icon: CalendarDays, color: 'bg-emerald-100 text-emerald-600' },
    { label: 'Completed Today', value: ordersData?.orders?.filter(o => o.status === 'delivered' && new Date(o.createdAt).toDateString() === new Date().toDateString()).length || 0, icon: CheckCircle, color: 'bg-green-100 text-green-600' },
    { label: 'Pending', value: ordersData?.orders?.filter(o => o.status === 'placed' || o.status === 'confirmed').length || 0, icon: Clock, color: 'bg-orange-100 text-orange-600' },
  ];

  const recentOrders = ordersData?.orders?.slice(0, 5) || [];

  // Presence tracking
  useEffect(() => {
    if (!isAuthenticated || !user?._id) return undefined;
    presenceService.initialize(user._id, user.role || 'staff', 'Staff Panel');
    return () => { void presenceService.cleanup(); };
  }, [isAuthenticated, user?._id, user?.role]);

  // Socket connection for presence - FIXED VERSION
  useEffect(() => {
    if (!isAuthenticated || !user || !user._id) return;

    const socketUrl = getSocketBaseUrl();
    const newSocket = io(socketUrl, {
      withCredentials: true,
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    newSocket.on('connect', () => {
      setSocketConnected(true);
      newSocket.emit('user-online', {
        userId: user._id,
        role: user.role || 'staff',
        name: user.name,
        email: user.email
      });
    });

    newSocket.on('connect_error', () => setSocketConnected(false));
    newSocket.on('disconnect', () => setSocketConnected(false));

    setSocket(newSocket);

    const heartbeat = setInterval(() => {
      if (newSocket && newSocket.connected) {
        newSocket.emit('heartbeat', user._id);
      }
    }, 20000);

    const handleBeforeUnload = () => {
      if (newSocket && newSocket.connected) {
        newSocket.emit('user-offline', user._id);
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      clearInterval(heartbeat);
      window.removeEventListener('beforeunload', handleBeforeUnload);
      if (newSocket && newSocket.connected) {
        newSocket.emit('user-offline', user._id);
        newSocket.disconnect();
      }
    };
  }, [isAuthenticated, user]);

  const openTableDialog = (table) => {
    if (table.isAvailable) {
      setTableForm({
        customerName: '',
        customerPhone: '',
        guestCount: String(table.capacity || ''),
      });
      setTableDialog({ mode: 'book', table });
      return;
    }

    setTableDialog({ mode: 'release', table });
  };

  const closeTableDialog = () => {
    if (tableActionLoading) return;
    setTableDialog({ mode: null, table: null });
    setTableForm({ customerName: '', customerPhone: '', guestCount: '' });
  };

  const submitTableDialog = async () => {
    if (!tableDialog.table) return;

    try {
      setTableActionLoading(true);

      if (tableDialog.mode === 'book') {
        if (!tableForm.customerName.trim()) {
          toast.error('Customer name is required');
          return;
        }

        if (!tableForm.guestCount || Number(tableForm.guestCount) < 1) {
          toast.error('Guest count is required');
          return;
        }

        await api.post(`/tables/${tableDialog.table.number}/book`, {
          customerName: tableForm.customerName.trim(),
          customerPhone: tableForm.customerPhone.trim(),
          guestCount: Number(tableForm.guestCount),
        });

        toast.success(`Table ${tableDialog.table.number} marked as booked`);
      } else {
        await api.patch(`/tables/${tableDialog.table.number}/release`);
        toast.success(`Table ${tableDialog.table.number} is now available`);
      }

      await refetchTables();
      closeTableDialog();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update table status');
    } finally {
      setTableActionLoading(false);
    }
  };

  const handleLogout = async () => {
    setShowLogoutConfirm(false);
    if (socket && socket.connected && user?._id) {
      socket.emit('user-offline', user._id);
    }
    await dispatch(logoutUser());
    navigate('/login', { replace: true });
  };

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, path: '/staff' },
    { id: 'queue', label: 'Order Queue', icon: Package, path: '/staff/queue' },
    { id: 'preorders', label: 'Pre-Orders', icon: CalendarDays, path: '/staff/preorders' },
    { id: 'pos', label: 'POS Mode', icon: Monitor, path: '/staff/pos' },
    { id: 'profile', label: 'Profile', icon: UserCheck, path: '/staff/profile' },
    { id: 'settings', label: 'Settings', icon: Settings, path: '/staff/settings' },
  ];

  const initials = user?.name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || 'ST';
  const bookedTablesCount = tableStatuses.filter(t => !t.isAvailable).length;
  const availableTablesCount = tableStatuses.filter(t => t.isAvailable).length;

  return (
    <div className="min-h-screen bg-[#faf8f5]">
      {/* Mobile Sidebar Toggle */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-md border border-[#e8e0d6]"
      >
        {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Sidebar */}
      <aside className={`fixed top-0 left-0 z-40 h-screen w-64 bg-white border-r border-[#e8e0d6] transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="flex flex-col h-full">
          <div className="p-5 border-b border-[#e8e0d6]">
            <div className="flex items-center gap-3">
              <img src="https://rollercoastercafe.com/assets/images/roller_logo.png" alt="Logo" className="h-10 w-10 rounded-full object-cover" />
              <div>
                <h1 className="font-display font-bold text-lg text-[#3f3328]">Staff Panel</h1>
                <p className="text-xs text-[#6b5f54]">Roller Coaster Cafe</p>
              </div>
            </div>
          </div>

          <div className="mx-4 mt-3 px-3 py-2 rounded-lg bg-gray-50 border border-gray-100">
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-500">Presence Status</span>
              {socketConnected ? (
                <span className="inline-flex items-center gap-1 text-xs text-green-600">
                  <Wifi size={12} /> Online
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-xs text-gray-400">
                  <WifiOff size={12} /> Connecting...
                </span>
              )}
            </div>
          </div>

          <nav className="flex-1 p-4 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.id}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-[#6b5f54] hover:bg-[#faf8f5] hover:text-[#b97844] transition-all group"
              >
                <item.icon size={18} />
                <span className="text-sm font-medium">{item.label}</span>
              </Link>
            ))}
          </nav>

          <div className="p-4 border-t border-[#e8e0d6]">
            <button
              onClick={() => setShowLogoutConfirm(true)}
              className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-red-500 hover:bg-red-50 transition-all"
            >
              <LogOut size={18} />
              <span className="text-sm font-medium">Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="lg:ml-64">
        <header className="sticky top-0 z-30 bg-white border-b border-[#e8e0d6] px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-display text-2xl font-bold text-[#3f3328]">Dashboard</h1>
              <p className="text-sm text-[#6b5f54]">Welcome back, {user?.name || 'Staff'}!</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="hidden md:flex items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-[#b97844]/10 flex items-center justify-center">
                  <span className="text-sm font-bold text-[#b97844]">{initials}</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-[#3f3328]">{user?.name || 'Staff User'}</p>
                  <p className="text-xs text-[#6b5f54] capitalize">{user?.role || 'Staff'}</p>
                </div>
              </div>
              <Link to="/staff/queue" className="relative p-2 rounded-full hover:bg-[#faf8f5]">
                <Bell size={18} className="text-[#6b5f54]" />
                {stats[0]?.value > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                )}
              </Link>
            </div>
          </div>
        </header>

        <div className="p-6">
          {/* Stats Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
            {stats.map((stat) => (
              <div key={stat.label} className="bg-white border border-[#e8e0d6] rounded-xl p-5 hover:shadow-md transition-all">
                <div className="flex items-center justify-between mb-3">
                  <div className={`w-10 h-10 rounded-full ${stat.color} flex items-center justify-center`}>
                    <stat.icon size={18} />
                  </div>
                  <span className="text-2xl font-bold text-[#3f3328]">{stat.value}</span>
                </div>
                <p className="text-sm text-[#6b5f54]">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Recent Orders */}
          <div className="bg-white border border-[#e8e0d6] rounded-xl overflow-hidden mb-8">
            <div className="px-6 py-4 border-b border-[#e8e0d6] flex items-center justify-between">
              <h2 className="font-semibold text-lg text-[#3f3328]">Recent Orders</h2>
              <Link to="/staff/queue" className="text-sm text-[#b97844] hover:underline">View All →</Link>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[#faf8f5]">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-[#6b5f54]">Order ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-[#6b5f54]">Customer</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-[#6b5f54]">Type</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-[#6b5f54]">Total</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-[#6b5f54]">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-[#6b5f54]">Time</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#e8e0d6]">
                  {recentOrders.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="px-6 py-8 text-center text-[#6b5f54]">
                        <AlertCircle size={32} className="mx-auto mb-2 text-[#a0968c]" />
                        No orders yet
                      </td>
                    </tr>
                  ) : (
                    recentOrders.map((order) => (
                      <tr key={order._id} className="hover:bg-[#faf8f5] transition-all">
                        <td className="px-6 py-3 text-sm font-mono text-[#3f3328]">{order.orderId || order._id.slice(-6)}</td>
                        <td className="px-6 py-3 text-sm text-[#6b5f54]">{order.guestName || order.customer?.name || 'Guest'}</td>
                        <td className="px-6 py-3 text-sm text-[#6b5f54]">{getStaffOrderTypeLabel(order)}</td>
                        <td className="px-6 py-3 text-sm font-medium text-[#3f3328]">₹{order.totalAmount}</td>
                        <td className="px-6 py-3">
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(order.status)}`}>
                            {order.status}
                          </span>
                        </td>
                        <td className="px-6 py-3 text-sm text-[#6b5f54]">{new Date(order.createdAt).toLocaleTimeString()}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Dine-In Table Status */}
          <div className="bg-white border border-[#e8e0d6] rounded-xl overflow-hidden">
            <div className="px-6 py-4 border-b border-[#e8e0d6] flex items-center justify-between flex-wrap gap-3">
              <div>
                <h2 className="font-semibold text-lg text-[#3f3328]">Dine-In Table Status</h2>
                <p className="text-sm text-[#6b5f54] mt-1">Customers see these live table states on the dine-in booking page.</p>
              </div>
              <span className="rounded-full bg-[#faf8f5] px-3 py-1 text-xs font-medium text-[#6b5f54] border border-[#e8e0d6]">
                {availableTablesCount} open / {bookedTablesCount} booked
              </span>
            </div>
            <div className="p-6 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {tableStatuses.map((table) => (
                <div
                  key={table.number}
                  className={`rounded-xl border p-4 ${
                    table.isAvailable
                      ? 'border-emerald-200 bg-emerald-50'
                      : 'border-rose-200 bg-rose-50'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold text-[#3f3328]">Table {table.number}</p>
                      <p className="text-xs text-[#6b5f54] mt-1">Capacity: {table.capacity} guests</p>
                    </div>
                    <span className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
                      table.isAvailable 
                        ? 'bg-white text-emerald-700 border border-emerald-200' 
                        : 'bg-white text-rose-700 border border-rose-200'
                    }`}>
                      {table.isAvailable ? 'Open' : 'Booked'}
                    </span>
                  </div>
                  
                  {!table.isAvailable && (
                    <div className="mt-3 pt-3 border-t border-rose-200">
                      <p className="text-xs font-medium text-rose-800">Booked by:</p>
                      <p className="text-sm font-semibold text-rose-900">{table.bookedBy || 'Customer'}</p>
                      {table.bookedPhone && (
                        <p className="text-xs text-rose-700 mt-1 flex items-center gap-1">
                          <Phone size={10} /> {table.bookedPhone}
                        </p>
                      )}
                      {table.bookedGuests && (
                        <p className="text-xs text-rose-700 mt-1">👥 {table.bookedGuests} guests</p>
                      )}
                      {table.bookedAt && (
                        <p className="text-xs text-rose-700 mt-1">🕐 {new Date(table.bookedAt).toLocaleString()}</p>
                      )}
                    </div>
                  )}

                  {(table.currentReservation || table.nextReservation) && (
                    <div className="mt-3 rounded-lg bg-white/80 px-3 py-2 text-xs text-[#6b5f54]">
                      <p className="font-medium text-[#3f3328]">
                        {table.currentReservation ? 'Current dine-in booking' : 'Next scheduled booking'}
                      </p>
                      <p className="mt-1">{new Date((table.currentReservation || table.nextReservation).scheduledTime).toLocaleString()}</p>
                      <p className="mt-1 capitalize">
                        {(table.currentReservation || table.nextReservation).customerName} - {(table.currentReservation || table.nextReservation).orderType}
                      </p>
                      {(table.currentReservation || table.nextReservation).customerPhone && (
                        <p className="mt-1 flex items-center gap-1">
                          <Phone size={10} /> {(table.currentReservation || table.nextReservation).customerPhone}
                        </p>
                      )}
                      {(table.currentReservation || table.nextReservation).guestCount && (
                        <p className="mt-1">Guests: {(table.currentReservation || table.nextReservation).guestCount}</p>
                      )}
                    </div>
                  )}
                  
                  <p className="text-xs text-[#6b5f54] mt-3 min-h-[32px]">
                    {table.isAvailable
                      ? (table.currentReservation || table.nextReservation)
                        ? 'Open now, with a later scheduled reservation.'
                        : 'Available for customer booking now.'
                      : 'Table currently occupied.'}
                  </p>
                  <button
                    onClick={() => openTableDialog(table)}
                    className={`mt-4 w-full rounded-full px-4 py-2 text-sm font-medium transition-all ${
                      table.isAvailable
                        ? 'bg-[#3f3328] text-white hover:bg-[#2f261e]'
                        : 'bg-white text-[#b97844] border border-[#e8e0d6] hover:border-[#b97844]'
                    }`}
                  >
                    {table.isAvailable ? 'Mark as Booked' : 'Mark as Available'}
                  </button>
                </div>
              ))}
            </div>
            <div className="px-6 py-3 border-t border-[#e8e0d6] bg-[#faf8f5] text-center">
              <p className="text-xs text-[#6b5f54]">
                💡 Tables marked as "Booked" will appear unavailable to customers
              </p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid md:grid-cols-3 gap-5 mt-8">
            <Link to="/staff/queue" className="flex items-center gap-4 p-5 bg-white border border-[#e8e0d6] rounded-xl hover:shadow-md transition-all group">
              <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center group-hover:bg-amber-200 transition-all">
                <Package size={20} className="text-amber-600" />
              </div>
              <div>
                <p className="font-semibold text-[#3f3328]">Order Queue</p>
                <p className="text-sm text-[#6b5f54]">Manage active orders</p>
              </div>
              <ChevronRight size={16} className="ml-auto text-[#a0968c] group-hover:text-[#b97844]" />
            </Link>
            <Link to="/staff/preorders" className="flex items-center gap-4 p-5 bg-white border border-[#e8e0d6] rounded-xl hover:shadow-md transition-all group">
              <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center group-hover:bg-emerald-200 transition-all">
                <CalendarDays size={20} className="text-emerald-600" />
              </div>
              <div>
                <p className="font-semibold text-[#3f3328]">Pre-Orders</p>
                <p className="text-sm text-[#6b5f54]">Scheduled orders</p>
              </div>
              <ChevronRight size={16} className="ml-auto text-[#a0968c] group-hover:text-[#b97844]" />
            </Link>
            <Link to="/staff/pos" className="flex items-center gap-4 p-5 bg-white border border-[#e8e0d6] rounded-xl hover:shadow-md transition-all group">
              <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center group-hover:bg-purple-200 transition-all">
                <Monitor size={20} className="text-purple-600" />
              </div>
              <div>
                <p className="font-semibold text-[#3f3328]">POS Mode</p>
                <p className="text-sm text-[#6b5f54]">Counter billing</p>
              </div>
              <ChevronRight size={16} className="ml-auto text-[#a0968c] group-hover:text-[#b97844]" />
            </Link>
          </div>
        </div>
      </div>

      {tableDialog.table && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-2xl border border-[#e8e0d6] bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-[#e8e0d6] px-5 py-4">
              <div>
                <h3 className="text-lg font-semibold text-[#3f3328]">
                  {tableDialog.mode === 'book' ? `Book Table ${tableDialog.table.number}` : `Free Table ${tableDialog.table.number}`}
                </h3>
                <p className="text-sm text-[#6b5f54]">
                  {tableDialog.mode === 'book'
                    ? 'Enter customer details to reserve this table from staff panel.'
                    : 'This will make the table available again for customer booking.'}
                </p>
              </div>
              <button
                type="button"
                onClick={closeTableDialog}
                className="rounded-full p-2 text-[#6b5f54] hover:bg-[#faf8f5]"
              >
                <X size={18} />
              </button>
            </div>

            {tableDialog.mode === 'book' ? (
              <div className="space-y-4 px-5 py-5">
                <div>
                  <label className="mb-1 block text-sm font-medium text-[#3f3328]">Customer name</label>
                  <input
                    value={tableForm.customerName}
                    onChange={(e) => setTableForm((prev) => ({ ...prev, customerName: e.target.value }))}
                    placeholder="Enter customer name"
                    className="w-full rounded-xl border border-[#e8e0d6] px-4 py-3 text-sm outline-none focus:border-[#b97844]"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-[#3f3328]">Phone number</label>
                  <input
                    value={tableForm.customerPhone}
                    onChange={(e) => setTableForm((prev) => ({ ...prev, customerPhone: e.target.value }))}
                    placeholder="Optional phone number"
                    className="w-full rounded-xl border border-[#e8e0d6] px-4 py-3 text-sm outline-none focus:border-[#b97844]"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-[#3f3328]">Guests</label>
                  <input
                    type="number"
                    min="1"
                    value={tableForm.guestCount}
                    onChange={(e) => setTableForm((prev) => ({ ...prev, guestCount: e.target.value }))}
                    className="w-full rounded-xl border border-[#e8e0d6] px-4 py-3 text-sm outline-none focus:border-[#b97844]"
                  />
                </div>
              </div>
            ) : (
              <div className="px-5 py-5">
                <div className="rounded-xl bg-[#faf8f5] p-4 text-sm text-[#6b5f54]">
                  <p><span className="font-medium text-[#3f3328]">Booked by:</span> {tableDialog.table.bookedBy || 'Customer'}</p>
                  {tableDialog.table.bookedPhone && (
                    <p className="mt-1"><span className="font-medium text-[#3f3328]">Phone:</span> {tableDialog.table.bookedPhone}</p>
                  )}
                  {tableDialog.table.bookedGuests && (
                    <p className="mt-1"><span className="font-medium text-[#3f3328]">Guests:</span> {tableDialog.table.bookedGuests}</p>
                  )}
                </div>
              </div>
            )}

            <div className="flex items-center justify-end gap-3 border-t border-[#e8e0d6] px-5 py-4">
              <button
                type="button"
                onClick={closeTableDialog}
                className="rounded-full border border-[#e8e0d6] px-4 py-2 text-sm font-medium text-[#6b5f54]"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={tableActionLoading}
                onClick={submitTableDialog}
                className="rounded-full bg-[#b97844] px-5 py-2 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-60"
              >
                {tableActionLoading
                  ? 'Saving...'
                  : tableDialog.mode === 'book'
                    ? 'Confirm Booking'
                    : 'Mark Available'}
              </button>
            </div>
          </div>
        </div>
      )}

      {showLogoutConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setShowLogoutConfirm(false)}>
          <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="border-b border-[#e8e0d6] px-5 py-4">
              <h2 className="text-lg font-bold text-gray-900">Confirm Logout</h2>
              <p className="mt-1 text-sm text-gray-500">You will need to sign in again to access the staff panel.</p>
            </div>
            <div className="flex items-center justify-end gap-3 px-5 py-4">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="rounded-full border border-[#e8e0d6] px-4 py-2 text-sm font-medium text-[#6b5f54]"
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                className="rounded-full bg-red-500 px-4 py-2 text-sm font-medium text-white hover:bg-red-600"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
