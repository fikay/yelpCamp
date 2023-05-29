const express = require('express');
const router = express.Router()
const { schema, reviewSchema } = require("../utilities/schemaValidator");
const wrapAsync = require("../utilities/errorcatch");
const appError = require("../utilities/appError");
const campGround = require("../models/campground");
const review = require("../models/review");

//route for HOMEPAGE
router.get(
  "/",
  wrapAsync(async (req, res, next) => {
    const campgrounds = await campGround.find({});
    res.render("campground/home", { campgrounds });
  })
);

// ROUTE FOR NEW CAMPGROUND FORM
router.get("/new", (req, res) => {
  res.render("campground/newCampground");
});

//route to edit campground
router.get(
  "/:id/edit",
  wrapAsync(async (req, res, next) => {
    const { id } = req.params;
    const foundcamp = await campGround.findById(id);
    if (!foundcamp) {
      throw new appError("Camp not found", 404);
    }
    res.render("campground/editGround", { foundcamp });
  })
);



//Route to edit campground details
router.put(
  "/:id",
  wrapAsync(async (req, res, next) => {
    const { id } = req.params;
    const updateFoundcamp = await campGround.findByIdAndUpdate(id, req.body, {
      runValidators: true,
      new: true,
    });
    if (!updateFoundcamp) {
      throw new appError("Camp not found", 404);
    }
    res.redirect(`/campground/${updateFoundcamp._id}`);
  })
);

//route to show campground details
router.get(
  "/:id*",
  wrapAsync(async (req, res, next) => {
    const { id } = req.params;

    const findCamp = await campGround.findById(id).populate("Reviews");
    //console.log(findCamp.Reviews)
    const reviews = findCamp.Reviews;
    //Handle error if camp not found
    if (!findCamp) {
      throw new appError("Camp not found", 404);
    }
    res.render("campground/campDetails", { findCamp, reviews });
  })
);



//route to post new campground
router.post(
  "/",
  wrapAsync(async (req, res, next) => {
    const { error } = schema.validate(req.body, { abortEarly: false });
    if (error) {
      //console.log(error.details)
      const details = error.details.map((e, d) => e.message);
      //  const{Name} = details
      console.log(details);
      throw new appError(details, 400);
      //res.render("campground/newCampground", {details})
    } else {
      const newGround = new campGround(req.body);
      await newGround
        .save()
        .then(async () => {
          res.redirect("/campground");
        })
        .catch((err) => {
          //throw new appError('Missing fields', 401)
          next(err);
        });
    }
  })
);

//ROUTE TO DELETE CAMPGROUNDS
router.delete(
  "/:id",
  wrapAsync(async (req, res) => {
    const { id } = req.params;
    await campGround.findByIdAndDelete(id, req.body);
    res.redirect("/campground");
  })
);


module.exports = router;