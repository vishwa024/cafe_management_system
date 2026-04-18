import { useEffect, useMemo, useRef, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import {
  AlertTriangle,
  BellRing,
  Bike,
  Camera,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  Clock3,
  Compass,
  IndianRupee,
  MapPin,
  Navigation,
  PanelLeftClose,
  PanelLeftOpen,
  Pencil,
  Eye,
  EyeOff,
  RefreshCw,
  ShoppingBag,
  Sparkles,
  LogOut,
  ShieldCheck,
  XCircle,
  UserCircle2,
  Truck,
  Phone,
  Package,
  Menu,
  Trash2,
  Archive,
  Wallet
} from 'lucide-react';
import { io } from 'socket.io-client';
import toast from 'react-hot-toast';
import { QRCodeSVG } from 'qrcode.react';
import api from '../../services/api';
import OTPInput from '../../components/shared/OTPInput';
import presenceService from '../../services/presenceService';

const formatCurrency = (value) => `₹${Number(value || 0)}`;
const formatTimestamp = (value) => (value ? new Date(value).toLocaleString() : '-');
const formatTime = (value) => (value ? new Date(value).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }) : '-');
const formatEta = (value) => (value ? new Date(value).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }) : 'Not set');
const formatLiveDate = (value) => new Date(value).toLocaleDateString('en-IN', {
  weekday: 'short',
  day: 'numeric',
  month: 'short',
  year: 'numeric',
});
const formatLiveClock = (value) => new Date(value).toLocaleTimeString('en-IN', {
  hour: 'numeric',
  minute: '2-digit',
  second: '2-digit',
});
const toNumber = (value) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
};
const hasCoordinates = (location) => Number.isFinite(toNumber(location?.lat)) && Number.isFinite(toNumber(location?.lng));
const formatCoordinates = (location) => (
  hasCoordinates(location)
    ? `${toNumber(location.lat).toFixed(5)}, ${toNumber(location.lng).toFixed(5)}`
    : 'Waiting for live location'
);
const formatLocationLabel = (location, fallbackAddress = '') => {
  const preferredLabel = String(
    location?.locationName
    || location?.address
    || fallbackAddress
    || ''
  ).trim();

  if (preferredLabel && preferredLabel.toLowerCase() !== 'null' && preferredLabel.toLowerCase() !== 'undefined') {
    return preferredLabel;
  }

  return formatCoordinates(location);
};
const formatLocationAge = (value) => {
  if (!value) return 'No live location yet';
  const diffSeconds = Math.max(0, Math.floor((Date.now() - new Date(value).getTime()) / 1000));
  if (diffSeconds < 10) return 'Updated just now';
  if (diffSeconds < 60) return `Updated ${diffSeconds}s ago`;
  const diffMinutes = Math.floor(diffSeconds / 60);
  return `Updated ${diffMinutes}m ago`;
};
const getLatestDeliveryRejection = (order) => {
  if (!Array.isArray(order?.deliveryRejections) || order.deliveryRejections.length === 0) {
    return null;
  }
  return order.deliveryRejections[order.deliveryRejections.length - 1];
};
const getDisplayOrderStatus = (order, activeTab) => {
  if (activeTab === 'history' && String(order?.status || '').toLowerCase() !== 'delivered' && getLatestDeliveryRejection(order)?.reason) {
    return 'cancelled';
  }
  return String(order?.status || '').toLowerCase();
};
const reverseGeocodeLocation = async (lat, lng) => {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1&accept-language=en`,
      {
        headers: {
          'Accept-Language': 'en',
          'User-Agent': 'RollerCoasterCafe/1.0',
        },
      }
    );

    if (!response.ok) return { locationName: '', address: '' };

    const data = await response.json();
    return {
      locationName: String(data?.name || data?.display_name || '').trim(),
      address: String(data?.display_name || '').trim(),
    };
  } catch {
    return { locationName: '', address: '' };
  }
};
const formatPaymentMethod = (value) => {
  const normalized = String(value || '').toLowerCase();
  if (normalized === 'cod') return 'COD';
  if (normalized === 'online') return 'Online';
  if (normalized === 'cash') return 'Cash';
  if (normalized === 'upi') return 'UPI';
  return normalized ? normalized.replace(/\b\w/g, (char) => char.toUpperCase()) : 'Pending';
};
const getDeliveryPaymentOptions = (order) => {
  const checkoutMethod = String(order?.paymentMethod || '').toLowerCase();
  if (checkoutMethod === 'cod') {
    return [
      { value: 'cash', label: 'Cash' },
      { value: 'upi', label: 'UPI Payment' },
    ];
  }
  return [
    { value: 'online', label: 'Online Payment' },
  ];
};
const getDeliveryPaymentSuccessText = (mode) => {
  if (mode === 'online') return 'Online payment successful';
  if (mode === 'upi') return 'UPI payment received successfully';
  return 'Cash payment received successfully';
};
const getDeliveryPaymentNote = (mode) => {
  if (mode === 'online') return 'Online payment verified from delivery QR';
  if (mode === 'upi') return 'UPI payment collected by delivery partner';
  return 'Cash payment collected by delivery partner';
};
const formatPaymentStatus = (order) => {
  const raw = String(order?.deliveryPayment?.status || order?.paymentStatus || 'pending').toLowerCase();
  return raw.replace(/\b\w/g, (char) => char.toUpperCase());
};
const buildOrderPaymentQr = (order) => {
  if (order?.deliveryPayment?.qrPayload) return order.deliveryPayment.qrPayload;
  const amount = Number(order?.totalAmount || 0).toFixed(2);
  return `upi://pay?pa=rollercoastercafe@upi&pn=${encodeURIComponent('Roller Coaster Cafe')}&am=${amount}&tn=${encodeURIComponent(`Order ${order?.orderId || ''} - ${order?.customer?.name || 'Customer'}`)}&cu=INR&tr=${encodeURIComponent(order?.orderId || '')}`;
};
const buildMapEmbedUrl = (location) => {
  if (!hasCoordinates(location)) return '';
  const freshnessToken = location?.updatedAt ? new Date(location.updatedAt).getTime() : Date.now();
  return `https://maps.google.com/maps?q=${location.lat},${location.lng}&z=15&output=embed&t=${freshnessToken}`;
};
const buildDirectionsLink = (origin, destination) => {
  if (!hasCoordinates(destination)) return '';
  const destinationPart = `${destination.lat},${destination.lng}`;
  if (!hasCoordinates(origin)) {
    return `https://www.google.com/maps/dir/?api=1&destination=${destinationPart}`;
  }
  return `https://www.google.com/maps/dir/?api=1&origin=${origin.lat},${origin.lng}&destination=${destinationPart}&travelmode=driving`;
};

const VEHICLE_TYPES = ['bike', 'scooter', 'cycle'];
const ORDERS_PER_PAGE = 10;
const getDefaultOrderFormState = () => ({
  etaMinutes: '30',
  delayReason: '',
  receiverName: '',
  photoUrl: '',
  proofNote: '',
  rejectReason: '',
  cancelReason: '',
  deliveryOTP: '',
  paymentMode: '',
  paymentReceived: false,
  photoName: '',
  isUploadingPhoto: false,
  showDeliveryForm: false,
});

// Correct delayed order calculation
function isDelayed(order) {
  if (order?.status !== 'out-for-delivery') return false;
  if (order?.deliveredAt) return false;
  if (!order?.estimatedDeliveryAt) return false;
  const fiveMinutesGrace = 5 * 60 * 1000;
  return new Date(order.estimatedDeliveryAt).getTime() + fiveMinutesGrace < Date.now();
}

function StatCard({ icon: Icon, label, value, color }) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-4 hover:shadow-md transition-all">
      <div className="flex items-center justify-between">
        <div className={`w-10 h-10 rounded-lg ${color} flex items-center justify-center`}>
          <Icon size={18} className="text-white" />
        </div>
        <span className="text-2xl font-bold text-gray-800">{value}</span>
      </div>
      <p className="text-sm text-gray-500 mt-2">{label}</p>
    </div>
  );
}

function ActivityRow({ item }) {
  const getIcon = () => {
    switch(item.type) {
      case 'delivered': return <CheckCircle size={14} className="text-green-600" />;
      case 'rejected': return <XCircle size={14} className="text-red-600" />;
      case 'picked-up': return <Truck size={14} className="text-blue-600" />;
      case 'eta-updated': return <Clock3 size={14} className="text-sky-600" />;
      default: return <BellRing size={14} className="text-amber-600" />;
    }
  };

  return (
    <div className="flex items-start gap-3 py-3 border-b border-gray-100 last:border-0">
      <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
        {getIcon()}
      </div>
      <div className="flex-1">
        <div className="flex items-center justify-between">
          <span className="font-mono text-sm font-semibold" style={{ color: '#b97844' }}>#{item.orderId}</span>
          <span className="text-xs text-gray-400">{new Date(item.at).toLocaleTimeString()}</span>
        </div>
        <p className="text-sm text-gray-700 mt-0.5">{item.customerName}</p>
        {item.note && <p className="text-xs text-gray-500 mt-1">{item.note}</p>}
      </div>
    </div>
  );
}

function LiveDateTimeBadge({ now, muted = false }) {
  return (
    <div className={`rounded-xl border px-3 py-2 text-right ${muted ? 'border-gray-200 bg-gray-50' : 'border-white/15 bg-white/10'}`}>
      <p className={`text-[11px] uppercase tracking-[0.18em] ${muted ? 'text-gray-400' : 'text-white/65'}`}>Current time</p>
      <p className={`mt-1 text-sm font-semibold ${muted ? 'text-gray-800' : 'text-white'}`}>{formatLiveClock(now)}</p>
      <p className={`text-xs ${muted ? 'text-gray-500' : 'text-white/70'}`}>{formatLiveDate(now)}</p>
    </div>
  );
}

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
    <div className="flex justify-center items-center gap-2 py-4 border-t border-gray-100 bg-gray-50">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-3 py-1.5 rounded-lg border border-gray-200 text-sm text-gray-600 hover:border-brown hover:text-brown disabled:opacity-40 transition-all"
      >
        Previous
      </button>
      <div className="flex gap-1">
        {getPageNumbers().map((page, idx) => (
          page === '...' ? (
            <span key={`dots-${idx}`} className="px-2 text-gray-400">...</span>
          ) : (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={`w-8 h-8 rounded-lg text-sm font-medium transition-all ${
                currentPage === page
                  ? 'text-white'
                  : 'border border-gray-200 text-gray-600 hover:border-brown hover:text-brown'
              }`}
              style={{ backgroundColor: currentPage === page ? '#b97844' : 'transparent' }}
            >
              {page}
            </button>
          )
        ))}
      </div>
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-3 py-1.5 rounded-lg border border-gray-200 text-sm text-gray-600 hover:border-brown hover:text-brown disabled:opacity-40 transition-all"
      >
        Next
      </button>
    </div>
  );
}

export default function DeliveryApp() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const lastGeocodeKeyRef = useRef('');
  const [activeTab, setActiveTab] = useState('assigned');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [orderForms, setOrderForms] = useState({});
  const [openOrderId, setOpenOrderId] = useState(null);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [profileForm, setProfileForm] = useState({ name: '', phone: '', vehicleType: 'bike', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [isManualRefreshing, setIsManualRefreshing] = useState(false);
  const [timerTick, setTimerTick] = useState(Date.now());
  const [currentPage, setCurrentPage] = useState(1);
  const [socket, setSocket] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  const [showBulkDelete, setShowBulkDelete] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [historyFilter, setHistoryFilter] = useState('today');
  const [selectedOrders, setSelectedOrders] = useState([]);

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['delivery-panel'],
    queryFn: () => api.get('/delivery/panel-data').then((r) => r.data),
    refetchInterval: 3000, // Refresh every 3 seconds to catch status changes
  });

  const agent = data?.agent;
  const isOnline = !!agent?.isOnline;
  const availableOrders = data?.availableOrders || [];
  const assignedOrders = data?.assignedOrders || [];
  const historyOrders = data?.historyOrders || [];
  const activity = data?.activity || [];
  
  const delayedCount = useMemo(() => {
    return assignedOrders.filter(order => isDelayed(order)).length;
  }, [assignedOrders, timerTick]);

  const stats = data?.stats || { 
    availableCount: 0, 
    assignedCount: 0, 
    completedToday: 0, 
    pickedToday: 0, 
    rejectedToday: 0, 
    delayedCount: 0, 
    earningsToday: 0, 
    tipsToday: 0, 
    averageRating: null 
  };
  const tabSummaries = data?.tabSummaries || {
    available: { orders: 0, earnings: 0, tips: 0 },
    assigned: { orders: 0, earnings: 0, tips: 0 },
    history: { orders: 0, earnings: 0, tips: 0 },
  };
  const historyRangeOrders = useMemo(() => {
    const nowDate = new Date();
    const startOfToday = new Date(nowDate);
    startOfToday.setHours(0, 0, 0, 0);
    const startOfYesterday = new Date(startOfToday);
    startOfYesterday.setDate(startOfYesterday.getDate() - 1);
    const startOfTomorrow = new Date(startOfToday);
    startOfTomorrow.setDate(startOfTomorrow.getDate() + 1);
    const startOfLastWeek = new Date(startOfToday);
    startOfLastWeek.setDate(startOfLastWeek.getDate() - 6);

    return historyOrders.filter((order) => {
      const relevantDate = new Date(
        order?.deliveredAt
        || getLatestDeliveryRejection(order)?.rejectedAt
        || order?.updatedAt
        || order?.createdAt
      );

      if (Number.isNaN(relevantDate.getTime())) {
        return historyFilter === 'all';
      }

      if (historyFilter === 'today') {
        return relevantDate >= startOfToday && relevantDate < startOfTomorrow;
      }

      if (historyFilter === 'yesterday') {
        return relevantDate >= startOfYesterday && relevantDate < startOfToday;
      }

      if (historyFilter === 'last7days') {
        return relevantDate >= startOfLastWeek && relevantDate < startOfTomorrow;
      }

      return relevantDate >= startOfToday && relevantDate < startOfTomorrow;
    });
  }, [historyFilter, historyOrders]);
  const historySummary = useMemo(() => historyRangeOrders.reduce((summary, order) => ({
    orders: summary.orders + 1,
    earnings: summary.earnings + Number(order?.deliveryPayout || 0),
    tips: summary.tips + Number(order?.tipAmount || 0),
    orderValue: summary.orderValue + Number(order?.totalAmount || 0),
  }), {
    orders: 0,
    earnings: 0,
    tips: 0,
    orderValue: 0,
  }), [historyRangeOrders]);

  // Update timer every second for countdown
  useEffect(() => {
    const timer = setInterval(() => setTimerTick(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    presenceService.initialize(undefined, 'delivery', 'Delivery Panel');

    return () => {
      void presenceService.cleanup();
    };
  }, []);

  useEffect(() => {
    if (!agent) return;
    setProfileForm({ name: agent.name || '', phone: agent.phone || '', vehicleType: agent.vehicleType || 'bike', password: '' });
  }, [agent]);

  // Socket connection for real-time updates
  useEffect(() => {
    const newSocket = io(import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000');
    
    newSocket.on('connect', () => {
      console.log('Connected to delivery socket');
      if (agent?._id) {
        newSocket.emit('join-room', { room: `delivery_${agent._id}` });
      }
      newSocket.emit('join-room', { room: 'delivery' });
    });
    
    newSocket.on('order-status-updated', (data) => {
      console.log('Order status updated:', data);
      queryClient.invalidateQueries({ queryKey: ['delivery-panel'] });
      
      if (data.status === 'out-for-delivery') {
        toast.success(`Order #${data.orderId} is now out for delivery!`);
      } else if (data.status === 'delivered') {
        toast.success(`Order #${data.orderId} has been delivered!`);
        // Force refetch to move order to history
        setTimeout(() => {
          refetch();
          setActiveTab('history');
        }, 500);
      }
    });
    
    newSocket.on('orderReadyForPickup', (payload) => {
      toast.success(`Order ${payload?.orderId || ''} is ready for pickup`);
      queryClient.invalidateQueries({ queryKey: ['delivery-panel'] });
    });
    
    newSocket.on('delivery-order-changed', () => {
      queryClient.invalidateQueries({ queryKey: ['delivery-panel'] });
    });

    newSocket.on('order-updated', () => {
      queryClient.invalidateQueries({ queryKey: ['delivery-panel'] });
    });
    
    newSocket.on('customer-tracking-update', (data) => {
      console.log('Customer tracking update sent:', data);
    });
    
    setSocket(newSocket);
    
    return () => {
      if (agent?._id) {
        newSocket.emit('leave-room', { room: `delivery_${agent._id}` });
      }
      newSocket.emit('leave-room', { room: 'delivery' });
      newSocket.close();
    };
  }, [queryClient, agent?._id, refetch]);

  // Location tracking with real-time updates to customer
  useEffect(() => {
    if (!isOnline || !navigator.geolocation || !assignedOrders.length) return;
    
    const activeOrder = assignedOrders.find((order) => order.status === 'out-for-delivery');
    if (!activeOrder) return;
    
    const watchId = navigator.geolocation.watchPosition(
      async ({ coords }) => {
        const roundedKey = `${coords.latitude.toFixed(4)},${coords.longitude.toFixed(4)}`;
        const locationMeta = lastGeocodeKeyRef.current === roundedKey
          ? {}
          : await reverseGeocodeLocation(coords.latitude, coords.longitude);

        lastGeocodeKeyRef.current = roundedKey;
        const locationData = { 
          orderId: activeOrder._id, 
          lat: coords.latitude, 
          lng: coords.longitude,
          ...locationMeta,
        };
        
        await api.post('/delivery/location', locationData).catch(() => {});
        
        if (socket && socket.connected) {
          socket.emit('delivery-location-update', {
            orderId: activeOrder._id,
            customerId: activeOrder.customer?._id,
            deliveryAgentId: agent?._id,
            location: {
              lat: coords.latitude,
              lng: coords.longitude,
              ...locationMeta,
            },
            timestamp: new Date().toISOString()
          });
        }
      },
      (error) => {
        console.error('Geolocation error:', error);
      },
      { enableHighAccuracy: true, maximumAge: 5000, timeout: 10000 }
    );
    
    return () => {
      navigator.geolocation.clearWatch(watchId);
    };
  }, [assignedOrders, isOnline, socket, agent?._id]);

  const toggleOnline = async () => {
    try {
      const response = await api.patch('/delivery/toggle-availability');
      queryClient.invalidateQueries({ queryKey: ['delivery-panel'] });
      toast.success(response.data.isOnline ? 'You are online' : 'You are offline');
      
      if (socket && socket.connected) {
        socket.emit('delivery-status-change', {
          agentId: agent?._id,
          isOnline: response.data.isOnline
        });
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not update availability');
    }
  };

  const handleAcceptOrder = async (order) => {
    try {
      const estimatedDeliveryAt = new Date(Date.now() + 25 * 60 * 1000);
      await api.patch(`/delivery/orders/${order._id}/pickup`, { estimatedDeliveryAt });
      
      toast.success('Order accepted! Delivery ETA: 25 minutes');
      
      if (socket && socket.connected) {
        socket.emit('order-accepted', { 
          orderId: order._id, 
          customerId: order.customer?._id,
          deliveryAgentId: agent?._id,
          estimatedDeliveryAt: estimatedDeliveryAt.toISOString()
        });
      }
      
      // Force refetch to update orders
      await refetch();
      setActiveTab('assigned');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not accept order');
    }
  };

  const handleRejectOrder = async (order) => {
    const formState = orderForms[order._id] || {};
    const trimmedReason = String(formState.rejectReason || '').trim();
    if (!trimmedReason) {
      toast.error('Please enter a reason for rejecting');
      return;
    }
    try {
      await api.patch(`/delivery/orders/${order._id}/reject`, { reason: trimmedReason });
      toast.success('Order rejected');
      
      if (socket && socket.connected) {
        socket.emit('order-rejected', { 
          orderId: order._id, 
          customerId: order.customer?._id,
          reason: trimmedReason
        });
      }
      
      // Force refetch to update orders
      await refetch();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not reject order');
    }
  };

  const handleDeliverOrder = async (order) => {
    const formState = orderForms[order._id] || {};
    const normalizedOtp = String(formState.deliveryOTP || '').replace(/\D/g, '').slice(0, 4);
    const paymentMode = String(formState.paymentMode || '').trim().toLowerCase();
    if (normalizedOtp.length !== 4) {
      toast.error('Enter 4-digit OTP');
      return;
    }
    if (!['cash', 'upi', 'online'].includes(paymentMode)) {
      toast.error('Choose cash, UPI, or online payment first');
      return;
    }
    if (!formState.paymentReceived) {
      toast.error(paymentMode === 'online' || paymentMode === 'upi' ? 'Confirm payment success first' : 'Mark payment received first');
      return;
    }
    try {
      await api.patch(`/delivery/orders/${order._id}/deliver`, {
        receiverName: formState.receiverName,
        proofNote: formState.proofNote,
        photoUrl: formState.photoUrl,
        deliveryOTP: normalizedOtp,
        paymentMethod: paymentMode,
        paymentReceived: true,
        paymentQrPayload: paymentMode === 'online' || paymentMode === 'upi' ? buildOrderPaymentQr(order) : '',
        paymentNote: getDeliveryPaymentNote(paymentMode),
      });

      toast.success(`${getDeliveryPaymentSuccessText(paymentMode)}. Order delivered.`);
      
      if (socket && socket.connected) {
        socket.emit('order-delivered', { 
          orderId: order._id, 
          customerId: order.customer?._id,
          deliveryAgentId: agent?._id,
          deliveredAt: new Date().toISOString()
        });
      }
      
      // IMPORTANT: Force refetch to move order to history
      await refetch();
      
      // Clear form state for this order
      setOrderForms(prev => {
        const newState = { ...prev };
        delete newState[order._id];
        return newState;
      });
      
      // Switch to history tab to show delivered order
      setActiveTab('history');
      setOpenOrderId(null);
      setCurrentPage(1);
      
      // Show additional success message
      setTimeout(() => {
        toast.success('Order has been moved to history');
      }, 1000);
    } catch (err) {
      console.error('Delivery error:', err);
      toast.error(err.response?.data?.message || 'Could not deliver order');
    }
  };

  // Delete order from assigned or history
  const handleDeleteOrder = async (orderId, orderStatus) => {
    try {
      await api.delete(`/delivery/orders/delete/${orderId}`);
      toast.success('Order deleted successfully');
      await refetch();
      setShowDeleteConfirm(null);
      setSelectedOrders([]);
      
      // If we're in assigned tab and order was deleted, refresh the list
      if (activeTab === 'assigned') {
        setActiveTab('assigned');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not delete order');
    }
  };

  // Delete multiple orders
  const handleBulkDelete = async () => {
    if (selectedOrders.length === 0) {
      toast.error('Please select orders to delete');
      return;
    }
    
    try {
      await Promise.all(
        selectedOrders.map((orderId) => api.delete(`/delivery/orders/delete/${orderId}`))
      );
      toast.success(`${selectedOrders.length} order(s) deleted successfully`);
      await refetch();
      setSelectedOrders([]);
      setShowBulkDelete(false);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not delete orders');
    }
  };

  // Clear all history
  const handleClearAllHistory = async () => {
    if (historyOrders.length === 0) {
      toast.error('No orders to delete');
      return;
    }
    
    try {
      await api.delete('/delivery/orders/clear-history');
      toast.success('All history cleared successfully');
      await refetch();
      setSelectedOrders([]);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not clear history');
    }
  };

  // Cancel/remove order from assigned (without delivering)
  const handleCancelAssignedOrder = async (order) => {
    const formState = orderForms[order._id] || {};
    const reason = formState.cancelReason || 'Order cancelled by rider';
    
    try {
      await api.patch(`/delivery/orders/${order._id}/cancel-assigned`, { reason });
      toast.success('Order removed from your list');
      await refetch();
      setOpenOrderId(null);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not cancel order');
    }
  };

  const handleFormChange = (orderId, field, value) => {
    setOrderForms((prev) => ({
      ...prev,
      [orderId]: {
        ...getDefaultOrderFormState(),
        ...(prev[orderId] || {}),
        [field]: value,
      },
    }));
  };

  const handleShowDeliveryForm = (orderId) => {
    setOrderForms((prev) => ({
      ...prev,
      [orderId]: {
        ...getDefaultOrderFormState(),
        ...(prev[orderId] || {}),
        showDeliveryForm: true,
        paymentMode: '',
        paymentReceived: false,
      },
    }));
  };

  const handleSelectPaymentMode = (orderId, mode) => {
    setOrderForms((prev) => ({
      ...prev,
      [orderId]: {
        ...getDefaultOrderFormState(),
        ...(prev[orderId] || {}),
        paymentMode: mode,
        paymentReceived: false,
        showDeliveryForm: true,
      },
    }));
  };

  const handleConfirmPayment = (orderId, mode) => {
    handleFormChange(orderId, 'paymentReceived', true);
    toast.success(getDeliveryPaymentSuccessText(mode));
  };

  const handleProofPhotoUpload = async (orderId, file) => {
    if (!file || !file.type?.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }
    const formData = new FormData();
    formData.append('photo', file);
    handleFormChange(orderId, 'isUploadingPhoto', true);
    try {
      const response = await api.post(`/delivery/orders/${orderId}/proof-photo`, formData);
      setOrderForms((prev) => ({
        ...prev,
        [orderId]: { ...(prev[orderId] || {}), photoUrl: response.data.photoUrl, photoName: file.name, isUploadingPhoto: false },
      }));
      toast.success('Photo uploaded');
    } catch (err) {
      handleFormChange(orderId, 'isUploadingPhoto', false);
      toast.error(err.response?.data?.message || 'Upload failed');
    }
  };

  const handleEtaUpdate = async (order) => {
    const formState = orderForms[order._id] || {};
    const minutes = Number(formState.etaMinutes || 30);
    const trimmedReason = String(formState.delayReason || '').trim();
    if (!trimmedReason) {
      toast.error('Enter a reason before updating ETA');
      return;
    }
    const estimatedDeliveryAt = new Date(Date.now() + minutes * 60 * 1000);
    try {
      await api.patch(`/delivery/orders/${order._id}/eta`, { 
        minutes, 
        delayReason: trimmedReason,
        estimatedDeliveryAt 
      });
      toast.success(`ETA updated to ${minutes} minutes`);
      queryClient.invalidateQueries({ queryKey: ['delivery-panel'] });
      
      if (socket && socket.connected) {
        socket.emit('eta-updated', { 
          orderId: order._id, 
          customerId: order.customer?._id,
          estimatedDeliveryAt: estimatedDeliveryAt.toISOString(),
          delayReason: trimmedReason
        });
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not update ETA');
    }
  };

  const handleProfileSave = async () => {
    try {
      await api.patch('/delivery/profile', {
        name: profileForm.name,
        phone: profileForm.phone,
        vehicleType: profileForm.vehicleType,
        password: profileForm.password,
      });
      queryClient.invalidateQueries({ queryKey: ['delivery-panel'] });
      setShowProfileModal(false);
      setProfileForm((prev) => ({ ...prev, password: '' }));
      toast.success('Profile updated');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not update profile');
    }
  };

  const handleLogout = async () => {
    setShowLogoutConfirm(false);
    try {
      await api.post('/auth/logout');
    } catch (_) {}
    localStorage.removeItem('token');
    navigate('/login');
  };

  const handleRefresh = async () => {
    setIsManualRefreshing(true);
    try {
      await refetch();
      toast.success('Refreshed');
    } catch (err) {
      toast.error('Could not refresh');
    } finally {
      setIsManualRefreshing(false);
    }
  };

  const getCurrentOrders = () => {
    if (activeTab === 'available') return availableOrders;
    if (activeTab === 'history') return historyRangeOrders;
    return assignedOrders;
  };

  const currentOrders = getCurrentOrders();
  const activeTabSummary = useMemo(() => (
    activeTab === 'history'
      ? historySummary
      : (tabSummaries[activeTab] || { orders: currentOrders.length, earnings: 0, tips: 0 })
  ), [activeTab, currentOrders.length, historySummary, tabSummaries]);
  const totalPages = Math.ceil(currentOrders.length / ORDERS_PER_PAGE);
  const paginatedOrders = currentOrders.slice((currentPage - 1) * ORDERS_PER_PAGE, currentPage * ORDERS_PER_PAGE);

  const focusOrder = assignedOrders.find((order) => order.status === 'out-for-delivery') || 
                     assignedOrders.find((order) => order.status === 'ready') ||
                     availableOrders[0] || 
                     null;
  const focusDestination = hasCoordinates(focusOrder?.deliveryAddress) ? focusOrder.deliveryAddress : null;
  const focusLiveLocation = hasCoordinates(focusOrder?.liveLocation) ? focusOrder.liveLocation : null;
  const now = timerTick;

  const initials = agent?.name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || 'DP';

  const brownColor = '#b97844';
  const brownDark = '#9e6538';
  const bgLight = '#fdf8f0';
  const sidebarBg = '#f5ede3';
  const sidebarBorder = '#e8e0d6';
  const headerDark = '#3f3328';

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    setCurrentPage(1);
    setSelectedOrders([]);
  }, [activeTab]);

  // Toggle order selection for bulk delete
  const toggleOrderSelection = (orderId) => {
    setSelectedOrders(prev => 
      prev.includes(orderId) 
        ? prev.filter(id => id !== orderId)
        : [...prev, orderId]
    );
  };

  // Select all orders in current page
  const selectAllOrders = () => {
    if (selectedOrders.length === paginatedOrders.length) {
      setSelectedOrders([]);
    } else {
      setSelectedOrders(paginatedOrders.map(order => order._id));
    }
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: bgLight }}>
      {/* Mobile Header */}
      <div className="lg:hidden sticky top-0 z-50 bg-white border-b border-gray-100 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <img src="https://rollercoastercafe.com/assets/images/roller_logo.png" alt="Logo" className="h-8 w-8 rounded-full object-cover" />
          <span className="font-semibold text-gray-800">Delivery Partner</span>
        </div>
        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 rounded-lg hover:bg-gray-100">
          <Menu size={20} />
        </button>
      </div>

      {/* Mobile Sidebar */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-40 bg-black/50" onClick={() => setMobileMenuOpen(false)}>
          <div className="w-80 bg-white h-full p-4" onClick={(e) => e.stopPropagation()}>
            <MobileSidebarContent agent={agent} stats={{...stats, assignedCount: assignedOrders.length, availableCount: availableOrders.length, delayedCount}} activity={activity} isOnline={isOnline} toggleOnline={toggleOnline} setShowLogoutConfirm={setShowLogoutConfirm} />
          </div>
        </div>
      )}

      <div className="flex">
        {/* Desktop Sidebar */}
        <aside className={`hidden lg:block w-80 shrink-0 min-h-screen border-r transition-all ${sidebarOpen ? 'block' : 'hidden'}`} style={{ backgroundColor: sidebarBg, borderColor: sidebarBorder }}>
          <DesktopSidebarContent agent={agent} stats={{...stats, assignedCount: assignedOrders.length, availableCount: availableOrders.length, delayedCount}} activity={activity} isOnline={isOnline} toggleOnline={toggleOnline} setShowLogoutConfirm={setShowLogoutConfirm} setShowProfileModal={setShowProfileModal} initials={initials} />
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 overflow-auto">
          {/* Top Bar */}
          <div className="rounded-xl overflow-hidden mb-6 shadow-md">
            <div className="px-6 py-4" style={{ backgroundColor: headerDark }}>
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-xl font-bold text-white">Delivery Dashboard</h1>
                  <p className="text-sm text-white/70">Manage your deliveries</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex rounded-lg bg-white/10 p-1">
                    <button onClick={() => !isOnline && toggleOnline()} className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${isOnline ? 'text-white' : 'text-white/60'}`} style={{ backgroundColor: isOnline ? brownColor : 'transparent' }}>Online</button>
                    <button onClick={() => isOnline && toggleOnline()} className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${!isOnline ? 'text-white' : 'text-white/60'}`} style={{ backgroundColor: !isOnline ? brownColor : 'transparent' }}>Offline</button>
                  </div>
                  <button onClick={handleRefresh} disabled={isManualRefreshing} className="p-2 rounded-lg bg-white/10 text-white hover:bg-white/20 transition-all">
                    <RefreshCw size={18} className={isManualRefreshing ? 'animate-spin' : ''} />
                  </button>
                  <button onClick={() => setSidebarOpen(!sidebarOpen)} className="hidden lg:block p-2 rounded-lg bg-white/10 text-white hover:bg-white/20 transition-all">
                    {sidebarOpen ? <PanelLeftClose size={18} /> : <PanelLeftOpen size={18} />}
                  </button>
                </div>
              </div>
            </div>
            <div className="px-6 py-3" style={{ backgroundColor: brownColor }}>
              <div className="flex items-center gap-6 text-sm text-white/90">
                <div className="flex items-center gap-2">
                  <ShoppingBag size={14} />
                  <span>Assigned: {assignedOrders.length}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Bike size={14} />
                  <span>Ready: {availableOrders.length}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock3 size={14} />
                  <span>Delayed: {delayedCount}</span>
                </div>
                <div className="flex items-center gap-2">
                  <IndianRupee size={14} />
                  <span>Today: {formatCurrency(stats.earningsToday)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <StatCard icon={ShoppingBag} label="Assigned Orders" value={assignedOrders.length} color="bg-blue-500" />
            <StatCard icon={Bike} label="Ready Orders" value={availableOrders.length} color="bg-green-500" />
            <StatCard icon={Clock3} label="Delayed" value={delayedCount} color="bg-red-500" />
            <StatCard icon={IndianRupee} label="Today's Earnings" value={formatCurrency(stats.earningsToday)} color="bg-amber-500" />
          </div>

          {/* Focus Order Card with Live Map */}
          {focusOrder && (
            <div className="rounded-xl p-5 text-white mb-6 shadow-lg" style={{ background: `linear-gradient(135deg, ${brownColor}, ${brownDark})` }}>
              <div className="grid gap-4 lg:grid-cols-[1fr,320px]">
                <div>
                  <p className="text-xs text-white/70 uppercase tracking-wide">Current Focus</p>
                  <p className="font-mono text-xl font-bold mt-1">#{focusOrder.orderId}</p>
                  <p className="text-white/80 text-sm mt-1">{focusOrder.customer?.name || 'Customer'}</p>
                  <div className="flex flex-wrap gap-2 mt-3">
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-white/20 text-xs">Payout {formatCurrency(focusOrder.deliveryPayout)}</span>
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-white/20 text-xs">Tip {formatCurrency(focusOrder.tipAmount)}</span>
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-white/20 text-xs">
                      {focusOrder.status === 'out-for-delivery' ? 'Live run' : 'Awaiting pickup'}
                    </span>
                  </div>
                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    <div className="rounded-xl bg-white/10 p-3">
                      <p className="text-xs uppercase tracking-wide text-white/60">Customer address</p>
                      <p className="mt-1 text-sm text-white/90">{focusOrder.deliveryAddress?.text || 'Address not available'}</p>
                    </div>
                    <div className="rounded-xl bg-white/10 p-3">
                      <p className="text-xs uppercase tracking-wide text-white/60">Live rider location</p>
                      <p className="mt-1 text-sm font-medium text-white">
                        {formatLocationLabel(focusOrder.liveLocation, focusOrder.deliveryAddress?.text)}
                      </p>
                      {hasCoordinates(focusOrder.liveLocation) && (
                        <p className="mt-1 text-xs text-white/75">{formatCoordinates(focusOrder.liveLocation)}</p>
                      )}
                      <p className="mt-1 text-xs text-white/60">{formatLocationAge(focusOrder.liveLocation?.updatedAt)}</p>
                    </div>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {focusDestination && (
                      <a
                        href={buildDirectionsLink(focusLiveLocation, focusDestination)}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold"
                        style={{ color: brownDark }}
                      >
                        <Navigation size={14} />
                        Open route
                      </a>
                    )}
                    {focusLiveLocation && (
                      <a
                        href={`https://www.google.com/maps?q=${focusLiveLocation.lat},${focusLiveLocation.lng}`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 rounded-full border border-white/40 px-4 py-2 text-sm font-semibold text-white"
                      >
                        <MapPin size={14} />
                        Rider live map
                      </a>
                    )}
                  </div>
                </div>
                <div className="overflow-hidden rounded-2xl border border-white/15 bg-white/10">
                  {focusLiveLocation || focusDestination ? (
                    <iframe
                      title="Focus delivery map"
                      src={buildMapEmbedUrl(focusLiveLocation || focusDestination)}
                      className="h-[240px] w-full border-0"
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                    />
                  ) : (
                    <div className="flex h-[240px] items-center justify-center px-6 text-center text-sm text-white/70">
                      Rider map appears here after location sharing starts.
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Tabs */}
          <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
            <div className="flex gap-1 border-b border-gray-200">
              {[
                { key: 'assigned', label: 'My Orders', count: assignedOrders.length, icon: Truck },
                { key: 'available', label: 'Ready Orders', count: availableOrders.length, icon: Package },
                { key: 'history', label: 'History', count: historyOrders.length, icon: Clock3 }
              ].map(tab => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.key}
                    onClick={() => { setActiveTab(tab.key); setCurrentPage(1); setOpenOrderId(null); setSelectedOrders([]); }}
                    className={`flex items-center gap-2 px-4 py-2 text-sm font-medium transition-all border-b-2 -mb-px ${activeTab === tab.key ? 'border-brown' : 'border-transparent hover:text-gray-700'}`}
                    style={{ color: activeTab === tab.key ? brownColor : '#6b7280', borderColor: activeTab === tab.key ? brownColor : 'transparent' }}
                  >
                    <Icon size={16} /> {tab.label} ({tab.count})
                  </button>
                );
              })}
            </div>
            {activeTab === 'history' && (
              <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-semibold uppercase tracking-wide text-amber-700">History Filter</span>
                  {[
                    { key: 'today', label: 'Today' },
                    { key: 'yesterday', label: 'Yesterday' },
                    { key: 'last7days', label: 'Last 7 Days' },
                  ].map((option) => (
                    <button
                      key={option.key}
                      type="button"
                      onClick={() => setHistoryFilter(option.key)}
                      className={`rounded-full px-3 py-1.5 text-xs font-semibold transition-all ${historyFilter === option.key ? 'text-white shadow-sm' : 'bg-white text-amber-700 hover:bg-amber-100'}`}
                      style={historyFilter === option.key ? { backgroundColor: brownColor } : {}}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
                <div className="mt-3 grid gap-3 sm:grid-cols-4">
                  <div>
                    <p className="text-[11px] uppercase tracking-wide text-amber-600">Orders</p>
                    <p className="mt-1 text-lg font-bold text-[#3f3328]">{historySummary.orders}</p>
                  </div>
                  <div>
                    <p className="text-[11px] uppercase tracking-wide text-amber-600">Earnings</p>
                    <p className="mt-1 text-lg font-bold text-[#3f3328]">{formatCurrency(historySummary.earnings)}</p>
                  </div>
                  <div>
                    <p className="text-[11px] uppercase tracking-wide text-amber-600">Tips</p>
                    <p className="mt-1 text-lg font-bold text-[#3f3328]">{formatCurrency(historySummary.tips)}</p>
                  </div>
                  <div>
                    <p className="text-[11px] uppercase tracking-wide text-amber-600">Order Value</p>
                    <p className="mt-1 text-lg font-bold text-[#3f3328]">{formatCurrency(historySummary.orderValue)}</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {activeTab !== 'history' && (
            <div className="mb-4 grid gap-3 md:grid-cols-3">
              <div className="rounded-xl border border-gray-100 bg-white p-4">
                <p className="text-xs uppercase tracking-wide text-gray-400">{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} orders</p>
                <p className="mt-2 text-2xl font-bold text-gray-800">{activeTabSummary.orders}</p>
              </div>
              <div className="rounded-xl border border-gray-100 bg-white p-4">
                <p className="text-xs uppercase tracking-wide text-gray-400">Total earnings</p>
                <p className="mt-2 text-2xl font-bold text-gray-800">{formatCurrency(activeTabSummary.earnings)}</p>
              </div>
              <div className="rounded-xl border border-gray-100 bg-white p-4">
                <p className="text-xs uppercase tracking-wide text-gray-400">Total tips</p>
                <p className="mt-2 text-2xl font-bold text-gray-800">{formatCurrency(activeTabSummary.tips)}</p>
              </div>
            </div>
          )}

          {activeTab === 'history' && (
            <div className="mb-4 rounded-xl border border-gray-100 bg-white p-4">
              <p className="text-sm font-semibold text-gray-800">History earnings summary</p>
              {/* <p className="mt-1 text-sm text-gray-500">The history list below now follows the selected filter and hides the old summary boxes.</p> */}
            </div>
          )}

          {/* Bulk Actions Bar - Show in both assigned and history tabs */}
          {(activeTab === 'history' || activeTab === 'assigned') && currentOrders.length > 0 && (
            <div className="bg-white rounded-xl border border-gray-100 p-3 mb-4 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <button
                  onClick={selectAllOrders}
                  className="text-sm text-gray-600 hover:text-brown transition-all"
                >
                  {selectedOrders.length === paginatedOrders.length ? 'Deselect All' : 'Select All'}
                </button>
                {selectedOrders.length > 0 && (
                  <span className="text-sm text-gray-500">{selectedOrders.length} selected</span>
                )}
              </div>
              <div className="flex gap-2">
                {selectedOrders.length > 0 && (
                  <button
                    onClick={() => setShowBulkDelete(true)}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-red-500 text-white text-sm hover:bg-red-600 transition-all"
                  >
                    <Trash2 size={14} />
                    Delete Selected ({selectedOrders.length})
                  </button>
                )}
                {activeTab === 'history' && historyOrders.length > 0 && (
                  <button
                    onClick={handleClearAllHistory}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-red-300 text-red-600 text-sm hover:bg-red-50 transition-all"
                  >
                    <Archive size={14} />
                    Clear All History
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Orders Table */}
          <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
            {isLoading ? (
              <div className="p-6 space-y-3">
                {[1,2,3].map(i => <div key={i} className="h-16 bg-gray-50 animate-pulse rounded-lg" />)}
              </div>
            ) : paginatedOrders.length === 0 ? (
              <div className="p-12 text-center">
                <Bike size={48} className="mx-auto text-gray-300 mb-3" />
                <p className="text-gray-500">No orders in this queue</p>
              </div>
            ) : (
              <>
                <div className="divide-y divide-gray-100">
                  {paginatedOrders.map((order) => {
                    const isOpen = openOrderId === order._id;
                    const formState = { ...(orderForms[order._id] || {}) };
                    const delayed = isDelayed(order);
                    const hasAddressCoordinates = hasCoordinates(order.deliveryAddress);
                    const hasLiveLocation = hasCoordinates(order.liveLocation);
                    const showDeliveryForm = formState.showDeliveryForm || false;
                    const isSelected = selectedOrders.includes(order._id);
                    const latestRejection = getLatestDeliveryRejection(order);
                    const displayStatus = getDisplayOrderStatus(order, activeTab);
                    
                    return (
                      <div key={order._id} className={isSelected ? 'bg-amber-50' : ''}>
                        {/* Order Row */}
                        <div className="px-4 py-3 hover:bg-gray-50 transition-all">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3 flex-1">
                              {/* Checkbox for assigned and history tabs */}
                              {(activeTab === 'history' || activeTab === 'assigned') && (
                                <input
                                  type="checkbox"
                                  checked={isSelected}
                                  onChange={() => toggleOrderSelection(order._id)}
                                  onClick={(e) => e.stopPropagation()}
                                  className="w-4 h-4 rounded border-gray-300 text-brown focus:ring-brown"
                                />
                              )}
                              <div onClick={() => setOpenOrderId(isOpen ? null : order._id)} className="flex-1 cursor-pointer">
                                <div className="flex items-center gap-3 flex-wrap">
                                  <span className="font-mono text-sm font-semibold" style={{ color: brownColor }}>#{order.orderId}</span>
                                  <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${
                                    displayStatus === 'delivered' ? 'bg-green-100 text-green-700' :
                                    displayStatus === 'out-for-delivery' ? 'bg-blue-100 text-blue-700' :
                                    displayStatus === 'cancelled' ? 'bg-red-100 text-red-700' :
                                    displayStatus === 'ready' ? 'bg-emerald-100 text-emerald-700' :
                                    'bg-gray-100 text-gray-700'
                                  }`}>
                                    {displayStatus === 'out-for-delivery' ? 'On The Road' : displayStatus.replace(/-/g, ' ')}
                                  </span>
                                  {delayed && <AlertTriangle size={12} className="text-red-500" title="Delayed Order" />}
                                  {order.status === 'out-for-delivery' && (
                                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs ${hasLiveLocation ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                                      <MapPin size={10} />
                                      {hasLiveLocation ? 'Live location active' : 'Waiting for location'}
                                    </span>
                                  )}
                                  <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${
                                    formatPaymentStatus(order) === 'Paid' ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-700'
                                  }`}>
                                    {formatPaymentMethod(order.deliveryPayment?.method || order.paymentMethod)} • {formatPaymentStatus(order)}
                                  </span>
                                </div>
                                <p className="font-medium text-gray-800 mt-1">{order.customer?.name || 'Guest'}</p>
                                <p className="text-xs text-gray-500 mt-0.5">{order.items?.length} items • {formatCurrency(order.totalAmount)}</p>
                                {latestRejection?.reason ? <p className="text-xs text-red-600 mt-1">Rejected: {latestRejection.reason}</p> : null}
                                {order.delayReason ? <p className="text-xs text-amber-700 mt-1">ETA reason: {order.delayReason}</p> : null}
                                {order.proofOfDelivery?.note ? <p className="text-xs text-emerald-700 mt-1">Delivery note: {order.proofOfDelivery.note}</p> : null}
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              {/* Delete button for both assigned and history tabs */}
                              {(activeTab === 'history' || activeTab === 'assigned') && (
                                <button
                                  onClick={() => setShowDeleteConfirm(order._id)}
                                  className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 transition-all"
                                  title="Delete order"
                                >
                                  <Trash2 size={16} />
                                </button>
                              )}
                              <button onClick={() => setOpenOrderId(isOpen ? null : order._id)} className="p-1">
                                <ChevronDown size={18} className={`text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* Expanded Details */}
                        {isOpen && (
                          <div className="border-t border-gray-100 bg-gray-50 p-4">
                            <div className="grid md:grid-cols-2 gap-4">
                              {/* Left Column - Order Info */}
                              <div className="space-y-3">
                                <div className="bg-white rounded-lg p-3 border border-gray-100">
                                  <p className="text-xs font-semibold mb-2" style={{ color: brownColor }}>Order Items</p>
                                  <div className="space-y-1 max-h-48 overflow-y-auto">
                                    {order.items?.map((item, idx) => (
                                      <div key={idx} className="flex justify-between text-sm">
                                        <span className="text-gray-600">x{item.quantity} {item.name}</span>
                                        <span className="font-medium">₹{item.totalPrice || item.unitPrice * item.quantity}</span>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                                <div className="bg-white rounded-lg p-3 border border-gray-100">
                                  <p className="text-xs font-semibold mb-2 flex items-center gap-1" style={{ color: brownColor }}>
                                    <Wallet size={12} />
                                    Payment Details
                                  </p>
                                  <div className="grid gap-2 text-sm text-gray-600">
                                    <div className="flex items-center justify-between">
                                      <span>Method</span>
                                      <span className="font-medium text-gray-800">{formatPaymentMethod(order.deliveryPayment?.method || order.paymentMethod)}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                      <span>Status</span>
                                      <span className={`font-medium ${formatPaymentStatus(order) === 'Paid' ? 'text-emerald-600' : 'text-amber-600'}`}>{formatPaymentStatus(order)}</span>
                                    </div>
                                    {order.paidAt ? (
                                      <div className="flex items-center justify-between">
                                        <span>Paid at</span>
                                        <span className="font-medium text-gray-800">{formatTimestamp(order.paidAt)}</span>
                                      </div>
                                    ) : null}
                                    {order.delayedAt ? (
                                      <div className="flex items-center justify-between">
                                        <span>Delayed at</span>
                                        <span className="font-medium text-red-600">{formatTimestamp(order.delayedAt)}</span>
                                      </div>
                                    ) : null}
                                  </div>
                                </div>
                                <div className="bg-white rounded-lg p-3 border border-gray-100">
                                  <p className="text-xs font-semibold mb-2 flex items-center gap-1" style={{ color: brownColor }}><MapPin size={12} /> Delivery Address</p>
                                  <p className="text-sm text-gray-600">{order.deliveryAddress?.text || 'No address'}</p>
                                </div>
                                {order.status === 'out-for-delivery' && activeTab !== 'history' && (
                                  <div className="bg-white rounded-lg p-3 border border-gray-100 overflow-hidden">
                                    <p className="text-xs font-semibold mb-3 flex items-center gap-1" style={{ color: brownColor }}>
                                      <Bike size={12} />
                                      Live Delivery Map
                                    </p>
                                    {hasLiveLocation || hasAddressCoordinates ? (
                                      <iframe
                                        title={`delivery-map-${order._id}`}
                                        src={buildMapEmbedUrl(hasLiveLocation ? order.liveLocation : order.deliveryAddress)}
                                        className="h-48 w-full rounded-lg border-0"
                                        loading="lazy"
                                        referrerPolicy="no-referrer-when-downgrade"
                                      />
                                    ) : (
                                      <div className="rounded-lg bg-gray-50 px-4 py-8 text-center text-sm text-gray-500">
                                        Waiting for live map data.
                                      </div>
                                    )}
                                  </div>
                                )}
                                {order.specialNotes && (
                                  <div className="bg-amber-50 rounded-lg p-3 text-sm text-amber-700">📝 {order.specialNotes}</div>
                                )}
                                {latestRejection?.reason && (
                                  <div className="rounded-lg border border-red-100 bg-red-50 p-3">
                                    <p className="text-xs font-semibold text-red-700">Latest rejection reason</p>
                                    <p className="mt-1 text-sm text-red-800">{latestRejection.reason}</p>
                                  </div>
                                )}
                                {(order.delayReason || order.proofOfDelivery?.note || order.proofOfDelivery?.receiverName) && (
                                  <div className="grid gap-3 md:grid-cols-2">
                                    {order.delayReason ? (
                                      <div className="bg-amber-50 rounded-lg border border-amber-100 p-3">
                                        <p className="text-xs font-semibold text-amber-700">Latest ETA reason</p>
                                        <p className="mt-1 text-sm text-amber-800">{order.delayReason}</p>
                                        {order.etaUpdatedAt ? <p className="mt-2 text-xs text-amber-600">{formatTimestamp(order.etaUpdatedAt)}</p> : null}
                                      </div>
                                    ) : null}
                                    {(order.proofOfDelivery?.note || order.proofOfDelivery?.receiverName) ? (
                                      <div className="bg-emerald-50 rounded-lg border border-emerald-100 p-3">
                                        <p className="text-xs font-semibold text-emerald-700">Delivery proof</p>
                                        {order.proofOfDelivery?.receiverName ? <p className="mt-1 text-sm text-emerald-900">Receiver: {order.proofOfDelivery.receiverName}</p> : null}
                                        {order.proofOfDelivery?.note ? <p className="mt-1 text-sm text-emerald-800">{order.proofOfDelivery.note}</p> : null}
                                        {order.proofOfDelivery?.submittedAt ? <p className="mt-2 text-xs text-emerald-600">{formatTimestamp(order.proofOfDelivery.submittedAt)}</p> : null}
                                      </div>
                                    ) : null}
                                  </div>
                                )}
                                {order.status === 'out-for-delivery' && activeTab !== 'history' && (
                                  <div className={`rounded-lg p-3 ${delayed ? 'bg-red-50' : 'bg-blue-50'}`}>
                                    <p className={`text-xs mb-1 ${delayed ? 'text-red-600' : 'text-blue-600'}`}>
                                      {delayed ? 'Delivery needs attention' : 'Live delivery tracking'}
                                    </p>
                                    <p className={`text-sm font-medium ${delayed ? 'text-red-700' : 'text-blue-700'}`}>
                                      {formatLocationLabel(order.liveLocation, order.deliveryAddress?.text)}
                                    </p>
                                    {hasCoordinates(order.liveLocation) && (
                                      <p className="mt-1 text-xs font-mono text-gray-500">
                                        {formatCoordinates(order.liveLocation)}
                                      </p>
                                    )}
                                    <p className={`text-xs mt-1 ${delayed ? 'text-red-500' : 'text-blue-500'}`}>
                                      {formatLocationAge(order.liveLocation?.updatedAt)}
                                    </p>
                                  </div>
                                )}
                              </div>

                              {/* Right Column - Actions */}
                              <div className="space-y-3">
                                {order.status === 'ready' && activeTab !== 'history' && (
                                  !showDeliveryForm ? (
                                    <div className="bg-white rounded-lg p-4 border border-gray-100">
                                      <p className="font-medium text-gray-800 mb-3">Order Actions</p>
                                      <div className="mb-3">
                                        <label className="text-xs text-gray-600 mb-1 block">Rejection Reason <span className="text-red-500">*</span></label>
                                        <input
                                          type="text"
                                          value={formState.rejectReason || ''}
                                          onChange={(e) => handleFormChange(order._id, 'rejectReason', e.target.value)}
                                          className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-amber-500"
                                          placeholder="Reason for rejecting..."
                                        />
                                      </div>
                                      <div className="flex gap-3">
                                        <button onClick={() => handleRejectOrder(order)} className="flex-1 flex items-center justify-center gap-2 rounded-lg border border-red-300 py-2 text-sm font-medium text-red-600 hover:bg-red-50 transition-all">
                                          <XCircle size={14} /> Reject
                                        </button>
                                        <button onClick={() => { handleAcceptOrder(order); handleShowDeliveryForm(order._id); }} className="flex-1 flex items-center justify-center gap-2 rounded-lg py-2 text-sm font-medium text-white transition-all" style={{ backgroundColor: brownColor }}>
                                          <CheckCircle size={14} /> Accept
                                        </button>
                                      </div>
                                    </div>
                                  ) : (
                                    <>
                                      <div className="bg-white rounded-lg p-3 border border-gray-100">
                                        <div className="flex items-center gap-2 mb-2"><Clock3 size={14} style={{ color: brownColor }} /><p className="text-xs font-semibold" style={{ color: brownColor }}>Update ETA</p></div>
                                        <div className="flex gap-2">
                                          <input type="number" min="5" max="180" value={formState.etaMinutes || 30} onChange={(e) => handleFormChange(order._id, 'etaMinutes', e.target.value)} className="flex-1 rounded-lg border border-gray-200 px-3 py-2 text-sm" placeholder="Minutes" />
                                          <input type="text" value={formState.delayReason || ''} onChange={(e) => handleFormChange(order._id, 'delayReason', e.target.value)} className="flex-1 rounded-lg border border-gray-200 px-3 py-2 text-sm" placeholder="Reason for ETA change" />
                                          <button onClick={() => handleEtaUpdate(order)} disabled={!String(formState.delayReason || '').trim()} className="px-3 py-2 rounded-lg text-white text-sm disabled:cursor-not-allowed disabled:opacity-50" style={{ backgroundColor: brownColor }}>Update</button>
                                        </div>
                                      </div>
                                      <div className="bg-white rounded-lg p-3 border border-gray-100">
                                        <div className="flex items-center gap-2 mb-3"><ShieldCheck size={14} style={{ color: brownColor }} /><p className="text-xs font-semibold" style={{ color: brownColor }}>Delivery Verification</p></div>
                                        <div className="space-y-2">
                                          <div>
                                            <p className="text-xs text-gray-600 mb-2">Payment Method</p>
                                            <div className={`grid gap-2 ${getDeliveryPaymentOptions(order).length > 1 ? 'grid-cols-2' : 'grid-cols-1'}`}>
                                              {getDeliveryPaymentOptions(order).map((option) => (
                                                <button
                                                  key={option.value}
                                                  type="button"
                                                  onClick={() => handleSelectPaymentMode(order._id, option.value)}
                                                  className={`rounded-lg border px-3 py-2 text-sm font-medium transition-all ${
                                                    formState.paymentMode === option.value
                                                      ? 'border-transparent text-white'
                                                      : 'border-gray-200 text-gray-600 hover:border-amber-300'
                                                  }`}
                                                  style={formState.paymentMode === option.value ? { backgroundColor: brownColor } : {}}
                                                >
                                                  {option.label}
                                                </button>
                                              ))}
                                            </div>
                                          </div>
                                          {(formState.paymentMode === 'online' || formState.paymentMode === 'upi') && (
                                            <div className="rounded-lg border border-amber-100 bg-amber-50 p-3">
                                              <p className="text-xs font-semibold text-amber-700">Customer Payment QR</p>
                                              <div className="mt-3 flex justify-center rounded-lg bg-white p-4">
                                                <QRCodeSVG value={buildOrderPaymentQr(order)} size={160} />
                                              </div>
                                              <button
                                                type="button"
                                                onClick={() => handleConfirmPayment(order._id, formState.paymentMode)}
                                                className={`mt-3 w-full rounded-lg px-3 py-2 text-sm font-medium transition-all ${
                                                  formState.paymentReceived ? 'bg-emerald-100 text-emerald-700' : 'text-white'
                                                }`}
                                                style={formState.paymentReceived ? {} : { backgroundColor: brownColor }}
                                              >
                                                {formState.paymentReceived ? 'Payment Successful' : `Confirm ${formState.paymentMode === 'upi' ? 'UPI' : 'Online'} Payment`}
                                              </button>
                                            </div>
                                          )}
                                          {formState.paymentMode === 'cash' && (
                                            <button
                                              type="button"
                                              onClick={() => handleConfirmPayment(order._id, 'cash')}
                                              className={`w-full rounded-lg px-3 py-2 text-sm font-medium transition-all ${
                                                formState.paymentReceived ? 'bg-emerald-100 text-emerald-700' : 'text-white'
                                              }`}
                                              style={formState.paymentReceived ? {} : { backgroundColor: brownColor }}
                                            >
                                              {formState.paymentReceived ? 'Payment Successful' : 'Cash Payment Received'}
                                            </button>
                                          )}
                                          <input type="text" value={formState.receiverName || ''} onChange={(e) => handleFormChange(order._id, 'receiverName', e.target.value)} className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm" placeholder="Receiver name" />
                                          <textarea value={formState.proofNote || ''} onChange={(e) => handleFormChange(order._id, 'proofNote', e.target.value)} className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm resize-none" rows={2} placeholder="Delivery notes" />
                                          <label className="flex items-center justify-center gap-2 w-full rounded-lg border border-dashed border-gray-300 py-2 text-sm text-gray-500 cursor-pointer hover:border-amber-500 hover:text-amber-500 transition-all">
                                            <Camera size={14} />
                                            {formState.photoName || 'Upload proof photo'}
                                            <input type="file" accept="image/*" className="hidden" onChange={(e) => { const file = e.target.files?.[0]; if (file) handleProofPhotoUpload(order._id, file); e.target.value = ''; }} />
                                          </label>
                                          <OTPInput length={4} value={formState.deliveryOTP || ''} onChange={(val) => handleFormChange(order._id, 'deliveryOTP', val.replace(/\D/g, ''))} />
                                        </div>
                                      </div>
                                    </>
                                  )
                                )}

                                {order.status === 'out-for-delivery' && activeTab !== 'history' && (
                                  <>
                                    <div className="bg-white rounded-lg p-3 border border-gray-100">
                                      <div className="flex items-center gap-2 mb-2"><Clock3 size={14} style={{ color: brownColor }} /><p className="text-xs font-semibold" style={{ color: brownColor }}>Update ETA</p></div>
                                      <div className="flex gap-2">
                                        <input type="number" min="5" max="180" value={formState.etaMinutes || 30} onChange={(e) => handleFormChange(order._id, 'etaMinutes', e.target.value)} className="flex-1 rounded-lg border border-gray-200 px-3 py-2 text-sm" placeholder="Minutes" />
                                        <input type="text" value={formState.delayReason || ''} onChange={(e) => handleFormChange(order._id, 'delayReason', e.target.value)} className="flex-1 rounded-lg border border-gray-200 px-3 py-2 text-sm" placeholder="Reason for ETA change" />
                                        <button onClick={() => handleEtaUpdate(order)} disabled={!String(formState.delayReason || '').trim()} className="px-3 py-2 rounded-lg text-white text-sm disabled:cursor-not-allowed disabled:opacity-50" style={{ backgroundColor: brownColor }}>Update</button>
                                      </div>
                                    </div>
                                    <div className="bg-white rounded-lg p-3 border border-gray-100">
                                      <div className="flex items-center gap-2 mb-3"><ShieldCheck size={14} style={{ color: brownColor }} /><p className="text-xs font-semibold" style={{ color: brownColor }}>Delivery Verification</p></div>
                                      <div className="space-y-2">
                                        <div>
                                          <p className="text-xs text-gray-600 mb-2">Payment Method</p>
                                          <div className={`grid gap-2 ${getDeliveryPaymentOptions(order).length > 1 ? 'grid-cols-2' : 'grid-cols-1'}`}>
                                            {getDeliveryPaymentOptions(order).map((option) => (
                                              <button
                                                key={option.value}
                                                type="button"
                                                onClick={() => handleSelectPaymentMode(order._id, option.value)}
                                                className={`rounded-lg border px-3 py-2 text-sm font-medium transition-all ${
                                                  formState.paymentMode === option.value
                                                    ? 'border-transparent text-white'
                                                    : 'border-gray-200 text-gray-600 hover:border-amber-300'
                                                }`}
                                                style={formState.paymentMode === option.value ? { backgroundColor: brownColor } : {}}
                                              >
                                                {option.label}
                                              </button>
                                            ))}
                                          </div>
                                        </div>
                                        {(formState.paymentMode === 'online' || formState.paymentMode === 'upi') && (
                                          <div className="rounded-lg border border-amber-100 bg-amber-50 p-3">
                                            <p className="text-xs font-semibold text-amber-700">Customer Payment QR</p>
                                            <div className="mt-3 flex justify-center rounded-lg bg-white p-4">
                                              <QRCodeSVG value={buildOrderPaymentQr(order)} size={160} />
                                            </div>
                                            <button
                                              type="button"
                                              onClick={() => handleConfirmPayment(order._id, formState.paymentMode)}
                                              className={`mt-3 w-full rounded-lg px-3 py-2 text-sm font-medium transition-all ${
                                                formState.paymentReceived ? 'bg-emerald-100 text-emerald-700' : 'text-white'
                                              }`}
                                              style={formState.paymentReceived ? {} : { backgroundColor: brownColor }}
                                            >
                                              {formState.paymentReceived ? 'Payment Successful' : `Confirm ${formState.paymentMode === 'upi' ? 'UPI' : 'Online'} Payment`}
                                            </button>
                                          </div>
                                        )}
                                        {formState.paymentMode === 'cash' && (
                                          <button
                                            type="button"
                                            onClick={() => handleConfirmPayment(order._id, 'cash')}
                                            className={`w-full rounded-lg px-3 py-2 text-sm font-medium transition-all ${
                                              formState.paymentReceived ? 'bg-emerald-100 text-emerald-700' : 'text-white'
                                            }`}
                                            style={formState.paymentReceived ? {} : { backgroundColor: brownColor }}
                                          >
                                            {formState.paymentReceived ? 'Payment Successful' : 'Cash Payment Received'}
                                          </button>
                                        )}
                                        <input type="text" value={formState.receiverName || ''} onChange={(e) => handleFormChange(order._id, 'receiverName', e.target.value)} className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm" placeholder="Receiver name" />
                                        <textarea value={formState.proofNote || ''} onChange={(e) => handleFormChange(order._id, 'proofNote', e.target.value)} className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm resize-none" rows={2} placeholder="Delivery notes" />
                                        <label className="flex items-center justify-center gap-2 w-full rounded-lg border border-dashed border-gray-300 py-2 text-sm text-gray-500 cursor-pointer hover:border-amber-500 hover:text-amber-500 transition-all">
                                          <Camera size={14} />
                                          {formState.photoName || 'Upload proof photo'}
                                          <input type="file" accept="image/*" className="hidden" onChange={(e) => { const file = e.target.files?.[0]; if (file) handleProofPhotoUpload(order._id, file); e.target.value = ''; }} />
                                        </label>
                                        <OTPInput length={4} value={formState.deliveryOTP || ''} onChange={(val) => handleFormChange(order._id, 'deliveryOTP', val.replace(/\D/g, ''))} />
                                      </div>
                                    </div>
                                  </>
                                )}

                                <div className="flex gap-2">
                                  {activeTab !== 'history' && hasAddressCoordinates && (
                                    <a href={buildDirectionsLink(order.liveLocation, order.deliveryAddress)} target="_blank" rel="noreferrer" className="flex-1 flex items-center justify-center gap-2 rounded-lg border py-2 text-sm font-medium transition-all" style={{ borderColor: brownColor, color: brownColor }}>
                                      <Navigation size={14} /> Open Route
                                    </a>
                                  )}
                                  {activeTab !== 'history' && hasLiveLocation && (
                                    <a href={`https://www.google.com/maps?q=${order.liveLocation.lat},${order.liveLocation.lng}`} target="_blank" rel="noreferrer" className="flex-1 flex items-center justify-center gap-2 rounded-lg border py-2 text-sm font-medium transition-all" style={{ borderColor: brownColor, color: brownColor }}>
                                      <MapPin size={14} /> Live Map
                                    </a>
                                  )}
                                  {((order.status === 'out-for-delivery' && activeTab !== 'history') || (order.status === 'ready' && showDeliveryForm)) && (
                                    <button onClick={() => handleDeliverOrder(order)} className="flex-1 rounded-lg py-2 text-sm font-medium text-white transition-all" style={{ backgroundColor: brownColor }}>
                                      Mark Delivered
                                    </button>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
                <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
              </>
            )}
          </div>
        </main>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setShowDeleteConfirm(null)}>
          <div className="w-full max-w-md bg-white rounded-xl shadow-xl p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                <Trash2 size={20} className="text-red-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-800">Delete Order</h2>
            </div>
            <p className="text-gray-600 mb-6">Are you sure you want to delete this order? This action cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={() => setShowDeleteConfirm(null)} className="flex-1 px-4 py-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition-all">
                Cancel
              </button>
              <button onClick={() => handleDeleteOrder(showDeleteConfirm)} className="flex-1 px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition-all">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bulk Delete Confirmation Modal */}
      {showBulkDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setShowBulkDelete(false)}>
          <div className="w-full max-w-md bg-white rounded-xl shadow-xl p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                <Trash2 size={20} className="text-red-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-800">Delete Selected Orders</h2>
            </div>
            <p className="text-gray-600 mb-6">Are you sure you want to delete {selectedOrders.length} order(s)? This action cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={() => setShowBulkDelete(false)} className="flex-1 px-4 py-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition-all">
                Cancel
              </button>
              <button onClick={handleBulkDelete} className="flex-1 px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition-all">
                Delete All Selected
              </button>
            </div>
          </div>
        </div>
      )}

      {showLogoutConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setShowLogoutConfirm(false)}>
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100">
                <LogOut size={18} className="text-red-600" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900">Confirm Logout</h2>
                <p className="text-sm text-gray-500">You will need to sign in again to open the delivery panel.</p>
              </div>
            </div>
            <div className="mt-6 flex gap-3">
              <button onClick={() => setShowLogoutConfirm(false)} className="flex-1 rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">Cancel</button>
              <button onClick={handleLogout} className="flex-1 rounded-lg bg-red-500 px-4 py-2 text-sm font-medium text-white hover:bg-red-600">Logout</button>
            </div>
          </div>
        </div>
      )}

      {/* Profile Modal */}
      {showProfileModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={(e) => e.target === e.currentTarget && setShowProfileModal(false)}>
          <div className="w-full max-w-md bg-white rounded-xl shadow-xl p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xl font-bold text-gray-800">Edit Profile</h2>
              <button onClick={() => setShowProfileModal(false)} className="p-2 rounded-lg hover:bg-gray-100"><XCircle size={18} className="text-gray-400" /></button>
            </div>
            <div className="space-y-4">
              <input value={profileForm.name} onChange={(e) => setProfileForm(p => ({ ...p, name: e.target.value }))} placeholder="Full Name" className="w-full rounded-lg border border-gray-200 p-3 text-sm focus:outline-none focus:ring-1 focus:ring-amber-500" />
              <input value={profileForm.phone} onChange={(e) => setProfileForm(p => ({ ...p, phone: e.target.value }))} placeholder="Phone" className="w-full rounded-lg border border-gray-200 p-3 text-sm focus:outline-none focus:ring-1 focus:ring-amber-500" />
              <select value={profileForm.vehicleType} onChange={(e) => setProfileForm(p => ({ ...p, vehicleType: e.target.value }))} className="w-full rounded-lg border border-gray-200 p-3 text-sm focus:outline-none focus:ring-1 focus:ring-amber-500">
                {VEHICLE_TYPES.map(type => <option key={type} value={type}>{type}</option>)}
              </select>
              <div className="relative">
                <input value={profileForm.password} onChange={(e) => setProfileForm(p => ({ ...p, password: e.target.value }))} type={showPassword ? 'text' : 'password'} placeholder="New Password (optional)" className="w-full rounded-lg border border-gray-200 p-3 text-sm focus:outline-none focus:ring-1 focus:ring-amber-500 pr-10" />
                <button onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">{showPassword ? <EyeOff size={16} /> : <Eye size={16} />}</button>
              </div>
              <div className="flex gap-3 pt-2">
                <button onClick={() => setShowProfileModal(false)} className="flex-1 px-4 py-2 rounded-lg border border-gray-200 text-gray-600">Cancel</button>
                <button onClick={handleProfileSave} className="flex-1 px-4 py-2 rounded-lg text-white" style={{ backgroundColor: brownColor }}>Save</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Desktop Sidebar Component
function DesktopSidebarContent({ agent, stats, activity, isOnline, toggleOnline, setShowLogoutConfirm, setShowProfileModal, initials }) {
  const brownColor = '#b97844';
  const cardBg = '#ffffff';
  const now = Date.now();

  return (
    <div className="h-full flex flex-col">
      <div className="p-5 border-b" style={{ borderColor: '#e8e0d6' }}>
        <div className="flex items-center gap-3">
          <img src="https://rollercoastercafe.com/assets/images/roller_logo.png" alt="Logo" className="h-10 w-10 rounded-full object-cover" />
          <div>
            <h1 className="font-semibold text-lg" style={{ color: '#3f3328' }}>Delivery Panel</h1>
            <p className="text-xs" style={{ color: '#8b7355' }}>Roller Coaster Cafe</p>
          </div>
        </div>
        <div className="mt-4">
          <LiveDateTimeBadge now={now} muted />
        </div>
      </div>

      <div className="p-5">
        <div className="rounded-xl p-4" style={{ backgroundColor: cardBg, border: '1px solid #e8e0d6' }}>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: brownColor }}>
                <span className="text-lg font-bold text-white">{initials}</span>
              </div>
              <div>
                <p className="font-semibold" style={{ color: '#3f3328' }}>{agent?.name || 'Delivery Partner'}</p>
                <p className="text-xs" style={{ color: '#8b7355' }}>{agent?.vehicleType || 'bike'} rider</p>
              </div>
            </div>
            <button onClick={() => setShowProfileModal(true)} className="p-1.5 rounded-lg hover:bg-gray-100">
              <Pencil size={14} style={{ color: brownColor }} />
            </button>
          </div>
          <div className="flex items-center justify-between pt-3 border-t" style={{ borderColor: '#e8e0d6' }}>
            <span className="text-sm" style={{ color: '#8b7355' }}>Status</span>
            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${isOnline ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${isOnline ? 'bg-green-600' : 'bg-red-600'}`}></span>
              {isOnline ? 'Online' : 'Offline'}
            </span>
          </div>
          <button onClick={toggleOnline} className="w-full mt-3 py-2 rounded-lg text-white text-sm font-medium" style={{ backgroundColor: brownColor }}>
            {isOnline ? 'Go Offline' : 'Go Online'}
          </button>
        </div>
      </div>

      <div className="px-5 grid grid-cols-2 gap-3">
        <div className="rounded-lg p-3" style={{ backgroundColor: cardBg, border: '1px solid #e8e0d6' }}>
          <p className="text-xs" style={{ color: '#8b7355' }}>Assigned</p>
          <p className="text-2xl font-bold" style={{ color: '#3f3328' }}>{stats.assignedCount}</p>
        </div>
        <div className="rounded-lg p-3" style={{ backgroundColor: cardBg, border: '1px solid #e8e0d6' }}>
          <p className="text-xs" style={{ color: '#8b7355' }}>Ready</p>
          <p className="text-2xl font-bold" style={{ color: '#3f3328' }}>{stats.availableCount}</p>
        </div>
        <div className="rounded-lg p-3" style={{ backgroundColor: cardBg, border: '1px solid #e8e0d6' }}>
          <p className="text-xs" style={{ color: '#8b7355' }}>Today's Tip</p>
          <p className="text-lg font-bold" style={{ color: '#3f3328' }}>{formatCurrency(stats.tipsToday)}</p>
        </div>
        <div className="rounded-lg p-3" style={{ backgroundColor: cardBg, border: '1px solid #e8e0d6' }}>
          <p className="text-xs" style={{ color: '#8b7355' }}>Delayed</p>
          <p className="text-2xl font-bold text-red-600">{stats.delayedCount}</p>
        </div>
      </div>

      <div className="m-5 rounded-xl p-4 text-white" style={{ background: `linear-gradient(135deg, ${brownColor}, #9e6538)` }}>
        <div className="flex items-center gap-2 mb-2"><IndianRupee size={14} className="text-white/70" /><span className="text-xs uppercase tracking-wide text-white/70">Today's Earnings</span></div>
        <p className="text-2xl font-bold">{formatCurrency(stats.earningsToday)}</p>
        <div className="mt-3 pt-3 border-t border-white/20 text-sm">
          <div className="flex justify-between"><span>Total Earnings</span><span className="font-semibold">{formatCurrency(agent?.totalEarnings)}</span></div>
          <div className="flex justify-between mt-1"><span>Completed Today</span><span className="font-semibold">{stats.completedToday}</span></div>
        </div>
      </div>

      <div className="flex-1 mx-5 mb-5 rounded-xl border overflow-hidden" style={{ backgroundColor: cardBg, borderColor: '#e8e0d6' }}>
        <div className="px-4 py-3 border-b" style={{ borderColor: '#e8e0d6' }}>
          <div className="flex items-center gap-2"><BellRing size={14} style={{ color: brownColor }} /><h3 className="font-semibold" style={{ color: '#3f3328' }}>Recent Activity</h3></div>
        </div>
        <div className="p-3 max-h-80 overflow-y-auto">
          {activity.length ? activity.map((item, idx) => <ActivityRow key={idx} item={item} />) : <p className="text-sm text-center py-4" style={{ color: '#a0968c' }}>No activity yet</p>}
        </div>
      </div>

      <div className="p-5 border-t" style={{ borderColor: '#e8e0d6' }}>
        <button onClick={() => setShowLogoutConfirm(true)} className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg border border-red-300 text-red-500 hover:bg-red-50 transition-all">
          <LogOut size={16} /> Logout
        </button>
      </div>
    </div>
  );
}

// Mobile Sidebar Content
function MobileSidebarContent({ agent, stats, activity, isOnline, toggleOnline, setShowLogoutConfirm }) {
  const brownColor = '#b97844';
  const now = Date.now();

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center gap-2 pb-4 border-b border-gray-100">
        <img src="https://rollercoastercafe.com/assets/images/roller_logo.png" alt="Logo" className="h-8 w-8 rounded-full object-cover" />
        <div>
          <h1 className="font-semibold text-gray-800">Delivery Panel</h1>
          <p className="text-xs text-gray-500">{agent?.name || 'Delivery Partner'}</p>
        </div>
      </div>
      <div className="mt-4">
        <LiveDateTimeBadge now={now} muted />
      </div>
      <div className="py-4">
        <div className="bg-gray-50 rounded-lg p-3 mb-3">
          <div className="flex justify-between mb-2"><span className="text-sm text-gray-500">Status</span><span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${isOnline ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{isOnline ? 'Online' : 'Offline'}</span></div>
          <button onClick={toggleOnline} className="w-full mt-2 py-2 rounded-lg text-white text-sm font-medium" style={{ backgroundColor: brownColor }}>{isOnline ? 'Go Offline' : 'Go Online'}</button>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div className="bg-gray-50 rounded-lg p-2"><p className="text-xs text-gray-500">Assigned</p><p className="text-xl font-bold">{stats.assignedCount}</p></div>
          <div className="bg-gray-50 rounded-lg p-2"><p className="text-xs text-gray-500">Ready</p><p className="text-xl font-bold">{stats.availableCount}</p></div>
          <div className="bg-gray-50 rounded-lg p-2"><p className="text-xs text-gray-500">Tips</p><p className="text-base font-bold">{formatCurrency(stats.tipsToday)}</p></div>
          <div className="bg-gray-50 rounded-lg p-2"><p className="text-xs text-gray-500">Delayed</p><p className="text-xl font-bold text-red-600">{stats.delayedCount}</p></div>
        </div>
      </div>
      <div className="flex-1">
        <div className="bg-gray-50 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-2"><BellRing size={14} style={{ color: brownColor }} /><h3 className="font-semibold text-sm">Activity</h3></div>
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {activity.length ? activity.map((item, idx) => <ActivityRow key={idx} item={item} />) : <p className="text-sm text-gray-400 text-center py-2">No activity</p>}
          </div>
        </div>
      </div>
      <button onClick={() => setShowLogoutConfirm(true)} className="mt-4 w-full py-2.5 rounded-lg border border-red-200 text-red-500 hover:bg-red-50">Logout</button>
    </div>
  );
}

// Update the handleDeleteOrder function in DeliveryApp.jsx
const handleDeleteOrder = async (orderId) => {
  try {
    console.log('Deleting order:', orderId);
    const response = await api.delete(`/delivery/orders/delete/${orderId}`);
    toast.success(response.data.message || 'Order deleted successfully');
    await refetch();
    setShowDeleteConfirm(null);
    setSelectedOrders([]);
  } catch (err) {
    console.error('Delete error:', err);
    toast.error(err.response?.data?.message || 'Could not delete order');
  }
};

// Update the handleBulkDelete function
const handleBulkDelete = async () => {
  if (selectedOrders.length === 0) {
    toast.error('Please select orders to delete');
    return;
  }
  
  try {
    await Promise.all(
      selectedOrders.map((orderId) => api.delete(`/delivery/orders/delete/${orderId}`))
    );
    toast.success(`${selectedOrders.length} order(s) deleted successfully`);
    await refetch();
    setSelectedOrders([]);
    setShowBulkDelete(false);
  } catch (err) {
    console.error('Bulk delete error:', err);
    toast.error(err.response?.data?.message || 'Could not delete orders');
  }
};

// Update the handleClearAllHistory function
const handleClearAllHistory = async () => {
  if (historyOrders.length === 0) {
    toast.error('No orders to delete');
    return;
  }
  
  try {
    const response = await api.delete('/delivery/orders/clear-history');
    toast.success(response.data.message || 'All history cleared successfully');
    await refetch();
    setSelectedOrders([]);
  } catch (err) {
    console.error('Clear history error:', err);
    toast.error(err.response?.data?.message || 'Could not clear history');
  }
};
