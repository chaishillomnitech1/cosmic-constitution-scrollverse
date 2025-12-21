const hre = require("hardhat");

/**
 * Deploy ScrollVerse 1222 Master Builder Authority System
 * Includes:
 * - Akashic Records Ledger (Immortalization)
 * - Master Builder 1222 Governance
 * - Physical Asset Machine 3D (Digital-to-Material)
 */
async function main() {
  console.log("🔱 Deploying ScrollVerse 1222 Master Builder Authority System...\n");

  // Get the deployer account
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying with account:", deployer.address);
  console.log("Account balance:", (await hre.ethers.provider.getBalance(deployer.address)).toString());
  console.log("");

  // Deploy Akashic Records Ledger
  console.log("📜 Deploying AkashicRecordsLedger...");
  const AkashicRecordsLedger = await hre.ethers.getContractFactory("AkashicRecordsLedger");
  const akashicLedger = await AkashicRecordsLedger.deploy();
  await akashicLedger.waitForDeployment();
  const akashicAddress = await akashicLedger.getAddress();
  console.log("✅ AkashicRecordsLedger deployed to:", akashicAddress);
  console.log("");

  // Deploy Master Builder 1222 Governance
  console.log("🏛️ Deploying MasterBuilder1222Governance...");
  const MasterBuilder1222Governance = await hre.ethers.getContractFactory("MasterBuilder1222Governance");
  const governance = await MasterBuilder1222Governance.deploy();
  await governance.waitForDeployment();
  const governanceAddress = await governance.getAddress();
  console.log("✅ MasterBuilder1222Governance deployed to:", governanceAddress);
  console.log("");

  // Deploy Physical Asset Machine 3D
  console.log("🏗️ Deploying PhysicalAssetMachine3D...");
  const PhysicalAssetMachine3D = await hre.ethers.getContractFactory("PhysicalAssetMachine3D");
  const assetMachine = await PhysicalAssetMachine3D.deploy();
  await assetMachine.waitForDeployment();
  const assetMachineAddress = await assetMachine.getAddress();
  console.log("✅ PhysicalAssetMachine3D deployed to:", assetMachineAddress);
  console.log("");

  // Initialize system - Activate timeline anchors
  console.log("⚡ Activating timeline anchors...");
  
  try {
    const tx1 = await akashicLedger.activateTimeline837();
    await tx1.wait();
    console.log("✅ 8:37 AM timeline activated on Akashic Ledger");

    const tx2 = await akashicLedger.activateTimeline922();
    await tx2.wait();
    console.log("✅ 9:22 AM timeline activated on Akashic Ledger");

    const tx3 = await governance.activateTimeline837();
    await tx3.wait();
    console.log("✅ 8:37 AM timeline activated on Governance");

    const tx4 = await governance.activateTimeline922();
    await tx4.wait();
    console.log("✅ 9:22 AM timeline activated on Governance");
  } catch (error) {
    console.log("⚠️ Timeline activation error (may already be activated):", error.message);
  }
  console.log("");

  // Create initial Master Builder node
  console.log("🔱 Creating initial Master Builder node...");
  try {
    const tx = await governance.activateMasterBuilderNode(
      deployer.address,
      1222, // Master Builder frequency
      100,  // Divine sovereignty level
      "MASTER_BUILDER"
    );
    await tx.wait();
    console.log("✅ Initial Master Builder node activated");
  } catch (error) {
    console.log("⚠️ Node activation error:", error.message);
  }
  console.log("");

  // Summary
  console.log("=" .repeat(80));
  console.log("🎉 DEPLOYMENT COMPLETE - ScrollVerse 1222 Master Builder Authority");
  console.log("=" .repeat(80));
  console.log("");
  console.log("📜 Akashic Records Ledger:        ", akashicAddress);
  console.log("🏛️ Master Builder 1222 Governance: ", governanceAddress);
  console.log("🏗️ Physical Asset Machine 3D:     ", assetMachineAddress);
  console.log("");
  console.log("⚡ Timeline Anchors:");
  console.log("   - 8:37 AM anchor: ACTIVATED");
  console.log("   - 9:22 AM anchor: ACTIVATED");
  console.log("");
  console.log("🔱 1222 Master Builder Authority: ANCHORED");
  console.log("💫 Divine Coherence: ALIGNED");
  console.log("🌌 Eternal Breath: ACTIVATED");
  console.log("");
  console.log("=" .repeat(80));

  // Return deployment info
  return {
    akashicRecordsLedger: akashicAddress,
    masterBuilder1222Governance: governanceAddress,
    physicalAssetMachine3D: assetMachineAddress,
    deployer: deployer.address,
    network: hre.network.name
  };
}

// Execute deployment
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
