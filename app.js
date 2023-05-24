const express = require('express')
const app = express()
const path = require('path')
const methodOverride = require('method-override')
const campGround = require('./models/campground')
const mongoose =  require('mongoose')

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
app.set('views', path.join(__dirname,'views'))
app.set('view engine','ejs')


//Middleware for responsebody
app.use(express.urlencoded({ extended: true }));

//middleware for method override
app.use(methodOverride('_method'))

//Listener for server
app.listen(3000, ()=>{
    console.log('listening')
})


//route for index 
app.get('/campground', async (req,res)=>{
    const campgrounds = await campGround.find({})
    res.render('campground/home', {campgrounds})
})

app.get("/campground/new", (req, res) => {
  res.render('campground/newCampground');
});

//route to edit campground
app.get('/campground/:id/edit', async (req,res)=>{
   const{id} = req.params
   const foundcamp = await campGround.findById(id)
   console.log(foundcamp)
   res.render('campground/editGround', {foundcamp})
})

app.put('/campground/:id', async (req,res)=>{
  const { id } = req.params;
  const updateFoundcamp = await campGround.findByIdAndUpdate(id, req.body, {
    runValidators: true,
    new: true,
  });

  console.log(updateFoundcamp);
  res.redirect(`/campground/${updateFoundcamp._id}`);
})

//route to show campground details
 app.get('/campground/:id', async (req, res)=>{
    const {id} = req.params
    const findCamp = await campGround.findById(id)
    res.render('campground/campDetails', {findCamp})
 })

//route to post new campground
app.post('/campground', async (req,res)=>{
    console.log(req.body)
   const newGround = new campGround(req.body)
   await newGround
     .save()
     .then(async () => {
       res.redirect("/campground");
     })
     .catch((err) => {
       console.log("issue saving file");
     });
})

//ROUTE TO DELETE GROUNDS
app.delete('/campground/:id', async (req,res)=>{
    const {id} =  req.params
    const deleteCamp = await campGround.findByIdAndDelete(id, req.body )
    res.redirect('/campground')
})


 