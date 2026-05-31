const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const prisma = require("../../config/database");
const { jwtSecret, jwtExpiresIn } = require("../../config/env");
const { ok, fail } = require("../../utils/api-response");

function sign(user) {
  return jwt.sign({ id: user.id, role: user.role }, jwtSecret, { expiresIn: jwtExpiresIn });
}

async function register(req, res) {
  const passwordHash = await bcrypt.hash(req.body.password, 12);
  const user = await prisma.user.create({
    data: { name: req.body.name, email: req.body.email, passwordHash, role: req.body.role }
  });
  return ok(res, "User registered", { id: user.id, email: user.email, role: user.role }, 201);
}

async function login(req, res) {
  const user = await prisma.user.findUnique({ where: { email: req.body.email } });
  if (!user) return fail(res, "Invalid credentials", [], 401);
  const valid = await bcrypt.compare(req.body.password, user.passwordHash);
  if (!valid) return fail(res, "Invalid credentials", [], 401);
  const token = sign(user);
  return ok(res, "Login successful", { token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
}

async function me(req, res) {
  return ok(res, "Authenticated user", req.user);
}

async function logout(req, res) {
  return ok(res, "Logout successful");
}

async function refresh(req, res) {
  return ok(res, "Token refreshed", { token: sign(req.user) });
}

module.exports = { register, login, me, logout, refresh };
