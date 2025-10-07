const express = require("express");
const wrapAsync = require("../utils/wrapAsync");
const router = express.Router();
const User = require("../Models/user.js");
const passport = require("passport");
const { saveRedirect } = require("../middlewares.js");
const userController = require("../controllers/users.js");

router.route("/signup")
.get(userController.signup)
.post(
  wrapAsync(userController.postSignup),
);

router.route("/login")
.get(userController.login)
.post(
  saveRedirect,
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
  }),
  userController.postLogin
);

router.get("/logout", userController.logout);

module.exports = router;
