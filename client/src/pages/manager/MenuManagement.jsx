import React, { useEffect, useState, useMemo } from 'react';
import api from '../../services/api';
import { LoadingSpinner, EmptyState } from '../../components/shared/StatusBadge';
import { Search, Plus, Edit2, Eye, ChevronLeft, ChevronRight, X, Trash2, Power, PowerOff } from 'lucide-react';
import toast from 'react-hot-toast';

const CATEGORY_MAP = {
    'Hot Beverages': ['Coffee', 'Tea', 'Other Hot Drinks'],
    'Cold Beverages': ['Cold Coffee', 'Milkshakes', 'Smoothies', 'Fresh Juices', 'Mocktails'],
    'Starters / Snacks': ['Veg Starters', 'Non-Veg Starters'],
    'Pizza': ['Veg Pizza', 'Non-Veg Pizza'],
    'Burgers': ['Veg Burgers', 'Non-Veg Burgers'],
    'Sandwiches & Wraps': [],
    'Pasta & Noodles': [],
    'Main Course': ['Veg', 'Non-Veg'],
    'Chinese': [],
    'Desserts': ['Ice Cream', 'Waffles & Pancakes', 'Other Desserts'],
    'Combo Meals': [],
};

const CATEGORIES = Object.keys(CATEGORY_MAP);
const FOOD_INGREDIENT_PRESETS = {
    Burgers: [
        { name: 'Burger Bun', category: 'Bakery', unit: 'pcs', reorderLevel: 10 },
        { name: 'Cheese Slice', category: 'Dairy', unit: 'pcs', reorderLevel: 12 },
        { name: 'Burger Patty', category: 'Other', unit: 'pcs', reorderLevel: 8 },
        { name: 'Lettuce', category: 'Vegetables', unit: 'kg', reorderLevel: 2 },
        { name: 'Tomato', category: 'Vegetables', unit: 'kg', reorderLevel: 3 },
        { name: 'Burger Sauce', category: 'Sauces', unit: 'bottle', reorderLevel: 2 },
    ],
    Pizza: [
        { name: 'Pizza Base', category: 'Bakery', unit: 'pcs', reorderLevel: 12 },
        { name: 'Mozzarella Cheese', category: 'Dairy', unit: 'kg', reorderLevel: 3 },
        { name: 'Pizza Sauce', category: 'Sauces', unit: 'bottle', reorderLevel: 2 },
        { name: 'Capsicum', category: 'Vegetables', unit: 'kg', reorderLevel: 2 },
        { name: 'Onion', category: 'Vegetables', unit: 'kg', reorderLevel: 3 },
    ],
    'Sandwiches & Wraps': [
        { name: 'Sandwich Bread', category: 'Bakery', unit: 'pcs', reorderLevel: 10 },
        { name: 'Butter', category: 'Dairy', unit: 'kg', reorderLevel: 2 },
        { name: 'Cheese Slice', category: 'Dairy', unit: 'pcs', reorderLevel: 10 },
        { name: 'Cucumber', category: 'Vegetables', unit: 'kg', reorderLevel: 2 },
        { name: 'Sandwich Spread', category: 'Sauces', unit: 'bottle', reorderLevel: 2 },
    ],
    'Hot Beverages': [
        { name: 'Milk', category: 'Dairy', unit: 'L', reorderLevel: 10 },
        { name: 'Coffee Powder', category: 'Beverages', unit: 'kg', reorderLevel: 1 },
        { name: 'Tea Leaves', category: 'Beverages', unit: 'kg', reorderLevel: 1 },
        { name: 'Sugar', category: 'Dry Goods', unit: 'kg', reorderLevel: 5 },
    ],
    'Cold Beverages': [
        { name: 'Milk', category: 'Dairy', unit: 'L', reorderLevel: 10 },
        { name: 'Ice Cubes', category: 'Frozen', unit: 'bag', reorderLevel: 3 },
        { name: 'Sugar Syrup', category: 'Sauces', unit: 'bottle', reorderLevel: 2 },
        { name: 'Paper Cup', category: 'Packaging', unit: 'pcs', reorderLevel: 30 },
    ],
    'Pasta & Noodles': [
        { name: 'Pasta', category: 'Dry Goods', unit: 'kg', reorderLevel: 4 },
        { name: 'Cream', category: 'Dairy', unit: 'L', reorderLevel: 2 },
        { name: 'Garlic', category: 'Vegetables', unit: 'kg', reorderLevel: 1 },
        { name: 'Pasta Sauce', category: 'Sauces', unit: 'bottle', reorderLevel: 2 },
    ],
};
const EMPTY_FORM = {
    name: '',
    description: '',
    price: '',
    category: '',
    subcategory: '',
    image: '',
    isAvailable: true,
    recipe: '',
    ingredients: [],
};

const inputStyle = { border: '1px solid #e5e7eb', borderRadius: '8px', padding: '8px 12px', fontSize: '13px', background: '#fff', outline: 'none', width: '100%', boxSizing: 'border-box' };
const labelStyle = { fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#6b7280', display: 'block', marginBottom: '5px' };
const btnPrimary = { background: '#f59e0b', color: '#fff', border: 'none', borderRadius: '8px', padding: '9px 18px', fontSize: '13px', fontWeight: 600, cursor: 'pointer' };
const btnSecondary = { background: '#f5f5f5', color: '#444', border: '1px solid #e0e0e0', borderRadius: '8px', padding: '9px 18px', fontSize: '13px', fontWeight: 600, cursor: 'pointer' };

export default function MenuManagement() {
    const [items, setItems] = useState([]);
    const [inventoryItems, setInventoryItems] = useState([]);
    const [ingredientSearch, setIngredientSearch] = useState('');
    const [ingredientCategory, setIngredientCategory] = useState('All');
    const [creatingInventory, setCreatingInventory] = useState(false);
    const [newInventoryItem, setNewInventoryItem] = useState({ name: '', category: 'Other', unit: 'pcs', reorderLevel: '' });
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editing, setEditing] = useState(null);
    const [form, setForm] = useState(EMPTY_FORM);
    const [filterCat, setFilterCat] = useState('');
    const [filterSub, setFilterSub] = useState('');
    const [filterActive, setFilterActive] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [deleteConfirm, setDeleteConfirm] = useState(null);
    const [deleting, setDeleting] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(12);

    const filterSubcategories = filterCat ? (CATEGORY_MAP[filterCat] || []) : [];
    const formSubcategories = form.category ? (CATEGORY_MAP[form.category] || []) : [];
    const inventoryCategoryOptions = useMemo(
        () => ['All', ...Array.from(new Set(inventoryItems.map((item) => item.category || 'Other'))).sort()],
        [inventoryItems]
    );
    const filteredInventoryOptions = useMemo(() => {
        return inventoryItems.filter((item) => {
            const matchesCategory = ingredientCategory === 'All' || (item.category || 'Other') === ingredientCategory;
            const matchesSearch = !ingredientSearch.trim() || item.name?.toLowerCase().includes(ingredientSearch.toLowerCase());
            return matchesCategory && matchesSearch;
        });
    }, [ingredientCategory, ingredientSearch, inventoryItems]);
    const groupedInventoryOptions = useMemo(() => {
        return inventoryItems.reduce((groups, item) => {
            const key = item.category || 'Other';
            groups[key] = groups[key] || [];
            groups[key].push(item);
            return groups;
        }, {});
    }, [inventoryItems]);
    const presetSuggestions = useMemo(() => {
        const existingNames = new Set(inventoryItems.map((item) => item.name?.trim().toLowerCase()));
        const presets = FOOD_INGREDIENT_PRESETS[form.category] || [];
        return presets.filter((item) => !existingNames.has(item.name.toLowerCase()));
    }, [form.category, inventoryItems]);

    const fetchItems = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (filterCat) params.append('category', filterCat);
            if (filterSub) params.append('subcategory', filterSub);
            if (filterActive) params.append('active', filterActive);
            const res = await api.get(`/manager/menu?${params}`);
            setItems(Array.isArray(res.data) ? res.data : []);
            setError('');
            setCurrentPage(1);
        } catch (err) {
            setError('Failed to load menu.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const fetchInventoryItems = async () => {
        try {
            const res = await api.get('/manager/inventory');
            setInventoryItems(Array.isArray(res.data) ? res.data : (res.data?.inventory || []));
        } catch (err) {
            console.error('Failed to load inventory items for recipes:', err);
        }
    };

    useEffect(() => {
        fetchItems();
        fetchInventoryItems();
    }, [filterCat, filterSub, filterActive]);

    useEffect(() => {
        if (!showModal) return undefined;
        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = previousOverflow;
        };
    }, [showModal]);

    const filteredItems = useMemo(() => {
        let result = [...items];
        if (searchTerm.trim()) {
            const term = searchTerm.toLowerCase().trim();
            result = result.filter(item =>
                item.name?.toLowerCase().includes(term) ||
                item.description?.toLowerCase().includes(term) ||
                item.category?.toLowerCase().includes(term) ||
                item.subcategory?.toLowerCase().includes(term)
            );
        }
        return result;
    }, [items, searchTerm]);

    const handleFilterCatChange = (e) => {
        setFilterCat(e.target.value);
        setFilterSub('');
    };

    const openCreate = () => {
        setEditing(null);
        setForm(EMPTY_FORM);
        setIngredientSearch('');
        setIngredientCategory('All');
        setCreatingInventory(false);
        setNewInventoryItem({ name: '', category: 'Other', unit: 'pcs', reorderLevel: '' });
        setShowModal(true);
    };

    const openEdit = (item) => {
        setEditing(item);
        setForm({
            name: item.name || '',
            description: item.description || '',
            price: (item.basePrice ?? '').toString(),
            category: item.category || '',
            subcategory: item.subcategory || '',
            image: item.image || '',
            isAvailable: item.isAvailable ?? true,
            recipe: item.recipe || '',
            ingredients: Array.isArray(item.ingredients)
                ? item.ingredients.map((ingredient) => ({
                    inventoryItem: ingredient.inventoryItem?._id || ingredient.inventoryItem || '',
                    quantity: ingredient.quantity?.toString?.() || '',
                    unit: ingredient.unit || ingredient.inventoryItem?.unit || '',
                }))
                : [],
        });
        setIngredientSearch('');
        setIngredientCategory('All');
        setCreatingInventory(false);
        setNewInventoryItem({ name: '', category: 'Other', unit: 'pcs', reorderLevel: '' });
        setShowModal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            const payload = {
                name: form.name?.trim(),
                description: form.description?.trim(),
                category: form.category,
                subcategory: form.subcategory || '',
                image: form.image?.trim(),
                isAvailable: form.isAvailable,
                basePrice: Number(form.price),
                recipe: form.recipe?.trim() || '',
                ingredients: (form.ingredients || [])
                    .map((ingredient) => ({
                        inventoryItem: ingredient.inventoryItem,
                        quantity: Number(ingredient.quantity || 0),
                        unit: ingredient.unit || '',
                    }))
                    .filter((ingredient) => ingredient.inventoryItem && ingredient.quantity > 0),
            };
            if (editing) {
                await api.put(`/manager/menu/${editing._id}`, payload);
                toast.success('Item updated successfully');
            } else {
                await api.post('/manager/menu', payload);
                toast.success('Item added successfully');
            }
            setShowModal(false);
            setForm(EMPTY_FORM);
            fetchItems();
        } catch (err) {
            setError(err.response?.data?.message || err.message || 'Failed to save item.');
            toast.error('Failed to save item');
        } finally {
            setSaving(false);
        }
    };

    const handleToggle = async (item) => {
        try {
            const newStatus = !item.isAvailable;
            await api.patch(`/manager/menu/${item._id}/toggle`, { isAvailable: newStatus });
            toast.success(`Item ${newStatus ? 'activated' : 'deactivated'} successfully`);
            fetchItems();
        } catch (err) {
            toast.error('Failed to toggle item status');
            console.error(err);
        }
    };

    const handleDelete = async () => {
        if (!deleteConfirm) return;
        setDeleting(true);
        try {
            await api.delete(`/manager/menu/${deleteConfirm._id}`);
            toast.success('Item deleted successfully');
            setDeleteConfirm(null);
            fetchItems();
        } catch (err) {
            toast.error('Failed to delete item');
            console.error(err);
        } finally {
            setDeleting(false);
        }
    };

    const f = (key) => (e) => setForm(prev => ({ ...prev, [key]: e.target.value }));

    const addIngredientRow = () => {
        setForm((prev) => ({
            ...prev,
            ingredients: [...(prev.ingredients || []), { inventoryItem: '', quantity: '', unit: '' }],
        }));
    };

    const quickAddIngredient = (inventoryItem) => {
        setForm((prev) => {
            const existingIndex = (prev.ingredients || []).findIndex(
                (ingredient) => ingredient.inventoryItem === inventoryItem._id
            );

            if (existingIndex >= 0) {
                const nextIngredients = [...prev.ingredients];
                const existingQuantity = Number(nextIngredients[existingIndex].quantity || 0);
                nextIngredients[existingIndex] = {
                    ...nextIngredients[existingIndex],
                    quantity: String(existingQuantity > 0 ? existingQuantity + 1 : 1),
                    unit: nextIngredients[existingIndex].unit || inventoryItem.unit || '',
                };
                return { ...prev, ingredients: nextIngredients };
            }

            return {
                ...prev,
                ingredients: [
                    ...(prev.ingredients || []),
                    {
                        inventoryItem: inventoryItem._id,
                        quantity: '1',
                        unit: inventoryItem.unit || '',
                    },
                ],
            };
        });
    };

    const createInventoryFromPreset = async (preset) => {
        try {
            const payload = {
                name: preset.name,
                category: preset.category || 'Other',
                currentStock: 0,
                unit: preset.unit || 'pcs',
                reorderLevel: Number(preset.reorderLevel || 0),
                supplier: null,
            };

            const response = await api.post('/manager/inventory', payload);
            const createdItem = response.data;
            await fetchInventoryItems();
            quickAddIngredient(createdItem);
            toast.success(`${preset.name} added to inventory`);
        } catch (err) {
            toast.error(err.response?.data?.message || `Failed to add ${preset.name}`);
        }
    };

    const handleCreateInventoryItem = async () => {
        if (!newInventoryItem.name.trim()) {
            toast.error('Enter inventory name');
            return;
        }

        setCreatingInventory(true);
        try {
            const payload = {
                name: newInventoryItem.name.trim(),
                category: newInventoryItem.category || 'Other',
                currentStock: 0,
                unit: newInventoryItem.unit || 'pcs',
                reorderLevel: Number(newInventoryItem.reorderLevel || 0),
                supplier: null,
            };
            const response = await api.post('/manager/inventory', payload);
            const createdItem = response.data;
            await fetchInventoryItems();
            quickAddIngredient(createdItem);
            setNewInventoryItem({ name: '', category: payload.category, unit: payload.unit, reorderLevel: '' });
            toast.success('Inventory item created and linked');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to create inventory item');
        } finally {
            setCreatingInventory(false);
        }
    };

    const updateIngredientRow = (index, key, value) => {
        setForm((prev) => {
            const nextIngredients = [...(prev.ingredients || [])];
            nextIngredients[index] = { ...nextIngredients[index], [key]: value };

            if (key === 'inventoryItem') {
                const selectedInventory = inventoryItems.find((item) => item._id === value);
                if (selectedInventory && !nextIngredients[index].unit) {
                    nextIngredients[index].unit = selectedInventory.unit || '';
                }
            }

            return { ...prev, ingredients: nextIngredients };
        });
    };

    const removeIngredientRow = (index) => {
        setForm((prev) => ({
            ...prev,
            ingredients: (prev.ingredients || []).filter((_, rowIndex) => rowIndex !== index),
        }));
    };

    const handleFormCategoryChange = (e) => {
        setForm(prev => ({ ...prev, category: e.target.value, subcategory: '' }));
    };

    const clearFilters = () => {
        setFilterCat('');
        setFilterSub('');
        setFilterActive('');
        setSearchTerm('');
    };

    const totalItems = filteredItems.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedItems = filteredItems.slice(startIndex, startIndex + itemsPerPage);

    const handlePageChange = (page) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleItemsPerPageChange = (e) => {
        setItemsPerPage(Number(e.target.value));
        setCurrentPage(1);
    };

    const getPageNumbers = () => {
        const pages = [];
        const maxVisible = 5;
        if (totalPages <= maxVisible) {
            for (let i = 1; i <= totalPages; i++) pages.push(i);
        } else if (currentPage <= 3) {
            for (let i = 1; i <= 4; i++) pages.push(i);
            pages.push('...');
            pages.push(totalPages);
        } else if (currentPage >= totalPages - 2) {
            pages.push(1);
            pages.push('...');
            for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
        } else {
            pages.push(1);
            pages.push('...');
            for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i);
            pages.push('...');
            pages.push(totalPages);
        }
        return pages;
    };

    const clearSearch = () => {
        setSearchTerm('');
        setCurrentPage(1);
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Menu Management</h1>
                    <p className="text-sm text-gray-500 mt-1">{totalItems} items</p>
                </div>
                <button onClick={openCreate} className="flex items-center gap-2 px-4 py-2 bg-amber-500 text-white rounded-lg text-sm font-semibold hover:bg-amber-600 transition">
                    <Plus size={16} /> Add Item
                </button>
            </div>

            {/* Error */}
            {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex justify-between items-center">
                    <span className="text-sm text-red-600">{error}</span>
                    <button onClick={() => setError('')} className="text-red-500">×</button>
                </div>
            )}

            {/* Search Bar */}
            <div className="relative max-w-md">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                    type="text"
                    placeholder="Search food items by name, description, or category..."
                    value={searchTerm}
                    onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                    className="w-full pl-10 pr-10 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-amber-400"
                />
                {searchTerm && (
                    <button onClick={clearSearch} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                        <X size={14} />
                    </button>
                )}
            </div>
            {searchTerm && (
                <p className="text-sm text-gray-500 -mt-4">Found {totalItems} result(s) for "{searchTerm}"</p>
            )}

            {/* Filters */}
            <div className="flex flex-wrap gap-3 items-center">
                <select className="px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:border-amber-400" value={filterCat} onChange={handleFilterCatChange}>
                    <option value="">All Categories</option>
                    {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                </select>

                {filterSubcategories.length > 0 && (
                    <select className="px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:border-amber-400" value={filterSub} onChange={e => setFilterSub(e.target.value)}>
                        <option value="">All Subcategories</option>
                        {filterSubcategories.map(s => <option key={s}>{s}</option>)}
                    </select>
                )}

                <select className="px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:border-amber-400" value={filterActive} onChange={e => setFilterActive(e.target.value)}>
                    <option value="">All Status</option>
                    <option value="true">Available</option>
                    <option value="false">Unavailable</option>
                </select>

                <button onClick={clearFilters} className="px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition">
                    Clear Filters
                </button>
            </div>

            {/* Items Grid */}
            {loading ? <LoadingSpinner /> : paginatedItems.length === 0 ? (
                <div className="text-center py-12">
                    <div className="text-5xl mb-3">🍽️</div>
                    <p className="text-gray-500">No menu items found</p>
                    {(searchTerm || filterCat || filterSub || filterActive) && (
                        <button onClick={clearFilters} className="mt-3 px-4 py-2 border border-gray-200 rounded-lg text-sm hover:bg-gray-50">
                            Clear all filters
                        </button>
                    )}
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                        {paginatedItems.map(item => {
                            const isAvailable = item.isAvailable ?? true;
                            return (
                                <div key={item._id} className={`bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition ${!isAvailable ? 'opacity-60' : ''}`}>
                                    {item.image ? (
                                        <img src={item.image} alt={item.name} className="w-full h-36 object-cover" onError={e => e.target.style.display = 'none'} />
                                    ) : (
                                        <div className="w-full h-36 bg-amber-50 flex items-center justify-center text-4xl">🍴</div>
                                    )}
                                    <div className="p-4">
                                        <div className="flex justify-between items-start">
                                            <h3 className="font-semibold text-gray-900">{item.name}</h3>
                                            <span className="font-bold text-amber-600">₹{item.basePrice}</span>
                                        </div>
                                        <div className="flex flex-wrap gap-1 mt-2">
                                            <span className="px-2 py-0.5 bg-gray-100 rounded-full text-xs">{item.category}</span>
                                            {item.subcategory && <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full text-xs">{item.subcategory}</span>}
                                            <span className={`px-2 py-0.5 rounded-full text-xs ${isAvailable ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                                {isAvailable ? 'Available' : 'Unavailable'}
                                            </span>
                                        </div>
                                        {!!item.ingredients?.length && (
                                            <p className="mt-2 text-xs text-amber-700">
                                                Uses {item.ingredients.length} inventory ingredient{item.ingredients.length > 1 ? 's' : ''}
                                            </p>
                                        )}
                                        <p className="text-xs text-gray-400 mt-2 line-clamp-2">{item.description || 'No description'}</p>
                                        <div className="flex gap-2 mt-4">
                                            <button onClick={() => openEdit(item)} className="flex-1 px-2 py-1.5 border border-blue-300 text-blue-600 rounded-lg text-xs font-medium hover:bg-blue-50 transition">
                                                Edit
                                            </button>
                                            <button onClick={() => handleToggle(item)} className={`flex-1 px-2 py-1.5 border rounded-lg text-xs font-medium transition ${isAvailable ? 'border-red-300 text-red-600 hover:bg-red-50' : 'border-green-300 text-green-600 hover:bg-green-50'}`}>
                                                {isAvailable ? 'Deactivate' : 'Activate'}
                                            </button>
                                            <button onClick={() => setDeleteConfirm(item)} className="px-2 py-1.5 border border-red-300 text-red-600 rounded-lg text-xs font-medium hover:bg-red-50 transition">
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Pagination Controls */}
                    {totalItems > itemsPerPage && (
                        <div className="flex justify-between items-center pt-4">
                            <div className="flex items-center gap-4">
                                <span className="text-sm text-gray-500">Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, totalItems)} of {totalItems} items</span>
                                <select value={itemsPerPage} onChange={handleItemsPerPageChange} className="px-2 py-1 border border-gray-200 rounded-lg text-sm">
                                    <option value={12}>12 per page</option>
                                    <option value={24}>24 per page</option>
                                    <option value={36}>36 per page</option>
                                    <option value={48}>48 per page</option>
                                </select>
                            </div>
                            <div className="flex gap-2">
                                <button disabled={currentPage === 1} onClick={() => handlePageChange(currentPage - 1)} className="px-3 py-1 border border-gray-200 rounded-lg text-sm disabled:opacity-50 hover:bg-gray-50 transition">
                                    <ChevronLeft size={14} /> Prev
                                </button>
                                <div className="flex gap-1">
                                    {getPageNumbers().map((page, idx) => (
                                        <button key={idx} onClick={() => typeof page === 'number' && handlePageChange(page)} disabled={page === '...'} className={`px-3 py-1 rounded-lg text-sm transition ${currentPage === page ? 'bg-amber-500 text-white' : 'border border-gray-200 hover:bg-gray-50'}`}>
                                            {page}
                                        </button>
                                    ))}
                                </div>
                                <button disabled={currentPage === totalPages} onClick={() => handlePageChange(currentPage + 1)} className="px-3 py-1 border border-gray-200 rounded-lg text-sm disabled:opacity-50 hover:bg-gray-50 transition">
                                    Next <ChevronRight size={14} />
                                </button>
                            </div>
                        </div>
                    )}
                </>
            )}

            {/* Add/Edit Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm overflow-hidden" onClick={() => setShowModal(false)}>
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto overscroll-contain" onClick={e => e.stopPropagation()}>
                        <div className="flex justify-between items-center p-5 border-b border-gray-200">
                            <h2 className="text-xl font-bold text-gray-900">{editing ? `Edit: ${editing.name}` : 'Add Menu Item'}</h2>
                            <button onClick={() => setShowModal(false)} className="p-1 hover:bg-gray-100 rounded-lg">×</button>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="p-5 space-y-4">
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label style={labelStyle}>Item Name <span className="text-red-500">*</span></label>
                                        <input style={inputStyle} value={form.name} onChange={f('name')} required placeholder="e.g. Cappuccino" />
                                    </div>
                                    <div>
                                        <label style={labelStyle}>Price (₹) <span className="text-red-500">*</span></label>
                                        <input type="number" min="0" step="0.01" style={inputStyle} value={form.price} onChange={f('price')} required placeholder="0.00" />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label style={labelStyle}>Category <span className="text-red-500">*</span></label>
                                        <select style={{ ...inputStyle, cursor: 'pointer' }} value={form.category} onChange={handleFormCategoryChange} required>
                                            <option value="">Select category...</option>
                                            {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                                        </select>
                                    </div>
                                    {formSubcategories.length > 0 && (
                                        <div>
                                            <label style={labelStyle}>Subcategory</label>
                                            <select style={{ ...inputStyle, cursor: 'pointer' }} value={form.subcategory} onChange={f('subcategory')}>
                                                <option value="">Select subcategory...</option>
                                                {formSubcategories.map(s => <option key={s}>{s}</option>)}
                                            </select>
                                        </div>
                                    )}
                                </div>

                                <div>
                                    <label style={labelStyle}>Description</label>
                                    <textarea rows={3} style={{ ...inputStyle, resize: 'vertical' }} value={form.description} onChange={f('description')} placeholder="Brief description..." />
                                </div>

                                <div>
                                    <label style={labelStyle}>Recipe Notes</label>
                                    <textarea rows={2} style={{ ...inputStyle, resize: 'vertical' }} value={form.recipe} onChange={f('recipe')} placeholder="Optional kitchen preparation notes..." />
                                </div>

                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <label style={{ ...labelStyle, marginBottom: 0 }}>Inventory Ingredients</label>
                                        <button
                                            type="button"
                                            onClick={addIngredientRow}
                                            disabled={inventoryItems.length === 0}
                                            className="px-3 py-1.5 rounded-lg border border-amber-200 text-amber-700 text-xs font-semibold hover:bg-amber-50 transition"
                                        >
                                            Add Ingredient
                                        </button>
                                    </div>

                                    <div className="rounded-lg bg-blue-50 border border-blue-100 p-3 text-xs text-blue-700">
                                        This works for every food item. Burger is only an example. You can link ingredients for pizza, pasta, sandwich, coffee, dessert, or any menu item.
                                    </div>

                                    <div className="rounded-xl border border-gray-200 bg-gray-50 p-3 space-y-3">
                                        <div className="flex flex-col gap-3 md:flex-row">
                                            <input
                                                style={inputStyle}
                                                value={ingredientSearch}
                                                onChange={(e) => setIngredientSearch(e.target.value)}
                                                placeholder="Search inventory ingredients..."
                                            />
                                            <select
                                                style={{ ...inputStyle, cursor: 'pointer' }}
                                                value={ingredientCategory}
                                                onChange={(e) => setIngredientCategory(e.target.value)}
                                            >
                                                {inventoryCategoryOptions.map((category) => (
                                                    <option key={category} value={category}>
                                                        {category === 'All' ? 'All Inventory Categories' : category}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="text-xs text-gray-600">
                                            Quick add ingredients food by food. Pick a category or search the ingredient name, then tap the item to add it to this menu dish.
                                        </div>
                                        <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto pr-1">
                                            {filteredInventoryOptions.slice(0, 24).map((inventoryItem) => (
                                                <button
                                                    key={inventoryItem._id}
                                                    type="button"
                                                    onClick={() => quickAddIngredient(inventoryItem)}
                                                    className="rounded-full border border-amber-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 hover:border-amber-400 hover:bg-amber-50 transition"
                                                >
                                                    {inventoryItem.name} ({inventoryItem.unit})
                                                </button>
                                            ))}
                                            {filteredInventoryOptions.length === 0 && (
                                                <div className="text-xs text-gray-500">No inventory item matches this search.</div>
                                            )}
                                        </div>
                                    </div>

                                    {!!presetSuggestions.length && (
                                        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 space-y-3">
                                            <div className="text-xs font-semibold uppercase tracking-wide text-emerald-700">
                                                Food-Based Suggestions For {form.category}
                                            </div>
                                            <div className="text-xs text-emerald-700">
                                                These ingredients are not in inventory yet. Click one to create it and link it immediately.
                                            </div>
                                            <div className="flex flex-wrap gap-2">
                                                {presetSuggestions.map((preset) => (
                                                    <button
                                                        key={preset.name}
                                                        type="button"
                                                        onClick={() => createInventoryFromPreset(preset)}
                                                        className="rounded-full border border-emerald-200 bg-white px-3 py-1.5 text-xs font-medium text-emerald-800 hover:bg-emerald-100 transition"
                                                    >
                                                        + {preset.name} ({preset.unit})
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 space-y-3">
                                        <div className="text-xs font-semibold uppercase tracking-wide text-amber-700">
                                            Create Missing Inventory Here
                                        </div>
                                        <div className="text-xs text-amber-700">
                                            If the ingredient is not enough or not present, create it here directly without leaving menu management.
                                        </div>
                                        <div className="grid grid-cols-1 gap-2 md:grid-cols-[1.4fr_1fr_0.8fr_0.8fr_auto]">
                                            <input
                                                style={inputStyle}
                                                value={newInventoryItem.name}
                                                onChange={(e) => setNewInventoryItem((prev) => ({ ...prev, name: e.target.value }))}
                                                placeholder="Ingredient name"
                                            />
                                            <select
                                                style={{ ...inputStyle, cursor: 'pointer' }}
                                                value={newInventoryItem.category}
                                                onChange={(e) => setNewInventoryItem((prev) => ({ ...prev, category: e.target.value }))}
                                            >
                                                {['Vegetables', 'Dairy', 'Bakery', 'Meat', 'Beverages', 'Sauces', 'Dry Goods', 'Frozen', 'Packaging', 'Other'].map((category) => (
                                                    <option key={category} value={category}>{category}</option>
                                                ))}
                                            </select>
                                            <select
                                                style={{ ...inputStyle, cursor: 'pointer' }}
                                                value={newInventoryItem.unit}
                                                onChange={(e) => setNewInventoryItem((prev) => ({ ...prev, unit: e.target.value }))}
                                            >
                                                {['kg', 'g', 'L', 'ml', 'pcs', 'dozen', 'box', 'bag', 'bottle'].map((unit) => (
                                                    <option key={unit} value={unit}>{unit}</option>
                                                ))}
                                            </select>
                                            <input
                                                type="number"
                                                min="0"
                                                step="0.01"
                                                style={inputStyle}
                                                value={newInventoryItem.reorderLevel}
                                                onChange={(e) => setNewInventoryItem((prev) => ({ ...prev, reorderLevel: e.target.value }))}
                                                placeholder="Min stock"
                                            />
                                            <button
                                                type="button"
                                                onClick={handleCreateInventoryItem}
                                                disabled={creatingInventory}
                                                className="rounded-lg bg-amber-500 px-4 py-2 text-sm font-semibold text-white hover:bg-amber-600 disabled:opacity-60 transition"
                                            >
                                                {creatingInventory ? 'Adding...' : 'Create'}
                                            </button>
                                        </div>
                                    </div>

                                    {inventoryItems.length === 0 && (
                                        <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-xs text-red-700">
                                            No inventory items found. First add items in Manager Inventory like bun, cheese, sauce, milk, coffee powder, veggies, etc. Then come back here and link them to the menu item.
                                        </div>
                                    )}

                                    {(form.ingredients || []).length === 0 ? (
                                        <div className="rounded-lg border border-dashed border-gray-200 p-3 text-xs text-gray-500">
                                            No ingredients linked yet. Add bun, cheese, tikki, sauce, vegetables, or any inventory item used in this menu dish.
                                        </div>
                                    ) : (
                                        <div className="space-y-2">
                                            {(form.ingredients || []).map((ingredient, index) => (
                                                <div key={index} className="grid grid-cols-[1.7fr_0.8fr_0.8fr_auto] gap-2 items-center">
                                                    <select
                                                        style={{ ...inputStyle, cursor: 'pointer' }}
                                                        value={ingredient.inventoryItem}
                                                        onChange={(e) => updateIngredientRow(index, 'inventoryItem', e.target.value)}
                                                    >
                                                        <option value="">Select inventory item...</option>
                                                        {Object.entries(groupedInventoryOptions).map(([category, options]) => (
                                                            <optgroup key={category} label={category}>
                                                                {options.map((inventoryItem) => (
                                                                    <option key={inventoryItem._id} value={inventoryItem._id}>
                                                                        {inventoryItem.name} ({inventoryItem.unit})
                                                                    </option>
                                                                ))}
                                                            </optgroup>
                                                        ))}
                                                    </select>
                                                    <input
                                                        type="number"
                                                        min="0"
                                                        step="0.01"
                                                        style={inputStyle}
                                                        value={ingredient.quantity}
                                                        onChange={(e) => updateIngredientRow(index, 'quantity', e.target.value)}
                                                        placeholder="Qty"
                                                    />
                                                    <input
                                                        style={inputStyle}
                                                        value={ingredient.unit}
                                                        onChange={(e) => updateIngredientRow(index, 'unit', e.target.value)}
                                                        placeholder="Unit"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => removeIngredientRow(index)}
                                                        className="p-2 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 transition"
                                                    >
                                                        <Trash2 size={14} />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                <div>
                                    <label style={labelStyle}>Image URL</label>
                                    <input style={inputStyle} value={form.image} onChange={f('image')} placeholder="https://..." />
                                    {form.image && (
                                        <img src={form.image} alt="preview" className="mt-2 w-full h-32 object-cover rounded-lg" onError={e => e.target.style.display = 'none'} />
                                    )}
                                </div>

                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input type="checkbox" checked={form.isAvailable} onChange={e => setForm(p => ({ ...p, isAvailable: e.target.checked }))} />
                                    <span className="text-sm text-gray-700">Available (visible to customers)</span>
                                </label>
                            </div>
                            <div className="flex justify-end gap-3 p-5 border-t border-gray-200">
                                <button type="button" style={btnSecondary} onClick={() => setShowModal(false)}>Cancel</button>
                                <button type="submit" style={{ ...btnPrimary, opacity: saving ? 0.7 : 1 }} disabled={saving}>
                                    {saving ? 'Saving...' : editing ? 'Update Item' : 'Add Item'}
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
                            <h2 className="text-xl font-bold text-gray-900">Delete Item</h2>
                        </div>
                        <div className="p-5">
                            <p className="text-gray-700">Are you sure you want to delete <span className="font-semibold">{deleteConfirm.name}</span>?</p>
                            <p className="text-sm text-gray-500 mt-2">This action cannot be undone.</p>
                        </div>
                        <div className="flex justify-end gap-3 p-5 border-t border-gray-200">
                            <button className="px-4 py-2 border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50" onClick={() => setDeleteConfirm(null)}>Cancel</button>
                            <button className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50" onClick={handleDelete} disabled={deleting}>
                                {deleting ? 'Deleting...' : 'Yes, Delete'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
