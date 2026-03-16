# 🚀 Quick Start - VPS Deployment

Fast reference for deploying Court Scoreboard on your VPS in 10 minutes.

---

## Prerequisites

- Ubuntu 22.04 LTS on VPS
- Domain registered (e.g., `scoreboard.example.com`)
- SSH access to VPS
- DNS A record pointing to VPS IP

---

## 1. SSH to VPS

```bash
ssh root@your-vps-ip
```

---

## 2. Run Automated Setup

```bash
# This installs Docker, Docker Compose, Nginx, and Certbot
curl -fsSL https://raw.githubusercontent.com/yourusername/Court-Scoreboard/main/setup-docker.sh | sudo bash
```

Or manually:
```bash
sudo bash setup-docker.sh
```

---

## 3. Clone & Deploy Repository

```bash
cd /opt/court-scoreboard

# Clone your repo (update URL)
git clone https://github.com/yourusername/Court-Scoreboard.git .

# OR copy your files
# scp -r ./Court-Scoreboard/* user@vps:/opt/court-scoreboard/
```

---

## 4. Build & Start Docker Container

```bash
cd /opt/court-scoreboard

# Build the image (takes 2-3 minutes)
docker-compose build

# Start the container
docker-compose up -d

# Verify it's running
docker-compose ps
```

---

## 5. Configure Nginx Reverse Proxy

```bash
# Copy nginx config to VPS location
sudo cp nginx.conf.example /etc/nginx/sites-available/court-scoreboard

# Edit the domain name
sudo nano /etc/nginx/sites-available/court-scoreboard
# Replace: scoreboard.example.com with YOUR domain

# Enable the site
sudo ln -s /etc/nginx/sites-available/court-scoreboard /etc/nginx/sites-enabled/

# Test config
sudo nginx -t

# Reload nginx
sudo systemctl reload nginx
```

---

## 6. Obtain SSL Certificate

```bash
# Replace with your actual domain
sudo certbot --nginx -d scoreboard.example.com

# Follow prompts:
# - Enter email
# - Agree to terms
# - Choose to redirect HTTP to HTTPS
```

---

## 7. Verify Deployment

```bash
# Check Docker container
docker-compose ps
docker-compose logs

# Test application
curl https://scoreboard.example.com

# Open in browser
# Visit: https://scoreboard.example.com
```

---

## Ongoing Management

### View Logs
```bash
docker-compose logs -f
sudo tail -f /var/log/nginx/court-scoreboard_access.log
```

### Restart Application
```bash
docker-compose restart
```

### Update Code
```bash
git pull origin main
docker-compose build --no-cache
docker-compose up -d
```

### Stop Application
```bash
docker-compose down
```

---

## Troubleshooting

**Can't access domain?**
- Check DNS: `nslookup scoreboard.example.com`
- Wait up to 48 hours for DNS propagation
- Check firewall: `sudo ufw status`

**Container won't start?**
- View logs: `docker-compose logs`
- Check ports: `sudo netstat -tlnp | grep :80`
- Rebuild: `docker-compose build --no-cache`

**Nginx 502 error?**
- Container not running: `docker-compose ps`
- Port mismatch: Verify proxy_pass matching docker port
- Check logs: `docker exec court_scoreboard nginx -t`

**SSL certificate issues?**
- Check expiry: `sudo certbot certificates`
- Renew: `sudo certbot renew`
- Test auto-renewal: `sudo certbot renew --dry-run`

---

## Full Documentation

- **DOCKER_DEPLOYMENT.md** - Complete deployment guide
- **DEPLOYMENT_CHECKLIST.md** - Pre/post deployment checklist
- **DOCKER_FILES_SUMMARY.md** - Overview of Docker files
- **NGINX_ADVANCED_CONFIG.md** - Advanced multi-app setups
- **setup-docker.sh** - Automated VPS setup script

---

⏱️ **Total Time**: ~10 minutes (build time included)
✅ **Result**: HTTPS-secured app accessible to everyone!

**Domain**: https://scoreboard.example.com
