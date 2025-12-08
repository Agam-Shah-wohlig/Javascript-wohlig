const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const app = express(); 
const path = require("path");
const { v4: uuidv4 } = require('uuid');


app.engine("html", require("ejs").renderFile);
app.set("view engine", "html");
app.set("views", path.join(__dirname, "templates"));

const PORT = 8000;

// MongoDB connection
mongoose.connect("mongodb://localhost:27017/authentication-tutorial")
.then(() => console.log("MongoDb Connected"))
.catch((err) => console.log("Mongo Error", err));

// Schemas //
const userSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});

const User = mongoose.model("user", userSchema);

// Custom Middleware
async function restrictToLoggedInUserOnly(req, res, next) {
    const userUid = req.cookies.uid;

    if (!userUid) return res.redirect("/login");

    const user = getUser(userUid);

    if (!user) return res.redirect("login.html");

    req.user = user;
    next();
}

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "templates"))); // for CSS & static files
app.use(cookieParser());
app.use("/homepage", restrictToLoggedInUserOnly);


//Utility Functions
const SessionIdtoUserMap = new Map();

function setUser(id, user) {
    SessionIdtoUserMap.set(id, user);
}

function getUser(id) {
    return SessionIdtoUserMap.get(id);
}

///// Routes /////

// Homepage (logged out)
app.get("/", (req, res) => {
    res.render("homepage.html", {
        username: "Guest",
        message: "You are not logged in! Go to /login"
    });
});

// Homepage (logged in) via query param
app.get("/homepage", (req, res) => {
    res.render("homepage.html", {
        username: req.user.username,
        message: `What are you looking for!`
    });
});

// Signup page
app.get("/signup", (req, res) => {
    res.render("signup.html", { message: "" });
});

// Signup POST
app.post("/signup", async (req, res) => {
    const { username, email, password, repassword } = req.body;

    try {
        if (!username || !email || !password || !repassword) {
            return res.status(400).render("signup.html", { message: "All fields are required" });
        }

        if (password !== repassword) {
            return res.status(400).render("signup.html", { message: "Passwords do not match" });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).render("signup.html", { message: "Email already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        await User.create({ username, email, password: hashedPassword });

        // Redirect to login with message
        return res.redirect("/login?message=Signup successful. Please log in");

    } catch (err) {
        console.error(err);
        return res.status(500).render("signup.html", { message: "Server Error" });
    }
});

// Login page
app.get("/login", (req, res) => {
    const message = req.query.message || "";
    res.render("login.html", { message });
});

// Login POST
app.post("/login", async (req, res) => {
    const { email, password } = req.body;

    try {
        if (!email || !password) {
            return res.status(400).render("login.html", { message: "All fields are required" });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).render("login.html", { message: "Invalid Email or Password" });
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) {
            return res.status(401).render("login.html", { message: "Invalid Email or Password" });
        }

        //Store Session Id
        const sessionId = uuidv4();
        setUser(sessionId, user);
        res.cookie("uid", sessionId);

        // Redirect to homepage after successful login
        return res.redirect('/homepage');

    } catch (err) {
        console.error(err);
        return res.status(500).render("login.html", { message: "Server Error" });
    }
});

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
