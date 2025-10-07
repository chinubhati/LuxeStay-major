const User = require("../Models/user.js");

module.exports.signup = (req, res) => {
  res.render("users/signup.ejs");
};

module.exports.postSignup = async (req, res) => {
    try {
      let { username, email, password } = req.body;
      const newUser = new User({
        username,
        email,
      });
      const registeredUser = await User.register(newUser, password);
      req.flash("Success", "Use registered Successfully!");
      console.log(registeredUser);
      req.login(registeredUser,(err)=>{
        if(err){
          return next(err);
        }
        req.flash("Success","Welcome to LuxeStay");
        res.redirect("/listings");
      });
    } catch (e) {
      req.flash("error", e.message);
      res.redirect("/signup");
    }
};

module.exports.login =  (req, res) => {
  res.render("users/login.ejs");
};

module.exports.postLogin = async(req,res)=>{
    req.flash("Success","Welcome to LuxeStay!");
    let redirectPage = res.locals.redirectUrl || "/listings"
        res.redirect(redirectPage);
};

module.exports.logout = (req,res,next)=>{
  req.logOut((err)=>{
    if(err){
      next(err);
    }
    req.flash("Success","User is Logged out!");
    res.redirect("/listings");
  });
};