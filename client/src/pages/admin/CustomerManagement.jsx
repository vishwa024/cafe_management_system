// import { useEffect, useMemo, useState } from 'react';
// import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
// import { Search, Phone, Pencil, X, Eye, EyeOff, Trash2, Mail, CalendarDays, Star, MessageSquare } from 'lucide-react';
// import toast from 'react-hot-toast';
// import api from '../../services/api';
// import AdminSidebar from '../../components/admin/AdminSidebar';
// import AdminPagination from '../../components/admin/AdminPagination';

// const PAGE_SIZE = 6;
// const EMPTY_CUSTOMER_FORM = {
//   name: '',
//   email: '',
//   phone: '',
//   password: '',
// };

// export default function CustomerManagement() {
//   const queryClient = useQueryClient();
//   const [search, setSearch] = useState('');
//   const [page, setPage] = useState(1);
//   const [showModal, setShowModal] = useState(false);
//   const [selectedCustomer, setSelectedCustomer] = useState(null);
//   const [editingCustomerId, setEditingCustomerId] = useState(null);
//   const [formCustomer, setFormCustomer] = useState(EMPTY_CUSTOMER_FORM);
//   const [showPassword, setShowPassword] = useState(false);
//   const { data: users = [] } = useQuery({
//     queryKey: ['admin-users'],
//     queryFn: () => api.get('/admin/users').then((r) => r.data),
//     refetchInterval: 15000,
//   });

//   const toggleMutation = useMutation({
//     mutationFn: ({ id, isActive }) => api.put(`/admin/users/${id}`, { isActive }),
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ['admin-users'] });
//       queryClient.invalidateQueries({ queryKey: ['admin-dashboard'] });
//       toast.success('Customer status updated');
//     },
//     onError: (error) => toast.error(error.response?.data?.message || 'Failed to update customer'),
//   });

//   const updateMutation = useMutation({
//     mutationFn: ({ id, payload }) => api.put(`/admin/users/${id}`, payload),
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ['admin-users'] });
//       queryClient.invalidateQueries({ queryKey: ['admin-dashboard'] });
//       setShowModal(false);
//       setEditingCustomerId(null);
//       setFormCustomer(EMPTY_CUSTOMER_FORM);
//       setShowPassword(false);
//       toast.success('Customer updated');
//     },
//     onError: (error) => toast.error(error.response?.data?.message || 'Failed to update customer'),
//   });

//   const deleteMutation = useMutation({
//     mutationFn: ({ id, payload }) => api.delete(`/admin/users/${id}`, { data: payload }),
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ['admin-users'] });
//       queryClient.invalidateQueries({ queryKey: ['admin-dashboard'] });
//       toast.success('Customer deleted');
//     },
//     onError: (error) => toast.error(error.response?.data?.message || 'Failed to delete customer'),
//   });

//   const customers = useMemo(() => users.filter((u) => u.role === 'customer'), [users]);

//   const filteredCustomers = useMemo(() => {
//     const query = search.toLowerCase();
//     return customers.filter((u) =>
//       u.name?.toLowerCase().includes(query) ||
//       u.email?.toLowerCase().includes(query) ||
//       u.phone?.toLowerCase().includes(query)
//     );
//   }, [customers, search]);

//   useEffect(() => {
//     setPage(1);
//   }, [search]);

//   const totalPages = Math.max(1, Math.ceil(filteredCustomers.length / PAGE_SIZE));
//   const paginatedCustomers = useMemo(
//     () => filteredCustomers.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE),
//     [filteredCustomers, page]
//   );

//   useEffect(() => {
//     if (page > totalPages) setPage(totalPages);
//   }, [page, totalPages]);

//   useEffect(() => {
//     if (selectedCustomer) {
//       const latest = users.find((user) => user._id === selectedCustomer._id);
//       if (latest) setSelectedCustomer(latest);
//     }
//   }, [users, selectedCustomer]);

//   const openEditModal = (user) => {
//     setEditingCustomerId(user._id);
//     setFormCustomer({
//       name: user.name || '',
//       email: user.email || '',
//       phone: user.phone || '',
//       password: '',
//     });
//     setShowPassword(false);
//     setShowModal(true);
//   };

//   const closeModal = () => {
//     setShowModal(false);
//     setEditingCustomerId(null);
//     setFormCustomer(EMPTY_CUSTOMER_FORM);
//     setShowPassword(false);
//   };

//   const handleSave = () => {
//     const payload = {
//       name: formCustomer.name,
//       email: formCustomer.email,
//       phone: formCustomer.phone,
//       role: 'customer',
//     };

//     if (formCustomer.password.trim()) payload.password = formCustomer.password;

//     updateMutation.mutate({ id: editingCustomerId, payload });
//   };

//   const handleDeleteCustomer = (user) => {
//     const shouldDelete = window.confirm(`Delete customer ${user.name}? This action cannot be undone.`);
//     if (!shouldDelete) return;
//     deleteMutation.mutate({ id: user._id, payload: {} });
//   };

//   return (
//     <div className="flex min-h-screen bg-gray-50 font-body">
//       <AdminSidebar />
//       <main className="flex-1 overflow-auto p-6 lg:p-8">
//         <div className="mb-6">
//           <h1 className="font-display text-4xl font-bold text-dark">Customers</h1>
//           <p className="mt-2 text-gray-500">Customer records in a row-wise table. Click a row to view full details.</p>
//         </div>

//         <div className="mb-5 grid grid-cols-2 gap-4 xl:grid-cols-4">
//           <div className="card p-4">
//             <p className="text-xs uppercase tracking-wide text-gray-500">Total Customers</p>
//             <p className="mt-1 text-2xl font-display font-bold text-dark">{customers.length}</p>
//           </div>
//           <div className="card p-4">
//             <p className="text-xs uppercase tracking-wide text-gray-500">Active Customers</p>
//             <p className="mt-1 text-2xl font-display font-bold text-dark">{customers.filter((u) => u.isActive).length}</p>
//           </div>
//           <div className="card p-4">
//             <p className="text-xs uppercase tracking-wide text-gray-500">Inactive Customers</p>
//             <p className="mt-1 text-2xl font-display font-bold text-dark">{customers.filter((u) => !u.isActive).length}</p>
//           </div>
//           <div className="card p-4">
//             <p className="text-xs uppercase tracking-wide text-gray-500">Verified Email</p>
//             <p className="mt-1 text-2xl font-display font-bold text-dark">{customers.filter((u) => u.isEmailVerified).length}</p>
//           </div>
//         </div>

//         <div className="relative mb-6">
//           <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-primary" />
//           <input
//             value={search}
//             onChange={(e) => setSearch(e.target.value)}
//             placeholder="Search by name, email, or phone..."
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
//                   <th className="px-5 py-4 font-semibold">Rating</th>
//                   <th className="px-5 py-4 font-semibold">Status</th>
//                   <th className="px-5 py-4 font-semibold">Joined</th>
//                   <th className="px-5 py-4 font-semibold text-right">Actions</th>
//                 </tr>
//               </thead>
//               <tbody className="divide-y divide-gray-100 bg-white">
//                 {paginatedCustomers.map((user) => (
//                   <tr key={user._id} onClick={() => setSelectedCustomer(user)} className="cursor-pointer hover:bg-gray-50">
//                     <td className="px-5 py-4">
//                       <div className="flex items-center gap-3">
//                         <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-100 font-bold text-blue-700">
//                           {user.name?.slice(0, 2).toUpperCase() || 'CU'}
//                         </div>
//                         <div>
//                           <p className="font-semibold text-dark">{user.name}</p>
//                           <p className="mt-1 text-xs text-gray-400">Customer</p>
//                         </div>
//                       </div>
//                     </td>
//                     <td className="px-5 py-4 text-gray-600">{user.email || 'No email'}</td>
//                     <td className="px-5 py-4 text-gray-600">{user.phone || '-'}</td>
//                     <td className="px-5 py-4">
//                       <div className="flex items-center gap-2 text-gray-600">
//                         <Star size={15} className="fill-amber-400 text-amber-400" />
//                         <span className="font-medium text-dark">
//                           {user.customerInsights?.averageRating ? user.customerInsights.averageRating.toFixed(1) : '0.0'}
//                         </span>
//                         <span className="text-xs text-gray-400">
//                           ({user.customerInsights?.totalReviews || 0} reviews)
//                         </span>
//                       </div>
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
//                           title="Edit customer"
//                         >
//                           <Pencil size={18} />
//                         </button>
//                         <button
//                           onClick={(e) => {
//                             e.stopPropagation();
//                             handleDeleteCustomer(user);
//                           }}
//                           className="rounded-lg p-2 text-red-500 transition-colors hover:bg-red-50"
//                           title="Delete customer"
//                         >
//                           <Trash2 size={18} />
//                         </button>
//                         <button
//                           onClick={(e) => {
//                             e.stopPropagation();
//                             toggleMutation.mutate({ id: user._id, isActive: !user.isActive });
//                           }}
//                           className={`rounded-lg px-3 py-2 text-xs font-semibold transition-colors ${
//                             user.isActive ? 'border border-red-200 text-red-500 hover:bg-red-50' : 'border border-green-200 text-green-600 hover:bg-green-50'
//                           }`}
//                         >
//                           {user.isActive ? 'Disable' : 'Enable'}
//                         </button>
//                       </div>
//                     </td>
//                   </tr>
//                 ))}
//                 {!filteredCustomers.length ? (
//                   <tr>
//                     <td colSpan="7" className="px-5 py-12 text-center text-gray-400">No customers found.</td>
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
//             totalItems={filteredCustomers.length}
//             pageSize={PAGE_SIZE}
//             label="customers"
//             onPageChange={setPage}
//           />
//         </div>

//         {selectedCustomer ? (
//           <div
//             className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-4"
//             onClick={(e) => e.target === e.currentTarget && setSelectedCustomer(null)}
//           >
//             <div className="w-full max-w-2xl rounded-3xl bg-white p-6 shadow-2xl">
//               <div className="mb-5 flex items-start justify-between gap-4 border-b border-gray-100 pb-5">
//                 <div>
//                   <h2 className="font-display text-3xl font-bold text-dark">{selectedCustomer.name}</h2>
//                   <p className="mt-2"><span className="badge badge-success">Customer</span></p>
//                 </div>
//                 <button onClick={() => setSelectedCustomer(null)} className="rounded-xl bg-gray-100 p-2 text-gray-400">
//                   <X size={18} />
//                 </button>
//               </div>

//               <div className="grid gap-4 md:grid-cols-2">
//                 <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
//                   <div className="flex items-start gap-3">
//                     <Mail size={16} className="mt-1 text-gray-400" />
//                     <div>
//                       <p className="text-xs uppercase tracking-wide text-gray-400">Email</p>
//                       <p className="mt-1 font-medium text-dark">{selectedCustomer.email || 'No email'}</p>
//                     </div>
//                   </div>
//                 </div>
//                 <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
//                   <div className="flex items-start gap-3">
//                     <Phone size={16} className="mt-1 text-gray-400" />
//                     <div>
//                       <p className="text-xs uppercase tracking-wide text-gray-400">Phone</p>
//                       <p className="mt-1 font-medium text-dark">{selectedCustomer.phone || '-'}</p>
//                     </div>
//                   </div>
//                 </div>
//                 <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
//                   <p className="text-xs uppercase tracking-wide text-gray-400">Status</p>
//                   <p className={`mt-1 font-medium ${selectedCustomer.isActive ? 'text-green-600' : 'text-red-500'}`}>
//                     {selectedCustomer.isActive ? 'Active' : 'Inactive'}
//                   </p>
//                 </div>
//                 <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
//                   <div className="flex items-start gap-3">
//                     <CalendarDays size={16} className="mt-1 text-gray-400" />
//                     <div>
//                       <p className="text-xs uppercase tracking-wide text-gray-400">Joined</p>
//                       <p className="mt-1 font-medium text-dark">{new Date(selectedCustomer.createdAt).toLocaleString('en-IN')}</p>
//                     </div>
//                   </div>
//                 </div>
//                 <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
//                   <div className="flex items-start gap-3">
//                     <Star size={16} className="mt-1 text-amber-500" />
//                     <div>
//                       <p className="text-xs uppercase tracking-wide text-gray-400">Average Rating</p>
//                       <p className="mt-1 font-medium text-dark">
//                         {selectedCustomer.customerInsights?.averageRating ? selectedCustomer.customerInsights.averageRating.toFixed(1) : '0.0'} / 5
//                       </p>
//                     </div>
//                   </div>
//                 </div>
//                 <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
//                   <div className="flex items-start gap-3">
//                     <MessageSquare size={16} className="mt-1 text-gray-400" />
//                     <div>
//                       <p className="text-xs uppercase tracking-wide text-gray-400">Reviews Shared</p>
//                       <p className="mt-1 font-medium text-dark">{selectedCustomer.customerInsights?.totalReviews || 0}</p>
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               <div className="mt-5 rounded-2xl border border-gray-100 bg-gray-50 p-4">
//                 <div className="mb-3 flex items-center gap-2">
//                   <MessageSquare size={16} className="text-primary" />
//                   <p className="font-semibold text-dark">Recent Ratings & Reviews</p>
//                 </div>
//                 <div className="space-y-3">
//                   {(selectedCustomer.customerInsights?.recentReviews || []).length ? (
//                     selectedCustomer.customerInsights.recentReviews.map((review, index) => (
//                       <div key={`${review.title}-${index}`} className="rounded-2xl border border-white bg-white px-4 py-3">
//                         <div className="flex items-center justify-between gap-3">
//                           <p className="font-medium text-dark">{review.title}</p>
//                           <div className="flex items-center gap-1 text-amber-500">
//                             <Star size={14} className="fill-amber-400 text-amber-400" />
//                             <span className="text-sm font-semibold text-dark">{review.rating}</span>
//                           </div>
//                         </div>
//                         <p className="mt-2 text-sm text-gray-500">{review.comment || 'No written note shared.'}</p>
//                         <p className="mt-2 text-xs uppercase tracking-wide text-gray-400">
//                           {review.type} review • {new Date(review.createdAt).toLocaleString('en-IN')}
//                         </p>
//                       </div>
//                     ))
//                   ) : (
//                     <div className="rounded-2xl border border-dashed border-gray-200 bg-white px-4 py-5 text-sm text-gray-400">
//                       This customer has not submitted ratings or reviews yet.
//                     </div>
//                   )}
//                 </div>
//               </div>

//               <div className="mt-5 flex flex-wrap justify-end gap-3">
//                 <button
//                   onClick={() => {
//                     setSelectedCustomer(null);
//                     openEditModal(selectedCustomer);
//                   }}
//                   className="rounded-xl border border-primary px-4 py-2 font-semibold text-primary"
//                 >
//                   Edit Customer
//                 </button>
//                 <button
//                   onClick={() => toggleMutation.mutate({ id: selectedCustomer._id, isActive: !selectedCustomer.isActive })}
//                   className="rounded-xl bg-gray-900 px-4 py-2 font-semibold text-white"
//                 >
//                   {selectedCustomer.isActive ? 'Disable' : 'Enable'}
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
//                 <h2 className="font-display text-xl font-bold text-dark">Edit Customer</h2>
//                 <button onClick={closeModal}>
//                   <X size={20} className="text-gray-400" />
//                 </button>
//               </div>

//               <div className="space-y-4">
//                 <input
//                   value={formCustomer.name}
//                   onChange={(e) => setFormCustomer((prev) => ({ ...prev, name: e.target.value }))}
//                   placeholder="Full Name"
//                   className="input-field"
//                 />
//                 <input
//                   value={formCustomer.email}
//                   onChange={(e) => setFormCustomer((prev) => ({ ...prev, email: e.target.value }))}
//                   placeholder="Email"
//                   type="email"
//                   className="input-field"
//                 />
//                 <input
//                   value={formCustomer.phone}
//                   onChange={(e) => setFormCustomer((prev) => ({ ...prev, phone: e.target.value }))}
//                   placeholder="Phone"
//                   className="input-field"
//                 />
//                 <div className="relative">
//                   <input
//                     value={formCustomer.password}
//                     onChange={(e) => setFormCustomer((prev) => ({ ...prev, password: e.target.value }))}
//                     placeholder="New Password (optional)"
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
//                 <button
//                   onClick={handleSave}
//                   disabled={updateMutation.isPending}
//                   className="btn-primary w-full"
//                 >
//                   {updateMutation.isPending ? 'Saving...' : 'Save Changes'}
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
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Search, Phone, Pencil, X, Eye, EyeOff, Trash2, Mail, CalendarDays, Star, MessageSquare, UserCheck, UserX } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../services/api';
import AdminSidebar from '../../components/admin/AdminSidebar';
import AdminPagination from '../../components/admin/AdminPagination';

const PAGE_SIZE = 6;
const EMPTY_CUSTOMER_FORM = {
  name: '',
  email: '',
  phone: '',
  password: '',
};

export default function CustomerManagement() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [editingCustomerId, setEditingCustomerId] = useState(null);
  const [formCustomer, setFormCustomer] = useState(EMPTY_CUSTOMER_FORM);
  const [showPassword, setShowPassword] = useState(false);
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

  const toggleMutation = useMutation({
    mutationFn: ({ id, isActive }) => api.put(`/admin/users/${id}`, { isActive }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      queryClient.invalidateQueries({ queryKey: ['admin-dashboard'] });
      toast.success('Customer status updated');
    },
    onError: (error) => toast.error(error.response?.data?.message || 'Failed to update customer'),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }) => api.put(`/admin/users/${id}`, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      queryClient.invalidateQueries({ queryKey: ['admin-dashboard'] });
      setShowModal(false);
      setEditingCustomerId(null);
      setFormCustomer(EMPTY_CUSTOMER_FORM);
      setShowPassword(false);
      toast.success('Customer updated');
    },
    onError: (error) => toast.error(error.response?.data?.message || 'Failed to update customer'),
  });

  const deleteMutation = useMutation({
    mutationFn: ({ id, payload }) => api.delete(`/admin/users/${id}`, { data: payload }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      queryClient.invalidateQueries({ queryKey: ['admin-dashboard'] });
      toast.success('Customer deleted');
    },
    onError: (error) => toast.error(error.response?.data?.message || 'Failed to delete customer'),
  });

  const customers = useMemo(() => {
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
      .filter((u) => u.role === 'customer')
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

  const filteredCustomers = useMemo(() => {
    const query = search.toLowerCase();
    return customers.filter((u) =>
      u.name?.toLowerCase().includes(query) ||
      u.email?.toLowerCase().includes(query) ||
      u.phone?.toLowerCase().includes(query)
    );
  }, [customers, search]);

  useEffect(() => {
    setPage(1);
  }, [search]);

  const totalPages = Math.max(1, Math.ceil(filteredCustomers.length / PAGE_SIZE));
  const paginatedCustomers = useMemo(
    () => filteredCustomers.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE),
    [filteredCustomers, page]
  );

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  useEffect(() => {
    if (selectedCustomer) {
      const latest = customers.find((user) => user._id === selectedCustomer._id);
      if (latest) setSelectedCustomer(latest);
    }
  }, [customers, selectedCustomer]);

  const getPresenceBadge = (user = {}) => {
    if (!user.isActive) {
      return { label: 'Inactive', className: 'bg-red-100 text-red-700' };
    }
    if (user.liveStatus === 'online') {
      return { label: 'Online', className: 'bg-emerald-100 text-emerald-700' };
    }
    return { label: 'Offline', className: 'bg-gray-100 text-gray-600' };
  };

  const openEditModal = (user) => {
    setEditingCustomerId(user._id);
    setFormCustomer({
      name: user.name || '',
      email: user.email || '',
      phone: user.phone || '',
      password: '',
    });
    setShowPassword(false);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingCustomerId(null);
    setFormCustomer(EMPTY_CUSTOMER_FORM);
    setShowPassword(false);
  };

  const handleSave = () => {
    const payload = {
      name: formCustomer.name,
      email: formCustomer.email,
      phone: formCustomer.phone,
      role: 'customer',
    };
    if (formCustomer.password.trim()) payload.password = formCustomer.password;
    updateMutation.mutate({ id: editingCustomerId, payload });
  };

  const handleDeleteCustomer = (user) => {
    const shouldDelete = window.confirm(`Delete customer ${user.name}? This action cannot be undone.`);
    if (!shouldDelete) return;
    deleteMutation.mutate({ id: user._id, payload: {} });
  };

  return (
    <div className="flex min-h-screen bg-[#faf8f5]">
      <AdminSidebar />
      <main className="flex-1 p-6 lg:p-8 overflow-auto">
        <div className="mb-6">
          <h1 className="font-display text-3xl font-bold text-[#3f3328]">Customers</h1>
          <p className="text-sm text-[#6b5f54] mt-1">Manage customer accounts and view their activity</p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white border border-[#e8e0d6] rounded-xl p-4">
            <p className="text-xs text-[#6b5f54] uppercase tracking-wide">Total Customers</p>
            <p className="text-2xl font-bold text-[#3f3328] mt-1">{customers.length}</p>
          </div>
          <div className="bg-white border border-[#e8e0d6] rounded-xl p-4">
            <p className="text-xs text-[#6b5f54] uppercase tracking-wide">Online</p>
            <p className="text-2xl font-bold text-[#3f3328] mt-1">{customers.filter((u) => u.isActive && u.liveStatus === 'online').length}</p>
          </div>
          <div className="bg-white border border-[#e8e0d6] rounded-xl p-4">
            <p className="text-xs text-[#6b5f54] uppercase tracking-wide">Offline</p>
            <p className="text-2xl font-bold text-[#3f3328] mt-1">{customers.filter((u) => u.isActive && u.liveStatus !== 'online').length}</p>
          </div>
          <div className="bg-white border border-[#e8e0d6] rounded-xl p-4">
            <p className="text-xs text-[#6b5f54] uppercase tracking-wide">Verified Email</p>
            <p className="text-2xl font-bold text-[#3f3328] mt-1">{customers.filter((u) => u.isEmailVerified).length}</p>
          </div>
        </div>

        <div className="relative mb-6">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#a0968c]" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, email, or phone..."
            className="w-full rounded-xl border border-[#e8e0d6] bg-white py-2.5 pl-11 pr-4 text-sm focus:border-[#b97844] focus:outline-none"
          />
        </div>

        <div className="bg-white border border-[#e8e0d6] rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-[#faf8f5] text-left text-[#6b5f54] border-b border-[#e8e0d6]">
                <tr>
                  <th className="px-5 py-3 font-semibold">Name</th>
                  <th className="px-5 py-3 font-semibold">Email</th>
                  <th className="px-5 py-3 font-semibold">Phone</th>
                  <th className="px-5 py-3 font-semibold">Rating</th>
                  <th className="px-5 py-3 font-semibold">Status</th>
                  <th className="px-5 py-3 font-semibold">Joined</th>
                  <th className="px-5 py-3 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e8e0d6]">
                {paginatedCustomers.map((user) => (
                  <tr key={user._id} onClick={() => setSelectedCustomer(user)} className="cursor-pointer hover:bg-[#faf8f5] transition-all">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#b97844]/10 font-bold text-[#b97844]">
                          {user.name?.slice(0, 2).toUpperCase() || 'CU'}
                        </div>
                        <p className="font-medium text-[#3f3328]">{user.name}</p>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-[#6b5f54]">{user.email || 'No email'}</td>
                    <td className="px-5 py-3 text-[#6b5f54]">{user.phone || '-'}</td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-1">
                        <Star size={14} className="fill-amber-400 text-amber-400" />
                        <span className="font-medium text-[#3f3328]">
                          {user.customerInsights?.averageRating ? user.customerInsights.averageRating.toFixed(1) : '0.0'}
                        </span>
                        <span className="text-xs text-[#a0968c]">
                          ({user.customerInsights?.totalReviews || 0})
                        </span>
                      </div>
                    </td>
                    <td className="px-5 py-3">
                      {(() => {
                        const badge = getPresenceBadge(user);
                        return (
                          <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${badge.className}`}>
                            {badge.label}
                          </span>
                        );
                      })()}
                    </td>
                    <td className="px-5 py-3 text-[#6b5f54]">{new Date(user.createdAt).toLocaleDateString('en-IN')}</td>
                    <td className="px-5 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={(e) => { e.stopPropagation(); openEditModal(user); }} className="p-2 rounded-lg text-[#b97844] hover:bg-[#faf8f5] transition-all" title="Edit">
                          <Pencil size={16} />
                        </button>
                        <button onClick={(e) => { e.stopPropagation(); handleDeleteCustomer(user); }} className="p-2 rounded-lg text-red-500 hover:bg-red-50 transition-all" title="Delete">
                          <Trash2 size={16} />
                        </button>
                        <button onClick={(e) => { e.stopPropagation(); toggleMutation.mutate({ id: user._id, isActive: !user.isActive }); }} className={`p-2 rounded-lg transition-all ${user.isActive ? 'text-red-500 hover:bg-red-50' : 'text-emerald-500 hover:bg-emerald-50'}`} title={user.isActive ? 'Deactivate' : 'Activate'}>
                          {user.isActive ? <UserX size={16} /> : <UserCheck size={16} />}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {!filteredCustomers.length ? (
                  <tr><td colSpan="7" className="px-5 py-12 text-center text-[#a0968c]">No customers found.</td></tr>
                ) : null}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-6">
          <AdminPagination page={page} totalPages={totalPages} totalItems={filteredCustomers.length} pageSize={PAGE_SIZE} label="customers" onPageChange={setPage} />
        </div>

        {/* Customer Detail Modal */}
        {selectedCustomer && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={(e) => e.target === e.currentTarget && setSelectedCustomer(null)}>
            <div className="w-full max-w-2xl max-h-[85vh] overflow-auto bg-white rounded-2xl shadow-2xl">
              <div className="sticky top-0 bg-white border-b border-[#e8e0d6] px-6 py-4 flex items-center justify-between">
                <h2 className="font-display text-2xl font-bold text-[#3f3328]">{selectedCustomer.name}</h2>
                <button onClick={() => setSelectedCustomer(null)} className="p-2 rounded-lg hover:bg-[#faf8f5]"><X size={20} className="text-[#a0968c]" /></button>
              </div>
              <div className="p-6 space-y-5">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-[#faf8f5] rounded-xl p-4"><Mail size={16} className="text-[#b97844] mb-2" /><p className="text-xs text-[#6b5f54]">Email</p><p className="font-medium text-[#3f3328]">{selectedCustomer.email || 'No email'}</p></div>
                  <div className="bg-[#faf8f5] rounded-xl p-4"><Phone size={16} className="text-[#b97844] mb-2" /><p className="text-xs text-[#6b5f54]">Phone</p><p className="font-medium text-[#3f3328]">{selectedCustomer.phone || '-'}</p></div>
                  <div className="bg-[#faf8f5] rounded-xl p-4"><CalendarDays size={16} className="text-[#b97844] mb-2" /><p className="text-xs text-[#6b5f54]">Joined</p><p className="font-medium text-[#3f3328]">{new Date(selectedCustomer.createdAt).toLocaleDateString()}</p></div>
                  <div className="bg-[#faf8f5] rounded-xl p-4"><Star size={16} className="text-[#b97844] mb-2" /><p className="text-xs text-[#6b5f54]">Avg Rating</p><p className="font-medium text-[#3f3328]">{selectedCustomer.customerInsights?.averageRating?.toFixed(1) || '0.0'} / 5</p></div>
                  <div className="bg-[#faf8f5] rounded-xl p-4">
                    <p className="text-xs text-[#6b5f54]">Status</p>
                    {(() => {
                      const badge = getPresenceBadge(selectedCustomer);
                      return <p className={`mt-1 inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${badge.className}`}>{badge.label}</p>;
                    })()}
                    {selectedCustomer.currentPanel ? <p className="mt-2 text-xs text-[#a0968c]">Active in {selectedCustomer.currentPanel}</p> : null}
                  </div>
                </div>
                <div className="bg-[#faf8f5] rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-3"><MessageSquare size={16} className="text-[#b97844]" /><p className="font-semibold text-[#3f3328]">Recent Reviews</p></div>
                  <div className="space-y-3">
                    {(selectedCustomer.customerInsights?.recentReviews || []).length ? selectedCustomer.customerInsights.recentReviews.map((review, idx) => (
                      <div key={idx} className="bg-white rounded-lg p-3 border border-[#e8e0d6]">
                        <div className="flex items-center justify-between"><p className="font-medium text-[#3f3328]">{review.title}</p><div className="flex items-center gap-1"><Star size={12} className="fill-amber-400 text-amber-400" /><span className="text-sm font-medium">{review.rating}</span></div></div>
                        <p className="text-sm text-[#6b5f54] mt-1">{review.comment || 'No comment'}</p>
                      </div>
                    )) : <p className="text-sm text-[#a0968c] text-center py-4">No reviews yet</p>}
                  </div>
                </div>
                <div className="flex justify-end gap-3 pt-4 border-t border-[#e8e0d6]">
                  <button onClick={() => { setSelectedCustomer(null); openEditModal(selectedCustomer); }} className="rounded-xl border border-[#b97844] px-4 py-2 text-sm font-medium text-[#b97844] hover:bg-[#b97844] hover:text-white transition-all">Edit</button>
                  <button onClick={() => toggleMutation.mutate({ id: selectedCustomer._id, isActive: !selectedCustomer.isActive })} className="rounded-xl bg-[#3f3328] px-4 py-2 text-sm font-medium text-white hover:bg-[#b97844] transition-all">{selectedCustomer.isActive ? 'Deactivate' : 'Activate'}</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Edit Modal */}
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={(e) => e.target === e.currentTarget && closeModal()}>
            <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-6">
              <div className="flex items-center justify-between mb-5"><h2 className="font-display text-xl font-bold text-[#3f3328]">Edit Customer</h2><button onClick={closeModal}><X size={20} className="text-[#a0968c]" /></button></div>
              <div className="space-y-4">
                <input value={formCustomer.name} onChange={(e) => setFormCustomer(prev => ({ ...prev, name: e.target.value }))} placeholder="Full Name" className="w-full rounded-lg border border-[#e8e0d6] p-3 text-sm focus:border-[#b97844] focus:outline-none" />
                <input value={formCustomer.email} onChange={(e) => setFormCustomer(prev => ({ ...prev, email: e.target.value }))} placeholder="Email" type="email" className="w-full rounded-lg border border-[#e8e0d6] p-3 text-sm focus:border-[#b97844] focus:outline-none" />
                <input value={formCustomer.phone} onChange={(e) => setFormCustomer(prev => ({ ...prev, phone: e.target.value }))} placeholder="Phone" className="w-full rounded-lg border border-[#e8e0d6] p-3 text-sm focus:border-[#b97844] focus:outline-none" />
                <div className="relative"><input value={formCustomer.password} onChange={(e) => setFormCustomer(prev => ({ ...prev, password: e.target.value }))} placeholder="New Password (optional)" type={showPassword ? 'text' : 'password'} className="w-full rounded-lg border border-[#e8e0d6] p-3 text-sm focus:border-[#b97844] focus:outline-none pr-10" /><button onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#a0968c]">{showPassword ? <EyeOff size={16} /> : <Eye size={16} />}</button></div>
                <button onClick={handleSave} disabled={updateMutation.isPending} className="w-full rounded-xl bg-[#b97844] py-3 text-white font-medium hover:bg-[#9e6538] disabled:opacity-50 transition-all">{updateMutation.isPending ? 'Saving...' : 'Save Changes'}</button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
