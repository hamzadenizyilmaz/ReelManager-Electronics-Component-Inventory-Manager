const Joi = require("joi");

const schema = Joi.object({
  name: Joi.string().trim().min(2).max(160).required(),
  code: Joi.string().trim().max(80).allow("", null),
  name_tr: Joi.string().trim().max(160).allow("", null),
  name_en: Joi.string().trim().max(160).allow("", null),
  description: Joi.string().trim().max(1000).allow("", null),
  description_tr: Joi.string().trim().max(1000).allow("", null),
  description_en: Joi.string().trim().max(1000).allow("", null),
  parentId: Joi.number().integer().positive().allow(null)
});

module.exports = { schema };
