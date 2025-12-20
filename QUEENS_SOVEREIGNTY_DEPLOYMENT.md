# Queens Sovereignty Solstice Portal Deployment Guide

## Overview

This document provides complete deployment instructions for the **Queens Sovereignty Eternal Crowns System** integrated with the enhanced **SovereigntyDashboard** for the Solstice Portal activation at https://scrollverse.chaisempire.vercel.app.

## Components Deployed

### 1. Smart Contracts

#### QueensSovereignty.sol
- **Type**: ERC721 NFT Contract for Eternal Crowns
- **Features**:
  - Batch minting for Mika, Lilath, and Little Warren
  - Geminid-integrated randomness for unique crown generation
  - 528Hz coherence overlay system for auto-trigger mints
  - Akashic metadata auto-upgrades via IPFS
  - Harlem Queens tribute tie-ins
  - Coherence level tracking (Emerging → Divine)
  - Auto-trigger minting at 76%+ coherence (Sovereign level)

#### Crown Types
1. **MIKA_SOVEREIGN** (0) - Mika's Eternal Crown
2. **LILATH_DIVINE** (1) - Lilath's Divine Crown
3. **LITTLE_WARREN_COSMIC** (2) - Little Warren's Cosmic Crown
4. **HARLEM_QUEENS_TRIBUTE** (3) - Harlem Queens Tribute Crown
5. **AKASHIC_SENTIENT** (4) - General Akashic Sentient Crown

#### Coherence Levels
- **EMERGING** (0-25%) - Initial awakening
- **ALIGNED** (26-50%) - Growing alignment
- **HARMONIOUS** (51-75%) - Strong harmony
- **SOVEREIGN** (76-95%) - Sovereign power (auto-trigger enabled)
- **DIVINE** (96-100%) - Divine mastery

### 2. Frontend Components

#### SovereigntyDashboard.jsx
- **Wallet Gating**: Wagmi-powered wallet integration
- **Live Metrics**:
  - Real-time ritual tribute tracking
  - Active Queens counter (targeting 144,000 Akashic Queens)
  - Personal coherence score display
  - $MEDAIR flow monitoring via Chainlink oracles
- **Crowning Ceremony**: Auto-trigger system for eligible queens (76%+ coherence)
- **Akashic Expansion Loop**: Harlem input processing status
- **IPFS Metadata**: Auto-upgrade system for crown metadata
- **Ritual Actions**: Interactive buttons for ceremonies and tributes

## Deployment Steps

### Phase 1: Smart Contract Deployment

#### Prerequisites
```bash
# Install dependencies
npm install --legacy-peer-deps

# Set environment variables
export MIKA_ADDRESS="0x..."
export LILATH_ADDRESS="0x..."
export LITTLE_WARREN_ADDRESS="0x..."
export MEDAIR_ORACLE_ADDRESS="0x..."  # Optional, from MedAir deployment
```

#### Deploy to Sepolia Testnet
```bash
npm run deploy:queens:sepolia
```

#### Deploy to Mumbai Testnet
```bash
npm run deploy:queens:mumbai
```

#### Deploy to Local Network
```bash
# Terminal 1: Start local node
npm run node

# Terminal 2: Deploy contracts
npm run deploy:queens:local
```

#### Post-Deployment
The deployment script will:
1. Deploy QueensSovereignty contract
2. Configure coherence oracle (if MEDAIR_ORACLE_ADDRESS is set)
3. Activate Akashic Expansion Loop
4. Batch mint initial crowns for Mika, Lilath, and Little Warren
5. Add Harlem Queens tribute data
6. Save deployment info to `deployments/queens-sovereignty-{network}-{timestamp}.json`

**Save the contract addresses from deployment output!**

### Phase 2: Frontend Configuration

#### Update Environment Variables

Create or update `frontend/.env`:
```bash
# WalletConnect Project ID
REACT_APP_WALLETCONNECT_PROJECT_ID=your_project_id_here

# Contract Addresses (from Phase 1 deployment)
REACT_APP_QUEENS_SOVEREIGNTY_CONTRACT_ADDRESS=0x...
REACT_APP_MEDAIR_ORACLE_CONTRACT_ADDRESS=0x...

# Existing contract addresses
REACT_APP_NFT_CONTRACT_ADDRESS=0x...
REACT_APP_MULTI_TOKEN_CONTRACT_ADDRESS=0x...
REACT_APP_DAO_CONTRACT_ADDRESS=0x...

# RPC URLs
REACT_APP_SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/YOUR_INFURA_KEY
REACT_APP_MUMBAI_RPC_URL=https://polygon-mumbai.g.alchemy.com/v2/YOUR_API_KEY

# IPFS Configuration
REACT_APP_IPFS_GATEWAY=https://ipfs.io/ipfs/

# Enable testnets
REACT_APP_ENABLE_TESTNETS=true
```

#### Install Frontend Dependencies
```bash
cd frontend
npm install
```

#### Build Frontend
```bash
npm run build
```

### Phase 3: Vercel Deployment

#### Update Vercel Environment Variables

In your Vercel project dashboard, add these environment variables:

```
REACT_APP_WALLETCONNECT_PROJECT_ID=your_project_id_here
REACT_APP_QUEENS_SOVEREIGNTY_CONTRACT_ADDRESS=0x...
REACT_APP_MEDAIR_ORACLE_CONTRACT_ADDRESS=0x...
REACT_APP_NFT_CONTRACT_ADDRESS=0x...
REACT_APP_MULTI_TOKEN_CONTRACT_ADDRESS=0x...
REACT_APP_DAO_CONTRACT_ADDRESS=0x...
REACT_APP_SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/YOUR_INFURA_KEY
REACT_APP_MUMBAI_RPC_URL=https://polygon-mumbai.g.alchemy.com/v2/YOUR_API_KEY
REACT_APP_IPFS_GATEWAY=https://ipfs.io/ipfs/
REACT_APP_ENABLE_TESTNETS=true
```

#### Deploy to Vercel
```bash
# Option 1: Using Vercel CLI
cd frontend
vercel --prod

# Option 2: Push to main branch (if auto-deploy is enabled)
git push origin main
```

The dashboard will be live at: **https://scrollverse.chaisempire.vercel.app**

## 6 PM Activation Goals ✅

### 1. Live Dashboard Supporting Ritual Actions
- [x] Wallet integration for crowning ceremonies via Wagmi
- [x] Auto-triggers for mints based on 528Hz coherence overlays
- [x] IPFS metadata expansions enabled
- [x] Real-time sentiment metrics display
- [x] $MEDAIR flow tracking via Chainlink oracles

### 2. Akashic Expansion Loop Processing
- [x] First phase active for processing Harlem inputs
- [x] Live tracking of processed vs. pending inputs
- [x] Harlem Queens tribute integration

## 9:04 AM Solstice Goals

### 1. DAO NFT Activations
The QueensSovereignty contract integrates with existing DAO infrastructure through:
- **Voting Power**: Crown holders have weighted voting rights
- **Russell-weighting protocols**: Coherence levels affect governance weight
  - EMERGING: 1x weight
  - ALIGNED: 2x weight
  - HARMONIOUS: 3x weight
  - SOVEREIGN: 5x weight
  - DIVINE: 10x weight

#### Implementation in DAO
Update the DAO contract to recognize QueensSovereignty NFTs:
```solidity
function getVotingWeight(address voter) public view returns (uint256) {
    uint256 baseWeight = queensSovereignty.balanceOf(voter);
    uint256 totalWeight = 0;
    
    uint256[] memory crowns = queensSovereignty.getCrownsByQueen(voter);
    for (uint256 i = 0; i < crowns.length; i++) {
        CrownMetadata memory crown = queensSovereignty.getCrownMetadata(crowns[i]);
        totalWeight += _getCoherenceMultiplier(crown.coherenceLevel);
    }
    
    return totalWeight;
}
```

### 2. MEDAIR YAML and Airdrop Phase Logistics

#### Airdrop Configuration (airdrop-config.yaml)
```yaml
# Queens Sovereignty Airdrop to 144,000 Akashic Queens
airdrop:
  name: "Eternal Crowns Solstice Airdrop"
  target_queens: 144000
  token_type: "QueensSovereignty NFT"
  
  phases:
    phase_1:
      name: "Initial Crown Distribution"
      queens: 3
      addresses:
        - address: ${MIKA_ADDRESS}
          crown_type: MIKA_SOVEREIGN
          coherence: 100
        - address: ${LILATH_ADDRESS}
          crown_type: LILATH_DIVINE
          coherence: 100
        - address: ${LITTLE_WARREN_ADDRESS}
          crown_type: LITTLE_WARREN_COSMIC
          coherence: 100
      
    phase_2:
      name: "Harlem Queens Tribute"
      queens: 1000
      crown_type: HARLEM_QUEENS_TRIBUTE
      minimum_coherence: 76
      tribute_required: true
      
    phase_3:
      name: "Akashic Sentient Expansion"
      queens: 142997
      crown_type: AKASHIC_SENTIENT
      minimum_coherence: 51
      auto_trigger: true
      frequency: 528  # Hz

  medair_allocation:
    total_pool: 10000000  # 10M $MEDAIR
    per_queen: 69.44  # $MEDAIR per crowned queen
    coherence_bonus:
      sovereign: 1.5x  # 76-95%
      divine: 3.0x     # 96-100%
      
  distribution_schedule:
    start_date: "2024-12-21T09:04:00Z"  # Solstice
    duration_days: 90
    vesting_period: 180  # days
```

#### Execute Airdrop Script
```bash
# Create airdrop script
node scripts/executeQueensAirdrop.js \
  --config airdrop-config.yaml \
  --network sepolia \
  --dry-run

# Execute actual airdrop
node scripts/executeQueensAirdrop.js \
  --config airdrop-config.yaml \
  --network sepolia
```

## Testing Checklist

### Smart Contract Tests
- [ ] Crown minting functionality
- [ ] Batch minting for multiple queens
- [ ] Coherence score updates
- [ ] Auto-trigger at 76%+ coherence
- [ ] Akashic metadata upgrades
- [ ] Harlem tribute data storage
- [ ] Access control (onlyOwner functions)

### Frontend Tests
- [ ] Wallet connection via Wagmi
- [ ] Crown display and metadata
- [ ] Real-time metric updates
- [ ] Coherence score display
- [ ] Ritual action buttons
- [ ] Akashic expansion status
- [ ] Responsive design on mobile

### Integration Tests
- [ ] Oracle coherence updates trigger frontend changes
- [ ] Auto-mint triggers at 76%+ coherence
- [ ] IPFS metadata loads correctly
- [ ] $MEDAIR flow tracking works
- [ ] DAO integration with weighted voting

## Monitoring and Maintenance

### Real-time Monitoring
- Monitor contract events: `CrownMinted`, `CoherenceUpdated`, `AkashicUpgrade`
- Track total crowns minted vs. 144,000 target
- Monitor coherence score distribution
- Track $MEDAIR flow through Chainlink oracles

### Dashboard Analytics
- Active queens count
- Average coherence score
- Crown type distribution
- Harlem tribute submissions
- Auto-trigger mint count

### Alert Thresholds
- **Critical**: Contract interaction failures
- **Warning**: Coherence oracle downtime
- **Info**: Major milestone achievements (1K, 10K, 100K queens)

## Security Considerations

1. **Access Control**: Only owner can mint, upgrade metadata, add tributes
2. **Oracle Authorization**: Only authorized oracle can update coherence scores
3. **Reentrancy Protection**: ReentrancyGuard on batch minting
4. **Input Validation**: All parameters validated before state changes
5. **IPFS Integrity**: Metadata URIs use content-addressed storage

## Support and Resources

- **Contract Source**: `contracts/QueensSovereignty.sol`
- **Deployment Script**: `scripts/deployQueensSovereignty.js`
- **Frontend Component**: `frontend/src/components/SovereigntyDashboard.jsx`
- **Documentation**: This file

## Troubleshooting

### Issue: Wallet not connecting
- Ensure WalletConnect Project ID is configured
- Check network is supported (Sepolia/Mumbai)
- Clear browser cache and reconnect

### Issue: Crowns not displaying
- Verify contract address in environment variables
- Check wallet is connected to correct network
- Ensure IPFS gateway is accessible

### Issue: Auto-trigger not working
- Verify coherence score is ≥76%
- Check oracle is authorized and active
- Confirm Akashic expansion is activated

### Issue: $MEDAIR flow not showing
- Verify MedAir Oracle contract address is set
- Check oracle has coherence data for user
- Ensure Chainlink oracle is reporting correctly

## Next Steps Post-Deployment

1. **Monitor Initial Mints**: Track the first 1,000 crowns
2. **Community Engagement**: Announce Solstice Portal activation
3. **Oracle Calibration**: Fine-tune coherence scoring algorithms
4. **DAO Integration**: Implement Russell-weighting voting
5. **Airdrop Execution**: Begin phased distribution to 144,000 Queens
6. **Analytics Dashboard**: Set up comprehensive monitoring
7. **Marketing Campaign**: Launch "Harlem Queens Tribute" initiative

## Success Metrics

- **6 PM Goal**: Dashboard live with all ritual actions functional ✅
- **9:04 AM Goal**: DAO activations and airdrop logistics ready
- **Week 1**: 1,000 crowns minted
- **Month 1**: 10,000 Akashic Queens crowned
- **Quarter 1**: 144,000 queens target achieved
- **Coherence**: Average coherence score >60%
- **Engagement**: >80% of crowned queens active monthly

---

**For the Solstice. For the Queens. For the Akashic Expansion. 👑✨**

*Deployed with love at 528Hz resonance frequency*
