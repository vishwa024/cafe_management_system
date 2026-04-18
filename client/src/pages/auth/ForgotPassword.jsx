import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Phone, ArrowLeft, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../services/api';

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ email: '', phone: '' });

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSendReset = async (e) => {
    e.preventDefault();
    if (!form.email && !form.phone) {
      toast.error('Enter email or phone number');
      return;
    }
    setLoading(true);
    try {
      await api.post('/auth/forgot-password', {
        email: form.email || undefined,
        phone: form.phone || undefined,
      });
      toast.success('Reset OTP sent successfully');
      navigate(`/reset-password?email=${encodeURIComponent(form.email || '')}&phone=${encodeURIComponent(form.phone || '')}`, { replace: true });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send reset OTP');
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
          <h1 className="font-display text-2xl font-bold text-[#3f3328]">Forgot password?</h1>
          <p className="text-sm text-[#6b5f54] mt-1">Enter your email or phone to reset your password</p>
        </div>

        <form onSubmit={handleSendReset} className="space-y-4">
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

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-[#b97844] py-2.5 text-sm font-semibold text-white hover:bg-[#9e6538] transition-all disabled:opacity-50"
          >
            {loading ? 'Sending...' : 'Send reset OTP'}
          </button>
        </form>
      </div>
    </div>
  );
}