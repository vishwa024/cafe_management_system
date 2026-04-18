const SupplierOrder = require('../models/supplierOrders');
const Inventory = require('../models/inventory');
const Supplier = require('../models/supplier');
const nodemailer = require('nodemailer');

// Email transporter
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// Send email to supplier
const sendSupplierEmail = async (order, supplier) => {
    // const acceptUrl = `${process.env.CLIENT_URL || 'http://localhost:5173'}/supplier/orders/${order._id}/accept?token=${Buffer.from(supplier.email).toString('base64')}`;
    // const rejectUrl = `${process.env.CLIENT_URL || 'http://localhost:5173'}/supplier/orders/${order._id}/reject?token=${Buffer.from(supplier.email).toString('base64')}`;
    
    const acceptUrl = `${process.env.CLIENT_URL || 'http://localhost:5173'}/supplier/orders/${order._id}/respond?action=accept&token=${Buffer.from(supplier.email).toString('base64')}`;
    const rejectUrl = `${process.env.CLIENT_URL || 'http://localhost:5173'}/supplier/orders/${order._id}/respond?action=reject&token=${Buffer.from(supplier.email).toString('base64')}`;
    const itemsHtml = order.items.map(item => `
        <tr>
            <td style="padding: 8px; border-bottom: 1px solid #e5e7eb;">${item.itemName}</td>
            <td style="padding: 8px; text-align: center;">${item.quantity} ${item.unit}</td>
            <td style="padding: 8px; text-align: right;">₹${item.price}</td>
            <td style="padding: 8px; text-align: right;">₹${item.total}</td>
        </tr>
    `).join('');

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: supplier.email,
        subject: `⚠️ Urgent: New Purchase Order #${order.orderNumber} - Low Stock Alert`,
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <div style="background: #fef3c7; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
                    <h2 style="color: #d97706; margin: 0;">⚠️ Urgent Purchase Order</h2>
                    <p style="color: #92400e; margin: 5px 0 0;">Low stock alert - Immediate action required</p>
                </div>
                
                <p>Dear ${supplier.name},</p>
                <p>Roller Coaster Cafe has created an urgent purchase order due to low stock levels.</p>
                
                <div style="background: #f3f4f6; padding: 15px; border-radius: 8px; margin: 20px 0;">
                    <h3 style="margin-top: 0; color: #374151;">Order Summary</h3>
                    <p><strong>Order Number:</strong> ${order.orderNumber}</p>
                    <p><strong>Order Date:</strong> ${new Date(order.createdAt).toLocaleString()}</p>
                    <p><strong>Total Amount:</strong> ₹${order.totalAmount}</p>
                    <p><strong>Delivery Address:</strong> ${order.deliveryAddress}</p>
                    ${order.notes ? `<p><strong>Notes:</strong> ${order.notes}</p>` : ''}
                </div>
                
                <div style="background: #f3f4f6; padding: 15px; border-radius: 8px; margin: 20px 0;">
                    <h3 style="margin-top: 0;">Items Required</h3>
                    <table style="width: 100%; border-collapse: collapse;">
                        <thead>
                            <tr style="background: #e5e7eb;">
                                <th style="padding: 8px; text-align: left;">Item</th>
                                <th style="padding: 8px; text-align: center;">Quantity</th>
                                <th style="padding: 8px; text-align: right;">Unit Price</th>
                                <th style="padding: 8px; text-align: right;">Total</th>
                            </tr>
                        </thead>
                        <tbody>${itemsHtml}</tbody>
                        <tfoot>
                            <tr>
                                <td colspan="3" style="padding: 8px; text-align: right; font-weight: bold;">Grand Total:</td>
                                <td style="padding: 8px; text-align: right; font-weight: bold;">₹${order.totalAmount}</td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
                
                <div style="margin: 25px 0; text-align: center;">
                    <a href="${acceptUrl}" style="display: inline-block; background: #10b981; color: white; padding: 12px 25px; text-decoration: none; border-radius: 8px; margin-right: 15px; font-weight: bold;">✅ Accept Order</a>
                    <a href="${rejectUrl}" style="display: inline-block; background: #ef4444; color: white; padding: 12px 25px; text-decoration: none; border-radius: 8px; font-weight: bold;">❌ Reject Order</a>
                </div>
                
                <p style="color: #6b7280; font-size: 12px; margin-top: 20px;">
                    Please respond within 24 hours. This is an automated notification from Roller Coaster Cafe.
                </p>
            </div>
        `
    };
    
    await transporter.sendMail(mailOptions);
};

// Create order from low stock (Manager action)
const createOrderFromLowStock = async (req, res) => {
    try {
        const { supplierId, items, deliveryAddress, notes } = req.body;
        
        const supplier = await Supplier.findById(supplierId);
        if (!supplier) {
            return res.status(404).json({ message: 'Supplier not found' });
        }
        
        const itemsWithDetails = await Promise.all(items.map(async (item) => {
            const inventoryItem = await Inventory.findById(item.inventoryItemId);
            return {
                inventoryItem: inventoryItem._id,
                itemName: inventoryItem.name,
                quantity: item.quantity,
                unit: inventoryItem.unit,
                price: item.price || 0,
                total: (item.price || 0) * item.quantity
            };
        }));
        
        const totalAmount = itemsWithDetails.reduce((sum, item) => sum + item.total, 0);
        
        const order = new SupplierOrder({
            orderNumber: `PO-${Date.now()}`,
            supplier: supplierId,
            items: itemsWithDetails,
            totalAmount,
            deliveryAddress,
            notes,
            status: 'pending',
            createdBy: req.user._id
        });
        
        await order.save();
        
        // Send email notification to supplier
        await sendSupplierEmail(order, supplier);
        
        res.status(201).json({ 
            success: true,
            message: 'Purchase order created and email sent to supplier',
            order 
        });
    } catch (err) {
        console.error('Create order error:', err);
        res.status(500).json({ message: err.message });
    }
};

// Get all supplier orders (Manager view)
const getAllOrders = async (req, res) => {
    try {
        const orders = await SupplierOrder.find()
            .populate('supplier', 'name phone email')
            .populate('items.inventoryItem', 'name unit')
            .sort({ createdAt: -1 });
        res.json(orders);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Update order status (Supplier action via email)
const updateOrderStatus = async (req, res) => {
    try {
        const { status, rejectionReason } = req.body;
        const order = await SupplierOrder.findById(req.params.id).populate('supplier');
        
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }
        
        order.status = status;
        if (status === 'rejected' && rejectionReason) {
            order.rejectionReason = rejectionReason;
        }
        if (status === 'accepted') {
            order.acceptedAt = new Date();
        }
        
        await order.save();
        
        res.json({ 
            success: true,
            message: `Order ${status} successfully`,
            order 
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Mark order as delivered (Manager action) - THIS UPDATES STOCK
const markOrderDelivered = async (req, res) => {
    try {
        const order = await SupplierOrder.findById(req.params.id).populate('supplier');
        
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }
        
        order.status = 'delivered';
        order.deliveredAt = new Date();
        
        // Update inventory stock - THIS IS THE KEY STEP
        for (const item of order.items) {
            await Inventory.findByIdAndUpdate(item.inventoryItem, {
                $inc: { currentStock: item.quantity }
            });
        }
        
        await order.save();
        
        res.json({ 
            success: true,
            message: 'Order marked as delivered. Inventory stock has been updated.',
            order 
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Get single order
const getOrderById = async (req, res) => {
    try {
        const order = await SupplierOrder.findById(req.params.id)
            .populate('supplier', 'name phone email')
            .populate('items.inventoryItem', 'name unit');
        
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }
        
        res.json(order);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

module.exports = {
    createOrderFromLowStock,
    getAllOrders,
    updateOrderStatus,
    markOrderDelivered,
    getOrderById
};