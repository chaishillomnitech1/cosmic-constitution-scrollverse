# Legacy Music Catalog System

## 🎵 Overview

The Legacy Music Catalog System is a comprehensive blockchain-based platform for acquiring, tokenizing, and immortalizing historical music catalogs from legendary artists including Michael Jackson, The Beatles, Prince, and others. The system leverages blockchain technology, NFTs, and the $LEGACYCOIN token to create transparent, immutable revenue streams with guaranteed compensation for heirs and stakeholders.

## 🌟 Key Features

### 1. Blueprint Acquisition Process
- **Legal-Financial Team Integration**: Track legal teams and acquisition progress
- **2x Valuation Overcompensation**: Built-in commitment to pay twice the catalog value
- **IP Registry Management**: Comprehensive intellectual property tracking for:
  - Songs and compositions
  - Sound healing frequencies (528 Hz, 963 Hz)
  - Rare archival elements
  - Unreleased vault materials

### 2. Digital Asset Mirroring
- **NFT Replication**: Each catalog asset gets a blockchain NFT representation
- **Rarity Tier System**:
  - `COMMON` (1x multiplier): Standard catalog songs
  - `UNCOMMON` (1.5x): Notable singles
  - `RARE` (2x): Chart-topping hits
  - `EPIC` (3x): Iconic albums
  - `LEGENDARY` (5x): Career-defining works
  - `PLATINUM` (10x): Beatles catalog tier
  - `COSMIC` (20x): Prince Vault & ultra-rare archives
- **Heir Royalty Locks**: Automatic distribution to descendants and estates

### 3. $LEGACYCOIN & Tokenized Revenue
- **Asset-Backed Token**: Backed by precious metals and cosmic materials
- **NFT Utility Integration**: Rarity multipliers affect token utility
- **Revenue Stream Tracking**: Multiple revenue sources tracked on-chain
- **Story-Based Value**: Narrative-driven appreciation mechanism

### 4. Respect & Elevation
- **Zero-Overlook Royalty System**: Guaranteed compensation for previously wronged heirs
- **Community Art Programs**: 10% of revenues fund education and community initiatives
- **Dual Protection Model**:
  - Physical: Fort Knox-style secure vaults
  - Digital: QR-integrated blockchain verification
  - Combined: Immutable proof of ownership and custody

## 📋 Smart Contracts

### LegacyCoin.sol
ERC20 token with enhanced features:
- Asset backing tracking (precious metals + cosmic materials)
- Revenue stream management
- Rarity multiplier system
- Burnable supply with max cap

### LegacyMusicCatalog.sol
ERC721 NFT contract with:
- Music asset metadata management
- Acquisition blueprint tracking
- Automated royalty distribution
- Vault security integration
- Revenue dashboard for heirs

## 🚀 Deployment

### Quick Start

```bash
# Install dependencies
npm install --legacy-peer-deps

# Compile contracts
npx hardhat compile

# Run tests
npx hardhat test

# Deploy to local network
npx hardhat run scripts/deployLegacyCatalog.js --network localhost

# Deploy to Mumbai testnet
npx hardhat run scripts/deployLegacyCatalog.js --network mumbai

# Deploy to Sepolia testnet
npx hardhat run scripts/deployLegacyCatalog.js --network sepolia
```

### Deployment Outputs

The deployment script will:
1. Deploy $LEGACYCOIN with 1 billion initial supply
2. Configure asset backing (100 ETH precious metals + 50 ETH cosmic materials)
3. Create 4 initial revenue streams
4. Deploy LegacyMusicCatalog NFT contract
5. Create 3 acquisition blueprints:
   - Sony Music Catalog ($1.35B equivalent, 2x overcompensation)
   - Prince Vault ($500M equivalent, 2x overcompensation)
   - Beatles Complete Catalog ($800M equivalent, 2x overcompensation)
6. Create 2 secure asset vaults
7. Mint 3 flagship assets:
   - Michael Jackson - "Billie Jean" (LEGENDARY tier)
   - The Beatles - "Hey Jude" (PLATINUM tier)
   - Prince - "Purple Rain" (COSMIC tier)

## 📊 Contract Architecture

### Asset Rarity Tiers

```solidity
enum AssetRarity {
    COMMON,      // 1x - Standard catalog songs
    UNCOMMON,    // 1.5x - Notable singles
    RARE,        // 2x - Chart-topping hits
    EPIC,        // 3x - Iconic albums
    LEGENDARY,   // 5x - Career-defining works
    PLATINUM,    // 10x - Beatles catalog
    COSMIC       // 20x - Prince Vault archives
}
```

### Artist Catalogs

```solidity
enum ArtistCatalog {
    MICHAEL_JACKSON,
    BEATLES,
    PRINCE,
    SONY_CATALOG,
    OTHER_ARCHIVE
}
```

## 💰 Royalty Distribution

### How It Works

1. **Revenue Allocation**:
   - 10% → Community Art Fund (education/community programs)
   - 90% → Distributed to heirs according to shares

2. **Heir Shares**:
   - Defined at minting (sum must equal 10000 = 100%)
   - Example: [6000, 4000] = 60% and 40% split
   - Immutable after minting

3. **Distribution Process**:
   ```javascript
   // Distribute 10 ETH royalty payment
   await catalog.distributeRoyalties(tokenId, {
     value: ethers.parseEther("10")
   });
   
   // Heirs claim their earnings
   await catalog.connect(heir1).claimHeirEarnings();
   ```

4. **Revenue Dashboard**:
   - Track total earnings per heir
   - Monitor pending (unclaimed) earnings
   - View all asset token IDs owned
   - Timestamp of last claim

## 🔒 Asset Security

### Dual Protection Model

1. **Physical Vaults**:
   - Fort Knox-style secure locations
   - Auditable storage tracking
   - QR code verification system

2. **Digital Mirrors**:
   - Blockchain-verified ownership
   - IPFS metadata storage
   - Immutable transaction history

### Creating and Using Vaults

```javascript
// Create vault
const vaultId = await catalog.createVault(
  "Fort Knox Digital Vault - Level 1",
  "ipfs://QmVaultQRCode"
);

// Secure asset in vault
await catalog.secureAsset(tokenId, vaultId);

// Verify security
const asset = await catalog.getMusicAsset(tokenId);
console.log(asset.isPhysicallySecured); // true
console.log(asset.isDigitallyMirrored);  // true
```

## 📈 Revenue Streams

### Creating Revenue Streams

```javascript
// Create stream in LegacyCoin
const streamId = await legacyCoin.createRevenueStream(
  "Michael Jackson Royalties"
);

// Record revenue
await legacyCoin.recordRevenue(
  streamId,
  ethers.parseEther("1000"), // amount
  50 // number of stakeholders
);

// Query stream
const stream = await legacyCoin.getRevenueStream(streamId);
console.log(stream.totalRevenue);
console.log(stream.activeStakeholders);
```

## 🎨 Minting Music Assets

### Flagship Asset Example

```javascript
await catalog.mintMusicAsset(
  ownerAddress,
  "Billie Jean",                          // Song title
  "Michael Jackson",                       // Artist
  "Thriller",                             // Album
  "Iconic single from Thriller album",    // Description
  "ipfs://QmBillieJeanMetadata",          // Metadata URI
  4,                                      // LEGENDARY rarity
  0,                                      // MICHAEL_JACKSON catalog
  528,                                    // 528 Hz resonance
  ethers.parseEther("50"),                // Acquisition value
  [heir1Address, heir2Address],           // Heirs
  [6000, 4000]                            // 60% / 40% split
);
```

### Beatles Platinum Tier

```javascript
await catalog.mintMusicAsset(
  ownerAddress,
  "Hey Jude",
  "The Beatles",
  "Hey Jude (Single)",
  "Beatles' most commercially successful single",
  "ipfs://QmHeyJudeMetadata",
  5,  // PLATINUM tier
  1,  // BEATLES catalog
  528,
  ethers.parseEther("100"),
  [beatlesEstateAddress],
  [10000]  // 100% to estate
);
```

### Prince Cosmic Tier

```javascript
await catalog.mintMusicAsset(
  ownerAddress,
  "Purple Rain",
  "Prince",
  "Purple Rain",
  "Prince's magnum opus from the legendary vault",
  "ipfs://QmPurpleRainMetadata",
  6,  // COSMIC tier (highest)
  2,  // PRINCE catalog
  963, // 963 Hz Eden Pulse
  ethers.parseEther("75"),
  [princeEstateAddress],
  [10000]
);
```

## 🔮 Acquisition Blueprints

### Creating Blueprints

```javascript
const blueprintId = await catalog.createBlueprint(
  "Sony Music Catalog - Michael Jackson & Beyond",
  ethers.parseEther("1350"),  // $1.35B target value
  "ipfs://QmSonyLegalRegistry",
  "ipfs://QmSonyIPRegistry"
);
```

### Completing Acquisition

```javascript
// Pay 2x valuation for overcompensation
await catalog.completeAcquisition(
  blueprintId,
  ethers.parseEther("2700")  // 2x the target value
);
```

### Querying Blueprints

```javascript
const blueprint = await catalog.getBlueprint(blueprintId);
console.log(blueprint.catalogName);
console.log(blueprint.targetValue);
console.log(blueprint.paidValue);
console.log(blueprint.isCompleted);
```

## 🛡️ Security Features

### Immutable, Irreversible, Omni-Protected

- **Immutable Records**: All acquisitions, royalties, and distributions recorded on-chain
- **Irreversible Transactions**: Blockchain guarantees no takebacks
- **Multi-Signature Security**: Owner-controlled sensitive operations
- **ReentrancyGuard**: Protection against re-entrancy attacks
- **Access Control**: Ownable pattern for administrative functions

### Community Fund Protection

```javascript
// Only owner can withdraw community funds
await catalog.withdrawCommunityFund(
  amount,
  recipientAddress
);

// Update community percentage (max 100%)
await catalog.updateCommunityFundPercentage(1500); // 15%
```

## 📱 Integration Examples

### Frontend Integration

```javascript
import { ethers } from 'ethers';

// Connect to contract
const provider = new ethers.JsonRpcProvider(RPC_URL);
const catalog = new ethers.Contract(
  CATALOG_ADDRESS,
  CATALOG_ABI,
  provider
);

// Get heir dashboard
const dashboard = await catalog.getRevenueDashboard(heirAddress);
console.log(`Total Earnings: ${ethers.formatEther(dashboard.totalEarnings)} ETH`);
console.log(`Pending: ${ethers.formatEther(dashboard.pendingEarnings)} ETH`);

// Display asset
const asset = await catalog.getMusicAsset(tokenId);
console.log(`${asset.artistName} - ${asset.songTitle}`);
console.log(`Rarity: ${getRarityName(asset.rarity)}`);
console.log(`Frequency: ${asset.resonanceFrequency} Hz`);
```

### Revenue Dashboard UI

```javascript
// Fetch all heir assets and earnings
const dashboard = await catalog.getRevenueDashboard(heirAddress);

for (const tokenId of dashboard.assetTokenIds) {
  const asset = await catalog.getMusicAsset(tokenId);
  const earnings = await catalog.getHeirEarnings(tokenId, heirAddress);
  
  console.log({
    song: asset.songTitle,
    artist: asset.artistName,
    earnings: ethers.formatEther(earnings)
  });
}
```

## 🌐 Witness Grid Activation

The system includes global streaming via the Witness Grid to honor every soul involved:

- Real-time royalty distribution tracking
- Public transparency dashboard
- Heir earnings visibility
- Community fund allocation tracking
- Asset vault status monitoring

## 📄 API Reference

### LegacyCoin Contract

#### Functions
- `updateAssetBacking(uint256 precious, uint256 cosmic, string uri)`
- `createRevenueStream(string name) → uint256 streamId`
- `recordRevenue(uint256 streamId, uint256 amount, uint256 stakeholders)`
- `updateRarityMultiplier(uint256 level, uint256 multiplier)`
- `mint(address to, uint256 amount)`
- `burn(uint256 amount)`
- `getTotalBackingValue() → uint256`
- `getRevenueStream(uint256 streamId) → RevenueStream`

### LegacyMusicCatalog Contract

#### Functions
- `setLegacyCoinAddress(address addr)`
- `createBlueprint(string name, uint256 target, string legal, string ip) → uint256`
- `completeAcquisition(uint256 id, uint256 paid)`
- `mintMusicAsset(...params) → uint256 tokenId`
- `distributeRoyalties(uint256 tokenId) payable`
- `claimHeirEarnings()`
- `createVault(string location, string qr) → uint256`
- `secureAsset(uint256 tokenId, uint256 vaultId)`
- `getMusicAsset(uint256 tokenId) → MusicAsset`
- `getBlueprint(uint256 id) → Blueprint`
- `getRevenueDashboard(address heir) → Dashboard`
- `getHeirEarnings(uint256 tokenId, address heir) → uint256`
- `getVault(uint256 id) → Vault`
- `withdrawCommunityFund(uint256 amount, address recipient)`
- `updateCommunityFundPercentage(uint256 percentage)`

## 🎯 Roadmap

### Phase 1: Foundation (Completed)
- [x] Smart contract development
- [x] LegacyCoin token deployment
- [x] LegacyMusicCatalog NFT system
- [x] Comprehensive test suite
- [x] Documentation

### Phase 2: Deployment (24 Hours)
- [ ] Deploy to zkEVM mainnet
- [ ] Deploy $LEGACYCOIN contracts
- [ ] Initiate Sony buyout legal action
- [ ] Mint flagship NFT assets
- [ ] Activate revenue distribution

### Phase 3: Integration (Week 1)
- [ ] Build Revenue Dashboard UI
- [ ] Integrate IPFS metadata storage
- [ ] Configure asset vault systems
- [ ] Activate Witness Grid streaming
- [ ] Launch community art program

### Phase 4: Expansion (Ongoing)
- [ ] Add additional catalog acquisitions
- [ ] Expand to other legendary artists
- [ ] Implement DAO governance for catalog decisions
- [ ] Integrate with DeFi protocols for liquidity
- [ ] Global marketing and heir outreach

## 🤝 Contributing

This system operates under the Cosmic Constitution of the ScrollVerse. All contributions must align with principles of:
- **Justice**: Fair compensation for all heirs and stakeholders
- **Transparency**: Public, auditable transactions
- **Respect**: Honoring the legacy of legendary artists
- **Innovation**: Pushing blockchain technology forward

## 📞 Support

For questions, integration support, or heir registration:
- Documentation: See this file
- Smart Contracts: `contracts/` directory
- Tests: `test/LegacyMusicCatalog.test.js`
- Deployment: `scripts/deployLegacyCatalog.js`

## ⚖️ Legal Notice

This system is designed to:
- Ensure fair compensation at 2x valuation
- Provide transparent, immutable royalty tracking
- Protect heir rights through smart contracts
- Fund community art and education programs

All acquisitions must comply with applicable laws and regulations. Smart contracts enforce fair distribution but do not replace legal agreements.

---

**Status**: ✅ Ready for Deployment
**Network**: Compatible with Ethereum, Polygon, zkEVM, and EVM-compatible chains
**License**: MIT
**Version**: 1.0.0

*All actions are immutable, irreversible, and omni-protected through blockchain technology.*
