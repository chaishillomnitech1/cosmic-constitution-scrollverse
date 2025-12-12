#!/bin/bash
# Environment Variable Rotation Script
# Purpose: Rotate sensitive environment variables to mitigate CVE-2025-67779 risks
# Security Frequency: 39388170 Hz

set -e

echo "🔐 ScrollVerse Environment Variable Rotation Script"
echo "Security Frequency: 39388170 Hz"
echo "=================================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Timestamp for backup
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="./backups/env"

# Function to generate secure random string
generate_secret() {
    openssl rand -base64 $1 | tr -d "=+/" | cut -c1-$1
}

# Function to backup current .env
backup_env() {
    if [ -f .env ]; then
        mkdir -p $BACKUP_DIR
        cp .env "$BACKUP_DIR/.env.backup.$TIMESTAMP"
        echo -e "${GREEN}✅ Backed up current .env to $BACKUP_DIR/.env.backup.$TIMESTAMP${NC}"
    else
        echo -e "${YELLOW}⚠️  No .env file found, will create from .env.example${NC}"
        if [ -f .env.example ]; then
            cp .env.example .env
            echo -e "${GREEN}✅ Created .env from .env.example${NC}"
        else
            echo -e "${RED}❌ No .env.example found. Please create .env manually.${NC}"
            exit 1
        fi
    fi
}

# Function to rotate a secret in .env
rotate_secret() {
    local key=$1
    local length=$2
    local new_value=$(generate_secret $length)
    
    if grep -q "^${key}=" .env; then
        # macOS compatible sed
        if [[ "$OSTYPE" == "darwin"* ]]; then
            sed -i '' "s|^${key}=.*|${key}=${new_value}|" .env
        else
            sed -i "s|^${key}=.*|${key}=${new_value}|" .env
        fi
        echo -e "${GREEN}✅ Rotated ${key}${NC}"
    else
        echo "${key}=${new_value}" >> .env
        echo -e "${GREEN}✅ Added ${key}${NC}"
    fi
}

# Function to display rotation summary
show_summary() {
    echo ""
    echo "=================================================="
    echo "🎉 Environment Variable Rotation Complete!"
    echo "=================================================="
    echo ""
    echo -e "${YELLOW}⚠️  IMPORTANT NEXT STEPS:${NC}"
    echo ""
    echo "1. Update GitHub Secrets:"
    echo "   - Go to: Settings → Secrets and variables → Actions"
    echo "   - Update: SECRET_KEY, JWT_SECRET, etc."
    echo ""
    echo "2. Restart all services:"
    echo "   - Backend: cd backend && npm restart"
    echo "   - Frontend: cd frontend && npm restart"
    echo "   - Flask app: python app.py"
    echo ""
    echo "3. Update deployment configurations:"
    echo "   - Vercel environment variables"
    echo "   - Docker compose files"
    echo "   - CI/CD pipeline secrets"
    echo ""
    echo "4. Verify functionality:"
    echo "   - Test authentication"
    echo "   - Test API endpoints"
    echo "   - Test wallet connections"
    echo ""
    echo -e "${GREEN}Backup Location: $BACKUP_DIR/.env.backup.$TIMESTAMP${NC}"
    echo ""
    echo "❤️🔥 Security Frequency: 39388170 Hz Active"
}

# Main execution
echo "Starting environment variable rotation..."
echo ""

# Backup current environment
backup_env

echo ""
echo "🔄 Rotating secrets..."
echo ""

# Rotate main application secrets
rotate_secret "SECRET_KEY" 32
rotate_secret "JWT_SECRET" 64

# Rotate database credentials (if present)
if grep -q "^DB_PASSWORD=" .env; then
    rotate_secret "DB_PASSWORD" 32
fi

# Note: DO NOT rotate blockchain-related keys automatically
echo ""
echo -e "${YELLOW}⚠️  Blockchain Keys NOT Rotated (manual action required):${NC}"
echo "   - ETH_PRIVATE_KEY"
echo "   - WALLET_PRIVATE_KEY"
echo "   - SIGNER_PRIVATE_KEY"
echo ""
echo "   These must be rotated manually with extreme caution!"

# Show completion summary
show_summary

exit 0
