const COOKIE_NAME = "login_state";

function storeLoginState(res, loginState) {
    res.cookie(COOKIE_NAME, JSON.stringify(loginState), {
        httpOnly: true,
        signed: true,
        sameSite: "lax",
        // secure: config.app.env === "production",
        maxAge: 3 * 60 * 1000,
    });
}

function readLoginState(req) {
    const value = req.signedCookies[COOKIE_NAME];

    if (!value) {
        return null;
    }

    return JSON.parse(value);
}

function clearLoginState(res) {
    res.clearCookie(COOKIE_NAME);
}

module.exports = {
    storeLoginState,
    readLoginState,
    clearLoginState,
};