// const express = require('express');
// const router = express.Router();
// const { protect } = require('../middleware/auth');
// const crypto = require('crypto');
// const Razorpay = require('razorpay');
// const User = require('../models/User');
// const Promotion = require('../models/promotion');
// const Order = require('../models/Order');
// const MenuItem = require('../models/MenuItem');

// const now = () => new Date();

// const isPromotionLive = (promotion) => {
//   const current = now();
//   if (!promotion.isActive) return false;
//   if (promotion.startDate && new Date(promotion.startDate) > current) return false;
//   if (promotion.endDate && new Date(promotion.endDate) < current) return false;
//   return true;
// };

// const formatPromotion = (promotion) => ({
//   _id: promotion._id,
//   code: promotion.code,
//   type: promotion.type,
//   value: promotion.value,
//   minOrderAmount: promotion.minOrderAmount || 0,
//   description: promotion.description || '',
//   startDate: promotion.startDate,
//   endDate: promotion.endDate,
//   isActive: promotion.isActive,
//   usageCount: promotion.usageCount || 0,
//   discountLabel: promotion.type === 'percentage' ? `${promotion.value}% off` : `Rs. ${promotion.value} off`,
// });

// const computeDiscount = (promotion, orderAmount) => {
//   if (promotion.type === 'percentage') {
//     return Math.round((orderAmount * promotion.value) / 100);
//   }
//   return Math.round(promotion.value);
// };

// const PRE_ORDER_FEE = 49;

// const razorpay = process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET
//   ? new Razorpay({
//       key_id: process.env.RAZORPAY_KEY_ID,
//       key_secret: process.env.RAZORPAY_KEY_SECRET,
//     })
//   : null;

// const calculateCheckoutAmount = async ({ items = [], orderType, isPreOrder = false, couponCode, tipAmount = 0 }) => {
//   let subtotal = 0;

//   for (const item of items) {
//     const menuItem = await MenuItem.findById(item.menuItemId);
//     if (!menuItem || !menuItem.isAvailable) {
//       throw new Error(`${menuItem?.name || 'Item'} is not available`);
//     }

//     let unitPrice = menuItem.basePrice;
//     if (item.variant) {
//       const variant = menuItem.variants.find((v) => v.name === item.variant);
//       if (variant) unitPrice = variant.price;
//     }

//     let addonTotal = 0;
//     if (item.addons?.length) {
//       for (const addonName of item.addons) {
//         const addon = menuItem.addons.find((a) => a.name === addonName);
//         if (addon) addonTotal += addon.price;
//       }
//     }

//     subtotal += (unitPrice + addonTotal) * Number(item.quantity || 0);
//   }

//   let discount = 0;
//   let appliedCouponCode = '';
//   if (couponCode?.trim()) {
//     const normalizedCode = couponCode.trim().toUpperCase();
//     const promotion = await Promotion.findOne({ code: normalizedCode });
//     const starterOffer = promotion ? null : findStarterOffer(normalizedCode);

//     if ((!promotion || !isPromotionLive(promotion)) && !starterOffer) {
//       throw new Error('Coupon is not active right now');
//     }

//     const activePromotion = starterOffer || promotion;
//     if (subtotal < (activePromotion.minOrderAmount || 0)) {
//       throw new Error(`Minimum order amount for this coupon is Rs. ${activePromotion.minOrderAmount || 0}`);
//     }

//     discount = computeDiscount(activePromotion, subtotal);
//     appliedCouponCode = activePromotion.code;
//   }

//   const taxAmount = Math.round(subtotal * 0.05);
//   const deliveryFee = orderType === 'delivery' ? 30 : 0;
//   const normalizedTipAmount = orderType === 'delivery' ? Math.max(0, Number(tipAmount) || 0) : 0;
//   const preOrderFee = isPreOrder ? PRE_ORDER_FEE : 0;
//   const totalAmount = subtotal + taxAmount + deliveryFee + normalizedTipAmount + preOrderFee - discount;

//   return {
//     subtotal,
//     taxAmount,
//     deliveryFee,
//     tipAmount: normalizedTipAmount,
//     preOrderFee,
//     discount,
//     totalAmount,
//     couponCode: appliedCouponCode,
//   };
// };

// const buildStarterOffers = () => ([
//   {
//     _id: 'starter-welcome',
//     code: 'WELCOME50',
//     type: 'flat',
//     value: 50,
//     minOrderAmount: 299,
//     description: 'Welcome offer for new customers on their first comfort-food order.',
//     startDate: null,
//     endDate: null,
//     isActive: true,
//     usageCount: 0,
//     discountLabel: 'Rs. 50 off',
//   },
//   {
//     _id: 'starter-takeaway',
//     code: 'TAKEAWAY20',
//     type: 'percentage',
//     value: 20,
//     minOrderAmount: 249,
//     description: 'Save on takeaway orders when you want a quick pickup from the cafe.',
//     startDate: null,
//     endDate: null,
//     isActive: true,
//     usageCount: 0,
//     discountLabel: '20% off',
//   },
//   {
//     _id: 'starter-preorder',
//     code: 'READY30',
//     type: 'flat',
//     value: 30,
//     minOrderAmount: 199,
//     description: 'Small saving on pre-orders so your meal is ready while you are on the way.',
//     startDate: null,
//     endDate: null,
//     isActive: true,
//     usageCount: 0,
//     discountLabel: 'Rs. 30 off',
//   },
// ]);

// const findStarterOffer = (code) => buildStarterOffers().find((offer) => offer.code === code);

// const parseNotificationId = (notificationId) => {
//   const parts = String(notificationId || '').split('-');
//   const index = Number(parts.pop());
//   const orderDbId = parts.join('-');

//   if (!orderDbId || Number.isNaN(index)) {
//     return null;
//   }

//   return { orderDbId, index };
// };

// router.get('/profile', protect, async (req, res) => {
//   try {
//     const user = await User.findById(req.user._id);
//     res.json(user);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// });

// router.put('/profile', protect, async (req, res) => {
//   try {
//     const { name, phone, profilePhoto } = req.body;
//     const user = await User.findByIdAndUpdate(req.user._id, { name, phone, profilePhoto }, { new: true });
//     res.json(user);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// });

// router.get('/offers', protect, async (req, res) => {
//   try {
//     const promotions = await Promotion.find({ isActive: true }).sort({ createdAt: -1 });
//     const livePromotions = promotions.filter(isPromotionLive).map(formatPromotion);
//     res.json(livePromotions.length ? livePromotions : buildStarterOffers());
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// });

// router.post('/validate-coupon', protect, async (req, res) => {
//   try {
//     const { code, orderAmount = 0 } = req.body;

//     if (!code?.trim()) {
//       return res.status(400).json({ message: 'Coupon code is required' });
//     }

//     const normalizedCode = code.trim().toUpperCase();
//     const promotion = await Promotion.findOne({ code: normalizedCode });
//     const starterOffer = promotion ? null : findStarterOffer(normalizedCode);

//     if ((!promotion || !isPromotionLive(promotion)) && !starterOffer) {
//       return res.status(404).json({ message: 'Coupon is not active right now' });
//     }

//     const activePromotion = starterOffer || promotion;

//     if (Number(orderAmount) < (activePromotion.minOrderAmount || 0)) {
//       return res.status(400).json({
//         message: `Minimum order amount for this coupon is Rs. ${activePromotion.minOrderAmount || 0}`,
//       });
//     }

//     const discount = computeDiscount(activePromotion, Number(orderAmount));
//     res.json({
//       valid: true,
//       discount,
//       promotion: starterOffer ? starterOffer : formatPromotion(promotion),
//       message: `${activePromotion.code} applied successfully`,
//     });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// });

// router.post('/payments/create-order', protect, async (req, res) => {
//   try {
//     if (!razorpay) {
//       return res.status(503).json({ message: 'Razorpay is not configured on the server' });
//     }

//     const { items, orderType, isPreOrder = false, couponCode, tipAmount = 0 } = req.body;

//     if (!Array.isArray(items) || !items.length) {
//       return res.status(400).json({ message: 'No items available for payment' });
//     }

//     const pricing = await calculateCheckoutAmount({ items, orderType, isPreOrder, couponCode, tipAmount });

//     const razorpayOrder = await razorpay.orders.create({
//       amount: Math.round(pricing.totalAmount * 100),
//       currency: 'INR',
//       receipt: `rcafe_${Date.now()}`.slice(0, 40),
//       notes: {
//         customerId: String(req.user._id),
//         orderType: String(orderType || ''),
//         isPreOrder: String(Boolean(isPreOrder)),
//       },
//     });

//     res.json({
//       key: process.env.RAZORPAY_KEY_ID,
//       orderId: razorpayOrder.id,
//       amount: razorpayOrder.amount,
//       currency: razorpayOrder.currency,
//       pricing,
//       customer: {
//         name: req.user.name || '',
//         email: req.user.email || '',
//         phone: req.user.phone || '',
//       },
//     });
//   } catch (err) {
//     res.status(400).json({ message: err.message || 'Unable to start online payment' });
//   }
// });

// router.post('/payments/verify', protect, async (req, res) => {
//   try {
//     const {
//       razorpayOrderId,
//       razorpayPaymentId,
//       razorpaySignature,
//     } = req.body;

//     if (!razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
//       return res.status(400).json({ message: 'Incomplete Razorpay payment details' });
//     }

//     const expectedSignature = crypto
//       .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
//       .update(`${razorpayOrderId}|${razorpayPaymentId}`)
//       .digest('hex');

//     if (expectedSignature !== razorpaySignature) {
//       return res.status(400).json({ message: 'Payment signature verification failed' });
//     }

//     res.json({
//       verified: true,
//       paymentId: razorpayPaymentId,
//       orderId: razorpayOrderId,
//     });
//   } catch (err) {
//     res.status(500).json({ message: err.message || 'Unable to verify payment' });
//   }
// });

// router.get('/notifications', protect, async (req, res) => {
//   try {
//     const orders = await Order.find({ customer: req.user._id })
//       .sort({ createdAt: -1 })
//       .select('orderId orderType status createdAt notificationLog');

//     const notifications = orders
//       .flatMap((order) =>
//         (order.notificationLog || []).map((note, index) => ({
//           id: `${order._id}-${index}`,
//           orderDbId: order._id,
//           orderId: order.orderId,
//           orderType: order.orderType,
//           status: note.status || order.status,
//           title: note.title,
//           message: note.message,
//           channels: note.channels || [],
//           sentAt: note.sentAt,
//         }))
//       )
//       .sort((a, b) => new Date(b.sentAt) - new Date(a.sentAt));

//     res.json(notifications);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// });

// router.delete('/notifications/:notificationId', protect, async (req, res) => {
//   try {
//     const parsed = parseNotificationId(req.params.notificationId);

//     if (!parsed) {
//       return res.status(400).json({ message: 'Invalid notification id' });
//     }

//     const order = await Order.findOne({
//       _id: parsed.orderDbId,
//       customer: req.user._id,
//     });

//     if (!order) {
//       return res.status(404).json({ message: 'Notification not found' });
//     }

//     const currentLog = Array.isArray(order.notificationLog) ? [...order.notificationLog] : [];

//     if (parsed.index < 0 || parsed.index >= currentLog.length) {
//       return res.status(404).json({ message: 'Notification not found' });
//     }

//     currentLog.splice(parsed.index, 1);

//     await Order.updateOne(
//       { _id: order._id, customer: req.user._id },
//       { $set: { notificationLog: currentLog } }
//     );

//     res.json({ success: true });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// });

// router.post('/notifications/delete-many', protect, async (req, res) => {
//   try {
//     const ids = Array.isArray(req.body?.ids) ? req.body.ids : [];

//     if (!ids.length) {
//       return res.status(400).json({ message: 'No notifications selected' });
//     }

//     const groupedByOrder = ids.reduce((acc, notificationId) => {
//       const parsed = parseNotificationId(notificationId);
//       if (!parsed) return acc;

//       if (!acc[parsed.orderDbId]) {
//         acc[parsed.orderDbId] = [];
//       }

//       acc[parsed.orderDbId].push(parsed.index);
//       return acc;
//     }, {});

//     const orderIds = Object.keys(groupedByOrder);

//     if (!orderIds.length) {
//       return res.status(400).json({ message: 'Invalid notifications selected' });
//     }

//     const orders = await Order.find({
//       _id: { $in: orderIds },
//       customer: req.user._id,
//     });

//     await Promise.all(
//       orders.map(async (order) => {
//         const indexes = (groupedByOrder[String(order._id)] || []).sort((a, b) => b - a);
//         const currentLog = Array.isArray(order.notificationLog) ? [...order.notificationLog] : [];

//         indexes.forEach((index) => {
//           if (index >= 0 && index < currentLog.length) {
//             currentLog.splice(index, 1);
//           }
//         });

//         await Order.updateOne(
//           { _id: order._id, customer: req.user._id },
//           { $set: { notificationLog: currentLog } }
//         );
//       })
//     );

//     res.json({ success: true });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// });

// module.exports = router;


const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const crypto = require('crypto');
const Razorpay = require('razorpay');
const User = require('../models/User');
const Promotion = require('../models/promotion');
const Order = require('../models/Order');
const MenuItem = require('../models/MenuItem');

const now = () => new Date();

const isPromotionLive = (promotion) => {
  const current = now();
  if (!promotion.isActive) return false;
  if (promotion.startDate && new Date(promotion.startDate) > current) return false;
  if (promotion.endDate && new Date(promotion.endDate) < current) return false;
  return true;
};

const formatPromotion = (promotion) => ({
  _id: promotion._id,
  code: promotion.code,
  type: promotion.type,
  value: promotion.value,
  minOrderAmount: promotion.minOrderAmount || 0,
  description: promotion.description || '',
  startDate: promotion.startDate,
  endDate: promotion.endDate,
  isActive: promotion.isActive,
  usageCount: promotion.usageCount || 0,
  discountLabel: promotion.type === 'percentage' ? `${promotion.value}% off` : `Rs. ${promotion.value} off`,
});

const computeDiscount = (promotion, orderAmount) => {
  if (promotion.type === 'percentage') {
    return Math.round((orderAmount * promotion.value) / 100);
  }
  return Math.round(promotion.value);
};

const PRE_ORDER_FEE = 49;

const razorpay = process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET
  ? new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    })
  : null;

const calculateCheckoutAmount = async ({ items = [], orderType, isPreOrder = false, couponCode, tipAmount = 0 }) => {
  let subtotal = 0;

  for (const item of items) {
    const menuItem = await MenuItem.findById(item.menuItemId);
    if (!menuItem || !menuItem.isAvailable) {
      throw new Error(`${menuItem?.name || 'Item'} is not available`);
    }

    let unitPrice = menuItem.basePrice;
    if (item.variant) {
      const variant = menuItem.variants.find((v) => v.name === item.variant);
      if (variant) unitPrice = variant.price;
    }

    let addonTotal = 0;
    if (item.addons?.length) {
      for (const addonName of item.addons) {
        const addon = menuItem.addons.find((a) => a.name === addonName);
        if (addon) addonTotal += addon.price;
      }
    }

    subtotal += (unitPrice + addonTotal) * Number(item.quantity || 0);
  }

  let discount = 0;
  let appliedCouponCode = '';
  if (couponCode?.trim()) {
    const normalizedCode = couponCode.trim().toUpperCase();
    const promotion = await Promotion.findOne({ code: normalizedCode });
    const starterOffer = promotion ? null : findStarterOffer(normalizedCode);

    if ((!promotion || !isPromotionLive(promotion)) && !starterOffer) {
      throw new Error('Coupon is not active right now');
    }

    const activePromotion = starterOffer || promotion;
    if (subtotal < (activePromotion.minOrderAmount || 0)) {
      throw new Error(`Minimum order amount for this coupon is Rs. ${activePromotion.minOrderAmount || 0}`);
    }

    discount = computeDiscount(activePromotion, subtotal);
    appliedCouponCode = activePromotion.code;
  }

  const taxAmount = Math.round(subtotal * 0.05);
  const deliveryFee = orderType === 'delivery' ? 30 : 0;
  const normalizedTipAmount = orderType === 'delivery' ? Math.max(0, Number(tipAmount) || 0) : 0;
  const preOrderFee = isPreOrder ? PRE_ORDER_FEE : 0;
  const totalAmount = subtotal + taxAmount + deliveryFee + normalizedTipAmount + preOrderFee - discount;

  return {
    subtotal,
    taxAmount,
    deliveryFee,
    tipAmount: normalizedTipAmount,
    preOrderFee,
    discount,
    totalAmount,
    couponCode: appliedCouponCode,
  };
};

const buildStarterOffers = () => ([
  {
    _id: 'starter-welcome',
    code: 'WELCOME50',
    type: 'flat',
    value: 50,
    minOrderAmount: 299,
    description: 'Welcome offer for new customers on their first comfort-food order.',
    startDate: null,
    endDate: null,
    isActive: true,
    usageCount: 0,
    discountLabel: 'Rs. 50 off',
  },
  {
    _id: 'starter-takeaway',
    code: 'TAKEAWAY20',
    type: 'percentage',
    value: 20,
    minOrderAmount: 249,
    description: 'Save on takeaway orders when you want a quick pickup from the cafe.',
    startDate: null,
    endDate: null,
    isActive: true,
    usageCount: 0,
    discountLabel: '20% off',
  },
  {
    _id: 'starter-preorder',
    code: 'READY30',
    type: 'flat',
    value: 30,
    minOrderAmount: 199,
    description: 'Small saving on pre-orders so your meal is ready while you are on the way.',
    startDate: null,
    endDate: null,
    isActive: true,
    usageCount: 0,
    discountLabel: 'Rs. 30 off',
  },
]);

const findStarterOffer = (code) => buildStarterOffers().find((offer) => offer.code === code);

const parseNotificationId = (notificationId) => {
  const parts = String(notificationId || '').split('-');
  const index = Number(parts.pop());
  const orderDbId = parts.join('-');

  if (!orderDbId || Number.isNaN(index)) {
    return null;
  }

  return { orderDbId, index };
};

router.get('/profile', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put('/profile', protect, async (req, res) => {
  try {
    const { name, phone } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user._id, 
      { name, phone }, 
      { new: true, runValidators: true }
    ).select('-password');
    
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/offers', protect, async (req, res) => {
  try {
    const promotions = await Promotion.find({ isActive: true }).sort({ createdAt: -1 });
    const livePromotions = promotions.filter(isPromotionLive).map(formatPromotion);
    res.json(livePromotions.length ? livePromotions : buildStarterOffers());
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/validate-coupon', protect, async (req, res) => {
  try {
    const { code, orderAmount = 0 } = req.body;

    if (!code?.trim()) {
      return res.status(400).json({ message: 'Coupon code is required' });
    }

    const normalizedCode = code.trim().toUpperCase();
    const promotion = await Promotion.findOne({ code: normalizedCode });
    const starterOffer = promotion ? null : findStarterOffer(normalizedCode);

    if ((!promotion || !isPromotionLive(promotion)) && !starterOffer) {
      return res.status(404).json({ message: 'Coupon is not active right now' });
    }

    const activePromotion = starterOffer || promotion;

    if (Number(orderAmount) < (activePromotion.minOrderAmount || 0)) {
      return res.status(400).json({
        message: `Minimum order amount for this coupon is Rs. ${activePromotion.minOrderAmount || 0}`,
      });
    }

    const discount = computeDiscount(activePromotion, Number(orderAmount));
    res.json({
      valid: true,
      discount,
      promotion: starterOffer ? starterOffer : formatPromotion(promotion),
      message: `${activePromotion.code} applied successfully`,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/payments/create-order', protect, async (req, res) => {
  try {
    if (!razorpay) {
      return res.status(503).json({ message: 'Razorpay is not configured on the server' });
    }

    const { items, orderType, isPreOrder = false, couponCode, tipAmount = 0 } = req.body;

    if (!Array.isArray(items) || !items.length) {
      return res.status(400).json({ message: 'No items available for payment' });
    }

    const pricing = await calculateCheckoutAmount({ items, orderType, isPreOrder, couponCode, tipAmount });

    const razorpayOrder = await razorpay.orders.create({
      amount: Math.round(pricing.totalAmount * 100),
      currency: 'INR',
      receipt: `rcafe_${Date.now()}`.slice(0, 40),
      notes: {
        customerId: String(req.user._id),
        orderType: String(orderType || ''),
        isPreOrder: String(Boolean(isPreOrder)),
      },
    });

    res.json({
      key: process.env.RAZORPAY_KEY_ID,
      orderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      pricing,
      customer: {
        name: req.user.name || '',
        email: req.user.email || '',
        phone: req.user.phone || '',
      },
    });
  } catch (err) {
    res.status(400).json({ message: err.message || 'Unable to start online payment' });
  }
});

router.post('/payments/verify', protect, async (req, res) => {
  try {
    const {
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature,
    } = req.body;

    if (!razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
      return res.status(400).json({ message: 'Incomplete Razorpay payment details' });
    }

    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpayOrderId}|${razorpayPaymentId}`)
      .digest('hex');

    if (expectedSignature !== razorpaySignature) {
      return res.status(400).json({ message: 'Payment signature verification failed' });
    }

    res.json({
      verified: true,
      paymentId: razorpayPaymentId,
      orderId: razorpayOrderId,
    });
  } catch (err) {
    res.status(500).json({ message: err.message || 'Unable to verify payment' });
  }
});

router.get('/notifications', protect, async (req, res) => {
  try {
    const orders = await Order.find({ customer: req.user._id })
      .sort({ createdAt: -1 })
      .select('orderId orderType status createdAt notificationLog');

    const notifications = orders
      .flatMap((order) =>
        (order.notificationLog || []).map((note, index) => ({
          id: `${order._id}-${index}`,
          orderDbId: order._id,
          orderId: order.orderId,
          orderType: order.orderType,
          status: note.status || order.status,
          title: note.title,
          message: note.message,
          channels: note.channels || [],
          sentAt: note.sentAt,
        }))
      )
      .sort((a, b) => new Date(b.sentAt) - new Date(a.sentAt));

    res.json(notifications);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.delete('/notifications/:notificationId', protect, async (req, res) => {
  try {
    const parsed = parseNotificationId(req.params.notificationId);

    if (!parsed) {
      return res.status(400).json({ message: 'Invalid notification id' });
    }

    const order = await Order.findOne({
      _id: parsed.orderDbId,
      customer: req.user._id,
    });

    if (!order) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    const currentLog = Array.isArray(order.notificationLog) ? [...order.notificationLog] : [];

    if (parsed.index < 0 || parsed.index >= currentLog.length) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    currentLog.splice(parsed.index, 1);

    await Order.updateOne(
      { _id: order._id, customer: req.user._id },
      { $set: { notificationLog: currentLog } }
    );

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/notifications/delete-many', protect, async (req, res) => {
  try {
    const ids = Array.isArray(req.body?.ids) ? req.body.ids : [];

    if (!ids.length) {
      return res.status(400).json({ message: 'No notifications selected' });
    }

    const groupedByOrder = ids.reduce((acc, notificationId) => {
      const parsed = parseNotificationId(notificationId);
      if (!parsed) return acc;

      if (!acc[parsed.orderDbId]) {
        acc[parsed.orderDbId] = [];
      }

      acc[parsed.orderDbId].push(parsed.index);
      return acc;
    }, {});

    const orderIds = Object.keys(groupedByOrder);

    if (!orderIds.length) {
      return res.status(400).json({ message: 'Invalid notifications selected' });
    }

    const orders = await Order.find({
      _id: { $in: orderIds },
      customer: req.user._id,
    });

    await Promise.all(
      orders.map(async (order) => {
        const indexes = (groupedByOrder[String(order._id)] || []).sort((a, b) => b - a);
        const currentLog = Array.isArray(order.notificationLog) ? [...order.notificationLog] : [];

        indexes.forEach((index) => {
          if (index >= 0 && index < currentLog.length) {
            currentLog.splice(index, 1);
          }
        });

        await Order.updateOne(
          { _id: order._id, customer: req.user._id },
          { $set: { notificationLog: currentLog } }
        );
      })
    );

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
