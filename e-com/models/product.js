const mongoose = require("mongoose");

const variantSchema = new mongoose.Schema(
  {
    // Attributes defining this variant
    attributes: {
      type: Map,
      of: String, // e.g., { color: "Red", size: "M" }
      required: true,
    },

    sku: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },

    price: {
      type: Number,
      min: 0,
      required: true,
    },

    discountPrice: {
      type: Number,
      min: 0,
      validate: {
        validator: function (val) {
          return val <= this.price;
        },
        message: "Discount price cannot exceed variant price",
      },
    },

    stock: {
      type: Number,
      default: 0,
      min: 0,
    },

    image: {
      type: String, 
      default: null,
    },
  },
  { _id: true } 
);

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 150,
    },

    description: {
      type: String,
      required: true,
      minlength: 10,
    },

    images: {
      type: [String],
      validate: {
        validator: (arr) => arr.length > 0,
        message: "At least one product image is required",
      },
    },

    // Category & Brand for filtering
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
      index: true,
    },

    brand: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Brand",
      required: true,
      index: true,
    },

    // Variants
    variants: {
      type: [variantSchema],
      validate: {
        validator: (arr) => arr.length > 0,
        message: "At least one variant is required",
      },
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const Product = mongoose.model("product", productSchema);


module.exports = Product;
