const mongoose = require("mongoose");
const passportLocalMongoose = require('passport-local-mongoose')
const Schema = mongoose.Schema;
const Model = mongoose.model;

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "reviewModel",
    },
  ],
});
userSchema.plugin(passportLocalMongoose)
const user = Model('user', userSchema)

module.exports = user;