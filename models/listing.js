const mongoose = require('mongoose');
const reviews = require('./reviews');
const { ref, required } = require('joi');
const Review = require('./reviews.js')

const listingSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    image: {
        url:String,
        filename:String
    },
    price: {
        type: Number,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    country: {
        type: String,
        required: true
    },
    reviews:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Review",
        }
    ],
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
    },
    geometry:{
        type:{
            type:String,
            enum:['Point'],
            required:true
        },
        coordinates:{
            type:[Number],
            required:true
        }
    }
});

listingSchema.post("findOneAndDelete",async (listing) =>{
    if (listing) {
        await Review.deleteMany({_id :{$in :listing.reviews}});
    }
   
} )

module.exports = mongoose.model("Listing", listingSchema);
