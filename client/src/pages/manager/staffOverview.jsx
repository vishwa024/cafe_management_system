import React, { useEffect, useMemo, useState, useCallback } from 'react';
import { toast } from 'react-hot-toast';
import api from '../../services/api';
import presenceService from '../../services/presenceService';
import { LoadingSpinner, EmptyState } from '../../components/shared/StatusBadge';
import {
  Wifi, WifiOff, Search, UserCheck, Clock, Mail, Phone, RefreshCw,
  Calendar as CalendarIcon, X, Trash2, ChevronLeft, ChevronRight, Plus, Users
} from 'lucide-react';

export default function StaffOverview() {
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearch] = useState('');
  const [roleFilter, setRole] = useState('all');
  const [hoveredCard, setHov] = useState(null);
  const [stats, setStats] = useState({ total: 0, online: 0, offline: 0 });
  const [activeTab, setTab] = useState('staff');

  const fetchStaff = useCallback(async () => {
    try {
      const res = await api.get('/manager/staff');
      const staffList = res.data?.staff || res.data || [];
      
      const onlineRes = await api.get('/presence/online-users').catch(() => ({ data: [] }));
      const onlineArray = Array.isArray(onlineRes.data) ? onlineRes.data : [];
      
      const onlineMap = new Map();
      onlineArray.forEach(u => {
        const id = u?.userId || u?._id;
        if (id) onlineMap.set(String(id), { isOnline: true, panel: u.panel, lastSeen: u.lastSeen });
      });

      const enriched = staffList.map(m => {
        const presence = onlineMap.get(String(m._id));
        return { ...m, isOnline: !!presence, currentPanel: presence?.panel, lastSeen: presence?.lastSeen || m.lastSeen };
      });

      setStaff(enriched);
      const on = enriched.filter(m => m.isOnline).length;
      setStats({ total: enriched.length, online: on, offline: enriched.length - on });
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => {
    fetchStaff();
    const interval = setInterval(fetchStaff, 5000);
    return () => clearInterval(interval);
  }, [fetchStaff]);

  const filtered = useMemo(() => staff.filter(m => {
    const q = searchTerm.toLowerCase();
    return (m.name?.toLowerCase().includes(q) || m.email?.toLowerCase().includes(q))
        && (roleFilter === 'all' || m.role?.toLowerCase() === roleFilter);
  }), [staff, searchTerm, roleFilter]);

  const formatLastSeen = (lastSeen) => {
    if (!lastSeen) return 'Never seen';
    const diff = Date.now() - new Date(lastSeen).getTime();
    if (diff < 60000) return 'Just now';
    if (diff < 3600000) return `${Math.floor(diff / 60000)} minutes ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)} hours ago`;
    return new Date(lastSeen).toLocaleDateString();
  };

  const getRoleColor = (role) => {
    const colors = {
      delivery: 'bg-blue-100 text-blue-700',
      kitchen: 'bg-orange-100 text-orange-700',
      staff: 'bg-purple-100 text-purple-700',
      manager: 'bg-green-100 text-green-700',
      admin: 'bg-rose-100 text-rose-700',
      customer: 'bg-sky-100 text-sky-700',
    };
    return colors[role?.toLowerCase()] || colors.staff;
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-amber-100 rounded-xl">
              <Users size={20} className="text-amber-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Total Users</p>
              <p className="text-xs text-gray-400">Staff, panels, and customers</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-green-100 rounded-xl">
              <Wifi size={20} className="text-green-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Online Now</p>
              <p className="text-2xl font-bold text-green-600">{stats.online}</p>
              <p className="text-xs text-gray-400">{stats.offline} offline</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-purple-100 rounded-xl">
              <Clock size={20} className="text-purple-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Active Roles</p>
              <div className="flex gap-2 mt-1">
                {Object.entries(staff.reduce((acc, s) => {
                  const role = s.role || 'staff';
                  acc[role] = (acc[role] || 0) + 1;
                  return acc;
                }, {})).slice(0, 3).map(([role, count]) => (
                  <span key={role} className="text-xs font-medium text-gray-600 capitalize">{role}: {count}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 bg-white border border-gray-200 rounded-lg p-1 w-fit">
        <button
          onClick={() => setTab('staff')}
          className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${activeTab === 'staff' ? 'bg-amber-500 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
        >
          👥 Staff List
        </button>
        {/* <button
          onClick={() => setTab('schedule')}
          className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${activeTab === 'schedule' ? 'bg-amber-500 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
        >
          📅 Shift Schedule
        </button> */}
      </div>

      {activeTab === 'staff' ? (
        <>
          {/* Filters */}
          <div className="flex gap-3 items-center flex-wrap">
            <div className="relative flex-1 max-w-sm">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search users..."
                className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-amber-400"
                value={searchTerm}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
            <select
              className="px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white"
              value={roleFilter}
              onChange={e => setRole(e.target.value)}
            >
              <option value="all">All Roles</option>
              <option value="delivery">Delivery</option>
              <option value="kitchen">Kitchen</option>
              <option value="staff">Staff</option>
              <option value="manager">Manager</option>
              <option value="admin">Admin</option>
              <option value="customer">Customer</option>
            </select>
            <button onClick={fetchStaff} className="flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-lg text-sm hover:bg-gray-50">
              <RefreshCw size={14} /> Refresh
            </button>
          </div>

          {/* Staff Grid */}
          {loading ? <LoadingSpinner /> : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
              {filtered.length === 0 ? <EmptyState message="No users found" /> : filtered.map(member => (
                <div
                  key={member._id}
                  className={`bg-white rounded-xl border border-gray-200 p-5 transition-all overflow-hidden ${hoveredCard === member._id ? 'shadow-md transform -translate-y-0.5' : ''}`}
                  onMouseEnter={() => setHov(member._id)}
                  onMouseLeave={() => setHov(null)}
                >
                  <div className="flex flex-col gap-3 mb-3 sm:flex-row sm:items-start sm:justify-between">
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-white font-bold text-lg">
                        {member.name?.charAt(0).toUpperCase()}
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="font-semibold text-gray-900 truncate">{member.name}</h3>
                        <p className="text-xs text-gray-500 truncate">{member.email}</p>
                      </div>
                    </div>
                    <div className={`inline-flex w-fit shrink-0 items-center gap-1 self-start px-2 py-1 rounded-full text-xs font-semibold ${member.isOnline ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                      {member.isOnline ? <Wifi size={10} /> : <WifiOff size={10} />}
                      {member.isOnline ? 'Online' : 'Offline'}
                    </div>
                  </div>

                  <div className="space-y-1 mt-3">
                    <p className="text-xs text-gray-500 flex items-center gap-1"><Phone size={10} /> {member.phone || 'N/A'}</p>
                    <p className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${getRoleColor(member.role)}`}>
                      {member.role || 'Staff'}
                    </p>
                    {member.isOnline && member.currentPanel && (
                      <p className="text-xs text-blue-600 flex items-center gap-1"><UserCheck size={10} /> Active in: {member.currentPanel}</p>
                    )}
                    <p className="text-xs text-gray-400 flex items-center gap-1"><Clock size={10} /> {member.isOnline ? 'Active now' : `Last seen: ${formatLastSeen(member.lastSeen)}`}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 p-6 text-center">
          <CalendarIcon size={48} className="mx-auto text-gray-300 mb-3" />
          <p className="text-gray-500">Shift schedule calendar coming soon</p>
        </div>
      )}
    </div>
  );
}
