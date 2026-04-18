import React, { useEffect, useMemo, useState } from 'react';
import { Routes, Route, NavLink, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  BarChart3,
  Boxes,
  ClipboardList,
  LayoutDashboard,
  LogOut,
  Megaphone,
  MenuSquare,
  Truck,
  Users,
  PanelLeftClose,
  PanelLeftOpen,
  Search,
  User,
} from 'lucide-react';
import { logoutUser } from '../../store/slices/authSlice';
import ManagerDashboard from '../../pages/manager/ManagerDashboard';
import OrderManagement from '../../pages/manager/OrderManagement';
import MenuManagement from '../../pages/manager/MenuManagement';
import InventoryManagement from '../../pages/manager/InventoryManagement';
import StaffOverview from '../../pages/manager/staffOverview';
import SalesReports from '../../pages/manager/SalesReports';
import PromotionManagement from '../../pages/manager/PromotionManagement';
import SupplierManagement from '../../pages/manager/SupplierManagement';
import presenceService from '../../services/presenceService';

const navItems = [
  { to: '/manager', icon: LayoutDashboard, label: 'Dashboard', end: true },
  { to: '/manager/orders', icon: ClipboardList, label: 'Orders' },
  { to: '/manager/menu', icon: MenuSquare, label: 'Menu' },
  { to: '/manager/inventory', icon: Boxes, label: 'Inventory' },
  { to: '/manager/staff', icon: Users, label: 'Staff' },
  { to: '/manager/reports', icon: BarChart3, label: 'Reports' },
  { to: '/manager/promotions', icon: Megaphone, label: 'Promotions' },
  { to: '/manager/suppliers', icon: Truck, label: 'Suppliers' },
];

export default function ManagerLayout() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  useEffect(() => {
    if (!user?._id) return undefined;

    presenceService.initialize(user._id, user.role || 'manager', 'Manager Panel');

    return () => {
      void presenceService.cleanup();
    };
  }, [user?._id, user?.role]);

  const handleLogout = async () => {
    setShowLogoutConfirm(false);
    await dispatch(logoutUser());
    navigate('/login');
  };

  const dateLabel = useMemo(
    () => new Date().toLocaleDateString('en-IN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }),
    []
  );

  const timeLabel = useMemo(
    () => new Date().toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
    }),
    []
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex min-h-screen">
        {/* Sidebar */}
        <aside className={`${sidebarOpen ? 'w-64' : 'w-20'} transition-all duration-300 bg-white border-r border-gray-200 flex flex-col fixed h-full z-30 shadow-sm`}>
          <div className="flex flex-col h-full">
            {/* Logo */}
            <div className={`p-5 border-b border-gray-100 ${sidebarOpen ? '' : 'flex justify-center'}`}>
              {sidebarOpen ? (
                <div className="flex items-center gap-3">
                  <img 
                    src="https://rollercoastercafe.com/assets/images/roller_logo.png"
                    alt="Roller Coaster Cafe"
                    className="h-10 w-10 rounded-full object-cover ring-2 ring-amber-100"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://via.placeholder.com/40x40?text=RC';
                    }}
                  />
                  <div>
                    <p className="font-bold text-gray-900">Roller Coaster</p>
                    <p className="text-xs text-amber-600">Manager Panel</p>
                  </div>
                </div>
              ) : (
                <img 
                  src="https://rollercoastercafe.com/assets/images/roller_logo.png"
                  alt="Roller Coaster Cafe"
                  className="h-10 w-10 rounded-full object-cover ring-2 ring-amber-100"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://via.placeholder.com/40x40?text=RC';
                  }}
                />
              )}
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-3 py-5 space-y-1">
              {navItems.map(({ to, icon: Icon, label, end }) => (
                <NavLink
                  key={to}
                  to={to}
                  end={end}
                  className={({ isActive }) =>
                    `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all ${
                      isActive
                        ? 'bg-amber-50 text-amber-700 border-l-4 border-amber-500'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    } ${!sidebarOpen && 'justify-center'}`
                  }
                >
                  <Icon size={18} />
                  {sidebarOpen && <span>{label}</span>}
                </NavLink>
              ))}
            </nav>

            {/* User Section */}
            <div className={`p-4 border-t border-gray-100 ${sidebarOpen ? '' : 'flex justify-center'}`}>
              {sidebarOpen ? (
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-full bg-amber-100 flex items-center justify-center">
                      <User size={16} className="text-amber-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-gray-900 truncate">{user?.name || 'Manager'}</p>
                      <p className="text-xs text-gray-500">Manager</p>
                    </div>
                  </div>
                <button
                  onClick={() => setShowLogoutConfirm(true)}
                  className="w-full mt-3 flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                    <LogOut size={14} />
                    Logout
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setShowLogoutConfirm(true)}
                  className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <LogOut size={18} />
                </button>
              )}
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-20'}`}>
          {/* Header */}
          <header className="sticky top-0 z-20 bg-white border-b border-gray-200 shadow-sm">
            <div className="flex items-center justify-between gap-4 px-6 py-3">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setSidebarOpen((prev) => !prev)}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-600 hover:border-amber-300 hover:text-amber-600 transition-colors"
                >
                  {sidebarOpen ? <PanelLeftClose size={16} /> : <PanelLeftOpen size={16} />}
                </button>
                <div>
                  <p className="text-xs uppercase tracking-wider text-amber-600">Cafe Operations</p>
                  <h1 className="text-xl font-bold text-gray-900">Manager Workspace</h1>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {/* Search Bar */}
                <div className="hidden md:flex items-center bg-gray-50 rounded-lg px-3 py-1.5 border border-gray-200">
                  <Search size={14} className="text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="ml-2 bg-transparent text-sm text-gray-700 placeholder-gray-400 outline-none w-40"
                  />
                </div>

                {/* Date & Time */}
                <div className="hidden lg:block text-right">
                  <p className="text-xs text-gray-500">{dateLabel}</p>
                  <p className="text-xs font-semibold text-gray-700">{timeLabel}</p>
                </div>
              </div>
            </div>
          </header>

          {/* Page Content */}
          <div className="p-6">
            <Routes>
              <Route index element={<ManagerDashboard />} />
              <Route path="orders" element={<OrderManagement />} />
              <Route path="menu" element={<MenuManagement />} />
              <Route path="inventory" element={<InventoryManagement />} />
              <Route path="staff" element={<StaffOverview />} />
              <Route path="reports" element={<SalesReports />} />
              <Route path="promotions" element={<PromotionManagement />} />
              <Route path="suppliers" element={<SupplierManagement />} />
            </Routes>
          </div>
        </main>
      </div>
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setShowLogoutConfirm(false)}>
          <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="border-b border-gray-200 px-5 py-4">
              <h2 className="text-lg font-bold text-gray-900">Confirm Logout</h2>
              <p className="mt-1 text-sm text-gray-500">You will need to sign in again to access the manager panel.</p>
            </div>
            <div className="flex justify-end gap-3 px-5 py-4">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                className="rounded-lg bg-red-500 px-4 py-2 text-sm font-medium text-white hover:bg-red-600"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}





