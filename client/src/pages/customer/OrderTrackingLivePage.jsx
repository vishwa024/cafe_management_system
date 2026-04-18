import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { io } from 'socket.io-client';
import toast from 'react-hot-toast';
import {
  ArrowLeft,
  Bike,
  Check,
  CheckCircle2,
  ChefHat,
  Clock3,
  Copy,
  MapPin,
  Navigation,
  PackageCheck,
  Phone,
  ShieldCheck,
  ShoppingBag,
  Table2,
  Truck,
} from 'lucide-react';
import api from '../../services/api';

const STATUS_FLOW = ['placed', 'confirmed', 'preparing', 'ready', 'out-for-delivery', 'delivered', 'completed'];

const ORDER_TYPE_META = {
  delivery: { icon: Truck, label: 'Delivery', color: 'bg-sky-100 text-sky-700' },
  'dine-in': { icon: Table2, label: 'Dine-In', color: 'bg-emerald-100 text-emerald-700' },
  takeaway: { icon: ShoppingBag, label: 'Takeaway', color: 'bg-violet-100 text-violet-700' },
  'pre-order': { icon: Clock3, label: 'Pre-Order', color: 'bg-orange-100 text-orange-700' },
};

const STATUS_META = {
  placed: { title: 'Order placed', desc: 'Your order request reached the cafe.', icon: Clock3, color: 'bg-slate-100 text-slate-700' },
  confirmed: { title: 'Order confirmed', desc: 'The cafe accepted your order.', icon: CheckCircle2, color: 'bg-emerald-100 text-emerald-700' },
  preparing: { title: 'Preparing', desc: 'The kitchen is preparing your food.', icon: ChefHat, color: 'bg-amber-100 text-amber-700' },
  ready: { title: 'Ready', desc: 'Your order is packed and ready for pickup or dispatch.', icon: PackageCheck, color: 'bg-blue-100 text-blue-700' },
  'out-for-delivery': { title: 'Out for delivery', desc: 'Your rider is heading to your address.', icon: Bike, color: 'bg-orange-100 text-orange-700' },
  delivered: { title: 'Delivered', desc: 'Your order has been delivered.', icon: Truck, color: 'bg-green-100 text-green-700' },
  completed: { title: 'Completed', desc: 'This order is complete.', icon: CheckCircle2, color: 'bg-green-100 text-green-700' },
  cancelled: { title: 'Cancelled', desc: 'This order was cancelled.', icon: Clock3, color: 'bg-red-100 text-red-700' },
};

const getSocketBaseUrl = () => (
  import.meta.env.VITE_SOCKET_URL
  || import.meta.env.VITE_API_URL?.replace('/api', '')
  || 'http://localhost:5000'
);

const toNumber = (value) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
};

const hasCoordinates = (location) => Number.isFinite(toNumber(location?.lat)) && Number.isFinite(toNumber(location?.lng));

const formatDateTime = (value) => {
  if (!value) return '-';
  return new Date(value).toLocaleString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
};

const formatRelativeTime = (value) => {
  if (!value) return 'Waiting for first update';
  const diffSeconds = Math.max(0, Math.floor((Date.now() - new Date(value).getTime()) / 1000));
  if (diffSeconds < 10) return 'Updated just now';
  if (diffSeconds < 60) return `Updated ${diffSeconds}s ago`;
  const diffMinutes = Math.floor(diffSeconds / 60);
  if (diffMinutes < 60) return `Updated ${diffMinutes}m ago`;
  const diffHours = Math.floor(diffMinutes / 60);
  return `Updated ${diffHours}h ago`;
};

const formatCurrency = (value) => `Rs. ${Number(value || 0).toLocaleString('en-IN')}`;

const formatCoordinates = (location) => {
  const readableLabel = String(location?.locationName || location?.address || '').trim();
  if (readableLabel) return readableLabel;
  const lat = toNumber(location?.lat);
  const lng = toNumber(location?.lng);
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return 'Waiting for live location';
  return `${lat.toFixed(5)}, ${lng.toFixed(5)}`;
};

const mergeNotifications = (existing = [], incoming = []) => {
  const deduped = new Map();
  [...existing, ...incoming].filter(Boolean).forEach((entry) => {
    const key = [
      entry.status || '',
      entry.title || '',
      entry.message || '',
      entry.sentAt ? new Date(entry.sentAt).toISOString() : '',
    ].join('|');
    if (!deduped.has(key)) deduped.set(key, entry);
  });
  return Array.from(deduped.values()).sort((a, b) => new Date(b.sentAt || 0) - new Date(a.sentAt || 0));
};

const buildMapEmbedUrl = (location) => {
  if (!hasCoordinates(location)) return '';
  return `https://maps.google.com/maps?q=${location.lat},${location.lng}&z=15&output=embed`;
};

const buildGoogleMapLink = (location) => {
  if (!hasCoordinates(location)) return '';
  return `https://www.google.com/maps?q=${location.lat},${location.lng}`;
};

const buildDirectionsLink = (origin, destination) => {
  if (!hasCoordinates(destination)) return '';
  const destinationPart = `${destination.lat},${destination.lng}`;
  if (!hasCoordinates(origin)) {
    return `https://www.google.com/maps/dir/?api=1&destination=${destinationPart}`;
  }
  return `https://www.google.com/maps/dir/?api=1&origin=${origin.lat},${origin.lng}&destination=${destinationPart}&travelmode=driving`;
};

const buildMovementEntry = (location, timestamp) => ({
  id: `${toNumber(location?.lat)}:${toNumber(location?.lng)}:${timestamp}`,
  title: 'Rider moved',
  message: `Latest rider position: ${formatCoordinates(location)}`,
  at: timestamp,
});

export default function OrderTrackingLivePage() {
  const { orderId } = useParams();
  const [liveOrder, setLiveOrder] = useState(null);
  const [movementFeed, setMovementFeed] = useState([]);
  const [copied, setCopied] = useState(false);
  const lastMovementKey = useRef('');

  const { data, isLoading } = useQuery({
    queryKey: ['order-track', orderId],
    queryFn: () => api.get(`/orders/${orderId}`).then((res) => res.data),
    retry: false,
    refetchInterval: 10000,
  });

  useEffect(() => {
    const nextOrder = data?.order || data;
    if (!nextOrder) return;
    setLiveOrder((prev) => ({
      ...(prev || {}),
      ...nextOrder,
      notificationLog: mergeNotifications(prev?.notificationLog, nextOrder.notificationLog),
    }));
  }, [data]);

  useEffect(() => {
    if (!orderId) return undefined;

    const socket = io(getSocketBaseUrl(), { withCredentials: true });
    const matchesOrder = (incomingOrderId) => String(incomingOrderId) === String(orderId);

    socket.on('connect', () => {
      socket.emit('join-room', { room: `order:${orderId}` });
    });

    socket.on('order-updated', (payload) => {
      if (!matchesOrder(payload.orderId)) return;
      setLiveOrder((prev) => ({
        ...(prev || {}),
        ...payload,
        notificationLog: mergeNotifications(prev?.notificationLog, payload.notificationLog),
      }));
    });

    socket.on('order-notification', (payload) => {
      if (!matchesOrder(payload.orderId)) return;
      setLiveOrder((prev) => ({
        ...(prev || {}),
        notificationLog: mergeNotifications(prev?.notificationLog, [payload]),
      }));
    });

    socket.on('agent-location', (payload) => {
      const nextLocation = {
        lat: payload.lat,
        lng: payload.lng,
        updatedAt: payload.timestamp ? new Date(payload.timestamp).toISOString() : new Date().toISOString(),
      };
      const movementKey = `${toNumber(payload.lat)}:${toNumber(payload.lng)}`;
      if (lastMovementKey.current !== movementKey) {
        lastMovementKey.current = movementKey;
        setMovementFeed((prev) => [
          buildMovementEntry(nextLocation, nextLocation.updatedAt),
          ...prev,
        ].slice(0, 10));
      }

      setLiveOrder((prev) => ({
        ...(prev || {}),
        liveLocation: nextLocation,
      }));
    });

    return () => {
      socket.emit('leave-room', { room: `order:${orderId}` });
      socket.close();
    };
  }, [orderId]);

  const order = liveOrder || data?.order || data;
  const currentStatus = order?.status || 'placed';
  const typeMeta = ORDER_TYPE_META[order?.orderType] || ORDER_TYPE_META.delivery;
  const TypeIcon = typeMeta.icon;
  const statusMeta = STATUS_META[currentStatus] || STATUS_META.placed;
  const StatusIcon = statusMeta.icon;
  const statusIndex = STATUS_FLOW.indexOf(currentStatus);
  const riderLocation = hasCoordinates(order?.liveLocation) ? order.liveLocation : null;
  const destinationLocation = hasCoordinates(order?.deliveryAddress) ? order.deliveryAddress : null;
  const trackingActive = order?.orderType === 'delivery' && currentStatus === 'out-for-delivery';

  const timelineSteps = useMemo(() => {
    if (currentStatus === 'cancelled') return ['placed', 'confirmed', 'cancelled'];
    return STATUS_FLOW.filter((step) => {
      if (order?.orderType !== 'delivery' && step === 'out-for-delivery') return false;
      if (order?.orderType === 'delivery' && step === 'completed') return false;
      if (['takeaway', 'dine-in', 'pre-order'].includes(order?.orderType) && step === 'delivered') return false;
      return true;
    });
  }, [currentStatus, order?.orderType]);

  const activityFeed = useMemo(() => {
    const notifications = mergeNotifications(order?.notificationLog, []).map((entry) => ({
      id: `${entry.status || 'note'}-${entry.sentAt || ''}-${entry.title || ''}`,
      title: entry.title || STATUS_META[entry.status]?.title || 'Order update',
      message: entry.message || STATUS_META[entry.status]?.desc || 'Status updated.',
      at: entry.sentAt,
    }));

    return [...movementFeed, ...notifications]
      .sort((a, b) => new Date(b.at || 0) - new Date(a.at || 0))
      .slice(0, 12);
  }, [movementFeed, order?.notificationLog]);

  const copyOTP = async () => {
    if (!order?.deliveryOTP) return;
    await navigator.clipboard.writeText(order.deliveryOTP);
    setCopied(true);
    toast.success('OTP copied');
    window.setTimeout(() => setCopied(false), 2000);
  };

  const statusTimeFor = (status) => {
    const found = order?.statusHistory?.find((entry) => entry.status === status);
    return found?.updatedAt || null;
  };

  const liveMessage = useMemo(() => {
    if (!trackingActive) return 'Tracking becomes live once your delivery partner starts the trip.';
    if (riderLocation) return 'Your rider is moving. The map refreshes from live location updates.';
    if (order?.deliveryAgent) return 'Your rider is assigned. Waiting for the first live location update.';
    return 'A delivery partner will appear here once the order is accepted.';
  }, [trackingActive, riderLocation, order?.deliveryAgent]);

  if (isLoading && !order) {
    return (
      <div className="min-h-screen bg-white">
        <main className="mx-auto max-w-5xl px-4 py-8">
          <div className="space-y-4 animate-pulse">
            <div className="h-32 rounded-2xl bg-gray-100" />
            <div className="h-96 rounded-2xl bg-gray-100" />
          </div>
        </main>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-white">
        <main className="mx-auto max-w-3xl px-4 py-10">
          <div className="rounded-2xl border border-gray-200 bg-white p-8 text-center">
            <p className="text-lg font-semibold text-gray-800">Order not found</p>
            <Link to="/orders" className="mt-4 inline-flex rounded-full bg-amber-600 px-5 py-2 text-sm font-semibold text-white">
              Back to orders
            </Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fffaf4]">
      <header className="sticky top-0 z-20 border-b border-amber-100 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
          <Link to="/dashboard" className="flex items-center gap-3">
            <img
              src="https://rollercoastercafe.com/assets/images/roller_logo.png"
              alt="Roller Coaster Cafe"
              className="h-9 w-9 rounded-full object-cover"
            />
            <div>
              <p className="text-sm font-semibold text-gray-900">Roller Coaster Cafe</p>
              <p className="text-xs text-gray-500">Live order tracking</p>
            </div>
          </Link>
          <Link to="/orders" className="text-sm font-medium text-amber-700 hover:text-amber-800">
            All orders
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-6">
        <Link to="/orders" className="mb-4 inline-flex items-center gap-2 text-sm text-gray-500 hover:text-amber-700">
          <ArrowLeft size={14} />
          Back to orders
        </Link>

        <section className="mb-6 rounded-[28px] border border-amber-100 bg-white p-6 shadow-sm">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="mb-3 flex flex-wrap items-center gap-2">
                <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${typeMeta.color}`}>
                  <TypeIcon size={13} />
                  {typeMeta.label}
                </span>
                <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${statusMeta.color}`}>
                  <StatusIcon size={13} />
                  {statusMeta.title}
                </span>
              </div>
              <h1 className="text-2xl font-bold text-gray-900">Order #{order.orderId}</h1>
              <p className="mt-1 text-sm text-gray-500">Placed on {formatDateTime(order.createdAt)}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Total</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(order.totalAmount)}</p>
              <p className="mt-1 text-xs uppercase tracking-[0.18em] text-gray-400">{order.paymentMethod}</p>
            </div>
          </div>
          <p className="mt-4 text-sm leading-6 text-gray-600">{statusMeta.desc}</p>
        </section>

        {trackingActive && order.deliveryOTP && (
          <section className="mb-6 rounded-[28px] border border-amber-200 bg-gradient-to-r from-amber-50 to-orange-50 p-5">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-amber-700 shadow-sm">
                  <ShieldCheck size={20} />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Delivery OTP</p>
                  <p className="text-sm text-gray-600">Share only with your delivery partner at handoff.</p>
                </div>
              </div>
              <div className="flex items-center gap-3 rounded-2xl bg-white px-4 py-3 shadow-sm">
                <p className="text-2xl font-bold tracking-[0.35em] text-gray-900">{order.deliveryOTP}</p>
                <button onClick={copyOTP} className="inline-flex items-center gap-2 rounded-full bg-amber-600 px-4 py-2 text-sm font-semibold text-white hover:bg-amber-700">
                  {copied ? <Check size={15} /> : <Copy size={15} />}
                  {copied ? 'Copied' : 'Copy'}
                </button>
              </div>
            </div>
          </section>
        )}

        {order.orderType === 'delivery' && (
          <section className="mb-6 overflow-hidden rounded-[28px] border border-gray-200 bg-white shadow-sm">
            <div className="border-b border-gray-100 bg-gradient-to-r from-[#fff5e8] to-[#fffaf4] px-5 py-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-gray-900">Live Map Tracking</p>
                  <p className="mt-1 text-sm text-gray-600">{liveMessage}</p>
                </div>
                <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ${riderLocation ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                  <span className={`h-2 w-2 rounded-full ${riderLocation ? 'bg-green-600' : 'bg-gray-400'}`} />
                  {riderLocation ? 'Live rider location' : 'Waiting for rider location'}
                </span>
              </div>
            </div>

            <div className="grid gap-5 p-5 lg:grid-cols-[1.2fr,0.8fr]">
              <div className="overflow-hidden rounded-[24px] border border-gray-200 bg-gray-50">
                {riderLocation || destinationLocation ? (
                  <iframe
                    title="Delivery tracking map"
                    src={buildMapEmbedUrl(riderLocation || destinationLocation)}
                    className="h-[320px] w-full border-0"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                ) : (
                  <div className="flex h-[320px] items-center justify-center px-6 text-center">
                    <div>
                      <MapPin size={34} className="mx-auto text-gray-300" />
                      <p className="mt-3 text-sm font-medium text-gray-700">Map will appear after the rider accepts the order.</p>
                      <p className="mt-1 text-sm text-gray-500">The customer view will start tracking movement as soon as location updates arrive.</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <div className="rounded-[24px] border border-gray-200 bg-[#fffaf5] p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-amber-100 text-amber-700">
                      <Bike size={20} />
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-gray-900">{order.deliveryAgent?.name || 'Delivery partner pending'}</p>
                      <p className="text-sm text-gray-500">{order.deliveryAgent?.vehicleType || 'Rider details will appear after acceptance.'}</p>
                    </div>
                  </div>
                  <div className="mt-4 grid gap-3">
                    <div className="rounded-2xl bg-white p-3">
                      <p className="text-xs uppercase tracking-[0.18em] text-gray-400">Current rider location</p>
                      <p className="mt-1 text-sm font-semibold text-gray-900">{formatCoordinates(riderLocation)}</p>
                      <p className="mt-1 text-xs text-gray-500">{formatRelativeTime(order.liveLocation?.updatedAt)}</p>
                    </div>
                    <div className="rounded-2xl bg-white p-3">
                      <p className="text-xs uppercase tracking-[0.18em] text-gray-400">Delivery address</p>
                      <p className="mt-1 text-sm text-gray-700">{order.deliveryAddress?.text || 'Address not available'}</p>
                    </div>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {order.deliveryAgent?.phone && (
                      <a href={`tel:${order.deliveryAgent.phone}`} className="inline-flex items-center gap-2 rounded-full border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 hover:border-amber-300 hover:text-amber-700">
                        <Phone size={14} />
                        Call rider
                      </a>
                    )}
                    {riderLocation && (
                      <a href={buildGoogleMapLink(riderLocation)} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full bg-amber-600 px-4 py-2 text-sm font-semibold text-white hover:bg-amber-700">
                        <Navigation size={14} />
                        Open live map
                      </a>
                    )}
                  </div>
                </div>

                <div className="rounded-[24px] border border-gray-200 bg-white p-4">
                  <p className="font-semibold text-gray-900">Rider activity</p>
                  <div className="mt-3 space-y-3">
                    {activityFeed.length ? activityFeed.map((item) => (
                      <div key={item.id} className="rounded-2xl bg-gray-50 p-3">
                        <div className="flex items-center justify-between gap-3">
                          <p className="text-sm font-semibold text-gray-800">{item.title}</p>
                          <span className="text-xs text-gray-400">{formatDateTime(item.at)}</span>
                        </div>
                        <p className="mt-1 text-sm text-gray-600">{item.message}</p>
                      </div>
                    )) : (
                      <div className="rounded-2xl bg-gray-50 p-3 text-sm text-gray-500">
                        Order updates and rider movement will appear here.
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        <section className="mb-6 rounded-[28px] border border-gray-200 bg-white p-5 shadow-sm">
          <p className="mb-5 font-semibold text-gray-900">Order timeline</p>
          <div className="space-y-4">
            {timelineSteps.map((status, index) => {
              const meta = STATUS_META[status];
              const Icon = meta.icon;
              const completed = statusIndex >= index;
              const current = status === currentStatus;

              return (
                <div key={status} className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className={`flex h-9 w-9 items-center justify-center rounded-full ${completed ? meta.color : 'bg-gray-100 text-gray-400'}`}>
                      <Icon size={16} />
                    </div>
                    {index < timelineSteps.length - 1 && (
                      <div className={`mt-1 h-10 w-0.5 ${completed ? 'bg-amber-200' : 'bg-gray-200'}`} />
                    )}
                  </div>
                  <div className="flex-1 pb-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className={`text-sm font-semibold ${completed ? 'text-gray-900' : 'text-gray-400'}`}>{meta.title}</p>
                      {current && <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[11px] font-semibold text-amber-700">Current</span>}
                      {statusTimeFor(status) && (
                        <span className="text-xs text-gray-400">{formatDateTime(statusTimeFor(status))}</span>
                      )}
                    </div>
                    <p className="mt-1 text-sm text-gray-500">{meta.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <div className="grid gap-5 lg:grid-cols-2">
          <section className="rounded-[28px] border border-gray-200 bg-white p-5 shadow-sm">
            <p className="mb-4 font-semibold text-gray-900">Order items</p>
            <div className="space-y-3">
              {(order.items || []).map((item, index) => (
                <div key={`${item.name || 'item'}-${index}`} className="flex items-center justify-between gap-4 border-b border-gray-100 pb-3 last:border-b-0 last:pb-0">
                  <div>
                    <p className="text-sm font-medium text-gray-800">{item.quantity} x {item.name}</p>
                    {item.variant && <p className="text-xs text-gray-400">{item.variant}</p>}
                  </div>
                  <p className="text-sm font-semibold text-gray-900">{formatCurrency(item.totalPrice || item.unitPrice * item.quantity)}</p>
                </div>
              ))}
            </div>
            <div className="mt-4 space-y-2 border-t border-gray-100 pt-4 text-sm">
              <div className="flex justify-between text-gray-500"><span>Subtotal</span><span>{formatCurrency(order.subtotal)}</span></div>
              <div className="flex justify-between text-gray-500"><span>Delivery fee</span><span>{formatCurrency(order.deliveryFee)}</span></div>
              <div className="flex justify-between text-gray-500"><span>Tax</span><span>{formatCurrency(order.taxAmount)}</span></div>
              <div className="flex justify-between font-semibold text-gray-900"><span>Total</span><span>{formatCurrency(order.totalAmount)}</span></div>
            </div>
          </section>

          <section className="rounded-[28px] border border-gray-200 bg-white p-5 shadow-sm">
            <p className="mb-4 font-semibold text-gray-900">{order.orderType === 'delivery' ? 'Delivery details' : 'Pickup details'}</p>
            {order.orderType === 'delivery' ? (
              <div className="space-y-4">
                <div className="rounded-2xl bg-gray-50 p-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-gray-400">Address</p>
                  <p className="mt-2 text-sm leading-6 text-gray-700">{order.deliveryAddress?.text || 'Address not available'}</p>
                </div>
                {destinationLocation && (
                  <a href={buildDirectionsLink(riderLocation, destinationLocation)} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full bg-gray-900 px-4 py-2 text-sm font-semibold text-white">
                    <Navigation size={14} />
                    Open delivery directions
                  </a>
                )}
              </div>
            ) : (
              <div className="rounded-2xl bg-gray-50 p-4 text-sm text-gray-600">
                Pickup details will stay here for non-delivery orders.
              </div>
            )}

            {order.specialNotes && (
              <div className="mt-4 rounded-2xl border border-amber-100 bg-amber-50 p-4 text-sm text-amber-800">
                <span className="font-semibold">Note:</span> {order.specialNotes}
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}
