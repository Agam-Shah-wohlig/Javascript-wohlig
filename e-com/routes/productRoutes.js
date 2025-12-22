const express = require("express");
const router = express.Router();

const {HandleDisplayProducts, HandleFilterProducts} = require("../controllers/productController");

router.route("/")
.get(HandleDisplayProducts);

router.route("/filter")
.get(HandleFilterProducts);

module.exports = router;