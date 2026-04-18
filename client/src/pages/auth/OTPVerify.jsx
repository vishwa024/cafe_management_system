// // import { useMemo, useState } from 'react';
// // import { Link, useNavigate, useSearchParams } from 'react-router-dom';
// // import { useDispatch } from 'react-redux';
// // import { motion } from 'framer-motion';
// // import toast from 'react-hot-toast';
// // import { Mail, Phone, ArrowLeft, ArrowRight } from 'lucide-react';
// // import OTPInput from '../../components/shared/OTPInput';
// // import api from '../../services/api';
// // import { setUser } from '../../store/slices/authSlice';

// // const ROLE_REDIRECTS = {
// //   admin: '/admin',
// //   manager: '/manager',
// //   staff: '/staff',
// //   kitchen: '/kitchen',
// //   delivery: '/delivery',
// //   customer: '/dashboard',
// // };

// // export default function OTPVerify() {
// //   const dispatch = useDispatch();
// //   const navigate = useNavigate();
// //   const [searchParams] = useSearchParams();
// //   const mode = searchParams.get('mode') || 'login';
// //   const from = searchParams.get('from') || '/dashboard';
// //   const [loading, setLoading] = useState(false);
// //   const [form, setForm] = useState({
// //     email: searchParams.get('email') || '',
// //     phone: searchParams.get('phone') || '',
// //     otp: '',
// //   });

// //   const otpType = useMemo(() => (mode === 'register' ? 'email-verify' : 'login'), [mode]);

// //   const handleVerify = async () => {
// //     if (form.otp.length !== 6) {
// //       toast.error('Enter the full 6-digit OTP');
// //       return;
// //     }

// //     setLoading(true);
// //     try {
// //       const { data } = await api.post('/auth/verify-otp', {
// //         email: form.email || undefined,
// //         phone: form.phone || undefined,
// //         otp: form.otp,
// //         type: otpType,
// //       });

// //       if (mode === 'register') {
// //         toast.success('Account verified. Please login now.');
// //         navigate('/login', { replace: true });
// //         return;
// //       }

// //       localStorage.setItem('token', data.token || data.accessToken);
// //       dispatch(setUser(data.user));
// //       toast.success('OTP verified successfully');

// //       const target =
// //         data.user?.role === 'customer'
// //           ? from || ROLE_REDIRECTS.customer
// //           : ROLE_REDIRECTS[data.user?.role] || '/login';
// //       navigate(target, { replace: true });
// //     } catch (err) {
// //       toast.error(err.response?.data?.message || 'OTP verification failed');
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   const handleSubmit = (e) => {
// //     e.preventDefault();
// //     handleVerify();
// //   };

// //   const handleResendOTP = async () => {
// //     try {
// //       await api.post('/auth/send-otp', {
// //         email: form.email || undefined,
// //         phone: form.phone || undefined,
// //         type: otpType,
// //       });
// //       toast.success('OTP resent successfully');
// //     } catch (err) {
// //       toast.error(err.response?.data?.message || 'Failed to resend OTP');
// //     }
// //   };

// //   return (
// //     <div className="min-h-screen bg-[#f6efe7] font-body relative overflow-hidden">
// //       <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(233,201,143,0.24),_transparent_26%),radial-gradient(circle_at_bottom_right,_rgba(185,120,68,0.14),_transparent_30%),linear-gradient(180deg,#fbf4ec_0%,#f6efe7_48%,#fcf8f3_100%)]" />
// //       <div className="absolute -top-20 right-[-3rem] w-72 h-72 rounded-full bg-[#f1dfc9]/55 blur-3xl" />
// //       <div className="absolute bottom-[-5rem] left-[-2rem] w-80 h-80 rounded-full bg-[#ead2b1]/50 blur-3xl" />

// //       <div className="relative min-h-screen flex items-center justify-center px-4 py-8 sm:px-6 lg:px-10">
// //         <motion.div
// //           initial={{ opacity: 0, y: 24 }}
// //           animate={{ opacity: 1, y: 0 }}
// //           transition={{ duration: 0.45, ease: 'easeOut' }}
// //           className="w-full max-w-2xl"
// //         >
// //           <div className="rounded-[34px] border border-[#e6d9cb] bg-[#fbf6ef]/92 backdrop-blur-xl shadow-[0_30px_90px_rgba(80,58,38,0.10)] overflow-hidden">
// //             <section className="p-5 sm:p-6 lg:p-10 xl:p-12 bg-[#fffaf4]">
// //               <div className="w-full max-w-lg mx-auto">
// //                 <Link to="/login" className="inline-flex items-center gap-2 text-sm text-[#7a6f63] hover:text-[#45352a] mb-8">
// //                   <ArrowLeft size={16} />
// //                   Back to login
// //                 </Link>

// //                 <div className="mb-8">
// //                   <p className="text-[11px] uppercase tracking-[0.24em] text-[#9a6840] font-semibold mb-3">
// //                     Secure Verification
// //                   </p>
// //                   <h1 className="font-display text-4xl sm:text-[2.7rem] leading-none font-bold text-[#45352a]">
// //                     Verify OTP
// //                   </h1>
// //                   <p className="mt-3 text-[#7a6f63] leading-relaxed">
// //                     Complete your {mode === 'register' ? 'registration' : 'sign in'} using the 6-digit code sent to you.
// //                   </p>
// //                 </div>

// //                 <form onSubmit={handleSubmit} className="space-y-4">
// //                   <div>
// //                     <label className="text-xs font-semibold uppercase tracking-[0.18em] text-[#a0968c] block mb-2">
// //                       Email
// //                     </label>
// //                     <div className="relative">
// //                       <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9d9184]" />
// //                       <input
// //                         type="email"
// //                         value={form.email}
// //                         onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
// //                         placeholder="Email address"
// //                         className="input-field pl-12 h-14 rounded-2xl border-[#e7ddd1] bg-white"
// //                       />
// //                     </div>
// //                   </div>

// //                   <div>
// //                     <label className="text-xs font-semibold uppercase tracking-[0.18em] text-[#a0968c] block mb-2">
// //                       Phone
// //                     </label>
// //                     <div className="relative">
// //                       <Phone size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9d9184]" />
// //                       <input
// //                         type="tel"
// //                         value={form.phone}
// //                         onChange={(e) => setForm((prev) => ({ ...prev, phone: e.target.value }))}
// //                         placeholder="+91 9xxxxxxxxx"
// //                         className="input-field pl-12 h-14 rounded-2xl border-[#e7ddd1] bg-white"
// //                       />
// //                     </div>
// //                   </div>

// //                   <div className="rounded-[24px] border border-[#e7ddd1] bg-white px-4 py-5">
// //                     <OTPInput
// //                       length={6}
// //                       value={form.otp}
// //                       onChange={(otp) => setForm((prev) => ({ ...prev, otp }))}
// //                       onEnter={handleVerify}
// //                     />
// //                   </div>

// //                   <button type="submit" disabled={loading} className="w-full rounded-2xl bg-[#8e5b33] px-5 py-4 inline-flex items-center justify-center gap-2 text-sm font-semibold text-white hover:brightness-105 transition-all disabled:opacity-60">
// //                     {loading ? (
// //                       <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
// //                     ) : (
// //                       <>
// //                         Verify and continue
// //                         <ArrowRight size={16} />
// //                       </>
// //                     )}
// //                   </button>

// //                   <button type="button" onClick={handleResendOTP} className="w-full text-[#8e5b33] text-sm font-semibold hover:underline">
// //                     Resend OTP
// //                   </button>
// //                 </form>
// //               </div>
// //             </section>
// //           </div>
// //         </motion.div>
// //       </div>
// //     </div>
// //   );
// // }
// import { useMemo, useState } from 'react';
// import { Link, useNavigate, useSearchParams } from 'react-router-dom';
// import { useDispatch } from 'react-redux';
// import { Mail, Phone, ArrowLeft, ArrowRight } from 'lucide-react';
// import toast from 'react-hot-toast';
// import OTPInput from '../../components/shared/OTPInput';
// import api from '../../services/api';
// import { setUser } from '../../store/slices/authSlice';

// const ROLE_REDIRECTS = {
//   admin: '/admin',
//   manager: '/manager',
//   staff: '/staff',
//   kitchen: '/kitchen',
//   delivery: '/delivery',
//   customer: '/dashboard',
// };

// export default function OTPVerify() {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const [searchParams] = useSearchParams();
//   const mode = searchParams.get('mode') || 'login';
//   const from = searchParams.get('from') || '/dashboard';
//   const [loading, setLoading] = useState(false);
//   const [form, setForm] = useState({
//     email: searchParams.get('email') || '',
//     phone: searchParams.get('phone') || '',
//     otp: '',
//   });

//   const otpType = useMemo(() => (mode === 'register' ? 'email-verify' : 'login'), [mode]);

//   const handleVerify = async () => {
//     if (form.otp.length !== 6) {
//       toast.error('Enter the full 6-digit OTP');
//       return;
//     }
//     setLoading(true);
//     try {
//       const { data } = await api.post('/auth/verify-otp', {
//         email: form.email || undefined,
//         phone: form.phone || undefined,
//         otp: form.otp,
//         type: otpType,
//       });

//       if (mode === 'register') {
//         toast.success('Account verified. Please login now.');
//         navigate('/login', { replace: true });
//         return;
//       }

//       localStorage.setItem('token', data.token || data.accessToken);
//       dispatch(setUser(data.user));
//       toast.success('OTP verified successfully');

//       const target = data.user?.role === 'customer' ? from || ROLE_REDIRECTS.customer : ROLE_REDIRECTS[data.user?.role] || '/login';
//       navigate(target, { replace: true });
//     } catch (err) {
//       toast.error(err.response?.data?.message || 'OTP verification failed');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     handleVerify();
//   };

//   const handleResendOTP = async () => {
//     try {
//       await api.post('/auth/send-otp', {
//         email: form.email || undefined,
//         phone: form.phone || undefined,
//         type: otpType,
//       });
//       toast.success('OTP resent successfully');
//     } catch (err) {
//       toast.error(err.response?.data?.message || 'Failed to resend OTP');
//     }
//   };

//   return (
//     <div className="min-h-screen bg-white flex items-center justify-center px-4">
//       <div className="max-w-md w-full bg-white rounded-2xl border border-[#e8e0d6] p-8 shadow-lg">
//         <Link to="/login" className="inline-flex items-center gap-1 text-sm text-[#6b5f54] hover:text-[#b97844] mb-6">
//           <ArrowLeft size={14} /> Back to login
//         </Link>

//         <div className="mb-6">
//           <h1 className="font-display text-2xl font-bold text-[#3f3328]">Verify OTP</h1>
//           <p className="text-sm text-[#6b5f54] mt-1">Enter the 6-digit code sent to you</p>
//         </div>

//         <form onSubmit={handleSubmit} className="space-y-4">
//           <div>
//             <label className="mb-1 block text-xs font-medium text-[#6b5f54]">Email</label>
//             <div className="relative">
//               <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#a0968c]" />
//               <input
//                 type="email"
//                 value={form.email}
//                 onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
//                 placeholder="Email address"
//                 className="w-full rounded-lg border border-[#e8e0d6] py-2 pl-9 pr-3 text-sm focus:border-[#b97844] focus:outline-none"
//               />
//             </div>
//           </div>

//           <div>
//             <label className="mb-1 block text-xs font-medium text-[#6b5f54]">Phone</label>
//             <div className="relative">
//               <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#a0968c]" />
//               <input
//                 type="tel"
//                 value={form.phone}
//                 onChange={(e) => setForm((prev) => ({ ...prev, phone: e.target.value }))}
//                 placeholder="+91 98765 43210"
//                 className="w-full rounded-lg border border-[#e8e0d6] py-2 pl-9 pr-3 text-sm focus:border-[#b97844] focus:outline-none"
//               />
//             </div>
//           </div>

//           <div className="rounded-lg bg-[#faf8f5] p-4">
//             <OTPInput
//               length={6}
//               value={form.otp}
//               onChange={(otp) => setForm((prev) => ({ ...prev, otp }))}
//               onEnter={handleVerify}
//             />
//           </div>

//           <button
//             type="submit"
//             disabled={loading}
//             className="w-full rounded-lg bg-[#b97844] py-2.5 text-sm font-semibold text-white hover:bg-[#9e6538] transition-all disabled:opacity-50"
//           >
//             {loading ? 'Verifying...' : 'Verify & continue'}
//           </button>

//           <button
//             type="button"
//             onClick={handleResendOTP}
//             className="w-full text-center text-sm text-[#b97844] hover:underline"
//           >
//             Resend OTP
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// }

import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Mail, Phone, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';
import OTPInput from '../../components/shared/OTPInput';
import api from '../../services/api';
import { setUser } from '../../store/slices/authSlice';
import { mergeGuestCartItems } from '../../store/slices/cartSlice';
import { loadGuestCart, clearGuestCart } from '../../utils/cartStorage';

const ROLE_REDIRECTS = {
  admin: '/admin',
  manager: '/manager',
  staff: '/staff',
  kitchen: '/kitchen',
  delivery: '/delivery',
  customer: '/',
};

export default function OTPVerify() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const mode = searchParams.get('mode') || 'login';
  const from = searchParams.get('from') || '/';
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    email: searchParams.get('email') || '',
    phone: searchParams.get('phone') || '',
    otp: '',
  });

  const handleVerify = async () => {
    if (form.otp.length !== 6) {
      toast.error('Enter the full 6-digit OTP');
      return;
    }

    if (!form.email && !form.phone) {
      toast.error('Please enter your email or phone number');
      return;
    }

    setLoading(true);
    try {
      // Create payload based on what's available
      const payload = {};
      
      if (form.email) {
        payload.email = form.email;
      }
      if (form.phone) {
        payload.phone = form.phone;
      }
      payload.otp = form.otp;
      
      // Add type for backend
      if (mode === 'register') {
        payload.type = 'email-verify';
      } else {
        payload.type = 'login';
      }

      console.log('Sending payload:', payload);

      const { data } = await api.post('/auth/verify-otp', payload);
      
      console.log('Response:', data);

      if (mode === 'register') {
        toast.success('Account verified! Please login.');
        navigate('/login', { replace: true });
        return;
      }

      // Login mode - store token and user data
      if (data.token) {
        localStorage.setItem('token', data.token);
      }
      if (data.accessToken) {
        localStorage.setItem('token', data.accessToken);
      }
      
      if (data.user) {
        dispatch(setUser(data.user));
      }

      const guestCartItems = loadGuestCart();
      if (guestCartItems.length > 0) {
        dispatch(mergeGuestCartItems(guestCartItems));
        clearGuestCart();
      }
      
      toast.success('OTP verified successfully!');

      const userRole = data.user?.role || 'customer';
      const target = userRole === 'customer' ? (from || ROLE_REDIRECTS.customer) : (ROLE_REDIRECTS[userRole] || '/login');
      navigate(target, { replace: true });
      
    } catch (err) {
      console.error('Verification Error:', err.response?.data);
      const errorMsg = err.response?.data?.message || err.response?.data?.error || 'OTP verification failed';
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleVerify();
  };

  const handleResendOTP = async () => {
    if (!form.email && !form.phone) {
      toast.error('Enter email or phone to resend OTP');
      return;
    }

    setLoading(true);
    try {
      const payload = {};
      
      if (form.email) {
        payload.email = form.email;
      }
      if (form.phone) {
        payload.phone = form.phone;
      }
      payload.type = mode === 'register' ? 'email-verify' : 'login';

      console.log('Resending OTP:', payload);
      
      await api.post('/auth/send-otp', payload);
      toast.success('OTP resent successfully!');
    } catch (err) {
      console.error('Resend Error:', err.response?.data);
      toast.error(err.response?.data?.message || 'Failed to resend OTP');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-2xl border border-[#e8e0d6] p-8 shadow-lg">
        <Link to="/login" className="inline-flex items-center gap-1 text-sm text-[#6b5f54] hover:text-[#b97844] mb-6">
          <ArrowLeft size={14} /> Back to login
        </Link>

        <div className="mb-6">
          <h1 className="font-display text-2xl font-bold text-[#3f3328]">Verify OTP</h1>
          <p className="text-sm text-[#6b5f54] mt-1">
            Enter the 6-digit code sent to {form.email || form.phone || 'your contact'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {(mode === 'login' && !searchParams.get('email') && !searchParams.get('phone')) && (
            <>
              <div>
                <label className="mb-1 block text-xs font-medium text-[#6b5f54]">Email</label>
                <div className="relative">
                  <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#a0968c]" />
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="you@example.com"
                    className="w-full rounded-lg border border-[#e8e0d6] py-2 pl-9 pr-3 text-sm focus:border-[#b97844] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium text-[#6b5f54]">Phone</label>
                <div className="relative">
                  <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#a0968c]" />
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(e) => setForm(prev => ({ ...prev, phone: e.target.value }))}
                    placeholder="+91 98765 43210"
                    className="w-full rounded-lg border border-[#e8e0d6] py-2 pl-9 pr-3 text-sm focus:border-[#b97844] focus:outline-none"
                  />
                </div>
              </div>
            </>
          )}

          <div className="rounded-lg bg-[#faf8f5] p-4">
            <OTPInput
              length={6}
              value={form.otp}
              onChange={(otp) => setForm(prev => ({ ...prev, otp }))}
              onEnter={handleVerify}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-[#b97844] py-2.5 text-sm font-semibold text-white hover:bg-[#9e6538] transition-all disabled:opacity-50"
          >
            {loading ? 'Verifying...' : 'Verify & continue'}
          </button>

          <button
            type="button"
            onClick={handleResendOTP}
            disabled={loading}
            className="w-full text-center text-sm text-[#b97844] hover:underline disabled:opacity-50"
          >
            Resend OTP
          </button>
        </form>
      </div>
    </div>
  );
}
