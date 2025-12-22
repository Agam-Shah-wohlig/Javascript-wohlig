const Product = require("../models/product");
const Category = require("../models/category");
const Brand = require("../models/brand");
const mongoose = require("mongoose");

const getNextProductNumber = require("../utils/generateProductTitleNo"); // utility function

async function HandleRenderAddProductPage(req, res) {
    
    try {

        const { productId } = req.query;

        // Fetch all categories and brands
        const categories = await Category.find({}, "_id categoryname").lean();
        const brands = await Brand.find({}, "_id brandname").lean();

        // Create the colors and size variant options for dropdown!
        const colors = ["Red", "Blue", "Black", "White", "Grey", "Green", "Navy"];
        const sizes = ["S", "M", "L", "XL", "XXL"];

        
        res.render("adminAddProducts", { brands, categories, colors, sizes, productId });

    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Server Not Responding" });
    }
}

async function HandleAdminAddProducts(req, res) {
    try {
        const {
            brandId,
            categoryId,
            description,
            images,
            price,
            discountPrice,
            stock,
            variantImage,
            color,
            size
        } = req.body;

        // Normalize images
        const imagesArray = Array.isArray(images) ? images : [images];

        // Validate required fields
        if (!brandId || !categoryId || !description || !imagesArray.length || !price || !stock || !color || !size) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        // Fetch brand & category names
        const [brandDoc, categoryDoc] = await Promise.all([
            Brand.findById(brandId, "brandname").lean(),
            Category.findById(categoryId, "categoryname").lean()
        ]);

        if (!brandDoc || !categoryDoc) {
            return res.status(400).json({ message: "Invalid Brand or Category" });
        }

        // Fetch existing products for this brand + category, latest first
            const existingProducts = await Product.find({
                brand: brandDoc._id,
                category: categoryDoc._id
            }).sort({ createdAt: -1 }).limit(1);

        // Generate title and sku
        const nextNumber = getNextProductNumber(existingProducts);
        const title = `${brandDoc.brandname} ${categoryDoc.categoryname} ${nextNumber}`;
        const skuName = `${brandDoc.brandname.toUpperCase()}-${categoryDoc.categoryname.toUpperCase().replace(/\s+/g, '')}-${nextNumber}-V1`;

        // Create product
        const newProduct = await Product.create({
            brand: brandId,
            category: categoryId,
            title,
            description,
            images: imagesArray,
            variants: [{
                attributes: {
                    color,
                    size
                },
                sku: skuName,
                price,
                discountPrice: discountPrice || 0,
                stock,
                image: variantImage ? variantImage : null
            }]
        });

        // Redirect with product ID
        return res.redirect(`/admin/products/add?productId=${newProduct._id}`);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Server Error" });
    }
}

// Render Add Variant Page
async function HandleRenderAddVariant(req, res) {
    try {

        const { productId, variantId } = req.query;

        const products = await Product.find({}, "_id title").lean();

        // Create the colors and size variant options for dropdown!
        const colors = ["Red", "Blue", "Black", "White", "Grey", "Green", "Navy"];
        const sizes = ["S", "M", "L", "XL", "XXL"];

        return res.render("adminAddVariants", { products, productId, variantId, colors, sizes});

    } catch (err) {
        console.error(err);
        return res.status(500).send("Server Not Responding");
    }
}

// Handle Add Variants
async function handleAddVariant(req, res) {
  try {
    const { productId } = req.body;
    const { color, size, price, discountPrice, stock, image } = req.body;

    if (!color || !size || !price || !stock) {
      return res.status(400).send("Missing required fields");
    }

    const product = await Product.findById(productId);
    if (!product) return res.status(404).send("Product not found");

    // Safe duplicate check for attributes map
    const duplicate = product.variants.find(v => {
    const variantColor = v.attributes.get ? v.attributes.get('color') : v.attributes.color;
    const variantSize  = v.attributes.get ? v.attributes.get('size')  : v.attributes.size;

    if (!variantColor || !variantSize) return false;

    return variantColor.trim().toUpperCase() === color.trim().toUpperCase() &&
           variantSize.trim().toUpperCase() === size.trim().toUpperCase();
    });

    if (duplicate) return res.json({
        error: "Variant already exists"
    });


    // Generate SKU
    const parts = product.title.trim().split(/\s+/);
    const brand = parts[0].toUpperCase();
    const number = parts[parts.length - 1]; // last word
    const category = parts.slice(1, -1).join("").toUpperCase(); // middle words joined without spaces 
    const variantNumber = product.variants.length + 1;
    const sku = `${brand}-${category}-${number}-V${variantNumber}`;

    const newVariant = {
      attributes: { color, size },
      sku,
      price,
      discountPrice: discountPrice || 0,
      stock,
      image: image || null
    };

    product.variants.push(newVariant);
    await product.save();

    // Get the _id of the last added variant
    const addedVariant = product.variants[product.variants.length - 1];

    // Redirect with both variantAdded flag and variantId
    res.redirect(
      `/admin/products/addvariant?variantAdded=true&productId=${productId}&variantId=${addedVariant._id}`
    );
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
}

// Render Delete Variant Page
async function HandleRenderDeleteVariantPage(req, res) {
  try {
    const products = await Product.find(
      {},
      { title: 1, variants: 1 }
    ).lean();

    return res.render("adminDeleteVariants", { products });
  } catch (err) {
    console.error(err);
    return res.status(500).send("Server Not Responding");
  }
}

// Delete Variant API
async function HandleAdminDeleteVariant(req, res) {
  try {
    const { id } = req.params;

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid Variant ID" });
    }

    // Find product containing this variant
    const product = await Product.findOne({ "variants._id": id });

    if (!product) {
      return res.status(404).json({ message: "Variant not found" });
    }

    // Prevent deleting last variant (schema validation)
    if (product.variants.length === 1) {
      return res.status(400).json({
        message: "Cannot delete the last variant of a product"
      });
    }

    // Remove variant
    await Product.updateOne(
      { _id: product._id },
      { $pull: { variants: { _id: id } } }
    );

    return res.json({ message: "Variant deleted successfully" });

  } catch (err) {
    console.error("DELETE VARIANT ERROR:", err);
    return res.status(500).json({ message: "Server Not Responding" });
  }
}




// GET all products → render edit page
async function HandleAdminGetAllProducts(req, res) {
    try {
        const products = await Product.find();
        return res.render("adminEditProducts", { products });
    } catch (err) {
        console.error(err);
        return res.status(500).send("Server Not Responding");
    }
}

// GET single product → JSON (for AJAX edit form)
async function HandleAdminGetSingleProduct(req, res) {
    try {
        const { id } = req.params;
        const product = await Product.findById(id);
        if (!product) return res.status(404).json({ message: "Product not found" });

        const productJson = {
            ...product._doc,
            variants: product.variants.map(v => ({
                ...v._doc,
                attributes: Array.isArray(v.attributes)
                    ? v.attributes.map(attrMap => Object.fromEntries(attrMap))
                    : v.attributes
                        ? [Object.fromEntries(v.attributes)]
                        : []
            }))
        };

        return res.json(productJson);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Server Not Responding" });
    }
}


// PUT /admin/products/edit/:id
async function HandleAdminUpdateProduct(req, res) {
    try {
        const { id } = req.params;
        const {
            title,
            description,
            images,
            category,
            brand,
            variantId,
            sku,
            price,
            discountPrice,
            stock,
            color,
            size,
            variantImage
        } = req.body;

        const product = await Product.findById(id);
        if (!product) return res.status(404).json({ message: "Product not found" });

        // Update product-level fields
        product.title = title;
        product.description = description;
        product.images = images ? images.split(',') : [null]; // handle comma-separated
        product.category = category;
        product.brand = brand;

        // Update the selected variant
        const variant = product.variants.id(variantId);
        if (!variant) return res.status(404).json({ message: "Variant not found" });

        variant.sku = sku;
        variant.price = Number(price);
        variant.discountPrice = Number(discountPrice);
        variant.stock = Number(stock);
        variant.image = variantImage || null;

        // Correct way to update attributes
        variant.attributes = new Map([
            ['color', color],
            ['size', size]
        ]);

        await product.save();

        return res.json({ message: "Product updated successfully", product });

    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Server Error" });
    }
}
async function HandleRenderDeletePage(req, res) {
    try {
        const products = await Product.find({}, { title: 1 });
        // console.log(products);
        return res.render("adminDeleteProducts", { products });
    } catch (err) {
        console.error(err);
        return res.status(500).send("Server Not Responding");
    }
}

// Delete a Specific product API
async function HandleAdminDeleteProducts(req, res) {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({ message: "Product ID is required" });
        }

        const product = await Product.findByIdAndDelete(id);
        // console.log("In Delete API",product);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        return res.json({ message: "Product deleted successfully" });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Server Not Responding" });
    }
}


module.exports = {
    HandleRenderAddProductPage,
    HandleAdminAddProducts,
    HandleRenderAddVariant,
    handleAddVariant,
    HandleRenderDeleteVariantPage,
    HandleAdminDeleteVariant,
    HandleAdminGetAllProducts,
    HandleAdminGetSingleProduct,
    HandleAdminUpdateProduct,
    HandleRenderDeletePage,
    HandleAdminDeleteProducts
};