const express = require('express');
const router = express.Router();
const userController = require('../controller/userController');
const bookController = require('../controller/bookController');
const reviewController = require('../controller/reviewController');
const middleware=require("../middleware/middleware")

//====================================================APIs=================================================================================

//---------------- USER API'S ----------------------
router.post('/register', userController.createUser)
router.post('/login', userController.userLogin)

//---------------- BOOK API'S ----------------------
router.post("/books", middleware.authenticate, middleware.authorization, bookController.createBook)
router.get("/books", middleware.authenticate, bookController.getBooksData)
router.get("/books/:bookId", middleware.authenticate, bookController.getBooksDataById)
router.put("/books/:bookId", middleware.authenticate, middleware.authorization, bookController.updatedBook)
router.delete("/books/:bookId", middleware.authenticate, middleware.authorization, bookController.deleteBookId)

//---------------- REVIEW API'S ----------------------
router.post("/books/:bookId/review",reviewController.createReview)
router.put("/books/:bookId/review/:reviewId",reviewController.updatedReview)
router.delete("/books/:bookId/review/:reviewId",reviewController.deleteReview)


module.exports = router;