// const express = require('express');
// const router = express.Router();
// const { protect } = require('../middleware/auth');
// const { allowRoles } = require('../middleware/roleCheck');
// const User = require('../models/User');
// const Order = require('../models/Order');
// const MenuItem = require('../models/MenuItem');
// const { sendAccountDeletionEmail } = require('../services/emailService');
// const { sendAdministrativeSMS } = require('../services/smsService');

// const USER_ROLES = ['admin', 'manager', 'staff', 'kitchen', 'delivery', 'customer'];
// const INTERNAL_ROLES = ['manager', 'staff', 'kitchen', 'delivery'];

// function buildRevenueRangeConfig(range = 'last7days', now = new Date()) {
//   const todayStart = new Date(now);
//   todayStart.setHours(0, 0, 0, 0);

//   const yesterdayStart = new Date(todayStart);
//   yesterdayStart.setDate(yesterdayStart.getDate() - 1);

//   switch (String(range || '').toLowerCase()) {
//     case 'today':
//       return {
//         key: 'today',
//         start: todayStart,
//         end: now,
//         granularity: 'hour',
//         chartTitle: 'Revenue Today',
//         chartDescription: 'Hourly revenue for the current day',
//         summaryLabel: 'Today Total',
//       };
//     case 'yesterday':
//       return {
//         key: 'yesterday',
//         start: yesterdayStart,
//         end: todayStart,
//         granularity: 'hour',
//         chartTitle: 'Revenue Yesterday',
//         chartDescription: 'Hourly revenue for the previous day',
//         summaryLabel: 'Yesterday Total',
//       };
//     case 'last30days':
//     case 'lastmonth':
//       return {
//         key: 'last30days',
//         start: new Date(todayStart.getFullYear(), todayStart.getMonth(), todayStart.getDate() - 29),
//         end: now,
//         granularity: 'day',
//         chartTitle: 'Revenue Last 30 Days',
//         chartDescription: 'Daily revenue for the last 30 days',
//         summaryLabel: '30 Day Total',
//       };
//     default:
//       return {
//         key: 'last7days',
//         start: new Date(todayStart.getFullYear(), todayStart.getMonth(), todayStart.getDate() - 6),
//         end: now,
//         granularity: 'day',
//         chartTitle: 'Revenue Last 7 Days',
//         chartDescription: 'Daily revenue for the last 7 days',
//         summaryLabel: '7 Day Total',
//       };
//   }
// }

// function buildLocalDateBoundary(dateInput, endOfDay = false) {
//   const date = new Date(dateInput);
//   if (Number.isNaN(date.getTime())) return null;
//   if (endOfDay) {
//     date.setHours(23, 59, 59, 999);
//   } else {
//     date.setHours(0, 0, 0, 0);
//   }
//   return date;
// }

// function buildRevenueChartPoints(rawRows = [], rangeConfig, now = new Date()) {
//   if (rangeConfig.granularity === 'hour') {
//     return Array.from({ length: 24 }, (_, hour) => {
//       const found = rawRows.find((row) => row._id?.hour === hour);
//       return {
//         day: new Date(2000, 0, 1, hour).toLocaleTimeString('en-IN', {
//           hour: 'numeric',
//           hour12: true,
//         }),
//         revenue: found?.revenue || 0,
//       };
//     });
//   }

//   const points = [];
//   const cursor = new Date(rangeConfig.start);
//   const endBoundary = new Date(rangeConfig.end);

//   while (cursor <= endBoundary) {
//     const found = rawRows.find((row) =>
//       row._id?.year === cursor.getFullYear()
//       && row._id?.month === cursor.getMonth() + 1
//       && row._id?.day === cursor.getDate()
//     );

//     points.push({
//       day: cursor.toLocaleDateString('en-IN', {
//         day: '2-digit',
//         month: points.length > 6 ? 'short' : undefined,
//         weekday: points.length <= 6 ? 'short' : undefined,
//       }),
//       revenue: found?.revenue || 0,
//     });

//     cursor.setDate(cursor.getDate() + 1);
//     cursor.setHours(0, 0, 0, 0);
//   }

//   return points;
// }

// async function getAdminSummary(range = 'last7days') {
//   const now = new Date();
//   const todayStart = new Date(now);
//   todayStart.setHours(0, 0, 0, 0);
//   const revenueRangeConfig = buildRevenueRangeConfig(range, now);

//   const yesterdayStart = new Date(todayStart);
//   yesterdayStart.setDate(todayStart.getDate() - 1);

//   const [
//     totalUsers,
//     activeUsers,
//     usersByRole,
//     totalMenuItems,
//     availableMenuItems,
//     orderStatusCounts,
//     orderTypeCounts,
//     todayDelivered,
//     yesterdayDelivered,
//     revenueRangeRaw,
//     topSellingItems,
//     onlineDeliveryAgents,
//   ] = await Promise.all([
//     User.countDocuments(),
//     User.countDocuments({ isActive: true }),
//     User.aggregate([
//       { $group: { _id: '$role', count: { $sum: 1 } } },
//     ]),
//     MenuItem.countDocuments({ isArchived: false }),
//     MenuItem.countDocuments({ isArchived: false, isAvailable: true }),
//     Order.aggregate([
//       { $group: { _id: '$status', count: { $sum: 1 } } },
//     ]),
//     Order.aggregate([
//       { $group: { _id: '$orderType', count: { $sum: 1 } } },
//     ]),
//     Order.aggregate([
//       { $match: { status: 'delivered', createdAt: { $gte: todayStart } } },
//       { $group: { _id: null, revenue: { $sum: '$totalAmount' }, orders: { $sum: 1 } } },
//     ]),
//     Order.aggregate([
//       {
//         $match: {
//           status: 'delivered',
//           createdAt: { $gte: yesterdayStart, $lt: todayStart },
//         },
//       },
//       { $group: { _id: null, revenue: { $sum: '$totalAmount' }, orders: { $sum: 1 } } },
//     ]),
//     Order.aggregate([
//       {
//         $match: {
//           status: 'delivered',
//           createdAt: { $gte: revenueRangeConfig.start, $lt: revenueRangeConfig.end },
//         },
//       },
//       {
//         $group: {
//           _id: revenueRangeConfig.granularity === 'hour'
//             ? { hour: { $hour: '$createdAt' } }
//             : {
//               year: { $year: '$createdAt' },
//               month: { $month: '$createdAt' },
//               day: { $dayOfMonth: '$createdAt' },
//             },
//           revenue: { $sum: '$totalAmount' },
//         },
//       },
//       revenueRangeConfig.granularity === 'hour'
//         ? { $sort: { '_id.hour': 1 } }
//         : { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 } },
//     ]),
//     Order.aggregate([
//       { $unwind: '$items' },
//       {
//         $group: {
//           _id: '$items.name',
//           sold: { $sum: '$items.quantity' },
//           revenue: { $sum: '$items.totalPrice' },
//         },
//       },
//       { $sort: { sold: -1, revenue: -1 } },
//       { $limit: 5 },
//     ]),
//     User.countDocuments({ role: 'delivery', isOnline: true }),
//   ]);

//   const statusMap = orderStatusCounts.reduce((acc, row) => {
//     acc[row._id] = row.count;
//     return acc;
//   }, {});

//   const typeMap = orderTypeCounts.reduce((acc, row) => {
//     acc[row._id] = row.count;
//     return acc;
//   }, {});

//   const roleMap = usersByRole.reduce((acc, row) => {
//     acc[row._id] = row.count;
//     return acc;
//   }, {});

//   const todayRevenue = todayDelivered[0]?.revenue || 0;
//   const yesterdayRevenue = yesterdayDelivered[0]?.revenue || 0;
//   const revenueDelta = yesterdayRevenue
//     ? Math.round(((todayRevenue - yesterdayRevenue) / yesterdayRevenue) * 100)
//     : todayRevenue > 0
//       ? 100
//       : 0;

//   const revenueByDay = buildRevenueChartPoints(revenueRangeRaw, revenueRangeConfig, now);

//   const totalOrders = Object.values(statusMap).reduce((sum, value) => sum + value, 0);
//   const activeOrders =
//     (statusMap.placed || 0) +
//     (statusMap.confirmed || 0) +
//     (statusMap.preparing || 0) +
//     (statusMap.ready || 0) +
//     (statusMap['out-for-delivery'] || 0);

//   const kitchenActive = (statusMap.confirmed || 0) + (statusMap.preparing || 0);
//   const readyForHandoff = statusMap.ready || 0;

//   return {
//     overview: {
//       todayRevenue,
//       revenueDelta,
//       activeOrders,
//       totalOrders,
//       totalUsers,
//       activeUsers,
//       totalMenuItems,
//       availableMenuItems,
//       onlineDeliveryAgents,
//       kitchenActive,
//       readyForHandoff,
//     },
//     usersByRole: roleMap,
//     ordersByStatus: statusMap,
//     ordersByType: typeMap,
//     revenueByDay,
//     monthlyRevenueByDay: revenueByDay,
//     revenueRange: revenueRangeConfig.key,
//     revenueChartTitle: revenueRangeConfig.chartTitle,
//     revenueChartDescription: revenueRangeConfig.chartDescription,
//     revenueSummaryLabel: revenueRangeConfig.summaryLabel,
//     topSellingItems,
//   };
// }

// async function attachCustomerInsights(users) {
//   const customerIds = users
//     .filter((user) => user.role === 'customer')
//     .map((user) => user._id);

//   if (!customerIds.length) return users;

//   const [deliveryRatings, menuReviewItems] = await Promise.all([
//     Order.find({
//       customer: { $in: customerIds },
//       'deliveryRating.score': { $gte: 1 },
//     })
//       .sort({ 'deliveryRating.ratedAt': -1 })
//       .select('customer orderId deliveryRating totalAmount createdAt'),
//     MenuItem.find({
//       'reviews.user': { $in: customerIds },
//     })
//       .select('name reviews'),
//   ]);

//   const deliveryByCustomer = new Map();
//   deliveryRatings.forEach((order) => {
//     const customerId = order.customer?.toString();
//     if (!customerId) return;
//     const bucket = deliveryByCustomer.get(customerId) || [];
//     bucket.push(order);
//     deliveryByCustomer.set(customerId, bucket);
//   });

//   const menuReviewsByCustomer = new Map();
//   menuReviewItems.forEach((item) => {
//     (item.reviews || []).forEach((review) => {
//       const customerId = review.user?.toString();
//       if (!customerId || !customerIds.some((id) => id.toString() === customerId)) return;
//       const bucket = menuReviewsByCustomer.get(customerId) || [];
//       bucket.push({
//         itemName: item.name,
//         rating: review.rating,
//         comment: review.comment,
//         createdAt: review.createdAt,
//       });
//       menuReviewsByCustomer.set(customerId, bucket);
//     });
//   });

//   return users.map((user) => {
//     if (user.role !== 'customer') return user;

//     const customerId = user._id.toString();
//     const deliveryEntries = deliveryByCustomer.get(customerId) || [];
//     const menuEntries = (menuReviewsByCustomer.get(customerId) || []).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
//     const deliveryAverage = deliveryEntries.length
//       ? Number((deliveryEntries.reduce((sum, entry) => sum + Number(entry.deliveryRating?.score || 0), 0) / deliveryEntries.length).toFixed(1))
//       : 0;
//     const menuAverage = menuEntries.length
//       ? Number((menuEntries.reduce((sum, entry) => sum + Number(entry.rating || 0), 0) / menuEntries.length).toFixed(1))
//       : 0;
//     const totalReviews = deliveryEntries.length + menuEntries.length;
//     const combinedAverage = totalReviews
//       ? Number((((deliveryAverage * deliveryEntries.length) + (menuAverage * menuEntries.length)) / totalReviews).toFixed(1))
//       : 0;

//     return {
//       ...user.toObject(),
//       customerInsights: {
//         averageRating: combinedAverage,
//         totalReviews,
//         deliveryRatingsCount: deliveryEntries.length,
//         menuReviewsCount: menuEntries.length,
//         recentReviews: [
//           ...deliveryEntries.map((entry) => ({
//             type: 'delivery',
//             title: `Delivery order ${entry.orderId}`,
//             rating: entry.deliveryRating?.score || 0,
//             comment: entry.deliveryRating?.review || '',
//             createdAt: entry.deliveryRating?.ratedAt || entry.createdAt,
//           })),
//           ...menuEntries.map((entry) => ({
//             type: 'menu',
//             title: entry.itemName,
//             rating: entry.rating || 0,
//             comment: entry.comment || '',
//             createdAt: entry.createdAt,
//           })),
//         ]
//           .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
//           .slice(0, 5),
//       },
//     };
//   });
// }

// router.get('/users', protect, allowRoles('admin'), async (req, res) => {
//   try {
//     const users = await User.find().sort({ createdAt: -1 });
//     const enrichedUsers = await attachCustomerInsights(users);
//     res.json(enrichedUsers);
//   } catch (err) { res.status(500).json({ message: err.message }); }
// });

// router.post('/users', protect, allowRoles('admin'), async (req, res) => {
//   try {
//     const { name, email, phone, password, role, isActive, vehicleType } = req.body;

//     if (!name?.trim()) {
//       return res.status(400).json({ message: 'Name is required' });
//     }

//     if (!email && !phone) {
//       return res.status(400).json({ message: 'Email or phone is required' });
//     }

//     if (!password || password.length < 6) {
//       return res.status(400).json({ message: 'Password must be at least 6 characters' });
//     }

//     if (!USER_ROLES.includes(role)) {
//       return res.status(400).json({ message: 'Invalid role selected' });
//     }

//     if (role === 'admin') {
//       return res.status(403).json({ message: 'Use a server-side bootstrap flow to create admin accounts' });
//     }

//     const conditions = [];
//     if (email) conditions.push({ email: email.toLowerCase().trim() });
//     if (phone) conditions.push({ phone: phone.trim() });

//     const existingUser = conditions.length ? await User.findOne({ $or: conditions }) : null;
//     if (existingUser) {
//       return res.status(409).json({ message: 'Email or phone already registered' });
//     }

//     const payload = {
//       name: name.trim(),
//       email: email ? email.toLowerCase().trim() : undefined,
//       phone: phone ? phone.trim() : undefined,
//       password,
//       role,
//       isActive: typeof isActive === 'boolean' ? isActive : true,
//       isEmailVerified: true,
//       isPhoneVerified: true,
//     };

//     if (role === 'delivery' && vehicleType) {
//       payload.vehicleType = vehicleType;
//     }

//     const user = await User.create(payload);
//     res.status(201).json(user);
//   } catch (err) { res.status(500).json({ message: err.message }); }
// });

// router.put('/users/:id', protect, allowRoles('admin'), async (req, res) => {
//   try {
//     const updates = { ...req.body };
//     const user = await User.findById(req.params.id);

//     if (!user) {
//       return res.status(404).json({ message: 'User not found' });
//     }

//     if (Object.prototype.hasOwnProperty.call(updates, 'role')) {
//       if (!USER_ROLES.includes(updates.role)) {
//         return res.status(400).json({ message: 'Invalid role selected' });
//       }

//       if (updates.role === 'admin' && user.role !== 'admin') {
//         return res.status(403).json({ message: 'Admin role cannot be assigned from this panel' });
//       }
//     }

//     if (Object.prototype.hasOwnProperty.call(updates, 'email')) {
//       updates.email = updates.email ? updates.email.toLowerCase().trim() : undefined;
//     }

//     if (Object.prototype.hasOwnProperty.call(updates, 'phone')) {
//       updates.phone = updates.phone ? updates.phone.trim() : undefined;
//     }

//     if (Object.prototype.hasOwnProperty.call(updates, 'name')) {
//       updates.name = updates.name ? updates.name.trim() : '';
//       if (!updates.name) {
//         return res.status(400).json({ message: 'Name is required' });
//       }
//     }

//     if (Object.prototype.hasOwnProperty.call(updates, 'password')) {
//       if (!updates.password) {
//         delete updates.password;
//       } else if (updates.password.length < 6) {
//         return res.status(400).json({ message: 'Password must be at least 6 characters' });
//       }
//     }

//     if (
//       updates.role &&
//       !INTERNAL_ROLES.includes(updates.role) &&
//       updates.role !== 'customer' &&
//       !(updates.role === 'admin' && user.role === 'admin')
//     ) {
//       return res.status(400).json({ message: 'Invalid role selected' });
//     }

//     if (!updates.email && !updates.phone) {
//       return res.status(400).json({ message: 'Email or phone is required' });
//     }

//     const duplicateChecks = [];
//     if (updates.email) duplicateChecks.push({ email: updates.email });
//     if (updates.phone) duplicateChecks.push({ phone: updates.phone });

//     if (duplicateChecks.length) {
//       const existingUser = await User.findOne({
//         _id: { $ne: user._id },
//         $or: duplicateChecks,
//       });

//       if (existingUser) {
//         return res.status(409).json({ message: 'Email or phone already registered' });
//       }
//     }

//     Object.assign(user, updates);

//     if (user.role !== 'delivery') {
//       user.vehicleType = null;
//     }

//     await user.save();
//     res.json(user);
//   } catch (err) { res.status(500).json({ message: err.message }); }
// });

// router.delete('/users/:id', protect, allowRoles('admin'), async (req, res) => {
//   try {
//     const {
//       reason,
//       notifyEmail = true,
//       notifySms = false,
//     } = req.body || {};

//     const user = await User.findById(req.params.id);

//     if (!user) {
//       return res.status(404).json({ message: 'User not found' });
//     }

//     if (user._id.toString() === req.user._id.toString()) {
//       return res.status(400).json({ message: 'You cannot delete your own admin account' });
//     }

//     const trimmedReason = reason?.trim();
//     const requiresReason = ['manager', 'staff'].includes(user.role);
//     if (requiresReason && !trimmedReason) {
//       return res.status(400).json({ message: 'Deletion reason is required' });
//     }

//     if (notifyEmail && user.email && trimmedReason) {
//       await sendAccountDeletionEmail({
//         email: user.email,
//         name: user.name,
//         role: user.role,
//         reason: trimmedReason,
//       });
//     }

//     if (notifySms && user.phone && trimmedReason) {
//       await sendAdministrativeSMS(
//         user.phone,
//         `Roller Coaster Cafe: Your ${user.role} account has been removed by admin. Reason: ${trimmedReason}`
//       );
//     }

//     await User.findByIdAndDelete(req.params.id);
//     res.json({ message: 'User deleted successfully', notified: { email: Boolean(notifyEmail && user.email), sms: Boolean(notifySms && user.phone) } });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// });

// router.get('/reports/sales', protect, allowRoles('admin', 'manager'), async (req, res) => {
//   try {
//     const { startDate, endDate, groupBy = 'day' } = req.query;
//     const start = startDate
//       ? buildLocalDateBoundary(startDate, false)
//       : (() => {
//         const d = new Date();
//         d.setDate(d.getDate() - 7);
//         d.setHours(0, 0, 0, 0);
//         return d;
//       })();
//     const end = endDate ? buildLocalDateBoundary(endDate, true) : new Date();

//     const orders = await Order.find({
//       createdAt: { $gte: start, $lte: end },
//       status: { $ne: 'cancelled' },
//     }).populate('items.menuItem', 'name category price');

//     const grouped = {};
//     orders.forEach((order) => {
//       const createdAt = new Date(order.createdAt);
//       let key;

//       if (groupBy === 'hour') {
//         key = `${createdAt.toDateString()} ${String(createdAt.getHours()).padStart(2, '0')}:00`;
//       } else if (groupBy === 'week') {
//         const weekStart = new Date(createdAt);
//         weekStart.setDate(createdAt.getDate() - createdAt.getDay());
//         weekStart.setHours(0, 0, 0, 0);
//         key = weekStart.toDateString();
//       } else if (groupBy === 'month') {
//         key = `${createdAt.getFullYear()}-${String(createdAt.getMonth() + 1).padStart(2, '0')}`;
//       } else {
//         key = createdAt.toDateString();
//       }

//       grouped[key] = grouped[key] || { revenue: 0, orders: 0 };
//       grouped[key].revenue += order.totalAmount || 0;
//       grouped[key].orders += 1;
//     });

//     const itemStats = {};
//     orders.forEach((order) => {
//       (order.items || []).forEach(({ menuItem, quantity, totalPrice, unitPrice, name }) => {
//         const itemId = menuItem?._id?.toString() || name;
//         if (!itemId) return;

//         const itemName = menuItem?.name || name || 'Unnamed item';
//         const itemCategory = menuItem?.category || 'Uncategorized';
//         const computedRevenue = Number(totalPrice)
//           || (Number(quantity) * Number(unitPrice || menuItem?.basePrice || 0));

//         itemStats[itemId] = itemStats[itemId] || {
//           name: itemName,
//           category: itemCategory,
//           quantity: 0,
//           revenue: 0,
//         };
//         itemStats[itemId].quantity += Number(quantity) || 0;
//         itemStats[itemId].revenue += computedRevenue;
//       });
//     });

//     const salesOverTime = Object.entries(grouped)
//       .map(([label, value]) => ({
//         label: groupBy === 'week' ? `Week of ${label}` : label,
//         revenue: Number(value.revenue || 0),
//         orders: Number(value.orders || 0),
//         sortAt: new Date(label).getTime(),
//       }))
//       .sort((a, b) => a.sortAt - b.sortAt)
//       .map(({ sortAt, ...entry }) => entry);

//     const itemPerformance = Object.values(itemStats)
//       .map((item) => ({
//         ...item,
//         unitsSold: Number(item.quantity || 0),
//         revenue: Number(item.revenue || 0),
//       }))
//       .sort((a, b) => b.revenue - a.revenue);

//     res.json({
//       totalRevenue: orders.reduce((sum, order) => sum + (order.totalAmount || 0), 0),
//       totalOrders: orders.length,
//       salesOverTime,
//       itemPerformance,
//       bestSeller: itemPerformance[0] || null,
//       worstSeller: itemPerformance[itemPerformance.length - 1] || null,
//     });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// });

// router.get('/dashboard', protect, allowRoles('admin', 'manager'), async (req, res) => {
//   try {
//     const summary = await getAdminSummary(req.query.range);
//     res.json(summary);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// });

// router.get('/reports/overview', protect, allowRoles('admin', 'manager'), async (req, res) => {
//   try {
//     const summary = await getAdminSummary();
//     res.json(summary);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// });

// module.exports = router;

const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { allowRoles } = require('../middleware/roleCheck');
const User = require('../models/User');
const Order = require('../models/Order');
const MenuItem = require('../models/MenuItem');
const { sendAccountDeletionEmail } = require('../services/emailService');
const { sendAdministrativeSMS } = require('../services/smsService');

const USER_ROLES = ['admin', 'manager', 'staff', 'kitchen', 'delivery', 'customer'];
const INTERNAL_ROLES = ['manager', 'staff', 'kitchen', 'delivery'];

function buildRevenueRangeConfig(range = 'last7days', now = new Date()) {
  const todayStart = new Date(now);
  todayStart.setHours(0, 0, 0, 0);

  const yesterdayStart = new Date(todayStart);
  yesterdayStart.setDate(yesterdayStart.getDate() - 1);

  switch (String(range || '').toLowerCase()) {
    case 'today':
      return {
        key: 'today',
        start: todayStart,
        end: now,
        granularity: 'hour',
        chartTitle: 'Revenue Today',
        chartDescription: 'Hourly revenue for the current day',
        summaryLabel: 'Today Total',
      };
    case 'yesterday':
      return {
        key: 'yesterday',
        start: yesterdayStart,
        end: todayStart,
        granularity: 'hour',
        chartTitle: 'Revenue Yesterday',
        chartDescription: 'Hourly revenue for the previous day',
        summaryLabel: 'Yesterday Total',
      };
    case 'last30days':
    case 'lastmonth':
      return {
        key: 'last30days',
        start: new Date(todayStart.getFullYear(), todayStart.getMonth(), todayStart.getDate() - 29),
        end: now,
        granularity: 'day',
        chartTitle: 'Revenue Last 30 Days',
        chartDescription: 'Daily revenue for the last 30 days',
        summaryLabel: '30 Day Total',
      };
    default:
      return {
        key: 'last7days',
        start: new Date(todayStart.getFullYear(), todayStart.getMonth(), todayStart.getDate() - 6),
        end: now,
        granularity: 'day',
        chartTitle: 'Revenue Last 7 Days',
        chartDescription: 'Daily revenue for the last 7 days',
        summaryLabel: '7 Day Total',
      };
  }
}

function buildLocalDateBoundary(dateInput, endOfDay = false) {
  const date = new Date(dateInput);
  if (Number.isNaN(date.getTime())) return null;
  if (endOfDay) {
    date.setHours(23, 59, 59, 999);
  } else {
    date.setHours(0, 0, 0, 0);
  }
  return date;
}

function buildRevenueChartPoints(rawRows = [], rangeConfig, now = new Date()) {
  if (rangeConfig.granularity === 'hour') {
    return Array.from({ length: 24 }, (_, hour) => {
      const found = rawRows.find((row) => row._id?.hour === hour);
      return {
        day: new Date(2000, 0, 1, hour).toLocaleTimeString('en-IN', {
          hour: 'numeric',
          hour12: true,
        }),
        revenue: found?.revenue || 0,
      };
    });
  }

  const points = [];
  const cursor = new Date(rangeConfig.start);
  const endBoundary = new Date(rangeConfig.end);

  while (cursor <= endBoundary) {
    const found = rawRows.find((row) =>
      row._id?.year === cursor.getFullYear()
      && row._id?.month === cursor.getMonth() + 1
      && row._id?.day === cursor.getDate()
    );

    points.push({
      day: cursor.toLocaleDateString('en-IN', {
        day: '2-digit',
        month: points.length > 6 ? 'short' : undefined,
        weekday: points.length <= 6 ? 'short' : undefined,
      }),
      revenue: found?.revenue || 0,
    });

    cursor.setDate(cursor.getDate() + 1);
    cursor.setHours(0, 0, 0, 0);
  }

  return points;
}

async function getAdminSummary(range = 'last7days') {
  const now = new Date();
  const todayStart = new Date(now);
  todayStart.setHours(0, 0, 0, 0);
  const revenueRangeConfig = buildRevenueRangeConfig(range, now);

  const yesterdayStart = new Date(todayStart);
  yesterdayStart.setDate(todayStart.getDate() - 1);

  const [
    totalUsers,
    activeUsers,
    usersByRole,
    totalMenuItems,
    availableMenuItems,
    orderStatusCounts,
    orderTypeCounts,
    todayDelivered,
    yesterdayDelivered,
    revenueRangeRaw,
    topSellingItems,
    onlineDeliveryAgents,
  ] = await Promise.all([
    User.countDocuments(),
    User.countDocuments({ isActive: true }),
    User.aggregate([
      { $group: { _id: '$role', count: { $sum: 1 } } },
    ]),
    MenuItem.countDocuments({ isArchived: false }),
    MenuItem.countDocuments({ isArchived: false, isAvailable: true }),
    Order.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]),
    Order.aggregate([
      { $group: { _id: '$orderType', count: { $sum: 1 } } },
    ]),
    Order.aggregate([
      { $match: { status: 'delivered', createdAt: { $gte: todayStart } } },
      { $group: { _id: null, revenue: { $sum: '$totalAmount' }, orders: { $sum: 1 } } },
    ]),
    Order.aggregate([
      {
        $match: {
          status: 'delivered',
          createdAt: { $gte: yesterdayStart, $lt: todayStart },
        },
      },
      { $group: { _id: null, revenue: { $sum: '$totalAmount' }, orders: { $sum: 1 } } },
    ]),
    Order.aggregate([
      {
        $match: {
          status: 'delivered',
          createdAt: { $gte: revenueRangeConfig.start, $lt: revenueRangeConfig.end },
        },
      },
      {
        $group: {
          _id: revenueRangeConfig.granularity === 'hour'
            ? { hour: { $hour: '$createdAt' } }
            : {
              year: { $year: '$createdAt' },
              month: { $month: '$createdAt' },
              day: { $dayOfMonth: '$createdAt' },
            },
          revenue: { $sum: '$totalAmount' },
        },
      },
      revenueRangeConfig.granularity === 'hour'
        ? { $sort: { '_id.hour': 1 } }
        : { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 } },
    ]),
    Order.aggregate([
      { $unwind: '$items' },
      {
        $group: {
          _id: '$items.name',
          sold: { $sum: '$items.quantity' },
          revenue: { $sum: '$items.totalPrice' },
        },
      },
      { $sort: { sold: -1, revenue: -1 } },
      { $limit: 5 },
    ]),
    User.countDocuments({ role: 'delivery', isOnline: true }),
  ]);

  const statusMap = orderStatusCounts.reduce((acc, row) => {
    acc[row._id] = row.count;
    return acc;
  }, {});

  const typeMap = orderTypeCounts.reduce((acc, row) => {
    acc[row._id] = row.count;
    return acc;
  }, {});

  const roleMap = usersByRole.reduce((acc, row) => {
    acc[row._id] = row.count;
    return acc;
  }, {});

  const todayRevenue = todayDelivered[0]?.revenue || 0;
  const yesterdayRevenue = yesterdayDelivered[0]?.revenue || 0;
  const revenueDelta = yesterdayRevenue
    ? Math.round(((todayRevenue - yesterdayRevenue) / yesterdayRevenue) * 100)
    : todayRevenue > 0
      ? 100
      : 0;

  const revenueByDay = buildRevenueChartPoints(revenueRangeRaw, revenueRangeConfig, now);

  const totalOrders = Object.values(statusMap).reduce((sum, value) => sum + value, 0);
  const activeOrders =
    (statusMap.placed || 0) +
    (statusMap.confirmed || 0) +
    (statusMap.preparing || 0) +
    (statusMap.ready || 0) +
    (statusMap['out-for-delivery'] || 0);

  const kitchenActive = (statusMap.confirmed || 0) + (statusMap.preparing || 0);
  const readyForHandoff = statusMap.ready || 0;

  return {
    overview: {
      todayRevenue,
      revenueDelta,
      activeOrders,
      totalOrders,
      totalUsers,
      activeUsers,
      totalMenuItems,
      availableMenuItems,
      onlineDeliveryAgents,
      kitchenActive,
      readyForHandoff,
    },
    usersByRole: roleMap,
    ordersByStatus: statusMap,
    ordersByType: typeMap,
    monthlyRevenueByDay: revenueByDay,
    revenueRange: revenueRangeConfig.key,
    revenueChartTitle: revenueRangeConfig.chartTitle,
    revenueChartDescription: revenueRangeConfig.chartDescription,
    revenueSummaryLabel: revenueRangeConfig.summaryLabel,
    topSellingItems,
  };
}

async function attachCustomerInsights(users) {
  const customerIds = users
    .filter((user) => user.role === 'customer')
    .map((user) => user._id);

  if (!customerIds.length) return users;

  const [deliveryRatings, menuReviewItems] = await Promise.all([
    Order.find({
      customer: { $in: customerIds },
      'deliveryRating.score': { $gte: 1 },
    })
      .sort({ 'deliveryRating.ratedAt': -1 })
      .select('customer orderId deliveryRating totalAmount createdAt'),
    MenuItem.find({
      'reviews.user': { $in: customerIds },
    })
      .select('name reviews'),
  ]);

  const deliveryByCustomer = new Map();
  deliveryRatings.forEach((order) => {
    const customerId = order.customer?.toString();
    if (!customerId) return;
    const bucket = deliveryByCustomer.get(customerId) || [];
    bucket.push(order);
    deliveryByCustomer.set(customerId, bucket);
  });

  const menuReviewsByCustomer = new Map();
  menuReviewItems.forEach((item) => {
    (item.reviews || []).forEach((review) => {
      const customerId = review.user?.toString();
      if (!customerId || !customerIds.some((id) => id.toString() === customerId)) return;
      const bucket = menuReviewsByCustomer.get(customerId) || [];
      bucket.push({
        itemName: item.name,
        rating: review.rating,
        comment: review.comment,
        createdAt: review.createdAt,
      });
      menuReviewsByCustomer.set(customerId, bucket);
    });
  });

  return users.map((user) => {
    if (user.role !== 'customer') return user;

    const customerId = user._id.toString();
    const deliveryEntries = deliveryByCustomer.get(customerId) || [];
    const menuEntries = (menuReviewsByCustomer.get(customerId) || []).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    const deliveryAverage = deliveryEntries.length
      ? Number((deliveryEntries.reduce((sum, entry) => sum + Number(entry.deliveryRating?.score || 0), 0) / deliveryEntries.length).toFixed(1))
      : 0;
    const menuAverage = menuEntries.length
      ? Number((menuEntries.reduce((sum, entry) => sum + Number(entry.rating || 0), 0) / menuEntries.length).toFixed(1))
      : 0;
    const totalReviews = deliveryEntries.length + menuEntries.length;
    const combinedAverage = totalReviews
      ? Number((((deliveryAverage * deliveryEntries.length) + (menuAverage * menuEntries.length)) / totalReviews).toFixed(1))
      : 0;

    return {
      ...user.toObject(),
      customerInsights: {
        averageRating: combinedAverage,
        totalReviews,
        deliveryRatingsCount: deliveryEntries.length,
        menuReviewsCount: menuEntries.length,
        recentReviews: [
          ...deliveryEntries.map((entry) => ({
            type: 'delivery',
            title: `Delivery order ${entry.orderId}`,
            rating: entry.deliveryRating?.score || 0,
            comment: entry.deliveryRating?.review || '',
            createdAt: entry.deliveryRating?.ratedAt || entry.createdAt,
          })),
          ...menuEntries.map((entry) => ({
            type: 'menu',
            title: entry.itemName,
            rating: entry.rating || 0,
            comment: entry.comment || '',
            createdAt: entry.createdAt,
          })),
        ]
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, 5),
      },
    };
  });
}

router.get('/users', protect, allowRoles('admin'), async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    const enrichedUsers = await attachCustomerInsights(users);
    res.json(enrichedUsers);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.post('/users', protect, allowRoles('admin'), async (req, res) => {
  try {
    const { name, email, phone, password, role, isActive, vehicleType } = req.body;

    if (!name?.trim()) {
      return res.status(400).json({ message: 'Name is required' });
    }

    if (!email && !phone) {
      return res.status(400).json({ message: 'Email or phone is required' });
    }

    if (!password || password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }

    if (!USER_ROLES.includes(role)) {
      return res.status(400).json({ message: 'Invalid role selected' });
    }

    if (role === 'admin') {
      return res.status(403).json({ message: 'Use a server-side bootstrap flow to create admin accounts' });
    }

    const conditions = [];
    if (email) conditions.push({ email: email.toLowerCase().trim() });
    if (phone) conditions.push({ phone: phone.trim() });

    const existingUser = conditions.length ? await User.findOne({ $or: conditions }) : null;
    if (existingUser) {
      return res.status(409).json({ message: 'Email or phone already registered' });
    }

    const payload = {
      name: name.trim(),
      email: email ? email.toLowerCase().trim() : undefined,
      phone: phone ? phone.trim() : undefined,
      password,
      role,
      isActive: typeof isActive === 'boolean' ? isActive : true,
      isEmailVerified: true,
      isPhoneVerified: true,
    };

    if (role === 'delivery' && vehicleType) {
      payload.vehicleType = vehicleType;
    }

    const user = await User.create(payload);
    res.status(201).json(user);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.put('/users/:id', protect, allowRoles('admin'), async (req, res) => {
  try {
    const updates = { ...req.body };
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (Object.prototype.hasOwnProperty.call(updates, 'role')) {
      if (!USER_ROLES.includes(updates.role)) {
        return res.status(400).json({ message: 'Invalid role selected' });
      }

      if (updates.role === 'admin' && user.role !== 'admin') {
        return res.status(403).json({ message: 'Admin role cannot be assigned from this panel' });
      }
    }

    if (Object.prototype.hasOwnProperty.call(updates, 'email')) {
      updates.email = updates.email ? updates.email.toLowerCase().trim() : undefined;
    }

    if (Object.prototype.hasOwnProperty.call(updates, 'phone')) {
      updates.phone = updates.phone ? updates.phone.trim() : undefined;
    }

    if (Object.prototype.hasOwnProperty.call(updates, 'name')) {
      updates.name = updates.name ? updates.name.trim() : '';
      if (!updates.name) {
        return res.status(400).json({ message: 'Name is required' });
      }
    }

    if (Object.prototype.hasOwnProperty.call(updates, 'password')) {
      if (!updates.password) {
        delete updates.password;
      } else if (updates.password.length < 6) {
        return res.status(400).json({ message: 'Password must be at least 6 characters' });
      }
    }

    if (
      updates.role &&
      !INTERNAL_ROLES.includes(updates.role) &&
      updates.role !== 'customer' &&
      !(updates.role === 'admin' && user.role === 'admin')
    ) {
      return res.status(400).json({ message: 'Invalid role selected' });
    }

    if (!updates.email && !updates.phone) {
      return res.status(400).json({ message: 'Email or phone is required' });
    }

    const duplicateChecks = [];
    if (updates.email) duplicateChecks.push({ email: updates.email });
    if (updates.phone) duplicateChecks.push({ phone: updates.phone });

    if (duplicateChecks.length) {
      const existingUser = await User.findOne({
        _id: { $ne: user._id },
        $or: duplicateChecks,
      });

      if (existingUser) {
        return res.status(409).json({ message: 'Email or phone already registered' });
      }
    }

    Object.assign(user, updates);

    if (user.role !== 'delivery') {
      user.vehicleType = null;
    }

    await user.save();
    res.json(user);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.delete('/users/:id', protect, allowRoles('admin'), async (req, res) => {
  try {
    const {
      reason,
      notifyEmail = true,
      notifySms = false,
    } = req.body || {};

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user._id.toString() === req.user._id.toString()) {
      return res.status(400).json({ message: 'You cannot delete your own admin account' });
    }

    const trimmedReason = reason?.trim();
    const requiresReason = ['manager', 'staff'].includes(user.role);
    if (requiresReason && !trimmedReason) {
      return res.status(400).json({ message: 'Deletion reason is required' });
    }

    if (notifyEmail && user.email && trimmedReason) {
      await sendAccountDeletionEmail({
        email: user.email,
        name: user.name,
        role: user.role,
        reason: trimmedReason,
      });
    }

    if (notifySms && user.phone && trimmedReason) {
      await sendAdministrativeSMS(
        user.phone,
        `Roller Coaster Cafe: Your ${user.role} account has been removed by admin. Reason: ${trimmedReason}`
      );
    }

    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'User deleted successfully', notified: { email: Boolean(notifyEmail && user.email), sms: Boolean(notifySms && user.phone) } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/reports/sales', protect, allowRoles('admin', 'manager'), async (req, res) => {
  try {
    const { startDate, endDate, groupBy = 'day' } = req.query;
    const start = startDate
      ? buildLocalDateBoundary(startDate, false)
      : (() => {
        const d = new Date();
        d.setDate(d.getDate() - 7);
        d.setHours(0, 0, 0, 0);
        return d;
      })();
    const end = endDate ? buildLocalDateBoundary(endDate, true) : new Date();

    const orders = await Order.find({
      createdAt: { $gte: start, $lte: end },
      status: { $ne: 'cancelled' },
    }).populate('items.menuItem', 'name category price');

    const grouped = {};
    orders.forEach((order) => {
      const createdAt = new Date(order.createdAt);
      let key;

      if (groupBy === 'hour') {
        key = `${createdAt.toDateString()} ${String(createdAt.getHours()).padStart(2, '0')}:00`;
      } else if (groupBy === 'week') {
        const weekStart = new Date(createdAt);
        weekStart.setDate(createdAt.getDate() - createdAt.getDay());
        weekStart.setHours(0, 0, 0, 0);
        key = weekStart.toDateString();
      } else if (groupBy === 'month') {
        key = `${createdAt.getFullYear()}-${String(createdAt.getMonth() + 1).padStart(2, '0')}`;
      } else {
        key = createdAt.toDateString();
      }

      grouped[key] = grouped[key] || { revenue: 0, orders: 0 };
      grouped[key].revenue += order.totalAmount || 0;
      grouped[key].orders += 1;
    });

    const itemStats = {};
    orders.forEach((order) => {
      (order.items || []).forEach(({ menuItem, quantity, totalPrice, unitPrice, name }) => {
        const itemId = menuItem?._id?.toString() || name;
        if (!itemId) return;

        const itemName = menuItem?.name || name || 'Unnamed item';
        const itemCategory = menuItem?.category || 'Uncategorized';
        const computedRevenue = Number(totalPrice)
          || (Number(quantity) * Number(unitPrice || menuItem?.basePrice || 0));

        itemStats[itemId] = itemStats[itemId] || {
          name: itemName,
          category: itemCategory,
          quantity: 0,
          revenue: 0,
        };
        itemStats[itemId].quantity += Number(quantity) || 0;
        itemStats[itemId].revenue += computedRevenue;
      });
    });

    const salesOverTime = Object.entries(grouped)
      .map(([label, value]) => ({
        label: groupBy === 'week' ? `Week of ${label}` : label,
        revenue: Number(value.revenue || 0),
        orders: Number(value.orders || 0),
        sortAt: new Date(label).getTime(),
      }))
      .sort((a, b) => a.sortAt - b.sortAt)
      .map(({ sortAt, ...entry }) => entry);

    const itemPerformance = Object.values(itemStats)
      .map((item) => ({
        ...item,
        unitsSold: Number(item.quantity || 0),
        revenue: Number(item.revenue || 0),
      }))
      .sort((a, b) => b.revenue - a.revenue);

    res.json({
      totalRevenue: orders.reduce((sum, order) => sum + (order.totalAmount || 0), 0),
      totalOrders: orders.length,
      salesOverTime,
      itemPerformance,
      bestSeller: itemPerformance[0] || null,
      worstSeller: itemPerformance[itemPerformance.length - 1] || null,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/dashboard', protect, allowRoles('admin', 'manager'), async (req, res) => {
  try {
    const summary = await getAdminSummary(req.query.range);
    res.json(summary);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ✅ FIX: now forwards ?range= query param to getAdminSummary
router.get('/reports/overview', protect, allowRoles('admin', 'manager'), async (req, res) => {
  try {
    const summary = await getAdminSummary(req.query.range || 'last7days');
    res.json(summary);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
