const mongoose = require("mongoose");

const StockHistorySchema = new mongoose.Schema({
    change:    { type: Number, required: true },
    note:      { type: String, default: '' },
    date:      { type: Date, default: Date.now },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { _id: false });

const InventorySchema = new mongoose.Schema({
    name:         { type: String, required: true, trim: true },
    category:     { type: String, trim: true, default: 'Other' },
    currentStock: { type: Number, required: true, default: 0 },
    unit:         { type: String, required: true, enum: ['kg', 'g', 'L', 'ml', 'pcs', 'dozen', 'box', 'bag', 'bottle'], default: 'kg'},
    reorderLevel: { type: Number, default: 0 },
    supplier:     { type: mongoose.Schema.Types.ObjectId, ref: 'Supplier', default: null },
    notes:        { type: String, trim: true, default: '' },
    stockHistory: [StockHistorySchema]
}, { timestamps: true });

InventorySchema.virtual('isLowStock').get(function () {
    return this.currentStock <= this.reorderLevel;
});

InventorySchema.virtual('quantity').get(function () {
    return this.currentStock;
});

InventorySchema.virtual('minStock').get(function () {
    return this.reorderLevel;
});

InventorySchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Inventory', InventorySchema);