const reviewModel = require("../models/reviewModel")


//====================================================[Create Revirw Api]========================================================================


const createReview = async function (req, res) {
    try {
        let data=req.body
        let {} = data;

        let savedData = await reviewModel.create(data);
        res.status(201).send({ status:true, message: "Success", data: savedData });
    }
    catch (err) {
        res.status(500).send({  status: false,  message: err })
    }
};
module.exports.createReview = createReview


//============================================[Update Review API By reviewId]======================================================================


const updatedReview = async function (req, res) {

    try {

        
    } catch (error) {
        res.status(500).send({ status: false, msg: error.message })
    }
    
}

module.exports.updatedReview = updatedReview


//============================================[Delete Review API By reviewId]======================================================================

const deleteReview = async function (req, res) {

    try {

        
    } catch (error) {
        res.status(500).send({ status: false, msg: error.message })
    }
    
}

module.exports.deleteReview = deleteReview
