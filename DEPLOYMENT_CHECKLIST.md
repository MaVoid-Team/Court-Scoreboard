# ✅ Court Scoreboard Deployment Checklist

Use this checklist to track your deployment progress from development to production.

---

## Pre-Deployment Tasks

- [ ] All code committed to `main` branch
- [ ] `.env` file created with production values
- [ ] Verified all dependencies in `package.json`
- [ ] `npm run build` succeeds locally
- [ ] Reviewed `Dockerfile` and `docker-compose.yml`
- [ ] Docker login credentials available
- [ ] VPS access confirmed (SSH key ready)
- [ ] Domain name registered and accessible
- [ ] DNS A record pointing to VPS IP
- [ ] Backed up any previous application data

---

## VPS Environment Setup

- [ ] SSH accessed VPS successfully
- [ ] Ubuntu updated: `sudo apt update && sudo apt upgrade -y`
- [ ] Docker installed and running: `docker --version`
- [ ] Docker Compose installed: `docker-compose --version`
- [ ] Application directory created: `/opt/court-scoreboard`
- [ ] Proper directory permissions set
- [ ] Repository cloned or files copied to VPS
- [ ] Git configured (if pulling from repo)

---

## Docker Build & Deployment

- [ ] Docker image built: `docker-compose build`
- [ ] No build errors in logs
- [ ] Container starts without errors: `docker-compose up -d`
- [ ] Container is running: `docker-compose ps` shows `Up`
- [ ] Container logs checked: `docker-compose logs`
- [ ] Application accessible locally: `curl http://localhost`
- [ ] Port 80 not in use by other services
- [ ] Docker container restart policy set to `unless-stopped`
- [ ] .dockerignore file present and correct
- [ ] Verified docker logs: `docker-compose logs | grep -i error`

---

## Nginx Reverse Proxy Setup

- [ ] Nginx installed: `sudo apt install nginx -y`
- [ ] Nginx reverse proxy config created: `/etc/nginx/sites-available/court-scoreboard`
- [ ] Config includes proper proxy headers
- [ ] Site enabled: `sudo ln -s sites-available/court-scoreboard sites-enabled/`
- [ ] Nginx syntax valid: `sudo nginx -t` (Output: `ok`)
- [ ] Nginx restarted: `sudo systemctl restart nginx`
- [ ] Nginx running: `sudo systemctl status nginx`
- [ ] HTTP traffic properly proxied to container
- [ ] Verified via: `curl http://scoreboard.example.com`
- [ ] Browser test: Domain accessible (may show HTTP warning)

---

## SSL/TLS Certificate Setup

- [ ] Certbot installed: `sudo apt install certbot python3-certbot-nginx -y`
- [ ] Let's Encrypt certificate obtained: `sudo certbot --nginx -d scoreboard.example.com`
- [ ] Certificate stored in `/etc/letsencrypt/live/`
- [ ] HTTP→HTTPS redirect configured
- [ ] HTTPS accessible: `curl https://scoreboard.example.com`
- [ ] SSL test passed: A+ grade on https://www.ssllabs.com/ssltest/
- [ ] Browser shows padlock/secure indicator
- [ ] HSTS header present: `curl -I https://scoreboard.example.com | grep HSTS`
- [ ] Certificate auto-renewal configured
- [ ] Renewal test passed: `sudo certbot renew --dry-run`
- [ ] Certificate expiry checked: `sudo certbot certificates`

---

## Security Verification

- [ ] Firewall enabled: `sudo ufw status` (should be `active`)
- [ ] SSH port 22 allowed: `sudo ufw allow 22/tcp`
- [ ] HTTP port 80 allowed: `sudo ufw allow 80/tcp`
- [ ] HTTPS port 443 allowed: `sudo ufw allow 443/tcp`
- [ ] All other ports denied: `sudo ufw default deny incoming`
- [ ] SSH key-based authentication enabled
- [ ] Password SSH login disabled (optional but recommended)
- [ ] Nginx security headers present in config
- [ ] X-Frame-Options header set
- [ ] X-Content-Type-Options header set
- [ ] CORS headers configured if needed
- [ ] No sensitive data in logs: `docker-compose logs | grep -i password`
- [ ] No hardcoded secrets in Docker image

---

## Post-Deployment Testing

- [ ] Application loads in browser: https://scoreboard.example.com
- [ ] React Router navigation works (test all routes)
- [ ] Display view accessible: /
- [ ] Admin panel accessible: /admin
- [ ] localStorage persistence working
- [ ] Image uploads function correctly
- [ ] Timer controls respond
- [ ] Score updates sync properly
- [ ] BroadcastChannel works across tabs (if applicable)
- [ ] No JavaScript errors in browser console (F12)
- [ ] No 404 errors in Nginx logs
- [ ] Network requests properly proxied
- [ ] Database connectivity (if applicable)
- [ ] Static assets loading (CSS, JS, images)
- [ ] Fonts loading correctly
- [ ] SVGs rendering properly

---

## Performance Verification

- [ ] Page load time < 3 seconds
- [ ] Static assets cached (expires header present)
- [ ] Gzip compression enabled: `curl -I https://scoreboard.example.com | grep Content-Encoding`
- [ ] Browser DevTools shows gzipped assets
- [ ] No unused dependencies in bundle
- [ ] Image assets optimized
- [ ] Lazy loading configured (if applicable)
- [ ] Container resource usage monitored: `docker stats court_scoreboard`
- [ ] CPU usage stable (< 20%)
- [ ] Memory usage reasonable (< 256 MB)
- [ ] Disk space available

---

## Monitoring & Logging Setup

- [ ] Docker logging driver configured
- [ ] Log rotation set up: max-size and max-file
- [ ] Nginx access log location: `/var/log/nginx/court-scoreboard_access.log`
- [ ] Nginx error log location: `/var/log/nginx/court-scoreboard_error.log`
- [ ] Logs accessible: `docker-compose logs -f`
- [ ] Error monitoring active (or manually checked)
- [ ] Alerting configured (optional)
- [ ] Log backup strategy defined

---

## Backup & Recovery

- [ ] Application files backed up
- [ ] Backup location documented
- [ ] Backup tested (recovery verified)
- [ ] Docker volumes backed up (if any databases)
- [ ] Environment variables backed up separately
- [ ] SSL certificates backed up: `/etc/letsencrypt/`
- [ ] Recovery procedure documented
- [ ] Offsite backup location identified

---

## Documentation

- [ ] DOCKER_DEPLOYMENT.md reviewed and bookmarked
- [ ] DEPLOYMENT_CHECKLIST.md printed or saved
- [ ] docker-compose.yml annotated with comments
- [ ] nginx.conf reviewed and documented
- [ ] Runbook created with quick commands
- [ ] Troubleshooting guide bookmarked
- [ ] Emergency contacts list prepared
- [ ] Database backup procedure documented
- [ ] Update process documented

---

## Production Handoff

- [ ] Team members have SSH access
- [ ] Deployment runbook shared with team
- [ ] Monitoring dashboards set up
- [ ] Escalation contacts documented
- [ ] On-call rotation established
- [ ] Disaster recovery plan created
- [ ] Performance baseline established
- [ ] SLA defined and documented

---

## Ongoing Maintenance

- [ ] Weekly: Check application logs for errors
- [ ] Weekly: Monitor disk space: `df -h`
- [ ] Monthly: Review security updates: `sudo apt update`
- [ ] Monthly: Test SSL certificate renewal: `sudo certbot renew --dry-run`
- [ ] Monthly: Prune Docker images: `docker system prune -a`
- [ ] Quarterly: Review and update dependencies
- [ ] Quarterly: Audit security groups and firewall rules
- [ ] Quarterly: Test backup restoration procedure

---

## Post-Issues/Updates

After encountering and fixing issues:
- [ ] Issue documented in runbook
- [ ] Solution added to DOCKER_DEPLOYMENT.md troubleshooting
- [ ] Team informed of changes
- [ ] Backup updated
- [ ] Monitoring alerts configured if applicable

---

## Sign-Off

**Deployed By**: ________________________
**Date**: ________________________
**Environment**: Production
**Version**: ________________________
**Notes**:
```
_________________________________________________________________
_________________________________________________________________
_________________________________________________________________
```

**Approved By**: ________________________
**Date**: ________________________

---

**See also**: DOCKER_DEPLOYMENT.md for detailed instructions
