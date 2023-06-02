if(process.env.NODE_ENV !== "production")
{
  require("dotenv").config();
}
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
const registerRoutes = require('./routes/register')
const loginRoute = require('./routes/login')
const logoutroute = require('./routes/logout')
//const cookieParser = require('cookie-parser')
const session = require('express-session')
const flash = require('connect-flash')
const passport = require("passport");
const localStrategy = require('passport-local')
const user = require('./models/user')



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

//middleware for sessions
const sessionConfig = {
  secret: process.env.sessionSecret,
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7,
  },
};
app.use(session(sessionConfig));

//Middleware for flash
app.use(flash())

//Middleware for passport
app.use(passport.initialize())
app.use(passport.session())
passport.use(new localStrategy(user.authenticate()))

passport.serializeUser(user.serializeUser())
passport.deserializeUser(user.deserializeUser())

app.use((req,res,next)=>{
  //console.log(req.session)
  //res.locals.returnTo = req.session.returnTo
  res.locals.currentUser = req.user;
  res.locals.success = req.flash('success')
  res.locals.failed = req.flash('error')
   
  next();
})


// middleware to get routes with /campground,Reviews and register
app.use("/login", loginRoute);
app.use("/campground/:id/reviews", reviewsRoute);
app.use("/register", registerRoutes);
app.use("/campground", campgroundRoutes);
app.use("/logout", logoutroute);

//middleware  to parse cookies
//app.use(cookieParser());



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




