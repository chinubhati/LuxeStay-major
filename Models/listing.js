const  mongoose = require('mongoose');
const Review = require('./review.js');
const { ref, required } = require('joi');
const Schema = mongoose.Schema;

let listSchema = new Schema({
    title:{
        type:String,
        required:true,
    },
    description:{
        type:String,
        required:true,
    },
    image:{
        url:String,
        filename:String
    }, 
    price:Number,
    location:String,
    country:String,
    reviews : [
        {
            type : Schema.Types.ObjectId,
            ref : "Review"
        }
    ],
    owner : {
        type : Schema.Types.ObjectId,
        ref : "User"
    },
    geometry : {
        type: {
      type: String, // Don't do `{ location: { type: String } }`
      enum: ['Point'], // 'location.type' must be 'Point'
      required: true
    },
    coordinates: {
      type: [Number],
      required: true
    }
    },
    category :{
        type: String,
        enum : ["trending","beach","room","dome","castle","camping","boat","pool","mountain","iconic-cities","farm","arctic"],
        required : true
    }
});

listSchema.post('findOneAndDelete',async(listing)=>{
    if(listing){
        await Review.deleteMany({_id: {$in : listing.reviews}});
    }
});

const Listing = mongoose.model('Listing',listSchema);

module.exports = Listing;