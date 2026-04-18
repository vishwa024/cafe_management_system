// import { useState } from 'react';
// import { Link, useNavigate, useSearchParams } from 'react-router-dom';
// import { motion } from 'framer-motion';
// import { Mail, Phone, Lock, Eye, EyeOff, ArrowLeft, ArrowRight, ShieldCheck } from 'lucide-react';
// import toast from 'react-hot-toast';
// import OTPInput from '../../components/shared/OTPInput';
// import api from '../../services/api';

// export default function ResetPasswordPage() {
//   const navigate = useNavigate();
//   const [searchParams] = useSearchParams();
//   const [loading, setLoading] = useState(false);
//   const [showPass, setShowPass] = useState(false);
//   const [form, setForm] = useState({
//     email: searchParams.get('email') || '',
//     phone: searchParams.get('phone') || '',
//     otp: '',
//     newPassword: '',
//   });

//   const handleChange = (e) => {
//     setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
//   };

//   const handleResetPassword = async (e) => {
//     e.preventDefault();

//     if (form.otp.length !== 6) {
//       toast.error('Enter the full 6-digit OTP');
//       return;
//     }

//     if (form.newPassword.length < 8) {
//       toast.error('Password must be at least 8 characters');
//       return;
//     }

//     setLoading(true);
//     try {
//       await api.post('/auth/reset-password', {
//         email: form.email || undefined,
//         phone: form.phone || undefined,
//         otp: form.otp,
//         newPassword: form.newPassword,
//       });

//       toast.success('Password reset successfully');
//       navigate('/login', { replace: true });
//     } catch (err) {
//       toast.error(err.response?.data?.message || 'Password reset failed');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-[#f7efe6] font-body relative overflow-hidden">
//       <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(230,57,70,0.10),_transparent_24%),radial-gradient(circle_at_bottom_right,_rgba(255,107,53,0.16),_transparent_30%),linear-gradient(180deg,#fff8f1_0%,#f7efe6_46%,#fdfbf8_100%)]" />
//       <div className="absolute -top-20 right-[-3rem] w-72 h-72 rounded-full bg-[#ffcfb2]/30 blur-3xl" />
//       <div className="absolute bottom-[-5rem] left-[-2rem] w-80 h-80 rounded-full bg-[#e63946]/10 blur-3xl" />

//       <div className="relative min-h-screen flex items-center justify-center px-4 py-8 sm:px-6 lg:px-10">
//         <motion.div
//           initial={{ opacity: 0, y: 24 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.45, ease: 'easeOut' }}
//           className="w-full max-w-5xl"
//         >
//           <div className="rounded-[34px] border border-white/70 bg-white/80 backdrop-blur-2xl shadow-[0_30px_100px_rgba(66,32,20,0.12)] overflow-hidden lg:grid lg:grid-cols-[0.9fr,1.1fr]">
//             <section className="hidden lg:flex relative min-h-[680px] bg-[#1f1714] text-white p-10 xl:p-12 overflow-hidden">
//               <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(255,145,77,0.34),_transparent_26%),radial-gradient(circle_at_bottom_left,_rgba(255,255,255,0.10),_transparent_34%)]" />
//               <div className="relative flex flex-col justify-between w-full">
//                 <div>
//                   <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-[11px] uppercase tracking-[0.24em] text-orange-100 font-semibold">
//                     <ShieldCheck size={13} />
//                     Reset Securely
//                   </div>
//                   <img src="https://rollercoastercafe.com/assets/images/roller_logo.png" alt="Roller Coaster Cafe" className="h-14 object-contain mt-8 mb-8" />
//                   <h1 className="font-display text-5xl xl:text-6xl leading-[0.95] font-bold max-w-lg">
//                     Set a fresh password now.
//                   </h1>
//                   <p className="mt-6 max-w-md text-white/72 text-lg leading-relaxed">
//                     Enter your OTP and choose a new password to regain secure access to your account.
//                   </p>
//                 </div>

//                 <div className="rounded-[24px] bg-white/10 border border-white/10 p-5 max-w-md">
//                   <p className="text-sm text-white/70 leading-relaxed">
//                     Use the same email or phone where you received the reset OTP.
//                   </p>
//                 </div>
//               </div>
//             </section>

//             <section className="p-5 sm:p-6 lg:p-10 xl:p-12 flex items-center">
//               <div className="w-full max-w-lg mx-auto">
//                 <Link to="/login" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-dark mb-6">
//                   <ArrowLeft size={16} />
//                   Back to login
//                 </Link>

//                 <div className="lg:hidden rounded-[28px] bg-[#1f1714] px-5 pt-5 pb-6 text-white relative overflow-hidden mb-6">
//                   <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(255,145,77,0.34),_transparent_26%),radial-gradient(circle_at_bottom_left,_rgba(255,255,255,0.10),_transparent_34%)]" />
//                   <div className="relative">
//                     <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-[11px] uppercase tracking-[0.22em] text-orange-100 font-semibold">
//                       <ShieldCheck size={13} />
//                       Reset Password
//                     </div>
//                     <img src="https://rollercoastercafe.com/assets/images/roller_logo.png" alt="Roller Coaster Cafe" className="h-11 object-contain mt-5 mb-4" />
//                     <h2 className="font-display text-[2.1rem] leading-none font-bold">New Password</h2>
//                     <p className="mt-3 text-white/72 text-sm leading-relaxed max-w-xs">
//                       Verify the OTP and set a strong new password.
//                     </p>
//                   </div>
//                 </div>

//                 <div className="mb-7">
//                   <p className="text-[11px] uppercase tracking-[0.24em] text-primary font-semibold mb-3 hidden lg:block">
//                     Reset Password
//                   </p>
//                   <h2 className="font-display text-4xl sm:text-[2.7rem] leading-none font-bold text-dark">
//                     Set New Password
//                   </h2>
//                   <p className="mt-3 text-gray-500 leading-relaxed">
//                     Enter the OTP you received and choose a new password below.
//                   </p>
//                 </div>

//                 <form onSubmit={handleResetPassword} className="space-y-4">
//                   <div>
//                     <label className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-400 block mb-2">
//                       Email
//                     </label>
//                     <div className="relative">
//                       <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
//                       <input
//                         name="email"
//                         type="email"
//                         value={form.email}
//                         onChange={handleChange}
//                         placeholder="Email address"
//                         className="input-field pl-12 h-14 rounded-2xl border-gray-100 bg-[#fcfbf9]"
//                       />
//                     </div>
//                   </div>

//                   <div>
//                     <label className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-400 block mb-2">
//                       Phone
//                     </label>
//                     <div className="relative">
//                       <Phone size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
//                       <input
//                         name="phone"
//                         type="tel"
//                         value={form.phone}
//                         onChange={handleChange}
//                         placeholder="+91 9xxxxxxxxx"
//                         className="input-field pl-12 h-14 rounded-2xl border-gray-100 bg-[#fcfbf9]"
//                       />
//                     </div>
//                   </div>

//                   <div className="rounded-[24px] border border-gray-100 bg-[#fcfbf9] px-4 py-5">
//                     <OTPInput length={6} value={form.otp} onChange={(otp) => setForm((prev) => ({ ...prev, otp }))} />
//                   </div>

//                   <div>
//                     <label className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-400 block mb-2">
//                       New Password
//                     </label>
//                     <div className="relative">
//                       <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
//                       <input
//                         name="newPassword"
//                         type={showPass ? 'text' : 'password'}
//                         value={form.newPassword}
//                         onChange={handleChange}
//                         placeholder="Minimum 8 characters"
//                         className="input-field pl-12 pr-12 h-14 rounded-2xl border-gray-100 bg-[#fcfbf9]"
//                         required
//                       />
//                       <button
//                         type="button"
//                         onClick={() => setShowPass((prev) => !prev)}
//                         className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
//                       >
//                         {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
//                       </button>
//                     </div>
//                   </div>

//                   <button type="submit" disabled={loading} className="btn-primary w-full !rounded-2xl !py-4 inline-flex items-center justify-center gap-2 text-sm">
//                     {loading ? (
//                       <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
//                     ) : (
//                       <>
//                         Save new password
//                         <ArrowRight size={16} />
//                       </>
//                     )}
//                   </button>
//                 </form>
//               </div>
//             </section>
//           </div>
//         </motion.div>
//       </div>
//     </div>
//   );
// }
import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Mail, Phone, Lock, Eye, EyeOff, ArrowLeft, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';
import OTPInput from '../../components/shared/OTPInput';
import api from '../../services/api';

export default function ResetPasswordPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [form, setForm] = useState({
    email: searchParams.get('email') || '',
    phone: searchParams.get('phone') || '',
    otp: '',
    newPassword: '',
  });

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (form.otp.length !== 6) {
      toast.error('Enter the full 6-digit OTP');
      return;
    }
    if (form.newPassword.length < 8) {
      toast.error('Password must be at least 8 characters');
      return;
    }
    setLoading(true);
    try {
      await api.post('/auth/reset-password', {
        email: form.email || undefined,
        phone: form.phone || undefined,
        otp: form.otp,
        newPassword: form.newPassword,
      });
      toast.success('Password reset successfully');
      navigate('/login', { replace: true });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Password reset failed');
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
          <h1 className="font-display text-2xl font-bold text-[#3f3328]">Reset password</h1>
          <p className="text-sm text-[#6b5f54] mt-1">Enter OTP and choose a new password</p>
        </div>

        <form onSubmit={handleResetPassword} className="space-y-4">
          <div>
            <label className="mb-1 block text-xs font-medium text-[#6b5f54]">Email</label>
            <div className="relative">
              <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#a0968c]" />
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Email address"
                className="w-full rounded-lg border border-[#e8e0d6] py-2 pl-9 pr-3 text-sm focus:border-[#b97844] focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-[#6b5f54]">Phone</label>
            <div className="relative">
              <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#a0968c]" />
              <input
                name="phone"
                type="tel"
                value={form.phone}
                onChange={handleChange}
                placeholder="+91 98765 43210"
                className="w-full rounded-lg border border-[#e8e0d6] py-2 pl-9 pr-3 text-sm focus:border-[#b97844] focus:outline-none"
              />
            </div>
          </div>

          <div className="rounded-lg bg-[#faf8f5] p-4">
            <OTPInput
              length={6}
              value={form.otp}
              onChange={(otp) => setForm((prev) => ({ ...prev, otp }))}
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-[#6b5f54]">New Password</label>
            <div className="relative">
              <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#a0968c]" />
              <input
                name="newPassword"
                type={showPass ? 'text' : 'password'}
                value={form.newPassword}
                onChange={handleChange}
                placeholder="Minimum 8 characters"
                className="w-full rounded-lg border border-[#e8e0d6] py-2 pl-9 pr-9 text-sm focus:border-[#b97844] focus:outline-none"
                required
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#a0968c]"
              >
                {showPass ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-[#b97844] py-2.5 text-sm font-semibold text-white hover:bg-[#9e6538] transition-all disabled:opacity-50"
          >
            {loading ? 'Resetting...' : 'Reset password'}
          </button>
        </form>
      </div>
    </div>
  );
}