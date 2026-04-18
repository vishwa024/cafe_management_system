import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Plus, Trash2, Home, Briefcase, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { useSelector } from 'react-redux';
import CustomerFooter from '../../components/customer/CustomerFooter';

function AddressIcon({ type }) {
  if (type === 'work') return <Briefcase size={14} />;
  return <Home size={14} />;
}

function getSavedAddresses(storageKey) {
  try {
    const raw = localStorage.getItem(storageKey);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];

    const legacySamples = new Set([
      'GF-08, West Gate Elight, Undera-Koyali Road, Vadodara',
      'Billionaire Street, Bodakdev, Ahmedabad',
    ]);

    return parsed.filter((item) => item?.address && !legacySamples.has(item.address));
  } catch {
    return [];
  }
}

function normalizeAddresses(addresses) {
  if (!Array.isArray(addresses)) return [];

  const seen = new Set();
  const cleaned = addresses
    .filter((item) => item?.id && item?.label && item?.address)
    .filter((item) => {
      if (seen.has(item.id)) return false;
      seen.add(item.id);
      return true;
    })
    .map((item) => ({
      ...item,
      isDefault: Boolean(item.isDefault),
    }));

  if (cleaned.length > 0 && !cleaned.some((item) => item.isDefault)) {
    cleaned[0] = { ...cleaned[0], isDefault: true };
  }

  let foundDefault = false;
  return cleaned.map((item) => {
    if (!item.isDefault) return item;
    if (!foundDefault) {
      foundDefault = true;
      return item;
    }
    return { ...item, isDefault: false };
  });
}

export default function SavedAddressesPage() {
  const user = useSelector((state) => state.auth.user);
  const storageKey = useMemo(() => `customer-saved-addresses-${user?._id || user?.email || 'guest'}`, [user]);
  const [addresses, setAddresses] = useState(() => getSavedAddresses(storageKey));
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    label: '',
    address: '',
    icon: 'home',
    saveAsDefault: addresses.length === 0,
  });

  useEffect(() => {
    const nextAddresses = normalizeAddresses(getSavedAddresses(storageKey));
    setAddresses(nextAddresses);
    localStorage.setItem(storageKey, JSON.stringify(nextAddresses));
  }, [storageKey]);

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(addresses));
  }, [addresses, storageKey]);

  const addAddress = () => {
    if (!form.label.trim() || !form.address.trim()) {
      toast.error('Please enter label and full address');
      return;
    }

    const newAddress = {
      id: Date.now(),
      label: form.label.trim(),
      address: form.address.trim(),
      icon: form.icon,
      isDefault: form.saveAsDefault || addresses.length === 0,
    };

    setAddresses((prev) => {
      const next = form.saveAsDefault
        ? prev.map((item) => ({ ...item, isDefault: false }))
        : [...prev];
      return [...next, newAddress];
    });

    setForm({ label: '', address: '', icon: 'home', saveAsDefault: false });
    setShowForm(false);
    toast.success('Address added');
  };

  const removeAddress = (id) => {
    setAddresses((prev) => {
      const next = prev.filter((item) => item.id !== id);
      if (next.length > 0 && !next.some((item) => item.isDefault)) {
        next[0] = { ...next[0], isDefault: true };
      }
      return [...next];
    });
    toast.success('Address removed');
  };

  const makeDefault = (id) => {
    setAddresses((prev) =>
      prev.map((item) => ({ ...item, isDefault: item.id === id }))
    );
    toast.success('Default address updated');
  };

  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-gray-100 bg-white sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <Link to="/dashboard" className="flex items-center gap-2">
              <img
                src="https://rollercoastercafe.com/assets/images/roller_logo.png"
                alt="Logo"
                className="h-8 w-8 rounded-full object-cover"
              />
              <span className="font-semibold text-lg text-gray-800">Roller Coaster Cafe</span>
            </Link>

            <nav className="hidden md:flex items-center gap-6">
              <Link to="/dashboard" className="text-sm text-gray-500 hover:text-amber-600">Home</Link>
              <Link to="/menu" className="text-sm text-gray-500 hover:text-amber-600">Menu</Link>
              <Link to="/orders" className="text-sm text-gray-500 hover:text-amber-600">Orders</Link>
              <Link to="/profile" className="text-sm text-gray-500 hover:text-amber-600">Profile</Link>
              <Link to="/settings" className="text-sm text-gray-500 hover:text-amber-600">Settings</Link>
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Saved Addresses</h1>
            <p className="text-sm text-gray-400 mt-1">Manage your delivery and pre-order locations</p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="inline-flex items-center gap-1.5 rounded-full bg-amber-600 px-4 py-2 text-sm font-medium text-white hover:bg-amber-700"
          >
            <Plus size={14} />
            Add New
          </button>
        </div>

        {showForm && (
          <div className="bg-gray-50 rounded-xl p-5 mb-6">
            <h3 className="font-medium text-gray-800 mb-3">New Address</h3>
            <div className="space-y-3">
              <input
                value={form.label}
                onChange={(e) => setForm((prev) => ({ ...prev, label: e.target.value }))}
                placeholder="Label (Home, Work, etc.)"
                className="w-full rounded-lg border border-gray-200 bg-white p-2 text-sm focus:border-amber-500 focus:outline-none"
              />
              <textarea
                value={form.address}
                onChange={(e) => setForm((prev) => ({ ...prev, address: e.target.value }))}
                placeholder="Full address"
                rows={3}
                className="w-full rounded-lg border border-gray-200 bg-white p-2 text-sm focus:border-amber-500 focus:outline-none resize-none"
              />
              <div className="flex gap-2">
                {['home', 'work'].map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setForm((prev) => ({ ...prev, icon: type }))}
                    className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                      form.icon === type ? 'bg-amber-600 text-white' : 'bg-gray-200 text-gray-600'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
              <label className="flex items-center gap-2 text-sm text-gray-600">
                <input
                  type="checkbox"
                  checked={form.saveAsDefault}
                  onChange={(e) => setForm((prev) => ({ ...prev, saveAsDefault: e.target.checked }))}
                  className="rounded border-gray-300 text-amber-600 focus:ring-amber-500"
                />
                Save as default address
              </label>
              <div className="flex gap-2 pt-2">
                <button type="button" onClick={addAddress} className="rounded-lg bg-amber-600 px-4 py-1.5 text-sm text-white">Save</button>
                <button type="button" onClick={() => setShowForm(false)} className="rounded-lg border border-gray-200 px-4 py-1.5 text-sm">Cancel</button>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-3">
          {addresses.length === 0 ? (
            <div className="rounded-xl border border-dashed border-gray-200 p-8 text-center text-sm text-gray-400">
              No saved addresses yet. Add your first address and mark it default if you want to use it faster at checkout.
            </div>
          ) : addresses.map((item) => (
            <div key={item.id} className="bg-white border border-gray-100 rounded-xl p-4 hover:shadow-md transition-all">
              <div className="flex items-start justify-between">
                <div className="flex gap-3">
                  <div className="w-9 h-9 rounded-full bg-amber-50 flex items-center justify-center">
                    <AddressIcon type={item.icon} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-medium text-gray-800">{item.label}</p>
                      {item.isDefault && (
                        <span className="text-xs text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full inline-flex items-center gap-1">
                          <CheckCircle size={12} /> Default
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-500 mt-1">{item.address}</p>
                  </div>
                </div>
                <div className="flex gap-2 items-center">
                  {!item.isDefault && (
                    <button type="button" onClick={() => makeDefault(item.id)} className="text-xs text-amber-600 hover:underline px-2">
                      Set Default
                    </button>
                  )}
                  <button type="button" onClick={() => removeAddress(item.id)} className="text-red-500 p-1">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      <CustomerFooter />
    </div>
  );
}


