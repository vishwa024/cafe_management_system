const mongoose = require("mongoose");
const PromotionSchema = new mongoose.Schema({
    code:           { type: String, required: true, unique: true, uppercase: true },
    type:           { type: String, required: true, enum: ['percentage', 'fixed'] },
    value:          { type: Number, required: true },     // % or fixed amount
    minOrderAmount: { type: Number, default: 0 },
    startDate:      { type: Date },
    endDate:        { type: Date },
    description:    { type: String, default: '' },
    isActive:       { type: Boolean, default: true },
    usageCount:     { type: Number, default: 0 }
}, { timestamps: true });
 
module.exports = mongoose.models.Promotion || mongoose.model('Promotion', PromotionSchema);
 

