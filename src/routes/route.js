const express = require('express');
const router = express.Router();
const userController = require("../controllers/userController.js");
const bookController = require("../controllers/bookController.js");
const reviewCrontroller = require("../controllers/reviewController.js");
const middleware = require("../middlewares/middleware.js");


//user API's
router.post("/register", userController.createUser);   //CreateUser
router.post("/login", userController.login);   //LoginUser


//book API's
router.post("/books", middleware.userAuth, bookController.createBook);    // CreateBook
router.get("/books", middleware.userAuth, bookController.getAllBooks);      //GetAllBooks
router.get("/books/:bookId", middleware.userAuth, bookController.getBooksById);     //GetBooksbyID
router.put("/books/:bookId", middleware.userAuth, bookController.updateBooks);    //UpdateBooks
router.delete("/books/:bookId", middleware.userAuth, bookController.deleteBooks);   //DeleteBooksbyID


//Review API's
router.post("/books/:bookId/review", /*middleware.userAuth,*/ reviewCrontroller.createReview);   //CreateReview
router.put("/books/:bookId/review/:reviewId", /*middleware.userAuth,*/ reviewCrontroller.updateReview);   //UpdateReview
router.delete("/books/:bookId/review/:reviewId", /*middleware.userAuth,*/ reviewCrontroller.deleteReview);   //DeleteReview


module.exports = router;
