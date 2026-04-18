# 🎢 Roller Coaster Cafe — MERN Stack Management System

> Complete 5-Panel Cafe Management System

---

## 📁 Complete Folder Structure

```
roller-coaster-cafe/
├── server/                          # Node.js + Express Backend
│   ├── config/
│   │   ├── db.js                    # MongoDB Atlas connection
│   │   ├── passport.js              # Google OAuth 2.0 setup
│   │   ├── cloudinary.js            # Image upload config
│   │   └── redis.js                 # Redis connection (OTP/blacklist)
│   ├── controllers/
│   │   ├── authController.js        # Register, login, OTP, forgot password
│   │   ├── menuController.js        # CRUD for menu items & categories
│   │   ├── orderController.js       # Order placement, status, refunds
│   │   ├── deliveryController.js    # Agent assignment, GPS, status
│   │   ├── kitchenController.js     # KDS board, inventory, wastage
│   │   ├── adminController.js       # Users, reports, settings, coupons
│   │   ├── managerController.js     # Manager dashboard, staff, shifts
│   │   └── customerController.js   # Profile, addresses, loyalty, wallet
│   ├── middleware/
│   │   ├── auth.js                  # JWT verify & attach user to req
│   │   ├── roleCheck.js             # Role-based access guard
│   │   ├── validate.js              # express-validator error handler
│   │   ├── upload.js                # Multer + Cloudinary config
│   │   └── rateLimiter.js           # Rate limiting (OTP, login, API)
│   ├── models/
│   │   ├── User.js                  # All roles: customer/staff/admin...
│   │   ├── MenuItem.js              # Menu items, variants, customization
│   │   ├── Category.js              # Menu categories
│   │   ├── Order.js                 # Orders with full lifecycle
│   │   ├── OrderItem.js             # Line items per order
│   │   ├── OTPToken.js              # OTP with TTL (auto-expire)
│   │   ├── RefreshToken.js          # Refresh tokens per device
│   │   ├── Address.js               # Customer delivery addresses
│   │   ├── Inventory.js             # Ingredient stock levels
│   │   ├── Recipe.js                # Menu item → ingredient mapping
│   │   ├── DeliveryLocation.js      # Live agent GPS pings
│   │   ├── LoyaltyPoints.js         # Points transactions & balance
│   │   ├── Coupon.js                # Discount codes & offers
│   │   ├── Notification.js          # In-app notifications log
│   │   ├── Settings.js              # System config (gateway keys, zones)
│   │   └── AuditLog.js              # Admin action audit trail
│   ├── routes/
│   │   ├── authRoutes.js            # /api/auth/*
│   │   ├── menuRoutes.js            # /api/menu/*
│   │   ├── orderRoutes.js           # /api/orders/*
│   │   ├── deliveryRoutes.js        # /api/delivery/*
│   │   ├── kitchenRoutes.js         # /api/kitchen/*
│   │   ├── adminRoutes.js           # /api/admin/*
│   │   ├── managerRoutes.js         # /api/manager/*
│   │   └── customerRoutes.js        # /api/customer/*
│   ├── services/
│   │   ├── emailService.js          # Nodemailer / SendGrid email sender
│   │   ├── smsService.js            # Twilio / MSG91 SMS sender
│   │   ├── socketService.js         # Socket.IO event emitter helpers
│   │   └── paymentService.js        # Razorpay / Stripe integration
│   ├── utils/
│   │   ├── generateOTP.js           # Crypto 6-digit OTP generator
│   │   ├── generateToken.js         # JWT access + refresh token maker
│   │   ├── geocode.js               # Google Geocoding API wrapper
│   │   └── helpers.js               # General utilities
│   ├── sockets/
│   │   ├── orderSocket.js           # Order status real-time events
│   │   └── locationSocket.js        # Delivery agent GPS broadcast
│   ├── seed/
│   │   └── adminSeed.js             # Create super admin account
│   ├── app.js                       # Express app setup, middleware
│   ├── server.js                    # HTTP server + Socket.IO init
│   ├── .env.example                 # Environment variable template
│   └── package.json
│
└── client/                          # React + Vite Frontend
    ├── public/
    │   └── favicon.ico
    ├── src/
    │   ├── pages/
    │   │   ├── auth/
    │   │   │   ├── Login.jsx            # Unified login (email/OTP/Google)
    │   │   │   ├── Register.jsx         # Customer registration
    │   │   │   ├── OTPVerify.jsx        # OTP entry screen
    │   │   │   ├── ForgotPassword.jsx   # Forgot password entry
    │   │   │   └── ResetPassword.jsx    # New password form
    │   │   ├── customer/
    │   │   │   ├── HomePage.jsx         # Landing + hero (like kavit.info)
    │   │   │   ├── MenuPage.jsx         # Browse menu with filters/search
    │   │   │   ├── CartPage.jsx         # Cart review + coupon
    │   │   │   ├── CheckoutPage.jsx     # Multi-step: address → time → pay
    │   │   │   ├── OrderTrackingPage.jsx# Live map tracking + timeline
    │   │   │   ├── OrderHistoryPage.jsx # Past orders + reorder
    │   │   │   ├── ProfilePage.jsx      # Account settings
    │   │   │   ├── AddressesPage.jsx    # Saved addresses with map
    │   │   │   ├── FavouritesPage.jsx   # Saved favourite items
    │   │   │   └── WalletPage.jsx       # Cafe wallet + loyalty points
    │   │   ├── admin/
    │   │   │   ├── AdminDashboard.jsx   # Stats cards + real-time charts
    │   │   │   ├── UserManagement.jsx   # CRUD all users
    │   │   │   ├── MenuManagement.jsx   # Full menu CRUD
    │   │   │   ├── OrderManagement.jsx  # All orders, override, refund
    │   │   │   ├── Reports.jsx          # Sales, items, delivery reports
    │   │   │   ├── Settings.jsx         # Gateway keys, zones, hours
    │   │   │   ├── CouponManagement.jsx # Discount codes CRUD
    │   │   │   └── AuditLogs.jsx        # Admin action log
    │   │   ├── manager/
    │   │   │   ├── ManagerDashboard.jsx # Active orders + revenue
    │   │   │   ├── OrderMonitor.jsx     # Live order view
    │   │   │   ├── StaffManagement.jsx  # Shift assignment
    │   │   │   ├── MenuControl.jsx      # Availability + price updates
    │   │   │   └── ManagerReports.jsx   # Sales charts + CSV export
    │   │   ├── staff/
    │   │   │   ├── OrderQueue.jsx       # Live incoming orders
    │   │   │   ├── POSMode.jsx          # Walk-in order entry
    │   │   │   └── PreOrders.jsx        # Scheduled pre-orders
    │   │   ├── kitchen/
    │   │   │   ├── KDSBoard.jsx         # Full-screen order ticket grid
    │   │   │   ├── InventoryPage.jsx    # Ingredient stock management
    │   │   │   └── KitchenReports.jsx   # Prep time, waste, usage
    │   │   └── delivery/
    │   │       ├── DeliveryApp.jsx      # Mobile-first main panel
    │   │       ├── MyOrders.jsx         # Assigned + history
    │   │       ├── EarningsPage.jsx     # Daily/weekly earnings
    │   │       └── DeliveryMap.jsx      # Navigation map
    │   ├── components/
    │   │   ├── shared/
    │   │   │   ├── Navbar.jsx           # Role-aware top navigation
    │   │   │   ├── Sidebar.jsx          # Admin/manager sidebar
    │   │   │   ├── ProtectedRoute.jsx   # Auth guard HOC
    │   │   │   ├── RoleRoute.jsx        # Role-specific route guard
    │   │   │   ├── OTPInput.jsx         # 6-box OTP input component
    │   │   │   ├── NotificationBell.jsx # Dropdown notifications
    │   │   │   ├── LoadingSpinner.jsx
    │   │   │   └── ErrorBoundary.jsx
    │   │   ├── customer/
    │   │   │   ├── MenuGrid.jsx         # Responsive menu item grid
    │   │   │   ├── MenuItemCard.jsx     # Card with add-to-cart
    │   │   │   ├── CartDrawer.jsx       # Slide-out cart
    │   │   │   ├── MapPicker.jsx        # Google Maps address pin
    │   │   │   ├── LiveTracker.jsx      # Real-time delivery map
    │   │   │   ├── OrderTimeline.jsx    # Visual status stepper
    │   │   │   ├── CheckoutForm.jsx     # Multi-step checkout
    │   │   │   └── HeroSection.jsx      # Landing page hero
    │   │   ├── admin/
    │   │   │   ├── StatsCard.jsx        # Dashboard metric card
    │   │   │   ├── RevenueChart.jsx     # Recharts line chart
    │   │   │   ├── ItemPerformance.jsx  # Bar chart
    │   │   │   └── UserTable.jsx        # Sortable user CRUD table
    │   │   ├── kitchen/
    │   │   │   ├── OrderTicket.jsx      # Single KDS order card
    │   │   │   └── InventoryTable.jsx   # Stock table with alerts
    │   │   └── delivery/
    │   │       ├── OrderCard.jsx        # Delivery order card
    │   │       └── NavigationMap.jsx    # Turn-by-turn map
    │   ├── store/
    │   │   ├── index.js                 # Redux store setup
    │   │   └── slices/
    │   │       ├── authSlice.js         # User auth state + role
    │   │       └── cartSlice.js         # Cart items, totals, coupon
    │   ├── hooks/
    │   │   ├── useAuth.js               # Auth context helper
    │   │   ├── useCart.js               # Cart actions helper
    │   │   ├── useSocket.js             # Socket.IO connection
    │   │   └── useGeoLocation.js        # Browser GPS hook
    │   ├── services/
    │   │   └── api.js                   # Axios instance + interceptors
    │   ├── utils/
    │   │   ├── formatCurrency.js
    │   │   ├── validatePhone.js
    │   │   └── constants.js
    │   ├── App.jsx                      # Router + protected routes
    │   ├── main.jsx                     # React entry point
    │   └── index.css                    # Global styles + Tailwind
    ├── index.html
    ├── vite.config.js
    ├── tailwind.config.js
    └── package.json
```

---

## 🚀 Quick Start

```bash
# 1. Clone & install
git clone <repo>
cd roller-coaster-cafe

# Backend
cd server
npm install
cp .env.example .env   # Fill in your keys
node seed/adminSeed.js # Create super admin
npm run dev

# Frontend (new terminal)
cd ../client
npm install
npm run dev
```

## 🔑 Panel Access URLs

| Panel | URL | Who |
|-------|-----|-----|
| Customer | `/` | Public |
| Admin | `/admin` | Super Admin |
| Manager | `/manager` | Manager |
| Staff | `/staff` | Cashier/Staff |
| Kitchen | `/kitchen` | Kitchen Manager |
| Delivery | `/delivery` | Delivery Agent |
