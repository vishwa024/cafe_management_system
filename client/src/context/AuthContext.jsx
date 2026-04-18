// import React, { createContext, useState, useContext, useEffect } from 'react';
// import authService from '../services/authService';

// const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//     const [user, setUser] = useState(null);
//     const [token, setToken] = useState(localStorage.getItem('token'));
//     const [loading, setLoading] = useState(true);

//     useEffect(() => {
//         if (token) {
//             // You could add a call here to validate the token on the backend
//             // For now, we assume a valid token means a logged-in user
//             setUser({ role: 'manager' }); // Placeholder, should be decoded from token
//         }
//         setLoading(false);
//     }, [token]);

//     const login = async (username, password) => {
//         try {
//             const data = await authService.login(username, password);
//             setToken(data.token);
//             setUser(data.user);
//             localStorage.setItem('token', data.token);
//             return data.user;
//         } catch (error) {
//             throw error; // Let the component handle the error
//         }
//     };

//     const logout = () => {
//         setToken(null);
//         setUser(null);
//         localStorage.removeItem('token');
//     };

//     return (
//         <AuthContext.Provider value={{ user, token, login, logout, loading, isAuthenticated: !!token }}>
//             {children}
//         </AuthContext.Provider>
//     );
// };

// export const useAuth = () => useContext(AuthContext);
import React, { createContext, useState, useContext, useEffect } from 'react';
import authService from '../services/authService.js';

export const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(false);
    }, []);

    const login = async (username, password) => {
        const data = await authService.login(username, password);
        setToken(data.token);
        setUser(data.user);
        localStorage.setItem('token', data.token); // ✅ ADD THIS LINE
        return data.user;
    };

    const logout = () => {
        setToken(null);
        setUser(null);
        localStorage.removeItem('token');
    };

    return (
        <AuthContext.Provider value={{ user, token, login, logout, loading, isAuthenticated: !!token }}>
            {children}
        </AuthContext.Provider>
    );
};