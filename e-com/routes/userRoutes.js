const express = require("express");
const router = express.Router();

//
const {HandleDisplayLogin,
    HandleDisplaySignup,
    HandleLogin,
    HandleSignup,
    HandleDisplayUserDashboard} = require("../controllers/userController")

// Display the HomePage to Guest user
router.route("/login")
.get(HandleDisplayLogin)
.post(HandleLogin)

router.route("/signup")
.get(HandleDisplaySignup)
.post(HandleSignup)

router.route("/user-dashboard")
.get(HandleDisplayUserDashboard)

module.exports = router;

