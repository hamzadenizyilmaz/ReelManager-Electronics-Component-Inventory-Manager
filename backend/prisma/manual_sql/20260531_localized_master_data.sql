-- Optional manual SQL for existing MySQL databases before/without Prisma migrate.
-- Adds Turkish / English display fields for master data tables.

ALTER TABLE categories
  ADD COLUMN name_tr VARCHAR(191) NULL AFTER name,
  ADD COLUMN name_en VARCHAR(191) NULL AFTER name_tr,
  ADD COLUMN description_tr TEXT NULL AFTER description,
  ADD COLUMN description_en TEXT NULL AFTER description_tr;

ALTER TABLE suppliers
  ADD COLUMN name_tr VARCHAR(191) NULL AFTER name,
  ADD COLUMN name_en VARCHAR(191) NULL AFTER name_tr;

ALTER TABLE storage_locations
  ADD COLUMN name_tr VARCHAR(191) NULL AFTER name,
  ADD COLUMN name_en VARCHAR(191) NULL AFTER name_tr,
  ADD COLUMN description_tr TEXT NULL AFTER description,
  ADD COLUMN description_en TEXT NULL AFTER description_tr;
