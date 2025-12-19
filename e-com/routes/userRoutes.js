// routes/userRouter.js
const express = require("express");
const router = express.Router();

// const  authenticate  = require("../middlewares/authMiddleware");
// const { requireUser } = require("../middlewares/roleMiddleware");
const HandleDisplayUserDashboard = require("../controllers/userController");

// Apply middlewares to all routes in this router
// router.use(authenticate, requireUser);

// User dashboard
router.get("/homepage", HandleDisplayUserDashboard);

module.exports = router;
