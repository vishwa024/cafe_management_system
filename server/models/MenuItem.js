const mongoose = require('mongoose');

const variantSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
});

const addonSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
});

const reviewSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  customerName: { type: String, trim: true, default: 'Customer' },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, trim: true, default: '' },
  createdAt: { type: Date, default: Date.now },
}, { _id: true });

const ingredientSchema = new mongoose.Schema({
  inventoryItem: { type: mongoose.Schema.Types.ObjectId, ref: 'Inventory', required: true },
  quantity: { type: Number, required: true, min: 0 },
  unit: { type: String, trim: true, default: '' },
}, { _id: false });

const menuItemSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  description: { type: String, default: '' },
  category: { type: String, required: true, trim: true },
  subcategory: { type: String, trim: true, default: '' },
  basePrice: { type: Number, required: true },
  variants: [variantSchema],
  addons: [addonSchema],
  image: { type: String, default: '' },
  recipe: { type: String, trim: true, default: '' },
  ingredients: { type: [ingredientSchema], default: [] },
  allergens: [String],
  isAvailable: { type: Boolean, default: true },
  isArchived: { type: Boolean, default: false },
  availableFrom: { type: String },
  availableTo: { type: String },
  averageRating: { type: Number, default: 0 },
  totalReviews: { type: Number, default: 0 },
  totalSold: { type: Number, default: 0 },
  tags: [String],
  reviews: { type: [reviewSchema], default: [] },
}, { timestamps: true });

module.exports = mongoose.model('MenuItem', menuItemSchema);
