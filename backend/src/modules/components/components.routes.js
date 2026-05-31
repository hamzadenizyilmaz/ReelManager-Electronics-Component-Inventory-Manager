const router = require("express").Router();
const auth = require("../../middlewares/auth.middleware");
const requireRole = require("../../middlewares/role.middleware");
const validate = require("../../middlewares/validate.middleware");
const { componentSchema, stockMoveSchema } = require("./components.validation");
const c = require("./components.controller");

router.use(auth);
router.get("/search", c.search);
router.get("/parse", c.parse);
router.get("/datasheet/providers", c.datasheetProviders);
router.get("/barcode/:barcode", c.byBarcode);
router.post("/bulk-enrich", requireRole("admin", "user"), c.bulkEnrich);
router.get("/", c.list);
router.post("/:id/enrich", requireRole("admin", "user"), c.enrich);
router.get("/:id", c.get);
router.get("/:id/datasheet", c.datasheet);
router.post("/", requireRole("admin", "user"), validate(componentSchema), c.create);
router.put("/:id", requireRole("admin", "user"), validate(componentSchema), c.update);
router.delete("/:id", requireRole("admin"), c.remove);
router.post("/:id/stock/in", requireRole("admin", "user"), validate(stockMoveSchema), c.stockIn);
router.post("/:id/stock/out", requireRole("admin", "user"), validate(stockMoveSchema), c.stockOut);
router.post("/:id/reserve", requireRole("admin", "user"), validate(stockMoveSchema), c.reserve);
router.post("/:id/release", requireRole("admin", "user"), validate(stockMoveSchema), c.release);
router.get("/:id/movements", c.movements);

module.exports = router;
