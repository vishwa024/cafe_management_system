// import React, { useEffect, useMemo, useState } from 'react';
// import api from '../../services/api';
// import toast from 'react-hot-toast';
// import {
//     AlertTriangle,
//     CheckCircle,
//     Mail,
//     Package,
//     Phone,
//     Plus,
//     RefreshCw,
//     Trash2,
//     Truck,
//     X,
//     Edit2,
// } from 'lucide-react';
// import { EmptyState, LoadingSpinner } from '../../components/shared/StatusBadge';

// const EMPTY_SUPPLIER = { name: '', contactName: '', phone: '', email: '', ingredients: '' };
// const DELIVERY_ADDRESS = 'Roller Coaster Cafe, Under Nutan School, Juna Road, Opposite Navjeevan Hospital, Bareja, Ahmedabad, Gujarat 382425';

// const formatCurrency = (value) => `Rs. ${Number(value || 0).toFixed(2)}`;

// const getStatusClasses = (status) => {
//     switch (status) {
//         case 'accepted':
//             return 'bg-blue-100 text-blue-700';
//         case 'delivered':
//             return 'bg-green-100 text-green-700';
//         case 'rejected':
//             return 'bg-red-100 text-red-700';
//         case 'processing':
//         case 'shipped':
//             return 'bg-purple-100 text-purple-700';
//         default:
//             return 'bg-amber-100 text-amber-700';
//     }
// };

// export default function SupplierManagementPage() {
//     const [suppliers, setSuppliers] = useState([]);
//     const [orders, setOrders] = useState([]);
//     const [lowStockItems, setLowStockItems] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [refreshing, setRefreshing] = useState(false);
//     const [showSupplierModal, setShowSupplierModal] = useState(false);
//     const [editingSupplier, setEditingSupplier] = useState(null);
//     const [supplierForm, setSupplierForm] = useState(EMPTY_SUPPLIER);
//     const [savingSupplier, setSavingSupplier] = useState(false);
//     const [deleteTarget, setDeleteTarget] = useState(null);
//     const [deleting, setDeleting] = useState(false);
//     const [selectedOrderSupplier, setSelectedOrderSupplier] = useState(null);
//     const [orderDraftSupplierId, setOrderDraftSupplierId] = useState('');
//     const [orderDrafts, setOrderDrafts] = useState({});
//     const [creatingOrder, setCreatingOrder] = useState(false);
//     const [deliveringOrderId, setDeliveringOrderId] = useState('');

//     const refreshData = async (isInitial = false) => {
//         if (isInitial) {
//             setLoading(true);
//         } else {
//             setRefreshing(true);
//         }

//         try {
//             const [suppliersRes, ordersRes, lowStockRes] = await Promise.allSettled([
//                 api.get('/manager/suppliers'),
//                 api.get('/manager/supplier-orders'),
//                 api.get('/inventory/low-stock'),
//             ]);

//             const supplierList = suppliersRes.status === 'fulfilled' && Array.isArray(suppliersRes.value.data)
//                 ? suppliersRes.value.data
//                 : [];
//             const orderList = ordersRes.status === 'fulfilled' && Array.isArray(ordersRes.value.data)
//                 ? ordersRes.value.data
//                 : [];
//             const lowStockList = lowStockRes.status === 'fulfilled' && Array.isArray(lowStockRes.value.data)
//                 ? lowStockRes.value.data
//                 : [];

//             setSuppliers(supplierList);
//             setOrders(orderList);
//             setLowStockItems(lowStockList);
//             setSelectedOrderSupplier((current) => {
//                 if (!current) return null;
//                 return supplierList.find((supplier) => supplier._id === current._id) || current;
//             });
//             setOrderDrafts((current) => {
//                 const nextDrafts = { ...current };
//                 lowStockList.forEach((item) => {
//                     if (!nextDrafts[item._id]) {
//                         const suggestedQty = Math.max(1, Math.ceil((Number(item.reorderLevel || 0) * 2) - Number(item.currentStock || 0)));
//                         nextDrafts[item._id] = { quantity: suggestedQty, price: 0 };
//                     }
//                 });
//                 return lowStockList.length > 0 ? nextDrafts : {};
//             });

//             if (suppliersRes.status === 'rejected') {
//                 toast.error(suppliersRes.reason?.response?.data?.message || 'Failed to load suppliers');
//             }
//             if (ordersRes.status === 'rejected') {
//                 toast.error(ordersRes.reason?.response?.data?.message || 'Failed to load supplier orders');
//             }
//             if (lowStockRes.status === 'rejected') {
//                 console.error('Low-stock fetch failed:', lowStockRes.reason);
//             }
//         } catch (err) {
//             toast.error(err.response?.data?.message || 'Failed to load supplier workflow data');
//         } finally {
//             setLoading(false);
//             setRefreshing(false);
//         }
//     };

//     useEffect(() => {
//         refreshData(true);
//         const intervalId = setInterval(() => refreshData(false), 30000);
//         return () => clearInterval(intervalId);
//     }, []);

//     const supplierOrderMap = useMemo(() => {
//         const map = new Map();
//         suppliers.forEach((supplier) => {
//             map.set(supplier._id, orders.filter((order) => order.supplier?._id === supplier._id));
//         });
//         return map;
//     }, [suppliers, orders]);

//     const openCreateSupplier = () => {
//         setEditingSupplier(null);
//         setSupplierForm(EMPTY_SUPPLIER);
//         setShowSupplierModal(true);
//     };

//     const openEditSupplier = (supplier) => {
//         setEditingSupplier(supplier);
//         setSupplierForm({
//             name: supplier.name || '',
//             contactName: supplier.contactName || '',
//             phone: supplier.phone || '',
//             email: supplier.email || '',
//             ingredients: (supplier.ingredients || []).join(', '),
//         });
//         setShowSupplierModal(true);
//     };

//     const saveSupplier = async (event) => {
//         event.preventDefault();
//         if (!supplierForm.name.trim()) {
//             toast.error('Supplier name is required');
//             return;
//         }

//         setSavingSupplier(true);
//         try {
//             const payload = {
//                 name: supplierForm.name.trim(),
//                 contactName: supplierForm.contactName.trim(),
//                 phone: supplierForm.phone.trim(),
//                 email: supplierForm.email.trim(),
//                 ingredients: supplierForm.ingredients.split(',').map((entry) => entry.trim()).filter(Boolean),
//             };

//             if (editingSupplier) {
//                 await api.put(`/manager/suppliers/${editingSupplier._id}`, payload);
//                 toast.success('Supplier updated successfully');
//             } else {
//                 await api.post('/manager/suppliers', payload);
//                 toast.success('Supplier added successfully');
//             }

//             setShowSupplierModal(false);
//             setSupplierForm(EMPTY_SUPPLIER);
//             await refreshData(false);
//         } catch (err) {
//             toast.error(err.response?.data?.message || 'Failed to save supplier');
//         } finally {
//             setSavingSupplier(false);
//         }
//     };

//     const deleteSupplier = async () => {
//         if (!deleteTarget) return;
//         setDeleting(true);
//         try {
//             await api.delete(`/manager/suppliers/${deleteTarget._id}`);
//             toast.success('Supplier deleted successfully');
//             setDeleteTarget(null);
//             await refreshData(false);
//         } catch (err) {
//             toast.error(err.response?.data?.message || 'Failed to delete supplier');
//         } finally {
//             setDeleting(false);
//         }
//     };

//     const updateDraft = (itemId, key, value) => {
//         setOrderDrafts((current) => ({
//             ...current,
//             [itemId]: {
//                 ...(current[itemId] || { quantity: 1, price: 0 }),
//                 [key]: key === 'price' ? Number(value || 0) : Math.max(1, Number(value || 1)),
//             },
//         }));
//     };

//     const createPurchaseOrder = async () => {
//         if (!orderDraftSupplierId) {
//             toast.error('Select a supplier first');
//             return;
//         }

//         const items = lowStockItems
//             .filter((item) => Number(orderDrafts[item._id]?.quantity || 0) > 0)
//             .map((item) => ({
//                 inventoryItemId: item._id,
//                 quantity: Number(orderDrafts[item._id].quantity),
//                 price: Number(orderDrafts[item._id].price || 0),
//             }));

//         if (items.length === 0) {
//             toast.error('At least one low-stock item must be included');
//             return;
//         }

//         setCreatingOrder(true);
//         try {
//             await api.post('/manager/supplier-orders/create-from-low-stock', {
//                 supplierId: orderDraftSupplierId,
//                 items,
//                 deliveryAddress: DELIVERY_ADDRESS,
//                 notes: 'Urgent low-stock purchase order created from Supplier Management',
//             });
//             toast.success('Purchase order created and email sent to supplier');
//             setOrderDraftSupplierId('');
//             await refreshData(false);
//         } catch (err) {
//             toast.error(err.response?.data?.message || 'Failed to create purchase order');
//         } finally {
//             setCreatingOrder(false);
//         }
//     };

//     const confirmDelivery = async (orderId) => {
//         setDeliveringOrderId(orderId);
//         try {
//             await api.patch(`/manager/supplier-orders/${orderId}/deliver`);
//             toast.success('Delivery confirmed and inventory stock updated');
//             await refreshData(false);
//         } catch (err) {
//             toast.error(err.response?.data?.message || 'Failed to confirm delivery');
//         } finally {
//             setDeliveringOrderId('');
//         }
//     };

//     const selectedSupplierOrders = selectedOrderSupplier
//         ? (supplierOrderMap.get(selectedOrderSupplier._id) || [])
//         : [];

//     const pendingCount = orders.filter((order) => order.status === 'pending').length;
//     const acceptedCount = orders.filter((order) => order.status === 'accepted').length;
//     const deliveredCount = orders.filter((order) => order.status === 'delivered').length;

//     if (loading) {
//         return <LoadingSpinner />;
//     }

//     return (
//         <div className="space-y-6">
//             <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
//                 <div>
//                     <h1 className="text-2xl font-bold text-gray-900">Supplier Management</h1>
//                     <p className="mt-1 text-sm text-gray-500">Create purchase orders, track supplier responses, and confirm delivery.</p>
//                 </div>
//                 <div className="flex gap-2">
//                     <button
//                         onClick={() => refreshData(false)}
//                         disabled={refreshing}
//                         className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-60"
//                     >
//                         <RefreshCw size={15} className={refreshing ? 'animate-spin' : ''} />
//                         Refresh
//                     </button>
//                     <button
//                         onClick={openCreateSupplier}
//                         className="inline-flex items-center gap-2 rounded-lg bg-amber-500 px-4 py-2 text-sm font-semibold text-white hover:bg-amber-600"
//                     >
//                         <Plus size={15} />
//                         Add Supplier
//                     </button>
//                 </div>
//             </div>

//             <div className="grid gap-4 md:grid-cols-4">
//                 <div className="rounded-xl border border-gray-200 bg-white p-4">
//                     <p className="text-xs uppercase tracking-wide text-gray-500">Suppliers</p>
//                     <p className="mt-2 text-2xl font-bold text-gray-900">{suppliers.length}</p>
//                 </div>
//                 <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
//                     <p className="text-xs uppercase tracking-wide text-amber-700">Pending Orders</p>
//                     <p className="mt-2 text-2xl font-bold text-amber-800">{pendingCount}</p>
//                 </div>
//                 <div className="rounded-xl border border-blue-200 bg-blue-50 p-4">
//                     <p className="text-xs uppercase tracking-wide text-blue-700">Accepted Orders</p>
//                     <p className="mt-2 text-2xl font-bold text-blue-800">{acceptedCount}</p>
//                 </div>
//                 <div className="rounded-xl border border-green-200 bg-green-50 p-4">
//                     <p className="text-xs uppercase tracking-wide text-green-700">Delivered Orders</p>
//                     <p className="mt-2 text-2xl font-bold text-green-800">{deliveredCount}</p>
//                 </div>
//             </div>

//             <section className="rounded-2xl border border-gray-200 bg-white">
//                 <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
//                     <div>
//                         <h2 className="text-lg font-semibold text-gray-900">Low Stock to Purchase Order</h2>
//                         <p className="text-sm text-gray-500">Kitchen low-stock items flow into manager ordering here.</p>
//                     </div>
//                     <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-700">
//                         {lowStockItems.length} low stock
//                     </span>
//                 </div>

//                 {lowStockItems.length === 0 ? (
//                     <div className="px-5 py-10 text-center">
//                         <CheckCircle size={42} className="mx-auto text-green-500" />
//                         <p className="mt-3 font-semibold text-gray-900">No low-stock items right now</p>
//                         <p className="text-sm text-gray-500">When kitchen inventory drops below reorder level, it will appear here for manager ordering.</p>
//                     </div>
//                 ) : (
//                     <div className="space-y-4 p-5">
//                         <div className="grid gap-4 lg:grid-cols-[2fr,1fr]">
//                             <div className="overflow-x-auto rounded-xl border border-gray-200">
//                                 <table className="w-full text-sm">
//                                     <thead className="bg-gray-50 text-gray-600">
//                                         <tr>
//                                             <th className="px-4 py-3 text-left">Item</th>
//                                             <th className="px-4 py-3 text-left">Current</th>
//                                             <th className="px-4 py-3 text-left">Reorder</th>
//                                             <th className="px-4 py-3 text-left">Order Qty</th>
//                                             <th className="px-4 py-3 text-left">Price</th>
//                                         </tr>
//                                     </thead>
//                                     <tbody className="divide-y divide-gray-100">
//                                         {lowStockItems.map((item) => (
//                                             <tr key={item._id}>
//                                                 <td className="px-4 py-3">
//                                                     <div className="font-medium text-gray-900">{item.name}</div>
//                                                     <div className="text-xs text-gray-400">{item.unit}</div>
//                                                 </td>
//                                                 <td className="px-4 py-3 font-semibold text-red-600">{item.currentStock}</td>
//                                                 <td className="px-4 py-3 text-gray-600">{item.reorderLevel}</td>
//                                                 <td className="px-4 py-3">
//                                                     <input
//                                                         type="number"
//                                                         min="1"
//                                                         value={orderDrafts[item._id]?.quantity ?? 1}
//                                                         onChange={(event) => updateDraft(item._id, 'quantity', event.target.value)}
//                                                         className="w-24 rounded-lg border border-gray-200 px-3 py-2 focus:border-amber-400 focus:outline-none"
//                                                     />
//                                                 </td>
//                                                 <td className="px-4 py-3">
//                                                     <input
//                                                         type="number"
//                                                         min="0"
//                                                         step="0.01"
//                                                         value={orderDrafts[item._id]?.price ?? 0}
//                                                         onChange={(event) => updateDraft(item._id, 'price', event.target.value)}
//                                                         className="w-28 rounded-lg border border-gray-200 px-3 py-2 focus:border-amber-400 focus:outline-none"
//                                                     />
//                                                 </td>
//                                             </tr>
//                                         ))}
//                                     </tbody>
//                                 </table>
//                             </div>

//                             <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
//                                 <div className="flex items-start gap-3">
//                                     <AlertTriangle size={18} className="mt-0.5 text-amber-600" />
//                                     <div>
//                                         <p className="font-semibold text-amber-900">Create Manager Purchase Order</p>
//                                         <p className="mt-1 text-sm text-amber-800">Choose the supplier who should receive the low-stock delivery request by email.</p>
//                                     </div>
//                                 </div>

//                                 <div className="mt-4 space-y-3">
//                                     <select
//                                         value={orderDraftSupplierId}
//                                         onChange={(event) => setOrderDraftSupplierId(event.target.value)}
//                                         className="w-full rounded-lg border border-amber-200 bg-white px-3 py-2 text-sm focus:border-amber-400 focus:outline-none"
//                                     >
//                                         <option value="">Select supplier</option>
//                                         {suppliers.map((supplier) => (
//                                             <option key={supplier._id} value={supplier._id}>
//                                                 {supplier.name} {supplier.email ? `- ${supplier.email}` : ''}
//                                             </option>
//                                         ))}
//                                     </select>

//                                     <button
//                                         onClick={createPurchaseOrder}
//                                         disabled={creatingOrder || !orderDraftSupplierId}
//                                         className="w-full rounded-lg bg-amber-500 px-4 py-2 text-sm font-semibold text-white hover:bg-amber-600 disabled:opacity-60"
//                                     >
//                                         {creatingOrder ? 'Sending Order...' : 'Send Purchase Order Email'}
//                                     </button>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 )}
//             </section>

//             <section className="space-y-4">
//                 <div className="flex items-center justify-between">
//                     <h2 className="text-lg font-semibold text-gray-900">Suppliers</h2>
//                     <p className="text-sm text-gray-500">Manager can open any supplier to check pending, accepted, rejected, and delivered orders.</p>
//                 </div>

//                 {suppliers.length === 0 ? (
//                     <EmptyState icon="🚚" message="No suppliers added yet." />
//                 ) : (
//                     <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
//                         {suppliers.map((supplier) => {
//                             const supplierOrders = supplierOrderMap.get(supplier._id) || [];
//                             const supplierPending = supplierOrders.filter((order) => order.status === 'pending').length;
//                             const supplierAccepted = supplierOrders.filter((order) => order.status === 'accepted').length;
//                             const supplierDelivered = supplierOrders.filter((order) => order.status === 'delivered').length;

//                             return (
//                                 <div key={supplier._id} className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
//                                     <div className="flex items-start justify-between">
//                                         <div className="flex items-center gap-3">
//                                             <div className="rounded-xl bg-amber-100 p-2 text-amber-700">
//                                                 <Truck size={18} />
//                                             </div>
//                                             <div>
//                                                 <h3 className="font-semibold text-gray-900">{supplier.name}</h3>
//                                                 <p className="text-xs text-gray-500">{supplier.contactName || 'No contact name'}</p>
//                                             </div>
//                                         </div>
//                                         <div className="flex gap-1">
//                                             <button onClick={() => setSelectedOrderSupplier(supplier)} className="rounded-lg p-2 text-green-600 hover:bg-green-50" title="View supplier orders">
//                                                 <Package size={15} />
//                                             </button>
//                                             <button onClick={() => openEditSupplier(supplier)} className="rounded-lg p-2 text-blue-600 hover:bg-blue-50" title="Edit supplier">
//                                                 <Edit2 size={15} />
//                                             </button>
//                                             <button onClick={() => setDeleteTarget(supplier)} className="rounded-lg p-2 text-red-600 hover:bg-red-50" title="Delete supplier">
//                                                 <Trash2 size={15} />
//                                             </button>
//                                         </div>
//                                     </div>

//                                     <div className="mt-4 space-y-2 text-sm text-gray-600">
//                                         <div className="flex items-center gap-2">
//                                             <Phone size={14} className="text-gray-400" />
//                                             <span>{supplier.phone || 'No phone'}</span>
//                                         </div>
//                                         <div className="flex items-center gap-2">
//                                             <Mail size={14} className="text-gray-400" />
//                                             <span>{supplier.email || 'No email'}</span>
//                                         </div>
//                                     </div>

//                                     <div className="mt-4 grid grid-cols-3 gap-2 text-center text-xs">
//                                         <div className="rounded-lg bg-amber-50 px-2 py-3 text-amber-700"><div className="font-bold">{supplierPending}</div><div>Pending</div></div>
//                                         <div className="rounded-lg bg-blue-50 px-2 py-3 text-blue-700"><div className="font-bold">{supplierAccepted}</div><div>Accepted</div></div>
//                                         <div className="rounded-lg bg-green-50 px-2 py-3 text-green-700"><div className="font-bold">{supplierDelivered}</div><div>Delivered</div></div>
//                                     </div>

//                                     {supplier.ingredients?.length > 0 && (
//                                         <div className="mt-4 flex flex-wrap gap-2">
//                                             {supplier.ingredients.map((ingredient) => (
//                                                 <span key={ingredient} className="rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-600">
//                                                     {ingredient}
//                                                 </span>
//                                             ))}
//                                         </div>
//                                     )}
//                                 </div>
//                             );
//                         })}
//                     </div>
//                 )}
//             </section>

//             {showSupplierModal && (
//                 <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setShowSupplierModal(false)}>
//                     <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl" onClick={(event) => event.stopPropagation()}>
//                         <div className="flex items-center justify-between border-b border-gray-100 p-5">
//                             <h2 className="text-xl font-bold text-gray-900">{editingSupplier ? 'Edit Supplier' : 'Add Supplier'}</h2>
//                             <button onClick={() => setShowSupplierModal(false)} className="rounded-lg p-2 text-gray-500 hover:bg-gray-100">
//                                 <X size={18} />
//                             </button>
//                         </div>

//                         <form onSubmit={saveSupplier} className="space-y-4 p-5">
//                             <input type="text" value={supplierForm.name} onChange={(event) => setSupplierForm((current) => ({ ...current, name: event.target.value }))} placeholder="Supplier name" className="w-full rounded-lg border border-gray-200 px-3 py-2 focus:border-amber-400 focus:outline-none" required />
//                             <input type="text" value={supplierForm.contactName} onChange={(event) => setSupplierForm((current) => ({ ...current, contactName: event.target.value }))} placeholder="Contact person" className="w-full rounded-lg border border-gray-200 px-3 py-2 focus:border-amber-400 focus:outline-none" />
//                             <div className="grid grid-cols-2 gap-3">
//                                 <input type="text" value={supplierForm.phone} onChange={(event) => setSupplierForm((current) => ({ ...current, phone: event.target.value }))} placeholder="Phone" className="w-full rounded-lg border border-gray-200 px-3 py-2 focus:border-amber-400 focus:outline-none" />
//                                 <input type="email" value={supplierForm.email} onChange={(event) => setSupplierForm((current) => ({ ...current, email: event.target.value }))} placeholder="Email" className="w-full rounded-lg border border-gray-200 px-3 py-2 focus:border-amber-400 focus:outline-none" />
//                             </div>
//                             <input type="text" value={supplierForm.ingredients} onChange={(event) => setSupplierForm((current) => ({ ...current, ingredients: event.target.value }))} placeholder="Ingredients supplied, comma separated" className="w-full rounded-lg border border-gray-200 px-3 py-2 focus:border-amber-400 focus:outline-none" />

//                             <div className="flex justify-end gap-3 pt-2">
//                                 <button type="button" onClick={() => setShowSupplierModal(false)} className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50">Cancel</button>
//                                 <button type="submit" disabled={savingSupplier} className="rounded-lg bg-amber-500 px-4 py-2 text-sm font-semibold text-white hover:bg-amber-600 disabled:opacity-60">
//                                     {savingSupplier ? 'Saving...' : editingSupplier ? 'Update Supplier' : 'Add Supplier'}
//                                 </button>
//                             </div>
//                         </form>
//                     </div>
//                 </div>
//             )}

//             {selectedOrderSupplier && (
//                 <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setSelectedOrderSupplier(null)}>
//                     <div className="w-full max-w-3xl rounded-2xl bg-white shadow-2xl" onClick={(event) => event.stopPropagation()}>
//                         <div className="flex items-center justify-between border-b border-gray-100 p-5">
//                             <div>
//                                 <h2 className="text-xl font-bold text-gray-900">{selectedOrderSupplier.name} Orders</h2>
//                                 <p className="text-sm text-gray-500">Accepted supplier orders can be confirmed as delivered here.</p>
//                             </div>
//                             <button onClick={() => setSelectedOrderSupplier(null)} className="rounded-lg p-2 text-gray-500 hover:bg-gray-100">
//                                 <X size={18} />
//                             </button>
//                         </div>

//                         <div className="max-h-[75vh] space-y-4 overflow-y-auto p-5">
//                             {selectedSupplierOrders.length === 0 ? (
//                                 <EmptyState icon="📦" message="No purchase orders for this supplier yet." />
//                             ) : (
//                                 selectedSupplierOrders.map((order) => (
//                                     <div key={order._id} className="rounded-xl border border-gray-200 p-4">
//                                         <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
//                                             <div>
//                                                 <div className="flex items-center gap-2">
//                                                     <span className="font-mono font-bold text-amber-600">{order.orderNumber}</span>
//                                                     <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${getStatusClasses(order.status)}`}>{order.status}</span>
//                                                 </div>
//                                                 <p className="mt-2 text-sm text-gray-500">Created {new Date(order.createdAt).toLocaleString()}</p>
//                                                 {order.acceptedAt && <p className="text-sm text-blue-600">Supplier accepted: {new Date(order.acceptedAt).toLocaleString()}</p>}
//                                                 {order.deliveredAt && <p className="text-sm text-green-600">Delivered: {new Date(order.deliveredAt).toLocaleString()}</p>}
//                                                 {order.rejectionReason && <p className="text-sm text-red-600">Rejection reason: {order.rejectionReason}</p>}
//                                             </div>
//                                             <div className="text-right">
//                                                 <p className="text-lg font-bold text-gray-900">{formatCurrency(order.totalAmount)}</p>
//                                                 {['accepted', 'processing', 'shipped'].includes(order.status) && (
//                                                     <button onClick={() => confirmDelivery(order._id)} disabled={deliveringOrderId === order._id} className="mt-3 rounded-lg bg-green-500 px-4 py-2 text-sm font-semibold text-white hover:bg-green-600 disabled:opacity-60">
//                                                         {deliveringOrderId === order._id ? 'Updating...' : 'Confirm Delivery'}
//                                                     </button>
//                                                 )}
//                                             </div>
//                                         </div>

//                                         <div className="mt-4 grid gap-2 md:grid-cols-2">
//                                             {order.items.map((item) => (
//                                                 <div key={`${order._id}-${item.inventoryItem?._id || item.itemName}`} className="rounded-lg bg-gray-50 px-3 py-2 text-sm">
//                                                     <div className="font-medium text-gray-900">{item.itemName}</div>
//                                                     <div className="text-gray-500">{item.quantity} {item.unit} • {formatCurrency(item.price)}</div>
//                                                 </div>
//                                             ))}
//                                         </div>
//                                     </div>
//                                 ))
//                             )}
//                         </div>
//                     </div>
//                 </div>
//             )}

//             {deleteTarget && (
//                 <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setDeleteTarget(null)}>
//                     <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl" onClick={(event) => event.stopPropagation()}>
//                         <div className="border-b border-gray-100 p-5">
//                             <h2 className="text-xl font-bold text-gray-900">Delete Supplier</h2>
//                         </div>
//                         <div className="space-y-3 p-5">
//                             <p className="text-gray-700">Delete <span className="font-semibold">{deleteTarget.name}</span>?</p>
//                             <p className="text-sm text-gray-500">This removes the supplier record. Existing purchase orders will remain in history.</p>
//                         </div>
//                         <div className="flex justify-end gap-3 border-t border-gray-100 p-5">
//                             <button onClick={() => setDeleteTarget(null)} className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50">Cancel</button>
//                             <button onClick={deleteSupplier} disabled={deleting} className="rounded-lg bg-red-500 px-4 py-2 text-sm font-semibold text-white hover:bg-red-600 disabled:opacity-60">
//                                 {deleting ? 'Deleting...' : 'Delete Supplier'}
//                             </button>
//                         </div>
//                     </div>
//                 </div>
//             )}
//         </div>
//     );
// }
