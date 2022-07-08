const reviewModel = require("../models/reviewModel")
const { isValid, isValidObjectId, isValidReviewed } = require("../middleware/validation");

//====================================================[Create Review Api]========================================================================

const createReview = async function (req, res) {
    try {
        let data = req.body
        let Id = req.params.bookId
        const { bookId, rating, reviewedBy, review } = data

        if (Object.keys(data).length < 1) {
            return res.status(400).send({ msg: "Insert Review Data : BAD REQUEST" })
        }
        if (!isValidObjectId(Id)) {
            return res.status(400).send({ msg: "Pleage provide valid bookId" })
        }

        if (!isValidObjectId(bookId)) {
            return res.status(400).send({ msg: "BookId not valid book Id" })
        }

        // check that both are same or not
        if (Id != bookId) {
            return res.status(400).send({ status: false, messaage: "Book ID not same" })
        }
        let validBookId = await bookModel.findOne({ _id: Id, isDeleted: false })
        if (!validBookId) {
            return res.status(404).send({ status: false, messaage: "Book doesn't exist" })
        }

        if (!isValid(reviewedBy)) {
            return res.status(400).send({ msg: "Enter a reviewer's name" })
        }
        if (!isValidReviewed(reviewedBy)) {
            return res.status(400).send({ message: "please enter the reviewedBy in right format" });
        }

        if (!rating) {
            return res.status(400).send({ status: false, msg: 'please provide rating' })
        }
        if ((rating < 1 || rating > 5)) {
            return res.status(400).send({ status: false, message: "Rating should be in range of number 1 to 5" })
        }

        data.reviewedAt = new Date()
        let reviews = await reviewModel.create(data)
        // increase the reviews count in same book
        let updateBook = await bookModel.findOneAndUpdate({ _id: Id }, { $inc: { reviews: +1 } }, { new: true })
        return res.status(201).send({ status: true, message: "success", bookWithReview: updatedBook, reviewData: reviews })

    }
    catch (err) {
        res.status(500).send({ status: false, message: err })
    }
};
module.exports.createReview = createReview

//====================================================[Update Review API By reviewId]============================================================


const updatedReview = async function (req, res) {

    try {
        let data = req.body;
        if (Object.keys(data).length === 0) return res.status(400).send({ status: false, msg: "Bad Request" });
        let reviewId = req.params.reviewId;
        let reviewToBeUpdted = await reviewModel.findOne({ _id: reviewId, isDeleted: false })
        if (Object.keys(reviewToBeUpdted).length === 0) {
            return res.status(404).send({ status: false, msg: "review does not exist" })
        }

        let updatedReview = await reviewModel.findOneAndUpdate({ _id: reviewId }, { $set: data }, { new: true })
        res.status(201).send({ status: true, data: updatedReview })

    } catch (error) {
        res.status(500).send({ status: false, msg: error.message })
    }

}

module.exports.updatedReview = updatedReview


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
module.exports.deleteReview = deleteReview