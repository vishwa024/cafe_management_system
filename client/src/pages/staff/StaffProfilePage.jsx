import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { User, Mail, Phone, Briefcase, ArrowLeft, Settings, Calendar, Clock } from 'lucide-react';

export default function StaffProfilePage() {
  const { user } = useSelector((state) => state.auth);

  const initials = user?.name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || 'ST';

  return (
    <div className="min-h-screen bg-[#faf8f5]">
      {/* Header */}
      <header className="bg-white border-b border-[#e8e0d6] sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img src="https://rollercoastercafe.com/assets/images/roller_logo.png" alt="Logo" className="h-8 w-8 rounded-full object-cover" />
              <div>
                <h1 className="font-display font-bold text-xl text-[#3f3328]">Staff Profile</h1>
                <p className="text-xs text-[#6b5f54]">Your account information</p>
              </div>
            </div>
            <Link to="/staff" className="text-sm text-[#b97844] hover:underline flex items-center gap-1">
              <ArrowLeft size={14} /> Back to Dashboard
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-8">
        {/* Profile Card */}
        <div className="bg-white border border-[#e8e0d6] rounded-2xl overflow-hidden mb-6">
          <div className="bg-gradient-to-r from-[#3f3328] to-[#5a4a3a] px-6 py-8 text-white">
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <div className="w-24 h-24 rounded-full bg-white/20 flex items-center justify-center border-2 border-white/50">
                <span className="text-3xl font-bold">{initials}</span>
              </div>
              <div className="text-center sm:text-left">
                <h2 className="text-2xl font-bold">{user?.name || 'Staff User'}</h2>
                <p className="text-white/70 text-sm mt-1 capitalize">{user?.role || 'Staff'} • Active</p>
                <p className="text-white/50 text-xs mt-2">Member since {new Date().getFullYear()}</p>
              </div>
            </div>
          </div>
          
          <div className="p-6 space-y-5">
            <div className="flex items-start gap-4 pb-4 border-b border-[#e8e0d6]">
              <Mail size={18} className="text-[#b97844] mt-0.5" />
              <div>
                <p className="text-xs text-[#6b5f54] uppercase tracking-wide">Email Address</p>
                <p className="text-[#3f3328] font-medium mt-1">{user?.email || 'Not provided'}</p>
              </div>
            </div>
            <div className="flex items-start gap-4 pb-4 border-b border-[#e8e0d6]">
              <Phone size={18} className="text-[#b97844] mt-0.5" />
              <div>
                <p className="text-xs text-[#6b5f54] uppercase tracking-wide">Phone Number</p>
                <p className="text-[#3f3328] font-medium mt-1">{user?.phone || 'Not provided'}</p>
              </div>
            </div>
            <div className="flex items-start gap-4 pb-4 border-b border-[#e8e0d6]">
              <Briefcase size={18} className="text-[#b97844] mt-0.5" />
              <div>
                <p className="text-xs text-[#6b5f54] uppercase tracking-wide">Role</p>
                <p className="text-[#3f3328] font-medium mt-1 capitalize">{user?.role || 'Staff'}</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <Calendar size={18} className="text-[#b97844] mt-0.5" />
              <div>
                <p className="text-xs text-[#6b5f54] uppercase tracking-wide">Account Status</p>
                <p className="text-[#3f3328] font-medium mt-1">Active</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid sm:grid-cols-2 gap-4">
          <Link to="/staff/settings" className="flex items-center gap-4 p-5 bg-white border border-[#e8e0d6] rounded-xl hover:shadow-md transition-all">
            <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center">
              <Settings size={18} className="text-amber-600" />
            </div>
            <div>
              <p className="font-semibold text-[#3f3328]">Staff Settings</p>
              <p className="text-sm text-[#6b5f54]">Preferences and controls</p>
            </div>
          </Link>
          <Link to="/staff/queue" className="flex items-center gap-4 p-5 bg-white border border-[#e8e0d6] rounded-xl hover:shadow-md transition-all">
            <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
              <Clock size={18} className="text-emerald-600" />
            </div>
            <div>
              <p className="font-semibold text-[#3f3328]">Order Queue</p>
              <p className="text-sm text-[#6b5f54]">View active orders</p>
            </div>
          </Link>
        </div>
      </main>
    </div>
  );
}