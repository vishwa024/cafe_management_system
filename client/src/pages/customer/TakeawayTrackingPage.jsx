// // import { useEffect, useState } from 'react';
// // import { Link, useParams } from 'react-router-dom';
// // import { useQuery } from '@tanstack/react-query';
// // import { motion } from 'framer-motion';
// // import { io } from 'socket.io-client';
// // import { ArrowLeft, ShoppingBag, Clock3, MapPin, PackageCheck, CheckCircle2, ChefHat } from 'lucide-react';
// // import api from '../../services/api';
// // import toast from 'react-hot-toast';
// // import CustomerFooter from '../../components/customer/CustomerFooter';

// // const STATUS_FLOW = ['placed', 'confirmed', 'preparing', 'ready', 'completed'];

// // const STATUS_META = {
// //   placed: { title: 'Order Placed', desc: 'Your order has been received', icon: Clock3, color: 'bg-amber-50 text-amber-600' },
// //   confirmed: { title: 'Order Confirmed', desc: 'Restaurant accepted your order', icon: CheckCircle2, color: 'bg-blue-50 text-blue-600' },
// //   preparing: { title: 'Preparing', desc: 'Kitchen is preparing your food', icon: ChefHat, color: 'bg-orange-50 text-orange-600' },
// //   ready: { title: 'Ready for Pickup', desc: 'Your order is ready at the counter', icon: PackageCheck, color: 'bg-emerald-50 text-emerald-600' },
// //   completed: { title: 'Order Completed', desc: 'You have picked up your order', icon: CheckCircle2, color: 'bg-green-50 text-green-600' },
// //   cancelled: { title: 'Cancelled', desc: 'Order was cancelled', icon: Clock3, color: 'bg-red-50 text-red-600' },
// // };

// // const formatDateTime = (value) => {
// //   if (!value) return '-';
// //   return new Date(value).toLocaleString('en-IN', {
// //     day: 'numeric',
// //     month: 'short',
// //     hour: 'numeric',
// //     minute: '2-digit',
// //   });
// // };

// // const formatCurrency = (value) => `₹${Number(value || 0).toLocaleString('en-IN')}`;

// // export default function TakeawayTrackingPage() {
// //   const { orderId } = useParams();
// //   const [liveOrder, setLiveOrder] = useState(null);
// //   const [now, setNow] = useState(Date.now());

// //   useEffect(() => {
// //     const timer = setInterval(() => setNow(Date.now()), 1000);
// //     return () => clearInterval(timer);
// //   }, []);

// //   const { data, isLoading } = useQuery({
// //     queryKey: ['takeaway-track', orderId],
// //     queryFn: () => api.get(`/orders/${orderId}`).then((res) => res.data),
// //     retry: false,
// //     refetchInterval: 5000,
// //   });

// //   useEffect(() => {
// //     if (data?.order || data) {
// //       setLiveOrder((prev) => ({ ...(prev || {}), ...(data?.order || data) }));
// //     }
// //   }, [data]);

// //   useEffect(() => {
// //     if (!orderId) return;

// //     const socket = io(import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000', { withCredentials: true });

// //     socket.on('connect', () => {
// //       socket.emit('join-room', { room: `order:${orderId}` });
// //     });

// //     socket.on('order-updated', (payload) => {
// //       if (String(payload.orderId) === String(orderId)) {
// //         setLiveOrder((prev) => ({ ...(prev || {}), ...payload }));
// //         if (payload.status === 'ready') {
// //           toast.success('Your order is ready for pickup! 🎉');
// //         }
// //       }
// //     });

// //     return () => {
// //       socket.emit('leave-room', { room: `order:${orderId}` });
// //       socket.close();
// //     };
// //   }, [orderId]);

// //   const order = liveOrder || data?.order || data;
// //   const currentStatus = order?.status || 'placed';
// //   const isPreOrderTakeaway = Boolean(order?.isPreOrder) || order?.preOrderMethod === 'takeaway';
// //   const statusMeta = STATUS_META[currentStatus] || STATUS_META.placed;
// //   const StatusIcon = statusMeta.icon;
// //   const currentIndex = STATUS_FLOW.indexOf(currentStatus);

// //   const getStatusTime = (status) => {
// //     if (!order?.statusHistory) return null;
// //     const historyEntry = order.statusHistory.find(entry => entry.status === status);
// //     return historyEntry?.updatedAt || null;
// //   };

// //   return (
// //     <div className="min-h-screen bg-white">
// //       {/* Header */}
// //       <header className="border-b border-gray-100 bg-white sticky top-0 z-50">
// //         <div className="max-w-4xl mx-auto px-4 py-3">
// //           <div className="flex items-center justify-between">
// //             <Link to="/dashboard" className="flex items-center gap-2">
// //               <img 
// //                 src="https://rollercoastercafe.com/assets/images/roller_logo.png" 
// //                 alt="Logo"
// //                 className="h-8 w-8 rounded-full object-cover"
// //               />
// //               <span className="font-semibold text-lg text-gray-800">Roller Coaster Cafe</span>
// //             </Link>
// //             <Link to="/orders" className="text-sm text-gray-500 hover:text-amber-600 flex items-center gap-1">
// //               <ArrowLeft size={14} /> Back to Orders
// //             </Link>
// //           </div>
// //         </div>
// //       </header>

// //       <main className="max-w-4xl mx-auto px-4 py-6">
// //         {isLoading || !order ? (
// //           <div className="space-y-4 animate-pulse">
// //             <div className="h-32 bg-gray-100 rounded-xl" />
// //             <div className="h-64 bg-gray-100 rounded-xl" />
// //           </div>
// //         ) : (
// //           <>
// //             {/* Order Header */}
// //             <div className="bg-white border border-gray-100 rounded-xl p-5 mb-6">
// //               <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
// //                 <div>
// //                   <div className="flex items-center gap-2 mb-2">
// //                     <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium ${isPreOrderTakeaway ? 'bg-orange-50 text-orange-600' : 'bg-violet-50 text-violet-600'}`}>
// //                       <ShoppingBag size={12} /> {isPreOrderTakeaway ? 'Pre-Order Takeaway' : 'Takeaway'}
// //                     </span>
// //                     <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium ${statusMeta.color}`}>
// //                       <StatusIcon size={12} /> {statusMeta.title}
// //                     </span>
// //                   </div>
// //                   <h1 className="font-bold text-xl text-gray-800">Order #{order.orderId}</h1>
// //                   <p className="text-sm text-gray-400 mt-1">Placed on {formatDateTime(order.createdAt)}</p>
// //                   {isPreOrderTakeaway && order.scheduledTime && (
// //                     <p className="text-sm text-orange-600 mt-1">Scheduled pickup for {formatDateTime(order.scheduledTime)}</p>
// //                   )}
// //                 </div>
// //                 <div className="text-right">
// //                   <div className="text-2xl font-bold text-gray-800">{formatCurrency(order.totalAmount)}</div>
// //                   <div className="text-xs text-gray-400 capitalize mt-1">{order.paymentMethod}</div>
// //                 </div>
// //               </div>
// //               <p className="text-sm text-gray-500 leading-relaxed">{statusMeta.desc}</p>
// //             </div>

// //             {/* Ready for Pickup Banner */}
// //             {currentStatus === 'ready' && (
// //               <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-5 mb-6">
// //                 <div className="flex items-center gap-3">
// //                   <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center animate-pulse">
// //                     <PackageCheck size={24} className="text-green-600" />
// //                   </div>
// //                   <div>
// //                     <h3 className="font-bold text-lg text-gray-800">Your order is ready for pickup!</h3>
// //                     <p className="text-sm text-gray-600">Please head to our counter with your order ID</p>
// //                     <p className="text-xs text-green-600 mt-2">Order will be held for 20 minutes</p>
// //                   </div>
// //                 </div>
// //               </div>
// //             )}

// //             {/* Status Timeline */}
// //             <div className="bg-white border border-gray-100 rounded-xl p-5 mb-6">
// //               <h2 className="font-semibold text-gray-800 mb-5">Order Status</h2>
// //               <div className="relative">
// //                 {STATUS_FLOW.map((status, index) => {
// //                   const meta = STATUS_META[status];
// //                   const Icon = meta.icon;
// //                   const isCompleted = currentIndex >= index;
// //                   const isCurrent = currentStatus === status;
// //                   const statusTime = getStatusTime(status);

// //                   if (status === 'completed' && currentStatus !== 'completed') return null;

// //                   return (
// //                     <motion.div
// //                       key={status}
// //                       initial={{ opacity: 0, x: -20 }}
// //                       animate={{ opacity: 1, x: 0 }}
// //                       transition={{ delay: index * 0.1 }}
// //                       className="flex gap-3 mb-4 last:mb-0"
// //                     >
// //                       <div className="flex flex-col items-center">
// //                         <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
// //                           isCompleted ? `${meta.color} border-0` : 'bg-gray-100 text-gray-400'
// //                         }`}>
// //                           <Icon size={14} />
// //                         </div>
// //                         {index < STATUS_FLOW.length - 1 && (
// //                           <div className={`w-0.5 h-8 mt-1 ${isCompleted ? 'bg-amber-200' : 'bg-gray-100'}`} />
// //                         )}
// //                       </div>
// //                       <div className="flex-1 pb-3">
// //                         <div className="flex items-center gap-2 flex-wrap">
// //                           <p className={`font-medium text-sm ${isCompleted ? 'text-gray-800' : 'text-gray-400'}`}>
// //                             {meta.title}
// //                           </p>
// //                           {isCurrent && (
// //                             <span className="inline-block w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
// //                           )}
// //                           {statusTime && (
// //                             <span className="text-xs text-gray-400 ml-2">
// //                               {formatDateTime(statusTime)}
// //                             </span>
// //                           )}
// //                         </div>
// //                         <p className="text-xs text-gray-400 mt-0.5">{meta.desc}</p>
// //                       </div>
// //                     </motion.div>
// //                   );
// //                 })}
// //               </div>
// //             </div>

// //             {/* Pickup Summary */}
// //             <div className="grid md:grid-cols-2 gap-5">
// //               {/* Items */}
// //               <div className="bg-white border border-gray-100 rounded-xl p-5">
// //                 <h2 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
// //                   <ShoppingBag size={16} className="text-amber-600" />
// //                   Order Items
// //                 </h2>
// //                 <div className="space-y-2">
// //                   {order.items?.map((item, idx) => (
// //                     <div key={idx} className="flex justify-between text-sm">
// //                       <span className="text-gray-600">{item.quantity} × {item.name}</span>
// //                       <span className="font-medium text-gray-800">₹{item.totalPrice || item.unitPrice * item.quantity}</span>
// //                     </div>
// //                   ))}
// //                   <div className="border-t border-gray-100 pt-2 mt-2">
// //                     <div className="flex justify-between text-sm">
// //                       <span className="text-gray-500">Subtotal</span>
// //                       <span className="text-gray-700">₹{order.subtotal}</span>
// //                     </div>
// //                     <div className="flex justify-between text-sm">
// //                       <span className="text-gray-500">Tax</span>
// //                       <span className="text-gray-700">₹{order.taxAmount || 0}</span>
// //                     </div>
// //                     {(order.preOrderFee || 0) > 0 && (
// //                       <div className="flex justify-between text-sm">
// //                         <span className="text-gray-500">Pre-order Fee</span>
// //                         <span className="text-gray-700">₹{order.preOrderFee || 0}</span>
// //                       </div>
// //                     )}
// //                     <div className="flex justify-between font-bold text-base pt-2 mt-1 border-t border-gray-100">
// //                       <span className="text-gray-800">Total</span>
// //                       <span className="text-amber-600">₹{order.totalAmount}</span>
// //                     </div>
// //                   </div>
// //                 </div>
// //               </div>

// //               {/* Pickup Info */}
// //               <div className="bg-white border border-gray-100 rounded-xl p-5">
// //                 <h2 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
// //                   <MapPin size={16} className="text-amber-600" />
// //                   Pickup Information
// //                 </h2>
// //                 <div className="space-y-3">
// //                   <div className="bg-gray-50 rounded-lg p-3">
// //                     <p className="text-xs text-gray-500 mb-1">Pickup Location</p>
// //                     <p className="text-sm text-gray-800">Roller Coaster Cafe Counter</p>
// //                     <p className="text-xs text-gray-500 mt-1">Under Nutan School, Juna Road, Opposite Navjeevan Hospital, Bareja, Ahmedabad, Gujarat 382425</p>
// //                   </div>
// //                   <div className="bg-gray-50 rounded-lg p-3">
// //                     <p className="text-xs text-gray-500 mb-1">What to bring</p>
// //                     <p className="text-sm text-gray-800">Order ID or registered phone number</p>
// //                     <p className="text-xs text-gray-500 mt-1">Please show this to our staff at the counter</p>
// //                   </div>
// //                   {order.scheduledTime && (
// //                     <div className="bg-amber-50 rounded-lg p-3">
// //                       <p className="text-xs text-amber-600 mb-1">Scheduled Pickup</p>
// //                       <p className="text-sm font-medium text-amber-800">{formatDateTime(order.scheduledTime)}</p>
// //                     </div>
// //                   )}
// //                 </div>
// //               </div>
// //             </div>

// //             {/* Special Notes */}
// //             {order.specialNotes && (
// //               <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 mt-5">
// //                 <p className="text-sm text-amber-700">
// //                   <span className="font-medium">Note:</span> {order.specialNotes}
// //                 </p>
// //               </div>
// //             )}

// //             {/* Completed Celebration */}
// //             {currentStatus === 'completed' && (
// //               <motion.div
// //                 initial={{ scale: 0, opacity: 0 }}
// //                 animate={{ scale: 1, opacity: 1 }}
// //                 className="mt-5 p-6 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl text-center"
// //               >
// //                 <motion.div
// //                   animate={{ rotate: 360 }}
// //                   transition={{ duration: 0.5 }}
// //                   className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-3"
// //                 >
// //                   <CheckCircle2 size={32} className="text-green-600" />
// //                 </motion.div>
// //                 <h3 className="text-xl font-bold text-gray-800">Order Completed! 🎉</h3>
// //                 <p className="text-sm text-gray-600 mt-1">Thank you for ordering from Roller Coaster Cafe</p>
// //                 <p className="text-xs text-gray-500 mt-2">Enjoy your meal! We hope to serve you again soon.</p>
// //               </motion.div>
// //             )}
// //           </>
// //         )}
// //       </main>

// //       <CustomerFooter />
// //     </div>
// //   );
// // }




// import { useEffect, useState, useMemo } from 'react';
// import { Link, useParams } from 'react-router-dom';
// import { useQuery } from '@tanstack/react-query';
// import { motion } from 'framer-motion';
// import { io } from 'socket.io-client';
// import { ArrowLeft, ShoppingBag, Clock3, MapPin, PackageCheck, CheckCircle2, ChefHat, CalendarDays } from 'lucide-react';
// import api from '../../services/api';
// import toast from 'react-hot-toast';
// import CustomerFooter from '../../components/customer/CustomerFooter';

// const STATUS_FLOW = ['placed', 'confirmed', 'preparing', 'ready', 'completed'];

// const STATUS_META = {
//   placed: { title: 'Order Placed', desc: 'Your order has been received', icon: Clock3, color: 'bg-amber-50 text-amber-600' },
//   confirmed: { title: 'Order Confirmed', desc: 'Restaurant accepted your order', icon: CheckCircle2, color: 'bg-blue-50 text-blue-600' },
//   preparing: { title: 'Preparing', desc: 'Kitchen is preparing your food', icon: ChefHat, color: 'bg-orange-50 text-orange-600' },
//   ready: { title: 'Ready for Pickup', desc: 'Your order is ready at the counter', icon: PackageCheck, color: 'bg-emerald-50 text-emerald-600' },
//   completed: { title: 'Order Completed', desc: 'You have picked up your order', icon: CheckCircle2, color: 'bg-green-50 text-green-600' },
//   cancelled: { title: 'Cancelled', desc: 'Order was cancelled', icon: Clock3, color: 'bg-red-50 text-red-600' },
// };

// const formatDateTime = (value) => {
//   if (!value) return '-';
//   return new Date(value).toLocaleString('en-IN', {
//     day: 'numeric',
//     month: 'short',
//     hour: 'numeric',
//     minute: '2-digit',
//   });
// };

// const formatCurrency = (value) => `₹${Number(value || 0).toLocaleString('en-IN')}`;

// export default function TakeawayTrackingPage() {
//   const { orderId } = useParams();
//   const [liveOrder, setLiveOrder] = useState(null);
//   const [now, setNow] = useState(Date.now());

//   useEffect(() => {
//     const timer = setInterval(() => setNow(Date.now()), 1000);
//     return () => clearInterval(timer);
//   }, []);

//   const { data, isLoading } = useQuery({
//     queryKey: ['takeaway-track', orderId],
//     queryFn: () => api.get(`/orders/${orderId}`).then((res) => res.data),
//     retry: false,
//     refetchInterval: 5000,
//   });

//   useEffect(() => {
//     if (data?.order || data) {
//       setLiveOrder((prev) => ({ ...(prev || {}), ...(data?.order || data) }));
//     }
//   }, [data]);

//   useEffect(() => {
//     if (!orderId) return;

//     const socket = io(import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000', { withCredentials: true });

//     socket.on('connect', () => {
//       socket.emit('join-room', { room: `order:${orderId}` });
//     });

//     socket.on('order-updated', (payload) => {
//       if (String(payload.orderId) === String(orderId)) {
//         setLiveOrder((prev) => ({ ...(prev || {}), ...payload }));
//         if (payload.status === 'ready') {
//           toast.success('Your order is ready for pickup! 🎉');
//         }
//       }
//     });

//     return () => {
//       socket.emit('leave-room', { room: `order:${orderId}` });
//       socket.close();
//     };
//   }, [orderId]);

//   const order = liveOrder || data?.order || data;
//   const currentStatus = order?.status || 'placed';
  
//   const isPreOrderTakeaway = useMemo(() => {
//     const notes = String(order?.specialNotes || '').toLowerCase();
//     return notes.includes('pre-order type: takeaway') || 
//            notes.includes('pre-order takeaway') ||
//            order?.isPreOrder === true;
//   }, [order]);
  
//   const statusMeta = STATUS_META[currentStatus] || STATUS_META.placed;
//   const StatusIcon = statusMeta.icon;
//   const currentIndex = STATUS_FLOW.indexOf(currentStatus);

//   const getStatusTime = (status) => {
//     if (!order?.statusHistory) return null;
//     const historyEntry = order.statusHistory.find(entry => entry.status === status);
//     return historyEntry?.updatedAt || null;
//   };

//   return (
//     <div className="min-h-screen bg-white">
//       {/* Header */}
//       <header className="border-b border-gray-100 bg-white sticky top-0 z-50">
//         <div className="max-w-4xl mx-auto px-4 py-3">
//           <div className="flex items-center justify-between">
//             <Link to="/" className="flex items-center gap-2">
//               <img 
//                 src="https://rollercoastercafe.com/assets/images/roller_logo.png" 
//                 alt="Logo"
//                 className="h-8 w-8 rounded-full object-cover"
//               />
//               <span className="font-semibold text-lg text-gray-800">Roller Coaster Cafe</span>
//             </Link>
//             <Link to="/orders" className="text-sm text-gray-500 hover:text-amber-600 flex items-center gap-1">
//               <ArrowLeft size={14} /> Back to Orders
//             </Link>
//           </div>
//         </div>
//       </header>

//       <main className="max-w-4xl mx-auto px-4 py-6">
//         {isLoading || !order ? (
//           <div className="space-y-4 animate-pulse">
//             <div className="h-32 bg-gray-100 rounded-xl" />
//             <div className="h-64 bg-gray-100 rounded-xl" />
//           </div>
//         ) : (
//           <>
//             {/* Order Header */}
//             <div className="bg-white border border-gray-100 rounded-xl p-5 mb-6">
//               <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
//                 <div>
//                   <div className="flex items-center gap-2 mb-2 flex-wrap">
//                     <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium ${isPreOrderTakeaway ? 'bg-orange-50 text-orange-600' : 'bg-violet-50 text-violet-600'}`}>
//                       {isPreOrderTakeaway ? <CalendarDays size={12} /> : <ShoppingBag size={12} />}
//                       {isPreOrderTakeaway ? 'Pre-Order Takeaway' : 'Takeaway'}
//                     </span>
//                     {isPreOrderTakeaway && order.preOrderFee > 0 && (
//                       <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-600">
//                         +₹{order.preOrderFee} fee
//                       </span>
//                     )}
//                     <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium ${statusMeta.color}`}>
//                       <StatusIcon size={12} /> {statusMeta.title}
//                     </span>
//                   </div>
//                   <h1 className="font-bold text-xl text-gray-800">Order #{order.orderId}</h1>
//                   <p className="text-sm text-gray-400 mt-1">Placed on {formatDateTime(order.createdAt)}</p>
//                   {isPreOrderTakeaway && order.scheduledTime && (
//                     <p className="text-sm text-orange-600 mt-1">Scheduled pickup for {formatDateTime(order.scheduledTime)}</p>
//                   )}
//                 </div>
//                 <div className="text-right">
//                   <div className="text-2xl font-bold text-gray-800">{formatCurrency(order.totalAmount)}</div>
//                   <div className="text-xs text-gray-400 capitalize mt-1">{order.paymentMethod}</div>
//                 </div>
//               </div>
//               <p className="text-sm text-gray-500 leading-relaxed">{statusMeta.desc}</p>
//             </div>

//             {/* Ready for Pickup Banner */}
//             {currentStatus === 'ready' && (
//               <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-5 mb-6">
//                 <div className="flex items-center gap-3">
//                   <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center animate-pulse">
//                     <PackageCheck size={24} className="text-green-600" />
//                   </div>
//                   <div>
//                     <h3 className="font-bold text-lg text-gray-800">Your order is ready for pickup!</h3>
//                     <p className="text-sm text-gray-600">Please head to our counter with your order ID</p>
//                     <p className="text-xs text-green-600 mt-2">Order will be held for 20 minutes</p>
//                   </div>
//                 </div>
//               </div>
//             )}

//             {/* Status Timeline */}
//             <div className="bg-white border border-gray-100 rounded-xl p-5 mb-6">
//               <h2 className="font-semibold text-gray-800 mb-5">Order Status</h2>
//               <div className="relative">
//                 {STATUS_FLOW.map((status, index) => {
//                   const meta = STATUS_META[status];
//                   const Icon = meta.icon;
//                   const isCompleted = currentIndex >= index;
//                   const isCurrent = currentStatus === status;
//                   const statusTime = getStatusTime(status);

//                   if (status === 'completed' && currentStatus !== 'completed') return null;

//                   return (
//                     <motion.div
//                       key={status}
//                       initial={{ opacity: 0, x: -20 }}
//                       animate={{ opacity: 1, x: 0 }}
//                       transition={{ delay: index * 0.1 }}
//                       className="flex gap-3 mb-4 last:mb-0"
//                     >
//                       <div className="flex flex-col items-center">
//                         <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
//                           isCompleted ? `${meta.color} border-0` : 'bg-gray-100 text-gray-400'
//                         }`}>
//                           <Icon size={14} />
//                         </div>
//                         {index < STATUS_FLOW.length - 1 && (
//                           <div className={`w-0.5 h-8 mt-1 ${isCompleted ? 'bg-amber-200' : 'bg-gray-100'}`} />
//                         )}
//                       </div>
//                       <div className="flex-1 pb-3">
//                         <div className="flex items-center gap-2 flex-wrap">
//                           <p className={`font-medium text-sm ${isCompleted ? 'text-gray-800' : 'text-gray-400'}`}>
//                             {meta.title}
//                           </p>
//                           {isCurrent && (
//                             <span className="inline-block w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
//                           )}
//                           {statusTime && (
//                             <span className="text-xs text-gray-400 ml-2">
//                               {formatDateTime(statusTime)}
//                             </span>
//                           )}
//                         </div>
//                         <p className="text-xs text-gray-400 mt-0.5">{meta.desc}</p>
//                       </div>
//                     </motion.div>
//                   );
//                 })}
//               </div>
//             </div>

//             {/* Pickup Summary */}
//             <div className="grid md:grid-cols-2 gap-5">
//               {/* Items */}
//               <div className="bg-white border border-gray-100 rounded-xl p-5">
//                 <h2 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
//                   <ShoppingBag size={16} className="text-amber-600" />
//                   Order Items
//                 </h2>
//                 <div className="space-y-2">
//                   {order.items?.map((item, idx) => (
//                     <div key={idx} className="flex justify-between text-sm">
//                       <span className="text-gray-600">{item.quantity} × {item.name}</span>
//                       <span className="font-medium text-gray-800">{formatCurrency(item.totalPrice || item.unitPrice * item.quantity)}</span>
//                     </div>
//                   ))}
//                   <div className="border-t border-gray-100 pt-2 mt-2">
//                     <div className="flex justify-between text-sm">
//                       <span className="text-gray-500">Subtotal</span>
//                       <span className="text-gray-700">{formatCurrency(order.subtotal)}</span>
//                     </div>
//                     <div className="flex justify-between text-sm">
//                       <span className="text-gray-500">Tax</span>
//                       <span className="text-gray-700">{formatCurrency(order.taxAmount || 0)}</span>
//                     </div>
//                     {isPreOrderTakeaway && (order.preOrderFee || 0) > 0 && (
//                       <div className="flex justify-between text-sm">
//                         <span className="text-gray-500">Pre-order Fee</span>
//                         <span className="text-gray-700">{formatCurrency(order.preOrderFee || 0)}</span>
//                       </div>
//                     )}
//                     <div className="flex justify-between font-bold text-base pt-2 mt-1 border-t border-gray-100">
//                       <span className="text-gray-800">Total</span>
//                       <span className="text-amber-600">{formatCurrency(order.totalAmount)}</span>
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               {/* Pickup Info */}
//               <div className="bg-white border border-gray-100 rounded-xl p-5">
//                 <h2 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
//                   <MapPin size={16} className="text-amber-600" />
//                   Pickup Information
//                 </h2>
//                 <div className="space-y-3">
//                   <div className="bg-gray-50 rounded-lg p-3">
//                     <p className="text-xs text-gray-500 mb-1">Pickup Location</p>
//                     <p className="text-sm text-gray-800">Roller Coaster Cafe Counter</p>
//                     <p className="text-xs text-gray-500 mt-1">Under Nutan School, Juna Road, Opposite Navjeevan Hospital, Ahmedabad, Bareja, Gujarat 382425</p>
//                   </div>
//                   <div className="bg-gray-50 rounded-lg p-3">
//                     <p className="text-xs text-gray-500 mb-1">What to bring</p>
//                     <p className="text-sm text-gray-800">Order ID or registered phone number</p>
//                     <p className="text-xs text-gray-500 mt-1">Please show this to our staff at the counter</p>
//                   </div>
//                   {order.scheduledTime && (
//                     <div className="bg-amber-50 rounded-lg p-3">
//                       <p className="text-xs text-amber-600 mb-1">Scheduled Pickup</p>
//                       <p className="text-sm font-medium text-amber-800">{formatDateTime(order.scheduledTime)}</p>
//                     </div>
//                   )}
//                 </div>
//               </div>
//             </div>

//             {/* Special Notes */}
//             {order.specialNotes && (
//               <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 mt-5">
//                 <p className="text-sm text-amber-700">
//                   <span className="font-medium">Note:</span> {order.specialNotes}
//                 </p>
//               </div>
//             )}

//             {/* Completed Celebration */}
//             {currentStatus === 'completed' && (
//               <motion.div
//                 initial={{ scale: 0, opacity: 0 }}
//                 animate={{ scale: 1, opacity: 1 }}
//                 className="mt-5 p-6 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl text-center"
//               >
//                 <motion.div
//                   animate={{ rotate: 360 }}
//                   transition={{ duration: 0.5 }}
//                   className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-3"
//                 >
//                   <CheckCircle2 size={32} className="text-green-600" />
//                 </motion.div>
//                 <h3 className="text-xl font-bold text-gray-800">Order Completed! 🎉</h3>
//                 <p className="text-sm text-gray-600 mt-1">Thank you for ordering from Roller Coaster Cafe</p>
//                 <p className="text-xs text-gray-500 mt-2">Enjoy your meal! We hope to serve you again soon.</p>
//               </motion.div>
//             )}
//           </>
//         )}
//       </main>

//       <CustomerFooter />
//     </div>
//   );
// }
import { useEffect, useState, useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { io } from 'socket.io-client';
import { 
  ArrowLeft, ShoppingBag, Clock3, MapPin, PackageCheck, CheckCircle2, 
  ChefHat, CalendarDays, Package, Phone, User, FileText
} from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';
import CustomerFooter from '../../components/customer/CustomerFooter';

const STATUS_FLOW = ['placed', 'confirmed', 'preparing', 'ready', 'completed'];

const STATUS_META = {
  placed: { title: 'Order Placed', desc: 'Your order has been received', icon: Clock3, color: 'bg-amber-50 text-amber-600' },
  confirmed: { title: 'Order Confirmed', desc: 'Restaurant accepted your order', icon: CheckCircle2, color: 'bg-blue-50 text-blue-600' },
  preparing: { title: 'Preparing', desc: 'Kitchen is preparing your food', icon: ChefHat, color: 'bg-orange-50 text-orange-600' },
  ready: { title: 'Ready for Pickup', desc: 'Your order is ready at the counter', icon: PackageCheck, color: 'bg-emerald-50 text-emerald-600' },
  completed: { title: 'Order Completed', desc: 'You have picked up your order', icon: CheckCircle2, color: 'bg-green-50 text-green-600' },
  cancelled: { title: 'Cancelled', desc: 'Order was cancelled', icon: Clock3, color: 'bg-red-50 text-red-600' },
};

const formatDateTime = (value) => {
  if (!value) return '-';
  return new Date(value).toLocaleString('en-IN', {
    day: 'numeric',
    month: 'short',
    hour: 'numeric',
    minute: '2-digit',
  });
};

const formatCurrency = (value) => `₹${Number(value || 0).toLocaleString('en-IN')}`;

const getSocketBaseUrl = () => (
  import.meta.env.VITE_SOCKET_URL ||
  import.meta.env.VITE_API_URL?.replace('/api', '') ||
  'http://localhost:5000'
);

export default function TakeawayTrackingPage() {
  const { orderId } = useParams();
  const [liveOrder, setLiveOrder] = useState(null);

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['takeaway-track', orderId],
    queryFn: () => api.get(`/orders/${orderId}`).then((res) => res.data),
    retry: false,
    refetchInterval: 5000,
  });

  useEffect(() => {
    if (data?.order || data) {
      setLiveOrder((prev) => ({ ...(prev || {}), ...(data?.order || data) }));
    }
  }, [data]);

  useEffect(() => {
    if (!orderId) return;

    const socket = io(getSocketBaseUrl(), { withCredentials: true });

    socket.on('connect', () => {
      socket.emit('join-room', { room: `order:${orderId}` });
    });

    socket.on('order-updated', (payload) => {
      if (String(payload.orderId) === String(orderId)) {
        setLiveOrder((prev) => ({ ...(prev || {}), ...payload }));
        if (payload.status === 'ready') {
          toast.success('Your order is ready for pickup! 🎉');
        } else if (payload.status === 'completed') {
          toast.success('Order completed! Thank you!');
        }
        refetch();
      }
    });

    return () => {
      socket.emit('leave-room', { room: `order:${orderId}` });
      socket.close();
    };
  }, [orderId, refetch]);

  const order = liveOrder || data?.order || data;
  const currentStatus = order?.status || 'placed';
  
  const isPreOrderTakeaway = useMemo(() => {
    const notes = String(order?.specialNotes || '').toLowerCase();
    return notes.includes('pre-order type: takeaway') || 
           notes.includes('pre-order takeaway') ||
           order?.isPreOrder === true;
  }, [order]);
  
  const statusMeta = STATUS_META[currentStatus] || STATUS_META.placed;
  const StatusIcon = statusMeta.icon;
  const currentIndex = STATUS_FLOW.indexOf(currentStatus);

  const getStatusTime = (status) => {
    if (!order?.statusHistory) return null;
    const historyEntry = order.statusHistory.find(entry => entry.status === status);
    return historyEntry?.updatedAt || null;
  };

  if (isLoading || !order) {
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-4xl mx-auto px-4 py-8 animate-pulse">
          <div className="h-32 bg-gray-100 rounded-xl mb-4" />
          <div className="h-64 bg-gray-100 rounded-xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-gray-100 bg-white sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2">
              <img 
                src="https://rollercoastercafe.com/assets/images/roller_logo.png" 
                alt="Logo"
                className="h-8 w-8 rounded-full object-cover"
              />
              <span className="font-semibold text-lg text-gray-800">Roller Coaster Cafe</span>
            </Link>
            <Link to="/orders" className="text-sm text-gray-500 hover:text-amber-600 flex items-center gap-1">
              <ArrowLeft size={14} /> Back to Orders
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6">
        {/* Pre-order Banner */}
        {isPreOrderTakeaway && order.scheduledTime && (
          <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 mb-6">
            <div className="flex items-center gap-3">
              <CalendarDays size={24} className="text-orange-600" />
              <div>
                <h3 className="font-semibold text-orange-800">Pre-order Takeaway</h3>
                <p className="text-sm text-orange-700">
                  Scheduled for {formatDateTime(order.scheduledTime)}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Order Header */}
        <div className="bg-white border border-gray-100 rounded-xl p-5 mb-6 shadow-sm">
          <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
            <div>
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium ${isPreOrderTakeaway ? 'bg-orange-50 text-orange-600' : 'bg-violet-50 text-violet-600'}`}>
                  {isPreOrderTakeaway ? <CalendarDays size={12} /> : <ShoppingBag size={12} />}
                  {isPreOrderTakeaway ? 'Pre-order Takeaway' : 'Takeaway'}
                </span>
                {isPreOrderTakeaway && order.preOrderFee > 0 && (
                  <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-600">
                    +₹{order.preOrderFee} fee
                  </span>
                )}
                <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium ${statusMeta.color}`}>
                  <StatusIcon size={12} /> {statusMeta.title}
                </span>
              </div>
              <h1 className="font-bold text-xl text-gray-800">Order #{order.orderId}</h1>
              <p className="text-sm text-gray-400 mt-1">Placed on {formatDateTime(order.createdAt)}</p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-gray-800">{formatCurrency(order.totalAmount)}</div>
              <div className="text-xs text-gray-400 capitalize mt-1">{order.paymentMethod}</div>
            </div>
          </div>
          <p className="text-sm text-gray-500 leading-relaxed">{statusMeta.desc}</p>
        </div>

        {/* Ready for Pickup Banner */}
        {currentStatus === 'ready' && (
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-5 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center animate-pulse">
                <PackageCheck size={24} className="text-green-600" />
              </div>
              <div>
                <h3 className="font-bold text-lg text-gray-800">Your order is ready for pickup!</h3>
                <p className="text-sm text-gray-600">Please head to our counter with your order ID</p>
                <p className="text-xs text-green-600 mt-2">Order will be held for 20 minutes</p>
              </div>
            </div>
          </div>
        )}

        {/* Status Timeline */}
        <div className="bg-white border border-gray-100 rounded-xl p-5 mb-6 shadow-sm">
          <h2 className="font-semibold text-gray-800 mb-5">Order Status</h2>
          <div className="relative">
            {STATUS_FLOW.map((status, index) => {
              const meta = STATUS_META[status];
              if (!meta) return null;
              const Icon = meta.icon;
              const isCompleted = currentIndex >= index;
              const isCurrent = currentStatus === status;
              const statusTime = getStatusTime(status);

              if (status === 'completed' && currentStatus !== 'completed') return null;

              return (
                <div key={status} className="flex gap-3 mb-4 last:mb-0">
                  <div className="flex flex-col items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      isCompleted ? meta.color : 'bg-gray-100 text-gray-400'
                    }`}>
                      <Icon size={14} />
                    </div>
                    {index < STATUS_FLOW.length - 1 && (
                      <div className={`w-0.5 h-8 mt-1 ${isCompleted ? 'bg-amber-200' : 'bg-gray-200'}`} />
                    )}
                  </div>
                  <div className="flex-1 pb-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className={`text-sm font-medium ${isCompleted ? 'text-gray-800' : 'text-gray-400'}`}>
                        {meta.title}
                      </p>
                      {isCurrent && (
                        <span className="inline-block w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                      )}
                      {statusTime && (
                        <span className="text-xs text-gray-400">{formatDateTime(statusTime)}</span>
                      )}
                    </div>
                    <p className="text-xs text-gray-400 mt-0.5">{meta.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Order Items */}
        <div className="bg-white border border-gray-100 rounded-xl p-5 mb-6 shadow-sm">
          <h2 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
            <Package size={16} className="text-amber-600" />
            Order Items
          </h2>
          <div className="space-y-2">
            {order.items?.map((item, idx) => (
              <div key={idx} className="flex justify-between py-2 border-b border-gray-100 last:border-0">
                <div>
                  <p className="font-medium text-gray-800">{item.name}</p>
                  <p className="text-xs text-gray-500">Quantity: {item.quantity}</p>
                </div>
                <p className="font-semibold text-gray-800">{formatCurrency(item.totalPrice || item.unitPrice * item.quantity)}</p>
              </div>
            ))}
            <div className="border-t border-gray-100 pt-3 mt-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Subtotal</span>
                <span>{formatCurrency(order.subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Tax</span>
                <span>{formatCurrency(order.taxAmount || 0)}</span>
              </div>
              {isPreOrderTakeaway && (order.preOrderFee || 0) > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Pre-order Fee</span>
                  <span>{formatCurrency(order.preOrderFee || 0)}</span>
                </div>
              )}
              <div className="flex justify-between font-bold text-base pt-2 mt-1 border-t border-gray-100">
                <span className="text-gray-800">Total</span>
                <span className="text-amber-600">{formatCurrency(order.totalAmount)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Pickup Info */}
        <div className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm">
          <h2 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
            <MapPin size={16} className="text-amber-600" />
            Pickup Information
          </h2>
          <div className="space-y-3">
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-xs text-gray-500 mb-1">Pickup Location</p>
              <p className="text-sm text-gray-800">Roller Coaster Cafe Counter</p>
              <p className="text-xs text-gray-500 mt-1">Under Nutan School, Juna Road, Opposite Navjeevan Hospital, Ahmedabad, Bareja, Gujarat 382425</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-xs text-gray-500 mb-1">What to bring</p>
              <p className="text-sm text-gray-800">Order ID or registered phone number</p>
            </div>
            {order.scheduledTime && (
              <div className="bg-amber-50 rounded-lg p-3">
                <p className="text-xs text-amber-600 mb-1">Scheduled Pickup</p>
                <p className="text-sm font-medium text-amber-800">{formatDateTime(order.scheduledTime)}</p>
              </div>
            )}
          </div>
        </div>

        {/* Special Notes */}
        {order.specialNotes && (
          <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 mt-5">
            <p className="text-sm text-amber-700">
              <span className="font-medium">Note:</span> {order.specialNotes}
            </p>
          </div>
        )}

        {/* Invoice Button for Completed Orders */}
        {currentStatus === 'completed' && (
          <div className="mt-6">
            <Link 
              to={`/invoice/${order._id}`}
              target="_blank"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all"
            >
              <FileText size={16} /> Download Invoice
            </Link>
          </div>
        )}

        {/* Completed Celebration */}
        {currentStatus === 'completed' && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="mt-6 p-6 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl text-center"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 0.5 }}
              className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-3"
            >
              <CheckCircle2 size={32} className="text-green-600" />
            </motion.div>
            <h3 className="text-xl font-bold text-gray-800">Order Completed! 🎉</h3>
            <p className="text-sm text-gray-600 mt-1">Thank you for ordering from Roller Coaster Cafe</p>
          </motion.div>
        )}
      </main>

      <CustomerFooter />
    </div>
  );
}