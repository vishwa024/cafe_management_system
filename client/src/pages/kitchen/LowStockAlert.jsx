import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { AlertTriangle, Package, Send, CheckCircle, XCircle, RefreshCw, Clock, TrendingUp, Truck } from 'lucide-react';
import toast from 'react-hot-toast';

export default function LowStockAlert() {
    const [lowStockItems, setLowStockItems] = useState([]);
    const [suppliers, setSuppliers] = useState([]);
    const [selectedSupplier, setSelectedSupplier] = useState('');
    const [orderItems, setOrderItems] = useState({});
    const [loading, setLoading] = useState(true);
    const [creatingOrder, setCreatingOrder] = useState(false);
    const [orders, setOrders] = useState([]);
    const [activeTab, setActiveTab] = useState('alert');

    const fetchData = async () => {
        setLoading(true);
        try {
            const [stockRes, supplierRes, ordersRes] = await Promise.all([
                api.get('/inventory/low-stock'),
                api.get('/manager/suppliers'),
                api.get('/manager/supplier-orders')
            ]);
            
            setLowStockItems(stockRes.data || []);
            setSuppliers(supplierRes.data || []);
            setOrders(ordersRes.data || []);
            
            const initialItems = {};
            (stockRes.data || []).forEach(item => {
                const suggestedQty = Math.ceil((item.reorderLevel * 2) - item.currentStock);
                initialItems[item._id] = {
                    quantity: suggestedQty > 0 ? suggestedQty : 10,
                    price: 0
                };
            });
            setOrderItems(initialItems);
        } catch (err) {
            console.error('Failed to fetch data:', err);
            toast.error('Failed to load data');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
        const interval = setInterval(fetchData, 30000);
        return () => clearInterval(interval);
    }, []);

    const handleQuantityChange = (itemId, quantity) => {
        setOrderItems(prev => ({
            ...prev,
            [itemId]: { ...prev[itemId], quantity: parseInt(quantity) || 0 }
        }));
    };

    const handlePriceChange = (itemId, price) => {
        setOrderItems(prev => ({
            ...prev,
            [itemId]: { ...prev[itemId], price: parseFloat(price) || 0 }
        }));
    };

    const handleCreateOrder = async () => {
        if (!selectedSupplier) {
            toast.error('Please select a supplier');
            return;
        }

        const itemsToOrder = lowStockItems
            .filter(item => orderItems[item._id]?.quantity > 0)
            .map(item => ({
                inventoryItemId: item._id,
                quantity: orderItems[item._id].quantity,
                price: orderItems[item._id].price
            }));

        if (itemsToOrder.length === 0) {
            toast.error('Please add at least one item to order');
            return;
        }

        setCreatingOrder(true);
        try {
            const response = await api.post('/manager/supplier-orders/create-from-low-stock', {
                supplierId: selectedSupplier,
                items: itemsToOrder,
                deliveryAddress: 'Roller Coaster Cafe, Under Nutan School, Juna Road, Opposite Navjeevan Hospital, Bareja, Ahmedabad, Gujarat 382425',
                notes: 'Urgent delivery requested - Low stock alert'
            });
            
            if (response.data.success) {
                toast.success('Purchase order created! Supplier has been notified via email.');
                setSelectedSupplier('');
                fetchData();
            }
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to create order');
        } finally {
            setCreatingOrder(false);
        }
    };

    const getStatusBadge = (status) => {
        const badges = {
            pending: 'bg-yellow-100 text-yellow-700',
            accepted: 'bg-blue-100 text-blue-700',
            delivered: 'bg-green-100 text-green-700',
            rejected: 'bg-red-100 text-red-700'
        };
        return badges[status] || 'bg-gray-100 text-gray-700';
    };

    const getStatusIcon = (status) => {
        switch(status) {
            case 'delivered': return <CheckCircle size={14} className="text-green-600" />;
            case 'rejected': return <XCircle size={14} className="text-red-600" />;
            case 'accepted': return <CheckCircle size={14} className="text-blue-600" />;
            case 'pending': return <Clock size={14} className="text-yellow-600" />;
            default: return <Package size={14} className="text-gray-600" />;
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-500">Loading inventory data...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-white rounded-xl border border-gray-200 p-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-red-100 rounded-lg">
                            <AlertTriangle size={18} className="text-red-600" />
                        </div>
                        <div>
                            <p className="text-xs text-gray-500">Low Stock Items</p>
                            <p className="text-2xl font-bold text-gray-900">{lowStockItems.length}</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-xl border border-gray-200 p-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-yellow-100 rounded-lg">
                            <Clock size={18} className="text-yellow-600" />
                        </div>
                        <div>
                            <p className="text-xs text-gray-500">Pending Orders</p>
                            <p className="text-2xl font-bold text-gray-900">{orders.filter(o => o.status === 'pending').length}</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-xl border border-gray-200 p-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-green-100 rounded-lg">
                            <Truck size={18} className="text-green-600" />
                        </div>
                        <div>
                            <p className="text-xs text-gray-500">Total Orders</p>
                            <p className="text-2xl font-bold text-gray-900">{orders.length}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 bg-white border border-gray-200 rounded-lg p-1 w-fit">
                <button
                    onClick={() => setActiveTab('alert')}
                    className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${
                        activeTab === 'alert' ? 'bg-amber-500 text-white' : 'text-gray-600 hover:bg-gray-100'
                    }`}
                >
                    <AlertTriangle size={14} className="inline mr-2" />
                    Low Stock Alert ({lowStockItems.length})
                </button>
                <button
                    onClick={() => setActiveTab('orders')}
                    className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${
                        activeTab === 'orders' ? 'bg-amber-500 text-white' : 'text-gray-600 hover:bg-gray-100'
                    }`}
                >
                    <Package size={14} className="inline mr-2" />
                    Purchase Orders ({orders.filter(o => o.status === 'pending').length})
                </button>
            </div>

            {activeTab === 'alert' && (
                <>
                    {lowStockItems.length > 0 && (
                        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-start gap-3">
                            <AlertTriangle size={24} className="text-amber-600 flex-shrink-0" />
                            <div>
                                <h3 className="font-semibold text-amber-800">⚠️ Low Stock Alert</h3>
                                <p className="text-sm text-amber-700">
                                    {lowStockItems.length} item(s) are below reorder level. Create a purchase order to restock.
                                </p>
                            </div>
                        </div>
                    )}

                    {lowStockItems.length > 0 ? (
                        <>
                            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                                <div className="px-5 py-4 border-b border-gray-200 bg-gray-50">
                                    <h3 className="font-semibold text-gray-900">Items Needing Restock</h3>
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm">
                                        <thead className="bg-gray-50">
                                            <tr className="text-gray-600">
                                                <th className="px-4 py-3 text-left">Item</th>
                                                <th className="px-4 py-3 text-left">Current Stock</th>
                                                <th className="px-4 py-3 text-left">Reorder Level</th>
                                                <th className="px-4 py-3 text-left">Unit</th>
                                                <th className="px-4 py-3 text-left">Order Quantity</th>
                                                <th className="px-4 py-3 text-left">Price/Unit (₹)</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-100">
                                            {lowStockItems.map(item => (
                                                <tr key={item._id} className="hover:bg-gray-50">
                                                    <td className="px-4 py-3 font-medium text-gray-900">{item.name}</td>
                                                    <td className="px-4 py-3">
                                                        <span className="text-red-600 font-semibold">{item.currentStock}</span>
                                                    </td>
                                                    <td className="px-4 py-3">{item.reorderLevel}</td>
                                                    <td className="px-4 py-3 text-gray-500">{item.unit}</td>
                                                    <td className="px-4 py-3">
                                                        <input
                                                            type="number"
                                                            min="1"
                                                            value={orderItems[item._id]?.quantity || ''}
                                                            onChange={(e) => handleQuantityChange(item._id, e.target.value)}
                                                            className="w-24 px-2 py-1 border border-gray-200 rounded-lg focus:outline-none focus:border-amber-400"
                                                            placeholder="Qty"
                                                        />
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        <input
                                                            type="number"
                                                            min="0"
                                                            step="0.01"
                                                            value={orderItems[item._id]?.price || ''}
                                                            onChange={(e) => handlePriceChange(item._id, e.target.value)}
                                                            className="w-24 px-2 py-1 border border-gray-200 rounded-lg focus:outline-none focus:border-amber-400"
                                                            placeholder="Price"
                                                        />
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            <div className="bg-white rounded-xl border border-gray-200 p-5">
                                <h3 className="font-semibold text-gray-900 mb-4">Create Purchase Order</h3>
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Select Supplier *</label>
                                        <select
                                            value={selectedSupplier}
                                            onChange={(e) => setSelectedSupplier(e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-amber-400"
                                        >
                                            <option value="">Choose a supplier...</option>
                                            {suppliers.map(supplier => (
                                                <option key={supplier._id} value={supplier._id}>
                                                    {supplier.name} - {supplier.phone}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="flex items-end">
                                        <button
                                            onClick={handleCreateOrder}
                                            disabled={creatingOrder || !selectedSupplier}
                                            className="w-full px-4 py-2 bg-amber-500 text-white rounded-lg font-semibold hover:bg-amber-600 transition disabled:opacity-50 flex items-center justify-center gap-2"
                                        >
                                            <Send size={16} />
                                            {creatingOrder ? 'Creating Order...' : 'Send Order to Supplier'}
                                        </button>
                                    </div>
                                </div>
                                <p className="text-xs text-gray-500 mt-3">
                                    The supplier will receive an email with order details. Once accepted, you can track the order status.
                                </p>
                            </div>
                        </>
                    ) : (
                        <div className="bg-green-50 border border-green-200 rounded-lg p-8 text-center">
                            <CheckCircle size={48} className="mx-auto text-green-500 mb-3" />
                            <h3 className="text-lg font-semibold text-green-700">All Stock Levels Are Good!</h3>
                            <p className="text-green-600">No items are currently low on stock.</p>
                        </div>
                    )}
                </>
            )}

            {activeTab === 'orders' && (
                <div className="space-y-4">
                    {orders.length === 0 ? (
                        <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
                            <Package size={48} className="mx-auto text-gray-300 mb-3" />
                            <p className="text-gray-500">No purchase orders yet</p>
                            <p className="text-sm text-gray-400 mt-1">Create an order from the Low Stock Alert tab</p>
                        </div>
                    ) : (
                        orders.map(order => (
                            <div key={order._id} className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <div className="flex items-center gap-3">
                                            <span className="font-mono text-lg font-bold text-amber-600">{order.orderNumber}</span>
                                            <span className={`px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1 ${getStatusBadge(order.status)}`}>
                                                {getStatusIcon(order.status)}
                                                {order.status}
                                            </span>
                                        </div>
                                        <p className="text-sm text-gray-500 mt-1">Supplier: {order.supplier?.name}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-lg font-bold text-gray-900">₹{order.totalAmount}</p>
                                        <p className="text-xs text-gray-400">{new Date(order.createdAt).toLocaleDateString()}</p>
                                    </div>
                                </div>

                                <div className="grid md:grid-cols-2 gap-4 mb-4">
                                    <div>
                                        <p className="text-xs font-semibold text-gray-500 uppercase">Items Ordered</p>
                                        <div className="mt-2 space-y-1">
                                            {order.items.slice(0, 3).map((item, idx) => (
                                                <div key={idx} className="text-sm">
                                                    {item.itemName}: {item.quantity} {item.unit}
                                                </div>
                                            ))}
                                            {order.items.length > 3 && (
                                                <p className="text-xs text-gray-400">+{order.items.length - 3} more items</p>
                                            )}
                                        </div>
                                    </div>
                                    <div>
                                        <p className="text-xs font-semibold text-gray-500 uppercase">Delivery Address</p>
                                        <p className="text-sm text-gray-600 mt-1">{order.deliveryAddress}</p>
                                    </div>
                                </div>

                                <div className="flex gap-2 pt-3 border-t border-gray-100">
                                    {order.status === 'accepted' && (
                                        <span className="text-sm text-blue-600 flex items-center gap-1">
                                            <CheckCircle size={14} /> Order Accepted - Awaiting Delivery
                                        </span>
                                    )}
                                    {order.status === 'delivered' && (
                                        <span className="text-sm text-green-600 flex items-center gap-1">
                                            <CheckCircle size={14} /> Delivered - Stock Updated
                                        </span>
                                    )}
                                    {order.status === 'rejected' && (
                                        <span className="text-sm text-red-600 flex items-center gap-1">
                                            <XCircle size={14} /> Rejected: {order.rejectionReason || 'No reason provided'}
                                        </span>
                                    )}
                                    {order.status === 'pending' && (
                                        <span className="text-sm text-yellow-600 flex items-center gap-1">
                                            <Clock size={14} /> Waiting for supplier response
                                        </span>
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
}