const userModel = require("../models/userModel");
const jwt = require("jsonwebtoken");
const {
  isValid,
  isValidName,
  isValidEmail,
  isValidPassword,
  isValidReqBody,
} = require("../validator/validation");

// Abhishek profile is an array of value 

//------------------------------------------------------------------------------------------------------------------------------------------------------

const registerUser = async function (req, res) {
  try {
    // data sent through request body
    let data = req.body;

    // if request body is empty
    if (!isValidReqBody(data)) {
      return res
        .status(400)
        .send({ status: false, message: " Please enter user details" });
    }
    // username, full name, emailId and password.

    let username = data.username;
    let fullName = data.fullName;
    let email = data.email?.toLowerCase();
    let password = data.password;

    // VALIDATIONS:

    // if email is empty
    if (isValid(email) === false) {
      return res.status(400).send({
        status: false,
        message: " Please Enter email(required field)",
      });
    }
    // if email is invalid
    if (isValidEmail(email) === false) {
      return res
        .status(400)
        .send({ status: false, message: " Please enter valid email" });
    }
    // name validation
    if (!isValidName(username)) {
      return res
        .status(400)
        .send({ status: false, msg: "plesae give a valid name" });
    }
  
    // email duplication check
    let emaildb = await userModel.findOne(
      { email: email },
      { email: 1, _id: 0 }
    );
    if (emaildb) {
      return res.status(400).send({
        status: false,
        message: "We are sorry; this email is already used",
      });
    }

    // is password is empty
    if (isValid(password) === false) {
      return res.status(400).send({
        status: false,
        message: " Please enter password(required field)",
      });
    }

    // if password is invalid
    if (isValidPassword(password) === false) {
      let length = "";
      if (password.length < 8) length = "less than 8 characters";
      else if (password.length > 15) length = "greater than 15 characters";
      return res.status(400).send({
        status: false,
        message: `password cannot be ${length}`,
      });
    }

    // registering user
    let registeredUser = await userModel.create(data);

    // response
    res.status(201).send({ status: true, message: registeredUser });
  } catch (err) {
    res.status(500).send({
      status: false,
      message: "Internal Server Error",
      error: err.message,
    });
  }
};

//------------------------------------------------------------------------------------------------------------------------------------------------------

const loginUser = async function (req, res) {
  try {
    // login credentials sent through request body
    let email = req.body.email;
    let password = req.body.password;

    // if email is empty
    if (isValid(email) === false) {
      return res.status(400).send({
        status: false,
        message: "Please enter email!",
      });
    }

    // if password is empty
    if (isValid(password) === false) {
      return res.status(400).send({
        status: false,
        message: "Please enter password!",
      });
    }

    // user document satisfying the login credentials
    let loginCredentials = await userModel.findOne({
      email: email,
      password: password,
    });

    // if login credentials are not correct
    if (!loginCredentials)
      return res.status(400).send({
        status: false,
        error: "email or password is incorrect",
      });

    // JWT generation using sign function
    let token = jwt.sign(
      {
        email: loginCredentials.email.toString(),
        userId: loginCredentials._id,
      },
      "Group14",
      {
        expiresIn: "24h",
      }
    );

    // JWT generated sent back in response header
    res.setHeader("x-api-key", token);

    res.status(200).send({
      status: true,
      message: "Login Successfull! Token sent in header 'x-api-key'",
    });
  } catch (err) {
    res.status(500).send({
      status: false,
      message: "Internal Server Error",
      error: err.message,
    });
  }
};

//------------------------------------------------------------------------------------------------------------------------------------------------------

let getProfile = async function (req, res) {
  try {
    //taking filter in query params
    const email = req.query.email;  

    //finding profile according to the query given by the user in query params
    let findProfile = await userModel.find({email:email});

    //console.log(findprofile);

    //checking is the findProfile is an array and if its length is zero , means empty array
    if (Array.isArray(findProfile) && findProfile.length === 0) {
      return res
        .status(404)
        .send({ status: false, message: "profile Not Found" });
    }

    //sending response of sortedProfile
    res
      .status(200)
      .send({ status: true, message: "Profile details", data: findProfile });
  } catch (err) {
    res.status(500).send({
      status: false,
      message: "Internal Server Error",
      error: err.message,
    });
  }
};


module.exports = { registerUser, getProfile, loginUser };
