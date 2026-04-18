// import axios from 'axios';

// const api = axios.create({
//     baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
//     withCredentials: true,
// });

// // Request interceptor: Attach token from localStorage
// api.interceptors.request.use((config) => {
//     const token = localStorage.getItem('token');
//     if (token) {
//         config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
// });

// // Response interceptor: Handle token expiration (401)
// api.interceptors.response.use(
//     (res) => res,
//     async (err) => {
//         const originalRequest = err.config;
//         if (err.response?.status === 401 && !originalRequest._retry) {
//             originalRequest._retry = true;
//             try {
//                 const { data } = await axios.post(
//                     `${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/auth/refresh-token`,
//                     {},
//                     { withCredentials: true }
//                 );
//                 const newToken = data.token || data.accessToken;
//                 localStorage.setItem('token', newToken);
//                 originalRequest.headers.Authorization = `Bearer ${newToken}`;
//                 return api(originalRequest);
//             } catch (refreshErr) {
//                 localStorage.removeItem('token');
//                 window.location.href = '/login';
//             }
//         }
//         return Promise.reject(err);
//     }
// );

// export default api;

// ✅ Base URL — no trailing slash, no /api suffix duplication
const BASE_URL = (import.meta.env.VITE_API_URL || 'http://localhost:5000/api').replace(/\/$/, '');

import axios from 'axios';

const api = axios.create({
    baseURL: BASE_URL,
    withCredentials: true,
    timeout: 15000, // ✅ Prevent hanging requests (important for Render free tier)
});

// ✅ Request interceptor: Attach token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error) // ✅ Handle request errors too
);

// ✅ Track if we're already refreshing to prevent refresh loops
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
    failedQueue.forEach(({ resolve, reject }) => {
        if (error) reject(error);
        else resolve(token);
    });
    failedQueue = [];
};

// ✅ Response interceptor: Handle 401 with queue to prevent multiple refresh calls
api.interceptors.response.use(
    (res) => res,
    async (err) => {
        const originalRequest = err.config;

        // Don't retry refresh endpoint itself
        if (originalRequest.url?.includes('/auth/refresh-token')) {
            localStorage.removeItem('token');
            window.location.href = '/login';
            return Promise.reject(err);
        }

        if (err.response?.status === 401 && !originalRequest._retry) {
            if (isRefreshing) {
                // ✅ Queue requests while refresh is in progress
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                }).then((token) => {
                    originalRequest.headers.Authorization = `Bearer ${token}`;
                    return api(originalRequest);
                }).catch((e) => Promise.reject(e));
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
                const { data } = await axios.post(
                    `${BASE_URL}/auth/refresh-token`,
                    {},
                    { withCredentials: true }
                );

                const newToken = data.token || data.accessToken;
                localStorage.setItem('token', newToken);
                api.defaults.headers.common.Authorization = `Bearer ${newToken}`; // ✅ Update default header
                originalRequest.headers.Authorization = `Bearer ${newToken}`;
                processQueue(null, newToken);
                return api(originalRequest);
            } catch (refreshErr) {
                processQueue(refreshErr, null);
                localStorage.removeItem('token');
                window.location.href = '/login';
                return Promise.reject(refreshErr);
            } finally {
                isRefreshing = false; // ✅ Always reset flag
            }
        }

        return Promise.reject(err);
    }
);

export default api;