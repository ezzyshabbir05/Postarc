#!/usr/bin/env bash
# =============================================================================
# Postarc One-Click Installation & Deployment Script (Ubuntu / Debian)
# =============================================================================

set -e

CYAN='\033[0;36m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${CYAN}"
echo "=========================================================="
echo "          Postarc Enterprise Mail Server Installer        "
echo "=========================================================="
echo -e "${NC}"

# Check for root / sudo
if [ "$EUID" -ne 0 ]; then
    echo -e "${RED}[ERROR] Please run this script with sudo or as root.${NC}"
    exit 1
fi

# Step 1: Install Docker & Docker Compose if missing
if ! command -v docker &> /dev/null; then
    echo -e "${YELLOW}[1/4] Docker not found. Installing Docker CE...${NC}"
    apt-get update -y
    apt-get install -y ca-certificates curl gnupg lsb-release
    mkdir -p /etc/apt/keyrings
    curl -fsSL https://download.docker.com/linux/ubuntu/gpg | gpg --dearmor -o /etc/apt/keyrings/docker.gpg
    echo \
      "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
      $(lsb_release -cs) stable" | tee /etc/apt/sources.list.d/docker.list > /dev/null
    apt-get update -y
    apt-get install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin
    systemctl enable --now docker
    echo -e "${GREEN}Docker installed successfully.${NC}"
else
    echo -e "${GREEN}[1/4] Docker is already installed.${NC}"
fi

# Step 2: Configure Environment
echo -e "${YELLOW}[2/4] Configuring Postarc environment...${NC}"

if [ ! -f .env ]; then
    cp .env.example .env
    read -p "Enter primary mail domain (e.g. yourdomain.com): " DOMAIN
    read -p "Enter SuperAdmin email (e.g. admin@$DOMAIN): " ADMIN_EMAIL
    
    # Generate secure random passwords
    ADMIN_PASS=$(openssl rand -base64 16)
    DB_PASS=$(openssl rand -base64 24 | tr -dc 'a-zA-Z0-9')
    SESSION_SEC=$(openssl rand -hex 32)
    
    sed -i "s|HOSTNAME=.*|HOSTNAME=mail.${DOMAIN}|" .env
    sed -i "s|ADMIN_USER=.*|ADMIN_USER=${ADMIN_EMAIL}|" .env
    sed -i "s|ADMIN_PASSWORD=.*|ADMIN_PASSWORD=${ADMIN_PASS}|" .env
    sed -i "s|DB_PASSWORD=.*|DB_PASSWORD=${DB_PASS}|" .env
    sed -i "s|SESSION_SECRET=.*|SESSION_SECRET=${SESSION_SEC}|" .env
    
    echo -e "${GREEN}Configuration generated in .env.${NC}"
else
    echo -e "${GREEN}.env already exists, using existing configuration.${NC}"
fi

# Step 3: Open required firewall ports (ufw if present)
echo -e "${YELLOW}[3/4] Configuring firewall rules...${NC}"
if command -v ufw &> /dev/null && ufw status | grep -q "Status: active"; then
    ufw allow 25/tcp comment "Postarc SMTP Inbound"
    ufw allow 465/tcp comment "Postarc SMTPS Outbound"
    ufw allow 587/tcp comment "Postarc SMTP Submission"
    ufw allow 143/tcp comment "Postarc IMAP STARTTLS"
    ufw allow 993/tcp comment "Postarc IMAPS"
    ufw allow 110/tcp comment "Postarc POP3 STARTTLS"
    ufw allow 995/tcp comment "Postarc POP3S"
    ufw allow 4190/tcp comment "Postarc ManageSieve"
    ufw allow 80/tcp comment "Postarc HTTP / ACME"
    ufw allow 443/tcp comment "Postarc HTTPS"
    ufw allow 3000/tcp comment "Postarc Webmail & Admin"
    echo -e "${GREEN}Firewall ports configured.${NC}"
fi

# Step 4: Build & Start Containers
echo -e "${YELLOW}[4/4] Starting Postarc containers with Docker Compose...${NC}"
docker compose up -d --build

SERVER_IP=$(hostname -I | awk '{print $1}')

echo -e "${CYAN}"
echo "=========================================================="
echo "          Postarc Successfully Deployed!                  "
echo "=========================================================="
echo -e "${NC}"
echo -e "Webmail & Admin Console: ${GREEN}http://${SERVER_IP}:3000${NC}"
echo -e "Admin Username:          ${GREEN}$(grep ADMIN_USER .env | cut -d '=' -f2)${NC}"
echo -e "Admin Password:          ${GREEN}$(grep ADMIN_PASSWORD .env | cut -d '=' -f2)${NC}"
echo ""
echo -e "${YELLOW}DNS Records to configure at your registrar:${NC}"
echo -e "  MX:    @              mail.${DOMAIN}    (Priority 10)"
echo -e "  A:     mail           ${SERVER_IP}"
echo -e "  TXT:   @              \"v=spf1 mx ~all\""
echo -e "  TXT:   _dmarc         \"v=DMARC1; p=quarantine; rua=mailto:dmarc@${DOMAIN}\""
echo ""
echo "Manage containers with: docker compose [ps|logs|restart|stop]"

