const hre = require("hardhat");

async function main() {
  console.log("Deploying Queens Sovereignty Eternal Crowns System...");
  console.log("=" .repeat(60));

  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying contracts with account:", deployer.address);

  // Define the three primary queen addresses
  // These should be replaced with actual addresses in production
  const MIKA_ADDRESS = process.env.MIKA_ADDRESS || deployer.address;
  const LILATH_ADDRESS = process.env.LILATH_ADDRESS || deployer.address;
  const LITTLE_WARREN_ADDRESS = process.env.LITTLE_WARREN_ADDRESS || deployer.address;

  console.log("\nPrimary Queens Addresses:");
  console.log("- Mika Sovereign:", MIKA_ADDRESS);
  console.log("- Lilath Divine:", LILATH_ADDRESS);
  console.log("- Little Warren Cosmic:", LITTLE_WARREN_ADDRESS);

  // Deploy QueensSovereignty Contract
  console.log("\n1. Deploying Queens Sovereignty Contract...");
  const QueensSovereignty = await hre.ethers.getContractFactory("QueensSovereignty");
  const queensSovereignty = await QueensSovereignty.deploy(
    deployer.address,
    MIKA_ADDRESS,
    LILATH_ADDRESS,
    LITTLE_WARREN_ADDRESS
  );
  await queensSovereignty.waitForDeployment();
  const queensSovereigntyAddress = await queensSovereignty.getAddress();
  console.log("✅ Queens Sovereignty deployed to:", queensSovereigntyAddress);

  // Setup MedAir Oracle if available
  const MEDAIR_ORACLE_ADDRESS = process.env.MEDAIR_ORACLE_ADDRESS;
  if (MEDAIR_ORACLE_ADDRESS) {
    console.log("\n2. Configuring Coherence Oracle...");
    await queensSovereignty.setCoherenceOracle(MEDAIR_ORACLE_ADDRESS);
    console.log("✅ Coherence Oracle configured:", MEDAIR_ORACLE_ADDRESS);
  } else {
    console.log("\n2. Coherence Oracle not configured (set MEDAIR_ORACLE_ADDRESS)");
  }

  // Activate Akashic Expansion Loop
  console.log("\n3. Activating Akashic Expansion Loop...");
  await queensSovereignty.activateAkashicExpansion();
  console.log("✅ Akashic Expansion Loop activated");

  // Batch mint initial crowns for the three primary queens
  console.log("\n4. Batch Minting Initial Eternal Crowns...");
  
  const queenAddresses = [MIKA_ADDRESS, LILATH_ADDRESS, LITTLE_WARREN_ADDRESS];
  const names = [
    "Mika's Eternal Sovereign Crown",
    "Lilath's Divine Crown of Wisdom",
    "Little Warren's Cosmic Crown of Creation"
  ];
  const descriptions = [
    "The Eternal Crown of Sovereignty bestowed upon Mika, radiating with 528Hz love frequency and divine authority",
    "The Divine Crown of Wisdom granted to Lilath, embodying infinite knowledge and celestial guidance",
    "The Cosmic Crown of Creation for Little Warren, channeling universal creative force and harmonic resonance"
  ];
  const uris = [
    "ipfs://QmMikaSovereignCrown/metadata.json",
    "ipfs://QmLilathDivineCrown/metadata.json",
    "ipfs://QmLittleWarrenCosmicCrown/metadata.json"
  ];
  const crownTypes = [0, 1, 2]; // MIKA_SOVEREIGN, LILATH_DIVINE, LITTLE_WARREN_COSMIC
  const coherenceScores = [100, 100, 100]; // Divine level for all three primary queens
  const geminidRandomSeeds = [
    Math.floor(Math.random() * 1000000),
    Math.floor(Math.random() * 1000000),
    Math.floor(Math.random() * 1000000)
  ];

  const tx = await queensSovereignty.batchMintCrowns(
    queenAddresses,
    names,
    descriptions,
    uris,
    crownTypes,
    coherenceScores,
    geminidRandomSeeds
  );
  await tx.wait();
  console.log("✅ Initial crowns minted for Mika, Lilath, and Little Warren");

  // Add Harlem Queens tribute data to the crowns
  console.log("\n5. Adding Harlem Queens Tribute Tie-ins...");
  const tributeData = JSON.stringify({
    tribute: "Harlem Queens Legacy",
    frequency: "528Hz",
    dedication: "To the divine feminine wisdom of Harlem's sacred lineage",
    timestamp: Date.now()
  });
  
  for (let i = 0; i < 3; i++) {
    await queensSovereignty.addHarlemTribute(i, tributeData);
  }
  console.log("✅ Harlem Queens tribute data added to all initial crowns");

  console.log("\n" + "=" .repeat(60));
  console.log("Configuration Summary");
  console.log("=" .repeat(60));

  const totalCrowns = await queensSovereignty.getTotalCrowns();
  console.log("\n📊 Crown Statistics:");
  console.log("- Total Crowns Minted:", totalCrowns.toString());
  
  const mikaCrowns = await queensSovereignty.getTotalMintedByCrownType(0);
  const lilathCrowns = await queensSovereignty.getTotalMintedByCrownType(1);
  const warrenCrowns = await queensSovereignty.getTotalMintedByCrownType(2);
  
  console.log("- Mika Sovereign Crowns:", mikaCrowns.toString());
  console.log("- Lilath Divine Crowns:", lilathCrowns.toString());
  console.log("- Little Warren Cosmic Crowns:", warrenCrowns.toString());

  console.log("\n🎵 Resonance Configuration:");
  console.log("- Primary Frequency: 528 Hz (Love/Trust/Coherence)");
  console.log("- Coherence Auto-Trigger Threshold: 76% (Sovereign Level)");
  console.log("- Akashic Expansion: ACTIVE");

  console.log("\n👑 Queen Addresses:");
  console.log("- Mika:", MIKA_ADDRESS);
  console.log("- Lilath:", LILATH_ADDRESS);
  console.log("- Little Warren:", LITTLE_WARREN_ADDRESS);

  // Get sample crown metadata
  console.log("\n🔮 Sample Crown Metadata (Token #0 - Mika):");
  const crown0 = await queensSovereignty.getCrownMetadata(0);
  console.log("- Name:", crown0.name);
  console.log("- Crown Type:", crown0.crownType);
  console.log("- Coherence Score:", crown0.coherenceScore.toString());
  console.log("- Coherence Level:", crown0.coherenceLevel);
  console.log("- Resonance Frequency:", crown0.resonanceFrequency.toString(), "Hz");
  console.log("- Akashic Upgraded:", crown0.isAkashicUpgraded);

  console.log("\n" + "=" .repeat(60));
  console.log("🎉 Queens Sovereignty Deployment Complete!");
  console.log("=" .repeat(60));

  // Print deployment summary
  console.log("\n📋 DEPLOYMENT SUMMARY:");
  console.log("-" .repeat(60));
  console.log("Queens Sovereignty Contract:", queensSovereigntyAddress);
  console.log("Network:", hre.network.name);
  console.log("Deployer:", deployer.address);
  console.log("-" .repeat(60));

  // Save deployment info to file
  const fs = require("fs");
  const deploymentInfo = {
    network: hre.network.name,
    timestamp: new Date().toISOString(),
    deployer: deployer.address,
    contracts: {
      QueensSovereignty: queensSovereigntyAddress,
    },
    queens: {
      Mika: MIKA_ADDRESS,
      Lilath: LILATH_ADDRESS,
      LittleWarren: LITTLE_WARREN_ADDRESS,
    },
    initialMints: {
      totalCrowns: totalCrowns.toString(),
      mikaCrowns: mikaCrowns.toString(),
      lilathCrowns: lilathCrowns.toString(),
      warrenCrowns: warrenCrowns.toString(),
    },
  };

  // Ensure deployments directory exists
  if (!fs.existsSync("deployments")) {
    fs.mkdirSync("deployments");
  }

  fs.writeFileSync(
    `deployments/queens-sovereignty-${hre.network.name}-${Date.now()}.json`,
    JSON.stringify(deploymentInfo, null, 2)
  );
  console.log("\n✅ Deployment info saved to deployments/");

  // Verification instructions
  if (hre.network.name !== "localhost" && hre.network.name !== "hardhat") {
    console.log("\n📝 To verify contract on Etherscan, run:");
    console.log(`npx hardhat verify --network ${hre.network.name} ${queensSovereigntyAddress} "${deployer.address}" "${MIKA_ADDRESS}" "${LILATH_ADDRESS}" "${LITTLE_WARREN_ADDRESS}"`);
  }

  console.log("\n🌟 Ready for Solstice Portal Activation!");
  console.log("🔮 144,000 Akashic Queens await their crowns...");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
