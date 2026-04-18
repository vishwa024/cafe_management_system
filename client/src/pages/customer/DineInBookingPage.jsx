// // // import { useEffect, useMemo, useState } from 'react';
// // // import { Link, useNavigate } from 'react-router-dom';
// // // import { AlertCircle, ArrowRight, Check, Clock, Coffee, Copy, Music, Users, UtensilsCrossed, Wifi } from 'lucide-react';
// // // import toast from 'react-hot-toast';
// // // import { getOrderPreferences, saveOrderPreferences } from '../../utils/orderPreferences';

// // // const TABLE_STATUS_KEY = 'staff-table-status';
// // // const DEFAULT_TABLES = [
// // //   { number: '1', capacity: 2, isAvailable: true },
// // //   { number: '2', capacity: 4, isAvailable: true },
// // //   { number: '3', capacity: 2, isAvailable: true },
// // //   { number: '4', capacity: 6, isAvailable: false },
// // //   { number: '5', capacity: 4, isAvailable: true },
// // //   { number: '6', capacity: 8, isAvailable: true },
// // //   { number: '7', capacity: 2, isAvailable: false },
// // //   { number: '8', capacity: 4, isAvailable: true },
// // // ];

// // // const getTableStatuses = () => {
// // //   if (typeof window === 'undefined') return DEFAULT_TABLES;

// // //   try {
// // //     const saved = window.localStorage.getItem(TABLE_STATUS_KEY);
// // //     if (!saved) {
// // //       window.localStorage.setItem(TABLE_STATUS_KEY, JSON.stringify(DEFAULT_TABLES));
// // //       return DEFAULT_TABLES;
// // //     }

// // //     const parsed = JSON.parse(saved);
// // //     if (!Array.isArray(parsed) || !parsed.length) return DEFAULT_TABLES;

// // //     return DEFAULT_TABLES.map((table) => {
// // //       const matched = parsed.find((item) => String(item.number) === String(table.number));
// // //       return matched ? { ...table, ...matched, isAvailable: Boolean(matched.isAvailable) } : table;
// // //     });
// // //   } catch {
// // //     return DEFAULT_TABLES;
// // //   }
// // // };

// // // export default function DineInBookingPage() {
// // //   const navigate = useNavigate();
// // //   const existingPrefs = getOrderPreferences() || {};

// // //   const [guestCount, setGuestCount] = useState(existingPrefs.guestCount || 2);
// // //   const [tableNumber, setTableNumber] = useState(existingPrefs.tableNumber || '');
// // //   const [acceptedTerms, setAcceptedTerms] = useState(Boolean(existingPrefs.isDineIn));
// // //   const [bookingConfirmed, setBookingConfirmed] = useState(Boolean(existingPrefs.isDineIn && existingPrefs.tableNumber));
// // //   const [showTermsModal, setShowTermsModal] = useState(false);
// // //   const [copied, setCopied] = useState(false);
// // //   const [tableStatuses, setTableStatuses] = useState(getTableStatuses);

// // //   useEffect(() => {
// // //     const syncStatuses = () => setTableStatuses(getTableStatuses());
// // //     window.addEventListener('storage', syncStatuses);
// // //     window.addEventListener('focus', syncStatuses);
// // //     return () => {
// // //       window.removeEventListener('storage', syncStatuses);
// // //       window.removeEventListener('focus', syncStatuses);
// // //     };
// // //   }, []);

// // //   const availableTables = useMemo(
// // //     () => tableStatuses.filter((table) => table.isAvailable && table.capacity >= guestCount),
// // //     [tableStatuses, guestCount]
// // //   );
// // //   const bookedTables = tableStatuses.filter((table) => !table.isAvailable);

// // //   const persistTableStatuses = (nextStatuses) => {
// // //     setTableStatuses(nextStatuses);
// // //     window.localStorage.setItem(TABLE_STATUS_KEY, JSON.stringify(nextStatuses));
// // //   };

// // //   const handleConfirmTable = () => {
// // //     if (!tableNumber) {
// // //       toast.error('Please select a table');
// // //       return;
// // //     }

// // //     if (!acceptedTerms) {
// // //       setShowTermsModal(true);
// // //       return;
// // //     }

// // //     const nextStatuses = tableStatuses.map((table) =>
// // //       String(table.number) === String(tableNumber)
// // //         ? {
// // //             ...table,
// // //             isAvailable: false,
// // //             bookedBy: existingPrefs.customerName || 'Customer',
// // //             bookedGuests: guestCount,
// // //             bookedAt: new Date().toISOString(),
// // //           }
// // //         : table
// // //     );

// // //     persistTableStatuses(nextStatuses);
// // //     saveOrderPreferences({
// // //       ...existingPrefs,
// // //       deliveryMethod: 'dine-in',
// // //       orderType: 'dine-in',
// // //       isDineIn: true,
// // //       tableNumber,
// // //       guestCount,
// // //       timestamp: new Date().toISOString(),
// // //     });
// // //     setBookingConfirmed(true);
// // //     toast.success(`Table ${tableNumber} booked for ${guestCount} guests`);
// // //   };

// // //   const handleOrderForDineIn = () => {
// // //     saveOrderPreferences({
// // //       ...existingPrefs,
// // //       deliveryMethod: 'dine-in',
// // //       orderType: 'dine-in',
// // //       isDineIn: true,
// // //       tableNumber,
// // //       guestCount,
// // //       timestamp: new Date().toISOString(),
// // //     });
// // //     navigate('/menu');
// // //   };

// // //   const copyTableInfo = async () => {
// // //     await navigator.clipboard.writeText(`Table ${tableNumber} • ${guestCount} Guests • Roller Coaster Cafe`);
// // //     setCopied(true);
// // //     toast.success('Table info copied');
// // //     setTimeout(() => setCopied(false), 1800);
// // //   };

// // //   const TermsModal = () => (
// // //     <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
// // //       <div className="w-full max-w-md rounded-2xl bg-white overflow-hidden">
// // //         <div className="border-b border-gray-100 px-5 py-4">
// // //           <h3 className="font-semibold text-lg text-gray-800">Dine-In Terms & Conditions</h3>
// // //         </div>
// // //         <div className="px-5 py-5 space-y-4 text-sm text-gray-600 max-h-[65vh] overflow-y-auto">
// // //           <p><strong>1. Reservation Hold:</strong> Tables are held for 15 minutes from booking time.</p>
// // //           <p><strong>2. Guest Count:</strong> Please select the correct guest count. Large changes may need another table.</p>
// // //           <p><strong>3. Table Assignment:</strong> Availability is live and may change based on staff updates.</p>
// // //           <p><strong>4. Dine-In Ordering:</strong> After booking, you can order directly for your reserved table.</p>
// // //           <p><strong>5. Staff Assistance:</strong> For any issue, please contact the front desk inside the cafe.</p>
// // //         </div>
// // //         <div className="border-t border-gray-100 px-5 py-4">
// // //           <button
// // //             onClick={() => {
// // //               setAcceptedTerms(true);
// // //               setShowTermsModal(false);
// // //               toast.success('Terms accepted');
// // //             }}
// // //             className="w-full rounded-full bg-amber-600 py-3 text-white font-semibold hover:bg-amber-700 transition-all"
// // //           >
// // //             I Accept
// // //           </button>
// // //         </div>
// // //       </div>
// // //     </div>
// // //   );

// // //   return (
// // //     <div className="min-h-screen bg-white">
// // //       <header className="border-b border-gray-100 bg-white sticky top-0 z-50">
// // //         <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
// // //           <Link to="/dashboard" className="flex items-center gap-2">
// // //             <img
// // //               src="https://rollercoastercafe.com/assets/images/roller_logo.png"
// // //               alt="Logo"
// // //               className="h-8 w-8 rounded-full object-cover"
// // //             />
// // //             <span className="font-semibold text-lg text-gray-800">Roller Coaster Cafe</span>
// // //           </Link>
// // //           <Link to="/dashboard" className="text-sm text-gray-500 hover:text-amber-600">Back to Home</Link>
// // //         </div>
// // //       </header>

// // //       <main className="max-w-5xl mx-auto px-4 py-8">
// // //         <div className="text-center mb-8">
// // //           <h1 className="text-3xl font-bold text-gray-800">Reserve Your Table</h1>
// // //           <p className="text-gray-500 mt-2">Choose an available table first. Staff updates these table states live.</p>
// // //         </div>

// // //         <div className="grid gap-6 lg:grid-cols-[1.2fr,0.8fr]">
// // //           <section className="rounded-2xl border border-gray-100 bg-white p-6 shadow-lg">
// // //             <div className="space-y-5">
// // //               <div>
// // //                 <label className="block text-sm font-medium text-gray-700 mb-2">Number of Guests</label>
// // //                 <select
// // //                   value={guestCount}
// // //                   onChange={(e) => {
// // //                     setGuestCount(Number(e.target.value));
// // //                     setTableNumber('');
// // //                     setBookingConfirmed(false);
// // //                   }}
// // //                   className="w-full rounded-lg border border-gray-200 px-4 py-3 focus:border-amber-500 focus:outline-none"
// // //                 >
// // //                   {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
// // //                     <option key={num} value={num}>{num} {num === 1 ? 'Guest' : 'Guests'}</option>
// // //                   ))}
// // //                 </select>
// // //               </div>

// // //               <div className="rounded-xl border border-gray-100 bg-[#faf8f5] p-4">
// // //                 <div className="flex items-center justify-between gap-3 mb-3">
// // //                   <div>
// // //                     <p className="text-sm font-semibold text-gray-800">Live table status</p>
// // //                     <p className="text-xs text-gray-500">Open tables can be booked right away.</p>
// // //                   </div>
// // //                   <span className="rounded-full bg-white px-3 py-1 text-xs font-medium text-gray-600 border border-gray-200">
// // //                     {availableTables.length} open / {bookedTables.length} booked
// // //                   </span>
// // //                 </div>
// // //                 <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
// // //                   {tableStatuses.map((table) => {
// // //                     const selectable = table.isAvailable && table.capacity >= guestCount;
// // //                     const selected = String(tableNumber) === String(table.number);
// // //                     return (
// // //                       <button
// // //                         key={table.number}
// // //                         type="button"
// // //                         disabled={!selectable}
// // //                         onClick={() => {
// // //                           setTableNumber(table.number);
// // //                           setBookingConfirmed(false);
// // //                         }}
// // //                         className={`rounded-xl border-2 p-3 text-left transition-all ${
// // //                           !table.isAvailable
// // //                             ? 'border-rose-200 bg-rose-50 text-rose-700 opacity-70'
// // //                             : selected
// // //                               ? 'border-amber-500 bg-amber-50'
// // //                               : selectable
// // //                                 ? 'border-emerald-200 bg-emerald-50 hover:border-amber-300'
// // //                                 : 'border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed'
// // //                         }`}
// // //                       >
// // //                         <p className="font-semibold">Table {table.number}</p>
// // //                         <p className="text-xs mt-1">Up to {table.capacity} guests</p>
// // //                         <p className="text-xs mt-2">
// // //                           {!table.isAvailable ? 'Booked' : selectable ? 'Available now' : 'Too small'}
// // //                         </p>
// // //                       </button>
// // //                     );
// // //                   })}
// // //                 </div>
// // //                 {availableTables.length === 0 && (
// // //                   <div className="mt-4 flex items-center gap-2 rounded-lg bg-red-50 px-3 py-3 text-sm text-red-600">
// // //                     <AlertCircle size={16} />
// // //                     No open table matches this guest count right now.
// // //                   </div>
// // //                 )}
// // //               </div>

// // //               <div className="flex items-center gap-3">
// // //                 <input
// // //                   id="dinein-terms"
// // //                   type="checkbox"
// // //                   checked={acceptedTerms}
// // //                   onChange={(e) => setAcceptedTerms(e.target.checked)}
// // //                   className="w-4 h-4 rounded border-gray-300 text-amber-600 focus:ring-amber-500"
// // //                 />
// // //                 <label htmlFor="dinein-terms" className="text-sm text-gray-600">
// // //                   I agree to the{' '}
// // //                   <button type="button" onClick={() => setShowTermsModal(true)} className="text-amber-600 hover:underline">
// // //                     dine-in terms and conditions
// // //                   </button>
// // //                 </label>
// // //               </div>

// // //               <button
// // //                 onClick={handleConfirmTable}
// // //                 disabled={!tableNumber || !acceptedTerms || !availableTables.length}
// // //                 className="w-full rounded-full bg-amber-600 py-3 text-white font-semibold hover:bg-amber-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
// // //               >
// // //                 Confirm Table Booking
// // //               </button>

// // //               {bookingConfirmed && tableNumber && (
// // //                 <div className="space-y-4 rounded-xl border border-green-200 bg-green-50 p-4">
// // //                   <div className="flex items-center justify-between gap-3 flex-wrap">
// // //                     <div>
// // //                       <p className="text-sm font-semibold text-green-800">Table {tableNumber} booked for {guestCount} guests.</p>
// // //                       <p className="text-xs text-green-700 mt-1">Arrive within 15 minutes. Staff will hold this table for you.</p>
// // //                     </div>
// // //                     <button
// // //                       onClick={copyTableInfo}
// // //                       className="inline-flex items-center gap-1.5 rounded-lg bg-white px-3 py-2 text-sm text-green-700 hover:bg-green-100 transition-all"
// // //                     >
// // //                       {copied ? <Check size={14} /> : <Copy size={14} />}
// // //                       {copied ? 'Copied' : 'Copy Info'}
// // //                     </button>
// // //                   </div>

// // //                   <div className="rounded-xl border border-[#e8e0d6] bg-white p-4">
// // //                     <h3 className="font-semibold text-gray-800">Would you like to order for dine-in now?</h3>
// // //                     <p className="mt-1 text-sm text-gray-500">
// // //                       If yes, the menu will open directly in dine-in mode for your booked table.
// // //                     </p>
// // //                     <div className="mt-4 flex flex-wrap gap-3">
// // //                       <button
// // //                         onClick={handleOrderForDineIn}
// // //                         className="inline-flex items-center gap-2 rounded-full bg-amber-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-amber-700 transition-all"
// // //                       >
// // //                         <UtensilsCrossed size={15} />
// // //                         Order for Dine-In
// // //                       </button>
// // //                       <Link
// // //                         to="/dashboard"
// // //                         className="inline-flex items-center gap-2 rounded-full border border-gray-200 px-5 py-2.5 text-sm font-semibold text-gray-600 hover:border-amber-500 hover:text-amber-600 transition-all"
// // //                       >
// // //                         Maybe Later
// // //                         <ArrowRight size={14} />
// // //                       </Link>
// // //                     </div>
// // //                   </div>
// // //                 </div>
// // //               )}
// // //             </div>
// // //           </section>

// // //           <aside className="space-y-4">
// // //             <div className="rounded-2xl border border-gray-100 bg-[#faf8f5] p-5">
// // //               <h3 className="font-semibold text-gray-800">Dine-In Information</h3>
// // //               <div className="mt-4 space-y-3 text-sm text-gray-600">
// // //                 <div className="flex items-center gap-2"><Coffee size={14} className="text-amber-600" /> Complimentary water service</div>
// // //                 <div className="flex items-center gap-2"><Wifi size={14} className="text-amber-600" /> Free WiFi available</div>
// // //                 <div className="flex items-center gap-2"><Music size={14} className="text-amber-600" /> Live music on weekends</div>
// // //                 <div className="flex items-center gap-2"><Clock size={14} className="text-amber-600" /> Table held for 15 minutes</div>
// // //               </div>
// // //             </div>
// // //           </aside>
// // //         </div>
// // //       </main>

// // //       {showTermsModal && <TermsModal />}
// // //     </div>
// // //   );
// // // }
// // import { useEffect, useMemo, useState } from 'react';
// // import { Link, useNavigate } from 'react-router-dom';
// // import { AlertCircle, ArrowRight, Check, Clock, Coffee, Copy, Music, Users, UtensilsCrossed, Wifi } from 'lucide-react';
// // import { useSelector } from 'react-redux';
// // import toast from 'react-hot-toast';
// // import { getOrderPreferences, saveOrderPreferences } from '../../utils/orderPreferences';

// // const TABLE_STATUS_KEY = 'staff-table-status';
// // const DEFAULT_TABLES = [
// //   { number: '1', capacity: 2, isAvailable: true },
// //   { number: '2', capacity: 4, isAvailable: true },
// //   { number: '3', capacity: 2, isAvailable: true },
// //   { number: '4', capacity: 6, isAvailable: false },
// //   { number: '5', capacity: 4, isAvailable: true },
// //   { number: '6', capacity: 8, isAvailable: true },
// //   { number: '7', capacity: 2, isAvailable: false },
// //   { number: '8', capacity: 4, isAvailable: true },
// // ];

// // const getTableStatuses = () => {
// //   if (typeof window === 'undefined') return DEFAULT_TABLES;

// //   try {
// //     const saved = window.localStorage.getItem(TABLE_STATUS_KEY);
// //     if (!saved) {
// //       window.localStorage.setItem(TABLE_STATUS_KEY, JSON.stringify(DEFAULT_TABLES));
// //       return DEFAULT_TABLES;
// //     }

// //     const parsed = JSON.parse(saved);
// //     if (!Array.isArray(parsed) || !parsed.length) return DEFAULT_TABLES;

// //     return DEFAULT_TABLES.map((table) => {
// //       const matched = parsed.find((item) => String(item.number) === String(table.number));
// //       return matched ? { ...table, ...matched, isAvailable: Boolean(matched.isAvailable) } : table;
// //     });
// //   } catch {
// //     return DEFAULT_TABLES;
// //   }
// // };

// // export default function DineInBookingPage() {
// //   const navigate = useNavigate();
// //   const existingPrefs = getOrderPreferences() || {};
// //   const { isAuthenticated, user } = useSelector((state) => state.auth);

// //   const [guestCount, setGuestCount] = useState(existingPrefs.guestCount || 2);
// //   const [tableNumber, setTableNumber] = useState(existingPrefs.tableNumber || '');
// //   const [acceptedTerms, setAcceptedTerms] = useState(Boolean(existingPrefs.isDineIn));
// //   const [bookingConfirmed, setBookingConfirmed] = useState(Boolean(existingPrefs.isDineIn && existingPrefs.tableNumber));
// //   const [showTermsModal, setShowTermsModal] = useState(false);
// //   const [copied, setCopied] = useState(false);
// //   const [tableStatuses, setTableStatuses] = useState(getTableStatuses);
// //   const [showGuestForm, setShowGuestForm] = useState(false);
// //   const [guestName, setGuestName] = useState('');
// //   const [guestPhone, setGuestPhone] = useState('');

// //   useEffect(() => {
// //     const syncStatuses = () => setTableStatuses(getTableStatuses());
// //     window.addEventListener('storage', syncStatuses);
// //     window.addEventListener('focus', syncStatuses);
// //     return () => {
// //       window.removeEventListener('storage', syncStatuses);
// //       window.removeEventListener('focus', syncStatuses);
// //     };
// //   }, []);

// //   const availableTables = useMemo(
// //     () => tableStatuses.filter((table) => table.isAvailable && table.capacity >= guestCount),
// //     [tableStatuses, guestCount]
// //   );
// //   const bookedTables = tableStatuses.filter((table) => !table.isAvailable);

// //   const persistTableStatuses = (nextStatuses) => {
// //     setTableStatuses(nextStatuses);
// //     window.localStorage.setItem(TABLE_STATUS_KEY, JSON.stringify(nextStatuses));
// //   };

// //   const handleConfirmTable = () => {
// //     if (!tableNumber) {
// //       toast.error('Please select a table');
// //       return;
// //     }

// //     if (!acceptedTerms) {
// //       setShowTermsModal(true);
// //       return;
// //     }

// //     // If not authenticated and guest form not shown yet, show it
// //     if (!isAuthenticated && !showGuestForm) {
// //       setShowGuestForm(true);
// //       return;
// //     }

// //     // If guest, validate name and phone
// //     if (!isAuthenticated && (!guestName.trim() || !guestPhone.trim())) {
// //       toast.error('Please enter your name and phone number');
// //       return;
// //     }

// //     const nextStatuses = tableStatuses.map((table) =>
// //       String(table.number) === String(tableNumber)
// //         ? {
// //             ...table,
// //             isAvailable: false,
// //             bookedBy: isAuthenticated ? user?.name : guestName,
// //             bookedPhone: !isAuthenticated ? guestPhone : null,
// //             bookedGuests: guestCount,
// //             bookedAt: new Date().toISOString(),
// //           }
// //         : table
// //     );

// //     persistTableStatuses(nextStatuses);
    
// //     const bookingPrefs = {
// //       ...existingPrefs,
// //       deliveryMethod: 'dine-in',
// //       orderType: 'dine-in',
// //       isDineIn: true,
// //       tableNumber,
// //       guestCount,
// //       timestamp: new Date().toISOString(),
// //     };
    
// //     if (!isAuthenticated) {
// //       bookingPrefs.guestName = guestName;
// //       bookingPrefs.guestPhone = guestPhone;
// //     }
    
// //     saveOrderPreferences(bookingPrefs);
// //     setBookingConfirmed(true);
// //     toast.success(`Table ${tableNumber} booked for ${guestCount} guests`);
// //   };

// //   const handleOrderForDineIn = () => {
// //     const bookingPrefs = {
// //       ...existingPrefs,
// //       deliveryMethod: 'dine-in',
// //       orderType: 'dine-in',
// //       isDineIn: true,
// //       tableNumber,
// //       guestCount,
// //       timestamp: new Date().toISOString(),
// //     };
    
// //     if (!isAuthenticated) {
// //       bookingPrefs.guestName = guestName;
// //       bookingPrefs.guestPhone = guestPhone;
// //     }
    
// //     saveOrderPreferences(bookingPrefs);
// //     navigate('/menu?mode=dine-in');
// //   };

// //   const copyTableInfo = async () => {
// //     await navigator.clipboard.writeText(`Table ${tableNumber} • ${guestCount} Guests • Roller Coaster Cafe`);
// //     setCopied(true);
// //     toast.success('Table info copied');
// //     setTimeout(() => setCopied(false), 1800);
// //   };

// //   const TermsModal = () => (
// //     <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
// //       <div className="w-full max-w-md rounded-2xl bg-white overflow-hidden">
// //         <div className="border-b border-gray-100 px-5 py-4">
// //           <h3 className="font-semibold text-lg text-gray-800">Dine-In Terms & Conditions</h3>
// //         </div>
// //         <div className="px-5 py-5 space-y-4 text-sm text-gray-600 max-h-[65vh] overflow-y-auto">
// //           <p><strong>1. Reservation Hold:</strong> Tables are held for 15 minutes from booking time.</p>
// //           <p><strong>2. Guest Count:</strong> Please select the correct guest count. Large changes may need another table.</p>
// //           <p><strong>3. Table Assignment:</strong> Availability is live and may change based on staff updates.</p>
// //           <p><strong>4. Dine-In Ordering:</strong> After booking, you can order directly for your reserved table.</p>
// //           <p><strong>5. Staff Assistance:</strong> For any issue, please contact the front desk inside the cafe.</p>
// //         </div>
// //         <div className="border-t border-gray-100 px-5 py-4">
// //           <button
// //             onClick={() => {
// //               setAcceptedTerms(true);
// //               setShowTermsModal(false);
// //               toast.success('Terms accepted');
// //             }}
// //             className="w-full rounded-full bg-amber-600 py-3 text-white font-semibold hover:bg-amber-700 transition-all"
// //           >
// //             I Accept
// //           </button>
// //         </div>
// //       </div>
// //     </div>
// //   );

// //   return (
// //     <div className="min-h-screen bg-white">
// //       <header className="border-b border-gray-100 bg-white sticky top-0 z-50">
// //         <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
// //           <Link to="/" className="flex items-center gap-2">
// //             <img
// //               src="https://rollercoastercafe.com/assets/images/roller_logo.png"
// //               alt="Logo"
// //               className="h-8 w-8 rounded-full object-cover"
// //             />
// //             <span className="font-semibold text-lg text-gray-800">Roller Coaster Cafe</span>
// //           </Link>
// //           <Link to="/" className="text-sm text-gray-500 hover:text-amber-600">Back to Home</Link>
// //         </div>
// //       </header>

// //       <main className="max-w-5xl mx-auto px-4 py-8">
// //         <div className="text-center mb-8">
// //           <h1 className="text-3xl font-bold text-gray-800">Reserve Your Table</h1>
// //           <p className="text-gray-500 mt-2">Choose an available table first. Staff updates these table states live.</p>
// //         </div>

// //         <div className="grid gap-6 lg:grid-cols-[1.2fr,0.8fr]">
// //           <section className="rounded-2xl border border-gray-100 bg-white p-6 shadow-lg">
// //             <div className="space-y-5">
// //               <div>
// //                 <label className="block text-sm font-medium text-gray-700 mb-2">Number of Guests</label>
// //                 <select
// //                   value={guestCount}
// //                   onChange={(e) => {
// //                     setGuestCount(Number(e.target.value));
// //                     setTableNumber('');
// //                     setBookingConfirmed(false);
// //                   }}
// //                   className="w-full rounded-lg border border-gray-200 px-4 py-3 focus:border-amber-500 focus:outline-none"
// //                 >
// //                   {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
// //                     <option key={num} value={num}>{num} {num === 1 ? 'Guest' : 'Guests'}</option>
// //                   ))}
// //                 </select>
// //               </div>

// //               <div className="rounded-xl border border-gray-100 bg-[#faf8f5] p-4">
// //                 <div className="flex items-center justify-between gap-3 mb-3">
// //                   <div>
// //                     <p className="text-sm font-semibold text-gray-800">Live table status</p>
// //                     <p className="text-xs text-gray-500">Open tables can be booked right away.</p>
// //                   </div>
// //                   <span className="rounded-full bg-white px-3 py-1 text-xs font-medium text-gray-600 border border-gray-200">
// //                     {availableTables.length} open / {bookedTables.length} booked
// //                   </span>
// //                 </div>
// //                 <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
// //                   {tableStatuses.map((table) => {
// //                     const selectable = table.isAvailable && table.capacity >= guestCount;
// //                     const selected = String(tableNumber) === String(table.number);
// //                     return (
// //                       <button
// //                         key={table.number}
// //                         type="button"
// //                         disabled={!selectable}
// //                         onClick={() => {
// //                           setTableNumber(table.number);
// //                           setBookingConfirmed(false);
// //                           setShowGuestForm(false);
// //                         }}
// //                         className={`rounded-xl border-2 p-3 text-left transition-all ${
// //                           !table.isAvailable
// //                             ? 'border-rose-200 bg-rose-50 text-rose-700 opacity-70'
// //                             : selected
// //                               ? 'border-amber-500 bg-amber-50'
// //                               : selectable
// //                                 ? 'border-emerald-200 bg-emerald-50 hover:border-amber-300'
// //                                 : 'border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed'
// //                         }`}
// //                       >
// //                         <p className="font-semibold">Table {table.number}</p>
// //                         <p className="text-xs mt-1">Up to {table.capacity} guests</p>
// //                         <p className="text-xs mt-2">
// //                           {!table.isAvailable ? 'Booked' : selectable ? 'Available now' : 'Too small'}
// //                         </p>
// //                       </button>
// //                     );
// //                   })}
// //                 </div>
// //                 {availableTables.length === 0 && (
// //                   <div className="mt-4 flex items-center gap-2 rounded-lg bg-red-50 px-3 py-3 text-sm text-red-600">
// //                     <AlertCircle size={16} />
// //                     No open table matches this guest count right now.
// //                   </div>
// //                 )}
// //               </div>

// //               <div className="flex items-center gap-3">
// //                 <input
// //                   id="dinein-terms"
// //                   type="checkbox"
// //                   checked={acceptedTerms}
// //                   onChange={(e) => setAcceptedTerms(e.target.checked)}
// //                   className="w-4 h-4 rounded border-gray-300 text-amber-600 focus:ring-amber-500"
// //                 />
// //                 <label htmlFor="dinein-terms" className="text-sm text-gray-600">
// //                   I agree to the{' '}
// //                   <button type="button" onClick={() => setShowTermsModal(true)} className="text-amber-600 hover:underline">
// //                     dine-in terms and conditions
// //                   </button>
// //                 </label>
// //               </div>

// //               {/* Guest Information Form for non-logged in users */}
// //               {!isAuthenticated && showGuestForm && (
// //                 <div className="space-y-3 mt-4 p-4 border border-amber-200 rounded-xl bg-amber-50">
// //                   <p className="text-sm font-medium text-amber-800">Guest Information</p>
// //                   <p className="text-xs text-amber-600 mb-2">Please provide your details to confirm the booking</p>
// //                   <input
// //                     type="text"
// //                     value={guestName}
// //                     onChange={(e) => setGuestName(e.target.value)}
// //                     placeholder="Your Name *"
// //                     className="w-full rounded-lg border border-amber-200 p-2 text-sm focus:border-amber-500 focus:outline-none"
// //                     required
// //                   />
// //                   <input
// //                     type="tel"
// //                     value={guestPhone}
// //                     onChange={(e) => setGuestPhone(e.target.value)}
// //                     placeholder="Phone Number *"
// //                     className="w-full rounded-lg border border-amber-200 p-2 text-sm focus:border-amber-500 focus:outline-none"
// //                     required
// //                   />
// //                   <p className="text-xs text-amber-600">We'll use this to contact you about your table booking</p>
// //                 </div>
// //               )}

// //               <button
// //                 onClick={handleConfirmTable}
// //                 disabled={!tableNumber || !acceptedTerms || !availableTables.length}
// //                 className="w-full rounded-full bg-amber-600 py-3 text-white font-semibold hover:bg-amber-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
// //               >
// //                 Confirm Table Booking
// //               </button>

// //               {bookingConfirmed && tableNumber && (
// //                 <div className="space-y-4 rounded-xl border border-green-200 bg-green-50 p-4">
// //                   <div className="flex items-center justify-between gap-3 flex-wrap">
// //                     <div>
// //                       <p className="text-sm font-semibold text-green-800">Table {tableNumber} booked for {guestCount} guests.</p>
// //                       <p className="text-xs text-green-700 mt-1">Arrive within 15 minutes. Staff will hold this table for you.</p>
// //                     </div>
// //                     <button
// //                       onClick={copyTableInfo}
// //                       className="inline-flex items-center gap-1.5 rounded-lg bg-white px-3 py-2 text-sm text-green-700 hover:bg-green-100 transition-all"
// //                     >
// //                       {copied ? <Check size={14} /> : <Copy size={14} />}
// //                       {copied ? 'Copied' : 'Copy Info'}
// //                     </button>
// //                   </div>

// //                   <div className="rounded-xl border border-[#e8e0d6] bg-white p-4">
// //                     <h3 className="font-semibold text-gray-800">Would you like to order for dine-in now?</h3>
// //                     <p className="mt-1 text-sm text-gray-500">
// //                       If yes, the menu will open directly in dine-in mode for your booked table.
// //                     </p>
// //                     <div className="mt-4 flex flex-wrap gap-3">
// //                       <button
// //                         onClick={handleOrderForDineIn}
// //                         className="inline-flex items-center gap-2 rounded-full bg-amber-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-amber-700 transition-all"
// //                       >
// //                         <UtensilsCrossed size={15} />
// //                         Order for Dine-In
// //                       </button>
// //                       <Link
// //                         to="/"
// //                         className="inline-flex items-center gap-2 rounded-full border border-gray-200 px-5 py-2.5 text-sm font-semibold text-gray-600 hover:border-amber-500 hover:text-amber-600 transition-all"
// //                       >
// //                         Maybe Later
// //                         <ArrowRight size={14} />
// //                       </Link>
// //                     </div>
// //                   </div>
// //                 </div>
// //               )}
// //             </div>
// //           </section>

// //           <aside className="space-y-4">
// //             <div className="rounded-2xl border border-gray-100 bg-[#faf8f5] p-5">
// //               <h3 className="font-semibold text-gray-800">Dine-In Information</h3>
// //               <div className="mt-4 space-y-3 text-sm text-gray-600">
// //                 <div className="flex items-center gap-2"><Coffee size={14} className="text-amber-600" /> Complimentary water service</div>
// //                 <div className="flex items-center gap-2"><Wifi size={14} className="text-amber-600" /> Free WiFi available</div>
// //                 <div className="flex items-center gap-2"><Music size={14} className="text-amber-600" /> Live music on weekends</div>
// //                 <div className="flex items-center gap-2"><Clock size={14} className="text-amber-600" /> Table held for 15 minutes</div>
// //               </div>
// //             </div>
            
// //             {!isAuthenticated && !showGuestForm && tableNumber && acceptedTerms && (
// //               <div className="rounded-2xl border border-blue-100 bg-blue-50 p-4">
// //                 <p className="text-sm text-blue-700">
// //                   You're booking as a guest. Please continue to provide your contact information.
// //                 </p>
// //               </div>
// //             )}
// //           </aside>
// //         </div>
// //       </main>

// //       {showTermsModal && <TermsModal />}
// //     </div>
// //   );
// // }

// import { useEffect, useMemo, useState } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { AlertCircle, ArrowRight, Check, Clock, Coffee, Copy, Music, Users, UtensilsCrossed, Wifi } from 'lucide-react';
// import { useSelector } from 'react-redux';
// import toast from 'react-hot-toast';
// import { getOrderPreferences, saveOrderPreferences } from '../../utils/orderPreferences';

// const TABLE_STATUS_KEY = 'staff-table-status';

// // Default tables with proper capacities
// const DEFAULT_TABLES = [
//   { number: '1', capacity: 2, isAvailable: true, bookedBy: null, bookedPhone: null, bookedGuests: null, bookedAt: null },
//   { number: '2', capacity: 4, isAvailable: true, bookedBy: null, bookedPhone: null, bookedGuests: null, bookedAt: null },
//   { number: '3', capacity: 2, isAvailable: true, bookedBy: null, bookedPhone: null, bookedGuests: null, bookedAt: null },
//   { number: '4', capacity: 6, isAvailable: true, bookedBy: null, bookedPhone: null, bookedGuests: null, bookedAt: null },
//   { number: '5', capacity: 4, isAvailable: true, bookedBy: null, bookedPhone: null, bookedGuests: null, bookedAt: null },
//   { number: '6', capacity: 8, isAvailable: true, bookedBy: null, bookedPhone: null, bookedGuests: null, bookedAt: null },
//   { number: '7', capacity: 2, isAvailable: true, bookedBy: null, bookedPhone: null, bookedGuests: null, bookedAt: null },
//   { number: '8', capacity: 4, isAvailable: true, bookedBy: null, bookedPhone: null, bookedGuests: null, bookedAt: null },
// ];

// // Function to get table statuses from localStorage
// const getTableStatuses = () => {
//   if (typeof window === 'undefined') return DEFAULT_TABLES;

//   try {
//     const saved = window.localStorage.getItem(TABLE_STATUS_KEY);
//     console.log('Loading tables from localStorage:', saved);
    
//     if (!saved) {
//       // Initialize with default tables
//       window.localStorage.setItem(TABLE_STATUS_KEY, JSON.stringify(DEFAULT_TABLES));
//       return DEFAULT_TABLES;
//     }

//     const parsed = JSON.parse(saved);
//     if (!Array.isArray(parsed) || !parsed.length) return DEFAULT_TABLES;

//     // Merge saved data with default structure
//     return DEFAULT_TABLES.map((defaultTable) => {
//       const savedTable = parsed.find((t) => String(t.number) === String(defaultTable.number));
//       return savedTable 
//         ? { ...defaultTable, ...savedTable, isAvailable: savedTable.isAvailable !== false }
//         : defaultTable;
//     });
//   } catch (error) {
//     console.error('Error loading table statuses:', error);
//     return DEFAULT_TABLES;
//   }
// };

// export default function DineInBookingPage() {
//   const navigate = useNavigate();
//   const existingPrefs = getOrderPreferences() || {};
//   const { isAuthenticated, user } = useSelector((state) => state.auth);

//   const [guestCount, setGuestCount] = useState(existingPrefs.guestCount || 2);
//   const [selectedTable, setSelectedTable] = useState(null);
//   const [acceptedTerms, setAcceptedTerms] = useState(false);
//   const [bookingConfirmed, setBookingConfirmed] = useState(false);
//   const [showTermsModal, setShowTermsModal] = useState(false);
//   const [copied, setCopied] = useState(false);
//   const [tableStatuses, setTableStatuses] = useState(getTableStatuses);
//   const [showGuestForm, setShowGuestForm] = useState(false);
//   const [guestName, setGuestName] = useState('');
//   const [guestPhone, setGuestPhone] = useState('');

//   // Listen for storage events (when staff updates tables)
//   useEffect(() => {
//     const handleStorageChange = (e) => {
//       if (e.key === TABLE_STATUS_KEY) {
//         console.log('Table status updated by staff, reloading...');
//         setTableStatuses(getTableStatuses());
//       }
//     };
    
//     window.addEventListener('storage', handleStorageChange);
    
//     // Also refresh every 10 seconds to sync
//     const interval = setInterval(() => {
//       setTableStatuses(getTableStatuses());
//     }, 10000);
    
//     return () => {
//       window.removeEventListener('storage', handleStorageChange);
//       clearInterval(interval);
//     };
//   }, []);

//   // Filter available tables based on guest count
//   const availableTables = useMemo(() => {
//     const available = tableStatuses.filter((table) => table.isAvailable && table.capacity >= guestCount);
//     console.log('Available tables for', guestCount, 'guests:', available);
//     return available;
//   }, [tableStatuses, guestCount]);

//   const bookedTables = tableStatuses.filter((table) => !table.isAvailable);

//   // Function to update table status (called when customer books)
//   const updateTableStatus = (tableNumber, bookingData) => {
//     const updatedTables = tableStatuses.map((table) =>
//       String(table.number) === String(tableNumber)
//         ? {
//             ...table,
//             isAvailable: false,
//             bookedBy: bookingData.customerName,
//             bookedPhone: bookingData.customerPhone,
//             bookedGuests: bookingData.guestCount,
//             bookedAt: new Date().toISOString(),
//           }
//         : table
//     );
    
//     setTableStatuses(updatedTables);
//     localStorage.setItem(TABLE_STATUS_KEY, JSON.stringify(updatedTables));
//     // Dispatch storage event to notify other tabs
//     window.dispatchEvent(new StorageEvent('storage', { key: TABLE_STATUS_KEY, newValue: JSON.stringify(updatedTables) }));
//   };

//   const handleConfirmTable = () => {
//     if (!selectedTable) {
//       toast.error('Please select a table');
//       return;
//     }

//     if (!acceptedTerms) {
//       setShowTermsModal(true);
//       return;
//     }

//     if (!isAuthenticated && !showGuestForm) {
//       setShowGuestForm(true);
//       return;
//     }

//     if (!isAuthenticated && (!guestName.trim() || !guestPhone.trim())) {
//       toast.error('Please enter your name and phone number');
//       return;
//     }

//     const customerName = isAuthenticated ? user?.name : guestName;
//     const customerPhone = !isAuthenticated ? guestPhone : user?.phone;

//     // Update table status in localStorage
//     updateTableStatus(selectedTable.number, {
//       customerName,
//       customerPhone,
//       guestCount,
//     });

//     // Save booking preferences
//     const bookingPrefs = {
//       ...existingPrefs,
//       deliveryMethod: 'dine-in',
//       orderType: 'dine-in',
//       isDineIn: true,
//       tableNumber: selectedTable.number,
//       guestCount,
//       timestamp: new Date().toISOString(),
//     };
    
//     if (!isAuthenticated) {
//       bookingPrefs.guestName = guestName;
//       bookingPrefs.guestPhone = guestPhone;
//     }
    
//     saveOrderPreferences(bookingPrefs);
//     setBookingConfirmed(true);
//     toast.success(`Table ${selectedTable.number} booked for ${guestCount} guests!`);
//   };

//   const handleOrderForDineIn = () => {
//     const bookingPrefs = {
//       ...existingPrefs,
//       deliveryMethod: 'dine-in',
//       orderType: 'dine-in',
//       isDineIn: true,
//       tableNumber: selectedTable?.number,
//       guestCount,
//       timestamp: new Date().toISOString(),
//     };
    
//     if (!isAuthenticated) {
//       bookingPrefs.guestName = guestName;
//       bookingPrefs.guestPhone = guestPhone;
//     }
    
//     saveOrderPreferences(bookingPrefs);
//     navigate('/menu?mode=dine-in');
//   };

//   const copyTableInfo = async () => {
//     await navigator.clipboard.writeText(`Table ${selectedTable?.number} • ${guestCount} Guests • Roller Coaster Cafe`);
//     setCopied(true);
//     toast.success('Table info copied');
//     setTimeout(() => setCopied(false), 1800);
//   };

//   const TermsModal = () => (
//     <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
//       <div className="w-full max-w-md rounded-2xl bg-white overflow-hidden">
//         <div className="border-b border-gray-100 px-5 py-4">
//           <h3 className="font-semibold text-lg text-gray-800">Dine-In Terms & Conditions</h3>
//         </div>
//         <div className="px-5 py-5 space-y-4 text-sm text-gray-600 max-h-[65vh] overflow-y-auto">
//           <p><strong>1. Reservation Hold:</strong> Tables are held for 15 minutes from booking time.</p>
//           <p><strong>2. Guest Count:</strong> Please select the correct guest count.</p>
//           <p><strong>3. Table Assignment:</strong> Staff updates table availability live.</p>
//           <p><strong>4. Ordering:</strong> After booking, you can order for your table.</p>
//           <p><strong>5. Contact:</strong> For any issue, please contact the front desk.</p>
//         </div>
//         <div className="border-t border-gray-100 px-5 py-4">
//           <button
//             onClick={() => {
//               setAcceptedTerms(true);
//               setShowTermsModal(false);
//               toast.success('Terms accepted');
//             }}
//             className="w-full rounded-full bg-amber-600 py-3 text-white font-semibold hover:bg-amber-700 transition-all"
//           >
//             I Accept
//           </button>
//         </div>
//       </div>
//     </div>
//   );

//   // Debug: Log current table statuses
//   console.log('Current table statuses:', tableStatuses);
//   console.log('Available tables:', availableTables);

//   return (
//     <div className="min-h-screen bg-white">
//       <header className="border-b border-gray-100 bg-white sticky top-0 z-50">
//         <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
//           <Link to="/" className="flex items-center gap-2">
//             <img
//               src="https://rollercoastercafe.com/assets/images/roller_logo.png"
//               alt="Logo"
//               className="h-8 w-8 rounded-full object-cover"
//             />
//             <span className="font-semibold text-lg text-gray-800">Roller Coaster Cafe</span>
//           </Link>
//           <Link to="/" className="text-sm text-gray-500 hover:text-amber-600">Back to Home</Link>
//         </div>
//       </header>

//       <main className="max-w-5xl mx-auto px-4 py-8">
//         <div className="text-center mb-8">
//           <h1 className="text-3xl font-bold text-gray-800">Reserve Your Table</h1>
//           <p className="text-gray-500 mt-2">Choose an available table. Staff updates availability live.</p>
//         </div>

//         <div className="grid gap-6 lg:grid-cols-[1.2fr,0.8fr]">
//           <section className="rounded-2xl border border-gray-100 bg-white p-6 shadow-lg">
//             <div className="space-y-5">
//               {/* Guest Count */}
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">Number of Guests</label>
//                 <select
//                   value={guestCount}
//                   onChange={(e) => {
//                     setGuestCount(Number(e.target.value));
//                     setSelectedTable(null);
//                     setBookingConfirmed(false);
//                   }}
//                   className="w-full rounded-lg border border-gray-200 px-4 py-3 focus:border-amber-500 focus:outline-none"
//                 >
//                   {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
//                     <option key={num} value={num}>{num} {num === 1 ? 'Guest' : 'Guests'}</option>
//                   ))}
//                 </select>
//               </div>

//               {/* Live Table Status */}
//               <div className="rounded-xl border border-gray-100 bg-[#faf8f5] p-4">
//                 <div className="flex items-center justify-between gap-3 mb-3">
//                   <div>
//                     <p className="text-sm font-semibold text-gray-800">Live table status</p>
//                     <p className="text-xs text-gray-500">Staff updates these states live from the panel</p>
//                   </div>
//                   <span className="rounded-full bg-white px-3 py-1 text-xs font-medium text-gray-600 border border-gray-200">
//                     {availableTables.length} open / {bookedTables.length} booked
//                   </span>
//                 </div>

//                 {/* Table Grid */}
//                 {availableTables.length === 0 ? (
//                   <div className="text-center py-8">
//                     <p className="text-gray-500">No tables available for {guestCount} guests</p>
//                     <p className="text-sm text-gray-400 mt-2">Try selecting a different number of guests</p>
//                   </div>
//                 ) : (
//                   <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
//                     {availableTables.map((table) => {
//                       const isSelected = selectedTable?.number === table.number;
                      
//                       return (
//                         <button
//                           key={table.number}
//                           type="button"
//                           onClick={() => {
//                             setSelectedTable(table);
//                             setBookingConfirmed(false);
//                             setShowGuestForm(false);
//                           }}
//                           className={`rounded-xl border-2 p-3 text-left transition-all ${
//                             isSelected
//                               ? 'border-amber-500 bg-amber-50'
//                               : 'border-emerald-200 bg-emerald-50 hover:border-amber-300 cursor-pointer'
//                           }`}
//                         >
//                           <p className="font-semibold">Table {table.number}</p>
//                           <p className="text-xs mt-1">Up to {table.capacity} guests</p>
//                           <p className="text-xs mt-2 text-green-600">Available now</p>
//                         </button>
//                       );
//                     })}
//                   </div>
//                 )}

//                 {/* Last updated */}
//                 <p className="text-xs text-gray-400 mt-3 text-right">
//                   Last updated: {new Date().toLocaleTimeString()}
//                 </p>
//               </div>

//               {/* Terms Acceptance */}
//               <div className="flex items-center gap-3">
//                 <input
//                   id="dinein-terms"
//                   type="checkbox"
//                   checked={acceptedTerms}
//                   onChange={(e) => setAcceptedTerms(e.target.checked)}
//                   className="w-4 h-4 rounded border-gray-300 text-amber-600 focus:ring-amber-500"
//                 />
//                 <label htmlFor="dinein-terms" className="text-sm text-gray-600">
//                   I agree to the{' '}
//                   <button type="button" onClick={() => setShowTermsModal(true)} className="text-amber-600 hover:underline">
//                     dine-in terms and conditions
//                   </button>
//                 </label>
//               </div>

//               {/* Guest Information Form for non-logged in users */}
//               {!isAuthenticated && showGuestForm && selectedTable && (
//                 <div className="space-y-3 mt-4 p-4 border border-amber-200 rounded-xl bg-amber-50">
//                   <p className="text-sm font-medium text-amber-800">Guest Information</p>
//                   <p className="text-xs text-amber-600 mb-2">Please provide your details to confirm the booking</p>
//                   <input
//                     type="text"
//                     value={guestName}
//                     onChange={(e) => setGuestName(e.target.value)}
//                     placeholder="Your Name *"
//                     className="w-full rounded-lg border border-amber-200 p-2 text-sm focus:border-amber-500 focus:outline-none"
//                     required
//                   />
//                   <input
//                     type="tel"
//                     value={guestPhone}
//                     onChange={(e) => setGuestPhone(e.target.value)}
//                     placeholder="Phone Number *"
//                     className="w-full rounded-lg border border-amber-200 p-2 text-sm focus:border-amber-500 focus:outline-none"
//                     required
//                   />
//                   <p className="text-xs text-amber-600">We'll use this to contact you about your table booking</p>
//                 </div>
//               )}

//               <button
//                 onClick={handleConfirmTable}
//                 disabled={!selectedTable || !acceptedTerms || availableTables.length === 0}
//                 className="w-full rounded-full bg-amber-600 py-3 text-white font-semibold hover:bg-amber-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
//               >
//                 Confirm Table Booking
//               </button>

//               {/* Booking Confirmation */}
//               {bookingConfirmed && selectedTable && (
//                 <div className="space-y-4 rounded-xl border border-green-200 bg-green-50 p-4">
//                   <div className="flex items-center justify-between gap-3 flex-wrap">
//                     <div>
//                       <p className="text-sm font-semibold text-green-800">Table {selectedTable.number} booked for {guestCount} guests.</p>
//                       <p className="text-xs text-green-700 mt-1">Arrive within 15 minutes. Staff will hold this table for you.</p>
//                     </div>
//                     <button
//                       onClick={copyTableInfo}
//                       className="inline-flex items-center gap-1.5 rounded-lg bg-white px-3 py-2 text-sm text-green-700 hover:bg-green-100 transition-all"
//                     >
//                       {copied ? <Check size={14} /> : <Copy size={14} />}
//                       {copied ? 'Copied' : 'Copy Info'}
//                     </button>
//                   </div>

//                   <div className="rounded-xl border border-[#e8e0d6] bg-white p-4">
//                     <h3 className="font-semibold text-gray-800">Would you like to order for dine-in now?</h3>
//                     <p className="mt-1 text-sm text-gray-500">
//                       If yes, the menu will open directly in dine-in mode for your booked table.
//                     </p>
//                     <div className="mt-4 flex flex-wrap gap-3">
//                       <button
//                         onClick={handleOrderForDineIn}
//                         className="inline-flex items-center gap-2 rounded-full bg-amber-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-amber-700 transition-all"
//                       >
//                         <UtensilsCrossed size={15} />
//                         Order for Dine-In
//                       </button>
//                       <Link
//                         to="/"
//                         className="inline-flex items-center gap-2 rounded-full border border-gray-200 px-5 py-2.5 text-sm font-semibold text-gray-600 hover:border-amber-500 hover:text-amber-600 transition-all"
//                       >
//                         Maybe Later
//                         <ArrowRight size={14} />
//                       </Link>
//                     </div>
//                   </div>
//                 </div>
//               )}
//             </div>
//           </section>

//           <aside className="space-y-4">
//             <div className="rounded-2xl border border-gray-100 bg-[#faf8f5] p-5">
//               <h3 className="font-semibold text-gray-800">Dine-In Information</h3>
//               <div className="mt-4 space-y-3 text-sm text-gray-600">
//                 <div className="flex items-center gap-2"><Coffee size={14} className="text-amber-600" /> Complimentary water service</div>
//                 <div className="flex items-center gap-2"><Wifi size={14} className="text-amber-600" /> Free WiFi available</div>
//                 <div className="flex items-center gap-2"><Music size={14} className="text-amber-600" /> Live music on weekends</div>
//                 <div className="flex items-center gap-2"><Clock size={14} className="text-amber-600" /> Table held for 15 minutes</div>
//               </div>
//             </div>
            
//             {!isAuthenticated && !showGuestForm && selectedTable && acceptedTerms && (
//               <div className="rounded-2xl border border-blue-100 bg-blue-50 p-4">
//                 <p className="text-sm text-blue-700">
//                   You're booking as a guest. Please continue to provide your contact information.
//                 </p>
//               </div>
//             )}
//           </aside>
//         </div>
//       </main>

//       {showTermsModal && <TermsModal />}
//     </div>
//   );
// }

import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AlertCircle, ArrowRight, Check, Clock, Coffee, Copy, Music, Users, UtensilsCrossed, Wifi } from 'lucide-react';
import { useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { getOrderPreferences, saveOrderPreferences } from '../../utils/orderPreferences';
import api from '../../services/api';

const DEFAULT_TABLES = [
  { number: '1', capacity: 2, isAvailable: true, bookedBy: null, bookedPhone: null, bookedGuests: null, bookedAt: null },
  { number: '2', capacity: 4, isAvailable: true, bookedBy: null, bookedPhone: null, bookedGuests: null, bookedAt: null },
  { number: '3', capacity: 2, isAvailable: true, bookedBy: null, bookedPhone: null, bookedGuests: null, bookedAt: null },
  { number: '4', capacity: 6, isAvailable: true, bookedBy: null, bookedPhone: null, bookedGuests: null, bookedAt: null },
  { number: '5', capacity: 4, isAvailable: true, bookedBy: null, bookedPhone: null, bookedGuests: null, bookedAt: null },
  { number: '6', capacity: 8, isAvailable: true, bookedBy: null, bookedPhone: null, bookedGuests: null, bookedAt: null },
  { number: '7', capacity: 2, isAvailable: true, bookedBy: null, bookedPhone: null, bookedGuests: null, bookedAt: null },
  { number: '8', capacity: 4, isAvailable: true, bookedBy: null, bookedPhone: null, bookedGuests: null, bookedAt: null },
];

export default function DineInBookingPage() {
  const navigate = useNavigate();
  const existingPrefs = getOrderPreferences() || {};
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  const [guestCount, setGuestCount] = useState(existingPrefs.guestCount || 2);
  const [selectedTable, setSelectedTable] = useState(null);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [bookingConfirmed, setBookingConfirmed] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [copied, setCopied] = useState(false);
  const [tableStatuses, setTableStatuses] = useState(DEFAULT_TABLES);
  const [showGuestForm, setShowGuestForm] = useState(false);
  const [guestName, setGuestName] = useState('');
  const [guestPhone, setGuestPhone] = useState('');

  useEffect(() => {
    let isMounted = true;

    const loadTables = async () => {
      try {
        const { data } = await api.get('/tables/statuses');
        if (!isMounted) return;
        setTableStatuses(Array.isArray(data.tables) && data.tables.length ? data.tables : DEFAULT_TABLES);
      } catch (error) {
        if (isMounted) {
          setTableStatuses(DEFAULT_TABLES);
        }
      }
    };

    loadTables();
    const interval = setInterval(() => {
      loadTables();
    }, 10000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  const availableTables = useMemo(() => {
    return tableStatuses.filter((table) => table.isAvailable && table.capacity >= guestCount);
  }, [tableStatuses, guestCount]);

  const bookedTables = tableStatuses.filter((table) => !table.isAvailable);

  const handleConfirmTable = async () => {
    if (!selectedTable) {
      toast.error('Please select a table');
      return;
    }

    if (!acceptedTerms) {
      setShowTermsModal(true);
      return;
    }

    if (!isAuthenticated && !showGuestForm) {
      setShowGuestForm(true);
      return;
    }

    if (!isAuthenticated && (!guestName.trim() || !guestPhone.trim())) {
      toast.error('Please enter your name and phone number');
      return;
    }

    const customerName = isAuthenticated ? user?.name : guestName;
    const customerPhone = !isAuthenticated ? guestPhone : user?.phone;

    try {
      const { data } = await api.post(`/tables/${selectedTable.number}/book`, {
        customerName,
        customerPhone,
        guestCount,
      });
      setTableStatuses(Array.isArray(data.tables) && data.tables.length ? data.tables : DEFAULT_TABLES);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to reserve the table');
      return;
    }

    const bookingPrefs = {
      ...existingPrefs,
      deliveryMethod: 'dine-in',
      orderType: 'dine-in',
      isDineIn: true,
      tableNumber: selectedTable.number,
      guestCount,
      timestamp: new Date().toISOString(),
    };
    
    if (!isAuthenticated) {
      bookingPrefs.guestName = guestName;
      bookingPrefs.guestPhone = guestPhone;
    }
    
    saveOrderPreferences(bookingPrefs);
    setBookingConfirmed(true);
    toast.success(`Table ${selectedTable.number} booked for ${guestCount} guests!`);
  };

  const handleOrderForDineIn = () => {
    const bookingPrefs = {
      ...existingPrefs,
      deliveryMethod: 'dine-in',
      orderType: 'dine-in',
      isDineIn: true,
      tableNumber: selectedTable?.number,
      guestCount,
      timestamp: new Date().toISOString(),
    };
    
    if (!isAuthenticated) {
      bookingPrefs.guestName = guestName;
      bookingPrefs.guestPhone = guestPhone;
    }
    
    saveOrderPreferences(bookingPrefs);
    navigate('/menu?mode=dine-in');
  };

  const copyTableInfo = async () => {
    await navigator.clipboard.writeText(`Table ${selectedTable?.number} • ${guestCount} Guests • Roller Coaster Cafe`);
    setCopied(true);
    toast.success('Table info copied');
    setTimeout(() => setCopied(false), 1800);
  };

  const TermsModal = () => (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="w-full max-w-md rounded-2xl bg-white overflow-hidden">
        <div className="border-b border-gray-100 px-5 py-4">
          <h3 className="font-semibold text-lg text-gray-800">Dine-In Terms & Conditions</h3>
        </div>
        <div className="px-5 py-5 space-y-4 text-sm text-gray-600 max-h-[65vh] overflow-y-auto">
          <p><strong>1. Reservation Hold:</strong> Tables are held for 15 minutes from booking time.</p>
          <p><strong>2. Guest Count:</strong> Please select the correct guest count.</p>
          <p><strong>3. Table Assignment:</strong> Staff updates table availability live.</p>
          <p><strong>4. Ordering:</strong> After booking, you can order for your table.</p>
          <p><strong>5. Contact:</strong> For any issue, please contact the front desk.</p>
        </div>
        <div className="border-t border-gray-100 px-5 py-4">
          <button
            onClick={() => {
              setAcceptedTerms(true);
              setShowTermsModal(false);
              toast.success('Terms accepted');
            }}
            className="w-full rounded-full bg-amber-600 py-3 text-white font-semibold hover:bg-amber-700 transition-all"
          >
            I Accept
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-gray-100 bg-white sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <img
              src="https://rollercoastercafe.com/assets/images/roller_logo.png"
              alt="Logo"
              className="h-8 w-8 rounded-full object-cover"
            />
            <span className="font-semibold text-lg text-gray-800">Roller Coaster Cafe</span>
          </Link>
          <Link to="/" className="text-sm text-gray-500 hover:text-amber-600">Back to Home</Link>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Reserve Your Table</h1>
          <p className="text-gray-500 mt-2">Choose an available table. Staff updates availability live.</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.2fr,0.8fr]">
          <section className="rounded-2xl border border-gray-100 bg-white p-6 shadow-lg">
            <div className="space-y-5">
              {/* Guest Count */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Number of Guests</label>
                <select
                  value={guestCount}
                  onChange={(e) => {
                    setGuestCount(Number(e.target.value));
                    setSelectedTable(null);
                    setBookingConfirmed(false);
                  }}
                  className="w-full rounded-lg border border-gray-200 px-4 py-3 focus:border-amber-500 focus:outline-none"
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                    <option key={num} value={num}>{num} {num === 1 ? 'Guest' : 'Guests'}</option>
                  ))}
                </select>
              </div>

              {/* Live Table Status */}
              <div className="rounded-xl border border-gray-100 bg-[#faf8f5] p-4">
                <div className="flex items-center justify-between gap-3 mb-3">
                  <div>
                    <p className="text-sm font-semibold text-gray-800">Live table status</p>
                    <p className="text-xs text-gray-500">Staff updates these states live from the panel</p>
                  </div>
                  <span className="rounded-full bg-white px-3 py-1 text-xs font-medium text-gray-600 border border-gray-200">
                    {availableTables.length} open / {bookedTables.length} booked
                  </span>
                </div>

                {availableTables.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-500">No tables available for {guestCount} guests</p>
                    <p className="text-sm text-gray-400 mt-2">Try selecting a different number of guests</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {availableTables.map((table) => {
                      const isSelected = selectedTable?.number === table.number;
                      
                      return (
                        <button
                          key={table.number}
                          type="button"
                          onClick={() => {
                            setSelectedTable(table);
                            setBookingConfirmed(false);
                            setShowGuestForm(false);
                          }}
                          className={`rounded-xl border-2 p-3 text-left transition-all ${
                            isSelected
                              ? 'border-amber-500 bg-amber-50'
                              : 'border-emerald-200 bg-emerald-50 hover:border-amber-300 cursor-pointer'
                          }`}
                        >
                          <p className="font-semibold">Table {table.number}</p>
                          <p className="text-xs mt-1">Up to {table.capacity} guests</p>
                          <p className="text-xs mt-2 text-green-600">Available now</p>
                        </button>
                      );
                    })}
                  </div>
                )}

                <p className="text-xs text-gray-400 mt-3 text-right">
                  Last updated: {new Date().toLocaleTimeString()}
                </p>
              </div>

              {/* Terms Acceptance */}
              <div className="flex items-center gap-3">
                <input
                  id="dinein-terms"
                  type="checkbox"
                  checked={acceptedTerms}
                  onChange={(e) => setAcceptedTerms(e.target.checked)}
                  className="w-4 h-4 rounded border-gray-300 text-amber-600 focus:ring-amber-500"
                />
                <label htmlFor="dinein-terms" className="text-sm text-gray-600">
                  I agree to the{' '}
                  <button type="button" onClick={() => setShowTermsModal(true)} className="text-amber-600 hover:underline">
                    dine-in terms and conditions
                  </button>
                </label>
              </div>

              {/* Guest Information Form for non-logged in users */}
              {!isAuthenticated && showGuestForm && selectedTable && (
                <div className="space-y-3 mt-4 p-4 border border-amber-200 rounded-xl bg-amber-50">
                  <p className="text-sm font-medium text-amber-800">Guest Information</p>
                  <p className="text-xs text-amber-600 mb-2">Please provide your details to confirm the booking</p>
                  <input
                    type="text"
                    value={guestName}
                    onChange={(e) => setGuestName(e.target.value)}
                    placeholder="Your Name *"
                    className="w-full rounded-lg border border-amber-200 p-2 text-sm focus:border-amber-500 focus:outline-none"
                    required
                  />
                  <input
                    type="tel"
                    value={guestPhone}
                    onChange={(e) => setGuestPhone(e.target.value)}
                    placeholder="Phone Number *"
                    className="w-full rounded-lg border border-amber-200 p-2 text-sm focus:border-amber-500 focus:outline-none"
                    required
                  />
                  <p className="text-xs text-amber-600">We'll use this to contact you about your table booking</p>
                </div>
              )}

              <button
                onClick={handleConfirmTable}
                disabled={!selectedTable || !acceptedTerms || availableTables.length === 0}
                className="w-full rounded-full bg-amber-600 py-3 text-white font-semibold hover:bg-amber-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Confirm Table Booking
              </button>

              {/* Booking Confirmation */}
              {bookingConfirmed && selectedTable && (
                <div className="space-y-4 rounded-xl border border-green-200 bg-green-50 p-4">
                  <div className="flex items-center justify-between gap-3 flex-wrap">
                    <div>
                      <p className="text-sm font-semibold text-green-800">Table {selectedTable.number} booked for {guestCount} guests.</p>
                      <p className="text-xs text-green-700 mt-1">Arrive within 15 minutes. Staff will hold this table for you.</p>
                    </div>
                    <button
                      onClick={copyTableInfo}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-white px-3 py-2 text-sm text-green-700 hover:bg-green-100 transition-all"
                    >
                      {copied ? <Check size={14} /> : <Copy size={14} />}
                      {copied ? 'Copied' : 'Copy Info'}
                    </button>
                  </div>

                  <div className="rounded-xl border border-[#e8e0d6] bg-white p-4">
                    <h3 className="font-semibold text-gray-800">Would you like to order for dine-in now?</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      If yes, the menu will open directly in dine-in mode for your booked table.
                    </p>
                    <div className="mt-4 flex flex-wrap gap-3">
                      <button
                        onClick={handleOrderForDineIn}
                        className="inline-flex items-center gap-2 rounded-full bg-amber-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-amber-700 transition-all"
                      >
                        <UtensilsCrossed size={15} />
                        Order for Dine-In
                      </button>
                      <Link
                        to="/"
                        className="inline-flex items-center gap-2 rounded-full border border-gray-200 px-5 py-2.5 text-sm font-semibold text-gray-600 hover:border-amber-500 hover:text-amber-600 transition-all"
                      >
                        Maybe Later
                        <ArrowRight size={14} />
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </section>

          <aside className="space-y-4">
            <div className="rounded-2xl border border-gray-100 bg-[#faf8f5] p-5">
              <h3 className="font-semibold text-gray-800">Dine-In Information</h3>
              <div className="mt-4 space-y-3 text-sm text-gray-600">
                <div className="flex items-center gap-2"><Coffee size={14} className="text-amber-600" /> Complimentary water service</div>
                <div className="flex items-center gap-2"><Wifi size={14} className="text-amber-600" /> Free WiFi available</div>
                <div className="flex items-center gap-2"><Music size={14} className="text-amber-600" /> Live music on weekends</div>
                <div className="flex items-center gap-2"><Clock size={14} className="text-amber-600" /> Table held for 15 minutes</div>
              </div>
            </div>
            
            {!isAuthenticated && !showGuestForm && selectedTable && acceptedTerms && (
              <div className="rounded-2xl border border-blue-100 bg-blue-50 p-4">
                <p className="text-sm text-blue-700">
                  You're booking as a guest. Please continue to provide your contact information.
                </p>
              </div>
            )}
          </aside>
        </div>
      </main>

      {showTermsModal && <TermsModal />}
    </div>
  );
}
