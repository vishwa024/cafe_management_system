// import { Link } from 'react-router-dom';
// import { useEffect } from 'react';
// import { useQuery, useQueryClient } from '@tanstack/react-query';
// import { io } from 'socket.io-client';
// import {
//   BellRing,
//   Bike,
//   ChefHat,
//   Settings2,
//   ShieldCheck,
//   ShoppingBag,
//   Briefcase,
//   Users,
//   UtensilsCrossed,
// } from 'lucide-react';
// import api from '../../services/api';
// import AdminSidebar from '../../components/admin/AdminSidebar';

// export default function Settings() {
//   const queryClient = useQueryClient();
//   const { data } = useQuery({
//     queryKey: ['admin-settings-overview'],
//     queryFn: () => api.get('/admin/dashboard').then((r) => r.data),
//     refetchInterval: 20000,
//   });

//   useEffect(() => {
//     const socket = io(import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000');
//     const refreshSettings = () => {
//       queryClient.invalidateQueries({ queryKey: ['admin-settings-overview'] });
//     };

//     socket.on('connect', () => socket.emit('join-room', { room: 'admin-map' }));
//     socket.on('delivery-order-changed', refreshSettings);
//     socket.on('delivery-order-rejected', refreshSettings);
//     socket.on('agent-status', refreshSettings);
//     socket.on('agent-location', refreshSettings);
//     socket.on('order-updated', refreshSettings);

//     return () => {
//       socket.emit('leave-room', { room: 'admin-map' });
//       socket.close();
//     };
//   }, [queryClient]);

//   const overview = data?.overview || {};
//   const usersByRole = data?.usersByRole || {};
//   const recentDeliveries = data?.recentDeliveries || [];

//   const cards = [
//     {
//       icon: Users,
//       title: 'User Access',
//       copy: `${overview.activeUsers || 0} active users across all roles`,
//       to: '/admin/users',
//       tone: 'bg-blue-100 text-blue-700',
//     },
//     {
//       icon: UtensilsCrossed,
//       title: 'Menu Availability',
//       copy: `${overview.availableMenuItems || 0} items currently orderable`,
//       to: '/admin/menu',
//       tone: 'bg-emerald-100 text-emerald-700',
//     },
//     {
//       icon: ShoppingBag,
//       title: 'Order Pipeline',
//       copy: `${overview.activeOrders || 0} active orders moving through panels`,
//       to: '/admin/orders',
//       tone: 'bg-amber-100 text-amber-700',
//     },
//     {
//       icon: BellRing,
//       title: 'Reports',
//       copy: 'Live revenue and panel activity reporting',
//       to: '/admin/reports',
//       tone: 'bg-primary/10 text-primary',
//     },
//   ];

//   return (
//     <div className="flex min-h-screen bg-gray-50 font-body">
//       <AdminSidebar />
//       <main className="flex-1 p-8 overflow-auto">
//         <div className="mb-8">
//           <h1 className="font-display text-3xl font-bold text-dark">Settings</h1>
//           <p className="text-gray-500 mt-1">Operational control center for the admin, customer, staff, kitchen, and delivery experience.</p>
//         </div>

//         <div className="grid lg:grid-cols-[1.1fr,0.9fr] gap-6 mb-8">
//           <section className="rounded-[1.8rem] bg-[#171312] text-white p-7 relative overflow-hidden">
//             <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(255,145,77,0.35),_transparent_24%),radial-gradient(circle_at_bottom_left,_rgba(255,255,255,0.08),_transparent_30%)]" />
//             <div className="relative">
//               <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-[11px] uppercase tracking-[0.24em] text-orange-100 font-semibold">
//                 <Settings2 size={13} />
//                 Live Control Center
//               </div>
//               <h2 className="font-display text-4xl font-bold mt-5 leading-tight">Panel health across your three work parts.</h2>
//               <p className="mt-4 text-white/70 max-w-2xl leading-relaxed">
//                 Customer, staff, and admin now read the same real order pipeline, so this page acts like a live settings overview rather than a dead placeholder.
//               </p>
//               <div className="grid sm:grid-cols-3 gap-4 mt-8">
//                 <div className="rounded-2xl bg-white/10 border border-white/10 p-4">
//                   <p className="text-white/60 text-sm">Kitchen Active</p>
//                   <p className="font-display text-3xl font-bold mt-1">{overview.kitchenActive || 0}</p>
//                 </div>
//                 <div className="rounded-2xl bg-white/10 border border-white/10 p-4">
//                   <p className="text-white/60 text-sm">Delivery Online</p>
//                   <p className="font-display text-3xl font-bold mt-1">{overview.onlineDeliveryAgents || 0}</p>
//                 </div>
//                 <div className="rounded-2xl bg-white/10 border border-white/10 p-4">
//                   <p className="text-white/60 text-sm">Ready Orders</p>
//                   <p className="font-display text-3xl font-bold mt-1">{overview.readyForHandoff || 0}</p>
//                 </div>
//               </div>
//             </div>
//           </section>

//           <section className="card p-6">
//             <p className="section-subtitle mb-2">Role Visibility</p>
//             <h2 className="font-display text-3xl font-bold text-dark mb-5">Access Snapshot</h2>
//             <div className="space-y-4">
//               {[
//                 { key: 'customer', label: 'Customers', icon: Users, tone: 'bg-blue-100 text-blue-700' },
//                 { key: 'manager', label: 'Managers', icon: Briefcase, tone: 'bg-violet-100 text-violet-700' },
//                 { key: 'staff', label: 'Staff', icon: ShoppingBag, tone: 'bg-amber-100 text-amber-700' },
//                 { key: 'kitchen', label: 'Kitchen', icon: ChefHat, tone: 'bg-emerald-100 text-emerald-700' },
//                 { key: 'delivery', label: 'Delivery', icon: Bike, tone: 'bg-orange-100 text-orange-700' },
//                 { key: 'admin', label: 'Admins', icon: ShieldCheck, tone: 'bg-primary/10 text-primary' },
//               ].map((row) => {
//                 const Icon = row.icon;
//                 return (
//                   <div key={row.key} className="rounded-2xl bg-gray-50 border border-gray-100 px-4 py-4 flex items-center justify-between">
//                     <div className="flex items-center gap-3">
//                       <div className={`w-11 h-11 rounded-2xl flex items-center justify-center ${row.tone}`}>
//                         <Icon size={18} />
//                       </div>
//                       <p className="font-semibold text-dark">{row.label}</p>
//                     </div>
//                     <span className="font-display text-2xl font-bold text-dark">{usersByRole[row.key] || 0}</span>
//                   </div>
//                 );
//               })}
//             </div>
//           </section>
//         </div>

//         <div className="grid lg:grid-cols-[1fr,0.9fr] gap-6 mb-8">
//           <section className="grid md:grid-cols-2 xl:grid-cols-4 gap-5">
//             {cards.map((card) => {
//               const Icon = card.icon;
//               return (
//                 <Link key={card.title} to={card.to} className="card p-6 hover:shadow-card-hover transition-all">
//                   <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${card.tone}`}>
//                     <Icon size={20} />
//                   </div>
//                   <h3 className="font-display text-2xl font-bold text-dark mt-5">{card.title}</h3>
//                   <p className="text-sm text-gray-500 mt-2 leading-relaxed">{card.copy}</p>
//                   <p className="text-sm font-semibold text-primary mt-4">Open panel</p>
//                 </Link>
//               );
//             })}
//           </section>

//           <section className="card p-6">
//             <p className="section-subtitle mb-2">Delivery Visibility</p>
//             <h2 className="font-display text-3xl font-bold text-dark mb-5">Recent Delivery Records</h2>
//             <div className="space-y-4">
//               {recentDeliveries.map((delivery) => (
//                 <div key={delivery._id} className="rounded-2xl bg-gray-50 border border-gray-100 px-4 py-4">
//                   <div className="flex items-center justify-between gap-3">
//                     <div>
//                       <p className="font-semibold text-dark">{delivery.orderId}</p>
//                       <p className="text-xs text-gray-500 mt-1">{delivery.customer?.name || 'Customer'}</p>
//                     </div>
//                     <span className={`badge ${delivery.status === 'delivered' ? 'badge-success' : delivery.status === 'out-for-delivery' ? 'badge-info' : 'badge-primary'}`}>
//                       {delivery.status}
//                     </span>
//                   </div>
//                   <p className="text-sm text-gray-500 mt-2">Agent: {delivery.deliveryAgent?.name || 'Unassigned'}</p>
//                   <p className="text-sm text-gray-500 mt-1 truncate">{delivery.deliveryAddress?.text || 'No address provided'}</p>
//                 </div>
//               ))}
//               {!recentDeliveries.length ? <p className="text-sm text-gray-400">No delivery records yet.</p> : null}
//             </div>
//           </section>
//         </div>
//       </main>
//     </div>
//   );
// }
import { Link } from 'react-router-dom';
import { useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { io } from 'socket.io-client';
import {
  BellRing,
  Bike,
  ChefHat,
  Settings2,
  ShieldCheck,
  ShoppingBag,
  Briefcase,
  Users,
  UtensilsCrossed,
  Truck,
  Clock3,
} from 'lucide-react';
import api from '../../services/api';
import AdminSidebar from '../../components/admin/AdminSidebar';

export default function Settings() {
  const queryClient = useQueryClient();
  const { data } = useQuery({
    queryKey: ['admin-settings-overview'],
    queryFn: () => api.get('/admin/dashboard').then((r) => r.data),
    refetchInterval: 20000,
  });

  useEffect(() => {
    const socket = io(import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000');
    const refreshSettings = () => queryClient.invalidateQueries({ queryKey: ['admin-settings-overview'] });
    socket.on('connect', () => socket.emit('join-room', { room: 'admin-map' }));
    socket.on('delivery-order-changed', refreshSettings);
    socket.on('delivery-order-rejected', refreshSettings);
    socket.on('agent-status', refreshSettings);
    socket.on('agent-location', refreshSettings);
    socket.on('order-updated', refreshSettings);
    return () => { socket.emit('leave-room', { room: 'admin-map' }); socket.close(); };
  }, [queryClient]);

  const overview = data?.overview || {};
  const usersByRole = data?.usersByRole || {};
  const recentDeliveries = data?.recentDeliveries || [];

  const cards = [
    { icon: Users, title: 'User Access', copy: `${overview.activeUsers || 0} active users across all roles`, to: '/admin/users', tone: 'bg-blue-100 text-blue-700' },
    { icon: UtensilsCrossed, title: 'Menu Availability', copy: `${overview.availableMenuItems || 0} items available`, to: '/admin/menu', tone: 'bg-emerald-100 text-emerald-700' },
    { icon: ShoppingBag, title: 'Order Pipeline', copy: `${overview.activeOrders || 0} active orders`, to: '/admin/orders', tone: 'bg-amber-100 text-amber-700' },
    { icon: BellRing, title: 'Reports', copy: 'Live revenue and activity reporting', to: '/admin/reports', tone: 'bg-[#b97844]/10 text-[#b97844]' },
  ];

  return (
    <div className="flex min-h-screen bg-[#faf8f5]">
      <AdminSidebar />
      <main className="flex-1 p-6 lg:p-8 overflow-auto">
        <div className="mb-6">
          <h1 className="font-display text-3xl font-bold text-[#3f3328]">Settings</h1>
          <p className="text-sm text-[#6b5f54] mt-1">Operational control center for your cafe</p>
        </div>

        <div className="grid lg:grid-cols-[1.1fr,0.9fr] gap-6 mb-8">
          {/* Live Control Center */}
          <div className="bg-gradient-to-r from-[#3f3328] to-[#5a4a3a] rounded-xl p-6 text-white">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-xs font-semibold"><Settings2 size={13} />Live Control Center</div>
            <h2 className="font-display text-2xl font-bold mt-4">Panel health at a glance</h2>
            <p className="mt-2 text-white/70 text-sm">Customer, staff, and admin read the same real order pipeline</p>
            <div className="grid grid-cols-3 gap-4 mt-6">
              <div className="bg-white/10 rounded-xl p-3"><p className="text-white/60 text-xs">Kitchen Active</p><p className="text-2xl font-bold mt-1">{overview.kitchenActive || 0}</p></div>
              <div className="bg-white/10 rounded-xl p-3"><p className="text-white/60 text-xs">Delivery Online</p><p className="text-2xl font-bold mt-1">{overview.onlineDeliveryAgents || 0}</p></div>
              <div className="bg-white/10 rounded-xl p-3"><p className="text-white/60 text-xs">Ready Orders</p><p className="text-2xl font-bold mt-1">{overview.readyForHandoff || 0}</p></div>
            </div>
          </div>

          {/* Access Snapshot */}
          <div className="bg-white border border-[#e8e0d6] rounded-xl p-6">
            <p className="text-xs font-semibold text-[#b97844] uppercase tracking-wide mb-2">Role Visibility</p>
            <h2 className="font-display text-2xl font-bold text-[#3f3328] mb-4">Access Snapshot</h2>
            <div className="space-y-3">
              {[
                { key: 'customer', label: 'Customers', icon: Users, tone: 'bg-blue-100 text-blue-700' },
                { key: 'manager', label: 'Managers', icon: Briefcase, tone: 'bg-violet-100 text-violet-700' },
                { key: 'staff', label: 'Staff', icon: ShoppingBag, tone: 'bg-amber-100 text-amber-700' },
                { key: 'kitchen', label: 'Kitchen', icon: ChefHat, tone: 'bg-emerald-100 text-emerald-700' },
                { key: 'delivery', label: 'Delivery', icon: Bike, tone: 'bg-orange-100 text-orange-700' },
                { key: 'admin', label: 'Admins', icon: ShieldCheck, tone: 'bg-[#b97844]/10 text-[#b97844]' },
              ].map((row) => {
                const Icon = row.icon;
                return (
                  <div key={row.key} className="bg-[#faf8f5] rounded-xl px-4 py-3 flex items-center justify-between">
                    <div className="flex items-center gap-3"><div className={`w-10 h-10 rounded-xl flex items-center justify-center ${row.tone}`}><Icon size={16} /></div><p className="font-semibold text-[#3f3328]">{row.label}</p></div>
                    <span className="text-2xl font-bold text-[#3f3328]">{usersByRole[row.key] || 0}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-[1fr,0.9fr] gap-6">
          {/* Quick Settings Cards */}
          <div className="grid md:grid-cols-2 gap-5">
            {cards.map((card) => {
              const Icon = card.icon;
              return (
                <Link key={card.title} to={card.to} className="bg-white border border-[#e8e0d6] rounded-xl p-5 hover:shadow-md transition-all">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${card.tone}`}><Icon size={20} /></div>
                  <h3 className="font-display text-xl font-bold text-[#3f3328] mt-4">{card.title}</h3>
                  <p className="text-sm text-[#6b5f54] mt-1">{card.copy}</p>
                  <p className="text-sm font-semibold text-[#b97844] mt-3">Open panel →</p>
                </Link>
              );
            })}
          </div>

          {/* Recent Delivery Records */}
          <div className="bg-white border border-[#e8e0d6] rounded-xl p-6">
            <p className="text-xs font-semibold text-[#b97844] uppercase tracking-wide mb-2">Delivery Visibility</p>
            <h2 className="font-display text-2xl font-bold text-[#3f3328] mb-4">Recent Deliveries</h2>
            <div className="space-y-3">
              {recentDeliveries.slice(0, 5).map((delivery) => (
                <div key={delivery._id} className="bg-[#faf8f5] rounded-xl p-3">
                  <div className="flex items-center justify-between"><p className="font-mono text-sm font-semibold text-[#b97844]">{delivery.orderId}</p><span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${delivery.status === 'delivered' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>{delivery.status}</span></div>
                  <p className="text-sm text-[#6b5f54] mt-1">{delivery.customer?.name || 'Customer'}</p>
                  <p className="text-xs text-[#a0968c] mt-1 truncate">{delivery.deliveryAddress?.text || 'No address'}</p>
                </div>
              ))}
              {!recentDeliveries.length && <p className="text-sm text-[#a0968c] text-center py-4">No delivery records yet</p>}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}