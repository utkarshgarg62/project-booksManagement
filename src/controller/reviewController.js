const reviewModel = require("../models/reviewModel")
const bookModel = require("../models/bookModel")

const { isValid, isValidObjectId, isValidReviewed, isValidName, isValidRating } = require("../middleware/validation");

//====================================================[Create Review Api]========================================================================

const createReview = async function (req, res) {
    try {
        let data = req.body
        let Id = req.params.bookId
        let { rating, reviewedBy, review } = data

        if (Object.keys(data).length < 1) {
            return res.status(400).send({status: false, message: "Insert Review Data : BAD REQUEST" })
        }
        if (!isValidObjectId(Id)) {
            return res.status(400).send({status: false, message: "Please provide valid bookId" })
        }

        let validBookId = await bookModel.findById({ _id: Id })
        if (!validBookId) {
            return res.status(404).send({ status: false, message: "Book doesn't exist" })
        }
        if(validBookId.isDeleted==true){
            return res.status(404).send({ status: false, message: "Cannot add review, Book has been already deleted" })
        }
        data.bookId=validBookId._id

        if (!isValid(reviewedBy)) {
            return res.status(400).send({status: false, message: "Enter a reviewer's name" })
        }
        if (!isValidName(reviewedBy)) {
            return res.status(400).send({status: false, message: "please enter valid name in reviewedBy : eg- John Doe" });
        }

        if (!rating) {
            return res.status(400).send({ status: false, message: 'please provide rating' })
        }
        if (!isValidRating(rating)) {
            return res.status(400).send({ status: false, message: 'Rating must be 1,2,3,4 or 5 not a character' })
        }
        if ((rating < 1 || rating > 5)) {
            return res.status(400).send({ status: false, message: "Rating should be in range of number 1 to 5" })
        }

        if (!isValid(review)) {
            return res.status(400).send({ status: false,message: "Please Provide a review" })
        }

        data.reviewedAt = new Date()
        let saveReview = await reviewModel.create(data)
        // increase the reviews count in same book
        if(saveReview) await bookModel.findOneAndUpdate({ _id: Id }, { $inc: { reviews: +1 } })
        let response = await reviewModel.findOne({ _id: saveReview._id }).select({
            __v: 0,
            createdAt: 0,
            updatedAt: 0,
            isDeleted: 0
        })

        return res.status(201).send({ status: true, message: "Success", data: response })

    }
    catch (err) {
        res.status(500).send({ status: false, message: err })
    }
};

//====================================================[Update Review API By reviewId]============================================================


const updatedReview = async function (req, res) {
    
    try {
        let data = req.body;
        if (Object.keys(data).length === 0) return res.status(400).send({ status: false, message: "Bad Request" });
        let reviewId = req.params.reviewId;
        let reviewToBeUpdted = await reviewModel.findOne({ _id: reviewId, isDeleted: false })
        if (Object.keys(reviewToBeUpdted).length === 0) {
            return res.status(404).send({ status: false, message: "review does not exist" })
        }

        let updatedReview = await reviewModel.findOneAndUpdate({ _id: reviewId }, { $set: data }, { new: true })
        res.status(201).send({ status: true, data: updatedReview })
        
    } catch (error) {
        res.status(500).send({ status: false, message: error.message })
    }
    
}



//================================================[Delete Review API By reviewId]================================================================

const deleteReview = async function (req, res) {
    try {
        let reviewId = req.params.reviewId;
        let BookId = req.params.BookId
        if (!BookId) { return res.status(400).send({ status: false, message: "BookId is required" }) }
        if (!reviewId) {
            return res.status(400).send({ status: false, message: "reviewId is required" })
        }
        let review = await reviewModel.findById(reviewId);
        if (!review) { return res.status(404).send({ status: "false", message: "No such review exists " }); }
        let books = await bookModel.findById(BookId);
        if (!books)
        return res.status(404).send({ status: false, message: "No such book found" });
        
        if (books.isDeleted || review.isDeleted)
        return res.status(404).send({ status: false, message: " Already deleted, book Or review does not exist" });
        
        let timeStamps = new Date();
        await reviewModel.findOneAndUpdate({ _id: reviewId, BookId }, { $set: { isDeleted: true, deletedAt: timeStamps, } }, { new: true });
        res.status(200).send({ status: true, message: "review is deleted successfully" });
        
    } catch (err) {
        res.status(500).send({ status: false, error: err.message });
    }
}


//================================================[Exporting Functions]================================================================


module.exports.createReview = createReview
module.exports.updatedReview = updatedReview
module.exports.deleteReview = deleteReview