const express = require('express')
const app = express()
const path = require('path')
const morgan = require('morgan')
const methodOverride = require('method-override')
const { schema, reviewSchema } = require("./utilities/schemaValidator");
const ejsMate = require('ejs-mate')
const wrapAsync  = require("./utilities/errorcatch");
const appError = require('./utilities/appError')
const campGround = require('./models/campground')
const review = require('./models/review')
const mongoose =  require('mongoose')
const inspect = require('util')

//Connect to mongoDb
mongoose
  .connect("mongodb://127.0.0.1:27017/yelpCamp")
  .then(() => {
    console.log("connection open");
  })
  .catch((err) => {
    console.log("Error Connecting");
    console.log(err);
  });

// access views folder and views engine
app.engine('ejs', ejsMate)
app.set('views', path.join(__dirname,'views'))
app.set('view engine','ejs')


//Middleware for responsebody
app.use(express.urlencoded({ extended: true }));

//middleware for method override
app.use(methodOverride('_method'))

// using morgan middleware
app.use(morgan('tiny'))



//Listener for server
app.listen(3000, ()=>{
    console.log('listening')
})


//route for index 
app.get(
  "/campground",
  wrapAsync(async (req, res, next) => {
    
      const campgrounds = await campGround.find({});
      res.render("campground/home", { campgrounds });
  
  })
);

app.get("/campground/new", (req, res) => {
  res.render('campground/newCampground');
});

//route to edit campground
app.get('/campground/:id/edit', wrapAsync( async (req,res,next)=>{
   const{id} = req.params
   const foundcamp = await campGround.findById(id);
    if(!foundcamp)
    {
      throw new appError('Camp not found', 404)
    }
    res.render("campground/editGround", { foundcamp });
  
   
}))

//Camp Review
app.post("/campground/:id/review", async (req, res, next) => {
const {error} =  reviewSchema.validate(req.body)
if(error){
 next(new appError(`${error.message}`, 400))
}
else{
  const {id} = req.params
  const camp = await campGround.findById(id)
  const reviewBody = new review(req.body)
  camp.Reviews.push(reviewBody);
  await reviewBody.save()
  await camp.save()
  res.redirect(`/campground/${camp.id}`)
}
  
});

app.put('/campground/:id', wrapAsync( async (req,res, next)=>{
  const { id } = req.params;
    const updateFoundcamp = await campGround.findByIdAndUpdate(id, req.body, {
      runValidators: true,
      new: true,
    });
    if (!updateFoundcamp) {
      throw new appError("Camp not found", 404);
    }
    res.redirect(`/campground/${updateFoundcamp._id}`);

  
}))

//route to show campground details
 app.get('/campground/:id*', wrapAsync( async (req, res, next)=>{
    const {id} = req.params
    
       const findCamp = await campGround.findById(id).populate("Reviews");
       //console.log(findCamp.Reviews)
       const reviews = findCamp.Reviews;
       //Handle error if camp not found
        if (!findCamp) {
          throw new appError("Camp not found", 404);
        }
       res.render("campground/campDetails", { findCamp,reviews }); 
 }))

 //ROUTE TO DELETE REVIEWS
 app.delete('/campground/:id/reviews/:reviewId',wrapAsync( async (req,res)=>{
  const {id, reviewId} = req.params
 // console.log(reviewId)
  const rev = await review.findById(reviewId)
  //console.log(rev);
   await campGround.findByIdAndUpdate(id, {$pull:{Reviews:reviewId}})
    await review.findByIdAndDelete(reviewId);
  res.redirect(`/campground/${id}`)
 }))

//route to post new campground
app.post('/campground',wrapAsync( async (req,res, next)=>{
  const {error} = schema.validate(req.body,{abortEarly:false})
  if(error)
  {
     //console.log(error.details)
     const details = error.details.map((e,d) => e.message)
    //  const{Name} = details
     console.log(details)
    throw new appError(details, 400)
    //res.render("campground/newCampground", {details})
  }
  else
  {
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
  
}))


//ROUTE TO DELETE CAMPGROUNDS
app.delete('/campground/:id', wrapAsync( async (req,res)=>{
    const {id} =  req.params
     await campGround.findByIdAndDelete(id, req.body )
    res.redirect('/campground')
}))


//mongoose error logger middleware
// app.use((err,req,res,next)=>{
//   //console.log(err.errors.properties)
//   const {message = e, }
//   throw new appError(`${err.message}`, `${err.status}`)
  
// })
//route for al pages not declared
app.get( "*", (req, res) => {
  throw new appError("Page not found!", 404);
});

//404 route
// app.use((req,res)=>{
//     res.status(404).send('NOT FOUND')
// })
 

app.use((err,req,res, next)=>{
   const {status = 500} = err
  //  console.log(err.name)
   if(err.name === "ValidationError")
   {
      err.message = "Validation Error"
   }
    res.status(status).render('errorPage' , {err});
   
   
})




// function errCatch(mongoModel, next, control){
//   if(!mongoModel)
//   {
//     console.log("here")
//     control= false
//     return [next(new appError("Product Not Found", 404)), control];
//   }
//   else{
//     control = true
//     return control
//   }
// }