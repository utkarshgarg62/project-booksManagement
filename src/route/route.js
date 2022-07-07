const express = require('express');
const router = express.Router();
const userController = require('../controller/userController');
const bookController = require('../controller/bookController');

//====================================================APIs=================================================================================
router.post('/register', userController.createUser)
router.post('/login', userController.userLogin)
router.post("/books",bookController.createBook)
router.get("/books",bookController.getBooksData)
router.get("/books/:bookId",bookController.getBooksDataById)
router.delete("/books/:bookId", bookController.deleteBookId)
router.put("/books/:bookId", bookController.updatedBook)







module.exports = router;