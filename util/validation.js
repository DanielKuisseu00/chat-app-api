const joi = require("joi");

module.exports.registerValidation = (data) => {
  const schema = joi.object({
    username: joi.string().min(3).max(30).required(),
    password: joi.string().min(3).required(),
    email: joi.string().min(8).max(50).required(),
  });

  return schema.validate(data);
};

module.exports.loginValidation = (data) => {
  const schema = joi.object({
    username: joi.string().min(3).max(30).required(),
    password: joi.string().min(3).required(),
  });

  return schema.validate(data);
};
