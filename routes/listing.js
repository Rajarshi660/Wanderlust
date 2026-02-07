const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const { listingSchema } = require("../schema.js");
const ExpressError = require("../utils/ExpressError.js");
const listingController = require("../controllers/listings.js");

const validateListing = (req, res, next) => {
    let { error } = listingSchema.validate(req.body);
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
};

router.route("/")
    .get(wrapAsync(listingController.index))
    .post(validateListing, wrapAsync(listingController.createListing));

router.get("/new", listingController.renderNewForm);

router.route("/:id")
    .get(wrapAsync(listingController.showListing))
    .put(validateListing, wrapAsync(listingController.updateListing))
    .delete(wrapAsync(listingController.destroyListing));

router.get("/:id/edit", wrapAsync(listingController.renderEditForm));

module.exports = router;