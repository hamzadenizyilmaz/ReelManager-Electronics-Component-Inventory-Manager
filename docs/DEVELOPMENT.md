# Development Guide

## Local Development Requirements

- Node.js 22 LTS recommended
- MySQL or MariaDB
- Git
- npm

## Project Structure

```txt
backend/
  src/
  prisma/
frontend/
  app/
  components/
  lib/
  store/
docs/
.github/
```

## Backend Development

```bash
cd backend
npm install
npm run prisma:migrate
npm run prisma:seed
npm run dev
```

Backend runs on:

```txt
http://localhost:4000
```

## Frontend Development

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on:

```txt
http://localhost:3000
```

## Code Style

- Use CommonJS in backend unless project is migrated to ESM.
- Keep backend modules separated by domain.
- Use central API helpers in frontend.
- Do not pass function objects from Server Components to Client Components.
- Avoid hardcoded text when language setting is needed.
- Keep UI descriptions short and relevant to the page.

## API Layer

Frontend API requests should use:

```txt
frontend/lib/api.js
```

Do not call protected endpoints without token handling.

## Protected Pages

Use authenticated API calls and redirect unauthorized users to `/login`.

## Build Check

```bash
cd frontend
npm run build
```

## Backend Syntax Check

```bash
find backend/src -name "*.js" -print0 | xargs -0 -n1 node -c
```

## Prisma Check

```bash
cd backend
npx prisma validate
```

## Branching Recommendation

```txt
main       stable release
feature/* new features
fix/*     bug fixes
release/* release preparation
```
