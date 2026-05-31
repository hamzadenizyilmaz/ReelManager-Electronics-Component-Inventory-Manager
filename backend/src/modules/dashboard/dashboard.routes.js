const router = require("express").Router();
const auth = require("../../middlewares/auth.middleware");
const prisma = require("../../config/database");
const { ok } = require("../../utils/api-response");

router.use(auth);
router.get("/summary", async (req, res) => {
  const [components, totalQty, outOfStock, movements] = await Promise.all([
    prisma.component.count(),
    prisma.component.aggregate({ _sum: { quantityAvailable: true } }),
    prisma.component.count({ where: { quantityAvailable: 0 } }),
    prisma.stockMovement.findMany({ include: { component: true, user: true }, orderBy: { createdAt: "desc" }, take: 10 })
  ]);
  const all = await prisma.component.findMany({ select: { quantityAvailable: true, minimumStock: true } });
  ok(res, "Dashboard summary", {
    total_components: components,
    total_stock_quantity: totalQty._sum.quantityAvailable || 0,
    low_stock_count: all.filter((x) => x.quantityAvailable > 0 && x.quantityAvailable <= x.minimumStock).length,
    out_of_stock_count: outOfStock,
    recent_movements: movements
  });
});
router.get("/category-stats", async (req, res) => ok(res, "Category stats", await prisma.category.findMany({ include: { _count: { select: { components: true } } } })));
router.get("/supplier-stats", async (req, res) => ok(res, "Supplier stats", await prisma.supplier.findMany({ include: { _count: { select: { components: true } } } })));
router.get("/package-stats", async (req, res) => {
  const rows = await prisma.component.groupBy({ by: ["packageCase"], _count: { packageCase: true } });
  ok(res, "Package stats", rows);
});
router.get("/recent-movements", async (req, res) => {
  const rows = await prisma.stockMovement.findMany({ include: { component: true, user: true }, orderBy: { createdAt: "desc" }, take: 20 });
  ok(res, "Recent movements", rows);
});
module.exports = router;
