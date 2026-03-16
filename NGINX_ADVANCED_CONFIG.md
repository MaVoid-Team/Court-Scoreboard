# 🚀 Advanced Nginx Configuration Guide

This guide covers advanced Nginx setups for complex VPS scenarios with the Court Scoreboard and other applications.

---

## Table of Contents

1. [Multiple Applications](#multiple-applications)
2. [Subdomain Routing](#subdomain-routing)
3. [Subpath Routing](#subpath-routing)
4. [Load Balancing](#load-balancing)
5. [SSL Certificates](#ssl-certificates-multiple-domains)
6. [Advanced Proxy Features](#advanced-proxy-features)
7. [Troubleshooting](#troubleshooting)

---

## Multiple Applications

### Scenario: Running Court Scoreboard + Other Apps on One VPS

#### Setup with Multiple Docker Containers

```yaml
# docker-compose.yml structure
services:
  # Court Scoreboard
  scoreboard:
    build: ./court-scoreboard
    container_name: court_scoreboard
    ports:
      - "3001:80"
    networks:
      - app_network

  # Another app (e.g., Dashboard)
  dashboard:
    build: ./dashboard-app
    container_name: dashboard
    ports:
      - "3002:80"
    networks:
      - app_network

networks:
  app_network:
    driver: bridge
```

#### Nginx Configuration for Multiple Apps

```nginx
# /etc/nginx/sites-available/multiple-apps

# Court Scoreboard - api.example.com
server {
    listen 443 ssl http2;
    server_name scoreboard.example.com;

    ssl_certificate /etc/letsencrypt/live/scoreboard.example.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/scoreboard.example.com/privkey.pem;

    location / {
        proxy_pass http://localhost:3001;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}

# Dashboard App - dashboard.example.com
server {
    listen 443 ssl http2;
    server_name dashboard.example.com;

    ssl_certificate /etc/letsencrypt/live/dashboard.example.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/dashboard.example.com/privkey.pem;

    location / {
        proxy_pass http://localhost:3002;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}

# HTTP to HTTPS redirects
server {
    listen 80;
    server_name scoreboard.example.com dashboard.example.com;
    return 301 https://$server_name$request_uri;
}
```

---

## Subdomain Routing

### Approach 1: Subdomains as Separate Services

Route different subdomains to different applications/containers.

```nginx
# /etc/nginx/sites-available/subdomains

# app1.example.com
server {
    listen 443 ssl http2;
    server_name app1.example.com;

    ssl_certificate /etc/letsencrypt/live/example.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/example.com/privkey.pem;

    location / {
        proxy_pass http://localhost:3001;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}

# app2.example.com
server {
    listen 443 ssl http2;
    server_name app2.example.com;

    ssl_certificate /etc/letsencrypt/live/example.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/example.com/privkey.pem;

    location / {
        proxy_pass http://localhost:3002;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}

# Wildcard support for *.example.com
server {
    listen 443 ssl http2;
    server_name *.example.com;

    ssl_certificate /etc/letsencrypt/live/example.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/example.com/privkey.pem;

    location / {
        # Route based on subdomain
        if ($server_name ~* ^(.+)\.example\.com$) {
            set $app_port "300$1";  # This is a simplification
        }
        proxy_pass http://localhost:$app_port;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}

# HTTP to HTTPS redirect for all subdomains
server {
    listen 80;
    server_name *.example.com example.com;
    return 301 https://$server_name$request_uri;
}
```

### Approach 2: Map Configuration (More Efficient)

```nginx
# /etc/nginx/sites-available/subdomains-with-map

# Map subdomains to backend ports
map $server_name $backend_port {
    "scoreboard.example.com" 3001;
    "dashboard.example.com" 3002;
    "api.example.com" 3003;
    default 3001;
}

server {
    listen 443 ssl http2;
    server_name scoreboard.example.com dashboard.example.com api.example.com;

    ssl_certificate /etc/letsencrypt/live/example.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/example.com/privkey.pem;

    location / {
        proxy_pass http://localhost:$backend_port;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}

server {
    listen 80;
    server_name scoreboard.example.com dashboard.example.com api.example.com;
    return 301 https://$server_name$request_uri;
}
```

---

## Subpath Routing

### Scenario: Host multiple apps on one domain

Example: `example.com/scoreboard` and `example.com/dashboard`

```nginx
# /etc/nginx/sites-available/subpath

# Single domain with multiple app paths
server {
    listen 443 ssl http2;
    server_name example.com www.example.com;

    ssl_certificate /etc/letsencrypt/live/example.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/example.com/privkey.pem;

    # Court Scoreboard at /scoreboard
    location /scoreboard {
        proxy_pass http://localhost:3001;

        # Rewrite path so the app thinks it's at root
        rewrite ^/scoreboard(.*)$ $1 break;

        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header X-Script-Name /scoreboard;
    }

    # Dashboard at /dashboard
    location /dashboard {
        proxy_pass http://localhost:3002;

        # Rewrite path
        rewrite ^/dashboard(.*)$ $1 break;

        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header X-Script-Name /dashboard;
    }

    # API at /api
    location /api {
        proxy_pass http://localhost:3003;

        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Root location
    location / {
        return 200 "Welcome to example.com";
        add_header Content-Type text/plain;
    }
}

# HTTP to HTTPS redirect
server {
    listen 80;
    server_name example.com www.example.com;
    return 301 https://example.com$request_uri;
}
```

### Important: Subpath Routing with React Router

For React apps on subpaths, update your Vite config:

```javascript
// vite.config.js
export default {
  base: '/scoreboard/',  // Set base path matching Nginx rewrite
  // ... other config
}
```

And update React Router:

```javascript
// In your Router setup
import { BrowserRouter as Router } from 'react-router-dom'

// For subpath: /scoreboard
<Router basename="/scoreboard">
  {/* Routes */}
</Router>
```

---

## Load Balancing

### Scenario: Multiple instances of the same app

Distribute traffic across multiple Docker containers.

**docker-compose.yml**:
```yaml
services:
  court_scoreboard_1:
    build: .
    container_name: court_scoreboard_1
    ports:
      - "3001:80"
    networks:
      - app_network

  court_scoreboard_2:
    build: .
    container_name: court_scoreboard_2
    ports:
      - "3002:80"
    networks:
      - app_network

networks:
  app_network:
    driver: bridge
```

**Nginx Configuration**:
```nginx
# /etc/nginx/sites-available/load-balanced

# Define upstream cluster
upstream scoreboard_cluster {
    # Round-robin by default
    server localhost:3001;
    server localhost:3002;

    # With weights (distribute 60/40)
    # server localhost:3001 weight=3;
    # server localhost:3002 weight=2;

    # Least connections (recommended for long-lived connections)
    # least_conn;

    # Session stickiness (keep user on same server)
    # ip_hash;  # Based on client IP
    # hash $cookie_jsessionid;  # Based on session cookie
}

server {
    listen 443 ssl http2;
    server_name scoreboard.example.com;

    ssl_certificate /etc/letsencrypt/live/scoreboard.example.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/scoreboard.example.com/privkey.pem;

    location / {
        proxy_pass http://scoreboard_cluster;

        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;

        # Load balancing specific settings
        proxy_next_upstream error timeout invalid_header http_500 http_502 http_503;
        proxy_next_upstream_tries 2;
        proxy_next_upstream_timeout 10s;
    }
}

server {
    listen 80;
    server_name scoreboard.example.com;
    return 301 https://scoreboard.example.com$request_uri;
}
```

### Health Checks

Monitor container health with Nginx:

```nginx
upstream scoreboard_cluster {
    server localhost:3001 max_fails=3 fail_timeout=10s;
    server localhost:3002 max_fails=3 fail_timeout=10s;
}
```

---

## SSL Certificates - Multiple Domains

### Single Certificate for Multiple Domains

```bash
# Obtain wildcard certificate (covers *.example.com)
sudo certbot --nginx -d example.com -d *.example.com

# Obtain certificate for multiple specific domains
sudo certbot --nginx \
    -d scoreboard.example.com \
    -d dashboard.example.com \
    -d api.example.com
```

### SAN (Subject Alternative Name) Setup

One certificate for multiple domains:

```nginx
# All these domains use the same certificate
server {
    listen 443 ssl http2;
    server_name scoreboard.example.com dashboard.example.com api.example.com;

    ssl_certificate /etc/letsencrypt/live/scoreboard.example.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/scoreboard.example.com/privkey.pem;

    # ... rest of config
}

# When renewed, all SANs stay valid
```

### Auto-Renewal with Multiple Certificates

```bash
# List all certificates
sudo certbot certificates

# Check renewal status
sudo certbot renew --dry-run

# Renew specific certificate
sudo certbot renew --cert-name scoreboard.example.com

# Auto-renewal via systemd
sudo systemctl status certbot.timer
```

---

## Advanced Proxy Features

### WebSocket Support

For real-time applications:

```nginx
location / {
    proxy_pass http://localhost:3001;

    # Required for WebSockets
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection "upgrade";

    # Standard headers
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;

    # Timeouts for long-lived connections
    proxy_connect_timeout 7d;
    proxy_send_timeout 7d;
    proxy_read_timeout 7d;
}
```

### File Upload Limits

Configure maximum upload size:

```nginx
# Global limit
http {
    client_max_body_size 100M;
}

# Per location
location /upload {
    client_max_body_size 1000M;

    proxy_pass http://localhost:3001;
    proxy_request_buffering off;

    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
}
```

### Response Buffering

Control how Nginx handles responses:

```nginx
location / {
    proxy_pass http://localhost:3001;

    # Enable buffering (default: on)
    proxy_buffering on;
    proxy_buffer_size 4k;
    proxy_buffers 8 4k;
    proxy_busy_buffers_size 8k;

    # For streaming responses (video, large downloads)
    # proxy_buffering off;

    # For large API responses
    # proxy_buffer_size 64k;
    # proxy_buffers 16 64k;
}
```

### Rate Limiting

Protect against abuse:

```nginx
# Define rate limit zone
http {
    limit_req_zone $binary_remote_addr zone=general:10m rate=10r/s;
    limit_req_zone $binary_remote_addr zone=api:10m rate=30r/s;
}

# Apply to server block
server {
    location / {
        limit_req zone=general burst=20 nodelay;
        proxy_pass http://localhost:3001;
        # ... other settings
    }

    location /api/ {
        limit_req zone=api burst=50 nodelay;
        proxy_pass http://localhost:3001;
        # ... other settings
    }
}
```

### Custom Headers

```nginx
location / {
    proxy_pass http://localhost:3001;

    # Remove headers from upstream
    proxy_hide_header X-Powered-By;

    # Add security headers
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;

    # Add custom headers
    add_header X-Backend "App Server 1" always;
}
```

---

## Troubleshooting

### Check Nginx Configuration

```bash
# Test syntax
sudo nginx -t

# Show config paths
sudo nginx -T | head -20

# Reload without stopping
sudo systemctl reload nginx
```

### View Active Connections

```bash
# Monitor proxy connections in real-time
sudo watch 'netstat -antp | grep nginx'

# Count connections by state
sudo netstat -an | grep ESTABLISHED | wc -l
```

### SSL/TLS Issues

```bash
# Test SSL configuration
sudo openssl s_client -connect localhost:443

# Check certificate details
sudo certbot certificates

# Verify certificate matches key
sudo openssl x509 -in /path/to/cert.pem -noout -pubkey | openssl md5
sudo openssl rsa -in /path/to/key.pem -pubout | openssl md5
```

### Proxy Debugging

```nginx
# Enable detailed logging
location / {
    # Log request details
    access_log /var/log/nginx/proxy_debug.log combined buffer=32k flush=5s;

    proxy_pass http://localhost:3001;

    # Log upstream servers
    access_log /var/log/nginx/upstream.log '$upstream_addr - $upstream_status';
}
```

View logs:
```bash
sudo tail -f /var/log/nginx/proxy_debug.log
```

### Port Conflicts

```bash
# Find what's using a port
sudo lsof -i :80
sudo lsof -i :443
sudo netstat -tlnp | grep LISTEN

# Change docker port mapping if needed
# In docker-compose.yml: ports: ["8080:80"]
```

---

## Performance Tips

### Connection Pooling

```nginx
location / {
    proxy_pass http://localhost:3001;

    # Keep connections alive
    proxy_http_version 1.1;
    proxy_set_header Connection "";

    # Upstream connection pooling
    keepalive 32;
}

upstream backend {
    server localhost:3001;
    keepalive 32;
}
```

### Gzip Compression

```nginx
gzip on;
gzip_vary on;
gzip_proxied any;
gzip_comp_level 6;
gzip_types text/plain text/css text/xml text/javascript application/json application/javascript application/xml+rss;
gzip_disable "msie6";
gzip_min_length 1000;
```

### Caching

```nginx
location ~* \.(jpg|jpeg|png|gif|ico|css|js|svg|woff|woff2)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
    proxy_pass http://localhost:3001;
}
```

---

## Common Issues & Solutions

| Issue | Cause | Solution |
|-------|-------|----------|
| 502 Bad Gateway | Backend unavailable | Check `docker-compose ps`, restart container |
| 504 Gateway Timeout | Slow backend | Increase `proxy_connect_timeout`, `proxy_read_timeout` |
| Mixed Content Warning | HTTP resources on HTTPS | Force HTTPS all resources, update app |
| CORS Errors | Browser blockin request | Add `add_header Access-Control-Allow-*` headers |
| Slow uploads | Buffer too small | Increase `client_max_body_size`, `proxy_buffer_size` |
| Connection refused | Port mismatch | Verify docker-compose ports match nginx proxy_pass ports |

---

**Last Updated**: March 16, 2026
