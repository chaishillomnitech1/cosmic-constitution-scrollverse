const hre = require("hardhat");

/**
 * Deploy Legacy Music Catalog System
 * Deploys LegacyCoin and LegacyMusicCatalog contracts
 * Configures initial catalog assets (Michael Jackson, Beatles, Prince)
 */
async function main() {
  console.log("🎵 Deploying Legacy Music Catalog System...\n");

  // Get deployer account
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying contracts with account:", deployer.address);
  console.log("Account balance:", (await hre.ethers.provider.getBalance(deployer.address)).toString());

  // ===== STEP 1: Deploy $LEGACYCOIN =====
  console.log("\n📊 Step 1: Deploying $LEGACYCOIN token...");
  
  const initialSupply = hre.ethers.parseUnits("1000000000", 18); // 1 billion tokens
  const LegacyCoin = await hre.ethers.getContractFactory("LegacyCoin");
  const legacyCoin = await LegacyCoin.deploy(initialSupply);
  await legacyCoin.waitForDeployment();
  
  const legacyCoinAddress = await legacyCoin.getAddress();
  console.log("✅ $LEGACYCOIN deployed to:", legacyCoinAddress);

  // Configure asset backing
  console.log("\n💎 Configuring asset backing with precious metals and cosmic materials...");
  const preciousMetalsValue = hre.ethers.parseEther("100"); // 100 ETH worth
  const cosmicMaterialsValue = hre.ethers.parseEther("50");  // 50 ETH worth
  const backingProofURI = "ipfs://QmLegacyCoinAssetBacking2025";
  
  const backingTx = await legacyCoin.updateAssetBacking(
    preciousMetalsValue,
    cosmicMaterialsValue,
    backingProofURI
  );
  await backingTx.wait();
  console.log("✅ Asset backing configured");

  // Create revenue streams
  console.log("\n💰 Creating revenue streams...");
  const streams = [
    "Michael Jackson Royalties",
    "Beatles Catalog Revenue",
    "Prince Vault Collections",
    "Sony Catalog Integration"
  ];

  for (const streamName of streams) {
    const tx = await legacyCoin.createRevenueStream(streamName);
    await tx.wait();
    console.log(`  ✅ Created: ${streamName}`);
  }

  // ===== STEP 2: Deploy Legacy Music Catalog =====
  console.log("\n🎼 Step 2: Deploying Legacy Music Catalog NFT contract...");
  
  const LegacyMusicCatalog = await hre.ethers.getContractFactory("LegacyMusicCatalog");
  const catalog = await LegacyMusicCatalog.deploy();
  await catalog.waitForDeployment();
  
  const catalogAddress = await catalog.getAddress();
  console.log("✅ Legacy Music Catalog deployed to:", catalogAddress);

  // Link LegacyCoin to catalog
  console.log("\n🔗 Linking $LEGACYCOIN to catalog...");
  const linkTx = await catalog.setLegacyCoinAddress(legacyCoinAddress);
  await linkTx.wait();
  console.log("✅ $LEGACYCOIN linked to catalog");

  // ===== STEP 3: Create Acquisition Blueprints =====
  console.log("\n📋 Step 3: Creating acquisition blueprints...");

  // Sony Music Catalog Blueprint ($1.2B-$1.5B, paying 2x)
  const sonyTargetValue = hre.ethers.parseEther("1350"); // $1.35B equivalent
  const sonyBlueprintTx = await catalog.createBlueprint(
    "Sony Music Catalog - Michael Jackson & Beyond",
    sonyTargetValue,
    "ipfs://QmSonyLegalRegistry2025",
    "ipfs://QmSonyIPRegistry528Hz963Hz"
  );
  await sonyBlueprintTx.wait();
  console.log("  ✅ Sony Music Catalog blueprint created (Target: 1350 ETH, 2x overcompensation)");

  // Prince Archival Works Blueprint
  const princeTargetValue = hre.ethers.parseEther("500");
  const princeBlueprintTx = await catalog.createBlueprint(
    "Prince Vault - Archival Works & Unreleased Masters",
    princeTargetValue,
    "ipfs://QmPrinceLegalRegistry2025",
    "ipfs://QmPrinceIPRegistry963Hz"
  );
  await princeBlueprintTx.wait();
  console.log("  ✅ Prince Vault blueprint created (Target: 500 ETH, 2x overcompensation)");

  // Beatles Catalog Blueprint
  const beatlesTargetValue = hre.ethers.parseEther("800");
  const beatlesBlueprintTx = await catalog.createBlueprint(
    "Beatles Complete Catalog - Platinum Edition",
    beatlesTargetValue,
    "ipfs://QmBeatlesLegalRegistry2025",
    "ipfs://QmBeatlesIPRegistry528Hz"
  );
  await beatlesBlueprintTx.wait();
  console.log("  ✅ Beatles Catalog blueprint created (Target: 800 ETH, 2x overcompensation)");

  // ===== STEP 4: Create Asset Vaults =====
  console.log("\n🏛️ Step 4: Creating secure asset vaults...");

  const vault1Tx = await catalog.createVault(
    "Fort Knox Digital Vault - Level 1",
    "ipfs://QmFortKnoxVault1QR2025"
  );
  await vault1Tx.wait();
  console.log("  ✅ Fort Knox Vault #0 created");

  const vault2Tx = await catalog.createVault(
    "Cosmic Preservation Chamber - Switzerland",
    "ipfs://QmCosmicVaultSwitzerlandQR2025"
  );
  await vault2Tx.wait();
  console.log("  ✅ Cosmic Vault #1 created");

  // ===== STEP 5: Mint Flagship Assets =====
  console.log("\n🎨 Step 5: Minting flagship music assets...");

  // Example heir addresses (in production, use actual heir addresses)
  const michaelJacksonHeirs = [deployer.address]; // Placeholder
  const michaelJacksonShares = [10000]; // 100% to single heir (for demo)

  // Mint "Billie Jean" - Michael Jackson
  console.log("\n  🎵 Minting: Michael Jackson - Billie Jean");
  const billiJeanTx = await catalog.mintMusicAsset(
    deployer.address,
    "Billie Jean",
    "Michael Jackson",
    "Thriller",
    "Iconic single from the legendary Thriller album - One of the most recognizable songs in music history",
    "ipfs://QmBillieJeanMetadata2025",
    4, // LEGENDARY
    0, // MICHAEL_JACKSON
    528, // 528 Hz Love Vortex
    hre.ethers.parseEther("50"),
    michaelJacksonHeirs,
    michaelJacksonShares
  );
  await billiJeanTx.wait();
  console.log("  ✅ Billie Jean NFT minted (Token ID: 0)");

  // Mint Beatles flagship
  console.log("\n  🎵 Minting: The Beatles - Hey Jude");
  const heyJudeTx = await catalog.mintMusicAsset(
    deployer.address,
    "Hey Jude",
    "The Beatles",
    "Hey Jude (Single)",
    "Beatles' most commercially successful single - Platinum tier catalog asset",
    "ipfs://QmHeyJudeMetadata2025",
    5, // PLATINUM (Beatles tier)
    1, // BEATLES
    528, // 528 Hz
    hre.ethers.parseEther("100"),
    [deployer.address],
    [10000]
  );
  await heyJudeTx.wait();
  console.log("  ✅ Hey Jude NFT minted (Token ID: 1)");

  // Mint Prince Vault asset
  console.log("\n  🎵 Minting: Prince - Purple Rain");
  const purpleRainTx = await catalog.mintMusicAsset(
    deployer.address,
    "Purple Rain",
    "Prince",
    "Purple Rain",
    "Prince's magnum opus - Cosmic tier from the legendary vault",
    "ipfs://QmPurpleRainMetadata2025",
    6, // COSMIC (Prince Vault tier)
    2, // PRINCE
    963, // 963 Hz Eden Pulse
    hre.ethers.parseEther("75"),
    [deployer.address],
    [10000]
  );
  await purpleRainTx.wait();
  console.log("  ✅ Purple Rain NFT minted (Token ID: 2)");

  // ===== STEP 6: Secure Assets in Vaults =====
  console.log("\n🔒 Step 6: Securing assets in vaults...");
  
  await (await catalog.secureAsset(0, 0)).wait(); // Billie Jean in Fort Knox
  await (await catalog.secureAsset(1, 0)).wait(); // Hey Jude in Fort Knox
  await (await catalog.secureAsset(2, 1)).wait(); // Purple Rain in Cosmic Vault
  
  console.log("  ✅ All flagship assets secured with physical + digital protection");

  // ===== DEPLOYMENT SUMMARY =====
  console.log("\n" + "=".repeat(70));
  console.log("🎊 LEGACY MUSIC CATALOG SYSTEM DEPLOYMENT COMPLETE");
  console.log("=".repeat(70));
  console.log("\n📋 Contract Addresses:");
  console.log("  💎 $LEGACYCOIN:", legacyCoinAddress);
  console.log("  🎵 Legacy Music Catalog:", catalogAddress);
  
  console.log("\n📊 Initial Configuration:");
  console.log("  - Asset Backing: 100 ETH (precious metals) + 50 ETH (cosmic materials)");
  console.log("  - Revenue Streams: 4 created");
  console.log("  - Acquisition Blueprints: 3 created");
  console.log("  - Asset Vaults: 2 created");
  console.log("  - Flagship Assets Minted: 3");
  console.log("    • Billie Jean (LEGENDARY) - Michael Jackson");
  console.log("    • Hey Jude (PLATINUM) - Beatles");
  console.log("    • Purple Rain (COSMIC) - Prince");
  
  console.log("\n🚀 Next Steps:");
  console.log("  1. Configure actual heir addresses for royalty distribution");
  console.log("  2. Complete Sony buyout blueprint (deploy 2700 ETH for 2x valuation)");
  console.log("  3. Deploy additional catalog assets to zkEVM");
  console.log("  4. Set up automated royalty distribution");
  console.log("  5. Launch Revenue Dashboards for heir tracking");
  console.log("  6. Activate Witness Grid for global streaming");
  
  console.log("\n💫 All actions are immutable, irreversible, and omni-protected.");
  console.log("=".repeat(70) + "\n");

  // Save deployment info
  const deploymentInfo = {
    network: hre.network.name,
    timestamp: new Date().toISOString(),
    contracts: {
      LegacyCoin: {
        address: legacyCoinAddress,
        initialSupply: initialSupply.toString(),
        assetBacking: {
          preciousMetals: preciousMetalsValue.toString(),
          cosmicMaterials: cosmicMaterialsValue.toString()
        }
      },
      LegacyMusicCatalog: {
        address: catalogAddress,
        blueprints: 3,
        vaults: 2,
        mintedAssets: 3
      }
    }
  };

  console.log("📄 Deployment Info:");
  console.log(JSON.stringify(deploymentInfo, null, 2));
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
