const express = require("express");
const router = express.Router();

const userController = require("../controllers/userController");

const middleware = require("../middleware/auth");

//Api for creating user
router.post("/register", userController.registerUser);

//Api for login user
router.post("/login", userController.loginUser);

//Api for getting profile by query params
router.get("/profile", middleware.authentication, userController.getProfile);


// if api is invalid OR wrong URL
router.all("/*", function (req, res) {
  res
    .status(404)
    .send({ status: false, msg: "The api you requested is not available" });
});

module.exports = router;
