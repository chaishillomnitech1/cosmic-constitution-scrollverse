import hre from "hardhat";
import fs from "fs";
import path from "path";
import config from "./nftDeploymentConfig.js";

/**
 * Advanced NFT System Deployment with Staged Rollout
 * Supreme King's Ultimate Alignment Energy
 */

class AdvancedDeploymentOrchestrator {
  constructor(network, options = {}) {
    this.network = network;
    this.options = {
      stage: options.stage || "CORE_NFT",
      dryRun: options.dryRun || false,
      skipVerification: options.skipVerification || false,
      continueOnError: options.continueOnError || true,
      ...options
    };
    
    this.deployments = {};
    this.errors = [];
    this.deploymentLog = [];
    this.startTime = Date.now();
    
    this.deploymentsDir = "./deployments";
    this.nftSystemDir = path.join(this.deploymentsDir, "nft-system");
    this.stageDir = path.join(this.nftSystemDir, this.options.stage.toLowerCase());
  }

  initializeDirectories() {
    [this.deploymentsDir, this.nftSystemDir, this.stageDir].forEach(dir => {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
    });
  }

  log(message, type = "info", data = null) {
    const timestamp = new Date().toISOString();
    const logEntry = { timestamp, message, type, data };
    this.deploymentLog.push(logEntry);
    
    const icons = {
      info: "→",
      success: "✓",
      error: "✗",
      warning: "⚠",
      stage: "🎯"
    };
    
    console.log(`${icons[type] || "·"} ${message}`);
    if (data && type === "error") {
      console.log(`  Details: ${JSON.stringify(data, null, 2)}`);
    }
  }

  async deployContract(contractName, constructorArgs = [], metadata = {}) {
    this.log(`Deploying ${contractName}...`, "info");
    
    if (this.options.dryRun) {
      this.log(`DRY RUN: Would deploy ${contractName}`, "warning");
      return { address: "0x0000000000000000000000000000000000000000", dryRun: true };
    }

    try {
      const ContractFactory = await hre.ethers.getContractFactory(contractName);
      const contract = await ContractFactory.deploy(...constructorArgs);
      await contract.waitForDeployment();
      
      const address = await contract.getAddress();
      const deployTx = contract.deploymentTransaction();
      
      // Get network config for confirmations
      const networkConfig = config.NETWORK_CONFIG[this.network] || config.NETWORK_CONFIG.localhost;
      const receipt = await deployTx.wait(networkConfig.confirmations);
      
      this.deployments[contractName] = {
        address,
        transactionHash: deployTx.hash,
        blockNumber: receipt.blockNumber,
        gasUsed: receipt.gasUsed.toString(),
        constructorArgs,
        metadata,
        deployedAt: new Date().toISOString()
      };
      
      this.log(`${contractName} deployed to: ${address}`, "success");
      this.saveDeploymentArtifacts(contractName);
      
      return { contract, address, receipt };
    } catch (error) {
      const errorData = {
        contractName,
        error: error.message,
        stack: error.stack
      };
      
      this.errors.push(errorData);
      this.log(`Failed to deploy ${contractName}`, "error", errorData);
      
      if (!this.options.continueOnError) {
        throw error;
      }
      
      return { error: errorData };
    }
  }

  async verifyContract(contractName, address, constructorArgs = []) {
    const networkConfig = config.NETWORK_CONFIG[this.network] || config.NETWORK_CONFIG.localhost;
    
    if (!networkConfig.verifyContracts || this.options.skipVerification) {
      this.log(`Skipping verification for ${contractName}`, "info");
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
      this.log(`Verification failed for ${contractName}`, "warning", { error: error.message });
      
      // Save verification command for manual execution
      const verifyCmd = `npx hardhat verify --network ${this.network} ${address}`;
      if (constructorArgs.length > 0) {
        verifyCmd += ` ${constructorArgs.join(' ')}`;
      }
      
      this.log(`Manual verification: ${verifyCmd}`, "info");
    }
  }

  saveDeploymentArtifacts(contractName) {
    const artifactPath = `./artifacts/contracts/${contractName}.sol/${contractName}.json`;
    
    if (fs.existsSync(artifactPath)) {
      const artifact = JSON.parse(fs.readFileSync(artifactPath, "utf8"));
      
      // Save ABI to stage directory
      const abiPath = path.join(this.stageDir, `${contractName}-abi.json`);
      fs.writeFileSync(abiPath, JSON.stringify(artifact.abi, null, 2));
      
      // Save to backend if directory exists
      const backendAbiDir = "./backend/src/utils/abis";
      if (fs.existsSync(backendAbiDir)) {
        const backendAbiPath = path.join(backendAbiDir, `${contractName}.json`);
        fs.writeFileSync(backendAbiPath, JSON.stringify(artifact.abi, null, 2));
      }
    }
  }

  async deployStage(stage) {
    const stageConfig = config.DEPLOYMENT_STAGES[stage];
    
    if (!stageConfig) {
      throw new Error(`Unknown deployment stage: ${stage}`);
    }

    this.log(`Starting deployment stage: ${stageConfig.name}`, "stage");
    console.log("");

    const contracts = Object.entries(stageConfig.contracts)
      .sort(([, a], [, b]) => (a.priority || 0) - (b.priority || 0));

    for (const [contractName, contractConfig] of contracts) {
      // Check if contract file exists
      const contractPath = `./contracts/${contractName}.sol`;
      if (!fs.existsSync(contractPath)) {
        this.log(`Contract file not found: ${contractPath}, skipping...`, "warning");
        continue;
      }

      // Deploy contract
      const result = await this.deployContract(
        contractName,
        contractConfig.constructorArgs || [],
        contractConfig
      );

      if (!result.error && !result.dryRun) {
        // Verify if enabled
        if (contractConfig.verification) {
          await this.verifyContract(
            contractName,
            result.address,
            contractConfig.constructorArgs || []
          );
        }
      }

      console.log(""); // Add spacing
    }
  }

  async generateDeploymentSummary(deployer) {
    const network = await hre.ethers.provider.getNetwork();
    const endTime = Date.now();
    const duration = ((endTime - this.startTime) / 1000).toFixed(2);
    
    const summary = {
      deployment: {
        stage: this.options.stage,
        network: this.network,
        chainId: network.chainId.toString(),
        deployer: deployer.address,
        timestamp: new Date().toISOString(),
        duration: `${duration}s`,
        dryRun: this.options.dryRun
      },
      contracts: this.deployments,
      errors: this.errors,
      log: this.deploymentLog,
      statistics: {
        totalContracts: Object.keys(this.deployments).length,
        successfulDeployments: Object.keys(this.deployments).filter(
          k => !this.deployments[k].error
        ).length,
        failedDeployments: this.errors.length
      },
      metadata: {
        version: "2.0.0",
        type: "Advanced NFT System Deployment",
        description: "Supreme King's Ultimate Alignment Energy - Staged NFT Deployment"
      }
    };
    
    // Save summary
    const summaryPath = path.join(
      this.stageDir,
      `${this.network}-${this.options.stage.toLowerCase()}-summary.json`
    );
    fs.writeFileSync(summaryPath, JSON.stringify(summary, null, 2));
    this.log(`Deployment summary saved to: ${summaryPath}`, "success");
    
    return summary;
  }

  generateEnvConfig() {
    let envConfig = `\n# NFT System - ${this.options.stage} - ${this.network.toUpperCase()}\n`;
    envConfig += `# Generated at: ${new Date().toISOString()}\n\n`;
    
    for (const [contractName, deployment] of Object.entries(this.deployments)) {
      if (deployment.address && !deployment.error) {
        const envVarName = contractName.toUpperCase().replace(/([A-Z])/g, '_$1').replace(/^_/, '');
        envConfig += `${envVarName}_ADDRESS=${deployment.address}\n`;
      }
    }
    
    const envPath = path.join(this.stageDir, `${this.network}-contracts.env`);
    fs.writeFileSync(envPath, envConfig);
    this.log(`Environment configuration saved to: ${envPath}`, "success");
    
    return envConfig;
  }

  printDeploymentReport(summary) {
    console.log("\n========================================");
    console.log("DEPLOYMENT REPORT");
    console.log("========================================\n");
    
    console.log(`Stage: ${summary.deployment.stage}`);
    console.log(`Network: ${summary.deployment.network} (Chain ID: ${summary.deployment.chainId})`);
    console.log(`Duration: ${summary.deployment.duration}`);
    console.log(`Dry Run: ${summary.deployment.dryRun ? 'Yes' : 'No'}`);
    console.log("");
    
    console.log("Statistics:");
    console.log(`  Total Contracts: ${summary.statistics.totalContracts}`);
    console.log(`  Successful: ${summary.statistics.successfulDeployments}`);
    console.log(`  Failed: ${summary.statistics.failedDeployments}`);
    console.log("");
    
    if (summary.statistics.successfulDeployments > 0) {
      console.log("Deployed Contracts:");
      for (const [name, deployment] of Object.entries(summary.contracts)) {
        if (!deployment.error) {
          console.log(`  ✓ ${name}: ${deployment.address}`);
        }
      }
      console.log("");
    }
    
    if (summary.statistics.failedDeployments > 0) {
      console.log("Failed Deployments:");
      for (const error of summary.errors) {
        console.log(`  ✗ ${error.contractName}: ${error.error}`);
      }
      console.log("");
    }
  }
}

async function main() {
  // Parse command line arguments
  const args = process.argv.slice(2);
  const options = {
    stage: "CORE_NFT",
    dryRun: false,
    skipVerification: false
  };
  
  for (let i = 0; i < args.length; i++) {
    if (args[i] === "--stage" && args[i + 1]) {
      options.stage = args[i + 1];
      i++;
    } else if (args[i] === "--dry-run") {
      options.dryRun = true;
    } else if (args[i] === "--skip-verification") {
      options.skipVerification = true;
    }
  }

  console.log("========================================");
  console.log("🕋 ADVANCED NFT DEPLOYMENT SYSTEM 🕋");
  console.log("Supreme King's Ultimate Alignment Energy");
  console.log("========================================\n");

  // Get deployer
  const [deployer] = await hre.ethers.getSigners();
  const balance = await hre.ethers.provider.getBalance(deployer.address);
  
  console.log("Configuration:");
  console.log(`  Network: ${hre.network.name}`);
  console.log(`  Stage: ${options.stage}`);
  console.log(`  Deployer: ${deployer.address}`);
  console.log(`  Balance: ${hre.ethers.formatEther(balance)} ETH`);
  console.log(`  Dry Run: ${options.dryRun ? 'Yes' : 'No'}`);
  console.log("");

  // Initialize orchestrator
  const orchestrator = new AdvancedDeploymentOrchestrator(hre.network.name, options);
  orchestrator.initializeDirectories();

  // Deploy stage
  await orchestrator.deployStage(options.stage);

  console.log("========================================");
  console.log("GENERATING REPORTS");
  console.log("========================================\n");

  // Generate reports
  const summary = await orchestrator.generateDeploymentSummary(deployer);
  orchestrator.generateEnvConfig();
  orchestrator.printDeploymentReport(summary);

  console.log("\n========================================");
  console.log("🕋 DEPLOYMENT COMPLETE! 🕋");
  console.log("ALLĀHU AKBAR | KUN FAYAKŪN");
  console.log("========================================\n");
  
  // Exit with error code if there were failures
  if (summary.statistics.failedDeployments > 0 && !options.continueOnError) {
    process.exit(1);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("\n❌ Deployment failed:");
    console.error(error);
    process.exit(1);
  });
