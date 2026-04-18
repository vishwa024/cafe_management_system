// import { Link, NavLink, useNavigate } from 'react-router-dom';
// import { useDispatch, useSelector } from 'react-redux';
// import {
//   LayoutDashboard,
//   Users,
//   ShoppingBag,
//   LogOut,
//   ChefHat,
//   UserRound,
//   Bike,
//   BarChart3,
//   Sparkles,
// } from 'lucide-react';
// import { logoutUser } from '../../store/slices/authSlice';
// import toast from 'react-hot-toast';

// const NAV = [
//   { label: 'Dashboard', to: '/admin', icon: LayoutDashboard },
//   { label: 'Team & Staff', to: '/admin/users', icon: Users },
//   { label: 'Customers', to: '/admin/customers', icon: UserRound },
//   { label: 'All Orders', to: '/admin/orders', icon: ShoppingBag },
//   { label: 'Kitchen', to: '/admin/kitchen', icon: ChefHat },
//   { label: 'Delivery', to: '/admin/delivery', icon: Bike },
//   { label: 'Reports', to: '/admin/reports', icon: BarChart3 },
// ];

// export default function AdminSidebar() {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const { user } = useSelector((state) => state.auth);

//   const handleLogout = async () => {
//     await dispatch(logoutUser());
//     toast.success('Logged out');
//     navigate('/login', { replace: true });
//   };

//   return (
//     <aside className="w-72 shrink-0 min-h-screen bg-[linear-gradient(180deg,#1e1714_0%,#2f221d_100%)] text-white border-r border-[#4b362d] flex flex-col">
//       <div className="p-6 border-b border-white/10">
//         <div className="flex items-center gap-3">
//           <img
//             src="https://rollercoastercafe.com/assets/images/roller_logo.png"
//             alt="Roller Coaster Cafe"
//             className="h-12 w-12 rounded-full object-cover ring-2 ring-white/10"
//           />
//           <div>
//             <p className="font-display text-2xl font-bold leading-none">Roller Coaster Cafe</p>
//             <p className="text-xs uppercase tracking-[0.22em] text-orange-200 mt-2">Admin Console</p>
//           </div>
//         </div>
//       </div>

//       <div className="px-5 pt-5">
//         <div className="rounded-[1.4rem] border border-white/10 bg-white/5 px-4 py-4 backdrop-blur-sm">
//           <p className="text-[11px] uppercase tracking-[0.22em] text-orange-200">System Control</p>
//           <p className="text-sm text-white/75 mt-2 leading-relaxed">
//             Oversee the full cafe operation, teams, customers, reports, and order visibility in one place.
//           </p>
//         </div>
//       </div>

//       <nav className="flex-1 p-5 space-y-2">
//         {NAV.map(({ label, to, icon: Icon }) => (
//           <NavLink
//             key={to}
//             to={to}
//             end={to === '/admin'}
//             className={({ isActive }) =>
//               `group flex items-center gap-3 rounded-[1.2rem] px-4 py-3 text-sm font-semibold transition-all ${
//                 isActive
//                   ? 'bg-[#c9894a] text-white shadow-[0_14px_30px_rgba(201,137,74,0.28)]'
//                   : 'text-white/72 hover:text-white hover:bg-white/8'
//               }`
//             }
//           >
//             <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-white/10 group-hover:bg-white/15 transition-colors">
//               <Icon size={18} />
//             </span>
//             <span>{label}</span>
//           </NavLink>
//         ))}
//       </nav>

//       <div className="p-5 border-t border-white/10 space-y-4">
//         <Link
//           to="/admin/profile"
//           className="block rounded-[1.5rem] border border-white/10 bg-[linear-gradient(135deg,rgba(255,255,255,0.08),rgba(255,255,255,0.03))] px-4 py-4 hover:bg-white/10 transition-colors"
//         >
//           <div className="flex items-center gap-3">
//             <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-[#c9894a] text-white font-bold">
//               {(user?.name || 'A').charAt(0).toUpperCase()}
//             </span>
//             <div className="min-w-0">
//               <p className="text-sm font-semibold text-white truncate">{user?.name || 'Admin User'}</p>
//               <p className="text-xs text-white/65 truncate">{user?.email || 'No email available'}</p>
//             </div>
//           </div>
//         </Link>

//         <button
//           onClick={handleLogout}
//           className="w-full inline-flex items-center justify-center gap-2 rounded-full border border-white/14 bg-white/5 px-4 py-3 text-sm font-semibold text-white/85 hover:bg-[#c9894a] hover:border-[#c9894a] hover:text-white transition-colors"
//         >
//           <LogOut size={16} /> Logout
//         </button>

//         <div className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-white/45">
//           <Sparkles size={12} /> Full visibility across every panel
//         </div>
//       </div>
//     </aside>
//   );
// }


import { useEffect, useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  LayoutDashboard,
  Users,
  ShoppingBag,
  LogOut,
  ChefHat,
  UserRound,
  Bike,
  BarChart3,
  Sparkles,
  UtensilsCrossed,
} from 'lucide-react';
import { logoutUser } from '../../store/slices/authSlice';
import toast from 'react-hot-toast';
import presenceService from '../../services/presenceService';

const NAV = [
  { label: 'Dashboard', to: '/admin', icon: LayoutDashboard },
  { label: 'Team & Staff', to: '/admin/users', icon: Users },
  { label: 'Customers', to: '/admin/customers', icon: UserRound },
  { label: 'All Orders', to: '/admin/orders', icon: ShoppingBag },
  { label: 'Menu', to: '/admin/menu', icon: UtensilsCrossed },
  { label: 'Kitchen', to: '/admin/kitchen', icon: ChefHat },
  { label: 'Delivery', to: '/admin/delivery', icon: Bike },
  { label: 'Reports', to: '/admin/reports', icon: BarChart3 },
];

export default function AdminSidebar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  useEffect(() => {
    if (!user?._id) return undefined;

    presenceService.initialize(user._id, user.role || 'admin', 'Admin Panel');

    return () => {
      void presenceService.cleanup();
    };
  }, [user?._id, user?.role]);

  const handleLogout = async () => {
    setShowLogoutConfirm(false);
    await dispatch(logoutUser());
    toast.success('Logged out');
    navigate('/login', { replace: true });
  };

  const initials = user?.name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || 'AD';

  return (
    <aside className="w-72 shrink-0 min-h-screen bg-white border-r border-[#e8e0d6] flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-[#e8e0d6]">
        <div className="flex items-center gap-3">
          <img
            src="https://rollercoastercafe.com/assets/images/roller_logo.png"
            alt="Roller Coaster Cafe"
            className="h-12 w-12 rounded-full object-cover"
          />
          <div>
            <p className="font-display text-xl font-bold text-[#3f3328] leading-tight">Roller Coaster</p>
            <p className="text-xs text-[#6b5f54] mt-0.5">Admin Console</p>
          </div>
        </div>
      </div>

      {/* Welcome Card */}
      {/* <div className="px-5 pt-5">
        <div className="rounded-xl bg-[#faf8f5] border border-[#e8e0d6] px-4 py-4">
          <p className="text-xs font-semibold text-[#b97844] uppercase tracking-wide">System Control</p>
          <p className="text-sm text-[#6b5f54] mt-2 leading-relaxed">
            Oversee the full cafe operation, teams, customers, reports, and order visibility.
          </p>
        </div>
      </div> */}

      {/* Navigation */}
      <nav className="flex-1 p-5 space-y-1.5">
        {NAV.map(({ label, to, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/admin'}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all ${
                isActive
                  ? 'bg-[#b97844] text-white shadow-sm'
                  : 'text-[#6b5f54] hover:bg-[#faf8f5] hover:text-[#b97844]'
              }`
            }
          >
            <Icon size={18} />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-5 border-t border-[#e8e0d6] space-y-4">
        <Link
          to="/admin/profile"
          className="flex items-center gap-3 rounded-xl px-4 py-3 bg-[#faf8f5] hover:bg-[#e8e0d6] transition-colors"
        >
          <div className="w-9 h-9 rounded-full bg-[#b97844] text-white flex items-center justify-center font-bold text-sm">
            {initials}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-[#3f3328] truncate">{user?.name || 'Admin User'}</p>
            <p className="text-xs text-[#6b5f54] truncate">Administrator</p>
          </div>
        </Link>

        <button
          onClick={() => setShowLogoutConfirm(true)}
          className="w-full flex items-center justify-center gap-2 rounded-xl border border-red-200 bg-white px-4 py-3 text-sm font-medium text-red-500 hover:bg-red-50 transition-colors"
        >
          <LogOut size={16} /> Logout
        </button>
      </div>
      {showLogoutConfirm ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setShowLogoutConfirm(false)}>
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl" onClick={(event) => event.stopPropagation()}>
            <h2 className="text-lg font-bold text-[#3f3328]">Confirm Logout</h2>
            <p className="mt-2 text-sm text-[#6b5f54]">You will need to sign in again to access the admin panel.</p>
            <div className="mt-6 flex gap-3">
              <button onClick={() => setShowLogoutConfirm(false)} className="flex-1 rounded-lg border border-[#e8e0d6] px-4 py-2 text-sm font-medium text-[#6b5f54] hover:bg-[#faf8f5]">Cancel</button>
              <button onClick={handleLogout} className="flex-1 rounded-lg bg-red-500 px-4 py-2 text-sm font-medium text-white hover:bg-red-600">Logout</button>
            </div>
          </div>
        </div>
      ) : null}
    </aside>
  );
}
