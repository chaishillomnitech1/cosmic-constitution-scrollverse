// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

/**
 * @title MedAirStaking
 * @dev Adaptive staking rewards with tier-based incentives
 * Supports pilots, medical professionals (FP-C/CFRN), and DAO members
 */
contract MedAirStaking is Ownable, ReentrancyGuard, Pausable {
    IERC20 public medairToken;
    IERC20 public sigilToken;
    
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
    }
    
    // Base APY rates (in basis points, 10000 = 100%)
    uint256 public constant BASE_APY = 1000; // 10%
    uint256 public constant PILOT_BONUS = 300; // +3%
    uint256 public constant MEDICAL_BONUS = 500; // +5%
    uint256 public constant DAO_BONUS = 200; // +2%
    uint256 public constant SIGIL_BONUS = 400; // +4%
    uint256 public constant COHERENCE_BONUS = 200; // +2% at 95%+ coherence
    uint256 public constant COHERENCE_THRESHOLD = 95; // 95% coherence for bonus
    
    mapping(address => StakeInfo) public stakes;
    mapping(address => bool) public authorizedVerifiers; // Can set tiers and coherence
    
    uint256 public totalStaked;
    uint256 public rewardPool;
    
    event Staked(address indexed user, uint256 amount, StakerTier tier);
    event Unstaked(address indexed user, uint256 amount);
    event RewardsClaimed(address indexed user, uint256 amount);
    event TierUpdated(address indexed user, StakerTier newTier);
    event CoherenceUpdated(address indexed user, uint256 coherenceScore);
    event VerifierAdded(address indexed verifier);
    event VerifierRemoved(address indexed verifier);
    event RewardPoolFunded(uint256 amount);
    
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
        
        return apy;
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
        uint256 effectiveAPY
    ) {
        StakeInfo storage userStake = stakes[user];
        return (
            userStake.amount,
            userStake.startTime,
            userStake.lastClaimTime,
            userStake.tier,
            userStake.coherenceScore,
            calculateRewards(user),
            getEffectiveAPY(user)
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
}
