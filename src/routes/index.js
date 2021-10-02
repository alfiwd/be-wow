// Instantiate express module
const express = require("express");

// Init express router
const router = express.Router();

// Get controller
const { register, login } = require("../controllers/auth");
const { users, deleteUser } = require("../controllers/user");
const { books, book, addBook, editBook, deleteBook } = require("../controllers/book");
const { addTransaction, editTransaction, transaction, transactions } = require("../controllers/transaction");

// Router middlewares
const { auth } = require("../../middlewares/auth");
const { uploadFile } = require("../../middlewares/uploadFile");

// Router register
router.post("/register", register);

// Router login
router.post("/login", login);

// Route user
router.get("/users", users);
router.delete("/user/:id", deleteUser);

// Route book
router.get("/books", books);
router.get("/book/:id", book);
router.post("/book", auth, uploadFile("book_file"), addBook);
router.put("/book/:id", auth, uploadFile("book_file"), editBook);
router.delete("/book/:id", auth, deleteBook);

// Route transaction
router.post("/transaction", auth, uploadFile("transfer_proof"), addTransaction);
router.put("/transaction/:id", auth, uploadFile("transfer_proof"), editTransaction);
router.get("/transaction/:id", transaction);
router.get("/transactions", transactions);

// Export module router
module.exports = router;
