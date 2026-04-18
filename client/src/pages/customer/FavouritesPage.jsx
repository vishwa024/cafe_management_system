import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Heart, ShoppingBag, Star, Trash2, X } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import api from '../../services/api';
import { addItem, selectCartCount } from '../../store/slices/cartSlice';
import CartDrawer from '../../components/customer/CartDrawer';
import CustomerFooter from '../../components/customer/CustomerFooter';

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600&h=400&fit=crop';

export default function FavouritesPage() {
  const dispatch = useDispatch();
  const cartCount = useSelector(selectCartCount);
  const user = useSelector((state) => state.auth.user);
  const [cartOpen, setCartOpen] = useState(false);
  const [favouriteIds, setFavouriteIds] = useState([]);
  const storageKey = useMemo(
    () => `customer-favourites:${user?._id || user?.email || 'guest'}`,
    [user?._id, user?.email]
  );

  // Load favourites from localStorage
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(storageKey) || '[]');
      setFavouriteIds(saved);
    } catch {
      setFavouriteIds([]);
    }
  }, [storageKey]);

  const { data: menuItems = [], isLoading } = useQuery({
    queryKey: ['menu-favourites'],
    queryFn: () => api.get('/menu').then((res) => res.data),
  });

  const favouriteItems = useMemo(
    () => menuItems.filter((item) => favouriteIds.includes(item._id)),
    [menuItems, favouriteIds]
  );

  const removeFavourite = (itemId, name) => {
    const next = favouriteIds.filter((id) => id !== itemId);
    setFavouriteIds(next);
    localStorage.setItem(storageKey, JSON.stringify(next));
    toast.success(`${name} removed from favourites`);
  };

  const clearAllFavourites = () => {
    setFavouriteIds([]);
    localStorage.setItem(storageKey, JSON.stringify([]));
    toast.success('All favourites cleared');
  };

  const handleAddToCart = (item) => {
    dispatch(addItem({
      menuItemId: item._id,
      name: item.name,
      basePrice: item.basePrice,
      image: item.image,
    }));
    toast.success(`${item.name} added to cart`);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-100 bg-white sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <Link to="/dashboard" className="flex items-center gap-2">
              <img 
                src="https://rollercoastercafe.com/assets/images/roller_logo.png" 
                alt="Logo"
                className="h-8 w-8 rounded-full object-cover"
              />
              <span className="font-semibold text-lg text-gray-800">Roller Coaster Cafe</span>
            </Link>

            <nav className="hidden md:flex items-center gap-6">
              <Link to="/dashboard" className="text-sm text-gray-500 hover:text-amber-600">Home</Link>
              <Link to="/menu" className="text-sm text-gray-500 hover:text-amber-600">Menu</Link>
              <Link to="/orders" className="text-sm text-gray-500 hover:text-amber-600">Orders</Link>
              <Link to="/profile" className="text-sm text-gray-500 hover:text-amber-600">Profile</Link>
              <Link to="/settings" className="text-sm text-gray-500 hover:text-amber-600">Settings</Link>
            </nav>

            <button
              onClick={() => setCartOpen(true)}
              className="relative inline-flex items-center gap-1.5 rounded-full bg-amber-600 px-3 py-1.5 text-sm font-semibold text-white hover:bg-amber-700"
            >
              <ShoppingBag size={14} />
              <span>Cart</span>
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 min-w-4 h-4 px-1 rounded-full bg-gray-800 text-white text-[10px]">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Title and Actions */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">My Favourites</h1>
            <p className="text-sm text-gray-400 mt-1">
              {favouriteItems.length} {favouriteItems.length === 1 ? 'item' : 'items'} saved
            </p>
          </div>
          {favouriteItems.length > 0 && (
            <button
              onClick={clearAllFavourites}
              className="inline-flex items-center gap-1.5 rounded-full border border-red-200 px-3 py-1.5 text-sm text-red-500 hover:bg-red-50 transition-all"
            >
              <X size={14} />
              Clear All
            </button>
          )}
        </div>

        {/* Loading State */}
        {isLoading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-gray-50 rounded-xl h-64 animate-pulse" />
            ))}
          </div>
        ) : favouriteItems.length === 0 ? (
          // Empty State
          <div className="text-center py-16">
            <div className="w-20 h-20 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <Heart size={32} className="text-gray-300" />
            </div>
            <h2 className="text-xl font-medium text-gray-500 mb-2">No favourites yet</h2>
            <p className="text-sm text-gray-400 mb-6">Save your favorite dishes and they'll appear here</p>
            <Link 
              to="/menu" 
              className="inline-flex items-center gap-2 rounded-full bg-amber-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-amber-700 transition-all"
            >
              <ShoppingBag size={16} />
              Browse Menu
            </Link>
          </div>
        ) : (
          // Favourites Grid
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {favouriteItems.map((item) => (
              <div 
                key={item._id} 
                className="group bg-white border border-gray-100 rounded-xl overflow-hidden hover:shadow-md transition-all"
              >
                {/* Image */}
                <Link to={`/menu/item/${item._id}`} className="block relative h-44 overflow-hidden bg-gray-50">
                  <img
                    src={item.image || FALLBACK_IMAGE}
                    alt={item.name}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    onError={(e) => { e.target.src = FALLBACK_IMAGE; }}
                  />
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      removeFavourite(item._id, item.name);
                    }}
                    className="absolute top-2 right-2 w-7 h-7 rounded-full bg-white/90 flex items-center justify-center text-red-500 hover:bg-white transition-all"
                  >
                    <Trash2 size={14} />
                  </button>
                </Link>

                {/* Content */}
                <div className="p-4">
                  <Link to={`/menu/item/${item._id}`} className="block">
                    <div className="flex items-start justify-between mb-1">
                      <h3 className="font-semibold text-gray-800 group-hover:text-amber-600 transition-colors line-clamp-1">
                        {item.name}
                      </h3>
                      <div className="flex items-center gap-0.5 shrink-0 ml-2">
                        <Star size={12} className="fill-amber-500 text-amber-500" />
                        <span className="text-xs text-gray-500">
                          {item.averageRating ? item.averageRating.toFixed(1) : ''}
                        </span>
                      </div>
                    </div>
                    <p className="text-xs text-gray-400 line-clamp-2 mt-1 mb-3">
                      {item.description?.substring(0, 80) || 'Freshly prepared with authentic flavors.'}
                    </p>
                  </Link>
                  
                  <div className="flex items-center justify-between mt-2">
                    <span className="font-bold text-lg text-gray-800">₹{item.basePrice}</span>
                    <button
                      onClick={() => handleAddToCart(item)}
                      className="rounded-full bg-amber-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-amber-700 transition-all"
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <CustomerFooter />

      <CartDrawer isOpen={cartOpen} onClose={() => setCartOpen(false)} />
    </div>
  );
}


