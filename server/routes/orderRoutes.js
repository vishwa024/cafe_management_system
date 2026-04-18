const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { allowRoles } = require('../middleware/roleCheck');
const {
  placeOrder,
  createPOSOrder,
  getMyOrders,
  getOrder,
  getPublicInvoiceOrder,
  updateStatus,
  downloadInvoice,
  cancelOrder,
  getAllOrders,
  assignStaff,
  rateDelivery,
  deleteOrder,
} = require('../controllers/orderController');

router.post('/', protect, allowRoles('customer'), placeOrder);
router.post('/pos', protect, allowRoles('staff', 'admin', 'manager'), createPOSOrder);
router.get('/my', protect, allowRoles('customer'), getMyOrders);
router.get('/public/:id', getPublicInvoiceOrder);
router.get('/:id', protect, getOrder);
router.get('/:id/invoice', protect, allowRoles('customer', 'admin', 'manager', 'staff'), downloadInvoice);
router.put('/:id/assign-staff', protect, allowRoles('staff', 'admin', 'manager'), assignStaff);
router.put('/:id/status', protect, allowRoles('manager', 'staff', 'kitchen', 'delivery'), updateStatus);
router.post('/:id/delivery-rating', protect, allowRoles('customer'), rateDelivery);
router.post('/:id/cancel', protect, cancelOrder);
router.delete('/:id', protect, allowRoles('customer', 'staff', 'admin', 'manager'), deleteOrder);
router.get('/', protect, allowRoles('admin', 'manager', 'staff', 'kitchen'), getAllOrders);

module.exports = router;



