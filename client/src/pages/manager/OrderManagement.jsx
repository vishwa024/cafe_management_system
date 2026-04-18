import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { AlertBox, StatusBadge, Modal, LoadingSpinner, EmptyState } from '../../components/shared/StatusBadge';
import { Search, Filter, ChevronLeft, ChevronRight, Eye, X, CheckCircle, AlertCircle } from 'lucide-react';

const STATUSES = ['', 'Pending', 'Preparing', 'Ready', 'Completed', 'Cancelled', 'Rejected Delivery'];

const normalizeStatus = (status = '') => {
    const s = status.toLowerCase().trim();
    if (s === 'placed' || s === 'pending' || s === 'confirmed') return 'Pending';
    if (s === 'preparing' || s === 'in progress' || s === 'in-progress') return 'Preparing';
    if (s === 'ready' || s === 'ready for pickup') return 'Ready';
    if (s === 'completed' || s === 'delivered' || s === 'done') return 'Completed';
    if (s === 'cancelled' || s === 'canceled') return 'Cancelled';
    return status;
};

const normalizePaymentStatus = (order = {}) => {
    const rawStatus = String(order.paymentStatus || 'pending').toLowerCase();
    if (rawStatus !== 'paid') return rawStatus;
    if (order.source === 'staff-pos') return 'paid';
    if (order.paymentId) return 'paid';
    const method = String(order.paymentMethod || '').toLowerCase();
    if (method === 'online' || method === 'wallet') return 'pending';
    return rawStatus;
};

const normalizeOrder = (o) => ({
    ...o,
    status: normalizeStatus(o.status),
    paymentStatus: normalizePaymentStatus(o),
});

const formatCurrency = (value) => `₹${Number(value || 0).toFixed(2)}`;

const getItemUnitPrice = (item = {}) => item.price ?? item.unitPrice ?? 0;

const getItemSubtotal = (item = {}) => {
    if (typeof item.totalPrice === 'number') return item.totalPrice;
    return getItemUnitPrice(item) * (item.quantity || 0);
};

const getOrderPricing = (order = {}) => {
    const itemsSubtotal = Array.isArray(order.items)
        ? order.items.reduce((sum, item) => sum + getItemSubtotal(item), 0)
        : 0;

    const subtotal = typeof order.subtotal === 'number' ? order.subtotal : itemsSubtotal;
    const taxAmount = typeof order.taxAmount === 'number' ? order.taxAmount : 0;
    const deliveryFee = typeof order.deliveryFee === 'number' ? order.deliveryFee : 0;
    const tipAmount = typeof order.tipAmount === 'number' ? order.tipAmount : 0;
    const preOrderFee = typeof order.preOrderFee === 'number' ? order.preOrderFee : 0;
    const discount = typeof order.discount === 'number' ? order.discount : 0;
    const totalAmount = order.totalAmount ?? order.totalPrice ?? order.total ?? (subtotal + taxAmount + deliveryFee + tipAmount + preOrderFee - discount);

    return {
        itemsSubtotal,
        subtotal,
        taxAmount,
        deliveryFee,
        tipAmount,
        preOrderFee,
        discount,
        totalAmount,
    };
};

const getLatestDeliveryRejection = (order = {}) => {
    if (!Array.isArray(order.deliveryRejections) || order.deliveryRejections.length === 0) {
        return null;
    }
    return order.deliveryRejections[order.deliveryRejections.length - 1];
};

export default function OrderManagement() {
    const [orders, setOrders] = useState([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [cancelModal, setCancelModal] = useState(null);
    const [cancelReason, setCancelReason] = useState('');
    const [filters, setFilters] = useState({ status: '', startDate: '', endDate: '', page: 1 });
    const [hoveredRow, setHoveredRow] = useState(null);
    const [paymentLoadingId, setPaymentLoadingId] = useState('');
    const [feedbackMessage, setFeedbackMessage] = useState('');
    const selectedOrderPricing = selectedOrder ? getOrderPricing(selectedOrder) : null;

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (filters.status) params.append('status', filters.status);
            if (filters.startDate) params.append('startDate', filters.startDate);
            if (filters.endDate) params.append('endDate', filters.endDate);
            params.append('page', filters.page);
            params.append('limit', 10);

            const res = await api.get(`/manager/orders?${params}`);
            const rawOrders = res.data?.orders ?? res.data?.data ?? (Array.isArray(res.data) ? res.data : []);
            setOrders(rawOrders.map(normalizeOrder));
            setTotal(res.data?.total ?? res.data?.count ?? rawOrders.length ?? 0);
        } catch (err) {
            console.error('OrderManagement fetch error:', err);
            setOrders([]);
            setTotal(0);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchOrders(); }, [filters]);

    const handleCancel = async () => {
        try {
            await api.patch(`/manager/orders/${cancelModal._id}/cancel`, { reason: cancelReason });
            setCancelModal(null);
            setCancelReason('');
            fetchOrders();
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to cancel order');
        }
    };

    const handleMarkPaid = async (order) => {
        setPaymentLoadingId(order._id);
        try {
            const res = await api.patch(`/manager/orders/${order._id}/mark-paid`);
            const updatedOrder = normalizeOrder(res.data?.order || order);
            setOrders((prev) => prev.map((item) => (item._id === updatedOrder._id ? updatedOrder : item)));
            setSelectedOrder((prev) => (prev?._id === updatedOrder._id ? updatedOrder : prev));
            setFeedbackMessage(`Payment successful for order #${updatedOrder.orderId || updatedOrder._id?.slice(-6)}.`);
            setTimeout(() => setFeedbackMessage(''), 3000);
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to update payment');
        } finally {
            setPaymentLoadingId('');
        }
    };

    const pages = Math.ceil(total / 10);
    const displayOrders = filters.status
        ? orders.filter((o) => (
            filters.status === 'Rejected Delivery'
                ? !!getLatestDeliveryRejection(o)?.reason
                : o.status === filters.status
        ))
        : orders;

    const getStatusColor = (status) => {
        const colors = {
            pending: 'bg-orange-100 text-orange-700',
            preparing: 'bg-purple-100 text-purple-700',
            ready: 'bg-emerald-100 text-emerald-700',
            completed: 'bg-green-100 text-green-700',
            cancelled: 'bg-red-100 text-red-700',
            'rejected delivery': 'bg-amber-100 text-amber-700',
        };
        return colors[status?.toLowerCase()] || 'bg-gray-100 text-gray-600';
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Order Management</h1>
                    <p className="text-sm text-gray-500 mt-1">{total} total orders</p>
                </div>
            </div>

            {feedbackMessage && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-3 flex items-center gap-2">
                    <CheckCircle size={16} className="text-green-600" />
                    <span className="text-sm text-green-700">{feedbackMessage}</span>
                    <button onClick={() => setFeedbackMessage('')} className="ml-auto text-green-600">×</button>
                </div>
            )}

            {/* Filters */}
            <div className="bg-white rounded-xl border border-gray-200 p-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div>
                        <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Status</label>
                        <select
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-amber-400"
                            value={filters.status}
                            onChange={e => setFilters(f => ({ ...f, status: e.target.value, page: 1 }))}
                        >
                            {STATUSES.map(st => <option key={st} value={st}>{st || 'All Statuses'}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">From Date</label>
                        <input
                            type="date"
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-amber-400"
                            value={filters.startDate}
                            onChange={e => setFilters(f => ({ ...f, startDate: e.target.value, page: 1 }))}
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">To Date</label>
                        <input
                            type="date"
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-amber-400"
                            value={filters.endDate}
                            onChange={e => setFilters(f => ({ ...f, endDate: e.target.value, page: 1 }))}
                        />
                    </div>
                    <div className="flex items-end">
                        <button
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition"
                            onClick={() => setFilters({ status: '', startDate: '', endDate: '', page: 1 })}
                        >
                            ✕ Clear Filters
                        </button>
                    </div>
                </div>
            </div>

            {/* Orders Table */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                {loading ? (
                    <LoadingSpinner />
                ) : displayOrders.length === 0 ? (
                    <EmptyState icon="🧾" message="No orders found" />
                ) : (
                    <>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead className="bg-gray-50">
                                    <tr className="text-gray-600">
                                        <th className="px-4 py-3 text-left">Order ID</th>
                                        <th className="px-4 py-3 text-left">Customer</th>
                                        <th className="px-4 py-3 text-left">Type</th>
                                        <th className="px-4 py-3 text-left">Items</th>
                                        <th className="px-4 py-3 text-left">Total</th>
                                        <th className="px-4 py-3 text-left">Status</th>
                                        <th className="px-4 py-3 text-left">Payment</th>
                                        <th className="px-4 py-3 text-left">Date & Time</th>
                                        <th className="px-4 py-3 text-left">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {displayOrders.map(o => (
                                        <tr
                                            key={o._id}
                                            className={`transition-colors ${hoveredRow === o._id ? 'bg-gray-50' : ''}`}
                                            onMouseEnter={() => setHoveredRow(o._id)}
                                            onMouseLeave={() => setHoveredRow(null)}
                                        >
                                            <td className="px-4 py-3 font-mono text-xs text-amber-600">#{o._id?.slice(-6)}</td>
                                            <td className="px-4 py-3">
                                                <div className="font-medium text-gray-900">{o.customer?.name || o.customerName || 'Guest'}</div>
                                                <div className="text-xs text-gray-400">{o.customer?.email}</div>
                                            </td>
                                            <td className="px-4 py-3">
                                                <span className="px-2 py-1 bg-gray-100 rounded-lg text-xs">{o.orderType || '—'}</span>
                                            </td>
                                            <td className="px-4 py-3 text-gray-500">{o.items?.length ?? 0} item(s)</td>
                                            <td className="px-4 py-3 font-semibold">{formatCurrency(o.totalAmount ?? o.totalPrice ?? o.total ?? 0)}</td>
                                            <td className="px-4 py-3">
                                                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(o.status)}`}>
                                                    {o.status}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3">
                                                {o.paymentStatus !== 'paid' && !['Cancelled'].includes(o.status) ? (
                                                    <button
                                                        className="px-2 py-1 bg-green-50 text-green-600 rounded-lg text-xs hover:bg-green-100 transition"
                                                        onClick={() => handleMarkPaid(o)}
                                                        disabled={paymentLoadingId === o._id}
                                                    >
                                                        {paymentLoadingId === o._id ? '...' : 'Mark Paid'}
                                                    </button>
                                                ) : (
                                                    <span className="text-green-600 text-xs">✓ Paid</span>
                                                )}
                                            </td>
                                            <td className="px-4 py-3 text-gray-500 text-xs">{new Date(o.createdAt).toLocaleString()}</td>
                                            <td className="px-4 py-3">
                                                <div className="flex gap-2">
                                                    <button
                                                        className="px-2 py-1 text-amber-600 hover:bg-amber-50 rounded-lg text-xs transition"
                                                        onClick={() => setSelectedOrder(o)}
                                                    >
                                                        View
                                                    </button>
                                                    {!['Completed', 'Cancelled'].includes(o.status) && (
                                                        <button
                                                            className="px-2 py-1 text-red-600 hover:bg-red-50 rounded-lg text-xs transition"
                                                            onClick={() => { setCancelModal(o); setCancelReason(''); }}
                                                        >
                                                            Cancel
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        {pages > 1 && (
                            <div className="px-4 py-3 border-t border-gray-200 bg-gray-50 flex justify-between items-center">
                                <span className="text-sm text-gray-500">Page {filters.page} of {pages}</span>
                                <div className="flex gap-2">
                                    <button
                                        className="px-3 py-1 border border-gray-200 rounded-lg text-sm disabled:opacity-50 hover:bg-gray-100 transition"
                                        disabled={filters.page === 1}
                                        onClick={() => setFilters(f => ({ ...f, page: f.page - 1 }))}
                                    >
                                        ← Prev
                                    </button>
                                    <button
                                        className="px-3 py-1 border border-gray-200 rounded-lg text-sm disabled:opacity-50 hover:bg-gray-100 transition"
                                        disabled={filters.page === pages}
                                        onClick={() => setFilters(f => ({ ...f, page: f.page + 1 }))}
                                    >
                                        Next →
                                    </button>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* Order Detail Modal */}
            {selectedOrder && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={() => setSelectedOrder(null)}>
                    <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
                        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
                            <div>
                                <h2 className="text-xl font-bold text-gray-900">Order Details</h2>
                                <p className="text-sm text-gray-500 font-mono">#{selectedOrder._id?.slice(-6)}</p>
                            </div>
                            <button onClick={() => setSelectedOrder(null)} className="p-1 hover:bg-gray-100 rounded-lg">×</button>
                        </div>
                        <div className="p-6 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div><span className="font-medium text-gray-700">Customer:</span> {selectedOrder.customer?.name || 'Guest'}</div>
                                <div><span className="font-medium text-gray-700">Status:</span> <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(selectedOrder.status)}`}>{selectedOrder.status}</span></div>
                                <div><span className="font-medium text-gray-700">Type:</span> {selectedOrder.orderType}</div>
                                <div><span className="font-medium text-gray-700">Payment:</span> {selectedOrder.paymentStatus === 'paid' ? '✓ Paid' : 'Pending'}</div>
                                {selectedOrder.cancelReason && <div className="col-span-2 text-red-600"><span className="font-medium">Cancel Reason:</span> {selectedOrder.cancelReason}</div>}
                            </div>
                            {getLatestDeliveryRejection(selectedOrder)?.reason && (
                                <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-amber-800">
                                    <p className="font-semibold">Latest delivery rejection</p>
                                    <p className="mt-1 text-sm">{getLatestDeliveryRejection(selectedOrder).reason}</p>
                                </div>
                            )}
                            <div className="border-t border-gray-200 pt-4">
                                <h3 className="font-semibold text-gray-900 mb-3">Order Items</h3>
                                <table className="w-full text-sm">
                                    <thead className="bg-gray-50">
                                        <tr><th className="px-3 py-2 text-left">Item</th><th className="px-3 py-2 text-center">Qty</th><th className="px-3 py-2 text-right">Price</th><th className="px-3 py-2 text-right">Subtotal</th></tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {selectedOrder.items?.map((item, i) => (
                                            <tr key={i}>
                                                <td className="px-3 py-2">{item.menuItem?.name || item.name}</td>
                                                <td className="px-3 py-2 text-center">{item.quantity}</td>
                                                <td className="px-3 py-2 text-right">{formatCurrency(getItemUnitPrice(item))}</td>
                                                <td className="px-3 py-2 text-right font-medium">{formatCurrency(getItemSubtotal(item))}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                    <tfoot className="bg-gray-50 font-bold">
                                        <tr>
                                            <td colSpan="3" className="px-3 py-2 text-right">Items Total</td>
                                            <td className="px-3 py-2 text-right">{formatCurrency(selectedOrderPricing?.itemsSubtotal)}</td>
                                        </tr>
                                        <tr>
                                            <td colSpan="3" className="px-3 py-2 text-right">Order Amount</td>
                                            <td className="px-3 py-2 text-right">{formatCurrency(selectedOrderPricing?.subtotal)}</td>
                                        </tr>
                                        <tr>
                                            <td colSpan="3" className="px-3 py-2 text-right">GST</td>
                                            <td className="px-3 py-2 text-right">{formatCurrency(selectedOrderPricing?.taxAmount)}</td>
                                        </tr>
                                        {(selectedOrderPricing?.deliveryFee ?? 0) > 0 && (
                                            <tr>
                                                <td colSpan="3" className="px-3 py-2 text-right">Delivery Fee</td>
                                                <td className="px-3 py-2 text-right">{formatCurrency(selectedOrderPricing?.deliveryFee)}</td>
                                            </tr>
                                        )}
                                        {(selectedOrderPricing?.preOrderFee ?? 0) > 0 && (
                                            <tr>
                                                <td colSpan="3" className="px-3 py-2 text-right">Pre-order Fee</td>
                                                <td className="px-3 py-2 text-right">{formatCurrency(selectedOrderPricing?.preOrderFee)}</td>
                                            </tr>
                                        )}
                                        {(selectedOrderPricing?.tipAmount ?? 0) > 0 && (
                                            <tr>
                                                <td colSpan="3" className="px-3 py-2 text-right">Tip</td>
                                                <td className="px-3 py-2 text-right">{formatCurrency(selectedOrderPricing?.tipAmount)}</td>
                                            </tr>
                                        )}
                                        {(selectedOrderPricing?.discount ?? 0) > 0 && (
                                            <tr>
                                                <td colSpan="3" className="px-3 py-2 text-right">Discount</td>
                                                <td className="px-3 py-2 text-right text-green-700">- {formatCurrency(selectedOrderPricing?.discount)}</td>
                                            </tr>
                                        )}
                                        <tr>
                                            <td colSpan="3" className="px-3 py-2 text-right">Total</td>
                                            <td className="px-3 py-2 text-right">{formatCurrency(selectedOrderPricing?.totalAmount)}</td>
                                        </tr>
                                    </tfoot>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Cancel Modal */}
            {cancelModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={() => setCancelModal(null)}>
                    <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full" onClick={e => e.stopPropagation()}>
                        <div className="px-6 py-4 border-b border-gray-200">
                            <h2 className="text-xl font-bold text-gray-900">Cancel Order</h2>
                        </div>
                        <div className="p-6">
                            <p className="text-gray-700 mb-4">Are you sure you want to cancel order <span className="font-mono font-semibold">#{cancelModal._id?.slice(-6)}</span>?</p>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Reason <span className="text-red-500">*</span></label>
                                <input
                                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-amber-400"
                                    placeholder="e.g. Customer complaint"
                                    value={cancelReason}
                                    onChange={e => setCancelReason(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="px-6 py-4 border-t border-gray-200 flex justify-end gap-3">
                            <button className="px-4 py-2 border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50" onClick={() => setCancelModal(null)}>Go Back</button>
                            <button className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50" onClick={handleCancel} disabled={!cancelReason.trim()}>Confirm Cancel</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
