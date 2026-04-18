const Order = require('../models/Order');
const MenuItem = require('../models/MenuItem');
const Inventory = require('../models/inventory');
const User = require('../models/User');
const Promotion = require('../models/promotion');
const Supplier = require('../models/supplier');
const WasteLog = require('../models/Waste');
const mongoose = require('mongoose');

// ─────────────────────────────────────────────
// DASHBOARD
// ─────────────────────────────────────────────

// @desc    Get dashboard analytics snapshot
// @route   GET /api/manager/dashboard
// @access  Private (Manager)
// ─────────────────────────────────────────────
// REPLACE your getDashboard function with this
// in managerController.js
// ─────────────────────────────────────────────

const getDashboard = async (req, res) => {
    try {
        const busyRange = String(req.query.busyRange || 'today').toLowerCase();
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        const busyRangeStart = new Date(today);
        const busyRangeEnd = new Date(tomorrow);
        let busyRangeLabel = 'Today';

        if (busyRange === 'yesterday') {
            busyRangeStart.setDate(busyRangeStart.getDate() - 1);
            busyRangeEnd.setDate(busyRangeEnd.getDate() - 1);
            busyRangeLabel = 'Yesterday';
        } else if (busyRange === 'last7days') {
            busyRangeStart.setDate(busyRangeStart.getDate() - 6);
            busyRangeLabel = 'Last 7 Days';
        } else if (busyRange === 'last30days') {
            busyRangeStart.setDate(busyRangeStart.getDate() - 29);
            busyRangeLabel = 'Last 30 Days';
        }

        // Today's orders
        const todayOrders = await Order.find({
            createdAt: { $gte: today, $lt: tomorrow }
        }).populate('items.menuItem', 'name category price');

        // ✅ FIX: use totalAmount (matches Order model), ignore cancelled
        const totalSalesToday = todayOrders
            .filter(o => o.status !== 'cancelled')
            .reduce((sum, o) => sum + (o.totalAmount || 0), 0);

        // Recent orders (last 20)
        const recentOrders = await Order.find()
            .sort({ createdAt: -1 })
            .limit(20)
            .populate('customer', 'name')
            .populate('items.menuItem', 'name');

        // Top 5 selling items today
        const itemSales = {};
        todayOrders.forEach(order => {
            if (order.status === 'cancelled') return;
            order.items.forEach(({ menuItem, quantity, unitPrice }) => {
                if (!menuItem) return;
                const id = menuItem._id.toString();
                itemSales[id] = itemSales[id] || { name: menuItem.name, quantity: 0, revenue: 0 };
                itemSales[id].quantity += quantity;
                itemSales[id].revenue += quantity * (unitPrice || menuItem.price || 0);
            });
        });
        const topItems = Object.values(itemSales)
            .sort((a, b) => b.quantity - a.quantity)
            .slice(0, 5);

        // Sales by category
        const categorySales = {};
        todayOrders.forEach(order => {
            if (order.status === 'cancelled') return;
            order.items.forEach(({ menuItem, quantity, unitPrice }) => {
                if (!menuItem) return;
                const cat = menuItem.category || 'Other';
                categorySales[cat] = (categorySales[cat] || 0) + quantity * (unitPrice || menuItem.price || 0);
            });
        });

        const busyRangeOrders = await Order.find({
            createdAt: { $gte: busyRangeStart, $lt: busyRangeEnd }
        }).select('createdAt');

        // Busy hours for selected range
        const busyHours = Array.from({ length: 24 }, (_, hour) => ({
            hour,
            label: `${String(hour).padStart(2, '0')}:00`,
            orders: 0,
        }));

        busyRangeOrders.forEach((order) => {
            const hour = new Date(order.createdAt).getHours();
            if (busyHours[hour]) {
                busyHours[hour].orders += 1;
            }
        });

        const peakHourSlot = busyHours.reduce((peak, slot) => {
            if (!peak || slot.orders > peak.orders) return slot;
            return peak;
        }, null);

        // Low stock alerts
        const lowStockItems = await Inventory.find({ $expr: { $lte: ['$currentStock', '$reorderLevel'] } });

        // Order status counts
        const statusCounts = await Order.aggregate([
            { $group: { _id: '$status', count: { $sum: 1 } } }
        ]);

        res.json({
            todaySales: totalSalesToday,
            todayOrderCount: todayOrders.length,
            recentOrders,
            topItems,
            categorySales,
            busyHours,
            peakHour: peakHourSlot,
            busyRange,
            busyRangeLabel,
            lowStockAlerts: lowStockItems,
            statusCounts
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// ─────────────────────────────────────────────
// ORDER MANAGEMENT
// ─────────────────────────────────────────────

// @desc    Get all orders with filters
// @route   GET /api/manager/orders
// @access  Private (Manager)
const buildLocalDateBoundary = (dateString, endOfDay = false) => {
    if (!dateString) return null;

    const [year, month, day] = String(dateString).split('-').map(Number);
    if (!year || !month || !day) return null;

    if (endOfDay) {
        return new Date(year, month - 1, day, 23, 59, 59, 999);
    }

    return new Date(year, month - 1, day, 0, 0, 0, 0);
};

const resolvePaymentStatus = (order) => {
    const rawStatus = String(order?.paymentStatus || 'pending').toLowerCase();
    if (rawStatus !== 'paid') return rawStatus;

    if (order?.source === 'staff-pos') return 'paid';
    if (order?.paymentId) return 'paid';

    const method = String(order?.paymentMethod || '').toLowerCase();
    if (method === 'online' || method === 'wallet') return 'pending';

    return rawStatus;
};

const withResolvedPaymentStatus = (order) => {
    if (!order) return order;
    const data = order.toObject ? order.toObject() : order;
    return {
        ...data,
        paymentStatus: resolvePaymentStatus(data)
    };
};

const getAllOrders = async (req, res) => {
    try {
        const { status, startDate, endDate, customer, page = 1, limit = 20 } = req.query;
        const query = {};

        if (status) {
            const normalizedStatus = String(status).trim().toLowerCase();
            const statusMap = {
                pending: ['placed', 'confirmed', 'pending'],
                placed: ['placed'],
                confirmed: ['confirmed'],
                preparing: ['preparing', 'in progress', 'in-progress'],
                ready: ['ready', 'ready for pickup'],
                completed: ['completed', 'delivered', 'done'],
                cancelled: ['cancelled', 'canceled'],
            };

            if (statusMap[normalizedStatus]) {
                query.status = { $in: statusMap[normalizedStatus] };
            } else {
                query.status = normalizedStatus;
            }
        }
        if (customer) query['customer'] = customer;
        if (startDate || endDate) {
            query.createdAt = {};
            if (startDate) {
                const start = buildLocalDateBoundary(startDate, false);
                if (start) query.createdAt.$gte = start;
            }
            if (endDate) {
                const end = buildLocalDateBoundary(endDate, true);
                if (end) query.createdAt.$lte = end;
            }
        }

        const total = await Order.countDocuments(query);
        const orders = await Order.find(query)
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(Number(limit))
            .populate('customer', 'name email phone')
            .populate('items.menuItem', 'name price category');

        res.json({ orders: orders.map(withResolvedPaymentStatus), total, page: Number(page), pages: Math.ceil(total / limit) });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// @desc    Get single order details
// @route   GET /api/manager/orders/:id
// @access  Private (Manager)
const getOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id)
            .populate('customer', 'name email phone')
            .populate('items.menuItem', 'name price category description');
        if (!order) return res.status(404).json({ message: 'Order not found' });
        res.json(withResolvedPaymentStatus(order));
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// @desc    Mark an order payment as successful
// @route   PATCH /api/manager/orders/:id/mark-paid
// @access  Private (Manager)
const markOrderPaid = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id)
            .populate('customer', 'name email phone')
            .populate('items.menuItem', 'name price category');

        if (!order) return res.status(404).json({ message: 'Order not found' });

        if (['cancelled', 'canceled'].includes(String(order.status).toLowerCase())) {
            return res.status(400).json({ message: 'Cannot update payment for a cancelled order' });
        }

        if (String(order.paymentStatus).toLowerCase() === 'paid') {
            return res.json({ message: 'Payment is already marked as successful', order: withResolvedPaymentStatus(order) });
        }

        order.paymentStatus = 'paid';
        if (!order.paymentId) {
            order.paymentId = `MANUAL-${Date.now()}`;
        }

        order.notificationLog = [
            ...(order.notificationLog || []),
            {
                status: 'paid',
                title: 'Payment successful',
                message: 'Your payment was received successfully.',
                channels: ['push', 'email'],
                sentAt: new Date(),
            },
        ];

        await order.save();

        const io = req.app.get('io');
        const customerId = order.customer?._id || order.customer;
        const payload = {
            orderId: order._id,
            status: order.status,
            paymentStatus: order.paymentStatus,
            paymentId: order.paymentId,
            notificationLog: order.notificationLog || [],
            message: 'Payment successful',
        };

        if (io) {
            io.to(`order:${order._id}`).emit('order-updated', payload);
            if (customerId) {
                io.to(`user:${customerId}`).emit('order-updated', payload);
                io.to(`user:${customerId}`).emit('order-notification', {
                    orderId: order._id,
                    status: 'paid',
                    title: 'Payment successful',
                    message: 'Your payment was received successfully.',
                    channels: ['push', 'email'],
                    sentAt: new Date(),
                });
            }
        }

        res.json({ message: 'Payment marked as successful', order: withResolvedPaymentStatus(order) });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// @desc    Cancel an order manually
// @route   PATCH /api/manager/orders/:id/cancel
// @access  Private (Manager)
const cancelOrder = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (!order) return res.status(404).json({ message: 'Order not found' });
        if (['completed', 'cancelled', 'canceled'].includes(String(order.status).toLowerCase())) {
            return res.status(400).json({ message: `Cannot cancel a ${order.status} order` });
        }
        order.status = 'cancelled';
        order.cancelledBy = req.user._id;
        order.cancelReason = req.body.reason || 'Manager override';
        await order.save();

        // Emit socket event
        if (req.io) req.io.emit('orderCancelled', order);

        res.json({ message: 'Order cancelled', order });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// ─────────────────────────────────────────────
// MENU MANAGEMENT
// ─────────────────────────────────────────────

// @desc    Get all menu items
// @route   GET /api/manager/menu
// @access  Private (Manager)
const getMenuItems = async (req, res) => {
    try {
        const { category, active } = req.query;
        const query = {};
        if (category) query.category = category;
        if (active !== undefined) query.isAvailable = active === 'true';
        const items = await MenuItem.find(query)
            .populate('ingredients.inventoryItem', 'name unit currentStock reorderLevel')
            .sort({ category: 1, name: 1 });
        res.json(items);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// @desc    Create a menu item
// @route   POST /api/manager/menu
// @access  Private (Manager)
const createMenuItem = async (req, res) => {
    try {
        // ✅ Frontend sends: { name, basePrice, category, description, image, isAvailable }
        // Accept both field name variants defensively
        const {
            name,
            description,
            category,
            subcategory,
            isAvailable,
            basePrice,   // ✅ frontend sends this
            price,       // fallback if something sends "price"
            image,       // ✅ frontend sends this
            imageUrl,    // fallback
            recipe,
            ingredients = [],
        } = req.body;

        const resolvedPrice = basePrice ?? price;
        const resolvedImage = (image ?? imageUrl ?? '').trim();

        if (!name?.trim())  return res.status(400).json({ message: 'Name is required' });
        if (!category?.trim()) return res.status(400).json({ message: 'Category is required' });
        if (resolvedPrice === undefined || resolvedPrice === null || resolvedPrice === '') {
            return res.status(400).json({ message: 'Price is required' });
        }

        const item = new MenuItem({
            name:        name.trim(),
            description: description?.trim() || '',
            category:    category.trim(),
            subcategory: subcategory?.trim() || '',
            basePrice:   Number(resolvedPrice),
            image:       resolvedImage,
            isAvailable: isAvailable !== undefined ? Boolean(isAvailable) : true,
            recipe: recipe?.trim() || '',
            ingredients: Array.isArray(ingredients)
                ? ingredients
                    .map((ingredient) => ({
                        inventoryItem: ingredient.inventoryItem,
                        quantity: Number(ingredient.quantity || 0),
                        unit: ingredient.unit || '',
                    }))
                    .filter((ingredient) => ingredient.inventoryItem && ingredient.quantity > 0)
                : [],
        });

        const saved = await item.save();
        await saved.populate('ingredients.inventoryItem', 'name unit currentStock reorderLevel');
        res.status(201).json(saved);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// @desc    Update a menu item
// @route   PUT /api/manager/menu/:id
// @access  Private (Manager)
const updateMenuItem = async (req, res) => {
    try {
        const updatePayload = {
            ...req.body,
            subcategory: req.body.subcategory?.trim?.() || '',
            recipe: req.body.recipe?.trim?.() || '',
        };

        if (Array.isArray(req.body.ingredients)) {
            updatePayload.ingredients = req.body.ingredients
                .map((ingredient) => ({
                    inventoryItem: ingredient.inventoryItem,
                    quantity: Number(ingredient.quantity || 0),
                    unit: ingredient.unit || '',
                }))
                .filter((ingredient) => ingredient.inventoryItem && ingredient.quantity > 0);
        }

        const item = await MenuItem.findByIdAndUpdate(req.params.id, updatePayload, { new: true, runValidators: true })
            .populate('ingredients.inventoryItem', 'name unit currentStock reorderLevel');
        if (!item) return res.status(404).json({ message: 'Menu item not found' });
        res.json(item);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// @desc    Toggle menu item active/inactive (soft delete)
// @route   PATCH /api/manager/menu/:id/toggle
// @access  Private (Manager)
const toggleMenuItem = async (req, res) => {
    try {
        const item = await MenuItem.findById(req.params.id);
        if (!item) return res.status(404).json({ message: 'Menu item not found' });
        item.isAvailable = !item.isAvailable;
        await item.save();
        if (req.io) req.io.emit('menuUpdated', item);
        res.json({ message: `Item ${item.isAvailable ? 'activated' : 'deactivated'}`, item });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// @desc    Delete a menu item permanently
// @route   DELETE /api/manager/menu/:id
// @access  Private (Manager)
const deleteMenuItem = async (req, res) => {
    try {
        const item = await MenuItem.findByIdAndDelete(req.params.id);
        if (!item) return res.status(404).json({ message: 'Menu item not found' });
        res.json({ message: 'Menu item deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// ─────────────────────────────────────────────
// INVENTORY MANAGEMENT
// ─────────────────────────────────────────────

// @desc    Get all inventory items
// @route   GET /api/manager/inventory
// @access  Private (Manager)
// const getInventory = async (req, res) => {
//     try {
//         const items = await Inventory.find().sort({ name: 1 }).lean();

//         const supplierIds = [...new Set(
//             items
//                 .map((item) => item.supplier)
//                 .filter((supplierId) => mongoose.Types.ObjectId.isValid(supplierId))
//                 .map((supplierId) => String(supplierId))
//         )];

//         const suppliers = supplierIds.length
//             ? await Supplier.find({ _id: { $in: supplierIds } }).select('name').lean()
//             : [];

//         const supplierMap = new Map(
//             suppliers.map((supplier) => [String(supplier._id), supplier])
//         );

//         const normalizedItems = items.map((item) => {
//             const supplierId = String(item.supplier || '');

//             return {
//                 ...item,
//                 supplier: supplierMap.get(supplierId) || null
//             };
//         });

//         res.json(normalizedItems);
//     } catch (err) {
//         res.status(500).json({ message: err.message });
//     }
// };

// Update the getInventory function in managerController.js
const getInventory = async (req, res) => {
    try {
        const items = await Inventory.find().populate('supplier', 'name phone email').sort({ name: 1 });
        res.json(items);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// @desc    Create inventory item
// @route   POST /api/manager/inventory
// @access  Private (Manager)
const createInventoryItem = async (req, res) => {
    try {
        const { name, currentStock, unit, reorderLevel, supplier, category } = req.body;
        if (!name || currentStock === undefined || !unit) {
            return res.status(400).json({ message: 'Name, stock, and unit are required' });
        }
        const normalizedSupplier = typeof supplier === 'string' ? supplier.trim() : supplier;
        const item = new Inventory({
            name,
            currentStock,
            unit,
            reorderLevel: reorderLevel || 0,
            supplier: normalizedSupplier || null,
            category: category?.trim() || 'Other'
        });
        const saved = await item.save();
        res.status(201).json(saved);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// @desc    Update stock level (e.g., new delivery arrived)
// @route   PATCH /api/manager/inventory/:id/stock
// @access  Private (Manager)
const updateStock = async (req, res) => {
    try {
        const { quantity, note } = req.body;
        const item = await Inventory.findById(req.params.id);
        if (!item) return res.status(404).json({ message: 'Inventory item not found' });
        item.currentStock += Number(quantity);
        item.stockHistory.push({ change: quantity, note: note || 'Manual update', date: new Date(), updatedBy: req.user._id });
        await item.save();
        res.json(item);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// @desc    Update inventory item details
// @route   PUT /api/manager/inventory/:id
// @access  Private (Manager)
const updateInventoryItem = async (req, res) => {
    try {
        const normalizedSupplier = typeof req.body.supplier === 'string'
            ? req.body.supplier.trim()
            : req.body.supplier;

        const updatePayload = {
            ...req.body,
            category: req.body.category?.trim?.() || 'Other',
            supplier: normalizedSupplier || null
        };

        const item = await Inventory.findByIdAndUpdate(req.params.id, updatePayload, {
            new: true,
            runValidators: true
        });
        if (!item) return res.status(404).json({ message: 'Item not found' });
        res.json(item);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// @desc    Delete inventory item
// @route   DELETE /api/manager/inventory/:id
// @access  Private (Manager)
const deleteInventoryItem = async (req, res) => {
    try {
        const item = await Inventory.findByIdAndDelete(req.params.id);
        if (!item) return res.status(404).json({ message: 'Inventory item not found' });
        res.json({ message: 'Inventory item deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// ─────────────────────────────────────────────
// STAFF OVERVIEW
// ─────────────────────────────────────────────

// @desc    Get all staff members
// @route   GET /api/manager/staff
// @access  Private (Manager)
const getStaff = async (req, res) => {
    try {
        const staff = await User.find({ role: { $in: ['staff', 'kitchen', 'delivery'] } })
            .select('-password')
            .sort({ role: 1, name: 1 });
        res.json(staff);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// ─────────────────────────────────────────────
// REPORTING & ANALYTICS
// ─────────────────────────────────────────────

// @desc    Get sales report for a date range
// @route   GET /api/manager/reports/sales
// @access  Private (Manager)
const getSalesReport = async (req, res) => {
    try {
        const { startDate, endDate, groupBy = 'day' } = req.query;
        const start = startDate ? new Date(startDate) : (() => { const d = new Date(); d.setDate(d.getDate() - 7); return d; })();
        const end = endDate ? new Date(endDate) : new Date();
        end.setHours(23, 59, 59, 999);

        const orders = await Order.find({
            createdAt: { $gte: start, $lte: end },
            status: { $ne: 'cancelled' }
        }).populate('items.menuItem', 'name category price');

        // Group by day/week
        const grouped = {};
        orders.forEach(order => {
            let key;
            const d = new Date(order.createdAt);
            if (groupBy === 'hour') key = `${d.toDateString()} ${d.getHours()}:00`;
            else if (groupBy === 'week') {
                const weekStart = new Date(d);
                weekStart.setDate(d.getDate() - d.getDay());
                key = weekStart.toDateString();
            } else key = d.toDateString();

            grouped[key] = grouped[key] || { revenue: 0, orders: 0 };
            grouped[key].revenue += order.totalAmount || 0;
            grouped[key].orders += 1;
        });

        // Item performance
        const itemStats = {};
        orders.forEach(order => {
            order.items.forEach(({ menuItem, quantity, totalPrice, unitPrice, name }) => {
                const itemId = menuItem?._id?.toString() || name;
                if (!itemId) return;

                const itemName = menuItem?.name || name || 'Unnamed item';
                const itemCategory = menuItem?.category || 'Uncategorized';
                const computedRevenue =
                    Number(totalPrice) ||
                    (Number(quantity) * Number(unitPrice || menuItem?.basePrice || 0));

                itemStats[itemId] = itemStats[itemId] || {
                    name: itemName,
                    category: itemCategory,
                    quantity: 0,
                    revenue: 0
                };
                itemStats[itemId].quantity += Number(quantity) || 0;
                itemStats[itemId].revenue += computedRevenue;
            });
        });

        const itemPerformance = Object.values(itemStats).sort((a, b) => b.revenue - a.revenue);

        res.json({
            totalRevenue: orders.reduce((s, o) => s + (o.totalAmount || 0), 0),
            totalOrders: orders.length,
            salesOverTime: grouped,
            itemPerformance,
            bestSeller: itemPerformance[0] || null,
            worstSeller: itemPerformance[itemPerformance.length - 1] || null
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// ─────────────────────────────────────────────
// PROMOTIONS
// ─────────────────────────────────────────────

// @desc    Get all promotions
// @route   GET /api/manager/promotions
// @access  Private (Manager)
const getPromotions = async (req, res) => {
    try {
        const promos = await Promotion.find().sort({ createdAt: -1 });
        res.json(promos);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// @desc    Create a promotion / coupon
// @route   POST /api/manager/promotions
// @access  Private (Manager)
const createPromotion = async (req, res) => {
    try {
        const { code, type, value, minOrderAmount, startDate, endDate, description } = req.body;
        if (!code || !type || !value) {
            return res.status(400).json({ message: 'Code, type, and value are required' });
        }
        const promo = new Promotion({ code: code.toUpperCase(), type, value, minOrderAmount, startDate, endDate, description, isActive: true });
        const saved = await promo.save();
        res.status(201).json(saved);
    } catch (err) {
        if (err.code === 11000) return res.status(400).json({ message: 'Coupon code already exists' });
        res.status(500).json({ message: err.message });
    }
};

// @desc    Update promotion
// @route   PUT /api/manager/promotions/:id
// @access  Private (Manager)
const updatePromotion = async (req, res) => {
    try {
        const promo = await Promotion.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!promo) return res.status(404).json({ message: 'Promotion not found' });
        res.json(promo);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const deletePromotion = async (req, res) => {
    try {
        const promo = await Promotion.findByIdAndDelete(req.params.id);
        if (!promo) return res.status(404).json({ message: 'Promotion not found' });
        res.json({message: `promotion delete successfully`});
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// ─────────────────────────────────────────────
// SUPPLIER MANAGEMENT
// ─────────────────────────────────────────────

// @desc    Get all suppliers
// @route   GET /api/manager/suppliers
// @access  Private (Manager)
const getSuppliers = async (req, res) => {
    try {
        const suppliers = await Supplier.find().sort({ name: 1 });
        res.json(suppliers);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// @desc    Create supplier
// @route   POST /api/manager/suppliers
// @access  Private (Manager)
const createSupplier = async (req, res) => {
    try {
        const { name, contactName, phone, email, ingredients } = req.body;
        if (!name) return res.status(400).json({ message: 'Supplier name is required' });
        const supplier = new Supplier({ name, contactName, phone, email, ingredients });
        const saved = await supplier.save();
        res.status(201).json(saved);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// @desc    Update supplier
// @route   PUT /api/manager/suppliers/:id
// @access  Private (Manager)
const updateSupplier = async (req, res) => {
    try {
        const supplier = await Supplier.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!supplier) return res.status(404).json({ message: 'Supplier not found' });
        res.json(supplier);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const deleteSupplier = async (req, res) => {
    try {
        const supplier = await Supplier.findByIdAndDelete(req.params.id);
        res.json({ message: 'Supplier deleted' });
        // res.json(supplier);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

module.exports = {
    getDashboard,
    getAllOrders, getOrderById, markOrderPaid, cancelOrder,
    getMenuItems, createMenuItem, updateMenuItem, toggleMenuItem, deleteMenuItem,
    getInventory, createInventoryItem, updateStock, updateInventoryItem, deleteInventoryItem,
    getStaff,
    getSalesReport,
    getPromotions, createPromotion, updatePromotion,deletePromotion,
    getSuppliers, createSupplier, updateSupplier, deleteSupplier
};
