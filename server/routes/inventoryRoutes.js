const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { allowRoles } = require('../middleware/roleCheck');
const {
    getInventory,
    getLowStockItems,
    addInventoryItem,
    updateInventoryItem,
    deleteInventoryItem,
    updateStock,
    toggleStatus
} = require('../controllers/inventoryController');

router.use(protect);

router.get('/', allowRoles('manager', 'admin', 'kitchen', 'staff'), getInventory);
router.get('/low-stock', allowRoles('manager', 'admin', 'kitchen', 'staff'), getLowStockItems);
router.post('/', allowRoles('manager', 'kitchen', 'staff'), addInventoryItem);
router.put('/:id', allowRoles('manager', 'kitchen', 'staff'), updateInventoryItem);
router.patch('/:id', allowRoles('manager', 'kitchen', 'staff'), updateInventoryItem);
router.patch('/:id/stock', allowRoles('manager', 'admin', 'kitchen', 'staff'), updateStock);
router.patch('/:id/toggle', allowRoles('manager', 'kitchen', 'staff'), toggleStatus);
router.delete('/:id', allowRoles('manager','kitchen', 'staff'), deleteInventoryItem);

module.exports = router;
