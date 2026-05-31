const Joi = require("joi");

const schema = Joi.object({
  name: Joi.string().trim().min(2).max(120).required(),
  slug: Joi.string().trim().max(140).allow("", null),
  description: Joi.string().trim().max(1000).allow("", null),
  name_tr: Joi.string().trim().max(120).allow("", null),
  name_en: Joi.string().trim().max(120).allow("", null),
  description_tr: Joi.string().trim().max(1000).allow("", null),
  description_en: Joi.string().trim().max(1000).allow("", null)
});

module.exports = { schema };
