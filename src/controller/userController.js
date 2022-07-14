const userModel = require('../models/userModel');
const jwt=require("jsonwebtoken");
const { isValid, isValidEmail, isValidMobile, isValidName,isValidTitle, isValidPassword, } = require("../middleware/validation");

//================================================[Create User Api]=======================================================================


const createUser = async function(req,res){
    try{
        const data = req.body;
        let { title, name, phone, email, password } = data;
        if (Object.keys(data).length<1) {
            return res.status(400).send({ status: false, message: "Data is required to create a user" });
          }

          //------------ Validation title

        if (!isValid(title)) {
            return res.status(400).send({status: false,  message: "Enter Title" })
        }
        if (!isValidTitle(title)) {
            return res.status(400).send({ status: false, message: "Enter valid Title" })
        }

        // -------------Validation Name

        if(!isValid(name)){
            return res.status(400).send({status: false, message: "Enter Name"});
        }
        if(!isValidName(name)){
            return res.status(400).send({status: false, message: "Enter valid name"});
        }

        //------------- Validation Phone

        if(!isValid(phone)){
            return res.status(400).send({status: false, message: "Enter Phone Number"});
        }
        if(!isValidMobile(phone)){
            return res.status(400).send({status: false, message: "Enter valid phone number of 10 digits"});
        }
        
        //--------------Validation Email

        if(!isValid(email)){
            return res.status(400).send({status: false, message: "Enter Email"});
        }
        if(!isValidEmail(email)){
            return res.status(400).send({status: false, message: "Enter valid email"});
        }
        
        //------------- Validation Password

        if(!isValid(password)){
            return res.status(400).send({status: false, message: "Enter Password"});
        }
        if(!isValidPassword(password)){
            return res.status(400).send({status: false, message: "Minimum eight characters, at least 1 letter and 1 number in Password : Min 8 and Max 15"});
        }

        //********************************DB call email and phone ************/

        let checkPhone=await userModel.findOne({phone: data.phone})
        if(checkPhone) return res.status(400).send({status: false, message :"Phone already exists"})

        let checkEmail = await userModel.findOne({email: data.email})
        if(checkEmail) return res.status(400).send({status: false, message:" Email is already exists"})

        //**********************************************************************/
          let createdData = await userModel.create(data)
          res.status(201).send({ status: true, message: 'Success', data: createdData });
    }
    catch (err) {
        res.status(500).send({status: false,  message: err });
      }

}



//================================================[User Login Api]=======================================================================



const userLogin = async function (req, res) {
    try {
        userName = req.body.email;
        if (!userName) return res.status(400).send({status: false,message: "Email is required",})
        if (!isValidEmail(userName)) return res.status(400).send({status: false,message: "Email is required",})


        userPassword = req.body.password;
        if (!userPassword) return res.status(400).send({status: false,message: "Password is required"})
        if (!isValidPassword(userPassword)) return res.status(400).send({status: false,message: "Email is required",})
        
        let userDetails = await userModel.findOne({email:userName, password:userPassword,});
        if (!userDetails) return res.status(401).send({status: false,message: "email or password is incorrect"})
    
        let token = jwt.sign(
          {
            userId: userDetails._id.toString(),
            iat: Math.floor(Date.now() / 1000), //time of issuing the token.
            exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 //setting token expiry time limit.

          },
          "bookManagement35"
        );
        res.setHeader("x-api-key", token);
        res.status(200).send({ status: true, data: { token: token } });
      } catch (err) {
        res.status(500).send({status: false,  message: err });
      }
    }



//================================================[Exporting Functions]=======================================================================



module.exports.createUser = createUser
module.exports.userLogin = userLogin;
