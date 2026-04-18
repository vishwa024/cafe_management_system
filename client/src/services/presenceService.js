// services/presenceService.js
import api from './api';

let heartbeatInterval;
let currentSessionId = null;
let currentUserId = null;

const getStoredAuthUser = () => {
  try {
    return JSON.parse(sessionStorage.getItem('authUser') || '{}');
  } catch {
    return {};
  }
};

const presenceService = {
  initialize: async (userId, role, panel) => {
    try {
      const authUser = getStoredAuthUser();
      const resolvedUserId = userId || authUser._id;
      const resolvedRole = role || authUser.role;

      if (!resolvedUserId) return;

      currentUserId = resolvedUserId;

      const { data } = await api.post('/presence/online', {
        userId: resolvedUserId,
        role: resolvedRole,
        panel,
      });

      currentSessionId = data?.sessionId || null;

      if (heartbeatInterval) clearInterval(heartbeatInterval);

      const sendHeartbeat = async () => {
        if (!currentUserId || !currentSessionId) return;
        await api.post('/presence/heartbeat', {
          userId: currentUserId,
          sessionId: currentSessionId,
          role: resolvedRole,
          panel,
        });
      };

      await sendHeartbeat();

      heartbeatInterval = setInterval(async () => {
        try {
          await sendHeartbeat();
        } catch (err) {
          console.error('Presence heartbeat failed', err);
        }
      }, 30000); 
    } catch (err) {
      console.error("Presence service failed to start", err);
    }
  },

  cleanup: async () => {
    if (heartbeatInterval) clearInterval(heartbeatInterval);
    heartbeatInterval = null;

    if (currentUserId && currentSessionId) {
      try {
        await api.post('/presence/offline', {
          userId: currentUserId,
          sessionId: currentSessionId,
        });
      } catch (err) {
        console.error('Presence cleanup failed', err);
      }
    }

    currentUserId = null;
    currentSessionId = null;
  }
};

export default presenceService;
