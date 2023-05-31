const mongoose = require("mongoose");
const passportLocalMongoose = require('passport-local-mongoose')
const Schema = mongoose.Schema;
const Model = mongoose.model;

const userSchema = new Schema({
    email:{
        type:String,
        required:true,
        unique:true
    }
})
userSchema.plugin(passportLocalMongoose)
const user = Model('user', userSchema)

module.exports = user;