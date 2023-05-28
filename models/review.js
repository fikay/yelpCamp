const mongoose = require('mongoose')


const reviewSchema = mongoose.Schema({
    Rating:{
        type:Number
    },
    Body:{
        type:String
    }
})

const reviewModel =  mongoose.model('reviewModel', reviewSchema)
module.exports = reviewModel