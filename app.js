if (process.env.NODE_ENV !="production") {
    require("dotenv").config();
}
   
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const path = require('path'); 
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");

const listingRouter = require('./routes/listing.js');
const reviewRouter = require("./routes/review.js");
const userRouter = require('./routes/user.js');

const session = require('express-session');
const passport = require("passport");
const localStrategy = require("passport-local");
const User = require("./models/user.js");
const flash = require('connect-flash'); 

const ExpressError = require('./utils/ExpressError.js'); // Import custom error class
 
  
  
const MONGO_URL = 'mongodb://127.0.0.1:27017/wanderlust';

main().then(() => {
    console.log("Connected to DB");
}).catch((err) => {
    console.log(err);
}); 

async function main() {
    await mongoose.connect(MONGO_URL);
}

// Set view engine and middleware
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, "public")));

const sessionOptions = {
    secret: 'your-secret-key', // Change this to a secure, random string
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        secure: false, // Set to true if using HTTPS
        maxAge: 24 * 60 * 60 * 1000 // Cookie expiry time (24 hours)
    }
};

// const session=require("express-session");
app.use(session(sessionOptions));

// Initialize passport
app.use(passport.initialize());
app.use(passport.session());

// Configure passport-local
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Configure session options

app.use(flash()); 

app.use((req,res,next) =>{   
    res.locals.success=req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next(); 
}) ;
 
// Use routes
app.use("/listings/:id/reviews", reviewRouter);
app.use("/listings", listingRouter);
app.use("/",userRouter);

 
// Handle 404 errors
app.all('*', (req, res, next) => {
    next(new ExpressError(404, "Page Not Found"));
});  

// Error handling middleware
app.use((err, req, res, next) => {
    let { statusCode = 500, message } = err;
    res.status(statusCode).render("error.ejs", { message });
});

// Start server  
app.listen(8080, () => {
    console.log("Server is listening on port 8080");
});
 
 