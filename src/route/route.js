const express = require('express');
const router = express.Router();
const userController = require('../controller/userController');
const bookController = require('../controller/bookController');
const reviewController = require('../controller/reviewController');


//====================================================APIs=================================================================================


//---------------- USER API'S ----------------------
router.post('/register', userController.createUser)
router.post('/login', userController.userLogin)

//---------------- BOOK API'S ----------------------
router.post("/books",bookController.createBook)
router.get("/books",bookController.getBooksData)
router.get("/books/:bookId",bookController.getBooksDataById)
router.delete("/books/:bookId", bookController.deleteBookId)
router.put("/books/:bookId", bookController.updatedBook)

//---------------- REVIEW API'S ----------------------
router.post("/books",reviewController.createReview)
router.put("/books",reviewController.updatedReview)
router.delete("/books",reviewController.deleteReview)



module.exports = router;