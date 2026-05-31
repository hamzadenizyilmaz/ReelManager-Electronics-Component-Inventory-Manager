const Joi = require("joi");

const systemSettingsSchema = Joi.object({
  companyName: Joi.string().max(160).allow("", null),
  appName: Joi.string().max(120).allow("", null),
  defaultCurrency: Joi.string().max(8).allow("", null),
  defaultLanguage: Joi.string().valid("tr", "en").allow(null),
  defaultTheme: Joi.string().valid("dark", "light").allow(null),
  lowStockLimit: Joi.number().integer().min(0).allow(null),
  dateFormat: Joi.string().max(40).allow("", null),
  skuPrefix: Joi.string().max(12).allow("", null),
  skuMode: Joi.string().valid("random", "sequential").allow(null),
  labelProfile: Joi.string().max(80).allow("", null),
  auditLogRetentionDays: Joi.number().integer().min(1).allow(null),
  sessionTimeoutMinutes: Joi.number().integer().min(5).allow(null),
  mfaRequired: Joi.boolean().allow(null),
  registrationMode: Joi.string().valid("admin-only", "invite-only", "closed").allow(null),
  backupSchedule: Joi.string().valid("manual", "daily", "weekly").allow(null),
  backupRetentionDays: Joi.number().integer().min(1).allow(null),
  notificationEmail: Joi.string().email().allow("", null),
  datasheetTimeoutMs: Joi.number().integer().min(1000).max(60000).allow(null),
  cacheTtlDays: Joi.number().integer().min(1).allow(null)
}).unknown(true);

const userCreateSchema = Joi.object({
  name: Joi.string().trim().min(2).max(120).required(),
  email: Joi.string().trim().email().required(),
  password: Joi.string().min(8).max(128).required(),
  role: Joi.string().valid("admin", "user", "viewer").default("user"),
  status: Joi.string().valid("active", "inactive").default("active")
});

const userUpdateSchema = Joi.object({
  name: Joi.string().trim().min(2).max(120),
  email: Joi.string().trim().email(),
  password: Joi.string().min(8).max(128).allow("", null),
  role: Joi.string().valid("admin", "user", "viewer"),
  status: Joi.string().valid("active", "inactive")
}).min(1);

module.exports = { systemSettingsSchema, userCreateSchema, userUpdateSchema };
