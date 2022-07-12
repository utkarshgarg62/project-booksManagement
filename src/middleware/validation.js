const mongoose = require("mongoose")


//Value Validation
const isValid = function(value){
    if(typeof value ==='undefined' || value ===null)  return false
    if(typeof value ==='string' && value.trim().length ===0)return false
    return true
}

//String Validation
const isValidString = function(value){
    if(typeof value ==='string' && value.trim().length ===0)return false
    return true
}

//Name Validation
const isValidName =function(name){
    const  nameRegex =/^[a-zA-Z ]{2,30}$/
    return nameRegex.test(name)
}

//Title Validation
const isValidTitle =function(title){
    return ["Mr", "Mrs", "Miss"].indexOf(title) !== -1
}

//Mobile Validation
const isValidMobile = function (mobile) {
    var re = /^((\+91)?|91)?[6789][0-9]{9}$/;
    return re.test(mobile);
}

//Email Validation
const isValidEmail = function(email){
    const emailRegex = /^[a-z0-9][a-z0-9-_\.]+@([a-z]|[a-z0-9]?[a-z0-9-]+[a-z0-9])\.[a-z0-9]{2,10}(?:\.[a-z]{2,10})?$/
    return emailRegex.test(email)
}

//Password Validation
const isValidPassword = function(password){
    const passRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,15}$/
    return passRegex.test(password)
}

//ObjectId Validation
const  isValidObjectId =function(id){
    var ObjectId = mongoose.Types.ObjectId;
    return ObjectId.isValid(id)
}

//ISBN Validation
const isValidISBN =function(ISBN){
    const  dateRegex =/^\+?([1-9]{3})\)?[-. ]?([0-9]{10})$/
    return dateRegex.test(ISBN)
}

//Date Validation
const isValidDate =function(date){
    const  dateRegex = /([12]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01]))/;
    return dateRegex.test(date)
}

//Rating Validation
const isValidRating = function isInteger(value) {
    return value % 1 == 0;
}

module.exports = { 
    isValidName,
    isValidString, 
    isValidTitle,
    isValidMobile,
    isValidISBN, 
    isValidEmail, 
    isValidPassword, 
    isValidObjectId, 
    isValid,
    isValidDate,
    isValidRating
}
