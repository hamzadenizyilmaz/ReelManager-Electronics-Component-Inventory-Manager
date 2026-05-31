const { fail } = require("../utils/api-response");
function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return fail(res, "Forbidden", [], 403);
    }
    next();
  };
}
module.exports = requireRole;
