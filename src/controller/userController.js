const userModel = require('../models/userModel');
const jwt=require("jsonwebtoken");
//const moment = require("moment");
const { isValid, isValidEmail, isValidMobile, isValidName,isValidTitle, isValidPassword, isValidAddress} = require("../middleware/validation");

const createUser = async function(req,res){
    try{
        const data = req.body;
        let { title, name, phone, email, password, address } = data;
        if (Object.keys(data).length<1) {
            return res.status(400).send({ status: false, msg: "Data is required to create a user" });
          }

          //------------ Validation title

        if (!isValid(title)) {
            return res.status(400).send({ msg: "Enter Title" })
        }
        if (!isValidTitle(title)) {
            return res.status(400).send({ msg: "Enter valid Title" })
        }

        // -------------Validation Name

        if(!isValid(name)){
            return res.status(400).send({msg: "Enter name"});
        }
        if(!isValidName(name)){
            return res.status(400).send({msg: "Enter valid name"});
        }

        //------------- Validation Phone

        if(!isValid(phone)){
            return res.status(400).send({msg: "Enter phone"});
        }
        if(!isValidMobile(phone)){
            return res.status(400).send({msg: "Enter valid phone"});
        }
        
        //--------------Validation Email

        if(!isValid(email)){
            return res.status(400).send({msg: "Enter email"});
        }
        if(!isValidEmail(email)){
            return res.status(400).send({msg: "Enter valid email"});
        }
        
        //------------- Validation Password

        if(!isValid(password)){
            return res.status(400).send({msg: "Enter  password"});
        }
        if(!isValidPassword(password)){
            return res.status(400).send({msg: "Enter  password"});
        }
        //-------------- Validation Address

        // if(!isValid(address)){
        //     return res.status(400).send({msg: "Enter address"});
        // }
        // if(!isValidAddress(address)){
        //     return res.status(400).send({msg: "Enter valid address"});
        // }
        //********************************DB cal email and phone ************/

        let checkPhone=await userModel.findOne({phone: data.phone})
        if(checkPhone) return res.status(400).send({msg :"Phone already exists"})

        let checkEmail = await userModel.findOne({email: data.email})
        if(checkEmail) return res.status(400).send({msg:" Email is already exists"})

        //**********************************************************************/
          let createdData = await userModel.create(data)
          res.status(201).send({ status: true, msg: " User data succesfully created", data: createdData });
    }
    catch (err) {
        res.status(500).send({ status: false, error: err.message });
      }

}


const userLogin = async function (req, res) {
    try {
        userName = req.body.email;
        userPassword = req.body.password;
        let userDetails = await userModel.findOne({email: userName,password: userPassword,});
        if (!userDetails) {res.status(400).send({status: false,msg: "userName or userpassword is invalid",});
        }
        let token = jwt.sign(
          {
            userId: userDetails._id.toString(),
            iAt: Date.now(),
            exp: Math.floor(Date.now() + (10 * 60))
          },
          "bookManagement35"
        );
        res.setHeader("x-api-key", token);
        res.status(201).send({ status: true, data: { token: token } });
      } catch (err) {
        res.status(500).send({ msg: "Error", error: err.message });
      }
    }
  
module.exports.userLogin = userLogin;

module.exports.createUser = createUser