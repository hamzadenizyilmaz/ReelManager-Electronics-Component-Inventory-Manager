# ReelManager v2.2.0 Enterprise - Installation Guide

This document explains how to install **ReelManager - Electronics Component Inventory Manager** on a Linux server for production or staging use.

Bu doküman **ReelManager - Electronics Component Inventory Manager** projesinin Linux sunucu üzerinde production veya staging ortamı için nasıl kurulacağını açıklar.

---

# Table of Contents

- [English Installation Guide](#english-installation-guide)
- [Türkçe Kurulum Rehberi](#türkçe-kurulum-rehberi)
- [Supported Linux Distributions](#supported-linux-distributions)
- [Recommended Production Stack](#recommended-production-stack)
- [Environment Variables](#environment-variables)
- [Database Setup](#database-setup)
- [Backend Deployment](#backend-deployment)
- [Frontend Deployment](#frontend-deployment)
- [Nginx Reverse Proxy](#nginx-reverse-proxy)
- [SSL / HTTPS](#ssl--https)
- [PM2 Process Management](#pm2-process-management)
- [Backup and Update Notes](#backup-and-update-notes)
- [Troubleshooting](#troubleshooting)

---

# Supported Linux Distributions

ReelManager can run on most modern Linux distributions that support Node.js, MySQL/MariaDB, Nginx and systemd.

Recommended server operating systems:

| Distribution | Recommended Version | Notes |
|---|---:|---|
| Ubuntu Server | 22.04 LTS / 24.04 LTS | Recommended for most deployments |
| Debian | 12 Bookworm | Stable production option |
| AlmaLinux | 9.x | Recommended RHEL-compatible option |
| Rocky Linux | 9.x | RHEL-compatible alternative |
| Oracle Linux | 9.x | Enterprise-compatible option |
| CentOS Stream | 9 | Usable, but not the first recommendation for production |

Minimum server recommendation:

| Resource | Minimum | Recommended |
|---|---:|---:|
| CPU | 1 vCPU | 2+ vCPU |
| RAM | 1 GB | 2-4 GB |
| Disk | 10 GB | 30+ GB SSD |
| Database | MySQL 8 / MariaDB 10.6+ | MySQL 8 recommended |
| Node.js | 20 LTS or 22 LTS | 22 LTS recommended |

---

# Recommended Production Stack

ReelManager production deployment uses:

- Linux server
- Node.js 20/22 LTS
- MySQL 8 or MariaDB 10.6+
- Prisma ORM
- Backend: Node.js + Express
- Frontend: Next.js 15
- Nginx reverse proxy
- PM2 process manager
- Certbot / Let’s Encrypt SSL
- GitHub Actions for CI/CD

Recommended ports:

| Service | Port |
|---|---:|
| Backend API | 4000 |
| Frontend Next.js | 3000 |
| Nginx HTTP | 80 |
| Nginx HTTPS | 443 |
| MySQL | 3306 |

---

# English Installation Guide

## 1. Update the server

### Ubuntu / Debian

```bash
sudo apt update && sudo apt upgrade -y
sudo apt install -y curl wget git unzip ca-certificates build-essential
```

### AlmaLinux / Rocky Linux / Oracle Linux

```bash
sudo dnf update -y
sudo dnf install -y curl wget git unzip ca-certificates gcc gcc-c++ make
```

---

## 2. Install Node.js LTS

Recommended: Node.js 22 LTS.

### Ubuntu / Debian

```bash
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt install -y nodejs
node -v
npm -v
```

### AlmaLinux / Rocky Linux / Oracle Linux

```bash
curl -fsSL https://rpm.nodesource.com/setup_22.x | sudo bash -
sudo dnf install -y nodejs
node -v
npm -v
```

---

## 3. Install MySQL or MariaDB

### Ubuntu / Debian - MySQL

```bash
sudo apt install -y mysql-server
sudo systemctl enable mysql
sudo systemctl start mysql
sudo mysql_secure_installation
```

### AlmaLinux / Rocky Linux - MariaDB

```bash
sudo dnf install -y mariadb-server mariadb
sudo systemctl enable mariadb
sudo systemctl start mariadb
sudo mysql_secure_installation
```

---

## 4. Create database and user

Login to MySQL/MariaDB:

```bash
sudo mysql -u root -p
```

Run:

```sql
CREATE DATABASE reelmanager CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'reelmanager'@'localhost' IDENTIFIED BY 'CHANGE_STRONG_PASSWORD_HERE';
GRANT ALL PRIVILEGES ON reelmanager.* TO 'reelmanager'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

For remote database access, create the user carefully and restrict the allowed host/IP.

---

## 5. Clone the repository

```bash
cd /var/www
sudo git clone https://github.com/hamzadenizyilmaz/ReelManager-Electronics-Component-Inventory-Manager.git reelmanager
sudo chown -R $USER:$USER /var/www/reelmanager
cd /var/www/reelmanager
```

---

## 6. Backend configuration

```bash
cd /var/www/reelmanager/backend
cp .env.example .env
nano .env
```

Example backend `.env`:

```env
NODE_ENV="production"
PORT=4000
FRONTEND_URL="https://your-domain.com"
DATABASE_URL="mysql://reelmanager:CHANGE_STRONG_PASSWORD_HERE@localhost:3306/reelmanager"
JWT_SECRET="CHANGE_THIS_TO_A_LONG_RANDOM_SECRET"
JWT_EXPIRES_IN="7d"
APP_VERSION="v2.2.0-Enterprise"
ALLOW_SYSTEM_UPDATE=true
GITHUB_REPOSITORY="hamzadenizyilmaz/ReelManager-Electronics-Component-Inventory-Manager"

NEXAR_CLIENT_ID=""
NEXAR_CLIENT_SECRET=""
DIGIKEY_CLIENT_ID=""
DIGIKEY_CLIENT_SECRET=""
DIGIKEY_REDIRECT_URI=""
MOUSER_API_KEY=""
DATASHEET_PROVIDER_TIMEOUT_MS="8000"
DATASHEET_CACHE_TTL_DAYS="30"
```

Generate a strong JWT secret:

```bash
openssl rand -hex 64
```

Install backend dependencies:

```bash
npm install
npx prisma validate
npx prisma generate
npm run prisma:migrate
npm run prisma:seed
```

Test backend:

```bash
npm run dev
```

Open:

```txt
http://SERVER_IP:4000/api/health
http://SERVER_IP:4000/api/docs
```

---

## 7. Frontend configuration

```bash
cd /var/www/reelmanager/frontend
cp .env.example .env
nano .env
```

Example frontend `.env`:

```env
NEXT_PUBLIC_API_URL="https://your-domain.com/api"
NEXT_PUBLIC_APP_NAME="ReelManager"
```

Install and build:

```bash
npm install
npm run build
```

Test frontend:

```bash
npm run start
```

Open:

```txt
http://SERVER_IP:3000
```

---

## 8. Install PM2

```bash
sudo npm install -g pm2
```

Create backend PM2 process:

```bash
cd /var/www/reelmanager/backend
pm2 start src/server.js --name reelmanager-api
```

Create frontend PM2 process:

```bash
cd /var/www/reelmanager/frontend
pm2 start npm --name reelmanager-web -- start
```

Save PM2 startup:

```bash
pm2 save
pm2 startup
```

Run the command printed by `pm2 startup`.

Check status:

```bash
pm2 status
pm2 logs reelmanager-api
pm2 logs reelmanager-web
```

---

## 9. Install and configure Nginx

### Ubuntu / Debian

```bash
sudo apt install -y nginx
sudo systemctl enable nginx
sudo systemctl start nginx
```

### AlmaLinux / Rocky Linux

```bash
sudo dnf install -y nginx
sudo systemctl enable nginx
sudo systemctl start nginx
```

Create Nginx site config:

```bash
sudo nano /etc/nginx/conf.d/reelmanager.conf
```

Paste:

```nginx
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;

    client_max_body_size 50M;

    location /api/ {
        proxy_pass http://127.0.0.1:4000/api/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    location /api/docs {
        proxy_pass http://127.0.0.1:4000/api/docs;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Test and reload:

```bash
sudo nginx -t
sudo systemctl reload nginx
```

---

## 10. Configure SSL with Certbot

### Ubuntu / Debian

```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com -d www.your-domain.com
```

### AlmaLinux / Rocky Linux

```bash
sudo dnf install -y epel-release
sudo dnf install -y certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com -d www.your-domain.com
```

Test auto renewal:

```bash
sudo certbot renew --dry-run
```

---

## 11. Firewall

### Ubuntu / Debian with UFW

```bash
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
sudo ufw enable
sudo ufw status
```

### AlmaLinux / Rocky Linux with firewalld

```bash
sudo firewall-cmd --permanent --add-service=http
sudo firewall-cmd --permanent --add-service=https
sudo firewall-cmd --permanent --add-service=ssh
sudo firewall-cmd --reload
sudo firewall-cmd --list-all
```

---

## 12. Default login

If you used the seed command, default admin credentials are:

```txt
Email: admin@example.com
Password: Admin123!
```

Change this password immediately after first login.

---

# Türkçe Kurulum Rehberi

## 1. Sunucuyu güncelleyin

### Ubuntu / Debian

```bash
sudo apt update && sudo apt upgrade -y
sudo apt install -y curl wget git unzip ca-certificates build-essential
```

### AlmaLinux / Rocky Linux / Oracle Linux

```bash
sudo dnf update -y
sudo dnf install -y curl wget git unzip ca-certificates gcc gcc-c++ make
```

---

## 2. Node.js LTS kurun

Önerilen sürüm: Node.js 22 LTS.

### Ubuntu / Debian

```bash
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt install -y nodejs
node -v
npm -v
```

### AlmaLinux / Rocky Linux / Oracle Linux

```bash
curl -fsSL https://rpm.nodesource.com/setup_22.x | sudo bash -
sudo dnf install -y nodejs
node -v
npm -v
```

---

## 3. MySQL veya MariaDB kurun

### Ubuntu / Debian - MySQL

```bash
sudo apt install -y mysql-server
sudo systemctl enable mysql
sudo systemctl start mysql
sudo mysql_secure_installation
```

### AlmaLinux / Rocky Linux - MariaDB

```bash
sudo dnf install -y mariadb-server mariadb
sudo systemctl enable mariadb
sudo systemctl start mariadb
sudo mysql_secure_installation
```

---

## 4. Veritabanı ve kullanıcı oluşturun

MySQL/MariaDB içine girin:

```bash
sudo mysql -u root -p
```

Komutları çalıştırın:

```sql
CREATE DATABASE reelmanager CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'reelmanager'@'localhost' IDENTIFIED BY 'BURAYA_GUCLU_SIFRE_YAZIN';
GRANT ALL PRIVILEGES ON reelmanager.* TO 'reelmanager'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

Uzak veritabanı kullanacaksanız kullanıcı yetkisini IP bazlı kısıtlamanız önerilir.

---

## 5. Projeyi sunucuya çekin

```bash
cd /var/www
sudo git clone https://github.com/hamzadenizyilmaz/ReelManager-Electronics-Component-Inventory-Manager.git reelmanager
sudo chown -R $USER:$USER /var/www/reelmanager
cd /var/www/reelmanager
```

---

## 6. Backend ayarları

```bash
cd /var/www/reelmanager/backend
cp .env.example .env
nano .env
```

Örnek backend `.env`:

```env
NODE_ENV="production"
PORT=4000
FRONTEND_URL="https://alan-adiniz.com"
DATABASE_URL="mysql://reelmanager:BURAYA_GUCLU_SIFRE_YAZIN@localhost:3306/reelmanager"
JWT_SECRET="BURAYA_UZUN_RASTGELE_SECRET_YAZIN"
JWT_EXPIRES_IN="7d"
APP_VERSION="v2.2.0-Enterprise"
ALLOW_SYSTEM_UPDATE=false
GITHUB_REPOSITORY="hamzadenizyilmaz/ReelManager-Electronics-Component-Inventory-Manager"

NEXAR_CLIENT_ID=""
NEXAR_CLIENT_SECRET=""
DIGIKEY_CLIENT_ID=""
DIGIKEY_CLIENT_SECRET=""
DIGIKEY_REDIRECT_URI=""
MOUSER_API_KEY=""
DATASHEET_PROVIDER_TIMEOUT_MS="8000"
DATASHEET_CACHE_TTL_DAYS="30"
```

Güçlü JWT secret üretmek için:

```bash
openssl rand -hex 64
```

Backend paketlerini kurun:

```bash
npm install
npx prisma validate
npx prisma generate
npm run prisma:migrate
npm run prisma:seed
```

Backend test:

```bash
npm run dev
```

Kontrol adresleri:

```txt
http://SUNUCU_IP:4000/api/health
http://SUNUCU_IP:4000/api/docs
```

---

## 7. Frontend ayarları

```bash
cd /var/www/reelmanager/frontend
cp .env.example .env
nano .env
```

Örnek frontend `.env`:

```env
NEXT_PUBLIC_API_URL="https://alan-adiniz.com/api"
NEXT_PUBLIC_APP_NAME="ReelManager"
```

Kurulum ve build:

```bash
npm install
npm run build
```

Frontend test:

```bash
npm run start
```

Kontrol adresi:

```txt
http://SUNUCU_IP:3000
```

---

## 8. PM2 ile servisleri çalıştırın

```bash
sudo npm install -g pm2
```

Backend:

```bash
cd /var/www/reelmanager/backend
pm2 start src/server.js --name reelmanager-api
```

Frontend:

```bash
cd /var/www/reelmanager/frontend
pm2 start npm --name reelmanager-web -- start
```

PM2 otomatik başlatma:

```bash
pm2 save
pm2 startup
```

`pm2 startup` çıktısındaki komutu ayrıca çalıştırın.

Kontrol:

```bash
pm2 status
pm2 logs reelmanager-api
pm2 logs reelmanager-web
```

---

## 9. Nginx kurulumu

### Ubuntu / Debian

```bash
sudo apt install -y nginx
sudo systemctl enable nginx
sudo systemctl start nginx
```

### AlmaLinux / Rocky Linux

```bash
sudo dnf install -y nginx
sudo systemctl enable nginx
sudo systemctl start nginx
```

Nginx config oluşturun:

```bash
sudo nano /etc/nginx/conf.d/reelmanager.conf
```

İçeriği yapıştırın:

```nginx
server {
    listen 80;
    server_name alan-adiniz.com www.alan-adiniz.com;

    client_max_body_size 50M;

    location /api/ {
        proxy_pass http://127.0.0.1:4000/api/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    location /api/docs {
        proxy_pass http://127.0.0.1:4000/api/docs;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Test ve reload:

```bash
sudo nginx -t
sudo systemctl reload nginx
```

---

## 10. SSL kurulumu

### Ubuntu / Debian

```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d alan-adiniz.com -d www.alan-adiniz.com
```

### AlmaLinux / Rocky Linux

```bash
sudo dnf install -y epel-release
sudo dnf install -y certbot python3-certbot-nginx
sudo certbot --nginx -d alan-adiniz.com -d www.alan-adiniz.com
```

SSL yenileme testi:

```bash
sudo certbot renew --dry-run
```

---

## 11. Firewall ayarları

### Ubuntu / Debian - UFW

```bash
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
sudo ufw enable
sudo ufw status
```

### AlmaLinux / Rocky Linux - firewalld

```bash
sudo firewall-cmd --permanent --add-service=http
sudo firewall-cmd --permanent --add-service=https
sudo firewall-cmd --permanent --add-service=ssh
sudo firewall-cmd --reload
sudo firewall-cmd --list-all
```

---

## 12. Varsayılan giriş bilgileri

Seed çalıştırdıysanız varsayılan admin bilgisi:

```txt
Email: admin@example.com
Password: Admin123!
```

İlk girişten sonra bu şifreyi mutlaka değiştirin.

---

# Environment Variables

## Backend `.env`

```env
NODE_ENV="production"
PORT=4000
FRONTEND_URL="https://your-domain.com"
DATABASE_URL="mysql://reelmanager:password@localhost:3306/reelmanager"
JWT_SECRET="change_this_to_a_long_random_secret"
JWT_EXPIRES_IN="7d"
APP_VERSION="v2.2.0-Enterprise"
ALLOW_SYSTEM_UPDATE=true
GITHUB_REPOSITORY="hamzadenizyilmaz/ReelManager-Electronics-Component-Inventory-Manager"

NEXAR_CLIENT_ID=""
NEXAR_CLIENT_SECRET=""
DIGIKEY_CLIENT_ID=""
DIGIKEY_CLIENT_SECRET=""
DIGIKEY_REDIRECT_URI=""
MOUSER_API_KEY=""
DATASHEET_PROVIDER_TIMEOUT_MS="8000"
DATASHEET_CACHE_TTL_DAYS="30"
```

## Frontend `.env`

```env
NEXT_PUBLIC_API_URL="https://your-domain.com/api"
NEXT_PUBLIC_APP_NAME="ReelManager"
```

---

# Backup and Update Notes

ReelManager v2.2.0 Enterprise includes update and backup features.

Recommended production behavior:

- Keep `ALLOW_SYSTEM_UPDATE=false` unless you explicitly want the panel to run update operations.
- Always create a manual database backup before production updates.
- Use SQL export for database-level recovery.
- Store remote backup credentials securely.
- Do not expose API secrets in frontend variables.

Manual SQL backup:

```bash
mysqldump -u reelmanager -p reelmanager > reelmanager-backup.sql
```

Manual SQL restore:

```bash
mysql -u reelmanager -p reelmanager < reelmanager-backup.sql
```

---

# Troubleshooting

## Prisma TLS / SSL MySQL error

If your remote MySQL server requires secure transport, use SSL parameters in `DATABASE_URL`.

Example:

```env
DATABASE_URL="mysql://user:password@host:3306/database?sslaccept=accept_invalid_certs"
```

For production, prefer proper CA certificate configuration instead of accepting invalid certificates.

---

## Backend returns 401 after login

Check that frontend sends:

```txt
Authorization: Bearer TOKEN
```

Also verify:

- `JWT_SECRET` is the same for login and auth middleware.
- Frontend `NEXT_PUBLIC_API_URL` points to the correct backend.
- Browser localStorage/cookies are not stale.

---

## Nginx 502 Bad Gateway

Check PM2 services:

```bash
pm2 status
pm2 logs reelmanager-api
pm2 logs reelmanager-web
```

Check ports:

```bash
ss -tulpn | grep -E '3000|4000'
```

Restart:

```bash
pm2 restart reelmanager-api
pm2 restart reelmanager-web
sudo systemctl reload nginx
```

---

## Frontend build fails

Clean build cache:

```bash
cd frontend
rm -rf .next
npm install
npm run build
```

---

## Database migration fails

Validate schema:

```bash
cd backend
npx prisma validate
npx prisma generate
```

Then retry:

```bash
npm run prisma:migrate
```

---

# Production Checklist

Before going live:

- [ ] Domain DNS points to server
- [ ] Nginx is configured
- [ ] SSL certificate installed
- [ ] Backend is running with PM2
- [ ] Frontend is running with PM2
- [ ] MySQL database is created
- [ ] Prisma migration completed
- [ ] Seed completed
- [ ] Default admin password changed
- [ ] Firewall enabled
- [ ] Backup tested
- [ ] SQL export tested
- [ ] `/api/health` works
- [ ] `/api/docs` works
- [ ] Login works
- [ ] Dashboard loads
- [ ] Activity logs work

---

# Repository

```txt
https://github.com/hamzadenizyilmaz/ReelManager-Electronics-Component-Inventory-Manager
```

