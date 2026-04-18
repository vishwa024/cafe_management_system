// import { useMemo, useState, useEffect } from 'react';
// import { useQuery } from '@tanstack/react-query';
// import { ShoppingBag, Star, Search, X, Pizza, Coffee, UtensilsCrossed, IceCream, Sandwich, ChefHat, Heart, ChevronLeft, ChevronRight } from 'lucide-react';
// import { useDispatch, useSelector } from 'react-redux';
// import { Link, useSearchParams, useLocation, useNavigate } from 'react-router-dom';
// import toast from 'react-hot-toast';
// import api from '../../services/api';
// import { addItem, selectCartCount, setOrderType } from '../../store/slices/cartSlice';
// import CartDrawer from '../../components/customer/CartDrawer';
// import OrderTypeSelector from '../../components/customer/OrderTypeSelector';
// import { getOrderPreferences, saveOrderPreferences } from '../../utils/orderPreferences';
// import { clearOrderPreferences } from '../../utils/orderPreferences';
// import CustomerFooter from '../../components/customer/CustomerFooter';

// const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&h=300&fit=crop';
// const ITEMS_PER_PAGE = 12;

// // Category Icons and Colors
// const CATEGORY_STYLES = {
//   'Pasta & Noodles': { icon: UtensilsCrossed, color: 'bg-orange-50', borderColor: 'border-orange-200', textColor: 'text-orange-600', iconBg: 'bg-orange-100' },
//   'Desserts': { icon: IceCream, color: 'bg-pink-50', borderColor: 'border-pink-200', textColor: 'text-pink-600', iconBg: 'bg-pink-100' },
//   'Beverages': { icon: Coffee, color: 'bg-emerald-50', borderColor: 'border-emerald-200', textColor: 'text-emerald-600', iconBg: 'bg-emerald-100' },
//   'Pizza': { icon: Pizza, color: 'bg-red-50', borderColor: 'border-red-200', textColor: 'text-red-600', iconBg: 'bg-red-100' },
//   'Burger': { icon: Sandwich, color: 'bg-purple-50', borderColor: 'border-purple-200', textColor: 'text-purple-600', iconBg: 'bg-purple-100' },
//   'default': { icon: ChefHat, color: 'bg-amber-50', borderColor: 'border-amber-200', textColor: 'text-amber-600', iconBg: 'bg-amber-100' }
// };

// function Pagination({ currentPage, totalPages, onPageChange }) {
//   if (totalPages <= 1) return null;

//   const getPageNumbers = () => {
//     const pages = [];
//     for (let i = 1; i <= totalPages; i++) {
//       if (i === 1 || i === totalPages || (i >= currentPage - 1 && i <= currentPage + 1)) {
//         pages.push(i);
//       } else if (i === currentPage - 2 || i === currentPage + 2) {
//         pages.push('...');
//       }
//     }
//     return [...new Set(pages)];
//   };

//   return (
//     <div className="flex justify-center items-center gap-2 mt-8 pt-4 border-t border-[#e8e0d6]">
//       <button
//         onClick={() => onPageChange(currentPage - 1)}
//         disabled={currentPage === 1}
//         className="w-9 h-9 rounded-full border border-[#e8e0d6] text-[#6b5f54] flex items-center justify-center hover:border-[#b97844] hover:text-[#b97844] disabled:opacity-40 disabled:cursor-not-allowed transition-all"
//       >
//         <ChevronLeft size={16} />
//       </button>
      
//       <div className="flex gap-2">
//         {getPageNumbers().map((page, idx) => (
//           page === '...' ? (
//             <span key={`dots-${idx}`} className="text-[#a0968c] px-1">...</span>
//           ) : (
//             <button
//               key={page}
//               onClick={() => onPageChange(page)}
//               className={`w-9 h-9 rounded-full text-sm font-medium transition-all ${
//                 currentPage === page
//                   ? 'bg-[#b97844] text-white'
//                   : 'border border-[#e8e0d6] text-[#6b5f54] hover:border-[#b97844] hover:text-[#b97844]'
//               }`}
//             >
//               {page}
//             </button>
//           )
//         ))}
//       </div>

//       <button
//         onClick={() => onPageChange(currentPage + 1)}
//         disabled={currentPage === totalPages}
//         className="w-9 h-9 rounded-full border border-[#e8e0d6] text-[#6b5f54] flex items-center justify-center hover:border-[#b97844] hover:text-[#b97844] disabled:opacity-40 disabled:cursor-not-allowed transition-all"
//       >
//         <ChevronRight size={16} />
//       </button>
//     </div>
//   );
// }

// export default function MenuPage() {
//   const navigate = useNavigate();
//   const dispatch = useDispatch();
//   const cartCount = useSelector(selectCartCount);
//   const user = useSelector((state) => state.auth.user);
//   const { isAuthenticated } = useSelector((state) => state.auth);
//   const [searchParams, setSearchParams] = useSearchParams();
//   const location = useLocation();
//   const [cartOpen, setCartOpen] = useState(false);
//   const [searchQuery, setSearchQuery] = useState('');
//   const [selectedCategory, setSelectedCategory] = useState('All');
//   const [currentPage, setCurrentPage] = useState(1);
//   const favouriteStorageKey = useMemo(
//     () => `customer-favourites:${user?._id || user?.email || 'guest'}`,
//     [user?._id, user?.email]
//   );
  

//   const [favourites, setFavourites] = useState(() => {
//     try {
//       const saved = JSON.parse(localStorage.getItem(favouriteStorageKey) || '[]');
//       return new Set(saved);
//     } catch {
//       return new Set();
//     }
//   });

//   // Get URL parameters
//   const mode = searchParams.get('mode');
//   const forceSelector = searchParams.get('showSelector') === '1';
//   const preselectedMethod = searchParams.get('method');
//   const preselectPreOrder = searchParams.get('preselect') === 'pre-order';
//   const browseOnly = searchParams.get('browseOnly') === '1';
//   const isDineInMode = mode === 'dine-in' || location.state?.isDineIn;
  
//   // Check if we need to show order type selector
//   const savedPrefs = getOrderPreferences();

//   const shouldShowSelector = useMemo(() => {
//     if (browseOnly) {
//       return false;
//     }
//     if (forceSelector) {
//       return true;
//     }
//     // If mode is passed in URL (for delivery/takeaway), don't show selector
//     if (mode && ['delivery', 'takeaway'].includes(mode)) {
//       return false;
//     }
//     // If preselectPreOrder is true, show selector for pre-order
//     if (preselectPreOrder) {
//       return true;
//     }
//     // If saved preferences exist, don't show selector
//     if (savedPrefs && savedPrefs.deliveryMethod) {
//       return false;
//     }
//     // Otherwise show selector
//     return true;
//   }, [browseOnly, forceSelector, mode, savedPrefs, preselectPreOrder]);

//   const stepBackInSelector = () => {
//     if (preselectedMethod) {
//       navigate(-1);
//       return;
//     }
//     navigate(-1);
//   };

//   useEffect(() => {
//     if (mode && typeof mode === 'string' && ['delivery', 'takeaway', 'dine-in', 'pre-order'].includes(mode)) {
//       dispatch(setOrderType(mode));
//     }
//   }, [mode, dispatch]);

//   // Load favourites from localStorage
//   useEffect(() => {
//     try {
//       const saved = JSON.parse(localStorage.getItem(favouriteStorageKey) || '[]');
//       setFavourites(new Set(saved));
//     } catch {
//       setFavourites(new Set());
//     }
//   }, [favouriteStorageKey]);

//   // Save favourites to localStorage
//   useEffect(() => {
//     localStorage.setItem(favouriteStorageKey, JSON.stringify(Array.from(favourites)));
//   }, [favouriteStorageKey, favourites]);

//   // Reset page when category or search changes
//   useEffect(() => {
//     setCurrentPage(1);
//   }, [selectedCategory, searchQuery]);

//   // Fetch menu items with error handling
//   const { data: menuItems = [], isLoading, error, refetch } = useQuery({
//     queryKey: ['menu'],
//     queryFn: async () => {
//       try {
//         console.log('Fetching menu items...');
//         const response = await api.get('/menu');
//         console.log('Menu items fetched:', response.data);
        
//         if (Array.isArray(response.data)) {
//           return response.data;
//         } else if (response.data && Array.isArray(response.data.data)) {
//           return response.data.data;
//         } else if (response.data && response.data.items && Array.isArray(response.data.items)) {
//           return response.data.items;
//         } else {
//           console.error('Unexpected API response format:', response.data);
//           return [];
//         }
//       } catch (err) {
//         console.error('Error fetching menu:', err);
//         toast.error('Failed to load menu. Please refresh the page.');
//         return [];
//       }
//     },
//     retry: 1,
//     retryDelay: 1000,
//   });

//   // Get all unique categories from menu items
//   const categories = useMemo(() => {
//     if (!menuItems || menuItems.length === 0) return ['All'];
    
//     const cats = menuItems
//       .filter(item => !item.isArchived)
//       .map(item => {
//         const category = typeof item.category === 'string' ? item.category.trim() : item.category?.name?.trim();
//         if (category === 'Pasta') return 'Pasta & Noodles';
//         if (category === 'Noodles') return 'Pasta & Noodles';
//         if (category === 'Dessert') return 'Desserts';
//         return category;
//       })
//       .filter(Boolean);
    
//     const uniqueCats = [...new Set(cats)];
//     const priorityOrder = ['Pasta & Noodles', 'Desserts', 'Beverages'];
//     return ['All', ...priorityOrder.filter(cat => uniqueCats.includes(cat)), ...uniqueCats.filter(cat => !priorityOrder.includes(cat))];
//   }, [menuItems]);

//   // Filter items
//   const filteredItems = useMemo(() => {
//     if (!menuItems || menuItems.length === 0) return [];
    
//     let items = menuItems.filter(item => !item.isArchived);
    
//     // Normalize category names
//     items = items.map(item => ({
//       ...item,
//       normalizedCategory: (() => {
//         const cat = typeof item.category === 'string' ? item.category.trim() : item.category?.name?.trim();
//         if (cat === 'Pasta' || cat === 'Noodles') return 'Pasta & Noodles';
//         if (cat === 'Dessert') return 'Desserts';
//         return cat || 'Uncategorized';
//       })()
//     }));
    
//     if (selectedCategory !== 'All') {
//       items = items.filter(item => item.normalizedCategory === selectedCategory);
//     }
    
//     if (searchQuery.trim()) {
//       const query = searchQuery.toLowerCase();
//       items = items.filter(item => 
//         item.name?.toLowerCase().includes(query) ||
//         item.description?.toLowerCase().includes(query) || 
//         item.normalizedCategory?.toLowerCase().includes(query)
//       );
//     }
    
//     return items;
//   }, [menuItems, selectedCategory, searchQuery]);

//   // Pagination
//   const totalPages = Math.ceil(filteredItems.length / ITEMS_PER_PAGE);
//   const paginatedItems = filteredItems.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

//   const handleAddToCart = (item, e) => {
//     e.preventDefault();
//     e.stopPropagation();
    
//     if (!isAuthenticated) {
//       toast.error('Please login to add items to cart');
//       navigate('/login', { state: { from: '/menu' } });
//       return;
//     }
    
//     if (!item.isAvailable) {
//       toast.error(`${item.name} is currently unavailable`);
//       return;
//     }
//     dispatch(addItem({
//       menuItemId: item._id,
//       name: item.name,
//       basePrice: item.basePrice,
//       image: item.image,
//     }));
//     toast.success(`${item.name} added to cart`);
//   };

//   const toggleFavourite = (itemId, itemName, e) => {
//     if (e) {
//       e.preventDefault();
//       e.stopPropagation();
//     }

//     const next = new Set(favourites);

//     if (next.has(itemId)) {
//       next.delete(itemId);
//       toast.success(`${itemName} removed from favourites`);
//     } else {
//       next.add(itemId);
//       toast.success(`${itemName} added to favourites`);
//     }

//     setFavourites(next);
//   };

//   const getCategoryStyle = (categoryName) => {
//     return CATEGORY_STYLES[categoryName] || CATEGORY_STYLES.default;
//   };

//   const favouriteCount = favourites.size;

//   const handlePageChange = (page) => {
//     setCurrentPage(page);
//     window.scrollTo({ top: 0, behavior: 'smooth' });
//   };

//   const formatPrice = (price) => {
//     const amount = Number(price || 0);
//     return new Intl.NumberFormat('en-IN', {
//       style: 'currency',
//       currency: 'INR',
//       minimumFractionDigits: 0,
//       maximumFractionDigits: 0,
//     }).format(amount);
//   };

//   const hasAvailabilityNote = (item) => {
//     const note = String(item?.description || '').toLowerCase();
//     const availabilityKeywords = [
//       'contact',
//       'customer service',
//       'by order',
//       'in stock',
//       'ready-to-eat',
//     ];

//     return availabilityKeywords.some((keyword) => note.includes(keyword));
//   };

//   const getOptimizedImageUrl = (imageUrl) => {
//     if (!imageUrl) return FALLBACK_IMAGE;
//     if (imageUrl.includes('unsplash.com')) {
//       return `${imageUrl.split('?')[0]}?w=400&h=300&fit=crop`;
//     }
//     if (imageUrl.includes('cloudinary.com')) {
//       return imageUrl.replace('/upload/', '/upload/w_400,h_300,c_fill/');
//     }
//     return imageUrl;
//   };

//   // Show Order Type Selector if needed
//   if (shouldShowSelector) {
//     return (
//       <div className="min-h-screen bg-white">
//         <header className="border-b border-[#e8e0d6] bg-white sticky top-0 z-50">
//           <div className="max-w-7xl mx-auto px-6 py-4">
//             <div className="flex items-center justify-between">
//               <div className="flex items-center gap-4">
//                 <button 
//                   onClick={stepBackInSelector}
//                   className="flex items-center gap-1 text-sm text-[#6b5f54] hover:text-[#b97844] transition-colors"
//                 >
//                   Back
//                 </button>
//                 <Link to="/" className="flex items-center gap-2">
//                   <img 
//                     src="https://rollercoastercafe.com/assets/images/roller_logo.png" 
//                     alt="Logo"
//                     className="h-10 w-10 rounded-full object-cover"
//                   />
//                   <span className="font-display font-bold text-xl text-[#3f3328]">Roller Coaster Cafe</span>
//                 </Link>
//               </div>
//               <Link to="/cart" className="text-sm text-[#b97844] hover:underline">
//                 View Cart
//               </Link>
//             </div>
//           </div>
//         </header>

//         <main className="max-w-2xl mx-auto px-4 py-12">
//           <OrderTypeSelector 
//             initialData={
//               preselectedMethod && ['delivery', 'takeaway', 'pre-order'].includes(preselectedMethod)
//                 ? { deliveryMethod: preselectedMethod }
//                 : null
//             }
//             onBack={stepBackInSelector}
//             onComplete={(preferences) => {
//               if (preferences?.browseOnly) {
//                 clearOrderPreferences();
//                 navigate('/menu?browseOnly=1', { replace: true });
//                 return;
//               }

//               const newPrefs = {
//                 deliveryMethod: preferences.deliveryMethod,
//                 preOrderMethod: preferences.preOrderMethod || null,
//                 scheduledDateTime: preferences.scheduledDateTime,
//                 isDineIn: preferences.isDineIn,
//                 isPreOrder: preferences.isPreOrder,
//                 tableNumber: preferences.tableNumber,
//                 guestCount: preferences.guestCount,
//                 timestamp: new Date().toISOString()
//               };
//               saveOrderPreferences(newPrefs);
//               navigate('/menu', { replace: true });
//             }}
//           />
//         </main>
//       </div>
//     );
//   }

//   // Show error state
//   if (error) {
//     return (
//       <div className="min-h-screen bg-white">
//         <div className="max-w-7xl mx-auto px-6 py-16 text-center">
//           <div className="bg-red-50 rounded-2xl p-8 max-w-md mx-auto">
//             <h2 className="text-xl font-bold text-red-600 mb-2">Failed to Load Menu</h2>
//             <p className="text-gray-600 mb-4">There was an error loading the menu items.</p>
//             <button 
//               onClick={() => refetch()}
//               className="bg-[#b97844] text-white px-6 py-2 rounded-full hover:bg-[#9e6538] transition-colors"
//             >
//               Try Again
//             </button>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-white font-body">
//       {/* Header */}
//       <header className="border-b border-[#e8e0d6] bg-white sticky top-0 z-50">
//         <div className="max-w-7xl mx-auto px-6 py-4">
//           <div className="flex items-center justify-between">
//             <div className="flex items-center gap-4">
//               <button 
//                 onClick={() => {
//                   navigate(-1);
//                 }}
//                 className="flex items-center gap-1 text-sm text-[#6b5f54] hover:text-[#b97844] transition-colors"
//               >
//                 Back
//               </button>
//               <Link to="/" className="flex items-center gap-2">
//                 <img 
//                   src="https://rollercoastercafe.com/assets/images/roller_logo.png" 
//                   alt="Roller Coaster Cafe"
//                   className="h-10 w-10 rounded-full object-cover"
//                 />
//                 <span className="font-display font-bold text-xl text-[#3f3328]">Roller Coaster Cafe</span>
//               </Link>
//             </div>

//             <nav className="hidden md:flex items-center gap-8">
//               <Link to="/" className="text-sm font-medium text-[#6b5f54] hover:text-[#b97844] transition-colors">Home</Link>
//               <Link to="/menu" className="text-sm font-medium text-[#b97844] transition-colors">Menu</Link>
//               <Link to="/orders" className="text-sm font-medium text-[#6b5f54] hover:text-[#b97844] transition-colors">Orders</Link>
//               <Link to="/profile" className="text-sm font-medium text-[#6b5f54] hover:text-[#b97844] transition-colors">Profile</Link>
//               <Link to="/settings" className="text-sm font-medium text-[#6b5f54] hover:text-[#b97844] transition-colors">Settings</Link>
//             </nav>

//             <div className="flex items-center gap-3">
//               <Link 
//                 to="/favourites" 
//                 className="relative inline-flex items-center gap-1.5 rounded-full px-3 py-2 text-sm font-medium text-[#6b5f54] hover:text-[#b97844] transition-all"
//               >
//                 <Heart size={16} className={favouriteCount > 0 ? 'fill-[#b97844] text-[#b97844]' : ''} />
//                 <span className="hidden sm:inline">Favourites</span>
//                 {favouriteCount > 0 && (
//                   <span className="absolute -top-1 -right-1 min-w-4 h-4 px-1 rounded-full bg-[#b97844] text-white text-[10px] flex items-center justify-center">
//                     {favouriteCount}
//                   </span>
//                 )}
//               </Link>

//               <button
//                 onClick={() => setCartOpen(true)}
//                 className="relative inline-flex items-center gap-2 rounded-full bg-[#b97844] px-4 py-2 text-sm font-semibold text-white hover:bg-[#9e6538] transition-all"
//               >
//                 <ShoppingBag size={16} />
//                 <span>Cart</span>
//                 {cartCount > 0 && (
//                   <span className="absolute -top-2 -right-2 min-w-5 h-5 px-1 rounded-full bg-[#3f3328] text-white text-xs flex items-center justify-center">
//                     {cartCount}
//                   </span>
//                 )}
//               </button>
//             </div>
//           </div>
//         </div>
//       </header>

//       <main>
//         {/* Dine-In Banner */}
//         {isDineInMode && (
//           <div className="bg-amber-50 border-b border-amber-200">
//             <div className="max-w-7xl mx-auto px-6 py-3">
//               <div className="flex items-center justify-between flex-wrap gap-2">
//                 <div className="flex items-center gap-2">
//                   <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center">
//                     <UtensilsCrossed size={16} className="text-amber-600" />
//                   </div>
//                   <div>
//                     <p className="text-sm font-medium text-amber-800">Dine-In Mode Active</p>
//                     <p className="text-xs text-amber-600">Your table is reserved. Your order will be served at your table.</p>
//                   </div>
//                 </div>
//                 <Link 
//                   to="/dine-in" 
//                   className="text-xs text-amber-700 hover:underline flex items-center gap-1"
//                 >
//                   View Table Info
//                 </Link>
//               </div>
//             </div>
//           </div>
//         )}

//         <div className="max-w-7xl mx-auto px-6 pt-6 pb-2">
//           <h1 className="font-display text-2xl font-bold text-[#3f3328]">Our Menu</h1>
//           {menuItems.length === 0 && !isLoading && (
//             <p className="text-[#6b5f54] text-sm mt-1">No menu items available</p>
//           )}
//         </div>

//         {menuItems.length > 0 && (
//           <>
//             <div className="max-w-7xl mx-auto px-6 py-3">
//               <div className="relative max-w-md">
//                 <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#a0968c]" />
//                 <input
//                   type="text"
//                   value={searchQuery}
//                   onChange={(e) => setSearchQuery(e.target.value)}
//                   placeholder="Search for your favorite dish..."
//                   className="w-full rounded-full border border-[#e8e0d6] bg-white py-2 pl-10 pr-4 text-sm text-[#3f3328] placeholder:text-[#a0968c] focus:border-[#b97844] focus:outline-none focus:ring-1 focus:ring-[#b97844] transition-all"
//                 />
//                 {searchQuery && (
//                   <button onClick={() => setSearchQuery('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#a0968c] hover:text-[#b97844]">
//                     <X size={14} />
//                   </button>
//                 )}
//               </div>
//             </div>

//             <div className="max-w-7xl mx-auto px-6 pb-4 overflow-x-auto">
//               <div className="flex gap-3">
//                 {categories.map((category) => {
//                   const isActive = selectedCategory === category;
//                   const style = getCategoryStyle(category);
//                   const Icon = style.icon;
//                   return (
//                     <button
//                       key={category}
//                       onClick={() => setSelectedCategory(category)}
//                       className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap ${
//                         isActive 
//                           ? `${style.color} ${style.textColor} shadow-sm border ${style.borderColor}` 
//                           : 'bg-white border border-[#e8e0d6] text-[#6b5f54] hover:border-[#b97844] hover:text-[#b97844]'
//                       }`}
//                     >
//                       {category !== 'All' && <Icon size={14} />}
//                       {category}
//                     </button>
//                   );
//                 })}
//               </div>
//             </div>
//           </>
//         )}

//         <div className="max-w-7xl mx-auto px-6 pb-16">
//           {isLoading ? (
//             <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
//               {[1,2,3,4,5,6].map(i => (
//                 <div key={i} className="rounded-2xl bg-[#faf8f5] animate-pulse h-72" />
//               ))}
//             </div>
//           ) : filteredItems.length === 0 ? (
//             <div className="text-center py-16">
//               <ChefHat size={48} className="mx-auto text-[#a0968c] mb-4" />
//               <h2 className="font-display text-2xl text-[#3f3328] mb-2">No items found</h2>
//               <p className="text-[#6b5f54]">Try a different category or search term</p>
//               {menuItems.length === 0 && (
//                 <button 
//                   onClick={() => refetch()}
//                   className="mt-4 text-[#b97844] hover:underline"
//                 >
//                   Refresh Menu
//                 </button>
//               )}
//             </div>
//           ) : (
//             <>
//               <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
//                 {paginatedItems.map((item) => {
//                   const isFavourite = favourites.has(item._id);
//                   const hasNote = hasAvailabilityNote(item);
//                   const isAvailable = item.isAvailable !== false;
//                   const categoryStyle = getCategoryStyle(item.normalizedCategory);
//                   const CategoryIcon = categoryStyle.icon;
//                   const optimizedImage = getOptimizedImageUrl(item.image);
                  
//                   return (
//                     <div key={item._id} className="group relative rounded-xl bg-white border border-[#e8e0d6] overflow-hidden hover:shadow-md transition-all hover:-translate-y-0.5 flex flex-col h-full">
//                       <Link to={`/menu/item/${item._id}`} className="block flex-shrink-0">
//                         <div className="relative w-full h-48 overflow-hidden bg-[#faf8f5]">
//                           <img
//                             src={optimizedImage}
//                             alt={item.name}
//                             className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
//                             onError={(e) => { 
//                               e.target.src = FALLBACK_IMAGE;
//                               e.target.onerror = null;
//                             }}
//                             loading="lazy"
//                           />
//                           {(!isAvailable || hasNote) && (
//                             <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
//                               <span className="rounded-full bg-white/90 px-2 py-0.5 text-xs font-semibold">
//                                 {hasNote ? 'Contact for Availability' : 'Out of Stock'}
//                               </span>
//                             </div>
//                           )}
//                           <div className="absolute top-2 left-2">
//                             <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${categoryStyle.iconBg} ${categoryStyle.textColor} shadow-sm`}>
//                               <CategoryIcon size={10} />
//                               {item.normalizedCategory}
//                             </span>
//                           </div>
//                         </div>
//                       </Link>
                      
//                       <div className="p-4 flex flex-col flex-grow">
//                         <div className="flex items-start justify-between gap-2 mb-1">
//                           <h3 className="font-display font-semibold text-base text-[#3f3328] group-hover:text-[#b97844] transition-colors line-clamp-1 flex-grow">
//                             {item.name}
//                           </h3>
//                           <div className="flex items-center gap-0.5 shrink-0">
//                             <Star size={11} className="fill-[#b97844] text-[#b97844]" />
//                             <span className="text-xs text-[#6b5f54]">{item.averageRating ? item.averageRating.toFixed(1) : ''}</span>
//                           </div>
//                         </div>
//                         <p className="text-xs text-[#6b5f54] line-clamp-2 mb-3 min-h-[2.5rem]">
//                           {item.description?.substring(0, 80) || 'Freshly prepared with authentic flavors.'}
//                         </p>
//                         <div className="flex items-center justify-between mt-auto">
//                           <span className="font-bold text-lg text-[#3f3328]">{formatPrice(item.basePrice)}</span>
//                           <button
//                             onClick={(e) => handleAddToCart(item, e)}
//                             disabled={!isAvailable || hasNote}
//                             className="inline-flex items-center gap-1.5 rounded-full bg-[#b97844] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[#9e6538] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
//                           >
//                             <ShoppingBag size={12} />
//                             Add
//                           </button>
//                         </div>
//                       </div>
                      
//                       <button
//                         onClick={(e) => toggleFavourite(item._id, item.name, e)}
//                         type="button" 
//                         className="absolute top-2 right-2 z-30 w-8 h-8 rounded-full bg-white/95 flex items-center justify-center shadow-sm hover:bg-white transition-all"
//                       >
//                         <Heart 
//                           size={14} 
//                           className={isFavourite ? 'fill-[#b97844] text-[#b97844]' : 'text-[#6b5f54]'} 
//                         />
//                       </button>
//                     </div>
//                   );
//                 })}
//               </div>
              
//               {totalPages > 1 && (
//                 <>
//                   <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
//                   <div className="text-center text-xs text-[#a0968c] mt-2">
//                     Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1} - {Math.min(currentPage * ITEMS_PER_PAGE, filteredItems.length)} of {filteredItems.length} items
//                   </div>
//                 </>
//               )}
//             </>
//           )}
//         </div>
//       </main>

//       <CustomerFooter />

//       <CartDrawer isOpen={cartOpen} onClose={() => setCartOpen(false)} />
//     </div>
//   );
// }

import { useMemo, useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ShoppingBag, Star, Search, X, Pizza, Coffee, UtensilsCrossed, IceCream, Sandwich, ChefHat, Heart, ChevronLeft, ChevronRight } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useSearchParams, useLocation, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../../services/api';
import { addItem, selectCartCount, setOrderType } from '../../store/slices/cartSlice';
import CartDrawer from '../../components/customer/CartDrawer';
import OrderTypeSelector from '../../components/customer/OrderTypeSelector';
import { getOrderPreferences, saveOrderPreferences } from '../../utils/orderPreferences';
import { clearOrderPreferences } from '../../utils/orderPreferences';
import CustomerFooter from '../../components/customer/CustomerFooter';

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&h=300&fit=crop';
const ITEMS_PER_PAGE = 12;

// Category Icons and Colors
const CATEGORY_STYLES = {
  'Pasta & Noodles': { icon: UtensilsCrossed, color: 'bg-orange-50', borderColor: 'border-orange-200', textColor: 'text-orange-600', iconBg: 'bg-orange-100' },
  'Desserts': { icon: IceCream, color: 'bg-pink-50', borderColor: 'border-pink-200', textColor: 'text-pink-600', iconBg: 'bg-pink-100' },
  'Beverages': { icon: Coffee, color: 'bg-emerald-50', borderColor: 'border-emerald-200', textColor: 'text-emerald-600', iconBg: 'bg-emerald-100' },
  'Pizza': { icon: Pizza, color: 'bg-red-50', borderColor: 'border-red-200', textColor: 'text-red-600', iconBg: 'bg-red-100' },
  'Burger': { icon: Sandwich, color: 'bg-purple-50', borderColor: 'border-purple-200', textColor: 'text-purple-600', iconBg: 'bg-purple-100' },
  'default': { icon: ChefHat, color: 'bg-amber-50', borderColor: 'border-amber-200', textColor: 'text-amber-600', iconBg: 'bg-amber-100' }
};

function Pagination({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  const getPageNumbers = () => {
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || (i >= currentPage - 1 && i <= currentPage + 1)) {
        pages.push(i);
      } else if (i === currentPage - 2 || i === currentPage + 2) {
        pages.push('...');
      }
    }
    return [...new Set(pages)];
  };

  return (
    <div className="flex justify-center items-center gap-2 mt-8 pt-4 border-t border-[#e8e0d6]">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="w-9 h-9 rounded-full border border-[#e8e0d6] text-[#6b5f54] flex items-center justify-center hover:border-[#b97844] hover:text-[#b97844] disabled:opacity-40 disabled:cursor-not-allowed transition-all"
      >
        <ChevronLeft size={16} />
      </button>
      
      <div className="flex gap-2">
        {getPageNumbers().map((page, idx) => (
          page === '...' ? (
            <span key={`dots-${idx}`} className="text-[#a0968c] px-1">...</span>
          ) : (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={`w-9 h-9 rounded-full text-sm font-medium transition-all ${
                currentPage === page
                  ? 'bg-[#b97844] text-white'
                  : 'border border-[#e8e0d6] text-[#6b5f54] hover:border-[#b97844] hover:text-[#b97844]'
              }`}
            >
              {page}
            </button>
          )
        ))}
      </div>

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="w-9 h-9 rounded-full border border-[#e8e0d6] text-[#6b5f54] flex items-center justify-center hover:border-[#b97844] hover:text-[#b97844] disabled:opacity-40 disabled:cursor-not-allowed transition-all"
      >
        <ChevronRight size={16} />
      </button>
    </div>
  );
}

export default function MenuPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const cartCount = useSelector(selectCartCount);
  const user = useSelector((state) => state.auth.user);
  const { isAuthenticated } = useSelector((state) => state.auth);
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();
  const [cartOpen, setCartOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const favouriteStorageKey = useMemo(
    () => `customer-favourites:${user?._id || user?.email || 'guest'}`,
    [user?._id, user?.email]
  );
  

  const [favourites, setFavourites] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(favouriteStorageKey) || '[]');
      return new Set(saved);
    } catch {
      return new Set();
    }
  });

  // Get URL parameters
  const mode = searchParams.get('mode');
  const forceSelector = searchParams.get('showSelector') === '1';
  const preselectedMethod = searchParams.get('method');
  const preselectPreOrder = searchParams.get('preselect') === 'pre-order';
  const browseOnly = searchParams.get('browseOnly') === '1';
  const isDineInMode = mode === 'dine-in' || location.state?.isDineIn;
  const backTarget = location.state?.from;
  
  // Check if we need to show order type selector
  const savedPrefs = getOrderPreferences();

  const shouldShowSelector = useMemo(() => {
    if (browseOnly) {
      return false;
    }
    if (forceSelector) {
      return true;
    }
    // If mode is passed in URL (for delivery/takeaway), don't show selector
    if (mode && ['delivery', 'takeaway'].includes(mode)) {
      return false;
    }
    // If preselectPreOrder is true, show selector for pre-order
    if (preselectPreOrder) {
      return true;
    }
    // If saved preferences exist, don't show selector
    if (savedPrefs && savedPrefs.deliveryMethod) {
      return false;
    }
    // Otherwise show selector
    return true;
  }, [browseOnly, forceSelector, mode, savedPrefs, preselectPreOrder]);

  const stepBackInSelector = () => {
    if (backTarget) {
      navigate(backTarget);
      return;
    }
    navigate(-1);
  };

  useEffect(() => {
    if (mode && typeof mode === 'string' && ['delivery', 'takeaway', 'dine-in', 'pre-order'].includes(mode)) {
      dispatch(setOrderType(mode));
    }
  }, [mode, dispatch]);

  useEffect(() => {
    if (browseOnly || !mode || !['delivery', 'takeaway'].includes(mode)) {
      return;
    }

    if (savedPrefs?.deliveryMethod === mode && !savedPrefs?.isPreOrder) {
      return;
    }

    saveOrderPreferences({
      ...savedPrefs,
      deliveryMethod: mode,
      isPreOrder: false,
      isDineIn: false,
      preOrderMethod: '',
      timestamp: new Date().toISOString(),
    });
  }, [browseOnly, mode, savedPrefs]);

  // Load favourites from localStorage
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(favouriteStorageKey) || '[]');
      setFavourites(new Set(saved));
    } catch {
      setFavourites(new Set());
    }
  }, [favouriteStorageKey]);

  // Save favourites to localStorage
  useEffect(() => {
    localStorage.setItem(favouriteStorageKey, JSON.stringify(Array.from(favourites)));
  }, [favouriteStorageKey, favourites]);

  // Reset page when category or search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, searchQuery]);

  // Fetch menu items with error handling
  const { data: menuItems = [], isLoading, error, refetch } = useQuery({
    queryKey: ['menu'],
    queryFn: async () => {
      try {
        console.log('Fetching menu items...');
        const response = await api.get('/menu');
        console.log('Menu items fetched:', response.data);
        
        if (Array.isArray(response.data)) {
          return response.data;
        } else if (response.data && Array.isArray(response.data.data)) {
          return response.data.data;
        } else if (response.data && response.data.items && Array.isArray(response.data.items)) {
          return response.data.items;
        } else {
          console.error('Unexpected API response format:', response.data);
          return [];
        }
      } catch (err) {
        console.error('Error fetching menu:', err);
        toast.error('Failed to load menu. Please refresh the page.');
        return [];
      }
    },
    retry: 1,
    retryDelay: 1000,
  });

  // Get all unique categories from menu items
  const categories = useMemo(() => {
    if (!menuItems || menuItems.length === 0) return ['All'];
    
    const cats = menuItems
      .filter(item => !item.isArchived)
      .map(item => {
        const category = typeof item.category === 'string' ? item.category.trim() : item.category?.name?.trim();
        if (category === 'Pasta') return 'Pasta & Noodles';
        if (category === 'Noodles') return 'Pasta & Noodles';
        if (category === 'Dessert') return 'Desserts';
        return category;
      })
      .filter(Boolean);
    
    const uniqueCats = [...new Set(cats)];
    const priorityOrder = ['Pasta & Noodles', 'Desserts', 'Beverages'];
    return ['All', ...priorityOrder.filter(cat => uniqueCats.includes(cat)), ...uniqueCats.filter(cat => !priorityOrder.includes(cat))];
  }, [menuItems]);

  // Filter items
  const filteredItems = useMemo(() => {
    if (!menuItems || menuItems.length === 0) return [];
    
    let items = menuItems.filter(item => !item.isArchived);
    
    // Normalize category names
    items = items.map(item => ({
      ...item,
      normalizedCategory: (() => {
        const cat = typeof item.category === 'string' ? item.category.trim() : item.category?.name?.trim();
        if (cat === 'Pasta' || cat === 'Noodles') return 'Pasta & Noodles';
        if (cat === 'Dessert') return 'Desserts';
        return cat || 'Uncategorized';
      })()
    }));
    
    if (selectedCategory !== 'All') {
      items = items.filter(item => item.normalizedCategory === selectedCategory);
    }
    
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      items = items.filter(item => 
        item.name?.toLowerCase().includes(query) ||
        item.description?.toLowerCase().includes(query) || 
        item.normalizedCategory?.toLowerCase().includes(query)
      );
    }
    
    return items;
  }, [menuItems, selectedCategory, searchQuery]);

  // Pagination
  const totalPages = Math.ceil(filteredItems.length / ITEMS_PER_PAGE);
  const paginatedItems = filteredItems.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const handleAddToCart = (item, e) => {
  e.preventDefault();
  e.stopPropagation();
  
  // REMOVE THIS CHECK - Allow guests to add to cart
  // if (!isAuthenticated) {
  //   toast.error('Please login to add items to cart');
  //   navigate('/login', { state: { from: '/menu' } });
  //   return;
  // }
  
  if (!item.isAvailable) {
    toast.error(`${item.name} is currently unavailable`);
    return;
  }
  dispatch(addItem({
    menuItemId: item._id,
    name: item.name,
    basePrice: item.basePrice,
    image: item.image,
  }));
  toast.success(`${item.name} added to cart`);
};
  const toggleFavourite = (itemId, itemName, e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    const next = new Set(favourites);

    if (next.has(itemId)) {
      next.delete(itemId);
      toast.success(`${itemName} removed from favourites`);
    } else {
      next.add(itemId);
      toast.success(`${itemName} added to favourites`);
    }

    setFavourites(next);
  };

  const getCategoryStyle = (categoryName) => {
    return CATEGORY_STYLES[categoryName] || CATEGORY_STYLES.default;
  };

  const favouriteCount = favourites.size;

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const formatPrice = (price) => {
    const amount = Number(price || 0);
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const hasAvailabilityNote = (item) => {
    const note = String(item?.description || '').toLowerCase();
    const availabilityKeywords = [
      'contact',
      'customer service',
      'by order',
      'in stock',
      'ready-to-eat',
    ];

    return availabilityKeywords.some((keyword) => note.includes(keyword));
  };

  const getOptimizedImageUrl = (imageUrl) => {
    if (!imageUrl) return FALLBACK_IMAGE;
    if (imageUrl.includes('unsplash.com')) {
      return `${imageUrl.split('?')[0]}?w=400&h=300&fit=crop`;
    }
    if (imageUrl.includes('cloudinary.com')) {
      return imageUrl.replace('/upload/', '/upload/w_400,h_300,c_fill/');
    }
    return imageUrl;
  };

  // Show Order Type Selector if needed
  if (shouldShowSelector) {
    return (
      <div className="min-h-screen bg-white">
        <header className="border-b border-[#e8e0d6] bg-white sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              {/* REMOVED THE EXTRA BACK BUTTON - Only logo remains */}
              <Link to="/" className="flex items-center gap-2">
                <img 
                  src="https://rollercoastercafe.com/assets/images/roller_logo.png" 
                  alt="Logo"
                  className="h-10 w-10 rounded-full object-cover"
                />
                <span className="font-display font-bold text-xl text-[#3f3328]">Roller Coaster Cafe</span>
              </Link>
              <Link to="/cart" className="text-sm text-[#b97844] hover:underline">
                View Cart
              </Link>
            </div>
          </div>
        </header>

        <main className="max-w-2xl mx-auto px-4 py-12">
          <OrderTypeSelector 
            separatePreOrderFlow
            initialData={
              preselectedMethod && ['delivery', 'takeaway', 'pre-order'].includes(preselectedMethod)
                ? { deliveryMethod: preselectedMethod }
                : null
            }
            onBack={stepBackInSelector}
            onComplete={(preferences) => {
              if (preferences?.browseOnly) {
                clearOrderPreferences();
                navigate('/menu?browseOnly=1', { replace: true });
                return;
              }

              if (preferences?.deliveryMethod === 'pre-order') {
                navigate('/pre-order/schedule', {
                  state: { from: `${location.pathname}${location.search}` },
                });
                return;
              }

              const newPrefs = {
                deliveryMethod: preferences.deliveryMethod,
                preOrderMethod: preferences.preOrderMethod || null,
                scheduledDateTime: preferences.scheduledDateTime,
                isDineIn: preferences.isDineIn,
                isPreOrder: preferences.isPreOrder,
                tableNumber: preferences.tableNumber,
                guestCount: preferences.guestCount,
                timestamp: new Date().toISOString()
              };
              saveOrderPreferences(newPrefs);
              navigate('/menu', { replace: true });
            }}
          />
        </main>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-7xl mx-auto px-6 py-16 text-center">
          <div className="bg-red-50 rounded-2xl p-8 max-w-md mx-auto">
            <h2 className="text-xl font-bold text-red-600 mb-2">Failed to Load Menu</h2>
            <p className="text-gray-600 mb-4">There was an error loading the menu items.</p>
            <button 
              onClick={() => refetch()}
              className="bg-[#b97844] text-white px-6 py-2 rounded-full hover:bg-[#9e6538] transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white font-body">
      {/* Header */}
      <header className="border-b border-[#e8e0d6] bg-white sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => {
                  if (backTarget) {
                    navigate(backTarget);
                    return;
                  }
                  navigate(-1);
                }}
                className="flex items-center gap-1 text-sm text-[#6b5f54] hover:text-[#b97844] transition-colors"
              >
                Back
              </button>
              <Link to="/" className="flex items-center gap-2">
                <img 
                  src="https://rollercoastercafe.com/assets/images/roller_logo.png" 
                  alt="Roller Coaster Cafe"
                  className="h-10 w-10 rounded-full object-cover"
                />
                <span className="font-display font-bold text-xl text-[#3f3328]">Roller Coaster Cafe</span>
              </Link>
            </div>

            <nav className="hidden md:flex items-center gap-8">
              <Link to="/" className="text-sm font-medium text-[#6b5f54] hover:text-[#b97844] transition-colors">Home</Link>
              <Link to="/menu" className="text-sm font-medium text-[#b97844] transition-colors">Menu</Link>
              <Link to="/orders" className="text-sm font-medium text-[#6b5f54] hover:text-[#b97844] transition-colors">Orders</Link>
              <Link to="/profile" className="text-sm font-medium text-[#6b5f54] hover:text-[#b97844] transition-colors">Profile</Link>
              <Link to="/settings" className="text-sm font-medium text-[#6b5f54] hover:text-[#b97844] transition-colors">Settings</Link>
            </nav>

            <div className="flex items-center gap-3">
              <Link 
                to="/favourites" 
                className="relative inline-flex items-center gap-1.5 rounded-full px-3 py-2 text-sm font-medium text-[#6b5f54] hover:text-[#b97844] transition-all"
              >
                <Heart size={16} className={favouriteCount > 0 ? 'fill-[#b97844] text-[#b97844]' : ''} />
                <span className="hidden sm:inline">Favourites</span>
                {favouriteCount > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-4 h-4 px-1 rounded-full bg-[#b97844] text-white text-[10px] flex items-center justify-center">
                    {favouriteCount}
                  </span>
                )}
              </Link>

              <button
                onClick={() => setCartOpen(true)}
                className="relative inline-flex items-center gap-2 rounded-full bg-[#b97844] px-4 py-2 text-sm font-semibold text-white hover:bg-[#9e6538] transition-all"
              >
                <ShoppingBag size={16} />
                <span>Cart</span>
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 min-w-5 h-5 px-1 rounded-full bg-[#3f3328] text-white text-xs flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      <main>
        {/* Dine-In Banner */}
        {isDineInMode && (
          <div className="bg-amber-50 border-b border-amber-200">
            <div className="max-w-7xl mx-auto px-6 py-3">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center">
                    <UtensilsCrossed size={16} className="text-amber-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-amber-800">Dine-In Mode Active</p>
                    <p className="text-xs text-amber-600">Your table is reserved. Your order will be served at your table.</p>
                  </div>
                </div>
                <Link 
                  to="/dine-in" 
                  className="text-xs text-amber-700 hover:underline flex items-center gap-1"
                >
                  View Table Info
                </Link>
              </div>
            </div>
          </div>
        )}

        <div className="max-w-7xl mx-auto px-6 pt-6 pb-2">
          <h1 className="font-display text-2xl font-bold text-[#3f3328]">Our Menu</h1>
          {menuItems.length === 0 && !isLoading && (
            <p className="text-[#6b5f54] text-sm mt-1">No menu items available</p>
          )}
        </div>

        {menuItems.length > 0 && (
          <>
            <div className="max-w-7xl mx-auto px-6 py-3">
              <div className="relative max-w-md">
                <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#a0968c]" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for your favorite dish..."
                  className="w-full rounded-full border border-[#e8e0d6] bg-white py-2 pl-10 pr-4 text-sm text-[#3f3328] placeholder:text-[#a0968c] focus:border-[#b97844] focus:outline-none focus:ring-1 focus:ring-[#b97844] transition-all"
                />
                {searchQuery && (
                  <button onClick={() => setSearchQuery('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#a0968c] hover:text-[#b97844]">
                    <X size={14} />
                  </button>
                )}
              </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 pb-4 overflow-x-auto">
              <div className="flex gap-3">
                {categories.map((category) => {
                  const isActive = selectedCategory === category;
                  const style = getCategoryStyle(category);
                  const Icon = style.icon;
                  return (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap ${
                        isActive 
                          ? `${style.color} ${style.textColor} shadow-sm border ${style.borderColor}` 
                          : 'bg-white border border-[#e8e0d6] text-[#6b5f54] hover:border-[#b97844] hover:text-[#b97844]'
                      }`}
                    >
                      {category !== 'All' && <Icon size={14} />}
                      {category}
                    </button>
                  );
                })}
              </div>
            </div>
          </>
        )}

        <div className="max-w-7xl mx-auto px-6 pb-16">
          {isLoading ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[1,2,3,4,5,6].map(i => (
                <div key={i} className="rounded-2xl bg-[#faf8f5] animate-pulse h-72" />
              ))}
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="text-center py-16">
              <ChefHat size={48} className="mx-auto text-[#a0968c] mb-4" />
              <h2 className="font-display text-2xl text-[#3f3328] mb-2">No items found</h2>
              <p className="text-[#6b5f54]">Try a different category or search term</p>
              {menuItems.length === 0 && (
                <button 
                  onClick={() => refetch()}
                  className="mt-4 text-[#b97844] hover:underline"
                >
                  Refresh Menu
                </button>
              )}
            </div>
          ) : (
            <>
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {paginatedItems.map((item) => {
                  const isFavourite = favourites.has(item._id);
                  const hasNote = hasAvailabilityNote(item);
                  const isAvailable = item.isAvailable !== false;
                  const categoryStyle = getCategoryStyle(item.normalizedCategory);
                  const CategoryIcon = categoryStyle.icon;
                  const optimizedImage = getOptimizedImageUrl(item.image);
                  
                  return (
                    <div key={item._id} className="group relative rounded-xl bg-white border border-[#e8e0d6] overflow-hidden hover:shadow-md transition-all hover:-translate-y-0.5 flex flex-col h-full">
                      <Link to={`/menu/item/${item._id}`} className="block flex-shrink-0">
                        <div className="relative w-full h-48 overflow-hidden bg-[#faf8f5]">
                          <img
                            src={optimizedImage}
                            alt={item.name}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                            onError={(e) => { 
                              e.target.src = FALLBACK_IMAGE;
                              e.target.onerror = null;
                            }}
                            loading="lazy"
                          />
                          {(!isAvailable || hasNote) && (
                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                              <span className="rounded-full bg-white/90 px-2 py-0.5 text-xs font-semibold">
                                {hasNote ? 'Contact for Availability' : 'Out of Stock'}
                              </span>
                            </div>
                          )}
                          <div className="absolute top-2 left-2">
                            <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${categoryStyle.iconBg} ${categoryStyle.textColor} shadow-sm`}>
                              <CategoryIcon size={10} />
                              {item.normalizedCategory}
                            </span>
                          </div>
                        </div>
                      </Link>
                      
                      <div className="p-4 flex flex-col flex-grow">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <h3 className="font-display font-semibold text-base text-[#3f3328] group-hover:text-[#b97844] transition-colors line-clamp-1 flex-grow">
                            {item.name}
                          </h3>
                          <div className="flex items-center gap-0.5 shrink-0">
                            <Star size={11} className="fill-[#b97844] text-[#b97844]" />
                            <span className="text-xs text-[#6b5f54]">{item.averageRating ? item.averageRating.toFixed(1) : ''}</span>
                          </div>
                        </div>
                        <p className="text-xs text-[#6b5f54] line-clamp-2 mb-3 min-h-[2.5rem]">
                          {item.description?.substring(0, 80) || 'Freshly prepared with authentic flavors.'}
                        </p>
                        <div className="flex items-center justify-between mt-auto">
                          <span className="font-bold text-lg text-[#3f3328]">{formatPrice(item.basePrice)}</span>
                          <button
                            onClick={(e) => handleAddToCart(item, e)}
                            disabled={!isAvailable || hasNote}
                            className="inline-flex items-center gap-1.5 rounded-full bg-[#b97844] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[#9e6538] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <ShoppingBag size={12} />
                            Add
                          </button>
                        </div>
                      </div>
                      
                      <button
                        onClick={(e) => toggleFavourite(item._id, item.name, e)}
                        type="button" 
                        className="absolute top-2 right-2 z-30 w-8 h-8 rounded-full bg-white/95 flex items-center justify-center shadow-sm hover:bg-white transition-all"
                      >
                        <Heart 
                          size={14} 
                          className={isFavourite ? 'fill-[#b97844] text-[#b97844]' : 'text-[#6b5f54]'} 
                        />
                      </button>
                    </div>
                  );
                })}
              </div>
              
              {totalPages > 1 && (
                <>
                  <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
                  <div className="text-center text-xs text-[#a0968c] mt-2">
                    Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1} - {Math.min(currentPage * ITEMS_PER_PAGE, filteredItems.length)} of {filteredItems.length} items
                  </div>
                </>
              )}
            </>
          )}
        </div>
      </main>

      <CustomerFooter />

      <CartDrawer isOpen={cartOpen} onClose={() => setCartOpen(false)} />
    </div>
  );
}
