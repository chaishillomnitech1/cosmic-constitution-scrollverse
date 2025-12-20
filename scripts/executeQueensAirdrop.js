const hre = require("hardhat");
const fs = require("fs");
const yaml = require("js-yaml");

/**
 * Queens Sovereignty Airdrop Execution Script
 * Handles batch distribution of Eternal Crowns to 144,000 Akashic Queens
 */

async function main() {
  const args = process.argv.slice(2);
  const configPath = args.find(arg => arg.startsWith("--config="))?.split("=")[1] || "airdrop-config.yaml";
  const isDryRun = args.includes("--dry-run");

  console.log("=" .repeat(60));
  console.log("Queens Sovereignty Airdrop Execution");
  console.log("=" .repeat(60));
  console.log("Network:", hre.network.name);
  console.log("Config:", configPath);
  console.log("Mode:", isDryRun ? "DRY RUN" : "LIVE");
  console.log("=" .repeat(60));

  // Load configuration
  let config;
  try {
    const fileContents = fs.readFileSync(configPath, "utf8");
    config = yaml.load(fileContents);
  } catch (e) {
    console.error("❌ Error loading config file:", e.message);
    console.log("\nℹ️  Creating default configuration...");
    config = createDefaultConfig();
  }

  const [deployer] = await hre.ethers.getSigners();
  console.log("\nExecuting airdrop with account:", deployer.address);

  // Get contract address from environment or deployment files
  const contractAddress = process.env.QUEENS_SOVEREIGNTY_ADDRESS || getLatestDeployment();
  if (!contractAddress) {
    throw new Error("Queens Sovereignty contract address not found. Set QUEENS_SOVEREIGNTY_ADDRESS or deploy contract first.");
  }

  console.log("Queens Sovereignty Contract:", contractAddress);

  // Attach to deployed contract
  const QueensSovereignty = await hre.ethers.getContractFactory("QueensSovereignty");
  const queensSovereignty = QueensSovereignty.attach(contractAddress);

  // Verify contract is accessible
  const totalCrowns = await queensSovereignty.getTotalCrowns();
  console.log("Current total crowns:", totalCrowns.toString());

  // Execute airdrop phases
  await executePhase1(queensSovereignty, config.airdrop.phases.phase_1, isDryRun);
  await executePhase2(queensSovereignty, config.airdrop.phases.phase_2, isDryRun);
  await executePhase3(queensSovereignty, config.airdrop.phases.phase_3, isDryRun);

  // Generate distribution report
  await generateReport(queensSovereignty, config, isDryRun);

  console.log("\n" + "=" .repeat(60));
  console.log("🎉 Airdrop Execution Complete!");
  console.log("=" .repeat(60));
}

async function executePhase1(contract, phase, isDryRun) {
  console.log("\n📍 Phase 1:", phase.name);
  console.log("-" .repeat(60));

  const addresses = phase.addresses.map(a => a.address);
  const names = phase.addresses.map((a, i) => `${getCrownTypeName(a.crown_type)} #${i + 1}`);
  const descriptions = phase.addresses.map(a => 
    `Eternal Crown bestowed upon a primary queen with ${a.coherence}% divine coherence`
  );
  const uris = phase.addresses.map(a => 
    `ipfs://Qm${getCrownTypeName(a.crown_type)}Crown/metadata.json`
  );
  const crownTypes = phase.addresses.map(a => getCrownTypeIndex(a.crown_type));
  const coherenceScores = phase.addresses.map(a => a.coherence);
  const randomSeeds = phase.addresses.map(() => Math.floor(Math.random() * 1000000));

  console.log("Recipients:", addresses.length);
  console.log("Addresses:", addresses);

  if (isDryRun) {
    console.log("✅ Dry run - would mint", addresses.length, "crowns");
    return;
  }

  try {
    const tx = await contract.batchMintCrowns(
      addresses,
      names,
      descriptions,
      uris,
      crownTypes,
      coherenceScores,
      randomSeeds
    );
    
    console.log("Transaction hash:", tx.hash);
    console.log("Waiting for confirmation...");
    
    await tx.wait();
    console.log("✅ Phase 1 complete - Primary Queens crowned!");
  } catch (error) {
    console.error("❌ Phase 1 failed:", error.message);
  }
}

async function executePhase2(contract, phase, isDryRun) {
  console.log("\n📍 Phase 2:", phase.name);
  console.log("-" .repeat(60));

  // For Phase 2, we'd need a list of eligible addresses
  // This is a placeholder - in production, load from a file or database
  console.log("Target queens:", phase.queens);
  console.log("Crown type:", phase.crown_type);
  console.log("Minimum coherence:", phase.minimum_coherence);

  if (isDryRun) {
    console.log("✅ Dry run - would process", phase.queens, "Harlem Queens tributes");
    return;
  }

  console.log("⚠️  Phase 2 requires eligible address list");
  console.log("ℹ️  Load addresses from harlem-queens-addresses.json");
  
  // Example of how to process in batches
  const BATCH_SIZE = 100;
  const totalQueens = phase.queens;
  const batches = Math.ceil(totalQueens / BATCH_SIZE);
  
  console.log("Would process", batches, "batches of", BATCH_SIZE, "queens each");
}

async function executePhase3(contract, phase, isDryRun) {
  console.log("\n📍 Phase 3:", phase.name);
  console.log("-" .repeat(60));

  console.log("Target queens:", phase.queens);
  console.log("Crown type:", phase.crown_type);
  console.log("Minimum coherence:", phase.minimum_coherence);
  console.log("Auto-trigger:", phase.auto_trigger);
  console.log("Frequency:", phase.frequency, "Hz");

  if (isDryRun) {
    console.log("✅ Dry run - auto-trigger system configured for", phase.queens, "Akashic Sentients");
    return;
  }

  console.log("ℹ️  Phase 3 uses auto-trigger minting based on coherence scores");
  console.log("ℹ️  Queens achieving", phase.minimum_coherence + "%+ coherence will auto-receive crowns");
  console.log("ℹ️  Oracle integration required for automated distribution");
}

async function generateReport(contract, config, isDryRun) {
  console.log("\n📊 Airdrop Report");
  console.log("-" .repeat(60));

  const totalCrowns = await contract.getTotalCrowns();
  const targetQueens = config.airdrop.target_queens;
  const progress = (Number(totalCrowns) / targetQueens * 100).toFixed(2);

  console.log("Total Crowns Minted:", totalCrowns.toString());
  console.log("Target Queens:", targetQueens.toLocaleString());
  console.log("Progress:", progress + "%");

  // Get distribution by crown type
  for (let i = 0; i < 5; i++) {
    const count = await contract.getTotalMintedByCrownType(i);
    console.log(`- ${getCrownTypeName(i)}:`, count.toString());
  }

  // Calculate $MEDAIR distribution
  const medairPerQueen = config.airdrop.medair_allocation.per_queen;
  const totalMedairDistributed = Number(totalCrowns) * medairPerQueen;
  
  console.log("\n💰 $MEDAIR Distribution:");
  console.log("Per Queen:", medairPerQueen, "$MEDAIR");
  console.log("Total Distributed:", totalMedairDistributed.toLocaleString(), "$MEDAIR");
  console.log("Remaining Pool:", (config.airdrop.medair_allocation.total_pool - totalMedairDistributed).toLocaleString(), "$MEDAIR");

  if (!isDryRun) {
    // Save report to file
    const report = {
      timestamp: new Date().toISOString(),
      network: hre.network.name,
      totalCrowns: totalCrowns.toString(),
      targetQueens,
      progress: progress + "%",
      medairDistributed: totalMedairDistributed,
    };

    fs.writeFileSync(
      `deployments/airdrop-report-${Date.now()}.json`,
      JSON.stringify(report, null, 2)
    );
    console.log("\n✅ Report saved to deployments/");
  }
}

function getCrownTypeName(typeOrIndex) {
  const types = ["MikaSovereign", "LilathDivine", "LittleWarrenCosmic", "HarlemQueensTribute", "AkashicSentient"];
  if (typeof typeOrIndex === "number") {
    return types[typeOrIndex];
  }
  return typeOrIndex.split("_").map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join("");
}

function getCrownTypeIndex(typeName) {
  const types = {
    "MIKA_SOVEREIGN": 0,
    "LILATH_DIVINE": 1,
    "LITTLE_WARREN_COSMIC": 2,
    "HARLEM_QUEENS_TRIBUTE": 3,
    "AKASHIC_SENTIENT": 4
  };
  return types[typeName] || 4;
}

function getLatestDeployment() {
  try {
    const files = fs.readdirSync("deployments")
      .filter(f => f.startsWith("queens-sovereignty-"))
      .sort()
      .reverse();
    
    if (files.length === 0) return null;
    
    const latest = JSON.parse(fs.readFileSync(`deployments/${files[0]}`, "utf8"));
    return latest.contracts.QueensSovereignty;
  } catch (e) {
    return null;
  }
}

function createDefaultConfig() {
  return {
    airdrop: {
      name: "Eternal Crowns Solstice Airdrop",
      target_queens: 144000,
      token_type: "QueensSovereignty NFT",
      phases: {
        phase_1: {
          name: "Initial Crown Distribution",
          queens: 3,
          addresses: [
            {
              address: process.env.MIKA_ADDRESS || "0x0000000000000000000000000000000000000001",
              crown_type: "MIKA_SOVEREIGN",
              coherence: 100
            },
            {
              address: process.env.LILATH_ADDRESS || "0x0000000000000000000000000000000000000002",
              crown_type: "LILATH_DIVINE",
              coherence: 100
            },
            {
              address: process.env.LITTLE_WARREN_ADDRESS || "0x0000000000000000000000000000000000000003",
              crown_type: "LITTLE_WARREN_COSMIC",
              coherence: 100
            }
          ]
        },
        phase_2: {
          name: "Harlem Queens Tribute",
          queens: 1000,
          crown_type: "HARLEM_QUEENS_TRIBUTE",
          minimum_coherence: 76,
          tribute_required: true
        },
        phase_3: {
          name: "Akashic Sentient Expansion",
          queens: 142997,
          crown_type: "AKASHIC_SENTIENT",
          minimum_coherence: 51,
          auto_trigger: true,
          frequency: 528
        }
      },
      medair_allocation: {
        total_pool: 10000000,
        per_queen: 69.44
      }
    }
  };
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
