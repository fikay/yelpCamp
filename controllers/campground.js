const campGround = require("../models/campground");
const appError = require("../utilities/appError");
const { schema, reviewSchema } = require("../utilities/schemaValidator");
const control = module.exports

//controller to display all campgrounds
control.index = async (req, res, next) => {
  const campgrounds = await campGround.find({});
  res.render("campground/home", { campgrounds });
};

//controller to show campground details
control.details = async (req, res, next) => {
  const { id } = req.params;
  const findCamp = await campGround
    .findById(id)
    .populate({
      path: "Reviews",
      populate: {
        path: "author",
      },
    })
    .populate("author");
  const reviews = findCamp.Reviews;
  //Handle error if camp not found
  if (!findCamp) {
    throw new appError("Camp not found", 404);
  }
  const loggedIn = req.isAuthenticated();
  res.render("campground/campDetails", { findCamp, reviews, loggedIn });
};

// controller to show new campground form 
control.newCamp = (req, res) => {
  res.render("campground/newCampground");
};

//controller to edit campground details
control.campDetails = async (req, res, next) => {
  const { id } = req.params;
  const foundcamp = await campGround.findById(id).populate("author");
  if (!foundcamp) {
    throw new appError("Camp not found", 404);
  }
  res.render("campground/editGround", { foundcamp });
};

//controller to push changes to camp details
control.editcampDetails = async (req, res, next) => {
  const { id } = req.params;
  const updateFoundcamp = await campGround
    .findByIdAndUpdate(id, req.body, {
      runValidators: true,
      new: true,
    })
    .populate("author");
  if (updateFoundcamp.author.id !== req.user.id) {
    req.flash("error", "You are not the author of the campground");
    res.redirect("/campground");
  } else {
    if (!updateFoundcamp) {
      throw new appError("Camp not found", 404);
    } else {
      req.flash("success", "Camp Updated successfully");
      res.redirect(`/campground/${updateFoundcamp._id}`);
    }
  }
};

//controller to create new campground
control.createNewCamp = async (req, res, next) => {
  const { error } = schema.validate(req.body, { abortEarly: false });
  if (error) {
    req.flash("error", `Form Validation error ${error.message}`);
    res.redirect("/campground/new");
  } else {
    const newGround = new campGround(req.body);
    newGround.author = req.user._id;
    await newGround
      .save()
      .then(async () => {
        req.flash("success", "Campground created successfully");
        res.redirect(`/campground/${newGround.id}`);
      })
      .catch((err) => {
        req.flash("error", "Campground was not created ");
        res.redirect("/campground");
        //throw new appError('Missing fields', 401)
        //next(err);
      });
  }
};


//controller to delete camp ground
control.deletion = async (req, res) => {
  const { id } = req.params;
  await campGround
    .findByIdAndDelete(id, req.body)
    .then(() => {
      req.flash("success", "Campground deleted successfully");
      res.redirect("/campground");
    })
    .catch((err) => {
      req.flash("error", "Campground was not Found ");
      res.redirect("/campground");
    });
};