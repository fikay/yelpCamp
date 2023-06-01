const mongoose = require('mongoose')


const reviewSchema = mongoose.Schema({
    Rating:{
        type:Number
    },
    Body:{
        type:String
    },
    author:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user'
    }
})

const reviewModel =  mongoose.model('reviewModel', reviewSchema)
module.exports = reviewModel