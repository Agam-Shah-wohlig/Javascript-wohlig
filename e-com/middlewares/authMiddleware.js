
const User = require("../models/user");
const {verifyToken} = require("../utils/jwt");

const authMiddleware = async (req, res, next) => {

    try {
      const token = req.cookies?.jwt;
      if (!token) {
        req.user = null;
        return next(); // allow public access
      }
        const decoded = verifyToken(token);
        const user = await User.findById(decoded.id);
        if (!user) return res.status(401).json({ message: "Unauthorized: User not found" });

        req.user = user || null;
        next();
      } catch (err) {
        req.user = null;
        next();
  }
};

module.exports = authMiddleware;
