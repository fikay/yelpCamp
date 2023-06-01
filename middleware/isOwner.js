const campGround = require("../models/campground");
const review = require("../models/review");
module.exports.isOwner = async (req, res, next) => {
  const { id } = req.params;
  const foundcamp = await campGround.findById(id).populate("author");
  if (foundcamp.author.id !== req.user.id) {
    req.flash("error", "You are not the author of the campground");
   return res.redirect(`/campground/${foundcamp.id}`);
  }
  next();
};


module.exports.notOwner =async(req,res, next)=>{
  const { id } = req.params;
    const foundcamp = await campGround.findById(id).populate("author");
    if (foundcamp.author.id === req.user.id) {
      req.flash("error", "You do not have permission to post a review as you are the owner");
     return  res.redirect(`/campground/${foundcamp.id}`);
    }
    next();
}

module.exports.isreviewOwner = async (req, res, next) => {
  const { id, reviewId } = req.params;
  const foundcamp = await campGround.findById(id).populate("author");
 const foundReview = await review.findById(reviewId).populate("author")
 console.log(foundReview.author.id)
 console.log(req.user.id);
 if(foundReview.author.id !== req.user.id)
 {
   req.flash("error", "You are not the author of the review");
  return res.redirect(`/campground/${foundcamp.id}`);
 }
 next()
};