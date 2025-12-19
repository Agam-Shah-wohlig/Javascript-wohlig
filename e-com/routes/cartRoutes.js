const express = require("express");
const router = express.Router();

const {HandleAddToCart, HandleViewCart, HandleUpdateCartItem, HandleDeleteCartItem} = require("../controllers/cartController");

router.route("/add")
.post(HandleAddToCart);

router.route("/view")
.get(HandleViewCart);

router.route("/update")
.post(HandleUpdateCartItem);

router.route("/remove")
.post(HandleDeleteCartItem);

module.exports = router;