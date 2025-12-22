const express = require("express");
const router = express.Router();

const {
    HandleCreateOrder, 
    HandleUpdateOrderStatus,
    HandleViewOrderDetails,
    HandleViewOrders,
    HandleCancelOrder} = require("../controllers/orderController");

const requireAuth = require("../middlewares/requireAuthMiddleware");

router.route("/create")
.post(requireAuth, HandleCreateOrder);

router.route("/view")
.get(HandleViewOrders);

router.route("/details/:orderId")
.get(requireAuth, HandleViewOrderDetails);

router.route("/status/:orderId")
.post(HandleUpdateOrderStatus);

router.route("/cancel/:orderId")
.post(requireAuth, HandleCancelOrder);


module.exports = router;