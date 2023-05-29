const express = require("express");
const router = express.Router({mergeParams:true});
const { reviewSchema } = require("../utilities/schemaValidator");
const wrapAsync = require("../utilities/errorcatch");
const appError = require("../utilities/appError");
const campGround = require("../models/campground");
const review = require("../models/review");

// ROUTE FOR Camp Review
router.post("/", async (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    next(new appError(`${error.message}`, 400));
  } else {
     const { id } = req.params;
     console.log(id)
    const camp = await campGround.findById(id);
    const reviewBody = new review(req.body);
    camp.Reviews.push(reviewBody);
    await reviewBody.save();
    await camp.save();
    res.redirect(`/campground/${camp.id}`);
  }
});

//ROUTE TO DELETE REVIEWS
router.delete(
  "/:reviewId",
  wrapAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    // console.log(reviewId)
    const rev = await review.findById(reviewId);
    //console.log(rev);
    await campGround.findByIdAndUpdate(id, { $pull: { Reviews: reviewId } });
    await review.findByIdAndDelete(reviewId);
    res.redirect(`/campground/${id}`);
  })
);


module.exports = router