const crypto = require('crypto');
const SupplierOrder = require('../models/supplierOrders');
const Inventory = require('../models/inventory');
const Supplier = require('../models/supplier');
const { sendSupplierPurchaseOrderEmail } = require('../services/emailService');

const buildResponseToken = () => crypto.randomBytes(24).toString('hex');
const SUPPLIER_POPULATION = 'name contactName phone email accountName upiId qrCodeUrl';

const getSupplierResponsePageUrl = (orderId, action, token) => {
    const baseUrl = process.env.FRONTEND_URL || process.env.CLIENT_URL || 'http://localhost:5173';
    return `${baseUrl}/supplier/orders/${orderId}/respond?action=${action}&token=${token}`;
};

const isSupplierResponseAllowed = (status) => ['accepted', 'rejected'].includes(status);
const isManagerStatusAllowed = (status) => ['processing', 'shipped'].includes(status);
const isDeliveryAllowed = (status) => ['accepted', 'processing', 'shipped'].includes(status);
const PAYMENT_METHODS = ['cod', 'online'];
const PAYMENT_STATUSES = ['unpaid', 'paid'];

const roundCurrency = (value) => {
    const amount = Number(value || 0);
    return Number.isFinite(amount) ? Number(amount.toFixed(2)) : 0;
};

const normalizeSupplierAction = (value = '') => {
    const action = String(value).trim().toLowerCase();
    if (action === 'accept') return 'accepted';
    if (action === 'reject') return 'rejected';
    return action;
};

const recalculateOrderTotals = (order) => {
    order.items = (order.items || []).map((item) => {
        const price = roundCurrency(item.price);
        const quantity = Number(item.quantity || 0);
        return {
            ...item.toObject?.(),
            ...item,
            price,
            total: roundCurrency(price * quantity),
        };
    });
    order.totalAmount = roundCurrency(order.items.reduce((sum, item) => sum + Number(item.total || 0), 0));
};

const sendSupplierEmail = async (order, supplier) => {
    await sendSupplierPurchaseOrderEmail({
        to: supplier.email,
        supplierName: supplier.contactName || supplier.name,
        orderNumber: order.orderNumber,
        totalAmount: order.totalAmount,
        deliveryAddress: order.deliveryAddress,
        notes: order.notes,
        items: order.items,
        acceptUrl: getSupplierResponsePageUrl(order._id, 'accepted', order.responseToken),
        rejectUrl: getSupplierResponsePageUrl(order._id, 'rejected', order.responseToken),
    });
};

const applyOrderStatusChange = async (order, status, rejectionReason = '') => {
    if (!isSupplierResponseAllowed(status) && !isManagerStatusAllowed(status)) {
        throw new Error('Invalid order status');
    }

    order.status = status;

    if (status === 'accepted') {
        order.acceptedAt = order.acceptedAt || new Date();
        order.respondedAt = order.respondedAt || new Date();
        order.rejectionReason = '';
    }

    if (status === 'rejected') {
        order.rejectionReason = rejectionReason || 'Rejected by supplier';
        order.respondedAt = order.respondedAt || new Date();
    }

    await order.save();
    return order;
};

const createOrderFromLowStock = async (req, res) => {
    try {
        const { supplierId, items, deliveryAddress, notes, paymentMethod } = req.body;

        const supplier = await Supplier.findById(supplierId);
        if (!supplier) {
            return res.status(404).json({ message: 'Supplier not found' });
        }

        if (!supplier.email) {
            return res.status(400).json({ message: 'Selected supplier must have an email address' });
        }

        if (!Array.isArray(items) || items.length === 0) {
            return res.status(400).json({ message: 'At least one inventory item is required' });
        }

        const normalizedPaymentMethod = String(paymentMethod || 'cod').toLowerCase();
        if (!PAYMENT_METHODS.includes(normalizedPaymentMethod)) {
            return res.status(400).json({ message: 'Invalid payment method' });
        }

        const itemsWithDetails = await Promise.all(items.map(async (item) => {
            const inventoryItem = await Inventory.findById(item.inventoryItemId);
            if (!inventoryItem) {
                throw new Error(`Inventory item not found for ID ${item.inventoryItemId}`);
            }

            const quantity = Number(item.quantity);
            if (!quantity || quantity < 1) {
                throw new Error(`Invalid order quantity for ${inventoryItem.name}`);
            }

            return {
                inventoryItem: inventoryItem._id,
                itemName: inventoryItem.name,
                quantity,
                unit: inventoryItem.unit,
                price: 0,
                total: 0,
            };
        }));

        const order = new SupplierOrder({
            orderNumber: `PO-${Date.now()}`,
            supplier: supplierId,
            items: itemsWithDetails,
            totalAmount: 0,
            paymentMethod: normalizedPaymentMethod,
            paymentStatus: 'unpaid',
            deliveryAddress,
            notes,
            responseToken: buildResponseToken(),
            status: 'pending',
            createdBy: req.user?._id,
        });

        await order.save();
        await sendSupplierEmail(order, supplier);

        order.emailSentAt = new Date();
        await order.save();

        res.status(201).json({
            success: true,
            message: 'Purchase order created and email sent to supplier',
            order,
        });
    } catch (err) {
        console.error('Create order error:', err);
        res.status(500).json({ message: err.message });
    }
};

const getAllOrders = async (req, res) => {
    try {
        const orders = await SupplierOrder.find()
            .populate('supplier', SUPPLIER_POPULATION)
            .populate('items.inventoryItem', 'name unit currentStock reorderLevel')
            .sort({ createdAt: -1 });

        res.json(orders);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const updateOrderStatus = async (req, res) => {
    try {
        const { status, rejectionReason } = req.body;
        const order = await SupplierOrder.findById(req.params.id).populate('supplier', SUPPLIER_POPULATION);

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        if (!isSupplierResponseAllowed(status) && !isManagerStatusAllowed(status)) {
            return res.status(400).json({ message: 'Unsupported status update' });
        }

        await applyOrderStatusChange(order, status, rejectionReason);

        res.json({
            success: true,
            message: `Order ${status} successfully`,
            order,
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const markOrderDelivered = async (req, res) => {
    try {
        const order = await SupplierOrder.findById(req.params.id)
            .populate('supplier', SUPPLIER_POPULATION)
            .populate('items.inventoryItem', 'name unit currentStock reorderLevel stockHistory');

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        if (order.status === 'delivered') {
            return res.json({
                success: true,
                message: 'Order was already marked as delivered',
                order,
            });
        }

        if (!isDeliveryAllowed(order.status)) {
            return res.status(400).json({ message: 'Only accepted, processing, or shipped orders can be delivered' });
        }

        for (const lineItem of order.items) {
            const inventoryItem = await Inventory.findById(lineItem.inventoryItem?._id || lineItem.inventoryItem);
            if (!inventoryItem) continue;

            inventoryItem.currentStock += Number(lineItem.quantity);
            inventoryItem.stockHistory.push({
                change: Number(lineItem.quantity),
                note: `Restocked from purchase order ${order.orderNumber}`,
                date: new Date(),
                updatedBy: req.user?._id,
            });
            await inventoryItem.save();
        }

        order.status = 'delivered';
        order.deliveredAt = new Date();
        await order.save();

        const refreshedOrder = await SupplierOrder.findById(order._id)
            .populate('supplier', SUPPLIER_POPULATION)
            .populate('items.inventoryItem', 'name unit currentStock reorderLevel');

        res.json({
            success: true,
            message: 'Order marked as delivered. Inventory stock has been updated.',
            order: refreshedOrder,
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const submitSupplierPricing = async (req, res) => {
    try {
        const token = String(req.body.token || req.query.token || '');
        const pricedItems = Array.isArray(req.body.items) ? req.body.items : [];

        const order = await SupplierOrder.findById(req.params.id)
            .populate('supplier', SUPPLIER_POPULATION)
            .populate('items.inventoryItem', 'name unit');

        if (!order) {
            return res.status(404).json({ success: false, message: 'Order not found' });
        }

        if (!token || token !== order.responseToken) {
            return res.status(401).json({ success: false, message: 'Invalid or expired supplier response link' });
        }

        if (order.status === 'rejected') {
            return res.status(400).json({ success: false, message: 'Rejected orders cannot be priced' });
        }

        if (order.status === 'delivered') {
            return res.status(400).json({ success: false, message: 'Delivered orders cannot be changed' });
        }

        const priceMap = new Map(
            pricedItems.map((item) => [String(item.inventoryItemId || item.inventoryItem || ''), roundCurrency(item.price)])
        );

        order.items = order.items.map((item) => {
            const inventoryItemId = String(item.inventoryItem?._id || item.inventoryItem || '');
            const nextPrice = priceMap.has(inventoryItemId) ? priceMap.get(inventoryItemId) : roundCurrency(item.price);
            if (nextPrice < 0) {
                throw new Error(`Invalid price for ${item.itemName}`);
            }
            item.price = nextPrice;
            item.total = roundCurrency(nextPrice * Number(item.quantity || 0));
            return item;
        });

        recalculateOrderTotals(order);

        if (order.status === 'pending') {
            await applyOrderStatusChange(order, 'accepted');
        } else {
            await order.save();
        }

        const refreshedOrder = await SupplierOrder.findById(order._id)
            .populate('supplier', SUPPLIER_POPULATION)
            .populate('items.inventoryItem', 'name unit');

        res.json({
            success: true,
            message: 'Supplier prices updated successfully',
            order: refreshedOrder,
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

const updateOrderPayment = async (req, res) => {
    try {
        const { paymentMethod, paymentStatus, paymentReference, paymentNotes } = req.body;
        const order = await SupplierOrder.findById(req.params.id)
            .populate('supplier', 'name contactName phone email accountName upiId qrCodeUrl')
            .populate('items.inventoryItem', 'name unit currentStock reorderLevel');

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        if (paymentMethod !== undefined) {
            const normalizedPaymentMethod = String(paymentMethod || '').toLowerCase();
            if (!PAYMENT_METHODS.includes(normalizedPaymentMethod)) {
                return res.status(400).json({ message: 'Invalid payment method' });
            }
            order.paymentMethod = normalizedPaymentMethod;
        }

        if (paymentStatus !== undefined) {
            const normalizedPaymentStatus = String(paymentStatus || '').toLowerCase();
            if (!PAYMENT_STATUSES.includes(normalizedPaymentStatus)) {
                return res.status(400).json({ message: 'Invalid payment status' });
            }
            order.paymentStatus = normalizedPaymentStatus;
            order.paidAt = normalizedPaymentStatus === 'paid' ? new Date() : null;
        }

        if (paymentReference !== undefined) {
            order.paymentReference = String(paymentReference || '').trim();
        }

        if (paymentNotes !== undefined) {
            order.paymentNotes = String(paymentNotes || '').trim();
        }

        await order.save();

        res.json({
            success: true,
            message: 'Supplier order payment updated successfully',
            order,
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const getOrderById = async (req, res) => {
    try {
        const order = await SupplierOrder.findById(req.params.id)
            .populate('supplier', SUPPLIER_POPULATION)
            .populate('items.inventoryItem', 'name unit currentStock reorderLevel');

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        res.json(order);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const getSupplierOrderDetails = async (req, res) => {
    try {
        const token = String(req.query.token || '');

        const order = await SupplierOrder.findById(req.params.id)
            .populate('supplier', SUPPLIER_POPULATION)
            .populate('items.inventoryItem', 'name unit');

        if (!order) {
            return res.status(404).json({ success: false, message: 'Order not found' });
        }

        if (!token || token !== order.responseToken) {
            return res.status(401).json({ success: false, message: 'Invalid or expired supplier response link' });
        }

        return res.json({
            success: true,
            order,
        });
    } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
};

const respondToSupplierOrder = async (req, res) => {
    try {
        const action = normalizeSupplierAction(req.body.action || req.query.action || '');
        const token = String(req.body.token || req.query.token || '');
        const itemPrices = req.body.itemPrices || {};

        if (!isSupplierResponseAllowed(action)) {
            return res.status(400).json({ success: false, message: 'Invalid supplier action' });
        }

        const order = await SupplierOrder.findById(req.params.id)
            .populate('supplier', SUPPLIER_POPULATION)
            .populate('items.inventoryItem', 'name unit');

        if (!order) {
            return res.status(404).json({ success: false, message: 'Order not found' });
        }

        if (!token || token !== order.responseToken) {
            return res.status(401).json({ success: false, message: 'Invalid or expired supplier response link' });
        }

        if (order.status === 'delivered') {
            return res.status(400).json({ success: false, message: 'This order was already delivered and cannot be changed', order });
        }

        if (action === 'rejected') {
            if (order.status === 'rejected') {
                return res.json({ success: true, message: 'Order already rejected', order });
            }

            if (order.status !== 'pending') {
                return res.status(400).json({
                    success: false,
                    message: `Only pending orders can be rejected. Current status: ${order.status}.`,
                    order,
                });
            }

            await applyOrderStatusChange(order, 'rejected');
        } else {
            if (order.status === 'accepted') {
                return res.json({ success: true, message: 'Order already accepted', order });
            }

            if (order.status !== 'pending') {
                return res.status(400).json({
                    success: false,
                    message: `Only pending orders can be accepted. Current status: ${order.status}.`,
                    order,
                });
            }

            order.items = order.items.map((item) => {
                const inventoryItemId = String(item.inventoryItem?._id || item.inventoryItem || '');
                const rawPrice = itemPrices[inventoryItemId] ?? itemPrices[item.itemName];
                const nextPrice = roundCurrency(rawPrice);

                if (!rawPrice || nextPrice <= 0) {
                    throw new Error(`Please enter a valid price for ${item.itemName}`);
                }

                item.price = nextPrice;
                item.total = roundCurrency(nextPrice * Number(item.quantity || 0));
                return item;
            });

            recalculateOrderTotals(order);
            await applyOrderStatusChange(order, 'accepted');
        }

        const refreshedOrder = await SupplierOrder.findById(order._id)
            .populate('supplier', SUPPLIER_POPULATION)
            .populate('items.inventoryItem', 'name unit');

        return res.json({
            success: true,
            message: action === 'accepted'
                ? 'Order accepted successfully. The manager can now track delivery.'
                : 'Order rejected successfully. The manager can now reassign the order.',
            order: refreshedOrder,
        });
    } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
};

const respondToOrderFromEmail = async (req, res) => {
    try {
        const action = normalizeSupplierAction(req.query.action || '');
        const token = String(req.query.token || '');

        if (!isSupplierResponseAllowed(action)) {
            return res.status(400).json({ success: false, message: 'Invalid supplier action' });
        }

        const order = await SupplierOrder.findById(req.params.id)
            .populate('supplier', SUPPLIER_POPULATION)
            .populate('items.inventoryItem', 'name unit');

        if (!order) {
            return res.status(404).json({ success: false, message: 'Order not found' });
        }

        if (!token || token !== order.responseToken) {
            return res.status(401).json({ success: false, message: 'Invalid or expired supplier response link' });
        }

        if (order.status === 'delivered') {
            return res.status(400).json({ success: false, message: 'This order was already delivered and cannot be changed', order });
        }

        if (['accepted', 'rejected'].includes(order.status)) {
            return res.json({
                success: true,
                message: `Order already ${order.status}`,
                order,
            });
        }

        await applyOrderStatusChange(order, action);

        const refreshedOrder = await SupplierOrder.findById(order._id)
            .populate('supplier', SUPPLIER_POPULATION)
            .populate('items.inventoryItem', 'name unit');

        res.json({
            success: true,
            message: action === 'accepted'
                ? 'Order accepted successfully. The manager can now track delivery.'
                : 'Order rejected successfully. The manager can now reassign the order.',
            order: refreshedOrder,
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

const updateOrderPrices = async (req, res) => {
    try {
        const order = await SupplierOrder.findById(req.params.id);
        if (!order) return res.status(404).json({ message: 'Order not found' });

        const { itemPrices } = req.body; // { [inventoryItemId or itemName]: price }
        if (!itemPrices || typeof itemPrices !== 'object') {
            return res.status(400).json({ message: 'itemPrices object is required' });
        }

        order.items = order.items.map((item) => {
            const key = item.inventoryItemId?.toString() || item.itemName;
            const newPrice = itemPrices[key];
            if (newPrice !== undefined && newPrice !== '') {
                item.price = Number(newPrice);
                item.supplierPrice = Number(newPrice);
            }
            return item;
        });

        await order.save();
        res.json({ message: 'Prices updated successfully', order });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const deleteorderById = async (req, res) => {
    try {
        const order = await SupplierOrder.findByIdAndDelete(req.params.id);
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        res.json({message: "order deleted"});
    } catch (err) {
        res.status(500).json({ message: err.message });
    }    
};

module.exports = {
    createOrderFromLowStock,
    getAllOrders,
    updateOrderStatus,
    markOrderDelivered,
    updateOrderPayment,
    getOrderById,
    getSupplierOrderDetails,
    respondToSupplierOrder,
    respondToOrderFromEmail,
    submitSupplierPricing,
    updateOrderPrices,
    deleteorderById,
};
"// Updated for deployment" 
