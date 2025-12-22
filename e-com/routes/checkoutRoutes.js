const express = require("express");
const router = express.Router();

const {HandleGetCheckout, HandleProcessCheckout} = require("../controllers/checkoutController");

const requireAuth = require("../middlewares/requireAuthMiddleware");

router.route("/")
.get(requireAuth, HandleGetCheckout)

router.route("/checkout")
.post(requireAuth, HandleProcessCheckout);

module.exports = router;