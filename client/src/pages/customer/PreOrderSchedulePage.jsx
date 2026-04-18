import { useState, useEffect, useMemo } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { CalendarDays, ArrowRight, Truck, ShoppingBag, Table2, Clock, AlertCircle, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { saveOrderPreferences } from '../../utils/orderPreferences';
import api from '../../services/api';

const PREORDER_FEE = 49;
const PREORDER_MIN_MINUTES = 30;
const PREORDER_MAX_MINUTES = 240;

const formatDateTimeInput = (value) => {
  if (!value) return '';
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return '';

  const offsetMs = parsed.getTimezoneOffset() * 60000;
  return new Date(parsed.getTime() - offsetMs).toISOString().slice(0, 16);
};

export default function PreOrderSchedulePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedType, setSelectedType] = useState(null);
  const [scheduledTime, setScheduledTime] = useState('');
  const [selectedTable, setSelectedTable] = useState(null);
  const [guestCount, setGuestCount] = useState(2);
  const shouldLookupTables = selectedType === 'dine-in' && Boolean(scheduledTime);
  const backTarget = location.state?.from || '/';

  // Fetch tables from API for dine-in pre-order
  const { data: tables = [], isLoading: tablesLoading } = useQuery({
    queryKey: ['dinein-tables', scheduledTime],
    queryFn: async () => {
      const response = await api.get('/tables/statuses', {
        params: { scheduledTime },
      });
      return response.data?.tables || [];
    },
    enabled: shouldLookupTables,
    refetchInterval: 30000,
  });

  const getMinDateTime = () => {
    const date = new Date();
    date.setMinutes(date.getMinutes() + PREORDER_MIN_MINUTES);
    return formatDateTimeInput(date);
  };

  const getMaxDateTime = () => {
    const date = new Date();
    date.setMinutes(date.getMinutes() + PREORDER_MAX_MINUTES);
    return formatDateTimeInput(date);
  };

  useEffect(() => {
    try {
      const saved = JSON.parse(sessionStorage.getItem('orderPreferences') || 'null');
      if (!saved?.isPreOrder) return;

      setSelectedType(saved.preOrderMethod || saved.orderType || null);
      setScheduledTime(formatDateTimeInput(saved.scheduledDateTime));
      setGuestCount(Number(saved.guestCount) || 2);
    } catch {
      // Ignore malformed saved preferences.
    }
  }, []);

  // Filter available tables based on guest count
  const availableTables = useMemo(() => {
    if (!tables.length) return [];
    return tables.filter((table) => (table.slotAvailable ?? table.isAvailable) && table.capacity >= guestCount);
  }, [tables, guestCount]);

  useEffect(() => {
    if (selectedType !== 'dine-in' || !tables.length) return;
    setSelectedTable((current) => {
      if (!current?._id) return current;
      const matchingTable = tables.find((table) => table._id === current._id);
      if (!matchingTable) return null;
      return (matchingTable.slotAvailable ?? matchingTable.isAvailable) ? matchingTable : null;
    });
  }, [selectedType, tables]);

  const scheduleError = useMemo(() => {
    if (!scheduledTime) return '';

    const selected = new Date(scheduledTime);
    if (Number.isNaN(selected.getTime())) {
      return 'Please choose a valid date and time.';
    }

    const diffMinutes = Math.round((selected.getTime() - Date.now()) / 60000);
    if (diffMinutes < PREORDER_MIN_MINUTES) {
      return `Pre-orders must be scheduled at least ${PREORDER_MIN_MINUTES} minutes ahead.`;
    }
    if (diffMinutes > PREORDER_MAX_MINUTES) {
      return `Pre-orders are available only within the next ${Math.floor(PREORDER_MAX_MINUTES / 60)} hours.`;
    }

    return '';
  }, [scheduledTime]);

  const handleConfirm = () => {
    if (!selectedType) {
      toast.error('Please select a pre-order type');
      return;
    }
    if (!scheduledTime) {
      toast.error('Please select a date and time');
      return;
    }
    if (scheduleError) {
      toast.error(scheduleError);
      return;
    }
    if (selectedType === 'dine-in' && !selectedTable) {
      toast.error('Please select a table');
      return;
    }

    const preferences = {
      deliveryMethod: 'pre-order',
      orderType: selectedType,
      isPreOrder: true,
      preOrderMethod: selectedType,
      scheduledDateTime: scheduledTime,
      tableNumber: selectedType === 'dine-in' ? selectedTable?.number : null,
      tableId: selectedType === 'dine-in' ? selectedTable?._id : null,
      guestCount: selectedType === 'dine-in' ? guestCount : null,
      preOrderFee: PREORDER_FEE,
      timestamp: new Date().toISOString()
    };

    saveOrderPreferences(preferences);
    toast.success('Pre-order scheduled!');
    navigate('/menu');
  };

  // Pre-order type options
  const preOrderTypes = [
    { 
      value: 'delivery', 
      label: 'Pre-order Delivery', 
      desc: 'Schedule a delivery for later',
      icon: Truck,
      color: 'bg-orange-50 text-orange-600',
      borderColor: 'border-orange-200'
    },
    { 
      value: 'takeaway', 
      label: 'Pre-order Takeaway', 
      desc: 'Schedule a pickup for later',
      icon: ShoppingBag,
      color: 'bg-amber-50 text-amber-600',
      borderColor: 'border-amber-200'
    },
    { 
      value: 'dine-in', 
      label: 'Pre-order Dine-In', 
      desc: 'Book a table and schedule your dine-in order',
      icon: Table2,
      color: 'bg-purple-50 text-purple-600',
      borderColor: 'border-purple-200'
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-[#e8e0d6] bg-white sticky top-0 z-50">
        <div className="max-w-3xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2">
              <img 
                src="https://rollercoastercafe.com/assets/images/roller_logo.png" 
                alt="Logo"
                className="h-8 w-8 rounded-full object-cover"
              />
              <span className="font-semibold text-lg text-[#3f3328]">Roller Coaster Cafe</span>
            </Link>
            <button
              type="button"
              onClick={() => navigate(backTarget)}
              className="text-sm text-[#b97844] hover:underline"
            >
              Back to Home
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-8">
        {/* Title */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-[#3f3328]">Schedule your pre-order</h1>
          <p className="text-sm text-[#6b5f54] mt-1">Choose the fulfillment type, then pick the time you want your order served.</p>
        </div>

        {/* Step 1: Choose Pre-order Type */}
        <div className="mb-8">
          <h2 className="font-semibold text-[#3f3328] mb-4 flex items-center gap-2">
            <CalendarDays size={18} className="text-amber-600" />
            Step 1: Choose your pre-order type
          </h2>
          <div className="grid gap-3">
            {preOrderTypes.map((type) => (
              <button
                key={type.value}
                onClick={() => {
                  setSelectedType(type.value);
                  setSelectedTable(null); // Reset table selection when type changes
                }}
                className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                  selectedType === type.value
                    ? `${type.borderColor} ${type.color} bg-opacity-20`
                    : 'border-[#e8e0d6] hover:border-[#b97844]'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-full ${type.color} flex items-center justify-center`}>
                    <type.icon size={20} />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-[#3f3328]">{type.label}</p>
                    <p className="text-sm text-[#6b5f54]">{type.desc}</p>
                  </div>
                  {selectedType === type.value && (
                    <div className="w-6 h-6 rounded-full bg-green-500 text-sm font-bold text-white flex items-center justify-center">
                      ✓
                    </div>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Step 2: Schedule Time (only if type selected) */}
        {selectedType && (
          <div className="space-y-5">
            <h2 className="font-semibold text-[#3f3328] mb-4 flex items-center gap-2">
              <Clock size={18} className="text-amber-600" />
              Step 2: Select date & time
            </h2>

            <div>
              <label className="block text-sm font-medium text-[#3f3328] mb-2">
                Select {selectedType === 'delivery' ? 'delivery' : selectedType === 'takeaway' ? 'pickup' : 'dine-in'} time
              </label>
              <input
                type="datetime-local"
                value={scheduledTime}
                onChange={(e) => setScheduledTime(e.target.value)}
                min={getMinDateTime()}
                max={getMaxDateTime()}
                className={`w-full rounded-lg border p-3 text-sm focus:outline-none ${
                  scheduleError
                    ? 'border-red-300 bg-red-50/40 focus:border-red-400'
                    : 'border-[#e8e0d6] focus:border-[#b97844]'
                }`}
              />
              <p className="text-xs text-[#6b5f54] mt-1">
                Choose a slot between 30 minutes and 4 hours from now.
              </p>
              {scheduleError && <p className="mt-2 text-sm text-red-500">{scheduleError}</p>}
            </div>

            {/* Dine-in specific fields - Show table selection UI */}
            {selectedType === 'dine-in' && (
              <>
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <label className="block text-sm font-medium text-[#3f3328]">
                      Select your table
                    </label>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-green-600">🟢 Available</span>
                      <span className="text-xs text-red-600">🔴 Booked</span>
                    </div>
                  </div>

                  {!scheduledTime ? (
                    <div className="rounded-xl border border-dashed border-[#e8e0d6] bg-[#faf8f5] px-4 py-5 text-sm text-[#6b5f54]">
                      Select a dine-in date and time first to see live tables available for that slot.
                    </div>
                  ) : tablesLoading ? (
                    <div className="flex justify-center py-8">
                      <Loader2 size={32} className="animate-spin text-amber-600" />
                    </div>
                  ) : (
                    <>
                      {/* Guest count selector for dine-in */}
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-[#3f3328] mb-2">
                          Number of Guests
                        </label>
                        <select
                          value={guestCount}
                          onChange={(e) => {
                            setGuestCount(Number(e.target.value));
                            setSelectedTable(null);
                          }}
                          className="w-full rounded-lg border border-[#e8e0d6] p-3 text-sm focus:border-[#b97844] focus:outline-none"
                        >
                          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                            <option key={num} value={num}>{num} {num === 1 ? 'Guest' : 'Guests'}</option>
                          ))}
                        </select>
                      </div>

                      {/* Table Grid */}
                      <div className="rounded-xl border border-gray-100 bg-[#faf8f5] p-4">
                        <div className="flex items-center justify-between gap-3 mb-3">
                          <div>
                            <p className="text-sm font-semibold text-gray-800">Live table status</p>
                            <p className="text-xs text-gray-500">Select a table for your pre-order</p>
                          </div>
                          <span className="rounded-full bg-white px-3 py-1 text-xs font-medium text-gray-600 border border-gray-200">
                            {availableTables.length} available
                          </span>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                          {tables.map((table) => {
                            const slotAvailable = table.slotAvailable ?? table.isAvailable;
                            const isSelectable = slotAvailable && table.capacity >= guestCount;
                            const isSelected = selectedTable?._id === table._id;
                            
                            return (
                              <button
                                key={table._id}
                                type="button"
                                disabled={!isSelectable}
                                onClick={() => setSelectedTable(table)}
                                className={`rounded-xl border-2 p-3 text-left transition-all ${
                                  !slotAvailable
                                    ? 'border-rose-200 bg-rose-50 text-rose-700 opacity-70 cursor-not-allowed'
                                    : isSelected
                                      ? 'border-amber-500 bg-amber-50'
                                      : isSelectable
                                        ? 'border-emerald-200 bg-emerald-50 hover:border-amber-300 cursor-pointer'
                                        : 'border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed'
                                }`}
                              >
                                <p className="font-semibold">Table {table.number}</p>
                                <p className="text-xs mt-1">Up to {table.capacity} guests</p>
                                <p className="text-xs mt-2">
                                  {!slotAvailable
                                    ? 'Booked for this slot'
                                    : isSelectable 
                                      ? 'Available' 
                                      : `Fits up to ${table.capacity}`}
                                </p>
                                {table.currentReservation?.scheduledTime ? (
                                  <p className="mt-1 text-[11px] leading-4">
                                    Reserved at {new Date(table.currentReservation.scheduledTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                  </p>
                                ) : null}
                              </button>
                            );
                          })}
                        </div>

                        {availableTables.length === 0 && (
                          <div className="mt-4 flex items-center gap-2 rounded-lg bg-red-50 px-3 py-3 text-sm text-red-600">
                            <AlertCircle size={16} />
                            No open table matches {guestCount} guests. Please try fewer guests or select a different time.
                          </div>
                        )}

                        <p className="text-xs text-gray-400 mt-3 text-right">
                          Last updated: {new Date().toLocaleTimeString()}
                        </p>
                      </div>
                    </>
                  )}
                </div>
              </>
            )}

            {/* Fee Summary */}
            <div className="bg-amber-50 rounded-xl p-4 border border-amber-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-[#6b5f54]">Pre-order priority fee</span>
                <span className="font-semibold text-[#b97844]">₹{PREORDER_FEE}</span>
              </div>
              <p className="text-xs text-amber-600">
                This fee ensures your order is prepared exactly at your scheduled time.
              </p>
            </div>

            {/* Confirm Button */}
            <button
              onClick={handleConfirm}
              disabled={
                !scheduledTime ||
                Boolean(scheduleError) ||
                (selectedType === 'dine-in' && !selectedTable) ||
                (selectedType === 'dine-in' && availableTables.length === 0)
              }
              className="w-full rounded-lg bg-[#b97844] py-3 text-white font-semibold hover:bg-[#9e6538] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              Confirm Pre-order
              <ArrowRight size={16} />
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
