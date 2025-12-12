// const mongoose = require("mongoose");
const Category = require("../models/category");
const Brand = require("../models/brand");

async function seedCategoriesAndBrands() {
  const categories = [
    { categoryname: "Casual Shirts" },
    { categoryname: "T-Shirts" },
    { categoryname: "Jeans" },
    { categoryname: "Formal Pants"}
  ];

  const brands = [
    { brandname: "Raymond" },
    { brandname: "Blackberrys" },
    { brandname: "Louis Philippe" }
  ];
  try {
  // Upsert categories (insert if not exists)
    for (const cat of categories) {
      await Category.updateOne(
        { categoryname: cat.categoryname }, // find by name
        { $setOnInsert: cat },             // insert if not exists
        { upsert: true }
      );
    }

    // Upsert brands (insert if not exists)
    for (const br of brands) {
      await Brand.updateOne(
        { brandname: br.brandname },
        { $setOnInsert: br },
        { upsert: true }
      );
    }
  console.log("Categories and Brands seeded!");

} catch (err) {
    console.error("Seeding error:", err);
}
}

module.exports = seedCategoriesAndBrands;