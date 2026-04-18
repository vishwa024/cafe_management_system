// const mongoose = require('mongoose');

// const orderItemSchema = new mongoose.Schema({
//   menuItem: { type: mongoose.Schema.Types.ObjectId, ref: 'MenuItem', required: true },
//   name: String,
//   quantity: { type: Number, required: true, min: 1 },
//   variant: String,
//   addons: [{ name: String, price: Number }],
//   unitPrice: { type: Number, required: true },
//   totalPrice: { type: Number, required: true },
// }, { _id: false });

// const deliveryAddressSchema = new mongoose.Schema({
//   addressId: { type: mongoose.Schema.Types.ObjectId, ref: 'Address', default: null },
//   text: { type: String, trim: true, default: '' },
//   lat: { type: Number, default: null },
//   lng: { type: Number, default: null },
// }, { _id: false });

// const trackingSchema = new mongoose.Schema({
//   lat: { type: Number, default: null },
//   lng: { type: Number, default: null },
//   updatedAt: { type: Date, default: null },
// }, { _id: false });

// const statusHistorySchema = new mongoose.Schema({
//   status: { type: String, required: true, trim: true, lowercase: true },
//   updatedAt: { type: Date, default: Date.now },
//   updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
//   note: { type: String, trim: true, default: '' },
// }, { _id: false });

// const notificationLogSchema = new mongoose.Schema({
//   status: { type: String, trim: true, lowercase: true, default: '' },
//   title: { type: String, trim: true, default: '' },
//   message: { type: String, trim: true, default: '' },
//   channels: { type: [String], default: [] },
//   sentAt: { type: Date, default: Date.now },
// }, { _id: false });

// const deliveryRejectionSchema = new mongoose.Schema({
//   agent: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
//   rejectedAt: { type: Date, default: Date.now },
//   reason: { type: String, trim: true, default: '' },
// }, { _id: false });

// const proofOfDeliverySchema = new mongoose.Schema({
//   receiverName: { type: String, trim: true, default: '' },
//   note: { type: String, trim: true, default: '' },
//   photoUrl: { type: String, trim: true, default: '' },
//   submittedAt: { type: Date, default: null },
// }, { _id: false });

// const deliveryRatingSchema = new mongoose.Schema({
//   score: { type: Number, min: 1, max: 5, default: null },
//   review: { type: String, trim: true, default: '' },
//   ratedAt: { type: Date, default: null },
// }, { _id: false });

// // Add these fields to your Order schema in Order.js

// const orderSchema = new mongoose.Schema({
//   // ... existing fields ...
  
//   // Add these new fields for soft delete functionality
//   isDeleted: { type: Boolean, default: false },
//   deletedAt: { type: Date, default: null },
//   deletedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  
//   // Add receiver name and proof note fields (if not already present)
//   receiverName: { type: String, trim: true, default: '' },
//   proofNote: { type: String, trim: true, default: '' },
//   proofPhotoUrl: { type: String, trim: true, default: '' },
  
//   // ... rest of schema
// }, { timestamps: true });

// const orderSchema = new mongoose.Schema({
//   orderId: { type: String, unique: true, required: true, trim: true },
//   customer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
//   source: {
//     type: String,
//     enum: ['customer', 'staff-pos'],
//     default: 'customer',
//   },
//   guestName: { type: String, trim: true, default: '' },
//   guestPhone: { type: String, trim: true, default: '' },
//   tableNumber: { type: String, trim: true, default: '' },
//   createdByStaff: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'User',
//     default: null,
//   },
//   items: { type: [orderItemSchema], default: [] },
//   assignedStaff: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'User',
//     default: null,
//   },
//   deliveryAgent: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'User',
//     default: null,
//   },
//   orderType: {
//     type: String,
//     enum: ['dine-in', 'takeaway', 'delivery', 'pre-order'],
//     required: true,
//   },
//   status: {
//     type: String,
//     enum: ['placed', 'confirmed', 'preparing', 'ready', 'completed', 'out-for-delivery', 'delivered', 'cancelled'],
//     default: 'placed',
//     lowercase: true,
//     trim: true,
//   },
//   deliveryAddress: {
//     type: deliveryAddressSchema,
//     default: undefined,
//   },
//   scheduledTime: { type: Date, default: null },
//   subtotal: { type: Number, required: true },
//   taxAmount: { type: Number, default: 0 },
//   deliveryFee: { type: Number, default: 0 },
//   tipAmount: { type: Number, default: 0 },
//   deliveryPayout: { type: Number, default: 0 },
//   preOrderFee: { type: Number, default: 0 },
//   discount: { type: Number, default: 0 },
//   totalAmount: { type: Number, required: true },
//   paymentMethod: {
//     type: String,
//     enum: ['online', 'cod', 'wallet', 'upi', 'bank'],
//     required: true,
//   },
//   paymentStatus: {
//     type: String,
//     enum: ['paid', 'pending', 'failed', 'refunded'],
//     default: 'pending',
//   },
//   paymentId: { type: String, trim: true, default: '' },
//   couponCode: { type: String, trim: true, default: '' },
//   customerAcceptedTerms: { type: Boolean, default: false },
//   specialNotes: { type: String, trim: true, default: '' },
//   deliveryOTP: { type: String, trim: true, default: '' },
//   cancelReason: { type: String, trim: true, default: '' },
//   pickedUpAt: { type: Date, default: null },
//   deliveredAt: { type: Date, default: null },
//   estimatedDeliveryAt: { type: Date, default: null },
//   estimatedDurationMinutes: { type: Number, default: 0 },
//   etaUpdatedAt: { type: Date, default: null },
//   delayedAt: { type: Date, default: null },
//   delayReason: { type: String, trim: true, default: '' },
//   // In the order schema, make sure deliveryPayout is present
//   deliveryPayout: { type: Number, default: 0 },
//   liveLocation: {
//     type: trackingSchema,
//     default: () => ({}),
//   },
//   notificationLog: {
//     type: [notificationLogSchema],
//     default: [],
//   },
//   proofOfDelivery: {
//     type: proofOfDeliverySchema,
//     default: () => ({}),
//   },
//   deliveryRating: {
//     type: deliveryRatingSchema,
//     default: () => ({}),
//   },
//   deliveryRejections: {
//     type: [deliveryRejectionSchema],
//     default: [],
//   },
//   statusHistory: {
//     type: [statusHistorySchema],
//     default: [],
//   },
// }, { timestamps: true });

// module.exports = mongoose.model('Order', orderSchema);
const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  menuItem: { type: mongoose.Schema.Types.ObjectId, ref: 'MenuItem', required: true },
  name: String,
  quantity: { type: Number, required: true, min: 1 },
  variant: String,
  addons: [{ name: String, price: Number }],
  unitPrice: { type: Number, required: true },
  totalPrice: { type: Number, required: true },
}, { _id: false });

const deliveryAddressSchema = new mongoose.Schema({
  addressId: { type: mongoose.Schema.Types.ObjectId, ref: 'Address', default: null },
  text: { type: String, trim: true, default: '' },
  lat: { type: Number, default: null },
  lng: { type: Number, default: null },
}, { _id: false });

const trackingSchema = new mongoose.Schema({
  lat: { type: Number, default: null },
  lng: { type: Number, default: null },
  locationName: { type: String, trim: true, default: '' },
  address: { type: String, trim: true, default: '' },
  updatedAt: { type: Date, default: null },
}, { _id: false });

const statusHistorySchema = new mongoose.Schema({
  status: { type: String, required: true, trim: true, lowercase: true },
  updatedAt: { type: Date, default: Date.now },
  updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  note: { type: String, trim: true, default: '' },
}, { _id: false });

const notificationLogSchema = new mongoose.Schema({
  status: { type: String, trim: true, lowercase: true, default: '' },
  title: { type: String, trim: true, default: '' },
  message: { type: String, trim: true, default: '' },
  channels: { type: [String], default: [] },
  sentAt: { type: Date, default: Date.now },
}, { _id: false });

const deliveryRejectionSchema = new mongoose.Schema({
  agent: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  rejectedAt: { type: Date, default: Date.now },
  reason: { type: String, trim: true, default: '' },
}, { _id: false });

const proofOfDeliverySchema = new mongoose.Schema({
  receiverName: { type: String, trim: true, default: '' },
  note: { type: String, trim: true, default: '' },
  photoUrl: { type: String, trim: true, default: '' },
  submittedAt: { type: Date, default: null },
}, { _id: false });

const deliveryRatingSchema = new mongoose.Schema({
  score: { type: Number, min: 1, max: 5, default: null },
  review: { type: String, trim: true, default: '' },
  ratedAt: { type: Date, default: null },
}, { _id: false });

const deliveryPaymentSchema = new mongoose.Schema({
  method: {
    type: String,
    enum: ['', 'cod', 'online', 'cash', 'upi'],
    default: '',
  },
  status: {
    type: String,
    enum: ['pending', 'paid', 'failed'],
    default: 'pending',
  },
  amount: { type: Number, default: 0 },
  qrPayload: { type: String, trim: true, default: '' },
  reference: { type: String, trim: true, default: '' },
  note: { type: String, trim: true, default: '' },
  confirmedAt: { type: Date, default: null },
  confirmedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  source: { type: String, trim: true, default: '' },
}, { _id: false });

const orderSchema = new mongoose.Schema({
  orderId: { type: String, unique: true, required: true, trim: true },
  customer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  source: {
    type: String,
    enum: ['customer', 'staff-pos'],
    default: 'customer',
  },
  guestName: { type: String, trim: true, default: '' },
  guestPhone: { type: String, trim: true, default: '' },
  tableNumber: { type: String, trim: true, default: '' },
  guestCount: { type: Number, default: 0 },
  createdByStaff: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null,
  },
  items: { type: [orderItemSchema], default: [] },
  assignedStaff: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null,
  },
  deliveryAgent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null,
  },
  orderType: {
    type: String,
    enum: ['dine-in', 'takeaway', 'delivery', 'pre-order'],
    required: true,
  },
  isPreOrder: { type: Boolean, default: false },
  preOrderMethod: {
    type: String,
    enum: ['', 'dine-in', 'takeaway', 'delivery'],
    default: '',
  },
  status: {
    type: String,
    enum: ['placed', 'confirmed', 'preparing', 'ready', 'completed', 'out-for-delivery', 'delivered', 'cancelled'],
    default: 'placed',
    lowercase: true,
    trim: true,
  },
  deliveryAddress: {
    type: deliveryAddressSchema,
    default: undefined,
  },
  scheduledTime: { type: Date, default: null },
  inventoryDeductedAt: { type: Date, default: null },
  subtotal: { type: Number, required: true },
  taxAmount: { type: Number, default: 0 },
  deliveryFee: { type: Number, default: 0 },
  tipAmount: { type: Number, default: 0 },
  deliveryPayout: { type: Number, default: 0 },
  preOrderFee: { type: Number, default: 0 },
  discount: { type: Number, default: 0 },
  totalAmount: { type: Number, required: true },
  invoiceNumber: { type: String, trim: true, default: '' },
  invoiceGeneratedAt: { type: Date, default: null },
  invoiceIssuedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  paymentMethod: {
    type: String,
    enum: ['online', 'cod', 'wallet', 'upi', 'bank'],
    required: true,
  },
  paymentStatus: {
    type: String,
    enum: ['paid', 'pending', 'failed', 'refunded'],
    default: 'pending',
  },
  paymentId: { type: String, trim: true, default: '' },
  paidAt: { type: Date, default: null },
  paymentConfirmedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  paymentNote: { type: String, trim: true, default: '' },
  couponCode: { type: String, trim: true, default: '' },
  customerAcceptedTerms: { type: Boolean, default: false },
  specialNotes: { type: String, trim: true, default: '' },
  deliveryOTP: { type: String, trim: true, default: '' },
  cancelReason: { type: String, trim: true, default: '' },
  pickedUpAt: { type: Date, default: null },
  deliveredAt: { type: Date, default: null },
  estimatedDeliveryAt: { type: Date, default: null },
  estimatedDurationMinutes: { type: Number, default: 0 },
  etaUpdatedAt: { type: Date, default: null },
  delayedAt: { type: Date, default: null },
  delayReason: { type: String, trim: true, default: '' },
  
  // Soft delete fields
  isDeleted: { type: Boolean, default: false },
  deletedAt: { type: Date, default: null },
  deletedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  
  // Delivery proof fields
  receiverName: { type: String, trim: true, default: '' },
  proofNote: { type: String, trim: true, default: '' },
  proofPhotoUrl: { type: String, trim: true, default: '' },
  
  liveLocation: {
    type: trackingSchema,
    default: () => ({}),
  },
  notificationLog: {
    type: [notificationLogSchema],
    default: [],
  },
  proofOfDelivery: {
    type: proofOfDeliverySchema,
    default: () => ({}),
  },
  deliveryRating: {
    type: deliveryRatingSchema,
    default: () => ({}),
  },
  deliveryPayment: {
    type: deliveryPaymentSchema,
    default: () => ({}),
  },
  deliveryRejections: {
    type: [deliveryRejectionSchema],
    default: [],
  },
  statusHistory: {
    type: [statusHistorySchema],
    default: [],
  },
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
