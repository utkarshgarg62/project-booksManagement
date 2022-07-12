const mongoose = require('mongoose');
const objectId = mongoose.Schema.Types.ObjectId

const reviewSchema = new mongoose.Schema({

    bookId: {
        type: objectId,
        required: true,
        ref: 'bookModel',
        trim: true
    },

    reviewedBy: {
        type: String,
        required: true,
        default: 'Guest',
        trim: true
    },

    reviewedAt: {
        type: Date,
        required: true
    },

    rating: {
        type: Number,
        minlength: 1,
        maxlength: 5, 
        required: true
    },

    review: {
        type: String,
        trim: true
    },

    isDeleted: {
        type: Boolean,
        default: false
    },

    deletedAt: {
        type: Date
    }

}, { timestamps: true })

module.exports = mongoose.model('reviewModel', reviewSchema)