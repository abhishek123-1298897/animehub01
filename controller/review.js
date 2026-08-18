const listing = require("../models/listing.js");
const review = require("../models/review.js");

module.exports.createReview = async(req,res) =>{
    let listings = await listing.findById(req.params.id);
    let newReview = new review(req.body.review);
     newReview.author = req.user._id;
    listings.reviews.push(newReview);
    await newReview.save();
    await listings.save();
    req.flash("success", "New review added !");
    res.redirect(`/listing/${listings._id}`);

};

module.exports.destroyReview = async(req,res) =>{
        let { id, reviewId} = req.params;
        await listing.findByIdAndUpdate(id,{$pull : {reviews: reviewId}});
        await review.findByIdAndDelete(reviewId);
        req.flash("success", "Review deleted!");
        res.redirect(`/listing/${id}`);

};