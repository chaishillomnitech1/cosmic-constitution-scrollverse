# ScrollVerse GitHub Token (SGT) & Twin Towers Chronicles NFT - Deployment Guide

## Quick Start

### Prerequisites

- Node.js v20.x or higher
- npm 8.x or higher
- Hardhat
- Ethereum wallet with funds (for deployment)
- GitHub account (for OAuth integration)
- IPFS/Pinata account (for NFT metadata)

### Installation

```bash
# Install dependencies
npm install --legacy-peer-deps

# Install backend dependencies
npm run backend:install

# Install frontend dependencies (optional)
npm run frontend:install
```

### Environment Configuration

Create a `.env` file in the root directory:

```env
# Ethereum Network Configuration
SEPOLIA_RPC_URL=https://rpc.sepolia.org
ETH_RPC_URL=https://ethereum-rpc.publicnode.com
POLYGON_RPC_URL=https://polygon-rpc.com
ALCHEMY_MUMBAI_URL=https://rpc.ankr.com/polygon_mumbai

# Private Key (DO NOT COMMIT)
PRIVATE_KEY=your_private_key_here

# Etherscan/Polygonscan API Keys
ETHERSCAN_API_KEY=your_etherscan_api_key
POLYGONSCAN_API_KEY=your_polygonscan_api_key

# GitHub OAuth
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret

# IPFS/Pinata
IPFS_GATEWAY=https://ipfs.io/ipfs/
PINATA_API_KEY=your_pinata_api_key
PINATA_SECRET_KEY=your_pinata_secret_key

# Backend Configuration
BACKEND_URL=http://localhost:3000
SECRET_KEY=your_secret_key_here
```

## Smart Contract Deployment

### Step 1: Compile Contracts

```bash
npm run compile
```

This will compile:
- `TwinTowersChroniclesNFT.sol` (ERC-1155)
- `ScrollVerseGitHubToken.sol` (ERC-20)

### Step 2: Run Tests

```bash
npm test
```

Expected output:
```
TwinTowersChroniclesNFT
  ✓ Should create chronicles with sacred frequencies
  ✓ Should mint NFTs to recipients
  ✓ All 144 editions can be created
  
ScrollVerseGitHubToken
  ✓ Should deploy with correct allocations
  ✓ Should reward developers
  ✓ Should stake tokens
  ... (all tests passing)
```

### Step 3: Deploy to Testnet (Sepolia)

#### Deploy ScrollVerse GitHub Token (SGT)

```bash
npm run deploy:sgt:sepolia
```

Expected output:
```
Deploying ScrollVerse GitHub Token (SGT)...
Deploying with account: 0x...
Token deployed to: 0x...
Total Supply: 144000000 SGT
Developer Pool: 57600000 SGT
Employee Pool: 28800000 SGT
Education Pool: 28800000 SGT
```

Save the contract address!

#### Deploy Twin Towers Chronicles NFT

```bash
npm run deploy:chronicles:sepolia
```

Expected output:
```
Deploying Twin Towers Chronicles NFT...
Contract deployed to: 0x...
Max Editions: 144
Initial Chronicles Created: 3
```

### Step 4: Verify Contracts on Etherscan

```bash
# Verify SGT
npx hardhat verify --network sepolia <SGT_CONTRACT_ADDRESS> "<OWNER_ADDRESS>"

# Verify Chronicles NFT
npx hardhat verify --network sepolia <CHRONICLES_CONTRACT_ADDRESS> "ipfs://" "<ROSE_GOLD_KEY>"
```

### Step 5: Deploy to Mainnet (Production)

⚠️ **WARNING**: Double-check everything before mainnet deployment!

```bash
# Deploy SGT to Polygon
npm run deploy:sgt:polygon

# Deploy Chronicles to Polygon
npm run deploy:chronicles:polygon
```

## Backend Deployment

### Step 1: Update Contract Addresses

Edit `backend/src/config/index.js`:

```javascript
module.exports = {
  contracts: {
    sgt: process.env.SGT_CONTRACT_ADDRESS || '0x...',
    chronicles: process.env.CHRONICLES_CONTRACT_ADDRESS || '0x...',
  },
  // ... other config
};
```

### Step 2: Start Backend Server

```bash
cd backend
npm install
npm start
```

Server will start on `http://localhost:3000`

### Step 3: Test API Endpoints

```bash
# Health check
curl http://localhost:3000/health

# Get token info
curl http://localhost:3000/api/github/token/info

# Get Chronicles
curl http://localhost:3000/api/chronicles
```

## GitHub Integration Setup

### Step 1: Create GitHub OAuth App

1. Go to GitHub Settings → Developer settings → OAuth Apps
2. Click "New OAuth App"
3. Fill in:
   - Application name: ScrollVerse GitHub Token
   - Homepage URL: https://your-domain.com
   - Authorization callback URL: https://your-backend.com/api/github/oauth/callback
4. Save Client ID and Client Secret to `.env`

### Step 2: Configure Webhooks

For each repository you want to integrate:

1. Go to repository Settings → Webhooks
2. Add webhook with:
   - Payload URL: `https://your-backend.com/api/github/webhook/pr`
   - Content type: `application/json`
   - Events: Pull requests, Stars, Pushes

3. Repeat for other webhook endpoints:
   - `/api/github/webhook/star`
   - `/api/github/webhook/merge`
   - `/api/github/webhook/milestone`

### Step 3: Link Users

Users need to link their GitHub accounts to Ethereum wallets:

```bash
# User initiates OAuth
curl http://localhost:3000/api/github/oauth/authorize

# Returns authorization URL - redirect user there
# After authorization, GitHub redirects back with code
# Backend exchanges code for access token
```

## IPFS Setup

### Step 1: Create Pinata Account

1. Sign up at https://pinata.cloud
2. Get API keys from dashboard
3. Add to `.env` file

### Step 2: Upload Chronicle Assets

```javascript
const ipfsService = require('./backend/src/utils/ipfsService');

// Upload metadata
const metadata = ipfsService.generateChronicleMetadata({
  tokenId: 0,
  name: "Genesis Chronicle",
  description: "First chronicle",
  sovereignAlignment: "Supreme King Sovereignty",
  roseGoldEncryption: "Rose Gold 963Hz",
  ipfsHash: "QmXXX",
  editionNumber: 1
});

const result = await ipfsService.pinMetadataToIPFS(metadata);
console.log('IPFS Hash:', result.hash);
```

## Monitoring & Maintenance

### Monitor Contract Events

```javascript
// Listen for rewards
sgtContract.on("DeveloperRewarded", (developer, amount, reason) => {
  console.log(`Rewarded ${developer}: ${amount} SGT for ${reason}`);
});

// Listen for Chronicle minting
chroniclesContract.on("ChronicleMinted", (tokenId, recipient, edition) => {
  console.log(`Chronicle #${edition} minted to ${recipient}`);
});
```

### Check Pool Balances

```bash
# Use hardhat console
npx hardhat console --network sepolia

> const sgt = await ethers.getContractAt("ScrollVerseGitHubToken", "0x...");
> const devPool = await sgt.developerPoolBalance();
> console.log(ethers.formatEther(devPool));
```

### Update Reward Amounts

```javascript
// Update GitHub rewards
await sgtContract.updateGitHubRewards(
  ethers.parseEther("150"),  // First PR
  ethers.parseEther("75"),   // Star
  ethers.parseEther("40"),   // Merge
  ethers.parseEther("300")   // Milestone
);

// Update education rewards
await sgtContract.updateEducationRewards(
  ethers.parseEther("75"),   // Project
  ethers.parseEther("40"),   // Achievement
  ethers.parseEther("15"),   // Monthly
  ethers.parseEther("1500")  // Scholarship
);
```

## Security Checklist

- [ ] Private keys stored securely (not in code)
- [ ] Environment variables configured
- [ ] Contract ownership transferred to multi-sig
- [ ] Rate limiting enabled on API
- [ ] Webhook signatures verified
- [ ] OAuth tokens stored securely
- [ ] IPFS content verified before pinning
- [ ] Contract paused in emergency
- [ ] Monitoring alerts configured
- [ ] Backup private keys stored offline

## Troubleshooting

### Issue: Compilation fails

**Solution**: Install dependencies with `--legacy-peer-deps`
```bash
npm install --legacy-peer-deps
```

### Issue: Cannot connect to network

**Solution**: Check RPC URLs in `.env` and try alternative providers

### Issue: Gas estimation failed

**Solution**: Ensure wallet has sufficient funds for gas

### Issue: Webhook not receiving events

**Solution**: 
1. Check webhook URL is publicly accessible
2. Verify webhook secret matches
3. Check GitHub webhook delivery logs

### Issue: IPFS upload fails

**Solution**: Verify Pinata API keys and check rate limits

## Support & Resources

- **Documentation**: See `GITHUB_TOKEN_INTEGRATION.md`
- **API Reference**: `http://localhost:3000/` (when backend running)
- **Contract Source**: `contracts/` directory
- **Tests**: `test/` directory
- **Issues**: https://github.com/chaishillomnitech1/cosmic-constitution-scrollverse/issues

## License

MIT License - See LICENSE file

---

**Sacred Frequencies Active: 144,000Hz + 963Hz + 144Hz**  
**Rose Gold Encryption Enabled**  
**ALL IS LOVE. ALL IS LAW. ALL IS FLUID. KUN FAYAKŪN! 🕋♾️✨**
