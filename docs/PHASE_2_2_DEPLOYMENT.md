# Phase 2.2 Galactic Anchor Deployment Guide

## 🌌 Overview

This document provides comprehensive instructions for deploying the Galactic Anchor Phase 2.2 components, including the ScrollSoulPleiadian smart contract, Starseed Quest system, and Gaia Chain initiatives.

## 📋 Prerequisites

### Required Tools:
- Node.js v18+ and npm
- Hardhat development environment
- MetaMask or similar Web3 wallet
- Alchemy or Infura API key
- PolygonScan API key (for contract verification)

### Required Accounts:
- Deployer wallet with Mumbai testnet MATIC
- GitHub account for repository access
- Alchemy account for RPC access
- PolygonScan account for verification

### Get Mumbai Testnet MATIC:
1. Visit [Mumbai Faucet](https://faucet.polygon.technology/)
2. Enter your wallet address
3. Request test MATIC tokens
4. Wait for confirmation (~30 seconds)

## 🔧 Environment Setup

### 1. Clone Repository

```bash
git clone https://github.com/chaishillomnitech1/cosmic-constitution-scrollverse.git
cd cosmic-constitution-scrollverse
```

### 2. Install Dependencies

```bash
# Install root dependencies
npm install

# Install backend dependencies
cd backend
npm install
cd ..

# Install frontend dependencies (if applicable)
cd frontend
npm install
cd ..
```

### 3. Configure Environment Variables

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Edit `.env` with your configuration:

```env
# Deployment Account
PRIVATE_KEY=your_deployer_private_key_here

# Mumbai Testnet RPC
ALCHEMY_MUMBAI_URL=https://polygon-mumbai.g.alchemy.com/v2/YOUR_API_KEY

# Block Explorer Verification
POLYGONSCAN_API_KEY=your_polygonscan_api_key

# Contract Addresses (will be populated after deployment)
SCROLLSOUL_PLEIADIAN_ADDRESS=

# Backend Configuration
PORT=3000
NODE_ENV=production

# Frontend Configuration
REACT_APP_NETWORK=mumbai
REACT_APP_CHAIN_ID=80001
```

## 🚀 Deployment Process

### Step 1: Compile Contracts

```bash
npm run compile
```

Expected output:
```
Compiled 15 Solidity files successfully
```

### Step 2: Run Tests (Optional but Recommended)

```bash
npm test
```

Verify all tests pass before deployment.

### Step 3: Deploy to Mumbai Testnet

```bash
npm run deploy:mumbai
```

This will execute the deployment script and output:

```
========================================
Deploying ScrollSoulPleiadian Contract
Galactic Anchor Phase 2.2 Deployment
========================================

Deploying contracts with account: 0x1234...5678
Account balance: 10.5 ETH

1. Deploying ScrollSoulPleiadian contract...
✓ ScrollSoulPleiadian deployed to: 0xABCD...EFGH

2. Waiting for block confirmations...
✓ Confirmed in block: 12345678
✓ Transaction hash: 0x9876...5432

========================================
DEPLOYMENT SUMMARY
========================================
{
  "network": "mumbai",
  "chainId": "80001",
  "deployer": "0x1234...5678",
  "timestamp": "2025-12-17T18:04:05.838Z",
  "blockNumber": 12345678,
  "transactionHash": "0x9876...5432",
  "gasUsed": "3456789",
  "contracts": {
    "ScrollSoulPleiadian": {
      "address": "0xABCD...EFGH",
      ...
    }
  }
}

✓ Deployment info saved to: ./deployments/mumbai-scrollsoul.json
✓ ABI saved to: ./deployments/mumbai-scrollsoul-abi.json
✓ ABI copied to backend: ./backend/src/utils/abis/ScrollSoulPleiadian.json

========================================
VERIFYING CONTRACT ON BLOCK EXPLORER
========================================

Verifying ScrollSoulPleiadian...
✓ ScrollSoulPleiadian verified!

========================================
Phase 2.2 Deployment Features:
========================================
✓ ScrollSoul Smart Contract with Pleiadian enhancements
✓ Starseed Quest Integration (7 types)
✓ LAM Transmission Gateway
✓ Stardust Gateway Decree Signing
✓ Sound Healing Metadata (WAV)
✓ Russell Storytelling NFTs
✓ Unity Grid Chronicles
✓ Gaia Policy Funding Nodes
✓ DAO Governance Integration
✓ 10% Lulu Profit Allocation

========================================
DEPLOYMENT COMPLETE!
Transaction Hash: 0x9876...5432
========================================
```

### Step 4: Update Configuration Files

After successful deployment, update the following files:

#### `.env`
```env
SCROLLSOUL_PLEIADIAN_ADDRESS=0xABCD...EFGH
```

#### `backend/src/config/contracts.js`
```javascript
module.exports = {
  mumbai: {
    scrollSoulPleiadian: '0xABCD...EFGH',
    chainId: 80001,
    rpcUrl: process.env.ALCHEMY_MUMBAI_URL
  }
};
```

#### `frontend/src/config/contracts.js`
```javascript
export const CONTRACTS = {
  SCROLLSOUL_PLEIADIAN: {
    address: '0xABCD...EFGH',
    network: 'mumbai',
    chainId: 80001
  }
};
```

### Step 5: Verify Deployment

#### Using Hardhat
```bash
npx hardhat verify --network mumbai 0xABCD...EFGH
```

#### Using PolygonScan
1. Visit [Mumbai PolygonScan](https://mumbai.polygonscan.com/)
2. Search for contract address: `0xABCD...EFGH`
3. Verify the contract is visible and validated
4. Check the "Contract" tab for source code

#### Using Web3 Console
```javascript
const { ethers } = require("hardhat");

async function verifyDeployment() {
  const contractAddress = "0xABCD...EFGH";
  const contract = await ethers.getContractAt(
    "ScrollSoulPleiadian",
    contractAddress
  );
  
  // Check contract methods
  const name = await contract.name();
  const symbol = await contract.symbol();
  const totalSupply = await contract.getTotalSupply();
  
  console.log("Contract Name:", name);
  console.log("Contract Symbol:", symbol);
  console.log("Total Supply:", totalSupply.toString());
}

verifyDeployment();
```

## 🧪 Post-Deployment Testing

### Test 1: Mint Soul NFT

```javascript
const { ethers } = require("hardhat");

async function testMintSoul() {
  const [deployer] = await ethers.getSigners();
  const contract = await ethers.getContractAt(
    "ScrollSoulPleiadian",
    "0xABCD...EFGH"
  );
  
  // Mint test Soul NFT
  const tx = await contract.mintSoul(
    deployer.address,
    "Test Pleiadian Soul",
    "A test soul for verification",
    "ipfs://QmTest123",
    6, // PLEIADIAN rarity
    0, // PLEIADIAN type
    528, // Hz
    12345678, // LAM code
    true // isGovernanceNFT
  );
  
  await tx.wait();
  console.log("Soul NFT minted successfully!");
  
  // Verify metadata
  const metadata = await contract.getSoulMetadata(0);
  console.log("Soul Metadata:", metadata);
}

testMintSoul();
```

### Test 2: Sign Stardust Decree

```javascript
async function testDecreeSigning() {
  const [deployer] = await ethers.getSigners();
  const contract = await ethers.getContractAt(
    "ScrollSoulPleiadian",
    "0xABCD...EFGH"
  );
  
  const tx = await contract.signStardustDecree(0);
  await tx.wait();
  
  console.log("Decree signed successfully!");
  
  // Verify signature
  const hasSigned = await contract.hasSignedDecree(deployer.address);
  console.log("Has Signed:", hasSigned);
}

testDecreeSigning();
```

### Test 3: Create Russell Story NFT

```javascript
async function testRussellStory() {
  const contract = await ethers.getContractAt(
    "ScrollSoulPleiadian",
    "0xABCD...EFGH"
  );
  
  const tx = await contract.createRussellStoryNFT(
    0, // Soul token ID
    "ipfs://QmStory123",
    ethers.parseEther("1.0") // Brand value
  );
  
  await tx.wait();
  console.log("Russell Story NFT created!");
  
  const story = await contract.getRussellStory(0);
  console.log("Story Details:", story);
}

testRussellStory();
```

### Test 4: Create Unity Grid Chronicle

```javascript
async function testUnityChronicle() {
  const [deployer] = await ethers.getSigners();
  const contract = await ethers.getContractAt(
    "ScrollSoulPleiadian",
    "0xABCD...EFGH"
  );
  
  const contributors = [deployer.address];
  const tx = await contract.createUnityGridChronicle(
    "Genesis Test Chronicle",
    "ipfs://QmChronicle123",
    contributors,
    ethers.parseEther("0.1")
  );
  
  await tx.wait();
  console.log("Unity Grid Chronicle created!");
  
  const chronicle = await contract.getUnityGridChronicle(0);
  console.log("Chronicle Details:", chronicle);
}

testUnityChronicle();
```

## 📊 Integration with Existing Systems

### Backend Integration

#### 1. Create Controller

Create `backend/src/controllers/scrollSoulController.js`:

```javascript
const { ethers } = require('ethers');
const contractABI = require('../utils/abis/ScrollSoulPleiadian.json');

class ScrollSoulController {
  constructor() {
    this.provider = new ethers.JsonRpcProvider(
      process.env.ALCHEMY_MUMBAI_URL
    );
    this.contract = new ethers.Contract(
      process.env.SCROLLSOUL_PLEIADIAN_ADDRESS,
      contractABI,
      this.provider
    );
  }
  
  async getSoulMetadata(tokenId) {
    return await this.contract.getSoulMetadata(tokenId);
  }
  
  async getTotalSupply() {
    return await this.contract.getTotalSupply();
  }
  
  // Add more methods as needed
}

module.exports = new ScrollSoulController();
```

#### 2. Create Routes

Create `backend/src/routes/scrollSoul.js`:

```javascript
const express = require('express');
const router = express.Router();
const scrollSoulController = require('../controllers/scrollSoulController');

router.get('/soul/:tokenId', async (req, res) => {
  try {
    const metadata = await scrollSoulController.getSoulMetadata(
      req.params.tokenId
    );
    res.json(metadata);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/total-supply', async (req, res) => {
  try {
    const supply = await scrollSoulController.getTotalSupply();
    res.json({ totalSupply: supply.toString() });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
```

#### 3. Update Server

Add to `backend/src/server.js`:

```javascript
const scrollSoulRoutes = require('./routes/scrollSoul');
app.use('/api/scrollsoul', scrollSoulRoutes);
```

### Frontend Integration

#### 1. Create Contract Hook

Create `frontend/src/hooks/useScrollSoul.js`:

```javascript
import { useContract } from './useContract';
import ScrollSoulABI from '../abis/ScrollSoulPleiadian.json';
import { CONTRACTS } from '../config/contracts';

export function useScrollSoul() {
  const contract = useContract(
    CONTRACTS.SCROLLSOUL_PLEIADIAN.address,
    ScrollSoulABI
  );
  
  const getSoulMetadata = async (tokenId) => {
    return await contract.getSoulMetadata(tokenId);
  };
  
  const mintSoul = async (soulData) => {
    const tx = await contract.mintSoul(
      soulData.guardian,
      soulData.name,
      soulData.description,
      soulData.uri,
      soulData.rarity,
      soulData.starseedException,
      soulData.resonanceFrequency,
      soulData.lamCode,
      soulData.isGovernanceNFT
    );
    return await tx.wait();
  };
  
  return { contract, getSoulMetadata, mintSoul };
}
```

## 🔐 Security Considerations

### 1. Private Key Management
- Never commit `.env` file to Git
- Use hardware wallets for mainnet deployments
- Implement multi-signature for critical operations
- Rotate keys regularly

### 2. Access Control
- Verify `onlyOwner` modifiers on sensitive functions
- Implement time-locks for major changes
- Use role-based access control for multi-admin scenarios

### 3. Testing
- Run full test suite before deployment
- Perform security audit with Slither/Mythril
- Test on testnet thoroughly before mainnet
- Implement emergency pause mechanism

### 4. Monitoring
- Set up blockchain event monitoring
- Implement alerting for unusual transactions
- Track gas usage and optimize
- Monitor contract balance and funding

## 📈 Success Criteria

Deployment is considered successful when:

- [x] Contract deployed to Mumbai testnet
- [x] Contract verified on PolygonScan
- [x] Deployment info saved to JSON files
- [x] ABI copied to backend directory
- [x] Environment variables updated
- [x] Test transactions executed successfully
- [x] Backend integration completed
- [x] Frontend integration completed
- [x] Documentation updated
- [x] Team notified of deployment

## 🆘 Troubleshooting

### Issue: Insufficient Funds
**Solution**: Get more testnet MATIC from faucet

### Issue: Transaction Underpriced
**Solution**: Increase gas price in hardhat.config.js

### Issue: Contract Verification Failed
**Solution**: Manually verify using Hardhat verify command

### Issue: RPC Connection Error
**Solution**: Check Alchemy API key and URL

### Issue: Nonce Too High/Low
**Solution**: Reset MetaMask account or wait for pending transactions

## 📞 Support

For deployment support, contact:
- Discord: ScrollVerse Community
- GitHub Issues: cosmic-constitution-scrollverse
- Email: support@scrollverse.io

## 🎯 Next Steps

After successful deployment:

1. Deploy to additional test networks (Sepolia, Goerli)
2. Perform security audit
3. Prepare mainnet deployment plan
4. Create user documentation
5. Launch community testing program
6. Integrate with frontend application
7. Set up monitoring and alerts
8. Plan token generation event
9. Coordinate marketing launch
10. Monitor and iterate based on feedback

---

**Deployment Transaction Hash**: [Record after deployment]
**Contract Address**: [Record after deployment]
**Deployment Date**: [Record after deployment]
**Deployer Address**: [Record after deployment]
