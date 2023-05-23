const express = require('express')
const app = express()
const path = require('path')
const campGround = require('/models/campground')
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
app.set('views engine','ejs')

//Listener for server
app.listen(3000, ()=>{
    console.log('listening')
})

