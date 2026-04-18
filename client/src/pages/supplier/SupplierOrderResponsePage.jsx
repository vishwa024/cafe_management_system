import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { CheckCircle, Package, XCircle } from 'lucide-react';
import { API_BASE_URL } from '../../config/runtime';

export default function SupplierOrderResponsePage() {
    const { orderId } = useParams();
    const [searchParams] = useSearchParams();
    const [state, setState] = useState({
        loading: true,
        success: false,
        message: '',
        order: null,
    });
    const [itemPrices, setItemPrices] = useState({});
    const [submitting, setSubmitting] = useState(false);
    const [action, setAction] = useState(null);

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const token = searchParams.get('token');
                const response = await axios.get(`${API_BASE_URL}/supplier-orders/${orderId}/details`, {
                    params: { token },
                });

                const order = response.data?.order || null;
                const initialPrices = {};

                order?.items?.forEach((item) => {
                    const key = item.inventoryItem?._id || item.inventoryItemId || item.itemName;
                    initialPrices[key] = item.price || '';
                });

                setItemPrices(initialPrices);
                setState({
                    loading: false,
                    success: false,
                    message: '',
                    order,
                });
            } catch (err) {
                setState({
                    loading: false,
                    success: false,
                    message: err.response?.data?.message || 'Unable to fetch order details.',
                    order: null,
                });
            }
        };

        fetchOrder();
    }, [orderId, searchParams]);

    const updatePrice = (itemId, value) => {
        setItemPrices((prev) => ({ ...prev, [itemId]: value }));
    };

    const getItemKey = (item) => item.inventoryItem?._id || item.inventoryItemId || item.itemName;

    const handleResponse = async (selectedAction) => {
        setAction(selectedAction);
        setSubmitting(true);

        if (selectedAction === 'accept') {
            const hasInvalidPrice = Object.values(itemPrices).some((price) => !price || parseFloat(price) <= 0);
            if (hasInvalidPrice) {
                alert('Please enter valid prices for all items before accepting the order.');
                setSubmitting(false);
                setAction(null);
                return;
            }
        }

        try {
            const token = searchParams.get('token');
            const response = await axios.post(`${API_BASE_URL}/supplier-orders/${orderId}/respond`, {
                action: selectedAction,
                token,
                itemPrices: selectedAction === 'accept' ? itemPrices : undefined,
            });

            setState({
                loading: false,
                success: true,
                message: response.data?.message || `Order ${selectedAction === 'accept' ? 'accepted' : 'rejected'} successfully.`,
                order: response.data?.order || null,
            });
        } catch (err) {
            setState({
                loading: false,
                success: false,
                message: err.response?.data?.message || `Failed to ${selectedAction} the order.`,
                order: err.response?.data?.order || null,
            });
        } finally {
            setSubmitting(false);
            setAction(null);
        }
    };

    if (state.loading) {
        return (
            <div className="min-h-screen bg-gray-50 px-4 py-12">
                <div className="mx-auto max-w-2xl rounded-3xl border border-gray-200 bg-white p-8 text-center shadow-sm">
                    <Package size={28} className="mx-auto animate-pulse text-amber-500" />
                    <h1 className="mt-4 text-2xl font-bold text-gray-900">Loading order details...</h1>
                </div>
            </div>
        );
    }

    if (!state.order) {
        return (
            <div className="min-h-screen bg-gray-50 px-4 py-12">
                <div className="mx-auto max-w-2xl rounded-3xl border border-gray-200 bg-white p-8 text-center shadow-sm">
                    <XCircle size={30} className="mx-auto text-red-500" />
                    <h1 className="mt-4 text-2xl font-bold text-gray-900">Order Not Found</h1>
                    <p className="mt-3 text-sm text-gray-600">{state.message}</p>
                    <div className="mt-6">
                        <Link to="/" className="text-sm font-semibold text-amber-600 hover:text-amber-700">
                            Return to site
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    const canRespond = state.order.status === 'pending';

    return (
        <div className="min-h-screen bg-gray-50 px-4 py-12">
            <div className="mx-auto max-w-2xl rounded-3xl border border-gray-200 bg-white p-8 shadow-sm">
                <div className="text-center">
                    <div className={`mx-auto flex h-16 w-16 items-center justify-center rounded-full ${state.success ? 'bg-green-100 text-green-600' : 'bg-amber-100 text-amber-600'}`}>
                        {state.success ? <CheckCircle size={30} /> : <Package size={28} />}
                    </div>
                    <h1 className="mt-4 text-2xl font-bold text-gray-900">
                        {state.success ? 'Order Response Saved' : 'Purchase Order Details'}
                    </h1>
                    {state.message ? <p className="mt-3 text-sm text-gray-600">{state.message}</p> : null}
                </div>

                <div className="mt-8 rounded-2xl border border-gray-200 bg-gray-50 p-5">
                    <div className="flex items-center justify-between gap-4">
                        <div>
                            <p className="text-xs uppercase tracking-wide text-gray-500">Purchase Order</p>
                            <p className="mt-1 font-mono text-lg font-bold text-amber-600">{state.order.orderNumber}</p>
                        </div>
                        <span className={`rounded-full px-3 py-1 text-xs font-semibold ${
                            state.order.status === 'pending'
                                ? 'bg-amber-100 text-amber-700'
                                : state.order.status === 'accepted'
                                    ? 'bg-green-100 text-green-700'
                                    : 'bg-red-100 text-red-700'
                        }`}>
                            {state.order.status}
                        </span>
                    </div>

                    <div className="mt-4 space-y-2 text-sm text-gray-600">
                        <p>Supplier: {state.order.supplier?.name || 'Supplier'}</p>
                        <p>Delivery Address: {state.order.deliveryAddress}</p>
                        {state.order.notes ? <p className="text-amber-600">Notes: {state.order.notes}</p> : null}
                    </div>
                </div>

                <div className="mt-6">
                    <h3 className="mb-3 text-lg font-semibold text-gray-900">Items to Supply</h3>
                    <div className="space-y-3">
                        {state.order.items.map((item, idx) => (
                            <div key={idx} className="rounded-xl border border-gray-200 p-4">
                                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                                    <div className="flex-1">
                                        <p className="font-semibold text-gray-900">{item.itemName}</p>
                                        <p className="text-sm text-gray-500">
                                            Quantity: {item.quantity} {item.unit || 'units'}
                                        </p>
                                    </div>

                                    {canRespond ? (
                                        <div className="flex-1">
                                            <label className="mb-1 block text-xs font-semibold text-gray-500">
                                                Your Price per {item.unit || 'unit'} (Rs.)
                                            </label>
                                            <input
                                                type="number"
                                                min="0"
                                                step="0.01"
                                                value={itemPrices[getItemKey(item)] || ''}
                                                onChange={(e) => updatePrice(getItemKey(item), e.target.value)}
                                                placeholder="Enter your price"
                                                className="w-full rounded-lg border border-gray-200 px-3 py-2 focus:border-amber-400 focus:outline-none"
                                                disabled={submitting}
                                            />
                                            {itemPrices[getItemKey(item)] ? (
                                                <p className="mt-1 text-xs text-green-600">
                                                    Total: Rs. {(parseFloat(itemPrices[getItemKey(item)]) * item.quantity).toFixed(2)}
                                                </p>
                                            ) : null}
                                        </div>
                                    ) : (
                                        <div className="flex-1">
                                            <p className="text-sm text-gray-500">Price per {item.unit || 'unit'}</p>
                                            <p className="font-semibold text-green-600">
                                                {item.price ? `Rs. ${Number(item.price).toFixed(2)}` : 'Not set'}
                                            </p>
                                            {item.price ? (
                                                <p className="text-xs text-gray-500">
                                                    Total: Rs. {(Number(item.price) * item.quantity).toFixed(2)}
                                                </p>
                                            ) : null}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {canRespond ? (
                    <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:gap-4">
                        <button
                            onClick={() => handleResponse('accept')}
                            disabled={submitting && action === 'accept'}
                            className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-green-600 px-6 py-3 font-semibold text-white transition hover:bg-green-700 disabled:opacity-60"
                        >
                            {submitting && action === 'accept' ? 'Processing...' : <>
                                <CheckCircle size={18} />
                                Accept Order & Add Prices
                            </>}
                        </button>
                        <button
                            onClick={() => handleResponse('reject')}
                            disabled={submitting && action === 'reject'}
                            className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-red-600 px-6 py-3 font-semibold text-white transition hover:bg-red-700 disabled:opacity-60"
                        >
                            {submitting && action === 'reject' ? 'Processing...' : <>
                                <XCircle size={18} />
                                Reject Order
                            </>}
                        </button>
                    </div>
                ) : null}

                <div className="mt-6 text-center text-sm text-gray-500">
                    Roller Coaster Cafe manager panel will reflect this status automatically.
                </div>
                <div className="mt-4 text-center">
                    <Link to="/" className="text-sm font-semibold text-amber-600 hover:text-amber-700">
                        Return to site
                    </Link>
                </div>
            </div>
        </div>
    );
}
