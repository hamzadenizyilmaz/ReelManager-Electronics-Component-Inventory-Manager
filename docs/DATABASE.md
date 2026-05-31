# Database

ReelManager uses MySQL with Prisma ORM.

## Main Tables

- `users`
- `categories`
- `suppliers`
- `storage_locations`
- `components`
- `stock_movements`
- `projects`
- `project_bom_items`
- `purchase_orders`
- `purchase_order_items`
- `labels`
- `component_labels`
- `activity_logs`
- `component_enrichment_cache`
- `system_settings`

## Important Indexes

The schema is designed around frequent inventory lookups:

- `internal_sku`
- `manufacturer_part_number`
- `supplier_part_number`
- `barcode`
- `category_id`
- `supplier_id`
- `storage_location_id`

## Migration

```bash
cd backend
npm run prisma:migrate
```

## Seed

```bash
npm run prisma:seed
```

The seed creates:

- Default admin user
- Default categories
- Default suppliers
- Default locations
- Example components

## MySQL Secure Transport

Some MySQL servers require TLS.

Fast development workaround:

```env
DATABASE_URL="mysql://USER:PASSWORD@HOST:3306/ReelManagerDB?sslaccept=accept_invalid_certs"
```

Production recommendation:

```env
DATABASE_URL="mysql://USER:PASSWORD@HOST:3306/ReelManagerDB?sslaccept=strict&sslca=../certs/mysql-ca.pem"
```
