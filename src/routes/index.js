// Instantiate express module
const express = require("express");

// Init express router
const router = express.Router();

// Get controller
const { register, login } = require("../controllers/auth");
const { users, deleteUser } = require("../controllers/users");

// Router register
router.post("/register", register);

// Router login
router.post("/login", login);

// Route user
router.get("/users", users);
router.delete("/user/:id", deleteUser);

// Export module router
module.exports = router;
