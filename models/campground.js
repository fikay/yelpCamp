const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Model =mongoose.model;
const review = require('./review')

const campGroundSchema = new Schema({
  Name: {
    type: String,
    required: true,
  },
  Title: {
    type: String,
  },
  Image: {
    type: String,
  },
  Price: {
    type: Number,
    required: true,
  },
  Description: {
    type: String,
    required: true,
  },
  Location: {
    type: String,
    required: true,
  },
  Reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "reviewModel",
    },
  ],
});

campGroundSchema.post('findOneAndDelete', async function(data){
  // console.log('deleted')
   //console.log(data.Reviews)
  if(data)
  {
    await review.deleteMany({
      _id:{
        $in: data.Reviews
      }
    })
  }
})

const campGround = Model('campGround', campGroundSchema)


module.exports = campGround;