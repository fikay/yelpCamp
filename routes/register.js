const express = require("express");
const router = express.Router();
const wrapAsync = require("../utilities/errorcatch");
const { userSchema } = require("../utilities/schemaValidator");
const user = require('../models/user')


router
  .route("/")
  .get((req, res) => {
    res.render("users/register.ejs");
  })
  .post(wrapAsync(async (req, res, next) => {
      // const {error } = userSchema.validate(req.body, {abortEarly:false})
      // if(error)
      // {
      //     console.log(error)
      //    req.flash("failed", "Form Validation error");
      //    res.redirect('/register')
      // }

      const { username, password, email } = req.body;
      const userCreate = new user({ email, username });
      try {
        const registeredUser = await user.register(userCreate, password);
        req.login(registeredUser, (err) => {
          if (err) {
            return next(err);
          }
          req.flash("success", "Registration successful");
          res.redirect("/campground");
        });
      } catch (err) {
        console.log(req.body);
        console.log(err);
        req.flash("error", `${err.message}`);
        res.redirect("/register");
      }
    })
  );





module.exports =router;