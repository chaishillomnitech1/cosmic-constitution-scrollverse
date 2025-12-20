// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title MedAirOracle
 * @dev Chainlink-compatible oracle for real-time coherence metrics
 * Automates staking payouts and validates governance decisions
 */
contract MedAirOracle is Ownable, ReentrancyGuard {
    struct CoherenceData {
        uint256 coherenceScore;      // 0-100
        uint256 frequencyAlignment;   // 0-100
        uint256 timestamp;
        bool validated;
    }
    
    struct GovernanceMetric {
        uint256 participationRate;   // 0-100
        uint256 quorumReached;        // Boolean as 0 or 1
        uint256 consensusScore;       // 0-100
        uint256 timestamp;
    }
    
    mapping(address => CoherenceData) public coherenceData;
    mapping(uint256 => GovernanceMetric) public governanceMetrics; // proposalId => metrics
    
    mapping(address => bool) public authorizedReporters;
    address public stakingContract;
    address public daoContract;
    
    uint256 public updateCount;
    uint256 public constant ALIGNMENT_THRESHOLD = 95; // 95% for bonus
    
    event CoherenceUpdated(address indexed user, uint256 coherenceScore, uint256 frequencyAlignment);
    event GovernanceMetricUpdated(uint256 indexed proposalId, uint256 participationRate, uint256 consensusScore);
    event ReporterAdded(address indexed reporter);
    event ReporterRemoved(address indexed reporter);
    event StakingContractUpdated(address indexed newContract);
    event DAOContractUpdated(address indexed newContract);
    
    constructor(address initialOwner) Ownable(initialOwner) {}
    
    /**
     * @dev Add authorized reporter (e.g., Chainlink node)
     */
    function addReporter(address reporter) external onlyOwner {
        require(reporter != address(0), "Invalid reporter");
        authorizedReporters[reporter] = true;
        emit ReporterAdded(reporter);
    }
    
    /**
     * @dev Remove authorized reporter
     */
    function removeReporter(address reporter) external onlyOwner {
        authorizedReporters[reporter] = false;
        emit ReporterRemoved(reporter);
    }
    
    /**
     * @dev Set staking contract address
     */
    function setStakingContract(address _stakingContract) external onlyOwner {
        require(_stakingContract != address(0), "Invalid address");
        stakingContract = _stakingContract;
        emit StakingContractUpdated(_stakingContract);
    }
    
    /**
     * @dev Set DAO contract address
     */
    function setDAOContract(address _daoContract) external onlyOwner {
        require(_daoContract != address(0), "Invalid address");
        daoContract = _daoContract;
        emit DAOContractUpdated(_daoContract);
    }
    
    /**
     * @dev Update coherence data for a user (authorized reporters only)
     */
    function updateCoherence(
        address user,
        uint256 coherenceScore,
        uint256 frequencyAlignment
    ) external nonReentrant {
        require(authorizedReporters[msg.sender] || msg.sender == owner(), "Unauthorized");
        require(coherenceScore <= 100, "Invalid coherence score");
        require(frequencyAlignment <= 100, "Invalid frequency alignment");
        
        coherenceData[user] = CoherenceData({
            coherenceScore: coherenceScore,
            frequencyAlignment: frequencyAlignment,
            timestamp: block.timestamp,
            validated: true
        });
        
        updateCount++;
        
        emit CoherenceUpdated(user, coherenceScore, frequencyAlignment);
        
        // If staking contract is set and alignment meets threshold, update it
        if (stakingContract != address(0) && frequencyAlignment >= ALIGNMENT_THRESHOLD) {
            (bool success,) = stakingContract.call(
                abi.encodeWithSignature("updateCoherence(address,uint256)", user, coherenceScore)
            );
            require(success, "Staking update failed");
        }
    }
    
    /**
     * @dev Update governance metrics for a proposal
     */
    function updateGovernanceMetric(
        uint256 proposalId,
        uint256 participationRate,
        uint256 quorumReached,
        uint256 consensusScore
    ) external nonReentrant {
        require(authorizedReporters[msg.sender] || msg.sender == owner(), "Unauthorized");
        require(participationRate <= 100, "Invalid participation rate");
        require(quorumReached <= 1, "Invalid quorum status");
        require(consensusScore <= 100, "Invalid consensus score");
        
        governanceMetrics[proposalId] = GovernanceMetric({
            participationRate: participationRate,
            quorumReached: quorumReached,
            consensusScore: consensusScore,
            timestamp: block.timestamp
        });
        
        emit GovernanceMetricUpdated(proposalId, participationRate, consensusScore);
    }
    
    /**
     * @dev Get coherence data for a user
     */
    function getCoherence(address user) external view returns (
        uint256 coherenceScore,
        uint256 frequencyAlignment,
        uint256 timestamp,
        bool validated
    ) {
        CoherenceData memory data = coherenceData[user];
        return (data.coherenceScore, data.frequencyAlignment, data.timestamp, data.validated);
    }
    
    /**
     * @dev Get governance metrics for a proposal
     */
    function getGovernanceMetric(uint256 proposalId) external view returns (
        uint256 participationRate,
        uint256 quorumReached,
        uint256 consensusScore,
        uint256 timestamp
    ) {
        GovernanceMetric memory metric = governanceMetrics[proposalId];
        return (metric.participationRate, metric.quorumReached, metric.consensusScore, metric.timestamp);
    }
    
    /**
     * @dev Check if user meets alignment threshold for bonus
     */
    function meetsAlignmentThreshold(address user) external view returns (bool) {
        return coherenceData[user].frequencyAlignment >= ALIGNMENT_THRESHOLD;
    }
    
    /**
     * @dev Batch update coherence for multiple users
     */
    function batchUpdateCoherence(
        address[] calldata users,
        uint256[] calldata coherenceScores,
        uint256[] calldata frequencyAlignments
    ) external nonReentrant {
        require(authorizedReporters[msg.sender] || msg.sender == owner(), "Unauthorized");
        require(users.length == coherenceScores.length, "Array length mismatch");
        require(users.length == frequencyAlignments.length, "Array length mismatch");
        
        for (uint256 i = 0; i < users.length; i++) {
            coherenceData[users[i]] = CoherenceData({
                coherenceScore: coherenceScores[i],
                frequencyAlignment: frequencyAlignments[i],
                timestamp: block.timestamp,
                validated: true
            });
            
            emit CoherenceUpdated(users[i], coherenceScores[i], frequencyAlignments[i]);
        }
        
        updateCount += users.length;
    }
}
