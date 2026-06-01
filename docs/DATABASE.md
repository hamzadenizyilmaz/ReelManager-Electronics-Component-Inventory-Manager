# Database Documentation

## Overview

ReelManager uses MySQL or MariaDB with Prisma ORM. The schema is designed around electronic component inventory workflows.

## Core Models

### User

Stores application users.

Common fields:

```txt
id
name
email
passwordHash
role
status
createdAt
updatedAt
```

Recommended roles:

```txt
admin
user
viewer
```

### Component

Stores electronic components.

Important fields:

```txt
id
internalSku
manufacturerPartNumber
supplierPartNumber
manufacturer
name
description
packageCase
value
valueNumeric
unit
tolerance
voltageRating
currentRating
powerRating
temperatureCoefficient
dielectric
material
footprint
mountingType
quantityTotal
quantityAvailable
quantityReserved
minimumStock
reorderQuantity
barcode
qrCode
datasheetUrl
productUrl
imageUrl
status
categoryId
supplierId
storageLocationId
createdAt
updatedAt
```

### Category

Stores component categories.

Examples:

```txt
Resistor
Capacitor
Diode
IC
Inductor
Connector
Module
Protection
```

Fields:

```txt
id
name
slug
description
createdAt
updatedAt
```

### Supplier

Stores supplier records.

Examples:

```txt
DigiKey
Mouser
Özdisan
LCSC
Farnell
```

Fields:

```txt
id
name
slug
website
contactName
contactEmail
phone
notes
createdAt
updatedAt
```

### Location

Stores physical storage locations.

Examples:

```txt
Rack A / Box 01
Drawer C / 0402 Resistors
SMD Cabinet / Capacitors
```

Fields:

```txt
id
name
slug
code
description
parentId
createdAt
updatedAt
```

### StockMovement

Stores stock operations.

Movement types:

```txt
IN
OUT
RESERVE
RELEASE
ADJUST
DAMAGED
LOST
RETURN
```

Fields:

```txt
id
componentId
movementType
quantity
quantityBefore
quantityAfter
reason
projectId
userId
notes
createdAt
```

### Project

Stores project/BOM containers.

Fields:

```txt
id
name
code
description
status
createdBy
createdAt
updatedAt
```

### BomItem

Stores BOM rows.

Fields:

```txt
id
projectId
componentId
referenceDesignator
requiredQuantity
usedQuantity
reservedQuantity
notes
createdAt
updatedAt
```

### ComponentEnrichmentCache

Caches provider results to avoid repeated API calls.

Fields:

```txt
id
query
manufacturerPartNumber
source
rawResponseJson
normalizedDataJson
confidenceScore
expiresAt
createdAt
updatedAt
```

### SystemSetting

Stores configurable system settings.

Fields:

```txt
id
key
valueJson
createdAt
updatedAt
```

### ActivityLog

Stores audit logs.

Fields:

```txt
id
action
entityType
entityId
method
path
route
statusCode
durationMs
queryJson
paramsJson
bodyJson
ip
userAgent
origin
referer
requestId
userId
createdAt
```

## Stock Calculation Rules

### Stock In

```txt
quantityTotal += quantity
quantityAvailable += quantity
```

### Stock Out

```txt
quantityTotal -= quantity
quantityAvailable -= quantity
```

Stock cannot become negative.

### Reserve

```txt
quantityAvailable -= quantity
quantityReserved += quantity
```

Reserve quantity cannot exceed available quantity.

### Release

```txt
quantityAvailable += quantity
quantityReserved -= quantity
```

Release quantity cannot exceed reserved quantity.

## Recommended Indexes

Recommended database indexes:

```txt
Component.manufacturerPartNumber
Component.supplierPartNumber
Component.internalSku
Component.barcode
Component.categoryId
Component.supplierId
Component.storageLocationId
StockMovement.componentId
StockMovement.createdAt
Project.code
BomItem.projectId
BomItem.componentId
ActivityLog.createdAt
ActivityLog.userId
ActivityLog.entityType
ComponentEnrichmentCache.query
ComponentEnrichmentCache.manufacturerPartNumber
```

## Migration Workflow

```bash
cd backend
npx prisma validate
npm run prisma:migrate
npm run prisma:seed
```

## Production Notes

- Always backup database before migration.
- Use a restricted MySQL user for production.
- Enable SSL/TLS if the database is remote.
- Do not expose database port publicly.
- Keep Prisma migrations under version control.
