import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Bell, Eye, LayoutGrid, Shield, Volume2, VolumeX } from 'lucide-react';

const STAFF_PREFS_KEY = 'staffQueuePrefs';
const DEFAULT_PREFS = {
  soundEnabled: true,
  showOnlyAssigned: false,
  compactView: false,
};

function readPrefs() {
  if (typeof window === 'undefined') return DEFAULT_PREFS;
  try {
    const raw = localStorage.getItem(STAFF_PREFS_KEY);
    return raw ? { ...DEFAULT_PREFS, ...JSON.parse(raw) } : DEFAULT_PREFS;
  } catch {
    return DEFAULT_PREFS;
  }
}

export default function StaffSettingsPage() {
  const [prefs, setPrefs] = useState(DEFAULT_PREFS);

  useEffect(() => {
    setPrefs(readPrefs());
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STAFF_PREFS_KEY, JSON.stringify(prefs));
  }, [prefs]);

  const toggle = (key) => {
    setPrefs((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const SettingRow = ({ icon: Icon, title, description, value, onToggle }) => (
    <div className="flex items-start justify-between py-5 border-b border-[#e8e0d6] last:border-0">
      <div className="flex items-start gap-4">
        <div className="w-10 h-10 rounded-full bg-[#faf8f5] flex items-center justify-center">
          <Icon size={18} className="text-[#b97844]" />
        </div>
        <div>
          <p className="font-medium text-[#3f3328]">{title}</p>
          <p className="text-sm text-[#6b5f54] mt-0.5">{description}</p>
        </div>
      </div>
      <button
        onClick={onToggle}
        className={`relative inline-flex h-6 w-11 rounded-full transition-colors ${value ? 'bg-[#b97844]' : 'bg-[#e8e0d6]'}`}
      >
        <span className={`absolute top-1 h-4 w-4 rounded-full bg-white transition-all ${value ? 'left-6' : 'left-1'}`} />
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#faf8f5]">
      {/* Header */}
      <header className="bg-white border-b border-[#e8e0d6] sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img src="https://rollercoastercafe.com/assets/images/roller_logo.png" alt="Logo" className="h-8 w-8 rounded-full object-cover" />
              <div>
                <h1 className="font-display font-bold text-xl text-[#3f3328]">Staff Settings</h1>
                <p className="text-xs text-[#6b5f54]">Customize your workspace</p>
              </div>
            </div>
            <Link to="/staff" className="text-sm text-[#b97844] hover:underline flex items-center gap-1">
              <ArrowLeft size={14} /> Back
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-8">
        <div className="bg-white border border-[#e8e0d6] rounded-2xl p-6">
          <div className="mb-6 pb-4 border-b border-[#e8e0d6]">
            <h2 className="font-semibold text-lg text-[#3f3328]">Notifications</h2>
            <p className="text-sm text-[#6b5f54]">Manage how you receive alerts</p>
          </div>

          <SettingRow
            icon={prefs.soundEnabled ? Volume2 : VolumeX}
            title="Order Sound Alerts"
            description="Play a soft alert when a new order arrives"
            value={prefs.soundEnabled}
            onToggle={() => toggle('soundEnabled')}
          />

          <SettingRow
            icon={Eye}
            title="Show Only My Orders"
            description="Filter the queue to show only orders assigned to you"
            value={prefs.showOnlyAssigned}
            onToggle={() => toggle('showOnlyAssigned')}
          />

          <SettingRow
            icon={LayoutGrid}
            title="Compact View"
            description="Show more orders at once during busy hours"
            value={prefs.compactView}
            onToggle={() => toggle('compactView')}
          />
        </div>

        <div className="mt-6 p-4 bg-amber-50 rounded-xl">
          <p className="text-sm text-amber-700">
            💡 These preferences are saved locally and apply only to this browser.
          </p>
        </div>
      </main>
    </div>
  );
}