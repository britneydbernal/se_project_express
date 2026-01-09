const { Joi, celebrate } = require("celebrate");
const validator = require("validator");

const validateURL = (value, helpers) => {
  if (validator.isURL(value)) {
    return value;
  }
  return helpers.error("string.uri");
};

module.exports.validateCardBody = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30).messages({
      "string.min": "The minimum length for the name is 2 characters.",
      "string.max": "The maximum length for the name is 30 characters.",
      "string.empty": "The name field cannot be empty.",
    }),
    weather: Joi.string().required().valid("hot", "warm", "cold").messages({
      "string.empty": "The weather field cannot be empty.",
      "any.only":
        "The weather field must be one of the following: hot, warm, cold.",
    }),
    imageUrl: Joi.string().required().custom(validateURL).messages({
      "string.empty": "The imageUrl field cannot be empty.",
      "string.uri": "The imageUrl field must be a valid URL.",
    }),
  }),
});

module.exports.validateUserBody = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30).messages({
      "string.min": "The minimum length for the name is 2 characters.",
      "string.max": "The maximum length for the name is 30 characters.",
    }),
    avatar: Joi.string().required().custom(validateURL).messages({
      "string.uri": "The avatar field must be a valid URL.",
    }),
    email: Joi.string().required().email().messages({
      "string.email": "The email field must be a valid email address.",
      "string.empty": "The email field cannot be empty.",
    }),
    password: Joi.string().required().messages({
      "string.empty": "The password field cannot be empty.",
    }),
  }),
});

module.exports.validateAuthentication = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email().messages({
      "string.email": "The email field must be a valid email address.",
      "string.empty": "The email field cannot be empty.",
    }),
    password: Joi.string().required().messages({
      "string.empty": "The password field cannot be empty.",
    }),
  }),
});

module.exports.validateItemId = celebrate({
  params: Joi.object().keys({
    itemId: Joi.string().hex().length(24).required().messages({
      "string.length": "The itemId must be 24 hexadecimal characters.",
      "string.hex": "The itemId must contain only hexadecimal characters.",
    }),
  }),
});

module.exports.validateUserId = celebrate({
  params: Joi.object().keys({
    userId: Joi.string().hex().length(24).required().messages({
      "string.length": "The userId must be 24 hexadecimal characters.",
      "string.hex": "The userId must contain only hexadecimal characters.",
    }),
  }),
});

module.exports.validateUserUpdate = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30).messages({
      "string.min": "The minimum length for the name is 2 characters.",
      "string.max": "The maximum length for the name is 30 characters.",
    }),
    avatar: Joi.string().custom(validateURL).messages({
      "string.uri": "The avatar field must be a valid URL.",
    }),
  }),
});
