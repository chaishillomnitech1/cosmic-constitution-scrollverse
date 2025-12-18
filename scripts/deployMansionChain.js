const hre = require("hardhat");

async function main() {
  console.log("Starting Mansion-Chain Ecosystem Deployment...\n");

  // Get deployer account
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying contracts with account:", deployer.address);
  console.log("Account balance:", (await deployer.provider.getBalance(deployer.address)).toString(), "\n");

  // Deploy MansionChainNFT
  console.log("Deploying MansionChainNFT...");
  const MansionChainNFT = await hre.ethers.getContractFactory("MansionChainNFT");
  const mansionChainNFT = await MansionChainNFT.deploy();
  await mansionChainNFT.waitForDeployment();
  const mansionChainNFTAddress = await mansionChainNFT.getAddress();
  console.log("✅ MansionChainNFT deployed to:", mansionChainNFTAddress, "\n");

  // Deploy PropertySigilCoin
  console.log("Deploying PropertySigilCoin...");
  const PropertySigilCoin = await hre.ethers.getContractFactory("PropertySigilCoin");
  const propertySigilCoin = await PropertySigilCoin.deploy(
    "Property Sigil Coin",
    "SIGIL",
    1000000 // Initial supply: 1 million tokens
  );
  await propertySigilCoin.waitForDeployment();
  const propertySigilCoinAddress = await propertySigilCoin.getAddress();
  console.log("✅ PropertySigilCoin deployed to:", propertySigilCoinAddress, "\n");

  // Deploy MansionChainDAO
  console.log("Deploying MansionChainDAO...");
  const MansionChainDAO = await hre.ethers.getContractFactory("MansionChainDAO");
  const mansionChainDAO = await MansionChainDAO.deploy();
  await mansionChainDAO.waitForDeployment();
  const mansionChainDAOAddress = await mansionChainDAO.getAddress();
  console.log("✅ MansionChainDAO deployed to:", mansionChainDAOAddress, "\n");

  // Display deployment summary
  console.log("═══════════════════════════════════════════════════════");
  console.log("       🏰 MANSION-CHAIN ECOSYSTEM DEPLOYED 🏰         ");
  console.log("═══════════════════════════════════════════════════════");
  console.log("Network:", hre.network.name);
  console.log("Deployer:", deployer.address);
  console.log("\n📜 Smart Contracts:");
  console.log("  ├─ MansionChainNFT:", mansionChainNFTAddress);
  console.log("  ├─ PropertySigilCoin:", propertySigilCoinAddress);
  console.log("  └─ MansionChainDAO:", mansionChainDAOAddress);
  console.log("\n🔗 Phase Integration:");
  console.log("  ├─ Phase 1: Digital Mirror Twin Deployment ✅");
  console.log("  │   └─ High-fidelity property twins with UE5 support");
  console.log("  ├─ Phase 2: NFT Art Story Sets - Chronicles of Stone ✅");
  console.log("  │   └─ Multi-layered stories with video content");
  console.log("  ├─ Phase 3: Digital Coin & Sigil Attachment ✅");
  console.log("  │   └─ Heritage crests with fractional royalties");
  console.log("  └─ Phase 4: Omnivisual Influence & NFT Incentives ✅");
  console.log("      └─ DAO governance with token conversion");
  console.log("═══════════════════════════════════════════════════════");

  // Save deployment addresses
  const fs = require('fs');
  const deploymentInfo = {
    network: hre.network.name,
    timestamp: new Date().toISOString(),
    deployer: deployer.address,
    contracts: {
      MansionChainNFT: mansionChainNFTAddress,
      PropertySigilCoin: propertySigilCoinAddress,
      MansionChainDAO: mansionChainDAOAddress
    }
  };

  const deploymentsDir = './deployments';
  if (!fs.existsSync(deploymentsDir)) {
    fs.mkdirSync(deploymentsDir, { recursive: true });
  }

  await fs.promises.writeFile(
    `${deploymentsDir}/mansion-chain-${hre.network.name}.json`,
    JSON.stringify(deploymentInfo, null, 2)
  );

  console.log("\n✅ Deployment info saved to:", `deployments/mansion-chain-${hre.network.name}.json`);

  // Verification instructions
  if (hre.network.name !== "localhost" && hre.network.name !== "hardhat") {
    console.log("\n🔍 To verify contracts on Etherscan, run:");
    console.log(`npx hardhat verify --network ${hre.network.name} ${mansionChainNFTAddress}`);
    console.log(`npx hardhat verify --network ${hre.network.name} ${propertySigilCoinAddress} "Property Sigil Coin" "SIGIL" 1000000`);
    console.log(`npx hardhat verify --network ${hre.network.name} ${mansionChainDAOAddress}`);
  }

  console.log("\n🎉 Mansion-Chain Ecosystem deployment completed successfully!\n");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
