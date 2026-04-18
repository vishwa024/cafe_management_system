// const http = require('http');
// const app = require('./app');
// const { initSocket } = require('./sockets/orderSocket');
// const { initLocationSocket } = require('./sockets/locationSocket');

// const PORT = process.env.PORT || 5000;

// const server = http.createServer(app);

// // Initialize Socket.IO
// const io = require('socket.io')(server, {
//   cors: {
//     origin: process.env.CLIENT_URL || 'http://localhost:5173',
//     methods: ['GET', 'POST'],
//     credentials: true,
//   },
// });

// // Attach io to app for use in controllers
// app.set('io', io);

// // Initialize socket handlers
// initSocket(io);
// initLocationSocket(io);

// const presenceSocket = require('./sockets/presenceSocket');
// presenceSocket(io);

// server.listen(PORT, () => {
//   console.log(`🎢 Roller Coaster Cafe Server running on port ${PORT}`);
// });

const http = require('http');
const app = require('./app');
const { initSocket } = require('./sockets/orderSocket');
const { initLocationSocket } = require('./sockets/locationSocket');

const PORT = process.env.PORT || 5000;

const server = http.createServer(app);

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

// Initialize Socket.IO with CORS fix
const io = require('socket.io')(server, {
  cors: {
    origin: function(origin, callback) {
      // Allow requests with no origin (like mobile apps or curl)
      if (!origin) {
        return callback(null, true);
      }
      
      // Normalize the origin by removing trailing slash
      const normalizedOrigin = normalizeOrigin(origin);
      
      // Check if normalized origin is allowed
      if (allowedOrigins.indexOf(normalizedOrigin) !== -1) {
        callback(null, true);
      } else {
        console.log('Socket.IO CORS blocked origin:', origin);
        callback(new Error('Not allowed by CORS'));
      }
    },
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

// Attach io to app for use in controllers
app.set('io', io);

// Initialize socket handlers
initSocket(io);
initLocationSocket(io);

const presenceSocket = require('./sockets/presenceSocket');
presenceSocket(io);

server.listen(PORT, () => {
  console.log(`🎢 Roller Coaster Cafe Server running on port ${PORT}`);
});