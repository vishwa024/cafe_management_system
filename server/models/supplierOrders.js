const mongoose = require('mongoose');

const supplierOrderSchema = new mongoose.Schema({
    orderNumber: {
        type: String,
        required: true,
        unique: true
    },
    supplier: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Supplier',
        required: true
    },
    items: [{
        inventoryItem: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Inventory',
            required: true
        },
        itemName: String,
        quantity: {
            type: Number,
            required: true,
            min: 1
        },
        unit: String,
        price: {
            type: Number,
            default: 0
        },
        total: {
            type: Number,
            default: 0
        }
    }],
    totalAmount: {
        type: Number,
        required: true
    },
    paymentMethod: {
        type: String,
        enum: ['cod', 'online'],
        default: 'cod'
    },
    paymentStatus: {
        type: String,
        enum: ['unpaid', 'paid'],
        default: 'unpaid'
    },
    paymentReference: {
        type: String,
        default: ''
    },
    paymentNotes: {
        type: String,
        default: ''
    },
    deliveryAddress: {
        type: String,
        required: true
    },
    notes: String,
    responseToken: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'accepted', 'processing', 'shipped', 'delivered', 'rejected'],
        default: 'pending'
    },
    rejectionReason: String,
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    acceptedAt: Date,
    respondedAt: Date,
    emailSentAt: Date,
    paidAt: Date,
    deliveredAt: Date,
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

supplierOrderSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

module.exports = mongoose.model('SupplierOrder', supplierOrderSchema);
