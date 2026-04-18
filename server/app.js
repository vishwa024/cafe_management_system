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

// Import passport config and pass passport instance
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

// Initialize passport with strategies
passportConfig(passport);

// Function to normalize origin (remove trailing slash)
const normalizeOrigin = (origin) => {
  if (!origin) return origin;
  return origin.replace(/\/$/, '');
};

// Allowed origins
const allowedOrigins = [
  'http://localhost:5173',
  'https://cafe-management-system-32m1.vercel.app',
  'https://cafe-management-system-sjai.onrender.com'
];

// CORS configuration - FIXED for trailing slash issue
app.use(cors({
  origin: function(origin, callback) {
    // Allow requests with no origin (like mobile apps or curl)
    if (!origin) {
      return callback(null, true);
    }
    
    // Normalize the origin by removing trailing slash
    const normalizedOrigin = normalizeOrigin(origin);
    
    // Also check the environment variable (with trailing slash handling)
    const clientUrl = process.env.CLIENT_URL ? normalizeOrigin(process.env.CLIENT_URL) : null;
    
    // Check if normalized origin is allowed
    if (allowedOrigins.indexOf(normalizedOrigin) !== -1 || (clientUrl && normalizedOrigin === clientUrl)) {
      callback(null, true);
    } else {
      console.log('CORS blocked origin:', origin);
      console.log('Normalized origin:', normalizedOrigin);
      console.log('Allowed origins:', allowedOrigins);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.use(passport.initialize());
app.use('/uploads', express.static(path.join(__dirname, 'uploads'), {
  setHeaders: (res) => {
    res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
  },
}));

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

// Health check
app.get('/api/health', (req, res) => res.json({ status: 'OK', cafe: 'Roller Coaster Cafe 🎢' }));

// 404
app.use((req, res) => res.status(404).json({ message: 'Route not found' }));

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({ message: err.message || 'Internal Server Error' });
});

module.exports = app;