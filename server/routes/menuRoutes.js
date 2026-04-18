const express = require('express');
const router = express.Router();
const MenuItem = require('../models/MenuItem');
const Order = require('../models/Order');
const { protect } = require('../middleware/auth');
const { allowRoles } = require('../middleware/roleCheck');

function withReviewSummary(itemDoc) {
  const item = itemDoc.toObject ? itemDoc.toObject() : itemDoc;
  const reviews = [...(item.reviews || [])].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  return {
    ...item,
    reviews,
    averageRating: item.averageRating || 0,
    totalReviews: item.totalReviews || reviews.length,
  };
}

async function saveReview(req, res) {
  try {
    const rating = Number(req.body.rating);
    const comment = req.body.comment?.trim?.() || '';

    if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Rating must be between 1 and 5' });
    }

    const item = await MenuItem.findById(req.params.id);
    if (!item || item.isArchived) {
      return res.status(404).json({ message: 'Menu item not found' });
    }

    const eligibleOrder = await Order.findOne({
      customer: req.user._id,
      status: { $in: ['delivered', 'completed'] },
      'items.menuItem': item._id,
    });

    if (!eligibleOrder) {
      return res.status(400).json({ message: 'You can review this dish only after completing an order for it' });
    }

    const existingIndex = (item.reviews || []).findIndex((review) => review.user?.toString() === req.user._id.toString());
    if (existingIndex >= 0) {
      item.reviews[existingIndex].rating = rating;
      item.reviews[existingIndex].comment = comment;
      item.reviews[existingIndex].customerName = req.user.name || 'Customer';
      item.reviews[existingIndex].createdAt = new Date();
    } else {
      item.reviews.push({
        user: req.user._id,
        customerName: req.user.name || 'Customer',
        rating,
        comment,
        createdAt: new Date(),
      });
    }

    item.totalReviews = item.reviews.length;
    item.averageRating = item.totalReviews
      ? Number((item.reviews.reduce((sum, review) => sum + Number(review.rating || 0), 0) / item.totalReviews).toFixed(1))
      : 0;

    await item.save();
    res.status(201).json({
      message: 'Review saved successfully',
      item: withReviewSummary(item),
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

router.get('/', async (req, res) => {
  try {
    const items = await MenuItem.find({ isArchived: false });
    res.json(items.map(withReviewSummary));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/:id/reviews', protect, allowRoles('customer'), saveReview);
router.post('/item/:id/reviews', protect, allowRoles('customer'), saveReview);
router.post('/reviews/:id', protect, allowRoles('customer'), saveReview);

router.get('/:id', async (req, res) => {
  try {
    const item = await MenuItem.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Item not found' });
    res.json(withReviewSummary(item));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/', protect, allowRoles('admin', 'manager'), async (req, res) => {
  try {
    const item = await MenuItem.create(req.body);
    res.status(201).json(item);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put('/:id', protect, allowRoles('admin', 'manager'), async (req, res) => {
  try {
    const item = await MenuItem.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(item);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
