const express = require("express");
const router = express.Router();

const {HandleDisplayProducts, HandleFilterProducts} = require("../controllers/productController");

router.route("/productdetails")
.get(HandleDisplayProducts)

router.route("/productdetails/filter")
.get(HandleFilterProducts);

module.exports = router;