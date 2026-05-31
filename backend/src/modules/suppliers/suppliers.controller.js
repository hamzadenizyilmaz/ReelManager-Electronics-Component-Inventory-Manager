const prisma = require("../../config/database");
const { ok, fail } = require("../../utils/api-response");
const { logActivity } = require("../../utils/logger");

const model = prisma.supplier;

async function list(req, res) {
  const items = await model.findMany({ orderBy: { id: "desc" } });
  return ok(res, "Supplier listed", items);
}
async function get(req, res) {
  const item = await model.findUnique({ where: { id: Number(req.params.id) } });
  if (!item) return fail(res, "Supplier not found", [], 404);
  return ok(res, "Supplier detail", item);
}
async function create(req, res) {
  const item = await model.create({ data: req.body });
  await logActivity(prisma, req, "CREATE", "supplier", item.id, null, item);
  return ok(res, "Supplier created", item, 201);
}
async function update(req, res) {
  const old = await model.findUnique({ where: { id: Number(req.params.id) } });
  if (!old) return fail(res, "Supplier not found", [], 404);
  const item = await model.update({ where: { id: old.id }, data: req.body });
  await logActivity(prisma, req, "UPDATE", "supplier", item.id, old, item);
  return ok(res, "Supplier updated", item);
}
async function remove(req, res) {
  const old = await model.findUnique({ where: { id: Number(req.params.id) } });
  if (!old) return fail(res, "Supplier not found", [], 404);
  await model.delete({ where: { id: old.id } });
  await logActivity(prisma, req, "DELETE", "supplier", old.id, old, null);
  return ok(res, "Supplier deleted");
}
module.exports = { list, get, create, update, remove };
