const reviewModel = require("../models/reviewModel")
const { isValid, isValidObjectId, } = require("../middleware/validation");

//====================================================[Create Revirw Api]========================================================================


const createReview = async function (req, res) {
    try {
        let data=req.body
        let {bookId,reviewedBy, } = data;

        if (Object.keys(data).length < 1) {
            return res.status(400).send({ msg: "Insert Review Data : BAD REQUEST" })
        }
        if (!isValid(bookId)) {
            return res.status(400).send({ msg: "Enter a book Id" })
        }

        if (!isValidObjectId(bookId)) {
            return res.status(400).send({ msg: "Enter Valid book Id" })
        }

        if (!isValid(reviewedBy)) {
            return res.status(400).send({ msg: "Enter a reviewer's name" })
        }
        if(!isValidName(reviewedBy)){
            return res.status(400).send({message: "Enter valid reviewer's name"});
        }

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
        let  data= req.body;
        if (Object.keys(data).length === 0) return res.status(400).send({ status: false, msg: "Bad Request" });
        let reviewId = req.params.reviewId;
        let reviewToBeUpdted = await reviewModel.findOne({ _id: reviewId, isDeleted: false })
        if (Object.keys(reviewToBeUpdted).length === 0) {
        return res.status(404).send({ status: false, msg: "review does not exist" })}
        
        let updatedReview= await reviewModel.findOneAndUpdate({ _id:reviewId }, { $set: data }, { new: true })
        res.status(201).send({ status: true, data: updatedReview })

        
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
