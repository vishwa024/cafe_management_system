// import { useDispatch, useSelector } from 'react-redux';
// import { Link } from 'react-router-dom';
// import { motion, AnimatePresence } from 'framer-motion';
// import { X, Plus, Minus, ShoppingBag, Trash2 } from 'lucide-react';
// import {
//   selectCartItems,
//   selectCartSubtotal,
//   selectCartCount,
//   selectOrderType,
//   updateQuantity,
//   removeItem,
// } from '../../store/slices/cartSlice';

// export default function CartDrawer({ isOpen, onClose }) {
//   const dispatch = useDispatch();
//   const items = useSelector(selectCartItems);
//   const subtotal = useSelector(selectCartSubtotal);
//   const count = useSelector(selectCartCount);
//   const orderType = useSelector(selectOrderType);
//   const tax = Math.round(subtotal * 0.05);
//   const deliveryFee = orderType === 'delivery' ? 30 : 0;
//   const total = subtotal + tax + deliveryFee;

//   return (
//     <AnimatePresence>
//       {isOpen && (
//         <>
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//             onClick={onClose}
//             className="fixed inset-0 bg-black/50 z-40 backdrop-blur-sm"
//           />

//           <motion.div
//             initial={{ x: '100%' }}
//             animate={{ x: 0 }}
//             exit={{ x: '100%' }}
//             transition={{ type: 'spring', damping: 25, stiffness: 200 }}
//             className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-white z-50 flex flex-col shadow-2xl"
//           >
//             <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
//               <div className="flex items-center gap-3">
//                 <ShoppingBag className="text-primary" size={22} />
//                 <h2 className="font-display font-bold text-xl text-dark">Your Cart</h2>
//                 {count > 0 && <span className="badge-primary">{count} items</span>}
//               </div>
//               <button onClick={onClose} className="w-9 h-9 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors">
//                 <X size={20} />
//               </button>
//             </div>

//             <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
//               {items.length === 0 ? (
//                 <div className="flex flex-col items-center justify-center h-full text-center py-16">
//                   <ShoppingBag size={56} className="text-gray-200 mb-4" />
//                   <h3 className="font-display text-xl font-bold text-gray-400 mb-2">Your cart is empty</h3>
//                   <p className="text-gray-400 text-sm mb-6">Add some delicious items from our menu.</p>
//                   <button onClick={onClose} className="btn-primary">
//                     <Link to={`/menu?mode=${orderType}`}>Browse Menu</Link>
//                   </button>
//                 </div>
//               ) : (
//                 items.map((item) => (
//                   <motion.div key={item.key} layout initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: -20 }} className="flex items-start gap-4 bg-gray-50 rounded-2xl p-4">
//                     {item.image && (
//                       <img
//                         src={item.image}
//                         alt={item.name}
//                         className="w-16 h-16 rounded-xl object-cover shrink-0"
//                         onError={(e) => {
//                           e.target.style.display = 'none';
//                         }}
//                       />
//                     )}
//                     <div className="flex-1 min-w-0">
//                       <h4 className="font-semibold text-dark text-sm">{item.name}</h4>
//                       {item.variant && <p className="text-gray-400 text-xs">{item.variant}</p>}
//                       {item.addons?.length > 0 && <p className="text-gray-400 text-xs">{item.addons.join(', ')}</p>}
//                       <p className="text-primary font-bold mt-1">Rs. {(item.basePrice * item.quantity).toFixed(0)}</p>
//                     </div>
//                     <div className="flex items-center gap-2 shrink-0">
//                       <button onClick={() => dispatch(updateQuantity({ key: item.key, quantity: item.quantity - 1 }))} className="w-7 h-7 rounded-full bg-white border border-gray-200 flex items-center justify-center hover:border-primary hover:text-primary transition-colors">
//                         <Minus size={12} />
//                       </button>
//                       <span className="w-6 text-center text-sm font-bold">{item.quantity}</span>
//                       <button onClick={() => dispatch(updateQuantity({ key: item.key, quantity: item.quantity + 1 }))} className="w-7 h-7 rounded-full bg-primary text-white flex items-center justify-center hover:bg-primary-600 transition-colors">
//                         <Plus size={12} />
//                       </button>
//                       <button onClick={() => dispatch(removeItem(item.key))} className="w-7 h-7 rounded-full bg-red-50 text-red-400 flex items-center justify-center hover:bg-red-100 transition-colors ml-1">
//                         <Trash2 size={12} />
//                       </button>
//                     </div>
//                   </motion.div>
//                 ))
//               )}
//             </div>

//             {items.length > 0 && (
//               <div className="px-6 py-5 border-t border-gray-100 space-y-3">
//                 <div className="space-y-2 text-sm">
//                   <div className="flex justify-between text-gray-500"><span>Subtotal</span><span>Rs. {subtotal}</span></div>
//                   <div className="flex justify-between text-gray-500"><span>GST (5%)</span><span>Rs. {tax}</span></div>
//                   <div className="flex justify-between text-gray-500"><span>{orderType === 'delivery' ? 'Delivery Fee' : 'Service Flow'}</span><span>Rs. {deliveryFee}</span></div>
//                   <div className="flex justify-between font-bold text-dark text-base border-t border-gray-100 pt-2">
//                     <span>Total</span><span className="text-primary">Rs. {total}</span>
//                   </div>
//                 </div>
//                 <Link to={`/checkout?mode=${orderType}`} onClick={onClose} className="btn-primary w-full text-center block">
//                   Proceed to Checkout
//                 </Link>
//                 <button onClick={onClose} className="btn-ghost w-full text-center text-sm">Continue Shopping</button>
//               </div>
//             )}
//           </motion.div>
//         </>
//       )}
//     </AnimatePresence>
//   );
// }
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Minus, ShoppingBag, Trash2 } from 'lucide-react';
import {
  selectCartItems,
  selectCartSubtotal,
  selectCartCount,
  selectOrderType,
  updateQuantity,
  removeItem,
} from '../../store/slices/cartSlice';

export default function CartDrawer({ isOpen, onClose }) {
  const dispatch = useDispatch();
  const items = useSelector(selectCartItems);
  const subtotal = useSelector(selectCartSubtotal);
  const count = useSelector(selectCartCount);
  const orderType = useSelector(selectOrderType);
  const tax = Math.round(subtotal * 0.05);
  const deliveryFee = orderType === 'delivery' ? 30 : 0;
  const total = subtotal + tax + deliveryFee;

  // Get display name for order type
  const getOrderTypeDisplay = (type) => {
    switch(type) {
      case 'delivery': return 'Delivery';
      case 'takeaway': return 'Takeaway';
      case 'dine-in': return 'Dine-In';
      case 'pre-order': return 'Pre-Order';
      default: return 'Delivery';
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-40 backdrop-blur-sm"
          />

          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-white z-50 flex flex-col shadow-2xl"
          >
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <ShoppingBag className="text-[#b97844]" size={22} />
                <h2 className="font-display font-bold text-xl text-[#3f3328]">Your Cart</h2>
                {count > 0 && <span className="bg-[#b97844] text-white text-xs rounded-full px-2 py-0.5">{count} items</span>}
              </div>
              <button onClick={onClose} className="w-9 h-9 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors">
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center py-16">
                  <ShoppingBag size={56} className="text-gray-200 mb-4" />
                  <h3 className="font-display text-xl font-bold text-gray-400 mb-2">Your cart is empty</h3>
                  <p className="text-gray-400 text-sm mb-6">Add some delicious items from our menu.</p>
                  <button onClick={onClose} className="bg-[#b97844] text-white rounded-full px-6 py-2 hover:bg-[#9e6538] transition-all">
                    <Link to={`/menu?mode=${orderType}`}>Browse Menu</Link>
                  </button>
                </div>
              ) : (
                items.map((item) => (
                  <motion.div key={item.key} layout initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: -20 }} className="flex items-start gap-4 bg-gray-50 rounded-2xl p-4">
                    {item.image && (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-16 rounded-xl object-cover shrink-0"
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-[#3f3328] text-sm">{item.name}</h4>
                      {item.variant && <p className="text-gray-400 text-xs">{item.variant}</p>}
                      {item.addons?.length > 0 && <p className="text-gray-400 text-xs">{item.addons.join(', ')}</p>}
                      <p className="text-[#b97844] font-bold mt-1">Rs. {(item.basePrice * item.quantity).toFixed(0)}</p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <button onClick={() => dispatch(updateQuantity({ key: item.key, quantity: item.quantity - 1 }))} className="w-7 h-7 rounded-full bg-white border border-gray-200 flex items-center justify-center hover:border-[#b97844] hover:text-[#b97844] transition-colors">
                        <Minus size={12} />
                      </button>
                      <span className="w-6 text-center text-sm font-bold">{item.quantity}</span>
                      <button onClick={() => dispatch(updateQuantity({ key: item.key, quantity: item.quantity + 1 }))} className="w-7 h-7 rounded-full bg-[#b97844] text-white flex items-center justify-center hover:bg-[#9e6538] transition-colors">
                        <Plus size={12} />
                      </button>
                      <button onClick={() => dispatch(removeItem(item.key))} className="w-7 h-7 rounded-full bg-red-50 text-red-400 flex items-center justify-center hover:bg-red-100 transition-colors ml-1">
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </motion.div>
                ))
              )}
            </div>

            {items.length > 0 && (
              <div className="px-6 py-5 border-t border-gray-100 space-y-3">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between text-gray-500"><span>Subtotal</span><span>Rs. {subtotal}</span></div>
                  <div className="flex justify-between text-gray-500"><span>GST (5%)</span><span>Rs. {tax}</span></div>
                  <div className="flex justify-between text-gray-500"><span>{getOrderTypeDisplay(orderType)}</span><span>Rs. {deliveryFee}</span></div>
                  <div className="flex justify-between font-bold text-[#3f3328] text-base border-t border-gray-100 pt-2">
                    <span>Total</span><span className="text-[#b97844]">Rs. {total}</span>
                  </div>
                </div>
                <Link to={`/checkout?mode=${orderType}`} onClick={onClose} className="bg-[#b97844] text-white rounded-full py-3 w-full text-center block hover:bg-[#9e6538] transition-all">
                  Proceed to Checkout
                </Link>
                <button onClick={onClose} className="border border-gray-200 rounded-full py-3 w-full text-center text-sm text-gray-600 hover:border-[#b97844] hover:text-[#b97844] transition-all">
                  Continue Shopping
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}