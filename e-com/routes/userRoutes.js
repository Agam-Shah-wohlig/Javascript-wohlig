// routes/userRouter.js
const express = require("express");
const router = express.Router();


const {HandleDisplayUserDashboard,
    HandleGetProfile,
    HandleUpdateProfile,
    HandleAddAddress,
    HandleUpdateAddress,
    HandleDeleteAddress} = require("../controllers/userController");

const requireAuth = require("../middlewares/requireAuthMiddleware");

// User dashboard
router.route("/homepage")
.get(HandleDisplayUserDashboard);

// Profile routes (requires authentication)
router.route("/user/profile")
.get(requireAuth, HandleGetProfile);

router.route("/user/add-address")
.post(requireAuth, HandleAddAddress);

router.route("/user/update-profile")
.post(requireAuth, HandleUpdateProfile);

router.route("/user/update-address")
.post(requireAuth, HandleUpdateAddress);

router.route("/user/delete-address/:addressId")
.post(requireAuth, HandleDeleteAddress);


module.exports = router;
