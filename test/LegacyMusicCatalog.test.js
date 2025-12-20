const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Legacy Music Catalog System", function () {
  let legacyCoin, catalog;
  let owner, addr1, addr2, heir1, heir2;
  
  const INITIAL_SUPPLY = ethers.parseUnits("1000000000", 18); // 1 billion tokens
  
  beforeEach(async function () {
    [owner, addr1, addr2, heir1, heir2] = await ethers.getSigners();
    
    // Deploy LegacyCoin
    const LegacyCoin = await ethers.getContractFactory("LegacyCoin");
    legacyCoin = await LegacyCoin.deploy(INITIAL_SUPPLY);
    await legacyCoin.waitForDeployment();
    
    // Deploy LegacyMusicCatalog
    const LegacyMusicCatalog = await ethers.getContractFactory("LegacyMusicCatalog");
    catalog = await LegacyMusicCatalog.deploy();
    await catalog.waitForDeployment();
    
    // Link contracts
    await catalog.setLegacyCoinAddress(await legacyCoin.getAddress());
  });
  
  describe("LegacyCoin Token", function () {
    it("Should deploy with correct initial supply", async function () {
      const totalSupply = await legacyCoin.totalSupply();
      expect(totalSupply).to.equal(INITIAL_SUPPLY);
    });
    
    it("Should have correct token metadata", async function () {
      expect(await legacyCoin.name()).to.equal("LegacyCoin");
      expect(await legacyCoin.symbol()).to.equal("LEGACYCOIN");
      expect(await legacyCoin.decimals()).to.equal(18);
    });
    
    it("Should update asset backing correctly", async function () {
      const preciousMetals = ethers.parseEther("100");
      const cosmicMaterials = ethers.parseEther("50");
      const proofURI = "ipfs://QmTestBacking";
      
      await legacyCoin.updateAssetBacking(preciousMetals, cosmicMaterials, proofURI);
      
      const backing = await legacyCoin.assetBacking();
      expect(backing.preciousMetalsValue).to.equal(preciousMetals);
      expect(backing.cosmicMaterialsValue).to.equal(cosmicMaterials);
      expect(backing.backingProofURI).to.equal(proofURI);
      
      const totalBacking = await legacyCoin.getTotalBackingValue();
      expect(totalBacking).to.equal(ethers.parseEther("150"));
    });
    
    it("Should create revenue streams", async function () {
      const tx = await legacyCoin.createRevenueStream("Michael Jackson Royalties");
      await tx.wait();
      
      const stream = await legacyCoin.getRevenueStream(0);
      expect(stream.streamName).to.equal("Michael Jackson Royalties");
      expect(stream.totalRevenue).to.equal(0);
      expect(stream.isActive).to.be.true;
    });
    
    it("Should record revenue correctly", async function () {
      await legacyCoin.createRevenueStream("Test Stream");
      
      const revenue = ethers.parseEther("10");
      await legacyCoin.recordRevenue(0, revenue, 5);
      
      const stream = await legacyCoin.getRevenueStream(0);
      expect(stream.totalRevenue).to.equal(revenue);
      expect(stream.activeStakeholders).to.equal(5);
    });
    
    it("Should have correct rarity multipliers", async function () {
      expect(await legacyCoin.rarityMultipliers(0)).to.equal(100);  // COMMON: 1x
      expect(await legacyCoin.rarityMultipliers(5)).to.equal(1000); // PLATINUM: 10x
      expect(await legacyCoin.rarityMultipliers(6)).to.equal(2000); // COSMIC: 20x
    });
    
    it("Should allow updating rarity multipliers", async function () {
      await legacyCoin.updateRarityMultiplier(5, 1500);
      expect(await legacyCoin.rarityMultipliers(5)).to.equal(1500);
    });
    
    it("Should mint additional tokens within max supply", async function () {
      const mintAmount = ethers.parseUnits("1000000", 18);
      await legacyCoin.mint(addr1.address, mintAmount);
      
      const balance = await legacyCoin.balanceOf(addr1.address);
      expect(balance).to.equal(mintAmount);
    });
    
    it("Should prevent minting beyond max supply", async function () {
      const maxSupply = await legacyCoin.maxSupply();
      const excessAmount = ethers.parseUnits("100000000000", 18); // Way over max
      
      await expect(
        legacyCoin.mint(addr1.address, excessAmount)
      ).to.be.revertedWith("Exceeds max supply");
    });
    
    it("Should allow burning tokens", async function () {
      const burnAmount = ethers.parseUnits("1000", 18);
      await legacyCoin.burn(burnAmount);
      
      const totalSupply = await legacyCoin.totalSupply();
      expect(totalSupply).to.equal(INITIAL_SUPPLY - burnAmount);
    });
  });
  
  describe("Legacy Music Catalog - Blueprints", function () {
    it("Should create acquisition blueprint", async function () {
      const catalogName = "Sony Music Catalog";
      const targetValue = ethers.parseEther("1350");
      const legalURI = "ipfs://QmLegal";
      const ipURI = "ipfs://QmIP";
      
      await catalog.createBlueprint(catalogName, targetValue, legalURI, ipURI);
      
      const blueprint = await catalog.getBlueprint(0);
      expect(blueprint.catalogName).to.equal(catalogName);
      expect(blueprint.targetValue).to.equal(targetValue);
      expect(blueprint.legalRegistryURI).to.equal(legalURI);
      expect(blueprint.ipRegistryURI).to.equal(ipURI);
      expect(blueprint.isCompleted).to.be.false;
    });
    
    it("Should complete acquisition with overcompensation", async function () {
      await catalog.createBlueprint("Test Catalog", ethers.parseEther("100"), "ipfs://L", "ipfs://I");
      
      const paidValue = ethers.parseEther("200"); // 2x overcompensation
      await catalog.completeAcquisition(0, paidValue);
      
      const blueprint = await catalog.getBlueprint(0);
      expect(blueprint.isCompleted).to.be.true;
      expect(blueprint.paidValue).to.equal(paidValue);
    });
    
    it("Should not allow completing blueprint twice", async function () {
      await catalog.createBlueprint("Test Catalog", ethers.parseEther("100"), "ipfs://L", "ipfs://I");
      await catalog.completeAcquisition(0, ethers.parseEther("200"));
      
      await expect(
        catalog.completeAcquisition(0, ethers.parseEther("200"))
      ).to.be.revertedWith("Already completed");
    });
  });
  
  describe("Legacy Music Catalog - NFT Minting", function () {
    it("Should mint music asset NFT with correct metadata", async function () {
      const heirs = [heir1.address, heir2.address];
      const shares = [6000, 4000]; // 60% and 40%
      
      await catalog.mintMusicAsset(
        addr1.address,
        "Billie Jean",
        "Michael Jackson",
        "Thriller",
        "Iconic MJ track",
        "ipfs://QmBillieJean",
        4, // LEGENDARY
        0, // MICHAEL_JACKSON
        528,
        ethers.parseEther("50"),
        heirs,
        shares
      );
      
      const asset = await catalog.getMusicAsset(0);
      expect(asset.songTitle).to.equal("Billie Jean");
      expect(asset.artistName).to.equal("Michael Jackson");
      expect(asset.albumName).to.equal("Thriller");
      expect(asset.rarity).to.equal(4);
      expect(asset.catalog).to.equal(0);
      expect(asset.resonanceFrequency).to.equal(528);
      expect(asset.heirs.length).to.equal(2);
    });
    
    it("Should mint Beatles Platinum tier asset", async function () {
      await catalog.mintMusicAsset(
        addr1.address,
        "Hey Jude",
        "The Beatles",
        "Hey Jude (Single)",
        "Beatles masterpiece",
        "ipfs://QmHeyJude",
        5, // PLATINUM
        1, // BEATLES
        528,
        ethers.parseEther("100"),
        [heir1.address],
        [10000]
      );
      
      const asset = await catalog.getMusicAsset(0);
      expect(asset.songTitle).to.equal("Hey Jude");
      expect(asset.rarity).to.equal(5); // PLATINUM
      expect(asset.catalog).to.equal(1); // BEATLES
    });
    
    it("Should mint Prince Cosmic tier asset", async function () {
      await catalog.mintMusicAsset(
        addr1.address,
        "Purple Rain",
        "Prince",
        "Purple Rain",
        "Prince vault treasure",
        "ipfs://QmPurpleRain",
        6, // COSMIC
        2, // PRINCE
        963,
        ethers.parseEther("75"),
        [heir1.address],
        [10000]
      );
      
      const asset = await catalog.getMusicAsset(0);
      expect(asset.songTitle).to.equal("Purple Rain");
      expect(asset.rarity).to.equal(6); // COSMIC
      expect(asset.catalog).to.equal(2); // PRINCE
      expect(asset.resonanceFrequency).to.equal(963);
    });
    
    it("Should reject minting with invalid heir shares", async function () {
      const invalidShares = [5000, 3000]; // Only sums to 80%
      
      await expect(
        catalog.mintMusicAsset(
          addr1.address,
          "Test Song",
          "Test Artist",
          "Test Album",
          "Description",
          "ipfs://test",
          0,
          0,
          528,
          ethers.parseEther("1"),
          [heir1.address, heir2.address],
          invalidShares
        )
      ).to.be.revertedWith("Shares must sum to 10000");
    });
    
    it("Should reject minting with mismatched heirs and shares", async function () {
      await expect(
        catalog.mintMusicAsset(
          addr1.address,
          "Test Song",
          "Test Artist",
          "Test Album",
          "Description",
          "ipfs://test",
          0,
          0,
          528,
          ethers.parseEther("1"),
          [heir1.address],
          [5000, 5000] // Two shares but only one heir
        )
      ).to.be.revertedWith("Heirs and shares mismatch");
    });
  });
  
  describe("Legacy Music Catalog - Royalty Distribution", function () {
    beforeEach(async function () {
      // Mint a test asset
      await catalog.mintMusicAsset(
        addr1.address,
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
        [6000, 4000] // 60% and 40%
      );
    });
    
    it("Should distribute royalties to heirs correctly", async function () {
      const royaltyAmount = ethers.parseEther("10");
      
      await catalog.distributeRoyalties(0, { value: royaltyAmount });
      
      const dashboard1 = await catalog.getRevenueDashboard(heir1.address);
      const dashboard2 = await catalog.getRevenueDashboard(heir2.address);
      
      // 10% goes to community fund, 90% distributed
      // Heir1: 60% of 9 ETH = 5.4 ETH
      // Heir2: 40% of 9 ETH = 3.6 ETH
      expect(dashboard1.pendingEarnings).to.equal(ethers.parseEther("5.4"));
      expect(dashboard2.pendingEarnings).to.equal(ethers.parseEther("3.6"));
    });
    
    it("Should track heir earnings for specific asset", async function () {
      const royaltyAmount = ethers.parseEther("10");
      await catalog.distributeRoyalties(0, { value: royaltyAmount });
      
      const heir1Earnings = await catalog.getHeirEarnings(0, heir1.address);
      const heir2Earnings = await catalog.getHeirEarnings(0, heir2.address);
      
      expect(heir1Earnings).to.equal(ethers.parseEther("5.4"));
      expect(heir2Earnings).to.equal(ethers.parseEther("3.6"));
    });
    
    it("Should allow heir to claim earnings", async function () {
      const royaltyAmount = ethers.parseEther("10");
      await catalog.distributeRoyalties(0, { value: royaltyAmount });
      
      const initialBalance = await ethers.provider.getBalance(heir1.address);
      
      const tx = await catalog.connect(heir1).claimHeirEarnings();
      const receipt = await tx.wait();
      const gasUsed = receipt.gasUsed * receipt.gasPrice;
      
      const finalBalance = await ethers.provider.getBalance(heir1.address);
      const expectedBalance = initialBalance + ethers.parseEther("5.4") - gasUsed;
      
      expect(finalBalance).to.be.closeTo(expectedBalance, ethers.parseEther("0.001"));
      
      const dashboard = await catalog.getRevenueDashboard(heir1.address);
      expect(dashboard.pendingEarnings).to.equal(0);
    });
    
    it("Should allocate community art fund percentage", async function () {
      const royaltyAmount = ethers.parseEther("100");
      await catalog.distributeRoyalties(0, { value: royaltyAmount });
      
      const communityFund = await catalog.communityArtFundBalance();
      expect(communityFund).to.equal(ethers.parseEther("10")); // 10%
    });
    
    it("Should prevent claiming with no pending earnings", async function () {
      await expect(
        catalog.connect(heir1).claimHeirEarnings()
      ).to.be.revertedWith("No pending earnings");
    });
  });
  
  describe("Legacy Music Catalog - Asset Vaults", function () {
    it("Should create asset vault", async function () {
      await catalog.createVault("Fort Knox Vault", "ipfs://QmVaultQR");
      
      const vault = await catalog.getVault(0);
      expect(vault.vaultLocation).to.equal("Fort Knox Vault");
      expect(vault.qrCodeURI).to.equal("ipfs://QmVaultQR");
      expect(vault.isActive).to.be.true;
    });
    
    it("Should secure asset in vault", async function () {
      // Create vault
      await catalog.createVault("Test Vault", "ipfs://QR");
      
      // Mint asset
      await catalog.mintMusicAsset(
        addr1.address,
        "Test Song",
        "Artist",
        "Album",
        "Desc",
        "ipfs://test",
        4,
        0,
        528,
        ethers.parseEther("1"),
        [heir1.address],
        [10000]
      );
      
      // Secure asset
      await catalog.secureAsset(0, 0);
      
      const asset = await catalog.getMusicAsset(0);
      expect(asset.isPhysicallySecured).to.be.true;
      expect(asset.isDigitallyMirrored).to.be.true;
      
      const vault = await catalog.getVault(0);
      expect(vault.storedAssets.length).to.equal(1);
      expect(vault.storedAssets[0]).to.equal(0);
    });
    
    it("Should prevent securing asset in inactive vault", async function () {
      await catalog.createVault("Test Vault", "ipfs://QR");
      
      await catalog.mintMusicAsset(
        addr1.address,
        "Test",
        "Artist",
        "Album",
        "Desc",
        "ipfs://test",
        0,
        0,
        528,
        ethers.parseEther("1"),
        [heir1.address],
        [10000]
      );
      
      // Try to secure in non-existent vault
      await expect(
        catalog.secureAsset(0, 999)
      ).to.be.revertedWith("Invalid vault ID");
    });
  });
  
  describe("Legacy Music Catalog - Community Fund", function () {
    it("Should update community fund percentage", async function () {
      await catalog.updateCommunityFundPercentage(1500); // 15%
      expect(await catalog.communityArtFundPercentage()).to.equal(1500);
    });
    
    it("Should prevent setting percentage above 100%", async function () {
      await expect(
        catalog.updateCommunityFundPercentage(10001)
      ).to.be.revertedWith("Percentage too high");
    });
    
    it("Should allow owner to withdraw community fund", async function () {
      // Mint asset and distribute royalties to build fund
      await catalog.mintMusicAsset(
        addr1.address,
        "Test",
        "Artist",
        "Album",
        "Desc",
        "ipfs://test",
        0,
        0,
        528,
        ethers.parseEther("1"),
        [heir1.address],
        [10000]
      );
      
      await catalog.distributeRoyalties(0, { value: ethers.parseEther("100") });
      
      const fundBalance = await catalog.communityArtFundBalance();
      expect(fundBalance).to.equal(ethers.parseEther("10"));
      
      const initialBalance = await ethers.provider.getBalance(addr2.address);
      await catalog.withdrawCommunityFund(fundBalance, addr2.address);
      const finalBalance = await ethers.provider.getBalance(addr2.address);
      
      expect(finalBalance - initialBalance).to.equal(fundBalance);
      expect(await catalog.communityArtFundBalance()).to.equal(0);
    });
  });
  
  describe("Integration Tests", function () {
    it("Should execute full workflow: blueprint -> mint -> secure -> distribute", async function () {
      // Create blueprint
      await catalog.createBlueprint(
        "Sony Catalog",
        ethers.parseEther("1000"),
        "ipfs://legal",
        "ipfs://ip"
      );
      
      // Complete acquisition
      await catalog.completeAcquisition(0, ethers.parseEther("2000"));
      
      // Create vault
      await catalog.createVault("Fort Knox", "ipfs://qr");
      
      // Mint asset
      await catalog.mintMusicAsset(
        addr1.address,
        "Billie Jean",
        "Michael Jackson",
        "Thriller",
        "Legendary track",
        "ipfs://billie",
        4,
        0,
        528,
        ethers.parseEther("50"),
        [heir1.address, heir2.address],
        [7000, 3000]
      );
      
      // Secure asset
      await catalog.secureAsset(0, 0);
      
      // Distribute royalties
      await catalog.distributeRoyalties(0, { value: ethers.parseEther("100") });
      
      // Verify heir earnings
      const dashboard1 = await catalog.getRevenueDashboard(heir1.address);
      const dashboard2 = await catalog.getRevenueDashboard(heir2.address);
      
      expect(dashboard1.pendingEarnings).to.equal(ethers.parseEther("63")); // 70% of 90
      expect(dashboard2.pendingEarnings).to.equal(ethers.parseEther("27")); // 30% of 90
      
      // Verify asset is secured
      const asset = await catalog.getMusicAsset(0);
      expect(asset.isPhysicallySecured).to.be.true;
      expect(asset.isDigitallyMirrored).to.be.true;
    });
  });
});
