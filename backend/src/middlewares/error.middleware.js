const { fail } = require("../utils/api-response");
function notFound(req, res) {
  return fail(res, `Route not found: ${req.method} ${req.originalUrl}`, [], 404);
}
function errorHandler(err, req, res, next) {
  console.error(err);
  if (err.message === "NOT_FOUND") return fail(res, "Record not found", [], 404);
  if (err.message === "NEGATIVE_STOCK") return fail(res, "Stok negatif olamaz", [], 422);
  if (err.message === "RESERVE_TOO_HIGH") return fail(res, "Rezerve edilecek adet available stoktan fazla olamaz", [], 422);
  if (err.message === "RELEASE_TOO_HIGH") return fail(res, "Bırakılacak adet rezerve stoktan fazla olamaz", [], 422);
  if (err.code === "P2002") return fail(res, "Duplicate record", [err.meta?.target || "unique constraint"], 409);
  if (err.code === "P2003") return fail(res, "Related record not found or record is in use", [err.meta?.field_name || "foreign key"], 409);
  if (err.code === "P2025") return fail(res, "Record not found", [], 404);
  return fail(res, process.env.NODE_ENV === "development" ? err.message : "Internal server error", [], 500);
}
module.exports = { notFound, errorHandler };
