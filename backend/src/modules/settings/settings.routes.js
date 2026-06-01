const router = require("express").Router();
const auth = require("../../middlewares/auth.middleware");
const requireRole = require("../../middlewares/role.middleware");
const validate = require("../../middlewares/validate.middleware");
const c = require("./settings.controller");
const { systemSettingsSchema, userCreateSchema, userUpdateSchema } = require("./settings.validation");

router.use(auth, requireRole("admin"));
router.get("/system", c.getSystem);
router.put("/system", validate(systemSettingsSchema), c.updateSystem);
router.get("/users", c.listUsers);
router.post("/users", validate(userCreateSchema), c.createUser);
router.put("/users/:id", validate(userUpdateSchema), c.updateUser);
router.get("/backup/export", c.exportBackup);
router.post("/backup/test", c.testBackupTarget);

module.exports = router;
