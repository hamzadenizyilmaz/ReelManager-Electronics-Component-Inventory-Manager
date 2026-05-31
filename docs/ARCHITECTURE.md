# Architecture

ReelManager is a two-part full-stack application.

## Frontend

The frontend is built with Next.js App Router and JavaScript. It uses a SaaS-style application shell with protected routes, a central API client, responsive UI components and TR/EN language support.

Key layers:

- `app/`: routes and page-level screens
- `components/layout/`: sidebar, topbar and application shell
- `components/ui/`: reusable UI primitives
- `components/forms/`: reusable CRUD/resource forms
- `components/tables/`: table abstractions
- `components/labels/`: label printing studio
- `components/providers/`: theme, language and toast provider
- `lib/api.js`: central API client
- `lib/token.js`: token, cookie and session helpers
- `store/`: Zustand stores
- `middleware.js`: frontend route guard

## Backend

The backend is a modular Express.js API powered by Prisma and MySQL.

Key layers:

- `src/app.js`: Express application
- `src/server.js`: server bootstrap
- `src/config/`: environment and database config
- `src/middlewares/`: auth, role, validation and error handling
- `src/modules/`: business modules
- `src/utils/`: shared helpers
- `prisma/schema.prisma`: database schema
- `prisma/seed.js`: seed script

## Data Flow

1. User signs in through `/api/auth/login`.
2. Backend returns JWT and user object.
3. Frontend stores JWT in localStorage and SameSite cookie.
4. Frontend middleware protects route navigation.
5. Axios interceptor adds `Authorization: Bearer TOKEN` to API calls.
6. Backend auth middleware verifies JWT.
7. Authorized module route handles the request.
8. Standard API response is returned.

## Datasheet Enrichment Flow

1. User enters an MPN or supplier part number.
2. System checks local database.
3. System checks cache.
4. Provider chain runs: Nexar, DigiKey, Mouser.
5. Local parser fallback estimates key fields.
6. Normalized results are returned to frontend.
7. User selects a result and fills the component form.
8. Result is cached to avoid repeated provider calls.
