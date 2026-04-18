require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');

const seed = async () => {
  await mongoose.connect(process.env.MONGO_URI);

  const existing = await User.findOne({ role: 'admin' });
  if (existing) {
    console.log('Admin already exists:', existing.email);
    process.exit(0);
  }

  const admin = await User.create({
    name: process.env.ADMIN_NAME || 'Super Admin',
    email: process.env.ADMIN_EMAIL || 'admin@example.com',
    phone: process.env.ADMIN_PHONE || '+910000000000',
    password: process.env.ADMIN_PASSWORD || 'Admin@12345',
    role: 'admin',
    isActive: true,
    isEmailVerified: true,
    isPhoneVerified: true,
  });

  console.log('Admin created!');
  console.log('Email:', admin.email);
  console.log('Password:', process.env.ADMIN_PASSWORD || 'Admin@12345');
  process.exit(0);
};

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
