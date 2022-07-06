const express = require('express');
const router = express.Router();
const userController = require('../controller/userController');
const bookController = require('../controller/bookController');

//====================================================APIs=================================================================================
router.post('/register', userController.createUser)
router.post('/login', userController.userLogin)
router.post("/books",bookController.createBook)


module.exports = router;