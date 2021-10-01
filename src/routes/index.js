// Instantiate express module
const express = require("express");

// Init express router
const router = express.Router();

// Get controller
const { login } = require("../controllers/auth");

// Router login
router.post("/login", login);

// Export module router
module.exports = router;
