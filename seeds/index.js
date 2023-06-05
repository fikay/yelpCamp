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
           author: "647630dba624f05a578e511f",
           Location: `${cities[rand].city},${cities[rand].state}`,
           geometry: {
             type: "Point",
             coordinates: [cities[rand].longitude, cities[rand].latitude],
           },
           Images: [
             {
               url: `https://res.cloudinary.com/dymv0qyhs/image/upload/v1685798425/yelpCamp/nmqbtfb32spg4jyi1mxx.avif`,
               filename: "yelpCamp/nmqbtfb32spg4jyi1mxx",
             },
           ],
         });
          await seeder.save()
    }
 
 
}

seedDb()

//sample(descriptors);
//console.log(sample(descriptors))
