const express = require("express");
const router = express.Router();


const {HandleDisplayAdminDashboard} = require("../controllers/adminController");
const {HandleRenderAddProductPage,
    HandleAdminAddProducts,
    HandleRenderAddVariant,
    handleAddVariant,
    HandleRenderDeleteVariantPage,
    HandleAdminDeleteVariant, 
    HandleAdminGetAllProducts,
    HandleAdminGetSingleProduct,
    HandleAdminUpdateProduct, 
    HandleRenderDeletePage,
    HandleAdminDeleteProducts} = require("../controllers/manageProductsController");

// Display the HomePage to Guest user
router.route("/dashboard")
.get(HandleDisplayAdminDashboard)

router.route("/add")
.get(HandleRenderAddProductPage)
.post(HandleAdminAddProducts);

router.route("/addvariant")
.get(HandleRenderAddVariant)
.post(handleAddVariant);

// Delete Variant Page
router.route('/deletevariant')
.get(HandleRenderDeleteVariantPage);

// Delete Variant API
router.route('/deletevariant/:id')
.delete(HandleAdminDeleteVariant);

router.route("/edit")
.get(HandleAdminGetAllProducts);

router.route("/edit/:id")
.get(HandleAdminGetSingleProduct)
.put(HandleAdminUpdateProduct);

router.route("/delete")
.get(HandleRenderDeletePage);

router.route("/delete/:id")
.delete(HandleAdminDeleteProducts);

module.exports = router;


