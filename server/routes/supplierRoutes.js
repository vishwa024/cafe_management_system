const express = require('express');
const router = express.Router();
const {
    getSupplierOrderDetails,
    respondToSupplierOrder,
    respondToOrderFromEmail,
} = require('../controllers/supplierOrderWorkflowcontroller');

router.get('/test', (req, res) => {
    res.json({ success: true, message: 'Supplier routes are LIVE on Render!' });
});

router.get('/:id/details', getSupplierOrderDetails);
router.post('/:id/respond', respondToSupplierOrder);
router.get('/:id/respond', respondToOrderFromEmail);

module.exports = router;
