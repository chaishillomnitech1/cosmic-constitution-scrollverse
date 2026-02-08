// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Votes.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Permit.sol";

/**
 * @title ScrollVerseGitHubToken
 * @dev $SGT token for ScrollVerse GitHub ecosystem
 * 144M supply with 963Hz-based encryption
 * Rewards for developers, employees, and young tech learners
 * Governance and staking mechanics enabled
 */
contract ScrollVerseGitHubToken is ERC20, ERC20Burnable, ERC20Votes, Ownable, Pausable {
    // Constants
    uint256 public constant MAX_SUPPLY = 144_000_000 * 10**18; // 144M tokens
    uint256 public constant FREQUENCY_963HZ = 963;
    
    // Allocation percentages (in basis points, 10000 = 100%)
    uint256 public constant DEVELOPER_POOL = 4000; // 40%
    uint256 public constant EMPLOYEE_POOL = 2000; // 20%
    uint256 public constant EDUCATION_POOL = 2000; // 20%
    uint256 public constant AI_MERIT_POOL = 1000; // 10%
    uint256 public constant TREASURY_POOL = 1000; // 10%
    
    // Reward structures
    struct GitHubReward {
        uint256 firstPRReward;
        uint256 starMilestoneReward;
        uint256 mergeReward;
        uint256 milestoneReward;
    }
    
    struct EducationReward {
        uint256 projectCompletionReward;
        uint256 achievementReward;
        uint256 monthlyActiveReward;
        uint256 scholarshipUnlockAmount;
    }
    
    struct StakingInfo {
        uint256 stakedAmount;
        uint256 stakingTimestamp;
        uint256 rewardDebt;
    }
    
    // State variables
    GitHubReward public githubReward;
    EducationReward public educationReward;
    
    mapping(address => bool) public isEmployee;
    mapping(address => bool) public hasClaimedFirstPR;
    mapping(address => uint256) public developerMilestones;
    mapping(address => StakingInfo) public stakingInfo;
    mapping(address => bool) public parentalWallets;
    mapping(address => address) public childToParent;
    
    // AI Merit economy
    mapping(address => uint256) public aiMeritScore;
    uint256 public totalAIMeritBurned;
    
    // Pool allocations
    uint256 public developerPoolBalance;
    uint256 public employeePoolBalance;
    uint256 public educationPoolBalance;
    uint256 public aiMeritPoolBalance;
    uint256 public treasuryPoolBalance;
    
    // Staking parameters
    uint256 public stakingAPY = 963; // 9.63% (in basis points)
    uint256 public totalStaked;
    
    // Events
    event DeveloperRewarded(address indexed developer, uint256 amount, string reason);
    event EmployeeTokenIssued(address indexed employee, uint256 amount);
    event EducationRewardClaimed(address indexed student, uint256 amount, string achievement);
    event TokensStaked(address indexed user, uint256 amount);
    event TokensUnstaked(address indexed user, uint256 amount);
    event StakingRewardClaimed(address indexed user, uint256 reward);
    event AITokensBurned(address indexed user, uint256 amount, uint256 meritScore);
    event ParentalWalletRegistered(address indexed parent, address indexed child);
    event ScholarshipUnlocked(address indexed student, uint256 amount);
    
    constructor(address initialOwner) 
        ERC20("ScrollVerse GitHub Token", "SGT") 
        ERC20Permit("ScrollVerse GitHub Token")
        Ownable(initialOwner) 
    {
        // Mint total supply to contract
        _mint(address(this), MAX_SUPPLY);
        
        // Allocate to pools
        developerPoolBalance = (MAX_SUPPLY * DEVELOPER_POOL) / 10000;
        employeePoolBalance = (MAX_SUPPLY * EMPLOYEE_POOL) / 10000;
        educationPoolBalance = (MAX_SUPPLY * EDUCATION_POOL) / 10000;
        aiMeritPoolBalance = (MAX_SUPPLY * AI_MERIT_POOL) / 10000;
        treasuryPoolBalance = (MAX_SUPPLY * TREASURY_POOL) / 10000;
        
        // Initialize reward structures
        githubReward = GitHubReward({
            firstPRReward: 100 * 10**18,
            starMilestoneReward: 50 * 10**18,
            mergeReward: 25 * 10**18,
            milestoneReward: 200 * 10**18
        });
        
        educationReward = EducationReward({
            projectCompletionReward: 50 * 10**18,
            achievementReward: 25 * 10**18,
            monthlyActiveReward: 10 * 10**18,
            scholarshipUnlockAmount: 1000 * 10**18
        });
    }
    
    // Developer rewards
    function rewardFirstPR(address developer) external onlyOwner whenNotPaused {
        require(!hasClaimedFirstPR[developer], "First PR already claimed");
        require(developerPoolBalance >= githubReward.firstPRReward, "Insufficient developer pool");
        
        hasClaimedFirstPR[developer] = true;
        developerPoolBalance -= githubReward.firstPRReward;
        
        _transfer(address(this), developer, githubReward.firstPRReward);
        emit DeveloperRewarded(developer, githubReward.firstPRReward, "First PR");
    }
    
    function rewardStarMilestone(address developer) external onlyOwner whenNotPaused {
        require(developerPoolBalance >= githubReward.starMilestoneReward, "Insufficient developer pool");
        
        developerPoolBalance -= githubReward.starMilestoneReward;
        _transfer(address(this), developer, githubReward.starMilestoneReward);
        
        emit DeveloperRewarded(developer, githubReward.starMilestoneReward, "Star Milestone");
    }
    
    function rewardMerge(address developer) external onlyOwner whenNotPaused {
        require(developerPoolBalance >= githubReward.mergeReward, "Insufficient developer pool");
        
        developerPoolBalance -= githubReward.mergeReward;
        _transfer(address(this), developer, githubReward.mergeReward);
        
        emit DeveloperRewarded(developer, githubReward.mergeReward, "PR Merged");
    }
    
    function rewardMilestone(address developer, uint256 milestoneId) external onlyOwner whenNotPaused {
        require(developerPoolBalance >= githubReward.milestoneReward, "Insufficient developer pool");
        
        developerMilestones[developer] = milestoneId;
        developerPoolBalance -= githubReward.milestoneReward;
        
        _transfer(address(this), developer, githubReward.milestoneReward);
        emit DeveloperRewarded(developer, githubReward.milestoneReward, "Milestone Reached");
    }
    
    // Employee immutable tokens
    function issueEmployeeToken(address employee, uint256 amount) external onlyOwner {
        require(employeePoolBalance >= amount, "Insufficient employee pool");
        require(!isEmployee[employee], "Already issued");
        
        isEmployee[employee] = true;
        employeePoolBalance -= amount;
        
        _transfer(address(this), employee, amount);
        emit EmployeeTokenIssued(employee, amount);
    }
    
    // Education rewards
    function registerParentalWallet(address parent, address child) external onlyOwner {
        require(parent != address(0) && child != address(0), "Invalid addresses");
        parentalWallets[parent] = true;
        childToParent[child] = parent;
        
        emit ParentalWalletRegistered(parent, child);
    }
    
    function rewardProjectCompletion(address student) external onlyOwner whenNotPaused {
        require(educationPoolBalance >= educationReward.projectCompletionReward, "Insufficient education pool");
        
        educationPoolBalance -= educationReward.projectCompletionReward;
        _transfer(address(this), student, educationReward.projectCompletionReward);
        
        emit EducationRewardClaimed(student, educationReward.projectCompletionReward, "Project Completed");
    }
    
    function rewardAchievement(address student) external onlyOwner whenNotPaused {
        require(educationPoolBalance >= educationReward.achievementReward, "Insufficient education pool");
        
        educationPoolBalance -= educationReward.achievementReward;
        _transfer(address(this), student, educationReward.achievementReward);
        
        emit EducationRewardClaimed(student, educationReward.achievementReward, "Achievement Unlocked");
    }
    
    function unlockScholarship(address student) external onlyOwner {
        require(balanceOf(student) >= educationReward.scholarshipUnlockAmount, "Insufficient tokens for scholarship");
        emit ScholarshipUnlocked(student, balanceOf(student));
    }
    
    // Staking mechanics
    function stake(uint256 amount) external whenNotPaused {
        require(amount > 0, "Cannot stake 0");
        require(balanceOf(msg.sender) >= amount, "Insufficient balance");
        
        // Claim pending rewards before staking
        if (stakingInfo[msg.sender].stakedAmount > 0) {
            _claimStakingReward();
        }
        
        _transfer(msg.sender, address(this), amount);
        
        stakingInfo[msg.sender].stakedAmount += amount;
        stakingInfo[msg.sender].stakingTimestamp = block.timestamp;
        totalStaked += amount;
        
        emit TokensStaked(msg.sender, amount);
    }
    
    function unstake(uint256 amount) external whenNotPaused {
        require(amount > 0, "Cannot unstake 0");
        require(stakingInfo[msg.sender].stakedAmount >= amount, "Insufficient staked balance");
        
        // Claim rewards before unstaking
        _claimStakingReward();
        
        stakingInfo[msg.sender].stakedAmount -= amount;
        totalStaked -= amount;
        
        _transfer(address(this), msg.sender, amount);
        emit TokensUnstaked(msg.sender, amount);
    }
    
    function claimStakingReward() external whenNotPaused {
        require(stakingInfo[msg.sender].stakedAmount > 0, "No staked tokens");
        _claimStakingReward();
    }
    
    function _claimStakingReward() internal {
        uint256 reward = calculateStakingReward(msg.sender);
        if (reward > 0 && developerPoolBalance >= reward) {
            stakingInfo[msg.sender].rewardDebt += reward;
            developerPoolBalance -= reward;
            
            _transfer(address(this), msg.sender, reward);
            emit StakingRewardClaimed(msg.sender, reward);
        }
    }
    
    function calculateStakingReward(address user) public view returns (uint256) {
        StakingInfo memory info = stakingInfo[user];
        if (info.stakedAmount == 0) return 0;
        
        uint256 stakingDuration = block.timestamp - info.stakingTimestamp;
        uint256 reward = (info.stakedAmount * stakingAPY * stakingDuration) / (365 days * 10000);
        
        return reward;
    }
    
    // AI Merit economy
    function burnForAIMerit(uint256 amount) external {
        require(amount > 0, "Cannot burn 0");
        require(balanceOf(msg.sender) >= amount, "Insufficient balance");
        
        _burn(msg.sender, amount);
        
        uint256 meritScore = amount / (10**18);
        aiMeritScore[msg.sender] += meritScore;
        totalAIMeritBurned += amount;
        
        emit AITokensBurned(msg.sender, amount, meritScore);
    }
    
    // Governance functions
    function updateGitHubRewards(
        uint256 firstPR,
        uint256 star,
        uint256 merge,
        uint256 milestone
    ) external onlyOwner {
        githubReward = GitHubReward({
            firstPRReward: firstPR,
            starMilestoneReward: star,
            mergeReward: merge,
            milestoneReward: milestone
        });
    }
    
    function updateEducationRewards(
        uint256 project,
        uint256 achievement,
        uint256 monthly,
        uint256 scholarship
    ) external onlyOwner {
        educationReward = EducationReward({
            projectCompletionReward: project,
            achievementReward: achievement,
            monthlyActiveReward: monthly,
            scholarshipUnlockAmount: scholarship
        });
    }
    
    function updateStakingAPY(uint256 newAPY) external onlyOwner {
        stakingAPY = newAPY;
    }
    
    // Emergency functions
    function pause() external onlyOwner {
        _pause();
    }
    
    function unpause() external onlyOwner {
        _unpause();
    }
    
    function withdrawTreasury(address to, uint256 amount) external onlyOwner {
        require(treasuryPoolBalance >= amount, "Insufficient treasury");
        treasuryPoolBalance -= amount;
        _transfer(address(this), to, amount);
    }
    
    // Required overrides
    function _update(address from, address to, uint256 value) 
        internal 
        override(ERC20, ERC20Votes) 
        whenNotPaused 
    {
        super._update(from, to, value);
    }
    
    function nonces(address owner)
        public
        view
        override(ERC20Permit, Nonces)
        returns (uint256)
    {
        return super.nonces(owner);
    }
}
