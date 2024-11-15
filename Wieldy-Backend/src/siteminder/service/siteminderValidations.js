const Joi = require("joi");

function validateSiteminderHotel(body) {
  const schema = Joi.object().keys({
    propertyName: Joi.string()
      .replace(/  +/g, " ")
      .trim()
      .required(),
    propertyId: Joi.string()
      .replace(/ +/g, "_")
      .trim()
      .required(),
    propertyType: Joi.string()
      .replace(/ +/g, " ")
      .trim()
      .required(),
    propertyLocation: Joi.object()
      .default({})
      .keys({
        street: Joi.string().trim().required(),
        city: Joi.string().trim().required(),
        state: Joi.string().trim().required(),
        country: Joi.string().trim().required()
      })
      .optional(),
    emailId: Joi.string().email().trim().required(),
    phoneNo: Joi.object()
      .default({})
      .keys({
        countryCode: Joi.string().trim().required(),
        number: Joi.string().trim().required()
      })
      .optional(),
    propertyPublisherName: Joi.string()
      .replace(/  +/g, " ")
      .trim()
      .required(),
    defaultTimeZone: Joi.string().trim().optional(),
    defaultCheckInTime: Joi.string().trim().required(),
    defaultCheckOutTime: Joi.string().trim().required()
  });
  const { value, error } = schema.validate(body, {
    allowUnknown: true
  });
  if (error && error.details) {
    return {
      error
    };
  }
  return {
    value
  };
}
module.exports = {
  validateSiteminderHotel
};
