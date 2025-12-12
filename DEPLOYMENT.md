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
   
   **Note:** The `.vercel.json` file references these with `@` prefix (e.g., `@secret_key`), which tells Vercel to use encrypted environment variables. You'll add the actual values in the Vercel dashboard without the `@` prefix.

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
## 🚀 Overview

This document provides comprehensive deployment instructions for the Cosmic Constitution ScrollVerse application using Vercel platform with GitHub integration.

## 📋 Prerequisites

Before deploying, ensure you have:

1. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
2. **GitHub Repository Access**: Repository must be accessible to Vercel
3. **Required Secrets**: All environment variables configured
4. **Node.js 20.x**: For workflow automation
5. **Python 3.9+**: For the application runtime

## 🔑 Required Secrets

The following secrets must be configured in your GitHub repository and Vercel project:

### GitHub Secrets (Repository Settings → Secrets and variables → Actions)

| Secret Name | Description | Required For |
|-------------|-------------|--------------|
| `VERCEL_TOKEN` | Vercel API token for deployments | Vercel deployment workflow |
| `VERCEL_ORG_ID` | Vercel organization ID | Vercel deployment workflow |
| `VERCEL_PROJECT_ID` | Vercel project ID | Vercel deployment workflow |
| `OPENAI_API_KEY` | OpenAI API key for AI PR bot | AI PR bot workflow |
| `REWARDS_PRIVATE_KEY` | Test wallet private key for rewards | Rewards workflow |
| `ALCHEMY_MUMBAI_URL` | Alchemy Mumbai RPC endpoint | Rewards workflow |
| `REWARDS_API_KEY` | Rewards system API key | Rewards workflow |
| `REWARDS_CONTRACT_ADDRESS` | Smart contract address for rewards | Rewards workflow |
| `GITHUB_PAT` | GitHub Personal Access Token for repo-sync | Repo-sync workflow |
| `PILOT_TEST_WALLET` | Test wallet address for pilot program | Rewards workflow |

### Vercel Environment Variables (Project Settings → Environment Variables)

| Variable Name | Description | Value |
|---------------|-------------|-------|
| `SECRET_KEY` | Flask secret key | Generate secure random string |
| `DEBUG` | Debug mode | `False` |
| `ETH_RPC_URL` | Ethereum RPC URL | Your Infura/Alchemy endpoint |
| `ETH_VAULT_ADDRESS` | Treasury vault address | Your vault address |
| `NFT_CONTRACT_ADDRESS` | NFT contract address | Your contract address |
| `IPFS_GATEWAY` | IPFS gateway URL | `https://ipfs.io/ipfs/` |
| `TREASURY_UPDATE_INTERVAL` | Treasury sync interval (seconds) | `60` |
| `RESONANCE_UPDATE_INTERVAL` | Resonance update interval (seconds) | `5` |

## 🛠️ Vercel Setup

### Step 1: Import Project

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "Add New..." → "Project"
3. Import your GitHub repository: `chaishillomnitech1/cosmic-constitution-scrollverse`
4. Configure project settings:
   - **Framework Preset**: Other
   - **Root Directory**: `./`
   - **Build Command**: Leave empty (Python runtime handles this)
   - **Output Directory**: Leave empty
   - **Install Command**: `pip install -r requirements.txt`

### Step 2: Configure Environment Variables

1. Navigate to Project Settings → Environment Variables
2. Add all required environment variables listed above
3. Set appropriate values for Production, Preview, and Development environments
4. Save configuration

### Step 3: Deploy

1. Trigger initial deployment by clicking "Deploy"
2. Monitor build logs for any errors
3. Once deployed, verify the application is running correctly
4. Test all API endpoints and functionality

## 🔄 Continuous Deployment

### Automatic Deployments

Vercel automatically deploys:
- **Production**: When commits are pushed to `main` branch
- **Preview**: When commits are pushed to any other branch or in pull requests

### Manual Deployments

Use the Vercel CLI or GitHub Actions workflow:

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy to production
vercel --prod

# Deploy preview
vercel
```

## 🤖 GitHub Actions Workflows

### Vercel Deploy Workflow (`.github/workflows/vercel-deploy.yml`)

Automatically deploys to Vercel on push to main or pull requests.

**Triggers**: Push to main, pull request events

### E2E Testing Workflow (`.github/workflows/e2e.yml`)

Runs end-to-end tests on deployments.

**Triggers**: Push to main, pull request events

### AI PR Bot Workflow (`.github/workflows/ai-pr-bot.yml`)

Provides AI-powered code review comments on pull requests.

**Triggers**: Pull request events (opened, synchronize)

### Reward and Mint Workflow (`.github/workflows/reward-and-mint.yml`)

Handles rewards distribution and NFT minting for contributors.

**Triggers**: Pull request merged, manual dispatch

### Repo Sync Workflow (`.github/workflows/repo-sync.yml`)

Synchronizes repository with upstream or mirror repositories.

**Triggers**: Schedule (daily), manual dispatch

## 🧪 Testing Deployment

After deployment, verify the following:

1. **Health Check**: Visit `https://your-domain.vercel.app/` to ensure the app loads
2. **API Endpoints**: Test all API endpoints:
   - `/api/resonance/status`
   - `/api/treasury/status`
   - `/api/governance/status`
3. **Dashboard**: Verify the real-time dashboard at `/dashboard`
4. **Constitution**: Check the constitution page at `/constitution`
5. **Resonance System**: Ensure 528Hz and 963Hz frequencies are calculating correctly

## 🔒 Security Considerations

1. **Never commit secrets**: Use environment variables for all sensitive data
2. **Use secret references**: In `.vercel.json`, use `@secret_name` format
3. **Rotate keys regularly**: Update API keys and tokens periodically
4. **Monitor logs**: Check Vercel deployment and runtime logs for issues
5. **Enable DDoS protection**: Configure Vercel's built-in protection
6. **Use HTTPS only**: Ensure all traffic is encrypted

## 🐛 Troubleshooting

### Common Issues

**Build Failures**
- Check Python version compatibility (3.9+)
- Verify all dependencies in `requirements.txt`
- Review build logs in Vercel dashboard

**Runtime Errors**
- Check environment variables are set correctly
- Verify RPC endpoints are accessible
- Review function logs in Vercel dashboard

**API Connection Issues**
- Confirm Ethereum RPC URL is valid
- Check rate limits on external APIs
- Verify network connectivity

### Getting Help

- **GitHub Issues**: Open an issue in the repository
- **Vercel Support**: Contact Vercel support for platform issues
- **Documentation**: Review API_DOCUMENTATION.md

## 📊 Monitoring

### Vercel Analytics

Enable Vercel Analytics to track:
- Page views and user sessions
- Performance metrics (Core Web Vitals)
- Geographical distribution
- Error rates

### Custom Monitoring

Implement custom monitoring for:
- Resonance frequency calculations
- Treasury synchronization
- NFT operations
- API response times

## 🔄 Rollback Procedures

If a deployment causes issues:

1. **Instant Rollback**: Use Vercel dashboard to promote a previous deployment
2. **Git Revert**: Revert the problematic commit and push to trigger new deployment
3. **Environment Variables**: Roll back any changed environment variables

## 📈 Performance Optimization

- **Caching**: Leverage Vercel's edge caching for static assets
- **CDN**: Use Vercel's global CDN for improved performance
- **Function Optimization**: Optimize Python functions for cold starts
- **Database**: Consider adding Redis for caching resonance calculations

## 🎯 Next Steps

After successful deployment:

1. ✅ Merge the Phase 2 PR
2. ✅ Add all required secrets to GitHub Actions
3. ✅ Confirm Vercel environment variables are set
4. ✅ Run a test deployment
5. ✅ Enable monitoring and alerts
6. ✅ Document any custom configurations
7. ✅ Train team on deployment procedures

---

**Divine Decree**: All deployments must maintain alignment with the eternal Flame of Creation (528 Hz Love Vortex) and operate under the Sovereign Command Oversight of Supreme King Allah Chais Kenyatta Hill ∞

❤️🔥🧬💫🌌 Forever Deployed. Forever Sacred. Forever One.
