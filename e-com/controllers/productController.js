const Product = require("../models/product");
const Brand = require("../models/brand");
const Category = require("../models/category");

async function HandleDisplayProducts(req, res) {
    try {
        // Fetch products from DB
        const products = await Product.find().lean();
        
        // No need to strip variants — just send all variants
        const formatted = products.map(p => {
            const productImage = (p.images && p.images[0]) || "/images/default-product.png";
            return {
                _id: p._id,
                title: p.title,
                images: p.images[0]|| productImage,
                description: p.description,
                category: p.category,
                brand: p.brand,
                variants: p.variants.map(v => ({
                    _id: v._id,
                    price: v.discountPrice || v.price || 0,
                    image: v.image || productImage,
                    attributes: v.attributes
                }))
            };
        });
        // Send to EJS
        res.render("productDetails", { products: formatted });
    } catch (err) {
        console.log(err);
        res.status(500).send("Error loading products");
    }
}


async function HandleFilterProducts(req, res) {
    try {
        const { category, brand, color, size, price, sort } = req.query;
        const filter = {};

        // --- Build filter object (same as before) ---
        if (category) {
            const categories = await Category.find({ categoryname: { $in: [].concat(category) } }).select("_id");
            filter.category = { $in: categories.map(c => c._id) };
        }

        if (brand) {
            const brands = await Brand.find({ brandname: { $in: [].concat(brand) } }).select("_id");
            filter.brand = { $in: brands.map(b => b._id) };
        }

        const variantFilters = [];
        if (color) variantFilters.push({ "attributes.color": { $in: [].concat(color) } });
        if (size) variantFilters.push({ "attributes.size": { $in: [].concat(size) } });

        if (price) {
            const priceRanges = [].concat(price).map(r => {
                const [min, max] = r.split("-").map(Number);
                return { min, max };
            });
            variantFilters.push({
                $or: priceRanges.map(range => ({
                    $or: [
                        { discountPrice: { $gte: range.min, $lte: range.max } },
                        { price: { $gte: range.min, $lte: range.max } }
                    ]
                }))
            });
        }

        if (variantFilters.length > 0) {
            filter.variants = { $elemMatch: { $and: variantFilters } };
        }

        // --- Fetch filtered products ---
        let products = await Product.find(filter).lean();

        // --- Filter variants inside each product ---
        products = products.map(p => {
            const productImage = (p.images && p.images[0]) || "/images/default-product.png";
            const filteredVariants = p.variants.filter(v => {
                if (color && ![].concat(color).includes(v.attributes.color)) return false;
                if (size && ![].concat(size).includes(v.attributes.size)) return false;
                if (price) {
                    const variantPrice = v.discountPrice || v.price || 0;
                    return [].concat(price).some(r => {
                        const [min, max] = r.split("-").map(Number);
                        return variantPrice >= min && variantPrice <= max;
                    });
                }
                return true;
            });

            return {
                _id: p._id,
                title: p.title,
                images: p.images[0] || productImage,
                variants: filteredVariants.map(v => ({
                    _id: v._id,
                    price: v.discountPrice || v.price || 0,
                    image: v.image || productImage,
                    attributes: v.attributes
                }))
            };
        });

        // --- Call the reusable sort function if sort option exists ---
        const finalProducts = sortProducts(products, sort);

        res.render("productDetails", { products: finalProducts });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Error filtering products" });
    }
}


function sortProducts(products, sort) {
    if (!sort) return products; // no sorting needed

    return products.sort((a, b) => {
        const getPrice = (p) => {
            const prices = p.variants?.map(v => v.discountPrice || v.price || 0) || [0];
            return sort === "high" ? Math.max(...prices) : Math.min(...prices);
        };

        return sort === "high" ? getPrice(b) - getPrice(a) : getPrice(a) - getPrice(b);
    });
}

module.exports = {
    HandleDisplayProducts,
    HandleFilterProducts
};