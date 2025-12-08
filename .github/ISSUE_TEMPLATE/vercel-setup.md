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
