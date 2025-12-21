// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";

/**
 * @title TruthLoom - Decentralized Transparency Framework
 * @notice A decentralized framework for transparency that aligns with ethical and legal guidelines
 * @dev Implements immutable ledger, proof-of-verification nodes, whistleblower protection, and victim compensation
 */
contract TruthLoom is AccessControl, ReentrancyGuard, Pausable {
    // Roles
    bytes32 public constant VERIFIER_ROLE = keccak256("VERIFIER_ROLE");
    bytes32 public constant LEGAL_ADMIN_ROLE = keccak256("LEGAL_ADMIN_ROLE");
    bytes32 public constant COMPENSATION_ADMIN_ROLE = keccak256("COMPENSATION_ADMIN_ROLE");
    
    // Data verification status
    enum VerificationStatus { Pending, Verified, Rejected, UnderReview }
    
    // Sensitivity levels for data protection
    enum SensitivityLevel { Public, Protected, HighlyConfidential }
    
    // Record structure for immutable data storage
    struct TransparencyRecord {
        bytes32 recordHash;           // Hash of the actual data (stored off-chain on IPFS/Arweave)
        string ipfsHash;              // IPFS/Arweave content identifier
        address submitter;            // Encrypted submitter address (for whistleblower protection)
        uint256 timestamp;
        VerificationStatus status;
        SensitivityLevel sensitivity;
        uint256 verificationCount;
        bool isActive;                // For regeneration protocol
        bytes encryptedVictimData;    // Encrypted victim information
    }
    
    // Verification node structure
    struct VerificationNode {
        address nodeAddress;
        uint256 reputationScore;
        uint256 totalVerifications;
        bool isActive;
        uint256 registeredAt;
    }
    
    // Victim compensation structure
    struct CompensationClaim {
        bytes32 recordId;
        bytes encryptedVictimIdentity;
        uint256 claimAmount;
        bool isPaid;
        uint256 claimedAt;
        uint256 paidAt;
    }
    
    // Legal case tracking
    struct LegalCase {
        bytes32 recordId;
        string caseNumber;
        uint256 openedAt;
        uint256 closedAt;
        bool isActive;
        string caseDetails;           // IPFS hash for case documentation
    }
    
    // Storage
    mapping(bytes32 => TransparencyRecord) public records;
    mapping(address => VerificationNode) public verificationNodes;
    mapping(bytes32 => mapping(address => bool)) public recordVerifications;
    mapping(uint256 => CompensationClaim) public compensationClaims;
    mapping(bytes32 => LegalCase) public legalCases;
    mapping(bytes32 => bytes32[]) public recordReplicas; // For regeneration protocol
    
    bytes32[] public recordIds;
    address[] public activeVerifiers;
    uint256 public compensationClaimCounter;
    uint256 public totalCompensationPool;
    
    // Configuration
    uint256 public minVerificationsRequired = 3;
    uint256 public verifierReputationThreshold = 100;
    
    // Events
    event RecordSubmitted(bytes32 indexed recordId, address indexed submitter, string ipfsHash);
    event RecordVerified(bytes32 indexed recordId, address indexed verifier, uint256 verificationCount);
    event RecordStatusChanged(bytes32 indexed recordId, VerificationStatus newStatus);
    event VerifierRegistered(address indexed verifier, uint256 timestamp);
    event VerifierDeactivated(address indexed verifier, uint256 timestamp);
    event CompensationClaimed(uint256 indexed claimId, bytes32 indexed recordId, uint256 amount);
    event CompensationPaid(uint256 indexed claimId, uint256 amount);
    event LegalCaseOpened(bytes32 indexed caseId, bytes32 indexed recordId, string caseNumber);
    event LegalCaseClosed(bytes32 indexed caseId, uint256 closedAt);
    event RecordReplicated(bytes32 indexed recordId, bytes32 replicaId);
    
    constructor() {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(LEGAL_ADMIN_ROLE, msg.sender);
        _grantRole(COMPENSATION_ADMIN_ROLE, msg.sender);
    }
    
    /**
     * @notice Submit a new transparency record with whistleblower protection
     * @param _ipfsHash IPFS/Arweave hash of the stored data
     * @param _sensitivity Sensitivity level of the data
     * @param _encryptedVictimData Encrypted victim information for protection
     * @return recordId The unique identifier for the record
     */
    function submitRecord(
        string memory _ipfsHash,
        SensitivityLevel _sensitivity,
        bytes memory _encryptedVictimData
    ) external whenNotPaused returns (bytes32) {
        bytes32 recordId = keccak256(abi.encodePacked(_ipfsHash, msg.sender, block.timestamp));
        
        require(records[recordId].timestamp == 0, "Record already exists");
        
        records[recordId] = TransparencyRecord({
            recordHash: keccak256(abi.encodePacked(_ipfsHash)),
            ipfsHash: _ipfsHash,
            submitter: msg.sender,
            timestamp: block.timestamp,
            status: VerificationStatus.Pending,
            sensitivity: _sensitivity,
            verificationCount: 0,
            isActive: true,
            encryptedVictimData: _encryptedVictimData
        });
        
        recordIds.push(recordId);
        
        emit RecordSubmitted(recordId, msg.sender, _ipfsHash);
        
        return recordId;
    }
    
    /**
     * @notice Verify a submitted record (Proof-of-Verification)
     * @param _recordId The record to verify
     */
    function verifyRecord(bytes32 _recordId) external onlyRole(VERIFIER_ROLE) whenNotPaused {
        TransparencyRecord storage record = records[_recordId];
        require(record.timestamp != 0, "Record does not exist");
        require(record.status == VerificationStatus.Pending || record.status == VerificationStatus.UnderReview, "Record not pending verification");
        require(!recordVerifications[_recordId][msg.sender], "Already verified by this node");
        require(verificationNodes[msg.sender].isActive, "Verifier not active");
        
        recordVerifications[_recordId][msg.sender] = true;
        record.verificationCount++;
        
        // Update verifier reputation
        verificationNodes[msg.sender].totalVerifications++;
        verificationNodes[msg.sender].reputationScore += 10;
        
        emit RecordVerified(_recordId, msg.sender, record.verificationCount);
        
        // Auto-approve if minimum verifications reached
        if (record.verificationCount >= minVerificationsRequired) {
            record.status = VerificationStatus.Verified;
            emit RecordStatusChanged(_recordId, VerificationStatus.Verified);
        }
    }
    
    /**
     * @notice Reject a record during verification
     * @param _recordId The record to reject
     */
    function rejectRecord(bytes32 _recordId) external onlyRole(VERIFIER_ROLE) whenNotPaused {
        TransparencyRecord storage record = records[_recordId];
        require(record.timestamp != 0, "Record does not exist");
        require(record.status == VerificationStatus.Pending || record.status == VerificationStatus.UnderReview, "Record not pending verification");
        
        record.status = VerificationStatus.Rejected;
        emit RecordStatusChanged(_recordId, VerificationStatus.Rejected);
    }
    
    /**
     * @notice Register a new verification node
     */
    function registerVerifier() external {
        require(!verificationNodes[msg.sender].isActive, "Already registered");
        
        verificationNodes[msg.sender] = VerificationNode({
            nodeAddress: msg.sender,
            reputationScore: verifierReputationThreshold,
            totalVerifications: 0,
            isActive: true,
            registeredAt: block.timestamp
        });
        
        activeVerifiers.push(msg.sender);
        _grantRole(VERIFIER_ROLE, msg.sender);
        
        emit VerifierRegistered(msg.sender, block.timestamp);
    }
    
    /**
     * @notice Deactivate a verification node (for quality control)
     */
    function deactivateVerifier(address _verifier) external onlyRole(DEFAULT_ADMIN_ROLE) {
        require(verificationNodes[_verifier].isActive, "Verifier not active");
        
        verificationNodes[_verifier].isActive = false;
        _revokeRole(VERIFIER_ROLE, _verifier);
        
        emit VerifierDeactivated(_verifier, block.timestamp);
    }
    
    /**
     * @notice Submit a compensation claim for victims
     * @param _recordId Related transparency record
     * @param _encryptedVictimIdentity Encrypted identity for verification
     * @param _claimAmount Requested compensation amount
     */
    function submitCompensationClaim(
        bytes32 _recordId,
        bytes memory _encryptedVictimIdentity,
        uint256 _claimAmount
    ) external whenNotPaused returns (uint256) {
        require(records[_recordId].timestamp != 0, "Record does not exist");
        require(records[_recordId].status == VerificationStatus.Verified, "Record not verified");
        
        uint256 claimId = compensationClaimCounter++;
        
        compensationClaims[claimId] = CompensationClaim({
            recordId: _recordId,
            encryptedVictimIdentity: _encryptedVictimIdentity,
            claimAmount: _claimAmount,
            isPaid: false,
            claimedAt: block.timestamp,
            paidAt: 0
        });
        
        emit CompensationClaimed(claimId, _recordId, _claimAmount);
        
        return claimId;
    }
    
    /**
     * @notice Process compensation payment to victims
     * @param _claimId The claim to process
     */
    function processCompensation(uint256 _claimId) external payable onlyRole(COMPENSATION_ADMIN_ROLE) nonReentrant {
        CompensationClaim storage claim = compensationClaims[_claimId];
        require(!claim.isPaid, "Claim already paid");
        require(claim.claimAmount > 0, "Invalid claim");
        require(msg.value >= claim.claimAmount, "Insufficient payment");
        
        claim.isPaid = true;
        claim.paidAt = block.timestamp;
        
        emit CompensationPaid(_claimId, claim.claimAmount);
    }
    
    /**
     * @notice Open a legal case related to a transparency record
     * @param _recordId The related record
     * @param _caseNumber Official case number
     * @param _caseDetails IPFS hash of case documentation
     */
    function openLegalCase(
        bytes32 _recordId,
        string memory _caseNumber,
        string memory _caseDetails
    ) external onlyRole(LEGAL_ADMIN_ROLE) returns (bytes32) {
        require(records[_recordId].timestamp != 0, "Record does not exist");
        require(records[_recordId].status == VerificationStatus.Verified, "Record not verified");
        
        bytes32 caseId = keccak256(abi.encodePacked(_recordId, _caseNumber, block.timestamp));
        
        legalCases[caseId] = LegalCase({
            recordId: _recordId,
            caseNumber: _caseNumber,
            openedAt: block.timestamp,
            closedAt: 0,
            isActive: true,
            caseDetails: _caseDetails
        });
        
        emit LegalCaseOpened(caseId, _recordId, _caseNumber);
        
        return caseId;
    }
    
    /**
     * @notice Close a legal case
     * @param _caseId The case to close
     */
    function closeLegalCase(bytes32 _caseId) external onlyRole(LEGAL_ADMIN_ROLE) {
        LegalCase storage legalCase = legalCases[_caseId];
        require(legalCase.isActive, "Case not active");
        
        legalCase.isActive = false;
        legalCase.closedAt = block.timestamp;
        
        emit LegalCaseClosed(_caseId, block.timestamp);
    }
    
    /**
     * @notice Replicate a record for regeneration protocol (censorship resistance)
     * @param _recordId The record to replicate
     * @param _replicaIpfsHash New IPFS hash for the replica
     */
    function replicateRecord(bytes32 _recordId, string memory _replicaIpfsHash) external onlyRole(VERIFIER_ROLE) {
        require(records[_recordId].timestamp != 0, "Record does not exist");
        require(records[_recordId].isActive, "Record not active");
        
        bytes32 replicaId = keccak256(abi.encodePacked(_replicaIpfsHash, block.timestamp));
        recordReplicas[_recordId].push(replicaId);
        
        emit RecordReplicated(_recordId, replicaId);
    }
    
    /**
     * @notice Fund the compensation pool
     */
    function fundCompensationPool() external payable {
        totalCompensationPool += msg.value;
    }
    
    /**
     * @notice Get record details
     * @param _recordId The record to query
     */
    function getRecord(bytes32 _recordId) external view returns (
        string memory ipfsHash,
        address submitter,
        uint256 timestamp,
        VerificationStatus status,
        SensitivityLevel sensitivity,
        uint256 verificationCount,
        bool isActive
    ) {
        TransparencyRecord memory record = records[_recordId];
        return (
            record.ipfsHash,
            record.submitter,
            record.timestamp,
            record.status,
            record.sensitivity,
            record.verificationCount,
            record.isActive
        );
    }
    
    /**
     * @notice Get all record IDs
     */
    function getAllRecordIds() external view returns (bytes32[] memory) {
        return recordIds;
    }
    
    /**
     * @notice Get record replicas for regeneration
     */
    function getRecordReplicas(bytes32 _recordId) external view returns (bytes32[] memory) {
        return recordReplicas[_recordId];
    }
    
    /**
     * @notice Get active verifiers
     */
    function getActiveVerifiers() external view returns (address[] memory) {
        return activeVerifiers;
    }
    
    /**
     * @notice Update minimum verifications required
     */
    function setMinVerifications(uint256 _min) external onlyRole(DEFAULT_ADMIN_ROLE) {
        minVerificationsRequired = _min;
    }
    
    /**
     * @notice Pause contract in emergency
     */
    function pause() external onlyRole(DEFAULT_ADMIN_ROLE) {
        _pause();
    }
    
    /**
     * @notice Unpause contract
     */
    function unpause() external onlyRole(DEFAULT_ADMIN_ROLE) {
        _unpause();
    }
    
    /**
     * @notice Withdraw excess funds (admin only)
     */
    function withdraw(uint256 _amount) external onlyRole(DEFAULT_ADMIN_ROLE) nonReentrant {
        require(_amount <= address(this).balance, "Insufficient balance");
        payable(msg.sender).transfer(_amount);
    }
    
    // Receive function to accept ETH
    receive() external payable {
        totalCompensationPool += msg.value;
    }
}
