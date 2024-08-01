const mongoose = require('mongoose');
const reviews = require('./reviews');
const { ref } = require('joi');
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
        type: Object,
        default: {
            url: "https://imageio.forbes.com/specials-images/dam/imageserve/1171238184/0x0.jpg?format=jpg&height=900&width=1600&fit=bounds"
        },
        set: (v) => (v === null || Object.keys(v).length === 0) ? {
            url: "https://imageio.forbes.com/specials-images/dam/imageserve/1171238184/0x0.jpg?format=jpg&height=900&width=1600&fit=bounds"
        } : v,
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
    ]
});

listingSchema.post("findOneAndDelete",async (listing) =>{
    if (listing) {
        await Review.deleteMany({_id :{$in :listing.reviews}});
    }
   
} )

module.exports = mongoose.model("Listing", listingSchema);
