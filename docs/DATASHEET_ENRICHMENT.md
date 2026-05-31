# Datasheet Enrichment

The datasheet enrichment module helps users fill component information automatically by entering a manufacturer part number or supplier part number.

## Provider Chain

1. Local database
2. Nexar / Octopart API
3. DigiKey API
4. Mouser API
5. Local parser fallback
6. Manual datasheet URL

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

## Cache Table

`component_enrichment_cache` stores normalized results and raw provider responses.

Fields:

- query
- manufacturer_part_number
- source
- raw_response_json
- normalized_data_json
- confidence_score
- expires_at
- created_at
- updated_at

## Normalized Data

Provider responses are normalized into:

- manufacturer_part_number
- manufacturer
- description
- category
- package_case
- value
- tolerance
- voltage_rating
- current_rating
- power_rating
- temperature_coefficient
- dielectric
- datasheet_url
- product_url
- image_url
- source
- confidence_score
