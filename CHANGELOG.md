# Changelog

All notable changes to ReelManager are documented here.

## v2.1.0 Enterprise — 30.05.2026

### Added

- Version badges inside application layout
- Robust frontend token/session manager
- Cookie-assisted route guard for protected pages
- Central Axios Authorization interceptor
- Session cleanup on unauthorized responses
- Datasheet enrichment module
- Nexar / Octopart provider foundation
- DigiKey provider foundation
- Mouser provider foundation
- Local parser fallback provider
- Component enrichment cache table
- Label Printing Studio
- Zebra ZPL helper output
- Settings center foundation
- TR/EN localized master data fields
- GitHub-ready docs package
- Issue templates and PR template
- Security and contributing docs

### Fixed

- Dashboard 401 issue after successful login
- Token persistence mismatch between login and API client
- Sidebar active state for `/components/new`
- Dark-mode chart tooltip contrast
- Full-page print issue during label printing
- Swagger OpenAPI export mismatch
- Select/dropdown dark-mode visual issues

### Changed

- UI tone made more corporate and SaaS-friendly
- Font system standardized around IBM Plex Sans / IBM Plex Mono
- SKU generation changed from sequential IDs to mixed random code format
- README rewritten for GitHub publication

## v2.0.0

- Enterprise frontend shell
- Responsive dashboard
- Dark/light mode
- TR/EN UI foundation
- Component, project, stock, low-stock, scanner and import pages

## v1.0.0

- Initial backend and frontend implementation
- Prisma schema
- MySQL support
- JWT authentication
- Component CRUD
- Stock movement system
- Basic dashboard