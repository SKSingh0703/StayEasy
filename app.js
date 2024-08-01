const express = require('express');
const app=express();
const mongoose = require('mongoose');
const Listing = require('./models/listing');
const path = require('path');
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require('./utils/wrapAsync.js');
const ExpressError = require('./utils/ExpressError.js');

const MONGO_URL='mongodb://127.0.0.1:27017/wanderlust';
main().then(()=>{console.log("Connected to DB");}).catch((err)=>{console.log(err)});

async function main(){
    await mongoose.connect(MONGO_URL);
};   
 
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.engine('ejs',ejsMate);
app.use(express.static(path.join(__dirname,"/public")));

//index
app.get("/listings", wrapAsync(async (req,res)=>{
    const allListings= await Listing.find({});
    res.render("listings/index.ejs",{allListings});
 }));
 
//New Route
app.get("/listings/new",(req,res)=>{
    res.render("listings/new.ejs");
 })
 
//  //Create Route
app.post("/listings", 
   wrapAsync(async (req, res) => {
    if (req.body.listing) {
        throw new ExpressError(400,"Send valid data for listing");
    }
   const { listing, imageurl } = req.body;
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
 app.get("/listings/:id/edit",wrapAsync(async (req,res)=>{
    let {id} =req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs",{listing});
 }))
 //Update Route
 app.put("/listings/:id",wrapAsync(async (req,res)=>{
    let {id} =req.params;
    if (req.body.listing) {
        throw new ExpressError(400,"Send valid data for listing");
    }
   await Listing.findByIdAndUpdate(id,{...req.body.listing});
    res.redirect(`/listings/${id}`); 
 }));

 //Delete Route
 app.delete("/listings/:id",wrapAsync(async (req,res)=>{
    let {id} =req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    res.redirect("/listings"); 
 }))
     
 //Show route
 app.get("/listings/:id",wrapAsync(async (req,res) =>{
    let {id} =req.params;
    const listing = await Listing.findById(id);
    res.render("listings/show.ejs",{listing});
 }) )

 
app.get("/",(req,res)=>{
    res.send("Working");
});

app.all('*',(req,res,next)=>{
    next(new ExpressError(404,"Page Not Found"));
})

app.use((err,req,res,next)=>{
    let {statusCode=500 , message} = err;
    res.status(statusCode).send(message);
})

app.listen(8080 , ()=>{
    console.log("Server is listening on port 8080");
});     