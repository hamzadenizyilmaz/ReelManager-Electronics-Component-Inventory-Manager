# Contributing

Thank you for considering a contribution to ReelManager.

## Development Flow

1. Fork the repository.
2. Create a feature branch.
3. Keep frontend and backend changes separated where possible.
4. Run local checks before opening a pull request.
5. Open a pull request with a clear explanation.

## Branch Naming

```txt
feature/component-edit
fix/auth-token-storage
docs/api-reference
chore/ci-update
```

## Local Checks

Backend:

```bash
cd backend
npm install
npx prisma validate
node -c src/app.js
npm run dev
```

Frontend:

```bash
cd frontend
npm install
npm run build
```

## Pull Request Rules

- Explain what changed.
- Include screenshots for UI changes.
- Include database migration notes for Prisma changes.
- Do not commit `.env` files.
- Do not expose API keys.
