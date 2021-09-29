// Instantiate express module
const express = require("express");

// Init express router
const router = express.Router();

// Get controller
const { getTodos, getTodo, addTodo, updateTodo, deleteTodo } = require("../controllers/todo");

// Create route
router.get("/todos", getTodos);
router.get("/todo/:id", getTodo);
router.post("/todo", addTodo);
router.patch("/todo/:id", updateTodo);
router.delete("/todo/:id", deleteTodo);

// Export module router
module.exports = router;
