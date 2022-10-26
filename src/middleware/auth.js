const jwt = require("jsonwebtoken");
const userModel = require("../models/userModel");
const { isValidObjectId } = require("../validator/validation");

//------------------------------------------------------------------------------------------------------------------------------------------------------

const authentication = async function (req, res, next) {
  try {
    // token sent in request header 'x-api-key'
    token = req.headers["x-api-key"];

    // if token is not provided
    if (!token) {
      return res.status(400).send({ status: false, msg: "Token required! Please login to generate token" });
    }

    jwt.verify(token, "Group14", { ignoreExpiration: true }, function (error, decodedToken) {
      // if token is not valid
      if (error) {
        return res.status(400).send({ status: false, msg: "Token is invalid!" });

        // if token is valid
      } else {
        // checking if token session expired
        if (Date.now() > decodedToken.exp * 1000) {
          return res.status(401).send({ status: false, msg: "Session Expired" });
        }
        //exposing decoded token userId in request for everywhere access
        req.userId = decodedToken.userId;
        next();

      }
    }
    )

  } catch (err) {
    res.status(500).send({ msg: "Internal Server Error", error: err.message });
  }
};

//------------------------------------------------------------------------------------------------------------------------------------------------------

const authorisation = async function (req, res, next) {
  try {
    // profileId sent through path params
    let profileId = req.params.profileId;

    // CASE-1: profileId is empty
    if (profileId === ":profileId") {
      return res
        .status(400)
        .send({ status: false, msg: "Please enter profileId to proceed!" });
    }
    // CASE-2: profileId is not an ObjectId
    else if (!isValidObjectId(profileId)) {
      return res.status(400).send({ status: false, msg: "profileId is invalid!" });
    }
    // CASE-3: profileId does not exist (in our database)
    let profile = await profileModel.findOne({ _id: profileId }); // database call
    console.log(profile);
    if (!profile) {
      return res.status(400).send({
        status: false,
        msg: "We are sorry; Given profileId does not exist!",
      });
    }
  
    // Authorisation: userId in token is compared with userId against profileId
    if (req.userId !== profile.userId.toString()) {
      return res.status(401).send({
        status: false,
        msg: "Authorisation Failed!"
      });
    } else if (req.userId === profile.userId.toString()) {
      next();
    }
  } catch (err) {
    res.status(500).send({ msg: "Internal Server Error", error: err.message });
  }
};

//------------------------------------------------------------------------------------------------------------------------------------------------------

module.exports = { authentication, authorisation };
