import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext';

// 1. Create the context
const SocketContext = createContext();

// 2. Create the Provider component
export const SocketProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);
    const { user, token, isAuthenticated } = useAuth(); // Get auth state

    useEffect(() => {
        // Only connect the socket if the user is authenticated
        if (isAuthenticated && token) {
            const newSocket = io('http://localhost:5000', {
                auth: {
                    token: token // Pass the token for authentication on the backend
                }
            });

            setSocket(newSocket);

            // Optional: Listen for connection events
            newSocket.on('connect', () => {
                console.log('Socket connected:', newSocket.id);
            });

            newSocket.on('disconnect', () => {
                console.log('Socket disconnected');
            });

            // Cleanup function: disconnect when the component unmounts or user logs out
            return () => {
                newSocket.close();
            };
        } else {
            // If user is not authenticated, ensure socket is null
            if (socket) {
                socket.close();
                setSocket(null);
            }
        }
    }, [isAuthenticated, token]); // Rerun effect only when auth state changes

    // 3. Provide the socket instance to the rest of the app
    return (
        <SocketContext.Provider value={socket}>
            {children}
        </SocketContext.Provider>
    );
};

// 4. Create a custom hook for easy access to the socket
export const useSocket = () => {
    return useContext(SocketContext);
};