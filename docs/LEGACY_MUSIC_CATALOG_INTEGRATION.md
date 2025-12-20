# Legacy Music Catalog Integration Examples

This document provides practical examples of integrating with the Legacy Music Catalog system.

## Table of Contents
- [Quick Start](#quick-start)
- [Frontend Integration](#frontend-integration)
- [Heir Dashboard](#heir-dashboard)
- [Revenue Distribution](#revenue-distribution)
- [Asset Vaults](#asset-vaults)
- [Event Listeners](#event-listeners)

## Quick Start

### Install Dependencies

```bash
npm install ethers
```

### Connect to Contracts

```javascript
import { ethers } from 'ethers';

// Contract addresses (replace with deployed addresses)
const LEGACY_COIN_ADDRESS = "0x...";
const CATALOG_ADDRESS = "0x...";

// ABIs (import from artifacts after compilation)
import LegacyCoinABI from './artifacts/contracts/LegacyCoin.sol/LegacyCoin.json';
import CatalogABI from './artifacts/contracts/LegacyMusicCatalog.sol/LegacyMusicCatalog.json';

// Connect to provider
const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
const signer = await provider.getSigner();

// Contract instances
const legacyCoin = new ethers.Contract(
  LEGACY_COIN_ADDRESS,
  LegacyCoinABI.abi,
  signer
);

const catalog = new ethers.Contract(
  CATALOG_ADDRESS,
  CatalogABI.abi,
  signer
);
```

## Frontend Integration

### Display Music Asset Gallery

```javascript
async function displayMusicAssets() {
  const totalSupply = await catalog.totalSupply();
  
  for (let tokenId = 0; tokenId < totalSupply; tokenId++) {
    const asset = await catalog.getMusicAsset(tokenId);
    
    console.log({
      tokenId,
      title: asset.songTitle,
      artist: asset.artistName,
      album: asset.albumName,
      rarity: getRarityName(asset.rarity),
      catalog: getCatalogName(asset.catalog),
      frequency: `${asset.resonanceFrequency} Hz`,
      secured: asset.isPhysicallySecured && asset.isDigitallyMirrored
    });
  }
}

function getRarityName(rarity) {
  const names = ['COMMON', 'UNCOMMON', 'RARE', 'EPIC', 'LEGENDARY', 'PLATINUM', 'COSMIC'];
  return names[rarity] || 'UNKNOWN';
}

function getCatalogName(catalog) {
  const names = ['Michael Jackson', 'Beatles', 'Prince', 'Sony Catalog', 'Other'];
  return names[catalog] || 'UNKNOWN';
}
```

### Display Individual Asset Card

```jsx
import React, { useEffect, useState } from 'react';

function MusicAssetCard({ tokenId, catalog }) {
  const [asset, setAsset] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    async function loadAsset() {
      try {
        const data = await catalog.getMusicAsset(tokenId);
        setAsset(data);
      } catch (error) {
        console.error('Failed to load asset:', error);
      } finally {
        setLoading(false);
      }
    }
    
    loadAsset();
  }, [tokenId]);
  
  if (loading) return <div>Loading...</div>;
  if (!asset) return <div>Asset not found</div>;
  
  return (
    <div className="asset-card">
      <h2>{asset.songTitle}</h2>
      <h3>{asset.artistName}</h3>
      <p className="album">{asset.albumName}</p>
      <div className="metadata">
        <span className={`rarity rarity-${asset.rarity}`}>
          {getRarityName(asset.rarity)}
        </span>
        <span className="frequency">{asset.resonanceFrequency} Hz</span>
        {asset.isPhysicallySecured && <span className="badge">🔒 Secured</span>}
      </div>
      <p className="description">{asset.description}</p>
      <div className="heirs">
        <h4>Heirs & Stakeholders</h4>
        {asset.heirs.map((heir, idx) => (
          <div key={heir}>
            {heir.slice(0, 6)}...{heir.slice(-4)} 
            ({(asset.heirShares[idx] / 100).toFixed(1)}%)
          </div>
        ))}
      </div>
    </div>
  );
}
```

## Heir Dashboard

### Complete Revenue Dashboard

```javascript
async function getHeirDashboard(heirAddress) {
  const dashboard = await catalog.getRevenueDashboard(heirAddress);
  
  const assetDetails = await Promise.all(
    dashboard.assetTokenIds.map(async (tokenId) => {
      const asset = await catalog.getMusicAsset(tokenId);
      const earnings = await catalog.getHeirEarnings(tokenId, heirAddress);
      
      return {
        tokenId: tokenId.toString(),
        songTitle: asset.songTitle,
        artistName: asset.artistName,
        rarity: getRarityName(asset.rarity),
        earnings: ethers.formatEther(earnings),
        frequency: asset.resonanceFrequency.toString()
      };
    })
  );
  
  return {
    totalEarnings: ethers.formatEther(dashboard.totalEarnings),
    pendingEarnings: ethers.formatEther(dashboard.pendingEarnings),
    lastClaim: new Date(Number(dashboard.lastClaim) * 1000).toLocaleString(),
    assets: assetDetails
  };
}

// Usage
const dashboard = await getHeirDashboard("0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb");
console.log('Total Earnings:', dashboard.totalEarnings, 'ETH');
console.log('Pending:', dashboard.pendingEarnings, 'ETH');
console.log('Assets:', dashboard.assets.length);
```

### React Dashboard Component

```jsx
function HeirDashboard({ heirAddress, catalog }) {
  const [dashboard, setDashboard] = useState(null);
  const [claiming, setClaiming] = useState(false);
  
  useEffect(() => {
    loadDashboard();
  }, [heirAddress]);
  
  async function loadDashboard() {
    const data = await getHeirDashboard(heirAddress);
    setDashboard(data);
  }
  
  async function handleClaim() {
    if (claiming) return;
    
    setClaiming(true);
    try {
      const tx = await catalog.claimHeirEarnings();
      await tx.wait();
      alert('Earnings claimed successfully!');
      await loadDashboard(); // Refresh
    } catch (error) {
      console.error('Claim failed:', error);
      alert('Failed to claim earnings');
    } finally {
      setClaiming(false);
    }
  }
  
  if (!dashboard) return <div>Loading dashboard...</div>;
  
  return (
    <div className="heir-dashboard">
      <h1>Revenue Dashboard</h1>
      
      <div className="stats">
        <div className="stat-card">
          <h3>Total Earnings</h3>
          <p className="amount">{dashboard.totalEarnings} ETH</p>
        </div>
        
        <div className="stat-card pending">
          <h3>Pending Earnings</h3>
          <p className="amount">{dashboard.pendingEarnings} ETH</p>
          {parseFloat(dashboard.pendingEarnings) > 0 && (
            <button onClick={handleClaim} disabled={claiming}>
              {claiming ? 'Claiming...' : 'Claim Earnings'}
            </button>
          )}
        </div>
        
        <div className="stat-card">
          <h3>Last Claim</h3>
          <p>{dashboard.lastClaim}</p>
        </div>
      </div>
      
      <div className="assets-section">
        <h2>Your Assets</h2>
        <div className="assets-grid">
          {dashboard.assets.map((asset) => (
            <div key={asset.tokenId} className="asset-item">
              <h3>{asset.songTitle}</h3>
              <p>{asset.artistName}</p>
              <span className="rarity">{asset.rarity}</span>
              <p className="earnings">Earned: {asset.earnings} ETH</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
```

## Revenue Distribution

### Distribute Royalties

```javascript
async function distributeRoyalties(tokenId, amount) {
  // Convert ETH to wei
  const valueInWei = ethers.parseEther(amount.toString());
  
  // Send transaction
  const tx = await catalog.distributeRoyalties(tokenId, {
    value: valueInWei
  });
  
  console.log('Distribution transaction:', tx.hash);
  const receipt = await tx.wait();
  console.log('Confirmed in block:', receipt.blockNumber);
  
  return receipt;
}

// Example: Distribute 10 ETH to token ID 0
await distributeRoyalties(0, "10");
```

### Batch Distribution

```javascript
async function batchDistribute(distributions) {
  const results = [];
  
  for (const { tokenId, amount } of distributions) {
    try {
      const receipt = await distributeRoyalties(tokenId, amount);
      results.push({ tokenId, success: true, receipt });
    } catch (error) {
      results.push({ tokenId, success: false, error: error.message });
    }
  }
  
  return results;
}

// Usage
const distributions = [
  { tokenId: 0, amount: "10" },   // Billie Jean
  { tokenId: 1, amount: "15" },   // Hey Jude
  { tokenId: 2, amount: "20" }    // Purple Rain
];

const results = await batchDistribute(distributions);
console.log('Distribution results:', results);
```

## Asset Vaults

### Query Vault Information

```javascript
async function getVaultDetails(vaultId) {
  const vault = await catalog.getVault(vaultId);
  
  const assetDetails = await Promise.all(
    vault.storedAssets.map(async (tokenId) => {
      const asset = await catalog.getMusicAsset(tokenId);
      return {
        tokenId: tokenId.toString(),
        songTitle: asset.songTitle,
        artistName: asset.artistName
      };
    })
  );
  
  return {
    vaultId,
    location: vault.vaultLocation,
    qrCode: vault.qrCodeURI,
    isActive: vault.isActive,
    lastAudit: new Date(Number(vault.lastAudit) * 1000).toLocaleString(),
    totalAssets: vault.storedAssets.length,
    assets: assetDetails
  };
}

// Usage
const vaultInfo = await getVaultDetails(0);
console.log('Vault Location:', vaultInfo.location);
console.log('Assets Secured:', vaultInfo.totalAssets);
```

### Create New Vault

```javascript
async function createSecureVault(location, qrCodeURI) {
  const tx = await catalog.createVault(location, qrCodeURI);
  const receipt = await tx.wait();
  
  // Extract vaultId from event
  const event = receipt.logs.find(log => 
    log.topics[0] === ethers.id("VaultCreated(uint256,string)")
  );
  
  // Decode event to get vaultId
  const vaultId = ethers.AbiCoder.defaultAbiCoder().decode(
    ['uint256'],
    event.topics[1]
  )[0];
  
  console.log('Created vault:', vaultId);
  return vaultId;
}
```

## Event Listeners

### Listen for Royalty Distributions

```javascript
// Listen for RoyaltyDistributed events
catalog.on("RoyaltyDistributed", (tokenId, amount, heirCount, event) => {
  console.log(`Royalty distributed to asset #${tokenId}`);
  console.log(`Amount: ${ethers.formatEther(amount)} ETH`);
  console.log(`Recipients: ${heirCount} heirs`);
});

// Listen for heir claims
catalog.on("HeirEarningsClaimed", (heirAddress, amount, event) => {
  console.log(`Heir ${heirAddress} claimed ${ethers.formatEther(amount)} ETH`);
});
```

### Listen for New Assets

```javascript
catalog.on("MusicAssetMinted", async (tokenId, songTitle, rarity, catalog, event) => {
  console.log(`New asset minted: #${tokenId}`);
  console.log(`Title: ${songTitle}`);
  console.log(`Rarity: ${getRarityName(rarity)}`);
  
  // Fetch full details
  const asset = await catalog.getMusicAsset(tokenId);
  console.log('Full asset details:', asset);
});
```

### Monitor Blueprint Completions

```javascript
catalog.on("AcquisitionCompleted", (blueprintId, paidValue, event) => {
  console.log(`Acquisition #${blueprintId} completed!`);
  console.log(`Paid: ${ethers.formatEther(paidValue)} ETH`);
  
  // Load blueprint details
  catalog.getBlueprint(blueprintId).then(blueprint => {
    console.log(`Catalog: ${blueprint.catalogName}`);
    console.log(`Target: ${ethers.formatEther(blueprint.targetValue)} ETH`);
    console.log(`Overcompensation ratio: ${
      Number(paidValue) / Number(blueprint.targetValue)
    }x`);
  });
});
```

## Advanced Usage

### Calculate Revenue Distribution Preview

```javascript
async function previewDistribution(tokenId, amount) {
  const asset = await catalog.getMusicAsset(tokenId);
  const communityPercentage = await catalog.communityArtFundPercentage();
  
  const totalValue = ethers.parseEther(amount.toString());
  const communityShare = (totalValue * communityPercentage) / 10000n;
  const heirShare = totalValue - communityShare;
  
  const heirDistributions = asset.heirs.map((heir, idx) => ({
    address: heir,
    percentage: Number(asset.heirShares[idx]) / 100,
    amount: ethers.formatEther(
      (heirShare * asset.heirShares[idx]) / 10000n
    )
  }));
  
  return {
    totalAmount: amount,
    communityFund: ethers.formatEther(communityShare),
    heirDistributions
  };
}

// Usage
const preview = await previewDistribution(0, "100");
console.log('Distribution preview:', preview);
```

### Monitor Gas Efficiency

```javascript
async function distributionWithGasTracking(tokenId, amount) {
  const valueInWei = ethers.parseEther(amount.toString());
  
  const gasEstimate = await catalog.distributeRoyalties.estimateGas(
    tokenId,
    { value: valueInWei }
  );
  
  console.log('Estimated gas:', gasEstimate.toString());
  
  const tx = await catalog.distributeRoyalties(tokenId, {
    value: valueInWei,
    gasLimit: gasEstimate * 120n / 100n // 20% buffer
  });
  
  const receipt = await tx.wait();
  console.log('Actual gas used:', receipt.gasUsed.toString());
  console.log('Gas efficiency:', 
    (Number(receipt.gasUsed) / Number(gasEstimate) * 100).toFixed(2) + '%'
  );
  
  return receipt;
}
```

## Testing Integration

### Local Testing Setup

```javascript
import { ethers } from 'hardhat';

describe('Integration Test', function() {
  let legacyCoin, catalog;
  let owner, heir1, heir2;
  
  beforeEach(async function() {
    [owner, heir1, heir2] = await ethers.getSigners();
    
    // Deploy contracts
    const LegacyCoin = await ethers.getContractFactory("LegacyCoin");
    legacyCoin = await LegacyCoin.deploy(
      ethers.parseUnits("1000000000", 18)
    );
    
    const Catalog = await ethers.getContractFactory("LegacyMusicCatalog");
    catalog = await Catalog.deploy();
    
    await catalog.setLegacyCoinAddress(await legacyCoin.getAddress());
  });
  
  it('should complete full workflow', async function() {
    // Mint asset
    await catalog.mintMusicAsset(
      owner.address,
      "Test Song",
      "Test Artist",
      "Test Album",
      "Description",
      "ipfs://test",
      4, // LEGENDARY
      0, // MICHAEL_JACKSON
      528,
      ethers.parseEther("10"),
      [heir1.address, heir2.address],
      [6000, 4000]
    );
    
    // Distribute royalties
    await catalog.distributeRoyalties(0, {
      value: ethers.parseEther("10")
    });
    
    // Check heir earnings
    const dashboard1 = await catalog.getRevenueDashboard(heir1.address);
    const dashboard2 = await catalog.getRevenueDashboard(heir2.address);
    
    console.log('Heir 1 pending:', ethers.formatEther(dashboard1.pendingEarnings));
    console.log('Heir 2 pending:', ethers.formatEther(dashboard2.pendingEarnings));
  });
});
```

---

## Additional Resources

- **Full Documentation**: [LEGACY_MUSIC_CATALOG.md](./LEGACY_MUSIC_CATALOG.md)
- **Smart Contracts**: `/contracts/LegacyCoin.sol`, `/contracts/LegacyMusicCatalog.sol`
- **Tests**: `/test/LegacyMusicCatalog.test.js`
- **Deployment Script**: `/scripts/deployLegacyCatalog.js`

For questions or support, refer to the main documentation or create an issue in the repository.
