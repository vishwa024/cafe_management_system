const crypto = require('crypto');

/**
 * Generate a cryptographically secure 6-digit OTP
 */
const generateOTP = () => {
  const bytes = crypto.randomBytes(3);
  const otp = (parseInt(bytes.toString('hex'), 16) % 900000) + 100000;
  return String(otp);
};

/**
 * Generate a 4-digit delivery confirmation OTP
 */
const generateDeliveryOTP = () => {
  const bytes = crypto.randomBytes(2);
  const otp = (parseInt(bytes.toString('hex'), 16) % 9000) + 1000;
  return String(otp);
};

module.exports = { generateOTP, generateDeliveryOTP };
