const express = require('express');
const router=express.Router();
const wrapAsync = require('../utils/wrapAsync.js');
const { listingSchema } = require('../schema.js');
const ExpressError = require('../utils/ExpressError.js');
const Listing = require('../models/listing');
const { isLoggedIn, isOwner,validateListing } = require('../middleware.js');
const { index, renderNewForm, showListings, createListing, renderEditForm, updateListing, deleteListing } = require('../controllers/listings.js');



const multer = require('multer');
const { storage } = require('../cloudConfig.js');
const upload = multer({storage});

//index and create
router
   .route("/")
   .get( wrapAsync(index))
   .post(isLoggedIn, upload.single('listing[image]'),validateListing,
      wrapAsync(createListing)
   );

 //New Route
 router.get("/new",isLoggedIn,renderNewForm)

//Show route and update and delete request
router.route("/:id")
   .get(wrapAsync(showListings) )
   .put(isLoggedIn,isOwner,upload.single('listing[image]'),validateListing,wrapAsync(updateListing))
   .delete(isLoggedIn,isOwner,wrapAsync(deleteListing))
 
//Edit Route
router.get("/:id/edit",isOwner,wrapAsync(renderEditForm));
     
module.exports = router;