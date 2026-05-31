const Joi = require("joi");
const projectSchema = Joi.object({
  name: Joi.string().required(),
  code: Joi.string().required(),
  description: Joi.string().allow("", null),
  status: Joi.string().valid("draft", "active", "completed", "cancelled").default("draft")
});
const bomItemSchema = Joi.object({
  component_id: Joi.number().integer().required(),
  reference_designator: Joi.string().allow("", null),
  required_quantity: Joi.number().integer().positive().required(),
  notes: Joi.string().allow("", null)
});
module.exports = { projectSchema, bomItemSchema };
