const express = require("express");
const router = express.Router({mergeParams:true});
const User=require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");
const { signup, renderSignUp, renderSignIn, login, logOut } = require("../controllers/user.js");


router.route("/signup")
    .get(renderSignUp)
    .post(wrapAsync(signup))

router.route("/login")
    .get(renderSignIn)
    .post(saveRedirectUrl,
        passport.authenticate("local",{failureRedirect:'/login',failureFlash:true}),
        login
    )
router.get("/logout",logOut);

module.exports=router;