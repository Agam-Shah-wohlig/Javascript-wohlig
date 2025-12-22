// routes/authRouter.js
const express = require("express");
const router = express.Router();
const { HandleSignup, HandleLogin, HandleDisplayLogin, HandleDisplaySignup, HandleLogout } = require("../controllers/authController");

router.route("/signup")
.get(HandleDisplaySignup)
.post(HandleSignup);

router.route("/login")
.get(HandleDisplayLogin)
.post(HandleLogin);

router.route("/logout")
.get(HandleLogout);

module.exports = router;
