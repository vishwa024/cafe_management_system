const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, unique: true, sparse: true, lowercase: true, trim: true },
  phone: { type: String, unique: true, sparse: true, trim: true },
  password: { type: String, select: false },
  role: {
    type: String,
    enum: ['admin', 'manager', 'staff', 'kitchen', 'delivery', 'customer'],
    default: 'customer',
  },
  isActive: { type: Boolean, default: true },
  isEmailVerified: { type: Boolean, default: false },
  isPhoneVerified: { type: Boolean, default: false },
  googleId: { type: String, sparse: true },
  profilePhoto: { type: String },
  loyaltyPoints: { type: Number, default: 0 },
  walletBalance: { type: Number, default: 0 },
  fcmToken: { type: String },  // Firebase push notifications
  // Delivery agent specific
  vehicleType: { type: String, enum: ['bike', 'scooter', 'cycle', null], default: null },
  isOnline: { type: Boolean, default: false },  // delivery agent online/offline
  totalEarnings: { type: Number, default: 0 },
  lastSeen: { type: Date, default: null },
  lastKnownLocation: {
    lat: { type: Number, default: null },
    lng: { type: Number, default: null },
    updatedAt: { type: Date, default: null },
  },
}, { timestamps: true });

// Hash password before save
userSchema.pre('save', async function (next) {
  if (!this.isModified('password') || !this.password) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Compare password
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
