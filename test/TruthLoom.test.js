const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("TruthLoom - Decentralized Transparency Framework", function () {
  let truthLoom;
  let owner, verifier1, verifier2, verifier3, submitter, victim, legalAdmin, compensationAdmin;
  
  beforeEach(async function () {
    [owner, verifier1, verifier2, verifier3, submitter, victim, legalAdmin, compensationAdmin] = await ethers.getSigners();
    
    const TruthLoom = await ethers.getContractFactory("TruthLoom");
    truthLoom = await TruthLoom.deploy();
    await truthLoom.waitForDeployment();
    
    // Grant roles
    const LEGAL_ADMIN_ROLE = await truthLoom.LEGAL_ADMIN_ROLE();
    const COMPENSATION_ADMIN_ROLE = await truthLoom.COMPENSATION_ADMIN_ROLE();
    
    await truthLoom.grantRole(LEGAL_ADMIN_ROLE, legalAdmin.address);
    await truthLoom.grantRole(COMPENSATION_ADMIN_ROLE, compensationAdmin.address);
  });

  describe("Deployment", function () {
    it("Should set the correct admin roles", async function () {
      const DEFAULT_ADMIN_ROLE = await truthLoom.DEFAULT_ADMIN_ROLE();
      expect(await truthLoom.hasRole(DEFAULT_ADMIN_ROLE, owner.address)).to.be.true;
    });
    
    it("Should initialize with correct default values", async function () {
      expect(await truthLoom.minVerificationsRequired()).to.equal(3);
      expect(await truthLoom.totalCompensationPool()).to.equal(0);
      expect(await truthLoom.compensationClaimCounter()).to.equal(0);
    });
  });

  describe("Verification Node Management", function () {
    it("Should allow registration of verification nodes", async function () {
      await expect(truthLoom.connect(verifier1).registerVerifier())
        .to.emit(truthLoom, "VerifierRegistered")
        .withArgs(verifier1.address, await ethers.provider.getBlock('latest').then(b => b.timestamp + 1));
      
      const node = await truthLoom.verificationNodes(verifier1.address);
      expect(node.isActive).to.be.true;
      expect(node.reputationScore).to.equal(100);
    });
    
    it("Should prevent double registration", async function () {
      await truthLoom.connect(verifier1).registerVerifier();
      await expect(truthLoom.connect(verifier1).registerVerifier())
        .to.be.revertedWith("Already registered");
    });
    
    it("Should allow admin to deactivate verifiers", async function () {
      await truthLoom.connect(verifier1).registerVerifier();
      
      await expect(truthLoom.deactivateVerifier(verifier1.address))
        .to.emit(truthLoom, "VerifierDeactivated")
        .withArgs(verifier1.address, await ethers.provider.getBlock('latest').then(b => b.timestamp + 1));
      
      const node = await truthLoom.verificationNodes(verifier1.address);
      expect(node.isActive).to.be.false;
    });
  });

  describe("Record Submission and Verification", function () {
    let recordId;
    const ipfsHash = "QmTest123456789";
    const encryptedVictimData = ethers.hexlify(ethers.toUtf8Bytes("encrypted_victim_data"));
    
    beforeEach(async function () {
      // Register verifiers
      await truthLoom.connect(verifier1).registerVerifier();
      await truthLoom.connect(verifier2).registerVerifier();
      await truthLoom.connect(verifier3).registerVerifier();
    });
    
    it("Should allow submission of transparency records", async function () {
      const tx = await truthLoom.connect(submitter).submitRecord(
        ipfsHash,
        0, // SensitivityLevel.Public
        encryptedVictimData
      );
      
      const receipt = await tx.wait();
      const event = receipt.logs.find(log => {
        try {
          return truthLoom.interface.parseLog(log).name === "RecordSubmitted";
        } catch (e) {
          return false;
        }
      });
      
      expect(event).to.not.be.undefined;
    });
    
    it("Should allow verifiers to verify records", async function () {
      const tx = await truthLoom.connect(submitter).submitRecord(
        ipfsHash,
        1, // SensitivityLevel.Protected
        encryptedVictimData
      );
      
      const receipt = await tx.wait();
      const event = receipt.logs.find(log => {
        try {
          return truthLoom.interface.parseLog(log).name === "RecordSubmitted";
        } catch (e) {
          return false;
        }
      });
      
      const parsedEvent = truthLoom.interface.parseLog(event);
      recordId = parsedEvent.args[0];
      
      await expect(truthLoom.connect(verifier1).verifyRecord(recordId))
        .to.emit(truthLoom, "RecordVerified")
        .withArgs(recordId, verifier1.address, 1);
      
      const record = await truthLoom.getRecord(recordId);
      expect(record.verificationCount).to.equal(1);
    });
    
    it("Should auto-approve record after minimum verifications", async function () {
      const tx = await truthLoom.connect(submitter).submitRecord(
        ipfsHash,
        1,
        encryptedVictimData
      );
      
      const receipt = await tx.wait();
      const event = receipt.logs.find(log => {
        try {
          return truthLoom.interface.parseLog(log).name === "RecordSubmitted";
        } catch (e) {
          return false;
        }
      });
      
      const parsedEvent = truthLoom.interface.parseLog(event);
      recordId = parsedEvent.args[0];
      
      // Verify by 3 different verifiers
      await truthLoom.connect(verifier1).verifyRecord(recordId);
      await truthLoom.connect(verifier2).verifyRecord(recordId);
      
      const tx3 = await truthLoom.connect(verifier3).verifyRecord(recordId);
      const receipt3 = await tx3.wait();
      
      // Check for status change event
      const statusEvent = receipt3.logs.find(log => {
        try {
          const parsed = truthLoom.interface.parseLog(log);
          return parsed.name === "RecordStatusChanged";
        } catch (e) {
          return false;
        }
      });
      
      expect(statusEvent).to.not.be.undefined;
      
      const record = await truthLoom.getRecord(recordId);
      expect(record.status).to.equal(1); // VerificationStatus.Verified
    });
    
    it("Should prevent duplicate verification from same verifier", async function () {
      const tx = await truthLoom.connect(submitter).submitRecord(
        ipfsHash,
        0,
        encryptedVictimData
      );
      
      const receipt = await tx.wait();
      const event = receipt.logs.find(log => {
        try {
          return truthLoom.interface.parseLog(log).name === "RecordSubmitted";
        } catch (e) {
          return false;
        }
      });
      
      const parsedEvent = truthLoom.interface.parseLog(event);
      recordId = parsedEvent.args[0];
      
      await truthLoom.connect(verifier1).verifyRecord(recordId);
      
      await expect(truthLoom.connect(verifier1).verifyRecord(recordId))
        .to.be.revertedWith("Already verified by this node");
    });
    
    it("Should allow verifiers to reject records", async function () {
      const tx = await truthLoom.connect(submitter).submitRecord(
        ipfsHash,
        0,
        encryptedVictimData
      );
      
      const receipt = await tx.wait();
      const event = receipt.logs.find(log => {
        try {
          return truthLoom.interface.parseLog(log).name === "RecordSubmitted";
        } catch (e) {
          return false;
        }
      });
      
      const parsedEvent = truthLoom.interface.parseLog(event);
      recordId = parsedEvent.args[0];
      
      await expect(truthLoom.connect(verifier1).rejectRecord(recordId))
        .to.emit(truthLoom, "RecordStatusChanged")
        .withArgs(recordId, 2); // VerificationStatus.Rejected
    });
  });

  describe("Compensation Framework", function () {
    let recordId;
    const ipfsHash = "QmCompensation123";
    const encryptedVictimData = ethers.hexlify(ethers.toUtf8Bytes("victim_data"));
    const encryptedVictimIdentity = ethers.hexlify(ethers.toUtf8Bytes("victim_identity"));
    
    beforeEach(async function () {
      // Register verifiers
      await truthLoom.connect(verifier1).registerVerifier();
      await truthLoom.connect(verifier2).registerVerifier();
      await truthLoom.connect(verifier3).registerVerifier();
      
      // Submit and verify a record
      const tx = await truthLoom.connect(submitter).submitRecord(
        ipfsHash,
        1,
        encryptedVictimData
      );
      
      const receipt = await tx.wait();
      const event = receipt.logs.find(log => {
        try {
          return truthLoom.interface.parseLog(log).name === "RecordSubmitted";
        } catch (e) {
          return false;
        }
      });
      
      const parsedEvent = truthLoom.interface.parseLog(event);
      recordId = parsedEvent.args[0];
      
      // Get record verified
      await truthLoom.connect(verifier1).verifyRecord(recordId);
      await truthLoom.connect(verifier2).verifyRecord(recordId);
      await truthLoom.connect(verifier3).verifyRecord(recordId);
    });
    
    it("Should allow victims to submit compensation claims", async function () {
      const claimAmount = ethers.parseEther("1.0");
      
      await expect(truthLoom.connect(victim).submitCompensationClaim(
        recordId,
        encryptedVictimIdentity,
        claimAmount
      ))
        .to.emit(truthLoom, "CompensationClaimed")
        .withArgs(0, recordId, claimAmount);
      
      const claim = await truthLoom.compensationClaims(0);
      expect(claim.claimAmount).to.equal(claimAmount);
      expect(claim.isPaid).to.be.false;
    });
    
    it("Should allow compensation admin to process payments", async function () {
      const claimAmount = ethers.parseEther("1.0");
      
      await truthLoom.connect(victim).submitCompensationClaim(
        recordId,
        encryptedVictimIdentity,
        claimAmount
      );
      
      await expect(truthLoom.connect(compensationAdmin).processCompensation(0, {
        value: claimAmount
      }))
        .to.emit(truthLoom, "CompensationPaid")
        .withArgs(0, claimAmount);
      
      const claim = await truthLoom.compensationClaims(0);
      expect(claim.isPaid).to.be.true;
    });
    
    it("Should prevent double payment of claims", async function () {
      const claimAmount = ethers.parseEther("1.0");
      
      await truthLoom.connect(victim).submitCompensationClaim(
        recordId,
        encryptedVictimIdentity,
        claimAmount
      );
      
      await truthLoom.connect(compensationAdmin).processCompensation(0, {
        value: claimAmount
      });
      
      await expect(truthLoom.connect(compensationAdmin).processCompensation(0, {
        value: claimAmount
      }))
        .to.be.revertedWith("Claim already paid");
    });
    
    it("Should accept funding for compensation pool", async function () {
      const fundAmount = ethers.parseEther("10.0");
      
      await truthLoom.connect(owner).fundCompensationPool({
        value: fundAmount
      });
      
      expect(await truthLoom.totalCompensationPool()).to.equal(fundAmount);
    });
  });

  describe("Legal Accountability Layer", function () {
    let recordId;
    const ipfsHash = "QmLegal123";
    const encryptedVictimData = ethers.hexlify(ethers.toUtf8Bytes("legal_victim_data"));
    
    beforeEach(async function () {
      // Register verifiers and create verified record
      await truthLoom.connect(verifier1).registerVerifier();
      await truthLoom.connect(verifier2).registerVerifier();
      await truthLoom.connect(verifier3).registerVerifier();
      
      const tx = await truthLoom.connect(submitter).submitRecord(
        ipfsHash,
        2, // HighlyConfidential
        encryptedVictimData
      );
      
      const receipt = await tx.wait();
      const event = receipt.logs.find(log => {
        try {
          return truthLoom.interface.parseLog(log).name === "RecordSubmitted";
        } catch (e) {
          return false;
        }
      });
      
      const parsedEvent = truthLoom.interface.parseLog(event);
      recordId = parsedEvent.args[0];
      
      await truthLoom.connect(verifier1).verifyRecord(recordId);
      await truthLoom.connect(verifier2).verifyRecord(recordId);
      await truthLoom.connect(verifier3).verifyRecord(recordId);
    });
    
    it("Should allow legal admin to open cases", async function () {
      const caseNumber = "CASE-2025-001";
      const caseDetails = "QmCaseDetails123";
      
      const tx = await truthLoom.connect(legalAdmin).openLegalCase(
        recordId,
        caseNumber,
        caseDetails
      );
      
      const receipt = await tx.wait();
      const event = receipt.logs.find(log => {
        try {
          const parsed = truthLoom.interface.parseLog(log);
          return parsed.name === "LegalCaseOpened";
        } catch (e) {
          return false;
        }
      });
      
      expect(event).to.not.be.undefined;
    });
    
    it("Should allow legal admin to close cases", async function () {
      const caseNumber = "CASE-2025-002";
      const caseDetails = "QmCaseDetails456";
      
      const tx = await truthLoom.connect(legalAdmin).openLegalCase(
        recordId,
        caseNumber,
        caseDetails
      );
      
      const receipt = await tx.wait();
      const event = receipt.logs.find(log => {
        try {
          const parsed = truthLoom.interface.parseLog(log);
          return parsed.name === "LegalCaseOpened";
        } catch (e) {
          return false;
        }
      });
      
      const parsedEvent = truthLoom.interface.parseLog(event);
      const caseId = parsedEvent.args[0];
      
      await expect(truthLoom.connect(legalAdmin).closeLegalCase(caseId))
        .to.emit(truthLoom, "LegalCaseClosed");
    });
  });

  describe("Regeneration Protocol", function () {
    let recordId;
    const ipfsHash = "QmOriginal123";
    const encryptedVictimData = ethers.hexlify(ethers.toUtf8Bytes("regen_data"));
    
    beforeEach(async function () {
      await truthLoom.connect(verifier1).registerVerifier();
      
      const tx = await truthLoom.connect(submitter).submitRecord(
        ipfsHash,
        0,
        encryptedVictimData
      );
      
      const receipt = await tx.wait();
      const event = receipt.logs.find(log => {
        try {
          return truthLoom.interface.parseLog(log).name === "RecordSubmitted";
        } catch (e) {
          return false;
        }
      });
      
      const parsedEvent = truthLoom.interface.parseLog(event);
      recordId = parsedEvent.args[0];
    });
    
    it("Should allow verifiers to replicate records", async function () {
      const replicaIpfsHash = "QmReplica123";
      
      await expect(truthLoom.connect(verifier1).replicateRecord(recordId, replicaIpfsHash))
        .to.emit(truthLoom, "RecordReplicated")
        .withArgs(recordId, await ethers.provider.getBlock('latest').then(() => {
          return ethers.keccak256(ethers.toUtf8Bytes(replicaIpfsHash + Date.now()));
        }));
    });
    
    it("Should track multiple replicas for a record", async function () {
      await truthLoom.connect(verifier1).replicateRecord(recordId, "QmReplica1");
      await truthLoom.connect(verifier1).replicateRecord(recordId, "QmReplica2");
      
      const replicas = await truthLoom.getRecordReplicas(recordId);
      expect(replicas.length).to.equal(2);
    });
  });

  describe("Admin Functions", function () {
    it("Should allow admin to update minimum verifications", async function () {
      await truthLoom.setMinVerifications(5);
      expect(await truthLoom.minVerificationsRequired()).to.equal(5);
    });
    
    it("Should allow admin to pause contract", async function () {
      await truthLoom.pause();
      
      const ipfsHash = "QmPaused123";
      const encryptedData = ethers.hexlify(ethers.toUtf8Bytes("data"));
      
      await expect(truthLoom.connect(submitter).submitRecord(
        ipfsHash,
        0,
        encryptedData
      )).to.be.revertedWithCustomError(truthLoom, "EnforcedPause");
    });
    
    it("Should allow admin to unpause contract", async function () {
      await truthLoom.pause();
      await truthLoom.unpause();
      
      const ipfsHash = "QmUnpaused123";
      const encryptedData = ethers.hexlify(ethers.toUtf8Bytes("data"));
      
      await expect(truthLoom.connect(submitter).submitRecord(
        ipfsHash,
        0,
        encryptedData
      )).to.not.be.reverted;
    });
  });

  describe("Query Functions", function () {
    it("Should return all record IDs", async function () {
      await truthLoom.connect(submitter).submitRecord(
        "QmTest1",
        0,
        ethers.hexlify(ethers.toUtf8Bytes("data1"))
      );
      
      await truthLoom.connect(submitter).submitRecord(
        "QmTest2",
        0,
        ethers.hexlify(ethers.toUtf8Bytes("data2"))
      );
      
      const recordIds = await truthLoom.getAllRecordIds();
      expect(recordIds.length).to.equal(2);
    });
    
    it("Should return active verifiers", async function () {
      await truthLoom.connect(verifier1).registerVerifier();
      await truthLoom.connect(verifier2).registerVerifier();
      
      const activeVerifiers = await truthLoom.getActiveVerifiers();
      expect(activeVerifiers.length).to.equal(2);
    });
  });
});
