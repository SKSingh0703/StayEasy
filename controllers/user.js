const User = require("../models/user");


module.exports.renderSignUp=(req,res) =>{
    res.render("users/signup.ejs");
};

module.exports.signup=async(req,res) =>{
    try {
    let {username, email ,password}= req.body;
    const newUser=new User({email,username});
    const registerUser =await User.register(newUser,password);
    console.log(registerUser);
    req.login(registerUser,(err)=>{
        if (err) {
            return next(err);
        }
        req.flash("success","Welcome to WanderLust");
        res.redirect("/listings");
    })
    } catch (error) {
        console.log(error);
        
    }
};

module.exports.renderSignIn=(req,res) =>{
    res.render("users/login.ejs");
};

module.exports.login=async(req,res) =>{
    req.flash("success","Welcome to WanderLust ! You are logges in...");
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
};

module.exports.logOut=(req,res) =>{
    req.logOut((err)=>{
        if (err) {
            next(err);
        }
        req.flash("success","You are logged out !!!");
        res.redirect("/listings");
    });
};
