const express = require("express")
const mongoose = require("mongoose");
const app = express();

const PORT = 8000;

// connection
mongoose.connect("mongodb://localhost:27017/mongodb-tutorial")
.then(() => console.log("MongoDB Connected"))
.catch((err) => console.log("Mongo Error", err));

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

//middleware
app.use(express.urlencoded({ extended: true })); // For form-urlencoded data
app.use(express.json());

// Get all users
app.get("/users", async (req, res) => {
    try {
        const users = await User.find({});
        return res.status(200).json({
            success: true,
            count: users.length,
            users
        });
        
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Something went wrong",
            error: err.message
        });
    }
});

// Create user
app.post("/users", async (req, res) => {
    const { firstname, email, gender, lastname, jobtitle } = req.body;
    try {
        if (!firstname || !email || !gender) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }

        const user = await User.create({
            firstname,
            lastname,
            email,
            gender,
            jobtitle
        });

        res.status(201).json({
            success: true,
            message: "User created successfully",
            user
        });

    } catch (err) {
        if (err.code === 11000) {
            return res.status(400).json({
                success: false,
                message: "Email already exists"
            });
        }
        res.status(500).json({
            success: false,
            message: "Something went wrong",
            error: err.message
        });
    }
});

// Get user by id
app.get("/users/:id", async (req,res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }
        res.status(200).json({
            success: true,
            message: "User Found",
            user
        });

    } catch (err) {
        res.status(500).json({
            success: false,
            message: "something went wrong",
            error: err.message
        });
    }
});

// Update user
app.patch("/users/:id", async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(
            req.params.id,
            { lastname: "CHANGED AGAIN" },
            { new: true }
        );
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }
        res.status(200).json({
            success: true,
            message: "User Updated",
            user
        });

    } catch (err) {
        res.status(500).json({
            success: false,
            message: "something went wrong",
            error: err.message
        });
    }
});

// Delete user
app.delete("/users/:id", async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }
        res.status(200).json({
            success: true,
            message: "User Deleted",
            user
        });

    } catch (err) {
        res.status(500).json({
            success: false,
            message: "something went wrong",
            error: err.message
        });
    }
});

app.listen(PORT, () => console.log("Server Started"));
