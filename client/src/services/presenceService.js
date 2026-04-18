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
        } catch {
          // Ignore transient backend disconnects to avoid flooding the console in production.
        }
      }, 30000); 
    } catch (err) {
      console.warn('Presence service unavailable');
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
      } catch {
        // Best-effort cleanup only.
      }
    }

    currentUserId = null;
    currentSessionId = null;
  }
};

export default presenceService;
