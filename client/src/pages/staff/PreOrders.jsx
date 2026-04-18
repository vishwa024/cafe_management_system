// // import { useEffect, useMemo, useState } from 'react';
// // import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
// // import { Link } from 'react-router-dom';
// // import { 
// //   CalendarDays, Clock3, Filter, Hand, Receipt, RefreshCw, 
// //   ShoppingBag, Table2, Truck, CheckCircle, XCircle, ChefHat, 
// //   Search, Phone, User, Eye, Edit, Trash2, Printer 
// // } from 'lucide-react';
// // import { useSelector } from 'react-redux';
// // import toast from 'react-hot-toast';
// // import api from '../../services/api';

// // const PREORDER_STATUSES = ['all', 'placed', 'confirmed', 'preparing', 'ready', 'completed', 'cancelled'];

// // const statusStyles = {
// //   placed: 'bg-amber-100 text-amber-700',
// //   confirmed: 'bg-blue-100 text-blue-700',
// //   preparing: 'bg-orange-100 text-orange-700',
// //   ready: 'bg-emerald-100 text-emerald-700',
// //   completed: 'bg-green-100 text-green-700',
// //   delivered: 'bg-green-100 text-green-700',
// //   cancelled: 'bg-red-100 text-red-700',
// // };

// // const statusOrder = ['placed', 'confirmed', 'preparing', 'ready', 'completed'];

// // function minutesUntil(value) {
// //   if (!value) return null;
// //   return Math.round((new Date(value).getTime() - Date.now()) / 60000);
// // }

// // function formatWindow(value) {
// //   if (!value) return 'No schedule';
// //   return new Date(value).toLocaleString();
// // }

// // function nextPreOrderStatus(status) {
// //   const index = statusOrder.indexOf(status);
// //   return index >= 0 ? statusOrder[index + 1] || null : null;
// // }

// // function getPreOrderActionLabel(nextStatus) {
// //   const labels = {
// //     confirmed: 'Confirm Order',
// //     preparing: 'Start Preparing',
// //     ready: 'Mark Ready',
// //     completed: 'Complete Order'
// //   };
// //   return labels[nextStatus] || `Mark as ${nextStatus}`;
// // }

// // function canOpenInvoice(order) {
// //   return ['completed', 'delivered'].includes(String(order?.status || '').toLowerCase());
// // }

// // function getPreOrderTypeLabel(order) {
// //   if (order?.preOrderMethod === 'delivery') return 'Pre-Order Delivery';
// //   if (order?.preOrderMethod === 'takeaway') return 'Pre-Order Takeaway';
// //   if (order?.preOrderMethod === 'dine-in') return 'Pre-Order Dine-In';
// //   return 'Pre-Order';
// // }

// // function getPreOrderPrepLeadMinutes(order) {
// //   return order?.preOrderMethod === 'delivery' ? 30 : 15;
// // }

// // function isPreparingLocked(order, nextStatus) {
// //   if (nextStatus !== 'preparing' || !order?.scheduledTime) return false;
// //   const diff = minutesUntil(order.scheduledTime);
// //   return diff !== null && diff > getPreOrderPrepLeadMinutes(order);
// // }

// // export default function PreOrders() {
// //   const queryClient = useQueryClient();
// //   const { user } = useSelector((state) => state.auth);
// //   const [statusFilter, setStatusFilter] = useState('all');
// //   const [timeFilter, setTimeFilter] = useState('upcoming');
// //   const [searchTerm, setSearchTerm] = useState('');
// //   const [selectedOrder, setSelectedOrder] = useState(null);
// //   const [showDetailsModal, setShowDetailsModal] = useState(false);
// //   const [statusDialog, setStatusDialog] = useState(null);
// //   const [seenReminderIds, setSeenReminderIds] = useState([]);

// //   const { data, isLoading, refetch } = useQuery({
// //     queryKey: ['staff-preorders'],
// //     queryFn: () => api.get('/orders', { params: { limit: 100 } }).then((res) => res.data),
// //     refetchInterval: 20000,
// //   });

// //   const claimMutation = useMutation({
// //     mutationFn: (orderId) => api.put(`/orders/${orderId}/assign-staff`),
// //     onSuccess: () => {
// //       queryClient.invalidateQueries({ queryKey: ['staff-preorders'] });
// //       toast.success('Pre-order claimed successfully');
// //     },
// //     onError: (error) => toast.error(error.response?.data?.message || 'Could not claim pre-order'),
// //   });

// //   const updateMutation = useMutation({
// //     mutationFn: ({ orderId, status }) => api.put(`/orders/${orderId}/status`, { status }),
// //     onSuccess: () => {
// //       queryClient.invalidateQueries({ queryKey: ['staff-preorders'] });
// //       toast.success('Pre-order status updated');
// //     },
// //     onError: (error) => toast.error(error.response?.data?.message || 'Could not update pre-order'),
// //   });

// //   const deleteMutation = useMutation({
// //     mutationFn: (orderId) => api.delete(`/orders/${orderId}`),
// //     onSuccess: () => {
// //       queryClient.invalidateQueries({ queryKey: ['staff-preorders'] });
// //       toast.success('Pre-order deleted');
// //     },
// //     onError: (error) => toast.error(error.response?.data?.message || 'Could not delete pre-order'),
// //   });

// //   const handleDeleteOrder = (order) => {
// //     if (!order?._id) return;
// //     const confirmed = window.confirm(`Delete pre-order #${order.orderId || order._id.slice(-6)}? This action cannot be undone.`);
// //     if (!confirmed) return;
// //     deleteMutation.mutate(order._id);
// //   };

// //   const handleUpdateStatus = (order, nextStatus) => {
// //     if (!nextStatus) return;
// //     setStatusDialog({ order, nextStatus, source: 'manual' });
// //   };

// //   const orders = useMemo(() => {
// //     const rows = (data?.orders || []).filter((order) => Boolean(order.isPreOrder) || order.orderType === 'pre-order');
// //     let filtered = rows
// //       .filter((order) => (statusFilter === 'all' ? true : order.status === statusFilter))
// //       .filter((order) => {
// //         const diff = minutesUntil(order.scheduledTime);
// //         if (timeFilter === 'all' || diff === null) return true;
// //         if (timeFilter === 'upcoming') return diff >= -20;
// //         if (timeFilter === 'soon') return diff >= 0 && diff <= 90;
// //         if (timeFilter === 'late') return diff < -20 && !['completed', 'delivered', 'cancelled'].includes(order.status);
// //         return true;
// //       });
// //     if (searchTerm.trim()) {
// //       const term = searchTerm.toLowerCase();
// //       filtered = filtered.filter((order) =>
// //         (order.orderId || '').toLowerCase().includes(term) ||
// //         (order.guestName || order.customer?.name || '').toLowerCase().includes(term) ||
// //         (order.guestPhone || order.customer?.phone || '').toLowerCase().includes(term)
// //       );
// //     }
// //     return filtered.sort((a, b) => new Date(a.scheduledTime || a.createdAt) - new Date(b.scheduledTime || b.createdAt));
// //   }, [data?.orders, statusFilter, timeFilter, searchTerm]);

// //   const upcomingCount = orders.filter((order) => {
// //     const diff = minutesUntil(order.scheduledTime);
// //     return diff !== null && diff >= 0 && diff <= 60;
// //   }).length;

// //   const mineCount = orders.filter((order) => order.assignedStaff?._id === user?._id).length;

// //   useEffect(() => {
// //     if (statusDialog) return;

// //     const dueSoonOrder = orders.find((order) => {
// //       const diff = minutesUntil(order.scheduledTime);
// //       return (
// //         String(order.status || '').toLowerCase() === 'placed'
// //         && diff !== null
// //         && diff >= 0
// //         && diff <= 15
// //         && !seenReminderIds.includes(order._id)
// //       );
// //     });

// //     if (dueSoonOrder) {
// //       setSeenReminderIds((prev) => [...prev, dueSoonOrder._id]);
// //       setStatusDialog({ order: dueSoonOrder, nextStatus: 'confirmed', source: 'reminder' });
// //     }
// //   }, [orders, seenReminderIds, statusDialog]);

// //   const confirmStatusUpdate = async () => {
// //     if (!statusDialog?.order || !statusDialog?.nextStatus) return;
// //     const { order, nextStatus } = statusDialog;

// //     if (isPreparingLocked(order, nextStatus)) {
// //       return;
// //     }

// //     try {
// //       if (!order.assignedStaff && nextStatus === 'confirmed') {
// //         await claimMutation.mutateAsync(order._id);
// //       }
// //       await updateMutation.mutateAsync({ orderId: order._id, status: nextStatus });
// //       setStatusDialog(null);
// //     } catch {
// //       // handled by mutations
// //     }
// //   };

// //   const openOrderDetails = (order) => {
// //     setSelectedOrder(order);
// //     setShowDetailsModal(true);
// //   };

// //   const printReceipt = (order) => {
// //     const printWindow = window.open('', '_blank');
// //     printWindow.document.write(`
// //       <html>
// //         <head><title>Pre-Order Receipt ${order.orderId}</title></head>
// //         <body style="font-family: Arial; padding: 20px;">
// //           <h1>Roller Coaster Cafe</h1>
// //           <h3>Pre-Order Receipt</h3>
// //           <p><strong>Order ID:</strong> ${order.orderId}</p>
// //           <p><strong>Customer:</strong> ${order.guestName || order.customer?.name || 'Guest'}</p>
// //           <p><strong>Phone:</strong> ${order.guestPhone || order.customer?.phone || '-'}</p>
// //           <p><strong>Scheduled:</strong> ${formatWindow(order.scheduledTime)}</p>
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

// //   return (
// //     <div className="min-h-screen bg-[#faf8f5]">
// //       {/* Header */}
// //       <header className="bg-white border-b border-[#e8e0d6] sticky top-0 z-20">
// //         <div className="max-w-7xl mx-auto px-6 py-4">
// //           <div className="flex flex-wrap items-center justify-between gap-4">
// //             <div>
// //               <h1 className="font-display text-2xl font-bold text-[#3f3328]">Pre-Orders Management</h1>
// //               <p className="text-sm text-[#6b5f54]">Manage and track scheduled customer orders</p>
// //             </div>
// //             <div className="flex items-center gap-3">
// //               <Link to="/staff" className="inline-flex items-center gap-2 rounded-lg border border-[#e8e0d6] bg-white px-4 py-2 text-sm font-medium text-[#6b5f54] hover:border-[#b97844] hover:text-[#b97844] transition-all">
// //                 Back to Dashboard
// //               </Link>
// //               <button onClick={() => refetch()} className="p-2 rounded-lg border border-[#e8e0d6] bg-white hover:bg-[#faf8f5] transition-all">
// //                 <RefreshCw size={16} className="text-[#6b5f54]" />
// //               </button>
// //             </div>
// //           </div>
// //         </div>
// //       </header>

// //       <div className="max-w-7xl mx-auto px-6 py-6">
// //         {/* Stats Row */}
// //         <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
// //           <div className="bg-white border border-[#e8e0d6] rounded-xl p-4">
// //             <p className="text-xs text-[#6b5f54] uppercase tracking-wide">Total Pre-Orders</p>
// //             <p className="text-2xl font-bold text-[#3f3328]">{orders.length}</p>
// //           </div>
// //           <div className="bg-white border border-[#e8e0d6] rounded-xl p-4">
// //             <p className="text-xs text-[#6b5f54] uppercase tracking-wide">Due in 60 min</p>
// //             <p className="text-2xl font-bold text-[#3f3328]">{upcomingCount}</p>
// //           </div>
// //           <div className="bg-white border border-[#e8e0d6] rounded-xl p-4">
// //             <p className="text-xs text-[#6b5f54] uppercase tracking-wide">Claimed by Me</p>
// //             <p className="text-2xl font-bold text-[#3f3328]">{mineCount}</p>
// //           </div>
// //           <div className="bg-white border border-[#e8e0d6] rounded-xl p-4">
// //             <p className="text-xs text-[#6b5f54] uppercase tracking-wide">Ready</p>
// //             <p className="text-2xl font-bold text-[#3f3328]">{orders.filter(o => o.status === 'ready').length}</p>
// //           </div>
// //           <div className="bg-white border border-[#e8e0d6] rounded-xl p-4">
// //             <p className="text-xs text-[#6b5f54] uppercase tracking-wide">Completed</p>
// //             <p className="text-2xl font-bold text-[#3f3328]">{orders.filter(o => o.status === 'completed').length}</p>
// //           </div>
// //         </div>

// //         {/* Filters */}
// //         <div className="bg-white border border-[#e8e0d6] rounded-xl p-4 mb-6">
// //           <div className="flex flex-wrap items-center justify-between gap-4">
// //             <div className="flex flex-wrap gap-2">
// //               {PREORDER_STATUSES.map((status) => (
// //                 <button
// //                   key={status}
// //                   onClick={() => setStatusFilter(status)}
// //                   className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
// //                     statusFilter === status ? 'bg-[#b97844] text-white' : 'bg-[#faf8f5] text-[#6b5f54] hover:bg-[#e8e0d6]'
// //                   }`}
// //                 >
// //                   {status.charAt(0).toUpperCase() + status.slice(1)}
// //                 </button>
// //               ))}
// //             </div>
// //             <div className="flex items-center gap-3">
// //               <select value={timeFilter} onChange={(e) => setTimeFilter(e.target.value)} className="rounded-lg border border-[#e8e0d6] px-4 py-2 text-sm focus:border-[#b97844] focus:outline-none">
// //                 <option value="upcoming">Upcoming + Recent</option>
// //                 <option value="soon">Due Soon (60 min)</option>
// //                 <option value="late">Running Late</option>
// //                 <option value="all">All Scheduled</option>
// //               </select>
// //               <div className="relative">
// //                 <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#a0968c]" />
// //                 <input 
// //                   type="text" 
// //                   value={searchTerm} 
// //                   onChange={(e) => setSearchTerm(e.target.value)} 
// //                   placeholder="Search by ID, name, phone..." 
// //                   className="pl-9 pr-4 py-2 rounded-lg border border-[#e8e0d6] text-sm focus:border-[#b97844] focus:outline-none w-64" 
// //                 />
// //               </div>
// //             </div>
// //           </div>
// //         </div>

// //         {/* Pre-Orders List */}
// //         {isLoading ? (
// //           <div className="space-y-3">
// //             {[1, 2, 3, 4].map(i => <div key={i} className="bg-white border border-[#e8e0d6] rounded-xl p-5 animate-pulse h-32" />)}
// //           </div>
// //         ) : orders.length === 0 ? (
// //           <div className="bg-white border border-[#e8e0d6] rounded-xl p-12 text-center">
// //             <CalendarDays size={48} className="mx-auto text-[#a0968c] mb-4" />
// //             <h2 className="text-xl font-semibold text-[#3f3328] mb-2">No pre-orders found</h2>
// //             <p className="text-[#6b5f54]">No scheduled orders match your filters.</p>
// //           </div>
// //         ) : (
// //           <div className="grid lg:grid-cols-2 gap-4">
// //             {orders.map((order) => {
// //               const nextStatus = nextPreOrderStatus(order.status);
// //               const diff = minutesUntil(order.scheduledTime);
// //               const preparingLocked = isPreparingLocked(order, nextStatus);
// //               const assignedToMe = order.assignedStaff?._id === user?._id;
// //               const assignedToOther = !!order.assignedStaff && !assignedToMe;
// //               const latenessLabel = diff === null ? 'No schedule' : diff >= 0 ? `Due in ${diff} min` : `${Math.abs(diff)} min past due`;

// //               return (
// //                 <div key={order._id} className="bg-white border border-[#e8e0d6] rounded-xl overflow-hidden hover:shadow-md transition-all">
// //                   <div className="p-5">
// //                     <div className="flex items-start justify-between mb-3">
// //                       <div>
// //                         <div className="flex items-center gap-2 flex-wrap">
// //                           <p className="font-mono text-sm font-bold text-[#3f3328]">#{order.orderId || order._id.slice(-6)}</p>
// //                           <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${statusStyles[order.status] || 'bg-gray-100 text-gray-700'}`}>
// //                             {order.status}
// //                           </span>
// //                         </div>
// //                         <p className="text-sm font-medium text-[#3f3328] mt-2">{order.guestName || order.customer?.name || 'Guest'}</p>
// //                         {order.guestPhone && (
// //                           <p className="text-xs text-[#6b5f54] flex items-center gap-1 mt-1">
// //                             <Phone size={12} /> {order.guestPhone}
// //                           </p>
// //                         )}
// //                       </div>
// //                       <div className="text-right">
// //                         <p className="text-lg font-bold text-[#3f3328]">₹{order.totalAmount}</p>
// //                         <p className={`text-xs font-medium ${diff !== null && diff < -20 ? 'text-red-600' : 'text-[#b97844]'}`}>{latenessLabel}</p>
// //                       </div>
// //                     </div>

// //                     <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
// //                       <div className="bg-[#faf8f5] rounded-lg p-2">
// //                         <p className="text-xs text-[#a0968c]">Scheduled Time</p>
// //                         <p className="font-medium text-[#3f3328] text-sm">{formatWindow(order.scheduledTime)}</p>
// //                       </div>
// //                       <div className="bg-[#faf8f5] rounded-lg p-2">
// //                         <p className="text-xs text-[#a0968c]">Order Type</p>
// //                         <p className="font-medium text-[#3f3328] text-sm">{getPreOrderTypeLabel(order)}</p>
// //                       </div>
// //                     </div>

// //                     {/* Table info for dine-in pre-orders */}
// //                     {order.tableNumber && (
// //                       <div className="mb-4 p-2 bg-purple-50 rounded-lg text-sm text-purple-700">
// //                         🍽️ Table {order.tableNumber} • {order.guestCount || 2} guests
// //                       </div>
// //                     )}

// //                     <div className="mb-4">
// //                       <p className="text-xs text-[#a0968c] mb-1">Items ({order.items?.length || 0})</p>
// //                       <div className="space-y-1">
// //                         {order.items?.slice(0, 3).map((item, idx) => (
// //                           <p key={idx} className="text-sm text-[#6b5f54]">{item.quantity} x {item.name}</p>
// //                         ))}
// //                         {order.items?.length > 3 && <p className="text-xs text-[#a0968c]">+{order.items.length - 3} more</p>}
// //                       </div>
// //                     </div>

// //                     {order.specialNotes && (
// //                       <div className="mb-4 p-2 bg-amber-50 rounded-lg text-sm text-amber-700">
// //                         📝 Note: {order.specialNotes}
// //                       </div>
// //                     )}

// //                     <div className="flex flex-wrap items-center gap-2 mt-3">
// //                       {/* Claim Button */}
// //                       {!order.assignedStaff && (
// //                         <button 
// //                           onClick={() => claimMutation.mutate(order._id)} 
// //                           className="flex-1 py-2 rounded-lg bg-[#b97844] text-white font-medium text-sm hover:bg-[#9e6538] transition-all"
// //                         >
// //                           Claim Order
// //                         </button>
// //                       )}
                      
// //                       {/* Status Update Button */}
// //                       {nextStatus && !assignedToOther && !['completed', 'delivered'].includes(order.status) && (
// //                         <button 
// //                           onClick={() => handleUpdateStatus(order, nextStatus)} 
// //                           disabled={preparingLocked}
// //                           className="flex-1 py-2 rounded-lg border border-[#b97844] text-[#b97844] font-medium text-sm hover:bg-[#b97844] hover:text-white transition-all disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-transparent disabled:hover:text-[#b97844]"
// //                         >
// //                           {getPreOrderActionLabel(nextStatus)}
// //                         </button>
// //                       )}
// //                       {preparingLocked && (
// //                         <p className="w-full text-xs text-amber-700">
// //                           Preparation unlocks {getPreOrderPrepLeadMinutes(order)} minutes before the scheduled time.
// //                         </p>
// //                       )}
                      
// //                       {/* View Details Button */}
// //                       <button
// //                         onClick={() => openOrderDetails(order)}
// //                         className="p-2 rounded-lg border border-[#e8e0d6] text-[#6b5f54] hover:border-[#b97844] hover:text-[#b97844] transition-all"
// //                         title="View Details"
// //                       >
// //                         <Eye size={16} />
// //                       </button>
                      
// //                       {/* Print Receipt Button */}
// //                       <button
// //                         onClick={() => printReceipt(order)}
// //                         className="p-2 rounded-lg border border-[#e8e0d6] text-[#6b5f54] hover:border-[#b97844] hover:text-[#b97844] transition-all"
// //                         title="Print Receipt"
// //                       >
// //                         <Printer size={16} />
// //                       </button>
                      
// //                       {/* Invoice Link */}
// //                       {canOpenInvoice(order) && (
// //                         <Link 
// //                           to={`/invoice/${order._id}`} 
// //                           target="_blank"
// //                           className="flex-1 py-2 rounded-lg border border-[#e8e0d6] text-[#6b5f54] text-center text-sm font-medium hover:border-[#b97844] hover:text-[#b97844] transition-all"
// //                         >
// //                           View Invoice
// //                         </Link>
// //                       )}
                      
// //                       {/* Delete Button for completed orders */}
// //                       {canOpenInvoice(order) && (
// //                         <button
// //                           onClick={() => handleDeleteOrder(order)}
// //                           disabled={deleteMutation.isPending}
// //                           className="p-2 rounded-lg border border-red-200 text-red-500 hover:bg-red-50 transition-all disabled:opacity-60"
// //                           title="Delete Record"
// //                         >
// //                           <Trash2 size={16} />
// //                         </button>
// //                       )}
                      
// //                       {assignedToOther && (
// //                         <span className="text-sm text-[#a0968c]">Assigned to {order.assignedStaff?.name}</span>
// //                       )}
// //                     </div>
// //                   </div>
// //                 </div>
// //               );
// //             })}
// //           </div>
// //         )}
// //       </div>

// //       {statusDialog && (
// //         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
// //           <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl">
// //             <div className="border-b border-[#e8e0d6] p-5">
// //               <h2 className="text-xl font-bold text-[#3f3328]">
// //                 {statusDialog.source === 'reminder' ? 'Pre-order Confirmation Needed' : 'Confirm Status Update'}
// //               </h2>
// //               <p className="mt-1 text-sm text-[#6b5f54]">
// //                 Order #{statusDialog.order.orderId || statusDialog.order._id.slice(-6)} for {statusDialog.order.guestName || statusDialog.order.customer?.name || 'Guest'}
// //               </p>
// //             </div>
// //             <div className="space-y-3 p-5 text-sm text-[#6b5f54]">
// //               <p>
// //                 {statusDialog.source === 'reminder'
// //                   ? 'This pre-order is close to its scheduled time. Do you want to confirm it now?'
// //                   : `Move this pre-order from "${statusDialog.order.status}" to "${statusDialog.nextStatus}"?`}
// //               </p>
// //               <div className="rounded-xl bg-[#faf8f5] p-3">
// //                 <p><span className="font-medium text-[#3f3328]">Scheduled:</span> {formatWindow(statusDialog.order.scheduledTime)}</p>
// //                 <p><span className="font-medium text-[#3f3328]">Order type:</span> {getPreOrderTypeLabel(statusDialog.order)}</p>
// //                 {statusDialog.nextStatus === 'preparing' && isPreparingLocked(statusDialog.order, statusDialog.nextStatus) && (
// //                   <p className="mt-2 text-amber-700">
// //                     Preparation becomes available {getPreOrderPrepLeadMinutes(statusDialog.order)} minutes before service time.
// //                   </p>
// //                 )}
// //               </div>
// //             </div>
// //             <div className="flex justify-end gap-3 border-t border-[#e8e0d6] p-5">
// //               <button
// //                 onClick={() => setStatusDialog(null)}
// //                 className="rounded-lg border border-[#e8e0d6] px-4 py-2 text-sm font-medium text-[#6b5f54] hover:bg-[#faf8f5]"
// //               >
// //                 Cancel
// //               </button>
// //               <button
// //                 onClick={confirmStatusUpdate}
// //                 disabled={isPreparingLocked(statusDialog.order, statusDialog.nextStatus)}
// //                 className="rounded-lg bg-[#b97844] px-4 py-2 text-sm font-medium text-white hover:bg-[#9e6538] disabled:cursor-not-allowed disabled:opacity-50"
// //               >
// //                 {statusDialog.source === 'reminder' ? 'Confirm Pre-order' : 'Yes, Continue'}
// //               </button>
// //             </div>
// //           </div>
// //         </div>
// //       )}

// //       {/* Order Details Modal */}
// //       {showDetailsModal && selectedOrder && (
// //         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
// //           <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[85vh] overflow-hidden">
// //             <div className="flex items-center justify-between p-5 border-b border-[#e8e0d6]">
// //               <h2 className="font-bold text-xl text-[#3f3328]">Pre-Order Details</h2>
// //               <button onClick={() => setShowDetailsModal(false)} className="p-1 hover:bg-gray-100 rounded-full">
// //                 <XCircle size={20} />
// //               </button>
// //             </div>
// //             <div className="p-5 overflow-y-auto max-h-[calc(85vh-80px)] space-y-4">
// //               <div className="grid grid-cols-2 gap-4">
// //                 <div>
// //                   <p className="text-xs text-[#a0968c]">Order ID</p>
// //                   <p className="font-mono font-bold">#{selectedOrder.orderId}</p>
// //                 </div>
// //                 <div>
// //                   <p className="text-xs text-[#a0968c]">Status</p>
// //                   <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${statusStyles[selectedOrder.status]}`}>
// //                     {selectedOrder.status}
// //                   </span>
// //                 </div>
// //                 <div>
// //                   <p className="text-xs text-[#a0968c]">Customer Name</p>
// //                   <p className="font-medium">{selectedOrder.guestName || selectedOrder.customer?.name || 'Guest'}</p>
// //                 </div>
// //                 <div>
// //                   <p className="text-xs text-[#a0968c]">Phone Number</p>
// //                   <p>{selectedOrder.guestPhone || selectedOrder.customer?.phone || '-'}</p>
// //                 </div>
// //                 <div>
// //                   <p className="text-xs text-[#a0968c]">Scheduled Time</p>
// //                   <p>{formatWindow(selectedOrder.scheduledTime)}</p>
// //                 </div>
// //                 <div>
// //                   <p className="text-xs text-[#a0968c]">Order Type</p>
// //                   <p>{getPreOrderTypeLabel(selectedOrder)}</p>
// //                 </div>
// //                 {selectedOrder.tableNumber && (
// //                   <>
// //                     <div>
// //                       <p className="text-xs text-[#a0968c]">Table Number</p>
// //                       <p>{selectedOrder.tableNumber}</p>
// //                     </div>
// //                     <div>
// //                       <p className="text-xs text-[#a0968c]">Guests</p>
// //                       <p>{selectedOrder.guestCount || 2}</p>
// //                     </div>
// //                   </>
// //                 )}
// //                 <div>
// //                   <p className="text-xs text-[#a0968c]">Payment Method</p>
// //                   <p className="capitalize">{selectedOrder.paymentMethod}</p>
// //                 </div>
// //                 <div>
// //                   <p className="text-xs text-[#a0968c]">Total Amount</p>
// //                   <p className="font-bold text-[#b97844]">₹{selectedOrder.totalAmount}</p>
// //                 </div>
// //               </div>
              
// //               <div>
// //                 <p className="text-xs text-[#a0968c] mb-2">Order Items</p>
// //                 <div className="space-y-2">
// //                   {selectedOrder.items?.map((item, idx) => (
// //                     <div key={idx} className="flex justify-between py-2 border-b border-[#e8e0d6]">
// //                       <div>
// //                         <p className="font-medium">{item.name}</p>
// //                         <p className="text-xs text-[#6b5f54]">Quantity: {item.quantity}</p>
// //                       </div>
// //                       <p className="font-semibold">₹{item.totalPrice || item.unitPrice * item.quantity}</p>
// //                     </div>
// //                   ))}
// //                 </div>
// //               </div>
              
// //               {selectedOrder.specialNotes && (
// //                 <div className="p-3 bg-amber-50 rounded-lg">
// //                   <p className="text-xs text-[#a0968c]">Special Notes</p>
// //                   <p className="text-sm text-amber-700">{selectedOrder.specialNotes}</p>
// //                 </div>
// //               )}
// //             </div>
// //           </div>
// //         </div>
// //       )}
// //     </div>
// //   );
// // }
// import { useEffect, useMemo, useState } from 'react';
// import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
// import { Link } from 'react-router-dom';
// import { 
//   CalendarDays, Clock3, Filter, Hand, Receipt, RefreshCw, 
//   ShoppingBag, Table2, Truck, CheckCircle, XCircle, ChefHat, 
//   Search, Phone, User, Eye, Edit, Trash2, Printer 
// } from 'lucide-react';
// import { useSelector } from 'react-redux';
// import toast from 'react-hot-toast';
// import api from '../../services/api';

// const PREORDER_STATUSES = ['all', 'placed', 'confirmed', 'preparing', 'ready', 'completed', 'cancelled'];

// const statusStyles = {
//   placed: 'bg-amber-100 text-amber-700',
//   confirmed: 'bg-blue-100 text-blue-700',
//   preparing: 'bg-orange-100 text-orange-700',
//   ready: 'bg-emerald-100 text-emerald-700',
//   completed: 'bg-green-100 text-green-700',
//   delivered: 'bg-green-100 text-green-700',
//   cancelled: 'bg-red-100 text-red-700',
// };

// const statusOrder = ['placed', 'confirmed', 'preparing', 'ready', 'completed'];

// function minutesUntil(value) {
//   if (!value) return null;
//   return Math.round((new Date(value).getTime() - Date.now()) / 60000);
// }

// function formatWindow(value) {
//   if (!value) return 'No schedule';
//   return new Date(value).toLocaleString();
// }

// function nextPreOrderStatus(status) {
//   const index = statusOrder.indexOf(status);
//   return index >= 0 ? statusOrder[index + 1] || null : null;
// }

// function getPreOrderActionLabel(nextStatus) {
//   const labels = {
//     confirmed: 'Confirm Order',
//     preparing: 'Start Preparing',
//     ready: 'Mark Ready',
//     completed: 'Complete Order'
//   };
//   return labels[nextStatus] || `Mark as ${nextStatus}`;
// }

// function canOpenInvoice(order) {
//   return ['completed', 'delivered'].includes(String(order?.status || '').toLowerCase());
// }

// function getPreOrderTypeLabel(order) {
//   if (order?.preOrderMethod === 'delivery') return 'Pre-Order Delivery';
//   if (order?.preOrderMethod === 'takeaway') return 'Pre-Order Takeaway';
//   if (order?.preOrderMethod === 'dine-in') return 'Pre-Order Dine-In';
//   return 'Pre-Order';
// }

// function getPreOrderPrepLeadMinutes(order) {
//   return order?.preOrderMethod === 'delivery' ? 30 : 15;
// }

// function isPreparingLocked(order, nextStatus) {
//   if (nextStatus !== 'preparing' || !order?.scheduledTime) return false;
//   const diff = minutesUntil(order.scheduledTime);
//   return diff !== null && diff > getPreOrderPrepLeadMinutes(order);
// }

// export default function PreOrders() {
//   const queryClient = useQueryClient();
//   const { user } = useSelector((state) => state.auth);
//   const [statusFilter, setStatusFilter] = useState('all');
//   const [timeFilter, setTimeFilter] = useState('upcoming');
//   const [searchTerm, setSearchTerm] = useState('');
//   const [selectedOrder, setSelectedOrder] = useState(null);
//   const [showDetailsModal, setShowDetailsModal] = useState(false);
//   const [statusDialog, setStatusDialog] = useState(null);
//   const [seenReminderIds, setSeenReminderIds] = useState([]);

//   const { data, isLoading, refetch } = useQuery({
//     queryKey: ['staff-preorders'],
//     queryFn: () => api.get('/orders', { params: { limit: 100 } }).then((res) => res.data),
//     refetchInterval: 20000,
//   });

//   const claimMutation = useMutation({
//     mutationFn: (orderId) => api.put(`/orders/${orderId}/assign-staff`),
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ['staff-preorders'] });
//       toast.success('Pre-order claimed successfully');
//     },
//     onError: (error) => toast.error(error.response?.data?.message || 'Could not claim pre-order'),
//   });

//   const updateMutation = useMutation({
//     mutationFn: ({ orderId, status }) => api.put(`/orders/${orderId}/status`, { status }),
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ['staff-preorders'] });
//       toast.success('Pre-order status updated successfully');
//     },
//     onError: (error) => {
//       const message = error.response?.data?.message || 'Could not update pre-order';
//       toast.error(message);
//       // If it's a conflict error, refetch to get latest data
//       if (error.response?.status === 409) {
//         queryClient.invalidateQueries({ queryKey: ['staff-preorders'] });
//       }
//     },
//   });

//   const deleteMutation = useMutation({
//     mutationFn: async (orderId) => {
//       // First try to delete via orders endpoint
//       try {
//         return await api.delete(`/orders/${orderId}`);
//       } catch (error) {
//         // If that fails, try pre-orders endpoint
//         if (error.response?.status === 404) {
//           return await api.delete(`/pre-orders/${orderId}`);
//         }
//         throw error;
//       }
//     },
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ['staff-preorders'] });
//       toast.success('Pre-order deleted successfully');
//       setShowDetailsModal(false);
//       setSelectedOrder(null);
//     },
//     onError: (error) => {
//       const message = error.response?.data?.message || 'Could not delete pre-order';
//       toast.error(message);
//     },
//   });

//   const handleDeleteOrder = (order) => {
//     if (!order?._id) {
//       toast.error('Invalid order ID');
//       return;
//     }
    
//     const confirmed = window.confirm(
//       `Delete pre-order #${order.orderId || order._id.slice(-6)}?\n\nThis action cannot be undone.`
//     );
    
//     if (!confirmed) return;
    
//     toast.loading('Deleting pre-order...', { id: 'delete-order' });
//     deleteMutation.mutate(order._id, {
//       onSettled: () => {
//         toast.dismiss('delete-order');
//       }
//     });
//   };

//   const handleUpdateStatus = (order, nextStatus) => {
//     if (!nextStatus) return;
//     setStatusDialog({ order, nextStatus, source: 'manual' });
//   };

//   const orders = useMemo(() => {
//     const rows = (data?.orders || []).filter((order) => 
//       Boolean(order.isPreOrder) || order.orderType === 'pre-order'
//     );
    
//     let filtered = rows
//       .filter((order) => (statusFilter === 'all' ? true : order.status === statusFilter))
//       .filter((order) => {
//         const diff = minutesUntil(order.scheduledTime);
//         if (timeFilter === 'all' || diff === null) return true;
//         if (timeFilter === 'upcoming') return diff >= -20;
//         if (timeFilter === 'soon') return diff >= 0 && diff <= 90;
//         if (timeFilter === 'late') return diff < -20 && !['completed', 'delivered', 'cancelled'].includes(order.status);
//         return true;
//       });
    
//     if (searchTerm.trim()) {
//       const term = searchTerm.toLowerCase();
//       filtered = filtered.filter((order) =>
//         (order.orderId || '').toLowerCase().includes(term) ||
//         (order.guestName || order.customer?.name || '').toLowerCase().includes(term) ||
//         (order.guestPhone || order.customer?.phone || '').toLowerCase().includes(term)
//       );
//     }
    
//     return filtered.sort((a, b) => 
//       new Date(a.scheduledTime || a.createdAt) - new Date(b.scheduledTime || b.createdAt)
//     );
//   }, [data?.orders, statusFilter, timeFilter, searchTerm]);

//   const upcomingCount = orders.filter((order) => {
//     const diff = minutesUntil(order.scheduledTime);
//     return diff !== null && diff >= 0 && diff <= 60;
//   }).length;

//   const mineCount = orders.filter((order) => order.assignedStaff?._id === user?._id).length;

//   useEffect(() => {
//     if (statusDialog) return;

//     const dueSoonOrder = orders.find((order) => {
//       const diff = minutesUntil(order.scheduledTime);
//       return (
//         String(order.status || '').toLowerCase() === 'placed'
//         && diff !== null
//         && diff >= 0
//         && diff <= 15
//         && !seenReminderIds.includes(order._id)
//       );
//     });

//     if (dueSoonOrder) {
//       setSeenReminderIds((prev) => [...prev, dueSoonOrder._id]);
//       setStatusDialog({ order: dueSoonOrder, nextStatus: 'confirmed', source: 'reminder' });
//     }
//   }, [orders, seenReminderIds, statusDialog]);

//   const confirmStatusUpdate = async () => {
//     if (!statusDialog?.order || !statusDialog?.nextStatus) return;
//     const { order, nextStatus } = statusDialog;

//     if (isPreparingLocked(order, nextStatus)) {
//       toast.error(`Cannot mark as preparing yet. ${getPreOrderPrepLeadMinutes(order)} minutes before scheduled time.`);
//       setStatusDialog(null);
//       return;
//     }

//     try {
//       if (!order.assignedStaff && nextStatus === 'confirmed') {
//         await claimMutation.mutateAsync(order._id);
//       }
//       await updateMutation.mutateAsync({ orderId: order._id, status: nextStatus });
//       setStatusDialog(null);
//     } catch (error) {
//       console.error('Status update failed:', error);
//       // Keep dialog open on error so user can retry
//     }
//   };

//   const openOrderDetails = (order) => {
//     setSelectedOrder(order);
//     setShowDetailsModal(true);
//   };

//   const printReceipt = (order) => {
//     const printWindow = window.open('', '_blank');
//     const formattedDate = new Date().toLocaleString();
    
//     printWindow.document.write(`
//       <html>
//         <head>
//           <title>Pre-Order Receipt ${order.orderId}</title>
//           <style>
//             body {
//               font-family: 'Courier New', monospace;
//               padding: 20px;
//               margin: 0;
//             }
//             .header {
//               text-align: center;
//               border-bottom: 1px dashed #000;
//               margin-bottom: 20px;
//               padding-bottom: 10px;
//             }
//             .order-details {
//               margin: 20px 0;
//             }
//             .items {
//               width: 100%;
//               margin: 20px 0;
//             }
//             .items th, .items td {
//               text-align: left;
//               padding: 5px 0;
//             }
//             .total {
//               border-top: 1px dashed #000;
//               margin-top: 20px;
//               padding-top: 10px;
//               font-weight: bold;
//               text-align: right;
//             }
//             .footer {
//               text-align: center;
//               margin-top: 30px;
//               font-size: 12px;
//               border-top: 1px dashed #000;
//               padding-top: 10px;
//             }
//           </style>
//         </head>
//         <body>
//           <div class="header">
//             <h2>Roller Coaster Cafe</h2>
//             <p>Pre-Order Receipt</p>
//             <p>${formattedDate}</p>
//           </div>
          
//           <div class="order-details">
//             <p><strong>Order ID:</strong> ${order.orderId}</p>
//             <p><strong>Customer:</strong> ${order.guestName || order.customer?.name || 'Guest'}</p>
//             <p><strong>Phone:</strong> ${order.guestPhone || order.customer?.phone || '-'}</p>
//             <p><strong>Scheduled:</strong> ${formatWindow(order.scheduledTime)}</p>
//             <p><strong>Type:</strong> ${getPreOrderTypeLabel(order)}</p>
//             <p><strong>Status:</strong> ${order.status}</p>
//           </div>
          
//           <table class="items">
//             <thead>
//               <tr><th>Item</th><th>Qty</th><th>Price</th></tr>
//             </thead>
//             <tbody>
//               ${order.items?.map(item => `
//                 <tr>
//                   <td>${item.name}</td>
//                   <td>${item.quantity}</td>
//                   <td>₹${item.totalPrice || item.unitPrice * item.quantity}</td>
//                 </tr>
//               `).join('')}
//             </tbody>
//           </table>
          
//           <div class="total">
//             <p>Total: ₹${order.totalAmount}</p>
//           </div>
          
//           ${order.specialNotes ? `<div class="notes"><p><strong>Notes:</strong> ${order.specialNotes}</p></div>` : ''}
          
//           <div class="footer">
//             <p>Thank you for choosing Roller Coaster Cafe!</p>
//           </div>
//         </body>
//       </html>
//     `);
//     printWindow.document.close();
//     printWindow.print();
//   };

//   return (
//     <div className="min-h-screen bg-[#faf8f5]">
//       {/* Header */}
//       <header className="bg-white border-b border-[#e8e0d6] sticky top-0 z-20">
//         <div className="max-w-7xl mx-auto px-6 py-4">
//           <div className="flex flex-wrap items-center justify-between gap-4">
//             <div>
//               <h1 className="font-display text-2xl font-bold text-[#3f3328]">Pre-Orders Management</h1>
//               <p className="text-sm text-[#6b5f54]">Manage and track scheduled customer orders</p>
//             </div>
//             <div className="flex items-center gap-3">
//               <Link to="/staff" className="inline-flex items-center gap-2 rounded-lg border border-[#e8e0d6] bg-white px-4 py-2 text-sm font-medium text-[#6b5f54] hover:border-[#b97844] hover:text-[#b97844] transition-all">
//                 Back to Dashboard
//               </Link>
//               <button 
//                 onClick={() => refetch()} 
//                 className="p-2 rounded-lg border border-[#e8e0d6] bg-white hover:bg-[#faf8f5] transition-all"
//                 aria-label="Refresh pre-orders"
//               >
//                 <RefreshCw size={16} className="text-[#6b5f54]" />
//               </button>
//             </div>
//           </div>
//         </div>
//       </header>

//       <div className="max-w-7xl mx-auto px-6 py-6">
//         {/* Stats Row */}
//         <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
//           <div className="bg-white border border-[#e8e0d6] rounded-xl p-4">
//             <p className="text-xs text-[#6b5f54] uppercase tracking-wide">Total Pre-Orders</p>
//             <p className="text-2xl font-bold text-[#3f3328]">{orders.length}</p>
//           </div>
//           <div className="bg-white border border-[#e8e0d6] rounded-xl p-4">
//             <p className="text-xs text-[#6b5f54] uppercase tracking-wide">Due in 60 min</p>
//             <p className="text-2xl font-bold text-[#3f3328]">{upcomingCount}</p>
//           </div>
//           <div className="bg-white border border-[#e8e0d6] rounded-xl p-4">
//             <p className="text-xs text-[#6b5f54] uppercase tracking-wide">Claimed by Me</p>
//             <p className="text-2xl font-bold text-[#3f3328]">{mineCount}</p>
//           </div>
//           <div className="bg-white border border-[#e8e0d6] rounded-xl p-4">
//             <p className="text-xs text-[#6b5f54] uppercase tracking-wide">Ready</p>
//             <p className="text-2xl font-bold text-[#3f3328]">{orders.filter(o => o.status === 'ready').length}</p>
//           </div>
//           <div className="bg-white border border-[#e8e0d6] rounded-xl p-4">
//             <p className="text-xs text-[#6b5f54] uppercase tracking-wide">Completed</p>
//             <p className="text-2xl font-bold text-[#3f3328]">{orders.filter(o => o.status === 'completed').length}</p>
//           </div>
//         </div>

//         {/* Filters */}
//         <div className="bg-white border border-[#e8e0d6] rounded-xl p-4 mb-6">
//           <div className="flex flex-wrap items-center justify-between gap-4">
//             <div className="flex flex-wrap gap-2">
//               {PREORDER_STATUSES.map((status) => (
//                 <button
//                   key={status}
//                   onClick={() => setStatusFilter(status)}
//                   className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
//                     statusFilter === status ? 'bg-[#b97844] text-white' : 'bg-[#faf8f5] text-[#6b5f54] hover:bg-[#e8e0d6]'
//                   }`}
//                   aria-label={`Filter by ${status}`}
//                 >
//                   {status.charAt(0).toUpperCase() + status.slice(1)}
//                 </button>
//               ))}
//             </div>
//             <div className="flex items-center gap-3">
//               <select 
//                 value={timeFilter} 
//                 onChange={(e) => setTimeFilter(e.target.value)} 
//                 className="rounded-lg border border-[#e8e0d6] px-4 py-2 text-sm focus:border-[#b97844] focus:outline-none"
//                 aria-label="Time filter"
//               >
//                 <option value="upcoming">Upcoming + Recent</option>
//                 <option value="soon">Due Soon (60 min)</option>
//                 <option value="late">Running Late</option>
//                 <option value="all">All Scheduled</option>
//               </select>
//               <div className="relative">
//                 <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#a0968c]" />
//                 <input 
//                   type="text" 
//                   value={searchTerm} 
//                   onChange={(e) => setSearchTerm(e.target.value)} 
//                   placeholder="Search by ID, name, phone..." 
//                   className="pl-9 pr-4 py-2 rounded-lg border border-[#e8e0d6] text-sm focus:border-[#b97844] focus:outline-none w-64" 
//                   aria-label="Search orders"
//                 />
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Pre-Orders List */}
//         {isLoading ? (
//           <div className="space-y-3">
//             {[1, 2, 3, 4].map(i => <div key={i} className="bg-white border border-[#e8e0d6] rounded-xl p-5 animate-pulse h-32" />)}
//           </div>
//         ) : orders.length === 0 ? (
//           <div className="bg-white border border-[#e8e0d6] rounded-xl p-12 text-center">
//             <CalendarDays size={48} className="mx-auto text-[#a0968c] mb-4" />
//             <h2 className="text-xl font-semibold text-[#3f3328] mb-2">No pre-orders found</h2>
//             <p className="text-[#6b5f54]">No scheduled orders match your filters.</p>
//           </div>
//         ) : (
//           <div className="grid lg:grid-cols-2 gap-4">
//             {orders.map((order) => {
//               const nextStatus = nextPreOrderStatus(order.status);
//               const diff = minutesUntil(order.scheduledTime);
//               const preparingLocked = isPreparingLocked(order, nextStatus);
//               const assignedToMe = order.assignedStaff?._id === user?._id;
//               const assignedToOther = !!order.assignedStaff && !assignedToMe;
//               const latenessLabel = diff === null ? 'No schedule' : diff >= 0 ? `Due in ${diff} min` : `${Math.abs(diff)} min past due`;
//               const isCompleted = ['completed', 'delivered'].includes(order.status);

//               return (
//                 <div key={order._id} className="bg-white border border-[#e8e0d6] rounded-xl overflow-hidden hover:shadow-md transition-all">
//                   <div className="p-5">
//                     <div className="flex items-start justify-between mb-3">
//                       <div>
//                         <div className="flex items-center gap-2 flex-wrap">
//                           <p className="font-mono text-sm font-bold text-[#3f3328]">#{order.orderId || order._id.slice(-6)}</p>
//                           <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${statusStyles[order.status] || 'bg-gray-100 text-gray-700'}`}>
//                             {order.status}
//                           </span>
//                         </div>
//                         <p className="text-sm font-medium text-[#3f3328] mt-2">{order.guestName || order.customer?.name || 'Guest'}</p>
//                         {order.guestPhone && (
//                           <p className="text-xs text-[#6b5f54] flex items-center gap-1 mt-1">
//                             <Phone size={12} /> {order.guestPhone}
//                           </p>
//                         )}
//                       </div>
//                       <div className="text-right">
//                         <p className="text-lg font-bold text-[#3f3328]">₹{order.totalAmount}</p>
//                         <p className={`text-xs font-medium ${diff !== null && diff < -20 ? 'text-red-600' : 'text-[#b97844]'}`}>{latenessLabel}</p>
//                       </div>
//                     </div>

//                     <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
//                       <div className="bg-[#faf8f5] rounded-lg p-2">
//                         <p className="text-xs text-[#a0968c]">Scheduled Time</p>
//                         <p className="font-medium text-[#3f3328] text-sm">{formatWindow(order.scheduledTime)}</p>
//                       </div>
//                       <div className="bg-[#faf8f5] rounded-lg p-2">
//                         <p className="text-xs text-[#a0968c]">Order Type</p>
//                         <p className="font-medium text-[#3f3328] text-sm">{getPreOrderTypeLabel(order)}</p>
//                       </div>
//                     </div>

//                     {/* Table info for dine-in pre-orders */}
//                     {order.tableNumber && (
//                       <div className="mb-4 p-2 bg-purple-50 rounded-lg text-sm text-purple-700">
//                         🍽️ Table {order.tableNumber} • {order.guestCount || 2} guests
//                       </div>
//                     )}

//                     <div className="mb-4">
//                       <p className="text-xs text-[#a0968c] mb-1">Items ({order.items?.length || 0})</p>
//                       <div className="space-y-1">
//                         {order.items?.slice(0, 3).map((item, idx) => (
//                           <p key={idx} className="text-sm text-[#6b5f54]">{item.quantity} x {item.name}</p>
//                         ))}
//                         {order.items?.length > 3 && <p className="text-xs text-[#a0968c]">+{order.items.length - 3} more</p>}
//                       </div>
//                     </div>

//                     {order.specialNotes && (
//                       <div className="mb-4 p-2 bg-amber-50 rounded-lg text-sm text-amber-700">
//                         📝 Note: {order.specialNotes}
//                       </div>
//                     )}

//                     <div className="flex flex-wrap items-center gap-2 mt-3">
//                       {/* Claim Button */}
//                       {!order.assignedStaff && !isCompleted && (
//                         <button 
//                           onClick={() => claimMutation.mutate(order._id)} 
//                           disabled={claimMutation.isPending}
//                           className="flex-1 py-2 rounded-lg bg-[#b97844] text-white font-medium text-sm hover:bg-[#9e6538] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
//                         >
//                           {claimMutation.isPending ? 'Claiming...' : 'Claim Order'}
//                         </button>
//                       )}
                      
//                       {/* Status Update Button */}
//                       {nextStatus && !assignedToOther && !isCompleted && (
//                         <button 
//                           onClick={() => handleUpdateStatus(order, nextStatus)} 
//                           disabled={preparingLocked || updateMutation.isPending}
//                           className="flex-1 py-2 rounded-lg border border-[#b97844] text-[#b97844] font-medium text-sm hover:bg-[#b97844] hover:text-white transition-all disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-transparent disabled:hover:text-[#b97844]"
//                         >
//                           {updateMutation.isPending ? 'Updating...' : getPreOrderActionLabel(nextStatus)}
//                         </button>
//                       )}
                      
//                       {preparingLocked && (
//                         <p className="w-full text-xs text-amber-700">
//                           Preparation unlocks {getPreOrderPrepLeadMinutes(order)} minutes before the scheduled time.
//                         </p>
//                       )}
                      
//                       {/* View Details Button */}
//                       <button
//                         onClick={() => openOrderDetails(order)}
//                         className="p-2 rounded-lg border border-[#e8e0d6] text-[#6b5f54] hover:border-[#b97844] hover:text-[#b97844] transition-all"
//                         title="View Details"
//                         aria-label="View order details"
//                       >
//                         <Eye size={16} />
//                       </button>
                      
//                       {/* Print Receipt Button */}
//                       <button
//                         onClick={() => printReceipt(order)}
//                         className="p-2 rounded-lg border border-[#e8e0d6] text-[#6b5f54] hover:border-[#b97844] hover:text-[#b97844] transition-all"
//                         title="Print Receipt"
//                         aria-label="Print receipt"
//                       >
//                         <Printer size={16} />
//                       </button>
                      
//                       {/* Invoice Link */}
//                       {canOpenInvoice(order) && (
//                         <Link 
//                           to={`/invoice/${order._id}`} 
//                           target="_blank"
//                           className="flex-1 py-2 rounded-lg border border-[#e8e0d6] text-[#6b5f54] text-center text-sm font-medium hover:border-[#b97844] hover:text-[#b97844] transition-all"
//                         >
//                           View Invoice
//                         </Link>
//                       )}
                      
//                       {/* Delete Button for completed/cancelled orders */}
//                       {(canOpenInvoice(order) || order.status === 'cancelled') && (
//                         <button
//                           onClick={() => handleDeleteOrder(order)}
//                           disabled={deleteMutation.isPending}
//                           className="p-2 rounded-lg border border-red-200 text-red-500 hover:bg-red-50 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
//                           title="Delete Record"
//                           aria-label="Delete order"
//                         >
//                           <Trash2 size={16} />
//                         </button>
//                       )}
                      
//                       {assignedToOther && (
//                         <span className="text-sm text-[#a0968c]">Assigned to {order.assignedStaff?.name}</span>
//                       )}
//                     </div>
//                   </div>
//                 </div>
//               );
//             })}
//           </div>
//         )}
//       </div>

//       {/* Status Confirmation Dialog */}
//       {statusDialog && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4" role="dialog" aria-modal="true">
//           <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl">
//             <div className="border-b border-[#e8e0d6] p-5">
//               <h2 className="text-xl font-bold text-[#3f3328]">
//                 {statusDialog.source === 'reminder' ? 'Pre-order Confirmation Needed' : 'Confirm Status Update'}
//               </h2>
//               <p className="mt-1 text-sm text-[#6b5f54]">
//                 Order #{statusDialog.order.orderId || statusDialog.order._id.slice(-6)} for {statusDialog.order.guestName || statusDialog.order.customer?.name || 'Guest'}
//               </p>
//             </div>
//             <div className="space-y-3 p-5 text-sm text-[#6b5f54]">
//               <p>
//                 {statusDialog.source === 'reminder'
//                   ? 'This pre-order is close to its scheduled time. Do you want to confirm it now?'
//                   : `Move this pre-order from "${statusDialog.order.status}" to "${statusDialog.nextStatus}"?`}
//               </p>
//               <div className="rounded-xl bg-[#faf8f5] p-3">
//                 <p><span className="font-medium text-[#3f3328]">Scheduled:</span> {formatWindow(statusDialog.order.scheduledTime)}</p>
//                 <p><span className="font-medium text-[#3f3328]">Order type:</span> {getPreOrderTypeLabel(statusDialog.order)}</p>
//                 {statusDialog.nextStatus === 'preparing' && isPreparingLocked(statusDialog.order, statusDialog.nextStatus) && (
//                   <p className="mt-2 text-amber-700">
//                     ⚠️ Preparation becomes available {getPreOrderPrepLeadMinutes(statusDialog.order)} minutes before service time.
//                   </p>
//                 )}
//               </div>
//             </div>
//             <div className="flex justify-end gap-3 border-t border-[#e8e0d6] p-5">
//               <button
//                 onClick={() => setStatusDialog(null)}
//                 className="rounded-lg border border-[#e8e0d6] px-4 py-2 text-sm font-medium text-[#6b5f54] hover:bg-[#faf8f5] transition-all"
//                 autoFocus
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={confirmStatusUpdate}
//                 disabled={isPreparingLocked(statusDialog.order, statusDialog.nextStatus) || updateMutation.isPending}
//                 className="rounded-lg bg-[#b97844] px-4 py-2 text-sm font-medium text-white hover:bg-[#9e6538] transition-all disabled:cursor-not-allowed disabled:opacity-50"
//               >
//                 {updateMutation.isPending ? 'Updating...' : (statusDialog.source === 'reminder' ? 'Confirm Pre-order' : 'Yes, Continue')}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Order Details Modal */}
//       {showDetailsModal && selectedOrder && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4" role="dialog" aria-modal="true">
//           <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[85vh] overflow-hidden">
//             <div className="flex items-center justify-between p-5 border-b border-[#e8e0d6]">
//               <h2 className="font-bold text-xl text-[#3f3328]">Pre-Order Details</h2>
//               <button 
//                 onClick={() => setShowDetailsModal(false)} 
//                 className="p-1 hover:bg-gray-100 rounded-full transition-colors"
//                 aria-label="Close modal"
//               >
//                 <XCircle size={20} />
//               </button>
//             </div>
//             <div className="p-5 overflow-y-auto max-h-[calc(85vh-80px)] space-y-4">
//               <div className="grid grid-cols-2 gap-4">
//                 <div>
//                   <p className="text-xs text-[#a0968c]">Order ID</p>
//                   <p className="font-mono font-bold">#{selectedOrder.orderId}</p>
//                 </div>
//                 <div>
//                   <p className="text-xs text-[#a0968c]">Status</p>
//                   <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${statusStyles[selectedOrder.status]}`}>
//                     {selectedOrder.status}
//                   </span>
//                 </div>
//                 <div>
//                   <p className="text-xs text-[#a0968c]">Customer Name</p>
//                   <p className="font-medium">{selectedOrder.guestName || selectedOrder.customer?.name || 'Guest'}</p>
//                 </div>
//                 <div>
//                   <p className="text-xs text-[#a0968c]">Phone Number</p>
//                   <p>{selectedOrder.guestPhone || selectedOrder.customer?.phone || '-'}</p>
//                 </div>
//                 <div>
//                   <p className="text-xs text-[#a0968c]">Scheduled Time</p>
//                   <p>{formatWindow(selectedOrder.scheduledTime)}</p>
//                 </div>
//                 <div>
//                   <p className="text-xs text-[#a0968c]">Order Type</p>
//                   <p>{getPreOrderTypeLabel(selectedOrder)}</p>
//                 </div>
//                 {selectedOrder.tableNumber && (
//                   <>
//                     <div>
//                       <p className="text-xs text-[#a0968c]">Table Number</p>
//                       <p>{selectedOrder.tableNumber}</p>
//                     </div>
//                     <div>
//                       <p className="text-xs text-[#a0968c]">Guests</p>
//                       <p>{selectedOrder.guestCount || 2}</p>
//                     </div>
//                   </>
//                 )}
//                 <div>
//                   <p className="text-xs text-[#a0968c]">Payment Method</p>
//                   <p className="capitalize">{selectedOrder.paymentMethod || 'Not specified'}</p>
//                 </div>
//                 <div>
//                   <p className="text-xs text-[#a0968c]">Total Amount</p>
//                   <p className="font-bold text-[#b97844]">₹{selectedOrder.totalAmount}</p>
//                 </div>
//               </div>
              
//               <div>
//                 <p className="text-xs text-[#a0968c] mb-2">Order Items</p>
//                 <div className="space-y-2">
//                   {selectedOrder.items?.map((item, idx) => (
//                     <div key={idx} className="flex justify-between py-2 border-b border-[#e8e0d6]">
//                       <div>
//                         <p className="font-medium">{item.name}</p>
//                         <p className="text-xs text-[#6b5f54]">Quantity: {item.quantity}</p>
//                         {item.instructions && (
//                           <p className="text-xs text-[#a0968c]">Note: {item.instructions}</p>
//                         )}
//                       </div>
//                       <p className="font-semibold">₹{item.totalPrice || item.unitPrice * item.quantity}</p>
//                     </div>
//                   ))}
//                 </div>
//               </div>
              
//               {selectedOrder.specialNotes && (
//                 <div className="p-3 bg-amber-50 rounded-lg">
//                   <p className="text-xs text-[#a0968c]">Special Notes</p>
//                   <p className="text-sm text-amber-700">{selectedOrder.specialNotes}</p>
//                 </div>
//               )}

//               {selectedOrder.assignedStaff && (
//                 <div className="p-3 bg-blue-50 rounded-lg">
//                   <p className="text-xs text-[#a0968c]">Assigned Staff</p>
//                   <p className="text-sm text-blue-700">{selectedOrder.assignedStaff.name}</p>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

import { useEffect, useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { 
  CalendarDays, Clock3, Filter, Hand, Receipt, RefreshCw, 
  ShoppingBag, Table2, Truck, CheckCircle, XCircle, ChefHat, 
  Search, Phone, User, Eye, Edit, Trash2, Printer 
} from 'lucide-react';
import { useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import api from '../../services/api';

const PREORDER_STATUSES = ['all', 'placed', 'confirmed', 'preparing', 'ready', 'completed', 'cancelled'];

const statusStyles = {
  placed: 'bg-amber-100 text-amber-700',
  confirmed: 'bg-blue-100 text-blue-700',
  preparing: 'bg-orange-100 text-orange-700',
  ready: 'bg-emerald-100 text-emerald-700',
  completed: 'bg-green-100 text-green-700',
  delivered: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
};

const statusOrder = ['placed', 'confirmed', 'preparing', 'ready', 'completed'];

function minutesUntil(value) {
  if (!value) return null;
  return Math.round((new Date(value).getTime() - Date.now()) / 60000);
}

function formatWindow(value) {
  if (!value) return 'No schedule';
  return new Date(value).toLocaleString();
}

function nextPreOrderStatus(status) {
  const index = statusOrder.indexOf(status);
  return index >= 0 ? statusOrder[index + 1] || null : null;
}

function getPreOrderActionLabel(nextStatus) {
  const labels = {
    confirmed: 'Confirm Order',
    preparing: 'Start Preparing',
    ready: 'Mark Ready',
    completed: 'Complete Order'
  };
  return labels[nextStatus] || `Mark as ${nextStatus}`;
}

function canOpenInvoice(order) {
  return ['completed', 'delivered'].includes(String(order?.status || '').toLowerCase());
}

function getPreOrderTypeLabel(order) {
  if (order?.preOrderMethod === 'delivery') return 'Pre-Order Delivery';
  if (order?.preOrderMethod === 'takeaway') return 'Pre-Order Takeaway';
  if (order?.preOrderMethod === 'dine-in') return 'Pre-Order Dine-In';
  return 'Pre-Order';
}

function getPreOrderPrepLeadMinutes(order) {
  return order?.preOrderMethod === 'delivery' ? 30 : 15;
}

function isPreparingLocked(order, nextStatus) {
  if (nextStatus !== 'preparing' || !order?.scheduledTime) return false;
  const diff = minutesUntil(order.scheduledTime);
  return diff !== null && diff > getPreOrderPrepLeadMinutes(order);
}

export default function PreOrders() {
  const queryClient = useQueryClient();
  const { user } = useSelector((state) => state.auth);
  const [statusFilter, setStatusFilter] = useState('all');
  const [timeFilter, setTimeFilter] = useState('upcoming');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [statusDialog, setStatusDialog] = useState(null);
  const [deleteDialog, setDeleteDialog] = useState(null);
  const [seenReminderIds, setSeenReminderIds] = useState([]);

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['staff-preorders'],
    queryFn: () => api.get('/orders', { params: { limit: 100 } }).then((res) => res.data),
    refetchInterval: 20000,
  });

  const claimMutation = useMutation({
    mutationFn: (orderId) => api.put(`/orders/${orderId}/assign-staff`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['staff-preorders'] });
      toast.success('Pre-order claimed successfully');
    },
    onError: (error) => toast.error(error.response?.data?.message || 'Could not claim pre-order'),
  });

  const updateMutation = useMutation({
    mutationFn: ({ orderId, status }) => api.put(`/orders/${orderId}/status`, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['staff-preorders'] });
      toast.success('Pre-order status updated successfully');
    },
    onError: (error) => {
      const message = error.response?.data?.message || 'Could not update pre-order';
      toast.error(message);
      if (error.response?.status === 409) {
        queryClient.invalidateQueries({ queryKey: ['staff-preorders'] });
      }
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (orderId) => {
      // Try to delete using the orders endpoint (which has proper role checks)
      // The route DELETE /orders/:id is available for staff, admin, manager
      return await api.delete(`/orders/${orderId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['staff-preorders'] });
      toast.success('Pre-order deleted successfully');
      setShowDetailsModal(false);
      setSelectedOrder(null);
      setDeleteDialog(null);
    },
    onError: (error) => {
      console.error('Delete error:', error);
      const message = error.response?.data?.message || 'Could not delete pre-order';
      toast.error(message);
    },
  });

  const handleDeleteOrder = (order) => {
    if (!order?._id) {
      toast.error('Invalid order ID');
      return;
    }

    setDeleteDialog(order);
  };

  const confirmDeleteOrder = () => {
    if (!deleteDialog?._id) return;

    toast.loading('Deleting pre-order...', { id: 'delete-order' });
    deleteMutation.mutate(deleteDialog._id, {
      onSettled: () => {
        toast.dismiss('delete-order');
      }
    });
  };

  const handleUpdateStatus = (order, nextStatus) => {
    if (!nextStatus) return;
    setStatusDialog({ order, nextStatus, source: 'manual' });
  };

  const orders = useMemo(() => {
    const rows = (data?.orders || []).filter((order) => 
      Boolean(order.isPreOrder) || order.orderType === 'pre-order'
    );
    
    let filtered = rows
      .filter((order) => (statusFilter === 'all' ? true : order.status === statusFilter))
      .filter((order) => {
        const diff = minutesUntil(order.scheduledTime);
        if (timeFilter === 'all' || diff === null) return true;
        if (timeFilter === 'upcoming') return diff >= -20;
        if (timeFilter === 'soon') return diff >= 0 && diff <= 90;
        if (timeFilter === 'late') return diff < -20 && !['completed', 'delivered', 'cancelled'].includes(order.status);
        return true;
      });
    
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter((order) =>
        (order.orderId || '').toLowerCase().includes(term) ||
        (order.guestName || order.customer?.name || '').toLowerCase().includes(term) ||
        (order.guestPhone || order.customer?.phone || '').toLowerCase().includes(term)
      );
    }
    
    return filtered.sort((a, b) => 
      new Date(a.scheduledTime || a.createdAt) - new Date(b.scheduledTime || b.createdAt)
    );
  }, [data?.orders, statusFilter, timeFilter, searchTerm]);

  const upcomingCount = orders.filter((order) => {
    const diff = minutesUntil(order.scheduledTime);
    return diff !== null && diff >= 0 && diff <= 60;
  }).length;

  const mineCount = orders.filter((order) => order.assignedStaff?._id === user?._id).length;

  useEffect(() => {
    if (statusDialog) return;

    const dueSoonOrder = orders.find((order) => {
      const diff = minutesUntil(order.scheduledTime);
      return (
        String(order.status || '').toLowerCase() === 'placed'
        && diff !== null
        && diff >= 0
        && diff <= 15
        && !seenReminderIds.includes(order._id)
      );
    });

    if (dueSoonOrder) {
      setSeenReminderIds((prev) => [...prev, dueSoonOrder._id]);
      setStatusDialog({ order: dueSoonOrder, nextStatus: 'confirmed', source: 'reminder' });
    }
  }, [orders, seenReminderIds, statusDialog]);

  const confirmStatusUpdate = async () => {
    if (!statusDialog?.order || !statusDialog?.nextStatus) return;
    const { order, nextStatus } = statusDialog;

    if (isPreparingLocked(order, nextStatus)) {
      toast.error(`Cannot mark as preparing yet. ${getPreOrderPrepLeadMinutes(order)} minutes before scheduled time.`);
      setStatusDialog(null);
      return;
    }

    try {
      if (!order.assignedStaff && nextStatus === 'confirmed') {
        await claimMutation.mutateAsync(order._id);
      }
      await updateMutation.mutateAsync({ orderId: order._id, status: nextStatus });
      setStatusDialog(null);
    } catch (error) {
      console.error('Status update failed:', error);
    }
  };

  const openOrderDetails = (order) => {
    setSelectedOrder(order);
    setShowDetailsModal(true);
  };

  const printReceipt = (order) => {
    const printWindow = window.open('', '_blank');
    const formattedDate = new Date().toLocaleString();
    
    printWindow.document.write(`
      <html>
        <head>
          <title>Pre-Order Receipt ${order.orderId}</title>
          <style>
            body {
              font-family: 'Courier New', monospace;
              padding: 20px;
              margin: 0;
            }
            .header {
              text-align: center;
              border-bottom: 1px dashed #000;
              margin-bottom: 20px;
              padding-bottom: 10px;
            }
            .order-details {
              margin: 20px 0;
            }
            .items {
              width: 100%;
              margin: 20px 0;
            }
            .items th, .items td {
              text-align: left;
              padding: 5px 0;
            }
            .total {
              border-top: 1px dashed #000;
              margin-top: 20px;
              padding-top: 10px;
              font-weight: bold;
              text-align: right;
            }
            .footer {
              text-align: center;
              margin-top: 30px;
              font-size: 12px;
              border-top: 1px dashed #000;
              padding-top: 10px;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h2>Roller Coaster Cafe</h2>
            <p>Pre-Order Receipt</p>
            <p>${formattedDate}</p>
          </div>
          
          <div class="order-details">
            <p><strong>Order ID:</strong> ${order.orderId}</p>
            <p><strong>Customer:</strong> ${order.guestName || order.customer?.name || 'Guest'}</p>
            <p><strong>Phone:</strong> ${order.guestPhone || order.customer?.phone || '-'}</p>
            <p><strong>Scheduled:</strong> ${formatWindow(order.scheduledTime)}</p>
            <p><strong>Type:</strong> ${getPreOrderTypeLabel(order)}</p>
            <p><strong>Status:</strong> ${order.status}</p>
          </div>
          
          <table class="items">
            <thead>
              <tr><th>Item</th><th>Qty</th><th>Price</th></tr>
            </thead>
            <tbody>
              ${order.items?.map(item => `
                <tr>
                  <td>${item.name}</td>
                  <td>${item.quantity}</td>
                  <td>₹${item.totalPrice || item.unitPrice * item.quantity}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          
          <div class="total">
            <p>Total: ₹${order.totalAmount}</p>
          </div>
          
          ${order.specialNotes ? `<div class="notes"><p><strong>Notes:</strong> ${order.specialNotes}</p></div>` : ''}
          
          <div class="footer">
            <p>Thank you for choosing Roller Coaster Cafe!</p>
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  return (
    <div className="min-h-screen bg-[#faf8f5]">
      {/* Header */}
      <header className="bg-white border-b border-[#e8e0d6] sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="font-display text-2xl font-bold text-[#3f3328]">Pre-Orders Management</h1>
              <p className="text-sm text-[#6b5f54]">Manage and track scheduled customer orders</p>
            </div>
            <div className="flex items-center gap-3">
              <Link to="/staff" className="inline-flex items-center gap-2 rounded-lg border border-[#e8e0d6] bg-white px-4 py-2 text-sm font-medium text-[#6b5f54] hover:border-[#b97844] hover:text-[#b97844] transition-all">
                Back to Dashboard
              </Link>
              <button 
                onClick={() => refetch()} 
                className="p-2 rounded-lg border border-[#e8e0d6] bg-white hover:bg-[#faf8f5] transition-all"
                aria-label="Refresh pre-orders"
              >
                <RefreshCw size={16} className="text-[#6b5f54]" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
          <div className="bg-white border border-[#e8e0d6] rounded-xl p-4">
            <p className="text-xs text-[#6b5f54] uppercase tracking-wide">Total Pre-Orders</p>
            <p className="text-2xl font-bold text-[#3f3328]">{orders.length}</p>
          </div>
          <div className="bg-white border border-[#e8e0d6] rounded-xl p-4">
            <p className="text-xs text-[#6b5f54] uppercase tracking-wide">Due in 60 min</p>
            <p className="text-2xl font-bold text-[#3f3328]">{upcomingCount}</p>
          </div>
          <div className="bg-white border border-[#e8e0d6] rounded-xl p-4">
            <p className="text-xs text-[#6b5f54] uppercase tracking-wide">Claimed by Me</p>
            <p className="text-2xl font-bold text-[#3f3328]">{mineCount}</p>
          </div>
          <div className="bg-white border border-[#e8e0d6] rounded-xl p-4">
            <p className="text-xs text-[#6b5f54] uppercase tracking-wide">Ready</p>
            <p className="text-2xl font-bold text-[#3f3328]">{orders.filter(o => o.status === 'ready').length}</p>
          </div>
          <div className="bg-white border border-[#e8e0d6] rounded-xl p-4">
            <p className="text-xs text-[#6b5f54] uppercase tracking-wide">Completed</p>
            <p className="text-2xl font-bold text-[#3f3328]">{orders.filter(o => o.status === 'completed').length}</p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white border border-[#e8e0d6] rounded-xl p-4 mb-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap gap-2">
              {PREORDER_STATUSES.map((status) => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    statusFilter === status ? 'bg-[#b97844] text-white' : 'bg-[#faf8f5] text-[#6b5f54] hover:bg-[#e8e0d6]'
                  }`}
                  aria-label={`Filter by ${status}`}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-3">
              <select 
                value={timeFilter} 
                onChange={(e) => setTimeFilter(e.target.value)} 
                className="rounded-lg border border-[#e8e0d6] px-4 py-2 text-sm focus:border-[#b97844] focus:outline-none"
                aria-label="Time filter"
              >
                <option value="upcoming">Upcoming + Recent</option>
                <option value="soon">Due Soon (60 min)</option>
                <option value="late">Running Late</option>
                <option value="all">All Scheduled</option>
              </select>
              <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#a0968c]" />
                <input 
                  type="text" 
                  value={searchTerm} 
                  onChange={(e) => setSearchTerm(e.target.value)} 
                  placeholder="Search by ID, name, phone..." 
                  className="pl-9 pr-4 py-2 rounded-lg border border-[#e8e0d6] text-sm focus:border-[#b97844] focus:outline-none w-64" 
                  aria-label="Search orders"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Pre-Orders List */}
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3, 4].map(i => <div key={i} className="bg-white border border-[#e8e0d6] rounded-xl p-5 animate-pulse h-32" />)}
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-white border border-[#e8e0d6] rounded-xl p-12 text-center">
            <CalendarDays size={48} className="mx-auto text-[#a0968c] mb-4" />
            <h2 className="text-xl font-semibold text-[#3f3328] mb-2">No pre-orders found</h2>
            <p className="text-[#6b5f54]">No scheduled orders match your filters.</p>
          </div>
        ) : (
          <div className="grid lg:grid-cols-2 gap-4">
            {orders.map((order) => {
              const nextStatus = nextPreOrderStatus(order.status);
              const diff = minutesUntil(order.scheduledTime);
              const preparingLocked = isPreparingLocked(order, nextStatus);
              const assignedToMe = order.assignedStaff?._id === user?._id;
              const assignedToOther = !!order.assignedStaff && !assignedToMe;
              const latenessLabel = diff === null ? 'No schedule' : diff >= 0 ? `Due in ${diff} min` : `${Math.abs(diff)} min past due`;
              const isCompleted = ['completed', 'delivered'].includes(order.status);

              return (
                <div key={order._id} className="bg-white border border-[#e8e0d6] rounded-xl overflow-hidden hover:shadow-md transition-all">
                  <div className="p-5">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="font-mono text-sm font-bold text-[#3f3328]">#{order.orderId || order._id.slice(-6)}</p>
                          <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${statusStyles[order.status] || 'bg-gray-100 text-gray-700'}`}>
                            {order.status}
                          </span>
                        </div>
                        <p className="text-sm font-medium text-[#3f3328] mt-2">{order.guestName || order.customer?.name || 'Guest'}</p>
                        {order.guestPhone && (
                          <p className="text-xs text-[#6b5f54] flex items-center gap-1 mt-1">
                            <Phone size={12} /> {order.guestPhone}
                          </p>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-[#3f3328]">₹{order.totalAmount}</p>
                        <p className={`text-xs font-medium ${diff !== null && diff < -20 ? 'text-red-600' : 'text-[#b97844]'}`}>{latenessLabel}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
                      <div className="bg-[#faf8f5] rounded-lg p-2">
                        <p className="text-xs text-[#a0968c]">Scheduled Time</p>
                        <p className="font-medium text-[#3f3328] text-sm">{formatWindow(order.scheduledTime)}</p>
                      </div>
                      <div className="bg-[#faf8f5] rounded-lg p-2">
                        <p className="text-xs text-[#a0968c]">Order Type</p>
                        <p className="font-medium text-[#3f3328] text-sm">{getPreOrderTypeLabel(order)}</p>
                      </div>
                    </div>

                    {/* Table info for dine-in pre-orders */}
                    {order.tableNumber && (
                      <div className="mb-4 p-2 bg-purple-50 rounded-lg text-sm text-purple-700">
                        🍽️ Table {order.tableNumber} • {order.guestCount || 2} guests
                      </div>
                    )}

                    <div className="mb-4">
                      <p className="text-xs text-[#a0968c] mb-1">Items ({order.items?.length || 0})</p>
                      <div className="space-y-1">
                        {order.items?.slice(0, 3).map((item, idx) => (
                          <p key={idx} className="text-sm text-[#6b5f54]">{item.quantity} x {item.name}</p>
                        ))}
                        {order.items?.length > 3 && <p className="text-xs text-[#a0968c]">+{order.items.length - 3} more</p>}
                      </div>
                    </div>

                    {order.specialNotes && (
                      <div className="mb-4 p-2 bg-amber-50 rounded-lg text-sm text-amber-700">
                        📝 Note: {order.specialNotes}
                      </div>
                    )}

                    <div className="flex flex-wrap items-center gap-2 mt-3">
                      {/* Claim Button */}
                      {!order.assignedStaff && !isCompleted && (
                        <button 
                          onClick={() => claimMutation.mutate(order._id)} 
                          disabled={claimMutation.isPending}
                          className="flex-1 py-2 rounded-lg bg-[#b97844] text-white font-medium text-sm hover:bg-[#9e6538] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {claimMutation.isPending ? 'Claiming...' : 'Claim Order'}
                        </button>
                      )}
                      
                      {/* Status Update Button */}
                      {nextStatus && !assignedToOther && !isCompleted && (
                        <button 
                          onClick={() => handleUpdateStatus(order, nextStatus)} 
                          disabled={preparingLocked || updateMutation.isPending}
                          className="flex-1 py-2 rounded-lg border border-[#b97844] text-[#b97844] font-medium text-sm hover:bg-[#b97844] hover:text-white transition-all disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-transparent disabled:hover:text-[#b97844]"
                        >
                          {updateMutation.isPending ? 'Updating...' : getPreOrderActionLabel(nextStatus)}
                        </button>
                      )}
                      
                      {preparingLocked && (
                        <p className="w-full text-xs text-amber-700">
                          Preparation unlocks {getPreOrderPrepLeadMinutes(order)} minutes before the scheduled time.
                        </p>
                      )}
                      
                      {/* View Details Button */}
                      <button
                        onClick={() => openOrderDetails(order)}
                        className="p-2 rounded-lg border border-[#e8e0d6] text-[#6b5f54] hover:border-[#b97844] hover:text-[#b97844] transition-all"
                        title="View Details"
                        aria-label="View order details"
                      >
                        <Eye size={16} />
                      </button>
                      
                      {/* Print Receipt Button */}
                      <button
                        onClick={() => printReceipt(order)}
                        className="p-2 rounded-lg border border-[#e8e0d6] text-[#6b5f54] hover:border-[#b97844] hover:text-[#b97844] transition-all"
                        title="Print Receipt"
                        aria-label="Print receipt"
                      >
                        <Printer size={16} />
                      </button>
                      
                      {/* Invoice Link */}
                      {canOpenInvoice(order) && (
                        <Link 
                          to={`/invoice/${order._id}`} 
                          target="_blank"
                          className="flex-1 py-2 rounded-lg border border-[#e8e0d6] text-[#6b5f54] text-center text-sm font-medium hover:border-[#b97844] hover:text-[#b97844] transition-all"
                        >
                          View Invoice
                        </Link>
                      )}
                      
                      {/* Delete Button for completed/cancelled orders */}
                      {(canOpenInvoice(order) || order.status === 'cancelled') && (
                        <button
                          onClick={() => handleDeleteOrder(order)}
                          disabled={deleteMutation.isPending}
                          className="p-2 rounded-lg border border-red-200 text-red-500 hover:bg-red-50 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                          title="Delete Record"
                          aria-label="Delete order"
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                      
                      {assignedToOther && (
                        <span className="text-sm text-[#a0968c]">Assigned to {order.assignedStaff?.name}</span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Status Confirmation Dialog */}
      {statusDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4" role="dialog" aria-modal="true">
          <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl">
            <div className="border-b border-[#e8e0d6] p-5">
              <h2 className="text-xl font-bold text-[#3f3328]">
                {statusDialog.source === 'reminder' ? 'Pre-order Confirmation Needed' : 'Confirm Status Update'}
              </h2>
              <p className="mt-1 text-sm text-[#6b5f54]">
                Order #{statusDialog.order.orderId || statusDialog.order._id.slice(-6)} for {statusDialog.order.guestName || statusDialog.order.customer?.name || 'Guest'}
              </p>
            </div>
            <div className="space-y-3 p-5 text-sm text-[#6b5f54]">
              <p>
                {statusDialog.source === 'reminder'
                  ? 'This pre-order is close to its scheduled time. Do you want to confirm it now?'
                  : `Move this pre-order from "${statusDialog.order.status}" to "${statusDialog.nextStatus}"?`}
              </p>
              <div className="rounded-xl bg-[#faf8f5] p-3">
                <p><span className="font-medium text-[#3f3328]">Scheduled:</span> {formatWindow(statusDialog.order.scheduledTime)}</p>
                <p><span className="font-medium text-[#3f3328]">Order type:</span> {getPreOrderTypeLabel(statusDialog.order)}</p>
                {statusDialog.nextStatus === 'preparing' && isPreparingLocked(statusDialog.order, statusDialog.nextStatus) && (
                  <p className="mt-2 text-amber-700">
                    ⚠️ Preparation becomes available {getPreOrderPrepLeadMinutes(statusDialog.order)} minutes before service time.
                  </p>
                )}
              </div>
            </div>
            <div className="flex justify-end gap-3 border-t border-[#e8e0d6] p-5">
              <button
                onClick={() => setStatusDialog(null)}
                className="rounded-lg border border-[#e8e0d6] px-4 py-2 text-sm font-medium text-[#6b5f54] hover:bg-[#faf8f5] transition-all"
                autoFocus
              >
                Cancel
              </button>
              <button
                onClick={confirmStatusUpdate}
                disabled={isPreparingLocked(statusDialog.order, statusDialog.nextStatus) || updateMutation.isPending}
                className="rounded-lg bg-[#b97844] px-4 py-2 text-sm font-medium text-white hover:bg-[#9e6538] transition-all disabled:cursor-not-allowed disabled:opacity-50"
              >
                {updateMutation.isPending ? 'Updating...' : (statusDialog.source === 'reminder' ? 'Confirm Pre-order' : 'Yes, Continue')}
              </button>
            </div>
          </div>
        </div>
      )}

      {deleteDialog && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4" role="dialog" aria-modal="true">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-xl font-bold text-[#3f3328]">Delete Pre-Order?</h3>
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
                <XCircle size={20} />
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
                disabled={deleteMutation.isPending}
                className="rounded-lg bg-red-500 px-4 py-2 text-sm font-medium text-white hover:bg-red-600 transition-all disabled:cursor-not-allowed disabled:opacity-50"
              >
                {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Order Details Modal */}
      {showDetailsModal && selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4" role="dialog" aria-modal="true">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[85vh] overflow-hidden">
            <div className="flex items-center justify-between p-5 border-b border-[#e8e0d6]">
              <h2 className="font-bold text-xl text-[#3f3328]">Pre-Order Details</h2>
              <button 
                onClick={() => setShowDetailsModal(false)} 
                className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                aria-label="Close modal"
              >
                <XCircle size={20} />
              </button>
            </div>
            <div className="p-5 overflow-y-auto max-h-[calc(85vh-80px)] space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-[#a0968c]">Order ID</p>
                  <p className="font-mono font-bold">#{selectedOrder.orderId}</p>
                </div>
                <div>
                  <p className="text-xs text-[#a0968c]">Status</p>
                  <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${statusStyles[selectedOrder.status]}`}>
                    {selectedOrder.status}
                  </span>
                </div>
                <div>
                  <p className="text-xs text-[#a0968c]">Customer Name</p>
                  <p className="font-medium">{selectedOrder.guestName || selectedOrder.customer?.name || 'Guest'}</p>
                </div>
                <div>
                  <p className="text-xs text-[#a0968c]">Phone Number</p>
                  <p>{selectedOrder.guestPhone || selectedOrder.customer?.phone || '-'}</p>
                </div>
                <div>
                  <p className="text-xs text-[#a0968c]">Scheduled Time</p>
                  <p>{formatWindow(selectedOrder.scheduledTime)}</p>
                </div>
                <div>
                  <p className="text-xs text-[#a0968c]">Order Type</p>
                  <p>{getPreOrderTypeLabel(selectedOrder)}</p>
                </div>
                {selectedOrder.tableNumber && (
                  <>
                    <div>
                      <p className="text-xs text-[#a0968c]">Table Number</p>
                      <p>{selectedOrder.tableNumber}</p>
                    </div>
                    <div>
                      <p className="text-xs text-[#a0968c]">Guests</p>
                      <p>{selectedOrder.guestCount || 2}</p>
                    </div>
                  </>
                )}
                <div>
                  <p className="text-xs text-[#a0968c]">Payment Method</p>
                  <p className="capitalize">{selectedOrder.paymentMethod || 'Not specified'}</p>
                </div>
                <div>
                  <p className="text-xs text-[#a0968c]">Total Amount</p>
                  <p className="font-bold text-[#b97844]">₹{selectedOrder.totalAmount}</p>
                </div>
              </div>
              
              <div>
                <p className="text-xs text-[#a0968c] mb-2">Order Items</p>
                <div className="space-y-2">
                  {selectedOrder.items?.map((item, idx) => (
                    <div key={idx} className="flex justify-between py-2 border-b border-[#e8e0d6]">
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-xs text-[#6b5f54]">Quantity: {item.quantity}</p>
                        {item.instructions && (
                          <p className="text-xs text-[#a0968c]">Note: {item.instructions}</p>
                        )}
                      </div>
                      <p className="font-semibold">₹{item.totalPrice || item.unitPrice * item.quantity}</p>
                    </div>
                  ))}
                </div>
              </div>
              
              {selectedOrder.specialNotes && (
                <div className="p-3 bg-amber-50 rounded-lg">
                  <p className="text-xs text-[#a0968c]">Special Notes</p>
                  <p className="text-sm text-amber-700">{selectedOrder.specialNotes}</p>
                </div>
              )}

              {selectedOrder.assignedStaff && (
                <div className="p-3 bg-blue-50 rounded-lg">
                  <p className="text-xs text-[#a0968c]">Assigned Staff</p>
                  <p className="text-sm text-blue-700">{selectedOrder.assignedStaff.name}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
