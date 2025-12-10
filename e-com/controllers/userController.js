const User = require("../models/user");
const bcrypt = require("bcrypt")

function HandleDisplayLogin(req, res) {
    try {
        return res.render("login", { message: null});
    } catch (err) {
        return res.status(500).json({ message: "Server Not Responding" });
    }
}

function HandleDisplaySignup(req, res) {
    try {
        return res.render("signup", { message: null });
    } catch (err) {
        return res.status(500).json({ message: "Server Not Responding" });
    }
}

async function HandleLogin(req, res) {
    const {email, password } = req.body;

    try {
        if (!email || !password) {
            return res.status(400).render("login", { message: "Emails and Passwords are required." });
        }

        const email_regex = /^[a-zA-Z0-9._%+-]+@(gmail|yahoo|hotmail)\.com$/;
        if (!email_regex.test(email)) {
            return res.status(400).render("login", { message: "Email is not in correct format" });
        }

        const user = await User.findOne({ email });
        if (!user) {
            console.log(user)
             return res.status(401).render("login", { message: "Invalid Email or Password" });
         }
 
         const isPasswordCorrect = await bcrypt.compare(password, user.password);
         if (!isPasswordCorrect) {
             return res.status(401).render("login", { message: "Invalid Email or Password" });
         }

         return res.status(200).redirect("user-dashboard");

    } catch (err) {
        console.log(err);
        return res.status(500).render("login", { message: "Server Error" });
    }
}

async function HandleSignup(req, res) {
    const { username, email, password, confirmPassword } = req.body;

    try {
        if (!username || !email || !password || !confirmPassword) {
            return res.status(400).render("signup", { message: "All fields are required" });
        }

        const email_regex = /^[a-zA-Z0-9._%+-]+@(gmail|yahoo|hotmail)\.com$/;
        if (!email_regex.test(email)) {
            return res.status(400).render("signup", { message: "Email must end with @gmail.com, @yahoo.com, or @hotmail.com." });
        }

        const password_regex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[\W_]).{8,}$/;
        if(!password_regex.test(password)) {
            return res.status(400).render("signup", { message: "Password must have uppercase, lowercase, number, symbol, and be 8+ characters."})
        }

        if (password !== confirmPassword) {
            return res.status(400).render("signup", { message: "Passwords do not match" });
        }

       const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).render("signup", { message: "Email already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        await User.create({ username, email, password: hashedPassword });
        
        return res.status(200).redirect("login");

    } catch (err) {
        console.error(err);
        return res.status(500).render("signup", { message: "Server Error" });
    }
}

function HandleDisplayUserDashboard(req, res) {
    try {
        return res.render("user-dashboard", { message: null});
    } catch (err) {
        return res.status(500).json({ message: "Server Not Responding" });
    }
}


module.exports = {
    HandleDisplayLogin,
    HandleDisplaySignup,
    HandleLogin,
    HandleSignup,
    HandleDisplayUserDashboard
}