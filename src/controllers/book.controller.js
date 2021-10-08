const moment = require('moment')

const {BookModel, ReviewModel, UserModel} = require('../models')
const {validator} = require('../utils')

const createBook = async function (req, res) {
    try {
        const requestBody = req.body;

        if (!validator.isValidRequestBody(requestBody)) {
            return res.status(400).send({ status: false, message: 'Invalid params received in request body' })
        }

        const { title, excerpt, userId, ISBN, category, subcategory, releasedAt} = requestBody;

        if (!validator.isValid(title)) {
            return res.status(400).send({ status: false, message: 'Title is required' })
        }

        const isTitleAlreadyUsed = await BookModel.findOne({ title });

        if (isTitleAlreadyUsed) {
            return res.status(400).send({ status: false, message: 'Title is already used.' })
        }

        if (!validator.isValid(excerpt)) {
            return res.status(400).send({ status: false, message: 'Excerpt is required' })
        }

        if(!validator.isValid(userId)) {
            return res.status(400).send({ status: false, message: 'User id is required' })
        }

        if(!validator.isValidObjectId(userId)) {
            return res.status(400).send({ status: false, message: `${userId} is an invalid userid` })
        }

        const isUserIdExist = await UserModel.findOne({ _id: userId })

        if (!isUserIdExist) return res.status(400).send({ status: false, message: `${userId} does not exist` })

        if (!validator.isValid(ISBN)) {
            return res.status(400).send({ status: false, message: 'ISBN is required' })
        }

        const isISBNAlreadyUsed = await BookModel.findOne({ ISBN: ISBN });

        if (isISBNAlreadyUsed) {
            return res.status(400).send({ status: false, message: `${ISBN} ISBN  is already in use.` });
        }

        if (!validator.isValid(category)) {
            return res.status(400).send({ status: false, message: 'Category is required' })
        }

        if (!validator.isValid(subcategory)) {
            return res.status(400).send({ status: false, message: 'Subcategory is required' })
        }

        if(!validator.isValid(releasedAt)) {
            return res.status(400).send({ status: false, message: `Release date is required`})
        }

        if(!validator.isValidDate(releasedAt)) {
            return res.status(400).send({ status: false, message: `${releasedAt} is an invalid date`})
        }

        const newBook = await BookModel.create({
            title, excerpt, userId, ISBN, category, subcategory, releasedAt: moment(releasedAt).toISOString()
        });

        return res.status(201).send({ status: true, message: `Books created successfully`, data: newBook });
    } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
    }
}

const getAllBooks = async function (req, res) {
    try {
        const filterQuery = { isDeleted: false }
        const queryParams = req.query;

        if (validator.isValidRequestBody(queryParams)) {
            const { userId, category, subcategory } = queryParams;

            if (validator.isValid(userId) && validator.isValidObjectId(userId)) {
                filterQuery[ 'userId' ] = userId
            }

            if (validator.isValid(category)) {
                filterQuery[ 'category' ] = category.trim()
            }

            if (validator.isValid(subcategory)) {
                filterQuery[ 'subCategory' ] = subcategory.trim()
            }
        }

        const books = await BookModel.find(filterQuery).sort({ title: 1 }).select("_id title excerpt userId category subcategory releasedAt reviews")

        if (Array.isArray(books) && books.length === 0) {
            return res.status(404).send({ status: false, message: 'No Books found' })
        }

        return res.status(200).send({ status: true, message: 'Books list', data: books })
    } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
    }
}

const getBookDetails = async function (req, res) {
    try {
        const bookId = req.params.bookId

        if (!validator.isValidObjectId(bookId)) {
            return res.status(400).send({ status: false, message: `${bookId} is not a valid book id` })
        }

        const book = await BookModel.findById({ _id: bookId, isDeleted: false });

        if (!book) {
            return res.status(404).send({ status: false, message: `Book does not exit` })
        }

        const reviews = await ReviewModel.find({ bookId: bookId, isDeleted: false })

        const data = book.toObject()
        data['reviewsData'] = reviews

        return res.status(200).send({ status: true, message: 'Success', data: data })
    } catch (error) {
        return res.status(500).send({ status: false, message: error.message });
    }
}

const updateBook = async function (req, res) {
    try {
        const requestBody = req.body
        const params = req.params
        const bookId = params.bookId
        const userId = req.userId

        // Validation stats
        if (!validator.isValidObjectId(bookId)) {
            return res.status(400).send({ status: false, message: `${bookId} is not a valid book id` })
        }

        if (!validator.isValidObjectId(userId)) {
            return res.status(400).send({ status: false, message: `${userId} is not a valid user id` })
        }

        const book = await BookModel.findOne({ _id: bookId, isDeleted: false })

        if (!book) {
            return res.status(404).send({ status: false, message: `Book not found` })
        }

        if (book.userId.toString() !== userId) {
            return res.status(401).send({ status: false, message: `Unauthorized access! Owner info doesn't match` });
            return
        }

        if (!validator.isValidRequestBody(requestBody)) {
            return res.status(400).send({ status: false, message: 'No paramateres passed. Book unmodified', data: book })
        }

        // Extract params
        const { title, excerpt, releasedAt, ISBN } = requestBody;

        const updatedBookData = {}

        if (validator.isValid(title)) {
            const isTitleAlreadyUsed = await BookModel.findOne({ title, _id: { $ne: bookId} });

            if (isTitleAlreadyUsed) {
                return res.status(400).send({ status: false, message: `${title} title is already used`})
            }

            if (!Object.prototype.hasOwnProperty.call(updatedBookData, '$set'))
                updatedBookData[ '$set' ] = {}

            updatedBookData[ '$set' ][ 'title' ] = title
        }

        if (validator.isValid(excerpt)) {
            if (!Object.prototype.hasOwnProperty.call(updatedBookData, '$set'))
                updatedBookData[ '$set' ] = {}
            updatedBookData[ '$set' ][ 'excerpt' ] = excerpt
        }

        if (validator.isValid(ISBN)) {
            const isISBNAlreadyUsed = await BookModel.findOne({ ISBN, _id: { $ne: bookId }});
    
            if (isISBNAlreadyUsed) {
                return res.status(400).send({ status: false, message: `${ISBN} ISBN is already exist` })
            }

            if (!Object.prototype.hasOwnProperty.call(updatedBookData, '$set'))
                updatedBookData[ '$set' ] = {}
            updatedBookData[ '$set' ][ 'ISBN' ] = ISBN
        }

        if (validator.isValidDate(releasedAt)) {
            if (!Object.prototype.hasOwnProperty.call(updatedBookData, '$set'))
                updatedBookData[ '$set' ] = {}
            
            updatedBookData[ '$set' ][ 'releasedAt' ] = moment(releasedAt).toISOString()
        }

        const updatedBook = await BookModel.findOneAndUpdate({ _id: bookId }, updatedBookData, { new: true })

        return res.status(200).send({ status: true, message: 'Success', data: updatedBook });
    } catch (error) {
        return res.status(500).send({ status: false, message: error.message });
    }
}

const deleteBook = async function (req, res) {
    try {
        const params = req.params
        const bookId = params.bookId
        const userId = req.userId;

        if (!validator.isValidObjectId(bookId)) {
            return res.status(400).send({ status: false, message: `${bookId} is not a valid book id` })
        }

        if (!validator.isValidObjectId(userId)) {
            return res.status(400).send({ status: false, message: `${userId} is not a valid user id` })
        }

        const book = await BookModel.findOne({ _id: bookId, isDeleted: false })

        if (!book) {
            return res.status(404).send({ status: false, message: `Book not found` })
        }

        if (book.userId.toString() !== userId) {
            return res.status(401).send({ status: false, message: `Unauthorized access! Owner info doesn't match` });
        }

        await BookModel.findOneAndUpdate({ _id: bookId }, { $set: { isDeleted: true, deletedAt: new Date() } })
        return res.status(200).send({ status: true, message: `Success` })
    } catch (error) {
        return res.status(500).send({ status: false, message: error.message });
    }
}

module.exports = {
    createBook,
    getAllBooks,
    getBookDetails,
    updateBook,
    deleteBook,
}