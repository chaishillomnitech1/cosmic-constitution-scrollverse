const hre = require("hardhat");

async function main() {
    console.log("Deploying ScrollVerse GitHub Token (SGT)...");
    
    // Get deployer
    const [deployer] = await hre.ethers.getSigners();
    console.log("Deploying with account:", deployer.address);
    
    const balance = await hre.ethers.provider.getBalance(deployer.address);
    console.log("Account balance:", hre.ethers.formatEther(balance), "ETH");
    
    // Deploy contract
    const ScrollVerseGitHubToken = await hre.ethers.getContractFactory("ScrollVerseGitHubToken");
    const token = await ScrollVerseGitHubToken.deploy(deployer.address);
    
    await token.waitForDeployment();
    const tokenAddress = await token.getAddress();
    
    console.log("ScrollVerse GitHub Token deployed to:", tokenAddress);
    
    // Display token information
    console.log("\nToken Information:");
    console.log("==================");
    console.log("Name:", await token.name());
    console.log("Symbol:", await token.symbol());
    console.log("Total Supply:", hre.ethers.formatEther(await token.totalSupply()), "SGT");
    console.log("Max Supply:", hre.ethers.formatEther(await token.MAX_SUPPLY()), "SGT");
    console.log("Sacred Frequency:", await token.FREQUENCY_963HZ(), "Hz");
    
    console.log("\nPool Allocations:");
    console.log("=================");
    console.log("Developer Pool (40%):", hre.ethers.formatEther(await token.developerPoolBalance()), "SGT");
    console.log("Employee Pool (20%):", hre.ethers.formatEther(await token.employeePoolBalance()), "SGT");
    console.log("Education Pool (20%):", hre.ethers.formatEther(await token.educationPoolBalance()), "SGT");
    console.log("AI Merit Pool (10%):", hre.ethers.formatEther(await token.aiMeritPoolBalance()), "SGT");
    console.log("Treasury Pool (10%):", hre.ethers.formatEther(await token.treasuryPoolBalance()), "SGT");
    
    console.log("\nReward Structures:");
    console.log("==================");
    const githubReward = await token.githubReward();
    console.log("First PR Reward:", hre.ethers.formatEther(githubReward.firstPRReward), "SGT");
    console.log("Star Milestone Reward:", hre.ethers.formatEther(githubReward.starMilestoneReward), "SGT");
    console.log("Merge Reward:", hre.ethers.formatEther(githubReward.mergeReward), "SGT");
    console.log("Milestone Reward:", hre.ethers.formatEther(githubReward.milestoneReward), "SGT");
    
    const educationReward = await token.educationReward();
    console.log("\nEducation Rewards:");
    console.log("Project Completion:", hre.ethers.formatEther(educationReward.projectCompletionReward), "SGT");
    console.log("Achievement:", hre.ethers.formatEther(educationReward.achievementReward), "SGT");
    console.log("Monthly Active:", hre.ethers.formatEther(educationReward.monthlyActiveReward), "SGT");
    console.log("Scholarship Unlock:", hre.ethers.formatEther(educationReward.scholarshipUnlockAmount), "SGT");
    
    console.log("\nStaking Information:");
    console.log("====================");
    console.log("Staking APY:", (await token.stakingAPY()) / 100, "%");
    
    // Save deployment info
    const deploymentInfo = {
        network: hre.network.name,
        contractAddress: tokenAddress,
        deployer: deployer.address,
        timestamp: new Date().toISOString(),
        totalSupply: "144000000",
        frequency: "963Hz"
    };
    
    console.log("\nDeployment Info:", JSON.stringify(deploymentInfo, null, 2));
    
    // Verification instructions
    if (hre.network.name !== "hardhat" && hre.network.name !== "localhost") {
        console.log("\nTo verify the contract, run:");
        console.log(`npx hardhat verify --network ${hre.network.name} ${tokenAddress} "${deployer.address}"`);
    }
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
