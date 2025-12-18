const { expect } = require("chai");
const { ethers } = require("hardhat");
const { time } = require("@nomicfoundation/hardhat-network-helpers");

describe("Mansion-Chain Ecosystem Tests", function () {
  let mansionChainNFT;
  let propertySigilCoin;
  let mansionChainDAO;
  let owner;
  let addr1;
  let addr2;
  let addrs;

  beforeEach(async function () {
    // Get signers
    [owner, addr1, addr2, ...addrs] = await ethers.getSigners();

    // Deploy MansionChainNFT
    const MansionChainNFT = await ethers.getContractFactory("MansionChainNFT");
    mansionChainNFT = await MansionChainNFT.deploy();
    await mansionChainNFT.waitForDeployment();

    // Deploy PropertySigilCoin
    const PropertySigilCoin = await ethers.getContractFactory("PropertySigilCoin");
    propertySigilCoin = await PropertySigilCoin.deploy(
      "Property Sigil Coin",
      "SIGIL",
      1000000
    );
    await propertySigilCoin.waitForDeployment();

    // Deploy MansionChainDAO
    const MansionChainDAO = await ethers.getContractFactory("MansionChainDAO");
    mansionChainDAO = await MansionChainDAO.deploy();
    await mansionChainDAO.waitForDeployment();
  });

  describe("MansionChainNFT - Digital Mirror Twin", function () {
    it("Should mint a property twin with correct metadata", async function () {
      const tx = await mansionChainNFT.mintPropertyTwin(
        addr1.address,
        "Chateau de Chambord",
        "Loire Valley, France",
        0, // PropertyType.CHATEAU
        2, // PropertyEra.RENAISSANCE
        "A magnificent French Renaissance château",
        "ipfs://QmXYZ.../chambord-ue5-model",
        "0xabc123def456",
        "PLAQUE-CHAMBORD-001",
        1519,
        440000,
        "Domenico da Cortona",
        true
      );

      await tx.wait();

      const property = await mansionChainNFT.getPropertyTwin(0);
      expect(property.propertyName).to.equal("Chateau de Chambord");
      expect(property.location).to.equal("Loire Valley, France");
      expect(property.architect).to.equal("Domenico da Cortona");
      expect(property.constructionYear).to.equal(1519);
      expect(property.hasPhysicalTwin).to.equal(true);
    });

    it("Should add interactive hotspots to a property", async function () {
      // First mint a property
      await mansionChainNFT.mintPropertyTwin(
        addr1.address,
        "Test Property",
        "Test Location",
        0, 0, "Description", "uri", "qr123", "plaque123",
        2000, 10000, "Architect", true
      );

      // Add hotspot
      await mansionChainNFT.addHotspot(
        0,
        "Grand Staircase",
        "Double-helix staircase design",
        "Revolutionary architecture",
        "Domenico da Cortona",
        "White Tuffeau limestone",
        100, 50, 75
      );

      const hotspots = await mansionChainNFT.getHotspots(0);
      expect(hotspots.length).to.equal(1);
      expect(hotspots[0].title).to.equal("Grand Staircase");
      expect(hotspots[0].positionX).to.equal(100);
    });

    it("Should schedule and register for virtual walkthrough", async function () {
      // Mint property
      await mansionChainNFT.mintPropertyTwin(
        addr1.address,
        "Test Property",
        "Test Location",
        0, 0, "Description", "uri", "qr123", "plaque123",
        2000, 10000, "Architect", true
      );

      // Schedule walkthrough
      const futureTime = (await time.latest()) + 3600; // 1 hour from now
      const eventId = await mansionChainNFT.scheduleWalkthrough(
        0,
        futureTime,
        60,
        "VIP Tour",
        true,
        50
      );

      // Register for walkthrough (as NFT holder)
      await mansionChainNFT.connect(addr1).registerForWalkthrough(0);

      const isRegistered = await mansionChainNFT.isRegisteredForWalkthrough(0, addr1.address);
      expect(isRegistered).to.equal(true);
    });

    it("Should create Chronicles of Stone with media rights", async function () {
      // Mint property
      await mansionChainNFT.mintPropertyTwin(
        addr1.address,
        "Chateau de Chambord",
        "Loire Valley",
        0, 2, "Description", "uri", "qr123", "plaque123",
        1519, 440000, "Architect", true
      );

      // Create chronicle
      await mansionChainNFT.createChronicle(
        0,
        "The Renaissance Revolution",
        "ipfs://story.json",
        "ipfs://video.mp4",
        300,
        "First royal hunting lodge",
        "Double-helix staircase",
        "Inspired Frank Lloyd Wright",
        1000
      );

      const chronicle = await mansionChainNFT.getChronicle(0);
      expect(chronicle.chronicleTitle).to.equal("The Renaissance Revolution");
      expect(chronicle.fractionalMediaRights).to.equal(true);
      expect(chronicle.mediaRightsPercentage).to.equal(1000);
    });

    it("Should retrieve property by QR code", async function () {
      const qrHash = "0xabc123unique";
      
      await mansionChainNFT.mintPropertyTwin(
        addr1.address,
        "Test Property",
        "Location",
        0, 0, "Description", "uri", qrHash, "plaque123",
        2000, 10000, "Architect", true
      );

      const tokenId = await mansionChainNFT.getPropertyByQR(qrHash);
      expect(tokenId).to.equal(0);
    });
  });

  describe("PropertySigilCoin - Heritage Crests", function () {
    it("Should create a sigil with heritage crest", async function () {
      await propertySigilCoin.createSigil(
        "Chambord Royal Crest",
        "Salamander emblem of Francis I",
        "PROPERTY-CHAMBORD-001",
        100000
      );

      const sigil = await propertySigilCoin.getSigil("Chambord Royal Crest");
      expect(sigil.sigilName).to.equal("Chambord Royal Crest");
      expect(sigil.heritageCrest).to.equal("Salamander emblem of Francis I");
      expect(sigil.isActive).to.equal(true);
    });

    it("Should set and track royalty shares", async function () {
      await propertySigilCoin.setRoyaltyShare(addr1.address, 3000); // 30%
      await propertySigilCoin.setRoyaltyShare(addr2.address, 1000); // 10%

      const share1 = await propertySigilCoin.getRoyaltyShare(addr1.address);
      const share2 = await propertySigilCoin.getRoyaltyShare(addr2.address);

      expect(share1.sharePercentage).to.equal(3000);
      expect(share2.sharePercentage).to.equal(1000);
    });

    it("Should record and distribute estate revenue", async function () {
      // Set royalty shares
      await propertySigilCoin.setRoyaltyShare(addr1.address, 5000); // 50%

      // Record revenue
      await propertySigilCoin.recordEstateRevenue(
        ethers.parseEther("50"),
        ethers.parseEther("30")
      );

      let revenue = await propertySigilCoin.getEstateRevenue();
      expect(revenue.virtualRevenue).to.equal(ethers.parseEther("50"));
      expect(revenue.digitalRevenue).to.equal(ethers.parseEther("30"));
      expect(revenue.pendingDistribution).to.equal(ethers.parseEther("80"));

      // Distribute revenue
      await propertySigilCoin.distributeRevenue();

      revenue = await propertySigilCoin.getEstateRevenue();
      expect(revenue.pendingDistribution).to.equal(0);
      expect(revenue.totalDistributed).to.equal(ethers.parseEther("80"));
    });

    it("Should create and join gamified policy", async function () {
      const policyId = await propertySigilCoin.createGamifiedPolicy(
        "Long-term Holder Rewards",
        15000,
        1000,
        180
      );

      const policy = await propertySigilCoin.getPolicy(0);
      expect(policy.policyName).to.equal("Long-term Holder Rewards");
      expect(policy.rewardMultiplier).to.equal(15000);
      expect(policy.minimumHolding).to.equal(1000);
      expect(policy.lockupPeriodDays).to.equal(180);
    });

    it("Should update economic valuation", async function () {
      await propertySigilCoin.updateEconomicValuation(
        ethers.parseEther("10000")
      );

      const [valuation, timestamp] = await propertySigilCoin.getEconomicValuation();
      expect(valuation).to.equal(ethers.parseEther("10000"));
      expect(timestamp).to.be.gt(0);
    });

    it("Should maintain proof ledger entries", async function () {
      await propertySigilCoin.createSigil(
        "Test Sigil",
        "Test Crest",
        "PROP-001",
        1000
      );

      const count = await propertySigilCoin.getLedgerEntriesCount();
      expect(count).to.be.gt(0);

      const entry = await propertySigilCoin.getLedgerEntry(0);
      expect(entry.entryType).to.equal("SIGIL_CREATE");
    });
  });

  describe("MansionChainDAO - Governance", function () {
    it("Should create a proposal", async function () {
      const proposalId = await mansionChainDAO.createProposal(
        0, // ProposalType.PROPERTY_ADDITION
        "Add Versailles Palace",
        "Proposal to add Versailles to the ecosystem"
      );

      const [proposalType, title, status, forVotes, againstVotes, executed] = 
        await mansionChainDAO.getProposalStatus(0);

      expect(title).to.equal("Add Versailles Palace");
      expect(status).to.equal(1); // ProposalStatus.ACTIVE
    });

    it("Should vote on a proposal", async function () {
      await mansionChainDAO.createProposal(
        0,
        "Test Proposal",
        "Test Description"
      );

      await mansionChainDAO.connect(addr1).vote(0, true, 1000);

      const [, , , forVotes, ,] = await mansionChainDAO.getProposalStatus(0);
      expect(forVotes).to.equal(1000);
    });

    it("Should create and fund tourism exhibition", async function () {
      const futureStart = (await time.latest()) + 86400; // 1 day
      const futureEnd = futureStart + 604800; // 1 week later

      await mansionChainDAO.createExhibition(
        "Renaissance Architecture Tour",
        "Paris, France",
        "Global exhibition",
        ethers.parseEther("100"),
        futureStart,
        futureEnd
      );

      // Contribute to exhibition
      await mansionChainDAO.connect(addr1).contributeToExhibition(0, {
        value: ethers.parseEther("5")
      });

      // Check balance
      const balance = await ethers.provider.getBalance(await mansionChainDAO.getAddress());
      expect(balance).to.equal(ethers.parseEther("5"));
    });

    it("Should create token conversion mechanism", async function () {
      const sigilAddress = await propertySigilCoin.getAddress();
      const daoAddress = await mansionChainDAO.getAddress();

      await mansionChainDAO.createTokenConversion(
        sigilAddress,
        daoAddress,
        10000,
        100,
        10000
      );
    });

    it("Should update NFT alignment lifecycle", async function () {
      await mansionChainDAO.updateNFTAlignment(
        1,
        8500,
        2,
        "Attended 5 virtual walkthroughs"
      );

      const [alignmentScore, lifecycleStage, totalEngagement, achievements] =
        await mansionChainDAO.getNFTAlignment(1);

      expect(alignmentScore).to.equal(8500);
      expect(lifecycleStage).to.equal(2);
      expect(totalEngagement).to.equal(1);
      expect(achievements.length).to.equal(1);
    });

    it("Should link governance wallet", async function () {
      await mansionChainDAO.linkGovernanceWallet(addr1.address, 500);

      const totalPower = await mansionChainDAO.getTotalVotingPower();
      expect(totalPower).to.equal(500);
    });

    it("Should submit visual experiment", async function () {
      const experimentId = await mansionChainDAO.connect(addr1).submitVisualExperiment(
        "AR Overlay for Chambord",
        "Augmented reality experience",
        "ipfs://ar-chambord.json"
      );
    });
  });

  describe("Integration Tests", function () {
    it("Should integrate NFT with DAO governance", async function () {
      // Mint property NFT
      await mansionChainNFT.mintPropertyTwin(
        addr1.address,
        "Test Property",
        "Location",
        0, 0, "Description", "uri", "qr123", "plaque123",
        2000, 10000, "Architect", true
      );

      // Link to DAO
      await mansionChainDAO.linkGovernanceWallet(addr1.address, 1000);

      // Update NFT alignment
      await mansionChainDAO.updateNFTAlignment(0, 9000, 2, "Active participant");

      // Create proposal
      await mansionChainDAO.connect(addr1).createProposal(
        1, // CHRONICLE_CREATION
        "Create new chronicle",
        "Add story to property"
      );

      const totalPower = await mansionChainDAO.getTotalVotingPower();
      expect(totalPower).to.be.gt(0);
    });

    it("Should link Sigil Coin revenue to NFT holders", async function () {
      // Mint property NFT
      await mansionChainNFT.mintPropertyTwin(
        addr1.address,
        "Chateau Test",
        "Location",
        0, 0, "Description", "uri", "qr123", "plaque123",
        2000, 10000, "Architect", true
      );

      // Create sigil
      await propertySigilCoin.createSigil(
        "Test Sigil",
        "Test Crest",
        "PROP-001",
        100000
      );

      // Set royalty share for NFT holder
      await propertySigilCoin.setRoyaltyShare(addr1.address, 1000);

      // Record and distribute revenue
      await propertySigilCoin.recordEstateRevenue(
        ethers.parseEther("10"),
        ethers.parseEther("5")
      );
      await propertySigilCoin.distributeRevenue();

      const share = await propertySigilCoin.getRoyaltyShare(addr1.address);
      expect(share.totalEarned).to.be.gt(0);
    });
  });
});
