const express = require('express');
const router = express.Router();
const userController = require("../controllers/userController.js");
const bookController = require("../controllers/bookController.js");
const reviewCrontroller = require("../controllers/reviewController.js");
const middleware = require("../middlewares/middleware.js");


//user API's
router.post("/register", userController.createUser);   // CreateUser
router.post("/login", userController.login);   // LoginUser


//book API's
router.post("/books", middleware.authorizationToCreate, bookController.createBook);   // CreateBook
router.get("/books", middleware.authentication, bookController.getBooks);   //GetBooks
router.get("/books/:bookId", middleware.authorization, bookController.getBooksById);   //GetBooksbyID
router.put("/books/:bookId", middleware.authorization, bookController.updateBooks);   //UpdateBooks
router.delete("/books/:bookId", middleware.authorization, bookController.deleteBooks);   //DeleteBooksbyID


//Review API's
router.post("/books/:bookId/review", /*middleware.authorization,*/ reviewCrontroller.createReview);   //CreateReview
router.put("/books/:bookId/review/:reviewId", /*middleware.authorization,*/ reviewCrontroller.updateReview);   //UpdateReview
router.delete("/books/:bookId/review/:reviewId", /*middleware.authorization,*/ reviewCrontroller.deleteReview);   //DeleteReview


module.exports = router;
