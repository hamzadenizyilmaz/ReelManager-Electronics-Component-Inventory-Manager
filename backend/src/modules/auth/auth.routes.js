const router = require("express").Router();
const validate = require("../../middlewares/validate.middleware");
const auth = require("../../middlewares/auth.middleware");
const requireRole = require("../../middlewares/role.middleware");
const { registerSchema, loginSchema } = require("./auth.validation");
const c = require("./auth.controller");

router.post("/register", auth, requireRole("admin"), validate(registerSchema), c.register);
router.post("/login", validate(loginSchema), c.login);
router.post("/logout", auth, c.logout);
router.get("/me", auth, c.me);
router.post("/refresh", auth, c.refresh);

module.exports = router;
