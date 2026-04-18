// sockets/socketHandler.js
// Handles all real-time Socket.io events for Kitchen & Manager panels

const socketHandler = (io) => {
    io.on('connection', (socket) => {
        console.log(`[Socket] Client connected: ${socket.id}`);

        // ── Join role-based rooms ──
        // Client sends: socket.emit('joinRoom', { role: 'kitchen' })
        socket.on('joinRoom', ({ role }) => {
            if (!role) return;
            socket.join(role);
            console.log(`[Socket] ${socket.id} joined room: ${role}`);
        });

        // ── Kitchen: chef starts preparing an order ──
        socket.on('startPreparing', (orderId) => {
            io.emit('orderStatusUpdated', { orderId, status: 'preparing' });
        });

        // ── Kitchen: order is ready ──
        socket.on('orderReady', (orderId) => {
            io.emit('orderStatusUpdated', { orderId, status: 'ready' });
            // Notify delivery/staff specifically
            io.to('staff').emit('orderReadyForPickup', { orderId });
            io.to('delivery').emit('orderReadyForPickup', { orderId });
        });

        // ── Kitchen: new order ping (triggered by server when order placed) ──
        // Usage: io.emit('newOrder', orderData) from orderController after save

        // ── Kitchen: item marked unavailable ──
        socket.on('itemUnavailable', (data) => {
            // Broadcast to customer + staff so they can hide the item
            io.to('customer').emit('menuItemAvailabilityChanged', data);
            io.to('staff').emit('menuItemAvailabilityChanged', data);
        });

        // ── Manager: subscribe to low stock alerts ──
        socket.on('subscribeToAlerts', () => {
            socket.join('alerts');
        });

        socket.on('disconnect', () => {
            console.log(`[Socket] Client disconnected: ${socket.id}`);
        });
    });
};

// Helper: attach io to each request so controllers can emit events
const attachSocketToRequest = (io) => (req, res, next) => {
    req.io = io;
    next();
};

module.exports = { socketHandler, attachSocketToRequest };
