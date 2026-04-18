import { useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  ArrowLeft,
  Clock3,
  Flame,
  Heart,
  Leaf,
  MessageSquare,
  ShoppingBag,
  Sparkles,
  Star,
  Settings2,
  Minus,
  Plus,
  Truck,
  Home,
  Users,
  Clock
} from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../services/api';
import CartDrawer from '../../components/customer/CartDrawer';
import { addItem, selectCartCount } from '../../store/slices/cartSlice';

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600&h=400&fit=crop';

const formatReviewDate = (value) => {
  if (!value) return 'Recently';
  return new Date(value).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
};

// Helper function to get optimized image URL with fixed dimensions
const getOptimizedImageUrl = (imageUrl) => {
  if (!imageUrl) return FALLBACK_IMAGE;
  
  // For Unsplash images
  if (imageUrl.includes('unsplash.com')) {
    const baseUrl = imageUrl.split('?')[0];
    return `${baseUrl}?w=600&h=450&fit=crop`;
  }
  
  // For Cloudinary images
  if (imageUrl.includes('cloudinary.com')) {
    return imageUrl.replace('/upload/', '/upload/w_600,h_450,c_fill/');
  }
  
  return imageUrl;
};

export default function MenuItemDetailsPage() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const cartCount = useSelector(selectCartCount);
  const user = useSelector((state) => state.auth.user);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const [cartOpen, setCartOpen] = useState(false);
  const [favourite, setFavourite] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [selectedAddons, setSelectedAddons] = useState([]);
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '' });

  const initials = (user?.name || 'RC')
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  const { data: item, isLoading, isError } = useQuery({
    queryKey: ['menu-item', id],
    queryFn: () => api.get(`/menu/${id}`).then((res) => res.data),
    enabled: Boolean(id),
  });

  const myReview = useMemo(
    () => (item?.reviews || []).find((review) => String(review.user) === String(user?._id)),
    [item?.reviews, user?._id]
  );

  const reviewMutation = useMutation({
    mutationFn: (payload) => api.post(`/menu/${id}/reviews`, payload).then((res) => res.data),
    onSuccess: () => {
      toast.success('Your review is now visible');
      queryClient.invalidateQueries({ queryKey: ['menu-item', id] });
      setReviewForm({ rating: 5, comment: '' });
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Could not submit your review');
    },
  });

  const calculateTotalPrice = () => {
    let total = item?.basePrice || 0;
    if (selectedVariant) {
      const variant = item?.variants?.find(v => v.name === selectedVariant);
      if (variant) total = variant.price;
    }
    const addonsTotal = selectedAddons.reduce((sum, addonName) => {
      const addon = item?.addons?.find(a => a.name === addonName);
      return sum + (addon?.price || 0);
    }, 0);
    return (total + addonsTotal) * quantity;
  };

  const handleAddToCart = () => {
    if (!item) return;
    dispatch(addItem({
      menuItemId: item._id,
      name: item.name,
      basePrice: calculateTotalPrice() / quantity,
      quantity: quantity,
      image: item.image,
      variant: selectedVariant,
      addons: selectedAddons,
    }));
    toast.success(`${quantity} × ${item.name} added to cart`);
    setQuantity(1);
    setSelectedVariant(null);
    setSelectedAddons([]);
  };

  const toggleAddon = (addonName) => {
    setSelectedAddons(prev =>
      prev.includes(addonName)
        ? prev.filter(a => a !== addonName)
        : [...prev, addonName]
    );
  };

  const handleReviewSubmit = (event) => {
    event.preventDefault();
    if (!isAuthenticated) {
      toast.error('Please login first to write a review');
      return;
    }
    reviewMutation.mutate({
      rating: Number(reviewForm.rating),
      comment: reviewForm.comment.trim(),
    });
  };

  const optimizedImage = item?.image ? getOptimizedImageUrl(item.image) : FALLBACK_IMAGE;

  return (
    <div className="min-h-screen bg-white font-body">
      {/* Header */}
      <header className="border-b border-[#e8e0d6] bg-white sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-3">
          <div className="flex items-center justify-between">
            <Link to="/dashboard" className="flex items-center gap-2">
              <img
                src="https://rollercoastercafe.com/assets/images/roller_logo.png"
                alt="Logo"
                className="h-9 w-9 rounded-full object-cover"
              />
              <span className="font-display font-bold text-lg text-[#3f3328]">Roller Coaster Cafe</span>
            </Link>

            <nav className="hidden md:flex items-center gap-6">
              <Link to="/dashboard" className="text-sm text-[#6b5f54] hover:text-[#b97844]">Home</Link>
              <Link to="/menu" className="text-sm text-[#b97844]">Menu</Link>
              <Link to="/orders" className="text-sm text-[#6b5f54] hover:text-[#b97844]">Orders</Link>
              <Link to="/profile" className="text-sm text-[#6b5f54] hover:text-[#b97844]">Profile</Link>
              <Link to="/settings" className="text-sm text-[#6b5f54] hover:text-[#b97844]">Settings</Link>
            </nav>

            <div className="flex items-center gap-2">
              <Link
                to="/settings"
                className="hidden sm:inline-flex h-9 w-9 items-center justify-center rounded-full border border-[#e8e0d6] bg-white text-[#6b5f54] hover:border-[#b97844] hover:text-[#b97844]"
              >
                <Settings2 size={16} />
              </Link>
              <Link
                to="/profile"
                className="hidden sm:inline-flex h-9 w-9 items-center justify-center rounded-full bg-[#3f3328] text-white hover:bg-[#b97844] transition-colors"
              >
                <span className="text-xs font-bold">{initials}</span>
              </Link>
              <button
                onClick={() => setCartOpen(true)}
                className="relative inline-flex items-center gap-1.5 rounded-full bg-[#b97844] px-3 py-1.5 text-sm font-semibold text-white hover:bg-[#9e6538] transition-all"
              >
                <ShoppingBag size={14} />
                <span>Cart</span>
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-4 h-4 px-1 rounded-full bg-[#3f3328] text-white text-[10px] flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-6">
        {/* Back Button */}
        <div className="mb-4">
          <Link to="/menu" className="inline-flex items-center gap-1.5 text-sm text-[#6b5f54] hover:text-[#b97844] transition-colors">
            <ArrowLeft size={14} />
            Back to Menu
          </Link>
        </div>

        {isLoading ? (
          <div className="grid md:grid-cols-2 gap-8 animate-pulse">
            <div className="rounded-2xl bg-gray-100 h-96" />
            <div className="space-y-4">
              <div className="h-6 w-24 bg-gray-100 rounded" />
              <div className="h-10 w-3/4 bg-gray-100 rounded" />
              <div className="h-24 w-full bg-gray-100 rounded" />
            </div>
          </div>
        ) : isError || !item ? (
          <div className="text-center py-16">
            <h2 className="font-display text-2xl text-[#3f3328] mb-2">Item not found</h2>
            <p className="text-[#6b5f54] mb-4">We could not load this menu item.</p>
            <Link to="/menu" className="inline-flex items-center gap-2 rounded-full bg-[#b97844] px-5 py-2 text-sm text-white hover:bg-[#9e6538]">
              Back to Menu
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-8">
            {/* Left - Image with FIXED SIZE */}
            <div className="sticky top-24">
              <div className="rounded-2xl overflow-hidden bg-[#faf8f5] shadow-md">
                {/* Fixed aspect ratio container - 4:3 (600x450) */}
                <div className="relative pt-[75%]">
                  <img
                    src={optimizedImage}
                    alt={item.name}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                    onError={(e) => { 
                      e.target.src = FALLBACK_IMAGE;
                      e.target.onerror = null;
                    }}
                  />
                  {/* Badge overlay */}
                  {item.tags?.includes('bestseller') && (
                    <div className="absolute top-3 left-3">
                      <span className="inline-flex items-center gap-1 rounded-full bg-[#b97844] px-2.5 py-1 text-xs font-semibold text-white shadow-lg">
                        <Flame size={11} />
                        SIGNATURE DISH
                      </span>
                    </div>
                  )}
                  {!item.isAvailable && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <span className="rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-[#3f3328]">
                        Currently Unavailable
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right - Details */}
            <div>
              {/* Title & Category */}
              <div className="mb-4">
                <span className="text-xs font-medium text-[#b97844] uppercase tracking-wide">
                  {typeof item.category === 'string' ? item.category : item.category?.name || 'Signature Dish'}
                </span>
                <h1 className="font-display text-3xl font-bold text-[#3f3328] mt-1">{item.name}</h1>
              </div>

              {/* Rating & Info */}
              <div className="flex flex-wrap items-center gap-4 mb-5">
                <div className="flex items-center gap-1">
                  <Star size={16} className="fill-[#b97844] text-[#b97844]" />
                  <span className="font-medium text-[#3f3328]">{item.averageRating?.toFixed(1) || '0.0'}</span>
                  <span className="text-sm text-[#6b5f54]">({item.totalReviews || 0} reviews)</span>
                </div>
                {item.tags?.includes('veg') && (
                  <span className="inline-flex items-center gap-1 text-xs text-emerald-600">
                    <Leaf size={12} /> Pure Veg
                  </span>
                )}
              </div>

              {/* Description */}
              <p className="text-[#6b5f54] leading-relaxed mb-6">
                {item.description || 'Freshly prepared with authentic flavors and premium ingredients. Served with love.'}
              </p>

              {/* Price */}
              <div className="mb-6">
                <span className="text-3xl font-bold text-[#3f3328]">₹{calculateTotalPrice()}</span>
                {quantity > 1 && (
                  <span className="text-sm text-[#6b5f54] ml-2">
                    (₹{Math.round(calculateTotalPrice() / quantity)} each)
                  </span>
                )}
              </div>

              {/* Quantity Selector */}
              <div className="flex items-center gap-4 mb-6">
                <span className="text-sm font-medium text-[#3f3328]">Quantity:</span>
                <div className="flex items-center gap-3 bg-[#faf8f5] rounded-full px-3 py-1.5">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-7 h-7 rounded-full bg-white border border-[#e8e0d6] flex items-center justify-center hover:border-[#b97844] hover:text-[#b97844] transition-colors"
                  >
                    <Minus size={14} />
                  </button>
                  <span className="w-8 text-center font-medium text-[#3f3328]">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-7 h-7 rounded-full bg-[#b97844] text-white flex items-center justify-center hover:bg-[#9e6538] transition-colors"
                  >
                    <Plus size={14} />
                  </button>
                </div>
              </div>

              {/* Variants */}
              {item.variants?.length > 0 && (
                <div className="mb-6">
                  <h3 className="font-medium text-[#3f3328] mb-3">Choose Size / Variant</h3>
                  <div className="flex flex-wrap gap-2">
                    {item.variants.map((variant) => (
                      <button
                        key={variant.name}
                        onClick={() => setSelectedVariant(variant.name)}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                          selectedVariant === variant.name
                            ? 'bg-[#b97844] text-white'
                            : 'bg-[#faf8f5] border border-[#e8e0d6] text-[#6b5f54] hover:border-[#b97844]'
                        }`}
                      >
                        {variant.name} - ₹{variant.price}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Add-ons */}
              {item.addons?.length > 0 && (
                <div className="mb-6">
                  <h3 className="font-medium text-[#3f3328] mb-3">Add-ons</h3>
                  <div className="flex flex-wrap gap-2">
                    {item.addons.map((addon) => (
                      <button
                        key={addon.name}
                        onClick={() => toggleAddon(addon.name)}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                          selectedAddons.includes(addon.name)
                            ? 'bg-[#b97844] text-white'
                            : 'bg-[#faf8f5] border border-[#e8e0d6] text-[#6b5f54] hover:border-[#b97844]'
                        }`}
                      >
                        + {addon.name} (₹{addon.price})
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Add to Cart Button */}
              <button
                onClick={handleAddToCart}
                disabled={!item.isAvailable}
                className="w-full rounded-full bg-[#b97844] py-3 text-white font-semibold hover:bg-[#9e6538] transition-all disabled:opacity-50 disabled:cursor-not-allowed mb-4"
              >
                Add to Cart - ₹{calculateTotalPrice()}
              </button>

              {/* Delivery Info */}
              <div className="grid grid-cols-3 gap-3 pt-4 border-t border-[#e8e0d6]">
                <div className="text-center">
                  <Truck size={18} className="mx-auto text-[#b97844] mb-1" />
                  <p className="text-xs text-[#6b5f54]">Free Delivery</p>
                  <p className="text-[10px] text-[#a0968c]">on orders above ₹299</p>
                </div>
                <div className="text-center">
                  <Clock size={18} className="mx-auto text-[#b97844] mb-1" />
                  <p className="text-xs text-[#6b5f54]">30-45 min</p>
                  <p className="text-[10px] text-[#a0968c]">Delivery time</p>
                </div>
                <div className="text-center">
                  <Home size={18} className="mx-auto text-[#b97844] mb-1" />
                  <p className="text-xs text-[#6b5f54]">Pickup Available</p>
                  <p className="text-[10px] text-[#a0968c]">from our cafe</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Reviews Section */}
        {!isLoading && !isError && item && (
          <div className="mt-12 pt-8 border-t border-[#e8e0d6]">
            <div className="flex items-center gap-2 mb-6">
              <MessageSquare size={18} className="text-[#b97844]" />
              <h2 className="font-display text-xl font-bold text-[#3f3328]">Customer Reviews</h2>
            </div>

            {/* Review Form */}
            <div className="bg-[#faf8f5] rounded-xl p-5 mb-6">
              <h3 className="font-medium text-[#3f3328] mb-3">Write a Review</h3>
              {myReview && (
                <p className="text-sm text-emerald-600 mb-3">You've already reviewed this item. Submit again to update.</p>
              )}
              <form onSubmit={handleReviewSubmit} className="space-y-4">
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((value) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setReviewForm(prev => ({ ...prev, rating: value }))}
                      className="p-1 transition-all"
                    >
                      <Star 
                        size={24} 
                        className={reviewForm.rating >= value ? 'fill-[#b97844] text-[#b97844]' : 'text-gray-300'} 
                      />
                    </button>
                  ))}
                </div>
                <textarea
                  value={reviewForm.comment}
                  onChange={(e) => setReviewForm(prev => ({ ...prev, comment: e.target.value }))}
                  rows={3}
                  className="w-full rounded-xl border border-[#e8e0d6] bg-white p-3 text-sm focus:border-[#b97844] focus:outline-none focus:ring-1 focus:ring-[#b97844]"
                  placeholder="Share your experience with this dish..."
                />
                <button
                  type="submit"
                  disabled={reviewMutation.isPending}
                  className="rounded-full bg-[#b97844] px-5 py-2 text-sm font-semibold text-white hover:bg-[#9e6538] disabled:opacity-50 transition-all"
                >
                  {reviewMutation.isPending ? 'Submitting...' : 'Submit Review'}
                </button>
              </form>
            </div>

            {/* Reviews List */}
            <div className="space-y-4">
              {(item.reviews || []).length === 0 ? (
                <p className="text-center text-[#6b5f54] py-6">No reviews yet. Be the first to review!</p>
              ) : (
                item.reviews.map((review, index) => (
                  <div key={index} className="border-b border-[#e8e0d6] pb-4 last:border-0">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-[#faf8f5] flex items-center justify-center">
                          <span className="text-xs font-medium text-[#3f3328]">
                            {review.customerName?.charAt(0) || 'C'}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-[#3f3328] text-sm">{review.customerName || 'Customer'}</p>
                          <p className="text-xs text-[#a0968c]">{formatReviewDate(review.createdAt)}</p>
                        </div>
                      </div>
                      <div className="flex gap-0.5">
                        {[...Array(review.rating)].map((_, i) => (
                          <Star key={i} size={12} className="fill-[#b97844] text-[#b97844]" />
                        ))}
                      </div>
                    </div>
                    <p className="text-sm text-[#6b5f54] pl-10">{review.comment || 'No comment provided.'}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-[#3f3328] text-white/60 py-5 mt-10">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <div className="flex flex-wrap items-center justify-center gap-4 mb-2">
            <Link to="/dashboard" className="text-xs hover:text-white">Home</Link>
            <Link to="/menu" className="text-xs hover:text-white">Menu</Link>
            <Link to="/orders" className="text-xs hover:text-white">Orders</Link>
            <Link to="/profile" className="text-xs hover:text-white">Profile</Link>
            <Link to="/settings" className="text-xs hover:text-white">Settings</Link>
          </div>
          <p className="text-xs">© {new Date().getFullYear()} Roller Coaster Cafe</p>
        </div>
      </footer>

      <CartDrawer isOpen={cartOpen} onClose={() => setCartOpen(false)} />
    </div>
  );
}