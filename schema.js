const joi = require("joi");
const review = require("./Models/review");

module.exports.listingSchema = joi.object({
    Listing : joi.object({
        title : joi.string().required(),
        description : joi.string().required(),
        image : joi.string().allow("",null),
        price : joi.number().required(),
        location : joi.string().required(),
        country : joi.string().required(),
        category : joi.string().required()
    }).required(),
});

module.exports.reviewSchema = joi.object({
    review : joi.object({
        rating : joi.number().required().min(1).max(5),
        comment : joi.string().required()
    }).required(),
});