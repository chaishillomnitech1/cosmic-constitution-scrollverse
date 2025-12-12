// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

/**
 * @title ScrollVerseDAO
 * @dev DAO governance contract for NFT cleanup and community decision-making
 * NFT holders can vote on proposals for asset management
 */
contract ScrollVerseDAO is Ownable {
    
    // Proposal structure
    struct Proposal {
        uint256 id;
        string title;
        string description;
        address proposer;
        uint256 startTime;
        uint256 endTime;
        uint256 votesFor;
        uint256 votesAgainst;
        bool executed;
        bool passed;
        ProposalType proposalType;
        bytes proposalData;
    }
    
    // Proposal types
    enum ProposalType { NFT_CLEANUP, PARAMETER_CHANGE, TREASURY_ACTION, OTHER }
    
    // Voting state for each address on each proposal
    mapping(uint256 => mapping(address => bool)) public hasVoted;
    mapping(uint256 => mapping(address => bool)) public voteChoice; // true = for, false = against
    
    // Proposals storage
    mapping(uint256 => Proposal) public proposals;
    uint256 public proposalCount;
    
    // NFT contract for voting weight
    IERC721 public nftContract;
    
    // Governance parameters
    uint256 public votingPeriod = 7 days;
    uint256 public quorumPercentage = 20; // 20% of total NFT supply
    uint256 public proposalThreshold = 1; // Minimum NFTs to create proposal
    
    // Events
    event ProposalCreated(
        uint256 indexed proposalId,
        address indexed proposer,
        string title,
        ProposalType proposalType,
        uint256 endTime
    );
    
    event VoteCast(
        uint256 indexed proposalId,
        address indexed voter,
        bool support,
        uint256 weight
    );
    
    event ProposalExecuted(uint256 indexed proposalId, bool passed);
    
    event ParameterUpdated(string parameter, uint256 newValue);
    
    constructor(address _nftContract) Ownable(msg.sender) {
        require(_nftContract != address(0), "Invalid NFT contract");
        nftContract = IERC721(_nftContract);
    }
    
    /**
     * @dev Create a new proposal
     * @param title Proposal title
     * @param description Proposal description
     * @param proposalType Type of proposal
     * @param proposalData Encoded proposal data
     */
    function createProposal(
        string memory title,
        string memory description,
        ProposalType proposalType,
        bytes memory proposalData
    ) public returns (uint256) {
        require(
            nftContract.balanceOf(msg.sender) >= proposalThreshold,
            "Insufficient NFTs to create proposal"
        );
        require(bytes(title).length > 0, "Title cannot be empty");
        
        uint256 proposalId = proposalCount;
        proposalCount++;
        
        proposals[proposalId] = Proposal({
            id: proposalId,
            title: title,
            description: description,
            proposer: msg.sender,
            startTime: block.timestamp,
            endTime: block.timestamp + votingPeriod,
            votesFor: 0,
            votesAgainst: 0,
            executed: false,
            passed: false,
            proposalType: proposalType,
            proposalData: proposalData
        });
        
        emit ProposalCreated(
            proposalId,
            msg.sender,
            title,
            proposalType,
            block.timestamp + votingPeriod
        );
        
        return proposalId;
    }
    
    /**
     * @dev Cast vote on a proposal
     * @param proposalId Proposal ID
     * @param support True for 'for', false for 'against'
     */
    function castVote(uint256 proposalId, bool support) public {
        require(proposalId < proposalCount, "Proposal does not exist");
        
        Proposal storage proposal = proposals[proposalId];
        
        require(block.timestamp < proposal.endTime, "Voting period has ended");
        require(!hasVoted[proposalId][msg.sender], "Already voted");
        
        uint256 votingWeight = nftContract.balanceOf(msg.sender);
        require(votingWeight > 0, "No voting power");
        
        hasVoted[proposalId][msg.sender] = true;
        voteChoice[proposalId][msg.sender] = support;
        
        if (support) {
            proposal.votesFor += votingWeight;
        } else {
            proposal.votesAgainst += votingWeight;
        }
        
        emit VoteCast(proposalId, msg.sender, support, votingWeight);
    }
    
    /**
     * @dev Execute a proposal after voting period
     * @param proposalId Proposal ID
     */
    function executeProposal(uint256 proposalId) public {
        require(proposalId < proposalCount, "Proposal does not exist");
        
        Proposal storage proposal = proposals[proposalId];
        
        require(block.timestamp >= proposal.endTime, "Voting period not ended");
        require(!proposal.executed, "Proposal already executed");
        
        uint256 totalVotes = proposal.votesFor + proposal.votesAgainst;
        uint256 totalSupply = getTotalNFTSupply();
        
        // Check if quorum is reached
        bool quorumReached = (totalVotes * 100) >= (totalSupply * quorumPercentage);
        
        // Check if proposal passed
        proposal.passed = quorumReached && (proposal.votesFor > proposal.votesAgainst);
        proposal.executed = true;
        
        emit ProposalExecuted(proposalId, proposal.passed);
        
        // Execute proposal action if passed
        if (proposal.passed) {
            _executeProposalAction(proposalId);
        }
    }
    
    /**
     * @dev Internal function to execute proposal action
     * @param proposalId Proposal ID
     */
    function _executeProposalAction(uint256 proposalId) internal {
        Proposal storage proposal = proposals[proposalId];
        
        if (proposal.proposalType == ProposalType.NFT_CLEANUP) {
            // NFT cleanup logic can be implemented here
            // For example: burn specific NFTs, transfer to treasury, etc.
        } else if (proposal.proposalType == ProposalType.PARAMETER_CHANGE) {
            // Decode and apply parameter changes
            // Example: update voting period, quorum percentage, etc.
        } else if (proposal.proposalType == ProposalType.TREASURY_ACTION) {
            // Treasury action logic
        }
        
        // Note: Specific implementations depend on requirements
    }
    
    /**
     * @dev Update voting period
     * @param newPeriod New voting period in seconds
     */
    function setVotingPeriod(uint256 newPeriod) public onlyOwner {
        require(newPeriod > 0, "Invalid voting period");
        votingPeriod = newPeriod;
        emit ParameterUpdated("votingPeriod", newPeriod);
    }
    
    /**
     * @dev Update quorum percentage
     * @param newQuorum New quorum percentage (0-100)
     */
    function setQuorumPercentage(uint256 newQuorum) public onlyOwner {
        require(newQuorum > 0 && newQuorum <= 100, "Invalid quorum");
        quorumPercentage = newQuorum;
        emit ParameterUpdated("quorumPercentage", newQuorum);
    }
    
    /**
     * @dev Update proposal threshold
     * @param newThreshold New proposal threshold
     */
    function setProposalThreshold(uint256 newThreshold) public onlyOwner {
        require(newThreshold > 0, "Invalid threshold");
        proposalThreshold = newThreshold;
        emit ParameterUpdated("proposalThreshold", newThreshold);
    }
    
    /**
     * @dev Get proposal details
     * @param proposalId Proposal ID
     */
    function getProposal(uint256 proposalId) public view returns (Proposal memory) {
        require(proposalId < proposalCount, "Proposal does not exist");
        return proposals[proposalId];
    }
    
    /**
     * @dev Get total NFT supply for quorum calculation
     */
    function getTotalNFTSupply() public view returns (uint256) {
        // This should be implemented based on the actual NFT contract
        // For now, returning a placeholder
        return 1000;
    }
    
    /**
     * @dev Check if proposal has reached quorum
     * @param proposalId Proposal ID
     */
    function hasReachedQuorum(uint256 proposalId) public view returns (bool) {
        require(proposalId < proposalCount, "Proposal does not exist");
        
        Proposal storage proposal = proposals[proposalId];
        uint256 totalVotes = proposal.votesFor + proposal.votesAgainst;
        uint256 totalSupply = getTotalNFTSupply();
        
        return (totalVotes * 100) >= (totalSupply * quorumPercentage);
    }
    
    /**
     * @dev Get voting status for an address on a proposal
     * @param proposalId Proposal ID
     * @param voter Voter address
     */
    function getVotingStatus(uint256 proposalId, address voter) 
        public 
        view 
        returns (bool voted, bool support, uint256 weight) 
    {
        voted = hasVoted[proposalId][voter];
        support = voteChoice[proposalId][voter];
        weight = nftContract.balanceOf(voter);
    }
}
