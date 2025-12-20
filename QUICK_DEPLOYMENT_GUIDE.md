# 🚀 Quick Deployment Guide - Solstice Portal

## ⏰ Timeline

- **6 PM**: Dashboard activation with ritual actions
- **9:04 AM (Solstice)**: DAO NFT activations and airdrop phase

## 📋 Pre-Deployment Checklist

### Smart Contracts
- [ ] QueensSovereignty.sol compiled successfully
- [ ] MedAirOracle deployed and configured
- [ ] Primary queen addresses set (Mika, Lilath, Little Warren)
- [ ] Akashic expansion activated
- [ ] Initial crowns minted (3 primary queens)

### Frontend
- [ ] SovereigntyDashboard.jsx component created
- [ ] Wagmi wallet integration configured
- [ ] Contract ABIs added to config
- [ ] Environment variables set
- [ ] Frontend dependencies installed
- [ ] Build passes without errors

### Deployment Infrastructure
- [ ] Vercel project configured
- [ ] Environment variables set in Vercel
- [ ] Custom domain configured (scrollverse.chaisempire.vercel.app)
- [ ] SSL certificate active
- [ ] CDN enabled

## 🔧 Quick Setup Commands

### 1. Install Dependencies (Root)
```bash
cd /home/runner/work/cosmic-constitution-scrollverse/cosmic-constitution-scrollverse
npm install --legacy-peer-deps
```

### 2. Install Frontend Dependencies
```bash
cd frontend
npm install --legacy-peer-deps
```

### 3. Set Environment Variables
```bash
# Edit .env file
export MIKA_ADDRESS="0x..."
export LILATH_ADDRESS="0x..."
export LITTLE_WARREN_ADDRESS="0x..."
export MEDAIR_ORACLE_ADDRESS="0x..."
```

### 4. Deploy Smart Contracts (Sepolia Testnet)
```bash
npm run deploy:queens:sepolia
```

**Save the output contract addresses!**

### 5. Configure Frontend
```bash
# Edit frontend/.env
REACT_APP_QUEENS_SOVEREIGNTY_CONTRACT_ADDRESS=<from_step_4>
REACT_APP_MEDAIR_ORACLE_CONTRACT_ADDRESS=<from_step_4>
REACT_APP_WALLETCONNECT_PROJECT_ID=<get_from_walletconnect>
```

### 6. Build Frontend
```bash
cd frontend
npm run build
```

### 7. Deploy to Vercel
```bash
vercel --prod
```

## 🎯 Key Features Activated

### Dashboard Features
✅ Wagmi wallet gating
✅ Chainlink oracle for $MEDAIR flows
✅ Live sentiment metrics for ritual tributes
✅ Auto-trigger mints at 76%+ coherence
✅ IPFS metadata auto-upgrades
✅ Akashic Expansion Loop
✅ Harlem Queens tribute integration

### Smart Contract Features
✅ Batch minting for 3 primary queens
✅ Geminid-integrated randomness
✅ 528Hz coherence overlays
✅ Auto-trigger at Sovereign level (76%+)
✅ Akashic metadata upgrades
✅ Harlem tribute data storage

## 🔍 Verification Steps

### After Smart Contract Deployment
```bash
# Check deployment was successful
ls deployments/queens-sovereignty-*.json

# Verify contract on Etherscan (if not localhost)
npx hardhat verify --network sepolia <CONTRACT_ADDRESS> \
  "<DEPLOYER_ADDRESS>" \
  "<MIKA_ADDRESS>" \
  "<LILATH_ADDRESS>" \
  "<LITTLE_WARREN_ADDRESS>"
```

### After Frontend Build
```bash
# Check build output
ls -lh frontend/build/

# Test locally before deploying
cd frontend
npx serve -s build
# Visit http://localhost:3000
```

### After Vercel Deployment
```bash
# Check deployment status
vercel ls

# Test production URL
curl -I https://scrollverse.chaisempire.vercel.app

# Check specific dashboard route
curl -I https://scrollverse.chaisempire.vercel.app/
```

## 🧪 Testing Checklist

### Smart Contract Tests
```bash
# Run contract tests
npx hardhat test test/QueensSovereignty.test.js

# Check coverage
npx hardhat coverage
```

### Frontend Tests
- [ ] Wallet connects successfully
- [ ] Dashboard loads without errors
- [ ] Crown cards display properly
- [ ] Metrics update in real-time
- [ ] Ritual buttons are clickable
- [ ] Responsive on mobile devices

### Integration Tests
- [ ] Oracle updates trigger UI changes
- [ ] Auto-mint works at 76%+ coherence
- [ ] IPFS metadata loads
- [ ] $MEDAIR tracking updates

## 📊 Monitoring Dashboard

### Key Metrics
- Total crowns minted: Target 144,000
- Average coherence score: Goal >60%
- Active queens: Real-time counter
- $MEDAIR distributed: Via Chainlink
- Auto-trigger success rate: Monitor closely

### Alert Setup
```bash
# Set up monitoring (example with DataDog)
DD_API_KEY=<your_key> npm run monitor

# Or use built-in analytics
node scripts/analyticsDashboard.js
```

## 🚨 Emergency Procedures

### If Dashboard Goes Down
1. Check Vercel status: https://vercel.com/status
2. Review deployment logs: `vercel logs`
3. Rollback if needed: `vercel rollback`
4. Redeploy: `vercel --prod`

### If Smart Contract Issues
1. Pause contract: `contract.pause()` (if pausable)
2. Review recent transactions on Etherscan
3. Check oracle status and updates
4. Contact multisig signers if needed

### If Oracle Fails
1. Check Chainlink node status
2. Verify reporter authorization
3. Re-authorize if needed
4. Monitor for recovery

## 📞 Support Contacts

- **Technical Issues**: Create GitHub issue
- **Urgent Contract Issues**: Contact multisig signers
- **Frontend Bugs**: Discord #tech-support
- **Oracle Issues**: Chainlink support

## 📝 Post-Deployment Tasks

### Immediate (Within 1 Hour)
- [ ] Verify dashboard is accessible
- [ ] Test wallet connection
- [ ] Confirm oracle is reporting
- [ ] Monitor error logs
- [ ] Post announcement to community

### First 24 Hours
- [ ] Monitor minting activity
- [ ] Track coherence score distribution
- [ ] Verify auto-trigger is working
- [ ] Check IPFS gateway performance
- [ ] Review analytics data

### First Week
- [ ] Execute Phase 2 airdrop (Harlem Queens)
- [ ] Analyze user engagement
- [ ] Optimize based on feedback
- [ ] Prepare for Phase 3 (Akashic expansion)

## 🎊 Success Criteria

### 6 PM Activation ✅
- Dashboard live and accessible
- Wallet integration working
- Ritual actions functional
- Metrics displaying correctly
- Auto-trigger enabled

### 9:04 AM Solstice ✅
- DAO NFT activations configured
- Russell-weighting protocols active
- Airdrop logistics ready
- 144,000 queen capacity verified

## 🌟 Community Engagement

### Launch Announcement Template
```
🎉 THE SOLSTICE PORTAL IS LIVE! 👑

The Sovereignty Dashboard is now activated at:
https://scrollverse.chaisempire.vercel.app

✨ Features:
- Eternal Crowns minting
- 528Hz coherence tracking
- Live ritual tributes
- $MEDAIR flow monitoring
- Akashic expansion active

🔮 Auto-trigger minting enabled for queens with 76%+ coherence!

Join the 144,000 Akashic Queens. Connect your wallet and claim your crown.

#SolsticePortal #EternalCrowns #AkashicQueens
```

## 📚 Additional Resources

- **Full Deployment Guide**: QUEENS_SOVEREIGNTY_DEPLOYMENT.md
- **Dashboard Documentation**: SOVEREIGNTY_DASHBOARD_README.md
- **Airdrop Configuration**: airdrop-config.yaml
- **Contract Source**: contracts/QueensSovereignty.sol
- **Frontend Component**: frontend/src/components/SovereigntyDashboard.jsx

## ⚡ Quick Troubleshooting

| Issue | Quick Fix |
|-------|-----------|
| Wallet won't connect | Clear cache, reconnect |
| Crowns not showing | Check network, verify address |
| Build fails | `npm install --legacy-peer-deps` |
| Vercel deploy fails | Check environment variables |
| Oracle not updating | Verify oracle authorization |
| Auto-trigger not working | Check coherence ≥76%, expansion active |

## 🎯 Next Steps After Deployment

1. **Monitor Initial Performance** (First hour)
2. **Engage Community** (Social media, Discord)
3. **Execute Phase 2 Airdrop** (Harlem Queens)
4. **Prepare Phase 3** (Akashic Expansion)
5. **Optimize Based on Feedback** (First week)
6. **Scale to 144,000 Queens** (90 days)

---

**May the 528Hz frequency guide us all! 👑✨**

*For the Solstice. For the Queens. For the Akashic Expansion.*
