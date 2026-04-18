// // // // // // frontend/src/pages/customer/DeliveryTrackingPage.jsx
// // // // // import { useEffect, useState } from 'react';
// // // // // import { Link, useParams } from 'react-router-dom';
// // // // // import { useQuery } from '@tanstack/react-query';
// // // // // import { 
// // // // //   ArrowLeft, Bike, MapPin, Phone, RefreshCw, Navigation, CheckCircle2
// // // // // } from 'lucide-react';
// // // // // import api from '../../services/api';
// // // // // import CustomerFooter from '../../components/customer/CustomerFooter';

// // // // // const formatTimeAgo = (value) => {
// // // // //   if (!value) return 'Not yet';
// // // // //   const now = new Date();
// // // // //   const past = new Date(value);
// // // // //   const diffMins = Math.floor((now - past) / 60000);
// // // // //   if (diffMins < 1) return 'Just now';
// // // // //   if (diffMins < 60) return `${diffMins} min ago`;
// // // // //   return `${Math.floor(diffMins / 60)} hour${Math.floor(diffMins / 60) > 1 ? 's' : ''} ago`;
// // // // // };

// // // // // export default function DeliveryTrackingPage() {
// // // // //   const { orderId } = useParams();
// // // // //   const [liveOrder, setLiveOrder] = useState(null);

// // // // //   const { data, isLoading, refetch } = useQuery({
// // // // //     queryKey: ['delivery-track', orderId],
// // // // //     queryFn: () => api.get(`/orders/${orderId}`).then((res) => res.data),
// // // // //     retry: false,
// // // // //     refetchInterval: 10000,
// // // // //   });

// // // // //   useEffect(() => {
// // // // //     if (data?.order || data) {
// // // // //       setLiveOrder((prev) => ({ ...(prev || {}), ...(data?.order || data) }));
// // // // //     }
// // // // //   }, [data]);

// // // // //   const order = liveOrder || data?.order || data;
// // // // //   const currentStatus = order?.status || 'placed';
// // // // //   const riderLat = Number(order?.liveLocation?.lat || order?.deliveryLocation?.lat || 0);
// // // // //   const riderLng = Number(order?.liveLocation?.lng || order?.deliveryLocation?.lng || 0);
// // // // //   const hasLiveRiderLocation = riderLat !== 0 && riderLng !== 0;
// // // // //   const liveMapsUrl = hasLiveRiderLocation ? `https://www.google.com/maps?q=${riderLat},${riderLng}` : null;

// // // // //   if (isLoading || !order) {
// // // // //     return (
// // // // //       <div className="min-h-screen bg-white">
// // // // //         <div className="max-w-4xl mx-auto px-4 py-8">
// // // // //           <div className="animate-pulse space-y-4">
// // // // //             <div className="h-32 bg-gray-100 rounded-xl" />
// // // // //             <div className="h-64 bg-gray-100 rounded-xl" />
// // // // //           </div>
// // // // //         </div>
// // // // //       </div>
// // // // //     );
// // // // //   }

// // // // //   return (
// // // // //     <div className="min-h-screen bg-white">
// // // // //       {/* Header */}
// // // // //       <header className="border-b border-gray-100 bg-white sticky top-0 z-50">
// // // // //         <div className="max-w-4xl mx-auto px-4 py-3">
// // // // //           <div className="flex items-center justify-between">
// // // // //             <Link to="/dashboard" className="flex items-center gap-2">
// // // // //               <img 
// // // // //                 src="https://rollercoastercafe.com/assets/images/roller_logo.png" 
// // // // //                 alt="Logo"
// // // // //                 className="h-8 w-8 rounded-full object-cover"
// // // // //               />
// // // // //               <span className="font-semibold text-lg text-gray-800">Roller Coaster Cafe</span>
// // // // //             </Link>
// // // // //             <Link to="/orders" className="text-sm text-gray-500 hover:text-amber-600 flex items-center gap-1">
// // // // //               <ArrowLeft size={14} /> Back to Orders
// // // // //             </Link>
// // // // //           </div>
// // // // //         </div>
// // // // //       </header>

// // // // //       <main className="max-w-4xl mx-auto px-4 py-6">
// // // // //         {/* Order Header */}
// // // // //         <div className="bg-white border border-gray-100 rounded-xl p-5 mb-6">
// // // // //           <div className="flex justify-between items-start mb-4">
// // // // //             <div>
// // // // //               <h1 className="font-bold text-xl text-gray-800">Order #{order.orderId}</h1>
// // // // //               <p className="text-sm text-gray-400 mt-1">Tracking your delivery</p>
// // // // //             </div>
// // // // //             <div className="text-right">
// // // // //               <div className="text-2xl font-bold text-gray-800">₹{order.totalAmount}</div>
// // // // //               <div className="text-xs text-gray-400 capitalize mt-1">{order.paymentMethod}</div>
// // // // //             </div>
// // // // //           </div>
          
// // // // //           {currentStatus === 'out-for-delivery' && (
// // // // //             <div className="mt-4 p-4 bg-green-50 rounded-lg">
// // // // //               <div className="flex items-center gap-2 text-green-700">
// // // // //                 <span className="w-2 h-2 rounded-full bg-green-600 animate-pulse"></span>
// // // // //                 <span className="font-medium">Your order is out for delivery!</span>
// // // // //               </div>
// // // // //               <p className="text-sm text-green-600 mt-1">Rider is on the way to your location</p>
// // // // //             </div>
// // // // //           )}
          
// // // // //           {currentStatus === 'delivered' && (
// // // // //             <div className="mt-4 p-4 bg-green-100 rounded-lg">
// // // // //               <div className="flex items-center gap-2 text-green-700">
// // // // //                 <CheckCircle2 size={18} />
// // // // //                 <span className="font-medium">Order Delivered!</span>
// // // // //               </div>
// // // // //               <p className="text-sm text-green-600 mt-1">Thank you for ordering with us!</p>
// // // // //             </div>
// // // // //           )}
// // // // //         </div>

// // // // //         {/* Rider Info */}
// // // // //         <div className="bg-white border border-gray-100 rounded-xl p-5 mb-6">
// // // // //           <h2 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
// // // // //             <Bike size={18} className="text-amber-600" />
// // // // //             Delivery Partner
// // // // //           </h2>
// // // // //           {order.deliveryAgent ? (
// // // // //             <div className="flex items-center justify-between">
// // // // //               <div>
// // // // //                 <p className="font-medium text-gray-800">{order.deliveryAgent.name}</p>
// // // // //                 <p className="text-sm text-gray-500">{order.deliveryAgent.vehicleType || 'Delivery Partner'}</p>
// // // // //                 {order.deliveryAgent.phone && (
// // // // //                   <p className="text-xs text-gray-400 mt-1">{order.deliveryAgent.phone}</p>
// // // // //                 )}
// // // // //               </div>
// // // // //               {order.deliveryAgent.phone ? (
// // // // //                 <a href={`tel:${order.deliveryAgent.phone}`} className="p-2.5 rounded-full bg-amber-100 text-amber-600 hover:bg-amber-200">
// // // // //                   <Phone size={18} />
// // // // //                 </a>
// // // // //               ) : null}
// // // // //             </div>
// // // // //           ) : (
// // // // //             <p className="text-sm text-gray-500">Rider will appear here once the cafe assigns delivery.</p>
// // // // //           )}
// // // // //         </div>

// // // // //         {/* Live Location */}
// // // // //         {order.liveLocation && currentStatus === 'out-for-delivery' && (
// // // // //           <div className="bg-white border border-gray-100 rounded-xl p-5 mb-6">
// // // // //             <div className="flex justify-between items-center mb-4">
// // // // //               <h2 className="font-semibold text-gray-800 flex items-center gap-2">
// // // // //                 <MapPin size={18} className="text-amber-600" />
// // // // //                 Current rider location
// // // // //               </h2>
// // // // //               <button onClick={() => refetch()} className="text-sm text-amber-600 hover:underline flex items-center gap-1">
// // // // //                 <RefreshCw size={14} /> Refresh
// // // // //               </button>
// // // // //             </div>
// // // // //             <div className="bg-gray-50 rounded-lg p-4">
// // // // //               <p className="text-sm font-mono text-gray-700 break-all">
// // // // //                 {order.liveLocation.lat}, {order.liveLocation.lng}
// // // // //               </p>
// // // // //               <p className="text-xs text-gray-400 mt-2">
// // // // //                 Last updated: {formatTimeAgo(order.liveLocation.updatedAt)}
// // // // //               </p>
// // // // //               <a 
// // // // //                 href={`https://maps.google.com/?q=${order.liveLocation.lat},${order.liveLocation.lng}`}
// // // // //                 target="_blank"
// // // // //                 rel="noopener noreferrer"
// // // // //                 className="inline-flex items-center gap-2 mt-3 text-sm text-amber-600 hover:underline"
// // // // //               >
// // // // //                 <Navigation size={14} /> Open rider location
// // // // //               </a>
// // // // //             </div>
// // // // //           </div>
// // // // //         )}

// // // // //         {/* Delivery Address */}
// // // // //         {order.deliveryAddress && (
// // // // //           <div className="bg-white border border-gray-100 rounded-xl p-5">
// // // // //             <h2 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
// // // // //               <MapPin size={18} className="text-amber-600" />
// // // // //               Delivery Address
// // // // //             </h2>
// // // // //             <p className="text-gray-600">{order.deliveryAddress.text}</p>
// // // // //           </div>
// // // // //         )}

// // // // //       </main>

// // // // //       {/* Footer */}
// // // // //       <CustomerFooter />
// // // // //     </div>
// // // // //   );
// // // // // }

// // // // import { useEffect, useState } from 'react';
// // // // import { Link, useParams } from 'react-router-dom';
// // // // import { useQuery } from '@tanstack/react-query';
// // // // import { 
// // // //   ArrowLeft, Bike, MapPin, Phone, RefreshCw, Navigation, CheckCircle2
// // // // } from 'lucide-react';
// // // // import api from '../../services/api';
// // // // import CustomerFooter from '../../components/customer/CustomerFooter';
// // // // import toast from 'react-hot-toast';

// // // // const formatTimeAgo = (value) => {
// // // //   if (!value) return 'Not yet';
// // // //   const now = new Date();
// // // //   const past = new Date(value);
// // // //   const diffMins = Math.floor((now - past) / 60000);
// // // //   if (diffMins < 1) return 'Just now';
// // // //   if (diffMins < 60) return `${diffMins} min ago`;
// // // //   return `${Math.floor(diffMins / 60)} hour${Math.floor(diffMins / 60) > 1 ? 's' : ''} ago`;
// // // // };

// // // // const formatDateTime = (value) => {
// // // //   if (!value) return '-';
// // // //   return new Date(value).toLocaleString('en-IN', {
// // // //     day: 'numeric',
// // // //     month: 'short',
// // // //     hour: 'numeric',
// // // //     minute: '2-digit',
// // // //   });
// // // // };

// // // // const formatCurrency = (value) => `₹${Number(value || 0).toLocaleString('en-IN')}`;

// // // // export default function DeliveryTrackingPage() {
// // // //   const { orderId } = useParams();
// // // //   const [liveOrder, setLiveOrder] = useState(null);

// // // //   // Debug log to check if orderId is received
// // // //   console.log('DeliveryTrackingPage - orderId from params:', orderId);

// // // //   const { data, isLoading, error, refetch } = useQuery({
// // // //     queryKey: ['delivery-track', orderId],
// // // //     queryFn: async () => {
// // // //       if (!orderId) {
// // // //         throw new Error('Order ID is required');
// // // //       }
// // // //       console.log('Fetching order:', orderId);
// // // //       const response = await api.get(`/orders/${orderId}`);
// // // //       console.log('Order data received:', response.data);
// // // //       return response.data;
// // // //     },
// // // //     enabled: !!orderId, // Only run query if orderId exists
// // // //     retry: false,
// // // //     refetchInterval: 10000,
// // // //   });

// // // //   useEffect(() => {
// // // //     if (error) {
// // // //       console.error('Error fetching order:', error);
// // // //       toast.error(error.response?.data?.message || 'Could not load order details');
// // // //     }
// // // //   }, [error]);

// // // //   useEffect(() => {
// // // //     if (data?.order || data) {
// // // //       setLiveOrder((prev) => ({ ...(prev || {}), ...(data?.order || data) }));
// // // //     }
// // // //   }, [data]);

// // // //   const order = liveOrder || data?.order || data;
// // // //   const currentStatus = order?.status || 'placed';
// // // //   const riderLat = Number(order?.liveLocation?.lat || order?.deliveryLocation?.lat || 0);
// // // //   const riderLng = Number(order?.liveLocation?.lng || order?.deliveryLocation?.lng || 0);
// // // //   const hasLiveRiderLocation = riderLat !== 0 && riderLng !== 0;
// // // //   const liveMapsUrl = hasLiveRiderLocation ? `https://www.google.com/maps?q=${riderLat},${riderLng}` : null;

// // // //   // Show error if no orderId
// // // //   if (!orderId) {
// // // //     return (
// // // //       <div className="min-h-screen bg-white">
// // // //         <header className="border-b border-gray-100 bg-white sticky top-0 z-50">
// // // //           <div className="max-w-4xl mx-auto px-4 py-3">
// // // //             <div className="flex items-center justify-between">
// // // //               <Link to="/" className="flex items-center gap-2">
// // // //                 <img 
// // // //                   src="https://rollercoastercafe.com/assets/images/roller_logo.png" 
// // // //                   alt="Logo"
// // // //                   className="h-8 w-8 rounded-full object-cover"
// // // //                 />
// // // //                 <span className="font-semibold text-lg text-gray-800">Roller Coaster Cafe</span>
// // // //               </Link>
// // // //               <Link to="/orders" className="text-sm text-gray-500 hover:text-amber-600 flex items-center gap-1">
// // // //                 <ArrowLeft size={14} /> Back to Orders
// // // //               </Link>
// // // //             </div>
// // // //           </div>
// // // //         </header>
// // // //         <main className="max-w-4xl mx-auto px-4 py-20 text-center">
// // // //           <div className="bg-red-50 rounded-xl p-8">
// // // //             <h2 className="text-xl font-bold text-red-600 mb-2">Invalid Order</h2>
// // // //             <p className="text-gray-600">Order ID is missing. Please go back to your orders.</p>
// // // //             <Link to="/orders" className="inline-flex items-center gap-2 mt-4 text-amber-600 hover:underline">
// // // //               <ArrowLeft size={14} /> View My Orders
// // // //             </Link>
// // // //           </div>
// // // //         </main>
// // // //       </div>
// // // //     );
// // // //   }

// // // //   if (isLoading || !order) {
// // // //     return (
// // // //       <div className="min-h-screen bg-white">
// // // //         <header className="border-b border-gray-100 bg-white sticky top-0 z-50">
// // // //           <div className="max-w-4xl mx-auto px-4 py-3">
// // // //             <div className="flex items-center justify-between">
// // // //               <Link to="/" className="flex items-center gap-2">
// // // //                 <img 
// // // //                   src="https://rollercoastercafe.com/assets/images/roller_logo.png" 
// // // //                   alt="Logo"
// // // //                   className="h-8 w-8 rounded-full object-cover"
// // // //                 />
// // // //                 <span className="font-semibold text-lg text-gray-800">Roller Coaster Cafe</span>
// // // //               </Link>
// // // //             </div>
// // // //           </div>
// // // //         </header>
// // // //         <main className="max-w-4xl mx-auto px-4 py-8">
// // // //           <div className="animate-pulse space-y-4">
// // // //             <div className="h-32 bg-gray-100 rounded-xl" />
// // // //             <div className="h-64 bg-gray-100 rounded-xl" />
// // // //           </div>
// // // //         </main>
// // // //       </div>
// // // //     );
// // // //   }

// // // //   return (
// // // //     <div className="min-h-screen bg-white">
// // // //       {/* Header */}
// // // //       <header className="border-b border-gray-100 bg-white sticky top-0 z-50">
// // // //         <div className="max-w-4xl mx-auto px-4 py-3">
// // // //           <div className="flex items-center justify-between">
// // // //             <Link to="/" className="flex items-center gap-2">
// // // //               <img 
// // // //                 src="https://rollercoastercafe.com/assets/images/roller_logo.png" 
// // // //                 alt="Logo"
// // // //                 className="h-8 w-8 rounded-full object-cover"
// // // //               />
// // // //               <span className="font-semibold text-lg text-gray-800">Roller Coaster Cafe</span>
// // // //             </Link>
// // // //             <Link to="/orders" className="text-sm text-gray-500 hover:text-amber-600 flex items-center gap-1">
// // // //               <ArrowLeft size={14} /> Back to Orders
// // // //             </Link>
// // // //           </div>
// // // //         </div>
// // // //       </header>

// // // //       <main className="max-w-4xl mx-auto px-4 py-6">
// // // //         {/* Order Header */}
// // // //         <div className="bg-white border border-gray-100 rounded-xl p-5 mb-6 shadow-sm">
// // // //           <div className="flex justify-between items-start mb-4">
// // // //             <div>
// // // //               <h1 className="font-bold text-xl text-gray-800">Order #{order.orderId || order._id?.slice(-8).toUpperCase()}</h1>
// // // //               <p className="text-sm text-gray-400 mt-1">Placed on {formatDateTime(order.createdAt)}</p>
// // // //             </div>
// // // //             <div className="text-right">
// // // //               <div className="text-2xl font-bold text-gray-800">{formatCurrency(order.totalAmount)}</div>
// // // //               <div className="text-xs text-gray-400 capitalize mt-1">{order.paymentMethod}</div>
// // // //             </div>
// // // //           </div>
          
// // // //           {currentStatus === 'out-for-delivery' && (
// // // //             <div className="mt-4 p-4 bg-green-50 rounded-lg">
// // // //               <div className="flex items-center gap-2 text-green-700">
// // // //                 <span className="w-2 h-2 rounded-full bg-green-600 animate-pulse"></span>
// // // //                 <span className="font-medium">Your order is out for delivery!</span>
// // // //               </div>
// // // //               <p className="text-sm text-green-600 mt-1">Rider is on the way to your location</p>
// // // //             </div>
// // // //           )}
          
// // // //           {currentStatus === 'delivered' && (
// // // //             <div className="mt-4 p-4 bg-green-100 rounded-lg">
// // // //               <div className="flex items-center gap-2 text-green-700">
// // // //                 <CheckCircle2 size={18} />
// // // //                 <span className="font-medium">Order Delivered!</span>
// // // //               </div>
// // // //               <p className="text-sm text-green-600 mt-1">Thank you for ordering with us!</p>
// // // //             </div>
// // // //           )}
// // // //         </div>

// // // //         {/* Rider Info */}
// // // //         <div className="bg-white border border-gray-100 rounded-xl p-5 mb-6 shadow-sm">
// // // //           <h2 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
// // // //             <Bike size={18} className="text-amber-600" />
// // // //             Delivery Partner
// // // //           </h2>
// // // //           {order.deliveryAgent ? (
// // // //             <div className="flex items-center justify-between">
// // // //               <div>
// // // //                 <p className="font-medium text-gray-800">{order.deliveryAgent.name || 'Delivery Partner'}</p>
// // // //                 <p className="text-sm text-gray-500">{order.deliveryAgent.vehicleType || 'Bike'}</p>
// // // //                 {order.deliveryAgent.phone && (
// // // //                   <p className="text-xs text-gray-400 mt-1">{order.deliveryAgent.phone}</p>
// // // //                 )}
// // // //               </div>
// // // //               {order.deliveryAgent.phone && (
// // // //                 <a href={`tel:${order.deliveryAgent.phone}`} className="p-2.5 rounded-full bg-amber-100 text-amber-600 hover:bg-amber-200 transition-all">
// // // //                   <Phone size={18} />
// // // //                 </a>
// // // //               )}
// // // //             </div>
// // // //           ) : (
// // // //             <p className="text-sm text-gray-500">Rider will be assigned soon.</p>
// // // //           )}
// // // //         </div>

// // // //         {/* Live Location */}
// // // //         {hasLiveRiderLocation && currentStatus === 'out-for-delivery' && (
// // // //           <div className="bg-white border border-gray-100 rounded-xl p-5 mb-6 shadow-sm">
// // // //             <div className="flex justify-between items-center mb-4">
// // // //               <h2 className="font-semibold text-gray-800 flex items-center gap-2">
// // // //                 <MapPin size={18} className="text-amber-600" />
// // // //                 Current Rider Location
// // // //               </h2>
// // // //               <button onClick={() => refetch()} className="text-sm text-amber-600 hover:underline flex items-center gap-1">
// // // //                 <RefreshCw size={14} /> Refresh
// // // //               </button>
// // // //             </div>
// // // //             <div className="bg-gray-50 rounded-lg p-4">
// // // //               <p className="text-sm font-mono text-gray-700 break-all">
// // // //                 {riderLat.toFixed(6)}, {riderLng.toFixed(6)}
// // // //               </p>
// // // //               <p className="text-xs text-gray-400 mt-2">
// // // //                 Last updated: {formatTimeAgo(order.liveLocation?.updatedAt)}
// // // //               </p>
// // // //               <a 
// // // //                 href={`https://maps.google.com/?q=${riderLat},${riderLng}`}
// // // //                 target="_blank"
// // // //                 rel="noopener noreferrer"
// // // //                 className="inline-flex items-center gap-2 mt-3 text-sm text-amber-600 hover:underline"
// // // //               >
// // // //                 <Navigation size={14} /> Open in Google Maps
// // // //               </a>
// // // //             </div>
// // // //           </div>
// // // //         )}

// // // //         {/* Delivery Address */}
// // // //         {order.deliveryAddress && (
// // // //           <div className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm">
// // // //             <h2 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
// // // //               <MapPin size={18} className="text-amber-600" />
// // // //               Delivery Address
// // // //             </h2>
// // // //             <p className="text-gray-600">{order.deliveryAddress.text || 'Address not available'}</p>
// // // //           </div>
// // // //         )}

// // // //         {/* Status Timeline */}
// // // //         {order.statusHistory && order.statusHistory.length > 0 && (
// // // //           <div className="bg-white border border-gray-100 rounded-xl p-5 mt-5 shadow-sm">
// // // //             <h2 className="font-semibold text-gray-800 mb-4">Status Timeline</h2>
// // // //             <div className="space-y-3">
// // // //               {order.statusHistory.map((history, index) => (
// // // //                 <div key={index} className="flex items-center gap-3">
// // // //                   <div className={`w-2 h-2 rounded-full ${
// // // //                     index === order.statusHistory.length - 1 ? 'bg-amber-500' : 'bg-gray-300'
// // // //                   }`} />
// // // //                   <div className="flex-1">
// // // //                     <p className="text-sm font-medium text-gray-800 capitalize">{history.status}</p>
// // // //                     <p className="text-xs text-gray-400">{formatDateTime(history.updatedAt)}</p>
// // // //                   </div>
// // // //                 </div>
// // // //               ))}
// // // //             </div>
// // // //           </div>
// // // //         )}
// // // //       </main>

// // // //       <CustomerFooter />
// // // //     </div>
// // // //   );
// // // // }


// // // import { useEffect, useState } from 'react';
// // // import { Link, useParams } from 'react-router-dom';
// // // import { useQuery } from '@tanstack/react-query';
// // // import { 
// // //   ArrowLeft, Bike, MapPin, Phone, RefreshCw, Navigation, CheckCircle2
// // // } from 'lucide-react';
// // // import api from '../../services/api';
// // // import CustomerFooter from '../../components/customer/CustomerFooter';
// // // import toast from 'react-hot-toast';

// // // const formatTimeAgo = (value) => {
// // //   if (!value) return 'Not yet';
// // //   const now = new Date();
// // //   const past = new Date(value);
// // //   const diffMins = Math.floor((now - past) / 60000);
// // //   if (diffMins < 1) return 'Just now';
// // //   if (diffMins < 60) return `${diffMins} min ago`;
// // //   return `${Math.floor(diffMins / 60)} hour${Math.floor(diffMins / 60) > 1 ? 's' : ''} ago`;
// // // };

// // // const formatDateTime = (value) => {
// // //   if (!value) return '-';
// // //   return new Date(value).toLocaleString('en-IN', {
// // //     day: 'numeric',
// // //     month: 'short',
// // //     hour: 'numeric',
// // //     minute: '2-digit',
// // //   });
// // // };

// // // const formatCurrency = (value) => `₹${Number(value || 0).toLocaleString('en-IN')}`;

// // // export default function DeliveryTrackingPage() {
// // //   const { orderId } = useParams();
// // //   const [liveOrder, setLiveOrder] = useState(null);
// // //   const [authError, setAuthError] = useState(false);

// // //   console.log('DeliveryTrackingPage - orderId:', orderId);

// // //   const { data, isLoading, error, refetch } = useQuery({
// // //     queryKey: ['delivery-track', orderId],
// // //     queryFn: async () => {
// // //       if (!orderId) {
// // //         throw new Error('Order ID is required');
// // //       }
// // //       console.log('Fetching order:', orderId);
      
// // //       try {
// // //         const response = await api.get(`/orders/${orderId}`);
// // //         console.log('Order data received:', response.data);
// // //         return response.data;
// // //       } catch (err) {
// // //         console.error('API Error:', err.response?.status, err.response?.data);
// // //         if (err.response?.status === 401) {
// // //           setAuthError(true);
// // //           toast.error('Please login again to continue');
// // //           // Redirect to login after 2 seconds
// // //           setTimeout(() => {
// // //             window.location.href = '/login';
// // //           }, 2000);
// // //         }
// // //         throw err;
// // //       }
// // //     },
// // //     enabled: !!orderId,
// // //     retry: false,
// // //     refetchInterval: (data) => {
// // //       // Only auto-refresh if order is out for delivery and no auth error
// // //       const order = data?.order || data;
// // //       if (order?.status === 'out-for-delivery' && !authError) {
// // //         return 10000;
// // //       }
// // //       return false;
// // //     },
// // //   });

// // //   useEffect(() => {
// // //     if (error) {
// // //       console.error('Error fetching order:', error);
// // //       if (error.response?.status !== 401) {
// // //         toast.error(error.response?.data?.message || 'Could not load order details');
// // //       }
// // //     }
// // //   }, [error]);

// // //   useEffect(() => {
// // //     if (data?.order || data) {
// // //       setLiveOrder((prev) => ({ ...(prev || {}), ...(data?.order || data) }));
// // //     }
// // //   }, [data]);

// // //   const order = liveOrder || data?.order || data;
// // //   const currentStatus = order?.status || 'placed';
// // //   const isPreOrderDelivery = Boolean(order?.isPreOrder) || order?.preOrderMethod === 'delivery';
// // //   const riderLat = Number(order?.liveLocation?.lat || order?.deliveryLocation?.lat || 0);
// // //   const riderLng = Number(order?.liveLocation?.lng || order?.deliveryLocation?.lng || 0);
// // //   const hasLiveRiderLocation = riderLat !== 0 && riderLng !== 0;

// // //   // Show auth error state
// // //   if (authError) {
// // //     return (
// // //       <div className="min-h-screen bg-white">
// // //         <header className="border-b border-gray-100 bg-white sticky top-0 z-50">
// // //           <div className="max-w-4xl mx-auto px-4 py-3">
// // //             <div className="flex items-center justify-between">
// // //               <Link to="/" className="flex items-center gap-2">
// // //                 <img 
// // //                   src="https://rollercoastercafe.com/assets/images/roller_logo.png" 
// // //                   alt="Logo"
// // //                   className="h-8 w-8 rounded-full object-cover"
// // //                 />
// // //                 <span className="font-semibold text-lg text-gray-800">Roller Coaster Cafe</span>
// // //               </Link>
// // //             </div>
// // //           </div>
// // //         </header>
// // //         <main className="max-w-4xl mx-auto px-4 py-20 text-center">
// // //           <div className="bg-red-50 rounded-xl p-8">
// // //             <h2 className="text-xl font-bold text-red-600 mb-2">Session Expired</h2>
// // //             <p className="text-gray-600">Please login again to view your order tracking.</p>
// // //             <Link to="/login" className="inline-flex items-center gap-2 mt-4 bg-amber-600 text-white px-6 py-2 rounded-lg hover:bg-amber-700 transition-all">
// // //               Go to Login
// // //             </Link>
// // //           </div>
// // //         </main>
// // //       </div>
// // //     );
// // //   }

// // //   // Show error if no orderId
// // //   if (!orderId) {
// // //     return (
// // //       <div className="min-h-screen bg-white">
// // //         <header className="border-b border-gray-100 bg-white sticky top-0 z-50">
// // //           <div className="max-w-4xl mx-auto px-4 py-3">
// // //             <div className="flex items-center justify-between">
// // //               <Link to="/" className="flex items-center gap-2">
// // //                 <img 
// // //                   src="https://rollercoastercafe.com/assets/images/roller_logo.png" 
// // //                   alt="Logo"
// // //                   className="h-8 w-8 rounded-full object-cover"
// // //                 />
// // //                 <span className="font-semibold text-lg text-gray-800">Roller Coaster Cafe</span>
// // //               </Link>
// // //               <Link to="/orders" className="text-sm text-gray-500 hover:text-amber-600 flex items-center gap-1">
// // //                 <ArrowLeft size={14} /> Back to Orders
// // //               </Link>
// // //             </div>
// // //           </div>
// // //         </header>
// // //         <main className="max-w-4xl mx-auto px-4 py-20 text-center">
// // //           <div className="bg-red-50 rounded-xl p-8">
// // //             <h2 className="text-xl font-bold text-red-600 mb-2">Invalid Order</h2>
// // //             <p className="text-gray-600">Order ID is missing. Please go back to your orders.</p>
// // //             <Link to="/orders" className="inline-flex items-center gap-2 mt-4 text-amber-600 hover:underline">
// // //               <ArrowLeft size={14} /> View My Orders
// // //             </Link>
// // //           </div>
// // //         </main>
// // //       </div>
// // //     );
// // //   }

// // //   if (isLoading || !order) {
// // //     return (
// // //       <div className="min-h-screen bg-white">
// // //         <header className="border-b border-gray-100 bg-white sticky top-0 z-50">
// // //           <div className="max-w-4xl mx-auto px-4 py-3">
// // //             <div className="flex items-center justify-between">
// // //               <Link to="/" className="flex items-center gap-2">
// // //                 <img 
// // //                   src="https://rollercoastercafe.com/assets/images/roller_logo.png" 
// // //                   alt="Logo"
// // //                   className="h-8 w-8 rounded-full object-cover"
// // //                 />
// // //                 <span className="font-semibold text-lg text-gray-800">Roller Coaster Cafe</span>
// // //               </Link>
// // //             </div>
// // //           </div>
// // //         </header>
// // //         <main className="max-w-4xl mx-auto px-4 py-8">
// // //           <div className="animate-pulse space-y-4">
// // //             <div className="h-32 bg-gray-100 rounded-xl" />
// // //             <div className="h-64 bg-gray-100 rounded-xl" />
// // //           </div>
// // //         </main>
// // //       </div>
// // //     );
// // //   }

// // //   return (
// // //     <div className="min-h-screen bg-white">
// // //       {/* Header */}
// // //       <header className="border-b border-gray-100 bg-white sticky top-0 z-50">
// // //         <div className="max-w-4xl mx-auto px-4 py-3">
// // //           <div className="flex items-center justify-between">
// // //             <Link to="/" className="flex items-center gap-2">
// // //               <img 
// // //                 src="https://rollercoastercafe.com/assets/images/roller_logo.png" 
// // //                 alt="Logo"
// // //                 className="h-8 w-8 rounded-full object-cover"
// // //               />
// // //               <span className="font-semibold text-lg text-gray-800">Roller Coaster Cafe</span>
// // //             </Link>
// // //             <Link to="/orders" className="text-sm text-gray-500 hover:text-amber-600 flex items-center gap-1">
// // //               <ArrowLeft size={14} /> Back to Orders
// // //             </Link>
// // //           </div>
// // //         </div>
// // //       </header>

// // //       <main className="max-w-4xl mx-auto px-4 py-6">
// // //         {/* Order Header */}
// // //         <div className="bg-white border border-gray-100 rounded-xl p-5 mb-6 shadow-sm">
// // //           <div className="flex justify-between items-start mb-4">
// // //             <div>
// // //               <div className="flex items-center gap-2 mb-2">
// // //                 <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium ${isPreOrderDelivery ? 'bg-orange-50 text-orange-600' : 'bg-sky-50 text-sky-600'}`}>
// // //                   {isPreOrderDelivery ? 'Pre-Order Delivery' : 'Delivery'}
// // //                 </span>
// // //               </div>
// // //               <h1 className="font-bold text-xl text-gray-800">Order #{order.orderId || order._id?.slice(-8).toUpperCase()}</h1>
// // //               <p className="text-sm text-gray-400 mt-1">Placed on {formatDateTime(order.createdAt)}</p>
// // //               {isPreOrderDelivery && order.scheduledTime && (
// // //                 <p className="text-sm text-orange-600 mt-1">Scheduled for {formatDateTime(order.scheduledTime)}</p>
// // //               )}
// // //             </div>
// // //             <div className="text-right">
// // //               <div className="text-2xl font-bold text-gray-800">{formatCurrency(order.totalAmount)}</div>
// // //               <div className="text-xs text-gray-400 capitalize mt-1">{order.paymentMethod}</div>
// // //             </div>
// // //           </div>
          
// // //           {currentStatus === 'out-for-delivery' && (
// // //             <div className="mt-4 p-4 bg-green-50 rounded-lg">
// // //               <div className="flex items-center gap-2 text-green-700">
// // //                 <span className="w-2 h-2 rounded-full bg-green-600 animate-pulse"></span>
// // //                 <span className="font-medium">{isPreOrderDelivery ? 'Your pre-order is out for delivery!' : 'Your order is out for delivery!'}</span>
// // //               </div>
// // //               <p className="text-sm text-green-600 mt-1">{isPreOrderDelivery ? 'Your scheduled delivery is on the way to your location' : 'Rider is on the way to your location'}</p>
// // //             </div>
// // //           )}
          
// // //           {currentStatus === 'delivered' && (
// // //             <div className="mt-4 p-4 bg-green-100 rounded-lg">
// // //               <div className="flex items-center gap-2 text-green-700">
// // //                 <CheckCircle2 size={18} />
// // //                 <span className="font-medium">Order Delivered!</span>
// // //               </div>
// // //               <p className="text-sm text-green-600 mt-1">Thank you for ordering with us!</p>
// // //             </div>
// // //           )}
// // //         </div>

// // //         {/* Rider Info */}
// // //         <div className="bg-white border border-gray-100 rounded-xl p-5 mb-6 shadow-sm">
// // //           <h2 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
// // //             <Bike size={18} className="text-amber-600" />
// // //             Delivery Partner
// // //           </h2>
// // //           {order.deliveryAgent ? (
// // //             <div className="flex items-center justify-between">
// // //               <div>
// // //                 <p className="font-medium text-gray-800">{order.deliveryAgent.name || 'Delivery Partner'}</p>
// // //                 <p className="text-sm text-gray-500">{order.deliveryAgent.vehicleType || 'Bike'}</p>
// // //                 {order.deliveryAgent.phone && (
// // //                   <p className="text-xs text-gray-400 mt-1">{order.deliveryAgent.phone}</p>
// // //                 )}
// // //               </div>
// // //               {order.deliveryAgent.phone && (
// // //                 <a href={`tel:${order.deliveryAgent.phone}`} className="p-2.5 rounded-full bg-amber-100 text-amber-600 hover:bg-amber-200 transition-all">
// // //                   <Phone size={18} />
// // //                 </a>
// // //               )}
// // //             </div>
// // //           ) : (
// // //             <p className="text-sm text-gray-500">Rider will be assigned soon.</p>
// // //           )}
// // //         </div>

// // //         {/* Live Location */}
// // //         {hasLiveRiderLocation && currentStatus === 'out-for-delivery' && (
// // //           <div className="bg-white border border-gray-100 rounded-xl p-5 mb-6 shadow-sm">
// // //             <div className="flex justify-between items-center mb-4">
// // //               <h2 className="font-semibold text-gray-800 flex items-center gap-2">
// // //                 <MapPin size={18} className="text-amber-600" />
// // //                 Current Rider Location
// // //               </h2>
// // //               <button onClick={() => refetch()} className="text-sm text-amber-600 hover:underline flex items-center gap-1">
// // //                 <RefreshCw size={14} /> Refresh
// // //               </button>
// // //             </div>
// // //             <div className="bg-gray-50 rounded-lg p-4">
// // //               <p className="text-sm font-mono text-gray-700 break-all">
// // //                 {riderLat.toFixed(6)}, {riderLng.toFixed(6)}
// // //               </p>
// // //               <p className="text-xs text-gray-400 mt-2">
// // //                 Last updated: {formatTimeAgo(order.liveLocation?.updatedAt)}
// // //               </p>
// // //               <a 
// // //                 href={`https://maps.google.com/?q=${riderLat},${riderLng}`}
// // //                 target="_blank"
// // //                 rel="noopener noreferrer"
// // //                 className="inline-flex items-center gap-2 mt-3 text-sm text-amber-600 hover:underline"
// // //               >
// // //                 <Navigation size={14} /> Open in Google Maps
// // //               </a>
// // //             </div>
// // //           </div>
// // //         )}

// // //         {/* Delivery Address */}
// // //         {order.deliveryAddress && (
// // //           <div className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm">
// // //             <h2 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
// // //               <MapPin size={18} className="text-amber-600" />
// // //               Delivery Address
// // //             </h2>
// // //             <p className="text-gray-600">{order.deliveryAddress.text || 'Address not available'}</p>
// // //           </div>
// // //         )}

// // //         {/* Status Timeline */}
// // //         {order.statusHistory && order.statusHistory.length > 0 && (
// // //           <div className="bg-white border border-gray-100 rounded-xl p-5 mt-5 shadow-sm">
// // //             <h2 className="font-semibold text-gray-800 mb-4">Status Timeline</h2>
// // //             <div className="space-y-3">
// // //               {order.statusHistory.map((history, index) => (
// // //                 <div key={index} className="flex items-center gap-3">
// // //                   <div className={`w-2 h-2 rounded-full ${
// // //                     index === order.statusHistory.length - 1 ? 'bg-amber-500' : 'bg-gray-300'
// // //                   }`} />
// // //                   <div className="flex-1">
// // //                     <p className="text-sm font-medium text-gray-800 capitalize">{history.status}</p>
// // //                     <p className="text-xs text-gray-400">{formatDateTime(history.updatedAt)}</p>
// // //                   </div>
// // //                 </div>
// // //               ))}
// // //             </div>
// // //           </div>
// // //         )}
// // //       </main>

// // //       <CustomerFooter />
// // //     </div>
// // //   );
// // // }
// // import { useEffect, useState, useMemo } from 'react';
// // import { Link, useParams } from 'react-router-dom';
// // import { useQuery } from '@tanstack/react-query';
// // import { 
// //   ArrowLeft, Bike, MapPin, Phone, RefreshCw, Navigation, CheckCircle2, CalendarDays, Truck
// // } from 'lucide-react';
// // import api from '../../services/api';
// // import CustomerFooter from '../../components/customer/CustomerFooter';
// // import toast from 'react-hot-toast';

// // const formatTimeAgo = (value) => {
// //   if (!value) return 'Not yet';
// //   const now = new Date();
// //   const past = new Date(value);
// //   const diffMins = Math.floor((now - past) / 60000);
// //   if (diffMins < 1) return 'Just now';
// //   if (diffMins < 60) return `${diffMins} min ago`;
// //   return `${Math.floor(diffMins / 60)} hour${Math.floor(diffMins / 60) > 1 ? 's' : ''} ago`;
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

// // export default function DeliveryTrackingPage() {
// //   const { orderId } = useParams();
// //   const [liveOrder, setLiveOrder] = useState(null);
// //   const [authError, setAuthError] = useState(false);

// //   console.log('DeliveryTrackingPage - orderId:', orderId);

// //   const { data, isLoading, error, refetch } = useQuery({
// //     queryKey: ['delivery-track', orderId],
// //     queryFn: async () => {
// //       if (!orderId) {
// //         throw new Error('Order ID is required');
// //       }
// //       console.log('Fetching order:', orderId);
      
// //       try {
// //         const response = await api.get(`/orders/${orderId}`);
// //         console.log('Order data received:', response.data);
// //         return response.data;
// //       } catch (err) {
// //         console.error('API Error:', err.response?.status, err.response?.data);
// //         if (err.response?.status === 401) {
// //           setAuthError(true);
// //           toast.error('Please login again to continue');
// //           setTimeout(() => {
// //             window.location.href = '/login';
// //           }, 2000);
// //         }
// //         throw err;
// //       }
// //     },
// //     enabled: !!orderId,
// //     retry: false,
// //     refetchInterval: (data) => {
// //       const order = data?.order || data;
// //       if (order?.status === 'out-for-delivery' && !authError) {
// //         return 10000;
// //       }
// //       return false;
// //     },
// //   });

// //   useEffect(() => {
// //     if (error) {
// //       console.error('Error fetching order:', error);
// //       if (error.response?.status !== 401) {
// //         toast.error(error.response?.data?.message || 'Could not load order details');
// //       }
// //     }
// //   }, [error]);

// //   useEffect(() => {
// //     if (data?.order || data) {
// //       setLiveOrder((prev) => ({ ...(prev || {}), ...(data?.order || data) }));
// //     }
// //   }, [data]);

// //   const order = liveOrder || data?.order || data;
// //   const currentStatus = order?.status || 'placed';
  
// //   const isPreOrderDelivery = useMemo(() => {
// //     const notes = String(order?.specialNotes || '').toLowerCase();
// //     return notes.includes('pre-order type: delivery') || 
// //            notes.includes('pre-order delivery') ||
// //            order?.isPreOrder === true;
// //   }, [order]);
  
// //   const riderLat = Number(order?.liveLocation?.lat || order?.deliveryLocation?.lat || 0);
// //   const riderLng = Number(order?.liveLocation?.lng || order?.deliveryLocation?.lng || 0);
// //   const hasLiveRiderLocation = riderLat !== 0 && riderLng !== 0;

// //   // Show auth error state
// //   if (authError) {
// //     return (
// //       <div className="min-h-screen bg-white">
// //         <header className="border-b border-gray-100 bg-white sticky top-0 z-50">
// //           <div className="max-w-4xl mx-auto px-4 py-3">
// //             <div className="flex items-center justify-between">
// //               <Link to="/" className="flex items-center gap-2">
// //                 <img 
// //                   src="https://rollercoastercafe.com/assets/images/roller_logo.png" 
// //                   alt="Logo"
// //                   className="h-8 w-8 rounded-full object-cover"
// //                 />
// //                 <span className="font-semibold text-lg text-gray-800">Roller Coaster Cafe</span>
// //               </Link>
// //             </div>
// //           </div>
// //         </header>
// //         <main className="max-w-4xl mx-auto px-4 py-20 text-center">
// //           <div className="bg-red-50 rounded-xl p-8">
// //             <h2 className="text-xl font-bold text-red-600 mb-2">Session Expired</h2>
// //             <p className="text-gray-600">Please login again to view your order tracking.</p>
// //             <Link to="/login" className="inline-flex items-center gap-2 mt-4 bg-amber-600 text-white px-6 py-2 rounded-lg hover:bg-amber-700 transition-all">
// //               Go to Login
// //             </Link>
// //           </div>
// //         </main>
// //       </div>
// //     );
// //   }

// //   // Show error if no orderId
// //   if (!orderId) {
// //     return (
// //       <div className="min-h-screen bg-white">
// //         <header className="border-b border-gray-100 bg-white sticky top-0 z-50">
// //           <div className="max-w-4xl mx-auto px-4 py-3">
// //             <div className="flex items-center justify-between">
// //               <Link to="/" className="flex items-center gap-2">
// //                 <img 
// //                   src="https://rollercoastercafe.com/assets/images/roller_logo.png" 
// //                   alt="Logo"
// //                   className="h-8 w-8 rounded-full object-cover"
// //                 />
// //                 <span className="font-semibold text-lg text-gray-800">Roller Coaster Cafe</span>
// //               </Link>
// //               <Link to="/orders" className="text-sm text-gray-500 hover:text-amber-600 flex items-center gap-1">
// //                 <ArrowLeft size={14} /> Back to Orders
// //               </Link>
// //             </div>
// //           </div>
// //         </header>
// //         <main className="max-w-4xl mx-auto px-4 py-20 text-center">
// //           <div className="bg-red-50 rounded-xl p-8">
// //             <h2 className="text-xl font-bold text-red-600 mb-2">Invalid Order</h2>
// //             <p className="text-gray-600">Order ID is missing. Please go back to your orders.</p>
// //             <Link to="/orders" className="inline-flex items-center gap-2 mt-4 text-amber-600 hover:underline">
// //               <ArrowLeft size={14} /> View My Orders
// //             </Link>
// //           </div>
// //         </main>
// //       </div>
// //     );
// //   }

// //   if (isLoading || !order) {
// //     return (
// //       <div className="min-h-screen bg-white">
// //         <header className="border-b border-gray-100 bg-white sticky top-0 z-50">
// //           <div className="max-w-4xl mx-auto px-4 py-3">
// //             <div className="flex items-center justify-between">
// //               <Link to="/" className="flex items-center gap-2">
// //                 <img 
// //                   src="https://rollercoastercafe.com/assets/images/roller_logo.png" 
// //                   alt="Logo"
// //                   className="h-8 w-8 rounded-full object-cover"
// //                 />
// //                 <span className="font-semibold text-lg text-gray-800">Roller Coaster Cafe</span>
// //               </Link>
// //             </div>
// //           </div>
// //         </header>
// //         <main className="max-w-4xl mx-auto px-4 py-8">
// //           <div className="animate-pulse space-y-4">
// //             <div className="h-32 bg-gray-100 rounded-xl" />
// //             <div className="h-64 bg-gray-100 rounded-xl" />
// //           </div>
// //         </main>
// //       </div>
// //     );
// //   }

// //   return (
// //     <div className="min-h-screen bg-white">
// //       {/* Header */}
// //       <header className="border-b border-gray-100 bg-white sticky top-0 z-50">
// //         <div className="max-w-4xl mx-auto px-4 py-3">
// //           <div className="flex items-center justify-between">
// //             <Link to="/" className="flex items-center gap-2">
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
// //         {/* Order Header */}
// //         <div className="bg-white border border-gray-100 rounded-xl p-5 mb-6 shadow-sm">
// //           <div className="flex justify-between items-start mb-4">
// //             <div>
// //               <div className="flex items-center gap-2 mb-2 flex-wrap">
// //                 <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium ${isPreOrderDelivery ? 'bg-orange-50 text-orange-600' : 'bg-sky-50 text-sky-600'}`}>
// //                   {isPreOrderDelivery ? <CalendarDays size={12} /> : <Truck size={12} />}
// //                   {isPreOrderDelivery ? 'Pre-Order Delivery' : 'Delivery'}
// //                 </span>
// //                 {isPreOrderDelivery && order.preOrderFee > 0 && (
// //                   <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-600">
// //                     +₹{order.preOrderFee} fee
// //                   </span>
// //                 )}
// //               </div>
// //               <h1 className="font-bold text-xl text-gray-800">Order #{order.orderId || order._id?.slice(-8).toUpperCase()}</h1>
// //               <p className="text-sm text-gray-400 mt-1">Placed on {formatDateTime(order.createdAt)}</p>
// //               {isPreOrderDelivery && order.scheduledTime && (
// //                 <p className="text-sm text-orange-600 mt-1">Scheduled for {formatDateTime(order.scheduledTime)}</p>
// //               )}
// //             </div>
// //             <div className="text-right">
// //               <div className="text-2xl font-bold text-gray-800">{formatCurrency(order.totalAmount)}</div>
// //               <div className="text-xs text-gray-400 capitalize mt-1">{order.paymentMethod}</div>
// //             </div>
// //           </div>
          
// //           {currentStatus === 'out-for-delivery' && (
// //             <div className="mt-4 p-4 bg-green-50 rounded-lg">
// //               <div className="flex items-center gap-2 text-green-700">
// //                 <span className="w-2 h-2 rounded-full bg-green-600 animate-pulse"></span>
// //                 <span className="font-medium">{isPreOrderDelivery ? 'Your pre-order is out for delivery!' : 'Your order is out for delivery!'}</span>
// //               </div>
// //               <p className="text-sm text-green-600 mt-1">{isPreOrderDelivery ? 'Your scheduled delivery is on the way to your location' : 'Rider is on the way to your location'}</p>
// //             </div>
// //           )}
          
// //           {currentStatus === 'delivered' && (
// //             <div className="mt-4 p-4 bg-green-100 rounded-lg">
// //               <div className="flex items-center gap-2 text-green-700">
// //                 <CheckCircle2 size={18} />
// //                 <span className="font-medium">Order Delivered!</span>
// //               </div>
// //               <p className="text-sm text-green-600 mt-1">Thank you for ordering with us!</p>
// //             </div>
// //           )}
// //         </div>

// //         {/* Rider Info */}
// //         <div className="bg-white border border-gray-100 rounded-xl p-5 mb-6 shadow-sm">
// //           <h2 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
// //             <Bike size={18} className="text-amber-600" />
// //             Delivery Partner
// //           </h2>
// //           {order.deliveryAgent ? (
// //             <div className="flex items-center justify-between">
// //               <div>
// //                 <p className="font-medium text-gray-800">{order.deliveryAgent.name || 'Delivery Partner'}</p>
// //                 <p className="text-sm text-gray-500">{order.deliveryAgent.vehicleType || 'Bike'}</p>
// //                 {order.deliveryAgent.phone && (
// //                   <p className="text-xs text-gray-400 mt-1">{order.deliveryAgent.phone}</p>
// //                 )}
// //               </div>
// //               {order.deliveryAgent.phone && (
// //                 <a href={`tel:${order.deliveryAgent.phone}`} className="p-2.5 rounded-full bg-amber-100 text-amber-600 hover:bg-amber-200 transition-all">
// //                   <Phone size={18} />
// //                 </a>
// //               )}
// //             </div>
// //           ) : (
// //             <p className="text-sm text-gray-500">Rider will be assigned soon.</p>
// //           )}
// //         </div>

// //         {/* Live Location */}
// //         {hasLiveRiderLocation && currentStatus === 'out-for-delivery' && (
// //           <div className="bg-white border border-gray-100 rounded-xl p-5 mb-6 shadow-sm">
// //             <div className="flex justify-between items-center mb-4">
// //               <h2 className="font-semibold text-gray-800 flex items-center gap-2">
// //                 <MapPin size={18} className="text-amber-600" />
// //                 Current Rider Location
// //               </h2>
// //               <button onClick={() => refetch()} className="text-sm text-amber-600 hover:underline flex items-center gap-1">
// //                 <RefreshCw size={14} /> Refresh
// //               </button>
// //             </div>
// //             <div className="bg-gray-50 rounded-lg p-4">
// //               <p className="text-sm font-mono text-gray-700 break-all">
// //                 {riderLat.toFixed(6)}, {riderLng.toFixed(6)}
// //               </p>
// //               <p className="text-xs text-gray-400 mt-2">
// //                 Last updated: {formatTimeAgo(order.liveLocation?.updatedAt)}
// //               </p>
// //               <a 
// //                 href={`https://maps.google.com/?q=${riderLat},${riderLng}`}
// //                 target="_blank"
// //                 rel="noopener noreferrer"
// //                 className="inline-flex items-center gap-2 mt-3 text-sm text-amber-600 hover:underline"
// //               >
// //                 <Navigation size={14} /> Open in Google Maps
// //               </a>
// //             </div>
// //           </div>
// //         )}

// //         {/* Delivery Address */}
// //         {order.deliveryAddress && (
// //           <div className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm">
// //             <h2 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
// //               <MapPin size={18} className="text-amber-600" />
// //               Delivery Address
// //             </h2>
// //             <p className="text-gray-600">{order.deliveryAddress.text || 'Address not available'}</p>
// //           </div>
// //         )}

// //         {/* Status Timeline */}
// //         {order.statusHistory && order.statusHistory.length > 0 && (
// //           <div className="bg-white border border-gray-100 rounded-xl p-5 mt-5 shadow-sm">
// //             <h2 className="font-semibold text-gray-800 mb-4">Status Timeline</h2>
// //             <div className="space-y-3">
// //               {order.statusHistory.map((history, index) => (
// //                 <div key={index} className="flex items-center gap-3">
// //                   <div className={`w-2 h-2 rounded-full ${
// //                     index === order.statusHistory.length - 1 ? 'bg-amber-500' : 'bg-gray-300'
// //                   }`} />
// //                   <div className="flex-1">
// //                     <p className="text-sm font-medium text-gray-800 capitalize">{history.status}</p>
// //                     <p className="text-xs text-gray-400">{formatDateTime(history.updatedAt)}</p>
// //                   </div>
// //                 </div>
// //               ))}
// //             </div>
// //           </div>
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
//   ArrowLeft, Bike, MapPin, Phone, RefreshCw, Navigation, CheckCircle2, 
//   CalendarDays, Truck, Clock, Package, User, FileText, Eye, Copy, ShieldCheck
// } from 'lucide-react';
// import api from '../../services/api';
// import CustomerFooter from '../../components/customer/CustomerFooter';
// import toast from 'react-hot-toast';

// const formatTimeAgo = (value) => {
//   if (!value) return 'Not yet';
//   const now = new Date();
//   const past = new Date(value);
//   const diffMins = Math.floor((now - past) / 60000);
//   if (diffMins < 1) return 'Just now';
//   if (diffMins < 60) return `${diffMins} min ago`;
//   return `${Math.floor(diffMins / 60)} hour${Math.floor(diffMins / 60) > 1 ? 's' : ''} ago`;
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

// const getSocketBaseUrl = () => (
//   import.meta.env.VITE_SOCKET_URL ||
//   import.meta.env.VITE_API_URL?.replace('/api', '') ||
//   'http://localhost:5000'
// );

// const STATUS_FLOW = ['placed', 'confirmed', 'preparing', 'ready', 'out-for-delivery', 'delivered'];

// const STATUS_META = {
//   placed: { title: 'Order Placed', desc: 'Your order has been received', icon: Clock, color: 'bg-amber-50 text-amber-600' },
//   confirmed: { title: 'Order Confirmed', desc: 'Restaurant accepted your order', icon: CheckCircle2, color: 'bg-blue-50 text-blue-600' },
//   preparing: { title: 'Preparing', desc: 'Kitchen is preparing your food', icon: Package, color: 'bg-orange-50 text-orange-600' },
//   ready: { title: 'Ready', desc: 'Your order is ready for pickup', icon: CheckCircle2, color: 'bg-emerald-50 text-emerald-600' },
//   'out-for-delivery': { title: 'Out for Delivery', desc: 'Rider is on the way!', icon: Bike, color: 'bg-indigo-50 text-indigo-600' },
//   delivered: { title: 'Delivered', desc: 'Order delivered successfully', icon: CheckCircle2, color: 'bg-green-50 text-green-600' },
//   cancelled: { title: 'Cancelled', desc: 'Order was cancelled', icon: Clock, color: 'bg-red-50 text-red-600' },
// };

// export default function DeliveryTrackingPage() {
//   const { orderId } = useParams();
//   const [liveOrder, setLiveOrder] = useState(null);
//   const [copied, setCopied] = useState(false);
//   const [isConnected, setIsConnected] = useState(true);

//   const { data, isLoading, refetch } = useQuery({
//     queryKey: ['delivery-track', orderId],
//     queryFn: () => api.get(`/orders/${orderId}`).then((res) => res.data),
//     retry: false,
//     refetchInterval: 10000,
//   });

//   useEffect(() => {
//     if (data?.order || data) {
//       setLiveOrder((prev) => ({ ...(prev || {}), ...(data?.order || data) }));
//     }
//   }, [data]);

//   // WebSocket for real-time updates
//   useEffect(() => {
//     if (!orderId) return;

//     const socket = io(getSocketBaseUrl(), { withCredentials: true });

//     socket.on('connect', () => {
//       setIsConnected(true);
//       socket.emit('join-room', { room: `order:${orderId}` });
//     });

//     socket.on('disconnect', () => setIsConnected(false));
//     socket.on('connect_error', () => setIsConnected(false));

//     socket.on('order-updated', (payload) => {
//       if (String(payload.orderId) === String(orderId)) {
//         setLiveOrder((prev) => ({ ...(prev || {}), ...payload }));
//         if (payload.status === 'out-for-delivery') {
//           toast.success('Your order is out for delivery! 🚚');
//         } else if (payload.status === 'delivered') {
//           toast.success('Order Delivered! Thank you! 🎉');
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
//   }, [orderId, refetch]);

//   const order = liveOrder || data?.order || data;
//   const currentStatus = order?.status || 'placed';
//   const statusMeta = STATUS_META[currentStatus] || STATUS_META.placed;
//   const StatusIcon = statusMeta.icon;
//   const statusIndex = STATUS_FLOW.indexOf(currentStatus);
  
//   // Check if this is a pre-order delivery
//   const isPreOrder = order?.isPreOrder === true || 
//     String(order?.specialNotes || '').toLowerCase().includes('pre-order type: delivery');

//   const riderLat = Number(order?.liveLocation?.lat || 0);
//   const riderLng = Number(order?.liveLocation?.lng || 0);
//   const hasLiveRiderLocation = riderLat !== 0 && riderLng !== 0;

//   const copyOTP = async () => {
//     if (order?.deliveryOTP) {
//       await navigator.clipboard.writeText(order.deliveryOTP);
//       setCopied(true);
//       toast.success('OTP copied!');
//       setTimeout(() => setCopied(false), 2000);
//     }
//   };

//   const getStatusTime = (status) => {
//     if (!order?.statusHistory) return null;
//     const entry = order.statusHistory.find(e => e.status === status);
//     return entry?.updatedAt || null;
//   };

//   if (isLoading || !order) {
//     return (
//       <div className="min-h-screen bg-white">
//         <div className="max-w-4xl mx-auto px-4 py-8 animate-pulse">
//           <div className="h-32 bg-gray-100 rounded-xl mb-4" />
//           <div className="h-64 bg-gray-100 rounded-xl" />
//         </div>
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
//         {/* Pre-order Banner */}
//         {isPreOrder && order.scheduledTime && (
//           <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 mb-6">
//             <div className="flex items-center gap-3">
//               <CalendarDays size={24} className="text-orange-600" />
//               <div>
//                 <h3 className="font-semibold text-orange-800">Pre-order Delivery</h3>
//                 <p className="text-sm text-orange-700">
//                   Scheduled for {formatDateTime(order.scheduledTime)}
//                 </p>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Order Header */}
//         <div className="bg-white border border-gray-100 rounded-xl p-5 mb-6 shadow-sm">
//           <div className="flex flex-wrap justify-between items-start gap-4">
//             <div>
//               <div className="flex items-center gap-2 mb-2 flex-wrap">
//                 <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium ${isPreOrder ? 'bg-orange-50 text-orange-600' : 'bg-sky-50 text-sky-600'}`}>
//                   {isPreOrder ? <CalendarDays size={12} /> : <Truck size={12} />}
//                   {isPreOrder ? 'Pre-order Delivery' : 'Delivery'}
//                 </span>
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
//           <p className="text-sm text-gray-500 mt-3">{statusMeta.desc}</p>
//         </div>

//         {/* OTP Section - Show when out for delivery */}
//         {currentStatus === 'out-for-delivery' && order.deliveryOTP && (
//           <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl p-5 mb-6">
//             <div className="flex items-center gap-3 mb-3">
//               <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center">
//                 <ShieldCheck size={18} className="text-amber-600" />
//               </div>
//               <div>
//                 <h3 className="font-semibold text-gray-800">Delivery OTP Required</h3>
//                 <p className="text-sm text-gray-500">Share this OTP with the delivery partner</p>
//               </div>
//             </div>
//             <div className="flex items-center justify-between bg-white rounded-xl p-4 border border-amber-200">
//               <div>
//                 <p className="text-xs text-gray-500 uppercase">One-Time Password</p>
//                 <p className="text-3xl font-bold tracking-widest text-gray-800">{order.deliveryOTP}</p>
//               </div>
//               <button onClick={copyOTP} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-amber-600 text-white">
//                 {copied ? <CheckCircle2 size={16} /> : <Copy size={16} />}
//                 {copied ? 'Copied!' : 'Copy OTP'}
//               </button>
//             </div>
//           </div>
//         )}

//         {/* Rider Info & Live Tracking - Only show when out for delivery */}
//         {currentStatus === 'out-for-delivery' && (
//           <div className="bg-white border border-gray-100 rounded-xl overflow-hidden mb-6 shadow-sm">
//             <div className="p-4 bg-gradient-to-r from-amber-50 to-orange-50 border-b border-amber-100">
//               <h2 className="font-semibold text-gray-800 flex items-center gap-2">
//                 <MapPin size={18} className="text-amber-600" />
//                 Live Tracking
//               </h2>
//               <p className="text-sm text-gray-600 mt-1">Your rider is on the way!</p>
//             </div>

//             {/* Rider Details */}
//             <div className="p-4 border-b border-gray-100">
//               <div className="flex items-center gap-4">
//                 <div className="w-14 h-14 rounded-full bg-amber-100 flex items-center justify-center">
//                   <Bike size={24} className="text-amber-600" />
//                 </div>
//                 <div className="flex-1">
//                   <p className="font-semibold text-gray-800 text-lg">
//                     {order.deliveryAgent?.name || 'Delivery Partner'}
//                   </p>
//                   <p className="text-sm text-gray-500">
//                     {order.deliveryAgent?.vehicleType || 'Bike'}
//                   </p>
//                   {order.deliveryAgent?.phone && (
//                     <p className="text-sm text-gray-600 flex items-center gap-1 mt-1">
//                       <Phone size={14} /> {order.deliveryAgent.phone}
//                     </p>
//                   )}
//                 </div>
//                 {order.deliveryAgent?.phone && (
//                   <a 
//                     href={`tel:${order.deliveryAgent.phone}`}
//                     className="p-3 rounded-full bg-amber-100 text-amber-600 hover:bg-amber-200 transition-all"
//                   >
//                     <Phone size={20} />
//                   </a>
//                 )}
//               </div>
//             </div>

//             {/* Live Location */}
//             <div className="p-4">
//               <div className="bg-gray-50 rounded-lg p-4">
//                 <p className="text-xs text-gray-500 mb-2">Current Rider Location</p>
//                 {hasLiveRiderLocation ? (
//                   <>
//                     <p className="text-sm font-mono text-gray-700">
//                       {riderLat.toFixed(6)}, {riderLng.toFixed(6)}
//                     </p>
//                     <p className="text-xs text-gray-400 mt-1">
//                       Updated {formatTimeAgo(order.liveLocation?.updatedAt)}
//                     </p>
//                     <a 
//                       href={`https://www.google.com/maps?q=${riderLat},${riderLng}`}
//                       target="_blank"
//                       rel="noopener noreferrer"
//                       className="mt-3 inline-flex items-center gap-2 text-sm text-amber-600 hover:underline"
//                     >
//                       <Navigation size={14} /> Open in Google Maps
//                     </a>
//                   </>
//                 ) : (
//                   <p className="text-sm text-gray-500">Waiting for rider location...</p>
//                 )}
//               </div>

//               {/* Refresh Button */}
//               <button
//                 onClick={() => refetch()}
//                 className="mt-3 w-full flex items-center justify-center gap-2 py-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50"
//               >
//                 <RefreshCw size={14} /> Refresh Location
//               </button>
//             </div>
//           </div>
//         )}

//         {/* Status Timeline */}
//         <div className="bg-white border border-gray-100 rounded-xl p-5 mb-6 shadow-sm">
//           <h2 className="font-semibold text-gray-800 mb-5">Order Status</h2>
//           <div className="relative">
//             {STATUS_FLOW.map((status, index) => {
//               const meta = STATUS_META[status];
//               if (!meta) return null;
//               const Icon = meta.icon;
//               const isCompleted = statusIndex >= index;
//               const isCurrent = currentStatus === status;
//               const statusTime = getStatusTime(status);

//               return (
//                 <div key={status} className="flex gap-3 mb-4 last:mb-0">
//                   <div className="flex flex-col items-center">
//                     <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
//                       isCompleted ? meta.color : 'bg-gray-100 text-gray-400'
//                     }`}>
//                       <Icon size={14} />
//                     </div>
//                     {index < STATUS_FLOW.length - 1 && (
//                       <div className={`w-0.5 h-8 mt-1 ${isCompleted ? 'bg-amber-200' : 'bg-gray-200'}`} />
//                     )}
//                   </div>
//                   <div className="flex-1 pb-2">
//                     <div className="flex items-center gap-2 flex-wrap">
//                       <p className={`text-sm font-medium ${isCompleted ? 'text-gray-800' : 'text-gray-400'}`}>
//                         {meta.title}
//                       </p>
//                       {isCurrent && (
//                         <span className="inline-block w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
//                       )}
//                       {statusTime && (
//                         <span className="text-xs text-gray-400">{formatDateTime(statusTime)}</span>
//                       )}
//                     </div>
//                     <p className="text-xs text-gray-400 mt-0.5">{meta.desc}</p>
//                   </div>
//                 </div>
//               );
//             })}
//           </div>
//         </div>

//         {/* Order Items */}
//         <div className="bg-white border border-gray-100 rounded-xl p-5 mb-6 shadow-sm">
//           <h2 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
//             <Package size={16} className="text-amber-600" />
//             Order Items
//           </h2>
//           <div className="space-y-2">
//             {order.items?.map((item, idx) => (
//               <div key={idx} className="flex justify-between py-2 border-b border-gray-100 last:border-0">
//                 <div>
//                   <p className="font-medium text-gray-800">{item.name}</p>
//                   <p className="text-xs text-gray-500">Quantity: {item.quantity}</p>
//                 </div>
//                 <p className="font-semibold text-gray-800">₹{item.totalPrice || item.unitPrice * item.quantity}</p>
//               </div>
//             ))}
//             <div className="border-t border-gray-100 pt-3 mt-2">
//               <div className="flex justify-between text-sm">
//                 <span className="text-gray-500">Subtotal</span>
//                 <span>{formatCurrency(order.subtotal)}</span>
//               </div>
//               <div className="flex justify-between text-sm">
//                 <span className="text-gray-500">Delivery Fee</span>
//                 <span>{formatCurrency(order.deliveryFee || 0)}</span>
//               </div>
//               <div className="flex justify-between text-sm">
//                 <span className="text-gray-500">Tax</span>
//                 <span>{formatCurrency(order.taxAmount || 0)}</span>
//               </div>
//               {isPreOrder && order.preOrderFee > 0 && (
//                 <div className="flex justify-between text-sm">
//                   <span className="text-gray-500">Pre-order Fee</span>
//                   <span>{formatCurrency(order.preOrderFee)}</span>
//                 </div>
//               )}
//               <div className="flex justify-between font-bold text-base pt-2 mt-1 border-t border-gray-100">
//                 <span className="text-gray-800">Total</span>
//                 <span className="text-amber-600">{formatCurrency(order.totalAmount)}</span>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Delivery Address */}
//         {order.deliveryAddress && (
//           <div className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm">
//             <h2 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
//               <MapPin size={16} className="text-amber-600" />
//               Delivery Address
//             </h2>
//             <p className="text-gray-600">{order.deliveryAddress.text}</p>
//           </div>
//         )}

//         {/* Special Notes */}
//         {order.specialNotes && (
//           <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 mt-5">
//             <p className="text-sm text-amber-700">
//               <span className="font-medium">Note:</span> {order.specialNotes}
//             </p>
//           </div>
//         )}

//         {/* Invoice Button for Delivered Orders */}
//         {(currentStatus === 'delivered' || currentStatus === 'completed') && (
//           <div className="mt-6">
//             <Link 
//               to={`/invoice/${order._id}`}
//               target="_blank"
//               className="inline-flex items-center gap-2 px-5 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all"
//             >
//               <FileText size={16} /> Download Invoice
//             </Link>
//           </div>
//         )}

//         {/* Delivered Celebration */}
//         {currentStatus === 'delivered' && (
//           <motion.div
//             initial={{ scale: 0, opacity: 0 }}
//             animate={{ scale: 1, opacity: 1 }}
//             className="mt-6 p-6 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl text-center"
//           >
//             <motion.div
//               animate={{ rotate: 360 }}
//               transition={{ duration: 0.5 }}
//               className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-3"
//             >
//               <CheckCircle2 size={32} className="text-green-600" />
//             </motion.div>
//             <h3 className="text-xl font-bold text-gray-800">Order Delivered! 🎉</h3>
//             <p className="text-sm text-gray-600 mt-1">Thank you for ordering from Roller Coaster Cafe</p>
//           </motion.div>
//         )}
//       </main>

//       <CustomerFooter />
//     </div>
//   );
// }

import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { io } from 'socket.io-client';
import { 
  ArrowLeft, Bike, MapPin, Phone, RefreshCw, Navigation, CheckCircle2, 
  CalendarDays, Truck, Clock, Package, User, FileText, Eye, Copy, ShieldCheck
} from 'lucide-react';
import api from '../../services/api';
import CustomerFooter from '../../components/customer/CustomerFooter';
import toast from 'react-hot-toast';

const formatTimeAgo = (value) => {
  if (!value) return 'Not yet';
  const now = new Date();
  const past = new Date(value);
  const diffMins = Math.floor((now - past) / 60000);
  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins} min ago`;
  return `${Math.floor(diffMins / 60)} hour${Math.floor(diffMins / 60) > 1 ? 's' : ''} ago`;
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

const hasCoordinates = (location) => Number.isFinite(Number(location?.lat)) && Number.isFinite(Number(location?.lng));
const buildMapEmbedUrl = (location) => {
  if (!hasCoordinates(location)) return '';
  const freshnessToken = location?.updatedAt ? new Date(location.updatedAt).getTime() : Date.now();
  return `https://maps.google.com/maps?q=${location.lat},${location.lng}&z=15&output=embed&t=${freshnessToken}`;
};
const formatLocationLabel = (location) => {
  const label = String(location?.locationName || location?.address || '').trim();
  if (label && label.toLowerCase() !== 'null' && label.toLowerCase() !== 'undefined') return label;
  if (!hasCoordinates(location)) return 'Waiting for rider location...';
  return `${Number(location.lat).toFixed(6)}, ${Number(location.lng).toFixed(6)}`;
};

const getSocketBaseUrl = () => (
  import.meta.env.VITE_SOCKET_URL ||
  import.meta.env.VITE_API_URL?.replace('/api', '') ||
  'http://localhost:5000'
);

const STATUS_FLOW = ['placed', 'confirmed', 'preparing', 'ready', 'out-for-delivery', 'delivered'];

const STATUS_META = {
  placed: { title: 'Order Placed', desc: 'Your order has been received', icon: Clock, color: 'bg-amber-50 text-amber-600' },
  confirmed: { title: 'Order Confirmed', desc: 'Restaurant accepted your order', icon: CheckCircle2, color: 'bg-blue-50 text-blue-600' },
  preparing: { title: 'Preparing', desc: 'Kitchen is preparing your food', icon: Package, color: 'bg-orange-50 text-orange-600' },
  ready: { title: 'Ready', desc: 'Your order is ready for pickup', icon: CheckCircle2, color: 'bg-emerald-50 text-emerald-600' },
  'out-for-delivery': { title: 'Out for Delivery', desc: 'Rider is on the way!', icon: Bike, color: 'bg-indigo-50 text-indigo-600' },
  delivered: { title: 'Delivered', desc: 'Order delivered successfully', icon: CheckCircle2, color: 'bg-green-50 text-green-600' },
  cancelled: { title: 'Cancelled', desc: 'Order was cancelled', icon: Clock, color: 'bg-red-50 text-red-600' },
};

export default function DeliveryTrackingPage() {
  const { orderId } = useParams();
  const [liveOrder, setLiveOrder] = useState(null);
  const [copied, setCopied] = useState(false);
  const [isConnected, setIsConnected] = useState(true);

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['delivery-track', orderId],
    queryFn: () => api.get(`/orders/${orderId}`).then((res) => res.data),
    retry: false,
    refetchInterval: 5000,
  });

  useEffect(() => {
    if (data?.order || data) {
      setLiveOrder((prev) => ({ ...(prev || {}), ...(data?.order || data) }));
    }
  }, [data]);

  // WebSocket for real-time updates
  useEffect(() => {
    if (!orderId) return;

    const socket = io(getSocketBaseUrl(), { withCredentials: true });

    socket.on('connect', () => {
      setIsConnected(true);
      socket.emit('join-room', { room: `order:${orderId}` });
    });

    socket.on('disconnect', () => setIsConnected(false));
    socket.on('connect_error', () => setIsConnected(false));

    socket.on('order-updated', (payload) => {
      if (String(payload.orderId) === String(orderId)) {
        setLiveOrder((prev) => ({ ...(prev || {}), ...payload }));
        if (payload.status === 'out-for-delivery') {
          toast.success('Your order is out for delivery! 🚚');
        } else if (payload.status === 'delivered') {
          toast.success('Order Delivered! Thank you! 🎉');
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

    socket.on('location-update', (payload) => {
      const nextLocation = payload?.liveLocation || payload?.location || payload;
      if (!hasCoordinates(nextLocation)) return;

      setLiveOrder((prev) => ({
        ...(prev || {}),
        liveLocation: {
          lat: nextLocation.lat,
          lng: nextLocation.lng,
          updatedAt: nextLocation.updatedAt || new Date().toISOString(),
        },
      }));
    });

    return () => {
      socket.emit('leave-room', { room: `order:${orderId}` });
      socket.close();
    };
  }, [orderId, refetch]);

  const order = liveOrder || data?.order || data;
  const currentStatus = order?.status || 'placed';
  const statusMeta = STATUS_META[currentStatus] || STATUS_META.placed;
  const StatusIcon = statusMeta.icon;
  const statusIndex = STATUS_FLOW.indexOf(currentStatus);
  
  const isPreOrder = order?.isPreOrder === true || 
    String(order?.specialNotes || '').toLowerCase().includes('pre-order type: delivery');

  const riderLat = Number(order?.liveLocation?.lat || 0);
  const riderLng = Number(order?.liveLocation?.lng || 0);
  const hasLiveRiderLocation = riderLat !== 0 && riderLng !== 0;
  const riderMapUrl = useMemo(() => buildMapEmbedUrl(order?.liveLocation), [order?.liveLocation]);

  const copyOTP = async () => {
    if (order?.deliveryOTP) {
      await navigator.clipboard.writeText(order.deliveryOTP);
      setCopied(true);
      toast.success('OTP copied!');
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const getStatusTime = (status) => {
    if (!order?.statusHistory) return null;
    const entry = order.statusHistory.find(e => e.status === status);
    return entry?.updatedAt || null;
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
        {isPreOrder && order.scheduledTime && (
          <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 mb-6">
            <div className="flex items-center gap-3">
              <CalendarDays size={24} className="text-orange-600" />
              <div>
                <h3 className="font-semibold text-orange-800">Pre-order Delivery</h3>
                <p className="text-sm text-orange-700">
                  Scheduled for {formatDateTime(order.scheduledTime)}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Order Header */}
        <div className="bg-white border border-gray-100 rounded-xl p-5 mb-6 shadow-sm">
          <div className="flex flex-wrap justify-between items-start gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium ${isPreOrder ? 'bg-orange-50 text-orange-600' : 'bg-sky-50 text-sky-600'}`}>
                  {isPreOrder ? <CalendarDays size={12} /> : <Truck size={12} />}
                  {isPreOrder ? 'Pre-order Delivery' : 'Delivery'}
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
          <p className="text-sm text-gray-500 mt-3">{statusMeta.desc}</p>
        </div>

        {/* OTP Section */}
        {currentStatus === 'out-for-delivery' && order.deliveryOTP && (
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
                <p className="text-xs text-gray-500 uppercase">One-Time Password</p>
                <p className="text-3xl font-bold tracking-widest text-gray-800">{order.deliveryOTP}</p>
              </div>
              <button onClick={copyOTP} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-amber-600 text-white">
                {copied ? <CheckCircle2 size={16} /> : <Copy size={16} />}
                {copied ? 'Copied!' : 'Copy OTP'}
              </button>
            </div>
          </div>
        )}

        {/* Live Map - Show when out for delivery */}
        {currentStatus === 'out-for-delivery' && (
          <div className="bg-white border border-gray-100 rounded-xl overflow-hidden mb-6 shadow-sm">
            <div className="p-4 bg-gradient-to-r from-amber-50 to-orange-50 border-b border-amber-100">
              <div className="flex items-center justify-between">
                <h2 className="font-semibold text-gray-800 flex items-center gap-2">
                  <MapPin size={18} className="text-amber-600" />
                  Live Tracking
                </h2>
                {hasLiveRiderLocation && (
                  <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-600 animate-pulse"></span>
                    Live
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-600 mt-1">Your rider is on the way!</p>
            </div>

            {/* Live Map */}
            <div className="p-4">
              <div className="w-full h-80 rounded-lg bg-gray-100 overflow-hidden">
                {!hasLiveRiderLocation ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center">
                      <p className="text-gray-500">Waiting for rider location...</p>
                    </div>
                  </div>
                ) : riderMapUrl ? (
                  <iframe
                    title="Live delivery tracking map"
                    src={riderMapUrl}
                    className="h-full w-full border-0"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                ) : null}
              </div>
            </div>

            {/* Rider Details */}
            <div className="p-4 border-t border-gray-100 bg-gray-50">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-amber-100 flex items-center justify-center">
                  <Bike size={24} className="text-amber-600" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-800 text-lg">
                    {order.deliveryAgent?.name || 'Delivery Partner'}
                  </p>
                  <p className="text-sm text-gray-500">
                    {order.deliveryAgent?.vehicleType || 'Bike'}
                  </p>
                  {order.deliveryAgent?.phone && (
                    <p className="text-sm text-gray-600 flex items-center gap-1 mt-1">
                      <Phone size={14} /> {order.deliveryAgent.phone}
                    </p>
                  )}
                </div>
                {order.deliveryAgent?.phone && (
                  <a 
                    href={`tel:${order.deliveryAgent.phone}`}
                    className="p-3 rounded-full bg-amber-100 text-amber-600 hover:bg-amber-200 transition-all"
                  >
                    <Phone size={20} />
                  </a>
                )}
              </div>
            </div>

            {/* Location Info */}
            <div className="p-4 border-t border-gray-100">
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-xs text-gray-500 mb-1">Current Rider Location</p>
                {hasLiveRiderLocation ? (
                  <>
                    <p className="text-sm text-gray-700">{formatLocationLabel(order.liveLocation)}</p>
                    <p className="text-xs font-mono text-gray-500 mt-1">{riderLat.toFixed(6)}, {riderLng.toFixed(6)}</p>
                    <p className="text-xs text-gray-400 mt-1">
                      Updated {formatTimeAgo(order.liveLocation?.updatedAt)}
                    </p>
                    <a 
                      href={`https://www.google.com/maps?q=${riderLat},${riderLng}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-3 inline-flex items-center gap-2 text-sm text-amber-600 hover:underline"
                    >
                      <Navigation size={14} /> Open in Google Maps
                    </a>
                  </>
                ) : (
                  <p className="text-sm text-gray-500">Waiting for rider location...</p>
                )}
              </div>

              {/* Delivery Address */}
              {order.deliveryAddress && (
                <div className="bg-gray-50 rounded-lg p-3 mt-3">
                  <p className="text-xs text-gray-500 mb-1">Delivery Address</p>
                  <p className="text-sm text-gray-700">{order.deliveryAddress.text}</p>
                </div>
              )}

              <button
                onClick={() => refetch()}
                className="mt-3 w-full flex items-center justify-center gap-2 py-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition-all"
              >
                <RefreshCw size={14} /> Refresh Location
              </button>
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
              const isCompleted = statusIndex >= index;
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
                <span className="text-gray-500">Delivery Fee</span>
                <span>{formatCurrency(order.deliveryFee || 0)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Tax</span>
                <span>{formatCurrency(order.taxAmount || 0)}</span>
              </div>
              {isPreOrder && order.preOrderFee > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Pre-order Fee</span>
                  <span>{formatCurrency(order.preOrderFee)}</span>
                </div>
              )}
              <div className="flex justify-between font-bold text-base pt-2 mt-1 border-t border-gray-100">
                <span className="text-gray-800">Total</span>
                <span className="text-amber-600">{formatCurrency(order.totalAmount)}</span>
              </div>
            </div>
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

        {/* Invoice Button */}
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

        {/* Delivered Celebration */}
        {currentStatus === 'delivered' && (
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
            <h3 className="text-xl font-bold text-gray-800">Order Delivered! 🎉</h3>
            <p className="text-sm text-gray-600 mt-1">Thank you for ordering from Roller Coaster Cafe</p>
          </motion.div>
        )}
      </main>

      <CustomerFooter />
    </div>
  );
}
