const { errors } = require("jose");
const { logger } = require("../logger");

const {
    validateAccessToken,
    refreshAccessToken,
    getRefreshTokenSession,
    saveRefreshTokenSession,
    deleteRefreshTokenSession,
} = require("../auth");

const config = require("../config/env");
const { AppError } = require("../errors");

async function requireAuth(req, res, next) {
    const accessToken = req.cookies?.access_token;

    if (!accessToken) {
        throw new AppError("Authentication required.", 401);
    }

    try {
        const user = await validateAccessToken(accessToken);

        req.user = user;

        return next();
    } catch (err) {
        if (err instanceof AppError) {
            throw err;
        }

        if (!(err instanceof errors.JWTExpired)) {
            throw new AppError("Invalid access token.", 401);
        }

        const sessionId = req.cookies?.refresh_session_id;

        logger.info("Access token expired. Attempting refresh.");

        if (!sessionId) {
            throw new AppError("Authentication required.", 401);
        }

        const session = await getRefreshTokenSession(sessionId);

        if (!session) {
            res.clearCookie("refresh_session_id");
            logger.warn(
                "Refresh session not found. Clearing stale session cookie."
            );
            throw new AppError("Authentication required.", 401);
        }

        try {
            const { tokenSet } = await refreshAccessToken(
                session.refreshToken
            );

            logger.info("Successfully refreshed access token.");

            if (tokenSet.refresh_token) {
                logger.info("Refresh token rotated.");
                await saveRefreshTokenSession(sessionId, {
                    refreshToken: tokenSet.refresh_token,
                    idToken: session.idToken,
                });
            }

            res.cookie("access_token", tokenSet.access_token, {
                httpOnly: true,
                secure: false,
                sameSite: "lax"
            });

            const user = await validateAccessToken(
                tokenSet.access_token
            );

            req.user = user;

            return next();
        } catch (refreshErr) {
            if (refreshErr.error === "invalid_grant") {
                logger.warn({
                    oauthError: refreshErr.error,
                }, "Refresh token rejected. Logging user out.");
                await deleteRefreshTokenSession(sessionId);

                res.clearCookie("access_token");
                res.clearCookie("refresh_session_id");

                throw new AppError("Authentication required.", 401);
            }
            logger.error(
                {
                    err: refreshErr,
                },
                "Unexpected error while refreshing access token."
            );
            throw refreshErr;
        }
    }
}

module.exports = {
    requireAuth,
};