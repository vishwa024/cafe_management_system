// import { useEffect, useMemo, useState } from 'react';
// import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
// import { Search, Plus, UserX, UserCheck, X, Pencil, Eye, EyeOff, Trash2, Mail, Phone, Shield } from 'lucide-react';
// import toast from 'react-hot-toast';
// import api from '../../services/api';
// import AdminSidebar from '../../components/admin/AdminSidebar';
// import AdminPagination from '../../components/admin/AdminPagination';

// const TEAM_ROLES = ['admin', 'manager', 'staff', 'kitchen', 'delivery'];
// const CREATABLE_ROLES = ['manager', 'staff', 'kitchen', 'delivery'];
// const VEHICLE_TYPES = ['bike', 'scooter', 'cycle'];
// const PAGE_SIZE = 6;

// const ROLE_COLORS = {
//   admin: 'badge-danger',
//   manager: 'bg-orange-100 text-orange-700 badge',
//   staff: 'badge-info',
//   kitchen: 'badge-primary',
//   delivery: 'bg-amber-100 text-amber-700 badge',
// };

// const EMPTY_USER_FORM = {
//   name: '',
//   email: '',
//   phone: '',
//   password: '',
//   role: 'staff',
//   vehicleType: 'bike',
// };

// const EMPTY_DELETE_FORM = {
//   user: null,
//   reason: '',
//   notifyEmail: true,
//   notifySms: false,
// };

// const ROLES_REQUIRING_DELETE_NOTE = ['manager', 'staff'];

// export default function UserManagement() {
//   const queryClient = useQueryClient();
//   const [search, setSearch] = useState('');
//   const [roleFilter, setRoleFilter] = useState('all');
//   const [showModal, setShowModal] = useState(false);
//   const [editingUserId, setEditingUserId] = useState(null);
//   const [selectedUser, setSelectedUser] = useState(null);
//   const [formUser, setFormUser] = useState(EMPTY_USER_FORM);
//   const [page, setPage] = useState(1);
//   const [showPassword, setShowPassword] = useState(false);
//   const [deleteForm, setDeleteForm] = useState(EMPTY_DELETE_FORM);

//   const { data: users = [] } = useQuery({
//     queryKey: ['admin-users'],
//     queryFn: () => api.get('/admin/users').then((r) => r.data),
//     refetchInterval: 15000,
//   });

//   const teamUsers = useMemo(() => users.filter((user) => TEAM_ROLES.includes(user.role)), [users]);

//   const filteredUsers = useMemo(() => {
//     const query = search.toLowerCase();
//     return teamUsers.filter((user) => {
//       const matchesSearch =
//         user.name?.toLowerCase().includes(query) ||
//         user.email?.toLowerCase().includes(query) ||
//         user.phone?.toLowerCase().includes(query);

//       const matchesRole = roleFilter === 'all' || user.role === roleFilter;
//       return matchesSearch && matchesRole;
//     });
//   }, [teamUsers, search, roleFilter]);

//   const counts = useMemo(() => ({
//     all: teamUsers.length,
//     admin: teamUsers.filter((u) => u.role === 'admin').length,
//     manager: teamUsers.filter((u) => u.role === 'manager').length,
//     staff: teamUsers.filter((u) => u.role === 'staff').length,
//     kitchen: teamUsers.filter((u) => u.role === 'kitchen').length,
//     delivery: teamUsers.filter((u) => u.role === 'delivery').length,
//   }), [teamUsers]);

//   useEffect(() => {
//     setPage(1);
//   }, [search, roleFilter]);

//   const totalPages = Math.max(1, Math.ceil(filteredUsers.length / PAGE_SIZE));
//   const paginatedUsers = useMemo(
//     () => filteredUsers.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE),
//     [filteredUsers, page]
//   );

//   useEffect(() => {
//     if (page > totalPages) setPage(totalPages);
//   }, [page, totalPages]);

//   useEffect(() => {
//     if (selectedUser) {
//       const latest = users.find((user) => user._id === selectedUser._id);
//       if (latest) setSelectedUser(latest);
//     }
//   }, [users, selectedUser]);

//   const createMutation = useMutation({
//     mutationFn: (payload) => api.post('/admin/users', payload),
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ['admin-users'] });
//       queryClient.invalidateQueries({ queryKey: ['admin-dashboard'] });
//       setShowModal(false);
//       setEditingUserId(null);
//       setFormUser(EMPTY_USER_FORM);
//       setShowPassword(false);
//       toast.success('User created');
//     },
//     onError: (error) => toast.error(error.response?.data?.message || 'Failed to create user'),
//   });

//   const updateMutation = useMutation({
//     mutationFn: ({ id, payload }) => api.put(`/admin/users/${id}`, payload),
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ['admin-users'] });
//       queryClient.invalidateQueries({ queryKey: ['admin-dashboard'] });
//       setShowModal(false);
//       setEditingUserId(null);
//       setFormUser(EMPTY_USER_FORM);
//       setShowPassword(false);
//       toast.success('User updated');
//     },
//     onError: (error) => toast.error(error.response?.data?.message || 'Failed to update user'),
//   });

//   const toggleMutation = useMutation({
//     mutationFn: ({ id, isActive }) => api.put(`/admin/users/${id}`, { isActive }),
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ['admin-users'] });
//       queryClient.invalidateQueries({ queryKey: ['admin-dashboard'] });
//       toast.success('User status updated');
//     },
//     onError: (error) => toast.error(error.response?.data?.message || 'Failed to update user'),
//   });

//   const deleteMutation = useMutation({
//     mutationFn: ({ id, payload }) => api.delete(`/admin/users/${id}`, { data: payload }),
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ['admin-users'] });
//       queryClient.invalidateQueries({ queryKey: ['admin-dashboard'] });
//       setDeleteForm(EMPTY_DELETE_FORM);
//       toast.success('User deleted');
//     },
//     onError: (error) => toast.error(error.response?.data?.message || 'Failed to delete user'),
//   });

//   const isEditing = Boolean(editingUserId);

//   const openCreateModal = () => {
//     setEditingUserId(null);
//     setFormUser(EMPTY_USER_FORM);
//     setShowPassword(false);
//     setShowModal(true);
//   };

//   const openEditModal = (user) => {
//     setEditingUserId(user._id);
//     setFormUser({
//       name: user.name || '',
//       email: user.email || '',
//       phone: user.phone || '',
//       password: '',
//       role: user.role || 'staff',
//       vehicleType: user.vehicleType || 'bike',
//     });
//     setShowPassword(false);
//     setShowModal(true);
//   };

//   const closeModal = () => {
//     setShowModal(false);
//     setEditingUserId(null);
//     setFormUser(EMPTY_USER_FORM);
//     setShowPassword(false);
//   };

//   const handleSubmit = () => {
//     const payload = {
//       name: formUser.name,
//       email: formUser.email,
//       phone: formUser.phone,
//       role: formUser.role,
//       ...(formUser.role === 'delivery' ? { vehicleType: formUser.vehicleType } : { vehicleType: null }),
//     };

//     if (formUser.password.trim()) payload.password = formUser.password;

//     if (isEditing) {
//       updateMutation.mutate({ id: editingUserId, payload });
//       return;
//     }

//     createMutation.mutate({
//       ...payload,
//       password: formUser.password,
//     });
//   };

//   const handleDeleteUser = (user) => {
//     if (!ROLES_REQUIRING_DELETE_NOTE.includes(user.role)) {
//       const shouldDelete = window.confirm(`Delete ${user.role} user ${user.name}? This action cannot be undone.`);
//       if (!shouldDelete) return;
//       deleteMutation.mutate({ id: user._id, payload: {} });
//       return;
//     }

//     setDeleteForm({
//       user,
//       reason: '',
//       notifyEmail: true,
//       notifySms: false,
//     });
//   };

//   return (
//     <div className="flex min-h-screen bg-gray-50 font-body">
//       <AdminSidebar />

//       <main className="flex-1 overflow-auto p-6 lg:p-8">
//         <div className="mb-6 flex items-center justify-between gap-4">
//           <div>
//             <h1 className="font-display text-4xl font-bold text-dark">Team & Staff</h1>
//             <p className="mt-2 text-gray-500">
//               Compact team records. Click any row to open full information.
//             </p>
//           </div>

//           <button onClick={openCreateModal} className="btn-primary flex items-center gap-2">
//             <Plus size={18} /> Add User
//           </button>
//         </div>

//         <div className="mb-5 flex flex-wrap gap-3">
//           {['all', 'admin', 'manager', 'staff', 'kitchen', 'delivery'].map((role) => (
//             <button
//               key={role}
//               onClick={() => setRoleFilter(role)}
//               className={`rounded-full border px-4 py-2 text-sm font-semibold capitalize transition-all ${
//                 roleFilter === role
//                   ? 'border-primary bg-primary text-white'
//                   : 'border-gray-200 bg-white text-gray-700 hover:border-primary'
//               }`}
//             >
//               {role}: {counts[role]}
//             </button>
//           ))}
//         </div>

//         <div className="relative mb-6">
//           <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-primary" />
//           <input
//             value={search}
//             onChange={(e) => setSearch(e.target.value)}
//             placeholder="Search by name, email or phone..."
//             className="input-field h-12 rounded-2xl pl-12"
//           />
//         </div>

//         <section className="card overflow-hidden">
//           <div className="overflow-x-auto">
//             <table className="min-w-full text-sm">
//               <thead className="bg-gray-50 text-left text-gray-500">
//                 <tr>
//                   <th className="px-5 py-4 font-semibold">Name</th>
//                   <th className="px-5 py-4 font-semibold">Email</th>
//                   <th className="px-5 py-4 font-semibold">Phone</th>
//                   <th className="px-5 py-4 font-semibold">Role</th>
//                   <th className="px-5 py-4 font-semibold">Status</th>
//                   <th className="px-5 py-4 font-semibold">Joined</th>
//                   <th className="px-5 py-4 font-semibold text-right">Actions</th>
//                 </tr>
//               </thead>
//               <tbody className="divide-y divide-gray-100 bg-white">
//                 {paginatedUsers.map((user) => (
//                   <tr key={user._id} onClick={() => setSelectedUser(user)} className="cursor-pointer hover:bg-gray-50">
//                     <td className="px-5 py-4">
//                       <div className="flex items-center gap-3">
//                         <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10 font-bold text-primary">
//                           {user.name?.slice(0, 2).toUpperCase() || 'U'}
//                         </div>
//                         <div>
//                           <p className="font-semibold text-dark">{user.name}</p>
//                           {user.role === 'delivery' && user.vehicleType ? (
//                             <p className="mt-1 text-xs capitalize text-gray-400">{user.vehicleType}</p>
//                           ) : null}
//                         </div>
//                       </div>
//                     </td>
//                     <td className="px-5 py-4 text-gray-600">{user.email || 'No email'}</td>
//                     <td className="px-5 py-4 text-gray-600">{user.phone || '-'}</td>
//                     <td className="px-5 py-4">
//                       <span className={`badge capitalize ${ROLE_COLORS[user.role] || 'badge-primary'}`}>
//                         {user.role}
//                       </span>
//                     </td>
//                     <td className="px-5 py-4">
//                       <span className={`font-medium ${user.isActive ? 'text-green-600' : 'text-red-500'}`}>
//                         {user.isActive ? 'Active' : 'Inactive'}
//                       </span>
//                     </td>
//                     <td className="px-5 py-4 text-gray-600">{new Date(user.createdAt).toLocaleDateString('en-IN')}</td>
//                     <td className="px-5 py-4">
//                       <div className="flex items-center justify-end gap-2">
//                         <button
//                           onClick={(e) => {
//                             e.stopPropagation();
//                             openEditModal(user);
//                           }}
//                           className="rounded-lg p-2 text-primary transition-colors hover:bg-primary/10"
//                           title="Edit user"
//                         >
//                           <Pencil size={18} />
//                         </button>

//                         <button
//                           onClick={(e) => {
//                             e.stopPropagation();
//                             handleDeleteUser(user);
//                           }}
//                           className="rounded-lg p-2 text-red-500 transition-colors hover:bg-red-50"
//                           title="Delete user"
//                         >
//                           <Trash2 size={18} />
//                         </button>

//                         <button
//                           onClick={(e) => {
//                             e.stopPropagation();
//                             toggleMutation.mutate({ id: user._id, isActive: !user.isActive });
//                           }}
//                           className={`rounded-lg p-2 transition-colors ${user.isActive ? 'text-red-400 hover:bg-red-50' : 'text-green-500 hover:bg-green-50'}`}
//                           title={user.isActive ? 'Deactivate user' : 'Activate user'}
//                         >
//                           {user.isActive ? <UserX size={18} /> : <UserCheck size={18} />}
//                         </button>
//                       </div>
//                     </td>
//                   </tr>
//                 ))}
//                 {!filteredUsers.length ? (
//                   <tr>
//                     <td colSpan="7" className="px-5 py-12 text-center text-gray-400">
//                       No team members found.
//                     </td>
//                   </tr>
//                 ) : null}
//               </tbody>
//             </table>
//           </div>
//         </section>

//         <div className="mt-6">
//           <AdminPagination
//             page={page}
//             totalPages={totalPages}
//             totalItems={filteredUsers.length}
//             pageSize={PAGE_SIZE}
//             label="team members"
//             onPageChange={setPage}
//           />
//         </div>

//         {selectedUser ? (
//           <div
//             className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-4"
//             onClick={(e) => e.target === e.currentTarget && setSelectedUser(null)}
//           >
//             <div className="w-full max-w-2xl rounded-3xl bg-white p-6 shadow-2xl">
//               <div className="mb-5 flex items-start justify-between gap-4 border-b border-gray-100 pb-5">
//                 <div>
//                   <h2 className="font-display text-3xl font-bold text-dark">{selectedUser.name}</h2>
//                   <p className="mt-2">
//                     <span className={`badge capitalize ${ROLE_COLORS[selectedUser.role] || 'badge-primary'}`}>
//                       {selectedUser.role}
//                     </span>
//                   </p>
//                 </div>
//                 <button onClick={() => setSelectedUser(null)} className="rounded-xl bg-gray-100 p-2 text-gray-400">
//                   <X size={18} />
//                 </button>
//               </div>

//               <div className="grid gap-4 md:grid-cols-2">
//                 <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
//                   <div className="flex items-start gap-3">
//                     <Mail size={16} className="mt-1 text-gray-400" />
//                     <div>
//                       <p className="text-xs uppercase tracking-wide text-gray-400">Email</p>
//                       <p className="mt-1 font-medium text-dark">{selectedUser.email || 'No email'}</p>
//                     </div>
//                   </div>
//                 </div>

//                 <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
//                   <div className="flex items-start gap-3">
//                     <Phone size={16} className="mt-1 text-gray-400" />
//                     <div>
//                       <p className="text-xs uppercase tracking-wide text-gray-400">Phone</p>
//                       <p className="mt-1 font-medium text-dark">{selectedUser.phone || '-'}</p>
//                     </div>
//                   </div>
//                 </div>

//                 <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
//                   <div className="flex items-start gap-3">
//                     <Shield size={16} className="mt-1 text-gray-400" />
//                     <div>
//                       <p className="text-xs uppercase tracking-wide text-gray-400">Status</p>
//                       <p className={`mt-1 font-medium ${selectedUser.isActive ? 'text-green-600' : 'text-red-500'}`}>
//                         {selectedUser.isActive ? 'Active' : 'Inactive'}
//                       </p>
//                     </div>
//                   </div>
//                 </div>

//                 <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
//                   <p className="text-xs uppercase tracking-wide text-gray-400">Joined</p>
//                   <p className="mt-1 font-medium text-dark">
//                     {new Date(selectedUser.createdAt).toLocaleString('en-IN')}
//                   </p>
//                   {selectedUser.vehicleType ? (
//                     <p className="mt-2 text-sm capitalize text-gray-500">Vehicle: {selectedUser.vehicleType}</p>
//                   ) : null}
//                 </div>
//               </div>

//               <div className="mt-5 flex flex-wrap justify-end gap-3">
//                 <button
//                   onClick={() => {
//                     setSelectedUser(null);
//                     openEditModal(selectedUser);
//                   }}
//                   className="rounded-xl border border-primary px-4 py-2 font-semibold text-primary"
//                 >
//                   Edit User
//                 </button>
//                 <button
//                   onClick={() => toggleMutation.mutate({ id: selectedUser._id, isActive: !selectedUser.isActive })}
//                   className="rounded-xl bg-gray-900 px-4 py-2 font-semibold text-white"
//                 >
//                   {selectedUser.isActive ? 'Deactivate' : 'Activate'}
//                 </button>
//               </div>
//             </div>
//           </div>
//         ) : null}

//         {deleteForm.user ? (
//           <div
//             className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
//             onClick={(e) => e.target === e.currentTarget && setDeleteForm(EMPTY_DELETE_FORM)}
//           >
//             <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
//               <div className="mb-4 flex items-center justify-between">
//                 <h2 className="font-display text-xl font-bold text-dark">Delete User</h2>
//                 <button onClick={() => setDeleteForm(EMPTY_DELETE_FORM)}>
//                   <X size={20} className="text-gray-400" />
//                 </button>
//               </div>

//               <p className="mb-4 text-sm text-gray-600">
//                 Tell <span className="font-semibold text-dark">{deleteForm.user.name}</span> why the {deleteForm.user.role} account is being removed.
//               </p>

//               <div className="space-y-4">
//                 <textarea
//                   value={deleteForm.reason}
//                   onChange={(e) => setDeleteForm((prev) => ({ ...prev, reason: e.target.value }))}
//                   placeholder="Enter deletion reason"
//                   rows={4}
//                   className="input-field resize-none"
//                 />

//                 <label className="flex items-center gap-3 text-sm text-gray-700">
//                   <input
//                     type="checkbox"
//                     checked={deleteForm.notifyEmail}
//                     onChange={(e) => setDeleteForm((prev) => ({ ...prev, notifyEmail: e.target.checked }))}
//                   />
//                   Send reason by email
//                 </label>

//                 <label className="flex items-center gap-3 text-sm text-gray-700">
//                   <input
//                     type="checkbox"
//                     checked={deleteForm.notifySms}
//                     onChange={(e) => setDeleteForm((prev) => ({ ...prev, notifySms: e.target.checked }))}
//                   />
//                   Send reason by SMS
//                 </label>

//                 <button
//                   onClick={() =>
//                     deleteMutation.mutate({
//                       id: deleteForm.user._id,
//                       payload: {
//                         reason: deleteForm.reason,
//                         notifyEmail: deleteForm.notifyEmail,
//                         notifySms: deleteForm.notifySms,
//                       },
//                     })
//                   }
//                   disabled={deleteMutation.isPending || !deleteForm.reason.trim()}
//                   className="w-full rounded-xl bg-red-600 px-4 py-3 font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
//                 >
//                   {deleteMutation.isPending ? 'Deleting...' : 'Delete User'}
//                 </button>
//               </div>
//             </div>
//           </div>
//         ) : null}

//         {showModal ? (
//           <div
//             className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
//             onClick={(e) => e.target === e.currentTarget && closeModal()}
//           >
//             <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
//               <div className="mb-5 flex items-center justify-between">
//                 <h2 className="font-display text-xl font-bold text-dark">
//                   {isEditing ? 'Edit User' : 'Add User'}
//                 </h2>
//                 <button onClick={closeModal}>
//                   <X size={20} className="text-gray-400" />
//                 </button>
//               </div>

//               <div className="space-y-4">
//                 <input
//                   value={formUser.name}
//                   onChange={(e) => setFormUser((prev) => ({ ...prev, name: e.target.value }))}
//                   placeholder="Full Name"
//                   className="input-field"
//                 />

//                 <input
//                   value={formUser.email}
//                   onChange={(e) => setFormUser((prev) => ({ ...prev, email: e.target.value }))}
//                   placeholder="Email"
//                   type="email"
//                   className="input-field"
//                 />

//                 <input
//                   value={formUser.phone}
//                   onChange={(e) => setFormUser((prev) => ({ ...prev, phone: e.target.value }))}
//                   placeholder="Phone"
//                   className="input-field"
//                 />

//                 <div className="relative">
//                   <input
//                     value={formUser.password}
//                     onChange={(e) => setFormUser((prev) => ({ ...prev, password: e.target.value }))}
//                     placeholder={isEditing ? 'New Password (optional)' : 'Password'}
//                     type={showPassword ? 'text' : 'password'}
//                     className="input-field pr-12"
//                   />
//                   <button
//                     type="button"
//                     onClick={() => setShowPassword((prev) => !prev)}
//                     className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary"
//                   >
//                     {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
//                   </button>
//                 </div>

//                 <select
//                   value={formUser.role}
//                   onChange={(e) => setFormUser((prev) => ({ ...prev, role: e.target.value }))}
//                   className="input-field capitalize"
//                   disabled={isEditing && formUser.role === 'admin'}
//                 >
//                   {(isEditing && formUser.role === 'admin' ? ['admin', ...CREATABLE_ROLES] : CREATABLE_ROLES).map((role) => (
//                     <option key={role} value={role} className="capitalize">
//                       {role}
//                     </option>
//                   ))}
//                 </select>

//                 {formUser.role === 'delivery' ? (
//                   <select
//                     value={formUser.vehicleType}
//                     onChange={(e) => setFormUser((prev) => ({ ...prev, vehicleType: e.target.value }))}
//                     className="input-field capitalize"
//                   >
//                     {VEHICLE_TYPES.map((type) => (
//                       <option key={type} value={type} className="capitalize">
//                         {type}
//                       </option>
//                     ))}
//                   </select>
//                 ) : null}

//                 <button
//                   onClick={handleSubmit}
//                   disabled={createMutation.isPending || updateMutation.isPending}
//                   className="btn-primary w-full"
//                 >
//                   {createMutation.isPending || updateMutation.isPending
//                     ? (isEditing ? 'Saving...' : 'Creating...')
//                     : (isEditing ? 'Save Changes' : 'Create User')}
//                 </button>
//               </div>
//             </div>
//           </div>
//         ) : null}
//       </main>
//     </div>
//   );
// }
import { useEffect, useMemo, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Search, Plus, UserX, UserCheck, X, Pencil, Eye, EyeOff, Trash2, Mail, Phone, Shield, Briefcase } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../services/api';
import AdminSidebar from '../../components/admin/AdminSidebar';
import AdminPagination from '../../components/admin/AdminPagination';

const TEAM_ROLES = ['admin', 'manager', 'staff', 'kitchen', 'delivery'];
const CREATABLE_ROLES = ['manager', 'staff', 'kitchen', 'delivery'];
const VEHICLE_TYPES = ['bike', 'scooter', 'cycle'];
const PAGE_SIZE = 8;

const ROLE_COLORS = {
  admin: 'bg-red-100 text-red-700',
  manager: 'bg-orange-100 text-orange-700',
  staff: 'bg-blue-100 text-blue-700',
  kitchen: 'bg-emerald-100 text-emerald-700',
  delivery: 'bg-amber-100 text-amber-700',
};

const EMPTY_USER_FORM = { name: '', email: '', phone: '', password: '', role: 'staff', vehicleType: 'bike' };
const EMPTY_DELETE_FORM = { user: null, reason: '', notifyEmail: true, notifySms: false };
const ROLES_REQUIRING_DELETE_NOTE = ['manager', 'staff'];
const getPresenceBadge = (user = {}) => {
  if (!user.isActive) {
    return { label: 'Inactive', className: 'bg-red-100 text-red-700' };
  }
  if (user.liveStatus === 'online') {
    return { label: 'Online', className: 'bg-emerald-100 text-emerald-700' };
  }
  return { label: 'Offline', className: 'bg-gray-100 text-gray-600' };
};

export default function UserManagement() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [editingUserId, setEditingUserId] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [formUser, setFormUser] = useState(EMPTY_USER_FORM);
  const [page, setPage] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [deleteForm, setDeleteForm] = useState(EMPTY_DELETE_FORM);

  const { data: users = [] } = useQuery({
    queryKey: ['admin-users'],
    queryFn: () => api.get('/admin/users').then((r) => r.data),
    refetchInterval: 15000,
  });
  const { data: onlineUsers = [] } = useQuery({
    queryKey: ['presence-online-users'],
    queryFn: () => api.get('/presence/online-users').then((r) => r.data),
    refetchInterval: 10000,
  });

  const teamUsers = useMemo(() => {
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
      .filter((user) => TEAM_ROLES.includes(user.role))
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

  const filteredUsers = useMemo(() => {
    const query = search.toLowerCase();
    return teamUsers.filter((user) => {
      const matchesSearch = user.name?.toLowerCase().includes(query) || user.email?.toLowerCase().includes(query) || user.phone?.toLowerCase().includes(query);
      const matchesRole = roleFilter === 'all' || user.role === roleFilter;
      return matchesSearch && matchesRole;
    });
  }, [teamUsers, search, roleFilter]);

  const counts = useMemo(() => ({
    all: teamUsers.length, admin: teamUsers.filter(u => u.role === 'admin').length,
    manager: teamUsers.filter(u => u.role === 'manager').length, staff: teamUsers.filter(u => u.role === 'staff').length,
    kitchen: teamUsers.filter(u => u.role === 'kitchen').length, delivery: teamUsers.filter(u => u.role === 'delivery').length,
  }), [teamUsers]);

  useEffect(() => setPage(1), [search, roleFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredUsers.length / PAGE_SIZE));
  const paginatedUsers = useMemo(() => filteredUsers.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE), [filteredUsers, page]);

  useEffect(() => { if (page > totalPages) setPage(totalPages); }, [page, totalPages]);
  useEffect(() => { if (selectedUser) { const latest = teamUsers.find(u => u._id === selectedUser._id); if (latest) setSelectedUser(latest); } }, [teamUsers, selectedUser]);

  const createMutation = useMutation({
    mutationFn: (payload) => api.post('/admin/users', payload),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['admin-users'] }); setShowModal(false); setEditingUserId(null); setFormUser(EMPTY_USER_FORM); setShowPassword(false); toast.success('User created'); },
    onError: (error) => toast.error(error.response?.data?.message || 'Failed to create user'),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }) => api.put(`/admin/users/${id}`, payload),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['admin-users'] }); setShowModal(false); setEditingUserId(null); setFormUser(EMPTY_USER_FORM); setShowPassword(false); toast.success('User updated'); },
    onError: (error) => toast.error(error.response?.data?.message || 'Failed to update user'),
  });

  const toggleMutation = useMutation({
    mutationFn: ({ id, isActive }) => api.put(`/admin/users/${id}`, { isActive }),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['admin-users'] }); toast.success('Status updated'); },
    onError: (error) => toast.error(error.response?.data?.message || 'Failed to update status'),
  });

  const deleteMutation = useMutation({
    mutationFn: ({ id, payload }) => api.delete(`/admin/users/${id}`, { data: payload }),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['admin-users'] }); setDeleteForm(EMPTY_DELETE_FORM); toast.success('User deleted'); },
    onError: (error) => toast.error(error.response?.data?.message || 'Failed to delete user'),
  });

  const openCreateModal = () => { setEditingUserId(null); setFormUser(EMPTY_USER_FORM); setShowPassword(false); setShowModal(true); };
  const openEditModal = (user) => { setEditingUserId(user._id); setFormUser({ name: user.name || '', email: user.email || '', phone: user.phone || '', password: '', role: user.role || 'staff', vehicleType: user.vehicleType || 'bike' }); setShowPassword(false); setShowModal(true); };
  const closeModal = () => { setShowModal(false); setEditingUserId(null); setFormUser(EMPTY_USER_FORM); setShowPassword(false); };

  const handleSubmit = () => {
    const payload = { name: formUser.name, email: formUser.email, phone: formUser.phone, role: formUser.role, ...(formUser.role === 'delivery' ? { vehicleType: formUser.vehicleType } : { vehicleType: null }) };
    if (formUser.password.trim()) payload.password = formUser.password;
    if (editingUserId) updateMutation.mutate({ id: editingUserId, payload });
    else createMutation.mutate({ ...payload, password: formUser.password });
  };

  const handleDeleteUser = (user) => {
    if (!ROLES_REQUIRING_DELETE_NOTE.includes(user.role)) {
      if (window.confirm(`Delete ${user.role} user ${user.name}?`)) deleteMutation.mutate({ id: user._id, payload: {} });
      return;
    }
    setDeleteForm({ user, reason: '', notifyEmail: true, notifySms: false });
  };

  return (
    <div className="flex min-h-screen bg-[#faf8f5]">
      <AdminSidebar />
      <main className="flex-1 p-6 lg:p-8 overflow-auto">
        <div className="mb-6 flex items-center justify-between gap-4">
          <div><h1 className="font-display text-3xl font-bold text-[#3f3328]">Team & Staff</h1><p className="text-sm text-[#6b5f54] mt-1">Manage your team members and their roles</p></div>
          <button onClick={openCreateModal} className="inline-flex items-center gap-2 rounded-xl bg-[#b97844] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#9e6538] transition-all"><Plus size={16} /> Add User</button>
        </div>

        <div className="flex flex-wrap gap-2 mb-5">
          {['all', 'admin', 'manager', 'staff', 'kitchen', 'delivery'].map((role) => (
            <button key={role} onClick={() => setRoleFilter(role)} className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${roleFilter === role ? 'bg-[#b97844] text-white' : 'bg-white border border-[#e8e0d6] text-[#6b5f54] hover:border-[#b97844] hover:text-[#b97844]'}`}>
              {role}: {counts[role]}
            </button>
          ))}
        </div>

        <div className="relative mb-5"><Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#a0968c]" /><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by name, email or phone..." className="w-full rounded-xl border border-[#e8e0d6] bg-white py-2 pl-10 pr-3 text-sm focus:border-[#b97844] focus:outline-none" /></div>

        <div className="bg-white border border-[#e8e0d6] rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-[#faf8f5] text-[#6b5f54] border-b border-[#e8e0d6]"><tr><th className="px-4 py-3 text-left">Name</th><th className="px-4 py-3 text-left">Email</th><th className="px-4 py-3 text-left">Phone</th><th className="px-4 py-3 text-left">Role</th><th className="px-4 py-3 text-left">Status</th><th className="px-4 py-3 text-right">Actions</th></tr></thead>
              <tbody className="divide-y divide-[#e8e0d6]">
                {paginatedUsers.map((user) => (
                  <tr key={user._id} onClick={() => setSelectedUser(user)} className="cursor-pointer hover:bg-[#faf8f5] transition-all">
                    <td className="px-4 py-3"><div className="flex items-center gap-2"><div className="w-8 h-8 rounded-full bg-[#b97844]/10 flex items-center justify-center"><span className="text-sm font-bold text-[#b97844]">{user.name?.slice(0, 2).toUpperCase()}</span></div><span className="font-medium text-[#3f3328]">{user.name}</span>{user.vehicleType && <span className="text-xs text-[#a0968c]">({user.vehicleType})</span>}</div></td>
                    <td className="px-4 py-3 text-[#6b5f54]">{user.email || '-'}</td>
                    <td className="px-4 py-3 text-[#6b5f54]">{user.phone || '-'}</td>
                    <td className="px-4 py-3"><span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${ROLE_COLORS[user.role] || 'bg-gray-100 text-gray-700'}`}>{user.role}</span></td>
                    <td className="px-4 py-3">{(() => { const badge = getPresenceBadge(user); return <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${badge.className}`}>{badge.label}</span>; })()}</td>
                    <td className="px-4 py-3"><div className="flex items-center justify-end gap-1"><button onClick={(e) => { e.stopPropagation(); openEditModal(user); }} className="p-1.5 rounded-lg text-[#b97844] hover:bg-[#faf8f5]"><Pencil size={14} /></button><button onClick={(e) => { e.stopPropagation(); handleDeleteUser(user); }} className="p-1.5 rounded-lg text-red-500 hover:bg-red-50"><Trash2 size={14} /></button><button onClick={(e) => { e.stopPropagation(); toggleMutation.mutate({ id: user._id, isActive: !user.isActive }); }} className="p-1.5 rounded-lg transition-all hover:bg-[#faf8f5]">{user.isActive ? <UserX size={14} className="text-red-400" /> : <UserCheck size={14} className="text-green-500" />}</button></div></td>
                  </tr>
                ))}
                {!filteredUsers.length && <tr><td colSpan="6" className="px-4 py-12 text-center text-[#a0968c]">No team members found</td></tr>}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-6"><AdminPagination page={page} totalPages={totalPages} totalItems={filteredUsers.length} pageSize={PAGE_SIZE} label="team members" onPageChange={setPage} /></div>

        {/* User Detail Modal */}
        {selectedUser && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={(e) => e.target === e.currentTarget && setSelectedUser(null)}>
            <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl">
              <div className="flex items-center justify-between p-5 border-b border-[#e8e0d6]"><div><h2 className="font-display text-xl font-bold text-[#3f3328]">{selectedUser.name}</h2><p className="text-xs text-[#b97844]">{selectedUser.role}</p></div><button onClick={() => setSelectedUser(null)} className="p-1.5 rounded-lg hover:bg-[#faf8f5]"><X size={18} /></button></div>
              <div className="p-5 space-y-4"><div className="flex items-center gap-3 pb-3 border-b border-[#e8e0d6]"><Mail size={16} className="text-[#a0968c]" /><div><p className="text-xs text-[#6b5f54]">Email</p><p className="text-sm font-medium">{selectedUser.email || '-'}</p></div></div><div className="flex items-center gap-3 pb-3 border-b border-[#e8e0d6]"><Phone size={16} className="text-[#a0968c]" /><div><p className="text-xs text-[#6b5f54]">Phone</p><p className="text-sm font-medium">{selectedUser.phone || '-'}</p></div></div><div className="flex items-center gap-3 pb-3 border-b border-[#e8e0d6]"><Shield size={16} className="text-[#a0968c]" /><div><p className="text-xs text-[#6b5f54]">Status</p>{(() => { const badge = getPresenceBadge(selectedUser); return <p className={`text-sm font-medium ${badge.className.includes('emerald') ? 'text-emerald-600' : badge.className.includes('red') ? 'text-red-600' : 'text-gray-600'}`}>{badge.label}</p>; })()}{selectedUser.currentPanel ? <p className="text-xs text-[#a0968c] mt-1">Active in {selectedUser.currentPanel}</p> : null}</div></div><div className="flex items-center gap-3"><Briefcase size={16} className="text-[#a0968c]" /><div><p className="text-xs text-[#6b5f54]">Joined</p><p className="text-sm font-medium">{new Date(selectedUser.createdAt).toLocaleDateString()}</p></div></div></div>
              <div className="flex justify-end gap-3 p-5 border-t border-[#e8e0d6]"><button onClick={() => { setSelectedUser(null); openEditModal(selectedUser); }} className="px-4 py-2 rounded-lg border border-[#b97844] text-[#b97844] hover:bg-[#b97844] hover:text-white transition-all">Edit</button><button onClick={() => toggleMutation.mutate({ id: selectedUser._id, isActive: !selectedUser.isActive })} className="px-4 py-2 rounded-lg bg-[#3f3328] text-white hover:bg-[#b97844] transition-all">{selectedUser.isActive ? 'Deactivate' : 'Activate'}</button></div>
            </div>
          </div>
        )}

        {/* Delete Modal */}
        {deleteForm.user && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={(e) => e.target === e.currentTarget && setDeleteForm(EMPTY_DELETE_FORM)}>
            <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-6">
              <div className="flex items-center justify-between mb-4"><h2 className="font-display text-xl font-bold text-[#3f3328]">Delete User</h2><button onClick={() => setDeleteForm(EMPTY_DELETE_FORM)}><X size={18} className="text-[#a0968c]" /></button></div>
              <p className="text-sm text-[#6b5f54] mb-4">Tell <span className="font-semibold text-[#3f3328]">{deleteForm.user.name}</span> why the account is being removed.</p>
              <textarea value={deleteForm.reason} onChange={(e) => setDeleteForm(prev => ({ ...prev, reason: e.target.value }))} placeholder="Enter deletion reason" rows={3} className="w-full rounded-lg border border-[#e8e0d6] p-3 text-sm focus:border-[#b97844] focus:outline-none resize-none mb-4" />
              <label className="flex items-center gap-2 text-sm text-[#6b5f54] mb-2"><input type="checkbox" checked={deleteForm.notifyEmail} onChange={(e) => setDeleteForm(prev => ({ ...prev, notifyEmail: e.target.checked }))} /> Send reason by email</label>
              <label className="flex items-center gap-2 text-sm text-[#6b5f54] mb-4"><input type="checkbox" checked={deleteForm.notifySms} onChange={(e) => setDeleteForm(prev => ({ ...prev, notifySms: e.target.checked }))} /> Send reason by SMS</label>
              <button onClick={() => deleteMutation.mutate({ id: deleteForm.user._id, payload: { reason: deleteForm.reason, notifyEmail: deleteForm.notifyEmail, notifySms: deleteForm.notifySms } })} disabled={deleteMutation.isPending || !deleteForm.reason.trim()} className="w-full rounded-xl bg-red-500 py-2.5 text-white font-medium hover:bg-red-600 disabled:opacity-50 transition-all">{deleteMutation.isPending ? 'Deleting...' : 'Delete User'}</button>
            </div>
          </div>
        )}

        {/* Create/Edit Modal */}
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={(e) => e.target === e.currentTarget && closeModal()}>
            <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-6">
              <div className="flex items-center justify-between mb-5"><h2 className="font-display text-xl font-bold text-[#3f3328]">{editingUserId ? 'Edit User' : 'Add User'}</h2><button onClick={closeModal}><X size={18} className="text-[#a0968c]" /></button></div>
              <div className="space-y-3"><input value={formUser.name} onChange={(e) => setFormUser(prev => ({ ...prev, name: e.target.value }))} placeholder="Full Name" className="w-full rounded-lg border border-[#e8e0d6] p-2.5 text-sm focus:border-[#b97844] focus:outline-none" /><input value={formUser.email} onChange={(e) => setFormUser(prev => ({ ...prev, email: e.target.value }))} placeholder="Email" type="email" className="w-full rounded-lg border border-[#e8e0d6] p-2.5 text-sm focus:border-[#b97844] focus:outline-none" /><input value={formUser.phone} onChange={(e) => setFormUser(prev => ({ ...prev, phone: e.target.value }))} placeholder="Phone" className="w-full rounded-lg border border-[#e8e0d6] p-2.5 text-sm focus:border-[#b97844] focus:outline-none" /><div className="relative"><input value={formUser.password} onChange={(e) => setFormUser(prev => ({ ...prev, password: e.target.value }))} placeholder={editingUserId ? 'New Password (optional)' : 'Password'} type={showPassword ? 'text' : 'password'} className="w-full rounded-lg border border-[#e8e0d6] p-2.5 text-sm focus:border-[#b97844] focus:outline-none pr-8" /><button onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#a0968c]">{showPassword ? <EyeOff size={14} /> : <Eye size={14} />}</button></div>
              <select value={formUser.role} onChange={(e) => setFormUser(prev => ({ ...prev, role: e.target.value }))} className="w-full rounded-lg border border-[#e8e0d6] p-2.5 text-sm focus:border-[#b97844] focus:outline-none capitalize" disabled={editingUserId && formUser.role === 'admin'}>{(editingUserId && formUser.role === 'admin' ? ['admin', ...CREATABLE_ROLES] : CREATABLE_ROLES).map(role => <option key={role} value={role}>{role}</option>)}</select>
              {formUser.role === 'delivery' && <select value={formUser.vehicleType} onChange={(e) => setFormUser(prev => ({ ...prev, vehicleType: e.target.value }))} className="w-full rounded-lg border border-[#e8e0d6] p-2.5 text-sm focus:border-[#b97844] focus:outline-none capitalize">{VEHICLE_TYPES.map(type => <option key={type} value={type}>{type}</option>)}</select>}
              <button onClick={handleSubmit} disabled={createMutation.isPending || updateMutation.isPending} className="w-full rounded-xl bg-[#b97844] py-2.5 text-white font-medium hover:bg-[#9e6538] disabled:opacity-50 transition-all">{createMutation.isPending || updateMutation.isPending ? (editingUserId ? 'Saving...' : 'Creating...') : (editingUserId ? 'Save Changes' : 'Create User')}</button></div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
