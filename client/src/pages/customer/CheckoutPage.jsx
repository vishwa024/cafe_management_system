import { useEffect, useMemo, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useQuery } from '@tanstack/react-query';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MapPin,
  ChevronRight,
  Tag,
  CheckCircle,
  LocateFixed,
  CalendarDays,
  Users,
  Table2,
  Truck,
  ShoppingBag,
  BellRing,
  ShieldCheck,
  Wallet,
  CreditCard,
  BadgeIndianRupee,
  Clock,
  Home,
} from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../services/api';
import { selectCartItems, selectCartSubtotal, clearCart, setOrderType } from '../../store/slices/cartSlice';

const STEPS = ['Order Type', 'Details', 'Payment', 'Confirm'];
const ORDER_TYPES = [
  { value: 'delivery', label: 'Delivery', desc: 'Delivered to your door', icon: Truck },
  { value: 'takeaway', label: 'Takeaway', desc: 'Pick up at cafe', icon: ShoppingBag },
  { value: 'dine-in', label: 'Dine-In', desc: 'Eat at the cafe', icon: Table2 },
  { value: 'pre-order', label: 'Pre-Order', desc: 'Schedule for later', icon: CalendarDays },
];
const PAYMENT_METHODS = [
  { value: 'cod', label: 'Cash on Delivery', desc: 'Pay when you receive', icon: BadgeIndianRupee },
  { value: 'wallet', label: 'Cafe Wallet', desc: 'Use wallet balance', icon: Wallet },
];

const QUICK_TIPS = [20, 50, 100];

export default function CheckoutPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const items = useSelector(selectCartItems);
  const subtotal = useSelector(selectCartSubtotal);
  const initialMode = searchParams.get('mode') || 'delivery';

  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [locating, setLocating] = useState(false);
  const [form, setForm] = useState({
    orderType: initialMode,
    address: '',
    scheduledTime: '',
    paymentMethod: 'cod',
    specialNotes: '',
    tableNumber: '',
    guestCount: 2,
    location: null,
    acceptRules: false,
    tipAmount: 0,
  });

  useEffect(() => {
    if (ORDER_TYPES.some((item) => item.value === initialMode)) {
      dispatch(setOrderType(initialMode));
    }
  }, [dispatch, initialMode]);

  const tax = Math.round(subtotal * 0.05);
  const deliveryFee = form.orderType === 'delivery' ? 30 : 0;
  const deliveryTip = form.orderType === 'delivery' ? Math.max(0, Number(form.tipAmount) || 0) : 0;
  const total = subtotal + tax + deliveryFee + deliveryTip;

  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast.error('Geolocation not supported');
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setForm((prev) => ({
          ...prev,
          address: `Current location (${position.coords.latitude.toFixed(4)}, ${position.coords.longitude.toFixed(4)})`,
          location: { lat: position.coords.latitude, lng: position.coords.longitude },
        }));
        toast.success('Location added');
        setLocating(false);
      },
      () => {
        toast.error('Unable to get location');
        setLocating(false);
      }
    );
  };

  const validateStep = () => {
    if (step === 0 && !form.orderType) {
      toast.error('Select order type');
      return false;
    }
    if (step === 1) {
      if (form.orderType === 'delivery' && !form.address.trim()) {
        toast.error('Add delivery address');
        return false;
      }
      if (form.orderType === 'dine-in' && !form.tableNumber.trim()) {
        toast.error('Enter table number');
        return false;
      }
      if (!form.acceptRules) {
        toast.error('Accept terms to continue');
        return false;
      }
    }
    if (step === 2 && !form.paymentMethod) {
      toast.error('Select payment method');
      return false;
    }
    return true;
  };

  const handleNext = () => {
    if (validateStep()) {
      setStep((s) => Math.min(3, s + 1));
    }
  };

  const handleBack = () => {
    setStep((s) => Math.max(0, s - 1));
  };

  const handlePlaceOrder = async () => {
    if (!items.length) {
      toast.error('Cart is empty');
      return;
    }
    if (!form.acceptRules) {
      toast.error('Accept terms to place order');
      return;
    }

    setLoading(true);
    try {
      const { data } = await api.post('/orders', {
        items: items.map((item) => ({
          menuItemId: item.menuItemId,
          quantity: item.quantity,
          variant: item.variant,
          addons: item.addons,
        })),
        orderType: form.orderType,
        deliveryAddress: form.orderType === 'delivery' ? { text: form.address, lat: form.location?.lat, lng: form.location?.lng } : undefined,
        scheduledTime: form.scheduledTime || undefined,
        paymentMethod: form.paymentMethod,
        tipAmount: deliveryTip,
        customerAcceptedTerms: form.acceptRules,
        specialNotes: form.specialNotes,
      });
      dispatch(clearCart());
      toast.success(`Order placed! #${data.order.orderId}`);
      navigate(`/track/${data.order._id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Order failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-[#e8e0d6] bg-white sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <Link to="/dashboard" className="flex items-center gap-2">
              <img 
                src="https://rollercoastercafe.com/assets/images/roller_logo.png" 
                alt="Logo"
                className="h-8 w-8 rounded-full object-cover"
              />
              <span className="font-semibold text-lg text-[#3f3328]">Roller Coaster Cafe</span>
            </Link>
            <nav className="hidden md:flex items-center gap-6">
              <Link to="/dashboard" className="text-sm text-[#6b5f54] hover:text-[#b97844]">Home</Link>
              <Link to="/menu" className="text-sm text-[#6b5f54] hover:text-[#b97844]">Menu</Link>
              <Link to="/orders" className="text-sm text-[#6b5f54] hover:text-[#b97844]">Orders</Link>
              <Link to="/profile" className="text-sm text-[#6b5f54] hover:text-[#b97844]">Profile</Link>
            </nav>
            <Link to={`/cart?mode=${form.orderType}`} className="text-sm text-[#b97844] hover:underline">Back to Cart</Link>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-6">
        {/* Steps */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {STEPS.map((title, index) => (
            <div key={title} className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all ${
                index < step ? 'bg-green-500 text-white' : index === step ? 'bg-[#b97844] text-white' : 'bg-[#faf8f5] text-[#a0968c]'
              }`}>
                {index < step ? <CheckCircle size={14} /> : index + 1}
              </div>
              <span className={`text-xs ml-2 hidden sm:inline ${index === step ? 'text-[#3f3328] font-medium' : 'text-[#a0968c]'}`}>
                {title}
              </span>
              {index < STEPS.length - 1 && <ChevronRight size={14} className="mx-2 text-[#e8e0d6]" />}
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-[1.2fr,0.8fr] gap-8">
          {/* Main Form */}
          <div className="space-y-4">
            {step === 0 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white border border-[#e8e0d6] rounded-xl p-6">
                <h2 className="font-semibold text-lg text-[#3f3328] mb-4">How would you like your order?</h2>
                <div className="grid grid-cols-2 gap-3">
                  {ORDER_TYPES.map(({ value, label, desc, icon: Icon }) => (
                    <button
                      key={value}
                      onClick={() => setForm(prev => ({ ...prev, orderType: value, acceptRules: false }))}
                      className={`p-4 rounded-xl border-2 text-left transition-all ${
                        form.orderType === value ? 'border-[#b97844] bg-[#faf8f5]' : 'border-[#e8e0d6] hover:border-[#b97844]'
                      }`}
                    >
                      <Icon size={20} className="text-[#b97844] mb-2" />
                      <p className="font-semibold text-[#3f3328]">{label}</p>
                      <p className="text-xs text-[#6b5f54] mt-1">{desc}</p>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {step === 1 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white border border-[#e8e0d6] rounded-xl p-6 space-y-5">
                {form.orderType === 'delivery' ? (
                  <>
                    <div>
                      <h2 className="font-semibold text-lg text-[#3f3328] mb-1">Delivery Address</h2>
                      <p className="text-sm text-[#6b5f54]">Where should we deliver your order?</p>
                    </div>
                    <textarea
                      value={form.address}
                      onChange={(e) => setForm(prev => ({ ...prev, address: e.target.value }))}
                      placeholder="Enter full address"
                      className="w-full rounded-lg border border-[#e8e0d6] p-3 text-sm focus:border-[#b97844] focus:outline-none resize-none"
                      rows={3}
                    />
                    <button onClick={handleUseCurrentLocation} disabled={locating} className="inline-flex items-center gap-2 text-sm text-[#b97844] hover:underline">
                      <LocateFixed size={14} /> {locating ? 'Getting location...' : 'Use current location'}
                    </button>
                  </>
                ) : form.orderType === 'dine-in' ? (
                  <>
                    <div>
                      <h2 className="font-semibold text-lg text-[#3f3328] mb-1">Table Booking</h2>
                      <p className="text-sm text-[#6b5f54]">Tell us your preference</p>
                    </div>
                    <input
                      value={form.tableNumber}
                      onChange={(e) => setForm(prev => ({ ...prev, tableNumber: e.target.value }))}
                      placeholder="Table number or preferred zone"
                      className="w-full rounded-lg border border-[#e8e0d6] p-3 text-sm focus:border-[#b97844] focus:outline-none"
                    />
                    <div className="flex items-center gap-2">
                      <Users size={16} className="text-[#a0968c]" />
                      <input
                        type="number"
                        min="1"
                        max="20"
                        value={form.guestCount}
                        onChange={(e) => setForm(prev => ({ ...prev, guestCount: Number(e.target.value) }))}
                        className="w-24 rounded-lg border border-[#e8e0d6] p-2 text-sm focus:border-[#b97844] focus:outline-none"
                      />
                      <span className="text-sm text-[#6b5f54]">guests</span>
                    </div>
                  </>
                ) : (
                  <>
                    <div>
                      <h2 className="font-semibold text-lg text-[#3f3328] mb-1">{form.orderType === 'pre-order' ? 'Schedule Time' : 'Special Instructions'}</h2>
                      <p className="text-sm text-[#6b5f54]">
                        {form.orderType === 'pre-order' ? 'When would you like your order ready?' : 'Any special requests?'}
                      </p>
                    </div>
                    {form.orderType === 'pre-order' && (
                      <input
                        type="datetime-local"
                        value={form.scheduledTime}
                        onChange={(e) => setForm(prev => ({ ...prev, scheduledTime: e.target.value }))}
                        className="w-full rounded-lg border border-[#e8e0d6] p-3 text-sm focus:border-[#b97844] focus:outline-none"
                      />
                    )}
                    <textarea
                      value={form.specialNotes}
                      onChange={(e) => setForm(prev => ({ ...prev, specialNotes: e.target.value }))}
                      placeholder="Any special requests or notes..."
                      className="w-full rounded-lg border border-[#e8e0d6] p-3 text-sm focus:border-[#b97844] focus:outline-none resize-none"
                      rows={3}
                    />
                  </>
                )}

                <div className="rounded-xl bg-[#faf8f5] p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <ShieldCheck size={16} className="text-[#b97844]" />
                    <h3 className="font-medium text-[#3f3328]">Order Terms</h3>
                  </div>
                  <p className="text-xs text-[#6b5f54] mb-3">By proceeding, you agree to our order terms and conditions.</p>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form.acceptRules}
                      onChange={(e) => setForm(prev => ({ ...prev, acceptRules: e.target.checked }))}
                      className="rounded border-[#e8e0d6] text-[#b97844] focus:ring-[#b97844]"
                    />
                    <span className="text-sm text-[#3f3328]">I accept the terms and conditions</span>
                  </label>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white border border-[#e8e0d6] rounded-xl p-6 space-y-4">
                <h2 className="font-semibold text-lg text-[#3f3328] mb-3">Payment Method</h2>
                {PAYMENT_METHODS.map(({ value, label, desc, icon: Icon }) => (
                  <button
                    key={value}
                    onClick={() => setForm(prev => ({ ...prev, paymentMethod: value }))}
                    className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                      form.paymentMethod === value ? 'border-[#b97844] bg-[#faf8f5]' : 'border-[#e8e0d6] hover:border-[#b97844]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon size={18} className="text-[#b97844]" />
                      <div>
                        <p className="font-semibold text-[#3f3328]">{label}</p>
                        <p className="text-xs text-[#6b5f54]">{desc}</p>
                      </div>
                    </div>
                  </button>
                ))}

                {form.orderType === 'delivery' && (
                  <div className="rounded-xl border border-[#e8e0d6] p-4 mt-4">
                    <div className="flex items-center gap-2 mb-3">
                      <Wallet size={16} className="text-[#b97844]" />
                      <h3 className="font-medium text-[#3f3328]">Delivery Tip (Optional)</h3>
                    </div>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {QUICK_TIPS.map((amount) => (
                        <button
                          key={amount}
                          onClick={() => setForm(prev => ({ ...prev, tipAmount: amount }))}
                          className={`px-3 py-1.5 rounded-full text-sm transition-all ${
                            form.tipAmount === amount ? 'bg-[#b97844] text-white' : 'border border-[#e8e0d6] text-[#6b5f54] hover:border-[#b97844]'
                          }`}
                        >
                          ₹{amount}
                        </button>
                      ))}
                    </div>
                    <input
                      type="number"
                      min="0"
                      value={form.tipAmount}
                      onChange={(e) => setForm(prev => ({ ...prev, tipAmount: Number(e.target.value) }))}
                      placeholder="Custom amount"
                      className="w-full rounded-lg border border-[#e8e0d6] p-2 text-sm focus:border-[#b97844] focus:outline-none"
                    />
                  </div>
                )}
              </motion.div>
            )}

            {step === 3 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white border border-[#e8e0d6] rounded-xl p-6">
                <h2 className="font-semibold text-lg text-[#3f3328] mb-4">Confirm Order</h2>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between"><span className="text-[#6b5f54]">Order Type</span><span className="font-medium text-[#3f3328] capitalize">{form.orderType}</span></div>
                  {form.address && <div className="flex justify-between"><span className="text-[#6b5f54]">Address</span><span className="font-medium text-[#3f3328] text-right">{form.address}</span></div>}
                  {form.tableNumber && <div className="flex justify-between"><span className="text-[#6b5f54]">Table</span><span className="font-medium text-[#3f3328]">{form.tableNumber}</span></div>}
                  {form.scheduledTime && <div className="flex justify-between"><span className="text-[#6b5f54]">Scheduled</span><span className="font-medium text-[#3f3328]">{new Date(form.scheduledTime).toLocaleString()}</span></div>}
                  <div className="flex justify-between"><span className="text-[#6b5f54]">Payment</span><span className="font-medium text-[#3f3328] capitalize">{form.paymentMethod}</span></div>
                  {form.tipAmount > 0 && <div className="flex justify-between"><span className="text-[#6b5f54]">Tip</span><span className="font-medium text-[#3f3328]">₹{form.tipAmount}</span></div>}
                </div>
                <button
                  onClick={handlePlaceOrder}
                  disabled={loading || !items.length}
                  className="w-full rounded-full bg-[#b97844] py-3 mt-6 text-white font-semibold hover:bg-[#9e6538] disabled:opacity-50 transition-all"
                >
                  {loading ? 'Placing Order...' : `Place Order • ₹${total}`}
                </button>
              </motion.div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between pt-2">
              {step > 0 && (
                <button onClick={handleBack} className="rounded-full border border-[#e8e0d6] px-5 py-2 text-sm text-[#6b5f54] hover:border-[#b97844] hover:text-[#b97844] transition-all">
                  Back
                </button>
              )}
              {step < 3 ? (
                <button onClick={handleNext} className="rounded-full bg-[#b97844] px-5 py-2 text-sm text-white hover:bg-[#9e6538] transition-all ml-auto">
                  Continue
                </button>
              ) : null}
            </div>
          </div>

          {/* Order Summary Sidebar */}
          <aside className="bg-white border border-[#e8e0d6] rounded-xl p-5 h-fit sticky top-24">
            <h2 className="font-semibold text-[#3f3328] mb-3">Order Summary</h2>
            <div className="space-y-2 max-h-48 overflow-y-auto mb-4">
              {items.slice(0, 5).map((item) => (
                <div key={item.key} className="flex justify-between text-sm">
                  <span className="text-[#6b5f54] truncate pr-2">{item.quantity}× {item.name}</span>
                  <span className="text-[#3f3328]">₹{item.basePrice * item.quantity}</span>
                </div>
              ))}
              {items.length > 5 && <p className="text-xs text-[#a0968c]">+{items.length - 5} more</p>}
            </div>
            <div className="space-y-2 text-sm border-t border-[#e8e0d6] pt-3">
              <div className="flex justify-between"><span className="text-[#6b5f54]">Subtotal</span><span>₹{subtotal}</span></div>
              <div className="flex justify-between"><span className="text-[#6b5f54]">GST</span><span>₹{tax}</span></div>
              {deliveryFee > 0 && <div className="flex justify-between"><span className="text-[#6b5f54]">Delivery</span><span>₹{deliveryFee}</span></div>}
              {form.tipAmount > 0 && <div className="flex justify-between"><span className="text-[#6b5f54]">Tip</span><span>₹{form.tipAmount}</span></div>}
              <div className="flex justify-between font-bold text-base pt-2 border-t border-[#e8e0d6]">
                <span className="text-[#3f3328]">Total</span>
                <span className="text-[#b97844]">₹{total}</span>
              </div>
            </div>
          </aside>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#e8e0d6] bg-white py-4 mt-8">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <p className="text-xs text-[#a0968c]">© {new Date().getFullYear()} Roller Coaster Cafe</p>
        </div>
      </footer>
    </div>
  );
}