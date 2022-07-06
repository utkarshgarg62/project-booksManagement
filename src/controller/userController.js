const userModel = require('../models/userModel');
const jwt=require("jsonwebtoken");
const { isValid, isValidEmail, isValidMobile, isValidName,isValidTitle, isValidPassword, } = require("../middleware/validation");

const createUser = async function(req,res){
    try{
        const data = req.body;
        let { title, name, phone, email, password, address } = data;
        if (Object.keys(data).length<1) {
            return res.status(400).send({ status: false, message: "Data is required to create a user" });
          }

          //------------ Validation title

        if (!isValid(title)) {
            return res.status(400).send({ message: "Enter Title" })
        }
        if (!isValidTitle(title)) {
            return res.status(400).send({ message: "Enter valid Title" })
        }

        // -------------Validation Name

        if(!isValid(name)){
            return res.status(400).send({message: "Enter Name"});
        }
        if(!isValidName(name)){
            return res.status(400).send({message: "Enter valid name"});
        }

        //------------- Validation Phone

        if(!isValid(phone)){
            return res.status(400).send({message: "Enter Phone Number"});
        }
        if(!isValidMobile(phone)){
            return res.status(400).send({message: "Enter valid phone number of 10 digits"});
        }
        
        //--------------Validation Email

        if(!isValid(email)){
            return res.status(400).send({message: "Enter Email"});
        }
        if(!isValidEmail(email)){
            return res.status(400).send({message: "Enter valid email"});
        }
        
        //------------- Validation Password

        if(!isValid(password)){
            return res.status(400).send({message: "Enter Password"});
        }
        if(!isValidPassword(password)){
            return res.status(400).send({message: "Minimum eight characters, at least one letter and one number in Password"});
        }
        //-------------- Validation Address

        // if(!isValid(address)){
        //     return res.status(400).send({message: "Enter address"});
        // }
        // if(!isValidAddress(address)){
        //     return res.status(400).send({message: "Enter valid address"});
        // }


        //********************************DB cal email and phone ************/

        let checkPhone=await userModel.findOne({phone: data.phone})
        if(checkPhone) return res.status(400).send({message :"Phone already exists"})

        let checkEmail = await userModel.findOne({email: data.email})
        if(checkEmail) return res.status(400).send({message:" Email is already exists"})

        //**********************************************************************/
          let createdData = await userModel.create(data)
          res.status(201).send({ status: true, message: 'Success', data: createdData });
    }
    catch (err) {
        res.status(500).send({status: false,  message: err });
      }

}


const userLogin = async function (req, res) {
    try {
        userName = req.body.email;
        userPassword = req.body.password;
        let userDetails = await userModel.findOne({email: userName,password: userPassword,});
        if (!userDetails) {res.status(400).send({status: false,message: "userName or userpassword is invalid",});
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
        res.status(500).send({ message: "Error", error: err.message });
      }
    }
  
module.exports.userLogin = userLogin;

module.exports.createUser = createUser