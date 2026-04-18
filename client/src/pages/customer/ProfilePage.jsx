// // // import { useMemo, useState } from 'react';
// // // import { motion } from 'framer-motion';
// // // import { Camera, Mail, Phone, MapPin, User, Save, LogOut, Heart, ShoppingBag, Clock } from 'lucide-react';
// // // import { useDispatch, useSelector } from 'react-redux';
// // // import { Link, useNavigate } from 'react-router-dom';
// // // import toast from 'react-hot-toast';
// // // import { logoutUser } from '../../store/slices/authSlice';
// // // import CustomerFooter from '../../components/customer/CustomerFooter';

// // // export default function ProfilePage() {
// // //   const dispatch = useDispatch();
// // //   const navigate = useNavigate();
// // //   const { user } = useSelector((state) => state.auth);
// // //   const [saving, setSaving] = useState(false);
// // //   const [form, setForm] = useState({
// // //     name: user?.name || '',
// // //     email: user?.email || '',
// // //     phone: user?.phone || '',
// // //     address: '',
// // //     bio: 'Coffee lover & food enthusiast',
// // //   });

// // //   const initials = useMemo(() => {
// // //     if (!form.name) return 'RC';
// // //     return form.name
// // //       .split(' ')
// // //       .map((part) => part[0])
// // //       .join('')
// // //       .slice(0, 2)
// // //       .toUpperCase();
// // //   }, [form.name]);

// // //   const handleChange = (e) => {
// // //     const { name, value } = e.target;
// // //     setForm((prev) => ({ ...prev, [name]: value }));
// // //   };

// // //   const handleSave = async (e) => {
// // //     e.preventDefault();
// // //     setSaving(true);
// // //     setTimeout(() => {
// // //       toast.success('Profile updated successfully');
// // //       setSaving(false);
// // //     }, 800);
// // //   };

// // //   const handleLogout = async () => {
// // //     await dispatch(logoutUser());
// // //     navigate('/login', { replace: true });
// // //   };

// // //   return (
// // //     <div className="min-h-screen bg-white">
// // //       {/* Header */}
// // //       <header className="border-b border-gray-100 bg-white sticky top-0 z-50">
// // //         <div className="max-w-6xl mx-auto px-4 py-3">
// // //           <div className="flex items-center justify-between">
// // //             <Link to="/dashboard" className="flex items-center gap-2">
// // //               <img 
// // //                 src="https://rollercoastercafe.com/assets/images/roller_logo.png" 
// // //                 alt="Logo"
// // //                 className="h-8 w-8 rounded-full object-cover"
// // //               />
// // //               <span className="font-semibold text-lg text-gray-800">Roller Coaster Cafe</span>
// // //             </Link>

// // //             <nav className="hidden md:flex items-center gap-6">
// // //               <Link to="/dashboard" className="text-sm text-gray-500 hover:text-amber-600">Home</Link>
// // //               <Link to="/menu" className="text-sm text-gray-500 hover:text-amber-600">Menu</Link>
// // //               <Link to="/orders" className="text-sm text-gray-500 hover:text-amber-600">Orders</Link>
// // //               <Link to="/profile" className="text-sm text-amber-600">Profile</Link>
// // //               <Link to="/settings" className="text-sm text-gray-500 hover:text-amber-600">Settings</Link>
// // //             </nav>

// // //             <button
// // //               onClick={handleLogout}
// // //               className="flex items-center gap-1.5 rounded-full bg-red-50 px-3 py-1.5 text-sm text-red-600 hover:bg-red-100 transition-all"
// // //             >
// // //               <LogOut size={14} />
// // //               <span className="hidden sm:inline">Logout</span>
// // //             </button>
// // //           </div>
// // //         </div>
// // //       </header>

// // //       <main className="max-w-4xl mx-auto px-4 py-8">
// // //         {/* Profile Header */}
// // //         <div className="flex flex-col sm:flex-row items-center gap-6 mb-8 pb-6 border-b border-gray-100">
// // //           <div className="relative">
// // //             <div className="h-24 w-24 rounded-full bg-amber-100 flex items-center justify-center">
// // //               <span className="text-2xl font-bold text-amber-600">{initials}</span>
// // //             </div>
// // //             <button className="absolute bottom-0 right-0 rounded-full bg-amber-600 p-1.5 text-white shadow-md">
// // //               <Camera size={14} />
// // //             </button>
// // //           </div>
// // //           <div className="text-center sm:text-left">
// // //             <h1 className="text-2xl font-bold text-gray-800">{form.name || 'Guest User'}</h1>
// // //             <p className="text-gray-400 text-sm mt-1">{form.email || 'Add your email'}</p>
// // //             <div className="flex gap-4 mt-2 justify-center sm:justify-start">
// // //               <span className="flex items-center gap-1 text-xs text-gray-500">
// // //                 <ShoppingBag size={12} /> 12 orders
// // //               </span>
// // //               <span className="flex items-center gap-1 text-xs text-gray-500">
// // //                 <Heart size={12} /> 8 favorites
// // //               </span>
// // //             </div>
// // //           </div>
// // //         </div>

// // //         {/* Profile Form */}
// // //         <form onSubmit={handleSave} className="space-y-5">
// // //           <div className="grid md:grid-cols-2 gap-5">
// // //             <div>
// // //               <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
// // //               <div className="relative">
// // //                 <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
// // //                 <input
// // //                   name="name"
// // //                   value={form.name}
// // //                   onChange={handleChange}
// // //                   className="w-full rounded-lg border border-gray-200 py-2 pl-9 pr-3 text-sm focus:border-amber-500 focus:outline-none"
// // //                   placeholder="Your name"
// // //                 />
// // //               </div>
// // //             </div>

// // //             <div>
// // //               <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
// // //               <div className="relative">
// // //                 <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
// // //                 <input
// // //                   name="phone"
// // //                   value={form.phone}
// // //                   onChange={handleChange}
// // //                   className="w-full rounded-lg border border-gray-200 py-2 pl-9 pr-3 text-sm focus:border-amber-500 focus:outline-none"
// // //                   placeholder="+91 98765 43210"
// // //                 />
// // //               </div>
// // //             </div>

// // //             <div className="md:col-span-2">
// // //               <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
// // //               <div className="relative">
// // //                 <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
// // //                 <input
// // //                   name="email"
// // //                   value={form.email}
// // //                   onChange={handleChange}
// // //                   className="w-full rounded-lg border border-gray-200 py-2 pl-9 pr-3 text-sm focus:border-amber-500 focus:outline-none"
// // //                   placeholder="you@example.com"
// // //                 />
// // //               </div>
// // //             </div>

// // //             <div className="md:col-span-2">
// // //               <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
// // //               <div className="relative">
// // //                 <MapPin size={16} className="absolute left-3 top-3 text-gray-400" />
// // //                 <textarea
// // //                   name="address"
// // //                   value={form.address}
// // //                   onChange={handleChange}
// // //                   rows={2}
// // //                   className="w-full rounded-lg border border-gray-200 py-2 pl-9 pr-3 text-sm focus:border-amber-500 focus:outline-none resize-none"
// // //                   placeholder="Your delivery address"
// // //                 />
// // //               </div>
// // //             </div>

// // //             <div className="md:col-span-2">
// // //               <label className="block text-sm font-medium text-gray-700 mb-1">About You</label>
// // //               <textarea
// // //                 name="bio"
// // //                 value={form.bio}
// // //                 onChange={handleChange}
// // //                 rows={2}
// // //                 className="w-full rounded-lg border border-gray-200 p-3 text-sm focus:border-amber-500 focus:outline-none resize-none"
// // //                 placeholder="Tell us about your preferences"
// // //               />
// // //             </div>
// // //           </div>

// // //           <div className="flex justify-end">
// // //             <button
// // //               type="submit"
// // //               disabled={saving}
// // //               className="rounded-full bg-amber-600 px-6 py-2 text-sm font-semibold text-white hover:bg-amber-700 disabled:opacity-50 transition-all"
// // //             >
// // //               {saving ? 'Saving...' : 'Save Changes'}
// // //             </button>
// // //           </div>
// // //         </form>
// // //       </main>

// // //       {/* Footer */}
// // //       <CustomerFooter />
// // //     </div>
// // //   );
// // // }

// import { useMemo, useState, useEffect } from 'react';
// import { motion } from 'framer-motion';
// import { Camera, Mail, Phone, MapPin, User, Save, LogOut, Heart, ShoppingBag, Clock } from 'lucide-react';
// import { useDispatch, useSelector } from 'react-redux';
// import { Link, useNavigate } from 'react-router-dom';
// import { useQuery } from '@tanstack/react-query';
// import toast from 'react-hot-toast';
// import { logoutUser } from '../../store/slices/authSlice';
// import CustomerFooter from '../../components/customer/CustomerFooter';
// import api from '../../services/api';

// export default function ProfilePage() {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const { user } = useSelector((state) => state.auth);
//   const [saving, setSaving] = useState(false);
//   const [form, setForm] = useState({
//     name: user?.name || '',
//     email: user?.email || '',
//     phone: user?.phone || '',
//     address: '',
//     bio: 'Coffee lover & food enthusiast',
//   });

//   // Fetch user's orders count
//   const { data: orders = [], isLoading: ordersLoading } = useQuery({
//     queryKey: ['user-orders-count'],
//     queryFn: async () => {
//       const res = await api.get('/orders/my');
//       return Array.isArray(res.data) ? res.data : [];
//     },
//   });

//   // Get favorites count from localStorage
//   const favouriteStorageKey = useMemo(
//     () => `customer-favourites:${user?._id || user?.email || 'guest'}`,
//     [user?._id, user?.email]
//   );
  
//   const [favouritesCount, setFavouritesCount] = useState(0);
  
//   useEffect(() => {
//     try {
//       const saved = JSON.parse(localStorage.getItem(favouriteStorageKey) || '[]');
//       setFavouritesCount(saved.length);
//     } catch {
//       setFavouritesCount(0);
//     }
//   }, [favouriteStorageKey]);

//   const orderCount = orders?.length || 0;
//   const activeOrdersCount = orders?.filter(o => !['delivered', 'completed', 'cancelled'].includes(o.status)).length || 0;

//   const initials = useMemo(() => {
//     if (!form.name) return 'RC';
//     return form.name
//       .split(' ')
//       .map((part) => part[0])
//       .join('')
//       .slice(0, 2)
//       .toUpperCase();
//   }, [form.name]);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setForm((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleSave = async (e) => {
//   e.preventDefault();
//   setSaving(true);
//   try {
//     // Change this endpoint
//     await api.put('/users/profile', {
//       name: form.name,
//       email: form.email,
//       phone: form.phone,
//       address: form.address,
//       bio: form.bio,
//     });
//     toast.success('Profile updated successfully');
//   } catch (err) {
//     toast.error(err.response?.data?.message || 'Could not update profile');
//   } finally {
//     setSaving(false);
//   }
// };

//   const handleLogout = async () => {
//     await dispatch(logoutUser());
//     navigate('/login', { replace: true });
//   };

//   return (
//     <div className="min-h-screen bg-white">
//       {/* Header */}
//       <header className="border-b border-gray-100 bg-white sticky top-0 z-50">
//         <div className="max-w-6xl mx-auto px-4 py-3">
//           <div className="flex items-center justify-between">
//             <Link to="/" className="flex items-center gap-2">
//               <img 
//                 src="https://rollercoastercafe.com/assets/images/roller_logo.png" 
//                 alt="Logo"
//                 className="h-8 w-8 rounded-full object-cover"
//               />
//               <span className="font-semibold text-lg text-gray-800">Roller Coaster Cafe</span>
//             </Link>

//             <nav className="hidden md:flex items-center gap-6">
//               <Link to="/" className="text-sm text-gray-500 hover:text-amber-600">Home</Link>
//               <Link to="/menu" className="text-sm text-gray-500 hover:text-amber-600">Menu</Link>
//               <Link to="/orders" className="text-sm text-gray-500 hover:text-amber-600">Orders</Link>
//               <Link to="/profile" className="text-sm text-amber-600">Profile</Link>
//               <Link to="/settings" className="text-sm text-gray-500 hover:text-amber-600">Settings</Link>
//             </nav>

//             <button
//               onClick={handleLogout}
//               className="flex items-center gap-1.5 rounded-full bg-red-50 px-3 py-1.5 text-sm text-red-600 hover:bg-red-100 transition-all"
//             >
//               <LogOut size={14} />
//               <span className="hidden sm:inline">Logout</span>
//             </button>
//           </div>
//         </div>
//       </header>

//       <main className="max-w-4xl mx-auto px-4 py-8">
//         {/* Profile Header */}
//         <div className="flex flex-col sm:flex-row items-center gap-6 mb-8 pb-6 border-b border-gray-100">
//           <div className="relative">
//             <div className="h-24 w-24 rounded-full bg-amber-100 flex items-center justify-center">
//               <span className="text-2xl font-bold text-amber-600">{initials}</span>
//             </div>
//             <button className="absolute bottom-0 right-0 rounded-full bg-amber-600 p-1.5 text-white shadow-md">
//               <Camera size={14} />
//             </button>
//           </div>
//           <div className="text-center sm:text-left">
//             <h1 className="text-2xl font-bold text-gray-800">{form.name || 'Guest User'}</h1>
//             <p className="text-gray-400 text-sm mt-1">{form.email || 'Add your email'}</p>
//             <div className="flex gap-4 mt-2 justify-center sm:justify-start">
//               <Link to="/orders" className="flex items-center gap-1 text-xs text-gray-500 hover:text-amber-600 transition-colors">
//                 <ShoppingBag size={12} />
//                 {ordersLoading ? '...' : `${orderCount} orders`}
//               </Link>
//               <Link to="/favourites" className="flex items-center gap-1 text-xs text-gray-500 hover:text-amber-600 transition-colors">
//                 <Heart size={12} />
//                 {favouritesCount} favorites
//               </Link>
//               {activeOrdersCount > 0 && (
//                 <span className="flex items-center gap-1 text-xs text-green-600">
//                   <Clock size={12} />
//                   {activeOrdersCount} active
//                 </span>
//               )}
//             </div>
//           </div>
//         </div>

//         {/* Profile Form */}
//         <form onSubmit={handleSave} className="space-y-5">
//           <div className="grid md:grid-cols-2 gap-5">
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
//               <div className="relative">
//                 <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
//                 <input
//                   name="name"
//                   value={form.name}
//                   onChange={handleChange}
//                   className="w-full rounded-lg border border-gray-200 py-2 pl-9 pr-3 text-sm focus:border-amber-500 focus:outline-none"
//                   placeholder="Your name"
//                 />
//               </div>
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
//               <div className="relative">
//                 <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
//                 <input
//                   name="phone"
//                   value={form.phone}
//                   onChange={handleChange}
//                   className="w-full rounded-lg border border-gray-200 py-2 pl-9 pr-3 text-sm focus:border-amber-500 focus:outline-none"
//                   placeholder="+91 98765 43210"
//                 />
//               </div>
//             </div>

//             <div className="md:col-span-2">
//               <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
//               <div className="relative">
//                 <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
//                 <input
//                   name="email"
//                   value={form.email}
//                   onChange={handleChange}
//                   className="w-full rounded-lg border border-gray-200 py-2 pl-9 pr-3 text-sm focus:border-amber-500 focus:outline-none"
//                   placeholder="you@example.com"
//                 />
//               </div>
//             </div>

//             <div className="md:col-span-2">
//               <label className="block text-sm font-medium text-gray-700 mb-1">Default Delivery Address</label>
//               <div className="relative">
//                 <MapPin size={16} className="absolute left-3 top-3 text-gray-400" />
//                 <textarea
//                   name="address"
//                   value={form.address}
//                   onChange={handleChange}
//                   rows={2}
//                   className="w-full rounded-lg border border-gray-200 py-2 pl-9 pr-3 text-sm focus:border-amber-500 focus:outline-none resize-none"
//                   placeholder="Your delivery address"
//                 />
//               </div>
//             </div>

//             <div className="md:col-span-2">
//               <label className="block text-sm font-medium text-gray-700 mb-1">About You</label>
//               <textarea
//                 name="bio"
//                 value={form.bio}
//                 onChange={handleChange}
//                 rows={2}
//                 className="w-full rounded-lg border border-gray-200 p-3 text-sm focus:border-amber-500 focus:outline-none resize-none"
//                 placeholder="Tell us about your preferences"
//               />
//             </div>
//           </div>

//           <div className="flex justify-end">
//             <button
//               type="submit"
//               disabled={saving}
//               className="rounded-full bg-amber-600 px-6 py-2 text-sm font-semibold text-white hover:bg-amber-700 disabled:opacity-50 transition-all"
//             >
//               {saving ? 'Saving...' : 'Save Changes'}
//             </button>
//           </div>
//         </form>

//         {/* Quick Stats Cards */}
//         <div className="grid sm:grid-cols-3 gap-4 mt-8 pt-6 border-t border-gray-100">
//           <Link to="/orders" className="bg-gray-50 rounded-xl p-4 text-center hover:bg-amber-50 transition-all group">
//             <ShoppingBag size={20} className="mx-auto text-gray-400 group-hover:text-amber-600 mb-2" />
//             <p className="text-sm font-medium text-gray-600 group-hover:text-amber-600">Total Orders</p>
//             <p className="text-xl font-bold text-gray-800">{ordersLoading ? '...' : orderCount}</p>
//           </Link>
//           <Link to="/favourites" className="bg-gray-50 rounded-xl p-4 text-center hover:bg-amber-50 transition-all group">
//             <Heart size={20} className="mx-auto text-gray-400 group-hover:text-amber-600 mb-2" />
//             <p className="text-sm font-medium text-gray-600 group-hover:text-amber-600">Favorites</p>
//             <p className="text-xl font-bold text-gray-800">{favouritesCount}</p>
//           </Link>
//           <Link to="/addresses" className="bg-gray-50 rounded-xl p-4 text-center hover:bg-amber-50 transition-all group">
//             <MapPin size={20} className="mx-auto text-gray-400 group-hover:text-amber-600 mb-2" />
//             <p className="text-sm font-medium text-gray-600 group-hover:text-amber-600">Saved Addresses</p>
//             <p className="text-xl font-bold text-gray-800">-</p>
//           </Link>
//         </div>
//       </main>

//       {/* Footer */}
//       <CustomerFooter />
//     </div>
//   );
// }
import { useMemo, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, User, Save, LogOut, Heart, ShoppingBag, Clock } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { logoutUser, setUser } from '../../store/slices/authSlice';
import CustomerFooter from '../../components/customer/CustomerFooter';
import api from '../../services/api';

export default function ProfilePage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const [saving, setSaving] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [form, setForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || '',
    bio: user?.bio || 'Coffee lover & food enthusiast',
  });

  // Only fetch orders if authenticated
  const { data: orders = [], isLoading: ordersLoading } = useQuery({
    queryKey: ['user-orders-count'],
    queryFn: async () => {
      try {
        const res = await api.get('/orders/my');
        return Array.isArray(res.data) ? res.data : [];
      } catch (error) {
        if (error.response?.status === 401) {
          localStorage.removeItem('token');
          navigate('/login');
        }
        return [];
      }
    },
    enabled: isAuthenticated,
    retry: false,
  });

  // Get favorites count from localStorage
  const favouriteStorageKey = useMemo(
    () => `customer-favourites:${user?._id || user?.email || 'guest'}`,
    [user?._id, user?.email]
  );
  
  const [favouritesCount, setFavouritesCount] = useState(0);
  const { data: profileData } = useQuery({
    queryKey: ['customer-profile'],
    queryFn: async () => {
      const res = await api.get('/customer/profile');
      return res.data;
    },
    enabled: isAuthenticated,
    staleTime: 30000,
  });
  
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(favouriteStorageKey) || '[]');
      setFavouritesCount(saved.length);
    } catch {
      setFavouritesCount(0);
    }
  }, [favouriteStorageKey]);

  // Sync form with user data from Redux
  useEffect(() => {
    if (user) {
      setForm({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        address: user.address || '',
        bio: user.bio || 'Coffee lover & food enthusiast',
      });
    }
  }, [user]);

  useEffect(() => {
    if (!profileData) return;
    dispatch(setUser(profileData));
    sessionStorage.setItem('authUser', JSON.stringify(profileData));
  }, [dispatch, profileData]);

  const orderCount = orders?.length || 0;
  const activeOrdersCount = orders?.filter(o => !['delivered', 'completed', 'cancelled'].includes(o.status)).length || 0;

  const initials = useMemo(() => {
    if (!form.name) return 'RC';
    return form.name
      .split(' ')
      .map((part) => part[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();
  }, [form.name]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      // Update profile using customer route
      const response = await api.put('/customer/profile', {
        name: form.name,
        phone: form.phone,
      });
      
      // Update Redux store with the updated user data
      dispatch(setUser(response.data));
      
      // Also update sessionStorage
      const updatedUser = response.data;
      sessionStorage.setItem('authUser', JSON.stringify(updatedUser));
      
      toast.success('Profile updated successfully');
      
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    setShowLogoutConfirm(false);
    await dispatch(logoutUser());
    navigate('/login', { replace: true });
  };

  // If not authenticated, show loading or redirect
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#b97844] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500">Please login to view profile...</p>
          <Link to="/login" className="mt-4 inline-block text-[#b97844] hover:underline">Go to Login</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-gray-100 bg-white sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2">
              <img 
                src="https://rollercoastercafe.com/assets/images/roller_logo.png" 
                alt="Logo"
                className="h-8 w-8 rounded-full object-cover"
              />
              <span className="font-semibold text-lg text-gray-800">Roller Coaster Cafe</span>
            </Link>

            <nav className="hidden md:flex items-center gap-6">
              <Link to="/" className="text-sm text-gray-500 hover:text-amber-600">Home</Link>
              <Link to="/menu" className="text-sm text-gray-500 hover:text-amber-600">Menu</Link>
              <Link to="/orders" className="text-sm text-gray-500 hover:text-amber-600">Orders</Link>
              <Link to="/profile" className="text-sm text-amber-600">Profile</Link>
              <Link to="/settings" className="text-sm text-gray-500 hover:text-amber-600">Settings</Link>
            </nav>

            <button
              onClick={() => setShowLogoutConfirm(true)}
              className="flex items-center gap-1.5 rounded-full bg-red-50 px-3 py-1.5 text-sm text-red-600 hover:bg-red-100 transition-all"
            >
              <LogOut size={14} />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex flex-col sm:flex-row items-center gap-6 mb-8 pb-6 border-b border-gray-100">
          <div className="h-24 w-24 rounded-full bg-amber-100 flex items-center justify-center">
            <span className="text-2xl font-bold text-amber-600">{initials}</span>
          </div>
          <div className="text-center sm:text-left">
            <h1 className="text-2xl font-bold text-gray-800">{form.name || 'Guest User'}</h1>
            <p className="text-gray-400 text-sm mt-1">{form.email || 'Add your email'}</p>
            <div className="flex gap-4 mt-2 justify-center sm:justify-start">
              <Link to="/orders" className="flex items-center gap-1 text-xs text-gray-500 hover:text-amber-600 transition-colors">
                <ShoppingBag size={12} />
                {ordersLoading ? '...' : `${orderCount} orders`}
              </Link>
              <Link to="/favourites" className="flex items-center gap-1 text-xs text-gray-500 hover:text-amber-600 transition-colors">
                <Heart size={12} />
                {favouritesCount} favorites
              </Link>
              {activeOrdersCount > 0 && (
                <span className="flex items-center gap-1 text-xs text-green-600">
                  <Clock size={12} />
                  {activeOrdersCount} active
                </span>
              )}
            </div>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-5">
          <div className="grid md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <div className="relative">
                <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-200 py-2 pl-9 pr-3 text-sm focus:border-amber-500 focus:outline-none"
                  placeholder="Your name"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
              <div className="relative">
                <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-200 py-2 pl-9 pr-3 text-sm focus:border-amber-500 focus:outline-none"
                  placeholder="+91 98765 43210"
                />
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-200 py-2 pl-9 pr-3 text-sm focus:border-amber-500 focus:outline-none bg-gray-50"
                  placeholder="you@example.com"
                  disabled
                />
              </div>
              <p className="text-xs text-gray-400 mt-1">Email cannot be changed</p>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Default Delivery Address</label>
              <div className="relative">
                <MapPin size={16} className="absolute left-3 top-3 text-gray-400" />
                <textarea
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                  rows={2}
                  className="w-full rounded-lg border border-gray-200 py-2 pl-9 pr-3 text-sm focus:border-amber-500 focus:outline-none resize-none"
                  placeholder="Your delivery address"
                />
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">About You</label>
              <textarea
                name="bio"
                value={form.bio}
                onChange={handleChange}
                rows={2}
                className="w-full rounded-lg border border-gray-200 p-3 text-sm focus:border-amber-500 focus:outline-none resize-none"
                placeholder="Tell us about your preferences"
              />
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="rounded-full bg-amber-600 px-6 py-2 text-sm font-semibold text-white hover:bg-amber-700 disabled:opacity-50 transition-all"
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>

        <div className="grid sm:grid-cols-3 gap-4 mt-8 pt-6 border-t border-gray-100">
          <Link to="/orders" className="bg-gray-50 rounded-xl p-4 text-center hover:bg-amber-50 transition-all group">
            <ShoppingBag size={20} className="mx-auto text-gray-400 group-hover:text-amber-600 mb-2" />
            <p className="text-sm font-medium text-gray-600 group-hover:text-amber-600">Total Orders</p>
            <p className="text-xl font-bold text-gray-800">{ordersLoading ? '...' : orderCount}</p>
          </Link>
          <Link to="/favourites" className="bg-gray-50 rounded-xl p-4 text-center hover:bg-amber-50 transition-all group">
            <Heart size={20} className="mx-auto text-gray-400 group-hover:text-amber-600 mb-2" />
            <p className="text-sm font-medium text-gray-600 group-hover:text-amber-600">Favorites</p>
            <p className="text-xl font-bold text-gray-800">{favouritesCount}</p>
          </Link>
          <Link to="/addresses" className="bg-gray-50 rounded-xl p-4 text-center hover:bg-amber-50 transition-all group">
            <MapPin size={20} className="mx-auto text-gray-400 group-hover:text-amber-600 mb-2" />
            <p className="text-sm font-medium text-gray-600 group-hover:text-amber-600">Saved Addresses</p>
            <p className="text-xl font-bold text-gray-800">-</p>
          </Link>
        </div>
      </main>

      {showLogoutConfirm ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setShowLogoutConfirm(false)}>
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl" onClick={(event) => event.stopPropagation()}>
            <h2 className="text-lg font-bold text-gray-900">Confirm Logout</h2>
            <p className="mt-2 text-sm text-gray-500">You will need to sign in again to open your customer profile.</p>
            <div className="mt-6 flex gap-3">
              <button onClick={() => setShowLogoutConfirm(false)} className="flex-1 rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">Cancel</button>
              <button onClick={handleLogout} className="flex-1 rounded-lg bg-red-500 px-4 py-2 text-sm font-medium text-white hover:bg-red-600">Logout</button>
            </div>
          </div>
        </div>
      ) : null}

      <CustomerFooter />
    </div>
  );
}
