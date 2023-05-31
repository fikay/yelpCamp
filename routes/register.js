const express = require("express");
const router = express.Router();
const wrapAsync = require("../utilities/errorcatch");
const { userSchema } = require("../utilities/schemaValidator");
const user = require('../models/user')


router.get("/", (req, res) => {
    res.render('users/register.ejs')
});


router.post('/', wrapAsync( async(req,res)=>{
    
    // const {error } = userSchema.validate(req.body, {abortEarly:false})
    // if(error)
    // {
    //     console.log(error)
    //    req.flash("failed", "Form Validation error");
    //    res.redirect('/register')
    // }
   
    const{ username, password, email} = req.body;
    const userCreate = new user({email, username})
    try{
        const registeredUser = await user.register(userCreate,password)
         req.flash("success", "Registration successful");
         res.redirect('/campground')
    }
    catch(err)
    {
        console.log(req.body)
        console.log(err)
       req.flash("failed", `${err.message}`);
       res.redirect('/register')
    }
}))



module.exports =router;