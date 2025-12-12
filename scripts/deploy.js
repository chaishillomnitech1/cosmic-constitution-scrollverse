const hre = require("hardhat");

async function main() {
  console.log("Deploying ScrollVerse Smart Contracts...");

  // Get the deployer account
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying contracts with account:", deployer.address);

  // Deploy ScrollVerseNFT (ERC-721)
  console.log("\n1. Deploying ScrollVerseNFT (ERC-721)...");
  const ScrollVerseNFT = await hre.ethers.getContractFactory("ScrollVerseNFT");
  const nftContract = await ScrollVerseNFT.deploy();
  await nftContract.waitForDeployment();
  const nftAddress = await nftContract.getAddress();
  console.log("ScrollVerseNFT deployed to:", nftAddress);

  // Deploy ScrollVerseMultiToken (ERC-1155)
  console.log("\n2. Deploying ScrollVerseMultiToken (ERC-1155)...");
  const baseURI = "https://ipfs.io/ipfs/";
  const ScrollVerseMultiToken = await hre.ethers.getContractFactory("ScrollVerseMultiToken");
  const multiTokenContract = await ScrollVerseMultiToken.deploy(baseURI);
  await multiTokenContract.waitForDeployment();
  const multiTokenAddress = await multiTokenContract.getAddress();
  console.log("ScrollVerseMultiToken deployed to:", multiTokenAddress);

  // Deploy ScrollVerseDAO
  console.log("\n3. Deploying ScrollVerseDAO...");
  const ScrollVerseDAO = await hre.ethers.getContractFactory("ScrollVerseDAO");
  const daoContract = await ScrollVerseDAO.deploy(nftAddress);
  await daoContract.waitForDeployment();
  const daoAddress = await daoContract.getAddress();
  console.log("ScrollVerseDAO deployed to:", daoAddress);

  // Wait for block confirmations
  console.log("\nWaiting for block confirmations...");
  await nftContract.deploymentTransaction().wait(5);
  await multiTokenContract.deploymentTransaction().wait(5);
  await daoContract.deploymentTransaction().wait(5);

  // Save deployment addresses
  const deployment = {
    network: hre.network.name,
    chainId: (await hre.ethers.provider.getNetwork()).chainId.toString(),
    deployer: deployer.address,
    timestamp: new Date().toISOString(),
    contracts: {
      ScrollVerseNFT: nftAddress,
      ScrollVerseMultiToken: multiTokenAddress,
      ScrollVerseDAO: daoAddress,
    },
  };

  console.log("\n=== Deployment Summary ===");
  console.log(JSON.stringify(deployment, null, 2));

  // Save to file
  const fs = require("fs");
  const deploymentPath = `./deployments/${hre.network.name}.json`;
  
  if (!fs.existsSync("./deployments")) {
    fs.mkdirSync("./deployments");
  }
  
  fs.writeFileSync(deploymentPath, JSON.stringify(deployment, null, 2));
  console.log(`\nDeployment info saved to: ${deploymentPath}`);

  // Verify contracts on Etherscan (if not on localhost/hardhat)
  if (hre.network.name !== "localhost" && hre.network.name !== "hardhat") {
    console.log("\n=== Verifying Contracts on Etherscan ===");
    
    try {
      console.log("Verifying ScrollVerseNFT...");
      await hre.run("verify:verify", {
        address: nftAddress,
        constructorArguments: [],
      });
      console.log("ScrollVerseNFT verified!");
    } catch (error) {
      console.log("Error verifying ScrollVerseNFT:", error.message);
    }

    try {
      console.log("Verifying ScrollVerseMultiToken...");
      await hre.run("verify:verify", {
        address: multiTokenAddress,
        constructorArguments: [baseURI],
      });
      console.log("ScrollVerseMultiToken verified!");
    } catch (error) {
      console.log("Error verifying ScrollVerseMultiToken:", error.message);
    }

    try {
      console.log("Verifying ScrollVerseDAO...");
      await hre.run("verify:verify", {
        address: daoAddress,
        constructorArguments: [nftAddress],
      });
      console.log("ScrollVerseDAO verified!");
    } catch (error) {
      console.log("Error verifying ScrollVerseDAO:", error.message);
    }
  }

  console.log("\n=== Deployment Complete! ===");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
