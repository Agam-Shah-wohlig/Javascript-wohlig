const mongoose = require("mongoose");

//Create User Schema
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
    },
    
    email: {
        type: String,
        required: true,
        unique: true
    },

    password: {
        type: String,
        required:true
    },

    role: {
        type: String,
        enum: ["user", "admin"],
        default: "user"
    }
}, {timestamps: true});


// Create mongoose model
const User = mongoose.model("user", userSchema);

module.exports = User;