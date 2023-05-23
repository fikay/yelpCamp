const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Model =mongoose.model;

const campGroundSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  Title: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
});

const campGround = Model('campGround', campGroundSchema)


module.exports = campGround;