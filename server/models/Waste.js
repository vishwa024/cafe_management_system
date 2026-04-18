const mongoose = require("mongoose");
const WasteLogSchema = new mongoose.Schema({
    inventoryItem: { type: mongoose.Schema.Types.ObjectId, ref: 'Inventory', required: true },
    quantity:      { type: Number, required: true },
    unit:          { type: String, required: true },
    reason:        { type: String, required: true },
    loggedBy:      { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });
 
module.exports = mongoose.model('WasteLog', WasteLogSchema);