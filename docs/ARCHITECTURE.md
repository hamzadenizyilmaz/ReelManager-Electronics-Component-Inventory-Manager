# Architecture

## Overview

ReelManager is a full-stack web application designed for managing electronic component inventory. The system is separated into a backend API, a frontend dashboard and a MySQL database managed through Prisma ORM.

The platform focuses on practical engineering workflows:

- Component registration
- Stock tracking
- Project/BOM management
- Datasheet enrichment
- Label printing
- Purchase link generation
- Activity logging
- Backup and update management

## High-Level Architecture

```txt
User Browser
   |
   | HTTPS
   v
Nginx Reverse Proxy
   |
   | / frontend
   v
Next.js Frontend
   |
   | /api requests with JWT
   v
Node.js Express Backend
   |
   | Prisma Client
   v
MySQL / MariaDB Database
```

## Frontend

The frontend is built with Next.js 15 and Tailwind CSS. It provides a responsive, dark-mode-ready enterprise dashboard.

Main responsibilities:

- Authentication UI
- Protected route handling
- Dashboard charts and summary cards
- Component CRUD screens
- Project and BOM screens
- Settings center
- Activity logs
- Updates page
- Backup/restore UI
- Label printing UI

Important folders:

```txt
frontend/app/
frontend/components/
frontend/lib/
frontend/store/
frontend/public/
```

## Backend

The backend is built with Express.js and Prisma.

Main responsibilities:

- REST API
- Authentication and JWT validation
- Component CRUD
- Stock movement logic
- BOM/project operations
- Datasheet enrichment provider chain
- Export/import handlers
- Backup and update services
- Detailed audit logging

Important folders:

```txt
backend/src/modules/
backend/src/middlewares/
backend/src/utils/
backend/prisma/
backend/docs/
```

## Database

The database is MySQL or MariaDB. Prisma manages schema definitions and migrations.

Core data groups:

- Users
- Components
- Categories
- Suppliers
- Locations
- Stock movements
- Projects
- BOM items
- Enrichment cache
- System settings
- Activity logs

## Authentication Flow

1. User enters email and password.
2. Frontend calls `POST /api/auth/login`.
3. Backend validates credentials.
4. Backend returns JWT token.
5. Frontend stores token.
6. API requests include `Authorization: Bearer <token>`.
7. Backend validates JWT in protected routes.

## Datasheet Enrichment Flow

Provider order:

1. Local database
2. Nexar / Octopart
3. DigiKey
4. Mouser
5. Local parser fallback
6. Manual datasheet URL

The backend normalizes all provider responses into one frontend-safe format.

## Update Flow

1. User opens `/updates`.
2. Backend checks GitHub release information.
3. If versions match, update is blocked.
4. If newer version exists and updates are allowed, backup starts.
5. Project files and SQL database are backed up.
6. Update command executes only when `ALLOW_SYSTEM_UPDATE=true`.

## Backup Flow

Supported export formats:

- JSON
- SQL

Backup can be downloaded locally or prepared for remote transfer through FTP/SFTP configuration.

## Security Boundaries

Frontend route protection improves user experience but is not the only security layer. Backend authentication and authorization must remain mandatory for protected operations.

Critical pages such as settings, backup, updates and users should be restricted to administrator roles.
