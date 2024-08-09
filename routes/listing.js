const express = require('express');
const router=express.Router();
const wrapAsync = require('../utils/wrapAsync.js');
const { listingSchema } = require('../schema.js');
const ExpressError = require('../utils/ExpressError.js');
const Listing = require('../models/listing');
const { isLoggedIn, isOwner,validateListing } = require('../middleware.js');

//index
router.get("/", wrapAsync(async (req,res)=>{
    const allListings= await Listing.find({});
    res.render("listings/index.ejs",{allListings});
 }));

  //Show route
  router.get("/:id",wrapAsync(async (req,res) =>{
    let {id} =req.params;
    const listing = await Listing.findById(id)
    .populate({
      path:"reviews",
      populate:{
         path:"author",
      },
    })
    .populate("owner");
    if (!listing) {
      req.flash("error","Listing you requested for does not exist")
    }
    res.render("listings/show.ejs",{listing});
 }) )

 //New Route
router.get("/new",isLoggedIn,(req,res)=>{
    res.render("listings/new.ejs");
 })
 
//  //Create Route
router.post("/",isLoggedIn, validateListing,
   wrapAsync(async (req, res) => {
   
   const { listing, imageurl } = req.body;
   console.log(req.body);
   
   const newListing = new Listing({
       ...listing,
       image: { url: imageurl }
   });
   newListing.owner= req.user._id;
    await newListing.save();
    res.redirect("/listings");
    console.log(listing);
})
); 
        
   
 //Edit Route
 router.get("/:id/edit",isOwner,wrapAsync(async (req,res)=>{
    let {id} =req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs",{listing});
 }))
 //Update Route
 router.put("/:id",isLoggedIn,isOwner,validateListing,wrapAsync(async (req,res)=>{
    let {id} =req.params;
   await Listing.findByIdAndUpdate(id,{...req.body.listing});
    res.redirect(`/listings/${id}`); 
 }));

 //Delete Route
 router.delete("/:id",isLoggedIn,isOwner,wrapAsync(async (req,res)=>{
    let {id} =req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    res.redirect("/listings"); 
 }))
     
module.exports = router;