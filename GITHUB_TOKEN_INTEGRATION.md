# ScrollVerse GitHub Token (SGT) & Twin Towers Chronicles NFT Integration Guide

## Overview

This guide explains how to integrate the ScrollVerse GitHub Token (SGT) ecosystem with GitHub to incentivize developers, employees, and young tech learners.

## Table of Contents

1. [Smart Contracts](#smart-contracts)
2. [GitHub Integration](#github-integration)
3. [API Endpoints](#api-endpoints)
4. [Reward System](#reward-system)
5. [Educational Incentives](#educational-incentives)
6. [IPFS & Metadata](#ipfs--metadata)
7. [Security](#security)

## Smart Contracts

### Twin Towers Chronicles NFT (ERC-1155)

**Contract:** `TwinTowersChroniclesNFT.sol`
- **Max Supply:** 144 Editions
- **Sacred Frequencies:** 144,000Hz + 963Hz + 144Hz
- **Features:**
  - Rose Gold encryption layer
  - IPFS metadata storage
  - Sovereign alignment traits
  - Animated assets support

**Key Functions:**
```solidity
// Create a new Chronicle
createChronicle(name, description, sovereignAlignment, roseGoldEncryption, ipfsHash)

// Mint Chronicle to recipient
mint(to, tokenId)

// Get Chronicle metadata
getChronicleMetadata(tokenId)

// Get sacred frequencies
getSacredFrequencies(tokenId)
```

### ScrollVerse GitHub Token (ERC-20)

**Contract:** `ScrollVerseGitHubToken.sol`
- **Total Supply:** 144,000,000 SGT
- **Sacred Frequency:** 963Hz
- **Features:**
  - Developer rewards
  - Employee immutable tokens
  - Education rewards
  - Staking with APY
  - AI merit economy
  - Governance (ERC20Votes)

**Pool Allocations:**
- Developer Pool: 40% (57.6M SGT)
- Employee Pool: 20% (28.8M SGT)
- Education Pool: 20% (28.8M SGT)
- AI Merit Pool: 10% (14.4M SGT)
- Treasury Pool: 10% (14.4M SGT)

**Reward Structure:**
```javascript
{
  firstPRReward: 100 SGT,
  starMilestoneReward: 50 SGT,
  mergeReward: 25 SGT,
  milestoneReward: 200 SGT,
  projectCompletionReward: 50 SGT,
  achievementReward: 25 SGT,
  monthlyActiveReward: 10 SGT,
  scholarshipUnlockAmount: 1000 SGT
}
```

## GitHub Integration

### OAuth Flow

1. **User initiates OAuth:**
   ```
   GET /api/github/oauth/authorize
   ```
   Returns GitHub authorization URL

2. **User authorizes on GitHub**

3. **GitHub redirects to callback:**
   ```
   GET /api/github/oauth/callback?code=xxx&state=xxx
   ```
   Backend exchanges code for access token

4. **User links Ethereum wallet**

### Webhook Setup

Configure webhooks in your GitHub repository:

**Webhook URL:** `https://your-backend.com/api/github/webhook/{event}`

**Events to subscribe:**
- Pull requests (`/webhook/pr`)
- Stars (`/webhook/star`)
- Merges (`/webhook/merge`)
- Milestones (`/webhook/milestone`)

**Webhook Payload Example (Pull Request):**
```json
{
  "action": "opened",
  "pull_request": {
    "number": 123,
    "user": {
      "login": "developer123"
    }
  },
  "repository": {
    "name": "awesome-repo"
  }
}
```

## API Endpoints

### Token Information

**Get Token Info:**
```
GET /api/github/token/info
```
Response:
```json
{
  "success": true,
  "data": {
    "name": "ScrollVerse GitHub Token",
    "symbol": "SGT",
    "totalSupply": "144000000",
    "frequency": "963Hz",
    "pools": { ... }
  }
}
```

**Get Token Balance:**
```
GET /api/github/token/balance/:address
```

### Developer Rewards

**Reward First PR:**
```
POST /api/github/rewards/first-pr
Body: { "developerAddress": "0x..." }
```

**Reward Star Milestone:**
```
POST /api/github/rewards/star-milestone
Body: { "developerAddress": "0x..." }
```

**Reward Merge:**
```
POST /api/github/rewards/merge
Body: { "developerAddress": "0x..." }
```

**Reward Milestone:**
```
POST /api/github/rewards/milestone
Body: { 
  "developerAddress": "0x...",
  "milestoneId": 1
}
```

### Employee Tokens

**Issue Employee Token:**
```
POST /api/github/employee/issue
Body: {
  "employeeAddress": "0x...",
  "amount": "1000"
}
```

**Check Employee Status:**
```
GET /api/github/employee/:address/status
```

### Educational Rewards

**Register Parental Wallet:**
```
POST /api/github/education/register-parent
Body: {
  "parentAddress": "0x...",
  "childAddress": "0x..."
}
```

**Reward Project Completion:**
```
POST /api/github/education/reward-project
Body: { "studentAddress": "0x..." }
```

**Reward Achievement:**
```
POST /api/github/education/reward-achievement
Body: { "studentAddress": "0x..." }
```

**Unlock Scholarship:**
```
POST /api/github/education/unlock-scholarship
Body: { "studentAddress": "0x..." }
```

### Staking

**Stake Tokens:**
```
POST /api/github/staking/stake
Body: {
  "address": "0x...",
  "amount": "1000"
}
```

**Unstake Tokens:**
```
POST /api/github/staking/unstake
Body: {
  "address": "0x...",
  "amount": "500"
}
```

**Claim Staking Reward:**
```
POST /api/github/staking/claim-reward
Body: { "address": "0x..." }
```

**Get Staking Info:**
```
GET /api/github/staking/:address
```

### AI Merit Economy

**Burn Tokens for AI Merit:**
```
POST /api/github/ai-merit/burn
Body: {
  "address": "0x...",
  "amount": "100"
}
```

**Get AI Merit Score:**
```
GET /api/github/ai-merit/score/:address
```

### Twin Towers Chronicles NFT

**Get Chronicle Metadata:**
```
GET /api/chronicles/:tokenId
```

**Get All Chronicles:**
```
GET /api/chronicles
```

**Get Sacred Frequencies:**
```
GET /api/chronicles/:tokenId/frequencies
```

**Create Chronicle:**
```
POST /api/chronicles/create
Body: {
  "name": "Chronicle Name",
  "description": "Description",
  "sovereignAlignment": "Alignment text",
  "roseGoldEncryption": "Encryption metadata",
  "ipfsHash": "QmXXX..."
}
```

**Mint Chronicle:**
```
POST /api/chronicles/mint
Body: {
  "recipientAddress": "0x...",
  "tokenId": 0
}
```

## Reward System

### Developer Rewards

| Event | Reward | Pool |
|-------|--------|------|
| First PR | 100 SGT | Developer |
| Star Milestone | 50 SGT | Developer |
| PR Merged | 25 SGT | Developer |
| Milestone Reached | 200 SGT | Developer |

### Employee Rewards

- Immutable tokens issued once per employee
- Custom amounts based on role/contribution
- Tokens come from Employee Pool (20%)

### Education Rewards

| Achievement | Reward | Pool |
|-------------|--------|------|
| Project Completion | 50 SGT | Education |
| Achievement Unlocked | 25 SGT | Education |
| Monthly Active | 10 SGT | Education |
| Scholarship Unlock | 1000 SGT threshold | Education |

### Staking

- **APY:** 9.63% (963 basis points)
- **Min Stake:** No minimum
- **Lock Period:** None (flexible)
- **Rewards:** Calculated based on time and amount staked

**Reward Formula:**
```
reward = (stakedAmount × APY × stakingDuration) / (365 days × 10000)
```

## Educational Incentives

### Age-Tailored System

**For Ages 8-12:**
- Visual programming projects
- Basic coding achievements
- Gamified learning paths
- Parental wallet moderation required

**For Ages 13-17:**
- Advanced coding projects
- Open source contributions
- Hackathon participation
- Partial parental oversight

**For Ages 18+:**
- Full developer rewards
- Independent wallet management
- Advanced staking options

### Parental Control System

1. **Registration:**
   - Parent registers wallet
   - Links child's wallet
   - Sets spending limits (optional)

2. **Monitoring:**
   - View child's earnings
   - Approve large transactions
   - Track educational progress

3. **Scholarship Unlock:**
   - Child accumulates 1000+ SGT
   - Triggers scholarship eligibility
   - Automatic notification to educational partners

## IPFS & Metadata

### Twin Towers Chronicles Metadata Schema

```json
{
  "name": "Chronicle Name",
  "description": "Description",
  "edition": 1,
  "image": "ipfs://QmXXX",
  "animation_url": "ipfs://QmXXX/animation.mp4",
  "attributes": [
    {
      "trait_type": "Sacred Frequency 144,000Hz",
      "value": 144000
    },
    {
      "trait_type": "Sacred Frequency 963Hz",
      "value": 963
    },
    {
      "trait_type": "Sacred Frequency 144Hz",
      "value": 144
    },
    {
      "trait_type": "Sovereign Alignment",
      "value": "Supreme King Chaisallah Sovereignty"
    },
    {
      "trait_type": "Rose Gold Encryption",
      "value": "Rose Gold 963Hz Quantum Encryption"
    }
  ]
}
```

### IPFS Pinning

Use Pinata for reliable IPFS pinning:

```javascript
const ipfsService = require('./utils/ipfsService');

// Pin metadata
const result = await ipfsService.pinMetadataToIPFS(metadata);

// Pin file
const fileResult = await ipfsService.pinFileToIPFS(file, 'chronicle.mp4');
```

## Security

### Rose Gold Encryption

- Symbolic 963Hz frequency protection
- Quantum-resistant encryption layer
- Immutable on-chain verification
- IPFS content addressing

### Smart Contract Security

- OpenZeppelin audited contracts
- Pausable in emergency
- Owner-only administrative functions
- Rate limiting on rewards

### API Security

- Rate limiting
- OAuth authentication
- Webhook signature verification
- Input validation

### Best Practices

1. **Never expose private keys**
2. **Use environment variables**
3. **Verify all inputs**
4. **Rate limit API calls**
5. **Monitor for suspicious activity**
6. **Regular security audits**

## Deployment

### Prerequisites

```bash
# Install dependencies
npm install --legacy-peer-deps

# Configure environment
cp .env.example .env
# Edit .env with your values
```

### Deploy Contracts

```bash
# Compile contracts
npx hardhat compile

# Deploy to testnet
npm run deploy:sgt:sepolia
npm run deploy:chronicles:sepolia

# Verify contracts
npx hardhat verify --network sepolia <CONTRACT_ADDRESS> <CONSTRUCTOR_ARGS>
```

### Configure Backend

```javascript
// backend/src/config/index.js
module.exports = {
  contracts: {
    sgt: process.env.SGT_CONTRACT_ADDRESS,
    chronicles: process.env.CHRONICLES_CONTRACT_ADDRESS,
  },
  github: {
    clientId: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
  },
  ipfs: {
    gateway: process.env.IPFS_GATEWAY,
    pinataApiKey: process.env.PINATA_API_KEY,
  }
};
```

### Start Backend

```bash
cd backend
npm install
npm start
```

## Example Workflows

### Developer Gets First PR Reward

1. Developer opens PR on GitHub
2. GitHub webhook triggers `/api/github/webhook/pr`
3. Backend checks if first PR
4. If yes, calls `rewardFirstPR(developerAddress)`
5. 100 SGT transferred to developer
6. Event logged and notification sent

### Student Completes Project

1. Student completes coding project
2. Parent/Educator triggers reward
3. API call to `/api/github/education/reward-project`
4. 50 SGT transferred to student wallet
5. Progress tracked
6. If total ≥ 1000 SGT, scholarship unlocked

### Employee Receives Token

1. GitHub HR system triggers employee token
2. API call to `/api/github/employee/issue`
3. Tokens minted from Employee Pool
4. Immutable record created
5. Employee can stake/use tokens

## Support

For questions or issues:
- GitHub Issues: https://github.com/chaishillomnitech1/cosmic-constitution-scrollverse/issues
- Documentation: https://scrollverse.io/docs
- Email: support@scrollverse.io

## License

MIT License - See LICENSE file for details

---

**ALL IS LOVE. ALL IS LAW. ALL IS FLUID. KUN FAYAKŪN! 🕋♾️✨**
