// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

/**
 * @title MedAirDAO
 * @dev Immutable governance pipeline with zkEVM compatibility
 * Layer-Z DAO framework with 80% quorum-based auto-consensus
 */
contract MedAirDAO is Ownable, ReentrancyGuard {
    IERC20 public governanceToken; // $SIGIL token for voting
    
    enum ProposalState {
        PENDING,
        ACTIVE,
        SUCCEEDED,
        DEFEATED,
        EXECUTED,
        CANCELLED
    }
    
    enum ProposalType {
        GENERAL,
        FINANCIAL,
        PROTOCOL_UPGRADE,
        CROSS_CHAIN
    }
    
    struct Proposal {
        uint256 id;
        address proposer;
        string title;
        string description;
        ProposalType proposalType;
        uint256 startTime;
        uint256 endTime;
        uint256 forVotes;
        uint256 againstVotes;
        uint256 abstainVotes;
        ProposalState state;
        bool executed;
        bytes executionData;
        address targetContract;
    }
    
    struct Vote {
        bool hasVoted;
        bool support;
        uint256 votes;
        uint256 timestamp;
    }
    
    mapping(uint256 => Proposal) public proposals;
    mapping(uint256 => mapping(address => Vote)) public votes;
    mapping(address => bool) public crossChainBridges;
    
    uint256 public nextProposalId = 1;
    uint256 public votingPeriod = 7 days;
    uint256 public quorumPercentage = 80; // 80% quorum for auto-consensus
    uint256 public proposalThreshold = 1000 * 10**18; // 1000 tokens to propose
    uint256 public totalProposals;
    uint256 public executedProposals;
    
    event ProposalCreated(
        uint256 indexed proposalId,
        address indexed proposer,
        string title,
        ProposalType proposalType
    );
    event VoteCast(
        uint256 indexed proposalId,
        address indexed voter,
        bool support,
        uint256 votes
    );
    event ProposalExecuted(uint256 indexed proposalId);
    event ProposalCancelled(uint256 indexed proposalId);
    event QuorumUpdated(uint256 newQuorum);
    event CrossChainBridgeAdded(address indexed bridge);
    event CrossChainProposalSynced(uint256 indexed proposalId, address indexed bridge);
    
    constructor(address _governanceToken, address initialOwner) Ownable(initialOwner) {
        require(_governanceToken != address(0), "Invalid governance token");
        governanceToken = IERC20(_governanceToken);
    }
    
    /**
     * @dev Add cross-chain bridge for governance extension
     */
    function addCrossChainBridge(address bridge) external onlyOwner {
        require(bridge != address(0), "Invalid bridge address");
        crossChainBridges[bridge] = true;
        emit CrossChainBridgeAdded(bridge);
    }
    
    /**
     * @dev Remove cross-chain bridge
     */
    function removeCrossChainBridge(address bridge) external onlyOwner {
        crossChainBridges[bridge] = false;
    }
    
    /**
     * @dev Create a new proposal
     */
    function propose(
        string calldata title,
        string calldata description,
        ProposalType proposalType,
        address targetContract,
        bytes calldata executionData
    ) external nonReentrant returns (uint256) {
        require(
            governanceToken.balanceOf(msg.sender) >= proposalThreshold,
            "Insufficient tokens to propose"
        );
        
        uint256 proposalId = nextProposalId++;
        
        proposals[proposalId] = Proposal({
            id: proposalId,
            proposer: msg.sender,
            title: title,
            description: description,
            proposalType: proposalType,
            startTime: block.timestamp,
            endTime: block.timestamp + votingPeriod,
            forVotes: 0,
            againstVotes: 0,
            abstainVotes: 0,
            state: ProposalState.ACTIVE,
            executed: false,
            executionData: executionData,
            targetContract: targetContract
        });
        
        totalProposals++;
        
        emit ProposalCreated(proposalId, msg.sender, title, proposalType);
        
        return proposalId;
    }
    
    /**
     * @dev Cast a vote on a proposal
     */
    function castVote(uint256 proposalId, bool support) external nonReentrant {
        Proposal storage proposal = proposals[proposalId];
        require(proposal.state == ProposalState.ACTIVE, "Proposal not active");
        require(block.timestamp <= proposal.endTime, "Voting period ended");
        require(!votes[proposalId][msg.sender].hasVoted, "Already voted");
        
        uint256 votingPower = governanceToken.balanceOf(msg.sender);
        require(votingPower > 0, "No voting power");
        
        votes[proposalId][msg.sender] = Vote({
            hasVoted: true,
            support: support,
            votes: votingPower,
            timestamp: block.timestamp
        });
        
        if (support) {
            proposal.forVotes += votingPower;
        } else {
            proposal.againstVotes += votingPower;
        }
        
        emit VoteCast(proposalId, msg.sender, support, votingPower);
        
        // Check if quorum reached for auto-consensus
        _checkQuorum(proposalId);
    }
    
    /**
     * @dev Internal function to check quorum and trigger auto-consensus
     */
    function _checkQuorum(uint256 proposalId) internal {
        Proposal storage proposal = proposals[proposalId];
        
        uint256 totalVotes = proposal.forVotes + proposal.againstVotes + proposal.abstainVotes;
        uint256 totalSupply = governanceToken.totalSupply();
        
        // Calculate percentage of votes
        uint256 votePercentage = (totalVotes * 100) / totalSupply;
        
        if (votePercentage >= quorumPercentage) {
            // Auto-consensus reached
            if (proposal.forVotes > proposal.againstVotes) {
                proposal.state = ProposalState.SUCCEEDED;
            } else {
                proposal.state = ProposalState.DEFEATED;
            }
        }
    }
    
    /**
     * @dev Finalize proposal state after voting period
     */
    function finalizeProposal(uint256 proposalId) external {
        Proposal storage proposal = proposals[proposalId];
        require(proposal.state == ProposalState.ACTIVE, "Proposal not active");
        require(block.timestamp > proposal.endTime, "Voting still active");
        
        uint256 totalVotes = proposal.forVotes + proposal.againstVotes + proposal.abstainVotes;
        uint256 totalSupply = governanceToken.totalSupply();
        uint256 votePercentage = (totalVotes * 100) / totalSupply;
        
        if (votePercentage >= quorumPercentage && proposal.forVotes > proposal.againstVotes) {
            proposal.state = ProposalState.SUCCEEDED;
        } else {
            proposal.state = ProposalState.DEFEATED;
        }
    }
    
    /**
     * @dev Execute a successful proposal
     */
    function executeProposal(uint256 proposalId) external nonReentrant {
        Proposal storage proposal = proposals[proposalId];
        require(proposal.state == ProposalState.SUCCEEDED, "Proposal not succeeded");
        require(!proposal.executed, "Already executed");
        
        proposal.executed = true;
        proposal.state = ProposalState.EXECUTED;
        executedProposals++;
        
        // Execute the proposal if it has execution data
        if (proposal.executionData.length > 0 && proposal.targetContract != address(0)) {
            (bool success,) = proposal.targetContract.call(proposal.executionData);
            require(success, "Execution failed");
        }
        
        emit ProposalExecuted(proposalId);
    }
    
    /**
     * @dev Cancel a proposal (proposer or owner only)
     */
    function cancelProposal(uint256 proposalId) external {
        Proposal storage proposal = proposals[proposalId];
        require(
            msg.sender == proposal.proposer || msg.sender == owner(),
            "Unauthorized"
        );
        require(
            proposal.state == ProposalState.PENDING || proposal.state == ProposalState.ACTIVE,
            "Cannot cancel"
        );
        
        proposal.state = ProposalState.CANCELLED;
        emit ProposalCancelled(proposalId);
    }
    
    /**
     * @dev Sync proposal to cross-chain bridge
     */
    function syncProposalCrossChain(uint256 proposalId, address bridge) external {
        require(crossChainBridges[bridge], "Invalid bridge");
        Proposal storage proposal = proposals[proposalId];
        
        // Call bridge contract to sync proposal
        (bool success,) = bridge.call(
            abi.encodeWithSignature(
                "syncProposal(uint256,string,string,uint8,uint256,uint256)",
                proposalId,
                proposal.title,
                proposal.description,
                uint8(proposal.proposalType),
                proposal.startTime,
                proposal.endTime
            )
        );
        
        if (success) {
            emit CrossChainProposalSynced(proposalId, bridge);
        }
    }
    
    /**
     * @dev Update quorum percentage
     */
    function updateQuorum(uint256 newQuorum) external onlyOwner {
        require(newQuorum > 0 && newQuorum <= 100, "Invalid quorum");
        quorumPercentage = newQuorum;
        emit QuorumUpdated(newQuorum);
    }
    
    /**
     * @dev Get proposal details
     */
    function getProposal(uint256 proposalId) external view returns (
        address proposer,
        string memory title,
        string memory description,
        ProposalType proposalType,
        uint256 startTime,
        uint256 endTime,
        uint256 forVotes,
        uint256 againstVotes,
        ProposalState state,
        bool executed
    ) {
        Proposal storage proposal = proposals[proposalId];
        return (
            proposal.proposer,
            proposal.title,
            proposal.description,
            proposal.proposalType,
            proposal.startTime,
            proposal.endTime,
            proposal.forVotes,
            proposal.againstVotes,
            proposal.state,
            proposal.executed
        );
    }
    
    /**
     * @dev Get vote details for a user on a proposal
     */
    function getVote(uint256 proposalId, address voter) external view returns (
        bool hasVoted,
        bool support,
        uint256 votingPower,
        uint256 timestamp
    ) {
        Vote storage vote = votes[proposalId][voter];
        return (vote.hasVoted, vote.support, vote.votes, vote.timestamp);
    }
    
    /**
     * @dev Get DAO statistics
     */
    function getDAOStats() external view returns (
        uint256 totalProposalsCount,
        uint256 executedProposalsCount,
        uint256 currentQuorum,
        uint256 votingPeriodDays
    ) {
        return (
            totalProposals,
            executedProposals,
            quorumPercentage,
            votingPeriod / 1 days
        );
    }
    
    /**
     * @dev Check if proposal has reached quorum
     */
    function hasReachedQuorum(uint256 proposalId) external view returns (bool) {
        Proposal storage proposal = proposals[proposalId];
        uint256 totalVotes = proposal.forVotes + proposal.againstVotes + proposal.abstainVotes;
        uint256 totalSupply = governanceToken.totalSupply();
        uint256 votePercentage = (totalVotes * 100) / totalSupply;
        
        return votePercentage >= quorumPercentage;
    }
}
