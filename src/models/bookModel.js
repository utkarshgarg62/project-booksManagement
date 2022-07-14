const mongoose = require('mongoose');
const objectId = mongoose.Schema.Types.ObjectId

const bookSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        unqiue: true,
        trim: true
    },
    excerpt: {
        type: String,
        required: true,
        trim: true
    },
    userId: {
        type: objectId,
        ref: "userModel",
        required: true,
        trim: true
    },
    ISBN: {
        type: String,
        required: true,
        unqiue: true, trim: true
    },
    bookImage:{
        type:String,
        required:true
    },
    category: {
        type: String,
        required: true, trim: true
    },
    subcategory: [{
        type: String,
        required: true, trim: true
    }],
    reviews: {
        type: Number,
        default: 0
    },
    deletedAt: {
        type: Date,
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
    releasedAt: {
        type: Date,
        required: true,

    }
}, { timestamps: true });
module.exports = mongoose.model('bookModel', bookSchema)



