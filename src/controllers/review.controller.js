const moment = require('moment')

const {BookModel, ReviewModel, UserModel} = require('../models')
const {validator} = require('../utils')

const addReview = async function (req, res) {
    try {
        const requestBody = req.body
        const params = req.params
        const bookId = params.bookId

        if (!validator.isValidRequestBody(requestBody)) {
            return res.status(400).send({ status: false, message: 'Invalid params received in request body' })
        }

        if(!validator.isValidObjectId(bookId)) {
            return res.status(400).send({ status: false, message: `${bookId} is an invalid book id` })
        }

        const book = await BookModel.findOne({_id: bookId, isDeleted: false})

        if(!book) return res.status(404).send({status: false, message: `Book does not exist`})

        const { review, rating, reviewedBy, reviewedAt } = requestBody;
        
        if(!validator.isValid(rating)) {
            return res.status(400).send({ status: false, message: 'Rating is required' })
        }
        
        if (!validator.isValidNumber(rating) || !validator.isInValidRange(rating, 1, 5)) {
            return res.status(400).send({ status: false, message: 'Rating should be a valid number between 1 to 5' })
        }

        if(!validator.isValid(reviewedAt)) {
            return res.status(400).send({ status: false, message: `Review date is required`})
        }

        if(!validator.isValidDate(reviewedAt)) {
            return res.status(400).send({ status: false, message: `${reviewedAt} is an invalid date`})
        }

        const newReview = await ReviewModel.create({
            bookId,
            rating,
            review,
            reviewedBy,
            reviewedAt: moment(reviewedAt).toISOString()
        });

        book.reviews = book.reviews + 1
        await book.save()

        const data = book.toObject()
        data['reviewsData'] = newReview

        return res.status(201).send({ status: true, message: `Reviewd added successfully`, data: data });
    } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
    }
}

const updateReview = async function (req, res) {
    try {
        const requestBody = req.body
        const params = req.params
        const bookId = params.bookId
        const reviewId = params.reviewId

        // Validation stats
        if (!validator.isValidObjectId(bookId)) {
            return res.status(400).send({ status: false, message: `${bookId} is not a valid book id` })
        }

        const book = await BookModel.findOne({ _id: bookId, isDeleted: false })

        if (!book) {
            return res.status(404).send({ status: false, message: `Book not found` })
        }

        if (!validator.isValidObjectId(reviewId)) {
            return res.status(400).send({ status: false, message: `${reviewId} is not a valid review id` })
        }

        const reviewExist = await ReviewModel.findOne({ _id: reviewId, bookId: bookId, isDeleted: false})

        if(!reviewExist) return res.status(404).send({status: false, message: `Book review not found`})

        const data = book.toObject()
        data['reviewsData'] = reviewExist

        if (!validator.isValidRequestBody(requestBody)) {
            return res.status(400).send({ status: false, message: 'No paramateres passed. Review unmodified', data: data })
        }

        // Extract params
        const { review, rating, reviewedBy, reviewedAt } = requestBody;
        
        const updatedReviewData = {}

        if (validator.isValid(rating)) {
            if(validator.isValidNumber(rating) && validator.isInValidRange(rating, 1, 5)) {
                if (!Object.prototype.hasOwnProperty.call(updatedReviewData, '$set'))
                    updatedReviewData[ '$set' ] = {}
    
                updatedReviewData[ '$set' ][ 'rating' ] = rating
            } else {
                return res.status(400).send({status: false, message: 'Rating should be a valid number between 1 to 5'})
            }
        }

        if(validator.isValid(reviewedAt) && validator.isValidDate(reviewedAt)) {
            if (!Object.prototype.hasOwnProperty.call(updatedReviewData, '$set'))
                updatedReviewData[ '$set' ] = {}

            updatedReviewData[ '$set' ][ 'reviewedAt' ] = moment(reviewedAt).toISOString()
        }

        if (validator.isValid(review)) {
            if (!Object.prototype.hasOwnProperty.call(updatedReviewData, '$set'))
                updatedReviewData[ '$set' ] = {}

            updatedReviewData[ '$set' ][ 'review' ] = review
        }

        if (validator.isValid(reviewedBy)) {
            if (!Object.prototype.hasOwnProperty.call(updatedReviewData, '$set'))
                updatedReviewData[ '$set' ] = {}

            updatedReviewData[ '$set' ][ 'reviewedBy' ] = reviewedBy
        }

        const updatedReview = await ReviewModel.findOneAndUpdate({ _id: reviewId }, updatedReviewData, { new: true })

        data['reviewsData'] = updatedReview

        return res.status(200).send({ status: true, message: 'Success', data: data });
    } catch (error) {
        return res.status(500).send({ status: false, message: error.message });
    }
}

const deleteReview = async function (req, res) {
    try {
        const params = req.params
        const bookId = params.bookId
        const reviewId = params.reviewId

        if (!validator.isValidObjectId(bookId)) {
            return res.status(400).send({ status: false, message: `${bookId} is not a valid book id` })
        }

        if (!validator.isValidObjectId(reviewId)) {
            res.status(400).send({ status: false, message: `${reviewId} is not a valid review id` })
        }

        const book = await BookModel.findOne({ _id: bookId, isDeleted: false})

        if(!book) return res.status(404).send({ status: false, message: 'Book not found'})

        const review = await ReviewModel.findOne({ _id: reviewId, bookId: bookId, isDeleted: false })

        if (!review) {
            return res.status(404).send({ status: false, message: `Review not found` })
        }

        await ReviewModel.findOneAndUpdate({ _id: reviewId }, { $set: { isDeleted: true, deletedAt: new Date() } } )

        book.reviews = book.reviews === 0 ? 0 : book.reviews - 1
        await book.save()

        return res.status(200).send({ status: true, message: `Success` })
    } catch (error) {
        return res.status(500).send({ status: false, message: error.message });
    }
}

module.exports = {
    addReview,
    updateReview,
    deleteReview
}