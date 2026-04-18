// // import { useMemo, useState } from 'react';
// // import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
// // import { Link } from 'react-router-dom';
// // import { motion } from 'framer-motion';
// // import { CalendarDays, ChevronLeft, ChevronRight, Download, ShoppingBag, Table2, Truck, Clock, MapPin, Phone, Mail, User } from 'lucide-react';
// // import api from '../../services/api';
// // import CustomerFooter from '../../components/customer/CustomerFooter';

// // const RUPEE = String.fromCharCode(8377);
// // const ITEMS_PER_PAGE = 5;

// // const ORDER_TYPE_META = {
// //   delivery: { icon: Truck, label: 'Delivery', color: 'bg-sky-50 text-sky-600' },
// //   takeaway: { icon: ShoppingBag, label: 'Takeaway', color: 'bg-violet-50 text-violet-600' },
// //   'dine-in': { icon: Table2, label: 'Dine-In', color: 'bg-emerald-50 text-emerald-600' },
// //   'pre-order': { icon: CalendarDays, label: 'Pre-Order', color: 'bg-orange-50 text-orange-600' },
// // };

// // const STATUS_META = {
// //   placed: { label: 'Placed', color: 'bg-amber-50 text-amber-600' },
// //   confirmed: { label: 'Confirmed', color: 'bg-blue-50 text-blue-600' },
// //   preparing: { label: 'Preparing', color: 'bg-orange-50 text-orange-600' },
// //   ready: { label: 'Ready', color: 'bg-emerald-50 text-emerald-600' },
// //   'out-for-delivery': { label: 'Out for Delivery', color: 'bg-indigo-50 text-indigo-600' },
// //   delivered: { label: 'Delivered', color: 'bg-green-50 text-green-600' },
// //   completed: { label: 'Completed', color: 'bg-green-50 text-green-600' },
// //   cancelled: { label: 'Cancelled', color: 'bg-red-50 text-red-600' },
// // };

// // const FILTER_OPTIONS = [
// //   { value: 'all', label: 'All' },
// //   { value: 'delivery', label: 'Online Orders' },
// //   { value: 'takeaway', label: 'Takeaway' },
// //   { value: 'dine-in', label: 'Dine-In' },
// //   { value: 'pre-order', label: 'Pre-Order' },
// // ];

// // const getOrderTypeMeta = (order) => {
// //   if (order?.isPreOrder) {
// //     if (order.preOrderMethod === 'delivery') {
// //       return { icon: CalendarDays, label: 'Pre-Order Delivery', color: 'bg-orange-50 text-orange-600' };
// //     }
// //     if (order.preOrderMethod === 'takeaway') {
// //       return { icon: CalendarDays, label: 'Pre-Order Takeaway', color: 'bg-orange-50 text-orange-600' };
// //     }
// //     if (order.preOrderMethod === 'dine-in') {
// //       return { icon: CalendarDays, label: 'Pre-Order Dine-In', color: 'bg-orange-50 text-orange-600' };
// //     }
// //     return ORDER_TYPE_META['pre-order'];
// //   }
// //   return ORDER_TYPE_META[order?.orderType] || ORDER_TYPE_META.delivery;
// // };

// // export default function OrderHistoryPage() {
// //   const queryClient = useQueryClient();
// //   const [filter, setFilter] = useState('all');
// //   const [currentPage, setCurrentPage] = useState(1);

// //   const { data: orders = [], isLoading, error, refetch } = useQuery({
// //     queryKey: ['customer-orders'],
// //     queryFn: async () => {
// //       const res = await api.get('/orders/my');
// //       return Array.isArray(res.data) ? res.data : [];
// //     },
// //   });

// //   const filteredOrders = useMemo(() => {
// //     if (filter === 'all') return orders;
// //     return orders.filter((order) => {
// //       if (filter === 'pre-order') return Boolean(order?.isPreOrder);
// //       return order?.orderType === filter && !order?.isPreOrder;
// //     });
// //   }, [orders, filter]);

// //   const totalPages = Math.max(1, Math.ceil(filteredOrders.length / ITEMS_PER_PAGE));

// //   const paginatedOrders = useMemo(() => {
// //     const start = (currentPage - 1) * ITEMS_PER_PAGE;
// //     return filteredOrders.slice(start, start + ITEMS_PER_PAGE);
// //   }, [filteredOrders, currentPage]);

// //   const formatCurrency = (value) => `₹${Number(value || 0).toLocaleString('en-IN')}`;
  
// //   const formatDate = (value) =>
// //     new Date(value).toLocaleString('en-IN', {
// //       day: '2-digit',
// //       month: 'short',
// //       year: 'numeric',
// //       hour: '2-digit',
// //       minute: '2-digit',
// //     });

// //   const getTrackingPath = (order) => {
// //     if (!order?._id) return '/orders';
// //     if (order?.isPreOrder) {
// //       if (order.preOrderMethod === 'delivery') return `/track-delivery/${order._id}`;
// //       if (order.preOrderMethod === 'takeaway') return `/track-takeaway/${order._id}`;
// //       if (order.preOrderMethod === 'dine-in') return `/track-dinein/${order._id}`;
// //       return `/track-preorder/${order._id}`;
// //     }
// //     if (order.orderType === 'delivery') return `/track-delivery/${order._id}`;
// //     if (order.orderType === 'takeaway') return `/track-takeaway/${order._id}`;
// //     if (order.orderType === 'dine-in') return `/track-dinein/${order._id}`;
// //     if (order.orderType === 'pre-order') {
// //       const notes = String(order.specialNotes || '').toLowerCase();
// //       if (notes.includes('pre-order type: delivery')) return `/track-delivery/${order._id}`;
// //       if (notes.includes('pre-order type: takeaway')) return `/track-takeaway/${order._id}`;
// //       if (notes.includes('pre-order type: dine-in')) return `/track-dinein/${order._id}`;
// //       return `/track-preorder/${order._id}`;
// //     }
// //     return `/track/${order._id}`;
// //   };

// //   const handleFilterChange = (value) => {
// //     setFilter(value);
// //     setCurrentPage(1);
// //   };

// //   const canDownloadInvoice = (order) => ['delivered', 'completed'].includes(String(order?.status || '').toLowerCase());
// //   const canDeleteOrder = (order) => ['delivered', 'completed', 'cancelled'].includes(String(order?.status || '').toLowerCase());

// //   const deleteOrderMutation = useMutation({
// //     mutationFn: (orderId) => api.delete(`/orders/${orderId}`),
// //     onSuccess: () => {
// //       queryClient.invalidateQueries({ queryKey: ['customer-orders'] });
// //       setCurrentPage(1);
// //     },
// //   });

// //   const handleDeleteOrder = async (order) => {
// //     if (!order?._id) return;
// //     const confirmed = window.confirm(`Delete order ${order.orderId || order._id.slice(-8).toUpperCase()} from your history?`);
// //     if (!confirmed) return;
// //     try {
// //       await deleteOrderMutation.mutateAsync(order._id);
// //     } catch (err) {
// //       window.alert(err.response?.data?.message || 'Could not delete this order');
// //     }
// //   };

// //   return (
// //     <div className="min-h-screen bg-white">
// //       {/* Header - Matching other pages */}
// //       <header className="border-b border-gray-100 bg-white sticky top-0 z-50">
// //         <div className="max-w-6xl mx-auto px-4 py-3">
// //           <div className="flex items-center justify-between">
// //             <Link to="/dashboard" className="flex items-center gap-2">
// //               <img 
// //                 src="https://rollercoastercafe.com/assets/images/roller_logo.png" 
// //                 alt="Roller Coaster Cafe Logo"
// //                 className="h-8 w-8 rounded-full object-cover"
// //                 onError={(e) => {
// //                   e.target.src = '/logo.png';
// //                 }}
// //               />
// //               <span className="font-semibold text-lg text-gray-800">Roller Coaster Cafe</span>
// //             </Link>

// //             <nav className="hidden md:flex items-center gap-6">
// //               <Link to="/dashboard" className="text-sm text-gray-500 hover:text-amber-600">Home</Link>
// //               <Link to="/menu" className="text-sm text-gray-500 hover:text-amber-600">Menu</Link>
// //               <Link to="/orders" className="text-sm text-amber-600 font-medium">Orders</Link>
// //               <Link to="/profile" className="text-sm text-gray-500 hover:text-amber-600">Profile</Link>
// //               <Link to="/settings" className="text-sm text-gray-500 hover:text-amber-600">Settings</Link>
// //             </nav>
// //           </div>
// //         </div>
// //       </header>

// //       <main className="max-w-6xl mx-auto px-4 py-8">
// //         {/* Page Header */}
// //         <div className="mb-8">
// //           <div className="flex items-center justify-between flex-wrap gap-4">
// //             <div>
// //               <h1 className="text-3xl font-bold text-gray-800">My Orders</h1>
// //               <p className="text-sm text-gray-500 mt-1">Track completed, upcoming, and active orders in one place.</p>
// //             </div>
            
// //             {/* Filter Buttons */}
// //             <div className="flex flex-wrap gap-2">
// //               {FILTER_OPTIONS.map((option) => (
// //                 <button
// //                   key={option.value}
// //                   onClick={() => handleFilterChange(option.value)}
// //                   className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
// //                     filter === option.value 
// //                       ? 'bg-amber-600 text-white shadow-sm' 
// //                       : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
// //                   }`}
// //                 >
// //                   {option.label}
// //                 </button>
// //               ))}
// //             </div>
// //           </div>
// //         </div>

// //         {/* Loading State */}
// //         {isLoading && (
// //           <div className="space-y-4 animate-pulse">
// //             <div className="h-40 bg-gray-100 rounded-xl" />
// //             <div className="h-40 bg-gray-100 rounded-xl" />
// //             <div className="h-40 bg-gray-100 rounded-xl" />
// //           </div>
// //         )}

// //         {/* Error State */}
// //         {error && !isLoading && (
// //           <div className="bg-red-50 border border-red-200 rounded-xl p-8 text-center">
// //             <div className="text-red-600 mb-2">⚠️</div>
// //             <h3 className="text-lg font-semibold text-red-700">Unable to load orders</h3>
// //             <p className="text-sm text-red-600 mt-1">We could not load your orders right now. Please try again later.</p>
// //             <button 
// //               onClick={() => refetch()}
// //               className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all"
// //             >
// //               Try Again
// //             </button>
// //           </div>
// //         )}

// //         {/* Empty State */}
// //         {!isLoading && !error && paginatedOrders.length === 0 && (
// //           <motion.div 
// //             initial={{ opacity: 0, y: 20 }}
// //             animate={{ opacity: 1, y: 0 }}
// //             className="bg-gray-50 border border-gray-100 rounded-xl p-12 text-center"
// //           >
// //             <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
// //               <ShoppingBag size={32} className="text-amber-600" />
// //             </div>
// //             <h3 className="text-xl font-semibold text-gray-800 mb-2">No orders found</h3>
// //             <p className="text-gray-500 mb-6">Try another filter or place your next order from the menu.</p>
// //             <Link 
// //               to="/menu" 
// //               className="inline-flex items-center gap-2 px-6 py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-all"
// //             >
// //               Browse Menu
// //             </Link>
// //           </motion.div>
// //         )}

// //         {/* Orders List */}
// //         {!isLoading && !error && paginatedOrders.length > 0 && (
// //           <>
// //             <div className="space-y-4">
// //               {paginatedOrders.map((order, index) => {
// //                 const typeMeta = getOrderTypeMeta(order);
// //                 const TypeIcon = typeMeta.icon;
// //                 const statusMeta = STATUS_META[order.status] || STATUS_META.placed;
// //                 const itemCount = Array.isArray(order.items) 
// //                   ? order.items.reduce((sum, item) => sum + Number(item.quantity || 0), 0) 
// //                   : 0;

// //                 return (
// //                   <motion.div
// //                     key={order._id}
// //                     initial={{ opacity: 0, y: 20 }}
// //                     animate={{ opacity: 1, y: 0 }}
// //                     transition={{ delay: index * 0.05 }}
// //                     className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm hover:shadow-md transition-all"
// //                   >
// //                     <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
// //                       {/* Left Section - Order Info */}
// //                       <div className="flex-1 min-w-0">
// //                         <div className="flex flex-wrap items-center gap-3 mb-3">
// //                           <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium ${typeMeta.color}`}>
// //                             <TypeIcon size={12} />
// //                             {typeMeta.label}
// //                           </span>
// //                           <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${statusMeta.color}`}>
// //                             {statusMeta.label}
// //                           </span>
// //                         </div>
                        
// //                         <h2 className="text-lg font-semibold text-gray-800 mb-1">
// //                           Order #{order.orderId || order._id.slice(-8).toUpperCase()}
// //                         </h2>
                        
// //                         <p className="text-xs text-gray-400 mb-3">
// //                           Placed on {formatDate(order.createdAt)}
// //                         </p>
                        
// //                         <div className="space-y-1">
// //                           <p className="text-sm text-gray-600">{itemCount} item(s)</p>
// //                           {Array.isArray(order.items) && order.items.slice(0, 2).map((item, idx) => (
// //                             <p key={idx} className="text-sm text-gray-500">
// //                               {item.quantity} × {item.name}
// //                             </p>
// //                           ))}
// //                           {order.items?.length > 2 && (
// //                             <p className="text-xs text-gray-400">
// //                               +{order.items.length - 2} more items
// //                             </p>
// //                           )}
// //                         </div>
// //                       </div>

// //                       {/* Right Section - Total & Actions */}
// //                       <div className="lg:w-64 shrink-0">
// //                         <div className="bg-gray-50 rounded-xl p-4">
// //                           <div className="flex items-center justify-between mb-4">
// //                             <span className="text-sm text-gray-500">Total Amount</span>
// //                             <span className="text-2xl font-bold text-amber-600">
// //                               {formatCurrency(order.totalAmount)}
// //                             </span>
// //                           </div>
                          
// //                           <div className="flex flex-col gap-2">
// //                             <Link
// //                               to={getTrackingPath(order)}
// //                               className="flex items-center justify-center gap-2 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-all text-sm font-medium"
// //                             >
// //                               Track Order
// //                             </Link>
                            
// //                             {canDownloadInvoice(order) && (
// //                               <Link
// //                                 to={`/invoice/${order._id}`}
// //                                 className="flex items-center justify-center gap-2 px-4 py-2 border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 transition-all text-sm font-medium"
// //                               >
// //                                 <Download size={14} />
// //                                 Download Invoice
// //                               </Link>
// //                             )}
// //                             {canDeleteOrder(order) && (
// //                               <button
// //                                 type="button"
// //                                 onClick={() => handleDeleteOrder(order)}
// //                                 disabled={deleteOrderMutation.isPending}
// //                                 className="flex items-center justify-center gap-2 px-4 py-2 border border-red-200 text-red-600 rounded-lg hover:bg-red-50 transition-all text-sm font-medium disabled:opacity-60"
// //                               >
// //                                 Delete Record
// //                               </button>
// //                             )}
// //                           </div>
// //                         </div>
// //                       </div>
// //                     </div>
// //                   </motion.div>
// //                 );
// //               })}
// //             </div>

// //             {/* Pagination */}
// //             {filteredOrders.length > ITEMS_PER_PAGE && (
// //               <div className="flex items-center justify-center gap-3 mt-8">
// //                 <button
// //                   onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
// //                   disabled={currentPage === 1}
// //                   className="flex items-center gap-1 px-4 py-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
// //                 >
// //                   <ChevronLeft size={16} />
// //                   Previous
// //                 </button>
                
// //                 <div className="flex items-center gap-2">
// //                   {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
// //                     let pageNum;
// //                     if (totalPages <= 5) {
// //                       pageNum = i + 1;
// //                     } else if (currentPage <= 3) {
// //                       pageNum = i + 1;
// //                     } else if (currentPage >= totalPages - 2) {
// //                       pageNum = totalPages - 4 + i;
// //                     } else {
// //                       pageNum = currentPage - 2 + i;
// //                     }
                    
// //                     return (
// //                       <button
// //                         key={pageNum}
// //                         onClick={() => setCurrentPage(pageNum)}
// //                         className={`w-10 h-10 rounded-lg text-sm font-medium transition-all ${
// //                           currentPage === pageNum
// //                             ? 'bg-amber-600 text-white'
// //                             : 'border border-gray-200 text-gray-600 hover:bg-gray-50'
// //                         }`}
// //                       >
// //                         {pageNum}
// //                       </button>
// //                     );
// //                   })}
// //                 </div>
                
// //                 <button
// //                   onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
// //                   disabled={currentPage === totalPages}
// //                   className="flex items-center gap-1 px-4 py-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
// //                 >
// //                   Next
// //                   <ChevronRight size={16} />
// //                 </button>
// //               </div>
// //             )}
// //           </>
// //         )}
// //       </main>

// //       <CustomerFooter />
// //     </div>
// //   );
// // }

// import { useMemo, useState } from 'react';
// import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
// import { Link } from 'react-router-dom';
// import { motion } from 'framer-motion';
// import { CalendarDays, ChevronLeft, ChevronRight, Download, ShoppingBag, Table2, Truck, Clock, MapPin, Phone, Mail, User } from 'lucide-react';
// import api from '../../services/api';
// import CustomerFooter from '../../components/customer/CustomerFooter';

// const RUPEE = String.fromCharCode(8377);
// const ITEMS_PER_PAGE = 5;

// const ORDER_TYPE_META = {
//   delivery: { icon: Truck, label: 'Delivery', color: 'bg-sky-50 text-sky-600' },
//   takeaway: { icon: ShoppingBag, label: 'Takeaway', color: 'bg-violet-50 text-violet-600' },
//   'dine-in': { icon: Table2, label: 'Dine-In', color: 'bg-emerald-50 text-emerald-600' },
//   'pre-order': { icon: CalendarDays, label: 'Pre-Order', color: 'bg-orange-50 text-orange-600' },
// };

// const STATUS_META = {
//   placed: { label: 'Placed', color: 'bg-amber-50 text-amber-600' },
//   confirmed: { label: 'Confirmed', color: 'bg-blue-50 text-blue-600' },
//   preparing: { label: 'Preparing', color: 'bg-orange-50 text-orange-600' },
//   ready: { label: 'Ready', color: 'bg-emerald-50 text-emerald-600' },
//   'out-for-delivery': { label: 'Out for Delivery', color: 'bg-indigo-50 text-indigo-600' },
//   delivered: { label: 'Delivered', color: 'bg-green-50 text-green-600' },
//   completed: { label: 'Completed', color: 'bg-green-50 text-green-600' },
//   cancelled: { label: 'Cancelled', color: 'bg-red-50 text-red-600' },
// };

// const FILTER_OPTIONS = [
//   { value: 'all', label: 'All' },
//   { value: 'delivery', label: 'Online Orders' },
//   { value: 'takeaway', label: 'Takeaway' },
//   { value: 'dine-in', label: 'Dine-In' },
//   { value: 'pre-order', label: 'Pre-Order' },
// ];

// const getOrderTypeDisplay = (order) => {
//   if (order?.isPreOrder) {
//     const method = order.preOrderMethod;
//     if (method === 'delivery') {
//       return { 
//         label: 'Pre-Order Delivery', 
//         icon: CalendarDays, 
//         color: 'bg-orange-50 text-orange-600',
//         fee: order.preOrderFee || 49
//       };
//     }
//     if (method === 'takeaway') {
//       return { 
//         label: 'Pre-Order Takeaway', 
//         icon: CalendarDays, 
//         color: 'bg-orange-50 text-orange-600',
//         fee: order.preOrderFee || 49
//       };
//     }
//     if (method === 'dine-in') {
//       return { 
//         label: 'Pre-Order Dine-In', 
//         icon: CalendarDays, 
//         color: 'bg-orange-50 text-orange-600',
//         fee: order.preOrderFee || 49
//       };
//     }
//     return { 
//       label: 'Pre-Order', 
//       icon: CalendarDays, 
//       color: 'bg-orange-50 text-orange-600',
//       fee: order.preOrderFee || 49
//     };
//   }
  
//   switch(order?.orderType) {
//     case 'delivery': 
//       return { label: 'Delivery', icon: Truck, color: 'bg-sky-50 text-sky-600', fee: 0 };
//     case 'takeaway': 
//       return { label: 'Takeaway', icon: ShoppingBag, color: 'bg-violet-50 text-violet-600', fee: 0 };
//     case 'dine-in': 
//       return { label: 'Dine-In', icon: Table2, color: 'bg-emerald-50 text-emerald-600', fee: 0 };
//     default: 
//       return { label: 'Order', icon: ShoppingBag, color: 'bg-gray-50 text-gray-600', fee: 0 };
//   }
// };

// export default function OrderHistoryPage() {
//   const queryClient = useQueryClient();
//   const [filter, setFilter] = useState('all');
//   const [currentPage, setCurrentPage] = useState(1);

//   const { data: orders = [], isLoading, error, refetch } = useQuery({
//     queryKey: ['customer-orders'],
//     queryFn: async () => {
//       const res = await api.get('/orders/my');
//       return Array.isArray(res.data) ? res.data : [];
//     },
//   });

//   const filteredOrders = useMemo(() => {
//     if (filter === 'all') return orders;
//     if (filter === 'pre-order') return orders.filter((order) => Boolean(order?.isPreOrder));
//     return orders.filter((order) => order?.orderType === filter && !order?.isPreOrder);
//   }, [orders, filter]);

//   const totalPages = Math.max(1, Math.ceil(filteredOrders.length / ITEMS_PER_PAGE));

//   const paginatedOrders = useMemo(() => {
//     const start = (currentPage - 1) * ITEMS_PER_PAGE;
//     return filteredOrders.slice(start, start + ITEMS_PER_PAGE);
//   }, [filteredOrders, currentPage]);

//   const formatCurrency = (value) => `₹${Number(value || 0).toLocaleString('en-IN')}`;
  
//   const formatDate = (value) =>
//     new Date(value).toLocaleString('en-IN', {
//       day: '2-digit',
//       month: 'short',
//       year: 'numeric',
//       hour: '2-digit',
//       minute: '2-digit',
//     });

//   const getTrackingPath = (order) => {
//     if (!order?._id) return '/orders';
//     if (order?.isPreOrder) {
//       if (order.preOrderMethod === 'delivery') return `/track-delivery/${order._id}`;
//       if (order.preOrderMethod === 'takeaway') return `/track-takeaway/${order._id}`;
//       if (order.preOrderMethod === 'dine-in') return `/track-dinein/${order._id}`;
//       return `/track-preorder/${order._id}`;
//     }
//     if (order.orderType === 'delivery') return `/track-delivery/${order._id}`;
//     if (order.orderType === 'takeaway') return `/track-takeaway/${order._id}`;
//     if (order.orderType === 'dine-in') return `/track-dinein/${order._id}`;
//     if (order.orderType === 'pre-order') {
//       const notes = String(order.specialNotes || '').toLowerCase();
//       if (notes.includes('pre-order type: delivery')) return `/track-delivery/${order._id}`;
//       if (notes.includes('pre-order type: takeaway')) return `/track-takeaway/${order._id}`;
//       if (notes.includes('pre-order type: dine-in')) return `/track-dinein/${order._id}`;
//       return `/track-preorder/${order._id}`;
//     }
//     return `/track/${order._id}`;
//   };

//   const handleFilterChange = (value) => {
//     setFilter(value);
//     setCurrentPage(1);
//   };

//   const canDownloadInvoice = (order) => ['delivered', 'completed'].includes(String(order?.status || '').toLowerCase());
//   const canDeleteOrder = (order) => ['delivered', 'completed', 'cancelled'].includes(String(order?.status || '').toLowerCase());

//   const deleteOrderMutation = useMutation({
//     mutationFn: (orderId) => api.delete(`/orders/${orderId}`),
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ['customer-orders'] });
//       setCurrentPage(1);
//     },
//   });

//   const handleDeleteOrder = async (order) => {
//     if (!order?._id) return;
//     const confirmed = window.confirm(`Delete order ${order.orderId || order._id.slice(-8).toUpperCase()} from your history?`);
//     if (!confirmed) return;
//     try {
//       await deleteOrderMutation.mutateAsync(order._id);
//     } catch (err) {
//       window.alert(err.response?.data?.message || 'Could not delete this order');
//     }
//   };

//   return (
//     <div className="min-h-screen bg-white">
//       {/* Header */}
//       <header className="border-b border-gray-100 bg-white sticky top-0 z-50">
//         <div className="max-w-6xl mx-auto px-4 py-3">
//           <div className="flex items-center justify-between">
//             <Link to="/" className="flex items-center gap-2">
//               <img 
//                 src="https://rollercoastercafe.com/assets/images/roller_logo.png" 
//                 alt="Roller Coaster Cafe Logo"
//                 className="h-8 w-8 rounded-full object-cover"
//                 onError={(e) => {
//                   e.target.src = '/logo.png';
//                 }}
//               />
//               <span className="font-semibold text-lg text-gray-800">Roller Coaster Cafe</span>
//             </Link>

//             <nav className="hidden md:flex items-center gap-6">
//               <Link to="/" className="text-sm text-gray-500 hover:text-amber-600">Home</Link>
//               <Link to="/menu" className="text-sm text-gray-500 hover:text-amber-600">Menu</Link>
//               <Link to="/orders" className="text-sm text-amber-600 font-medium">Orders</Link>
//               <Link to="/profile" className="text-sm text-gray-500 hover:text-amber-600">Profile</Link>
//               <Link to="/settings" className="text-sm text-gray-500 hover:text-amber-600">Settings</Link>
//             </nav>
//           </div>
//         </div>
//       </header>

//       <main className="max-w-6xl mx-auto px-4 py-8">
//         {/* Page Header */}
//         <div className="mb-8">
//           <div className="flex items-center justify-between flex-wrap gap-4">
//             <div>
//               <h1 className="text-3xl font-bold text-gray-800">My Orders</h1>
//               <p className="text-sm text-gray-500 mt-1">Track completed, upcoming, and active orders in one place.</p>
//             </div>
            
//             {/* Filter Buttons */}
//             <div className="flex flex-wrap gap-2">
//               {FILTER_OPTIONS.map((option) => (
//                 <button
//                   key={option.value}
//                   onClick={() => handleFilterChange(option.value)}
//                   className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
//                     filter === option.value 
//                       ? 'bg-amber-600 text-white shadow-sm' 
//                       : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
//                   }`}
//                 >
//                   {option.label}
//                 </button>
//               ))}
//             </div>
//           </div>
//         </div>

//         {/* Loading State */}
//         {isLoading && (
//           <div className="space-y-4 animate-pulse">
//             <div className="h-40 bg-gray-100 rounded-xl" />
//             <div className="h-40 bg-gray-100 rounded-xl" />
//             <div className="h-40 bg-gray-100 rounded-xl" />
//           </div>
//         )}

//         {/* Error State */}
//         {error && !isLoading && (
//           <div className="bg-red-50 border border-red-200 rounded-xl p-8 text-center">
//             <div className="text-red-600 mb-2">⚠️</div>
//             <h3 className="text-lg font-semibold text-red-700">Unable to load orders</h3>
//             <p className="text-sm text-red-600 mt-1">We could not load your orders right now. Please try again later.</p>
//             <button 
//               onClick={() => refetch()}
//               className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all"
//             >
//               Try Again
//             </button>
//           </div>
//         )}

//         {/* Empty State */}
//         {!isLoading && !error && paginatedOrders.length === 0 && (
//           <motion.div 
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             className="bg-gray-50 border border-gray-100 rounded-xl p-12 text-center"
//           >
//             <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
//               <ShoppingBag size={32} className="text-amber-600" />
//             </div>
//             <h3 className="text-xl font-semibold text-gray-800 mb-2">No orders found</h3>
//             <p className="text-gray-500 mb-6">Try another filter or place your next order from the menu.</p>
//             <Link 
//               to="/menu" 
//               className="inline-flex items-center gap-2 px-6 py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-all"
//             >
//               Browse Menu
//             </Link>
//           </motion.div>
//         )}

//         {/* Orders List */}
//         {!isLoading && !error && paginatedOrders.length > 0 && (
//           <>
//             <div className="space-y-4">
//               {paginatedOrders.map((order, index) => {
//                 const typeDisplay = getOrderTypeDisplay(order);
//                 const TypeIcon = typeDisplay.icon;
//                 const statusMeta = STATUS_META[order.status] || STATUS_META.placed;
//                 const itemCount = Array.isArray(order.items) 
//                   ? order.items.reduce((sum, item) => sum + Number(item.quantity || 0), 0) 
//                   : 0;

//                 return (
//                   <motion.div
//                     key={order._id}
//                     initial={{ opacity: 0, y: 20 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     transition={{ delay: index * 0.05 }}
//                     className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm hover:shadow-md transition-all"
//                   >
//                     <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
//                       {/* Left Section - Order Info */}
//                       <div className="flex-1 min-w-0">
//                         <div className="flex flex-wrap items-center gap-3 mb-3">
//                           <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium ${typeDisplay.color}`}>
//                             <TypeIcon size={12} />
//                             {typeDisplay.label}
//                           </span>
//                           {typeDisplay.fee > 0 && (
//                             <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-600">
//                               +₹{typeDisplay.fee} fee
//                             </span>
//                           )}
//                           <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${statusMeta.color}`}>
//                             {statusMeta.label}
//                           </span>
//                         </div>
                        
//                         <h2 className="text-lg font-semibold text-gray-800 mb-1">
//                           Order #{order.orderId || order._id.slice(-8).toUpperCase()}
//                         </h2>
                        
//                         <p className="text-xs text-gray-400 mb-3">
//                           Placed on {formatDate(order.createdAt)}
//                         </p>
                        
//                         <div className="space-y-1">
//                           <p className="text-sm text-gray-600">{itemCount} item(s)</p>
//                           {Array.isArray(order.items) && order.items.slice(0, 2).map((item, idx) => (
//                             <p key={idx} className="text-sm text-gray-500">
//                               {item.quantity} × {item.name}
//                             </p>
//                           ))}
//                           {order.items?.length > 2 && (
//                             <p className="text-xs text-gray-400">
//                               +{order.items.length - 2} more items
//                             </p>
//                           )}
//                         </div>
//                       </div>

//                       {/* Right Section - Total & Actions */}
//                       <div className="lg:w-64 shrink-0">
//                         <div className="bg-gray-50 rounded-xl p-4">
//                           <div className="flex items-center justify-between mb-4">
//                             <span className="text-sm text-gray-500">Total Amount</span>
//                             <span className="text-2xl font-bold text-amber-600">
//                               {formatCurrency(order.totalAmount)}
//                             </span>
//                           </div>
                          
//                           <div className="flex flex-col gap-2">
//                             <Link
//                               to={getTrackingPath(order)}
//                               className="flex items-center justify-center gap-2 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-all text-sm font-medium"
//                             >
//                               Track Order
//                             </Link>
                            
//                             {canDownloadInvoice(order) && (
//                               <Link
//                                 to={`/invoice/${order._id}`}
//                                 className="flex items-center justify-center gap-2 px-4 py-2 border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 transition-all text-sm font-medium"
//                               >
//                                 <Download size={14} />
//                                 Download Invoice
//                               </Link>
//                             )}
//                             {canDeleteOrder(order) && (
//                               <button
//                                 type="button"
//                                 onClick={() => handleDeleteOrder(order)}
//                                 disabled={deleteOrderMutation.isPending}
//                                 className="flex items-center justify-center gap-2 px-4 py-2 border border-red-200 text-red-600 rounded-lg hover:bg-red-50 transition-all text-sm font-medium disabled:opacity-60"
//                               >
//                                 Delete Record
//                               </button>
//                             )}
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                   </motion.div>
//                 );
//               })}
//             </div>

//             {/* Pagination */}
//             {filteredOrders.length > ITEMS_PER_PAGE && (
//               <div className="flex items-center justify-center gap-3 mt-8">
//                 <button
//                   onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
//                   disabled={currentPage === 1}
//                   className="flex items-center gap-1 px-4 py-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
//                 >
//                   <ChevronLeft size={16} />
//                   Previous
//                 </button>
                
//                 <div className="flex items-center gap-2">
//                   {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
//                     let pageNum;
//                     if (totalPages <= 5) {
//                       pageNum = i + 1;
//                     } else if (currentPage <= 3) {
//                       pageNum = i + 1;
//                     } else if (currentPage >= totalPages - 2) {
//                       pageNum = totalPages - 4 + i;
//                     } else {
//                       pageNum = currentPage - 2 + i;
//                     }
                    
//                     return (
//                       <button
//                         key={pageNum}
//                         onClick={() => setCurrentPage(pageNum)}
//                         className={`w-10 h-10 rounded-lg text-sm font-medium transition-all ${
//                           currentPage === pageNum
//                             ? 'bg-amber-600 text-white'
//                             : 'border border-gray-200 text-gray-600 hover:bg-gray-50'
//                         }`}
//                       >
//                         {pageNum}
//                       </button>
//                     );
//                   })}
//                 </div>
                
//                 <button
//                   onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
//                   disabled={currentPage === totalPages}
//                   className="flex items-center gap-1 px-4 py-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
//                 >
//                   Next
//                   <ChevronRight size={16} />
//                 </button>
//               </div>
//             )}
//           </>
//         )}
//       </main>

//       <CustomerFooter />
//     </div>
//   );
// }

import { useMemo, useState, useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { io } from 'socket.io-client';
import { 
  CalendarDays, ChevronLeft, ChevronRight, Download, ShoppingBag, 
  Table2, Truck, Clock, MapPin, Phone, Mail, User, Eye, 
  CheckCircle, XCircle, RefreshCw, FileText
} from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../services/api';
import CustomerFooter from '../../components/customer/CustomerFooter';

const ITEMS_PER_PAGE = 5;

const ORDER_TYPE_META = {
  delivery: { icon: Truck, label: 'Delivery', color: 'bg-sky-50 text-sky-600' },
  takeaway: { icon: ShoppingBag, label: 'Takeaway', color: 'bg-violet-50 text-violet-600' },
  'dine-in': { icon: Table2, label: 'Dine-In', color: 'bg-emerald-50 text-emerald-600' },
  'pre-order': { icon: CalendarDays, label: 'Pre-Order', color: 'bg-orange-50 text-orange-600' },
};

const STATUS_META = {
  placed: { label: 'Placed', color: 'bg-amber-50 text-amber-600', icon: Clock },
  confirmed: { label: 'Confirmed', color: 'bg-blue-50 text-blue-600', icon: CheckCircle },
  preparing: { label: 'Preparing', color: 'bg-orange-50 text-orange-600', icon: RefreshCw },
  ready: { label: 'Ready', color: 'bg-emerald-50 text-emerald-600', icon: CheckCircle },
  'out-for-delivery': { label: 'Out for Delivery', color: 'bg-indigo-50 text-indigo-600', icon: Truck },
  delivered: { label: 'Delivered', color: 'bg-green-50 text-green-600', icon: CheckCircle },
  completed: { label: 'Completed', color: 'bg-teal-50 text-teal-600', icon: CheckCircle },
  cancelled: { label: 'Cancelled', color: 'bg-red-50 text-red-600', icon: XCircle },
};

const FILTER_OPTIONS = [
  { value: 'all', label: 'All Orders' },
  { value: 'pre-order', label: 'Pre-Orders' },
  { value: 'dine-in', label: 'Dine-In' },
  { value: 'delivery', label: 'Delivery' },
  { value: 'takeaway', label: 'Takeaway' },
];

const getSocketBaseUrl = () => (
  import.meta.env.VITE_SOCKET_URL ||
  import.meta.env.VITE_API_URL?.replace('/api', '') ||
  'http://localhost:5000'
);

const getOrderTypeDisplay = (order) => {
  if (order?.isPreOrder) {
    const method = order.preOrderMethod;
    if (method === 'delivery') {
      return { label: 'Pre-Order Delivery', icon: CalendarDays, color: 'bg-orange-50 text-orange-600', fee: order.preOrderFee || 49 };
    }
    if (method === 'takeaway') {
      return { label: 'Pre-Order Takeaway', icon: CalendarDays, color: 'bg-orange-50 text-orange-600', fee: order.preOrderFee || 49 };
    }
    if (method === 'dine-in') {
      return { label: 'Pre-Order Dine-In', icon: CalendarDays, color: 'bg-orange-50 text-orange-600', fee: order.preOrderFee || 49 };
    }
    return { label: 'Pre-Order', icon: CalendarDays, color: 'bg-orange-50 text-orange-600', fee: order.preOrderFee || 49 };
  }
  
  switch(order?.orderType) {
    case 'delivery': return { label: 'Delivery', icon: Truck, color: 'bg-sky-50 text-sky-600', fee: 0 };
    case 'takeaway': return { label: 'Takeaway', icon: ShoppingBag, color: 'bg-violet-50 text-violet-600', fee: 0 };
    case 'dine-in': return { label: 'Dine-In', icon: Table2, color: 'bg-emerald-50 text-emerald-600', fee: 0 };
    default: return { label: 'Order', icon: ShoppingBag, color: 'bg-gray-50 text-gray-600', fee: 0 };
  }
};

const getOrderCategory = (order) => {
  if (order?.isPreOrder) return 'pre-order';
  return String(order?.orderType || '').toLowerCase();
};

export default function OrderHistoryPage() {
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [socketConnected, setSocketConnected] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState(null);

  const { data: orders = [], isLoading, error, refetch } = useQuery({
    queryKey: ['customer-orders'],
    queryFn: async () => {
      const res = await api.get('/orders/my');
      return Array.isArray(res.data) ? res.data : [];
    },
    refetchInterval: 10000,
  });

  // WebSocket for real-time order updates
  useEffect(() => {
    const socket = io(getSocketBaseUrl(), { withCredentials: true });
    
    socket.on('connect', () => {
      setSocketConnected(true);
      socket.emit('join-customer', { userId: 'customer' });
    });
    
    socket.on('disconnect', () => setSocketConnected(false));
    socket.on('connect_error', () => setSocketConnected(false));
    
    socket.on('order-status-updated', (data) => {
      toast.success(`Order #${data.orderId} status: ${data.status}`, { duration: 3000 });
      refetch();
    });
    
    socket.on('order-ready', (data) => {
      toast.success(`🎉 Your order #${data.orderId} is ready!`, { duration: 5000 });
      refetch();
    });
    
    socket.on('order-out-for-delivery', (data) => {
      toast.success(`🚚 Your order #${data.orderId} is out for delivery!`, { duration: 5000 });
      refetch();
    });
    
    socket.on('order-delivered', (data) => {
      toast.success(`✅ Order #${data.orderId} delivered! Thank you!`, { duration: 5000 });
      refetch();
    });
    
    return () => socket.disconnect();
  }, [refetch]);

  const filteredOrders = useMemo(() => {
    if (filter === 'all') return [...orders];
    return orders.filter((order) => getOrderCategory(order) === filter);
  }, [orders, filter]);

  const totalPages = Math.max(1, Math.ceil(filteredOrders.length / ITEMS_PER_PAGE));
  const paginatedOrders = filteredOrders.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const formatCurrency = (value) => `₹${Number(value || 0).toLocaleString('en-IN')}`;
  
  const formatDate = (value) =>
    new Date(value).toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

  const getTrackingPath = (order) => {
    if (!order?._id) return '/orders';
    if (order?.isPreOrder) {
      if (order.preOrderMethod === 'delivery') return `/track-delivery/${order._id}`;
      if (order.preOrderMethod === 'takeaway') return `/track-takeaway/${order._id}`;
      if (order.preOrderMethod === 'dine-in') return `/track-dinein/${order._id}`;
      return `/track-preorder/${order._id}`;
    }
    if (order.orderType === 'delivery') return `/track-delivery/${order._id}`;
    if (order.orderType === 'takeaway') return `/track-takeaway/${order._id}`;
    if (order.orderType === 'dine-in') return `/track-dinein/${order._id}`;
    return `/track-preorder/${order._id}`;
  };

  const handleFilterChange = (value) => {
    setFilter(value);
    setCurrentPage(1);
  };

  const canDownloadInvoice = (order) => ['delivered', 'completed'].includes(String(order?.status || '').toLowerCase());
  const canDeleteOrder = (order) => ['delivered', 'completed', 'cancelled'].includes(String(order?.status || '').toLowerCase());

  const deleteOrderMutation = useMutation({
    mutationFn: (orderId) => api.delete(`/orders/${orderId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customer-orders'] });
      toast.success('Order deleted');
      setCurrentPage(1);
      setDeleteDialog(null);
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Could not delete order'),
  });

  const handleDeleteOrder = async (order) => {
    if (!order?._id) return;
    setDeleteDialog(order);
  };

  const confirmDeleteOrder = async () => {
    if (!deleteDialog?._id) return;
    await deleteOrderMutation.mutateAsync(deleteDialog._id);
  };

  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-gray-100 bg-white sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2">
              <img 
                src="https://rollercoastercafe.com/assets/images/roller_logo.png" 
                alt="Roller Coaster Cafe Logo"
                className="h-8 w-8 rounded-full object-cover"
              />
              <span className="font-semibold text-lg text-gray-800">Roller Coaster Cafe</span>
            </Link>

            <nav className="hidden md:flex items-center gap-6">
              <Link to="/" className="text-sm text-gray-500 hover:text-amber-600">Home</Link>
              <Link to="/menu" className="text-sm text-gray-500 hover:text-amber-600">Menu</Link>
              <Link to="/orders" className="text-sm text-amber-600 font-medium">Orders</Link>
              <Link to="/profile" className="text-sm text-gray-500 hover:text-amber-600">Profile</Link>
              <Link to="/settings" className="text-sm text-gray-500 hover:text-amber-600">Settings</Link>
            </nav>

            {!socketConnected && (
              <span className="text-xs text-red-500 bg-red-50 px-2 py-1 rounded-full">Offline</span>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">My Orders</h1>
              <p className="text-sm text-gray-500 mt-1">Track your orders in real-time</p>
            </div>
            
            <div className="flex flex-wrap gap-2">
              {FILTER_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleFilterChange(option.value)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    filter === option.value 
                      ? 'bg-amber-600 text-white shadow-sm' 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="space-y-4 animate-pulse">
            {[1,2,3].map(i => <div key={i} className="h-40 bg-gray-100 rounded-xl" />)}
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 rounded-xl p-8 text-center">
            <h3 className="text-lg font-semibold text-red-700">Unable to load orders</h3>
            <button onClick={() => refetch()} className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg">Try Again</button>
          </div>
        ) : paginatedOrders.length === 0 ? (
          <div className="bg-gray-50 border border-gray-100 rounded-xl p-12 text-center">
            <ShoppingBag size={48} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">No orders found</h3>
            <Link to="/menu" className="inline-flex items-center gap-2 px-6 py-3 bg-amber-600 text-white rounded-lg">Browse Menu</Link>
          </div>
        ) : (
          <>
            <div className="space-y-4">
              {paginatedOrders.map((order, index) => {
                const typeDisplay = getOrderTypeDisplay(order);
                const TypeIcon = typeDisplay.icon;
                const statusMeta = STATUS_META[order.status] || STATUS_META.placed;
                const StatusIcon = statusMeta.icon;
                const itemCount = order.items?.reduce((sum, item) => sum + (item.quantity || 0), 0) || 0;
                const showInvoice = canDownloadInvoice(order);

                return (
                  <motion.div
                    key={order._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm hover:shadow-md transition-all"
                  >
                    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-3">
                          <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium ${typeDisplay.color}`}>
                            <TypeIcon size={12} /> {typeDisplay.label}
                          </span>
                          {typeDisplay.fee > 0 && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-600">
                              +₹{typeDisplay.fee} fee
                            </span>
                          )}
                          <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${statusMeta.color}`}>
                            <StatusIcon size={10} /> {statusMeta.label}
                          </span>
                        </div>
                        
                        <h2 className="text-lg font-semibold text-gray-800 mb-1">
                          Order #{order.orderId || order._id.slice(-8).toUpperCase()}
                        </h2>
                        
                        <p className="text-xs text-gray-400 mb-3">Placed on {formatDate(order.createdAt)}</p>
                        
                        <div className="space-y-1">
                          <p className="text-sm text-gray-600">{itemCount} item(s)</p>
                          {order.items?.slice(0, 2).map((item, idx) => (
                            <p key={idx} className="text-sm text-gray-500">{item.quantity} × {item.name}</p>
                          ))}
                          {order.items?.length > 2 && <p className="text-xs text-gray-400">+{order.items.length - 2} more</p>}
                        </div>
                      </div>

                      <div className="lg:w-64 shrink-0">
                        <div className="bg-gray-50 rounded-xl p-4">
                          <div className="flex items-center justify-between mb-4">
                            <span className="text-sm text-gray-500">Total Amount</span>
                            <span className="text-2xl font-bold text-amber-600">{formatCurrency(order.totalAmount)}</span>
                          </div>
                          
                          <div className="flex flex-col gap-2">
                            <Link
                              to={getTrackingPath(order)}
                              className="flex items-center justify-center gap-2 px-4 py-2 bg-amber-600 text-white rounded-lg text-sm font-medium hover:bg-amber-700"
                            >
                              Track Order
                            </Link>
                            
                            {showInvoice && (
                              <Link
                                to={`/invoice/${order._id}`}
                                target="_blank"
                                className="flex items-center justify-center gap-2 px-4 py-2 border border-gray-200 text-gray-600 rounded-lg text-sm font-medium hover:border-amber-500 hover:text-amber-500"
                              >
                                <FileText size={14} /> View Invoice
                              </Link>
                            )}
                            
                            {canDeleteOrder(order) && (
                              <button
                                onClick={() => handleDeleteOrder(order)}
                                disabled={deleteOrderMutation.isPending}
                                className="flex items-center justify-center gap-2 px-4 py-2 border border-red-200 text-red-500 rounded-lg text-sm font-medium hover:bg-red-50 transition-all disabled:opacity-60"
                              >
                                Delete Record
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-3 mt-8">
                <button onClick={() => setCurrentPage(p => Math.max(1, p-1))} disabled={currentPage === 1}
                  className="px-4 py-2 rounded-lg border disabled:opacity-40">Previous</button>
                <span className="text-sm">Page {currentPage} of {totalPages}</span>
                <button onClick={() => setCurrentPage(p => Math.min(totalPages, p+1))} disabled={currentPage === totalPages}
                  className="px-4 py-2 rounded-lg border disabled:opacity-40">Next</button>
              </div>
            )}
          </>
        )}
      </main>

      {deleteDialog && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-xl font-bold text-gray-800">Delete Order?</h3>
                <p className="mt-2 text-sm text-gray-500">
                  Remove order #{deleteDialog.orderId || deleteDialog._id.slice(-8).toUpperCase()} from your history.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setDeleteDialog(null)}
                className="rounded-full p-1 text-gray-500 hover:bg-gray-100"
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
                className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-all"
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

      <CustomerFooter />
    </div>
  );
}
