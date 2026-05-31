const router = require("express").Router();
const auth = require("../../middlewares/auth.middleware");
const requireRole = require("../../middlewares/role.middleware");
const validate = require("../../middlewares/validate.middleware");
const { projectSchema, bomItemSchema } = require("./projects.validation");
const c = require("./projects.controller");

router.use(auth);
router.get("/", c.list);
router.get("/:id", c.get);
router.post("/", requireRole("admin", "user"), validate(projectSchema), c.create);
router.put("/:id", requireRole("admin", "user"), validate(projectSchema), c.update);
router.delete("/:id", requireRole("admin"), c.remove);
router.post("/:id/bom", requireRole("admin", "user"), validate(bomItemSchema), c.addBom);
router.put("/:id/bom/:itemId", requireRole("admin", "user"), validate(bomItemSchema), c.updateBom);
router.delete("/:id/bom/:itemId", requireRole("admin", "user"), c.deleteBom);
router.post("/:id/check-stock", c.checkStock);
router.post("/:id/reserve-stock", requireRole("admin", "user"), c.reserveStock);
router.post("/:id/consume-stock", requireRole("admin", "user"), c.consumeStock);

module.exports = router;
