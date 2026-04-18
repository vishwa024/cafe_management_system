const trimTrailingSlash = (value = '') => String(value || '').replace(/\/+$/, '');

const explicitApiUrl = trimTrailingSlash(import.meta.env.VITE_API_URL);
const defaultApiUrl = 'https://cafe-management-system-sjai.onrender.com/api';

export const API_BASE_URL = explicitApiUrl || defaultApiUrl;
export const SOCKET_URL = trimTrailingSlash(
  import.meta.env.VITE_SOCKET_URL || API_BASE_URL.replace(/\/api$/, '')
);
export const APP_BASE_URL = trimTrailingSlash(import.meta.env.VITE_APP_URL || window.location.origin);

