# TruthLoom Quick Reference Guide

## 🚀 Quick Start Commands

### Deployment
```bash
# Local
npm run deploy:truthloom:local

# Testnet
npm run deploy:truthloom:mumbai
npm run deploy:truthloom:sepolia
```

### Testing
```bash
# Run TruthLoom tests
npx hardhat test test/TruthLoom.test.js

# Run all tests
npm test
```

## 📋 Core Functions

### Record Management

#### Submit Record
```javascript
await truthLoom.submitRecord(
  ipfsHash,           // IPFS content identifier
  sensitivityLevel,   // 0=Public, 1=Protected, 2=HighlyConfidential
  encryptedVictimData // Encrypted victim information
);
```

#### Get Record
```javascript
const record = await truthLoom.getRecord(recordId);
// Returns: ipfsHash, submitter, timestamp, status, sensitivity, verificationCount, isActive
```

#### Get All Records
```javascript
const recordIds = await truthLoom.getAllRecordIds();
```

### Verification Nodes

#### Register as Verifier
```javascript
await truthLoom.registerVerifier();
```

#### Verify Record
```javascript
await truthLoom.verifyRecord(recordId);
```

#### Reject Record
```javascript
await truthLoom.rejectRecord(recordId);
```

#### Get Active Verifiers
```javascript
const verifiers = await truthLoom.getActiveVerifiers();
```

### Compensation

#### Submit Claim
```javascript
await truthLoom.submitCompensationClaim(
  recordId,
  encryptedVictimIdentity,
  claimAmount
);
```

#### Process Payment (Admin)
```javascript
await truthLoom.processCompensation(claimId, {
  value: claimAmount
});
```

#### Fund Pool
```javascript
await truthLoom.fundCompensationPool({
  value: ethers.parseEther("10.0")
});
```

### Legal Cases

#### Open Case (Legal Admin)
```javascript
await truthLoom.openLegalCase(
  recordId,
  caseNumber,
  caseDetailsIpfsHash
);
```

#### Close Case (Legal Admin)
```javascript
await truthLoom.closeLegalCase(caseId);
```

### Regeneration Protocol

#### Replicate Record
```javascript
await truthLoom.replicateRecord(recordId, replicaIpfsHash);
```

#### Get Replicas
```javascript
const replicas = await truthLoom.getRecordReplicas(recordId);
```

## 🔑 Access Roles

### Role Identifiers
```javascript
const DEFAULT_ADMIN_ROLE = await truthLoom.DEFAULT_ADMIN_ROLE();
const VERIFIER_ROLE = await truthLoom.VERIFIER_ROLE();
const LEGAL_ADMIN_ROLE = await truthLoom.LEGAL_ADMIN_ROLE();
const COMPENSATION_ADMIN_ROLE = await truthLoom.COMPENSATION_ADMIN_ROLE();
```

### Grant Role
```javascript
await truthLoom.grantRole(ROLE_IDENTIFIER, address);
```

### Revoke Role
```javascript
await truthLoom.revokeRole(ROLE_IDENTIFIER, address);
```

### Check Role
```javascript
const hasRole = await truthLoom.hasRole(ROLE_IDENTIFIER, address);
```

## 📊 Query Functions

### Get Verification Node Info
```javascript
const node = await truthLoom.verificationNodes(address);
// Returns: nodeAddress, reputationScore, totalVerifications, isActive, registeredAt
```

### Get Compensation Claim
```javascript
const claim = await truthLoom.compensationClaims(claimId);
// Returns: recordId, encryptedVictimIdentity, claimAmount, isPaid, claimedAt, paidAt
```

### Get Legal Case
```javascript
const legalCase = await truthLoom.legalCases(caseId);
// Returns: recordId, caseNumber, openedAt, closedAt, isActive, caseDetails
```

## 🛡️ Admin Functions

### Configuration
```javascript
// Set minimum verifications required
await truthLoom.setMinVerifications(5);

// Pause contract
await truthLoom.pause();

// Unpause contract
await truthLoom.unpause();
```

### Node Management
```javascript
// Deactivate verifier
await truthLoom.deactivateVerifier(verifierAddress);
```

### Fund Management
```javascript
// Withdraw excess funds
await truthLoom.withdraw(amount);
```

## 📡 Event Monitoring

### Record Events
```javascript
truthLoom.on("RecordSubmitted", (recordId, submitter, ipfsHash) => {
  console.log("New record:", recordId);
});

truthLoom.on("RecordVerified", (recordId, verifier, count) => {
  console.log("Verified by:", verifier);
});

truthLoom.on("RecordStatusChanged", (recordId, newStatus) => {
  console.log("Status changed to:", newStatus);
});
```

### Verification Events
```javascript
truthLoom.on("VerifierRegistered", (verifier, timestamp) => {
  console.log("New verifier:", verifier);
});

truthLoom.on("VerifierDeactivated", (verifier, timestamp) => {
  console.log("Verifier deactivated:", verifier);
});
```

### Compensation Events
```javascript
truthLoom.on("CompensationClaimed", (claimId, recordId, amount) => {
  console.log("Claim submitted:", claimId);
});

truthLoom.on("CompensationPaid", (claimId, amount) => {
  console.log("Payment processed:", claimId);
});
```

### Legal Events
```javascript
truthLoom.on("LegalCaseOpened", (caseId, recordId, caseNumber) => {
  console.log("Case opened:", caseNumber);
});

truthLoom.on("LegalCaseClosed", (caseId, closedAt) => {
  console.log("Case closed:", caseId);
});
```

### Replication Events
```javascript
truthLoom.on("RecordReplicated", (recordId, replicaId) => {
  console.log("Record replicated:", recordId);
});
```

## 🔐 IPFS Integration

### Upload to IPFS (Python)
```bash
python scripts/truthloom_ipfs.py
```

### Upload JSON Data
```python
from scripts.truthloom_ipfs import TruthLoomRecordManager

manager = TruthLoomRecordManager()
ipfs_hash = manager.create_record(
    title="Record Title",
    description="Record Description",
    evidence=[...],
    category="systemic_harm"
)
```

## ⚙️ Configuration

### Environment Variables
```env
PRIVATE_KEY=your_private_key
MUMBAI_RPC_URL=https://rpc-mumbai.maticvigil.com
PINATA_API_KEY=your_pinata_api_key
PINATA_SECRET_KEY=your_pinata_secret_key
TRUTHLOOM_ADDRESS=deployed_contract_address
```

### Contract Configuration
```javascript
// Minimum verifications: 3 (default)
// Verifier reputation threshold: 100 (default)
// Can be modified by admin after deployment
```

## 🔍 Verification Status

| Status | Value | Description |
|--------|-------|-------------|
| Pending | 0 | Awaiting verification |
| Verified | 1 | Approved by verifiers |
| Rejected | 2 | Rejected by verifiers |
| UnderReview | 3 | Under additional review |

## 📝 Sensitivity Levels

| Level | Value | Description |
|-------|-------|-------------|
| Public | 0 | Publicly accessible |
| Protected | 1 | Limited access |
| HighlyConfidential | 2 | Restricted access |

## 🎯 Common Use Cases

### 1. Submit Evidence
1. Upload data to IPFS
2. Encrypt victim information
3. Call `submitRecord()`
4. Wait for verifications

### 2. Verify as Node
1. Register as verifier
2. Monitor new records
3. Validate data off-chain
4. Call `verifyRecord()` or `rejectRecord()`

### 3. Claim Compensation
1. Ensure record is verified
2. Encrypt identity proof
3. Call `submitCompensationClaim()`
4. Wait for admin processing

### 4. Track Legal Case
1. Open case (legal admin)
2. Upload case docs to IPFS
3. Link to verified record
4. Monitor case status

## 📚 Resources

- [Full Documentation](./TRUTHLOOM_FRAMEWORK.md)
- [Integration Guide](./TRUTHLOOM_INTEGRATION_GUIDE.md)
- [API Reference](../API_DOCUMENTATION.md)
- [Security Guidelines](../SECURITY.md)

## 🆘 Support

- GitHub Issues: [Report bugs](https://github.com/chaishillomnitech1/cosmic-constitution-scrollverse/issues)
- Discord: Community support
- Email: support@truthloom.org

---

**TruthLoom: Truth, Justice, Transparency - On-Chain**
