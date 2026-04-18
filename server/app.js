// require('dotenv').config();
// const express = require('express');
// const cors = require('cors');
// const cookieParser = require('cookie-parser');
// const helmet = require('helmet');
// const morgan = require('morgan');
// const passport = require('passport');
// const path = require('path');
// const connectDB = require('./config/db');

// // Import passport config and pass passport instance
// const passportConfig = require('./config/passport');

// const authRoutes = require('./routes/authRoutes');
// const menuRoutes = require('./routes/menuRoutes');
// const orderRoutes = require('./routes/orderRoutes');
// const deliveryRoutes = require('./routes/deliveryRoutes');
// const kitchenRoutes = require('./routes/kitchenRoutes');
// const adminRoutes = require('./routes/adminRoutes');
// const managerRoutes = require('./routes/managerRoutes');
// const customerRoutes = require('./routes/customerRoutes');
// const inventoryRoutes = require('./routes/inventoryRoutes');
// const presenceRoutes = require('./routes/presenceRoutes');
// const supplierRoutes = require('./routes/supplierRoutes');
// const tableRoutes = require('./routes/tableRoutes');

// const app = express();

// // Connect DB
// connectDB();

// // Initialize passport with strategies
// passportConfig(passport);

// // Middleware
// app.use(helmet());
// app.use(cors({
//   origin: process.env.CLIENT_URL || 'http://localhost:5173',
//   credentials: true,
// }));
// app.use(cookieParser());
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
// app.use(morgan('dev'));
// app.use(passport.initialize());
// app.use('/uploads', express.static(path.join(__dirname, 'uploads'), {
//   setHeaders: (res) => {
//     res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
//   },
// }));

// // Routes
// app.use('/api/auth', authRoutes);
// app.use('/api/menu', menuRoutes);
// app.use('/api/orders', orderRoutes);
// app.use('/api/delivery', deliveryRoutes);
// app.use('/api/kitchen', kitchenRoutes);
// app.use('/api/admin', adminRoutes);
// app.use('/api/supplier-orders', supplierRoutes);
// app.use('/api/manager', managerRoutes);
// app.use('/api/customer', customerRoutes);
// app.use('/api/inventory', inventoryRoutes);
// app.use('/api/presence', presenceRoutes);
// app.use('/api/tables', tableRoutes);

// // Health check
// app.get('/api/health', (req, res) => res.json({ status: 'OK', cafe: 'Roller Coaster Cafe 🎢' }));

// // 404
// app.use((req, res) => res.status(404).json({ message: 'Route not found' }));

// // Error handler
// app.use((err, req, res, next) => {
//   console.error(err.stack);
//   res.status(err.status || 500).json({ message: err.message || 'Internal Server Error' });
// });

// module.exports = app;

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const morgan = require('morgan');
const passport = require('passport');
const path = require('path');
const connectDB = require('./config/db');

const passportConfig = require('./config/passport');

const authRoutes = require('./routes/authRoutes');
const menuRoutes = require('./routes/menuRoutes');
const orderRoutes = require('./routes/orderRoutes');
const deliveryRoutes = require('./routes/deliveryRoutes');
const kitchenRoutes = require('./routes/kitchenRoutes');
const adminRoutes = require('./routes/adminRoutes');
const managerRoutes = require('./routes/managerRoutes');
const customerRoutes = require('./routes/customerRoutes');
const inventoryRoutes = require('./routes/inventoryRoutes');
const presenceRoutes = require('./routes/presenceRoutes');
const supplierRoutes = require('./routes/supplierRoutes');
const tableRoutes = require('./routes/tableRoutes');

const app = express();

// Connect DB
connectDB();

// Initialize passport
passportConfig(passport);

// ✅ Allowed origins (no trailing slashes)
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'https://cafe-management-system-32m1.vercel.app',
];

// ✅ Add CLIENT_URL from .env if set
if (process.env.CLIENT_URL) {
  const envOrigin = process.env.CLIENT_URL.replace(/\/$/, '');
  if (!allowedOrigins.includes(envOrigin)) {
    allowedOrigins.push(envOrigin);
  }
}

// ✅ CORS - must be BEFORE helmet and all routes
app.use(cors({
  origin: function (origin, callback) {
    // Allow non-browser requests (Postman, mobile, curl)
    if (!origin) return callback(null, true);

    // Normalize: remove trailing slash
    const normalized = origin.replace(/\/$/, '');

    if (allowedOrigins.includes(normalized)) {
      return callback(null, true);
    }

    console.warn(`❌ CORS blocked: ${origin}`);
    return callback(new Error(`CORS policy: origin ${origin} not allowed`));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
}));

// ✅ Handle preflight OPTIONS requests globally
app.options('*', cors());

// ✅ Helmet AFTER cors (helmet can interfere if placed first)
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
}));

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.use(passport.initialize());

// ✅ Static uploads with cross-origin header
app.use('/uploads', express.static(path.join(__dirname, 'uploads'), {
  setHeaders: (res) => {
    res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
  },
}));

// ✅ Health check (useful to wake up Render free tier)
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', cafe: 'Roller Coaster Cafe 🎢', timestamp: new Date() });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/menu', menuRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/delivery', deliveryRoutes);
app.use('/api/kitchen', kitchenRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/supplier-orders', supplierRoutes);
app.use('/api/manager', managerRoutes);
app.use('/api/customer', customerRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/presence', presenceRoutes);
app.use('/api/tables', tableRoutes);

// 404
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('💥 Error:', err.stack);
  res.status(err.status || 500).json({ message: err.message || 'Internal Server Error' });
});

module.exports = app;