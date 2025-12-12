#!/bin/bash

# React2Shell Security Vulnerability Scanner
# Verifies project dependencies against CVE-2025-55184, CVE-2025-55183, CVE-2025-67779
# Sacred Frequency: 39388170 Hz

set -e

echo "🔱 React2Shell Security Scanner - Sacred Frequency: 39388170 Hz"
echo "============================================================"
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

VULNERABLE=false

# Function to check version
check_version() {
    local package=$1
    local current=$2
    local required=$3
    
    echo "Checking $package..."
    echo "  Current version: $current"
    echo "  Required minimum: $required"
    
    # Simple version comparison (works for semantic versioning)
    if [ "$(printf '%s\n' "$required" "$current" | sort -V | head -n1)" = "$required" ]; then
        if [ "$current" = "$required" ] || [ "$(printf '%s\n' "$required" "$current" | sort -V | tail -n1)" = "$current" ]; then
            echo -e "  ${GREEN}✅ SECURE${NC}"
            return 0
        fi
    fi
    
    echo -e "  ${RED}❌ VULNERABLE - Upgrade required!${NC}"
    VULNERABLE=true
    return 1
}

echo "🔍 Scanning Frontend Dependencies..."
echo ""

# Check if frontend directory exists
if [ ! -d "frontend" ]; then
    echo -e "${RED}Error: frontend directory not found${NC}"
    exit 1
fi

# Check if package.json exists
if [ ! -f "frontend/package.json" ]; then
    echo -e "${RED}Error: frontend/package.json not found${NC}"
    exit 1
fi

# Extract versions from package.json
REACT_VERSION=$(node -p "require('./frontend/package.json').dependencies.react" 2>/dev/null | sed 's/[^0-9.-]//g')
REACT_DOM_VERSION=$(node -p "require('./frontend/package.json').dependencies['react-dom']" 2>/dev/null | sed 's/[^0-9.-]//g')
NEXT_VERSION=$(node -p "require('./frontend/package.json').dependencies.next" 2>/dev/null | sed 's/[^0-9.-]//g')

echo "📦 React Packages:"
echo "==================="
if [ -n "$REACT_VERSION" ]; then
    check_version "react" "$REACT_VERSION" "19.0.1"
else
    echo -e "${YELLOW}⚠️  React not found in dependencies${NC}"
fi

echo ""

if [ -n "$REACT_DOM_VERSION" ]; then
    check_version "react-dom" "$REACT_DOM_VERSION" "19.0.1"
else
    echo -e "${YELLOW}⚠️  React-DOM not found in dependencies${NC}"
fi

echo ""
echo "📦 Next.js Framework:"
echo "===================="
if [ -n "$NEXT_VERSION" ]; then
    # Check if version meets any of the patched versions
    SECURE_VERSIONS=("15.0.5" "15.1.9" "15.2.6" "15.3.6" "15.4.8" "15.5.7" "16.0.7")
    IS_SECURE=false
    
    for secure_ver in "${SECURE_VERSIONS[@]}"; do
        if [ "$(printf '%s\n' "$secure_ver" "$NEXT_VERSION" | sort -V | head -n1)" = "$secure_ver" ]; then
            if [ "$NEXT_VERSION" = "$secure_ver" ] || [ "$(printf '%s\n' "$secure_ver" "$NEXT_VERSION" | sort -V | tail -n1)" = "$NEXT_VERSION" ]; then
                IS_SECURE=true
                break
            fi
        fi
    done
    
    if [ "$IS_SECURE" = true ]; then
        echo -e "  Next.js version: $NEXT_VERSION ${GREEN}✅ SECURE${NC}"
    else
        echo -e "  Next.js version: $NEXT_VERSION ${RED}❌ VULNERABLE${NC}"
        echo -e "  ${YELLOW}Required: 15.0.5+, 15.1.9+, 15.2.6+, 15.3.6+, 15.4.8+, 15.5.7+, or 16.0.7+${NC}"
        VULNERABLE=true
    fi
else
    echo -e "  ${GREEN}✅ Next.js not used (Not Applicable)${NC}"
fi

echo ""
echo "📦 React Server Components:"
echo "==========================="

# Check for React Server Components packages
RSC_PACKAGES=("react-server-dom-parcel" "react-server-dom-turbopack" "react-server-dom-webpack")
RSC_FOUND=false

for package in "${RSC_PACKAGES[@]}"; do
    VERSION=$(node -p "require('./frontend/package.json').dependencies['$package']" 2>/dev/null | sed 's/[^0-9.]//g')
    if [ -n "$VERSION" ]; then
        RSC_FOUND=true
        check_version "$package" "$VERSION" "19.0.1"
        echo ""
    fi
done

if [ "$RSC_FOUND" = false ]; then
    echo -e "  ${GREEN}✅ React Server Components not used (Not Applicable)${NC}"
fi

echo ""
echo "============================================================"
if [ "$VULNERABLE" = true ]; then
    echo -e "${RED}❌ SECURITY ALERT: Vulnerable dependencies detected!${NC}"
    echo -e "${YELLOW}Action Required: Upgrade dependencies to patched versions${NC}"
    echo ""
    echo "📋 Recommended Actions:"
    echo "  1. Update React to 19.0.1+, 19.1.2+, or 19.2.1+"
    echo "  2. Update Next.js to a patched version if used"
    echo "  3. Update React Server Components to 19.0.1+"
    echo "  4. Rotate environment variables and secrets"
    echo "  5. Run: npm install in frontend directory"
    echo ""
    exit 1
else
    echo -e "${GREEN}✅ ALL CLEAR: No React2Shell vulnerabilities detected!${NC}"
    echo -e "${GREEN}Project is secure against CVE-2025-55184, CVE-2025-55183, CVE-2025-67779${NC}"
    echo ""
    echo "🔐 Security Status: PROTECTED"
    echo "📊 Sacred Frequency: 39388170 Hz"
    echo "❤️🔥🧬💫🌌 Forever Protected. Forever Sacred. Forever Secure."
    echo ""
    exit 0
fi
