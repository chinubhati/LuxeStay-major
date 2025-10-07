const { response } = require("express");
const listing = require("../Models/listing");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

// module.exports.index = async (req, res) => {
//     const allLists = await listing.find({});
//     res.render("listings/index.ejs", { allLists });
//   };

module.exports.renderNewForm = (req, res) => {
  res.render("listings/new.ejs");
};

module.exports.showListing = async (req, res) => {
    let { id } = req.params;
    const showID = await listing
      .findById(id)
      .populate({
        path: "reviews",
        populate: {
          path: "author",
        },
      })
      .populate("owner");
    if (!showID) {
      req.flash("error", "Listing does not exist!");
      res.redirect("/listings");
    } else {
      res.render("listings/show.ejs", { showID });
    }
  };

  module.exports.postListing = async (req, res, next) => {
      let response = await geocodingClient
      .forwardGeocode({
      query: req.body.Listing.location,
      limit: 1,
    })
      .send()
      // console.log(response.body.features[0].geometry);

      const listings = new listing(req.body.Listing);
      console.log(req.body.Listing)
      let url = req.file.path;
      let filename = req.file.filename;
      listings.image = {url,filename}
      listings.owner = req.user._id;
      listings.geometry = response.body.features[0].geometry;
      let savedinfo = await listings.save();
      console.log(savedinfo);
      
      req.flash("Success", "Listing registered successfully!");
      res.redirect("/listings");
};

module.exports.editListing = async (req, res) => {
    let { id } = req.params;
    const showID = await listing.findById(id);
    if (!showID) {
      req.flash("error", "Listing does not exist!");
      res.redirect("/listings");
    }else{
      let originalimage = showID.image.url;
    originalimage = originalimage.replace("/upload","/upload/w_250");
    res.render("listings/edit.ejs", { showID, originalimage });
    }
};

module.exports.updateListing = async (req, res) => {
    let { id } = req.params;
    let listings = await listing.findByIdAndUpdate(id, { ...req.body.Listing });

    if(typeof req.file !== "undefined"){
      let url = req.file.path;
      let filename = req.file.filename;
      listings.image = {url,filename};
      await listings.save();
    }
    req.flash("Success", "Listing updated!");
    res.redirect(`/listings/${id}`);
};

module.exports.deleteListing = async (req, res) => {
    let { id } = req.params;
    await listing.findByIdAndDelete(id);
    req.flash("Success", "Listing Deleted!");
    res.redirect("/listings");
};

module.exports.index = async (req, res) => {
  try {
    let query = {};

    // --- Dropdown filter ---
    if (req.query.category && req.query.category !== "") {
      query.category = req.query.category;
    }

    // --- Search filter ---
    if (req.query.search && req.query.search.trim() !== "") {
  const searchTerm = req.query.search.trim();
  const rangeMatch = searchTerm.match(/^(\d+)-(\d+)$/);

  if (rangeMatch) {
    // --- Range search ---
    query.price = { $gte: Number(rangeMatch[1]), $lte: Number(rangeMatch[2]) };
  } else if (!isNaN(searchTerm)) {
    // --- Exact price search ---
    query.price = Number(searchTerm);
  } else {
    // --- Text search ---
    const regex = new RegExp(searchTerm, "i");
    query.$or = [
      { title: regex },
      { category: regex },
      { location: regex },
      { country: regex }
    ];
  }
}

    // --- Fetch data ---
    let allLists = await listing.find(query);

    // --- Agar koi match nahi mila ---
    if(allLists.length === 0){
  req.flash("error", "No listings found for your search.");
  return res.redirect("/listings");
}

    res.render("listings/index", { allLists, messages: req.flash(),req });
  } catch (err) {
    console.error(err);
    req.flash("error", "Server error occurred.");
    res.redirect("/listings");
  }
};