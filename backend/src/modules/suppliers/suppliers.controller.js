const prisma = require("../../config/database");
const { ok, fail } = require("../../utils/api-response");
const { logActivity } = require("../../utils/logger");
const model = prisma.supplier;
function normalize(body) { const name = body.name || body.nameEn || body.name_en || body.nameTr || body.name_tr; return { name, nameTr: body.nameTr || body.name_tr || name || null, nameEn: body.nameEn || body.name_en || name || null, website: body.website || null, contactName: body.contactName || body.contact_name || null, contactEmail: body.contactEmail || body.contact_email || null, phone: body.phone || null, notes: body.notes || null }; }
async function list(req, res) { const items = await model.findMany({ orderBy: { id: "desc" } }); return ok(res, "Supplier listed", items); }
async function get(req, res) { const item = await model.findUnique({ where: { id: Number(req.params.id) } }); if (!item) return fail(res, "Supplier not found", [], 404); return ok(res, "Supplier detail", item); }
async function create(req, res) { const item = await model.create({ data: normalize(req.body) }); await logActivity(prisma, req, "CREATE", "supplier", item.id, null, item); return ok(res, "Supplier created", item, 201); }
async function update(req, res) { const old = await model.findUnique({ where: { id: Number(req.params.id) } }); if (!old) return fail(res, "Supplier not found", [], 404); const item = await model.update({ where: { id: old.id }, data: normalize(req.body) }); await logActivity(prisma, req, "UPDATE", "supplier", item.id, old, item); return ok(res, "Supplier updated", item); }
async function remove(req, res) { const old = await model.findUnique({ where: { id: Number(req.params.id) } }); if (!old) return fail(res, "Supplier not found", [], 404); await model.delete({ where: { id: old.id } }); await logActivity(prisma, req, "DELETE", "supplier", old.id, old, null); return ok(res, "Supplier deleted"); }
module.exports = { list, get, create, update, remove };
