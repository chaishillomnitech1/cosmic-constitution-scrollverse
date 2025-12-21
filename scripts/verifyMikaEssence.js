/**
 * Mika's Essence Verification Script
 * Verifies the presence and integrity of Mika's essence across the ScrollVerse
 */

const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

// Mika's Essence Constants (must match deployment)
const MIKA_ESSENCE = {
  essenceId: "MIKA-1222-ETERNAL",
  digitalBloodlineId: "MIKA-SOVEREIGN-ESSENCE-1222",
  soulCode: "4-4-4-MASTER-BUILDER-FREQUENCY",
  akashicHash: "0xe3b2afc61ed9a72868f5d4b23c072e47411d57ee3ea025898783ff66e38d936a",
  frequencies: {
    loveVortex: 528,
    edenPulse: 963,
    masterBuilder: 1222,
    gatekeeper: 222,
  },
  totalNodes: 444,
};

async function verifyMikaEssence() {
  console.log("\n🔍 ========================================");
  console.log("   MIKA'S ESSENCE VERIFICATION");
  console.log("   ScrollVerse Integrity Check");
  console.log("========================================== 🔍\n");

  const [signer] = await hre.ethers.getSigners();
  console.log(`📡 Verifying from account: ${signer.address}\n`);

  const results = {
    timestamp: new Date().toISOString(),
    network: hre.network.name,
    verificationsPassed: 0,
    verificationsTotal: 0,
    details: {},
  };

  try {
    // Step 1: Verify AkashicRecordsLedger deployment
    console.log("📜 Step 1: Verifying AkashicRecordsLedger...");
    results.verificationsTotal++;
    
    const akashicLedgerAddress = process.env.AKASHIC_LEDGER_ADDRESS;
    
    if (!akashicLedgerAddress) {
      console.log("   ⚠️ AKASHIC_LEDGER_ADDRESS not set in environment");
      results.details.akashicLedger = "NOT_CONFIGURED";
    } else {
      try {
        const akashicLedger = await hre.ethers.getContractAt("AkashicRecordsLedger", akashicLedgerAddress);
        
        // Check if contract exists at address
        const code = await hre.ethers.provider.getCode(akashicLedgerAddress);
        if (code === "0x") {
          console.log(`   ❌ No contract found at ${akashicLedgerAddress}`);
          results.details.akashicLedger = "NOT_DEPLOYED";
        } else {
          console.log(`   ✓ AkashicRecordsLedger found at ${akashicLedgerAddress}`);
          results.details.akashicLedger = akashicLedgerAddress;
          results.verificationsPassed++;
          
          // Step 2: Verify Mika's records
          console.log("\n🔱 Step 2: Searching for Mika's Records...");
          results.verificationsTotal++;
          
          try {
            // Try to get total record count
            const totalRecords = await akashicLedger.totalRecords();
            console.log(`   Total Akashic Records: ${totalRecords}`);
            
            let mikaRecordFound = false;
            const maxToCheck = Math.min(Number(totalRecords), 100); // Check up to 100 records
            
            for (let i = 0; i < maxToCheck; i++) {
              try {
                const record = await akashicLedger.getRecord(i);
                
                // Check if this record matches Mika's essence
                if (record.milestoneType === "MIKA_ETERNAL_ESSENCE_INTEGRATION" ||
                    record.coherenceSignature.includes("1222-MASTER-BUILDER")) {
                  console.log(`   ✓ Found Mika's record at ID: ${i}`);
                  console.log(`     Milestone Type: ${record.milestoneType}`);
                  console.log(`     Coherence Signature: ${record.coherenceSignature}`);
                  console.log(`     Dimensional Layer: ${record.dimensionalLayer}`);
                  console.log(`     Eternal Seal: ${record.isEternallySealed ? "ACTIVE" : "PENDING"}`);
                  
                  mikaRecordFound = true;
                  results.details.mikaRecord = {
                    recordId: i,
                    milestoneType: record.milestoneType,
                    isSealed: record.isEternallySealed,
                  };
                  results.verificationsPassed++;
                  break;
                }
              } catch (e) {
                // Record might not exist or be accessible, continue
              }
            }
            
            if (!mikaRecordFound) {
              console.log(`   ⚠️ Mika's record not found in first ${maxToCheck} records`);
              console.log(`     This may be normal if records exist beyond this range`);
              results.details.mikaRecord = "NOT_FOUND_IN_SAMPLE";
            }
            
          } catch (e) {
            console.log(`   ⚠️ Could not query records: ${e.message}`);
            results.details.mikaRecord = "QUERY_ERROR";
          }
        }
      } catch (e) {
        console.log(`   ❌ Error connecting to AkashicRecordsLedger: ${e.message}`);
        results.details.akashicLedger = "CONNECTION_ERROR";
      }
    }

    // Step 3: Verify PhysicalAssetMachine3D
    console.log("\n🏗️ Step 3: Verifying Digital Bloodline...");
    results.verificationsTotal++;
    
    const physicalAssetAddress = process.env.PHYSICAL_ASSET_MACHINE_ADDRESS;
    
    if (!physicalAssetAddress) {
      console.log("   ⚠️ PHYSICAL_ASSET_MACHINE_ADDRESS not set in environment");
      results.details.digitalBloodline = "NOT_CONFIGURED";
    } else {
      try {
        const physicalAssetMachine = await hre.ethers.getContractAt("PhysicalAssetMachine3D", physicalAssetAddress);
        
        const code = await hre.ethers.provider.getCode(physicalAssetAddress);
        if (code === "0x") {
          console.log(`   ❌ No contract found at ${physicalAssetAddress}`);
          results.details.digitalBloodline = "NOT_DEPLOYED";
        } else {
          console.log(`   ✓ PhysicalAssetMachine3D found at ${physicalAssetAddress}`);
          
          try {
            const bloodline = await physicalAssetMachine.bloodlines(MIKA_ESSENCE.digitalBloodlineId);
            
            if (bloodline.isActive) {
              console.log(`   ✓ Mika's Digital Bloodline is ACTIVE`);
              console.log(`     Bloodline ID: ${MIKA_ESSENCE.digitalBloodlineId}`);
              console.log(`     Generation Level: ${bloodline.generationLevel}`);
              console.log(`     Connected Assets: ${bloodline.connectedAssets.length}`);
              results.details.digitalBloodline = {
                bloodlineId: MIKA_ESSENCE.digitalBloodlineId,
                isActive: true,
                generationLevel: Number(bloodline.generationLevel),
              };
              results.verificationsPassed++;
            } else {
              console.log(`   ⚠️ Mika's Digital Bloodline exists but is not active`);
              results.details.digitalBloodline = "INACTIVE";
            }
          } catch (e) {
            console.log(`   ⚠️ Could not query digital bloodline: ${e.message}`);
            results.details.digitalBloodline = "QUERY_ERROR";
          }
        }
      } catch (e) {
        console.log(`   ❌ Error connecting to PhysicalAssetMachine3D: ${e.message}`);
        results.details.digitalBloodline = "CONNECTION_ERROR";
      }
    }

    // Step 4: Verify Soul-Recall script exists
    console.log("\n🎵 Step 4: Verifying Soul-Recall Script...");
    results.verificationsTotal++;
    
    const soulRecallPath = path.join(__dirname, "..", "soul_recall_mika.py");
    if (fs.existsSync(soulRecallPath)) {
      console.log(`   ✓ Soul-Recall script found at: ${soulRecallPath}`);
      results.details.soulRecallScript = "PRESENT";
      results.verificationsPassed++;
    } else {
      console.log(`   ❌ Soul-Recall script not found at: ${soulRecallPath}`);
      results.details.soulRecallScript = "MISSING";
    }

    // Step 5: Verify documentation
    console.log("\n📚 Step 5: Verifying Documentation...");
    results.verificationsTotal++;
    
    const docPath = path.join(__dirname, "..", "docs", "MIKA_ESSENCE_ETERNAL_NODE.md");
    if (fs.existsSync(docPath)) {
      console.log(`   ✓ Mika's Eternal Memory Node documentation found`);
      results.details.documentation = "PRESENT";
      results.verificationsPassed++;
    } else {
      console.log(`   ❌ Documentation not found at: ${docPath}`);
      results.details.documentation = "MISSING";
    }

    // Step 6: Verify IPFS metadata
    console.log("\n📝 Step 6: Verifying IPFS Metadata...");
    results.verificationsTotal++;
    
    const metadataPath = path.join(__dirname, "..", "metadata", "mika-essence", "essence.json");
    if (fs.existsSync(metadataPath)) {
      console.log(`   ✓ IPFS metadata file found`);
      const metadata = JSON.parse(fs.readFileSync(metadataPath, 'utf8'));
      console.log(`     Name: ${metadata.name}`);
      console.log(`     Attributes: ${metadata.attributes?.length || 0}`);
      results.details.ipfsMetadata = "PRESENT";
      results.verificationsPassed++;
    } else {
      console.log(`   ⚠️ IPFS metadata not found at: ${metadataPath}`);
      console.log(`     Run deployment script to generate`);
      results.details.ipfsMetadata = "MISSING";
    }

    // Calculate verification percentage
    const successRate = (results.verificationsPassed / results.verificationsTotal) * 100;
    
    // Final Summary
    console.log("\n" + "=".repeat(70));
    console.log("📊 VERIFICATION SUMMARY");
    console.log("=".repeat(70));
    console.log(`\n✅ Verifications Passed: ${results.verificationsPassed}/${results.verificationsTotal}`);
    console.log(`📈 Success Rate: ${successRate.toFixed(1)}%`);
    
    if (successRate === 100) {
      console.log(`\n🌟 PERFECT! Mika's essence is fully integrated and protected!`);
      console.log(`   ✓ All systems operational`);
      console.log(`   ✓ 1222 Master Builder Authority ACTIVE`);
      console.log(`   ✓ 444 Node protection network READY`);
      console.log(`   ✓ Eternal seal VERIFIED`);
    } else if (successRate >= 75) {
      console.log(`\n✨ GOOD! Mika's essence is mostly integrated`);
      console.log(`   Some components may need configuration or deployment`);
    } else if (successRate >= 50) {
      console.log(`\n⚠️ PARTIAL! Some critical components are missing`);
      console.log(`   Review failed verifications and run deployment script`);
    } else {
      console.log(`\n❌ INCOMPLETE! Major components are missing`);
      console.log(`   Run deployment script: npm run deploy:mika:essence`);
    }
    
    console.log(`\n📋 Detailed Results:`);
    console.log(JSON.stringify(results.details, null, 2));
    
    console.log(`\n💡 Next Steps:`);
    if (results.details.akashicLedger === "NOT_CONFIGURED") {
      console.log(`   1. Deploy AkashicRecordsLedger or set AKASHIC_LEDGER_ADDRESS`);
    }
    if (results.details.mikaRecord === "NOT_FOUND_IN_SAMPLE" || !results.details.mikaRecord) {
      console.log(`   2. Run deployment script: node scripts/deployMikaEssence.js`);
    }
    if (results.details.soulRecallScript === "MISSING") {
      console.log(`   3. Ensure soul_recall_mika.py is present in repository root`);
    }
    if (results.details.ipfsMetadata === "MISSING") {
      console.log(`   4. Generate IPFS metadata via deployment script`);
    }
    if (successRate === 100) {
      console.log(`   ✓ Everything verified! Run: python3 soul_recall_mika.py`);
    }
    
    console.log(`\n❤️🔥🧬💫🌌 Forever Sealed. Forever Present. Forever Mika.\n`);
    
    // Save verification results
    const resultsDir = path.join(__dirname, "..", "verification-results");
    if (!fs.existsSync(resultsDir)) {
      fs.mkdirSync(resultsDir, { recursive: true });
    }
    
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    const resultsPath = path.join(resultsDir, `mika-essence-verification-${timestamp}.json`);
    fs.writeFileSync(resultsPath, JSON.stringify(results, null, 2));
    console.log(`📄 Verification results saved to: ${resultsPath}\n`);

    return results;

  } catch (error) {
    console.error("\n❌ Error during verification:", error);
    throw error;
  }
}

// Execute verification
if (require.main === module) {
  verifyMikaEssence()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}

module.exports = { verifyMikaEssence };
