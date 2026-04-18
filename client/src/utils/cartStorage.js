// frontend/src/utils/cartStorage.js

const GUEST_CART_KEY = 'guestCart';

// Save guest cart to localStorage
export const saveGuestCart = (cartItems) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(GUEST_CART_KEY, JSON.stringify(cartItems));
  }
};

// Load guest cart from localStorage
export const loadGuestCart = () => {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem(GUEST_CART_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Error loading guest cart:', e);
        return [];
      }
    }
  }
  return [];
};

// Clear guest cart
export const clearGuestCart = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(GUEST_CART_KEY);
  }
};