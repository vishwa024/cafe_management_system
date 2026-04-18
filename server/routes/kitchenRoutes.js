// const express = require('express');
// const router = express.Router();

// // Import controller functions
// const {
//     getActiveOrders,
//     updateOrderStatus,
//     toggleMenuItemAvailability,
// } = require('../controllers/kitchenController');

// // Import middleware for authentication and role-based access
// const { protect } = require('../middleware/auth');

// // Apply middleware to all routes in this file
// router.use(protect);
// // router.use(authorize('kitchen'));

// // --- Order Management ---
// router.route('/orders').get(getActiveOrders);
// router.route('/orders/:id/status').put(updateOrderStatus);

// // --- Menu Item Availability ---
// router.route('/menu/:id/availability').patch(toggleMenuItemAvailability);


// module.exports = router;
const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
    getKitchenOrders,
    getReadyOrders,
    getKitchenHistoryOrders,
    getKitchenTeamStatus,
    updateOrderStatus,
    toggleItemAvailability,
    getRecipe,
    logWaste,
    getWasteLogs,
    getKitchenStats
} = require('../controllers/kitchenController');

// All routes require authentication + kitchen role
router.use(protect);
// router.use(authorize('kitchen', 'manager', 'admin'));

// Order Queue (KDS)
router.get('/orders', getKitchenOrders);
router.get('/orders/ready', getReadyOrders);
router.get('/orders/history', getKitchenHistoryOrders);
router.get('/team-status', getKitchenTeamStatus);
router.patch('/orders/:id/status', updateOrderStatus);

// Menu availability toggle
router.patch('/menu/:id/availability', toggleItemAvailability);

// Recipe view
router.get('/menu/:id/recipe', getRecipe);

// Waste logging
router.get('/waste', getWasteLogs);
router.post('/waste', logWaste);

// Performance stats
router.get('/stats', getKitchenStats);

module.exports = router;
