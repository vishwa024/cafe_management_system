import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { MessageSquare, Star } from 'lucide-react';
import api from '../../services/api';

const formatReviewDate = (value) => {
  if (!value) return 'Recently';
  return new Date(value).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
};

export default function ReviewsPage() {
  const { data: menuItems = [], isLoading } = useQuery({
    queryKey: ['customer-reviews'],
    queryFn: () => api.get('/menu').then((res) => res.data),
  });

  const reviews = useMemo(() => {
    return menuItems.flatMap((item) =>
      (item.reviews || []).map((review, index) => ({
        key: `${item._id}-${review.user || review.customerName || index}`,
        itemName: item.name,
        itemId: item._id,
        image: item.image,
        rating: review.rating,
        comment: review.comment,
        customerName: review.customerName || 'Customer',
        createdAt: review.createdAt,
      }))
    ).sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
  }, [menuItems]);

  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-gray-100 bg-white sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
          <Link to="/dashboard" className="flex items-center gap-2">
            <img
              src="https://rollercoastercafe.com/assets/images/roller_logo.png"
              alt="Logo"
              className="h-8 w-8 rounded-full object-cover"
            />
            <span className="font-semibold text-lg text-gray-800">Roller Coaster Cafe</span>
          </Link>
          <Link to="/settings" className="text-sm text-gray-500 hover:text-amber-600">
            Back to settings
          </Link>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Customer Reviews</h1>
          <p className="text-sm text-gray-400 mt-1">See the real dish reviews that other customers have published.</p>
        </div>

        {isLoading ? (
          <div className="grid md:grid-cols-2 gap-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="h-40 rounded-xl border border-gray-100 bg-gray-50 animate-pulse" />
            ))}
          </div>
        ) : reviews.length === 0 ? (
          <div className="rounded-xl border border-gray-100 bg-[#faf8f5] px-6 py-10 text-center">
            <MessageSquare size={32} className="mx-auto text-[#b97844] mb-3" />
            <p className="font-medium text-[#3f3328]">No public reviews yet</p>
            <p className="text-sm text-[#6b5f54] mt-2">When customers review dishes, they will appear here for everyone.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {reviews.map((review) => (
              <div key={review.key} className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div>
                    <Link to={`/menu/item/${review.itemId}`} className="font-semibold text-[#3f3328] hover:text-[#b97844]">
                      {review.itemName}
                    </Link>
                    <p className="text-xs text-[#a0968c] mt-1">
                      {review.customerName} • {formatReviewDate(review.createdAt)}
                    </p>
                  </div>
                  <div className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-3 py-1 text-sm font-semibold text-amber-700">
                    <Star size={14} className="fill-current" />
                    {review.rating}
                  </div>
                </div>
                <p className="text-sm leading-6 text-[#6b5f54]">
                  {review.comment || 'Rated this item without a written comment.'}
                </p>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
