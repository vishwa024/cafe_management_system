// // import { useDispatch, useSelector } from 'react-redux';
// // import { Link } from 'react-router-dom';
// // import { Minus, Plus, ShoppingBag, Trash2, ArrowLeft, X } from 'lucide-react';
// // import {
// //   selectCartItems,
// //   selectCartSubtotal,
// //   selectCartCount,
// //   selectOrderType,
// //   updateQuantity,
// //   removeItem,
// // } from '../../store/slices/cartSlice';
// // import { useState } from 'react';
// // import CartDrawer from '../../components/customer/CartDrawer';
// // import OrderPreferences from '../../components/customer/OrderPreferences';

// // export default function CartPage() {
// //   const dispatch = useDispatch();
// //   const items = useSelector(selectCartItems);
// //   const subtotal = useSelector(selectCartSubtotal);
// //   const count = useSelector(selectCartCount);
// //   const orderType = useSelector(selectOrderType);
// //   const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
// //   const user = useSelector((state) => state.auth.user);
// //   const [cartOpen, setCartOpen] = useState(false);
  
// //   const tax = Math.round(subtotal * 0.05);
// //   const deliveryFee = items.length > 0 && orderType === 'delivery' ? 30 : 0;
// //   const total = subtotal + tax + deliveryFee;

// //   const initials = (user?.name || 'RC')
// //     .split(' ')
// //     .map((part) => part[0])
// //     .join('')
// //     .slice(0, 2)
// //     .toUpperCase();

// //   return (
// //     <div className="min-h-screen bg-white">
// //       {/* Header */}
// //       <header className="border-b border-[#e8e0d6] bg-white sticky top-0 z-50">
// //         <div className="max-w-6xl mx-auto px-4 py-3">
// //           <div className="flex items-center justify-between">
// //             <Link to="/dashboard" className="flex items-center gap-2">
// //               <img 
// //                 src="https://rollercoastercafe.com/assets/images/roller_logo.png" 
// //                 alt="Logo"
// //                 className="h-8 w-8 rounded-full object-cover"
// //               />
// //               <span className="font-semibold text-lg text-[#3f3328]">Roller Coaster Cafe</span>
// //             </Link>

// //             <nav className="hidden md:flex items-center gap-6">
// //               <Link to="/dashboard" className="text-sm text-[#6b5f54] hover:text-[#b97844]">Home</Link>
// //               <Link to="/menu" className="text-sm text-[#6b5f54] hover:text-[#b97844]">Menu</Link>
// //               <Link to="/orders" className="text-sm text-[#6b5f54] hover:text-[#b97844]">Orders</Link>
// //               <Link to="/profile" className="text-sm text-[#6b5f54] hover:text-[#b97844]">Profile</Link>
// //               <Link to="/settings" className="text-sm text-[#6b5f54] hover:text-[#b97844]">Settings</Link>
// //             </nav>

// //             <div className="flex items-center gap-2">
// //               <Link
// //                 to="/profile"
// //                 className="hidden sm:inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#3f3328] text-white"
// //               >
// //                 <span className="text-xs font-bold">{initials}</span>
// //               </Link>
// //               <button
// //                 onClick={() => setCartOpen(true)}
// //                 className="relative inline-flex items-center gap-1.5 rounded-full bg-[#b97844] px-3 py-1.5 text-sm font-semibold text-white hover:bg-[#9e6538] transition-all"
// //               >
// //                 <ShoppingBag size={14} />
// //                 <span>Cart</span>
// //                 {count > 0 && (
// //                   <span className="absolute -top-1 -right-1 min-w-4 h-4 px-1 rounded-full bg-[#3f3328] text-white text-[10px]">
// //                     {count}
// //                   </span>
// //                 )}
// //               </button>
// //             </div>
// //           </div>
// //         </div>
// //       </header>

// //       <main className="max-w-6xl mx-auto px-4 py-8">
// //         {/* Order Preferences Banner */}
// //         <OrderPreferences />
        
// //         {/* Title */}
// //         <div className="mb-6">
// //           <h1 className="text-2xl font-bold text-[#3f3328]">Shopping Cart</h1>
// //           <p className="text-sm text-[#6b5f54] mt-1">
// //             {count > 0 ? `${count} item${count > 1 ? 's' : ''} ready for ${orderType} checkout` : 'Your cart is empty'}
// //           </p>
// //         </div>

// //         {items.length === 0 ? (
// //           /* Empty Cart */
// //           <div className="text-center py-16 bg-[#faf8f5] rounded-xl">
// //             <div className="w-20 h-20 mx-auto bg-white rounded-full flex items-center justify-center mb-4 shadow-sm">
// //               <ShoppingBag size={32} className="text-[#a0968c]" />
// //             </div>
// //             <h2 className="text-xl font-medium text-[#6b5f54] mb-2">Your cart is empty</h2>
// //             <p className="text-sm text-[#a0968c] mb-6">Add some delicious items from our menu</p>
// //             <Link 
// //               to={`/menu?mode=${orderType}`} 
// //               className="inline-flex items-center gap-2 rounded-full bg-[#b97844] px-5 py-2 text-sm text-white hover:bg-[#9e6538] transition-all"
// //             >
// //               Browse Menu
// //             </Link>
// //           </div>
// //         ) : (
// //           <div className="grid lg:grid-cols-[1.2fr,0.8fr] gap-8">
// //             {/* Cart Items */}
// //             <div className="space-y-3">
// //               {items.map((item) => (
// //                 <div key={item.key} className="flex items-center gap-4 bg-white border border-[#e8e0d6] rounded-xl p-4 hover:shadow-sm transition-all">
// //                   {item.image && (
// //                     <img
// //                       src={item.image}
// //                       alt={item.name}
// //                       className="w-16 h-16 rounded-lg object-cover shrink-0"
// //                       onError={(e) => { e.target.style.display = 'none'; }}
// //                     />
// //                   )}
// //                   <div className="flex-1 min-w-0">
// //                     <h3 className="font-semibold text-[#3f3328]">{item.name}</h3>
// //                     {item.variant && <p className="text-xs text-[#a0968c] mt-0.5">{item.variant}</p>}
// //                     {item.addons?.length > 0 && (
// //                       <p className="text-xs text-[#a0968c] mt-0.5">{item.addons.join(', ')}</p>
// //                     )}
// //                     <p className="text-[#b97844] font-semibold mt-1">₹{item.basePrice * item.quantity}</p>
// //                   </div>
// //                   <div className="flex items-center gap-2 shrink-0">
// //                     <div className="flex items-center gap-2 bg-[#faf8f5] rounded-full px-2 py-1">
// //                       <button
// //                         onClick={() => dispatch(updateQuantity({ key: item.key, quantity: item.quantity - 1 }))}
// //                         className="w-6 h-6 rounded-full bg-white border border-[#e8e0d6] flex items-center justify-center hover:border-[#b97844] hover:text-[#b97844] transition-colors"
// //                       >
// //                         <Minus size={12} />
// //                       </button>
// //                       <span className="w-6 text-center text-sm font-medium text-[#3f3328]">{item.quantity}</span>
// //                       <button
// //                         onClick={() => dispatch(updateQuantity({ key: item.key, quantity: item.quantity + 1 }))}
// //                         className="w-6 h-6 rounded-full bg-[#b97844] text-white flex items-center justify-center hover:bg-[#9e6538] transition-colors"
// //                       >
// //                         <Plus size={12} />
// //                       </button>
// //                     </div>
// //                     <button
// //                       onClick={() => dispatch(removeItem(item.key))}
// //                       className="w-8 h-8 rounded-full bg-red-50 text-red-500 flex items-center justify-center hover:bg-red-100 transition-colors"
// //                     >
// //                       <Trash2 size={14} />
// //                     </button>
// //                   </div>
// //                 </div>
// //               ))}
// //             </div>

// //             {/* Order Summary */}
// //             <aside className="bg-white border border-[#e8e0d6] rounded-xl p-6 h-fit sticky top-24">
// //               <h2 className="font-semibold text-lg text-[#3f3328] mb-4">Order Summary</h2>
              
// //               <div className="space-y-3 text-sm">
// //                 <div className="flex justify-between text-[#6b5f54]">
// //                   <span>Subtotal</span>
// //                   <span>₹{subtotal}</span>
// //                 </div>
// //                 <div className="flex justify-between text-[#6b5f54]">
// //                   <span>GST (5%)</span>
// //                   <span>₹{tax}</span>
// //                 </div>
// //                 {orderType === 'delivery' && (
// //                   <div className="flex justify-between text-[#6b5f54]">
// //                     <span>Delivery Fee</span>
// //                     <span>₹{deliveryFee}</span>
// //                   </div>
// //                 )}
// //                 <div className="flex justify-between font-bold text-base text-[#3f3328] pt-3 border-t border-[#e8e0d6]">
// //                   <span>Total</span>
// //                   <span className="text-[#b97844]">₹{total}</span>
// //                 </div>
// //               </div>

// //               <Link
// //                 to={`/checkout?mode=${orderType}`}
// //                 className="block w-full text-center rounded-full bg-[#b97844] py-3 mt-5 text-sm font-semibold text-white hover:bg-[#9e6538] transition-all"
// //               >
// //                 Proceed to Checkout
// //               </Link>

// //               <Link
// //                 to={`/menu?mode=${orderType}`}
// //                 className="block w-full text-center rounded-full border border-[#e8e0d6] py-3 mt-3 text-sm font-medium text-[#6b5f54] hover:border-[#b97844] hover:text-[#b97844] transition-all"
// //               >
// //                 Continue Shopping
// //               </Link>
// //             </aside>
// //           </div>
// //         )}
// //       </main>

// //       {/* Footer */}
// //       <footer className="border-t border-[#e8e0d6] bg-white py-4 mt-8">
// //         <div className="max-w-6xl mx-auto px-4 text-center">
// //           <div className="flex flex-wrap items-center justify-center gap-4 mb-2">
// //             <Link to="/dashboard" className="text-xs text-[#a0968c] hover:text-[#b97844]">Home</Link>
// //             <Link to="/menu" className="text-xs text-[#a0968c] hover:text-[#b97844]">Menu</Link>
// //             <Link to="/orders" className="text-xs text-[#a0968c] hover:text-[#b97844]">Orders</Link>
// //             <Link to="/profile" className="text-xs text-[#a0968c] hover:text-[#b97844]">Profile</Link>
// //             <Link to="/settings" className="text-xs text-[#a0968c] hover:text-[#b97844]">Settings</Link>
// //           </div>
// //           <p className="text-xs text-[#a0968c]">© {new Date().getFullYear()} Roller Coaster Cafe</p>
// //         </div>
// //       </footer>

// //       <CartDrawer isOpen={cartOpen} onClose={() => setCartOpen(false)} />
// //     </div>
// //   );
// // }


// import { useDispatch, useSelector } from 'react-redux';
// import { Link, useNavigate } from 'react-router-dom';
// import { Minus, Plus, ShoppingBag, Trash2, ArrowLeft, X } from 'lucide-react';
// import {
//   selectCartItems,
//   selectCartSubtotal,
//   selectCartCount,
//   selectOrderType,
//   updateQuantity,
//   removeItem,
// } from '../../store/slices/cartSlice';
// import { useState } from 'react';
// import CartDrawer from '../../components/customer/CartDrawer';
// import OrderPreferences from '../../components/customer/OrderPreferences';
// import toast from 'react-hot-toast';

// export default function CartPage() {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const items = useSelector(selectCartItems);
//   const subtotal = useSelector(selectCartSubtotal);
//   const count = useSelector(selectCartCount);
//   const orderType = useSelector(selectOrderType);
//   const { isAuthenticated } = useSelector((state) => state.auth);
//   const user = useSelector((state) => state.auth.user);
//   const [cartOpen, setCartOpen] = useState(false);
  
//   const tax = Math.round(subtotal * 0.05);
//   const deliveryFee = items.length > 0 && orderType === 'delivery' ? 30 : 0;
//   const total = subtotal + tax + deliveryFee;

//   const initials = (user?.name || 'RC')
//     .split(' ')
//     .map((part) => part[0])
//     .join('')
//     .slice(0, 2)
//     .toUpperCase();

//   const handleProceedToCheckout = () => {
//     if (!isAuthenticated) {
//       toast.error('Please login to proceed to checkout');
//       navigate('/login', { state: { from: '/cart' } });
//       return;
//     }
//     navigate(`/checkout?mode=${orderType}`);
//   };

//   return (
//     <div className="min-h-screen bg-white">
//       {/* Header */}
//       <header className="border-b border-[#e8e0d6] bg-white sticky top-0 z-50">
//         <div className="max-w-6xl mx-auto px-4 py-3">
//           <div className="flex items-center justify-between">
//             <Link to="/" className="flex items-center gap-2">
//               <img 
//                 src="https://rollercoastercafe.com/assets/images/roller_logo.png" 
//                 alt="Logo"
//                 className="h-8 w-8 rounded-full object-cover"
//               />
//               <span className="font-semibold text-lg text-[#3f3328]">Roller Coaster Cafe</span>
//             </Link>

//             <nav className="hidden md:flex items-center gap-6">
//               <Link to="/" className="text-sm text-[#6b5f54] hover:text-[#b97844]">Home</Link>
//               <Link to="/menu" className="text-sm text-[#6b5f54] hover:text-[#b97844]">Menu</Link>
//               <Link to="/orders" className="text-sm text-[#6b5f54] hover:text-[#b97844]">Orders</Link>
//               <Link to="/profile" className="text-sm text-[#6b5f54] hover:text-[#b97844]">Profile</Link>
//               <Link to="/settings" className="text-sm text-[#6b5f54] hover:text-[#b97844]">Settings</Link>
//             </nav>

//             <div className="flex items-center gap-2">
//               <Link
//                 to="/profile"
//                 className="hidden sm:inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#3f3328] text-white"
//               >
//                 <span className="text-xs font-bold">{initials}</span>
//               </Link>
//               <button
//                 onClick={() => setCartOpen(true)}
//                 className="relative inline-flex items-center gap-1.5 rounded-full bg-[#b97844] px-3 py-1.5 text-sm font-semibold text-white hover:bg-[#9e6538] transition-all"
//               >
//                 <ShoppingBag size={14} />
//                 <span>Cart</span>
//                 {count > 0 && (
//                   <span className="absolute -top-1 -right-1 min-w-4 h-4 px-1 rounded-full bg-[#3f3328] text-white text-[10px]">
//                     {count}
//                   </span>
//                 )}
//               </button>
//             </div>
//           </div>
//         </div>
//       </header>

//       <main className="max-w-6xl mx-auto px-4 py-8">
//         {/* Order Preferences Banner */}
//         <OrderPreferences />
        
//         {/* Title */}
//         <div className="mb-6">
//           <h1 className="text-2xl font-bold text-[#3f3328]">Shopping Cart</h1>
//           <p className="text-sm text-[#6b5f54] mt-1">
//             {count > 0 ? `${count} item${count > 1 ? 's' : ''} ready for ${orderType} checkout` : 'Your cart is empty'}
//           </p>
//         </div>

//         {items.length === 0 ? (
//           /* Empty Cart */
//           <div className="text-center py-16 bg-[#faf8f5] rounded-xl">
//             <div className="w-20 h-20 mx-auto bg-white rounded-full flex items-center justify-center mb-4 shadow-sm">
//               <ShoppingBag size={32} className="text-[#a0968c]" />
//             </div>
//             <h2 className="text-xl font-medium text-[#6b5f54] mb-2">Your cart is empty</h2>
//             <p className="text-sm text-[#a0968c] mb-6">Add some delicious items from our menu</p>
//             <Link 
//               to={`/menu?mode=${orderType}`} 
//               className="inline-flex items-center gap-2 rounded-full bg-[#b97844] px-5 py-2 text-sm text-white hover:bg-[#9e6538] transition-all"
//             >
//               Browse Menu
//             </Link>
//           </div>
//         ) : (
//           <div className="grid lg:grid-cols-[1.2fr,0.8fr] gap-8">
//             {/* Cart Items */}
//             <div className="space-y-3">
//               {items.map((item) => (
//                 <div key={item.key} className="flex items-center gap-4 bg-white border border-[#e8e0d6] rounded-xl p-4 hover:shadow-sm transition-all">
//                   {item.image && (
//                     <img
//                       src={item.image}
//                       alt={item.name}
//                       className="w-16 h-16 rounded-lg object-cover shrink-0"
//                       onError={(e) => { e.target.style.display = 'none'; }}
//                     />
//                   )}
//                   <div className="flex-1 min-w-0">
//                     <h3 className="font-semibold text-[#3f3328]">{item.name}</h3>
//                     {item.variant && <p className="text-xs text-[#a0968c] mt-0.5">{item.variant}</p>}
//                     {item.addons?.length > 0 && (
//                       <p className="text-xs text-[#a0968c] mt-0.5">{item.addons.join(', ')}</p>
//                     )}
//                     <p className="text-[#b97844] font-semibold mt-1">₹{item.basePrice * item.quantity}</p>
//                   </div>
//                   <div className="flex items-center gap-2 shrink-0">
//                     <div className="flex items-center gap-2 bg-[#faf8f5] rounded-full px-2 py-1">
//                       <button
//                         onClick={() => dispatch(updateQuantity({ key: item.key, quantity: item.quantity - 1 }))}
//                         className="w-6 h-6 rounded-full bg-white border border-[#e8e0d6] flex items-center justify-center hover:border-[#b97844] hover:text-[#b97844] transition-colors"
//                       >
//                         <Minus size={12} />
//                       </button>
//                       <span className="w-6 text-center text-sm font-medium text-[#3f3328]">{item.quantity}</span>
//                       <button
//                         onClick={() => dispatch(updateQuantity({ key: item.key, quantity: item.quantity + 1 }))}
//                         className="w-6 h-6 rounded-full bg-[#b97844] text-white flex items-center justify-center hover:bg-[#9e6538] transition-colors"
//                       >
//                         <Plus size={12} />
//                       </button>
//                     </div>
//                     <button
//                       onClick={() => dispatch(removeItem(item.key))}
//                       className="w-8 h-8 rounded-full bg-red-50 text-red-500 flex items-center justify-center hover:bg-red-100 transition-colors"
//                     >
//                       <Trash2 size={14} />
//                     </button>
//                   </div>
//                 </div>
//               ))}
//             </div>

//             {/* Order Summary */}
//             <aside className="bg-white border border-[#e8e0d6] rounded-xl p-6 h-fit sticky top-24">
//               <h2 className="font-semibold text-lg text-[#3f3328] mb-4">Order Summary</h2>
              
//               <div className="space-y-3 text-sm">
//                   <div className="flex justify-between text-[#6b5f54]">
//                     <span>Subtotal</span>
//                     <span>₹{subtotal}</span>
//                   </div>
//                   <div className="flex justify-between text-[#6b5f54]">
//                     <span>GST (5%)</span>
//                     <span>₹{tax}</span>
//                   </div>
//                   {orderType === 'delivery' && (
//                     <div className="flex justify-between text-[#6b5f54]">
//                       <span>Delivery Fee</span>
//                       <span>₹{deliveryFee}</span>
//                     </div>
//                   )}
//                   {orderType === 'pre-order' && (
//                     <div className="flex justify-between text-[#6b5f54]">
//                       <span>Pre-order Fee</span>
//                       <span>₹49</span>
//                     </div>
//                    )}
//                 <div className="flex justify-between font-bold text-base text-[#3f3328] pt-3 border-t border-[#e8e0d6]">
//                   <span>Total</span>
//                   <span className="text-[#b97844]">₹{total}</span>
//                 </div>
//               </div>
//               <button
//                 onClick={handleProceedToCheckout}
//                 className="block w-full text-center rounded-full bg-[#b97844] py-3 mt-5 text-sm font-semibold text-white hover:bg-[#9e6538] transition-all"
//               >
//                 Proceed to Checkout
//               </button>

//               <Link
//                 to={`/menu?mode=${orderType}`}
//                 className="block w-full text-center rounded-full border border-[#e8e0d6] py-3 mt-3 text-sm font-medium text-[#6b5f54] hover:border-[#b97844] hover:text-[#b97844] transition-all"
//               >
//                 Continue Shopping
//               </Link>
//             </aside>
//           </div>
//         )}
//       </main>

//       {/* Footer */}
//       <footer className="border-t border-[#e8e0d6] bg-white py-4 mt-8">
//         <div className="max-w-6xl mx-auto px-4 text-center">
//           <div className="flex flex-wrap items-center justify-center gap-4 mb-2">
//             <Link to="/" className="text-xs text-[#a0968c] hover:text-[#b97844]">Home</Link>
//             <Link to="/menu" className="text-xs text-[#a0968c] hover:text-[#b97844]">Menu</Link>
//             <Link to="/orders" className="text-xs text-[#a0968c] hover:text-[#b97844]">Orders</Link>
//             <Link to="/profile" className="text-xs text-[#a0968c] hover:text-[#b97844]">Profile</Link>
//             <Link to="/settings" className="text-xs text-[#a0968c] hover:text-[#b97844]">Settings</Link>
//           </div>
//           <p className="text-xs text-[#a0968c]">© {new Date().getFullYear()} Roller Coaster Cafe</p>
//         </div>
//       </footer>

//       <CartDrawer isOpen={cartOpen} onClose={() => setCartOpen(false)} />
//     </div>
//   );
// }

import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { Minus, Plus, ShoppingBag, Trash2, ArrowLeft, X } from 'lucide-react';
import {
  selectCartItems,
  selectCartSubtotal,
  selectCartCount,
  selectOrderType,
  updateQuantity,
  removeItem,
  clearCart,
  setOrderType,
} from '../../store/slices/cartSlice';
import { useState, useEffect } from 'react';
import CartDrawer from '../../components/customer/CartDrawer';
import OrderPreferences from '../../components/customer/OrderPreferences';
import toast from 'react-hot-toast';
import { loadGuestCart, saveGuestCart, clearGuestCart } from '../../utils/cartStorage';

export default function CartPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const items = useSelector(selectCartItems);
  const subtotal = useSelector(selectCartSubtotal);
  const count = useSelector(selectCartCount);
  const orderType = useSelector(selectOrderType);
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const [cartOpen, setCartOpen] = useState(false);
  
  const tax = Math.round(subtotal * 0.05);
  const deliveryFee = items.length > 0 && orderType === 'delivery' ? 30 : 0;
  const preOrderFee = orderType === 'pre-order' ? 49 : 0;
  const total = subtotal + tax + deliveryFee + preOrderFee;

  // Get order type from URL if present
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const mode = urlParams.get('mode');
    if (mode && ['delivery', 'takeaway', 'dine-in', 'pre-order'].includes(mode)) {
      dispatch(setOrderType(mode));
    }
  }, [dispatch]);

  const handleProceedToCheckout = () => {
    if (!isAuthenticated) {
      if (items.length > 0) {
        saveGuestCart(items);
      }
      toast.error('Please login to proceed to checkout');
      navigate('/login', { state: { from: '/cart' } });
      return;
    }
    // Pass the order type to checkout
    navigate(`/checkout?mode=${orderType}`, {
      state: { from: `${window.location.pathname}${window.location.search}` },
    });
  };

  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-[#e8e0d6] bg-white sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2">
              <img 
                src="https://rollercoastercafe.com/assets/images/roller_logo.png" 
                alt="Logo"
                className="h-8 w-8 rounded-full object-cover"
              />
              <span className="font-semibold text-lg text-[#3f3328]">Roller Coaster Cafe</span>
            </Link>

            <nav className="hidden md:flex items-center gap-6">
              <Link to="/" className="text-sm text-[#6b5f54] hover:text-[#b97844]">Home</Link>
              <Link to="/menu" className="text-sm text-[#6b5f54] hover:text-[#b97844]">Menu</Link>
              <Link to="/orders" className="text-sm text-[#6b5f54] hover:text-[#b97844]">Orders</Link>
              <Link to="/profile" className="text-sm text-[#6b5f54] hover:text-[#b97844]">Profile</Link>
              <Link to="/settings" className="text-sm text-[#6b5f54] hover:text-[#b97844]">Settings</Link>
            </nav>

            <div className="flex items-center gap-2">
              {isAuthenticated && (
                <Link to="/profile" className="hidden sm:inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#3f3328] text-white">
                  <span className="text-xs font-bold">{user?.name?.charAt(0).toUpperCase() || 'U'}</span>
                </Link>
              )}
              <button
                onClick={() => setCartOpen(true)}
                className="relative inline-flex items-center gap-1.5 rounded-full bg-[#b97844] px-3 py-1.5 text-sm font-semibold text-white hover:bg-[#9e6538] transition-all"
              >
                <ShoppingBag size={14} />
                <span>Cart</span>
                {count > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-4 h-4 px-1 rounded-full bg-[#3f3328] text-white text-[10px]">
                    {count}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        <OrderPreferences />
        
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-[#3f3328]">Shopping Cart</h1>
          <p className="text-sm text-[#6b5f54] mt-1">
            {count > 0 ? `${count} item${count > 1 ? 's' : ''} ready for ${orderType} checkout` : 'Your cart is empty'}
          </p>
          {!isAuthenticated && count > 0 && (
            <p className="text-xs text-amber-600 mt-2">💡 Login to complete your purchase</p>
          )}
        </div>

        {items.length === 0 ? (
          <div className="text-center py-16 bg-[#faf8f5] rounded-xl">
            <div className="w-20 h-20 mx-auto bg-white rounded-full flex items-center justify-center mb-4 shadow-sm">
              <ShoppingBag size={32} className="text-[#a0968c]" />
            </div>
            <h2 className="text-xl font-medium text-[#6b5f54] mb-2">Your cart is empty</h2>
            <p className="text-sm text-[#a0968c] mb-6">Add some delicious items from our menu</p>
            <Link 
              to={`/menu?mode=${orderType}`} 
              className="inline-flex items-center gap-2 rounded-full bg-[#b97844] px-5 py-2 text-sm text-white hover:bg-[#9e6538] transition-all"
            >
              Browse Menu
            </Link>
          </div>
        ) : (
          <div className="grid lg:grid-cols-[1.2fr,0.8fr] gap-8">
            <div className="space-y-3">
              {items.map((item) => (
                <div key={item.key} className="flex items-center gap-4 bg-white border border-[#e8e0d6] rounded-xl p-4 hover:shadow-sm transition-all">
                  {item.image && (
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 rounded-lg object-cover shrink-0"
                      onError={(e) => { e.target.style.display = 'none'; }}
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-[#3f3328]">{item.name}</h3>
                    {item.variant && <p className="text-xs text-[#a0968c] mt-0.5">{item.variant}</p>}
                    {item.addons?.length > 0 && (
                      <p className="text-xs text-[#a0968c] mt-0.5">{item.addons.join(', ')}</p>
                    )}
                    <p className="text-[#b97844] font-semibold mt-1">₹{item.basePrice * item.quantity}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <div className="flex items-center gap-2 bg-[#faf8f5] rounded-full px-2 py-1">
                      <button
                        onClick={() => dispatch(updateQuantity({ key: item.key, quantity: item.quantity - 1 }))}
                        className="w-6 h-6 rounded-full bg-white border border-[#e8e0d6] flex items-center justify-center hover:border-[#b97844] hover:text-[#b97844] transition-colors"
                      >
                        <Minus size={12} />
                      </button>
                      <span className="w-6 text-center text-sm font-medium text-[#3f3328]">{item.quantity}</span>
                      <button
                        onClick={() => dispatch(updateQuantity({ key: item.key, quantity: item.quantity + 1 }))}
                        className="w-6 h-6 rounded-full bg-[#b97844] text-white flex items-center justify-center hover:bg-[#9e6538] transition-colors"
                      >
                        <Plus size={12} />
                      </button>
                    </div>
                    <button
                      onClick={() => dispatch(removeItem(item.key))}
                      className="w-8 h-8 rounded-full bg-red-50 text-red-500 flex items-center justify-center hover:bg-red-100 transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <aside className="bg-white border border-[#e8e0d6] rounded-xl p-6 h-fit sticky top-24">
              <h2 className="font-semibold text-lg text-[#3f3328] mb-4">Order Summary</h2>
              
              <div className="space-y-3 text-sm">
                <div className="flex justify-between text-[#6b5f54]">
                  <span>Subtotal</span>
                  <span>₹{subtotal}</span>
                </div>
                <div className="flex justify-between text-[#6b5f54]">
                  <span>GST (5%)</span>
                  <span>₹{tax}</span>
                </div>
                {orderType === 'delivery' && (
                  <div className="flex justify-between text-[#6b5f54]">
                    <span>Delivery Fee</span>
                    <span>₹{deliveryFee}</span>
                  </div>
                )}
                {orderType === 'pre-order' && (
                  <div className="flex justify-between text-[#6b5f54]">
                    <span>Pre-order Fee</span>
                    <span>₹{preOrderFee}</span>
                  </div>
                )}
                <div className="flex justify-between font-bold text-base text-[#3f3328] pt-3 border-t border-[#e8e0d6]">
                  <span>Total</span>
                  <span className="text-[#b97844]">₹{total}</span>
                </div>
              </div>

              <button
                onClick={handleProceedToCheckout}
                className="block w-full text-center rounded-full bg-[#b97844] py-3 mt-5 text-sm font-semibold text-white hover:bg-[#9e6538] transition-all"
              >
                Proceed to Checkout
              </button>

              <Link
                to={`/menu?mode=${orderType}`}
                className="block w-full text-center rounded-full border border-[#e8e0d6] py-3 mt-3 text-sm font-medium text-[#6b5f54] hover:border-[#b97844] hover:text-[#b97844] transition-all"
              >
                Continue Shopping
              </Link>

              {!isAuthenticated && (
                <p className="text-xs text-center text-amber-600 mt-4">
                  🔒 Login to complete your purchase
                </p>
              )}
            </aside>
          </div>
        )}
      </main>

      <footer className="border-t border-[#e8e0d6] bg-white py-4 mt-8">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <div className="flex flex-wrap items-center justify-center gap-4 mb-2">
            <Link to="/" className="text-xs text-[#a0968c] hover:text-[#b97844]">Home</Link>
            <Link to="/menu" className="text-xs text-[#a0968c] hover:text-[#b97844]">Menu</Link>
            <Link to="/orders" className="text-xs text-[#a0968c] hover:text-[#b97844]">Orders</Link>
            <Link to="/profile" className="text-xs text-[#a0968c] hover:text-[#b97844]">Profile</Link>
            <Link to="/settings" className="text-xs text-[#a0968c] hover:text-[#b97844]">Settings</Link>
          </div>
          <p className="text-xs text-[#a0968c]">© {new Date().getFullYear()} Roller Coaster Cafe</p>
        </div>
      </footer>

      <CartDrawer isOpen={cartOpen} onClose={() => setCartOpen(false)} />
    </div>
  );
}
