// // // import { createSlice } from '@reduxjs/toolkit';

// // // const cartSlice = createSlice({
// // //   name: 'cart',
// // //   initialState: {
// // //     items: [],
// // //     orderType: 'delivery',
// // //     couponCode: '',
// // //     discount: 0,
// // //   },
// // //   reducers: {
// // //     addItem: (state, action) => {
// // //       const { menuItemId, name, basePrice, variant, addons, image } = action.payload;
// // //       const key = `${menuItemId}-${variant || 'base'}-${(addons || []).join(',')}`;
// // //       const existing = state.items.find(i => i.key === key);
// // //       if (existing) {
// // //         existing.quantity += 1;
// // //       } else {
// // //         state.items.push({ key, menuItemId, name, basePrice, variant, addons: addons || [], image, quantity: 1 });
// // //       }
// // //     },
// // //     removeItem: (state, action) => {
// // //       state.items = state.items.filter(i => i.key !== action.payload);
// // //     },
// // //     updateQuantity: (state, action) => {
// // //       const { key, quantity } = action.payload;
// // //       const item = state.items.find(i => i.key === key);
// // //       if (item) {
// // //         if (quantity <= 0) state.items = state.items.filter(i => i.key !== key);
// // //         else item.quantity = quantity;
// // //       }
// // //     },
// // //     clearCart: (state) => {
// // //       state.items = [];
// // //       state.couponCode = '';
// // //       state.discount = 0;
// // //     },
// // //     setOrderType: (state, action) => { state.orderType = action.payload; },
// // //     applyCoupon: (state, action) => {
// // //       state.couponCode = action.payload.code;
// // //       state.discount = action.payload.discount;
// // //     },
// // //     removeCoupon: (state) => { state.couponCode = ''; state.discount = 0; },
// // //   },
// // // });

// // // // ─── Selectors ────────────────────────────────────────────────────────────────
// // // export const selectCartItems = (state) => state.cart.items;
// // // export const selectCartCount = (state) => state.cart.items.reduce((sum, i) => sum + i.quantity, 0);
// // // export const selectCartSubtotal = (state) => state.cart.items.reduce((sum, i) => sum + i.basePrice * i.quantity, 0);

// // // export const selectOrderType = (state) => state.cart.orderType;


// // // export const { addItem, removeItem, updateQuantity, clearCart, setOrderType, applyCoupon, removeCoupon } = cartSlice.actions;
// // // export default cartSlice.reducer;
// // import { createSlice } from '@reduxjs/toolkit';

// // // Load cart from localStorage
// // const loadCartFromStorage = () => {
// //   try {
// //     const savedCart = localStorage.getItem('cart');
// //     if (savedCart) {
// //       return JSON.parse(savedCart);
// //     }
// //   } catch (e) {
// //     console.error('Error loading cart:', e);
// //   }
// //   return {
// //     items: [],
// //     orderType: 'delivery',
// //     couponCode: '',
// //     discount: 0,
// //   };
// // };

// // // Save cart to localStorage
// // const saveCartToStorage = (state) => {
// //   try {
// //     localStorage.setItem('cart', JSON.stringify({
// //       items: state.items,
// //       orderType: state.orderType,
// //       couponCode: state.couponCode,
// //       discount: state.discount,
// //     }));
// //   } catch (e) {
// //     console.error('Error saving cart:', e);
// //   }
// // };

// // const initialState = loadCartFromStorage();

// // const cartSlice = createSlice({
// //   name: 'cart',
// //   initialState,
// //   reducers: {
// //     addItem: (state, action) => {
// //       const { menuItemId, name, basePrice, variant, addons, image } = action.payload;
// //       const key = `${menuItemId}-${variant || 'base'}-${(addons || []).join(',')}`;
// //       const existing = state.items.find(i => i.key === key);
// //       if (existing) {
// //         existing.quantity += 1;
// //       } else {
// //         state.items.push({ 
// //           key, 
// //           menuItemId, 
// //           name, 
// //           basePrice, 
// //           variant, 
// //           addons: addons || [], 
// //           image, 
// //           quantity: 1 
// //         });
// //       }
// //       saveCartToStorage(state);
// //     },
// //     removeItem: (state, action) => {
// //       state.items = state.items.filter(i => i.key !== action.payload);
// //       saveCartToStorage(state);
// //     },
// //     updateQuantity: (state, action) => {
// //       const { key, quantity } = action.payload;
// //       const item = state.items.find(i => i.key === key);
// //       if (item) {
// //         if (quantity <= 0) {
// //           state.items = state.items.filter(i => i.key !== key);
// //         } else {
// //           item.quantity = quantity;
// //         }
// //       }
// //       saveCartToStorage(state);
// //     },
// //     clearCart: (state) => {
// //       state.items = [];
// //       state.couponCode = '';
// //       state.discount = 0;
// //       saveCartToStorage(state);
// //     },
// //     setOrderType: (state, action) => { 
// //       state.orderType = action.payload;
// //       saveCartToStorage(state);
// //     },
// //     applyCoupon: (state, action) => {
// //       state.couponCode = action.payload.code;
// //       state.discount = action.payload.discount;
// //       saveCartToStorage(state);
// //     },
// //     removeCoupon: (state) => { 
// //       state.couponCode = ''; 
// //       state.discount = 0;
// //       saveCartToStorage(state);
// //     },
// //   },
// // });

// // // Selectors
// // export const selectCartItems = (state) => state.cart.items;
// // export const selectCartCount = (state) => state.cart.items.reduce((sum, i) => sum + i.quantity, 0);
// // export const selectCartSubtotal = (state) => state.cart.items.reduce((sum, i) => sum + i.basePrice * i.quantity, 0);
// // export const selectOrderType = (state) => state.cart.orderType;

// // export const { 
// //   addItem, 
// //   removeItem, 
// //   updateQuantity, 
// //   clearCart, 
// //   setOrderType, 
// //   applyCoupon, 
// //   removeCoupon 
// // } = cartSlice.actions;

// // export default cartSlice.reducer;

// import { createSlice } from '@reduxjs/toolkit';

// // Load cart from localStorage based on user session
// const loadCartFromStorage = (isAuthenticated = false, userId = null) => {
//   try {
//     // Use different storage keys for guest and authenticated users
//     const storageKey = isAuthenticated && userId 
//       ? `cart_user_${userId}` 
//       : 'cart_guest';
    
//     const savedCart = localStorage.getItem(storageKey);
//     if (savedCart) {
//       return JSON.parse(savedCart);
//     }
//   } catch (e) {
//     console.error('Error loading cart:', e);
//   }
//   return {
//     items: [],
//     orderType: 'delivery',
//     couponCode: '',
//     discount: 0,
//   };
// };

// // Save cart to localStorage based on user session
// const saveCartToStorage = (state, isAuthenticated = false, userId = null) => {
//   try {
//     const storageKey = isAuthenticated && userId 
//       ? `cart_user_${userId}` 
//       : 'cart_guest';
    
//     localStorage.setItem(storageKey, JSON.stringify({
//       items: state.items,
//       orderType: state.orderType,
//       couponCode: state.couponCode,
//       discount: state.discount,
//     }));
//   } catch (e) {
//     console.error('Error saving cart:', e);
//   }
// };

// // Merge guest cart into user cart
// export const mergeGuestCart = (userId, guestCartItems) => {
//   try {
//     const userCartKey = `cart_user_${userId}`;
//     const existingUserCart = localStorage.getItem(userCartKey);
//     let userItems = [];
    
//     if (existingUserCart) {
//       const parsed = JSON.parse(existingUserCart);
//       userItems = parsed.items || [];
//     }
    
//     // Merge items (add quantities if same item exists)
//     const mergedItems = [...userItems];
//     guestCartItems.forEach(guestItem => {
//       const existingIndex = mergedItems.findIndex(item => item.key === guestItem.key);
//       if (existingIndex !== -1) {
//         mergedItems[existingIndex].quantity += guestItem.quantity;
//       } else {
//         mergedItems.push(guestItem);
//       }
//     });
    
//     // Save merged cart
//     localStorage.setItem(userCartKey, JSON.stringify({
//       items: mergedItems,
//       orderType: 'delivery',
//       couponCode: '',
//       discount: 0,
//     }));
    
//     // Clear guest cart
//     localStorage.removeItem('cart_guest');
    
//     return { items: mergedItems, orderType: 'delivery', couponCode: '', discount: 0 };
//   } catch (e) {
//     console.error('Error merging cart:', e);
//     return null;
//   }
// };

// // Clear user cart on logout
// export const clearUserCart = (userId) => {
//   try {
//     const userCartKey = `cart_user_${userId}`;
//     localStorage.removeItem(userCartKey);
//   } catch (e) {
//     console.error('Error clearing user cart:', e);
//   }
// };

// // Get initial state with dynamic user check
// const getInitialState = () => {
//   // This will be updated when the component mounts with actual auth state
//   return {
//     items: [],
//     orderType: 'delivery',
//     couponCode: '',
//     discount: 0,
//     isInitialized: false,
//   };
// };

// const cartSlice = createSlice({
//   name: 'cart',
//   initialState: getInitialState(),
//   reducers: {
//     // Initialize cart with user authentication state
//     initializeCart: (state, action) => {
//       const { isAuthenticated, userId } = action.payload;
//       const loadedCart = loadCartFromStorage(isAuthenticated, userId);
//       state.items = loadedCart.items;
//       state.orderType = loadedCart.orderType;
//       state.couponCode = loadedCart.couponCode;
//       state.discount = loadedCart.discount;
//       state.isInitialized = true;
//     },
    
//     addItem: (state, action) => {
//       const { menuItemId, name, basePrice, variant, addons, image } = action.payload;
//       const key = `${menuItemId}-${variant || 'base'}-${(addons || []).join(',')}`;
//       const existing = state.items.find(i => i.key === key);
//       if (existing) {
//         existing.quantity += 1;
//       } else {
//         state.items.push({ 
//           key, 
//           menuItemId, 
//           name, 
//           basePrice, 
//           variant, 
//           addons: addons || [], 
//           image, 
//           quantity: 1 
//         });
//       }
//     },
    
//     removeItem: (state, action) => {
//       state.items = state.items.filter(i => i.key !== action.payload);
//     },
    
//     updateQuantity: (state, action) => {
//       const { key, quantity } = action.payload;
//       const item = state.items.find(i => i.key === key);
//       if (item) {
//         if (quantity <= 0) {
//           state.items = state.items.filter(i => i.key !== key);
//         } else {
//           item.quantity = quantity;
//         }
//       }
//     },
    
//     clearCart: (state) => {
//       state.items = [];
//       state.couponCode = '';
//       state.discount = 0;
//     },
    
//     setOrderType: (state, action) => { 
//       state.orderType = action.payload;
//     },
    
//     applyCoupon: (state, action) => {
//       state.couponCode = action.payload.code;
//       state.discount = action.payload.discount;
//     },
    
//     removeCoupon: (state) => { 
//       state.couponCode = ''; 
//       state.discount = 0;
//     },
    
//     // Sync cart to localStorage
//     syncCartToStorage: (state, action) => {
//       const { isAuthenticated, userId } = action.payload;
//       saveCartToStorage(state, isAuthenticated, userId);
//     },
//   },
// });

// // Selectors
// export const selectCartItems = (state) => state.cart.items;
// export const selectCartCount = (state) => state.cart.items.reduce((sum, i) => sum + i.quantity, 0);
// export const selectCartSubtotal = (state) => state.cart.items.reduce((sum, i) => sum + i.basePrice * i.quantity, 0);
// export const selectOrderType = (state) => state.cart.orderType;

// export const { 
//   addItem, 
//   removeItem, 
//   updateQuantity, 
//   clearCart, 
//   setOrderType, 
//   applyCoupon, 
//   removeCoupon,
//   initializeCart,
//   syncCartToStorage,
// } = cartSlice.actions;

// export default cartSlice.reducer;

import { createSlice } from '@reduxjs/toolkit';

// Load cart from localStorage
const loadCartFromStorage = () => {
  try {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      return JSON.parse(savedCart);
    }
  } catch (e) {
    console.error('Error loading cart:', e);
  }
  return {
    items: [],
    orderType: 'delivery',
    couponCode: '',
    discount: 0,
  };
};

// Save cart to localStorage
const saveCartToStorage = (state) => {
  try {
    localStorage.setItem('cart', JSON.stringify({
      items: state.items,
      orderType: state.orderType,
      couponCode: state.couponCode,
      discount: state.discount,
    }));
  } catch (e) {
    console.error('Error saving cart:', e);
  }
};

const mergeCartCollections = (existingItems = [], incomingItems = []) => {
  const mergedItems = [...existingItems];

  incomingItems.forEach((incomingItem) => {
    const existingIndex = mergedItems.findIndex((item) => item.key === incomingItem.key);
    if (existingIndex >= 0) {
      mergedItems[existingIndex] = {
        ...mergedItems[existingIndex],
        quantity: (mergedItems[existingIndex].quantity || 0) + (incomingItem.quantity || 0),
      };
      return;
    }

    mergedItems.push(incomingItem);
  });

  return mergedItems;
};

const initialState = loadCartFromStorage();

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addItem: (state, action) => {
      const { menuItemId, name, basePrice, variant, addons, image } = action.payload;
      const key = `${menuItemId}-${variant || 'base'}-${(addons || []).join(',')}`;
      const existing = state.items.find(i => i.key === key);
      if (existing) {
        existing.quantity += 1;
      } else {
        state.items.push({ 
          key, 
          menuItemId, 
          name, 
          basePrice, 
          variant, 
          addons: addons || [], 
          image, 
          quantity: 1 
        });
      }
      saveCartToStorage(state);
    },
    removeItem: (state, action) => {
      state.items = state.items.filter(i => i.key !== action.payload);
      saveCartToStorage(state);
    },
    updateQuantity: (state, action) => {
      const { key, quantity } = action.payload;
      const item = state.items.find(i => i.key === key);
      if (item) {
        if (quantity <= 0) {
          state.items = state.items.filter(i => i.key !== key);
        } else {
          item.quantity = quantity;
        }
      }
      saveCartToStorage(state);
    },
    clearCart: (state) => {
      state.items = [];
      state.couponCode = '';
      state.discount = 0;
      saveCartToStorage(state);
    },
    setOrderType: (state, action) => { 
      state.orderType = action.payload;
      saveCartToStorage(state);
    },
    applyCoupon: (state, action) => {
      state.couponCode = action.payload.code;
      state.discount = action.payload.discount;
      saveCartToStorage(state);
    },
    removeCoupon: (state) => { 
      state.couponCode = ''; 
      state.discount = 0;
      saveCartToStorage(state);
    },
    mergeGuestCartItems: (state, action) => {
      const guestItems = Array.isArray(action.payload) ? action.payload : [];
      if (!guestItems.length) {
        return;
      }

      state.items = mergeCartCollections(state.items, guestItems);
      saveCartToStorage(state);
    },
  },
});

// Selectors
export const selectCartItems = (state) => state.cart.items;
export const selectCartCount = (state) => state.cart.items.reduce((sum, i) => sum + i.quantity, 0);
export const selectCartSubtotal = (state) => state.cart.items.reduce((sum, i) => sum + i.basePrice * i.quantity, 0);
export const selectOrderType = (state) => state.cart.orderType;

export const { 
  addItem, 
  removeItem, 
  updateQuantity, 
  clearCart, 
  setOrderType, 
  applyCoupon, 
  removeCoupon,
  mergeGuestCartItems,
} = cartSlice.actions;

export default cartSlice.reducer;
