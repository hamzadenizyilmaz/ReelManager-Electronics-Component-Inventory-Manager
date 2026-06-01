const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const morgan = require("morgan");
const swaggerUi = require("swagger-ui-express");

const { frontendUrl } = require("./config/env");
const { notFound, errorHandler } = require("./middlewares/error.middleware");
const swaggerSpec = require("./docs/swagger");
const auditMiddleware = require("./middlewares/audit.middleware");

const app = express();
const allowedOrigins = new Set([frontendUrl, "http://localhost:3000", "http://127.0.0.1:3000"].filter(Boolean));

app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" },
  contentSecurityPolicy: false
}));

app.use(cors({
  origin(origin, cb) {
    if (!origin || allowedOrigins.has(origin)) return cb(null, true);
    return cb(null, false);
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ extended: true, limit: "5mb" }));
app.use(morgan("dev"));
app.use(rateLimit({ windowMs: 60_000, max: 300, standardHeaders: true, legacyHeaders: false }));

function sendSwaggerJson(req, res) {
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  return res.status(200).send(JSON.stringify(swaggerSpec, null, 2));
}

app.get("/docs.json", sendSwaggerJson);
app.get("/api/docs.json", sendSwaggerJson);

app.use("/docs", swaggerUi.serveFiles(swaggerSpec), swaggerUi.setup(swaggerSpec, {
  explorer: true,
  swaggerOptions: { persistAuthorization: true },
  customSiteTitle: "SMD Stock Manager API Docs"
}));

app.use("/api/docs", swaggerUi.serveFiles(swaggerSpec), swaggerUi.setup(swaggerSpec, {
  explorer: true,
  swaggerOptions: { persistAuthorization: true },
  customSiteTitle: "SMD Stock Manager API Docs"
}));

app.get("/api/health", (req, res) => res.json({
  success: true,
  message: "SMD Stock Manager API is running",
  data: { uptime: process.uptime() }
}));

app.use("/api", auditMiddleware);

app.use("/api/auth", require("./modules/auth/auth.routes"));
app.use("/api/datasheets", require("./modules/datasheets/datasheet.routes"));
app.use("/api/components", require("./modules/components/components.routes"));
app.use("/api/categories", require("./modules/categories/categories.routes"));
app.use("/api/suppliers", require("./modules/suppliers/suppliers.routes"));
app.use("/api/locations", require("./modules/locations/locations.routes"));
app.use("/api/projects", require("./modules/projects/projects.routes"));
app.use("/api/stock", require("./modules/stock/stock.routes"));
app.use("/api/dashboard", require("./modules/dashboard/dashboard.routes"));
app.use("/api/settings", require("./modules/settings/settings.routes"));
app.use("/api/updates", require("./modules/updates/updates.routes"));
app.use("/api", require("./modules/activity-logs/activity-logs.routes"));
app.use("/api", require("./modules/import-export/import-export.routes"));

app.use(notFound);
app.use(errorHandler);

module.exports = app;
