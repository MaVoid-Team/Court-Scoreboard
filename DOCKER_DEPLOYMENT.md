# 🚀 Court Scoreboard - Docker Deployment Guide

This guide covers deploying the Court Scoreboard React/Vite SPA on a VPS using Docker and Nginx.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Environment Setup](#environment-setup)
3. [Deployment Steps](#deployment-steps)
4. [Nginx Configuration](#nginx-configuration)
5. [SSL/TLS Setup](#ssltls-setup)
6. [Application Management](#application-management)
7. [Troubleshooting](#troubleshooting)
8. [Security Best Practices](#security-best-practices)

---

## Prerequisites

### VPS Requirements
- **OS**: Ubuntu 22.04 LTS or later (recommended)
- **CPU**: 1+ cores
- **RAM**: 512 MB minimum
- **Disk**: 10 GB+
- **Network**: Public IP with SSH access

### Required Software
- Docker (20.10+)
- Docker Compose (2.0+)
- Nginx (for reverse proxy and SSL termination)
- Certbot (for Let's Encrypt SSL certificates)
- Git

### Domain Requirements
- A registered domain name (e.g., `scoreboard.example.com`)
- DNS A record pointing to your VPS IP

---

## Environment Setup

### Step 1: SSH into Your VPS

```bash
ssh root@your-vps-ip
# or with a non-root user
ssh ubuntu@your-vps-ip
```

### Step 2: Install Docker and Docker Compose

Run the automated setup script included in this repo, or manually install:

```bash
# Update system packages
sudo apt update && sudo apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Install Docker Compose (if not included with Docker)
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Verify installation
docker --version
docker-compose --version
```

### Step 3: Create Application Directory

```bash
# Create app directory
sudo mkdir -p /opt/court-scoreboard
cd /opt/court-scoreboard

# Set proper permissions
sudo chown -R $USER:$USER /opt/court-scoreboard
```

### Step 4: Clone/Deploy Your Repository

```bash
# Clone from GitHub (update URL with your repo)
git clone https://github.com/yourusername/Court-Scoreboard.git .

# Or copy files directly if you have them locally
# scp -r ./Court-Scoreboard/* user@vps:/opt/court-scoreboard/
```

---

## Deployment Steps

### Step 1: Build and Start the Docker Container

```bash
cd /opt/court-scoreboard

# Build the Docker image
docker-compose build

# Start the container in detached mode
docker-compose up -d

# Verify container is running
docker-compose ps
```

**Output should show:**
```
NAME              COMMAND                  STATUS
court_scoreboard  "nginx -g daemon off;"   Up (healthy)
```

### Step 2: Verify Container is Working

```bash
# Test container is serving content
docker exec court_scoreboard wget -qO- http://localhost | head -20

# Check logs for errors
docker-compose logs -f
```

### Step 3: Configure Nginx Reverse Proxy

On your VPS, create a new Nginx configuration for the reverse proxy:

```bash
# Create Nginx config for reverse proxy
sudo nano /etc/nginx/sites-available/court-scoreboard
```

Add the following configuration (see **nginx.conf.example** section below):

```nginx
server {
    listen 80;
    server_name scoreboard.example.com;

    location / {
        proxy_pass http://localhost:80;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

### Step 4: Enable the Nginx Site and Restart

```bash
# Enable the site
sudo ln -s /etc/nginx/sites-available/court-scoreboard /etc/nginx/sites-enabled/

# Test Nginx configuration
sudo nginx -t

# Restart Nginx
sudo systemctl restart nginx
```

### Step 5: Verify Deployment

```bash
# Test from VPS
curl http://scoreboard.example.com

# Open in browser
# Visit: http://scoreboard.example.com
```

---

## Nginx Configuration

### Reverse Proxy with SSL (Production Ready)

Create `/etc/nginx/sites-available/court-scoreboard-ssl`:

```nginx
# HTTP to HTTPS redirect
server {
    listen 80;
    server_name scoreboard.example.com;
    return 301 https://$server_name$request_uri;
}

# HTTPS server block
server {
    listen 443 ssl http2;
    server_name scoreboard.example.com;

    # SSL Certificate paths (managed by Certbot)
    ssl_certificate /etc/letsencrypt/live/scoreboard.example.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/scoreboard.example.com/privkey.pem;

    # SSL configuration
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 10m;

    # Security headers
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;

    # Gzip compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript;
    gzip_min_length 1000;

    # Proxy to Docker container
    location / {
        proxy_pass http://localhost:80;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_redirect off;
    }

    # Deny access to hidden files
    location ~ /\. {
        deny all;
    }

    access_log /var/log/nginx/court-scoreboard_access.log;
    error_log /var/log/nginx/court-scoreboard_error.log;
}
```

---

## SSL/TLS Setup

### Obtain Let's Encrypt Certificate with Certbot

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx -y

# Obtain certificate (automated with Nginx plugin)
sudo certbot --nginx -d scoreboard.example.com

# Follow the prompts to:
# 1. Enter your email
# 2. Agree to terms
# 3. Choose redirect (HTTPS is recommended)
```

### Verify SSL Certificate

```bash
# Test SSL configuration
sudo ssl-cert-check -c /etc/letsencrypt/live/scoreboard.example.com/fullchain.pem

# Or using openssl
openssl x509 -in /etc/letsencrypt/live/scoreboard.example.com/fullchain.pem -noout -dates

# Test with curl
curl -I https://scoreboard.example.com
```

### Automatic Certificate Renewal

Certbot automatically sets up renewal via systemd timer:

```bash
# Check renewal status
sudo certbot renew --dry-run

# View renewal timer
sudo systemctl status certbot.timer
```

---

## Application Management

### View Logs

```bash
# Docker container logs
docker-compose logs -f

# View last 50 lines
docker-compose logs --tail=50

# Nginx access logs
sudo tail -f /var/log/nginx/court-scoreboard_access.log

# Nginx error logs
sudo tail -f /var/log/nginx/court-scoreboard_error.log
```

### Restart Application

```bash
# Graceful restart
docker-compose restart

# Full restart (stop + start)
docker-compose down
docker-compose up -d

# Rebuild and restart (when code changes)
docker-compose build --no-cache
docker-compose up -d
```

### Stop Application

```bash
# Stop containers (preserves volumes)
docker-compose stop

# Bring everything down
docker-compose down
```

### Update Application Code

```bash
# Pull latest changes
git pull origin main

# Rebuild Docker image
docker-compose build --no-cache

# Restart with new image
docker-compose up -d

# Verify
docker-compose ps
```

### View Container Status

```bash
# Show all containers
docker-compose ps

# Show running containers on entire system
docker ps

# Inspect container details
docker inspect court_scoreboard
```

### Execute Commands in Container

```bash
# Access container shell
docker exec -it court_scoreboard sh

# View Nginx config inside container
docker exec court_scoreboard cat /etc/nginx/nginx.conf

# Check if Nginx is running
docker exec court_scoreboard ps aux | grep nginx
```

---

## Troubleshooting

### Container Won't Start

**Problem**: `docker-compose up -d` fails or container immediately exits

**Solutions:**

```bash
# Check logs for errors
docker-compose logs

# Verify Docker daemon is running
sudo systemctl status docker

# Try rebuilding
docker-compose build --no-cache

# Check port conflicts
sudo netstat -tlnp | grep :80
```

### Nginx Connection Refused

**Problem**: `curl http://localhost` fails or browser shows connection refused

**Solutions:**

```bash
# Verify container is running
docker-compose ps

# Check if container is listening on port 80
docker exec court_scoreboard netstat -tlnp | grep 80

# Restart the container
docker-compose restart

# Check Nginx status inside container
docker exec court_scoreboard nginx -t
```

### Certificate Issues

**Problem**: SSL certificate errors or expired certificates

**Solutions:**

```bash
# Check certificate expiry
sudo certbot certificates

# Manually renew
sudo certbot renew

# Force renewal
sudo certbot renew --force-renewal

# Check Nginx SSL configuration
sudo nginx -t
```

### Port Conflicts

**Problem**: `Error response from daemon: Ports are not available`

**Solutions:**

```bash
# Find what's using port 80
sudo lsof -i :80
sudo netstat -tlnp | grep :80

# Kill the process
sudo kill -9 <PID>

# Or change Docker port mapping in docker-compose.yml
# Change: ports: ["80:80"] to ports: ["8080:80"]
```

### DNS Resolution Issues

**Problem**: Domain doesn't resolve to VPS

**Check/Fix:**

```bash
# Verify DNS A record
nslookup scoreboard.example.com
dig scoreboard.example.com

# Wait for DNS propagation (up to 48 hours)
# Check propagation status at: https://www.whatsmydns.net/

# Test from VPS
curl -H "Host: scoreboard.example.com" http://localhost
```

### Container Disk Space Full

**Problem**: Build fails due to disk space

**Solutions:**

```bash
# Check disk usage
df -h

# Clean up Docker
docker system prune -a --volumes

# Remove unused images
docker image prune -a

# Check container logs size
docker exec court_scoreboard du -sh /var/log/nginx/
sudo du -sh /var/lib/docker/containers/
```

---

## Security Best Practices

### Network Security

✅ **Do:**
- Use HTTPS (Let's Encrypt certificates)
- Enable HTTP to HTTPS redirect
- Use strong SSL protocols (TLSv1.2+)
- Restrict SSH access (use key pairs, not passwords)

```bash
# SSH key-based authentication (in ~/.ssh/authorized_keys)
ssh-copy-id -i ~/.ssh/id_rsa.pub user@vps

# Disable password SSH login
sudo sed -i 's/PasswordAuthentication yes/PasswordAuthentication no/' /etc/ssh/sshd_config
sudo systemctl restart ssh
```

### Firewall Configuration

```bash
# Enable UFW (Ubuntu Firewall)
sudo ufw enable

# Allow necessary ports
sudo ufw allow 22/tcp    # SSH
sudo ufw allow 80/tcp    # HTTP
sudo ufw allow 443/tcp   # HTTPS

# Deny all other traffic
sudo ufw default deny incoming
sudo ufw default allow outgoing
```

### Container Security

✅ **Security Features in Dockerfile:**
- Uses Alpine Linux (minimal image, fewer vulnerabilities)
- Multi-stage build (reduces final image size)
- Non-root user (Nginx runs as nginx user)
- Read-only root filesystem support

```bash
# Run container with read-only root filesystem
docker run --read-only --tmpfs /tmp --tmpfs /var/run <image>

# Add to docker-compose.yml:
# read_only: true
# tmpfs: ['/tmp', '/var/run']
```

### Nginx Security Headers

Our nginx.conf includes:
- `X-Frame-Options: SAMEORIGIN` - Prevents clickjacking
- `X-Content-Type-Options: nosniff` - Prevents MIME type sniffing
- `X-XSS-Protection` - Legacy XSS protection
- `Strict-Transport-Security` (HSTS) - Forces HTTPS

### Monitoring & Logging

```bash
# Monitor container resource usage
docker stats court_scoreboard

# Set up log rotation
# Add to docker-compose.yml:
# logging:
#   driver: "json-file"
#   options:
#     max-size: "10m"
#     max-file: "3"
```

### Regular Maintenance

```bash
# Weekly: Check for updates
sudo apt update && sudo apt upgrade -y

# Monthly: Renew certificates (automatic with Certbot)
sudo certbot renew --dry-run

# Monthly: Prune unused Docker objects
docker system prune -a --volumes

# Quarterly: Review access logs for suspicious activity
sudo tail -f /var/log/nginx/court-scoreboard_access.log
```

---

## Multi-App VPS Setup

If hosting multiple applications on the same VPS:

**Approach 1: Multiple Docker Networks**
```bash
# Create separate network for each app
docker network create app1_network
docker network create app2_network
```

**Approach 2: Reverse Proxy with Multiple Backends**
```nginx
# Route to different apps by subdomain
server {
    listen 443 ssl http2;
    server_name app1.example.com;
    location / { proxy_pass http://localhost:3001; }
}

server {
    listen 443 ssl http2;
    server_name app2.example.com;
    location / { proxy_pass http://localhost:3002; }
}
```

**Approach 3: Subpath Routing**
```nginx
server {
    listen 443 ssl http2;
    server_name example.com;

    location /app1/ {
        proxy_pass http://localhost:3001/;
        rewrite ^/app1(.*)$ $1 break;
    }

    location /app2/ {
        proxy_pass http://localhost:3002/;
        rewrite ^/app2(.*)$ $1 break;
    }
}
```

---

## Backup & Recovery

### Backup Application Files

```bash
# Backup docker-compose and config
tar -czf court-scoreboard-backup-$(date +%Y%m%d).tar.gz \
  /opt/court-scoreboard

# Store off-site
scp court-scoreboard-backup-*.tar.gz remote-backup-server:/backups/
```

### Restore from Backup

```bash
# Extract backup
tar -xzf court-scoreboard-backup-20240316.tar.gz -C /

# Restart container
docker-compose up -d
```

---

## Performance Optimization

### Docker Resource Limits

Add to docker-compose.yml:
```yaml
services:
  frontend:
    # ... other config ...
    deploy:
      resources:
        limits:
          cpus: '0.5'
          memory: 256M
        reservations:
          cpus: '0.25'
          memory: 128M
```

### Enable Nginx Caching

Already configured in nginx.conf:
- Static assets cached for 1 year
- Gzip compression enabled
- Browser caching headers set

### Monitor Performance

```bash
# Check container resource usage
docker stats court_scoreboard

# View slow requests in Nginx logs
sudo grep '"[0-9][0-9][0-9]"' /var/log/nginx/court-scoreboard_access.log

# Monitor CPU, memory, disk
top
htop  # if installed: sudo apt install htop
```

---

## Quick Reference Commands

```bash
# Navigate to app directory
cd /opt/court-scoreboard

# View status
docker-compose ps

# View logs (follow in real-time)
docker-compose logs -f

# Restart app
docker-compose restart

# Stop app
docker-compose down

# Start app
docker-compose up -d

# Rebuild and restart
docker-compose build --no-cache && docker-compose up -d

# Check system resources
docker stats court_scoreboard

# Update code and redeploy
git pull origin main
docker-compose build --no-cache
docker-compose up -d
```

---

## Support & Resources

- **Docker Docs**: https://docs.docker.com/
- **Docker Compose**: https://docs.docker.com/compose/
- **Nginx**: https://nginx.org/en/docs/
- **Let's Encrypt**: https://letsencrypt.org/
- **Certbot**: https://certbot.eff.org/

---

**Last Updated**: March 16, 2026
**Deployment Status**: Ready for Production
