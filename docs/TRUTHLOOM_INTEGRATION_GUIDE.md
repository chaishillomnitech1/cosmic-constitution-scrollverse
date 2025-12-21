# TruthLoom Integration Guide

## 🚀 Quick Start

This guide provides step-by-step instructions for integrating and using the TruthLoom decentralized transparency framework.

## Prerequisites

- Node.js 16+ and npm
- Hardhat development environment
- Web3 wallet (MetaMask recommended)
- IPFS node or Pinata account for storage
- Basic understanding of Ethereum and smart contracts

## Installation

### 1. Install Dependencies

```bash
npm install --legacy-peer-deps
```

### 2. Configure Environment

Create a `.env` file:

```env
# Network Configuration
PRIVATE_KEY=your_private_key_here
MUMBAI_RPC_URL=https://rpc-mumbai.maticvigil.com
SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/YOUR_INFURA_KEY

# IPFS Configuration
IPFS_API_URL=https://ipfs.infura.io:5001
PINATA_API_KEY=your_pinata_api_key
PINATA_SECRET_KEY=your_pinata_secret_key

# Arweave Configuration (Optional)
ARWEAVE_WALLET_PATH=./arweave-wallet.json

# Contract Addresses (after deployment)
TRUTHLOOM_ADDRESS=
```

## Deployment

### Deploy to Local Network

```bash
# Start local Hardhat node
npx hardhat node

# In another terminal, deploy
npm run deploy:truthloom:local
```

### Deploy to Testnet

```bash
# Mumbai (Polygon testnet)
npm run deploy:truthloom:mumbai

# Sepolia (Ethereum testnet)
npm run deploy:truthloom:sepolia
```

### Post-Deployment Configuration

After deployment, configure roles:

```javascript
const { ethers } = require("hardhat");

async function setupRoles() {
  const truthLoom = await ethers.getContractAt("TruthLoom", TRUTHLOOM_ADDRESS);
  
  // Grant legal admin role
  const LEGAL_ADMIN_ROLE = await truthLoom.LEGAL_ADMIN_ROLE();
  await truthLoom.grantRole(LEGAL_ADMIN_ROLE, LEGAL_ADMIN_ADDRESS);
  
  // Grant compensation admin role
  const COMPENSATION_ADMIN_ROLE = await truthLoom.COMPENSATION_ADMIN_ROLE();
  await truthLoom.grantRole(COMPENSATION_ADMIN_ROLE, COMPENSATION_ADMIN_ADDRESS);
  
  console.log("✅ Roles configured successfully");
}

setupRoles();
```

## IPFS Integration

### Option 1: Using Pinata (Recommended for Production)

```javascript
const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');

async function uploadToPinata(data) {
  const url = 'https://api.pinata.cloud/pinning/pinJSONToIPFS';
  
  const response = await axios.post(url, data, {
    headers: {
      'Content-Type': 'application/json',
      'pinata_api_key': process.env.PINATA_API_KEY,
      'pinata_secret_api_key': process.env.PINATA_SECRET_KEY
    }
  });
  
  return response.data.IpfsHash;
}

// Example usage
const recordData = {
  title: "Systemic Harm Documentation",
  description: "Evidence of institutional misconduct",
  evidence: [
    { type: "document", hash: "..." },
    { type: "testimony", hash: "..." }
  ],
  timestamp: new Date().toISOString()
};

const ipfsHash = await uploadToPinata(recordData);
console.log("IPFS Hash:", ipfsHash);
```

### Option 2: Using Local IPFS Node

```javascript
const { create } = require('ipfs-http-client');

async function uploadToIPFS(data) {
  const ipfs = create({ url: process.env.IPFS_API_URL });
  
  const { cid } = await ipfs.add(JSON.stringify(data));
  
  // Pin the content
  await ipfs.pin.add(cid);
  
  return cid.toString();
}
```

## Arweave Integration (Optional)

For permanent storage:

```javascript
const Arweave = require('arweave');
const fs = require('fs');

async function uploadToArweave(data) {
  const arweave = Arweave.init({
    host: 'arweave.net',
    port: 443,
    protocol: 'https'
  });
  
  // Load wallet
  const wallet = JSON.parse(
    fs.readFileSync(process.env.ARWEAVE_WALLET_PATH, 'utf-8')
  );
  
  // Create transaction
  const transaction = await arweave.createTransaction({
    data: JSON.stringify(data)
  }, wallet);
  
  // Add tags
  transaction.addTag('App-Name', 'TruthLoom');
  transaction.addTag('Content-Type', 'application/json');
  
  // Sign and post
  await arweave.transactions.sign(transaction, wallet);
  await arweave.transactions.post(transaction);
  
  return transaction.id;
}
```

## Usage Examples

### 1. Submit a Transparency Record

```javascript
const { ethers } = require("hardhat");

async function submitRecord() {
  const truthLoom = await ethers.getContractAt("TruthLoom", TRUTHLOOM_ADDRESS);
  
  // Prepare data
  const recordData = {
    title: "Evidence of Misconduct",
    description: "Detailed documentation",
    evidence: ["doc1.pdf", "testimony1.txt"],
    timestamp: Date.now()
  };
  
  // Upload to IPFS
  const ipfsHash = await uploadToPinata(recordData);
  
  // Encrypt victim data
  const victimData = {
    name: "Protected Identity",
    contact: "encrypted@email.com"
  };
  const encryptedVictimData = ethers.hexlify(
    ethers.toUtf8Bytes(JSON.stringify(victimData))
  );
  
  // Submit to blockchain
  const tx = await truthLoom.submitRecord(
    ipfsHash,
    1, // SensitivityLevel.Protected
    encryptedVictimData
  );
  
  const receipt = await tx.wait();
  console.log("✅ Record submitted:", receipt.hash);
  
  return receipt;
}
```

### 2. Register as a Verification Node

```javascript
async function registerAsVerifier() {
  const truthLoom = await ethers.getContractAt("TruthLoom", TRUTHLOOM_ADDRESS);
  
  const tx = await truthLoom.registerVerifier();
  await tx.wait();
  
  console.log("✅ Registered as verification node");
  
  // Check status
  const node = await truthLoom.verificationNodes(myAddress);
  console.log("Reputation Score:", node.reputationScore.toString());
  console.log("Active:", node.isActive);
}
```

### 3. Verify a Record

```javascript
async function verifyRecord(recordId) {
  const truthLoom = await ethers.getContractAt("TruthLoom", TRUTHLOOM_ADDRESS);
  
  // Get record details
  const record = await truthLoom.getRecord(recordId);
  console.log("Record IPFS Hash:", record.ipfsHash);
  
  // Fetch and verify data from IPFS
  const data = await fetchFromIPFS(record.ipfsHash);
  
  // Perform verification (implement your logic)
  const isValid = await performVerification(data);
  
  if (isValid) {
    // Verify on-chain
    const tx = await truthLoom.verifyRecord(recordId);
    await tx.wait();
    console.log("✅ Record verified");
  } else {
    // Reject on-chain
    const tx = await truthLoom.rejectRecord(recordId);
    await tx.wait();
    console.log("❌ Record rejected");
  }
}
```

### 4. Submit Compensation Claim

```javascript
async function submitCompensationClaim(recordId, amount) {
  const truthLoom = await ethers.getContractAt("TruthLoom", TRUTHLOOM_ADDRESS);
  
  // Encrypt victim identity
  const victimIdentity = {
    fullName: "John Doe",
    documentId: "XXXX-XXXX",
    proofOfImpact: "medical_records_hash"
  };
  
  const encryptedIdentity = ethers.hexlify(
    ethers.toUtf8Bytes(JSON.stringify(victimIdentity))
  );
  
  // Submit claim
  const claimAmount = ethers.parseEther(amount);
  
  const tx = await truthLoom.submitCompensationClaim(
    recordId,
    encryptedIdentity,
    claimAmount
  );
  
  const receipt = await tx.wait();
  console.log("✅ Compensation claim submitted");
  
  return receipt;
}
```

### 5. Process Compensation (Admin Only)

```javascript
async function processCompensation(claimId) {
  const truthLoom = await ethers.getContractAt("TruthLoom", TRUTHLOOM_ADDRESS);
  
  // Get claim details
  const claim = await truthLoom.compensationClaims(claimId);
  
  console.log("Processing claim for amount:", 
    ethers.formatEther(claim.claimAmount), "ETH");
  
  // Process payment
  const tx = await truthLoom.processCompensation(claimId, {
    value: claim.claimAmount
  });
  
  await tx.wait();
  console.log("✅ Compensation paid");
}
```

### 6. Open Legal Case (Legal Admin Only)

```javascript
async function openLegalCase(recordId, caseNumber) {
  const truthLoom = await ethers.getContractAt("TruthLoom", TRUTHLOOM_ADDRESS);
  
  // Prepare case documentation
  const caseDetails = {
    caseNumber: caseNumber,
    jurisdiction: "Federal Court",
    plaintiffs: ["Protected Identity 1", "Protected Identity 2"],
    charges: ["Systemic Negligence", "Violation of Rights"],
    filingDate: new Date().toISOString()
  };
  
  // Upload to IPFS
  const caseDetailsHash = await uploadToPinata(caseDetails);
  
  // Open case on-chain
  const tx = await truthLoom.openLegalCase(
    recordId,
    caseNumber,
    caseDetailsHash
  );
  
  const receipt = await tx.wait();
  console.log("✅ Legal case opened");
  
  return receipt;
}
```

### 7. Replicate Record (Regeneration Protocol)

```javascript
async function replicateRecord(recordId) {
  const truthLoom = await ethers.getContractAt("TruthLoom", TRUTHLOOM_ADDRESS);
  
  // Get original record
  const record = await truthLoom.getRecord(recordId);
  
  // Fetch data from IPFS
  const data = await fetchFromIPFS(record.ipfsHash);
  
  // Upload replica to different IPFS node/gateway
  const replicaHash = await uploadToBackupIPFS(data);
  
  // Register replica on-chain
  const tx = await truthLoom.replicateRecord(recordId, replicaHash);
  await tx.wait();
  
  console.log("✅ Record replicated:", replicaHash);
}
```

## Security Best Practices

### 1. Encryption

Use strong encryption for sensitive data:

```javascript
const crypto = require('crypto');

function encryptSensitiveData(data, publicKey) {
  const encrypted = crypto.publicEncrypt(
    {
      key: publicKey,
      padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
      oaepHash: "sha256",
    },
    Buffer.from(JSON.stringify(data))
  );
  
  return encrypted.toString('base64');
}

function decryptSensitiveData(encryptedData, privateKey) {
  const decrypted = crypto.privateDecrypt(
    {
      key: privateKey,
      padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
      oaepHash: "sha256",
    },
    Buffer.from(encryptedData, 'base64')
  );
  
  return JSON.parse(decrypted.toString());
}
```

### 2. Zero-Knowledge Proofs (Future Enhancement)

```javascript
// Example using snarkjs (to be implemented)
const snarkjs = require('snarkjs');

async function generateVerificationProof(victimData) {
  // Generate proof without revealing identity
  const { proof, publicSignals } = await snarkjs.groth16.fullProve(
    victimData,
    "circuit.wasm",
    "circuit_final.zkey"
  );
  
  return { proof, publicSignals };
}
```

### 3. Multi-Signature Control

```javascript
// Use Gnosis Safe for admin operations
const Safe = require('@safe-global/safe-core-sdk');

async function setupMultiSigAdmin() {
  // Configure 3-of-5 multisig for critical operations
  const safeFactory = await Safe.create({
    ethers,
    safeAddress: SAFE_ADDRESS
  });
  
  // Grant roles to multisig
  await truthLoom.grantRole(LEGAL_ADMIN_ROLE, SAFE_ADDRESS);
}
```

## Frontend Integration

### React Component Example

```jsx
import { ethers } from 'ethers';
import TruthLoomABI from './abis/TruthLoom.json';

function TruthLoomDApp() {
  const [records, setRecords] = useState([]);
  
  async function submitRecord(formData) {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const contract = new ethers.Contract(
      TRUTHLOOM_ADDRESS,
      TruthLoomABI,
      signer
    );
    
    // Upload to IPFS
    const ipfsHash = await uploadToPinata(formData);
    
    // Submit to blockchain
    const tx = await contract.submitRecord(
      ipfsHash,
      formData.sensitivityLevel,
      formData.encryptedVictimData
    );
    
    await tx.wait();
    alert('Record submitted successfully!');
  }
  
  return (
    <div>
      <h1>TruthLoom - Submit Evidence</h1>
      <form onSubmit={submitRecord}>
        {/* Form fields */}
      </form>
    </div>
  );
}
```

## Monitoring & Analytics

### Event Listening

```javascript
async function monitorEvents() {
  const truthLoom = await ethers.getContractAt("TruthLoom", TRUTHLOOM_ADDRESS);
  
  // Listen for record submissions
  truthLoom.on("RecordSubmitted", (recordId, submitter, ipfsHash) => {
    console.log("New record submitted:", {
      recordId,
      submitter,
      ipfsHash
    });
  });
  
  // Listen for verifications
  truthLoom.on("RecordVerified", (recordId, verifier, count) => {
    console.log("Record verified:", {
      recordId,
      verifier,
      verificationCount: count
    });
  });
  
  // Listen for compensation claims
  truthLoom.on("CompensationClaimed", (claimId, recordId, amount) => {
    console.log("Compensation claimed:", {
      claimId,
      recordId,
      amount: ethers.formatEther(amount)
    });
  });
}
```

## Troubleshooting

### Common Issues

1. **Transaction Reverted: "Record not verified"**
   - Ensure record has minimum 3 verifications
   - Check verification status with `getRecord()`

2. **Transaction Reverted: "Already verified by this node"**
   - Each verifier can only verify a record once
   - Use different verifier account

3. **IPFS Upload Fails**
   - Check Pinata API credentials
   - Verify IPFS node connectivity
   - Try alternative gateway

4. **Insufficient Funds for Compensation**
   - Fund compensation pool first
   - Check contract balance

## Support & Resources

- [TruthLoom Framework Documentation](./TRUTHLOOM_FRAMEWORK.md)
- [API Reference](../API_DOCUMENTATION.md)
- [Security Guidelines](../SECURITY.md)
- [Community Discord](#)
- [GitHub Issues](https://github.com/chaishillomnitech1/cosmic-constitution-scrollverse/issues)

## Contributing

Contributions to TruthLoom are welcome! Please see our contribution guidelines.

---

**TruthLoom: Weaving Truth, Justice, and Transparency into the Fabric of the Blockchain.**
