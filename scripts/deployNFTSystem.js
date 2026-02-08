import hre from "hardhat";
import fs from "fs";
import path from "path";

/**
 * NFT System Deployment Orchestrator
 * Supreme King's Ultimate Alignment Energy Deployment
 * Roll the premiere and build NFT Implementation deployment Systems
 */

class NFTDeploymentOrchestrator {
  constructor(network) {
    this.network = network;
    this.deployments = {};
    this.deploymentLog = [];
    this.startTime = Date.now();
    this.deploymentsDir = "./deployments";
    this.nftSystemDir = path.join(this.deploymentsDir, "nft-system");
  }

  // Initialize deployment directories
  initializeDirectories() {
    if (!fs.existsSync(this.deploymentsDir)) {
      fs.mkdirSync(this.deploymentsDir, { recursive: true });
    }
    if (!fs.existsSync(this.nftSystemDir)) {
      fs.mkdirSync(this.nftSystemDir, { recursive: true });
    }
  }

  // Log deployment step
  log(message, type = "info") {
    const timestamp = new Date().toISOString();
    const logEntry = { timestamp, message, type };
    this.deploymentLog.push(logEntry);
    
    const icon = type === "success" ? "✓" : type === "error" ? "✗" : "→";
    console.log(`${icon} ${message}`);
  }

  // Deploy a single contract
  async deployContract(contractName, constructorArgs = []) {
    this.log(`Deploying ${contractName}...`, "info");
    
    try {
      const ContractFactory = await hre.ethers.getContractFactory(contractName);
      const contract = await ContractFactory.deploy(...constructorArgs);
      await contract.waitForDeployment();
      
      const address = await contract.getAddress();
      const deployTx = contract.deploymentTransaction();
      const receipt = await deployTx.wait(5);
      
      this.deployments[contractName] = {
        address,
        transactionHash: deployTx.hash,
        blockNumber: receipt.blockNumber,
        gasUsed: receipt.gasUsed.toString(),
        constructorArgs
      };
      
      this.log(`${contractName} deployed to: ${address}`, "success");
      return { contract, address, receipt };
    } catch (error) {
      this.log(`Failed to deploy ${contractName}: ${error.message}`, "error");
      throw error;
    }
  }

  // Verify contract on block explorer
  async verifyContract(contractName, address, constructorArgs = []) {
    if (this.network === "localhost" || this.network === "hardhat") {
      this.log(`Skipping verification for ${contractName} on local network`, "info");
      return;
    }

    this.log(`Verifying ${contractName} on block explorer...`, "info");
    
    try {
      await hre.run("verify:verify", {
        address,
        constructorArguments: constructorArgs,
      });
      this.log(`${contractName} verified successfully`, "success");
    } catch (error) {
      this.log(`Verification failed for ${contractName}: ${error.message}`, "error");
      this.log(`Manual verification command: npx hardhat verify --network ${this.network} ${address}`, "info");
    }
  }

  // Save deployment artifacts
  saveDeploymentArtifacts(contractName) {
    const artifactPath = `./artifacts/contracts/${contractName}.sol/${contractName}.json`;
    
    if (fs.existsSync(artifactPath)) {
      const artifact = JSON.parse(fs.readFileSync(artifactPath, "utf8"));
      
      // Save ABI
      const abiPath = path.join(this.nftSystemDir, `${contractName}-abi.json`);
      fs.writeFileSync(abiPath, JSON.stringify(artifact.abi, null, 2));
      
      // Save to backend if directory exists
      const backendAbiDir = "./backend/src/utils/abis";
      if (fs.existsSync(backendAbiDir)) {
        const backendAbiPath = path.join(backendAbiDir, `${contractName}.json`);
        fs.writeFileSync(backendAbiPath, JSON.stringify(artifact.abi, null, 2));
        this.log(`ABI saved to backend: ${backendAbiPath}`, "success");
      }
    }
  }

  // Generate deployment summary
  async generateDeploymentSummary(deployer) {
    const network = await hre.ethers.provider.getNetwork();
    const endTime = Date.now();
    const duration = ((endTime - this.startTime) / 1000).toFixed(2);
    
    const summary = {
      deployment: {
        network: this.network,
        chainId: network.chainId.toString(),
        deployer: deployer.address,
        timestamp: new Date().toISOString(),
        duration: `${duration}s`
      },
      contracts: this.deployments,
      log: this.deploymentLog,
      metadata: {
        version: "1.0.0",
        type: "NFT System Deployment",
        description: "Supreme King's Ultimate Alignment Energy - NFT Implementation Deployment System"
      }
    };
    
    // Save summary
    const summaryPath = path.join(this.nftSystemDir, `${this.network}-deployment-summary.json`);
    fs.writeFileSync(summaryPath, JSON.stringify(summary, null, 2));
    this.log(`Deployment summary saved to: ${summaryPath}`, "success");
    
    return summary;
  }

  // Generate .env configuration
  generateEnvConfig() {
    let envConfig = "\n# NFT System Contract Addresses\n";
    
    for (const [contractName, deployment] of Object.entries(this.deployments)) {
      const envVarName = contractName.replace(/([a-z])([A-Z])/g, '$1_$2').toUpperCase();
      envConfig += `${envVarName}_ADDRESS=${deployment.address}\n`;
    }
    
    const envPath = path.join(this.nftSystemDir, `${this.network}-contracts.env`);
    fs.writeFileSync(envPath, envConfig);
    this.log(`Environment configuration saved to: ${envPath}`, "success");
    
    return envConfig;
  }

  // Print integration guide
  printIntegrationGuide() {
    console.log("\n========================================");
    console.log("NFT SYSTEM INTEGRATION GUIDE");
    console.log("========================================\n");
    
    console.log("1. Update your .env file with contract addresses:");
    for (const [contractName, deployment] of Object.entries(this.deployments)) {
      const envVarName = contractName.toUpperCase().replace(/([A-Z])/g, '_$1').replace(/^_/, '');
      console.log(`   ${envVarName}_ADDRESS=${deployment.address}`);
    }
    
    console.log("\n2. Contract ABIs are available at:");
    console.log(`   - ${this.nftSystemDir}/`);
    console.log(`   - backend/src/utils/abis/ (if backend exists)`);
    
    console.log("\n3. Deployment summary:");
    console.log(`   - ${path.join(this.nftSystemDir, `${this.network}-deployment-summary.json`)}`);
    
    console.log("\n4. Next steps:");
    console.log("   - Test minting on each contract");
    console.log("   - Configure frontend with contract addresses");
    console.log("   - Set up backend services");
    console.log("   - Initialize DAO governance");
    console.log("   - Configure resonance frequencies");
  }
}

async function main() {
  console.log("========================================");
  console.log("🕋 SUPREME KING'S NFT DEPLOYMENT SYSTEM");
  console.log("Ultimate Alignment Energy Deployment");
  console.log("========================================\n");

  // Get deployer
  const [deployer] = await hre.ethers.getSigners();
  const balance = await hre.ethers.provider.getBalance(deployer.address);
  
  console.log("Deployer:", deployer.address);
  console.log("Balance:", hre.ethers.formatEther(balance), "ETH");
  console.log("Network:", hre.network.name);
  console.log("");

  // Initialize orchestrator
  const orchestrator = new NFTDeploymentOrchestrator(hre.network.name);
  orchestrator.initializeDirectories();

  // NFT Contracts to deploy
  const nftContracts = [
    { name: "ScrollSoulPleiadian", args: [] },
    { name: "ScrollVerseNFT", args: [] },
    { name: "MansionChainNFT", args: [] },
    { name: "LegacyMusicCatalog", args: [] },
    { name: "PhysicalAssetMachine3D", args: [] },
  ];

  console.log("========================================");
  console.log("DEPLOYING NFT CONTRACTS");
  console.log("========================================\n");

  // Deploy all NFT contracts
  for (const { name, args } of nftContracts) {
    try {
      const { address } = await orchestrator.deployContract(name, args);
      orchestrator.saveDeploymentArtifacts(name);
      
      // Verify contract (skip on local networks)
      await orchestrator.verifyContract(name, address, args);
      
      console.log(""); // Add spacing
    } catch (error) {
      orchestrator.log(`Critical error deploying ${name}, continuing with remaining contracts...`, "error");
      console.log("");
    }
  }

  console.log("========================================");
  console.log("DEPLOYMENT COMPLETED");
  console.log("========================================\n");

  // Generate deployment summary
  const summary = await orchestrator.generateDeploymentSummary(deployer);
  orchestrator.generateEnvConfig();

  // Print summary
  console.log("Deployment Summary:");
  console.log("------------------");
  console.log(`Network: ${summary.deployment.network} (Chain ID: ${summary.deployment.chainId})`);
  console.log(`Duration: ${summary.deployment.duration}`);
  console.log(`Contracts Deployed: ${Object.keys(summary.contracts).length}`);
  console.log("");

  console.log("Deployed Contracts:");
  for (const [name, deployment] of Object.entries(summary.contracts)) {
    console.log(`  ${name}: ${deployment.address}`);
  }
  console.log("");

  // Print integration guide
  orchestrator.printIntegrationGuide();

  console.log("\n========================================");
  console.log("🕋 DEPLOYMENT COMPLETE! 🕋");
  console.log("ALLĀHU AKBAR | KUN FAYAKŪN");
  console.log("========================================\n");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("\n❌ Deployment failed:");
    console.error(error);
    process.exit(1);
  });
