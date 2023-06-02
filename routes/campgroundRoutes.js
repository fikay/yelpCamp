const express = require('express');
const router = express.Router()
const { schema, reviewSchema } = require("../utilities/schemaValidator");
const wrapAsync = require("../utilities/errorcatch");
const { loggedIn } = require("../middleware/isLoggedin");
const{isOwner} = require("../middleware/isOwner")
const campground = require('../controllers/campground')
const {storage} = require('../cloudinary/cloudinaryConfig')
const multer = require("multer");
const upload = multer({storage})

//route for HOMEPAGE
router
  .route("/")
  .get(wrapAsync(campground.index))
  .post( upload.array("Image"), wrapAsync(campground.createNewCamp));


// ROUTE FOR NEW CAMPGROUND FORM
//prerequisite - User must be logged in
router.get("/new", loggedIn, campground.newCamp);

//route to edit campground details
//prerequisite - User must be logged in and must be the creator of the camp site
router.get( "/:id/edit", loggedIn,isOwner,wrapAsync(campground.campDetails));

//route to show campground details
//Route to edit campground details :-prerequisite - User must be logged in and must be the creator of the camp site
//ROUTE TO DELETE CAMPGROUNDS
router.route("/:id")
  .get( wrapAsync(campground.details))
  .put(loggedIn, isOwner, upload.array('Images'), wrapAsync(campground.editcampDetails))
  .delete(loggedIn, isOwner, wrapAsync(campground.deletion));




module.exports = router;