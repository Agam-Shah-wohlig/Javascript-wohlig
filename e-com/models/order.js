const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "product",
        required: true
    },

    variantId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },

    sku: {
        type: String,
        required: true
    },

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

// Main Order Schema
const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true
    },

    items: {
        type: [orderItemSchema],
        required: true,
        validate: [arr => arr.length > 0, "Order must have at least one item"]
    },

    totalAmount: {
        type: Number,
        required: true,
        min: 0
    },

    totalDiscount: {
        type: Number,
        default: 0,
        min: 0
    },

    status: {
        type: String,
        enum: ["pending", "confirmed", "shipped", "delivered", "cancelled"],
        default: "pending"
    },

    shippingAddress: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "address",
        required: true
    },

    paymentMethod: {
        type: String,
        enum: ["cod", "card", "upi", "wallet"],
        required: true
    }

}, { timestamps: true });

const Order = mongoose.model("order", orderSchema);

module.exports = Order;
