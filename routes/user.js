const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapasync.js");
const passport = require("passport");
const {saveRedirectUrl} = require("../middleware.js");
const userController = require("../controller/user.js");

router
.route("/signup")
.get(userController.renderSignup)
.post(wrapAsync(userController.registerUser));


router
.route("/login")
.get(userController.renderLogin)
.post(saveRedirectUrl,passport.authenticate("local",{failureRedirect: "/login", failureFlash: true}),userController.login);


router
.route("/logout")
.get(userController.logout);


module.exports = router;