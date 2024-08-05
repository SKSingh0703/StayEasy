const express = require('express');
const router=express.Router();
const wrapAsync = require('../utils/wrapAsync.js');
const { listingSchema } = require('../schema.js');
const ExpressError = require('../utils/ExpressError.js');
const Listing = require('../models/listing');


const validateListing = (req,res,next) =>{
    let {error} = listingSchema.validate(req.body);
    if (error) {
        let errMsg = error.details.map((el) =>el.message).join(",");
        throw new ExpressError(400,errMsg);
    }
    else next();
}


//index
router.get("/", wrapAsync(async (req,res)=>{
    const allListings= await Listing.find({});
    res.render("listings/index.ejs",{allListings});
 }));

  //Show route
  router.get("/:id",wrapAsync(async (req,res) =>{
    let {id} =req.params;
    const listing = await Listing.findById(id).populate("reviews");
    res.render("listings/show.ejs",{listing});
 }) )

 //New Route
router.get("/new",(req,res)=>{
    res.render("listings/new.ejs");
 })
 
//  //Create Route
router.post("/", validateListing,
   wrapAsync(async (req, res) => {
   
   const { listing, imageurl } = req.body;
   console.log(req.body);
   
   const newListing = new Listing({
       ...listing,
       image: { url: imageurl }
   });
    await newListing.save();
    res.redirect("/listings");
    console.log(listing);
})
); 
        
   
 //Edit Route
 router.get("/:id/edit",wrapAsync(async (req,res)=>{
    let {id} =req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs",{listing});
 }))
 //Update Route
 router.put("/:id",validateListing,wrapAsync(async (req,res)=>{
    let {id} =req.params;
   await Listing.findByIdAndUpdate(id,{...req.body.listing});
    res.redirect(`/listings/${id}`); 
 }));

 //Delete Route
 router.delete("/:id",wrapAsync(async (req,res)=>{
    let {id} =req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    res.redirect("/listings"); 
 }))
     
module.exports = router;