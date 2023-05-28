const schema = require("./schemaValidator");

module.exports = function wrapAsync(fn) {
  return function (req, res, next) {
    fn(req, res, next).catch((err) => next(err));
  };
};

// module.exports = function validateSchema (req, res, next) {
//     const { error } = schema.validate(req.body, { abortEarly: false });
//     if (error) {
//       //console.log(error.details)
//       const details = error.details.map((e, d) => e.message);
//       //  const{Name} = details
//       console.log(details);
//       throw new appError(details, 400);
//       //res.render("campground/newCampground", {details})
//     }
//     else{
//       next()
//     }

// };
