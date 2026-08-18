const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapasync.js");
const ExpressError = require("../utils/ExpressError.js");
const{listingSchema , reviewSchema} = require("../schema.js");
const listing = require("../models/listing.js")
const {isLoggedin,isOwner,validateListing} = require("../middleware.js");
const {index,rendernewform,showListing,
    createListing,editListing,updateListing,deleteListing} = require("../controller/listing.js");
const multer  = require('multer')
const{storage} = require("../cloudConfig.js")
const upload = multer({storage })



router
.route("/")
.get(wrapAsync(index))
.post(
    isLoggedin,
    upload.single("listing[image]"),
    validateListing,
     wrapAsync(createListing));



router
.route("/new")
.get(isLoggedin,rendernewform);    


router
.route("/:id")
.get( wrapAsync(showListing))
.put( isLoggedin, isOwner,
    upload.single("listing[image]"),
    validateListing, wrapAsync(updateListing))
.delete( isLoggedin,isOwner, wrapAsync(deleteListing));


router
.route("/:id/edit")
.get( isLoggedin,isOwner,
 wrapAsync(editListing));

 
module.exports = router;
