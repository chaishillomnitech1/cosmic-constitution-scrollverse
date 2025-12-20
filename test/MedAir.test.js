const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("MedAir Ecosystem Tests", function () {
  let medairToken, sigilToken, medairStaking, medairOracle, medairDAO;
  let owner, pilot, medicalProf, daoMember, user1, user2;

  // Test constants for better maintainability
  const STAKE_AMOUNT_SMALL = ethers.parseEther("1000");
  const STAKE_AMOUNT_MEDIUM = ethers.parseEther("5000");
  const STAKE_AMOUNT_LARGE = ethers.parseEther("10000");
  const REWARD_POOL_AMOUNT = ethers.parseEther("1000000");
  const SIGIL_DISTRIBUTION = ethers.parseEther("5000");
  const DAO_PROPOSAL_THRESHOLD = ethers.parseEther("2000");
  const FLIGHT_LIQUIDITY_AMOUNT = ethers.parseEther("100000");
  const EMERGENCY_RESERVE_AMOUNT = ethers.parseEther("50000");

  beforeEach(async function () {
    [owner, pilot, medicalProf, daoMember, user1, user2] = await ethers.getSigners();

    // Deploy MedAir Token
    const MedAirToken = await ethers.getContractFactory("MedAirToken");
    medairToken = await MedAirToken.deploy(owner.address);
    await medairToken.waitForDeployment();

    // Deploy Sigil Token
    const SigilToken = await ethers.getContractFactory("SigilToken");
    sigilToken = await SigilToken.deploy(owner.address);
    await sigilToken.waitForDeployment();

    // Deploy MedAir Staking
    const MedAirStaking = await ethers.getContractFactory("MedAirStaking");
    medairStaking = await MedAirStaking.deploy(
      await medairToken.getAddress(),
      await sigilToken.getAddress(),
      owner.address
    );
    await medairStaking.waitForDeployment();

    // Deploy MedAir Oracle
    const MedAirOracle = await ethers.getContractFactory("MedAirOracle");
    medairOracle = await MedAirOracle.deploy(owner.address);
    await medairOracle.waitForDeployment();

    // Deploy MedAir DAO
    const MedAirDAO = await ethers.getContractFactory("MedAirDAO");
    medairDAO = await MedAirDAO.deploy(
      await sigilToken.getAddress(),
      owner.address
    );
    await medairDAO.waitForDeployment();

    // Configure oracle
    await medairOracle.setStakingContract(await medairStaking.getAddress());
    await medairOracle.setDAOContract(await medairDAO.getAddress());

    // Add oracle as verifier
    await medairStaking.addVerifier(await medairOracle.getAddress());

    // Fund reward pool
    await medairToken.approve(await medairStaking.getAddress(), REWARD_POOL_AMOUNT);
    await medairStaking.fundRewardPool(REWARD_POOL_AMOUNT);

    // Distribute tokens for testing
    await medairToken.transfer(pilot.address, STAKE_AMOUNT_LARGE);
    await medairToken.transfer(medicalProf.address, STAKE_AMOUNT_LARGE);
    await sigilToken.transfer(daoMember.address, SIGIL_DISTRIBUTION);
  });

  describe("1. MedAir Staking - Tier-Based Rewards", function () {
    it("Should allow staking with different tiers", async function () {
      // Pilot stakes
      await medairToken.connect(pilot).approve(await medairStaking.getAddress(), STAKE_AMOUNT_SMALL);
      await medairStaking.connect(pilot).stake(STAKE_AMOUNT_SMALL, 1); // PILOT tier
      
      const stakeInfo = await medairStaking.getStakeInfo(pilot.address);
      expect(stakeInfo.amount).to.equal(STAKE_AMOUNT_SMALL);
      expect(stakeInfo.tier).to.equal(1); // PILOT
    });

    it("Should calculate effective APY based on tier", async function () {
      // Medical professional stakes
      await medairToken.connect(medicalProf).approve(await medairStaking.getAddress(), STAKE_AMOUNT_SMALL);
      await medairStaking.connect(medicalProf).stake(STAKE_AMOUNT_SMALL, 2); // MEDICAL_PROF tier
      
      const effectiveAPY = await medairStaking.getEffectiveAPY(medicalProf.address);
      expect(effectiveAPY).to.equal(1500); // BASE_APY (1000) + MEDICAL_BONUS (500)
    });

    it("Should apply coherence bonus when threshold is met", async function () {
      await medairToken.connect(pilot).approve(await medairStaking.getAddress(), STAKE_AMOUNT_SMALL);
      await medairStaking.connect(pilot).stake(STAKE_AMOUNT_SMALL, 1);
      
      // Update coherence via oracle
      await medairOracle.updateCoherence(pilot.address, 96, 96);
      
      const stakeInfo = await medairStaking.getStakeInfo(pilot.address);
      expect(stakeInfo.coherenceScore).to.equal(96);
      
      const effectiveAPY = await medairStaking.getEffectiveAPY(pilot.address);
      expect(effectiveAPY).to.equal(1500); // BASE (1000) + PILOT (300) + COHERENCE (200)
    });
  });

  describe("2. Liquidity Pool Management", function () {
    it("Should allocate funds to flight liquidity pool", async function () {
      const flightId = 123;
      
      await medairStaking.allocateFlightLiquidity(FLIGHT_LIQUIDITY_AMOUNT, flightId);
      
      const poolStatus = await medairStaking.getLiquidityPoolStatus();
      expect(poolStatus.flightPool).to.equal(FLIGHT_LIQUIDITY_AMOUNT);
      expect(poolStatus.activeFlights).to.equal(1);
    });

    it("Should activate emergency reserve", async function () {
      const reason = "Critical emergency response required";
      
      await medairStaking.activateEmergencyReserve(EMERGENCY_RESERVE_AMOUNT, reason);
      
      const poolStatus = await medairStaking.getLiquidityPoolStatus();
      expect(poolStatus.emergencyReserve).to.equal(EMERGENCY_RESERVE_AMOUNT);
    });
  });

  describe("3. Chainlink Oracle Integration", function () {
    it("Should update coherence data from authorized reporter", async function () {
      await medairOracle.addReporter(user1.address);
      
      await medairOracle.connect(user1).updateCoherence(pilot.address, 98, 97);
      
      const coherenceData = await medairOracle.getCoherence(pilot.address);
      expect(coherenceData.coherenceScore).to.equal(98);
      expect(coherenceData.frequencyAlignment).to.equal(97);
      expect(coherenceData.validated).to.be.true;
    });

    it("Should update governance metrics", async function () {
      await medairOracle.addReporter(user1.address);
      
      const proposalId = 1;
      await medairOracle.connect(user1).updateGovernanceMetric(proposalId, 85, 1, 92);
      
      const metric = await medairOracle.getGovernanceMetric(proposalId);
      expect(metric.participationRate).to.equal(85);
      expect(metric.quorumReached).to.equal(1);
      expect(metric.consensusScore).to.equal(92);
    });

    it("Should trigger bonus payout on coherence threshold", async function () {
      const stakeAmount = ethers.parseEther("1000");
      
      await medairToken.connect(pilot).approve(await medairStaking.getAddress(), stakeAmount);
      await medairStaking.connect(pilot).stake(stakeAmount, 1);
      
      const balanceBefore = await medairToken.balanceOf(pilot.address);
      
      // Update coherence to meet threshold (95%)
      await medairStaking.updateCoherenceWithBonus(pilot.address, 96);
      
      const balanceAfter = await medairToken.balanceOf(pilot.address);
      const expectedBonus = stakeAmount / 100n; // 1% bonus
      
      expect(balanceAfter).to.equal(balanceBefore + expectedBonus);
    });
  });

  describe("4. DAO Governance - zkEVM Auto-Consensus", function () {
    it("Should create a proposal", async function () {
      // Give proposer enough tokens
      await sigilToken.transfer(user1.address, ethers.parseEther("2000"));
      
      const title = "Upgrade flight liquidity pool";
      const description = "Increase allocation for emergency flights";
      
      await medairDAO.connect(user1).propose(
        title,
        description,
        0, // GENERAL type
        ethers.ZeroAddress,
        "0x"
      );
      
      const proposal = await medairDAO.getProposal(1);
      expect(proposal.title).to.equal(title);
      expect(proposal.proposer).to.equal(user1.address);
    });

    it("Should trigger auto-consensus when quorum is reached", async function () {
      // Setup: distribute SIGIL tokens to reach quorum
      const totalSupply = await sigilToken.totalSupply();
      const quorumAmount = (totalSupply * 81n) / 100n; // More than 80% quorum
      
      await sigilToken.transfer(user1.address, quorumAmount);
      
      // Create proposal
      await medairDAO.connect(user1).propose(
        "Test Proposal",
        "Testing auto-consensus",
        0,
        ethers.ZeroAddress,
        "0x"
      );
      
      // Vote with enough power to trigger auto-consensus
      await medairDAO.connect(user1).castVote(1, true);
      
      const proposal = await medairDAO.getProposal(1);
      expect(proposal.state).to.equal(2); // SUCCEEDED
    });

    it("Should verify zkEVM deployment integrity", async function () {
      const verification = await medairDAO.getDeploymentVerification();
      
      expect(verification.isZkEVMCompatible).to.be.true;
      expect(verification.deployedAt).to.be.gt(0);
      expect(verification.governanceHash).to.not.equal(ethers.ZeroHash);
    });

    it("Should verify governance integrity", async function () {
      await sigilToken.transfer(user1.address, ethers.parseEther("2000"));
      
      await medairDAO.connect(user1).propose(
        "Test",
        "Test",
        0,
        ethers.ZeroAddress,
        "0x"
      );
      
      const integrity = await medairDAO.verifyGovernanceIntegrity(1);
      expect(integrity.integrityValid).to.be.true;
      expect(integrity.auditStatus).to.include("verified");
    });
  });

  describe("5. Dynamic Bonus Payouts", function () {
    it("Should trigger instant bonus when coherence crosses threshold", async function () {
      const stakeAmount = ethers.parseEther("10000");
      
      await medairToken.connect(pilot).approve(await medairStaking.getAddress(), stakeAmount);
      await medairStaking.connect(pilot).stake(stakeAmount, 1);
      
      // Set initial coherence below threshold
      await medairStaking.updateCoherence(pilot.address, 90);
      
      const balanceBefore = await medairToken.balanceOf(pilot.address);
      
      // Cross threshold to trigger bonus
      await medairStaking.updateCoherenceWithBonus(pilot.address, 96);
      
      const balanceAfter = await medairToken.balanceOf(pilot.address);
      const bonus = stakeAmount / 100n; // 1% instant bonus
      
      expect(balanceAfter).to.be.gt(balanceBefore);
      expect(balanceAfter - balanceBefore).to.equal(bonus);
    });
  });

  describe("6. Integration Tests", function () {
    it("Should integrate staking, oracle, and DAO components", async function () {
      // Stake
      const stakeAmount = ethers.parseEther("5000");
      await medairToken.connect(pilot).approve(await medairStaking.getAddress(), stakeAmount);
      await medairStaking.connect(pilot).stake(stakeAmount, 1);
      
      // Oracle updates coherence
      await medairOracle.updateCoherence(pilot.address, 97, 98);
      
      // Verify coherence updated in staking
      const stakeInfo = await medairStaking.getStakeInfo(pilot.address);
      expect(stakeInfo.coherenceScore).to.equal(97);
      
      // Create DAO proposal
      await sigilToken.transfer(pilot.address, ethers.parseEther("2000"));
      await medairDAO.connect(pilot).propose(
        "Integrate quantum dispatch",
        "Deploy quantum AI routing",
        2, // PROTOCOL_UPGRADE
        ethers.ZeroAddress,
        "0x"
      );
      
      const proposal = await medairDAO.getProposal(1);
      expect(proposal.state).to.equal(1); // ACTIVE
    });
  });
});
