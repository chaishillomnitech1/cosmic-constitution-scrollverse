// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title LegacyMusicCatalog
 * @dev NFT contract for tokenizing historical music catalogs (Michael Jackson, Beatles, Prince, etc.)
 * Implements blueprint acquisition, royalty distribution, and asset protection tracking
 * Integrated with $LEGACYCOIN for revenue streams and cosmic asset backing
 */
contract LegacyMusicCatalog is ERC721, ERC721URIStorage, ERC721Enumerable, Ownable, ReentrancyGuard {
    
    uint256 private _tokenIdCounter;
    
    // Rarity tiers for music assets
    enum AssetRarity { 
        COMMON,      // Standard catalog songs
        UNCOMMON,    // Notable singles
        RARE,        // Chart-topping hits
        EPIC,        // Iconic albums
        LEGENDARY,   // Career-defining works
        PLATINUM,    // Beatles catalog
        COSMIC       // Prince Vault & ultra-rare archives
    }
    
    // Artist/Catalog classification
    enum ArtistCatalog { 
        MICHAEL_JACKSON, 
        BEATLES, 
        PRINCE, 
        SONY_CATALOG, 
        OTHER_ARCHIVE 
    }
    
    // Music asset metadata structure
    struct MusicAsset {
        string songTitle;
        string artistName;
        string albumName;
        string description;
        string metadataURI;
        AssetRarity rarity;
        ArtistCatalog catalog;
        uint256 resonanceFrequency; // 528 Hz, 963 Hz, or custom
        uint256 acquisitionValue;    // Value in wei
        uint256 mintTimestamp;
        bool isPhysicallySecured;    // Fort Knox model security
        bool isDigitallyMirrored;    // QR-integrated mirror
        address[] heirs;             // Beneficiary addresses
        uint256[] heirShares;        // Percentage shares (sum = 10000 for 100%)
    }
    
    // Blueprint acquisition tracking
    struct AcquisitionBlueprint {
        uint256 blueprintId;
        string catalogName;          // e.g., "Sony Music Catalog"
        uint256 targetValue;         // Acquisition target in wei
        uint256 paidValue;           // Amount paid (2x valuation for overcompensation)
        string legalRegistryURI;     // IPFS link to legal documentation
        string ipRegistryURI;        // Intellectual Property registry
        uint256 acquisitionDate;
        bool isCompleted;
        address[] legalTeam;
    }
    
    // Royalty distribution tracking
    struct RoyaltyDistribution {
        uint256 assetTokenId;
        uint256 totalDistributed;
        uint256 lastDistribution;
        mapping(address => uint256) heirEarnings;
        bool autoDistribute;
    }
    
    // Revenue dashboard data
    struct RevenueDashboard {
        address heir;
        uint256 totalEarnings;
        uint256 pendingEarnings;
        uint256 lastClaim;
        uint256[] assetTokenIds;
    }
    
    // Asset vault protection
    struct AssetVault {
        uint256 vaultId;
        string vaultLocation;        // Physical location
        string qrCodeURI;            // QR code for digital verification
        uint256[] storedAssets;      // Token IDs stored
        bool isActive;
        uint256 lastAudit;
    }
    
    // Mappings
    mapping(uint256 => MusicAsset) private _musicAssets;
    mapping(uint256 => AcquisitionBlueprint) private _blueprints;
    mapping(uint256 => RoyaltyDistribution) private _royalties;
    mapping(address => RevenueDashboard) private _revenueDashboards;
    mapping(uint256 => AssetVault) private _vaults;
    
    // Counters
    uint256 private _blueprintCounter;
    uint256 private _vaultCounter;
    
    // LegacyCoin token address for integration
    address public legacyCoinAddress;
    
    // Community art program allocation (percentage of revenue)
    uint256 public communityArtFundPercentage = 1000; // 10% default
    uint256 public communityArtFundBalance;
    
    // Events
    event MusicAssetMinted(uint256 indexed tokenId, string songTitle, AssetRarity rarity, ArtistCatalog catalog);
    event BlueprintCreated(uint256 indexed blueprintId, string catalogName, uint256 targetValue);
    event AcquisitionCompleted(uint256 indexed blueprintId, uint256 paidValue);
    event RoyaltyDistributed(uint256 indexed tokenId, uint256 amount, uint256 heirCount);
    event HeirEarningsClaimed(address indexed heir, uint256 amount);
    event VaultCreated(uint256 indexed vaultId, string location);
    event AssetSecured(uint256 indexed tokenId, uint256 vaultId);
    event CommunityFundAllocated(uint256 amount);
    
    /**
     * @dev Constructor
     */
    constructor() ERC721("Legacy Music Catalog", "LEGACY") Ownable(msg.sender) {
        _tokenIdCounter = 0;
        _blueprintCounter = 0;
        _vaultCounter = 0;
    }
    
    /**
     * @dev Set LegacyCoin contract address
     * @param _legacyCoinAddress Address of LegacyCoin contract
     */
    function setLegacyCoinAddress(address _legacyCoinAddress) external onlyOwner {
        legacyCoinAddress = _legacyCoinAddress;
    }
    
    /**
     * @dev Create acquisition blueprint
     * @param _catalogName Name of the catalog
     * @param _targetValue Target acquisition value
     * @param _legalRegistryURI Legal documentation URI
     * @param _ipRegistryURI IP registry URI
     */
    function createBlueprint(
        string memory _catalogName,
        uint256 _targetValue,
        string memory _legalRegistryURI,
        string memory _ipRegistryURI
    ) external onlyOwner returns (uint256) {
        uint256 blueprintId = _blueprintCounter++;
        
        AcquisitionBlueprint storage blueprint = _blueprints[blueprintId];
        blueprint.blueprintId = blueprintId;
        blueprint.catalogName = _catalogName;
        blueprint.targetValue = _targetValue;
        blueprint.paidValue = 0;
        blueprint.legalRegistryURI = _legalRegistryURI;
        blueprint.ipRegistryURI = _ipRegistryURI;
        blueprint.acquisitionDate = 0;
        blueprint.isCompleted = false;
        
        emit BlueprintCreated(blueprintId, _catalogName, _targetValue);
        return blueprintId;
    }
    
    /**
     * @dev Complete acquisition with overcompensation (2x valuation)
     * @param _blueprintId Blueprint ID
     * @param _paidValue Amount paid (should be ~2x target value)
     */
    function completeAcquisition(uint256 _blueprintId, uint256 _paidValue) external onlyOwner {
        require(_blueprintId < _blueprintCounter, "Invalid blueprint ID");
        require(!_blueprints[_blueprintId].isCompleted, "Already completed");
        
        _blueprints[_blueprintId].paidValue = _paidValue;
        _blueprints[_blueprintId].acquisitionDate = block.timestamp;
        _blueprints[_blueprintId].isCompleted = true;
        
        emit AcquisitionCompleted(_blueprintId, _paidValue);
    }
    
    /**
     * @dev Mint music asset NFT with rarity tier
     * @param _to Recipient address
     * @param _songTitle Song title
     * @param _artistName Artist name
     * @param _albumName Album name
     * @param _description Description
     * @param _metadataURI Metadata URI
     * @param _rarity Asset rarity tier
     * @param _catalog Artist catalog classification
     * @param _resonanceFrequency Resonance frequency
     * @param _acquisitionValue Acquisition value
     * @param _heirs Array of heir addresses
     * @param _heirShares Array of heir percentage shares (sum = 10000)
     */
    function mintMusicAsset(
        address _to,
        string memory _songTitle,
        string memory _artistName,
        string memory _albumName,
        string memory _description,
        string memory _metadataURI,
        AssetRarity _rarity,
        ArtistCatalog _catalog,
        uint256 _resonanceFrequency,
        uint256 _acquisitionValue,
        address[] memory _heirs,
        uint256[] memory _heirShares
    ) external onlyOwner nonReentrant returns (uint256) {
        require(_heirs.length == _heirShares.length, "Heirs and shares mismatch");
        require(_validateShares(_heirShares), "Shares must sum to 10000");
        
        uint256 tokenId = _tokenIdCounter++;
        _safeMint(_to, tokenId);
        _setTokenURI(tokenId, _metadataURI);
        
        _musicAssets[tokenId] = MusicAsset({
            songTitle: _songTitle,
            artistName: _artistName,
            albumName: _albumName,
            description: _description,
            metadataURI: _metadataURI,
            rarity: _rarity,
            catalog: _catalog,
            resonanceFrequency: _resonanceFrequency,
            acquisitionValue: _acquisitionValue,
            mintTimestamp: block.timestamp,
            isPhysicallySecured: false,
            isDigitallyMirrored: false,
            heirs: _heirs,
            heirShares: _heirShares
        });
        
        // Initialize royalty distribution
        _royalties[tokenId].assetTokenId = tokenId;
        _royalties[tokenId].autoDistribute = true;
        
        // Update revenue dashboards for heirs
        for (uint256 i = 0; i < _heirs.length; i++) {
            _revenueDashboards[_heirs[i]].heir = _heirs[i];
            _revenueDashboards[_heirs[i]].assetTokenIds.push(tokenId);
        }
        
        emit MusicAssetMinted(tokenId, _songTitle, _rarity, _catalog);
        return tokenId;
    }
    
    /**
     * @dev Distribute royalties to heirs
     * @param _tokenId Asset token ID
     */
    function distributeRoyalties(uint256 _tokenId) external payable nonReentrant {
        require(_exists(_tokenId), "Asset does not exist");
        require(msg.value > 0, "No value to distribute");
        
        MusicAsset memory asset = _musicAssets[_tokenId];
        
        // Allocate community fund percentage
        uint256 communityAllocation = (msg.value * communityArtFundPercentage) / 10000;
        communityArtFundBalance += communityAllocation;
        emit CommunityFundAllocated(communityAllocation);
        
        // Distribute remaining to heirs
        uint256 distributionAmount = msg.value - communityAllocation;
        uint256 totalDistributed = 0;
        
        for (uint256 i = 0; i < asset.heirs.length; i++) {
            uint256 heirAmount = (distributionAmount * asset.heirShares[i]) / 10000;
            _royalties[_tokenId].heirEarnings[asset.heirs[i]] += heirAmount;
            _revenueDashboards[asset.heirs[i]].pendingEarnings += heirAmount;
            _revenueDashboards[asset.heirs[i]].totalEarnings += heirAmount;
            totalDistributed += heirAmount;
        }
        
        _royalties[_tokenId].totalDistributed += totalDistributed;
        _royalties[_tokenId].lastDistribution = block.timestamp;
        
        emit RoyaltyDistributed(_tokenId, totalDistributed, asset.heirs.length);
    }
    
    /**
     * @dev Claim heir earnings
     */
    function claimHeirEarnings() external nonReentrant {
        uint256 pending = _revenueDashboards[msg.sender].pendingEarnings;
        require(pending > 0, "No pending earnings");
        
        _revenueDashboards[msg.sender].pendingEarnings = 0;
        _revenueDashboards[msg.sender].lastClaim = block.timestamp;
        
        (bool success, ) = payable(msg.sender).call{value: pending}("");
        require(success, "Transfer failed");
        
        emit HeirEarningsClaimed(msg.sender, pending);
    }
    
    /**
     * @dev Create asset vault
     * @param _location Physical vault location
     * @param _qrCodeURI QR code URI for digital verification
     */
    function createVault(string memory _location, string memory _qrCodeURI) external onlyOwner returns (uint256) {
        uint256 vaultId = _vaultCounter++;
        
        _vaults[vaultId] = AssetVault({
            vaultId: vaultId,
            vaultLocation: _location,
            qrCodeURI: _qrCodeURI,
            storedAssets: new uint256[](0),
            isActive: true,
            lastAudit: block.timestamp
        });
        
        emit VaultCreated(vaultId, _location);
        return vaultId;
    }
    
    /**
     * @dev Secure asset in vault (physical + digital protection)
     * @param _tokenId Asset token ID
     * @param _vaultId Vault ID
     */
    function secureAsset(uint256 _tokenId, uint256 _vaultId) external onlyOwner {
        require(_exists(_tokenId), "Asset does not exist");
        require(_vaultId < _vaultCounter, "Invalid vault ID");
        require(_vaults[_vaultId].isActive, "Vault not active");
        
        _musicAssets[_tokenId].isPhysicallySecured = true;
        _musicAssets[_tokenId].isDigitallyMirrored = true;
        _vaults[_vaultId].storedAssets.push(_tokenId);
        
        emit AssetSecured(_tokenId, _vaultId);
    }
    
    /**
     * @dev Get music asset metadata
     * @param _tokenId Token ID
     * @return MusicAsset struct
     */
    function getMusicAsset(uint256 _tokenId) external view returns (MusicAsset memory) {
        require(_exists(_tokenId), "Asset does not exist");
        return _musicAssets[_tokenId];
    }
    
    /**
     * @dev Get blueprint details
     * @param _blueprintId Blueprint ID
     * @return Blueprint struct (without legalTeam mapping)
     */
    function getBlueprint(uint256 _blueprintId) external view returns (
        uint256 blueprintId,
        string memory catalogName,
        uint256 targetValue,
        uint256 paidValue,
        string memory legalRegistryURI,
        string memory ipRegistryURI,
        uint256 acquisitionDate,
        bool isCompleted
    ) {
        require(_blueprintId < _blueprintCounter, "Invalid blueprint ID");
        AcquisitionBlueprint storage blueprint = _blueprints[_blueprintId];
        return (
            blueprint.blueprintId,
            blueprint.catalogName,
            blueprint.targetValue,
            blueprint.paidValue,
            blueprint.legalRegistryURI,
            blueprint.ipRegistryURI,
            blueprint.acquisitionDate,
            blueprint.isCompleted
        );
    }
    
    /**
     * @dev Get heir revenue dashboard
     * @param _heir Heir address
     * @return Dashboard data
     */
    function getRevenueDashboard(address _heir) external view returns (
        uint256 totalEarnings,
        uint256 pendingEarnings,
        uint256 lastClaim,
        uint256[] memory assetTokenIds
    ) {
        RevenueDashboard storage dashboard = _revenueDashboards[_heir];
        return (
            dashboard.totalEarnings,
            dashboard.pendingEarnings,
            dashboard.lastClaim,
            dashboard.assetTokenIds
        );
    }
    
    /**
     * @dev Get heir earnings for specific asset
     * @param _tokenId Asset token ID
     * @param _heir Heir address
     * @return Earnings amount
     */
    function getHeirEarnings(uint256 _tokenId, address _heir) external view returns (uint256) {
        return _royalties[_tokenId].heirEarnings[_heir];
    }
    
    /**
     * @dev Get vault details
     * @param _vaultId Vault ID
     * @return Vault details
     */
    function getVault(uint256 _vaultId) external view returns (
        string memory vaultLocation,
        string memory qrCodeURI,
        uint256[] memory storedAssets,
        bool isActive,
        uint256 lastAudit
    ) {
        require(_vaultId < _vaultCounter, "Invalid vault ID");
        AssetVault storage vault = _vaults[_vaultId];
        return (
            vault.vaultLocation,
            vault.qrCodeURI,
            vault.storedAssets,
            vault.isActive,
            vault.lastAudit
        );
    }
    
    /**
     * @dev Withdraw community art fund
     * @param _amount Amount to withdraw
     * @param _recipient Recipient address
     */
    function withdrawCommunityFund(uint256 _amount, address _recipient) external onlyOwner {
        require(_amount <= communityArtFundBalance, "Insufficient fund balance");
        communityArtFundBalance -= _amount;
        
        (bool success, ) = payable(_recipient).call{value: _amount}("");
        require(success, "Transfer failed");
    }
    
    /**
     * @dev Update community fund percentage
     * @param _percentage New percentage (in basis points, 1000 = 10%)
     */
    function updateCommunityFundPercentage(uint256 _percentage) external onlyOwner {
        require(_percentage <= 10000, "Percentage too high");
        communityArtFundPercentage = _percentage;
    }
    
    /**
     * @dev Validate that heir shares sum to 10000 (100%)
     * @param _shares Array of share percentages
     * @return True if valid
     */
    function _validateShares(uint256[] memory _shares) private pure returns (bool) {
        uint256 total = 0;
        for (uint256 i = 0; i < _shares.length; i++) {
            total += _shares[i];
        }
        return total == 10000;
    }
    
    // Required overrides
    function tokenURI(uint256 tokenId) public view override(ERC721, ERC721URIStorage) returns (string memory) {
        return super.tokenURI(tokenId);
    }
    
    function supportsInterface(bytes4 interfaceId) public view override(ERC721, ERC721URIStorage, ERC721Enumerable) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
    
    function _update(address to, uint256 tokenId, address auth) internal override(ERC721, ERC721Enumerable) returns (address) {
        return super._update(to, tokenId, auth);
    }
    
    function _increaseBalance(address account, uint128 value) internal override(ERC721, ERC721Enumerable) {
        super._increaseBalance(account, value);
    }
}
