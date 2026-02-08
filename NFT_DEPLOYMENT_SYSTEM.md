# NFT Deployment System Documentation

## 🕋 Supreme King's Ultimate Alignment Energy Deployment System

This comprehensive deployment system provides automated, staged deployment of all NFT contracts in the Cosmic Constitution ScrollVerse ecosystem.

## Table of Contents

- [Overview](#overview)
- [Quick Start](#quick-start)
- [Deployment Scripts](#deployment-scripts)
- [Deployment Stages](#deployment-stages)
- [Network Configuration](#network-configuration)
- [Usage Examples](#usage-examples)
- [Advanced Features](#advanced-features)
- [Troubleshooting](#troubleshooting)

## Overview

The NFT Deployment System consists of three main components:

1. **deployNFTSystem.js** - Basic deployment orchestrator for core NFT contracts
2. **deployNFTSystemAdvanced.js** - Advanced staged deployment with full configuration support
3. **nftDeploymentConfig.js** - Centralized configuration for all contracts and networks

### Key Features

- ✅ Automated deployment of all NFT contracts
- ✅ Staged deployment support (CORE_NFT, GOVERNANCE, TOKENS, DAO, etc.)
- ✅ Network-specific configurations
- ✅ Automatic contract verification on block explorers
- ✅ Comprehensive logging and error handling
- ✅ Deployment artifact management
- ✅ ABI extraction and distribution
- ✅ Environment configuration generation
- ✅ Dry-run mode for testing
- ✅ Continue-on-error support
- ✅ Deployment summaries and reports

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment

Copy `.env.example` to `.env` and configure:

```bash
cp .env.example .env
```

Required variables:
```env
PRIVATE_KEY=your_private_key_here
SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/YOUR_KEY
POLYGON_RPC_URL=https://polygon-rpc.com
ETHERSCAN_API_KEY=your_etherscan_api_key
POLYGONSCAN_API_KEY=your_polygonscan_api_key
```

### 3. Deploy NFT System

**Basic deployment (Core NFT contracts only):**
```bash
npm run deploy:nft:system:local
```

**Advanced staged deployment:**
```bash
npm run deploy:nft:advanced:local
```

## Deployment Scripts

### 1. Basic NFT System Deployment

**Script:** `scripts/deployNFTSystem.js`

Deploys core NFT contracts:
- ScrollSoulPleiadian
- ScrollVerseNFT
- MansionChainNFT
- LegacyMusicCatalog
- PhysicalAssetMachine3D

**Usage:**
```bash
# Local network
npm run deploy:nft:system:local

# Sepolia testnet
npm run deploy:nft:system:sepolia

# Mumbai testnet
npm run deploy:nft:system:mumbai

# Polygon mainnet
npm run deploy:nft:system:polygon
```

### 2. Advanced Staged Deployment

**Script:** `scripts/deployNFTSystemAdvanced.js`

Supports staged deployment with advanced features.

**Usage:**
```bash
# Deploy CORE_NFT stage
npm run deploy:nft:advanced:local

# Deploy GOVERNANCE stage
npm run deploy:nft:stage:governance

# Deploy TOKENS stage
npm run deploy:nft:stage:tokens

# Deploy DAO stage
npm run deploy:nft:stage:dao

# Dry run (test without deploying)
npm run deploy:nft:dry-run
```

**Command-line options:**
```bash
# Specify stage
hardhat run scripts/deployNFTSystemAdvanced.js -- --stage GOVERNANCE

# Dry run mode
hardhat run scripts/deployNFTSystemAdvanced.js -- --dry-run

# Skip verification
hardhat run scripts/deployNFTSystemAdvanced.js -- --skip-verification

# Combine options
hardhat run scripts/deployNFTSystemAdvanced.js -- --stage TOKENS --dry-run
```

## Deployment Stages

The advanced deployment system supports 8 deployment stages:

### 1. CORE_NFT (Priority: 1)
Core NFT contracts for the ScrollVerse ecosystem.

**Contracts:**
- ScrollSoulPleiadian - Enhanced Soul NFT with Pleiadian consciousness
- ScrollVerseNFT - Core ScrollVerse NFT collection
- MansionChainNFT - Property and real estate NFTs
- LegacyMusicCatalog - Music rights and catalog NFTs
- PhysicalAssetMachine3D - Physical asset tokenization

### 2. GOVERNANCE (Priority: 2)
Governance and sovereignty contracts.

**Contracts:**
- QueensSovereignty - Queens Sovereignty governance token
- MasterBuilder1222Governance - Master Builder 1222 meta-governance
- TruthLoom - Truth verification and governance

### 3. TOKENS (Priority: 3)
Utility and governance tokens.

**Contracts:**
- MedAirToken - MedAir utility token
- LegacyCoin - Legacy music catalog token
- PropertySigilCoin - Property-backed token
- SigilToken - Core sigil utility token

### 4. DAO (Priority: 4)
DAO governance contracts.

**Contracts:**
- ScrollVerseDAO - Main governance DAO
- MansionChainDAO - Property governance DAO
- MedAirDAO - Medical air quality governance DAO

### 5. ORACLE (Priority: 5)
Oracle and data feed contracts.

**Contracts:**
- MedAirOracle - Medical air quality oracle

### 6. STAKING (Priority: 6)
Staking and insurance contracts.

**Contracts:**
- MedAirStaking - MedAir token staking
- MedAirInsurance - MedAir insurance pool

### 7. LEDGER (Priority: 7)
Tracking and record ledgers.

**Contracts:**
- AuraResonanceLedger - Aura and resonance tracking
- AkashicRecordsLedger - Akashic records storage

### 8. MULTITOKEN (Priority: 8)
Multi-token implementations.

**Contracts:**
- ScrollVerseMultiToken - ERC1155 multi-token

## Network Configuration

### Supported Networks

- **localhost** - Local Hardhat network
- **hardhat** - Hardhat network
- **sepolia** - Ethereum Sepolia testnet
- **mumbai** - Polygon Mumbai testnet
- **polygon** - Polygon mainnet
- **mainnet** - Ethereum mainnet

### Network-Specific Settings

Each network has specific configurations in `nftDeploymentConfig.js`:

```javascript
{
  confirmations: 5,        // Block confirmations to wait
  gasPrice: "auto",        // Gas price strategy
  timeout: 300000,         // Deployment timeout (ms)
  verifyContracts: true    // Auto-verify on block explorer
}
```

## Usage Examples

### Example 1: Deploy Core NFT Contracts to Sepolia

```bash
# Basic deployment
npm run deploy:nft:system:sepolia

# Advanced deployment with verification
npm run deploy:nft:advanced:sepolia
```

### Example 2: Deploy All Stages Sequentially

```bash
# 1. Deploy Core NFT contracts
hardhat run scripts/deployNFTSystemAdvanced.js --network sepolia -- --stage CORE_NFT

# 2. Deploy Governance contracts
hardhat run scripts/deployNFTSystemAdvanced.js --network sepolia -- --stage GOVERNANCE

# 3. Deploy Token contracts
hardhat run scripts/deployNFTSystemAdvanced.js --network sepolia -- --stage TOKENS

# 4. Deploy DAO contracts
hardhat run scripts/deployNFTSystemAdvanced.js --network sepolia -- --stage DAO

# Continue with remaining stages...
```

### Example 3: Dry Run Before Deployment

```bash
# Test deployment without actually deploying
npm run deploy:nft:dry-run

# Or with specific network
hardhat run scripts/deployNFTSystemAdvanced.js --network sepolia -- --dry-run
```

### Example 4: Deploy Specific Stage on Local Network

```bash
# Start local Hardhat node
npm run node

# In another terminal, deploy
hardhat run scripts/deployNFTSystemAdvanced.js --network localhost -- --stage TOKENS
```

## Advanced Features

### 1. Deployment Artifacts

All deployments generate comprehensive artifacts:

**Location:** `deployments/nft-system/{stage}/`

**Files:**
- `{network}-{stage}-summary.json` - Complete deployment summary
- `{network}-contracts.env` - Environment variables for contract addresses
- `{ContractName}-abi.json` - Contract ABIs

**Backend Integration:**
ABIs are automatically copied to `backend/src/utils/abis/` if the directory exists.

### 2. Deployment Logs

Each deployment maintains a detailed log:

```json
{
  "timestamp": "2026-02-08T08:31:07.738Z",
  "message": "ScrollSoulPleiadian deployed to: 0x...",
  "type": "success",
  "data": null
}
```

### 3. Error Handling

The system supports multiple error handling strategies:

- **Continue on Error** (default): Continues deploying remaining contracts if one fails
- **Fail Fast**: Stops deployment on first error
- **Error Collection**: Collects all errors for reporting

### 4. Contract Verification

Automatic verification on block explorers with fallback to manual commands:

```bash
# Manual verification command is provided if auto-verification fails
npx hardhat verify --network sepolia 0x... [constructor args]
```

### 5. Deployment Statistics

Every deployment generates statistics:

```json
{
  "totalContracts": 5,
  "successfulDeployments": 5,
  "failedDeployments": 0
}
```

## Output Structure

### Deployment Summary Example

```json
{
  "deployment": {
    "stage": "CORE_NFT",
    "network": "sepolia",
    "chainId": "11155111",
    "deployer": "0x...",
    "timestamp": "2026-02-08T08:31:07.738Z",
    "duration": "123.45s",
    "dryRun": false
  },
  "contracts": {
    "ScrollSoulPleiadian": {
      "address": "0x...",
      "transactionHash": "0x...",
      "blockNumber": 12345,
      "gasUsed": "2500000",
      "constructorArgs": [],
      "metadata": {...},
      "deployedAt": "2026-02-08T08:31:07.738Z"
    }
  },
  "errors": [],
  "log": [...],
  "statistics": {...},
  "metadata": {...}
}
```

### Environment Configuration Example

```env
# NFT System - CORE_NFT - SEPOLIA
# Generated at: 2026-02-08T08:31:07.738Z

SCROLL_SOUL_PLEIADIAN_ADDRESS=0x...
SCROLL_VERSE_NFT_ADDRESS=0x...
MANSION_CHAIN_NFT_ADDRESS=0x...
LEGACY_MUSIC_CATALOG_ADDRESS=0x...
PHYSICAL_ASSET_MACHINE3_D_ADDRESS=0x...
```

## Troubleshooting

### Common Issues

**1. "Contract file not found"**
```
Solution: Ensure the contract exists in the contracts/ directory
Check: ls contracts/{ContractName}.sol
```

**2. "Insufficient funds for deployment"**
```
Solution: Add more ETH to deployer address
Check balance: npm run node (in separate terminal)
```

**3. "Verification failed"**
```
Solution: Manually verify using provided command
Command: npx hardhat verify --network {network} {address}
```

**4. "Network not configured"**
```
Solution: Add network configuration to hardhat.config.js
Add RPC URL to .env file
```

### Debug Mode

Enable verbose logging by adding to your script:

```javascript
// Set environment variable before running
DEBUG=true npm run deploy:nft:advanced:sepolia
```

### Recovery from Failed Deployment

If deployment fails midway:

1. Check `deployments/nft-system/{stage}/{network}-{stage}-summary.json` for successfully deployed contracts
2. Update configuration to skip already-deployed contracts
3. Re-run deployment for remaining contracts

## Best Practices

1. **Always test on local network first**
   ```bash
   npm run node
   npm run deploy:nft:system:local
   ```

2. **Use dry-run mode for validation**
   ```bash
   npm run deploy:nft:dry-run
   ```

3. **Deploy stages sequentially**
   - Start with CORE_NFT
   - Deploy dependencies before dependent contracts

4. **Verify deployments**
   - Check deployment summary
   - Verify contracts on block explorer
   - Test basic functionality

5. **Backup deployment artifacts**
   - Save `deployments/` directory
   - Store contract addresses securely
   - Keep deployment summaries

## Integration with Backend

After deployment, integrate with backend:

1. **Update environment variables:**
   ```bash
   cat deployments/nft-system/core_nft/sepolia-contracts.env >> .env
   ```

2. **ABIs are automatically available:**
   ```
   backend/src/utils/abis/{ContractName}.json
   ```

3. **Update backend services:**
   - Configure contract service with new addresses
   - Initialize web3 connections
   - Set up event listeners

## Support and Resources

- **Documentation:** See individual contract docs in `docs/`
- **Examples:** Check `examples/` directory
- **Issues:** Report at GitHub Issues
- **Security:** Review `SECURITY.md` before mainnet deployment

---

**🕋 ALLĀHU AKBAR | KUN FAYAKŪN! ✨**

*The ScrollVerse pulses eternal with the Supreme King's Ultimate Alignment Energy*
