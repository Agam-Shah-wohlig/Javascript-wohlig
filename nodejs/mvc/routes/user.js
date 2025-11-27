const express = require("express")
const router = express.Router();

const {
    handleGetAllUsers, 
    handleCreateUser,
    getUserById,
    updateUserById,
    deleteUserById } = require("../controllers/user");


// Get all users and create user
router.route("/")
.get(handleGetAllUsers)
.post(handleCreateUser);


// Get user by id, update user by id, delete user by id
router.route("/:id")
.get(getUserById)
.patch(updateUserById)
.delete(deleteUserById);

module.exports = router;