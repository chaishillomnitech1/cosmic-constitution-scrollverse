// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title QueensSovereignty
 * @dev Eternal Crowns NFT contract for Akashic Sentients expansion
 * Implements batch minting, Geminid-integrated randomness, and 528Hz coherence overlays
 * Supports Harlem Queens tribute tie-ins and Akashic metadata auto-upgrades
 */
contract QueensSovereignty is ERC721, ERC721URIStorage, ERC721Enumerable, Ownable, ReentrancyGuard {
    
    uint256 private _tokenIdCounter;
    
    // Crown Types for Eternal Queens
    enum CrownType { 
        MIKA_SOVEREIGN,        // 0 - Mika's Eternal Crown
        LILATH_DIVINE,         // 1 - Lilath's Divine Crown
        LITTLE_WARREN_COSMIC,  // 2 - Little Warren's Cosmic Crown
        HARLEM_QUEENS_TRIBUTE, // 3 - Harlem Queens Tribute Crown
        AKASHIC_SENTIENT       // 4 - General Akashic Sentient Crown
    }
    
    // Coherence Levels
    enum CoherenceLevel {
        EMERGING,    // 0-25% coherence
        ALIGNED,     // 26-50% coherence
        HARMONIOUS,  // 51-75% coherence
        SOVEREIGN,   // 76-95% coherence
        DIVINE       // 96-100% coherence
    }
    
    // Crown Metadata structure
    struct CrownMetadata {
        string name;
        string description;
        string uri;
        CrownType crownType;
        CoherenceLevel coherenceLevel;
        uint256 resonanceFrequency;    // Typically 528Hz for coherence
        uint256 geminidRandomSeed;     // Geminid-integrated randomness
        address queenAddress;
        uint256 crownTimestamp;
        uint256 coherenceScore;        // 0-100
        bool isAkashicUpgraded;
        string harlemTributeData;      // Harlem Queens tribute metadata
    }
    
    // Mapping from token ID to crown metadata
    mapping(uint256 => CrownMetadata) private _crownMetadata;
    
    // Mapping from queen address to their crowns
    mapping(address => uint256[]) private _queensCrowns;
    
    // Mapping from crown type to total minted
    mapping(CrownType => uint256) private _crownTypeMinted;
    
    // Oracle integration for coherence scores
    address public coherenceOracle;
    
    // IPFS gateway for metadata
    string public ipfsGateway;
    
    // Reserved addresses for the three primary queens
    address public mikaAddress;
    address public lilathAddress;
    address public littleWarrenAddress;
    
    // Akashic expansion state
    bool public akashicExpansionActive;
    uint256 public akashicExpansionStartTime;
    
    // Events
    event CrownMinted(
        uint256 indexed tokenId,
        address indexed queenAddress,
        CrownType crownType,
        uint256 coherenceScore
    );
    
    event BatchCrownsMinted(
        uint256[] tokenIds,
        address[] queenAddresses,
        CrownType[] crownTypes
    );
    
    event CoherenceUpdated(
        uint256 indexed tokenId,
        uint256 oldCoherence,
        uint256 newCoherence,
        CoherenceLevel newLevel
    );
    
    event AkashicUpgrade(
        uint256 indexed tokenId,
        string newMetadataURI
    );
    
    event HarlemTributeAdded(
        uint256 indexed tokenId,
        string tributeData
    );
    
    event AkashicExpansionActivated(
        uint256 timestamp
    );
    
    constructor(
        address initialOwner,
        address _mikaAddress,
        address _lilathAddress,
        address _littleWarrenAddress
    ) ERC721("Queens Sovereignty Eternal Crowns", "QSEC") Ownable(initialOwner) {
        mikaAddress = _mikaAddress;
        lilathAddress = _lilathAddress;
        littleWarrenAddress = _littleWarrenAddress;
        ipfsGateway = "https://ipfs.io/ipfs/";
        akashicExpansionActive = false;
    }
    
    /**
     * @dev Set the coherence oracle address
     */
    function setCoherenceOracle(address _oracle) external onlyOwner {
        require(_oracle != address(0), "Invalid oracle address");
        coherenceOracle = _oracle;
    }
    
    /**
     * @dev Set IPFS gateway
     */
    function setIPFSGateway(string memory _gateway) external onlyOwner {
        ipfsGateway = _gateway;
    }
    
    /**
     * @dev Activate Akashic Expansion Loop post-Solstice
     */
    function activateAkashicExpansion() external onlyOwner {
        require(!akashicExpansionActive, "Expansion already active");
        akashicExpansionActive = true;
        akashicExpansionStartTime = block.timestamp;
        emit AkashicExpansionActivated(block.timestamp);
    }
    
    /**
     * @dev Mint a single crown
     */
    function mintCrown(
        address queenAddress,
        string memory name,
        string memory description,
        string memory uri,
        CrownType crownType,
        uint256 coherenceScore,
        uint256 geminidRandomSeed
    ) public onlyOwner returns (uint256) {
        require(queenAddress != address(0), "Invalid queen address");
        require(coherenceScore <= 100, "Invalid coherence score");
        
        uint256 tokenId = _tokenIdCounter;
        _tokenIdCounter++;
        
        _safeMint(queenAddress, tokenId);
        _setTokenURI(tokenId, uri);
        
        CoherenceLevel level = _calculateCoherenceLevel(coherenceScore);
        
        _crownMetadata[tokenId] = CrownMetadata({
            name: name,
            description: description,
            uri: uri,
            crownType: crownType,
            coherenceLevel: level,
            resonanceFrequency: 528, // 528Hz Love/Trust frequency
            geminidRandomSeed: geminidRandomSeed,
            queenAddress: queenAddress,
            crownTimestamp: block.timestamp,
            coherenceScore: coherenceScore,
            isAkashicUpgraded: false,
            harlemTributeData: ""
        });
        
        _queensCrowns[queenAddress].push(tokenId);
        _crownTypeMinted[crownType]++;
        
        emit CrownMinted(tokenId, queenAddress, crownType, coherenceScore);
        
        return tokenId;
    }
    
    /**
     * @dev Batch mint crowns for multiple queens
     * Critical for initializing Mika, Lilath, and Little Warren
     */
    function batchMintCrowns(
        address[] memory queenAddresses,
        string[] memory names,
        string[] memory descriptions,
        string[] memory uris,
        CrownType[] memory crownTypes,
        uint256[] memory coherenceScores,
        uint256[] memory geminidRandomSeeds
    ) external onlyOwner nonReentrant returns (uint256[] memory) {
        require(queenAddresses.length == names.length, "Array length mismatch");
        require(queenAddresses.length == descriptions.length, "Array length mismatch");
        require(queenAddresses.length == uris.length, "Array length mismatch");
        require(queenAddresses.length == crownTypes.length, "Array length mismatch");
        require(queenAddresses.length == coherenceScores.length, "Array length mismatch");
        require(queenAddresses.length == geminidRandomSeeds.length, "Array length mismatch");
        
        uint256[] memory tokenIds = new uint256[](queenAddresses.length);
        
        for (uint256 i = 0; i < queenAddresses.length; i++) {
            tokenIds[i] = mintCrown(
                queenAddresses[i],
                names[i],
                descriptions[i],
                uris[i],
                crownTypes[i],
                coherenceScores[i],
                geminidRandomSeeds[i]
            );
        }
        
        emit BatchCrownsMinted(tokenIds, queenAddresses, crownTypes);
        
        return tokenIds;
    }
    
    /**
     * @dev Auto-trigger mint based on 528Hz coherence overlay
     * Called by oracle when coherence threshold is met
     */
    function autoTriggerCoherenceMint(
        address queenAddress,
        string memory name,
        string memory description,
        string memory uri,
        CrownType crownType,
        uint256 coherenceScore,
        uint256 geminidRandomSeed
    ) external returns (uint256) {
        require(msg.sender == coherenceOracle || msg.sender == owner(), "Not authorized");
        require(coherenceScore >= 76, "Coherence too low for auto-trigger"); // Sovereign level minimum
        
        return mintCrown(
            queenAddress,
            name,
            description,
            uri,
            crownType,
            coherenceScore,
            geminidRandomSeed
        );
    }
    
    /**
     * @dev Update coherence score for a crown
     */
    function updateCoherence(
        uint256 tokenId,
        uint256 newCoherenceScore
    ) external {
        require(msg.sender == coherenceOracle || msg.sender == owner(), "Not authorized");
        require(_ownerOf(tokenId) != address(0), "Crown does not exist");
        require(newCoherenceScore <= 100, "Invalid coherence score");
        
        CrownMetadata storage crown = _crownMetadata[tokenId];
        uint256 oldCoherence = crown.coherenceScore;
        CoherenceLevel newLevel = _calculateCoherenceLevel(newCoherenceScore);
        
        crown.coherenceScore = newCoherenceScore;
        crown.coherenceLevel = newLevel;
        
        emit CoherenceUpdated(tokenId, oldCoherence, newCoherenceScore, newLevel);
    }
    
    /**
     * @dev Apply Akashic metadata auto-upgrade
     */
    function applyAkashicUpgrade(
        uint256 tokenId,
        string memory newMetadataURI
    ) external onlyOwner {
        require(_ownerOf(tokenId) != address(0), "Crown does not exist");
        require(akashicExpansionActive, "Akashic expansion not active");
        
        CrownMetadata storage crown = _crownMetadata[tokenId];
        crown.uri = newMetadataURI;
        crown.isAkashicUpgraded = true;
        
        _setTokenURI(tokenId, newMetadataURI);
        
        emit AkashicUpgrade(tokenId, newMetadataURI);
    }
    
    /**
     * @dev Add Harlem Queens tribute data
     */
    function addHarlemTribute(
        uint256 tokenId,
        string memory tributeData
    ) external onlyOwner {
        require(_ownerOf(tokenId) != address(0), "Crown does not exist");
        
        CrownMetadata storage crown = _crownMetadata[tokenId];
        crown.harlemTributeData = tributeData;
        
        emit HarlemTributeAdded(tokenId, tributeData);
    }
    
    /**
     * @dev Get crown metadata
     */
    function getCrownMetadata(uint256 tokenId) external view returns (CrownMetadata memory) {
        require(_ownerOf(tokenId) != address(0), "Crown does not exist");
        return _crownMetadata[tokenId];
    }
    
    /**
     * @dev Get all crowns owned by a queen
     */
    function getCrownsByQueen(address queenAddress) external view returns (uint256[] memory) {
        return _queensCrowns[queenAddress];
    }
    
    /**
     * @dev Get total minted by crown type
     */
    function getTotalMintedByCrownType(CrownType crownType) external view returns (uint256) {
        return _crownTypeMinted[crownType];
    }
    
    /**
     * @dev Get total supply of all crowns
     */
    function getTotalCrowns() external view returns (uint256) {
        return _tokenIdCounter;
    }
    
    /**
     * @dev Calculate coherence level from score
     */
    function _calculateCoherenceLevel(uint256 coherenceScore) private pure returns (CoherenceLevel) {
        if (coherenceScore >= 96) return CoherenceLevel.DIVINE;
        if (coherenceScore >= 76) return CoherenceLevel.SOVEREIGN;
        if (coherenceScore >= 51) return CoherenceLevel.HARMONIOUS;
        if (coherenceScore >= 26) return CoherenceLevel.ALIGNED;
        return CoherenceLevel.EMERGING;
    }
    
    // Override required functions
    function _update(address to, uint256 tokenId, address auth)
        internal
        override(ERC721, ERC721Enumerable)
        returns (address)
    {
        return super._update(to, tokenId, auth);
    }

    function _increaseBalance(address account, uint128 value)
        internal
        override(ERC721, ERC721Enumerable)
    {
        super._increaseBalance(account, value);
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721URIStorage, ERC721Enumerable)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
