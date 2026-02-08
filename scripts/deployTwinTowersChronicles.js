const hre = require("hardhat");

async function main() {
    console.log("Deploying Twin Towers Chronicles NFT...");
    
    // Configuration
    const baseURI = "ipfs://"; // Base IPFS URI
    const roseGoldKey = hre.ethers.encodeBytes32String("ROSE_GOLD_963HZ_144000HZ_SOVEREIGN");
    
    // Get deployer
    const [deployer] = await hre.ethers.getSigners();
    console.log("Deploying with account:", deployer.address);
    
    const balance = await hre.ethers.provider.getBalance(deployer.address);
    console.log("Account balance:", hre.ethers.formatEther(balance), "ETH");
    
    // Deploy contract
    const TwinTowersChroniclesNFT = await hre.ethers.getContractFactory("TwinTowersChroniclesNFT");
    const nft = await TwinTowersChroniclesNFT.deploy(baseURI, roseGoldKey);
    
    await nft.waitForDeployment();
    const nftAddress = await nft.getAddress();
    
    console.log("Twin Towers Chronicles NFT deployed to:", nftAddress);
    
    // Create initial Chronicles
    console.log("\nCreating initial Chronicles...");
    
    const chronicles = [
        {
            name: "Genesis Chronicle - The Conversation",
            description: "The sacred dialogue that birthed the ScrollVerse GitHub ecosystem",
            alignment: "Supreme King Chaisallah Sovereignty",
            encryption: "Rose Gold 963Hz Quantum Encryption",
            ipfs: "QmTwinTowersGenesis001"
        },
        {
            name: "Digital Sovereignty Manifesto",
            description: "Declaration of digital sovereignty and tech empowerment",
            alignment: "Eternal Abundance & Innovation",
            encryption: "Rose Gold 144Hz Harmonic Lock",
            ipfs: "QmTwinTowersManifesto002"
        },
        {
            name: "GitHub Legacy Foundation",
            description: "Blueprint for GitHub employee and developer incentivization",
            alignment: "Universal Tech Access",
            encryption: "Rose Gold 144000Hz Celestial Shield",
            ipfs: "QmTwinTowersFoundation003"
        }
    ];
    
    for (let i = 0; i < chronicles.length; i++) {
        const chronicle = chronicles[i];
        const tx = await nft.createChronicle(
            chronicle.name,
            chronicle.description,
            chronicle.alignment,
            chronicle.encryption,
            chronicle.ipfs
        );
        await tx.wait();
        console.log(`Created Chronicle ${i + 1}: ${chronicle.name}`);
    }
    
    console.log("\nDeployment Summary:");
    console.log("===================");
    console.log("Contract Address:", nftAddress);
    console.log("Max Editions:", await nft.MAX_EDITIONS());
    console.log("Current Supply:", await nft.getCurrentSupply());
    console.log("Remaining Editions:", await nft.getRemainingEditions());
    console.log("Sacred Frequencies:", "144,000Hz + 963Hz + 144Hz");
    
    // Save deployment info
    const deploymentInfo = {
        network: hre.network.name,
        contractAddress: nftAddress,
        deployer: deployer.address,
        timestamp: new Date().toISOString(),
        maxEditions: 144,
        initialChronicles: chronicles.length
    };
    
    console.log("\nDeployment Info:", JSON.stringify(deploymentInfo, null, 2));
    
    // Verification instructions
    if (hre.network.name !== "hardhat" && hre.network.name !== "localhost") {
        console.log("\nTo verify the contract, run:");
        console.log(`npx hardhat verify --network ${hre.network.name} ${nftAddress} "${baseURI}" "${roseGoldKey}"`);
    }
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
