// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title PhysicalAssetMachine3D
 * @dev Digital-to-material transformation framework for ScrollVerse
 * Integrates 3D physical asset machines with digital bloodline signatures
 */
contract PhysicalAssetMachine3D is ERC721, Ownable, ReentrancyGuard {
    
    struct Asset3D {
        uint256 assetId;
        string assetType; // "MANSION", "ARTIFACT", "COSMIC_STRUCTURE"
        string digitalBloodline;
        bytes32 materialSignature;
        string ipfsMetadata;
        uint256 dimensionalCoordinates;
        bool isMaterialized;
        uint256 creationTimestamp;
        uint256 materializationTimestamp;
    }
    
    struct MaterialTransformation {
        uint256 transformationId;
        uint256 assetId;
        string transformationType; // "DIGITAL_TO_PHYSICAL", "PHYSICAL_TO_DIGITAL", "QUANTUM_BRIDGE"
        bytes32 transformationHash;
        uint256 timestamp;
        bool isComplete;
    }
    
    struct DigitalBloodline {
        string bloodlineId;
        address creator;
        uint256 generationLevel;
        uint256[] connectedAssets;
        bool isActive;
    }
    
    // Storage
    mapping(uint256 => Asset3D) public assets;
    mapping(uint256 => MaterialTransformation) public transformations;
    mapping(string => DigitalBloodline) public bloodlines;
    mapping(address => uint256[]) public creatorAssets;
    
    uint256 public totalAssets;
    uint256 public totalTransformations;
    uint256 public materializedAssetCount;
    
    // Events
    event Asset3DCreated(uint256 indexed assetId, string assetType, string bloodlineId);
    event MaterializationInitiated(uint256 indexed assetId, uint256 transformationId);
    event MaterializationCompleted(uint256 indexed assetId, uint256 timestamp);
    event BloodlineEstablished(string bloodlineId, address creator, uint256 generationLevel);
    event QuantumBridgeActivated(uint256 indexed assetId, bytes32 transformationHash);
    
    constructor() ERC721("ScrollVerse3DAsset", "SV3D") Ownable(msg.sender) {
        totalAssets = 0;
        totalTransformations = 0;
        materializedAssetCount = 0;
    }
    
    /**
     * @dev Create a new 3D asset with digital bloodline
     */
    function create3DAsset(
        string memory _assetType,
        string memory _digitalBloodline,
        bytes32 _materialSignature,
        string memory _ipfsMetadata,
        uint256 _dimensionalCoordinates
    ) external nonReentrant returns (uint256) {
        uint256 assetId = totalAssets;
        
        assets[assetId] = Asset3D({
            assetId: assetId,
            assetType: _assetType,
            digitalBloodline: _digitalBloodline,
            materialSignature: _materialSignature,
            ipfsMetadata: _ipfsMetadata,
            dimensionalCoordinates: _dimensionalCoordinates,
            isMaterialized: false,
            creationTimestamp: block.timestamp,
            materializationTimestamp: 0
        });
        
        creatorAssets[msg.sender].push(assetId);
        
        // Add to bloodline
        bloodlines[_digitalBloodline].connectedAssets.push(assetId);
        
        totalAssets++;
        
        // Mint NFT
        _safeMint(msg.sender, assetId);
        
        emit Asset3DCreated(assetId, _assetType, _digitalBloodline);
        
        return assetId;
    }
    
    /**
     * @dev Establish a digital bloodline signature
     */
    function establishBloodline(
        string memory _bloodlineId,
        uint256 _generationLevel
    ) external returns (bool) {
        require(!bloodlines[_bloodlineId].isActive, "Bloodline already exists");
        
        bloodlines[_bloodlineId] = DigitalBloodline({
            bloodlineId: _bloodlineId,
            creator: msg.sender,
            generationLevel: _generationLevel,
            connectedAssets: new uint256[](0),
            isActive: true
        });
        
        emit BloodlineEstablished(_bloodlineId, msg.sender, _generationLevel);
        
        return true;
    }
    
    /**
     * @dev Initiate digital-to-material transformation
     */
    function initiateMaterialization(
        uint256 _assetId,
        string memory _transformationType,
        bytes32 _transformationHash
    ) external nonReentrant returns (uint256) {
        require(_assetId < totalAssets, "Asset does not exist");
        require(ownerOf(_assetId) == msg.sender, "Not asset owner");
        require(!assets[_assetId].isMaterialized, "Already materialized");
        
        uint256 transformationId = totalTransformations;
        
        transformations[transformationId] = MaterialTransformation({
            transformationId: transformationId,
            assetId: _assetId,
            transformationType: _transformationType,
            transformationHash: _transformationHash,
            timestamp: block.timestamp,
            isComplete: false
        });
        
        totalTransformations++;
        
        emit MaterializationInitiated(_assetId, transformationId);
        
        return transformationId;
    }
    
    /**
     * @dev Complete materialization process
     */
    function completeMaterialization(uint256 _transformationId) external onlyOwner {
        require(_transformationId < totalTransformations, "Transformation does not exist");
        require(!transformations[_transformationId].isComplete, "Already complete");
        
        transformations[_transformationId].isComplete = true;
        
        uint256 assetId = transformations[_transformationId].assetId;
        assets[assetId].isMaterialized = true;
        assets[assetId].materializationTimestamp = block.timestamp;
        
        materializedAssetCount++;
        
        emit MaterializationCompleted(assetId, block.timestamp);
    }
    
    /**
     * @dev Activate quantum bridge for asset
     */
    function activateQuantumBridge(uint256 _assetId, bytes32 _bridgeHash) external {
        require(_assetId < totalAssets, "Asset does not exist");
        require(ownerOf(_assetId) == msg.sender, "Not asset owner");
        
        emit QuantumBridgeActivated(_assetId, _bridgeHash);
    }
    
    /**
     * @dev Get asset details
     */
    function getAsset(uint256 _assetId) external view returns (
        string memory assetType,
        string memory digitalBloodline,
        string memory ipfsMetadata,
        uint256 dimensionalCoordinates,
        bool isMaterialized,
        uint256 creationTimestamp,
        uint256 materializationTimestamp
    ) {
        require(_assetId < totalAssets, "Asset does not exist");
        Asset3D memory asset = assets[_assetId];
        
        return (
            asset.assetType,
            asset.digitalBloodline,
            asset.ipfsMetadata,
            asset.dimensionalCoordinates,
            asset.isMaterialized,
            asset.creationTimestamp,
            asset.materializationTimestamp
        );
    }
    
    /**
     * @dev Get bloodline details
     */
    function getBloodline(string memory _bloodlineId) external view returns (
        address creator,
        uint256 generationLevel,
        uint256[] memory connectedAssets,
        bool isActive
    ) {
        DigitalBloodline memory bloodline = bloodlines[_bloodlineId];
        
        return (
            bloodline.creator,
            bloodline.generationLevel,
            bloodline.connectedAssets,
            bloodline.isActive
        );
    }
    
    /**
     * @dev Get all assets created by an address
     */
    function getCreatorAssets(address _creator) external view returns (uint256[] memory) {
        return creatorAssets[_creator];
    }
    
    /**
     * @dev Get transformation details
     */
    function getTransformation(uint256 _transformationId) external view returns (
        uint256 assetId,
        string memory transformationType,
        bytes32 transformationHash,
        uint256 timestamp,
        bool isComplete
    ) {
        require(_transformationId < totalTransformations, "Transformation does not exist");
        MaterialTransformation memory transformation = transformations[_transformationId];
        
        return (
            transformation.assetId,
            transformation.transformationType,
            transformation.transformationHash,
            transformation.timestamp,
            transformation.isComplete
        );
    }
    
    /**
     * @dev Get materialization statistics
     */
    function getMaterializationStats() external view returns (
        uint256 total,
        uint256 materialized,
        uint256 pending,
        uint256 completionRate
    ) {
        uint256 pending = totalAssets - materializedAssetCount;
        uint256 rate = totalAssets > 0 ? (materializedAssetCount * 100) / totalAssets : 0;
        
        return (totalAssets, materializedAssetCount, pending, rate);
    }
}
