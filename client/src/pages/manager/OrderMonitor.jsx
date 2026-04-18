// components/manager/pages/OrderManagement.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { PageHeader, StatusBadge, Modal, LoadingSpinner, EmptyState } from '../../components/shared/StatusBadge';

const STATUSES = ['', 'Pending', 'Preparing', 'Ready', 'Completed', 'Cancelled'];

export default function OrderManagement() {
    const [orders, setOrders]       = useState([]);
    const [total, setTotal]         = useState(0);
    const [loading, setLoading]     = useState(true);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [cancelModal, setCancelModal]     = useState(null);
    const [cancelReason, setCancelReason]   = useState('');
    const [filters, setFilters]     = useState({ status: '', startDate: '', endDate: '', page: 1 });

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (filters.status)    params.append('status', filters.status);
            if (filters.startDate) params.append('startDate', filters.startDate);
            if (filters.endDate)   params.append('endDate', filters.endDate);
            params.append('page', filters.page);
            params.append('limit', 15);
            const res = await axios.get(`/manager/orders?${params}`);
            // ✅ FIX: Fallback to [] and 0 if response shape is unexpected
            setOrders(res.data?.orders ?? []);
            setTotal(res.data?.total ?? 0);
        } catch (err) {
            console.error(err);
            // ✅ FIX: Reset to safe defaults on error
            setOrders([]);
            setTotal(0);
        }
        finally { setLoading(false); }
    };

    useEffect(() => { fetchOrders(); }, [filters]);

    const handleCancel = async () => {
        try {
            await axios.patch(`/manager/orders/${cancelModal._id}/cancel`, { reason: cancelReason });
            setCancelModal(null);
            setCancelReason('');
            fetchOrders();
        } catch (err) { alert(err.response?.data?.message || 'Failed to cancel order'); }
    };

    const pages = Math.ceil(total / 15);

    return (
        <div>
            <PageHeader title="Order Management" subtitle={`${total} total orders`} />

            {/* Filters */}
            <div className="card border-0 shadow-sm mb-3">
                <div className="card-body">
                    <div className="row g-2 align-items-end">
                        <div className="col-md-3">
                            <label className="form-label small fw-semibold">Status</label>
                            <select className="form-select form-select-sm" value={filters.status}
                                onChange={e => setFilters(f => ({ ...f, status: e.target.value, page: 1 }))}>
                                {STATUSES.map(s => <option key={s} value={s}>{s || 'All Statuses'}</option>)}
                            </select>
                        </div>
                        <div className="col-md-3">
                            <label className="form-label small fw-semibold">From Date</label>
                            <input type="date" className="form-control form-control-sm" value={filters.startDate}
                                onChange={e => setFilters(f => ({ ...f, startDate: e.target.value, page: 1 }))} />
                        </div>
                        <div className="col-md-3">
                            <label className="form-label small fw-semibold">To Date</label>
                            <input type="date" className="form-control form-control-sm" value={filters.endDate}
                                onChange={e => setFilters(f => ({ ...f, endDate: e.target.value, page: 1 }))} />
                        </div>
                        <div className="col-md-3">
                            <button className="btn btn-sm btn-outline-secondary w-100"
                                onClick={() => setFilters({ status: '', startDate: '', endDate: '', page: 1 })}>
                                Clear Filters
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="card border-0 shadow-sm">
                <div className="card-body p-0">
                    {loading ? <LoadingSpinner /> : (
                        <div className="table-responsive">
                            <table className="table table-hover mb-0 align-middle">
                                <thead className="table-light">
                                    <tr>
                                        <th>Order ID</th><th>Customer</th><th>Type</th>
                                        <th>Items</th><th>Total</th><th>Status</th>
                                        <th>Date & Time</th><th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {/* ✅ FIX: orders is guaranteed to be an array now */}
                                    {orders.length === 0 ? (
                                        <tr><td colSpan={8}><EmptyState icon="🧾" message="No orders found" /></td></tr>
                                    ) : orders.map(o => (
                                        <tr key={o._id}>
                                            <td className="font-monospace text-muted small">#{o._id.slice(-6)}</td>
                                            <td>{o.customer?.name || 'Guest'}<br/><span className="text-muted" style={{fontSize:11}}>{o.customer?.email}</span></td>
                                            <td><span className="badge bg-light text-dark border">{o.orderType}</span></td>
                                            <td>{o.items?.length} item(s)</td>
                                            <td className="fw-semibold">₹{o.totalPrice?.toFixed(2)}</td>
                                            <td><StatusBadge status={o.status} /></td>
                                            <td className="text-muted small">{new Date(o.createdAt).toLocaleString()}</td>
                                            <td>
                                                <div className="d-flex gap-1">
                                                    <button className="btn btn-xs btn-outline-primary" style={{fontSize:11,padding:'2px 8px'}}
                                                        onClick={() => setSelectedOrder(o)}>View</button>
                                                    {!['Completed','Cancelled'].includes(o.status) && (
                                                        <button className="btn btn-xs btn-outline-danger" style={{fontSize:11,padding:'2px 8px'}}
                                                            onClick={() => { setCancelModal(o); setCancelReason(''); }}>Cancel</button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
                {/* Pagination */}
                {pages > 1 && (
                    <div className="card-footer bg-white d-flex justify-content-between align-items-center">
                        <span className="text-muted small">Page {filters.page} of {pages}</span>
                        <div className="d-flex gap-1">
                            <button className="btn btn-sm btn-outline-secondary" disabled={filters.page === 1}
                                onClick={() => setFilters(f => ({ ...f, page: f.page - 1 }))}>← Prev</button>
                            <button className="btn btn-sm btn-outline-secondary" disabled={filters.page === pages}
                                onClick={() => setFilters(f => ({ ...f, page: f.page + 1 }))}>Next →</button>
                        </div>
                    </div>
                )}
            </div>

            {/* Order Detail Modal */}
            <Modal show={!!selectedOrder} title={`Order #${selectedOrder?._id?.slice(-6)}`} onClose={() => setSelectedOrder(null)} size="lg">
                {selectedOrder && (
                    <div>
                        <div className="row g-3 mb-3">
                            <div className="col-6"><strong>Customer:</strong> {selectedOrder.customer?.name || 'Guest'}</div>
                            <div className="col-6"><strong>Status:</strong> <StatusBadge status={selectedOrder.status} /></div>
                            <div className="col-6"><strong>Type:</strong> {selectedOrder.orderType}</div>
                            {selectedOrder.tableNumber && <div className="col-6"><strong>Table:</strong> {selectedOrder.tableNumber}</div>}
                            {selectedOrder.promoCode && <div className="col-6"><strong>Promo:</strong> {selectedOrder.promoCode}</div>}
                            {selectedOrder.cancelReason && <div className="col-12 text-danger"><strong>Cancel Reason:</strong> {selectedOrder.cancelReason}</div>}
                        </div>
                        <table className="table table-sm table-bordered">
                            <thead className="table-light"><tr><th>Item</th><th>Qty</th><th>Price</th><th>Subtotal</th><th>Instructions</th></tr></thead>
                            <tbody>
                                {selectedOrder.items?.map((item, i) => (
                                    <tr key={i}>
                                        <td>{item.menuItem?.name}</td>
                                        <td>{item.quantity}</td>
                                        <td>₹{item.price}</td>
                                        <td>₹{(item.price * item.quantity).toFixed(2)}</td>
                                        <td className="text-muted small">{item.specialInstructions || '—'}</td>
                                    </tr>
                                ))}
                            </tbody>
                            <tfoot>
                                {selectedOrder.discount > 0 && <tr><td colSpan={3} className="text-end fw-semibold text-success">Discount</td><td>-₹{selectedOrder.discount}</td><td/></tr>}
                                <tr className="table-light"><td colSpan={3} className="text-end fw-bold">Total</td><td className="fw-bold">₹{selectedOrder.totalPrice?.toFixed(2)}</td><td/></tr>
                            </tfoot>
                        </table>
                    </div>
                )}
            </Modal>

            {/* Cancel Confirmation Modal */}
            <Modal show={!!cancelModal} title="Cancel Order" onClose={() => setCancelModal(null)}>
                <p>Are you sure you want to cancel order <strong>#{cancelModal?._id?.slice(-6)}</strong>?</p>
                <div className="mb-3">
                    <label className="form-label small fw-semibold">Reason <span className="text-danger">*</span></label>
                    <input className="form-control" placeholder="e.g. Customer complaint" value={cancelReason}
                        onChange={e => setCancelReason(e.target.value)} />
                </div>
                <div className="d-flex gap-2 justify-content-end">
                    <button className="btn btn-secondary" onClick={() => setCancelModal(null)}>Go Back</button>
                    <button className="btn btn-danger" onClick={handleCancel} disabled={!cancelReason.trim()}>Confirm Cancel</button>
                </div>
            </Modal>
        </div>
    );
}