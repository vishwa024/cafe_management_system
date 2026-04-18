import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Phone, Lock, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../services/api';

const normalizeEmail = (value) => String(value || '').trim().toLowerCase();
const normalizePhone = (value) => String(value || '').replace(/\D/g, '');
const isValidEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
const isValidPhone = (value) => /^\d{10,15}$/.test(value);
const isStrongPassword = (value) => /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(value);

export default function Register() {
  const navigate = useNavigate();
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '' });

  const handleChange = (e) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleRegister = async (e) => {
    e.preventDefault();

    const trimmedName = form.name.trim();
    const normalizedEmailValue = normalizeEmail(form.email);
    const normalizedPhoneValue = normalizePhone(form.phone);

    if (trimmedName.length < 2) {
      toast.error('Please enter your full name');
      return;
    }

    if (!isValidEmail(normalizedEmailValue)) {
      toast.error('Please enter a valid email address');
      return;
    }

    if (!isValidPhone(normalizedPhoneValue)) {
      toast.error('Please enter a valid phone number');
      return;
    }

    if (!isStrongPassword(form.password)) {
      toast.error('Password must be 8+ characters with uppercase, lowercase, and a number');
      return;
    }

    setLoading(true);
    try {
      await api.post('/auth/register', {
        name: trimmedName,
        email: normalizedEmailValue,
        phone: normalizedPhoneValue,
        password: form.password,
      });
      toast.success('Account created. Please verify your OTP.');
      navigate(`/otp-verify?mode=register&email=${encodeURIComponent(normalizedEmailValue)}&phone=${encodeURIComponent(normalizedPhoneValue)}`, { replace: true });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto flex min-h-screen max-w-6xl items-center justify-center px-4 py-10 sm:px-6">
        <div className="grid w-full overflow-hidden rounded-2xl border border-[#e8e0d6] bg-white shadow-lg lg:grid-cols-[1fr,0.95fr]">
          {/* Left Side - Branding */}
          <section className="hidden lg:flex flex-col justify-between bg-gradient-to-br from-[#3f3328] to-[#5a4a3a] p-10 text-white">
            <div>
              <img src="https://rollercoastercafe.com/assets/images/roller_logo.png" alt="Roller Coaster Cafe" className="h-14 object-contain mb-4" />
              <h1 className="font-display text-4xl font-bold leading-tight">Roller Coaster Cafe</h1>
              <p className="mt-4 text-white/70 text-sm leading-relaxed">Join us for a delightful culinary journey.</p>
              <div className="mt-8 overflow-hidden rounded-xl">
                <img
                  src="https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=800&q=80"
                  alt="Coffee"
                  className="h-56 w-full object-cover"
                />
              </div>
            </div>
            <div className="mt-8 pt-6 border-t border-white/20">
              <p className="text-xs text-white/50">Secure account with OTP verification</p>
            </div>
          </section>

          {/* Right Side - Register Form */}
          <section className="bg-white p-6 sm:p-8 lg:p-10">
            <div className="mx-auto w-full max-w-md">
              <div className="mb-6 text-center lg:text-left">
                <h2 className="font-display text-2xl font-bold text-[#3f3328]">Create account</h2>
                <p className="mt-1 text-sm text-[#6b5f54]">Join Roller Coaster Cafe today</p>
              </div>

              <form onSubmit={handleRegister} className="space-y-4">
                <div>
                  <label className="mb-1 block text-xs font-medium text-[#6b5f54]">Full Name</label>
                  <div className="relative">
                    <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#a0968c]" />
                    <input
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      placeholder="Your name"
                      className="w-full rounded-lg border border-[#e8e0d6] py-2 pl-9 pr-3 text-sm focus:border-[#b97844] focus:outline-none"
                      required
                    />
                  </div>
                </div>

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
                  <label className="mb-1 block text-xs font-medium text-[#6b5f54]">Phone Number <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#a0968c]" />
                    <input
                      name="phone"
                      type="tel"
                      value={form.phone}
                      onChange={handleChange}
                      placeholder="+91 98765 43210"
                      className="w-full rounded-lg border border-[#e8e0d6] py-2 pl-9 pr-3 text-sm focus:border-[#b97844] focus:outline-none"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-1 block text-xs font-medium text-[#6b5f54]">Password</label>
                  <div className="relative">
                    <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#a0968c]" />
                    <input
                      name="password"
                      type={showPass ? 'text' : 'password'}
                      value={form.password}
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

                <div className="text-center pt-2">
                  <p className="text-xs text-[#6b5f54]">
                    By registering, you agree to our{' '}
                    <Link to="/terms" className="text-[#b97844]">Terms</Link> and{' '}
                    <Link to="/privacy" className="text-[#b97844]">Privacy Policy</Link>
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-lg bg-[#b97844] py-2.5 text-sm font-semibold text-white hover:bg-[#9e6538] transition-all disabled:opacity-50"
                >
                  {loading ? 'Creating account...' : 'Create account'}
                </button>

                <div className="text-center">
                  <p className="text-xs text-[#6b5f54]">
                    Already have an account?{' '}
                    <Link to="/login" className="text-[#b97844] font-medium hover:underline">
                      Sign in
                    </Link>
                  </p>
                </div>
              </form>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
