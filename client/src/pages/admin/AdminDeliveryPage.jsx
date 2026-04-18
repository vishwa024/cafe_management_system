// // // import { useEffect, useMemo, useState } from 'react';
// // // import { useQuery, useQueryClient } from '@tanstack/react-query';
// // // import { Bike, MapPin, Phone, PackageCheck, Clock3 } from 'lucide-react';
// // // import { io } from 'socket.io-client';
// // // import api from '../../services/api';
// // // import AdminSidebar from '../../components/admin/AdminSidebar';
// // // import AdminPagination from '../../components/admin/AdminPagination';

// // // const ACTIVE_DELIVERY_STATUSES = ['ready', 'out-for-delivery'];
// // // const ADMIN_VISIBLE_DELIVERY_STATUSES = ['ready', 'out-for-delivery', 'delivered', 'cancelled'];
// // // const PAGE_SIZE = 6;

// // // function StatCard({ icon: Icon, label, value, tone }) {
// // //   const tones = {
// // //     orange: 'bg-orange-100 text-orange-700',
// // //     blue: 'bg-blue-100 text-blue-700',
// // //     green: 'bg-emerald-100 text-emerald-700',
// // //     amber: 'bg-amber-100 text-amber-700',
// // //   };

// // //   return (
// // //     <div className="card p-5">
// // //       <div className={`w-11 h-11 rounded-2xl flex items-center justify-center mb-4 ${tones[tone] || tones.orange}`}>
// // //         <Icon size={20} />
// // //       </div>
// // //       <p className="text-3xl font-display font-bold text-dark">{value}</p>
// // //       <p className="text-gray-500 text-sm mt-1">{label}</p>
// // //     </div>
// // //   );
// // // }

// // // export default function AdminDeliveryPage() {
// // //   const [teamPage, setTeamPage] = useState(1);
// // //   const [queuePage, setQueuePage] = useState(1);
// // //   const [activityPage, setActivityPage] = useState(1);
// // //   const queryClient = useQueryClient();
// // //   const { data: users = [] } = useQuery({
// // //     queryKey: ['admin-users-delivery'],
// // //     queryFn: () => api.get('/admin/users').then((r) => r.data),
// // //     refetchInterval: 15000,
// // //   });

// // //   const { data: orderData } = useQuery({
// // //     queryKey: ['admin-delivery-orders'],
// // //     queryFn: () => api.get('/orders', { params: { limit: 100, orderType: 'delivery' } }).then((r) => r.data),
// // //     refetchInterval: 15000,
// // //   });

// // //   const orders = orderData?.orders || [];

// // //   useEffect(() => {
// // //     const socket = io(import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000');
// // //     const refreshAdminDelivery = () => {
// // //       queryClient.invalidateQueries({ queryKey: ['admin-delivery-orders'] });
// // //       queryClient.invalidateQueries({ queryKey: ['admin-users-delivery'] });
// // //     };

// // //     socket.on('connect', () => socket.emit('join-room', { room: 'admin-map' }));
// // //     socket.on('delivery-order-changed', refreshAdminDelivery);
// // //     socket.on('delivery-order-rejected', refreshAdminDelivery);
// // //     socket.on('agent-status', refreshAdminDelivery);
// // //     socket.on('agent-location', refreshAdminDelivery);
// // //     socket.on('order-updated', (payload) => {
// // //       if (!payload?.orderType || payload.orderType === 'delivery') refreshAdminDelivery();
// // //     });

// // //     return () => {
// // //       socket.emit('leave-room', { room: 'admin-map' });
// // //       socket.close();
// // //     };
// // //   }, [queryClient]);

// // //   const deliveryUsers = useMemo(() => users.filter((user) => user.role === 'delivery'), [users]);
// // //   const deliveryOrders = useMemo(
// // //     () => orders.filter((order) => ADMIN_VISIBLE_DELIVERY_STATUSES.includes(order.status)),
// // //     [orders]
// // //   );
// // //   const activeDeliveryOrders = useMemo(
// // //     () => deliveryOrders.filter((order) => ACTIVE_DELIVERY_STATUSES.includes(order.status)),
// // //     [deliveryOrders]
// // //   );
// // //   const readyToDispatch = useMemo(() => deliveryOrders.filter((order) => order.status === 'ready'), [deliveryOrders]);
// // //   const onRoad = useMemo(() => deliveryOrders.filter((order) => order.status === 'out-for-delivery'), [deliveryOrders]);
// // //   const deliveredOrders = useMemo(() => deliveryOrders.filter((order) => order.status === 'delivered'), [deliveryOrders]);
// // //   const cancelledOrders = useMemo(() => deliveryOrders.filter((order) => order.status === 'cancelled'), [deliveryOrders]);
// // //   const deliveryActivity = useMemo(() => {
// // //     const events = [];

// // //     orders.forEach((order) => {
// // //       (order.statusHistory || []).forEach((entry, index) => {
// // //         const normalizedNote = String(entry.note || '').toLowerCase();
// // //         const type = entry.status === 'ready' && normalizedNote.includes('delivery cancelled by rider')
// // //           ? 'returned'
// // //           : normalizedNote.includes('eta updated')
// // //             ? 'eta-updated'
// // //             : entry.status;

// // //         if (!['out-for-delivery', 'delivered', 'cancelled', 'returned', 'eta-updated'].includes(type)) return;
// // //         events.push({
// // //           id: `${order._id}-status-${index}`,
// // //           type,
// // //           orderId: order.orderId,
// // //           customerName: order.customer?.name || 'Customer',
// // //           note: entry.note || '',
// // //           at: entry.updatedAt,
// // //         });
// // //       });

// // //       (order.deliveryRejections || []).forEach((entry, index) => {
// // //         events.push({
// // //           id: `${order._id}-reject-${index}`,
// // //           type: 'rejected',
// // //           orderId: order.orderId,
// // //           customerName: order.customer?.name || 'Customer',
// // //           note: entry.reason || '',
// // //           at: entry.rejectedAt,
// // //         });
// // //       });
// // //     });

// // //     return events.sort((a, b) => new Date(b.at) - new Date(a.at));
// // //   }, [orders]);
// // //   const paginatedDeliveryUsers = useMemo(() => deliveryUsers.slice((teamPage - 1) * PAGE_SIZE, teamPage * PAGE_SIZE), [deliveryUsers, teamPage]);
// // //   const paginatedDeliveryOrders = useMemo(() => deliveryOrders.slice((queuePage - 1) * PAGE_SIZE, queuePage * PAGE_SIZE), [deliveryOrders, queuePage]);
// // //   const paginatedDeliveryActivity = useMemo(() => deliveryActivity.slice((activityPage - 1) * PAGE_SIZE, activityPage * PAGE_SIZE), [deliveryActivity, activityPage]);

// // //   return (
// // //     <div className="flex min-h-screen bg-gray-50 font-body">
// // //       <AdminSidebar />

// // //       <main className="flex-1 p-8 overflow-auto">
// // //         <div className="mb-8">
// // //           <div>
// // //             <h1 className="font-display text-4xl font-bold text-dark">Delivery</h1>
// // //             <p className="text-gray-500 mt-2">Admin details for riders, active trips, cancelled orders, and live delivery updates.</p>
// // //           </div>
// // //         </div>

// // //         <div className="grid grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
// // //           <StatCard icon={Bike} label="Delivery Team" value={deliveryUsers.length} tone="orange" />
// // //           <StatCard icon={PackageCheck} label="Ready To Dispatch" value={readyToDispatch.length} tone="green" />
// // //           <StatCard icon={Clock3} label="On The Road" value={onRoad.length} tone="blue" />
// // //           <StatCard icon={MapPin} label="Tracked Delivery Orders" value={deliveryOrders.length} tone="amber" />
// // //         </div>

// // //         <div className="grid xl:grid-cols-[0.85fr,1.15fr] gap-6 mb-6">
// // //           <section className="card p-6">
// // //             <div className="flex items-center justify-between mb-5">
// // //               <h2 className="font-display text-2xl font-bold text-dark">Delivery Team</h2>
// // //               <span className="text-sm text-gray-400">{deliveryUsers.filter((u) => u.isOnline).length} online</span>
// // //             </div>

// // //             <div className="space-y-4">
// // //               {paginatedDeliveryUsers.map((user) => (
// // //                 <div key={user._id} className="rounded-2xl bg-gray-50 border border-gray-100 p-4">
// // //                   <div className="flex items-start justify-between gap-3 mb-2">
// // //                     <div>
// // //                       <p className="font-semibold text-dark">{user.name}</p>
// // //                       <p className="text-sm text-gray-500 mt-1">{user.email || 'No email'}</p>
// // //                     </div>
// // //                     <span className={`text-sm font-semibold ${user.isOnline ? 'text-green-600' : 'text-red-500'}`}>
// // //                       {user.isOnline ? 'Online' : 'Offline'}
// // //                     </span>
// // //                   </div>
// // //                   <p className="text-sm text-gray-500">{user.phone || 'No phone'}</p>
// // //                   {user.vehicleType ? <p className="text-xs text-gray-400 mt-2 capitalize">Vehicle: {user.vehicleType}</p> : null}
// // //                   {user.lastSeen ? <p className="text-xs text-gray-400 mt-1">Last seen: {new Date(user.lastSeen).toLocaleString()}</p> : null}
// // //                 </div>
// // //               ))}

// // //               {!deliveryUsers.length ? (
// // //                 <div className="rounded-2xl bg-gray-50 border border-dashed border-gray-200 p-8 text-center text-gray-400">
// // //                   No delivery users yet.
// // //                 </div>
// // //               ) : null}
// // //               <AdminPagination page={teamPage} totalPages={Math.max(1, Math.ceil(deliveryUsers.length / PAGE_SIZE))} totalItems={deliveryUsers.length} pageSize={PAGE_SIZE} label="delivery users" onPageChange={setTeamPage} />
// // //             </div>
// // //           </section>

// // //           <section className="card p-6">
// // //             <div className="flex items-center justify-between mb-5">
// // //               <h2 className="font-display text-2xl font-bold text-dark">Delivery Queue</h2>
// // //               <span className="text-sm text-gray-400">{activeDeliveryOrders.length} live, {deliveredOrders.length} delivered, {cancelledOrders.length} cancelled</span>
// // //             </div>

// // //             <div className="space-y-4">
// // //               {paginatedDeliveryOrders.map((order) => (
// // //                 <div key={order._id} className="rounded-2xl border border-gray-100 p-4 bg-white">
// // //                   <div className="flex items-start justify-between gap-3 mb-3">
// // //                     <div>
// // //                       <p className="text-xs font-semibold text-primary mb-1">{order.orderId}</p>
// // //                       <p className="font-semibold text-dark">{order.customer?.name || 'Customer'}</p>
// // //                       <p className="text-sm text-gray-500 mt-1">Rs. {order.totalAmount || 0}</p>
// // //                     </div>
// // //                     <span className={`badge capitalize ${
// // //                       order.status === 'out-for-delivery'
// // //                         ? 'badge-primary'
// // //                         : order.status === 'ready'
// // //                           ? 'badge-success'
// // //                           : order.status === 'cancelled'
// // //                             ? 'bg-red-100 text-red-700'
// // //                             : 'bg-slate-100 text-slate-700'
// // //                     }`}>
// // //                       {order.status.replaceAll('-', ' ')}
// // //                     </span>
// // //                   </div>

// // //                   <div className="space-y-3 text-sm text-gray-600">
// // //                     <div className="flex items-start gap-2">
// // //                       <Phone size={15} className="mt-0.5 text-gray-400" />
// // //                       <span>{order.customer?.phone || 'No phone'}</span>
// // //                     </div>
// // //                     <div className="flex items-start gap-2">
// // //                       <MapPin size={15} className="mt-0.5 text-gray-400" />
// // //                       <span>{order.deliveryAddress?.text || 'No delivery address'}</span>
// // //                     </div>
// // //                     <p>{(order.items || []).length} items in this delivery order</p>
// // //                     {order.cancelReason ? <p className="text-red-600">Cancel reason: {order.cancelReason}</p> : null}
// // //                   </div>
// // //                 </div>
// // //               ))}

// // //               {!deliveryOrders.length ? (
// // //                 <div className="rounded-2xl bg-gray-50 border border-dashed border-gray-200 p-8 text-center text-gray-400">
// // //                   No delivery orders to show right now.
// // //                 </div>
// // //               ) : null}
// // //               <AdminPagination page={queuePage} totalPages={Math.max(1, Math.ceil(deliveryOrders.length / PAGE_SIZE))} totalItems={deliveryOrders.length} pageSize={PAGE_SIZE} label="delivery orders" onPageChange={setQueuePage} />
// // //             </div>
// // //           </section>
// // //         </div>

// // //         <section className="card p-6">
// // //           <div className="flex items-center justify-between mb-5">
// // //             <h2 className="font-display text-2xl font-bold text-dark">Recent Delivery Activity</h2>
// // //             <span className="text-sm text-gray-400">{deliveryActivity.length} events</span>
// // //           </div>

// // //           <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
// // //             {paginatedDeliveryActivity.map((item) => (
// // //               <div key={item.id} className="rounded-2xl border border-gray-100 p-4 bg-white">
// // //                 <div className="flex items-center justify-between gap-3">
// // //                   <p className="font-semibold text-dark">#{item.orderId}</p>
// // //                   <span className={`badge capitalize ${
// // //                     item.type === 'delivered'
// // //                       ? 'badge-success'
// // //                       : item.type === 'rejected' || item.type === 'cancelled'
// // //                         ? 'bg-red-100 text-red-700'
// // //                         : item.type === 'returned'
// // //                           ? 'bg-amber-100 text-amber-700'
// // //                           : item.type === 'eta-updated'
// // //                             ? 'bg-sky-100 text-sky-700'
// // //                             : 'badge-primary'
// // //                   }`}>
// // //                     {item.type.replaceAll('-', ' ')}
// // //                   </span>
// // //                 </div>
// // //                 <p className="text-sm text-gray-500 mt-2">{item.customerName}</p>
// // //                 {item.note ? <p className="text-sm text-gray-600 mt-3">{item.note}</p> : null}
// // //                 <p className="text-xs text-gray-400 mt-3">{new Date(item.at).toLocaleString()}</p>
// // //               </div>
// // //             ))}

// // //             {!deliveryActivity.length ? (
// // //               <div className="rounded-2xl bg-gray-50 border border-dashed border-gray-200 p-8 text-center text-gray-400 md:col-span-2 xl:col-span-3">
// // //                 No rider activity logged yet.
// // //               </div>
// // //             ) : null}
// // //           </div>
// // //           <AdminPagination page={activityPage} totalPages={Math.max(1, Math.ceil(deliveryActivity.length / PAGE_SIZE))} totalItems={deliveryActivity.length} pageSize={PAGE_SIZE} label="activity events" onPageChange={setActivityPage} />
// // //         </section>
// // //       </main>
// // //     </div>
// // //   );
// // // }
// // import { useEffect, useMemo, useState } from 'react';
// // import { useQuery, useQueryClient } from '@tanstack/react-query';
// // import { Bike, MapPin, Phone, PackageCheck, Clock3 } from 'lucide-react';
// // import { io } from 'socket.io-client';
// // import api from '../../services/api';
// // import AdminSidebar from '../../components/admin/AdminSidebar';
// // import AdminPagination from '../../components/admin/AdminPagination';

// // const ACTIVE_DELIVERY_STATUSES = ['ready', 'out-for-delivery'];
// // const ADMIN_VISIBLE_DELIVERY_STATUSES = ['ready', 'out-for-delivery', 'delivered', 'cancelled'];
// // const PAGE_SIZE = 6;

// // function StatCard({ icon: Icon, label, value, tone }) {
// //   const tones = {
// //     orange: 'bg-amber-100 text-amber-700',
// //     blue: 'bg-blue-100 text-blue-700',
// //     green: 'bg-emerald-100 text-emerald-700',
// //     amber: 'bg-amber-100 text-amber-700',
// //   };

// //   return (
// //     <div className="bg-white border border-[#e8e0d6] rounded-xl p-5">
// //       <div className={`w-11 h-11 rounded-xl flex items-center justify-center mb-4 ${tones[tone] || tones.orange}`}>
// //         <Icon size={20} />
// //       </div>
// //       <p className="text-3xl font-bold text-[#3f3328]">{value}</p>
// //       <p className="text-sm text-[#6b5f54] mt-1">{label}</p>
// //     </div>
// //   );
// // }

// // export default function AdminDeliveryPage() {
// //   const [teamPage, setTeamPage] = useState(1);
// //   const [queuePage, setQueuePage] = useState(1);
// //   const [activityPage, setActivityPage] = useState(1);
// //   const queryClient = useQueryClient();
// //   const { data: users = [] } = useQuery({
// //     queryKey: ['admin-users-delivery'],
// //     queryFn: () => api.get('/admin/users').then((r) => r.data),
// //     refetchInterval: 15000,
// //   });

// //   const { data: orderData } = useQuery({
// //     queryKey: ['admin-delivery-orders'],
// //     queryFn: () => api.get('/orders', { params: { limit: 100, orderType: 'delivery' } }).then((r) => r.data),
// //     refetchInterval: 15000,
// //   });

// //   const orders = orderData?.orders || [];

// //   useEffect(() => {
// //     const socket = io(import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000');
// //     const refreshAdminDelivery = () => {
// //       queryClient.invalidateQueries({ queryKey: ['admin-delivery-orders'] });
// //       queryClient.invalidateQueries({ queryKey: ['admin-users-delivery'] });
// //     };

// //     socket.on('connect', () => socket.emit('join-room', { room: 'admin-map' }));
// //     socket.on('delivery-order-changed', refreshAdminDelivery);
// //     socket.on('delivery-order-rejected', refreshAdminDelivery);
// //     socket.on('agent-status', refreshAdminDelivery);
// //     socket.on('agent-location', refreshAdminDelivery);
// //     socket.on('order-updated', (payload) => {
// //       if (!payload?.orderType || payload.orderType === 'delivery') refreshAdminDelivery();
// //     });

// //     return () => {
// //       socket.emit('leave-room', { room: 'admin-map' });
// //       socket.close();
// //     };
// //   }, [queryClient]);

// //   const deliveryUsers = useMemo(() => users.filter((user) => user.role === 'delivery'), [users]);
// //   const deliveryOrders = useMemo(
// //     () => orders.filter((order) => ADMIN_VISIBLE_DELIVERY_STATUSES.includes(order.status)),
// //     [orders]
// //   );
// //   const activeDeliveryOrders = useMemo(
// //     () => deliveryOrders.filter((order) => ACTIVE_DELIVERY_STATUSES.includes(order.status)),
// //     [deliveryOrders]
// //   );
// //   const readyToDispatch = useMemo(() => deliveryOrders.filter((order) => order.status === 'ready'), [deliveryOrders]);
// //   const onRoad = useMemo(() => deliveryOrders.filter((order) => order.status === 'out-for-delivery'), [deliveryOrders]);
// //   const deliveredOrders = useMemo(() => deliveryOrders.filter((order) => order.status === 'delivered'), [deliveryOrders]);
// //   const cancelledOrders = useMemo(() => deliveryOrders.filter((order) => order.status === 'cancelled'), [deliveryOrders]);
// //   const deliveryActivity = useMemo(() => {
// //     const events = [];

// //     orders.forEach((order) => {
// //       (order.statusHistory || []).forEach((entry, index) => {
// //         const normalizedNote = String(entry.note || '').toLowerCase();
// //         const type = entry.status === 'ready' && normalizedNote.includes('delivery cancelled by rider')
// //           ? 'returned'
// //           : normalizedNote.includes('eta updated')
// //             ? 'eta-updated'
// //             : entry.status;

// //         if (!['out-for-delivery', 'delivered', 'cancelled', 'returned', 'eta-updated'].includes(type)) return;
// //         events.push({
// //           id: `${order._id}-status-${index}`,
// //           type,
// //           orderId: order.orderId,
// //           customerName: order.customer?.name || 'Customer',
// //           note: entry.note || '',
// //           at: entry.updatedAt,
// //         });
// //       });

// //       (order.deliveryRejections || []).forEach((entry, index) => {
// //         events.push({
// //           id: `${order._id}-reject-${index}`,
// //           type: 'rejected',
// //           orderId: order.orderId,
// //           customerName: order.customer?.name || 'Customer',
// //           note: entry.reason || '',
// //           at: entry.rejectedAt,
// //         });
// //       });
// //     });

// //     return events.sort((a, b) => new Date(b.at) - new Date(a.at));
// //   }, [orders]);
// //   const paginatedDeliveryUsers = useMemo(() => deliveryUsers.slice((teamPage - 1) * PAGE_SIZE, teamPage * PAGE_SIZE), [deliveryUsers, teamPage]);
// //   const paginatedDeliveryOrders = useMemo(() => deliveryOrders.slice((queuePage - 1) * PAGE_SIZE, queuePage * PAGE_SIZE), [deliveryOrders, queuePage]);
// //   const paginatedDeliveryActivity = useMemo(() => deliveryActivity.slice((activityPage - 1) * PAGE_SIZE, activityPage * PAGE_SIZE), [deliveryActivity, activityPage]);

// //   return (
// //     <div className="flex min-h-screen bg-[#faf8f5]">
// //       <AdminSidebar />

// //       <main className="flex-1 p-6 lg:p-8 overflow-auto">
// //         <div className="mb-8">
// //           <h1 className="font-display text-3xl font-bold text-[#3f3328]">Delivery</h1>
// //           <p className="text-sm text-[#6b5f54] mt-1">Admin details for riders, active trips, and live delivery updates.</p>
// //         </div>

// //         <div className="grid grid-cols-2 xl:grid-cols-4 gap-5 mb-8">
// //           <StatCard icon={Bike} label="Delivery Team" value={deliveryUsers.length} tone="orange" />
// //           <StatCard icon={PackageCheck} label="Ready To Dispatch" value={readyToDispatch.length} tone="green" />
// //           <StatCard icon={Clock3} label="On The Road" value={onRoad.length} tone="blue" />
// //           <StatCard icon={MapPin} label="Tracked Orders" value={deliveryOrders.length} tone="amber" />
// //         </div>

// //         <div className="grid xl:grid-cols-[0.85fr,1.15fr] gap-6 mb-6">
// //           <section className="bg-white border border-[#e8e0d6] rounded-xl p-6">
// //             <div className="flex items-center justify-between mb-5">
// //               <h2 className="font-display text-xl font-bold text-[#3f3328]">Delivery Team</h2>
// //               <span className="text-sm text-[#6b5f54]">{deliveryUsers.filter((u) => u.isOnline).length} online</span>
// //             </div>

// //             <div className="space-y-4">
// //               {paginatedDeliveryUsers.map((user) => (
// //                 <div key={user._id} className="rounded-xl bg-[#faf8f5] border border-[#e8e0d6] p-4">
// //                   <div className="flex items-start justify-between gap-3 mb-2">
// //                     <div>
// //                       <p className="font-semibold text-[#3f3328]">{user.name}</p>
// //                       <p className="text-sm text-[#6b5f54] mt-1">{user.email || 'No email'}</p>
// //                     </div>
// //                     <span className={`text-sm font-semibold ${user.isOnline ? 'text-emerald-600' : 'text-red-500'}`}>
// //                       {user.isOnline ? 'Online' : 'Offline'}
// //                     </span>
// //                   </div>
// //                   <p className="text-sm text-[#6b5f54]">{user.phone || 'No phone'}</p>
// //                   {user.vehicleType ? <p className="text-xs text-[#a0968c] mt-2 capitalize">Vehicle: {user.vehicleType}</p> : null}
// //                   {user.lastSeen ? <p className="text-xs text-[#a0968c] mt-1">Last seen: {new Date(user.lastSeen).toLocaleString()}</p> : null}
// //                 </div>
// //               ))}

// //               {!deliveryUsers.length ? (
// //                 <div className="rounded-xl bg-[#faf8f5] border border-dashed border-[#e8e0d6] p-8 text-center text-[#a0968c]">
// //                   No delivery users yet.
// //                 </div>
// //               ) : null}
// //               <AdminPagination page={teamPage} totalPages={Math.max(1, Math.ceil(deliveryUsers.length / PAGE_SIZE))} totalItems={deliveryUsers.length} pageSize={PAGE_SIZE} label="delivery users" onPageChange={setTeamPage} />
// //             </div>
// //           </section>

// //           <section className="bg-white border border-[#e8e0d6] rounded-xl p-6">
// //             <div className="flex items-center justify-between mb-5">
// //               <h2 className="font-display text-xl font-bold text-[#3f3328]">Delivery Queue</h2>
// //               <span className="text-sm text-[#6b5f54]">{activeDeliveryOrders.length} live</span>
// //             </div>

// //             <div className="space-y-4">
// //               {paginatedDeliveryOrders.map((order) => (
// //                 <div key={order._id} className="rounded-xl border border-[#e8e0d6] p-4 bg-white">
// //                   <div className="flex items-start justify-between gap-3 mb-3">
// //                     <div>
// //                       <p className="text-xs font-semibold text-[#b97844] mb-1">{order.orderId}</p>
// //                       <p className="font-semibold text-[#3f3328]">{order.customer?.name || 'Customer'}</p>
// //                       <p className="text-sm text-[#6b5f54] mt-1">Rs. {order.totalAmount || 0}</p>
// //                     </div>
// //                     <span className={`inline-flex px-2 py-1 rounded-lg text-xs font-medium capitalize ${
// //                       order.status === 'out-for-delivery'
// //                         ? 'bg-indigo-100 text-indigo-700'
// //                         : order.status === 'ready'
// //                           ? 'bg-emerald-100 text-emerald-700'
// //                           : order.status === 'cancelled'
// //                             ? 'bg-red-100 text-red-700'
// //                             : 'bg-gray-100 text-gray-700'
// //                     }`}>
// //                       {order.status.replaceAll('-', ' ')}
// //                     </span>
// //                   </div>

// //                   <div className="space-y-2 text-sm text-[#6b5f54]">
// //                     <div className="flex items-start gap-2">
// //                       <Phone size={14} className="mt-0.5 text-[#a0968c]" />
// //                       <span>{order.customer?.phone || 'No phone'}</span>
// //                     </div>
// //                     <div className="flex items-start gap-2">
// //                       <MapPin size={14} className="mt-0.5 text-[#a0968c]" />
// //                       <span className="line-clamp-1">{order.deliveryAddress?.text || 'No delivery address'}</span>
// //                     </div>
// //                     <p>{order.items?.length || 0} items</p>
// //                     {order.cancelReason ? <p className="text-red-600">Cancel reason: {order.cancelReason}</p> : null}
// //                   </div>
// //                 </div>
// //               ))}

// //               {!deliveryOrders.length ? (
// //                 <div className="rounded-xl bg-[#faf8f5] border border-dashed border-[#e8e0d6] p-8 text-center text-[#a0968c]">
// //                   No delivery orders right now.
// //                 </div>
// //               ) : null}
// //               <AdminPagination page={queuePage} totalPages={Math.max(1, Math.ceil(deliveryOrders.length / PAGE_SIZE))} totalItems={deliveryOrders.length} pageSize={PAGE_SIZE} label="delivery orders" onPageChange={setQueuePage} />
// //             </div>
// //           </section>
// //         </div>

// //         <section className="bg-white border border-[#e8e0d6] rounded-xl p-6">
// //           <div className="flex items-center justify-between mb-5">
// //             <h2 className="font-display text-xl font-bold text-[#3f3328]">Recent Activity</h2>
// //             <span className="text-sm text-[#6b5f54]">{deliveryActivity.length} events</span>
// //           </div>

// //           <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
// //             {paginatedDeliveryActivity.map((item) => (
// //               <div key={item.id} className="rounded-xl border border-[#e8e0d6] p-4 bg-white">
// //                 <div className="flex items-center justify-between gap-3">
// //                   <p className="font-semibold text-[#3f3328]">#{item.orderId}</p>
// //                   <span className={`inline-flex px-2 py-1 rounded-lg text-xs font-medium capitalize ${
// //                     item.type === 'delivered'
// //                       ? 'bg-green-100 text-green-700'
// //                       : item.type === 'rejected' || item.type === 'cancelled'
// //                         ? 'bg-red-100 text-red-700'
// //                         : item.type === 'returned'
// //                           ? 'bg-amber-100 text-amber-700'
// //                           : 'bg-blue-100 text-blue-700'
// //                   }`}>
// //                     {item.type.replaceAll('-', ' ')}
// //                   </span>
// //                 </div>
// //                 <p className="text-sm text-[#6b5f54] mt-2">{item.customerName}</p>
// //                 {item.note ? <p className="text-sm text-[#6b5f54] mt-2">{item.note}</p> : null}
// //                 <p className="text-xs text-[#a0968c] mt-3">{new Date(item.at).toLocaleString()}</p>
// //               </div>
// //             ))}

// //             {!deliveryActivity.length ? (
// //               <div className="rounded-xl bg-[#faf8f5] border border-dashed border-[#e8e0d6] p-8 text-center text-[#a0968c] md:col-span-2 xl:col-span-3">
// //                 No rider activity logged yet.
// //               </div>
// //             ) : null}
// //           </div>
// //           <AdminPagination page={activityPage} totalPages={Math.max(1, Math.ceil(deliveryActivity.length / PAGE_SIZE))} totalItems={deliveryActivity.length} pageSize={PAGE_SIZE} label="activity events" onPageChange={setActivityPage} />
// //         </section>
// //       </main>
// //     </div>
// //   );
// // }


// import { useEffect, useMemo, useState } from 'react';
// import { useQuery, useQueryClient } from '@tanstack/react-query';
// import { Bike, MapPin, Phone, PackageCheck, Clock3, User, CheckCircle, XCircle, Truck } from 'lucide-react';
// import { io } from 'socket.io-client';
// import api from '../../services/api';
// import AdminSidebar from '../../components/admin/AdminSidebar';
// import AdminPagination from '../../components/admin/AdminPagination';

// const ACTIVE_DELIVERY_STATUSES = ['ready', 'out-for-delivery'];
// const ADMIN_VISIBLE_DELIVERY_STATUSES = ['ready', 'out-for-delivery', 'delivered', 'cancelled'];
// const PAGE_SIZE = 6;

// const STATUS_STYLES = {
//   ready: 'bg-emerald-100 text-emerald-700',
//   'out-for-delivery': 'bg-indigo-100 text-indigo-700',
//   delivered: 'bg-green-100 text-green-700',
//   cancelled: 'bg-red-100 text-red-700',
// };

// function StatCard({ icon: Icon, label, value, color }) {
//   const colors = {
//     orange: 'bg-amber-100 text-amber-700',
//     blue: 'bg-blue-100 text-blue-700',
//     green: 'bg-emerald-100 text-emerald-700',
//     purple: 'bg-purple-100 text-purple-700',
//   };

//   return (
//     <div className="bg-white border border-[#e8e0d6] rounded-xl p-5 hover:shadow-md transition-all">
//       <div className={`w-11 h-11 rounded-xl flex items-center justify-center mb-4 ${colors[color] || colors.orange}`}>
//         <Icon size={20} />
//       </div>
//       <p className="text-2xl font-bold text-[#3f3328]">{value}</p>
//       <p className="text-sm text-[#6b5f54] mt-1">{label}</p>
//     </div>
//   );
// }

// export default function AdminDeliveryPage() {
//   const [teamPage, setTeamPage] = useState(1);
//   const [queuePage, setQueuePage] = useState(1);
//   const [activityPage, setActivityPage] = useState(1);
//   const queryClient = useQueryClient();
//   const { data: users = [] } = useQuery({
//     queryKey: ['admin-users-delivery'],
//     queryFn: () => api.get('/admin/users').then((r) => r.data),
//     refetchInterval: 15000,
//   });

//   const { data: orderData } = useQuery({
//     queryKey: ['admin-delivery-orders'],
//     queryFn: () => api.get('/orders', { params: { limit: 100, orderType: 'delivery' } }).then((r) => r.data),
//     refetchInterval: 15000,
//   });

//   const orders = orderData?.orders || [];

//   useEffect(() => {
//     const socket = io(import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000');
//     const refreshAdminDelivery = () => {
//       queryClient.invalidateQueries({ queryKey: ['admin-delivery-orders'] });
//       queryClient.invalidateQueries({ queryKey: ['admin-users-delivery'] });
//     };

//     socket.on('connect', () => socket.emit('join-room', { room: 'admin-map' }));
//     socket.on('delivery-order-changed', refreshAdminDelivery);
//     socket.on('delivery-order-rejected', refreshAdminDelivery);
//     socket.on('agent-status', refreshAdminDelivery);
//     socket.on('agent-location', refreshAdminDelivery);
//     socket.on('order-updated', (payload) => {
//       if (!payload?.orderType || payload.orderType === 'delivery') refreshAdminDelivery();
//     });

//     return () => {
//       socket.emit('leave-room', { room: 'admin-map' });
//       socket.close();
//     };
//   }, [queryClient]);

//   const deliveryUsers = useMemo(() => users.filter((user) => user.role === 'delivery'), [users]);
//   const deliveryOrders = useMemo(
//     () => orders.filter((order) => ADMIN_VISIBLE_DELIVERY_STATUSES.includes(order.status)),
//     [orders]
//   );
//   const activeDeliveryOrders = useMemo(
//     () => deliveryOrders.filter((order) => ACTIVE_DELIVERY_STATUSES.includes(order.status)),
//     [deliveryOrders]
//   );
//   const readyToDispatch = useMemo(() => deliveryOrders.filter((order) => order.status === 'ready'), [deliveryOrders]);
//   const onRoad = useMemo(() => deliveryOrders.filter((order) => order.status === 'out-for-delivery'), [deliveryOrders]);
//   const deliveredOrders = useMemo(() => deliveryOrders.filter((order) => order.status === 'delivered'), [deliveryOrders]);
//   const cancelledOrders = useMemo(() => deliveryOrders.filter((order) => order.status === 'cancelled'), [deliveryOrders]);
  
//   const deliveryActivity = useMemo(() => {
//     const events = [];

//     orders.forEach((order) => {
//       (order.statusHistory || []).forEach((entry, index) => {
//         const normalizedNote = String(entry.note || '').toLowerCase();
//         const type = entry.status === 'ready' && normalizedNote.includes('delivery cancelled by rider')
//           ? 'returned'
//           : normalizedNote.includes('eta updated')
//             ? 'eta-updated'
//             : entry.status;

//         if (!['out-for-delivery', 'delivered', 'cancelled', 'returned', 'eta-updated'].includes(type)) return;
//         events.push({
//           id: `${order._id}-status-${index}`,
//           type,
//           orderId: order.orderId,
//           customerName: order.customer?.name || 'Customer',
//           note: entry.note || '',
//           at: entry.updatedAt,
//         });
//       });

//       (order.deliveryRejections || []).forEach((entry, index) => {
//         events.push({
//           id: `${order._id}-reject-${index}`,
//           type: 'rejected',
//           orderId: order.orderId,
//           customerName: order.customer?.name || 'Customer',
//           note: entry.reason || '',
//           at: entry.rejectedAt,
//         });
//       });
//     });

//     return events.sort((a, b) => new Date(b.at) - new Date(a.at));
//   }, [orders]);
  
//   const paginatedDeliveryUsers = useMemo(() => deliveryUsers.slice((teamPage - 1) * PAGE_SIZE, teamPage * PAGE_SIZE), [deliveryUsers, teamPage]);
//   const paginatedDeliveryOrders = useMemo(() => deliveryOrders.slice((queuePage - 1) * PAGE_SIZE, queuePage * PAGE_SIZE), [deliveryOrders, queuePage]);
//   const paginatedDeliveryActivity = useMemo(() => deliveryActivity.slice((activityPage - 1) * PAGE_SIZE, activityPage * PAGE_SIZE), [deliveryActivity, activityPage]);

//   const getStatusIcon = (status) => {
//     switch(status) {
//       case 'out-for-delivery': return <Truck size={12} />;
//       case 'delivered': return <CheckCircle size={12} />;
//       case 'cancelled': return <XCircle size={12} />;
//       default: return <PackageCheck size={12} />;
//     }
//   };

//   return (
//     <div className="flex min-h-screen bg-[#faf8f5]">
//       <AdminSidebar />

//       <main className="flex-1 p-6 lg:p-8 overflow-auto">
//         <div className="mb-6">
//           <h1 className="font-display text-3xl font-bold text-[#3f3328]">Delivery Management</h1>
//           <p className="text-sm text-[#6b5f54] mt-1">Manage delivery team, active trips, and order tracking</p>
//         </div>

//         {/* Stats Cards */}
//         <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-6">
//           <StatCard icon={Bike} label="Delivery Team" value={deliveryUsers.length} color="orange" />
//           <StatCard icon={PackageCheck} label="Ready to Dispatch" value={readyToDispatch.length} color="green" />
//           <StatCard icon={Truck} label="On The Road" value={onRoad.length} color="blue" />
//           <StatCard icon={MapPin} label="Tracked Orders" value={deliveryOrders.length} color="purple" />
//         </div>

//         {/* Two Column Layout */}
//         <div className="grid lg:grid-cols-2 gap-6 mb-6">
//           {/* Delivery Team Section */}
//           <div className="bg-white border border-[#e8e0d6] rounded-xl overflow-hidden">
//             <div className="px-5 py-4 border-b border-[#e8e0d6] bg-[#faf8f5]">
//               <div className="flex items-center justify-between">
//                 <h2 className="font-semibold text-lg text-[#3f3328] flex items-center gap-2">
//                   <Bike size={18} className="text-[#b97844]" /> Delivery Team
//                 </h2>
//                 <span className="text-sm text-[#6b5f54]">{deliveryUsers.filter(u => u.isOnline).length} online</span>
//               </div>
//             </div>
//             <div className="p-5 space-y-3">
//               {paginatedDeliveryUsers.map((user) => (
//                 <div key={user._id} className="bg-[#faf8f5] rounded-xl p-4 border border-[#e8e0d6] hover:shadow-sm transition-all">
//                   <div className="flex items-start justify-between">
//                     <div className="flex items-center gap-3">
//                       <div className="w-10 h-10 rounded-full bg-[#b97844]/10 flex items-center justify-center">
//                         <span className="text-sm font-bold text-[#b97844]">{user.name?.slice(0, 2).toUpperCase()}</span>
//                       </div>
//                       <div>
//                         <p className="font-semibold text-[#3f3328]">{user.name}</p>
//                         <p className="text-sm text-[#6b5f54]">{user.phone || 'No phone'}</p>
//                         {user.vehicleType && <p className="text-xs text-[#a0968c] mt-1 capitalize">Vehicle: {user.vehicleType}</p>}
//                       </div>
//                     </div>
//                     <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${user.isOnline ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
//                       {user.isOnline ? 'Online' : 'Offline'}
//                     </span>
//                   </div>
//                   {user.lastSeen && <p className="text-xs text-[#a0968c] mt-2">Last seen: {new Date(user.lastSeen).toLocaleString()}</p>}
//                 </div>
//               ))}
//               {!deliveryUsers.length && <div className="text-center text-[#a0968c] py-8">No delivery users yet</div>}
//               <AdminPagination page={teamPage} totalPages={Math.max(1, Math.ceil(deliveryUsers.length / PAGE_SIZE))} totalItems={deliveryUsers.length} pageSize={PAGE_SIZE} label="delivery users" onPageChange={setTeamPage} />
//             </div>
//           </div>

//           {/* Delivery Queue Section */}
//           <div className="bg-white border border-[#e8e0d6] rounded-xl overflow-hidden">
//             <div className="px-5 py-4 border-b border-[#e8e0d6] bg-[#faf8f5]">
//               <div className="flex items-center justify-between">
//                 <h2 className="font-semibold text-lg text-[#3f3328] flex items-center gap-2">
//                   <PackageCheck size={18} className="text-[#b97844]" /> Delivery Queue
//                 </h2>
//                 <span className="text-sm text-[#6b5f54]">{activeDeliveryOrders.length} live</span>
//               </div>
//             </div>
//             <div className="p-5 space-y-3">
//               {paginatedDeliveryOrders.map((order) => (
//                 <div key={order._id} className="bg-[#faf8f5] rounded-xl p-4 border border-[#e8e0d6] hover:shadow-sm transition-all">
//                   <div className="flex items-start justify-between mb-3">
//                     <div>
//                       <p className="font-mono text-sm font-semibold text-[#b97844]">{order.orderId}</p>
//                       <p className="font-medium text-[#3f3328] mt-1">{order.customer?.name || 'Customer'}</p>
//                       <p className="text-sm text-[#6b5f54]">₹{order.totalAmount || 0}</p>
//                     </div>
//                     <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium ${STATUS_STYLES[order.status] || 'bg-gray-100 text-gray-700'}`}>
//                       {getStatusIcon(order.status)} {order.status?.replace(/-/g, ' ')}
//                     </span>
//                   </div>
//                   <div className="space-y-2 text-sm">
//                     <div className="flex items-start gap-2">
//                       <Phone size={14} className="mt-0.5 text-[#a0968c]" />
//                       <span className="text-[#6b5f54]">{order.customer?.phone || 'No phone'}</span>
//                     </div>
//                     <div className="flex items-start gap-2">
//                       <MapPin size={14} className="mt-0.5 text-[#a0968c]" />
//                       <span className="text-[#6b5f54] line-clamp-1">{order.deliveryAddress?.text || 'No address'}</span>
//                     </div>
//                     <p className="text-[#6b5f54]">{order.items?.length || 0} items</p>
//                     {order.cancelReason && <p className="text-red-600 text-sm">Cancel reason: {order.cancelReason}</p>}
//                   </div>
//                 </div>
//               ))}
//               {!deliveryOrders.length && <div className="text-center text-[#a0968c] py-8">No delivery orders</div>}
//               <AdminPagination page={queuePage} totalPages={Math.max(1, Math.ceil(deliveryOrders.length / PAGE_SIZE))} totalItems={deliveryOrders.length} pageSize={PAGE_SIZE} label="delivery orders" onPageChange={setQueuePage} />
//             </div>
//           </div>
//         </div>

//         {/* Recent Activity Section */}
//         <div className="bg-white border border-[#e8e0d6] rounded-xl overflow-hidden">
//           <div className="px-5 py-4 border-b border-[#e8e0d6] bg-[#faf8f5]">
//             <div className="flex items-center justify-between">
//               <h2 className="font-semibold text-lg text-[#3f3328] flex items-center gap-2">
//                 <Clock3 size={18} className="text-[#b97844]" /> Recent Activity
//               </h2>
//               <span className="text-sm text-[#6b5f54]">{deliveryActivity.length} events</span>
//             </div>
//           </div>
//           <div className="p-5">
//             <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
//               {paginatedDeliveryActivity.map((item) => (
//                 <div key={item.id} className="bg-[#faf8f5] rounded-xl p-4 border border-[#e8e0d6] hover:shadow-sm transition-all">
//                   <div className="flex items-center justify-between mb-2">
//                     <p className="font-mono text-sm font-semibold text-[#b97844]">#{item.orderId}</p>
//                     <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-xs font-medium ${
//                       item.type === 'delivered' ? 'bg-green-100 text-green-700' :
//                       item.type === 'rejected' || item.type === 'cancelled' ? 'bg-red-100 text-red-700' :
//                       item.type === 'returned' ? 'bg-amber-100 text-amber-700' :
//                       'bg-blue-100 text-blue-700'
//                     }`}>
//                       {item.type.replaceAll('-', ' ')}
//                     </span>
//                   </div>
//                   <p className="text-sm text-[#6b5f54]">{item.customerName}</p>
//                   {item.note && <p className="text-sm text-[#6b5f54] mt-2 line-clamp-2">{item.note}</p>}
//                   <p className="text-xs text-[#a0968c] mt-2">{new Date(item.at).toLocaleString()}</p>
//                 </div>
//               ))}
//               {!deliveryActivity.length && <div className="col-span-3 text-center text-[#a0968c] py-8">No delivery activity yet</div>}
//             </div>
//             <AdminPagination page={activityPage} totalPages={Math.max(1, Math.ceil(deliveryActivity.length / PAGE_SIZE))} totalItems={deliveryActivity.length} pageSize={PAGE_SIZE} label="activity events" onPageChange={setActivityPage} />
//           </div>
//         </div>
//       </main>
//     </div>
//   );
// }

import { useEffect, useMemo, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Bike, MapPin, Phone, PackageCheck, Truck, CircleDot, X, CalendarDays, XCircle } from 'lucide-react';
import { io } from 'socket.io-client';
import api from '../../services/api';
import AdminSidebar from '../../components/admin/AdminSidebar';

const PAGE_SIZE = 10;
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

function Pagination({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  const getPageNumbers = () => {
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || (i >= currentPage - 1 && i <= currentPage + 1)) {
        pages.push(i);
      } else if (i === currentPage - 2 || i === currentPage + 2) {
        pages.push('...');
      }
    }
    return [...new Set(pages)];
  };

  return (
    <div className="flex justify-center items-center gap-2 py-4 border-t border-[#e8e0d6]">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-3 py-1.5 rounded-lg border border-[#e8e0d6] text-sm text-[#6b5f54] hover:border-[#b97844] hover:text-[#b97844] disabled:opacity-40 transition-all"
      >
        Previous
      </button>
      <div className="flex gap-1">
        {getPageNumbers().map((page, idx) => (
          page === '...' ? (
            <span key={`dots-${idx}`} className="px-2 text-[#a0968c]">...</span>
          ) : (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={`w-8 h-8 rounded-lg text-sm font-medium transition-all ${
                currentPage === page
                  ? 'bg-[#b97844] text-white'
                  : 'border border-[#e8e0d6] bg-white text-[#6b5f54] hover:border-[#b97844]'
              }`}
            >
              {page}
            </button>
          )
        ))}
      </div>
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-3 py-1.5 rounded-lg border border-[#e8e0d6] text-sm text-[#6b5f54] hover:border-[#b97844] hover:text-[#b97844] disabled:opacity-40 transition-all"
      >
        Next
      </button>
    </div>
  );
}

export default function AdminDeliveryPage() {
  const [activeTab, setActiveTab] = useState('team');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const queryClient = useQueryClient();

  const { data: users = [] } = useQuery({
    queryKey: ['admin-users-delivery'],
    queryFn: () => api.get('/admin/users').then((r) => r.data),
    refetchInterval: 15000,
  });
  const { data: onlineUsers = [] } = useQuery({
    queryKey: ['presence-online-users-delivery'],
    queryFn: () => api.get('/presence/online-users').then((r) => r.data),
    refetchInterval: 10000,
  });

  const { data: orderData } = useQuery({
    queryKey: ['admin-delivery-orders'],
    queryFn: () => api.get('/orders', { params: { limit: 500, orderType: 'delivery' } }).then((r) => r.data),
    refetchInterval: 15000,
  });

  useEffect(() => {
    const socket = io(import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000');
    const refresh = () => {
      queryClient.invalidateQueries({ queryKey: ['admin-delivery-orders'] });
      queryClient.invalidateQueries({ queryKey: ['admin-users-delivery'] });
    };
    socket.on('connect', () => socket.emit('join-room', { room: 'admin-map' }));
    socket.on('delivery-order-changed', refresh);
    socket.on('delivery-order-rejected', refresh);
    socket.on('agent-status', refresh);
    socket.on('agent-location', refresh);
    socket.on('order-updated', refresh);
    return () => {
      socket.emit('leave-room', { room: 'admin-map' });
      socket.close();
    };
  }, [queryClient]);

  const deliveryUsers = useMemo(() => {
    const onlineMap = new Map(
      onlineUsers.map((entry) => [
        String(entry.userId),
        {
          liveStatus: 'online',
          currentPanel: entry.panel || '',
          lastSeenLive: entry.lastSeen || null,
        },
      ]),
    );
    return users
      .filter((user) => user.role === 'delivery')
      .map((user) => {
        const presence = onlineMap.get(String(user._id));
        return {
          ...user,
          liveStatus: presence?.liveStatus || 'offline',
          currentPanel: presence?.currentPanel || '',
          lastSeenLive: presence?.lastSeenLive || null,
        };
      });
  }, [users, onlineUsers]);
  const getLatestDeliveryRejection = (order) => {
    if (!Array.isArray(order?.deliveryRejections) || order.deliveryRejections.length === 0) {
      return null;
    }
    return order.deliveryRejections[order.deliveryRejections.length - 1];
  };
  const orders = orderData?.orders || [];
  
  const readyOrders = useMemo(() => orders.filter((order) => order.status === 'ready' && !getLatestDeliveryRejection(order)?.reason), [orders]);
  const outForDelivery = useMemo(() => orders.filter((order) => order.status === 'out-for-delivery'), [orders]);
  const deliveredOrders = useMemo(() => orders.filter((order) => order.status === 'delivered'), [orders]);
  const cancelledOrders = useMemo(() => orders.filter((order) => order.status === 'cancelled'), [orders]);
  const rejectedOrders = useMemo(() => orders.filter((order) => getLatestDeliveryRejection(order)?.reason), [orders]);

  const getCurrentItems = () => {
    switch(activeTab) {
      case 'team': return deliveryUsers;
      case 'ready': return readyOrders;
      case 'out': return outForDelivery;
      case 'delivered': return deliveredOrders;
      case 'cancelled': return cancelledOrders;
      case 'rejected': return rejectedOrders;
      default: return [];
    }
  };

  const items = getCurrentItems();
  const totalPages = Math.ceil(items.length / PAGE_SIZE);
  const paginatedItems = items.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const getStatusBadge = (status) => {
    switch(status) {
      case 'ready': return { bg: 'bg-emerald-100', text: 'text-emerald-700', label: 'Ready' };
      case 'out-for-delivery': return { bg: 'bg-indigo-100', text: 'text-indigo-700', label: 'Out for Delivery' };
      case 'delivered': return { bg: 'bg-green-100', text: 'text-green-700', label: 'Completed' };
      case 'cancelled': return { bg: 'bg-red-100', text: 'text-red-700', label: 'Cancelled' };
      case 'preparing': return { bg: 'bg-amber-100', text: 'text-amber-700', label: 'Preparing Again' };
      default: return { bg: 'bg-gray-100', text: 'text-gray-700', label: status };
    }
  };

  return (
    <div className="flex min-h-screen bg-[#faf8f5]">
      <AdminSidebar />
      <main className="flex-1 p-6 overflow-auto">
        <div className="mb-6">
          <h1 className="font-display text-2xl font-bold text-[#3f3328]">Delivery Management</h1>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 gap-4 mb-6 lg:grid-cols-6">
          <div className="bg-white border border-[#e8e0d6] rounded-lg p-4">
            <p className="text-sm text-[#6b5f54]">Delivery Team</p>
            <p className="text-2xl font-bold text-[#3f3328]">{deliveryUsers.length}</p>
          </div>
          <div className="bg-white border border-[#e8e0d6] rounded-lg p-4">
            <p className="text-sm text-[#6b5f54]">Ready</p>
            <p className="text-2xl font-bold text-emerald-600">{readyOrders.length}</p>
          </div>
          <div className="bg-white border border-[#e8e0d6] rounded-lg p-4">
            <p className="text-sm text-[#6b5f54]">Out for Delivery</p>
            <p className="text-2xl font-bold text-indigo-600">{outForDelivery.length}</p>
          </div>
          <div className="bg-white border border-[#e8e0d6] rounded-lg p-4">
            <p className="text-sm text-[#6b5f54]">Delivered</p>
            <p className="text-2xl font-bold text-green-600">{deliveredOrders.length}</p>
          </div>
          <div className="bg-white border border-[#e8e0d6] rounded-lg p-4">
            <p className="text-sm text-[#6b5f54]">Cancelled</p>
            <p className="text-2xl font-bold text-red-600">{cancelledOrders.length}</p>
          </div>
          <div className="bg-white border border-[#e8e0d6] rounded-lg p-4">
            <p className="text-sm text-[#6b5f54]">Rejected</p>
            <p className="text-2xl font-bold text-amber-600">{rejectedOrders.length}</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-4 border-b border-[#e8e0d6] flex-wrap">
          <button onClick={() => { setActiveTab('team'); setCurrentPage(1); }} className={`px-4 py-2 text-sm font-medium transition-all ${activeTab === 'team' ? 'text-[#b97844] border-b-2 border-[#b97844]' : 'text-[#6b5f54]'}`}>Delivery Team ({deliveryUsers.length})</button>
          <button onClick={() => { setActiveTab('ready'); setCurrentPage(1); }} className={`px-4 py-2 text-sm font-medium transition-all ${activeTab === 'ready' ? 'text-[#b97844] border-b-2 border-[#b97844]' : 'text-[#6b5f54]'}`}>Ready ({readyOrders.length})</button>
          <button onClick={() => { setActiveTab('out'); setCurrentPage(1); }} className={`px-4 py-2 text-sm font-medium transition-all ${activeTab === 'out' ? 'text-[#b97844] border-b-2 border-[#b97844]' : 'text-[#6b5f54]'}`}>Out for Delivery ({outForDelivery.length})</button>
          <button onClick={() => { setActiveTab('delivered'); setCurrentPage(1); }} className={`px-4 py-2 text-sm font-medium transition-all ${activeTab === 'delivered' ? 'text-[#b97844] border-b-2 border-[#b97844]' : 'text-[#6b5f54]'}`}>Delivered ({deliveredOrders.length})</button>
          <button onClick={() => { setActiveTab('cancelled'); setCurrentPage(1); }} className={`px-4 py-2 text-sm font-medium transition-all ${activeTab === 'cancelled' ? 'text-[#b97844] border-b-2 border-[#b97844]' : 'text-[#6b5f54]'}`}>Cancelled ({cancelledOrders.length})</button>
          <button onClick={() => { setActiveTab('rejected'); setCurrentPage(1); }} className={`px-4 py-2 text-sm font-medium transition-all ${activeTab === 'rejected' ? 'text-[#b97844] border-b-2 border-[#b97844]' : 'text-[#6b5f54]'}`}>Rejected ({rejectedOrders.length})</button>
        </div>

        {/* Content Table */}
        <div className="bg-white border border-[#e8e0d6] rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-[#faf8f5] border-b border-[#e8e0d6]">
              <tr>
                <th className="px-4 py-3 text-left text-[#6b5f54] font-medium">
                  {activeTab === 'team' ? 'Name' : 'Order ID'}
                </th>
                <th className="px-4 py-3 text-left text-[#6b5f54] font-medium">
                  {activeTab === 'team' ? 'Contact' : 'Customer'}
                </th>
                <th className="px-4 py-3 text-left text-[#6b5f54] font-medium">
                  {activeTab === 'team' ? 'Vehicle' : 'Items'}
                </th>
                {activeTab !== 'team' && <th className="px-4 py-3 text-left text-[#6b5f54] font-medium">Payment</th>}
                <th className="px-4 py-3 text-left text-[#6b5f54] font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e8e0d6]">
              {activeTab === 'team' && paginatedItems.map((user) => (
                <tr key={user._id} className="hover:bg-[#faf8f5] transition-all">
                  <td className="px-4 py-3"><div className="flex items-center gap-2"><div className="w-7 h-7 rounded-full bg-[#b97844]/10 flex items-center justify-center"><span className="text-xs font-bold text-[#b97844]">{user.name?.slice(0, 2).toUpperCase()}</span></div><span className="font-medium text-[#3f3328]">{user.name}</span></div></td>
                  <td className="px-4 py-3 text-[#6b5f54]">{user.phone || '-'}</td>
                  <td className="px-4 py-3 text-[#6b5f54] capitalize">{user.vehicleType || '-'}</td>
                  <td className="px-4 py-3"><span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${user.liveStatus === 'online' ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-600'}`}><CircleDot size={10} /> {user.liveStatus === 'online' ? 'Online' : 'Offline'}</span></td>
                </tr>
              ))}
              {(activeTab === 'ready' || activeTab === 'out' || activeTab === 'delivered' || activeTab === 'cancelled' || activeTab === 'rejected') && paginatedItems.map((order) => {
                const rejection = getLatestDeliveryRejection(order);
                const statusStyle = activeTab === 'rejected'
                  ? { bg: 'bg-amber-100', text: 'text-amber-700', label: `Rejected -> ${formatOrderStatus(getStatusBadge(order.status).label)}` }
                  : getStatusBadge(order.status);
                return (
                  <tr key={order._id} onClick={() => setSelectedOrder(order)} className="cursor-pointer hover:bg-[#faf8f5] transition-all">
                    <td className="px-4 py-3 font-mono text-sm font-semibold text-[#b97844]">{order.orderId}</td>
                    <td className="px-4 py-3 font-medium text-[#3f3328]">{order.customer?.name || 'Guest'}</td>
                    <td className="px-4 py-3 text-[#6b5f54]">
                      <div className="space-y-1">
                        <p>{order.items?.length || 0}</p>
                        {rejection?.reason ? <p className="text-xs text-red-600 line-clamp-2">Rejected: {rejection.reason}</p> : null}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-[#6b5f54]">{formatPaymentMethod(order)} • {formatPaymentStatus(order)}</td>
                    <td className="px-4 py-3"><span className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium ${statusStyle.bg} ${statusStyle.text}`}>{formatOrderStatus(statusStyle.label)}</span></td>
                  </tr>
                );
              })}
              {paginatedItems.length === 0 && <tr><td colSpan={activeTab === 'team' ? 4 : 5} className="px-4 py-12 text-center text-[#a0968c]">No items found</td></tr>}
            </tbody>
          </table>
          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
        </div>

        {/* Order Detail Modal */}
        {selectedOrder && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={(e) => e.target === e.currentTarget && setSelectedOrder(null)}>
            <div className="w-full max-w-2xl max-h-[85vh] overflow-auto bg-white rounded-2xl shadow-2xl">
              <div className="sticky top-0 bg-white border-b border-[#e8e0d6] px-6 py-4 flex items-center justify-between">
                <div><p className="text-xs text-[#b97844] font-mono">{selectedOrder.orderId}</p><h2 className="font-display text-xl font-bold text-[#3f3328]">{selectedOrder.customer?.name || 'Guest'}</h2></div>
                <button onClick={() => setSelectedOrder(null)} className="p-2 rounded-lg hover:bg-[#faf8f5]"><X size={20} className="text-[#a0968c]" /></button>
              </div>
              <div className="p-6 space-y-5">
                {getLatestDeliveryRejection(selectedOrder)?.reason && (
                  <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2"><XCircle size={16} className="text-amber-600" /><p className="font-semibold text-amber-800">Latest Delivery Rejection</p></div>
                    <p className="text-sm text-amber-700">{getLatestDeliveryRejection(selectedOrder).reason}</p>
                  </div>
                )}
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-[#faf8f5] rounded-xl p-4"><Phone size={16} className="text-[#b97844] mb-2" /><p className="text-xs text-[#6b5f54]">Phone</p><p className="font-medium">{selectedOrder.customer?.phone || '-'}</p></div>
                  <div className="bg-[#faf8f5] rounded-xl p-4"><PackageCheck size={16} className="text-[#b97844] mb-2" /><p className="text-xs text-[#6b5f54]">Order Type</p><p className="font-medium capitalize">{selectedOrder.orderType}</p></div>
                  <div className="bg-[#faf8f5] rounded-xl p-4"><CalendarDays size={16} className="text-[#b97844] mb-2" /><p className="text-xs text-[#6b5f54]">Order Time</p><p className="font-medium">{new Date(selectedOrder.createdAt).toLocaleString()}</p></div>
                  <div className="bg-[#faf8f5] rounded-xl p-4"><MapPin size={16} className="text-[#b97844] mb-2" /><p className="text-xs text-[#6b5f54]">Delivery Address</p><p className="font-medium">{selectedOrder.deliveryAddress?.text || 'N/A'}</p></div>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-[#faf8f5] rounded-xl p-4">
                    <p className="text-xs text-[#6b5f54]">Payment Method</p>
                    <p className="mt-1 font-medium">{formatPaymentMethod(selectedOrder)}</p>
                    <p className="mt-2 text-xs text-[#a0968c]">Status: {formatPaymentStatus(selectedOrder)}</p>
                  </div>
                  <div className="bg-[#faf8f5] rounded-xl p-4">
                    <p className="text-xs text-[#6b5f54]">Payment Confirmed</p>
                    <p className="mt-1 font-medium">{selectedOrder.paidAt ? new Date(selectedOrder.paidAt).toLocaleString() : 'Waiting for payment'}</p>
                    {selectedOrder.delayedAt ? <p className="mt-2 text-xs text-red-600">Delayed at {new Date(selectedOrder.delayedAt).toLocaleString()}</p> : null}
                    {selectedOrder.paymentNote ? <p className="mt-2 text-xs text-[#6b5f54]">{selectedOrder.paymentNote}</p> : null}
                  </div>
                </div>
                {selectedOrder.cancelReason && (
                  <div className="bg-red-50 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2"><XCircle size={16} className="text-red-500" /><p className="font-semibold text-red-700">Cancellation Reason</p></div>
                    <p className="text-sm text-red-600">{selectedOrder.cancelReason}</p>
                  </div>
                )}
                {selectedOrder.deliveryAgent && (
                  <div className="bg-[#faf8f5] rounded-xl p-4">
                    <div className="flex items-center gap-3"><div className="w-8 h-8 rounded-full bg-[#b97844]/10 flex items-center justify-center"><Truck size={14} className="text-[#b97844]" /></div><div><p className="font-medium">{selectedOrder.deliveryAgent.name}</p><p className="text-xs text-[#6b5f54]">{selectedOrder.deliveryAgent.phone}</p></div></div>
                  </div>
                )}
                <div className="bg-[#faf8f5] rounded-xl p-4"><p className="font-semibold text-[#3f3328] mb-3">Order Items</p><div className="space-y-2">{selectedOrder.items?.map((item, idx) => (<div key={idx} className="flex justify-between items-center border-b border-[#e8e0d6] pb-2 last:border-0"><span className="text-[#6b5f54]">x{item.quantity} {item.name}</span><span className="font-medium">₹{item.totalPrice || item.unitPrice * item.quantity}</span></div>))}</div></div>
                {selectedOrder.specialNotes && <div className="bg-amber-50 rounded-xl p-4 text-sm text-amber-700">📝 {selectedOrder.specialNotes}</div>}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
