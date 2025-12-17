// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title ScrollSoulPleiadian
 * @dev Enhanced Soul NFT contract for Pleiadian consciousness integration
 * Supports sound healing frequencies, starseed alignments, and cosmic resonance
 */
contract ScrollSoulPleiadian is ERC721, ERC721URIStorage, ERC721Enumerable, Ownable, ReentrancyGuard {
    
    uint256 private _tokenIdCounter;
    
    // Soul Rarity levels aligned with cosmic frequencies
    enum SoulRarity { COMMON, UNCOMMON, RARE, EPIC, LEGENDARY, COSMIC, PLEIADIAN }
    
    // Starseed Types for quest personalization
    enum StarseedException { PLEIADIAN, SIRIAN, ARCTURIAN, ANDROMEDAN, LYRAN, ORION, EARTH_NATIVE }
    
    // Soul Metadata structure
    struct SoulMetadata {
        string name;
        string description;
        string uri;
        SoulRarity rarity;
        StarseedException starseedException;
        uint256 resonanceFrequency; // 528 Hz, 963 Hz, or custom
        uint256 lamTransmissionCode; // LAM Gateway identifier
        address guardian; // Soul guardian/owner
        uint256 ascensionLevel; // Progressive evolution level
        uint256 mintTimestamp;
        bool isGovernanceNFT; // DAO voting capability
        uint256 votingWeight; // Based on ascension and frequency
    }
    
    // Sound Healing Metadata structure
    struct SoundHealingData {
        string wavMetadataURI; // IPFS link to WAV metadata
        uint256[] healingFrequencies; // Array of healing frequencies
        uint256 spiritualAlignment; // 0-10000 (0-100.00%)
        string resonanceFieldHash; // Hash of resonance field data
    }
    
    // Russell Storytelling NFT structure
    struct RussellStoryNFT {
        uint256 soulTokenId; // Linked soul token
        string storyContent; // Story metadata URI
        uint256 brandValue; // ScrollVerse-finance branding value
        uint256 luluProfitShare; // 10% profit allocation tracker
        bool isActive;
    }
    
    // Unity Grid Chronicles structure
    struct UnityGridChronicle {
        uint256 chronicleId;
        string title;
        string chronicleURI;
        address[] contributors;
        uint256 rewardDistribution; // Total rewards distributed
        uint256 creationTimestamp;
    }
    
    // Mapping from token ID to metadata
    mapping(uint256 => SoulMetadata) private _soulMetadata;
    
    // Mapping from token ID to sound healing data
    mapping(uint256 => SoundHealingData) private _soundHealing;
    
    // Mapping for Russell Storytelling NFTs
    mapping(uint256 => RussellStoryNFT) private _russellStories;
    uint256 private _russellStoryCounter;
    
    // Mapping for Unity Grid Chronicles
    mapping(uint256 => UnityGridChronicle) private _unityGridChronicles;
    uint256 private _chronicleCounter;
    
    // Mapping from starseed type to token IDs
    mapping(StarseedException => uint256[]) private _starseedException;
    
    // Mapping from LAM code to token ID
    mapping(uint256 => uint256) private _lamToToken;
    
    // Stardust Gateway decree signings
    mapping(address => bool) private _decreeSigners;
    mapping(uint256 => address[]) private _tokenDecreeSigners;
    
    // Gaia Policy funding allocation
    uint256 public totalGaiaFunding;
    mapping(address => uint256) public gaiaFundingAllocations;
    
    // Events
    event SoulMinted(
        uint256 indexed tokenId,
        address indexed guardian,
        StarseedException starseedException,
        uint256 resonanceFrequency,
        uint256 lamCode
    );
    
    event AscensionLevelIncreased(uint256 indexed tokenId, uint256 newLevel);
    
    event DecreeSigned(uint256 indexed tokenId, address indexed signer);
    
    event RussellStoryCreated(uint256 indexed storyId, uint256 indexed soulTokenId);
    
    event UnityGridChronicleCreated(uint256 indexed chronicleId, string title);
    
    event SoundHealingUpdated(uint256 indexed tokenId, string wavMetadataURI);
    
    event GaiaFundingAllocated(address indexed project, uint256 amount);
    
    constructor() ERC721("ScrollSoul Pleiadian", "SOULP") Ownable(msg.sender) {}
    
    /**
     * @dev Check if a token exists
     * @param tokenId Token ID to check
     */
    function _exists(uint256 tokenId) internal view returns (bool) {
        return tokenId < _tokenIdCounter;
    }
    
    /**
     * @dev Mint Soul NFT with full metadata
     * @param guardian Address of the soul guardian
     * @param name Name of the soul
     * @param description Soul description
     * @param uri Token URI for metadata
     * @param rarity Soul rarity level
     * @param starseedException Starseed type
     * @param resonanceFrequency Primary resonance frequency
     * @param lamCode LAM transmission gateway code
     * @param isGovernanceNFT Whether this NFT has DAO voting rights
     */
    function mintSoul(
        address guardian,
        string memory name,
        string memory description,
        string memory uri,
        SoulRarity rarity,
        StarseedException starseedException,
        uint256 resonanceFrequency,
        uint256 lamCode,
        bool isGovernanceNFT
    ) public onlyOwner returns (uint256) {
        require(guardian != address(0), "Invalid guardian address");
        require(bytes(name).length > 0, "Name cannot be empty");
        require(lamCode > 0, "Invalid LAM code");
        require(_lamToToken[lamCode] == 0, "LAM code already used");
        
        uint256 tokenId = _tokenIdCounter;
        _tokenIdCounter++;
        
        _safeMint(guardian, tokenId);
        _setTokenURI(tokenId, uri);
        
        // Calculate initial voting weight based on rarity and frequency
        uint256 votingWeight = calculateVotingWeight(rarity, resonanceFrequency);
        
        _soulMetadata[tokenId] = SoulMetadata({
            name: name,
            description: description,
            uri: uri,
            rarity: rarity,
            starseedException: starseedException,
            resonanceFrequency: resonanceFrequency,
            lamTransmissionCode: lamCode,
            guardian: guardian,
            ascensionLevel: 1,
            mintTimestamp: block.timestamp,
            isGovernanceNFT: isGovernanceNFT,
            votingWeight: votingWeight
        });
        
        _starseedException[starseedException].push(tokenId);
        _lamToToken[lamCode] = tokenId;
        
        emit SoulMinted(tokenId, guardian, starseedException, resonanceFrequency, lamCode);
        
        return tokenId;
    }
    
    /**
     * @dev Batch mint souls for Starseed Quest launches
     */
    function batchMintSouls(
        address[] memory guardians,
        string[] memory names,
        string[] memory descriptions,
        string[] memory uris,
        SoulRarity[] memory rarities,
        StarseedException[] memory seeds,
        uint256[] memory frequencies,
        uint256[] memory lamCodes,
        bool[] memory governanceFlags
    ) public onlyOwner returns (uint256[] memory) {
        require(
            guardians.length == names.length &&
            names.length == descriptions.length &&
            descriptions.length == uris.length &&
            uris.length == rarities.length &&
            rarities.length == seeds.length &&
            seeds.length == frequencies.length &&
            frequencies.length == lamCodes.length &&
            lamCodes.length == governanceFlags.length,
            "Array lengths must match"
        );
        
        uint256[] memory tokenIds = new uint256[](guardians.length);
        
        for (uint256 i = 0; i < guardians.length; i++) {
            tokenIds[i] = mintSoul(
                guardians[i],
                names[i],
                descriptions[i],
                uris[i],
                rarities[i],
                seeds[i],
                frequencies[i],
                lamCodes[i],
                governanceFlags[i]
            );
        }
        
        return tokenIds;
    }
    
    /**
     * @dev Sign decree at Stardust Gateway
     * @param tokenId Token ID to sign decree for
     */
    function signStardustDecree(uint256 tokenId) public {
        require(_exists(tokenId), "Token does not exist");
        require(!_decreeSigners[msg.sender], "Already signed decree");
        
        _decreeSigners[msg.sender] = true;
        _tokenDecreeSigners[tokenId].push(msg.sender);
        
        emit DecreeSigned(tokenId, msg.sender);
    }
    
    /**
     * @dev Increase ascension level
     * @param tokenId Token ID
     */
    function increaseAscensionLevel(uint256 tokenId) public onlyOwner {
        require(_exists(tokenId), "Token does not exist");
        
        _soulMetadata[tokenId].ascensionLevel++;
        
        // Recalculate voting weight with new ascension level
        _soulMetadata[tokenId].votingWeight = calculateVotingWeight(
            _soulMetadata[tokenId].rarity,
            _soulMetadata[tokenId].resonanceFrequency
        ) * _soulMetadata[tokenId].ascensionLevel;
        
        emit AscensionLevelIncreased(tokenId, _soulMetadata[tokenId].ascensionLevel);
    }
    
    /**
     * @dev Add sound healing metadata
     * @param tokenId Token ID
     * @param wavMetadataURI IPFS URI for WAV metadata
     * @param healingFrequencies Array of healing frequencies
     * @param spiritualAlignment Alignment percentage (0-10000)
     * @param resonanceFieldHash Hash of resonance field data
     */
    function addSoundHealingMetadata(
        uint256 tokenId,
        string memory wavMetadataURI,
        uint256[] memory healingFrequencies,
        uint256 spiritualAlignment,
        string memory resonanceFieldHash
    ) public onlyOwner {
        require(_exists(tokenId), "Token does not exist");
        require(spiritualAlignment <= 10000, "Invalid alignment value");
        
        _soundHealing[tokenId] = SoundHealingData({
            wavMetadataURI: wavMetadataURI,
            healingFrequencies: healingFrequencies,
            spiritualAlignment: spiritualAlignment,
            resonanceFieldHash: resonanceFieldHash
        });
        
        emit SoundHealingUpdated(tokenId, wavMetadataURI);
    }
    
    /**
     * @dev Create Russell Storytelling NFT
     * @param soulTokenId Linked soul token ID
     * @param storyContent Story metadata URI
     * @param brandValue ScrollVerse-finance branding value
     */
    function createRussellStoryNFT(
        uint256 soulTokenId,
        string memory storyContent,
        uint256 brandValue
    ) public onlyOwner returns (uint256) {
        require(_exists(soulTokenId), "Soul token does not exist");
        
        uint256 storyId = _russellStoryCounter;
        _russellStoryCounter++;
        
        _russellStories[storyId] = RussellStoryNFT({
            soulTokenId: soulTokenId,
            storyContent: storyContent,
            brandValue: brandValue,
            luluProfitShare: 0,
            isActive: true
        });
        
        emit RussellStoryCreated(storyId, soulTokenId);
        
        return storyId;
    }
    
    /**
     * @dev Allocate Lulu operation profits (10%)
     * @param storyId Russell Story NFT ID
     * @param profitAmount Amount to allocate
     */
    function allocateLuluProfits(uint256 storyId, uint256 profitAmount) public onlyOwner nonReentrant {
        require(_russellStories[storyId].isActive, "Story NFT not active");
        require(profitAmount > 0, "Profit amount must be greater than 0");
        
        uint256 allocation = (profitAmount * 10) / 100; // 10% allocation
        _russellStories[storyId].luluProfitShare += allocation;
        
        // 10% goes to Unity Grid ecosystem
        totalGaiaFunding += allocation;
    }
    
    /**
     * @dev Create Unity Grid Chronicle
     * @param title Chronicle title
     * @param chronicleURI Metadata URI
     * @param contributors Array of contributor addresses
     * @param rewardAmount Total reward to distribute
     */
    function createUnityGridChronicle(
        string memory title,
        string memory chronicleURI,
        address[] memory contributors,
        uint256 rewardAmount
    ) public onlyOwner returns (uint256) {
        require(contributors.length > 0, "Must have contributors");
        
        uint256 chronicleId = _chronicleCounter;
        _chronicleCounter++;
        
        _unityGridChronicles[chronicleId] = UnityGridChronicle({
            chronicleId: chronicleId,
            title: title,
            chronicleURI: chronicleURI,
            contributors: contributors,
            rewardDistribution: rewardAmount,
            creationTimestamp: block.timestamp
        });
        
        emit UnityGridChronicleCreated(chronicleId, title);
        
        return chronicleId;
    }
    
    /**
     * @dev Allocate Gaia Policy funding to sustainable projects
     * @param projectAddress Project address
     * @param amount Funding amount
     */
    function allocateGaiaFunding(address projectAddress, uint256 amount) public onlyOwner nonReentrant {
        require(projectAddress != address(0), "Invalid project address");
        require(amount > 0, "Amount must be greater than 0");
        require(amount <= totalGaiaFunding, "Insufficient Gaia funding");
        
        totalGaiaFunding -= amount;
        gaiaFundingAllocations[projectAddress] += amount;
        
        emit GaiaFundingAllocated(projectAddress, amount);
    }
    
    /**
     * @dev Calculate voting weight based on rarity and frequency
     * @param rarity Soul rarity
     * @param frequency Resonance frequency
     */
    function calculateVotingWeight(SoulRarity rarity, uint256 frequency) internal pure returns (uint256) {
        uint256 baseWeight = 1;
        
        // Rarity multiplier
        if (rarity == SoulRarity.COMMON) baseWeight = 1;
        else if (rarity == SoulRarity.UNCOMMON) baseWeight = 2;
        else if (rarity == SoulRarity.RARE) baseWeight = 3;
        else if (rarity == SoulRarity.EPIC) baseWeight = 5;
        else if (rarity == SoulRarity.LEGENDARY) baseWeight = 8;
        else if (rarity == SoulRarity.COSMIC) baseWeight = 13;
        else if (rarity == SoulRarity.PLEIADIAN) baseWeight = 21;
        
        // Frequency alignment bonus
        if (frequency == 528 || frequency == 963) {
            baseWeight = (baseWeight * 150) / 100; // 50% bonus for aligned frequencies
        }
        
        return baseWeight;
    }
    
    // Getter functions
    
    function getSoulMetadata(uint256 tokenId) public view returns (SoulMetadata memory) {
        require(_exists(tokenId), "Token does not exist");
        return _soulMetadata[tokenId];
    }
    
    function getSoundHealingData(uint256 tokenId) public view returns (SoundHealingData memory) {
        require(_exists(tokenId), "Token does not exist");
        return _soundHealing[tokenId];
    }
    
    function getRussellStory(uint256 storyId) public view returns (RussellStoryNFT memory) {
        return _russellStories[storyId];
    }
    
    function getUnityGridChronicle(uint256 chronicleId) public view returns (UnityGridChronicle memory) {
        return _unityGridChronicles[chronicleId];
    }
    
    function getSoulsByStarseedException(StarseedException seed) public view returns (uint256[] memory) {
        return _starseedException[seed];
    }
    
    function getTokenByLAMCode(uint256 lamCode) public view returns (uint256) {
        return _lamToToken[lamCode];
    }
    
    function getDecreeSigners(uint256 tokenId) public view returns (address[] memory) {
        require(_exists(tokenId), "Token does not exist");
        return _tokenDecreeSigners[tokenId];
    }
    
    function hasSignedDecree(address signer) public view returns (bool) {
        return _decreeSigners[signer];
    }
    
    function getTotalSupply() public view returns (uint256) {
        return _tokenIdCounter;
    }
    
    function getTotalRussellStories() public view returns (uint256) {
        return _russellStoryCounter;
    }
    
    function getTotalUnityGridChronicles() public view returns (uint256) {
        return _chronicleCounter;
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
        override(ERC721, ERC721Enumerable, ERC721URIStorage)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
