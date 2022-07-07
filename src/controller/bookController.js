const bookModel = require("../models/bookModel")
const userModel = require("../models/userModel")
const { isValid, isValidObjectId, isValidDate, isValidISBN } = require("../middleware/validation");


//================================================[Create Book Api]=======================================================================


const createBook = async function (req, res) {
    try {
        let data = req.body
        let { title, excerpt, userId, ISBN, category, subcategory, reviews, deletedAt, isDeleted, releasedAt } = data;

        if (Object.keys(data).length < 1) {
            return res.status(400).send({ msg: "Insert Data : BAD REQUEST" })
        }

        if (!isValid(title)) {
            return res.status(400).send({ msg: "Enter Title" })
        }

        if (!isValid(excerpt)) {
            return res.status(400).send({ msg: "Enter Excerpt" })
        }

        if (!isValid(userId)) {
            return res.status(400).send({ msg: "Enter a User Id" })
        }

        if (!isValidObjectId(userId)) {
            return res.status(400).send({ msg: "Enter Valid User Id" })
        }

        if (!isValid(ISBN)) {
            return res.status(400).send({ msg: "Enter ISBN Number" })
        }
        if (!isValidISBN(ISBN)) {
            return res.status(400).send({ msg: "Enter a valid ISBN Number" })
        }

        if (!isValid(category)) {
            return res.status(400).send({ msg: "Enter Category" })
        }

        if (!isValid(subcategory)) {
            return res.status(400).send({ msg: "Enter subcategory" })
        }

        if (!isValid(releasedAt)) {
            return res.status(400).send({ msg: "Enter releasedAt" })
        }
        if (!isValidDate(releasedAt)) {
            return res.status(400).send({ msg: "Enter a valid releasedAt format - YYYY-MM-DD " })
        }

        let checktitle = await bookModel.findOne({ title: title })
        if (checktitle) return res.status(400).send({ msg: "Title already exists" })

        let checkISBN = await bookModel.findOne({ ISBN: ISBN })
        if (checkISBN) return res.status(400).send({ msg: "ISBN already exists" })

        let checkUserId = await userModel.findOne({ _id: userId })
        if (!checkUserId) return res.status(400).send({ msg: "User Id do not exists" })

        let savedData = await bookModel.create(data);
        res.status(201).send({ status: true, message: "Success", data: savedData });
    }
    catch (err) {
        res.status(500).send({ status: false, message: err })
    }
};
module.exports.createBook = createBook



//====================================================[Get Book API]=====================================================================


const getBooksData = async function (req, res) {
    try {
        let data = req.query;
        let { userId, category, subcategory } = data
        if (userId || category || subcategory) {
            let bookData = {};
            if (userId) {
                bookData.userId = userId
            }
            if (category) {
                bookData.category = category
            }
            if (subcategory) {
                bookData.subcategory = subcategory
            }
            let books = await bookModel.find({ $and: [bookData, { isDeleted: false }] }).select({ _id: 1, title: 1, excerpt: 1, userId: 1, category: 1, reviews: 1, releasedAt: 1, }).sort({ title: 1 })
            if (books.length > 0) return res.status(200).send({ status: true, message: 'Books list', data: books })
        }
        else return res.status(404).send({ status: false, message: "No data found" })
    }
    catch (err) {
        res.status(500).send({ msg: err.message })
    }
}
module.exports.getBooksData = getBooksData


//===============================================[Get Book API By BookId]====================================================================


const getBooksDataById = async function (req, res) {
    try {
        let BookId = req.params.bookId;
        let books = await bookModel.find({ $and: [{ _id: BookId }, { isDeleted: false }] })
        if (books.length > 0) return res.status(200).send({ status: true, message: 'Books list', data: books })
        else return res.status(404).send({ status: false, message: "No Book found" })
    }
    
    catch (err) {
        res.status(500).send({ msg: err.message })
    }
}
module.exports.getBooksDataById = getBooksDataById



//============================================[Delete Book API By BookId]========================================================================


const deleteBookId = async function (req, res) {
    
    try {
        let bookId = req.params.bookId;
        let book = await bookModel.findById(bookId)
        console.log(book)
        if (!book) {
            return res.status(404).send({ status: "false", msg: "No such book exists " })
        };
        if (!bookId) return res.status(400).send({ status: false, msg: "BookId is required" })
        
        let data = await bookModel.findById(bookId);
        if (!data) return res.status(404).send({ status: false, msg: "No such book found" });

        if (data.isDeleted) return res.status(404).send({ status: false, msg: " Already deleted blog Or Book not exists" });

        let timeStamps = new Date();
        await bookModel.findOneAndUpdate({ _id: bookId }, { $set: { isDeleted: true, releasedAt: timeStamps, deletedAt: timeStamps } }, { new: true })
        res.status(200).send({ status: true, msg: "Book is deleted successfully" })
    } catch (err) {
        res.status(500).send({ status: false, error: err.message });
    }
};
module.exports.deleteBookId = deleteBookId



//============================================[Update Book API By BookId]======================================================================


const updatedBook = async function (req, res) {
    
    try {
        let data = req.body;
        if (Object.keys(data).length === 0) return res.status(400).send({ status: false, msg: "Bad Request" });
        let BookId = req.params.bookId;
        let bookToBeUpdted = await bookModel.findOne({ _id: BookId, isDeleted: false })
        if (Object.keys(bookToBeUpdted).length === 0) {
        return res.status(404).send({ status: false, msg: "Blog does not exist" })}
        
        let updatedBook = await bookModel.findOneAndUpdate({ _id: BookId }, { $set: data }, { new: true })
        res.status(201).send({ status: true, data: updatedBook })
        
    } catch (error) {
        res.status(500).send({ status: false, msg: error.message })
    }
    
}

module.exports.updatedBook = updatedBook
