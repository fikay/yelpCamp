const campGround = require("../models/campground");
const review = require("../models/review");
const user = require("../models/user");
const appError = require("../utilities/appError");
const { schema, reviewSchema } = require("../utilities/schemaValidator");
const control = module.exports

control.addReview = async (req, res, next) => {
 
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    //next(new appError(`${error.message}`, 400));
     const { id } = req.params;
      req.flash("error", `${error.message}`)
      res.redirect(`/campground/${id}`)
  } else {
     const { id } = req.params;
    const camp = await campGround.findById(id);
    const userfound = await user.findById(req.user.id)
    
    const reviewBody = new review(req.body);
    reviewBody.author = req.user;
    userfound.reviews.push(reviewBody)
    camp.Reviews.push(reviewBody);
    await userfound.save();
    await reviewBody.save();
    await camp.save();
    req.flash("success", 'Review added to campground')
    res.redirect(`/campground/${camp.id}`);
  }
}


control.deletion = async (req, res) => {
  const { id, reviewId } = req.params;
  const rev = await review.findById(reviewId);
  //console.log(rev);
  await campGround.findByIdAndUpdate(id, { $pull: { Reviews: reviewId } });
  await user.findByIdAndUpdate(req.user.id, { $pull: { reviews: reviewId } });
  await review.findByIdAndDelete(reviewId);
  await review.findByIdAndDelete(reviewId);
  req.flash("success", "Review deleted from campground");
  res.redirect(`/campground/${id}`);
};