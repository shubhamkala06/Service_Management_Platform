const { redis } = require("../../database");
const config = require("../../config/env")

async function saveRefreshTokenSession(sessionId, session) {
    if (!sessionId) {
        throw new Error("Session ID is required.");
    }

    if (!session) {
        throw new Error("Session is required.");
    }

    if (!session.refreshToken) {
        throw new Error("Refresh token is required.");
    }

    await redis.set(
        `auth-session:${sessionId}`,
        JSON.stringify(session),
        {
            EX: config.redis.ttl,
        }
    );
}

async function getRefreshTokenSession(sessionId) {
    if (!sessionId) {
        throw new Error("Session ID is required.");
    }

    const session = await redis.get(`auth-session:${sessionId}`);

    if (!session) {
        return null;
    }

    return JSON.parse(session);
}

async function deleteRefreshTokenSession(sessionId) {
    if (!sessionId) {
        throw new Error("Session ID is required.");
    }

    await redis.del(`auth-session:${sessionId}`);
}

module.exports = {
    saveRefreshTokenSession,
    getRefreshTokenSession,
    deleteRefreshTokenSession,
};