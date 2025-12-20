// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title LegacyCoin
 * @dev $LEGACYCOIN - Token for historical music catalog tokenization
 * Backed by physical precious metals and cosmic materials with NFT utility integration
 */
contract LegacyCoin is ERC20, Ownable, ReentrancyGuard {
    
    // Asset backing metadata
    struct AssetBacking {
        uint256 preciousMetalsValue; // Value in wei of precious metals backing
        uint256 cosmicMaterialsValue; // Value in wei of cosmic materials
        string backingProofURI; // IPFS URI for proof of backing
        uint256 lastUpdated;
    }
    
    // Revenue stream tracking
    struct RevenueStream {
        string streamName;
        uint256 totalRevenue; // Total revenue generated in wei
        uint256 activeStakeholders;
        uint256 lastDistribution;
        bool isActive;
    }
    
    // Asset backing data
    AssetBacking public assetBacking;
    
    // Revenue streams mapping
    mapping(uint256 => RevenueStream) public revenueStreams;
    uint256 public revenueStreamCounter;
    
    // NFT rarity multipliers for token utility
    mapping(uint256 => uint256) public rarityMultipliers;
    
    // Total supply cap (can be adjusted based on asset backing)
    uint256 public maxSupply;
    
    // Events
    event AssetBackingUpdated(uint256 preciousMetalsValue, uint256 cosmicMaterialsValue, string proofURI);
    event RevenueStreamCreated(uint256 indexed streamId, string streamName);
    event RevenueDistributed(uint256 indexed streamId, uint256 amount, uint256 stakeholders);
    event TokensBurned(address indexed from, uint256 amount);
    event MaxSupplyUpdated(uint256 newMaxSupply);
    
    /**
     * @dev Constructor initializes $LEGACYCOIN with initial supply
     * @param initialSupply Initial token supply
     */
    constructor(uint256 initialSupply) ERC20("LegacyCoin", "LEGACYCOIN") Ownable(msg.sender) {
        maxSupply = initialSupply * 10; // Set max supply to 10x initial
        _mint(msg.sender, initialSupply * 10**decimals());
        
        // Initialize default rarity multipliers
        rarityMultipliers[0] = 100;  // COMMON: 1x
        rarityMultipliers[1] = 150;  // UNCOMMON: 1.5x
        rarityMultipliers[2] = 200;  // RARE: 2x
        rarityMultipliers[3] = 300;  // EPIC: 3x
        rarityMultipliers[4] = 500;  // LEGENDARY: 5x
        rarityMultipliers[5] = 1000; // PLATINUM (Beatles): 10x
        rarityMultipliers[6] = 2000; // COSMIC (Prince Vault): 20x
    }
    
    /**
     * @dev Update asset backing information
     * @param _preciousMetalsValue Value of precious metals backing
     * @param _cosmicMaterialsValue Value of cosmic materials backing
     * @param _proofURI IPFS URI for proof documentation
     */
    function updateAssetBacking(
        uint256 _preciousMetalsValue,
        uint256 _cosmicMaterialsValue,
        string memory _proofURI
    ) external onlyOwner {
        assetBacking = AssetBacking({
            preciousMetalsValue: _preciousMetalsValue,
            cosmicMaterialsValue: _cosmicMaterialsValue,
            backingProofURI: _proofURI,
            lastUpdated: block.timestamp
        });
        
        emit AssetBackingUpdated(_preciousMetalsValue, _cosmicMaterialsValue, _proofURI);
    }
    
    /**
     * @dev Create a new revenue stream
     * @param _streamName Name of the revenue stream
     */
    function createRevenueStream(string memory _streamName) external onlyOwner returns (uint256) {
        uint256 streamId = revenueStreamCounter++;
        
        revenueStreams[streamId] = RevenueStream({
            streamName: _streamName,
            totalRevenue: 0,
            activeStakeholders: 0,
            lastDistribution: block.timestamp,
            isActive: true
        });
        
        emit RevenueStreamCreated(streamId, _streamName);
        return streamId;
    }
    
    /**
     * @dev Record revenue for a stream
     * @param _streamId Revenue stream ID
     * @param _amount Revenue amount
     * @param _stakeholders Number of stakeholders receiving distribution
     */
    function recordRevenue(
        uint256 _streamId,
        uint256 _amount,
        uint256 _stakeholders
    ) external onlyOwner {
        require(revenueStreams[_streamId].isActive, "Revenue stream not active");
        
        revenueStreams[_streamId].totalRevenue += _amount;
        revenueStreams[_streamId].activeStakeholders = _stakeholders;
        revenueStreams[_streamId].lastDistribution = block.timestamp;
        
        emit RevenueDistributed(_streamId, _amount, _stakeholders);
    }
    
    /**
     * @dev Update rarity multiplier
     * @param _rarityLevel Rarity level (0-6)
     * @param _multiplier Multiplier value (100 = 1x, 200 = 2x, etc.)
     */
    function updateRarityMultiplier(uint256 _rarityLevel, uint256 _multiplier) external onlyOwner {
        require(_rarityLevel <= 6, "Invalid rarity level");
        require(_multiplier >= 100, "Multiplier must be at least 1x");
        rarityMultipliers[_rarityLevel] = _multiplier;
    }
    
    /**
     * @dev Mint additional tokens (only if under max supply)
     * @param _to Recipient address
     * @param _amount Amount to mint
     */
    function mint(address _to, uint256 _amount) external onlyOwner {
        require(totalSupply() + _amount <= maxSupply * 10**decimals(), "Exceeds max supply");
        _mint(_to, _amount);
    }
    
    /**
     * @dev Burn tokens to reduce supply
     * @param _amount Amount to burn
     */
    function burn(uint256 _amount) external {
        _burn(msg.sender, _amount);
        emit TokensBurned(msg.sender, _amount);
    }
    
    /**
     * @dev Update max supply (only increase allowed for asset backing expansion)
     * @param _newMaxSupply New maximum supply
     */
    function updateMaxSupply(uint256 _newMaxSupply) external onlyOwner {
        require(_newMaxSupply >= maxSupply, "Cannot decrease max supply");
        maxSupply = _newMaxSupply;
        emit MaxSupplyUpdated(_newMaxSupply);
    }
    
    /**
     * @dev Get total asset backing value
     * @return Total value of backing assets in wei
     */
    function getTotalBackingValue() external view returns (uint256) {
        return assetBacking.preciousMetalsValue + assetBacking.cosmicMaterialsValue;
    }
    
    /**
     * @dev Get revenue stream details
     * @param _streamId Revenue stream ID
     * @return RevenueStream struct with stream details
     */
    function getRevenueStream(uint256 _streamId) external view returns (RevenueStream memory) {
        return revenueStreams[_streamId];
    }
}
