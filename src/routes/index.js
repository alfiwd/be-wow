// Instantiate express module
const express = require("express");

// Init express router
const router = express.Router();

// Get controller
const { register, login } = require("../controllers/auth");

// Router register
router.post("/register", register);

// Router login
router.post("/login", login);

// Export module router
module.exports = router;
