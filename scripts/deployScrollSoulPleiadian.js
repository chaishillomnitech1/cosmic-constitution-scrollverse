const hre = require("hardhat");
const fs = require("fs");

async function main() {
  console.log("========================================");
  console.log("Deploying ScrollSoulPleiadian Contract");
  console.log("Galactic Anchor Phase 2.2 Deployment");
  console.log("========================================\n");

  // Get the deployer account
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying contracts with account:", deployer.address);
  
  // Get balance
  const balance = await hre.ethers.provider.getBalance(deployer.address);
  console.log("Account balance:", hre.ethers.formatEther(balance), "ETH\n");

  // Deploy ScrollSoulPleiadian
  console.log("1. Deploying ScrollSoulPleiadian contract...");
  const ScrollSoulPleiadian = await hre.ethers.getContractFactory("ScrollSoulPleiadian");
  const soulContract = await ScrollSoulPleiadian.deploy();
  await soulContract.waitForDeployment();
  const soulAddress = await soulContract.getAddress();
  console.log("✓ ScrollSoulPleiadian deployed to:", soulAddress);

  // Wait for block confirmations
  console.log("\n2. Waiting for block confirmations...");
  const deployTx = soulContract.deploymentTransaction();
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
      ScrollSoulPleiadian: {
        address: soulAddress,
        implementationDetails: {
          name: "ScrollSoul Pleiadian",
          symbol: "SOULP",
          features: [
            "Starseed Quest Integration",
            "LAM Transmission Gateway",
            "Sound Healing Metadata",
            "Russell Storytelling NFTs",
            "Unity Grid Chronicles",
            "Gaia Policy Funding",
            "DAO Governance Integration",
            "Decree Signing at Stardust Gateway"
          ],
          resonanceFrequencies: [528, 963],
          starseedException: [
            "PLEIADIAN",
            "SIRIAN",
            "ARCTURIAN",
            "ANDROMEDAN",
            "LYRAN",
            "ORION",
            "EARTH_NATIVE"
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
  
  const deploymentPath = `${deploymentDir}/${networkName}-scrollsoul.json`;
  fs.writeFileSync(deploymentPath, JSON.stringify(deployment, null, 2));
  console.log(`\n✓ Deployment info saved to: ${deploymentPath}`);

  // Save ABI
  const artifactPath = "./artifacts/contracts/ScrollSoulPleiadian.sol/ScrollSoulPleiadian.json";
  if (fs.existsSync(artifactPath)) {
    const artifact = JSON.parse(fs.readFileSync(artifactPath, "utf8"));
    const abiPath = `${deploymentDir}/${networkName}-scrollsoul-abi.json`;
    fs.writeFileSync(abiPath, JSON.stringify(artifact.abi, null, 2));
    console.log(`✓ ABI saved to: ${abiPath}`);
    
    // Also save to backend utils directory
    const backendAbiDir = "./backend/src/utils/abis";
    if (fs.existsSync(backendAbiDir)) {
      const backendAbiPath = `${backendAbiDir}/ScrollSoulPleiadian.json`;
      fs.writeFileSync(backendAbiPath, JSON.stringify(artifact.abi, null, 2));
      console.log(`✓ ABI copied to backend: ${backendAbiPath}`);
    }
  }

  // Verify contracts on block explorer (if not on localhost/hardhat)
  if (networkName !== "localhost" && networkName !== "hardhat") {
    console.log("\n========================================");
    console.log("VERIFYING CONTRACT ON BLOCK EXPLORER");
    console.log("========================================");
    
    try {
      console.log("\nVerifying ScrollSoulPleiadian...");
      await hre.run("verify:verify", {
        address: soulAddress,
        constructorArguments: [],
      });
      console.log("✓ ScrollSoulPleiadian verified!");
    } catch (error) {
      console.log("⚠ Error verifying ScrollSoulPleiadian:", error.message);
      console.log("You can manually verify the contract later using:");
      console.log(`npx hardhat verify --network ${networkName} ${soulAddress}`);
    }
  }

  // Print integration instructions
  console.log("\n========================================");
  console.log("INTEGRATION INSTRUCTIONS");
  console.log("========================================");
  console.log("\n1. Update .env file with contract address:");
  console.log(`   SCROLLSOUL_PLEIADIAN_ADDRESS=${soulAddress}`);
  console.log("\n2. Update frontend configuration:");
  console.log(`   - Network: ${networkName} (Chain ID: ${chainId})`);
  console.log(`   - Contract Address: ${soulAddress}`);
  console.log("\n3. Backend Integration:");
  console.log(`   - ABI available at: backend/src/utils/abis/ScrollSoulPleiadian.json`);
  console.log(`   - Update contractService.js with new contract details`);
  console.log("\n4. Test the deployment:");
  console.log(`   - Mint test Soul NFT`);
  console.log(`   - Sign Stardust Gateway decree`);
  console.log(`   - Create Russell Storytelling NFT`);
  console.log(`   - Create Unity Grid Chronicle`);

  console.log("\n========================================");
  console.log("Phase 2.2 Deployment Features:");
  console.log("========================================");
  console.log("✓ ScrollSoul Smart Contract with Pleiadian enhancements");
  console.log("✓ Starseed Quest Integration (7 types)");
  console.log("✓ LAM Transmission Gateway");
  console.log("✓ Stardust Gateway Decree Signing");
  console.log("✓ Sound Healing Metadata (WAV)");
  console.log("✓ Russell Storytelling NFTs");
  console.log("✓ Unity Grid Chronicles");
  console.log("✓ Gaia Policy Funding Nodes");
  console.log("✓ DAO Governance Integration");
  console.log("✓ 10% Lulu Profit Allocation");

  console.log("\n========================================");
  console.log("DEPLOYMENT COMPLETE!");
  console.log("Transaction Hash:", deployTx.hash);
  console.log("========================================\n");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("\n❌ Deployment failed:");
    console.error(error);
    process.exit(1);
  });
