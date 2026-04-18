// // // // import { useEffect, useMemo, useState } from 'react';
// // // // import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
// // // // import { BellRing, ChevronDown, ChevronUp, Clock, Hand, Monitor, RefreshCw, Settings, ShoppingBag, Table2, Truck, UserCircle2, Package, CheckCircle, XCircle, ChefHat, CalendarDays, Search, Filter, ChevronLeft, ChevronRight } from 'lucide-react';
// // // // import { io } from 'socket.io-client';
// // // // import toast from 'react-hot-toast';
// // // // import { QRCodeCanvas } from 'qrcode.react';
// // // // import api from '../../services/api';
// // // // import { Link } from 'react-router-dom';
// // // // import { useSelector } from 'react-redux';

// // // // const STAFF_PREFS_KEY = 'staffQueuePrefs';
// // // // const DEFAULT_PREFS = { soundEnabled: true, showOnlyAssigned: false, compactView: false };
// // // // const ORDERS_PER_PAGE = 10;

// // // // const typeStyles = {
// // // //   'dine-in': 'bg-emerald-100 text-emerald-700',
// // // //   takeaway: 'bg-violet-100 text-violet-700',
// // // //   delivery: 'bg-sky-100 text-sky-700',
// // // //   'pre-order': 'bg-orange-100 text-orange-700',
// // // // };

// // // // const statusStyles = {
// // // //   placed: 'bg-amber-100 text-amber-700',
// // // //   confirmed: 'bg-blue-100 text-blue-700',
// // // //   preparing: 'bg-orange-100 text-orange-700',
// // // //   ready: 'bg-emerald-100 text-emerald-700',
// // // //   'out-for-delivery': 'bg-indigo-100 text-indigo-700',
// // // //   delivered: 'bg-green-100 text-green-700',
// // // //   completed: 'bg-teal-100 text-teal-700',
// // // //   cancelled: 'bg-red-100 text-red-700',
// // // // };

// // // // const STEP_LABELS = { placed: 'Placed', confirmed: 'Confirmed', preparing: 'Preparing', ready: 'Ready', completed: 'Completed', delivered: 'Delivered' };
// // // // const PAYMENT_OPTION_STYLES = {
// // // //   cash: 'bg-emerald-100 text-emerald-700 border-emerald-200',
// // // //   upi: 'bg-blue-100 text-blue-700 border-blue-200',
// // // // };
// // // // const CAFE_UPI_ID = import.meta.env.VITE_CAFE_UPI_ID || 'kashishsolanki8082@okaxis';

// // // // function readQueuePrefs() {
// // // //   if (typeof window === 'undefined') return DEFAULT_PREFS;
// // // //   try {
// // // //     const raw = window.localStorage.getItem(STAFF_PREFS_KEY);
// // // //     return raw ? { ...DEFAULT_PREFS, ...JSON.parse(raw) } : DEFAULT_PREFS;
// // // //   } catch {
// // // //     return DEFAULT_PREFS;
// // // //   }
// // // // }

// // // // function playQueueBeep() {
// // // //   if (typeof window === 'undefined') return;
// // // //   const AudioContextClass = window.AudioContext || window.webkitAudioContext;
// // // //   if (!AudioContextClass) return;
// // // //   const context = new AudioContextClass();
// // // //   const oscillator = context.createOscillator();
// // // //   const gain = context.createGain();
// // // //   oscillator.type = 'sine';
// // // //   oscillator.frequency.value = 880;
// // // //   gain.gain.value = 0.02;
// // // //   oscillator.connect(gain);
// // // //   gain.connect(context.destination);
// // // //   oscillator.start();
// // // //   oscillator.stop(context.currentTime + 0.12);
// // // //   oscillator.onended = () => { if (context.state !== 'closed') context.close(); };
// // // // }

// // // // function getFlow(orderType) {
// // // //   if (orderType === 'delivery') return ['placed', 'confirmed', 'preparing', 'ready', 'out-for-delivery', 'delivered'];
// // // //   return ['placed', 'confirmed', 'preparing', 'ready', 'completed'];
// // // // }

// // // // function getNextStaffStatus(orderType, status) {
// // // //   const flow = getFlow(orderType);
// // // //   const currentIndex = flow.indexOf(status);
// // // //   if (currentIndex === -1) return null;
// // // //   return flow[currentIndex + 1] || null;
// // // // }

// // // // function getActionLabel(orderType, nextStatus) {
// // // //   if (!nextStatus) return '';
// // // //   if (nextStatus === 'confirmed') return 'Confirm';
// // // //   if (nextStatus === 'preparing') return 'Start Preparing';
// // // //   if (nextStatus === 'ready') return 'Mark Ready';
// // // //   if (nextStatus === 'out-for-delivery') return 'Assign Rider';
// // // //   if (nextStatus === 'delivered') return 'Mark Delivered';
// // // //   if (nextStatus === 'completed') {
// // // //     if (orderType === 'takeaway') return 'Mark Picked Up';
// // // //     if (orderType === 'dine-in') return 'Mark Served';
// // // //   }
// // // //   return STEP_LABELS[nextStatus] || nextStatus;
// // // // }

// // // // function getStaffNextStatus(order) {
// // // //   if (!order) return null;
// // // //   const normalizedStatus = String(order.status || '').toLowerCase();
// // // //   if (normalizedStatus === 'placed') return 'confirmed';
// // // //   if (normalizedStatus === 'ready' && order.orderType !== 'delivery') return 'completed';
// // // //   return null;
// // // // }

// // // // function getPaymentSummary(order) {
// // // //   const collectedMethod = String(order?.deliveryPayment?.method || '').toLowerCase();
// // // //   const checkoutMethod = String(order?.paymentMethod || '').toLowerCase();
// // // //   const paymentStatus = String(order?.deliveryPayment?.status || order?.paymentStatus || 'pending').toLowerCase();

// // // //   if (paymentStatus === 'paid') {
// // // //     if (collectedMethod === 'cash') return 'Cash • Payment Complete';
// // // //     if (collectedMethod === 'upi') return 'UPI • Payment Complete';
// // // //     if (checkoutMethod === 'online') return 'Online • Payment Complete';
// // // //   }

// // // //   if (checkoutMethod === 'cod') return 'COD • Awaiting Cash/UPI Collection';
// // // //   if (checkoutMethod === 'online') return 'Online • Payment Complete';
// // // //   return `${checkoutMethod || 'pending'} • ${paymentStatus || 'pending'}`;
// // // // }

// // // // function buildStaffUpiUri(order) {
// // // //   const amount = Number(order?.totalAmount || 0).toFixed(2);
// // // //   return `upi://pay?pa=${encodeURIComponent(CAFE_UPI_ID)}&pn=${encodeURIComponent('Roller Coaster Cafe')}&am=${encodeURIComponent(amount)}&cu=INR&tn=${encodeURIComponent(`Order ${order?.orderId || ''} - ${order?.guestName || order?.customer?.name || 'Customer'}`)}&tr=${encodeURIComponent(order?.orderId || '')}`;
// // // // }

// // // // function canOpenInvoice(order) {
// // // //   return ['completed', 'delivered'].includes(String(order?.status || '').toLowerCase());
// // // // }

// // // // export default function OrderQueue() {
// // // //   const queryClient = useQueryClient();
// // // //   const { user } = useSelector((state) => state.auth);
// // // //   const [filter, setFilter] = useState('active');
// // // //   const [searchTerm, setSearchTerm] = useState('');
// // // //   const [prefs, setPrefs] = useState(DEFAULT_PREFS);
// // // //   const [openOrderId, setOpenOrderId] = useState(null);
// // // //   const [currentPage, setCurrentPage] = useState(1);
// // // //   const [updatingOrderId, setUpdatingOrderId] = useState(null);
// // // //   const [servicePaymentDrafts, setServicePaymentDrafts] = useState({});

// // // //   useEffect(() => {
// // // //     setPrefs(readQueuePrefs());
// // // //     const handleStorage = () => setPrefs(readQueuePrefs());
// // // //     window.addEventListener('storage', handleStorage);
// // // //     return () => window.removeEventListener('storage', handleStorage);
// // // //   }, []);

// // // //   const { data: response, isLoading, refetch } = useQuery({
// // // //     queryKey: ['staff-orders', filter],
// // // //     queryFn: () => api.get('/orders', { params: { status: filter === 'active' ? undefined : filter, limit: 100 } }).then((res) => res.data),
// // // //     refetchInterval: 15000,
// // // //   });

// // // //   // Filter orders
// // // //   const filteredOrders = useMemo(() => {
// // // //     let rows = response?.orders || [];
// // // //     if (filter === 'active') rows = rows.filter((order) => !['delivered', 'completed', 'cancelled'].includes(order.status));
// // // //     if (prefs.showOnlyAssigned) rows = rows.filter((order) => order.assignedStaff?._id === user?._id);
// // // //     if (searchTerm.trim()) {
// // // //       const term = searchTerm.toLowerCase();
// // // //       rows = rows.filter((order) => 
// // // //         (order.orderId || '').toLowerCase().includes(term) ||
// // // //         (order.guestName || order.customer?.name || '').toLowerCase().includes(term) ||
// // // //         (order.items?.some(item => item.name.toLowerCase().includes(term)))
// // // //       );
// // // //     }
// // // //     return rows;
// // // //   }, [filter, prefs.showOnlyAssigned, response, user?._id, searchTerm]);

// // // //   // Pagination
// // // //   const totalPages = Math.ceil(filteredOrders.length / ORDERS_PER_PAGE);
// // // //   const paginatedOrders = useMemo(() => {
// // // //     const start = (currentPage - 1) * ORDERS_PER_PAGE;
// // // //     return filteredOrders.slice(start, start + ORDERS_PER_PAGE);
// // // //   }, [filteredOrders, currentPage]);

// // // //   // Reset page when filter or search changes
// // // //   useEffect(() => {
// // // //     setCurrentPage(1);
// // // //   }, [filter, searchTerm]);

// // // //   const updateStatusMutation = useMutation({
// // // //     mutationFn: ({ orderId, status, paymentCollectionMethod }) => api.put(`/orders/${orderId}/status`, { status, paymentCollectionMethod }),
// // // //     onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['staff-orders'] }); toast.success('Order status updated'); },
// // // //     onError: (error) => toast.error(error.response?.data?.message || 'Could not update order'),
// // // //   });
// // // //   const deleteOrderMutation = useMutation({
// // // //     mutationFn: (orderId) => api.delete(`/orders/${orderId}`),
// // // //     onSuccess: () => {
// // // //       queryClient.invalidateQueries({ queryKey: ['staff-orders'] });
// // // //       toast.success('Order record deleted');
// // // //     },
// // // //     onError: (error) => toast.error(error.response?.data?.message || 'Could not delete order'),
// // // //   });

// // // //   const handleStatusUpdate = (order, status) => {
// // // //     if (!status || updatingOrderId) return;
// // // //     const paymentCollectionMethod = servicePaymentDrafts[order._id] || '';
// // // //     const isCodCompletion = status === 'completed' && String(order.paymentMethod || '').toLowerCase() === 'cod';
// // // //     if (isCodCompletion && !paymentCollectionMethod) {
// // // //       toast.error('Select Cash or UPI before marking this COD order complete');
// // // //       return;
// // // //     }
// // // //     setUpdatingOrderId(order._id);
// // // //     updateStatusMutation.mutate(
// // // //       { orderId: order._id, status, paymentCollectionMethod },
// // // //       {
// // // //         onSuccess: () => {
// // // //           if (status === 'completed') {
// // // //             setServicePaymentDrafts((prev) => {
// // // //               const next = { ...prev };
// // // //               delete next[order._id];
// // // //               return next;
// // // //             });
// // // //           }
// // // //         },
// // // //         onSettled: () => setUpdatingOrderId(null),
// // // //       }
// // // //     );
// // // //   };

// // // //   const handleDeleteOrder = (order) => {
// // // //     if (!order?._id) return;
// // // //     const confirmed = window.confirm(`Delete order ${order.orderId || order._id.slice(-6)} from staff history?`);
// // // //     if (!confirmed) return;
// // // //     deleteOrderMutation.mutate(order._id);
// // // //   };

// // // //   useEffect(() => {
// // // //     const socket = io(import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000', { withCredentials: true });
// // // //     socket.emit('join-room', { room: 'staff' });
// // // //     const notify = (message) => { refetch(); if (prefs.soundEnabled) playQueueBeep(); toast.success(message); };
// // // //     socket.on('new-order', () => notify('New order arrived!'));
// // // //     socket.on('order-updated', () => refetch());
// // // //     return () => socket.disconnect();
// // // //   }, [prefs.soundEnabled, refetch]);

// // // //   const filterOptions = [
// // // //     { value: 'active', label: 'Active Orders' },
// // // //     { value: 'placed', label: 'Placed' },
// // // //     { value: 'confirmed', label: 'Confirmed' },
// // // //     { value: 'preparing', label: 'Preparing' },
// // // //     { value: 'ready', label: 'Ready' },
// // // //     { value: 'out-for-delivery', label: 'Out for Delivery' },
// // // //     { value: 'delivered', label: 'Delivered' },
// // // //     { value: 'cancelled', label: 'Cancelled' },
// // // //   ];

// // // //   const handlePageChange = (page) => {
// // // //     setCurrentPage(page);
// // // //     window.scrollTo({ top: 0, behavior: 'smooth' });
// // // //   };

// // // //   return (
// // // //     <div className="min-h-screen bg-[#faf8f5]">
// // // //       {/* Header */}
// // // //       <header className="bg-white border-b border-[#e8e0d6] sticky top-0 z-20">
// // // //         <div className="max-w-7xl mx-auto px-6 py-4">
// // // //           <div className="flex flex-wrap items-center justify-between gap-4">
// // // //             <div>
// // // //               <h1 className="font-display text-2xl font-bold text-[#3f3328]">Order Queue</h1>
// // // //               <p className="text-sm text-[#6b5f54]">Manage and track customer orders</p>
// // // //             </div>
// // // //             <div className="flex items-center gap-3">
// // // //               <Link to="/staff/pos" className="inline-flex items-center gap-2 rounded-lg border border-[#e8e0d6] bg-white px-4 py-2 text-sm font-medium text-[#6b5f54] hover:border-[#b97844] hover:text-[#b97844] transition-all">
// // // //                 <Monitor size={16} /> POS Mode
// // // //               </Link>
// // // //               <Link to="/staff/settings" className="inline-flex items-center gap-2 rounded-lg border border-[#e8e0d6] bg-white px-4 py-2 text-sm font-medium text-[#6b5f54] hover:border-[#b97844] hover:text-[#b97844] transition-all">
// // // //                 <Settings size={16} /> Settings
// // // //               </Link>
// // // //               <button onClick={() => refetch()} className="p-2 rounded-lg border border-[#e8e0d6] bg-white hover:bg-[#faf8f5] transition-all">
// // // //                 <RefreshCw size={16} className="text-[#6b5f54]" />
// // // //               </button>
// // // //             </div>
// // // //           </div>
// // // //         </div>
// // // //       </header>

// // // //       <div className="max-w-7xl mx-auto px-6 py-6">
// // // //         {/* Filters Bar */}
// // // //         <div className="bg-white border border-[#e8e0d6] rounded-xl p-4 mb-6">
// // // //           <div className="flex flex-wrap items-center justify-between gap-4">
// // // //             <div className="flex flex-wrap gap-2">
// // // //               {filterOptions.map((option) => (
// // // //                 <button
// // // //                   key={option.value}
// // // //                   onClick={() => setFilter(option.value)}
// // // //                   className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
// // // //                     filter === option.value
// // // //                       ? 'bg-[#b97844] text-white'
// // // //                       : 'bg-[#faf8f5] text-[#6b5f54] hover:bg-[#e8e0d6]'
// // // //                   }`}
// // // //                 >
// // // //                   {option.label}
// // // //                 </button>
// // // //               ))}
// // // //             </div>
// // // //             <div className="relative">
// // // //               <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#a0968c]" />
// // // //               <input
// // // //                 type="text"
// // // //                 value={searchTerm}
// // // //                 onChange={(e) => setSearchTerm(e.target.value)}
// // // //                 placeholder="Search orders..."
// // // //                 className="pl-9 pr-4 py-2 rounded-lg border border-[#e8e0d6] text-sm focus:border-[#b97844] focus:outline-none w-64"
// // // //               />
// // // //             </div>
// // // //           </div>
// // // //         </div>

// // // //         {/* Stats Row */}
// // // //         <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
// // // //           <div className="bg-white border border-[#e8e0d6] rounded-xl p-4">
// // // //             <p className="text-xs text-[#6b5f54] uppercase tracking-wide">Total Orders</p>
// // // //             <p className="text-2xl font-bold text-[#3f3328]">{response?.total || 0}</p>
// // // //           </div>
// // // //           <div className="bg-white border border-[#e8e0d6] rounded-xl p-4">
// // // //             <p className="text-xs text-[#6b5f54] uppercase tracking-wide">Active</p>
// // // //             <p className="text-2xl font-bold text-[#3f3328]">{filteredOrders.filter(o => !['delivered', 'completed', 'cancelled'].includes(o.status)).length}</p>
// // // //           </div>
// // // //           <div className="bg-white border border-[#e8e0d6] rounded-xl p-4">
// // // //             <p className="text-xs text-[#6b5f54] uppercase tracking-wide">Preparing</p>
// // // //             <p className="text-2xl font-bold text-[#3f3328]">{filteredOrders.filter(o => o.status === 'preparing').length}</p>
// // // //           </div>
// // // //           <div className="bg-white border border-[#e8e0d6] rounded-xl p-4">
// // // //             <p className="text-xs text-[#6b5f54] uppercase tracking-wide">Ready</p>
// // // //             <p className="text-2xl font-bold text-[#3f3328]">{filteredOrders.filter(o => o.status === 'ready').length}</p>
// // // //           </div>
// // // //         </div>

// // // //         {/* Orders List */}
// // // //         {isLoading ? (
// // // //           <div className="space-y-3">
// // // //             {[1, 2, 3, 4].map(i => <div key={i} className="bg-white border border-[#e8e0d6] rounded-xl p-5 animate-pulse h-28" />)}
// // // //           </div>
// // // //         ) : paginatedOrders.length === 0 ? (
// // // //           <div className="bg-white border border-[#e8e0d6] rounded-xl p-12 text-center">
// // // //             <Package size={48} className="mx-auto text-[#a0968c] mb-4" />
// // // //             <h2 className="text-xl font-semibold text-[#3f3328] mb-2">No orders found</h2>
// // // //             <p className="text-[#6b5f54]">There are no {filter === 'active' ? 'active' : filter} orders at the moment.</p>
// // // //           </div>
// // // //         ) : (
// // // //           <>
// // // //             <div className="space-y-3">
// // // //               {paginatedOrders.map((order) => {
// // // //                 const isOpen = openOrderId === order._id;
// // // //                 const isAssignedToMe = order.assignedStaff?._id === user?._id;
// // // //                 const isAssignedToOther = !!order.assignedStaff && !isAssignedToMe;
// // // //                 const isDone = ['completed', 'delivered', 'cancelled'].includes(order.status);
// // // //                 const flow = getFlow(order.orderType);
// // // //                 const currentIndex = flow.indexOf(order.status);
// // // //                 const nextStatus = getStaffNextStatus(order);
// // // //                 const paymentSummary = getPaymentSummary(order);
// // // //                 const paymentDraft = servicePaymentDrafts[order._id] || '';
// // // //                 const showInvoiceLink = canOpenInvoice(order);
                
// // // //                 return (
// // // //                   <div key={order._id} className="bg-white border border-[#e8e0d6] rounded-xl overflow-hidden">
// // // //                     {/* Order Header */}
// // // //                     <div className="p-5 hover:bg-[#faf8f5] transition-all cursor-pointer" onClick={() => setOpenOrderId(isOpen ? null : order._id)}>
// // // //                       <div className="flex flex-wrap items-center justify-between gap-4">
// // // //                         <div className="flex items-center gap-4 flex-wrap">
// // // //                           <span className="font-mono text-sm font-bold text-[#3f3328]">#{order.orderId || order._id.slice(-6)}</span>
// // // //                           <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-lg text-xs font-medium ${typeStyles[order.orderType] || 'bg-gray-100 text-gray-700'}`}>
// // // //                             {order.orderType === 'dine-in' ? <Table2 size={12} /> : order.orderType === 'delivery' ? <Truck size={12} /> : <ShoppingBag size={12} />}
// // // //                             {order.orderType}
// // // //                           </span>
// // // //                           <span className={`inline-flex items-center px-2 py-1 rounded-lg text-xs font-medium ${statusStyles[order.status] || 'bg-gray-100 text-gray-700'}`}>
// // // //                             {order.status}
// // // //                           </span>
// // // //                           {order.scheduledTime && (
// // // //                             <span className="inline-flex items-center gap-1 text-xs text-[#6b5f54]">
// // // //                               <CalendarDays size={12} /> {new Date(order.scheduledTime).toLocaleString()}
// // // //                             </span>
// // // //                           )}
// // // //                         </div>
// // // //                         <div className="flex items-center gap-3">
// // // //                           <span className="text-lg font-bold text-[#3f3328]">₹{order.totalAmount}</span>
// // // //                           <ChevronDown size={18} className={`text-[#a0968c] transition-transform ${isOpen ? 'rotate-180' : ''}`} />
// // // //                         </div>
// // // //                       </div>
// // // //                       <div className="flex flex-wrap items-center justify-between gap-4 mt-3">
// // // //                         <p className="text-sm text-[#6b5f54]">
// // // //                           {order.guestName || order.customer?.name || 'Guest'} • {order.items?.length || 0} items
// // // //                         </p>
// // // //                         <div className="flex items-center gap-2">
// // // //                           {/* Only Show Confirm Button - No Claim Button */}
// // // //                           {nextStatus && !isDone && !isAssignedToOther && (
// // // //                             <button
// // // //                               onClick={(e) => { e.stopPropagation(); handleStatusUpdate(order, nextStatus); }}
// // // //                               disabled={updatingOrderId === order._id}
// // // //                               className="px-3 py-1.5 rounded-lg bg-[#b97844] text-white text-sm font-medium hover:bg-[#9e6538] transition-all disabled:opacity-60 disabled:cursor-not-allowed"
// // // //                             >
// // // //                               {getActionLabel(order.orderType, nextStatus)}
// // // //                             </button>
// // // //                           )}
// // // //                           {isAssignedToOther && (
// // // //                             <span className="text-sm text-[#a0968c]">Assigned to {order.assignedStaff?.name}</span>
// // // //                           )}
// // // //                         </div>
// // // //                       </div>
// // // //                     </div>

// // // //                     {/* Expanded Details */}
// // // //                     {isOpen && (
// // // //                       <div className="border-t border-[#e8e0d6] bg-[#faf8f5] p-5">
// // // //                         <div className="grid md:grid-cols-2 gap-6">
// // // //                           {/* Items List */}
// // // //                           <div>
// // // //                             <h3 className="font-semibold text-[#3f3328] mb-3 flex items-center gap-2">
// // // //                               <Package size={16} className="text-[#b97844]" /> Order Items
// // // //                             </h3>
// // // //                             <div className="space-y-2">
// // // //                               {order.items?.map((item, idx) => (
// // // //                                 <div key={idx} className="flex justify-between items-center py-2 border-b border-[#e8e0d6] last:border-0">
// // // //                                   <div>
// // // //                                     <p className="font-medium text-[#3f3328]">{item.name}</p>
// // // //                                     <p className="text-xs text-[#6b5f54]">Quantity: {item.quantity}</p>
// // // //                                   </div>
// // // //                                   <p className="font-semibold text-[#3f3328]">₹{item.totalPrice || item.unitPrice * item.quantity}</p>
// // // //                                 </div>
// // // //                               ))}
// // // //                             </div>
// // // //                             {order.specialNotes && (
// // // //                               <div className="mt-4 p-3 bg-amber-50 rounded-lg">
// // // //                                 <p className="text-sm text-amber-700"><strong>Notes:</strong> {order.specialNotes}</p>
// // // //                               </div>
// // // //                             )}
// // // //                           </div>

// // // //                           {/* Order Progress */}
// // // //                           <div>
// // // //                             <h3 className="font-semibold text-[#3f3328] mb-3 flex items-center gap-2">
// // // //                               <Clock size={16} className="text-[#b97844]" /> Order Progress
// // // //                             </h3>
// // // //                             <div className="space-y-3">
// // // //                               {flow.map((step, index) => {
// // // //                                 const done = currentIndex >= index;
// // // //                                 const active = currentIndex === index;
// // // //                                 return (
// // // //                                   <div key={step} className="flex items-center gap-3">
// // // //                                     <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${done ? 'bg-[#b97844] text-white' : 'bg-[#e8e0d6] text-[#a0968c]'}`}>
// // // //                                       {done ? <CheckCircle size={14} /> : index + 1}
// // // //                                     </div>
// // // //                                     <div>
// // // //                                       <p className={`font-medium ${active ? 'text-[#b97844]' : done ? 'text-[#3f3328]' : 'text-[#a0968c]'}`}>
// // // //                                         {STEP_LABELS[step]}
// // // //                                       </p>
// // // //                                       {active && <p className="text-xs text-[#6b5f54]">Current status</p>}
// // // //                                     </div>
// // // //                                   </div>
// // // //                                 );
// // // //                               })}
// // // //                             </div>
// // // //                             {order.assignedStaff && (
// // // //                               <div className="mt-4 p-3 bg-white rounded-lg border border-[#e8e0d6]">
// // // //                                 <p className="text-sm text-[#6b5f54]">Assigned to: <span className="font-medium text-[#3f3328]">{order.assignedStaff?.name}</span></p>
// // // //                               </div>
// // // //                             )}
// // // //                             <div className="mt-4 space-y-3">
// // // //                               <div className="rounded-lg border border-[#e8e0d6] bg-white p-3">
// // // //                                 <p className="text-xs uppercase tracking-wide text-[#6b5f54]">Booking Details</p>
// // // //                                 <div className="mt-2 space-y-1 text-sm text-[#3f3328]">
// // // //                                   <p><span className="text-[#6b5f54]">Customer:</span> {order.guestName || order.customer?.name || 'Guest'}</p>
// // // //                                   <p><span className="text-[#6b5f54]">Phone:</span> {order.guestPhone || order.customer?.phone || 'Not available'}</p>
// // // //                                   {order.tableNumber && <p><span className="text-[#6b5f54]">Table:</span> {order.tableNumber}</p>}
// // // //                                 </div>
// // // //                               </div>
// // // //                               <div className="rounded-lg border border-[#e8e0d6] bg-white p-3">
// // // //                                 <p className="text-xs uppercase tracking-wide text-[#6b5f54]">Payment</p>
// // // //                                 <p className="mt-2 text-sm font-medium text-[#3f3328]">{paymentSummary}</p>
// // // //                                 {showInvoiceLink && (
// // // //                                   <div className="mt-3 flex flex-wrap gap-2">
// // // //                                     <Link to={`/invoice/${order._id}`} className="inline-flex items-center justify-center rounded-lg border border-[#e8e0d6] px-3 py-2 text-sm font-medium text-[#6b5f54] hover:border-[#b97844] hover:text-[#b97844] transition-all">
// // // //                                       View Invoice
// // // //                                     </Link>
// // // //                                     <button
// // // //                                       type="button"
// // // //                                       onClick={() => handleDeleteOrder(order)}
// // // //                                       disabled={deleteOrderMutation.isPending}
// // // //                                       className="inline-flex items-center justify-center rounded-lg border border-red-200 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 transition-all disabled:opacity-60"
// // // //                                     >
// // // //                                       Delete Record
// // // //                                     </button>
// // // //                                   </div>
// // // //                                 )}
// // // //                               </div>
// // // //                               {nextStatus === 'completed' && String(order.paymentMethod || '').toLowerCase() === 'cod' && !isDone && (
// // // //                                 <div className="rounded-lg border border-[#e8e0d6] bg-white p-3">
// // // //                                   <p className="text-xs uppercase tracking-wide text-[#6b5f54]">Collect Payment</p>
// // // //                                   <div className="mt-3 flex flex-wrap gap-2">
// // // //                                     {['cash', 'upi'].map((method) => (
// // // //                                       <button
// // // //                                         key={method}
// // // //                                         type="button"
// // // //                                         onClick={() => setServicePaymentDrafts((prev) => ({ ...prev, [order._id]: method }))}
// // // //                                         className={`rounded-lg border px-3 py-2 text-sm font-medium transition-all ${
// // // //                                           paymentDraft === method
// // // //                                             ? PAYMENT_OPTION_STYLES[method]
// // // //                                             : 'border-[#e8e0d6] bg-[#faf8f5] text-[#6b5f54] hover:border-[#b97844] hover:text-[#b97844]'
// // // //                                         }`}
// // // //                                       >
// // // //                                         {method === 'cash' ? 'Cash Received' : 'UPI Received'}
// // // //                                       </button>
// // // //                                     ))}
// // // //                                   </div>
// // // //                                   <p className="mt-2 text-xs text-[#6b5f54]">
// // // //                                     Select how the customer paid before marking this order served or picked up.
// // // //                                   </p>
// // // //                                   {paymentDraft === 'upi' && (
// // // //                                     <div className="mt-4 rounded-xl border border-[#e8e0d6] bg-[#faf8f5] p-4">
// // // //                                       <div className="flex flex-col gap-4 md:flex-row md:items-center">
// // // //                                         <div className="rounded-xl bg-white p-3 shadow-sm">
// // // //                                           <QRCodeCanvas value={buildStaffUpiUri(order)} size={136} includeMargin />
// // // //                                         </div>
// // // //                                         <div className="space-y-2 text-sm text-[#3f3328]">
// // // //                                           <p className="font-semibold text-[#3f3328]">Show this UPI QR to the customer</p>
// // // //                                           <p className="text-[#6b5f54]">UPI ID: <span className="font-medium break-all text-[#3f3328]">{CAFE_UPI_ID}</span></p>
// // // //                                           <p className="text-[#6b5f54]">Amount: <span className="font-medium text-[#3f3328]">Rs. {Number(order.totalAmount || 0).toFixed(2)}</span></p>
// // // //                                           <p className="text-xs text-[#6b5f54]">After payment is received, click {getActionLabel(order.orderType, nextStatus)}. The invoice is generated at completion and appears in the customer account.</p>
// // // //                                         </div>
// // // //                                       </div>
// // // //                                     </div>
// // // //                                   )}
// // // //                                 </div>
// // // //                               )}
// // // //                             </div>
// // // //                           </div>
// // // //                         </div>
// // // //                       </div>
// // // //                     )}
// // // //                   </div>
// // // //                 );
// // // //               })}
// // // //             </div>

// // // //             {/* Pagination */}
// // // //             {totalPages > 1 && (
// // // //               <div className="flex flex-col items-center gap-3 mt-6 pt-4 border-t border-[#e8e0d6]">
// // // //                 <div className="flex justify-center items-center gap-2">
// // // //                   <button
// // // //                     onClick={() => handlePageChange(currentPage - 1)}
// // // //                     disabled={currentPage === 1}
// // // //                     className="w-9 h-9 rounded-full border border-[#e8e0d6] text-[#6b5f54] flex items-center justify-center hover:border-[#b97844] hover:text-[#b97844] disabled:opacity-40 disabled:cursor-not-allowed transition-all"
// // // //                   >
// // // //                     <ChevronLeft size={16} />
// // // //                   </button>
                  
// // // //                   <div className="flex gap-2">
// // // //                     {[...Array(totalPages)].map((_, i) => {
// // // //                       const pageNum = i + 1;
// // // //                       if (pageNum === 1 || pageNum === totalPages || (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)) {
// // // //                         return (
// // // //                           <button
// // // //                             key={pageNum}
// // // //                             onClick={() => handlePageChange(pageNum)}
// // // //                             className={`w-9 h-9 rounded-full text-sm font-medium transition-all ${
// // // //                               currentPage === pageNum
// // // //                                 ? 'bg-[#b97844] text-white'
// // // //                                 : 'border border-[#e8e0d6] text-[#6b5f54] hover:border-[#b97844] hover:text-[#b97844]'
// // // //                             }`}
// // // //                           >
// // // //                             {pageNum}
// // // //                           </button>
// // // //                         );
// // // //                       }
// // // //                       if (pageNum === currentPage - 2 || pageNum === currentPage + 2) {
// // // //                         return <span key={pageNum} className="text-[#a0968c]">...</span>;
// // // //                       }
// // // //                       return null;
// // // //                     })}
// // // //                   </div>

// // // //                   <button
// // // //                     onClick={() => handlePageChange(currentPage + 1)}
// // // //                     disabled={currentPage === totalPages}
// // // //                     className="w-9 h-9 rounded-full border border-[#e8e0d6] text-[#6b5f54] flex items-center justify-center hover:border-[#b97844] hover:text-[#b97844] disabled:opacity-40 disabled:cursor-not-allowed transition-all"
// // // //                   >
// // // //                     <ChevronRight size={16} />
// // // //                   </button>
// // // //                 </div>
// // // //                 <div className="text-center text-xs text-[#a0968c]">
// // // //                   Showing {(currentPage - 1) * ORDERS_PER_PAGE + 1} - {Math.min(currentPage * ORDERS_PER_PAGE, filteredOrders.length)} of {filteredOrders.length} orders
// // // //                 </div>
// // // //               </div>
// // // //             )}
// // // //           </>
// // // //         )}
// // // //       </div>
// // // //     </div>
// // // //   );
// // // // }

// // // import { useEffect, useMemo, useState } from 'react';
// // // import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
// // // import { 
// // //   BellRing, ChevronDown, ChevronUp, Clock, Hand, Monitor, RefreshCw, 
// // //   Settings, ShoppingBag, Table2, Truck, UserCircle2, Package, CheckCircle, 
// // //   XCircle, ChefHat, CalendarDays, Search, Filter, ChevronLeft, ChevronRight,
// // //   Phone, User, Eye, Printer, Trash2, AlertCircle, Wifi, WifiOff
// // // } from 'lucide-react';
// // // import { io } from 'socket.io-client';
// // // import toast from 'react-hot-toast';
// // // import { QRCodeCanvas } from 'qrcode.react';
// // // import api from '../../services/api';
// // // import { Link } from 'react-router-dom';
// // // import { useSelector } from 'react-redux';

// // // const STAFF_PREFS_KEY = 'staffQueuePrefs';
// // // const DEFAULT_PREFS = { soundEnabled: true, showOnlyAssigned: false, compactView: false };
// // // const ORDERS_PER_PAGE = 10;

// // // const typeStyles = {
// // //   'dine-in': 'bg-emerald-100 text-emerald-700',
// // //   takeaway: 'bg-violet-100 text-violet-700',
// // //   delivery: 'bg-sky-100 text-sky-700',
// // //   'pre-order': 'bg-orange-100 text-orange-700',
// // // };

// // // const statusStyles = {
// // //   placed: 'bg-amber-100 text-amber-700',
// // //   confirmed: 'bg-blue-100 text-blue-700',
// // //   preparing: 'bg-orange-100 text-orange-700',
// // //   ready: 'bg-emerald-100 text-emerald-700',
// // //   'out-for-delivery': 'bg-indigo-100 text-indigo-700',
// // //   delivered: 'bg-green-100 text-green-700',
// // //   completed: 'bg-teal-100 text-teal-700',
// // //   cancelled: 'bg-red-100 text-red-700',
// // // };

// // // const STEP_LABELS = { 
// // //   placed: 'Order Placed', 
// // //   confirmed: 'Confirmed', 
// // //   preparing: 'Preparing', 
// // //   ready: 'Ready', 
// // //   completed: 'Completed', 
// // //   delivered: 'Delivered',
// // //   'out-for-delivery': 'Out for Delivery'
// // // };

// // // const PAYMENT_OPTION_STYLES = {
// // //   cash: 'bg-emerald-100 text-emerald-700 border-emerald-200',
// // //   upi: 'bg-blue-100 text-blue-700 border-blue-200',
// // // };

// // // const CAFE_UPI_ID = import.meta.env.VITE_CAFE_UPI_ID || 'kashishsolanki8082@okaxis';

// // // function readQueuePrefs() {
// // //   if (typeof window === 'undefined') return DEFAULT_PREFS;
// // //   try {
// // //     const raw = window.localStorage.getItem(STAFF_PREFS_KEY);
// // //     return raw ? { ...DEFAULT_PREFS, ...JSON.parse(raw) } : DEFAULT_PREFS;
// // //   } catch {
// // //     return DEFAULT_PREFS;
// // //   }
// // // }

// // // function playQueueBeep() {
// // //   if (typeof window === 'undefined') return;
// // //   const AudioContextClass = window.AudioContext || window.webkitAudioContext;
// // //   if (!AudioContextClass) return;
// // //   const context = new AudioContextClass();
// // //   const oscillator = context.createOscillator();
// // //   const gain = context.createGain();
// // //   oscillator.type = 'sine';
// // //   oscillator.frequency.value = 880;
// // //   gain.gain.value = 0.02;
// // //   oscillator.connect(gain);
// // //   gain.connect(context.destination);
// // //   oscillator.start();
// // //   oscillator.stop(context.currentTime + 0.12);
// // //   oscillator.onended = () => { if (context.state !== 'closed') context.close(); };
// // // }

// // // function getFlow(orderType) {
// // //   if (orderType === 'delivery') return ['placed', 'confirmed', 'preparing', 'ready', 'out-for-delivery', 'delivered'];
// // //   return ['placed', 'confirmed', 'preparing', 'ready', 'completed'];
// // // }

// // // function getNextStaffStatus(order) {
// // //   if (!order) return null;
// // //   const normalizedStatus = String(order.status || '').toLowerCase();
// // //   const flow = getFlow(order.orderType);
// // //   const currentIndex = flow.indexOf(normalizedStatus);
// // //   if (currentIndex === -1) return null;
// // //   return flow[currentIndex + 1] || null;
// // // }

// // // function getActionLabel(orderType, nextStatus) {
// // //   if (!nextStatus) return '';
// // //   const labels = {
// // //     confirmed: 'Confirm Order',
// // //     preparing: 'Start Preparing',
// // //     ready: 'Mark Ready',
// // //     'out-for-delivery': 'Assign Rider',
// // //     delivered: 'Mark Delivered',
// // //     completed: orderType === 'takeaway' ? 'Mark Picked Up' : 'Mark Served'
// // //   };
// // //   return labels[nextStatus] || STEP_LABELS[nextStatus] || nextStatus;
// // // }

// // // function getPaymentSummary(order) {
// // //   const collectedMethod = String(order?.deliveryPayment?.method || '').toLowerCase();
// // //   const checkoutMethod = String(order?.paymentMethod || '').toLowerCase();
// // //   const paymentStatus = String(order?.deliveryPayment?.status || order?.paymentStatus || 'pending').toLowerCase();

// // //   if (paymentStatus === 'paid') {
// // //     if (collectedMethod === 'cash') return 'Cash • Payment Complete';
// // //     if (collectedMethod === 'upi') return 'UPI • Payment Complete';
// // //     if (checkoutMethod === 'online') return 'Online • Payment Complete';
// // //   }

// // //   if (checkoutMethod === 'cod') return 'COD • Awaiting Payment';
// // //   if (checkoutMethod === 'online') return 'Online • Paid';
// // //   return `${checkoutMethod || 'pending'} • ${paymentStatus || 'pending'}`;
// // // }

// // // function buildStaffUpiUri(order) {
// // //   const amount = Number(order?.totalAmount || 0).toFixed(2);
// // //   return `upi://pay?pa=${encodeURIComponent(CAFE_UPI_ID)}&pn=${encodeURIComponent('Roller Coaster Cafe')}&am=${encodeURIComponent(amount)}&cu=INR&tn=${encodeURIComponent(`Order ${order?.orderId || ''} - ${order?.guestName || order?.customer?.name || 'Customer'}`)}&tr=${encodeURIComponent(order?.orderId || '')}`;
// // // }

// // // function canOpenInvoice(order) {
// // //   return ['completed', 'delivered'].includes(String(order?.status || '').toLowerCase());
// // // }

// // // function formatDateTime(date) {
// // //   if (!date) return '-';
// // //   return new Date(date).toLocaleString();
// // // }

// // // // Role-based visible statuses
// // // const getVisibleStatuses = (role) => {
// // //   switch(role) {
// // //     case 'kitchen':
// // //       return ['placed', 'confirmed', 'preparing'];
// // //     case 'delivery':
// // //       return ['ready', 'out-for-delivery'];
// // //     case 'cashier':
// // //     case 'waiter':
// // //       return ['ready'];
// // //     case 'admin':
// // //     case 'manager':
// // //       return ['placed', 'confirmed', 'preparing', 'ready', 'out-for-delivery', 'delivered', 'completed'];
// // //     default:
// // //       return ['placed', 'confirmed', 'preparing', 'ready', 'out-for-delivery', 'delivered', 'completed'];
// // //   }
// // // };

// // // // Role-based available actions
// // // const getAvailableActions = (role, order) => {
// // //   const status = order.status;
// // //   const orderType = order.orderType;
  
// // //   if (role === 'kitchen') {
// // //     if (status === 'placed' || status === 'confirmed') return ['preparing'];
// // //     if (status === 'preparing') return ['ready'];
// // //     return [];
// // //   }
  
// // //   if (role === 'delivery') {
// // //     if (status === 'ready' && orderType === 'delivery') return ['out-for-delivery'];
// // //     if (status === 'out-for-delivery') return ['delivered'];
// // //     return [];
// // //   }
  
// // //   if (role === 'cashier' || role === 'waiter') {
// // //     if (status === 'ready' && orderType !== 'delivery') return ['completed'];
// // //     return [];
// // //   }
  
// // //   // Admin/Manager sees all actions
// // //   const nextStatus = getNextStaffStatus(order);
// // //   return nextStatus ? [nextStatus] : [];
// // // };

// // // export default function OrderQueue() {
// // //   const queryClient = useQueryClient();
// // //   const { user } = useSelector((state) => state.auth);
// // //   const userRole = user?.role || 'cashier';
  
// // //   const [filter, setFilter] = useState('active');
// // //   const [searchTerm, setSearchTerm] = useState('');
// // //   const [prefs, setPrefs] = useState(DEFAULT_PREFS);
// // //   const [openOrderId, setOpenOrderId] = useState(null);
// // //   const [currentPage, setCurrentPage] = useState(1);
// // //   const [updatingOrderId, setUpdatingOrderId] = useState(null);
// // //   const [servicePaymentDrafts, setServicePaymentDrafts] = useState({});
// // //   const [socketConnected, setSocketConnected] = useState(false);
// // //   const [socket, setSocket] = useState(null);

// // //   useEffect(() => {
// // //     setPrefs(readQueuePrefs());
// // //     const handleStorage = () => setPrefs(readQueuePrefs());
// // //     window.addEventListener('storage', handleStorage);
// // //     return () => window.removeEventListener('storage', handleStorage);
// // //   }, []);

// // //   // WebSocket connection for real-time updates
// // //   useEffect(() => {
// // //     const socketUrl = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000';
// // //     const newSocket = io(socketUrl, { withCredentials: true });
    
// // //     newSocket.on('connect', () => {
// // //       setSocketConnected(true);
// // //       newSocket.emit('join-room', { room: 'staff' });
// // //     });
    
// // //     newSocket.on('disconnect', () => setSocketConnected(false));
// // //     newSocket.on('connect_error', () => setSocketConnected(false));
    
// // //     newSocket.on('new-order', () => {
// // //       refetch();
// // //       if (prefs.soundEnabled) playQueueBeep();
// // //       toast.success('New order arrived!');
// // //     });
    
// // //     newSocket.on('order-updated', () => refetch());
    
// // //     setSocket(newSocket);
    
// // //     return () => {
// // //       if (newSocket) newSocket.disconnect();
// // //     };
// // //   }, [prefs.soundEnabled, refetch]);

// // //   const { data: response, isLoading, refetch } = useQuery({
// // //     queryKey: ['staff-orders', filter],
// // //     queryFn: () => api.get('/orders', { params: { status: filter === 'active' ? undefined : filter, limit: 100 } }).then((res) => res.data),
// // //     refetchInterval: 15000,
// // //   });

// // //   // Filter orders based on role
// // //   const filteredOrders = useMemo(() => {
// // //     let rows = response?.orders || [];
// // //     const visibleStatuses = getVisibleStatuses(userRole);
    
// // //     // Filter by role - show only relevant statuses
// // //     rows = rows.filter((order) => visibleStatuses.includes(order.status));
    
// // //     // Filter by active/completed
// // //     if (filter === 'active') {
// // //       rows = rows.filter((order) => !['delivered', 'completed', 'cancelled'].includes(order.status));
// // //     }
    
// // //     // Filter by assigned only
// // //     if (prefs.showOnlyAssigned) {
// // //       rows = rows.filter((order) => order.assignedStaff?._id === user?._id);
// // //     }
    
// // //     // Search filter
// // //     if (searchTerm.trim()) {
// // //       const term = searchTerm.toLowerCase();
// // //       rows = rows.filter((order) => 
// // //         (order.orderId || '').toLowerCase().includes(term) ||
// // //         (order.guestName || order.customer?.name || '').toLowerCase().includes(term) ||
// // //         (order.guestPhone || order.customer?.phone || '').toLowerCase().includes(term) ||
// // //         (order.items?.some(item => item.name.toLowerCase().includes(term)))
// // //       );
// // //     }
    
// // //     return rows;
// // //   }, [response, filter, prefs.showOnlyAssigned, user?._id, searchTerm, userRole]);

// // //   // Pagination
// // //   const totalPages = Math.ceil(filteredOrders.length / ORDERS_PER_PAGE);
// // //   const paginatedOrders = useMemo(() => {
// // //     const start = (currentPage - 1) * ORDERS_PER_PAGE;
// // //     return filteredOrders.slice(start, start + ORDERS_PER_PAGE);
// // //   }, [filteredOrders, currentPage]);

// // //   useEffect(() => {
// // //     setCurrentPage(1);
// // //   }, [filter, searchTerm]);

// // //   const updateStatusMutation = useMutation({
// // //     mutationFn: ({ orderId, status, paymentCollectionMethod }) => api.put(`/orders/${orderId}/status`, { status, paymentCollectionMethod }),
// // //     onSuccess: () => { 
// // //       queryClient.invalidateQueries({ queryKey: ['staff-orders'] }); 
// // //       toast.success('Order status updated');
// // //       setOpenOrderId(null);
// // //     },
// // //     onError: (error) => toast.error(error.response?.data?.message || 'Could not update order'),
// // //   });

// // //   const deleteOrderMutation = useMutation({
// // //     mutationFn: (orderId) => api.delete(`/orders/${orderId}`),
// // //     onSuccess: () => {
// // //       queryClient.invalidateQueries({ queryKey: ['staff-orders'] });
// // //       toast.success('Order deleted');
// // //       setOpenOrderId(null);
// // //     },
// // //     onError: (error) => toast.error(error.response?.data?.message || 'Could not delete order'),
// // //   });

// // //   const handleStatusUpdate = (order, status) => {
// // //     if (!status || updatingOrderId) return;
// // //     const paymentCollectionMethod = servicePaymentDrafts[order._id] || '';
// // //     const isCodCompletion = status === 'completed' && String(order.paymentMethod || '').toLowerCase() === 'cod';
// // //     if (isCodCompletion && !paymentCollectionMethod) {
// // //       toast.error('Select Cash or UPI before completing this COD order');
// // //       return;
// // //     }
// // //     setUpdatingOrderId(order._id);
// // //     updateStatusMutation.mutate(
// // //       { orderId: order._id, status, paymentCollectionMethod },
// // //       {
// // //         onSuccess: () => {
// // //           if (status === 'completed') {
// // //             setServicePaymentDrafts((prev) => {
// // //               const next = { ...prev };
// // //               delete next[order._id];
// // //               return next;
// // //             });
// // //           }
// // //         },
// // //         onSettled: () => setUpdatingOrderId(null),
// // //       }
// // //     );
// // //   };

// // //   const handleDeleteOrder = (order) => {
// // //     if (!order?._id) return;
// // //     const confirmed = window.confirm(`Delete order ${order.orderId || order._id.slice(-6)}? This action cannot be undone.`);
// // //     if (!confirmed) return;
// // //     deleteOrderMutation.mutate(order._id);
// // //   };

// // //   const printReceipt = (order) => {
// // //     const printWindow = window.open('', '_blank');
// // //     printWindow.document.write(`
// // //       <html>
// // //         <head><title>Order Receipt ${order.orderId}</title></head>
// // //         <body style="font-family: Arial; padding: 20px;">
// // //           <h1>Roller Coaster Cafe</h1>
// // //           <h3>Order Receipt</h3>
// // //           <p><strong>Order ID:</strong> ${order.orderId}</p>
// // //           <p><strong>Customer:</strong> ${order.guestName || order.customer?.name || 'Guest'}</p>
// // //           <p><strong>Phone:</strong> ${order.guestPhone || order.customer?.phone || '-'}</p>
// // //           <p><strong>Order Type:</strong> ${order.orderType}</p>
// // //           <p><strong>Status:</strong> ${order.status}</p>
// // //           <hr/>
// // //           <h4>Items:</h4>
// // //           <ul>
// // //             ${order.items?.map(item => `<li>${item.quantity} x ${item.name} - ₹${item.totalPrice || item.unitPrice * item.quantity}</li>`).join('')}
// // //           </ul>
// // //           <hr/>
// // //           <p><strong>Total:</strong> ₹${order.totalAmount}</p>
// // //         </body>
// // //       </html>
// // //     `);
// // //     printWindow.document.close();
// // //     printWindow.print();
// // //   };

// // //   // Role-specific filter options
// // //   const getFilterOptions = () => {
// // //     if (userRole === 'kitchen') {
// // //       return [
// // //         { value: 'active', label: 'Active Orders', icon: Clock },
// // //         { value: 'placed', label: 'Placed', icon: AlertCircle },
// // //         { value: 'confirmed', label: 'Confirmed', icon: CheckCircle },
// // //         { value: 'preparing', label: 'Preparing', icon: ChefHat },
// // //       ];
// // //     }
// // //     if (userRole === 'delivery') {
// // //       return [
// // //         { value: 'active', label: 'Active Deliveries', icon: Truck },
// // //         { value: 'ready', label: 'Ready for Pickup', icon: Package },
// // //         { value: 'out-for-delivery', label: 'Out for Delivery', icon: Truck },
// // //         { value: 'delivered', label: 'Delivered', icon: CheckCircle },
// // //       ];
// // //     }
// // //     if (userRole === 'cashier' || userRole === 'waiter') {
// // //       return [
// // //         { value: 'active', label: 'Ready Orders', icon: Package },
// // //         { value: 'ready', label: 'Ready', icon: Package },
// // //         { value: 'completed', label: 'Completed', icon: CheckCircle },
// // //       ];
// // //     }
// // //     return [
// // //       { value: 'active', label: 'Active Orders', icon: Clock },
// // //       { value: 'placed', label: 'Placed', icon: AlertCircle },
// // //       { value: 'confirmed', label: 'Confirmed', icon: CheckCircle },
// // //       { value: 'preparing', label: 'Preparing', icon: ChefHat },
// // //       { value: 'ready', label: 'Ready', icon: Package },
// // //       { value: 'out-for-delivery', label: 'Out for Delivery', icon: Truck },
// // //       { value: 'delivered', label: 'Delivered', icon: CheckCircle },
// // //       { value: 'cancelled', label: 'Cancelled', icon: XCircle },
// // //     ];
// // //   };

// // //   const filterOptions = getFilterOptions();

// // //   // Count orders by status (role-specific)
// // //   const statusCounts = useMemo(() => {
// // //     const orders = response?.orders || [];
// // //     const visibleStatuses = getVisibleStatuses(userRole);
// // //     const relevantOrders = orders.filter(o => visibleStatuses.includes(o.status));
// // //     return {
// // //       active: relevantOrders.filter(o => !['delivered', 'completed', 'cancelled'].includes(o.status)).length,
// // //       placed: relevantOrders.filter(o => o.status === 'placed').length,
// // //       confirmed: relevantOrders.filter(o => o.status === 'confirmed').length,
// // //       preparing: relevantOrders.filter(o => o.status === 'preparing').length,
// // //       ready: relevantOrders.filter(o => o.status === 'ready').length,
// // //       delivery: relevantOrders.filter(o => o.status === 'out-for-delivery').length,
// // //     };
// // //   }, [response, userRole]);

// // //   const handlePageChange = (page) => {
// // //     setCurrentPage(page);
// // //     window.scrollTo({ top: 0, behavior: 'smooth' });
// // //   };

// // //   // Role display name
// // //   const getRoleDisplayName = () => {
// // //     switch(userRole) {
// // //       case 'kitchen': return 'Kitchen';
// // //       case 'delivery': return 'Delivery';
// // //       case 'cashier': return 'Counter';
// // //       case 'waiter': return 'Waiter';
// // //       case 'admin': return 'Admin';
// // //       case 'manager': return 'Manager';
// // //       default: return 'Staff';
// // //     }
// // //   };

// // //   return (
// // //     <div className="min-h-screen bg-[#faf8f5]">
// // //       {/* Header */}
// // //       <header className="bg-white border-b border-[#e8e0d6] sticky top-0 z-20">
// // //         <div className="max-w-7xl mx-auto px-6 py-4">
// // //           <div className="flex flex-wrap items-center justify-between gap-4">
// // //             <div>
// // //               <h1 className="font-display text-2xl font-bold text-[#3f3328]">Order Queue</h1>
// // //               <p className="text-sm text-[#6b5f54]">
// // //                 {getRoleDisplayName()} Panel • Manage {userRole === 'kitchen' ? 'kitchen orders' : userRole === 'delivery' ? 'delivery orders' : 'customer orders'}
// // //               </p>
// // //             </div>
// // //             <div className="flex items-center gap-3">
// // //               <div className="flex items-center gap-2">
// // //                 {socketConnected ? (
// // //                   <span className="inline-flex items-center gap-1 text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full">
// // //                     <Wifi size={12} /> Live
// // //                   </span>
// // //                 ) : (
// // //                   <span className="inline-flex items-center gap-1 text-xs text-gray-400 bg-gray-50 px-2 py-1 rounded-full">
// // //                     <WifiOff size={12} /> Connecting
// // //                   </span>
// // //                 )}
// // //               </div>
// // //               <Link to="/staff/pos" className="inline-flex items-center gap-2 rounded-lg border border-[#e8e0d6] bg-white px-4 py-2 text-sm font-medium text-[#6b5f54] hover:border-[#b97844] hover:text-[#b97844] transition-all">
// // //                 <Monitor size={16} /> POS Mode
// // //               </Link>
// // //               <Link to="/staff/settings" className="inline-flex items-center gap-2 rounded-lg border border-[#e8e0d6] bg-white px-4 py-2 text-sm font-medium text-[#6b5f54] hover:border-[#b97844] hover:text-[#b97844] transition-all">
// // //                 <Settings size={16} /> Settings
// // //               </Link>
// // //               <button onClick={() => refetch()} className="p-2 rounded-lg border border-[#e8e0d6] bg-white hover:bg-[#faf8f5] transition-all">
// // //                 <RefreshCw size={16} className="text-[#6b5f54]" />
// // //               </button>
// // //             </div>
// // //           </div>
// // //         </div>
// // //       </header>

// // //       <div className="max-w-7xl mx-auto px-6 py-6">
// // //         {/* Stats Cards - Role specific */}
// // //         <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
// // //           <div className="bg-white border border-[#e8e0d6] rounded-xl p-3 text-center">
// // //             <p className="text-xs text-[#6b5f54]">Active</p>
// // //             <p className="text-xl font-bold text-[#3f3328]">{statusCounts.active}</p>
// // //           </div>
// // //           {(userRole === 'kitchen' || userRole === 'admin' || userRole === 'manager') && (
// // //             <>
// // //               <div className="bg-white border border-[#e8e0d6] rounded-xl p-3 text-center">
// // //                 <p className="text-xs text-[#6b5f54]">Placed</p>
// // //                 <p className="text-xl font-bold text-amber-600">{statusCounts.placed}</p>
// // //               </div>
// // //               <div className="bg-white border border-[#e8e0d6] rounded-xl p-3 text-center">
// // //                 <p className="text-xs text-[#6b5f54]">Preparing</p>
// // //                 <p className="text-xl font-bold text-orange-600">{statusCounts.preparing}</p>
// // //               </div>
// // //             </>
// // //           )}
// // //           <div className="bg-white border border-[#e8e0d6] rounded-xl p-3 text-center">
// // //             <p className="text-xs text-[#6b5f54]">Ready</p>
// // //             <p className="text-xl font-bold text-emerald-600">{statusCounts.ready}</p>
// // //           </div>
// // //           {(userRole === 'delivery' || userRole === 'admin' || userRole === 'manager') && (
// // //             <div className="bg-white border border-[#e8e0d6] rounded-xl p-3 text-center">
// // //               <p className="text-xs text-[#6b5f54]">Out for Delivery</p>
// // //               <p className="text-xl font-bold text-indigo-600">{statusCounts.delivery}</p>
// // //             </div>
// // //           )}
// // //         </div>

// // //         {/* Filters Bar */}
// // //         <div className="bg-white border border-[#e8e0d6] rounded-xl p-4 mb-6">
// // //           <div className="flex flex-wrap items-center justify-between gap-4">
// // //             <div className="flex flex-wrap gap-2">
// // //               {filterOptions.map((option) => (
// // //                 <button
// // //                   key={option.value}
// // //                   onClick={() => setFilter(option.value)}
// // //                   className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
// // //                     filter === option.value
// // //                       ? 'bg-[#b97844] text-white'
// // //                       : 'bg-[#faf8f5] text-[#6b5f54] hover:bg-[#e8e0d6]'
// // //                   }`}
// // //                 >
// // //                   <span className="flex items-center gap-1">
// // //                     <option.icon size={14} />
// // //                     {option.label}
// // //                     {statusCounts[option.value] > 0 && (
// // //                       <span className="ml-1 text-xs">({statusCounts[option.value]})</span>
// // //                     )}
// // //                   </span>
// // //                 </button>
// // //               ))}
// // //             </div>
// // //             <div className="relative">
// // //               <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#a0968c]" />
// // //               <input
// // //                 type="text"
// // //                 value={searchTerm}
// // //                 onChange={(e) => setSearchTerm(e.target.value)}
// // //                 placeholder="Search by ID, name, phone..."
// // //                 className="pl-9 pr-4 py-2 rounded-lg border border-[#e8e0d6] text-sm focus:border-[#b97844] focus:outline-none w-64"
// // //               />
// // //             </div>
// // //           </div>
// // //         </div>

// // //         {/* Orders List */}
// // //         {isLoading ? (
// // //           <div className="space-y-3">
// // //             {[1, 2, 3, 4].map(i => <div key={i} className="bg-white border border-[#e8e0d6] rounded-xl p-5 animate-pulse h-28" />)}
// // //           </div>
// // //         ) : paginatedOrders.length === 0 ? (
// // //           <div className="bg-white border border-[#e8e0d6] rounded-xl p-12 text-center">
// // //             <Package size={48} className="mx-auto text-[#a0968c] mb-4" />
// // //             <h2 className="text-xl font-semibold text-[#3f3328] mb-2">No orders found</h2>
// // //             <p className="text-[#6b5f54]">
// // //               {userRole === 'kitchen' ? 'No orders need cooking at the moment.' : 
// // //                userRole === 'delivery' ? 'No delivery orders ready for pickup.' :
// // //                userRole === 'cashier' ? 'No orders ready for customer pickup.' :
// // //                `There are no ${filter === 'active' ? 'active' : filter} orders.`}
// // //             </p>
// // //           </div>
// // //         ) : (
// // //           <>
// // //             <div className="space-y-3">
// // //               {paginatedOrders.map((order) => {
// // //                 const isOpen = openOrderId === order._id;
// // //                 const isAssignedToMe = order.assignedStaff?._id === user?._id;
// // //                 const isAssignedToOther = !!order.assignedStaff && !isAssignedToMe;
// // //                 const isDone = ['completed', 'delivered', 'cancelled'].includes(order.status);
// // //                 const flow = getFlow(order.orderType);
// // //                 const currentIndex = flow.indexOf(order.status);
// // //                 const availableActions = getAvailableActions(userRole, order);
// // //                 const paymentSummary = getPaymentSummary(order);
// // //                 const paymentDraft = servicePaymentDrafts[order._id] || '';
// // //                 const showInvoiceLink = canOpenInvoice(order);
                
// // //                 return (
// // //                   <div key={order._id} className="bg-white border border-[#e8e0d6] rounded-xl overflow-hidden">
// // //                     {/* Order Header */}
// // //                     <div className="p-5 hover:bg-[#faf8f5] transition-all cursor-pointer" onClick={() => setOpenOrderId(isOpen ? null : order._id)}>
// // //                       <div className="flex flex-wrap items-center justify-between gap-4">
// // //                         <div className="flex items-center gap-4 flex-wrap">
// // //                           <span className="font-mono text-sm font-bold text-[#3f3328]">#{order.orderId || order._id.slice(-6)}</span>
// // //                           <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-lg text-xs font-medium ${typeStyles[order.orderType] || 'bg-gray-100 text-gray-700'}`}>
// // //                             {order.orderType === 'dine-in' ? <Table2 size={12} /> : order.orderType === 'delivery' ? <Truck size={12} /> : <ShoppingBag size={12} />}
// // //                             {order.orderType}
// // //                           </span>
// // //                           <span className={`inline-flex items-center px-2 py-1 rounded-lg text-xs font-medium ${statusStyles[order.status] || 'bg-gray-100 text-gray-700'}`}>
// // //                             {order.status}
// // //                           </span>
// // //                           {order.scheduledTime && (
// // //                             <span className="inline-flex items-center gap-1 text-xs text-[#6b5f54]">
// // //                               <CalendarDays size={12} /> {new Date(order.scheduledTime).toLocaleString()}
// // //                             </span>
// // //                           )}
// // //                         </div>
// // //                         <div className="flex items-center gap-3">
// // //                           <span className="text-lg font-bold text-[#3f3328]">₹{order.totalAmount}</span>
// // //                           <ChevronDown size={18} className={`text-[#a0968c] transition-transform ${isOpen ? 'rotate-180' : ''}`} />
// // //                         </div>
// // //                       </div>
// // //                       <div className="flex flex-wrap items-center justify-between gap-4 mt-3">
// // //                         <div>
// // //                           <p className="text-sm text-[#6b5f54]">
// // //                             {order.guestName || order.customer?.name || 'Guest'} • {order.items?.length || 0} items
// // //                           </p>
// // //                           {order.guestPhone && (
// // //                             <p className="text-xs text-[#6b5f54] flex items-center gap-1 mt-1">
// // //                               <Phone size={10} /> {order.guestPhone}
// // //                             </p>
// // //                           )}
// // //                         </div>
// // //                         <div className="flex items-center gap-2">
// // //                           {/* Role-specific action buttons */}
// // //                           {availableActions.map(action => (
// // //                             <button
// // //                               key={action}
// // //                               onClick={(e) => { e.stopPropagation(); handleStatusUpdate(order, action); }}
// // //                               disabled={updatingOrderId === order._id}
// // //                               className="px-3 py-1.5 rounded-lg bg-[#b97844] text-white text-sm font-medium hover:bg-[#9e6538] transition-all disabled:opacity-60"
// // //                             >
// // //                               {getActionLabel(order.orderType, action)}
// // //                             </button>
// // //                           ))}
                          
// // //                           {/* Print Button */}
// // //                           <button
// // //                             onClick={(e) => { e.stopPropagation(); printReceipt(order); }}
// // //                             className="p-1.5 rounded-lg border border-[#e8e0d6] text-[#6b5f54] hover:border-[#b97844] hover:text-[#b97844] transition-all"
// // //                             title="Print Receipt"
// // //                           >
// // //                             <Printer size={14} />
// // //                           </button>
                          
// // //                           {isAssignedToOther && (
// // //                             <span className="text-sm text-[#a0968c]">Assigned to {order.assignedStaff?.name}</span>
// // //                           )}
// // //                         </div>
// // //                       </div>
// // //                     </div>

// // //                     {/* Expanded Details */}
// // //                     {isOpen && (
// // //                       <div className="border-t border-[#e8e0d6] bg-[#faf8f5] p-5">
// // //                         <div className="grid md:grid-cols-2 gap-6">
// // //                           {/* Items List */}
// // //                           <div>
// // //                             <h3 className="font-semibold text-[#3f3328] mb-3 flex items-center gap-2">
// // //                               <Package size={16} className="text-[#b97844]" /> Order Items
// // //                             </h3>
// // //                             <div className="space-y-2 max-h-64 overflow-y-auto">
// // //                               {order.items?.map((item, idx) => (
// // //                                 <div key={idx} className="flex justify-between items-center py-2 border-b border-[#e8e0d6] last:border-0">
// // //                                   <div>
// // //                                     <p className="font-medium text-[#3f3328]">{item.name}</p>
// // //                                     <p className="text-xs text-[#6b5f54]">Quantity: {item.quantity}</p>
// // //                                     {item.variant && <p className="text-xs text-[#6b5f54]">Variant: {item.variant}</p>}
// // //                                     {item.addons?.length > 0 && <p className="text-xs text-[#6b5f54]">Addons: {item.addons.join(', ')}</p>}
// // //                                   </div>
// // //                                   <p className="font-semibold text-[#3f3328]">₹{item.totalPrice || item.unitPrice * item.quantity}</p>
// // //                                 </div>
// // //                               ))}
// // //                             </div>
// // //                             {order.specialNotes && (
// // //                               <div className="mt-4 p-3 bg-amber-50 rounded-lg">
// // //                                 <p className="text-sm text-amber-700"><strong>Special Notes:</strong> {order.specialNotes}</p>
// // //                               </div>
// // //                             )}
// // //                           </div>

// // //                           {/* Order Progress & Actions */}
// // //                           <div>
// // //                             <h3 className="font-semibold text-[#3f3328] mb-3 flex items-center gap-2">
// // //                               <Clock size={16} className="text-[#b97844]" /> Order Progress
// // //                             </h3>
// // //                             <div className="space-y-3">
// // //                               {flow.map((step, index) => {
// // //                                 const done = currentIndex >= index;
// // //                                 const active = currentIndex === index;
// // //                                 return (
// // //                                   <div key={step} className="flex items-center gap-3">
// // //                                     <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${done ? 'bg-[#b97844] text-white' : 'bg-[#e8e0d6] text-[#a0968c]'}`}>
// // //                                       {done ? <CheckCircle size={14} /> : index + 1}
// // //                                     </div>
// // //                                     <div>
// // //                                       <p className={`font-medium ${active ? 'text-[#b97844]' : done ? 'text-[#3f3328]' : 'text-[#a0968c]'}`}>
// // //                                         {STEP_LABELS[step]}
// // //                                       </p>
// // //                                       {active && <p className="text-xs text-[#6b5f54]">Current status</p>}
// // //                                     </div>
// // //                                   </div>
// // //                                 );
// // //                               })}
// // //                             </div>

// // //                             {/* Customer Info */}
// // //                             <div className="mt-4 p-3 bg-white rounded-lg border border-[#e8e0d6]">
// // //                               <p className="text-xs font-semibold text-[#3f3328] mb-2">Customer Details</p>
// // //                               <p className="text-sm text-[#6b5f54]">👤 {order.guestName || order.customer?.name || 'Guest'}</p>
// // //                               {order.guestPhone && (
// // //                                 <p className="text-sm text-[#6b5f54] flex items-center gap-1 mt-1">
// // //                                   <Phone size={12} /> {order.guestPhone}
// // //                                 </p>
// // //                               )}
// // //                               {order.tableNumber && (
// // //                                 <p className="text-sm text-[#6b5f54] mt-1">🍽️ Table: {order.tableNumber}</p>
// // //                               )}
// // //                             </div>

// // //                             {/* Payment Info */}
// // //                             <div className="mt-3 p-3 bg-white rounded-lg border border-[#e8e0d6]">
// // //                               <p className="text-xs font-semibold text-[#3f3328] mb-2">Payment Details</p>
// // //                               <p className="text-sm text-[#6b5f54]">Method: {order.paymentMethod}</p>
// // //                               <p className="text-sm text-[#6b5f54]">Status: {paymentSummary}</p>
// // //                               <p className="text-sm font-bold mt-1">Total: ₹{order.totalAmount}</p>
// // //                             </div>

// // //                             {/* Action Buttons */}
// // //                             <div className="mt-4 flex flex-wrap gap-2">
// // //                               {showInvoiceLink && (
// // //                                 <Link 
// // //                                   to={`/invoice/${order._id}`} 
// // //                                   target="_blank"
// // //                                   className="flex-1 py-2 rounded-lg border border-[#e8e0d6] text-[#6b5f54] text-center text-sm font-medium hover:border-[#b97844] hover:text-[#b97844] transition-all"
// // //                                 >
// // //                                   View Invoice
// // //                                 </Link>
// // //                               )}
// // //                               {showInvoiceLink && (
// // //                                 <button
// // //                                   onClick={() => handleDeleteOrder(order)}
// // //                                   disabled={deleteOrderMutation.isPending}
// // //                                   className="px-3 py-2 rounded-lg border border-red-200 text-red-500 hover:bg-red-50 transition-all disabled:opacity-60"
// // //                                 >
// // //                                   <Trash2 size={14} />
// // //                                 </button>
// // //                               )}
// // //                             </div>

// // //                             {/* COD Payment Collection (for counter staff) */}
// // //                             {availableActions.includes('completed') && String(order.paymentMethod || '').toLowerCase() === 'cod' && !isDone && (
// // //                               <div className="mt-3 p-3 bg-white rounded-lg border border-[#e8e0d6]">
// // //                                 <p className="text-xs font-semibold text-[#3f3328] mb-2">Collect Payment</p>
// // //                                 <div className="flex gap-2">
// // //                                   {['cash', 'upi'].map((method) => (
// // //                                     <button
// // //                                       key={method}
// // //                                       onClick={() => setServicePaymentDrafts((prev) => ({ ...prev, [order._id]: method }))}
// // //                                       className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
// // //                                         paymentDraft === method
// // //                                           ? PAYMENT_OPTION_STYLES[method]
// // //                                           : 'border border-[#e8e0d6] bg-[#faf8f5] text-[#6b5f54] hover:border-[#b97844]'
// // //                                       }`}
// // //                                     >
// // //                                       {method === 'cash' ? 'Cash Received' : 'UPI Received'}
// // //                                     </button>
// // //                                   ))}
// // //                                 </div>
// // //                                 {paymentDraft === 'upi' && (
// // //                                   <div className="mt-3 p-3 bg-gray-50 rounded-lg">
// // //                                     <QRCodeCanvas value={buildStaffUpiUri(order)} size={120} includeMargin />
// // //                                     <p className="text-xs text-center mt-2">UPI ID: {CAFE_UPI_ID}</p>
// // //                                   </div>
// // //                                 )}
// // //                               </div>
// // //                             )}
// // //                           </div>
// // //                         </div>
// // //                       </div>
// // //                     )}
// // //                   </div>
// // //                 );
// // //               })}
// // //             </div>

// // //             {/* Pagination */}
// // //             {totalPages > 1 && (
// // //               <div className="flex flex-col items-center gap-3 mt-6 pt-4 border-t border-[#e8e0d6]">
// // //                 <div className="flex justify-center items-center gap-2">
// // //                   <button
// // //                     onClick={() => handlePageChange(currentPage - 1)}
// // //                     disabled={currentPage === 1}
// // //                     className="w-9 h-9 rounded-full border border-[#e8e0d6] text-[#6b5f54] flex items-center justify-center hover:border-[#b97844] hover:text-[#b97844] disabled:opacity-40 disabled:cursor-not-allowed transition-all"
// // //                   >
// // //                     <ChevronLeft size={16} />
// // //                   </button>
                  
// // //                   <div className="flex gap-2">
// // //                     {[...Array(totalPages)].map((_, i) => {
// // //                       const pageNum = i + 1;
// // //                       if (pageNum === 1 || pageNum === totalPages || (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)) {
// // //                         return (
// // //                           <button
// // //                             key={pageNum}
// // //                             onClick={() => handlePageChange(pageNum)}
// // //                             className={`w-9 h-9 rounded-full text-sm font-medium transition-all ${
// // //                               currentPage === pageNum
// // //                                 ? 'bg-[#b97844] text-white'
// // //                                 : 'border border-[#e8e0d6] text-[#6b5f54] hover:border-[#b97844] hover:text-[#b97844]'
// // //                             }`}
// // //                           >
// // //                             {pageNum}
// // //                           </button>
// // //                         );
// // //                       }
// // //                       if (pageNum === currentPage - 2 || pageNum === currentPage + 2) {
// // //                         return <span key={pageNum} className="text-[#a0968c]">...</span>;
// // //                       }
// // //                       return null;
// // //                     })}
// // //                   </div>

// // //                   <button
// // //                     onClick={() => handlePageChange(currentPage + 1)}
// // //                     disabled={currentPage === totalPages}
// // //                     className="w-9 h-9 rounded-full border border-[#e8e0d6] text-[#6b5f54] flex items-center justify-center hover:border-[#b97844] hover:text-[#b97844] disabled:opacity-40 disabled:cursor-not-allowed transition-all"
// // //                   >
// // //                     <ChevronRight size={16} />
// // //                   </button>
// // //                 </div>
// // //                 <div className="text-center text-xs text-[#a0968c]">
// // //                   Showing {(currentPage - 1) * ORDERS_PER_PAGE + 1} - {Math.min(currentPage * ORDERS_PER_PAGE, filteredOrders.length)} of {filteredOrders.length} orders
// // //                 </div>
// // //               </div>
// // //             )}
// // //           </>
// // //         )}
// // //       </div>
// // //     </div>
// // //   );
// // // }


// // import { useEffect, useMemo, useState } from 'react';
// // import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
// // import { 
// //   BellRing, ChevronDown, ChevronUp, Clock, Hand, Monitor, RefreshCw, 
// //   Settings, ShoppingBag, Table2, Truck, UserCircle2, Package, CheckCircle, 
// //   XCircle, ChefHat, CalendarDays, Search, Filter, ChevronLeft, ChevronRight,
// //   Phone, User, Eye, Printer, Trash2, AlertCircle, Wifi, WifiOff, QrCode, X
// // } from 'lucide-react';
// // import { io } from 'socket.io-client';
// // import toast from 'react-hot-toast';
// // import { QRCodeCanvas } from 'qrcode.react';
// // import api from '../../services/api';
// // import { Link } from 'react-router-dom';
// // import { useSelector } from 'react-redux';

// // const STAFF_PREFS_KEY = 'staffQueuePrefs';
// // const DEFAULT_PREFS = { soundEnabled: true, showOnlyAssigned: false, compactView: false };
// // const ORDERS_PER_PAGE = 10;

// // const typeStyles = {
// //   'dine-in': 'bg-emerald-100 text-emerald-700',
// //   takeaway: 'bg-violet-100 text-violet-700',
// //   delivery: 'bg-sky-100 text-sky-700',
// //   'pre-order': 'bg-orange-100 text-orange-700',
// // };

// // const statusStyles = {
// //   placed: 'bg-amber-100 text-amber-700',
// //   confirmed: 'bg-blue-100 text-blue-700',
// //   preparing: 'bg-orange-100 text-orange-600',
// //   ready: 'bg-emerald-100 text-emerald-600',
// //   'out-for-delivery': 'bg-indigo-100 text-indigo-600',
// //   delivered: 'bg-green-100 text-green-600',
// //   completed: 'bg-teal-100 text-teal-600',
// //   cancelled: 'bg-red-100 text-red-600',
// // };

// // const STEP_LABELS = { 
// //   placed: 'Order Placed', 
// //   confirmed: 'Confirmed', 
// //   preparing: 'Preparing', 
// //   ready: 'Ready', 
// //   completed: 'Completed', 
// //   delivered: 'Delivered',
// //   'out-for-delivery': 'Out for Delivery'
// // };

// // const PAYMENT_OPTION_STYLES = {
// //   cash: 'bg-emerald-100 text-emerald-700 border-emerald-200',
// //   upi: 'bg-blue-100 text-blue-700 border-blue-200',
// // };

// // const CAFE_UPI_ID = import.meta.env.VITE_CAFE_UPI_ID || 'kashishsolanki8082@okaxis';

// // function getFulfillmentType(order) {
// //   if (order?.isPreOrder && order?.preOrderMethod) return order.preOrderMethod;
// //   return order?.orderType;
// // }

// // function getOrderTypeDisplay(order) {
// //   const fulfillmentType = getFulfillmentType(order);
// //   if (order?.isPreOrder) {
// //     if (fulfillmentType === 'delivery') return 'Pre-Order Delivery';
// //     if (fulfillmentType === 'takeaway') return 'Pre-Order Takeaway';
// //     if (fulfillmentType === 'dine-in') return 'Pre-Order Dine-In';
// //     return 'Pre-Order';
// //   }
// //   if (fulfillmentType === 'dine-in') return 'Dine-In';
// //   if (fulfillmentType === 'takeaway') return 'Takeaway';
// //   if (fulfillmentType === 'delivery') return 'Delivery';
// //   return String(fulfillmentType || 'order');
// // }

// // function readQueuePrefs() {
// //   if (typeof window === 'undefined') return DEFAULT_PREFS;
// //   try {
// //     const raw = window.localStorage.getItem(STAFF_PREFS_KEY);
// //     return raw ? { ...DEFAULT_PREFS, ...JSON.parse(raw) } : DEFAULT_PREFS;
// //   } catch {
// //     return DEFAULT_PREFS;
// //   }
// // }

// // function playQueueBeep() {
// //   if (typeof window === 'undefined') return;
// //   const AudioContextClass = window.AudioContext || window.webkitAudioContext;
// //   if (!AudioContextClass) return;
// //   const context = new AudioContextClass();
// //   const oscillator = context.createOscillator();
// //   const gain = context.createGain();
// //   oscillator.type = 'sine';
// //   oscillator.frequency.value = 880;
// //   gain.gain.value = 0.02;
// //   oscillator.connect(gain);
// //   gain.connect(context.destination);
// //   oscillator.start();
// //   oscillator.stop(context.currentTime + 0.12);
// //   oscillator.onended = () => { if (context.state !== 'closed') context.close(); };
// // }

// // function getFlow(orderType) {
// //   return ['placed', 'confirmed', 'preparing', 'ready', 'completed'];
// // }

// // function getNextStaffStatus(order) {
// //   if (!order) return null;
// //   const normalizedStatus = String(order.status || '').toLowerCase();
// //   const flow = getFlow(order.orderType);
// //   const currentIndex = flow.indexOf(normalizedStatus);
// //   if (currentIndex === -1) return null;
// //   return flow[currentIndex + 1] || null;
// // }

// // function getActionLabel(orderType, nextStatus) {
// //   if (!nextStatus) return '';
// //   const labels = {
// //     confirmed: 'Confirm Order',
// //     preparing: 'Start Preparing',
// //     ready: 'Mark Ready',
// //     completed: orderType === 'takeaway' ? 'Mark Picked Up' : 'Mark Served'
// //   };
// //   return labels[nextStatus] || STEP_LABELS[nextStatus] || nextStatus;
// // }

// // function getPaymentSummary(order) {
// //   const collectedMethod = String(order?.deliveryPayment?.method || '').toLowerCase();
// //   const checkoutMethod = String(order?.paymentMethod || '').toLowerCase();
// //   const paymentStatus = String(order?.deliveryPayment?.status || order?.paymentStatus || 'pending').toLowerCase();

// //   if (paymentStatus === 'paid') {
// //     if (collectedMethod === 'cash') return 'Cash • Payment Complete';
// //     if (collectedMethod === 'upi') return 'UPI • Payment Complete';
// //     if (checkoutMethod === 'online') return 'Online • Payment Complete';
// //   }

// //   if (checkoutMethod === 'cod') return 'COD • Awaiting Payment';
// //   if (checkoutMethod === 'online') return 'Online • Paid';
// //   return `${checkoutMethod || 'pending'} • ${paymentStatus || 'pending'}`;
// // }

// // function buildStaffUpiUri(order) {
// //   const amount = Number(order?.totalAmount || 0).toFixed(2);
// //   return `upi://pay?pa=${encodeURIComponent(CAFE_UPI_ID)}&pn=${encodeURIComponent('Roller Coaster Cafe')}&am=${encodeURIComponent(amount)}&cu=INR&tn=${encodeURIComponent(`Order ${order?.orderId || ''} - ${order?.guestName || order?.customer?.name || 'Customer'}`)}&tr=${encodeURIComponent(order?.orderId || '')}`;
// // }

// // function canOpenInvoice(order) {
// //   return ['completed', 'delivered'].includes(String(order?.status || '').toLowerCase());
// // }

// // function formatDateTime(date) {
// //   if (!date) return '-';
// //   return new Date(date).toLocaleString();
// // }

// // // Role-based visible statuses
// // const getVisibleStatuses = (role) => {
// //   switch(role) {
// //     case 'kitchen':
// //       return ['placed', 'confirmed', 'preparing'];
// //     case 'cashier':
// //     case 'waiter':
// //       return ['placed', 'confirmed', 'preparing', 'ready', 'completed', 'cancelled'];
// //     case 'admin':
// //     case 'manager':
// //       return ['placed', 'confirmed', 'preparing', 'ready', 'completed', 'cancelled'];
// //     default:
// //       return ['placed', 'confirmed', 'preparing', 'ready', 'completed', 'cancelled'];
// //   }
// // };

// // // Role-based available actions
// // const getAvailableActions = (role, order) => {
// //   const status = order.status;
// //   const orderType = getFulfillmentType(order);
  
// //   if (role === 'kitchen') {
// //     if (status === 'placed' || status === 'confirmed') return ['preparing'];
// //     if (status === 'preparing') return ['ready'];
// //     return [];
// //   }
  
// //   if (role === 'cashier' || role === 'waiter') {
// //     if (status === 'ready' && orderType !== 'delivery') return ['completed'];
// //     return [];
// //   }

// //   if (role === 'staff') {
// //     if (status === 'placed') return ['confirmed'];
// //     if (status === 'ready' && orderType !== 'delivery') return ['completed'];
// //     return [];
// //   }
  
// //   // Admin/Manager sees all actions
// //   const nextStatus = getNextStaffStatus(order);
// //   return nextStatus ? [nextStatus] : [];
// // };

// // export default function OrderQueue() {
// //   const queryClient = useQueryClient();
// //   const { user, isAuthenticated } = useSelector((state) => state.auth);
// //   const userRole = user?.role || 'cashier';
  
// //   const [filter, setFilter] = useState('active');
// //   const [searchTerm, setSearchTerm] = useState('');
// //   const [prefs, setPrefs] = useState(DEFAULT_PREFS);
// //   const [openOrderId, setOpenOrderId] = useState(null);
// //   const [currentPage, setCurrentPage] = useState(1);
// //   const [updatingOrderId, setUpdatingOrderId] = useState(null);
// //   const [servicePaymentDrafts, setServicePaymentDrafts] = useState({});
// //   const [socketConnected, setSocketConnected] = useState(false);
// //   const [socket, setSocket] = useState(null);
// //   const [showScanner, setShowScanner] = useState(false);
// //   const [scanningOrder, setScanningOrder] = useState(null);
// //   const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);
// //   const [transactionId, setTransactionId] = useState('');
// //   const [showUpiModal, setShowUpiModal] = useState(false);
// //   const [upiOrder, setUpiOrder] = useState(null);
// //   const [deleteDialog, setDeleteDialog] = useState(null);

// //   useEffect(() => {
// //     setPrefs(readQueuePrefs());
// //     const handleStorage = () => setPrefs(readQueuePrefs());
// //     window.addEventListener('storage', handleStorage);
// //     return () => window.removeEventListener('storage', handleStorage);
// //   }, []);

// //   // IMPORTANT: Check authentication before fetching
// //   const { data: response, isLoading, error, refetch } = useQuery({
// //     queryKey: ['staff-orders', filter],
// //     queryFn: async () => {
// //       try {
// //         const res = await api.get('/orders', { 
// //           params: { status: filter === 'active' ? undefined : filter, limit: 100 } 
// //         });
// //         return res.data;
// //       } catch (err) {
// //         if (err.response?.status === 401) {
// //           // Token expired or invalid
// //           localStorage.removeItem('token');
// //           window.location.href = '/login';
// //         }
// //         throw err;
// //       }
// //     },
// //     refetchInterval: isAuthenticated ? 15000 : false,
// //     enabled: isAuthenticated && !!user?._id,
// //     retry: false,
// //   });

// //   // WebSocket connection - only if authenticated
// //   useEffect(() => {
// //     if (!isAuthenticated) return;
    
// //     const socketUrl = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000';
// //     const newSocket = io(socketUrl, { withCredentials: true });
    
// //     newSocket.on('connect', () => {
// //       setSocketConnected(true);
// //       newSocket.emit('join-room', { room: 'staff' });
// //     });
    
// //     newSocket.on('disconnect', () => setSocketConnected(false));
// //     newSocket.on('connect_error', () => setSocketConnected(false));
    
// //     newSocket.on('new-order', () => {
// //       refetch();
// //       if (prefs.soundEnabled) playQueueBeep();
// //       toast.success('New order arrived!');
// //     });
    
// //     newSocket.on('order-updated', () => refetch());
    
// //     setSocket(newSocket);
    
// //     return () => {
// //       if (newSocket) newSocket.disconnect();
// //     };
// //   }, [isAuthenticated, prefs.soundEnabled, refetch]);

// //   // Filter orders based on role
// //   const filteredOrders = useMemo(() => {
// //     if (!response?.orders) return [];
// //     let rows = response.orders;
// //     const visibleStatuses = getVisibleStatuses(userRole);
    
// //     rows = rows.filter((order) => visibleStatuses.includes(order.status));
    
// //     if (filter === 'active') {
// //       rows = rows.filter((order) => !['delivered', 'completed', 'cancelled'].includes(order.status));
// //     }
    
// //     if (prefs.showOnlyAssigned) {
// //       rows = rows.filter((order) => order.assignedStaff?._id === user?._id);
// //     }
    
// //     if (searchTerm.trim()) {
// //       const term = searchTerm.toLowerCase();
// //       rows = rows.filter((order) => 
// //         (order.orderId || '').toLowerCase().includes(term) ||
// //         (order.guestName || order.customer?.name || '').toLowerCase().includes(term) ||
// //         (order.guestPhone || order.customer?.phone || '').toLowerCase().includes(term) ||
// //         (order.items?.some(item => item.name.toLowerCase().includes(term)))
// //       );
// //     }
    
// //     return rows;
// //   }, [response, filter, prefs.showOnlyAssigned, user?._id, searchTerm, userRole]);

// //   const totalPages = Math.ceil(filteredOrders.length / ORDERS_PER_PAGE);
// //   const paginatedOrders = useMemo(() => {
// //     const start = (currentPage - 1) * ORDERS_PER_PAGE;
// //     return filteredOrders.slice(start, start + ORDERS_PER_PAGE);
// //   }, [filteredOrders, currentPage]);

// //   useEffect(() => {
// //     setCurrentPage(1);
// //   }, [filter, searchTerm]);

// //   const updateStatusMutation = useMutation({
// //     mutationFn: ({ orderId, status, paymentCollectionMethod, transactionId }) => 
// //       api.put(`/orders/${orderId}/status`, { status, paymentCollectionMethod, transactionId }),
// //     onSuccess: () => { 
// //       queryClient.invalidateQueries({ queryKey: ['staff-orders'] }); 
// //       toast.success('Order status updated');
// //       setOpenOrderId(null);
// //     },
// //     onError: (error) => toast.error(error.response?.data?.message || 'Could not update order'),
// //   });

// //   const deleteOrderMutation = useMutation({
// //     mutationFn: (orderId) => api.delete(`/orders/${orderId}`),
// //     onSuccess: () => {
// //       queryClient.invalidateQueries({ queryKey: ['staff-orders'] });
// //       toast.success('Order deleted');
// //       setOpenOrderId(null);
// //       setDeleteDialog(null);
// //     },
// //     onError: (error) => toast.error(error.response?.data?.message || 'Could not delete order'),
// //   });

// //   const handleStatusUpdate = (order, status) => {
// //     if (!status || updatingOrderId) return;
// //     setUpdatingOrderId(order._id);
// //     updateStatusMutation.mutate(
// //       {
// //         orderId: order._id,
// //         status,
// //         paymentCollectionMethod: status === 'completed' ? servicePaymentDrafts[order._id] : undefined,
// //       },
// //       { onSettled: () => setUpdatingOrderId(null) }
// //     );
// //   };

// //   const openPaymentScanner = (order) => {
// //     setScanningOrder(order);
// //     setSelectedPaymentMethod(null);
// //     setTransactionId('');
// //     setShowScanner(true);
// //   };

// //   const processPayment = () => {
// //     if (!selectedPaymentMethod) {
// //       toast.error('Please select a payment method');
// //       return;
// //     }
    
// //     if (selectedPaymentMethod === 'upi' && !transactionId) {
// //       toast.error('Please enter transaction ID');
// //       return;
// //     }
    
// //     setUpdatingOrderId(scanningOrder._id);
// //     updateStatusMutation.mutate(
// //       { 
// //         orderId: scanningOrder._id, 
// //         status: 'completed',
// //         paymentCollectionMethod: selectedPaymentMethod,
// //         transactionId: transactionId || `CASH-${Date.now()}`
// //       },
// //       {
// //         onSuccess: () => {
// //           setShowScanner(false);
// //           setScanningOrder(null);
// //           setSelectedPaymentMethod(null);
// //           setTransactionId('');
// //           toast.success('Payment collected! Invoice generated.');
// //         },
// //         onSettled: () => setUpdatingOrderId(null)
// //       }
// //     );
// //   };

// //   const showUpiQR = (order) => {
// //     setUpiOrder(order);
// //     setShowUpiModal(true);
// //   };

// //   const handleDeleteOrder = (order) => {
// //     if (!order?._id) return;
// //     setDeleteDialog(order);
// //   };

// //   const confirmDeleteOrder = () => {
// //     if (!deleteDialog?._id) return;
// //     deleteOrderMutation.mutate(deleteDialog._id);
// //   };

// //   const printReceipt = (order) => {
// //     const printWindow = window.open('', '_blank');
// //     printWindow.document.write(`
// //       <html>
// //         <head><title>Order Receipt ${order.orderId}</title></head>
// //         <body style="font-family: Arial; padding: 20px;">
// //           <h1>Roller Coaster Cafe</h1>
// //           <h3>Order Receipt</h3>
// //           <p><strong>Order ID:</strong> ${order.orderId}</p>
// //           <p><strong>Customer:</strong> ${order.guestName || order.customer?.name || 'Guest'}</p>
// //           <p><strong>Phone:</strong> ${order.guestPhone || order.customer?.phone || '-'}</p>
// //           <p><strong>Order Type:</strong> ${getOrderTypeDisplay(order)}</p>
// //           <p><strong>Status:</strong> ${order.status}</p>
// //           <hr/>
// //           <h4>Items:</h4>
// //           <ul>
// //             ${order.items?.map(item => `<li>${item.quantity} x ${item.name} - ₹${item.totalPrice || item.unitPrice * item.quantity}</li>`).join('')}
// //           </ul>
// //           <hr/>
// //           <p><strong>Total:</strong> ₹${order.totalAmount}</p>
// //         </body>
// //       </html>
// //     `);
// //     printWindow.document.close();
// //     printWindow.print();
// //   };

// //   const filterOptions = [
// //     { value: 'active', label: 'Active Orders', icon: Clock },
// //     { value: 'placed', label: 'Placed', icon: AlertCircle },
// //     { value: 'confirmed', label: 'Confirmed', icon: CheckCircle },
// //     { value: 'preparing', label: 'Preparing', icon: ChefHat },
// //     { value: 'ready', label: 'Ready', icon: Package },
// //     { value: 'completed', label: 'Completed', icon: CheckCircle },
// //     { value: 'cancelled', label: 'Cancelled', icon: XCircle },
// //   ];

// //   const handlePageChange = (page) => {
// //     setCurrentPage(page);
// //     window.scrollTo({ top: 0, behavior: 'smooth' });
// //   };

// //   const statusCounts = useMemo(() => {
// //     const orders = response?.orders || [];
// //     return {
// //       active: orders.filter(o => !['delivered', 'completed', 'cancelled'].includes(o.status)).length,
// //       placed: orders.filter(o => o.status === 'placed').length,
// //       confirmed: orders.filter(o => o.status === 'confirmed').length,
// //       preparing: orders.filter(o => o.status === 'preparing').length,
// //       ready: orders.filter(o => o.status === 'ready').length,
// //       completed: orders.filter(o => o.status === 'completed').length,
// //       cancelled: orders.filter(o => o.status === 'cancelled').length,
// //     };
// //   }, [response]);

// //   // Show loading if not authenticated
// //   if (!isAuthenticated) {
// //     return (
// //       <div className="min-h-screen bg-[#faf8f5] flex items-center justify-center">
// //         <div className="text-center">
// //           <div className="w-12 h-12 border-4 border-[#b97844] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
// //           <p className="text-gray-500">Please login to access staff panel...</p>
// //           <Link to="/login" className="mt-4 inline-block text-[#b97844] hover:underline">Go to Login</Link>
// //         </div>
// //       </div>
// //     );
// //   }

// //   return (
// //     <div className="min-h-screen bg-[#faf8f5]">
// //       {/* Header */}
// //       <header className="bg-white border-b border-[#e8e0d6] sticky top-0 z-20">
// //         <div className="max-w-7xl mx-auto px-6 py-4">
// //           <div className="flex flex-wrap items-center justify-between gap-4">
// //             <div>
// //               <h1 className="font-display text-2xl font-bold text-[#3f3328]">Order Queue</h1>
// //               <p className="text-sm text-[#6b5f54]">Manage and track all customer orders</p>
// //             </div>
// //             <div className="flex items-center gap-3">
// //               <div className="flex items-center gap-2">
// //                 {socketConnected ? (
// //                   <span className="inline-flex items-center gap-1 text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full">
// //                     <Wifi size={12} /> Live
// //                   </span>
// //                 ) : (
// //                   <span className="inline-flex items-center gap-1 text-xs text-gray-400 bg-gray-50 px-2 py-1 rounded-full">
// //                     <WifiOff size={12} /> Connecting
// //                   </span>
// //                 )}
// //               </div>
// //               <Link to="/staff/pos" className="inline-flex items-center gap-2 rounded-lg border border-[#e8e0d6] bg-white px-4 py-2 text-sm font-medium text-[#6b5f54] hover:border-[#b97844] hover:text-[#b97844] transition-all">
// //                 <Monitor size={16} /> POS Mode
// //               </Link>
// //               <Link to="/staff/settings" className="inline-flex items-center gap-2 rounded-lg border border-[#e8e0d6] bg-white px-4 py-2 text-sm font-medium text-[#6b5f54] hover:border-[#b97844] hover:text-[#b97844] transition-all">
// //                 <Settings size={16} /> Settings
// //               </Link>
// //               <button onClick={() => refetch()} className="p-2 rounded-lg border border-[#e8e0d6] bg-white hover:bg-[#faf8f5] transition-all">
// //                 <RefreshCw size={16} className="text-[#6b5f54]" />
// //               </button>
// //             </div>
// //           </div>
// //         </div>
// //       </header>

// //       <div className="max-w-7xl mx-auto px-6 py-6">
// //         {/* Stats Cards */}
// //         <div className="grid grid-cols-2 md:grid-cols-6 gap-3 mb-6">
// //           <div className="bg-white border border-[#e8e0d6] rounded-xl p-3 text-center">
// //             <p className="text-xs text-[#6b5f54]">Active</p>
// //             <p className="text-xl font-bold text-[#3f3328]">{statusCounts.active}</p>
// //           </div>
// //           <div className="bg-white border border-[#e8e0d6] rounded-xl p-3 text-center">
// //             <p className="text-xs text-[#6b5f54]">Placed</p>
// //             <p className="text-xl font-bold text-amber-600">{statusCounts.placed}</p>
// //           </div>
// //           <div className="bg-white border border-[#e8e0d6] rounded-xl p-3 text-center">
// //             <p className="text-xs text-[#6b5f54]">Preparing</p>
// //             <p className="text-xl font-bold text-orange-600">{statusCounts.preparing}</p>
// //           </div>
// //           <div className="bg-white border border-[#e8e0d6] rounded-xl p-3 text-center">
// //             <p className="text-xs text-[#6b5f54]">Ready</p>
// //             <p className="text-xl font-bold text-emerald-600">{statusCounts.ready}</p>
// //           </div>
// //           <div className="bg-white border border-[#e8e0d6] rounded-xl p-3 text-center">
// //             <p className="text-xs text-[#6b5f54]">Confirmed</p>
// //             <p className="text-xl font-bold text-blue-600">{statusCounts.confirmed}</p>
// //           </div>
// //           <div className="bg-white border border-[#e8e0d6] rounded-xl p-3 text-center">
// //             <p className="text-xs text-[#6b5f54]">Cancelled</p>
// //             <p className="text-xl font-bold text-red-600">{statusCounts.cancelled}</p>
// //           </div>
// //         </div>

// //         {/* Filters Bar */}
// //         <div className="bg-white border border-[#e8e0d6] rounded-xl p-4 mb-6">
// //           <div className="flex flex-wrap items-center justify-between gap-4">
// //             <div className="flex flex-wrap gap-2">
// //               {filterOptions.map((option) => (
// //                 <button
// //                   key={option.value}
// //                   onClick={() => setFilter(option.value)}
// //                   className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
// //                     filter === option.value
// //                       ? 'bg-[#b97844] text-white'
// //                       : 'bg-[#faf8f5] text-[#6b5f54] hover:bg-[#e8e0d6]'
// //                   }`}
// //                 >
// //                   <span className="flex items-center gap-1">
// //                     <option.icon size={14} />
// //                     {option.label}
// //                     {statusCounts[option.value] > 0 && option.value !== 'active' && (
// //                       <span className="ml-1 text-xs">({statusCounts[option.value]})</span>
// //                     )}
// //                   </span>
// //                 </button>
// //               ))}
// //             </div>
// //             <div className="relative">
// //               <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#a0968c]" />
// //               <input
// //                 type="text"
// //                 value={searchTerm}
// //                 onChange={(e) => setSearchTerm(e.target.value)}
// //                 placeholder="Search by ID, name, phone..."
// //                 className="pl-9 pr-4 py-2 rounded-lg border border-[#e8e0d6] text-sm focus:border-[#b97844] focus:outline-none w-64"
// //               />
// //             </div>
// //           </div>
// //         </div>

// //         {/* Orders List */}
// //         {isLoading ? (
// //           <div className="space-y-3">
// //             {[1, 2, 3, 4].map(i => <div key={i} className="bg-white border border-[#e8e0d6] rounded-xl p-5 animate-pulse h-28" />)}
// //           </div>
// //         ) : paginatedOrders.length === 0 ? (
// //           <div className="bg-white border border-[#e8e0d6] rounded-xl p-12 text-center">
// //             <Package size={48} className="mx-auto text-[#a0968c] mb-4" />
// //             <h2 className="text-xl font-semibold text-[#3f3328] mb-2">No orders found</h2>
// //             <p className="text-[#6b5f54]">There are no {filter === 'active' ? 'active' : filter} orders at the moment.</p>
// //           </div>
// //         ) : (
// //           <>
// //             <div className="space-y-3">
// //               {paginatedOrders.map((order) => {
// //                 const isOpen = openOrderId === order._id;
// //                 const isAssignedToMe = order.assignedStaff?._id === user?._id;
// //                 const isAssignedToOther = !!order.assignedStaff && !isAssignedToMe;
// //                 const isDone = ['completed', 'delivered', 'cancelled'].includes(order.status);
// //                 const fulfillmentType = getFulfillmentType(order);
// //                 const orderTypeDisplay = getOrderTypeDisplay(order);
// //                 const flow = getFlow(fulfillmentType);
// //                 const currentIndex = flow.indexOf(order.status);
// //                 const availableActions = getAvailableActions(userRole, order);
// //                 const paymentSummary = getPaymentSummary(order);
// //                 const showInvoiceLink = canOpenInvoice(order);
// //                 const isCOD = String(order.paymentMethod || '').toLowerCase() === 'cod';
                
// //                 return (
// //                   <div key={order._id} className="bg-white border border-[#e8e0d6] rounded-xl overflow-hidden">
// //                     {/* Order Header */}
// //                     <div className="p-5 hover:bg-[#faf8f5] transition-all cursor-pointer" onClick={() => setOpenOrderId(isOpen ? null : order._id)}>
// //                       <div className="flex flex-wrap items-center justify-between gap-4">
// //                         <div className="flex items-center gap-4 flex-wrap">
// //                           <span className="font-mono text-sm font-bold text-[#3f3328]">#{order.orderId || order._id.slice(-6)}</span>
// //                           <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-lg text-xs font-medium ${order.isPreOrder ? 'bg-orange-100 text-orange-700' : typeStyles[fulfillmentType] || 'bg-gray-100 text-gray-700'}`}>
// //                             {fulfillmentType === 'dine-in' ? <Table2 size={12} /> : fulfillmentType === 'delivery' ? <Truck size={12} /> : <ShoppingBag size={12} />}
// //                             {orderTypeDisplay}
// //                           </span>
// //                           <span className={`inline-flex items-center px-2 py-1 rounded-lg text-xs font-medium ${statusStyles[order.status] || 'bg-gray-100 text-gray-700'}`}>
// //                             {order.status}
// //                           </span>
// //                           {order.scheduledTime && (
// //                             <span className="inline-flex items-center gap-1 text-xs text-[#6b5f54]">
// //                               <CalendarDays size={12} /> {new Date(order.scheduledTime).toLocaleString()}
// //                             </span>
// //                           )}
// //                           {isCOD && order.status === 'ready' && (
// //                             <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium bg-yellow-100 text-yellow-700">
// //                               💰 COD - Collect Payment
// //                             </span>
// //                           )}
// //                         </div>
// //                         <div className="flex items-center gap-3">
// //                           <span className="text-lg font-bold text-[#3f3328]">₹{order.totalAmount}</span>
// //                           <ChevronDown size={18} className={`text-[#a0968c] transition-transform ${isOpen ? 'rotate-180' : ''}`} />
// //                         </div>
// //                       </div>
// //                       <div className="flex flex-wrap items-center justify-between gap-4 mt-3">
// //                         <div>
// //                           <p className="text-sm text-[#6b5f54]">
// //                             {order.guestName || order.customer?.name || 'Guest'} • {order.items?.length || 0} items
// //                           </p>
// //                           {order.guestPhone && (
// //                             <p className="text-xs text-[#6b5f54] flex items-center gap-1 mt-1">
// //                               <Phone size={10} /> {order.guestPhone}
// //                             </p>
// //                           )}
// //                         </div>
// //                         <div className="flex items-center gap-2">
// //                           {availableActions.map(action => (
// //                             <button
// //                               key={action}
// //                               onClick={(e) => { 
// //                                 e.stopPropagation(); 
// //                                 if (action === 'completed' && isCOD && order.status === 'ready') {
// //                                   openPaymentScanner(order);
// //                                 } else {
// //                                   handleStatusUpdate(order, action);
// //                                 }
// //                               }}
// //                               disabled={updatingOrderId === order._id}
// //                               className="px-3 py-1.5 rounded-lg bg-[#b97844] text-white text-sm font-medium hover:bg-[#9e6538] transition-all disabled:opacity-60"
// //                             >
// //                               {getActionLabel(fulfillmentType, action)}
// //                             </button>
// //                           ))}
                          
// //                           <button
// //                             onClick={(e) => { e.stopPropagation(); printReceipt(order); }}
// //                             className="p-1.5 rounded-lg border border-[#e8e0d6] text-[#6b5f54] hover:border-[#b97844] hover:text-[#b97844] transition-all"
// //                             title="Print Receipt"
// //                           >
// //                             <Printer size={14} />
// //                           </button>

// //                           {isDone && (
// //                             <button
// //                               onClick={(e) => { e.stopPropagation(); handleDeleteOrder(order); }}
// //                               className="p-1.5 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 transition-all"
// //                               title="Delete Order"
// //                             >
// //                               <Trash2 size={14} />
// //                             </button>
// //                           )}
                           
// //                           {isCOD && order.status === 'ready' && (
// //                             <button
// //                               onClick={(e) => { e.stopPropagation(); showUpiQR(order); }}
// //                               className="p-1.5 rounded-lg border border-[#e8e0d6] text-blue-600 hover:border-blue-500 hover:text-blue-700 transition-all"
// //                               title="Show UPI QR"
// //                             >
// //                               <QrCode size={14} />
// //                             </button>
// //                           )}
                          
// //                           {isAssignedToOther && (
// //                             <span className="text-sm text-[#a0968c]">Assigned to {order.assignedStaff?.name}</span>
// //                           )}
// //                         </div>
// //                       </div>
// //                     </div>

// //                     {/* Expanded Details */}
// //                     {isOpen && (
// //                       <div className="border-t border-[#e8e0d6] bg-[#faf8f5] p-5">
// //                         <div className="grid md:grid-cols-2 gap-6">
// //                           {/* Items List */}
// //                           <div>
// //                             <h3 className="font-semibold text-[#3f3328] mb-3 flex items-center gap-2">
// //                               <Package size={16} className="text-[#b97844]" /> Order Items
// //                             </h3>
// //                             <div className="space-y-2 max-h-64 overflow-y-auto">
// //                               {order.items?.map((item, idx) => (
// //                                 <div key={idx} className="flex justify-between items-center py-2 border-b border-[#e8e0d6] last:border-0">
// //                                   <div>
// //                                     <p className="font-medium text-[#3f3328]">{item.name}</p>
// //                                     <p className="text-xs text-[#6b5f54]">Quantity: {item.quantity}</p>
// //                                     {item.variant && <p className="text-xs text-[#6b5f54]">Variant: {item.variant}</p>}
// //                                     {item.addons?.length > 0 && <p className="text-xs text-[#6b5f54]">Addons: {item.addons.join(', ')}</p>}
// //                                   </div>
// //                                   <p className="font-semibold text-[#3f3328]">₹{item.totalPrice || item.unitPrice * item.quantity}</p>
// //                                 </div>
// //                               ))}
// //                             </div>
// //                             {order.specialNotes && (
// //                               <div className="mt-4 p-3 bg-amber-50 rounded-lg">
// //                                 <p className="text-sm text-amber-700"><strong>Special Notes:</strong> {order.specialNotes}</p>
// //                               </div>
// //                             )}
// //                           </div>

// //                           {/* Order Progress & Actions */}
// //                           <div>
// //                             <h3 className="font-semibold text-[#3f3328] mb-3 flex items-center gap-2">
// //                               <Clock size={16} className="text-[#b97844]" /> Order Progress
// //                             </h3>
// //                             <div className="space-y-3">
// //                               {flow.map((step, index) => {
// //                                 const done = currentIndex >= index;
// //                                 const active = currentIndex === index;
// //                                 return (
// //                                   <div key={step} className="flex items-center gap-3">
// //                                     <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${done ? 'bg-[#b97844] text-white' : 'bg-[#e8e0d6] text-[#a0968c]'}`}>
// //                                       {done ? <CheckCircle size={14} /> : index + 1}
// //                                     </div>
// //                                     <div>
// //                                       <p className={`font-medium ${active ? 'text-[#b97844]' : done ? 'text-[#3f3328]' : 'text-[#a0968c]'}`}>
// //                                         {STEP_LABELS[step]}
// //                                       </p>
// //                                       {active && <p className="text-xs text-[#6b5f54]">Current status</p>}
// //                                     </div>
// //                                   </div>
// //                                 );
// //                               })}
// //                             </div>

// //                             {/* Customer Info */}
// //                             <div className="mt-4 p-3 bg-white rounded-lg border border-[#e8e0d6]">
// //                               <p className="text-xs font-semibold text-[#3f3328] mb-2">Customer Details</p>
// //                               <p className="text-sm text-[#6b5f54]">👤 {order.guestName || order.customer?.name || 'Guest'}</p>
// //                               {order.guestPhone && (
// //                                 <p className="text-sm text-[#6b5f54] flex items-center gap-1 mt-1">
// //                                   <Phone size={12} /> {order.guestPhone}
// //                                 </p>
// //                               )}
// //                               {order.tableNumber && (
// //                                 <p className="text-sm text-[#6b5f54] mt-1">🍽️ Table: {order.tableNumber}</p>
// //                               )}
// //                             </div>

// //                             {/* Payment Info */}
// //                             <div className="mt-3 p-3 bg-white rounded-lg border border-[#e8e0d6]">
// //                               <p className="text-xs font-semibold text-[#3f3328] mb-2">Payment Details</p>
// //                               <p className="text-sm text-[#6b5f54]">Method: {order.paymentMethod}</p>
// //                               <p className="text-sm text-[#6b5f54]">Status: {paymentSummary}</p>
// //                               <p className="text-sm font-bold mt-1">Total: ₹{order.totalAmount}</p>
// //                             </div>

// //                             {/* Action Buttons */}
// //                             <div className="mt-4 flex flex-wrap gap-2">
// //                               {showInvoiceLink && (
// //                                 <Link 
// //                                   to={`/invoice/${order._id}`} 
// //                                   target="_blank"
// //                                   className="flex-1 py-2 rounded-lg border border-[#e8e0d6] text-[#6b5f54] text-center text-sm font-medium hover:border-[#b97844] hover:text-[#b97844] transition-all"
// //                                 >
// //                                   View Invoice
// //                                 </Link>
// //                               )}
// //                               {showInvoiceLink && (
// //                                 <button
// //                                   onClick={() => handleDeleteOrder(order)}
// //                                   disabled={deleteOrderMutation.isPending}
// //                                   className="px-3 py-2 rounded-lg border border-red-200 text-red-500 hover:bg-red-50 transition-all disabled:opacity-60"
// //                                 >
// //                                   <Trash2 size={14} />
// //                                 </button>
// //                               )}
// //                             </div>
// //                           </div>
// //                         </div>
// //                       </div>
// //                     )}
// //                   </div>
// //                 );
// //               })}
// //             </div>

// //             {/* Pagination */}
// //             {totalPages > 1 && (
// //               <div className="flex flex-col items-center gap-3 mt-6 pt-4 border-t border-[#e8e0d6]">
// //                 <div className="flex justify-center items-center gap-2">
// //                   <button
// //                     onClick={() => handlePageChange(currentPage - 1)}
// //                     disabled={currentPage === 1}
// //                     className="w-9 h-9 rounded-full border border-[#e8e0d6] text-[#6b5f54] flex items-center justify-center hover:border-[#b97844] hover:text-[#b97844] disabled:opacity-40 disabled:cursor-not-allowed transition-all"
// //                   >
// //                     <ChevronLeft size={16} />
// //                   </button>
                  
// //                   <div className="flex gap-2">
// //                     {[...Array(totalPages)].map((_, i) => {
// //                       const pageNum = i + 1;
// //                       if (pageNum === 1 || pageNum === totalPages || (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)) {
// //                         return (
// //                           <button
// //                             key={pageNum}
// //                             onClick={() => handlePageChange(pageNum)}
// //                             className={`w-9 h-9 rounded-full text-sm font-medium transition-all ${
// //                               currentPage === pageNum
// //                                 ? 'bg-[#b97844] text-white'
// //                                 : 'border border-[#e8e0d6] text-[#6b5f54] hover:border-[#b97844] hover:text-[#b97844]'
// //                             }`}
// //                           >
// //                             {pageNum}
// //                           </button>
// //                         );
// //                       }
// //                       if (pageNum === currentPage - 2 || pageNum === currentPage + 2) {
// //                         return <span key={pageNum} className="text-[#a0968c]">...</span>;
// //                       }
// //                       return null;
// //                     })}
// //                   </div>

// //                   <button
// //                     onClick={() => handlePageChange(currentPage + 1)}
// //                     disabled={currentPage === totalPages}
// //                     className="w-9 h-9 rounded-full border border-[#e8e0d6] text-[#6b5f54] flex items-center justify-center hover:border-[#b97844] hover:text-[#b97844] disabled:opacity-40 disabled:cursor-not-allowed transition-all"
// //                   >
// //                     <ChevronRight size={16} />
// //                   </button>
// //                 </div>
// //                 <div className="text-center text-xs text-[#a0968c]">
// //                   Showing {(currentPage - 1) * ORDERS_PER_PAGE + 1} - {Math.min(currentPage * ORDERS_PER_PAGE, filteredOrders.length)} of {filteredOrders.length} orders
// //                 </div>
// //               </div>
// //             )}
// //           </>
// //         )}
// //       </div>

// //       {/* Payment Scanner Modal for COD */}
// //       {showScanner && scanningOrder && (
// //         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
// //           <div className="bg-white rounded-2xl max-w-md w-full p-6">
// //             <div className="flex justify-between items-center mb-4">
// //               <h3 className="font-bold text-xl text-[#3f3328]">Collect Payment</h3>
// //               <button onClick={() => setShowScanner(false)} className="p-1 hover:bg-gray-100 rounded-full">
// //                 <X size={20} />
// //               </button>
// //             </div>
            
// //             <div className="space-y-4">
// //               <div className="bg-gray-50 rounded-lg p-3">
// //                 <p className="text-sm text-gray-500">Order ID</p>
// //                 <p className="font-mono font-bold text-lg">#{scanningOrder.orderId}</p>
// //               </div>
              
// //               <div className="bg-amber-50 rounded-lg p-3">
// //                 <p className="text-sm text-gray-600">Total Amount</p>
// //                 <p className="text-3xl font-bold text-[#b97844]">₹{scanningOrder.totalAmount}</p>
// //               </div>
              
// //               <div className="bg-gray-50 rounded-lg p-3">
// //                 <p className="text-sm text-gray-600">Customer</p>
// //                 <p className="font-medium">{scanningOrder.guestName || scanningOrder.customer?.name || 'Guest'}</p>
// //                 {scanningOrder.guestPhone && (
// //                   <p className="text-sm text-gray-500 mt-1">📞 {scanningOrder.guestPhone}</p>
// //                 )}
// //               </div>
              
// //               <div className="space-y-3">
// //                 <p className="text-sm font-semibold text-[#3f3328]">Select Payment Method</p>
// //                 <div className="grid grid-cols-2 gap-3">
// //                   <button
// //                     onClick={() => setSelectedPaymentMethod('cash')}
// //                     className={`py-3 rounded-lg border-2 transition-all ${
// //                       selectedPaymentMethod === 'cash'
// //                         ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
// //                         : 'border-gray-200 bg-white text-gray-600 hover:border-emerald-300'
// //                     }`}
// //                   >
// //                     💵 Cash
// //                   </button>
// //                   <button
// //                     onClick={() => setSelectedPaymentMethod('upi')}
// //                     className={`py-3 rounded-lg border-2 transition-all ${
// //                       selectedPaymentMethod === 'upi'
// //                         ? 'border-blue-500 bg-blue-50 text-blue-700'
// //                         : 'border-gray-200 bg-white text-gray-600 hover:border-blue-300'
// //                     }`}
// //                   >
// //                     📱 UPI
// //                   </button>
// //                 </div>
// //               </div>
              
// //               {selectedPaymentMethod === 'upi' && (
// //                 <div>
// //                   <label className="block text-sm font-medium text-gray-700 mb-1">Transaction ID / UTR</label>
// //                   <input
// //                     type="text"
// //                     value={transactionId}
// //                     onChange={(e) => setTransactionId(e.target.value)}
// //                     placeholder="Enter transaction ID"
// //                     className="w-full rounded-lg border border-gray-300 p-2 text-sm focus:border-[#b97844] focus:outline-none"
// //                   />
// //                   <p className="text-xs text-gray-500 mt-1">Enter the UTR/Reference number from payment app</p>
// //                 </div>
// //               )}
              
// //               <button
// //                 onClick={processPayment}
// //                 disabled={updatingOrderId === scanningOrder._id}
// //                 className="w-full py-3 rounded-lg bg-[#b97844] text-white font-semibold hover:bg-[#9e6538] transition-all disabled:opacity-50"
// //               >
// //                 {updatingOrderId === scanningOrder._id ? 'Processing...' : 'Confirm Payment & Complete Order'}
// //               </button>
              
// //               <p className="text-xs text-gray-400 text-center">
// //                 After payment, invoice will be generated automatically
// //               </p>
// //             </div>
// //           </div>
// //         </div>
// //       )}

// //       {/* UPI QR Code Modal for Customer to Scan */}
// //       {showUpiModal && upiOrder && (
// //         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
// //           <div className="bg-white rounded-2xl max-w-sm w-full p-6 text-center">
// //             <div className="flex justify-between items-center mb-4">
// //               <h3 className="font-bold text-lg text-[#3f3328]">Scan to Pay</h3>
// //               <button onClick={() => setShowUpiModal(false)} className="p-1 hover:bg-gray-100 rounded-full">
// //                 <X size={20} />
// //               </button>
// //             </div>
            
// //             <div className="bg-white p-4 rounded-xl inline-block mx-auto">
// //               <QRCodeCanvas 
// //                 value={`upi://pay?pa=${CAFE_UPI_ID}&pn=Roller%20Coaster%20Cafe&am=${upiOrder.totalAmount}&cu=INR&tn=Order${upiOrder.orderId}`}
// //                 size={200}
// //                 includeMargin
// //               />
// //             </div>
            
// //             <div className="mt-4 space-y-2">
// //               <p className="font-bold text-lg">₹{upiOrder.totalAmount}</p>
// //               <p className="text-sm text-gray-500 break-all">UPI ID: {CAFE_UPI_ID}</p>
// //               <p className="text-xs text-gray-400">Order #{upiOrder.orderId}</p>
// //             </div>
            
// //             <button
// //               onClick={() => {
// //                 setShowUpiModal(false);
// //                 openPaymentScanner(upiOrder);
// //               }}
// //               className="mt-4 w-full py-2 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition-all"
// //             >
// //               I've received the payment
// //             </button>
            
// //             <p className="text-xs text-gray-400 mt-3">
// //               Customer can scan this QR code to pay via any UPI app
// //             </p>
// //           </div>
// //         </div>
// //       )}

// //       {deleteDialog && (
// //         <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
// //           <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
// //             <div className="flex items-start justify-between gap-4">
// //               <div>
// //                 <h3 className="text-xl font-bold text-[#3f3328]">Delete Order?</h3>
// //                 <p className="mt-2 text-sm text-[#6b5f54]">
// //                   This will remove <span className="font-semibold">#{deleteDialog.orderId || deleteDialog._id.slice(-6)}</span> from staff history.
// //                 </p>
// //               </div>
// //               <button
// //                 type="button"
// //                 onClick={() => setDeleteDialog(null)}
// //                 className="rounded-full p-1 text-[#6b5f54] hover:bg-[#faf8f5]"
// //                 aria-label="Close delete dialog"
// //               >
// //                 <X size={20} />
// //               </button>
// //             </div>

// //             <div className="mt-4 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
// //               This action cannot be undone.
// //             </div>

// //             <div className="mt-6 flex justify-end gap-3">
// //               <button
// //                 type="button"
// //                 onClick={() => setDeleteDialog(null)}
// //                 className="rounded-lg border border-[#e8e0d6] px-4 py-2 text-sm font-medium text-[#6b5f54] hover:bg-[#faf8f5] transition-all"
// //               >
// //                 Keep Order
// //               </button>
// //               <button
// //                 type="button"
// //                 onClick={confirmDeleteOrder}
// //                 disabled={deleteOrderMutation.isPending}
// //                 className="rounded-lg bg-red-500 px-4 py-2 text-sm font-medium text-white hover:bg-red-600 transition-all disabled:cursor-not-allowed disabled:opacity-50"
// //               >
// //                 {deleteOrderMutation.isPending ? 'Deleting...' : 'Delete'}
// //               </button>
// //             </div>
// //           </div>
// //         </div>
// //       )}
// //     </div>
// //   );
// // }


// import { useEffect, useMemo, useState } from 'react';
// import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
// import { 
//   BellRing, ChevronDown, ChevronUp, Clock, Hand, Monitor, RefreshCw, 
//   Settings, ShoppingBag, Table2, Truck, UserCircle2, Package, CheckCircle, 
//   XCircle, ChefHat, CalendarDays, Search, Filter, ChevronLeft, ChevronRight,
//   Phone, User, Eye, Printer, Trash2, AlertCircle, Wifi, WifiOff, QrCode, X,
//   Calendar, Clock as ClockIcon, TrendingUp, TrendingDown
// } from 'lucide-react';
// import { io } from 'socket.io-client';
// import toast from 'react-hot-toast';
// import { QRCodeCanvas } from 'qrcode.react';
// import api from '../../services/api';
// import { Link } from 'react-router-dom';
// import { useSelector } from 'react-redux';

// const STAFF_PREFS_KEY = 'staffQueuePrefs';
// const DEFAULT_PREFS = { soundEnabled: true, showOnlyAssigned: false, compactView: false };
// const ORDERS_PER_PAGE = 10;

// const typeStyles = {
//   'dine-in': 'bg-emerald-100 text-emerald-700',
//   takeaway: 'bg-violet-100 text-violet-700',
//   delivery: 'bg-sky-100 text-sky-700',
//   'pre-order': 'bg-orange-100 text-orange-700',
// };

// const statusStyles = {
//   placed: 'bg-amber-100 text-amber-700',
//   confirmed: 'bg-blue-100 text-blue-700',
//   preparing: 'bg-orange-100 text-orange-600',
//   ready: 'bg-emerald-100 text-emerald-600',
//   'out-for-delivery': 'bg-indigo-100 text-indigo-600',
//   delivered: 'bg-green-100 text-green-600',
//   completed: 'bg-teal-100 text-teal-600',
//   cancelled: 'bg-red-100 text-red-600',
// };

// const STEP_LABELS = { 
//   placed: 'Order Placed', 
//   confirmed: 'Confirmed', 
//   preparing: 'Preparing', 
//   ready: 'Ready', 
//   completed: 'Completed', 
//   delivered: 'Delivered',
//   'out-for-delivery': 'Out for Delivery'
// };

// const PAYMENT_OPTION_STYLES = {
//   cash: 'bg-emerald-100 text-emerald-700 border-emerald-200',
//   upi: 'bg-blue-100 text-blue-700 border-blue-200',
// };

// const CAFE_UPI_ID = import.meta.env.VITE_CAFE_UPI_ID || 'kashishsolanki8082@okaxis';

// function getFulfillmentType(order) {
//   if (order?.isPreOrder && order?.preOrderMethod) return order.preOrderMethod;
//   return order?.orderType;
// }

// function getOrderTypeDisplay(order) {
//   const fulfillmentType = getFulfillmentType(order);
//   if (order?.isPreOrder) {
//     if (fulfillmentType === 'delivery') return 'Pre-Order Delivery';
//     if (fulfillmentType === 'takeaway') return 'Pre-Order Takeaway';
//     if (fulfillmentType === 'dine-in') return 'Pre-Order Dine-In';
//     return 'Pre-Order';
//   }
//   if (fulfillmentType === 'dine-in') return 'Dine-In';
//   if (fulfillmentType === 'takeaway') return 'Takeaway';
//   if (fulfillmentType === 'delivery') return 'Delivery';
//   return String(fulfillmentType || 'order');
// }

// function readQueuePrefs() {
//   if (typeof window === 'undefined') return DEFAULT_PREFS;
//   try {
//     const raw = window.localStorage.getItem(STAFF_PREFS_KEY);
//     return raw ? { ...DEFAULT_PREFS, ...JSON.parse(raw) } : DEFAULT_PREFS;
//   } catch {
//     return DEFAULT_PREFS;
//   }
// }

// function playQueueBeep() {
//   if (typeof window === 'undefined') return;
//   const AudioContextClass = window.AudioContext || window.webkitAudioContext;
//   if (!AudioContextClass) return;
//   const context = new AudioContextClass();
//   const oscillator = context.createOscillator();
//   const gain = context.createGain();
//   oscillator.type = 'sine';
//   oscillator.frequency.value = 880;
//   gain.gain.value = 0.02;
//   oscillator.connect(gain);
//   gain.connect(context.destination);
//   oscillator.start();
//   oscillator.stop(context.currentTime + 0.12);
//   oscillator.onended = () => { if (context.state !== 'closed') context.close(); };
// }

// function getFlow(orderType) {
//   return ['placed', 'confirmed', 'preparing', 'ready', 'completed'];
// }

// function getNextStaffStatus(order) {
//   if (!order) return null;
//   const normalizedStatus = String(order.status || '').toLowerCase();
//   const flow = getFlow(order.orderType);
//   const currentIndex = flow.indexOf(normalizedStatus);
//   if (currentIndex === -1) return null;
//   return flow[currentIndex + 1] || null;
// }

// function getActionLabel(orderType, nextStatus) {
//   if (!nextStatus) return '';
//   const labels = {
//     confirmed: 'Confirm Order',
//     preparing: 'Start Preparing',
//     ready: 'Mark Ready',
//     completed: orderType === 'takeaway' ? 'Mark Picked Up' : 'Mark Served'
//   };
//   return labels[nextStatus] || STEP_LABELS[nextStatus] || nextStatus;
// }

// function getPaymentSummary(order) {
//   const collectedMethod = String(order?.deliveryPayment?.method || '').toLowerCase();
//   const checkoutMethod = String(order?.paymentMethod || '').toLowerCase();
//   const paymentStatus = String(order?.deliveryPayment?.status || order?.paymentStatus || 'pending').toLowerCase();

//   if (paymentStatus === 'paid') {
//     if (collectedMethod === 'cash') return 'Cash • Payment Complete';
//     if (collectedMethod === 'upi') return 'UPI • Payment Complete';
//     if (checkoutMethod === 'online') return 'Online • Payment Complete';
//   }

//   if (checkoutMethod === 'cod') return 'COD • Awaiting Payment';
//   if (checkoutMethod === 'online') return 'Online • Paid';
//   return `${checkoutMethod || 'pending'} • ${paymentStatus || 'pending'}`;
// }

// function buildStaffUpiUri(order) {
//   const amount = Number(order?.totalAmount || 0).toFixed(2);
//   return `upi://pay?pa=${encodeURIComponent(CAFE_UPI_ID)}&pn=${encodeURIComponent('Roller Coaster Cafe')}&am=${encodeURIComponent(amount)}&cu=INR&tn=${encodeURIComponent(`Order ${order?.orderId || ''} - ${order?.guestName || order?.customer?.name || 'Customer'}`)}&tr=${encodeURIComponent(order?.orderId || '')}`;
// }

// function canOpenInvoice(order) {
//   return ['completed', 'delivered'].includes(String(order?.status || '').toLowerCase());
// }

// function formatDateTime(date) {
//   if (!date) return '-';
//   return new Date(date).toLocaleString();
// }

// function formatTimeOnly(date) {
//   if (!date) return '-';
//   return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
// }

// function formatDateOnly(date) {
//   if (!date) return '-';
//   return new Date(date).toLocaleDateString();
// }

// // Role-based visible statuses
// const getVisibleStatuses = (role) => {
//   switch(role) {
//     case 'kitchen':
//       return ['placed', 'confirmed', 'preparing'];
//     case 'cashier':
//     case 'waiter':
//       return ['placed', 'confirmed', 'preparing', 'ready', 'completed', 'cancelled'];
//     case 'admin':
//     case 'manager':
//       return ['placed', 'confirmed', 'preparing', 'ready', 'completed', 'cancelled'];
//     default:
//       return ['placed', 'confirmed', 'preparing', 'ready', 'completed', 'cancelled'];
//   }
// };

// // Role-based available actions
// const getAvailableActions = (role, order) => {
//   const status = order.status;
//   const orderType = getFulfillmentType(order);
  
//   if (role === 'kitchen') {
//     if (status === 'placed' || status === 'confirmed') return ['preparing'];
//     if (status === 'preparing') return ['ready'];
//     return [];
//   }
  
//   if (role === 'cashier' || role === 'waiter') {
//     if (status === 'ready' && orderType !== 'delivery') return ['completed'];
//     return [];
//   }

//   if (role === 'staff') {
//     if (status === 'placed') return ['confirmed'];
//     if (status === 'ready' && orderType !== 'delivery') return ['completed'];
//     return [];
//   }
  
//   const nextStatus = getNextStaffStatus(order);
//   return nextStatus ? [nextStatus] : [];
// };

// export default function OrderQueue() {
//   const queryClient = useQueryClient();
//   const { user, isAuthenticated } = useSelector((state) => state.auth);
//   const userRole = user?.role || 'cashier';
  
//   const [filter, setFilter] = useState('active');
//   const [searchTerm, setSearchTerm] = useState('');
//   const [prefs, setPrefs] = useState(DEFAULT_PREFS);
//   const [openOrderId, setOpenOrderId] = useState(null);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [updatingOrderId, setUpdatingOrderId] = useState(null);
//   const [servicePaymentDrafts, setServicePaymentDrafts] = useState({});
//   const [socketConnected, setSocketConnected] = useState(false);
//   const [socket, setSocket] = useState(null);
//   const [showScanner, setShowScanner] = useState(false);
//   const [scanningOrder, setScanningOrder] = useState(null);
//   const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);
//   const [transactionId, setTransactionId] = useState('');
//   const [showUpiModal, setShowUpiModal] = useState(false);
//   const [upiOrder, setUpiOrder] = useState(null);
//   const [deleteDialog, setDeleteDialog] = useState(null);
  
//   // Date & Time Filters
//   const [dateFilter, setDateFilter] = useState('all'); // all, today, tomorrow, week, custom
//   const [customStartDate, setCustomStartDate] = useState('');
//   const [customEndDate, setCustomEndDate] = useState('');
//   const [timeRangeFilter, setTimeRangeFilter] = useState('all'); // all, morning, afternoon, evening, night
//   const [showDateFilter, setShowDateFilter] = useState(false);
//   const [orderTypeFilter, setOrderTypeFilter] = useState('all'); // all, dine-in, takeaway, delivery, pre-order

//   useEffect(() => {
//     setPrefs(readQueuePrefs());
//     const handleStorage = () => setPrefs(readQueuePrefs());
//     window.addEventListener('storage', handleStorage);
//     return () => window.removeEventListener('storage', handleStorage);
//   }, []);

//   const { data: response, isLoading, error, refetch } = useQuery({
//     queryKey: ['staff-orders', filter],
//     queryFn: async () => {
//       try {
//         const res = await api.get('/orders', { 
//           params: { status: filter === 'active' ? undefined : filter, limit: 100 } 
//         });
//         return res.data;
//       } catch (err) {
//         if (err.response?.status === 401) {
//           localStorage.removeItem('token');
//           window.location.href = '/login';
//         }
//         throw err;
//       }
//     },
//     refetchInterval: isAuthenticated ? 15000 : false,
//     enabled: isAuthenticated && !!user?._id,
//     retry: false,
//   });

//   useEffect(() => {
//     if (!isAuthenticated) return;
    
//     const socketUrl = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000';
//     const newSocket = io(socketUrl, { withCredentials: true });
    
//     newSocket.on('connect', () => {
//       setSocketConnected(true);
//       newSocket.emit('join-room', { room: 'staff' });
//     });
    
//     newSocket.on('disconnect', () => setSocketConnected(false));
//     newSocket.on('connect_error', () => setSocketConnected(false));
    
//     newSocket.on('new-order', () => {
//       refetch();
//       if (prefs.soundEnabled) playQueueBeep();
//       toast.success('New order arrived!');
//     });
    
//     newSocket.on('order-updated', () => refetch());
    
//     setSocket(newSocket);
    
//     return () => {
//       if (newSocket) newSocket.disconnect();
//     };
//   }, [isAuthenticated, prefs.soundEnabled, refetch]);

//   // Date filtering helper functions
//   const isWithinDateRange = (orderDate, filterType, startDate, endDate) => {
//     if (!orderDate) return false;
//     const date = new Date(orderDate);
//     const today = new Date();
//     today.setHours(0, 0, 0, 0);
    
//     const tomorrow = new Date(today);
//     tomorrow.setDate(tomorrow.getDate() + 1);
    
//     const weekLater = new Date(today);
//     weekLater.setDate(weekLater.getDate() + 7);
    
//     switch(filterType) {
//       case 'today':
//         return date >= today && date < tomorrow;
//       case 'tomorrow':
//         const dayAfterTomorrow = new Date(tomorrow);
//         dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 1);
//         return date >= tomorrow && date < dayAfterTomorrow;
//       case 'week':
//         return date >= today && date < weekLater;
//       case 'custom':
//         if (startDate && endDate) {
//           const start = new Date(startDate);
//           start.setHours(0, 0, 0, 0);
//           const end = new Date(endDate);
//           end.setHours(23, 59, 59, 999);
//           return date >= start && date <= end;
//         }
//         return true;
//       default:
//         return true;
//     }
//   };

//   const isWithinTimeRange = (orderDate, timeRange) => {
//     if (!orderDate || timeRange === 'all') return true;
//     const hours = new Date(orderDate).getHours();
    
//     switch(timeRange) {
//       case 'morning':
//         return hours >= 6 && hours < 12;
//       case 'afternoon':
//         return hours >= 12 && hours < 17;
//       case 'evening':
//         return hours >= 17 && hours < 21;
//       case 'night':
//         return hours >= 21 || hours < 6;
//       default:
//         return true;
//     }
//   };

//   // Filter orders based on role, date, time, and order type
//   const filteredOrders = useMemo(() => {
//     if (!response?.orders) return [];
//     let rows = response.orders;
//     const visibleStatuses = getVisibleStatuses(userRole);
    
//     rows = rows.filter((order) => visibleStatuses.includes(order.status));
    
//     if (filter === 'active') {
//       rows = rows.filter((order) => !['delivered', 'completed', 'cancelled'].includes(order.status));
//     }
    
//     // Order Type Filter
//     if (orderTypeFilter !== 'all') {
//       rows = rows.filter((order) => {
//         const fulfillmentType = getFulfillmentType(order);
//         if (orderTypeFilter === 'dine-in') return fulfillmentType === 'dine-in';
//         if (orderTypeFilter === 'takeaway') return fulfillmentType === 'takeaway';
//         if (orderTypeFilter === 'delivery') return fulfillmentType === 'delivery';
//         if (orderTypeFilter === 'pre-order') return order.isPreOrder === true;
//         return true;
//       });
//     }
    
//     // Date Filter
//     rows = rows.filter((order) => {
//       const orderDate = order.createdAt || order.scheduledTime;
//       return isWithinDateRange(orderDate, dateFilter, customStartDate, customEndDate);
//     });
    
//     // Time Range Filter
//     rows = rows.filter((order) => {
//       const orderDate = order.createdAt || order.scheduledTime;
//       return isWithinTimeRange(orderDate, timeRangeFilter);
//     });
    
//     if (prefs.showOnlyAssigned) {
//       rows = rows.filter((order) => order.assignedStaff?._id === user?._id);
//     }
    
//     if (searchTerm.trim()) {
//       const term = searchTerm.toLowerCase();
//       rows = rows.filter((order) => 
//         (order.orderId || '').toLowerCase().includes(term) ||
//         (order.guestName || order.customer?.name || '').toLowerCase().includes(term) ||
//         (order.guestPhone || order.customer?.phone || '').toLowerCase().includes(term) ||
//         (order.tableNumber && order.tableNumber.toString().includes(term)) ||
//         (order.items?.some(item => item.name.toLowerCase().includes(term)))
//       );
//     }
    
//     // Sort by date/time (newest first for dine-in)
//     return rows.sort((a, b) => {
//       const dateA = new Date(a.createdAt || a.scheduledTime);
//       const dateB = new Date(b.createdAt || b.scheduledTime);
//       return dateB - dateA;
//     });
//   }, [response, filter, prefs.showOnlyAssigned, user?._id, searchTerm, userRole, dateFilter, customStartDate, customEndDate, timeRangeFilter, orderTypeFilter]);

//   const totalPages = Math.ceil(filteredOrders.length / ORDERS_PER_PAGE);
//   const paginatedOrders = useMemo(() => {
//     const start = (currentPage - 1) * ORDERS_PER_PAGE;
//     return filteredOrders.slice(start, start + ORDERS_PER_PAGE);
//   }, [filteredOrders, currentPage]);

//   useEffect(() => {
//     setCurrentPage(1);
//   }, [filter, searchTerm, dateFilter, timeRangeFilter, orderTypeFilter]);

//   const updateStatusMutation = useMutation({
//     mutationFn: ({ orderId, status, paymentCollectionMethod, transactionId }) => 
//       api.put(`/orders/${orderId}/status`, { status, paymentCollectionMethod, transactionId }),
//     onSuccess: () => { 
//       queryClient.invalidateQueries({ queryKey: ['staff-orders'] }); 
//       toast.success('Order status updated');
//       setOpenOrderId(null);
//     },
//     onError: (error) => toast.error(error.response?.data?.message || 'Could not update order'),
//   });

//   const deleteOrderMutation = useMutation({
//     mutationFn: (orderId) => api.delete(`/orders/${orderId}`),
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ['staff-orders'] });
//       toast.success('Order deleted');
//       setOpenOrderId(null);
//       setDeleteDialog(null);
//     },
//     onError: (error) => toast.error(error.response?.data?.message || 'Could not delete order'),
//   });

//   const handleStatusUpdate = (order, status) => {
//     if (!status || updatingOrderId) return;
//     setUpdatingOrderId(order._id);
//     updateStatusMutation.mutate(
//       {
//         orderId: order._id,
//         status,
//         paymentCollectionMethod: status === 'completed' ? servicePaymentDrafts[order._id] : undefined,
//       },
//       { onSettled: () => setUpdatingOrderId(null) }
//     );
//   };

//   const openPaymentScanner = (order) => {
//     setScanningOrder(order);
//     setSelectedPaymentMethod(null);
//     setTransactionId('');
//     setShowScanner(true);
//   };

//   const processPayment = () => {
//     if (!selectedPaymentMethod) {
//       toast.error('Please select a payment method');
//       return;
//     }
    
//     if (selectedPaymentMethod === 'upi' && !transactionId) {
//       toast.error('Please enter transaction ID');
//       return;
//     }
    
//     setUpdatingOrderId(scanningOrder._id);
//     updateStatusMutation.mutate(
//       { 
//         orderId: scanningOrder._id, 
//         status: 'completed',
//         paymentCollectionMethod: selectedPaymentMethod,
//         transactionId: transactionId || `CASH-${Date.now()}`
//       },
//       {
//         onSuccess: () => {
//           setShowScanner(false);
//           setScanningOrder(null);
//           setSelectedPaymentMethod(null);
//           setTransactionId('');
//           toast.success('Payment collected! Invoice generated.');
//         },
//         onSettled: () => setUpdatingOrderId(null)
//       }
//     );
//   };

//   const showUpiQR = (order) => {
//     setUpiOrder(order);
//     setShowUpiModal(true);
//   };

//   const handleDeleteOrder = (order) => {
//     if (!order?._id) return;
//     setDeleteDialog(order);
//   };

//   const confirmDeleteOrder = () => {
//     if (!deleteDialog?._id) return;
//     deleteOrderMutation.mutate(deleteDialog._id);
//   };

//   const printReceipt = (order) => {
//     const printWindow = window.open('', '_blank');
//     printWindow.document.write(`
//       <html>
//         <head><title>Order Receipt ${order.orderId}</title></head>
//         <body style="font-family: Arial; padding: 20px;">
//           <h1>Roller Coaster Cafe</h1>
//           <h3>Order Receipt</h3>
//           <p><strong>Order ID:</strong> ${order.orderId}</p>
//           <p><strong>Customer:</strong> ${order.guestName || order.customer?.name || 'Guest'}</p>
//           <p><strong>Phone:</strong> ${order.guestPhone || order.customer?.phone || '-'}</p>
//           <p><strong>Order Type:</strong> ${getOrderTypeDisplay(order)}</p>
//           <p><strong>Status:</strong> ${order.status}</p>
//           <p><strong>Date:</strong> ${formatDateTime(order.createdAt || order.scheduledTime)}</p>
//           <hr/>
//           <h4>Items:</h4>
//           <ul>
//             ${order.items?.map(item => `<li>${item.quantity} x ${item.name} - ₹${item.totalPrice || item.unitPrice * item.quantity}</li>`).join('')}
//           </ul>
//           <hr/>
//           <p><strong>Total:</strong> ₹${order.totalAmount}</p>
//         </body>
//       </html>
//     `);
//     printWindow.document.close();
//     printWindow.print();
//   };

//   const filterOptions = [
//     { value: 'active', label: 'Active Orders', icon: Clock },
//     { value: 'placed', label: 'Placed', icon: AlertCircle },
//     { value: 'confirmed', label: 'Confirmed', icon: CheckCircle },
//     { value: 'preparing', label: 'Preparing', icon: ChefHat },
//     { value: 'ready', label: 'Ready', icon: Package },
//     { value: 'completed', label: 'Completed', icon: CheckCircle },
//     { value: 'cancelled', label: 'Cancelled', icon: XCircle },
//   ];

//   const orderTypeOptions = [
//     { value: 'all', label: 'All Orders', icon: ShoppingBag },
//     { value: 'dine-in', label: 'Dine-In', icon: Table2 },
//     { value: 'takeaway', label: 'Takeaway', icon: ShoppingBag },
//     { value: 'delivery', label: 'Delivery', icon: Truck },
//     { value: 'pre-order', label: 'Pre-Orders', icon: CalendarDays },
//   ];

//   const timeRangeOptions = [
//     { value: 'all', label: 'All Day', icon: ClockIcon },
//     { value: 'morning', label: 'Morning (6AM-12PM)', icon: TrendingUp },
//     { value: 'afternoon', label: 'Afternoon (12PM-5PM)', icon: TrendingUp },
//     { value: 'evening', label: 'Evening (5PM-9PM)', icon: TrendingDown },
//     { value: 'night', label: 'Night (9PM-6AM)', icon: TrendingDown },
//   ];

//   const handlePageChange = (page) => {
//     setCurrentPage(page);
//     window.scrollTo({ top: 0, behavior: 'smooth' });
//   };

//   const statusCounts = useMemo(() => {
//     const orders = response?.orders || [];
//     return {
//       active: orders.filter(o => !['delivered', 'completed', 'cancelled'].includes(o.status)).length,
//       placed: orders.filter(o => o.status === 'placed').length,
//       confirmed: orders.filter(o => o.status === 'confirmed').length,
//       preparing: orders.filter(o => o.status === 'preparing').length,
//       ready: orders.filter(o => o.status === 'ready').length,
//       completed: orders.filter(o => o.status === 'completed').length,
//       cancelled: orders.filter(o => o.status === 'cancelled').length,
//     };
//   }, [response]);

//   // Reset date filters
//   const resetDateFilters = () => {
//     setDateFilter('all');
//     setCustomStartDate('');
//     setCustomEndDate('');
//     setTimeRangeFilter('all');
//     setOrderTypeFilter('all');
//   };

//   if (!isAuthenticated) {
//     return (
//       <div className="min-h-screen bg-[#faf8f5] flex items-center justify-center">
//         <div className="text-center">
//           <div className="w-12 h-12 border-4 border-[#b97844] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
//           <p className="text-gray-500">Please login to access staff panel...</p>
//           <Link to="/login" className="mt-4 inline-block text-[#b97844] hover:underline">Go to Login</Link>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-[#faf8f5]">
//       <header className="bg-white border-b border-[#e8e0d6] sticky top-0 z-20">
//         <div className="max-w-7xl mx-auto px-6 py-4">
//           <div className="flex flex-wrap items-center justify-between gap-4">
//             <div>
//               <h1 className="font-display text-2xl font-bold text-[#3f3328]">Order Queue</h1>
//               <p className="text-sm text-[#6b5f54]">Manage and track all customer orders</p>
//             </div>
//             <div className="flex items-center gap-3">
//               <div className="flex items-center gap-2">
//                 {socketConnected ? (
//                   <span className="inline-flex items-center gap-1 text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full">
//                     <Wifi size={12} /> Live
//                   </span>
//                 ) : (
//                   <span className="inline-flex items-center gap-1 text-xs text-gray-400 bg-gray-50 px-2 py-1 rounded-full">
//                     <WifiOff size={12} /> Connecting
//                   </span>
//                 )}
//               </div>
//               <button
//                 onClick={() => setShowDateFilter(!showDateFilter)}
//                 className={`inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition-all ${
//                   showDateFilter || dateFilter !== 'all' || timeRangeFilter !== 'all' || orderTypeFilter !== 'all'
//                     ? 'bg-[#b97844] text-white border-[#b97844]'
//                     : 'border-[#e8e0d6] bg-white text-[#6b5f54] hover:border-[#b97844] hover:text-[#b97844]'
//                 }`}
//               >
//                 <Calendar size={16} /> Filter by Date/Time
//               </button>
//               <Link to="/staff/pos" className="inline-flex items-center gap-2 rounded-lg border border-[#e8e0d6] bg-white px-4 py-2 text-sm font-medium text-[#6b5f54] hover:border-[#b97844] hover:text-[#b97844] transition-all">
//                 <Monitor size={16} /> POS Mode
//               </Link>
//               <Link to="/staff/settings" className="inline-flex items-center gap-2 rounded-lg border border-[#e8e0d6] bg-white px-4 py-2 text-sm font-medium text-[#6b5f54] hover:border-[#b97844] hover:text-[#b97844] transition-all">
//                 <Settings size={16} /> Settings
//               </Link>
//               <button onClick={() => refetch()} className="p-2 rounded-lg border border-[#e8e0d6] bg-white hover:bg-[#faf8f5] transition-all">
//                 <RefreshCw size={16} className="text-[#6b5f54]" />
//               </button>
//             </div>
//           </div>
//         </div>
//       </header>

//       <div className="max-w-7xl mx-auto px-6 py-6">
//         {/* Stats Cards */}
//         <div className="grid grid-cols-2 md:grid-cols-7 gap-3 mb-6">
//           <div className="bg-white border border-[#e8e0d6] rounded-xl p-3 text-center">
//             <p className="text-xs text-[#6b5f54]">Total</p>
//             <p className="text-xl font-bold text-[#3f3328]">{response?.orders?.length || 0}</p>
//           </div>
//           <div className="bg-white border border-[#e8e0d6] rounded-xl p-3 text-center">
//             <p className="text-xs text-[#6b5f54]">Active</p>
//             <p className="text-xl font-bold text-[#3f3328]">{statusCounts.active}</p>
//           </div>
//           <div className="bg-white border border-[#e8e0d6] rounded-xl p-3 text-center">
//             <p className="text-xs text-[#6b5f54]">Placed</p>
//             <p className="text-xl font-bold text-amber-600">{statusCounts.placed}</p>
//           </div>
//           <div className="bg-white border border-[#e8e0d6] rounded-xl p-3 text-center">
//             <p className="text-xs text-[#6b5f54]">Preparing</p>
//             <p className="text-xl font-bold text-orange-600">{statusCounts.preparing}</p>
//           </div>
//           <div className="bg-white border border-[#e8e0d6] rounded-xl p-3 text-center">
//             <p className="text-xs text-[#6b5f54]">Ready</p>
//             <p className="text-xl font-bold text-emerald-600">{statusCounts.ready}</p>
//           </div>
//           <div className="bg-white border border-[#e8e0d6] rounded-xl p-3 text-center">
//             <p className="text-xs text-[#6b5f54]">Completed</p>
//             <p className="text-xl font-bold text-teal-600">{statusCounts.completed}</p>
//           </div>
//           <div className="bg-white border border-[#e8e0d6] rounded-xl p-3 text-center">
//             <p className="text-xs text-[#6b5f54]">Cancelled</p>
//             <p className="text-xl font-bold text-red-600">{statusCounts.cancelled}</p>
//           </div>
//         </div>

//         {/* Date/Time Filter Panel */}
//         {showDateFilter && (
//           <div className="bg-white border border-[#e8e0d6] rounded-xl p-4 mb-6">
//             <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
//               <h3 className="font-semibold text-[#3f3328] flex items-center gap-2">
//                 <Calendar size={18} /> Date & Time Filters
//               </h3>
//               <button
//                 onClick={resetDateFilters}
//                 className="text-sm text-[#b97844] hover:underline"
//               >
//                 Reset All Filters
//               </button>
//             </div>
            
//             <div className="grid md:grid-cols-3 gap-4">
//               {/* Order Type Filter */}
//               <div>
//                 <label className="block text-xs font-medium text-[#6b5f54] mb-2">Order Type</label>
//                 <div className="flex flex-wrap gap-2">
//                   {orderTypeOptions.map((option) => (
//                     <button
//                       key={option.value}
//                       onClick={() => setOrderTypeFilter(option.value)}
//                       className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1 ${
//                         orderTypeFilter === option.value
//                           ? 'bg-[#b97844] text-white'
//                           : 'bg-[#faf8f5] text-[#6b5f54] hover:bg-[#e8e0d6]'
//                       }`}
//                     >
//                       <option.icon size={12} />
//                       {option.label}
//                     </button>
//                   ))}
//                 </div>
//               </div>

//               {/* Date Filter */}
//               <div>
//                 <label className="block text-xs font-medium text-[#6b5f54] mb-2">Date Range</label>
//                 <div className="flex flex-wrap gap-2 mb-2">
//                   {['all', 'today', 'tomorrow', 'week'].map((option) => (
//                     <button
//                       key={option}
//                       onClick={() => {
//                         setDateFilter(option);
//                         if (option !== 'custom') {
//                           setCustomStartDate('');
//                           setCustomEndDate('');
//                         }
//                       }}
//                       className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all capitalize ${
//                         dateFilter === option
//                           ? 'bg-[#b97844] text-white'
//                           : 'bg-[#faf8f5] text-[#6b5f54] hover:bg-[#e8e0d6]'
//                       }`}
//                     >
//                       {option === 'all' ? 'All Dates' : option}
//                     </button>
//                   ))}
//                   <button
//                     onClick={() => setDateFilter('custom')}
//                     className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
//                       dateFilter === 'custom'
//                         ? 'bg-[#b97844] text-white'
//                         : 'bg-[#faf8f5] text-[#6b5f54] hover:bg-[#e8e0d6]'
//                     }`}
//                   >
//                     Custom
//                   </button>
//                 </div>
//                 {dateFilter === 'custom' && (
//                   <div className="flex gap-2 mt-2">
//                     <input
//                       type="date"
//                       value={customStartDate}
//                       onChange={(e) => setCustomStartDate(e.target.value)}
//                       className="flex-1 rounded-lg border border-[#e8e0d6] px-3 py-1.5 text-sm focus:border-[#b97844] focus:outline-none"
//                       placeholder="Start Date"
//                     />
//                     <span className="text-[#6b5f54]">to</span>
//                     <input
//                       type="date"
//                       value={customEndDate}
//                       onChange={(e) => setCustomEndDate(e.target.value)}
//                       className="flex-1 rounded-lg border border-[#e8e0d6] px-3 py-1.5 text-sm focus:border-[#b97844] focus:outline-none"
//                       placeholder="End Date"
//                     />
//                   </div>
//                 )}
//               </div>

//               {/* Time Range Filter */}
//               <div>
//                 <label className="block text-xs font-medium text-[#6b5f54] mb-2">Time of Day</label>
//                 <div className="flex flex-wrap gap-2">
//                   {timeRangeOptions.map((option) => (
//                     <button
//                       key={option.value}
//                       onClick={() => setTimeRangeFilter(option.value)}
//                       className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1 ${
//                         timeRangeFilter === option.value
//                           ? 'bg-[#b97844] text-white'
//                           : 'bg-[#faf8f5] text-[#6b5f54] hover:bg-[#e8e0d6]'
//                       }`}
//                     >
//                       <option.icon size={12} />
//                       {option.label.split(' ')[0]}
//                     </button>
//                   ))}
//                 </div>
//               </div>
//             </div>

//             {/* Active Filters Summary */}
//             {(dateFilter !== 'all' || timeRangeFilter !== 'all' || orderTypeFilter !== 'all') && (
//               <div className="mt-4 pt-3 border-t border-[#e8e0d6] flex flex-wrap gap-2">
//                 <span className="text-xs text-[#6b5f54]">Active filters:</span>
//                 {orderTypeFilter !== 'all' && (
//                   <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs bg-[#faf8f5] text-[#6b5f54]">
//                     {orderTypeOptions.find(o => o.value === orderTypeFilter)?.label}
//                   </span>
//                 )}
//                 {dateFilter !== 'all' && (
//                   <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs bg-[#faf8f5] text-[#6b5f54]">
//                     {dateFilter === 'custom' ? `${customStartDate} to ${customEndDate}` : dateFilter}
//                   </span>
//                 )}
//                 {timeRangeFilter !== 'all' && (
//                   <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs bg-[#faf8f5] text-[#6b5f54]">
//                     {timeRangeOptions.find(t => t.value === timeRangeFilter)?.label}
//                   </span>
//                 )}
//               </div>
//             )}
//           </div>
//         )}

//         {/* Status Filters Bar */}
//         <div className="bg-white border border-[#e8e0d6] rounded-xl p-4 mb-6">
//           <div className="flex flex-wrap items-center justify-between gap-4">
//             <div className="flex flex-wrap gap-2">
//               {filterOptions.map((option) => (
//                 <button
//                   key={option.value}
//                   onClick={() => setFilter(option.value)}
//                   className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
//                     filter === option.value
//                       ? 'bg-[#b97844] text-white'
//                       : 'bg-[#faf8f5] text-[#6b5f54] hover:bg-[#e8e0d6]'
//                   }`}
//                 >
//                   <span className="flex items-center gap-1">
//                     <option.icon size={14} />
//                     {option.label}
//                     {statusCounts[option.value] > 0 && option.value !== 'active' && (
//                       <span className="ml-1 text-xs">({statusCounts[option.value]})</span>
//                     )}
//                   </span>
//                 </button>
//               ))}
//             </div>
//             <div className="relative">
//               <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#a0968c]" />
//               <input
//                 type="text"
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 placeholder="Search by ID, name, phone, table..."
//                 className="pl-9 pr-4 py-2 rounded-lg border border-[#e8e0d6] text-sm focus:border-[#b97844] focus:outline-none w-64"
//               />
//             </div>
//           </div>
//         </div>

//         {/* Orders List */}
//         {isLoading ? (
//           <div className="space-y-3">
//             {[1, 2, 3, 4].map(i => <div key={i} className="bg-white border border-[#e8e0d6] rounded-xl p-5 animate-pulse h-28" />)}
//           </div>
//         ) : paginatedOrders.length === 0 ? (
//           <div className="bg-white border border-[#e8e0d6] rounded-xl p-12 text-center">
//             <Package size={48} className="mx-auto text-[#a0968c] mb-4" />
//             <h2 className="text-xl font-semibold text-[#3f3328] mb-2">No orders found</h2>
//             <p className="text-[#6b5f54]">
//               {dateFilter !== 'all' || timeRangeFilter !== 'all' || orderTypeFilter !== 'all'
//                 ? 'Try adjusting your date/time filters to see more orders.'
//                 : `There are no ${filter === 'active' ? 'active' : filter} orders at the moment.`}
//             </p>
//             {(dateFilter !== 'all' || timeRangeFilter !== 'all' || orderTypeFilter !== 'all') && (
//               <button
//                 onClick={resetDateFilters}
//                 className="mt-4 text-[#b97844] hover:underline text-sm"
//               >
//                 Clear all filters
//               </button>
//             )}
//           </div>
//         ) : (
//           <>
//             <div className="space-y-3">
//               {paginatedOrders.map((order) => {
//                 const isOpen = openOrderId === order._id;
//                 const isAssignedToMe = order.assignedStaff?._id === user?._id;
//                 const isAssignedToOther = !!order.assignedStaff && !isAssignedToMe;
//                 const isDone = ['completed', 'delivered', 'cancelled'].includes(order.status);
//                 const fulfillmentType = getFulfillmentType(order);
//                 const orderTypeDisplay = getOrderTypeDisplay(order);
//                 const flow = getFlow(fulfillmentType);
//                 const currentIndex = flow.indexOf(order.status);
//                 const availableActions = getAvailableActions(userRole, order);
//                 const paymentSummary = getPaymentSummary(order);
//                 const showInvoiceLink = canOpenInvoice(order);
//                 const isCOD = String(order.paymentMethod || '').toLowerCase() === 'cod';
//                 const orderDate = order.createdAt || order.scheduledTime;
                
//                 return (
//                   <div key={order._id} className="bg-white border border-[#e8e0d6] rounded-xl overflow-hidden">
//                     <div className="p-5 hover:bg-[#faf8f5] transition-all cursor-pointer" onClick={() => setOpenOrderId(isOpen ? null : order._id)}>
//                       <div className="flex flex-wrap items-center justify-between gap-4">
//                         <div className="flex items-center gap-4 flex-wrap">
//                           <span className="font-mono text-sm font-bold text-[#3f3328]">#{order.orderId || order._id.slice(-6)}</span>
//                           <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-lg text-xs font-medium ${order.isPreOrder ? 'bg-orange-100 text-orange-700' : typeStyles[fulfillmentType] || 'bg-gray-100 text-gray-700'}`}>
//                             {fulfillmentType === 'dine-in' ? <Table2 size={12} /> : fulfillmentType === 'delivery' ? <Truck size={12} /> : <ShoppingBag size={12} />}
//                             {orderTypeDisplay}
//                           </span>
//                           <span className={`inline-flex items-center px-2 py-1 rounded-lg text-xs font-medium ${statusStyles[order.status] || 'bg-gray-100 text-gray-700'}`}>
//                             {order.status}
//                           </span>
//                           {order.tableNumber && (
//                             <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium bg-purple-100 text-purple-700">
//                               <Table2 size={12} /> Table {order.tableNumber}
//                             </span>
//                           )}
//                           <span className="inline-flex items-center gap-1 text-xs text-[#6b5f54]">
//                             <Calendar size={12} /> {formatDateOnly(orderDate)} • <Clock size={12} /> {formatTimeOnly(orderDate)}
//                           </span>
//                           {isCOD && order.status === 'ready' && (
//                             <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium bg-yellow-100 text-yellow-700">
//                               💰 COD - Collect Payment
//                             </span>
//                           )}
//                         </div>
//                         <div className="flex items-center gap-3">
//                           <span className="text-lg font-bold text-[#3f3328]">₹{order.totalAmount}</span>
//                           <ChevronDown size={18} className={`text-[#a0968c] transition-transform ${isOpen ? 'rotate-180' : ''}`} />
//                         </div>
//                       </div>
//                       <div className="flex flex-wrap items-center justify-between gap-4 mt-3">
//                         <div>
//                           <p className="text-sm text-[#6b5f54]">
//                             {order.guestName || order.customer?.name || 'Guest'} • {order.items?.length || 0} items
//                           </p>
//                           {order.guestPhone && (
//                             <p className="text-xs text-[#6b5f54] flex items-center gap-1 mt-1">
//                               <Phone size={10} /> {order.guestPhone}
//                             </p>
//                           )}
//                         </div>
//                         <div className="flex items-center gap-2">
//                           {availableActions.map(action => (
//                             <button
//                               key={action}
//                               onClick={(e) => { 
//                                 e.stopPropagation(); 
//                                 if (action === 'completed' && isCOD && order.status === 'ready') {
//                                   openPaymentScanner(order);
//                                 } else {
//                                   handleStatusUpdate(order, action);
//                                 }
//                               }}
//                               disabled={updatingOrderId === order._id}
//                               className="px-3 py-1.5 rounded-lg bg-[#b97844] text-white text-sm font-medium hover:bg-[#9e6538] transition-all disabled:opacity-60"
//                             >
//                               {getActionLabel(fulfillmentType, action)}
//                             </button>
//                           ))}
                          
//                           <button
//                             onClick={(e) => { e.stopPropagation(); printReceipt(order); }}
//                             className="p-1.5 rounded-lg border border-[#e8e0d6] text-[#6b5f54] hover:border-[#b97844] hover:text-[#b97844] transition-all"
//                             title="Print Receipt"
//                           >
//                             <Printer size={14} />
//                           </button>

//                           {isDone && (
//                             <button
//                               onClick={(e) => { e.stopPropagation(); handleDeleteOrder(order); }}
//                               className="p-1.5 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 transition-all"
//                               title="Delete Order"
//                             >
//                               <Trash2 size={14} />
//                             </button>
//                           )}
                           
//                           {isCOD && order.status === 'ready' && (
//                             <button
//                               onClick={(e) => { e.stopPropagation(); showUpiQR(order); }}
//                               className="p-1.5 rounded-lg border border-[#e8e0d6] text-blue-600 hover:border-blue-500 hover:text-blue-700 transition-all"
//                               title="Show UPI QR"
//                             >
//                               <QrCode size={14} />
//                             </button>
//                           )}
                          
//                           {isAssignedToOther && (
//                             <span className="text-sm text-[#a0968c]">Assigned to {order.assignedStaff?.name}</span>
//                           )}
//                         </div>
//                       </div>
//                     </div>

//                     {isOpen && (
//                       <div className="border-t border-[#e8e0d6] bg-[#faf8f5] p-5">
//                         <div className="grid md:grid-cols-2 gap-6">
//                           <div>
//                             <h3 className="font-semibold text-[#3f3328] mb-3 flex items-center gap-2">
//                               <Package size={16} className="text-[#b97844]" /> Order Items
//                             </h3>
//                             <div className="space-y-2 max-h-64 overflow-y-auto">
//                               {order.items?.map((item, idx) => (
//                                 <div key={idx} className="flex justify-between items-center py-2 border-b border-[#e8e0d6] last:border-0">
//                                   <div>
//                                     <p className="font-medium text-[#3f3328]">{item.name}</p>
//                                     <p className="text-xs text-[#6b5f54]">Quantity: {item.quantity}</p>
//                                     {item.variant && <p className="text-xs text-[#6b5f54]">Variant: {item.variant}</p>}
//                                     {item.addons?.length > 0 && <p className="text-xs text-[#6b5f54]">Addons: {item.addons.join(', ')}</p>}
//                                   </div>
//                                   <p className="font-semibold text-[#3f3328]">₹{item.totalPrice || item.unitPrice * item.quantity}</p>
//                                 </div>
//                               ))}
//                             </div>
//                             {order.specialNotes && (
//                               <div className="mt-4 p-3 bg-amber-50 rounded-lg">
//                                 <p className="text-sm text-amber-700"><strong>Special Notes:</strong> {order.specialNotes}</p>
//                               </div>
//                             )}
//                           </div>

//                           <div>
//                             <h3 className="font-semibold text-[#3f3328] mb-3 flex items-center gap-2">
//                               <Clock size={16} className="text-[#b97844]" /> Order Progress
//                             </h3>
//                             <div className="space-y-3">
//                               {flow.map((step, index) => {
//                                 const done = currentIndex >= index;
//                                 const active = currentIndex === index;
//                                 return (
//                                   <div key={step} className="flex items-center gap-3">
//                                     <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${done ? 'bg-[#b97844] text-white' : 'bg-[#e8e0d6] text-[#a0968c]'}`}>
//                                       {done ? <CheckCircle size={14} /> : index + 1}
//                                     </div>
//                                     <div>
//                                       <p className={`font-medium ${active ? 'text-[#b97844]' : done ? 'text-[#3f3328]' : 'text-[#a0968c]'}`}>
//                                         {STEP_LABELS[step]}
//                                       </p>
//                                       {active && <p className="text-xs text-[#6b5f54]">Current status</p>}
//                                     </div>
//                                   </div>
//                                 );
//                               })}
//                             </div>

//                             <div className="mt-4 p-3 bg-white rounded-lg border border-[#e8e0d6]">
//                               <p className="text-xs font-semibold text-[#3f3328] mb-2">Order Timeline</p>
//                               <p className="text-sm text-[#6b5f54]">📅 {formatDateOnly(orderDate)}</p>
//                               <p className="text-sm text-[#6b5f54]">⏰ {formatTimeOnly(orderDate)}</p>
//                               {order.scheduledTime && (
//                                 <p className="text-sm text-[#6b5f54] mt-1">📆 Scheduled: {formatDateTime(order.scheduledTime)}</p>
//                               )}
//                             </div>

//                             <div className="mt-3 p-3 bg-white rounded-lg border border-[#e8e0d6]">
//                               <p className="text-xs font-semibold text-[#3f3328] mb-2">Customer Details</p>
//                               <p className="text-sm text-[#6b5f54]">👤 {order.guestName || order.customer?.name || 'Guest'}</p>
//                               {order.guestPhone && (
//                                 <p className="text-sm text-[#6b5f54] flex items-center gap-1 mt-1">
//                                   <Phone size={12} /> {order.guestPhone}
//                                 </p>
//                               )}
//                               {order.tableNumber && (
//                                 <p className="text-sm text-[#6b5f54] mt-1">🍽️ Table: {order.tableNumber}</p>
//                               )}
//                             </div>

//                             <div className="mt-3 p-3 bg-white rounded-lg border border-[#e8e0d6]">
//                               <p className="text-xs font-semibold text-[#3f3328] mb-2">Payment Details</p>
//                               <p className="text-sm text-[#6b5f54]">Method: {order.paymentMethod}</p>
//                               <p className="text-sm text-[#6b5f54]">Status: {paymentSummary}</p>
//                               <p className="text-sm font-bold mt-1">Total: ₹{order.totalAmount}</p>
//                             </div>

//                             <div className="mt-4 flex flex-wrap gap-2">
//                               {showInvoiceLink && (
//                                 <Link 
//                                   to={`/invoice/${order._id}`} 
//                                   target="_blank"
//                                   className="flex-1 py-2 rounded-lg border border-[#e8e0d6] text-[#6b5f54] text-center text-sm font-medium hover:border-[#b97844] hover:text-[#b97844] transition-all"
//                                 >
//                                   View Invoice
//                                 </Link>
//                               )}
//                               {showInvoiceLink && (
//                                 <button
//                                   onClick={() => handleDeleteOrder(order)}
//                                   disabled={deleteOrderMutation.isPending}
//                                   className="px-3 py-2 rounded-lg border border-red-200 text-red-500 hover:bg-red-50 transition-all disabled:opacity-60"
//                                 >
//                                   <Trash2 size={14} />
//                                 </button>
//                               )}
//                             </div>
//                           </div>
//                         </div>
//                       </div>
//                     )}
//                   </div>
//                 );
//               })}
//             </div>

//             {totalPages > 1 && (
//               <div className="flex flex-col items-center gap-3 mt-6 pt-4 border-t border-[#e8e0d6]">
//                 <div className="flex justify-center items-center gap-2">
//                   <button
//                     onClick={() => handlePageChange(currentPage - 1)}
//                     disabled={currentPage === 1}
//                     className="w-9 h-9 rounded-full border border-[#e8e0d6] text-[#6b5f54] flex items-center justify-center hover:border-[#b97844] hover:text-[#b97844] disabled:opacity-40 disabled:cursor-not-allowed transition-all"
//                   >
//                     <ChevronLeft size={16} />
//                   </button>
                  
//                   <div className="flex gap-2">
//                     {[...Array(totalPages)].map((_, i) => {
//                       const pageNum = i + 1;
//                       if (pageNum === 1 || pageNum === totalPages || (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)) {
//                         return (
//                           <button
//                             key={pageNum}
//                             onClick={() => handlePageChange(pageNum)}
//                             className={`w-9 h-9 rounded-full text-sm font-medium transition-all ${
//                               currentPage === pageNum
//                                 ? 'bg-[#b97844] text-white'
//                                 : 'border border-[#e8e0d6] text-[#6b5f54] hover:border-[#b97844] hover:text-[#b97844]'
//                             }`}
//                           >
//                             {pageNum}
//                           </button>
//                         );
//                       }
//                       if (pageNum === currentPage - 2 || pageNum === currentPage + 2) {
//                         return <span key={pageNum} className="text-[#a0968c]">...</span>;
//                       }
//                       return null;
//                     })}
//                   </div>

//                   <button
//                     onClick={() => handlePageChange(currentPage + 1)}
//                     disabled={currentPage === totalPages}
//                     className="w-9 h-9 rounded-full border border-[#e8e0d6] text-[#6b5f54] flex items-center justify-center hover:border-[#b97844] hover:text-[#b97844] disabled:opacity-40 disabled:cursor-not-allowed transition-all"
//                   >
//                     <ChevronRight size={16} />
//                   </button>
//                 </div>
//                 <div className="text-center text-xs text-[#a0968c]">
//                   Showing {(currentPage - 1) * ORDERS_PER_PAGE + 1} - {Math.min(currentPage * ORDERS_PER_PAGE, filteredOrders.length)} of {filteredOrders.length} orders
//                 </div>
//               </div>
//             )}
//           </>
//         )}
//       </div>

//       {/* Payment Scanner Modal for COD */}
//       {showScanner && scanningOrder && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
//           <div className="bg-white rounded-2xl max-w-md w-full p-6">
//             <div className="flex justify-between items-center mb-4">
//               <h3 className="font-bold text-xl text-[#3f3328]">Collect Payment</h3>
//               <button onClick={() => setShowScanner(false)} className="p-1 hover:bg-gray-100 rounded-full">
//                 <X size={20} />
//               </button>
//             </div>
            
//             <div className="space-y-4">
//               <div className="bg-gray-50 rounded-lg p-3">
//                 <p className="text-sm text-gray-500">Order ID</p>
//                 <p className="font-mono font-bold text-lg">#{scanningOrder.orderId}</p>
//               </div>
              
//               <div className="bg-amber-50 rounded-lg p-3">
//                 <p className="text-sm text-gray-600">Total Amount</p>
//                 <p className="text-3xl font-bold text-[#b97844]">₹{scanningOrder.totalAmount}</p>
//               </div>
              
//               <div className="bg-gray-50 rounded-lg p-3">
//                 <p className="text-sm text-gray-600">Customer</p>
//                 <p className="font-medium">{scanningOrder.guestName || scanningOrder.customer?.name || 'Guest'}</p>
//                 {scanningOrder.guestPhone && (
//                   <p className="text-sm text-gray-500 mt-1">📞 {scanningOrder.guestPhone}</p>
//                 )}
//               </div>
              
//               <div className="space-y-3">
//                 <p className="text-sm font-semibold text-[#3f3328]">Select Payment Method</p>
//                 <div className="grid grid-cols-2 gap-3">
//                   <button
//                     onClick={() => setSelectedPaymentMethod('cash')}
//                     className={`py-3 rounded-lg border-2 transition-all ${
//                       selectedPaymentMethod === 'cash'
//                         ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
//                         : 'border-gray-200 bg-white text-gray-600 hover:border-emerald-300'
//                     }`}
//                   >
//                     💵 Cash
//                   </button>
//                   <button
//                     onClick={() => setSelectedPaymentMethod('upi')}
//                     className={`py-3 rounded-lg border-2 transition-all ${
//                       selectedPaymentMethod === 'upi'
//                         ? 'border-blue-500 bg-blue-50 text-blue-700'
//                         : 'border-gray-200 bg-white text-gray-600 hover:border-blue-300'
//                     }`}
//                   >
//                     📱 UPI
//                   </button>
//                 </div>
//               </div>
              
//               {selectedPaymentMethod === 'upi' && (
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">Transaction ID / UTR</label>
//                   <input
//                     type="text"
//                     value={transactionId}
//                     onChange={(e) => setTransactionId(e.target.value)}
//                     placeholder="Enter transaction ID"
//                     className="w-full rounded-lg border border-gray-300 p-2 text-sm focus:border-[#b97844] focus:outline-none"
//                   />
//                   <p className="text-xs text-gray-500 mt-1">Enter the UTR/Reference number from payment app</p>
//                 </div>
//               )}
              
//               <button
//                 onClick={processPayment}
//                 disabled={updatingOrderId === scanningOrder._id}
//                 className="w-full py-3 rounded-lg bg-[#b97844] text-white font-semibold hover:bg-[#9e6538] transition-all disabled:opacity-50"
//               >
//                 {updatingOrderId === scanningOrder._id ? 'Processing...' : 'Confirm Payment & Complete Order'}
//               </button>
              
//               <p className="text-xs text-gray-400 text-center">
//                 After payment, invoice will be generated automatically
//               </p>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* UPI QR Code Modal for Customer to Scan */}
//       {showUpiModal && upiOrder && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
//           <div className="bg-white rounded-2xl max-w-sm w-full p-6 text-center">
//             <div className="flex justify-between items-center mb-4">
//               <h3 className="font-bold text-lg text-[#3f3328]">Scan to Pay</h3>
//               <button onClick={() => setShowUpiModal(false)} className="p-1 hover:bg-gray-100 rounded-full">
//                 <X size={20} />
//               </button>
//             </div>
            
//             <div className="bg-white p-4 rounded-xl inline-block mx-auto">
//               <QRCodeCanvas 
//                 value={`upi://pay?pa=${CAFE_UPI_ID}&pn=Roller%20Coaster%20Cafe&am=${upiOrder.totalAmount}&cu=INR&tn=Order${upiOrder.orderId}`}
//                 size={200}
//                 includeMargin
//               />
//             </div>
            
//             <div className="mt-4 space-y-2">
//               <p className="font-bold text-lg">₹{upiOrder.totalAmount}</p>
//               <p className="text-sm text-gray-500 break-all">UPI ID: {CAFE_UPI_ID}</p>
//               <p className="text-xs text-gray-400">Order #{upiOrder.orderId}</p>
//             </div>
            
//             <button
//               onClick={() => {
//                 setShowUpiModal(false);
//                 openPaymentScanner(upiOrder);
//               }}
//               className="mt-4 w-full py-2 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition-all"
//             >
//               I've received the payment
//             </button>
            
//             <p className="text-xs text-gray-400 mt-3">
//               Customer can scan this QR code to pay via any UPI app
//             </p>
//           </div>
//         </div>
//       )}

//       {/* Delete Confirmation Dialog */}
//       {deleteDialog && (
//         <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
//           <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
//             <div className="flex items-start justify-between gap-4">
//               <div>
//                 <h3 className="text-xl font-bold text-[#3f3328]">Delete Order?</h3>
//                 <p className="mt-2 text-sm text-[#6b5f54]">
//                   This will remove <span className="font-semibold">#{deleteDialog.orderId || deleteDialog._id.slice(-6)}</span> from staff history.
//                 </p>
//               </div>
//               <button
//                 type="button"
//                 onClick={() => setDeleteDialog(null)}
//                 className="rounded-full p-1 text-[#6b5f54] hover:bg-[#faf8f5]"
//                 aria-label="Close delete dialog"
//               >
//                 <X size={20} />
//               </button>
//             </div>

//             <div className="mt-4 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
//               This action cannot be undone.
//             </div>

//             <div className="mt-6 flex justify-end gap-3">
//               <button
//                 type="button"
//                 onClick={() => setDeleteDialog(null)}
//                 className="rounded-lg border border-[#e8e0d6] px-4 py-2 text-sm font-medium text-[#6b5f54] hover:bg-[#faf8f5] transition-all"
//               >
//                 Keep Order
//               </button>
//               <button
//                 type="button"
//                 onClick={confirmDeleteOrder}
//                 disabled={deleteOrderMutation.isPending}
//                 className="rounded-lg bg-red-500 px-4 py-2 text-sm font-medium text-white hover:bg-red-600 transition-all disabled:cursor-not-allowed disabled:opacity-50"
//               >
//                 {deleteOrderMutation.isPending ? 'Deleting...' : 'Delete'}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

import { useEffect, useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { 
  BellRing, ChevronDown, ChevronUp, Clock, Hand, Monitor, RefreshCw, 
  Settings, ShoppingBag, Table2, Truck, UserCircle2, Package, CheckCircle, 
  XCircle, ChefHat, CalendarDays, Search, Filter, ChevronLeft, ChevronRight,
  Phone, User, Eye, Printer, Trash2, AlertCircle, Wifi, WifiOff, QrCode, X,
  Calendar, Clock as ClockIcon, TrendingUp, TrendingDown, Users, UtensilsCrossed,
  Timer, CheckCheck, Hourglass, AlarmClock
} from 'lucide-react';
import { io } from 'socket.io-client';
import toast from 'react-hot-toast';
import { QRCodeCanvas } from 'qrcode.react';
import api from '../../services/api';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

const STAFF_PREFS_KEY = 'staffQueuePrefs';
const DEFAULT_PREFS = { soundEnabled: true, showOnlyAssigned: false, compactView: false };
const ORDERS_PER_PAGE = 10;

const typeStyles = {
  'dine-in': 'bg-emerald-100 text-emerald-700',
  takeaway: 'bg-violet-100 text-violet-700',
  delivery: 'bg-sky-100 text-sky-700',
  'pre-order': 'bg-orange-100 text-orange-700',
};

const statusStyles = {
  placed: 'bg-amber-100 text-amber-700',
  confirmed: 'bg-blue-100 text-blue-700',
  preparing: 'bg-orange-100 text-orange-600',
  ready: 'bg-emerald-100 text-emerald-600',
  'out-for-delivery': 'bg-indigo-100 text-indigo-600',
  delivered: 'bg-green-100 text-green-600',
  completed: 'bg-teal-100 text-teal-600',
  cancelled: 'bg-red-100 text-red-600',
};

const STEP_LABELS = { 
  placed: 'Order Placed', 
  confirmed: 'Confirmed', 
  preparing: 'Preparing', 
  ready: 'Ready', 
  completed: 'Completed', 
  delivered: 'Delivered',
  'out-for-delivery': 'Out for Delivery'
};

const PAYMENT_OPTION_STYLES = {
  cash: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  upi: 'bg-blue-100 text-blue-700 border-blue-200',
};

const CAFE_UPI_ID = import.meta.env.VITE_CAFE_UPI_ID || 'kashishsolanki8082@okaxis';

function getFulfillmentType(order) {
  if (order?.isPreOrder && order?.preOrderMethod) return order.preOrderMethod;
  return order?.orderType;
}

function getOrderTypeDisplay(order) {
  const fulfillmentType = getFulfillmentType(order);
  if (order?.isPreOrder) {
    if (fulfillmentType === 'delivery') return 'Pre-Order Delivery';
    if (fulfillmentType === 'takeaway') return 'Pre-Order Takeaway';
    if (fulfillmentType === 'dine-in') return 'Pre-Order Dine-In';
    return 'Pre-Order';
  }
  if (fulfillmentType === 'dine-in') return 'Dine-In';
  if (fulfillmentType === 'takeaway') return 'Takeaway';
  if (fulfillmentType === 'delivery') return 'Delivery';
  return String(fulfillmentType || 'order');
}

function readQueuePrefs() {
  if (typeof window === 'undefined') return DEFAULT_PREFS;
  try {
    const raw = window.localStorage.getItem(STAFF_PREFS_KEY);
    return raw ? { ...DEFAULT_PREFS, ...JSON.parse(raw) } : DEFAULT_PREFS;
  } catch {
    return DEFAULT_PREFS;
  }
}

function playQueueBeep() {
  if (typeof window === 'undefined') return;
  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  if (!AudioContextClass) return;
  const context = new AudioContextClass();
  const oscillator = context.createOscillator();
  const gain = context.createGain();
  oscillator.type = 'sine';
  oscillator.frequency.value = 880;
  gain.gain.value = 0.02;
  oscillator.connect(gain);
  gain.connect(context.destination);
  oscillator.start();
  oscillator.stop(context.currentTime + 0.12);
  oscillator.onended = () => { if (context.state !== 'closed') context.close(); };
}

function getFlow(orderType) {
  return ['placed', 'confirmed', 'preparing', 'ready', 'completed'];
}

function getNextStaffStatus(order) {
  if (!order) return null;
  const normalizedStatus = String(order.status || '').toLowerCase();
  const flow = getFlow(order.orderType);
  const currentIndex = flow.indexOf(normalizedStatus);
  if (currentIndex === -1) return null;
  return flow[currentIndex + 1] || null;
}

function getActionLabel(orderType, nextStatus) {
  if (!nextStatus) return '';
  const labels = {
    confirmed: 'Confirm Order',
    preparing: 'Start Preparing',
    ready: 'Mark Ready',
    completed: orderType === 'takeaway' ? 'Mark Picked Up' : 'Mark Served'
  };
  return labels[nextStatus] || STEP_LABELS[nextStatus] || nextStatus;
}

function getPaymentSummary(order) {
  const collectedMethod = String(order?.deliveryPayment?.method || '').toLowerCase();
  const checkoutMethod = String(order?.paymentMethod || '').toLowerCase();
  const paymentStatus = String(order?.deliveryPayment?.status || order?.paymentStatus || 'pending').toLowerCase();

  if (paymentStatus === 'paid') {
    if (collectedMethod === 'cash') return 'Cash • Payment Complete';
    if (collectedMethod === 'upi') return 'UPI • Payment Complete';
    if (checkoutMethod === 'online') return 'Online • Payment Complete';
  }

  if (checkoutMethod === 'cod') return 'COD • Awaiting Payment';
  if (checkoutMethod === 'online') return 'Online • Paid';
  return `${checkoutMethod || 'pending'} • ${paymentStatus || 'pending'}`;
}

function buildStaffUpiUri(order) {
  const amount = Number(order?.totalAmount || 0).toFixed(2);
  return `upi://pay?pa=${encodeURIComponent(CAFE_UPI_ID)}&pn=${encodeURIComponent('Roller Coaster Cafe')}&am=${encodeURIComponent(amount)}&cu=INR&tn=${encodeURIComponent(`Order ${order?.orderId || ''} - ${order?.guestName || order?.customer?.name || 'Customer'}`)}&tr=${encodeURIComponent(order?.orderId || '')}`;
}

function canOpenInvoice(order) {
  return ['completed', 'delivered'].includes(String(order?.status || '').toLowerCase());
}

function formatDateTime(date) {
  if (!date) return '-';
  return new Date(date).toLocaleString();
}

function formatTimeOnly(date) {
  if (!date) return '-';
  return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function formatDateOnly(date) {
  if (!date) return '-';
  return new Date(date).toLocaleDateString();
}

function getTimeRemaining(scheduledTime) {
  if (!scheduledTime) return null;
  const now = new Date();
  const scheduled = new Date(scheduledTime);
  const diffMs = scheduled - now;
  
  if (diffMs <= 0) return { status: 'overdue', text: 'Overdue', color: 'text-red-600' };
  
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);
  
  if (diffDays > 0) {
    return { status: 'upcoming', text: `${diffDays}d ${diffHours % 24}h remaining`, color: 'text-blue-600' };
  }
  if (diffHours > 0) {
    return { status: 'hours', text: `${diffHours}h ${diffMins % 60}m remaining`, color: 'text-green-600' };
  }
  if (diffMins > 15) {
    return { status: 'soon', text: `${diffMins} minutes remaining`, color: 'text-amber-600' };
  }
  if (diffMins > 0) {
    return { status: 'imminent', text: `${diffMins} minutes remaining`, color: 'text-orange-600 font-bold' };
  }
  return { status: 'now', text: 'Now', color: 'text-red-600 font-bold' };
}

// Role-based visible statuses
const getVisibleStatuses = (role) => {
  switch(role) {
    case 'kitchen':
      return ['placed', 'confirmed', 'preparing'];
    case 'cashier':
    case 'waiter':
      return ['placed', 'confirmed', 'preparing', 'ready', 'completed', 'cancelled'];
    case 'admin':
    case 'manager':
      return ['placed', 'confirmed', 'preparing', 'ready', 'completed', 'cancelled'];
    default:
      return ['placed', 'confirmed', 'preparing', 'ready', 'completed', 'cancelled'];
  }
};

// Role-based available actions
const getAvailableActions = (role, order) => {
  const status = order.status;
  const orderType = getFulfillmentType(order);
  
  if (role === 'kitchen') {
    if (status === 'placed' || status === 'confirmed') return ['preparing'];
    if (status === 'preparing') return ['ready'];
    return [];
  }
  
  if (role === 'cashier' || role === 'waiter') {
    if (status === 'ready' && orderType !== 'delivery') return ['completed'];
    return [];
  }

  if (role === 'staff') {
    if (status === 'placed') return ['confirmed'];
    if (status === 'ready' && orderType !== 'delivery') return ['completed'];
    return [];
  }
  
  const nextStatus = getNextStaffStatus(order);
  return nextStatus ? [nextStatus] : [];
};

export default function OrderQueue() {
  const queryClient = useQueryClient();
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const userRole = user?.role || 'cashier';
  
  const [filter, setFilter] = useState('active');
  const [searchTerm, setSearchTerm] = useState('');
  const [prefs, setPrefs] = useState(DEFAULT_PREFS);
  const [openOrderId, setOpenOrderId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [updatingOrderId, setUpdatingOrderId] = useState(null);
  const [servicePaymentDrafts, setServicePaymentDrafts] = useState({});
  const [socketConnected, setSocketConnected] = useState(false);
  const [socket, setSocket] = useState(null);
  const [showScanner, setShowScanner] = useState(false);
  const [scanningOrder, setScanningOrder] = useState(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);
  const [transactionId, setTransactionId] = useState('');
  const [showUpiModal, setShowUpiModal] = useState(false);
  const [upiOrder, setUpiOrder] = useState(null);
  const [deleteDialog, setDeleteDialog] = useState(null);
  
  // Dine-In specific filters
  const [dineInView, setDineInView] = useState('all'); // all, upcoming, today, tomorrow, this-week
  const [showDineInOnly, setShowDineInOnly] = useState(false);
  const [selectedTable, setSelectedTable] = useState(null);
  const [timeSlotFilter, setTimeSlotFilter] = useState('all'); // all, morning, afternoon, evening
  
  // Date & Time Filters
  const [dateFilter, setDateFilter] = useState('all');
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');
  const [timeRangeFilter, setTimeRangeFilter] = useState('all');
  const [showDateFilter, setShowDateFilter] = useState(false);
  const [orderTypeFilter, setOrderTypeFilter] = useState('all');

  useEffect(() => {
    setPrefs(readQueuePrefs());
    const handleStorage = () => setPrefs(readQueuePrefs());
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const { data: response, isLoading, error, refetch } = useQuery({
    queryKey: ['staff-orders', filter],
    queryFn: async () => {
      try {
        const res = await api.get('/orders', { 
          params: { status: filter === 'active' ? undefined : filter, limit: 100 } 
        });
        return res.data;
      } catch (err) {
        if (err.response?.status === 401) {
          localStorage.removeItem('token');
          window.location.href = '/login';
        }
        throw err;
      }
    },
    refetchInterval: isAuthenticated ? 15000 : false,
    enabled: isAuthenticated && !!user?._id,
    retry: false,
  });

  useEffect(() => {
    if (!isAuthenticated) return;
    
    const socketUrl = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000';
    const newSocket = io(socketUrl, { withCredentials: true });
    
    newSocket.on('connect', () => {
      setSocketConnected(true);
      newSocket.emit('join-room', { room: 'staff' });
    });
    
    newSocket.on('disconnect', () => setSocketConnected(false));
    newSocket.on('connect_error', () => setSocketConnected(false));
    
    newSocket.on('new-order', () => {
      refetch();
      if (prefs.soundEnabled) playQueueBeep();
      toast.success('New order arrived!');
    });
    
    newSocket.on('order-updated', () => refetch());
    
    setSocket(newSocket);
    
    return () => {
      if (newSocket) newSocket.disconnect();
    };
  }, [isAuthenticated, prefs.soundEnabled, refetch]);

  // Date filtering helper functions
  const isWithinDateRange = (orderDate, filterType, startDate, endDate) => {
    if (!orderDate) return false;
    const date = new Date(orderDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const weekLater = new Date(today);
    weekLater.setDate(weekLater.getDate() + 7);
    
    switch(filterType) {
      case 'today':
        return date >= today && date < tomorrow;
      case 'tomorrow':
        const dayAfterTomorrow = new Date(tomorrow);
        dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 1);
        return date >= tomorrow && date < dayAfterTomorrow;
      case 'week':
        return date >= today && date < weekLater;
      case 'custom':
        if (startDate && endDate) {
          const start = new Date(startDate);
          start.setHours(0, 0, 0, 0);
          const end = new Date(endDate);
          end.setHours(23, 59, 59, 999);
          return date >= start && date <= end;
        }
        return true;
      default:
        return true;
    }
  };

  const isWithinTimeRange = (orderDate, timeRange) => {
    if (!orderDate || timeRange === 'all') return true;
    const hours = new Date(orderDate).getHours();
    
    switch(timeRange) {
      case 'morning':
        return hours >= 6 && hours < 12;
      case 'afternoon':
        return hours >= 12 && hours < 17;
      case 'evening':
        return hours >= 17 && hours < 21;
      case 'night':
        return hours >= 21 || hours < 6;
      default:
        return true;
    }
  };

  const isWithinDineInView = (order, view) => {
    const orderDate = order.scheduledTime || order.createdAt;
    if (!orderDate) return view === 'all';
    
    const date = new Date(orderDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const weekLater = new Date(today);
    weekLater.setDate(weekLater.getDate() + 7);
    
    switch(view) {
      case 'upcoming':
        return date >= today;
      case 'today':
        return date >= today && date < tomorrow;
      case 'tomorrow':
        const dayAfterTomorrow = new Date(tomorrow);
        dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 1);
        return date >= tomorrow && date < dayAfterTomorrow;
      case 'this-week':
        return date >= today && date < weekLater;
      default:
        return true;
    }
  };

  const isWithinTimeSlot = (orderDate, slot) => {
    if (!orderDate || slot === 'all') return true;
    const hours = new Date(orderDate).getHours();
    
    switch(slot) {
      case 'morning':
        return hours >= 6 && hours < 12;
      case 'afternoon':
        return hours >= 12 && hours < 17;
      case 'evening':
        return hours >= 17 && hours < 22;
      default:
        return true;
    }
  };

  // Filter orders based on role, date, time, and order type
  const filteredOrders = useMemo(() => {
    if (!response?.orders) return [];
    let rows = response.orders;
    const visibleStatuses = getVisibleStatuses(userRole);
    
    rows = rows.filter((order) => visibleStatuses.includes(order.status));
    
    if (filter === 'active') {
      rows = rows.filter((order) => !['delivered', 'completed', 'cancelled'].includes(order.status));
    }
    
    // Dine-In only filter for pre-booked tables
    if (showDineInOnly) {
      rows = rows.filter((order) => {
        const fulfillmentType = getFulfillmentType(order);
        return fulfillmentType === 'dine-in' || (order.isPreOrder && order.preOrderMethod === 'dine-in');
      });
      
      // Apply dine-in view filter
      rows = rows.filter((order) => isWithinDineInView(order, dineInView));
      
      // Apply time slot filter
      const orderDate = (order) => order.scheduledTime || order.createdAt;
      rows = rows.filter((order) => isWithinTimeSlot(orderDate(order), timeSlotFilter));
    }
    
    // Order Type Filter
    if (orderTypeFilter !== 'all' && !showDineInOnly) {
      rows = rows.filter((order) => {
        const fulfillmentType = getFulfillmentType(order);
        if (orderTypeFilter === 'dine-in') return fulfillmentType === 'dine-in';
        if (orderTypeFilter === 'takeaway') return fulfillmentType === 'takeaway';
        if (orderTypeFilter === 'delivery') return fulfillmentType === 'delivery';
        if (orderTypeFilter === 'pre-order') return order.isPreOrder === true;
        return true;
      });
    }
    
    // Date Filter
    if (!showDineInOnly) {
      rows = rows.filter((order) => {
        const orderDate = order.createdAt || order.scheduledTime;
        return isWithinDateRange(orderDate, dateFilter, customStartDate, customEndDate);
      });
      
      // Time Range Filter
      rows = rows.filter((order) => {
        const orderDate = order.createdAt || order.scheduledTime;
        return isWithinTimeRange(orderDate, timeRangeFilter);
      });
    }
    
    // Table filter
    if (selectedTable) {
      rows = rows.filter((order) => order.tableNumber === selectedTable);
    }
    
    if (prefs.showOnlyAssigned) {
      rows = rows.filter((order) => order.assignedStaff?._id === user?._id);
    }
    
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      rows = rows.filter((order) => 
        (order.orderId || '').toLowerCase().includes(term) ||
        (order.guestName || order.customer?.name || '').toLowerCase().includes(term) ||
        (order.guestPhone || order.customer?.phone || '').toLowerCase().includes(term) ||
        (order.tableNumber && order.tableNumber.toString().includes(term)) ||
        (order.items?.some(item => item.name.toLowerCase().includes(term)))
      );
    }
    
    // Sort by scheduled time for dine-in pre-orders
    if (showDineInOnly) {
      return rows.sort((a, b) => {
        const dateA = new Date(a.scheduledTime || a.createdAt);
        const dateB = new Date(b.scheduledTime || b.createdAt);
        return dateA - dateB;
      });
    }
    
    return rows.sort((a, b) => {
      const dateA = new Date(a.createdAt || a.scheduledTime);
      const dateB = new Date(b.createdAt || b.scheduledTime);
      return dateB - dateA;
    });
  }, [response, filter, prefs.showOnlyAssigned, user?._id, searchTerm, userRole, 
      dateFilter, customStartDate, customEndDate, timeRangeFilter, orderTypeFilter,
      showDineInOnly, dineInView, selectedTable, timeSlotFilter]);

  // Get unique table numbers for dine-in
  const dineInTables = useMemo(() => {
    if (!response?.orders) return [];
    const tables = new Set();
    response.orders.forEach(order => {
      const fulfillmentType = getFulfillmentType(order);
      if ((fulfillmentType === 'dine-in' || (order.isPreOrder && order.preOrderMethod === 'dine-in')) && order.tableNumber) {
        tables.add(order.tableNumber);
      }
    });
    return Array.from(tables).sort((a, b) => a - b);
  }, [response]);

  const totalPages = Math.ceil(filteredOrders.length / ORDERS_PER_PAGE);
  const paginatedOrders = useMemo(() => {
    const start = (currentPage - 1) * ORDERS_PER_PAGE;
    return filteredOrders.slice(start, start + ORDERS_PER_PAGE);
  }, [filteredOrders, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [filter, searchTerm, dateFilter, timeRangeFilter, orderTypeFilter, showDineInOnly, dineInView, selectedTable, timeSlotFilter]);

  const updateStatusMutation = useMutation({
    mutationFn: ({ orderId, status, paymentCollectionMethod, transactionId }) => 
      api.put(`/orders/${orderId}/status`, { status, paymentCollectionMethod, transactionId }),
    onSuccess: () => { 
      queryClient.invalidateQueries({ queryKey: ['staff-orders'] }); 
      toast.success('Order status updated');
      setOpenOrderId(null);
    },
    onError: (error) => toast.error(error.response?.data?.message || 'Could not update order'),
  });

  const deleteOrderMutation = useMutation({
    mutationFn: (orderId) => api.delete(`/orders/${orderId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['staff-orders'] });
      toast.success('Order deleted');
      setOpenOrderId(null);
      setDeleteDialog(null);
    },
    onError: (error) => toast.error(error.response?.data?.message || 'Could not delete order'),
  });

  const handleStatusUpdate = (order, status) => {
    if (!status || updatingOrderId) return;
    setUpdatingOrderId(order._id);
    updateStatusMutation.mutate(
      {
        orderId: order._id,
        status,
        paymentCollectionMethod: status === 'completed' ? servicePaymentDrafts[order._id] : undefined,
      },
      { onSettled: () => setUpdatingOrderId(null) }
    );
  };

  const openPaymentScanner = (order) => {
    setScanningOrder(order);
    setSelectedPaymentMethod(null);
    setTransactionId('');
    setShowScanner(true);
  };

  const processPayment = () => {
    if (!selectedPaymentMethod) {
      toast.error('Please select a payment method');
      return;
    }
    
    if (selectedPaymentMethod === 'upi' && !transactionId) {
      toast.error('Please enter transaction ID');
      return;
    }
    
    setUpdatingOrderId(scanningOrder._id);
    updateStatusMutation.mutate(
      { 
        orderId: scanningOrder._id, 
        status: 'completed',
        paymentCollectionMethod: selectedPaymentMethod,
        transactionId: transactionId || `CASH-${Date.now()}`
      },
      {
        onSuccess: () => {
          setShowScanner(false);
          setScanningOrder(null);
          setSelectedPaymentMethod(null);
          setTransactionId('');
          toast.success('Payment collected! Invoice generated.');
        },
        onSettled: () => setUpdatingOrderId(null)
      }
    );
  };

  const showUpiQR = (order) => {
    setUpiOrder(order);
    setShowUpiModal(true);
  };

  const handleDeleteOrder = (order) => {
    if (!order?._id) return;
    setDeleteDialog(order);
  };

  const confirmDeleteOrder = () => {
    if (!deleteDialog?._id) return;
    deleteOrderMutation.mutate(deleteDialog._id);
  };

  const printReceipt = (order) => {
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head><title>Order Receipt ${order.orderId}</title></head>
        <body style="font-family: Arial; padding: 20px;">
          <h1>Roller Coaster Cafe</h1>
          <h3>Order Receipt</h3>
          <p><strong>Order ID:</strong> ${order.orderId}</p>
          <p><strong>Customer:</strong> ${order.guestName || order.customer?.name || 'Guest'}</p>
          <p><strong>Phone:</strong> ${order.guestPhone || order.customer?.phone || '-'}</p>
          <p><strong>Order Type:</strong> ${getOrderTypeDisplay(order)}</p>
          <p><strong>Status:</strong> ${order.status}</p>
          <p><strong>Date:</strong> ${formatDateTime(order.createdAt || order.scheduledTime)}</p>
          ${order.tableNumber ? `<p><strong>Table:</strong> ${order.tableNumber}</p>` : ''}
          ${order.guestCount ? `<p><strong>Guests:</strong> ${order.guestCount}</p>` : ''}
          <hr/>
          <h4>Items:</h4>
          <ul>
            ${order.items?.map(item => `<li>${item.quantity} x ${item.name} - ₹${item.totalPrice || item.unitPrice * item.quantity}</li>`).join('')}
          </ul>
          <hr/>
          <p><strong>Total:</strong> ₹${order.totalAmount}</p>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  const filterOptions = [
    { value: 'active', label: 'Active Orders', icon: Clock },
    { value: 'placed', label: 'Placed', icon: AlertCircle },
    { value: 'confirmed', label: 'Confirmed', icon: CheckCircle },
    { value: 'preparing', label: 'Preparing', icon: ChefHat },
    { value: 'ready', label: 'Ready', icon: Package },
    { value: 'completed', label: 'Completed', icon: CheckCircle },
    { value: 'cancelled', label: 'Cancelled', icon: XCircle },
  ];

  const orderTypeOptions = [
    { value: 'all', label: 'All Orders', icon: ShoppingBag },
    { value: 'dine-in', label: 'Dine-In', icon: Table2 },
    { value: 'takeaway', label: 'Takeaway', icon: ShoppingBag },
    { value: 'delivery', label: 'Delivery', icon: Truck },
    { value: 'pre-order', label: 'Pre-Orders', icon: CalendarDays },
  ];

  const dineInViewOptions = [
    { value: 'all', label: 'All Bookings', icon: CalendarDays },
    { value: 'upcoming', label: 'Upcoming', icon: Clock },
    { value: 'today', label: 'Today', icon: Calendar },
    { value: 'tomorrow', label: 'Tomorrow', icon: Calendar },
    { value: 'this-week', label: 'This Week', icon: CalendarDays },
  ];

  const timeSlotOptions = [
    { value: 'all', label: 'All Slots', icon: ClockIcon },
    { value: 'morning', label: 'Morning (6AM-12PM)', icon: TrendingUp },
    { value: 'afternoon', label: 'Afternoon (12PM-5PM)', icon: TrendingUp },
    { value: 'evening', label: 'Evening (5PM-10PM)', icon: TrendingDown },
  ];

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const statusCounts = useMemo(() => {
    const orders = response?.orders || [];
    return {
      active: orders.filter(o => !['delivered', 'completed', 'cancelled'].includes(o.status)).length,
      placed: orders.filter(o => o.status === 'placed').length,
      confirmed: orders.filter(o => o.status === 'confirmed').length,
      preparing: orders.filter(o => o.status === 'preparing').length,
      ready: orders.filter(o => o.status === 'ready').length,
      completed: orders.filter(o => o.status === 'completed').length,
      cancelled: orders.filter(o => o.status === 'cancelled').length,
    };
  }, [response]);

  const resetDateFilters = () => {
    setDateFilter('all');
    setCustomStartDate('');
    setCustomEndDate('');
    setTimeRangeFilter('all');
    setOrderTypeFilter('all');
    setShowDineInOnly(false);
    setDineInView('all');
    setSelectedTable(null);
    setTimeSlotFilter('all');
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#faf8f5] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#b97844] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500">Please login to access staff panel...</p>
          <Link to="/login" className="mt-4 inline-block text-[#b97844] hover:underline">Go to Login</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#faf8f5]">
      <header className="bg-white border-b border-[#e8e0d6] sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="font-display text-2xl font-bold text-[#3f3328]">Order Queue</h1>
              <p className="text-sm text-[#6b5f54]">Manage and track all customer orders</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                {socketConnected ? (
                  <span className="inline-flex items-center gap-1 text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full">
                    <Wifi size={12} /> Live
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-xs text-gray-400 bg-gray-50 px-2 py-1 rounded-full">
                    <WifiOff size={12} /> Connecting
                  </span>
                )}
              </div>
              <button
                onClick={() => setShowDineInOnly(!showDineInOnly)}
                className={`inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition-all ${
                  showDineInOnly
                    ? 'bg-emerald-600 text-white border-emerald-600'
                    : 'border-[#e8e0d6] bg-white text-[#6b5f54] hover:border-emerald-500 hover:text-emerald-600'
                }`}
              >
                <Table2 size={16} /> Dine-In Bookings
              </button>
              <button
                onClick={() => setShowDateFilter(!showDateFilter)}
                className={`inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition-all ${
                  showDateFilter || dateFilter !== 'all' || timeRangeFilter !== 'all' || orderTypeFilter !== 'all'
                    ? 'bg-[#b97844] text-white border-[#b97844]'
                    : 'border-[#e8e0d6] bg-white text-[#6b5f54] hover:border-[#b97844] hover:text-[#b97844]'
                }`}
              >
                <Calendar size={16} /> Filter
              </button>
              <Link to="/staff/pos" className="inline-flex items-center gap-2 rounded-lg border border-[#e8e0d6] bg-white px-4 py-2 text-sm font-medium text-[#6b5f54] hover:border-[#b97844] hover:text-[#b97844] transition-all">
                <Monitor size={16} /> POS Mode
              </Link>
              <Link to="/staff/settings" className="inline-flex items-center gap-2 rounded-lg border border-[#e8e0d6] bg-white px-4 py-2 text-sm font-medium text-[#6b5f54] hover:border-[#b97844] hover:text-[#b97844] transition-all">
                <Settings size={16} /> Settings
              </Link>
              <button onClick={() => refetch()} className="p-2 rounded-lg border border-[#e8e0d6] bg-white hover:bg-[#faf8f5] transition-all">
                <RefreshCw size={16} className="text-[#6b5f54]" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-7 gap-3 mb-6">
          <div className="bg-white border border-[#e8e0d6] rounded-xl p-3 text-center">
            <p className="text-xs text-[#6b5f54]">Total</p>
            <p className="text-xl font-bold text-[#3f3328]">{response?.orders?.length || 0}</p>
          </div>
          <div className="bg-white border border-[#e8e0d6] rounded-xl p-3 text-center">
            <p className="text-xs text-[#6b5f54]">Active</p>
            <p className="text-xl font-bold text-[#3f3328]">{statusCounts.active}</p>
          </div>
          <div className="bg-white border border-[#e8e0d6] rounded-xl p-3 text-center">
            <p className="text-xs text-[#6b5f54]">Placed</p>
            <p className="text-xl font-bold text-amber-600">{statusCounts.placed}</p>
          </div>
          <div className="bg-white border border-[#e8e0d6] rounded-xl p-3 text-center">
            <p className="text-xs text-[#6b5f54]">Preparing</p>
            <p className="text-xl font-bold text-orange-600">{statusCounts.preparing}</p>
          </div>
          <div className="bg-white border border-[#e8e0d6] rounded-xl p-3 text-center">
            <p className="text-xs text-[#6b5f54]">Ready</p>
            <p className="text-xl font-bold text-emerald-600">{statusCounts.ready}</p>
          </div>
          <div className="bg-white border border-[#e8e0d6] rounded-xl p-3 text-center">
            <p className="text-xs text-[#6b5f54]">Completed</p>
            <p className="text-xl font-bold text-teal-600">{statusCounts.completed}</p>
          </div>
          <div className="bg-white border border-[#e8e0d6] rounded-xl p-3 text-center">
            <p className="text-xs text-[#6b5f54]">Cancelled</p>
            <p className="text-xl font-bold text-red-600">{statusCounts.cancelled}</p>
          </div>
        </div>

        {/* Dine-In Specific Filters */}
        {showDineInOnly && (
          <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-xl p-4 mb-6">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
              <h3 className="font-semibold text-emerald-800 flex items-center gap-2">
                <UtensilsCrossed size={18} /> Dine-In Table Bookings
              </h3>
              <button
                onClick={resetDateFilters}
                className="text-sm text-emerald-600 hover:text-emerald-800 hover:underline"
              >
                Clear All Filters
              </button>
            </div>
            
            <div className="grid md:grid-cols-4 gap-4">
              {/* View Filter */}
              <div>
                <label className="block text-xs font-medium text-emerald-700 mb-2">Booking View</label>
                <div className="flex flex-wrap gap-2">
                  {dineInViewOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setDineInView(option.value)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1 ${
                        dineInView === option.value
                          ? 'bg-emerald-600 text-white'
                          : 'bg-white text-emerald-700 hover:bg-emerald-100'
                      }`}
                    >
                      <option.icon size={12} />
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Time Slot Filter */}
              <div>
                <label className="block text-xs font-medium text-emerald-700 mb-2">Time Slot</label>
                <div className="flex flex-wrap gap-2">
                  {timeSlotOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setTimeSlotFilter(option.value)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1 ${
                        timeSlotFilter === option.value
                          ? 'bg-emerald-600 text-white'
                          : 'bg-white text-emerald-700 hover:bg-emerald-100'
                      }`}
                    >
                      <option.icon size={12} />
                      {option.label.split(' ')[0]}
                    </button>
                  ))}
                </div>
              </div>

              {/* Table Filter */}
              <div>
                <label className="block text-xs font-medium text-emerald-700 mb-2">Table Number</label>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setSelectedTable(null)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      !selectedTable
                        ? 'bg-emerald-600 text-white'
                        : 'bg-white text-emerald-700 hover:bg-emerald-100'
                    }`}
                  >
                    All Tables
                  </button>
                  {dineInTables.map(table => (
                    <button
                      key={table}
                      onClick={() => setSelectedTable(table)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                        selectedTable === table
                          ? 'bg-emerald-600 text-white'
                          : 'bg-white text-emerald-700 hover:bg-emerald-100'
                      }`}
                    >
                      Table {table}
                    </button>
                  ))}
                </div>
              </div>

              {/* Summary */}
              <div className="bg-white rounded-lg p-3 text-center">
                <p className="text-xs text-emerald-600">Total Bookings</p>
                <p className="text-2xl font-bold text-emerald-700">{filteredOrders.length}</p>
              </div>
            </div>
          </div>
        )}

        {/* Date/Time Filter Panel */}
        {showDateFilter && !showDineInOnly && (
          <div className="bg-white border border-[#e8e0d6] rounded-xl p-4 mb-6">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
              <h3 className="font-semibold text-[#3f3328] flex items-center gap-2">
                <Calendar size={18} /> Date & Time Filters
              </h3>
              <button
                onClick={resetDateFilters}
                className="text-sm text-[#b97844] hover:underline"
              >
                Reset All Filters
              </button>
            </div>
            
            <div className="grid md:grid-cols-3 gap-4">
              {/* Order Type Filter */}
              <div>
                <label className="block text-xs font-medium text-[#6b5f54] mb-2">Order Type</label>
                <div className="flex flex-wrap gap-2">
                  {orderTypeOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setOrderTypeFilter(option.value)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1 ${
                        orderTypeFilter === option.value
                          ? 'bg-[#b97844] text-white'
                          : 'bg-[#faf8f5] text-[#6b5f54] hover:bg-[#e8e0d6]'
                      }`}
                    >
                      <option.icon size={12} />
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Date Filter */}
              <div>
                <label className="block text-xs font-medium text-[#6b5f54] mb-2">Date Range</label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {['all', 'today', 'tomorrow', 'week'].map((option) => (
                    <button
                      key={option}
                      onClick={() => {
                        setDateFilter(option);
                        if (option !== 'custom') {
                          setCustomStartDate('');
                          setCustomEndDate('');
                        }
                      }}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all capitalize ${
                        dateFilter === option
                          ? 'bg-[#b97844] text-white'
                          : 'bg-[#faf8f5] text-[#6b5f54] hover:bg-[#e8e0d6]'
                      }`}
                    >
                      {option === 'all' ? 'All Dates' : option}
                    </button>
                  ))}
                  <button
                    onClick={() => setDateFilter('custom')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      dateFilter === 'custom'
                        ? 'bg-[#b97844] text-white'
                        : 'bg-[#faf8f5] text-[#6b5f54] hover:bg-[#e8e0d6]'
                    }`}
                  >
                    Custom
                  </button>
                </div>
                {dateFilter === 'custom' && (
                  <div className="flex gap-2 mt-2">
                    <input
                      type="date"
                      value={customStartDate}
                      onChange={(e) => setCustomStartDate(e.target.value)}
                      className="flex-1 rounded-lg border border-[#e8e0d6] px-3 py-1.5 text-sm focus:border-[#b97844] focus:outline-none"
                      placeholder="Start Date"
                    />
                    <span className="text-[#6b5f54]">to</span>
                    <input
                      type="date"
                      value={customEndDate}
                      onChange={(e) => setCustomEndDate(e.target.value)}
                      className="flex-1 rounded-lg border border-[#e8e0d6] px-3 py-1.5 text-sm focus:border-[#b97844] focus:outline-none"
                      placeholder="End Date"
                    />
                  </div>
                )}
              </div>

              {/* Time Range Filter */}
              <div>
                <label className="block text-xs font-medium text-[#6b5f54] mb-2">Time of Day</label>
                <div className="flex flex-wrap gap-2">
                  {[
                    { value: 'all', label: 'All Day', icon: ClockIcon },
                    { value: 'morning', label: 'Morning', icon: TrendingUp },
                    { value: 'afternoon', label: 'Afternoon', icon: TrendingUp },
                    { value: 'evening', label: 'Evening', icon: TrendingDown },
                    { value: 'night', label: 'Night', icon: TrendingDown },
                  ].map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setTimeRangeFilter(option.value)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1 ${
                        timeRangeFilter === option.value
                          ? 'bg-[#b97844] text-white'
                          : 'bg-[#faf8f5] text-[#6b5f54] hover:bg-[#e8e0d6]'
                      }`}
                    >
                      <option.icon size={12} />
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Active Filters Summary */}
            {(dateFilter !== 'all' || timeRangeFilter !== 'all' || orderTypeFilter !== 'all') && (
              <div className="mt-4 pt-3 border-t border-[#e8e0d6] flex flex-wrap gap-2">
                <span className="text-xs text-[#6b5f54]">Active filters:</span>
                {orderTypeFilter !== 'all' && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs bg-[#faf8f5] text-[#6b5f54]">
                    {orderTypeOptions.find(o => o.value === orderTypeFilter)?.label}
                  </span>
                )}
                {dateFilter !== 'all' && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs bg-[#faf8f5] text-[#6b5f54]">
                    {dateFilter === 'custom' ? `${customStartDate} to ${customEndDate}` : dateFilter}
                  </span>
                )}
                {timeRangeFilter !== 'all' && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs bg-[#faf8f5] text-[#6b5f54]">
                    {timeRangeFilter}
                  </span>
                )}
              </div>
            )}
          </div>
        )}

        {/* Status Filters Bar */}
        <div className="bg-white border border-[#e8e0d6] rounded-xl p-4 mb-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap gap-2">
              {filterOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => setFilter(option.value)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    filter === option.value
                      ? 'bg-[#b97844] text-white'
                      : 'bg-[#faf8f5] text-[#6b5f54] hover:bg-[#e8e0d6]'
                  }`}
                >
                  <span className="flex items-center gap-1">
                    <option.icon size={14} />
                    {option.label}
                    {statusCounts[option.value] > 0 && option.value !== 'active' && (
                      <span className="ml-1 text-xs">({statusCounts[option.value]})</span>
                    )}
                  </span>
                </button>
              ))}
            </div>
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#a0968c]" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={showDineInOnly ? "Search by name, phone, table..." : "Search by ID, name, phone, table..."}
                className="pl-9 pr-4 py-2 rounded-lg border border-[#e8e0d6] text-sm focus:border-[#b97844] focus:outline-none w-64"
              />
            </div>
          </div>
        </div>

        {/* Orders List */}
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3, 4].map(i => <div key={i} className="bg-white border border-[#e8e0d6] rounded-xl p-5 animate-pulse h-28" />)}
          </div>
        ) : paginatedOrders.length === 0 ? (
          <div className="bg-white border border-[#e8e0d6] rounded-xl p-12 text-center">
            <Package size={48} className="mx-auto text-[#a0968c] mb-4" />
            <h2 className="text-xl font-semibold text-[#3f3328] mb-2">No orders found</h2>
            <p className="text-[#6b5f54]">
              {showDineInOnly 
                ? 'No dine-in table bookings found for the selected filters.'
                : (dateFilter !== 'all' || timeRangeFilter !== 'all' || orderTypeFilter !== 'all'
                  ? 'Try adjusting your date/time filters to see more orders.'
                  : `There are no ${filter === 'active' ? 'active' : filter} orders at the moment.`)}
            </p>
            {(dateFilter !== 'all' || timeRangeFilter !== 'all' || orderTypeFilter !== 'all' || showDineInOnly) && (
              <button
                onClick={resetDateFilters}
                className="mt-4 text-[#b97844] hover:underline text-sm"
              >
                Clear all filters
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="space-y-3">
              {paginatedOrders.map((order) => {
                const isOpen = openOrderId === order._id;
                const isAssignedToMe = order.assignedStaff?._id === user?._id;
                const isAssignedToOther = !!order.assignedStaff && !isAssignedToMe;
                const isDone = ['completed', 'delivered', 'cancelled'].includes(order.status);
                const fulfillmentType = getFulfillmentType(order);
                const orderTypeDisplay = getOrderTypeDisplay(order);
                const flow = getFlow(fulfillmentType);
                const currentIndex = flow.indexOf(order.status);
                const availableActions = getAvailableActions(userRole, order);
                const paymentSummary = getPaymentSummary(order);
                const showInvoiceLink = canOpenInvoice(order);
                const isCOD = String(order.paymentMethod || '').toLowerCase() === 'cod';
                const orderDate = order.scheduledTime || order.createdAt;
                const isDineInBooking = fulfillmentType === 'dine-in' || (order.isPreOrder && order.preOrderMethod === 'dine-in');
                const timeRemaining = isDineInBooking && order.scheduledTime ? getTimeRemaining(order.scheduledTime) : null;
                
                return (
                  <div key={order._id} className={`bg-white border rounded-xl overflow-hidden transition-all ${
                    isDineInBooking && timeRemaining?.status === 'imminent' 
                      ? 'border-orange-400 shadow-lg ring-2 ring-orange-200' 
                      : isDineInBooking && timeRemaining?.status === 'overdue'
                      ? 'border-red-400 shadow-lg'
                      : 'border-[#e8e0d6]'
                  }`}>
                    <div className="p-5 hover:bg-[#faf8f5] transition-all cursor-pointer" onClick={() => setOpenOrderId(isOpen ? null : order._id)}>
                      <div className="flex flex-wrap items-center justify-between gap-4">
                        <div className="flex items-center gap-4 flex-wrap">
                          <span className="font-mono text-sm font-bold text-[#3f3328]">#{order.orderId || order._id.slice(-6)}</span>
                          <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-lg text-xs font-medium ${order.isPreOrder ? 'bg-orange-100 text-orange-700' : typeStyles[fulfillmentType] || 'bg-gray-100 text-gray-700'}`}>
                            {fulfillmentType === 'dine-in' ? <Table2 size={12} /> : fulfillmentType === 'delivery' ? <Truck size={12} /> : <ShoppingBag size={12} />}
                            {orderTypeDisplay}
                          </span>
                          <span className={`inline-flex items-center px-2 py-1 rounded-lg text-xs font-medium ${statusStyles[order.status] || 'bg-gray-100 text-gray-700'}`}>
                            {order.status}
                          </span>
                          {order.tableNumber && (
                            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium bg-purple-100 text-purple-700">
                              <Table2 size={12} /> Table {order.tableNumber} {order.guestCount ? `• ${order.guestCount} guests` : ''}
                            </span>
                          )}
                          {isDineInBooking && order.scheduledTime && (
                            <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium ${timeRemaining?.color.replace('text-', 'bg-').replace('font-bold', '')}20 ${timeRemaining?.color}`}>
                              <AlarmClock size={12} />
                              {timeRemaining?.text}
                            </span>
                          )}
                          <span className="inline-flex items-center gap-1 text-xs text-[#6b5f54]">
                            <Calendar size={12} /> {formatDateOnly(orderDate)} • <Clock size={12} /> {formatTimeOnly(orderDate)}
                          </span>
                          {isCOD && order.status === 'ready' && (
                            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium bg-yellow-100 text-yellow-700">
                              💰 COD - Collect Payment
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-lg font-bold text-[#3f3328]">₹{order.totalAmount}</span>
                          <ChevronDown size={18} className={`text-[#a0968c] transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                        </div>
                      </div>
                      <div className="flex flex-wrap items-center justify-between gap-4 mt-3">
                        <div>
                          <p className="text-sm text-[#6b5f54]">
                            {order.guestName || order.customer?.name || 'Guest'} • {order.items?.length || 0} items
                          </p>
                          {order.guestPhone && (
                            <p className="text-xs text-[#6b5f54] flex items-center gap-1 mt-1">
                              <Phone size={10} /> {order.guestPhone}
                            </p>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          {availableActions.map(action => (
                            <button
                              key={action}
                              onClick={(e) => { 
                                e.stopPropagation(); 
                                if (action === 'completed' && isCOD && order.status === 'ready') {
                                  openPaymentScanner(order);
                                } else {
                                  handleStatusUpdate(order, action);
                                }
                              }}
                              disabled={updatingOrderId === order._id}
                              className="px-3 py-1.5 rounded-lg bg-[#b97844] text-white text-sm font-medium hover:bg-[#9e6538] transition-all disabled:opacity-60"
                            >
                              {getActionLabel(fulfillmentType, action)}
                            </button>
                          ))}
                          
                          <button
                            onClick={(e) => { e.stopPropagation(); printReceipt(order); }}
                            className="p-1.5 rounded-lg border border-[#e8e0d6] text-[#6b5f54] hover:border-[#b97844] hover:text-[#b97844] transition-all"
                            title="Print Receipt"
                          >
                            <Printer size={14} />
                          </button>

                          {isDone && (
                            <button
                              onClick={(e) => { e.stopPropagation(); handleDeleteOrder(order); }}
                              className="p-1.5 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 transition-all"
                              title="Delete Order"
                            >
                              <Trash2 size={14} />
                            </button>
                          )}
                           
                          {isCOD && order.status === 'ready' && (
                            <button
                              onClick={(e) => { e.stopPropagation(); showUpiQR(order); }}
                              className="p-1.5 rounded-lg border border-[#e8e0d6] text-blue-600 hover:border-blue-500 hover:text-blue-700 transition-all"
                              title="Show UPI QR"
                            >
                              <QrCode size={14} />
                            </button>
                          )}
                          
                          {isAssignedToOther && (
                            <span className="text-sm text-[#a0968c]">Assigned to {order.assignedStaff?.name}</span>
                          )}
                        </div>
                      </div>
                    </div>

                    {isOpen && (
                      <div className="border-t border-[#e8e0d6] bg-[#faf8f5] p-5">
                        <div className="grid md:grid-cols-2 gap-6">
                          <div>
                            <h3 className="font-semibold text-[#3f3328] mb-3 flex items-center gap-2">
                              <Package size={16} className="text-[#b97844]" /> Order Items
                            </h3>
                            <div className="space-y-2 max-h-64 overflow-y-auto">
                              {order.items?.map((item, idx) => (
                                <div key={idx} className="flex justify-between items-center py-2 border-b border-[#e8e0d6] last:border-0">
                                  <div>
                                    <p className="font-medium text-[#3f3328]">{item.name}</p>
                                    <p className="text-xs text-[#6b5f54]">Quantity: {item.quantity}</p>
                                    {item.variant && <p className="text-xs text-[#6b5f54]">Variant: {item.variant}</p>}
                                    {item.addons?.length > 0 && <p className="text-xs text-[#6b5f54]">Addons: {item.addons.join(', ')}</p>}
                                  </div>
                                  <p className="font-semibold text-[#3f3328]">₹{item.totalPrice || item.unitPrice * item.quantity}</p>
                                </div>
                              ))}
                            </div>
                            {order.specialNotes && (
                              <div className="mt-4 p-3 bg-amber-50 rounded-lg">
                                <p className="text-sm text-amber-700"><strong>Special Notes:</strong> {order.specialNotes}</p>
                              </div>
                            )}
                          </div>

                          <div>
                            <h3 className="font-semibold text-[#3f3328] mb-3 flex items-center gap-2">
                              <Clock size={16} className="text-[#b97844]" /> Order Progress
                            </h3>
                            <div className="space-y-3">
                              {flow.map((step, index) => {
                                const done = currentIndex >= index;
                                const active = currentIndex === index;
                                return (
                                  <div key={step} className="flex items-center gap-3">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${done ? 'bg-[#b97844] text-white' : 'bg-[#e8e0d6] text-[#a0968c]'}`}>
                                      {done ? <CheckCircle size={14} /> : index + 1}
                                    </div>
                                    <div>
                                      <p className={`font-medium ${active ? 'text-[#b97844]' : done ? 'text-[#3f3328]' : 'text-[#a0968c]'}`}>
                                        {STEP_LABELS[step]}
                                      </p>
                                      {active && <p className="text-xs text-[#6b5f54]">Current status</p>}
                                    </div>
                                  </div>
                                );
                              })}
                            </div>

                            <div className="mt-4 p-3 bg-white rounded-lg border border-[#e8e0d6]">
                              <p className="text-xs font-semibold text-[#3f3328] mb-2">Booking Timeline</p>
                              <p className="text-sm text-[#6b5f54]">📅 Booking Date: {formatDateOnly(orderDate)}</p>
                              <p className="text-sm text-[#6b5f54]">⏰ Booking Time: {formatTimeOnly(orderDate)}</p>
                              {order.scheduledTime && (
                                <p className="text-sm text-[#6b5f54] mt-1">📆 Scheduled: {formatDateTime(order.scheduledTime)}</p>
                              )}
                              {timeRemaining && (
                                <p className={`text-sm mt-2 font-medium ${timeRemaining.color}`}>
                                  ⏳ {timeRemaining.text}
                                </p>
                              )}
                            </div>

                            <div className="mt-3 p-3 bg-white rounded-lg border border-[#e8e0d6]">
                              <p className="text-xs font-semibold text-[#3f3328] mb-2">Customer Details</p>
                              <p className="text-sm text-[#6b5f54]">👤 {order.guestName || order.customer?.name || 'Guest'}</p>
                              {order.guestPhone && (
                                <p className="text-sm text-[#6b5f54] flex items-center gap-1 mt-1">
                                  <Phone size={12} /> {order.guestPhone}
                                </p>
                              )}
                              {order.tableNumber && (
                                <>
                                  <p className="text-sm text-[#6b5f54] mt-1">🍽️ Table: {order.tableNumber}</p>
                                  <p className="text-sm text-[#6b5f54]">👥 Guests: {order.guestCount || 2}</p>
                                </>
                              )}
                            </div>

                            <div className="mt-3 p-3 bg-white rounded-lg border border-[#e8e0d6]">
                              <p className="text-xs font-semibold text-[#3f3328] mb-2">Payment Details</p>
                              <p className="text-sm text-[#6b5f54]">Method: {order.paymentMethod}</p>
                              <p className="text-sm text-[#6b5f54]">Status: {paymentSummary}</p>
                              <p className="text-sm font-bold mt-1">Total: ₹{order.totalAmount}</p>
                            </div>

                            <div className="mt-4 flex flex-wrap gap-2">
                              {showInvoiceLink && (
                                <Link 
                                  to={`/invoice/${order._id}`} 
                                  target="_blank"
                                  className="flex-1 py-2 rounded-lg border border-[#e8e0d6] text-[#6b5f54] text-center text-sm font-medium hover:border-[#b97844] hover:text-[#b97844] transition-all"
                                >
                                  View Invoice
                                </Link>
                              )}
                              {showInvoiceLink && (
                                <button
                                  onClick={() => handleDeleteOrder(order)}
                                  disabled={deleteOrderMutation.isPending}
                                  className="px-3 py-2 rounded-lg border border-red-200 text-red-500 hover:bg-red-50 transition-all disabled:opacity-60"
                                >
                                  <Trash2 size={14} />
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {totalPages > 1 && (
              <div className="flex flex-col items-center gap-3 mt-6 pt-4 border-t border-[#e8e0d6]">
                <div className="flex justify-center items-center gap-2">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="w-9 h-9 rounded-full border border-[#e8e0d6] text-[#6b5f54] flex items-center justify-center hover:border-[#b97844] hover:text-[#b97844] disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  
                  <div className="flex gap-2">
                    {[...Array(totalPages)].map((_, i) => {
                      const pageNum = i + 1;
                      if (pageNum === 1 || pageNum === totalPages || (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)) {
                        return (
                          <button
                            key={pageNum}
                            onClick={() => handlePageChange(pageNum)}
                            className={`w-9 h-9 rounded-full text-sm font-medium transition-all ${
                              currentPage === pageNum
                                ? 'bg-[#b97844] text-white'
                                : 'border border-[#e8e0d6] text-[#6b5f54] hover:border-[#b97844] hover:text-[#b97844]'
                            }`}
                          >
                            {pageNum}
                          </button>
                        );
                      }
                      if (pageNum === currentPage - 2 || pageNum === currentPage + 2) {
                        return <span key={pageNum} className="text-[#a0968c]">...</span>;
                      }
                      return null;
                    })}
                  </div>

                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="w-9 h-9 rounded-full border border-[#e8e0d6] text-[#6b5f54] flex items-center justify-center hover:border-[#b97844] hover:text-[#b97844] disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
                <div className="text-center text-xs text-[#a0968c]">
                  Showing {(currentPage - 1) * ORDERS_PER_PAGE + 1} - {Math.min(currentPage * ORDERS_PER_PAGE, filteredOrders.length)} of {filteredOrders.length} orders
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Payment Scanner Modal for COD */}
      {showScanner && scanningOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-xl text-[#3f3328]">Collect Payment</h3>
              <button onClick={() => setShowScanner(false)} className="p-1 hover:bg-gray-100 rounded-full">
                <X size={20} />
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-sm text-gray-500">Order ID</p>
                <p className="font-mono font-bold text-lg">#{scanningOrder.orderId}</p>
              </div>
              
              <div className="bg-amber-50 rounded-lg p-3">
                <p className="text-sm text-gray-600">Total Amount</p>
                <p className="text-3xl font-bold text-[#b97844]">₹{scanningOrder.totalAmount}</p>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-sm text-gray-600">Customer</p>
                <p className="font-medium">{scanningOrder.guestName || scanningOrder.customer?.name || 'Guest'}</p>
                {scanningOrder.guestPhone && (
                  <p className="text-sm text-gray-500 mt-1">📞 {scanningOrder.guestPhone}</p>
                )}
              </div>
              
              <div className="space-y-3">
                <p className="text-sm font-semibold text-[#3f3328]">Select Payment Method</p>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setSelectedPaymentMethod('cash')}
                    className={`py-3 rounded-lg border-2 transition-all ${
                      selectedPaymentMethod === 'cash'
                        ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                        : 'border-gray-200 bg-white text-gray-600 hover:border-emerald-300'
                    }`}
                  >
                    💵 Cash
                  </button>
                  <button
                    onClick={() => setSelectedPaymentMethod('upi')}
                    className={`py-3 rounded-lg border-2 transition-all ${
                      selectedPaymentMethod === 'upi'
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-200 bg-white text-gray-600 hover:border-blue-300'
                    }`}
                  >
                    📱 UPI
                  </button>
                </div>
              </div>
              
              {selectedPaymentMethod === 'upi' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Transaction ID / UTR</label>
                  <input
                    type="text"
                    value={transactionId}
                    onChange={(e) => setTransactionId(e.target.value)}
                    placeholder="Enter transaction ID"
                    className="w-full rounded-lg border border-gray-300 p-2 text-sm focus:border-[#b97844] focus:outline-none"
                  />
                  <p className="text-xs text-gray-500 mt-1">Enter the UTR/Reference number from payment app</p>
                </div>
              )}
              
              <button
                onClick={processPayment}
                disabled={updatingOrderId === scanningOrder._id}
                className="w-full py-3 rounded-lg bg-[#b97844] text-white font-semibold hover:bg-[#9e6538] transition-all disabled:opacity-50"
              >
                {updatingOrderId === scanningOrder._id ? 'Processing...' : 'Confirm Payment & Complete Order'}
              </button>
              
              <p className="text-xs text-gray-400 text-center">
                After payment, invoice will be generated automatically
              </p>
            </div>
          </div>
        </div>
      )}

      {/* UPI QR Code Modal for Customer to Scan */}
      {showUpiModal && upiOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 text-center">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-lg text-[#3f3328]">Scan to Pay</h3>
              <button onClick={() => setShowUpiModal(false)} className="p-1 hover:bg-gray-100 rounded-full">
                <X size={20} />
              </button>
            </div>
            
            <div className="bg-white p-4 rounded-xl inline-block mx-auto">
              <QRCodeCanvas 
                value={`upi://pay?pa=${CAFE_UPI_ID}&pn=Roller%20Coaster%20Cafe&am=${upiOrder.totalAmount}&cu=INR&tn=Order${upiOrder.orderId}`}
                size={200}
                includeMargin
              />
            </div>
            
            <div className="mt-4 space-y-2">
              <p className="font-bold text-lg">₹{upiOrder.totalAmount}</p>
              <p className="text-sm text-gray-500 break-all">UPI ID: {CAFE_UPI_ID}</p>
              <p className="text-xs text-gray-400">Order #{upiOrder.orderId}</p>
            </div>
            
            <button
              onClick={() => {
                setShowUpiModal(false);
                openPaymentScanner(upiOrder);
              }}
              className="mt-4 w-full py-2 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition-all"
            >
              I've received the payment
            </button>
            
            <p className="text-xs text-gray-400 mt-3">
              Customer can scan this QR code to pay via any UPI app
            </p>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      {deleteDialog && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-xl font-bold text-[#3f3328]">Delete Order?</h3>
                <p className="mt-2 text-sm text-[#6b5f54]">
                  This will remove <span className="font-semibold">#{deleteDialog.orderId || deleteDialog._id.slice(-6)}</span> from staff history.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setDeleteDialog(null)}
                className="rounded-full p-1 text-[#6b5f54] hover:bg-[#faf8f5]"
                aria-label="Close delete dialog"
              >
                <X size={20} />
              </button>
            </div>

            <div className="mt-4 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
              This action cannot be undone.
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setDeleteDialog(null)}
                className="rounded-lg border border-[#e8e0d6] px-4 py-2 text-sm font-medium text-[#6b5f54] hover:bg-[#faf8f5] transition-all"
              >
                Keep Order
              </button>
              <button
                type="button"
                onClick={confirmDeleteOrder}
                disabled={deleteOrderMutation.isPending}
                className="rounded-lg bg-red-500 px-4 py-2 text-sm font-medium text-white hover:bg-red-600 transition-all disabled:cursor-not-allowed disabled:opacity-50"
              >
                {deleteOrderMutation.isPending ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}