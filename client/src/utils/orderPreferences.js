// // frontend/src/utils/orderPreferences.js

// const STORAGE_KEY = 'orderPreferences';

// export const saveOrderPreferences = (preferences) => {
//   if (!preferences) return;
//   sessionStorage.setItem(STORAGE_KEY, JSON.stringify(preferences));
// };

// export const getOrderPreferences = () => {
//   try {
//     const saved = sessionStorage.getItem(STORAGE_KEY);
//     if (!saved) return null;
//     return JSON.parse(saved);
//   } catch {
//     return null;
//   }
// };

// export const clearOrderPreferences = () => {
//   sessionStorage.removeItem(STORAGE_KEY);
// };

// export const hasOrderPreferences = () => {
//   return getOrderPreferences() !== null;
// };


// frontend/src/utils/orderPreferences.js

const STORAGE_KEY = 'orderPreferences';

export const saveOrderPreferences = (preferences) => {
  if (!preferences) return;
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(preferences));
};

export const getOrderPreferences = () => {
  try {
    const saved = sessionStorage.getItem(STORAGE_KEY);
    if (!saved) return null;
    return JSON.parse(saved);
  } catch {
    return null;
  }
};

export const clearOrderPreferences = () => {
  sessionStorage.removeItem(STORAGE_KEY);
};

export const hasOrderPreferences = () => {
  return getOrderPreferences() !== null;
};

export const getCurrentOrderType = () => {
  const prefs = getOrderPreferences();
  return prefs?.deliveryMethod || null;
};