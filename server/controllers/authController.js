const User = require('../models/User');
const OTPToken = require('../models/OTPToken');
const RefreshToken = require('../models/RefreshToken');
const { generateOTP } = require('../utils/generateOTP');
const { generateAccessToken, generateRefreshToken } = require('../utils/generateToken');
const { sendOTPEmail, sendResetEmail } = require('../services/emailService');
const { sendOTPSMS } = require('../services/smsService');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');

const WELCOME_WALLET_BONUS = 100;
const WELCOME_LOYALTY_POINTS = 50;

const normalizeEmail = (value) => String(value || '').trim().toLowerCase();
const normalizePhone = (value) => String(value || '').replace(/\D/g, '');
const isValidEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
const isValidPhone = (value) => /^\d{10,15}$/.test(value);
const isStrongPassword = (value) => /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(value);
const buildIdentifierConditions = ({ email, phone }) => {
  const conditions = [];
  if (email) conditions.push({ email });
  if (phone) conditions.push({ phone });
  return conditions;
};

exports.register = async (req, res) => {
  try {
    const name = String(req.body?.name || '').trim();
    const email = normalizeEmail(req.body?.email);
    const phone = normalizePhone(req.body?.phone);
    const password = String(req.body?.password || '');

    if (name.length < 2) {
      return res.status(400).json({ message: 'Please enter a valid full name' });
    }

    if (!email || !isValidEmail(email)) {
      return res.status(400).json({ message: 'Please enter a valid email address' });
    }

    if (!phone || !isValidPhone(phone)) {
      return res.status(400).json({ message: 'Please enter a valid phone number' });
    }

    if (!isStrongPassword(password)) {
      return res.status(400).json({ message: 'Password must be at least 8 characters and include uppercase, lowercase, and a number' });
    }

    const conditions = buildIdentifierConditions({ email, phone });

    const existing = conditions.length > 0 ? await User.findOne({ $or: conditions }) : null;
    if (existing) return res.status(409).json({ message: 'Email or phone already registered' });

    const otp = generateOTP();
    await OTPToken.findOneAndDelete({ ...(email ? { email } : { phone }), type: 'email-verify' });
    await OTPToken.create({
      email: email || undefined,
      phone: phone || undefined,
      otp: await bcrypt.hash(otp, 10),
      type: 'email-verify',
      pendingRegistration: {
        name,
        email: email || undefined,
        phone: phone || undefined,
        password,
      },
      expiresAt: new Date(Date.now() + 5 * 60 * 1000),
    });

    if (email) await sendOTPEmail(email, otp, name, { purpose: 'register' });
    if (phone) await sendOTPSMS(phone, otp);

    res.status(201).json({
      message: 'Registration started. Please verify OTP to finish creating your account.',
      walletBonus: WELCOME_WALLET_BONUS,
      loyaltyBonus: WELCOME_LOYALTY_POINTS,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    if (!user.isActive) return res.status(403).json({ message: 'Account is disabled' });

    const otp = generateOTP();
    await OTPToken.findOneAndDelete({ email: user.email, type: 'login' });
    await OTPToken.create({
      userId: user._id,
      email: user.email,
      phone: user.phone || undefined,
      otp: await bcrypt.hash(otp, 10),
      type: 'login',
      expiresAt: new Date(Date.now() + 5 * 60 * 1000),
    });

    if (user.email) await sendOTPEmail(user.email, otp, user.name, { purpose: 'login' });
    if (user.phone) await sendOTPSMS(user.phone, otp);

    res.json({
      message: 'OTP sent successfully',
      email: user.email,
      phone: user.phone,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.sendOTP = async (req, res) => {
  try {
    const normalizedEmail = normalizeEmail(req.body?.email);
    const normalizedPhone = normalizePhone(req.body?.phone);
    const type = String(req.body?.type || '').trim();
    const identifier = normalizedEmail || normalizedPhone;

    if (!identifier || !type) {
      return res.status(400).json({ message: 'Email or phone and OTP type are required' });
    }

    const existingRecord = await OTPToken.findOne({
      ...(normalizedEmail ? { email: normalizedEmail } : { phone: normalizedPhone }),
      type,
    });

    if (type === 'email-verify') {
      const existingUserConditions = buildIdentifierConditions({ email: normalizedEmail, phone: normalizedPhone });
      const existingUser = existingUserConditions.length > 0 ? await User.findOne({ $or: existingUserConditions }) : null;

      if (!existingUser && !existingRecord?.pendingRegistration) {
        return res.status(404).json({ message: 'Registration session expired. Please register again.' });
      }
    }

    const otp = generateOTP();
    const hash = await bcrypt.hash(otp, 10);

    await OTPToken.findOneAndDelete({ ...(normalizedEmail ? { email: normalizedEmail } : { phone: normalizedPhone }), type });
    await OTPToken.create({
      userId: existingRecord?.userId,
      email: normalizedEmail || undefined,
      phone: normalizedPhone || undefined,
      otp: hash,
      type,
      pendingRegistration: existingRecord?.pendingRegistration,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000),
    });

    if (normalizedEmail) await sendOTPEmail(normalizedEmail, otp, existingRecord?.pendingRegistration?.name || 'there', { purpose: type });
    if (normalizedPhone) await sendOTPSMS(normalizedPhone, otp);

    res.json({ message: `OTP sent to ${identifier}` });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.verifyOTP = async (req, res) => {
  try {
    const email = normalizeEmail(req.body?.email);
    const phone = normalizePhone(req.body?.phone);
    const otp = String(req.body?.otp || '');
    const type = String(req.body?.type || '').trim();

    const record = await OTPToken.findOne({
      ...(email ? { email } : { phone }),
      type,
      expiresAt: { $gt: new Date() },
    });

    if (!record) return res.status(400).json({ message: 'OTP expired or not found' });

    const isValid = await bcrypt.compare(otp, record.otp);
    if (!isValid) return res.status(400).json({ message: 'Invalid OTP' });

    const userConditions = buildIdentifierConditions({ email, phone });
    let user = userConditions.length > 0 ? await User.findOne({ $or: userConditions }) : null;

    if (!user && type === 'login') {
      return res.status(404).json({ message: 'User not found. Please register.' });
    }

    if (!user && type === 'email-verify' && record.pendingRegistration) {
      const pending = record.pendingRegistration;

      const duplicateConditions = buildIdentifierConditions({ email: pending.email, phone: pending.phone });
      const duplicateUser = duplicateConditions.length > 0 ? await User.findOne({ $or: duplicateConditions }) : null;

      if (duplicateUser) {
        return res.status(409).json({ message: 'Email or phone already registered' });
      }

      user = await User.create({
        name: pending.name,
        email: pending.email || undefined,
        phone: pending.phone || undefined,
        password: pending.password,
        role: 'customer',
        walletBalance: WELCOME_WALLET_BONUS,
        loyaltyPoints: WELCOME_LOYALTY_POINTS,
        isEmailVerified: Boolean(pending.email),
        isPhoneVerified: Boolean(pending.phone),
      });
    }

    if (!user) {
      return res.status(404).json({ message: 'User not found. Please register.' });
    }

    if (email) user.isEmailVerified = true;
    if (phone) user.isPhoneVerified = true;
    await user.save();

    await record.deleteOne();

    if (type === 'email-verify') {
      return res.json({
        message: 'Account verified successfully. Please login.',
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone || '',
          role: user.role,
        },
      });
    }

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    await RefreshToken.create({
      userId: user._id,
      token: refreshToken,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60 * 1000,
      sameSite: 'strict',
    });

    res.json({
      token: accessToken,
      accessToken,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone || '',
        address: user.address || '',
        bio: user.bio || '',
        role: user.role,
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.refreshToken = async (req, res) => {
  try {
    const token = req.cookies.refreshToken;
    if (!token) return res.status(401).json({ message: 'No refresh token' });

    const record = await RefreshToken.findOne({ token });
    if (!record || record.expiresAt < new Date()) {
      return res.status(401).json({ message: 'Refresh token expired' });
    }

    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) return res.status(401).json({ message: 'User not found' });

    const accessToken = generateAccessToken(user);
    res.json({ token: accessToken, accessToken });
  } catch (err) {
    res.status(401).json({ message: 'Invalid refresh token' });
  }
};

exports.logout = async (req, res) => {
  try {
    const token = req.cookies.refreshToken;
    if (token) await RefreshToken.findOneAndDelete({ token });
    res.clearCookie('refreshToken');
    res.json({ message: 'Logged out successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.forgotPassword = async (req, res) => {
  try {
    const { email, phone } = req.body;
    const user = await User.findOne({ $or: [{ email }, { phone }] });
    if (!user) return res.status(404).json({ message: 'No account with that email/phone' });

    const otp = generateOTP();
    await OTPToken.findOneAndDelete({ ...(email ? { email } : { phone }), type: 'forgot' });
    await OTPToken.create({
      email, phone,
      otp: await bcrypt.hash(otp, 10),
      type: 'forgot',
      expiresAt: new Date(Date.now() + 5 * 60 * 1000),
    });

    if (email) await sendResetEmail(email, otp, user.name);
    if (phone) await sendOTPSMS(phone, otp);

    res.json({ message: 'Reset OTP sent' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { email, phone, otp, newPassword } = req.body;

    const record = await OTPToken.findOne({
      ...(email ? { email } : { phone }),
      type: 'forgot',
      expiresAt: { $gt: new Date() },
    });

    if (!record) return res.status(400).json({ message: 'OTP expired or invalid' });
    const isValid = await bcrypt.compare(otp, record.otp);
    if (!isValid) return res.status(400).json({ message: 'Wrong OTP' });

    await record.deleteOne();
    const user = await User.findOne({ $or: [{ email }, { phone }] }).select('+password');
    user.password = newPassword;
    await user.save();

    res.json({ message: 'Password reset successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
