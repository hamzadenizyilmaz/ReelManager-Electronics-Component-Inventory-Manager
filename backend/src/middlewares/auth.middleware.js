const jwt = require("jsonwebtoken");
const prisma = require("../config/database");
const { jwtSecret } = require("../config/env");
const { fail } = require("../utils/api-response");

async function auth(req, res, next) {
  try {
    const header = req.headers.authorization || "";
    const token = header.startsWith("Bearer ") ? header.slice(7) : null;
    if (!token) return fail(res, "Unauthorized", [], 401);
    const decoded = jwt.verify(token, jwtSecret);
    const user = await prisma.user.findUnique({ where: { id: decoded.id } });
    if (!user || user.status !== "active") return fail(res, "Unauthorized", [], 401);
    req.user = { id: user.id, role: user.role, email: user.email, name: user.name };
    next();
  } catch {
    return fail(res, "Invalid token", [], 401);
  }
}
module.exports = auth;
