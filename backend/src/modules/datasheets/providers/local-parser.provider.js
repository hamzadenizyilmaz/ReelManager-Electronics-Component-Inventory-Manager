const { parseComponentPartNumber } = require("../../../utils/component-parser");

function mapCategory(category) {
  if (!category) return null;
  const c = String(category).toLowerCase();
  if (c.includes("resistor")) return "Resistor";
  if (c.includes("capacitor")) return "Capacitor";
  if (c.includes("diode")) return "Diode";
  if (c.includes("tvs") || c.includes("esd")) return "TVS / ESD";
  if (c.includes("inductor")) return "Inductor";
  return category;
}

function normalizeLocalParserResult(query, parsed) {
  const pn = String(query || "").trim();
  const hasData = parsed && Object.keys(parsed).length > 0;

  return {
    manufacturer_part_number: pn,
    manufacturer: parsed.manufacturer_guess || parsed.manufacturer || null,
    description: parsed.type || parsed.category || (hasData ? "Local parser result" : "No confident parser match"),
    category: mapCategory(parsed.category),
    package_case: parsed.package_case || null,
    value: parsed.value || null,
    tolerance: parsed.tolerance || null,
    voltage_rating: parsed.voltage_rating || null,
    current_rating: parsed.current_rating || null,
    power_rating: parsed.power_rating || null,
    temperature_coefficient: parsed.temperature_coefficient || null,
    dielectric: parsed.dielectric || null,
    datasheet_url: null,
    product_url: null,
    image_url: null,
    source: "local-parser",
    confidence_score: hasData ? 0.58 : 0.22
  };
}

async function search(query) {
  const parsed = parseComponentPartNumber(query);
  return [normalizeLocalParserResult(query, parsed)];
}

module.exports = { search, normalizeLocalParserResult };
