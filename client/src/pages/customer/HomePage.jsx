import { useMemo, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useDispatch, useSelector } from 'react-redux';
import { 
  ArrowRight, Heart, MapPin, ShoppingBag, Star, Wallet, 
  Clock3, Coffee, Pizza, UtensilsCrossed, ChefHat, Phone, 
  Mail, Truck, Home as HomeIcon, Users, Clock, User, Settings,
  Navigation, LogOut, LogIn
} from 'lucide-react';
import { selectCartCount } from '../../store/slices/cartSlice';
import { logoutUser } from '../../store/slices/authSlice';
import CartDrawer from '../../components/customer/CartDrawer';
import api from '../../services/api';
import { clearOrderPreferences, saveOrderPreferences } from '../../utils/orderPreferences';
import toast from 'react-hot-toast';

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1200&q=80';

// Ordering Features
const ORDERING_FEATURES = [
  { 
    icon: Truck, 
    title: 'Delivery', 
    desc: 'Get it delivered to your door',
    mode: 'delivery',
    color: 'bg-blue-50',
    iconColor: 'text-blue-600'
  },
  { 
    icon: HomeIcon, 
    title: 'Takeaway', 
    desc: 'Pick up from our cafe',
    mode: 'takeaway',
    color: 'bg-emerald-50',
    iconColor: 'text-emerald-600'
  },
  { 
    icon: Users, 
    title: 'Dine-In', 
    desc: 'Enjoy at our cafe',
    mode: 'dine-in',
    color: 'bg-amber-50',
    iconColor: 'text-amber-600'
  },
  { 
    icon: Clock, 
    title: 'Pre-Order', 
    desc: 'Schedule for later',
    mode: 'pre-order',
    color: 'bg-purple-50',
    iconColor: 'text-purple-600'
  },
];

export default function HomePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const cartCount = useSelector(selectCartCount);
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const [cartOpen, setCartOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const { data: menuItems = [] } = useQuery({
    queryKey: ['customer-home-menu'],
    queryFn: () => api.get('/menu').then((res) => res.data),
  });

  const featuredFromApi = useMemo(
    () => menuItems.filter((item) => item.isAvailable && !item.isArchived).slice(0, 4),
    [menuItems]
  );

  const handleViewMenuClick = () => {
    clearOrderPreferences();
    navigate('/menu?showSelector=1', {
      state: { from: `${location.pathname}${location.search}` },
    });
  };

  
  const handleOrderTypeClick = (mode) => {
  clearOrderPreferences();
  
  // Dine-In: Go directly to dine-in booking page
  if (mode === 'dine-in') {
    navigate('/dine-in', {
      state: { from: `${location.pathname}${location.search}` },
    });
    return;
  }
  
  // Pre-Order: Go directly to pre-order schedule page
  if (mode === 'pre-order') {
    navigate('/pre-order/schedule', {
      state: { from: `${location.pathname}${location.search}` },
    });
    return;
  }
  
  // Delivery & Takeaway: Go directly to menu with the method
  saveOrderPreferences({
    deliveryMethod: mode,
    isPreOrder: false,
    isDineIn: false,
    preOrderMethod: '',
    scheduledDateTime: '',
    timestamp: new Date().toISOString(),
  });
  navigate(`/menu?mode=${mode}`, {
    state: { from: `${location.pathname}${location.search}` },
  });
};

  const handleLogout = async () => {
    await dispatch(logoutUser());
    setShowLogoutConfirm(false);
    navigate('/');
    toast.success('Logged out successfully');
  };

  return (
    <div className="min-h-screen bg-white font-body">
      {/* Header */}
      <header className="border-b border-[#e8e0d6] bg-white sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2">
              <img 
                src="https://rollercoastercafe.com/assets/images/roller_logo.png" 
                alt="Roller Coaster Cafe"
                className="h-10 w-10 rounded-full object-cover"
              />
              <span className="font-display font-bold text-xl text-[#3f3328]">Roller Coaster Cafe</span>
            </Link>

            <nav className="hidden md:flex items-center gap-8">
              <Link to="/" className="text-sm font-medium text-[#6b5f54] hover:text-[#b97844] transition-colors">Home</Link>
              <Link to="/menu" className="text-sm font-medium text-[#6b5f54] hover:text-[#b97844] transition-colors">Menu</Link>
              <Link to="/orders" className="text-sm font-medium text-[#6b5f54] hover:text-[#b97844] transition-colors">Orders</Link>
              <Link to="/profile" className="text-sm font-medium text-[#6b5f54] hover:text-[#b97844] transition-colors">Profile</Link>
              <Link to="/settings" className="text-sm font-medium text-[#6b5f54] hover:text-[#b97844] transition-colors">Settings</Link>
            </nav>

            <div className="flex items-center gap-3">
              {isAuthenticated ? (
                <>
                  <Link 
                    to="/profile"
                    className="hidden md:flex items-center gap-2 rounded-full border border-[#e8e0d6] px-3 py-2 text-sm font-medium text-[#6b5f54] hover:border-[#b97844] hover:text-[#b97844] transition-all"
                  >
                    <User size={16} />
                    <span>{user?.name?.split(' ')[0] || 'Account'}</span>
                  </Link>
                  <button
                    onClick={() => setShowLogoutConfirm(true)}
                    className="hidden md:flex items-center gap-2 rounded-full border border-red-200 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 transition-all"
                  >
                    <LogOut size={16} />
                    <span>Logout</span>
                  </button>
                </>
              ) : (
                <Link 
                  to="/login"
                  className="hidden md:flex items-center gap-2 rounded-full bg-[#b97844] px-4 py-2 text-sm font-medium text-white hover:bg-[#9e6538] transition-all"
                >
                  <LogIn size={16} />
                  <span>Sign In</span>
                </Link>
              )}
              
              <button
                onClick={() => setCartOpen(true)}
                className="relative inline-flex items-center gap-2 rounded-full bg-[#b97844] px-4 py-2 text-sm font-semibold text-white hover:bg-[#9e6538] transition-all"
              >
                <ShoppingBag size={16} />
                <span>Cart</span>
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 min-w-5 h-5 px-1 rounded-full bg-[#3f3328] text-white text-xs flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section className="relative min-h-[550px] flex items-center">
          <div className="absolute inset-0">
            <img 
              src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=1600&q=80"
              alt="Roller Coaster Cafe"
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/40" />
          </div>
          
          <div className="relative z-10 max-w-7xl mx-auto px-6 py-20">
            <div className="max-w-2xl">
              <h1 className="font-display text-5xl font-bold text-white sm:text-6xl lg:text-7xl">
                Roller Coaster
                <span className="text-[#b97844] block">Cafe</span>
              </h1>
              <p className="mt-5 text-base text-white/85 leading-relaxed sm:text-lg">
                A symphony of flavors in a warm and welcoming ambiance. Experience exquisite dishes 
                crafted with love, served with genuine hospitality.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <button
                  onClick={handleViewMenuClick}
                  className="inline-flex items-center gap-2 rounded-full bg-[#b97844] px-7 py-3 text-sm font-semibold text-white shadow-lg transition-all hover:bg-[#9e6538]"
                >
                  View Menu
                  <ArrowRight size={16} />
                </button>
                <Link
                  to="/offers"
                  className="inline-flex items-center gap-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/30 px-7 py-3 text-sm font-semibold text-white transition-all hover:bg-white/20"
                >
                  View Offers
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Ordering Features */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-10">
              <h2 className="font-display text-3xl font-bold text-[#3f3328]">Order The Way You Want</h2>
              <p className="mt-2 text-[#6b5f54]">Choose what works best for you</p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {ORDERING_FEATURES.map((feature) => (
                <div
                  key={feature.title}
                  onClick={() => handleOrderTypeClick(feature.mode)}
                  className="group text-center p-6 rounded-2xl bg-white border border-[#e8e0d6] transition-all hover:shadow-lg hover:-translate-y-1 cursor-pointer"
                >
                  <div className={`inline-flex h-14 w-14 items-center justify-center rounded-full ${feature.color} ${feature.iconColor} mx-auto mb-4 group-hover:scale-110 transition-transform`}>
                    <feature.icon size={24} />
                  </div>
                  <h3 className="font-semibold text-lg text-[#3f3328]">{feature.title}</h3>
                  <p className="mt-2 text-sm text-[#6b5f54]">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Rest of your sections remain the same... */}
        <section className="py-20 bg-[#faf8f5]">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <span className="inline-block rounded-full bg-[#b97844]/10 px-4 py-1.5 text-xs font-semibold text-[#b97844] tracking-wide mb-4">
                  Our Story
                </span>
                <h2 className="font-display text-3xl font-bold text-[#3f3328] sm:text-4xl">
                  A Culinary Journey Through Flavors
                </h2>
                <p className="mt-4 text-[#6b5f54] leading-relaxed">
                  Roller Coaster Cafe brings together the timeless comfort of fast food with innovative 
                  global influences. Our menu is a celebration of diverse culinary traditions, from 
                  authentic pizzas and juicy burgers to refreshing mocktails and fusion delicacies.
                </p>
                <p className="mt-4 text-[#6b5f54] leading-relaxed">
                  Named after the thrill of a roller coaster ride, our cafe embodies the spirit of 
                  exploration and the joy of good food. Each dish is crafted with passion, using the 
                  finest ingredients and traditional techniques reimagined for the modern palate.
                </p>
                <p className="mt-4 text-[#6b5f54] leading-relaxed">
                  Step into our beautifully designed space, where every detail invites you to linger 
                  over exceptional food and warm hospitality.
                </p>
              </div>
              <div className="rounded-2xl overflow-hidden shadow-xl h-[400px] md:h-[500px] w-full">
                <img
                  src="https://rollercoastercafe.com/assets/images/about.png"
                  alt="Cafe interior"
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="font-display text-3xl font-bold text-[#3f3328] sm:text-4xl">Taste the Extraordinary</h2>
              <p className="mt-3 text-[#6b5f54]">Our signature creations crafted with passion</p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {featuredFromApi.map((item) => (
                <Link
                  key={item._id}
                  to={`/menu/item/${item._id}`}
                  className="group"
                >
                  <div className="rounded-2xl overflow-hidden bg-[#faf8f5] transition-all group-hover:shadow-lg">
                    <div className="aspect-[4/3] overflow-hidden">
                      <img
                        src={item.image || FALLBACK_IMAGE}
                        alt={item.name}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        onError={(e) => { e.target.src = FALLBACK_IMAGE; }}
                      />
                    </div>
                    <div className="p-5">
                      <h3 className="font-display font-bold text-lg text-[#3f3328] group-hover:text-[#b97844] transition-colors">
                        {item.name}
                      </h3>
                      <p className="mt-2 text-sm text-[#6b5f54] line-clamp-2">
                        {item.description}
                      </p>
                      <div className="mt-3">
                        <span className="font-bold text-[#b97844]">₹{item.basePrice}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            <div className="text-center mt-10">
              <button
                onClick={handleViewMenuClick}
                className="inline-flex items-center gap-2 rounded-full border-2 border-[#b97844] px-8 py-3 text-sm font-semibold text-[#b97844] hover:bg-[#b97844] hover:text-white transition-all"
              >
                View Full Menu
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </section>

        <section className="py-20 bg-[#faf8f5]">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="font-display text-3xl font-bold text-[#3f3328] sm:text-4xl">Visit Us</h2>
              <p className="mt-3 text-[#6b5f54]">Come experience the warmth and flavors</p>
            </div>

            <div className="grid lg:grid-cols-2 gap-10">
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold text-lg text-[#3f3328] mb-2">Location</h3>
                  <p className="text-[#6b5f54]">under nutan school, juna road, opposite by navjeevan hospital, Ahmedabad, Bareja, Gujarat 382425</p>
                </div>
                <div>
                  <h3 className="font-semibold text-lg text-[#3f3328] mb-2">Phone</h3>
                  <p className="text-[#6b5f54]">+91-91067 34266</p>
                </div>
                <div>
                  <h3 className="font-semibold text-lg text-[#3f3328] mb-2">Email</h3>
                  <p className="text-[#6b5f54]">rollercoastercafe123@gmail.com</p>
                </div>
                <div>
                  <h3 className="font-semibold text-lg text-[#3f3328] mb-2">Hours</h3>
                  <p className="text-[#6b5f54]">Monday - Sunday: 10:00 AM - 11:00 PM</p>
                </div>
                <a
                  href="https://maps.google.com/?q=ROLLER+COASTER+CAFE+Bareja"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full bg-[#b97844] px-6 py-3 text-sm font-semibold text-white hover:bg-[#9e6538] transition-all"
                >
                  Get Directions
                  <ArrowRight size={14} />
                </a>
              </div>
              <div className="rounded-2xl overflow-hidden shadow-lg h-[400px]">
                <iframe 
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3676.5753617378755!2d72.58680427959783!3d22.85519482589579!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x395e8d0f08e140bb%3A0x6ac64e07236fb22!2sROLLER%20COASTER%20CAFE!5e0!3m2!1sen!2sin!4v1775651222427!5m2!1sen!2sin" 
                  className="w-full h-full border-0"
                  allowFullScreen 
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Roller Coaster Cafe Location"
                />
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-[#3f3328] text-white/60 py-8">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="flex flex-wrap items-center justify-center gap-6 mb-4">
            <Link to="/" className="text-sm hover:text-white transition-colors">Home</Link>
            <Link to="/menu" className="text-sm hover:text-white transition-colors">Menu</Link>
            <Link to="/orders" className="text-sm hover:text-white transition-colors">Orders</Link>
            <Link to="/profile" className="text-sm hover:text-white transition-colors">Profile</Link>
            <Link to="/settings" className="text-sm hover:text-white transition-colors">Settings</Link>
          </div>
          <p className="text-sm">© {new Date().getFullYear()} Roller Coaster Cafe. All rights reserved.</p>
        </div>
      </footer>

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-2">Confirm Logout</h3>
            <p className="text-gray-600 mb-6">Are you sure you want to logout?</p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="flex-1 rounded-lg border border-gray-200 py-2 text-gray-600 hover:bg-gray-50 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                className="flex-1 rounded-lg bg-red-600 py-2 text-white hover:bg-red-700 transition-all"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}

      <CartDrawer isOpen={cartOpen} onClose={() => setCartOpen(false)} />
    </div>
  );
}
