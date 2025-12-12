---
name: Vercel Setup and Configuration
about: Track Vercel deployment setup and configuration tasks
title: '[VERCEL] Setup deployment for [PROJECT_NAME]'
labels: 'deployment, infrastructure, vercel'
assignees: 'chaishillomnitech1'
---

## 🚀 Vercel Deployment Setup

### Project Information
- **Project Name:** 
- **Repository:** chaishillomnitech1/cosmic-constitution-scrollverse
- **Branch:** main
- **Framework:** Python (Flask)

### Setup Checklist

#### Initial Configuration
- [ ] Connect repository to Vercel account
- [ ] Configure project settings
  - [ ] Set framework preset to `Other`
  - [ ] Set root directory to `./`
  - [ ] Configure build settings
- [ ] Set up custom domain (if applicable)
- [ ] Configure deployment regions

#### Environment Variables (Vercel Dashboard)
Core application secrets to add in Vercel:

- [ ] `SECRET_KEY` - Flask secret key
- [ ] `DEBUG` - Set to `False`
name: Vercel Setup Request
about: Request Vercel deployment setup for the Cosmic Constitution ScrollVerse
title: '[VERCEL] Setup deployment for [environment]'
labels: deployment, vercel, infrastructure
assignees: chaishillomnitech1
---

## 🚀 Vercel Deployment Setup Request

### Environment
<!-- Select the deployment environment -->
- [ ] Production
- [ ] Preview
- [ ] Development

### Required Information

#### Vercel Project Details
- **Project Name**: cosmic-constitution-scrollverse
- **Organization**: 
- **Region Preference**: `iad1` (US East) or specify other

#### GitHub Integration
- **Repository**: chaishillomnitech1/cosmic-constitution-scrollverse
- **Branch for Production**: main
- **Branch for Preview**: [specify if different]

### Required Secrets

Please confirm the following secrets are configured in:
1. **Vercel Project Settings** → Environment Variables
2. **GitHub Repository Settings** → Secrets and variables → Actions

#### Vercel Environment Variables
- [ ] `SECRET_KEY` - Flask secret key
- [ ] `DEBUG` - Set to `False` for production
- [ ] `ETH_RPC_URL` - Ethereum RPC endpoint
- [ ] `ETH_VAULT_ADDRESS` - Treasury vault address
- [ ] `NFT_CONTRACT_ADDRESS` - NFT contract address
- [ ] `IPFS_GATEWAY` - IPFS gateway URL
- [ ] `TREASURY_UPDATE_INTERVAL` - Update interval in seconds
- [ ] `RESONANCE_UPDATE_INTERVAL` - Update interval in seconds

#### GitHub Repository Secrets
CI/CD secrets to add in GitHub Settings → Secrets:

**Vercel Integration:**
- [ ] `VERCEL_TOKEN` - Vercel API token
- [ ] `VERCEL_ORG_ID` - Vercel organization ID
- [ ] `VERCEL_PROJECT_ID` - Vercel project ID

**AI PR Bot:**
- [ ] `OPENAI_API_KEY` - OpenAI API key for AI reviews

**Rewards System (Pilot):**
- [ ] `REWARDS_PRIVATE_KEY` - Private key for rewards contract
- [ ] `REWARDS_CONTRACT_ADDRESS` - OmniRewards contract address
- [ ] `REWARDS_RPC_URL` - RPC URL for rewards network

**Repo Sync:**
- [ ] `GITHUB_PAT` - GitHub Personal Access Token

#### GitHub Actions Workflows
- [ ] Verify `vercel-deploy.yml` is working
- [ ] Verify `e2e.yml` tests pass
- [ ] Verify `ai-pr-bot.yml` is operational
- [ ] Verify `reward-and-mint.yml` is configured
- [ ] Verify `repo-sync.yml` (if applicable)

#### Post-Deployment Verification
- [ ] Test production deployment URL
- [ ] Verify all API endpoints respond correctly
- [ ] Check application logs for errors
- [ ] Test preview deployments on PRs
- [ ] Verify automatic deployment on push to main
- [ ] Test rollback procedure
- [ ] Verify monitoring and alerts

#### Documentation
- [ ] Update README.md with deployment URL
- [ ] Review DEPLOYMENT.md for accuracy
- [ ] Document any custom configuration
- [ ] Add runbook for common issues

### Deployment URLs
- **Production:** 
- **Preview (latest):** 

### Notes
<!-- Add any additional notes, special configurations, or issues encountered -->

### References
- [Vercel Documentation](https://vercel.com/docs)
- [DEPLOYMENT.md](../../DEPLOYMENT.md)
- [Phase 2 PR](#) <!-- Link to Phase 2 rollout PR -->

---

**Assigned to:** @chaishillomnitech1
**Priority:** High
**Phase:** 2 - Rollout

❤️🔥🧬💫🌌 Forever Deployed. Forever Sovereign. Forever One.
#### GitHub Actions Secrets
- [ ] `VERCEL_TOKEN` - Vercel API token
- [ ] `VERCEL_ORG_ID` - Vercel organization ID
- [ ] `VERCEL_PROJECT_ID` - Vercel project ID
- [ ] `OPENAI_API_KEY` - OpenAI API key for AI PR bot
- [ ] `REWARDS_PRIVATE_KEY` - Test wallet private key (Mumbai testnet)
- [ ] `ALCHEMY_MUMBAI_URL` - Alchemy Mumbai RPC endpoint
- [ ] `REWARDS_API_KEY` - Rewards system API key
- [ ] `REWARDS_CONTRACT_ADDRESS` - Rewards contract address
- [ ] `GITHUB_PAT` - GitHub Personal Access Token for repo-sync
- [ ] `PILOT_TEST_WALLET` - Test wallet address for pilot program

### Deployment Configuration

#### Build Settings
- **Framework**: Other (Python/Flask)
- **Build Command**: (none - handled by Python runtime)
- **Output Directory**: (none)
- **Install Command**: `pip install -r requirements.txt`
- **Python Version**: 3.9

#### Domain Settings
- [ ] Custom domain required
  - Domain name: 
  - DNS configuration: 
- [ ] Use Vercel subdomain

### Additional Configuration

#### Monitoring & Alerts
- [ ] Enable Vercel Analytics
- [ ] Configure error tracking
- [ ] Set up performance monitoring
- [ ] Configure deployment notifications

#### Security
- [ ] Enable HTTPS only
- [ ] Configure CORS if needed
- [ ] Set up DDoS protection
- [ ] Configure rate limiting

### Testing Requirements

After deployment, verify:
- [ ] Health check endpoint: `/`
- [ ] API endpoints:
  - [ ] `/api/resonance/status`
  - [ ] `/api/treasury/status`
  - [ ] `/api/governance/status`
- [ ] Dashboard: `/dashboard`
- [ ] Constitution page: `/constitution`
- [ ] 528Hz and 963Hz frequency calculations

### Rollback Plan

In case of deployment issues:
1. [ ] Instant rollback via Vercel dashboard
2. [ ] Git revert procedure documented
3. [ ] Environment variable backup available
4. [ ] Communication plan for stakeholders

### Documentation

- [ ] Update DEPLOYMENT.md with production URLs
- [ ] Document custom configurations
- [ ] Create runbook for common issues
- [ ] Train team on deployment procedures

### Additional Notes

<!-- Add any additional context, requirements, or concerns -->

---

### Pre-deployment Checklist

Before requesting deployment:
- [ ] All code changes merged to target branch
- [ ] All required secrets documented and ready
- [ ] Testing completed on preview deployment
- [ ] Team notified of deployment schedule
- [ ] Rollback plan reviewed and approved

---

**Divine Decree**: This deployment must maintain alignment with the eternal Flame of Creation (528 Hz Love Vortex) and operate under the Sovereign Command Oversight of Supreme King Allah Chais Kenyatta Hill ∞

❤️🔥🧬💫🌌 Forever Deployed. Forever Sacred. Forever One.
