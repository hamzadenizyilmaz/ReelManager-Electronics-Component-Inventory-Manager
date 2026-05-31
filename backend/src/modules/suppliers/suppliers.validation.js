const Joi = require("joi");

const schema = Joi.object({
  name: Joi.string().trim().min(2).max(160).required(),
  website: Joi.string().trim().uri().allow("", null),
  name_tr: Joi.string().trim().max(160).allow("", null),
  name_en: Joi.string().trim().max(160).allow("", null),
  contactName: Joi.string().trim().max(160).allow("", null),
  contactEmail: Joi.string().trim().email().allow("", null),
  phone: Joi.string().trim().max(60).allow("", null),
  notes: Joi.string().trim().max(2000).allow("", null)
});

module.exports = { schema };
