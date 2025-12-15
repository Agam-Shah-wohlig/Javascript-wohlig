// utils/userAuthentication.js
const User = require("../models/user");
const {verifyPassword} = require("../utils/hash"); // bcrypt.compare wrapper

async function authenticateUser(email, password) {
    if (!email || !password) {
        throw new Error("Emails and Passwords are required.");
    }

    const email_regex = /^[a-zA-Z0-9._%+-]+@(gmail|yahoo|hotmail)\.com$/;
    if (!email_regex.test(email)) {
        throw new Error("Email is not in correct format");
    }

    const user = await User.findOne({ email });
    if (!user) {
        throw new Error("Invalid Email or Password");
    }

    const isPasswordCorrect = await verifyPassword(password, user.password);
    if (!isPasswordCorrect) {
        throw new Error("Invalid Email or Password");
    }

    return user; // return the user object if everything is fine
}

module.exports = authenticateUser;
