const router = require("express").Router();
const auth = require("../../middlewares/auth.middleware");
const requireRole = require("../../middlewares/role.middleware");
const validate = require("../../middlewares/validate.middleware");
const c = require("./datasheet.controller");
const { searchSchema, enrichSchema } = require("./datasheet.validation");

router.use(auth);
router.get("/providers", c.providers);
router.get("/search", validate(searchSchema, "query"), c.search);
router.get("/enrich", validate(enrichSchema, "query"), c.enrich);

module.exports = router;
