const Joi = require("joi");

const componentSchema = Joi.object({
  supplier_part_number: Joi.string().allow("", null),
  manufacturer_part_number: Joi.string().required(),
  manufacturer: Joi.string().allow("", null),
  supplier_id: Joi.number().integer().allow(null),
  category_id: Joi.number().integer().required(),
  name: Joi.string().required(),
  description: Joi.string().allow("", null),
  package_case: Joi.string().allow("", null),
  value: Joi.string().allow("", null),
  value_numeric: Joi.number().allow(null),
  unit: Joi.string().allow("", null),
  tolerance: Joi.string().allow("", null),
  voltage_rating: Joi.string().allow("", null),
  current_rating: Joi.string().allow("", null),
  power_rating: Joi.string().allow("", null),
  temperature_coefficient: Joi.string().allow("", null),
  dielectric: Joi.string().allow("", null),
  material: Joi.string().allow("", null),
  footprint: Joi.string().allow("", null),
  mounting_type: Joi.string().allow("", null),
  quantity_total: Joi.number().integer().min(0).default(0),
  quantity_available: Joi.number().integer().min(0).optional(),
  quantity_reserved: Joi.number().integer().min(0).default(0),
  minimum_stock: Joi.number().integer().min(0).default(0),
  reorder_quantity: Joi.number().integer().min(0).default(0),
  storage_location_id: Joi.number().integer().allow(null),
  barcode: Joi.string().allow("", null),
  qr_code: Joi.string().allow("", null),
  datasheet_url: Joi.string().allow("", null),
  product_url: Joi.string().allow("", null),
  image_url: Joi.string().allow("", null),
  notes: Joi.string().allow("", null),
  status: Joi.string().valid("active", "passive", "archived").default("active")
});

const stockMoveSchema = Joi.object({
  quantity: Joi.number().integer().positive().required(),
  reason: Joi.string().allow("", null),
  project_id: Joi.number().integer().allow(null),
  notes: Joi.string().allow("", null)
});

module.exports = { componentSchema, stockMoveSchema };
