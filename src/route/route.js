const express = require('express');
const router = express.Router();
const userController = require('../controller/userController');

//====================================================APIs=================================================================================
router.post('/register', userController.createUser)
router.post('/login', userController.userLogin)

module.exports = router;