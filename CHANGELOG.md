# Changelog

All notable changes to ReelManager will be documented in this file.

The format is inspired by Keep a Changelog, and this project follows semantic versioning where possible.

---

## [v2.2.0 Enterprise] - 2026-06-01

### Release Type

Enterprise feature and stability release.

### Summary

ReelManager v2.2.0 Enterprise is a major improvement release focused on update safety, backup reliability, dashboard clarity, language consistency, activity log visibility, GitHub release readiness and enterprise administration.

This version upgrades ReelManager from a feature-rich inventory platform into a safer and more maintainable system suitable for longer-term use.

---

## Added

### Updates Page

- Added redesigned `/updates` page.
- Added GitHub release check support.
- Added installed version display.
- Added latest GitHub version display.
- Added update availability status.
- Added version compatibility status.
- Added safe update action state.
- Added one-time update information panel.
- Added local browser state for hiding repeated update instructions.
- Added clear update status messages.
- Added update security warning area.
- Added update action protection.

### Update Safety

- Added version comparison before update.
- Added same-version update blocking.
- Added backend-side update compatibility validation.
- Added protection against unnecessary update execution.
- Added environment-controlled update execution.
- Added support for `ALLOW_SYSTEM_UPDATE`.
- Added support for `APP_VERSION`.
- Added safe mode behavior by default.
- Added update execution guard.

### Backup Before Update

- Added automatic backup before update execution.
- Added project file backup before update.
- Added SQL database backup before update.
- Added update backup manifest file.
- Added timestamped backup folder structure.
- Added update backup metadata.
- Added backup process safety validation.
- Added backup directory creation logic.

### SQL Backup Export

- Added SQL database export option.
- Added SQL backup download from settings.
- Added backend SQL export support.
- Added `format=sql` support for backup export endpoint.
- Added JSON backup export compatibility.
- Added structured backup response behavior.

### Backup and Remote Transfer

- Added remote backup validation.
- Added FTP/SFTP host validation.
- Added FTP/SFTP port validation.
- Added FTP/SFTP username validation.
- Added FTP/SFTP remote path validation.
- Added user-facing validation messages for missing remote transfer fields.
- Added connection test blocking when required data is missing.

### Activity Logs

- Added activity log detail endpoint.
- Added activity log detail page.
- Added method display.
- Added localized method display.
- Added route display.
- Added request path display.
- Added status code display.
- Added localized status display.
- Added duration display.
- Added request query display.
- Added request params display.
- Added request body display.
- Added request ID display.
- Added origin display.
- Added referer display.
- Added IP address display.
- Added user agent display.
- Added user identity display.
- Added timestamp display.

### Audit Logging

- Added more detailed HTTP audit logging.
- Added method logging.
- Added path logging.
- Added route logging.
- Added status code logging.
- Added response duration logging.
- Added query logging.
- Added params logging.
- Added body logging.
- Added user logging.
- Added IP logging.
- Added user-agent logging.
- Added origin logging.
- Added referer logging.
- Added timestamp logging.
- Added request ID logging.
- Added sensitive field masking.

### Sensitive Data Masking

- Added masking for `password`.
- Added masking for `token`.
- Added masking for `secret`.
- Added masking for `apiKey`.
- Added masking for `authorization`.
- Added masking for `clientSecret`.
- Added masking for `accessToken`.
- Added masking for `refreshToken`.

### Dashboard

- Added localized dashboard metric labels.
- Added dashboard key-to-label mapping.
- Added Turkish dashboard metric names.
- Added English dashboard metric names.

### Language System

- Added centralized language usage from settings.
- Added language setting persistence.
- Added support for displaying `Türkçe`.
- Added support for displaying `English`.
- Added improved language propagation across frontend pages.

### Footer

- Added smaller footer layout.
- Added footer version display.
- Added footer GitHub link.
- Added footer language indicator.
- Added footer short system description.

### Settings

- Added improved settings organization.
- Added updates/settings relationship.
- Added backup action improvements.
- Added language-related settings improvements.
- Added security section improvements.
- Added backup section improvements.
- Added visual appearance settings improvements.

### GitHub Release Support

- Added GitHub release documentation.
- Added release notes for v2.2.0.
- Added migration notes from v2.1.0 to v2.2.0.
- Added A-Z update documentation.
- Added release checklist.
- Added README badge documentation.
- Added release manifest.
- Added version metadata.

---

## Changed

### Dashboard

- Changed raw dashboard metric keys into readable labels.
- Changed `totalComponents` to `Toplam Komponent` / `Total Components`.
- Changed `totalStock` to `Toplam Stok` / `Total Stock`.
- Changed `lowStockItems` to `Düşük Stok` / `Low Stock`.
- Changed `outOfStockItems` to `Stokta Olmayan` / `Out of Stock`.

### Updates Page

- Changed update page layout to a cleaner enterprise-style design.
- Changed repeated informational content into one-time information.
- Changed update action behavior to prevent same-version updates.
- Changed update workflow to require backup before update.
- Changed update messaging to be clearer and safer.

### Backup

- Changed backup workflow to include SQL export.
- Changed update process to create file and database backups.
- Changed remote transfer testing to validate required fields before execution.

### Activity Logs

- Changed activity logs from basic list view to detailed inspection workflow.
- Changed log detail behavior from modal-only thinking to dedicated page navigation.
- Changed log values to display localized labels where appropriate.
- Changed log rendering to be more admin-friendly.

### Language

- Changed language labels from short technical labels to user-facing language names.
- Changed `TR / EN` display to `Türkçe / English`.
- Changed language selection behavior to apply across the panel.

### Footer

- Changed footer design to be smaller.
- Changed footer visual weight to be lighter.
- Changed footer layout to be more suitable for dashboard usage.

### Settings

- Changed settings page content to use shorter, more professional descriptions.
- Changed settings section descriptions to be more context-specific.
- Changed backup and update explanations to be more operational and less verbose.

---

## Fixed

### Dashboard

- Fixed dashboard metric labels showing internal API keys.
- Fixed unreadable dashboard card titles.
- Fixed inconsistent dashboard label language.

### Updates

- Fixed repeated update information appearing every time.
- Fixed update action being available when versions are already compatible.
- Fixed unsafe update attempts when no update is required.
- Fixed update workflow lacking automatic backup behavior.
- Fixed unclear update status messaging.

### Backup

- Fixed remote backup test behavior when required fields are missing.
- Fixed backup section not warning users about incomplete FTP/SFTP configuration.
- Fixed backup export being limited to JSON-only workflows.
- Fixed missing SQL backup option.

### Activity Logs

- Fixed logs not providing enough information for admin investigation.
- Fixed lack of dedicated log detail navigation.
- Fixed technical values being shown without localized meaning.
- Fixed missing detailed request metadata in log view.

### Footer

- Fixed footer being too large.
- Fixed footer occupying too much vertical space.
- Fixed footer visual weight in dashboard layout.

### Language

- Fixed language display not being fully consistent.
- Fixed language selector showing overly technical short labels.
- Fixed dashboard not respecting user-facing language label mapping.

---

## Security

### Update Security

- Added update execution guard using `ALLOW_SYSTEM_UPDATE`.
- Prevented update execution when versions are already compatible.
- Added backup-before-update requirement.
- Added safer update flow.
- Added explicit environment-level update control.

### Logging Security

- Added sensitive field masking.
- Prevented passwords and tokens from being stored in readable logs.
- Improved traceability without exposing secrets.
- Added safer request body logging.

### Backup Security

- Improved remote transfer validation.
- Reduced accidental invalid backup configuration.
- Added manifest generation for update backups.

### Admin Safety

- Improved settings descriptions for security-related sections.
- Added clearer update behavior for administrators.
- Added better logging visibility for operational audits.

---

## Backend Changes

### New or Updated Endpoints

#### Activity Logs

```txt
GET /api/activity-logs
GET /api/activity-logs/:id
GET /api/activity-logs/summary
```

#### Backup

```txt
GET /api/settings/backup/export
GET /api/settings/backup/export?format=json
GET /api/settings/backup/export?format=sql
POST /api/settings/backup/test
```

#### Updates

```txt
GET /api/updates/check
POST /api/updates/apply
```

### Backend Improvements

- Improved update service logic.
- Improved backup export logic.
- Added SQL export support.
- Added update backup workflow.
- Added activity log detail handling.
- Added detailed request logging.
- Added sensitive field masking.
- Added backend-side version compatibility check.
- Added safe update execution guard.

---

## Frontend Changes

### Updated Pages

```txt
/dashboard
/updates
/activity
/activity/:id
/settings
```

### Frontend Improvements

- Improved dashboard metric labels.
- Redesigned updates page.
- Added one-time update information behavior.
- Added update compatibility UI.
- Added backup and update safety UI.
- Added SQL backup download button.
- Improved remote backup validation UI.
- Improved activity log list.
- Added activity log detail page.
- Reduced footer height.
- Improved language display.
- Improved settings descriptions.

---

## Documentation Changes

### Added

```txt
RELEASE_NOTES_v2.2.0.md
RELEASE_NOTES_v2.2.0_SHORT.md
docs/MIGRATION_v2.1.0_TO_v2.2.0.md
docs/V2_2_0_ENTERPRISE_UPDATES_A_TO_Z.md
docs/GITHUB_RELEASE_v2.2.0.md
docs/API_v2.2.0.md
docs/SECURITY_UPDATE_WORKFLOW.md
docs/RELEASE_CHECKLIST_v2.2.0.md
docs/README_BADGES.md
RELEASE_MANIFEST_v2.2.0.json
```

### Updated

```txt
README.md
CHANGELOG.md
VERSION
SECURITY.md
SUPPORT.md
CONTRIBUTING.md
```

---

## Migration Notes

Users upgrading from v2.1.0 Enterprise should:

1. Backup the current project.
2. Backup the current MySQL database.
3. Replace or pull the updated source files.
4. Install backend dependencies.
5. Validate Prisma.
6. Run migration if needed.
7. Install frontend dependencies.
8. Clear `.next`.
9. Build frontend.
10. Verify dashboard, updates, backup and activity logs.

Recommended commands:

```bash
cd backend
npm install
npx prisma validate
npm run prisma:migrate
npm run dev
```

```bash
cd frontend
npm install
npm run build
npm run dev
```

---

## Environment Variables

Recommended version configuration:

```env
APP_VERSION="v2.2.0"
ALLOW_SYSTEM_UPDATE=false
GITHUB_REPOSITORY="hamzadenizyilmaz/ReelManager-Electronics-Component-Inventory-Manager"
```

Enable update execution only when required:

```env
ALLOW_SYSTEM_UPDATE=true
```

---

## Compatibility

### Backend

- Node.js
- Express.js
- Prisma ORM
- MySQL

### Frontend

- Next.js 15
- React
- Tailwind CSS

### Database

- MySQL

### CI/CD

- GitHub Actions

---

## Recommended Validation Checklist

After upgrading, verify:

- Dashboard cards show readable labels.
- Language setting is applied correctly.
- `/updates` loads correctly.
- `/updates` information panel appears only once.
- Same-version update is blocked.
- SQL backup export works.
- JSON backup export works.
- Backup remote test validates missing data.
- Activity logs load.
- Activity log detail page opens.
- Footer is smaller.
- GitHub release check works.
- Backend does not execute update unless allowed.

---

## Known Limitations

- GitHub update check requires internet access from backend server.
- Real update execution requires `ALLOW_SYSTEM_UPDATE=true`.
- SQL export depends on database access and environment configuration.
- FTP/SFTP transfer depends on external server availability.
- Browser-based USB/Serial printer discovery depends on browser permissions and WebUSB/WebSerial support.

---

## [v2.1.0 Enterprise] - Previous Release

### Summary

v2.1.0 Enterprise introduced the first complete enterprise-ready ReelManager package.

### Included

- Component inventory management
- Category management
- Supplier management
- Location management
- Project and BOM management
- Stock movements
- Low stock tracking
- Datasheet enrichment
- Label printing
- QR/barcode support
- CSV/XLSX import-export
- BOM PDF export
- JWT login
- Role-based access foundations
- Dark mode UI
- Turkish/English support
- Settings center
- Initial activity logs
- GitHub docs
- CI/CD workflows

---

## [v2.0.0] - Foundation Release

### Included

- Backend foundation
- Frontend foundation
- Prisma schema
- MySQL support
- Authentication foundation
- Component CRUD
- Dashboard foundation

---

## Repository

```txt
https://github.com/hamzadenizyilmaz/ReelManager-Electronics-Component-Inventory-Manager
```

---

## Maintainer Notes

v2.2.0 Enterprise should be treated as an operational stability release.

The most important improvements are:

- Safer updates
- Automatic backups
- SQL export
- Better logs
- Better dashboard labels
- Better release documentation

This version is recommended for all users using v2.1.0 Enterprise.
