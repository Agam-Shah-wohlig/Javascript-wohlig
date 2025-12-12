const express = require("express");
const router = express.Router();

const {HandleDisplayProducts, HandleFilterProducts, HandleSortProducts} = require("../controllers/productController");

router.route("/productdetails")
.get(HandleDisplayProducts)

router.route("/productdetails/filter")
.get(HandleFilterProducts, HandleSortProducts);

module.exports = router;