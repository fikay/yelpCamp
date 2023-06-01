const express = require("express");
const router = express.Router({mergeParams:true});
const { reviewSchema } = require("../utilities/schemaValidator");
const wrapAsync = require("../utilities/errorcatch");
const {loggedIn} = require('../middleware/isLoggedin')
const { notOwner,isreviewOwner } = require("../middleware/isOwner");
const Review = require('../controllers/review')

// ROUTE FOR adding Camp Review
//prerequisite: 
//Check if user is logged in - if no, redirect to login page
//Check if user is owner of the Campground - if yes, stop from posting review
// if checks are passed post review
router.post("/", loggedIn, notOwner,Review.addReview );

//ROUTE TO DELETE REVIEWS
//prerequisite: 
//Check if user is logged in - if no, redirect to login page
//Check if user is owner of the review - if yes, stop from deleting review
// if checks are passed post review
router.delete( "/:reviewId", loggedIn,isreviewOwner,wrapAsync(Review.deletion));


module.exports = router