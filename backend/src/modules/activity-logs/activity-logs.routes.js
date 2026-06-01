const express = require("express");
const prisma = require("../../config/database");

const router = express.Router();

function resolveAuthMiddleware() {
  try {
    const authModule = require("../../middlewares/auth.middleware");
    return authModule.authMiddleware || authModule.authenticate || authModule.requireAuth || authModule.protect || authModule.default || authModule;
  } catch {
    return null;
  }
}
const authMiddleware = resolveAuthMiddleware();
function optionalAuth(req, res, next) { return typeof authMiddleware === "function" ? authMiddleware(req, res, next) : next(); }

function buildWhere(query) {
  const where = {};
  if (query.action) where.action = { contains: String(query.action) };
  if (query.entityType) where.entityType = String(query.entityType);
  if (query.userId) { const userId = Number(query.userId); if (Number.isFinite(userId)) where.userId = userId; }
  if (query.method || query.statusCode) {
    const parts = [];
    if (query.method) parts.push({ newValue: { path: ["method"], equals: String(query.method).toUpperCase() } });
    if (query.statusCode) parts.push({ newValue: { path: ["statusCode"], equals: Number(query.statusCode) } });
    if (parts.length) where.AND = parts;
  }
  return where;
}

router.get("/activity-logs", optionalAuth, async (req, res, next) => {
  try {
    const page = Math.max(Number(req.query.page || 1), 1);
    const limit = Math.min(Math.max(Number(req.query.limit || 50), 1), 200);
    const skip = (page - 1) * limit;
    const where = buildWhere(req.query);
    const [items, total] = await Promise.all([
      prisma.activityLog.findMany({ where, orderBy: { createdAt: "desc" }, skip, take: limit, include: { user: { select: { id: true, name: true, email: true, role: true } } } }),
      prisma.activityLog.count({ where })
    ]);
    res.json({ success: true, message: "Activity logs fetched successfully", data: { items, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } } });
  } catch (error) { next(error); }
});

router.get("/activity-logs/:id", optionalAuth, async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const item = await prisma.activityLog.findUnique({ where: { id }, include: { user: { select: { id: true, name: true, email: true, role: true } } } });
    if (!item) return res.status(404).json({ success: false, message: "Activity log not found" });
    res.json({ success: true, message: "Activity log detail", data: item });
  } catch (error) { next(error); }
});

router.get("/activity-logs/summary/stats", optionalAuth, async (req, res, next) => {
  try {
    const [total, latest] = await Promise.all([
      prisma.activityLog.count(),
      prisma.activityLog.findMany({ orderBy: { createdAt: "desc" }, take: 10 })
    ]);
    res.json({ success: true, message: "Activity log summary", data: { total, latest } });
  } catch (error) { next(error); }
});

module.exports = router;
