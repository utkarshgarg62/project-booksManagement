const mongoose = require('mongoose');
const objectId = mongoose.Schema.Types.ObjectId

const blogSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    body: {
        type: String,
        required: true
    },
    authorId: {
        type: objectId,
        ref: "authorModel",
        required: true
    },
    tags: [String],

    category: {
        type: String,
        required: true
    },
    subcategory: [{
        type: String,
    }],
    deletedAt: {
        type: String,
    },
    isDeleted: { 
        type: Boolean, 
        default: false 
    },
    publishedAt: {
        type: String,
    },
    isPublished: { 
        type: Boolean, 
        default: false 
    }

}, { timestamps: true });


//  title: {string, mandatory, unique},
// excerpt: {string, mandatory}, 
// userId: {ObjectId, mandatory, refs to user model},
// ISBN: {string, mandatory, unique},
// category: {string, mandatory},
// subcategory: [string, mandatory],
// reviews: {number, default: 0, comment: Holds number of reviews of this book},
// deletedAt: {Date, when the document is deleted}, 
// isDeleted: {boolean, default: false},
// releasedAt: {Date, mandatory, format("YYYY-MM-DD")},
// createdAt: {timestamp},
// updatedAt: {timestamp},








module.exports = mongoose.model('blogModel', blogSchema) //blogmodel