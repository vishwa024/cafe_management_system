const express = require('express');
const fs = require('fs');
const multer = require('multer');
const path = require('path');
const crypto = require('crypto');
const { v2: cloudinary } = require('cloudinary');

const router = express.Router();
const { protect } = require('../middleware/auth');
const { allowRoles } = require('../middleware/roleCheck');
const Order = require('../models/Order');
const User = require('../models/User');
const { sendOrderSMS } = require('../services/smsService');
const { sendOrderStatusEmail } = require('../services/emailService');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const proofUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (file?.mimetype?.startsWith('image/')) return cb(null, true);
    return cb(new Error('Only image files are supported for delivery proof'));
  },
});

const uploadRoot = path.join(__dirname, '..', 'uploads', 'delivery-proof');
if (!fs.existsSync(uploadRoot)) {
  fs.mkdirSync(uploadRoot, { recursive: true });
}

const ACTIVE_DELIVERY_STATUSES = ['ready', 'out-for-delivery'];
const HISTORY_LIMIT = 12;
const DEFAULT_DELIVERY_MINUTES = 30;

const toNumber = (value) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
};

const getDistanceKm = (start, end) => {
  const lat1 = toNumber(start?.lat);
  const lng1 = toNumber(start?.lng);
  const lat2 = toNumber(end?.lat);
  const lng2 = toNumber(end?.lng);

  if (![lat1, lng1, lat2, lng2].every((item) => Number.isFinite(item))) return null;

  const toRadians = (deg) => (deg * Math.PI) / 180;
  const earthRadiusKm = 6371;
  const dLat = toRadians(lat2 - lat1);
  const dLng = toRadians(lng2 - lng1);
  const a = Math.sin(dLat / 2) ** 2
    + Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) * Math.sin(dLng / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return earthRadiusKm * c;
};

const getCafeCoordinates = () => {
  const lat = toNumber(process.env.CAFE_LAT || process.env.CAFE_LOCATION_LAT || process.env.STORE_LAT);
  const lng = toNumber(process.env.CAFE_LNG || process.env.CAFE_LOCATION_LNG || process.env.STORE_LNG);

  if (![lat, lng].every((item) => Number.isFinite(item))) return null;
  return { lat, lng };
};

const calculateAutomaticEtaMinutes = (order) => {
  const cafeCoordinates = getCafeCoordinates();
  const destination = order?.deliveryAddress;
  const distanceKm = getDistanceKm(cafeCoordinates, destination);

  if (!Number.isFinite(distanceKm)) return DEFAULT_DELIVERY_MINUTES;

  const averageCitySpeedKmPerHour = 22;
  const pickupBufferMinutes = 8;
  const trafficBufferMinutes = distanceKm > 6 ? 6 : distanceKm > 3 ? 4 : 2;
  const driveMinutes = (distanceKm / averageCitySpeedKmPerHour) * 60;
  return Math.min(90, Math.max(12, Math.round(driveMinutes + pickupBufferMinutes + trafficBufferMinutes)));
};

const buildOrderQuery = (filter = {}) => Order.find(filter)
  .populate('customer', 'name phone email')
  .populate('deliveryAgent', 'name phone isOnline vehicleType')
  .sort({ createdAt: -1 });

const startOfToday = () => {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  return now;
};

const buildEstimatedDeliveryAt = (minutes = DEFAULT_DELIVERY_MINUTES) => new Date(Date.now() + minutes * 60 * 1000);
const generateDeliveryOTP = () => String(Math.floor(1000 + Math.random() * 9000));
const normalizePaymentMethod = (value) => {
  const normalized = String(value || '').trim().toLowerCase();
  return ['cod', 'online', 'cash', 'upi'].includes(normalized) ? normalized : '';
};
const getDeliveryPaymentLabel = (value) => {
  const normalized = String(value || '').trim().toLowerCase();
  if (normalized === 'online') return 'Online payment';
  if (normalized === 'upi') return 'UPI payment';
  if (normalized === 'cash' || normalized === 'cod') return 'Cash payment';
  return 'Payment';
};
const buildPaymentQrPayload = (order) => {
  const amount = Number(order?.totalAmount || 0).toFixed(2);
  const orderLabel = encodeURIComponent(`Order ${order?.orderId || ''} - ${order?.customer?.name || 'Customer'}`);
  const payee = encodeURIComponent(String(process.env.CAFE_UPI_ID || 'kashishsolanki8082@okaxis').trim());
  return `upi://pay?pa=${payee}&pn=${encodeURIComponent('Roller Coaster Cafe')}&am=${amount}&tn=${orderLabel}&cu=INR&tr=${encodeURIComponent(order?.orderId || '')}`;
};
const buildNotificationEntry = (status, title, message, channels = ['push']) => ({
  status,
  title,
  message,
  channels,
  sentAt: new Date(),
});
const emitRealtimeNotification = (req, order, entry) => {
  const io = req.app.get('io');
  if (!io || !order || !entry) return;

  io.to(`order:${order._id}`).emit('order-notification', { orderId: order._id, ...entry });
  if (order.customer) {
    io.to(`user:${order.customer._id || order.customer}`).emit('order-notification', { orderId: order._id, ...entry });
  }
  io.emit('order-notification', { orderId: order._id, ...entry });
};

const isDelayedOrder = (order) => (
  order?.status === 'out-for-delivery'
  && order?.estimatedDeliveryAt
  && new Date(order.estimatedDeliveryAt) < new Date()
  && !order?.deliveredAt
);

const toActivityItem = (type, order, payload = {}) => ({
  id: `${type}-${order._id}-${payload.at || order.updatedAt}`,
  type,
  orderId: order.orderId,
  orderDbId: order._id,
  customerName: order.customer?.name || 'Customer',
  status: order.status,
  at: payload.at || order.updatedAt,
  note: payload.note || '',
  amount: payload.amount || 0,
});

const buildDeliveryActivity = (orders, agentId) => {
  const items = [];

  orders.forEach((order) => {
    (order.statusHistory || []).forEach((entry) => {
      if (!entry.updatedBy || entry.updatedBy.toString() !== agentId.toString()) return;
      const normalizedNote = String(entry.note || '').toLowerCase();

      if (normalizedNote.includes('eta updated')) {
        items.push(toActivityItem('eta-updated', order, {
          at: entry.updatedAt,
          note: entry.note || 'ETA updated',
        }));
      }

      if (entry.status === 'out-for-delivery') {
        items.push(toActivityItem('picked-up', order, {
          at: entry.updatedAt,
          note: entry.note || 'Picked up for delivery',
        }));
      }

      if (entry.status === 'delivered') {
        items.push(toActivityItem('delivered', order, {
          at: entry.updatedAt,
          note: entry.note || 'Delivered to customer',
          amount: order.deliveryPayout || 0,
        }));
      }
    });

    (order.deliveryRejections || []).forEach((entry) => {
      if (entry.agent?.toString() !== agentId.toString()) return;
      items.push(toActivityItem('rejected', order, {
        at: entry.rejectedAt,
        note: entry.reason || 'Rejected by delivery partner',
      }));
    });
  });

  return items.sort((a, b) => new Date(b.at) - new Date(a.at));
};

const buildHistoryOrders = (orders, agentId) => orders
  .filter((order) => {
    const wasAssignedToAgent = (order.deliveryAgent?._id || order.deliveryAgent)?.toString() === agentId.toString();
    const wasRejectedByAgent = (order.deliveryRejections || []).some((entry) => entry.agent?.toString() === agentId.toString());
    const wasReturnedByAgent = (order.statusHistory || []).some((entry) => (
      entry.updatedBy?.toString() === agentId.toString()
      && entry.status === 'ready'
      && String(entry.note || '').toLowerCase().includes('delivery cancelled by rider')
    ));

    return (
      (wasAssignedToAgent && ['delivered', 'cancelled'].includes(order.status))
      || wasRejectedByAgent
      || wasReturnedByAgent
    );
  })
  .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
  .slice(0, HISTORY_LIMIT);

const summarizeOrders = (orders = []) => orders.reduce((summary, order) => ({
  orders: summary.orders + 1,
  earnings: summary.earnings + Number(order?.deliveryPayout || 0),
  tips: summary.tips + Number(order?.tipAmount || 0),
}), {
  orders: 0,
  earnings: 0,
  tips: 0,
});

const emitOrderUpdate = (req, order, extra = {}) => {
  const io = req.app.get('io');
  if (!io || !order) return;

  const payload = {
    orderId: order._id,
    orderCode: order.orderId,
    orderType: order.orderType,
    status: order.status,
    deliveryAgent: order.deliveryAgent,
    liveLocation: order.liveLocation,
    estimatedDeliveryAt: order.estimatedDeliveryAt,
    delayReason: order.delayReason,
    delayedAt: order.delayedAt,
    proofOfDelivery: order.proofOfDelivery,
    deliveryRating: order.deliveryRating,
    notificationLog: order.notificationLog || [],
    paymentMethod: order.paymentMethod,
    paymentStatus: order.paymentStatus,
    paymentId: order.paymentId,
    paidAt: order.paidAt,
    paymentNote: order.paymentNote,
    deliveryPayment: order.deliveryPayment || {},
    ...extra,
  };

  io.to(`order:${order._id}`).emit('order-updated', payload);

  if (order.customer) {
    io.to(`user:${order.customer._id || order.customer}`).emit('order-updated', payload);
  }

  io.to('delivery').emit('delivery-order-changed', {
    orderId: order._id,
    status: order.status,
    deliveryAgentId: order.deliveryAgent?._id || order.deliveryAgent || null,
  });

  io.to('admin-map').emit('delivery-order-changed', {
    orderId: order._id,
    status: order.status,
    deliveryAgentId: order.deliveryAgent?._id || order.deliveryAgent || null,
  });
  io.emit('order-updated', payload);
};

const pushDeliveryNotification = async (req, order, status, title, message, channels = ['push', 'sms']) => {
  const entry = {
    status,
    title,
    message,
    channels,
    sentAt: new Date(),
  };

  order.notificationLog = [...(order.notificationLog || []), entry];
  await order.save();

  const io = req.app.get('io');
  if (io) {
    io.to(`order:${order._id}`).emit('order-notification', { orderId: order._id, ...entry });
    if (order.customer) {
      io.to(`user:${order.customer._id || order.customer}`).emit('order-notification', { orderId: order._id, ...entry });
    }
  }

  if (order.customer?.phone && channels.includes('sms')) {
    await sendOrderSMS(order.customer.phone, order, status, {
      deliveryOtp: order.deliveryOTP,
      trackUrl: `${(process.env.CLIENT_URL || process.env.FRONTEND_URL || 'http://localhost:5173').replace(/\/$/, '')}/track/${order._id}`,
    }).catch(() => null);
  }
  if (order.customer?.email && channels.includes('email') && status === 'out-for-delivery') {
    await sendOrderStatusEmail({
      email: order.customer.email,
      name: order.customer.name,
      order,
      title,
      message,
    }).catch(() => null);
  }
};

// ============= MAIN ROUTES =============

router.get('/panel-data', protect, allowRoles('delivery'), async (req, res) => {
  try {
    const today = startOfToday();

    const [agent, availableOrders, assignedOrders, agentOrders] = await Promise.all([
      User.findById(req.user._id).select('name phone isOnline vehicleType totalEarnings lastSeen'),
      buildOrderQuery({
        orderType: 'delivery',
        status: 'ready',
        deliveryRejections: {
          $not: {
            $elemMatch: { agent: req.user._id },
          },
        },
        $or: [{ deliveryAgent: null }, { deliveryAgent: { $exists: false } }],
        isDeleted: { $ne: true }
      }),
      buildOrderQuery({
        orderType: 'delivery',
        deliveryAgent: req.user._id,
        status: { $in: ACTIVE_DELIVERY_STATUSES },
        isDeleted: { $ne: true }
      }),
      Order.find({
        orderType: 'delivery',
        $or: [{ deliveryAgent: req.user._id }, { 'deliveryRejections.agent': req.user._id }],
        isDeleted: { $ne: true }
      })
        .populate('customer', 'name phone email')
        .populate('deliveryAgent', 'name phone isOnline vehicleType')
        .sort({ updatedAt: -1 }),
    ]);

    const activity = buildDeliveryActivity(agentOrders, req.user._id);
    const historyOrders = buildHistoryOrders(agentOrders, req.user._id);
    const todayActivity = activity.filter((item) => new Date(item.at) >= today);
    const deliveredToday = todayActivity.filter((item) => item.type === 'delivered');
    const rejectedToday = todayActivity.filter((item) => item.type === 'rejected');
    const pickedToday = todayActivity.filter((item) => item.type === 'picked-up');
    const delayedOrders = assignedOrders.filter((order) => isDelayedOrder(order));
    const tipsToday = deliveredToday.reduce((sum, item) => {
      const order = agentOrders.find((entry) => entry._id.toString() === item.orderDbId.toString());
      return sum + (order?.tipAmount || 0);
    }, 0);
    const payoutToday = deliveredToday.reduce((sum, item) => sum + (item.amount || 0), 0);
    const ratedOrders = historyOrders.filter((order) => order.deliveryRating?.score);
    const averageRating = ratedOrders.length
      ? (ratedOrders.reduce((sum, order) => sum + (order.deliveryRating?.score || 0), 0) / ratedOrders.length).toFixed(1)
      : null;

    res.json({
      agent,
      availableOrders,
      assignedOrders,
      activity: activity.slice(0, 20),
      historyOrders,
      stats: {
        availableCount: availableOrders.length,
        assignedCount: assignedOrders.length,
        completedToday: deliveredToday.length,
        pickedToday: pickedToday.length,
        rejectedToday: rejectedToday.length,
        delayedCount: delayedOrders.length,
        earningsToday: payoutToday,
        tipsToday,
        averageRating,
      },
      tabSummaries: {
        available: summarizeOrders(availableOrders),
        assigned: summarizeOrders(assignedOrders),
        history: summarizeOrders(historyOrders),
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.patch('/profile', protect, allowRoles('delivery'), async (req, res) => {
  try {
    const { name, phone, vehicleType, password } = req.body;
    const user = await User.findById(req.user._id).select('+password');

    if (!user) return res.status(404).json({ message: 'Delivery partner not found' });

    if (name !== undefined) {
      const trimmedName = String(name || '').trim();
      if (!trimmedName) return res.status(400).json({ message: 'Name is required' });
      user.name = trimmedName;
    }

    if (phone !== undefined) {
      const trimmedPhone = String(phone || '').trim();
      if (!trimmedPhone) return res.status(400).json({ message: 'Phone is required' });

      const existingUser = await User.findOne({
        _id: { $ne: user._id },
        phone: trimmedPhone,
      });

      if (existingUser) return res.status(409).json({ message: 'Phone already registered' });
      user.phone = trimmedPhone;
    }

    if (vehicleType !== undefined) {
      user.vehicleType = vehicleType || 'bike';
    }

    if (password !== undefined && String(password).trim()) {
      if (String(password).trim().length < 6) {
        return res.status(400).json({ message: 'Password must be at least 6 characters' });
      }
      user.password = String(password).trim();
    }

    await user.save();

    res.json({
      message: 'Profile updated successfully',
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        vehicleType: user.vehicleType,
        isOnline: user.isOnline,
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/my-orders', protect, allowRoles('delivery'), async (req, res) => {
  try {
    const orders = await buildOrderQuery({
      orderType: 'delivery',
      deliveryAgent: req.user._id,
      status: { $in: ACTIVE_DELIVERY_STATUSES },
      isDeleted: { $ne: true }
    });

    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.patch('/toggle-availability', protect, allowRoles('delivery'), async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    user.isOnline = !user.isOnline;
    user.lastSeen = new Date();
    await user.save();

    const io = req.app.get('io');
    if (io) {
      io.to('admin-map').emit('agent-status', { agentId: user._id, isOnline: user.isOnline });
      io.to('delivery').emit('agent-status', { agentId: user._id, isOnline: user.isOnline });
    }

    res.json({ isOnline: user.isOnline, lastSeen: user.lastSeen });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/location', protect, allowRoles('delivery'), async (req, res) => {
  try {
    const { orderId, lat, lng, locationName, address } = req.body;

    if (!orderId || typeof lat !== 'number' || typeof lng !== 'number') {
      return res.status(400).json({ message: 'orderId, lat and lng are required' });
    }

    const order = await Order.findById(orderId)
      .populate('customer', 'name phone email')
      .populate('deliveryAgent', 'name phone isOnline vehicleType');

    if (!order) return res.status(404).json({ message: 'Order not found' });
    if (!order.deliveryAgent || order.deliveryAgent._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'You can only update location for your assigned orders' });
    }

    order.liveLocation = {
      lat,
      lng,
      locationName: String(locationName || '').trim(),
      address: String(address || '').trim(),
      updatedAt: new Date(),
    };
    await order.save();

    await User.findByIdAndUpdate(req.user._id, {
      lastKnownLocation: { lat, lng, updatedAt: new Date() },
      lastSeen: new Date(),
    });

    emitOrderUpdate(req, order, { liveLocation: order.liveLocation });

    const io = req.app.get('io');
    if (io) {
      io.to(`order:${orderId}`).emit('agent-location', { agentId: req.user._id, lat, lng, timestamp: Date.now() });
      io.to('admin-map').emit('agent-location', { agentId: req.user._id, lat, lng, orderId });
    }

    res.json({ ok: true, liveLocation: order.liveLocation });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ============= ORDER ACTION ROUTES =============

// Accept/Pickup order
router.patch('/orders/:id/pickup', protect, allowRoles('delivery'), async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('customer', 'name phone email')
      .populate('deliveryAgent', 'name phone isOnline vehicleType');

    if (!order) return res.status(404).json({ message: 'Order not found' });
    if (order.orderType !== 'delivery') return res.status(400).json({ message: 'Only delivery orders can be picked up by riders' });
    if (!['ready', 'out-for-delivery'].includes(order.status)) return res.status(400).json({ message: 'Order is not ready for pickup' });
    if (order.deliveryAgent && order.deliveryAgent._id.toString() !== req.user._id.toString()) {
      return res.status(409).json({ message: 'This order is already assigned to another delivery partner' });
    }

    order.deliveryAgent = req.user._id;
    order.status = 'out-for-delivery';
    order.pickedUpAt = new Date();
    const automaticEtaMinutes = calculateAutomaticEtaMinutes(order);

    order.deliveryOTP = order.deliveryOTP || generateDeliveryOTP();
    order.estimatedDeliveryAt = buildEstimatedDeliveryAt(automaticEtaMinutes);
    order.estimatedDurationMinutes = automaticEtaMinutes;
    order.etaUpdatedAt = new Date();
    order.delayedAt = null;
    order.delayReason = '';

    order.statusHistory = [...(order.statusHistory || []), {
      status: 'out-for-delivery',
      updatedAt: new Date(),
      updatedBy: req.user._id,
      note: 'Picked up by delivery partner',
    }];
    await order.save();
    await order.populate('deliveryAgent', 'name phone isOnline vehicleType');

    try {
      emitOrderUpdate(req, order, { message: 'Order picked up and on the way' });
      await pushDeliveryNotification(
        req,
        order,
        'out-for-delivery',
        'Rider is on the way',
      `Your delivery partner has picked up the order and is heading to you. Estimated arrival is about ${automaticEtaMinutes} minutes. Your OTP is ${order.deliveryOTP}. Share it only at handoff. Track here: ${`${(process.env.CLIENT_URL || process.env.FRONTEND_URL || 'http://localhost:5173').replace(/\/$/, '')}/track/${order._id}`}.`,
      ['push', 'email', 'sms']
      );
    } catch (notifyErr) {
      console.error('Delivery pickup notification failed:', notifyErr.message);
    }

    res.json(order);
  } catch (err) {
    console.error('Delivery pickup failed:', err);
    res.status(500).json({ message: err.message });
  }
});

// Reject order
router.patch('/orders/:id/reject', protect, allowRoles('delivery'), async (req, res) => {
  try {
    const { reason } = req.body;
    const order = await Order.findById(req.params.id)
      .populate('customer', 'name phone email')
      .populate('deliveryAgent', 'name phone isOnline vehicleType');

    if (!order) return res.status(404).json({ message: 'Order not found' });
    if (order.orderType !== 'delivery' || order.status !== 'ready') return res.status(400).json({ message: 'Only ready delivery orders can be rejected' });
    if (order.deliveryAgent && order.deliveryAgent._id.toString() !== req.user._id.toString()) {
      return res.status(409).json({ message: 'This order is already assigned to another delivery partner' });
    }

    const alreadyRejected = (order.deliveryRejections || []).some((entry) => entry.agent?.toString() === req.user._id.toString());
    if (alreadyRejected) return res.status(400).json({ message: 'You already rejected this order' });

    const rejectionReason = String(reason || '').trim();
    order.deliveryAgent = null;
    order.status = 'preparing';
    order.estimatedDeliveryAt = null;
    order.estimatedDurationMinutes = null;
    order.etaUpdatedAt = null;
    order.delayReason = '';
    order.deliveryRejections.push({ agent: req.user._id, rejectedAt: new Date(), reason: rejectionReason });
    order.statusHistory.push({
      status: 'preparing',
      updatedAt: new Date(),
      updatedBy: req.user._id,
      note: `Delivery request rejected by rider: ${rejectionReason || 'No reason provided'}. Order moved back to preparing for reassignment.`,
    });
    await order.save();

    emitOrderUpdate(req, order, {
      message: 'Delivery order rejected by rider',
      deliveryAgentId: null,
    });
    await pushDeliveryNotification(
      req,
      order,
      'preparing',
      'Delivery reassignment started',
      'A delivery partner declined this order. We moved it back to preparing and will assign a new rider soon.',
      ['push', 'email', 'sms']
    );

    const io = req.app.get('io');
    if (io) {
      io.to('admin-map').emit('delivery-order-rejected', { orderId: order._id, orderCode: order.orderId, agentId: req.user._id, reason: rejectionReason, status: order.status });
      io.to('delivery').emit('delivery-order-changed', { orderId: order._id, status: order.status, deliveryAgentId: null });
      io.emit('manager-delivery-rejection', { orderId: order.orderId, orderDbId: order._id, customerName: order.customer?.name || 'Customer', reason: rejectionReason, rejectedBy: req.user._id, status: order.status });
      io.emit('order-updated', {
        orderId: order._id,
        status: order.status,
        orderType: order.orderType,
        message: 'Delivery order rejected by rider',
      });
    }

    res.json({ message: 'Order rejected successfully and moved back to preparing', order });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Cancel active delivery (out-for-delivery)
router.patch('/orders/:id/cancel-delivery', protect, allowRoles('delivery'), async (req, res) => {
  try {
    const { reason } = req.body;
    const cancellationReason = String(reason || '').trim() || 'Unable to complete delivery';
    const order = await Order.findById(req.params.id)
      .populate('customer', 'name phone email')
      .populate('deliveryAgent', 'name phone isOnline vehicleType');

    if (!order) return res.status(404).json({ message: 'Order not found' });
    if (!order.deliveryAgent || order.deliveryAgent._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'This order is not assigned to you' });
    }
    if (order.status !== 'out-for-delivery') {
      return res.status(400).json({ message: 'Only active deliveries can be cancelled by the rider' });
    }

    order.status = 'ready';
    order.deliveryAgent = null;
    order.deliveryOTP = '';
    order.pickedUpAt = null;
    order.estimatedDeliveryAt = null;
    order.estimatedDurationMinutes = 0;
    order.etaUpdatedAt = null;
    order.delayedAt = null;
    order.delayReason = '';
    order.liveLocation = { lat: null, lng: null, updatedAt: null };
    order.statusHistory.push({
      status: 'ready',
      updatedAt: new Date(),
      updatedBy: req.user._id,
      note: `Delivery cancelled by rider. Reason: ${cancellationReason}`,
    });
    await order.save();

    emitOrderUpdate(req, order, { message: 'Delivery reassigned to another rider' });
    await pushDeliveryNotification(
      req,
      order,
      'ready',
      'Delivery reassigned',
      `Your rider could not complete the trip. Reason: ${cancellationReason}. The cafe is assigning another rider.`,
      ['push', 'sms']
    );

    const io = req.app.get('io');
    if (io) {
      io.emit('order-updated', {
        orderId: order._id,
        status: order.status,
        orderType: order.orderType,
        message: 'Delivery returned to ready queue',
      });
    }

    res.json({ message: 'Delivery cancelled and returned to ready queue', order });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Cancel assigned order (remove from my orders without delivering)
router.patch('/orders/:id/cancel-assigned', protect, allowRoles('delivery'), async (req, res) => {
  try {
    const { reason } = req.body;
    const cancellationReason = String(reason || '').trim() || 'Order cancelled by rider';
    const order = await Order.findById(req.params.id)
      .populate('customer', 'name phone email')
      .populate('deliveryAgent', 'name phone isOnline vehicleType');

    if (!order) return res.status(404).json({ message: 'Order not found' });
    if (!order.deliveryAgent || order.deliveryAgent._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'This order is not assigned to you' });
    }
    if (order.status !== 'ready') {
      return res.status(400).json({ message: 'Only orders that are ready can be cancelled' });
    }

    order.deliveryAgent = null;
    order.statusHistory.push({
      status: 'ready',
      updatedAt: new Date(),
      updatedBy: req.user._id,
      note: `Order cancelled by rider. Reason: ${cancellationReason}`,
    });
    await order.save();

    emitOrderUpdate(req, order, { message: 'Order removed from your list' });

    const io = req.app.get('io');
    if (io) {
      io.to('delivery').emit('orderReadyForPickup', {
        orderId: order.orderId,
        orderDbId: order._id,
        customerName: order.customer?.name,
      });
    }

    res.json({ message: 'Order removed from your list', order });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update ETA
router.patch('/orders/:id/eta', protect, allowRoles('delivery'), async (req, res) => {
  try {
    const { minutes, delayReason } = req.body;
    const normalizedMinutes = Number(minutes);
    const normalizedReason = String(delayReason || '').trim();

    if (!Number.isFinite(normalizedMinutes) || normalizedMinutes < 5 || normalizedMinutes > 180) {
      return res.status(400).json({ message: 'ETA must be between 5 and 180 minutes' });
    }
    if (!normalizedReason) {
      return res.status(400).json({ message: 'A reason is required before updating ETA' });
    }

    const order = await Order.findById(req.params.id)
      .populate('customer', 'name phone email')
      .populate('deliveryAgent', 'name phone isOnline vehicleType');

    if (!order) return res.status(404).json({ message: 'Order not found' });
    if (!order.deliveryAgent || order.deliveryAgent._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'This order is not assigned to you' });
    }
    if (order.status !== 'out-for-delivery') return res.status(400).json({ message: 'ETA can be updated only for active delivery runs' });

    order.estimatedDeliveryAt = buildEstimatedDeliveryAt(normalizedMinutes);
    order.estimatedDurationMinutes = normalizedMinutes;
    order.etaUpdatedAt = new Date();
    order.delayReason = normalizedReason;
    order.delayedAt = new Date();
    order.statusHistory.push({
      status: order.status,
      updatedAt: new Date(),
      updatedBy: req.user._id,
      note: `ETA updated to ${normalizedMinutes} mins. Delay: ${order.delayReason}`,
    });
    await order.save();

    emitOrderUpdate(req, order, { message: 'Delivery ETA updated', estimatedDeliveryAt: order.estimatedDeliveryAt, delayReason: order.delayReason });
    await pushDeliveryNotification(req, order, 'out-for-delivery', 'ETA updated', `Estimated arrival changed. Reason: ${order.delayReason}`);
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Deliver order
router.patch('/orders/:id/deliver', protect, allowRoles('delivery'), async (req, res) => {
  try {
    const {
      receiverName,
      proofNote,
      photoUrl,
      deliveryOTP,
      paymentMethod,
      paymentReceived,
      paymentQrPayload,
      paymentReference,
      paymentNote,
    } = req.body;
    const order = await Order.findById(req.params.id)
      .populate('customer', 'name phone email')
      .populate('deliveryAgent', 'name phone isOnline vehicleType');

    if (!order) return res.status(404).json({ message: 'Order not found' });
    if (!order.deliveryAgent || order.deliveryAgent._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'This order is not assigned to you' });
    }
    const normalizedOtp = String(deliveryOTP || '').replace(/\D/g, '').slice(0, 4);
    const expectedOtp = String(order.deliveryOTP || '').replace(/\D/g, '').slice(0, 4);
    const normalizedPaymentMethod = normalizePaymentMethod(paymentMethod);
    const hasPaymentBeenReceived = paymentReceived === true || String(paymentReceived).toLowerCase() === 'true';

    if (order.status !== 'out-for-delivery') return res.status(400).json({ message: 'Order must be out for delivery before it can be completed' });
    if (normalizedOtp.length !== 4) return res.status(400).json({ message: 'Enter the 4-digit customer OTP' });
    if (expectedOtp !== normalizedOtp) {
      return res.status(400).json({ message: 'Invalid customer OTP' });
    }
    if (!normalizedPaymentMethod) {
      return res.status(400).json({ message: 'Choose cash, UPI, or online payment before completing delivery' });
    }
    if (!hasPaymentBeenReceived) {
      return res.status(400).json({ message: 'Confirm payment success before marking the order delivered' });
    }

    const paymentConfirmedAt = new Date();
    const delayedNow = isDelayedOrder(order);
    if (delayedNow && !order.delayedAt) {
      order.delayedAt = paymentConfirmedAt;
    }

    const paymentReferenceValue = String(paymentReference || '').trim()
      || String(order.paymentId || '').trim()
      || `${normalizedPaymentMethod.toUpperCase()}-${Date.now()}`;
    const paymentLabel = getDeliveryPaymentLabel(normalizedPaymentMethod);
    const paymentNoteText = String(paymentNote || '').trim() || `${paymentLabel} received by delivery partner`;
    const qrPayload = normalizedPaymentMethod === 'online'
      || normalizedPaymentMethod === 'upi'
      ? String(paymentQrPayload || '').trim() || order.deliveryPayment?.qrPayload || buildPaymentQrPayload(order)
      : '';

    order.paymentStatus = 'paid';
    order.paymentId = paymentReferenceValue;
    order.paidAt = paymentConfirmedAt;
    order.paymentConfirmedBy = req.user._id;
    order.paymentNote = paymentNoteText;
    order.deliveryPayment = {
      method: normalizedPaymentMethod,
      status: 'paid',
      amount: Number(order.totalAmount || 0),
      qrPayload,
      reference: paymentReferenceValue,
      note: paymentNoteText,
      confirmedAt: paymentConfirmedAt,
      confirmedBy: req.user._id,
      source: 'delivery-panel',
    };
    order.status = 'delivered';
    order.deliveredAt = paymentConfirmedAt;
    order.deliveryOTP = '';
    order.proofOfDelivery = {
      receiverName: receiverName?.trim?.() || '',
      note: proofNote?.trim?.() || '',
      photoUrl: photoUrl?.trim?.() || '',
      submittedAt: paymentConfirmedAt,
    };
    order.notificationLog = [
      ...(order.notificationLog || []),
      buildNotificationEntry('paid', 'Payment successful', `${paymentLabel} received successfully for order #${order.orderId}.`, ['push', 'internal']),
    ];
    order.statusHistory.push({
      status: 'delivered',
      updatedAt: paymentConfirmedAt,
      updatedBy: req.user._id,
      note: `${order.proofOfDelivery.note ? `Proof note: ${order.proofOfDelivery.note}. ` : ''}Delivered after ${paymentLabel.toLowerCase()} confirmation${delayedNow ? ' on a delayed run' : ''}.`,
    });
    await order.save();

    await User.findByIdAndUpdate(req.user._id, {
      $inc: { totalEarnings: order.deliveryPayout || 0 },
      lastSeen: new Date(),
    });

    emitRealtimeNotification(req, order, buildNotificationEntry('paid', 'Payment successful', `${paymentLabel} received successfully for order #${order.orderId}.`, ['push', 'internal']));
    emitOrderUpdate(req, order, { message: 'Order delivered successfully' });
    await pushDeliveryNotification(req, order, 'delivered', 'Order delivered', 'Your order has been delivered successfully.', ['push', 'sms']);
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Upload proof photo
router.post('/orders/:id/proof-photo', protect, allowRoles('delivery'), proofUpload.single('photo'), async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('customer', 'name phone email')
      .populate('deliveryAgent', 'name phone isOnline vehicleType');

    if (!order) return res.status(404).json({ message: 'Order not found' });
    if (!order.deliveryAgent || order.deliveryAgent._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'This order is not assigned to you' });
    }
    if (order.status !== 'out-for-delivery') {
      return res.status(400).json({ message: 'Proof photo can only be uploaded for active delivery runs' });
    }
    if (!req.file?.buffer) {
      return res.status(400).json({ message: 'Please choose a photo to upload' });
    }
    const hasCloudinaryConfig = (
      process.env.CLOUDINARY_CLOUD_NAME
      && process.env.CLOUDINARY_API_KEY
      && process.env.CLOUDINARY_API_SECRET
      && process.env.CLOUDINARY_CLOUD_NAME !== 'your_cloud_name'
      && process.env.CLOUDINARY_API_KEY !== 'your_api_key'
      && process.env.CLOUDINARY_API_SECRET !== 'your_api_secret'
    );

    if (hasCloudinaryConfig) {
      const uploadResult = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder: 'roller-coaster-cafe/delivery-proof',
            resource_type: 'image',
          },
          (error, result) => {
            if (error) return reject(error);
            resolve(result);
          }
        );

        stream.end(req.file.buffer);
      });

      return res.json({
        message: 'Proof photo uploaded successfully',
        photoUrl: uploadResult.secure_url || uploadResult.url || '',
        publicId: uploadResult.public_id || '',
      });
    }

    const extension = path.extname(req.file.originalname || '').toLowerCase() || '.jpg';
    const fileName = `${Date.now()}-${crypto.randomBytes(6).toString('hex')}${extension}`;
    const absoluteFilePath = path.join(uploadRoot, fileName);
    fs.writeFileSync(absoluteFilePath, req.file.buffer);

    res.json({
      message: 'Proof photo uploaded successfully',
      photoUrl: `${req.protocol}://${req.get('host')}/uploads/delivery-proof/${fileName}`,
      publicId: fileName,
    });
  } catch (err) {
    res.status(500).json({ message: err.message || 'Could not upload proof photo' });
  }
});

// ============= DELETE ROUTES (must be at the end) =============

const deleteDeliveryOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    // Check if the order belongs to this delivery agent
    if (order.deliveryAgent?.toString() !== req.user._id.toString() && 
        !order.deliveryRejections?.some(r => r.agent?.toString() === req.user._id.toString())) {
      return res.status(403).json({ message: 'You can only delete orders assigned to you' });
    }
    
    // Soft delete - mark as deleted
    order.isDeleted = true;
    order.deletedAt = new Date();
    order.deletedBy = req.user._id;
    
    await order.save();
    
    res.json({ message: 'Order deleted successfully' });
  } catch (err) {
    console.error('Delete order error:', err);
    res.status(500).json({ message: err.message });
  }
};

// Delete single order (soft delete)
router.delete('/orders/delete/:orderId', protect, allowRoles('delivery'), deleteDeliveryOrder);
router.delete('/orders/:orderId/delete', protect, allowRoles('delivery'), deleteDeliveryOrder);

// Bulk delete orders
router.post('/orders/bulk-delete', protect, allowRoles('delivery'), async (req, res) => {
  try {
    const { orderIds } = req.body;
    
    if (!orderIds || !orderIds.length) {
      return res.status(400).json({ message: 'No orders selected' });
    }
    
    // Find orders that belong to this agent
    const orders = await Order.find({
      _id: { $in: orderIds },
      $or: [
        { deliveryAgent: req.user._id },
        { 'deliveryRejections.agent': req.user._id }
      ]
    });
    
    if (orders.length === 0) {
      return res.status(404).json({ message: 'No valid orders found to delete' });
    }
    
    // Soft delete all found orders
    const updateResult = await Order.updateMany(
      {
        _id: { $in: orders.map(o => o._id) }
      },
      {
        isDeleted: true,
        deletedAt: new Date(),
        deletedBy: req.user._id
      }
    );
    
    res.json({ 
      message: `${updateResult.modifiedCount} order(s) deleted successfully`,
      deletedCount: updateResult.modifiedCount
    });
  } catch (err) {
    console.error('Bulk delete error:', err);
    res.status(500).json({ message: err.message });
  }
});

// Clear all history for this agent
router.delete('/orders/clear-history', protect, allowRoles('delivery'), async (req, res) => {
  try {
    // Find all history orders for this agent
    const historyOrders = await Order.find({
      orderType: 'delivery',
      $or: [
        { deliveryAgent: req.user._id, status: { $in: ['delivered', 'cancelled'] } },
        { 'deliveryRejections.agent': req.user._id }
      ],
      isDeleted: { $ne: true }
    });
    
    if (historyOrders.length === 0) {
      return res.status(404).json({ message: 'No history orders to clear' });
    }
    
    // Soft delete all history orders
    const updateResult = await Order.updateMany(
      {
        _id: { $in: historyOrders.map(o => o._id) }
      },
      {
        isDeleted: true,
        deletedAt: new Date(),
        deletedBy: req.user._id
      }
    );
    
    res.json({ 
      message: `${updateResult.modifiedCount} history orders cleared successfully`,
      clearedCount: updateResult.modifiedCount
    });
  } catch (err) {
    console.error('Clear history error:', err);
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
