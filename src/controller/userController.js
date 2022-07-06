const userModel = require('../models/userModel');
const jwt=require("jsonwebtoken");
const moment = require("moment");

const createUser = async function(req,res){
    try{
        const data = req.body;
        if (Object.keys(data).length<1) {
            return res.status(400).send({ status: false, msg: "Data is required to create a user" });
          }
          let createdData = await userModel.create(data)
          res.status(201).send({ status: true, msg: " User data succesfully created", data: createdData })
    }
    catch (err) {
        res.status(500).send({ status: false, error: err.message });
      }

}


const userLogin = async function (req, res) {
  try {
    userName = req.body.email
    userPassword = req.body.password
    let userDetails = await userModel.findOne({
      email: userName,
      password: userPassword,
    });
    if (!userDetails) {
      res
        .status(400)
        .send({
          status: false,
          msg: "userName or userpassword is invalid",
        });
    }
    let token = jwt.sign(
      {
        userId: userDetails._id.toString(),
        issued_at :moment().defaultformat(),
        exp: moment().defaultformat().add(30, 'seconds')
        .add(10, 'minutes')
        
      },
      "bookManagement35"
    );
    res.setHeader("x-api-key", token);
    res.status(201).send({ status: true,data: {token: token }});
  } catch (err) {
    res.status(500).send({ msg: "Error", error: err.message });
  }
};
module.exports.userLogin = userLogin;

module.exports.createUser = createUser