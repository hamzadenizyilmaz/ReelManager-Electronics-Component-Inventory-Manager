# Contributing

Thank you for considering a contribution to ReelManager.

## Development Flow

1. Fork the repository.
2. Create a feature branch.
3. Make your changes.
4. Run frontend and backend checks.
5. Open a pull request with a clear explanation.

## Branch Naming

Use clear branch names:

```text
feature/component-enrichment
fix/login-token-guard
ui/settings-center
security/auth-hardening
```

## Commit Style

Recommended format:

```text
feat: add datasheet enrichment cache
fix: persist auth token for dashboard requests
docs: improve deployment guide
security: harden route protection
```

## Frontend Checks

```bash
cd frontend
npm install
npm run build
```

## Backend Checks

```bash
cd backend
npm install
npx prisma validate
node -c src/app.js
node -c src/server.js
```

## Pull Request Checklist

- [ ] The change has a clear purpose.
- [ ] The UI works in dark and light mode.
- [ ] The UI works on mobile, tablet and desktop.
- [ ] API calls use the centralized API client.
- [ ] Protected pages require authentication.
- [ ] Sensitive values are not committed.
- [ ] Documentation was updated if needed.
