# SriGuide — Ubuntu VPS deployment

This project has a **Next.js** frontend (`sri-guide-client`) and an **ASP.NET Core 9** API (`SriGuide.API`) with **PostgreSQL**. TLS terminates at **Nginx**; the app processes listen on localhost only.

## Architecture

| Layer        | Role |
|-------------|------|
| Nginx       | HTTPS, reverse proxy to Next.js (`/`) and API (`/api`) |
| PM2         | Keeps the Next.js `next start` process alive (optional but recommended) |
| systemd     | Recommended for the .NET API (PM2 can run `dotnet` too; see below) |
| PostgreSQL  | Database |

The browser calls `NEXT_PUBLIC_API_URL` (for example `https://your-domain.com/api`), which must match how Nginx routes to Kestrel.

---

## 1. Server prerequisites (Ubuntu 22.04/24.04)

```bash
sudo apt update && sudo apt upgrade -y
sudo apt install -y curl git nginx ufw certbot python3-certbot-nginx
```

### Node.js 20+ (for Next.js)

```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
node -v
```

### .NET 9 runtime (ASP.NET)

Follow [Microsoft’s Linux install for .NET 9](https://learn.microsoft.com/dotnet/core/install/linux-ubuntu) (package feed + `aspnetcore-runtime-9.0` or SDK if you build on the server).

### PostgreSQL

```bash
sudo apt install -y postgresql postgresql-contrib
sudo -u postgres psql -c "CREATE USER sriguide WITH PASSWORD 'your_secure_password';"
sudo -u postgres psql -c "CREATE DATABASE sriguide_db OWNER sriguide;"
```

Adjust user, database name, and password to match your connection string.

### Firewall

```bash
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
sudo ufw enable
```

---

## 2. Deploy the API (.NET)

### Build (on dev machine or CI)

From `sri-guide-backend`:

```bash
dotnet publish SriGuide.API/SriGuide.API.csproj -c Release -o ./publish
```

Copy `publish/` to the server, for example `/var/www/sriguide/api/`.

### Configuration (never commit real secrets)

- Prefer **environment variables** (they override `appsettings.json`). Nested keys use double underscores:
  - `ConnectionStrings__DefaultConnection`
  - `JwtSettings__SecretKey`, `JwtSettings__Issuer`, `JwtSettings__Audience`
  - `BrevoSettings__ApiKey`, etc.
- Copy `SriGuide.API/appsettings.Production.json.example` to `appsettings.Production.json` on the server and fill placeholders, **or** set the same values via env vars.

### Run under systemd (recommended)

Create `/etc/systemd/system/sriguide-api.service`:

```ini
[Unit]
Description=SriGuide API
After=network.target postgresql.service

[Service]
WorkingDirectory=/var/www/sriguide/api
ExecStart=/usr/bin/dotnet /var/www/sriguide/api/SriGuide.API.dll
Restart=always
RestartSec=5
User=www-data
Environment=ASPNETCORE_ENVIRONMENT=Production
Environment=ASPNETCORE_URLS=http://127.0.0.1:5070
# Example — prefer a single connection string env var in production:
# Environment=ConnectionStrings__DefaultConnection=Host=127.0.0.1;Port=5432;Database=sriguide_db;Username=sriguide;Password=...

[Install]
WantedBy=multi-user.target
```

```bash
sudo systemctl daemon-reload
sudo systemctl enable --now sriguide-api
sudo systemctl status sriguide-api
```

### Run with PM2 (alternative)

After `dotnet publish`, from the publish folder:

```bash
pm2 start dotnet --name sriguide-api --interpreter none -- SriGuide.API.dll
# Or use ecosystem.config.cjs in this repo with the API block uncommented/adjusted.
pm2 save
pm2 startup
```

Set `ASPNETCORE_URLS=http://127.0.0.1:5070` and the same environment variables as systemd.

---

## 3. Deploy the frontend (Next.js)

On the server:

```bash
sudo mkdir -p /var/www/sriguide/client
# Upload repo or CI artifact; on server:
cd /var/www/sriguide/client/sri-guide-client   # adjust path to where package.json lives
```

### Environment file

1. Copy `.env.production.example` to `.env.production`.
2. Set `NEXT_PUBLIC_API_URL` to your public API base (must end with `/api` — see `src/services/api-client.ts`):

```env
NEXT_PUBLIC_API_URL=https://your-domain.com/api
```

3. Build and install production dependencies:

```bash
npm ci --omit=dev
npm run build
```

`package.production.json` in this folder only summarizes production-oriented scripts; **installs always use the main `package.json`**.

### PM2

Install PM2 globally: `sudo npm install -g pm2`.

Copy `ecosystem.config.cjs` next to `package.json`, edit `cwd` if needed, then:

```bash
pm2 start ecosystem.config.cjs
pm2 save
pm2 startup
```

This runs `npm run start:production` (Next on `127.0.0.1:3020`).

---

## 4. Nginx

1. Copy `deploy/nginx-sriguide.conf` to `/etc/nginx/sites-available/sriguide`.
2. Replace `your-domain.com` and certificate paths.
3. Enable the site:

```bash
sudo ln -s /etc/nginx/sites-available/sriguide /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx
```

### TLS (Let’s Encrypt)

```bash
sudo certbot --nginx -d your-domain.com
```

Certbot will adjust server blocks; ensure `proxy_pass` targets remain `127.0.0.1:3020` (Next) and `127.0.0.1:5070` (API).

Important headers for the API block are already in the sample config (`X-Forwarded-*`), which works with the API’s forwarded-headers middleware.

---

## 5. Smoke tests

```bash
curl -sS http://127.0.0.1:5070/api/health   # if you add a health endpoint; otherwise hit a known GET
curl -sS -I http://127.0.0.1:3020
curl -sS -I https://your-domain.com
```

---

## 6. Updates

**API:** replace published files, `sudo systemctl restart sriguide-api` (or `pm2 restart sriguide-api`).

**Frontend:** `git pull` (or upload), `npm ci --omit=dev`, `npm run build`, `pm2 restart sri-guide-web`.

---

## Troubleshooting

| Issue | What to check |
|--------|----------------|
| 502 from Nginx | `systemctl status sriguide-api`, `pm2 status`, ports 3020 / 5070 listening on `127.0.0.1` |
| API redirects or wrong scheme | Forwarded headers + Nginx `X-Forwarded-Proto`; API runs HTTP behind Nginx |
| CORS | API already allows any origin; if you lock it down later, allow your site origin |
| DB errors | Connection string, PostgreSQL `pg_hba.conf`, firewall to DB |
