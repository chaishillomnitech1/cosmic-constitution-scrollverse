// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title MansionChainDAO
 * @dev DAO governance for Mansion-Chain ecosystem with participative token conversion,
 * project tourism exhibitions, and NFT alignment lifecycle management
 */
contract MansionChainDAO is Ownable, ReentrancyGuard {
    
    // Proposal types
    enum ProposalType { 
        PROPERTY_ADDITION,
        CHRONICLE_CREATION,
        EXHIBITION_FUNDING,
        TOKEN_CONVERSION,
        POLICY_UPDATE,
        REVENUE_DISTRIBUTION
    }
    
    // Proposal status
    enum ProposalStatus {
        PENDING,
        ACTIVE,
        SUCCEEDED,
        DEFEATED,
        EXECUTED,
        CANCELLED
    }
    
    // Proposal structure
    struct Proposal {
        uint256 proposalId;
        address proposer;
        ProposalType proposalType;
        string title;
        string description;
        uint256 startTimestamp;
        uint256 endTimestamp;
        uint256 forVotes;
        uint256 againstVotes;
        uint256 abstainVotes;
        ProposalStatus status;
        bool executed;
        mapping(address => bool) hasVoted;
        mapping(address => uint256) voteWeight;
    }
    
    // Tourism exhibition structure
    struct TourismExhibition {
        uint256 exhibitionId;
        string name;
        string location;
        string description;
        uint256 fundingGoal;
        uint256 currentFunding;
        uint256 startDate;
        uint256 endDate;
        address[] contributors;
        mapping(address => uint256) contributions;
        bool isActive;
        bool isFunded;
    }
    
    // Participative token conversion
    struct TokenConversion {
        uint256 conversionId;
        address fromToken;
        address toToken;
        uint256 conversionRate; // Basis points (10000 = 1:1)
        uint256 minConversion;
        uint256 maxConversion;
        uint256 totalConverted;
        bool isActive;
    }
    
    // NFT alignment lifecycle
    struct NFTAlignment {
        uint256 nftTokenId;
        uint256 alignmentScore; // 0-10000 (0-100%)
        uint256 lifecycleStage; // 0=New, 1=Growing, 2=Mature, 3=Legacy
        uint256 lastUpdateTimestamp;
        uint256 totalEngagement;
        string[] achievements;
    }
    
    // Governance wallet structure
    struct GovernanceWallet {
        address walletAddress;
        uint256 votingPower;
        uint256 participationCount;
        uint256 contributionAmount;
        bool isActive;
        uint256 registrationTimestamp;
    }
    
    // Visual experimentation feature
    struct VisualExperiment {
        uint256 experimentId;
        string name;
        string description;
        string visualDataURI;
        address creator;
        uint256 votesReceived;
        bool isApproved;
        uint256 creationTimestamp;
    }
    
    // State variables
    mapping(uint256 => Proposal) private _proposals;
    uint256 private _proposalCounter;
    
    mapping(uint256 => TourismExhibition) private _exhibitions;
    uint256 private _exhibitionCounter;
    
    mapping(uint256 => TokenConversion) private _conversions;
    uint256 private _conversionCounter;
    
    mapping(uint256 => NFTAlignment) private _nftAlignments;
    
    mapping(address => GovernanceWallet) private _governanceWallets;
    address[] private _walletAddresses;
    
    mapping(uint256 => VisualExperiment) private _experiments;
    uint256 private _experimentCounter;
    
    // Voting parameters
    uint256 public votingPeriod = 7 days;
    uint256 public quorumPercentage = 4000; // 40%
    uint256 public proposalThreshold = 1000; // Minimum tokens to propose
    
    // Events
    event ProposalCreated(
        uint256 indexed proposalId,
        address indexed proposer,
        ProposalType proposalType,
        string title
    );
    
    event VoteCast(
        uint256 indexed proposalId,
        address indexed voter,
        bool support,
        uint256 weight
    );
    
    event ProposalExecuted(uint256 indexed proposalId);
    
    event ExhibitionCreated(
        uint256 indexed exhibitionId,
        string name,
        uint256 fundingGoal
    );
    
    event ExhibitionFunded(
        uint256 indexed exhibitionId,
        address indexed contributor,
        uint256 amount
    );
    
    event TokenConversionCreated(
        uint256 indexed conversionId,
        address fromToken,
        address toToken,
        uint256 rate
    );
    
    event TokensConverted(
        uint256 indexed conversionId,
        address indexed user,
        uint256 amount
    );
    
    event NFTAlignmentUpdated(
        uint256 indexed nftTokenId,
        uint256 alignmentScore,
        uint256 lifecycleStage
    );
    
    event GovernanceWalletLinked(
        address indexed walletAddress,
        uint256 votingPower
    );
    
    event VisualExperimentSubmitted(
        uint256 indexed experimentId,
        address indexed creator,
        string name
    );
    
    constructor() Ownable(msg.sender) {}
    
    /**
     * @dev Create a new proposal
     * @param proposalType Type of proposal
     * @param title Proposal title
     * @param description Proposal description
     */
    function createProposal(
        ProposalType proposalType,
        string memory title,
        string memory description
    ) public returns (uint256) {
        require(bytes(title).length > 0, "Title required");
        
        uint256 proposalId = _proposalCounter;
        _proposalCounter++;
        
        Proposal storage proposal = _proposals[proposalId];
        proposal.proposalId = proposalId;
        proposal.proposer = msg.sender;
        proposal.proposalType = proposalType;
        proposal.title = title;
        proposal.description = description;
        proposal.startTimestamp = block.timestamp;
        proposal.endTimestamp = block.timestamp + votingPeriod;
        proposal.status = ProposalStatus.ACTIVE;
        proposal.executed = false;
        
        emit ProposalCreated(proposalId, msg.sender, proposalType, title);
        
        return proposalId;
    }
    
    /**
     * @dev Vote on a proposal
     * @param proposalId Proposal ID
     * @param support Whether to support the proposal
     * @param weight Voting weight
     */
    function vote(uint256 proposalId, bool support, uint256 weight) public {
        Proposal storage proposal = _proposals[proposalId];
        require(proposal.status == ProposalStatus.ACTIVE, "Proposal not active");
        require(block.timestamp <= proposal.endTimestamp, "Voting ended");
        require(!proposal.hasVoted[msg.sender], "Already voted");
        
        proposal.hasVoted[msg.sender] = true;
        proposal.voteWeight[msg.sender] = weight;
        
        if (support) {
            proposal.forVotes += weight;
        } else {
            proposal.againstVotes += weight;
        }
        
        emit VoteCast(proposalId, msg.sender, support, weight);
    }
    
    /**
     * @dev Execute a proposal
     * @param proposalId Proposal ID
     */
    function executeProposal(uint256 proposalId) public onlyOwner {
        Proposal storage proposal = _proposals[proposalId];
        require(proposal.status == ProposalStatus.ACTIVE, "Proposal not active");
        require(block.timestamp > proposal.endTimestamp, "Voting not ended");
        require(!proposal.executed, "Already executed");
        
        // Check quorum and majority
        uint256 totalVotes = proposal.forVotes + proposal.againstVotes + proposal.abstainVotes;
        bool quorumReached = (totalVotes * 10000) / getTotalVotingPower() >= quorumPercentage;
        bool majorityReached = proposal.forVotes > proposal.againstVotes;
        
        if (quorumReached && majorityReached) {
            proposal.status = ProposalStatus.SUCCEEDED;
            proposal.executed = true;
            emit ProposalExecuted(proposalId);
        } else {
            proposal.status = ProposalStatus.DEFEATED;
        }
    }
    
    /**
     * @dev Create a tourism exhibition
     * @param name Exhibition name
     * @param location Exhibition location
     * @param description Exhibition description
     * @param fundingGoal Funding goal amount
     * @param startDate Start date
     * @param endDate End date
     */
    function createExhibition(
        string memory name,
        string memory location,
        string memory description,
        uint256 fundingGoal,
        uint256 startDate,
        uint256 endDate
    ) public onlyOwner returns (uint256) {
        require(bytes(name).length > 0, "Name required");
        require(fundingGoal > 0, "Funding goal required");
        require(endDate > startDate, "Invalid dates");
        
        uint256 exhibitionId = _exhibitionCounter;
        _exhibitionCounter++;
        
        TourismExhibition storage exhibition = _exhibitions[exhibitionId];
        exhibition.exhibitionId = exhibitionId;
        exhibition.name = name;
        exhibition.location = location;
        exhibition.description = description;
        exhibition.fundingGoal = fundingGoal;
        exhibition.currentFunding = 0;
        exhibition.startDate = startDate;
        exhibition.endDate = endDate;
        exhibition.isActive = true;
        exhibition.isFunded = false;
        
        emit ExhibitionCreated(exhibitionId, name, fundingGoal);
        
        return exhibitionId;
    }
    
    /**
     * @dev Contribute to an exhibition
     * @param exhibitionId Exhibition ID
     */
    function contributeToExhibition(uint256 exhibitionId) public payable {
        TourismExhibition storage exhibition = _exhibitions[exhibitionId];
        require(exhibition.isActive, "Exhibition not active");
        require(msg.value > 0, "Contribution required");
        
        if (exhibition.contributions[msg.sender] == 0) {
            exhibition.contributors.push(msg.sender);
        }
        
        exhibition.contributions[msg.sender] += msg.value;
        exhibition.currentFunding += msg.value;
        
        if (exhibition.currentFunding >= exhibition.fundingGoal) {
            exhibition.isFunded = true;
        }
        
        emit ExhibitionFunded(exhibitionId, msg.sender, msg.value);
    }
    
    /**
     * @dev Create a token conversion mechanism
     * @param fromToken Source token address
     * @param toToken Destination token address
     * @param conversionRate Conversion rate in basis points
     * @param minConversion Minimum conversion amount
     * @param maxConversion Maximum conversion amount
     */
    function createTokenConversion(
        address fromToken,
        address toToken,
        uint256 conversionRate,
        uint256 minConversion,
        uint256 maxConversion
    ) public onlyOwner returns (uint256) {
        require(fromToken != address(0) && toToken != address(0), "Invalid addresses");
        require(conversionRate > 0, "Rate required");
        
        uint256 conversionId = _conversionCounter;
        _conversionCounter++;
        
        _conversions[conversionId] = TokenConversion({
            conversionId: conversionId,
            fromToken: fromToken,
            toToken: toToken,
            conversionRate: conversionRate,
            minConversion: minConversion,
            maxConversion: maxConversion,
            totalConverted: 0,
            isActive: true
        });
        
        emit TokenConversionCreated(conversionId, fromToken, toToken, conversionRate);
        
        return conversionId;
    }
    
    /**
     * @dev Update NFT alignment lifecycle
     * @param nftTokenId NFT token ID
     * @param alignmentScore Alignment score (0-10000)
     * @param lifecycleStage Lifecycle stage
     * @param achievement Achievement to add
     */
    function updateNFTAlignment(
        uint256 nftTokenId,
        uint256 alignmentScore,
        uint256 lifecycleStage,
        string memory achievement
    ) public onlyOwner {
        require(alignmentScore <= 10000, "Score too high");
        require(lifecycleStage <= 3, "Invalid stage");
        
        NFTAlignment storage alignment = _nftAlignments[nftTokenId];
        alignment.nftTokenId = nftTokenId;
        alignment.alignmentScore = alignmentScore;
        alignment.lifecycleStage = lifecycleStage;
        alignment.lastUpdateTimestamp = block.timestamp;
        alignment.totalEngagement++;
        
        if (bytes(achievement).length > 0) {
            alignment.achievements.push(achievement);
        }
        
        emit NFTAlignmentUpdated(nftTokenId, alignmentScore, lifecycleStage);
    }
    
    /**
     * @dev Link governance wallet
     * @param walletAddress Wallet address
     * @param votingPower Initial voting power
     */
    function linkGovernanceWallet(address walletAddress, uint256 votingPower) public {
        require(walletAddress != address(0), "Invalid address");
        
        if (_governanceWallets[walletAddress].walletAddress == address(0)) {
            _walletAddresses.push(walletAddress);
        }
        
        _governanceWallets[walletAddress] = GovernanceWallet({
            walletAddress: walletAddress,
            votingPower: votingPower,
            participationCount: 0,
            contributionAmount: 0,
            isActive: true,
            registrationTimestamp: block.timestamp
        });
        
        emit GovernanceWalletLinked(walletAddress, votingPower);
    }
    
    /**
     * @dev Submit visual experiment
     * @param name Experiment name
     * @param description Description
     * @param visualDataURI Visual data URI
     */
    function submitVisualExperiment(
        string memory name,
        string memory description,
        string memory visualDataURI
    ) public returns (uint256) {
        require(bytes(name).length > 0, "Name required");
        
        uint256 experimentId = _experimentCounter;
        _experimentCounter++;
        
        _experiments[experimentId] = VisualExperiment({
            experimentId: experimentId,
            name: name,
            description: description,
            visualDataURI: visualDataURI,
            creator: msg.sender,
            votesReceived: 0,
            isApproved: false,
            creationTimestamp: block.timestamp
        });
        
        emit VisualExperimentSubmitted(experimentId, msg.sender, name);
        
        return experimentId;
    }
    
    /**
     * @dev Get total voting power
     */
    function getTotalVotingPower() public view returns (uint256) {
        uint256 total = 0;
        for (uint256 i = 0; i < _walletAddresses.length; i++) {
            if (_governanceWallets[_walletAddresses[i]].isActive) {
                total += _governanceWallets[_walletAddresses[i]].votingPower;
            }
        }
        return total;
    }
    
    /**
     * @dev Get proposal status
     * @param proposalId Proposal ID
     */
    function getProposalStatus(uint256 proposalId) public view returns (
        ProposalType proposalType,
        string memory title,
        ProposalStatus status,
        uint256 forVotes,
        uint256 againstVotes,
        bool executed
    ) {
        Proposal storage proposal = _proposals[proposalId];
        return (
            proposal.proposalType,
            proposal.title,
            proposal.status,
            proposal.forVotes,
            proposal.againstVotes,
            proposal.executed
        );
    }
    
    /**
     * @dev Get NFT alignment
     * @param nftTokenId NFT token ID
     */
    function getNFTAlignment(uint256 nftTokenId) public view returns (
        uint256 alignmentScore,
        uint256 lifecycleStage,
        uint256 totalEngagement,
        string[] memory achievements
    ) {
        NFTAlignment storage alignment = _nftAlignments[nftTokenId];
        return (
            alignment.alignmentScore,
            alignment.lifecycleStage,
            alignment.totalEngagement,
            alignment.achievements
        );
    }
    
    /**
     * @dev Withdraw contract balance
     */
    function withdraw() public onlyOwner {
        payable(owner()).transfer(address(this).balance);
    }
    
    receive() external payable {}
}
