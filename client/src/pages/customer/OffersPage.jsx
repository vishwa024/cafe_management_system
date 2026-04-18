import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Copy, Percent, Tags, Gift, Clock, CheckCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../../services/api';
import { selectCartCount } from '../../store/slices/cartSlice';
import CartDrawer from '../../components/customer/CartDrawer';
import CustomerFooter from '../../components/customer/CustomerFooter';

const OFFERS_PER_PAGE = 6;

export default function OffersPage() {
  const cartCount = useSelector(selectCartCount);
  const [cartOpen, setCartOpen] = useState(false);
  const [copiedCode, setCopiedCode] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  const { data: offers = [], isLoading } = useQuery({
    queryKey: ['customer-offers'],
    queryFn: () => api.get('/customer/offers').then((res) => res.data),
  });

  const copyCode = async (code) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedCode(code);
      toast.success(`${code} copied! Use it at checkout`);
      setTimeout(() => setCopiedCode(null), 2000);
    } catch {
      toast.error('Failed to copy');
    }
  };

  const activeOffers = useMemo(() => offers.filter(offer => offer.isActive !== false), [offers]);
  
  // Pagination for all offers
  const totalPages = Math.ceil(activeOffers.length / OFFERS_PER_PAGE);
  const paginatedOffers = useMemo(() => {
    const start = (currentPage - 1) * OFFERS_PER_PAGE;
    return activeOffers.slice(start, start + OFFERS_PER_PAGE);
  }, [activeOffers, currentPage]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 400, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-[#e8e0d6] bg-white sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <Link to="/dashboard" className="flex items-center gap-2">
              <img 
                src="https://rollercoastercafe.com/assets/images/roller_logo.png" 
                alt="Logo"
                className="h-8 w-8 rounded-full object-cover"
              />
              <span className="font-semibold text-lg text-[#3f3328]">Roller Coaster Cafe</span>
            </Link>

            <nav className="hidden md:flex items-center gap-6">
              <Link to="/dashboard" className="text-sm text-[#6b5f54] hover:text-[#b97844]">Home</Link>
              <Link to="/menu" className="text-sm text-[#6b5f54] hover:text-[#b97844]">Menu</Link>
              <Link to="/orders" className="text-sm text-[#6b5f54] hover:text-[#b97844]">Orders</Link>
              <Link to="/profile" className="text-sm text-[#6b5f54] hover:text-[#b97844]">Profile</Link>
              <Link to="/settings" className="text-sm text-[#6b5f54] hover:text-[#b97844]">Settings</Link>
            </nav>

            <button
              onClick={() => setCartOpen(true)}
              className="relative inline-flex items-center gap-1.5 rounded-full bg-[#b97844] px-3 py-1.5 text-sm font-semibold text-white hover:bg-[#9e6538] transition-all"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-1.5 6M17 13l1.5 6M9 21h6M12 15v6" />
              </svg>
              <span>Cart</span>
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 min-w-4 h-4 px-1 rounded-full bg-[#3f3328] text-white text-[10px]">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Title */}
        <div className="mb-8">
          <Link to="/settings" className="inline-flex items-center gap-2 text-sm text-[#6b5f54] hover:text-[#b97844] transition-colors mb-4">
            ? Back
          </Link>
          <h1 className="text-2xl font-bold text-[#3f3328]">Offers & Coupons</h1>
          <p className="text-sm text-[#6b5f54] mt-1">Save more on your favorite meals</p>
        </div>

        {/* Loading State */}
        {isLoading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[1,2,3,4,5,6].map(i => (
              <div key={i} className="bg-[#faf8f5] rounded-xl h-48 animate-pulse" />
            ))}
          </div>
        ) : activeOffers.length === 0 ? (
          /* Empty State */
          <div className="text-center py-16">
            <div className="w-20 h-20 mx-auto bg-[#faf8f5] rounded-full flex items-center justify-center mb-4">
              <Gift size={32} className="text-[#a0968c]" />
            </div>
            <h2 className="text-xl font-medium text-[#6b5f54] mb-2">No active offers</h2>
            <p className="text-sm text-[#a0968c] mb-6">Check back soon for new discounts and promotions</p>
            <Link 
              to="/menu" 
              className="inline-flex items-center gap-2 rounded-full bg-[#b97844] px-5 py-2 text-sm text-white hover:bg-[#9e6538] transition-all"
            >
              Browse Menu
            </Link>
          </div>
        ) : (
          <>
            {/* All Offers Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
              {paginatedOffers.map((offer) => (
                <div key={offer._id} className="bg-white border border-[#e8e0d6] rounded-xl p-5 hover:shadow-md transition-all">
                  {/* Offer Icon & Type */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-10 h-10 rounded-full bg-[#faf8f5] flex items-center justify-center">
                      <Percent size={18} className="text-[#b97844]" />
                    </div>
                    <span className="text-xs font-semibold text-[#b97844] bg-[#faf8f5] px-2 py-1 rounded-full">
                      {offer.type === 'percentage' ? `${offer.value}% OFF` : `₹${offer.value} OFF`}
                    </span>
                  </div>

                  {/* Offer Code */}
                  <div className="mb-3">
                    <p className="text-xs text-[#a0968c] uppercase tracking-wide">Coupon Code</p>
                    <p className="font-mono text-lg font-bold text-[#3f3328] tracking-wider">{offer.code}</p>
                  </div>

                  {/* Description */}
                  <p className="text-sm text-[#6b5f54] mb-4 line-clamp-2">
                    {offer.description || `Get ${offer.discountLabel} on your next order`}
                  </p>

                  {/* Min Order & Validity */}
                  <div className="space-y-2 mb-4">
                    {offer.minOrderAmount > 0 && (
                      <div className="flex items-center gap-2 text-xs text-[#a0968c]">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>Min. order ₹{offer.minOrderAmount}</span>
                      </div>
                    )}
                    {offer.endDate && (
                      <div className="flex items-center gap-2 text-xs text-[#a0968c]">
                        <Clock size={12} />
                        <span>Valid until {new Date(offer.endDate).toLocaleDateString()}</span>
                      </div>
                    )}
                  </div>

                  {/* Copy Button */}
                  <button
                    onClick={() => copyCode(offer.code)}
                    className={`w-full rounded-full py-2 text-sm font-medium transition-all ${
                      copiedCode === offer.code
                        ? 'bg-green-500 text-white'
                        : 'bg-[#b97844] text-white hover:bg-[#9e6538]'
                    }`}
                  >
                    {copiedCode === offer.code ? (
                      <span className="flex items-center justify-center gap-2">
                        <CheckCircle size={14} /> Copied!
                      </span>
                    ) : (
                      <span className="flex items-center justify-center gap-2">
                        <Copy size={14} /> Copy Code
                      </span>
                    )}
                  </button>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <>
                <div className="flex justify-center items-center gap-2 mt-10 pt-4 border-t border-[#e8e0d6]">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="w-9 h-9 rounded-full border border-[#e8e0d6] text-[#6b5f54] flex items-center justify-center hover:border-[#b97844] hover:text-[#b97844] disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  
                  <div className="flex gap-2">
                    {[...Array(totalPages)].map((_, i) => {
                      const pageNum = i + 1;
                      if (
                        pageNum === 1 ||
                        pageNum === totalPages ||
                        (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)
                      ) {
                        return (
                          <button
                            key={pageNum}
                            onClick={() => handlePageChange(pageNum)}
                            className={`w-9 h-9 rounded-full text-sm font-medium transition-all ${
                              currentPage === pageNum
                                ? 'bg-[#b97844] text-white'
                                : 'border border-[#e8e0d6] text-[#6b5f54] hover:border-[#b97844] hover:text-[#b97844]'
                            }`}
                          >
                            {pageNum}
                          </button>
                        );
                      }
                      if (pageNum === currentPage - 2 || pageNum === currentPage + 2) {
                        return <span key={pageNum} className="text-[#a0968c]">...</span>;
                      }
                      return null;
                    })}
                  </div>

                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="w-9 h-9 rounded-full border border-[#e8e0d6] text-[#6b5f54] flex items-center justify-center hover:border-[#b97844] hover:text-[#b97844] disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>

                {/* Showing info */}
                <div className="text-center text-xs text-[#a0968c] mt-4">
                  Showing {(currentPage - 1) * OFFERS_PER_PAGE + 1} - {Math.min(currentPage * OFFERS_PER_PAGE, activeOffers.length)} of {activeOffers.length} offers
                </div>
              </>
            )}
          </>
        )}

        {/* How to Use Section */}
        {activeOffers.length > 0 && (
          <div className="mt-10 pt-6 border-t border-[#e8e0d6]">
            <h3 className="font-semibold text-[#3f3328] mb-4">How to Use</h3>
            <div className="grid sm:grid-cols-3 gap-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[#faf8f5] text-[#b97844] flex items-center justify-center font-bold text-sm">1</div>
                <p className="text-sm text-[#6b5f54]">Copy the coupon code</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[#faf8f5] text-[#b97844] flex items-center justify-center font-bold text-sm">2</div>
                <p className="text-sm text-[#6b5f54]">Go to checkout</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[#faf8f5] text-[#b97844] flex items-center justify-center font-bold text-sm">3</div>
                <p className="text-sm text-[#6b5f54]">Apply code & save instantly</p>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer
      <footer className="border-t border-[#e8e0d6] bg-white py-4 mt-8">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <div className="flex flex-wrap items-center justify-center gap-4 mb-2">
            <Link to="/dashboard" className="text-xs text-[#a0968c] hover:text-[#b97844]">Home</Link>
            <Link to="/menu" className="text-xs text-[#a0968c] hover:text-[#b97844]">Menu</Link>
            <Link to="/orders" className="text-xs text-[#a0968c] hover:text-[#b97844]">Orders</Link>
            <Link to="/profile" className="text-xs text-[#a0968c] hover:text-[#b97844]">Profile</Link>
            <Link to="/settings" className="text-xs text-[#a0968c] hover:text-[#b97844]">Settings</Link>
          </div>
          <p className="text-xs text-[#a0968c]">© {new Date().getFullYear()} Roller Coaster Cafe</p>
        </div>
      </footer> */}

      <CustomerFooter />
      <CartDrawer isOpen={cartOpen} onClose={() => setCartOpen(false)} />
    </div>
  );
}