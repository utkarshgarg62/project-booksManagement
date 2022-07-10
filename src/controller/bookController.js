const bookModel = require("../models/bookModel")
const userModel = require("../models/userModel")
const reviewModel = require("../models/reviewModel");
const { isValid, isValidObjectId, isValidDate, isValidISBN, isValidString } = require("../middleware/validation");


//================================================[Create Book Api]=======================================================================


const createBook = async function (req, res) {
    try {
        let data = req.body
        let { title, excerpt, userId, ISBN, category, subcategory, releasedAt } = data;

        if (Object.keys(data).length < 1) {
            return res.status(400).send({ status: false, message: "Insert Data : BAD REQUEST" })
        }

        if (!isValid(title)) {
            return res.status(400).send({ status: false, message: "Enter Title" })
        }

        if (!isValid(excerpt)) {
            return res.status(400).send({ status: false, message: "Enter Excerpt" })
        }

        if (!isValid(userId)) {
            return res.status(400).send({ status: false, message: "Enter a User Id" })
        }

        if (!isValidObjectId(userId)) {
            return res.status(400).send({ status: false, message: "Enter Valid User Id" })
        }

        if (!isValid(ISBN)) {
            return res.status(400).send({ status: false, message: "Enter ISBN Number" })
        }
        if (!isValidISBN(ISBN)) {
            return res.status(400).send({ status: false, message: "Enter a valid ISBN Number" })
        }

        if (!isValid(category)) {
            return res.status(400).send({ status: false, message: "Enter Category" })
        }

        if (!isValid(subcategory)) {
            return res.status(400).send({ status: false, message: "Enter subcategory" })
        }

        if (!isValid(releasedAt)) {
            return res.status(400).send({ status: false, message: "Enter releasedAt" })
        }
        if (!isValidDate(releasedAt)) {
            return res.status(400).send({ status: false, message: "Enter a valid releasedAt format - YYYY-MM-DD " })
        }

        let checktitle = await bookModel.findOne({ title: title })
        if (checktitle) return res.status(400).send({ status: false, message: "Title already exists" })

        let checkISBN = await bookModel.findOne({ ISBN: ISBN })
        if (checkISBN) return res.status(400).send({ status: false, message: "ISBN already exists" })

        let checkUserId = await userModel.findOne({ _id: userId })
        if (!checkUserId) return res.status(400).send({ status: false, message: "User Id do not exists" })

        let savedData = await bookModel.create(data);
        res.status(201).send({ status: true, message: "Success", data: savedData });
    }
    catch (err) {
        res.status(500).send({ status: false, message: err.message })
    }
};



//====================================================[Get Book API]=====================================================================


const getBooksData = async function (req, res) {
    try {
        let data = req.query;
        if (Object.keys(data).length < 1) return res.status(400).send({ status: false, message: "Please Provide Filters" })
        let { userId, category, subcategory } = data
        if (userId) {
            if (!isValidObjectId(userId)) {
                return res.status(400).send({ status: false, message: "Invalid userId in params" })
            }
        }
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
        res.status(500).send({ message: err.message })
    }
}


//===============================================[Get Book API By BookId]====================================================================


const getBooksDataById = async function (req, res) {
    try {
        let BookId = req.params.bookId;
        if (Object.keys(BookId).length < 1) return res.status(400).send({ status: false, message: "Please Provide BookId" })
        if (!isValidObjectId(BookId)) {
            return res.status(400).send({ status: false, message: "Invalid BookId" })
        }
        let findBook = await bookModel.findOne({  _id: BookId , isDeleted: false })
        if (!findBook)  return res.status(404).send({ status: false, message: "No Book found" })

        let reviewBookData = await reviewModel .find({bookId:BookId ,isDeleted:false})

        let reviewObj = findBook.toObject()
        if (reviewBookData) {
            reviewObj['reviewsData'] = reviewBookData
        }

        return res.status(200).send({ status: true, message: 'Books list', data: reviewObj })
    }

    catch (err) {
        res.status(500).send({ message: err.message })
    }
}


//============================================[Update Book API By BookId]======================================================================


const updatedBook = async function (req, res) {

    try {

        let BookId = req.params.bookId;
        if (!isValidObjectId(BookId)) {
            return res.status(400).send({ status: false, message: "Invalid BookId" })
        }
        let bookToBeUpdted = await bookModel.findById({ _id: BookId })
        if (Object.keys(bookToBeUpdted).length === 0) {
            return res.status(404).send({ status: false, message: "Book does not exist" })
        }

        let data = req.body;
        let { title, excerpt, releasedAt, ISBN } = data
        if (Object.keys(data).length === 0) return res.status(400).send({ status: false, message: "Insert Data : Bad Request" });

        if (!isValidString(title)) {
            return res.status(400).send({ status: false, message: "Title is missing ! " })
        }

        if (!isValidString(excerpt)) {
            return res.status(400).send({ status: false, message: "Excerpt is missing !" })
        }
        if (!isValidString(releasedAt)) {
            return res.status(400).send({ status: false, message: "ReleasedAt is missing !" })
        }
        if (!isValidString(ISBN)) {
            return res.status(400).send({ status: false, message: "ISBN is missing !" })
        }

        const findTitle = await bookModel.findOne({ title: title, isDeleted: false })
        if (findTitle) {
            return res.status(400).send({ status: false, message: "Title is already exists. Please try a new title." })
        }
        const findIsbn = await bookModel.findOne({ ISBN: ISBN, isDeleted: false })
        if (findIsbn) {
            return res.status(400).send({ status: false, message: "ISBN is already exists. Please try a new ISBN." })
        }

        if (bookToBeUpdted.isDeleted == false) {
            let updatedBook = await bookModel.findOneAndUpdate({ _id: BookId }, { title: title, excerpt: excerpt, releasedAt: releasedAt, ISBN: ISBN }, { new: true })
            res.status(201).send({ status: true, data: updatedBook })
        }
        else {
            return res.status(400).send({ status: false, message: "Unable to update details. Book has been already deleted" })
        }

    } catch (error) {
        res.status(500).send({ status: false, message: error.message })
    }

}



//============================================[Delete Book API By BookId]========================================================================


const deleteBookId = async function (req, res) {

    try {
        let bookId = req.params.bookId;
        let book = await bookModel.findById(bookId)
        if (!book) {
            return res.status(404).send({ status: "false", message: "No such book exists " })
        };
        if (!bookId) return res.status(400).send({ status: false, message: "BookId is required" })

        let data = await bookModel.findById(bookId);
        if (!data) return res.status(404).send({ status: false, message: "No such book found" });

        if (data.isDeleted) return res.status(404).send({ status: false, message: " Already deleted blog Or Book not exists" });

        let timeStamps = new Date();
        await bookModel.findOneAndUpdate({ _id: bookId }, { $set: { isDeleted: true, deletedAt: timeStamps } }, { new: true })
        res.status(200).send({ status: true, message: "Book is deleted successfully" })
    } catch (err) {
        res.status(500).send({ status: false, error: err.message });
    }
};



//============================================[Exporting Functions]========================================================================




module.exports.createBook = createBook
module.exports.getBooksData = getBooksData
module.exports.getBooksDataById = getBooksDataById
module.exports.updatedBook = updatedBook
module.exports.deleteBookId = deleteBookId


