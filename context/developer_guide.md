# SriGuide.lk — Developer Guide

## Prerequisites

| Tool | Version | Install |
|:---|:---|:---|
| Node.js | 18+ | [nodejs.org](https://nodejs.org) |
| .NET SDK | 8.0+ | [dot.net](https://dot.net/download) |
| PostgreSQL | 15+ | [postgresql.org](https://www.postgresql.org/download/) |
| Git | Latest | [git-scm.com](https://git-scm.com) |

---

## Project Structure

```
Sri-Guide/
├── context/                    # Documentation & plans
│   ├── context.md              # Product requirements
│   ├── plan.md                 # UX/UI plan
│   ├── implementation_plan.md  # Full technical roadmap
│   ├── task.md                 # Development task checklist
│   └── developer_guide.md     # This file
├── sri-guide-client/           # Next.js frontend
│   ├── app/                    # App Router pages
│   ├── components/             # Reusable components
│   ├── lib/                    # API client, utilities
│   ├── data/                   # Mock data
│   └── public/                 # Static assets
└── sri-guide-backend/          # .NET ASP.NET Core API
    ├── SriGuide.Domain/        # Entities, Enums
    ├── SriGuide.Application/   # DTOs, Handlers, Validators
    ├── SriGuide.Infrastructure/ # EF Core, Repos, Services
    └── SriGuide.API/           # Controllers, Middleware
```

---

## Database Setup

### 1. Create Database

```sql
-- Connect to PostgreSQL (psql or pgAdmin)
CREATE DATABASE sriguide_db;

-- Enable UUID extension
\c sriguide_db
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
```

### 2. Connection String

```
Host=localhost;Port=5432;Database=sriguide_db;Username=postgres;Password=admin
```

This goes in `sri-guide-backend/SriGuide.API/appsettings.json`:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Host=localhost;Port=5432;Database=sriguide_db;Username=postgres;Password=admin"
  }
}
```

### 3. Apply Migrations

```bash
# Navigate to the API project (which references Infrastructure)
cd sri-guide-backend/SriGuide.API

# Add a new migration
dotnet ef migrations add MigrationName --project ../SriGuide.Infrastructure

# Apply all pending migrations
dotnet ef database update --project ../SriGuide.Infrastructure

# Remove last migration (if not applied)
dotnet ef migrations remove --project ../SriGuide.Infrastructure

# Generate SQL script (for production)
dotnet ef migrations script --project ../SriGuide.Infrastructure -o migrations.sql
```

> **Note**: You need `dotnet-ef` tool installed:
> ```bash
> dotnet tool install --global dotnet-ef
> ```

---

## Running the Backend (.NET API)

```bash
cd sri-guide-backend/SriGuide.API

# Restore packages
dotnet restore

# Run in development mode (with hot reload)
dotnet watch run

# Or run without hot reload
dotnet run 

dotnet run --project SriGuide.API/SriGuide.API.csproj
```

The API will start at: `https://localhost:5001` / `http://localhost:5000`

### Useful Commands

```bash
# Build the project
dotnet build

# Run tests
dotnet test

# Publish for production (VPS deployment)
dotnet publish -c Release -o ./publish --self-contained -r linux-x64
```

---

## Running the Frontend (Next.js)

```bash
cd sri-guide-client

# Install dependencies
npm install

# Run in development mode
npm run dev
```

The frontend will start at: `http://localhost:3000`

### Useful Commands

```bash
# Build for production
npm run build

# Start production server
npm start

# Lint check
npm run lint
```

---

## Environment Variables

### Backend (`appsettings.Development.json`)

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Host=localhost;Port=5432;Database=sriguide_db;Username=postgres;Password=admin"
  },
  "JwtSettings": {
    "SecretKey": "your-super-secret-key-at-least-32-characters-long",
    "Issuer": "SriGuide",
    "Audience": "SriGuideApp",
    "AccessTokenExpiryMinutes": 15,
    "RefreshTokenExpiryDays": 7
  },
  "ImageStorage": {
    "BasePath": "./uploads",
    "MaxFileSizeMB": 5,
    "AllowedExtensions": [".jpg", ".jpeg", ".png", ".webp"]
  }
}
```

### Frontend (`.env.local`)

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

---

## VPS Deployment

### 1. Server Setup (Ubuntu 22.04)

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install .NET runtime
sudo apt install -y dotnet-runtime-8.0

# Install Node.js 18+
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install PostgreSQL
sudo apt install -y postgresql postgresql-contrib

# Install Nginx
sudo apt install -y nginx

# Install PM2 (for running Next.js)
sudo npm install -g pm2

# Install Certbot (for SSL)
sudo apt install -y certbot python3-certbot-nginx
```

### 2. Deploy Backend

```bash
# Copy published files to VPS
scp -r ./publish user@your-vps:/var/www/sriguide/api/

# Create systemd service
sudo nano /etc/systemd/system/sriguide-api.service
```

```ini
[Unit]
Description=SriGuide .NET API
After=network.target

[Service]
WorkingDirectory=/var/www/sriguide/api
ExecStart=/var/www/sriguide/api/SriGuide.API
Restart=always
RestartSec=10
Environment=ASPNETCORE_ENVIRONMENT=Production
Environment=ASPNETCORE_URLS=http://localhost:5000

[Install]
WantedBy=multi-user.target
```

```bash
sudo systemctl enable sriguide-api
sudo systemctl start sriguide-api
```

### 3. Deploy Frontend

```bash
cd /var/www/sriguide/client
npm install && npm run build
pm2 start npm --name "sriguide-web" -- start
pm2 save
pm2 startup
```

### 4. Nginx Configuration

```nginx
server {
    server_name sriguide.lk www.sriguide.lk;

    # Next.js frontend
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # .NET API
    location /api/ {
        proxy_pass http://localhost:5000/api/;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }

    # Static image uploads (served directly by Nginx)
    location /uploads/ {
        alias /var/www/sriguide/uploads/;
        expires 30d;
        add_header Cache-Control "public, immutable";
    }
}
```

```bash
# Enable site and get SSL
sudo ln -s /etc/nginx/sites-available/sriguide /etc/nginx/sites-enabled/
sudo certbot --nginx -d sriguide.lk -d www.sriguide.lk
sudo nginx -t && sudo systemctl reload nginx
```

### 5. Database Backup (Cron)

```bash
# Create backup script
sudo nano /var/www/sriguide/backup.sh
```

```bash
#!/bin/bash
pg_dump -U postgres sriguide_db > /var/www/sriguide/backups/db_$(date +%Y%m%d_%H%M%S).sql
find /var/www/sriguide/backups/ -mtime +7 -delete
```

```bash
chmod +x /var/www/sriguide/backup.sh
# Add to cron (daily at 2 AM)
crontab -e
# Add: 0 2 * * * /var/www/sriguide/backup.sh
```

### 6. Firewall

```bash
sudo ufw allow 22    # SSH
sudo ufw allow 80    # HTTP
sudo ufw allow 443   # HTTPS
sudo ufw enable
```

---

## Common Issues & Troubleshooting

| Issue | Solution |
|:---|:---|
| EF Core tools not found | Run `dotnet tool install --global dotnet-ef` |
| Port 5000 in use | Change port in `launchSettings.json` or kill the process |
| CORS errors | Check `Program.cs` CORS policy matches frontend URL |
| Images not loading | Verify Nginx `/uploads/` alias path exists and has read permissions |
| Migration fails | Check connection string and that PostgreSQL is running |
| Next.js API 404 | Verify `.env.local` has correct `NEXT_PUBLIC_API_URL` |
