const mongoose = require("mongoose");

// Create user Schema
const userSchema = new mongoose.Schema({
    firstname: {
        type: String,
        required: true
    },
    lastname: {
        type: String
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    gender: {
        type: String,
        required: true
    },
    jobtitle: {
        type: String
    }
});

// Create mongoose model
const User = mongoose.model("user", userSchema);

module.exports = User;