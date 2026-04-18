// const Inventory = require('../models/inventory');

// const normalizeInventoryItem = (item) => {
//     const category = item.category && String(item.category).trim() ? item.category : 'Other';

//     return {
//         ...item,
//         category,
//         quantity: item.currentStock,
//         minStock: item.reorderLevel,
//         supplier: item.supplier || '',
//         notes: item.notes || ''
//     };
// };

// // @desc    Get all inventory items
// // @route   GET /api/inventory
// exports.getInventory = async (req, res) => {
//     try {
//         const items = await Inventory.find({}).lean().sort({ createdAt: -1 });
//         const normalizedItems = items.map(normalizeInventoryItem);
//         const lowStock = normalizedItems.filter(item => item.currentStock <= item.reorderLevel);

//         res.json({
//             ingredients: normalizedItems,
//             inventory: normalizedItems,
//             lowStockAlerts: lowStock
//         });
//     } catch (error) {
//         console.error('❌ getInventory error:', error); // ← shows exact crash in terminal
//         res.status(500).json({ message: error.message });
//     }
// };

// // @desc    Add new item (Fixes "Failed to add item")
// // @route   POST /api/inventory
// exports.addInventoryItem = async (req, res) => {
//     try {
//         const { name, category, unit, currentStock, reorderLevel, quantity, minStock, supplier, notes } = req.body;
//         const newItem = await Inventory.create({
//             name,
//             category: category || 'Other',
//             unit: unit || 'pieces',
//             currentStock: currentStock ?? quantity ?? 0,
//             reorderLevel: reorderLevel ?? minStock ?? 10,
//             supplier: supplier || '',
//             notes: notes || ''
//         });
//         res.status(201).json(normalizeInventoryItem(newItem.toJSON()));
//     } catch (error) {
//         res.status(400).json({ message: error.message });
//     }
// };

// // @desc    Update inventory item
// // @route   PATCH /api/inventory/:id
// exports.updateInventoryItem = async (req, res) => {
//     try {
//         const updatePayload = {};

//         ['name', 'category', 'unit', 'supplier', 'notes'].forEach((field) => {
//             if (req.body[field] !== undefined) {
//                 updatePayload[field] = req.body[field];
//             }
//         });

//         if (req.body.currentStock !== undefined || req.body.quantity !== undefined) {
//             updatePayload.currentStock = req.body.currentStock ?? req.body.quantity;
//         }

//         if (req.body.reorderLevel !== undefined || req.body.minStock !== undefined) {
//             updatePayload.reorderLevel = req.body.reorderLevel ?? req.body.minStock;
//         }

//         const item = await Inventory.findByIdAndUpdate(req.params.id, updatePayload, {
//             new: true,
//             runValidators: true
//         });

//         if (!item) return res.status(404).json({ message: 'Item not found' });

//         res.json(normalizeInventoryItem(item.toJSON()));
//     } catch (error) {
//         res.status(400).json({ message: error.message });
//     }
// };

// // @desc    Toggle Availability (For Kitchen "In/Out" buttons)
// exports.toggleStatus = async (req, res) => {
//     try {
//         const item = await Inventory.findById(req.params.id);
//         if (!item) return res.status(404).json({ message: 'Item not found' });

//         item.isAvailable = !item.isAvailable;
//         await item.save();
//         res.json(item);
//     } catch (error) {
//         res.status(400).json({ message: error.message });
//     }
// };

// // @desc    Delete Item
// exports.deleteInventoryItem = async (req, res) => {
//     try {
//         await Inventory.findByIdAndDelete(req.params.id);
//         res.json({ message: 'Item removed successfully' });
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// };

const Inventory = require('../models/inventory');
const Supplier = require('../models/supplier');

// Get all inventory items
const getInventory = async (req, res) => {
    try {
        const items = await Inventory.find().populate('supplier', 'name phone email');
        res.json(items);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Get low stock items
const getLowStockItems = async (req, res) => {
    try {
        const lowStock = await Inventory.find({
            $expr: { $lte: ['$currentStock', '$reorderLevel'] }
        }).populate('supplier', 'name phone email');
        res.json(lowStock);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Add inventory item
const addInventoryItem = async (req, res) => {
    try {
        const { name, currentStock, unit, reorderLevel, supplier, notes, category } = req.body;
        
        const item = new Inventory({
            name,
            currentStock: currentStock || 0,
            unit,
            reorderLevel: reorderLevel || 0,
            supplier: supplier || null,
            notes: notes || '',
            category: category || 'Other'
        });
        
        const saved = await item.save();
        res.status(201).json(saved);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Update inventory item
const updateInventoryItem = async (req, res) => {
    try {
        const item = await Inventory.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        if (!item) return res.status(404).json({ message: 'Item not found' });
        res.json(item);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Delete inventory item
const deleteInventoryItem = async (req, res) => {
    try {
        const item = await Inventory.findByIdAndDelete(req.params.id);
        if (!item) return res.status(404).json({ message: 'Item not found' });
        res.json({ message: 'Item deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Update stock
const updateStock = async (req, res) => {
    try {
        const { quantity, note } = req.body;
        const item = await Inventory.findById(req.params.id);
        
        if (!item) return res.status(404).json({ message: 'Item not found' });
        
        const oldStock = item.currentStock;
        item.currentStock += Number(quantity);
        item.stockHistory.push({
            change: Number(quantity),
            note: note || `Stock updated from ${oldStock} to ${item.currentStock}`,
            date: new Date(),
            updatedBy: req.user?._id
        });
        
        await item.save();
        
        res.json({ 
            message: 'Stock updated successfully', 
            item,
            oldStock,
            newStock: item.currentStock
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Toggle item status
const toggleStatus = async (req, res) => {
    try {
        const item = await Inventory.findById(req.params.id);
        if (!item) return res.status(404).json({ message: 'Item not found' });
        
        // You can implement soft delete or status toggle here
        res.json({ message: 'Status toggled', item });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

module.exports = {
    getInventory,
    getLowStockItems,
    addInventoryItem,
    updateInventoryItem,
    deleteInventoryItem,
    updateStock,
    toggleStatus
};