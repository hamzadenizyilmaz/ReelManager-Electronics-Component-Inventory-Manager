# Datasheet Enrichment

## Purpose

The datasheet enrichment module allows the system to automatically find component information using manufacturer part number or supplier part number.

## Provider Order

1. Local database
2. Nexar / Octopart API
3. DigiKey API
4. Mouser API
5. Local parser fallback
6. Manual datasheet URL

## Module Structure

```txt
backend/src/modules/datasheets/
  datasheet.routes.js
  datasheet.controller.js
  datasheet.service.js
  datasheet.validation.js
  providers/
    nexar.provider.js
    digikey.provider.js
    mouser.provider.js
    local-parser.provider.js
```

## Environment Variables

```env
NEXAR_CLIENT_ID=""
NEXAR_CLIENT_SECRET=""
DIGIKEY_CLIENT_ID=""
DIGIKEY_CLIENT_SECRET=""
DIGIKEY_REDIRECT_URI=""
MOUSER_API_KEY=""
DATASHEET_PROVIDER_TIMEOUT_MS="8000"
DATASHEET_CACHE_TTL_DAYS="30"
```

## Normalized Data Format

```json
{
  "manufacturerPartNumber": "RC0402FR-07330RL",
  "manufacturer": "YAGEO",
  "description": "330 Ohm 0402 resistor",
  "category": "Resistor",
  "packageCase": "0402",
  "value": "330 Ohm",
  "tolerance": "1%",
  "voltageRating": "50V",
  "currentRating": null,
  "powerRating": "1/16W",
  "temperatureCoefficient": "100ppm",
  "dielectric": null,
  "datasheetUrl": "https://example.com/datasheet.pdf",
  "productUrl": "https://example.com/product",
  "imageUrl": null,
  "source": "nexar",
  "confidenceScore": 0.92
}
```

## Cache Behavior

Results are stored in `component_enrichment_cache` to avoid repeated API calls.

Cache fields:

```txt
query
manufacturerPartNumber
source
rawResponseJson
normalizedDataJson
confidenceScore
expiresAt
```

## Failure Behavior

If an API key is missing, the provider is skipped.

If a provider times out, the next provider is tried.

If all providers fail, local parser fallback is used.

## Frontend Flow

1. User enters part number.
2. User clicks search/enrich.
3. System displays normalized results.
4. User selects one result.
5. Form fields are filled automatically.
6. Datasheet URL is saved when available.
