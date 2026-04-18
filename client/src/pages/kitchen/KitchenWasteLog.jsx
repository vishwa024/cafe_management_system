// KitchenWasteLog.jsx
import React, { useEffect, useState } from 'react';
import api from '../../services/api'; // Use your api instance instead of axios
import { LoadingSpinner, EmptyState } from '../../components/shared/StatusBadge';
import { Trash } from 'lucide-react';

const WASTE_REASONS = ['Spoiled','Dropped / Spilled','Overcooking','Wrong Order Prepared','Expired','Other'];

export function KitchenWasteLog() {
    const [logs, setLogs] = useState([]);
    const [inventory, setInventory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [form, setForm] = useState({ inventoryItemId: '', quantity: '', reason: '' });
    const [submitting, setSubmitting] = useState(false);
    const [success, setSuccess] = useState('');

    const fetchAll = async () => {
        setLoading(true);
        try {
            const [logsRes, invRes] = await Promise.all([
                api.get('/kitchen/waste'),
                api.get('/manager/inventory')
            ]);
            setLogs(logsRes.data);
            setInventory(invRes.data);
        } catch (e) { console.error(e); }
        finally { setLoading(false); }
    };

    useEffect(() => { fetchAll(); }, []);

    const handleSubmit = async (e) => {
        e.preventDefault(); 
        setSubmitting(true);
        try {
            await api.post('/kitchen/waste', form);
            setSuccess('Waste logged successfully!');
            setForm({ inventoryItemId: '', quantity: '', reason: '' });
            fetchAll();
            setTimeout(() => setSuccess(''), 3000);
        } catch (err) { 
            alert(err.response?.data?.message || 'Failed to log waste'); 
        }
        finally { setSubmitting(false); }
    };

    const totalWasted = logs.reduce((s, l) => s + (l.quantity || 0), 0);

    return (
        <div className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Log Form */}
                <div className="md:col-span-1">
                    <div className="bg-gray-50 rounded-lg border border-gray-200 p-4">
                        <h6 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                            <Trash size={16} className="text-amber-600" />
                            Log Waste
                        </h6>
                        {success && (
                            <div className="mb-3 p-2 bg-green-100 text-green-700 rounded-lg text-sm">
                                {success}
                            </div>
                        )}
                        <form onSubmit={handleSubmit} className="space-y-3">
                            <div>
                                <label className="block text-xs font-semibold text-gray-600 mb-1">
                                    Ingredient <span className="text-red-500">*</span>
                                </label>
                                <select
                                    className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-amber-400"
                                    value={form.inventoryItemId}
                                    onChange={e => setForm(f => ({ ...f, inventoryItemId: e.target.value }))}
                                    required
                                >
                                    <option value="">Select ingredient...</option>
                                    {inventory.map(item => (
                                        <option key={item._id} value={item._id}>
                                            {item.name} ({item.currentStock || item.quantity} {item.unit})
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-gray-600 mb-1">
                                    Quantity Wasted <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="number"
                                    min="0.01"
                                    step="0.01"
                                    className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-amber-400"
                                    placeholder="e.g. 0.5"
                                    value={form.quantity}
                                    onChange={e => setForm(f => ({ ...f, quantity: e.target.value }))}
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-gray-600 mb-1">
                                    Reason <span className="text-red-500">*</span>
                                </label>
                                <select
                                    className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-amber-400"
                                    value={form.reason}
                                    onChange={e => setForm(f => ({ ...f, reason: e.target.value }))}
                                    required
                                >
                                    <option value="">Select reason...</option>
                                    {WASTE_REASONS.map(r => <option key={r}>{r}</option>)}
                                </select>
                            </div>
                            <button
                                type="submit"
                                className="w-full bg-amber-500 text-white rounded-lg px-4 py-2 text-sm font-semibold hover:bg-amber-600 transition disabled:opacity-50"
                                disabled={submitting}
                            >
                                {submitting ? 'Logging...' : '🗑️ Log Waste'}
                            </button>
                        </form>
                    </div>

                    {/* Summary Card */}
                    <div className="bg-gray-50 rounded-lg border border-gray-200 p-4 mt-4 text-center">
                        <div className="text-2xl font-bold text-amber-600">{logs.length}</div>
                        <div className="text-xs text-gray-500">Total Waste Entries</div>
                        <div className="text-lg font-bold text-gray-700 mt-2">
                            {totalWasted.toFixed(1)} units wasted
                        </div>
                    </div>
                </div>

                {/* Log Table */}
                <div className="md:col-span-2">
                    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                        <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
                            <h6 className="font-semibold text-gray-900">Recent Waste Logs</h6>
                        </div>
                        {loading ? (
                            <LoadingSpinner />
                        ) : logs.length === 0 ? (
                            <EmptyState icon="✅" message="No waste logged yet" />
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead className="bg-gray-50">
                                        <tr className="text-gray-600">
                                            <th className="px-4 py-2 text-left">Ingredient</th>
                                            <th className="px-4 py-2 text-left">Qty</th>
                                            <th className="px-4 py-2 text-left">Reason</th>
                                            <th className="px-4 py-2 text-left">Logged By</th>
                                            <th className="px-4 py-2 text-left">Date</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {logs.map(log => (
                                            <tr key={log._id} className="hover:bg-gray-50">
                                                <td className="px-4 py-2 font-medium">{log.inventoryItem?.name || '—'}</td>
                                                <td className="px-4 py-2">
                                                    <span className="bg-red-100 text-red-700 px-2 py-0.5 rounded-full text-xs font-semibold">
                                                        {log.quantity} {log.unit}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-2 text-gray-600">{log.reason}</td>
                                                <td className="px-4 py-2 text-gray-600">{log.loggedBy?.name || '—'}</td>
                                                <td className="px-4 py-2 text-gray-500 text-xs">
                                                    {new Date(log.createdAt).toLocaleString()}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default KitchenWasteLog;