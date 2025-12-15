const Product = require("../models/product");
const Category = require("../models/category");
const Brand = require("../models/brand");

const colors = ["Red", "Blue", "Black", "White", "Grey", "Green", "Navy"];
const sizes = ["S", "M", "L", "XL", "XXL"];

const randomNumber = (min, max) => +(Math.random() * (max - min) + min).toFixed(2);
const randomElement = arr => arr[Math.floor(Math.random() * arr.length)];

async function seedProducts() {
  try {
    // Fetch all categories and brands in parallel
    const [categories, brands] = await Promise.all([
      Category.find().lean(),
      Brand.find().lean()
    ]);

    if (!categories.length || !brands.length) {
      console.log("No categories or brands found. Aborting product seeding.");
      return;
    }

    const products = [];

    for (let i = 1; i <= 50; i++) {
      const category = randomElement(categories);
      const brand = randomElement(brands);

      const variantCount = Math.floor(Math.random() * 3) + 1;
      const variants = [];

      for (let v = 1; v <= variantCount; v++) {
        const price = randomNumber(1000, 4000);

        variants.push({
          attributes: {
            color: randomElement(colors),
            size: randomElement(sizes)
          },
          sku: `${brand.brandname.toUpperCase().replace(" ", "")}-${category.categoryname.replace(" ", "").toUpperCase()}-${i}-V${v}`,
          price,
          discountPrice: +(price * (0.8 + Math.random() * 0.15)).toFixed(2),
          stock: Math.floor(Math.random() * 50) + 10,
          image: null
        });
      }

      products.push({
        title: `${brand.brandname} ${category.categoryname} ${i}`,
        description: `High-quality ${category.categoryname.toLowerCase()} from ${brand.brandname}. Comfortable and stylish.`,
        images: [null],
        category: category._id,
        brand: brand._id,
        variants
      });
    }

    // Insert products into the database
    await Product.insertMany(products, { ordered: false });
    console.log(`${products.length} products inserted successfully.`);
  } catch (error) {
    console.error("Error seeding products:", error);
  }
}

module.exports = seedProducts;
