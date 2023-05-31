const express = require("express");
const router = express.Router();
const wrapAsync = require("../utilities/errorcatch");
const user = require("../models/user");
const passport = require("passport");


router.get('/', (req,res)=>{
    res.render('users/login')
})

router.post('/', passport.authenticate('local', {failureFlash: true, failureMessage: true, failureRedirect:'/users/login'}), (req,res)=>{
    req.flash('success', 'Welcome Back')
    res.redirect('/campgrounds')

})

module.exports = router;