const router = require("express").Router();
const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");
const prisma = require("../../config/database");
const auth = require("../../middlewares/auth.middleware");
const requireRole = require("../../middlewares/role.middleware");
const { logActivity } = require("../../utils/logger");

const REPO = "hamzadenizyilmaz/ReelManager-Electronics-Component-Inventory-Manager";
const CURRENT_VERSION = process.env.APP_VERSION || "v2.2.0-Enterprise";

async function fetchLatestRelease() {
  const response = await fetch(`https://api.github.com/repos/${REPO}/releases/latest`, {
    headers: { "User-Agent": "ReelManager" }
  });

  if (!response.ok) throw new Error(`GitHub API error: ${response.status}`);
  return response.json();
}

function normalizeVersion(value) {
  return String(value || "").trim().replace(/^v/i, "");
}

function sqlEscape(value) {
  if (value === null || value === undefined) return "NULL";
  if (value instanceof Date) return `'${value.toISOString().slice(0, 19).replace("T", " ")}'`;
  if (typeof value === "number") return Number.isFinite(value) ? String(value) : "NULL";
  if (typeof value === "boolean") return value ? "1" : "0";
  if (typeof value === "object") return `'${JSON.stringify(value).replace(/\\/g, "\\\\").replace(/'/g, "''")}'`;
  return `'${String(value).replace(/\\/g, "\\\\").replace(/'/g, "''")}'`;
}

function toSnakeCase(value) {
  return String(value).replace(/[A-Z]/g, (m) => `_${m.toLowerCase()}`);
}

function buildInsert(table, rows) {
  if (!rows || !rows.length) return `-- ${table}: no rows\n`;
  const keys = Object.keys(rows[0]);
  const columns = keys.map((k) => `\`${toSnakeCase(k)}\``).join(", ");
  const lines = rows
    .map((row) => `INSERT INTO \`${table}\` (${columns}) VALUES (${keys.map((k) => sqlEscape(row[k])).join(", ")});`)
    .join("\n");
  return `-- ${table}\n${lines}\n`;
}

async function collectBackupData() {
  return {
    users: await prisma.user.findMany({ select: { id: true, name: true, email: true, role: true, status: true, createdAt: true, updatedAt: true } }),
    categories: await prisma.category.findMany().catch(() => []),
    suppliers: await prisma.supplier.findMany().catch(() => []),
    storage_locations: await prisma.storageLocation.findMany().catch(() => []),
    components: await prisma.component.findMany().catch(() => []),
    stock_movements: await prisma.stockMovement.findMany().catch(() => []),
    projects: await prisma.project.findMany().catch(() => []),
    project_bom_items: await prisma.projectBomItem.findMany().catch(() => []),
    purchase_orders: await prisma.purchaseOrder.findMany().catch(() => []),
    purchase_order_items: await prisma.purchaseOrderItem.findMany().catch(() => []),
    labels: await prisma.label.findMany().catch(() => []),
    component_labels: await prisma.componentLabel.findMany().catch(() => []),
    system_settings: await prisma.systemSetting.findMany().catch(() => []),
    component_enrichment_cache: await prisma.componentEnrichmentCache.findMany().catch(() => []),
    activity_logs: await prisma.activityLog.findMany({ orderBy: { createdAt: "desc" }, take: 5000 }).catch(() => [])
  };
}

async function writeSqlBackup(targetDir) {
  const data = await collectBackupData();
  const chunks = [
    "-- ReelManager SQL Backup",
    `-- Exported at: ${new Date().toISOString()}`,
    "SET FOREIGN_KEY_CHECKS=0;",
    ...Object.entries(data).map(([table, rows]) => buildInsert(table, rows)),
    "SET FOREIGN_KEY_CHECKS=1;"
  ];
  const filePath = path.join(targetDir, "database-backup.sql");
  await fs.promises.writeFile(filePath, chunks.join("\n\n"), "utf8");
  return filePath;
}

async function copyProjectFiles(targetDir) {
  const root = path.resolve(process.cwd(), "..");
  const projectTarget = path.join(targetDir, "project-files");

  const ignore = new Set(["node_modules", ".next", ".git", "backups", "dist", "coverage"]);

  async function copyRecursive(src, dest) {
    const base = path.basename(src);
    if (ignore.has(base)) return;

    const stat = await fs.promises.stat(src);
    if (stat.isDirectory()) {
      await fs.promises.mkdir(dest, { recursive: true });
      const entries = await fs.promises.readdir(src);
      for (const entry of entries) {
        await copyRecursive(path.join(src, entry), path.join(dest, entry));
      }
      return;
    }

    await fs.promises.mkdir(path.dirname(dest), { recursive: true });
    await fs.promises.copyFile(src, dest);
  }

  await copyRecursive(root, projectTarget);
  return projectTarget;
}

async function createUpdateBackup(req, latestVersion) {
  const stamp = new Date().toISOString().replace(/[:.]/g, "-");
  const backupRoot = path.resolve(process.cwd(), "..", "backups", `update-${stamp}`);
  await fs.promises.mkdir(backupRoot, { recursive: true });

  const [sqlFile, filesDir] = await Promise.all([
    writeSqlBackup(backupRoot),
    copyProjectFiles(backupRoot)
  ]);

  const manifest = {
    type: "pre-update-backup",
    createdAt: new Date().toISOString(),
    currentVersion: CURRENT_VERSION,
    targetVersion: latestVersion,
    sqlFile,
    filesDir
  };

  await fs.promises.writeFile(path.join(backupRoot, "manifest.json"), JSON.stringify(manifest, null, 2), "utf8");
  await logActivity(prisma, req, "BACKUP", "system_update", null, null, manifest).catch(() => null);

  return manifest;
}

router.use(auth, requireRole("admin"));

router.get("/check", async (req, res) => {
  try {
    const release = await fetchLatestRelease();
    const latestVersion = release.tag_name || release.name || null;
    const updateAvailable = Boolean(latestVersion && normalizeVersion(latestVersion) !== normalizeVersion(CURRENT_VERSION));
    const data = {
      repository: REPO,
      currentVersion: CURRENT_VERSION,
      latestVersion,
      htmlUrl: release.html_url,
      updateAvailable,
      compatible: !updateAvailable,
      releaseName: release.name,
      publishedAt: release.published_at
    };
    await logActivity(prisma, req, "READ", "updates", null, null, data).catch(() => null);
    return res.json({ success: true, message: "Update status fetched", data });
  } catch (error) {
    return res.status(502).json({ success: false, message: "GitHub update information could not be fetched", errors: [error.message] });
  }
});

router.post("/apply", async (req, res) => {
  let release;
  try {
    release = await fetchLatestRelease();
  } catch (error) {
    return res.status(502).json({ success: false, message: "GitHub update information could not be fetched", errors: [error.message] });
  }

  const latestVersion = release.tag_name || release.name || null;
  if (!latestVersion || normalizeVersion(latestVersion) === normalizeVersion(CURRENT_VERSION)) {
    const data = {
      applied: false,
      compatible: true,
      currentVersion: CURRENT_VERSION,
      latestVersion,
      message: "Versions are compatible. Update was not applied."
    };
    await logActivity(prisma, req, "SKIP", "updates", null, null, data).catch(() => null);
    return res.status(409).json({ success: false, message: data.message, data });
  }

  let backup;
  try {
    backup = await createUpdateBackup(req, latestVersion);
  } catch (error) {
    const data = { applied: false, message: `Backup failed: ${error.message}` };
    await logActivity(prisma, req, "ERROR", "system_update_backup", null, null, data).catch(() => null);
    return res.status(500).json({ success: false, message: data.message, data });
  }

  if (process.env.ALLOW_SYSTEM_UPDATE !== "true") {
    const data = {
      applied: false,
      backup,
      message: "System update is disabled. Backup was created, but code was not changed. Set ALLOW_SYSTEM_UPDATE=true on the backend server to allow git pull."
    };
    await logActivity(prisma, req, "UPDATE", "updates", null, null, data).catch(() => null);
    return res.json({ success: true, message: data.message, data });
  }

  exec("git pull --ff-only", { cwd: path.resolve(process.cwd(), ".."), timeout: 120000 }, async (error, stdout, stderr) => {
    const data = {
      applied: !error,
      backup,
      stdout,
      stderr,
      currentVersion: CURRENT_VERSION,
      latestVersion,
      message: error ? error.message : "Repository updated successfully. Restart services to apply changes."
    };
    await logActivity(prisma, req, "UPDATE", "updates", null, null, data).catch(() => null);
    return res.status(error ? 500 : 200).json({ success: !error, message: data.message, data });
  });
});

module.exports = router;
