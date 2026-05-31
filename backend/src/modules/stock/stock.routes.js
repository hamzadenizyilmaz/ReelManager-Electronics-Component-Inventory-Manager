const router = require("express").Router();
const auth = require("../../middlewares/auth.middleware");
const prisma = require("../../config/database");
const { ok } = require("../../utils/api-response");

router.use(auth);
router.get("/movements", async (req, res) => {
  const items = await prisma.stockMovement.findMany({ include: { component: true, user: true, project: true }, orderBy: { createdAt: "desc" }, take: 200 });
  ok(res, "Stock movements listed", items);
});
router.get("/low", async (req, res) => {
  const items = await prisma.component.findMany({ include: { category: true, supplier: true } });
  ok(res, "Low stock listed", items.filter((i) => i.quantityAvailable > 0 && i.quantityAvailable <= i.minimumStock));
});
router.get("/out-of-stock", async (req, res) => {
  const items = await prisma.component.findMany({ where: { quantityAvailable: 0 }, include: { category: true, supplier: true } });
  ok(res, "Out of stock listed", items);
});
module.exports = router;
