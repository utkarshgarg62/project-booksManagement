const bookModel = require("../models/bookModel")
const userModel = require("../models/userModel")
const { isValid, isValidObjectId,isValidDate,isValidISBN } = require("../middleware/validation");


//====================================================[Create Book Api]========================================================================


const createBook = async function (req, res) {
    try {
        let data=req.body
        let {title, excerpt, userId, ISBN, category, subcategory, reviews, deletedAt, isDeleted, releasedAt} = data;
        
        if (Object.keys(data).length<1) {
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
        
        let checktitle=await bookModel .findOne({title:title})
        if(checktitle) return res.status(400).send({msg :"Title already exists"})

        let checkISBN=await bookModel .findOne({ISBN:ISBN})
        if(checkISBN) return res.status(400).send({msg :"ISBN already exists"})

        let checkUserId=await userModel .findOne({_id:userId})
        if(!checkUserId) return res.status(400).send({msg :"User Id do not exists"})

        let savedData = await bookModel.create(data);
        res.status(201).send({ status:true, message: "Success", data: savedData });
    }
    catch (err) {
        res.status(500).send({   status: false,  message: err })
    }
};
module.exports.createBook = createBook



//=====================================================[Get Book API]========================================================================


const getBooksData = async function (req, res) {
    try {

    }
    catch (err) {
        res.status(500).send({ msg:err.message})
    }
}
module.exports.getBooksData = getBooksData
