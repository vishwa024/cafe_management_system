// // import { useEffect, useState } from 'react';
// // import { Link, useParams } from 'react-router-dom';
// // import { useQuery } from '@tanstack/react-query';
// // import { motion } from 'framer-motion';
// // import { io } from 'socket.io-client';
// // import { ArrowLeft, CalendarDays, Clock3, PackageCheck, CheckCircle2, ShoppingBag, MapPin, ChefHat } from 'lucide-react';
// // import api from '../../services/api';
// // import toast from 'react-hot-toast';
// // import CustomerFooter from '../../components/customer/CustomerFooter';

// // const STATUS_FLOW = ['placed', 'confirmed', 'preparing', 'ready', 'completed'];

// // const STATUS_META = {
// //   placed: { title: 'Pre-Order Placed', desc: 'Your pre-order has been scheduled', icon: CalendarDays, color: 'bg-amber-50 text-amber-600' },
// //   confirmed: { title: 'Order Confirmed', desc: 'Kitchen accepted your order', icon: CheckCircle2, color: 'bg-blue-50 text-blue-600' },
// //   preparing: { title: 'Preparing', desc: 'Kitchen is preparing your order', icon: ChefHat, color: 'bg-orange-50 text-orange-600' },
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

// // const formatCurrency = (value) => `?${Number(value || 0).toLocaleString('en-IN')}`;

// // export default function PreOrderTrackingPage() {
// //   const { orderId } = useParams();
// //   const [liveOrder, setLiveOrder] = useState(null);
// //   const [now, setNow] = useState(Date.now());

// //   useEffect(() => {
// //     const timer = setInterval(() => setNow(Date.now()), 1000);
// //     return () => clearInterval(timer);
// //   }, []);

// //   const { data, isLoading } = useQuery({
// //     queryKey: ['preorder-track', orderId],
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
// //           toast.success('Your pre-order is ready for pickup! 🎉');
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
// //   const statusMeta = STATUS_META[currentStatus] || STATUS_META.placed;
// //   const StatusIcon = statusMeta.icon;
// //   const currentIndex = STATUS_FLOW.indexOf(currentStatus);
// //   const scheduledTime = order?.scheduledTime;
// //   const isScheduledPassed = scheduledTime && new Date(scheduledTime) < new Date();

// //   const getStatusTime = (status) => {
// //     if (!order?.statusHistory) return null;
// //     const historyEntry = order.statusHistory.find(entry => entry.status === status);
// //     return historyEntry?.updatedAt || null;
// //   };

// //   // Countdown to scheduled time
// //   const getCountdown = () => {
// //     if (!scheduledTime || currentStatus !== 'placed') return null;
// //     const remainingMs = new Date(scheduledTime).getTime() - Date.now();
// //     if (remainingMs <= 0) return null;
// //     const hours = Math.floor(remainingMs / (1000 * 60 * 60));
// //     const minutes = Math.floor((remainingMs % (1000 * 60 * 60)) / (1000 * 60));
// //     if (hours > 0) return `${hours}h ${minutes}m`;
// //     return `${minutes} minutes`;
// //   };

// //   const countdown = getCountdown();

// //   return (
// //     <div className="min-h-screen bg-white">
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
// //                     <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium bg-purple-50 text-purple-600">
// //                       <CalendarDays size={12} /> Pre-Order
// //                     </span>
// //                     <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium ${statusMeta.color}`}>
// //                       <StatusIcon size={12} /> {statusMeta.title}
// //                     </span>
// //                   </div>
// //                   <h1 className="font-bold text-xl text-gray-800">Order #{order.orderId}</h1>
// //                   <p className="text-sm text-gray-400 mt-1">Placed on {formatDateTime(order.createdAt)}</p>
// //                 </div>
// //                 <div className="text-right">
// //                   <div className="text-2xl font-bold text-gray-800">{formatCurrency(order.totalAmount)}</div>
// //                   <div className="text-xs text-gray-400 capitalize mt-1">{order.paymentMethod}</div>
// //                 </div>
// //               </div>
// //               <p className="text-sm text-gray-500 leading-relaxed">{statusMeta.desc}</p>
// //             </div>

// //             {/* Scheduled Time Banner */}
// //             {scheduledTime && currentStatus !== 'completed' && (
// //               <div className="bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200 rounded-xl p-5 mb-6">
// //                 <div className="flex items-center gap-3">
// //                   <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
// //                     <CalendarDays size={24} className="text-purple-600" />
// //                   </div>
// //                   <div>
// //                     <h3 className="font-bold text-lg text-gray-800">Scheduled Pickup Time</h3>
// //                     <p className="text-sm text-gray-600">{formatDateTime(scheduledTime)}</p>
// //                     {countdown && currentStatus === 'placed' && (
// //                       <p className="text-xs text-purple-600 mt-1">Order will be ready in {countdown}</p>
// //                     )}
// //                     {isScheduledPassed && currentStatus === 'placed' && (
// //                       <p className="text-xs text-amber-600 mt-1">Your order should be ready soon</p>
// //                     )}
// //                   </div>
// //                 </div>
// //               </div>
// //             )}

// //             {/* Ready for Pickup Banner */}
// //             {currentStatus === 'ready' && (
// //               <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-5 mb-6">
// //                 <div className="flex items-center gap-3">
// //                   <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center animate-pulse">
// //                     <PackageCheck size={24} className="text-green-600" />
// //                   </div>
// //                   <div>
// //                     <h3 className="font-bold text-lg text-gray-800">Your pre-order is ready!</h3>
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

// //             {/* Order Items */}
// //             <div className="bg-white border border-gray-100 rounded-xl p-5">
// //               <h2 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
// //                 <ShoppingBag size={16} className="text-amber-600" />
// //                 Order Items
// //               </h2>
// //               <div className="space-y-2">
// //                 {order.items?.map((item, idx) => (
// //                   <div key={idx} className="flex justify-between text-sm">
// //                     <span className="text-gray-600">{item.quantity} × {item.name}</span>
// //                     <span className="font-medium text-gray-800">₹{item.totalPrice || item.unitPrice * item.quantity}</span>
// //                   </div>
// //                 ))}
// //                 <div className="border-t border-gray-100 pt-2 mt-2">
// //                   <div className="flex justify-between text-sm">
// //                     <span className="text-gray-500">Subtotal</span>
// //                     <span className="text-gray-700">₹{order.subtotal}</span>
// //                   </div>
// //                   <div className="flex justify-between text-sm">
// //                     <span className="text-gray-500">Pre-order Fee</span>
// //                     <span className="text-gray-700">₹{order.preOrderFee || 49}</span>
// //                   </div>
// //                   <div className="flex justify-between text-sm">
// //                     <span className="text-gray-500">Tax</span>
// //                     <span className="text-gray-700">₹{order.taxAmount || 0}</span>
// //                   </div>
// //                   <div className="flex justify-between font-bold text-base pt-2 mt-1 border-t border-gray-100">
// //                     <span className="text-gray-800">Total</span>
// //                     <span className="text-amber-600">₹{order.totalAmount}</span>
// //                   </div>
// //                 </div>
// //               </div>
// //             </div>

// //             {/* Pickup Info */}
// //             <div className="bg-white border border-gray-100 rounded-xl p-5 mt-5">
// //               <h2 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
// //                 <MapPin size={16} className="text-amber-600" />
// //                 Pickup Information
// //               </h2>
// //               <div className="space-y-3">
// //                 <div className="bg-gray-50 rounded-lg p-3">
// //                   <p className="text-xs text-gray-500 mb-1">Pickup Location</p>
// //                   <p className="text-sm text-gray-800">Roller Coaster Cafe Counter</p>
// //                   <p className="text-xs text-gray-500 mt-1">Under Nutan School, Juna Road, Opposite Navjeevan Hospital, Ahmedabad, Bareja, Gujarat 382425</p>
// //                 </div>
// //                 {order.preOrderArea && (
// //                   <div className="bg-gray-50 rounded-lg p-3">
// //                     <p className="text-xs text-gray-500 mb-1">Arrival Area</p>
// //                     <p className="text-sm text-gray-800">{order.preOrderArea}</p>
// //                   </div>
// //                 )}
// //                 <div className="bg-gray-50 rounded-lg p-3">
// //                   <p className="text-xs text-gray-500 mb-1">Pickup Window</p>
// //                   <p className="text-sm text-gray-800">
// //                     {currentStatus === 'ready'
// //                       ? 'Ready now at the counter'
// //                       : scheduledTime
// //                       ? formatDateTime(scheduledTime)
// //                       : 'Will appear once the order is scheduled'}
// //                   </p>
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
// //                 <p className="text-sm text-gray-600 mt-1">Thank you for choosing Roller Coaster Cafe</p>
// //                 <p className="text-xs text-gray-500 mt-2">We hope you enjoyed your meal!</p>
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
// import { 
//   ArrowLeft, CalendarDays, Clock3, PackageCheck, CheckCircle2, 
//   ShoppingBag, MapPin, ChefHat, Bike, Truck, Phone, Navigation, 
//   ShieldCheck, Copy, Check, WifiOff, RefreshCw
// } from 'lucide-react';
// import api from '../../services/api';
// import toast from 'react-hot-toast';
// import CustomerFooter from '../../components/customer/CustomerFooter';

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

// const formatTimeAgo = (value) => {
//   if (!value) return 'Not yet';
//   const now = new Date();
//   const past = new Date(value);
//   const diffMins = Math.floor((now - past) / 60000);
//   if (diffMins < 1) return 'Just now';
//   if (diffMins < 60) return `${diffMins} min ago`;
//   return `${Math.floor(diffMins / 60)} hour${Math.floor(diffMins / 60) > 1 ? 's' : ''} ago`;
// };

// const toNumber = (value) => (typeof value === 'number' ? value : Number(value));
// const hasCoordinates = (location) => Number.isFinite(toNumber(location?.lat)) && Number.isFinite(toNumber(location?.lng));
// const buildGoogleMapLink = (location) => {
//   if (!hasCoordinates(location)) return '';
//   return `https://www.google.com/maps?q=${location.lat},${location.lng}`;
// };

// // Status flow based on order type
// const getStatusFlow = (orderType, currentStatus) => {
//   if (orderType === 'delivery') {
//     return ['placed', 'confirmed', 'preparing', 'ready', 'out-for-delivery', 'delivered'];
//   }
//   return ['placed', 'confirmed', 'preparing', 'ready', 'completed'];
// };

// const STATUS_META = {
//   placed: { title: 'Pre-Order Placed', desc: 'Your pre-order has been scheduled', icon: CalendarDays, color: 'bg-amber-50 text-amber-600' },
//   confirmed: { title: 'Order Confirmed', desc: 'Kitchen accepted your order', icon: CheckCircle2, color: 'bg-blue-50 text-blue-600' },
//   preparing: { title: 'Preparing', desc: 'Kitchen is preparing your order', icon: ChefHat, color: 'bg-orange-50 text-orange-600' },
//   ready: { title: 'Ready', desc: 'Your order is ready', icon: PackageCheck, color: 'bg-emerald-50 text-emerald-600' },
//   'out-for-delivery': { title: 'Out for Delivery', desc: 'Rider is on the way!', icon: Bike, color: 'bg-indigo-50 text-indigo-600' },
//   delivered: { title: 'Delivered', desc: 'Order delivered successfully', icon: Truck, color: 'bg-green-50 text-green-600' },
//   completed: { title: 'Order Completed', desc: 'You have received your order', icon: CheckCircle2, color: 'bg-green-50 text-green-600' },
//   cancelled: { title: 'Cancelled', desc: 'Order was cancelled', icon: Clock3, color: 'bg-red-50 text-red-600' },
// };

// const getSocketBaseUrl = () => (
//   import.meta.env.VITE_SOCKET_URL ||
//   import.meta.env.VITE_API_URL?.replace('/api', '') ||
//   'http://localhost:5000'
// );

// export default function PreOrderTrackingPage() {
//   const { orderId } = useParams();
//   const [liveOrder, setLiveOrder] = useState(null);
//   const [now, setNow] = useState(Date.now());
//   const [copied, setCopied] = useState(false);
//   const [simulatedLocation, setSimulatedLocation] = useState(null);
//   const [progressPercent, setProgressPercent] = useState(0);
//   const [isConnected, setIsConnected] = useState(true);

//   useEffect(() => {
//     const timer = setInterval(() => setNow(Date.now()), 1000);
//     return () => clearInterval(timer);
//   }, []);

//   const { data, isLoading, refetch } = useQuery({
//     queryKey: ['preorder-track', orderId],
//     queryFn: () => api.get(`/orders/${orderId}`).then((res) => res.data),
//     retry: false,
//     refetchInterval: 10000,
//   });

//   useEffect(() => {
//     if (data?.order || data) {
//       setLiveOrder((prev) => ({ ...(prev || {}), ...(data?.order || data) }));
//     }
//   }, [data]);

//   // Check if this pre-order is for delivery (check specialNotes)
//   const isDeliveryPreOrder = useMemo(() => {
//     const notes = String(liveOrder?.specialNotes || data?.specialNotes || '').toLowerCase();
//     return notes.includes('pre-order type: delivery') || 
//            notes.includes('delivery') ||
//            liveOrder?.orderType === 'delivery' ||
//            data?.orderType === 'delivery';
//   }, [liveOrder, data]);

//   // Timer-based location simulation for delivery
//   useEffect(() => {
//     const order = liveOrder || data?.order || data;
    
//     if (isDeliveryPreOrder && order?.status === 'out-for-delivery' && order?.estimatedDeliveryAt && order?.deliveryAcceptedAt) {
//       const startTime = new Date(order.deliveryAcceptedAt).getTime();
//       const endTime = new Date(order.estimatedDeliveryAt).getTime();
//       const currentTime = Date.now();
      
//       let percent = ((currentTime - startTime) / (endTime - startTime)) * 100;
//       percent = Math.min(100, Math.max(0, percent));
//       setProgressPercent(percent);
      
//       const restaurantLat = order.restaurantLocation?.lat || 23.0368;
//       const restaurantLng = order.restaurantLocation?.lng || 72.5477;
//       const customerLat = order?.deliveryAddress?.lat || 23.0400;
//       const customerLng = order?.deliveryAddress?.lng || 72.5500;
      
//       const lat = restaurantLat + (customerLat - restaurantLat) * (percent / 100);
//       const lng = restaurantLng + (customerLng - restaurantLng) * (percent / 100);
//       setSimulatedLocation({ lat, lng });
      
//       if (percent >= 100) {
//         setProgressPercent(100);
//       }
//     } else {
//       setProgressPercent(0);
//       setSimulatedLocation(null);
//     }
//   }, [liveOrder, data, now, isDeliveryPreOrder]);

//   // WebSocket connection
//   useEffect(() => {
//     if (!orderId) return;

//     const socket = io(getSocketBaseUrl(), { 
//       withCredentials: true,
//       transports: ['websocket', 'polling']
//     });

//     socket.on('connect', () => {
//       setIsConnected(true);
//       socket.emit('join-room', { room: `order:${orderId}` });
//     });

//     socket.on('disconnect', () => setIsConnected(false));
//     socket.on('connect_error', () => setIsConnected(false));

//     socket.on('order-updated', (payload) => {
//       if (String(payload.orderId) === String(orderId)) {
//         setLiveOrder((prev) => ({ ...(prev || {}), ...payload }));
//         if (payload.status === 'delivered') {
//           toast.success('Order Delivered! Thank you for ordering with us! 🎉');
//         } else if (payload.status === 'ready' && !isDeliveryPreOrder) {
//           toast.success('Your pre-order is ready for pickup! 🎉');
//         } else if (payload.status === 'out-for-delivery') {
//           toast.success('Your order is out for delivery! 🚚');
//         }
//         refetch();
//       }
//     });

//     socket.on('agent-location', (payload) => {
//       setLiveOrder((prev) => ({
//         ...(prev || {}),
//         liveLocation: {
//           lat: payload.lat,
//           lng: payload.lng,
//           updatedAt: payload.timestamp ? new Date(payload.timestamp).toISOString() : new Date().toISOString(),
//         },
//       }));
//     });

//     return () => {
//       socket.emit('leave-room', { room: `order:${orderId}` });
//       socket.close();
//     };
//   }, [orderId, refetch, isDeliveryPreOrder]);

//   const order = liveOrder || data?.order || data;
//   const currentStatus = order?.status || 'placed';
//   const statusMeta = STATUS_META[currentStatus] || STATUS_META.placed;
//   const StatusIcon = statusMeta.icon;
//   const scheduledTime = order?.scheduledTime;
//   const isScheduledPassed = scheduledTime && new Date(scheduledTime) < new Date();

//   const statusFlow = getStatusFlow(isDeliveryPreOrder ? 'delivery' : 'pickup', currentStatus);
//   const currentIndex = statusFlow.indexOf(currentStatus);

//   const getStatusTime = (status) => {
//     if (!order?.statusHistory) return null;
//     const historyEntry = order.statusHistory.find(entry => entry.status === status);
//     return historyEntry?.updatedAt || null;
//   };

//   const getCountdown = () => {
//     if (!scheduledTime || currentStatus !== 'placed') return null;
//     const remainingMs = new Date(scheduledTime).getTime() - Date.now();
//     if (remainingMs <= 0) return null;
//     const hours = Math.floor(remainingMs / (1000 * 60 * 60));
//     const minutes = Math.floor((remainingMs % (1000 * 60 * 60)) / (1000 * 60));
//     if (hours > 0) return `${hours}h ${minutes}m`;
//     return `${minutes} minutes`;
//   };

//   const countdown = getCountdown();

//   const hasRealLiveLocation = Number.isFinite(toNumber(order?.liveLocation?.lat)) && Number.isFinite(toNumber(order?.liveLocation?.lng));
//   const displayLocation = hasRealLiveLocation ? order?.liveLocation : simulatedLocation;
//   const hasTracking = isDeliveryPreOrder && currentStatus === 'out-for-delivery';

//   const lastLocationUpdate = useMemo(() => {
//     if (!order?.liveLocation?.updatedAt) return null;
//     return formatTimeAgo(order.liveLocation?.updatedAt);
//   }, [order?.liveLocation?.updatedAt, now]);

//   const locationCoordinates = useMemo(() => {
//     if (!displayLocation) return 'Waiting for live location';
//     const lat = toNumber(displayLocation?.lat);
//     const lng = toNumber(displayLocation?.lng);
//     if (!Number.isFinite(lat) || !Number.isFinite(lng)) return 'Waiting for location';
//     return `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
//   }, [displayLocation]);

//   const copyOTP = async () => {
//     if (order?.deliveryOTP) {
//       await navigator.clipboard.writeText(order.deliveryOTP);
//       setCopied(true);
//       toast.success('OTP copied! Share it with the delivery partner');
//       setTimeout(() => setCopied(false), 2000);
//     }
//   };

//   const getStatusMessage = () => {
//     if (progressPercent < 25) return 'Rider is leaving the restaurant';
//     if (progressPercent < 50) return 'Rider is on the way';
//     if (progressPercent < 75) return 'Rider is getting closer';
//     if (progressPercent < 100) return 'Rider is almost there!';
//     return 'Arriving shortly';
//   };

//   if (isLoading || !order) {
//     return (
//       <div className="min-h-screen bg-white">
//         <header className="border-b border-gray-100 bg-white sticky top-0 z-50">
//           <div className="max-w-4xl mx-auto px-4 py-3">
//             <div className="flex items-center justify-between">
//               <Link to="/" className="flex items-center gap-2">
//                 <img 
//                   src="https://rollercoastercafe.com/assets/images/roller_logo.png" 
//                   alt="Logo"
//                   className="h-8 w-8 rounded-full object-cover"
//                 />
//                 <span className="font-semibold text-lg text-gray-800">Roller Coaster Cafe</span>
//               </Link>
//             </div>
//           </div>
//         </header>
//         <main className="max-w-4xl mx-auto px-4 py-6">
//           <div className="space-y-4 animate-pulse">
//             <div className="h-32 bg-gray-100 rounded-xl" />
//             <div className="h-64 bg-gray-100 rounded-xl" />
//           </div>
//         </main>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-white">
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
//         {/* Connection Status */}
//         {!isConnected && (
//           <div className="mb-4 flex items-center justify-center gap-2 text-xs text-red-500 bg-red-50 px-3 py-2 rounded-full">
//             <WifiOff size={12} />
//             <span>Reconnecting for live updates...</span>
//           </div>
//         )}

//         {/* Order Header */}
//         <div className="bg-white border border-gray-100 rounded-xl p-5 mb-6 shadow-sm">
//           <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
//             <div>
//               <div className="flex items-center gap-2 mb-2 flex-wrap">
//                 <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium bg-purple-50 text-purple-600">
//                   <CalendarDays size={12} /> Pre-Order
//                 </span>
//                 {isDeliveryPreOrder && (
//                   <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium bg-sky-50 text-sky-600">
//                     <Truck size={12} /> Delivery
//                   </span>
//                 )}
//                 <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium ${statusMeta.color}`}>
//                   <StatusIcon size={12} /> {statusMeta.title}
//                 </span>
//               </div>
//               <h1 className="font-bold text-xl text-gray-800">Order #{order.orderId}</h1>
//               <p className="text-sm text-gray-400 mt-1">Placed on {formatDateTime(order.createdAt)}</p>
//             </div>
//             <div className="text-right">
//               <div className="text-2xl font-bold text-gray-800">{formatCurrency(order.totalAmount)}</div>
//               <div className="text-xs text-gray-400 capitalize mt-1">{order.paymentMethod}</div>
//             </div>
//           </div>
//           <p className="text-sm text-gray-500 leading-relaxed">{statusMeta.desc}</p>
//         </div>

//         {/* Scheduled Time Banner (for pickup pre-orders) */}
//         {!isDeliveryPreOrder && scheduledTime && currentStatus !== 'completed' && currentStatus !== 'delivered' && (
//           <div className="bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200 rounded-xl p-5 mb-6">
//             <div className="flex items-center gap-3">
//               <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
//                 <CalendarDays size={24} className="text-purple-600" />
//               </div>
//               <div>
//                 <h3 className="font-bold text-lg text-gray-800">Scheduled Pickup Time</h3>
//                 <p className="text-sm text-gray-600">{formatDateTime(scheduledTime)}</p>
//                 {countdown && currentStatus === 'placed' && (
//                   <p className="text-xs text-purple-600 mt-1">Order will be ready in {countdown}</p>
//                 )}
//                 {isScheduledPassed && currentStatus === 'placed' && (
//                   <p className="text-xs text-amber-600 mt-1">Your order should be ready soon</p>
//                 )}
//               </div>
//             </div>
//           </div>
//         )}

//         {/* OTP Section (for delivery pre-orders) */}
//         {isDeliveryPreOrder && currentStatus === 'out-for-delivery' && order.deliveryOTP && (
//           <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl p-5 mb-6">
//             <div className="flex items-center gap-3 mb-3">
//               <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center">
//                 <ShieldCheck size={18} className="text-amber-600" />
//               </div>
//               <div>
//                 <h3 className="font-semibold text-gray-800">Delivery OTP Required</h3>
//                 <p className="text-sm text-gray-500">Share this OTP with the delivery partner to complete delivery</p>
//               </div>
//             </div>
//             <div className="flex items-center justify-between bg-white rounded-xl p-4 border border-amber-200">
//               <div>
//                 <p className="text-xs text-gray-500 uppercase tracking-wide">Your One-Time Password</p>
//                 <p className="text-3xl font-bold tracking-widest text-gray-800 mt-1">{order.deliveryOTP}</p>
//               </div>
//               <button
//                 onClick={copyOTP}
//                 className="flex items-center gap-2 px-4 py-2 rounded-lg bg-amber-600 text-white hover:bg-amber-700 transition-all"
//               >
//                 {copied ? <Check size={16} /> : <Copy size={16} />}
//                 {copied ? 'Copied!' : 'Copy OTP'}
//               </button>
//             </div>
//             <p className="text-xs text-amber-600 mt-3">⚠️ Never share this OTP with anyone except the delivery person</p>
//           </div>
//         )}

//         {/* Ready for Pickup Banner (for pickup pre-orders) */}
//         {!isDeliveryPreOrder && currentStatus === 'ready' && (
//           <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-5 mb-6">
//             <div className="flex items-center gap-3">
//               <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center animate-pulse">
//                 <PackageCheck size={24} className="text-green-600" />
//               </div>
//               <div>
//                 <h3 className="font-bold text-lg text-gray-800">Your pre-order is ready!</h3>
//                 <p className="text-sm text-gray-600">Please head to our counter with your order ID</p>
//                 <p className="text-xs text-green-600 mt-2">Order will be held for 20 minutes</p>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Live Tracking Section (for delivery pre-orders) */}
//         {isDeliveryPreOrder && currentStatus === 'out-for-delivery' && (
//           <div className="bg-white border border-gray-100 rounded-xl overflow-hidden mb-6 shadow-sm">
//             <div className="p-4 border-b border-gray-100 bg-gradient-to-r from-amber-50 to-orange-50">
//               <div className="flex items-center justify-between">
//                 <div className="flex items-center gap-2">
//                   <MapPin size={18} className="text-amber-600" />
//                   <h2 className="font-semibold text-gray-800">Tracking your delivery</h2>
//                 </div>
//                 {hasTracking && (
//                   <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
//                     <span className="w-1.5 h-1.5 rounded-full bg-green-600 animate-pulse"></span>
//                     Live
//                   </span>
//                 )}
//               </div>
//               <p className="text-sm text-gray-600 mt-1">Your order is out for delivery!</p>
//               <p className="text-sm font-medium text-amber-600 mt-1">{getStatusMessage()}</p>
//             </div>

//             {/* Rider Info */}
//             <div className="p-4 bg-gray-50 border-b border-gray-100">
//               <div className="flex items-center gap-3">
//                 <motion.div 
//                   className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center"
//                   animate={{ scale: [1, 1.06, 1] }}
//                   transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
//                 >
//                   <Bike size={22} className="text-amber-600" />
//                 </motion.div>
//                 <div className="flex-1">
//                   <p className="font-semibold text-gray-800">Delivery Partner</p>
//                   <p className="text-sm text-gray-700">{order.deliveryAgent?.name || 'Delivery Partner'}</p>
//                   <p className="text-xs text-gray-500 capitalize">{order.deliveryAgent?.vehicleType || 'Bike'}</p>
//                 </div>
//                 {order.deliveryAgent?.phone && (
//                   <a href={`tel:${order.deliveryAgent.phone}`} className="p-2.5 rounded-full bg-white border border-gray-200 text-amber-600 hover:bg-amber-600 hover:text-white transition-all shadow-sm">
//                     <Phone size={16} />
//                   </a>
//                 )}
//               </div>
//               {order.deliveryAgent?.phone && (
//                 <p className="text-xs text-gray-400 mt-2 ml-14">{order.deliveryAgent.phone}</p>
//               )}
//             </div>

//             {/* Progress Bar */}
//             <div className="p-5">
//               <div className="rounded-2xl border border-amber-100 bg-white p-5">
//                 <div className="flex items-start justify-between gap-3 mb-4">
//                   <div>
//                     <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-600">Delivery progress</p>
//                     <h3 className="mt-2 text-base font-semibold text-gray-800">Your order is on the way!</h3>
//                   </div>
//                   <div className="rounded-full bg-amber-50 px-3 py-1 text-sm font-semibold text-amber-700">
//                     {Math.floor(progressPercent)}%
//                   </div>
//                 </div>

//                 <div className="h-2 overflow-hidden rounded-full bg-gray-200">
//                   <motion.div
//                     className="h-full rounded-full bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600"
//                     initial={false}
//                     animate={{ width: `${progressPercent}%` }}
//                     transition={{ duration: 1, ease: 'linear' }}
//                   />
//                 </div>

//                 <div className="mt-4 flex items-center justify-between text-xs font-medium text-gray-500">
//                   <span className={progressPercent >= 0 ? "text-green-600" : ""}>Picked Up</span>
//                   <span className={progressPercent >= 25 ? "text-amber-600" : ""}>En Route</span>
//                   <span className={progressPercent >= 75 ? "text-amber-600" : ""}>Nearby</span>
//                   <span className={progressPercent >= 100 ? "text-green-600" : ""}>Delivered</span>
//                 </div>
//               </div>
//             </div>

//             {/* Current Rider Location */}
//             <div className="p-4 bg-white border-t border-gray-100">
//               <div className="bg-gray-50 rounded-lg p-3">
//                 <p className="text-xs text-gray-500 mb-1">Current rider location</p>
//                 <p className="text-sm font-medium text-gray-800">{locationCoordinates}</p>
//                 {lastLocationUpdate && (
//                   <p className="text-xs text-gray-400 mt-1">Updated {lastLocationUpdate}</p>
//                 )}
//               </div>
              
//               {displayLocation && (
//                 <a 
//                   href={buildGoogleMapLink(displayLocation)}
//                   target="_blank"
//                   rel="noopener noreferrer"
//                   className="mt-3 w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-amber-600 text-white hover:bg-amber-700 transition-all shadow-sm"
//                 >
//                   <Navigation size={16} />
//                   Open in Google Maps
//                 </a>
//               )}

//               <button
//                 onClick={() => refetch()}
//                 className="mt-2 w-full flex items-center justify-center gap-2 py-2.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition-all"
//               >
//                 <RefreshCw size={16} />
//                 Refresh Location
//               </button>
//             </div>
//           </div>
//         )}

//         {/* Status Timeline */}
//         <div className="bg-white border border-gray-100 rounded-xl p-5 mb-6 shadow-sm">
//           <h2 className="font-semibold text-gray-800 mb-5">Order Status</h2>
//           <div className="relative">
//             {statusFlow.map((status, index) => {
//               const meta = STATUS_META[status];
//               const Icon = meta.icon;
//               const isCompleted = currentIndex >= index;
//               const isCurrent = currentStatus === status;
//               const statusTime = getStatusTime(status);

//               if (!meta) return null;

//               return (
//                 <motion.div
//                   key={status}
//                   initial={{ opacity: 0, x: -20 }}
//                   animate={{ opacity: 1, x: 0 }}
//                   transition={{ delay: index * 0.1 }}
//                   className="flex gap-3 mb-4 last:mb-0"
//                 >
//                   <div className="flex flex-col items-center">
//                     <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
//                       isCompleted ? meta.color : 'bg-gray-100 text-gray-400'
//                     }`}>
//                       <Icon size={14} />
//                     </div>
//                     {index < statusFlow.length - 1 && (
//                       <div className={`w-0.5 h-8 mt-1 ${isCompleted ? 'bg-amber-200' : 'bg-gray-100'}`} />
//                     )}
//                   </div>
//                   <div className="flex-1 pb-3">
//                     <div className="flex items-center gap-2 flex-wrap">
//                       <p className={`font-medium text-sm ${isCompleted ? 'text-gray-800' : 'text-gray-400'}`}>
//                         {meta.title}
//                       </p>
//                       {isCurrent && (
//                         <span className="inline-block w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
//                       )}
//                       {statusTime && (
//                         <span className="text-xs text-gray-400 ml-2">
//                           {formatDateTime(statusTime)}
//                         </span>
//                       )}
//                     </div>
//                     <p className="text-xs text-gray-400 mt-0.5">{meta.desc}</p>
//                   </div>
//                 </motion.div>
//               );
//             })}
//           </div>
//         </div>

//         {/* Order Items */}
//         <div className="bg-white border border-gray-100 rounded-xl p-5 mb-5 shadow-sm">
//           <h2 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
//             <ShoppingBag size={16} className="text-amber-600" />
//             Order Items
//           </h2>
//           <div className="space-y-2">
//             {order.items?.map((item, idx) => (
//               <div key={idx} className="flex justify-between text-sm">
//                 <span className="text-gray-600">{item.quantity} × {item.name}</span>
//                 <span className="font-medium text-gray-800">{formatCurrency(item.totalPrice || item.unitPrice * item.quantity)}</span>
//               </div>
//             ))}
//             <div className="border-t border-gray-100 pt-2 mt-2">
//               <div className="flex justify-between text-sm">
//                 <span className="text-gray-500">Subtotal</span>
//                 <span className="text-gray-700">{formatCurrency(order.subtotal)}</span>
//               </div>
//               <div className="flex justify-between text-sm">
//                 <span className="text-gray-500">Pre-order Fee</span>
//                 <span className="text-gray-700">{formatCurrency(order.preOrderFee || 0)}</span>
//               </div>
//               <div className="flex justify-between text-sm">
//                 <span className="text-gray-500">Delivery Fee</span>
//                 <span className="text-gray-700">{formatCurrency(order.deliveryFee || 0)}</span>
//               </div>
//               <div className="flex justify-between text-sm">
//                 <span className="text-gray-500">Tax</span>
//                 <span className="text-gray-700">{formatCurrency(order.taxAmount || 0)}</span>
//               </div>
//               <div className="flex justify-between font-bold text-base pt-2 mt-1 border-t border-gray-100">
//                 <span className="text-gray-800">Total</span>
//                 <span className="text-amber-600">{formatCurrency(order.totalAmount)}</span>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Pickup/Delivery Info */}
//         <div className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm">
//           <h2 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
//             <MapPin size={16} className="text-amber-600" />
//             {isDeliveryPreOrder ? 'Delivery Address' : 'Pickup Information'}
//           </h2>
//           {isDeliveryPreOrder ? (
//             <>
//               <p className="text-sm text-gray-600 leading-relaxed">
//                 {order.deliveryAddress?.text || 'Address not available'}
//               </p>
//               {order.deliveryAddress?.phone && (
//                 <div className="mt-3 flex items-center gap-2 text-sm text-gray-500">
//                   <Phone size={14} />
//                   <span>{order.deliveryAddress.phone}</span>
//                 </div>
//               )}
//             </>
//           ) : (
//             <div className="space-y-3">
//               <div className="bg-gray-50 rounded-lg p-3">
//                 <p className="text-xs text-gray-500 mb-1">Pickup Location</p>
//                 <p className="text-sm text-gray-800">Roller Coaster Cafe Counter</p>
//                 <p className="text-xs text-gray-500 mt-1">Under Nutan School, Juna Road, Opposite Navjeevan Hospital, Ahmedabad, Bareja, Gujarat 382425</p>
//               </div>
//               <div className="bg-gray-50 rounded-lg p-3">
//                 <p className="text-xs text-gray-500 mb-1">Pickup Window</p>
//                 <p className="text-sm text-gray-800">
//                   {currentStatus === 'ready'
//                     ? 'Ready now at the counter'
//                     : scheduledTime
//                     ? formatDateTime(scheduledTime)
//                     : 'Will appear once the order is scheduled'}
//                 </p>
//               </div>
//             </div>
//           )}
//         </div>

//         {/* Special Notes */}
//         {order.specialNotes && (
//           <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 mt-5">
//             <p className="text-sm text-amber-700">
//               <span className="font-medium">Note:</span> {order.specialNotes}
//             </p>
//           </div>
//         )}

//         {/* Completion Celebration */}
//         {(currentStatus === 'delivered' || currentStatus === 'completed') && (
//           <motion.div
//             initial={{ scale: 0, opacity: 0 }}
//             animate={{ scale: 1, opacity: 1 }}
//             className="mt-5 p-6 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl text-center"
//           >
//             <motion.div
//               animate={{ rotate: 360 }}
//               transition={{ duration: 0.5 }}
//               className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-3"
//             >
//               <CheckCircle2 size={32} className="text-green-600" />
//             </motion.div>
//             <h3 className="text-xl font-bold text-gray-800">
//               {currentStatus === 'delivered' ? 'Order Delivered! 🎉' : 'Order Completed! 🎉'}
//             </h3>
//             <p className="text-sm text-gray-600 mt-1">Thank you for ordering from Roller Coaster Cafe</p>
//             <p className="text-xs text-gray-500 mt-2">Enjoy your meal! Rate your experience in the app</p>
//           </motion.div>
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
  ArrowLeft, CalendarDays, Clock3, PackageCheck, CheckCircle2, 
  ShoppingBag, MapPin, ChefHat, Bike, Truck, Phone, Navigation, 
  ShieldCheck, Copy, Check, WifiOff, RefreshCw, FileText, User
} from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';
import CustomerFooter from '../../components/customer/CustomerFooter';

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

const formatTimeAgo = (value) => {
  if (!value) return 'Not yet';
  const now = new Date();
  const past = new Date(value);
  const diffMins = Math.floor((now - past) / 60000);
  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins} min ago`;
  return `${Math.floor(diffMins / 60)} hour${Math.floor(diffMins / 60) > 1 ? 's' : ''} ago`;
};

const toNumber = (value) => (typeof value === 'number' ? value : Number(value));
const hasCoordinates = (location) => Number.isFinite(toNumber(location?.lat)) && Number.isFinite(toNumber(location?.lng));
const buildGoogleMapLink = (location) => {
  if (!hasCoordinates(location)) return '';
  return `https://www.google.com/maps?q=${location.lat},${location.lng}`;
};

const getSocketBaseUrl = () => (
  import.meta.env.VITE_SOCKET_URL ||
  import.meta.env.VITE_API_URL?.replace('/api', '') ||
  'http://localhost:5000'
);

// Status flow based on pre-order type
const getStatusFlow = (isDelivery) => {
  if (isDelivery) {
    return ['placed', 'confirmed', 'preparing', 'ready', 'out-for-delivery', 'delivered'];
  }
  return ['placed', 'confirmed', 'preparing', 'ready', 'completed'];
};

const STATUS_META = {
  placed: { title: 'Pre-Order Placed', desc: 'Your pre-order has been scheduled', icon: CalendarDays, color: 'bg-amber-50 text-amber-600' },
  confirmed: { title: 'Order Confirmed', desc: 'Kitchen accepted your order', icon: CheckCircle2, color: 'bg-blue-50 text-blue-600' },
  preparing: { title: 'Preparing', desc: 'Kitchen is preparing your order', icon: ChefHat, color: 'bg-orange-50 text-orange-600' },
  ready: { title: 'Ready', desc: 'Your order is ready', icon: PackageCheck, color: 'bg-emerald-50 text-emerald-600' },
  'out-for-delivery': { title: 'Out for Delivery', desc: 'Rider is on the way!', icon: Bike, color: 'bg-indigo-50 text-indigo-600' },
  delivered: { title: 'Delivered', desc: 'Order delivered successfully', icon: Truck, color: 'bg-green-50 text-green-600' },
  completed: { title: 'Order Completed', desc: 'You have received your order', icon: CheckCircle2, color: 'bg-green-50 text-green-600' },
  cancelled: { title: 'Cancelled', desc: 'Order was cancelled', icon: Clock3, color: 'bg-red-50 text-red-600' },
};

export default function PreOrderTrackingPage() {
  const { orderId } = useParams();
  const [liveOrder, setLiveOrder] = useState(null);
  const [now, setNow] = useState(Date.now());
  const [copied, setCopied] = useState(false);
  const [simulatedLocation, setSimulatedLocation] = useState(null);
  const [progressPercent, setProgressPercent] = useState(0);
  const [isConnected, setIsConnected] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['preorder-track', orderId],
    queryFn: () => api.get(`/orders/${orderId}`).then((res) => res.data),
    retry: false,
    refetchInterval: 10000,
  });

  useEffect(() => {
    if (data?.order || data) {
      setLiveOrder((prev) => ({ ...(prev || {}), ...(data?.order || data) }));
    }
  }, [data]);

  // Check pre-order type from specialNotes or order data
  const preOrderType = useMemo(() => {
    const notes = String(liveOrder?.specialNotes || data?.specialNotes || '').toLowerCase();
    if (notes.includes('pre-order type: delivery') || notes.includes('delivery')) {
      return 'delivery';
    }
    if (notes.includes('pre-order type: takeaway') || notes.includes('takeaway')) {
      return 'takeaway';
    }
    if (notes.includes('pre-order type: dine-in') || notes.includes('dine-in')) {
      return 'dine-in';
    }
    return liveOrder?.preOrderMethod || data?.preOrderMethod || 'takeaway';
  }, [liveOrder, data]);

  const isDeliveryPreOrder = preOrderType === 'delivery';
  const isTakeawayPreOrder = preOrderType === 'takeaway';
  const isDineInPreOrder = preOrderType === 'dine-in';

  // Timer-based location simulation for delivery pre-orders
  useEffect(() => {
    const order = liveOrder || data?.order || data;
    
    if (isDeliveryPreOrder && order?.status === 'out-for-delivery' && order?.estimatedDeliveryAt && order?.deliveryAcceptedAt) {
      const startTime = new Date(order.deliveryAcceptedAt).getTime();
      const endTime = new Date(order.estimatedDeliveryAt).getTime();
      const currentTime = Date.now();
      
      let percent = ((currentTime - startTime) / (endTime - startTime)) * 100;
      percent = Math.min(100, Math.max(0, percent));
      setProgressPercent(percent);
      
      const restaurantLat = order.restaurantLocation?.lat || 23.0368;
      const restaurantLng = order.restaurantLocation?.lng || 72.5477;
      const customerLat = order?.deliveryAddress?.lat || 23.0400;
      const customerLng = order?.deliveryAddress?.lng || 72.5500;
      
      const lat = restaurantLat + (customerLat - restaurantLat) * (percent / 100);
      const lng = restaurantLng + (customerLng - restaurantLng) * (percent / 100);
      setSimulatedLocation({ lat, lng });
      
      if (percent >= 100) {
        setProgressPercent(100);
      }
    } else {
      setProgressPercent(0);
      setSimulatedLocation(null);
    }
  }, [liveOrder, data, now, isDeliveryPreOrder]);

  // WebSocket connection
  useEffect(() => {
    if (!orderId) return;

    const socket = io(getSocketBaseUrl(), { 
      withCredentials: true,
      transports: ['websocket', 'polling']
    });

    socket.on('connect', () => {
      setIsConnected(true);
      socket.emit('join-room', { room: `order:${orderId}` });
    });

    socket.on('disconnect', () => setIsConnected(false));
    socket.on('connect_error', () => setIsConnected(false));

    socket.on('order-updated', (payload) => {
      if (String(payload.orderId) === String(orderId)) {
        setLiveOrder((prev) => ({ ...(prev || {}), ...payload }));
        if (payload.status === 'delivered') {
          toast.success('Order Delivered! Thank you! 🎉');
        } else if (payload.status === 'ready' && !isDeliveryPreOrder) {
          toast.success('Your pre-order is ready for pickup! 🎉');
        } else if (payload.status === 'out-for-delivery') {
          toast.success('Your order is out for delivery! 🚚');
        }
        refetch();
      }
    });

    socket.on('agent-location', (payload) => {
      setLiveOrder((prev) => ({
        ...(prev || {}),
        liveLocation: {
          lat: payload.lat,
          lng: payload.lng,
          updatedAt: payload.timestamp ? new Date(payload.timestamp).toISOString() : new Date().toISOString(),
        },
      }));
    });

    return () => {
      socket.emit('leave-room', { room: `order:${orderId}` });
      socket.close();
    };
  }, [orderId, refetch, isDeliveryPreOrder]);

  const order = liveOrder || data?.order || data;
  const currentStatus = order?.status || 'placed';
  const statusMeta = STATUS_META[currentStatus] || STATUS_META.placed;
  const StatusIcon = statusMeta.icon;
  const scheduledTime = order?.scheduledTime;
  const isScheduledPassed = scheduledTime && new Date(scheduledTime) < new Date();

  const statusFlow = getStatusFlow(isDeliveryPreOrder);
  const currentIndex = statusFlow.indexOf(currentStatus);

  const getStatusTime = (status) => {
    if (!order?.statusHistory) return null;
    const historyEntry = order.statusHistory.find(entry => entry.status === status);
    return historyEntry?.updatedAt || null;
  };

  const getCountdown = () => {
    if (!scheduledTime || currentStatus !== 'placed') return null;
    const remainingMs = new Date(scheduledTime).getTime() - Date.now();
    if (remainingMs <= 0) return null;
    const hours = Math.floor(remainingMs / (1000 * 60 * 60));
    const minutes = Math.floor((remainingMs % (1000 * 60 * 60)) / (1000 * 60));
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes} minutes`;
  };

  const countdown = getCountdown();

  const hasRealLiveLocation = Number.isFinite(toNumber(order?.liveLocation?.lat)) && Number.isFinite(toNumber(order?.liveLocation?.lng));
  const displayLocation = hasRealLiveLocation ? order?.liveLocation : simulatedLocation;
  const hasTracking = isDeliveryPreOrder && currentStatus === 'out-for-delivery';

  const lastLocationUpdate = useMemo(() => {
    if (!order?.liveLocation?.updatedAt) return null;
    return formatTimeAgo(order.liveLocation?.updatedAt);
  }, [order?.liveLocation?.updatedAt, now]);

  const locationCoordinates = useMemo(() => {
    if (!displayLocation) return 'Waiting for live location';
    const lat = toNumber(displayLocation?.lat);
    const lng = toNumber(displayLocation?.lng);
    if (!Number.isFinite(lat) || !Number.isFinite(lng)) return 'Waiting for location';
    return `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
  }, [displayLocation]);

  const copyOTP = async () => {
    if (order?.deliveryOTP) {
      await navigator.clipboard.writeText(order.deliveryOTP);
      setCopied(true);
      toast.success('OTP copied! Share it with the delivery partner');
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const getStatusMessage = () => {
    if (progressPercent < 25) return 'Rider is leaving the restaurant';
    if (progressPercent < 50) return 'Rider is on the way';
    if (progressPercent < 75) return 'Rider is getting closer';
    if (progressPercent < 100) return 'Rider is almost there!';
    return 'Arriving shortly';
  };

  if (isLoading || !order) {
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
            </div>
          </div>
        </header>
        <main className="max-w-4xl mx-auto px-4 py-6">
          <div className="space-y-4 animate-pulse">
            <div className="h-32 bg-gray-100 rounded-xl" />
            <div className="h-64 bg-gray-100 rounded-xl" />
          </div>
        </main>
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
        {/* Connection Status */}
        {!isConnected && (
          <div className="mb-4 flex items-center justify-center gap-2 text-xs text-red-500 bg-red-50 px-3 py-2 rounded-full">
            <WifiOff size={12} />
            <span>Reconnecting for live updates...</span>
          </div>
        )}

        {/* Order Header */}
        <div className="bg-white border border-gray-100 rounded-xl p-5 mb-6 shadow-sm">
          <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
            <div>
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium bg-purple-50 text-purple-600">
                  <CalendarDays size={12} /> Pre-Order
                </span>
                <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium ${
                  isDeliveryPreOrder ? 'bg-sky-50 text-sky-600' : isTakeawayPreOrder ? 'bg-violet-50 text-violet-600' : 'bg-emerald-50 text-emerald-600'
                }`}>
                  {isDeliveryPreOrder ? <Truck size={12} /> : isTakeawayPreOrder ? <ShoppingBag size={12} /> : <MapPin size={12} />}
                  {isDeliveryPreOrder ? 'Delivery' : isTakeawayPreOrder ? 'Takeaway' : 'Dine-In'}
                </span>
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

        {/* Scheduled Time Banner */}
        {scheduledTime && currentStatus !== 'completed' && currentStatus !== 'delivered' && (
          <div className="bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200 rounded-xl p-5 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
                <CalendarDays size={24} className="text-purple-600" />
              </div>
              <div>
                <h3 className="font-bold text-lg text-gray-800">
                  {isDeliveryPreOrder ? 'Scheduled Delivery Time' : 'Scheduled Pickup Time'}
                </h3>
                <p className="text-sm text-gray-600">{formatDateTime(scheduledTime)}</p>
                {countdown && currentStatus === 'placed' && (
                  <p className="text-xs text-purple-600 mt-1">Order will be ready in {countdown}</p>
                )}
                {isScheduledPassed && currentStatus === 'placed' && (
                  <p className="text-xs text-amber-600 mt-1">Your order should be ready soon</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* OTP Section (for delivery pre-orders) */}
        {isDeliveryPreOrder && currentStatus === 'out-for-delivery' && order.deliveryOTP && (
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl p-5 mb-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center">
                <ShieldCheck size={18} className="text-amber-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">Delivery OTP Required</h3>
                <p className="text-sm text-gray-500">Share this OTP with the delivery partner</p>
              </div>
            </div>
            <div className="flex items-center justify-between bg-white rounded-xl p-4 border border-amber-200">
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide">Your One-Time Password</p>
                <p className="text-3xl font-bold tracking-widest text-gray-800 mt-1">{order.deliveryOTP}</p>
              </div>
              <button onClick={copyOTP} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-amber-600 text-white">
                {copied ? <Check size={16} /> : <Copy size={16} />}
                {copied ? 'Copied!' : 'Copy OTP'}
              </button>
            </div>
            <p className="text-xs text-amber-600 mt-3">⚠️ Never share this OTP with anyone except the delivery person</p>
          </div>
        )}

        {/* Ready for Pickup Banner (for takeaway/dine-in pre-orders) */}
        {!isDeliveryPreOrder && currentStatus === 'ready' && (
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-5 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center animate-pulse">
                <PackageCheck size={24} className="text-green-600" />
              </div>
              <div>
                <h3 className="font-bold text-lg text-gray-800">Your pre-order is ready!</h3>
                <p className="text-sm text-gray-600">
                  {isTakeawayPreOrder ? 'Please head to our counter with your order ID' : 'Your order will be served at your table'}
                </p>
                <p className="text-xs text-green-600 mt-2">Order will be held for 20 minutes</p>
              </div>
            </div>
          </div>
        )}

        {/* Live Tracking Section (for delivery pre-orders) */}
        {isDeliveryPreOrder && currentStatus === 'out-for-delivery' && (
          <div className="bg-white border border-gray-100 rounded-xl overflow-hidden mb-6 shadow-sm">
            <div className="p-4 border-b border-gray-100 bg-gradient-to-r from-amber-50 to-orange-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MapPin size={18} className="text-amber-600" />
                  <h2 className="font-semibold text-gray-800">Tracking your delivery</h2>
                </div>
                {hasTracking && (
                  <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-600 animate-pulse"></span>
                    Live
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-600 mt-1">Your order is out for delivery!</p>
              <p className="text-sm font-medium text-amber-600 mt-1">{getStatusMessage()}</p>
            </div>

            {/* Rider Info */}
            <div className="p-4 bg-gray-50 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <motion.div 
                  className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center"
                  animate={{ scale: [1, 1.06, 1] }}
                  transition={{ repeat: Infinity, duration: 1.8 }}
                >
                  <Bike size={22} className="text-amber-600" />
                </motion.div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-800">Delivery Partner</p>
                  <p className="text-sm text-gray-700">{order.deliveryAgent?.name || 'Delivery Partner'}</p>
                  <p className="text-xs text-gray-500 capitalize">{order.deliveryAgent?.vehicleType || 'Bike'}</p>
                </div>
                {order.deliveryAgent?.phone && (
                  <a href={`tel:${order.deliveryAgent.phone}`} className="p-2.5 rounded-full bg-white border border-gray-200 text-amber-600 hover:bg-amber-600 hover:text-white transition-all shadow-sm">
                    <Phone size={16} />
                  </a>
                )}
              </div>
              {order.deliveryAgent?.phone && (
                <p className="text-xs text-gray-400 mt-2 ml-14">{order.deliveryAgent.phone}</p>
              )}
            </div>

            {/* Progress Bar */}
            <div className="p-5">
              <div className="rounded-2xl border border-amber-100 bg-white p-5">
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-600">Delivery progress</p>
                    <h3 className="mt-2 text-base font-semibold text-gray-800">Your order is on the way!</h3>
                  </div>
                  <div className="rounded-full bg-amber-50 px-3 py-1 text-sm font-semibold text-amber-700">
                    {Math.floor(progressPercent)}%
                  </div>
                </div>

                <div className="h-2 overflow-hidden rounded-full bg-gray-200">
                  <motion.div
                    className="h-full rounded-full bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600"
                    initial={false}
                    animate={{ width: `${progressPercent}%` }}
                    transition={{ duration: 1, ease: 'linear' }}
                  />
                </div>

                <div className="mt-4 flex items-center justify-between text-xs font-medium text-gray-500">
                  <span className={progressPercent >= 0 ? "text-green-600" : ""}>Picked Up</span>
                  <span className={progressPercent >= 25 ? "text-amber-600" : ""}>En Route</span>
                  <span className={progressPercent >= 75 ? "text-amber-600" : ""}>Nearby</span>
                  <span className={progressPercent >= 100 ? "text-green-600" : ""}>Delivered</span>
                </div>
              </div>
            </div>

            {/* Current Rider Location */}
            <div className="p-4 bg-white border-t border-gray-100">
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-xs text-gray-500 mb-1">Current rider location</p>
                <p className="text-sm font-medium text-gray-800">{locationCoordinates}</p>
                {lastLocationUpdate && (
                  <p className="text-xs text-gray-400 mt-1">Updated {lastLocationUpdate}</p>
                )}
              </div>
              
              {displayLocation && (
                <a 
                  href={buildGoogleMapLink(displayLocation)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-amber-600 text-white hover:bg-amber-700 transition-all shadow-sm"
                >
                  <Navigation size={16} />
                  Open in Google Maps
                </a>
              )}

              <button
                onClick={() => refetch()}
                className="mt-2 w-full flex items-center justify-center gap-2 py-2.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition-all"
              >
                <RefreshCw size={16} />
                Refresh Location
              </button>
            </div>
          </div>
        )}

        {/* Status Timeline */}
        <div className="bg-white border border-gray-100 rounded-xl p-5 mb-6 shadow-sm">
          <h2 className="font-semibold text-gray-800 mb-5">Order Status</h2>
          <div className="relative">
            {statusFlow.map((status, index) => {
              const meta = STATUS_META[status];
              if (!meta) return null;
              const Icon = meta.icon;
              const isCompleted = currentIndex >= index;
              const isCurrent = currentStatus === status;
              const statusTime = getStatusTime(status);

              return (
                <div key={status} className="flex gap-3 mb-4 last:mb-0">
                  <div className="flex flex-col items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      isCompleted ? meta.color : 'bg-gray-100 text-gray-400'
                    }`}>
                      <Icon size={14} />
                    </div>
                    {index < statusFlow.length - 1 && (
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
            <ShoppingBag size={16} className="text-amber-600" />
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
                <span className="text-gray-500">Pre-order Fee</span>
                <span>{formatCurrency(order.preOrderFee || 0)}</span>
              </div>
              {isDeliveryPreOrder && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Delivery Fee</span>
                  <span>{formatCurrency(order.deliveryFee || 0)}</span>
                </div>
              )}
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Tax</span>
                <span>{formatCurrency(order.taxAmount || 0)}</span>
              </div>
              <div className="flex justify-between font-bold text-base pt-2 mt-1 border-t border-gray-100">
                <span className="text-gray-800">Total</span>
                <span className="text-amber-600">{formatCurrency(order.totalAmount)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Delivery/Pickup Info */}
        <div className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm">
          <h2 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
            <MapPin size={16} className="text-amber-600" />
            {isDeliveryPreOrder ? 'Delivery Address' : 'Pickup Information'}
          </h2>
          {isDeliveryPreOrder ? (
            <>
              <p className="text-sm text-gray-600 leading-relaxed">
                {order.deliveryAddress?.text || 'Address not available'}
              </p>
              {order.deliveryAddress?.phone && (
                <div className="mt-3 flex items-center gap-2 text-sm text-gray-500">
                  <Phone size={14} />
                  <span>{order.deliveryAddress.phone}</span>
                </div>
              )}
            </>
          ) : (
            <div className="space-y-3">
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-xs text-gray-500 mb-1">Pickup Location</p>
                <p className="text-sm text-gray-800">Roller Coaster Cafe Counter</p>
                <p className="text-xs text-gray-500 mt-1">Under Nutan School, Juna Road, Opposite Navjeevan Hospital, Ahmedabad, Bareja, Gujarat 382425</p>
              </div>
              {isDineInPreOrder && order.tableNumber && (
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-gray-500 mb-1">Table Assignment</p>
                  <p className="text-sm font-semibold text-gray-800">Table {order.tableNumber}</p>
                  <p className="text-xs text-gray-500 mt-1">Guests: {order.guestCount || 2}</p>
                </div>
              )}
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-xs text-gray-500 mb-1">Pickup Window</p>
                <p className="text-sm text-gray-800">
                  {currentStatus === 'ready'
                    ? 'Ready now at the counter'
                    : scheduledTime
                    ? formatDateTime(scheduledTime)
                    : 'Will appear once the order is scheduled'}
                </p>
              </div>
            </div>
          )}
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
        {(currentStatus === 'delivered' || currentStatus === 'completed') && (
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

        {/* Completion Celebration */}
        {(currentStatus === 'delivered' || currentStatus === 'completed') && (
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
            <h3 className="text-xl font-bold text-gray-800">
              {currentStatus === 'delivered' ? 'Order Delivered! 🎉' : 'Order Completed! 🎉'}
            </h3>
            <p className="text-sm text-gray-600 mt-1">Thank you for ordering from Roller Coaster Cafe</p>
          </motion.div>
        )}
      </main>

      <CustomerFooter />
    </div>
  );
}