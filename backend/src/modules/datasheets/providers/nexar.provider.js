const PROVIDER = "nexar";

function hasCredentials() {
  return Boolean(process.env.NEXAR_CLIENT_ID && process.env.NEXAR_CLIENT_SECRET);
}

async function withTimeout(promise, timeoutMs) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await promise(controller.signal);
  } finally {
    clearTimeout(timer);
  }
}

async function getToken(timeoutMs) {
  const body = new URLSearchParams({
    grant_type: "client_credentials",
    client_id: process.env.NEXAR_CLIENT_ID,
    client_secret: process.env.NEXAR_CLIENT_SECRET
  });

  const response = await withTimeout((signal) => fetch("https://identity.nexar.com/connect/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
    signal
  }), timeoutMs);

  if (!response.ok) throw new Error(`Nexar token failed: ${response.status}`);
  const json = await response.json();
  return json.access_token;
}

function firstValue(obj, paths) {
  for (const path of paths) {
    const value = path.split(".").reduce((acc, key) => acc?.[key], obj);
    if (value !== undefined && value !== null && value !== "") return value;
  }
  return null;
}

function normalizePart(part, query) {
  const specs = Array.isArray(part.specs) ? part.specs : [];
  const specMap = specs.reduce((acc, item) => {
    const key = String(item.attribute?.name || item.attribute?.shortname || "").toLowerCase();
    const val = item.displayValue || item.value || item.units || null;
    if (key && val) acc[key] = val;
    return acc;
  }, {});

  const datasheet = Array.isArray(part.documents)
    ? part.documents.find((d) => /datasheet/i.test(d.name || d.creditString || ""))
    : null;

  const categoryName = firstValue(part, ["category.name", "category.path"]);
  const manufacturer = firstValue(part, ["manufacturer.name"]);
  const mpn = part.mpn || query;

  return {
    manufacturer_part_number: mpn,
    manufacturer,
    description: part.shortDescription || part.descriptions?.[0]?.value || part.name || null,
    category: categoryName,
    package_case: specMap.package || specMap.case || specMap["case/package"] || specMap.mounting || null,
    value: specMap.resistance || specMap.capacitance || specMap.inductance || specMap.value || null,
    tolerance: specMap.tolerance || null,
    voltage_rating: specMap["voltage rating"] || specMap.voltage || specMap["dc voltage rating"] || null,
    current_rating: specMap["current rating"] || specMap.current || null,
    power_rating: specMap["power rating"] || specMap.power || null,
    temperature_coefficient: specMap["temperature coefficient"] || specMap.tcr || null,
    dielectric: specMap.dielectric || null,
    datasheet_url: datasheet?.url || part.bestDatasheet?.url || null,
    product_url: part.octopartUrl || part.referenceDesigns?.[0]?.url || null,
    image_url: part.image?.url || null,
    source: PROVIDER,
    confidence_score: manufacturer && mpn ? 0.92 : 0.78
  };
}

async function search(query, options = {}) {
  if (!hasCredentials()) return [];
  const timeoutMs = options.timeoutMs || 8000;
  const token = await getToken(timeoutMs);

  const gql = `
    query PartSearch($q: String!) {
      supSearch(q: $q, limit: 5) {
        results {
          part {
            mpn
            name
            shortDescription
            octopartUrl
            manufacturer { name }
            category { name path }
            image { url }
            bestDatasheet { url }
            documents { name url }
            specs { attribute { name shortname } displayValue value units }
          }
        }
      }
    }
  `;

  const response = await withTimeout((signal) => fetch("https://api.nexar.com/graphql", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify({ query: gql, variables: { q: query } }),
    signal
  }), timeoutMs);

  if (!response.ok) throw new Error(`Nexar search failed: ${response.status}`);
  const json = await response.json();
  const results = json?.data?.supSearch?.results || [];
  return results.map((r) => normalizePart(r.part, query)).filter(Boolean);
}

module.exports = { search, hasCredentials };
