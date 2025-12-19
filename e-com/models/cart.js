const mongoose = require("mongoose");

const cartItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "product",
    required: true
  },

  variantId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },

  sku: String,

  titleSnapshot: {
    type: String,
    required: true
  },

  variantSnapshot: {
    type: Object,
    required: true
},

  quantity: {
    type: Number,
    min: 1,
    required: true
  },

  price: {
    type: Number,
    required: true
  },

  discountPrice: {
    type: Number,
    default: 0
  },

  finalPrice: {
    type: Number,
    required: true
  }
});


// Main Cart Schema
const cartSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true,
        unique: true, // One cart per user
    },
    items: {
        type: [cartItemSchema],
        default: [],
    },
}, { timestamps: true });

//  Compound index to prevent duplicate variant entries per user
// cartSchema.index(
//     { user: 1, "items.variantId": 1 },
//     { unique: true, partialFilterExpression: { "items.variantId": { $exists: true } } }
// );

const Cart = mongoose.model("cart", cartSchema);
module.exports = Cart;
