const router = require("express").Router();
const auth = require("../../middlewares/auth.middleware");
const requireRole = require("../../middlewares/role.middleware");
const validate = require("../../middlewares/validate.middleware");
const { schema } = require("./suppliers.validation");
const c = require("./suppliers.controller");

router.use(auth);
router.get("/", c.list);
router.get("/:id", c.get);
router.post("/", requireRole("admin", "user"), validate(schema), c.create);
router.put("/:id", requireRole("admin", "user"), validate(schema), c.update);
router.delete("/:id", requireRole("admin"), c.remove);

module.exports = router;
