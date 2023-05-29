const express = require('express')
const app = express()
const path = require('path')
const morgan = require('morgan')
const methodOverride = require('method-override')
const ejsMate = require('ejs-mate')
const appError = require('./utilities/appError')
const mongoose =  require('mongoose')
const campgroundRoutes = require('./routes/campgroundRoutes')
const reviewsRoute = require('./routes/reviewsRoute')
const cookieParser = require('cookie-parser')



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

// access views and public folder and views engine
app.engine('ejs', ejsMate)
app.set('views', path.join(__dirname,'views'))
app.set('view engine','ejs')

app.use(express.static(path.join(__dirname,'public')))

//Middleware for responsebody
app.use(express.urlencoded({ extended: true }));

//middleware for method override
app.use(methodOverride('_method'))

// using morgan middleware
app.use(morgan('tiny'))

// middleware to get routes with /campground and Reviews
app.use('/campground', campgroundRoutes)
app.use("/campground/:id/reviews", reviewsRoute);

//middleware  to parse cookies
app.use(cookieParser());

//Listener for server
app.listen(3000, ()=>{
    console.log('listening')
})


//route for al pages not declared
app.get( "*", (req, res) => {
  throw new appError("Page not found!", 404);
});

 app.use((err,req,res, next)=>{
   const {status = 500} = err
  //  console.log(err.name)
   if(err.name === "ValidationError")
   {
      err.message = "Validation Error"
   }
    res.status(status).render('errorPage' , {err});
   
   
})




