# API Reference

Base URL:

```txt
http://localhost:4000/api
```

Production examples should use the domain configured in Nginx.

## Authentication

All protected routes require:

```http
Authorization: Bearer <JWT_TOKEN>
```

## Response Format

Success response:

```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": {}
}
```

Error response:

```json
{
  "success": false,
  "message": "Validation error",
  "errors": []
}
```

---

## Auth Endpoints

### POST `/auth/login`

Authenticates a user.

Request:

```json
{
  "email": "admin@example.com",
  "password": "Admin123!"
}
```

Response:

```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "jwt-token",
    "user": {
      "id": 1,
      "name": "Admin User",
      "email": "admin@example.com",
      "role": "admin"
    }
  }
}
```

### GET `/auth/me`

Returns current authenticated user.

### POST `/auth/logout`

Logs out the current session on supported clients.

---

## Dashboard Endpoints

### GET `/dashboard/summary`

Returns summary metrics.

### GET `/dashboard/category-stats`

Returns category distribution.

### GET `/dashboard/supplier-stats`

Returns supplier distribution.

### GET `/dashboard/package-stats`

Returns package/case distribution.

### GET `/dashboard/recent-movements`

Returns recent stock movements.

---

## Component Endpoints

### GET `/components`

Lists components.

Query parameters:

```txt
page
limit
search
categoryId
supplierId
packageCase
lowStock
outOfStock
```

### POST `/components`

Creates a component.

### GET `/components/:id`

Returns component detail.

### PUT `/components/:id`

Updates component.

### DELETE `/components/:id`

Deletes component.

### GET `/components/search?q=value`

Searches components.

### GET `/components/barcode/:barcode`

Finds component by barcode or QR value.

---

## Stock Endpoints

### POST `/components/:id/stock/in`

Adds stock.

### POST `/components/:id/stock/out`

Removes stock.

### POST `/components/:id/reserve`

Reserves stock.

### POST `/components/:id/release`

Releases reserved stock.

### GET `/components/:id/movements`

Returns component stock movements.

### GET `/stock/movements`

Returns all movements.

### GET `/stock/low`

Returns low-stock components.

### GET `/stock/out-of-stock`

Returns out-of-stock components.

---

## Master Data Endpoints

### Categories

```txt
GET    /categories
POST   /categories
GET    /categories/:id
PUT    /categories/:id
DELETE /categories/:id
```

### Suppliers

```txt
GET    /suppliers
POST   /suppliers
GET    /suppliers/:id
PUT    /suppliers/:id
DELETE /suppliers/:id
```

### Locations

```txt
GET    /locations
POST   /locations
GET    /locations/:id
PUT    /locations/:id
DELETE /locations/:id
```

---

## Projects and BOM

### GET `/projects`

Lists projects.

### POST `/projects`

Creates a project.

### GET `/projects/:id`

Returns project detail.

### PUT `/projects/:id`

Updates project.

### DELETE `/projects/:id`

Deletes project.

### POST `/projects/:id/bom`

Adds BOM item.

### PUT `/projects/:id/bom/:itemId`

Updates BOM item.

### DELETE `/projects/:id/bom/:itemId`

Deletes BOM item.

### POST `/projects/:id/check-stock`

Checks BOM stock availability.

### POST `/projects/:id/reserve-stock`

Reserves BOM stock.

### POST `/projects/:id/consume-stock`

Consumes BOM stock.

---

## Datasheet Enrichment

### GET `/datasheets/providers`

Returns configured providers.

### GET `/datasheets/search?query=RC0402FR-07330RL`

Searches datasheet data.

### GET `/datasheets/enrich?mpn=RC0402FR-07330RL`

Returns best normalized enrichment result.

### POST `/components/:id/enrich`

Enriches a component and updates fields if applicable.

### POST `/components/bulk-enrich`

Runs enrichment for multiple components.

---

## Import / Export

### POST `/import/components`

Uploads CSV/XLSX for import preview.

### GET `/export/components/csv`

Exports component list as CSV.

### GET `/export/components/xlsx`

Exports component list as XLSX.

### GET `/export/projects/:id/bom/pdf`

Exports project BOM as PDF.

---

## Settings

### GET `/settings/system`

Returns system settings.

### PUT `/settings/system`

Updates system settings.

### GET `/settings/users`

Returns user list.

### POST `/settings/users`

Creates a user.

### PUT `/settings/users/:id`

Updates user.

---

## Backup

### GET `/settings/backup/export`

Exports database backup as JSON by default.

### GET `/settings/backup/export?format=sql`

Exports database backup as SQL.

### POST `/settings/backup/test`

Validates remote backup configuration.

---

## Activity Logs

### GET `/activity-logs`

Lists activity logs.

### GET `/activity-logs/:id`

Returns detailed log entry.

### GET `/activity-logs/summary`

Returns log summary.

---

## Updates

### GET `/updates/check`

Checks GitHub release version.

### POST `/updates/apply`

Runs update only when allowed and needed.

Requires:

```env
ALLOW_SYSTEM_UPDATE=true
```
