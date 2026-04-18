import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, MessageSquare } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../services/api';
import { API_BASE_URL } from '../../config/runtime';

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [loginMode, setLoginMode] = useState('password');
  const [form, setForm] = useState({ email: '', password: '', otpIdentifier: '', otpType: 'email' });

  const from = typeof location.state?.from === 'string'
    ? location.state.from
    : location.state?.from?.pathname || '/dashboard';

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handlePasswordLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post('/auth/login', {
        email: form.email,
        password: form.password,
      });
      toast.success(data.message || 'OTP sent successfully');
      navigate(`/otp-verify?mode=login&email=${encodeURIComponent(data.email || form.email)}${data.phone ? `&phone=${encodeURIComponent(data.phone)}` : ''}&from=${encodeURIComponent(from)}`, { replace: true });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleOtpLogin = async (e) => {
    e.preventDefault();
    if (!form.otpIdentifier.trim()) {
      toast.error('Enter your email');
      return;
    }
    setLoading(true);
    try {
      const payload = {
        type: 'login',
        email: form.otpIdentifier.trim(),
      };
      await api.post('/auth/send-otp', payload);
      toast.success('OTP sent to your email');
      navigate(`/otp-verify?mode=login&email=${encodeURIComponent(form.otpIdentifier.trim())}&from=${encodeURIComponent(from)}`, { replace: true });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not send OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = `${API_BASE_URL}/auth/google`;
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto flex min-h-screen max-w-6xl items-center justify-center px-4 py-10 sm:px-6">
        <div className="grid w-full overflow-hidden rounded-2xl border border-[#e8e0d6] bg-white shadow-lg lg:grid-cols-[0.95fr,1.05fr]">
          {/* Left Side - Branding */}
          <section className="hidden lg:flex flex-col justify-between bg-gradient-to-br from-[#3f3328] to-[#5a4a3a] p-10 text-white">
            <div>
              <img src="https://rollercoastercafe.com/assets/images/roller_logo.png" alt="Roller Coaster Cafe" className="h-14 object-contain mb-4" />
              <h1 className="font-display text-4xl font-bold leading-tight">Roller Coaster Cafe</h1>
              <p className="mt-4 text-white/70 text-sm leading-relaxed">A symphony of flavors in a warm and welcoming ambiance.</p>
              <div className="mt-8 overflow-hidden rounded-xl">
                <img
                  src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80"
                  alt="Cafe interior"
                  className="h-56 w-full object-cover"
                />
              </div>
            </div>
            <div className="mt-8 pt-6 border-t border-white/20">
              <p className="text-xs text-white/50">Secure access with OTP verification</p>
            </div>
          </section>

          {/* Right Side - Login Form */}
          <section className="bg-white p-6 sm:p-8 lg:p-10">
            <div className="mx-auto w-full max-w-md">
              <div className="mb-6 text-center lg:text-left">
                <h2 className="font-display text-2xl font-bold text-[#3f3328]">Welcome back</h2>
                <p className="mt-1 text-sm text-[#6b5f54]">Sign in to continue your cafe experience</p>
              </div>

              {/* Google Sign In Button */}
              <button
                onClick={handleGoogleLogin}
                className="w-full flex items-center justify-center gap-2 rounded-lg border border-[#e8e0d6] py-2.5 text-sm font-medium text-[#3f3328] hover:bg-[#faf8f5] transition-all mb-4"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Continue with Google
              </button>

              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-[#e8e0d6]"></div>
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="bg-white px-2 text-[#a0968c]">Or continue with</span>
                </div>
              </div>

              {/* Toggle Buttons */}
              <div className="mb-5 grid grid-cols-2 gap-2 rounded-xl bg-[#faf8f5] p-1">
                <button
                  type="button"
                  onClick={() => setLoginMode('password')}
                  className={`rounded-lg px-4 py-2 text-sm font-medium transition-all ${
                    loginMode === 'password' ? 'bg-[#b97844] text-white' : 'text-[#6b5f54] hover:text-[#b97844]'
                  }`}
                >
                  Password
                </button>
                <button
                  type="button"
                  onClick={() => setLoginMode('otp')}
                  className={`rounded-lg px-4 py-2 text-sm font-medium transition-all ${
                    loginMode === 'otp' ? 'bg-[#b97844] text-white' : 'text-[#6b5f54] hover:text-[#b97844]'
                  }`}
                >
                  OTP Login
                </button>
              </div>

              {loginMode === 'password' ? (
                <form onSubmit={handlePasswordLogin} className="space-y-4">
                  <div>
                    <label className="mb-1 block text-xs font-medium text-[#6b5f54]">Email</label>
                    <div className="relative">
                      <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#a0968c]" />
                      <input
                        name="email"
                        type="email"
                        value={form.email}
                        onChange={handleChange}
                        placeholder="you@example.com"
                        className="w-full rounded-lg border border-[#e8e0d6] py-2 pl-9 pr-3 text-sm focus:border-[#b97844] focus:outline-none"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <div className="mb-1 flex items-center justify-between">
                      <label className="text-xs font-medium text-[#6b5f54]">Password</label>
                      <Link to="/forgot-password" className="text-xs text-[#b97844] hover:underline">Forgot?</Link>
                    </div>
                    <div className="relative">
                      <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#a0968c]" />
                      <input
                        name="password"
                        type={showPass ? 'text' : 'password'}
                        value={form.password}
                        onChange={handleChange}
                        placeholder="Enter your password"
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
                    {loading ? 'Sending...' : 'Continue'}
                  </button>
                </form>
              ) : (
                <form onSubmit={handleOtpLogin} className="space-y-4">
                  <div>
                    <label className="mb-1 block text-xs font-medium text-[#6b5f54]">Email</label>
                    <div className="relative">
                      <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#a0968c]" />
                      <input
                        name="otpIdentifier"
                        type="email"
                        value={form.otpIdentifier}
                        onChange={handleChange}
                        placeholder="you@example.com"
                        className="w-full rounded-lg border border-[#e8e0d6] py-2 pl-9 pr-3 text-sm focus:border-[#b97844] focus:outline-none"
                        required
                      />
                    </div>
                  </div>
                  <div className="rounded-lg bg-[#faf8f5] p-3 text-xs text-[#6b5f54]">
                    <MessageSquare size={12} className="inline mr-1 text-[#b97844]" />
                    OTP will be sent instantly to your email
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full rounded-lg bg-[#b97844] py-2.5 text-sm font-semibold text-white hover:bg-[#9e6538] transition-all disabled:opacity-50"
                  >
                    {loading ? 'Sending...' : 'Send OTP'}
                  </button>
                </form>
              )}

              <div className="mt-5 text-center">
                <p className="text-xs text-[#6b5f54]">
                  Don't have an account?{' '}
                  <Link to="/register" className="text-[#b97844] font-medium hover:underline">
                    Sign up
                  </Link>
                </p>
                <button
                  type="button"
                  onClick={() => navigate('/guest-dashboard', { replace: true })}
                  className="mt-3 text-xs text-[#a0968c] hover:text-[#b97844] transition-colors"
                >
                  Continue as Guest
                </button>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
