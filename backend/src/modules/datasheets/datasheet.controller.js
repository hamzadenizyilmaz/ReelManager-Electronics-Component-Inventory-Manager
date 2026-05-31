const { ok, fail } = require("../../utils/api-response");
const service = require("./datasheet.service");

async function search(req, res, next) {
  try {
    const result = await service.searchDatasheets(req.query.query, { force: req.query.force === "true", stopOnFirst: false });
    return ok(res, "Datasheet search completed", result);
  } catch (error) {
    return next(error);
  }
}

async function enrich(req, res, next) {
  try {
    const result = await service.enrichPart(req.query.mpn, {
      force: req.query.force === "true",
      manualDatasheetUrl: req.query.manual_datasheet_url || req.query.manualDatasheetUrl
    });
    return ok(res, "Datasheet enrichment completed", result);
  } catch (error) {
    return next(error);
  }
}

async function enrichComponent(req, res, next) {
  try {
    const result = await service.enrichComponent(req.params.id, { force: req.body?.force === true });
    if (!result) return fail(res, "Component not found", [], 404);
    return ok(res, "Component enriched successfully", result);
  } catch (error) {
    return next(error);
  }
}

async function bulkEnrich(req, res, next) {
  try {
    const result = await service.bulkEnrich(req.body?.ids || [], { force: req.body?.force === true });
    return ok(res, "Bulk enrichment completed", result);
  } catch (error) {
    return next(error);
  }
}

async function providers(req, res) {
  return ok(res, "Datasheet enrichment provider order", service.PROVIDER_ORDER.map((name, index) => ({ order: index + 1, name })));
}

module.exports = { search, enrich, enrichComponent, bulkEnrich, providers };
