// routes/authRouter.js
const express = require("express");
const router = express.Router();
const {
  HandleDisplayLogin,
  HandleDisplaySignup,
  HandleJwtLogin,
  HandleSignup,
  refresh
} = require("../controllers/authController");

// Login routes
router.get("/login", HandleDisplayLogin);
router.post("/login", HandleJwtLogin);

// Signup routes
router.get("/signup", HandleDisplaySignup);
router.post("/signup", HandleSignup);

// Refresh token route
router.post("/refresh", refresh); // POST is standard for refresh

module.exports = router;
