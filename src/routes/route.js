const express = require('express');
const router = express.Router();
const userController = require("../controllers/userController.js");
const bookController = require("../controllers/bookController.js");
const reviewCrontroller = require("../controllers/reviewController.js");
const middleware = require("../middlewares/middleware.js");


//user API's
router.post("/register", userController.createUser);   // CreateUser
// router.post("/login", userController.login);   // LoginUser


//book API's
router.post("/books", bookController.createBook);   // CreateBook
router.get("/books", bookController.getBooks);   //GetBooks
router.get("/books/:bookId", bookController.getBooksById);   //GetBooksbyID
router.put("/books/:userId/:bookId", bookController.updateBooks);   //UpdateBooks
router.delete("/books/:userId/:bookId", bookController.deleteBooks);   //DeleteBooksbyID


//Review API's
router.post("/books/:bookId/review", reviewCrontroller.createReview);   //CreateReview
router.put("/books/:bookId/review/:reviewId", reviewCrontroller.updateReview);   //UpdateReview
router.delete("/books/:bookId/review/:reviewId", reviewCrontroller.deleteReview);   //DeleteReview


module.exports = router;
