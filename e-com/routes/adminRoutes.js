const express = require("express");
const router = express.Router();

//
const {HandleDisplayAdminDashboard} = require("../controllers/adminController")

// Display the HomePage to Guest user
router.route("/")
.get(HandleDisplayAdminDashboard)

module.exports = router;

