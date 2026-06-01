# Migration Guide: v2.1.0 Enterprise to v2.2.0 Enterprise

## Before You Start

Create a backup of:

- Project files
- MySQL database
- `.env` files
- Uploaded assets if any

## Step 1 - Pull or Replace Files

```bash
git pull origin main
```

or replace with the v2.2.0 package.

## Step 2 - Backend Dependencies

```bash
cd backend
npm install
```

## Step 3 - Prisma Validation

```bash
npx prisma validate
```

## Step 4 - Migration

```bash
npm run prisma:migrate
```

## Step 5 - Seed

```bash
npm run prisma:seed
```

## Step 6 - Restart Backend

```bash
npm run dev
```

Production:

```bash
pm2 restart reelmanager-api
```

## Step 7 - Frontend Dependencies

```bash
cd ../frontend
npm install
```

## Step 8 - Clear Cache

```powershell
Remove-Item -Recurse -Force .next -ErrorAction SilentlyContinue
```

Linux:

```bash
rm -rf .next
```

## Step 9 - Build

```bash
npm run build
```

## Step 10 - Start Frontend

```bash
npm run dev
```

Production:

```bash
pm2 restart reelmanager-web
```

## Verify

- Dashboard labels
- Updates page
- Backup SQL export
- Activity log detail page
- Footer size
- Language setting
