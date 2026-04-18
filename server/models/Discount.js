const mongoose = require('mongoose');

const discountSchema = new mongoose.Schema({
    code: { type: String, required: true, unique: true, uppercase: true },
    type: { type: String, required: true, enum: ['percentage', 'fixed_amount'] },
    value: { type: Number, required: true }, // e.g., 10 for 10% or 5 for $5 off
    isActive: { type: Boolean, default: true },
    validFrom: { type: Date, required: true },
    validUntil: { type: Date, required: true },
    // Advanced: apply to specific categories or items
    // applicableItems: [{ type: mongoose.Schema.Types.ObjectId, ref: 'MenuItem' }]
}, { timestamps: true });

module.exports = mongoose.model('Discount', discountSchema);