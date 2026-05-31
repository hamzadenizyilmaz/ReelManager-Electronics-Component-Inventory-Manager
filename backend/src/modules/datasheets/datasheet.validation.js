const Joi = require("joi");

const searchSchema = Joi.object({
  query: Joi.string().trim().min(2).required()
}).unknown(true);

const enrichSchema = Joi.object({
  mpn: Joi.string().trim().min(2).required(),
  manual_datasheet_url: Joi.string().trim().uri().allow("", null)
}).unknown(true);

const bulkEnrichSchema = Joi.object({
  ids: Joi.array().items(Joi.number().integer().positive()).min(1).max(100).optional(),
  force: Joi.boolean().default(false)
});

module.exports = { searchSchema, enrichSchema, bulkEnrichSchema };
