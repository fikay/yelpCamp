const express = require("express");
const router = express.Router();
const wrapAsync = require("../utilities/errorcatch");
const user = require("../models/user");
const passport = require("passport");
const { storeReturnTo } = require("../middleware/isLoggedin");
const { loggedIn } = require("../middleware/isLoggedin");

router
  .route("/")
  .get((req, res) => {
    res.render("users/login");
  })
  .post(
    storeReturnTo,
    passport.authenticate("local", {
      failureFlash: true,
      failureMessage: true,
      failureRedirect: "/login",
    }),
    (req, res) => {
      req.flash("success", `Welcome Back ${req.user.username}`);
      const redirectUrl = res.locals.returnTo || "/campground";
      res.redirect(redirectUrl);
    }
  );

router.get("/reviews", loggedIn, async (req, res) => {
  const allReviews = await user.findById(req.user.id).populate("reviews");
  const userReviews = allReviews.reviews;
  console.log(userReviews);
  res.render("users/reviews", { userReviews });
});


module.exports = router;