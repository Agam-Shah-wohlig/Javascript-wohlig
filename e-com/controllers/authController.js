const { hashPassword, verifyPassword } = require("../utils/hash");
const { generateToken} = require("../utils/jwt");
const User = require("../models/user");

// --- SIGNUP ---

async function HandleDisplaySignup(req, res) {
    res.render("signup", { message: null});
}

async function HandleSignup(req, res) {
    const { username, email, password } = req.body;

    try {
        let user = await User.findOne({ email });
        if (user) return res.status(400).render("signup", { message: "Email already exists" });

        const hashedPassword = await hashPassword(password);

        user = new User({
            username,
            email,
            password: hashedPassword
        });

        await user.save();

        const token = generateToken(user);

        res.cookie("jwt", token, {
            httpOnly: true,
            sameSite: "lax",
            secure: false // true in production (HTTPS)
        });

        res.redirect("/homepage");

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
}

// --- LOGIN ---

async function HandleDisplayLogin(req, res) {
    res.render("login", { message: null});
}


async function HandleLogin(req, res) {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(400).render("login", { message: "Invalid credentials" });

        const isMatch = await verifyPassword(password, user.password);
        if (!isMatch) return res.status(400).render("login",{ message: "Invalid credentials" });

        const token = generateToken(user);

        res.cookie("jwt", token, {
            httpOnly: true,
            sameSite: "lax",
            secure: false // true in production (HTTPS)
        });

        res.redirect("/homepage");

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
}

// Logout handler
function HandleLogout(req, res) {
    try {
        res.clearCookie("jwt", {
            httpOnly: true,
            sameSite: "lax",
            secure: false,
            path: "/"   // important
        });

        return res.redirect("/homepage");
    } catch (error) {
        console.error("Error logging out:", error);
        return res.status(500).send("Error logging out");
    }
}


module.exports = {
    HandleSignup,
    HandleLogin,
    HandleDisplayLogin,
    HandleDisplaySignup,
    HandleLogout
};
