import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Bell, Globe2, LockKeyhole, LogOut, ShieldCheck, MapPin, Heart, Tags, BellRing, ChevronRight, MessageSquare } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { logoutUser } from '../../store/slices/authSlice';
import CustomerFooter from '../../components/customer/CustomerFooter';

export default function CustomerSettingsPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [settings, setSettings] = useState({
    orderUpdates: true,
    offers: true,
    saveAddresses: true,
  });

  const toggle = (key) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleLogout = async () => {
    await dispatch(logoutUser());
    navigate('/login', { replace: true });
  };

  const SettingRow = ({ icon: Icon, title, subtitle, value, onClick }) => (
    <div className="flex items-center justify-between py-4 border-b border-gray-100 last:border-0">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-full bg-amber-50 flex items-center justify-center">
          <Icon size={16} className="text-amber-600" />
        </div>
        <div>
          <p className="font-medium text-gray-800">{title}</p>
          <p className="text-xs text-gray-400 mt-0.5">{subtitle}</p>
        </div>
      </div>
      <button
        onClick={onClick}
        className={`h-6 w-11 rounded-full transition-colors relative ${value ? 'bg-amber-600' : 'bg-gray-200'}`}
      >
        <span className={`absolute top-1 h-4 w-4 rounded-full bg-white transition-all ${value ? 'left-6' : 'left-1'}`} />
      </button>
    </div>
  );

  const MenuCard = ({ icon: Icon, title, desc, link }) => (
    <Link to={link} className="flex items-center justify-between p-4 bg-white border border-gray-100 rounded-xl hover:shadow-md transition-all">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center">
          <Icon size={18} className="text-amber-600" />
        </div>
        <div>
          <p className="font-medium text-gray-800">{title}</p>
          <p className="text-xs text-gray-400 mt-0.5">{desc}</p>
        </div>
      </div>
      <ChevronRight size={16} className="text-gray-300" />
    </Link>
  );

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

            <nav className="hidden md:flex items-center gap-6">
              <Link to="/dashboard" className="text-sm text-gray-500 hover:text-amber-600">Home</Link>
              <Link to="/menu" className="text-sm text-gray-500 hover:text-amber-600">Menu</Link>
              <Link to="/orders" className="text-sm text-gray-500 hover:text-amber-600">Orders</Link>
              <Link to="/profile" className="text-sm text-gray-500 hover:text-amber-600">Profile</Link>
              <Link to="/settings" className="text-sm text-amber-600">Settings</Link>
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Settings</h1>
          <p className="text-sm text-gray-400 mt-1">Manage your preferences and account</p>
        </div>

        <div className="bg-white border border-gray-100 rounded-xl p-5 mb-6">
          <h2 className="font-semibold text-gray-800 mb-3">Notifications</h2>
          <SettingRow
            icon={Bell}
            title="Order Updates"
            subtitle="Receive updates for placed, preparing, ready and delivered orders"
            value={settings.orderUpdates}
            onClick={() => toggle('orderUpdates')}
          />
          <SettingRow
            icon={Globe2}
            title="Offers & Promotions"
            subtitle="Get notified about active offers and discounts"
            value={settings.offers}
            onClick={() => toggle('offers')}
          />
          <SettingRow
            icon={ShieldCheck}
            title="Save Addresses"
            subtitle="Keep delivery and pre-order locations ready"
            value={settings.saveAddresses}
            onClick={() => toggle('saveAddresses')}
          />
        </div>

        <div className="grid sm:grid-cols-2 gap-3 mb-6">
          <MenuCard icon={MapPin} title="Saved Addresses" desc="Manage delivery locations" link="/addresses" />
          <MenuCard icon={Heart} title="Favourites" desc="Your saved dishes" link="/favourites" />
          <MenuCard icon={MessageSquare} title="Reviews" desc="Read and manage your reviews" link="/reviews" />
          <MenuCard icon={Tags} title="Offers" desc="Active coupons and deals" link="/offers" />
          <MenuCard icon={BellRing} title="Notifications" desc="All alerts in one place" link="/notifications" />
        </div>

        <div className="flex flex-wrap gap-3">
          <Link
            to="/forgot-password"
            className="inline-flex items-center gap-2 rounded-full border border-gray-200 px-4 py-2 text-sm text-gray-600 hover:border-amber-500 hover:text-amber-600 transition-all"
          >
            <LockKeyhole size={14} />
            Reset Password
          </Link>
          <button
            onClick={handleLogout}
            className="inline-flex items-center gap-2 rounded-full border border-red-200 px-4 py-2 text-sm text-red-500 hover:bg-red-50 transition-all"
          >
            <LogOut size={14} />
            Logout
          </button>
        </div>
      </main>

      <CustomerFooter />
    </div>
  );
}


