// utils/jwt.js
const jwt = require("jsonwebtoken");

function signAccessToken(user) {
  return jwt.sign(
    { sub: user._id, role: user.role },
    "mytemporarysecret", // just a string for dev
    { algorithm: "HS256", expiresIn: "15m", issuer: "your-api", audience: "your-client" }
  );
}

function signRefreshToken(userId, sessionId) {
  return jwt.sign(
    { sub: userId, jti: sessionId },
    "mytemporarysecret", // just a string for dev
    { algorithm: "HS256", expiresIn: "7d" }
  );
}

module.exports = { signAccessToken, signRefreshToken };
