if(process.env.NODE_ENV != "production"){
  require('dotenv').config()
}

const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
let app = express();
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const ExpressError = require('./utils/ExpressError.js');
const listingsRoute = require("./routes/listing.js");
const reviewsRoute = require("./routes/review.js");
const usersRoute = require("./routes/user.js");
const session = require("express-session");
const MongoStore = require('connect-mongo');
const flash = require('express-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./Models/user.js');

const db_Url = process.env.MONGODB_ATLAS;

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname,"/public")));

const store = MongoStore.create({
    mongoUrl : db_Url,
    touchAfter : 24 * 60 * 60,
    crypto : {
        secret : process.env.SECRET
    }
});

store.on("error",function(e){
    console.log("Session store error",e);
});

const sessionOptions = {
    store,
    secret : process.env.SECRET,
    resave : false,
    saveUninitialized : true,
    cookie : {
        expires : Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge :  7 * 24 * 60 * 60 * 1000,
        httpOnly : true
    }
};

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
    res.locals.success = req.flash("Success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
});

app.get('/demouser', async(req,res)=>{
    let fakeUser = new User({
        email : "chinubhati@gmail.com",
        username : "Chinu bhati"
    });

    let registeredUser = await User.register(fakeUser,"helloworld");
    res.send(registeredUser);
});

app.use("/listings",listingsRoute);
app.use("/listings/:id/reviews",reviewsRoute);
app.use("/",usersRoute);

app.listen(8080,(req,res) => {
    console.log("Server is listening at port 8080");
});

async function main() {
    await mongoose.connect(db_Url);
};

main()
.then((res)=>{
    console.log("connected to DB");
}).catch((err)=>{
    console.log("Error is occured");
});

// app.get('/',(req,res)=>{
//     res.send("Server is start");
// });

// FOR ALL REQ ERROR
app.all(/.*/, (req, res, next)=>{
    next(new ExpressError(404,'Page not found!'));
});

// ERROR HANDLING MIDDLEWARE
app.use((err,req,res,next)=>{
    const {statusCode=500,message="Something wrong"} = err;
    // res.status(statusCode).send(message); 
    res.status(statusCode).render("error.ejs",{message});
});
