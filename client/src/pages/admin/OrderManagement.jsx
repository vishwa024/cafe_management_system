// import { useEffect, useState } from 'react';
// import { useQuery, useQueryClient } from '@tanstack/react-query';
// import { io } from 'socket.io-client';
// import { X, Phone, MapPin, Clock3 } from 'lucide-react';
// import api from '../../services/api';
// import AdminSidebar from '../../components/admin/AdminSidebar';
// import AdminPagination from '../../components/admin/AdminPagination';

// const FILTERS = [
//   { key: 'all', label: 'All' },
//   { key: 'placed', label: 'Placed' },
//   { key: 'confirmed', label: 'Confirmed' },
//   { key: 'preparing', label: 'Preparing' },
//   { key: 'ready', label: 'Ready' },
//   { key: 'out-for-delivery', label: 'Out for Delivery' },
//   { key: 'delivered', label: 'Delivered' },
//   { key: 'cancelled', label: 'Cancelled' },
// ];

// const STATUS_COLORS = {
//   placed: 'text-gray-500',
//   confirmed: 'text-blue-600',
//   preparing: 'text-orange-600',
//   ready: 'text-green-600',
//   'out-for-delivery': 'text-red-500',
//   delivered: 'text-green-700',
//   cancelled: 'text-red-600',
// };

// const PAGE_SIZE = 8;
// const currency = new Intl.NumberFormat('en-IN', {
//   style: 'currency',
//   currency: 'INR',
//   maximumFractionDigits: 0,
// });

// export default function OrderManagement() {
//   const [filter, setFilter] = useState('all');
//   const [selectedOrder, setSelectedOrder] = useState(null);
//   const [page, setPage] = useState(1);
//   const queryClient = useQueryClient();

//   const { data } = useQuery({
//     queryKey: ['admin-orders-screen', filter, page],
//     queryFn: () => api.get('/orders', { params: { limit: PAGE_SIZE, page, status: filter } }).then((r) => r.data),
//     refetchInterval: 15000,
//   });

//   const orders = data?.orders || [];
//   const total = data?.total || 0;
//   const totalPages = Math.max(1, data?.pages || 1);

//   useEffect(() => {
//     setPage(1);
//   }, [filter]);

//   useEffect(() => {
//     if (selectedOrder) {
//       const latest = orders.find((item) => item._id === selectedOrder._id);
//       if (latest) setSelectedOrder(latest);
//     }
//   }, [orders, selectedOrder]);

//   useEffect(() => {
//     const socket = io(import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000');
//     const refreshOrders = () => {
//       queryClient.invalidateQueries({ queryKey: ['admin-orders-screen'] });
//     };

//     socket.on('connect', () => socket.emit('join-room', { room: 'admin-map' }));
//     socket.on('delivery-order-changed', refreshOrders);
//     socket.on('delivery-order-rejected', refreshOrders);
//     socket.on('order-updated', refreshOrders);

//     return () => {
//       socket.emit('leave-room', { room: 'admin-map' });
//       socket.close();
//     };
//   }, [queryClient]);

//   return (
//     <div className="flex min-h-screen bg-gray-50 font-body">
//       <AdminSidebar />
//       <main className="flex-1 overflow-auto p-6 lg:p-8">
//         <div className="mb-6">
//           <h1 className="font-display text-4xl font-bold text-dark">All Orders</h1>
//           <p className="mt-2 text-gray-500">
//             Records stay in a compact table. Click any row to view full order information.
//           </p>
//         </div>

//         <div className="mb-6 flex flex-wrap gap-3">
//           {FILTERS.map((item) => (
//             <button
//               key={item.key}
//               onClick={() => setFilter(item.key)}
//               className={`rounded-full border px-4 py-2 text-sm font-semibold transition-all ${filter === item.key ? 'border-primary bg-primary text-white' : 'border-gray-200 bg-white text-gray-700 hover:border-primary'}`}
//             >
//               {item.label} {item.key === filter ? `(${total})` : ''}
//             </button>
//           ))}
//         </div>

//         <section className="card overflow-hidden">
//           <div className="overflow-x-auto">
//             <table className="min-w-full text-sm">
//               <thead className="bg-gray-50 text-left text-gray-500">
//                 <tr>
//                   <th className="px-5 py-4 font-semibold">Order ID</th>
//                   <th className="px-5 py-4 font-semibold">Customer</th>
//                   <th className="px-5 py-4 font-semibold">Type</th>
//                   <th className="px-5 py-4 font-semibold">Items</th>
//                   <th className="px-5 py-4 font-semibold">Amount</th>
//                   <th className="px-5 py-4 font-semibold">Status</th>
//                 </tr>
//               </thead>
//               <tbody className="divide-y divide-gray-100 bg-white">
//                 {orders.map((order) => (
//                   <tr
//                     key={order._id}
//                     onClick={() => setSelectedOrder(order)}
//                     className="cursor-pointer transition-colors hover:bg-gray-50"
//                   >
//                     <td className="px-5 py-4 font-semibold text-primary">{order.orderId}</td>
//                     <td className="px-5 py-4">
//                       <div>
//                         <p className="font-medium text-dark">{order.customer?.name || order.guestName || 'Customer'}</p>
//                         <p className="mt-1 text-xs text-gray-400">{order.customer?.phone || order.guestPhone || 'No phone'}</p>
//                       </div>
//                     </td>
//                     <td className="px-5 py-4 capitalize text-gray-600">{order.orderType}</td>
//                     <td className="px-5 py-4 text-gray-600">{order.items?.length || 0}</td>
//                     <td className="px-5 py-4 font-medium text-dark">{currency.format(order.totalAmount || 0)}</td>
//                     <td className={`px-5 py-4 font-semibold capitalize ${STATUS_COLORS[order.status] || 'text-gray-500'}`}>
//                       {order.status?.replace(/-/g, ' ')}
//                     </td>
//                   </tr>
//                 ))}
//                 {!orders.length ? (
//                   <tr>
//                     <td colSpan="6" className="px-5 py-10 text-center text-gray-400">
//                       No orders found.
//                     </td>
//                   </tr>
//                 ) : null}
//               </tbody>
//             </table>
//           </div>
//         </section>

//         <div className="mt-6">
//           <AdminPagination page={page} totalPages={totalPages} totalItems={total} pageSize={PAGE_SIZE} label="orders" onPageChange={setPage} />
//         </div>

//         {selectedOrder ? (
//           <div
//             className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-4"
//             onClick={(e) => e.target === e.currentTarget && setSelectedOrder(null)}
//           >
//             <div className="max-h-[88vh] w-full max-w-3xl overflow-auto rounded-3xl bg-white p-6 shadow-2xl">
//               <div className="flex items-start justify-between gap-4 border-b border-gray-100 pb-5">
//                 <div>
//                   <p className="mb-2 text-xs font-semibold text-primary">{selectedOrder.orderId}</p>
//                   <h2 className="font-display text-3xl font-bold text-dark">
//                     {selectedOrder.customer?.name || selectedOrder.guestName || 'Customer'}
//                   </h2>
//                   <p className={`mt-2 text-sm font-semibold ${STATUS_COLORS[selectedOrder.status] || 'text-gray-500'}`}>
//                     {selectedOrder.status?.replace(/-/g, ' ')}
//                   </p>
//                 </div>
//                 <button
//                   onClick={() => setSelectedOrder(null)}
//                   className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-100 text-gray-400"
//                 >
//                   <X size={18} />
//                 </button>
//               </div>

//               <div className="grid gap-4 py-5 md:grid-cols-3">
//                 <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
//                   <div className="flex items-start gap-3 text-gray-600">
//                     <Phone size={16} className="mt-1 text-gray-400" />
//                     <div>
//                       <p className="text-xs uppercase tracking-wide text-gray-400">Phone</p>
//                       <p className="mt-1 font-medium text-dark">{selectedOrder.customer?.phone || selectedOrder.guestPhone || 'No phone'}</p>
//                     </div>
//                   </div>
//                 </div>

//                 <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
//                   <div className="flex items-start gap-3 text-gray-600">
//                     <Clock3 size={16} className="mt-1 text-gray-400" />
//                     <div>
//                       <p className="text-xs uppercase tracking-wide text-gray-400">Order Type</p>
//                       <p className="mt-1 font-medium capitalize text-dark">{selectedOrder.orderType}</p>
//                       <p className="mt-1 text-sm text-gray-400">{new Date(selectedOrder.createdAt).toLocaleString('en-IN')}</p>
//                     </div>
//                   </div>
//                 </div>

//                 <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
//                   <p className="text-xs uppercase tracking-wide text-gray-400">Total Amount</p>
//                   <p className="mt-2 font-display text-3xl font-bold text-primary">
//                     {currency.format(selectedOrder.totalAmount || 0)}
//                   </p>
//                 </div>
//               </div>

//               <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
//                 <div className="flex items-start gap-3 text-gray-600">
//                   <MapPin size={16} className="mt-1 text-gray-400" />
//                   <div>
//                     <p className="text-xs uppercase tracking-wide text-gray-400">Address</p>
//                     <p className="mt-1 font-medium text-dark">{selectedOrder.deliveryAddress?.text || 'No address available'}</p>
//                   </div>
//                 </div>
//               </div>

//               <div className="mt-5">
//                 <p className="mb-3 font-semibold text-dark">Items</p>
//                 <div className="overflow-hidden rounded-2xl border border-gray-100">
//                   <table className="min-w-full text-sm">
//                     <thead className="bg-gray-50 text-left text-gray-500">
//                       <tr>
//                         <th className="px-4 py-3 font-semibold">Item</th>
//                         <th className="px-4 py-3 font-semibold">Quantity</th>
//                         <th className="px-4 py-3 font-semibold">Line Total</th>
//                       </tr>
//                     </thead>
//                     <tbody className="divide-y divide-gray-100 bg-white">
//                       {(selectedOrder.items || []).map((item, index) => (
//                         <tr key={`${selectedOrder._id}-${index}`}>
//                           <td className="px-4 py-3 text-dark">{item.name || item.menuItem?.name}</td>
//                           <td className="px-4 py-3 text-gray-600">{item.quantity}</td>
//                           <td className="px-4 py-3 font-medium text-dark">
//                             {currency.format(item.totalPrice || item.unitPrice * item.quantity || 0)}
//                           </td>
//                         </tr>
//                       ))}
//                     </tbody>
//                   </table>
//                 </div>
//               </div>

//               <div className="mt-5 rounded-2xl border border-amber-100 bg-amber-50 p-4 text-sm text-amber-700">
//                 Admin can review order details here, but status changes are intentionally disabled in this panel.
//               </div>
//             </div>
//           </div>
//         ) : null}
//       </main>
//     </div>
//   );
// }


import { useEffect, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { io } from 'socket.io-client';
import { X, Phone, MapPin, Clock3, Package, User } from 'lucide-react';
import api from '../../services/api';
import AdminSidebar from '../../components/admin/AdminSidebar';
import AdminPagination from '../../components/admin/AdminPagination';

const FILTERS = [
  { key: 'all', label: 'All' },
  { key: 'placed', label: 'Placed' },
  { key: 'confirmed', label: 'Confirmed' },
  { key: 'preparing', label: 'Preparing' },
  { key: 'ready', label: 'Ready' },
  { key: 'out-for-delivery', label: 'Out for Delivery' },
  { key: 'delivered', label: 'Delivered' },
  { key: 'cancelled', label: 'Cancelled' },
];

const STATUS_STYLES = {
  placed: 'bg-amber-100 text-amber-700',
  confirmed: 'bg-blue-100 text-blue-700',
  preparing: 'bg-orange-100 text-orange-700',
  ready: 'bg-emerald-100 text-emerald-700',
  'out-for-delivery': 'bg-indigo-100 text-indigo-700',
  delivered: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
};

const PAGE_SIZE = 10;
const currency = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 });
const formatOrderStatus = (status = '') => {
  const normalized = String(status).toLowerCase();
  if (['delivered', 'completed', 'done'].includes(normalized)) return 'Completed';
  if (normalized === 'out-for-delivery') return 'Out for Delivery';
  return String(status).replace(/-/g, ' ');
};
const isLegacyCompletedCod = (order) => {
  const checkoutMethod = String(order?.paymentMethod || '').toLowerCase();
  const hasCollectedMethod = Boolean(String(order?.deliveryPayment?.method || '').trim());
  const status = String(order?.status || '').toLowerCase();
  return !hasCollectedMethod && checkoutMethod === 'cod' && ['completed', 'delivered'].includes(status);
};
const formatPaymentMethod = (order) => {
  const normalized = String(order?.deliveryPayment?.method || order?.paymentMethod || '').toLowerCase();
  const hasCollectedMethod = Boolean(String(order?.deliveryPayment?.method || '').trim());
  if (isLegacyCompletedCod(order)) return 'COD';
  if (!hasCollectedMethod && normalized === 'cod') return 'COD';
  if (normalized === 'cod') return 'COD';
  if (normalized === 'online') return 'Online';
  if (normalized === 'cash') return 'Cash';
  if (normalized === 'upi') return 'UPI';
  return normalized ? normalized.replace(/\b\w/g, (char) => char.toUpperCase()) : 'Pending';
};
const formatPaymentStatus = (order) => {
  const orderStatus = String(order?.status || '').toLowerCase();
  const checkoutMethod = String(order?.paymentMethod || '').toLowerCase();
  const hasCollectedMethod = Boolean(String(order?.deliveryPayment?.method || '').trim());
  if (['delivered', 'completed', 'done'].includes(orderStatus)) {
    return 'Payment Complete';
  }
  if (isLegacyCompletedCod(order)) {
    return 'Payment Complete';
  }
  if (!hasCollectedMethod && checkoutMethod === 'cod' && String(order?.paymentStatus || '').toLowerCase() !== 'paid') {
    return 'Awaiting Cash/UPI Collection';
  }
  const raw = String(order?.deliveryPayment?.status || order?.paymentStatus || 'pending').toLowerCase();
  if (raw === 'paid') return 'Payment Complete';
  return raw.replace(/\b\w/g, (char) => char.toUpperCase());
};
const paymentBadgeClass = (order) => (
  formatPaymentStatus(order) === 'Payment Complete'
    ? 'bg-amber-100 text-amber-700'
    : 'bg-gray-100 text-gray-700'
);
const getItemUnitPrice = (item = {}) => item.price ?? item.unitPrice ?? 0;
const getItemSubtotal = (item = {}) => {
  if (typeof item.totalPrice === 'number') return item.totalPrice;
  return getItemUnitPrice(item) * (item.quantity || 0);
};
const getOrderPricing = (order = {}) => {
  const itemsSubtotal = Array.isArray(order.items)
    ? order.items.reduce((sum, item) => sum + getItemSubtotal(item), 0)
    : 0;
  const subtotal = typeof order.subtotal === 'number' ? order.subtotal : itemsSubtotal;
  const taxAmount = typeof order.taxAmount === 'number' ? order.taxAmount : 0;
  const deliveryFee = typeof order.deliveryFee === 'number' ? order.deliveryFee : 0;
  const tipAmount = typeof order.tipAmount === 'number' ? order.tipAmount : 0;
  const preOrderFee = typeof order.preOrderFee === 'number' ? order.preOrderFee : 0;
  const discount = typeof order.discount === 'number' ? order.discount : 0;
  const totalAmount = order.totalAmount ?? (subtotal + taxAmount + deliveryFee + tipAmount + preOrderFee - discount);

  return {
    itemsSubtotal,
    subtotal,
    taxAmount,
    deliveryFee,
    tipAmount,
    preOrderFee,
    discount,
    totalAmount,
  };
};

export default function OrderManagement() {
  const [filter, setFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [page, setPage] = useState(1);
  const queryClient = useQueryClient();

  const { data } = useQuery({
    queryKey: ['admin-orders-screen', filter, page],
    queryFn: () => api.get('/orders', { params: { limit: PAGE_SIZE, page, status: filter } }).then((r) => r.data),
    refetchInterval: 15000,
  });

  const orders = data?.orders || [];
  const total = data?.total || 0;
  const totalPages = Math.max(1, data?.pages || 1);
  const selectedOrderPricing = selectedOrder ? getOrderPricing(selectedOrder) : null;

  useEffect(() => setPage(1), [filter]);

  useEffect(() => {
    if (selectedOrder) {
      const latest = orders.find((item) => item._id === selectedOrder._id);
      if (latest) setSelectedOrder(latest);
    }
  }, [orders, selectedOrder]);

  useEffect(() => {
    const socket = io(import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000');
    const refreshOrders = () => queryClient.invalidateQueries({ queryKey: ['admin-orders-screen'] });
    socket.on('connect', () => socket.emit('join-room', { room: 'admin-map' }));
    socket.on('delivery-order-changed', refreshOrders);
    socket.on('delivery-order-rejected', refreshOrders);
    socket.on('order-updated', refreshOrders);
    return () => { socket.emit('leave-room', { room: 'admin-map' }); socket.close(); };
  }, [queryClient]);

  return (
    <div className="flex min-h-screen bg-[#faf8f5]">
      <AdminSidebar />
      <main className="flex-1 p-6 lg:p-8 overflow-auto">
        <div className="mb-6">
          <h1 className="font-display text-3xl font-bold text-[#3f3328]">All Orders</h1>
          <p className="text-sm text-[#6b5f54] mt-1">View and manage all customer orders</p>
        </div>

        <div className="flex flex-wrap gap-2 mb-6">
          {FILTERS.map((item) => (
            <button key={item.key} onClick={() => setFilter(item.key)} className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${filter === item.key ? 'bg-[#b97844] text-white' : 'bg-white border border-[#e8e0d6] text-[#6b5f54] hover:border-[#b97844] hover:text-[#b97844]'}`}>
              {item.label} {filter === item.key && `(${total})`}
            </button>
          ))}
        </div>

        <div className="bg-white border border-[#e8e0d6] rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-[#faf8f5] text-left text-[#6b5f54] border-b border-[#e8e0d6]">
                <tr><th className="px-5 py-3 font-semibold">Order ID</th><th className="px-5 py-3 font-semibold">Customer</th><th className="px-5 py-3 font-semibold">Type</th><th className="px-5 py-3 font-semibold">Items</th><th className="px-5 py-3 font-semibold">Amount</th><th className="px-5 py-3 font-semibold">Status</th><th className="px-5 py-3 font-semibold">Payment</th></tr>
              </thead>
              <tbody className="divide-y divide-[#e8e0d6]">
                {orders.map((order) => (
                  <tr key={order._id} onClick={() => setSelectedOrder(order)} className="cursor-pointer hover:bg-[#faf8f5] transition-all">
                    <td className="px-5 py-3 font-mono text-sm font-semibold text-[#b97844]">{order.orderId}</td>
                    <td className="px-5 py-3"><p className="font-medium text-[#3f3328]">{order.customer?.name || order.guestName || 'Guest'}</p><p className="text-xs text-[#a0968c] mt-0.5">{order.customer?.phone || order.guestPhone || '-'}</p></td>
                    <td className="px-5 py-3 capitalize text-[#6b5f54]">{order.orderType}</td>
                    <td className="px-5 py-3 text-[#6b5f54]">{order.items?.length || 0}</td>
                    <td className="px-5 py-3 font-medium text-[#3f3328]">{currency.format(order.totalAmount || 0)}</td>
                    <td className="px-5 py-3"><span className={`inline-flex px-2 py-1 rounded-lg text-xs font-medium ${STATUS_STYLES[order.status] || 'bg-gray-100 text-gray-700'}`}>{formatOrderStatus(order.status)}</span></td>
                    <td className="px-5 py-3"><span className={`inline-flex px-2 py-1 rounded-lg text-xs font-medium ${paymentBadgeClass(order)}`}>{formatPaymentMethod(order)} • {formatPaymentStatus(order)}</span></td>
                  </tr>
                ))}
                {!orders.length && <tr><td colSpan="7" className="px-5 py-12 text-center text-[#a0968c]">No orders found.</td></tr>}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-6"><AdminPagination page={page} totalPages={totalPages} totalItems={total} pageSize={PAGE_SIZE} label="orders" onPageChange={setPage} /></div>

        {selectedOrder && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={(e) => e.target === e.currentTarget && setSelectedOrder(null)}>
            <div className="w-full max-w-3xl max-h-[85vh] overflow-auto bg-white rounded-2xl shadow-2xl">
              <div className="sticky top-0 bg-white border-b border-[#e8e0d6] px-6 py-4 flex items-center justify-between">
                <div><p className="text-xs text-[#b97844] font-mono">{selectedOrder.orderId}</p><h2 className="font-display text-xl font-bold text-[#3f3328]">{selectedOrder.customer?.name || selectedOrder.guestName || 'Customer'}</h2></div>
                <button onClick={() => setSelectedOrder(null)} className="p-2 rounded-lg hover:bg-[#faf8f5]"><X size={20} className="text-[#a0968c]" /></button>
              </div>
              <div className="p-6 space-y-5">
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="bg-[#faf8f5] rounded-xl p-4"><Phone size={16} className="text-[#b97844] mb-2" /><p className="text-xs text-[#6b5f54]">Phone</p><p className="font-medium text-[#3f3328]">{selectedOrder.customer?.phone || selectedOrder.guestPhone || 'No phone'}</p></div>
                  <div className="bg-[#faf8f5] rounded-xl p-4"><Clock3 size={16} className="text-[#b97844] mb-2" /><p className="text-xs text-[#6b5f54]">Order Type</p><p className="font-medium text-[#3f3328] capitalize">{selectedOrder.orderType}</p><p className="text-xs text-[#a0968c] mt-1">{new Date(selectedOrder.createdAt).toLocaleString()}</p></div>
                  <div className="bg-[#faf8f5] rounded-xl p-4"><Package size={16} className="text-[#b97844] mb-2" /><p className="text-xs text-[#6b5f54]">Total Amount</p><p className="text-2xl font-bold text-[#b97844]">{currency.format(selectedOrder.totalAmount || 0)}</p></div>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-[#faf8f5] rounded-xl p-4">
                    <p className="text-xs text-[#6b5f54]">Payment Method</p>
                    <p className="mt-1 font-medium text-[#3f3328]">{formatPaymentMethod(selectedOrder)}</p>
                    <p className="mt-2 text-xs text-[#a0968c]">Status: {formatPaymentStatus(selectedOrder)}</p>
                  </div>
                  <div className="bg-[#faf8f5] rounded-xl p-4">
                    <p className="text-xs text-[#6b5f54]">Payment Timeline</p>
                    <p className="mt-1 font-medium text-[#3f3328]">{selectedOrder.paidAt ? new Date(selectedOrder.paidAt).toLocaleString() : 'Waiting for confirmation'}</p>
                    {selectedOrder.delayedAt ? <p className="mt-2 text-xs text-red-600">Delayed at {new Date(selectedOrder.delayedAt).toLocaleString()}</p> : null}
                    {selectedOrder.paymentNote ? <p className="mt-2 text-xs text-[#6b5f54]">{selectedOrder.paymentNote}</p> : null}
                  </div>
                </div>
                {(selectedOrder.isPreOrder || selectedOrder.scheduledTime) && (
                  <div className="bg-[#faf8f5] rounded-xl p-4">
                    <p className="text-xs text-[#6b5f54]">Scheduled Service</p>
                    <p className="mt-1 font-medium text-[#3f3328]">
                      {selectedOrder.scheduledTime ? new Date(selectedOrder.scheduledTime).toLocaleString() : 'Not scheduled'}
                    </p>
                    {selectedOrder.isPreOrder ? (
                      <p className="mt-2 text-xs text-[#a0968c] capitalize">
                        Pre-order {selectedOrder.preOrderMethod || selectedOrder.orderType}
                      </p>
                    ) : null}
                  </div>
                )}
                <div className="bg-[#faf8f5] rounded-xl p-4"><MapPin size={16} className="text-[#b97844] mb-2" /><p className="text-xs text-[#6b5f54]">Delivery Address</p><p className="font-medium text-[#3f3328]">{selectedOrder.deliveryAddress?.text || 'No address available'}</p></div>
                <div>
                  <p className="font-semibold text-[#3f3328] mb-3">Order Items</p>
                  <div className="overflow-hidden rounded-xl border border-[#e8e0d6]">
                    <table className="min-w-full text-sm">
                      <thead className="bg-[#faf8f5]">
                        <tr>
                          <th className="px-4 py-2 text-left">Item</th>
                          <th className="px-4 py-2">Qty</th>
                          <th className="px-4 py-2 text-right">Price</th>
                          <th className="px-4 py-2 text-right">Amount</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#e8e0d6]">
                        {(selectedOrder.items || []).map((item, idx) => (
                          <tr key={idx}>
                            <td className="px-4 py-2">{item.name || item.menuItem?.name}</td>
                            <td className="px-4 py-2 text-center">{item.quantity}</td>
                            <td className="px-4 py-2 text-right">{currency.format(getItemUnitPrice(item))}</td>
                            <td className="px-4 py-2 text-right">{currency.format(getItemSubtotal(item))}</td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot className="bg-[#faf8f5] font-semibold text-[#3f3328]">
                        <tr>
                          <td className="px-4 py-2 text-right" colSpan="3">Items Total</td>
                          <td className="px-4 py-2 text-right">{currency.format(selectedOrderPricing?.itemsSubtotal)}</td>
                        </tr>
                        <tr>
                          <td className="px-4 py-2 text-right" colSpan="3">Order Amount</td>
                          <td className="px-4 py-2 text-right">{currency.format(selectedOrderPricing?.subtotal)}</td>
                        </tr>
                        <tr>
                          <td className="px-4 py-2 text-right" colSpan="3">GST</td>
                          <td className="px-4 py-2 text-right">{currency.format(selectedOrderPricing?.taxAmount)}</td>
                        </tr>
                        {(selectedOrderPricing?.deliveryFee ?? 0) > 0 && (
                          <tr>
                            <td className="px-4 py-2 text-right" colSpan="3">Delivery Fee</td>
                            <td className="px-4 py-2 text-right">{currency.format(selectedOrderPricing?.deliveryFee)}</td>
                          </tr>
                        )}
                        {(selectedOrderPricing?.preOrderFee ?? 0) > 0 && (
                          <tr>
                            <td className="px-4 py-2 text-right" colSpan="3">Pre-order Fee</td>
                            <td className="px-4 py-2 text-right">{currency.format(selectedOrderPricing?.preOrderFee)}</td>
                          </tr>
                        )}
                        {(selectedOrderPricing?.tipAmount ?? 0) > 0 && (
                          <tr>
                            <td className="px-4 py-2 text-right" colSpan="3">Tip</td>
                            <td className="px-4 py-2 text-right">{currency.format(selectedOrderPricing?.tipAmount)}</td>
                          </tr>
                        )}
                        {(selectedOrderPricing?.discount ?? 0) > 0 && (
                          <tr>
                            <td className="px-4 py-2 text-right" colSpan="3">Discount</td>
                            <td className="px-4 py-2 text-right text-green-600">- {currency.format(selectedOrderPricing?.discount)}</td>
                          </tr>
                        )}
                        <tr>
                          <td className="px-4 py-2 text-right" colSpan="3">Total</td>
                          <td className="px-4 py-2 text-right">{currency.format(selectedOrderPricing?.totalAmount)}</td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                </div>
                {selectedOrder.specialNotes && <div className="bg-amber-50 rounded-xl p-4 text-sm text-amber-700">📝 {selectedOrder.specialNotes}</div>}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
