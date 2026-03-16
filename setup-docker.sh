#!/bin/bash

# ============================================================================
# Court Scoreboard - Automated VPS Setup Script
# ============================================================================
# This script automates the setup of Docker, Docker Compose, Nginx, and
# deployment of the Court Scoreboard application on Ubuntu VPS.
#
# Usage: bash setup-docker.sh
# Run on: Ubuntu 22.04 LTS or later
# Requires: root or sudo access
#
# ============================================================================

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# ============================================================================
# Functions
# ============================================================================

log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

check_sudo() {
    if [[ $EUID -ne 0 ]]; then
        log_error "This script must be run as root or with sudo"
        echo "Run: sudo bash setup-docker.sh"
        exit 1
    fi
}

# ============================================================================
# Main Setup Process
# ============================================================================

log_info "Starting Court Scoreboard VPS Setup"
log_info "OS: $(lsb_release -d | cut -f2)"
log_info "=================================="

check_sudo

# Step 1: Update System
log_info "Step 1/9: Updating system packages..."
apt-get update
apt-get upgrade -y
apt-get install -y curl wget git

# Step 2: Install Docker
log_info "Step 2/9: Installing Docker..."
if command -v docker &> /dev/null; then
    log_warn "Docker already installed: $(docker --version)"
else
    curl -fsSL https://get.docker.com -o get-docker.sh
    sh get-docker.sh
    rm get-docker.sh
    log_info "Docker installed successfully"
fi

# Step 3: Install Docker Compose
log_info "Step 3/9: Installing Docker Compose..."
if command -v docker-compose &> /dev/null; then
    log_warn "Docker Compose already installed: $(docker-compose --version)"
else
    curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    chmod +x /usr/local/bin/docker-compose
    log_info "Docker Compose installed successfully"
fi

# Step 4: Start Docker Service
log_info "Step 4/9: Configuring Docker service..."
systemctl enable docker
systemctl start docker

# Step 5: Install Nginx
log_info "Step 5/9: Installing Nginx..."
if command -v nginx &> /dev/null; then
    log_warn "Nginx already installed: $(nginx -v 2>&1)"
else
    apt-get install -y nginx
    systemctl enable nginx
    systemctl start nginx
    log_info "Nginx installed and started"
fi

# Step 6: Install Certbot
log_info "Step 6/9: Installing Certbot (Let's Encrypt)..."
apt-get install -y certbot python3-certbot-nginx
log_info "Certbot installed"

# Step 7: Create Application Directory
log_info "Step 7/9: Creating application directory..."
APP_DIR="/opt/court-scoreboard"
if [ ! -d "$APP_DIR" ]; then
    mkdir -p "$APP_DIR"
    log_info "Created $APP_DIR"
else
    log_warn "$APP_DIR already exists"
fi

# Step 8: Configure Firewall (UFW)
log_info "Step 8/9: Configuring firewall..."
if command -v ufw &> /dev/null; then
    ufw --force enable
    ufw allow 22/tcp      # SSH
    ufw allow 80/tcp      # HTTP
    ufw allow 443/tcp     # HTTPS
    ufw default deny incoming
    ufw default allow outgoing
    log_info "Firewall configured"
else
    log_warn "UFW not available, skipping firewall configuration"
fi

# Step 9: Display Summary
log_info "Step 9/9: Setup Complete!"
log_info "=================================="
echo ""
echo "✅ Installation Summary:"
echo "   Docker: $(docker --version)"
echo "   Docker Compose: $(docker-compose --version)"
echo "   Nginx: $(nginx -v 2>&1)"
echo "   Certbot: $(certbot --version)"
echo ""
echo "📁 Application Directory: $APP_DIR"
echo ""
echo "🔐 Firewall Rules:"
echo "   SSH (22): ALLOW"
echo "   HTTP (80): ALLOW"
echo "   HTTPS (443): ALLOW"
echo "   Other: DENY"
echo ""
echo "⏭️  Next Steps:"
echo "   1. Clone your repository to $APP_DIR:"
echo "      git clone https://github.com/yourusername/Court-Scoreboard.git $APP_DIR"
echo ""
echo "   2. Navigate to the directory:"
echo "      cd $APP_DIR"
echo ""
echo "   3. Build and start the Docker container:"
echo "      docker-compose build"
echo "      docker-compose up -d"
echo ""
echo "   4. Configure Nginx reverse proxy:"
echo "      sudo cp nginx.conf.example /etc/nginx/sites-available/court-scoreboard"
echo "      sudo ln -s /etc/nginx/sites-available/court-scoreboard /etc/nginx/sites-enabled/"
echo "      sudo nginx -t"
echo "      sudo systemctl reload nginx"
echo ""
echo "   5. Obtain SSL certificate:"
echo "      sudo certbot --nginx -d yourdomain.com"
echo ""
echo "   6. Verify deployment:"
echo "      docker-compose ps"
echo "      curl https://yourdomain.com"
echo ""
echo "📖 Documentation:"
echo "   - DOCKER_DEPLOYMENT.md: Detailed deployment guide"
echo "   - DEPLOYMENT_CHECKLIST.md: Pre/post deployment checklist"
echo "   - DOCKER_FILES_SUMMARY.md: Overview of Docker files"
echo ""
log_info "Setup completed successfully!"
