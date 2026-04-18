import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Home,
  UtensilsCrossed,
  Clock3,
  UserRound,
  ShoppingBag,
  Settings2,
  Mail,
  Phone,
  Menu,
  X,
  Instagram,
  MapPin,
  BellRing,
  Tags,
  Heart,
} from 'lucide-react';
import { logoutUser } from '../../store/slices/authSlice';
import { useState } from 'react';

const MAIN_NAV = [
  { label: 'Home', to: '/dashboard', icon: Home },
  { label: 'Menu', to: '/menu', icon: UtensilsCrossed },
  { label: 'Orders', to: '/orders', icon: Clock3 },
];

// SINGLE CAFE CONTACT INFO - Consistent everywhere
const CAFE_CONTACT = {
  address: 'Under Nutan School, Juna Road, Opposite Navjeevan Hospital, Ahmedabad, Bareja, Gujarat 382425',
  phone: '+91-91067 34266',
  email: 'hello@rollercoastercafe.com',
  instagram: '@rollercoastercafe',
  hours: '10:00 AM - 11:00 PM',
};

const FOOTER_COLUMNS = [
  {
    title: 'Navigate',
    links: [
      { label: 'Home', to: '/dashboard' },
      { label: 'Menu', to: '/menu' },
      { label: 'Orders', to: '/orders' },
      { label: 'Profile', to: '/profile' },
    ],
  },
  {
    title: 'Account',
    links: [
      { label: 'Favourites', to: '/favourites' },
      { label: 'Addresses', to: '/addresses' },
      { label: 'Reviews', to: '/reviews' },
      { label: 'Offers', to: '/offers' },
      { label: 'Notifications', to: '/notifications' },
    ],
  },
];

export default function CustomerShell({
  title,
  subtitle,
  searchValue,
  onSearchChange,
  searchPlaceholder = 'Search...',
  cartCount = 0,
  onCartOpen,
  children,
}) {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const initials = (user?.name || 'RC')
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  const handleLogout = async () => {
    setShowLogoutConfirm(false);
    await dispatch(logoutUser());
    navigate('/login', { replace: true });
  };

  return (
    <div className="min-h-screen bg-[#f6efe7] text-[#2d2722]">
      <header className="sticky top-0 z-50 border-b border-[#dfd2c3] bg-[#faf4ec]/92 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4">
          <div className="grid lg:grid-cols-[1fr,auto,1fr] items-center gap-4">
            <div className="flex items-center gap-3 min-w-0">
              <Link to="/dashboard" className="shrink-0">
                <img
                  src="https://rollercoastercafe.com/assets/images/roller_logo.png"
                  alt="Roller Coaster Cafe"
                  className="h-11 w-11 rounded-full object-cover"
                />
              </Link>
              <div className="min-w-0">
                <p className="font-display text-xl sm:text-2xl font-bold truncate text-[#3f3328]">{title}</p>
                {subtitle ? <p className="text-xs sm:text-sm text-[#7a6f63] truncate">{subtitle}</p> : null}
              </div>
            </div>

            <nav className="hidden lg:flex items-center justify-center gap-8">
              {MAIN_NAV.map(({ label, to }) => {
                const active = location.pathname === to || location.pathname.startsWith(`${to}/`);
                return (
                  <NavLink
                    key={to}
                    to={to}
                    className={`text-sm font-semibold transition-colors ${active ? 'text-[#8e5b33]' : 'text-[#665c53] hover:text-[#8e5b33]'}`}
                  >
                    {label}
                  </NavLink>
                );
              })}
            </nav>

            <div className="flex items-center justify-end gap-2 sm:gap-3">
              <Link
                to="/settings"
                className="hidden sm:inline-flex h-11 w-11 items-center justify-center rounded-full border border-[#dfd2c3] bg-white/85 text-[#665c53] hover:border-[#8e5b33] hover:text-[#8e5b33] transition-colors"
              >
                <Settings2 size={18} />
              </Link>
              <Link
                to="/profile"
                className="hidden sm:inline-flex h-11 w-11 items-center justify-center rounded-full bg-[#4a392e] text-[#f8f1e8] hover:bg-[#8e5b33] transition-colors"
              >
                <span className="text-sm font-bold">{initials}</span>
              </Link>
              <button
                onClick={onCartOpen}
                className="relative inline-flex items-center gap-2 rounded-full bg-[#b97844] px-4 py-3 text-sm font-semibold text-white hover:brightness-105 transition-all"
              >
                <ShoppingBag size={16} />
                <span className="hidden sm:inline">Cart</span>
                {cartCount > 0 ? (
                  <span className="absolute -top-2 -right-1 min-w-5 h-5 px-1 rounded-full bg-[#4a392e] text-white text-[11px] flex items-center justify-center">
                    {cartCount}
                  </span>
                ) : null}
              </button>
              <button onClick={() => setMobileMenuOpen((prev) => !prev)} className="sm:hidden p-2 text-[#665c53]">
                {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
            </div>
          </div>

          {typeof searchValue === 'string' && onSearchChange ? (
            <div className="mt-4 max-w-2xl">
              <input
                value={searchValue}
                onChange={(event) => onSearchChange(event.target.value)}
                placeholder={searchPlaceholder}
                className="h-12 w-full rounded-full border border-[#dfd2c3] bg-white px-5 text-sm text-[#2d2722] outline-none transition-colors placeholder:text-[#a0968c] focus:border-[#8e5b33]"
              />
            </div>
          ) : null}

          {mobileMenuOpen ? (
            <div className="sm:hidden mt-4 rounded-[1.5rem] border border-[#e5dbcf] bg-[#fffaf4] p-4 space-y-3">
              {MAIN_NAV.map(({ label, to }) => (
                <NavLink key={to} to={to} onClick={() => setMobileMenuOpen(false)} className="block text-sm font-semibold text-[#665c53]">
                  {label}
                </NavLink>
              ))}
              <NavLink to="/offers" onClick={() => setMobileMenuOpen(false)} className="block text-sm font-semibold text-[#665c53]">Offers</NavLink>
              <NavLink to="/notifications" onClick={() => setMobileMenuOpen(false)} className="block text-sm font-semibold text-[#665c53]">Notifications</NavLink>
              <NavLink to="/profile" onClick={() => setMobileMenuOpen(false)} className="block text-sm font-semibold text-[#665c53]">Profile</NavLink>
              <NavLink to="/settings" onClick={() => setMobileMenuOpen(false)} className="block text-sm font-semibold text-[#665c53]">Settings</NavLink>
              <button onClick={() => setShowLogoutConfirm(true)} className="block text-sm font-semibold text-[#8e5b33]">Logout</button>
            </div>
          ) : null}
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-10 pb-28 md:pb-12">{children}</main>

      {/* FOOTER - SINGLE CAFE, CONSISTENT INFO */}
      <footer className="mt-16 border-t border-[#dfd2c3] bg-[#ecdfd0] text-[#2d2722] pb-24 md:pb-0">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-14">
          <div className="grid gap-10 lg:grid-cols-[1.2fr,0.8fr,0.8fr,1fr]">
            {/* Brand Column */}
            <div>
              <img
                src="https://rollercoastercafe.com/assets/images/roller_logo.png"
                alt="Roller Coaster Cafe"
                className="h-12 object-contain mb-4"
              />
              <h3 className="font-display text-2xl font-bold text-[#3f3328] leading-tight">
                A calmer cafe experience for everyday ordering.
              </h3>
              <p className="mt-4 text-[#74695e] text-sm leading-relaxed">
                Browse by real menu categories, save the dishes you love, and order delivery, dine-in, takeaway, or pre-order with ease.
              </p>
            </div>

            {/* Navigation Columns */}
            {FOOTER_COLUMNS.map((column) => (
              <div key={column.title}>
                <h3 className="font-display text-xl font-bold mb-4 text-[#3f3328]">{column.title}</h3>
                <div className="space-y-2 text-sm text-[#74695e]">
                  {column.links.map(({ label, to }) => (
                    <Link key={to} to={to} className="block hover:text-[#8e5b33] transition-colors">
                      {label}
                    </Link>
                  ))}
                </div>
              </div>
            ))}

            {/* Contact Column - SINGLE CAFE INFO */}
            <div>
              <h3 className="font-display text-xl font-bold mb-4 text-[#3f3328]">Contact</h3>
              <div className="space-y-3 text-sm text-[#74695e]">
                <div className="flex items-start gap-3">
                  <Clock3 size={15} className="mt-0.5 shrink-0 text-[#8e5b33]" />
                  <span>{CAFE_CONTACT.hours}</span>
                </div>
                <div className="flex items-start gap-3">
                  <Mail size={15} className="mt-0.5 shrink-0 text-[#8e5b33]" />
                  <a href={`mailto:${CAFE_CONTACT.email}`} className="hover:text-[#8e5b33] transition-colors">
                    {CAFE_CONTACT.email}
                  </a>
                </div>
                <div className="flex items-start gap-3">
                  <Phone size={15} className="mt-0.5 shrink-0 text-[#8e5b33]" />
                  <a href={`tel:${CAFE_CONTACT.phone}`} className="hover:text-[#8e5b33] transition-colors">
                    {CAFE_CONTACT.phone}
                  </a>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin size={15} className="mt-0.5 shrink-0 text-[#8e5b33]" />
                  <span className="leading-relaxed">{CAFE_CONTACT.address}</span>
                </div>
                <div className="flex items-start gap-3">
                  <Instagram size={15} className="mt-0.5 shrink-0 text-[#8e5b33]" />
                  <a href={`https://instagram.com/${CAFE_CONTACT.instagram.replace('@', '')}`} target="_blank" rel="noopener noreferrer" className="hover:text-[#8e5b33] transition-colors">
                    {CAFE_CONTACT.instagram}
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Copyright Bar */}
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-[#dfd2c3] pt-6 text-xs text-[#8d8378]">
            <p>© {new Date().getFullYear()} Roller Coaster Cafe. All rights reserved.</p>
            <div className="flex items-center gap-5">
              <Link to="/menu" className="hover:text-[#8e5b33] transition-colors">Menu</Link>
              <Link to="/orders" className="hover:text-[#8e5b33] transition-colors">Orders</Link>
              <Link to="/offers" className="hover:text-[#8e5b33] transition-colors">Offers</Link>
              <Link to="/privacy" className="hover:text-[#8e5b33] transition-colors">Privacy</Link>
            </div>
          </div>
        </div>
      </footer>

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 z-40 border-t border-[#dfd2c3] bg-[#faf4ec]/95 backdrop-blur-xl overflow-x-auto">
        <div className="flex items-center gap-1 px-2 py-2 min-w-max">
          {[...MAIN_NAV, { label: 'Offers', to: '/offers', icon: Tags }, { label: 'Alerts', to: '/notifications', icon: BellRing }, { label: 'Profile', to: '/profile', icon: UserRound }].map(({ label, to, icon: Icon }) => {
            const active = location.pathname === to || location.pathname.startsWith(`${to}/`);
            return (
              <NavLink
                key={to}
                to={to}
                className={`flex min-w-[78px] flex-col items-center justify-center gap-1 rounded-2xl px-3 py-2 text-[11px] font-semibold transition-colors ${active ? 'bg-[#8e5b33] text-white' : 'text-[#74695e] hover:bg-white hover:text-[#8e5b33]'}`}
              >
                <Icon size={18} />
                <span>{label}</span>
              </NavLink>
            );
          })}
        </div>
      </nav>

      {showLogoutConfirm ? (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4" onClick={() => setShowLogoutConfirm(false)}>
          <div className="w-full max-w-md rounded-[1.5rem] bg-white p-6 shadow-2xl" onClick={(event) => event.stopPropagation()}>
            <h2 className="text-lg font-bold text-[#3f3328]">Confirm Logout</h2>
            <p className="mt-2 text-sm text-[#74695e]">You will need to sign in again to open your customer panel.</p>
            <div className="mt-6 flex gap-3">
              <button onClick={() => setShowLogoutConfirm(false)} className="flex-1 rounded-full border border-[#dfd2c3] px-4 py-2 text-sm font-semibold text-[#665c53] hover:bg-[#faf4ec]">Cancel</button>
              <button onClick={handleLogout} className="flex-1 rounded-full bg-[#b97844] px-4 py-2 text-sm font-semibold text-white hover:brightness-105">Logout</button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
