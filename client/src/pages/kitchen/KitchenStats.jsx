// ============================================================
// components/kitchen/pages/KitchenStats.jsx
// ============================================================
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { LoadingSpinner } from '../../components/shared/StatusBadge';

export function KitchenStats() {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get('/kitchen/stats')
            .then(r => setStats(r.data))
            .finally(() => setLoading(false));
        const t = setInterval(() => axios.get('/kitchen/stats').then(r => setStats(r.data)), 30000);
        return () => clearInterval(t);
    }, []);

    if (loading) return <LoadingSpinner />;

    const cards = [
        { icon: '✅', label: 'Completed Today', value: stats?.completedToday || 0, color: '#28a745' },
        { icon: '⏱️', label: 'Avg Prep Time', value: `${stats?.avgPrepTimeMinutes || 0} min`, color: '#17a2b8' },
        { icon: '🔥', label: 'Currently Preparing', value: stats?.currentlyPreparing || 0, color: '#fd7e14' },
        { icon: '⏳', label: 'Pending Orders', value: stats?.pendingOrders || 0, color: '#ffc107' },
    ];

    return (
        <div>
            <h5 className="fw-bold text-white mb-4">📊 Kitchen Performance</h5>

            <div className="row g-3 mb-4">
                {cards.map((card, i) => (
                    <div key={i} className="col-6 col-md-3">
                        <div className="card border-0 text-center p-4" style={{ background: '#16213e', borderLeft: `4px solid ${card.color} !important` }}>
                            <div style={{ fontSize: 36 }}>{card.icon}</div>
                            <div className="fw-bold text-white mt-2" style={{ fontSize: 28 }}>{card.value}</div>
                            <div className="text-secondary small">{card.label}</div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Performance Guide */}
            <div className="card border-0" style={{ background: '#16213e' }}>
                <div className="card-body">
                    <h6 className="fw-semibold text-white mb-3">⏱️ Order Timer Color Guide</h6>
                    <div className="d-flex flex-column gap-2">
                        <div className="d-flex align-items-center gap-3">
                            <span className="badge bg-success px-3 py-2">Green</span>
                            <span className="text-secondary small">Order under 8 minutes — On track</span>
                        </div>
                        <div className="d-flex align-items-center gap-3">
                            <span className="badge bg-warning text-dark px-3 py-2">Yellow</span>
                            <span className="text-secondary small">8–15 minutes — Getting slow, prioritize</span>
                        </div>
                        <div className="d-flex align-items-center gap-3">
                            <span className="badge bg-danger px-3 py-2">Red</span>
                            <span className="text-secondary small">Over 15 minutes — Critical, needs immediate attention</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default KitchenStats;
