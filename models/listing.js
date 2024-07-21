// const mongoose = require('mongoose');

// const listingSchema=new mongoose.Schema({
//     title:{
//         type:String,
//         required:true
//     },
//     description:{
//         type:String,
//         required:true
//     },
//     title:{
//         type:String,
//         required:true
//     },
//     image:{
//         type:Object,
//         default:{url:"https://imageio.forbes.com/specials-images/dam/imageserve/1171238184/0x0.jpg?format=jpg&height=900&width=1600&fit=bounds"},
//         set: (v) => (v === null || Object.keys(v).length === 0) ? {
//             url: "https://imageio.forbes.com/specials-images/dam/imageserve/1171238184/0x0.jpg?format=jpg&height=900&width=1600&fit=bounds"
//         } : v,
//     },
//     price:{
//         type:Number,
//         required:true
//     },
//     location:{
//         type:String,
//         required:true
//     },
//     country:{
//         type:String,
//         required:true
//     },
// })

// module.exports = mongoose.model("Listing",listingSchema);


const mongoose = require('mongoose');

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
});

module.exports = mongoose.model("Listing", listingSchema);
