# Deployment

## Recommended Production Setup

- Frontend: Vercel, Netlify, Coolify, Docker or Node server
- Backend: VPS, Docker, PM2 or systemd
- Database: MySQL 8+
- Reverse proxy: Nginx or Caddy
- TLS: Let's Encrypt

## Backend Production

```bash
cd backend
npm install --omit=dev
npx prisma generate
npm start
```

Example PM2:

```bash
pm2 start src/server.js --name reelmanager-api
pm2 save
```

## Frontend Production

```bash
cd frontend
npm install
npm run build
npm run start
```

## Environment Checklist

Backend:

- `DATABASE_URL`
- `JWT_SECRET`
- `JWT_EXPIRES_IN`
- `PORT`
- `FRONTEND_URL`
- Datasheet provider API keys if used

Frontend:

- `NEXT_PUBLIC_API_URL`
- `NEXT_PUBLIC_APP_NAME`

## Nginx Example

```nginx
server {
  server_name reelmanager.example.com;

  location / {
    proxy_pass http://127.0.0.1:3000;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
  }

  location /api/ {
    proxy_pass http://127.0.0.1:4000/api/;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
  }
}
```
