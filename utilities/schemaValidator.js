const joi = require('joi')
const schema = joi.object({
  Name: joi
    .string()
    .alphanum()
    .min(3)
    .max(30)
    .required(),
  Price: joi.number().min(0).required(),
  Description: joi
    .string()
    .required(),
  Image: joi.string().required(),
  Location: joi.string().alphanum().required(),
});


const reviewSchema = joi.object({
  Rating: joi.number().min(0).required(),
  Body: joi.string().required(),
});

const userSchema = joi.object({
  Name: joi.string().min(3).required(),
  Password: joi.string().pattern(new RegExp("^[a-zA-Z0-9]{8,30}$")).required(),
  Email: joi
    .string()
    .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } }).required(),
});


module.exports.schema = schema
module.exports.reviewSchema =reviewSchema
module.exports.userSchema = userSchema