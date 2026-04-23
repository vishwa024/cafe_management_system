const mongoose = require('mongoose');

const otpTokenSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  email: { type: String },
  phone: { type: String },
  otp: { type: String, required: true },
  type: { type: String, enum: ['email-verify', 'phone-verify', 'login', 'forgot'], required: true },
  pendingRegistration: {
    name: { type: String },
    email: { type: String },
    phone: { type: String },
    password: { type: String },
  },
  expiresAt: { type: Date, required: true, index: { expireAfterSeconds: 0 } },
});

module.exports = mongoose.model('OTPToken', otpTokenSchema);
