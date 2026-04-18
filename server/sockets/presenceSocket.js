// Track online users
const onlineUsers = new Map(); // userId -> { socketId, role, lastSeen, name, email }

module.exports = (io) => {
  io.on('connection', (socket) => {
    console.log('New connection:', socket.id);

    // User comes online
    socket.on('user-online', (userData) => {
      const { userId, role, name, email } = userData;
      
      if (userId) {
        onlineUsers.set(userId, {
          socketId: socket.id,
          role: role,
          name: name,
          email: email,
          lastSeen: new Date(),
          isOnline: true
        });
        
        console.log(`✅ ${name} (${role}) is now ONLINE`);
        
        // Broadcast to all connected clients (managers, admins)
        io.emit('presence-update', {
          userId,
          role,
          name,
          email,
          isOnline: true,
          lastSeen: new Date()
        });
      }
    });

    // User goes offline manually
    socket.on('user-offline', (userId) => {
      if (userId && onlineUsers.has(userId)) {
        const user = onlineUsers.get(userId);
        onlineUsers.delete(userId);
        
        console.log(`❌ ${user.name} (${user.role}) went OFFLINE`);
        
        io.emit('presence-update', {
          userId,
          role: user.role,
          name: user.name,
          email: user.email,
          isOnline: false,
          lastSeen: new Date()
        });
      }
    });

    // Heartbeat
    socket.on('heartbeat', (userId) => {
      if (userId && onlineUsers.has(userId)) {
        const user = onlineUsers.get(userId);
        user.lastSeen = new Date();
        onlineUsers.set(userId, user);
        // console.log(`💓 Heartbeat from ${user.name}`);
      }
    });

    // Handle disconnect
    socket.on('disconnect', () => {
      let disconnectedUser = null;
      
      for (const [userId, data] of onlineUsers.entries()) {
        if (data.socketId === socket.id) {
          disconnectedUser = { userId, ...data };
          onlineUsers.delete(userId);
          break;
        }
      }
      
      if (disconnectedUser) {
        console.log(`❌ ${disconnectedUser.name} (${disconnectedUser.role}) DISCONNECTED`);
        
        io.emit('presence-update', {
          userId: disconnectedUser.userId,
          role: disconnectedUser.role,
          name: disconnectedUser.name,
          email: disconnectedUser.email,
          isOnline: false,
          lastSeen: new Date()
        });
      }
    });
  });

  // API to get online users
  global.getOnlineUsers = () => {
    const users = [];
    for (const [userId, data] of onlineUsers.entries()) {
      users.push({
        userId,
        socketId: data.socketId,
        role: data.role,
        name: data.name,
        email: data.email,
        lastSeen: data.lastSeen,
        isOnline: true
      });
    }
    return users;
  };
};