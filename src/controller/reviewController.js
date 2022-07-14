const reviewModel = require("../models/reviewModel")
const bookModel = require("../models/bookModel")

const {  isValidObjectId, isValidName, isValidRating, isValidString } = require("../middleware/validation");

//====================================================[Create Review Api]========================================================================

const createReview = async function (req, res) {
    try {
        let data = req.body
        let Id = req.params.bookId
        let { rating, reviewedBy } = data

        if (Object.keys(data).length < 1) {
            return res.status(400).send({ status: false, message: "Insert Review Data : BAD REQUEST" })
        }
        if (!isValidObjectId(Id)) {
            return res.status(400).send({ status: false, message: "Please provide valid bookId" })
        }

        let validBookId = await bookModel.findById({ _id: Id })
        if (!validBookId) {
            return res.status(404).send({ status: false, message: "Book doesn't exist" })
        }
        if (validBookId.isDeleted == true) {
            return res.status(404).send({ status: false, message: "Cannot add review, Book has been already deleted" })
        }
        data.bookId = validBookId._id

        //------------ Validation reviewedBy

        if (!isValidName(reviewedBy)) {
            return res.status(400).send({ status: false, message: "please enter valid name in reviewedBy : eg- John Doe" });
        }

        //------------ Validation rating

        if (!rating) {
            return res.status(400).send({ status: false, message: 'please provide rating' })
        }
        if (!isValidRating(rating)) {
            return res.status(400).send({ status: false, message: 'Rating must be 1,2,3,4 or 5 not a character' })
        }
        if ((rating < 1 || rating > 5)) {
            return res.status(400).send({ status: false, message: "Rating should be in range of number 1 to 5" })
        }

        //************************************* DB CALL FOR CREATING *************************************************/
        
        data.reviewedAt = new Date()
        let saveReview = await reviewModel.create(data)
        // increase the reviews count in same book
        if (saveReview) await bookModel.findOneAndUpdate({ _id: Id }, { $inc: { reviews: +1 } })
        let getBookData = await bookModel .findOne({_id:saveReview.bookId,isDeleted:false})
        let response = await reviewModel.findOne({ _id: saveReview._id })

        let reviewObj = getBookData.toObject()
        if (response) {
            reviewObj['reviewsData'] = response
        }

        return res.status(201).send({ status: true, message: "Success", data: reviewObj })

    }
    catch (err) {
        res.status(500).send({ status: false, message: err })
    }
};

//====================================================[Update Review API By reviewId]============================================================


const updatedReview = async function (req, res) {

    try {
        let data = req.body;
        let { review, rating, reviewedBy } = data;
        if (Object.keys(data).length === 0) return res.status(400).send({ status: false, message: "Insert Review Data : BAD REQUEST" });

        //************************************* BOOK ID *************************************************/

        let bookId = req.params.bookId;
        if (!bookId) return res.status(404).send({ status: false, message: "Please enter bookId" })
        if (!isValidObjectId(bookId)) {
            return res.status(400).send({ status: false, message: "Invalid bookId in path params" })
        }
        let checkBookId = await bookModel.findOne({ _id: bookId, isDeleted: false })
        if (!checkBookId) {
            return res.status(404).send({ status: false, message: "Book does not exist or deleted" })
        }

        //************************************* REVIEW ID *************************************************/

        let reviewId = req.params.reviewId;
        if (!reviewId) return res.status(404).send({ status: false, message: "Please enter reviewId" })
        if (!isValidObjectId(reviewId)) {
            return res.status(400).send({ status: false, message: "Invalid reviewId in path params" })
        }
        let checkreviewId = await reviewModel.findOne({ _id: reviewId, isDeleted: false })
        if (!checkreviewId) {
            return res.status(404).send({ status: false, message: "Review does not exist or deleted" })
        }

        //************************************* VALIDATING *************************************************/

        if(review){
            if (!isValidString(review)) {
                return res.status(400).send({ status: false, message: "Review is missing ! " })
            }
        }

        if(rating){
            if (!isValidRating(rating)) {
                return res.status(400).send({ status: false, message: 'Rating must be 1,2,3,4 or 5 not a character' })
            }
            if (!(rating >=1 || rating <=5)) {
                return res.status(400).send({ status: false, message: "Rating should be in range of number 1 to 5" })
            }
        }
 
        if(reviewedBy){
            if (!isValidName(reviewedBy)) {
                return res.status(400).send({ status: false, message: "please enter valid name in reviewedBy : eg- John Doe" });
            }
            if (!isValidString(reviewedBy)) {
                return res.status(400).send({ status: false, message: "ReviewedBy is missing !" })
            }
        }

        //************************************* DB CALL FOR UPDATING ****************************************/


        let updatedReview = await reviewModel.findOneAndUpdate({ _id: reviewId }, 
            {   review: review, 
                rating: rating, 
                reviewedBy: reviewedBy 
            },
            { new: true })

        let reviewObj = checkBookId.toObject()
        if (updatedReview) {
            reviewObj['reviewsData'] = updatedReview
        }


        res.status(200).send({ status: true, data: reviewObj })

    } catch (err) {
        res.status(500).send({ status: false, message: err })
    }

}


//================================================[Delete Review API By reviewId]================================================================

const deleteReview = async function (req, res) {
    try {

        let reviewId = req.params.reviewId;
        let bookId = req.params.bookId

        //************************************* BOOK ID *************************************************/

        if (!isValidObjectId(bookId)) { return res.status(400).send({ status: false, message: "bookId is not a valid object Id" }) }
        let book = await bookModel.findOne({ _id: bookId, isDeleted: false })
        if (!book) {
            return res.status(404).send({ status: false, message: 'Book does not exist or deleted' })
        }

        //************************************* REVIEW ID *************************************************/

        if (!isValidObjectId(reviewId)) { return res.status(400).send({ status: false, message: "reviewId is not a valid object Id" }) }
        let review = await reviewModel.findOne({ _id: reviewId, bookId: bookId, isDeleted: false })
        if (!review) {
            return res.status(404).send({ status: false, message: 'Review does not exist or delete for given bookId' })
        }

        //************************************* DB CALL FOR UPDATING ****************************************/

        // set the isDeleted property of review to true 
        let deletedReview = await reviewModel.findOneAndUpdate({ _id: reviewId, bookId: bookId }, { isDeleted: true }, { new: true })

        // decrease the review count in the book
        let decreaseCount = await bookModel.findOneAndUpdate({ _id: bookId, reviews: { $gt: 0 } }, { $inc: { reviews: -1 } })

        return res.status(200).send({ status: true, message: 'Review Deleted Successfully' })

    } catch (err) {
        res.status(500).send({ status: false, error: err.message });
    }
}

//================================================[Exporting Functions]================================================================


module.exports.createReview = createReview
module.exports.updatedReview = updatedReview
module.exports.deleteReview = deleteReview