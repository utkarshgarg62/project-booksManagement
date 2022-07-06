const mongoose = require("mongoose")

const authorSchema = new mongoose.Schema({

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

})
module.exports = mongoose.model('authorModel', authorSchema) //authormodel



    // title: {string, mandatory, enum[Mr, Mrs, Miss]},
    // name: {string, mandatory},
    // phone: {string, mandatory, unique},
    // email: {string, mandatory, valid email, unique}, 
    // password: {string, mandatory, minLen 8, maxLen 15},
    // address: {
    //   street: {string},
    //   city: {string},
    //   pincode: {string}
    // },
    // createdAt: {timestamp},
    // updatedAt: {timestamp},