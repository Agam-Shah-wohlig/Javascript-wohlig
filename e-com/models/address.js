const mongoose = require("mongoose");

const addressSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true,
    },
    label: {                 // e.g., "Home", "Office"
        type: String,
        required: true,
    },
    fullName: {              // recipient name
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: true,
    },
    street: {
        type: String,
        required: true,
    },
    city: {
        type: String,
        required: true,
    },
    state: {
        type: String,
        required: true,
    },
    postalCode: {
        type: String,
        required: true,
    },
    country: {
        type: String,
        required: true,
    },
}, { timestamps: true });

const Address = mongoose.model("address", addressSchema);

module.exports = Address;