const bcrypt = require("bcryptjs");
const prisma = require("../../config/database");
const { ok, fail } = require("../../utils/api-response");
const { logActivity } = require("../../utils/logger");

const DEFAULT_SETTINGS = {
  companyName: "CreartSoft",
  appName: "Reel Manager",
  defaultCurrency: "TRY",
  defaultLanguage: "tr",
  defaultTheme: "dark",
  lowStockLimit: 20,
  dateFormat: "DD.MM.YYYY",
  skuPrefix: "CMP",
  skuMode: "random",
  labelProfile: "thermal-50x25",
  auditLogRetentionDays: 180,
  sessionTimeoutMinutes: 480,
  mfaRequired: false,
  registrationMode: "admin-only",
  backupSchedule: "daily",
  backupRetentionDays: 14,
  notificationEmail: "admin@example.com",
  datasheetTimeoutMs: 8000,
  cacheTtlDays: 30
};

async function getSystem(req, res) {
  const record = await prisma.systemSetting.findUnique({ where: { key: "system" } }).catch(() => null);
  return ok(res, "System settings", { ...DEFAULT_SETTINGS, ...(record?.value || {}) });
}

async function updateSystem(req, res) {
  const previous = await prisma.systemSetting.findUnique({ where: { key: "system" } }).catch(() => null);
  const merged = { ...DEFAULT_SETTINGS, ...(previous?.value || {}), ...req.body };
  const record = await prisma.systemSetting.upsert({
    where: { key: "system" },
    update: { value: merged, updatedBy: req.user?.id || null },
    create: { key: "system", value: merged, updatedBy: req.user?.id || null }
  });
  await logActivity(prisma, req, "UPDATE", "system_setting", record.id, previous?.value || null, merged).catch(() => null);
  return ok(res, "System settings updated", record.value);
}

async function listUsers(req, res) {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    select: { id: true, name: true, email: true, role: true, status: true, createdAt: true, updatedAt: true }
  });
  return ok(res, "Users listed", users);
}

async function createUser(req, res) {
  const passwordHash = await bcrypt.hash(req.body.password, 12);
  const user = await prisma.user.create({
    data: { name: req.body.name, email: req.body.email, passwordHash, role: req.body.role || "user", status: req.body.status || "active" },
    select: { id: true, name: true, email: true, role: true, status: true, createdAt: true, updatedAt: true }
  });
  await logActivity(prisma, req, "CREATE", "user", user.id, null, user).catch(() => null);
  return ok(res, "User created", user, 201);
}

async function updateUser(req, res) {
  const id = Number(req.params.id);
  const old = await prisma.user.findUnique({ where: { id } });
  if (!old) return fail(res, "User not found", [], 404);
  const data = { ...req.body };
  if (data.password) {
    data.passwordHash = await bcrypt.hash(data.password, 12);
  }
  delete data.password;
  const user = await prisma.user.update({
    where: { id },
    data,
    select: { id: true, name: true, email: true, role: true, status: true, createdAt: true, updatedAt: true }
  });
  await logActivity(prisma, req, "UPDATE", "user", user.id, { id: old.id, email: old.email, role: old.role, status: old.status }, user).catch(() => null);
  return ok(res, "User updated", user);
}

module.exports = { getSystem, updateSystem, listUsers, createUser, updateUser };
