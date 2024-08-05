const express = require('express');
const router=express.Router({mergeParams:true});
const wrapAsync = require('../utils/wrapAsync.js');
const ExpressError = require('../utils/ExpressError.js');
const { reviewSchema } = require('../schema.js');
const Review = require('../models/reviews.js');
const Listing = require('../models/listing');


const validateReviews = (req,res,next) =>{
    let {error} = reviewSchema.validate(req.body);
    if (error) {
        let errMsg = error.details.map((el) =>el.message).join(",");
        throw new ExpressError(400,errMsg);
    }
    else next();
}


// Reviews post route
router.post("/", validateReviews ,wrapAsync(async (req, res, next) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
        return next(new ExpressError(404, "Listing not found"));
    }
    const newReview = new Review(req.body.review);
    await newReview.save();
    listing.reviews.push(newReview);
    await listing.save();
    res.redirect(`/listings/${id}`);
}));

//Delete review route
router.delete("/:reviewId",wrapAsync(async (req,res) =>{
    let {id,reviewId} = req.params;
    await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/listings/${id}`);
}));

module.exports = router;