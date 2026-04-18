// // components/manager/pages/ManagerDashboard.jsx
// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import { Pie, Bar } from 'react-chartjs-2';
// import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from 'chart.js';
// import { KPICard, StatusBadge, LoadingSpinner, AlertBox } from '../../shared/SharedComponents';

// ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

// export default function ManagerDashboard() {    const [data, setData]     = useState(null);
//     const [loading, setLoading] = useState(true);
//     const [error, setError]   = useState('');

//     const fetch = async () => {
//         try {
//             const res = await axios.get('/api/manager/dashboard');
//             setData(res.data);
//         } catch { setError('Failed to load dashboard data.'); }
//         finally { setLoading(false); }
//     };

//     useEffect(() => { fetch(); const t = setInterval(fetch, 30000); return () => clearInterval(t); }, []);

//     if (loading) return <LoadingSpinner />;

//     const COLORS = ['#FF6384','#36A2EB','#FFCE56','#4BC0C0','#9966FF','#FF9F40'];
//     const catKeys = Object.keys(data?.categorySales || {});

//     const pieData = {
//         labels: catKeys,
//         datasets: [{ data: catKeys.map(k => data.categorySales[k]), backgroundColor: COLORS }]
//     };
//     const barData = {
//         labels: data.topItems.map(i => i.name),
//         datasets: [{ label: 'Units Sold', data: data.topItems.map(i => i.quantity), backgroundColor: '#36A2EB', borderRadius: 6 }]
//     };

//     return (
//         <div>
//             <h4 className="fw-bold mb-1">Dashboard</h4>
//             <p className="text-muted small mb-4">Real-time overview of your cafe</p>

//             {error && <AlertBox type="danger" onClose={() => setError('')}>{error}</AlertBox>}

//             {/* KPI Row */}
//             <div className="row g-3 mb-4">
//                 <div className="col-6 col-md-3"><KPICard icon="💰" label="Today's Revenue" value={`₹${(data.todaySales||0).toFixed(0)}`} color="success" /></div>
//                 <div className="col-6 col-md-3"><KPICard icon="🧾" label="Today's Orders" value={data.todayOrderCount||0} color="primary" /></div>
//                 <div className="col-6 col-md-3"><KPICard icon="⏳" label="Pending Orders" value={data.statusCounts?.find(s=>s._id==='Pending')?.count||0} color="warning" /></div>
//                 <div className="col-6 col-md-3"><KPICard icon="⚠️" label="Low Stock Alerts" value={data.lowStockAlerts?.length||0} color="danger" /></div>
//             </div>

//             {/* Low Stock Alerts Banner */}
//             {data.lowStockAlerts?.length > 0 && (
//                 <div className="alert alert-danger d-flex flex-wrap gap-2 align-items-center mb-4">
//                     <strong>⚠️ Low Stock:</strong>
//                     {data.lowStockAlerts.map(item => (
//                         <span key={item._id} className="badge bg-danger">
//                             {item.name}: {item.currentStock} {item.unit}
//                         </span>
//                     ))}
//                 </div>
//             )}

//             {/* Charts */}
//             <div className="row g-4 mb-4">
//                 <div className="col-md-5">
//                     <div className="card border-0 shadow-sm h-100">
//                         <div className="card-body">
//                             <h6 className="fw-semibold mb-3">Sales by Category</h6>
//                             {catKeys.length > 0 ? <Pie data={pieData} /> : <p className="text-muted small">No sales yet today.</p>}
//                         </div>
//                     </div>
//                 </div>
//                 <div className="col-md-7">
//                     <div className="card border-0 shadow-sm h-100">
//                         <div className="card-body">
//                             <h6 className="fw-semibold mb-3">Top 5 Selling Items Today</h6>
//                             {data.topItems?.length > 0
//                                 ? <Bar data={barData} options={{ responsive: true, plugins: { legend: { display: false } } }} />
//                                 : <p className="text-muted small">No sales data yet.</p>
//                             }
//                         </div>
//                     </div>
//                 </div>
//             </div>

//             {/* Recent Orders */}
//             <div className="card border-0 shadow-sm">
//                 <div className="card-header bg-white border-0 pt-3">
//                     <h6 className="fw-semibold mb-0">Recent Orders</h6>
//                 </div>
//                 <div className="card-body p-0">
//                     <div className="table-responsive">
//                         <table className="table table-hover mb-0 align-middle">
//                             <thead className="table-light">
//                                 <tr>
//                                     <th>Order ID</th><th>Customer</th><th>Items</th>
//                                     <th>Total</th><th>Status</th><th>Time</th>
//                                 </tr>
//                             </thead>
//                             <tbody>
//                                 {data.recentOrders?.map(o => (
//                                     <tr key={o._id}>
//                                         <td className="font-monospace text-muted small">#{o._id.slice(-6)}</td>
//                                         <td>{o.customer?.name || 'Guest'}</td>
//                                         <td>{o.items?.length} item(s)</td>
//                                         <td className="fw-semibold">₹{o.totalPrice?.toFixed(0)}</td>
//                                         <td><StatusBadge status={o.status} /></td>
//                                         <td className="text-muted small">{new Date(o.createdAt).toLocaleTimeString()}</td>
//                                     </tr>
//                                 ))}
//                             </tbody>
//                         </table>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// }