const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("TwinTowersChroniclesNFT", function () {
  let chroniclesContract;
  let owner, addr1, addr2;
  const baseURI = "ipfs://";
  const roseGoldKey = ethers.encodeBytes32String("ROSE_GOLD_963HZ");

  beforeEach(async function () {
    [owner, addr1, addr2] = await ethers.getSigners();

    const TwinTowersChroniclesNFT = await ethers.getContractFactory("TwinTowersChroniclesNFT");
    chroniclesContract = await TwinTowersChroniclesNFT.deploy(baseURI, roseGoldKey);
    await chroniclesContract.waitForDeployment();
  });

  describe("Deployment", function () {
    it("Should set the correct max editions", async function () {
      expect(await chroniclesContract.MAX_EDITIONS()).to.equal(144);
    });

    it("Should have correct sacred frequencies", async function () {
      expect(await chroniclesContract.FREQUENCY_144000HZ()).to.equal(144000);
      expect(await chroniclesContract.FREQUENCY_963HZ()).to.equal(963);
      expect(await chroniclesContract.FREQUENCY_144HZ()).to.equal(144);
    });

    it("Should start with zero supply", async function () {
      expect(await chroniclesContract.getCurrentSupply()).to.equal(0);
      expect(await chroniclesContract.getRemainingEditions()).to.equal(144);
    });
  });

  describe("Chronicle Creation", function () {
    it("Should create a chronicle with correct metadata", async function () {
      const tx = await chroniclesContract.createChronicle(
        "Genesis Chronicle",
        "The first chronicle",
        "Supreme King Sovereignty",
        "Rose Gold Quantum Encryption",
        "QmTestHash123"
      );

      await tx.wait();

      const metadata = await chroniclesContract.getChronicleMetadata(0);
      expect(metadata.name).to.equal("Genesis Chronicle");
      expect(metadata.description).to.equal("The first chronicle");
      expect(metadata.sovereignAlignment).to.equal("Supreme King Sovereignty");
      expect(metadata.roseGoldEncryption).to.equal("Rose Gold Quantum Encryption");
      expect(metadata.ipfsHash).to.equal("QmTestHash123");
      expect(metadata.editionNumber).to.equal(1);
      expect(metadata.exists).to.equal(true);
    });

    it("Should increment supply after creating chronicle", async function () {
      await chroniclesContract.createChronicle(
        "Chronicle 1",
        "Description 1",
        "Alignment 1",
        "Encryption 1",
        "QmHash1"
      );

      expect(await chroniclesContract.getCurrentSupply()).to.equal(1);
      expect(await chroniclesContract.getRemainingEditions()).to.equal(143);
    });

    it("Should emit ChronicleCreated event", async function () {
      await expect(
        chroniclesContract.createChronicle(
          "Test Chronicle",
          "Description",
          "Alignment",
          "Encryption",
          "QmHash"
        )
      ).to.emit(chroniclesContract, "ChronicleCreated");
    });

    it("Should fail when max editions reached", async function () {
      // Create 144 chronicles
      for (let i = 0; i < 144; i++) {
        await chroniclesContract.createChronicle(
          `Chronicle ${i}`,
          `Description ${i}`,
          "Alignment",
          "Encryption",
          `QmHash${i}`
        );
      }

      // Try to create 145th chronicle
      await expect(
        chroniclesContract.createChronicle(
          "Extra Chronicle",
          "Description",
          "Alignment",
          "Encryption",
          "QmHashExtra"
        )
      ).to.be.revertedWith("All 144 editions minted");
    });

    it("Should fail with empty name", async function () {
      await expect(
        chroniclesContract.createChronicle(
          "",
          "Description",
          "Alignment",
          "Encryption",
          "QmHash"
        )
      ).to.be.revertedWith("Name cannot be empty");
    });

    it("Should fail with empty IPFS hash", async function () {
      await expect(
        chroniclesContract.createChronicle(
          "Name",
          "Description",
          "Alignment",
          "Encryption",
          ""
        )
      ).to.be.revertedWith("IPFS hash required");
    });
  });

  describe("Chronicle Minting", function () {
    beforeEach(async function () {
      // Create a chronicle first
      await chroniclesContract.createChronicle(
        "Test Chronicle",
        "Description",
        "Alignment",
        "Encryption",
        "QmHash"
      );
    });

    it("Should mint chronicle to recipient", async function () {
      await chroniclesContract.mint(addr1.address, 0);
      expect(await chroniclesContract.balanceOf(addr1.address, 0)).to.equal(1);
    });

    it("Should emit ChronicleMinted event", async function () {
      await expect(chroniclesContract.mint(addr1.address, 0))
        .to.emit(chroniclesContract, "ChronicleMinted")
        .withArgs(0, addr1.address, 1);
    });

    it("Should fail to mint non-existent chronicle", async function () {
      await expect(
        chroniclesContract.mint(addr1.address, 999)
      ).to.be.revertedWith("Chronicle does not exist");
    });

    it("Should fail to mint same edition twice to same address", async function () {
      await chroniclesContract.mint(addr1.address, 0);
      
      await expect(
        chroniclesContract.mint(addr1.address, 0)
      ).to.be.revertedWith("Already owns this edition");
    });

    it("Should allow same edition to different addresses", async function () {
      await chroniclesContract.mint(addr1.address, 0);
      await chroniclesContract.mint(addr2.address, 0);
      
      expect(await chroniclesContract.balanceOf(addr1.address, 0)).to.equal(1);
      expect(await chroniclesContract.balanceOf(addr2.address, 0)).to.equal(1);
    });
  });

  describe("Batch Minting", function () {
    beforeEach(async function () {
      // Create multiple chronicles
      for (let i = 0; i < 3; i++) {
        await chroniclesContract.createChronicle(
          `Chronicle ${i}`,
          `Description ${i}`,
          "Alignment",
          "Encryption",
          `QmHash${i}`
        );
      }
    });

    it("Should batch mint chronicles", async function () {
      const recipients = [addr1.address, addr2.address];
      const tokenIds = [0, 1];

      await chroniclesContract.batchMintChronicles(recipients, tokenIds);

      expect(await chroniclesContract.balanceOf(addr1.address, 0)).to.equal(1);
      expect(await chroniclesContract.balanceOf(addr2.address, 1)).to.equal(1);
    });

    it("Should fail with array length mismatch", async function () {
      const recipients = [addr1.address];
      const tokenIds = [0, 1];

      await expect(
        chroniclesContract.batchMintChronicles(recipients, tokenIds)
      ).to.be.revertedWith("Arrays length mismatch");
    });
  });

  describe("Sacred Frequencies", function () {
    beforeEach(async function () {
      await chroniclesContract.createChronicle(
        "Test Chronicle",
        "Description",
        "Alignment",
        "Encryption",
        "QmHash"
      );
    });

    it("Should return correct sacred frequencies", async function () {
      const frequencies = await chroniclesContract.getSacredFrequencies(0);
      expect(frequencies[0]).to.equal(144000); // 144,000Hz
      expect(frequencies[1]).to.equal(963);    // 963Hz
      expect(frequencies[2]).to.equal(144);    // 144Hz
    });
  });

  describe("URI Management", function () {
    beforeEach(async function () {
      await chroniclesContract.createChronicle(
        "Test Chronicle",
        "Description",
        "Alignment",
        "Encryption",
        "QmHash123"
      );
    });

    it("Should return correct URI", async function () {
      const uri = await chroniclesContract.uri(0);
      expect(uri).to.equal("ipfs://QmHash123");
    });

    it("Should update token URI", async function () {
      await chroniclesContract.setTokenURI(0, "ipfs://NewHash");
      const uri = await chroniclesContract.uri(0);
      expect(uri).to.equal("ipfs://NewHash");
    });

    it("Should update base URI", async function () {
      await chroniclesContract.setBaseURI("https://newgateway.io/ipfs/");
      // Base URI would be used for tokens without specific URI
    });
  });

  describe("Pausable", function () {
    beforeEach(async function () {
      await chroniclesContract.createChronicle(
        "Test Chronicle",
        "Description",
        "Alignment",
        "Encryption",
        "QmHash"
      );
    });

    it("Should pause and unpause", async function () {
      await chroniclesContract.pause();
      
      await expect(
        chroniclesContract.mint(addr1.address, 0)
      ).to.be.revertedWithCustomError(chroniclesContract, "EnforcedPause");

      await chroniclesContract.unpause();
      await chroniclesContract.mint(addr1.address, 0);
      expect(await chroniclesContract.balanceOf(addr1.address, 0)).to.equal(1);
    });
  });

  describe("Owner Only Functions", function () {
    it("Should allow only owner to create chronicles", async function () {
      await expect(
        chroniclesContract.connect(addr1).createChronicle(
          "Test",
          "Desc",
          "Align",
          "Encrypt",
          "QmHash"
        )
      ).to.be.revertedWithCustomError(chroniclesContract, "OwnableUnauthorizedAccount");
    });

    it("Should allow only owner to mint", async function () {
      await chroniclesContract.createChronicle(
        "Test",
        "Desc",
        "Align",
        "Encrypt",
        "QmHash"
      );

      await expect(
        chroniclesContract.connect(addr1).mint(addr2.address, 0)
      ).to.be.revertedWithCustomError(chroniclesContract, "OwnableUnauthorizedAccount");
    });
  });
});
