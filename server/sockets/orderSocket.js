/**
 * Order Socket - Real-time order status events
 * Rooms: order:<orderId>, user:<userId>, kitchen, staff, delivery
 */

const initSocket = (io) => {
  io.on('connection', (socket) => {
    console.log(`Socket connected: ${socket.id}`);

    // Join rooms based on role
    socket.on('join-room', ({ room }) => {
      socket.join(room);
      console.log(`Socket ${socket.id} joined room: ${room}`);
    });

    // Leave room
    socket.on('leave-room', ({ room }) => {
      socket.leave(room);
    });

    // Emit order status update to customer + staff + kitchen
    socket.on('order-status-update', ({ orderId, status, customerId }) => {
      io.to(`order:${orderId}`).emit('order-updated', { orderId, status });
      io.to(`user:${customerId}`).emit('order-updated', { orderId, status });
    });

    socket.on('disconnect', () => {
      console.log(`Socket disconnected: ${socket.id}`);
    });
  });
};

/**
 * Emit from controllers: req.app.get('io')
 * 
 * Example usage in orderController:
 * const io = req.app.get('io');
 * io.to(`order:${order._id}`).emit('order-updated', { status: 'confirmed' });
 * io.to('kitchen').emit('new-order', { order });
 */

module.exports = { initSocket };
