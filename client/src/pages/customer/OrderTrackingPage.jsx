// import { useEffect, useMemo, useState } from 'react';
// import { Link, useParams } from 'react-router-dom';
// import { useQuery } from '@tanstack/react-query';
// import { motion, AnimatePresence } from 'framer-motion';
// import { io } from 'socket.io-client';
// import {
//   ArrowLeft,
//   BellRing,
//   Bike,
//   CalendarDays,
//   CheckCircle2,
//   ChefHat,
//   Clock3,
//   MapPin,
//   PackageCheck,
//   Phone,
//   ShoppingBag,
//   Table2,
//   Truck,
//   UserRound,
//   Mail,
//   Navigation,
//   RefreshCw,
//   WifiOff,
//   ShieldCheck,
//   Copy,
//   Check
// } from 'lucide-react';
// import api from '../../services/api';
// import toast from 'react-hot-toast';

// const STATUS_FLOW = ['placed', 'confirmed', 'preparing', 'ready', 'out-for-delivery', 'delivered'];

// const ORDER_TYPE_META = {
//   delivery: { icon: Truck, label: 'Delivery', color: 'bg-sky-50 text-sky-600' },
//   'dine-in': { icon: Table2, label: 'Dine-In', color: 'bg-emerald-50 text-emerald-600' },
//   takeaway: { icon: ShoppingBag, label: 'Takeaway', color: 'bg-violet-50 text-violet-600' },
//   'pre-order': { icon: CalendarDays, label: 'Pre-Order', color: 'bg-orange-50 text-orange-600' },
// };

// const STATUS_META = {
//   placed: { title: 'Order Placed', desc: 'Your order has been received', icon: Clock3, color: 'bg-amber-50 text-amber-600' },
//   confirmed: { title: 'Order Confirmed', desc: 'Restaurant accepted your order', icon: CheckCircle2, color: 'bg-blue-50 text-blue-600' },
//   preparing: { title: 'Preparing', desc: 'Kitchen is preparing your food', icon: ChefHat, color: 'bg-orange-50 text-orange-600' },
//   ready: { title: 'Ready', desc: 'Your order is ready', icon: PackageCheck, color: 'bg-emerald-50 text-emerald-600' },
//   'out-for-delivery': { title: 'Out for Delivery', desc: 'Rider is on the way', icon: Bike, color: 'bg-indigo-50 text-indigo-600' },
//   delivered: { title: 'Delivered', desc: 'Order delivered successfully', icon: CheckCircle2, color: 'bg-green-50 text-green-600' },
//   cancelled: { title: 'Cancelled', desc: 'Order was cancelled', icon: Clock3, color: 'bg-red-50 text-red-600' },
// };

// const getSocketBaseUrl = () => (
//   import.meta.env.VITE_SOCKET_URL ||
//   import.meta.env.VITE_API_URL?.replace('/api', '') ||
//   'http://localhost:5000'
// );

// const formatDateTime = (value) => {
//   if (!value) return '-';
//   return new Date(value).toLocaleString('en-IN', {
//     day: 'numeric',
//     month: 'short',
//     hour: 'numeric',
//     minute: '2-digit',
//   });
// };

// const formatTimeAgo = (value) => {
//   if (!value) return 'Not yet';
//   const now = new Date();
//   const past = new Date(value);
//   const diffMs = now - past;
//   const diffMins = Math.floor(diffMs / 60000);
//   const diffHours = Math.floor(diffMs / 3600000);
//   const diffDays = Math.floor(diffMs / 86400000);

//   if (diffMins < 1) return 'Just now';
//   if (diffMins < 60) return `${diffMins} min ago`;
//   if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
//   return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
// };

// const formatCurrency = (value) => `₹${Number(value || 0).toLocaleString('en-IN')}`;

// const toNumber = (value) => (typeof value === 'number' ? value : Number(value));

// const formatCoordinates = (lat, lng) => {
//   const nextLat = toNumber(lat);
//   const nextLng = toNumber(lng);
//   if (!Number.isFinite(nextLat) || !Number.isFinite(nextLng)) return 'Waiting for location';
//   return `${nextLat.toFixed(6)}, ${nextLng.toFixed(6)}`;
// };

// // Simulate rider movement based on timer progress
// const calculateSimulatedLocation = (progressPercent, startLat, startLng, endLat, endLng) => {
//   if (!startLat || !startLng || !endLat || !endLng) return null;
//   const lat = startLat + (endLat - startLat) * (progressPercent / 100);
//   const lng = startLng + (endLng - startLng) * (progressPercent / 100);
//   return { lat, lng };
// };

// export default function OrderTrackingPage() {
//   const { orderId } = useParams();
//   const [liveOrder, setLiveOrder] = useState(null);
//   const [now, setNow] = useState(Date.now());
//   const [copied, setCopied] = useState(false);
//   const [simulatedLocation, setSimulatedLocation] = useState(null);
//   const [progressPercent, setProgressPercent] = useState(0);

//   useEffect(() => {
//     const timer = setInterval(() => setNow(Date.now()), 1000);
//     return () => clearInterval(timer);
//   }, []);

//   const { data, isLoading, refetch } = useQuery({
//     queryKey: ['order-track', orderId],
//     queryFn: () => api.get(`/orders/${orderId}`).then((res) => res.data),
//     retry: false,
//     refetchInterval: 10000,
//   });

//   useEffect(() => {
//     if (data?.order || data) {
//       setLiveOrder((prev) => ({ ...(prev || {}), ...(data?.order || data) }));
//     }
//   }, [data]);

//   // Timer-based location simulation
//   useEffect(() => {
//     const order = liveOrder || data?.order || data;
    
//     if (order?.status === 'out-for-delivery' && order?.estimatedDeliveryAt && order?.deliveryAcceptedAt) {
//       const startTime = new Date(order.deliveryAcceptedAt).getTime();
//       const endTime = new Date(order.estimatedDeliveryAt).getTime();
//       const currentTime = Date.now();
      
//       let percent = ((currentTime - startTime) / (endTime - startTime)) * 100;
//       percent = Math.min(100, Math.max(0, percent));
//       setProgressPercent(percent);
      
//       // Simulate rider location based on progress
//       // You can set restaurant lat/lng and customer lat/lng here
//       const restaurantLat = 23.0368; // Example: Cafe location
//       const restaurantLng = 72.5477;
//       const customerLat = order?.deliveryAddress?.lat || 23.0400;
//       const customerLng = order?.deliveryAddress?.lng || 72.5500;
      
//       const simulated = calculateSimulatedLocation(percent, restaurantLat, restaurantLng, customerLat, customerLng);
//       if (simulated) {
//         setSimulatedLocation(simulated);
//       }
      
//       // Clear simulation when delivered
//       if (percent >= 100) {
//         setProgressPercent(100);
//       }
//     } else {
//       setProgressPercent(0);
//       setSimulatedLocation(null);
//     }
//   }, [liveOrder, data, now]);

//   useEffect(() => {
//     if (!orderId) return;

//     const socket = io(getSocketBaseUrl(), { withCredentials: true });

//     socket.on('connect', () => {
//       socket.emit('join-room', { room: `order:${orderId}` });
//     });

//     socket.on('order-updated', (payload) => {
//       if (String(payload.orderId) === String(orderId)) {
//         setLiveOrder((prev) => ({ ...(prev || {}), ...payload }));
//         if (payload.status === 'delivered') {
//           toast.success('Order Delivered! Thank you for ordering with us! 🎉');
//         }
//       }
//     });

//     socket.on('agent-location', (payload) => {
//       // Use real location if available from delivery agent
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
//   }, [orderId]);

//   const order = liveOrder || data?.order || data;
//   const typeMeta = ORDER_TYPE_META[order?.orderType] || ORDER_TYPE_META.delivery;
//   const TypeIcon = typeMeta.icon;
//   const currentStatus = order?.status || 'placed';
//   const statusMeta = STATUS_META[currentStatus] || STATUS_META.placed;
//   const StatusIcon = statusMeta.icon;
//   const currentIndex = STATUS_FLOW.indexOf(currentStatus);

//   const hasRealRider = Boolean(order?.deliveryAgent?.name || order?.deliveryAgent?.phone);
//   const hasRealLiveLocation = Number.isFinite(toNumber(order?.liveLocation?.lat)) && Number.isFinite(toNumber(order?.liveLocation?.lng));
  
//   // Use real location if available, otherwise use simulated location
//   const displayLocation = hasRealLiveLocation ? order?.liveLocation : simulatedLocation;
//   const hasTracking = order?.orderType === 'delivery' && (hasRealLiveLocation || simulatedLocation);

//   const timelineSteps = useMemo(() => {
//     if (order?.orderType !== 'delivery') {
//       return STATUS_FLOW.filter(step => step !== 'out-for-delivery');
//     }
//     return STATUS_FLOW;
//   }, [order?.orderType]);

//   const getStatusTime = (status) => {
//     if (!order?.statusHistory) return null;
//     const historyEntry = order.statusHistory.find(entry => entry.status === status);
//     return historyEntry?.updatedAt || null;
//   };

//   const lastLocationUpdate = useMemo(() => {
//     if (!order?.liveLocation?.updatedAt) return null;
//     return formatTimeAgo(order.liveLocation.updatedAt);
//   }, [order?.liveLocation?.updatedAt, now]);

//   const locationCoordinates = useMemo(() => {
//     if (!displayLocation) return 'Waiting for live location';
//     return formatCoordinates(displayLocation?.lat, displayLocation?.lng);
//   }, [displayLocation]);

//   const isLive = currentStatus === 'out-for-delivery' && hasTracking;

//   const copyOTP = async () => {
//     if (order?.deliveryOTP) {
//       await navigator.clipboard.writeText(order.deliveryOTP);
//       setCopied(true);
//       toast.success('OTP copied! Share it with the delivery partner');
//       setTimeout(() => setCopied(false), 2000);
//     }
//   };

//   const formatRemainingTime = (seconds) => {
//     if (!Number.isFinite(seconds) || seconds <= 0) return 'Arriving soon';
//     const mins = Math.floor(seconds / 60);
//     const secs = Math.floor(seconds % 60);
//     return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
//   };

//   // Get status message based on progress
//   const getStatusMessage = () => {
//     if (progressPercent < 25) return 'Rider is leaving the restaurant';
//     if (progressPercent < 50) return 'Rider is on the way';
//     if (progressPercent < 75) return 'Rider is getting closer';
//     if (progressPercent < 100) return 'Rider is almost there!';
//     return 'Arriving shortly';
//   };

//   return (
//     <div className="min-h-screen bg-white">
//       {/* Header */}
//       <header className="border-b border-gray-100 bg-white sticky top-0 z-50">
//         <div className="max-w-6xl mx-auto px-4 py-3">
//           <div className="flex items-center justify-between">
//             <Link to="/dashboard" className="flex items-center gap-2">
//               <img 
//                 src="https://rollercoastercafe.com/assets/images/roller_logo.png" 
//                 alt="Logo"
//                 className="h-8 w-8 rounded-full object-cover"
//               />
//               <span className="font-semibold text-lg text-gray-800">Roller Coaster Cafe</span>
//             </Link>

//             <nav className="hidden md:flex items-center gap-6">
//               <Link to="/dashboard" className="text-sm text-gray-500 hover:text-amber-600">Home</Link>
//               <Link to="/menu" className="text-sm text-gray-500 hover:text-amber-600">Menu</Link>
//               <Link to="/orders" className="text-sm text-amber-600">Orders</Link>
//               <Link to="/profile" className="text-sm text-gray-500 hover:text-amber-600">Profile</Link>
//               <Link to="/settings" className="text-sm text-gray-500 hover:text-amber-600">Settings</Link>
//             </nav>
//           </div>
//         </div>
//       </header>

//       <main className="max-w-4xl mx-auto px-4 py-6">
//         {/* Back Button */}
//         <Link to="/orders" className="inline-flex items-center gap-1 text-sm text-gray-400 hover:text-amber-600 mb-4">
//           <ArrowLeft size={14} /> Back to Orders
//         </Link>

//         {isLoading || !order ? (
//           <div className="space-y-4 animate-pulse">
//             <div className="h-32 bg-gray-100 rounded-xl" />
//             <div className="h-64 bg-gray-100 rounded-xl" />
//           </div>
//         ) : (
//           <>
//             {/* Order Header Card */}
//             <div className="bg-white border border-gray-100 rounded-xl p-5 mb-6">
//               <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
//                 <div>
//                   <div className="flex items-center gap-2 mb-2">
//                     <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium ${typeMeta.color}`}>
//                       <TypeIcon size={12} />
//                       {typeMeta.label}
//                     </span>
//                     <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium ${statusMeta.color}`}>
//                       <StatusIcon size={12} />
//                       {statusMeta.title}
//                     </span>
//                   </div>
//                   <h1 className="font-bold text-xl text-gray-800">Order #{order.orderId}</h1>
//                   <p className="text-sm text-gray-400 mt-1">Placed on {formatDateTime(order.createdAt)}</p>
//                 </div>
//                 <div className="text-right">
//                   <div className="text-2xl font-bold text-gray-800">{formatCurrency(order.totalAmount)}</div>
//                   <div className="text-xs text-gray-400 capitalize mt-1">{order.paymentMethod}</div>
//                 </div>
//               </div>
//               <p className="text-sm text-gray-500 leading-relaxed">{statusMeta.desc}</p>
//             </div>

//             {/* OTP Section - Show when out for delivery */}
//             {order.orderType === 'delivery' && currentStatus === 'out-for-delivery' && order.deliveryOTP && (
//               <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl p-5 mb-6">
//                 <div className="flex items-center gap-3 mb-3">
//                   <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center">
//                     <ShieldCheck size={18} className="text-amber-600" />
//                   </div>
//                   <div>
//                     <h3 className="font-semibold text-gray-800">Delivery OTP Required</h3>
//                     <p className="text-sm text-gray-500">Share this OTP with the delivery partner to complete delivery</p>
//                   </div>
//                 </div>
//                 <div className="flex items-center justify-between bg-white rounded-xl p-4 border border-amber-200">
//                   <div>
//                     <p className="text-xs text-gray-500 uppercase tracking-wide">Your One-Time Password</p>
//                     <p className="text-3xl font-bold tracking-widest text-gray-800 mt-1">{order.deliveryOTP}</p>
//                   </div>
//                   <button
//                     onClick={copyOTP}
//                     className="flex items-center gap-2 px-4 py-2 rounded-lg bg-amber-600 text-white hover:bg-amber-700 transition-all"
//                   >
//                     {copied ? <Check size={16} /> : <Copy size={16} />}
//                     {copied ? 'Copied!' : 'Copy OTP'}
//                   </button>
//                 </div>
//                 <p className="text-xs text-amber-600 mt-3">
//                   ⚠️ Never share this OTP with anyone except the delivery person
//                 </p>
//               </div>
//             )}

//             {/* Live Tracking Section - Main Map View */}
//             {order.orderType === 'delivery' && currentStatus === 'out-for-delivery' && (
//               <div className="bg-white border border-gray-100 rounded-xl overflow-hidden mb-6 shadow-sm">
//                 <div className="p-4 border-b border-gray-100 bg-gradient-to-r from-amber-50 to-orange-50">
//                   <div className="flex items-center justify-between">
//                     <div className="flex items-center gap-2">
//                       <MapPin size={18} className="text-amber-600" />
//                       <h2 className="font-semibold text-gray-800">Live Tracking</h2>
//                     </div>
//                     {isLive && (
//                       <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
//                         <span className="w-1.5 h-1.5 rounded-full bg-green-600 animate-pulse"></span>
//                         Live
//                       </span>
//                     )}
//                   </div>
//                   <p className="text-sm text-gray-600 mt-1">{getStatusMessage()}</p>
//                 </div>

//                 {/* Rider Info Bar */}
//                 <div className="p-4 bg-gray-50 border-b border-gray-100">
//                   <div className="flex items-center gap-3">
//                     <motion.div 
//                       className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center"
//                       animate={{ scale: [1, 1.06, 1] }}
//                       transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
//                     >
//                       <Bike size={22} className="text-amber-600" />
//                     </motion.div>
//                     <div className="flex-1">
//                       <p className="font-semibold text-gray-800">{order.deliveryAgent?.name || 'Delivery Partner'}</p>
//                       <p className="text-xs text-gray-500">{order.deliveryAgent?.vehicleType || 'On delivery'}</p>
//                     </div>
//                     {order.deliveryAgent?.phone && (
//                       <a href={`tel:${order.deliveryAgent.phone}`} className="p-2.5 rounded-full bg-white border border-gray-200 text-amber-600 hover:bg-amber-600 hover:text-white transition-all shadow-sm">
//                         <Phone size={16} />
//                       </a>
//                     )}
//                   </div>
//                 </div>

//                 {/* Timer-first delivery progress */}
//                 <div className="relative bg-gradient-to-br from-gray-100 to-gray-50">
//                   {hasTracking ? (
//                     <div className="p-5">
//                       <div className="grid gap-4 md:grid-cols-[1.1fr,0.9fr]">
//                         <div className="rounded-2xl border border-amber-100 bg-white p-4">
//                           <div className="flex items-start justify-between gap-3">
//                             <div>
//                               <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-600">Delivery progress</p>
//                               <h3 className="mt-2 text-lg font-semibold text-gray-800">{getStatusMessage()}</h3>
//                               <p className="mt-1 text-sm text-gray-500">Timer updates every second once the rider leaves the cafe.</p>
//                             </div>
//                             <div className="rounded-full bg-amber-50 px-3 py-1 text-sm font-semibold text-amber-700">
//                               {Math.floor(progressPercent)}%
//                             </div>
//                           </div>

//                           <div className="mt-5 h-3 overflow-hidden rounded-full bg-gray-200">
//                             <motion.div
//                               className="h-full rounded-full bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600"
//                               initial={false}
//                               animate={{ width: `${progressPercent}%` }}
//                               transition={{ duration: 1, ease: 'linear' }}
//                             />
//                           </div>

//                           <div className="mt-4 flex items-center justify-between text-xs text-gray-400">
//                             <span>Picked up</span>
//                             <span>On the way</span>
//                             <span>Nearby</span>
//                             <span>Delivered</span>
//                           </div>

//                           <div className="mt-6 flex items-center justify-between rounded-2xl bg-amber-50 px-4 py-3">
//                             <div>
//                               <p className="text-xs font-semibold uppercase tracking-[0.14em] text-amber-700">Delivery timer</p>
//                               <p className="mt-1 text-2xl font-bold text-gray-900">{formatRemainingTime(remainingEtaSeconds)}</p>
//                             </div>
//                             <motion.div
//                               className="flex h-14 w-14 items-center justify-center rounded-full bg-white shadow-sm"
//                               animate={{ x: [0, 6, 0] }}
//                               transition={{ repeat: Infinity, duration: 2.2, ease: 'easeInOut' }}
//                             >
//                               <Bike size={24} className="text-amber-600" />
//                             </motion.div>
//                           </div>
//                         </div>

//                         <div className="rounded-2xl border border-gray-100 bg-white p-4">
//                           <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-500">Journey</p>
//                           <div className="mt-4 space-y-4">
//                             <div className="flex items-center gap-3">
//                               <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100 text-green-700">
//                                 <ShoppingBag size={18} />
//                               </div>
//                               <div>
//                                 <p className="font-semibold text-gray-800">Cafe dispatch</p>
//                                 <p className="text-sm text-gray-500">Your order has left the cafe.</p>
//                               </div>
//                             </div>
//                             <div className="flex items-center gap-3">
//                               <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-100 text-amber-700">
//                                 <Bike size={18} />
//                               </div>
//                               <div>
//                                 <p className="font-semibold text-gray-800">Rider movement</p>
//                                 <p className="text-sm text-gray-500">{displayLocation || 'Location is updating with the timer.'}</p>
//                               </div>
//                             </div>
//                             <div className="flex items-center gap-3">
//                               <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100 text-red-600">
//                                 <MapPin size={18} />
//                               </div>
//                               <div>
//                                 <p className="font-semibold text-gray-800">Delivery point</p>
//                                 <p className="text-sm text-gray-500">{order.deliveryAddress?.text || 'Saved delivery address'}</p>
//                               </div>
//                             </div>
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                   ) : (
//                     <div className="absolute inset-0 flex items-center justify-center">
//                       <div className="text-center">
//                         <MapPin size={48} className="mx-auto text-gray-300 mb-3" />
//                         <p className="text-gray-500">Waiting for rider location...</p>
//                         <p className="text-xs text-gray-400 mt-1">Location will appear once delivery starts</p>
//                       </div>
//                     </div>
//                   )}
//                 </div>

//                 {/* Location Info */}
//                 <div className="p-4 bg-white border-t border-gray-100">
//                   <div className="grid md:grid-cols-2 gap-3">
//                     <div className="bg-gray-50 rounded-lg p-3">
//                       <p className="text-xs text-gray-500 mb-1">Current Location</p>
//                       <p className="text-sm font-medium text-gray-800">{locationCoordinates}</p>
//                       {lastLocationUpdate && (
//                         <p className="text-xs text-gray-400 mt-1">Updated {lastLocationUpdate}</p>
//                       )}
//                     </div>
//                     <div className="bg-gray-50 rounded-lg p-3">
//                       <p className="text-xs text-gray-500 mb-1">Delivery Address</p>
//                       <p className="text-sm text-gray-800">{order.deliveryAddress?.text || 'Address not available'}</p>
//                     </div>
//                   </div>
                  
//                   {/* Navigation Button */}
//                   {displayLocation && (
//                     <a 
//                       href={`https://maps.google.com/?q=${displayLocation.lat},${displayLocation.lng}`}
//                       target="_blank"
//                       rel="noopener noreferrer"
//                       className="mt-3 w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-amber-600 text-white hover:bg-amber-700 transition-all shadow-sm"
//                     >
//                       <Navigation size={16} />
//                       Open in Google Maps
//                     </a>
//                   )}
//                 </div>
//               </div>
//             )}

//             {/* Status Timeline */}
//             <div className="bg-white border border-gray-100 rounded-xl p-5 mb-6">
//               <h2 className="font-semibold text-gray-800 mb-5">Order Status</h2>
//               <div className="relative">
//                 {timelineSteps.map((status, index) => {
//                   const meta = STATUS_META[status];
//                   const Icon = meta.icon;
//                   const isCompleted = currentIndex >= index;
//                   const isCurrent = currentStatus === status;
//                   const statusTime = getStatusTime(status);

//                   return (
//                     <motion.div
//                       key={status}
//                       initial={{ opacity: 0, x: -20 }}
//                       animate={{ opacity: 1, x: 0 }}
//                       transition={{ delay: index * 0.1 }}
//                       className="flex gap-3 mb-4 last:mb-0"
//                     >
//                       <div className="flex flex-col items-center">
//                         <motion.div 
//                           className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
//                             isCompleted ? `${meta.color} border-0` : 'bg-gray-100 text-gray-400'
//                           }`}
//                           whileHover={{ scale: 1.1 }}
//                         >
//                           <Icon size={14} />
//                         </motion.div>
//                         {index < timelineSteps.length - 1 && (
//                           <div className={`w-0.5 h-8 mt-1 ${isCompleted ? 'bg-amber-200' : 'bg-gray-100'}`} />
//                         )}
//                       </div>
//                       <div className="flex-1 pb-3">
//                         <div className="flex items-center gap-2 flex-wrap">
//                           <p className={`font-medium text-sm ${isCompleted ? 'text-gray-800' : 'text-gray-400'}`}>
//                             {meta.title}
//                           </p>
//                           {isCurrent && (
//                             <motion.span 
//                               className="inline-block w-2 h-2 rounded-full bg-amber-500"
//                               animate={{ scale: [1, 1.5, 1] }}
//                               transition={{ repeat: Infinity, duration: 1.5 }}
//                             />
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

//             {/* Order Details Grid */}
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
//                       <span className="font-medium text-gray-800">₹{item.totalPrice || item.unitPrice * item.quantity}</span>
//                     </div>
//                   ))}
//                   <div className="border-t border-gray-100 pt-2 mt-2">
//                     <div className="flex justify-between text-sm">
//                       <span className="text-gray-500">Subtotal</span>
//                       <span className="text-gray-700">₹{order.subtotal}</span>
//                     </div>
//                     <div className="flex justify-between text-sm">
//                       <span className="text-gray-500">Delivery Fee</span>
//                       <span className="text-gray-700">₹{order.deliveryFee || 0}</span>
//                     </div>
//                     <div className="flex justify-between text-sm">
//                       <span className="text-gray-500">Tax</span>
//                       <span className="text-gray-700">₹{order.taxAmount || 0}</span>
//                     </div>
//                     <div className="flex justify-between font-bold text-base pt-2 mt-1 border-t border-gray-100">
//                       <span className="text-gray-800">Total</span>
//                       <span className="text-amber-600">₹{order.totalAmount}</span>
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               {/* Delivery Info */}
//               <div className="bg-white border border-gray-100 rounded-xl p-5">
//                 <h2 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
//                   <MapPin size={16} className="text-amber-600" />
//                   {order.orderType === 'delivery' ? 'Delivery Address' : 'Pickup Details'}
//                 </h2>
//                 {order.orderType === 'delivery' ? (
//                   <>
//                     <p className="text-sm text-gray-600 leading-relaxed">
//                       {order.deliveryAddress?.text || 'Address not available'}
//                     </p>
//                   </>
//                 ) : (
//                   <div className="space-y-2">
//                     <p className="text-sm text-gray-600">Pick up from our cafe counter</p>
//                     <p className="text-sm text-gray-500">Show your order ID at pickup</p>
//                     {order.scheduledTime && (
//                       <p className="text-sm text-amber-600 mt-2">
//                         Scheduled: {formatDateTime(order.scheduledTime)}
//                       </p>
//                     )}
//                   </div>
//                 )}
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

//             {/* Delivered Celebration */}
//             {currentStatus === 'delivered' && (
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
//                 <h3 className="text-xl font-bold text-gray-800">Order Delivered! 🎉</h3>
//                 <p className="text-sm text-gray-600 mt-1">Thank you for ordering from Roller Coaster Cafe</p>
//                 <p className="text-xs text-gray-500 mt-2">Enjoy your meal! Rate your experience in the app</p>
//               </motion.div>
//             )}
//           </>
//         )}
//       </main>

//       {/* Footer */}
//       <footer className="border-t border-gray-100 bg-white py-4 mt-8">
//         <div className="max-w-6xl mx-auto px-4 text-center">
//           <div className="flex flex-wrap items-center justify-center gap-4 mb-2">
//             <Link to="/dashboard" className="text-xs text-gray-400 hover:text-amber-600">Home</Link>
//             <Link to="/menu" className="text-xs text-gray-400 hover:text-amber-600">Menu</Link>
//             <Link to="/orders" className="text-xs text-gray-400 hover:text-amber-600">Orders</Link>
//             <Link to="/profile" className="text-xs text-gray-400 hover:text-amber-600">Profile</Link>
//             <Link to="/settings" className="text-xs text-gray-400 hover:text-amber-600">Settings</Link>
//           </div>
//           <p className="text-xs text-gray-400">© {new Date().getFullYear()} Roller Coaster Cafe</p>
//         </div>
//       </footer>
//     </div>
//   );
// }

import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { io } from 'socket.io-client';
import {
  ArrowLeft,
  BellRing,
  Bike,
  CalendarDays,
  CheckCircle2,
  ChefHat,
  Clock3,
  MapPin,
  PackageCheck,
  Phone,
  ShoppingBag,
  Table2,
  Truck,
  Navigation,
  ShieldCheck,
  Copy,
  Check,
  WifiOff,
  RefreshCw,
  UserRound,
  Mail
} from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';

// ============ CONSTANTS ============
const STATUS_FLOW = ['placed', 'confirmed', 'preparing', 'ready', 'out-for-delivery', 'delivered'];

const ORDER_TYPE_META = {
  delivery: { icon: Truck, label: 'Delivery', color: 'bg-sky-50 text-sky-600' },
  'dine-in': { icon: Table2, label: 'Dine-In', color: 'bg-emerald-50 text-emerald-600' },
  takeaway: { icon: ShoppingBag, label: 'Takeaway', color: 'bg-violet-50 text-violet-600' },
  'pre-order': { icon: CalendarDays, label: 'Pre-Order', color: 'bg-orange-50 text-orange-600' },
};

const STATUS_META = {
  placed: { title: 'Order Placed', desc: 'Your order has been received', icon: Clock3, color: 'bg-amber-50 text-amber-600' },
  confirmed: { title: 'Order Confirmed', desc: 'Restaurant accepted your order', icon: CheckCircle2, color: 'bg-blue-50 text-blue-600' },
  preparing: { title: 'Preparing', desc: 'Kitchen is preparing your food', icon: ChefHat, color: 'bg-orange-50 text-orange-600' },
  ready: { title: 'Ready', desc: 'Your order is ready', icon: PackageCheck, color: 'bg-emerald-50 text-emerald-600' },
  'out-for-delivery': { title: 'Out for Delivery', desc: 'Rider is on the way', icon: Bike, color: 'bg-indigo-50 text-indigo-600' },
  delivered: { title: 'Delivered', desc: 'Order delivered successfully', icon: CheckCircle2, color: 'bg-green-50 text-green-600' },
  cancelled: { title: 'Cancelled', desc: 'Order was cancelled', icon: Clock3, color: 'bg-red-50 text-red-600' },
};

// ============ HELPER FUNCTIONS ============
const getSocketBaseUrl = () => (
  import.meta.env.VITE_SOCKET_URL ||
  import.meta.env.VITE_API_URL?.replace('/api', '') ||
  'http://localhost:5000'
);

const formatDateTime = (value) => {
  if (!value) return '-';
  return new Date(value).toLocaleString('en-IN', {
    day: 'numeric',
    month: 'short',
    hour: 'numeric',
    minute: '2-digit',
  });
};

const formatTimeAgo = (value) => {
  if (!value) return 'Not yet';
  const now = new Date();
  const past = new Date(value);
  const diffMs = now - past;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins} min ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
};

const formatCurrency = (value) => `₹${Number(value || 0).toLocaleString('en-IN')}`;

const toNumber = (value) => (typeof value === 'number' ? value : Number(value));

const formatCoordinates = (lat, lng) => {
  const nextLat = toNumber(lat);
  const nextLng = toNumber(lng);
  if (!Number.isFinite(nextLat) || !Number.isFinite(nextLng)) return 'Waiting for location';
  return `${nextLat.toFixed(6)}, ${nextLng.toFixed(6)}`;
};

const formatLocationLabel = (location) => {
  const readableLabel = String(location?.locationName || location?.address || '').trim();
  if (readableLabel) return readableLabel;
  return formatCoordinates(location?.lat, location?.lng);
};

const calculateSimulatedLocation = (progressPercent, startLat, startLng, endLat, endLng) => {
  if (!startLat || !startLng || !endLat || !endLng) return null;
  const lat = startLat + (endLat - startLat) * (progressPercent / 100);
  const lng = startLng + (endLng - startLng) * (progressPercent / 100);
  return { lat, lng };
};

const hasCoordinates = (location) => Number.isFinite(toNumber(location?.lat)) && Number.isFinite(toNumber(location?.lng));

const buildGoogleMapLink = (location) => {
  if (!hasCoordinates(location)) return '';
  return `https://www.google.com/maps?q=${location.lat},${location.lng}`;
};

// ============ MAIN COMPONENT ============
export default function OrderTrackingPage() {
  const { orderId } = useParams();
  const [liveOrder, setLiveOrder] = useState(null);
  const [now, setNow] = useState(Date.now());
  const [copied, setCopied] = useState(false);
  const [simulatedLocation, setSimulatedLocation] = useState(null);
  const [progressPercent, setProgressPercent] = useState(0);
  const [isConnected, setIsConnected] = useState(true);
  const [lastPing, setLastPing] = useState(Date.now());

  // Update current time every second
  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Fetch order data
  const { data, isLoading, refetch } = useQuery({
    queryKey: ['order-track', orderId],
    queryFn: () => api.get(`/orders/${orderId}`).then((res) => res.data),
    retry: false,
    refetchInterval: 10000,
  });

  // Update live order when data changes
  useEffect(() => {
    if (data?.order || data) {
      setLiveOrder((prev) => ({ ...(prev || {}), ...(data?.order || data) }));
    }
  }, [data]);

  // Timer-based location simulation
  useEffect(() => {
    const order = liveOrder || data?.order || data;
    
    if (order?.status === 'out-for-delivery' && order?.estimatedDeliveryAt && order?.deliveryAcceptedAt) {
      const startTime = new Date(order.deliveryAcceptedAt).getTime();
      const endTime = new Date(order.estimatedDeliveryAt).getTime();
      const currentTime = Date.now();
      
      let percent = ((currentTime - startTime) / (endTime - startTime)) * 100;
      percent = Math.min(100, Math.max(0, percent));
      setProgressPercent(percent);
      
      // Simulate rider location based on progress
      const restaurantLat = order.restaurantLocation?.lat || 23.0368;
      const restaurantLng = order.restaurantLocation?.lng || 72.5477;
      const customerLat = order?.deliveryAddress?.lat || 23.0400;
      const customerLng = order?.deliveryAddress?.lng || 72.5500;
      
      const simulated = calculateSimulatedLocation(percent, restaurantLat, restaurantLng, customerLat, customerLng);
      if (simulated) {
        setSimulatedLocation(simulated);
      }
      
      if (percent >= 100) {
        setProgressPercent(100);
      }
    } else {
      setProgressPercent(0);
      setSimulatedLocation(null);
    }
  }, [liveOrder, data, now]);

  // WebSocket connection for real-time updates
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

    socket.on('disconnect', () => {
      setIsConnected(false);
    });

    socket.on('connect_error', () => {
      setIsConnected(false);
    });

    socket.on('order-updated', (payload) => {
      if (String(payload.orderId) === String(orderId)) {
        setLiveOrder((prev) => ({ ...(prev || {}), ...payload }));
        if (payload.status === 'delivered') {
          toast.success('Order Delivered! Thank you for ordering with us! 🎉');
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

    const pingInterval = setInterval(() => {
      if (socket.connected) {
        socket.emit('ping');
        setLastPing(Date.now());
      }
    }, 30000);

    return () => {
      clearInterval(pingInterval);
      socket.emit('leave-room', { room: `order:${orderId}` });
      socket.close();
    };
  }, [orderId, refetch]);

  const order = liveOrder || data?.order || data;
  const typeMeta = ORDER_TYPE_META[order?.orderType] || ORDER_TYPE_META.delivery;
  const TypeIcon = typeMeta.icon;
  const currentStatus = order?.status || 'placed';
  const statusMeta = STATUS_META[currentStatus] || STATUS_META.placed;
  const StatusIcon = statusMeta.icon;
  const currentIndex = STATUS_FLOW.indexOf(currentStatus);
  const latestDeliveryRejection = Array.isArray(order?.deliveryRejections) && order.deliveryRejections.length
    ? order.deliveryRejections[order.deliveryRejections.length - 1]
    : null;

  const hasRealLiveLocation = Number.isFinite(toNumber(order?.liveLocation?.lat)) && Number.isFinite(toNumber(order?.liveLocation?.lng));
  const displayLocation = hasRealLiveLocation ? order?.liveLocation : simulatedLocation;
  const hasTracking = order?.orderType === 'delivery' && (hasRealLiveLocation || simulatedLocation);

  const timelineSteps = useMemo(() => {
    if (order?.orderType !== 'delivery') {
      return STATUS_FLOW.filter(step => step !== 'out-for-delivery');
    }
    return STATUS_FLOW;
  }, [order?.orderType]);

  const getStatusTime = (status) => {
    if (!order?.statusHistory) return null;
    const historyEntry = order.statusHistory.find(entry => entry.status === status);
    return historyEntry?.updatedAt || null;
  };

  const lastLocationUpdate = useMemo(() => {
    if (!order?.liveLocation?.updatedAt) return null;
    return formatTimeAgo(order.liveLocation.updatedAt);
  }, [order?.liveLocation?.updatedAt, now]);

  const locationCoordinates = useMemo(() => {
    if (!displayLocation) return 'Waiting for live location';
    return formatLocationLabel(displayLocation);
  }, [displayLocation]);

  const isLive = currentStatus === 'out-for-delivery' && hasTracking;

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
          <div className="max-w-6xl mx-auto px-4 py-3">
            <div className="flex items-center justify-between">
              <Link to="/dashboard" className="flex items-center gap-2">
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
      {/* Header */}
      <header className="border-b border-gray-100 bg-white sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <Link to="/dashboard" className="flex items-center gap-2">
              <img 
                src="https://rollercoastercafe.com/assets/images/roller_logo.png" 
                alt="Logo"
                className="h-8 w-8 rounded-full object-cover"
              />
              <span className="font-semibold text-lg text-gray-800">Roller Coaster Cafe</span>
            </Link>

            <nav className="hidden md:flex items-center gap-6">
              <Link to="/dashboard" className="text-sm text-gray-500 hover:text-amber-600">Home</Link>
              <Link to="/menu" className="text-sm text-gray-500 hover:text-amber-600">Menu</Link>
              <Link to="/orders" className="text-sm text-amber-600">Orders</Link>
              <Link to="/profile" className="text-sm text-gray-500 hover:text-amber-600">Profile</Link>
            </nav>

            {!isConnected && (
              <div className="flex items-center gap-2 text-xs text-red-500 bg-red-50 px-3 py-1 rounded-full">
                <WifiOff size={12} />
                <span>Reconnecting...</span>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6">
        {/* Back Button */}
        <div className="flex items-center justify-between mb-4">
          <Link to="/orders" className="inline-flex items-center gap-1 text-sm text-gray-400 hover:text-amber-600">
            <ArrowLeft size={14} /> Back to Orders
          </Link>
          
          <button 
            onClick={() => refetch()}
            className="inline-flex items-center gap-1 text-sm text-gray-400 hover:text-amber-600"
          >
            <RefreshCw size={14} /> Refresh
          </button>
        </div>

        {/* Order Header Card */}
        <div className="bg-white border border-gray-100 rounded-xl p-5 mb-6 shadow-sm">
          <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
            <div>
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium ${typeMeta.color}`}>
                  <TypeIcon size={12} />
                  {typeMeta.label}
                </span>
                <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium ${statusMeta.color}`}>
                  <StatusIcon size={12} />
                  {statusMeta.title}
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

        {currentStatus === 'ready' && latestDeliveryRejection?.reason && (
          <div className="mb-6 rounded-xl border border-amber-200 bg-amber-50 p-4">
            <p className="text-sm font-semibold text-amber-800">Delivery partner change in progress</p>
            <p className="mt-1 text-sm text-amber-700">A rider declined this delivery request. The cafe is assigning a new delivery partner now.</p>
            <p className="mt-2 text-xs text-amber-700">Reason: {latestDeliveryRejection.reason}</p>
          </div>
        )}

        {/* OTP Section */}
        {order.orderType === 'delivery' && currentStatus === 'out-for-delivery' && order.deliveryOTP && (
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl p-5 mb-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center">
                <ShieldCheck size={18} className="text-amber-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">Delivery OTP Required</h3>
                <p className="text-sm text-gray-500">Share this OTP with the delivery partner to complete delivery</p>
              </div>
            </div>
            <div className="flex items-center justify-between bg-white rounded-xl p-4 border border-amber-200">
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide">Your One-Time Password</p>
                <p className="text-3xl font-bold tracking-widest text-gray-800 mt-1">{order.deliveryOTP}</p>
              </div>
              <button
                onClick={copyOTP}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-amber-600 text-white hover:bg-amber-700 transition-all"
              >
                {copied ? <Check size={16} /> : <Copy size={16} />}
                {copied ? 'Copied!' : 'Copy OTP'}
              </button>
            </div>
            <p className="text-xs text-amber-600 mt-3">
              ⚠️ Never share this OTP with anyone except the delivery person
            </p>
          </div>
        )}

        {/* Live Tracking Section - NO ESTIMATED TIME BOX */}
        {order.orderType === 'delivery' && currentStatus === 'out-for-delivery' && (
          <div className="bg-white border border-gray-100 rounded-xl overflow-hidden mb-6 shadow-sm">
            {/* Header */}
            <div className="p-4 border-b border-gray-100 bg-gradient-to-r from-amber-50 to-orange-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MapPin size={18} className="text-amber-600" />
                  <h2 className="font-semibold text-gray-800">Tracking your delivery</h2>
                </div>
                {isLive && (
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
                  transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
                >
                  <Bike size={22} className="text-amber-600" />
                </motion.div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-800">Delivery Partner</p>
                  <p className="text-sm text-gray-700">{order.deliveryAgent?.name || 'Delivery partner pending'}</p>
                  <p className="text-xs text-gray-500 capitalize">{order.deliveryAgent?.vehicleType || 'Rider details will appear after acceptance'}</p>
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

            {/* Progress Bar Only - No Timer Box */}
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
            {timelineSteps.map((status, index) => {
              const meta = STATUS_META[status];
              const Icon = meta.icon;
              const isCompleted = currentIndex >= index;
              const isCurrent = currentStatus === status;
              const statusTime = getStatusTime(status);

              return (
                <motion.div
                  key={status}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex gap-3 mb-4 last:mb-0"
                >
                  <div className="flex flex-col items-center">
                    <motion.div 
                      className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                        isCompleted ? meta.color : 'bg-gray-100 text-gray-400'
                      }`}
                      whileHover={{ scale: 1.1 }}
                    >
                      <Icon size={14} />
                    </motion.div>
                    {index < timelineSteps.length - 1 && (
                      <div className={`w-0.5 h-8 mt-1 ${isCompleted ? 'bg-amber-200' : 'bg-gray-100'}`} />
                    )}
                  </div>
                  <div className="flex-1 pb-3">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className={`font-medium text-sm ${isCompleted ? 'text-gray-800' : 'text-gray-400'}`}>
                        {meta.title}
                      </p>
                      {isCurrent && (
                        <motion.span 
                          className="inline-block w-2 h-2 rounded-full bg-amber-500"
                          animate={{ scale: [1, 1.5, 1] }}
                          transition={{ repeat: Infinity, duration: 1.5 }}
                        />
                      )}
                      {statusTime && (
                        <span className="text-xs text-gray-400 ml-2">
                          {formatDateTime(statusTime)}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-400 mt-0.5">{meta.desc}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Order Details Grid */}
        <div className="grid md:grid-cols-2 gap-5">
          {/* Items */}
          <div className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm">
            <h2 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <ShoppingBag size={16} className="text-amber-600" />
              Order Items
            </h2>
            <div className="space-y-2">
              {order.items?.map((item, idx) => (
                <div key={idx} className="flex justify-between text-sm">
                  <span className="text-gray-600">{item.quantity} × {item.name}</span>
                  <span className="font-medium text-gray-800">
                    {formatCurrency(item.totalPrice || item.unitPrice * item.quantity)}
                  </span>
                </div>
              ))}
              <div className="border-t border-gray-100 pt-2 mt-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Subtotal</span>
                  <span className="text-gray-700">{formatCurrency(order.subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Delivery Fee</span>
                  <span className="text-gray-700">{formatCurrency(order.deliveryFee || 0)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Tax</span>
                  <span className="text-gray-700">{formatCurrency(order.taxAmount || 0)}</span>
                </div>
                {(order.preOrderFee || 0) > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Pre-order Fee</span>
                    <span className="text-gray-700">{formatCurrency(order.preOrderFee || 0)}</span>
                  </div>
                )}
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
              {order.orderType === 'delivery' ? 'Delivery Address' : 'Pickup Details'}
            </h2>
            {order.orderType === 'delivery' ? (
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
              <div className="space-y-2">
                <p className="text-sm text-gray-600">Pick up from our cafe counter</p>
                <p className="text-sm text-gray-500">Show your order ID at pickup</p>
                {order.scheduledTime && (
                  <p className="text-sm text-amber-600 mt-2">
                    Scheduled: {formatDateTime(order.scheduledTime)}
                  </p>
                )}
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

        {/* Delivered Celebration */}
        {currentStatus === 'delivered' && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="mt-5 p-6 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl text-center"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 0.5 }}
              className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-3"
            >
              <CheckCircle2 size={32} className="text-green-600" />
            </motion.div>
            <h3 className="text-xl font-bold text-gray-800">Order Delivered! 🎉</h3>
            <p className="text-sm text-gray-600 mt-1">Thank you for ordering from Roller Coaster Cafe</p>
            <p className="text-xs text-gray-500 mt-2">Enjoy your meal! Rate your experience in the app</p>
          </motion.div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-100 bg-white py-4 mt-8">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <div className="flex flex-wrap items-center justify-center gap-4 mb-2">
            <Link to="/dashboard" className="text-xs text-gray-400 hover:text-amber-600">Home</Link>
            <Link to="/menu" className="text-xs text-gray-400 hover:text-amber-600">Menu</Link>
            <Link to="/orders" className="text-xs text-gray-400 hover:text-amber-600">Orders</Link>
            <Link to="/profile" className="text-xs text-gray-400 hover:text-amber-600">Profile</Link>
          </div>
          <p className="text-xs text-gray-400">© {new Date().getFullYear()} Roller Coaster Cafe</p>
        </div>
      </footer>
    </div>
  );
}
