const jwt = require("jsonwebtoken");
const bookModel = require("../models/bookModel");
const userModel = require("../models/userModel");


//=====================================================Authentication========================================================================


const authenticate = function (req, res, next) {
    try {
        let token = req.headers["x-api-key"];
        if (!token) return res.status(400).send({ status: false, msg: "token must be present" });
        let decodedToken = jwt.verify(token, "group-25", 
        
        function(err,decodedToken){
            if(err)
            return res.status(401).send({status:false,message:"Token is NOT Valid"})
            next()
        } );

    } catch (error) {
        res.status(500).send({ msg: error.message })
    }
}


//====================================================Authorization========================================================================



const newAuth = async function (req, res, next) {
   
    try {
      
        
    }
    catch (error) {
        res.status(500).send(error.message)
    }
}


module.exports.authenticate = authenticate
module.exports.newAuth=newAuth

