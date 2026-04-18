import React, { useEffect, useMemo, useState } from 'react';
import api from '../../services/api';
import { LoadingSpinner, EmptyState } from '../../components/shared/StatusBadge';
import { Plus, AlertTriangle, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import toast from 'react-hot-toast';

const UNITS = ['kg', 'g', 'L', 'ml', 'pcs', 'dozen', 'box', 'bag', 'bottle'];
const DEFAULT_CATEGORIES = ['All', 'Vegetables', 'Dairy', 'Bakery', 'Beverages', 'Sauces', 'Dry Goods', 'Frozen', 'Packaging', 'Cleaning', 'Other'];
const EMPTY = { name: '', category: 'Other', currentStock: '', unit: 'kg', reorderLevel: '', supplier: '' };

export default function InventoryManagement() {
    const [items, setItems] = useState([]);
    const [suppliers, setSuppliers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editing, setEditing] = useState(null);
    const [form, setForm] = useState(EMPTY);
    const [stockModal, setStockModal] = useState(null);
    const [stockQty, setStockQty] = useState('');
    const [stockNote, setStockNote] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [deleteConfirm, setDeleteConfirm] = useState(null);
    const [deleting, setDeleting] = useState(false);

    const fetchAll = async () => {
        setLoading(true);
        try {
            const [invRes, supRes] = await Promise.all([
                api.get('/manager/inventory'),
                api.get('/manager/suppliers')
            ]);
            const inventoryItems = invRes.data?.inventory || invRes.data?.ingredients || invRes.data || [];
            setItems(inventoryItems.map((item) => ({ ...item, category: item.category || 'Other' })));
            setSuppliers(Array.isArray(supRes.data) ? supRes.data : supRes.data?.suppliers || []);
            setError('');
        } catch (err) {
            setError('Failed to load inventory.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchAll(); }, []);

    const categoryOptions = useMemo(() => {
        const categories = new Set(DEFAULT_CATEGORIES);
        items.forEach((item) => categories.add(item.category || 'Other'));
        return Array.from(categories);
    }, [items]);

    const filteredItems = useMemo(() => {
        return items
            .filter((item) => {
                const matchesSearch = item.name?.toLowerCase().includes(searchTerm.toLowerCase());
                const matchesCategory = selectedCategory === 'All' || (item.category || 'Other') === selectedCategory;
                return matchesSearch && matchesCategory;
            })
            .sort((a, b) => {
                const categoryCompare = String(a.category || 'Other').localeCompare(String(b.category || 'Other'));
                if (categoryCompare !== 0) return categoryCompare;
                return String(a.name || '').localeCompare(String(b.name || ''));
            });
    }, [items, searchTerm, selectedCategory]);

    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, selectedCategory]);

    const totalItems = filteredItems.length;
    const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));
    const paginatedItems = filteredItems.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    const lowStockCount = items.filter((item) => item.currentStock <= item.reorderLevel).length;
    const visibleLowStockCount = filteredItems.filter((item) => item.currentStock <= item.reorderLevel).length;

    const openCreate = () => {
        setEditing(null);
        setForm(EMPTY);
        setShowModal(true);
    };

    const openEdit = (item) => {
        setEditing(item);
        setForm({
            name: item.name || '',
            category: item.category || 'Other',
            currentStock: item.currentStock || '',
            unit: item.unit || 'kg',
            reorderLevel: item.reorderLevel || '',
            supplier: item.supplier?._id || item.supplier || '',
        });
        setShowModal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setError('');
        try {
            const payload = {
                name: form.name?.trim(),
                category: form.category || 'Other',
                currentStock: Number(form.currentStock),
                unit: form.unit,
                reorderLevel: Number(form.reorderLevel) || 0,
                supplier: form.supplier || null,
            };
            if (editing) {
                await api.put(`/manager/inventory/${editing._id}`, payload);
                toast.success('Item updated successfully');
            } else {
                await api.post('/manager/inventory', payload);
                toast.success('Item added successfully');
            }
            setShowModal(false);
            fetchAll();
        } catch (err) {
            const msg = err.response?.data?.message || 'Failed to save item';
            setError(msg);
            toast.error(msg);
        } finally {
            setSaving(false);
        }
    };

    const handleStockUpdate = async () => {
        if (!stockQty) {
            toast.error('Please enter quantity');
            return;
        }
        try {
            await api.patch(`/manager/inventory/${stockModal._id}/stock`, {
                quantity: Number(stockQty),
                note: stockNote
            });
            toast.success('Stock updated successfully');
            setStockModal(null);
            setStockQty('');
            setStockNote('');
            fetchAll();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to update stock');
        }
    };

    const handleDelete = async () => {
        if (!deleteConfirm) return;
        setDeleting(true);
        try {
            await api.delete(`/manager/inventory/${deleteConfirm._id}`);
            toast.success('Item deleted successfully');
            setDeleteConfirm(null);
            fetchAll();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to delete item');
        } finally {
            setDeleting(false);
        }
    };

    const getSupplierName = (supplierValue) => {
        if (supplierValue?.name) return supplierValue.name;
        const supplier = suppliers.find((s) => s._id === supplierValue);
        return supplier?.name || '-';
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Inventory Management</h1>
                    <p className="text-sm text-gray-500 mt-1">{items.length} items tracked · {lowStockCount} low stock</p>
                </div>
                <button onClick={openCreate} className="flex items-center gap-2 px-4 py-2 bg-amber-500 text-white rounded-lg text-sm font-semibold hover:bg-amber-600 transition">
                    <Plus size={16} /> Add Item
                </button>
            </div>

            {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex justify-between items-center">
                    <span className="text-sm text-red-600">{error}</span>
                    <button onClick={() => setError('')} className="text-red-500">×</button>
                </div>
            )}

            {lowStockCount > 0 && (
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 flex items-center gap-2">
                    <AlertTriangle size={16} className="text-amber-600" />
                    <span className="text-sm text-amber-700"><strong>{lowStockCount} item(s)</strong> are at or below reorder level.</span>
                </div>
            )}

            <div className="relative max-w-sm w-full">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                    type="text"
                    placeholder="Search inventory..."
                    className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-amber-400"
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                />
            </div>

            <div className="flex flex-wrap gap-2">
                {categoryOptions.map((category) => (
                    <button
                        key={category}
                        type="button"
                        onClick={() => setSelectedCategory(category)}
                        className={`rounded-full px-3 py-1.5 text-sm font-semibold transition ${selectedCategory === category ? 'bg-amber-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                    >
                        {category}
                    </button>
                ))}
            </div>

            {loading ? (
                <LoadingSpinner />
            ) : filteredItems.length === 0 ? (
                <EmptyState icon="📦" message="No inventory items found" />
            ) : (
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                    <div className="flex items-center justify-between border-b border-gray-200 bg-gray-50 px-4 py-3">
                        <div>
                            <h3 className="font-semibold text-gray-900">{selectedCategory === 'All' ? 'All Inventory Items' : `${selectedCategory} Inventory`}</h3>
                            <p className="text-xs text-gray-500">Search first, then category filter, then paginated inventory table</p>
                        </div>
                        <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-gray-600 shadow-sm">
                            {visibleLowStockCount} low stock
                        </span>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-white">
                                <tr className="text-gray-600">
                                    <th className="px-4 py-3 text-left">Item</th>
                                    <th className="px-4 py-3 text-left">Category</th>
                                    <th className="px-4 py-3 text-left">Current Stock</th>
                                    <th className="px-4 py-3 text-left">Unit</th>
                                    <th className="px-4 py-3 text-left">Reorder Level</th>
                                    {/* <th className="px-4 py-3 text-left">Supplier</th> */}
                                    <th className="px-4 py-3 text-left">Status</th>
                                    <th className="px-4 py-3 text-left">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {paginatedItems.map(item => {
                                    const isLow = item.currentStock <= item.reorderLevel;
                                    return (
                                        <tr key={item._id} className={isLow ? 'bg-red-50/30 hover:bg-red-50/50' : 'hover:bg-gray-50'}>
                                            <td className="px-4 py-3 font-medium text-gray-900">{item.name}</td>
                                            <td className="px-4 py-3 text-gray-500">{item.category || 'Other'}</td>
                                            <td className="px-4 py-3">
                                                <span className={`font-semibold ${isLow ? 'text-red-600' : 'text-green-600'}`}>
                                                    {item.currentStock}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-gray-500">{item.unit}</td>
                                            <td className="px-4 py-3 text-gray-500">{item.reorderLevel}</td>
                                            {/* <td className="px-4 py-3 text-gray-500">{getSupplierName(item.supplier)}</td> */}
                                            <td className="px-4 py-3">
                                                {isLow ? (
                                                    <span className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs">Low Stock</span>
                                                ) : (
                                                    <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs">OK</span>
                                                )}
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => { setStockModal(item); setStockQty(''); setStockNote(''); }}
                                                        className="px-2 py-1 bg-blue-50 text-blue-600 rounded-lg text-xs hover:bg-blue-100 transition"
                                                    >
                                                        +Stock
                                                    </button>
                                                    <button
                                                        onClick={() => openEdit(item)}
                                                        className="px-2 py-1 bg-gray-100 text-gray-600 rounded-lg text-xs hover:bg-gray-200 transition"
                                                    >
                                                        Edit
                                                    </button>
                                                    <button
                                                        onClick={() => setDeleteConfirm(item)}
                                                        className="px-2 py-1 bg-red-50 text-red-600 rounded-lg text-xs hover:bg-red-100 transition"
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                    <div className="flex flex-col gap-3 border-t border-gray-200 bg-gray-50 px-4 py-3 md:flex-row md:items-center md:justify-between">
                        <div className="flex items-center gap-3 text-sm text-gray-500">
                            <span>Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems}</span>
                            <select
                                value={itemsPerPage}
                                onChange={(e) => setItemsPerPage(Number(e.target.value))}
                                className="px-2 py-1 border border-gray-200 rounded-lg text-sm bg-white"
                            >
                                <option value={10}>10 / page</option>
                                <option value={20}>20 / page</option>
                                <option value={30}>30 / page</option>
                            </select>
                        </div>
                        <div className="flex items-center gap-2">
                            <button
                                type="button"
                                disabled={currentPage === 1}
                                onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
                                className="flex items-center gap-1 px-3 py-1.5 border border-gray-200 rounded-lg text-sm disabled:opacity-50 hover:bg-white transition"
                            >
                                <ChevronLeft size={14} /> Prev
                            </button>
                            <span className="px-3 py-1.5 text-sm font-semibold text-gray-700">Page {currentPage} / {totalPages}</span>
                            <button
                                type="button"
                                disabled={currentPage === totalPages}
                                onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
                                className="flex items-center gap-1 px-3 py-1.5 border border-gray-200 rounded-lg text-sm disabled:opacity-50 hover:bg-white transition"
                            >
                                Next <ChevronRight size={14} />
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={() => setShowModal(false)}>
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
                        <div className="flex justify-between items-center p-5 border-b border-gray-200">
                            <h2 className="text-xl font-bold text-gray-900">{editing ? 'Edit Inventory Item' : 'Add Inventory Item'}</h2>
                            <button onClick={() => setShowModal(false)} className="p-1 hover:bg-gray-100 rounded-lg">×</button>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="p-5 space-y-4">
                                <div>
                                    <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Item Name <span className="text-red-500">*</span></label>
                                    <input
                                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-amber-400"
                                        value={form.name}
                                        onChange={e => setForm({ ...form, name: e.target.value })}
                                        required
                                        placeholder="e.g. Basmati Rice"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Category</label>
                                    <select
                                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-amber-400"
                                        value={form.category}
                                        onChange={e => setForm({ ...form, category: e.target.value })}
                                    >
                                        {categoryOptions.filter((category) => category !== 'All').map(category => <option key={category} value={category}>{category}</option>)}
                                    </select>
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Current Stock <span className="text-red-500">*</span></label>
                                        <input
                                            type="number"
                                            min="0"
                                            step="0.01"
                                            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-amber-400"
                                            value={form.currentStock}
                                            onChange={e => setForm({ ...form, currentStock: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Unit <span className="text-red-500">*</span></label>
                                        <select
                                            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-amber-400"
                                            value={form.unit}
                                            onChange={e => setForm({ ...form, unit: e.target.value })}
                                            required
                                        >
                                            {UNITS.map(u => <option key={u}>{u}</option>)}
                                        </select>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Reorder Level</label>
                                        <input
                                            type="number"
                                            min="0"
                                            step="0.01"
                                            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-amber-400"
                                            value={form.reorderLevel}
                                            onChange={e => setForm({ ...form, reorderLevel: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Supplier</label>
                                        <select
                                            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-amber-400"
                                            value={form.supplier}
                                            onChange={e => setForm({ ...form, supplier: e.target.value })}
                                        >
                                            <option value="">Select supplier...</option>
                                            {suppliers.map(s => <option key={s._id} value={s._id}>{s.name}</option>)}
                                        </select>
                                    </div>
                                </div>
                            </div>
                            <div className="flex justify-end gap-3 p-5 border-t border-gray-200">
                                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 transition">Cancel</button>
                                <button type="submit" disabled={saving} className="px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 disabled:opacity-50 transition">
                                    {saving ? 'Saving...' : editing ? 'Update Item' : 'Add Item'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {stockModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={() => setStockModal(null)}>
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md" onClick={e => e.stopPropagation()}>
                        <div className="flex justify-between items-center p-5 border-b border-gray-200">
                            <h2 className="text-xl font-bold text-gray-900">Update Stock: {stockModal.name}</h2>
                            <button onClick={() => setStockModal(null)} className="p-1 hover:bg-gray-100 rounded-lg">×</button>
                        </div>
                        <div className="p-5 space-y-4">
                            <p className="text-sm text-gray-600">Current stock: <strong>{stockModal.currentStock} {stockModal.unit}</strong></p>
                            <div>
                                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Quantity to Add/Remove</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-amber-400"
                                    placeholder="e.g. 5 or -2"
                                    value={stockQty}
                                    onChange={e => setStockQty(e.target.value)}
                                />
                                <p className="text-xs text-gray-400 mt-1">Use positive to add, negative to deduct (e.g. -2)</p>
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Note (Optional)</label>
                                <input
                                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-amber-400"
                                    placeholder="e.g. New delivery from supplier"
                                    value={stockNote}
                                    onChange={e => setStockNote(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="flex justify-end gap-3 p-5 border-t border-gray-200">
                            <button onClick={() => setStockModal(null)} className="px-4 py-2 border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 transition">Cancel</button>
                            <button onClick={handleStockUpdate} className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition">Update Stock</button>
                        </div>
                    </div>
                </div>
            )}

            {deleteConfirm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={() => setDeleteConfirm(null)}>
                    <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full" onClick={e => e.stopPropagation()}>
                        <div className="p-5 border-b border-gray-200">
                            <h2 className="text-xl font-bold text-gray-900">Delete Inventory Item</h2>
                        </div>
                        <div className="p-5">
                            <p className="text-gray-700">Are you sure you want to delete <span className="font-semibold">{deleteConfirm.name}</span>?</p>
                            <p className="text-sm text-gray-500 mt-2">This action cannot be undone.</p>
                        </div>
                        <div className="flex justify-end gap-3 p-5 border-t border-gray-200">
                            <button onClick={() => setDeleteConfirm(null)} className="px-4 py-2 border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 transition">Cancel</button>
                            <button onClick={handleDelete} disabled={deleting} className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50 transition">
                                {deleting ? 'Deleting...' : 'Yes, Delete'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
