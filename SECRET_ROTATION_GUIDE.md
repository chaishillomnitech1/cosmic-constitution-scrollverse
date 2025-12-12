# Secret Rotation and Deployment Security Guide

**Sacred Frequency: 39388170 Hz**  
**Security Protocol: React2Shell Mitigation**

## Overview

This guide provides comprehensive procedures for rotating secrets and securing deployments in response to the React2Shell security bulletin and as part of ongoing security best practices for the Cosmic Constitution ScrollVerse.

## Table of Contents

1. [When to Rotate Secrets](#when-to-rotate-secrets)
2. [Environment Variables Inventory](#environment-variables-inventory)
3. [Secret Rotation Procedures](#secret-rotation-procedures)
4. [Vercel Deployment Security](#vercel-deployment-security)
5. [Validation and Testing](#validation-and-testing)
6. [Incident Response](#incident-response)

## When to Rotate Secrets

### Immediate Rotation Required
- ✅ After any security vulnerability disclosure affecting your infrastructure
- ✅ Suspected or confirmed secret compromise
- ✅ Employee/contractor offboarding with secret access
- ✅ After React2Shell bulletin (if exposed before Dec 4, 2024)
- ✅ Public exposure of secrets in logs, repositories, or communications

### Scheduled Rotation (Best Practice)
- 📅 Every 90 days for all production secrets
- 📅 Every 180 days for development/staging secrets
- 📅 Immediately after major version upgrades
- 📅 Before and after significant infrastructure changes

### Optional Rotation
- After successful security audits
- During planned maintenance windows
- As part of compliance requirements

## Environment Variables Inventory

### Production Secrets (`.vercel.json`)

#### 1. `SECRET_KEY`
- **Purpose:** Flask application secret key for session management
- **Sensitivity:** HIGH - Critical for security
- **Rotation Priority:** IMMEDIATE if compromised
- **Generation Method:** Cryptographically secure random string

#### 2. `ETH_RPC_URL`
- **Purpose:** Ethereum RPC endpoint URL
- **Sensitivity:** MEDIUM - Provides blockchain access
- **Rotation Priority:** HIGH if exposed
- **Provider:** Infura, Alchemy, or custom node

#### 3. `ETH_VAULT_ADDRESS`
- **Purpose:** Ethereum vault smart contract address
- **Sensitivity:** LOW - Public blockchain address
- **Rotation Priority:** N/A (cannot rotate address)
- **Note:** If compromised, deploy new contract

#### 4. `NFT_CONTRACT_ADDRESS`
- **Purpose:** NFT smart contract address
- **Sensitivity:** LOW - Public blockchain address
- **Rotation Priority:** N/A (cannot rotate address)
- **Note:** If compromised, deploy new contract

### Additional Secrets (Not in .vercel.json)

#### 5. Private Keys / Wallet Seeds
- **Location:** Secure key management system (NOT in code)
- **Sensitivity:** CRITICAL
- **Rotation Priority:** IMMEDIATE if suspected compromise
- **Storage:** Hardware wallet or secure key vault

#### 6. API Keys (Third-party services)
- **Services:** IPFS, monitoring, analytics
- **Sensitivity:** MEDIUM to HIGH
- **Rotation Priority:** HIGH
- **Provider-specific:** Follow provider rotation procedures

## Secret Rotation Procedures

### Step-by-Step Rotation Process

#### Phase 1: Preparation (15-30 minutes)

1. **Create Rotation Checklist**
   ```
   [ ] Document current secret inventory
   [ ] Schedule maintenance window (if needed)
   [ ] Notify team members
   [ ] Backup current configuration
   [ ] Test rollback procedures
   ```

2. **Generate New Secrets**
   ```bash
   # Generate new SECRET_KEY (Python Flask)
   python3 -c 'import secrets; print(secrets.token_hex(32))'
   
   # Or using OpenSSL
   openssl rand -hex 32
   ```

3. **Verify New Secret Format**
   - Ensure proper length and character set
   - Test in development environment first
   - Document generation timestamp

#### Phase 2: Implementation (30-60 minutes)

1. **Update Vercel Environment Variables**
   
   **Via Vercel Dashboard:**
   ```
   1. Go to https://vercel.com/dashboard
   2. Select: cosmic-constitution-scrollverse project
   3. Navigate to: Settings → Environment Variables
   4. For each secret:
      a. Click "Edit" on the variable
      b. Update with new value
      c. Select environments (Production, Preview, Development)
      d. Save changes
   ```
   
   **Via Vercel CLI:**
   ```bash
   # Install Vercel CLI if not present
   npm i -g vercel
   
   # Login to Vercel
   vercel login
   
   # Add new environment variable
   vercel env add SECRET_KEY production
   # Paste new secret when prompted
   
   # For ETH_RPC_URL
   vercel env add ETH_RPC_URL production
   # Paste new RPC URL when prompted
   ```

2. **Update Local Development Environment**
   ```bash
   # Update .env file (NOT committed to git)
   cd /home/runner/work/cosmic-constitution-scrollverse/cosmic-constitution-scrollverse
   
   # Edit .env file
   nano .env
   
   # Update values:
   SECRET_KEY=<new-secret-key>
   ETH_RPC_URL=<new-rpc-url>
   ```

3. **Update CI/CD Secrets (GitHub Actions)**
   ```
   1. Go to: Repository → Settings → Secrets and variables → Actions
   2. Update each secret:
      - Click "Update" on existing secret
      - Enter new value
      - Save
   ```

#### Phase 3: Deployment (15-30 minutes)

1. **Trigger Redeployment**
   ```bash
   # Via Vercel CLI
   vercel --prod
   
   # Or trigger via Git push
   git commit --allow-empty -m "Trigger redeploy after secret rotation"
   git push origin main
   ```

2. **Monitor Deployment**
   ```
   - Check Vercel deployment logs
   - Verify successful build
   - Monitor for errors
   ```

#### Phase 4: Validation (15-30 minutes)

1. **Test Application Functionality**
   ```
   ✓ User authentication works
   ✓ API endpoints respond correctly
   ✓ Blockchain interactions succeed
   ✓ NFT minting/transfers work
   ✓ Treasury operations functional
   ```

2. **Verify Secret Usage**
   ```bash
   # Check logs for authentication errors
   vercel logs --follow
   
   # Test API endpoints
   curl https://cosmic-constitution-scrollverse.vercel.app/api/health
   ```

3. **Security Verification**
   ```
   ✓ Old secrets no longer work
   ✓ New secrets properly encrypted in transit
   ✓ No secrets exposed in logs
   ✓ Environment variables properly loaded
   ```

#### Phase 5: Cleanup (15 minutes)

1. **Deactivate Old Secrets**
   - Revoke old API keys from providers
   - Remove old secrets from all systems
   - Document rotation in security log

2. **Update Documentation**
   ```
   - Record rotation date
   - Update secret inventory
   - Note any issues encountered
   - Document lessons learned
   ```

3. **Notify Stakeholders**
   ```
   - Confirm successful rotation
   - Provide new access credentials (if applicable)
   - Update runbooks/procedures
   ```

## Vercel Deployment Security

### Enable Standard Protection

**For Non-Production Deployments:**

1. **Navigate to Vercel Dashboard**
   ```
   Project → Settings → Security
   ```

2. **Enable Standard Protection**
   - Toggle ON "Standard Protection"
   - Configure authentication method:
     * Password protection
     * SSO (if available)
     * GitHub/GitLab authentication

3. **Configure Protection Rules**
   ```yaml
   Protection Settings:
     - Preview Deployments: Protected
     - Development Branches: Protected
     - Authentication: Required
     - IP Allowlist: Optional
   ```

### Audit Shareable Deployment Links

1. **List All Deployment URLs**
   ```bash
   vercel list
   ```

2. **Review Preview Deployments**
   ```
   - Check for public preview URLs
   - Verify protection is enabled
   - Remove unnecessary deployments
   ```

3. **Delete Old/Unused Deployments**
   ```bash
   # Via Vercel CLI
   vercel remove [deployment-url]
   
   # Or via Dashboard
   Deployments → Select deployment → Delete
   ```

### Implement Vercel WAF Rules

**Note:** WAF requires Enterprise plan, but general security headers can be added:

1. **Add Security Headers** (in `vercel.json`)
   ```json
   {
     "headers": [
       {
         "source": "/(.*)",
         "headers": [
           {
             "key": "X-Frame-Options",
             "value": "DENY"
           },
           {
             "key": "X-Content-Type-Options",
             "value": "nosniff"
           },
           {
             "key": "X-XSS-Protection",
             "value": "1; mode=block"
           },
           {
             "key": "Referrer-Policy",
             "value": "strict-origin-when-cross-origin"
           },
           {
             "key": "Permissions-Policy",
             "value": "geolocation=(), microphone=(), camera=()"
           }
         ]
       }
     ]
   }
   ```

2. **Enable Rate Limiting**
   - Available via Vercel Edge Config
   - Implement in API routes
   - Monitor for abuse patterns

## Validation and Testing

### Pre-Deployment Testing Checklist

```bash
# 1. Test Flask application locally
cd /home/runner/work/cosmic-constitution-scrollverse/cosmic-constitution-scrollverse
export SECRET_KEY="<new-secret>"
export ETH_RPC_URL="<new-rpc-url>"
python app.py

# 2. Test frontend build
cd frontend
npm run build

# 3. Run security scan
bash scripts/react2shell-security-scan.sh

# 4. Check for exposed secrets
git secrets --scan
```

### Post-Deployment Validation

```bash
# 1. Health check
curl https://cosmic-constitution-scrollverse.vercel.app/api/health

# 2. Test authentication
# (Include actual API test calls)

# 3. Monitor logs
vercel logs --follow

# 4. Performance check
# Monitor response times and error rates
```

## Incident Response

### If Secrets Are Compromised

1. **IMMEDIATE Actions (Within 1 hour)**
   ```
   [ ] Rotate ALL affected secrets immediately
   [ ] Review access logs for unauthorized activity
   [ ] Disable compromised accounts/keys
   [ ] Alert security team
   [ ] Document incident details
   ```

2. **SHORT-TERM Actions (Within 24 hours)**
   ```
   [ ] Complete full secret rotation
   [ ] Investigate root cause
   [ ] Patch vulnerability
   [ ] Enhanced monitoring
   [ ] Notify affected parties (if required)
   ```

3. **LONG-TERM Actions (Within 1 week)**
   ```
   [ ] Post-incident review
   [ ] Update security procedures
   [ ] Implement additional safeguards
   [ ] Security training for team
   [ ] Document lessons learned
   ```

### Rollback Procedures

If rotation causes issues:

```bash
# 1. Restore previous secrets in Vercel
vercel env add SECRET_KEY production
# Enter previous value

# 2. Redeploy with previous configuration
vercel --prod

# 3. Investigate and fix issues
# 4. Attempt rotation again after fix
```

## Automation Scripts

### Automated Secret Rotation Script

```bash
#!/bin/bash
# scripts/rotate-secrets.sh

set -e

echo "🔱 Secret Rotation Script - Sacred Frequency: 39388170 Hz"

# Generate new SECRET_KEY
NEW_SECRET_KEY=$(python3 -c 'import secrets; print(secrets.token_hex(32))')

echo "Generated new SECRET_KEY: ${NEW_SECRET_KEY:0:10}..."

# Prompt for confirmation
read -p "Proceed with rotation? (yes/no): " confirm
if [ "$confirm" != "yes" ]; then
    echo "Rotation cancelled"
    exit 0
fi

# Update Vercel environment variables
echo "Updating Vercel environment variables..."
echo $NEW_SECRET_KEY | vercel env add SECRET_KEY production

echo "✅ Secret rotation completed"
echo "⚠️  Please redeploy the application"
```

## Security Best Practices

### Do's
✅ Use cryptographically secure random generators  
✅ Store secrets in secure vault systems  
✅ Rotate secrets regularly  
✅ Audit secret access logs  
✅ Use different secrets for different environments  
✅ Document all rotation activities  
✅ Test in non-production first  

### Don'ts
❌ Never commit secrets to git  
❌ Never log secrets  
❌ Never share secrets via unsecured channels  
❌ Never use same secrets across environments  
❌ Never skip validation after rotation  
❌ Never rotate all secrets simultaneously without testing  

## Compliance and Auditing

### Rotation Log Template

```
Secret Rotation Log
==================
Date: YYYY-MM-DD HH:MM:SS UTC
Rotated By: [Name/System]
Reason: [Scheduled/Incident/Vulnerability]
Secrets Rotated:
  - SECRET_KEY: Rotated
  - ETH_RPC_URL: Rotated
  - [Others]
Validation: [Passed/Failed]
Issues: [None/Description]
Next Rotation: YYYY-MM-DD
```

### Audit Questions

- When was the last rotation?
- Who has access to production secrets?
- Are secrets encrypted at rest and in transit?
- Is rotation documented and tested?
- Are old secrets properly deactivated?

## Emergency Contacts

### Security Incident Response Team
- **Primary:** Supreme Security Council
- **Frequency:** 39388170 Hz
- **Escalation:** Supreme King Chais Kenyatta Hill

### Provider Support
- **Vercel:** https://vercel.com/support
- **GitHub:** https://support.github.com
- **Blockchain RPC Provider:** [Your provider support]

---

**Sacred Frequency: 39388170 Hz**  
**Security Protocol: ACTIVE**  
❤️🔥🧬💫🌌 **Forever Protected. Forever Sacred. Forever Secure.**
