import React, { useEffect, useMemo, useState } from 'react';
import api from '../../services/api';
import toast from 'react-hot-toast';
import {
    AlertTriangle,
    CheckCircle,
    Mail,
    Package,
    Phone,
    Plus,
    RefreshCw,
    Trash2,
    Truck,
    X,
    Edit2,
    QrCode,
    DollarSign,
    History,
} from 'lucide-react';
import { EmptyState, LoadingSpinner } from '../../components/shared/StatusBadge';

const EMPTY_SUPPLIER = {
    name: '',
    contactName: '',
    phone: '',
    email: '',
    accountName: '',
    upiId: '',
    qrCodeUrl: '',
    ingredients: '',
};

const DELIVERY_ADDRESS =
    'Roller Coaster Cafe, Under Nutan School, Juna Road, Opposite Navjeevan Hospital, Bareja, Ahmedabad, Gujarat 382425';

const formatCurrency = (value) => `Rs. ${Number(value || 0).toFixed(2)}`;

const getStatusClasses = (status) => {
    switch (status) {
        case 'accepted':  return 'bg-blue-100 text-blue-700';
        case 'delivered': return 'bg-green-100 text-green-700';
        case 'rejected':  return 'bg-red-100 text-red-700';
        case 'processing':
        case 'shipped':   return 'bg-purple-100 text-purple-700';
        default:          return 'bg-amber-100 text-amber-700';
    }
};

const HISTORY_TABS = ['all', 'pending', 'accepted', 'delivered', 'rejected'];

export default function SupplierManagementPage() {
    const [suppliers, setSuppliers] = useState([]);
    const [orders, setOrders] = useState([]);
    const [lowStockItems, setLowStockItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    // Supplier modal
    const [showSupplierModal, setShowSupplierModal] = useState(false);
    const [editingSupplier, setEditingSupplier] = useState(null);
    const [supplierForm, setSupplierForm] = useState(EMPTY_SUPPLIER);
    const [savingSupplier, setSavingSupplier] = useState(false);
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [deleting, setDeleting] = useState(false);

    // Supplier-specific orders modal
    const [selectedOrderSupplier, setSelectedOrderSupplier] = useState(null);

    // Low-stock draft
    const [orderDraftSupplierId, setOrderDraftSupplierId] = useState('');
    const [orderDrafts, setOrderDrafts] = useState({});
    const [creatingOrder, setCreatingOrder] = useState(false);
    const [orderDraftPaymentMethod, setOrderDraftPaymentMethod] = useState('cod');

    // Order actions
    const [deliveringOrderId, setDeliveringOrderId] = useState('');
    const [paymentDrafts, setPaymentDrafts] = useState({});
    const [savingPaymentId, setSavingPaymentId] = useState('');

    // QR modal
    const [showQrModal, setShowQrModal] = useState(false);
    const [qrOrder, setQrOrder] = useState(null);

    // Price editor
    const [editingPricesForOrder, setEditingPricesForOrder] = useState(null);
    const [priceEdits, setPriceEdits] = useState({});
    const [savingPrices, setSavingPrices] = useState(false);

    // Delete order
    const [deleteOrderTarget, setDeleteOrderTarget] = useState(null);
    const [deletingOrder, setDeletingOrder] = useState(false);

    // History modal
    const [showHistoryModal, setShowHistoryModal] = useState(false);
    const [historyTab, setHistoryTab] = useState('all');
    const [historySearch, setHistorySearch] = useState('');

    // ── data fetching ──────────────────────────────────────────────
    const refreshData = async (isInitial = false) => {
        if (isInitial) setLoading(true);
        else setRefreshing(true);
        try {
            const [suppliersRes, ordersRes, lowStockRes] = await Promise.allSettled([
                api.get('/manager/suppliers'),
                api.get('/manager/supplier-orders'),
                api.get('/inventory/low-stock'),
            ]);

            const supplierList =
                suppliersRes.status === 'fulfilled' && Array.isArray(suppliersRes.value.data)
                    ? suppliersRes.value.data : [];
            const orderList =
                ordersRes.status === 'fulfilled' && Array.isArray(ordersRes.value.data)
                    ? ordersRes.value.data : [];
            const lowStockList =
                lowStockRes.status === 'fulfilled' && Array.isArray(lowStockRes.value.data)
                    ? lowStockRes.value.data : [];

            setSuppliers(supplierList);
            setOrders(orderList);
            setLowStockItems(lowStockList);

            setSelectedOrderSupplier((cur) => {
                if (!cur) return null;
                return supplierList.find((s) => s._id === cur._id) || cur;
            });

            setOrderDrafts((cur) => {
                const next = { ...cur };
                lowStockList.forEach((item) => {
                    if (!next[item._id]) {
                        const qty = Math.max(1, Math.ceil(Number(item.reorderLevel || 0) * 2 - Number(item.currentStock || 0)));
                        next[item._id] = { quantity: String(qty) };
                    }
                });
                return lowStockList.length > 0 ? next : {};
            });

            setPaymentDrafts((cur) => {
                const next = { ...cur };
                orderList.forEach((order) => {
                    next[order._id] = {
                        paymentMethod:    order.paymentMethod    || next[order._id]?.paymentMethod    || 'cod',
                        paymentStatus:    order.paymentStatus    || next[order._id]?.paymentStatus    || 'unpaid',
                        paymentReference: order.paymentReference || next[order._id]?.paymentReference || '',
                        paymentNotes:     order.paymentNotes     || next[order._id]?.paymentNotes     || '',
                    };
                });
                return next;
            });

            if (suppliersRes.status === 'rejected')
                toast.error(suppliersRes.reason?.response?.data?.message || 'Failed to load suppliers');
            if (ordersRes.status === 'rejected')
                toast.error(ordersRes.reason?.response?.data?.message || 'Failed to load supplier orders');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to load supplier workflow data');
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        refreshData(true);
        const id = setInterval(() => refreshData(false), 30000);
        return () => clearInterval(id);
    }, []);

    // ── computed ───────────────────────────────────────────────────
    const supplierOrderMap = useMemo(() => {
        const map = new Map();
        suppliers.forEach((s) => {
            map.set(s._id, orders.filter((o) => o.supplier?._id === s._id));
        });
        return map;
    }, [suppliers, orders]);

    const historyOrders = useMemo(() => {
        let list = [...orders].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        if (historyTab !== 'all') list = list.filter((o) => o.status === historyTab);
        if (historySearch.trim()) {
            const q = historySearch.trim().toLowerCase();
            list = list.filter(
                (o) =>
                    o.orderNumber?.toLowerCase().includes(q) ||
                    o.supplier?.name?.toLowerCase().includes(q) ||
                    o.items?.some((i) => i.itemName?.toLowerCase().includes(q))
            );
        }
        return list;
    }, [orders, historyTab, historySearch]);

    // ── supplier CRUD ──────────────────────────────────────────────
    const openCreateSupplier = () => {
        setEditingSupplier(null);
        setSupplierForm(EMPTY_SUPPLIER);
        setShowSupplierModal(true);
    };

    const openEditSupplier = (supplier) => {
        setEditingSupplier(supplier);
        setSupplierForm({
            name:        supplier.name        || '',
            contactName: supplier.contactName || '',
            phone:       supplier.phone       || '',
            email:       supplier.email       || '',
            accountName: supplier.accountName || '',
            upiId:       supplier.upiId       || '',
            qrCodeUrl:   supplier.qrCodeUrl   || '',
            ingredients: (supplier.ingredients || []).join(', '),
        });
        setShowSupplierModal(true);
    };

    const saveSupplier = async (event) => {
        event.preventDefault();
        if (!supplierForm.name.trim()) { toast.error('Supplier name is required'); return; }
        setSavingSupplier(true);
        try {
            const payload = {
                name:        supplierForm.name.trim(),
                contactName: supplierForm.contactName.trim(),
                phone:       supplierForm.phone.trim(),
                email:       supplierForm.email.trim(),
                accountName: supplierForm.accountName.trim(),
                upiId:       supplierForm.upiId.trim(),
                qrCodeUrl:   supplierForm.qrCodeUrl.trim(),
                ingredients: supplierForm.ingredients.split(',').map((e) => e.trim()).filter(Boolean),
            };
            if (editingSupplier) {
                await api.put(`/manager/suppliers/${editingSupplier._id}`, payload);
                toast.success('Supplier updated successfully');
            } else {
                await api.post('/manager/suppliers', payload);
                toast.success('Supplier added successfully');
            }
            setShowSupplierModal(false);
            setSupplierForm(EMPTY_SUPPLIER);
            await refreshData(false);
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to save supplier');
        } finally {
            setSavingSupplier(false);
        }
    };

    const deleteSupplier = async () => {
        if (!deleteTarget) return;
        setDeleting(true);
        try {
            await api.delete(`/manager/suppliers/${deleteTarget._id}`);
            toast.success('Supplier deleted successfully');
            setDeleteTarget(null);
            await refreshData(false);
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to delete supplier');
        } finally {
            setDeleting(false);
        }
    };

    // ── order draft helpers ────────────────────────────────────────
    const updateDraft = (itemId, key, value) =>
        setOrderDrafts((c) => ({ ...c, [itemId]: { ...(c[itemId] || { quantity: '1' }), [key]: value } }));

    const updatePaymentDraft = (orderId, key, value) =>
        setPaymentDrafts((c) => ({
            ...c,
            [orderId]: {
                paymentMethod:    c[orderId]?.paymentMethod    || 'cod',
                paymentStatus:    c[orderId]?.paymentStatus    || 'unpaid',
                paymentReference: c[orderId]?.paymentReference || '',
                paymentNotes:     c[orderId]?.paymentNotes     || '',
                ...c[orderId],
                [key]: value,
            },
        }));

    // ── order actions ──────────────────────────────────────────────
    const createPurchaseOrder = async () => {
        if (!orderDraftSupplierId) { toast.error('Select a supplier first'); return; }
        const items = lowStockItems
            .map((item) => {
                const qty = Number(orderDrafts[item._id]?.quantity || 0);
                return qty > 0 ? { inventoryItemId: item._id, quantity: qty } : null;
            })
            .filter(Boolean);
        if (items.length === 0) { toast.error('At least one low-stock item must be included'); return; }
        setCreatingOrder(true);
        try {
            await api.post('/manager/supplier-orders/create-from-low-stock', {
                supplierId: orderDraftSupplierId,
                items,
                deliveryAddress: DELIVERY_ADDRESS,
                notes: 'Urgent low-stock purchase order created from Supplier Management',
                paymentMethod: orderDraftPaymentMethod,
            });
            toast.success('Purchase order created and email sent to supplier');
            setOrderDraftSupplierId('');
            setOrderDraftPaymentMethod('cod');
            const reset = {};
            lowStockItems.forEach((item) => {
                const qty = Math.max(1, Math.ceil(Number(item.reorderLevel || 0) * 2 - Number(item.currentStock || 0)));
                reset[item._id] = { quantity: String(qty) };
            });
            setOrderDrafts(reset);
            await refreshData(false);
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to create purchase order');
        } finally {
            setCreatingOrder(false);
        }
    };

    const confirmDelivery = async (orderId) => {
        setDeliveringOrderId(orderId);
        try {
            const response = await api.patch(`/manager/supplier-orders/${orderId}/deliver`);
            toast.success('Delivery confirmed and inventory stock updated');
            const order = orders.find((o) => o._id === orderId);
            if (order && response.data?.qrCode) {
                setQrOrder({ ...order, qrCode: response.data.qrCode });
                setShowQrModal(true);
            }
            await refreshData(false);
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to confirm delivery');
        } finally {
            setDeliveringOrderId('');
        }
    };

    const savePaymentDetails = async (orderId) => {
        const draft = paymentDrafts[orderId];
        if (!draft) return;
        setSavingPaymentId(orderId);
        try {
            await api.patch(`/manager/supplier-orders/${orderId}/payment`, draft);
            toast.success('Payment details updated successfully');
            await refreshData(false);
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to update payment details');
        } finally {
            setSavingPaymentId('');
        }
    };

    const openPriceEditor = (order) => {
        const init = {};
        order.items.forEach((item) => {
            const existing = item.price || item.supplierPrice || '';
            init[item.inventoryItemId || item.itemName] = existing !== '' ? String(existing) : '';
        });
        setPriceEdits(init);
        setEditingPricesForOrder(order);
    };

    const savePriceEdits = async () => {
        if (!editingPricesForOrder) return;
        setSavingPrices(true);
        try {
            const numeric = {};
            Object.entries(priceEdits).forEach(([k, v]) => {
                if (v !== '' && !isNaN(Number(v))) numeric[k] = Number(v);
            });
            await api.patch(`/manager/supplier-orders/${editingPricesForOrder._id}/update-prices`, { itemPrices: numeric });
            toast.success('Prices updated successfully');
            setEditingPricesForOrder(null);
            setPriceEdits({});
            await refreshData(false);
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to update prices');
        } finally {
            setSavingPrices(false);
        }
    };

    const deleteOrder = async () => {
        if (!deleteOrderTarget) return;
        setDeletingOrder(true);
        try {
            await api.delete(`/manager/supplier-orders/${deleteOrderTarget._id}`);
            toast.success('Order deleted successfully');
            setDeleteOrderTarget(null);
            await refreshData(false);
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to delete order');
        } finally {
            setDeletingOrder(false);
        }
    };

    // ── helpers ────────────────────────────────────────────────────
    const getItemUnitPrice = (item) => {
        const raw = item.price ?? item.supplierPrice ?? null;
        if (raw === null || raw === '') return null;
        const n = Number(raw);
        return isNaN(n) ? null : n;
    };

    const calculateOrderTotal = (order) =>
        (order.items || []).reduce((sum, item) => sum + (getItemUnitPrice(item) ?? 0) * Number(item.quantity || 0), 0);

    // ── derived counts ─────────────────────────────────────────────
    const selectedSupplierOrders = selectedOrderSupplier
        ? (supplierOrderMap.get(selectedOrderSupplier._id) || [])
        : [];
    const selectedDraftSupplier = suppliers.find((s) => s._id === orderDraftSupplierId) || null;
    const pendingCount   = orders.filter((o) => o.status === 'pending').length;
    const acceptedCount  = orders.filter((o) => o.status === 'accepted').length;
    const deliveredCount = orders.filter((o) => o.status === 'delivered').length;

    if (loading) return <LoadingSpinner />;

    // ── shared order card ──────────────────────────────────────────
    const renderOrderCard = (order) => {
        const currentPaymentMethod = paymentDrafts[order._id]?.paymentMethod || order.paymentMethod || 'cod';
        const currentPaymentStatus = paymentDrafts[order._id]?.paymentStatus || order.paymentStatus || 'unpaid';
        const isPaid          = currentPaymentStatus === 'paid';
        const isOnlinePayment = currentPaymentMethod === 'online';
        const hasQrCode       = order.supplier?.qrCodeUrl?.trim() !== '' && !!order.supplier?.qrCodeUrl;
        const orderTotal      = calculateOrderTotal(order);
        const hasPrices       = (order.items || []).some((item) => getItemUnitPrice(item) !== null);

        return (
            <div key={order._id} className="rounded-xl border border-gray-200 p-4">

                {/* ── top row ── */}
                <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                    <div className="flex-1">
                        {/* badges */}
                        <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-mono font-bold text-amber-600">{order.orderNumber}</span>
                            <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${getStatusClasses(order.status)}`}>
                                {order.status}
                            </span>
                            {hasPrices && order.status !== 'pending' && (
                                <span className="rounded-full bg-green-100 px-2.5 py-1 text-xs font-semibold text-green-700">
                                    Prices Added
                                </span>
                            )}
                            {isPaid && (
                                <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-700 flex items-center gap-1">
                                    <CheckCircle size={11} /> Paid
                                </span>
                            )}
                        </div>

                        {/* supplier name (shown in history modal) */}
                        {order.supplier?.name && (
                            <p className="mt-1 text-xs font-medium text-gray-400">{order.supplier.name}</p>
                        )}

                        <p className="mt-1 text-sm text-gray-500">Created {new Date(order.createdAt).toLocaleString()}</p>
                        {order.acceptedAt  && <p className="text-sm text-blue-600">Supplier accepted: {new Date(order.acceptedAt).toLocaleString()}</p>}
                        {order.deliveredAt && <p className="text-sm text-green-600">Delivered: {new Date(order.deliveredAt).toLocaleString()}</p>}
                        {order.rejectionReason && <p className="text-sm text-red-600">Rejection: {order.rejectionReason}</p>}

                        <p className="text-sm text-gray-600 mt-1">
                            Payment: <span className="font-semibold uppercase">{currentPaymentMethod}</span>
                            {' • '}
                            <span className={`font-semibold ${isPaid ? 'text-green-600' : 'text-amber-600'}`}>
                                {currentPaymentStatus}
                            </span>
                        </p>
                        {order.paidAt && <p className="text-xs text-green-600">Paid at: {new Date(order.paidAt).toLocaleString()}</p>}
                        {isPaid && order.paymentReference && (
                            <p className="text-xs text-gray-400">Ref: {order.paymentReference}</p>
                        )}
                        {orderTotal > 0 && (
                            <p className="text-sm font-semibold text-gray-900 mt-1">Order Total: {formatCurrency(orderTotal)}</p>
                        )}
                    </div>

                    {/* action buttons */}
                    <div className="space-y-2 min-w-[148px]">
                        {['accepted', 'processing', 'shipped'].includes(order.status) && (
                            <button
                                onClick={() => confirmDelivery(order._id)}
                                disabled={deliveringOrderId === order._id}
                                className="w-full rounded-lg bg-green-500 px-4 py-2 text-sm font-semibold text-white hover:bg-green-600 disabled:opacity-60"
                            >
                                {deliveringOrderId === order._id ? 'Updating...' : 'Confirm Delivery'}
                            </button>
                        )}
                        {order.status !== 'pending' && order.status !== 'delivered' && order.status !== 'rejected' && (
                            <button
                                onClick={() => openPriceEditor(order)}
                                className="w-full rounded-lg bg-blue-500 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-600 flex items-center justify-center gap-2"
                            >
                                <DollarSign size={14} /> Edit Prices
                            </button>
                        )}
                        {(order.status === 'delivered' || order.status === 'rejected') && (
                            <button
                                onClick={() => setDeleteOrderTarget(order)}
                                className="w-full rounded-lg bg-red-500 px-4 py-2 text-sm font-semibold text-white hover:bg-red-600 flex items-center justify-center gap-2"
                            >
                                <Trash2 size={14} /> Delete Order
                            </button>
                        )}
                    </div>
                </div>

                {/* ── items ── */}
                <div className="mt-4">
                    <p className="text-sm font-semibold text-gray-700 mb-2">Items Ordered:</p>
                    <div className="grid gap-2 md:grid-cols-2">
                        {(order.items || []).map((item) => {
                            const unitPrice = getItemUnitPrice(item);
                            const lineTotal = unitPrice !== null ? unitPrice * Number(item.quantity || 0) : null;
                            return (
                                <div key={`${order._id}-${item.inventoryItem?._id || item.itemName}`} className="rounded-lg bg-gray-50 px-3 py-2 text-sm">
                                    <div className="font-medium text-gray-900">{item.itemName}</div>
                                    <div className="text-gray-500">{item.quantity} {item.unit}</div>
                                    {unitPrice !== null && lineTotal !== null ? (
                                        <div className="text-green-600 text-xs mt-1">
                                            @ ₹{unitPrice.toFixed(2)}/{item.unit} = ₹{lineTotal.toFixed(2)}
                                        </div>
                                    ) : order.status !== 'pending' ? (
                                        <div className="text-amber-600 text-xs mt-1">Price not set by supplier</div>
                                    ) : null}
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* ── payment form — HIDDEN when paid ── */}
                {order.status !== 'rejected' && !isPaid && (
                    <div className="mt-4 rounded-xl border border-gray-200 bg-gray-50 p-4">
                        <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-3">Payment Details</p>
                        <div className="grid gap-3 md:grid-cols-2">
                            <div>
                                <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-gray-500">Payment Method</label>
                                <select
                                    value={currentPaymentMethod}
                                    onChange={(e) => updatePaymentDraft(order._id, 'paymentMethod', e.target.value)}
                                    className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:border-amber-400 focus:outline-none"
                                >
                                    <option value="cod">COD</option>
                                    <option value="online">Online Payment</option>
                                </select>
                            </div>
                            <div>
                                <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-gray-500">Payment Status</label>
                                <select
                                    value={currentPaymentStatus}
                                    onChange={(e) => updatePaymentDraft(order._id, 'paymentStatus', e.target.value)}
                                    className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:border-amber-400 focus:outline-none"
                                >
                                    <option value="unpaid">Unpaid</option>
                                    <option value="paid">Paid</option>
                                </select>
                            </div>
                        </div>

                        {isOnlinePayment && (
                            <div className="mt-3">
                                <input
                                    type="text"
                                    value={paymentDrafts[order._id]?.paymentReference || ''}
                                    onChange={(e) => updatePaymentDraft(order._id, 'paymentReference', e.target.value)}
                                    placeholder="Payment reference / transaction ID"
                                    className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:border-amber-400 focus:outline-none"
                                />
                            </div>
                        )}

                        <div className="mt-3">
                            <input
                                type="text"
                                value={paymentDrafts[order._id]?.paymentNotes || ''}
                                onChange={(e) => updatePaymentDraft(order._id, 'paymentNotes', e.target.value)}
                                placeholder="Payment notes (optional)"
                                className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:border-amber-400 focus:outline-none"
                            />
                        </div>

                        {isOnlinePayment && order.supplier && hasQrCode && (
                            <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 p-4">
                                <p className="text-sm font-semibold text-emerald-900">Supplier online payment</p>
                                <p className="mt-1 text-sm text-emerald-800">{order.supplier.accountName || order.supplier.name}</p>
                                <p className="text-xs text-emerald-700">{order.supplier.upiId || 'UPI ID not added yet'}</p>
                                <img
                                    src={order.supplier.qrCodeUrl}
                                    alt={`${order.supplier.name} QR`}
                                    className="mt-3 h-44 w-44 rounded-xl border border-emerald-200 bg-white object-contain p-2"
                                />
                                <p className="mt-2 text-xs text-emerald-700">Scan QR to pay, then mark as paid.</p>
                            </div>
                        )}

                        {isOnlinePayment && order.supplier && !hasQrCode && (
                            <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-4">
                                <p className="text-sm font-semibold text-amber-900">QR Code Not Available</p>
                                <p className="mt-1 text-sm text-amber-800">Add a QR code URL in supplier details to enable online payments.</p>
                            </div>
                        )}

                        <div className="mt-4 flex justify-end">
                            <button
                                onClick={() => savePaymentDetails(order._id)}
                                disabled={savingPaymentId === order._id}
                                className="rounded-lg bg-amber-500 px-4 py-2 text-sm font-semibold text-white hover:bg-amber-600 disabled:opacity-60"
                            >
                                {savingPaymentId === order._id ? 'Saving...' : 'Save Payment'}
                            </button>
                        </div>
                    </div>
                )}

                {/* ── paid summary banner (replaces form when paid) ── */}
                {order.status !== 'rejected' && isPaid && (
                    <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 flex items-start gap-3">
                        <CheckCircle size={20} className="text-emerald-600 mt-0.5 shrink-0" />
                        <div>
                            <p className="text-sm font-semibold text-emerald-800">Payment Completed</p>
                            <p className="text-xs text-emerald-600 mt-0.5">
                                Method: <span className="font-semibold uppercase">{currentPaymentMethod}</span>
                                {order.paymentReference ? ` • Ref: ${order.paymentReference}` : ''}
                                {order.paidAt ? ` • ${new Date(order.paidAt).toLocaleString()}` : ''}
                            </p>
                            {order.paymentNotes && (
                                <p className="text-xs text-emerald-600 mt-0.5">Note: {order.paymentNotes}</p>
                            )}
                        </div>
                    </div>
                )}
            </div>
        );
    };

    // ═══════════════════════════════════════════════════════════════
    //  RENDER
    // ═══════════════════════════════════════════════════════════════
    return (
        <div className="space-y-6">

            {/* ── page header ── */}
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Supplier Management</h1>
                    <p className="mt-1 text-sm text-gray-500">Create purchase orders, track supplier responses, and confirm delivery.</p>
                </div>
                <div className="flex gap-2 flex-wrap">
                    <button
                        onClick={() => refreshData(false)}
                        disabled={refreshing}
                        className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-60"
                    >
                        <RefreshCw size={15} className={refreshing ? 'animate-spin' : ''} />
                        Refresh
                    </button>
                    {/* Order History button */}
                    <button
                        onClick={() => { setShowHistoryModal(true); setHistoryTab('all'); setHistorySearch(''); }}
                        className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
                    >
                        <History size={15} />
                        Order History
                        <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-bold text-gray-600">{orders.length}</span>
                    </button>
                    <button
                        onClick={openCreateSupplier}
                        className="inline-flex items-center gap-2 rounded-lg bg-amber-500 px-4 py-2 text-sm font-semibold text-white hover:bg-amber-600"
                    >
                        <Plus size={15} />
                        Add Supplier
                    </button>
                </div>
            </div>

            {/* ── stat cards ── */}
            <div className="grid gap-4 md:grid-cols-4">
                <div className="rounded-xl border border-gray-200 bg-white p-4">
                    <p className="text-xs uppercase tracking-wide text-gray-500">Suppliers</p>
                    <p className="mt-2 text-2xl font-bold text-gray-900">{suppliers.length}</p>
                </div>
                <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
                    <p className="text-xs uppercase tracking-wide text-amber-700">Pending Orders</p>
                    <p className="mt-2 text-2xl font-bold text-amber-800">{pendingCount}</p>
                </div>
                <div className="rounded-xl border border-blue-200 bg-blue-50 p-4">
                    <p className="text-xs uppercase tracking-wide text-blue-700">Accepted Orders</p>
                    <p className="mt-2 text-2xl font-bold text-blue-800">{acceptedCount}</p>
                </div>
                <div className="rounded-xl border border-green-200 bg-green-50 p-4">
                    <p className="text-xs uppercase tracking-wide text-green-700">Delivered Orders</p>
                    <p className="mt-2 text-2xl font-bold text-green-800">{deliveredCount}</p>
                </div>
            </div>

            {/* ── low-stock → purchase order ── */}
            <section className="rounded-2xl border border-gray-200 bg-white">
                <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
                    <div>
                        <h2 className="text-lg font-semibold text-gray-900">Low Stock to Purchase Order</h2>
                        <p className="text-sm text-gray-500">Kitchen low-stock items flow into manager ordering here.</p>
                    </div>
                    <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-700">
                        {lowStockItems.length} low stock
                    </span>
                </div>

                {lowStockItems.length === 0 ? (
                    <div className="px-5 py-10 text-center">
                        <CheckCircle size={42} className="mx-auto text-green-500" />
                        <p className="mt-3 font-semibold text-gray-900">No low-stock items right now</p>
                        <p className="text-sm text-gray-500">When kitchen inventory drops below reorder level, it will appear here.</p>
                    </div>
                ) : (
                    <div className="space-y-4 p-5">
                        <div className="grid gap-4 lg:grid-cols-[2fr,1fr]">
                            <div className="overflow-x-auto rounded-xl border border-gray-200">
                                <table className="w-full text-sm">
                                    <thead className="bg-gray-50 text-gray-600">
                                        <tr>
                                            <th className="px-4 py-3 text-left">Item</th>
                                            <th className="px-4 py-3 text-left">Current</th>
                                            <th className="px-4 py-3 text-left">Reorder</th>
                                            <th className="px-4 py-3 text-left">Order Qty</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {lowStockItems.map((item) => (
                                            <tr key={item._id}>
                                                <td className="px-4 py-3">
                                                    <div className="font-medium text-gray-900">{item.name}</div>
                                                    <div className="text-xs text-gray-400">{item.unit}</div>
                                                </td>
                                                <td className="px-4 py-3 font-semibold text-red-600">{item.currentStock}</td>
                                                <td className="px-4 py-3 text-gray-600">{item.reorderLevel}</td>
                                                <td className="px-4 py-3">
                                                    <input
                                                        type="number"
                                                        min="1"
                                                        value={orderDrafts[item._id]?.quantity ?? 1}
                                                        onChange={(e) => updateDraft(item._id, 'quantity', e.target.value)}
                                                        className="w-24 rounded-lg border border-gray-200 px-3 py-2 focus:border-amber-400 focus:outline-none"
                                                    />
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
                                <div className="flex items-start gap-3">
                                    <AlertTriangle size={18} className="mt-0.5 text-amber-600" />
                                    <div>
                                        <p className="font-semibold text-amber-900">Create Manager Purchase Order</p>
                                        <p className="mt-1 text-sm text-amber-800">Choose the supplier who should receive the low-stock delivery request by email.</p>
                                    </div>
                                </div>
                                <div className="mt-4 space-y-3">
                                    <select
                                        value={orderDraftSupplierId}
                                        onChange={(e) => setOrderDraftSupplierId(e.target.value)}
                                        className="w-full rounded-lg border border-amber-200 bg-white px-3 py-2 text-sm focus:border-amber-400 focus:outline-none"
                                    >
                                        <option value="">Select supplier</option>
                                        {suppliers.map((s) => (
                                            <option key={s._id} value={s._id}>
                                                {s.name}{s.email ? ` - ${s.email}` : ''}
                                            </option>
                                        ))}
                                    </select>

                                    <div className="rounded-lg border border-amber-200 bg-white p-3">
                                        <p className="text-xs font-semibold uppercase tracking-wide text-amber-700">Payment Option</p>
                                        <div className="mt-3 grid grid-cols-2 gap-2">
                                            {['cod', 'online'].map((m) => (
                                                <button
                                                    key={m}
                                                    type="button"
                                                    onClick={() => setOrderDraftPaymentMethod(m)}
                                                    className={`rounded-lg border px-3 py-2 text-sm font-semibold ${orderDraftPaymentMethod === m ? 'border-amber-500 bg-amber-100 text-amber-900' : 'border-gray-200 text-gray-600'}`}
                                                >
                                                    {m.toUpperCase()}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {orderDraftPaymentMethod === 'online' && selectedDraftSupplier?.qrCodeUrl && (
                                        <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-3">
                                            <p className="text-sm font-semibold text-emerald-900">Supplier QR for online payment</p>
                                            <p className="text-xs text-emerald-700">{selectedDraftSupplier.accountName || selectedDraftSupplier.name}</p>
                                            <p className="text-xs text-emerald-700">{selectedDraftSupplier.upiId || 'UPI ID not added yet'}</p>
                                            <img src={selectedDraftSupplier.qrCodeUrl} alt="QR" className="mt-3 h-36 w-36 rounded-xl border border-emerald-200 bg-white object-contain p-2" />
                                        </div>
                                    )}

                                    <button
                                        onClick={createPurchaseOrder}
                                        disabled={creatingOrder || !orderDraftSupplierId}
                                        className="w-full rounded-lg bg-amber-500 px-4 py-2 text-sm font-semibold text-white hover:bg-amber-600 disabled:opacity-60"
                                    >
                                        {creatingOrder ? 'Sending Order...' : 'Send Purchase Order Email'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </section>

            {/* ── supplier grid ── */}
            <section className="space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-gray-900">Suppliers</h2>
                    <p className="text-sm text-gray-500">Click the package icon to view a supplier's orders.</p>
                </div>
                {suppliers.length === 0 ? (
                    <EmptyState icon="🚚" message="No suppliers added yet." />
                ) : (
                    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                        {suppliers.map((supplier) => {
                            const sOrds    = supplierOrderMap.get(supplier._id) || [];
                            const sPend    = sOrds.filter((o) => o.status === 'pending').length;
                            const sAcc     = sOrds.filter((o) => o.status === 'accepted').length;
                            const sDel     = sOrds.filter((o) => o.status === 'delivered').length;
                            return (
                                <div key={supplier._id} className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="rounded-xl bg-amber-100 p-2 text-amber-700"><Truck size={18} /></div>
                                            <div>
                                                <h3 className="font-semibold text-gray-900">{supplier.name}</h3>
                                                <p className="text-xs text-gray-500">{supplier.contactName || 'No contact name'}</p>
                                            </div>
                                        </div>
                                        <div className="flex gap-1">
                                            <button onClick={() => setSelectedOrderSupplier(supplier)} className="rounded-lg p-2 text-green-600 hover:bg-green-50" title="View orders"><Package size={15} /></button>
                                            <button onClick={() => openEditSupplier(supplier)} className="rounded-lg p-2 text-blue-600 hover:bg-blue-50" title="Edit"><Edit2 size={15} /></button>
                                            <button onClick={() => setDeleteTarget(supplier)} className="rounded-lg p-2 text-red-600 hover:bg-red-50" title="Delete"><Trash2 size={15} /></button>
                                        </div>
                                    </div>
                                    <div className="mt-4 space-y-2 text-sm text-gray-600">
                                        <div className="flex items-center gap-2"><Phone size={14} className="text-gray-400" /><span>{supplier.phone || 'No phone'}</span></div>
                                        <div className="flex items-center gap-2"><Mail size={14} className="text-gray-400" /><span>{supplier.email || 'No email'}</span></div>
                                        {supplier.upiId && (
                                            <div className="rounded-lg bg-emerald-50 px-3 py-2 text-xs text-emerald-700">Payment UPI: {supplier.upiId}</div>
                                        )}
                                    </div>
                                    <div className="mt-4 grid grid-cols-3 gap-2 text-center text-xs">
                                        <div className="rounded-lg bg-amber-50 px-2 py-3 text-amber-700"><div className="font-bold">{sPend}</div><div>Pending</div></div>
                                        <div className="rounded-lg bg-blue-50 px-2 py-3 text-blue-700"><div className="font-bold">{sAcc}</div><div>Accepted</div></div>
                                        <div className="rounded-lg bg-green-50 px-2 py-3 text-green-700"><div className="font-bold">{sDel}</div><div>Delivered</div></div>
                                    </div>
                                    {supplier.ingredients?.length > 0 && (
                                        <div className="mt-4 flex flex-wrap gap-2">
                                            {supplier.ingredients.map((ing) => (
                                                <span key={ing} className="rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-600">{ing}</span>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}
            </section>

            {/* ══════════ MODAL: Add / Edit Supplier ══════════ */}
            {showSupplierModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setShowSupplierModal(false)}>
                    <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-between border-b border-gray-100 p-5">
                            <h2 className="text-xl font-bold text-gray-900">{editingSupplier ? 'Edit Supplier' : 'Add Supplier'}</h2>
                            <button onClick={() => setShowSupplierModal(false)} className="rounded-lg p-2 text-gray-500 hover:bg-gray-100"><X size={18} /></button>
                        </div>
                        <form onSubmit={saveSupplier} className="space-y-4 p-5">
                            <input type="text" value={supplierForm.name} onChange={(e) => setSupplierForm((c) => ({ ...c, name: e.target.value }))} placeholder="Supplier name" className="w-full rounded-lg border border-gray-200 px-3 py-2 focus:border-amber-400 focus:outline-none" required />
                            <input type="text" value={supplierForm.contactName} onChange={(e) => setSupplierForm((c) => ({ ...c, contactName: e.target.value }))} placeholder="Contact person" className="w-full rounded-lg border border-gray-200 px-3 py-2 focus:border-amber-400 focus:outline-none" />
                            <div className="grid grid-cols-2 gap-3">
                                <input type="text" value={supplierForm.phone} onChange={(e) => setSupplierForm((c) => ({ ...c, phone: e.target.value }))} placeholder="Phone" className="w-full rounded-lg border border-gray-200 px-3 py-2 focus:border-amber-400 focus:outline-none" />
                                <input type="email" value={supplierForm.email} onChange={(e) => setSupplierForm((c) => ({ ...c, email: e.target.value }))} placeholder="Email" className="w-full rounded-lg border border-gray-200 px-3 py-2 focus:border-amber-400 focus:outline-none" />
                            </div>
                            <input type="text" value={supplierForm.accountName} onChange={(e) => setSupplierForm((c) => ({ ...c, accountName: e.target.value }))} placeholder="Payment account name" className="w-full rounded-lg border border-gray-200 px-3 py-2 focus:border-amber-400 focus:outline-none" />
                            <div className="grid grid-cols-2 gap-3">
                                <input type="text" value={supplierForm.upiId} onChange={(e) => setSupplierForm((c) => ({ ...c, upiId: e.target.value }))} placeholder="UPI ID" className="w-full rounded-lg border border-gray-200 px-3 py-2 focus:border-amber-400 focus:outline-none" />
                                <input type="url" value={supplierForm.qrCodeUrl} onChange={(e) => setSupplierForm((c) => ({ ...c, qrCodeUrl: e.target.value }))} placeholder="QR code image URL" className="w-full rounded-lg border border-gray-200 px-3 py-2 focus:border-amber-400 focus:outline-none" />
                            </div>
                            <input type="text" value={supplierForm.ingredients} onChange={(e) => setSupplierForm((c) => ({ ...c, ingredients: e.target.value }))} placeholder="Ingredients supplied, comma separated" className="w-full rounded-lg border border-gray-200 px-3 py-2 focus:border-amber-400 focus:outline-none" />
                            <div className="flex justify-end gap-3 pt-2">
                                <button type="button" onClick={() => setShowSupplierModal(false)} className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50">Cancel</button>
                                <button type="submit" disabled={savingSupplier} className="rounded-lg bg-amber-500 px-4 py-2 text-sm font-semibold text-white hover:bg-amber-600 disabled:opacity-60">
                                    {savingSupplier ? 'Saving...' : editingSupplier ? 'Update Supplier' : 'Add Supplier'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* ══════════ MODAL: Supplier-specific Orders ══════════ */}
            {selectedOrderSupplier && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setSelectedOrderSupplier(null)}>
                    <div className="w-full max-w-3xl rounded-2xl bg-white shadow-2xl" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-between border-b border-gray-100 p-5">
                            <div>
                                <h2 className="text-xl font-bold text-gray-900">{selectedOrderSupplier.name} Orders</h2>
                                <p className="text-sm text-gray-500">Accepted supplier orders can be confirmed as delivered here.</p>
                            </div>
                            <button onClick={() => setSelectedOrderSupplier(null)} className="rounded-lg p-2 text-gray-500 hover:bg-gray-100"><X size={18} /></button>
                        </div>
                        <div className="max-h-[75vh] space-y-4 overflow-y-auto p-5">
                            {selectedSupplierOrders.length === 0
                                ? <EmptyState icon="📦" message="No purchase orders for this supplier yet." />
                                : selectedSupplierOrders.map(renderOrderCard)
                            }
                        </div>
                    </div>
                </div>
            )}

            {/* ══════════ MODAL: All Purchase Orders History ══════════ */}
            {showHistoryModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setShowHistoryModal(false)}>
                    <div className="w-full max-w-4xl rounded-2xl bg-white shadow-2xl flex flex-col max-h-[90vh]" onClick={(e) => e.stopPropagation()}>

                        {/* header */}
                        <div className="flex items-center justify-between border-b border-gray-100 p-5 shrink-0">
                            <div className="flex items-center gap-3">
                                <div className="rounded-xl bg-gray-100 p-2 text-gray-600"><History size={20} /></div>
                                <div>
                                    <h2 className="text-xl font-bold text-gray-900">All Purchase Orders</h2>
                                    <p className="text-sm text-gray-500">{orders.length} total orders across all suppliers</p>
                                </div>
                            </div>
                            <button onClick={() => setShowHistoryModal(false)} className="rounded-lg p-2 text-gray-500 hover:bg-gray-100"><X size={18} /></button>
                        </div>

                        {/* search + filter tabs */}
                        <div className="border-b border-gray-100 px-5 py-3 space-y-3 shrink-0">
                            <input
                                type="text"
                                value={historySearch}
                                onChange={(e) => setHistorySearch(e.target.value)}
                                placeholder="Search by order number, supplier name, or item name..."
                                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-amber-400 focus:outline-none"
                            />
                            <div className="flex gap-2 flex-wrap">
                                {HISTORY_TABS.map((tab) => {
                                    const count = tab === 'all'
                                        ? orders.length
                                        : orders.filter((o) => o.status === tab).length;
                                    return (
                                        <button
                                            key={tab}
                                            onClick={() => setHistoryTab(tab)}
                                            className={`rounded-full px-3 py-1 text-xs font-semibold capitalize transition-colors ${
                                                historyTab === tab
                                                    ? 'bg-amber-500 text-white'
                                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                            }`}
                                        >
                                            {tab} <span className="opacity-75">({count})</span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* order list */}
                        <div className="overflow-y-auto p-5 space-y-4 flex-1">
                            {historyOrders.length === 0
                                ? <EmptyState icon="📋" message="No orders match your filter." />
                                : historyOrders.map(renderOrderCard)
                            }
                        </div>
                    </div>
                </div>
            )}

            {/* ══════════ MODAL: Edit Item Prices ══════════ */}
            {editingPricesForOrder && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setEditingPricesForOrder(null)}>
                    <div className="w-full max-w-2xl rounded-2xl bg-white shadow-2xl" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-between border-b border-gray-100 p-5">
                            <div>
                                <h2 className="text-xl font-bold text-gray-900">Edit Item Prices</h2>
                                <p className="text-sm text-gray-500">Order: {editingPricesForOrder.orderNumber}</p>
                            </div>
                            <button onClick={() => setEditingPricesForOrder(null)} className="rounded-lg p-2 text-gray-500 hover:bg-gray-100"><X size={18} /></button>
                        </div>
                        <div className="p-5 space-y-4">
                            {editingPricesForOrder.items.map((item, idx) => {
                                const key = item.inventoryItemId || item.itemName;
                                const val = priceEdits[key] ?? '';
                                const parsed = parseFloat(val);
                                const lineTotal = !isNaN(parsed) && parsed > 0
                                    ? (parsed * Number(item.quantity || 0)).toFixed(2) : null;
                                return (
                                    <div key={idx} className="rounded-xl border border-gray-200 p-4">
                                        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                                            <div className="flex-1">
                                                <p className="font-semibold text-gray-900">{item.itemName}</p>
                                                <p className="text-sm text-gray-500">Quantity: {item.quantity} {item.unit || 'units'}</p>
                                            </div>
                                            <div className="flex-1">
                                                <label className="block text-xs font-semibold text-gray-500 mb-1">
                                                    Price per {item.unit || 'unit'} (₹)
                                                </label>
                                                <input
                                                    type="number" min="0" step="0.01"
                                                    value={val}
                                                    onChange={(e) => setPriceEdits((p) => ({ ...p, [key]: e.target.value }))}
                                                    placeholder="Enter price"
                                                    className="w-full rounded-lg border border-gray-200 px-3 py-2 focus:border-amber-400 focus:outline-none"
                                                />
                                                {lineTotal && <p className="text-xs text-green-600 mt-1">Total: ₹{lineTotal}</p>}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                            <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                                <button onClick={() => setEditingPricesForOrder(null)} className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50">Cancel</button>
                                <button onClick={savePriceEdits} disabled={savingPrices} className="rounded-lg bg-amber-500 px-4 py-2 text-sm font-semibold text-white hover:bg-amber-600 disabled:opacity-60">
                                    {savingPrices ? 'Saving...' : 'Save Prices'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* ══════════ MODAL: Delivery QR ══════════ */}
            {showQrModal && qrOrder && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setShowQrModal(false)}>
                    <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl text-center" onClick={(e) => e.stopPropagation()}>
                        <div className="border-b border-gray-100 p-5">
                            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                                <QrCode size={30} className="text-green-600" />
                            </div>
                            <h2 className="mt-4 text-xl font-bold text-gray-900">Order Delivered!</h2>
                            <p className="mt-2 text-sm text-gray-500">QR Code generated for this delivery</p>
                        </div>
                        <div className="p-6">
                            <div className="rounded-xl bg-gray-50 p-4">
                                <p className="text-xs uppercase tracking-wide text-gray-500">Order Number</p>
                                <p className="font-mono text-lg font-bold text-amber-600">{qrOrder.orderNumber}</p>
                            </div>
                            {qrOrder.qrCode && (
                                <div className="mt-4 flex justify-center">
                                    <img src={qrOrder.qrCode} alt="Delivery QR" className="h-48 w-48 rounded-xl border-2 border-amber-200 object-contain p-2" />
                                </div>
                            )}
                            <p className="mt-4 text-xs text-gray-400">This QR code confirms the delivery. Stock has been updated automatically.</p>
                        </div>
                        <div className="border-t border-gray-100 p-5">
                            <button onClick={() => setShowQrModal(false)} className="rounded-lg bg-amber-500 px-6 py-2 text-sm font-semibold text-white hover:bg-amber-600">Close</button>
                        </div>
                    </div>
                </div>
            )}

            {/* ══════════ MODAL: Delete Order Confirm ══════════ */}
            {deleteOrderTarget && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setDeleteOrderTarget(null)}>
                    <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl" onClick={(e) => e.stopPropagation()}>
                        <div className="border-b border-gray-100 p-5 text-center">
                            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-100">
                                <Trash2 size={24} className="text-red-600" />
                            </div>
                            <h2 className="mt-3 text-xl font-bold text-gray-900">Delete Order</h2>
                        </div>
                        <div className="space-y-3 p-5">
                            <p className="text-gray-700">Delete order <span className="font-mono font-bold text-amber-600">{deleteOrderTarget.orderNumber}</span>?</p>
                            <p className="text-sm text-gray-500">This will permanently remove this order. This action cannot be undone.</p>
                            {deleteOrderTarget.status === 'delivered' && (
                                <div className="rounded-lg border border-amber-200 bg-amber-50 p-3">
                                    <p className="text-xs font-semibold text-amber-800">⚠️ Deleting a delivered order does not reverse the inventory stock that was added on delivery.</p>
                                </div>
                            )}
                        </div>
                        <div className="flex justify-end gap-3 border-t border-gray-100 p-5">
                            <button onClick={() => setDeleteOrderTarget(null)} className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50">Cancel</button>
                            <button onClick={deleteOrder} disabled={deletingOrder} className="rounded-lg bg-red-500 px-4 py-2 text-sm font-semibold text-white hover:bg-red-600 disabled:opacity-60">
                                {deletingOrder ? 'Deleting...' : 'Delete Order'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ══════════ MODAL: Delete Supplier Confirm ══════════ */}
            {deleteTarget && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setDeleteTarget(null)}>
                    <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl" onClick={(e) => e.stopPropagation()}>
                        <div className="border-b border-gray-100 p-5">
                            <h2 className="text-xl font-bold text-gray-900">Delete Supplier</h2>
                        </div>
                        <div className="space-y-3 p-5">
                            <p className="text-gray-700">Delete <span className="font-semibold">{deleteTarget.name}</span>?</p>
                            <p className="text-sm text-gray-500">This removes the supplier record. Existing purchase orders will remain in history.</p>
                        </div>
                        <div className="flex justify-end gap-3 border-t border-gray-100 p-5">
                            <button onClick={() => setDeleteTarget(null)} className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50">Cancel</button>
                            <button onClick={deleteSupplier} disabled={deleting} className="rounded-lg bg-red-500 px-4 py-2 text-sm font-semibold text-white hover:bg-red-600 disabled:opacity-60">
                                {deleting ? 'Deleting...' : 'Delete Supplier'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}