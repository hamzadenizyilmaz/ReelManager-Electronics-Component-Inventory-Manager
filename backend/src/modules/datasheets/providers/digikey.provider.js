const PROVIDER = "digikey";

function hasCredentials() {
  return Boolean(process.env.DIGIKEY_CLIENT_ID && process.env.DIGIKEY_CLIENT_SECRET);
}

function normalizeProduct(product, query) {
  const params = Array.isArray(product.Parameters) ? product.Parameters : [];
  const getParam = (names) => {
    const found = params.find((p) => names.some((n) => String(p.ParameterText || p.Parameter || "").toLowerCase().includes(n)));
    return found?.ValueText || found?.Value || null;
  };

  return {
    manufacturer_part_number: product.ManufacturerProductNumber || product.ProductNumber || query,
    manufacturer: product.Manufacturer?.Name || product.ManufacturerName || null,
    description: product.Description?.ProductDescription || product.ProductDescription || product.Description || null,
    category: product.Category?.Name || product.Category || null,
    package_case: getParam(["package", "case"]),
    value: getParam(["resistance", "capacitance", "inductance"]),
    tolerance: getParam(["tolerance"]),
    voltage_rating: getParam(["voltage"]),
    current_rating: getParam(["current"]),
    power_rating: getParam(["power"]),
    temperature_coefficient: getParam(["temperature coefficient", "tcr"]),
    dielectric: getParam(["dielectric"]),
    datasheet_url: product.DatasheetUrl || null,
    product_url: product.ProductUrl || null,
    image_url: product.PhotoUrl || product.PrimaryPhoto || null,
    source: PROVIDER,
    confidence_score: 0.86
  };
}

async function search() {
  // DigiKey production API requires OAuth token management and account authorization.
  // The provider is intentionally safe: it is skipped unless token flow is implemented.
  if (!hasCredentials()) return [];
  return [];
}

module.exports = { search, hasCredentials, normalizeProduct };
