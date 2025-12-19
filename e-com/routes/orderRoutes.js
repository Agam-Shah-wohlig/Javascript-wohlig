const express = require("express");
const router = express.Router();

const {HandleCreateOrder, 
    HandleUpdateOrderStatus,
HandleViewOrderDetails,
HandleViewOrders,
HandleCancelOrder} = require("../controllers/orderController");

router.route("/create")
.post(HandleCreateOrder);

router.route("/view")
.get(HandleViewOrders);

router.route("/details/:orderId")
.get(HandleViewOrderDetails);

router.route("/status/:orderId")
.post(HandleUpdateOrderStatus);

router.route("/cancel/:orderId")
.post(HandleCancelOrder);


module.exports = router;