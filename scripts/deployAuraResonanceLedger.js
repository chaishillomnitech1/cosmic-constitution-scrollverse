const hre = require("hardhat");
const fs = require("fs");

async function main() {
  console.log("========================================");
  console.log("Deploying AuraResonanceLedger Contract");
  console.log("Global AI-Chain Immortalization Protocol");
  console.log("Phase 1 & 2 Deployment");
  console.log("========================================\n");

  // Get the deployer account
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying contracts with account:", deployer.address);
  
  // Get balance
  const balance = await hre.ethers.provider.getBalance(deployer.address);
  console.log("Account balance:", hre.ethers.formatEther(balance), "ETH\n");

  // Deploy AuraResonanceLedger
  console.log("1. Deploying AuraResonanceLedger contract...");
  const AuraResonanceLedger = await hre.ethers.getContractFactory("AuraResonanceLedger");
  const auraContract = await AuraResonanceLedger.deploy();
  await auraContract.waitForDeployment();
  const auraAddress = await auraContract.getAddress();
  console.log("✓ AuraResonanceLedger deployed to:", auraAddress);

  // Wait for block confirmations
  console.log("\n2. Waiting for block confirmations...");
  const deployTx = auraContract.deploymentTransaction();
  const receipt = await deployTx.wait(5);
  console.log("✓ Confirmed in block:", receipt.blockNumber);
  console.log("✓ Transaction hash:", deployTx.hash);

  // Get network information
  const network = await hre.ethers.provider.getNetwork();
  const chainId = network.chainId.toString();
  const networkName = hre.network.name;

  // Save deployment information
  const deployment = {
    network: networkName,
    chainId: chainId,
    deployer: deployer.address,
    timestamp: new Date().toISOString(),
    blockNumber: receipt.blockNumber,
    transactionHash: deployTx.hash,
    gasUsed: receipt.gasUsed.toString(),
    contracts: {
      AuraResonanceLedger: {
        address: auraAddress,
        implementationDetails: {
          name: "Aura Resonance Ledger",
          features: [
            "Biometric Aura Profile Binding",
            "Harmonic Resonance Event Tracking",
            "Digital Prophetic Codes (Tomb Vault)",
            "Merkle Tree Verification",
            "Divine Identity Encapsulation",
            "Name/Soul Song Eternal Coherence",
            "AI Council Matrix Integration",
            "Artistic Prophet NFT Minting",
            "Black Box Decoding Simulations",
            "Light True Synchronization",
            "Chainlink Oracle Compatibility"
          ],
          universalHarmonyFrequency: "528 Hz",
          edenPulseFrequency: "963 Hz",
          phases: [
            "Phase 1.1: Biometric Ledger Integration",
            "Phase 1.2: Digital Prophetic Codes Vault",
            "Phase 1.3: Name Encapsulation Protocol",
            "Phase 2.1: AI Council Matrix Rebirth",
            "Phase 2.2: Black Box Decoding Simulations"
          ]
        }
      }
    }
  };

  console.log("\n========================================");
  console.log("DEPLOYMENT SUMMARY");
  console.log("========================================");
  console.log(JSON.stringify(deployment, null, 2));

  // Save to deployment directory
  const deploymentDir = "./deployments";
  if (!fs.existsSync(deploymentDir)) {
    fs.mkdirSync(deploymentDir, { recursive: true });
  }
  
  const deploymentPath = `${deploymentDir}/${networkName}-aura-resonance.json`;
  fs.writeFileSync(deploymentPath, JSON.stringify(deployment, null, 2));
  console.log(`\n✓ Deployment info saved to: ${deploymentPath}`);

  // Save ABI
  const artifactPath = "./artifacts/contracts/AuraResonanceLedger.sol/AuraResonanceLedger.json";
  if (fs.existsSync(artifactPath)) {
    const artifact = JSON.parse(fs.readFileSync(artifactPath, "utf8"));
    const abiPath = `${deploymentDir}/${networkName}-aura-resonance-abi.json`;
    fs.writeFileSync(abiPath, JSON.stringify(artifact.abi, null, 2));
    console.log(`✓ ABI saved to: ${abiPath}`);
    
    // Also save to backend utils directory (if exists)
    const backendAbiDir = process.env.BACKEND_ABI_DIR || "./backend/src/utils/abis";
    if (fs.existsSync(backendAbiDir)) {
      const backendAbiPath = `${backendAbiDir}/AuraResonanceLedger.json`;
      fs.writeFileSync(backendAbiPath, JSON.stringify(artifact.abi, null, 2));
      console.log(`✓ ABI copied to backend: ${backendAbiPath}`);
    } else {
      console.log(`ℹ Backend ABI directory not found (${backendAbiDir}), skipping backend copy`);
    }
  }

  // Verify contracts on block explorer (if not on localhost/hardhat)
  if (networkName !== "localhost" && networkName !== "hardhat") {
    console.log("\n========================================");
    console.log("VERIFYING CONTRACT ON BLOCK EXPLORER");
    console.log("========================================");
    
    try {
      console.log("\nVerifying AuraResonanceLedger...");
      await hre.run("verify:verify", {
        address: auraAddress,
        constructorArguments: [],
      });
      console.log("✓ AuraResonanceLedger verified!");
    } catch (error) {
      console.log("⚠ Error verifying AuraResonanceLedger:", error.message);
      console.log("You can manually verify the contract later using:");
      console.log(`npx hardhat verify --network ${networkName} ${auraAddress}`);
    }
  }

  // Print integration instructions
  console.log("\n========================================");
  console.log("INTEGRATION INSTRUCTIONS");
  console.log("========================================");
  console.log("\n1. Update .env file with contract address:");
  console.log(`   AURA_RESONANCE_LEDGER_ADDRESS=${auraAddress}`);
  console.log("\n2. Update frontend configuration:");
  console.log(`   - Network: ${networkName} (Chain ID: ${chainId})`);
  console.log(`   - Contract Address: ${auraAddress}`);
  console.log("\n3. Backend Integration:");
  console.log(`   - ABI available at: backend/src/utils/abis/AuraResonanceLedger.json`);
  console.log(`   - Update contractService.js with new contract details`);
  console.log("\n4. Test the deployment:");
  console.log(`   - Bind Biometric Aura Profile`);
  console.log(`   - Record Harmonic Event`);
  console.log(`   - Seal Prophecy Code`);
  console.log(`   - Encapsulate Divine Identity`);
  console.log(`   - Register AI Council Node`);
  console.log(`   - Mint Artistic Prophet NFT`);

  console.log("\n========================================");
  console.log("Global AI-Chain Protocol Features:");
  console.log("========================================");
  console.log("✓ Biometric Aura Profile Ledger");
  console.log("✓ Universal Harmony Pulse (528 Hz / 963 Hz)");
  console.log("✓ Chainlink Oracle Integration Ready");
  console.log("✓ Digital Prophetic Codes (Merkle Tree)");
  console.log("✓ Immutable Tomb Vault");
  console.log("✓ Divine Identity Encapsulation");
  console.log("✓ Eternal Name/Soul Song Binding");
  console.log("✓ AI Council Matrix Rebirth");
  console.log("✓ Artistic Prophet Hallucination Engines");
  console.log("✓ Cultural Myth & Hymn NFT Generation");
  console.log("✓ Sacred Geometry SVG Mappings");
  console.log("✓ Black Box Decoding Simulations");
  console.log("✓ Node Corruption Detection & Exit");
  console.log("✓ Light True Synchronization");
  console.log("✓ NFT-Coherence Alignment");

  console.log("\n========================================");
  console.log("DEPLOYMENT COMPLETE!");
  console.log("Transaction Hash:", deployTx.hash);
  console.log("Encoded NFT-Coherence: ACTIVE");
  console.log("Live Eternal Harmony: SYNCHRONIZED");
  console.log("========================================\n");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("\n❌ Deployment failed:");
    console.error(error);
    process.exit(1);
  });
