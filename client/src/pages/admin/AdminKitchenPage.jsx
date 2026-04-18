// // // import { useMemo, useState } from 'react';
// // // import { useQuery } from '@tanstack/react-query';
// // // import { ChefHat, Clock3, CheckCircle2, AlertTriangle } from 'lucide-react';
// // // import api from '../../services/api';
// // // import AdminSidebar from '../../components/admin/AdminSidebar';
// // // import AdminPagination from '../../components/admin/AdminPagination';

// // // const ACTIVE_KITCHEN_STATUSES = ['confirmed', 'preparing', 'ready'];
// // // const PAGE_SIZE = 6;

// // // function StatCard({ icon: Icon, label, value, tone }) {
// // //   const tones = {
// // //     red: 'bg-rose-100 text-rose-600',
// // //     amber: 'bg-amber-100 text-amber-700',
// // //     green: 'bg-emerald-100 text-emerald-700',
// // //     blue: 'bg-blue-100 text-blue-700',
// // //   };

// // //   return (
// // //     <div className="card p-5">
// // //       <div className={`w-11 h-11 rounded-2xl flex items-center justify-center mb-4 ${tones[tone] || tones.red}`}>
// // //         <Icon size={20} />
// // //       </div>
// // //       <p className="text-3xl font-display font-bold text-dark">{value}</p>
// // //       <p className="text-gray-500 text-sm mt-1">{label}</p>
// // //     </div>
// // //   );
// // // }

// // // export default function AdminKitchenPage() {
// // //   const [teamPage, setTeamPage] = useState(1);
// // //   const [queuePage, setQueuePage] = useState(1);
// // //   const [stockPage, setStockPage] = useState(1);
// // //   const { data: users = [] } = useQuery({
// // //     queryKey: ['admin-users-kitchen'],
// // //     queryFn: () => api.get('/admin/users').then((r) => r.data),
// // //     refetchInterval: 15000,
// // //   });

// // //   const { data: orderData } = useQuery({
// // //     queryKey: ['admin-kitchen-orders'],
// // //     queryFn: () => api.get('/orders', { params: { limit: 100 } }).then((r) => r.data),
// // //     refetchInterval: 15000,
// // //   });

// // //   const { data: inventory = [] } = useQuery({
// // //     queryKey: ['admin-kitchen-inventory'],
// // //     queryFn: () => api.get('/kitchen/inventory').then((r) => r.data).catch(() => []),
// // //     refetchInterval: 15000,
// // //   });

// // //   const orders = orderData?.orders || [];

// // //   const kitchenUsers = useMemo(() => users.filter((user) => user.role === 'kitchen'), [users]);
// // //   const kitchenOrders = useMemo(
// // //     () => orders.filter((order) => ACTIVE_KITCHEN_STATUSES.includes(order.status)),
// // //     [orders]
// // //   );
// // //   const readyOrders = useMemo(() => kitchenOrders.filter((order) => order.status === 'ready'), [kitchenOrders]);
// // //   const lowStock = useMemo(
// // //     () => inventory.filter((item) => item.currentStock <= item.minThreshold),
// // //     [inventory]
// // //   );
// // //   const paginatedKitchenUsers = useMemo(() => kitchenUsers.slice((teamPage - 1) * PAGE_SIZE, teamPage * PAGE_SIZE), [kitchenUsers, teamPage]);
// // //   const paginatedKitchenOrders = useMemo(() => kitchenOrders.slice((queuePage - 1) * PAGE_SIZE, queuePage * PAGE_SIZE), [kitchenOrders, queuePage]);
// // //   const paginatedLowStock = useMemo(() => lowStock.slice((stockPage - 1) * PAGE_SIZE, stockPage * PAGE_SIZE), [lowStock, stockPage]);

// // //   return (
// // //     <div className="flex min-h-screen bg-gray-50 font-body">
// // //       <AdminSidebar />

// // //       <main className="flex-1 p-8 overflow-auto">
// // //         <div className="mb-8">
// // //           <div>
// // //             <h1 className="font-display text-4xl font-bold text-dark">Kitchen</h1>
// // //             <p className="text-gray-500 mt-2">Admin details for kitchen team, active cooking queue, and inventory alerts.</p>
// // //           </div>
// // //         </div>

// // //         <div className="grid grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
// // //           <StatCard icon={ChefHat} label="Kitchen Team" value={kitchenUsers.length} tone="red" />
// // //           <StatCard icon={Clock3} label="Active Queue" value={kitchenOrders.length} tone="amber" />
// // //           <StatCard icon={CheckCircle2} label="Ready Orders" value={readyOrders.length} tone="green" />
// // //           <StatCard icon={AlertTriangle} label="Low Stock Alerts" value={lowStock.length} tone="blue" />
// // //         </div>

// // //         <div className="grid xl:grid-cols-[0.9fr,1.1fr] gap-6 mb-8">
// // //           <section className="card p-6">
// // //             <div className="flex items-center justify-between mb-5">
// // //               <h2 className="font-display text-2xl font-bold text-dark">Kitchen Team</h2>
// // //               <span className="text-sm text-gray-400">{kitchenUsers.filter((u) => u.isActive).length} active</span>
// // //             </div>

// // //             <div className="space-y-4">
// // //               {paginatedKitchenUsers.map((user) => (
// // //                 <div key={user._id} className="rounded-2xl bg-gray-50 border border-gray-100 p-4">
// // //                   <div className="flex items-start justify-between gap-3">
// // //                     <div>
// // //                       <p className="font-semibold text-dark">{user.name}</p>
// // //                       <p className="text-sm text-gray-500 mt-1">{user.email || user.phone || 'No contact'}</p>
// // //                     </div>
// // //                     <span className={`text-sm font-semibold ${user.isActive ? 'text-green-600' : 'text-red-500'}`}>
// // //                       {user.isActive ? 'Active' : 'Inactive'}
// // //                     </span>
// // //                   </div>
// // //                 </div>
// // //               ))}

// // //               {!kitchenUsers.length ? (
// // //                 <div className="rounded-2xl bg-gray-50 border border-dashed border-gray-200 p-8 text-center text-gray-400">
// // //                   No kitchen users yet.
// // //                 </div>
// // //               ) : null}
// // //               <AdminPagination page={teamPage} totalPages={Math.max(1, Math.ceil(kitchenUsers.length / PAGE_SIZE))} totalItems={kitchenUsers.length} pageSize={PAGE_SIZE} label="kitchen users" onPageChange={setTeamPage} />
// // //             </div>
// // //           </section>

// // //           <section className="card p-6">
// // //             <div className="flex items-center justify-between mb-5">
// // //               <h2 className="font-display text-2xl font-bold text-dark">Kitchen Queue</h2>
// // //               <span className="text-sm text-gray-400">{kitchenOrders.length} live orders</span>
// // //             </div>

// // //             <div className="space-y-4">
// // //               {paginatedKitchenOrders.map((order) => (
// // //                 <div key={order._id} className="rounded-2xl border border-gray-100 p-4 bg-white">
// // //                   <div className="flex items-start justify-between gap-3 mb-3">
// // //                     <div>
// // //                       <p className="text-xs font-semibold text-primary mb-1">{order.orderId}</p>
// // //                       <p className="font-semibold text-dark">{order.customer?.name || 'Customer'}</p>
// // //                       <p className="text-sm text-gray-500 mt-1">
// // //                         {(order.items || []).length} items · <span className="capitalize">{order.orderType}</span>
// // //                       </p>
// // //                     </div>
// // //                     <span className="badge capitalize badge-primary">{order.status}</span>
// // //                   </div>

// // //                   <div className="space-y-1 text-sm text-gray-600">
// // //                     {(order.items || []).slice(0, 3).map((item, index) => (
// // //                       <p key={`${order._id}-${index}`}>x{item.quantity} {item.name}</p>
// // //                     ))}
// // //                     {(order.items || []).length > 3 ? <p className="text-xs text-gray-400">+{order.items.length - 3} more items</p> : null}
// // //                   </div>
// // //                 </div>
// // //               ))}

// // //               {!kitchenOrders.length ? (
// // //                 <div className="rounded-2xl bg-gray-50 border border-dashed border-gray-200 p-8 text-center text-gray-400">
// // //                   No active kitchen orders right now.
// // //                 </div>
// // //               ) : null}
// // //               <AdminPagination page={queuePage} totalPages={Math.max(1, Math.ceil(kitchenOrders.length / PAGE_SIZE))} totalItems={kitchenOrders.length} pageSize={PAGE_SIZE} label="kitchen orders" onPageChange={setQueuePage} />
// // //             </div>
// // //           </section>
// // //         </div>

// // //         <section className="card p-6">
// // //           <div className="flex items-center justify-between mb-5">
// // //             <h2 className="font-display text-2xl font-bold text-dark">Inventory Alerts</h2>
// // //             <span className="text-sm text-gray-400">{inventory.length} tracked items</span>
// // //           </div>

// // //           <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
// // //             {paginatedLowStock.map((item) => (
// // //               <div key={item._id} className="rounded-2xl bg-red-50 border border-red-100 p-4">
// // //                 <p className="font-semibold text-dark">{item.name}</p>
// // //                 <p className="text-sm text-gray-500 mt-1">Current: {item.currentStock} {item.unit}</p>
// // //                 <p className="text-sm text-red-600 font-semibold mt-2">Minimum: {item.minThreshold} {item.unit}</p>
// // //               </div>
// // //             ))}

// // //             {!lowStock.length ? (
// // //               <div className="rounded-2xl bg-gray-50 border border-dashed border-gray-200 p-8 text-center text-gray-400 md:col-span-2 xl:col-span-3">
// // //                 No low-stock alerts right now.
// // //               </div>
// // //             ) : null}
// // //           </div>
// // //           <AdminPagination page={stockPage} totalPages={Math.max(1, Math.ceil(lowStock.length / PAGE_SIZE))} totalItems={lowStock.length} pageSize={PAGE_SIZE} label="inventory alerts" onPageChange={setStockPage} />
// // //         </section>
// // //       </main>
// // //     </div>
// // //   );
// // // }
// // import { useMemo, useState } from 'react';
// // import { useQuery } from '@tanstack/react-query';
// // import { ChefHat, Clock3, CheckCircle2, AlertTriangle } from 'lucide-react';
// // import api from '../../services/api';
// // import AdminSidebar from '../../components/admin/AdminSidebar';
// // import AdminPagination from '../../components/admin/AdminPagination';

// // const ACTIVE_KITCHEN_STATUSES = ['confirmed', 'preparing', 'ready'];
// // const PAGE_SIZE = 6;

// // function StatCard({ icon: Icon, label, value, tone }) {
// //   const tones = {
// //     red: 'bg-rose-100 text-rose-600',
// //     amber: 'bg-amber-100 text-amber-700',
// //     green: 'bg-emerald-100 text-emerald-700',
// //     blue: 'bg-blue-100 text-blue-700',
// //   };

// //   return (
// //     <div className="bg-white border border-[#e8e0d6] rounded-xl p-5">
// //       <div className={`w-11 h-11 rounded-xl flex items-center justify-center mb-4 ${tones[tone] || tones.red}`}>
// //         <Icon size={20} />
// //       </div>
// //       <p className="text-3xl font-bold text-[#3f3328]">{value}</p>
// //       <p className="text-sm text-[#6b5f54] mt-1">{label}</p>
// //     </div>
// //   );
// // }

// // export default function AdminKitchenPage() {
// //   const [teamPage, setTeamPage] = useState(1);
// //   const [queuePage, setQueuePage] = useState(1);
// //   const [stockPage, setStockPage] = useState(1);
// //   const { data: users = [] } = useQuery({
// //     queryKey: ['admin-users-kitchen'],
// //     queryFn: () => api.get('/admin/users').then((r) => r.data),
// //     refetchInterval: 15000,
// //   });

// //   const { data: orderData } = useQuery({
// //     queryKey: ['admin-kitchen-orders'],
// //     queryFn: () => api.get('/orders', { params: { limit: 100 } }).then((r) => r.data),
// //     refetchInterval: 15000,
// //   });

// //   const { data: inventory = [] } = useQuery({
// //     queryKey: ['admin-kitchen-inventory'],
// //     queryFn: () => api.get('/kitchen/inventory').then((r) => r.data).catch(() => []),
// //     refetchInterval: 15000,
// //   });

// //   const orders = orderData?.orders || [];

// //   const kitchenUsers = useMemo(() => users.filter((user) => user.role === 'kitchen'), [users]);
// //   const kitchenOrders = useMemo(
// //     () => orders.filter((order) => ACTIVE_KITCHEN_STATUSES.includes(order.status)),
// //     [orders]
// //   );
// //   const readyOrders = useMemo(() => kitchenOrders.filter((order) => order.status === 'ready'), [kitchenOrders]);
// //   const lowStock = useMemo(
// //     () => inventory.filter((item) => item.currentStock <= item.minThreshold),
// //     [inventory]
// //   );
// //   const paginatedKitchenUsers = useMemo(() => kitchenUsers.slice((teamPage - 1) * PAGE_SIZE, teamPage * PAGE_SIZE), [kitchenUsers, teamPage]);
// //   const paginatedKitchenOrders = useMemo(() => kitchenOrders.slice((queuePage - 1) * PAGE_SIZE, queuePage * PAGE_SIZE), [kitchenOrders, queuePage]);
// //   const paginatedLowStock = useMemo(() => lowStock.slice((stockPage - 1) * PAGE_SIZE, stockPage * PAGE_SIZE), [lowStock, stockPage]);

// //   return (
// //     <div className="flex min-h-screen bg-[#faf8f5]">
// //       <AdminSidebar />

// //       <main className="flex-1 p-6 lg:p-8 overflow-auto">
// //         <div className="mb-8">
// //           <h1 className="font-display text-3xl font-bold text-[#3f3328]">Kitchen</h1>
// //           <p className="text-sm text-[#6b5f54] mt-1">Admin details for kitchen team, active queue, and inventory alerts.</p>
// //         </div>

// //         <div className="grid grid-cols-2 xl:grid-cols-4 gap-5 mb-8">
// //           <StatCard icon={ChefHat} label="Kitchen Team" value={kitchenUsers.length} tone="red" />
// //           <StatCard icon={Clock3} label="Active Queue" value={kitchenOrders.length} tone="amber" />
// //           <StatCard icon={CheckCircle2} label="Ready Orders" value={readyOrders.length} tone="green" />
// //           <StatCard icon={AlertTriangle} label="Low Stock" value={lowStock.length} tone="blue" />
// //         </div>

// //         <div className="grid xl:grid-cols-[0.9fr,1.1fr] gap-6 mb-8">
// //           <section className="bg-white border border-[#e8e0d6] rounded-xl p-6">
// //             <div className="flex items-center justify-between mb-5">
// //               <h2 className="font-display text-xl font-bold text-[#3f3328]">Kitchen Team</h2>
// //               <span className="text-sm text-[#6b5f54]">{kitchenUsers.filter((u) => u.isActive).length} active</span>
// //             </div>

// //             <div className="space-y-4">
// //               {paginatedKitchenUsers.map((user) => (
// //                 <div key={user._id} className="rounded-xl bg-[#faf8f5] border border-[#e8e0d6] p-4">
// //                   <div className="flex items-start justify-between gap-3">
// //                     <div>
// //                       <p className="font-semibold text-[#3f3328]">{user.name}</p>
// //                       <p className="text-sm text-[#6b5f54] mt-1">{user.email || user.phone || 'No contact'}</p>
// //                     </div>
// //                     <span className={`text-sm font-semibold ${user.isActive ? 'text-emerald-600' : 'text-red-500'}`}>
// //                       {user.isActive ? 'Active' : 'Inactive'}
// //                     </span>
// //                   </div>
// //                 </div>
// //               ))}

// //               {!kitchenUsers.length ? (
// //                 <div className="rounded-xl bg-[#faf8f5] border border-dashed border-[#e8e0d6] p-8 text-center text-[#a0968c]">
// //                   No kitchen users yet.
// //                 </div>
// //               ) : null}
// //               <AdminPagination page={teamPage} totalPages={Math.max(1, Math.ceil(kitchenUsers.length / PAGE_SIZE))} totalItems={kitchenUsers.length} pageSize={PAGE_SIZE} label="kitchen users" onPageChange={setTeamPage} />
// //             </div>
// //           </section>

// //           <section className="bg-white border border-[#e8e0d6] rounded-xl p-6">
// //             <div className="flex items-center justify-between mb-5">
// //               <h2 className="font-display text-xl font-bold text-[#3f3328]">Kitchen Queue</h2>
// //               <span className="text-sm text-[#6b5f54]">{kitchenOrders.length} live orders</span>
// //             </div>

// //             <div className="space-y-4">
// //               {paginatedKitchenOrders.map((order) => (
// //                 <div key={order._id} className="rounded-xl border border-[#e8e0d6] p-4 bg-white">
// //                   <div className="flex items-start justify-between gap-3 mb-3">
// //                     <div>
// //                       <p className="text-xs font-semibold text-[#b97844] mb-1">{order.orderId}</p>
// //                       <p className="font-semibold text-[#3f3328]">{order.customer?.name || 'Customer'}</p>
// //                       <p className="text-sm text-[#6b5f54] mt-1">
// //                         {order.items?.length || 0} items • <span className="capitalize">{order.orderType}</span>
// //                       </p>
// //                     </div>
// //                     <span className="inline-flex px-2 py-1 rounded-lg text-xs font-medium capitalize bg-amber-100 text-amber-700">
// //                       {order.status}
// //                     </span>
// //                   </div>

// //                   <div className="space-y-1 text-sm text-[#6b5f54]">
// //                     {order.items?.slice(0, 3).map((item, index) => (
// //                       <p key={`${order._id}-${index}`}>x{item.quantity} {item.name}</p>
// //                     ))}
// //                     {order.items?.length > 3 ? <p className="text-xs text-[#a0968c]">+{order.items.length - 3} more</p> : null}
// //                   </div>
// //                 </div>
// //               ))}

// //               {!kitchenOrders.length ? (
// //                 <div className="rounded-xl bg-[#faf8f5] border border-dashed border-[#e8e0d6] p-8 text-center text-[#a0968c]">
// //                   No active kitchen orders.
// //                 </div>
// //               ) : null}
// //               <AdminPagination page={queuePage} totalPages={Math.max(1, Math.ceil(kitchenOrders.length / PAGE_SIZE))} totalItems={kitchenOrders.length} pageSize={PAGE_SIZE} label="kitchen orders" onPageChange={setQueuePage} />
// //             </div>
// //           </section>
// //         </div>

// //         <section className="bg-white border border-[#e8e0d6] rounded-xl p-6">
// //           <div className="flex items-center justify-between mb-5">
// //             <h2 className="font-display text-xl font-bold text-[#3f3328]">Inventory Alerts</h2>
// //             <span className="text-sm text-[#6b5f54]">{inventory.length} tracked items</span>
// //           </div>

// //           <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
// //             {paginatedLowStock.map((item) => (
// //               <div key={item._id} className="rounded-xl bg-red-50 border border-red-200 p-4">
// //                 <p className="font-semibold text-[#3f3328]">{item.name}</p>
// //                 <p className="text-sm text-[#6b5f54] mt-1">Current: {item.currentStock} {item.unit}</p>
// //                 <p className="text-sm text-red-600 font-semibold mt-2">Min: {item.minThreshold} {item.unit}</p>
// //               </div>
// //             ))}

// //             {!lowStock.length ? (
// //               <div className="rounded-xl bg-[#faf8f5] border border-dashed border-[#e8e0d6] p-8 text-center text-[#a0968c] md:col-span-2 xl:col-span-3">
// //                 No low-stock alerts.
// //               </div>
// //             ) : null}
// //           </div>
// //           <AdminPagination page={stockPage} totalPages={Math.max(1, Math.ceil(lowStock.length / PAGE_SIZE))} totalItems={lowStock.length} pageSize={PAGE_SIZE} label="inventory alerts" onPageChange={setStockPage} />
// //         </section>
// //       </main>
// //     </div>
// //   );
// // }

// import { useMemo, useState } from 'react';
// import { useQuery } from '@tanstack/react-query';
// import { ChefHat, Clock3, CheckCircle2, AlertTriangle, Package, Users, UtensilsCrossed, Flame } from 'lucide-react';
// import api from '../../services/api';
// import AdminSidebar from '../../components/admin/AdminSidebar';
// import AdminPagination from '../../components/admin/AdminPagination';

// const ACTIVE_KITCHEN_STATUSES = ['confirmed', 'preparing', 'ready'];
// const PAGE_SIZE = 6;

// const STATUS_STYLES = {
//   confirmed: 'bg-blue-100 text-blue-700',
//   preparing: 'bg-orange-100 text-orange-700',
//   ready: 'bg-emerald-100 text-emerald-700',
// };

// function StatCard({ icon: Icon, label, value, color }) {
//   const colors = {
//     red: 'bg-rose-100 text-rose-600',
//     amber: 'bg-amber-100 text-amber-700',
//     green: 'bg-emerald-100 text-emerald-700',
//     blue: 'bg-blue-100 text-blue-700',
//   };

//   return (
//     <div className="bg-white border border-[#e8e0d6] rounded-xl p-5 hover:shadow-md transition-all">
//       <div className={`w-11 h-11 rounded-xl flex items-center justify-center mb-4 ${colors[color] || colors.red}`}>
//         <Icon size={20} />
//       </div>
//       <p className="text-2xl font-bold text-[#3f3328]">{value}</p>
//       <p className="text-sm text-[#6b5f54] mt-1">{label}</p>
//     </div>
//   );
// }

// export default function AdminKitchenPage() {
//   const [teamPage, setTeamPage] = useState(1);
//   const [queuePage, setQueuePage] = useState(1);
//   const [stockPage, setStockPage] = useState(1);
  
//   const { data: users = [] } = useQuery({
//     queryKey: ['admin-users-kitchen'],
//     queryFn: () => api.get('/admin/users').then((r) => r.data),
//     refetchInterval: 15000,
//   });

//   const { data: orderData } = useQuery({
//     queryKey: ['admin-kitchen-orders'],
//     queryFn: () => api.get('/orders', { params: { limit: 100 } }).then((r) => r.data),
//     refetchInterval: 15000,
//   });

//   const { data: inventory = [] } = useQuery({
//     queryKey: ['admin-kitchen-inventory'],
//     queryFn: () => api.get('/kitchen/inventory').then((r) => r.data).catch(() => []),
//     refetchInterval: 15000,
//   });

//   const orders = orderData?.orders || [];

//   const kitchenUsers = useMemo(() => users.filter((user) => user.role === 'kitchen'), [users]);
//   const kitchenOrders = useMemo(
//     () => orders.filter((order) => ACTIVE_KITCHEN_STATUSES.includes(order.status)),
//     [orders]
//   );
//   const readyOrders = useMemo(() => kitchenOrders.filter((order) => order.status === 'ready'), [kitchenOrders]);
//   const preparingOrders = useMemo(() => kitchenOrders.filter((order) => order.status === 'preparing'), [kitchenOrders]);
//   const lowStock = useMemo(
//     () => inventory.filter((item) => item.currentStock <= item.minThreshold),
//     [inventory]
//   );
  
//   const paginatedKitchenUsers = useMemo(() => kitchenUsers.slice((teamPage - 1) * PAGE_SIZE, teamPage * PAGE_SIZE), [kitchenUsers, teamPage]);
//   const paginatedKitchenOrders = useMemo(() => kitchenOrders.slice((queuePage - 1) * PAGE_SIZE, queuePage * PAGE_SIZE), [kitchenOrders, queuePage]);
//   const paginatedLowStock = useMemo(() => lowStock.slice((stockPage - 1) * PAGE_SIZE, stockPage * PAGE_SIZE), [lowStock, stockPage]);

//   const getStatusIcon = (status) => {
//     switch(status) {
//       case 'confirmed': return <CheckCircle2 size={12} />;
//       case 'preparing': return <Flame size={12} />;
//       case 'ready': return <CheckCircle2 size={12} />;
//       default: return <Clock3 size={12} />;
//     }
//   };

//   return (
//     <div className="flex min-h-screen bg-[#faf8f5]">
//       <AdminSidebar />

//       <main className="flex-1 p-6 lg:p-8 overflow-auto">
//         <div className="mb-6">
//           <h1 className="font-display text-3xl font-bold text-[#3f3328]">Kitchen Management</h1>
//           <p className="text-sm text-[#6b5f54] mt-1">Manage kitchen team, order queue, and inventory alerts</p>
//         </div>

//         {/* Stats Cards */}
//         <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-6">
//           <StatCard icon={ChefHat} label="Kitchen Team" value={kitchenUsers.length} color="red" />
//           <StatCard icon={Flame} label="Preparing" value={preparingOrders.length} color="amber" />
//           <StatCard icon={CheckCircle2} label="Ready Orders" value={readyOrders.length} color="green" />
//           <StatCard icon={AlertTriangle} label="Low Stock" value={lowStock.length} color="blue" />
//         </div>

//         {/* Two Column Layout */}
//         <div className="grid lg:grid-cols-2 gap-6 mb-6">
//           {/* Kitchen Team Section */}
//           <div className="bg-white border border-[#e8e0d6] rounded-xl overflow-hidden">
//             <div className="px-5 py-4 border-b border-[#e8e0d6] bg-[#faf8f5]">
//               <div className="flex items-center justify-between">
//                 <h2 className="font-semibold text-lg text-[#3f3328] flex items-center gap-2">
//                   <Users size={18} className="text-[#b97844]" /> Kitchen Team
//                 </h2>
//                 <span className="text-sm text-[#6b5f54]">{kitchenUsers.filter(u => u.isActive).length} active</span>
//               </div>
//             </div>
//             <div className="p-5 space-y-3">
//               {paginatedKitchenUsers.map((user) => (
//                 <div key={user._id} className="bg-[#faf8f5] rounded-xl p-4 border border-[#e8e0d6] hover:shadow-sm transition-all">
//                   <div className="flex items-start justify-between">
//                     <div className="flex items-center gap-3">
//                       <div className="w-10 h-10 rounded-full bg-[#b97844]/10 flex items-center justify-center">
//                         <span className="text-sm font-bold text-[#b97844]">{user.name?.slice(0, 2).toUpperCase()}</span>
//                       </div>
//                       <div>
//                         <p className="font-semibold text-[#3f3328]">{user.name}</p>
//                         <p className="text-sm text-[#6b5f54]">{user.email || user.phone || 'No contact'}</p>
//                       </div>
//                     </div>
//                     <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${user.isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
//                       {user.isActive ? 'Active' : 'Inactive'}
//                     </span>
//                   </div>
//                 </div>
//               ))}
//               {!kitchenUsers.length && <div className="text-center text-[#a0968c] py-8">No kitchen users yet</div>}
//               <AdminPagination page={teamPage} totalPages={Math.max(1, Math.ceil(kitchenUsers.length / PAGE_SIZE))} totalItems={kitchenUsers.length} pageSize={PAGE_SIZE} label="kitchen users" onPageChange={setTeamPage} />
//             </div>
//           </div>

//           {/* Kitchen Queue Section */}
//           <div className="bg-white border border-[#e8e0d6] rounded-xl overflow-hidden">
//             <div className="px-5 py-4 border-b border-[#e8e0d6] bg-[#faf8f5]">
//               <div className="flex items-center justify-between">
//                 <h2 className="font-semibold text-lg text-[#3f3328] flex items-center gap-2">
//                   <UtensilsCrossed size={18} className="text-[#b97844]" /> Kitchen Queue
//                 </h2>
//                 <span className="text-sm text-[#6b5f54]">{kitchenOrders.length} live orders</span>
//               </div>
//             </div>
//             <div className="p-5 space-y-3">
//               {paginatedKitchenOrders.map((order) => (
//                 <div key={order._id} className="bg-[#faf8f5] rounded-xl p-4 border border-[#e8e0d6] hover:shadow-sm transition-all">
//                   <div className="flex items-start justify-between mb-3">
//                     <div>
//                       <p className="font-mono text-sm font-semibold text-[#b97844]">{order.orderId}</p>
//                       <p className="font-medium text-[#3f3328]">{order.customer?.name || 'Customer'}</p>
//                       <p className="text-sm text-[#6b5f54]">{order.items?.length || 0} items • <span className="capitalize">{order.orderType}</span></p>
//                     </div>
//                     <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium ${STATUS_STYLES[order.status] || 'bg-gray-100 text-gray-700'}`}>
//                       {getStatusIcon(order.status)} {order.status}
//                     </span>
//                   </div>
//                   <div className="space-y-1">
//                     {order.items?.slice(0, 3).map((item, idx) => (
//                       <p key={idx} className="text-sm text-[#6b5f54]">x{item.quantity} {item.name}</p>
//                     ))}
//                     {order.items?.length > 3 && <p className="text-xs text-[#a0968c]">+{order.items.length - 3} more items</p>}
//                   </div>
//                   {order.specialNotes && <p className="text-xs text-amber-600 mt-2 line-clamp-1">📝 {order.specialNotes}</p>}
//                 </div>
//               ))}
//               {!kitchenOrders.length && <div className="text-center text-[#a0968c] py-8">No active kitchen orders</div>}
//               <AdminPagination page={queuePage} totalPages={Math.max(1, Math.ceil(kitchenOrders.length / PAGE_SIZE))} totalItems={kitchenOrders.length} pageSize={PAGE_SIZE} label="kitchen orders" onPageChange={setQueuePage} />
//             </div>
//           </div>
//         </div>

//         {/* Inventory Alerts Section */}
//         <div className="bg-white border border-[#e8e0d6] rounded-xl overflow-hidden">
//           <div className="px-5 py-4 border-b border-[#e8e0d6] bg-[#faf8f5]">
//             <div className="flex items-center justify-between">
//               <h2 className="font-semibold text-lg text-[#3f3328] flex items-center gap-2">
//                 <Package size={18} className="text-[#b97844]" /> Inventory Alerts
//               </h2>
//               <span className="text-sm text-[#6b5f54]">{inventory.length} tracked items</span>
//             </div>
//           </div>
//           <div className="p-5">
//             <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
//               {paginatedLowStock.map((item) => (
//                 <div key={item._id} className="bg-red-50 rounded-xl p-4 border border-red-200 hover:shadow-sm transition-all">
//                   <div className="flex items-start justify-between">
//                     <div>
//                       <p className="font-semibold text-[#3f3328]">{item.name}</p>
//                       <p className="text-sm text-[#6b5f54] mt-1">Current: <span className="font-medium text-red-600">{item.currentStock} {item.unit}</span></p>
//                     </div>
//                     <AlertTriangle size={18} className="text-red-500" />
//                   </div>
//                   <p className="text-sm text-red-600 font-medium mt-2">Minimum: {item.minThreshold} {item.unit}</p>
//                 </div>
//               ))}
//               {!lowStock.length && <div className="col-span-3 text-center text-[#a0968c] py-8">No low-stock alerts</div>}
//             </div>
//             <AdminPagination page={stockPage} totalPages={Math.max(1, Math.ceil(lowStock.length / PAGE_SIZE))} totalItems={lowStock.length} pageSize={PAGE_SIZE} label="inventory alerts" onPageChange={setStockPage} />
//           </div>
//         </div>
//       </main>
//     </div>
//   );
// }

import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ChefHat, Clock3, CheckCircle2, Flame, CircleDot, Users, UtensilsCrossed, X, Phone, MapPin, Package, CalendarDays } from 'lucide-react';
import api from '../../services/api';
import AdminSidebar from '../../components/admin/AdminSidebar';

const PAGE_SIZE = 10;

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

export default function AdminKitchenPage() {
  const [activeTab, setActiveTab] = useState('queue');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const { data: users = [] } = useQuery({
    queryKey: ['admin-users-kitchen'],
    queryFn: () => api.get('/admin/users').then((r) => r.data),
    refetchInterval: 15000,
  });
  const { data: onlineUsers = [] } = useQuery({
    queryKey: ['presence-online-users-kitchen'],
    queryFn: () => api.get('/presence/online-users').then((r) => r.data),
    refetchInterval: 10000,
  });

  const { data: orderData } = useQuery({
    queryKey: ['admin-kitchen-orders'],
    queryFn: () => api.get('/orders', { params: { limit: 500 } }).then((r) => r.data),
    refetchInterval: 15000,
  });

  const kitchenUsers = useMemo(() => {
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
      .filter((user) => user.role === 'kitchen')
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
  const orders = orderData?.orders || [];
  
  const confirmedOrders = useMemo(() => orders.filter((order) => order.status === 'confirmed'), [orders]);
  const preparingOrders = useMemo(() => orders.filter((order) => order.status === 'preparing'), [orders]);
  const readyOrders = useMemo(() => orders.filter((order) => order.status === 'ready'), [orders]);

  const getFilteredOrders = () => {
    if (selectedStatus === 'confirmed') return confirmedOrders;
    if (selectedStatus === 'preparing') return preparingOrders;
    if (selectedStatus === 'ready') return readyOrders;
    return [...confirmedOrders, ...preparingOrders, ...readyOrders];
  };

  const allFilteredOrders = getFilteredOrders();
  const totalPages = Math.ceil(allFilteredOrders.length / PAGE_SIZE);
  const paginatedOrders = allFilteredOrders.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);
  const totalOrders = confirmedOrders.length + preparingOrders.length + readyOrders.length;

  const handleStatusChange = (status) => {
    setSelectedStatus(status);
    setCurrentPage(1);
  };

  const getStatusBadge = (status) => {
    switch(status) {
      case 'confirmed': return { bg: 'bg-blue-100', text: 'text-blue-700', label: 'Confirmed', icon: Clock3 };
      case 'preparing': return { bg: 'bg-orange-100', text: 'text-orange-700', label: 'Preparing', icon: Flame };
      case 'ready': return { bg: 'bg-emerald-100', text: 'text-emerald-700', label: 'Ready', icon: CheckCircle2 };
      default: return { bg: 'bg-gray-100', text: 'text-gray-700', label: status, icon: Clock3 };
    }
  };

  return (
    <div className="flex min-h-screen bg-[#faf8f5]">
      <AdminSidebar />
      <main className="flex-1 p-6 overflow-auto">
        <div className="mb-6">
          <h1 className="font-display text-2xl font-bold text-[#3f3328]">Kitchen Management</h1>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="bg-white border border-[#e8e0d6] rounded-lg p-4">
            <p className="text-sm text-[#6b5f54]">Kitchen Team</p>
            <p className="text-2xl font-bold text-[#3f3328]">{kitchenUsers.length}</p>
          </div>
          <div className="bg-white border border-[#e8e0d6] rounded-lg p-4">
            <p className="text-sm text-[#6b5f54]">Confirmed</p>
            <p className="text-2xl font-bold text-blue-600">{confirmedOrders.length}</p>
          </div>
          <div className="bg-white border border-[#e8e0d6] rounded-lg p-4">
            <p className="text-sm text-[#6b5f54]">Preparing</p>
            <p className="text-2xl font-bold text-orange-600">{preparingOrders.length}</p>
          </div>
          <div className="bg-white border border-[#e8e0d6] rounded-lg p-4">
            <p className="text-sm text-[#6b5f54]">Ready</p>
            <p className="text-2xl font-bold text-emerald-600">{readyOrders.length}</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-4 border-b border-[#e8e0d6]">
          <button
            onClick={() => { setActiveTab('queue'); setCurrentPage(1); }}
            className={`px-4 py-2 text-sm font-medium transition-all ${activeTab === 'queue' ? 'text-[#b97844] border-b-2 border-[#b97844]' : 'text-[#6b5f54]'}`}
          >
            Order Queue ({totalOrders})
          </button>
          <button
            onClick={() => { setActiveTab('team'); setCurrentPage(1); }}
            className={`px-4 py-2 text-sm font-medium transition-all ${activeTab === 'team' ? 'text-[#b97844] border-b-2 border-[#b97844]' : 'text-[#6b5f54]'}`}
          >
            Kitchen Team ({kitchenUsers.length})
          </button>
        </div>

        {/* Order Queue Tab */}
        {activeTab === 'queue' && (
          <>
            {/* Status Filters */}
            <div className="flex gap-2 mb-4">
              <button
                onClick={() => handleStatusChange('all')}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${selectedStatus === 'all' ? 'bg-[#b97844] text-white' : 'bg-white border border-[#e8e0d6] text-[#6b5f54]'}`}
              >
                All ({totalOrders})
              </button>
              <button
                onClick={() => handleStatusChange('confirmed')}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${selectedStatus === 'confirmed' ? 'bg-blue-500 text-white' : 'bg-white border border-[#e8e0d6] text-blue-600'}`}
              >
                Confirmed ({confirmedOrders.length})
              </button>
              <button
                onClick={() => handleStatusChange('preparing')}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${selectedStatus === 'preparing' ? 'bg-orange-500 text-white' : 'bg-white border border-[#e8e0d6] text-orange-600'}`}
              >
                Preparing ({preparingOrders.length})
              </button>
              <button
                onClick={() => handleStatusChange('ready')}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${selectedStatus === 'ready' ? 'bg-emerald-500 text-white' : 'bg-white border border-[#e8e0d6] text-emerald-600'}`}
              >
                Ready ({readyOrders.length})
              </button>
            </div>

            {/* Orders Table - Clean like Customer Management */}
            <div className="bg-white border border-[#e8e0d6] rounded-lg overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-[#faf8f5] border-b border-[#e8e0d6]">
                  <tr>
                    <th className="px-4 py-3 text-left text-[#6b5f54] font-medium">Order ID</th>
                    <th className="px-4 py-3 text-left text-[#6b5f54] font-medium">Customer</th>
                    <th className="px-4 py-3 text-left text-[#6b5f54] font-medium">Type</th>
                    <th className="px-4 py-3 text-left text-[#6b5f54] font-medium">Items</th>
                    <th className="px-4 py-3 text-left text-[#6b5f54] font-medium">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#e8e0d6]">
                  {paginatedOrders.map((order) => {
                    const statusStyle = getStatusBadge(order.status);
                    const StatusIcon = statusStyle.icon;
                    return (
                      <tr key={order._id} onClick={() => setSelectedOrder(order)} className="cursor-pointer hover:bg-[#faf8f5] transition-all">
                        <td className="px-4 py-3 font-mono text-sm font-semibold text-[#b97844]">{order.orderId}</td>
                        <td className="px-4 py-3 font-medium text-[#3f3328]">{order.customer?.name || 'Guest'}</td>
                        <td className="px-4 py-3 text-[#6b5f54] capitalize">{order.orderType}</td>
                        <td className="px-4 py-3 text-[#6b5f54]">{order.items?.length || 0}</td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium ${statusStyle.bg} ${statusStyle.text}`}>
                            <StatusIcon size={10} /> {statusStyle.label}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                  {paginatedOrders.length === 0 && (
                    <tr>
                      <td colSpan="5" className="px-4 py-12 text-center text-[#a0968c]">No orders found</td>
                    </tr>
                  )}
                </tbody>
              </table>
              <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
            </div>
          </>
        )}

        {/* Kitchen Team Tab */}
        {activeTab === 'team' && (
          <div className="bg-white border border-[#e8e0d6] rounded-lg overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-[#faf8f5] border-b border-[#e8e0d6]">
                <tr>
                  <th className="px-4 py-3 text-left text-[#6b5f54] font-medium">Name</th>
                  <th className="px-4 py-3 text-left text-[#6b5f54] font-medium">Email/Phone</th>
                  <th className="px-4 py-3 text-left text-[#6b5f54] font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e8e0d6]">
                {kitchenUsers.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE).map((user) => (
                  <tr key={user._id} className="hover:bg-[#faf8f5] transition-all">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-[#b97844]/10 flex items-center justify-center">
                          <span className="text-xs font-bold text-[#b97844]">{user.name?.slice(0, 2).toUpperCase()}</span>
                        </div>
                        <span className="font-medium text-[#3f3328]">{user.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-[#6b5f54]">{user.email || user.phone || '-'}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${user.liveStatus === 'online' ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-600'}`}>
                        <CircleDot size={10} /> {user.liveStatus === 'online' ? 'Online' : 'Offline'}
                      </span>
                    </td>
                  </tr>
                ))}
                {kitchenUsers.length === 0 && (
                  <tr><td colSpan="3" className="px-4 py-12 text-center text-[#a0968c]">No kitchen team members</td></tr>
                )}
              </tbody>
            </table>
            <Pagination currentPage={currentPage} totalPages={Math.ceil(kitchenUsers.length / PAGE_SIZE)} onPageChange={setCurrentPage} />
          </div>
        )}

        {/* Order Detail Modal - Like Customer Management */}
        {selectedOrder && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={(e) => e.target === e.currentTarget && setSelectedOrder(null)}>
            <div className="w-full max-w-2xl max-h-[85vh] overflow-auto bg-white rounded-2xl shadow-2xl">
              <div className="sticky top-0 bg-white border-b border-[#e8e0d6] px-6 py-4 flex items-center justify-between">
                <div>
                  <p className="text-xs text-[#b97844] font-mono">{selectedOrder.orderId}</p>
                  <h2 className="font-display text-xl font-bold text-[#3f3328]">{selectedOrder.customer?.name || 'Guest'}</h2>
                </div>
                <button onClick={() => setSelectedOrder(null)} className="p-2 rounded-lg hover:bg-[#faf8f5]"><X size={20} className="text-[#a0968c]" /></button>
              </div>
              <div className="p-6 space-y-5">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-[#faf8f5] rounded-xl p-4"><Phone size={16} className="text-[#b97844] mb-2" /><p className="text-xs text-[#6b5f54]">Phone</p><p className="font-medium">{selectedOrder.customer?.phone || '-'}</p></div>
                  <div className="bg-[#faf8f5] rounded-xl p-4"><Package size={16} className="text-[#b97844] mb-2" /><p className="text-xs text-[#6b5f54]">Order Type</p><p className="font-medium capitalize">{selectedOrder.orderType}</p></div>
                  <div className="bg-[#faf8f5] rounded-xl p-4"><CalendarDays size={16} className="text-[#b97844] mb-2" /><p className="text-xs text-[#6b5f54]">Order Time</p><p className="font-medium">{new Date(selectedOrder.createdAt).toLocaleString()}</p></div>
                  <div className="bg-[#faf8f5] rounded-xl p-4"><MapPin size={16} className="text-[#b97844] mb-2" /><p className="text-xs text-[#6b5f54]">Delivery Address</p><p className="font-medium">{selectedOrder.deliveryAddress?.text || 'N/A'}</p></div>
                </div>
                <div className="bg-[#faf8f5] rounded-xl p-4">
                  <p className="font-semibold text-[#3f3328] mb-3">Order Items</p>
                  <div className="space-y-2">
                    {selectedOrder.items?.map((item, idx) => (
                      <div key={idx} className="flex justify-between items-center border-b border-[#e8e0d6] pb-2 last:border-0">
                        <span className="text-[#6b5f54]">x{item.quantity} {item.name}</span>
                        <span className="font-medium">₹{item.totalPrice || item.unitPrice * item.quantity}</span>
                      </div>
                    ))}
                  </div>
                </div>
                {selectedOrder.specialNotes && (
                  <div className="bg-amber-50 rounded-xl p-4 text-sm text-amber-700">📝 {selectedOrder.specialNotes}</div>
                )}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
