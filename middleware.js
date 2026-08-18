const listing = require("./models/listing");
const review = require("./models/review");
const {listingSchema} = require("./schema.js");
const ExpressError = require("./utils/ExpressError.js");


module.exports.isLoggedin = (req,res,next) => {
    if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl;
        req.flash("error","You must be signed in first!");
        return res.redirect("/login");
    }
    next();
};

module.exports.saveRedirectUrl = (req,res,next) =>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
};

module.exports.isOwner = async(req,res,next) =>{
    let { id } = req.params;
    let listings = await listing.findById(id);
    if(!listings.owner.equals(res.locals.currUser._id)){
        req.flash("error", "You are not owner of this listing!");
        return res.redirect(`/listing/${id}`);
    }
    next();
};

module.exports.isReviewOwner = async(req,res,next) =>{
    let { id,reviewId } = req.params;
    let reviews = await review.findById(reviewId);
    if(!reviews.author.equals(res.locals.currUser._id)){
        req.flash("error", "You are not the author of this review!");
        return res.redirect(`/listing/${id}`);
    }
    next();
};

module.exports.validateListing = (req,res,next) => {
    let{error} = listingSchema.validate(req.body);
    if(error) {
        throw new ExpressError(400, error)
    }else{
        next();
    }
};
