// import { useEffect, useMemo, useState } from 'react';
// import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
// import { ImageOff, Tag, Clock3, Layers3, PlusCircle } from 'lucide-react';
// import toast from 'react-hot-toast';
// import api from '../../services/api';
// import AdminSidebar from '../../components/admin/AdminSidebar';
// import AdminPagination from '../../components/admin/AdminPagination';

// const currency = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 });
// const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&h=600&fit=crop';
// const PAGE_SIZE = 8;

// export default function MenuManagement() {
//   const queryClient = useQueryClient();
//   const [search, setSearch] = useState('');
//   const [selectedItemId, setSelectedItemId] = useState(null);
//   const [page, setPage] = useState(1);

//   const { data: items = [], isLoading } = useQuery({
//     queryKey: ['admin-menu-items'],
//     queryFn: () => api.get('/menu').then((r) => r.data),
//     refetchInterval: 30000,
//   });

//   const filteredItems = useMemo(() => items.filter((item) =>
//     item.name.toLowerCase().includes(search.toLowerCase()) ||
//     item.description?.toLowerCase().includes(search.toLowerCase()) ||
//     item.category?.name?.toLowerCase().includes(search.toLowerCase())
//   ), [items, search]);

//   useEffect(() => {
//     setPage(1);
//   }, [search]);

//   const totalPages = Math.max(1, Math.ceil(filteredItems.length / PAGE_SIZE));
//   const paginatedItems = useMemo(
//     () => filteredItems.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE),
//     [filteredItems, page]
//   );

//   useEffect(() => {
//     if (!selectedItemId && paginatedItems.length) {
//       setSelectedItemId(paginatedItems[0]._id);
//       return;
//     }

//     if (selectedItemId) {
//       const stillVisible = paginatedItems.find((item) => item._id === selectedItemId);
//       if (!stillVisible) {
//         setSelectedItemId(paginatedItems[0]?._id || null);
//       }
//     }
//   }, [paginatedItems, selectedItemId]);

//   useEffect(() => {
//     if (page > totalPages) setPage(totalPages);
//   }, [page, totalPages]);

//   const selectedItem = paginatedItems.find((item) => item._id === selectedItemId) || null;

//   const updateMutation = useMutation({
//     mutationFn: ({ id, payload }) => api.put(`/menu/${id}`, payload),
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ['admin-menu-items'] });
//       queryClient.invalidateQueries({ queryKey: ['admin-dashboard'] });
//       toast.success('Menu item updated');
//     },
//     onError: (error) => toast.error(error.response?.data?.message || 'Could not update menu item'),
//   });

//   return (
//     <div className="flex min-h-screen bg-gray-50 font-body">
//       <AdminSidebar />
//       <main className="flex-1 p-8 overflow-auto">
//         <div className="mb-8">
//           <div>
//             <h1 className="font-display text-3xl font-bold text-dark">Menu Management</h1>
//             <p className="text-gray-500 mt-1">Live menu visibility and availability controls for the customer-facing ordering flow.</p>
//           </div>
//         </div>

//         <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-6">
//           <div className="card p-5"><p className="text-sm text-gray-500">Visible Items</p><p className="text-3xl font-display font-bold text-dark mt-1">{items.length}</p></div>
//           <div className="card p-5"><p className="text-sm text-gray-500">Available</p><p className="text-3xl font-display font-bold text-dark mt-1">{items.filter((item) => item.isAvailable).length}</p></div>
//           <div className="card p-5"><p className="text-sm text-gray-500">Unavailable</p><p className="text-3xl font-display font-bold text-dark mt-1">{items.filter((item) => !item.isAvailable).length}</p></div>
//           <div className="card p-5"><p className="text-sm text-gray-500">Bestsellers Tagged</p><p className="text-3xl font-display font-bold text-dark mt-1">{items.filter((item) => item.tags?.includes('bestseller')).length}</p></div>
//         </div>

//         <div className="card p-5 mb-6">
//           <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search menu by name, description, or category" className="input-field" />
//         </div>

//         <div className="grid xl:grid-cols-[0.95fr,1.05fr] gap-6">
//           <section className="space-y-4">
//             {paginatedItems.map((item) => (
//               <button
//                 key={item._id}
//                 onClick={() => setSelectedItemId(item._id)}
//                 className={`w-full text-left rounded-2xl border p-4 transition-all ${
//                   selectedItemId === item._id ? 'border-primary bg-primary/5' : 'border-gray-100 bg-white hover:border-primary/40'
//                 }`}
//               >
//                 <div className="flex items-start gap-4">
//                   <img
//                     src={item.image || FALLBACK_IMAGE}
//                     alt={item.name}
//                     className="w-24 h-24 rounded-2xl object-cover shrink-0"
//                     onError={(e) => { e.currentTarget.src = FALLBACK_IMAGE; }}
//                   />

//                   <div className="flex-1 min-w-0">
//                     <div className="flex items-start justify-between gap-3">
//                       <div>
//                         <h2 className="font-bold text-dark text-lg leading-tight">{item.name}</h2>
//                         <p className="text-sm text-gray-500 mt-1">{item.category?.name || 'Uncategorized'}</p>
//                       </div>
//                       <span className={`badge ${item.isAvailable ? 'badge-success' : 'badge-danger'}`}>
//                         {item.isAvailable ? 'Available' : 'Unavailable'}
//                       </span>
//                     </div>

//                     <p className="text-sm text-gray-500 mt-3 line-clamp-2">
//                       {item.description || 'No description added yet.'}
//                     </p>

//                     <div className="mt-3 flex items-center justify-between text-sm">
//                       <span className="font-semibold text-primary">{currency.format(item.basePrice || 0)}</span>
//                       <span className="text-gray-400">Sold: {item.totalSold || 0}</span>
//                     </div>
//                   </div>
//                 </div>
//               </button>
//             ))}

//             {!filteredItems.length && !isLoading ? (
//               <div className="card p-10 text-center text-gray-400">
//                 No menu items matched your search.
//               </div>
//             ) : null}
//             <AdminPagination
//               page={page}
//               totalPages={totalPages}
//               totalItems={filteredItems.length}
//               pageSize={PAGE_SIZE}
//               label="menu items"
//               onPageChange={setPage}
//             />
//           </section>

//           <section className="card p-6 min-h-[620px]">
//             {selectedItem ? (
//               <>
//                 <img
//                   src={selectedItem.image || FALLBACK_IMAGE}
//                   alt={selectedItem.name}
//                   className="w-full h-72 object-cover rounded-[1.5rem] mb-6"
//                   onError={(e) => { e.currentTarget.src = FALLBACK_IMAGE; }}
//                 />

//                 <div className="flex items-start justify-between gap-4 mb-4">
//                   <div>
//                     <h2 className="font-display text-4xl font-bold text-dark">{selectedItem.name}</h2>
//                     <p className="text-gray-500 mt-2">{selectedItem.category?.name || 'Uncategorized'}</p>
//                   </div>
//                   <span className={`badge ${selectedItem.isAvailable ? 'badge-success' : 'badge-danger'}`}>
//                     {selectedItem.isAvailable ? 'Available' : 'Unavailable'}
//                   </span>
//                 </div>

//                 <p className="text-gray-600 leading-relaxed mb-6">
//                   {selectedItem.description || 'No description added yet.'}
//                 </p>

//                 <div className="grid md:grid-cols-2 gap-4 mb-6">
//                   <div className="rounded-2xl bg-gray-50 border border-gray-100 p-4">
//                     <p className="text-sm text-gray-500">Base Price</p>
//                     <p className="font-display text-3xl font-bold text-primary mt-2">{currency.format(selectedItem.basePrice || 0)}</p>
//                   </div>
//                   <div className="rounded-2xl bg-gray-50 border border-gray-100 p-4">
//                     <p className="text-sm text-gray-500">Total Sold</p>
//                     <p className="font-display text-3xl font-bold text-dark mt-2">{selectedItem.totalSold || 0}</p>
//                   </div>
//                 </div>

//                 <div className="grid md:grid-cols-2 gap-4 mb-6">
//                   <div className="rounded-2xl bg-gray-50 border border-gray-100 p-4">
//                     <div className="flex items-center gap-2 text-gray-500 mb-3">
//                       <Layers3 size={16} />
//                       <p className="text-sm font-semibold">Variants</p>
//                     </div>
//                     {selectedItem.variants?.length ? (
//                       <div className="space-y-2">
//                         {selectedItem.variants.map((variant, index) => (
//                           <div key={`${selectedItem._id}-variant-${index}`} className="flex items-center justify-between text-sm">
//                             <span className="text-dark">{variant.name}</span>
//                             <span className="text-primary font-semibold">{currency.format(variant.price || 0)}</span>
//                           </div>
//                         ))}
//                       </div>
//                     ) : (
//                       <p className="text-sm text-gray-400">No variants</p>
//                     )}
//                   </div>

//                   <div className="rounded-2xl bg-gray-50 border border-gray-100 p-4">
//                     <div className="flex items-center gap-2 text-gray-500 mb-3">
//                       <PlusCircle size={16} />
//                       <p className="text-sm font-semibold">Addons</p>
//                     </div>
//                     {selectedItem.addons?.length ? (
//                       <div className="space-y-2">
//                         {selectedItem.addons.map((addon, index) => (
//                           <div key={`${selectedItem._id}-addon-${index}`} className="flex items-center justify-between text-sm">
//                             <span className="text-dark">{addon.name}</span>
//                             <span className="text-primary font-semibold">{currency.format(addon.price || 0)}</span>
//                           </div>
//                         ))}
//                       </div>
//                     ) : (
//                       <p className="text-sm text-gray-400">No addons</p>
//                     )}
//                   </div>
//                 </div>

//                 <div className="grid md:grid-cols-2 gap-4 mb-6">
//                   <div className="rounded-2xl bg-gray-50 border border-gray-100 p-4">
//                     <div className="flex items-center gap-2 text-gray-500 mb-3">
//                       <Tag size={16} />
//                       <p className="text-sm font-semibold">Tags</p>
//                     </div>
//                     {selectedItem.tags?.length ? (
//                       <div className="flex flex-wrap gap-2">
//                         {selectedItem.tags.map((tag) => (
//                           <span key={tag} className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold">
//                             {tag}
//                           </span>
//                         ))}
//                       </div>
//                     ) : (
//                       <p className="text-sm text-gray-400">No tags</p>
//                     )}
//                   </div>

//                   <div className="rounded-2xl bg-gray-50 border border-gray-100 p-4">
//                     <div className="flex items-center gap-2 text-gray-500 mb-3">
//                       <Clock3 size={16} />
//                       <p className="text-sm font-semibold">Availability Window</p>
//                     </div>
//                     <p className="text-sm text-dark">
//                       {selectedItem.availableFrom && selectedItem.availableTo
//                         ? `${selectedItem.availableFrom} - ${selectedItem.availableTo}`
//                         : 'Available all day'}
//                     </p>
//                   </div>
//                 </div>

//                 <div className="rounded-2xl bg-gray-50 border border-gray-100 p-4 mb-6">
//                   <div className="flex items-center gap-2 text-gray-500 mb-3">
//                     <ImageOff size={16} />
//                     <p className="text-sm font-semibold">Allergens</p>
//                   </div>
//                   {selectedItem.allergens?.length ? (
//                     <div className="flex flex-wrap gap-2">
//                       {selectedItem.allergens.map((allergen) => (
//                         <span key={allergen} className="px-3 py-1 rounded-full bg-amber-100 text-amber-700 text-xs font-semibold">
//                           {allergen}
//                         </span>
//                       ))}
//                     </div>
//                   ) : (
//                     <p className="text-sm text-gray-400">No allergens listed</p>
//                   )}
//                 </div>

//                 <div className="flex gap-3">
//                   <button
//                     onClick={() => updateMutation.mutate({ id: selectedItem._id, payload: { isAvailable: !selectedItem.isAvailable } })}
//                     className={`flex-1 rounded-xl py-3 text-sm font-semibold transition-colors ${
//                       selectedItem.isAvailable
//                         ? 'bg-amber-100 text-amber-700 hover:bg-amber-200'
//                         : 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
//                     }`}
//                   >
//                     {selectedItem.isAvailable ? 'Mark Unavailable' : 'Mark Available'}
//                   </button>

//                   <button
//                     onClick={() => updateMutation.mutate({ id: selectedItem._id, payload: { isArchived: true } })}
//                     className="flex-1 rounded-xl py-3 text-sm font-semibold bg-red-100 text-red-700 hover:bg-red-200 transition-colors"
//                   >
//                     Archive
//                   </button>
//                 </div>
//               </>
//             ) : (
//               <div className="h-full flex items-center justify-center text-gray-400">
//                 Select a menu item to view details
//               </div>
//             )}
//           </section>
//         </div>
//       </main>
//     </div>
//   );
// }

import { useEffect, useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Search, Tag, Clock3, Layers3, PlusCircle, ImageOff } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../services/api';
import AdminSidebar from '../../components/admin/AdminSidebar';
import AdminPagination from '../../components/admin/AdminPagination';

const currency = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 });
const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&h=600&fit=crop';
const PAGE_SIZE = 8;

export default function MenuManagement() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [page, setPage] = useState(1);

  const { data: items = [], isLoading } = useQuery({
    queryKey: ['admin-menu-items'],
    queryFn: () => api.get('/manager/menu').then((r) => r.data),
    refetchInterval: 30000,
  });

  const filteredItems = useMemo(() => items.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase()) ||
    item.description?.toLowerCase().includes(search.toLowerCase()) ||
    item.category?.name?.toLowerCase().includes(search.toLowerCase())
  ), [items, search]);

  useEffect(() => setPage(1), [search]);

  const totalPages = Math.max(1, Math.ceil(filteredItems.length / PAGE_SIZE));
  const paginatedItems = useMemo(() => filteredItems.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE), [filteredItems, page]);

  useEffect(() => {
    if (!selectedItemId && paginatedItems.length) setSelectedItemId(paginatedItems[0]._id);
    if (selectedItemId && !paginatedItems.find(i => i._id === selectedItemId)) setSelectedItemId(paginatedItems[0]?._id || null);
  }, [paginatedItems, selectedItemId]);

  useEffect(() => { if (page > totalPages) setPage(totalPages); }, [page, totalPages]);

  const selectedItem = paginatedItems.find((item) => item._id === selectedItemId) || null;

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }) => api.put(`/manager/menu/${id}`, payload),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['admin-menu-items'] }); queryClient.invalidateQueries({ queryKey: ['admin-dashboard'] }); toast.success('Menu item updated'); },
    onError: (error) => toast.error(error.response?.data?.message || 'Could not update menu item'),
  });

  return (
    <div className="flex min-h-screen bg-[#faf8f5]">
      <AdminSidebar />
      <main className="flex-1 p-6 lg:p-8 overflow-auto">
        <div className="mb-6">
          <h1 className="font-display text-3xl font-bold text-[#3f3328]">Menu Management</h1>
          <p className="text-sm text-[#6b5f54] mt-1">Manage menu items, availability, and visibility</p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white border border-[#e8e0d6] rounded-xl p-4"><p className="text-sm text-[#6b5f54]">Total Items</p><p className="text-2xl font-bold text-[#3f3328] mt-1">{items.length}</p></div>
          <div className="bg-white border border-[#e8e0d6] rounded-xl p-4"><p className="text-sm text-[#6b5f54]">Available</p><p className="text-2xl font-bold text-[#3f3328] mt-1">{items.filter(i => i.isAvailable).length}</p></div>
          <div className="bg-white border border-[#e8e0d6] rounded-xl p-4"><p className="text-sm text-[#6b5f54]">Unavailable</p><p className="text-2xl font-bold text-[#3f3328] mt-1">{items.filter(i => !i.isAvailable).length}</p></div>
          <div className="bg-white border border-[#e8e0d6] rounded-xl p-4"><p className="text-sm text-[#6b5f54]">Bestsellers</p><p className="text-2xl font-bold text-[#3f3328] mt-1">{items.filter(i => i.tags?.includes('bestseller')).length}</p></div>
        </div>

        <div className="bg-white border border-[#e8e0d6] rounded-xl p-4 mb-6">
          <div className="relative"><Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#a0968c]" /><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search menu by name, description, or category" className="w-full rounded-lg border border-[#e8e0d6] py-2 pl-9 pr-3 text-sm focus:border-[#b97844] focus:outline-none" /></div>
        </div>

        <div className="grid xl:grid-cols-[0.95fr,1.05fr] gap-6">
          <div className="space-y-3">
            {paginatedItems.map((item) => (
              <button key={item._id} onClick={() => setSelectedItemId(item._id)} className={`w-full text-left rounded-xl border p-4 transition-all ${selectedItemId === item._id ? 'border-[#b97844] bg-[#faf8f5]' : 'border-[#e8e0d6] bg-white hover:border-[#b97844]/50'}`}>
                <div className="flex gap-4">
                  <img src={item.image || FALLBACK_IMAGE} alt={item.name} className="w-20 h-20 rounded-lg object-cover shrink-0" onError={(e) => e.currentTarget.src = FALLBACK_IMAGE} />
                  <div className="flex-1">
                    <div className="flex items-start justify-between"><div><h3 className="font-semibold text-[#3f3328]">{item.name}</h3><p className="text-xs text-[#6b5f54] mt-0.5">{item.category?.name || 'Uncategorized'}</p></div><span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${item.isAvailable ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>{item.isAvailable ? 'Available' : 'Unavailable'}</span></div>
                    <p className="text-sm text-[#6b5f54] mt-2 line-clamp-1">{item.description || 'No description'}</p>
                    <div className="mt-2 flex items-center justify-between"><span className="font-semibold text-[#b97844]">{currency.format(item.basePrice || 0)}</span><span className="text-xs text-[#a0968c]">Sold: {item.totalSold || 0}</span></div>
                  </div>
                </div>
              </button>
            ))}
            {!filteredItems.length && !isLoading && <div className="bg-white border border-[#e8e0d6] rounded-xl p-10 text-center text-[#a0968c]">No menu items found.</div>}
            <AdminPagination page={page} totalPages={totalPages} totalItems={filteredItems.length} pageSize={PAGE_SIZE} label="menu items" onPageChange={setPage} />
          </div>

          <div className="bg-white border border-[#e8e0d6] rounded-xl p-6">
            {selectedItem ? (
              <>
                <img src={selectedItem.image || FALLBACK_IMAGE} alt={selectedItem.name} className="w-full h-56 object-cover rounded-xl mb-5" onError={(e) => e.currentTarget.src = FALLBACK_IMAGE} />
                <div className="flex items-start justify-between mb-4"><div><h2 className="font-display text-2xl font-bold text-[#3f3328]">{selectedItem.name}</h2><p className="text-sm text-[#6b5f54] mt-1">{selectedItem.category?.name || 'Uncategorized'}</p></div><span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${selectedItem.isAvailable ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>{selectedItem.isAvailable ? 'Available' : 'Unavailable'}</span></div>
                <p className="text-[#6b5f54] leading-relaxed mb-5">{selectedItem.description || 'No description added yet.'}</p>
                <div className="grid grid-cols-2 gap-4 mb-5"><div className="bg-[#faf8f5] rounded-xl p-4"><p className="text-sm text-[#6b5f54]">Base Price</p><p className="text-2xl font-bold text-[#b97844]">{currency.format(selectedItem.basePrice || 0)}</p></div><div className="bg-[#faf8f5] rounded-xl p-4"><p className="text-sm text-[#6b5f54]">Total Sold</p><p className="text-2xl font-bold text-[#3f3328]">{selectedItem.totalSold || 0}</p></div></div>
                <div className="grid grid-cols-2 gap-4 mb-5"><div className="bg-[#faf8f5] rounded-xl p-4"><div className="flex items-center gap-2 text-[#6b5f54] mb-2"><Layers3 size={14} /><span className="text-sm font-medium">Variants</span></div>{selectedItem.variants?.length ? selectedItem.variants.map((v, i) => <div key={i} className="flex justify-between text-sm"><span>{v.name}</span><span className="text-[#b97844]">{currency.format(v.price)}</span></div>) : <p className="text-sm text-[#a0968c]">No variants</p>}</div>
                <div className="bg-[#faf8f5] rounded-xl p-4"><div className="flex items-center gap-2 text-[#6b5f54] mb-2"><PlusCircle size={14} /><span className="text-sm font-medium">Addons</span></div>{selectedItem.addons?.length ? selectedItem.addons.map((a, i) => <div key={i} className="flex justify-between text-sm"><span>{a.name}</span><span className="text-[#b97844]">{currency.format(a.price)}</span></div>) : <p className="text-sm text-[#a0968c]">No addons</p>}</div></div>
                <div className="grid grid-cols-2 gap-4 mb-5"><div className="bg-[#faf8f5] rounded-xl p-4"><div className="flex items-center gap-2 text-[#6b5f54] mb-2"><Tag size={14} /><span className="text-sm font-medium">Tags</span></div><div className="flex flex-wrap gap-1">{selectedItem.tags?.length ? selectedItem.tags.map(t => <span key={t} className="px-2 py-0.5 rounded-full bg-[#b97844]/10 text-[#b97844] text-xs">{t}</span>) : <span className="text-sm text-[#a0968c]">No tags</span>}</div></div>
                <div className="bg-[#faf8f5] rounded-xl p-4"><div className="flex items-center gap-2 text-[#6b5f54] mb-2"><Clock3 size={14} /><span className="text-sm font-medium">Availability</span></div><p className="text-sm">{selectedItem.availableFrom && selectedItem.availableTo ? `${selectedItem.availableFrom} - ${selectedItem.availableTo}` : 'Available all day'}</p></div></div>
                <div className="bg-[#faf8f5] rounded-xl p-4 mb-5"><div className="flex items-center gap-2 text-[#6b5f54] mb-2"><ImageOff size={14} /><span className="text-sm font-medium">Allergens</span></div><div className="flex flex-wrap gap-1">{selectedItem.allergens?.length ? selectedItem.allergens.map(a => <span key={a} className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 text-xs">{a}</span>) : <span className="text-sm text-[#a0968c]">No allergens</span>}</div></div>
                <div className="flex gap-3"><button onClick={() => updateMutation.mutate({ id: selectedItem._id, payload: { isAvailable: !selectedItem.isAvailable } })} className={`flex-1 rounded-xl py-2.5 text-sm font-medium transition-all ${selectedItem.isAvailable ? 'bg-amber-100 text-amber-700 hover:bg-amber-200' : 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'}`}>{selectedItem.isAvailable ? 'Mark Unavailable' : 'Mark Available'}</button><button onClick={() => updateMutation.mutate({ id: selectedItem._id, payload: { isArchived: true } })} className="flex-1 rounded-xl py-2.5 text-sm font-medium bg-red-100 text-red-700 hover:bg-red-200 transition-all">Archive</button></div>
              </>
            ) : <div className="h-full flex items-center justify-center text-[#a0968c]">Select a menu item to view details</div>}
          </div>
        </div>
      </main>
    </div>
  );
}
