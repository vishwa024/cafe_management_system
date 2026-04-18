// import { useEffect, useState } from 'react';
// import { Link, useParams } from 'react-router-dom';
// import { useQuery } from '@tanstack/react-query';
// import { motion } from 'framer-motion';
// import { io } from 'socket.io-client';
// import { ArrowLeft, Table2, Clock3, ChefHat, CheckCircle2, ShoppingBag, UserRound, Phone, Mail } from 'lucide-react';
// import api from '../../services/api';
// import toast from 'react-hot-toast';
// import CustomerFooter from '../../components/customer/CustomerFooter';

// const STATUS_FLOW = ['placed', 'confirmed', 'preparing', 'ready', 'served'];

// const STATUS_META = {
//   placed: { title: 'Order Placed', desc: 'Your order has been received', icon: Clock3, color: 'bg-amber-50 text-amber-600' },
//   confirmed: { title: 'Order Confirmed', desc: 'Kitchen accepted your order', icon: CheckCircle2, color: 'bg-blue-50 text-blue-600' },
//   preparing: { title: 'Preparing', desc: 'Chef is preparing your meal', icon: ChefHat, color: 'bg-orange-50 text-orange-600' },
//   ready: { title: 'Ready to Serve', desc: 'Your food is ready to be served', icon: CheckCircle2, color: 'bg-emerald-50 text-emerald-600' },
//   served: { title: 'Served', desc: 'Your order has been served at your table', icon: CheckCircle2, color: 'bg-green-50 text-green-600' },
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

// export default function DineInTrackingPage() {
//   const { orderId } = useParams();
//   const [liveOrder, setLiveOrder] = useState(null);

//   const { data, isLoading } = useQuery({
//     queryKey: ['dinein-track', orderId],
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
//           toast.success('Your food is ready to be served! 🍽️');
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
//       <header className="border-b border-gray-100 bg-white sticky top-0 z-50">
//         <div className="max-w-4xl mx-auto px-4 py-3">
//           <div className="flex items-center justify-between">
//             <Link to="/dashboard" className="flex items-center gap-2">
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
//                   <div className="flex items-center gap-2 mb-2">
//                     <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-600">
//                       <Table2 size={12} /> Dine-In
//                     </span>
//                     <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium ${statusMeta.color}`}>
//                       <StatusIcon size={12} /> {statusMeta.title}
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

//             {/* Table Info Banner */}
//             <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
//               <div className="flex items-center gap-3">
//                 <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center">
//                   <Table2 size={18} className="text-amber-600" />
//                 </div>
//                 <div>
//                   <h3 className="font-medium text-gray-800">Table Information</h3>
//                   <p className="text-sm text-gray-600">
//                     Table {order.tableNumber || 'Assigned'} • {order.guestCount || 2} Guests
//                   </p>
//                   <p className="text-xs text-amber-600 mt-1">A server will attend to you shortly</p>
//                 </div>
//               </div>
//             </div>


//             {/* Order Items */}
//             <div className="bg-white border border-gray-100 rounded-xl p-5">
//               <h2 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
//                 <ShoppingBag size={16} className="text-amber-600" />
//                 Order Items
//               </h2>
//               <div className="space-y-2">
//                 {order.items?.map((item, idx) => (
//                   <div key={idx} className="flex justify-between text-sm">
//                     <span className="text-gray-600">{item.quantity} × {item.name}</span>
//                     <span className="font-medium text-gray-800">₹{item.totalPrice || item.unitPrice * item.quantity}</span>
//                   </div>
//                 ))}
//                 <div className="border-t border-gray-100 pt-2 mt-2">
//                   <div className="flex justify-between text-sm">
//                     <span className="text-gray-500">Subtotal</span>
//                     <span className="text-gray-700">₹{order.subtotal}</span>
//                   </div>
//                   <div className="flex justify-between text-sm">
//                     <span className="text-gray-500">Tax</span>
//                     <span className="text-gray-700">₹{order.taxAmount || 0}</span>
//                   </div>
//                   <div className="flex justify-between font-bold text-base pt-2 mt-1 border-t border-gray-100">
//                     <span className="text-gray-800">Total</span>
//                     <span className="text-amber-600">₹{order.totalAmount}</span>
//                   </div>
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

//             {/* Served Celebration */}
//             {currentStatus === 'served' && (
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
//                 <h3 className="text-xl font-bold text-gray-800">Enjoy Your Meal! 🍽️</h3>
//                 <p className="text-sm text-gray-600 mt-1">Thank you for dining with us at Roller Coaster Cafe</p>
//                 <p className="text-xs text-gray-500 mt-2">We hope you had a wonderful experience!</p>
//               </motion.div>
//             )}
//           </>
//         )}
//       </main>

//       <CustomerFooter />
//     </div>
//   );
// }



import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { io } from 'socket.io-client';
import { ArrowLeft, Table2, Clock3, ChefHat, CheckCircle2, ShoppingBag, UserRound, Phone, Mail, FileText } from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';
import CustomerFooter from '../../components/customer/CustomerFooter';

const STATUS_FLOW = ['placed', 'confirmed', 'preparing', 'ready', 'served'];

const STATUS_META = {
  placed: { title: 'Order Placed', desc: 'Your order has been received', icon: Clock3, color: 'bg-amber-50 text-amber-600' },
  confirmed: { title: 'Order Confirmed', desc: 'Kitchen accepted your order', icon: CheckCircle2, color: 'bg-blue-50 text-blue-600' },
  preparing: { title: 'Preparing', desc: 'Chef is preparing your meal', icon: ChefHat, color: 'bg-orange-50 text-orange-600' },
  ready: { title: 'Ready to Serve', desc: 'Your food is ready to be served', icon: CheckCircle2, color: 'bg-emerald-50 text-emerald-600' },
  served: { title: 'Served', desc: 'Your order has been served at your table', icon: CheckCircle2, color: 'bg-green-50 text-green-600' },
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

export default function DineInTrackingPage() {
  const { orderId } = useParams();
  const [liveOrder, setLiveOrder] = useState(null);

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['dinein-track', orderId],
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
          toast.success('Your food is ready to be served! 🍽️');
        } else if (payload.status === 'served') {
          toast.success('Enjoy your meal! 🎉');
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
        {/* Order Header */}
        <div className="bg-white border border-gray-100 rounded-xl p-5 mb-6 shadow-sm">
          <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-600">
                  <Table2 size={12} /> Dine-In
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

        {/* Table Info Banner */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center">
              <Table2 size={18} className="text-amber-600" />
            </div>
            <div>
              <h3 className="font-medium text-gray-800">Table Information</h3>
              <p className="text-sm text-gray-600">
                Table {order.tableNumber || 'Assigned'} • {order.guestCount || 2} Guests
              </p>
              <p className="text-xs text-amber-600 mt-1">A server will attend to you shortly</p>
            </div>
          </div>
        </div>

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

              if (status === 'served' && currentStatus !== 'served') return null;

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

        {/* Special Notes */}
        {order.specialNotes && (
          <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 mt-5">
            <p className="text-sm text-amber-700">
              <span className="font-medium">Note:</span> {order.specialNotes}
            </p>
          </div>
        )}

        {/* Invoice Button for Served Orders */}
        {(currentStatus === 'served' || currentStatus === 'completed') && (
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

        {/* Served Celebration */}
        {currentStatus === 'served' && (
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
            <h3 className="text-xl font-bold text-gray-800">Enjoy Your Meal! 🍽️</h3>
            <p className="text-sm text-gray-600 mt-1">Thank you for dining with us at Roller Coaster Cafe</p>
            <p className="text-xs text-gray-500 mt-2">We hope you had a wonderful experience!</p>
          </motion.div>
        )}
      </main>

      <CustomerFooter />
    </div>
  );
}