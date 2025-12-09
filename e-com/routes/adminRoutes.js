const express = require("express");
const router = express.Router();

//
const {HandleDisplayDashboard} = require("../controllers/adminController")

// Display the HomePage to Guest user
router.route("/")
.get(HandleDisplayDashboard)

module.exports = router;

