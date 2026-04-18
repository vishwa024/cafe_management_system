// ============================================================
// components/kitchen/KitchenLayout.jsx
// ============================================================
import React, { useState } from 'react';
import { Routes, Route, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import KitchenDisplay from './pages/KitchenDisplay';
import KitchenWasteLog from './pages/KitchenWasteLog';
import KitchenStats from './pages/KitchenStats';

const navItems = [
    { to: '/kitchen',        label: '🍳 Live Orders',  end: true },
    { to: '/kitchen/stats',  label: '📊 Stats'                  },
    { to: '/kitchen/waste',  label: '🗑️ Waste Log'             },
];

export default function KitchenLayout() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
    const handleLogout = () => {
        setShowLogoutConfirm(false);
        logout();
        navigate('/login');
    };
    return (
        <div style={{ minHeight: '100vh', background: '#1a1a2e', color: '#fff' }}>
            {/* Top Navbar */}
            <nav className="navbar navbar-dark" style={{ background: '#16213e', borderBottom: '1px solid #0f3460' }}>
                <div className="container-fluid">
                    <span className="navbar-brand fw-bold">🍳 Kitchen Panel</span>
                    <div className="d-flex gap-1">
                        {navItems.map(item => (
                            <NavLink key={item.to} to={item.to} end={item.end}
                                className={({ isActive }) =>
                                    `btn btn-sm ${isActive ? 'btn-light text-dark' : 'btn-outline-light'}`
                                }>
                                {item.label}
                            </NavLink>
                        ))}
                    </div>
                    <div className="d-flex align-items-center gap-2">
                        <span className="text-light small">👨‍🍳 {user?.name}</span>
                        <button className="btn btn-sm btn-outline-danger" onClick={() => setShowLogoutConfirm(true)}>Logout</button>
                    </div>
                </div>
            </nav>
            <div className="p-3">
                <Routes>
                    <Route index       element={<KitchenDisplay />} />
                    <Route path="stats" element={<KitchenStats />} />
                    <Route path="waste" element={<KitchenWasteLog />} />
                </Routes>
            </div>
            {showLogoutConfirm && (
                <div className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center bg-dark bg-opacity-50 p-3" style={{ zIndex: 1050 }} onClick={() => setShowLogoutConfirm(false)}>
                    <div className="bg-white rounded-4 shadow-lg w-100" style={{ maxWidth: '420px', color: '#111827' }} onClick={(e) => e.stopPropagation()}>
                        <div className="border-bottom px-4 py-3">
                            <h2 className="h5 mb-1">Confirm Logout</h2>
                            <p className="mb-0 small text-secondary">You will need to sign in again to access the kitchen panel.</p>
                        </div>
                        <div className="d-flex justify-content-end gap-2 px-4 py-3">
                            <button className="btn btn-outline-secondary btn-sm" onClick={() => setShowLogoutConfirm(false)}>Cancel</button>
                            <button className="btn btn-danger btn-sm" onClick={handleLogout}>Logout</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}



