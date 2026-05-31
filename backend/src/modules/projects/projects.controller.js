const prisma = require("../../config/database");
const { ok, fail } = require("../../utils/api-response");

function mapProject(b, userId) {
  return { name: b.name, code: b.code, description: b.description || null, status: b.status || "draft", createdBy: userId || null };
}
async function list(req, res) {
  const items = await prisma.project.findMany({ include: { bomItems: true }, orderBy: { updatedAt: "desc" } });
  return ok(res, "Projects listed", items);
}
async function get(req, res) {
  const item = await prisma.project.findUnique({
    where: { id: Number(req.params.id) },
    include: { bomItems: { include: { component: { include: { category: true, supplier: true } } } } }
  });
  if (!item) return fail(res, "Project not found", [], 404);
  return ok(res, "Project detail", item);
}
async function create(req, res) {
  const item = await prisma.project.create({ data: mapProject(req.body, req.user?.id) });
  return ok(res, "Project created", item, 201);
}
async function update(req, res) {
  const item = await prisma.project.update({ where: { id: Number(req.params.id) }, data: mapProject(req.body, req.user?.id) });
  return ok(res, "Project updated", item);
}
async function remove(req, res) {
  await prisma.project.delete({ where: { id: Number(req.params.id) } });
  return ok(res, "Project deleted");
}
async function addBom(req, res) {
  const item = await prisma.projectBomItem.create({
    data: {
      projectId: Number(req.params.id),
      componentId: req.body.component_id,
      referenceDesignator: req.body.reference_designator || null,
      requiredQuantity: req.body.required_quantity,
      notes: req.body.notes || null
    }
  });
  return ok(res, "BOM item added", item, 201);
}
async function updateBom(req, res) {
  const item = await prisma.projectBomItem.update({
    where: { id: Number(req.params.itemId) },
    data: {
      componentId: req.body.component_id,
      referenceDesignator: req.body.reference_designator || null,
      requiredQuantity: req.body.required_quantity,
      notes: req.body.notes || null
    }
  });
  return ok(res, "BOM item updated", item);
}
async function deleteBom(req, res) {
  await prisma.projectBomItem.delete({ where: { id: Number(req.params.itemId) } });
  return ok(res, "BOM item deleted");
}
async function checkStock(req, res) {
  const project = await prisma.project.findUnique({
    where: { id: Number(req.params.id) },
    include: { bomItems: { include: { component: true } } }
  });
  if (!project) return fail(res, "Project not found", [], 404);
  const rows = project.bomItems.map((i) => ({
    bom_item_id: i.id,
    component_id: i.componentId,
    part_number: i.component.manufacturerPartNumber,
    required_quantity: i.requiredQuantity,
    available_quantity: i.component.quantityAvailable,
    missing_quantity: Math.max(i.requiredQuantity - i.component.quantityAvailable, 0),
    status: i.component.quantityAvailable >= i.requiredQuantity ? "ok" : (i.component.quantityAvailable > 0 ? "partial" : "missing")
  }));
  return ok(res, "Project stock checked", rows);
}
async function reserveStock(req, res) { return fail(res, "Use component reserve endpoints or implement bulk reservation after review", [], 501); }
async function consumeStock(req, res) { return fail(res, "Use component stock out endpoints or implement bulk consumption after review", [], 501); }
module.exports = { list, get, create, update, remove, addBom, updateBom, deleteBom, checkStock, reserveStock, consumeStock };
