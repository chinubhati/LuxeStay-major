const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { listingSchema } = require("../schema.js");
const listing = require("../Models/listing.js");
const { isLoggedIn, isOwner } = require("../middlewares.js");
const multer = require("multer");
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });

const listingsController = require("../controllers/listings.js");

// VALIDATE
const validateListing = (req, res, next) => {
  let { error } = listingSchema.validate(req.body);
  console.log(error);
  if (error) {
    console.log(error)
    throw new ExpressError(400, error);
  } else {
    next();
  }
};

router
  .route("/")
  // index
  .get(wrapAsync(listingsController.index))
  // post
  .post(
    isLoggedIn,
    upload.single("Listing[image]"),
    validateListing,
    wrapAsync(listingsController.postListing)
  );

// CREATE ROUTE
router.get("/new", isLoggedIn, listingsController.renderNewForm);

router
  .route("/:id")
  // show
  .get(wrapAsync(listingsController.showListing))
  // update
  .put(
    isLoggedIn,
    isOwner,
    upload.single("Listing[image]"),
    validateListing,
    wrapAsync(listingsController.updateListing)
  )
  // delete
  .delete(isLoggedIn, isOwner, wrapAsync(listingsController.deleteListing));

// EDIT ROUTE
router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  wrapAsync(listingsController.editListing)
);

module.exports = router;
