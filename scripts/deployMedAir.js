const hre = require("hardhat");

async function main() {
  console.log("Deploying MedAir Blockchain Ecosystem...");
  console.log("=" .repeat(60));

  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying contracts with account:", deployer.address);

  // Deploy MedAir Token ($MEDAIR)
  console.log("\n1. Deploying MedAir Token ($MEDAIR)...");
  const MedAirToken = await hre.ethers.getContractFactory("MedAirToken");
  const medairToken = await MedAirToken.deploy(deployer.address);
  await medairToken.waitForDeployment();
  const medairTokenAddress = await medairToken.getAddress();
  console.log("✅ MedAir Token deployed to:", medairTokenAddress);

  // Deploy Sigil Token ($SIGIL)
  console.log("\n2. Deploying Sigil Token ($SIGIL)...");
  const SigilToken = await hre.ethers.getContractFactory("SigilToken");
  const sigilToken = await SigilToken.deploy(deployer.address);
  await sigilToken.waitForDeployment();
  const sigilTokenAddress = await sigilToken.getAddress();
  console.log("✅ Sigil Token deployed to:", sigilTokenAddress);

  // Deploy MedAir Staking
  console.log("\n3. Deploying MedAir Staking...");
  const MedAirStaking = await hre.ethers.getContractFactory("MedAirStaking");
  const medairStaking = await MedAirStaking.deploy(
    medairTokenAddress,
    sigilTokenAddress,
    deployer.address
  );
  await medairStaking.waitForDeployment();
  const medairStakingAddress = await medairStaking.getAddress();
  console.log("✅ MedAir Staking deployed to:", medairStakingAddress);

  // Deploy MedAir Oracle
  console.log("\n4. Deploying MedAir Oracle...");
  const MedAirOracle = await hre.ethers.getContractFactory("MedAirOracle");
  const medairOracle = await MedAirOracle.deploy(deployer.address);
  await medairOracle.waitForDeployment();
  const medairOracleAddress = await medairOracle.getAddress();
  console.log("✅ MedAir Oracle deployed to:", medairOracleAddress);

  // Deploy MedAir Insurance
  console.log("\n5. Deploying MedAir Insurance...");
  const MedAirInsurance = await hre.ethers.getContractFactory("MedAirInsurance");
  const medairInsurance = await MedAirInsurance.deploy(
    medairTokenAddress,
    deployer.address
  );
  await medairInsurance.waitForDeployment();
  const medairInsuranceAddress = await medairInsurance.getAddress();
  console.log("✅ MedAir Insurance deployed to:", medairInsuranceAddress);

  // Deploy MedAir DAO
  console.log("\n6. Deploying MedAir DAO...");
  const MedAirDAO = await hre.ethers.getContractFactory("MedAirDAO");
  const medairDAO = await MedAirDAO.deploy(sigilTokenAddress, deployer.address);
  await medairDAO.waitForDeployment();
  const medairDAOAddress = await medairDAO.getAddress();
  console.log("✅ MedAir DAO deployed to:", medairDAOAddress);

  console.log("\n" + "=" .repeat(60));
  console.log("Configuration Setup...");
  console.log("=" .repeat(60));

  // Configure oracle with staking and DAO contracts
  console.log("\n7. Configuring Oracle...");
  await medairOracle.setStakingContract(medairStakingAddress);
  console.log("✅ Oracle linked to Staking contract");
  await medairOracle.setDAOContract(medairDAOAddress);
  console.log("✅ Oracle linked to DAO contract");

  // Add oracle as authorized verifier in staking
  console.log("\n8. Configuring Staking...");
  await medairStaking.addVerifier(medairOracleAddress);
  console.log("✅ Oracle added as authorized verifier in Staking");

  // Add staking contract as authorized minter for SIGIL rewards
  console.log("\n9. Configuring Sigil Token...");
  await sigilToken.addMinter(medairStakingAddress);
  console.log("✅ Staking contract authorized as SIGIL minter");

  // Fund staking reward pool
  console.log("\n10. Funding Staking Reward Pool...");
  const rewardAmount = hre.ethers.parseEther("1000000"); // 1M MEDAIR
  await medairToken.approve(medairStakingAddress, rewardAmount);
  await medairStaking.fundRewardPool(rewardAmount);
  console.log("✅ Staking reward pool funded with 1,000,000 MEDAIR");

  // Initialize liquidity pools
  console.log("\n11. Initializing Liquidity Pools...");
  const flightLiquidityAmount = hre.ethers.parseEther("500000"); // 500K MEDAIR
  await medairStaking.allocateFlightLiquidity(flightLiquidityAmount, 1);
  console.log("✅ Flight liquidity pool initialized with 500,000 MEDAIR");

  const emergencyReserveAmount = hre.ethers.parseEther("200000"); // 200K MEDAIR
  await medairStaking.activateEmergencyReserve(emergencyReserveAmount, "Initial emergency reserve");
  console.log("✅ Emergency reserve activated with 200,000 MEDAIR");

  // Verify zkEVM deployment
  console.log("\n12. Verifying zkEVM Deployment...");
  const verification = await medairDAO.getDeploymentVerification();
  console.log("✅ zkEVM Compatible:", verification.isZkEVMCompatible);
  console.log("✅ Deployment Timestamp:", new Date(Number(verification.deployedAt) * 1000).toISOString());
  console.log("✅ Governance Hash:", verification.governanceHash);

  console.log("\n" + "=" .repeat(60));
  console.log("🎉 MedAir Deployment Complete!");
  console.log("=" .repeat(60));

  // Print deployment summary
  console.log("\n📋 DEPLOYMENT SUMMARY:");
  console.log("-" .repeat(60));
  console.log("MedAir Token ($MEDAIR):", medairTokenAddress);
  console.log("Sigil Token ($SIGIL):", sigilTokenAddress);
  console.log("MedAir Staking:", medairStakingAddress);
  console.log("MedAir Oracle:", medairOracleAddress);
  console.log("MedAir Insurance:", medairInsuranceAddress);
  console.log("MedAir DAO:", medairDAOAddress);
  console.log("-" .repeat(60));

  console.log("\n💰 LIQUIDITY POOL STATUS:");
  console.log("-" .repeat(60));
  const poolStatus = await medairStaking.getLiquidityPoolStatus();
  console.log("Flight Liquidity Pool:", hre.ethers.formatEther(poolStatus.flightPool), "MEDAIR");
  console.log("Emergency Reserve:", hre.ethers.formatEther(poolStatus.emergencyReserve), "MEDAIR");
  console.log("Active Flight Operations:", poolStatus.activeFlights.toString());
  console.log("Total Pool Balance:", hre.ethers.formatEther(poolStatus.totalPoolBalance), "MEDAIR");
  console.log("-" .repeat(60));

  console.log("\n🏛️ DAO GOVERNANCE STATUS:");
  console.log("-" .repeat(60));
  const daoStats = await medairDAO.getDAOStats();
  console.log("Total Proposals:", daoStats.totalProposalsCount.toString());
  console.log("Quorum Threshold:", daoStats.currentQuorum.toString() + "%");
  console.log("Auto-Consensus:", "ENABLED");
  console.log("zkEVM Compatible:", "YES");
  console.log("-" .repeat(60));

  // Save deployment info to file
  const fs = require("fs");
  const deploymentInfo = {
    network: hre.network.name,
    timestamp: new Date().toISOString(),
    deployer: deployer.address,
    contracts: {
      MedAirToken: medairTokenAddress,
      SigilToken: sigilTokenAddress,
      MedAirStaking: medairStakingAddress,
      MedAirOracle: medairOracleAddress,
      MedAirInsurance: medairInsuranceAddress,
      MedAirDAO: medairDAOAddress,
    },
  };

  fs.writeFileSync(
    `deployments/medair-${hre.network.name}-${Date.now()}.json`,
    JSON.stringify(deploymentInfo, null, 2)
  );
  console.log("\n✅ Deployment info saved to deployments/");

  // Verification instructions
  if (hre.network.name !== "localhost" && hre.network.name !== "hardhat") {
    console.log("\n📝 To verify contracts on Etherscan, run:");
    console.log(`npx hardhat verify --network ${hre.network.name} ${medairTokenAddress} "${deployer.address}"`);
    console.log(`npx hardhat verify --network ${hre.network.name} ${sigilTokenAddress} "${deployer.address}"`);
    console.log(`npx hardhat verify --network ${hre.network.name} ${medairStakingAddress} "${medairTokenAddress}" "${sigilTokenAddress}" "${deployer.address}"`);
    console.log(`npx hardhat verify --network ${hre.network.name} ${medairOracleAddress} "${deployer.address}"`);
    console.log(`npx hardhat verify --network ${hre.network.name} ${medairInsuranceAddress} "${medairTokenAddress}" "${deployer.address}"`);
    console.log(`npx hardhat verify --network ${hre.network.name} ${medairDAOAddress} "${sigilTokenAddress}" "${deployer.address}"`);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
