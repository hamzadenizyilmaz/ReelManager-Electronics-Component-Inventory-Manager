# ReelManager v2.1.0 Enterprise

This release prepares ReelManager for GitHub publication as a professional electronics component inventory platform.

## Key Improvements

- GitHub-ready repository structure
- Enterprise sidebar with repository link and version badges
- Robust frontend auth/session handling
- Protected route middleware
- Central API token interceptor
- Datasheet enrichment module
- Label printing studio
- Settings center
- TR/EN localized master data
- Dark/light UI polish
- CI/CD workflows
- Complete documentation package

## Upgrade Notes

1. Pull the latest files.
2. Update `.env` files from examples.
3. Run Prisma migration.
4. Run backend seed if needed.
5. Rebuild frontend.

```bash
cd backend
npm install
npm run prisma:migrate
npm run prisma:seed
npm run dev
```

```bash
cd frontend
npm install
npm run build
npm run dev
```
