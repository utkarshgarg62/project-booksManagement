const {validator, jwt} = require('../utils')
const {systemConfig} = require('../configs')
const {UserModel} = require('../models')

const register = async function (req, res) {
    try {
        const requestBody = req.body;
        if(!validator.isValidRequestBody(requestBody)) {
            return res.status(400).send({status: false, message: 'Invalid request parameters. Please provide user details'})
        }

        // Extract params
        const {title, name, phone, email, password, address} = requestBody; // Object destructing

        // Validation starts
        if(!validator.isValid(title)) {
            return res.status(400).send({status: false, message: 'Title is required'})
        }
        
        if(!validator.isValidTitle(title)) {
            return res.status(400).send({status: false, message: `Title should be among ${systemConfig.titleEnumArray.join(', ')}`})
        }

        if(!validator.isValid(name)) {
            return res.status(400).send({status: false, message: ' Name is required'})
        }

        if(!validator.isValid(phone)) {
            return res.status(400).send({status: false, message: 'Phone number is required'})
        }
        
        if(!validator.isValidNumber(phone)) {
            return res.status(400).send({status: false, message: 'Phone number should be a valid number'})
        }

        if(!validator.isValid(email)) {
            return res.status(400).send({status: false, message: `Email is required`})
        }
        
        if(!validator.validateEmail(email)) {
            return res.status(400).send({status: false, message: `Email should be a valid email address`})
        }

        if(!validator.isValid(password)) {
            return res.status(400).send({status: false, message: `Password is required`})
        }
        
        if(!validator.isValidLength(password, 8, 15)) {
            return res.status(400).send({status: false, message: `Password lenght must be between 8 to 15 char long`})
        }
        
        const isPhoneAlreadyUsed = await UserModel.findOne({phone}); // {email: email} object shorthand property

        if(isPhoneAlreadyUsed) {
            return res.status(400).send({status: false, message: `${phone} phone number is already registered`})
        }
        
        const isEmailAlreadyUsed = await UserModel.findOne({email}); // {email: email} object shorthand property

        if(isEmailAlreadyUsed) {
            return res.status(400).send({status: false, message: `${email} email address is already registered`})
        }
        // Validation ends

        const userData = {title, name, phone, email, password, address}
        const newUser = await UserModel.create(userData);

        return res.status(201).send({status: true, message: `User created successfully`, data: newUser});
    } catch (error) {
        return res.status(500).send({status: false, message: error.message});
    }
}

const login = async function (req, res) {
    try {
        const requestBody = req.body;
        if(!validator.isValidRequestBody(requestBody)) {
            return res.status(400).send({status: false, message: 'Invalid request parameters. Please provide login details'})
            return
        }

        // Extract params
        const {email, password} = requestBody;
        
        // Validation starts
        if(!validator.isValid(email)) {
            return res.status(400).send({status: false, message: `Email is required`})
        }
        
        if(!validator.validateEmail(email)) {
            return res.status(400).send({status: false, message: `Email should be a valid email address`})
        }

        if(!validator.isValid(password)) {
            return res.status(400).send({status: false, message: `Password is required`})
        }
        // Validation ends

        const user = await UserModel.findOne({email, password});

        if(!user) {
            return res.status(401).send({status: false, message: `Invalid login credentials`});
        }

        const token = await jwt.createToken({userId: user._id});

        return res.status(200).send({status: true, message: `User login successfull`, data: {token}});
    } catch (error) {
        return res.status(500).send({status: false, message: error.message});
    }
}

module.exports = {
    register,
    login
}