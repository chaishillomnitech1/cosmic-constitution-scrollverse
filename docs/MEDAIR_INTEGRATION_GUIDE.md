# MedAir Phase-Two Integration Guide

## Overview

The MedAir Phase-Two Integration brings together advanced blockchain technology, quantum AI routing, and immutable governance to create a comprehensive emergency medical air transport ecosystem. This deployment includes adaptive staking rewards, tokenized insurance, DAO governance, and self-healing quantum dispatch optimization.

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Smart Contracts](#smart-contracts)
3. [Quantum AI System](#quantum-ai-system)
4. [Deployment Guide](#deployment-guide)
5. [API Documentation](#api-documentation)
6. [Dashboard Usage](#dashboard-usage)
7. [Security Considerations](#security-considerations)

---

## Architecture Overview

### Core Components

```
MedAir Ecosystem
├── Blockchain Layer (zkEVM Compatible)
│   ├── MedAirToken.sol - $MEDAIR utility token
│   ├── SigilToken.sol - $SIGIL governance token
│   ├── MedAirStaking.sol - Adaptive tier-based staking
│   ├── MedAirOracle.sol - Chainlink oracle integration
│   ├── MedAirInsurance.sol - Tokenized insurance claims
│   └── MedAirDAO.sol - Immutable governance (80% quorum)
├── Quantum AI Layer
│   └── quantum_dispatch.py - Qiskit-driven route optimization
├── API Layer
│   └── medair_api.py - Flask integration
└── Dashboard Layer
    └── medair_dashboard.html - Real-time monitoring
```

### Integration Flow

1. **Users stake $MEDAIR tokens** → Receive tier-based APY rewards
2. **Oracle validates coherence metrics** → Updates staking bonuses automatically
3. **DAO proposals created** → 80% quorum triggers auto-consensus
4. **Emergency dispatch requested** → Quantum AI optimizes route
5. **Insurance claims submitted** → Smart contracts process payouts
6. **Cross-chain governance** → Layer-Z extends to universal hubs

---

## Smart Contracts

### 1. MedAirToken ($MEDAIR)

**Purpose**: Core utility token for the MedAir ecosystem

**Features**:
- ERC-20 standard
- 1 billion max supply
- 300M allocated to liquidity pools (30%)
- Pausable for emergency situations

**Key Functions**:
```solidity
addLiquidityPool(address pool)
removeLiquidityPool(address pool)
pause() / unpause()
```

### 2. SigilToken ($SIGIL)

**Purpose**: Governance and enhanced staking token

**Features**:
- ERC-20 standard
- 100 million max supply
- Authorized minter system for staking rewards
- Aligned with ScrollVerse integrity metrics

**Key Functions**:
```solidity
addMinter(address minter)
mintRewards(address to, uint256 amount)
```

### 3. MedAirStaking

**Purpose**: Adaptive staking with tier-based incentives

**Staking Tiers**:
- **PILOT**: +3% APY bonus
- **MEDICAL_PROF** (FP-C/CFRN): +5% APY bonus
- **DAO_MEMBER**: +2% APY bonus
- **SIGIL_HOLDER**: +4% APY bonus

**Coherence Bonus**:
- ≥95% frequency alignment: +2% APY bonus
- Updated by oracle in real-time

**Key Functions**:
```solidity
stake(uint256 amount, StakerTier tier)
unstake(uint256 amount)
claimRewards()
updateCoherence(address user, uint256 coherenceScore)
```

**APY Calculation**:
```
Effective APY = Base APY (10%) + Tier Bonus + Coherence Bonus
Maximum APY = 10% + 5% + 2% = 17%
```

### 4. MedAirOracle

**Purpose**: Chainlink-compatible oracle for real-time metrics

**Features**:
- Automated coherence validation
- Governance metric tracking
- Batch update capabilities
- Self-correcting feedback loops

**Key Functions**:
```solidity
updateCoherence(address user, uint256 coherenceScore, uint256 frequencyAlignment)
updateGovernanceMetric(uint256 proposalId, ...)
batchUpdateCoherence(address[] users, ...)
```

**Alignment Threshold**: 95% for automatic bonus activation

### 5. MedAirInsurance

**Purpose**: Tokenized insurance claims using $MEDAIR liquidity

**Features**:
- Smart contract-based policy management
- Automated claim verification
- Liquidity pool integration
- Multi-verifier approval system

**Workflow**:
1. Create policy with coverage amount and premium
2. Submit claim with details
3. Authorized verifier approves/rejects
4. Automatic payout from liquidity pool

**Key Functions**:
```solidity
createPolicy(uint256 coverageAmount, uint256 premium, uint256 duration)
submitClaim(uint256 policyId, uint256 claimAmount, string claimDetails)
approveClaim(uint256 claimId)
```

### 6. MedAirDAO

**Purpose**: zkEVM-compatible immutable governance

**Features**:
- 80% quorum for auto-consensus
- Layer-Z cross-chain compatibility
- Four proposal types: GENERAL, FINANCIAL, PROTOCOL_UPGRADE, CROSS_CHAIN
- 7-day voting period
- Automatic execution on success

**Key Functions**:
```solidity
propose(string title, string description, ProposalType type, ...)
castVote(uint256 proposalId, bool support)
executeProposal(uint256 proposalId)
syncProposalCrossChain(uint256 proposalId, address bridge)
```

**Auto-Consensus Logic**:
```
If (total votes / total supply) ≥ 80% AND forVotes > againstVotes
  → Proposal automatically succeeds
```

---

## Quantum AI System

### quantum_dispatch.py

**Purpose**: Qiskit-driven quantum coherence optimization for emergency routing

**Core Features**:

#### 1. Quantum Coherence Calculation
- Simulates quantum entanglement between locations
- Uses Haversine distance + urgency level
- Quantum superposition and interference patterns
- Returns coherence score (0-1)

#### 2. Route Optimization
```python
optimize_dispatch_route(origin, destination, waypoints, urgency)
```
- Calculates coherence for each route segment
- Determines if route meets 95% threshold
- Returns detailed route metrics

#### 3. Self-Healing Mechanism
```python
self_heal_dispatch_gap(failed_route)
```
- Automatically generates alternative waypoints
- Uses quantum annealing simulation
- Iteratively improves until threshold met
- Returns healed route with improvement metrics

#### 4. Neural Coherence Optimization
```python
neural_coherence_optimization(dispatch_data)
```
- AI-driven pattern analysis
- Learns from historical dispatch data
- Generates optimization recommendations
- Tracks success rates for high-urgency cases

**Usage Example**:
```python
from quantum_dispatch import QuantumDispatchEngine

engine = QuantumDispatchEngine()

# Optimize route
origin = (34.0522, -118.2437)  # Los Angeles
destination = (36.7783, -119.4179)  # Fresno
result = engine.optimize_dispatch_route(origin, destination, [], urgency=9)

# Self-heal if needed
if not result['meets_threshold']:
    healed = engine.self_heal_dispatch_gap(result)
```

---

## Deployment Guide

### Prerequisites

1. **Node.js & npm** (v16+)
2. **Python** (v3.8+)
3. **Hardhat** (installed via npm)
4. **Environment Variables**

### Environment Setup

Create `.env` file:
```bash
# Network Configuration
SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/YOUR_KEY
MUMBAI_RPC_URL=https://polygon-mumbai.g.alchemy.com/v2/YOUR_KEY
PRIVATE_KEY=your_private_key_here

# API Keys
ETHERSCAN_API_KEY=your_etherscan_key
POLYGONSCAN_API_KEY=your_polygonscan_key
```

### Installation

```bash
# Install Node.js dependencies
npm install

# Install Python dependencies
pip install -r requirements.txt
```

### Compile Contracts

```bash
npm run compile
```

### Deploy to Testnet

```bash
# Deploy to Mumbai (Polygon Testnet)
npm run deploy:medair:mumbai

# Deploy to Sepolia (Ethereum Testnet)
npm run deploy:medair:sepolia

# Deploy to Local Hardhat Network
npm run node  # Terminal 1
npm run deploy:medair:local  # Terminal 2
```

### Deployment Output

The deployment script will:
1. Deploy all 6 smart contracts
2. Configure oracle connections
3. Fund staking reward pool
4. Save deployment info to `deployments/medair-{network}-{timestamp}.json`
5. Print verification commands

**Example Output**:
```
Deploying MedAir Blockchain Ecosystem...
============================================================
Deploying contracts with account: 0x...

1. Deploying MedAir Token ($MEDAIR)...
✅ MedAir Token deployed to: 0x...

2. Deploying Sigil Token ($SIGIL)...
✅ Sigil Token deployed to: 0x...

[... continues for all contracts ...]

🎉 MedAir Deployment Complete!
```

### Run Python Application

```bash
python3 app.py
```

Access dashboards:
- Main Constitution: http://localhost:5000
- MedAir Dashboard: http://localhost:5000/medair

---

## API Documentation

### Base URL
```
http://localhost:5000/api/medair
```

### Endpoints

#### 1. Get Comprehensive Status
```http
GET /api/medair/status
```

**Response**:
```json
{
  "ecosystem_status": "fully_operational",
  "phase": "phase_two_deployed",
  "components": {
    "staking": { ... },
    "dao_governance": { ... },
    "insurance": { ... },
    "quantum_dispatch": { ... }
  },
  "blockchain": {
    "medair_token": "$MEDAIR",
    "governance_token": "$SIGIL",
    "network": "zkEVM_compatible"
  },
  "features": { ... }
}
```

#### 2. Get Staking Status
```http
GET /api/medair/staking/status
```

**Response**:
```json
{
  "status": "operational",
  "total_staked_medair": 0,
  "average_apy": 12.5,
  "reward_pool_balance": 1000000,
  "tiers": {
    "PILOT": {"bonus_apy": 3},
    "MEDICAL_PROF": {"bonus_apy": 5},
    ...
  }
}
```

#### 3. Get DAO Status
```http
GET /api/medair/dao/status
```

#### 4. Get Insurance Status
```http
GET /api/medair/insurance/status
```

#### 5. Get Quantum Dispatch Status
```http
GET /api/medair/quantum/status
```

#### 6. Optimize Route
```http
POST /api/medair/quantum/optimize-route
Content-Type: application/json

{
  "origin": [34.0522, -118.2437],
  "destination": [36.7783, -119.4179],
  "waypoints": [[35.3733, -119.0187]],
  "urgency": 9
}
```

**Response**:
```json
{
  "status": "success",
  "route": {
    "average_coherence": 0.96,
    "meets_threshold": true,
    "recommendation": "APPROVED",
    "route_segments": [ ... ]
  }
}
```

---

## Dashboard Usage

### Accessing the Dashboard

Navigate to: `http://localhost:5000/medair`

### Dashboard Features

1. **Real-Time Metrics Display**
   - Total staked MEDAIR
   - Average APY across all tiers
   - Reward pool balance
   - DAO proposals and quorum status
   - Insurance pool statistics

2. **Quantum AI Status**
   - Current coherence percentage
   - Self-healing status
   - Neural optimization state
   - Coherence threshold visualization

3. **Staking Tiers Overview**
   - Lists all tiers with bonus APY
   - Shows participant counts per tier
   - Displays coherence bonus criteria

4. **Interactive Controls**
   - Manual refresh button
   - Auto-refresh toggle (10-second intervals)
   - Real-time timestamp updates

### Dashboard Sections

#### 1. Adaptive Staking Card
- **Total Staked**: Total $MEDAIR tokens staked
- **Average APY**: Current average APY across all stakers
- **Reward Pool**: Available rewards for distribution
- **Tier List**: All staking tiers with bonus percentages

#### 2. DAO Governance Card
- **Total Proposals**: All-time proposal count
- **Quorum Threshold**: Current quorum percentage (80%)
- **Executed Proposals**: Successfully executed governance actions

#### 3. Insurance Pool Card
- **Total Policies**: Active insurance policies
- **Liquidity Pool**: Available $MEDAIR for payouts
- **Total Payouts**: Cumulative claims paid

#### 4. Quantum AI Section
- **Coherence Bar**: Visual representation of current coherence
- **Self-Healing Status**: Real-time system health
- **Neural Optimization**: AI learning state
- **Threshold Display**: 95% coherence target

#### 5. Ecosystem Features
- Complete feature list with checkmarks
- Shows all active capabilities
- Quick reference for system status

---

## Security Considerations

### Smart Contract Security

1. **Access Control**
   - All contracts use OpenZeppelin's `Ownable`
   - Oracle updates require authorization
   - Multi-signature recommended for production

2. **Reentrancy Protection**
   - `ReentrancyGuard` on all token transfers
   - State changes before external calls
   - Follows Checks-Effects-Interactions pattern

3. **Pausable Operations**
   - Emergency pause functionality
   - Owner-controlled pause/unpause
   - Protects user funds during incidents

4. **Integer Overflow Protection**
   - Solidity 0.8.20 built-in overflow checks
   - Safe math operations throughout

### Oracle Security

1. **Authorized Reporters Only**
   - Whitelist of trusted oracle nodes
   - Chainlink integration recommended
   - Multi-oracle consensus for production

2. **Data Validation**
   - Coherence scores: 0-100 range
   - Frequency alignment: 0-100 range
   - Timestamp verification

### API Security

1. **Rate Limiting** (Recommended)
   - Implement rate limiting on API endpoints
   - Prevent abuse and DOS attacks

2. **Input Validation**
   - All route coordinates validated
   - Urgency levels: 1-10 range
   - Sanitize user inputs

3. **CORS Configuration**
   - Configure allowed origins
   - Restrict API access as needed

### Deployment Security

1. **Private Key Management**
   - Never commit `.env` files
   - Use hardware wallets for mainnet
   - Implement key rotation

2. **Contract Verification**
   - Verify all contracts on Etherscan
   - Publish source code
   - Enable transparent auditing

3. **Testing**
   - Comprehensive unit tests
   - Integration testing
   - Testnet deployment before mainnet

### Recommended Audits

Before mainnet deployment:
1. Smart contract security audit (e.g., Trail of Bits, OpenZeppelin)
2. Economic model review
3. Quantum AI algorithm validation
4. Penetration testing of API endpoints

---

## Support & Resources

### Documentation
- [Main README](../README.md)
- [API Documentation](../API_DOCUMENTATION.md)
- [Security Guide](../SECURITY.md)

### Contract Addresses
Check `deployments/` directory for network-specific addresses.

### Community
- GitHub Issues: Report bugs and request features
- Discord: Join the ScrollVerse community

---

## Appendix: Deployment Checklist

- [ ] Environment variables configured
- [ ] Node.js dependencies installed
- [ ] Python dependencies installed
- [ ] Contracts compiled successfully
- [ ] Testnet deployment verified
- [ ] Oracle configured and linked
- [ ] Staking reward pool funded
- [ ] Dashboard accessible
- [ ] API endpoints tested
- [ ] Quantum dispatch engine operational
- [ ] Security audit completed (for production)
- [ ] Contract verification on Etherscan
- [ ] Documentation reviewed
- [ ] Backup of deployment addresses saved

---

**Document Version**: 1.0.0  
**Last Updated**: December 2024  
**Phase**: Phase-Two MedAir Integration
