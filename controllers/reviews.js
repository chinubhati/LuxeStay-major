const Review = require("../Models/review");
const Listing = require("../Models/listing");

module.exports.postReview = async (req, res) => {
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    newReview.author = req.user._id;
    console.log(newReview);
    
    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();

    console.log("Review saved");
    req.flash("Success", "Review added successfully!");
    res.redirect(`/listings/${listing._id}`);
    // res.send("Saved");
};

module.exports.destroyReview = async (req, res) => {
    let { id, reviewId } = req.params;
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash("Success", "Review Deleted!");
    res.redirect(`/listings/${id}`);
};