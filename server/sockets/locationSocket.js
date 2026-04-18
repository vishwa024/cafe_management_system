/**
 * Location Socket - Real-time delivery agent GPS tracking
 * Agent pushes location every 5 seconds
 * Customer receives live position updates
 */

const initLocationSocket = (io) => {
  io.on('connection', (socket) => {
    // Delivery agent sends their live location
    socket.on('agent-location-update', ({ agentId, orderId, lat, lng }) => {
      // Broadcast to the customer tracking this order
      io.to(`order:${orderId}`).emit('agent-location', { agentId, lat, lng, timestamp: Date.now() });
      // Also broadcast to admin map view
      io.to('admin-map').emit('agent-location', { agentId, lat, lng });
    });

    // Agent goes online
    socket.on('agent-online', ({ agentId }) => {
      socket.join(`agent:${agentId}`);
      io.to('admin-map').emit('agent-status', { agentId, isOnline: true });
    });

    // Agent goes offline
    socket.on('agent-offline', ({ agentId }) => {
      io.to('admin-map').emit('agent-status', { agentId, isOnline: false });
    });
  });
};

module.exports = { initLocationSocket };
