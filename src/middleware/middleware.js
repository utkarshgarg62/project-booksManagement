const jwt = require("jsonwebtoken");
const bookModel = require("../models/bookModel");
const {isValidObjectId}=require("../middleware/validation")

//=====================================================Authentication========================================================================


const authenticate = function (req, res, next) {
    try {
        let token = req.headers["x-api-key"] || req.headers["X-Api-Key"]
        if (!token) return res.status(400).send({ status: false, msg: "token must be present" });
        let decodedToken = jwt.verify(token, "bookManagement35");
        if(!decodedToken) return res.status(400).send({status:false,message:"Invalid Token"})
        req.userLoggedIn=decodedToken.userId
        next()

    } catch (error) {
        res.status(500).send({status:false, message: error.message })
    }
}



//====================================================Authorization========================================================================



const authorization = async function (req, res, next) {
   
    try {
        let userLoggedIn=req.userLoggedIn
        let fromParamsBookId = req.params.bookId   
        let fromBodyUserId = req.body.userId

        if (fromParamsBookId) {
            if(!isValidObjectId(fromParamsBookId)) return res.status(400).send({status:false,msg:"enter valid bookId"})
            let BookData = await bookModel.findById(fromParamsBookId)
            if (!BookData) {return res.status(404).send({ status: false, msg: "No Book Exists" })}
            let BookUserId=BookData.userId
            if (BookUserId != userLoggedIn) {
                return res.status(403).send({ status: false, msg: "User logged is not allowed to change data of another user " })}
        }

        if (fromBodyUserId) {
            if(!isValidObjectId(fromBodyUserId)) return res.status(400).send({status:false,msg:"enter valid userId"})
            if (fromBodyUserId != userLoggedIn) {
                return res.status(403).send({ status: false, msg: "User logged is not allowed to change data of another user " })}
        } 

        next();
    }
    catch (error) {
        res.status(500).send({status:false, message: error.message })
    }
}


module.exports.authenticate = authenticate
module.exports.authorization = authorization