const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const supplierOrderController = require('../controllers/supplierOrderWorkflowcontroller');
const {
    getDashboard,
    getAllOrders, getOrderById, markOrderPaid, cancelOrder,
    getMenuItems, createMenuItem, updateMenuItem, toggleMenuItem, deleteMenuItem,
    getInventory, createInventoryItem, updateStock, updateInventoryItem, deleteInventoryItem,
    getStaff,
    getSalesReport,
    getPromotions, createPromotion, updatePromotion, deletePromotion,
    getSuppliers, createSupplier, updateSupplier, deleteSupplier
} = require('../controllers/managerController');

// Import supplier order controller
// const {
//     createOrderFromLowStock,
//     getAllOrders: getAllSupplierOrders,
//     getOrdersByStatus,
//     updateOrderStatus,
//     getOrderById: getSupplierOrderById,
//     deleteOrder
// } = require('../controllers/supplierController');


// All routes require authentication + manager role
router.use(protect);
// router.use(authorize('manager', 'admin'));

// Dashboard
router.get('/dashboard', getDashboard);

// Orders
router.get('/orders', getAllOrders);
router.get('/orders/:id', getOrderById);
router.patch('/orders/:id/mark-paid', markOrderPaid);
router.patch('/orders/:id/cancel', cancelOrder);

// Menu
router.get('/menu', getMenuItems);
router.post('/menu', createMenuItem);
router.put('/menu/:id', updateMenuItem);
router.patch('/menu/:id/toggle', toggleMenuItem);
router.delete('/menu/:id', deleteMenuItem);

// Inventory
router.get('/inventory', getInventory);
router.post('/inventory', createInventoryItem);
router.put('/inventory/:id', updateInventoryItem);
router.patch('/inventory/:id/stock', updateStock);
router.delete('/inventory/:id', deleteInventoryItem);

// Staff
router.get('/staff', getStaff);

// Reports
router.get('/reports/sales', getSalesReport);

// Promotions
router.get('/promotions', getPromotions);
router.post('/promotions', createPromotion);
router.put('/promotions/:id', updatePromotion);
router.delete('/promotions/:id', deletePromotion);

// Suppliers
router.get('/suppliers', getSuppliers);
router.post('/suppliers', createSupplier);
router.put('/suppliers/:id', updateSupplier);
router.delete('/suppliers/:id', deleteSupplier);

// Supplier Orders (Purchase Orders)
router.post('/supplier-orders/create-from-low-stock', supplierOrderController.createOrderFromLowStock);
router.get('/supplier-orders', supplierOrderController.getAllOrders);
router.get('/supplier-orders/:id', supplierOrderController.getOrderById);
router.patch('/supplier-orders/:id/status', supplierOrderController.updateOrderStatus);
router.patch('/supplier-orders/:id/payment', supplierOrderController.updateOrderPayment);
router.patch('/supplier-orders/:id/deliver', supplierOrderController.markOrderDelivered);
router.patch('/supplier-orders/:id/update-prices', supplierOrderController.updateOrderPrices);
router.delete('/supplier-orders/:id', supplierOrderController.deleteorderById);

module.exports = router;
