const { SignJWT, jwtVerify } = require("jose");
const crypto = require("crypto");

const config = require("../../config/env");

const secret = new TextEncoder().encode(config.jwt.secret);

async function issue(user) {
    const token = await new SignJWT({})
        .setProtectedHeader({
            alg: "HS256",
        })
        .setIssuer(config.jwt.issuer)
        .setAudience(config.jwt.audience)
        .setSubject(user.id)
        .setJti(crypto.randomUUID())
        .setIssuedAt()
        .setExpirationTime(`${config.jwt.expirationSeconds}s`)
        .sign(secret);

    return {
        accessToken: token,
        tokenType: "Bearer",
        expiresIn: config.jwt.expirationSeconds,
    };
}

async function verify(token) {
    const {payload} = await jwtVerify(token,secret,{
        issuer: config.jwt.issuer,
        audience: config.jwt.audience
    });
    return payload;
}

module.exports = {
    issue,
    verify
};