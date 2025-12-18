# 🏰 Mansion-Chain Integration Guide

## Quick Start Integration

This guide provides step-by-step instructions for integrating the Mansion-Chain ecosystem into your applications.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Contract Addresses](#contract-addresses)
3. [Web3 Integration](#web3-integration)
4. [Frontend Examples](#frontend-examples)
5. [Backend Integration](#backend-integration)
6. [Unreal Engine 5 Integration](#unreal-engine-5-integration)
7. [Mobile App Integration](#mobile-app-integration)
8. [API Endpoints](#api-endpoints)

---

## Prerequisites

```bash
# Required tools
- Node.js v18+
- ethers.js v6+
- React 18+ (for frontend)
- Web3 wallet (MetaMask, WalletConnect, etc.)
```

```bash
# Install dependencies
npm install ethers@6 @rainbow-me/rainbowkit wagmi viem
```

---

## Contract Addresses

### Testnet (Mumbai)
```javascript
const CONTRACTS = {
  MansionChainNFT: "0x...",
  PropertySigilCoin: "0x...",
  MansionChainDAO: "0x..."
};
```

### Mainnet (Ethereum)
```javascript
const CONTRACTS = {
  MansionChainNFT: "0x...",
  PropertySigilCoin: "0x...",
  MansionChainDAO: "0x..."
};
```

---

## Web3 Integration

### 1. Connect Wallet

```javascript
import { ethers } from 'ethers';

async function connectWallet() {
  if (typeof window.ethereum !== 'undefined') {
    const provider = new ethers.BrowserProvider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    const signer = await provider.getSigner();
    return { provider, signer };
  }
  throw new Error("Please install MetaMask");
}
```

### 2. Initialize Contracts

```javascript
import MansionChainNFT_ABI from './abis/MansionChainNFT.json';
import PropertySigilCoin_ABI from './abis/PropertySigilCoin.json';
import MansionChainDAO_ABI from './abis/MansionChainDAO.json';

async function initializeContracts(signer) {
  const mansionNFT = new ethers.Contract(
    CONTRACTS.MansionChainNFT,
    MansionChainNFT_ABI,
    signer
  );
  
  const sigilCoin = new ethers.Contract(
    CONTRACTS.PropertySigilCoin,
    PropertySigilCoin_ABI,
    signer
  );
  
  const dao = new ethers.Contract(
    CONTRACTS.MansionChainDAO,
    MansionChainDAO_ABI,
    signer
  );
  
  return { mansionNFT, sigilCoin, dao };
}
```

---

## Frontend Examples

### React Component: Property Display

```jsx
import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';

function PropertyDisplay({ tokenId }) {
  const [property, setProperty] = useState(null);
  const [hotspots, setHotspots] = useState([]);
  const [chronicle, setChronicle] = useState(null);

  useEffect(() => {
    loadProperty();
  }, [tokenId]);

  async function loadProperty() {
    const { provider } = await connectWallet();
    const contract = new ethers.Contract(
      CONTRACTS.MansionChainNFT,
      MansionChainNFT_ABI,
      provider
    );

    // Load property data
    const propertyData = await contract.getPropertyTwin(tokenId);
    setProperty(propertyData);

    // Load hotspots
    const hotspotsData = await contract.getHotspots(tokenId);
    setHotspots(hotspotsData);

    // Load chronicle
    const chronicleData = await contract.getChronicle(tokenId);
    setChronicle(chronicleData);
  }

  if (!property) return <div>Loading...</div>;

  return (
    <div className="property-card">
      <h1>{property.propertyName}</h1>
      <p>{property.location}</p>
      <p>Built: {property.constructionYear}</p>
      <p>Architect: {property.architect}</p>
      <p>Size: {property.squareFootage.toLocaleString()} sq ft</p>
      
      <div className="hotspots">
        <h2>Interactive Hotspots</h2>
        {hotspots.map((hotspot, index) => (
          <div key={index} className="hotspot">
            <h3>{hotspot.title}</h3>
            <p>{hotspot.architecturalHighlight}</p>
            <p><strong>Builder:</strong> {hotspot.builderCredits}</p>
            <p><strong>Materials:</strong> {hotspot.materialHistory}</p>
          </div>
        ))}
      </div>

      {chronicle && (
        <div className="chronicle">
          <h2>{chronicle.chronicleTitle}</h2>
          <video src={chronicle.videoContentURI} controls />
          <p>{chronicle.historicSignificance}</p>
          <p><strong>Engineering Feats:</strong> {chronicle.engineeringFeats}</p>
          {chronicle.fractionalMediaRights && (
            <p>Media Rights: {chronicle.mediaRightsPercentage / 100}%</p>
          )}
        </div>
      )}
    </div>
  );
}

export default PropertyDisplay;
```

### React Component: QR Code Scanner

```jsx
import React, { useState } from 'react';
import QrScanner from 'react-qr-scanner';

function QRScanner() {
  const [scannedData, setScannedData] = useState(null);
  const [property, setProperty] = useState(null);

  async function handleScan(data) {
    if (data) {
      setScannedData(data.text);
      
      // Get property from QR code hash
      const { provider } = await connectWallet();
      const contract = new ethers.Contract(
        CONTRACTS.MansionChainNFT,
        MansionChainNFT_ABI,
        provider
      );
      
      const tokenId = await contract.getPropertyByQR(data.text);
      const propertyData = await contract.getPropertyTwin(tokenId);
      setProperty(propertyData);
    }
  }

  function handleError(err) {
    console.error(err);
  }

  return (
    <div className="qr-scanner">
      <h2>Scan Property Plaque</h2>
      <QrScanner
        delay={300}
        onError={handleError}
        onScan={handleScan}
        style={{ width: '100%' }}
      />
      
      {property && (
        <div className="scanned-property">
          <h3>{property.propertyName}</h3>
          <p>{property.location}</p>
          <a href={`/property/${property.tokenId}`}>View Details</a>
        </div>
      )}
    </div>
  );
}

export default QRScanner;
```

### React Component: Virtual Walkthrough Registration

```jsx
import React, { useState, useEffect } from 'react';

function WalkthroughEvents({ tokenId }) {
  const [events, setEvents] = useState([]);
  const [registered, setRegistered] = useState({});

  useEffect(() => {
    loadEvents();
  }, [tokenId]);

  async function loadEvents() {
    const { provider } = await connectWallet();
    const contract = new ethers.Contract(
      CONTRACTS.MansionChainNFT,
      MansionChainNFT_ABI,
      provider
    );

    const eventIds = await contract.getPropertyWalkthroughs(tokenId);
    // Load event details...
    setEvents(eventIds);
  }

  async function registerForEvent(eventId) {
    const { signer } = await connectWallet();
    const contract = new ethers.Contract(
      CONTRACTS.MansionChainNFT,
      MansionChainNFT_ABI,
      signer
    );

    const tx = await contract.registerForWalkthrough(eventId);
    await tx.wait();
    
    setRegistered({ ...registered, [eventId]: true });
  }

  return (
    <div className="walkthrough-events">
      <h2>Virtual Walkthrough Events</h2>
      {events.map(eventId => (
        <div key={eventId} className="event">
          <h3>Event #{eventId}</h3>
          <button 
            onClick={() => registerForEvent(eventId)}
            disabled={registered[eventId]}
          >
            {registered[eventId] ? 'Registered' : 'Register'}
          </button>
        </div>
      ))}
    </div>
  );
}

export default WalkthroughEvents;
```

---

## Backend Integration

### Node.js Backend Example

```javascript
const express = require('express');
const { ethers } = require('ethers');
const app = express();

// Initialize provider
const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

// Initialize contracts
const mansionNFT = new ethers.Contract(
  process.env.MANSION_NFT_ADDRESS,
  MansionChainNFT_ABI,
  wallet
);

// API endpoint: Get property details
app.get('/api/property/:tokenId', async (req, res) => {
  try {
    const tokenId = req.params.tokenId;
    const property = await mansionNFT.getPropertyTwin(tokenId);
    const hotspots = await mansionNFT.getHotspots(tokenId);
    const chronicle = await mansionNFT.getChronicle(tokenId);
    
    res.json({
      property: {
        name: property.propertyName,
        location: property.location,
        type: property.propertyType,
        era: property.era,
        architect: property.architect,
        constructionYear: property.constructionYear.toString(),
        squareFootage: property.squareFootage.toString(),
        unrealEngineModel: property.unrealEngineModelURI,
        qrCode: property.qrCodeHash
      },
      hotspots: hotspots.map(h => ({
        title: h.title,
        description: h.description,
        architecturalHighlight: h.architecturalHighlight,
        builderCredits: h.builderCredits,
        materialHistory: h.materialHistory,
        position: {
          x: h.positionX.toString(),
          y: h.positionY.toString(),
          z: h.positionZ.toString()
        }
      })),
      chronicle: chronicle ? {
        title: chronicle.chronicleTitle,
        storyURI: chronicle.storyContentURI,
        videoURI: chronicle.videoContentURI,
        duration: chronicle.videoDurationSeconds.toString(),
        historicSignificance: chronicle.historicSignificance,
        engineeringFeats: chronicle.engineeringFeats,
        modernSynergies: chronicle.modernSynergies,
        mediaRights: chronicle.fractionalMediaRights,
        mediaRightsPercentage: (chronicle.mediaRightsPercentage / 100).toString()
      } : null
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// API endpoint: Get property by QR code
app.get('/api/property/qr/:qrHash', async (req, res) => {
  try {
    const tokenId = await mansionNFT.getPropertyByQR(req.params.qrHash);
    res.redirect(`/api/property/${tokenId}`);
  } catch (error) {
    res.status(404).json({ error: 'Property not found' });
  }
});

// API endpoint: Get Sigil Coin info
app.get('/api/sigil/:name', async (req, res) => {
  try {
    const sigilCoin = new ethers.Contract(
      process.env.SIGIL_COIN_ADDRESS,
      PropertySigilCoin_ABI,
      provider
    );
    
    const sigil = await sigilCoin.getSigil(req.params.name);
    
    res.json({
      name: sigil.sigilName,
      heritageCrest: sigil.heritageCrest,
      propertyId: sigil.propertyId,
      totalSupply: sigil.totalSupply.toString(),
      mintTimestamp: sigil.mintTimestamp.toString()
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(3000, () => {
  console.log('Mansion-Chain API running on port 3000');
});
```

---

## Unreal Engine 5 Integration

### Blueprint Example

1. **Load Property Model**

```cpp
// C++ Example for loading IPFS model in UE5
#include "HttpModule.h"
#include "Interfaces/IHttpResponse.h"

void APropertyViewer::LoadPropertyModel(FString IPFSHash)
{
    FString URL = FString::Printf(TEXT("https://ipfs.io/ipfs/%s"), *IPFSHash);
    
    TSharedRef<IHttpRequest> Request = FHttpModule::Get().CreateRequest();
    Request->OnProcessRequestComplete().BindUObject(this, &APropertyViewer::OnModelLoaded);
    Request->SetURL(URL);
    Request->SetVerb("GET");
    Request->ProcessRequest();
}

void APropertyViewer::OnModelLoaded(FHttpRequestPtr Request, FHttpResponsePtr Response, bool bWasSuccessful)
{
    if (bWasSuccessful && Response.IsValid())
    {
        // Parse and load 3D model
        TArray<uint8> ModelData = Response->GetContent();
        // Load model into scene...
    }
}
```

2. **Display Hotspots**

```cpp
void APropertyViewer::CreateHotspots(TArray<FHotspotData> Hotspots)
{
    for (const FHotspotData& Hotspot : Hotspots)
    {
        // Create hotspot actor
        AHotspotActor* HotspotActor = GetWorld()->SpawnActor<AHotspotActor>(
            HotspotClass,
            FVector(Hotspot.PositionX, Hotspot.PositionY, Hotspot.PositionZ),
            FRotator::ZeroRotator
        );
        
        HotspotActor->SetTitle(Hotspot.Title);
        HotspotActor->SetDescription(Hotspot.Description);
        HotspotActor->SetArchitecturalHighlight(Hotspot.ArchitecturalHighlight);
    }
}
```

---

## Mobile App Integration

### React Native Example

```jsx
import React, { useState } from 'react';
import { View, Text, Button } from 'react-native';
import { Camera } from 'react-native-camera-kit';
import { ethers } from 'ethers';

function PropertyScanner() {
  const [property, setProperty] = useState(null);

  async function onQRCodeScanned(event) {
    const qrHash = event.nativeEvent.codeStringValue;
    
    // Connect to blockchain
    const provider = new ethers.JsonRpcProvider(RPC_URL);
    const contract = new ethers.Contract(
      CONTRACTS.MansionChainNFT,
      MansionChainNFT_ABI,
      provider
    );
    
    // Get property
    const tokenId = await contract.getPropertyByQR(qrHash);
    const propertyData = await contract.getPropertyTwin(tokenId);
    
    setProperty(propertyData);
  }

  return (
    <View>
      <Camera
        scanBarcode={true}
        onReadCode={onQRCodeScanned}
        style={{ width: '100%', height: 400 }}
      />
      
      {property && (
        <View>
          <Text style={{ fontSize: 24 }}>{property.propertyName}</Text>
          <Text>{property.location}</Text>
          <Text>Architect: {property.architect}</Text>
          <Button title="View in AR" onPress={() => {/* Launch AR view */}} />
        </View>
      )}
    </View>
  );
}

export default PropertyScanner;
```

---

## API Endpoints

### RESTful API Design

```
GET    /api/properties              - List all properties
GET    /api/properties/:id          - Get property details
GET    /api/properties/qr/:hash     - Get property by QR code
GET    /api/properties/:id/hotspots - Get property hotspots
GET    /api/properties/:id/chronicle - Get property chronicle
GET    /api/properties/:id/events   - Get virtual events

GET    /api/sigils                  - List all sigils
GET    /api/sigils/:name            - Get sigil details
GET    /api/sigils/:name/revenue    - Get revenue data

GET    /api/dao/proposals           - List proposals
POST   /api/dao/proposals           - Create proposal
POST   /api/dao/proposals/:id/vote  - Vote on proposal

GET    /api/exhibitions             - List exhibitions
POST   /api/exhibitions/:id/contribute - Contribute to exhibition
```

---

## Event Listeners

### Listen for Contract Events

```javascript
// Listen for property mints
mansionNFT.on("PropertyTwinMinted", (tokenId, propertyName, propertyType, qrCodeHash) => {
  console.log(`New property minted: ${propertyName} (ID: ${tokenId})`);
  // Update database, send notifications, etc.
});

// Listen for chronicle creation
mansionNFT.on("ChronicleCreated", (tokenId, chronicleTitle, videoContentURI) => {
  console.log(`New chronicle: ${chronicleTitle} for property ${tokenId}`);
});

// Listen for walkthrough registration
mansionNFT.on("WalkthroughAttendanceRegistered", (eventId, attendee) => {
  console.log(`Attendee ${attendee} registered for event ${eventId}`);
});

// Listen for DAO proposals
dao.on("ProposalCreated", (proposalId, proposer, proposalType, title) => {
  console.log(`New proposal: ${title} by ${proposer}`);
});
```

---

## Best Practices

### Security
- Always validate input data
- Use environment variables for sensitive data
- Implement rate limiting on API endpoints
- Verify signatures for authenticated actions

### Performance
- Cache frequently accessed data
- Use pagination for large datasets
- Implement lazy loading for 3D models
- Optimize IPFS gateway selection

### UX
- Show loading states during blockchain transactions
- Provide clear error messages
- Implement transaction confirmation flows
- Allow users to track transaction status

---

## Support

For integration support:
- Documentation: `/docs/MANSION_CHAIN_ECOSYSTEM.md`
- Discord: Join our developer community
- Email: dev@mansionchain.xyz
- GitHub Issues: Report bugs and request features

---

**Happy Building! 🏰**
