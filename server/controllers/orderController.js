
// const Order = require('../models/Order');
// const MenuItem = require('../models/MenuItem');
// const User = require('../models/User');
// const Promotion = require('../models/promotion');
// const { sendOrderSMS } = require('../services/smsService');
// const { sendOrderConfirmation, sendOTPEmail } = require('../services/emailService');
// const { generateDeliveryOTP } = require('../utils/generateOTP');

// const buildEstimatedDeliveryAt = (minutes = 45) => new Date(Date.now() + minutes * 60 * 1000);
// const generateShortId = () => `ORD-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
// const PRE_ORDER_FEE = 49;
// const PRE_ORDER_MINUTES_AHEAD = 30;
// const PRE_ORDER_MAX_MINUTES_AHEAD = 240;
// const DINE_IN_MINUTES_AHEAD = 10;
// const DINE_IN_MAX_MINUTES_AHEAD = 720;
// const WALKIN_EMAIL = 'walkin-pos@rollercoastercafe.local';
// const APP_BASE_URL = (process.env.CLIENT_URL || process.env.FRONTEND_URL || 'http://localhost:5173').replace(/\/$/, '');

// const STATUS_NOTIFICATION_META = {
//   placed: {
//     title: 'Order placed',
//     message: 'Your order has been placed successfully.',
//     channels: ['push', 'email', 'sms'],
//   },
//   confirmed: {
//     title: 'Order confirmed',
//     message: 'The cafe has accepted your order.',
//     channels: ['push', 'email', 'sms'],
//   },
//   preparing: {
//     title: 'Kitchen started',
//     message: 'Your order is now being prepared.',
//     channels: ['push', 'sms'],
//   },
//   ready: {
//     title: 'Order ready',
//     message: 'Your order is ready for pickup, dine-in service, or rider handoff.',
//     channels: ['push', 'sms'],
//   },
//   'out-for-delivery': {
//     title: 'Rider is on the way',
//     message: 'Your delivery rider is on the way with your order.',
//     channels: ['push', 'sms'],
//   },
//   delivered: {
//     title: 'Order delivered',
//     message: 'Your order has been delivered successfully.',
//     channels: ['push', 'email', 'sms'],
//   },
//   completed: {
//     title: 'Order completed',
//     message: 'Your order has been completed successfully.',
//     channels: ['push', 'email'],
//   },
//   cancelled: {
//     title: 'Order cancelled',
//     message: 'This order has been cancelled.',
//     channels: ['push', 'email'],
//   },
// };

// const isPromotionLive = (promotion) => {
//   const current = new Date();
//   if (!promotion || !promotion.isActive) return false;
//   if (promotion.startDate && new Date(promotion.startDate) > current) return false;
//   if (promotion.endDate && new Date(promotion.endDate) < current) return false;
//   return true;
// };

// const computeDiscount = (promotion, orderAmount) => {
//   if (promotion.type === 'percentage') {
//     return Math.round((orderAmount * promotion.value) / 100);
//   }
//   return Math.round(promotion.value);
// };

// const getOrCreateWalkInCustomer = async () => {
//   let customer = await User.findOne({ email: WALKIN_EMAIL });
//   if (!customer) {
//     customer = await User.create({
//       name: 'Walk-In Guest',
//       email: WALKIN_EMAIL,
//       role: 'customer',
//       isEmailVerified: true,
//       isPhoneVerified: false,
//     });
//   }
//   return customer;
// };

// const buildNotificationEntry = (status, messageOverride = '') => {
//   const meta = STATUS_NOTIFICATION_META[status] || {
//     title: status,
//     message: 'Your order has been updated.',
//     channels: ['push'],
//   };

//   return {
//     status,
//     title: meta.title,
//     message: messageOverride || meta.message,
//     channels: meta.channels,
//     sentAt: new Date(),
//   };
// };

// const buildTrackUrl = (order) => `${APP_BASE_URL}/track/${order._id}`;

// const validateScheduledTime = (orderType, scheduledTime) => {
//   if (!scheduledTime) return null;

//   const scheduledAt = new Date(scheduledTime);
//   if (Number.isNaN(scheduledAt.getTime())) {
//     return 'Please choose a valid schedule time';
//   }

//   const minutesAhead = Math.round((scheduledAt.getTime() - Date.now()) / (1000 * 60));

//   if (orderType === 'pre-order') {
//     if (minutesAhead < PRE_ORDER_MINUTES_AHEAD) {
//       return `Pre-orders must be scheduled at least ${PRE_ORDER_MINUTES_AHEAD} minutes ahead`;
//     }
//     if (minutesAhead > PRE_ORDER_MAX_MINUTES_AHEAD) {
//       return `Pre-orders are available only within ${Math.round(PRE_ORDER_MAX_MINUTES_AHEAD / 60)} hours of arrival`;
//     }
//   }

//   if (orderType === 'dine-in') {
//     if (minutesAhead < DINE_IN_MINUTES_AHEAD) {
//       return `Dine-in bookings must be scheduled at least ${DINE_IN_MINUTES_AHEAD} minutes ahead`;
//     }
//     if (minutesAhead > DINE_IN_MAX_MINUTES_AHEAD) {
//       return 'Dine-in bookings are limited to the same day service window';
//     }
//   }

//   return null;
// };

// const emitOrderUpdate = (req, order, extra = {}) => {
//   const io = req.app.get('io');
//   if (!io) return;

//   const customerId = order.customer?._id || order.customer;
//   const payload = {
//     orderId: order._id,
//     status: order.status,
//     estimatedDeliveryAt: order.estimatedDeliveryAt,
//     liveLocation: order.liveLocation,
//     deliveryAgent: order.deliveryAgent,
//     notificationLog: order.notificationLog || [],
//     delayReason: order.delayReason,
//     proofOfDelivery: order.proofOfDelivery,
//     deliveryRating: order.deliveryRating,
//     ...extra,
//   };

//   io.to(`order:${order._id}`).emit('order-updated', payload);
//   if (customerId) {
//     io.to(`user:${customerId}`).emit('order-updated', payload);
//   }
// };

// const pushNotification = async (req, order, status, messageOverride = '') => {
//   const entry = buildNotificationEntry(status, messageOverride);
//   order.notificationLog = [...(order.notificationLog || []), entry];
//   await order.save();

//   const io = req.app.get('io');
//   const customerId = order.customer?._id || order.customer;
//   if (io) {
//     io.to(`order:${order._id}`).emit('order-notification', {
//       orderId: order._id,
//       ...entry,
//     });
//     if (customerId) {
//       io.to(`user:${customerId}`).emit('order-notification', {
//         orderId: order._id,
//         ...entry,
//       });
//     }
//   }

//   if (order.customer?.phone && entry.channels.includes('sms')) {
//     await sendOrderSMS(order.customer.phone, order, status, {
//       trackUrl: buildTrackUrl(order),
//       messageOverride,
//     }).catch(() => null);
//   }

//   if (order.customer?.email && entry.channels.includes('email') && ['placed', 'confirmed', 'delivered', 'completed', 'cancelled'].includes(status)) {
//     await sendOrderConfirmation(order.customer.email, order.customer.name, order, status, messageOverride).catch(() => null);
//   }

//   return entry;
// };

// // Helper function to send OTP to customer
// const sendDeliveryOTPToCustomer = async (order) => {
//   if (order.orderType !== 'delivery' || !order.deliveryOTP) return;
  
//   const customer = order.customer;
//   if (!customer) return;
  
//   const message = `Your Roller Coaster Cafe delivery OTP is: ${order.deliveryOTP}. Share this with your delivery partner to complete the delivery.`;
  
//   // Send email
//   if (customer.email) {
//     await sendOTPEmail(customer.email, order.deliveryOTP, customer.name);
//     console.log(`OTP email sent to ${customer.email}: ${order.deliveryOTP}`);
//   }
  
//   // Send SMS
//   if (customer.phone) {
//     await sendOTPSMS(customer.phone, order.deliveryOTP);
//     console.log(`OTP SMS sent to ${customer.phone}: ${order.deliveryOTP}`);
//   }
// };

// exports.placeOrder = async (req, res) => {
//   let subtotal = 0;

//   try {
//     const {
//       items,
//       orderType,
//       deliveryAddress,
//       scheduledTime,
//       paymentMethod,
//       paymentReference,
//       couponCode,
//       specialNotes,
//       tipAmount,
//       customerAcceptedTerms,
//     } = req.body;
//     const customerId = req.user._id;

//     if (!items || items.length === 0) {
//       return res.status(400).json({ message: 'No items in order' });
//     }

//     if (orderType === 'delivery' && !deliveryAddress?.text?.trim()) {
//       return res.status(400).json({ message: 'Delivery address is required for delivery orders' });
//     }

//     if ((orderType === 'pre-order' || orderType === 'dine-in') && !scheduledTime) {
//       return res.status(400).json({ message: 'Please select a schedule time first' });
//     }

//     const scheduleError = validateScheduledTime(orderType, scheduledTime);
//     if (scheduleError) {
//       return res.status(400).json({ message: scheduleError });
//     }

//     if (orderType === 'pre-order' && ['cod', 'online'].includes(paymentMethod)) {
//       return res.status(400).json({ message: 'Pre-orders require wallet, UPI, or bank payment' });
//     }

//     if (!['online', 'cod', 'wallet', 'upi', 'bank'].includes(paymentMethod)) {
//       return res.status(400).json({ message: 'Please choose a valid payment method' });
//     }

//     if (paymentMethod === 'online') {
//       return res.status(400).json({ message: 'Online payment is not connected yet. Please use wallet or pay on arrival.' });
//     }

//     if (['upi', 'bank'].includes(paymentMethod) && !String(paymentReference || '').trim()) {
//       return res.status(400).json({ message: `Please enter your ${paymentMethod === 'upi' ? 'UPI' : 'bank'} payment reference` });
//     }

//     if (!customerAcceptedTerms) {
//       return res.status(400).json({ message: 'Please accept the order rules first' });
//     }

//     const orderItems = [];

//     for (const item of items) {
//       const menuItem = await MenuItem.findById(item.menuItemId);
//       if (!menuItem || !menuItem.isAvailable) {
//         return res.status(400).json({ message: `${menuItem?.name || 'Item'} is not available` });
//       }

//       let unitPrice = menuItem.basePrice;
//       if (item.variant) {
//         const variant = menuItem.variants.find((v) => v.name === item.variant);
//         if (variant) unitPrice = variant.price;
//       }

//       let addonTotal = 0;
//       const addons = [];
//       if (item.addons?.length) {
//         for (const addonName of item.addons) {
//           const addon = menuItem.addons.find((a) => a.name === addonName);
//           if (addon) {
//             addonTotal += addon.price;
//             addons.push({ name: addon.name, price: addon.price });
//           }
//         }
//       }

//       const itemTotalPrice = (unitPrice + addonTotal) * item.quantity;
//       subtotal += itemTotalPrice;

//       orderItems.push({
//         menuItem: menuItem._id,
//         name: menuItem.name,
//         quantity: item.quantity,
//         variant: item.variant,
//         addons,
//         unitPrice: unitPrice + addonTotal,
//         totalPrice: itemTotalPrice,
//       });
//     }

//     let discount = 0;
//     let appliedCouponCode = '';
//     if (couponCode?.trim()) {
//       const promotion = await Promotion.findOne({ code: couponCode.trim().toUpperCase() });
//       if (!promotion || !isPromotionLive(promotion)) {
//         return res.status(400).json({ message: 'Coupon is not active right now' });
//       }
//       if (subtotal < (promotion.minOrderAmount || 0)) {
//         return res.status(400).json({ message: `Minimum order amount for this coupon is Rs. ${promotion.minOrderAmount || 0}` });
//       }
//       discount = computeDiscount(promotion, subtotal);
//       appliedCouponCode = promotion.code;
//       promotion.usageCount += 1;
//       await promotion.save();
//     }

//     const deliveryFee = orderType === 'delivery' ? 30 : 0;
//     const preOrderFee = orderType === 'pre-order' ? PRE_ORDER_FEE : 0;
//     const taxAmount = Math.round(subtotal * 0.05);
//     const normalizedTipAmount = orderType === 'delivery' ? Math.max(0, Number(tipAmount) || 0) : 0;
//     const totalAmount = subtotal + taxAmount + deliveryFee + preOrderFee + normalizedTipAmount - discount;
//     const deliveryOTP = orderType === 'delivery' ? generateDeliveryOTP() : undefined;
//     const orderId = generateShortId();

//     let paymentStatus = 'pending';

//     if (paymentMethod === 'wallet') {
//       const customer = await User.findById(customerId);
//       if (!customer) {
//         return res.status(404).json({ message: 'Customer account not found' });
//       }
//       if ((customer.walletBalance || 0) < totalAmount) {
//         return res.status(400).json({ message: 'Not enough wallet balance for this order' });
//       }

//       customer.walletBalance -= totalAmount;
//       await customer.save();
//       paymentStatus = 'paid';
//     }

//     if (['upi', 'bank'].includes(paymentMethod)) {
//       paymentStatus = 'paid';
//     }

//     const order = await Order.create({
//       orderId,
//       customer: customerId,
//       items: orderItems,
//       orderType,
//       deliveryAddress,
//       scheduledTime,
//       subtotal,
//       taxAmount,
//       deliveryFee,
//       preOrderFee,
//       tipAmount: normalizedTipAmount,
//       deliveryPayout: orderType === 'delivery' ? deliveryFee + normalizedTipAmount : 0,
//       discount,
//       totalAmount,
//       paymentMethod,
//       paymentStatus,
//       paymentId: ['upi', 'bank'].includes(paymentMethod) ? String(paymentReference || '').trim() : '',
//       couponCode: appliedCouponCode,
//       customerAcceptedTerms: Boolean(customerAcceptedTerms),
//       specialNotes,
//       deliveryOTP,
//       estimatedDeliveryAt: orderType === 'delivery' ? buildEstimatedDeliveryAt(45) : null,
//       estimatedDurationMinutes: orderType === 'delivery' ? 45 : 0,
//       etaUpdatedAt: orderType === 'delivery' ? new Date() : null,
//       status: 'placed',
//       statusHistory: [{ status: 'placed', updatedAt: new Date(), updatedBy: customerId }],
//       notificationLog: [],
//     });

//     // Send OTP to customer for delivery orders
//     if (orderType === 'delivery' && deliveryOTP) {
//       await sendDeliveryOTPToCustomer(order);
//     }

//     const populated = await Order.findById(order._id)
//       .populate('customer', 'name phone email')
//       .populate('deliveryAgent', 'name phone isOnline vehicleType')
//       .populate('items.menuItem', 'name image');

//     const io = req.app.get('io');
//     if (io) {
//       io.to('kitchen').emit('new-order', { order: populated });
//       io.to('staff').emit('new-order', { order: populated });
//       io.emit('newOrder', populated);
//     }

//     emitOrderUpdate(req, populated, { message: 'Order placed successfully' });
//     await pushNotification(req, populated, 'placed', 'Your order has been placed successfully. The cafe will confirm it soon.');
//     emitOrderUpdate(req, populated, { message: 'Order placed notification sent' });

//     res.status(201).json({ message: 'Order placed successfully', order: populated });
//   } catch (err) {
//     console.error('Order Placement Error:', err);
//     if (err.code === 11000) {
//       return res.status(400).json({ message: 'Duplicate Order ID detected. Please try placing the order again.' });
//     }
//     res.status(500).json({ message: err.message });
//   }
// };

// exports.createPOSOrder = async (req, res) => {
//   let subtotal = 0;

//   try {
//     const {
//       items,
//       orderType,
//       paymentMethod,
//       guestName,
//       guestPhone,
//       tableNumber,
//       notes,
//       scheduledTime,
//     } = req.body;

//     if (!['takeaway', 'dine-in', 'pre-order'].includes(orderType)) {
//       return res.status(400).json({ message: 'Invalid POS order type' });
//     }

//     if (!items || items.length === 0) {
//       return res.status(400).json({ message: 'Add at least one item to the ticket' });
//     }

//     if (orderType === 'pre-order' && !scheduledTime) {
//       return res.status(400).json({ message: 'Scheduled time is required for pre-orders' });
//     }

//     if (orderType === 'dine-in' && !tableNumber?.trim()) {
//       return res.status(400).json({ message: 'Table number is required for dine-in POS orders' });
//     }

//     const orderItems = [];

//     for (const item of items) {
//       const menuItem = await MenuItem.findById(item.menuItemId);
//       if (!menuItem || !menuItem.isAvailable) {
//         return res.status(400).json({ message: `${menuItem?.name || 'Item'} is not available` });
//       }

//       const quantity = Math.max(1, Number(item.quantity) || 1);
//       const unitPrice = menuItem.basePrice;
//       const itemTotalPrice = unitPrice * quantity;
//       subtotal += itemTotalPrice;

//       orderItems.push({
//         menuItem: menuItem._id,
//         name: menuItem.name,
//         quantity,
//         unitPrice,
//         totalPrice: itemTotalPrice,
//       });
//     }

//     const walkInCustomer = await getOrCreateWalkInCustomer();
//     const taxAmount = Math.round(subtotal * 0.05);
//     const preOrderFee = orderType === 'pre-order' ? PRE_ORDER_FEE : 0;
//     const totalAmount = subtotal + taxAmount + preOrderFee;
//     const mappedPaymentMethod = paymentMethod === 'cash' ? 'cod' : 'online';
//     const status = 'confirmed';
//     const orderId = generateShortId();

//     const order = await Order.create({
//       orderId,
//       customer: walkInCustomer._id,
//       source: 'staff-pos',
//       guestName: guestName?.trim?.() || 'Walk-In Guest',
//       guestPhone: guestPhone?.trim?.() || '',
//       tableNumber: tableNumber?.trim?.() || '',
//       createdByStaff: req.user._id,
//       items: orderItems,
//       orderType,
//       status,
//       scheduledTime: scheduledTime || null,
//       subtotal,
//       taxAmount,
//       preOrderFee,
//       totalAmount,
//       paymentMethod: mappedPaymentMethod,
//       paymentStatus: 'paid',
//       customerAcceptedTerms: true,
//       specialNotes: notes?.trim?.() || '',
//       statusHistory: [{ status, updatedAt: new Date(), updatedBy: req.user._id, note: 'Created from POS' }],
//       notificationLog: [{
//         status,
//         title: 'Counter order created',
//         message: 'A staff member created this order from the POS counter.',
//         channels: ['internal'],
//         sentAt: new Date(),
//       }],
//     });

//     const populated = await Order.findById(order._id)
//       .populate('customer', 'name phone email')
//       .populate('createdByStaff', 'name email phone')
//       .populate('assignedStaff', 'name email phone')
//       .populate('items.menuItem', 'name image');

//     const io = req.app.get('io');
//     if (io) {
//       io.to('kitchen').emit('new-order', { order: populated });
//       io.to('staff').emit('new-order', { order: populated });
//       io.emit('newOrder', populated);
//     }

//     emitOrderUpdate(req, populated, { message: 'POS order created' });

//     res.status(201).json({ message: 'POS order created successfully', order: populated });
//   } catch (err) {
//     console.error('POS Order Creation Error:', err);
//     if (err.code === 11000) {
//       return res.status(400).json({ message: 'Duplicate Order ID detected. Please try again.' });
//     }
//     res.status(500).json({ message: err.message });
//   }
// };

// exports.getMyOrders = async (req, res) => {
//   try {
//     const orders = await Order.find({ customer: req.user._id })
//       .sort({ createdAt: -1 })
//       .populate('items.menuItem', 'name image')
//       .populate('deliveryAgent', 'name phone profilePhoto isOnline vehicleType');
//     res.json(orders);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

// exports.getOrder = async (req, res) => {
//   try {
//     const order = await Order.findById(req.params.id)
//       .populate('customer', 'name phone email')
//       .populate('createdByStaff', 'name email phone')
//       .populate('assignedStaff', 'name email phone')
//       .populate('deliveryAgent', 'name phone profilePhoto isOnline vehicleType')
//       .populate('items.menuItem', 'name image');

//     if (!order) return res.status(404).json({ message: 'Order not found' });

//     const allowedRoles = ['admin', 'manager', 'staff', 'kitchen', 'delivery'];
//     if (!allowedRoles.includes(req.user.role) && order.customer._id.toString() !== req.user._id.toString()) {
//       return res.status(403).json({ message: 'Access denied' });
//     }

//     res.json(order);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

// exports.updateStatus = async (req, res) => {
//   try {
//     const { status } = req.body;
//     const order = await Order.findById(req.params.id)
//       .populate('customer', 'name phone email')
//       .populate('assignedStaff', 'name email phone')
//       .populate('deliveryAgent', 'name phone profilePhoto isOnline vehicleType');

//     if (!order) return res.status(404).json({ message: 'Order not found' });

//     if (req.user.role === 'staff') {
//       if (order.assignedStaff && order.assignedStaff._id.toString() !== req.user._id.toString()) {
//         return res.status(403).json({ message: 'This order is currently assigned to another staff member' });
//       }
//       if (!order.assignedStaff) {
//         order.assignedStaff = req.user._id;
//       }
//     }

//     order.status = status;
//     if (order.paymentMethod === 'cod' && ['completed', 'delivered'].includes(status)) {
//       order.paymentStatus = 'paid';
//     }
//     if (order.orderType === 'delivery' && status === 'ready' && !order.estimatedDeliveryAt) {
//       order.estimatedDeliveryAt = buildEstimatedDeliveryAt(25);
//       order.estimatedDurationMinutes = 25;
//       order.etaUpdatedAt = new Date();
//     }

//     order.statusHistory.push({ status, updatedAt: new Date(), updatedBy: req.user._id });
//     await order.save();
//     emitOrderUpdate(req, order, { message: `Order updated to ${status}` });
//     await pushNotification(req, order, status);
//     emitOrderUpdate(req, order, { message: `Notification sent for ${status}` });

//     if (status === 'ready' && order.orderType === 'delivery') {
//       const io = req.app.get('io');
//       if (io) {
//         io.to('delivery').emit('orderReadyForPickup', {
//           orderId: order.orderId,
//           orderDbId: order._id,
//           customerName: order.customer?.name,
//         });
//       }
//     }

//     res.json({ message: `Order status updated to ${status}`, order });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

// exports.assignStaff = async (req, res) => {
//   try {
//     const order = await Order.findById(req.params.id).populate('assignedStaff', 'name email phone');
//     if (!order) return res.status(404).json({ message: 'Order not found' });

//     if (req.user.role === 'staff') {
//       if (order.assignedStaff && order.assignedStaff._id.toString() !== req.user._id.toString()) {
//         return res.status(403).json({ message: 'This order is already claimed by another staff member' });
//       }
//     }

//     order.assignedStaff = req.user._id;
//     await order.save();
//     await order.populate('assignedStaff', 'name email phone');

//     res.json({ message: 'Order claimed successfully', order });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

// // NEW: Verify Delivery OTP endpoint
// exports.verifyDeliveryOTP = async (req, res) => {
//   try {
//     const { orderId } = req.params;
//     const { otp } = req.body;
    
//     const order = await Order.findById(orderId);
//     if (!order) {
//       return res.status(404).json({ message: 'Order not found' });
//     }
    
//     if (order.status !== 'out-for-delivery') {
//       return res.status(400).json({ message: 'Order is not out for delivery yet' });
//     }
    
//     if (order.deliveryOTP !== otp) {
//       return res.status(400).json({ message: 'Invalid OTP. Please check and try again.' });
//     }
    
//     res.json({ valid: true, message: 'OTP verified successfully' });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

// // NEW: Deliver order with OTP verification
// exports.deliverOrder = async (req, res) => {
//   try {
//     const { orderId } = req.params;
//     const { deliveryOTP, receiverName, proofNote, photoUrl } = req.body;
    
//     const order = await Order.findById(orderId).populate('customer', 'name phone email');
//     if (!order) {
//       return res.status(404).json({ message: 'Order not found' });
//     }
    
//     if (order.status !== 'out-for-delivery') {
//       return res.status(400).json({ message: 'Order is not out for delivery' });
//     }
    
//     // Verify OTP
//     if (!deliveryOTP || order.deliveryOTP !== deliveryOTP) {
//       return res.status(400).json({ message: 'Invalid OTP. Please check and try again.' });
//     }
    
//     // Update order
//     order.status = 'delivered';
//     order.deliveredAt = new Date();
//     order.receiverName = receiverName;
//     order.proofNote = proofNote;
//     if (photoUrl) order.proofPhotoUrl = photoUrl;
//     order.statusHistory.push({ 
//       status: 'delivered', 
//       updatedAt: new Date(), 
//       updatedBy: req.user._id,
//       note: `Delivered with OTP verification: ${deliveryOTP}`
//     });
    
//     await order.save();
    
//     // Send confirmation to customer
//     await sendOrderConfirmation(order.customer.email, order.customer.name, order, 'delivered', 'Your order has been delivered! Thank you for ordering from Roller Coaster Cafe.');
    
//     // Send SMS confirmation
//     if (order.customer.phone) {
//       await sendOrderSMS(order.customer.phone, order, 'delivered');
//     }
    
//     // Emit socket event for real-time update
//     const io = req.app.get('io');
//     if (io) {
//       io.to(`order:${order._id}`).emit('order-updated', {
//         orderId: order._id,
//         status: 'delivered',
//         message: 'Order has been delivered successfully!'
//       });
//       io.to(`user:${order.customer._id}`).emit('order-updated', {
//         orderId: order._id,
//         status: 'delivered'
//       });
//     }
    
//     res.json({ message: 'Order delivered successfully', order });
//   } catch (err) {
//     console.error('Delivery Error:', err);
//     res.status(500).json({ message: err.message });
//   }
// };

// exports.rateDelivery = async (req, res) => {
//   try {
//     const { score, review } = req.body;
//     const normalizedScore = Number(score);

//     if (!Number.isInteger(normalizedScore) || normalizedScore < 1 || normalizedScore > 5) {
//       return res.status(400).json({ message: 'Rating must be between 1 and 5' });
//     }

//     const order = await Order.findById(req.params.id)
//       .populate('customer', 'name phone email')
//       .populate('deliveryAgent', 'name phone profilePhoto');

//     if (!order) return res.status(404).json({ message: 'Order not found' });

//     if (req.user.role !== 'customer' || order.customer?._id.toString() !== req.user._id.toString()) {
//       return res.status(403).json({ message: 'Only the customer for this order can rate the delivery' });
//     }

//     if (order.orderType !== 'delivery' || order.status !== 'delivered') {
//       return res.status(400).json({ message: 'You can rate a delivery only after it is completed' });
//     }

//     order.deliveryRating = {
//       score: normalizedScore,
//       review: review?.trim?.() || '',
//       ratedAt: new Date(),
//     };
//     await order.save();

//     emitOrderUpdate(req, order, { deliveryRating: order.deliveryRating });
//     res.json({ message: 'Delivery rated successfully', order });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

// exports.cancelOrder = async (req, res) => {
//   try {
//     const { reason } = req.body;
//     const order = await Order.findById(req.params.id).populate('customer', 'name phone email');
//     if (!order) return res.status(404).json({ message: 'Order not found' });

//     if (['delivered', 'cancelled'].includes(order.status)) {
//       return res.status(400).json({ message: 'Cannot cancel this order' });
//     }

//     order.status = 'cancelled';
//     order.cancelReason = reason;
//     order.statusHistory.push({ status: 'cancelled', updatedAt: new Date(), updatedBy: req.user._id });
//     await order.save();
//     emitOrderUpdate(req, order, { message: 'Order cancelled' });
//     await pushNotification(req, order, 'cancelled');

//     res.json({ message: 'Order cancelled', order });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

// exports.getAllOrders = async (req, res) => {
//   try {
//     const { status, orderType, page = 1, limit = 20, startDate, endDate } = req.query;
//     const filter = {};

//     if (status === 'active') {
//       filter.status = { $in: ['placed', 'confirmed', 'preparing', 'ready', 'out-for-delivery'] };
//     } else if (status && status !== 'all') {
//       filter.status = status.toLowerCase();
//     }

//     if (orderType) filter.orderType = orderType;

//     if (startDate || endDate) {
//       filter.createdAt = {};
//       if (startDate) filter.createdAt.$gte = new Date(startDate);
//       if (endDate) {
//         const end = new Date(endDate);
//         end.setHours(23, 59, 59, 999);
//         filter.createdAt.$lte = end;
//       }
//     }

//     const orders = await Order.find(filter)
//       .sort({ createdAt: -1 })
//       .skip((page - 1) * limit)
//       .limit(Number(limit))
//       .populate('customer', 'name phone email')
//       .populate('createdByStaff', 'name email phone')
//       .populate('assignedStaff', 'name email phone')
//       .populate('deliveryAgent', 'name phone isOnline vehicleType')
//       .populate('items.menuItem', 'name image');

//     const total = await Order.countDocuments(filter);

//     res.json({
//       orders,
//       total,
//       page: Number(page),
//       pages: Math.ceil(total / limit),
//     });
//   } catch (err) {
//     console.error('Fetch All Orders Error:', err);
//     res.status(500).json({ message: err.message });
//   }
// };

const Order = require('../models/Order');
const MenuItem = require('../models/MenuItem');
const User = require('../models/User');
const Promotion = require('../models/promotion');
const PDFDocument = require('pdfkit');
const { sendOrderSMS } = require('../services/smsService');
const { sendOrderConfirmation } = require('../services/emailService');
const { generateDeliveryOTP } = require('../utils/generateOTP');

const buildEstimatedDeliveryAt = (minutes = 45) => new Date(Date.now() + minutes * 60 * 1000);
const generateShortId = () => `ORD-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
const buildInvoiceNumber = (order) => `INV-${order.orderId || order._id.toString().slice(-6).toUpperCase()}`;
const ensureInvoiceFields = (order, userId) => {
  if (!order.invoiceNumber) {
    order.invoiceNumber = buildInvoiceNumber(order);
    order.invoiceGeneratedAt = new Date();
    order.invoiceIssuedBy = userId || null;
  }
};
const PRE_ORDER_FEE = 49;
const PRE_ORDER_MINUTES_AHEAD = 30;
const PRE_ORDER_MAX_MINUTES_AHEAD = 240;
const DINE_IN_MINUTES_AHEAD = 10;
const DINE_IN_MAX_MINUTES_AHEAD = 720;
const WALKIN_EMAIL = 'walkin-pos@rollercoastercafe.local';
const APP_BASE_URL = (process.env.CLIENT_URL || process.env.FRONTEND_URL || 'http://localhost:5173').replace(/\/$/, '');

const STATUS_NOTIFICATION_META = {
  placed: {
    title: 'Order placed',
    message: 'Your order has been placed successfully.',
    channels: ['push', 'email', 'sms'],
  },
  confirmed: {
    title: 'Order confirmed',
    message: 'The cafe has accepted your order.',
    channels: ['push', 'email', 'sms'],
  },
  preparing: {
    title: 'Kitchen started',
    message: 'Your order is now being prepared.',
    channels: ['push', 'sms'],
  },
  ready: {
    title: 'Order ready',
    message: 'Your order is ready for pickup, dine-in service, or rider handoff.',
    channels: ['push', 'sms'],
  },
  'out-for-delivery': {
    title: 'Rider is on the way',
    message: 'Your delivery rider is on the way with your order.',
    channels: ['push', 'email', 'sms'],
  },
  delivered: {
    title: 'Order delivered',
    message: 'Your order has been delivered successfully.',
    channels: ['push', 'email', 'sms'],
  },
  completed: {
    title: 'Order completed',
    message: 'Your order has been completed successfully.',
    channels: ['push', 'email'],
  },
  cancelled: {
    title: 'Order cancelled',
    message: 'This order has been cancelled.',
    channels: ['push', 'email'],
  },
};

const isPromotionLive = (promotion) => {
  const current = new Date();
  if (!promotion || !promotion.isActive) return false;
  if (promotion.startDate && new Date(promotion.startDate) > current) return false;
  if (promotion.endDate && new Date(promotion.endDate) < current) return false;
  return true;
};

const computeDiscount = (promotion, orderAmount) => {
  if (promotion.type === 'percentage') {
    return Math.round((orderAmount * promotion.value) / 100);
  }
  return Math.round(promotion.value);
};

const getOrCreateWalkInCustomer = async () => {
  let customer = await User.findOne({ email: WALKIN_EMAIL });
  if (!customer) {
    customer = await User.create({
      name: 'Walk-In Guest',
      email: WALKIN_EMAIL,
      role: 'customer',
      isEmailVerified: true,
      isPhoneVerified: false,
    });
  }
  return customer;
};

const buildNotificationEntry = (status, messageOverride = '') => {
  const meta = STATUS_NOTIFICATION_META[status] || {
    title: status,
    message: 'Your order has been updated.',
    channels: ['push'],
  };

  return {
    status,
    title: meta.title,
    message: messageOverride || meta.message,
    channels: meta.channels,
    sentAt: new Date(),
  };
};

const buildTrackUrl = (order) => {
  if (!order?._id) return '';
  if (order.isPreOrder) return `${APP_BASE_URL}/track-preorder/${order._id}`;

  const normalizedType = String(order.orderType || '').toLowerCase();
  if (normalizedType === 'delivery') return `${APP_BASE_URL}/track-delivery/${order._id}`;
  if (normalizedType === 'takeaway') return `${APP_BASE_URL}/track-takeaway/${order._id}`;
  if (normalizedType === 'dine-in') return `${APP_BASE_URL}/track-dinein/${order._id}`;
  return `${APP_BASE_URL}/track/${order._id}`;
};

const validateScheduledTime = (orderType, scheduledTime) => {
  if (!scheduledTime) return null;

  const scheduledAt = new Date(scheduledTime);
  if (Number.isNaN(scheduledAt.getTime())) {
    return 'Please choose a valid schedule time';
  }

  const minutesAhead = Math.round((scheduledAt.getTime() - Date.now()) / (1000 * 60));

  if (orderType === 'pre-order') {
    if (minutesAhead < PRE_ORDER_MINUTES_AHEAD) {
      return `Pre-orders must be scheduled at least ${PRE_ORDER_MINUTES_AHEAD} minutes ahead`;
    }
    if (minutesAhead > PRE_ORDER_MAX_MINUTES_AHEAD) {
      return `Pre-orders are available only within ${Math.round(PRE_ORDER_MAX_MINUTES_AHEAD / 60)} hours of arrival`;
    }
  }

  if (orderType === 'dine-in') {
    if (minutesAhead < DINE_IN_MINUTES_AHEAD) {
      return `Dine-in bookings must be scheduled at least ${DINE_IN_MINUTES_AHEAD} minutes ahead`;
    }
    if (minutesAhead > DINE_IN_MAX_MINUTES_AHEAD) {
      return 'Dine-in bookings are limited to the same day service window';
    }
  }

  return null;
};

const getPreOrderPrepLeadMinutes = (order) => {
  const fulfillmentType = String(order?.preOrderMethod || order?.orderType || '').toLowerCase();
  return fulfillmentType === 'delivery' ? 30 : 15;
};

const emitOrderUpdate = (req, order, extra = {}) => {
  const io = req.app.get('io');
  if (!io) return;

  const customerId = order.customer?._id || order.customer;
  const payload = {
    orderId: order._id,
    status: order.status,
    estimatedDeliveryAt: order.estimatedDeliveryAt,
    liveLocation: order.liveLocation,
    deliveryAgent: order.deliveryAgent,
    notificationLog: order.notificationLog || [],
    delayReason: order.delayReason,
    proofOfDelivery: order.proofOfDelivery,
    deliveryRating: order.deliveryRating,
    ...extra,
  };

  io.to(`order:${order._id}`).emit('order-updated', payload);
  if (customerId) {
    io.to(`user:${customerId}`).emit('order-updated', payload);
  }
};

const pushNotification = async (req, order, status, messageOverride = '') => {
  const entry = buildNotificationEntry(status, messageOverride);
  order.notificationLog = [...(order.notificationLog || []), entry];
  await order.save();

  const io = req.app.get('io');
  const customerId = order.customer?._id || order.customer;
  if (io) {
    io.to(`order:${order._id}`).emit('order-notification', {
      orderId: order._id,
      ...entry,
    });
    if (customerId) {
      io.to(`user:${customerId}`).emit('order-notification', {
        orderId: order._id,
        ...entry,
      });
    }
  }

  if (order.customer?.phone && entry.channels.includes('sms')) {
    await sendOrderSMS(order.customer.phone, order, status, {
      trackUrl: buildTrackUrl(order),
      messageOverride,
    }).catch(() => null);
  }

  if (
    order.customer?.email
    && entry.channels.includes('email')
    && status === 'out-for-delivery'
    && String(order.orderType || order.preOrderMethod || '').toLowerCase() === 'delivery'
    && String(order.paymentMethod || '').toLowerCase() === 'online'
  ) {
    await sendOrderConfirmation(order.customer.email, order.customer.name, order, status, messageOverride).catch(() => null);
  }

  return entry;
};

const buildPublicInvoiceOrderQuery = (id) => Order.findById(id)
  .populate('customer', 'name phone email')
  .populate('createdByStaff', 'name email phone')
  .populate('assignedStaff', 'name email phone')
  .populate('deliveryAgent', 'name phone profilePhoto isOnline vehicleType')
  .populate('items.menuItem', 'name image');

const canExposePublicInvoice = (order) => (
  Boolean(order) && ['completed', 'delivered'].includes(String(order.status || '').toLowerCase())
);

exports.placeOrder = async (req, res) => {
  let subtotal = 0;

  try {
    const {
      items,
      orderType,
      isPreOrder,
      preOrderMethod,
      deliveryAddress,
      scheduledTime,
      tableNumber,
      guestCount,
      paymentMethod,
      paymentVerified,
      paymentReference,
      couponCode,
      specialNotes,
      tipAmount,
      customerAcceptedTerms,
    } = req.body;
    const customerId = req.user._id;
    const normalizedPreOrder = Boolean(isPreOrder);
    const fulfillmentMethod = normalizedPreOrder ? String(preOrderMethod || orderType || '').trim() : String(orderType || '').trim();
    const normalizedOrderType = String(orderType || '').trim();

    if (!items || items.length === 0) {
      return res.status(400).json({ message: 'No items in order' });
    }

    if (!['delivery', 'takeaway', 'dine-in', 'pre-order'].includes(normalizedOrderType)) {
      return res.status(400).json({ message: 'Please choose a valid order type' });
    }

    if (normalizedPreOrder && !['delivery', 'takeaway', 'dine-in'].includes(fulfillmentMethod)) {
      return res.status(400).json({ message: 'Please choose how your pre-order should be fulfilled' });
    }

    if (!normalizedPreOrder && fulfillmentMethod !== normalizedOrderType) {
      return res.status(400).json({ message: 'Order type mismatch. Please try again.' });
    }

    if (fulfillmentMethod === 'delivery' && !deliveryAddress?.text?.trim()) {
      return res.status(400).json({ message: 'Delivery address is required for delivery orders' });
    }

    if (fulfillmentMethod === 'dine-in' && !String(tableNumber || '').trim()) {
      return res.status(400).json({ message: 'Please select a table for dine-in orders' });
    }

    if ((normalizedPreOrder || normalizedOrderType === 'dine-in') && !scheduledTime) {
      return res.status(400).json({ message: 'Please select a schedule time first' });
    }

    const scheduleError = validateScheduledTime(normalizedPreOrder ? 'pre-order' : normalizedOrderType, scheduledTime);
    if (scheduleError) {
      return res.status(400).json({ message: scheduleError });
    }

    if (normalizedPreOrder && paymentMethod === 'cod') {
      return res.status(400).json({ message: 'Pre-orders require advance payment' });
    }

    if (!['online', 'cod', 'wallet', 'upi', 'bank'].includes(paymentMethod)) {
      return res.status(400).json({ message: 'Please choose a valid payment method' });
    }

    if (paymentMethod === 'online' && !paymentVerified) {
      return res.status(400).json({ message: 'Please complete online payment before placing the order' });
    }

    if (['upi', 'bank', 'online'].includes(paymentMethod) && !String(paymentReference || '').trim()) {
      return res.status(400).json({ message: `Please enter your ${paymentMethod === 'bank' ? 'bank' : 'payment'} reference` });
    }

    if (!customerAcceptedTerms) {
      return res.status(400).json({ message: 'Please accept the order rules first' });
    }

    const orderItems = [];

    for (const item of items) {
      const menuItem = await MenuItem.findById(item.menuItemId);
      if (!menuItem || !menuItem.isAvailable) {
        return res.status(400).json({ message: `${menuItem?.name || 'Item'} is not available` });
      }

      let unitPrice = menuItem.basePrice;
      if (item.variant) {
        const variant = menuItem.variants.find((v) => v.name === item.variant);
        if (variant) unitPrice = variant.price;
      }

      let addonTotal = 0;
      const addons = [];
      if (item.addons?.length) {
        for (const addonName of item.addons) {
          const addon = menuItem.addons.find((a) => a.name === addonName);
          if (addon) {
            addonTotal += addon.price;
            addons.push({ name: addon.name, price: addon.price });
          }
        }
      }

      const itemTotalPrice = (unitPrice + addonTotal) * item.quantity;
      subtotal += itemTotalPrice;

      orderItems.push({
        menuItem: menuItem._id,
        name: menuItem.name,
        quantity: item.quantity,
        variant: item.variant,
        addons,
        unitPrice: unitPrice + addonTotal,
        totalPrice: itemTotalPrice,
      });
    }

    let discount = 0;
    let appliedCouponCode = '';
    if (couponCode?.trim()) {
      const promotion = await Promotion.findOne({ code: couponCode.trim().toUpperCase() });
      if (!promotion || !isPromotionLive(promotion)) {
        return res.status(400).json({ message: 'Coupon is not active right now' });
      }
      if (subtotal < (promotion.minOrderAmount || 0)) {
        return res.status(400).json({ message: `Minimum order amount for this coupon is Rs. ${promotion.minOrderAmount || 0}` });
      }
      discount = computeDiscount(promotion, subtotal);
      appliedCouponCode = promotion.code;
      promotion.usageCount += 1;
      await promotion.save();
    }

    const deliveryFee = fulfillmentMethod === 'delivery' ? 30 : 0;
    const preOrderFee = normalizedPreOrder ? PRE_ORDER_FEE : 0;
    const taxAmount = Math.round(subtotal * 0.05);
    const normalizedTipAmount = fulfillmentMethod === 'delivery' ? Math.max(0, Number(tipAmount) || 0) : 0;
    const totalAmount = subtotal + taxAmount + deliveryFee + preOrderFee + normalizedTipAmount - discount;
    const deliveryOTP = fulfillmentMethod === 'delivery' ? generateDeliveryOTP() : undefined;
    const orderId = generateShortId();

    let paymentStatus = 'pending';

    if (paymentMethod === 'wallet') {
      const customer = await User.findById(customerId);
      if (!customer) {
        return res.status(404).json({ message: 'Customer account not found' });
      }
      if ((customer.walletBalance || 0) < totalAmount) {
        return res.status(400).json({ message: 'Not enough wallet balance for this order' });
      }

      customer.walletBalance -= totalAmount;
      await customer.save();
      paymentStatus = 'paid';
    }

    if (['upi', 'bank'].includes(paymentMethod) || (paymentMethod === 'online' && paymentVerified)) {
      paymentStatus = 'paid';
    }

    const order = await Order.create({
      orderId,
      customer: customerId,
      items: orderItems,
      orderType: normalizedOrderType,
      isPreOrder: normalizedPreOrder,
      preOrderMethod: normalizedPreOrder ? fulfillmentMethod : '',
      tableNumber: String(tableNumber || '').trim(),
      guestCount: fulfillmentMethod === 'dine-in' ? Math.max(1, Number(guestCount) || 1) : 0,
      deliveryAddress,
      scheduledTime,
      subtotal,
      taxAmount,
      deliveryFee,
      preOrderFee,
      tipAmount: normalizedTipAmount,
      deliveryPayout: fulfillmentMethod === 'delivery' ? deliveryFee + normalizedTipAmount : 0,
      discount,
      totalAmount,
      paymentMethod,
      paymentStatus,
      paymentId: ['upi', 'bank', 'online'].includes(paymentMethod) ? String(paymentReference || '').trim() : '',
      couponCode: appliedCouponCode,
      customerAcceptedTerms: Boolean(customerAcceptedTerms),
      specialNotes,
      deliveryOTP,
      estimatedDeliveryAt: fulfillmentMethod === 'delivery' ? buildEstimatedDeliveryAt(45) : null,
      estimatedDurationMinutes: fulfillmentMethod === 'delivery' ? 45 : 0,
      etaUpdatedAt: fulfillmentMethod === 'delivery' ? new Date() : null,
      status: 'placed',
      statusHistory: [{ status: 'placed', updatedAt: new Date(), updatedBy: customerId }],
      notificationLog: [],
    });

    const populated = await Order.findById(order._id)
      .populate('customer', 'name phone email')
      .populate('deliveryAgent', 'name phone isOnline vehicleType')
      .populate('items.menuItem', 'name image');

    const io = req.app.get('io');
    if (io) {
      io.to('kitchen').emit('new-order', { order: populated });
      io.to('staff').emit('new-order', { order: populated });
      io.emit('newOrder', populated);
    }

    emitOrderUpdate(req, populated, { message: 'Order placed successfully' });
    await pushNotification(req, populated, 'placed', 'Your order has been placed successfully. The cafe will confirm it soon.');
    emitOrderUpdate(req, populated, { message: 'Order placed notification sent' });

    res.status(201).json({ message: 'Order placed successfully', order: populated });
  } catch (err) {
    console.error('Order Placement Error:', err);
    if (err.code === 11000) {
      return res.status(400).json({ message: 'Duplicate Order ID detected. Please try placing the order again.' });
    }
    res.status(500).json({ message: err.message });
  }
};

exports.createPOSOrder = async (req, res) => {
  let subtotal = 0;

  try {
    const {
      items,
      orderType,
      paymentMethod,
      guestName,
      guestPhone,
      tableNumber,
      notes,
      scheduledTime,
    } = req.body;

    if (!['takeaway', 'dine-in', 'pre-order'].includes(orderType)) {
      return res.status(400).json({ message: 'Invalid POS order type' });
    }

    if (!items || items.length === 0) {
      return res.status(400).json({ message: 'Add at least one item to the ticket' });
    }

    if (orderType === 'pre-order' && !scheduledTime) {
      return res.status(400).json({ message: 'Scheduled time is required for pre-orders' });
    }

    if (orderType === 'dine-in' && !tableNumber?.trim()) {
      return res.status(400).json({ message: 'Table number is required for dine-in POS orders' });
    }

    const orderItems = [];

    for (const item of items) {
      const menuItem = await MenuItem.findById(item.menuItemId);
      if (!menuItem || !menuItem.isAvailable) {
        return res.status(400).json({ message: `${menuItem?.name || 'Item'} is not available` });
      }

      const quantity = Math.max(1, Number(item.quantity) || 1);
      const unitPrice = menuItem.basePrice;
      const itemTotalPrice = unitPrice * quantity;
      subtotal += itemTotalPrice;

      orderItems.push({
        menuItem: menuItem._id,
        name: menuItem.name,
        quantity,
        unitPrice,
        totalPrice: itemTotalPrice,
      });
    }

    const walkInCustomer = await getOrCreateWalkInCustomer();
    const taxAmount = Math.round(subtotal * 0.05);
    const preOrderFee = orderType === 'pre-order' ? PRE_ORDER_FEE : 0;
    const totalAmount = subtotal + taxAmount + preOrderFee;
    const mappedPaymentMethod = paymentMethod === 'cash' ? 'cod' : 'online';
    const status = 'confirmed';
    const orderId = generateShortId();

    const order = await Order.create({
      orderId,
      customer: walkInCustomer._id,
      source: 'staff-pos',
      guestName: guestName?.trim?.() || 'Walk-In Guest',
      guestPhone: guestPhone?.trim?.() || '',
      tableNumber: tableNumber?.trim?.() || '',
      createdByStaff: req.user._id,
      items: orderItems,
      orderType,
      status,
      scheduledTime: scheduledTime || null,
      subtotal,
      taxAmount,
      preOrderFee,
      totalAmount,
      paymentMethod: mappedPaymentMethod,
      paymentStatus: 'paid',
      customerAcceptedTerms: true,
      specialNotes: notes?.trim?.() || '',
      statusHistory: [{ status, updatedAt: new Date(), updatedBy: req.user._id, note: 'Created from POS' }],
      notificationLog: [{
        status,
        title: 'Counter order created',
        message: 'A staff member created this order from the POS counter.',
        channels: ['internal'],
        sentAt: new Date(),
      }],
    });

    const populated = await Order.findById(order._id)
      .populate('customer', 'name phone email')
      .populate('createdByStaff', 'name email phone')
      .populate('assignedStaff', 'name email phone')
      .populate('items.menuItem', 'name image');

    const io = req.app.get('io');
    if (io) {
      io.to('kitchen').emit('new-order', { order: populated });
      io.to('staff').emit('new-order', { order: populated });
      io.emit('newOrder', populated);
    }

    emitOrderUpdate(req, populated, { message: 'POS order created' });

    res.status(201).json({ message: 'POS order created successfully', order: populated });
  } catch (err) {
    console.error('POS Order Creation Error:', err);
    if (err.code === 11000) {
      return res.status(400).json({ message: 'Duplicate Order ID detected. Please try again.' });
    }
    res.status(500).json({ message: err.message });
  }
};

exports.getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ customer: req.user._id, isDeleted: { $ne: true } })
      .sort({ createdAt: -1 })
      .populate('items.menuItem', 'name image')
      .populate('deliveryAgent', 'name phone profilePhoto isOnline vehicleType');
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('customer', 'name phone email')
      .populate('createdByStaff', 'name email phone')
      .populate('assignedStaff', 'name email phone')
      .populate('deliveryAgent', 'name phone profilePhoto isOnline vehicleType')
      .populate('items.menuItem', 'name image');

    if (!order) return res.status(404).json({ message: 'Order not found' });

    const allowedRoles = ['admin', 'manager', 'staff', 'kitchen', 'delivery'];
    if (!allowedRoles.includes(req.user.role) && order.customer._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getPublicInvoiceOrder = async (req, res) => {
  try {
    const order = await buildPublicInvoiceOrderQuery(req.params.id);

    if (!order) return res.status(404).json({ message: 'Order not found' });
    if (!canExposePublicInvoice(order)) {
      return res.status(400).json({ message: 'Invoice is available only after order completion' });
    }

    ensureInvoiceFields(order, order.invoiceIssuedBy || null);
    await order.save();
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateStatus = async (req, res) => {
  try {
    const { status, paymentCollectionMethod, paymentNote, paymentReference } = req.body;
    const normalizedNextStatus = String(status || '').toLowerCase();
    const order = await Order.findById(req.params.id)
      .populate('customer', 'name phone email')
      .populate('assignedStaff', 'name email phone')
      .populate('deliveryAgent', 'name phone profilePhoto isOnline vehicleType');

    if (!order) return res.status(404).json({ message: 'Order not found' });

    if (req.user.role === 'staff') {
      const normalizedStatus = String(status || '').toLowerCase();
      const currentStatus = String(order.status || '').toLowerCase();
      const normalizedCollectionMethod = String(paymentCollectionMethod || '').toLowerCase().trim();
      const canConfirmOrder = normalizedStatus === 'confirmed';
      const canCompleteService = normalizedStatus === 'completed' && order.orderType !== 'delivery';
      const canCancelDeliveryRun = normalizedStatus === 'cancelled' && order.orderType === 'delivery';

      if (!canConfirmOrder && !canCompleteService && !canCancelDeliveryRun) {
        return res.status(403).json({ message: 'Staff can only confirm orders, complete ready dine-in/takeaway service, or cancel an active delivery run' });
      }

      if (canConfirmOrder) {
        if (!['placed', 'confirmed'].includes(currentStatus)) {
          return res.status(400).json({ message: 'Only placed orders can be confirmed by staff' });
        }
        if (currentStatus === 'confirmed') {
          return res.json({ message: 'Order already confirmed', order });
        }
        if (order.isPreOrder && order.scheduledTime) {
          const scheduledAt = new Date(order.scheduledTime);
          const minutesUntilScheduled = Math.ceil((scheduledAt.getTime() - Date.now()) / 60000);
          if (Number.isFinite(minutesUntilScheduled) && minutesUntilScheduled > 30) {
            return res.status(400).json({
              message: `Pre-orders can be confirmed only within 30 minutes of the scheduled time. Try again in ${minutesUntilScheduled - 30} minute(s).`
            });
          }
        }
      }

      if (canCompleteService) {
        if (currentStatus !== 'ready') {
          return res.status(400).json({ message: 'Only ready dine-in or takeaway orders can be completed by staff' });
        }
        if (String(order.paymentMethod || '').toLowerCase() === 'cod' && !['cash', 'upi'].includes(normalizedCollectionMethod)) {
          return res.status(400).json({ message: 'Please select Cash or UPI before completing a COD order' });
        }
      }

      if (canCancelDeliveryRun && currentStatus !== 'out-for-delivery') {
        return res.status(400).json({ message: 'Only orders that are out for delivery can be cancelled by staff' });
      }

      if (order.assignedStaff && order.assignedStaff._id.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: 'This order is currently assigned to another staff member' });
      }
      if (!order.assignedStaff) {
        order.assignedStaff = req.user._id;
      }

      if (canCompleteService && String(order.paymentMethod || '').toLowerCase() === 'cod') {
        order.paymentStatus = 'paid';
        order.paidAt = new Date();
        order.paymentConfirmedBy = req.user._id;
        order.paymentNote = String(paymentNote || '').trim();
        order.deliveryPayment = {
          ...(order.deliveryPayment?.toObject ? order.deliveryPayment.toObject() : order.deliveryPayment || {}),
          method: normalizedCollectionMethod,
          status: 'paid',
          amount: Number(order.totalAmount || 0),
          reference: String(paymentReference || '').trim(),
          note: String(paymentNote || '').trim(),
          confirmedAt: new Date(),
          confirmedBy: req.user._id,
          source: 'staff-panel',
        };
      }
    }

    if (String(req.user.role || '').toLowerCase() === 'kitchen' && normalizedNextStatus === 'preparing' && order.isPreOrder && order.scheduledTime) {
      const scheduledAt = new Date(order.scheduledTime);
      const minutesUntilScheduled = Math.ceil((scheduledAt.getTime() - Date.now()) / 60000);
      const prepLeadMinutes = getPreOrderPrepLeadMinutes(order);
      if (Number.isFinite(minutesUntilScheduled) && minutesUntilScheduled > prepLeadMinutes) {
        return res.status(400).json({
          message: `Pre-order preparation can start only within ${prepLeadMinutes} minutes of the scheduled time. Try again in ${minutesUntilScheduled - prepLeadMinutes} minute(s).`
        });
      }
    }

    order.status = status;
    if (String(status || '').toLowerCase() === 'cancelled' && order.orderType === 'delivery') {
      order.deliveryAgent = null;
      order.liveLocation = {
        lat: null,
        lng: null,
        locationName: '',
        address: '',
        updatedAt: null,
      };
    }
    if (order.paymentMethod === 'cod' && ['completed', 'delivered'].includes(status) && String(req.user.role || '').toLowerCase() !== 'staff') {
      order.paymentStatus = 'paid';
    }
    if (String(order.paymentStatus || '').toLowerCase() === 'paid' && !order.paidAt && ['completed', 'delivered'].includes(status)) {
      order.paidAt = new Date();
      order.paymentConfirmedBy = order.paymentConfirmedBy || req.user._id;
    }
    if (!order.paymentNote && String(paymentNote || '').trim()) {
      order.paymentNote = String(paymentNote || '').trim();
    }
    if (order.orderType === 'delivery' && status === 'ready' && !order.estimatedDeliveryAt) {
      order.estimatedDeliveryAt = buildEstimatedDeliveryAt(25);
      order.estimatedDurationMinutes = 25;
      order.etaUpdatedAt = new Date();
    }
    if (['completed', 'delivered'].includes(status)) {
      ensureInvoiceFields(order, req.user._id);
    }

    order.statusHistory.push({ status, updatedAt: new Date(), updatedBy: req.user._id });
    await order.save();
    emitOrderUpdate(req, order, { message: `Order updated to ${status}` });
    await pushNotification(req, order, status);
    emitOrderUpdate(req, order, { message: `Notification sent for ${status}` });

    if (status === 'ready' && order.orderType === 'delivery') {
      const io = req.app.get('io');
      if (io) {
        io.to('delivery').emit('orderReadyForPickup', {
          orderId: order.orderId,
          orderDbId: order._id,
          customerName: order.customer?.name,
        });
      }
    }

    res.json({ message: `Order status updated to ${status}`, order });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.downloadInvoice = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('customer', 'name email phone')
      .populate('items.menuItem', 'name');

    if (!order) return res.status(404).json({ message: 'Order not found' });

    if (req.user.role === 'customer' && order.customer?._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    if (!['completed', 'delivered'].includes(order.status)) {
      return res.status(400).json({ message: 'Invoice is available only after order completion' });
    }

    ensureInvoiceFields(order, req.user._id);
    await order.save();

    const doc = new PDFDocument({ size: 'A4', margin: 50 });
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=invoice-${order.orderId || order._id}.pdf`);
    doc.pipe(res);

    const formatCurrency = (value) => `Rs. ${Number(value || 0).toFixed(2)}`;
    const formatDate = (value) => new Date(value).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' });

    const pageWidth = doc.page.width - doc.page.margins.left - doc.page.margins.right;
    const left = doc.page.margins.left;
    const right = left + pageWidth;
    const orderAmount = Number(order.totalAmount || 0);
    const customerName = order.customer?.name || 'Guest';
    const customerPhone = order.customer?.phone || 'Not available';
    const paymentLabel = String(order.paymentMethod || 'online').replace(/-/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase());
    const drawValueRow = (label, value, y) => {
      doc.font('Helvetica').fontSize(11).fillColor('#5a4a3b').text(label, left, y, { width: 180 });
      doc.font('Helvetica-Bold').fontSize(11).fillColor('#1f1a17').text(value, right - 180, y, {
        width: 180,
        align: 'right',
      });
    };

    doc
      .roundedRect(left, 42, pageWidth, 92, 18)
      .fill('#faf3ea');

    doc.fillColor('#2b211a').font('Helvetica-Bold').fontSize(22).text('ROLLER COASTER CAFE', left + 20, 60, {
      width: pageWidth - 40,
      align: 'center',
    });
    doc.font('Helvetica').fontSize(11).fillColor('#6f5c4b').text(
      'under nutan school, juna road, opposite by navjeevan hospital, Ahmedabad, Bareja, Gujarat 382425',
      left + 32,
      90,
      { width: pageWidth - 64, align: 'center' }
    );

    doc.y = 160;
    doc.font('Helvetica-Bold').fontSize(18).fillColor('#1f1a17').text('E-BILL');
    doc.font('Helvetica').fontSize(11).fillColor('#6f5c4b').text(`Invoice Number: ${order.invoiceNumber}`);

    const metaTop = 210;
    const metaHeight = 118;
    const metaWidth = (pageWidth - 18) / 2;

    doc.roundedRect(left, metaTop, metaWidth, metaHeight, 16).fill('#fffaf4');
    doc.roundedRect(left + metaWidth + 18, metaTop, metaWidth, metaHeight, 16).fill('#fffaf4');

    doc.fillColor('#8d6c4d').font('Helvetica').fontSize(10).text('ORDER SNAPSHOT', left + 18, metaTop + 16);
    doc.font('Helvetica-Bold').fontSize(12).fillColor('#1f1a17').text(`Order Number`, left + 18, metaTop + 36);
    doc.font('Helvetica').fontSize(11).fillColor('#4f4034').text(String(order.orderId || order._id), left + 18, metaTop + 54);
    doc.font('Helvetica-Bold').fontSize(12).fillColor('#1f1a17').text(`Amount`, left + 18, metaTop + 76);
    doc.font('Helvetica').fontSize(11).fillColor('#4f4034').text(formatCurrency(orderAmount), left + 18, metaTop + 94);

    const rightMetaLeft = left + metaWidth + 18 + 18;
    doc.fillColor('#8d6c4d').font('Helvetica').fontSize(10).text('CUSTOMER DETAILS', rightMetaLeft, metaTop + 16);
    doc.font('Helvetica-Bold').fontSize(12).fillColor('#1f1a17').text(customerName, rightMetaLeft, metaTop + 36);
    doc.font('Helvetica').fontSize(11).fillColor('#4f4034').text(customerPhone, rightMetaLeft, metaTop + 54);
    doc.text(formatDate(order.createdAt), rightMetaLeft, metaTop + 72);
    doc.text(`Paid via ${paymentLabel}`, rightMetaLeft, metaTop + 90);

    const tableTop = 360;
    const col1 = left;
    const col2 = left + 270;
    const col3 = left + 340;
    const col4 = left + 430;
    const rowHeight = 30;

    doc.roundedRect(left, tableTop, pageWidth, rowHeight, 10).fill('#f1e4d4');
    doc.fillColor('#4c3828').font('Helvetica-Bold').fontSize(11);
    doc.text('Name', col1 + 12, tableTop + 9, { width: 240 });
    doc.text('Qty.', col2 + 6, tableTop + 9, { width: 50, align: 'center' });
    doc.text('Rate', col3 + 6, tableTop + 9, { width: 70, align: 'center' });
    doc.text('Price', col4 + 6, tableTop + 9, { width: 90, align: 'center' });

    let currentY = tableTop + rowHeight;
    (order.items || []).forEach((item, index) => {
      const rowBg = index % 2 === 0 ? '#fffaf4' : '#ffffff';
      const lineTotal = Number(item.totalPrice || (item.unitPrice || item.price || 0) * (item.quantity || 1));
      const unitRate = Number(item.unitPrice || item.price || 0);

      doc.rect(left, currentY, pageWidth, rowHeight).fill(rowBg);
      doc.fillColor('#1f1a17').font('Helvetica').fontSize(11);
      doc.text(item.name || item.menuItem?.name || 'Item', col1 + 12, currentY + 9, { width: 240 });
      doc.text(String(item.quantity || 1), col2 + 6, currentY + 9, { width: 50, align: 'center' });
      doc.text(formatCurrency(unitRate), col3 + 6, currentY + 9, { width: 70, align: 'center' });
      doc.text(formatCurrency(lineTotal), col4 + 6, currentY + 9, { width: 90, align: 'center' });
      currentY += rowHeight;
    });

    currentY += 18;
    drawValueRow('Subtotal', formatCurrency(order.subtotal), currentY);
    currentY += 24;
    drawValueRow('GST', formatCurrency(order.taxAmount), currentY);
    if (order.deliveryFee) {
      currentY += 24;
      drawValueRow('Delivery Fee', formatCurrency(order.deliveryFee), currentY);
    }
    if (order.tipAmount) {
      currentY += 24;
      drawValueRow('Tip', formatCurrency(order.tipAmount), currentY);
    }
    if (order.preOrderFee) {
      currentY += 24;
      drawValueRow('Pre-order Fee', formatCurrency(order.preOrderFee), currentY);
    }
    if (order.discount) {
      currentY += 24;
      drawValueRow('Discount', `- ${formatCurrency(order.discount)}`, currentY);
    }

    currentY += 34;
    doc.roundedRect(left, currentY - 10, pageWidth, 42, 12).fill('#f7efe4');
    doc.font('Helvetica-Bold').fontSize(14).fillColor('#1f1a17').text('Total Payable Amount', left + 14, currentY + 3);
    doc.text(formatCurrency(order.totalAmount), right - 180, currentY + 3, { width: 180, align: 'right' });

    currentY += 62;
    doc.roundedRect(left, currentY - 8, pageWidth, 34, 10).stroke('#eadfce');
    doc.font('Helvetica').fontSize(10).fillColor('#4f4034').text(`Order Type: ${order.orderType}`, left + 12, currentY + 2);
    doc.text(`Paid via ${paymentLabel}`, right - 180, currentY + 2, { width: 168, align: 'right' });

    currentY += 48;
    doc.font('Helvetica').fontSize(10).fillColor('#6f5c4b').text(
      'Thank you for choosing Roller Coaster Cafe. Please visit again.',
      left,
      currentY,
      { width: pageWidth, align: 'center' }
    );
    doc.end();
  } catch (err) {
    console.error('Invoice download error:', err);
    res.status(500).json({ message: err.message });
  }
};

exports.assignStaff = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('assignedStaff', 'name email phone');
    if (!order) return res.status(404).json({ message: 'Order not found' });

    if (req.user.role === 'staff') {
      if (order.assignedStaff && order.assignedStaff._id.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: 'This order is already claimed by another staff member' });
      }
    }

    order.assignedStaff = req.user._id;
    await order.save();
    await order.populate('assignedStaff', 'name email phone');

    res.json({ message: 'Order claimed successfully', order });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// NEW: Get delivery panel data
exports.getDeliveryPanelData = async (req, res) => {
  try {
    const deliveryAgentId = req.user._id;
    
    // Get agent details
    const agent = await User.findById(deliveryAgentId).select('-password');
    
    // Get available orders (ready for pickup, not assigned to anyone)
    const availableOrders = await Order.find({
      orderType: 'delivery',
      status: 'ready',
      deliveryAgent: null,
      isDeleted: { $ne: true }
    })
    .sort({ createdAt: 1 })
    .populate('customer', 'name phone')
    .populate('items.menuItem', 'name image');
    
    // Get assigned orders (assigned to this agent, not delivered)
    const assignedOrders = await Order.find({
      orderType: 'delivery',
      deliveryAgent: deliveryAgentId,
      status: { $in: ['ready', 'out-for-delivery'] },
      isDeleted: { $ne: true }
    })
    .sort({ createdAt: -1 })
    .populate('customer', 'name phone')
    .populate('items.menuItem', 'name image');
    
    // Get history orders (delivered or rejected by this agent)
    const historyOrders = await Order.find({
      orderType: 'delivery',
      deliveryAgent: deliveryAgentId,
      status: { $in: ['delivered', 'rejected'] },
      isDeleted: { $ne: true }
    })
    .sort({ deliveredAt: -1, createdAt: -1 })
    .limit(50)
    .populate('customer', 'name phone')
    .populate('items.menuItem', 'name image');
    
    // Get recent activity
    const activity = [];
    
    // Add delivered orders to activity
    const recentDelivered = await Order.find({
      orderType: 'delivery',
      deliveryAgent: deliveryAgentId,
      status: 'delivered',
      deliveredAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
    })
    .sort({ deliveredAt: -1 })
    .limit(10)
    .populate('customer', 'name');
    
    recentDelivered.forEach(order => {
      activity.push({
        id: order._id,
        orderId: order.orderId,
        customerName: order.customer?.name || 'Customer',
        type: 'delivered',
        at: order.deliveredAt,
        amount: order.deliveryPayout,
      });
    });
    
    // Add rejected orders to activity
    const recentRejected = await Order.find({
      orderType: 'delivery',
      deliveryAgent: deliveryAgentId,
      status: 'rejected',
      'statusHistory.status': 'rejected'
    })
    .sort({ updatedAt: -1 })
    .limit(10)
    .populate('customer', 'name');
    
    recentRejected.forEach(order => {
      const rejectEntry = order.statusHistory.find(h => h.status === 'rejected');
      activity.push({
        id: order._id,
        orderId: order.orderId,
        customerName: order.customer?.name || 'Customer',
        type: 'rejected',
        at: rejectEntry?.updatedAt || order.updatedAt,
        note: rejectEntry?.note || order.cancelReason || 'Order rejected',
      });
    });
    
    // Sort activity by date
    activity.sort((a, b) => new Date(b.at) - new Date(a.at));
    
    // Calculate stats
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const completedToday = await Order.countDocuments({
      orderType: 'delivery',
      deliveryAgent: deliveryAgentId,
      status: 'delivered',
      deliveredAt: { $gte: today }
    });
    
    const rejectedToday = await Order.countDocuments({
      orderType: 'delivery',
      deliveryAgent: deliveryAgentId,
      status: 'rejected',
      updatedAt: { $gte: today }
    });
    
    const earningsToday = await Order.aggregate([
      {
        $match: {
          orderType: 'delivery',
          deliveryAgent: deliveryAgentId,
          status: 'delivered',
          deliveredAt: { $gte: today }
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$deliveryPayout' }
        }
      }
    ]);
    
    const tipsToday = await Order.aggregate([
      {
        $match: {
          orderType: 'delivery',
          deliveryAgent: deliveryAgentId,
          status: 'delivered',
          deliveredAt: { $gte: today }
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$tipAmount' }
        }
      }
    ]);
    
    const stats = {
      availableCount: availableOrders.length,
      assignedCount: assignedOrders.length,
      completedToday,
      pickedToday: completedToday,
      rejectedToday,
      delayedCount: assignedOrders.filter(o => 
        o.status === 'out-for-delivery' && 
        o.estimatedDeliveryAt && 
        new Date(o.estimatedDeliveryAt) < new Date()
      ).length,
      earningsToday: earningsToday[0]?.total || 0,
      tipsToday: tipsToday[0]?.total || 0,
      averageRating: null,
    };
    
    res.json({
      agent,
      availableOrders,
      assignedOrders,
      historyOrders,
      activity: activity.slice(0, 20),
      stats,
    });
  } catch (err) {
    console.error('Delivery Panel Error:', err);
    res.status(500).json({ message: err.message });
  }
};

// NEW: Accept order (pickup)
exports.acceptOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { estimatedDeliveryAt } = req.body;
    
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    if (order.status !== 'ready') {
      return res.status(400).json({ message: 'Order is not ready for pickup' });
    }
    
    if (order.deliveryAgent) {
      return res.status(400).json({ message: 'Order already assigned to another rider' });
    }
    
    order.deliveryAgent = req.user._id;
    order.status = 'out-for-delivery';
    order.estimatedDeliveryAt = estimatedDeliveryAt || buildEstimatedDeliveryAt(25);
    order.estimatedDurationMinutes = 25;
    order.etaUpdatedAt = new Date();
    order.statusHistory.push({
      status: 'out-for-delivery',
      updatedAt: new Date(),
      updatedBy: req.user._id,
      note: 'Order picked up by rider'
    });
    
    await order.save();
    
    const populated = await Order.findById(orderId)
      .populate('customer', 'name phone email')
      .populate('deliveryAgent', 'name phone');
    
    // Emit socket events
    const io = req.app.get('io');
    if (io) {
      io.to(`order:${orderId}`).emit('order-updated', {
        orderId: order._id,
        status: 'out-for-delivery',
        estimatedDeliveryAt: order.estimatedDeliveryAt,
        deliveryAgent: populated.deliveryAgent
      });
      io.to(`user:${order.customer._id}`).emit('order-updated', {
        orderId: order._id,
        status: 'out-for-delivery'
      });
    }
    
    const deliveryOtpMessage = `Your rider is on the way with your order. Your delivery OTP is ${order.deliveryOTP}. Share it only at handoff and use the tracking link in this email to follow your order.`;
    await pushNotification(req, populated, 'out-for-delivery', deliveryOtpMessage);
    
    res.json({ message: 'Order accepted successfully', order: populated });
  } catch (err) {
    console.error('Accept Order Error:', err);
    res.status(500).json({ message: err.message });
  }
};

// NEW: Reject order
exports.rejectOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { reason } = req.body;
    
    const trimmedReason = String(reason || '').trim();
    if (!trimmedReason) {
      return res.status(400).json({ message: 'Reject reason is required' });
    }

    const order = await Order.findById(orderId).populate('customer', 'name phone email');
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    if (order.status !== 'ready') {
      return res.status(400).json({ message: 'Can only reject orders that are ready' });
    }

    order.deliveryAgent = null;
    order.status = 'preparing';
    order.estimatedDeliveryAt = null;
    order.estimatedDurationMinutes = null;
    order.etaUpdatedAt = null;
    order.delayReason = '';
    order.deliveryRejections.push({
      agent: req.user._id,
      rejectedAt: new Date(),
      reason: trimmedReason,
    });
    order.statusHistory.push({
      status: 'preparing',
      updatedAt: new Date(),
      updatedBy: req.user._id,
      note: `Delivery request rejected by rider: ${trimmedReason}. Order moved back to preparing for reassignment.`,
    });
    
    await order.save();
    emitOrderUpdate(req, order, {
      message: 'Delivery request rejected by rider',
      latestDeliveryRejection: order.deliveryRejections[order.deliveryRejections.length - 1],
    });
    await pushNotification(
      req,
      order,
      'preparing',
      'A delivery partner declined this order. It has been moved back to preparing and a new rider will be assigned soon.'
    );
    
    // Emit socket event
    const io = req.app.get('io');
    if (io) {
      const payload = {
        orderId: order.orderId,
        orderDbId: order._id,
        customerName: order.customer?.name || 'Customer',
        reason: trimmedReason,
        rejectedBy: req.user._id,
        status: order.status,
      };
      io.to('delivery').emit('order-rejected', payload);
      io.to('admin-map').emit('delivery-order-rejected', payload);
      io.emit('manager-delivery-rejection', payload);
    }
    
    res.json({ message: 'Order rejected successfully and moved back to preparing', order });
  } catch (err) {
    console.error('Reject Order Error:', err);
    res.status(500).json({ message: err.message });
  }
};

// NEW: Deliver order with OTP verification
exports.deliverOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { deliveryOTP, receiverName, proofNote, photoUrl } = req.body;
    
    const order = await Order.findById(orderId).populate('customer', 'name phone email');
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    if (order.status !== 'out-for-delivery') {
      return res.status(400).json({ message: 'Order is not out for delivery' });
    }
    
    // Verify OTP
    if (!deliveryOTP || order.deliveryOTP !== deliveryOTP) {
      return res.status(400).json({ message: 'Invalid OTP. Please check and try again.' });
    }
    
    // Update order
    order.status = 'delivered';
    order.deliveredAt = new Date();
    order.receiverName = receiverName;
    order.proofNote = proofNote;
    if (photoUrl) order.proofPhotoUrl = photoUrl;
    order.statusHistory.push({ 
      status: 'delivered', 
      updatedAt: new Date(), 
      updatedBy: req.user._id,
      note: `Delivered with OTP verification: ${deliveryOTP}`
    });
    
    await order.save();
    
    // Update agent stats
    const agent = await User.findById(req.user._id);
    if (agent) {
      agent.totalEarnings = (agent.totalEarnings || 0) + (order.deliveryPayout || 0);
      agent.completedDeliveries = (agent.completedDeliveries || 0) + 1;
      await agent.save();
    }
    
    if (order.customer?.phone) {
      await sendOrderSMS(order.customer.phone, order, 'delivered');
    }
    
    // Emit socket events for real-time update
    const io = req.app.get('io');
    if (io) {
      io.to(`order:${order._id}`).emit('order-updated', {
        orderId: order._id,
        status: 'delivered',
        message: 'Order has been delivered successfully!'
      });
      io.to(`user:${order.customer._id}`).emit('order-updated', {
        orderId: order._id,
        status: 'delivered'
      });
      io.to('delivery').emit('delivery-completed', {
        orderId: order.orderId,
        agentId: req.user._id
      });
    }
    
    res.json({ message: 'Order delivered successfully', order });
  } catch (err) {
    console.error('Delivery Error:', err);
    res.status(500).json({ message: err.message });
  }
};

// NEW: Update ETA
exports.updateETA = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { minutes, delayReason, estimatedDeliveryAt } = req.body;
    
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    if (order.deliveryAgent?.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'You are not assigned to this order' });
    }
    
    order.estimatedDeliveryAt = estimatedDeliveryAt || buildEstimatedDeliveryAt(minutes);
    order.estimatedDurationMinutes = minutes;
    order.etaUpdatedAt = new Date();
    if (delayReason) order.delayReason = delayReason;
    
    order.statusHistory.push({
      status: order.status,
      updatedAt: new Date(),
      updatedBy: req.user._id,
      note: `ETA updated to ${minutes} minutes${delayReason ? `. Reason: ${delayReason}` : ''}`
    });
    
    await order.save();
    
    // Emit socket event
    const io = req.app.get('io');
    if (io) {
      io.to(`order:${order._id}`).emit('eta-updated', {
        orderId: order._id,
        estimatedDeliveryAt: order.estimatedDeliveryAt,
        delayReason: order.delayReason
      });
      io.to(`user:${order.customer._id}`).emit('eta-updated', {
        orderId: order._id,
        estimatedDeliveryAt: order.estimatedDeliveryAt
      });
    }
    
    res.json({ message: 'ETA updated successfully', order });
  } catch (err) {
    console.error('Update ETA Error:', err);
    res.status(500).json({ message: err.message });
  }
};

// NEW: Cancel delivery (return to ready queue)
exports.cancelDelivery = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { reason } = req.body;
    
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    if (order.deliveryAgent?.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'You are not assigned to this order' });
    }
    
    if (order.status !== 'out-for-delivery') {
      return res.status(400).json({ message: 'Can only cancel delivery for orders that are out for delivery' });
    }
    
    order.deliveryAgent = null;
    order.status = 'ready';
    order.statusHistory.push({
      status: 'ready',
      updatedAt: new Date(),
      updatedBy: req.user._id,
      note: `Delivery cancelled by rider: ${reason || 'Unable to complete delivery'}`
    });
    
    await order.save();
    
    // Emit socket event
    const io = req.app.get('io');
    if (io) {
      io.to('delivery').emit('orderReadyForPickup', {
        orderId: order.orderId,
        orderDbId: order._id,
        customerName: order.customer?.name
      });
    }
    
    res.json({ message: 'Delivery cancelled, order returned to ready queue', order });
  } catch (err) {
    console.error('Cancel Delivery Error:', err);
    res.status(500).json({ message: err.message });
  }
};

// NEW: Toggle delivery agent availability
exports.toggleAvailability = async (req, res) => {
  try {
    const agent = await User.findById(req.user._id);
    if (!agent) {
      return res.status(404).json({ message: 'Agent not found' });
    }
    
    agent.isOnline = !agent.isOnline;
    await agent.save();
    
    // Emit socket event
    const io = req.app.get('io');
    if (io) {
      io.to('delivery').emit('agent-status-changed', {
        agentId: agent._id,
        isOnline: agent.isOnline
      });
    }
    
    res.json({ message: `You are now ${agent.isOnline ? 'online' : 'offline'}`, isOnline: agent.isOnline });
  } catch (err) {
    console.error('Toggle Availability Error:', err);
    res.status(500).json({ message: err.message });
  }
};

// NEW: Update delivery agent profile
exports.updateProfile = async (req, res) => {
  try {
    const { name, phone, vehicleType, password } = req.body;
    const agent = await User.findById(req.user._id);
    
    if (!agent) {
      return res.status(404).json({ message: 'Agent not found' });
    }
    
    if (name) agent.name = name;
    if (phone) agent.phone = phone;
    if (vehicleType) agent.vehicleType = vehicleType;
    if (password && password.trim()) {
      agent.password = password;
    }
    
    await agent.save();
    
    res.json({ message: 'Profile updated successfully', agent: { ...agent.toObject(), password: undefined } });
  } catch (err) {
    console.error('Update Profile Error:', err);
    res.status(500).json({ message: err.message });
  }
};

// NEW: Update live location
exports.updateLocation = async (req, res) => {
  try {
    const { orderId, lat, lng } = req.body;
    
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    if (order.deliveryAgent?.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'You are not assigned to this order' });
    }
    
    order.liveLocation = {
      lat,
      lng,
      updatedAt: new Date()
    };
    
    await order.save();
    
    // Emit real-time location to customer
    const io = req.app.get('io');
    if (io) {
      io.to(`order:${orderId}`).emit('location-update', {
        orderId: order._id,
        location: { lat, lng },
        timestamp: new Date()
      });
      if (order.customer) {
        io.to(`user:${order.customer}`).emit('location-update', {
          orderId: order._id,
          location: { lat, lng }
        });
      }
    }
    
    res.json({ message: 'Location updated' });
  } catch (err) {
    console.error('Update Location Error:', err);
    res.status(500).json({ message: err.message });
  }
};

// NEW: Upload proof photo
exports.uploadProofPhoto = async (req, res) => {
  try {
    const { orderId } = req.params;
    
    if (!req.file) {
      return res.status(400).json({ message: 'No photo uploaded' });
    }
    
    // Upload to cloud storage (implement based on your storage solution)
    // For now, return a placeholder URL
    const photoUrl = `/uploads/delivery-proof/${orderId}-${Date.now()}.jpg`;
    
    res.json({ photoUrl, message: 'Photo uploaded successfully' });
  } catch (err) {
    console.error('Upload Photo Error:', err);
    res.status(500).json({ message: err.message });
  }
};

// NEW: Delete order (from history or assigned)
exports.deleteOrder = async (req, res) => {
  try {
    const orderId = req.params.id || req.params.orderId;

    if (!orderId) {
      return res.status(400).json({ message: 'Order ID is required' });
    }
    
    let order = await Order.findById(orderId);
    if (!order) {
      order = await Order.findOne({ orderId });
    }
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    const normalizedStatus = String(order.status || '').toLowerCase();
    const normalizedRole = String(req.user?.role || '').toLowerCase();

    // Only allow deletion of completed old records
    if (!['completed', 'delivered', 'rejected', 'cancelled'].includes(normalizedStatus)) {
      return res.status(400).json({ message: 'Only completed, delivered, rejected, or cancelled orders can be deleted' });
    }

    if (normalizedRole === 'customer' && String(order.customer || '') !== String(req.user._id || '')) {
      return res.status(403).json({ message: 'You can only delete your own order history' });
    }

    if (!['customer', 'staff', 'admin', 'manager'].includes(normalizedRole)) {
      return res.status(403).json({ message: 'You are not allowed to delete this order' });
    }
    
    order.isDeleted = true;
    order.deletedAt = new Date();
    order.deletedBy = req.user._id;
    
    await order.save();
    
    res.json({ message: 'Order deleted successfully' });
  } catch (err) {
    console.error('Delete Order Error:', err);
    res.status(500).json({ message: err.message });
  }
};

// NEW: Bulk delete orders
exports.bulkDeleteOrders = async (req, res) => {
  try {
    const { orderIds } = req.body;
    
    if (!orderIds || !orderIds.length) {
      return res.status(400).json({ message: 'No orders selected' });
    }
    
    const result = await Order.updateMany(
      {
        _id: { $in: orderIds },
        status: { $in: ['delivered', 'rejected', 'cancelled'] }
      },
      {
        isDeleted: true,
        deletedAt: new Date(),
        deletedBy: req.user._id
      }
    );
    
    res.json({ message: `${result.modifiedCount} orders deleted successfully` });
  } catch (err) {
    console.error('Bulk Delete Error:', err);
    res.status(500).json({ message: err.message });
  }
};

// NEW: Clear all history orders for this agent
exports.clearHistory = async (req, res) => {
  try {
    const result = await Order.updateMany(
      {
        deliveryAgent: req.user._id,
        status: { $in: ['delivered', 'rejected', 'cancelled'] },
        isDeleted: { $ne: true }
      },
      {
        isDeleted: true,
        deletedAt: new Date(),
        deletedBy: req.user._id
      }
    );
    
    res.json({ message: `${result.modifiedCount} history orders cleared` });
  } catch (err) {
    console.error('Clear History Error:', err);
    res.status(500).json({ message: err.message });
  }
};

// NEW: Cancel assigned order (remove from my orders without delivering)
exports.cancelAssignedOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { reason } = req.body;
    
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    if (order.deliveryAgent?.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'You are not assigned to this order' });
    }
    
    if (order.status !== 'ready') {
      return res.status(400).json({ message: 'Can only cancel orders that are not yet out for delivery' });
    }
    
    order.deliveryAgent = null;
    order.statusHistory.push({
      status: 'ready',
      updatedAt: new Date(),
      updatedBy: req.user._id,
      note: `Order cancelled by rider: ${reason || 'No longer able to deliver'}`
    });
    
    await order.save();
    
    // Emit socket event
    const io = req.app.get('io');
    if (io) {
      io.to('delivery').emit('orderReadyForPickup', {
        orderId: order.orderId,
        orderDbId: order._id,
        customerName: order.customer?.name
      });
    }
    
    res.json({ message: 'Order removed from your list', order });
  } catch (err) {
    console.error('Cancel Assigned Order Error:', err);
    res.status(500).json({ message: err.message });
  }
};

exports.rateDelivery = async (req, res) => {
  try {
    const { score, review } = req.body;
    const normalizedScore = Number(score);

    if (!Number.isInteger(normalizedScore) || normalizedScore < 1 || normalizedScore > 5) {
      return res.status(400).json({ message: 'Rating must be between 1 and 5' });
    }

    const order = await Order.findById(req.params.id)
      .populate('customer', 'name phone email')
      .populate('deliveryAgent', 'name phone profilePhoto');

    if (!order) return res.status(404).json({ message: 'Order not found' });

    if (req.user.role !== 'customer' || order.customer?._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Only the customer for this order can rate the delivery' });
    }

    if (order.orderType !== 'delivery' || order.status !== 'delivered') {
      return res.status(400).json({ message: 'You can rate a delivery only after it is completed' });
    }

    order.deliveryRating = {
      score: normalizedScore,
      review: review?.trim?.() || '',
      ratedAt: new Date(),
    };
    await order.save();

    emitOrderUpdate(req, order, { deliveryRating: order.deliveryRating });
    res.json({ message: 'Delivery rated successfully', order });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.cancelOrder = async (req, res) => {
  try {
    const { reason } = req.body;
    const order = await Order.findById(req.params.id).populate('customer', 'name phone email');
    if (!order) return res.status(404).json({ message: 'Order not found' });

    if (['delivered', 'cancelled'].includes(order.status)) {
      return res.status(400).json({ message: 'Cannot cancel this order' });
    }

    order.status = 'cancelled';
    order.cancelReason = reason;
    order.statusHistory.push({ status: 'cancelled', updatedAt: new Date(), updatedBy: req.user._id });
    await order.save();
    emitOrderUpdate(req, order, { message: 'Order cancelled' });
    await pushNotification(req, order, 'cancelled');

    res.json({ message: 'Order cancelled', order });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getAllOrders = async (req, res) => {
  try {
    const { status, orderType, page = 1, limit = 20, startDate, endDate } = req.query;
    const filter = { isDeleted: { $ne: true } };

    if (status === 'active') {
      filter.status = { $in: ['placed', 'confirmed', 'preparing', 'ready', 'out-for-delivery'] };
    } else if (status && status !== 'all') {
      filter.status = status.toLowerCase();
    }

    if (orderType) filter.orderType = orderType;

    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) filter.createdAt.$gte = new Date(startDate);
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        filter.createdAt.$lte = end;
      }
    }

    const orders = await Order.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .populate('customer', 'name phone email')
      .populate('createdByStaff', 'name email phone')
      .populate('assignedStaff', 'name email phone')
      .populate('deliveryAgent', 'name phone isOnline vehicleType')
      .populate('items.menuItem', 'name image');

    const total = await Order.countDocuments(filter);

    res.json({
      orders,
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
    });
  } catch (err) {
    console.error('Fetch All Orders Error:', err);
    res.status(500).json({ message: err.message });
  }
};

// Add to Order model schema (add these fields if not present)
/*
isDeleted: { type: Boolean, default: false },
deletedAt: Date,
deletedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
receiverName: String,
proofNote: String,
proofPhotoUrl: String,
deliveryOTP: String,
liveLocation: {
  lat: Number,
  lng: Number,
  updatedAt: Date
},
deliveryPayout: { type: Number, default: 0 },
delayReason: String,
isOnline: { type: Boolean, default: false },
vehicleType: { type: String, default: 'bike' },
totalEarnings: { type: Number, default: 0 },
completedDeliveries: { type: Number, default: 0 }
*/
