const prisma = require("../config/database");

const SENSITIVE_KEYS = new Set([
  "password", "passwordHash", "token", "accessToken", "refreshToken", "authorization",
  "clientSecret", "apiKey", "mouserApiKey", "nexarClientSecret", "digikeyClientSecret",
  "secret", "key", "privateKey", "cookie"
]);

function sanitize(value, depth = 0) {
  if (depth > 5) return "[max-depth]";
  if (value === null || value === undefined) return value;
  if (Array.isArray(value)) return value.slice(0, 100).map((item) => sanitize(item, depth + 1));
  if (typeof value === "object") {
    const out = {};
    for (const [key, val] of Object.entries(value)) {
      const normalized = String(key).toLowerCase();
      out[key] = SENSITIVE_KEYS.has(key) || normalized.includes("password") || normalized.includes("secret") || normalized.includes("token") || normalized.includes("apikey") ? "[redacted]" : sanitize(val, depth + 1);
    }
    return out;
  }
  if (typeof value === "string" && value.length > 1500) return `${value.slice(0, 1500)}...[truncated]`;
  return value;
}

function entityFromPath(path) {
  const parts = String(path || "").split("?")[0].split("/").filter(Boolean);
  return parts[1] || parts[0] || "api";
}

function actionFromMethod(method) {
  if (method === "GET") return "READ";
  if (method === "POST") return "CREATE_OR_ACTION";
  if (method === "PUT" || method === "PATCH") return "UPDATE";
  if (method === "DELETE") return "DELETE";
  return method || "REQUEST";
}

function auditMiddleware(req, res, next) {
  const startedAt = Date.now();
  const originalPath = req.originalUrl || req.url || "";

  if (originalPath.includes("/docs") || originalPath.includes("/health") || originalPath.includes("/activity-logs")) {
    return next();
  }

  res.on("finish", () => {
    const method = req.method;
    const statusCode = res.statusCode;
    const durationMs = Date.now() - startedAt;
    const baseAction = actionFromMethod(method);

    prisma.activityLog.create({
      data: {
        userId: req.user?.id || null,
        action: `${baseAction}_${statusCode}`,
        entityType: entityFromPath(req.path || originalPath),
        entityId: req.params?.id ? Number(req.params.id) || null : null,
        oldValue: undefined,
        newValue: {
          eventKind: "api_request",
          method,
          methodTr: methodToTr(method),
          path: originalPath,
          routePath: req.route?.path || null,
          statusCode,
          statusTextTr: statusToTr(statusCode),
          durationMs,
          success: statusCode >= 200 && statusCode < 400,
          query: sanitize(req.query),
          params: sanitize(req.params),
          body: sanitize(req.body),
          contentType: req.get("content-type") || null,
          referer: req.get("referer") || null,
          origin: req.get("origin") || null,
          requestId: req.get("x-request-id") || `${Date.now()}-${Math.random().toString(16).slice(2)}`,
          timestamp: new Date().toISOString()
        },
        ipAddress: req.ip,
        userAgent: req.get("user-agent") || null
      }
    }).catch(() => null);
  });

  return next();
}

function methodToTr(method) {
  return { GET: "Okuma", POST: "Oluşturma/İşlem", PUT: "Güncelleme", PATCH: "Kısmi Güncelleme", DELETE: "Silme" }[method] || method;
}

function statusToTr(code) {
  if (code >= 200 && code < 300) return "Başarılı";
  if (code >= 300 && code < 400) return "Yönlendirme";
  if (code === 401) return "Yetkisiz";
  if (code === 403) return "Erişim Reddedildi";
  if (code === 404) return "Bulunamadı";
  if (code >= 400 && code < 500) return "İstemci Hatası";
  if (code >= 500) return "Sunucu Hatası";
  return "Bilinmiyor";
}

module.exports = auditMiddleware;
