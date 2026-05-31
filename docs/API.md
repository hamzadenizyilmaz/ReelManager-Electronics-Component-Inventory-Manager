# API Documentation

Swagger UI is available at:

```text
http://localhost:4000/api/docs
```

Swagger JSON is available at:

```text
http://localhost:4000/api/docs.json
```

## Response Format

Success:

```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": {}
}
```

Error:

```json
{
  "success": false,
  "message": "Validation error",
  "errors": []
}
```

## Main Endpoint Groups

### Auth

```text
POST /api/auth/register
POST /api/auth/login
POST /api/auth/logout
GET  /api/auth/me
POST /api/auth/refresh
```

### Components

```text
GET    /api/components
GET    /api/components/:id
POST   /api/components
PUT    /api/components/:id
DELETE /api/components/:id
POST   /api/components/:id/stock/in
POST   /api/components/:id/stock/out
POST   /api/components/:id/reserve
POST   /api/components/:id/release
GET    /api/components/:id/movements
GET    /api/components/search
GET    /api/components/barcode/:barcode
POST   /api/components/:id/enrich
POST   /api/components/bulk-enrich
```

### Datasheets

```text
GET /api/datasheets/providers
GET /api/datasheets/search?query=RC0402FR-07330RL
GET /api/datasheets/enrich?mpn=RC0402FR-07330RL
```

### Projects / BOM

```text
GET    /api/projects
GET    /api/projects/:id
POST   /api/projects
PUT    /api/projects/:id
DELETE /api/projects/:id
POST   /api/projects/:id/bom
PUT    /api/projects/:id/bom/:itemId
DELETE /api/projects/:id/bom/:itemId
POST   /api/projects/:id/check-stock
POST   /api/projects/:id/reserve-stock
POST   /api/projects/:id/consume-stock
```

### Import / Export

```text
POST /api/import/components
GET  /api/export/components/csv
GET  /api/export/components/xlsx
GET  /api/export/projects/:id/bom/pdf
```
