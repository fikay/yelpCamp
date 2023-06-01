const express = require("express");
const router = express.Router();
const wrapAsync = require("../utilities/errorcatch");
const user = require("../models/user");
const passport = require("passport");


router.get("/", (req, res) => {
  if (!req.isAuthenticated()) {
    req.flash("error", "You are not logged In");
    res.redirect("/campground");
  } else {
     req.logout(function (err) {
       if (err) {
         return next(err);
       }
       req.flash("success", "Goodbye!");
       res.redirect("/campground");
     });
  }

});

module.exports = router;