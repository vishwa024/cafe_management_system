// // import { useEffect, useMemo, useState, useRef } from 'react';
// // import { useSelector, useDispatch } from 'react-redux';
// // import { useQuery } from '@tanstack/react-query';
// // import { Link, useNavigate, useSearchParams } from 'react-router-dom';
// // import { motion, AnimatePresence } from 'framer-motion';

// // import {
// //   MapPin,
// //   ChevronRight,
// //   Tag,
// //   CheckCircle,
// //   LocateFixed,
// //   CalendarDays,
// //   Users,
// //   CookingPot,
// //   Table2,
// //   Truck,
// //   ShoppingBag,
// //   BellRing,
// //   ShieldCheck,
// //   CreditCard,
// //   QrCode,
// //   BadgeIndianRupee,
// //   Clock,
// //   Home,
// //   X,
// //   Phone,
// //   Mail,
// //   Navigation,
// //   Loader2
// // } from 'lucide-react';
// // import { QRCodeCanvas } from 'qrcode.react';
// // import toast from 'react-hot-toast';
// // import api from '../../services/api';
// // import CustomerFooter from '../../components/customer/CustomerFooter';
// // import { selectCartItems, selectCartSubtotal, clearCart, setOrderType } from '../../store/slices/cartSlice';
// // import OffersModal from '../../components/customer/OffersModal';
// // import OrderTypeSelector from '../../components/customer/OrderTypeSelector';
// // import OrderPreferences from '../../components/customer/OrderPreferences';
// // import { getOrderPreferences, clearOrderPreferences } from '../../utils/orderPreferences';

// // const STEPS = ['Details', 'Payment', 'Confirm'];
// // const PAYMENT_METHODS = [
// //   { value: 'cod', label: 'Cash on Delivery', desc: 'Pay when you receive', icon: BadgeIndianRupee },
// //   { value: 'online', label: 'Pay Online', desc: 'Pay first using UPI', icon: CreditCard },
// // ];
// // const PREORDER_MIN_MINUTES = 30;
// // const PREORDER_MAX_MINUTES = 240;
// // const DINEIN_MIN_MINUTES = 10;
// // const DINEIN_MAX_MINUTES = 720;
// // const QUICK_TIPS = [20, 50, 100];
// // const CAFE_UPI_ID = import.meta.env.VITE_CAFE_UPI_ID || 'kashishsolanki8082@okaxis';
// // const ORDER_RULES = {
// //   delivery: {
// //     title: 'Delivery rules',
// //     points: [
// //       'Add a full address or use current location so the rider can trace you accurately.',
// //       'Status notifications are sent at placed, confirmed, preparing, out for delivery, and delivered.',
// //       'Keep your phone reachable once the order moves out for delivery.',
// //       'Delivery available within 30km radius of our cafe.',
// //     ],
// //     notifications: 'Push, email, and SMS updates remain enabled across the delivery journey.',
// //     trackUrl: (orderId) => `/track-delivery/${orderId}`,
// //   },
// //   takeaway: {
// //     title: 'Takeaway rules',
// //     points: [
// //       'Pickup begins only after the ready notification is sent to you.',
// //       'Please collect your order within 20 minutes of the ready alert so food quality stays best.',
// //       'Counter staff can ask for your order ID or registered phone number before handoff.',
// //       'If you are delayed, contact the cafe so pickup can be re-timed when possible.',
// //     ],
// //     notifications: 'Placed, confirmed, preparing, and ready alerts are sent before pickup.',
// //     trackUrl: (orderId) => `/track-takeaway/${orderId}`,
// //   },
// //   'dine-in': {
// //     title: 'Table booking terms',
// //     points: [
// //       'Booked tables are held for 15 minutes from the selected time slot.',
// //       'Guest count should match the reservation as closely as possible for proper seating.',
// //       'Large seating changes or late arrival may move you to the next available table.',
// //       'Special arrangements depend on cafe availability and are confirmed at service time.',
// //     ],
// //     notifications: 'You receive confirmation, reminder, and table-ready notifications.',
// //     trackUrl: (orderId) => `/track-dinein/${orderId}`,
// //   },
// //   'pre-order': {
// //     title: 'Pre-order terms',
// //     points: [
// //       'Pre-orders should be placed at least 30 minutes before arrival so the kitchen can finish on time.',
// //       'Pre-orders are prepared to be ready when you reach the cafe or pickup point.',
// //       'Your order is held for 20 minutes after the selected slot before staff may re-time the handoff.',
// //       'Pre-order uses a priority kitchen fee because the meal starts before you reach the cafe.',
// //       'Free cancellation up to 2 hours before, 50% charge for cancellation within 1-2 hours.',
// //     ],
// //     notifications: 'Placed, accepted, kitchen started, almost ready, and ready-for-arrival alerts are sent.',
// //     trackUrl: (orderId) => `/track-preorder/${orderId}`,
// //   },
// // };

// // const NOTIFICATION_STEPS = [
// //   'Order placed',
// //   'Order accepted by cafe',
// //   'Kitchen has started preparing',
// //   'Order is ready',
// //   'Order completed successfully',
// // ];

// // // DEFAULT CAFE ADDRESS
// // const DEFAULT_CAFE_ADDRESS = {
// //   id: 'cafe-default',
// //   label: 'Home',
// //   icon: 'home',
// //   address: 'Under Nutan School, Juna Road, Opposite Navjeevan Hospital, Bareja, Ahmedabad, Gujarat 382425',
// //   isDefault: true,
// // };

// // const CAFE_LOCATION = {
// //   lat: 22.8173,
// //   lng: 72.6002,
// //   address: DEFAULT_CAFE_ADDRESS.address
// // };

// // const calculateDistance = (lat1, lon1, lat2, lon2) => {
// //   const R = 6371;
// //   const dLat = (lat2 - lat1) * Math.PI / 180;
// //   const dLon = (lon2 - lon1) * Math.PI / 180;
// //   const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
// //             Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
// //             Math.sin(dLon/2) * Math.sin(dLon/2);
// //   const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
// //   return R * c;
// // };

// // // Function to get address from coordinates using reverse geocoding
// // const getAddressFromCoordinates = async (lat, lng) => {
// //   try {
// //     // Using OpenStreetMap Nominatim API (free, no API key required)
// //     const response = await fetch(
// //       `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1&accept-language=en`,
// //       {
// //         headers: {
// //           'Accept-Language': 'en',
// //           'User-Agent': 'RollerCoasterCafe/1.0'
// //         }
// //       }
// //     );
    
// //     if (!response.ok) {
// //       throw new Error('Failed to fetch address');
// //     }
    
// //     const data = await response.json();
    
// //     if (data && data.display_name) {
// //       // Format a clean address
// //       const address = data.address;
// //       const formattedAddress = [
// //         address.road,
// //         address.suburb,
// //         address.city || address.town || address.village,
// //         address.state,
// //         address.postcode
// //       ].filter(Boolean).join(', ');
      
// //       return formattedAddress || data.display_name;
// //     }
    
// //     return `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
// //   } catch (error) {
// //     console.error('Reverse geocoding error:', error);
// //     return `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
// //   }
// // };

// // function getScheduleError(orderType, scheduledTime) {
// //   if (!scheduledTime) return '';
// //   const selected = new Date(scheduledTime);
// //   if (isNaN(selected.getTime())) return 'Please choose a valid schedule time.';
// //   const diffMinutes = Math.round((selected.getTime() - Date.now()) / 60000);
// //   if (orderType === 'pre-order') {
// //     if (diffMinutes < PREORDER_MIN_MINUTES) return `Pre-orders must be scheduled at least ${PREORDER_MIN_MINUTES} minutes ahead.`;
// //     if (diffMinutes > PREORDER_MAX_MINUTES) return `Pre-orders are available only within next ${Math.floor(PREORDER_MAX_MINUTES / 60)} hours.`;
// //   }
// //   if (orderType === 'dine-in') {
// //     if (diffMinutes < DINEIN_MIN_MINUTES) return `Dine-in bookings must be scheduled at least ${DINEIN_MIN_MINUTES} minutes ahead.`;
// //     if (diffMinutes > DINEIN_MAX_MINUTES) return 'Dine-in bookings are limited to same day service window.';
// //   }
// //   return '';
// // }

// // export default function CheckoutExperience() {
// //   const dispatch = useDispatch();
// //   const navigate = useNavigate();
// //   const [searchParams] = useSearchParams();
// //   const items = useSelector(selectCartItems);
// //   const subtotal = useSelector(selectCartSubtotal);

// //   const [step, setStep] = useState(0);
// //   const [loading, setLoading] = useState(false);
// //   const [locating, setLocating] = useState(false);
// //   const [couponApplied, setCouponApplied] = useState(false);
// //   const [discount, setDiscount] = useState(0);
// //   const [discountMeta, setDiscountMeta] = useState(null);
// //   const [showOffersModal, setShowOffersModal] = useState(false);
// //   const [distanceError, setDistanceError] = useState(null);
// //   const [preferencesLoaded, setPreferencesLoaded] = useState(false);
// //   const [showOrderTypeSelector, setShowOrderTypeSelector] = useState(false);
// //   const [paymentVerified, setPaymentVerified] = useState(false);
// //   const [verifyingPayment, setVerifyingPayment] = useState(false);
// //   const [fetchingAddress, setFetchingAddress] = useState(false);
// //   const paymentCheckInterval = useRef(null);
  
// //   const [form, setForm] = useState({
// //     orderType: 'delivery',
// //     address: '',
// //     scheduledTime: '',
// //     paymentMethod: 'cod',
// //     onlineMethod: 'upi',
// //     paymentReference: '',
// //     couponCode: '',
// //     specialNotes: '',
// //     tableNumber: '',
// //     guestCount: 2,
// //     location: null,
// //     acceptRules: false,
// //     tipAmount: 0,
// //     isPreOrder: false,
// //     preOrderMethod: '',
// //     preOrderArea: '',
// //   });

// //   const getOrderTypeDisplay = (orderType) => {
// //     if (typeof orderType === 'string') {
// //       switch(orderType) {
// //         case 'delivery': return 'Delivery';
// //         case 'takeaway': return 'Takeaway';
// //         case 'dine-in': return 'Dine-In';
// //         case 'pre-order': return 'Pre-Order';
// //         default: return orderType;
// //       }
// //     }
// //     return 'Order';
// //   };

// //   // Clean up interval on unmount
// //   useEffect(() => {
// //     return () => {
// //       if (paymentCheckInterval.current) {
// //         clearInterval(paymentCheckInterval.current);
// //       }
// //     };
// //   }, []);

// //   // Auto-verify payment when reference is entered
// //   useEffect(() => {
// //     if (form.paymentMethod === 'online' && form.paymentReference && form.paymentReference.trim().length >= 6) {
// //       const timer = setTimeout(() => {
// //         verifyPayment();
// //       }, 2000);
// //       return () => clearTimeout(timer);
// //     }
// //   }, [form.paymentReference]);

// //   useEffect(() => {
// //     const savedPreferences = getOrderPreferences();
// //     const requestedMode = searchParams.get('mode');

// //     if (requestedMode === 'pre-order' && (!savedPreferences || !savedPreferences.isPreOrder)) {
// //       clearOrderPreferences();
// //       setPreferencesLoaded(true);
// //       setShowOrderTypeSelector(true);
// //       return;
// //     }
    
// //     if (savedPreferences && savedPreferences.deliveryMethod) {
// //       const deliveryMethod = savedPreferences.deliveryMethod;
      
// //       const effectiveMethod = savedPreferences.isPreOrder ? (savedPreferences.preOrderMethod || deliveryMethod) : deliveryMethod;

// //       setForm(prev => ({
// //         ...prev,
// //         orderType: effectiveMethod,
// //         scheduledTime: savedPreferences.scheduledDateTime || '',
// //         tableNumber: savedPreferences.tableNumber || '',
// //         guestCount: savedPreferences.guestCount || 2,
// //         isPreOrder: Boolean(savedPreferences.isPreOrder),
// //         preOrderMethod: savedPreferences.preOrderMethod || '',
// //       }));
      
// //       dispatch(setOrderType(effectiveMethod));
// //       setPreferencesLoaded(true);
// //       setShowOrderTypeSelector(false);
// //       setStep(0);
// //     } else {
// //       setPreferencesLoaded(true);
// //       setShowOrderTypeSelector(true);
// //     }
// //   }, [dispatch, searchParams]);

// //   useEffect(() => {
// //     if (form.isPreOrder && form.paymentMethod !== 'online') {
// //       setForm(prev => ({ ...prev, paymentMethod: 'online', onlineMethod: 'upi' }));
// //     }
// //   }, [form.isPreOrder, form.paymentMethod]);

// //   const effectiveOrderType = form.isPreOrder ? 'pre-order' : form.orderType;
// //   const activeRules = ORDER_RULES[effectiveOrderType] || ORDER_RULES.delivery;
// //   const preOrderServiceFee = form.isPreOrder ? 49 : 0;
// //   const tax = Math.round(subtotal * 0.05);
// //   const deliveryFee = form.orderType === 'delivery' ? 30 : 0;
// //   const deliveryTip = form.orderType === 'delivery' ? Math.max(0, Number(form.tipAmount) || 0) : 0;
// //   const total = subtotal + tax + deliveryFee + preOrderServiceFee + deliveryTip - discount;
// //   const selectedPaymentOptions = useMemo(() => {
// //     if (form.isPreOrder) {
// //       return PAYMENT_METHODS.filter((method) => method.value === 'online');
// //     }
// //     return PAYMENT_METHODS;
// //   }, [form.isPreOrder]);
// //   const resolvedPaymentMethod = form.paymentMethod === 'online' ? 'upi' : form.paymentMethod;
// //   const upiPaymentUri = `upi://pay?pa=${encodeURIComponent(CAFE_UPI_ID)}&pn=${encodeURIComponent('Roller Coaster Cafe')}&am=${encodeURIComponent(total.toFixed(2))}&cu=INR&tn=${encodeURIComponent(`Order payment for ${getOrderTypeDisplay(form.orderType)}`)}`;

// //   const formatCurrency = (amount) => `₹${Number(amount || 0).toFixed(2)}`;

// //   const scheduleError = useMemo(
// //     () => getScheduleError(effectiveOrderType, form.scheduledTime),
// //     [effectiveOrderType, form.scheduledTime]
// //   );

// //   const verifyPayment = async () => {
// //     if (!form.paymentReference || form.paymentReference.trim().length < 6) {
// //       toast.error('Please enter a valid UPI reference/UTR (minimum 6 characters)');
// //       return false;
// //     }

// //     setVerifyingPayment(true);
// //     try {
// //       const { data } = await api.post('/customer/verify-payment', {
// //         paymentReference: form.paymentReference.trim(),
// //         amount: total,
// //         upiId: CAFE_UPI_ID
// //       });

// //       if (data.verified) {
// //         setPaymentVerified(true);
// //         toast.success('Payment verified successfully!');
        
// //         setTimeout(() => {
// //           if (step === 1) {
// //             handleNextStep();
// //           }
// //         }, 1500);
        
// //         return true;
// //       } else {
// //         setPaymentVerified(false);
// //         toast.error(data.message || 'Payment verification failed. Please check the reference and try again.');
// //         return false;
// //       }
// //     } catch (err) {
// //       setPaymentVerified(false);
// //       toast.error(err.response?.data?.message || 'Could not verify payment. Please try again.');
// //       return false;
// //     } finally {
// //       setVerifyingPayment(false);
// //     }
// //   };

// //   const handleApplyCoupon = async (code = null) => {
// //     const couponCode = code || form.couponCode;
// //     if (!couponCode?.trim()) {
// //       toast.error('Enter a coupon code first');
// //       return;
// //     }

// //     try {
// //       const { data } = await api.post('/customer/validate-coupon', {
// //         code: couponCode,
// //         orderAmount: subtotal,
// //       });
// //       setDiscount(data.discount || 0);
// //       setDiscountMeta(data.promotion || null);
// //       setCouponApplied(true);
// //       setForm(prev => ({ ...prev, couponCode: couponCode.toUpperCase() }));
// //       toast.success(data.message || 'Coupon applied successfully');
// //     } catch (err) {
// //       setDiscount(0);
// //       setDiscountMeta(null);
// //       setCouponApplied(false);
// //       toast.error(err.response?.data?.message || 'Invalid coupon code');
// //     }
// //   };

// //   const handleRemoveCoupon = () => {
// //     setCouponApplied(false);
// //     setDiscount(0);
// //     setDiscountMeta(null);
// //     setForm(prev => ({ ...prev, couponCode: '' }));
// //     toast.success('Coupon removed');
// //   };

// //   const handleUseCurrentLocation = () => {
// //     if (!navigator.geolocation) {
// //       toast.error('Geolocation is not supported');
// //       return;
// //     }
// //     setLocating(true);
// //     setDistanceError(null);
// //     setFetchingAddress(true);
    
// //     navigator.geolocation.getCurrentPosition(
// //       async (position) => {
// //         const { latitude, longitude } = position.coords;
        
// //         const distance = calculateDistance(latitude, longitude, CAFE_LOCATION.lat, CAFE_LOCATION.lng);
        
// //         if (distance > 30) {
// //           setDistanceError(`Sorry, delivery is only available within 30km of our cafe. Your location is ${distance.toFixed(1)}km away.`);
// //           setLocating(false);
// //           setFetchingAddress(false);
// //           return;
// //         }
        
// //         // Fetch the actual address from coordinates
// //         try {
// //           const address = await getAddressFromCoordinates(latitude, longitude);
          
// //           setForm((prev) => ({
// //             ...prev,
// //             address: address,
// //             location: { lat: latitude, lng: longitude },
// //           }));
          
// //           toast.success(`Location found! You're within delivery zone (${distance.toFixed(1)}km)`);
// //         } catch (error) {
// //           console.error('Error fetching address:', error);
// //           // Fallback to coordinates if address fetch fails
// //           setForm((prev) => ({
// //             ...prev,
// //             address: `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`,
// //             location: { lat: latitude, lng: longitude },
// //           }));
// //           toast.warning('Location detected but could not fetch full address. Please verify your address.');
// //         } finally {
// //           setLocating(false);
// //           setFetchingAddress(false);
// //         }
// //       },
// //       (error) => {
// //         console.error('Geolocation error:', error);
// //         let errorMessage = 'Unable to fetch location. ';
// //         switch(error.code) {
// //           case error.PERMISSION_DENIED:
// //             errorMessage += 'Please allow location access.';
// //             break;
// //           case error.POSITION_UNAVAILABLE:
// //             errorMessage += 'Location information is unavailable.';
// //             break;
// //           case error.TIMEOUT:
// //             errorMessage += 'Location request timed out.';
// //             break;
// //           default:
// //             errorMessage += 'Please try again or enter address manually.';
// //         }
// //         toast.error(errorMessage);
// //         setLocating(false);
// //         setFetchingAddress(false);
// //       }
// //     );
// //   };

// //   const validateOrder = () => {
// //     if (!items.length) {
// //       toast.error('Add food before placing the order');
// //       return false;
// //     }
// //     if (form.orderType === 'delivery' && !form.address.trim()) {
// //       toast.error('Please add your full delivery address');
// //       return false;
// //     }
// //     if ((form.isPreOrder || form.orderType === 'dine-in') && !form.scheduledTime) {
// //       toast.error('Please choose a schedule time first');
// //       return false;
// //     }
// //     if (scheduleError) {
// //       toast.error(scheduleError);
// //       return false;
// //     }
// //     if (form.isPreOrder && form.paymentMethod !== 'online') {
// //       toast.error('Pre-order currently requires online payment');
// //       return false;
// //     }
// //     if (form.paymentMethod === 'online') {
// //       if (!form.paymentReference.trim()) {
// //         toast.error('Please enter your UPI payment reference');
// //         return false;
// //       }
// //       if (!paymentVerified) {
// //         toast.error('Please verify your payment first');
// //         return false;
// //       }
// //     }
// //     if (!form.acceptRules) {
// //       toast.error('Please accept the order rules');
// //       return false;
// //     }
// //     return true;
// //   };

// //   const validateStep = (targetStep = step) => {
// //     if (targetStep === 0) {
// //       if (form.orderType === 'delivery' && !form.address.trim()) {
// //         toast.error('Please add your full delivery address');
// //         return false;
// //       }
// //       if (form.orderType === 'dine-in' && !form.scheduledTime) {
// //         toast.error('Please choose your booking time');
// //         return false;
// //       }
// //       if (form.orderType === 'dine-in' && !form.tableNumber.trim()) {
// //         toast.error('Please enter a table number');
// //         return false;
// //       }
// //       if (scheduleError) {
// //         toast.error(scheduleError);
// //         return false;
// //       }
// //       if (form.isPreOrder && !form.scheduledTime) {
// //         toast.error('Please choose a pre-order time');
// //         return false;
// //       }
// //       if (!form.acceptRules) {
// //         toast.error('Please accept the order rules');
// //         return false;
// //       }
// //     }
// //     if (targetStep === 1 && !form.paymentMethod) {
// //       toast.error('Please choose a payment method');
// //       return false;
// //     }
// //     if (targetStep === 2 && form.paymentMethod === 'online' && !paymentVerified) {
// //       toast.error('Please verify your payment before confirming order');
// //       return false;
// //     }
// //     return true;
// //   };

// //   const handleNextStep = () => {
// //     const nextStep = Math.min(STEPS.length - 1, step + 1);
// //     if (step === nextStep) return;
// //     if (!validateStep(nextStep)) return;
// //     setStep(nextStep);
// //   };

// //   const handlePlaceOrder = async () => {
// //     if (!validateOrder()) return;
// //     setLoading(true);
// //     try {
// //       const { data } = await api.post('/orders', {
// //         items: items.map((item) => ({
// //           menuItemId: item.menuItemId,
// //           quantity: item.quantity,
// //           variant: item.variant,
// //           addons: item.addons,
// //         })),
// //         orderType: form.orderType,
// //         deliveryAddress: form.orderType === 'delivery'
// //           ? { text: form.address, lat: form.location?.lat, lng: form.location?.lng }
// //           : undefined,
// //         scheduledTime: form.scheduledTime || undefined,
// //         paymentMethod: resolvedPaymentMethod,
// //         paymentReference: form.paymentMethod === 'online' ? form.paymentReference.trim() : undefined,
// //         paymentVerified: paymentVerified,
// //         tipAmount: deliveryTip,
// //         customerAcceptedTerms: form.acceptRules,
// //         couponCode: couponApplied ? form.couponCode.trim().toUpperCase() : undefined,
// //         specialNotes: [
// //           form.orderType === 'dine-in' && form.tableNumber ? `Table ${form.tableNumber}` : null,
// //           form.orderType === 'dine-in' ? `Guests: ${form.guestCount}` : null,
// //           form.specialNotes || null,
// //         ].filter(Boolean).join(' | '),
// //       });

// //       dispatch(clearCart());
// //       clearOrderPreferences();
// //       toast.success(`Order placed! #${data.order.orderId}`);
      
// //       const trackingRoutes = {
// //         delivery: `/track-delivery/${data.order._id}`,
// //         takeaway: `/track-takeaway/${data.order._id}`,
// //         'dine-in': `/track-dinein/${data.order._id}`,
// //         'pre-order': `/track-preorder/${data.order._id}`,
// //       };
      
// //       navigate(trackingRoutes[form.orderType] || `/track/${data.order._id}`);
// //     } catch (err) {
// //       toast.error(err.response?.data?.message || 'Order could not be placed');
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   const handleSelectOffer = (offer) => {
// //     setForm(prev => ({ ...prev, couponCode: offer.code }));
// //     handleApplyCoupon(offer.code);
// //   };

// //   const getOrderTypeString = () => {
// //     if (typeof form.orderType === 'string') return form.orderType;
// //     return form.orderType?.value || 'delivery';
// //   };

// //   if (!preferencesLoaded) {
// //     return (
// //       <div className="min-h-screen bg-white flex items-center justify-center">
// //         <div className="text-center">
// //           <div className="w-12 h-12 border-4 border-[#b97844] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
// //           <p className="text-[#6b5f54]">Loading...</p>
// //         </div>
// //       </div>
// //     );
// //   }

// //   if (showOrderTypeSelector) {
// //     return (
// //       <div className="min-h-screen bg-white">
// //         <header className="border-b border-[#e8e0d6] bg-white sticky top-0 z-50">
// //           <div className="max-w-5xl mx-auto px-4 py-3">
// //             <div className="flex items-center justify-between">
// //               <Link to="/cart" className="flex items-center gap-2">
// //                 <img 
// //                   src="https://rollercoastercafe.com/assets/images/roller_logo.png" 
// //                   alt="Logo"
// //                   className="h-8 w-8 rounded-full object-cover"
// //                 />
// //                 <span className="font-semibold text-lg text-[#3f3328]">Roller Coaster Cafe</span>
// //               </Link>
// //               <Link to="/cart" className="text-sm text-[#b97844] hover:underline">
// //                 Back to Cart
// //               </Link>
// //             </div>
// //           </div>
// //         </header>

// //         <main className="max-w-2xl mx-auto px-4 py-12">
// //           <OrderTypeSelector 
// //             onComplete={(preferences) => {
// //               const newPrefs = {
// //                 deliveryMethod: preferences.deliveryMethod,
// //                 scheduledDateTime: preferences.scheduledDateTime,
// //                 isDineIn: preferences.isDineIn,
// //                 isPreOrder: preferences.isPreOrder,
// //                 preOrderMethod: preferences.preOrderMethod || '',
// //                 timestamp: new Date().toISOString()
// //               };
// //               sessionStorage.setItem('orderPreferences', JSON.stringify(newPrefs));
// //               window.location.reload();
// //             }}
// //           />
// //         </main>
// //       </div>
// //     );
// //   }

// //   return (
// //     <div className="min-h-screen bg-white font-body">
// //       <header className="sticky top-0 z-10 bg-white/90 backdrop-blur-xl border-b border-[#e8e0d6]">
// //         <div className="max-w-5xl mx-auto px-4 py-3">
// //           <div className="flex items-center justify-between">
// //             <div className="flex items-center gap-3">
// //               <img src="https://rollercoastercafe.com/assets/images/roller_logo.png" alt="Logo" className="h-8 w-8 rounded-full object-cover" />
// //               <div>
// //                 <h1 className="font-display font-bold text-xl text-[#3f3328]">Checkout</h1>
// //                 <p className="text-xs text-[#6b5f54] capitalize">{getOrderTypeDisplay(form.orderType)} experience</p>
// //               </div>
// //             </div>
// //             <Link to={`/menu?mode=${getOrderTypeString()}`} className="text-sm font-semibold text-[#b97844] hover:underline">
// //               Back to menu
// //             </Link>
// //           </div>
// //         </div>
// //       </header>

// //       <div className="max-w-5xl mx-auto px-4 py-6">
// //         <OrderPreferences />

// //         {items.length === 0 && (
// //           <div className="rounded-xl p-5 mb-6 border border-amber-100 bg-amber-50/70">
// //             <div className="flex items-start gap-4">
// //               <div className="w-10 h-10 rounded-xl bg-white text-[#b97844] flex items-center justify-center shadow-sm">
// //                 <CookingPot size={20} />
// //               </div>
// //               <div className="flex-1">
// //                 <h2 className="font-display text-xl font-bold text-[#3f3328]">Add dishes before checkout</h2>
// //                 <p className="text-sm text-[#6b5f54] mt-1">Add food from the menu to proceed.</p>
// //               </div>
// //               <Link to={`/menu?mode=${getOrderTypeString()}`} className="rounded-full bg-[#b97844] px-4 py-2 text-sm font-semibold text-white hover:bg-[#9e6538] transition-all whitespace-nowrap">
// //                 Open Menu
// //               </Link>
// //             </div>
// //           </div>
// //         )}

// //         <div className="rounded-xl bg-white shadow-sm border border-[#e8e0d6] p-3 mb-6 flex items-center justify-between gap-2 flex-wrap">
// //           <div className="flex items-center gap-2 overflow-x-auto">
// //             {STEPS.map((title, index) => (
// //               <div key={title} className="flex items-center gap-1 shrink-0">
// //                 <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
// //                   index < step ? 'bg-green-500 text-white' : index === step ? 'bg-[#b97844] text-white' : 'bg-[#faf8f5] text-[#a0968c]'
// //                 }`}>
// //                   {index < step ? <CheckCircle size={12} /> : index + 1}
// //                 </div>
// //                 <span className={`text-xs font-medium hidden sm:block ${index === step ? 'text-[#3f3328]' : 'text-[#a0968c]'}`}>{title}</span>
// //                 {index < STEPS.length - 1 && <ChevronRight size={12} className="text-[#e8e0d6]" />}
// //               </div>
// //             ))}
// //           </div>
// //           <div className="inline-flex items-center gap-1.5 rounded-full bg-[#faf8f5] px-3 py-1 text-xs font-semibold text-[#b97844]">
// //             <BellRing size={12} /> Notifications active
// //           </div>
// //         </div>

// //         <div className="grid lg:grid-cols-[1.2fr,0.8fr] gap-6">
// //           <div className="space-y-4">
// //             <AnimatePresence mode="wait">
// //               {step === 0 && (
// //                 <motion.div key="step0" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="rounded-xl bg-white shadow-sm border border-[#e8e0d6] p-5 space-y-4">
// //                   {form.orderType === 'delivery' ? (
// //                     <>
// //                       <div>
// //                         <h2 className="font-display font-bold text-lg text-[#3f3328] mb-1">{form.isPreOrder ? 'Pre-order delivery details' : 'Delivery address'}</h2>
// //                         <p className="text-sm text-[#6b5f54]">{form.isPreOrder ? 'Add your delivery address and verify your current location for this scheduled order.' : 'Where should we deliver your order?'}</p>
// //                         <p className="text-xs text-amber-600 mt-1">Delivery available within 30km of our cafe in Bareja.</p>
// //                       </div>
// //                       <div className="relative">
// //                         <textarea
// //                           value={form.address}
// //                           onChange={(e) => { setDistanceError(null); setForm(prev => ({ ...prev, address: e.target.value, location: null })); }}
// //                           placeholder="Enter your full delivery address..."
// //                           className="w-full rounded-lg border border-[#e8e0d6] p-3 text-sm focus:border-[#b97844] focus:outline-none resize-none"
// //                           rows={3}
// //                         />
// //                         {form.location && (
// //                           <div className="absolute bottom-2 right-2">
// //                             <div className="bg-green-100 text-green-600 rounded-full p-1">
// //                               <CheckCircle size={14} />
// //                             </div>
// //                           </div>
// //                         )}
// //                       </div>
// //                       <button 
// //                         onClick={handleUseCurrentLocation} 
// //                         disabled={locating || fetchingAddress} 
// //                         className="inline-flex items-center gap-2 text-sm text-[#b97844] hover:underline disabled:opacity-50"
// //                       >
// //                         {(locating || fetchingAddress) ? (
// //                           <>
// //                             <Loader2 size={14} className="animate-spin" />
// //                             {fetchingAddress ? 'Getting address...' : 'Getting location...'}
// //                           </>
// //                         ) : (
// //                           <>
// //                             <LocateFixed size={14} />
// //                             Use current location
// //                           </>
// //                         )}
// //                       </button>
// //                       {form.isPreOrder && (
// //                         <input
// //                           type="datetime-local"
// //                           value={form.scheduledTime}
// //                           onChange={(e) => setForm(prev => ({ ...prev, scheduledTime: e.target.value }))}
// //                           min={(() => {
// //                             const date = new Date();
// //                             date.setMinutes(date.getMinutes() + 30);
// //                             return date.toISOString().slice(0, 16);
// //                           })()}
// //                           className="w-full rounded-lg border border-[#e8e0d6] p-2 text-sm focus:border-[#b97844] focus:outline-none"
// //                         />
// //                       )}
// //                       {scheduleError && <p className="text-sm text-red-500">{scheduleError}</p>}
// //                       {distanceError && (
// //                         <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-600">
// //                           {distanceError}
// //                         </div>
// //                       )}
// //                       {form.location && !distanceError && (
// //                         <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-sm text-green-700 flex items-start gap-2">
// //                           <CheckCircle size={16} className="mt-0.5 flex-shrink-0" />
// //                           <div>
// //                             <p className="font-medium">Location verified!</p>
// //                             <p className="text-xs">Your delivery address has been set to your current location.</p>
// //                           </div>
// //                         </div>
// //                       )}
// //                     </>
// //                   ) : form.orderType === 'dine-in' ? (
// //                     <>
// //                       <div>
// //                         <h2 className="font-display font-bold text-lg text-[#3f3328] mb-1">{form.isPreOrder ? 'Pre-order dine-in table' : 'Reserve your table'}</h2>
// //                         <p className="text-sm text-[#6b5f54]">{form.isPreOrder ? 'Choose your table details and booking time for dine-in pre-order.' : 'Book your seat and time'}</p>
// //                       </div>
// //                       <div className="grid sm:grid-cols-2 gap-3">
// //                         <input
// //                           value={form.tableNumber}
// //                           onChange={(e) => setForm(prev => ({ ...prev, tableNumber: e.target.value }))}
// //                           placeholder="Table number or zone"
// //                           className="w-full rounded-lg border border-[#e8e0d6] p-2 text-sm focus:border-[#b97844] focus:outline-none"
// //                         />
// //                         <input
// //                           type="number"
// //                           min="1"
// //                           max="20"
// //                           value={form.guestCount}
// //                           onChange={(e) => setForm(prev => ({ ...prev, guestCount: Number(e.target.value) || 1 }))}
// //                           className="w-full rounded-lg border border-[#e8e0d6] p-2 text-sm focus:border-[#b97844] focus:outline-none"
// //                           placeholder="Guests"
// //                         />
// //                       </div>
// //                       <input
// //                         type="datetime-local"
// //                         value={form.scheduledTime}
// //                         onChange={(e) => setForm(prev => ({ ...prev, scheduledTime: e.target.value }))}
// //                         className="w-full rounded-lg border border-[#e8e0d6] p-2 text-sm focus:border-[#b97844] focus:outline-none"
// //                       />
// //                     </>
// //                   ) : (
// //                     <>
// //                       <div>
// //                         <h2 className="font-display font-bold text-lg text-[#3f3328] mb-1">{form.isPreOrder ? 'Pre-order takeaway timing' : 'Special instructions'}</h2>
// //                         <p className="text-sm text-[#6b5f54]">
// //                           {form.isPreOrder ? 'When would you like your takeaway order ready for pickup?' : 'Any special requests?'}
// //                         </p>
// //                       </div>
// //                       {form.isPreOrder && (
// //                         <>
// //                           <input
// //                             type="datetime-local"
// //                             value={form.scheduledTime}
// //                             onChange={(e) => setForm(prev => ({ ...prev, scheduledTime: e.target.value }))}
// //                             min={(() => {
// //                               const date = new Date();
// //                               date.setMinutes(date.getMinutes() + 30);
// //                               return date.toISOString().slice(0, 16);
// //                             })()}
// //                             className="w-full rounded-lg border border-[#e8e0d6] p-2 text-sm focus:border-[#b97844] focus:outline-none"
// //                           />
// //                         </>
// //                       )}
// //                       {scheduleError && <p className="text-sm text-red-500">{scheduleError}</p>}
// //                       <textarea
// //                         value={form.specialNotes}
// //                         onChange={(e) => setForm(prev => ({ ...prev, specialNotes: e.target.value }))}
// //                         placeholder="Any special requests or notes..."
// //                         className="w-full rounded-lg border border-[#e8e0d6] p-2 text-sm focus:border-[#b97844] focus:outline-none resize-none"
// //                         rows={3}
// //                       />
// //                     </>
// //                   )}

// //                   <div className="rounded-xl bg-[#faf8f5] p-4">
// //                     <div className="flex items-center gap-2 mb-2">
// //                       <ShieldCheck size={14} className="text-[#b97844]" />
// //                       <h3 className="font-semibold text-[#3f3328] text-sm">{activeRules.title}</h3>
// //                     </div>
// //                     <div className="space-y-1 text-xs text-[#6b5f54] mb-3">
// //                       {activeRules.points.slice(0, 2).map((point, i) => <p key={i}>• {point}</p>)}
// //                     </div>
// //                     <label className="flex items-center gap-2 cursor-pointer">
// //                       <input
// //                         type="checkbox"
// //                         checked={form.acceptRules}
// //                         onChange={(e) => setForm(prev => ({ ...prev, acceptRules: e.target.checked }))}
// //                         className="rounded border-[#e8e0d6] text-[#b97844] focus:ring-[#b97844]"
// //                       />
// //                       <span className="text-sm text-[#3f3328]">I accept the terms and conditions</span>
// //                     </label>
// //                   </div>
// //                 </motion.div>
// //               )}

// //               {step === 1 && (
// //                 <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="rounded-xl bg-white shadow-sm border border-[#e8e0d6] p-5 space-y-4">
// //                   <div>
// //                     <h2 className="font-display font-bold text-lg text-[#3f3328] mb-1">Payment method</h2>
// //                     <p className="text-sm text-[#6b5f54]">Choose how you'd like to pay</p>
// //                   </div>

// //                   <div className="space-y-2">
// //                     {selectedPaymentOptions.map(({ value, label, desc, icon: Icon }) => (
// //                       <button
// //                         key={value}
// //                         onClick={() => {
// //                           setForm(prev => ({ ...prev, paymentMethod: value }));
// //                           setPaymentVerified(false);
// //                         }}
// //                         className={`w-full p-3 rounded-xl border-2 text-left transition-all ${
// //                           form.paymentMethod === value ? 'border-[#b97844] bg-[#faf8f5]' : 'border-[#e8e0d6] hover:border-[#b97844]'
// //                         }`}
// //                       >
// //                         <div className="flex items-center gap-3">
// //                           <Icon size={16} className="text-[#b97844]" />
// //                           <div>
// //                             <p className="font-semibold text-[#3f3328] text-sm">{label}</p>
// //                             <p className="text-xs text-[#6b5f54]">{desc}</p>
// //                           </div>
// //                         </div>
// //                       </button>
// //                     ))}
// //                   </div>

// //                   {form.paymentMethod === 'online' && (
// //                     <div className="rounded-xl border border-[#e8e0d6] p-4 space-y-4">
// //                       <div className="flex items-center gap-2">
// //                         <CreditCard size={16} className="text-[#b97844]" />
// //                         <h3 className="font-medium text-[#3f3328] text-sm">Online payment method</h3>
// //                       </div>

// //                       <div className="grid sm:grid-cols-1 gap-3">
// //                         <button
// //                           type="button"
// //                           onClick={() => setForm(prev => ({ ...prev, onlineMethod: 'upi', paymentReference: '', paymentVerified: false }))}
// //                           className={`rounded-xl border-2 p-3 text-left transition-all ${
// //                             form.onlineMethod === 'upi' ? 'border-[#b97844] bg-[#faf8f5]' : 'border-[#e8e0d6]'
// //                           }`}
// //                         >
// //                           <div className="flex items-center gap-2">
// //                             <QrCode size={16} className="text-[#b97844]" />
// //                             <div>
// //                               <p className="font-semibold text-[#3f3328] text-sm">UPI QR</p>
// //                               <p className="text-xs text-[#6b5f54]">Pay with any UPI app</p>
// //                             </div>
// //                           </div>
// //                         </button>
// //                       </div>

// //                       <div className="rounded-xl bg-[#faf8f5] border border-[#e8e0d6] p-4 flex flex-col items-center gap-3">
// //                         <QRCodeCanvas value={upiPaymentUri} size={160} includeMargin />
// //                         <div className="text-center">
// //                           <p className="text-sm font-semibold text-[#3f3328]">UPI ID</p>
// //                           <p className="text-sm text-[#6b5f54] break-all">{CAFE_UPI_ID}</p>
// //                           <p className="text-xs text-[#6b5f54] mt-1">Pay {formatCurrency(total)} and enter the UTR or reference below.</p>
// //                         </div>
// //                       </div>

// //                       <div className="space-y-3">
// //                         <input
// //                           type="text"
// //                           value={form.paymentReference}
// //                           onChange={(e) => {
// //                             setForm(prev => ({ ...prev, paymentReference: e.target.value }));
// //                             setPaymentVerified(false);
// //                           }}
// //                           placeholder="Enter UPI reference / UTR"
// //                           className="w-full rounded-lg border border-[#e8e0d6] p-2 text-sm focus:border-[#b97844] focus:outline-none"
// //                         />
                        
// //                         {form.paymentReference && !paymentVerified && (
// //                           <button
// //                             onClick={verifyPayment}
// //                             disabled={verifyingPayment || form.paymentReference.trim().length < 6}
// //                             className="w-full rounded-lg bg-[#b97844] py-2 text-white font-semibold text-sm hover:bg-[#9e6538] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
// //                           >
// //                             {verifyingPayment ? (
// //                               <>
// //                                 <Loader2 size={16} className="animate-spin" />
// //                                 Verifying Payment...
// //                               </>
// //                             ) : (
// //                               <>
// //                                 <CheckCircle size={16} />
// //                                 Verify Payment
// //                               </>
// //                             )}
// //                           </button>
// //                         )}

// //                         {paymentVerified && (
// //                           <div className="bg-green-50 border border-green-200 rounded-lg p-3 flex items-center gap-2">
// //                             <CheckCircle size={18} className="text-green-600" />
// //                             <div>
// //                               <p className="text-sm font-semibold text-green-700">Payment Verified!</p>
// //                               <p className="text-xs text-green-600">Your payment has been confirmed. You can now proceed.</p>
// //                             </div>
// //                           </div>
// //                         )}
// //                       </div>
// //                     </div>
// //                   )}

// //                   {form.orderType === 'delivery' && (
// //                     <div className="rounded-xl border border-[#e8e0d6] p-3">
// //                       <div className="flex items-center gap-2 mb-2">
// //                         <BadgeIndianRupee size={14} className="text-[#b97844]" />
// //                         <h3 className="font-medium text-[#3f3328] text-sm">Delivery tip (Optional)</h3>
// //                       </div>
// //                       <div className="flex flex-wrap gap-2 mb-2">
// //                         {QUICK_TIPS.map(amount => (
// //                           <button
// //                             key={amount}
// //                             onClick={() => setForm(prev => ({ ...prev, tipAmount: amount }))}
// //                             className={`px-3 py-1 rounded-full text-xs transition-all ${
// //                               form.tipAmount === amount ? 'bg-[#b97844] text-white' : 'border border-[#e8e0d6] text-[#6b5f54] hover:border-[#b97844]'
// //                             }`}
// //                           >
// //                             ₹{amount}
// //                           </button>
// //                         ))}
// //                       </div>
// //                       <input
// //                         type="number"
// //                         min="0"
// //                         value={form.tipAmount}
// //                         onChange={(e) => setForm(prev => ({ ...prev, tipAmount: Number(e.target.value) || 0 }))}
// //                         placeholder="Custom amount"
// //                         className="w-full rounded-lg border border-[#e8e0d6] p-2 text-sm focus:border-[#b97844] focus:outline-none"
// //                       />
// //                     </div>
// //                   )}

// //                   <div className="rounded-xl bg-[#faf8f5] p-4">
// //                     <div className="flex items-center justify-between mb-3">
// //                       <div className="flex items-center gap-2">
// //                         <Tag size={18} className="text-[#b97844]" />
// //                         <h3 className="font-semibold text-[#3f3328] text-base">Coupon Code</h3>
// //                       </div>
// //                       <button
// //                         onClick={() => setShowOffersModal(true)}
// //                         className="text-sm text-[#b97844] hover:underline font-medium"
// //                       >
// //                         View All Offers
// //                       </button>
// //                     </div>
                    
// //                     {!couponApplied ? (
// //                       <div className="flex gap-3">
// //                         <div className="relative flex-1">
// //                           <Tag size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#a0968c]" />
// //                           <input
// //                             value={form.couponCode}
// //                             onChange={(e) => {
// //                               setForm(prev => ({ ...prev, couponCode: e.target.value.toUpperCase() }));
// //                             }}
// //                             placeholder="Enter coupon code"
// //                             className="w-full rounded-lg border border-[#e8e0d6] bg-white pl-9 pr-3 py-2.5 text-base focus:border-[#b97844] focus:outline-none"
// //                           />
// //                         </div>
// //                         <button
// //                           onClick={() => handleApplyCoupon()}
// //                           disabled={!form.couponCode.trim()}
// //                           className="rounded-lg border border-[#b97844] px-5 py-2.5 text-base font-semibold text-[#b97844] hover:bg-[#b97844] hover:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
// //                         >
// //                           Apply
// //                         </button>
// //                       </div>
// //                     ) : (
// //                       <div className="bg-green-50 rounded-lg p-4">
// //                         <div className="flex items-center justify-between">
// //                           <div className="flex items-center gap-3">
// //                             <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
// //                               <CheckCircle size={20} className="text-green-600" />
// //                             </div>
// //                             <div>
// //                               <p className="font-semibold text-[#3f3328] text-base">Coupon Applied!</p>
// //                               <p className="text-sm text-green-700">
// //                               {discountMeta?.discountLabel || 'Discount'} - Saved {formatCurrency(discount)}
// //                               </p>
// //                               <p className="text-xs text-[#6b5f54] mt-1">Code: {form.couponCode}</p>
// //                             </div>
// //                           </div>
// //                           <button
// //                             onClick={handleRemoveCoupon}
// //                             className="px-4 py-2 rounded-lg border border-red-200 text-red-500 text-sm font-medium hover:bg-red-50 transition-all"
// //                           >
// //                             Remove
// //                           </button>
// //                         </div>
// //                       </div>
// //                     )}
// //                   </div>

// //                   {form.paymentMethod === 'online' && paymentVerified && (
// //                     <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
// //                       <p className="text-sm text-blue-700 flex items-center gap-2">
// //                         <CheckCircle size={16} />
// //                         Payment verified! Click Continue to confirm your order.
// //                       </p>
// //                     </div>
// //                   )}
// //                 </motion.div>
// //               )}

// //               {step === 2 && (
// //                 <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="rounded-xl bg-white shadow-sm border border-[#e8e0d6] p-5 space-y-4">
// //                   <div>
// //                     <h2 className="font-display font-bold text-lg text-[#3f3328] mb-1">Confirm your order</h2>
// //                     <p className="text-sm text-[#6b5f54]">Review details before placing order</p>
// //                   </div>

// //                   <div className="rounded-xl bg-[#faf8f5] p-4 space-y-2 text-base">
// //                     <div className="flex justify-between">
// //                       <span className="text-[#6b5f54]">Order type</span>
// //                       <span className="font-semibold text-[#3f3328] capitalize">{getOrderTypeDisplay(form.orderType)}</span>
// //                     </div>
// //                     {form.address && <div className="flex justify-between"><span className="text-[#6b5f54]">Address</span><span className="font-semibold text-[#3f3328] text-right">{form.address}</span></div>}
// //                     {form.tableNumber && <div className="flex justify-between"><span className="text-[#6b5f54]">Table</span><span className="font-semibold text-[#3f3328]">{form.tableNumber}</span></div>}
// //                     {form.scheduledTime && <div className="flex justify-between"><span className="text-[#6b5f54]">Scheduled</span><span className="font-semibold text-[#3f3328]">{new Date(form.scheduledTime).toLocaleString()}</span></div>}
// //                     <div className="flex justify-between">
// //                       <span className="text-[#6b5f54]">Payment</span>
// //                       <span className="font-semibold text-[#3f3328] capitalize">
// //                         {form.paymentMethod === 'online' ? `Online (${form.onlineMethod})` : form.paymentMethod}
// //                       </span>
// //                     </div>
// //                     {form.paymentMethod === 'online' && (
// //                       <div className="flex justify-between">
// //                         <span className="text-[#6b5f54]">Payment Status</span>
// //                         <span className="font-semibold text-green-600 flex items-center gap-1">
// //                           <CheckCircle size={14} /> Verified
// //                         </span>
// //                       </div>
// //                     )}
// //                     {form.paymentMethod === 'online' && form.paymentReference && (
// //                       <div className="flex justify-between">
// //                         <span className="text-[#6b5f54]">Reference</span>
// //                         <span className="font-semibold text-[#3f3328] text-right break-all max-w-[200px]">{form.paymentReference}</span>
// //                       </div>
// //                     )}
// //                     {form.tipAmount > 0 && <div className="flex justify-between"><span className="text-[#6b5f54]">Tip</span><span className="font-semibold text-[#3f3328]">{formatCurrency(form.tipAmount)}</span></div>}
// //                     {couponApplied && discount > 0 && <div className="flex justify-between"><span className="text-[#6b5f54]">Discount</span><span className="font-semibold text-green-600">-{formatCurrency(discount)}</span></div>}
// //                   </div>

// //                   <div className="rounded-xl border border-[#e8e0d6] p-4">
// //                     <div className="flex items-center gap-2 mb-2">
// //                       <BellRing size={14} className="text-[#b97844]" />
// //                       <h3 className="font-medium text-[#3f3328] text-sm">Notification flow</h3>
// //                     </div>
// //                     <div className="space-y-1 text-xs text-[#6b5f54]">
// //                       {NOTIFICATION_STEPS.slice(0, 3).map(item => <p key={item}>• {item}</p>)}
// //                       <p className="text-[#b97844] text-xs pt-1">{activeRules.notifications}</p>
// //                     </div>
// //                   </div>

// //                   <button
// //                     onClick={handlePlaceOrder}
// //                     disabled={loading || !items.length}
// //                     className="w-full rounded-lg bg-[#b97844] py-3 text-white font-semibold text-base hover:bg-[#9e6538] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
// //                   >
// //                     {loading ? (
// //                       <>
// //                         <Loader2 size={18} className="animate-spin" />
// //                         Placing Order...
// //                       </>
// //                     ) : (
// //                       `Place Order - ${formatCurrency(total)}`
// //                     )}
// //                   </button>
// //                 </motion.div>
// //               )}
// //             </AnimatePresence>

// //             <div className="flex justify-between pt-2">
// //               {step > 0 && (
// //                   <button onClick={() => setStep(s => s - 1)} className="rounded-lg border border-[#e8e0d6] px-5 py-2 text-sm text-[#6b5f54] hover:border-[#b97844] hover:text-[#b97844] transition-all">
// //                     Back
// //                   </button>
// //               )}
// //               {step < 2 ? (
// //                 <button 
// //                   onClick={handleNextStep} 
// //                   disabled={step === 1 && form.paymentMethod === 'online' && !paymentVerified}
// //                   className="rounded-lg bg-[#b97844] px-5 py-2 text-sm text-white hover:bg-[#9e6538] transition-all ml-auto disabled:opacity-50 disabled:cursor-not-allowed"
// //                 >
// //                   Continue
// //                 </button>
// //               ) : null}
// //             </div>
// //           </div>

// //           <aside className="rounded-xl bg-white shadow-sm border border-[#e8e0d6] p-5 h-fit sticky top-24">
// //             <h2 className="font-semibold text-lg text-[#3f3328] mb-3">Order Summary</h2>
            
// //             <div className="space-y-2 max-h-48 overflow-y-auto mb-4">
// //               {items.slice(0, 5).map((item) => (
// //                 <div key={item.key} className="flex justify-between text-base">
// //                   <span className="text-[#6b5f54] truncate pr-2">{item.quantity} {item.name}</span>
// //                   <span className="text-[#3f3328]">{formatCurrency(item.basePrice * item.quantity)}</span>
// //                 </div>
// //               ))}
// //               {items.length > 5 && <p className="text-sm text-[#a0968c]">+{items.length - 5} more items</p>}
// //             </div>

// //             <div className="space-y-3 text-base border-t border-[#e8e0d6] pt-4">
// //               <div className="flex justify-between">
// //                 <span className="text-[#6b5f54]">Subtotal</span>
// //                 <span className="text-[#3f3328]">{formatCurrency(subtotal)}</span>
// //               </div>
// //               <div className="flex justify-between">
// //                 <span className="text-[#6b5f54]">GST (5%)</span>
// //                 <span className="text-[#3f3328]">{formatCurrency(tax)}</span>
// //               </div>
// //               {deliveryFee > 0 && (
// //                 <div className="flex justify-between">
// //                   <span className="text-[#6b5f54]">Delivery Fee</span>
// //                   <span className="text-[#3f3328]">{formatCurrency(deliveryFee)}</span>
// //                 </div>
// //               )}
// //               {preOrderServiceFee > 0 && (
// //                 <div className="flex justify-between">
// //                   <span className="text-[#6b5f54]">Pre-order Fee</span>
// //                   <span className="text-[#3f3328]">{formatCurrency(preOrderServiceFee)}</span>
// //                 </div>
// //               )}
// //               {form.tipAmount > 0 && (
// //                 <div className="flex justify-between">
// //                   <span className="text-[#6b5f54]">Tip</span>
// //                   <span className="text-[#3f3328]">{formatCurrency(form.tipAmount)}</span>
// //                 </div>
// //               )}
// //               {discount > 0 && (
// //                 <div className="flex justify-between text-green-600">
// //                   <span>Discount</span>
// //                   <span>-{formatCurrency(discount)}</span>
// //                 </div>
// //               )}
// //               <div className="flex justify-between font-bold text-xl pt-3 border-t border-[#e8e0d6]">
// //                 <span className="text-[#3f3328]">Total</span>
// //                 <span className="text-[#b97844]">{formatCurrency(total)}</span>
// //               </div>
// //             </div>

// //             <div className="mt-4 p-3 bg-[#faf8f5] rounded-lg text-sm text-[#6b5f54]">
// //               <p className="font-medium text-[#3f3328] mb-1">Customer promise</p>
// //               <p>Real-time notifications, secure payment, easy tracking.</p>
// //             </div>
// //           </aside>
// //         </div>
// //       </div>

// //       {showOffersModal && (
// //         <OffersModal
// //           onClose={() => setShowOffersModal(false)}
// //           onSelectOffer={handleSelectOffer}
// //         />
// //       )}
// //       <CustomerFooter />
// //     </div>
// //   );
// // }
// import { useEffect, useMemo, useState, useRef } from 'react';
// import { useSelector, useDispatch } from 'react-redux';
// import { useQuery } from '@tanstack/react-query';
// import { Link, useNavigate, useSearchParams } from 'react-router-dom';
// import { motion, AnimatePresence } from 'framer-motion';

// import {
//   MapPin,
//   ChevronRight,
//   Tag,
//   CheckCircle,
//   LocateFixed,
//   CalendarDays,
//   Users,
//   CookingPot,
//   Table2,
//   Truck,
//   ShoppingBag,
//   BellRing,
//   ShieldCheck,
//   CreditCard,
//   QrCode,
//   BadgeIndianRupee,
//   Clock,
//   Home,
//   X,
//   Phone,
//   Mail,
//   Navigation,
//   Loader2
// } from 'lucide-react';
// import { QRCodeCanvas } from 'qrcode.react';
// import toast from 'react-hot-toast';
// import api from '../../services/api';
// import CustomerFooter from '../../components/customer/CustomerFooter';
// import { selectCartItems, selectCartSubtotal, clearCart, setOrderType } from '../../store/slices/cartSlice';
// import OffersModal from '../../components/customer/OffersModal';
// import OrderTypeSelector from '../../components/customer/OrderTypeSelector';
// import OrderPreferences from '../../components/customer/OrderPreferences';
// import { getOrderPreferences, clearOrderPreferences } from '../../utils/orderPreferences';

// const STEPS = ['Details', 'Payment', 'Confirm'];
// const PAYMENT_METHODS = [
//   { value: 'cod', label: 'Cash on Delivery', desc: 'Pay when you receive', icon: BadgeIndianRupee },
//   { value: 'online', label: 'Pay Online', desc: 'Pay first using UPI', icon: CreditCard },
// ];
// const PREORDER_MIN_MINUTES = 30;
// const PREORDER_MAX_MINUTES = 240;
// const DINEIN_MIN_MINUTES = 10;
// const DINEIN_MAX_MINUTES = 720;
// const QUICK_TIPS = [20, 50, 100];
// const CAFE_UPI_ID = import.meta.env.VITE_CAFE_UPI_ID || 'kashishsolanki8082@okaxis';
// const ORDER_RULES = {
//   delivery: {
//     title: 'Delivery rules',
//     points: [
//       'Add a full address or use current location so the rider can trace you accurately.',
//       'Status notifications are sent at placed, confirmed, preparing, out for delivery, and delivered.',
//       'Keep your phone reachable once the order moves out for delivery.',
//       'Delivery available within 30km radius of our cafe.',
//     ],
//     notifications: 'Push, email, and SMS updates remain enabled across the delivery journey.',
//     trackUrl: (orderId) => `/track-delivery/${orderId}`,
//   },
//   takeaway: {
//     title: 'Takeaway rules',
//     points: [
//       'Pickup begins only after the ready notification is sent to you.',
//       'Please collect your order within 20 minutes of the ready alert so food quality stays best.',
//       'Counter staff can ask for your order ID or registered phone number before handoff.',
//       'If you are delayed, contact the cafe so pickup can be re-timed when possible.',
//     ],
//     notifications: 'Placed, confirmed, preparing, and ready alerts are sent before pickup.',
//     trackUrl: (orderId) => `/track-takeaway/${orderId}`,
//   },
//   'dine-in': {
//     title: 'Table booking terms',
//     points: [
//       'Booked tables are held for 15 minutes from the selected time slot.',
//       'Guest count should match the reservation as closely as possible for proper seating.',
//       'Large seating changes or late arrival may move you to the next available table.',
//       'Special arrangements depend on cafe availability and are confirmed at service time.',
//     ],
//     notifications: 'You receive confirmation, reminder, and table-ready notifications.',
//     trackUrl: (orderId) => `/track-dinein/${orderId}`,
//   },
//   'pre-order': {
//     title: 'Pre-order terms',
//     points: [
//       'Pre-orders should be placed at least 30 minutes before arrival so the kitchen can finish on time.',
//       'Pre-orders are prepared to be ready when you reach the cafe or pickup point.',
//       'Your order is held for 20 minutes after the selected slot before staff may re-time the handoff.',
//       'Pre-order uses a priority kitchen fee because the meal starts before you reach the cafe.',
//       'Free cancellation up to 2 hours before, 50% charge for cancellation within 1-2 hours.',
//     ],
//     notifications: 'Placed, accepted, kitchen started, almost ready, and ready-for-arrival alerts are sent.',
//     trackUrl: (orderId) => `/track-preorder/${orderId}`,
//   },
// };

// const NOTIFICATION_STEPS = [
//   'Order placed',
//   'Order accepted by cafe',
//   'Kitchen has started preparing',
//   'Order is ready',
//   'Order completed successfully',
// ];

// // DEFAULT CAFE ADDRESS
// const DEFAULT_CAFE_ADDRESS = {
//   id: 'cafe-default',
//   label: 'Home',
//   icon: 'home',
//   address: 'Under Nutan School, Juna Road, Opposite Navjeevan Hospital, Bareja, Ahmedabad, Gujarat 382425',
//   isDefault: true,
// };

// const CAFE_LOCATION = {
//   lat: 22.8173,
//   lng: 72.6002,
//   address: DEFAULT_CAFE_ADDRESS.address
// };

// const calculateDistance = (lat1, lon1, lat2, lon2) => {
//   const R = 6371;
//   const dLat = (lat2 - lat1) * Math.PI / 180;
//   const dLon = (lon2 - lon1) * Math.PI / 180;
//   const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
//             Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
//             Math.sin(dLon/2) * Math.sin(dLon/2);
//   const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
//   return R * c;
// };

// // Function to get address from coordinates using reverse geocoding
// const getAddressFromCoordinates = async (lat, lng) => {
//   try {
//     const response = await fetch(
//       `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1&accept-language=en`,
//       {
//         headers: {
//           'Accept-Language': 'en',
//           'User-Agent': 'RollerCoasterCafe/1.0'
//         }
//       }
//     );
    
//     if (!response.ok) {
//       throw new Error('Failed to fetch address');
//     }
    
//     const data = await response.json();
    
//     if (data && data.display_name) {
//       const address = data.address;
//       const formattedAddress = [
//         address.road,
//         address.suburb,
//         address.city || address.town || address.village,
//         address.state,
//         address.postcode
//       ].filter(Boolean).join(', ');
      
//       return formattedAddress || data.display_name;
//     }
    
//     return `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
//   } catch (error) {
//     console.error('Reverse geocoding error:', error);
//     return `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
//   }
// };

// function getScheduleError(orderType, scheduledTime) {
//   if (!scheduledTime) return '';
//   const selected = new Date(scheduledTime);
//   if (isNaN(selected.getTime())) return 'Please choose a valid schedule time.';
//   const diffMinutes = Math.round((selected.getTime() - Date.now()) / 60000);
//   if (orderType === 'pre-order') {
//     if (diffMinutes < PREORDER_MIN_MINUTES) return `Pre-orders must be scheduled at least ${PREORDER_MIN_MINUTES} minutes ahead.`;
//     if (diffMinutes > PREORDER_MAX_MINUTES) return `Pre-orders are available only within next ${Math.floor(PREORDER_MAX_MINUTES / 60)} hours.`;
//   }
//   if (orderType === 'dine-in') {
//     if (diffMinutes < DINEIN_MIN_MINUTES) return `Dine-in bookings must be scheduled at least ${DINEIN_MIN_MINUTES} minutes ahead.`;
//     if (diffMinutes > DINEIN_MAX_MINUTES) return 'Dine-in bookings are limited to same day service window.';
//   }
//   return '';
// }

// export default function CheckoutExperience() {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const [searchParams] = useSearchParams();
//   const items = useSelector(selectCartItems);
//   const subtotal = useSelector(selectCartSubtotal);

//   const [step, setStep] = useState(0);
//   const [loading, setLoading] = useState(false);
//   const [locating, setLocating] = useState(false);
//   const [couponApplied, setCouponApplied] = useState(false);
//   const [discount, setDiscount] = useState(0);
//   const [discountMeta, setDiscountMeta] = useState(null);
//   const [showOffersModal, setShowOffersModal] = useState(false);
//   const [distanceError, setDistanceError] = useState(null);
//   const [preferencesLoaded, setPreferencesLoaded] = useState(false);
//   const [showOrderTypeSelector, setShowOrderTypeSelector] = useState(false);
//   const [paymentVerified, setPaymentVerified] = useState(false);
//   const [verifyingPayment, setVerifyingPayment] = useState(false);
//   const [fetchingAddress, setFetchingAddress] = useState(false);
//   const paymentCheckInterval = useRef(null);
  
//   const [form, setForm] = useState({
//     orderType: 'delivery',
//     address: '',
//     scheduledTime: '',
//     paymentMethod: 'cod',
//     onlineMethod: 'upi',
//     paymentReference: '',
//     couponCode: '',
//     specialNotes: '',
//     tableNumber: '',
//     guestCount: 2,
//     location: null,
//     acceptRules: false,
//     tipAmount: 0,
//     isPreOrder: false,
//     preOrderMethod: '',
//     preOrderArea: '',
//   });

//   const getOrderTypeDisplay = (orderType) => {
//     if (typeof orderType === 'string') {
//       switch(orderType) {
//         case 'delivery': return 'Delivery';
//         case 'takeaway': return 'Takeaway';
//         case 'dine-in': return 'Dine-In';
//         case 'pre-order': return 'Pre-Order';
//         default: return orderType;
//       }
//     }
//     return 'Order';
//   };

//   useEffect(() => {
//     return () => {
//       if (paymentCheckInterval.current) {
//         clearInterval(paymentCheckInterval.current);
//       }
//     };
//   }, []);

//   useEffect(() => {
//     if (step === 1 && form.paymentMethod === 'online' && paymentVerified) {
//       setStep(STEPS.length - 1);
//     }
//   }, [form.paymentMethod, paymentVerified, step]);

//   useEffect(() => {
//     const savedPreferences = getOrderPreferences();
//     const requestedMode = searchParams.get('mode');

//     if (requestedMode === 'pre-order' && (!savedPreferences || !savedPreferences.isPreOrder)) {
//       clearOrderPreferences();
//       setPreferencesLoaded(true);
//       setShowOrderTypeSelector(true);
//       return;
//     }
    
//     if (savedPreferences && savedPreferences.deliveryMethod) {
//       const deliveryMethod = savedPreferences.deliveryMethod;
      
//       const effectiveMethod = savedPreferences.isPreOrder ? (savedPreferences.preOrderMethod || deliveryMethod) : deliveryMethod;

//       setForm(prev => ({
//         ...prev,
//         orderType: effectiveMethod,
//         scheduledTime: savedPreferences.scheduledDateTime || '',
//         tableNumber: savedPreferences.tableNumber || '',
//         guestCount: savedPreferences.guestCount || 2,
//         isPreOrder: Boolean(savedPreferences.isPreOrder),
//         preOrderMethod: savedPreferences.preOrderMethod || '',
//       }));
      
//       dispatch(setOrderType(effectiveMethod));
//       setPreferencesLoaded(true);
//       setShowOrderTypeSelector(false);
//       setStep(0);
//     } else {
//       setPreferencesLoaded(true);
//       setShowOrderTypeSelector(true);
//     }
//   }, [dispatch, searchParams]);

//   useEffect(() => {
//     if (form.isPreOrder && form.paymentMethod !== 'online') {
//       setForm(prev => ({ ...prev, paymentMethod: 'online', onlineMethod: 'upi' }));
//     }
//   }, [form.isPreOrder, form.paymentMethod]);

//   const effectiveOrderType = form.isPreOrder ? 'pre-order' : form.orderType;
//   const activeRules = ORDER_RULES[effectiveOrderType] || ORDER_RULES.delivery;
//   const preOrderServiceFee = form.isPreOrder ? 49 : 0;
//   const tax = Math.round(subtotal * 0.05);
//   const deliveryFee = form.orderType === 'delivery' ? 30 : 0;
//   const deliveryTip = form.orderType === 'delivery' ? Math.max(0, Number(form.tipAmount) || 0) : 0;
//   const total = subtotal + tax + deliveryFee + preOrderServiceFee + deliveryTip - discount;
//   const selectedPaymentOptions = useMemo(() => {
//     if (form.isPreOrder) {
//       return PAYMENT_METHODS.filter((method) => method.value === 'online');
//     }
//     return PAYMENT_METHODS;
//   }, [form.isPreOrder]);
//   const resolvedPaymentMethod = form.paymentMethod;
//   const upiPaymentUri = `upi://pay?pa=${encodeURIComponent(CAFE_UPI_ID)}&pn=${encodeURIComponent('Roller Coaster Cafe')}&am=${encodeURIComponent(total.toFixed(2))}&cu=INR&tn=${encodeURIComponent(`Order payment for ${getOrderTypeDisplay(form.orderType)}`)}`;

//   const formatCurrency = (amount) => `₹${Number(amount || 0).toFixed(2)}`;

//   const scheduleError = useMemo(
//     () => getScheduleError(effectiveOrderType, form.scheduledTime),
//     [effectiveOrderType, form.scheduledTime]
//   );

//   const verifyPayment = async () => {
//     if (!form.paymentReference || form.paymentReference.trim().length < 6) {
//       toast.error('Please enter transaction ID / payment reference');
//       return false;
//     }

//     setVerifyingPayment(true);
//     try {
//       await new Promise((resolve) => setTimeout(resolve, 600));
//       const reference = form.paymentReference.trim();
//       setForm((prev) => ({
//         ...prev,
//         paymentReference: reference,
//       }));
//       setPaymentVerified(true);
//       toast.success('Payment successfully done');
//       setStep(STEPS.length - 1);
//       return true;
//     } catch {
//       setPaymentVerified(false);
//       toast.error('Could not verify payment. Please try again.');
//       return false;
//     } finally {
//       setVerifyingPayment(false);
//     }
//   };

//   const handleApplyCoupon = async (code = null) => {
//     const couponCode = code || form.couponCode;
//     if (!couponCode?.trim()) {
//       toast.error('Enter a coupon code first');
//       return;
//     }

//     try {
//       const { data } = await api.post('/customer/validate-coupon', {
//         code: couponCode,
//         orderAmount: subtotal,
//       });
//       setDiscount(data.discount || 0);
//       setDiscountMeta(data.promotion || null);
//       setCouponApplied(true);
//       setForm(prev => ({ ...prev, couponCode: couponCode.toUpperCase() }));
//       toast.success(data.message || 'Coupon applied successfully');
//     } catch (err) {
//       setDiscount(0);
//       setDiscountMeta(null);
//       setCouponApplied(false);
//       toast.error(err.response?.data?.message || 'Invalid coupon code');
//     }
//   };

//   const handleRemoveCoupon = () => {
//     setCouponApplied(false);
//     setDiscount(0);
//     setDiscountMeta(null);
//     setForm(prev => ({ ...prev, couponCode: '' }));
//     toast.success('Coupon removed');
//   };

//   const handleUseCurrentLocation = () => {
//     if (!navigator.geolocation) {
//       toast.error('Geolocation is not supported');
//       return;
//     }
//     setLocating(true);
//     setDistanceError(null);
//     setFetchingAddress(true);
    
//     navigator.geolocation.getCurrentPosition(
//       async (position) => {
//         const { latitude, longitude } = position.coords;
        
//         const distance = calculateDistance(latitude, longitude, CAFE_LOCATION.lat, CAFE_LOCATION.lng);
        
//         if (distance > 30) {
//           setDistanceError(`Sorry, delivery is only available within 30km of our cafe. Your location is ${distance.toFixed(1)}km away.`);
//           setLocating(false);
//           setFetchingAddress(false);
//           return;
//         }
        
//         try {
//           const address = await getAddressFromCoordinates(latitude, longitude);
          
//           setForm((prev) => ({
//             ...prev,
//             address: address,
//             location: { lat: latitude, lng: longitude },
//           }));
          
//           toast.success(`Location found! You're within delivery zone (${distance.toFixed(1)}km)`);
//         } catch (error) {
//           console.error('Error fetching address:', error);
//           setForm((prev) => ({
//             ...prev,
//             address: `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`,
//             location: { lat: latitude, lng: longitude },
//           }));
//           toast.warning('Location detected but could not fetch full address. Please verify your address.');
//         } finally {
//           setLocating(false);
//           setFetchingAddress(false);
//         }
//       },
//       (error) => {
//         console.error('Geolocation error:', error);
//         let errorMessage = 'Unable to fetch location. ';
//         switch(error.code) {
//           case error.PERMISSION_DENIED:
//             errorMessage += 'Please allow location access.';
//             break;
//           case error.POSITION_UNAVAILABLE:
//             errorMessage += 'Location information is unavailable.';
//             break;
//           case error.TIMEOUT:
//             errorMessage += 'Location request timed out.';
//             break;
//           default:
//             errorMessage += 'Please try again or enter address manually.';
//         }
//         toast.error(errorMessage);
//         setLocating(false);
//         setFetchingAddress(false);
//       }
//     );
//   };

//   const validateOrder = () => {
//     if (!items.length) {
//       toast.error('Add food before placing the order');
//       return false;
//     }
//     if (form.orderType === 'delivery' && !form.address.trim()) {
//       toast.error('Please add your full delivery address');
//       return false;
//     }
//     if ((form.isPreOrder || form.orderType === 'dine-in') && !form.scheduledTime) {
//       toast.error('Please choose a schedule time first');
//       return false;
//     }
//     if (scheduleError) {
//       toast.error(scheduleError);
//       return false;
//     }
//     if (form.isPreOrder && form.paymentMethod !== 'online') {
//       toast.error('Pre-order currently requires online payment');
//       return false;
//     }
//     if (form.paymentMethod === 'online') {
//       if (!form.paymentReference.trim()) {
//         toast.error('Please enter your UPI payment reference');
//         return false;
//       }
//       if (!paymentVerified) {
//         toast.error('Please verify your payment first');
//         return false;
//       }
//     }
//     if (!form.acceptRules) {
//       toast.error('Please accept the order rules');
//       return false;
//     }
//     return true;
//   };

//   const validateStep = (targetStep = step) => {
//     if (targetStep === 0) {
//       if (form.orderType === 'delivery' && !form.address.trim()) {
//         toast.error('Please add your full delivery address');
//         return false;
//       }
//       if (form.orderType === 'dine-in' && !form.scheduledTime) {
//         toast.error('Please choose your booking time');
//         return false;
//       }
//       if (form.orderType === 'dine-in' && !form.tableNumber.trim()) {
//         toast.error('Please enter a table number');
//         return false;
//       }
//       if (scheduleError) {
//         toast.error(scheduleError);
//         return false;
//       }
//       if (form.isPreOrder && !form.scheduledTime) {
//         toast.error('Please choose a pre-order time');
//         return false;
//       }
//       if (!form.acceptRules) {
//         toast.error('Please accept the order rules');
//         return false;
//       }
//     }
//     if (targetStep === 1 && !form.paymentMethod) {
//       toast.error('Please choose a payment method');
//       return false;
//     }
//     if (targetStep === 2 && form.paymentMethod === 'online' && !paymentVerified) {
//       toast.error('Please verify your payment before confirming order');
//       return false;
//     }
//     return true;
//   };

//   const handleNextStep = () => {
//     const nextStep = Math.min(STEPS.length - 1, step + 1);
//     if (step === nextStep) return;
    
//     // Specific validation for step 0
//     if (step === 0) {
//       if (form.orderType === 'delivery' && !form.address.trim()) {
//         toast.error('Please add your delivery address first');
//         return;
//       }
//       if (form.orderType === 'dine-in' && !form.scheduledTime) {
//         toast.error('Please select your booking time');
//         return;
//       }
//       if (form.orderType === 'dine-in' && !form.tableNumber.trim()) {
//         toast.error('Please enter your table number');
//         return;
//       }
//       if (form.isPreOrder && !form.scheduledTime) {
//         toast.error('Please select your pre-order time');
//         return;
//       }
//       if (scheduleError) {
//         toast.error(scheduleError);
//         return;
//       }
//       if (!form.acceptRules) {
//         toast.error('Please accept the terms and conditions to continue');
//         return;
//       }
//     }
    
//     if (!validateStep(nextStep)) return;
//     setStep(nextStep);
//   };

//   const handlePlaceOrder = async () => {
//     if (!validateOrder()) return;
//     setLoading(true);
//     try {
//       const { data } = await api.post('/orders', {
//         items: items.map((item) => ({
//           menuItemId: item.menuItemId,
//           quantity: item.quantity,
//           variant: item.variant,
//           addons: item.addons,
//         })),
//         orderType: form.orderType,
//         isPreOrder: form.isPreOrder,
//         preOrderMethod: form.isPreOrder ? (form.preOrderMethod || form.orderType) : undefined,
//         deliveryAddress: form.orderType === 'delivery'
//           ? { text: form.address, lat: form.location?.lat, lng: form.location?.lng }
//           : undefined,
//         scheduledTime: form.scheduledTime || undefined,
//         paymentMethod: resolvedPaymentMethod,
//         paymentReference: form.paymentMethod === 'online' ? form.paymentReference.trim() : undefined,
//         paymentVerified: paymentVerified,
//         tipAmount: deliveryTip,
//         customerAcceptedTerms: form.acceptRules,
//         couponCode: couponApplied ? form.couponCode.trim().toUpperCase() : undefined,
//         specialNotes: [
//           form.isPreOrder ? `Pre-order type: ${form.preOrderMethod || form.orderType}` : null,
//           form.orderType === 'dine-in' && form.tableNumber ? `Table ${form.tableNumber}` : null,
//           form.orderType === 'dine-in' ? `Guests: ${form.guestCount}` : null,
//           form.specialNotes || null,
//         ].filter(Boolean).join(' | '),
//       });

//       dispatch(clearCart());
//       clearOrderPreferences();
//       toast.success(`Order placed! #${data.order.orderId}`);
      
//       const trackingRoutes = {
//         delivery: `/track-delivery/${data.order._id}`,
//         takeaway: `/track-takeaway/${data.order._id}`,
//         'dine-in': `/track-dinein/${data.order._id}`,
//         'pre-order': `/track-preorder/${data.order._id}`,
//       };
      
//       navigate(trackingRoutes[form.orderType] || `/track/${data.order._id}`);
//     } catch (err) {
//       toast.error(err.response?.data?.message || 'Order could not be placed');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleSelectOffer = (offer) => {
//     setForm(prev => ({ ...prev, couponCode: offer.code }));
//     handleApplyCoupon(offer.code);
//   };

//   const getOrderTypeString = () => {
//     if (typeof form.orderType === 'string') return form.orderType;
//     return form.orderType?.value || 'delivery';
//   };

//   if (!preferencesLoaded) {
//     return (
//       <div className="min-h-screen bg-white flex items-center justify-center">
//         <div className="text-center">
//           <div className="w-12 h-12 border-4 border-[#b97844] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
//           <p className="text-[#6b5f54]">Loading...</p>
//         </div>
//       </div>
//     );
//   }

//   if (showOrderTypeSelector) {
//     return (
//       <div className="min-h-screen bg-white">
//         <header className="border-b border-[#e8e0d6] bg-white sticky top-0 z-50">
//           <div className="max-w-5xl mx-auto px-4 py-3">
//             <div className="flex items-center justify-between">
//               <Link to="/cart" className="flex items-center gap-2">
//                 <img 
//                   src="https://rollercoastercafe.com/assets/images/roller_logo.png" 
//                   alt="Logo"
//                   className="h-8 w-8 rounded-full object-cover"
//                 />
//                 <span className="font-semibold text-lg text-[#3f3328]">Roller Coaster Cafe</span>
//               </Link>
//               <Link to="/cart" className="text-sm text-[#b97844] hover:underline">
//                 Back to Cart
//               </Link>
//             </div>
//           </div>
//         </header>

//         <main className="max-w-2xl mx-auto px-4 py-12">
//           <OrderTypeSelector 
//             onComplete={(preferences) => {
//               const newPrefs = {
//                 deliveryMethod: preferences.deliveryMethod,
//                 scheduledDateTime: preferences.scheduledDateTime,
//                 isDineIn: preferences.isDineIn,
//                 isPreOrder: preferences.isPreOrder,
//                 preOrderMethod: preferences.preOrderMethod || '',
//                 timestamp: new Date().toISOString()
//               };
//               sessionStorage.setItem('orderPreferences', JSON.stringify(newPrefs));
//               window.location.reload();
//             }}
//           />
//         </main>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-white font-body">
//       <header className="sticky top-0 z-10 bg-white/90 backdrop-blur-xl border-b border-[#e8e0d6]">
//         <div className="max-w-5xl mx-auto px-4 py-3">
//           <div className="flex items-center justify-between">
//             <div className="flex items-center gap-3">
//               <img src="https://rollercoastercafe.com/assets/images/roller_logo.png" alt="Logo" className="h-8 w-8 rounded-full object-cover" />
//               <div>
//                 <h1 className="font-display font-bold text-xl text-[#3f3328]">Checkout</h1>
//                 <p className="text-xs text-[#6b5f54] capitalize">{getOrderTypeDisplay(form.orderType)} experience</p>
//               </div>
//             </div>
//             <Link to={`/menu?mode=${getOrderTypeString()}`} className="text-sm font-semibold text-[#b97844] hover:underline">
//               Back to menu
//             </Link>
//           </div>
//         </div>
//       </header>

//       <div className="max-w-5xl mx-auto px-4 py-6">
//         <OrderPreferences />

//         {items.length === 0 && (
//           <div className="rounded-xl p-5 mb-6 border border-amber-100 bg-amber-50/70">
//             <div className="flex items-start gap-4">
//               <div className="w-10 h-10 rounded-xl bg-white text-[#b97844] flex items-center justify-center shadow-sm">
//                 <CookingPot size={20} />
//               </div>
//               <div className="flex-1">
//                 <h2 className="font-display text-xl font-bold text-[#3f3328]">Add dishes before checkout</h2>
//                 <p className="text-sm text-[#6b5f54] mt-1">Add food from the menu to proceed.</p>
//               </div>
//               <Link to={`/menu?mode=${getOrderTypeString()}`} className="rounded-full bg-[#b97844] px-4 py-2 text-sm font-semibold text-white hover:bg-[#9e6538] transition-all whitespace-nowrap">
//                 Open Menu
//               </Link>
//             </div>
//           </div>
//         )}

//         <div className="rounded-xl bg-white shadow-sm border border-[#e8e0d6] p-3 mb-6 flex items-center justify-between gap-2 flex-wrap">
//           <div className="flex items-center gap-2 overflow-x-auto">
//             {STEPS.map((title, index) => (
//               <div key={title} className="flex items-center gap-1 shrink-0">
//                 <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
//                   index < step ? 'bg-green-500 text-white' : index === step ? 'bg-[#b97844] text-white' : 'bg-[#faf8f5] text-[#a0968c]'
//                 }`}>
//                   {index < step ? <CheckCircle size={12} /> : index + 1}
//                 </div>
//                 <span className={`text-xs font-medium hidden sm:block ${index === step ? 'text-[#3f3328]' : 'text-[#a0968c]'}`}>{title}</span>
//                 {index < STEPS.length - 1 && <ChevronRight size={12} className="text-[#e8e0d6]" />}
//               </div>
//             ))}
//           </div>
//           <div className="inline-flex items-center gap-1.5 rounded-full bg-[#faf8f5] px-3 py-1 text-xs font-semibold text-[#b97844]">
//             <BellRing size={12} /> Notifications active
//           </div>
//         </div>

//         <div className="grid lg:grid-cols-[1.2fr,0.8fr] gap-6">
//           <div className="space-y-4">
//             <AnimatePresence mode="wait">
//               {step === 0 && (
//                 <motion.div key="step0" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="rounded-xl bg-white shadow-sm border border-[#e8e0d6] p-5 space-y-4">
//                   {form.orderType === 'delivery' ? (
//                     <>
//                       <div>
//                         <h2 className="font-display font-bold text-lg text-[#3f3328] mb-1">{form.isPreOrder ? 'Pre-order delivery details' : 'Delivery address'}</h2>
//                         <p className="text-sm text-[#6b5f54]">{form.isPreOrder ? 'Add your delivery address and verify your current location for this scheduled order.' : 'Where should we deliver your order?'}</p>
//                         <p className="text-xs text-amber-600 mt-1">Delivery available within 30km of our cafe in Bareja.</p>
//                       </div>
//                       <div className="relative">
//                         <textarea
//                           value={form.address}
//                           onChange={(e) => { setDistanceError(null); setForm(prev => ({ ...prev, address: e.target.value, location: null })); }}
//                           placeholder="Enter your full delivery address..."
//                           className="w-full rounded-lg border border-[#e8e0d6] p-3 text-sm focus:border-[#b97844] focus:outline-none resize-none"
//                           rows={3}
//                         />
//                         {form.location && (
//                           <div className="absolute bottom-2 right-2">
//                             <div className="bg-green-100 text-green-600 rounded-full p-1">
//                               <CheckCircle size={14} />
//                             </div>
//                           </div>
//                         )}
//                       </div>
//                       <button 
//                         onClick={handleUseCurrentLocation} 
//                         disabled={locating || fetchingAddress} 
//                         className="inline-flex items-center gap-2 text-sm text-[#b97844] hover:underline disabled:opacity-50"
//                       >
//                         {(locating || fetchingAddress) ? (
//                           <>
//                             <Loader2 size={14} className="animate-spin" />
//                             {fetchingAddress ? 'Getting address...' : 'Getting location...'}
//                           </>
//                         ) : (
//                           <>
//                             <LocateFixed size={14} />
//                             Use current location
//                           </>
//                         )}
//                       </button>
//                       {form.isPreOrder && (
//                         <input
//                           type="datetime-local"
//                           value={form.scheduledTime}
//                           onChange={(e) => setForm(prev => ({ ...prev, scheduledTime: e.target.value }))}
//                           min={(() => {
//                             const date = new Date();
//                             date.setMinutes(date.getMinutes() + 30);
//                             return date.toISOString().slice(0, 16);
//                           })()}
//                           className="w-full rounded-lg border border-[#e8e0d6] p-2 text-sm focus:border-[#b97844] focus:outline-none"
//                         />
//                       )}
//                       {scheduleError && <p className="text-sm text-red-500">{scheduleError}</p>}
//                       {distanceError && (
//                         <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-600">
//                           {distanceError}
//                         </div>
//                       )}
//                       {form.location && !distanceError && (
//                         <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-sm text-green-700 flex items-start gap-2">
//                           <CheckCircle size={16} className="mt-0.5 flex-shrink-0" />
//                           <div>
//                             <p className="font-medium">Location verified!</p>
//                             <p className="text-xs">Your delivery address has been set to your current location.</p>
//                           </div>
//                         </div>
//                       )}
//                     </>
//                   ) : form.orderType === 'dine-in' ? (
//                     <>
//                       <div>
//                         <h2 className="font-display font-bold text-lg text-[#3f3328] mb-1">{form.isPreOrder ? 'Pre-order dine-in table' : 'Reserve your table'}</h2>
//                         <p className="text-sm text-[#6b5f54]">{form.isPreOrder ? 'Choose your table details and booking time for dine-in pre-order.' : 'Book your seat and time'}</p>
//                       </div>
//                       <div className="grid sm:grid-cols-2 gap-3">
//                         <input
//                           value={form.tableNumber}
//                           onChange={(e) => setForm(prev => ({ ...prev, tableNumber: e.target.value }))}
//                           placeholder="Table number or zone"
//                           className="w-full rounded-lg border border-[#e8e0d6] p-2 text-sm focus:border-[#b97844] focus:outline-none"
//                         />
//                         <input
//                           type="number"
//                           min="1"
//                           max="20"
//                           value={form.guestCount}
//                           onChange={(e) => setForm(prev => ({ ...prev, guestCount: Number(e.target.value) || 1 }))}
//                           className="w-full rounded-lg border border-[#e8e0d6] p-2 text-sm focus:border-[#b97844] focus:outline-none"
//                           placeholder="Guests"
//                         />
//                       </div>
//                       <input
//                         type="datetime-local"
//                         value={form.scheduledTime}
//                         onChange={(e) => setForm(prev => ({ ...prev, scheduledTime: e.target.value }))}
//                         className="w-full rounded-lg border border-[#e8e0d6] p-2 text-sm focus:border-[#b97844] focus:outline-none"
//                       />
//                     </>
//                   ) : (
//                     <>
//                       <div>
//                         <h2 className="font-display font-bold text-lg text-[#3f3328] mb-1">{form.isPreOrder ? 'Pre-order takeaway timing' : 'Special instructions'}</h2>
//                         <p className="text-sm text-[#6b5f54]">
//                           {form.isPreOrder ? 'When would you like your takeaway order ready for pickup?' : 'Any special requests?'}
//                         </p>
//                       </div>
//                       {form.isPreOrder && (
//                         <>
//                           <input
//                             type="datetime-local"
//                             value={form.scheduledTime}
//                             onChange={(e) => setForm(prev => ({ ...prev, scheduledTime: e.target.value }))}
//                             min={(() => {
//                               const date = new Date();
//                               date.setMinutes(date.getMinutes() + 30);
//                               return date.toISOString().slice(0, 16);
//                             })()}
//                             className="w-full rounded-lg border border-[#e8e0d6] p-2 text-sm focus:border-[#b97844] focus:outline-none"
//                           />
//                         </>
//                       )}
//                       {scheduleError && <p className="text-sm text-red-500">{scheduleError}</p>}
//                       <textarea
//                         value={form.specialNotes}
//                         onChange={(e) => setForm(prev => ({ ...prev, specialNotes: e.target.value }))}
//                         placeholder="Any special requests or notes..."
//                         className="w-full rounded-lg border border-[#e8e0d6] p-2 text-sm focus:border-[#b97844] focus:outline-none resize-none"
//                         rows={3}
//                       />
//                     </>
//                   )}

//                   <div className="rounded-xl bg-[#faf8f5] p-4">
//                     <div className="flex items-center gap-2 mb-2">
//                       <ShieldCheck size={14} className="text-[#b97844]" />
//                       <h3 className="font-semibold text-[#3f3328] text-sm">{activeRules.title}</h3>
//                     </div>
//                     <div className="space-y-1 text-xs text-[#6b5f54] mb-3">
//                       {activeRules.points.slice(0, 2).map((point, i) => <p key={i}>• {point}</p>)}
//                     </div>
//                     <label className="flex items-center gap-2 cursor-pointer">
//                       <input
//                         type="checkbox"
//                         checked={form.acceptRules}
//                         onChange={(e) => setForm(prev => ({ ...prev, acceptRules: e.target.checked }))}
//                         className="rounded border-[#e8e0d6] text-[#b97844] focus:ring-[#b97844]"
//                       />
//                       <span className="text-sm text-[#3f3328]">I accept the terms and conditions</span>
//                     </label>
//                   </div>
//                 </motion.div>
//               )}

//               {step === 1 && (
//                 <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="rounded-xl bg-white shadow-sm border border-[#e8e0d6] p-5 space-y-4">
//                   <div>
//                     <h2 className="font-display font-bold text-lg text-[#3f3328] mb-1">Payment method</h2>
//                     <p className="text-sm text-[#6b5f54]">Choose how you'd like to pay</p>
//                   </div>

//                   <div className="space-y-2">
//                     {selectedPaymentOptions.map(({ value, label, desc, icon: Icon }) => (
//                       <button
//                         key={value}
//                         onClick={() => {
//                           setForm(prev => ({ ...prev, paymentMethod: value }));
//                           setPaymentVerified(false);
//                         }}
//                         className={`w-full p-3 rounded-xl border-2 text-left transition-all ${
//                           form.paymentMethod === value ? 'border-[#b97844] bg-[#faf8f5]' : 'border-[#e8e0d6] hover:border-[#b97844]'
//                         }`}
//                       >
//                         <div className="flex items-center gap-3">
//                           <Icon size={16} className="text-[#b97844]" />
//                           <div>
//                             <p className="font-semibold text-[#3f3328] text-sm">{label}</p>
//                             <p className="text-xs text-[#6b5f54]">{desc}</p>
//                           </div>
//                         </div>
//                       </button>
//                     ))}
//                   </div>

//                   {form.paymentMethod === 'online' && (
//                     <div className="rounded-xl border border-[#e8e0d6] p-4 space-y-4">
//                       <div className="flex items-center gap-2">
//                         <CreditCard size={16} className="text-[#b97844]" />
//                         <h3 className="font-medium text-[#3f3328] text-sm">Online payment method</h3>
//                       </div>

//                       <div className="grid sm:grid-cols-1 gap-3">
//                         <button
//                           type="button"
//                           onClick={() => setForm(prev => ({ ...prev, onlineMethod: 'upi', paymentReference: '' }))}
//                           className={`rounded-xl border-2 p-3 text-left transition-all ${
//                             form.onlineMethod === 'upi' ? 'border-[#b97844] bg-[#faf8f5]' : 'border-[#e8e0d6]'
//                           }`}
//                         >
//                           <div className="flex items-center gap-2">
//                             <QrCode size={16} className="text-[#b97844]" />
//                             <div>
//                               <p className="font-semibold text-[#3f3328] text-sm">UPI QR</p>
//                               <p className="text-xs text-[#6b5f54]">Pay with any UPI app</p>
//                             </div>
//                           </div>
//                         </button>
//                       </div>

//                       <div className="space-y-3">
//                         <div className="rounded-xl bg-[#faf8f5] border border-[#e8e0d6] p-4 flex flex-col items-center gap-3">
//                           <QRCodeCanvas value={upiPaymentUri} size={160} includeMargin />
//                           <div className="text-center">
//                             <p className="text-sm font-semibold text-[#3f3328]">UPI ID</p>
//                             <p className="text-sm text-[#6b5f54] break-all">{CAFE_UPI_ID}</p>
//                             <p className="text-xs text-[#6b5f54] mt-1">Pay {formatCurrency(total)} and enter the transaction ID or payment reference below.</p>
//                           </div>
//                         </div>

//                         <input
//                           type="text"
//                           value={form.paymentReference}
//                           onChange={(e) => {
//                             const reference = e.target.value;
//                             setForm((prev) => ({ ...prev, paymentReference: reference }));
//                             if (paymentVerified) {
//                               setPaymentVerified(false);
//                             }
//                           }}
//                           placeholder="Enter transaction ID / payment reference"
//                           className="w-full rounded-lg border border-[#d9c2aa] px-4 py-3 text-sm outline-none focus:border-[#b97844]"
//                         />

//                         {!paymentVerified ? (
//                           <button
//                             onClick={verifyPayment}
//                             disabled={verifyingPayment}
//                             className="w-full rounded-lg bg-[#b97844] py-2 text-white font-semibold text-sm hover:bg-[#9e6538] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
//                           >
//                             {verifyingPayment ? (
//                               <>
//                                 <Loader2 size={16} className="animate-spin" />
//                                 Verifying payment...
//                               </>
//                             ) : (
//                               <>
//                                 <CheckCircle size={16} />
//                                 I Have Paid
//                               </>
//                             )}
//                           </button>
//                         ) : (
//                           <div className="bg-green-50 border border-green-200 rounded-lg p-3 flex items-center gap-2">
//                             <CheckCircle size={18} className="text-green-600" />
//                             <div>
//                               <p className="text-sm font-semibold text-green-700">Payment Complete</p>
//                               <p className="text-xs text-green-600">
//                                 Payment reference: {form.paymentReference}
//                               </p>
//                             </div>
//                           </div>
//                         )}
//                       </div>
//                     </div>
//                   )}

//                   {form.orderType === 'delivery' && (
//                     <div className="rounded-xl border border-[#e8e0d6] p-3">
//                       <div className="flex items-center gap-2 mb-2">
//                         <BadgeIndianRupee size={14} className="text-[#b97844]" />
//                         <h3 className="font-medium text-[#3f3328] text-sm">Delivery tip (Optional)</h3>
//                       </div>
//                       <div className="flex flex-wrap gap-2 mb-2">
//                         {QUICK_TIPS.map(amount => (
//                           <button
//                             key={amount}
//                             onClick={() => setForm(prev => ({ ...prev, tipAmount: amount }))}
//                             className={`px-3 py-1 rounded-full text-xs transition-all ${
//                               form.tipAmount === amount ? 'bg-[#b97844] text-white' : 'border border-[#e8e0d6] text-[#6b5f54] hover:border-[#b97844]'
//                             }`}
//                           >
//                             ₹{amount}
//                           </button>
//                         ))}
//                       </div>
//                       <input
//                         type="number"
//                         min="0"
//                         value={form.tipAmount}
//                         onChange={(e) => setForm(prev => ({ ...prev, tipAmount: Number(e.target.value) || 0 }))}
//                         placeholder="Custom amount"
//                         className="w-full rounded-lg border border-[#e8e0d6] p-2 text-sm focus:border-[#b97844] focus:outline-none"
//                       />
//                     </div>
//                   )}

//                   <div className="rounded-xl bg-[#faf8f5] p-4">
//                     <div className="flex items-center justify-between mb-3">
//                       <div className="flex items-center gap-2">
//                         <Tag size={18} className="text-[#b97844]" />
//                         <h3 className="font-semibold text-[#3f3328] text-base">Coupon Code</h3>
//                       </div>
//                       <button
//                         onClick={() => setShowOffersModal(true)}
//                         className="text-sm text-[#b97844] hover:underline font-medium"
//                       >
//                         View All Offers
//                       </button>
//                     </div>
                    
//                     {!couponApplied ? (
//                       <div className="flex gap-3">
//                         <div className="relative flex-1">
//                           <Tag size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#a0968c]" />
//                           <input
//                             value={form.couponCode}
//                             onChange={(e) => {
//                               setForm(prev => ({ ...prev, couponCode: e.target.value.toUpperCase() }));
//                             }}
//                             placeholder="Enter coupon code"
//                             className="w-full rounded-lg border border-[#e8e0d6] bg-white pl-9 pr-3 py-2.5 text-base focus:border-[#b97844] focus:outline-none"
//                           />
//                         </div>
//                         <button
//                           onClick={() => handleApplyCoupon()}
//                           disabled={!form.couponCode.trim()}
//                           className="rounded-lg border border-[#b97844] px-5 py-2.5 text-base font-semibold text-[#b97844] hover:bg-[#b97844] hover:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
//                         >
//                           Apply
//                         </button>
//                       </div>
//                     ) : (
//                       <div className="bg-green-50 rounded-lg p-4">
//                         <div className="flex items-center justify-between">
//                           <div className="flex items-center gap-3">
//                             <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
//                               <CheckCircle size={20} className="text-green-600" />
//                             </div>
//                             <div>
//                               <p className="font-semibold text-[#3f3328] text-base">Coupon Applied!</p>
//                               <p className="text-sm text-green-700">
//                               {discountMeta?.discountLabel || 'Discount'} - Saved {formatCurrency(discount)}
//                               </p>
//                               <p className="text-xs text-[#6b5f54] mt-1">Code: {form.couponCode}</p>
//                             </div>
//                           </div>
//                           <button
//                             onClick={handleRemoveCoupon}
//                             className="px-4 py-2 rounded-lg border border-red-200 text-red-500 text-sm font-medium hover:bg-red-50 transition-all"
//                           >
//                             Remove
//                           </button>
//                         </div>
//                       </div>
//                     )}
//                   </div>

//                 </motion.div>
//               )}

//               {step === 2 && (
//                 <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="rounded-xl bg-white shadow-sm border border-[#e8e0d6] p-5 space-y-4">
//                   <div>
//                     <h2 className="font-display font-bold text-lg text-[#3f3328] mb-1">Confirm your order</h2>
//                     <p className="text-sm text-[#6b5f54]">Review details before placing order</p>
//                   </div>

//                   <div className="rounded-xl bg-[#faf8f5] p-4 space-y-2 text-base">
//                     <div className="flex justify-between">
//                       <span className="text-[#6b5f54]">Order type</span>
//                       <span className="font-semibold text-[#3f3328] capitalize">{getOrderTypeDisplay(form.orderType)}</span>
//                     </div>
//                     {form.address && <div className="flex justify-between"><span className="text-[#6b5f54]">Address</span><span className="font-semibold text-[#3f3328] text-right">{form.address}</span></div>}
//                     {form.tableNumber && <div className="flex justify-between"><span className="text-[#6b5f54]">Table</span><span className="font-semibold text-[#3f3328]">{form.tableNumber}</span></div>}
//                     {form.scheduledTime && <div className="flex justify-between"><span className="text-[#6b5f54]">Scheduled</span><span className="font-semibold text-[#3f3328]">{new Date(form.scheduledTime).toLocaleString()}</span></div>}
//                     <div className="flex justify-between">
//                       <span className="text-[#6b5f54]">Payment</span>
//                       <span className="font-semibold text-[#3f3328] capitalize">
//                         {form.paymentMethod === 'online' ? `Online (${form.onlineMethod})` : form.paymentMethod}
//                       </span>
//                     </div>
//                     {form.paymentMethod === 'online' && (
//                       <div className="flex justify-between">
//                         <span className="text-[#6b5f54]">Payment Status</span>
//                         <span className="font-semibold text-green-600 flex items-center gap-1">
//                           <CheckCircle size={14} /> Verified
//                         </span>
//                       </div>
//                     )}
//                     {form.paymentMethod === 'online' && form.paymentReference && (
//                       <div className="flex justify-between">
//                         <span className="text-[#6b5f54]">Reference</span>
//                         <span className="font-semibold text-[#3f3328] text-right break-all max-w-[200px]">{form.paymentReference}</span>
//                       </div>
//                     )}
//                     {form.tipAmount > 0 && <div className="flex justify-between"><span className="text-[#6b5f54]">Tip</span><span className="font-semibold text-[#3f3328]">{formatCurrency(form.tipAmount)}</span></div>}
//                     {couponApplied && discount > 0 && <div className="flex justify-between"><span className="text-[#6b5f54]">Discount</span><span className="font-semibold text-green-600">-{formatCurrency(discount)}</span></div>}
//                   </div>

//                   <div className="rounded-xl border border-[#e8e0d6] p-4">
//                     <div className="flex items-center gap-2 mb-2">
//                       <BellRing size={14} className="text-[#b97844]" />
//                       <h3 className="font-medium text-[#3f3328] text-sm">Notification flow</h3>
//                     </div>
//                     <div className="space-y-1 text-xs text-[#6b5f54]">
//                       {NOTIFICATION_STEPS.slice(0, 3).map(item => <p key={item}>• {item}</p>)}
//                       <p className="text-[#b97844] text-xs pt-1">{activeRules.notifications}</p>
//                     </div>
//                   </div>

//                   <button
//                     onClick={handlePlaceOrder}
//                     disabled={loading || !items.length}
//                     className="w-full rounded-lg bg-[#b97844] py-3 text-white font-semibold text-base hover:bg-[#9e6538] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
//                   >
//                     {loading ? (
//                       <>
//                         <Loader2 size={18} className="animate-spin" />
//                         Placing Order...
//                       </>
//                     ) : (
//                       `Place Order - ${formatCurrency(total)}`
//                     )}
//                   </button>
//                 </motion.div>
//               )}
//             </AnimatePresence>

//             <div className="flex justify-between pt-2">
//               {step > 0 && (
//                   <button onClick={() => setStep(s => s - 1)} className="rounded-lg border border-[#e8e0d6] px-5 py-2 text-sm text-[#6b5f54] hover:border-[#b97844] hover:text-[#b97844] transition-all">
//                     Back
//                   </button>
//               )}
//               {step < 2 ? (
//                 <button 
//                   onClick={handleNextStep} 
//                   disabled={step === 1 && form.paymentMethod === 'online' && !paymentVerified}
//                   className="rounded-lg bg-[#b97844] px-5 py-2 text-sm text-white hover:bg-[#9e6538] transition-all ml-auto disabled:opacity-50 disabled:cursor-not-allowed"
//                 >
//                   Continue
//                 </button>
//               ) : null}
//             </div>
//           </div>

//           <aside className="rounded-xl bg-white shadow-sm border border-[#e8e0d6] p-5 h-fit sticky top-24">
//             <h2 className="font-semibold text-lg text-[#3f3328] mb-3">Order Summary</h2>
            
//             <div className="space-y-2 max-h-48 overflow-y-auto mb-4">
//               {items.slice(0, 5).map((item) => (
//                 <div key={item.key} className="flex justify-between text-base">
//                   <span className="text-[#6b5f54] truncate pr-2">{item.quantity} {item.name}</span>
//                   <span className="text-[#3f3328]">{formatCurrency(item.basePrice * item.quantity)}</span>
//                 </div>
//               ))}
//               {items.length > 5 && <p className="text-sm text-[#a0968c]">+{items.length - 5} more items</p>}
//             </div>

//             <div className="space-y-3 text-base border-t border-[#e8e0d6] pt-4">
//               <div className="flex justify-between">
//                 <span className="text-[#6b5f54]">Subtotal</span>
//                 <span className="text-[#3f3328]">{formatCurrency(subtotal)}</span>
//               </div>
//               <div className="flex justify-between">
//                 <span className="text-[#6b5f54]">GST (5%)</span>
//                 <span className="text-[#3f3328]">{formatCurrency(tax)}</span>
//               </div>
//               {deliveryFee > 0 && (
//                 <div className="flex justify-between">
//                   <span className="text-[#6b5f54]">Delivery Fee</span>
//                   <span className="text-[#3f3328]">{formatCurrency(deliveryFee)}</span>
//                 </div>
//               )}
//               {preOrderServiceFee > 0 && (
//                 <div className="flex justify-between">
//                   <span className="text-[#6b5f54]">Pre-order Fee</span>
//                   <span className="text-[#3f3328]">{formatCurrency(preOrderServiceFee)}</span>
//                 </div>
//               )}
//               {form.tipAmount > 0 && (
//                 <div className="flex justify-between">
//                   <span className="text-[#6b5f54]">Tip</span>
//                   <span className="text-[#3f3328]">{formatCurrency(form.tipAmount)}</span>
//                 </div>
//               )}
//               {discount > 0 && (
//                 <div className="flex justify-between text-green-600">
//                   <span>Discount</span>
//                   <span>-{formatCurrency(discount)}</span>
//                 </div>
//               )}
//               <div className="flex justify-between font-bold text-xl pt-3 border-t border-[#e8e0d6]">
//                 <span className="text-[#3f3328]">Total</span>
//                 <span className="text-[#b97844]">{formatCurrency(total)}</span>
//               </div>
//             </div>

//             <div className="mt-4 p-3 bg-[#faf8f5] rounded-lg text-sm text-[#6b5f54]">
//               <p className="font-medium text-[#3f3328] mb-1">Customer promise</p>
//               <p>Real-time notifications, secure payment, easy tracking.</p>
//             </div>
//           </aside>
//         </div>
//       </div>

//       {showOffersModal && (
//         <OffersModal
//           onClose={() => setShowOffersModal(false)}
//           onSelectOffer={handleSelectOffer}
//         />
//       )}
//       <CustomerFooter />
//     </div>
//   );
// }
import { useEffect, useMemo, useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useQuery } from '@tanstack/react-query';
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

import {
  MapPin,
  ChevronRight,
  Tag,
  CheckCircle,
  LocateFixed,
  CalendarDays,
  Users,
  CookingPot,
  Table2,
  Truck,
  ShoppingBag,
  BellRing,
  ShieldCheck,
  CreditCard,
  QrCode,
  BadgeIndianRupee,
  Clock,
  Home,
  X,
  Phone,
  Mail,
  Navigation,
  Loader2
} from 'lucide-react';
import { QRCodeCanvas } from 'qrcode.react';
import toast from 'react-hot-toast';
import api from '../../services/api';
import CustomerFooter from '../../components/customer/CustomerFooter';
import { selectCartItems, selectCartSubtotal, clearCart, setOrderType } from '../../store/slices/cartSlice';
import OffersModal from '../../components/customer/OffersModal';
import OrderTypeSelector from '../../components/customer/OrderTypeSelector';
import OrderPreferences from '../../components/customer/OrderPreferences';
import { getOrderPreferences, clearOrderPreferences, saveOrderPreferences } from '../../utils/orderPreferences';
import { toDateTimeLocalValue, toScheduleIsoString } from '../../utils/scheduleTime';

const STEPS = ['Details', 'Payment', 'Confirm'];
const PAYMENT_METHODS = [
  { value: 'cod', label: 'Cash on Delivery', desc: 'Pay when you receive', icon: BadgeIndianRupee },
  { value: 'online', label: 'Pay Online', desc: 'Pay first using UPI', icon: CreditCard },
];
const PREORDER_MIN_MINUTES = 30;
const PREORDER_MAX_MINUTES = 240;
const DINEIN_MIN_MINUTES = 10;
const DINEIN_MAX_MINUTES = 720;
const QUICK_TIPS = [20, 50, 100];
const CAFE_UPI_ID = import.meta.env.VITE_CAFE_UPI_ID || 'kashishsolanki8082@okaxis';
const ORDER_RULES = {
  delivery: {
    title: 'Delivery rules',
    points: [
      'Add a full address or use current location so the rider can trace you accurately.',
      'Status notifications are sent at placed, confirmed, preparing, out for delivery, and delivered.',
      'Keep your phone reachable once the order moves out for delivery.',
      'Delivery available within 30km radius of our cafe.',
    ],
    notifications: 'Push, email, and SMS updates remain enabled across the delivery journey.',
    trackUrl: (orderId) => `/track-delivery/${orderId}`,
  },
  takeaway: {
    title: 'Takeaway rules',
    points: [
      'Pickup begins only after the ready notification is sent to you.',
      'Please collect your order within 20 minutes of the ready alert so food quality stays best.',
      'Counter staff can ask for your order ID or registered phone number before handoff.',
      'If you are delayed, contact the cafe so pickup can be re-timed when possible.',
    ],
    notifications: 'Placed, confirmed, preparing, and ready alerts are sent before pickup.',
    trackUrl: (orderId) => `/track-takeaway/${orderId}`,
  },
  'dine-in': {
    title: 'Table booking terms',
    points: [
      'Booked tables are held for 15 minutes from the selected time slot.',
      'Guest count should match the reservation as closely as possible for proper seating.',
      'Large seating changes or late arrival may move you to the next available table.',
      'Special arrangements depend on cafe availability and are confirmed at service time.',
    ],
    notifications: 'You receive confirmation, reminder, and table-ready notifications.',
    trackUrl: (orderId) => `/track-dinein/${orderId}`,
  },
  'pre-order': {
    title: 'Pre-order terms',
    points: [
      'Pre-orders should be placed at least 30 minutes before arrival so the kitchen can finish on time.',
      'Pre-orders are prepared to be ready when you reach the cafe or pickup point.',
      'Your order is held for 20 minutes after the selected slot before staff may re-time the handoff.',
      'Pre-order uses a priority kitchen fee because the meal starts before you reach the cafe.',
      'Free cancellation up to 2 hours before, 50% charge for cancellation within 1-2 hours.',
    ],
    notifications: 'Placed, accepted, kitchen started, almost ready, and ready-for-arrival alerts are sent.',
    trackUrl: (orderId) => `/track-preorder/${orderId}`,
  },
};

const NOTIFICATION_STEPS = [
  'Order placed',
  'Order accepted by cafe',
  'Kitchen has started preparing',
  'Order is ready',
  'Order completed successfully',
];

// DEFAULT CAFE ADDRESS
const DEFAULT_CAFE_ADDRESS = {
  id: 'cafe-default',
  label: 'Home',
  icon: 'home',
  address: 'Under Nutan School, Juna Road, Opposite Navjeevan Hospital, Bareja, Ahmedabad, Gujarat 382425',
  isDefault: true,
};

const CAFE_LOCATION = {
  lat: 22.8173,
  lng: 72.6002,
  address: DEFAULT_CAFE_ADDRESS.address
};

const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
};

// Function to get address from coordinates using reverse geocoding
const getAddressFromCoordinates = async (lat, lng) => {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);

  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1&zoom=18&accept-language=en`,
      {
        signal: controller.signal,
        headers: {
          'Accept-Language': 'en',
          'User-Agent': 'RollerCoasterCafe/1.0'
        }
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch address');
    }

    const data = await response.json();
    const address = data?.address || {};

    const formattedAddress = [
      [address.house_number, address.road].filter(Boolean).join(' ').trim(),
      address.neighbourhood || address.hamlet,
      address.suburb || address.city_district || address.county,
      address.city || address.town || address.village || address.municipality,
      address.state_district,
      address.state,
      address.postcode,
    ]
      .filter(Boolean)
      .filter((value, index, values) => values.indexOf(value) === index)
      .join(', ');

    if (formattedAddress) {
      return formattedAddress;
    }

    if (data?.display_name) {
      return data.display_name;
    }

    return `Current location near ${lat.toFixed(5)}, ${lng.toFixed(5)}`;
  } catch (error) {
    console.error('Reverse geocoding error:', error);
    return `Current location near ${lat.toFixed(5)}, ${lng.toFixed(5)}`;
  } finally {
    clearTimeout(timeout);
  }
};

function getScheduleError(orderType, scheduledTime) {
  if (!scheduledTime) return '';
  const selected = new Date(scheduledTime);
  if (isNaN(selected.getTime())) return 'Please choose a valid schedule time.';
  const diffMinutes = Math.round((selected.getTime() - Date.now()) / 60000);
  if (orderType === 'pre-order') {
    if (diffMinutes < PREORDER_MIN_MINUTES) return `Pre-orders must be scheduled at least ${PREORDER_MIN_MINUTES} minutes ahead.`;
    if (diffMinutes > PREORDER_MAX_MINUTES) return `We accept pre-order delivery only under ${Math.floor(PREORDER_MAX_MINUTES / 60)} hours.`;
  }
  if (orderType === 'dine-in') {
    if (diffMinutes < DINEIN_MIN_MINUTES) return `Dine-in bookings must be scheduled at least ${DINEIN_MIN_MINUTES} minutes ahead.`;
    if (diffMinutes > DINEIN_MAX_MINUTES) return 'Dine-in bookings are limited to same day service window.';
  }
  return '';
}

function getDisplayScheduleValue(value) {
  return toDateTimeLocalValue(value) || value || '';
}

export default function CheckoutExperience() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const items = useSelector(selectCartItems);
  const subtotal = useSelector(selectCartSubtotal);

  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [locating, setLocating] = useState(false);
  const [couponApplied, setCouponApplied] = useState(false);
  const [discount, setDiscount] = useState(0);
  const [discountMeta, setDiscountMeta] = useState(null);
  const [showOffersModal, setShowOffersModal] = useState(false);
  const [distanceError, setDistanceError] = useState(null);
  const [preferencesLoaded, setPreferencesLoaded] = useState(false);
  const [showOrderTypeSelector, setShowOrderTypeSelector] = useState(false);
  const [paymentVerified, setPaymentVerified] = useState(false);
  const [verifyingPayment, setVerifyingPayment] = useState(false);
  const [fetchingAddress, setFetchingAddress] = useState(false);
  const paymentCheckInterval = useRef(null);
  
  const [form, setForm] = useState({
    orderType: 'delivery',
    address: '',
    scheduledTime: '',
    paymentMethod: 'cod',
    onlineMethod: 'upi',
    paymentReference: '',
    couponCode: '',
    specialNotes: '',
    tableNumber: '',
    guestCount: 2,
    location: null,
    acceptRules: false,
    tipAmount: 0,
    isPreOrder: false,
    preOrderMethod: '',
    preOrderArea: '',
  });

  const getOrderTypeDisplay = (orderType) => {
    if (typeof orderType === 'string') {
      switch(orderType) {
        case 'delivery': return 'Delivery';
        case 'takeaway': return 'Takeaway';
        case 'dine-in': return 'Dine-In';
        case 'pre-order': return 'Pre-Order';
        default: return orderType;
      }
    }
    return 'Order';
  };

  useEffect(() => {
    return () => {
      if (paymentCheckInterval.current) {
        clearInterval(paymentCheckInterval.current);
      }
    };
  }, []);

  useEffect(() => {
    if (step === 1 && form.paymentMethod === 'online' && paymentVerified) {
      setStep(STEPS.length - 1);
    }
  }, [form.paymentMethod, paymentVerified, step]);

  useEffect(() => {
    const savedPreferences = getOrderPreferences();
    const requestedMode = searchParams.get('mode');

    if (requestedMode === 'pre-order' && (!savedPreferences || !savedPreferences.isPreOrder)) {
      clearOrderPreferences();
      setPreferencesLoaded(true);
      setShowOrderTypeSelector(true);
      return;
    }
    
    if (savedPreferences && savedPreferences.deliveryMethod) {
      const deliveryMethod = savedPreferences.deliveryMethod;
      
      const effectiveMethod = savedPreferences.isPreOrder ? (savedPreferences.preOrderMethod || deliveryMethod) : deliveryMethod;

      setForm(prev => ({
        ...prev,
        orderType: effectiveMethod,
        address: savedPreferences.address || '',
        location: savedPreferences.location || null,
        scheduledTime: getDisplayScheduleValue(savedPreferences.scheduledDateTime),
        tableNumber: savedPreferences.tableNumber || '',
        guestCount: savedPreferences.guestCount || 2,
        isPreOrder: Boolean(savedPreferences.isPreOrder),
        preOrderMethod: savedPreferences.preOrderMethod || '',
      }));
      
      dispatch(setOrderType(effectiveMethod));
      setPreferencesLoaded(true);
      setShowOrderTypeSelector(false);
      setStep(0);
    } else if (requestedMode && ['delivery', 'takeaway'].includes(requestedMode)) {
      setForm(prev => ({
        ...prev,
        orderType: requestedMode,
        isPreOrder: false,
        preOrderMethod: '',
      }));
      dispatch(setOrderType(requestedMode));
      saveOrderPreferences({
        deliveryMethod: requestedMode,
        isPreOrder: false,
        isDineIn: false,
        preOrderMethod: '',
        timestamp: new Date().toISOString(),
      });
      setPreferencesLoaded(true);
      setShowOrderTypeSelector(false);
      setStep(0);
    } else {
      setPreferencesLoaded(true);
      setShowOrderTypeSelector(true);
    }
  }, [dispatch, searchParams]);

  useEffect(() => {
    if (!preferencesLoaded || form.orderType !== 'delivery') {
      return;
    }

    const savedPreferences = getOrderPreferences() || {};
    saveOrderPreferences({
      ...savedPreferences,
      deliveryMethod: savedPreferences.deliveryMethod || form.orderType,
      isPreOrder: Boolean(form.isPreOrder),
      preOrderMethod: form.preOrderMethod || savedPreferences.preOrderMethod || '',
      scheduledDateTime:
        toScheduleIsoString(form.scheduledTime) ||
        savedPreferences.scheduledDateTime ||
        '',
      address: form.address,
      location: form.location || null,
      timestamp: new Date().toISOString(),
    });
  }, [
    form.address,
    form.isPreOrder,
    form.location,
    form.orderType,
    form.preOrderMethod,
    form.scheduledTime,
    preferencesLoaded,
  ]);

  useEffect(() => {
    if (form.isPreOrder && form.paymentMethod !== 'online') {
      setForm(prev => ({ ...prev, paymentMethod: 'online', onlineMethod: 'upi' }));
    }
  }, [form.isPreOrder, form.paymentMethod]);

  const effectiveOrderType = form.isPreOrder ? 'pre-order' : form.orderType;
  const activeRules = ORDER_RULES[effectiveOrderType] || ORDER_RULES.delivery;
  const preOrderServiceFee = form.isPreOrder ? 49 : 0;
  const tax = Math.round(subtotal * 0.05);
  const deliveryFee = form.orderType === 'delivery' ? 30 : 0;
  const deliveryTip = form.orderType === 'delivery' ? Math.max(0, Number(form.tipAmount) || 0) : 0;
  const total = subtotal + tax + deliveryFee + preOrderServiceFee + deliveryTip - discount;
  
  const selectedPaymentOptions = useMemo(() => {
    if (form.isPreOrder) {
      return PAYMENT_METHODS.filter((method) => method.value === 'online');
    }
    return PAYMENT_METHODS;
  }, [form.isPreOrder]);
  
  const resolvedPaymentMethod = form.paymentMethod;
  const upiPaymentUri = `upi://pay?pa=${encodeURIComponent(CAFE_UPI_ID)}&pn=${encodeURIComponent('Roller Coaster Cafe')}&am=${encodeURIComponent(total.toFixed(2))}&cu=INR&tn=${encodeURIComponent(`Order payment for ${getOrderTypeDisplay(form.orderType)}`)}`;

  const formatCurrency = (amount) => `₹${Number(amount || 0).toFixed(2)}`;

  const scheduleError = useMemo(
    () => getScheduleError(effectiveOrderType, form.scheduledTime),
    [effectiveOrderType, form.scheduledTime]
  );

  const verifyPayment = async () => {
    if (!form.paymentReference || form.paymentReference.trim().length < 6) {
      toast.error('Please enter transaction ID / payment reference');
      return false;
    }

    setVerifyingPayment(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 600));
      const reference = form.paymentReference.trim();
      setForm((prev) => ({
        ...prev,
        paymentReference: reference,
      }));
      setPaymentVerified(true);
      toast.success('Payment verified successfully!');
      setStep(STEPS.length - 1);
      return true;
    } catch {
      setPaymentVerified(false);
      toast.error('Could not verify payment. Please try again.');
      return false;
    } finally {
      setVerifyingPayment(false);
    }
  };

  const handleApplyCoupon = async (code = null) => {
    const couponCode = code || form.couponCode;
    if (!couponCode?.trim()) {
      toast.error('Enter a coupon code first');
      return;
    }

    try {
      const { data } = await api.post('/customer/validate-coupon', {
        code: couponCode,
        orderAmount: subtotal,
      });
      setDiscount(data.discount || 0);
      setDiscountMeta(data.promotion || null);
      setCouponApplied(true);
      setForm(prev => ({ ...prev, couponCode: couponCode.toUpperCase() }));
      toast.success(data.message || 'Coupon applied successfully');
    } catch (err) {
      setDiscount(0);
      setDiscountMeta(null);
      setCouponApplied(false);
      toast.error(err.response?.data?.message || 'Invalid coupon code');
    }
  };

  const handleRemoveCoupon = () => {
    setCouponApplied(false);
    setDiscount(0);
    setDiscountMeta(null);
    setForm(prev => ({ ...prev, couponCode: '' }));
    toast.success('Coupon removed');
  };

  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast.error('Geolocation is not supported');
      return;
    }
    setLocating(true);
    setDistanceError(null);
    setFetchingAddress(true);
    
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        
        const distance = calculateDistance(latitude, longitude, CAFE_LOCATION.lat, CAFE_LOCATION.lng);
        
        if (distance > 30) {
          setDistanceError(`Sorry, delivery is only available within 30km of our cafe. Your location is ${distance.toFixed(1)}km away.`);
          setLocating(false);
          setFetchingAddress(false);
          return;
        }
        
        try {
          const address = await getAddressFromCoordinates(latitude, longitude);
          
          setForm((prev) => ({
            ...prev,
            address: address,
            location: { lat: latitude, lng: longitude },
          }));
          
          toast.success(`Location found! You're within delivery zone (${distance.toFixed(1)}km)`);
        } catch (error) {
          console.error('Error fetching address:', error);
          setForm((prev) => ({
            ...prev,
            address: `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`,
            location: { lat: latitude, lng: longitude },
          }));
          toast.warning('Location detected but could not fetch full address. Please verify your address.');
        } finally {
          setLocating(false);
          setFetchingAddress(false);
        }
      },
      (error) => {
        console.error('Geolocation error:', error);
        let errorMessage = 'Unable to fetch location. ';
        switch(error.code) {
          case error.PERMISSION_DENIED:
            errorMessage += 'Please allow location access.';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage += 'Location information is unavailable.';
            break;
          case error.TIMEOUT:
            errorMessage += 'Location request timed out.';
            break;
          default:
            errorMessage += 'Please try again or enter address manually.';
        }
        toast.error(errorMessage);
        setLocating(false);
        setFetchingAddress(false);
      },
      {
        enableHighAccuracy: true,
        maximumAge: 0,
        timeout: 15000,
      }
    );
  };

  const validateOrder = () => {
    if (!items.length) {
      toast.error('Add food before placing the order');
      return false;
    }
    if (form.orderType === 'delivery' && !form.address.trim()) {
      toast.error('Please add your full delivery address');
      return false;
    }
    if ((form.isPreOrder || form.orderType === 'dine-in') && !form.scheduledTime) {
      toast.error('Please choose a schedule time first');
      return false;
    }
    if (scheduleError) {
      toast.error(scheduleError);
      return false;
    }
    if (form.isPreOrder && form.paymentMethod !== 'online') {
      toast.error('Pre-order currently requires online payment');
      return false;
    }
    if (form.paymentMethod === 'online') {
      if (!form.paymentReference.trim()) {
        toast.error('Please enter your payment reference');
        return false;
      }
      if (!paymentVerified) {
        toast.error('Please verify your payment first');
        return false;
      }
    }
    if (!form.acceptRules) {
      toast.error('Please accept the order rules');
      return false;
    }
    return true;
  };

  const validateStep = (targetStep = step) => {
    if (targetStep === 0) {
      if (form.orderType === 'delivery' && !form.address.trim()) {
        toast.error('Please add your full delivery address');
        return false;
      }
      if (form.orderType === 'dine-in' && !form.scheduledTime) {
        toast.error('Please choose your booking time');
        return false;
      }
      if (form.orderType === 'dine-in' && !form.tableNumber.trim()) {
        toast.error('Please enter a table number');
        return false;
      }
      if (scheduleError) {
        toast.error(scheduleError);
        return false;
      }
      if (form.isPreOrder && !form.scheduledTime) {
        toast.error('Please choose a pre-order time');
        return false;
      }
      if (!form.acceptRules) {
        toast.error('Please accept the order rules');
        return false;
      }
    }
    if (targetStep === 1 && !form.paymentMethod) {
      toast.error('Please choose a payment method');
      return false;
    }
    if (targetStep === 2 && form.paymentMethod === 'online' && !paymentVerified) {
      toast.error('Please verify your payment before confirming order');
      return false;
    }
    return true;
  };

  const handleNextStep = () => {
    const nextStep = Math.min(STEPS.length - 1, step + 1);
    if (step === nextStep) return;
    
    if (step === 0) {
      if (form.orderType === 'delivery' && !form.address.trim()) {
        toast.error('Please add your delivery address first');
        return;
      }
      if (form.orderType === 'dine-in' && !form.scheduledTime) {
        toast.error('Please select your booking time');
        return;
      }
      if (form.orderType === 'dine-in' && !form.tableNumber.trim()) {
        toast.error('Please enter your table number');
        return;
      }
      if (form.isPreOrder && !form.scheduledTime) {
        toast.error('Please select your pre-order time');
        return;
      }
      if (scheduleError) {
        toast.error(scheduleError);
        return;
      }
      if (!form.acceptRules) {
        toast.error('Please accept the terms and conditions to continue');
        return;
      }
    }
    
    if (!validateStep(nextStep)) return;
    setStep(nextStep);
  };

  const handlePlaceOrder = async () => {
    if (!validateOrder()) return;
    setLoading(true);
    try {
      const normalizedScheduledTime = toScheduleIsoString(form.scheduledTime) || form.scheduledTime || undefined;
      const orderData = {
        items: items.map((item) => ({
          menuItemId: item.menuItemId,
          quantity: item.quantity,
          variant: item.variant,
          addons: item.addons,
        })),
        orderType: form.isPreOrder ? 'pre-order' : form.orderType,
        isPreOrder: form.isPreOrder,
        preOrderMethod: form.isPreOrder ? (form.preOrderMethod || form.orderType) : undefined,
        preOrderFee: preOrderServiceFee,
        scheduledTime: normalizedScheduledTime,
        paymentMethod: resolvedPaymentMethod,
        paymentReference: form.paymentMethod === 'online' ? form.paymentReference.trim() : undefined,
        paymentVerified: paymentVerified,
        tipAmount: deliveryTip,
        customerAcceptedTerms: form.acceptRules,
        couponCode: couponApplied ? form.couponCode.trim().toUpperCase() : undefined,
        specialNotes: [
          form.isPreOrder ? `Pre-order type: ${form.preOrderMethod || form.orderType}` : null,
          form.isPreOrder && normalizedScheduledTime
            ? `Scheduled for: ${new Date(normalizedScheduledTime).toLocaleString()}`
            : null,
          form.orderType === 'dine-in' && form.tableNumber ? `Table ${form.tableNumber}` : null,
          form.orderType === 'dine-in' ? `Guests: ${form.guestCount}` : null,
          form.specialNotes || null,
        ].filter(Boolean).join(' | '),
      };

      // Add delivery address if applicable
      if (form.orderType === 'delivery') {
        orderData.deliveryAddress = {
          text: form.address,
          lat: form.location?.lat,
          lng: form.location?.lng
        };
      }

      // Add table info for dine-in
      if (form.orderType === 'dine-in') {
        orderData.tableNumber = form.tableNumber;
        orderData.guestCount = form.guestCount;
      }

      const { data } = await api.post('/orders', orderData);

      dispatch(clearCart());
      clearOrderPreferences();
      toast.success(`Order placed! #${data.order.orderId}`);
      
      // Redirect to appropriate tracking page
      let trackingPath = `/track/${data.order._id}`;
      if (form.isPreOrder) {
        trackingPath = `/track-preorder/${data.order._id}`;
      } else if (form.orderType === 'delivery') {
        trackingPath = `/track-delivery/${data.order._id}`;
      } else if (form.orderType === 'takeaway') {
        trackingPath = `/track-takeaway/${data.order._id}`;
      } else if (form.orderType === 'dine-in') {
        trackingPath = `/track-dinein/${data.order._id}`;
      }
      
      navigate(trackingPath);
    } catch (err) {
      console.error('Order placement error:', err);
      toast.error(err.response?.data?.message || 'Order could not be placed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectOffer = (offer) => {
    setForm(prev => ({ ...prev, couponCode: offer.code }));
    handleApplyCoupon(offer.code);
  };

  const getOrderTypeString = () => {
    if (typeof form.orderType === 'string') return form.orderType;
    return form.orderType?.value || 'delivery';
  };
  const backTarget = location.state?.from || '/cart';

  if (!preferencesLoaded) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#b97844] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[#6b5f54]">Loading...</p>
        </div>
      </div>
    );
  }

  if (showOrderTypeSelector) {
    return (
      <div className="min-h-screen bg-white">
        <header className="border-b border-[#e8e0d6] bg-white sticky top-0 z-50">
          <div className="max-w-5xl mx-auto px-4 py-3">
            <div className="flex items-center justify-between">
              <Link to="/cart" className="flex items-center gap-2">
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
                Back to Cart
              </button>
            </div>
          </div>
        </header>

        <main className="max-w-2xl mx-auto px-4 py-12">
          <OrderTypeSelector 
            separatePreOrderFlow
            onComplete={(preferences) => {
              if (preferences?.deliveryMethod === 'pre-order') {
                navigate('/pre-order/schedule', {
                  state: { from: `${location.pathname}${location.search}` },
                });
                return;
              }

              const newPrefs = {
                deliveryMethod: preferences.deliveryMethod,
                scheduledDateTime: preferences.scheduledDateTime,
                isDineIn: preferences.isDineIn,
                isPreOrder: preferences.isPreOrder,
                preOrderMethod: preferences.preOrderMethod || '',
                timestamp: new Date().toISOString()
              };
              sessionStorage.setItem('orderPreferences', JSON.stringify(newPrefs));
              window.location.reload();
            }}
          />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white font-body">
      <header className="sticky top-0 z-10 bg-white/90 backdrop-blur-xl border-b border-[#e8e0d6]">
        <div className="max-w-5xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img src="https://rollercoastercafe.com/assets/images/roller_logo.png" alt="Logo" className="h-8 w-8 rounded-full object-cover" />
              <div>
                <h1 className="font-display font-bold text-xl text-[#3f3328]">Checkout</h1>
                <p className="text-xs text-[#6b5f54] capitalize">
                  {form.isPreOrder ? `Pre-order ${getOrderTypeDisplay(form.orderType)}` : getOrderTypeDisplay(form.orderType)} experience
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => navigate(backTarget)}
              className="text-sm font-semibold text-[#b97844] hover:underline"
            >
              Back to menu
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 py-6">
        <OrderPreferences />

        {items.length === 0 && (
          <div className="rounded-xl p-5 mb-6 border border-amber-100 bg-amber-50/70">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-white text-[#b97844] flex items-center justify-center shadow-sm">
                <CookingPot size={20} />
              </div>
              <div className="flex-1">
                <h2 className="font-display text-xl font-bold text-[#3f3328]">Add dishes before checkout</h2>
                <p className="text-sm text-[#6b5f54] mt-1">Add food from the menu to proceed.</p>
              </div>
              <button
                type="button"
                onClick={() => navigate(backTarget)}
                className="rounded-full bg-[#b97844] px-4 py-2 text-sm font-semibold text-white hover:bg-[#9e6538] transition-all whitespace-nowrap"
              >
                Open Menu
              </button>
            </div>
          </div>
        )}

        <div className="rounded-xl bg-white shadow-sm border border-[#e8e0d6] p-3 mb-6 flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-2 overflow-x-auto">
            {STEPS.map((title, index) => (
              <div key={title} className="flex items-center gap-1 shrink-0">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                  index < step ? 'bg-green-500 text-white' : index === step ? 'bg-[#b97844] text-white' : 'bg-[#faf8f5] text-[#a0968c]'
                }`}>
                  {index < step ? <CheckCircle size={12} /> : index + 1}
                </div>
                <span className={`text-xs font-medium hidden sm:block ${index === step ? 'text-[#3f3328]' : 'text-[#a0968c]'}`}>{title}</span>
                {index < STEPS.length - 1 && <ChevronRight size={12} className="text-[#e8e0d6]" />}
              </div>
            ))}
          </div>
          <div className="inline-flex items-center gap-1.5 rounded-full bg-[#faf8f5] px-3 py-1 text-xs font-semibold text-[#b97844]">
            <BellRing size={12} /> Notifications active
          </div>
        </div>

        <div className="grid lg:grid-cols-[1.2fr,0.8fr] gap-6">
          <div className="space-y-4">
            <AnimatePresence mode="wait">
              {step === 0 && (
                <motion.div key="step0" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="rounded-xl bg-white shadow-sm border border-[#e8e0d6] p-5 space-y-4">
                  {form.orderType === 'delivery' ? (
                    <>
                      <div>
                        <h2 className="font-display font-bold text-lg text-[#3f3328] mb-1">{form.isPreOrder ? 'Pre-order delivery details' : 'Delivery address'}</h2>
                        <p className="text-sm text-[#6b5f54]">{form.isPreOrder ? 'Add your delivery address and verify your current location for this scheduled order.' : 'Where should we deliver your order?'}</p>
                        <p className="text-xs text-amber-600 mt-1">Delivery available within 30km of our cafe in Bareja.</p>
                      </div>
                      <div className="relative">
                        <textarea
                          value={form.address}
                          onChange={(e) => { setDistanceError(null); setForm(prev => ({ ...prev, address: e.target.value, location: null })); }}
                          placeholder="Enter your full delivery address..."
                          className="w-full rounded-lg border border-[#e8e0d6] p-3 text-sm focus:border-[#b97844] focus:outline-none resize-none"
                          rows={3}
                        />
                        {form.location && (
                          <div className="absolute bottom-2 right-2">
                            <div className="bg-green-100 text-green-600 rounded-full p-1">
                              <CheckCircle size={14} />
                            </div>
                          </div>
                        )}
                      </div>
                      <button 
                        onClick={handleUseCurrentLocation} 
                        disabled={locating || fetchingAddress} 
                        className="inline-flex items-center gap-2 text-sm text-[#b97844] hover:underline disabled:opacity-50"
                      >
                        {(locating || fetchingAddress) ? (
                          <>
                            <Loader2 size={14} className="animate-spin" />
                            {fetchingAddress ? 'Getting address...' : 'Getting location...'}
                          </>
                        ) : (
                          <>
                            <LocateFixed size={14} />
                            Use current location
                          </>
                        )}
                      </button>
                      {form.isPreOrder && (
                        <input
                          type="datetime-local"
                          value={form.scheduledTime}
                          onChange={(e) => setForm(prev => ({ ...prev, scheduledTime: e.target.value }))}
                          min={(() => {
                            const date = new Date();
                            date.setMinutes(date.getMinutes() + 30);
                            return date.toISOString().slice(0, 16);
                          })()}
                          className={`w-full rounded-lg border p-2 text-sm focus:outline-none ${
                            scheduleError ? 'border-red-300 bg-red-50/40 focus:border-red-400' : 'border-[#e8e0d6] focus:border-[#b97844]'
                          }`}
                        />
                      )}
                      {scheduleError && <p className="text-sm text-red-500">{scheduleError}</p>}
                      {distanceError && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-600">
                          {distanceError}
                        </div>
                      )}
                      {form.location && !distanceError && (
                        <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-sm text-green-700 flex items-start gap-2">
                          <CheckCircle size={16} className="mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="font-medium">Location verified!</p>
                            <p className="text-xs">Your delivery address has been set to your current location.</p>
                          </div>
                        </div>
                      )}
                    </>
                  ) : form.orderType === 'dine-in' ? (
                    <>
                      <div>
                        <h2 className="font-display font-bold text-lg text-[#3f3328] mb-1">{form.isPreOrder ? 'Pre-order dine-in table' : 'Reserve your table'}</h2>
                        <p className="text-sm text-[#6b5f54]">{form.isPreOrder ? 'Choose your table details and booking time for dine-in pre-order.' : 'Book your seat and time'}</p>
                      </div>
                      <div className="grid sm:grid-cols-2 gap-3">
                        <input
                          value={form.tableNumber}
                          onChange={(e) => setForm(prev => ({ ...prev, tableNumber: e.target.value }))}
                          placeholder="Table number or zone"
                          className="w-full rounded-lg border border-[#e8e0d6] p-2 text-sm focus:border-[#b97844] focus:outline-none"
                        />
                        <input
                          type="number"
                          min="1"
                          max="20"
                          value={form.guestCount}
                          onChange={(e) => setForm(prev => ({ ...prev, guestCount: Number(e.target.value) || 1 }))}
                          className="w-full rounded-lg border border-[#e8e0d6] p-2 text-sm focus:border-[#b97844] focus:outline-none"
                          placeholder="Guests"
                        />
                      </div>
                      <input
                        type="datetime-local"
                        value={form.scheduledTime}
                        onChange={(e) => setForm(prev => ({ ...prev, scheduledTime: e.target.value }))}
                        className={`w-full rounded-lg border p-2 text-sm focus:outline-none ${
                          scheduleError ? 'border-red-300 bg-red-50/40 focus:border-red-400' : 'border-[#e8e0d6] focus:border-[#b97844]'
                        }`}
                      />
                      {scheduleError && <p className="text-sm text-red-500">{scheduleError}</p>}
                    </>
                  ) : (
                    <>
                      <div>
                        <h2 className="font-display font-bold text-lg text-[#3f3328] mb-1">{form.isPreOrder ? 'Pre-order takeaway timing' : 'Special instructions'}</h2>
                        <p className="text-sm text-[#6b5f54]">
                          {form.isPreOrder ? 'When would you like your takeaway order ready for pickup?' : 'Any special requests?'}
                        </p>
                      </div>
                      {form.isPreOrder && (
                        <>
                          <input
                            type="datetime-local"
                            value={form.scheduledTime}
                            onChange={(e) => setForm(prev => ({ ...prev, scheduledTime: e.target.value }))}
                            min={(() => {
                              const date = new Date();
                              date.setMinutes(date.getMinutes() + 30);
                              return date.toISOString().slice(0, 16);
                            })()}
                            className={`w-full rounded-lg border p-2 text-sm focus:outline-none ${
                              scheduleError ? 'border-red-300 bg-red-50/40 focus:border-red-400' : 'border-[#e8e0d6] focus:border-[#b97844]'
                            }`}
                          />
                        </>
                      )}
                      {scheduleError && <p className="text-sm text-red-500">{scheduleError}</p>}
                      <textarea
                        value={form.specialNotes}
                        onChange={(e) => setForm(prev => ({ ...prev, specialNotes: e.target.value }))}
                        placeholder="Any special requests or notes..."
                        className="w-full rounded-lg border border-[#e8e0d6] p-2 text-sm focus:border-[#b97844] focus:outline-none resize-none"
                        rows={3}
                      />
                    </>
                  )}

                  <div className="rounded-xl bg-[#faf8f5] p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <ShieldCheck size={14} className="text-[#b97844]" />
                      <h3 className="font-semibold text-[#3f3328] text-sm">{activeRules.title}</h3>
                    </div>
                    <div className="space-y-1 text-xs text-[#6b5f54] mb-3">
                      {activeRules.points.slice(0, 2).map((point, i) => <p key={i}>• {point}</p>)}
                    </div>
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

              {step === 1 && (
                <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="rounded-xl bg-white shadow-sm border border-[#e8e0d6] p-5 space-y-4">
                  <div>
                    <h2 className="font-display font-bold text-lg text-[#3f3328] mb-1">Payment method</h2>
                    <p className="text-sm text-[#6b5f54]">Choose how you'd like to pay</p>
                  </div>

                  <div className="space-y-2">
                    {selectedPaymentOptions.map(({ value, label, desc, icon: Icon }) => (
                      <button
                        key={value}
                        onClick={() => {
                          setForm(prev => ({ ...prev, paymentMethod: value }));
                          setPaymentVerified(false);
                        }}
                        className={`w-full p-3 rounded-xl border-2 text-left transition-all ${
                          form.paymentMethod === value ? 'border-[#b97844] bg-[#faf8f5]' : 'border-[#e8e0d6] hover:border-[#b97844]'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <Icon size={16} className="text-[#b97844]" />
                          <div>
                            <p className="font-semibold text-[#3f3328] text-sm">{label}</p>
                            <p className="text-xs text-[#6b5f54]">{desc}</p>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>

                  {form.paymentMethod === 'online' && (
                    <div className="rounded-xl border border-[#e8e0d6] p-4 space-y-4">
                      <div className="flex items-center gap-2">
                        <CreditCard size={16} className="text-[#b97844]" />
                        <h3 className="font-medium text-[#3f3328] text-sm">Online payment method</h3>
                      </div>

                      <div className="grid sm:grid-cols-1 gap-3">
                        <button
                          type="button"
                          onClick={() => setForm(prev => ({ ...prev, onlineMethod: 'upi', paymentReference: '' }))}
                          className={`rounded-xl border-2 p-3 text-left transition-all ${
                            form.onlineMethod === 'upi' ? 'border-[#b97844] bg-[#faf8f5]' : 'border-[#e8e0d6]'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <QrCode size={16} className="text-[#b97844]" />
                            <div>
                              <p className="font-semibold text-[#3f3328] text-sm">UPI QR</p>
                              <p className="text-xs text-[#6b5f54]">Pay with any UPI app</p>
                            </div>
                          </div>
                        </button>
                      </div>

                      <div className="space-y-3">
                        <div className="rounded-xl bg-[#faf8f5] border border-[#e8e0d6] p-4 flex flex-col items-center gap-3">
                          <QRCodeCanvas value={upiPaymentUri} size={160} includeMargin />
                          <div className="text-center">
                            <p className="text-sm font-semibold text-[#3f3328]">UPI ID</p>
                            <p className="text-sm text-[#6b5f54] break-all">{CAFE_UPI_ID}</p>
                            <p className="text-xs text-[#6b5f54] mt-1">Pay {formatCurrency(total)} and enter the transaction ID or payment reference below.</p>
                          </div>
                        </div>

                        <input
                          type="text"
                          value={form.paymentReference}
                          onChange={(e) => {
                            const reference = e.target.value;
                            setForm((prev) => ({ ...prev, paymentReference: reference }));
                            if (paymentVerified) {
                              setPaymentVerified(false);
                            }
                          }}
                          placeholder="Enter transaction ID / payment reference"
                          className="w-full rounded-lg border border-[#d9c2aa] px-4 py-3 text-sm outline-none focus:border-[#b97844]"
                        />

                        {!paymentVerified ? (
                          <button
                            onClick={verifyPayment}
                            disabled={verifyingPayment}
                            className="w-full rounded-lg bg-[#b97844] py-2 text-white font-semibold text-sm hover:bg-[#9e6538] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                          >
                            {verifyingPayment ? (
                              <>
                                <Loader2 size={16} className="animate-spin" />
                                Verifying payment...
                              </>
                            ) : (
                              <>
                                <CheckCircle size={16} />
                                I Have Paid
                              </>
                            )}
                          </button>
                        ) : (
                          <div className="bg-green-50 border border-green-200 rounded-lg p-3 flex items-center gap-2">
                            <CheckCircle size={18} className="text-green-600" />
                            <div>
                              <p className="text-sm font-semibold text-green-700">Payment Complete</p>
                              <p className="text-xs text-green-600">
                                Payment reference: {form.paymentReference}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {form.orderType === 'delivery' && (
                    <div className="rounded-xl border border-[#e8e0d6] p-3">
                      <div className="flex items-center gap-2 mb-2">
                        <BadgeIndianRupee size={14} className="text-[#b97844]" />
                        <h3 className="font-medium text-[#3f3328] text-sm">Delivery tip (Optional)</h3>
                      </div>
                      <div className="flex flex-wrap gap-2 mb-2">
                        {QUICK_TIPS.map(amount => (
                          <button
                            key={amount}
                            onClick={() => setForm(prev => ({ ...prev, tipAmount: amount }))}
                            className={`px-3 py-1 rounded-full text-xs transition-all ${
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
                        onChange={(e) => setForm(prev => ({ ...prev, tipAmount: Number(e.target.value) || 0 }))}
                        placeholder="Custom amount"
                        className="w-full rounded-lg border border-[#e8e0d6] p-2 text-sm focus:border-[#b97844] focus:outline-none"
                      />
                    </div>
                  )}

                  <div className="rounded-xl bg-[#faf8f5] p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <Tag size={18} className="text-[#b97844]" />
                        <h3 className="font-semibold text-[#3f3328] text-base">Coupon Code</h3>
                      </div>
                      <button
                        onClick={() => setShowOffersModal(true)}
                        className="text-sm text-[#b97844] hover:underline font-medium"
                      >
                        View All Offers
                      </button>
                    </div>
                    
                    {!couponApplied ? (
                      <div className="flex gap-3">
                        <div className="relative flex-1">
                          <Tag size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#a0968c]" />
                          <input
                            value={form.couponCode}
                            onChange={(e) => {
                              setForm(prev => ({ ...prev, couponCode: e.target.value.toUpperCase() }));
                            }}
                            placeholder="Enter coupon code"
                            className="w-full rounded-lg border border-[#e8e0d6] bg-white pl-9 pr-3 py-2.5 text-base focus:border-[#b97844] focus:outline-none"
                          />
                        </div>
                        <button
                          onClick={() => handleApplyCoupon()}
                          disabled={!form.couponCode.trim()}
                          className="rounded-lg border border-[#b97844] px-5 py-2.5 text-base font-semibold text-[#b97844] hover:bg-[#b97844] hover:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Apply
                        </button>
                      </div>
                    ) : (
                      <div className="bg-green-50 rounded-lg p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                              <CheckCircle size={20} className="text-green-600" />
                            </div>
                            <div>
                              <p className="font-semibold text-[#3f3328] text-base">Coupon Applied!</p>
                              <p className="text-sm text-green-700">
                              {discountMeta?.discountLabel || 'Discount'} - Saved {formatCurrency(discount)}
                              </p>
                              <p className="text-xs text-[#6b5f54] mt-1">Code: {form.couponCode}</p>
                            </div>
                          </div>
                          <button
                            onClick={handleRemoveCoupon}
                            className="px-4 py-2 rounded-lg border border-red-200 text-red-500 text-sm font-medium hover:bg-red-50 transition-all"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                </motion.div>
              )}

              {step === 2 && (
                <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="rounded-xl bg-white shadow-sm border border-[#e8e0d6] p-5 space-y-4">
                  <div>
                    <h2 className="font-display font-bold text-lg text-[#3f3328] mb-1">Confirm your order</h2>
                    <p className="text-sm text-[#6b5f54]">Review details before placing order</p>
                  </div>

                  <div className="rounded-xl bg-[#faf8f5] p-4 space-y-2 text-base">
                    <div className="flex justify-between">
                      <span className="text-[#6b5f54]">Order type</span>
                      <span className="font-semibold text-[#3f3328] capitalize">
                        {form.isPreOrder ? `Pre-order ${getOrderTypeDisplay(form.orderType)}` : getOrderTypeDisplay(form.orderType)}
                      </span>
                    </div>
                    {form.address && <div className="flex justify-between"><span className="text-[#6b5f54]">Address</span><span className="font-semibold text-[#3f3328] text-right">{form.address}</span></div>}
                    {form.tableNumber && <div className="flex justify-between"><span className="text-[#6b5f54]">Table</span><span className="font-semibold text-[#3f3328]">{form.tableNumber}</span></div>}
                    {form.scheduledTime && (
                      <div className="flex justify-between">
                        <span className="text-[#6b5f54]">Scheduled Time</span>
                        <span className="font-semibold text-[#3f3328]">{new Date(form.scheduledTime).toLocaleString()}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-[#6b5f54]">Payment</span>
                      <span className="font-semibold text-[#3f3328] capitalize">
                        {form.paymentMethod === 'online' ? `Online (${form.onlineMethod})` : form.paymentMethod}
                      </span>
                    </div>
                    {form.paymentMethod === 'online' && (
                      <div className="flex justify-between">
                        <span className="text-[#6b5f54]">Payment Status</span>
                        <span className="font-semibold text-green-600 flex items-center gap-1">
                          <CheckCircle size={14} /> Verified
                        </span>
                      </div>
                    )}
                    {form.paymentMethod === 'online' && form.paymentReference && (
                      <div className="flex justify-between">
                        <span className="text-[#6b5f54]">Reference</span>
                        <span className="font-semibold text-[#3f3328] text-right break-all max-w-[200px]">{form.paymentReference}</span>
                      </div>
                    )}
                    {form.tipAmount > 0 && <div className="flex justify-between"><span className="text-[#6b5f54]">Tip</span><span className="font-semibold text-[#3f3328]">{formatCurrency(form.tipAmount)}</span></div>}
                    {couponApplied && discount > 0 && <div className="flex justify-between"><span className="text-[#6b5f54]">Discount</span><span className="font-semibold text-green-600">-{formatCurrency(discount)}</span></div>}
                  </div>

                  <div className="rounded-xl border border-[#e8e0d6] p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <BellRing size={14} className="text-[#b97844]" />
                      <h3 className="font-medium text-[#3f3328] text-sm">Notification flow</h3>
                    </div>
                    <div className="space-y-1 text-xs text-[#6b5f54]">
                      {NOTIFICATION_STEPS.slice(0, 3).map(item => <p key={item}>• {item}</p>)}
                      <p className="text-[#b97844] text-xs pt-1">{activeRules.notifications}</p>
                    </div>
                  </div>

                  <button
                    onClick={handlePlaceOrder}
                    disabled={loading || !items.length}
                    className="w-full rounded-lg bg-[#b97844] py-3 text-white font-semibold text-base hover:bg-[#9e6538] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <Loader2 size={18} className="animate-spin" />
                        Placing Order...
                      </>
                    ) : (
                      `Place Order - ${formatCurrency(total)}`
                    )}
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="flex justify-between pt-2">
              {step > 0 && (
                  <button onClick={() => setStep(s => s - 1)} className="rounded-lg border border-[#e8e0d6] px-5 py-2 text-sm text-[#6b5f54] hover:border-[#b97844] hover:text-[#b97844] transition-all">
                    Back
                  </button>
              )}
              {step < 2 ? (
                <button 
                  onClick={handleNextStep} 
                  disabled={step === 1 && form.paymentMethod === 'online' && !paymentVerified}
                  className="rounded-lg bg-[#b97844] px-5 py-2 text-sm text-white hover:bg-[#9e6538] transition-all ml-auto disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Continue
                </button>
              ) : null}
            </div>
          </div>

          <aside className="rounded-xl bg-white shadow-sm border border-[#e8e0d6] p-5 h-fit sticky top-24">
            <h2 className="font-semibold text-lg text-[#3f3328] mb-3">Order Summary</h2>
            
            {/* Pre-order badge */}
            {form.isPreOrder && (
              <div className="mb-3 p-2 bg-amber-50 rounded-lg border border-amber-200">
                <div className="flex items-center gap-2">
                  <Clock size={14} className="text-amber-600" />
                  <span className="text-xs font-medium text-amber-700">Pre-order</span>
                  {form.scheduledTime && (
                    <span className="text-xs text-amber-600">
                      for {new Date(form.scheduledTime).toLocaleString()}
                    </span>
                  )}
                </div>
              </div>
            )}
            
            <div className="space-y-2 max-h-48 overflow-y-auto mb-4">
              {items.slice(0, 5).map((item) => (
                <div key={item.key} className="flex justify-between text-base">
                  <span className="text-[#6b5f54] truncate pr-2">{item.quantity} {item.name}</span>
                  <span className="text-[#3f3328]">{formatCurrency(item.basePrice * item.quantity)}</span>
                </div>
              ))}
              {items.length > 5 && <p className="text-sm text-[#a0968c]">+{items.length - 5} more items</p>}
            </div>

            <div className="space-y-3 text-base border-t border-[#e8e0d6] pt-4">
              <div className="flex justify-between">
                <span className="text-[#6b5f54]">Subtotal</span>
                <span className="text-[#3f3328]">{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#6b5f54]">GST (5%)</span>
                <span className="text-[#3f3328]">{formatCurrency(tax)}</span>
              </div>
              {deliveryFee > 0 && (
                <div className="flex justify-between">
                  <span className="text-[#6b5f54]">Delivery Fee</span>
                  <span className="text-[#3f3328]">{formatCurrency(deliveryFee)}</span>
                </div>
              )}
              {preOrderServiceFee > 0 && (
                <div className="flex justify-between">
                  <span className="text-[#6b5f54]">Pre-order Fee</span>
                  <span className="text-[#3f3328]">{formatCurrency(preOrderServiceFee)}</span>
                </div>
              )}
              {form.tipAmount > 0 && (
                <div className="flex justify-between">
                  <span className="text-[#6b5f54]">Tip</span>
                  <span className="text-[#3f3328]">{formatCurrency(form.tipAmount)}</span>
                </div>
              )}
              {discount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Discount</span>
                  <span>-{formatCurrency(discount)}</span>
                </div>
              )}
              <div className="flex justify-between font-bold text-xl pt-3 border-t border-[#e8e0d6]">
                <span className="text-[#3f3328]">Total</span>
                <span className="text-[#b97844]">{formatCurrency(total)}</span>
              </div>
            </div>

            <div className="mt-4 p-3 bg-[#faf8f5] rounded-lg text-sm text-[#6b5f54]">
              <p className="font-medium text-[#3f3328] mb-1">Customer promise</p>
              <p>Real-time notifications, secure payment, easy tracking.</p>
            </div>
          </aside>
        </div>
      </div>

      {showOffersModal && (
        <OffersModal
          onClose={() => setShowOffersModal(false)}
          onSelectOffer={handleSelectOffer}
        />
      )}
      <CustomerFooter />
    </div>
  );
}
