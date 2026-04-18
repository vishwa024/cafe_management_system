import { useMemo, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { AlertTriangle, Edit, Search, Package, Layers3 } from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../../services/api';

export default function InventoryPage() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [editItem, setEditItem] = useState(null);
  const [newStock, setNewStock] = useState('');

  const { data: inventory = [], isLoading } = useQuery({
    queryKey: ['kitchen-inventory-page'],
    queryFn: async () => {
      const response = await api.get('/manager/inventory');
      return Array.isArray(response.data)
        ? response.data
        : response.data?.inventory || response.data?.items || [];
    },
  });

  const normalizedInventory = useMemo(
    () =>
      inventory.map((item) => ({
        ...item,
        category: item.category || 'Other',
        currentStock: Number(item.currentStock ?? item.quantity ?? 0),
        minThreshold: Number(item.minThreshold ?? item.reorderLevel ?? 0),
        lastUpdated: item.updatedAt || item.lastUpdated || item.createdAt || new Date().toISOString(),
      })),
    [inventory]
  );

  const categoryOptions = useMemo(
    () => ['All', ...Array.from(new Set(normalizedInventory.map((item) => item.category))).sort()],
    [normalizedInventory]
  );

  const displayInventory = normalizedInventory.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = categoryFilter === 'All' || item.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const groupedInventory = useMemo(
    () =>
      displayInventory.reduce((groups, item) => {
        const key = item.category || 'Other';
        groups[key] = groups[key] || [];
        groups[key].push(item);
        return groups;
      }, {}),
    [displayInventory]
  );

  const lowStock = displayInventory.filter((item) => item.currentStock <= item.minThreshold);

  const updateMutation = useMutation({
    mutationFn: ({ item, stock }) =>
      api.put(`/manager/inventory/${item._id}`, {
        name: item.name,
        category: item.category || 'Other',
        currentStock: Number(stock || 0),
        unit: item.unit,
        reorderLevel: Number(item.reorderLevel ?? item.minThreshold ?? 0),
        supplier: item.supplier?._id || item.supplier || null,
        notes: item.notes || '',
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['kitchen-inventory-page'] });
      queryClient.invalidateQueries({ queryKey: ['kitchen-inventory'] });
      setEditItem(null);
      toast.success('Stock updated!');
    },
    onError: (error) => {
      setEditItem(null);
      toast.error(error.response?.data?.message || 'Failed to update stock');
    },
  });

  const getStockStatus = (item) => {
    if (item.currentStock <= item.minThreshold * 0.5) return { label: 'Critical', cls: 'badge-danger' };
    if (item.currentStock <= item.minThreshold) return { label: 'Low', cls: 'badge-warning' };
    return { label: 'OK', cls: 'badge-success' };
  };

  return (
    <div className="min-h-screen bg-gray-50 font-body">
      <header className="bg-dark text-white px-8 py-4 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <img src="https://rollercoastercafe.com/assets/images/roller_logo.png" alt="Logo" className="h-10 object-contain" />
          <div>
            <h1 className="font-display font-bold text-xl">Inventory Management</h1>
            <p className="text-gray-400 text-sm">Kitchen Panel</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/kitchen" className="btn-outline border-gray-600 text-gray-300 hover:bg-white/10 hover:text-white py-2 text-sm">Back to KDS Board</Link>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {lowStock.length > 0 && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="bg-red-50 border border-red-200 rounded-2xl p-5 mb-6">
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle className="text-red-600" size={20} />
              <h3 className="font-semibold text-red-800">{lowStock.length} Low Stock Alert{lowStock.length > 1 ? 's' : ''}</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {lowStock.map((item) => (
                <span key={item._id} className="bg-red-100 text-red-700 text-sm font-medium px-3 py-1 rounded-full">
                  {item.name} ({item.currentStock} {item.unit})
                </span>
              ))}
            </div>
          </motion.div>
        )}

        <div className="flex flex-col gap-4 mb-6 md:flex-row">
          <div className="relative flex-1">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search ingredients..." className="input-field pl-10" />
          </div>
          <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} className="input-field md:max-w-xs">
            {categoryOptions.map((category) => (
              <option key={category} value={category}>
                {category === 'All' ? 'All Categories' : category}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 gap-4 mb-6 md:grid-cols-4">
          {[
            { label: 'Total Items', value: displayInventory.length, icon: Package, color: 'text-blue-600 bg-blue-100' },
            { label: 'Categories', value: Math.max(categoryOptions.length - 1, 0), icon: Layers3, color: 'text-violet-600 bg-violet-100' },
            { label: 'Low Stock', value: lowStock.length, icon: AlertTriangle, color: 'text-amber-600 bg-amber-100' },
            { label: 'Critical', value: displayInventory.filter((item) => item.currentStock <= item.minThreshold * 0.5).length, icon: AlertTriangle, color: 'text-red-600 bg-red-100' },
          ].map(({ label, value, icon: Icon, color }) => (
            <div key={label} className="card p-5 flex items-center gap-4">
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${color}`}><Icon size={20} /></div>
              <div><p className="text-2xl font-display font-bold text-dark">{value}</p><p className="text-gray-500 text-sm">{label}</p></div>
            </div>
          ))}
        </div>

        {isLoading ? (
          <div className="card p-8 text-center text-gray-500">Loading inventory...</div>
        ) : displayInventory.length === 0 ? (
          <div className="card p-8 text-center text-gray-500">No inventory items found for this category.</div>
        ) : (
          <div className="space-y-6">
            {Object.entries(groupedInventory).map(([category, items]) => (
              <div key={category} className="card overflow-hidden">
                <div className="flex items-center justify-between border-b border-gray-100 bg-gray-50 px-5 py-4">
                  <div>
                    <h3 className="font-semibold text-dark">{category}</h3>
                    <p className="text-xs text-gray-500">{items.length} ingredient{items.length > 1 ? 's' : ''}</p>
                  </div>
                  <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-gray-600 shadow-sm">
                    {items.filter((item) => item.currentStock <= item.minThreshold).length} low stock
                  </span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-white border-b border-gray-100">
                      <tr>
                        {['Ingredient', 'Current Stock', 'Min. Threshold', 'Status', 'Last Updated', 'Action'].map((heading) => (
                          <th key={heading} className="text-left px-5 py-4 font-semibold text-gray-500">{heading}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {items.map((item) => {
                        const status = getStockStatus(item);
                        return (
                          <tr key={item._id} className={`hover:bg-gray-50 transition-colors ${item.currentStock <= item.minThreshold ? 'bg-red-50/30' : ''}`}>
                            <td className="px-5 py-4 font-semibold text-dark">{item.name}</td>
                            <td className="px-5 py-4">
                              {editItem === item._id ? (
                                <input
                                  type="number"
                                  value={newStock}
                                  onChange={(e) => setNewStock(e.target.value)}
                                  className="w-24 border border-primary rounded-lg px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                                  autoFocus
                                />
                              ) : (
                                <span className="font-semibold">{item.currentStock} {item.unit}</span>
                              )}
                            </td>
                            <td className="px-5 py-4 text-gray-500">{item.minThreshold} {item.unit}</td>
                            <td className="px-5 py-4"><span className={`badge ${status.cls}`}>{status.label}</span></td>
                            <td className="px-5 py-4 text-gray-400 text-xs">{new Date(item.lastUpdated).toLocaleDateString('en-IN')}</td>
                            <td className="px-5 py-4">
                              {editItem === item._id ? (
                                <div className="flex gap-2">
                                  <button onClick={() => updateMutation.mutate({ item, stock: Number(newStock) })} className="text-green-600 font-semibold text-xs hover:underline">Save</button>
                                  <button onClick={() => setEditItem(null)} className="text-gray-400 font-semibold text-xs hover:underline">Cancel</button>
                                </div>
                              ) : (
                                <button onClick={() => { setEditItem(item._id); setNewStock(String(item.currentStock)); }} className="flex items-center gap-1 text-primary text-xs font-semibold hover:underline">
                                  <Edit size={12} /> Update
                                </button>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
