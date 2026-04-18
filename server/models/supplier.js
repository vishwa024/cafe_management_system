const mongoose = require("mongoose");
const SupplierSchema = new mongoose.Schema({
    name:        { type: String, required: true, trim: true },
    contactName: { type: String, default: '' },
    phone:       { type: String, default: '' },
    email:       { type: String, default: '' },
    accountName: { type: String, default: '', trim: true },
    upiId:       { type: String, default: '', trim: true },
    qrCodeUrl:   { type: String, default: '', trim: true },
    // List of ingredient names this supplier provides
    ingredients: [{ type: String }]
}, { timestamps: true });
 
module.exports = mongoose.model('Supplier', SupplierSchema);
 
