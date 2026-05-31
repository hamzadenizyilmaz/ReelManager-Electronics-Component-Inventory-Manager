# Development Guide

## Prerequisites

- Node.js 22+
- MySQL 8+
- npm

## Backend

```bash
cd backend
npm install
npm run prisma:migrate
npm run prisma:seed
npm run dev
```

## Frontend

```bash
cd frontend
npm install
npm run dev
```

## Useful Commands

Frontend build:

```bash
cd frontend
npm run build
```

Prisma validate:

```bash
cd backend
npx prisma validate
```

Generate Prisma client:

```bash
npx prisma generate
```

## Coding Standards

- JavaScript only
- Modular backend modules
- Centralized API client on frontend
- Reusable UI components
- No hardcoded secrets
- No direct API keys in frontend
- Dark mode support for new UI
- Responsive layout support for new pages
