const Listing = require("../models/listing");

// INDEX - Fetch all listings and display them
module.exports.index = async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
};

// NEW - Render the form to create a new listing
module.exports.renderNewForm = (req, res) => {
    res.render("listings/new.ejs");
};

// SHOW - Display details for one specific listing
module.exports.showListing = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate("reviews");
    
    // If listing doesn't exist, flash error and redirect
    if (!listing) {
        req.flash("error", "The listing you are looking for does not exist!");
        return res.redirect("/listings");
    }
    
    res.render("listings/show.ejs", { listing });
};

// CREATE - Logic to save a new listing to the Database
module.exports.createListing = async (req, res) => {
    const newListing = new Listing(req.body.listing);
    await newListing.save();
    
    req.flash("success", "Successfully created a new listing!");
    res.redirect("/listings");
};

// EDIT - Render the form to edit an existing listing
module.exports.renderEditForm = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    
    if (!listing) {
        req.flash("error", "The listing you want to edit does not exist!");
        return res.redirect("/listings");
    }
    
    res.render("listings/edit.ejs", { listing });
};

// UPDATE - Save the edited changes to the Database
module.exports.updateListing = async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    
    req.flash("success", "Listing updated successfully!");
    res.redirect(`/listings/${id}`);
};

// DESTROY - Delete a listing from the Database
module.exports.destroyListing = async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log("Deleted:", deletedListing);
    
    req.flash("success", "Listing deleted!");
    res.redirect("/listings");
};