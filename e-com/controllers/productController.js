const Product = require("../models/product");
const Brand = require("../models/brand");
const Category = require("../models/category");

async function HandleDisplayProducts(req, res) {
    
    try {
        const products = await Product.find().lean();
        

        // Format products for frontend
        const formatted = products.map(p => {
            const firstVariant = p.variants?.[0] || {};
            return {
                id: p._id,
                title: p.title,
                description: p.description,
                category: p.category,
                brand: p.brand,
                price: firstVariant.discountPrice || firstVariant.price || 0,
                image:
                    (p.images && p.images[0]) ||
                    firstVariant.image ||
                    "/images/default-product.png" // fallback
            };
        });
        res.render("product", { products: formatted });

    } catch (err) {
        console.log(err);
        res.status(500).send("Error loading products");
    }
}

async function HandleFilterProducts(req, res) {
    try {
        const { category, brand, color, size, price } = req.query;
        let filter = {};


    // CATEGORY
    if (category) {
        const arr = Array.isArray(category) ? category : [category];
        
        const categories = await Category.find({ categoryname: { $in: arr } }).select("_id");
        const categoryIds = categories.map(c => c._id);
        filter.category = { $in: categoryIds };
    }

    // BRAND
    if (brand) {
        const arr = Array.isArray(brand) ? brand : [brand];

        const brands = await Brand.find({
            brandname: { $in: arr }
        }).select("_id");

        const brandIds = brands.map(b => b._id);

        filter.brand = { $in: brandIds };
    }

        // COLOR
        if (color) {
            const arr = Array.isArray(color) ? color : [color];
            filter["variants.attributes.color"] = { $in: arr };
        }

        // SIZE
        if (size) {
            const arr = Array.isArray(size) ? size : [size];
            filter["variants.attributes.size"] = { $in: arr };
        }

        // PRICE RANGE
        if (price) {
            const arr = Array.isArray(price) ? price : [price];
            filter.$or = arr.map(r => {
                const [min, max] = r.split("-").map(Number);
                return {
                    "variants.discountPrice": { $gte: min, $lte: max }
                };
            });
        }
        // console.log("This is filter",filter);
        // console.log("This is filter",JSON.stringify(filter, null, 2));


        const products = await Product.find(filter).lean();

        // console.log("These are selected",products);

        const formatted = products.map(p => {
            const productImage = (p.images && p.images[0]) || "/images/default-product.png";
            return {
                id: p._id,
                title: p.title,
                variants: p.variants.map(v => ({
                    price: v.discountPrice || v.price || 0,
                    image: v.image || productImage,
                    attributes: v.attributes
                }))
            };
        });

        res.render("product", { products: formatted });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Error filtering products" });
    }
}


async function HandleSortProducts(req, res) {
    try {
        const { sort } = req.query;

        let products = await Product.find().lean();

        // Sort on backend (fast enough)
        products.sort((a, b) => {
            const pa = a.variants?.[0]?.discountPrice || 0;
            const pb = b.variants?.[0]?.discountPrice || 0;

            if (sort === "high") return pb - pa; // high → low
            if (sort === "low") return pa - pb;  // low → high
            return 0;
        });

        const formatted = products.map(p => {
        const productImage = (p.images && p.images[0]) || "/images/default-product.png";

        return {
            id: p._id,
            title: p.title,
            variants: p.variants.map(v => ({
                price: v.discountPrice || v.price || 0,
                image: v.image || productImage,
                attributes: v.attributes
            }))
        };
    });
    
    res.render("product", { products: formatted });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Error sorting products" });
    }
}

module.exports = {
    HandleDisplayProducts,
    HandleFilterProducts,
    HandleSortProducts
};