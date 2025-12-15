const jwt = require("jsonwebtoken");

const ACCESS_TOKEN_SECRET = "mytemporarysecret"; // SAME as jwt.js

function authenticate(req, res, next) {
  // 1. Read token from cookie (browser-safe)
  const token = req.headers.authorization;

  console.log(token);

  if (!token) {
    return res.status(401).send("Not authenticated");
  }

  try {
    const decoded = jwt.verify(token, ACCESS_TOKEN_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).send("Invalid token");
  }
}

module.exports = authenticate;
