const http = require('http');
const app = require('./app');
const { initSocket } = require('./sockets/orderSocket');
const { initLocationSocket } = require('./sockets/locationSocket');

const PORT = process.env.PORT || 5000;

const server = http.createServer(app);

// Initialize Socket.IO
const io = require('socket.io')(server, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
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
