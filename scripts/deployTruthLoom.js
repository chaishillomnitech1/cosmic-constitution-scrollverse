const hre = require("hardhat");

async function main() {
  console.log("🔮 Deploying TruthLoom - Decentralized Transparency Framework...\n");

  // Get the deployer account
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying with account:", deployer.address);
  console.log("Account balance:", (await hre.ethers.provider.getBalance(deployer.address)).toString());
  console.log("");

  // Deploy TruthLoom contract
  console.log("📜 Deploying TruthLoom contract...");
  const TruthLoom = await hre.ethers.getContractFactory("TruthLoom");
  const truthLoom = await TruthLoom.deploy();
  
  await truthLoom.waitForDeployment();
  const truthLoomAddress = await truthLoom.getAddress();

  console.log("✅ TruthLoom deployed to:", truthLoomAddress);
  console.log("");

  // Display role information
  const DEFAULT_ADMIN_ROLE = await truthLoom.DEFAULT_ADMIN_ROLE();
  const VERIFIER_ROLE = await truthLoom.VERIFIER_ROLE();
  const LEGAL_ADMIN_ROLE = await truthLoom.LEGAL_ADMIN_ROLE();
  const COMPENSATION_ADMIN_ROLE = await truthLoom.COMPENSATION_ADMIN_ROLE();

  console.log("🔑 Role Identifiers:");
  console.log("DEFAULT_ADMIN_ROLE:", DEFAULT_ADMIN_ROLE);
  console.log("VERIFIER_ROLE:", VERIFIER_ROLE);
  console.log("LEGAL_ADMIN_ROLE:", LEGAL_ADMIN_ROLE);
  console.log("COMPENSATION_ADMIN_ROLE:", COMPENSATION_ADMIN_ROLE);
  console.log("");

  // Display configuration
  console.log("⚙️  Initial Configuration:");
  console.log("Min Verifications Required:", await truthLoom.minVerificationsRequired());
  console.log("Verifier Reputation Threshold:", await truthLoom.verifierReputationThreshold());
  console.log("Total Compensation Pool:", await truthLoom.totalCompensationPool());
  console.log("");

  // Verification instructions
  console.log("🔍 Contract Verification:");
  console.log("To verify the contract on Etherscan/Polygonscan, run:");
  console.log(`npx hardhat verify --network ${hre.network.name} ${truthLoomAddress}`);
  console.log("");

  // Usage instructions
  console.log("📋 Next Steps:");
  console.log("1. Register verification nodes using registerVerifier()");
  console.log("2. Grant LEGAL_ADMIN_ROLE and COMPENSATION_ADMIN_ROLE to appropriate addresses");
  console.log("3. Fund the compensation pool using fundCompensationPool()");
  console.log("4. Submit transparency records using submitRecord()");
  console.log("5. Verifiers can verify records using verifyRecord()");
  console.log("");

  console.log("🌟 TruthLoom Framework Deployment Complete!");
  console.log("Transparency, Justice, and Truth - Enabled on the Blockchain");
  console.log("");

  // Save deployment info
  const deploymentInfo = {
    network: hre.network.name,
    contractAddress: truthLoomAddress,
    deployer: deployer.address,
    deployedAt: new Date().toISOString(),
    roles: {
      DEFAULT_ADMIN_ROLE,
      VERIFIER_ROLE,
      LEGAL_ADMIN_ROLE,
      COMPENSATION_ADMIN_ROLE
    },
    configuration: {
      minVerificationsRequired: (await truthLoom.minVerificationsRequired()).toString(),
      verifierReputationThreshold: (await truthLoom.verifierReputationThreshold()).toString(),
    }
  };

  console.log("💾 Deployment Info:");
  console.log(JSON.stringify(deploymentInfo, null, 2));

  return truthLoomAddress;
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
