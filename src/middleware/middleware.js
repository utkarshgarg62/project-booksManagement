const jwt = require("jsonwebtoken");



//=====================================================Authentication========================================================================


const authenticate = function (req, res, next) {
    try {
        let token = req.headers["x-api-key"];
        if(!token) token = req.headers["X-Api-Key"]
        if (!token) return res.status(400).send({ status: false, msg: "token must be present" });
        let decodedToken = jwt.verify(token, "bookManagement35");
        if(!decodedToken) return res.status(400).send({status:false,message:"Invalid Token"})

        // ===========Authorization
        req.userId=decodedToken.userId
        next()

    } catch (error) {
        res.status(500).send({ msg: error.message })
    }
}


//====================================================Authorization========================================================================



const authorization = async function (req, res, next) {
   
    try {

        

        next();
    }
    catch (error) {
        res.status(500).send(error.message)
    }
}


module.exports.authenticate = authenticate
module.exports.authorization = authorization

