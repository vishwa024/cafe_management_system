// // import React, { useMemo, useState, useEffect } from 'react';
// // import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
// // import { useDispatch, useSelector } from 'react-redux';
// // import { useNavigate } from 'react-router-dom';
// // import {
// //   ChefHat,
// //   Clock3,
// //   PackageCheck,
// //   RefreshCw,
// //   Users,
// //   Eye,
// //   CheckCircle,
// //   Clock,
// //   TrendingUp,
// //   UserCheck,
// //   Bell,
// //   Grid3x3,
// //   List,
// //   ChevronLeft,
// //   ChevronRight,
// //   X,
// //   MapPin,
// //   Phone,
// //   Mail,
// //   Calendar,
// //   MessageCircle,
// //   Receipt,
// //   ShoppingBag,
// //   Truck,
// //   Home,
// //   Store,
// //   Pizza,
// //   Coffee,
// //   UtensilsCrossed,
// //   Sparkles,
// //   Layers3,
// //   AlertTriangle,
// //   ChevronDown,
// //   ChevronUp,
// //   Package,
// //   Plus,
// //   Pencil,
// //   Trash2,
// //   Save,
// //   BoxesIcon,
// //   Search,
// //   Trash,
// //   Filter,
// //   CalendarDays,
// //   LogOut,
// // } from 'lucide-react';
// // import toast from 'react-hot-toast';
// // import api from '../../services/api';
// // import presenceService from '../../services/presenceService';
// // import { logoutUser } from '../../store/slices/authSlice';
// // import { KitchenWasteLog } from './KitchenWasteLog';

// // // ─── Constants ───────────────────────────────────────────────────────────────

// // const STEP_LABELS = {
// //   placed: 'Order Placed',
// //   confirmed: 'Confirmed',
// //   preparing: 'Preparing',
// //   ready: 'Ready for Pickup',
// // };

// // const STATUS_COLORS = {
// //   placed: 'bg-orange-100 text-orange-700 border-orange-200',
// //   confirmed: 'bg-blue-100 text-blue-700 border-blue-200',
// //   preparing: 'bg-purple-100 text-purple-700 border-purple-200',
// //   ready: 'bg-green-100 text-green-700 border-green-200',
// //   completed: 'bg-emerald-100 text-emerald-700 border-emerald-200',
// //   cancelled: 'bg-red-100 text-red-700 border-red-200',
// // };

// // const ORDER_TYPE_ICONS = {
// //   'delivery': Truck,
// //   'takeaway': Home,
// //   'dine-in': Store,
// //   'pre-order': Calendar,
// // };

// // const ORDER_TYPE_LABELS = {
// //   'delivery': 'Delivery',
// //   'takeaway': 'Takeaway',
// //   'dine-in': 'Dine-in',
// //   'pre-order': 'Pre-order',
// // };

// // // Inventory Constants
// // const UNITS = ['kg', 'g', 'L', 'ml', 'pcs', 'dozen', 'box', 'bag', 'bottle'];
// // const INVENTORY_CATEGORIES = [
// //   'Vegetables',
// //   'Fruits',
// //   'Dairy',
// //   'Meat & Seafood',
// //   'Grains & Pulses',
// //   'Spices',
// //   'Oils & Condiments',
// //   'Beverages',
// //   'Other',
// // ];

// // const normalizeInventoryCategory = (value) => {
// //   const raw = String(value || '').trim().toLowerCase();
// //   if (!raw) return 'Other';
// //   const match = INVENTORY_CATEGORIES.find(
// //     (category) => category.toLowerCase() === raw
// //   );
// //   return match || 'Other';
// // };

// // // Date filter options
// // const DATE_FILTERS = {
// //   ALL: 'all',
// //   TODAY: 'today',
// //   YESTERDAY: 'yesterday',
// //   THIS_WEEK: 'this_week',
// //   LAST_WEEK: 'last_week',
// //   THIS_MONTH: 'this_month',
// //   CUSTOM: 'custom',
// // };

// // const getDateRange = (filter, customStart, customEnd) => {
// //   const now = new Date();
// //   const start = new Date();
// //   const end = new Date();
  
// //   switch(filter) {
// //     case DATE_FILTERS.ALL:
// //       return { start: null, end: null };

// //     case DATE_FILTERS.TODAY:
// //       start.setHours(0, 0, 0, 0);
// //       end.setHours(23, 59, 59, 999);
// //       return { start, end };
    
// //     case DATE_FILTERS.YESTERDAY:
// //       start.setDate(now.getDate() - 1);
// //       start.setHours(0, 0, 0, 0);
// //       end.setDate(now.getDate() - 1);
// //       end.setHours(23, 59, 59, 999);
// //       return { start, end };
    
// //     case DATE_FILTERS.THIS_WEEK:
// //       const day = now.getDay();
// //       start.setDate(now.getDate() - day);
// //       start.setHours(0, 0, 0, 0);
// //       end.setDate(start.getDate() + 6);
// //       end.setHours(23, 59, 59, 999);
// //       return { start, end };
    
// //     case DATE_FILTERS.LAST_WEEK:
// //       start.setDate(now.getDate() - now.getDay() - 7);
// //       start.setHours(0, 0, 0, 0);
// //       end.setDate(start.getDate() + 6);
// //       end.setHours(23, 59, 59, 999);
// //       return { start, end };
    
// //     case DATE_FILTERS.THIS_MONTH:
// //       start.setDate(1);
// //       start.setHours(0, 0, 0, 0);
// //       end.setMonth(now.getMonth() + 1);
// //       end.setDate(0);
// //       end.setHours(23, 59, 59, 999);
// //       return { start, end };
    
// //     case DATE_FILTERS.CUSTOM:
// //       return { start: customStart, end: customEnd };
    
// //     default:
// //       return { start: null, end: null };
// //   }
// // };

// // // Voice notification function
// // const playReadyNotification = (orderId, customerName) => {
// //   if ('speechSynthesis' in window) {
// //     const message = `Order ${orderId} for ${customerName} is ready for pickup`;
// //     const utterance = new SpeechSynthesisUtterance(message);
// //     utterance.rate = 0.9;
// //     utterance.pitch = 1;
// //     utterance.volume = 1;
// //     window.speechSynthesis.cancel();
// //     window.speechSynthesis.speak(utterance);
    
// //     try {
// //       const audioContext = new (window.AudioContext || window.webkitAudioContext)();
// //       const oscillator = audioContext.createOscillator();
// //       const gainNode = audioContext.createGain();
// //       oscillator.connect(gainNode);
// //       gainNode.connect(audioContext.destination);
// //       oscillator.frequency.value = 880;
// //       gainNode.gain.value = 0.3;
// //       oscillator.start();
// //       gainNode.gain.exponentialRampToValueAtTime(0.00001, audioContext.currentTime + 1);
// //       oscillator.stop(audioContext.currentTime + 0.5);
// //     } catch (e) {
// //       console.log('Audio beep not supported');
// //     }
// //   }
// // };

// // // ─── Inventory Form Component ────────────────────────────────────────────────

// // const EMPTY_FORM = {
// //   name: '',
// //   category: INVENTORY_CATEGORIES[0],
// //   quantity: '',
// //   unit: UNITS[0],
// //   minStock: '',
// //   supplier: '',
// //   notes: '',
// // };

// // function InventoryForm({ initial = EMPTY_FORM, onSave, onCancel, loading }) {
// //   const [form, setForm] = useState(initial);

// //   const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

// //   const handleSubmit = (e) => {
// //     e.preventDefault();
// //     if (!form.name.trim() || !form.quantity) return toast.error('Name and quantity are required');
// //     onSave(form);
// //   };

// //   return (
// //     <form onSubmit={handleSubmit} className="space-y-3">
// //       <div>
// //         <label className="mb-1 block text-xs font-semibold text-stone-500 uppercase tracking-wide">
// //           Item Name *
// //         </label>
// //         <input
// //           value={form.name}
// //           onChange={set('name')}
// //           placeholder="e.g. Basmati Rice"
// //           className="w-full rounded-xl border border-stone-200 bg-stone-50 px-3 py-2 text-sm text-slate-800 outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100"
// //         />
// //       </div>

// //       <div className="grid grid-cols-2 gap-2">
// //         <div>
// //           <label className="mb-1 block text-xs font-semibold text-stone-500 uppercase tracking-wide">
// //             Category
// //           </label>
// //           <select
// //             value={form.category}
// //             onChange={set('category')}
// //             className="w-full rounded-xl border border-stone-200 bg-stone-50 px-3 py-2 text-sm text-slate-800 outline-none focus:border-amber-400"
// //           >
// //             {INVENTORY_CATEGORIES.map((c) => (
// //               <option key={c}>{c}</option>
// //             ))}
// //           </select>
// //         </div>
// //         <div>
// //           <label className="mb-1 block text-xs font-semibold text-stone-500 uppercase tracking-wide">
// //             Unit
// //           </label>
// //           <select
// //             value={form.unit}
// //             onChange={set('unit')}
// //             className="w-full rounded-xl border border-stone-200 bg-stone-50 px-3 py-2 text-sm text-slate-800 outline-none focus:border-amber-400"
// //           >
// //             {UNITS.map((u) => (
// //               <option key={u}>{u}</option>
// //             ))}
// //           </select>
// //         </div>
// //       </div>

// //       <div className="grid grid-cols-2 gap-2">
// //         <div>
// //           <label className="mb-1 block text-xs font-semibold text-stone-500 uppercase tracking-wide">
// //             Quantity *
// //           </label>
// //           <input
// //             type="number"
// //             min="0"
// //             step="0.01"
// //             value={form.quantity}
// //             onChange={set('quantity')}
// //             placeholder="0"
// //             className="w-full rounded-xl border border-stone-200 bg-stone-50 px-3 py-2 text-sm text-slate-800 outline-none focus:border-amber-400"
// //           />
// //         </div>
// //         <div>
// //           <label className="mb-1 block text-xs font-semibold text-stone-500 uppercase tracking-wide">
// //             Min Stock
// //           </label>
// //           <input
// //             type="number"
// //             min="0"
// //             step="0.01"
// //             value={form.minStock}
// //             onChange={set('minStock')}
// //             placeholder="0"
// //             className="w-full rounded-xl border border-stone-200 bg-stone-50 px-3 py-2 text-sm text-slate-800 outline-none focus:border-amber-400"
// //           />
// //         </div>
// //       </div>

// //       <div>
// //         <label className="mb-1 block text-xs font-semibold text-stone-500 uppercase tracking-wide">
// //           Supplier
// //         </label>
// //         <input
// //           value={form.supplier}
// //           onChange={set('supplier')}
// //           placeholder="Supplier name"
// //           className="w-full rounded-xl border border-stone-200 bg-stone-50 px-3 py-2 text-sm text-slate-800 outline-none focus:border-amber-400"
// //         />
// //       </div>

// //       <div>
// //         <label className="mb-1 block text-xs font-semibold text-stone-500 uppercase tracking-wide">
// //           Notes
// //         </label>
// //         <textarea
// //           rows={2}
// //           value={form.notes}
// //           onChange={set('notes')}
// //           placeholder="Optional notes..."
// //           className="w-full rounded-xl border border-stone-200 bg-stone-50 px-3 py-2 text-sm text-slate-800 outline-none focus:border-amber-400 resize-none"
// //         />
// //       </div>

// //       <div className="flex gap-2 pt-1">
// //         <button
// //           type="submit"
// //           disabled={loading}
// //           className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-amber-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-amber-600 disabled:opacity-60"
// //         >
// //           <Save size={14} />
// //           {loading ? 'Saving…' : 'Save Item'}
// //         </button>
// //         <button
// //           type="button"
// //           onClick={onCancel}
// //           className="flex items-center justify-center gap-2 rounded-xl border border-stone-200 bg-white px-4 py-2 text-sm font-semibold text-stone-600 transition hover:bg-stone-50"
// //         >
// //           <X size={14} />
// //           Cancel
// //         </button>
// //       </div>
// //     </form>
// //   );
// // }

// // // ─── Inventory Sidebar Component ────────────────────────────────────────────

// // function InventorySidebar({ open, onClose }) {
// //   const queryClient = useQueryClient();
// //   const [mode, setMode] = useState('list');
// //   const [editTarget, setEditTarget] = useState(null);
// //   const [deleteTarget, setDeleteTarget] = useState(null);
// //   const [filterCat, setFilterCat] = useState('All');
// //   const [search, setSearch] = useState('');

// //   const inventoryQuery = useQuery({
// //     queryKey: ['kitchen-inventory'],
// //     queryFn: () => api.get('/inventory').then((r) => r.data),
// //     enabled: open,
// //   });

// //   const items = (Array.isArray(inventoryQuery.data)
// //     ? inventoryQuery.data
// //     : Array.isArray(inventoryQuery.data?.data) ? inventoryQuery.data.data
// //     : Array.isArray(inventoryQuery.data?.items) ? inventoryQuery.data.items
// //     : Array.isArray(inventoryQuery.data?.inventory) ? inventoryQuery.data.inventory
// //     : []).map((item) => ({
// //       ...item,
// //       category: normalizeInventoryCategory(item.category),
// //     }));

// //   const availableCategories = [
// //     'All',
// //     ...INVENTORY_CATEGORIES.filter((category) =>
// //       items.some((item) => item.category === category)
// //     ),
// //   ];

// //   const addMutation = useMutation({
// //     mutationFn: (data) => api.post('/inventory', data),
// //     onSuccess: () => {
// //       toast.success('Item added successfully');
// //       queryClient.invalidateQueries({ queryKey: ['kitchen-inventory'] });
// //       setMode('list');
// //     },
// //     onError: (err) => toast.error(err.response?.data?.message || 'Failed to add item'),
// //   });

// //   const updateMutation = useMutation({
// //     mutationFn: ({ id, data }) => api.patch(`/inventory/${id}`, data),
// //     onSuccess: () => {
// //       toast.success('Item updated successfully');
// //       queryClient.invalidateQueries({ queryKey: ['kitchen-inventory'] });
// //       setMode('list');
// //       setEditTarget(null);
// //     },
// //     onError: (err) => toast.error(err.response?.data?.message || 'Failed to update item'),
// //   });

// //   const deleteMutation = useMutation({
// //     mutationFn: (id) => api.delete(`/inventory/${id}`),
// //     onSuccess: () => {
// //       toast.success('Item deleted successfully');
// //       queryClient.invalidateQueries({ queryKey: ['kitchen-inventory'] });
// //       setDeleteTarget(null);
// //     },
// //     onError: (err) => toast.error(err.response?.data?.message || 'Failed to delete item'),
// //   });

// //   const filtered = items.filter((item) => {
// //     const matchCat = filterCat === 'All' || item.category === filterCat;
// //     const matchSearch = item.name.toLowerCase().includes(search.toLowerCase());
// //     return matchCat && matchSearch;
// //   });

// //   const lowStock = items.filter(
// //     (item) => item.minStock && Number(item.quantity) <= Number(item.minStock)
// //   );

// //   const handleEdit = (item) => {
// //     setEditTarget(item);
// //     setMode('edit');
// //   };

// //   const handleDelete = (item) => {
// //     setDeleteTarget(item);
// //   };

// //   if (!open) return null;

// //   return (
// //     <>
// //       <div className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm" onClick={onClose} />
// //       <aside className="fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col bg-white shadow-2xl">
// //         <div className="flex items-center justify-between border-b border-stone-100 px-5 py-4">
// //           <div className="flex items-center gap-3">
// //             <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-100 text-amber-700">
// //               <BoxesIcon size={18} />
// //             </div>
// //             <div>
// //               <h2 className="font-bold text-slate-800">Kitchen Inventory</h2>
// //               <p className="text-xs text-stone-400">{items.length} items tracked</p>
// //             </div>
// //           </div>
// //           <button
// //             onClick={onClose}
// //             className="flex h-8 w-8 items-center justify-center rounded-full border border-stone-200 text-stone-500 transition hover:bg-stone-50"
// //           >
// //             <X size={16} />
// //           </button>
// //         </div>

// //         {lowStock.length > 0 && mode === 'list' && (
// //           <div className="mx-4 mt-3 flex items-start gap-2 rounded-xl border border-rose-100 bg-rose-50 px-3 py-2 text-xs text-rose-700">
// //             <AlertTriangle size={14} className="mt-0.5 shrink-0" />
// //             <span>
// //               <strong>{lowStock.length} item(s)</strong> are at or below minimum stock level.
// //             </span>
// //           </div>
// //         )}

// //         <div className="flex flex-1 flex-col overflow-hidden">
// //           {mode === 'list' && (
// //             <>
// //               <div className="space-y-2 px-4 pt-3 pb-2">
// //                 <div className="flex gap-2">
// //                   <div className="relative flex-1">
// //                     <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
// //                     <input
// //                       value={search}
// //                       onChange={(e) => setSearch(e.target.value)}
// //                       placeholder="Search items..."
// //                       className="w-full rounded-xl border border-stone-200 bg-stone-50 pl-9 pr-3 py-2 text-sm outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100"
// //                     />
// //                   </div>
// //                   <button
// //                     onClick={() => setMode('add')}
// //                     className="flex items-center gap-1.5 rounded-xl bg-amber-500 px-3 py-2 text-sm font-semibold text-white transition hover:bg-amber-600"
// //                   >
// //                     <Plus size={15} />
// //                     Add Item
// //                   </button>
// //                 </div>
// //                 <div className="flex gap-1.5 overflow-x-auto pb-1">
// //                   {availableCategories.map((cat) => (
// //                     <button
// //                       key={cat}
// //                       onClick={() => setFilterCat(cat)}
// //                       className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold transition ${
// //                         filterCat === cat
// //                           ? 'bg-amber-500 text-white'
// //                           : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
// //                       }`}
// //                     >
// //                       {cat}
// //                     </button>
// //                   ))}
// //                 </div>
// //               </div>

// //               <div className="flex-1 overflow-y-auto px-4 pb-4">
// //                 {inventoryQuery.isLoading ? (
// //                   <div className="py-12 text-center text-sm text-stone-400">Loading inventory...</div>
// //                 ) : filtered.length === 0 ? (
// //                   <div className="rounded-2xl border border-dashed border-stone-200 bg-stone-50 py-10 text-center text-sm text-stone-400">
// //                     {search ? 'No items match your search.' : 'No inventory items yet. Add one!'}
// //                   </div>
// //                 ) : (
// //                   <div className="space-y-2">
// //                     {filtered.map((item) => {
// //                       const isLow = item.minStock && Number(item.quantity) <= Number(item.minStock);
// //                       return (
// //                         <div
// //                           key={item._id}
// //                           className={`rounded-2xl border p-3 transition ${
// //                             isLow ? 'border-rose-100 bg-rose-50/60' : 'border-stone-200 bg-stone-50'
// //                           }`}
// //                         >
// //                           <div className="flex items-start justify-between gap-2">
// //                             <div className="min-w-0 flex-1">
// //                               <div className="flex items-center gap-2">
// //                                 <p className="truncate font-semibold text-slate-800">{item.name}</p>
// //                                 {isLow && (
// //                                   <span className="shrink-0 rounded-full bg-rose-100 px-2 py-0.5 text-xs font-semibold text-rose-600">
// //                                     Low Stock
// //                                   </span>
// //                                 )}
// //                               </div>
// //                               <p className="mt-0.5 text-xs text-stone-500">
// //                                 {item.category}
// //                                 {item.supplier ? ` · ${item.supplier}` : ''}
// //                               </p>
// //                             </div>
// //                             <div className="flex shrink-0 items-center gap-1.5">
// //                               <span className="rounded-xl bg-white px-2.5 py-1 text-sm font-bold text-slate-700 ring-1 ring-stone-200">
// //                                 {item.quantity} {item.unit}
// //                               </span>
// //                             </div>
// //                           </div>

// //                           {item.minStock && (
// //                             <div className="mt-2">
// //                               <div className="mb-1 flex justify-between text-xs text-stone-400">
// //                                 <span>Stock level</span>
// //                                 <span>min {item.minStock} {item.unit}</span>
// //                               </div>
// //                               <div className="h-1.5 w-full overflow-hidden rounded-full bg-stone-200">
// //                                 <div
// //                                   className={`h-full rounded-full transition-all ${
// //                                     isLow ? 'bg-rose-400' : 'bg-emerald-400'
// //                                   }`}
// //                                   style={{
// //                                     width: `${Math.min(
// //                                       100,
// //                                       (Number(item.quantity) / (Number(item.minStock) * 3)) * 100
// //                                     )}%`,
// //                                   }}
// //                                 />
// //                               </div>
// //                             </div>
// //                           )}

// //                           {item.notes && (
// //                             <p className="mt-2 text-xs text-stone-400 italic">{item.notes}</p>
// //                           )}

// //                           <div className="mt-3 flex gap-2">
// //                             <button
// //                               onClick={() => handleEdit(item)}
// //                               className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-stone-200 bg-white py-1.5 text-xs font-semibold text-slate-600 transition hover:border-amber-300 hover:text-amber-600"
// //                             >
// //                               <Pencil size={12} />
// //                               Edit Item
// //                             </button>
// //                             <button
// //                               onClick={() => handleDelete(item)}
// //                               className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-stone-200 bg-white py-1.5 text-xs font-semibold text-slate-600 transition hover:border-rose-200 hover:text-rose-600"
// //                             >
// //                               <Trash2 size={12} />
// //                               Remove Item
// //                             </button>
// //                           </div>
// //                         </div>
// //                       );
// //                     })}
// //                   </div>
// //                 )}
// //               </div>
// //             </>
// //           )}

// //           {mode === 'add' && (
// //             <div className="flex-1 overflow-y-auto px-4 pt-4 pb-4">
// //               <div className="mb-4">
// //                 <h3 className="font-bold text-slate-800">Add New Item</h3>
// //                 <p className="text-xs text-stone-400 mt-0.5">Fill in the details below</p>
// //               </div>
// //               <InventoryForm
// //                 onSave={(data) => addMutation.mutate(data)}
// //                 onCancel={() => setMode('list')}
// //                 loading={addMutation.isPending}
// //               />
// //             </div>
// //           )}

// //           {mode === 'edit' && editTarget && (
// //             <div className="flex-1 overflow-y-auto px-4 pt-4 pb-4">
// //               <div className="mb-4">
// //                 <h3 className="font-bold text-slate-800">Edit Item</h3>
// //                 <p className="text-xs text-stone-400 mt-0.5">{editTarget.name}</p>
// //               </div>
// //               <InventoryForm
// //                 initial={{
// //                   name: editTarget.name || '',
// //                   category: editTarget.category || INVENTORY_CATEGORIES[0],
// //                   quantity: editTarget.quantity ?? '',
// //                   unit: editTarget.unit || UNITS[0],
// //                   minStock: editTarget.minStock ?? '',
// //                   supplier: editTarget.supplier || '',
// //                   notes: editTarget.notes || '',
// //                 }}
// //                 onSave={(data) => updateMutation.mutate({ id: editTarget._id, data })}
// //                 onCancel={() => { setMode('list'); setEditTarget(null); }}
// //                 loading={updateMutation.isPending}
// //               />
// //             </div>
// //           )}
// //         </div>

// //         {deleteTarget && (
// //           <div className="absolute inset-0 z-50 flex items-center justify-center bg-slate-900/30 px-4 backdrop-blur-[2px]">
// //             <div className="w-full max-w-sm rounded-3xl border border-rose-100 bg-white p-5 shadow-[0_24px_80px_rgba(15,23,42,0.24)]">
// //               <div className="flex items-start gap-3">
// //                 <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-rose-100 text-rose-600">
// //                   <Trash2 size={18} />
// //                 </div>
// //                 <div className="min-w-0 flex-1">
// //                   <p className="text-lg font-bold text-slate-800">Remove Inventory Item?</p>
// //                   <p className="mt-1 text-sm text-stone-500">
// //                     This will permanently remove <span className="font-semibold text-slate-700">{deleteTarget.name}</span> from the inventory list.
// //                   </p>
// //                 </div>
// //               </div>
// //               <div className="mt-5 rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm text-stone-600">
// //                 This action cannot be undone. The item will be deleted from the system.
// //               </div>
// //               <div className="mt-5 flex justify-end gap-2">
// //                 <button
// //                   onClick={() => setDeleteTarget(null)}
// //                   className="rounded-xl border border-stone-200 bg-white px-4 py-2 text-sm font-semibold text-stone-600 transition hover:bg-stone-50"
// //                 >
// //                   Cancel
// //                 </button>
// //                 <button
// //                   onClick={() => deleteMutation.mutate(deleteTarget._id)}
// //                   disabled={deleteMutation.isPending}
// //                   className="rounded-xl bg-rose-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-rose-600 disabled:cursor-not-allowed disabled:opacity-60"
// //                 >
// //                   {deleteMutation.isPending ? 'Removing...' : 'Yes, Remove Item'}
// //                 </button>
// //               </div>
// //             </div>
// //           </div>
// //         )}
// //       </aside>
// //     </>
// //   );
// // }

// // // ─── Order Details Modal Component ──────────────────────────────────────────

// // function OrderDetailsModal({ order, onClose }) {
// //   if (!order) return null;

// //   const totalAmount = order.totalAmount || order.total || 0;
// //   const OrderTypeIcon = ORDER_TYPE_ICONS[order.orderType?.toLowerCase()] || ShoppingBag;

// //   return (
// //     <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
// //       <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
// //         <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
// //           <div className="flex items-center gap-3">
// //             <div className="p-2 bg-amber-100 rounded-xl">
// //               <Receipt size={20} className="text-amber-600" />
// //             </div>
// //             <div>
// //               <h2 className="text-xl font-bold text-gray-900">Order Details</h2>
// //               <p className="text-sm text-gray-500 font-mono">
// //                 #{order.orderId || order._id?.slice(-6)}
// //               </p>
// //             </div>
// //           </div>
// //           <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
// //             <X size={20} className="text-gray-500" />
// //           </button>
// //         </div>

// //         <div className="p-6">
// //           <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
// //             <div className="bg-gray-50 rounded-xl p-4">
// //               <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
// //                 <Users size={16} /> Customer Information
// //               </h3>
// //               <div className="space-y-2">
// //                 <p className="text-sm">
// //                   <span className="font-medium text-gray-700">Name:</span>{' '}
// //                   <span className="text-gray-900">{order.customerName || order.customer?.name || 'Guest'}</span>
// //                 </p>
// //                 {order.customer?.email && (
// //                   <p className="text-sm flex items-center gap-2">
// //                     <Mail size={14} className="text-gray-400" />
// //                     <span className="text-gray-600">{order.customer.email}</span>
// //                   </p>
// //                 )}
// //                 {order.customer?.phone && (
// //                   <p className="text-sm flex items-center gap-2">
// //                     <Phone size={14} className="text-gray-400" />
// //                     <span className="text-gray-600">{order.customer.phone}</span>
// //                   </p>
// //                 )}
// //               </div>
// //             </div>

// //             <div className="bg-gray-50 rounded-xl p-4">
// //               <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
// //                 <ShoppingBag size={16} /> Order Information
// //               </h3>
// //               <div className="space-y-2">
// //                 <p className="text-sm flex items-center justify-between">
// //                   <span className="font-medium text-gray-700">Order Type:</span>
// //                   <span className="flex items-center gap-1 capitalize">
// //                     <OrderTypeIcon size={14} />
// //                     {ORDER_TYPE_LABELS[order.orderType?.toLowerCase()] || order.orderType || 'Dine-in'}
// //                   </span>
// //                 </p>
// //                 <p className="text-sm flex items-center justify-between">
// //                   <span className="font-medium text-gray-700">Order Status:</span>
// //                   <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${STATUS_COLORS[order.status]}`}>
// //                     {order.status}
// //                   </span>
// //                 </p>
// //                 <p className="text-sm flex items-center justify-between">
// //                   <span className="font-medium text-gray-700">Order Date:</span>
// //                   <span className="text-gray-600">
// //                     {new Date(order.createdAt).toLocaleString()}
// //                   </span>
// //                 </p>
// //               </div>
// //             </div>
// //           </div>

// //           <div className="mb-6">
// //             <h3 className="text-sm font-semibold text-gray-700 mb-3">Order Items</h3>
// //             <div className="border border-gray-200 rounded-xl overflow-hidden">
// //               <table className="w-full">
// //                 <thead className="bg-gray-50">
// //                   <tr>
// //                     <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Item</th>
// //                     <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase">Qty</th>
// //                     <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase">Price</th>
// //                     <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase">Subtotal</th>
// //                   </tr>
// //                 </thead>
// //                 <tbody className="divide-y divide-gray-200">
// //                   {(order.items || []).map((item, idx) => (
// //                     <tr key={idx}>
// //                       <td className="px-4 py-3">
// //                         <p className="font-medium text-gray-900">{item.name || item.menuItem?.name}</p>
// //                         {item.specialInstructions && (
// //                           <p className="text-xs text-gray-500 mt-1">{item.specialInstructions}</p>
// //                         )}
// //                       </td>
// //                       <td className="px-4 py-3 text-center">x{item.quantity}</td>
// //                       <td className="px-4 py-3 text-right">₹{item.price || item.unitPrice || 0}</td>
// //                       <td className="px-4 py-3 text-right font-semibold">
// //                         ₹{((item.price || item.unitPrice || 0) * item.quantity).toFixed(2)}
// //                       </td>
// //                     </tr>
// //                   ))}
// //                 </tbody>
// //                 <tfoot className="bg-gray-50 border-t border-gray-200">
// //                   <tr>
// //                     <td colSpan="3" className="px-4 py-3 text-right font-bold">Total</td>
// //                     <td className="px-4 py-3 text-right font-bold">₹{totalAmount.toFixed(2)}</td>
// //                   </tr>
// //                 </tfoot>
// //               </table>
// //             </div>
// //           </div>

// //           {order.specialNotes && (
// //             <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
// //               <h3 className="text-sm font-semibold text-amber-800 mb-2">Special Instructions</h3>
// //               <p className="text-sm text-amber-700">{order.specialNotes}</p>
// //             </div>
// //           )}
// //         </div>
// //       </div>
// //     </div>
// //   );
// // }

// // // ─── Preparation Progress Component ──────────────────────────────────────────

// // function PreparationProgress({ status }) {
// //   const steps = ['placed', 'confirmed', 'preparing', 'ready'];
// //   const currentIndex = steps.indexOf(status);

// //   return (
// //     <div className="flex items-center justify-between">
// //       {steps.map((step, idx) => (
// //         <div key={step} className="flex-1 text-center">
// //           <div className={`relative ${idx < steps.length - 1 ? 'after:absolute after:top-4 after:left-1/2 after:w-full after:h-0.5 after:bg-gray-200' : ''}`}>
// //             <div className={`relative z-10 w-8 h-8 mx-auto rounded-full flex items-center justify-center text-xs font-bold ${
// //               currentIndex >= idx ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-500'
// //             }`}>
// //               {currentIndex > idx ? <CheckCircle size={14} /> : idx + 1}
// //             </div>
// //           </div>
// //           <p className={`text-xs mt-2 ${currentIndex >= idx ? 'text-gray-700 font-medium' : 'text-gray-400'}`}>
// //             {STEP_LABELS[step].split(' ')[0]}
// //           </p>
// //         </div>
// //       ))}
// //     </div>
// //   );
// // }

// // // ─── StaffCard Component ─────────────────────────────────────────────────────

// // function StaffCard({ member }) {
// //   const isActive = member.status === 'active';
// //   return (
// //     <div className={`rounded-lg border p-3 transition-all ${isActive ? 'border-green-200 bg-green-50' : 'border-gray-200 bg-white'}`}>
// //       <div className="flex items-start justify-between">
// //         <div className="flex-1">
// //           <div className="flex items-center gap-2">
// //             <div className={`w-2 h-2 rounded-full ${isActive ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`} />
// //             <p className="font-medium text-gray-900">{member.name}</p>
// //           </div>
// //           <p className="text-xs text-gray-500 mt-1 capitalize">{member.role || 'Staff'}</p>
// //         </div>
// //         {isActive && <UserCheck size={16} className="text-green-600" />}
// //       </div>
// //     </div>
// //   );
// // }

// // // ─── Pagination Component ────────────────────────────────────────────────────

// // function Pagination({ currentPage, totalPages, onPageChange }) {
// //   if (totalPages <= 1) return null;

// //   return (
// //     <div className="flex items-center justify-between px-4 py-3 bg-white border-t border-gray-200 rounded-b-lg">
// //       <div className="flex items-center gap-2">
// //         <button
// //           onClick={() => onPageChange(currentPage - 1)}
// //           disabled={currentPage === 1}
// //           className="p-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-50"
// //         >
// //           <ChevronLeft size={16} />
// //         </button>
// //         <span className="text-sm text-gray-600">
// //           Page {currentPage} of {totalPages}
// //         </span>
// //         <button
// //           onClick={() => onPageChange(currentPage + 1)}
// //           disabled={currentPage === totalPages}
// //           className="p-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-50"
// //         >
// //           <ChevronRight size={16} />
// //         </button>
// //       </div>
// //     </div>
// //   );
// // }

// // // ─── History Orders Component ────────────────────────────────────────────────

// // function HistoryOrders({ orders, onViewOrder }) {
// //   const [historyDateFilter, setHistoryDateFilter] = useState(DATE_FILTERS.ALL);
// //   const [customStartDate, setCustomStartDate] = useState('');
// //   const [customEndDate, setCustomEndDate] = useState('');
// //   const [showCustomPicker, setShowCustomPicker] = useState(false);
// //   const [historyPage, setHistoryPage] = useState(1);
// //   const [historyItemsPerPage] = useState(10);

// //   const getFilterLabel = () => {
// //     switch(historyDateFilter) {
// //       case DATE_FILTERS.ALL: return 'All Time';
// //       case DATE_FILTERS.TODAY: return 'Today';
// //       case DATE_FILTERS.YESTERDAY: return 'Yesterday';
// //       case DATE_FILTERS.THIS_WEEK: return 'This Week';
// //       case DATE_FILTERS.LAST_WEEK: return 'Last Week';
// //       case DATE_FILTERS.THIS_MONTH: return 'This Month';
// //       case DATE_FILTERS.CUSTOM: return 'Custom Range';
// //       default: return 'Select Range';
// //     }
// //   };

// //   const filteredOrders = useMemo(() => {
// //     const { start, end } = getDateRange(historyDateFilter, customStartDate, customEndDate);
    
// //     if (!start || !end) return orders;
    
// //     return orders.filter(order => {
// //       const orderDate = new Date(order.createdAt);
// //       return orderDate >= start && orderDate <= end;
// //     });
// //   }, [orders, historyDateFilter, customStartDate, customEndDate]);

// //   const totalHistoryPages = Math.ceil(filteredOrders.length / historyItemsPerPage);
// //   const paginatedHistoryOrders = filteredOrders.slice(
// //     (historyPage - 1) * historyItemsPerPage,
// //     historyPage * historyItemsPerPage
// //   );

// //   useEffect(() => {
// //     setHistoryPage(1);
// //   }, [historyDateFilter, customStartDate, customEndDate]);

// //   const stats = {
// //     total: filteredOrders.length,
// //     completed: filteredOrders.filter(o => o.status === 'completed').length,
// //     cancelled: filteredOrders.filter(o => o.status === 'cancelled').length,
// //     totalRevenue: filteredOrders.reduce((sum, o) => sum + (o.totalAmount || o.total || 0), 0),
// //   };

// //   return (
// //     <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
// //       <div className="p-4 border-b border-gray-200 bg-gray-50">
// //         <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
// //           <div className="flex items-center gap-2">
// //             <CalendarDays size={18} className="text-amber-600" />
// //             <h3 className="font-semibold text-gray-900">Order History</h3>
// //           </div>
          
// //           <div className="flex items-center gap-3 flex-wrap">
// //             <div className="relative">
// //               <button
// //                 onClick={() => setShowCustomPicker(!showCustomPicker)}
// //                 className="flex items-center gap-2 px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
// //               >
// //                 <Filter size={14} />
// //                 {getFilterLabel()}
// //                 <ChevronDown size={14} />
// //               </button>
              
// //               {showCustomPicker && (
// //                 <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-10 p-3">
// //                   <div className="space-y-2">
// //                     <button
// //                       onClick={() => { setHistoryDateFilter(DATE_FILTERS.ALL); setShowCustomPicker(false); }}
// //                       className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 rounded-lg"
// //                     >
// //                       All Time
// //                     </button>
// //                     <button
// //                       onClick={() => { setHistoryDateFilter(DATE_FILTERS.TODAY); setShowCustomPicker(false); }}
// //                       className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 rounded-lg"
// //                     >
// //                       Today
// //                     </button>
// //                     <button
// //                       onClick={() => { setHistoryDateFilter(DATE_FILTERS.YESTERDAY); setShowCustomPicker(false); }}
// //                       className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 rounded-lg"
// //                     >
// //                       Yesterday
// //                     </button>
// //                     <button
// //                       onClick={() => { setHistoryDateFilter(DATE_FILTERS.THIS_WEEK); setShowCustomPicker(false); }}
// //                       className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 rounded-lg"
// //                     >
// //                       This Week
// //                     </button>
// //                     <button
// //                       onClick={() => { setHistoryDateFilter(DATE_FILTERS.LAST_WEEK); setShowCustomPicker(false); }}
// //                       className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 rounded-lg"
// //                     >
// //                       Last Week
// //                     </button>
// //                     <button
// //                       onClick={() => { setHistoryDateFilter(DATE_FILTERS.THIS_MONTH); setShowCustomPicker(false); }}
// //                       className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 rounded-lg"
// //                     >
// //                       This Month
// //                     </button>
// //                     <div className="border-t border-gray-200 my-2"></div>
// //                     <div className="space-y-2">
// //                       <input
// //                         type="date"
// //                         value={customStartDate}
// //                         onChange={(e) => setCustomStartDate(e.target.value)}
// //                         className="w-full px-2 py-1 text-sm border border-gray-200 rounded-lg"
// //                         placeholder="Start Date"
// //                       />
// //                       <input
// //                         type="date"
// //                         value={customEndDate}
// //                         onChange={(e) => setCustomEndDate(e.target.value)}
// //                         className="w-full px-2 py-1 text-sm border border-gray-200 rounded-lg"
// //                         placeholder="End Date"
// //                       />
// //                       <button
// //                         onClick={() => { setHistoryDateFilter(DATE_FILTERS.CUSTOM); setShowCustomPicker(false); }}
// //                         className="w-full px-3 py-2 bg-amber-500 text-white text-sm rounded-lg hover:bg-amber-600"
// //                         disabled={!customStartDate || !customEndDate}
// //                       >
// //                         Apply Custom Range
// //                       </button>
// //                     </div>
// //                   </div>
// //                 </div>
// //               )}
// //             </div>
// //           </div>
// //         </div>
        
// //         <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
// //           <div className="bg-white rounded-lg p-2 text-center border border-gray-100">
// //             <div className="text-xl font-bold text-gray-900">{stats.total}</div>
// //             <div className="text-xs text-gray-500">Total Orders</div>
// //           </div>
// //           <div className="bg-white rounded-lg p-2 text-center border border-gray-100">
// //             <div className="text-xl font-bold text-green-600">{stats.completed}</div>
// //             <div className="text-xs text-gray-500">Completed</div>
// //           </div>
// //           <div className="bg-white rounded-lg p-2 text-center border border-gray-100">
// //             <div className="text-xl font-bold text-red-600">{stats.cancelled}</div>
// //             <div className="text-xs text-gray-500">Cancelled</div>
// //           </div>
// //           <div className="bg-white rounded-lg p-2 text-center border border-gray-100">
// //             <div className="text-xl font-bold text-amber-600">₹{stats.totalRevenue.toFixed(0)}</div>
// //             <div className="text-xs text-gray-500">Revenue</div>
// //           </div>
// //         </div>
// //       </div>

// //       {paginatedHistoryOrders.length === 0 ? (
// //         <div className="p-8 text-center">
// //           <PackageCheck size={40} className="mx-auto text-gray-300 mb-2" />
// //           <p className="text-gray-500">No orders found for this period</p>
// //         </div>
// //       ) : (
// //         <>
// //           <div className="overflow-x-auto">
// //             <table className="w-full text-sm">
// //               <thead className="bg-gray-50">
// //                 <tr className="text-gray-600">
// //                   <th className="px-4 py-3 text-left">Order ID</th>
// //                   <th className="px-4 py-3 text-left">Customer</th>
// //                   <th className="px-4 py-3 text-left">Type</th>
// //                   <th className="px-4 py-3 text-left">Items</th>
// //                   <th className="px-4 py-3 text-left">Total</th>
// //                   <th className="px-4 py-3 text-left">Status</th>
// //                   <th className="px-4 py-3 text-left">Date</th>
// //                   <th className="px-4 py-3 text-left">Action</th>
// //                 </tr>
// //               </thead>
// //               <tbody className="divide-y divide-gray-100">
// //                 {paginatedHistoryOrders.map(order => {
// //                   const OrderTypeIcon = ORDER_TYPE_ICONS[order.orderType?.toLowerCase()] || ShoppingBag;
// //                   return (
// //                     <tr key={order._id} className="hover:bg-gray-50 transition">
// //                       <td className="px-4 py-3 font-mono text-xs text-amber-600">
// //                         #{order.orderId || order._id?.slice(-6)}
// //                       </td>
// //                       <td className="px-4 py-3 font-medium">{order.customerName || order.customer?.name || 'Guest'}</td>
// //                       <td className="px-4 py-3">
// //                         <span className="flex items-center gap-1 text-xs capitalize">
// //                           <OrderTypeIcon size={12} />
// //                           {ORDER_TYPE_LABELS[order.orderType?.toLowerCase()] || order.orderType || 'Dine-in'}
// //                         </span>
// //                       </td>
// //                       <td className="px-4 py-3 text-gray-600">{order.items?.length || 0} items</td>
// //                       <td className="px-4 py-3 font-semibold">₹{order.totalAmount || order.total || 0}</td>
// //                       <td className="px-4 py-3">
// //                         <span className={`px-2 py-1 rounded-full text-xs font-semibold ${STATUS_COLORS[order.status]}`}>
// //                           {order.status}
// //                         </span>
// //                       </td>
// //                       <td className="px-4 py-3 text-gray-500 text-xs">
// //                         {new Date(order.createdAt).toLocaleDateString()}
// //                       </td>
// //                       <td className="px-4 py-3">
// //                         <button
// //                           onClick={() => onViewOrder(order)}
// //                           className="text-amber-600 hover:text-amber-700 text-sm font-medium"
// //                         >
// //                           View
// //                         </button>
// //                       </td>
// //                     </tr>
// //                   );
// //                 })}
// //               </tbody>
// //             </table>
// //           </div>
          
// //           {totalHistoryPages > 1 && (
// //             <div className="px-4 py-3 border-t border-gray-200 bg-gray-50">
// //               <Pagination
// //                 currentPage={historyPage}
// //                 totalPages={totalHistoryPages}
// //                 onPageChange={setHistoryPage}
// //               />
// //             </div>
// //           )}
// //         </>
// //       )}
// //     </div>
// //   );
// // }

// // // ─── Main Component ───────────────────────────────────────────────────────────

// // export default function KitchenDisplay() {
// //   const dispatch = useDispatch();
// //   const navigate = useNavigate();
// //   const { user } = useSelector((state) => state.auth);
// //   const queryClient = useQueryClient();
// //   const [expandedOrderId, setExpandedOrderId] = useState(null);
// //   const [viewMode, setViewMode] = useState('list');
// //   const [statusFilter, setStatusFilter] = useState('all');
// //   const [readyPage, setReadyPage] = useState(1);
// //   const [readyItemsPerPage] = useState(3);
// //   const [selectedOrder, setSelectedOrder] = useState(null);
// //   const [inventoryOpen, setInventoryOpen] = useState(false);
// //   const [activeTab, setActiveTab] = useState('orders');
// //   const [previousReadyOrderIds, setPreviousReadyOrderIds] = useState(new Set());
// //   const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

// //   // Presence Tracking for Kitchen Staff
// //   useEffect(() => {
// //     const authUser = JSON.parse(sessionStorage.getItem('authUser') || '{}');
// //     if (authUser._id && authUser.role) {
// //       presenceService.initialize(authUser._id, authUser.role, 'Kitchen Panel');
// //     }
// //     return () => {
// //       void presenceService.cleanup();
// //     };
// //   }, []);

// //   // Fetch completed/cancelled orders for history
// //   const historyQuery = useQuery({
// //     queryKey: ['kitchen-orders-history'],
// //     queryFn: () => api.get('/kitchen/orders/history').then((res) => res.data),
// //     refetchInterval: 30000,
// //   });

// //   // Queries
// //   const ordersQuery = useQuery({
// //     queryKey: ['kitchen-orders-active'],
// //     queryFn: () => api.get('/kitchen/orders').then((res) => res.data),
// //     refetchInterval: 10000,
// //   });

// //   const readyQuery = useQuery({
// //     queryKey: ['kitchen-orders-ready'],
// //     queryFn: () => api.get('/kitchen/orders/ready').then((res) => res.data),
// //     refetchInterval: 10000,
// //   });

// //   const statsQuery = useQuery({
// //     queryKey: ['kitchen-stats'],
// //     queryFn: () => api.get('/kitchen/stats').then((res) => res.data),
// //     refetchInterval: 20000,
// //   });

// //   const teamQuery = useQuery({
// //     queryKey: ['kitchen-team'],
// //     queryFn: () => api.get('/kitchen/team-status').then((res) => res.data).catch(() => []),
// //     refetchInterval: 30000,
// //   });

// //   // Mutations
// //   const updateMutation = useMutation({
// //     mutationFn: ({ orderId, status }) =>
// //       api.patch(`/kitchen/orders/${orderId}/status`, { status }),
// //     onSuccess: (data, variables) => {
// //       toast.success('Order status updated');
      
// //       // Check if the order was marked as ready and it's not a delivery order
// //       if (variables.status === 'ready') {
// //         const order = activeOrders.find(o => o._id === variables.orderId);
// //         if (order && order.orderType?.toLowerCase() !== 'delivery') {
// //           const orderIdShort = order.orderId || order._id?.slice(-6);
// //           const customerName = order.customerName || order.customer?.name || 'Customer';
// //           playReadyNotification(orderIdShort, customerName);
// //         }
// //       }
      
// //       queryClient.invalidateQueries({ queryKey: ['kitchen-orders-active'] });
// //       queryClient.invalidateQueries({ queryKey: ['kitchen-orders-ready'] });
// //       queryClient.invalidateQueries({ queryKey: ['kitchen-stats'] });
// //       queryClient.invalidateQueries({ queryKey: ['kitchen-orders-history'] });
// //     },
// //     onError: (error) =>
// //       toast.error(error.response?.data?.message || 'Failed to update status'),
// //   });

// //   const completeMutation = useMutation({
// //     mutationFn: (orderId) =>
// //       api.patch(`/kitchen/orders/${orderId}/status`, { status: 'completed' }),
// //     onSuccess: () => {
// //       toast.success('Order completed');
// //       queryClient.invalidateQueries({ queryKey: ['kitchen-orders-active'] });
// //       queryClient.invalidateQueries({ queryKey: ['kitchen-orders-ready'] });
// //       queryClient.invalidateQueries({ queryKey: ['kitchen-stats'] });
// //       queryClient.invalidateQueries({ queryKey: ['kitchen-orders-history'] });
// //     },
// //     onError: (error) =>
// //       toast.error(error.response?.data?.message || 'Failed to complete order'),
// //   });

// //   // Data processing - EXCLUDE delivery orders from ready for pickup
// //   const activeOrders = useMemo(() => {
// //     const orders = ordersQuery.data || [];
// //     return orders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
// //   }, [ordersQuery.data]);

// //   const readyOrders = useMemo(() => {
// //     const orders = readyQuery.data || [];
// //     // EXCLUDE delivery orders - they go to delivery panel
// //     const nonDeliveryOrders = orders.filter(order => 
// //       order.orderType?.toLowerCase() !== 'delivery'
// //     );
// //     return nonDeliveryOrders.sort((a, b) => 
// //       new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt)
// //     );
// //   }, [readyQuery.data]);

// //   // For stats display
// //   const totalReadyOrders = readyQuery.data?.length || 0;
// //   const nonDeliveryReadyCount = readyOrders.length;
// //   const deliveryReadyCount = totalReadyOrders - nonDeliveryReadyCount;

// //   const historyOrders = useMemo(() => {
// //     const orders = historyQuery.data || [];
// //     return orders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
// //   }, [historyQuery.data]);

// //   // Voice notification for new ready orders
// //   useEffect(() => {
// //     const currentReadyIds = new Set(readyOrders.map(o => o._id));
    
// //     readyOrders.forEach(order => {
// //       if (!previousReadyOrderIds.has(order._id)) {
// //         if (order.orderType?.toLowerCase() !== 'delivery') {
// //           const orderIdShort = order.orderId || order._id?.slice(-6);
// //           const customerName = order.customerName || order.customer?.name || 'Customer';
// //           playReadyNotification(orderIdShort, customerName);
// //         }
// //       }
// //     });
    
// //     setPreviousReadyOrderIds(currentReadyIds);
// //   }, [readyOrders]);

// //   const totalReadyPages = Math.ceil(readyOrders.length / readyItemsPerPage);
// //   const paginatedReadyOrders = useMemo(() => {
// //     const start = (readyPage - 1) * readyItemsPerPage;
// //     const end = start + readyItemsPerPage;
// //     return readyOrders.slice(start, end);
// //   }, [readyOrders, readyPage, readyItemsPerPage]);

// //   const filteredOrders = useMemo(() => {
// //     if (statusFilter === 'all') return activeOrders;
// //     return activeOrders.filter(order => order.status === statusFilter);
// //   }, [activeOrders, statusFilter]);

// //   const stats = statsQuery.data || {};
// //   const team = teamQuery.data || [];

// //   const pendingCount = activeOrders.filter(o => o.status === 'placed' || o.status === 'confirmed').length;
// //   const preparingCount = activeOrders.filter(o => o.status === 'preparing').length;

// //   const handleOpenDetails = (order) => {
// //     setSelectedOrder(order);
// //   };

// //   const handleUpdateOrder = (orderId, status) => {
// //     updateMutation.mutate({ orderId, status });
// //   };

// //   const handleCompleteOrder = (orderId) => {
// //     completeMutation.mutate(orderId);
// //   };

// //   const refreshAll = () => {
// //     ordersQuery.refetch();
// //     readyQuery.refetch();
// //     statsQuery.refetch();
// //     teamQuery.refetch();
// //     historyQuery.refetch();
// //     toast.success('Refreshed');
// //   };

// //   const toggleExpand = (orderId) => {
// //     setExpandedOrderId(expandedOrderId === orderId ? null : orderId);
// //   };

// //   const handleLogout = async () => {
// //     setShowLogoutConfirm(false);
// //     await dispatch(logoutUser());
// //     navigate('/login', { replace: true });
// //   };

// //   return (
// //     <>
// //       <div className="min-h-screen bg-gray-50">
// //         <div className="max-w-7xl mx-auto px-4 py-6 md:px-6 md:py-8">
// //           {/* Header */}
// //           <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
// //             <div>
// //               <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Kitchen Display System</h1>
// //               <p className="text-sm text-gray-500 mt-1">
// //                 Real-time order management for kitchen staff
// //                 {user?.name ? ` • Signed in as ${user.name}` : ''}
// //               </p>
// //             </div>
// //             <div className="flex items-center gap-3">
// //               {/* Tab Switcher */}
// //               <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg p-1">
// //                 <button
// //                   onClick={() => setActiveTab('orders')}
// //                   className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${
// //                     activeTab === 'orders'
// //                       ? 'bg-amber-500 text-white'
// //                       : 'text-gray-600 hover:bg-gray-100'
// //                   }`}
// //                 >
// //                   📋 Active Orders
// //                 </button>
// //                 <button
// //                   onClick={() => setActiveTab('history')}
// //                   className={`px-4 py-2 rounded-lg text-sm font-semibold transition flex items-center gap-2 ${
// //                     activeTab === 'history'
// //                       ? 'bg-amber-500 text-white'
// //                       : 'text-gray-600 hover:bg-gray-100'
// //                   }`}
// //                 >
// //                   <CalendarDays size={14} />
// //                   History
// //                 </button>
// //                 <button
// //                   onClick={() => setActiveTab('waste')}
// //                   className={`px-4 py-2 rounded-lg text-sm font-semibold transition flex items-center gap-2 ${
// //                     activeTab === 'waste'
// //                       ? 'bg-amber-500 text-white'
// //                       : 'text-gray-600 hover:bg-gray-100'
// //                   }`}
// //                 >
// //                   <Trash size={14} />
// //                   Waste Log
// //                 </button>
// //               </div>
// //               <button
// //                 onClick={() => setInventoryOpen(true)}
// //                 className="flex items-center gap-2 px-4 py-2 bg-amber-500 text-white rounded-lg text-sm font-semibold hover:bg-amber-600 transition"
// //               >
// //                 <Package size={16} />
// //                 Inventory
// //               </button>
// //               <button
// //                 onClick={refreshAll}
// //                 className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-50 transition"
// //               >
// //                 <RefreshCw size={16} />
// //                 Refresh
// //               </button>
// //               <button
// //                 onClick={() => setShowLogoutConfirm(true)}
// //                 className="flex items-center gap-2 px-4 py-2 bg-white border border-red-200 rounded-lg text-sm font-semibold text-red-600 hover:bg-red-50 transition"
// //               >
// //                 <LogOut size={16} />
// //                 Logout
// //               </button>
// //             </div>
// //           </div>

// //           {activeTab === 'orders' && (
// //             <>
// //               {/* Alert for pending orders */}
// //               {pendingCount > 0 && (
// //                 <div className="mb-6 bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-center gap-3">
// //                   <AlertTriangle size={20} className="text-amber-600" />
// //                   <div className="flex-1">
// //                     <p className="text-sm font-semibold text-amber-800">Attention Required</p>
// //                     <p className="text-sm text-amber-700">{pendingCount} order(s) waiting to be started</p>
// //                   </div>
// //                 </div>
// //               )}

// //               {/* Stats Grid */}
// //               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
// //                 <div className="rounded-xl border bg-amber-50 border-amber-100 p-5">
// //                   <div className="flex items-start justify-between">
// //                     <div>
// //                       <p className="text-sm font-medium text-gray-600">Active Orders</p>
// //                       <p className="mt-2 text-3xl font-bold text-gray-900">{activeOrders.length}</p>
// //                       <p className="mt-2 text-xs text-gray-500">{preparingCount} in preparation</p>
// //                     </div>
// //                     <div className="rounded-lg p-2 bg-amber-100">
// //                       <ChefHat size={20} className="text-amber-600" />
// //                     </div>
// //                   </div>
// //                 </div>
// //                 <div className="rounded-xl border bg-green-50 border-green-100 p-5">
// //                   <div className="flex items-start justify-between">
// //                     <div>
// //                       <p className="text-sm font-medium text-gray-600">Ready Orders</p>
// //                       <p className="mt-2 text-3xl font-bold text-gray-900">{nonDeliveryReadyCount}</p>
// //                       <p className="mt-2 text-xs text-gray-500">
// //                         {deliveryReadyCount} delivery orders sent to delivery panel
// //                       </p>
// //                     </div>
// //                     <div className="rounded-lg p-2 bg-green-100">
// //                       <PackageCheck size={20} className="text-green-600" />
// //                     </div>
// //                   </div>
// //                 </div>
// //                 <div className="rounded-xl border bg-blue-50 border-blue-100 p-5">
// //                   <div className="flex items-start justify-between">
// //                     <div>
// //                       <p className="text-sm font-medium text-gray-600">Avg. Prep Time</p>
// //                       <p className="mt-2 text-3xl font-bold text-gray-900">{stats.avgPrepTimeMinutes || 0}m</p>
// //                     </div>
// //                     <div className="rounded-lg p-2 bg-blue-100">
// //                       <Clock3 size={20} className="text-blue-600" />
// //                     </div>
// //                   </div>
// //                 </div>
// //                 <div className="rounded-xl border bg-purple-50 border-purple-100 p-5">
// //                   <div className="flex items-start justify-between">
// //                     <div>
// //                       <p className="text-sm font-medium text-gray-600">Completed Today</p>
// //                       <p className="mt-2 text-3xl font-bold text-gray-900">{stats.completedToday || 0}</p>
// //                     </div>
// //                     <div className="rounded-lg p-2 bg-purple-100">
// //                       <TrendingUp size={20} className="text-purple-600" />
// //                     </div>
// //                   </div>
// //                 </div>
// //               </div>

// //               {/* Active Orders Section */}
// //               <div className="mb-8">
// //                 <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
// //                   <div>
// //                     <h2 className="text-xl font-bold text-gray-900">Active Orders</h2>
// //                     <p className="text-sm text-gray-500">Orders currently being prepared</p>
// //                   </div>
// //                   <div className="flex items-center gap-3">
// //                     <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg p-1">
// //                       <button
// //                         onClick={() => setViewMode('list')}
// //                         className={`p-1.5 rounded ${viewMode === 'list' ? 'bg-amber-100 text-amber-600' : 'text-gray-500'}`}
// //                       >
// //                         <List size={16} />
// //                       </button>
// //                       <button
// //                         onClick={() => setViewMode('grid')}
// //                         className={`p-1.5 rounded ${viewMode === 'grid' ? 'bg-amber-100 text-amber-600' : 'text-gray-500'}`}
// //                       >
// //                         <Grid3x3 size={16} />
// //                       </button>
// //                     </div>
// //                     <select
// //                       value={statusFilter}
// //                       onChange={(e) => setStatusFilter(e.target.value)}
// //                       className="px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm"
// //                     >
// //                       <option value="all">All Status</option>
// //                       <option value="placed">Pending</option>
// //                       <option value="confirmed">Confirmed</option>
// //                       <option value="preparing">Preparing</option>
// //                     </select>
// //                   </div>
// //                 </div>

// //                 {filteredOrders.length === 0 ? (
// //                   <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
// //                     <ChefHat size={48} className="mx-auto text-gray-300 mb-3" />
// //                     <p className="text-gray-500">No active orders at the moment</p>
// //                   </div>
// //                 ) : viewMode === 'list' ? (
// //                   <div className="space-y-3">
// //                     {filteredOrders.map(order => {
// //                       const isExpanded = expandedOrderId === order._id;
// //                       const OrderTypeIcon = ORDER_TYPE_ICONS[order.orderType?.toLowerCase()] || ShoppingBag;
                      
// //                       return (
// //                         <div key={order._id} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
// //                           <div 
// //                             className="p-4 cursor-pointer hover:bg-gray-50 transition-colors"
// //                             onClick={() => toggleExpand(order._id)}
// //                           >
// //                             <div className="flex items-start justify-between">
// //                               <div className="flex-1">
// //                                 <div className="flex items-center gap-3 flex-wrap">
// //                                   <span className="font-mono text-sm font-bold text-amber-600">
// //                                     #{order.orderId || order._id?.slice(-6)}
// //                                   </span>
// //                                   <span className={`px-2 py-1 rounded-full text-xs font-semibold ${STATUS_COLORS[order.status]}`}>
// //                                     {order.status}
// //                                   </span>
// //                                   <span className="flex items-center gap-1 text-xs text-gray-500 capitalize">
// //                                     <OrderTypeIcon size={12} />
// //                                     {ORDER_TYPE_LABELS[order.orderType?.toLowerCase()] || order.orderType || 'Dine-in'}
// //                                   </span>
// //                                 </div>
// //                                 <div className="mt-2">
// //                                   <p className="font-semibold text-gray-900">
// //                                     {order.customerName || order.customer?.name || 'Guest'}
// //                                   </p>
// //                                   <div className="flex items-center gap-3 mt-1 text-sm text-gray-600">
// //                                     <span>{order.items?.length || 0} item(s)</span>
// //                                     <span>•</span>
// //                                     <span className="font-semibold">₹{order.totalAmount || order.total || 0}</span>
// //                                   </div>
// //                                 </div>
// //                               </div>
// //                               <div className="flex items-center gap-2">
// //                                 <button
// //                                   onClick={(e) => {
// //                                     e.stopPropagation();
// //                                     handleOpenDetails(order);
// //                                   }}
// //                                   className="px-3 py-2 rounded-lg text-sm font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 transition flex items-center gap-1"
// //                                 >
// //                                   <Eye size={14} />
// //                                   View
// //                                 </button>
// //                                 <button
// //                                   onClick={(e) => {
// //                                     e.stopPropagation();
// //                                     handleUpdateOrder(order._id, order.status === 'preparing' ? 'ready' : 'preparing');
// //                                   }}
// //                                   className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
// //                                     order.status === 'preparing'
// //                                       ? 'bg-green-500 hover:bg-green-600 text-white'
// //                                       : 'bg-amber-500 hover:bg-amber-600 text-white'
// //                                   }`}
// //                                 >
// //                                   {order.status === 'preparing' ? 'Mark Ready' : 'Start Prep'}
// //                                 </button>
// //                                 {isExpanded ? <ChevronUp size={18} className="text-gray-400" /> : <ChevronDown size={18} className="text-gray-400" />}
// //                               </div>
// //                             </div>
// //                           </div>

// //                           {isExpanded && (
// //                             <div className="border-t border-gray-100 bg-gray-50 p-4">
// //                               <div className="grid gap-4 md:grid-cols-2">
// //                                 <div>
// //                                   <h4 className="text-sm font-semibold text-gray-700 mb-3">Order Items</h4>
// //                                   <div className="space-y-2">
// //                                     {(order.items || []).map((item, idx) => (
// //                                       <div key={idx} className="bg-white rounded-lg p-3 border border-gray-200">
// //                                         <div className="flex justify-between">
// //                                           <div>
// //                                             <p className="font-medium text-gray-900">
// //                                               {item.name || item.menuItem?.name}
// //                                             </p>
// //                                             {item.specialInstructions && (
// //                                               <p className="text-xs text-gray-500 mt-1">{item.specialInstructions}</p>
// //                                             )}
// //                                           </div>
// //                                           <div className="text-right">
// //                                             <p className="text-sm text-gray-600">x{item.quantity}</p>
// //                                             <p className="text-sm font-semibold">₹{(item.price || item.unitPrice || 0) * item.quantity}</p>
// //                                           </div>
// //                                         </div>
// //                                       </div>
// //                                     ))}
// //                                   </div>
// //                                 </div>
// //                                 <div>
// //                                   <h4 className="text-sm font-semibold text-gray-700 mb-3">Preparation Progress</h4>
// //                                   <div className="bg-white rounded-lg p-4 border border-gray-200">
// //                                     <PreparationProgress status={order.status} />
// //                                   </div>
// //                                   {order.specialNotes && (
// //                                     <div className="mt-4 bg-amber-50 border border-amber-200 rounded-lg p-3">
// //                                       <p className="text-xs font-semibold text-amber-800 mb-1">Special Instructions:</p>
// //                                       <p className="text-sm text-amber-700">{order.specialNotes}</p>
// //                                     </div>
// //                                   )}
// //                                 </div>
// //                               </div>
// //                             </div>
// //                           )}
// //                         </div>
// //                       );
// //                     })}
// //                   </div>
// //                 ) : (
// //                   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
// //                     {filteredOrders.map(order => {
// //                       const OrderTypeIcon = ORDER_TYPE_ICONS[order.orderType?.toLowerCase()] || ShoppingBag;
                      
// //                       return (
// //                         <div key={order._id} className="bg-white rounded-lg border border-gray-200 p-4">
// //                           <div className="flex items-start justify-between mb-3">
// //                             <span className="font-mono text-sm font-bold text-amber-600">
// //                               #{order.orderId || order._id?.slice(-6)}
// //                             </span>
// //                             <span className={`px-2 py-1 rounded-full text-xs font-semibold ${STATUS_COLORS[order.status]}`}>
// //                               {order.status}
// //                             </span>
// //                           </div>
// //                           <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
// //                             <OrderTypeIcon size={12} />
// //                             <span className="capitalize">{ORDER_TYPE_LABELS[order.orderType?.toLowerCase()] || order.orderType || 'Dine-in'}</span>
// //                           </div>
// //                           <p className="font-semibold text-gray-900">{order.customerName || order.customer?.name || 'Guest'}</p>
// //                           <p className="text-sm text-gray-600 mt-1">{order.items?.length || 0} items • ₹{order.totalAmount || order.total || 0}</p>
// //                           <div className="mt-3">
// //                             <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
// //                               <div className={`h-full rounded-full ${
// //                                 order.status === 'placed' ? 'w-1/4 bg-orange-500' :
// //                                 order.status === 'confirmed' ? 'w-2/4 bg-blue-500' :
// //                                 order.status === 'preparing' ? 'w-3/4 bg-purple-500' : 'w-full bg-green-500'
// //                               }`} />
// //                             </div>
// //                           </div>
// //                           <div className="flex gap-2 mt-4">
// //                             <button
// //                               onClick={() => handleOpenDetails(order)}
// //                               className="flex-1 px-3 py-2 text-sm font-semibold text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
// //                             >
// //                               View
// //                             </button>
// //                             <button
// //                               onClick={() => handleUpdateOrder(order._id, order.status === 'preparing' ? 'ready' : 'preparing')}
// //                               className={`flex-1 px-3 py-2 text-sm font-semibold text-white rounded-lg transition ${
// //                                 order.status === 'preparing' ? 'bg-green-500 hover:bg-green-600' : 'bg-amber-500 hover:bg-amber-600'
// //                               }`}
// //                             >
// //                               {order.status === 'preparing' ? 'Ready' : 'Start'}
// //                             </button>
// //                           </div>
// //                         </div>
// //                       );
// //                     })}
// //                   </div>
// //                 )}
// //               </div>

// //               {/* Ready Orders & Team Section */}
// //               <div className="grid lg:grid-cols-2 gap-6">
// //                 <div>
// //                   <div className="flex items-center justify-between mb-4">
// //                     <div>
// //                       <h2 className="text-xl font-bold text-gray-900">Ready for Pickup</h2>
// //                       <p className="text-sm text-gray-500">
// //                         Prepared orders awaiting service (dine-in, takeaway, pre-order only)
// //                         {deliveryReadyCount > 0 && ` • ${deliveryReadyCount} delivery orders sent to delivery panel`}
// //                       </p>
// //                     </div>
// //                     {readyOrders.length > 0 && (
// //                       <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-semibold">
// //                         {readyOrders.length} total
// //                       </span>
// //                     )}
// //                   </div>
// //                   <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
// //                     <div className="divide-y divide-gray-200">
// //                       {paginatedReadyOrders.length === 0 ? (
// //                         <div className="p-8 text-center">
// //                           <PackageCheck size={40} className="mx-auto text-gray-300 mb-2" />
// //                           <p className="text-gray-500">No ready orders</p>
// //                         </div>
// //                       ) : (
// //                         paginatedReadyOrders.map(order => (
// //                           <div key={order._id} className="p-4 hover:bg-gray-50">
// //                             <div className="flex items-start justify-between">
// //                               <div className="flex-1">
// //                                 <div className="flex items-center gap-2">
// //                                   <span className="font-mono text-sm font-bold text-green-700">
// //                                     #{order.orderId || order._id?.slice(-6)}
// //                                   </span>
// //                                   <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded-full text-xs font-semibold">
// //                                     Ready
// //                                   </span>
// //                                   {order.orderType && (
// //                                     <span className="text-xs text-gray-500 capitalize">({order.orderType})</span>
// //                                   )}
// //                                 </div>
// //                                 <p className="font-medium text-gray-900 mt-2">
// //                                   {order.customerName || order.customer?.name || 'Guest'}
// //                                 </p>
// //                                 <p className="text-sm text-gray-600 mt-1">
// //                                   {order.items?.length || 0} items • ₹{order.totalAmount || order.total || 0}
// //                                 </p>
// //                               </div>
// //                               <div className="flex gap-2">
// //                                 <button
// //                                   onClick={() => handleOpenDetails(order)}
// //                                   className="px-3 py-1.5 text-sm font-semibold text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
// //                                 >
// //                                   View
// //                                 </button>
// //                                 <button
// //                                   onClick={() => handleCompleteOrder(order._id)}
// //                                   className="px-3 py-1.5 text-sm font-semibold text-green-700 bg-green-100 rounded-lg hover:bg-green-200 transition"
// //                                 >
// //                                   Complete
// //                                 </button>
// //                               </div>
// //                             </div>
// //                           </div>
// //                         ))
// //                       )}
// //                     </div>
// //                     {readyOrders.length > readyItemsPerPage && (
// //                       <Pagination
// //                         currentPage={readyPage}
// //                         totalPages={totalReadyPages}
// //                         onPageChange={setReadyPage}
// //                       />
// //                     )}
// //                   </div>
// //                 </div>

// //                 <div>
// //                   <div className="flex items-center justify-between mb-4">
// //                     <div>
// //                       <h2 className="text-xl font-bold text-gray-900">Kitchen Team</h2>
// //                       <p className="text-sm text-gray-500">Current shift and availability</p>
// //                     </div>
// //                     <Users size={20} className="text-gray-400" />
// //                   </div>
// //                   <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
// //                     <div className="divide-y divide-gray-200">
// //                       {team.length === 0 ? (
// //                         <div className="p-8 text-center">
// //                           <Users size={40} className="mx-auto text-gray-300 mb-2" />
// //                           <p className="text-gray-500">No team data available</p>
// //                         </div>
// //                       ) : (
// //                         team.map(member => (
// //                           <StaffCard key={member._id} member={member} />
// //                         ))
// //                       )}
// //                     </div>
// //                   </div>
// //                 </div>
// //               </div>
// //             </>
// //           )}

// //           {activeTab === 'history' && (
// //             <HistoryOrders 
// //               orders={historyOrders} 
// //               onViewOrder={handleOpenDetails}
// //             />
// //           )}

// //           {activeTab === 'waste' && (
// //             <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
// //               <KitchenWasteLog />
// //             </div>
// //           )}
// //         </div>
// //       </div>

// //       {/* Inventory Sidebar */}
// //       <InventorySidebar open={inventoryOpen} onClose={() => setInventoryOpen(false)} />

// //       {/* Order Details Modal */}
// //       <OrderDetailsModal order={selectedOrder} onClose={() => setSelectedOrder(null)} />

// //       {/* Logout Confirmation Modal */}
// //       {showLogoutConfirm && (
// //         <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={() => setShowLogoutConfirm(false)}>
// //           <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full" onClick={e => e.stopPropagation()}>
// //             <div className="p-5 border-b border-gray-200">
// //               <div className="flex items-center gap-3">
// //                 <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
// //                   <LogOut size={18} className="text-red-600" />
// //                 </div>
// //                 <h2 className="text-xl font-bold text-gray-900">Confirm Logout</h2>
// //               </div>
// //             </div>
// //             <div className="p-5">
// //               <p className="text-gray-700">Are you sure you want to logout?</p>
// //               <p className="text-sm text-gray-500 mt-2">You will need to login again to access your account.</p>
// //             </div>
// //             <div className="flex justify-end gap-3 p-5 border-t border-gray-200">
// //               <button
// //                 onClick={() => setShowLogoutConfirm(false)}
// //                 className="px-4 py-2 border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 transition"
// //               >
// //                 Cancel
// //               </button>
// //               <button
// //                 onClick={handleLogout}
// //                 className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
// //               >
// //                 Yes, Logout
// //               </button>
// //             </div>
// //           </div>
// //         </div>
// //       )}
// //     </>
// //   );
// // }

// import React, { useMemo, useState, useEffect } from 'react';
// import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
// import { useDispatch, useSelector } from 'react-redux';
// import { useNavigate } from 'react-router-dom';
// import {
//   ChefHat,
//   Clock3,
//   PackageCheck,
//   RefreshCw,
//   Users,
//   Eye,
//   CheckCircle,
//   Clock,
//   TrendingUp,
//   UserCheck,
//   Bell,
//   Grid3x3,
//   List,
//   ChevronLeft,
//   ChevronRight,
//   X,
//   MapPin,
//   Phone,
//   Mail,
//   Calendar,
//   MessageCircle,
//   Receipt,
//   ShoppingBag,
//   Truck,
//   Home,
//   Store,
//   Pizza,
//   Coffee,
//   UtensilsCrossed,
//   Sparkles,
//   Layers3,
//   AlertTriangle,
//   ChevronDown,
//   ChevronUp,
//   Package,
//   Plus,
//   Pencil,
//   Trash2,
//   Save,
//   BoxesIcon,
//   Search,
//   Trash,
//   Filter,
//   CalendarDays,
//   LogOut,
//   GripVertical,
// } from 'lucide-react';
// import toast from 'react-hot-toast';
// import api from '../../services/api';
// import presenceService from '../../services/presenceService';
// import { logoutUser } from '../../store/slices/authSlice';
// import { KitchenWasteLog } from './KitchenWasteLog';
// import LowStockAlert from './LowStockAlert';

// // ─── Constants ───────────────────────────────────────────────────────────────

// const STEP_LABELS = {
//   placed: 'Order Placed',
//   confirmed: 'Confirmed',
//   preparing: 'Preparing',
//   ready: 'Ready for Pickup',
// };

// const STATUS_COLORS = {
//   placed: 'bg-orange-100 text-orange-700 border-orange-200',
//   confirmed: 'bg-blue-100 text-blue-700 border-blue-200',
//   preparing: 'bg-purple-100 text-purple-700 border-purple-200',
//   ready: 'bg-green-100 text-green-700 border-green-200',
//   completed: 'bg-emerald-100 text-emerald-700 border-emerald-200',
//   cancelled: 'bg-red-100 text-red-700 border-red-200',
// };

// const ORDER_TYPE_ICONS = {
//   'delivery': Truck,
//   'takeaway': Home,
//   'dine-in': Store,
//   'pre-order': Calendar,
// };

// const ORDER_TYPE_LABELS = {
//   'delivery': 'Delivery',
//   'takeaway': 'Takeaway',
//   'dine-in': 'Dine-in',
//   'pre-order': 'Pre-order',
// };

// // Inventory Constants
// const UNITS = ['kg', 'g', 'L', 'ml', 'pcs', 'dozen', 'box', 'bag', 'bottle'];
// const INVENTORY_CATEGORIES = [
//   'Vegetables',
//   'Fruits',
//   'Dairy',
//   'Meat & Seafood',
//   'Grains & Pulses',
//   'Spices',
//   'Oils & Condiments',
//   'Beverages',
//   'Other',
// ];

// const normalizeInventoryCategory = (value) => {
//   const raw = String(value || '').trim().toLowerCase();
//   if (!raw) return 'Other';
//   const match = INVENTORY_CATEGORIES.find(
//     (category) => category.toLowerCase() === raw
//   );
//   return match || 'Other';
// };

// // const FOOD_INVENTORY_TEMPLATES = [
// //   {
// //     id: 'burger',
// //     label: 'Burger Set',
// //     description: 'Bun, patty, cheese, veggies, sauce',
// //     items: [
// //       { name: 'Burger Bun', category: 'Other', quantity: '30', unit: 'pcs', minStock: '10', notes: 'Burger base bread' },
// //       { name: 'Burger Patty', category: 'Other', quantity: '25', unit: 'pcs', minStock: '8', notes: 'Veg or non-veg tikki/patty' },
// //       { name: 'Cheese Slice', category: 'Dairy', quantity: '40', unit: 'pcs', minStock: '12', notes: 'Used in burgers and sandwiches' },
// //       { name: 'Lettuce', category: 'Vegetables', quantity: '6', unit: 'kg', minStock: '2', notes: 'Fresh burger lettuce' },
// //       { name: 'Tomato', category: 'Vegetables', quantity: '12', unit: 'kg', minStock: '4', notes: 'Burger slices and salad' },
// //       { name: 'Burger Sauce', category: 'Oils & Condiments', quantity: '8', unit: 'bottle', minStock: '3', notes: 'Burger mayo or sauce bottle' },
// //     ],
// //   },
// //   {
// //     id: 'pizza',
// //     label: 'Pizza Set',
// //     description: 'Base, cheese, sauce, toppings',
// //     items: [
// //       { name: 'Pizza Base', category: 'Grains & Pulses', quantity: '40', unit: 'pcs', minStock: '12', notes: 'Pizza base stock' },
// //       { name: 'Mozzarella Cheese', category: 'Dairy', quantity: '10', unit: 'kg', minStock: '3', notes: 'Pizza cheese block/shred' },
// //       { name: 'Pizza Sauce', category: 'Oils & Condiments', quantity: '6', unit: 'bottle', minStock: '2', notes: 'Pizza sauce bottles' },
// //       { name: 'Capsicum', category: 'Vegetables', quantity: '8', unit: 'kg', minStock: '3', notes: 'Pizza toppings' },
// //       { name: 'Onion', category: 'Vegetables', quantity: '10', unit: 'kg', minStock: '3', notes: 'Pizza toppings' },
// //       { name: 'Oregano Seasoning', category: 'Spices', quantity: '20', unit: 'box', minStock: '5', notes: 'Pizza herbs' },
// //     ],
// //   },
// //   {
// //     id: 'tea-coffee',
// //     label: 'Tea/Coffee Set',
// //     description: 'Milk, powder, tea, sugar',
// //     items: [
// //       { name: 'Milk', category: 'Dairy', quantity: '25', unit: 'L', minStock: '10', notes: 'Tea and coffee milk' },
// //       { name: 'Coffee Powder', category: 'Beverages', quantity: '4', unit: 'kg', minStock: '1', notes: 'Coffee base powder' },
// //       { name: 'Tea Leaves', category: 'Beverages', quantity: '3', unit: 'kg', minStock: '1', notes: 'Tea stock' },
// //       { name: 'Sugar', category: 'Other', quantity: '15', unit: 'kg', minStock: '5', notes: 'Sweetener stock' },
// //       { name: 'Paper Cup', category: 'Other', quantity: '100', unit: 'pcs', minStock: '30', notes: 'Takeaway hot beverage cups' },
// //     ],
// //   },
// //   {
// //     id: 'sandwich',
// //     label: 'Sandwich Set',
// //     description: 'Bread, butter, cheese, veggies',
// //     items: [
// //       { name: 'Sandwich Bread', category: 'Other', quantity: '35', unit: 'pcs', minStock: '10', notes: 'Bread slices or loaves' },
// //       { name: 'Butter', category: 'Dairy', quantity: '5', unit: 'kg', minStock: '2', notes: 'Sandwich spread' },
// //       { name: 'Cheese Slice', category: 'Dairy', quantity: '40', unit: 'pcs', minStock: '12', notes: 'Sandwich cheese' },
// //       { name: 'Cucumber', category: 'Vegetables', quantity: '8', unit: 'kg', minStock: '3', notes: 'Sandwich filling' },
// //       { name: 'Sandwich Spread', category: 'Oils & Condiments', quantity: '5', unit: 'bottle', minStock: '2', notes: 'Mayo or sauce' },
// //     ],
// //   },
// // ];

// // Date filter options
// const DATE_FILTERS = {
//   ALL: 'all',
//   TODAY: 'today',
//   YESTERDAY: 'yesterday',
//   THIS_WEEK: 'this_week',
//   LAST_WEEK: 'last_week',
//   THIS_MONTH: 'this_month',
//   CUSTOM: 'custom',
// };

// const getDateRange = (filter, customStart, customEnd) => {
//   const now = new Date();
//   const start = new Date();
//   const end = new Date();
  
//   switch(filter) {
//     case DATE_FILTERS.ALL:
//       return { start: null, end: null };

//     case DATE_FILTERS.TODAY:
//       start.setHours(0, 0, 0, 0);
//       end.setHours(23, 59, 59, 999);
//       return { start, end };
    
//     case DATE_FILTERS.YESTERDAY:
//       start.setDate(now.getDate() - 1);
//       start.setHours(0, 0, 0, 0);
//       end.setDate(now.getDate() - 1);
//       end.setHours(23, 59, 59, 999);
//       return { start, end };
    
//     case DATE_FILTERS.THIS_WEEK:
//       const day = now.getDay();
//       start.setDate(now.getDate() - day);
//       start.setHours(0, 0, 0, 0);
//       end.setDate(start.getDate() + 6);
//       end.setHours(23, 59, 59, 999);
//       return { start, end };
    
//     case DATE_FILTERS.LAST_WEEK:
//       start.setDate(now.getDate() - now.getDay() - 7);
//       start.setHours(0, 0, 0, 0);
//       end.setDate(start.getDate() + 6);
//       end.setHours(23, 59, 59, 999);
//       return { start, end };
    
//     case DATE_FILTERS.THIS_MONTH:
//       start.setDate(1);
//       start.setHours(0, 0, 0, 0);
//       end.setMonth(now.getMonth() + 1);
//       end.setDate(0);
//       end.setHours(23, 59, 59, 999);
//       return { start, end };
    
//     case DATE_FILTERS.CUSTOM:
//       return { start: customStart, end: customEnd };
    
//     default:
//       return { start: null, end: null };
//   }
// };

// // Voice notification function
// // const playReadyNotification = (orderId, customerName) => {
// //   if ('speechSynthesis' in window) {
// //     const message = `Order ${orderId} for ${customerName} is ready for pickup`;
// //     const utterance = new SpeechSynthesisUtterance(message);
// //     utterance.rate = 0.9;
// //     utterance.pitch = 1;
// //     utterance.volume = 1;
// //     window.speechSynthesis.cancel();
// //     window.speechSynthesis.speak(utterance);
    
// //     try {
// //       const audioContext = new (window.AudioContext || window.webkitAudioContext)();
// //       const oscillator = audioContext.createOscillator();
// //       const gainNode = audioContext.createGain();
// //       oscillator.connect(gainNode);
// //       gainNode.connect(audioContext.destination);
// //       oscillator.frequency.value = 880;
// //       gainNode.gain.value = 0.3;
// //       oscillator.start();
// //       gainNode.gain.exponentialRampToValueAtTime(0.00001, audioContext.currentTime + 1);
// //       oscillator.stop(audioContext.currentTime + 0.5);
// //     } catch (e) {
// //       console.log('Audio beep not supported');
// //     }
// //   }
// // };

// // // ─── Inventory Form Component ────────────────────────────────────────────────

// const EMPTY_FORM = {
//   name: '',
//   category: INVENTORY_CATEGORIES[0],
//   quantity: '',
//   unit: UNITS[0],
//   minStock: '',
//   supplier: '',
//   notes: '',
// };

// function InventoryForm({ initial = EMPTY_FORM, onSave, onCancel, loading }) {
//   const [form, setForm] = useState(initial);

//   const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     if (!form.name.trim() || !form.quantity) return toast.error('Name and quantity are required');
//     onSave(form);
//   };

//   return (
//     <form onSubmit={handleSubmit} className="space-y-3">
//       <div>
//         <label className="mb-1 block text-xs font-semibold text-stone-500 uppercase tracking-wide">
//           Item Name *
//         </label>
//         <input
//           value={form.name}
//           onChange={set('name')}
//           placeholder="e.g. Basmati Rice"
//           className="w-full rounded-xl border border-stone-200 bg-stone-50 px-3 py-2 text-sm text-slate-800 outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100"
//         />
//       </div>

//       <div className="grid grid-cols-2 gap-2">
//         <div>
//           <label className="mb-1 block text-xs font-semibold text-stone-500 uppercase tracking-wide">
//             Category
//           </label>
//           <select
//             value={form.category}
//             onChange={set('category')}
//             className="w-full rounded-xl border border-stone-200 bg-stone-50 px-3 py-2 text-sm text-slate-800 outline-none focus:border-amber-400"
//           >
//             {INVENTORY_CATEGORIES.map((c) => (
//               <option key={c}>{c}</option>
//             ))}
//           </select>
//         </div>
//         <div>
//           <label className="mb-1 block text-xs font-semibold text-stone-500 uppercase tracking-wide">
//             Unit
//           </label>
//           <select
//             value={form.unit}
//             onChange={set('unit')}
//             className="w-full rounded-xl border border-stone-200 bg-stone-50 px-3 py-2 text-sm text-slate-800 outline-none focus:border-amber-400"
//           >
//             {UNITS.map((u) => (
//               <option key={u}>{u}</option>
//             ))}
//           </select>
//         </div>
//       </div>

//       <div className="grid grid-cols-2 gap-2">
//         <div>
//           <label className="mb-1 block text-xs font-semibold text-stone-500 uppercase tracking-wide">
//             Quantity *
//           </label>
//           <input
//             type="number"
//             min="0"
//             step="0.01"
//             value={form.quantity}
//             onChange={set('quantity')}
//             placeholder="0"
//             className="w-full rounded-xl border border-stone-200 bg-stone-50 px-3 py-2 text-sm text-slate-800 outline-none focus:border-amber-400"
//           />
//         </div>
//         <div>
//           <label className="mb-1 block text-xs font-semibold text-stone-500 uppercase tracking-wide">
//             Min Stock
//           </label>
//           <input
//             type="number"
//             min="0"
//             step="0.01"
//             value={form.minStock}
//             onChange={set('minStock')}
//             placeholder="0"
//             className="w-full rounded-xl border border-stone-200 bg-stone-50 px-3 py-2 text-sm text-slate-800 outline-none focus:border-amber-400"
//           />
//         </div>
//       </div>

//       <div>
//         <label className="mb-1 block text-xs font-semibold text-stone-500 uppercase tracking-wide">
//           Supplier
//         </label>
//         <input
//           value={form.supplier}
//           onChange={set('supplier')}
//           placeholder="Supplier name"
//           className="w-full rounded-xl border border-stone-200 bg-stone-50 px-3 py-2 text-sm text-slate-800 outline-none focus:border-amber-400"
//         />
//       </div>

//       <div>
//         <label className="mb-1 block text-xs font-semibold text-stone-500 uppercase tracking-wide">
//           Notes
//         </label>
//         <textarea
//           rows={2}
//           value={form.notes}
//           onChange={set('notes')}
//           placeholder="Optional notes..."
//           className="w-full rounded-xl border border-stone-200 bg-stone-50 px-3 py-2 text-sm text-slate-800 outline-none focus:border-amber-400 resize-none"
//         />
//       </div>

//       <div className="flex gap-2 pt-1">
//         <button
//           type="submit"
//           disabled={loading}
//           className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-amber-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-amber-600 disabled:opacity-60"
//         >
//           <Save size={14} />
//           {loading ? 'Saving…' : 'Save Item'}
//         </button>
//         <button
//           type="button"
//           onClick={onCancel}
//           className="flex items-center justify-center gap-2 rounded-xl border border-stone-200 bg-white px-4 py-2 text-sm font-semibold text-stone-600 transition hover:bg-stone-50"
//         >
//           <X size={14} />
//           Cancel
//         </button>
//       </div>
//     </form>
//   );
// }

// // ─── Inventory Sidebar Component ────────────────────────────────────────────

// function InventorySidebar({ open, onClose }) {
//   const queryClient = useQueryClient();
//   const [mode, setMode] = useState('list');
//   const [editTarget, setEditTarget] = useState(null);
//   const [deleteTarget, setDeleteTarget] = useState(null);
//   const [filterCat, setFilterCat] = useState('All');
//   const [search, setSearch] = useState('');
//   const [sidebarWidth, setSidebarWidth] = useState(680);
//   const [isResizing, setIsResizing] = useState(false);

//   const inventoryQuery = useQuery({
//     queryKey: ['kitchen-inventory'],
//     queryFn: () => api.get('/inventory').then((r) => r.data),
//     enabled: open,
//   });

//   const items = (Array.isArray(inventoryQuery.data)
//     ? inventoryQuery.data
//     : Array.isArray(inventoryQuery.data?.data) ? inventoryQuery.data.data
//     : Array.isArray(inventoryQuery.data?.items) ? inventoryQuery.data.items
//     : Array.isArray(inventoryQuery.data?.inventory) ? inventoryQuery.data.inventory
//     : []).map((item) => ({
//       ...item,
//       category: normalizeInventoryCategory(item.category),
//       quantity: item.quantity ?? item.currentStock ?? 0,
//       minStock: item.minStock ?? item.reorderLevel ?? 0,
//       supplier: item.supplier?.name || item.supplier || '',
//     }));

//   const availableCategories = [
//     'All',
//     ...INVENTORY_CATEGORIES.filter((category) =>
//       items.some((item) => item.category === category)
//     ),
//   ];

//   useEffect(() => {
//     if (!open || typeof window === 'undefined') return;
//     const savedWidth = Number(window.localStorage.getItem('kitchenInventorySidebarWidth'));
//     if (savedWidth) {
//       setSidebarWidth(Math.min(860, Math.max(420, savedWidth)));
//     }
//   }, [open]);

//   useEffect(() => {
//     if (typeof window === 'undefined') return;
//     window.localStorage.setItem('kitchenInventorySidebarWidth', String(sidebarWidth));
//   }, [sidebarWidth]);

//   useEffect(() => {
//     if (!open) return undefined;
//     const previousOverflow = document.body.style.overflow;
//     document.body.style.overflow = 'hidden';
//     return () => {
//       document.body.style.overflow = previousOverflow;
//     };
//   }, [open]);

//   useEffect(() => {
//     if (!isResizing || typeof window === 'undefined') return undefined;

//     const handleMove = (event) => {
//       const nextWidth = window.innerWidth - event.clientX;
//       setSidebarWidth(Math.min(860, Math.max(420, nextWidth)));
//     };

//     const handleUp = () => setIsResizing(false);

//     window.addEventListener('mousemove', handleMove);
//     window.addEventListener('mouseup', handleUp);

//     return () => {
//       window.removeEventListener('mousemove', handleMove);
//       window.removeEventListener('mouseup', handleUp);
//     };
//   }, [isResizing]);

//   const addMutation = useMutation({
//     mutationFn: (data) =>
//       api.post('/inventory', {
//         name: data.name,
//         category: data.category,
//         currentStock: Number(data.quantity || 0),
//         unit: data.unit,
//         reorderLevel: Number(data.minStock || 0),
//         supplier: data.supplier || '',
//         notes: data.notes || '',
//       }),
//     onSuccess: () => {
//       toast.success('Item added successfully');
//       queryClient.invalidateQueries({ queryKey: ['kitchen-inventory'] });
//       setMode('list');
//     },
//     onError: (err) => toast.error(err.response?.data?.message || 'Failed to add item'),
//   });

//   const updateMutation = useMutation({
//     mutationFn: ({ id, data }) =>
//       api.patch(`/inventory/${id}`, {
//         name: data.name,
//         category: data.category,
//         currentStock: Number(data.quantity || 0),
//         unit: data.unit,
//         reorderLevel: Number(data.minStock || 0),
//         supplier: data.supplier || '',
//         notes: data.notes || '',
//       }),
//     onSuccess: () => {
//       toast.success('Item updated successfully');
//       queryClient.invalidateQueries({ queryKey: ['kitchen-inventory'] });
//       setMode('list');
//       setEditTarget(null);
//     },
//     onError: (err) => toast.error(err.response?.data?.message || 'Failed to update item'),
//   });

//   const deleteMutation = useMutation({
//     mutationFn: (id) => api.delete(`/inventory/${id}`),
//     onSuccess: () => {
//       toast.success('Item deleted successfully');
//       queryClient.invalidateQueries({ queryKey: ['kitchen-inventory'] });
//       setDeleteTarget(null);
//     },
//     onError: (err) => toast.error(err.response?.data?.message || 'Failed to delete item'),
//   });

//   const templateMutation = useMutation({
//     mutationFn: async (template) => {
//       const existingNames = new Set(items.map((item) => item.name?.trim().toLowerCase()));
//       const missingItems = template.items.filter(
//         (item) => !existingNames.has(item.name.trim().toLowerCase())
//       );

//       if (missingItems.length === 0) {
//         return { createdCount: 0, skippedCount: template.items.length };
//       }

//       await Promise.all(
//         missingItems.map((item) =>
//           api.post('/inventory', {
//             name: item.name,
//             category: item.category,
//             currentStock: Number(item.quantity || 0),
//             unit: item.unit,
//             reorderLevel: Number(item.minStock || 0),
//             supplier: '',
//             notes: item.notes || '',
//           })
//         )
//       );

//       return {
//         createdCount: missingItems.length,
//         skippedCount: template.items.length - missingItems.length,
//       };
//     },
//     onSuccess: ({ createdCount, skippedCount }, template) => {
//       queryClient.invalidateQueries({ queryKey: ['kitchen-inventory'] });
//       if (createdCount > 0 && skippedCount > 0) {
//         toast.success(`${template.label}: ${createdCount} items added, ${skippedCount} already existed`);
//       } else if (createdCount > 0) {
//         toast.success(`${template.label}: ${createdCount} items added`);
//       } else {
//         toast(`All ${template.label} items already exist`, { icon: 'ℹ️' });
//       }
//     },
//     onError: (err) => toast.error(err.response?.data?.message || 'Failed to add template items'),
//   });

//   const filtered = items.filter((item) => {
//     const matchCat = filterCat === 'All' || item.category === filterCat;
//     const matchSearch = item.name.toLowerCase().includes(search.toLowerCase());
//     return matchCat && matchSearch;
//   });

//   const lowStock = items.filter(
//     (item) => item.minStock && Number(item.quantity) <= Number(item.minStock)
//   );

//   const handleEdit = (item) => {
//     setEditTarget(item);
//     setMode('edit');
//   };

//   const handleDelete = (item) => {
//     setDeleteTarget(item);
//   };

//   if (!open) return null;

//   return (
//     <>
//       <div className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm" onClick={onClose} />
//       <aside
//         className="fixed right-0 top-0 z-50 flex h-full max-w-[96vw] flex-col overflow-y-auto bg-white shadow-2xl overscroll-contain"
//         style={{ width: `min(${sidebarWidth}px, 96vw)` }}
//       >
//         <button
//           type="button"
//           onMouseDown={() => setIsResizing(true)}
//           className="absolute left-0 top-0 h-full w-3 -translate-x-1/2 cursor-col-resize bg-transparent"
//           aria-label="Resize inventory sidebar"
//         >
//           <span className="absolute left-1/2 top-1/2 flex h-16 w-1 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-stone-300/80">
//             <GripVertical size={14} className="text-stone-600" />
//           </span>
//         </button>
//         <div className="flex items-center justify-between border-b border-stone-100 px-5 py-4">
//           <div className="flex items-center gap-3">
//             <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-100 text-amber-700">
//               <BoxesIcon size={18} />
//             </div>
//             <div>
//               <h2 className="font-bold text-slate-800">Kitchen Inventory</h2>
//               <p className="text-xs text-stone-400">{items.length} items tracked</p>
//             </div>
//           </div>
//           <button
//             onClick={onClose}
//             className="flex h-8 w-8 items-center justify-center rounded-full border border-stone-200 text-stone-500 transition hover:bg-stone-50"
//           >
//             <X size={16} />
//           </button>
//         </div>

//         <div className="flex items-center justify-between gap-3 border-b border-stone-100 px-5 py-3">
//           <div>
//             <p className="text-xs font-semibold uppercase tracking-wide text-stone-400">Sidebar Size</p>
//             <p className="text-xs text-stone-500">Drag the left edge or use quick widths.</p>
//           </div>
//           <div className="flex gap-2">
//             {[
//               { label: 'S', value: 520 },
//               { label: 'M', value: 680 },
//               { label: 'L', value: 820 },
//             ].map((size) => (
//               <button
//                 key={size.label}
//                 type="button"
//                 onClick={() => setSidebarWidth(size.value)}
//                 className={`rounded-full px-3 py-1 text-xs font-semibold transition ${
//                   Math.abs(sidebarWidth - size.value) < 30
//                     ? 'bg-amber-500 text-white'
//                     : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
//                 }`}
//               >
//                 {size.label}
//               </button>
//             ))}
//           </div>
//         </div>

//         {lowStock.length > 0 && mode === 'list' && (
//           <div className="mx-4 mt-3 flex items-start gap-2 rounded-xl border border-rose-100 bg-rose-50 px-3 py-2 text-xs text-rose-700">
//             <AlertTriangle size={14} className="mt-0.5 shrink-0" />
//             <span>
//               <strong>{lowStock.length} item(s)</strong> are at or below minimum stock level.
//             </span>
//           </div>
//         )}

//         <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
//           {mode === 'list' && (
//             <>
//               <div className="space-y-2 px-4 pt-3 pb-2">
//                 <div className="flex gap-2">
//                   <div className="relative flex-1">
//                     <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
//                     <input
//                       value={search}
//                       onChange={(e) => setSearch(e.target.value)}
//                       placeholder="Search items..."
//                       className="w-full rounded-xl border border-stone-200 bg-stone-50 pl-9 pr-3 py-2 text-sm outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100"
//                     />
//                   </div>
//                   <button
//                     onClick={() => setMode('add')}
//                     className="flex items-center gap-1.5 rounded-xl bg-amber-500 px-3 py-2 text-sm font-semibold text-white transition hover:bg-amber-600"
//                   >
//                     <Plus size={15} />
//                     Add Item
//                   </button>
//                 </div>
//                 <div className="flex gap-1.5 overflow-x-auto pb-1">
//                   {availableCategories.map((cat) => (
//                     <button
//                       key={cat}
//                       onClick={() => setFilterCat(cat)}
//                       className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold transition ${
//                         filterCat === cat
//                           ? 'bg-amber-500 text-white'
//                           : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
//                       }`}
//                     >
//                       {cat}
//                     </button>
//                   ))}
//                 </div>
//               </div>

//               <div className="flex-1 overflow-y-auto overscroll-contain px-4 pb-4">
//                 {inventoryQuery.isLoading ? (
//                   <div className="py-12 text-center text-sm text-stone-400">Loading inventory...</div>
//                 ) : filtered.length === 0 ? (
//                   <div className="rounded-2xl border border-dashed border-stone-200 bg-stone-50 py-10 text-center text-sm text-stone-400">
//                     {search ? 'No items match your search.' : 'No inventory items yet. Add one!'}
//                   </div>
//                 ) : (
//                   <div className="space-y-2">
//                     {filtered.map((item) => {
//                       const isLow = item.minStock && Number(item.quantity) <= Number(item.minStock);
//                       return (
//                         <div
//                           key={item._id}
//                           className={`rounded-2xl border p-3 transition ${
//                             isLow ? 'border-rose-100 bg-rose-50/60' : 'border-stone-200 bg-stone-50'
//                           }`}
//                         >
//                           <div className="flex items-start justify-between gap-2">
//                             <div className="min-w-0 flex-1">
//                               <div className="flex items-center gap-2">
//                                 <p className="truncate font-semibold text-slate-800">{item.name}</p>
//                                 {isLow && (
//                                   <span className="shrink-0 rounded-full bg-rose-100 px-2 py-0.5 text-xs font-semibold text-rose-600">
//                                     Low Stock
//                                   </span>
//                                 )}
//                               </div>
//                               <p className="mt-0.5 text-xs text-stone-500">
//                                 {item.category}
//                                 {item.supplier ? ` · ${item.supplier}` : ''}
//                               </p>
//                             </div>
//                             <div className="flex shrink-0 items-center gap-1.5">
//                               <span className="rounded-xl bg-white px-2.5 py-1 text-sm font-bold text-slate-700 ring-1 ring-stone-200">
//                                 {item.quantity} {item.unit}
//                               </span>
//                             </div>
//                           </div>

//                           {item.minStock && (
//                             <div className="mt-2">
//                               <div className="mb-1 flex justify-between text-xs text-stone-400">
//                                 <span>Stock level</span>
//                                 <span>min {item.minStock} {item.unit}</span>
//                               </div>
//                               <div className="h-1.5 w-full overflow-hidden rounded-full bg-stone-200">
//                                 <div
//                                   className={`h-full rounded-full transition-all ${
//                                     isLow ? 'bg-rose-400' : 'bg-emerald-400'
//                                   }`}
//                                   style={{
//                                     width: `${Math.min(
//                                       100,
//                                       (Number(item.quantity) / (Number(item.minStock) * 3)) * 100
//                                     )}%`,
//                                   }}
//                                 />
//                               </div>
//                             </div>
//                           )}

//                           {item.notes && (
//                             <p className="mt-2 text-xs text-stone-400 italic">{item.notes}</p>
//                           )}

//                           <div className="mt-3 flex gap-2">
//                             <button
//                               onClick={() => handleEdit(item)}
//                               className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-stone-200 bg-white py-1.5 text-xs font-semibold text-slate-600 transition hover:border-amber-300 hover:text-amber-600"
//                             >
//                               <Pencil size={12} />
//                               Edit Item
//                             </button>
//                             <button
//                               onClick={() => handleDelete(item)}
//                               className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-stone-200 bg-white py-1.5 text-xs font-semibold text-slate-600 transition hover:border-rose-200 hover:text-rose-600"
//                             >
//                               <Trash2 size={12} />
//                               Remove Item
//                             </button>
//                           </div>
//                         </div>
//                       );
//                     })}
//                   </div>
//                 )}
//               </div>
//             </>
//           )}

//           {mode === 'add' && (
//             <div className="flex-1 overflow-y-auto overscroll-contain px-4 pt-4 pb-4">
//               <div className="mb-4">
//                 <h3 className="font-bold text-slate-800">Add New Item</h3>
//                 <p className="text-xs text-stone-400 mt-0.5">Fill in the details below</p>
//               </div>
//               <InventoryForm
//                 onSave={(data) => addMutation.mutate(data)}
//                 onCancel={() => setMode('list')}
//                 loading={addMutation.isPending}
//               />
//             </div>
//           )}

//           {mode === 'edit' && editTarget && (
//             <div className="flex-1 overflow-y-auto overscroll-contain px-4 pt-4 pb-4">
//               <div className="mb-4">
//                 <h3 className="font-bold text-slate-800">Edit Item</h3>
//                 <p className="text-xs text-stone-400 mt-0.5">{editTarget.name}</p>
//               </div>
//               <InventoryForm
//                 initial={{
//                   name: editTarget.name || '',
//                   category: editTarget.category || INVENTORY_CATEGORIES[0],
//                   quantity: editTarget.quantity ?? '',
//                   unit: editTarget.unit || UNITS[0],
//                   minStock: editTarget.minStock ?? '',
//                   supplier: editTarget.supplier || '',
//                   notes: editTarget.notes || '',
//                 }}
//                 onSave={(data) => updateMutation.mutate({ id: editTarget._id, data })}
//                 onCancel={() => { setMode('list'); setEditTarget(null); }}
//                 loading={updateMutation.isPending}
//               />
//             </div>
//           )}
//         </div>

//         {deleteTarget && (
//           <div className="absolute inset-0 z-50 flex items-center justify-center bg-slate-900/30 px-4 backdrop-blur-[2px]">
//             <div className="w-full max-w-sm rounded-3xl border border-rose-100 bg-white p-5 shadow-[0_24px_80px_rgba(15,23,42,0.24)]">
//               <div className="flex items-start gap-3">
//                 <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-rose-100 text-rose-600">
//                   <Trash2 size={18} />
//                 </div>
//                 <div className="min-w-0 flex-1">
//                   <p className="text-lg font-bold text-slate-800">Remove Inventory Item?</p>
//                   <p className="mt-1 text-sm text-stone-500">
//                     This will permanently remove <span className="font-semibold text-slate-700">{deleteTarget.name}</span> from the inventory list.
//                   </p>
//                 </div>
//               </div>
//               <div className="mt-5 rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm text-stone-600">
//                 This action cannot be undone. The item will be deleted from the system.
//               </div>
//               <div className="mt-5 flex justify-end gap-2">
//                 <button
//                   onClick={() => setDeleteTarget(null)}
//                   className="rounded-xl border border-stone-200 bg-white px-4 py-2 text-sm font-semibold text-stone-600 transition hover:bg-stone-50"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   onClick={() => deleteMutation.mutate(deleteTarget._id)}
//                   disabled={deleteMutation.isPending}
//                   className="rounded-xl bg-rose-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-rose-600 disabled:cursor-not-allowed disabled:opacity-60"
//                 >
//                   {deleteMutation.isPending ? 'Removing...' : 'Yes, Remove Item'}
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}
//       </aside>
//     </>
//   );
// }

// // ─── Order Details Modal Component ──────────────────────────────────────────

// function OrderDetailsModal({ order, onClose }) {
//   if (!order) return null;

//   const totalAmount = order.totalAmount || order.total || 0;
//   const OrderTypeIcon = ORDER_TYPE_ICONS[order.orderType?.toLowerCase()] || ShoppingBag;

//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
//       <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
//         <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
//           <div className="flex items-center gap-3">
//             <div className="p-2 bg-amber-100 rounded-xl">
//               <Receipt size={20} className="text-amber-600" />
//             </div>
//             <div>
//               <h2 className="text-xl font-bold text-gray-900">Order Details</h2>
//               <p className="text-sm text-gray-500 font-mono">
//                 #{order.orderId || order._id?.slice(-6)}
//               </p>
//             </div>
//           </div>
//           <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
//             <X size={20} className="text-gray-500" />
//           </button>
//         </div>

//         <div className="p-6">
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
//             <div className="bg-gray-50 rounded-xl p-4">
//               <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
//                 <Users size={16} /> Customer Information
//               </h3>
//               <div className="space-y-2">
//                 <p className="text-sm">
//                   <span className="font-medium text-gray-700">Name:</span>{' '}
//                   <span className="text-gray-900">{order.customerName || order.customer?.name || 'Guest'}</span>
//                 </p>
//                 {order.customer?.email && (
//                   <p className="text-sm flex items-center gap-2">
//                     <Mail size={14} className="text-gray-400" />
//                     <span className="text-gray-600">{order.customer.email}</span>
//                   </p>
//                 )}
//                 {order.customer?.phone && (
//                   <p className="text-sm flex items-center gap-2">
//                     <Phone size={14} className="text-gray-400" />
//                     <span className="text-gray-600">{order.customer.phone}</span>
//                   </p>
//                 )}
//               </div>
//             </div>

//             <div className="bg-gray-50 rounded-xl p-4">
//               <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
//                 <ShoppingBag size={16} /> Order Information
//               </h3>
//               <div className="space-y-2">
//                 <p className="text-sm flex items-center justify-between">
//                   <span className="font-medium text-gray-700">Order Type:</span>
//                   <span className="flex items-center gap-1 capitalize">
//                     <OrderTypeIcon size={14} />
//                     {ORDER_TYPE_LABELS[order.orderType?.toLowerCase()] || order.orderType || 'Dine-in'}
//                   </span>
//                 </p>
//                 <p className="text-sm flex items-center justify-between">
//                   <span className="font-medium text-gray-700">Order Status:</span>
//                   <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${STATUS_COLORS[order.status]}`}>
//                     {order.status}
//                   </span>
//                 </p>
//                 <p className="text-sm flex items-center justify-between">
//                   <span className="font-medium text-gray-700">Order Date:</span>
//                   <span className="text-gray-600">
//                     {new Date(order.createdAt).toLocaleString()}
//                   </span>
//                 </p>
//               </div>
//             </div>
//           </div>

//           <div className="mb-6">
//             <h3 className="text-sm font-semibold text-gray-700 mb-3">Order Items</h3>
//             <div className="border border-gray-200 rounded-xl overflow-hidden">
//               <table className="w-full">
//                 <thead className="bg-gray-50">
//                   <tr>
//                     <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Item</th>
//                     <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase">Qty</th>
//                     <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase">Price</th>
//                     <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase">Subtotal</th>
//                   </tr>
//                 </thead>
//                 <tbody className="divide-y divide-gray-200">
//                   {(order.items || []).map((item, idx) => (
//                     <tr key={idx}>
//                       <td className="px-4 py-3">
//                         <p className="font-medium text-gray-900">{item.name || item.menuItem?.name}</p>
//                         {item.specialInstructions && (
//                           <p className="text-xs text-gray-500 mt-1">{item.specialInstructions}</p>
//                         )}
//                       </td>
//                       <td className="px-4 py-3 text-center">x{item.quantity}</td>
//                       <td className="px-4 py-3 text-right">₹{item.price || item.unitPrice || 0}</td>
//                       <td className="px-4 py-3 text-right font-semibold">
//                         ₹{((item.price || item.unitPrice || 0) * item.quantity).toFixed(2)}
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//                 <tfoot className="bg-gray-50 border-t border-gray-200">
//                   <tr>
//                     <td colSpan="3" className="px-4 py-3 text-right font-bold">Total</td>
//                     <td className="px-4 py-3 text-right font-bold">₹{totalAmount.toFixed(2)}</td>
//                   </tr>
//                 </tfoot>
//               </table>
//             </div>
//           </div>

//           {order.specialNotes && (
//             <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
//               <h3 className="text-sm font-semibold text-amber-800 mb-2">Special Instructions</h3>
//               <p className="text-sm text-amber-700">{order.specialNotes}</p>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

// // ─── Preparation Progress Component ──────────────────────────────────────────

// function PreparationProgress({ status }) {
//   const steps = ['placed', 'confirmed', 'preparing', 'ready'];
//   const currentIndex = steps.indexOf(status);

//   return (
//     <div className="flex items-center justify-between">
//       {steps.map((step, idx) => (
//         <div key={step} className="flex-1 text-center">
//           <div className={`relative ${idx < steps.length - 1 ? 'after:absolute after:top-4 after:left-1/2 after:w-full after:h-0.5 after:bg-gray-200' : ''}`}>
//             <div className={`relative z-10 w-8 h-8 mx-auto rounded-full flex items-center justify-center text-xs font-bold ${
//               currentIndex >= idx ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-500'
//             }`}>
//               {currentIndex > idx ? <CheckCircle size={14} /> : idx + 1}
//             </div>
//           </div>
//           <p className={`text-xs mt-2 ${currentIndex >= idx ? 'text-gray-700 font-medium' : 'text-gray-400'}`}>
//             {STEP_LABELS[step].split(' ')[0]}
//           </p>
//         </div>
//       ))}
//     </div>
//   );
// }

// // ─── StaffCard Component ─────────────────────────────────────────────────────

// function StaffCard({ member }) {
//   const isActive = member.status === 'active';
//   return (
//     <div className={`rounded-lg border p-3 transition-all ${isActive ? 'border-green-200 bg-green-50' : 'border-gray-200 bg-white'}`}>
//       <div className="flex items-start justify-between">
//         <div className="flex-1">
//           <div className="flex items-center gap-2">
//             <div className={`w-2 h-2 rounded-full ${isActive ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`} />
//             <p className="font-medium text-gray-900">{member.name}</p>
//           </div>
//           <p className="text-xs text-gray-500 mt-1 capitalize">{member.role || 'Staff'}</p>
//         </div>
//         {isActive && <UserCheck size={16} className="text-green-600" />}
//       </div>
//     </div>
//   );
// }

// // ─── Pagination Component ────────────────────────────────────────────────────

// function Pagination({ currentPage, totalPages, onPageChange }) {
//   if (totalPages <= 1) return null;

//   return (
//     <div className="flex items-center justify-between px-4 py-3 bg-white border-t border-gray-200 rounded-b-lg">
//       <div className="flex items-center gap-2">
//         <button
//           onClick={() => onPageChange(currentPage - 1)}
//           disabled={currentPage === 1}
//           className="p-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-50"
//         >
//           <ChevronLeft size={16} />
//         </button>
//         <span className="text-sm text-gray-600">
//           Page {currentPage} of {totalPages}
//         </span>
//         <button
//           onClick={() => onPageChange(currentPage + 1)}
//           disabled={currentPage === totalPages}
//           className="p-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-50"
//         >
//           <ChevronRight size={16} />
//         </button>
//       </div>
//     </div>
//   );
// }

// // ─── History Orders Component ────────────────────────────────────────────────

// function HistoryOrders({ orders, onViewOrder }) {
//   const [historyDateFilter, setHistoryDateFilter] = useState(DATE_FILTERS.ALL);
//   const [customStartDate, setCustomStartDate] = useState('');
//   const [customEndDate, setCustomEndDate] = useState('');
//   const [showCustomPicker, setShowCustomPicker] = useState(false);
//   const [historyPage, setHistoryPage] = useState(1);
//   const [historyItemsPerPage] = useState(10);

//   const getFilterLabel = () => {
//     switch(historyDateFilter) {
//       case DATE_FILTERS.ALL: return 'All Time';
//       case DATE_FILTERS.TODAY: return 'Today';
//       case DATE_FILTERS.YESTERDAY: return 'Yesterday';
//       case DATE_FILTERS.THIS_WEEK: return 'This Week';
//       case DATE_FILTERS.LAST_WEEK: return 'Last Week';
//       case DATE_FILTERS.THIS_MONTH: return 'This Month';
//       case DATE_FILTERS.CUSTOM: return 'Custom Range';
//       default: return 'Select Range';
//     }
//   };

//   const filteredOrders = useMemo(() => {
//     const { start, end } = getDateRange(historyDateFilter, customStartDate, customEndDate);
    
//     if (!start || !end) return orders;
    
//     return orders.filter(order => {
//       const orderDate = new Date(order.createdAt);
//       return orderDate >= start && orderDate <= end;
//     });
//   }, [orders, historyDateFilter, customStartDate, customEndDate]);

//   const totalHistoryPages = Math.ceil(filteredOrders.length / historyItemsPerPage);
//   const paginatedHistoryOrders = filteredOrders.slice(
//     (historyPage - 1) * historyItemsPerPage,
//     historyPage * historyItemsPerPage
//   );

//   useEffect(() => {
//     setHistoryPage(1);
//   }, [historyDateFilter, customStartDate, customEndDate]);

//   const stats = {
//     total: filteredOrders.length,
//     completed: filteredOrders.filter(o => o.status === 'completed').length,
//     cancelled: filteredOrders.filter(o => o.status === 'cancelled').length,
//     totalRevenue: filteredOrders.reduce((sum, o) => sum + (o.totalAmount || o.total || 0), 0),
//   };

//   return (
//     <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
//       <div className="p-4 border-b border-gray-200 bg-gray-50">
//         <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
//           <div className="flex items-center gap-2">
//             <CalendarDays size={18} className="text-amber-600" />
//             <h3 className="font-semibold text-gray-900">Order History</h3>
//           </div>
          
//           <div className="flex items-center gap-3 flex-wrap">
//             <div className="relative">
//               <button
//                 onClick={() => setShowCustomPicker(!showCustomPicker)}
//                 className="flex items-center gap-2 px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
//               >
//                 <Filter size={14} />
//                 {getFilterLabel()}
//                 <ChevronDown size={14} />
//               </button>
              
//               {showCustomPicker && (
//                 <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-10 p-3">
//                   <div className="space-y-2">
//                     <button
//                       onClick={() => { setHistoryDateFilter(DATE_FILTERS.ALL); setShowCustomPicker(false); }}
//                       className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 rounded-lg"
//                     >
//                       All Time
//                     </button>
//                     <button
//                       onClick={() => { setHistoryDateFilter(DATE_FILTERS.TODAY); setShowCustomPicker(false); }}
//                       className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 rounded-lg"
//                     >
//                       Today
//                     </button>
//                     <button
//                       onClick={() => { setHistoryDateFilter(DATE_FILTERS.YESTERDAY); setShowCustomPicker(false); }}
//                       className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 rounded-lg"
//                     >
//                       Yesterday
//                     </button>
//                     <button
//                       onClick={() => { setHistoryDateFilter(DATE_FILTERS.THIS_WEEK); setShowCustomPicker(false); }}
//                       className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 rounded-lg"
//                     >
//                       This Week
//                     </button>
//                     <button
//                       onClick={() => { setHistoryDateFilter(DATE_FILTERS.LAST_WEEK); setShowCustomPicker(false); }}
//                       className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 rounded-lg"
//                     >
//                       Last Week
//                     </button>
//                     <button
//                       onClick={() => { setHistoryDateFilter(DATE_FILTERS.THIS_MONTH); setShowCustomPicker(false); }}
//                       className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 rounded-lg"
//                     >
//                       This Month
//                     </button>
//                     <div className="border-t border-gray-200 my-2"></div>
//                     <div className="space-y-2">
//                       <input
//                         type="date"
//                         value={customStartDate}
//                         onChange={(e) => setCustomStartDate(e.target.value)}
//                         className="w-full px-2 py-1 text-sm border border-gray-200 rounded-lg"
//                         placeholder="Start Date"
//                       />
//                       <input
//                         type="date"
//                         value={customEndDate}
//                         onChange={(e) => setCustomEndDate(e.target.value)}
//                         className="w-full px-2 py-1 text-sm border border-gray-200 rounded-lg"
//                         placeholder="End Date"
//                       />
//                       <button
//                         onClick={() => { setHistoryDateFilter(DATE_FILTERS.CUSTOM); setShowCustomPicker(false); }}
//                         className="w-full px-3 py-2 bg-amber-500 text-white text-sm rounded-lg hover:bg-amber-600"
//                         disabled={!customStartDate || !customEndDate}
//                       >
//                         Apply Custom Range
//                       </button>
//                     </div>
//                   </div>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
        
//         <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
//           <div className="bg-white rounded-lg p-2 text-center border border-gray-100">
//             <div className="text-xl font-bold text-gray-900">{stats.total}</div>
//             <div className="text-xs text-gray-500">Total Orders</div>
//           </div>
//           <div className="bg-white rounded-lg p-2 text-center border border-gray-100">
//             <div className="text-xl font-bold text-green-600">{stats.completed}</div>
//             <div className="text-xs text-gray-500">Completed</div>
//           </div>
//           <div className="bg-white rounded-lg p-2 text-center border border-gray-100">
//             <div className="text-xl font-bold text-red-600">{stats.cancelled}</div>
//             <div className="text-xs text-gray-500">Cancelled</div>
//           </div>
//           <div className="bg-white rounded-lg p-2 text-center border border-gray-100">
//             <div className="text-xl font-bold text-amber-600">₹{stats.totalRevenue.toFixed(0)}</div>
//             <div className="text-xs text-gray-500">Revenue</div>
//           </div>
//         </div>
//       </div>

//       {paginatedHistoryOrders.length === 0 ? (
//         <div className="p-8 text-center">
//           <PackageCheck size={40} className="mx-auto text-gray-300 mb-2" />
//           <p className="text-gray-500">No orders found for this period</p>
//         </div>
//       ) : (
//         <>
//           <div className="overflow-x-auto">
//             <table className="w-full text-sm">
//               <thead className="bg-gray-50">
//                 <tr className="text-gray-600">
//                   <th className="px-4 py-3 text-left">Order ID</th>
//                   <th className="px-4 py-3 text-left">Customer</th>
//                   <th className="px-4 py-3 text-left">Type</th>
//                   <th className="px-4 py-3 text-left">Items</th>
//                   <th className="px-4 py-3 text-left">Total</th>
//                   <th className="px-4 py-3 text-left">Status</th>
//                   <th className="px-4 py-3 text-left">Date</th>
//                   <th className="px-4 py-3 text-left">Action</th>
//                 </tr>
//               </thead>
//               <tbody className="divide-y divide-gray-100">
//                 {paginatedHistoryOrders.map(order => {
//                   const OrderTypeIcon = ORDER_TYPE_ICONS[order.orderType?.toLowerCase()] || ShoppingBag;
//                   return (
//                     <tr key={order._id} className="hover:bg-gray-50 transition">
//                       <td className="px-4 py-3 font-mono text-xs text-amber-600">
//                         #{order.orderId || order._id?.slice(-6)}
//                       </td>
//                       <td className="px-4 py-3 font-medium">{order.customerName || order.customer?.name || 'Guest'}</td>
//                       <td className="px-4 py-3">
//                         <span className="flex items-center gap-1 text-xs capitalize">
//                           <OrderTypeIcon size={12} />
//                           {ORDER_TYPE_LABELS[order.orderType?.toLowerCase()] || order.orderType || 'Dine-in'}
//                         </span>
//                       </td>
//                       <td className="px-4 py-3 text-gray-600">{order.items?.length || 0} items</td>
//                       <td className="px-4 py-3 font-semibold">₹{order.totalAmount || order.total || 0}</td>
//                       <td className="px-4 py-3">
//                         <span className={`px-2 py-1 rounded-full text-xs font-semibold ${STATUS_COLORS[order.status]}`}>
//                           {order.status}
//                         </span>
//                       </td>
//                       <td className="px-4 py-3 text-gray-500 text-xs">
//                         {new Date(order.createdAt).toLocaleDateString()}
//                       </td>
//                       <td className="px-4 py-3">
//                         <button
//                           onClick={() => onViewOrder(order)}
//                           className="text-amber-600 hover:text-amber-700 text-sm font-medium"
//                         >
//                           View
//                         </button>
//                       </td>
//                     </tr>
//                   );
//                 })}
//               </tbody>
//             </table>
//           </div>
          
//           {totalHistoryPages > 1 && (
//             <div className="px-4 py-3 border-t border-gray-200 bg-gray-50">
//               <Pagination
//                 currentPage={historyPage}
//                 totalPages={totalHistoryPages}
//                 onPageChange={setHistoryPage}
//               />
//             </div>
//           )}
//         </>
//       )}
//     </div>
//   );
// }

// // ─── Main Component ───────────────────────────────────────────────────────────

// export default function KitchenDisplay() {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const { user } = useSelector((state) => state.auth);
//   const queryClient = useQueryClient();
//   const [expandedOrderId, setExpandedOrderId] = useState(null);
//   const [viewMode, setViewMode] = useState('list');
//   const [statusFilter, setStatusFilter] = useState('all');
//   const [readyPage, setReadyPage] = useState(1);
//   const [readyItemsPerPage] = useState(3);
//   const [selectedOrder, setSelectedOrder] = useState(null);
//   const [inventoryOpen, setInventoryOpen] = useState(false);
//   const [activeTab, setActiveTab] = useState('orders');
//   const [previousReadyOrderIds, setPreviousReadyOrderIds] = useState(new Set());
//   const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

//   // Presence Tracking for Kitchen Staff
//   useEffect(() => {
//     const authUser = JSON.parse(sessionStorage.getItem('authUser') || '{}');
//     if (authUser._id && authUser.role) {
//       presenceService.initialize(authUser._id, authUser.role, 'Kitchen Panel');
//     }
//     return () => {
//       void presenceService.cleanup();
//     };
//   }, []);

//   // Fetch completed/cancelled orders for history
//   const historyQuery = useQuery({
//     queryKey: ['kitchen-orders-history'],
//     queryFn: () => api.get('/kitchen/orders/history').then((res) => res.data),
//     refetchInterval: 30000,
//   });

//   // Queries
//   const ordersQuery = useQuery({
//     queryKey: ['kitchen-orders-active'],
//     queryFn: () => api.get('/kitchen/orders').then((res) => res.data),
//     refetchInterval: 10000,
//   });

//   const readyQuery = useQuery({
//     queryKey: ['kitchen-orders-ready'],
//     queryFn: () => api.get('/kitchen/orders/ready').then((res) => res.data),
//     refetchInterval: 10000,
//   });

//   const statsQuery = useQuery({
//     queryKey: ['kitchen-stats'],
//     queryFn: () => api.get('/kitchen/stats').then((res) => res.data),
//     refetchInterval: 20000,
//   });

//   const teamQuery = useQuery({
//     queryKey: ['kitchen-team'],
//     queryFn: () => api.get('/kitchen/team-status').then((res) => res.data).catch(() => []),
//     refetchInterval: 30000,
//   });

//   // Mutations
//   const updateMutation = useMutation({
//     mutationFn: ({ orderId, status }) =>
//       api.patch(`/kitchen/orders/${orderId}/status`, { status }),
//     onSuccess: (data, variables) => {
//       toast.success('Order status updated');
      
//       if (variables.status === 'ready') {
//         const order = activeOrders.find(o => o._id === variables.orderId);
//         if (order && order.orderType?.toLowerCase() !== 'delivery') {
//           const orderIdShort = order.orderId || order._id?.slice(-6);
//           const customerName = order.customerName || order.customer?.name || 'Customer';
//           playReadyNotification(orderIdShort, customerName);
//         }
//       }
      
//       queryClient.invalidateQueries({ queryKey: ['kitchen-orders-active'] });
//       queryClient.invalidateQueries({ queryKey: ['kitchen-orders-ready'] });
//       queryClient.invalidateQueries({ queryKey: ['kitchen-stats'] });
//       queryClient.invalidateQueries({ queryKey: ['kitchen-orders-history'] });
//     },
//     onError: (error) =>
//       toast.error(error.response?.data?.message || 'Failed to update status'),
//   });

//   const completeMutation = useMutation({
//     mutationFn: (orderId) =>
//       api.patch(`/kitchen/orders/${orderId}/status`, { status: 'completed' }),
//     onSuccess: () => {
//       toast.success('Order completed');
//       queryClient.invalidateQueries({ queryKey: ['kitchen-orders-active'] });
//       queryClient.invalidateQueries({ queryKey: ['kitchen-orders-ready'] });
//       queryClient.invalidateQueries({ queryKey: ['kitchen-stats'] });
//       queryClient.invalidateQueries({ queryKey: ['kitchen-orders-history'] });
//     },
//     onError: (error) =>
//       toast.error(error.response?.data?.message || 'Failed to complete order'),
//   });

//   // Data processing - EXCLUDE delivery orders from ready for pickup
//   const activeOrders = useMemo(() => {
//     const orders = ordersQuery.data || [];
//     return orders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
//   }, [ordersQuery.data]);

//   const readyOrders = useMemo(() => {
//     const orders = readyQuery.data || [];
//     const nonDeliveryOrders = orders.filter(order => 
//       order.orderType?.toLowerCase() !== 'delivery'
//     );
//     return nonDeliveryOrders.sort((a, b) => 
//       new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt)
//     );
//   }, [readyQuery.data]);

//   const totalReadyOrders = readyQuery.data?.length || 0;
//   const nonDeliveryReadyCount = readyOrders.length;
//   const deliveryReadyCount = totalReadyOrders - nonDeliveryReadyCount;

//   const historyOrders = useMemo(() => {
//     const orders = historyQuery.data || [];
//     return orders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
//   }, [historyQuery.data]);

//   useEffect(() => {
//     const currentReadyIds = new Set(readyOrders.map(o => o._id));
    
//     readyOrders.forEach(order => {
//       if (!previousReadyOrderIds.has(order._id)) {
//         if (order.orderType?.toLowerCase() !== 'delivery') {
//           const orderIdShort = order.orderId || order._id?.slice(-6);
//           const customerName = order.customerName || order.customer?.name || 'Customer';
//           // playReadyNotification(orderIdShort, customerName);
//         }
//       }
//     });
    
//     setPreviousReadyOrderIds(currentReadyIds);
//   }, [readyOrders]);

//   const totalReadyPages = Math.ceil(readyOrders.length / readyItemsPerPage);
//   const paginatedReadyOrders = useMemo(() => {
//     const start = (readyPage - 1) * readyItemsPerPage;
//     const end = start + readyItemsPerPage;
//     return readyOrders.slice(start, end);
//   }, [readyOrders, readyPage, readyItemsPerPage]);

//   const filteredOrders = useMemo(() => {
//     if (statusFilter === 'all') return activeOrders;
//     return activeOrders.filter(order => order.status === statusFilter);
//   }, [activeOrders, statusFilter]);

//   const stats = statsQuery.data || {};
//   const team = teamQuery.data || [];

//   const pendingCount = activeOrders.filter(o => o.status === 'placed' || o.status === 'confirmed').length;
//   const preparingCount = activeOrders.filter(o => o.status === 'preparing').length;

//   const handleOpenDetails = (order) => {
//     setSelectedOrder(order);
//   };

//   const handleUpdateOrder = (orderId, status) => {
//     updateMutation.mutate({ orderId, status });
//   };

//   const handleCompleteOrder = (orderId) => {
//     completeMutation.mutate(orderId);
//   };

//   const refreshAll = () => {
//     ordersQuery.refetch();
//     readyQuery.refetch();
//     statsQuery.refetch();
//     teamQuery.refetch();
//     historyQuery.refetch();
//     toast.success('Refreshed');
//   };

//   const toggleExpand = (orderId) => {
//     setExpandedOrderId(expandedOrderId === orderId ? null : orderId);
//   };

//   const handleLogout = async () => {
//     setShowLogoutConfirm(false);
//     await dispatch(logoutUser());
//     navigate('/login', { replace: true });
//   };

//   return (
//     <>
//       <div className="min-h-screen bg-gray-50">
//         <div className="max-w-7xl mx-auto px-4 py-6 md:px-6 md:py-8">
//           {/* Header */}
//           <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
//             <div>
//               <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Kitchen Display System</h1>
//               <p className="text-sm text-gray-500 mt-1">
//                 Real-time order management for kitchen staff
//                 {user?.name ? ` • Signed in as ${user.name}` : ''}
//               </p>
//             </div>
//             <div className="flex items-center gap-3">
//               {/* Tab Switcher */}
//               <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg p-1">
//                 <button
//                   onClick={() => setActiveTab('orders')}
//                   className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${
//                     activeTab === 'orders'
//                       ? 'bg-amber-500 text-white'
//                       : 'text-gray-600 hover:bg-gray-100'
//                   }`}
//                 >
//                   📋 Active Orders
//                 </button>
//                 <button
//                   onClick={() => setActiveTab('history')}
//                   className={`px-4 py-2 rounded-lg text-sm font-semibold transition flex items-center gap-2 ${
//                     activeTab === 'history'
//                       ? 'bg-amber-500 text-white'
//                       : 'text-gray-600 hover:bg-gray-100'
//                   }`}
//                 >
//                   <CalendarDays size={14} />
//                   History
//                 </button>
//                 <button
//                   onClick={() => setActiveTab('waste')}
//                   className={`px-4 py-2 rounded-lg text-sm font-semibold transition flex items-center gap-2 ${
//                     activeTab === 'waste'
//                       ? 'bg-amber-500 text-white'
//                       : 'text-gray-600 hover:bg-gray-100'
//                   }`}
//                 >
//                   <Trash size={14} />
//                   Waste Log
//                 </button>
//                 {/* <button
//                   onClick={() => setActiveTab('lowstock')}
//                   className={`px-4 py-2 rounded-lg text-sm font-semibold transition flex items-center gap-2 ${
//                     activeTab === 'lowstock'
//                       ? 'bg-amber-500 text-white'
//                       : 'text-gray-600 hover:bg-gray-100'
//                   }`}
//                 >
//                   <AlertTriangle size={14} />
//                   Low Stock Alert
//                 </button> */}
//               </div>
//               <button
//                 onClick={() => setInventoryOpen(true)}
//                 className="flex items-center gap-2 px-4 py-2 bg-amber-500 text-white rounded-lg text-sm font-semibold hover:bg-amber-600 transition"
//               >
//                 <Package size={16} />
//                 Inventory
//               </button>
//               <button
//                 onClick={refreshAll}
//                 className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-50 transition"
//               >
//                 <RefreshCw size={16} />
//                 Refresh
//               </button>
//               <button
//                 onClick={() => setShowLogoutConfirm(true)}
//                 className="flex items-center gap-2 px-4 py-2 bg-white border border-red-200 rounded-lg text-sm font-semibold text-red-600 hover:bg-red-50 transition"
//               >
//                 <LogOut size={16} />
//                 Logout
//               </button>
//             </div>
//           </div>

//           {activeTab === 'orders' && (
//             <>
//               {/* Alert for pending orders */}
//               {pendingCount > 0 && (
//                 <div className="mb-6 bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-center gap-3">
//                   <AlertTriangle size={20} className="text-amber-600" />
//                   <div className="flex-1">
//                     <p className="text-sm font-semibold text-amber-800">Attention Required</p>
//                     <p className="text-sm text-amber-700">{pendingCount} order(s) waiting to be started</p>
//                   </div>
//                 </div>
//               )}

//               {/* Stats Grid */}
//               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
//                 <div className="rounded-xl border bg-amber-50 border-amber-100 p-5">
//                   <div className="flex items-start justify-between">
//                     <div>
//                       <p className="text-sm font-medium text-gray-600">Active Orders</p>
//                       <p className="mt-2 text-3xl font-bold text-gray-900">{activeOrders.length}</p>
//                       <p className="mt-2 text-xs text-gray-500">{preparingCount} in preparation</p>
//                     </div>
//                     <div className="rounded-lg p-2 bg-amber-100">
//                       <ChefHat size={20} className="text-amber-600" />
//                     </div>
//                   </div>
//                 </div>
//                 <div className="rounded-xl border bg-green-50 border-green-100 p-5">
//                   <div className="flex items-start justify-between">
//                     <div>
//                       <p className="text-sm font-medium text-gray-600">Ready Orders</p>
//                       <p className="mt-2 text-3xl font-bold text-gray-900">{nonDeliveryReadyCount}</p>
//                       <p className="mt-2 text-xs text-gray-500">
//                         {deliveryReadyCount} delivery orders sent to delivery panel
//                       </p>
//                     </div>
//                     <div className="rounded-lg p-2 bg-green-100">
//                       <PackageCheck size={20} className="text-green-600" />
//                     </div>
//                   </div>
//                 </div>
//                 <div className="rounded-xl border bg-blue-50 border-blue-100 p-5">
//                   <div className="flex items-start justify-between">
//                     <div>
//                       <p className="text-sm font-medium text-gray-600">Avg. Prep Time</p>
//                       <p className="mt-2 text-3xl font-bold text-gray-900">{stats.avgPrepTimeMinutes || 0}m</p>
//                     </div>
//                     <div className="rounded-lg p-2 bg-blue-100">
//                       <Clock3 size={20} className="text-blue-600" />
//                     </div>
//                   </div>
//                 </div>
//                 <div className="rounded-xl border bg-purple-50 border-purple-100 p-5">
//                   <div className="flex items-start justify-between">
//                     <div>
//                       <p className="text-sm font-medium text-gray-600">Completed Today</p>
//                       <p className="mt-2 text-3xl font-bold text-gray-900">{stats.completedToday || 0}</p>
//                     </div>
//                     <div className="rounded-lg p-2 bg-purple-100">
//                       <TrendingUp size={20} className="text-purple-600" />
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               {/* Active Orders Section */}
//               <div className="mb-8">
//                 <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
//                   <div>
//                     <h2 className="text-xl font-bold text-gray-900">Active Orders</h2>
//                     <p className="text-sm text-gray-500">Orders currently being prepared</p>
//                   </div>
//                   <div className="flex items-center gap-3">
//                     <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg p-1">
//                       <button
//                         onClick={() => setViewMode('list')}
//                         className={`p-1.5 rounded ${viewMode === 'list' ? 'bg-amber-100 text-amber-600' : 'text-gray-500'}`}
//                       >
//                         <List size={16} />
//                       </button>
//                       <button
//                         onClick={() => setViewMode('grid')}
//                         className={`p-1.5 rounded ${viewMode === 'grid' ? 'bg-amber-100 text-amber-600' : 'text-gray-500'}`}
//                       >
//                         <Grid3x3 size={16} />
//                       </button>
//                     </div>
//                     <select
//                       value={statusFilter}
//                       onChange={(e) => setStatusFilter(e.target.value)}
//                       className="px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm"
//                     >
//                       <option value="all">All Status</option>
//                       <option value="placed">Pending</option>
//                       <option value="confirmed">Confirmed</option>
//                       <option value="preparing">Preparing</option>
//                     </select>
//                   </div>
//                 </div>

//                 {filteredOrders.length === 0 ? (
//                   <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
//                     <ChefHat size={48} className="mx-auto text-gray-300 mb-3" />
//                     <p className="text-gray-500">No active orders at the moment</p>
//                   </div>
//                 ) : viewMode === 'list' ? (
//                   <div className="space-y-3">
//                     {filteredOrders.map(order => {
//                       const isExpanded = expandedOrderId === order._id;
//                       const OrderTypeIcon = ORDER_TYPE_ICONS[order.orderType?.toLowerCase()] || ShoppingBag;
                      
//                       return (
//                         <div key={order._id} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
//                           <div 
//                             className="p-4 cursor-pointer hover:bg-gray-50 transition-colors"
//                             onClick={() => toggleExpand(order._id)}
//                           >
//                             <div className="flex items-start justify-between">
//                               <div className="flex-1">
//                                 <div className="flex items-center gap-3 flex-wrap">
//                                   <span className="font-mono text-sm font-bold text-amber-600">
//                                     #{order.orderId || order._id?.slice(-6)}
//                                   </span>
//                                   <span className={`px-2 py-1 rounded-full text-xs font-semibold ${STATUS_COLORS[order.status]}`}>
//                                     {order.status}
//                                   </span>
//                                   <span className="flex items-center gap-1 text-xs text-gray-500 capitalize">
//                                     <OrderTypeIcon size={12} />
//                                     {ORDER_TYPE_LABELS[order.orderType?.toLowerCase()] || order.orderType || 'Dine-in'}
//                                   </span>
//                                 </div>
//                                 <div className="mt-2">
//                                   <p className="font-semibold text-gray-900">
//                                     {order.customerName || order.customer?.name || 'Guest'}
//                                   </p>
//                                   <div className="flex items-center gap-3 mt-1 text-sm text-gray-600">
//                                     <span>{order.items?.length || 0} item(s)</span>
//                                     <span>•</span>
//                                     <span className="font-semibold">₹{order.totalAmount || order.total || 0}</span>
//                                   </div>
//                                 </div>
//                               </div>
//                               <div className="flex items-center gap-2">
//                                 <button
//                                   onClick={(e) => {
//                                     e.stopPropagation();
//                                     handleOpenDetails(order);
//                                   }}
//                                   className="px-3 py-2 rounded-lg text-sm font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 transition flex items-center gap-1"
//                                 >
//                                   <Eye size={14} />
//                                   View
//                                 </button>
//                                 <button
//                                   onClick={(e) => {
//                                     e.stopPropagation();
//                                     handleUpdateOrder(order._id, order.status === 'preparing' ? 'ready' : 'preparing');
//                                   }}
//                                   className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
//                                     order.status === 'preparing'
//                                       ? 'bg-green-500 hover:bg-green-600 text-white'
//                                       : 'bg-amber-500 hover:bg-amber-600 text-white'
//                                   }`}
//                                 >
//                                   {order.status === 'preparing' ? 'Mark Ready' : 'Start Prep'}
//                                 </button>
//                                 {isExpanded ? <ChevronUp size={18} className="text-gray-400" /> : <ChevronDown size={18} className="text-gray-400" />}
//                               </div>
//                             </div>
//                           </div>

//                           {isExpanded && (
//                             <div className="border-t border-gray-100 bg-gray-50 p-4">
//                               <div className="grid gap-4 md:grid-cols-2">
//                                 <div>
//                                   <h4 className="text-sm font-semibold text-gray-700 mb-3">Order Items</h4>
//                                   <div className="space-y-2">
//                                     {(order.items || []).map((item, idx) => (
//                                       <div key={idx} className="bg-white rounded-lg p-3 border border-gray-200">
//                                         <div className="flex justify-between">
//                                           <div>
//                                             <p className="font-medium text-gray-900">
//                                               {item.name || item.menuItem?.name}
//                                             </p>
//                                             {item.specialInstructions && (
//                                               <p className="text-xs text-gray-500 mt-1">{item.specialInstructions}</p>
//                                             )}
//                                           </div>
//                                           <div className="text-right">
//                                             <p className="text-sm text-gray-600">x{item.quantity}</p>
//                                             <p className="text-sm font-semibold">₹{(item.price || item.unitPrice || 0) * item.quantity}</p>
//                                           </div>
//                                         </div>
//                                       </div>
//                                     ))}
//                                   </div>
//                                 </div>
//                                 <div>
//                                   <h4 className="text-sm font-semibold text-gray-700 mb-3">Preparation Progress</h4>
//                                   <div className="bg-white rounded-lg p-4 border border-gray-200">
//                                     <PreparationProgress status={order.status} />
//                                   </div>
//                                   {order.specialNotes && (
//                                     <div className="mt-4 bg-amber-50 border border-amber-200 rounded-lg p-3">
//                                       <p className="text-xs font-semibold text-amber-800 mb-1">Special Instructions:</p>
//                                       <p className="text-sm text-amber-700">{order.specialNotes}</p>
//                                     </div>
//                                   )}
//                                 </div>
//                               </div>
//                             </div>
//                           )}
//                         </div>
//                       );
//                     })}
//                   </div>
//                 ) : (
//                   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//                     {filteredOrders.map(order => {
//                       const OrderTypeIcon = ORDER_TYPE_ICONS[order.orderType?.toLowerCase()] || ShoppingBag;
                      
//                       return (
//                         <div key={order._id} className="bg-white rounded-lg border border-gray-200 p-4">
//                           <div className="flex items-start justify-between mb-3">
//                             <span className="font-mono text-sm font-bold text-amber-600">
//                               #{order.orderId || order._id?.slice(-6)}
//                             </span>
//                             <span className={`px-2 py-1 rounded-full text-xs font-semibold ${STATUS_COLORS[order.status]}`}>
//                               {order.status}
//                             </span>
//                           </div>
//                           <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
//                             <OrderTypeIcon size={12} />
//                             <span className="capitalize">{ORDER_TYPE_LABELS[order.orderType?.toLowerCase()] || order.orderType || 'Dine-in'}</span>
//                           </div>
//                           <p className="font-semibold text-gray-900">{order.customerName || order.customer?.name || 'Guest'}</p>
//                           <p className="text-sm text-gray-600 mt-1">{order.items?.length || 0} items • ₹{order.totalAmount || order.total || 0}</p>
//                           <div className="mt-3">
//                             <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
//                               <div className={`h-full rounded-full ${
//                                 order.status === 'placed' ? 'w-1/4 bg-orange-500' :
//                                 order.status === 'confirmed' ? 'w-2/4 bg-blue-500' :
//                                 order.status === 'preparing' ? 'w-3/4 bg-purple-500' : 'w-full bg-green-500'
//                               }`} />
//                             </div>
//                           </div>
//                           <div className="flex gap-2 mt-4">
//                             <button
//                               onClick={() => handleOpenDetails(order)}
//                               className="flex-1 px-3 py-2 text-sm font-semibold text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
//                             >
//                               View
//                             </button>
//                             <button
//                               onClick={() => handleUpdateOrder(order._id, order.status === 'preparing' ? 'ready' : 'preparing')}
//                               className={`flex-1 px-3 py-2 text-sm font-semibold text-white rounded-lg transition ${
//                                 order.status === 'preparing' ? 'bg-green-500 hover:bg-green-600' : 'bg-amber-500 hover:bg-amber-600'
//                               }`}
//                             >
//                               {order.status === 'preparing' ? 'Ready' : 'Start'}
//                             </button>
//                           </div>
//                         </div>
//                       );
//                     })}
//                   </div>
//                 )}
//               </div>

//               {/* Ready Orders & Team Section */}
//               <div className="grid lg:grid-cols-2 gap-6">
//                 <div>
//                   <div className="flex items-center justify-between mb-4">
//                     <div>
//                       <h2 className="text-xl font-bold text-gray-900">Ready for Pickup</h2>
//                       <p className="text-sm text-gray-500">
//                         Prepared orders awaiting service (dine-in, takeaway, pre-order only)
//                         {deliveryReadyCount > 0 && ` • ${deliveryReadyCount} delivery orders sent to delivery panel`}
//                       </p>
//                     </div>
//                     {readyOrders.length > 0 && (
//                       <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-semibold">
//                         {readyOrders.length} total
//                       </span>
//                     )}
//                   </div>
//                   <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
//                     <div className="divide-y divide-gray-200">
//                       {paginatedReadyOrders.length === 0 ? (
//                         <div className="p-8 text-center">
//                           <PackageCheck size={40} className="mx-auto text-gray-300 mb-2" />
//                           <p className="text-gray-500">No ready orders</p>
//                         </div>
//                       ) : (
//                         paginatedReadyOrders.map(order => (
//                           <div key={order._id} className="p-4 hover:bg-gray-50">
//                             <div className="flex items-start justify-between">
//                               <div className="flex-1">
//                                 <div className="flex items-center gap-2">
//                                   <span className="font-mono text-sm font-bold text-green-700">
//                                     #{order.orderId || order._id?.slice(-6)}
//                                   </span>
//                                   <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded-full text-xs font-semibold">
//                                     Ready
//                                   </span>
//                                   {order.orderType && (
//                                     <span className="text-xs text-gray-500 capitalize">({order.orderType})</span>
//                                   )}
//                                 </div>
//                                 <p className="font-medium text-gray-900 mt-2">
//                                   {order.customerName || order.customer?.name || 'Guest'}
//                                 </p>
//                                 <p className="text-sm text-gray-600 mt-1">
//                                   {order.items?.length || 0} items • ₹{order.totalAmount || order.total || 0}
//                                 </p>
//                               </div>
//                               <div className="flex gap-2">
//                                 <button
//                                   onClick={() => handleOpenDetails(order)}
//                                   className="px-3 py-1.5 text-sm font-semibold text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
//                                 >
//                                   View
//                                 </button>
//                                 <button
//                                   onClick={() => handleCompleteOrder(order._id)}
//                                   className="px-3 py-1.5 text-sm font-semibold text-green-700 bg-green-100 rounded-lg hover:bg-green-200 transition"
//                                 >
//                                   Complete
//                                 </button>
//                               </div>
//                             </div>
//                           </div>
//                         ))
//                       )}
//                     </div>
//                     {readyOrders.length > readyItemsPerPage && (
//                       <Pagination
//                         currentPage={readyPage}
//                         totalPages={totalReadyPages}
//                         onPageChange={setReadyPage}
//                       />
//                     )}
//                   </div>
//                 </div>

//                 <div>
//                   <div className="flex items-center justify-between mb-4">
//                     <div>
//                       <h2 className="text-xl font-bold text-gray-900">Kitchen Team</h2>
//                       <p className="text-sm text-gray-500">Current shift and availability</p>
//                     </div>
//                     <Users size={20} className="text-gray-400" />
//                   </div>
//                   <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
//                     <div className="divide-y divide-gray-200">
//                       {team.length === 0 ? (
//                         <div className="p-8 text-center">
//                           <Users size={40} className="mx-auto text-gray-300 mb-2" />
//                           <p className="text-gray-500">No team data available</p>
//                         </div>
//                       ) : (
//                         team.map(member => (
//                           <StaffCard key={member._id} member={member} />
//                         ))
//                       )}
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </>
//           )}

//           {activeTab === 'history' && (
//             <HistoryOrders 
//               orders={historyOrders} 
//               onViewOrder={handleOpenDetails}
//             />
//           )}

//           {activeTab === 'waste' && (
//             <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
//               <KitchenWasteLog />
//             </div>
//           )}

//           {activeTab === 'lowstock' && (
//             <LowStockAlert />
//           )}
//         </div>
//       </div>

//       {/* Inventory Sidebar */}
//       <InventorySidebar open={inventoryOpen} onClose={() => setInventoryOpen(false)} />

//       {/* Order Details Modal */}
//       <OrderDetailsModal order={selectedOrder} onClose={() => setSelectedOrder(null)} />

//       {/* Logout Confirmation Modal */}
//       {showLogoutConfirm && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={() => setShowLogoutConfirm(false)}>
//           <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full" onClick={e => e.stopPropagation()}>
//             <div className="p-5 border-b border-gray-200">
//               <div className="flex items-center gap-3">
//                 <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
//                   <LogOut size={18} className="text-red-600" />
//                 </div>
//                 <h2 className="text-xl font-bold text-gray-900">Confirm Logout</h2>
//               </div>
//             </div>
//             <div className="p-5">
//               <p className="text-gray-700">Are you sure you want to logout?</p>
//               <p className="text-sm text-gray-500 mt-2">You will need to login again to access your account.</p>
//             </div>
//             <div className="flex justify-end gap-3 p-5 border-t border-gray-200">
//               <button
//                 onClick={() => setShowLogoutConfirm(false)}
//                 className="px-4 py-2 border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 transition"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={handleLogout}
//                 className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
//               >
//                 Yes, Logout
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </>
//   );
// }

import React, { useMemo, useState, useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  ChefHat,
  Clock3,
  PackageCheck,
  RefreshCw,
  Users,
  Eye,
  CheckCircle,
  Clock,
  TrendingUp,
  UserCheck,
  Bell,
  Grid3x3,
  List,
  ChevronLeft,
  ChevronRight,
  X,
  MapPin,
  Phone,
  Mail,
  Calendar,
  MessageCircle,
  Receipt,
  ShoppingBag,
  Truck,
  Home,
  Store,
  Pizza,
  Coffee,
  UtensilsCrossed,
  Sparkles,
  Layers3,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  Package,
  Plus,
  Pencil,
  Trash2,
  Save,
  BoxesIcon,
  Search,
  Trash,
  Filter,
  CalendarDays,
  LogOut,
  GripVertical,
} from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../services/api';
import presenceService from '../../services/presenceService';
import { logoutUser } from '../../store/slices/authSlice';
import { KitchenWasteLog } from './KitchenWasteLog';
import LowStockAlert from './LowStockAlert';

// ─── Constants ───────────────────────────────────────────────────────────────

const STEP_LABELS = {
  placed: 'Order Placed',
  confirmed: 'Confirmed',
  preparing: 'Preparing',
  ready: 'Ready for Pickup',
};

const STATUS_COLORS = {
  placed: 'bg-orange-100 text-orange-700 border-orange-200',
  confirmed: 'bg-blue-100 text-blue-700 border-blue-200',
  preparing: 'bg-purple-100 text-purple-700 border-purple-200',
  ready: 'bg-green-100 text-green-700 border-green-200',
  completed: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  cancelled: 'bg-red-100 text-red-700 border-red-200',
};

const ORDER_TYPE_ICONS = {
  'delivery': Truck,
  'takeaway': Home,
  'dine-in': Store,
  'pre-order': Calendar,
};

const ORDER_TYPE_LABELS = {
  'delivery': 'Delivery',
  'takeaway': 'Takeaway',
  'dine-in': 'Dine-in',
  'pre-order': 'Pre-order',
};

const getOrderFulfillmentType = (order) => {
  const raw = String(order?.preOrderMethod || order?.orderType || '').toLowerCase();
  if (raw === 'pre-order') return 'takeaway';
  return raw || 'takeaway';
};

const getPreOrderPrepLeadMinutes = (order) => (
  getOrderFulfillmentType(order) === 'delivery' ? 25 : 15
);

const getEstimatedPrepMinutes = (order, avgPrepTimeMinutes = 0) => {
  const explicitEstimate = Number(order?.estimatedDurationMinutes || 0);
  if (explicitEstimate > 0) return Math.round(explicitEstimate);

  const itemCount = (order?.items || []).reduce((sum, item) => sum + Number(item?.quantity || 0), 0);
  const fallbackAvg = Number(avgPrepTimeMinutes || 0);
  const baseMinutes = fallbackAvg > 0 ? Math.round(fallbackAvg) : 12;
  const orderTypeBuffer = getOrderFulfillmentType(order) === 'delivery' ? 4 : 0;

  return Math.max(baseMinutes, Math.min(45, itemCount * 6 + orderTypeBuffer));
};

const getPreOrderTiming = (order, now = new Date()) => {
  if (!order?.isPreOrder || !order?.scheduledTime) return null;

  const scheduledAt = new Date(order.scheduledTime);
  if (Number.isNaN(scheduledAt.getTime())) return null;

  const prepLeadMinutes = getPreOrderPrepLeadMinutes(order);
  const minutesUntilScheduled = Math.ceil((scheduledAt.getTime() - now.getTime()) / 60000);

  return {
    scheduledAt,
    prepLeadMinutes,
    minutesUntilScheduled,
    canStart: minutesUntilScheduled <= prepLeadMinutes,
  };
};

// Inventory Constants
const UNITS = ['kg', 'g', 'L', 'ml', 'pcs', 'dozen', 'box', 'bag', 'bottle'];
const INVENTORY_CATEGORIES = [
  'Vegetables',
  'Fruits',
  'Dairy',
  'Meat & Seafood',
  'Grains & Pulses',
  'Spices',
  'Oils & Condiments',
  'Beverages',
  'Other',
];

const normalizeInventoryCategory = (value) => {
  const raw = String(value || '').trim().toLowerCase();
  if (!raw) return 'Other';
  const match = INVENTORY_CATEGORIES.find(
    (category) => category.toLowerCase() === raw
  );
  return match || 'Other';
};

// Date filter options
const DATE_FILTERS = {
  ALL: 'all',
  TODAY: 'today',
  YESTERDAY: 'yesterday',
  THIS_WEEK: 'this_week',
  LAST_WEEK: 'last_week',
  THIS_MONTH: 'this_month',
  CUSTOM: 'custom',
};

const getDateRange = (filter, customStart, customEnd) => {
  const now = new Date();
  const start = new Date();
  const end = new Date();

  switch (filter) {
    case DATE_FILTERS.ALL:
      return { start: null, end: null };
    case DATE_FILTERS.TODAY:
      start.setHours(0, 0, 0, 0);
      end.setHours(23, 59, 59, 999);
      return { start, end };
    case DATE_FILTERS.YESTERDAY:
      start.setDate(now.getDate() - 1);
      start.setHours(0, 0, 0, 0);
      end.setDate(now.getDate() - 1);
      end.setHours(23, 59, 59, 999);
      return { start, end };
    case DATE_FILTERS.THIS_WEEK: {
      const day = now.getDay();
      start.setDate(now.getDate() - day);
      start.setHours(0, 0, 0, 0);
      end.setDate(start.getDate() + 6);
      end.setHours(23, 59, 59, 999);
      return { start, end };
    }
    case DATE_FILTERS.LAST_WEEK:
      start.setDate(now.getDate() - now.getDay() - 7);
      start.setHours(0, 0, 0, 0);
      end.setDate(start.getDate() + 6);
      end.setHours(23, 59, 59, 999);
      return { start, end };
    case DATE_FILTERS.THIS_MONTH:
      start.setDate(1);
      start.setHours(0, 0, 0, 0);
      end.setMonth(now.getMonth() + 1);
      end.setDate(0);
      end.setHours(23, 59, 59, 999);
      return { start, end };
    case DATE_FILTERS.CUSTOM:
      return { start: customStart, end: customEnd };
    default:
      return { start: null, end: null };
  }
};

// ─── Inventory Form Component ────────────────────────────────────────────────

// ✅ FIX: Form now uses currentStock and reorderLevel — matching exact backend field names
const EMPTY_FORM = {
  name: '',
  category: INVENTORY_CATEGORIES[0],
  currentStock: '',
  unit: UNITS[0],
  reorderLevel: '',
  supplier: '',
  notes: '',
};

function InventoryForm({ initial = EMPTY_FORM, onSave, onCancel, loading }) {
  const [form, setForm] = useState(initial);

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name.trim() || form.currentStock === '') {
      return toast.error('Name and quantity are required');
    }
    onSave(form);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div>
        <label className="mb-1 block text-xs font-semibold text-stone-500 uppercase tracking-wide">
          Item Name *
        </label>
        <input
          value={form.name}
          onChange={set('name')}
          placeholder="e.g. Basmati Rice"
          className="w-full rounded-xl border border-stone-200 bg-stone-50 px-3 py-2 text-sm text-slate-800 outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100"
        />
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="mb-1 block text-xs font-semibold text-stone-500 uppercase tracking-wide">
            Category
          </label>
          <select
            value={form.category}
            onChange={set('category')}
            className="w-full rounded-xl border border-stone-200 bg-stone-50 px-3 py-2 text-sm text-slate-800 outline-none focus:border-amber-400"
          >
            {INVENTORY_CATEGORIES.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-xs font-semibold text-stone-500 uppercase tracking-wide">
            Unit
          </label>
          <select
            value={form.unit}
            onChange={set('unit')}
            className="w-full rounded-xl border border-stone-200 bg-stone-50 px-3 py-2 text-sm text-slate-800 outline-none focus:border-amber-400"
          >
            {UNITS.map((u) => (
              <option key={u}>{u}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="mb-1 block text-xs font-semibold text-stone-500 uppercase tracking-wide">
            Current Stock *
          </label>
          <input
            type="number"
            min="0"
            step="0.01"
            value={form.currentStock}
            onChange={set('currentStock')}
            placeholder="0"
            className="w-full rounded-xl border border-stone-200 bg-stone-50 px-3 py-2 text-sm text-slate-800 outline-none focus:border-amber-400"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-semibold text-stone-500 uppercase tracking-wide">
            Min Stock (Reorder Level)
          </label>
          <input
            type="number"
            min="0"
            step="0.01"
            value={form.reorderLevel}
            onChange={set('reorderLevel')}
            placeholder="0"
            className="w-full rounded-xl border border-stone-200 bg-stone-50 px-3 py-2 text-sm text-slate-800 outline-none focus:border-amber-400"
          />
        </div>
      </div>

      <div>
        <label className="mb-1 block text-xs font-semibold text-stone-500 uppercase tracking-wide">
          Supplier
        </label>
        <input
          value={form.supplier}
          onChange={set('supplier')}
          placeholder="Supplier name"
          className="w-full rounded-xl border border-stone-200 bg-stone-50 px-3 py-2 text-sm text-slate-800 outline-none focus:border-amber-400"
        />
      </div>

      <div>
        <label className="mb-1 block text-xs font-semibold text-stone-500 uppercase tracking-wide">
          Notes
        </label>
        <textarea
          rows={2}
          value={form.notes}
          onChange={set('notes')}
          placeholder="Optional notes..."
          className="w-full rounded-xl border border-stone-200 bg-stone-50 px-3 py-2 text-sm text-slate-800 outline-none focus:border-amber-400 resize-none"
        />
      </div>

      <div className="flex gap-2 pt-1">
        <button
          type="submit"
          disabled={loading}
          className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-amber-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-amber-600 disabled:opacity-60"
        >
          <Save size={14} />
          {loading ? 'Saving…' : 'Save Item'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="flex items-center justify-center gap-2 rounded-xl border border-stone-200 bg-white px-4 py-2 text-sm font-semibold text-stone-600 transition hover:bg-stone-50"
        >
          <X size={14} />
          Cancel
        </button>
      </div>
    </form>
  );
}

// ─── Inventory Sidebar Component ────────────────────────────────────────────

function InventorySidebar({ open, onClose }) {
  const queryClient = useQueryClient();
  const [mode, setMode] = useState('list');
  const [editTarget, setEditTarget] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [filterCat, setFilterCat] = useState('All');
  const [search, setSearch] = useState('');
  const [sidebarWidth, setSidebarWidth] = useState(680);
  const [isResizing, setIsResizing] = useState(false);

  const inventoryQuery = useQuery({
    queryKey: ['kitchen-inventory'],
    queryFn: () => api.get('/manager/inventory').then((r) => r.data),
    enabled: open,
  });

  // ✅ FIX: Normalize to currentStock + reorderLevel (backend field names)
  const toNumber = (value) => {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : 0;
  };

  const items = (
    Array.isArray(inventoryQuery.data)
      ? inventoryQuery.data
      : Array.isArray(inventoryQuery.data?.data)
      ? inventoryQuery.data.data
      : Array.isArray(inventoryQuery.data?.items)
      ? inventoryQuery.data.items
      : Array.isArray(inventoryQuery.data?.inventory)
      ? inventoryQuery.data.inventory
      : []
  ).map((item) => ({
    ...item,
    category: normalizeInventoryCategory(item.category),
    currentStock: toNumber(item.currentStock ?? item.quantity),
    reorderLevel: toNumber(item.reorderLevel ?? item.minStock ?? item.minThreshold),
    supplier: item.supplier?.name || item.supplier || '',
  }));

  const availableCategories = [
    'All',
    ...INVENTORY_CATEGORIES.filter((category) =>
      items.some((item) => item.category === category)
    ),
  ];

  useEffect(() => {
    if (!open || typeof window === 'undefined') return;
    const savedWidth = Number(window.localStorage.getItem('kitchenInventorySidebarWidth'));
    if (savedWidth) setSidebarWidth(Math.min(860, Math.max(420, savedWidth)));
  }, [open]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem('kitchenInventorySidebarWidth', String(sidebarWidth));
  }, [sidebarWidth]);

  useEffect(() => {
    if (!open) return undefined;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, [open]);

  useEffect(() => {
    if (!isResizing || typeof window === 'undefined') return undefined;
    const handleMove = (e) => {
      setSidebarWidth(Math.min(860, Math.max(420, window.innerWidth - e.clientX)));
    };
    const handleUp = () => setIsResizing(false);
    window.addEventListener('mousemove', handleMove);
    window.addEventListener('mouseup', handleUp);
    return () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mouseup', handleUp);
    };
  }, [isResizing]);

  // ✅ FIX: addMutation sends currentStock + reorderLevel to backend
  const addMutation = useMutation({
    mutationFn: (data) =>
      api.post('/manager/inventory', {
        name: data.name,
        category: data.category,
        currentStock: Number(data.currentStock || 0),
        unit: data.unit,
        reorderLevel: Number(data.reorderLevel || 0),
        supplier: data.supplier || '',
        notes: data.notes || '',
      }),
    onSuccess: () => {
      toast.success('Item added successfully');
      queryClient.invalidateQueries({ queryKey: ['kitchen-inventory'] });
      queryClient.invalidateQueries({ queryKey: ['kitchen-inventory-page'] });
      setMode('list');
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed to add item'),
  });

  // ✅ FIX: updateMutation sends currentStock + reorderLevel to backend
  const updateMutation = useMutation({
    mutationFn: ({ id, data }) =>
      api.put(`/manager/inventory/${id}`, {
        name: data.name,
        category: data.category,
        currentStock: Number(data.currentStock || 0),
        unit: data.unit,
        reorderLevel: Number(data.reorderLevel || 0),
        supplier: data.supplier || '',
        notes: data.notes || '',
      }),
    onSuccess: () => {
      toast.success('Item updated successfully');
      queryClient.invalidateQueries({ queryKey: ['kitchen-inventory'] });
      queryClient.invalidateQueries({ queryKey: ['kitchen-inventory-page'] });
      setMode('list');
      setEditTarget(null);
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed to update item'),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => api.delete(`/manager/inventory/${id}`),
    onSuccess: () => {
      toast.success('Item deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['kitchen-inventory'] });
      queryClient.invalidateQueries({ queryKey: ['kitchen-inventory-page'] });
      setDeleteTarget(null);
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed to delete item'),
  });

  const filtered = items.filter((item) => {
    const matchCat = filterCat === 'All' || item.category === filterCat;
    const matchSearch = item.name.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const lowStock = items.filter(
    (item) => item.reorderLevel && Number(item.currentStock) <= Number(item.reorderLevel)
  );

  if (!open) return null;

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm" onClick={onClose} />
      <aside
        className="fixed right-0 top-0 z-50 flex h-full max-w-[96vw] flex-col overflow-y-auto bg-white shadow-2xl overscroll-contain"
        style={{ width: `min(${sidebarWidth}px, 96vw)` }}
      >
        <button
          type="button"
          onMouseDown={() => setIsResizing(true)}
          className="absolute left-0 top-0 h-full w-3 -translate-x-1/2 cursor-col-resize bg-transparent"
          aria-label="Resize inventory sidebar"
        >
          <span className="absolute left-1/2 top-1/2 flex h-16 w-1 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-stone-300/80">
            <GripVertical size={14} className="text-stone-600" />
          </span>
        </button>

        {/* Header */}
        <div className="flex items-center justify-between border-b border-stone-100 px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-100 text-amber-700">
              <BoxesIcon size={18} />
            </div>
            <div>
              <h2 className="font-bold text-slate-800">Kitchen Inventory</h2>
              <p className="text-xs text-stone-400">{items.length} items tracked</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-stone-200 text-stone-500 transition hover:bg-stone-50"
          >
            <X size={16} />
          </button>
        </div>

        {/* Sidebar size controls */}
        <div className="flex items-center justify-between gap-3 border-b border-stone-100 px-5 py-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-stone-400">Sidebar Size</p>
            <p className="text-xs text-stone-500">Drag the left edge or use quick widths.</p>
          </div>
          <div className="flex gap-2">
            {[{ label: 'S', value: 520 }, { label: 'M', value: 680 }, { label: 'L', value: 820 }].map((size) => (
              <button
                key={size.label}
                type="button"
                onClick={() => setSidebarWidth(size.value)}
                className={`rounded-full px-3 py-1 text-xs font-semibold transition ${
                  Math.abs(sidebarWidth - size.value) < 30
                    ? 'bg-amber-500 text-white'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                {size.label}
              </button>
            ))}
          </div>
        </div>

        {lowStock.length > 0 && mode === 'list' && (
          <div className="mx-4 mt-3 flex items-start gap-2 rounded-xl border border-rose-100 bg-rose-50 px-3 py-2 text-xs text-rose-700">
            <AlertTriangle size={14} className="mt-0.5 shrink-0" />
            <span><strong>{lowStock.length} item(s)</strong> are at or below minimum stock level.</span>
          </div>
        )}

        <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
          {mode === 'list' && (
            <>
              <div className="space-y-2 px-4 pt-3 pb-2">
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder="Search items..."
                      className="w-full rounded-xl border border-stone-200 bg-stone-50 pl-9 pr-3 py-2 text-sm outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100"
                    />
                  </div>
                  <button
                    onClick={() => setMode('add')}
                    className="flex items-center gap-1.5 rounded-xl bg-amber-500 px-3 py-2 text-sm font-semibold text-white transition hover:bg-amber-600"
                  >
                    <Plus size={15} />
                    Add Item
                  </button>
                </div>
                <div className="flex gap-1.5 overflow-x-auto pb-1">
                  {availableCategories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setFilterCat(cat)}
                      className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold transition ${
                        filterCat === cat ? 'bg-amber-500 text-white' : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex-1 overflow-y-auto overscroll-contain px-4 pb-4">
                {inventoryQuery.isLoading ? (
                  <div className="py-12 text-center text-sm text-stone-400">Loading inventory...</div>
                ) : filtered.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-stone-200 bg-stone-50 py-10 text-center text-sm text-stone-400">
                    {search ? 'No items match your search.' : 'No inventory items yet. Add one!'}
                  </div>
                ) : (
                  <div className="space-y-2">
                    {filtered.map((item) => {
                      const isLow = item.reorderLevel && Number(item.currentStock) <= Number(item.reorderLevel);
                      const hasReorderLevel = Number(item.reorderLevel) > 0;
                      const stockLevelWidth = hasReorderLevel
                        ? Math.min(100, (Number(item.currentStock) / (Number(item.reorderLevel) * 3)) * 100)
                        : Math.min(100, Number(item.currentStock) > 0 ? 100 : 0);
                      return (
                        <div
                          key={item._id}
                          className={`rounded-2xl border p-3 transition ${
                            isLow ? 'border-rose-100 bg-rose-50/60' : 'border-stone-200 bg-stone-50'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-2">
                                <p className="truncate font-semibold text-slate-800">{item.name}</p>
                                {isLow && (
                                  <span className="shrink-0 rounded-full bg-rose-100 px-2 py-0.5 text-xs font-semibold text-rose-600">
                                    Low Stock
                                  </span>
                                )}
                              </div>
                              <p className="mt-0.5 text-xs text-stone-500">
                                {item.category}{item.supplier ? ` · ${item.supplier}` : ''}
                              </p>
                              <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-xs text-stone-500">
                                <span>
                                  Current: <strong className="text-slate-700">{item.currentStock} {item.unit}</strong>
                                </span>
                                <span>
                                  Min: <strong className="text-slate-700">{hasReorderLevel ? `${item.reorderLevel} ${item.unit}` : 'Not set'}</strong>
                                </span>
                              </div>
                            </div>
                            <span className="rounded-xl bg-white px-2.5 py-1 text-sm font-bold text-slate-700 ring-1 ring-stone-200">
                              {item.currentStock} {item.unit}
                            </span>
                          </div>

                          <div className="mt-2">
                            <div className="mb-1 flex justify-between text-xs text-stone-400">
                              <span>Stock level</span>
                              <span>{hasReorderLevel ? `min ${item.reorderLevel} ${item.unit}` : 'min not set'}</span>
                            </div>
                            <div className="h-1.5 w-full overflow-hidden rounded-full bg-stone-200">
                              <div
                                className={`h-full rounded-full transition-all ${
                                  hasReorderLevel ? (isLow ? 'bg-rose-400' : 'bg-emerald-400') : 'bg-stone-400'
                                }`}
                                style={{ width: `${stockLevelWidth}%` }}
                              />
                            </div>
                            {!hasReorderLevel && (
                              <p className="mt-1 text-[11px] text-stone-400">Set a minimum stock value to track low-stock level for this item.</p>
                            )}
                          </div>

                          {item.notes && <p className="mt-2 text-xs text-stone-400 italic">{item.notes}</p>}

                          <div className="mt-3 flex gap-2">
                            <button
                              onClick={() => { setEditTarget(item); setMode('edit'); }}
                              className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-stone-200 bg-white py-1.5 text-xs font-semibold text-slate-600 transition hover:border-amber-300 hover:text-amber-600"
                            >
                              <Pencil size={12} />
                              Edit Item
                            </button>
                            <button
                              onClick={() => setDeleteTarget(item)}
                              className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-stone-200 bg-white py-1.5 text-xs font-semibold text-slate-600 transition hover:border-rose-200 hover:text-rose-600"
                            >
                              <Trash2 size={12} />
                              Remove Item
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </>
          )}

          {mode === 'add' && (
            <div className="flex-1 overflow-y-auto overscroll-contain px-4 pt-4 pb-4">
              <div className="mb-4">
                <h3 className="font-bold text-slate-800">Add New Item</h3>
                <p className="text-xs text-stone-400 mt-0.5">Fill in the details below</p>
              </div>
              <InventoryForm
                onSave={(data) => addMutation.mutate(data)}
                onCancel={() => setMode('list')}
                loading={addMutation.isPending}
              />
            </div>
          )}

          {mode === 'edit' && editTarget && (
            <div className="flex-1 overflow-y-auto overscroll-contain px-4 pt-4 pb-4">
              <div className="mb-4">
                <h3 className="font-bold text-slate-800">Edit Item</h3>
                <p className="text-xs text-stone-400 mt-0.5">{editTarget.name}</p>
              </div>
              {/* ✅ FIX: Pass currentStock + reorderLevel (not quantity/minStock) */}
              <InventoryForm
                initial={{
                  name: editTarget.name || '',
                  category: editTarget.category || INVENTORY_CATEGORIES[0],
                  currentStock: editTarget.currentStock ?? '',
                  unit: editTarget.unit || UNITS[0],
                  reorderLevel: editTarget.reorderLevel ?? '',
                  supplier: editTarget.supplier || '',
                  notes: editTarget.notes || '',
                }}
                onSave={(data) => updateMutation.mutate({ id: editTarget._id, data })}
                onCancel={() => { setMode('list'); setEditTarget(null); }}
                loading={updateMutation.isPending}
              />
            </div>
          )}
        </div>

        {deleteTarget && (
          <div className="absolute inset-0 z-50 flex items-center justify-center bg-slate-900/30 px-4 backdrop-blur-[2px]">
            <div className="w-full max-w-sm rounded-3xl border border-rose-100 bg-white p-5 shadow-[0_24px_80px_rgba(15,23,42,0.24)]">
              <div className="flex items-start gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-rose-100 text-rose-600">
                  <Trash2 size={18} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-lg font-bold text-slate-800">Remove Inventory Item?</p>
                  <p className="mt-1 text-sm text-stone-500">
                    This will permanently remove{' '}
                    <span className="font-semibold text-slate-700">{deleteTarget.name}</span> from the inventory list.
                  </p>
                </div>
              </div>
              <div className="mt-5 rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm text-stone-600">
                This action cannot be undone. The item will be deleted from the system.
              </div>
              <div className="mt-5 flex justify-end gap-2">
                <button
                  onClick={() => setDeleteTarget(null)}
                  className="rounded-xl border border-stone-200 bg-white px-4 py-2 text-sm font-semibold text-stone-600 transition hover:bg-stone-50"
                >
                  Cancel
                </button>
                <button
                  onClick={() => deleteMutation.mutate(deleteTarget._id)}
                  disabled={deleteMutation.isPending}
                  className="rounded-xl bg-rose-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-rose-600 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {deleteMutation.isPending ? 'Removing...' : 'Yes, Remove Item'}
                </button>
              </div>
            </div>
          </div>
        )}
      </aside>
    </>
  );
}

// ─── Order Details Modal ──────────────────────────────────────────────────────

function OrderDetailsModal({ order, onClose }) {
  if (!order) return null;
  const totalAmount = order.totalAmount || order.total || 0;
  const OrderTypeIcon = ORDER_TYPE_ICONS[order.orderType?.toLowerCase()] || ShoppingBag;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-100 rounded-xl">
              <Receipt size={20} className="text-amber-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Order Details</h2>
              <p className="text-sm text-gray-500 font-mono">#{order.orderId || order._id?.slice(-6)}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <X size={20} className="text-gray-500" />
          </button>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="bg-gray-50 rounded-xl p-4">
              <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                <Users size={16} /> Customer Information
              </h3>
              <div className="space-y-2">
                <p className="text-sm">
                  <span className="font-medium text-gray-700">Name:</span>{' '}
                  <span className="text-gray-900">{order.customerName || order.customer?.name || 'Guest'}</span>
                </p>
                {order.customer?.email && (
                  <p className="text-sm flex items-center gap-2">
                    <Mail size={14} className="text-gray-400" />
                    <span className="text-gray-600">{order.customer.email}</span>
                  </p>
                )}
                {order.customer?.phone && (
                  <p className="text-sm flex items-center gap-2">
                    <Phone size={14} className="text-gray-400" />
                    <span className="text-gray-600">{order.customer.phone}</span>
                  </p>
                )}
              </div>
            </div>
            <div className="bg-gray-50 rounded-xl p-4">
              <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                <ShoppingBag size={16} /> Order Information
              </h3>
              <div className="space-y-2">
                <p className="text-sm flex items-center justify-between">
                  <span className="font-medium text-gray-700">Order Type:</span>
                  <span className="flex items-center gap-1 capitalize">
                    <OrderTypeIcon size={14} />
                    {ORDER_TYPE_LABELS[order.orderType?.toLowerCase()] || order.orderType || 'Dine-in'}
                  </span>
                </p>
                <p className="text-sm flex items-center justify-between">
                  <span className="font-medium text-gray-700">Status:</span>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${STATUS_COLORS[order.status]}`}>
                    {order.status}
                  </span>
                </p>
                <p className="text-sm flex items-center justify-between">
                  <span className="font-medium text-gray-700">Date:</span>
                  <span className="text-gray-600">{new Date(order.createdAt).toLocaleString()}</span>
                </p>
              </div>
            </div>
          </div>
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Order Items</h3>
            <div className="border border-gray-200 rounded-xl overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    {['Item', 'Qty', 'Price', 'Subtotal'].map((h) => (
                      <th key={h} className={`px-4 py-3 text-xs font-semibold text-gray-600 uppercase ${h === 'Item' ? 'text-left' : h === 'Qty' ? 'text-center' : 'text-right'}`}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {(order.items || []).map((item, idx) => (
                    <tr key={idx}>
                      <td className="px-4 py-3">
                        <p className="font-medium text-gray-900">{item.name || item.menuItem?.name}</p>
                        {item.specialInstructions && <p className="text-xs text-gray-500 mt-1">{item.specialInstructions}</p>}
                      </td>
                      <td className="px-4 py-3 text-center">x{item.quantity}</td>
                      <td className="px-4 py-3 text-right">₹{item.price || item.unitPrice || 0}</td>
                      <td className="px-4 py-3 text-right font-semibold">
                        ₹{((item.price || item.unitPrice || 0) * item.quantity).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-gray-50 border-t border-gray-200">
                  <tr>
                    <td colSpan="3" className="px-4 py-3 text-right font-bold">Total</td>
                    <td className="px-4 py-3 text-right font-bold">₹{totalAmount.toFixed(2)}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
          {order.specialNotes && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
              <h3 className="text-sm font-semibold text-amber-800 mb-2">Special Instructions</h3>
              <p className="text-sm text-amber-700">{order.specialNotes}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Preparation Progress ─────────────────────────────────────────────────────

function PreparationProgress({ status }) {
  const steps = ['placed', 'confirmed', 'preparing', 'ready'];
  const currentIndex = steps.indexOf(status);
  return (
    <div className="flex items-center justify-between">
      {steps.map((step, idx) => (
        <div key={step} className="flex-1 text-center">
          <div className={`relative ${idx < steps.length - 1 ? 'after:absolute after:top-4 after:left-1/2 after:w-full after:h-0.5 after:bg-gray-200' : ''}`}>
            <div className={`relative z-10 w-8 h-8 mx-auto rounded-full flex items-center justify-center text-xs font-bold ${currentIndex >= idx ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-500'}`}>
              {currentIndex > idx ? <CheckCircle size={14} /> : idx + 1}
            </div>
          </div>
          <p className={`text-xs mt-2 ${currentIndex >= idx ? 'text-gray-700 font-medium' : 'text-gray-400'}`}>
            {STEP_LABELS[step].split(' ')[0]}
          </p>
        </div>
      ))}
    </div>
  );
}

// ─── StaffCard ────────────────────────────────────────────────────────────────

function StaffCard({ member }) {
  const isActive = member.status === 'active';
  return (
    <div className={`rounded-lg border p-3 transition-all ${isActive ? 'border-green-200 bg-green-50' : 'border-gray-200 bg-white'}`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${isActive ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`} />
            <p className="font-medium text-gray-900">{member.name}</p>
          </div>
          <p className="text-xs text-gray-500 mt-1 capitalize">{member.role || 'Staff'}</p>
        </div>
        {isActive && <UserCheck size={16} className="text-green-600" />}
      </div>
    </div>
  );
}

// ─── Pagination ───────────────────────────────────────────────────────────────

function Pagination({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;
  return (
    <div className="flex items-center justify-between px-4 py-3 bg-white border-t border-gray-200 rounded-b-lg">
      <div className="flex items-center gap-2">
        <button onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1} className="p-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-50">
          <ChevronLeft size={16} />
        </button>
        <span className="text-sm text-gray-600">Page {currentPage} of {totalPages}</span>
        <button onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPages} className="p-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-50">
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}

// ─── History Orders ───────────────────────────────────────────────────────────

function HistoryOrders({ orders, onViewOrder }) {
  const [historyDateFilter, setHistoryDateFilter] = useState(DATE_FILTERS.ALL);
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');
  const [showCustomPicker, setShowCustomPicker] = useState(false);
  const [historyPage, setHistoryPage] = useState(1);
  const historyItemsPerPage = 10;

  const getFilterLabel = () => {
    const labels = { [DATE_FILTERS.ALL]: 'All Time', [DATE_FILTERS.TODAY]: 'Today', [DATE_FILTERS.YESTERDAY]: 'Yesterday', [DATE_FILTERS.THIS_WEEK]: 'This Week', [DATE_FILTERS.LAST_WEEK]: 'Last Week', [DATE_FILTERS.THIS_MONTH]: 'This Month', [DATE_FILTERS.CUSTOM]: 'Custom Range' };
    return labels[historyDateFilter] || 'Select Range';
  };

  const filteredOrders = useMemo(() => {
    const { start, end } = getDateRange(historyDateFilter, customStartDate, customEndDate);
    if (!start || !end) return orders;
    return orders.filter((o) => { const d = new Date(o.createdAt); return d >= start && d <= end; });
  }, [orders, historyDateFilter, customStartDate, customEndDate]);

  useEffect(() => { setHistoryPage(1); }, [historyDateFilter, customStartDate, customEndDate]);

  const totalHistoryPages = Math.ceil(filteredOrders.length / historyItemsPerPage);
  const paginatedHistoryOrders = filteredOrders.slice((historyPage - 1) * historyItemsPerPage, historyPage * historyItemsPerPage);

  const stats = {
    total: filteredOrders.length,
    completed: filteredOrders.filter((o) => o.status === 'completed').length,
    cancelled: filteredOrders.filter((o) => o.status === 'cancelled').length,
    totalRevenue: filteredOrders.reduce((sum, o) => sum + (o.totalAmount || o.total || 0), 0),
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <div className="p-4 border-b border-gray-200 bg-gray-50">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-2">
            <CalendarDays size={18} className="text-amber-600" />
            <h3 className="font-semibold text-gray-900">Order History</h3>
          </div>
          <div className="relative">
            <button
              onClick={() => setShowCustomPicker(!showCustomPicker)}
              className="flex items-center gap-2 px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
            >
              <Filter size={14} />{getFilterLabel()}<ChevronDown size={14} />
            </button>
            {showCustomPicker && (
              <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-10 p-3 space-y-2">
                {[
                  { label: 'All Time', f: DATE_FILTERS.ALL },
                  { label: 'Today', f: DATE_FILTERS.TODAY },
                  { label: 'Yesterday', f: DATE_FILTERS.YESTERDAY },
                  { label: 'This Week', f: DATE_FILTERS.THIS_WEEK },
                  { label: 'Last Week', f: DATE_FILTERS.LAST_WEEK },
                  { label: 'This Month', f: DATE_FILTERS.THIS_MONTH },
                ].map(({ label, f }) => (
                  <button key={f} onClick={() => { setHistoryDateFilter(f); setShowCustomPicker(false); }} className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 rounded-lg">{label}</button>
                ))}
                <div className="border-t border-gray-200 my-2" />
                <input type="date" value={customStartDate} onChange={(e) => setCustomStartDate(e.target.value)} className="w-full px-2 py-1 text-sm border border-gray-200 rounded-lg" />
                <input type="date" value={customEndDate} onChange={(e) => setCustomEndDate(e.target.value)} className="w-full px-2 py-1 text-sm border border-gray-200 rounded-lg" />
                <button
                  onClick={() => { setHistoryDateFilter(DATE_FILTERS.CUSTOM); setShowCustomPicker(false); }}
                  disabled={!customStartDate || !customEndDate}
                  className="w-full px-3 py-2 bg-amber-500 text-white text-sm rounded-lg hover:bg-amber-600 disabled:opacity-50"
                >
                  Apply Custom Range
                </button>
              </div>
            )}
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
          {[
            { label: 'Total Orders', value: stats.total, color: 'text-gray-900' },
            { label: 'Completed', value: stats.completed, color: 'text-green-600' },
            { label: 'Cancelled', value: stats.cancelled, color: 'text-red-600' },
            { label: 'Revenue', value: `₹${stats.totalRevenue.toFixed(0)}`, color: 'text-amber-600' },
          ].map(({ label, value, color }) => (
            <div key={label} className="bg-white rounded-lg p-2 text-center border border-gray-100">
              <div className={`text-xl font-bold ${color}`}>{value}</div>
              <div className="text-xs text-gray-500">{label}</div>
            </div>
          ))}
        </div>
      </div>

      {paginatedHistoryOrders.length === 0 ? (
        <div className="p-8 text-center"><PackageCheck size={40} className="mx-auto text-gray-300 mb-2" /><p className="text-gray-500">No orders found for this period</p></div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr className="text-gray-600">
                  {['Order ID', 'Customer', 'Type', 'Items', 'Total', 'Status', 'Date', 'Action'].map((h) => (
                    <th key={h} className="px-4 py-3 text-left">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {paginatedHistoryOrders.map((order) => {
                  const Icon = ORDER_TYPE_ICONS[order.orderType?.toLowerCase()] || ShoppingBag;
                  return (
                    <tr key={order._id} className="hover:bg-gray-50 transition">
                      <td className="px-4 py-3 font-mono text-xs text-amber-600">#{order.orderId || order._id?.slice(-6)}</td>
                      <td className="px-4 py-3 font-medium">{order.customerName || order.customer?.name || 'Guest'}</td>
                      <td className="px-4 py-3"><span className="flex items-center gap-1 text-xs capitalize"><Icon size={12} />{ORDER_TYPE_LABELS[order.orderType?.toLowerCase()] || order.orderType || 'Dine-in'}</span></td>
                      <td className="px-4 py-3 text-gray-600">{order.items?.length || 0} items</td>
                      <td className="px-4 py-3 font-semibold">₹{order.totalAmount || order.total || 0}</td>
                      <td className="px-4 py-3"><span className={`px-2 py-1 rounded-full text-xs font-semibold ${STATUS_COLORS[order.status]}`}>{order.status}</span></td>
                      <td className="px-4 py-3 text-gray-500 text-xs">{new Date(order.createdAt).toLocaleDateString()}</td>
                      <td className="px-4 py-3"><button onClick={() => onViewOrder(order)} className="text-amber-600 hover:text-amber-700 text-sm font-medium">View</button></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {totalHistoryPages > 1 && (
            <div className="px-4 py-3 border-t border-gray-200 bg-gray-50">
              <Pagination currentPage={historyPage} totalPages={totalHistoryPages} onPageChange={setHistoryPage} />
            </div>
          )}
        </>
      )}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function KitchenDisplay() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const queryClient = useQueryClient();
  const [expandedOrderId, setExpandedOrderId] = useState(null);
  const [viewMode, setViewMode] = useState('list');
  const [statusFilter, setStatusFilter] = useState('all');
  const [readyPage, setReadyPage] = useState(1);
  const readyItemsPerPage = 3;
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [inventoryOpen, setInventoryOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('orders');
  const [previousReadyOrderIds, setPreviousReadyOrderIds] = useState(new Set());
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [currentTime, setCurrentTime] = useState(() => new Date());

  useEffect(() => {
    const authUser = JSON.parse(sessionStorage.getItem('authUser') || '{}');
    if (authUser._id && authUser.role) {
      presenceService.initialize(authUser._id, authUser.role, 'Kitchen Panel');
    }
    return () => { void presenceService.cleanup(); };
  }, []);

  useEffect(() => {
    const timer = window.setInterval(() => setCurrentTime(new Date()), 30000);
    return () => window.clearInterval(timer);
  }, []);

  const historyQuery = useQuery({ queryKey: ['kitchen-orders-history'], queryFn: () => api.get('/kitchen/orders/history').then((r) => r.data), refetchInterval: 30000 });
  const ordersQuery = useQuery({ queryKey: ['kitchen-orders-active'], queryFn: () => api.get('/kitchen/orders').then((r) => r.data), refetchInterval: 10000 });
  const readyQuery = useQuery({ queryKey: ['kitchen-orders-ready'], queryFn: () => api.get('/kitchen/orders/ready').then((r) => r.data), refetchInterval: 10000 });
  const statsQuery = useQuery({ queryKey: ['kitchen-stats'], queryFn: () => api.get('/kitchen/stats').then((r) => r.data), refetchInterval: 20000 });
  const teamQuery = useQuery({ queryKey: ['kitchen-team'], queryFn: () => api.get('/kitchen/team-status').then((r) => r.data).catch(() => []), refetchInterval: 30000 });

  const activeOrders = useMemo(() => (ordersQuery.data || []).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)), [ordersQuery.data]);

  // ✅ FIX: Removed broken playReadyNotification call from onSuccess
  const updateMutation = useMutation({
    mutationFn: ({ orderId, status }) => api.patch(`/kitchen/orders/${orderId}/status`, { status }),
    onSuccess: () => {
      toast.success('Order status updated');
      queryClient.invalidateQueries({ queryKey: ['kitchen-orders-active'] });
      queryClient.invalidateQueries({ queryKey: ['kitchen-orders-ready'] });
      queryClient.invalidateQueries({ queryKey: ['kitchen-stats'] });
      queryClient.invalidateQueries({ queryKey: ['kitchen-orders-history'] });
    },
    onError: (error) => toast.error(error.response?.data?.message || 'Failed to update status'),
  });

  const completeMutation = useMutation({
    mutationFn: (orderId) => api.patch(`/kitchen/orders/${orderId}/status`, { status: 'completed' }),
    onSuccess: () => {
      toast.success('Order completed');
      queryClient.invalidateQueries({ queryKey: ['kitchen-orders-active'] });
      queryClient.invalidateQueries({ queryKey: ['kitchen-orders-ready'] });
      queryClient.invalidateQueries({ queryKey: ['kitchen-stats'] });
      queryClient.invalidateQueries({ queryKey: ['kitchen-orders-history'] });
    },
    onError: (error) => toast.error(error.response?.data?.message || 'Failed to complete order'),
  });

  const readyOrders = useMemo(() => {
    const orders = readyQuery.data || [];
    return orders.filter((o) => o.orderType?.toLowerCase() !== 'delivery').sort((a, b) => new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt));
  }, [readyQuery.data]);

  const totalReadyOrders = readyQuery.data?.length || 0;
  const nonDeliveryReadyCount = readyOrders.length;
  const deliveryReadyCount = totalReadyOrders - nonDeliveryReadyCount;

  const historyOrders = useMemo(() => (historyQuery.data || []).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)), [historyQuery.data]);

  useEffect(() => {
    setPreviousReadyOrderIds(new Set(readyOrders.map((o) => o._id)));
  }, [readyOrders]);

  const totalReadyPages = Math.ceil(readyOrders.length / readyItemsPerPage);
  const paginatedReadyOrders = useMemo(() => {
    const start = (readyPage - 1) * readyItemsPerPage;
    return readyOrders.slice(start, start + readyItemsPerPage);
  }, [readyOrders, readyPage]);

  const filteredOrders = useMemo(() => {
    if (statusFilter === 'all') return activeOrders;
    return activeOrders.filter((o) => o.status === statusFilter);
  }, [activeOrders, statusFilter]);

  const stats = statsQuery.data || {};
  const team = teamQuery.data || [];
  const pendingCount = activeOrders.filter((o) => o.status === 'placed' || o.status === 'confirmed').length;
  const preparingCount = activeOrders.filter((o) => o.status === 'preparing').length;

  const refreshAll = () => {
    ordersQuery.refetch(); readyQuery.refetch(); statsQuery.refetch(); teamQuery.refetch(); historyQuery.refetch();
    toast.success('Refreshed');
  };

  const handleLogout = async () => {
    setShowLogoutConfirm(false);
    await dispatch(logoutUser());
    navigate('/login', { replace: true });
  };

  return (
    <>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-6 md:px-6 md:py-8">
          {/* Header */}
          <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Kitchen Display System</h1>
              <p className="text-sm text-gray-500 mt-1">Real-time order management{user?.name ? ` • Signed in as ${user.name}` : ''}</p>
            </div>
            <div className="flex items-center gap-3 flex-wrap">
              <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg p-1">
                {[
                  { key: 'orders', label: '📋 Active Orders' },
                  { key: 'history', label: 'History', icon: <CalendarDays size={14} /> },
                  { key: 'waste', label: 'Waste Log', icon: <Trash size={14} /> },
                ].map(({ key, label, icon }) => (
                  <button
                    key={key}
                    onClick={() => setActiveTab(key)}
                    className={`px-4 py-2 rounded-lg text-sm font-semibold transition flex items-center gap-2 ${activeTab === key ? 'bg-amber-500 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
                  >
                    {icon}{label}
                  </button>
                ))}
              </div>
              <button onClick={() => setInventoryOpen(true)} className="flex items-center gap-2 px-4 py-2 bg-amber-500 text-white rounded-lg text-sm font-semibold hover:bg-amber-600 transition">
                <Package size={16} />Inventory
              </button>
              <button onClick={refreshAll} className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-50 transition">
                <RefreshCw size={16} />Refresh
              </button>
              <button onClick={() => setShowLogoutConfirm(true)} className="flex items-center gap-2 px-4 py-2 bg-white border border-red-200 rounded-lg text-sm font-semibold text-red-600 hover:bg-red-50 transition">
                <LogOut size={16} />Logout
              </button>
            </div>
          </div>

          {activeTab === 'orders' && (
            <>
              {pendingCount > 0 && (
                <div className="mb-6 bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-center gap-3">
                  <AlertTriangle size={20} className="text-amber-600" />
                  <div>
                    <p className="text-sm font-semibold text-amber-800">Attention Required</p>
                    <p className="text-sm text-amber-700">{pendingCount} order(s) waiting to be started</p>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {[
                  { label: 'Active Orders', value: activeOrders.length, sub: `${preparingCount} in preparation`, bg: 'bg-amber-50 border-amber-100', iconBg: 'bg-amber-100', icon: <ChefHat size={20} className="text-amber-600" /> },
                  { label: 'Ready Orders', value: nonDeliveryReadyCount, sub: `${deliveryReadyCount} sent to delivery panel`, bg: 'bg-green-50 border-green-100', iconBg: 'bg-green-100', icon: <PackageCheck size={20} className="text-green-600" /> },
                  { label: 'Avg. Prep Time', value: `${stats.avgPrepTimeMinutes || 0}m`, sub: '', bg: 'bg-blue-50 border-blue-100', iconBg: 'bg-blue-100', icon: <Clock3 size={20} className="text-blue-600" /> },
                  { label: 'Completed Today', value: stats.completedToday || 0, sub: '', bg: 'bg-purple-50 border-purple-100', iconBg: 'bg-purple-100', icon: <TrendingUp size={20} className="text-purple-600" /> },
                ].map(({ label, value, sub, bg, iconBg, icon }) => (
                  <div key={label} className={`rounded-xl border ${bg} p-5`}>
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">{label}</p>
                        <p className="mt-2 text-3xl font-bold text-gray-900">{value}</p>
                        {sub && <p className="mt-2 text-xs text-gray-500">{sub}</p>}
                      </div>
                      <div className={`rounded-lg p-2 ${iconBg}`}>{icon}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Active Orders */}
              <div className="mb-8">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">Active Orders</h2>
                    <p className="text-sm text-gray-500">Orders currently being prepared</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg p-1">
                      <button onClick={() => setViewMode('list')} className={`p-1.5 rounded ${viewMode === 'list' ? 'bg-amber-100 text-amber-600' : 'text-gray-500'}`}><List size={16} /></button>
                      <button onClick={() => setViewMode('grid')} className={`p-1.5 rounded ${viewMode === 'grid' ? 'bg-amber-100 text-amber-600' : 'text-gray-500'}`}><Grid3x3 size={16} /></button>
                    </div>
                    <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm">
                      <option value="all">All Status</option>
                      <option value="placed">Pending</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="preparing">Preparing</option>
                    </select>
                  </div>
                </div>

                {filteredOrders.length === 0 ? (
                  <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
                    <ChefHat size={48} className="mx-auto text-gray-300 mb-3" />
                    <p className="text-gray-500">No active orders at the moment</p>
                  </div>
                ) : viewMode === 'list' ? (
                  <div className="space-y-3">
                    {filteredOrders.map((order) => {
                      const isExpanded = expandedOrderId === order._id;
                      const Icon = ORDER_TYPE_ICONS[order.orderType?.toLowerCase()] || ShoppingBag;
                      const prepEstimate = getEstimatedPrepMinutes(order, stats.avgPrepTimeMinutes);
                      const preOrderTiming = getPreOrderTiming(order, currentTime);
                      const prepLocked = order.status !== 'preparing' && !!preOrderTiming && !preOrderTiming.canStart;
                      const prepWaitMinutes = prepLocked ? Math.max(1, preOrderTiming.minutesUntilScheduled - preOrderTiming.prepLeadMinutes) : 0;
                      const actionLabel = order.status === 'preparing' ? 'Mark Ready' : prepLocked ? `Starts in ${prepWaitMinutes}m` : 'Start Prep';
                      return (
                        <div key={order._id} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                          <div className="p-4 cursor-pointer hover:bg-gray-50 transition-colors" onClick={() => setExpandedOrderId(isExpanded ? null : order._id)}>
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center gap-3 flex-wrap">
                                  <span className="font-mono text-sm font-bold text-amber-600">#{order.orderId || order._id?.slice(-6)}</span>
                                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${STATUS_COLORS[order.status]}`}>{order.status}</span>
                                  <span className="flex items-center gap-1 text-xs text-gray-500 capitalize"><Icon size={12} />{ORDER_TYPE_LABELS[order.orderType?.toLowerCase()] || order.orderType || 'Dine-in'}</span>
                                </div>
                                <p className="font-semibold text-gray-900 mt-2">{order.customerName || order.customer?.name || 'Guest'}</p>
                                <div className="flex items-center gap-3 mt-1 text-sm text-gray-600">
                                  <span>{order.items?.length || 0} item(s)</span><span>•</span>
                                  <span className="font-semibold">₹{order.totalAmount || order.total || 0}</span>
                                </div>
                                <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-gray-500">
                                  <span>Estimated prep: <strong className="text-gray-700">{prepEstimate} min</strong></span>
                                  {preOrderTiming && (
                                    <>
                                      <span>Serve at: <strong className="text-gray-700">{preOrderTiming.scheduledAt.toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit' })}</strong></span>
                                      <span>{prepLocked ? `Prep opens in ${prepWaitMinutes} min` : 'Prep window open'}</span>
                                    </>
                                  )}
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <button onClick={(e) => { e.stopPropagation(); setSelectedOrder(order); }} className="px-3 py-2 rounded-lg text-sm font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 transition flex items-center gap-1">
                                  <Eye size={14} />View
                                </button>
                                <button
                                  type="button"
                                  disabled={prepLocked}
                                  title={prepLocked ? `Pre-order prep starts ${getPreOrderPrepLeadMinutes(order)} minutes before scheduled time.` : ''}
                                  onClick={(e) => { e.stopPropagation(); if (!prepLocked) updateMutation.mutate({ orderId: order._id, status: order.status === 'preparing' ? 'ready' : 'preparing' }); }}
                                  className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                                    prepLocked
                                      ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                                      : order.status === 'preparing'
                                      ? 'bg-green-500 hover:bg-green-600 text-white'
                                      : 'bg-amber-500 hover:bg-amber-600 text-white'
                                  }`}
                                >
                                  {actionLabel}
                                </button>
                                {isExpanded ? <ChevronUp size={18} className="text-gray-400" /> : <ChevronDown size={18} className="text-gray-400" />}
                              </div>
                            </div>
                          </div>
                          {isExpanded && (
                            <div className="border-t border-gray-100 bg-gray-50 p-4">
                              <div className="grid gap-4 md:grid-cols-2">
                                <div>
                                  <h4 className="text-sm font-semibold text-gray-700 mb-3">Order Items</h4>
                                  <div className="space-y-2">
                                    {(order.items || []).map((item, idx) => (
                                      <div key={idx} className="bg-white rounded-lg p-3 border border-gray-200">
                                        <div className="flex justify-between">
                                          <div>
                                            <p className="font-medium text-gray-900">{item.name || item.menuItem?.name}</p>
                                            {item.specialInstructions && <p className="text-xs text-gray-500 mt-1">{item.specialInstructions}</p>}
                                          </div>
                                          <div className="text-right">
                                            <p className="text-sm text-gray-600">x{item.quantity}</p>
                                            <p className="text-sm font-semibold">₹{(item.price || item.unitPrice || 0) * item.quantity}</p>
                                          </div>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                                <div>
                                  <h4 className="text-sm font-semibold text-gray-700 mb-3">Preparation Progress</h4>
                                  <div className="bg-white rounded-lg p-4 border border-gray-200">
                                    <PreparationProgress status={order.status} />
                                  </div>
                                  <div className="mt-3 rounded-lg border border-blue-100 bg-blue-50 px-3 py-2 text-sm text-blue-700">
                                    Estimated prep time: <strong>{prepEstimate} min</strong>
                                  </div>
                                  {preOrderTiming && (
                                    <div className="mt-3 rounded-lg border border-amber-100 bg-amber-50 px-3 py-2 text-sm text-amber-700">
                                      Scheduled for {preOrderTiming.scheduledAt.toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit' })}. {prepLocked ? `Kitchen can start in ${prepWaitMinutes} minute(s).` : `Kitchen can start now within the ${preOrderTiming.prepLeadMinutes}-minute prep window.`}
                                    </div>
                                  )}
                                  {order.specialNotes && (
                                    <div className="mt-4 bg-amber-50 border border-amber-200 rounded-lg p-3">
                                      <p className="text-xs font-semibold text-amber-800 mb-1">Special Instructions:</p>
                                      <p className="text-sm text-amber-700">{order.specialNotes}</p>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredOrders.map((order) => {
                      const Icon = ORDER_TYPE_ICONS[order.orderType?.toLowerCase()] || ShoppingBag;
                      const prepEstimate = getEstimatedPrepMinutes(order, stats.avgPrepTimeMinutes);
                      const preOrderTiming = getPreOrderTiming(order, currentTime);
                      const prepLocked = order.status !== 'preparing' && !!preOrderTiming && !preOrderTiming.canStart;
                      const prepWaitMinutes = prepLocked ? Math.max(1, preOrderTiming.minutesUntilScheduled - preOrderTiming.prepLeadMinutes) : 0;
                      return (
                        <div key={order._id} className="bg-white rounded-lg border border-gray-200 p-4">
                          <div className="flex items-start justify-between mb-3">
                            <span className="font-mono text-sm font-bold text-amber-600">#{order.orderId || order._id?.slice(-6)}</span>
                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${STATUS_COLORS[order.status]}`}>{order.status}</span>
                          </div>
                          <div className="flex items-center gap-2 text-xs text-gray-500 mb-2"><Icon size={12} /><span className="capitalize">{ORDER_TYPE_LABELS[order.orderType?.toLowerCase()] || 'Dine-in'}</span></div>
                          <p className="font-semibold text-gray-900">{order.customerName || order.customer?.name || 'Guest'}</p>
                          <p className="text-sm text-gray-600 mt-1">{order.items?.length || 0} items • ₹{order.totalAmount || order.total || 0}</p>
                          <p className="mt-2 text-xs text-gray-500">Estimated prep: <strong className="text-gray-700">{prepEstimate} min</strong></p>
                          {preOrderTiming && (
                            <p className="mt-1 text-xs text-amber-700">
                              Serve at {preOrderTiming.scheduledAt.toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit' })} • {prepLocked ? `Prep opens in ${prepWaitMinutes} min` : 'Prep window open'}
                            </p>
                          )}
                          <div className="mt-3"><div className="h-1.5 bg-gray-200 rounded-full overflow-hidden"><div className={`h-full rounded-full ${order.status === 'placed' ? 'w-1/4 bg-orange-500' : order.status === 'confirmed' ? 'w-2/4 bg-blue-500' : order.status === 'preparing' ? 'w-3/4 bg-purple-500' : 'w-full bg-green-500'}`} /></div></div>
                          <div className="flex gap-2 mt-4">
                            <button onClick={() => setSelectedOrder(order)} className="flex-1 px-3 py-2 text-sm font-semibold text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition">View</button>
                            <button
                              type="button"
                              disabled={prepLocked}
                              title={prepLocked ? `Pre-order prep starts ${getPreOrderPrepLeadMinutes(order)} minutes before scheduled time.` : ''}
                              onClick={() => { if (!prepLocked) updateMutation.mutate({ orderId: order._id, status: order.status === 'preparing' ? 'ready' : 'preparing' }); }}
                              className={`flex-1 px-3 py-2 text-sm font-semibold rounded-lg transition ${
                                prepLocked
                                  ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                                  : order.status === 'preparing'
                                  ? 'bg-green-500 hover:bg-green-600 text-white'
                                  : 'bg-amber-500 hover:bg-amber-600 text-white'
                              }`}
                            >
                              {order.status === 'preparing' ? 'Ready' : prepLocked ? `Starts in ${prepWaitMinutes}m` : 'Start'}
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Ready & Team */}
              <div className="grid lg:grid-cols-2 gap-6">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h2 className="text-xl font-bold text-gray-900">Ready for Pickup</h2>
                      <p className="text-sm text-gray-500">Dine-in, takeaway, pre-order only{deliveryReadyCount > 0 && ` • ${deliveryReadyCount} delivery sent to delivery panel`}</p>
                    </div>
                    {readyOrders.length > 0 && <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-semibold">{readyOrders.length} total</span>}
                  </div>
                  <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                    <div className="divide-y divide-gray-200">
                      {paginatedReadyOrders.length === 0 ? (
                        <div className="p-8 text-center"><PackageCheck size={40} className="mx-auto text-gray-300 mb-2" /><p className="text-gray-500">No ready orders</p></div>
                      ) : paginatedReadyOrders.map((order) => (
                        <div key={order._id} className="p-4 hover:bg-gray-50">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <span className="font-mono text-sm font-bold text-green-700">#{order.orderId || order._id?.slice(-6)}</span>
                                <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded-full text-xs font-semibold">Ready</span>
                                {order.orderType && <span className="text-xs text-gray-500 capitalize">({order.orderType})</span>}
                              </div>
                              <p className="font-medium text-gray-900 mt-2">{order.customerName || order.customer?.name || 'Guest'}</p>
                              <p className="text-sm text-gray-600 mt-1">{order.items?.length || 0} items • ₹{order.totalAmount || order.total || 0}</p>
                            </div>
                            <div className="flex gap-2">
                              <button onClick={() => setSelectedOrder(order)} className="px-3 py-1.5 text-sm font-semibold text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition">View</button>
                              <button onClick={() => completeMutation.mutate(order._id)} className="px-3 py-1.5 text-sm font-semibold text-green-700 bg-green-100 rounded-lg hover:bg-green-200 transition">Complete</button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    {readyOrders.length > readyItemsPerPage && <Pagination currentPage={readyPage} totalPages={totalReadyPages} onPageChange={setReadyPage} />}
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div><h2 className="text-xl font-bold text-gray-900">Kitchen Team</h2><p className="text-sm text-gray-500">Current shift and availability</p></div>
                    <Users size={20} className="text-gray-400" />
                  </div>
                  <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                    <div className="divide-y divide-gray-200">
                      {team.length === 0 ? (
                        <div className="p-8 text-center"><Users size={40} className="mx-auto text-gray-300 mb-2" /><p className="text-gray-500">No team data available</p></div>
                      ) : team.map((member) => <StaffCard key={member._id} member={member} />)}
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {activeTab === 'history' && <HistoryOrders orders={historyOrders} onViewOrder={setSelectedOrder} />}
          {activeTab === 'waste' && <div className="bg-white rounded-lg border border-gray-200 overflow-hidden"><KitchenWasteLog /></div>}
          {activeTab === 'lowstock' && <LowStockAlert />}
        </div>
      </div>

      <InventorySidebar open={inventoryOpen} onClose={() => setInventoryOpen(false)} />
      <OrderDetailsModal order={selectedOrder} onClose={() => setSelectedOrder(null)} />

      {showLogoutConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={() => setShowLogoutConfirm(false)}>
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full" onClick={(e) => e.stopPropagation()}>
            <div className="p-5 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center"><LogOut size={18} className="text-red-600" /></div>
                <h2 className="text-xl font-bold text-gray-900">Confirm Logout</h2>
              </div>
            </div>
            <div className="p-5">
              <p className="text-gray-700">Are you sure you want to logout?</p>
              <p className="text-sm text-gray-500 mt-2">You will need to login again to access your account.</p>
            </div>
            <div className="flex justify-end gap-3 p-5 border-t border-gray-200">
              <button onClick={() => setShowLogoutConfirm(false)} className="px-4 py-2 border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 transition">Cancel</button>
              <button onClick={handleLogout} className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition">Yes, Logout</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
