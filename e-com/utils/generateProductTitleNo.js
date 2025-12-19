// utils/productUtils.js
/**
 * Get next product number for a brand + category
 * @param {Array} existingProducts - Array of product documents
 * @returns {Number} next number for the title
 */
function getNextProductNumber(existingProducts) {
  if (!existingProducts || existingProducts.length === 0) return 1;

  // Extract last number from latest product title
  const lastTitle = existingProducts[0].title;
  const parts = lastTitle.split(" ");
  const lastNumber = parseInt(parts[parts.length - 1], 10);

  return lastNumber + 1;
}

module.exports = getNextProductNumber;
