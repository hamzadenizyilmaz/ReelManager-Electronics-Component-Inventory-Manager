# Deployment Guide

## Overview

This guide explains how to deploy ReelManager in production using:

- Node.js
- MySQL/MariaDB
- PM2
- Nginx
- SSL/TLS

## Recommended Production Layout

```txt
/var/www/reelmanager/
  backend/
  frontend/
  docs/
  backups/
```

## Backend Production Commands

```bash
cd /var/www/reelmanager/backend
npm install --omit=dev
npx prisma generate
npx prisma migrate deploy
pm2 start src/server.js --name reelmanager-api
```

## Frontend Production Commands

```bash
cd /var/www/reelmanager/frontend
npm install
npm run build
pm2 start npm --name reelmanager-web -- start
```

## Environment Variables

Backend `.env`:

```env
NODE_ENV=production
PORT=4000
DATABASE_URL="mysql://user:password@localhost:3306/reelmanager"
JWT_SECRET="change-this-secret"
FRONTEND_URL="https://example.com"
APP_VERSION="v2.2.0"
ALLOW_SYSTEM_UPDATE=false
```

Frontend `.env`:

```env
NEXT_PUBLIC_API_URL="https://example.com/api"
NEXT_PUBLIC_APP_NAME="ReelManager"
```

## Nginx Configuration

```nginx
server {
    listen 80;
    server_name example.com www.example.com;

    location /api/ {
        proxy_pass http://127.0.0.1:4000/api/;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

## SSL

```bash
sudo certbot --nginx -d example.com -d www.example.com
```

## PM2 Commands

```bash
pm2 list
pm2 logs reelmanager-api
pm2 logs reelmanager-web
pm2 restart reelmanager-api
pm2 restart reelmanager-web
pm2 save
```

## Health Check

```bash
curl https://example.com/api/health
```

## Deployment Checklist

- [ ] Backend `.env` configured
- [ ] Frontend `.env` configured
- [ ] Database migration completed
- [ ] Seed completed
- [ ] PM2 processes running
- [ ] Nginx proxy configured
- [ ] SSL installed
- [ ] Firewall configured
- [ ] Backup tested
