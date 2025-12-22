const Product = require("../models/product");
const Brand = require("../models/brand");
const Category = require("../models/category");

// Display all products (unfiltered)
async function HandleDisplayProducts(req, res) {
    try {
        const products = await Product.find()
            .populate('category', 'categoryname')
            .populate('brand', 'brandname')
            .lean();

        const formattedProducts = formatProducts(products);
        
        res.render("products", { 
            products: formattedProducts,
            filters: req.query // Pass filters back to maintain state
        });
    } catch (error) {
        console.error("Error loading products:", error);
        res.status(500).send("Error loading products");
    }
}

// Filter and sort products
async function HandleFilterProducts(req, res) {
    try {
        const { category, brand, color, size, price, sort, search } = req.query;
        
        // Build base filter
        const filter = await buildProductFilter(category, brand, search);
        
        // Fetch products with base filter
        let products = await Product.find(filter)
            .populate('category', 'categoryname')
            .populate('brand', 'brandname')
            .lean();

        // Filter variants within products
        products = filterProductVariants(products, { color, size, price });
        
        // Remove products with no matching variants
        products = products.filter(p => p.variants.length > 0);

        // Sort products
        if (sort) {
            products = sortProducts(products, sort);
        }

        const formattedProducts = formatProducts(products);

        res.render("products", { 
            products: formattedProducts,
            filters: req.query // Pass filters back to maintain checkbox state
        });

    } catch (error) {
        console.error("Error filtering products:", error);
        res.status(500).send("Error filtering products");
    }
}

// ============= HELPER FUNCTIONS =============

// Build MongoDB filter for products
async function buildProductFilter(category, brand, search) {
    const filter = {};

    // Category filter
    if (category) {
        const categoryArray = Array.isArray(category) ? category : [category];
        const categories = await Category.find({ 
            categoryname: { $in: categoryArray } 
        }).select("_id");
        
        if (categories.length > 0) {
            filter.category = { $in: categories.map(c => c._id) };
        }
    }

    // Brand filter
    if (brand) {
        const brandArray = Array.isArray(brand) ? brand : [brand];
        const brands = await Brand.find({ 
            brandname: { $in: brandArray } 
        }).select("_id");
        
        if (brands.length > 0) {
            filter.brand = { $in: brands.map(b => b._id) };
        }
    }

    // Search filter
    if (search) {
        filter.title = { $regex: search, $options: 'i' };
    }

    return filter;
}

// Filter variants within products based on color, size, price
function filterProductVariants(products, { color, size, price }) {
    return products.map(product => {
        let variants = [...product.variants];

        // Filter by color
        if (color) {
            const colorArray = Array.isArray(color) ? color : [color];
            variants = variants.filter(v => 
                colorArray.includes(v.attributes?.color)
            );
        }

        // Filter by size
        if (size) {
            const sizeArray = Array.isArray(size) ? size : [size];
            variants = variants.filter(v => 
                sizeArray.includes(v.attributes?.size)
            );
        }

        // Filter by price range
        if (price) {
            const priceRanges = Array.isArray(price) ? price : [price];
            variants = variants.filter(v => {
                const variantPrice = v.discountPrice || v.price || 0;
                return priceRanges.some(range => {
                    const [min, max] = range.split("-").map(Number);
                    return variantPrice >= min && variantPrice <= max;
                });
            });
        }

        return { ...product, variants };
    });
}

// Sort products by price
function sortProducts(products, sortOrder) {
    return products.sort((a, b) => {
        const priceA = getProductPrice(a);
        const priceB = getProductPrice(b);

        return sortOrder === "high" 
            ? priceB - priceA  // High to Low
            : priceA - priceB; // Low to High
    });
}

// Get representative price for a product (min or max of variants)
function getProductPrice(product) {
    if (!product.variants || product.variants.length === 0) return 0;
    
    const prices = product.variants.map(v => v.discountPrice || v.price || 0);
    return Math.min(...prices); // Use minimum price as representative
}

// Format products for frontend
function formatProducts(products) {
    const DEFAULT_IMAGE = "/images/default-product.png";

    return products.map(product => {
        const productImage = (product.images && product.images[0]) || DEFAULT_IMAGE;

        return {
            _id: product._id,
            title: product.title,
            description: product.description,
            category: product.category?.categoryname || 'Unknown',
            brand: product.brand?.brandname || 'Unknown',
            images: productImage,
            variants: product.variants.map(variant => ({
                _id: variant._id,
                price: variant.discountPrice || variant.price || 0,
                stock: variant.stock || 0,
                image: variant.image || productImage,
                attributes: variant.attributes || {}
            }))
        };
    });
}

module.exports = {
    HandleDisplayProducts,
    HandleFilterProducts
};