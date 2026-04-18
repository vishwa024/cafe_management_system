import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { BellRing, PackageCheck, ShoppingBag, Truck, CheckCircle, XCircle, ChefHat, ChevronLeft, ChevronRight, Trash2, Trash } from 'lucide-react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../../services/api';
import { selectCartCount } from '../../store/slices/cartSlice';
import CartDrawer from '../../components/customer/CartDrawer';

const NOTIFICATIONS_PER_PAGE = 10;

const getNotificationIcon = (status) => {
  switch (status) {
    case 'placed':
      return <ShoppingBag size={16} />;
    case 'confirmed':
      return <CheckCircle size={16} />;
    case 'preparing':
      return <ChefHat size={16} />;
    case 'ready':
      return <PackageCheck size={16} />;
    case 'out-for-delivery':
      return <Truck size={16} />;
    case 'delivered':
      return <CheckCircle size={16} />;
    case 'completed':
      return <CheckCircle size={16} />;
    case 'cancelled':
      return <XCircle size={16} />;
    default:
      return <BellRing size={16} />;
  }
};

const getNotificationColor = (status) => {
  switch (status) {
    case 'placed':
      return 'bg-amber-50 text-amber-600';
    case 'confirmed':
      return 'bg-blue-50 text-blue-600';
    case 'preparing':
      return 'bg-orange-50 text-orange-600';
    case 'ready':
      return 'bg-emerald-50 text-emerald-600';
    case 'out-for-delivery':
      return 'bg-indigo-50 text-indigo-600';
    case 'delivered':
      return 'bg-green-50 text-green-600';
    case 'completed':
      return 'bg-teal-50 text-teal-600';
    case 'cancelled':
      return 'bg-red-50 text-red-600';
    default:
      return 'bg-gray-50 text-gray-600';
  }
};

const formatDateTime = (date) => {
  if (!date) return '';
  const now = new Date();
  const notifDate = new Date(date);
  const diffMs = now - notifDate;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins} min ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  return notifDate.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
};

export default function NotificationsPage() {
  const cartCount = useSelector(selectCartCount);
  const [cartOpen, setCartOpen] = useState(false);
  const [filter, setFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteMode, setDeleteMode] = useState(false);
  const [selectedNotifications, setSelectedNotifications] = useState(new Set());
  const queryClient = useQueryClient();

  const { data: notifications = [], isLoading } = useQuery({
    queryKey: ['customer-notifications'],
    queryFn: () => api.get('/customer/notifications').then((res) => res.data),
  });

  // Delete single notification mutation
  const deleteNotificationMutation = useMutation({
    mutationFn: (notificationId) => api.delete(`/customer/notifications/${notificationId}`),
    onSuccess: () => {
      toast.success('Notification deleted');
      queryClient.invalidateQueries({ queryKey: ['customer-notifications'] });
      setSelectedNotifications(new Set());
      setDeleteMode(false);
    },
    onError: () => {
      toast.error('Failed to delete notification');
    },
  });

  // Delete multiple notifications mutation
  const deleteMultipleMutation = useMutation({
    mutationFn: (ids) => api.post('/customer/notifications/delete-many', { ids }),
    onSuccess: () => {
      toast.success(`${selectedNotifications.size} notification(s) deleted`);
      queryClient.invalidateQueries({ queryKey: ['customer-notifications'] });
      setSelectedNotifications(new Set());
      setDeleteMode(false);
    },
    onError: () => {
      toast.error('Failed to delete notifications');
    },
  });

  const filteredNotifications = notifications.filter(notification => {
    if (filter === 'all') return true;
    return notification.status === filter;
  });

  const totalPages = Math.ceil(filteredNotifications.length / NOTIFICATIONS_PER_PAGE);
  const paginatedNotifications = filteredNotifications.slice(
    (currentPage - 1) * NOTIFICATIONS_PER_PAGE,
    currentPage * NOTIFICATIONS_PER_PAGE
  );

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 300, behavior: 'smooth' });
  };

  const handleFilterChange = (value) => {
    setFilter(value);
    setCurrentPage(1);
    setDeleteMode(false);
    setSelectedNotifications(new Set());
  };

  const toggleSelectNotification = (notificationId) => {
    setSelectedNotifications(prev => {
      const newSet = new Set(prev);
      if (newSet.has(notificationId)) {
        newSet.delete(notificationId);
      } else {
        newSet.add(notificationId);
      }
      return newSet;
    });
  };

  const toggleSelectAll = () => {
    if (selectedNotifications.size === paginatedNotifications.length) {
      setSelectedNotifications(new Set());
    } else {
      setSelectedNotifications(new Set(paginatedNotifications.map(n => n.id)));
    }
  };

  const handleDeleteSelected = () => {
    if (selectedNotifications.size === 0) {
      toast.error('No notifications selected');
      return;
    }
    deleteMultipleMutation.mutate(Array.from(selectedNotifications));
  };

  const handleDeleteSingle = (notificationId) => {
    deleteNotificationMutation.mutate(notificationId);
  };

  const filterOptions = [
    { value: 'all', label: 'All' },
    { value: 'placed', label: 'Placed' },
    { value: 'confirmed', label: 'Confirmed' },
    { value: 'preparing', label: 'Preparing' },
    { value: 'ready', label: 'Ready' },
    { value: 'out-for-delivery', label: 'Out for Delivery' },
    { value: 'delivered', label: 'Delivered' },
    { value: 'cancelled', label: 'Cancelled' },
  ];

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

      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Title and Actions */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-[#3f3328]">Notifications</h1>
            <p className="text-sm text-[#6b5f54] mt-1">Stay updated on your order status</p>
          </div>
          
          <div className="flex gap-2">
            {!deleteMode ? (
              <button
                onClick={() => setDeleteMode(true)}
                className="inline-flex items-center gap-1.5 rounded-full border border-red-200 px-3 py-1.5 text-sm text-red-500 hover:bg-red-50 transition-all"
              >
                <Trash2 size={14} />
                Delete
              </button>
            ) : (
              <>
                <button
                  onClick={toggleSelectAll}
                  className="rounded-full border border-[#e8e0d6] px-3 py-1.5 text-sm text-[#6b5f54] hover:border-[#b97844] hover:text-[#b97844] transition-all"
                >
                  {selectedNotifications.size === paginatedNotifications.length ? 'Deselect All' : 'Select All'}
                </button>
                <button
                  onClick={handleDeleteSelected}
                  disabled={selectedNotifications.size === 0 || deleteMultipleMutation.isPending}
                  className="inline-flex items-center gap-1.5 rounded-full bg-red-500 px-3 py-1.5 text-sm text-white hover:bg-red-600 disabled:opacity-50 transition-all"
                >
                  <Trash size={14} />
                  Delete ({selectedNotifications.size})
                </button>
                <button
                  onClick={() => {
                    setDeleteMode(false);
                    setSelectedNotifications(new Set());
                  }}
                  className="rounded-full border border-[#e8e0d6] px-3 py-1.5 text-sm text-[#6b5f54] hover:border-[#b97844] hover:text-[#b97844] transition-all"
                >
                  Cancel
                </button>
              </>
            )}
          </div>
        </div>

        {/* Filter Chips */}
        <div className="flex flex-wrap gap-2 mb-6 pb-2 overflow-x-auto">
          {filterOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => handleFilterChange(option.value)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all whitespace-nowrap ${
                filter === option.value
                  ? 'bg-[#b97844] text-white'
                  : 'bg-[#faf8f5] text-[#6b5f54] hover:bg-[#e8e0d6]'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>

        {/* Loading State */}
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="bg-[#faf8f5] rounded-xl p-4 animate-pulse h-24" />
            ))}
          </div>
        ) : filteredNotifications.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-20 h-20 mx-auto bg-[#faf8f5] rounded-full flex items-center justify-center mb-4">
              <BellRing size={32} className="text-[#a0968c]" />
            </div>
            <h2 className="text-xl font-medium text-[#6b5f54] mb-2">No notifications</h2>
            <p className="text-sm text-[#a0968c] mb-6">You're all caught up! New alerts will appear here</p>
            <Link 
              to="/menu" 
              className="inline-flex items-center gap-2 rounded-full bg-[#b97844] px-5 py-2 text-sm text-white hover:bg-[#9e6538] transition-all"
            >
              Browse Menu
            </Link>
          </div>
        ) : (
          <>
            {/* Notifications List */}
            <div className="space-y-3">
              {paginatedNotifications.map((notification) => {
                const Icon = getNotificationIcon(notification.status);
                const colorClass = getNotificationColor(notification.status);
                const isSelected = selectedNotifications.has(notification.id);
                
                return (
                  <div 
                    key={notification.id} 
                    className={`bg-white border rounded-xl p-4 transition-all ${
                      isSelected ? 'border-[#b97844] bg-[#faf8f5]' : 'border-[#e8e0d6] hover:shadow-md'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      {/* Checkbox for delete mode */}
                      {deleteMode && (
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleSelectNotification(notification.id)}
                          className="mt-2 w-4 h-4 rounded border-[#e8e0d6] text-[#b97844] focus:ring-[#b97844]"
                        />
                      )}
                      
                      {/* Icon */}
                      <div className={`w-10 h-10 rounded-full ${colorClass} flex items-center justify-center shrink-0`}>
                        {Icon}
                      </div>
                      
                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-start justify-between gap-2">
                          <h3 className="font-semibold text-[#3f3328] text-sm">
                            {notification.title}
                          </h3>
                          <span className="text-xs text-[#a0968c] shrink-0">
                            {formatDateTime(notification.sentAt)}
                          </span>
                        </div>
                        <p className="text-sm text-[#6b5f54] mt-1 leading-relaxed">
                          {notification.message}
                        </p>
                        <div className="flex items-center gap-3 mt-2">
                          {notification.orderId && (
                            <Link 
                              to={`/track/${notification.orderDbId}`} 
                              className="text-xs text-[#b97844] hover:underline"
                            >
                              View Order →
                            </Link>
                          )}
                          {notification.orderType && (
                            <span className="text-xs text-[#a0968c] capitalize">
                              {notification.orderType}
                            </span>
                          )}
                          {!deleteMode && (
                            <button
                              onClick={() => handleDeleteSingle(notification.id)}
                              className="text-xs text-red-400 hover:text-red-600 transition-all"
                            >
                              Delete
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex flex-col items-center gap-3 mt-8 pt-4 border-t border-[#e8e0d6]">
                <div className="flex justify-center items-center gap-2">
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

                <div className="text-center text-xs text-[#a0968c]">
                  Showing {(currentPage - 1) * NOTIFICATIONS_PER_PAGE + 1} - {Math.min(currentPage * NOTIFICATIONS_PER_PAGE, filteredNotifications.length)} of {filteredNotifications.length} notifications
                </div>
              </div>
            )}
          </>
        )}
      </main>

      {/* Footer */}
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
      </footer>

      <CartDrawer isOpen={cartOpen} onClose={() => setCartOpen(false)} />
    </div>
  );
}
