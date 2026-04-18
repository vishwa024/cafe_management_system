const express = require('express');
const router = express.Router();

// Store active sessions (in production, use Redis)
const activeSessions = new Map();

const ONLINE_TIMEOUT_MS = 120000;

const getFreshSessions = (userSessions, now = new Date()) => {
    if (!(userSessions instanceof Map)) return [];

    const freshSessions = [];

    for (const [sessionId, session] of userSessions.entries()) {
        const diff = now - new Date(session.lastSeen);
        if (diff < ONLINE_TIMEOUT_MS) {
            freshSessions.push({ sessionId, ...session });
        } else {
            userSessions.delete(sessionId);
        }
    }

    return freshSessions;
};

// Mark user as online when they login or access a panel
router.post('/online', (req, res) => {
    const { userId, role, panel } = req.body;
    if (!userId) return res.sendStatus(400);

    const sessionId = Date.now().toString();

    if (!activeSessions.has(userId)) {
        activeSessions.set(userId, new Map());
    }

    const userSessions = activeSessions.get(userId);

    userSessions.set(sessionId, {
        sessionId,
        role,
        panel,
        lastSeen: new Date()
    });

    console.log("🟢 ONLINE:", userId, "sessions:", userSessions.size);

    res.json({ success: true, sessionId });
});
// Heartbeat - update last seen time
router.post('/heartbeat', (req, res) => {
    const { userId, sessionId, role, panel } = req.body;

    if (!userId || !sessionId) return res.sendStatus(400);

    if (activeSessions.has(userId)) {
        const userSessions = activeSessions.get(userId);

        if (userSessions.has(sessionId)) {
            const session = userSessions.get(sessionId);
            session.lastSeen = new Date();
            session.panel = panel;
            userSessions.set(sessionId, session);
        }
    }

    res.json({ success: true });
});

// Mark user as offline
router.post('/offline', (req, res) => {
    const { userId, sessionId } = req.body;

    if (!userId || !sessionId) return res.sendStatus(400);

    if (activeSessions.has(userId)) {
        const userSessions = activeSessions.get(userId);

        userSessions.delete(sessionId);

        if (userSessions.size === 0) {
            activeSessions.delete(userId);
            console.log(`🔴 ${userId} FULLY OFFLINE`);
        } else {
            console.log(`⚠️ ${userId} still has ${userSessions.size} session(s)`);
        }
    }

    res.json({ success: true });
});

// Get all online users
router.get('/online-users', async (req, res) => {
    try {
        const onlineUsers = [];
        const now = new Date();
        
        for (const [userId, userSessions] of activeSessions.entries()) {
            const freshSessions = getFreshSessions(userSessions, now);

            if (freshSessions.length > 0) {
                const latestSession = freshSessions.sort(
                    (a, b) => new Date(b.lastSeen) - new Date(a.lastSeen)
                )[0];

                onlineUsers.push({
                    userId,
                    role: latestSession.role,
                    panel: latestSession.panel,
                    lastSeen: latestSession.lastSeen
                });
            } else {
                activeSessions.delete(userId);
            }
        }
        
        res.json(onlineUsers);
    } catch (error) {
        console.error('Error getting online users:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Get status for all users (with user details from staff list)
router.get('/status', (req, res) => {
    const now = new Date();
    const statusMap = {};

    for (const [userId, sessions] of activeSessions.entries()) {
        const freshSessions = getFreshSessions(sessions, now);
        const isOnline = freshSessions.length > 0;

        if (!isOnline) {
            activeSessions.delete(userId);
        }

        statusMap[userId] = {
            status: isOnline ? 'online' : 'offline'
        };
    }

    res.json(statusMap);
});

// Get specific user status
router.get('/user-status/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const userSessions = activeSessions.get(userId);
        
        if (userSessions) {
            const now = new Date();
            const freshSessions = getFreshSessions(userSessions, now);
            const latestSession = freshSessions.sort(
                (a, b) => new Date(b.lastSeen) - new Date(a.lastSeen)
            )[0];
            const isOnline = freshSessions.length > 0;
            
            if (isOnline) {
                res.json({
                    userId,
                    isOnline: true,
                    status: 'online',
                    panel: latestSession.panel,
                    lastSeen: latestSession.lastSeen
                });
            } else {
                activeSessions.delete(userId);
                res.json({ userId, isOnline: false, status: 'offline' });
            }
        } else {
            res.json({ userId, isOnline: false, status: 'offline' });
        }
    } catch (error) {
        console.error('Error getting user status:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Debug endpoint to see all sessions (remove in production)
router.get('/sessions', async (req, res) => {
    const sessions = [];
    for (const [userId, userSessions] of activeSessions.entries()) {
        for (const session of getFreshSessions(userSessions)) {
            sessions.push({
                userId,
                sessionId: session.sessionId,
                role: session.role,
                panel: session.panel,
                lastSeen: session.lastSeen
            });
        }
    }
    res.json({ sessions, count: sessions.length });
});

module.exports = router;
