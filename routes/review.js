const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync.js");
const Review = require("../Models/review.js");
const Listing = require("../Models/listing.js");
const { isLoggedIn,validateReview, isReviewAuthor } = require("../middlewares.js");
const reviewsController = require("../controllers/reviews.js");

// REVIEW
router.post(
  "/",
  isLoggedIn,
  validateReview,
  wrapAsync(reviewsController.postReview)
);

// REVIEW DELETE
router.delete(
  "/:reviewId",
  isLoggedIn,
  isReviewAuthor,
  wrapAsync(reviewsController.destroyReview)
);

module.exports = router;
