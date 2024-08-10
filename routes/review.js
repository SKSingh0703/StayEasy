const express = require('express');
const router=express.Router({mergeParams:true});
const wrapAsync = require('../utils/wrapAsync.js');
const ExpressError = require('../utils/ExpressError.js');
const { reviewSchema } = require('../schema.js');
const Review = require('../models/reviews.js');
const Listing = require('../models/listing');
const { validateReviews, isLoggedIn, isAuthor } = require('../middleware.js');
const { createNewReview, deleteReview } = require('../controllers/reviews.js');


// Reviews post route
router.post("/",isLoggedIn, validateReviews ,wrapAsync(createNewReview));

//Delete review route
router.delete("/:reviewId",isLoggedIn,isAuthor,wrapAsync(deleteReview));

module.exports = router;