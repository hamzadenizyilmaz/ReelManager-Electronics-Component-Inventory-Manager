const PROVIDER = "mouser";

function hasCredentials() {
  return Boolean(process.env.MOUSER_API_KEY);
}

function normalizePart(part, query) {
  const attr = Array.isArray(part.ProductAttributes) ? part.ProductAttributes : [];
  const get = (names) => {
    const found = attr.find((a) => names.some((n) => String(a.AttributeName || "").toLowerCase().includes(n)));
    return found?.AttributeValue || null;
  };

  return {
    manufacturer_part_number: part.ManufacturerPartNumber || query,
    manufacturer: part.Manufacturer || null,
    description: part.Description || null,
    category: part.Category || null,
    package_case: get(["package", "case"]),
    value: get(["resistance", "capacitance", "inductance"]),
    tolerance: get(["tolerance"]),
    voltage_rating: get(["voltage"]),
    current_rating: get(["current"]),
    power_rating: get(["power"]),
    temperature_coefficient: get(["temperature coefficient", "tcr"]),
    dielectric: get(["dielectric"]),
    datasheet_url: part.DataSheetUrl || null,
    product_url: part.ProductDetailUrl || null,
    image_url: part.ImagePath || null,
    source: PROVIDER,
    confidence_score: 0.84
  };
}

async function search(query, options = {}) {
  if (!hasCredentials()) return [];
  const timeoutMs = options.timeoutMs || 8000;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const url = `https://api.mouser.com/api/v1/search/partnumber?apiKey=${encodeURIComponent(process.env.MOUSER_API_KEY)}`;
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ SearchByPartRequest: { mouserPartNumber: query, partSearchOptions: "string" } }),
      signal: controller.signal
    });
    if (!response.ok) throw new Error(`Mouser search failed: ${response.status}`);
    const json = await response.json();
    const parts = json?.SearchResults?.Parts || [];
    return parts.map((p) => normalizePart(p, query));
  } finally {
    clearTimeout(timer);
  }
}

module.exports = { search, hasCredentials, normalizePart };
