const User = require("../models/user");

async function handleGetAllUsers(req, res) {
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
};

async function handleCreateUser(req, res) {
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
};

async function getUserById(req, res) {
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
};

async function updateUserById(req, res){
    try {
        const user = await User.findByIdAndUpdate(
            req.params.id,
            { lastname: "CHANGED to Shah" },
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
};

async function deleteUserById(req, res){
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
};

module.exports = {
    handleGetAllUsers,
    handleCreateUser,
    getUserById,
    updateUserById,
    deleteUserById
};