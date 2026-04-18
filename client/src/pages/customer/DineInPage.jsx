import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { QrCode, Users, Clock, Coffee, Wifi, Music, Phone, Mail, MapPin, UtensilsCrossed, Copy, Check, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { saveOrderPreferences, getOrderPreferences } from '../../utils/orderPreferences';
import api from '../../services/api';

const AVAILABLE_TABLES = [
  { number: '1', capacity: 2, isAvailable: true },
  { number: '2', capacity: 4, isAvailable: true },
  { number: '3', capacity: 2, isAvailable: true },
  { number: '4', capacity: 6, isAvailable: false },
  { number: '5', capacity: 4, isAvailable: true },
  { number: '6', capacity: 8, isAvailable: true },
  { number: '7', capacity: 2, isAvailable: false },
  { number: '8', capacity: 4, isAvailable: true },
];

export default function DineInPage() {
  const existingPrefs = getOrderPreferences() || {};
  
  const [guestCount, setGuestCount] = useState(existingPrefs.guestCount || 2);
  const [tableNumber, setTableNumber] = useState(existingPrefs.tableNumber || '');
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [copied, setCopied] = useState(false);
  const [tableStatuses, setTableStatuses] = useState(AVAILABLE_TABLES);

  useEffect(() => {
    let isMounted = true;

    const loadTables = async () => {
      try {
        const { data } = await api.get('/tables/statuses');
        if (!isMounted) return;
        setTableStatuses(Array.isArray(data.tables) && data.tables.length ? data.tables : AVAILABLE_TABLES);
      } catch (error) {
        if (isMounted) {
          setTableStatuses(AVAILABLE_TABLES);
        }
      }
    };

    loadTables();
    const interval = setInterval(loadTables, 10000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  // Filter available tables based on guest count
  const availableTables = tableStatuses.filter(table => 
    table.isAvailable && table.capacity >= guestCount
  );
  const bookedTables = tableStatuses.filter((table) => !table.isAvailable);

  const handleConfirmTable = async () => {
    if (!tableNumber) {
      toast.error('Please select a table number');
      return;
    }
    if (!acceptedTerms) {
      setShowTermsModal(true);
      return;
    }
    
    try {
      const { data } = await api.post(`/tables/${tableNumber}/book`, {
        customerName: existingPrefs.customerName || 'Customer',
        customerPhone: existingPrefs.customerPhone || '',
        guestCount,
      });
      setTableStatuses(Array.isArray(data.tables) && data.tables.length ? data.tables : AVAILABLE_TABLES);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to reserve the table');
      return;
    }

    saveOrderPreferences({
      ...existingPrefs,
      deliveryMethod: 'dine-in',
      isDineIn: true,
      tableNumber,
      guestCount,
      timestamp: new Date().toISOString()
    });

    toast.success(`Table ${tableNumber} booked for ${guestCount} guests!`);
  };

  const copyTableInfo = () => {
    const info = `Table ${tableNumber} • ${guestCount} Guests • Roller Coaster Cafe`;
    navigator.clipboard.writeText(info);
    setCopied(true);
    toast.success('Table info copied');
    setTimeout(() => setCopied(false), 2000);
  };

  const TermsModal = () => (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl w-full max-w-md max-h-[85vh] overflow-hidden">
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <h3 className="font-semibold text-lg text-gray-800">Dine-In Terms & Conditions</h3>
          <button onClick={() => setShowTermsModal(false)} className="p-1 hover:bg-gray-100 rounded-full">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="p-5 space-y-4 text-sm text-gray-600 overflow-y-auto">
          <div className="bg-amber-50 p-3 rounded-lg">
            <p className="font-medium text-amber-800">📋 Table Reservation Policy</p>
            <p className="text-xs text-amber-700 mt-1">Tables are held for 15 minutes from the reservation time.</p>
          </div>
          <p><strong>1. Reservation Time:</strong> Your table will be held for 15 minutes from the selected time. Late arrival may result in table reassignment.</p>
          <p><strong>2. Guest Count:</strong> Please ensure your guest count is accurate. Large changes may require table adjustment.</p>
          <p><strong>3. Minimum Order:</strong> A minimum order of ₹200 per person is required for dine-in.</p>
          <p><strong>4. Service Charge:</strong> 10% service charge applies for groups of 6 or more.</p>
          <p><strong>5. Cancellation:</strong> Free cancellation up to 1 hour before reservation time.</p>
          <p><strong>6. Special Requests:</strong> Dietary restrictions or special occasions can be noted in the special instructions.</p>
          <p><strong>7. Contact:</strong> For any issues, call us at +91-91067 34266</p>
        </div>
        <div className="p-5 border-t border-gray-100">
          <button
            onClick={() => {
              setAcceptedTerms(true);
              setShowTermsModal(false);
              toast.success('Terms accepted!');
            }}
            className="w-full rounded-full bg-amber-600 py-3 text-white font-semibold hover:bg-amber-700"
          >
            I Accept the Terms
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-gray-100 bg-white sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <Link to="/dashboard" className="flex items-center gap-2">
              <img 
                src="https://rollercoastercafe.com/assets/images/roller_logo.png" 
                alt="Logo"
                className="h-8 w-8 rounded-full object-cover"
              />
              <span className="font-semibold text-lg text-gray-800">Roller Coaster Cafe</span>
            </Link>
            <Link to="/dashboard" className="text-sm text-gray-500 hover:text-amber-600">
              Back to Home
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-800">Welcome to Roller Coaster Cafe</h1>
          <p className="text-gray-500 mt-2">Reserve your table first and see live availability updated from the staff panel.</p>
        </div>

        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-lg">
          <div className="text-center mb-6">
            <div className="w-16 h-16 mx-auto bg-amber-100 rounded-full flex items-center justify-center mb-3">
              <Users size={28} className="text-amber-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-800">Table Reservation</h2>
            <p className="text-sm text-gray-500 mt-1">Select your table and confirm your booking without entering the menu flow.</p>
          </div>

          <div className="space-y-5">
            {/* Guest Count */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Number of Guests</label>
              <select
                value={guestCount}
                onChange={(e) => {
                  setGuestCount(parseInt(e.target.value));
                  setTableNumber(''); // Reset table selection when guest count changes
                }}
                className="w-full rounded-lg border border-gray-200 px-4 py-3 focus:border-amber-500 focus:outline-none"
              >
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                  <option key={num} value={num}>{num} {num === 1 ? 'Guest' : 'Guests'}</option>
                ))}
              </select>
            </div>

            {/* Available Tables */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Available Tables {availableTables.length > 0 ? `(${availableTables.length} available)` : '(No tables available)'}
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {availableTables.map((table) => (
                  <button
                    key={table.number}
                    onClick={() => setTableNumber(table.number)}
                    className={`p-3 rounded-xl border-2 text-center transition-all ${
                      tableNumber === table.number
                        ? 'border-amber-500 bg-amber-50'
                        : 'border-gray-200 hover:border-amber-300'
                    }`}
                  >
                    <div className="font-semibold text-gray-800">Table {table.number}</div>
                    <div className="text-xs text-gray-500">Up to {table.capacity} guests</div>
                  </button>
                ))}
              </div>
              {availableTables.length === 0 && (
                <div className="mt-3 p-3 bg-red-50 rounded-lg text-sm text-red-600 flex items-center gap-2">
                  <AlertCircle size={16} />
                  No tables available for {guestCount} guests. Please try fewer guests or contact us directly.
                </div>
              )}
            </div>

            <div className="rounded-xl border border-gray-100 bg-[#faf8f5] p-4">
              <div className="flex items-center justify-between gap-3 mb-3">
                <div>
                  <p className="text-sm font-semibold text-gray-800">Current table status</p>
                  <p className="text-xs text-gray-500">Staff can manage these live from the staff dashboard.</p>
                </div>
                <span className="rounded-full bg-white px-3 py-1 text-xs font-medium text-gray-600 border border-gray-200">
                  {availableTables.length} open / {bookedTables.length} booked
                </span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {tableStatuses.map((table) => (
                  <div
                    key={`status-${table.number}`}
                    className={`rounded-lg border px-3 py-3 text-sm ${
                      table.isAvailable
                        ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                        : 'border-rose-200 bg-rose-50 text-rose-700'
                    }`}
                  >
                    <p className="font-semibold">Table {table.number}</p>
                    <p className="text-xs mt-1">
                      {table.isAvailable ? 'Available now' : `Booked${table.bookedGuests ? ` • ${table.bookedGuests} guests` : ''}`}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Terms Acceptance */}
            <div className="flex items-center gap-3 pt-2">
              <input
                type="checkbox"
                id="acceptTerms"
                checked={acceptedTerms}
                onChange={(e) => setAcceptedTerms(e.target.checked)}
                className="w-4 h-4 rounded border-gray-300 text-amber-600 focus:ring-amber-500"
              />
              <label htmlFor="acceptTerms" className="text-sm text-gray-600">
                I agree to the <button onClick={() => setShowTermsModal(true)} className="text-amber-600 hover:underline">dine-in terms and conditions</button>
              </label>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <button
                onClick={handleConfirmTable}
                disabled={!tableNumber || !acceptedTerms || availableTables.length === 0}
                className="flex-1 rounded-full bg-amber-600 py-3 text-white font-semibold hover:bg-amber-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Confirm Table Booking
              </button>
            </div>

            {/* Table Info After Selection */}
            {tableNumber && acceptedTerms && (
              <div className="mt-4 p-4 bg-green-50 rounded-xl border border-green-200">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div>
                    <p className="text-sm font-medium text-green-800">Table {tableNumber} booked for {guestCount} guests.</p>
                    <p className="text-xs text-green-600 mt-1">Please arrive within 15 minutes of your booking window. Staff will hold this table for you.</p>
                  </div>
                  <button
                    onClick={copyTableInfo}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white text-green-600 text-sm hover:bg-green-100 transition-all"
                  >
                    {copied ? <Check size={14} /> : <Copy size={14} />}
                    {copied ? 'Copied!' : 'Copy Info'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Cafe Info */}
        <div className="mt-6 p-4 bg-gray-50 rounded-xl">
          <h3 className="font-semibold text-gray-800 mb-3">Dine-In Information</h3>
          <div className="space-y-2 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <Coffee size={14} className="text-amber-600" /> Complimentary water service
            </div>
            <div className="flex items-center gap-2">
              <Wifi size={14} className="text-amber-600" /> Free WiFi available
            </div>
            <div className="flex items-center gap-2">
              <Music size={14} className="text-amber-600" /> Live music on weekends
            </div>
            <div className="flex items-center gap-2">
              <Clock size={14} className="text-amber-600" /> Table held for 15 minutes
            </div>
          </div>
        </div>
      </main>

      {/* Terms Modal */}
      {showTermsModal && <TermsModal />}
    </div>
  );
}
