const prisma = require("../../config/database");
const nexar = require("./providers/nexar.provider");
const digikey = require("./providers/digikey.provider");
const mouser = require("./providers/mouser.provider");
const localParser = require("./providers/local-parser.provider");

const PROVIDER_ORDER = ["local-database", "nexar", "digikey", "mouser", "local-parser", "manual-url"];
const CACHE_TTL_DAYS = Number(process.env.DATASHEET_CACHE_TTL_DAYS || 30);
const TIMEOUT_MS = Number(process.env.DATASHEET_PROVIDER_TIMEOUT_MS || 8000);

function normalizeQuery(value) {
  return String(value || "").trim().toUpperCase();
}

function expiresAt() {
  return new Date(Date.now() + CACHE_TTL_DAYS * 24 * 60 * 60 * 1000);
}

function clampScore(value, fallback = 0.5) {
  const n = Number(value ?? fallback);
  if (Number.isNaN(n)) return fallback;
  return Math.max(0, Math.min(1, n));
}

function cleanNormalized(item, fallbackQuery, source) {
  return {
    manufacturer_part_number: item.manufacturer_part_number || fallbackQuery || null,
    manufacturer: item.manufacturer || null,
    description: item.description || null,
    category: item.category || null,
    package_case: item.package_case || null,
    value: item.value || null,
    tolerance: item.tolerance || null,
    voltage_rating: item.voltage_rating || null,
    current_rating: item.current_rating || null,
    power_rating: item.power_rating || null,
    temperature_coefficient: item.temperature_coefficient || null,
    dielectric: item.dielectric || null,
    datasheet_url: item.datasheet_url || null,
    product_url: item.product_url || null,
    image_url: item.image_url || null,
    source: source || item.source || "unknown",
    confidence_score: clampScore(item.confidence_score)
  };
}

async function readCache(query) {
  const q = normalizeQuery(query);
  const rows = await prisma.componentEnrichmentCache.findMany({
    where: { query: q, expiresAt: { gt: new Date() } },
    orderBy: [{ confidenceScore: "desc" }, { updatedAt: "desc" }],
    take: 20
  }).catch(() => []);

  return rows.map((row) => ({
    ...(row.normalizedDataJson || {}),
    source: row.source,
    confidence_score: Number(row.confidenceScore || row.normalizedDataJson?.confidence_score || 0.5),
    cached: true,
    cache_id: row.id
  }));
}

async function writeCache(query, source, rawResponse, normalizedItems) {
  const q = normalizeQuery(query);
  const items = Array.isArray(normalizedItems) ? normalizedItems : [normalizedItems];

  await Promise.all(items.filter(Boolean).map((item) => prisma.componentEnrichmentCache.create({
    data: {
      query: q,
      manufacturerPartNumber: item.manufacturer_part_number || q,
      source: item.source || source,
      rawResponseJson: rawResponse || null,
      normalizedDataJson: item,
      confidenceScore: clampScore(item.confidence_score),
      expiresAt: expiresAt()
    }
  }).catch(() => null)));
}

async function searchLocalDatabase(query) {
  const q = normalizeQuery(query);
  const components = await prisma.component.findMany({
    where: {
      OR: [
        { manufacturerPartNumber: { contains: q } },
        { supplierPartNumber: { contains: q } },
        { internalSku: { contains: q } },
        { barcode: { contains: q } }
      ]
    },
    include: { category: true, supplier: true },
    take: 5,
    orderBy: { updatedAt: "desc" }
  });

  return components.map((c) => cleanNormalized({
    manufacturer_part_number: c.manufacturerPartNumber,
    manufacturer: c.manufacturer,
    description: c.description || c.name,
    category: c.category?.nameEn || c.category?.name || null,
    package_case: c.packageCase,
    value: c.value,
    tolerance: c.tolerance,
    voltage_rating: c.voltageRating,
    current_rating: c.currentRating,
    power_rating: c.powerRating,
    temperature_coefficient: c.temperatureCoefficient,
    dielectric: c.dielectric,
    datasheet_url: c.datasheetUrl,
    product_url: c.productUrl,
    image_url: c.imageUrl,
    source: "local-database",
    confidence_score: 1
  }, q, "local-database"));
}

async function safeProviderRun(name, fn, query) {
  try {
    const results = await fn(query, { timeoutMs: TIMEOUT_MS });
    return { name, skipped: false, error: null, results: Array.isArray(results) ? results : [] };
  } catch (error) {
    return { name, skipped: false, error: error.message, results: [] };
  }
}

async function searchDatasheets(query, options = {}) {
  const q = normalizeQuery(query);
  if (!q) return { query: q, results: [], providers: [] };

  if (!options.force) {
    const cached = await readCache(q);
    if (cached.length) return { query: q, results: cached, providers: [{ name: "cache", status: "hit", count: cached.length }] };
  }

  const providers = [];
  const results = [];

  const local = await searchLocalDatabase(q);
  providers.push({ name: "local-database", status: local.length ? "hit" : "miss", count: local.length });
  results.push(...local);
  if (local.length && options.stopOnFirst !== false) {
    await writeCache(q, "local-database", { source: "local-database" }, local);
    return { query: q, results, providers };
  }

  const chain = [
    { name: "nexar", enabled: nexar.hasCredentials(), run: nexar.search },
    { name: "digikey", enabled: digikey.hasCredentials(), run: digikey.search },
    { name: "mouser", enabled: mouser.hasCredentials(), run: mouser.search }
  ];

  for (const provider of chain) {
    if (!provider.enabled) {
      providers.push({ name: provider.name, status: "skipped", reason: "missing-api-key", count: 0 });
      continue;
    }
    const outcome = await safeProviderRun(provider.name, provider.run, q);
    const normalized = outcome.results.map((item) => cleanNormalized(item, q, provider.name));
    providers.push({ name: provider.name, status: normalized.length ? "hit" : outcome.error ? "error" : "miss", error: outcome.error, count: normalized.length });
    results.push(...normalized);
    if (normalized.length) {
      await writeCache(q, provider.name, outcome.results, normalized);
      if (options.stopOnFirst !== false) return { query: q, results, providers };
    }
  }

  const parsed = (await localParser.search(q)).map((item) => cleanNormalized(item, q, "local-parser"));
  providers.push({ name: "local-parser", status: parsed.length ? "hit" : "miss", count: parsed.length });
  results.push(...parsed);
  await writeCache(q, "local-parser", { source: "local-parser" }, parsed);

  if (options.manualDatasheetUrl) {
    const manual = cleanNormalized({ manufacturer_part_number: q, datasheet_url: options.manualDatasheetUrl, source: "manual-url", confidence_score: 0.35 }, q, "manual-url");
    providers.push({ name: "manual-url", status: "hit", count: 1 });
    results.push(manual);
    await writeCache(q, "manual-url", { url: options.manualDatasheetUrl }, manual);
  }

  return {
    query: q,
    results: results.sort((a, b) => Number(b.confidence_score || 0) - Number(a.confidence_score || 0)),
    providers
  };
}

async function enrichPart(mpn, options = {}) {
  const response = await searchDatasheets(mpn, { ...options, stopOnFirst: true });
  return {
    ...response,
    best: response.results[0] || null
  };
}

function toComponentUpdate(normalized) {
  if (!normalized) return {};
  return {
    manufacturerPartNumber: normalized.manufacturer_part_number || undefined,
    manufacturer: normalized.manufacturer || undefined,
    description: normalized.description || undefined,
    packageCase: normalized.package_case || undefined,
    value: normalized.value || undefined,
    tolerance: normalized.tolerance || undefined,
    voltageRating: normalized.voltage_rating || undefined,
    currentRating: normalized.current_rating || undefined,
    powerRating: normalized.power_rating || undefined,
    temperatureCoefficient: normalized.temperature_coefficient || undefined,
    dielectric: normalized.dielectric || undefined,
    datasheetUrl: normalized.datasheet_url || undefined,
    productUrl: normalized.product_url || undefined,
    imageUrl: normalized.image_url || undefined
  };
}

async function enrichComponent(componentId, options = {}) {
  const component = await prisma.component.findUnique({ where: { id: Number(componentId) } });
  if (!component) return null;

  const query = component.manufacturerPartNumber || component.supplierPartNumber || component.internalSku;
  const enrichment = await enrichPart(query, { manualDatasheetUrl: component.datasheetUrl, force: options.force });
  const update = toComponentUpdate(enrichment.best);
  const updated = Object.keys(update).length
    ? await prisma.component.update({ where: { id: component.id }, data: update })
    : component;

  return { component: updated, enrichment };
}

async function bulkEnrich(ids = [], options = {}) {
  const where = ids.length ? { id: { in: ids.map(Number) } } : {};
  const components = await prisma.component.findMany({ where, take: 100, orderBy: { updatedAt: "desc" } });
  const results = [];
  for (const component of components) {
    const item = await enrichComponent(component.id, options);
    results.push({ id: component.id, ok: Boolean(item), result: item });
  }
  return results;
}

module.exports = {
  PROVIDER_ORDER,
  searchDatasheets,
  enrichPart,
  enrichComponent,
  bulkEnrich
};
