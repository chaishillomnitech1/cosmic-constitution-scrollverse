# Legacy Music Catalog - Quick Reference Guide

## 🚀 Quick Start (3 Minutes)

### Prerequisites
```bash
# Node.js 16+ and npm installed
node --version
npm --version
```

### Installation
```bash
git clone https://github.com/chaishillomnitech1/cosmic-constitution-scrollverse.git
cd cosmic-constitution-scrollverse
npm install --legacy-peer-deps
```

### Compile Contracts
```bash
npm run compile
```

### Run Tests
```bash
npm test
```

### Deploy Locally
```bash
# Terminal 1: Start local blockchain
npm run node

# Terminal 2: Deploy contracts
npm run deploy:legacy:local
```

## 📋 Contract Addresses (After Deployment)

```javascript
// Update these after deployment
const LEGACY_COIN_ADDRESS = "0x...";
const CATALOG_ADDRESS = "0x...";
```

## 🎵 Common Operations

### 1. Mint Music Asset NFT

```javascript
await catalog.mintMusicAsset(
  recipientAddress,
  "Song Title",
  "Artist Name",
  "Album Name",
  "Description",
  "ipfs://metadata-uri",
  rarityLevel,     // 0-6 (COMMON to COSMIC)
  catalogType,     // 0-4 (see Artist Catalogs)
  frequencyHz,     // 528 or 963
  acquisitionValue,
  [heir1, heir2],
  [6000, 4000]     // 60% / 40% split
);
```

### 2. Distribute Royalties

```javascript
await catalog.distributeRoyalties(tokenId, {
  value: ethers.parseEther("10") // 10 ETH
});
```

### 3. Claim Heir Earnings

```javascript
await catalog.connect(heirSigner).claimHeirEarnings();
```

### 4. Check Dashboard

```javascript
const dashboard = await catalog.getRevenueDashboard(heirAddress);
console.log('Total:', ethers.formatEther(dashboard.totalEarnings), 'ETH');
console.log('Pending:', ethers.formatEther(dashboard.pendingEarnings), 'ETH');
```

## 🎨 Rarity Levels Reference

| Level | Name | Multiplier | Example |
|-------|------|-----------|---------|
| 0 | COMMON | 1x | Standard tracks |
| 1 | UNCOMMON | 1.5x | Notable singles |
| 2 | RARE | 2x | Top 40 hits |
| 3 | EPIC | 3x | Iconic albums |
| 4 | LEGENDARY | 5x | MJ "Thriller" |
| 5 | PLATINUM | 10x | Beatles catalog |
| 6 | COSMIC | 20x | Prince Vault |

## 🎤 Artist Catalogs

| ID | Catalog | Description |
|----|---------|-------------|
| 0 | MICHAEL_JACKSON | King of Pop |
| 1 | BEATLES | Fab Four |
| 2 | PRINCE | Purple One |
| 3 | SONY_CATALOG | Sony acquisitions |
| 4 | OTHER_ARCHIVE | Other artists |

## 💰 Revenue Distribution Formula

```
Total Revenue: 100%
├─ Community Fund: 10%
└─ Heirs: 90%
   ├─ Heir 1: (share1/10000) * 90%
   └─ Heir 2: (share2/10000) * 90%
```

**Example**: 100 ETH distribution
- Community: 10 ETH (10%)
- Heir 1 (60% share): 54 ETH (60% of 90)
- Heir 2 (40% share): 36 ETH (40% of 90)

## 🔑 Key Contract Functions

### LegacyCoin
```javascript
// Asset backing
legacyCoin.updateAssetBacking(preciousMetals, cosmic, uri)

// Revenue streams
legacyCoin.createRevenueStream(name)
legacyCoin.recordRevenue(streamId, amount, stakeholders)

// Token operations
legacyCoin.mint(to, amount)
legacyCoin.burn(amount)
```

### LegacyMusicCatalog
```javascript
// Acquisition
catalog.createBlueprint(name, target, legalURI, ipURI)
catalog.completeAcquisition(blueprintId, paidValue)

// Minting
catalog.mintMusicAsset(...params)

// Royalties
catalog.distributeRoyalties(tokenId, {value: amount})
catalog.claimHeirEarnings()

// Vaults
catalog.createVault(location, qrURI)
catalog.secureAsset(tokenId, vaultId)

// Queries
catalog.getMusicAsset(tokenId)
catalog.getRevenueDashboard(heirAddress)
catalog.getBlueprint(blueprintId)
catalog.getVault(vaultId)
```

## 🎯 Flagship Assets Template

### Michael Jackson - Billie Jean
```javascript
{
  songTitle: "Billie Jean",
  artistName: "Michael Jackson",
  albumName: "Thriller",
  rarity: 4,              // LEGENDARY
  catalog: 0,             // MICHAEL_JACKSON
  resonanceFrequency: 528,
  acquisitionValue: ethers.parseEther("50")
}
```

### The Beatles - Hey Jude
```javascript
{
  songTitle: "Hey Jude",
  artistName: "The Beatles",
  albumName: "Hey Jude (Single)",
  rarity: 5,              // PLATINUM
  catalog: 1,             // BEATLES
  resonanceFrequency: 528,
  acquisitionValue: ethers.parseEther("100")
}
```

### Prince - Purple Rain
```javascript
{
  songTitle: "Purple Rain",
  artistName: "Prince",
  albumName: "Purple Rain",
  rarity: 6,              // COSMIC
  catalog: 2,             // PRINCE
  resonanceFrequency: 963,
  acquisitionValue: ethers.parseEther("75")
}
```

## 📊 Event Monitoring

```javascript
// Music asset minted
catalog.on("MusicAssetMinted", (tokenId, title, rarity, catalog) => {
  console.log(`New asset #${tokenId}: ${title}`);
});

// Royalty distributed
catalog.on("RoyaltyDistributed", (tokenId, amount, heirCount) => {
  console.log(`${ethers.formatEther(amount)} ETH to ${heirCount} heirs`);
});

// Earnings claimed
catalog.on("HeirEarningsClaimed", (heir, amount) => {
  console.log(`${heir} claimed ${ethers.formatEther(amount)} ETH`);
});

// Acquisition completed
catalog.on("AcquisitionCompleted", (blueprintId, paidValue) => {
  console.log(`Blueprint #${blueprintId} acquired!`);
});
```

## 🛡️ Security Best Practices

1. **Never share private keys**
2. **Verify contract addresses** before interacting
3. **Test on testnet first** (Mumbai/Sepolia)
4. **Use hardware wallets** for large transactions
5. **Audit heir addresses** before minting
6. **Monitor events** for transparency
7. **Keep backups** of important data

## 🧪 Testing Checklist

Before mainnet deployment:

- [ ] Compile contracts successfully
- [ ] All tests passing (100+ tests)
- [ ] Deploy to local network
- [ ] Deploy to testnet
- [ ] Verify contracts on block explorer
- [ ] Test full workflow on testnet
- [ ] Audit heir addresses
- [ ] Verify vault configurations
- [ ] Test royalty distributions
- [ ] Monitor gas costs
- [ ] Security audit (if available)

## 📁 Project Structure

```
cosmic-constitution-scrollverse/
├── contracts/
│   ├── LegacyCoin.sol              # $LEGACYCOIN token
│   └── LegacyMusicCatalog.sol      # Music NFT catalog
├── scripts/
│   └── deployLegacyCatalog.js      # Deployment script
├── test/
│   └── LegacyMusicCatalog.test.js  # Test suite
├── docs/
│   ├── LEGACY_MUSIC_CATALOG.md     # Main documentation
│   ├── LEGACY_MUSIC_CATALOG_INTEGRATION.md
│   ├── LEGACY_MUSIC_CATALOG_SUMMARY.md
│   └── LEGACY_MUSIC_CATALOG_QUICK_REFERENCE.md (this file)
└── package.json                     # NPM configuration
```

## 🔗 Useful Links

- **Main Docs**: [LEGACY_MUSIC_CATALOG.md](./LEGACY_MUSIC_CATALOG.md)
- **Integration Guide**: [LEGACY_MUSIC_CATALOG_INTEGRATION.md](./LEGACY_MUSIC_CATALOG_INTEGRATION.md)
- **Implementation Summary**: [LEGACY_MUSIC_CATALOG_SUMMARY.md](./LEGACY_MUSIC_CATALOG_SUMMARY.md)
- **Tests**: `../test/LegacyMusicCatalog.test.js`
- **Contracts**: `../contracts/`

## ⚡ Common Issues & Solutions

### Issue: "Cannot find module"
```bash
# Solution: Reinstall dependencies
npm install --legacy-peer-deps
```

### Issue: "Hardhat not found"
```bash
# Solution: Use npx
npx hardhat compile
npx hardhat test
```

### Issue: "Insufficient funds"
```bash
# Solution: Get testnet ETH
# Mumbai: https://faucet.polygon.technology/
# Sepolia: https://sepoliafaucet.com/
```

### Issue: "Transaction reverted"
```javascript
// Solution: Check error message
try {
  await catalog.mintMusicAsset(...);
} catch (error) {
  console.error('Error:', error.message);
}
```

### Issue: "Gas estimation failed"
```javascript
// Solution: Add manual gas limit
await catalog.distributeRoyalties(tokenId, {
  value: amount,
  gasLimit: 500000
});
```

## 💡 Pro Tips

1. **Batch operations** when possible to save gas
2. **Use events** for off-chain indexing
3. **Cache frequently accessed data** off-chain
4. **Monitor gas prices** before transactions
5. **Test with small amounts** first
6. **Keep documentation updated** with deployment addresses
7. **Use version tags** for releases
8. **Maintain changelog** of updates

## 🎓 Learning Resources

### Beginner Level
- How to connect wallet
- Basic NFT concepts
- Understanding gas fees
- Reading blockchain transactions

### Intermediate Level
- Smart contract interactions
- Event monitoring
- Revenue distribution mechanics
- Testing strategies

### Advanced Level
- Gas optimization
- Contract upgrades
- Integration patterns
- Security auditing

## 📞 Support

For questions or issues:
1. Check the main documentation
2. Review test files for examples
3. Search existing issues on GitHub
4. Create a new issue with details

---

**Version**: 1.0.0  
**Last Updated**: December 2025  
**Status**: Ready for Deployment

*All actions are immutable, irreversible, and omni-protected.*
