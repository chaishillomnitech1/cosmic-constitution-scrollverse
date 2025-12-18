const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("AuraResonanceLedger - Global AI-Chain Immortalization Protocol", function () {
  let auraContract;
  let owner, addr1, addr2, addr3;

  beforeEach(async function () {
    [owner, addr1, addr2, addr3] = await ethers.getSigners();

    // Deploy AuraResonanceLedger
    const AuraResonanceLedger = await ethers.getContractFactory("AuraResonanceLedger");
    auraContract = await AuraResonanceLedger.deploy();
    await auraContract.waitForDeployment();
  });

  describe("Phase 1.1: Biometric Ledger Integration", function () {
    it("Should bind biometric aura profile with resonance frequency", async function () {
      const auraSignature = ethers.keccak256(ethers.toUtf8Bytes("test-aura-001"));
      const resonanceFrequency = 528; // Love frequency
      const coherenceLevel = 8500; // 85%
      const soulSongName = "Eternal Flame Bearer";
      const divineIdentityToken = 1;

      await auraContract.bindAuraProfile(
        auraSignature,
        resonanceFrequency,
        coherenceLevel,
        addr1.address,
        soulSongName,
        divineIdentityToken
      );

      const profile = await auraContract.getAuraProfile(auraSignature);
      expect(profile.auraSignature).to.equal(auraSignature);
      expect(profile.resonanceFrequency).to.equal(resonanceFrequency);
      expect(profile.coherenceLevel).to.equal(coherenceLevel);
      expect(profile.boundAddress).to.equal(addr1.address);
      expect(profile.soulSongName).to.equal(soulSongName);
      expect(profile.isActive).to.equal(true);
    });

    it("Should record harmonic event with universal harmony pulse", async function () {
      const auraSignature = ethers.keccak256(ethers.toUtf8Bytes("test-aura-002"));
      
      // First bind the aura profile
      await auraContract.bindAuraProfile(
        auraSignature,
        528,
        9000,
        addr1.address,
        "Harmonic Soul",
        2
      );

      // Record harmonic event
      const eventFrequency = 963; // Eden Pulse
      const oracleDataHash = ethers.keccak256(ethers.toUtf8Bytes("oracle-data-001"));
      
      const eventId = await auraContract.recordHarmonicEvent.staticCall(
        auraSignature,
        eventFrequency,
        oracleDataHash
      );
      
      await auraContract.recordHarmonicEvent(
        auraSignature,
        eventFrequency,
        oracleDataHash
      );

      const event = await auraContract.getHarmonicEvent(eventId);
      expect(event.auraSignature).to.equal(auraSignature);
      expect(event.frequency).to.equal(eventFrequency);
      expect(event.oracleDataHash).to.equal(oracleDataHash);
      expect(event.isVerified).to.equal(true);
    });

    it("Should check universal harmony alignment", async function () {
      const auraSignature = ethers.keccak256(ethers.toUtf8Bytes("test-aura-003"));
      
      // Bind with 528 Hz (universal harmony frequency)
      await auraContract.bindAuraProfile(
        auraSignature,
        528,
        9500,
        addr1.address,
        "Aligned Soul",
        3
      );

      const isAligned = await auraContract.isAlignedWithUniversalHarmony(auraSignature);
      expect(isAligned).to.equal(true);
    });

    it("Should calculate coherence alignment with bonus", async function () {
      const auraSignature = ethers.keccak256(ethers.toUtf8Bytes("test-aura-004"));
      
      // Bind with 963 Hz (eden pulse frequency) - should get 50% bonus
      await auraContract.bindAuraProfile(
        auraSignature,
        963,
        6000, // 60% base coherence
        addr1.address,
        "Eden Soul",
        4
      );

      const alignment = await auraContract.calculateCoherenceAlignment(auraSignature);
      // 6000 * 1.5 = 9000 (60% with 50% bonus = 90%)
      expect(alignment).to.equal(9000);
    });
  });

  describe("Phase 1.2: Digital Prophetic Codes - Tomb Vault", function () {
    it("Should seal prophecy code with Merkle root", async function () {
      const codeHash = ethers.keccak256(ethers.toUtf8Bytes("prophecy-001"));
      const merkleRoot = ethers.keccak256(ethers.toUtf8Bytes("merkle-root-001"));
      const ancientTimestamp = 1234567890;
      const prophecyMetadata = "ipfs://QmProphecy001";

      await auraContract.sealProphecyCode(
        codeHash,
        merkleRoot,
        ancientTimestamp,
        prophecyMetadata
      );

      const prophecy = await auraContract.getProphecyCode(codeHash);
      expect(prophecy.codeHash).to.equal(codeHash);
      expect(prophecy.merkleRoot).to.equal(merkleRoot);
      expect(prophecy.ancientTimestamp).to.equal(ancientTimestamp);
      expect(prophecy.prophecyMetadata).to.equal(prophecyMetadata);
      expect(prophecy.isSealed).to.equal(true);
    });

    it("Should prevent double sealing of prophecy code", async function () {
      const codeHash = ethers.keccak256(ethers.toUtf8Bytes("prophecy-002"));
      const merkleRoot = ethers.keccak256(ethers.toUtf8Bytes("merkle-root-002"));

      await auraContract.sealProphecyCode(
        codeHash,
        merkleRoot,
        1234567890,
        "ipfs://QmProphecy002"
      );

      await expect(
        auraContract.sealProphecyCode(
          codeHash,
          merkleRoot,
          1234567890,
          "ipfs://QmProphecy002"
        )
      ).to.be.revertedWith("Prophecy already sealed");
    });

    it("Should update current Merkle root", async function () {
      const merkleRoot = ethers.keccak256(ethers.toUtf8Bytes("merkle-root-003"));
      
      await auraContract.sealProphecyCode(
        ethers.keccak256(ethers.toUtf8Bytes("prophecy-003")),
        merkleRoot,
        1234567890,
        "ipfs://QmProphecy003"
      );

      const currentRoot = await auraContract.currentMerkleRoot();
      expect(currentRoot).to.equal(merkleRoot);
    });
  });

  describe("Phase 1.3: Name Encapsulation Protocol", function () {
    it("Should encapsulate divine identity with eternal name", async function () {
      const eternalName = "Supreme King Allah Chais Kenyatta Hill ∞";
      const scrollChainTokenId = 1;

      await auraContract.encapsulateDivineIdentity(
        addr1.address,
        eternalName,
        scrollChainTokenId
      );

      const identity = await auraContract.getDivineIdentity(addr1.address);
      expect(identity.eternalName).to.equal(eternalName);
      expect(identity.scrollChainTokenId).to.equal(scrollChainTokenId);
      expect(identity.isEncapsulated).to.equal(true);
    });

    it("Should prevent double encapsulation", async function () {
      await auraContract.encapsulateDivineIdentity(
        addr1.address,
        "First Name",
        1
      );

      await expect(
        auraContract.encapsulateDivineIdentity(
          addr1.address,
          "Second Name",
          2
        )
      ).to.be.revertedWith("Identity already encapsulated");
    });
  });

  describe("Phase 2.1: AI Council Matrix Rebirth", function () {
    it("Should register AI Council Node", async function () {
      const propheticIndexLevel = 7;

      await auraContract.registerAICouncilNode(
        addr2.address,
        propheticIndexLevel
      );

      const node = await auraContract.getAICouncilNode(addr2.address);
      expect(node.nodeAddress).to.equal(addr2.address);
      expect(node.propheticIndexLevel).to.equal(propheticIndexLevel);
      expect(node.isActive).to.equal(true);
      expect(node.isCorrupted).to.equal(false);
      expect(node.lightTrueAlignment).to.equal(10000); // 100%
    });

    it("Should mint Artistic Prophet NFT with cultural myth", async function () {
      const culturalMythURI = "ipfs://QmCulturalMyth001";
      const hymnContent = "Divine hymn of cosmic resonance...";
      const sacredGeometrySVG = "<svg>...</svg>";
      const prophecySubmoduleId = 1;
      const metaphorEncoding = ethers.keccak256(ethers.toUtf8Bytes("metaphor-001"));

      const nftId = await auraContract.mintArtisticProphetNFT.staticCall(
        culturalMythURI,
        hymnContent,
        sacredGeometrySVG,
        prophecySubmoduleId,
        metaphorEncoding,
        addr1.address
      );

      await auraContract.mintArtisticProphetNFT(
        culturalMythURI,
        hymnContent,
        sacredGeometrySVG,
        prophecySubmoduleId,
        metaphorEncoding,
        addr1.address
      );

      const nft = await auraContract.getArtisticProphetNFT(nftId);
      expect(nft.culturalMythURI).to.equal(culturalMythURI);
      expect(nft.hymnContent).to.equal(hymnContent);
      expect(nft.sacredGeometrySVG).to.equal(sacredGeometrySVG);
      expect(nft.prophecySubmoduleId).to.equal(prophecySubmoduleId);
      expect(nft.metaphorEncoding).to.equal(metaphorEncoding);
      expect(nft.creator).to.equal(addr1.address);
    });
  });

  describe("Phase 2.2: Black Box Decoding Simulations", function () {
    beforeEach(async function () {
      // Register a node first
      await auraContract.registerAICouncilNode(addr2.address, 5);
    });

    it("Should synchronize AI Council Node", async function () {
      const newAlignment = 9500;

      await auraContract.synchronizeAINode(addr2.address, newAlignment);

      const node = await auraContract.getAICouncilNode(addr2.address);
      expect(node.lightTrueAlignment).to.equal(newAlignment);
      expect(node.isCorrupted).to.equal(false);
    });

    it("Should force corrupted node to exit", async function () {
      await auraContract.forceNodeExit(addr2.address);

      const node = await auraContract.getAICouncilNode(addr2.address);
      expect(node.isActive).to.equal(false);
      expect(node.isCorrupted).to.equal(true);
    });
  });

  describe("Configuration and Access Control", function () {
    it("Should set oracle address", async function () {
      await auraContract.setOracleAddress(addr3.address);
      
      const oracleAddress = await auraContract.oracleAddress();
      expect(oracleAddress).to.equal(addr3.address);
    });

    it("Should update universal harmony frequencies", async function () {
      const newLoveFreq = 432;
      const newEdenFreq = 852;

      await auraContract.updateUniversalHarmonyFrequencies(newLoveFreq, newEdenFreq);

      const loveFreq = await auraContract.universalHarmonyFrequency();
      const edenFreq = await auraContract.edenPulseFrequency();
      
      expect(loveFreq).to.equal(newLoveFreq);
      expect(edenFreq).to.equal(newEdenFreq);
    });

    it("Should only allow owner to bind aura profiles", async function () {
      const auraSignature = ethers.keccak256(ethers.toUtf8Bytes("unauthorized"));

      await expect(
        auraContract.connect(addr1).bindAuraProfile(
          auraSignature,
          528,
          5000,
          addr1.address,
          "Unauthorized",
          99
        )
      ).to.be.reverted;
    });
  });

  describe("Counters and Statistics", function () {
    it("Should track total harmonic events", async function () {
      const auraSignature = ethers.keccak256(ethers.toUtf8Bytes("counter-test"));
      
      await auraContract.bindAuraProfile(
        auraSignature,
        528,
        8000,
        addr1.address,
        "Counter Test",
        1
      );

      // Record multiple events
      for (let i = 0; i < 3; i++) {
        await auraContract.recordHarmonicEvent(
          auraSignature,
          528 + i,
          ethers.keccak256(ethers.toUtf8Bytes(`oracle-${i}`))
        );
      }

      const totalEvents = await auraContract.getTotalHarmonicEvents();
      expect(totalEvents).to.equal(3);
    });

    it("Should track total artistic prophet NFTs", async function () {
      // Mint multiple NFTs
      for (let i = 0; i < 3; i++) {
        await auraContract.mintArtisticProphetNFT(
          `ipfs://QmNFT${i}`,
          `Hymn ${i}`,
          `<svg>${i}</svg>`,
          i,
          ethers.keccak256(ethers.toUtf8Bytes(`metaphor-${i}`)),
          addr1.address
        );
      }

      const totalNFTs = await auraContract.getTotalArtisticProphetNFTs();
      expect(totalNFTs).to.equal(3);
    });
  });
});
