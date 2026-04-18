const express = require('express');
const router = express.Router();
const {
    getSupplierOrderDetails,
    respondToSupplierOrder,
    respondToOrderFromEmail,
} = require('../controllers/supplierOrderWorkflowController');

router.get('/:id/details', getSupplierOrderDetails);
router.post('/:id/respond', respondToSupplierOrder);
router.get('/:id/respond', respondToOrderFromEmail);

module.exports = router;
