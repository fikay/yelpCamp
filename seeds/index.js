const mongoose = require("mongoose");
const campGround = require("../models/campground");
const cities = require('./cities')
const {descriptors, places, campDescription} = require('./seedhelpers')

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

  const sample = (array1)=>{
    return array1[Math.floor(Math.random()*array1.length)]
    
  }

const seedDb = async()=>{
    await campGround.deleteMany({});
    for(let i =0; i<50; i++)
    {
        const rand = Math.floor(Math.random() * 1000);
         const seeder = new campGround({
           Name: `${sample(descriptors)} ${sample(places)}`,
           Title: "CampGround",
           Price: `${rand}`,
           Description: `${sample(campDescription)}`,
           Location: `${cities[rand].city},${cities[rand].state}`,
         });
          await seeder.save()
    }
 
 
}

seedDb()

//sample(descriptors);
//console.log(sample(descriptors))