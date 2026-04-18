import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { LoadingSpinner, EmptyState } from '../../components/shared/StatusBadge';
import { Plus, Edit2, Trash2, Calendar, Tag, Percent, X, Save } from 'lucide-react';
import toast from 'react-hot-toast';

const EMPTY_PROMO = { 
    code: '', 
    type: 'percentage', 
    value: '', 
    minOrderAmount: '', 
    startDate: '', 
    endDate: '', 
    description: '',
    isActive: true 
};

export default function PromotionManagement() {
    const [promos, setPromos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editing, setEditing] = useState(null);
    const [form, setForm] = useState(EMPTY_PROMO);
    const [saving, setSaving] = useState(false);
    const [deleteConfirm, setDeleteConfirm] = useState(null);
    const [deleting, setDeleting] = useState(false);
    const [error, setError] = useState('');

    const fetchPromos = async () => {
        setLoading(true);
        try {
            const res = await api.get('/manager/promotions');
            setPromos(Array.isArray(res.data) ? res.data : []);
            setError('');
        } catch (err) { 
            console.error(err);
            setError('Failed to load promotions');
        }
        finally { setLoading(false); }
    };

    useEffect(() => { fetchPromos(); }, []);

    const openCreate = () => {
        setEditing(null);
        setForm(EMPTY_PROMO);
        setError('');
        setShowModal(true);
    };

    const openEdit = (promo) => {
        setEditing(promo);
        setForm({
            code: promo.code || '',
            type: promo.type || 'percentage',
            value: promo.value || '',
            minOrderAmount: promo.minOrderAmount || '',
            startDate: promo.startDate ? promo.startDate.slice(0, 10) : '',
            endDate: promo.endDate ? promo.endDate.slice(0, 10) : '',
            description: promo.description || '',
            isActive: promo.isActive ?? true,
        });
        setError('');
        setShowModal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setError('');
        
        // Validation
        if (!form.code.trim()) {
            toast.error('Promotion code is required');
            setSaving(false);
            return;
        }
        if (!form.value || Number(form.value) <= 0) {
            toast.error('Valid discount value is required');
            setSaving(false);
            return;
        }
        
        try {
            const payload = {
                code: form.code.toUpperCase().trim(),
                type: form.type,
                value: Number(form.value),
                minOrderAmount: Number(form.minOrderAmount) || 0,
                startDate: form.startDate || null,
                endDate: form.endDate || null,
                description: form.description?.trim() || '',
                isActive: form.isActive,
            };
            
            if (editing) {
                await api.put(`/manager/promotions/${editing._id}`, payload);
                toast.success('Promotion updated successfully');
            } else {
                await api.post('/manager/promotions', payload);
                toast.success('Promotion created successfully');
            }
            setShowModal(false);
            fetchPromos();
        } catch (err) { 
            const msg = err.response?.data?.message || 'Failed to save promotion';
            setError(msg);
            toast.error(msg);
        } finally { 
            setSaving(false); 
        }
    };

    const togglePromo = async (promo) => {
        try {
            await api.patch(`/manager/promotions/${promo._id}/toggle`, { isActive: !promo.isActive });
            toast.success(`Promotion ${!promo.isActive ? 'activated' : 'deactivated'} successfully`);
            fetchPromos();
        } catch (err) { 
            toast.error('Failed to update promotion status');
        }
    };

    const handleDelete = async () => {
        if (!deleteConfirm) return;
        setDeleting(true);
        try {
            await api.delete(`/manager/promotions/${deleteConfirm._id}`);
            toast.success('Promotion deleted successfully');
            setDeleteConfirm(null);
            fetchPromos();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to delete promotion');
        } finally {
            setDeleting(false);
        }
    };

    const isExpired = (promo) => {
        if (!promo.endDate) return false;
        return new Date(promo.endDate) < new Date();
    };

    const formatDate = (dateString) => {
        if (!dateString) return '';
        return new Date(dateString).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Promotions & Discounts</h1>
                    <p className="text-sm text-gray-500 mt-1">Manage coupons and special offers</p>
                </div>
                <button 
                    onClick={openCreate} 
                    className="flex items-center gap-2 px-4 py-2 bg-amber-500 text-white rounded-lg text-sm font-semibold hover:bg-amber-600 transition"
                >
                    <Plus size={16} /> Add Offer
                </button>
            </div>

            {/* Error */}
            {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex justify-between items-center">
                    <span className="text-sm text-red-600">{error}</span>
                    <button onClick={() => setError('')} className="text-red-500">×</button>
                </div>
            )}

            {/* Promotions Grid */}
            {loading ? (
                <LoadingSpinner />
            ) : promos.length === 0 ? (
                <EmptyState icon="🎟️" message="No promotions yet. Click 'Add Offer' to create one." />
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {promos.map(promo => {
                        const expired = isExpired(promo);
                        const isActive = promo.isActive && !expired;
                        
                        return (
                            <div 
                                key={promo._id} 
                                className={`bg-white rounded-xl border transition-all hover:shadow-md ${
                                    !isActive ? 'border-gray-200 opacity-60' : 'border-gray-200'
                                }`}
                            >
                                <div className="p-5">
                                    {/* Header */}
                                    <div className="flex justify-between items-start mb-3">
                                        <div className="flex items-center gap-2">
                                            <span className="font-mono text-sm font-bold bg-amber-100 text-amber-700 px-2 py-1 rounded-lg">
                                                {promo.code}
                                            </span>
                                            {expired && (
                                                <span className="text-xs text-red-600 bg-red-50 px-2 py-0.5 rounded-full">Expired</span>
                                            )}
                                        </div>
                                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                            isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                                        }`}>
                                            {isActive ? 'Active' : 'Inactive'}
                                        </span>
                                    </div>

                                    {/* Discount Value */}
                                    <p className="text-xl font-bold text-amber-600">
                                        {promo.type === 'percentage' ? `${promo.value}% OFF` : `₹${promo.value} OFF`}
                                    </p>
                                    
                                    {/* Min Order */}
                                    {promo.minOrderAmount > 0 && (
                                        <p className="text-xs text-gray-500 mt-1">Min order: ₹{promo.minOrderAmount}</p>
                                    )}
                                    
                                    {/* Description */}
                                    {promo.description && (
                                        <p className="text-sm text-gray-600 mt-3">{promo.description}</p>
                                    )}
                                    
                                    {/* Date Range */}
                                    {(promo.startDate || promo.endDate) && (
                                        <div className="flex items-center gap-2 mt-3 text-xs text-gray-400">
                                            <Calendar size={12} />
                                            {formatDate(promo.startDate)} - {formatDate(promo.endDate)}
                                        </div>
                                    )}
                                    
                                    {/* Usage Count */}
                                    <p className="text-xs text-gray-400 mt-2">Used {promo.usageCount || 0} times</p>
                                    
                                    {/* Actions */}
                                    <div className="flex gap-2 mt-4">
                                        <button
                                            onClick={() => openEdit(promo)}
                                            className="flex-1 px-3 py-1.5 border border-blue-300 text-blue-600 rounded-lg text-sm font-medium hover:bg-blue-50 transition"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => togglePromo(promo)}
                                            className={`flex-1 px-3 py-1.5 border rounded-lg text-sm font-medium transition ${
                                                isActive 
                                                    ? 'border-red-300 text-red-600 hover:bg-red-50' 
                                                    : 'border-green-300 text-green-600 hover:bg-green-50'
                                            }`}
                                        >
                                            {isActive ? 'Disable' : 'Enable'}
                                        </button>
                                        <button
                                            onClick={() => setDeleteConfirm(promo)}
                                            className="px-3 py-1.5 border border-red-300 text-red-600 rounded-lg text-sm font-medium hover:bg-red-50 transition"
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Add/Edit Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={() => setShowModal(false)}>
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
                        <div className="flex justify-between items-center p-5 border-b border-gray-200">
                            <h2 className="text-xl font-bold text-gray-900">
                                {editing ? 'Edit Promotion' : 'Add New Offer'}
                            </h2>
                            <button onClick={() => setShowModal(false)} className="p-1 hover:bg-gray-100 rounded-lg">
                                <X size={18} />
                            </button>
                        </div>
                        
                        <form onSubmit={handleSubmit}>
                            <div className="p-5 space-y-4">
                                {/* Coupon Code */}
                                <div>
                                    <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">
                                        Coupon Code <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-amber-400 uppercase"
                                        placeholder="e.g. SAVE10"
                                        value={form.code}
                                        onChange={e => setForm({ ...form, code: e.target.value.toUpperCase() })}
                                        required
                                    />
                                </div>

                                {/* Type and Value */}
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Discount Type</label>
                                        <select
                                            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-amber-400"
                                            value={form.type}
                                            onChange={e => setForm({ ...form, type: e.target.value })}
                                        >
                                            <option value="percentage">% Percentage</option>
                                            <option value="fixed">₹ Fixed Amount</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">
                                            Value <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="number"
                                            min="0"
                                            step="0.01"
                                            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-amber-400"
                                            placeholder={form.type === 'percentage' ? 'e.g. 10' : 'e.g. 50'}
                                            value={form.value}
                                            onChange={e => setForm({ ...form, value: e.target.value })}
                                            required
                                        />
                                    </div>
                                </div>

                                {/* Min Order Amount */}
                                <div>
                                    <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Minimum Order Amount (₹)</label>
                                    <input
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-amber-400"
                                        placeholder="e.g. 199"
                                        value={form.minOrderAmount}
                                        onChange={e => setForm({ ...form, minOrderAmount: e.target.value })}
                                    />
                                </div>

                                {/* Date Range */}
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Start Date</label>
                                        <input
                                            type="date"
                                            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-amber-400"
                                            value={form.startDate}
                                            onChange={e => setForm({ ...form, startDate: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">End Date</label>
                                        <input
                                            type="date"
                                            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-amber-400"
                                            value={form.endDate}
                                            onChange={e => setForm({ ...form, endDate: e.target.value })}
                                        />
                                    </div>
                                </div>

                                {/* Description */}
                                <div>
                                    <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Description</label>
                                    <textarea
                                        rows={2}
                                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-amber-400 resize-none"
                                        placeholder="Describe the offer..."
                                        value={form.description}
                                        onChange={e => setForm({ ...form, description: e.target.value })}
                                    />
                                </div>

                                {/* Active Status */}
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={form.isActive}
                                        onChange={e => setForm({ ...form, isActive: e.target.checked })}
                                    />
                                    <span className="text-sm text-gray-700">Active (visible to customers)</span>
                                </label>
                            </div>

                            <div className="flex justify-end gap-3 p-5 border-t border-gray-200">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="px-4 py-2 border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 transition"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 disabled:opacity-50 transition"
                                >
                                    {saving ? 'Saving...' : editing ? 'Update Offer' : 'Add Offer'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {deleteConfirm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={() => setDeleteConfirm(null)}>
                    <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full" onClick={e => e.stopPropagation()}>
                        <div className="p-5 border-b border-gray-200">
                            <h2 className="text-xl font-bold text-gray-900">Delete Promotion</h2>
                        </div>
                        <div className="p-5">
                            <p className="text-gray-700">Are you sure you want to delete <span className="font-semibold">{deleteConfirm.code}</span>?</p>
                            <p className="text-sm text-gray-500 mt-2">This action cannot be undone.</p>
                        </div>
                        <div className="flex justify-end gap-3 p-5 border-t border-gray-200">
                            <button
                                onClick={() => setDeleteConfirm(null)}
                                className="px-4 py-2 border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 transition"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDelete}
                                disabled={deleting}
                                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50 transition"
                            >
                                {deleting ? 'Deleting...' : 'Yes, Delete'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}