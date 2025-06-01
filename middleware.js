const Listing = require("./models/listing");
const Review = require("./models/review");

const ExpressError = require("./utils/ExpressError.js");
const { listingSchema, reviewSchema } = require("./schema.js");

module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.redirecturl = req.originalUrl;
    req.flash("error", "You must be logged in to create a listing!");
    return res.redirect("/login");
  }
  next();
};

module.exports.saveRedirectUrl = async (req, res, next) => {
  if (req.session.redirecturl) {
    res.locals.redirecturl = req.session.redirecturl;
    delete req.session.redirecturl;
  }
  next();
};

module.exports.isOwner = async (req, res, next) => {
   let { id } = req.params;
    let listing = await Listing.findById(id);
  if (!listing.owner._id.equals(res.locals.currentUser._id)) {
   req.flash("error", "You are not the owner of this listing");
   return res.redirect(`/listings/${id}`);
    }
  next();
};
  
module.exports.validateListing = (req, res, next) => {
const { error } = listingSchema.validate(req.body);
  if (error) {
   const errMsg = error.details.map((el) => el.message).join(","); 
   throw new ExpressError(errMsg, 400);
  } else { 
    next();
  }
};

module.exports.validateReview = (req, res, next) => {
const { error } = reviewSchema.validate(req.body); // ✅
  if (error) {
   const errMsg = error.details.map((el) => el.message).join(","); 
   throw new ExpressError(errMsg, 400);
  } else {
    next();
  }
};  

module.exports.isReviewAuthor = async (req, res, next) => {
   let { id, reviewId } = req.params;
    let review = await Review.findById(reviewId);
  if (!review.author._id.equals(res.locals.currentUser._id)) {
   req.flash("error", "You are not the Author of this Review");
   return res.redirect(`/listings/${id}`);
    }
  next();
};