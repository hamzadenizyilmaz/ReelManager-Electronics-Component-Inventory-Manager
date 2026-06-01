const bcrypt = require("bcryptjs");
const prisma = require("../../config/database");
const { ok, fail } = require("../../utils/api-response");
const { logActivity } = require("../../utils/logger");

const DEFAULT_SETTINGS = {
  companyName: "CreartSoft",
  appName: "ReelManager",
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




function sqlEscape(value) {
  if (value === null || value === undefined) return "NULL";
  if (value instanceof Date) return `'${value.toISOString().slice(0, 19).replace("T", " ")}'`;
  if (typeof value === "number") return Number.isFinite(value) ? String(value) : "NULL";
  if (typeof value === "boolean") return value ? "1" : "0";
  if (typeof value === "object") return `'${JSON.stringify(value).replace(/\\/g, "\\\\").replace(/'/g, "''")}'`;
  return `'${String(value).replace(/\\/g, "\\\\").replace(/'/g, "''")}'`;
}

function toSnakeCase(value) { return String(value).replace(/[A-Z]/g, (m) => `_${m.toLowerCase()}`); }
function buildInsert(table, rows) {
  if (!rows || !rows.length) return `-- ${table}: no rows\n`;
  const keys = Object.keys(rows[0]);
  const columns = keys.map((k) => `\`${toSnakeCase(k)}\``).join(", ");
  const lines = rows.map((row) => `INSERT INTO \`${table}\` (${columns}) VALUES (${keys.map((k) => sqlEscape(row[k])).join(", ")});`).join("\n");
  return `-- ${table}\n${lines}\n`;
}

async function collectBackupData() {
  return {
    users: await prisma.user.findMany({ select: { id: true, name: true, email: true, role: true, status: true, createdAt: true, updatedAt: true } }),
    categories: await prisma.category.findMany(),
    suppliers: await prisma.supplier.findMany(),
    storage_locations: await prisma.storageLocation.findMany(),
    components: await prisma.component.findMany(),
    stock_movements: await prisma.stockMovement.findMany(),
    projects: await prisma.project.findMany(),
    project_bom_items: await prisma.projectBomItem.findMany(),
    purchase_orders: await prisma.purchaseOrder.findMany().catch(() => []),
    purchase_order_items: await prisma.purchaseOrderItem.findMany().catch(() => []),
    labels: await prisma.label.findMany().catch(() => []),
    component_labels: await prisma.componentLabel.findMany().catch(() => []),
    system_settings: await prisma.systemSetting.findMany().catch(() => []),
    component_enrichment_cache: await prisma.componentEnrichmentCache.findMany().catch(() => []),
    activity_logs: await prisma.activityLog.findMany({ orderBy: { createdAt: "desc" }, take: 5000 }).catch(() => [])
  };
}

async function exportBackup(req, res) {
  const format = String(req.query.format || "json").toLowerCase();
  const data = await collectBackupData();
  await logActivity(prisma, req, "EXPORT", "database_backup", null, null, { format, collections: Object.keys(data) }).catch(() => null);
  const date = new Date().toISOString().slice(0, 10);
  if (format === "sql") {
    const chunks = [
      "-- ReelManager SQL Backup",
      `-- Exported at: ${new Date().toISOString()}`,
      "SET FOREIGN_KEY_CHECKS=0;",
      ...Object.entries(data).map(([table, rows]) => buildInsert(table, rows)),
      "SET FOREIGN_KEY_CHECKS=1;"
    ];
    res.setHeader("Content-Type", "application/sql; charset=utf-8");
    res.setHeader("Content-Disposition", `attachment; filename=\"reelmanager-backup-${date}.sql\"`);
    return res.status(200).send(chunks.join("\n\n"));
  }
  const payload = { exportedAt: new Date().toISOString(), version: "17.0.0", data };
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Content-Disposition", `attachment; filename=\"reelmanager-backup-${date}.json\"`);
  return res.status(200).send(JSON.stringify(payload, null, 2));
}

async function testBackupTarget(req, res) {
  const body = req.body || {};
  const errors = [];
  if (!body.remoteType) errors.push("Remote transfer type is required");
  if (!body.host) errors.push("Host is required");
  if (!body.port || Number(body.port) <= 0) errors.push("Valid port is required");
  if (!body.username) errors.push("Username is required");
  if (!body.remotePath) errors.push("Remote path is required");
  await logActivity(prisma, req, "TEST", "backup_target", null, null, { remoteType: body.remoteType, host: body.host, port: body.port, username: body.username, remotePath: body.remotePath, valid: errors.length === 0 }).catch(() => null);
  if (errors.length) return fail(res, "Backup target validation failed", errors, 400);
  return ok(res, "Backup target configuration validated", { reachable: false, message: "Connection credentials are present. Real FTP/SFTP transfer requires the server-side adapter to be enabled." });
}

module.exports = { getSystem, updateSystem, listUsers, createUser, updateUser, exportBackup, testBackupTarget };
