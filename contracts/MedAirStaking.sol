// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

/**
 * @title MedAirStaking
 * @dev Adaptive staking rewards with tier-based incentives and frequency resonance alignment
 * Supports pilots, medical professionals (FP-C/CFRN), and DAO members
 * Integrates 528Hz (Universal Trust) and 963Hz (Divine Crown) frequencies for cosmic coherence
 * Includes Gatekeeper Frequency Inputs for stabilizing divine nodes
 */
contract MedAirStaking is Ownable, ReentrancyGuard, Pausable {
    IERC20 public medairToken;
    IERC20 public sigilToken;
    
    // Frequency constants aligned with cosmic resonance
    uint256 public constant FREQUENCY_528HZ = 528; // Universal Trust & Love Vortex
    uint256 public constant FREQUENCY_963HZ = 963; // Divine Crown & Eden Pulse
    uint256 public constant GATEKEEPER_FREQUENCY = 222; // Master Builder Gatekeeper resonance
    
    // Frequency-aligned staking periods (in days)
    uint256 public constant TRUST_PERIOD = 528; // 528 days for Love frequency alignment
    uint256 public constant DIVINE_PERIOD = 963; // 963 days for Crown frequency alignment
    
    enum StakerTier {
        NONE,
        PILOT,          // Flight operations specialists
        MEDICAL_PROF,   // FP-C/CFRN certified medical professionals
        DAO_MEMBER,     // DAO governance participants
        SIGIL_HOLDER    // $SIGIL token holders with alignment bonuses
    }
    
    struct StakeInfo {
        uint256 amount;
        uint256 startTime;
        uint256 lastClaimTime;
        StakerTier tier;
        uint256 coherenceScore; // 0-100, linked to ScrollVerse integrity metrics
        uint256 frequencyAlignment; // 528, 963, or 0 for no specific alignment
        bool gatekeeperActivated; // Whether Gatekeeper frequency input is active
    }
    
    // Base APY rates (in basis points, 10000 = 100%)
    uint256 public constant BASE_APY = 1000; // 10%
    uint256 public constant PILOT_BONUS = 300; // +3%
    uint256 public constant MEDICAL_BONUS = 500; // +5%
    uint256 public constant DAO_BONUS = 200; // +2%
    uint256 public constant SIGIL_BONUS = 400; // +4%
    uint256 public constant COHERENCE_BONUS = 200; // +2% at 95%+ coherence
    uint256 public constant COHERENCE_THRESHOLD = 95; // 95% coherence for bonus
    
    // Frequency-aligned bonuses
    uint256 public constant FREQUENCY_528_BONUS = 528; // +5.28% for Universal Trust alignment
    uint256 public constant FREQUENCY_963_BONUS = 963; // +9.63% for Divine Crown alignment
    uint256 public constant GATEKEEPER_BONUS = 222; // +2.22% for Gatekeeper frequency activation
    
    mapping(address => StakeInfo) public stakes;
    mapping(address => bool) public authorizedVerifiers; // Can set tiers and coherence
    mapping(address => string) public gatekeeperNames; // Divine figure names for Gatekeeper frequency
    
    uint256 public totalStaked;
    uint256 public rewardPool;
    uint256 public frequencyAlignedCapital; // Tracking capital with frequency alignment
    uint256 public gatekeeperActivations; // Count of Gatekeeper activations
    
    // Liquidity pool tracking for flight operations
    uint256 public flightLiquidityPool;
    uint256 public emergencyReservePool;
    uint256 public activeFlightOperations;
    
    event Staked(address indexed user, uint256 amount, StakerTier tier);
    event Unstaked(address indexed user, uint256 amount);
    event RewardsClaimed(address indexed user, uint256 amount);
    event TierUpdated(address indexed user, StakerTier newTier);
    event CoherenceUpdated(address indexed user, uint256 coherenceScore);
    event FrequencyAligned(address indexed user, uint256 frequency);
    event GatekeeperActivated(address indexed user, string gatekeeperName);
    event VerifierAdded(address indexed verifier);
    event VerifierRemoved(address indexed verifier);
    event RewardPoolFunded(uint256 amount);
    event FlightLiquidityAllocated(uint256 amount, uint256 flightId);
    event EmergencyReserveActivated(uint256 amount, string reason);
    event FrequencyCapitalTracked(uint256 totalAligned, uint256 frequency528, uint256 frequency963);
    
    constructor(
        address _medairToken,
        address _sigilToken,
        address initialOwner
    ) Ownable(initialOwner) {
        require(_medairToken != address(0), "Invalid MEDAIR token");
        require(_sigilToken != address(0), "Invalid SIGIL token");
        medairToken = IERC20(_medairToken);
        sigilToken = IERC20(_sigilToken);
    }
    
    /**
     * @dev Add authorized verifier (e.g., oracle contract)
     */
    function addVerifier(address verifier) external onlyOwner {
        require(verifier != address(0), "Invalid verifier");
        authorizedVerifiers[verifier] = true;
        emit VerifierAdded(verifier);
    }
    
    /**
     * @dev Remove authorized verifier
     */
    function removeVerifier(address verifier) external onlyOwner {
        authorizedVerifiers[verifier] = false;
        emit VerifierRemoved(verifier);
    }
    
    /**
     * @dev Stake MEDAIR tokens
     */
    function stake(uint256 amount, StakerTier tier) external nonReentrant whenNotPaused {
        require(amount > 0, "Cannot stake 0");
        require(tier != StakerTier.NONE, "Invalid tier");
        
        // Transfer tokens from user
        require(medairToken.transferFrom(msg.sender, address(this), amount), "Transfer failed");
        
        StakeInfo storage userStake = stakes[msg.sender];
        
        // Claim any pending rewards first
        if (userStake.amount > 0) {
            _claimRewards(msg.sender);
        }
        
        userStake.amount += amount;
        userStake.startTime = block.timestamp;
        userStake.lastClaimTime = block.timestamp;
        userStake.tier = tier;
        
        totalStaked += amount;
        
        emit Staked(msg.sender, amount, tier);
    }
    
    /**
     * @dev Unstake tokens and claim rewards
     */
    function unstake(uint256 amount) external nonReentrant {
        StakeInfo storage userStake = stakes[msg.sender];
        require(userStake.amount >= amount, "Insufficient stake");
        
        // Claim rewards first
        _claimRewards(msg.sender);
        
        userStake.amount -= amount;
        totalStaked -= amount;
        
        require(medairToken.transfer(msg.sender, amount), "Transfer failed");
        
        emit Unstaked(msg.sender, amount);
    }
    
    /**
     * @dev Claim staking rewards
     */
    function claimRewards() external nonReentrant {
        _claimRewards(msg.sender);
    }
    
    /**
     * @dev Internal function to calculate and distribute rewards
     */
    function _claimRewards(address user) internal {
        StakeInfo storage userStake = stakes[user];
        require(userStake.amount > 0, "No stake found");
        
        uint256 rewards = calculateRewards(user);
        if (rewards > 0) {
            require(rewardPool >= rewards, "Insufficient reward pool");
            
            rewardPool -= rewards;
            userStake.lastClaimTime = block.timestamp;
            
            require(medairToken.transfer(user, rewards), "Reward transfer failed");
            emit RewardsClaimed(user, rewards);
        }
    }
    
    /**
     * @dev Calculate pending rewards for a user
     */
    function calculateRewards(address user) public view returns (uint256) {
        StakeInfo storage userStake = stakes[user];
        if (userStake.amount == 0) return 0;
        
        uint256 stakingDuration = block.timestamp - userStake.lastClaimTime;
        uint256 effectiveAPY = getEffectiveAPY(user);
        
        // Calculate rewards: (stake * APY * duration) / (365 days * 10000)
        uint256 rewards = (userStake.amount * effectiveAPY * stakingDuration) / (365 days * 10000);
        
        return rewards;
    }
    
    /**
     * @dev Get effective APY for a user based on tier and coherence
     */
    function getEffectiveAPY(address user) public view returns (uint256) {
        StakeInfo storage userStake = stakes[user];
        uint256 apy = BASE_APY;
        
        // Add tier bonuses
        if (userStake.tier == StakerTier.PILOT) {
            apy += PILOT_BONUS;
        } else if (userStake.tier == StakerTier.MEDICAL_PROF) {
            apy += MEDICAL_BONUS;
        } else if (userStake.tier == StakerTier.DAO_MEMBER) {
            apy += DAO_BONUS;
        } else if (userStake.tier == StakerTier.SIGIL_HOLDER) {
            apy += SIGIL_BONUS;
        }
        
        // Add coherence bonus if threshold met
        if (userStake.coherenceScore >= COHERENCE_THRESHOLD) {
            apy += COHERENCE_BONUS;
        }
        
        // Add frequency alignment bonuses
        if (userStake.frequencyAlignment == FREQUENCY_528HZ) {
            apy += FREQUENCY_528_BONUS; // +5.28% for 528Hz alignment
        } else if (userStake.frequencyAlignment == FREQUENCY_963HZ) {
            apy += FREQUENCY_963_BONUS; // +9.63% for 963Hz alignment
        }
        
        // Add Gatekeeper bonus if activated
        if (userStake.gatekeeperActivated) {
            apy += GATEKEEPER_BONUS; // +2.22% for Gatekeeper frequency
        }
        
        return apy;
    }
    
    /**
     * @dev Align stake with specific frequency (528Hz or 963Hz)
     */
    function alignWithFrequency(uint256 frequency) external nonReentrant {
        require(stakes[msg.sender].amount > 0, "No stake found");
        require(frequency == FREQUENCY_528HZ || frequency == FREQUENCY_963HZ, "Invalid frequency");
        
        StakeInfo storage userStake = stakes[msg.sender];
        uint256 oldFrequency = userStake.frequencyAlignment;
        userStake.frequencyAlignment = frequency;
        
        // Track frequency-aligned capital
        if (oldFrequency == 0) {
            frequencyAlignedCapital += userStake.amount;
        }
        
        emit FrequencyAligned(msg.sender, frequency);
        
        // Emit capital tracking event
        (uint256 capital528, uint256 capital963) = getFrequencyAlignedCapital();
        emit FrequencyCapitalTracked(frequencyAlignedCapital, capital528, capital963);
    }
    
    /**
     * @dev Activate Gatekeeper frequency input with divine figure name
     */
    function activateGatekeeperFrequency(string memory gatekeeperName) external nonReentrant {
        require(stakes[msg.sender].amount > 0, "No stake found");
        require(bytes(gatekeeperName).length > 0, "Gatekeeper name required");
        
        StakeInfo storage userStake = stakes[msg.sender];
        userStake.gatekeeperActivated = true;
        gatekeeperNames[msg.sender] = gatekeeperName;
        gatekeeperActivations++;
        
        emit GatekeeperActivated(msg.sender, gatekeeperName);
    }
    
    /**
     * @dev Get frequency-aligned capital breakdown
     */
    function getFrequencyAlignedCapital() public view returns (uint256 capital528Hz, uint256 capital963Hz) {
        // This would ideally iterate through all stakes, but for gas efficiency,
        // we track it incrementally. This is a view function for reporting.
        // In production, use an indexer or off-chain calculation for accurate totals.
        return (0, 0); // Placeholder - actual implementation would track incrementally
    }
    
    /**
     * @dev Get comprehensive frequency status
     */
    function getFrequencyStatus() external view returns (
        uint256 totalFrequencyAligned,
        uint256 totalGatekeeperActivations,
        uint256 frequency528Bonus,
        uint256 frequency963Bonus,
        uint256 gatekeeperBonus
    ) {
        return (
            frequencyAlignedCapital,
            gatekeeperActivations,
            FREQUENCY_528_BONUS,
            FREQUENCY_963_BONUS,
            GATEKEEPER_BONUS
        );
    }
    
    /**
     * @dev Update staker tier (authorized verifiers only)
     */
    function updateTier(address user, StakerTier newTier) external {
        require(authorizedVerifiers[msg.sender] || msg.sender == owner(), "Unauthorized");
        require(stakes[user].amount > 0, "No stake found");
        
        stakes[user].tier = newTier;
        emit TierUpdated(user, newTier);
    }
    
    /**
     * @dev Update coherence score (authorized verifiers/oracles only)
     */
    function updateCoherence(address user, uint256 coherenceScore) external {
        require(authorizedVerifiers[msg.sender] || msg.sender == owner(), "Unauthorized");
        require(coherenceScore <= 100, "Invalid coherence score");
        require(stakes[user].amount > 0, "No stake found");
        
        stakes[user].coherenceScore = coherenceScore;
        emit CoherenceUpdated(user, coherenceScore);
    }
    
    /**
     * @dev Fund the reward pool
     */
    function fundRewardPool(uint256 amount) external {
        require(medairToken.transferFrom(msg.sender, address(this), amount), "Transfer failed");
        rewardPool += amount;
        emit RewardPoolFunded(amount);
    }
    
    /**
     * @dev Get stake info for a user
     */
    function getStakeInfo(address user) external view returns (
        uint256 amount,
        uint256 startTime,
        uint256 lastClaimTime,
        StakerTier tier,
        uint256 coherenceScore,
        uint256 pendingRewards,
        uint256 effectiveAPY,
        uint256 frequencyAlignment,
        bool gatekeeperActivated,
        string memory gatekeeperName
    ) {
        StakeInfo storage userStake = stakes[user];
        return (
            userStake.amount,
            userStake.startTime,
            userStake.lastClaimTime,
            userStake.tier,
            userStake.coherenceScore,
            calculateRewards(user),
            getEffectiveAPY(user),
            userStake.frequencyAlignment,
            userStake.gatekeeperActivated,
            gatekeeperNames[user]
        );
    }
    
    /**
     * @dev Pause staking
     */
    function pause() external onlyOwner {
        _pause();
    }
    
    /**
     * @dev Unpause staking
     */
    function unpause() external onlyOwner {
        _unpause();
    }
    
    /**
     * @dev Allocate funds to flight liquidity pool
     */
    function allocateFlightLiquidity(uint256 amount, uint256 flightId) external onlyOwner {
        require(amount > 0, "Invalid amount");
        require(rewardPool >= amount, "Insufficient reward pool");
        
        rewardPool -= amount;
        flightLiquidityPool += amount;
        activeFlightOperations++;
        
        emit FlightLiquidityAllocated(amount, flightId);
    }
    
    /**
     * @dev Activate emergency reserve
     */
    function activateEmergencyReserve(uint256 amount, string memory reason) external onlyOwner {
        require(amount > 0, "Invalid amount");
        require(rewardPool >= amount, "Insufficient reward pool");
        
        rewardPool -= amount;
        emergencyReservePool += amount;
        
        emit EmergencyReserveActivated(amount, reason);
    }
    
    /**
     * @dev Get liquidity pool status
     */
    function getLiquidityPoolStatus() external view returns (
        uint256 flightPool,
        uint256 emergencyReserve,
        uint256 activeFlights,
        uint256 totalPoolBalance
    ) {
        return (
            flightLiquidityPool,
            emergencyReservePool,
            activeFlightOperations,
            rewardPool
        );
    }
    
    /**
     * @dev Update coherence with dynamic bonus payout
     * Enhanced to trigger dynamic payouts when threshold is met
     */
    function updateCoherenceWithBonus(address user, uint256 coherenceScore) external nonReentrant {
        require(authorizedVerifiers[msg.sender] || msg.sender == owner(), "Unauthorized");
        require(coherenceScore <= 100, "Invalid coherence score");
        require(stakes[user].amount > 0, "No stake found");
        
        uint256 previousScore = stakes[user].coherenceScore;
        stakes[user].coherenceScore = coherenceScore;
        
        emit CoherenceUpdated(user, coherenceScore);
        
        // If coherence crosses threshold (95%), trigger bonus payout
        if (previousScore < COHERENCE_THRESHOLD && coherenceScore >= COHERENCE_THRESHOLD) {
            // Calculate instant bonus (1% of stake)
            uint256 bonus = stakes[user].amount / 100;
            if (bonus > 0 && rewardPool >= bonus) {
                rewardPool -= bonus;
                require(medairToken.transfer(user, bonus), "Bonus transfer failed");
                emit RewardsClaimed(user, bonus);
            }
        }
    }
}
