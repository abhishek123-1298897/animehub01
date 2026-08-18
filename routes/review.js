const express = require("express");
const router = express.Router({mergeParams: true});
const ExpressError = require("../utils/ExpressError.js");
const wrapAsync = require("../utils/wrapasync.js");
const{ reviewSchema} = require("../schema.js");
const review = require("../models/review.js")
const listing = require("../models/listing.js")
const {isLoggedin, isReviewOwner,saveRedirectUrl} = require("../middleware.js");
const reviewController = require("../controller/review.js");

const validatereview = (req,res,next) => {
    let{err} = reviewSchema.validate(req.body);
    if(err) {
        throw new ExpressError(400, err)
    }else{
        next();
    }
};

// reviews
router.post("/",isLoggedin,saveRedirectUrl, validatereview, wrapAsync(reviewController.createReview));

// delete review

router.delete("/:reviewId",
    isLoggedin,
    saveRedirectUrl,
    isReviewOwner,
    wrapAsync(reviewController.destroyReview));

module.exports = router;