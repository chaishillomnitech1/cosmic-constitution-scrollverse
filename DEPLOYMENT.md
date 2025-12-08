# Deployment Guide - Cosmic Constitution ScrollVerse

## 🔱 Phase 2 Deployment with Vercel + GitHub Integration

This guide covers deploying the Cosmic Constitution ScrollVerse application to Vercel with automated CI/CD pipelines.

## Prerequisites

- GitHub account with repository access
- Vercel account connected to GitHub
- Required API keys and secrets (see Environment Variables section)

## Vercel Deployment

### Initial Setup

1. **Connect Repository to Vercel**
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Click "Add New Project"
   - Import the `cosmic-constitution-scrollverse` repository
   - Select the repository and click "Import"

2. **Configure Project Settings**
   - Framework Preset: `Other`
   - Root Directory: `./`
   - Build Command: (leave empty for Python apps)
   - Output Directory: (leave empty)
   - Install Command: `pip install -r requirements.txt`

3. **Environment Variables**
   Add the following environment variables in Vercel dashboard:
   
   **Required:**
   - `SECRET_KEY` - Flask secret key for session management
   - `DEBUG` - Set to `False` for production
   - `ETH_RPC_URL` - Ethereum RPC endpoint (e.g., Infura)
   - `ETH_VAULT_ADDRESS` - Treasury vault Ethereum address
   - `NFT_CONTRACT_ADDRESS` - NFT contract address
   - `IPFS_GATEWAY` - IPFS gateway URL (default: https://ipfs.io/ipfs/)

4. **Deploy**
   - Click "Deploy"
   - Wait for the build and deployment to complete
   - Visit the provided URL to access your application

### Automatic Deployments

Once connected, Vercel will automatically:
- Deploy on every push to the main branch (production)
- Create preview deployments for pull requests
- Run the GitHub Actions workflows configured in `.github/workflows/`

## GitHub Actions Workflows

The Phase 2 rollout includes several automated workflows:

### 1. Vercel Deploy (`vercel-deploy.yml`)
- Triggers on push to main and pull requests
- Deploys to Vercel automatically
- Runs preview deployments for PRs

### 2. E2E Tests (`e2e.yml`)
- Runs end-to-end tests on deployments
- Validates API endpoints and functionality
- Ensures deployment health

### 3. AI PR Bot (`ai-pr-bot.yml`)
- Reviews pull requests automatically
- Provides code quality feedback
- Suggests improvements

### 4. Reward and Mint (`reward-and-mint.yml`)
- Handles OmniRewards contract interactions
- Mints rewards for contributions
- Manages reward distribution

### 5. Repo Sync (`repo-sync.yml`)
- Synchronizes with hub repositories
- Maintains consistency across repos
- Propagates updates

## Environment Variables Reference

### Application Secrets
```bash
# Flask Configuration
SECRET_KEY=your-secret-key-here
DEBUG=False

# Ethereum Configuration
ETH_RPC_URL=https://mainnet.infura.io/v3/YOUR_INFURA_KEY
ETH_VAULT_ADDRESS=0x...
NFT_CONTRACT_ADDRESS=0x...
IPFS_GATEWAY=https://ipfs.io/ipfs/

# Treasury Configuration
TREASURY_UPDATE_INTERVAL=60
RESONANCE_UPDATE_INTERVAL=5
```

### CI/CD Secrets (GitHub Repository Secrets)
```bash
# Vercel Integration
VERCEL_TOKEN=your-vercel-token
VERCEL_ORG_ID=your-org-id
VERCEL_PROJECT_ID=your-project-id

# AI PR Bot
OPENAI_API_KEY=sk-...

# Rewards System (Test/Pilot)
REWARDS_PRIVATE_KEY=0x...
REWARDS_CONTRACT_ADDRESS=0x...
REWARDS_RPC_URL=https://...

# Repo Sync
GITHUB_PAT=ghp_...
```

## Setting GitHub Secrets

1. Go to repository Settings → Secrets and variables → Actions
2. Click "New repository secret"
3. Add each required secret from the list above
4. Save and verify workflows can access them

## Post-Deployment Checklist

- [ ] Verify Vercel deployment is successful
- [ ] Test application endpoints
- [ ] Confirm all environment variables are set
- [ ] Test GitHub Actions workflows
- [ ] Verify AI PR Bot is operational
- [ ] Test reward minting (if applicable)
- [ ] Check repo sync functionality
- [ ] Review deployment logs
- [ ] Test rollback procedure
- [ ] Document any deployment-specific configurations

## Monitoring and Maintenance

### Vercel Dashboard
- Monitor deployment status
- View build logs
- Check analytics and performance
- Manage environment variables

### GitHub Actions
- Review workflow runs
- Check for failed builds
- Monitor PR automation
- Track reward distribution

## Troubleshooting

### Common Issues

**Build Failures:**
- Check Python dependencies in `requirements.txt`
- Verify all environment variables are set
- Review Vercel build logs

**Runtime Errors:**
- Check application logs in Vercel dashboard
- Verify environment variable values
- Test endpoints individually

**Workflow Failures:**
- Review GitHub Actions logs
- Verify secrets are properly configured
- Check workflow YAML syntax

## Rollback Procedure

If a deployment causes issues:

1. Go to Vercel dashboard
2. Find the last working deployment
3. Click "Promote to Production"
4. Alternatively, revert the Git commit and push

## Support

For issues or questions:
- Review [SECURITY.md](./SECURITY.md) for security protocols
- Check [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) for API reference
- Contact: @chaishillomnitech1

---

❤️🔥🧬💫🌌 Forever Deployed. Forever Sovereign. Forever One.
