// import { useEffect, useMemo, useState } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
// import { Mail, Phone, ShieldCheck, Briefcase, Pencil, Save, Eye, EyeOff } from 'lucide-react';
// import toast from 'react-hot-toast';
// import AdminSidebar from '../../components/admin/AdminSidebar';
// import api from '../../services/api';
// import { setUser } from '../../store/slices/authSlice';

// const EMPTY_FORM = {
//   name: '',
//   email: '',
//   phone: '',
//   password: '',
// };

// export default function AdminProfilePage() {
//   const dispatch = useDispatch();
//   const queryClient = useQueryClient();
//   const { user } = useSelector((state) => state.auth);
//   const [isEditing, setIsEditing] = useState(false);
//   const [form, setForm] = useState(EMPTY_FORM);
//   const [showPassword, setShowPassword] = useState(false);

//   const { data: users = [] } = useQuery({
//     queryKey: ['admin-users-profile'],
//     queryFn: () => api.get('/admin/users').then((r) => r.data),
//     enabled: !!user?._id,
//   });

//   const adminRecord = useMemo(
//     () => users.find((entry) => entry._id === user?._id) || user || null,
//     [users, user]
//   );

//   useEffect(() => {
//     if (adminRecord) {
//       setForm({
//         name: adminRecord.name || '',
//         email: adminRecord.email || '',
//         phone: adminRecord.phone || '',
//         password: '',
//       });
//     }
//   }, [adminRecord]);

//   const updateMutation = useMutation({
//     mutationFn: ({ id, payload }) => api.put(`/admin/users/${id}`, payload),
//     onSuccess: (response) => {
//       const updated = response.data;
//       dispatch(setUser({
//         _id: updated._id,
//         name: updated.name,
//         email: updated.email,
//         phone: updated.phone,
//         role: updated.role,
//       }));
//       queryClient.invalidateQueries({ queryKey: ['admin-users'] });
//       queryClient.invalidateQueries({ queryKey: ['admin-users-profile'] });
//       setForm((prev) => ({ ...prev, password: '' }));
//       setIsEditing(false);
//       setShowPassword(false);
//       toast.success('Admin profile updated');
//     },
//     onError: (error) => toast.error(error.response?.data?.message || 'Failed to update profile'),
//   });

//   const handleSave = () => {
//     if (!adminRecord?._id) return;

//     const payload = {
//       name: form.name,
//       email: form.email,
//       phone: form.phone,
//       role: adminRecord.role || 'admin',
//     };

//     if (form.password.trim()) {
//       payload.password = form.password;
//     }

//     updateMutation.mutate({ id: adminRecord._id, payload });
//   };

//   return (
//     <div className="flex min-h-screen bg-gray-50 font-body">
//       <AdminSidebar />
//       <main className="flex-1 p-8 overflow-auto">
//         <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
//           <div>
//             <h1 className="font-display text-3xl font-bold text-dark">Admin Profile</h1>
//             <p className="text-gray-500 mt-1">Your admin account details.</p>
//           </div>

//           <button
//             onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
//             disabled={updateMutation.isPending}
//             className="btn-primary inline-flex items-center gap-2"
//           >
//             {isEditing ? <Save size={18} /> : <Pencil size={18} />}
//             {updateMutation.isPending ? 'Saving...' : isEditing ? 'Save Profile' : 'Edit Profile'}
//           </button>
//         </div>

//         <section className="card p-6 max-w-3xl">
//           <h2 className="font-display text-2xl font-bold text-dark mb-5">Profile Details</h2>
//           <div className="space-y-5">
//             <div className="flex items-start gap-3">
//               <Briefcase className="text-primary mt-1" size={18} />
//               <div className="w-full">
//                 <p className="font-semibold text-dark">Name</p>
//                 {isEditing ? (
//                   <input
//                     value={form.name}
//                     onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
//                     className="input-field mt-2"
//                   />
//                 ) : (
//                   <p className="text-gray-500 text-sm mt-1">{adminRecord?.name || 'Admin User'}</p>
//                 )}
//               </div>
//             </div>

//             <div className="flex items-start gap-3">
//               <Mail className="text-primary mt-1" size={18} />
//               <div className="w-full">
//                 <p className="font-semibold text-dark">Email</p>
//                 {isEditing ? (
//                   <input
//                     value={form.email}
//                     onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
//                     type="email"
//                     className="input-field mt-2"
//                   />
//                 ) : (
//                   <p className="text-gray-500 text-sm mt-1">{adminRecord?.email || 'Not provided'}</p>
//                 )}
//               </div>
//             </div>

//             <div className="flex items-start gap-3">
//               <Phone className="text-primary mt-1" size={18} />
//               <div className="w-full">
//                 <p className="font-semibold text-dark">Phone</p>
//                 {isEditing ? (
//                   <input
//                     value={form.phone}
//                     onChange={(e) => setForm((prev) => ({ ...prev, phone: e.target.value }))}
//                     className="input-field mt-2"
//                   />
//                 ) : (
//                   <p className="text-gray-500 text-sm mt-1">{adminRecord?.phone || 'Not available'}</p>
//                 )}
//               </div>
//             </div>

//             {isEditing ? (
//               <div className="flex items-start gap-3">
//                 <ShieldCheck className="text-primary mt-1" size={18} />
//                 <div className="w-full">
//                   <p className="font-semibold text-dark">New Password</p>
//                   <div className="relative mt-2">
//                     <input
//                       value={form.password}
//                       onChange={(e) => setForm((prev) => ({ ...prev, password: e.target.value }))}
//                       type={showPassword ? 'text' : 'password'}
//                       placeholder="Optional"
//                       className="input-field pr-12"
//                     />
//                     <button
//                       type="button"
//                       onClick={() => setShowPassword((prev) => !prev)}
//                       className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary"
//                     >
//                       {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             ) : null}

//             <div className="flex items-start gap-3">
//               <Briefcase className="text-primary mt-1" size={18} />
//               <div>
//                 <p className="font-semibold text-dark">Role</p>
//                 <p className="text-gray-500 text-sm mt-1 capitalize">{adminRecord?.role || 'admin'}</p>
//               </div>
//             </div>

//             <div className="flex items-start gap-3">
//               <ShieldCheck className="text-primary mt-1" size={18} />
//               <div>
//                 <p className="font-semibold text-dark">Permissions</p>
//                 <p className="text-gray-500 text-sm mt-1">Users, menu, orders, reports, settings, and full admin visibility.</p>
//               </div>
//             </div>
//           </div>
//         </section>
//       </main>
//     </div>
//   );
// }


import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Mail, Phone, ShieldCheck, Briefcase, Pencil, Save, Eye, EyeOff, User } from 'lucide-react';
import toast from 'react-hot-toast';
import AdminSidebar from '../../components/admin/AdminSidebar';
import api from '../../services/api';
import { setUser } from '../../store/slices/authSlice';

const EMPTY_FORM = {
  name: '',
  email: '',
  phone: '',
  password: '',
};

export default function AdminProfilePage() {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const { user } = useSelector((state) => state.auth);
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [showPassword, setShowPassword] = useState(false);

  const { data: users = [] } = useQuery({
    queryKey: ['admin-users-profile'],
    queryFn: () => api.get('/admin/users').then((r) => r.data),
    enabled: !!user?._id,
  });

  const adminRecord = useMemo(
    () => users.find((entry) => entry._id === user?._id) || user || null,
    [users, user]
  );

  useEffect(() => {
    if (adminRecord) {
      setForm({
        name: adminRecord.name || '',
        email: adminRecord.email || '',
        phone: adminRecord.phone || '',
        password: '',
      });
    }
  }, [adminRecord]);

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }) => api.put(`/admin/users/${id}`, payload),
    onSuccess: (response) => {
      const updated = response.data;
      dispatch(setUser({
        _id: updated._id,
        name: updated.name,
        email: updated.email,
        phone: updated.phone,
        role: updated.role,
      }));
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      queryClient.invalidateQueries({ queryKey: ['admin-users-profile'] });
      setForm((prev) => ({ ...prev, password: '' }));
      setIsEditing(false);
      setShowPassword(false);
      toast.success('Profile updated');
    },
    onError: (error) => toast.error(error.response?.data?.message || 'Failed to update profile'),
  });

  const handleSave = () => {
    if (!adminRecord?._id) return;

    const payload = {
      name: form.name,
      email: form.email,
      phone: form.phone,
      role: adminRecord.role || 'admin',
    };

    if (form.password.trim()) {
      payload.password = form.password;
    }

    updateMutation.mutate({ id: adminRecord._id, payload });
  };

  const initials = adminRecord?.name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || 'AD';

  return (
    <div className="flex min-h-screen bg-[#faf8f5]">
      <AdminSidebar />
      <main className="flex-1 p-6 lg:p-8 overflow-auto">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="font-display text-3xl font-bold text-[#3f3328]">Admin Profile</h1>
            <p className="text-sm text-[#6b5f54] mt-1">Your admin account details</p>
          </div>

          <button
            onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
            disabled={updateMutation.isPending}
            className="inline-flex items-center gap-2 rounded-xl bg-[#b97844] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#9e6538] transition-all disabled:opacity-50"
          >
            {isEditing ? <Save size={16} /> : <Pencil size={16} />}
            {updateMutation.isPending ? 'Saving...' : isEditing ? 'Save Profile' : 'Edit Profile'}
          </button>
        </div>

        <div className="bg-white border border-[#e8e0d6] rounded-xl max-w-3xl overflow-hidden">
          {/* Profile Header */}
          <div className="bg-gradient-to-r from-[#3f3328] to-[#5a4a3a] px-6 py-8 text-white">
            <div className="flex items-center gap-5">
              <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center border-2 border-white/50">
                <span className="text-2xl font-bold">{initials}</span>
              </div>
              <div>
                <h2 className="text-2xl font-bold">{adminRecord?.name || 'Admin User'}</h2>
                <p className="text-white/70 text-sm mt-1 capitalize">{adminRecord?.role || 'Admin'} • Administrator</p>
              </div>
            </div>
          </div>

          <div className="p-6 space-y-5">
            <div className="flex items-start gap-4 pb-4 border-b border-[#e8e0d6]">
              <User size={18} className="text-[#b97844] mt-0.5" />
              <div className="flex-1">
                <p className="text-xs font-semibold text-[#6b5f54] uppercase tracking-wide">Full Name</p>
                {isEditing ? (
                  <input
                    value={form.name}
                    onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
                    className="w-full mt-1 rounded-lg border border-[#e8e0d6] px-4 py-2 text-sm focus:border-[#b97844] focus:outline-none"
                  />
                ) : (
                  <p className="text-[#3f3328] font-medium mt-1">{adminRecord?.name || 'Admin User'}</p>
                )}
              </div>
            </div>

            <div className="flex items-start gap-4 pb-4 border-b border-[#e8e0d6]">
              <Mail size={18} className="text-[#b97844] mt-0.5" />
              <div className="flex-1">
                <p className="text-xs font-semibold text-[#6b5f54] uppercase tracking-wide">Email</p>
                {isEditing ? (
                  <input
                    value={form.email}
                    onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
                    type="email"
                    className="w-full mt-1 rounded-lg border border-[#e8e0d6] px-4 py-2 text-sm focus:border-[#b97844] focus:outline-none"
                  />
                ) : (
                  <p className="text-[#3f3328] font-medium mt-1">{adminRecord?.email || 'Not provided'}</p>
                )}
              </div>
            </div>

            <div className="flex items-start gap-4 pb-4 border-b border-[#e8e0d6]">
              <Phone size={18} className="text-[#b97844] mt-0.5" />
              <div className="flex-1">
                <p className="text-xs font-semibold text-[#6b5f54] uppercase tracking-wide">Phone</p>
                {isEditing ? (
                  <input
                    value={form.phone}
                    onChange={(e) => setForm((prev) => ({ ...prev, phone: e.target.value }))}
                    className="w-full mt-1 rounded-lg border border-[#e8e0d6] px-4 py-2 text-sm focus:border-[#b97844] focus:outline-none"
                  />
                ) : (
                  <p className="text-[#3f3328] font-medium mt-1">{adminRecord?.phone || 'Not available'}</p>
                )}
              </div>
            </div>

            {isEditing && (
              <div className="flex items-start gap-4 pb-4 border-b border-[#e8e0d6]">
                <ShieldCheck size={18} className="text-[#b97844] mt-0.5" />
                <div className="flex-1">
                  <p className="text-xs font-semibold text-[#6b5f54] uppercase tracking-wide">New Password</p>
                  <div className="relative mt-1">
                    <input
                      value={form.password}
                      onChange={(e) => setForm((prev) => ({ ...prev, password: e.target.value }))}
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Optional"
                      className="w-full rounded-lg border border-[#e8e0d6] px-4 py-2 text-sm focus:border-[#b97844] focus:outline-none pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#a0968c] hover:text-[#b97844]"
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>
              </div>
            )}

            <div className="flex items-start gap-4">
              <Briefcase size={18} className="text-[#b97844] mt-0.5" />
              <div>
                <p className="text-xs font-semibold text-[#6b5f54] uppercase tracking-wide">Role & Permissions</p>
                <p className="text-[#3f3328] font-medium mt-1 capitalize">{adminRecord?.role || 'Admin'}</p>
                <p className="text-sm text-[#6b5f54] mt-1">Full access to users, menu, orders, reports, and settings</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}