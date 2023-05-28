const joi = require('joi')
const schema = joi.object({
  Name: joi.string().alphanum().min(3).max(30).required(),
  Price: joi.number().min(0).required(),
  Description: joi.string().alphanum().required(),
  Image:joi.string().required(),
  Location: joi.string().alphanum().required(),
});


const reviewSchema = joi.object({
  Rating: joi.number().min(0).required(),
  Body: joi.string().required(),
});
module.exports.schema = schema
module.exports.reviewSchema =reviewSchema