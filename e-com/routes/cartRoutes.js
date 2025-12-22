const express = require("express");
const router = express.Router();

const {HandleAddToCart, HandleViewCart, HandleUpdateCartItem, HandleDeleteCartItem} = require("../controllers/cartController");
const requireAuth = require("../middlewares/requireAuthMiddleware");
router.route("/add")
.post(requireAuth,HandleAddToCart);

router.route("/view")
.get(HandleViewCart);

router.route("/update")
.post(HandleUpdateCartItem);

router.route("/remove")
.post(HandleDeleteCartItem);

module.exports = router;