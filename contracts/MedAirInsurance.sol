// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

/**
 * @title MedAirInsurance
 * @dev Tokenized insurance payouts leveraging $MEDAIR liquidity pools
 * Enables smart contract-based insurance claims for emergency medical transport
 */
contract MedAirInsurance is Ownable, ReentrancyGuard {
    IERC20 public medairToken;
    
    enum ClaimStatus {
        PENDING,
        APPROVED,
        REJECTED,
        PAID
    }
    
    struct InsurancePolicy {
        address policyholder;
        uint256 coverageAmount;
        uint256 premium;
        uint256 startDate;
        uint256 endDate;
        bool active;
    }
    
    struct InsuranceClaim {
        uint256 policyId;
        address claimant;
        uint256 claimAmount;
        string claimDetails;
        uint256 timestamp;
        ClaimStatus status;
        address verifier;
    }
    
    mapping(uint256 => InsurancePolicy) public policies;
    mapping(uint256 => InsuranceClaim) public claims;
    mapping(address => bool) public authorizedVerifiers;
    
    uint256 public nextPolicyId = 1;
    uint256 public nextClaimId = 1;
    uint256 public liquidityPool;
    uint256 public totalPremiums;
    uint256 public totalPayouts;
    
    event PolicyCreated(uint256 indexed policyId, address indexed policyholder, uint256 coverageAmount);
    event PremiumPaid(uint256 indexed policyId, uint256 amount);
    event ClaimSubmitted(uint256 indexed claimId, uint256 indexed policyId, uint256 amount);
    event ClaimApproved(uint256 indexed claimId, address indexed verifier);
    event ClaimRejected(uint256 indexed claimId, address indexed verifier, string reason);
    event ClaimPaid(uint256 indexed claimId, uint256 amount);
    event VerifierAdded(address indexed verifier);
    event VerifierRemoved(address indexed verifier);
    event LiquidityAdded(uint256 amount);
    
    constructor(address _medairToken, address initialOwner) Ownable(initialOwner) {
        require(_medairToken != address(0), "Invalid token address");
        medairToken = IERC20(_medairToken);
    }
    
    /**
     * @dev Add authorized claim verifier
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
     * @dev Create a new insurance policy
     */
    function createPolicy(
        uint256 coverageAmount,
        uint256 premium,
        uint256 duration
    ) external nonReentrant returns (uint256) {
        require(coverageAmount > 0, "Invalid coverage amount");
        require(premium > 0, "Invalid premium");
        
        uint256 policyId = nextPolicyId++;
        
        policies[policyId] = InsurancePolicy({
            policyholder: msg.sender,
            coverageAmount: coverageAmount,
            premium: premium,
            startDate: block.timestamp,
            endDate: block.timestamp + duration,
            active: true
        });
        
        // Transfer premium
        require(medairToken.transferFrom(msg.sender, address(this), premium), "Premium transfer failed");
        liquidityPool += premium;
        totalPremiums += premium;
        
        emit PolicyCreated(policyId, msg.sender, coverageAmount);
        emit PremiumPaid(policyId, premium);
        
        return policyId;
    }
    
    /**
     * @dev Submit an insurance claim
     */
    function submitClaim(
        uint256 policyId,
        uint256 claimAmount,
        string calldata claimDetails
    ) external nonReentrant returns (uint256) {
        InsurancePolicy storage policy = policies[policyId];
        
        require(policy.policyholder == msg.sender, "Not policy holder");
        require(policy.active, "Policy not active");
        require(block.timestamp >= policy.startDate && block.timestamp <= policy.endDate, "Policy expired");
        require(claimAmount <= policy.coverageAmount, "Claim exceeds coverage");
        
        uint256 claimId = nextClaimId++;
        
        claims[claimId] = InsuranceClaim({
            policyId: policyId,
            claimant: msg.sender,
            claimAmount: claimAmount,
            claimDetails: claimDetails,
            timestamp: block.timestamp,
            status: ClaimStatus.PENDING,
            verifier: address(0)
        });
        
        emit ClaimSubmitted(claimId, policyId, claimAmount);
        
        return claimId;
    }
    
    /**
     * @dev Approve a claim (verifiers only)
     */
    function approveClaim(uint256 claimId) external {
        require(authorizedVerifiers[msg.sender] || msg.sender == owner(), "Unauthorized");
        
        InsuranceClaim storage claim = claims[claimId];
        require(claim.status == ClaimStatus.PENDING, "Claim not pending");
        
        claim.status = ClaimStatus.APPROVED;
        claim.verifier = msg.sender;
        
        emit ClaimApproved(claimId, msg.sender);
        
        // Automatically process payout
        _processPayout(claimId);
    }
    
    /**
     * @dev Reject a claim (verifiers only)
     */
    function rejectClaim(uint256 claimId, string calldata reason) external {
        require(authorizedVerifiers[msg.sender] || msg.sender == owner(), "Unauthorized");
        
        InsuranceClaim storage claim = claims[claimId];
        require(claim.status == ClaimStatus.PENDING, "Claim not pending");
        
        claim.status = ClaimStatus.REJECTED;
        claim.verifier = msg.sender;
        
        emit ClaimRejected(claimId, msg.sender, reason);
    }
    
    /**
     * @dev Internal function to process payout
     */
    function _processPayout(uint256 claimId) internal {
        InsuranceClaim storage claim = claims[claimId];
        require(claim.status == ClaimStatus.APPROVED, "Claim not approved");
        require(liquidityPool >= claim.claimAmount, "Insufficient liquidity");
        
        liquidityPool -= claim.claimAmount;
        totalPayouts += claim.claimAmount;
        claim.status = ClaimStatus.PAID;
        
        require(medairToken.transfer(claim.claimant, claim.claimAmount), "Payout failed");
        
        emit ClaimPaid(claimId, claim.claimAmount);
    }
    
    /**
     * @dev Add liquidity to the insurance pool
     */
    function addLiquidity(uint256 amount) external nonReentrant {
        require(medairToken.transferFrom(msg.sender, address(this), amount), "Transfer failed");
        liquidityPool += amount;
        emit LiquidityAdded(amount);
    }
    
    /**
     * @dev Get policy details
     */
    function getPolicy(uint256 policyId) external view returns (
        address policyholder,
        uint256 coverageAmount,
        uint256 premium,
        uint256 startDate,
        uint256 endDate,
        bool active
    ) {
        InsurancePolicy storage policy = policies[policyId];
        return (
            policy.policyholder,
            policy.coverageAmount,
            policy.premium,
            policy.startDate,
            policy.endDate,
            policy.active
        );
    }
    
    /**
     * @dev Get claim details
     */
    function getClaim(uint256 claimId) external view returns (
        uint256 policyId,
        address claimant,
        uint256 claimAmount,
        string memory claimDetails,
        uint256 timestamp,
        ClaimStatus status,
        address verifier
    ) {
        InsuranceClaim storage claim = claims[claimId];
        return (
            claim.policyId,
            claim.claimant,
            claim.claimAmount,
            claim.claimDetails,
            claim.timestamp,
            claim.status,
            claim.verifier
        );
    }
    
    /**
     * @dev Get pool statistics
     */
    function getPoolStats() external view returns (
        uint256 currentLiquidity,
        uint256 totalPremiumsCollected,
        uint256 totalPayoutsMade,
        uint256 netBalance
    ) {
        return (
            liquidityPool,
            totalPremiums,
            totalPayouts,
            totalPremiums - totalPayouts
        );
    }
}
