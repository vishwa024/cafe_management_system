// // import { useEffect, useMemo, useState } from 'react';
// // import { Truck, ShoppingBag, CalendarDays, Clock3, Eye, ChevronRight } from 'lucide-react';

// // const BASE_OPTIONS = [
// //   {
// //     key: 'delivery',
// //     title: 'Delivery',
// //     desc: 'Food delivered to your door',
// //     icon: Truck,
// //     iconWrap: 'bg-blue-50 text-blue-600',
// //     border: 'hover:border-blue-300',
// //   },
// //   {
// //     key: 'takeaway',
// //     title: 'Takeaway',
// //     desc: 'Pick up from our cafe',
// //     icon: ShoppingBag,
// //     iconWrap: 'bg-emerald-50 text-emerald-600',
// //     border: 'hover:border-emerald-300',
// //   },
// //   {
// //     key: 'pre-order',
// //     title: 'Pre-Order',
// //     desc: 'Schedule for later',
// //     icon: CalendarDays,
// //     iconWrap: 'bg-violet-50 text-violet-600',
// //     border: 'hover:border-violet-300',
// //   },
// // ];

// // function buildFlowOptions(method) {
// //   if (method === 'delivery') {
// //     return {
// //       title: 'Delivery options',
// //       subtitle: 'Choose whether you want food now or scheduled for later.',
// //       options: [
// //         {
// //           key: 'delivery-now',
// //           title: 'Order for now',
// //           desc: 'Place a delivery order right now.',
// //           icon: Truck,
// //           iconWrap: 'bg-blue-50 text-blue-600',
// //           border: 'hover:border-blue-300',
// //           payload: { deliveryMethod: 'delivery', orderType: 'delivery', isPreOrder: false, preOrderMethod: '' },
// //         },
// //         {
// //           key: 'pre-delivery',
// //           title: 'Pre-order delivery',
// //           desc: 'Schedule a delivery for later today.',
// //           icon: Clock3,
// //           iconWrap: 'bg-violet-50 text-violet-600',
// //           border: 'hover:border-violet-300',
// //           payload: { deliveryMethod: 'pre-order', orderType: 'delivery', isPreOrder: true, preOrderMethod: 'delivery' },
// //         },
// //       ],
// //     };
// //   }

// //   if (method === 'takeaway') {
// //     return {
// //       title: 'Takeaway options',
// //       subtitle: 'Choose whether you want to pick up now or schedule your pickup.',
// //       options: [
// //         {
// //           key: 'takeaway-now',
// //           title: 'Order for pickup now',
// //           desc: 'Place a takeaway order for immediate pickup.',
// //           icon: ShoppingBag,
// //           iconWrap: 'bg-emerald-50 text-emerald-600',
// //           border: 'hover:border-emerald-300',
// //           payload: { deliveryMethod: 'takeaway', orderType: 'takeaway', isPreOrder: false, preOrderMethod: '' },
// //         },
// //         {
// //           key: 'pre-takeaway',
// //           title: 'Pre-order takeaway',
// //           desc: 'Schedule your pickup for a later time.',
// //           icon: Clock3,
// //           iconWrap: 'bg-violet-50 text-violet-600',
// //           border: 'hover:border-violet-300',
// //           payload: { deliveryMethod: 'pre-order', orderType: 'takeaway', isPreOrder: true, preOrderMethod: 'takeaway' },
// //         },
// //       ],
// //     };
// //   }

// //   if (method === 'pre-order') {
// //     return {
// //       title: 'Choose your pre-order type',
// //       subtitle: 'Pick how you want your scheduled order to be fulfilled.',
// //       options: [
// //         {
// //           key: 'pre-delivery-main',
// //           title: 'Pre-order delivery',
// //           desc: 'Schedule a delivery for later.',
// //           icon: Truck,
// //           iconWrap: 'bg-blue-50 text-blue-600',
// //           border: 'hover:border-blue-300',
// //           payload: { deliveryMethod: 'pre-order', orderType: 'delivery', isPreOrder: true, preOrderMethod: 'delivery' },
// //         },
// //         {
// //           key: 'pre-takeaway-main',
// //           title: 'Pre-order takeaway',
// //           desc: 'Schedule a pickup for later.',
// //           icon: ShoppingBag,
// //           iconWrap: 'bg-emerald-50 text-emerald-600',
// //           border: 'hover:border-emerald-300',
// //           payload: { deliveryMethod: 'pre-order', orderType: 'takeaway', isPreOrder: true, preOrderMethod: 'takeaway' },
// //         },
// //         {
// //           key: 'pre-dinein-main',
// //           title: 'Pre-order dine-in',
// //           desc: 'Book a table and schedule your dine-in order.',
// //           icon: CalendarDays,
// //           iconWrap: 'bg-amber-50 text-amber-600',
// //           border: 'hover:border-amber-300',
// //           payload: { deliveryMethod: 'pre-order', orderType: 'dine-in', isPreOrder: true, preOrderMethod: 'dine-in' },
// //         },
// //       ],
// //     };
// //   }

// //   return {
// //     title: 'How do you want to receive your order?',
// //     subtitle: 'Select the flow that matches how you want to order today.',
// //     options: BASE_OPTIONS.map((option) => ({
// //       ...option,
// //       payload: option.key === 'delivery'
// //         ? { deliveryMethod: 'delivery' }
// //         : option.key === 'takeaway'
// //           ? { deliveryMethod: 'takeaway' }
// //           : { deliveryMethod: 'pre-order' },
// //     })),
// //   };
// // }

// // export default function OrderTypeSelector({ onComplete, onBack, initialData = null }) {
// //   const [selectedMethod, setSelectedMethod] = useState(initialData?.deliveryMethod || '');

// //   useEffect(() => {
// //     setSelectedMethod(initialData?.deliveryMethod || '');
// //   }, [initialData?.deliveryMethod]);

// //   const config = useMemo(() => buildFlowOptions(selectedMethod), [selectedMethod]);

// //   const handleOptionClick = (payload) => {
// //     if (selectedMethod) {
// //       onComplete(payload);
// //       return;
// //     }

// //     if (payload.deliveryMethod === 'delivery') {
// //       setSelectedMethod('delivery');
// //       return;
// //     }

// //     if (payload.deliveryMethod === 'takeaway') {
// //       setSelectedMethod('takeaway');
// //       return;
// //     }

// //     if (payload.deliveryMethod === 'pre-order') {
// //       setSelectedMethod('pre-order');
// //     }
// //   };

// //   const handleBackClick = () => {
// //     if (selectedMethod && typeof onBack === 'function') {
// //       onBack(selectedMethod);
// //       return;
// //     }

// //     if (selectedMethod) {
// //       setSelectedMethod('');
// //       return;
// //     }

// //     if (typeof onBack === 'function') {
// //       onBack('');
// //     }
// //   };

// //   return (
// //     <div className="space-y-6">
// //       <div className="text-center">
// //         <h1 className="text-[1.02rem] md:text-[1.12rem] font-bold tracking-tight text-[#1d2d3c]">{config.title}</h1>
// //         <p className="mt-1 text-[12px] md:text-[13px] text-[#6b5f54]">{config.subtitle}</p>
// //       </div>

// //       <div className="space-y-3">
// //         {config.options.map((option) => {
// //           const Icon = option.icon;
// //           return (
// //             <button
// //               key={option.key}
// //               type="button"
// //               onClick={() => handleOptionClick(option.payload)}
// //               className={`w-full rounded-[20px] border border-[#e7d9c9] bg-white px-4 py-3.5 text-left transition-all hover:-translate-y-0.5 hover:shadow-lg ${option.border}`}
// //             >
// //               <div className="flex items-center gap-4">
// //                 <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${option.iconWrap}`}>
// //                   <Icon size={18} />
// //                 </div>
// //                 <div className="min-w-0 flex-1">
// //                   <p className="text-[0.86rem] md:text-[0.94rem] font-semibold text-[#1d2d3c]">{option.title}</p>
// //                   <p className="mt-1 text-[12px] md:text-[13px] text-[#6b5f54]">{option.desc}</p>
// //                 </div>
// //                 <ChevronRight className="shrink-0 text-[#b97844]" size={18} />
// //               </div>
// //             </button>
// //           );
// //         })}
// //       </div>

// //       {!selectedMethod ? (
// //         <button
// //           type="button"
// //           onClick={() => onComplete({ browseOnly: true })}
// //           className="flex w-full items-center justify-center gap-3 rounded-full border border-[#e7d9c9] bg-white px-6 py-3 text-[14px] font-medium text-[#4b3a2e] transition-all hover:border-[#b97844] hover:text-[#b97844]"
// //         >
// //           <Eye size={18} />
// //           Just view menu first
// //         </button>
// //       ) : (
// //         <button
// //           type="button"
// //           onClick={handleBackClick}
// //           className="flex w-full items-center justify-center gap-3 rounded-full border border-[#e7d9c9] bg-white px-6 py-3 text-[14px] font-medium text-[#4b3a2e] transition-all hover:border-[#b97844] hover:text-[#b97844]"
// //         >
// //           Back
// //         </button>
// //       )}
// //     </div>
// //   );
// // }
// import { useState, useEffect } from 'react';
// import { Truck, ShoppingBag, Table2, CalendarDays, Clock, ArrowRight, ChevronRight } from 'lucide-react';
// import { useSearchParams } from 'react-router-dom';

// const ORDER_NOW_OPTIONS = [
//   { 
//     value: 'delivery', 
//     label: 'Delivery', 
//     desc: 'Get it delivered to your door',
//     icon: Truck,
//     color: 'bg-blue-50 text-blue-600',
//   },
//   { 
//     value: 'takeaway', 
//     label: 'Takeaway', 
//     desc: 'Pick up from our cafe',
//     icon: ShoppingBag,
//     color: 'bg-violet-50 text-violet-600',
//   },
//   { 
//     value: 'dine-in', 
//     label: 'Dine-In', 
//     desc: 'Enjoy at our cafe',
//     icon: Table2,
//     color: 'bg-emerald-50 text-emerald-600',
//   },
// ];

// const PREORDER_OPTIONS = [
//   { 
//     value: 'delivery', 
//     label: 'Pre-order Delivery', 
//     desc: 'Schedule a delivery for later',
//     icon: Truck,
//     color: 'bg-orange-50 text-orange-600',
//   },
//   { 
//     value: 'takeaway', 
//     label: 'Pre-order Takeaway', 
//     desc: 'Schedule a pickup for later',
//     icon: ShoppingBag,
//     color: 'bg-amber-50 text-amber-600',
//   },
//   { 
//     value: 'dine-in', 
//     label: 'Pre-order Dine-In', 
//     desc: 'Book a table and schedule your dine-in order',
//     icon: Table2,
//     color: 'bg-purple-50 text-purple-600',
//   },
// ];

// const PREORDER_FEE = 49;

// export default function OrderTypeSelector({ onComplete, onBack, initialData = null }) {
//   const [searchParams] = useSearchParams();
//   const preselectPreOrder = searchParams.get('preselect') === 'pre-order';
  
//   const [step, setStep] = useState(() => {
//     if (preselectPreOrder) return 2;
//     return 1;
//   });
//   const [selectedPreOrderType, setSelectedPreOrderType] = useState(null);
//   const [scheduledTime, setScheduledTime] = useState('');
//   const [tableNumber, setTableNumber] = useState('');
//   const [guestCount, setGuestCount] = useState(2);

//   useEffect(() => {
//     if (initialData?.deliveryMethod === 'pre-order') {
//       setStep(2);
//       if (initialData.preOrderMethod) {
//         setSelectedPreOrderType(initialData.preOrderMethod);
//         setStep(3);
//         if (initialData.scheduledDateTime) {
//           setScheduledTime(initialData.scheduledDateTime);
//         }
//         if (initialData.tableNumber) {
//           setTableNumber(initialData.tableNumber);
//         }
//         if (initialData.guestCount) {
//           setGuestCount(initialData.guestCount);
//         }
//       }
//     }
//   }, [initialData]);

//   // Step 1: Choose between Order Now or Pre-Order
//   if (step === 1) {
//     return (
//       <div className="min-h-screen bg-white">
//         <div className="max-w-2xl mx-auto px-4 py-8">
//           <div className="mb-8">
//             <h1 className="text-2xl font-bold text-[#3f3328]">How would you like to order?</h1>
//             <p className="text-sm text-[#6b5f54] mt-1">Choose delivery now or schedule for later.</p>
//           </div>

//           <div className="space-y-4">
//             {/* Order Now Section */}
//             <div>
//               <div className="flex items-center gap-2 mb-3">
//                 <Clock size={18} className="text-green-600" />
//                 <h3 className="font-semibold text-[#3f3328]">Order now</h3>
//               </div>
//               <div className="grid gap-3">
//                 {ORDER_NOW_OPTIONS.map((option) => (
//                   <button
//                     key={option.value}
//                     onClick={() => onComplete({
//                       deliveryMethod: option.value,
//                       orderType: option.value,
//                       isPreOrder: false,
//                       preOrderMethod: null,
//                       scheduledDateTime: null,
//                       tableNumber: null,
//                       guestCount: null,
//                     })}
//                     className="w-full p-4 rounded-xl border-2 border-[#e8e0d6] text-left hover:border-[#b97844] hover:bg-[#faf8f5] transition-all group"
//                   >
//                     <div className="flex items-center gap-4">
//                       <div className={`w-12 h-12 rounded-full ${option.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
//                         <option.icon size={20} />
//                       </div>
//                       <div className="flex-1">
//                         <p className="font-semibold text-[#3f3328]">{option.label}</p>
//                         <p className="text-sm text-[#6b5f54]">{option.desc}</p>
//                       </div>
//                       <ChevronRight size={18} className="text-[#a0968c] group-hover:text-[#b97844]" />
//                     </div>
//                   </button>
//                 ))}
//               </div>
//             </div>

//             {/* Pre-order Section */}
//             <div>
//               <div className="flex items-center gap-2 mb-3 mt-6">
//                 <CalendarDays size={18} className="text-amber-600" />
//                 <h3 className="font-semibold text-[#3f3328]">Schedule for later</h3>
//               </div>
//               <button
//                 onClick={() => setStep(2)}
//                 className="w-full p-4 rounded-xl border-2 border-[#e8e0d6] text-left hover:border-[#b97844] hover:bg-[#faf8f5] transition-all group"
//               >
//                 <div className="flex items-center gap-4">
//                   <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center group-hover:scale-110 transition-transform">
//                     <CalendarDays size={20} />
//                   </div>
//                   <div className="flex-1">
//                     <p className="font-semibold text-[#3f3328]">Pre-order</p>
//                     <p className="text-sm text-[#6b5f54]">Schedule your order for a later time</p>
//                     <p className="text-xs text-amber-600 mt-1">+ ₹{PREORDER_FEE} priority fee</p>
//                   </div>
//                   <ChevronRight size={18} className="text-[#a0968c] group-hover:text-[#b97844]" />
//                 </div>
//               </button>
//             </div>
//           </div>

//           <button
//             type="button"
//             onClick={() => onComplete({ browseOnly: true })}
//             className="mt-6 flex w-full items-center justify-center gap-3 rounded-full border border-[#e7d9c9] bg-white px-6 py-3 text-[14px] font-medium text-[#4b3a2e] transition-all hover:border-[#b97844] hover:text-[#b97844]"
//           >
//             Just view menu first
//           </button>
//         </div>
//       </div>
//     );
//   }

//   // Step 2: Choose Pre-order Type
//   if (step === 2 && !selectedPreOrderType) {
//     return (
//       <div className="min-h-screen bg-white">
//         <div className="max-w-2xl mx-auto px-4 py-8">
//           <div className="mb-8">
//             <button
//               onClick={() => setStep(1)}
//               className="inline-flex items-center gap-1 text-sm text-[#6b5f54] hover:text-[#b97844] transition-colors mb-4"
//             >
//               ← Back
//             </button>
//             <h1 className="text-2xl font-bold text-[#3f3328]">Choose your pre-order type</h1>
//             <p className="text-sm text-[#6b5f54] mt-1">Pick how you want your scheduled order to be fulfilled.</p>
//           </div>

//           <div className="space-y-3">
//             {PREORDER_OPTIONS.map((option) => (
//               <button
//                 key={option.value}
//                 onClick={() => {
//                   setSelectedPreOrderType(option.value);
//                   setStep(3);
//                 }}
//                 className="w-full p-4 rounded-xl border-2 border-[#e8e0d6] text-left hover:border-[#b97844] hover:bg-[#faf8f5] transition-all group"
//               >
//                 <div className="flex items-center gap-4">
//                   <div className={`w-12 h-12 rounded-full ${option.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
//                     <option.icon size={20} />
//                   </div>
//                   <div className="flex-1">
//                     <p className="font-semibold text-[#3f3328]">{option.label}</p>
//                     <p className="text-sm text-[#6b5f54]">{option.desc}</p>
//                   </div>
//                   <ChevronRight size={18} className="text-[#a0968c] group-hover:text-[#b97844]" />
//                 </div>
//               </button>
//             ))}
//           </div>

//           <button
//             type="button"
//             onClick={() => onComplete({ browseOnly: true })}
//             className="mt-6 flex w-full items-center justify-center gap-3 rounded-full border border-[#e7d9c9] bg-white px-6 py-3 text-[14px] font-medium text-[#4b3a2e] transition-all hover:border-[#b97844] hover:text-[#b97844]"
//           >
//             Just view menu first
//           </button>
//         </div>
//       </div>
//     );
//   }

//   // Step 3: Schedule Time & Details
//   const getMinDateTime = () => {
//     const date = new Date();
//     date.setMinutes(date.getMinutes() + 30);
//     return date.toISOString().slice(0, 16);
//   };

//   const handleComplete = () => {
//     if (!scheduledTime) {
//       return;
//     }
//     if (selectedPreOrderType === 'dine-in' && !tableNumber) {
//       return;
//     }
    
//     onComplete({
//       deliveryMethod: 'pre-order',
//       orderType: selectedPreOrderType,
//       isPreOrder: true,
//       preOrderMethod: selectedPreOrderType,
//       scheduledDateTime: scheduledTime,
//       tableNumber: selectedPreOrderType === 'dine-in' ? tableNumber : null,
//       guestCount: selectedPreOrderType === 'dine-in' ? guestCount : null,
//       preOrderFee: PREORDER_FEE,
//     });
//   };

//   return (
//     <div className="min-h-screen bg-white">
//       <div className="max-w-2xl mx-auto px-4 py-8">
//         <div className="mb-8">
//           <button
//             onClick={() => {
//               setSelectedPreOrderType(null);
//               setStep(2);
//               setScheduledTime('');
//               setTableNumber('');
//             }}
//             className="inline-flex items-center gap-1 text-sm text-[#6b5f54] hover:text-[#b97844] transition-colors mb-4"
//           >
//             ← Back
//           </button>
//           <h1 className="text-2xl font-bold text-[#3f3328]">Schedule your pre-order</h1>
//           <p className="text-sm text-[#6b5f54] mt-1">Select when you'd like your order ready.</p>
//         </div>

//         <div className="space-y-5">
//           <div>
//             <label className="block text-sm font-medium text-[#3f3328] mb-2">
//               Select pickup/delivery time
//             </label>
//             <input
//               type="datetime-local"
//               value={scheduledTime}
//               onChange={(e) => setScheduledTime(e.target.value)}
//               min={getMinDateTime()}
//               className="w-full rounded-lg border border-[#e8e0d6] p-3 text-sm focus:border-[#b97844] focus:outline-none"
//             />
//             <p className="text-xs text-[#6b5f54] mt-1">
//               Minimum 30 minutes advance booking required
//             </p>
//           </div>

//           {selectedPreOrderType === 'dine-in' && (
//             <>
//               <div>
//                 <label className="block text-sm font-medium text-[#3f3328] mb-2">
//                   Table Number
//                 </label>
//                 <input
//                   type="text"
//                   value={tableNumber}
//                   onChange={(e) => setTableNumber(e.target.value)}
//                   placeholder="e.g., Table 5 or Outdoor"
//                   className="w-full rounded-lg border border-[#e8e0d6] p-3 text-sm focus:border-[#b97844] focus:outline-none"
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-[#3f3328] mb-2">
//                   Number of Guests
//                 </label>
//                 <select
//                   value={guestCount}
//                   onChange={(e) => setGuestCount(Number(e.target.value))}
//                   className="w-full rounded-lg border border-[#e8e0d6] p-3 text-sm focus:border-[#b97844] focus:outline-none"
//                 >
//                   {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
//                     <option key={num} value={num}>{num} {num === 1 ? 'Guest' : 'Guests'}</option>
//                   ))}
//                 </select>
//               </div>
//             </>
//           )}

//           <div className="bg-amber-50 rounded-xl p-4 border border-amber-200">
//             <div className="flex items-center justify-between mb-2">
//               <span className="text-sm text-[#6b5f54]">Pre-order priority fee</span>
//               <span className="font-semibold text-[#b97844]">₹{PREORDER_FEE}</span>
//             </div>
//             <p className="text-xs text-amber-600">
//               This fee ensures your order is prepared exactly at your scheduled time.
//             </p>
//           </div>

//           <button
//             onClick={handleComplete}
//             disabled={!scheduledTime || (selectedPreOrderType === 'dine-in' && !tableNumber)}
//             className="w-full rounded-lg bg-[#b97844] py-3 text-white font-semibold hover:bg-[#9e6538] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
//           >
//             Confirm Pre-order
//             <ArrowRight size={16} />
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

import { useState, useEffect, useMemo } from 'react';
import { Truck, ShoppingBag, Table2, CalendarDays, Clock, ArrowRight, ChevronRight } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import api from '../../services/api';

const ORDER_NOW_OPTIONS = [
  { 
    value: 'delivery', 
    label: 'Delivery', 
    desc: 'Get it delivered to your door',
    icon: Truck,
    color: 'bg-blue-50 text-blue-600',
  },
  { 
    value: 'takeaway', 
    label: 'Takeaway', 
    desc: 'Pick up from our cafe',
    icon: ShoppingBag,
    color: 'bg-violet-50 text-violet-600',
  },
  { 
    value: 'dine-in', 
    label: 'Dine-In', 
    desc: 'Enjoy at our cafe',
    icon: Table2,
    color: 'bg-emerald-50 text-emerald-600',
  },
];

const PREORDER_OPTIONS = [
  { 
    value: 'delivery', 
    label: 'Pre-order Delivery', 
    desc: 'Schedule a delivery for later',
    icon: Truck,
    color: 'bg-orange-50 text-orange-600',
  },
  { 
    value: 'takeaway', 
    label: 'Pre-order Takeaway', 
    desc: 'Schedule a pickup for later',
    icon: ShoppingBag,
    color: 'bg-amber-50 text-amber-600',
  },
  { 
    value: 'dine-in', 
    label: 'Pre-order Dine-In', 
    desc: 'Book a table and schedule your dine-in order',
    icon: Table2,
    color: 'bg-purple-50 text-purple-600',
  },
];

const PREORDER_FEE = 49;

export default function OrderTypeSelector({ onComplete, onBack, initialData = null, separatePreOrderFlow = false }) {
  const [searchParams] = useSearchParams();
  const preselectPreOrder = searchParams.get('preselect') === 'pre-order';
  
  const [step, setStep] = useState(() => {
    if (preselectPreOrder) return 2;
    return 1;
  });
  const [selectedPreOrderType, setSelectedPreOrderType] = useState(null);
  const [scheduledTime, setScheduledTime] = useState('');
  const [tableNumber, setTableNumber] = useState('');
  const [guestCount, setGuestCount] = useState(2);
  const [tables, setTables] = useState([]);
  const [tablesLoading, setTablesLoading] = useState(false);

  const availableTables = useMemo(() => {
    return tables.filter((table) => {
      const seats = Number(table?.capacity || table?.seats || 0);
      const isAvailable = String(table?.status || '').toLowerCase() === 'available';
      return isAvailable && (!seats || seats >= guestCount);
    });
  }, [tables, guestCount]);

  useEffect(() => {
    if (initialData?.deliveryMethod === 'pre-order') {
      setStep(2);
      if (initialData.preOrderMethod) {
        setSelectedPreOrderType(initialData.preOrderMethod);
        setStep(3);
        if (initialData.scheduledDateTime) {
          setScheduledTime(initialData.scheduledDateTime);
        }
        if (initialData.tableNumber) {
          setTableNumber(initialData.tableNumber);
        }
        if (initialData.guestCount) {
          setGuestCount(initialData.guestCount);
        }
      }
    }
  }, [initialData]);

  useEffect(() => {
    if (selectedPreOrderType !== 'dine-in' || step !== 3) {
      return;
    }

    let cancelled = false;
    const loadTables = async () => {
      try {
        setTablesLoading(true);
        const response = await api.get('/tables/statuses');
        if (!cancelled) {
          setTables(response.data?.tables || []);
        }
      } catch (error) {
        if (!cancelled) {
          setTables([]);
        }
      } finally {
        if (!cancelled) {
          setTablesLoading(false);
        }
      }
    };

    loadTables();
    return () => {
      cancelled = true;
    };
  }, [selectedPreOrderType, step]);

  useEffect(() => {
    if (selectedPreOrderType !== 'dine-in' || !tableNumber) {
      return;
    }

    const stillAvailable = availableTables.some((table) => String(table.number) === String(tableNumber));
    if (!stillAvailable) {
      setTableNumber('');
    }
  }, [availableTables, selectedPreOrderType, tableNumber]);

  // Step 1: Choose between Order Now or Pre-Order
  if (step === 1) {
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-2xl mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-[#3f3328]">How would you like to order?</h1>
            <p className="text-sm text-[#6b5f54] mt-1">Choose delivery now or schedule for later.</p>
          </div>

          <div className="space-y-4">
            {/* Order Now Section */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Clock size={18} className="text-green-600" />
                <h3 className="font-semibold text-[#3f3328]">Order now</h3>
              </div>
              <div className="grid gap-3">
                {ORDER_NOW_OPTIONS.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => onComplete({
                      deliveryMethod: option.value,
                      orderType: option.value,
                      isPreOrder: false,
                      preOrderMethod: null,
                      scheduledDateTime: null,
                      tableNumber: null,
                      guestCount: null,
                    })}
                    className="w-full p-4 rounded-xl border-2 border-[#e8e0d6] text-left hover:border-[#b97844] hover:bg-[#faf8f5] transition-all group"
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-full ${option.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                        <option.icon size={20} />
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-[#3f3328]">{option.label}</p>
                        <p className="text-sm text-[#6b5f54]">{option.desc}</p>
                      </div>
                      <ChevronRight size={18} className="text-[#a0968c] group-hover:text-[#b97844]" />
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Pre-order Section */}
            <div>
              <div className="flex items-center gap-2 mb-3 mt-6">
                <CalendarDays size={18} className="text-amber-600" />
                <h3 className="font-semibold text-[#3f3328]">Schedule for later</h3>
              </div>
              <button
                onClick={() => {
                  if (separatePreOrderFlow) {
                    onComplete({
                      deliveryMethod: 'pre-order',
                      orderType: 'pre-order',
                      isPreOrder: true,
                      preOrderMethod: null,
                      scheduledDateTime: null,
                      tableNumber: null,
                      guestCount: null,
                    });
                    return;
                  }

                  setStep(2);
                }}
                className="w-full p-4 rounded-xl border-2 border-[#e8e0d6] text-left hover:border-[#b97844] hover:bg-[#faf8f5] transition-all group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <CalendarDays size={20} />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-[#3f3328]">Pre-order</p>
                    <p className="text-sm text-[#6b5f54]">Schedule your order for a later time</p>
                    <p className="text-xs text-amber-600 mt-1">+ ₹{PREORDER_FEE} priority fee</p>
                  </div>
                  <ChevronRight size={18} className="text-[#a0968c] group-hover:text-[#b97844]" />
                </div>
              </button>
            </div>
          </div>

          <button
            type="button"
            onClick={() => onComplete({ browseOnly: true })}
            className="mt-6 flex w-full items-center justify-center gap-3 rounded-full border border-[#e7d9c9] bg-white px-6 py-3 text-[14px] font-medium text-[#4b3a2e] transition-all hover:border-[#b97844] hover:text-[#b97844]"
          >
            Just view menu first
          </button>
        </div>
      </div>
    );
  }

  // Step 2: Choose Pre-order Type
  if (step === 2 && !selectedPreOrderType) {
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-2xl mx-auto px-4 py-8">
          <div className="mb-8">
            <button
              onClick={() => setStep(1)}
              className="inline-flex items-center gap-1 text-sm text-[#6b5f54] hover:text-[#b97844] transition-colors mb-4"
            >
              ← Back
            </button>
            <h1 className="text-2xl font-bold text-[#3f3328]">Choose your pre-order type</h1>
            <p className="text-sm text-[#6b5f54] mt-1">Pick how you want your scheduled order to be fulfilled.</p>
          </div>

          <div className="space-y-3">
            {PREORDER_OPTIONS.map((option) => (
              <button
                key={option.value}
                onClick={() => {
                  setSelectedPreOrderType(option.value);
                  setTableNumber('');
                  setStep(3);
                }}
                className="w-full p-4 rounded-xl border-2 border-[#e8e0d6] text-left hover:border-[#b97844] hover:bg-[#faf8f5] transition-all group"
              >
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-full ${option.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                    <option.icon size={20} />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-[#3f3328]">{option.label}</p>
                    <p className="text-sm text-[#6b5f54]">{option.desc}</p>
                  </div>
                  <ChevronRight size={18} className="text-[#a0968c] group-hover:text-[#b97844]" />
                </div>
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={() => onComplete({ browseOnly: true })}
            className="mt-6 flex w-full items-center justify-center gap-3 rounded-full border border-[#e7d9c9] bg-white px-6 py-3 text-[14px] font-medium text-[#4b3a2e] transition-all hover:border-[#b97844] hover:text-[#b97844]"
          >
            Just view menu first
          </button>
        </div>
      </div>
    );
  }

  // Step 3: Schedule Time & Details
  const getMinDateTime = () => {
    const date = new Date();
    date.setMinutes(date.getMinutes() + 30);
    return date.toISOString().slice(0, 16);
  };

  const handleComplete = () => {
    if (!scheduledTime) {
      return;
    }
    if (selectedPreOrderType === 'dine-in' && !tableNumber) {
      return;
    }
    
    onComplete({
      deliveryMethod: 'pre-order',
      orderType: selectedPreOrderType,
      isPreOrder: true,
      preOrderMethod: selectedPreOrderType,
      scheduledDateTime: scheduledTime,
      tableNumber: selectedPreOrderType === 'dine-in' ? tableNumber : null,
      guestCount: selectedPreOrderType === 'dine-in' ? guestCount : null,
      preOrderFee: PREORDER_FEE,
    });
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="mb-8">
          <button
            onClick={() => {
              setSelectedPreOrderType(null);
              setStep(2);
              setScheduledTime('');
              setTableNumber('');
            }}
            className="inline-flex items-center gap-1 text-sm text-[#6b5f54] hover:text-[#b97844] transition-colors mb-4"
          >
            ← Back
          </button>
          <h1 className="text-2xl font-bold text-[#3f3328]">Schedule your pre-order</h1>
          <p className="text-sm text-[#6b5f54] mt-1">Select when you'd like your order ready.</p>
        </div>

        <div className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-[#3f3328] mb-2">
              Select pickup/delivery time
            </label>
            <input
              type="datetime-local"
              value={scheduledTime}
              onChange={(e) => setScheduledTime(e.target.value)}
              min={getMinDateTime()}
              className="w-full rounded-lg border border-[#e8e0d6] p-3 text-sm focus:border-[#b97844] focus:outline-none"
            />
            <p className="text-xs text-[#6b5f54] mt-1">
              Minimum 30 minutes advance booking required
            </p>
          </div>

          {selectedPreOrderType === 'dine-in' && (
            <>
              <div>
                <label className="block text-sm font-medium text-[#3f3328] mb-2">
                  Number of Guests
                </label>
                <select
                  value={guestCount}
                  onChange={(e) => {
                    setGuestCount(Number(e.target.value));
                    setTableNumber('');
                  }}
                  className="w-full rounded-lg border border-[#e8e0d6] p-3 text-sm focus:border-[#b97844] focus:outline-none"
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                    <option key={num} value={num}>{num} {num === 1 ? 'Guest' : 'Guests'}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#3f3328] mb-2">
                  Available Tables
                </label>
                {tablesLoading ? (
                  <div className="rounded-lg border border-[#e8e0d6] bg-[#faf8f5] p-3 text-sm text-[#6b5f54]">
                    Loading table availability...
                  </div>
                ) : availableTables.length === 0 ? (
                  <div className="rounded-lg border border-[#f1c27d] bg-amber-50 p-3 text-sm text-amber-700">
                    No available tables match {guestCount} guest{guestCount === 1 ? '' : 's'} right now.
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-3">
                    {availableTables.map((table) => {
                      const tableId = String(table.number);
                      const isSelected = tableId === String(tableNumber);
                      const seats = Number(table.capacity || table.seats || 0);
                      return (
                        <button
                          key={tableId}
                          type="button"
                          onClick={() => setTableNumber(tableId)}
                          className={`rounded-xl border p-3 text-left transition-all ${
                            isSelected
                              ? 'border-[#b97844] bg-[#faf2ea]'
                              : 'border-[#e8e0d6] bg-white hover:border-[#b97844]'
                          }`}
                        >
                          <p className="font-semibold text-[#3f3328]">Table {table.number}</p>
                          <p className="text-xs text-[#6b5f54] mt-1">
                            {seats ? `${seats} seats` : 'Open table'}
                          </p>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </>
          )}

          <div className="bg-amber-50 rounded-xl p-4 border border-amber-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-[#6b5f54]">Pre-order priority fee</span>
              <span className="font-semibold text-[#b97844]">₹{PREORDER_FEE}</span>
            </div>
            <p className="text-xs text-amber-600">
              This fee ensures your order is prepared exactly at your scheduled time.
            </p>
          </div>

          <button
            onClick={handleComplete}
            disabled={!scheduledTime || (selectedPreOrderType === 'dine-in' && !tableNumber)}
            className="w-full rounded-lg bg-[#b97844] py-3 text-white font-semibold hover:bg-[#9e6538] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            Confirm Pre-order
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
