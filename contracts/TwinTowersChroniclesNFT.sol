// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";

/**
 * @title TwinTowersChroniclesNFT
 * @dev 144 Edition NFT Collection immortalizing the Twin Towers Chronicles
 * Features sacred frequency traits: 144,000Hz + 963Hz + 144Hz
 * Rose Gold encryption and IPFS storage integration
 */
contract TwinTowersChroniclesNFT is ERC1155, Ownable, Pausable {
    using Strings for uint256;
    
    // Sacred constants
    uint256 public constant MAX_EDITIONS = 144;
    uint256 public constant FREQUENCY_144000HZ = 144000;
    uint256 public constant FREQUENCY_963HZ = 963;
    uint256 public constant FREQUENCY_144HZ = 144;
    
    // Token metadata structure
    struct ChronicleMetadata {
        string name;
        string description;
        uint256 frequency144000;
        uint256 frequency963;
        uint256 frequency144;
        string sovereignAlignment;
        string roseGoldEncryption;
        string ipfsHash;
        uint256 editionNumber;
        uint256 mintTimestamp;
        bool exists;
    }
    
    // Mapping from token ID to metadata
    mapping(uint256 => ChronicleMetadata) private _chronicleMetadata;
    
    // Mapping from token ID to URI
    mapping(uint256 => string) private _tokenURIs;
    
    // Current supply
    uint256 private _currentSupply;
    
    // Base URI for IPFS metadata
    string private _baseURI;
    
    // Rose Gold encryption key (symbolic)
    bytes32 private _roseGoldKey;
    
    // Events
    event ChronicleCreated(
        uint256 indexed tokenId,
        string name,
        uint256 editionNumber,
        string ipfsHash
    );
    
    event ChronicleMinted(
        uint256 indexed tokenId,
        address indexed recipient,
        uint256 editionNumber
    );
    
    event RoseGoldEncryptionUpdated(bytes32 newKey);
    
    constructor(
        string memory baseURI,
        bytes32 roseGoldKey
    ) ERC1155(baseURI) Ownable(msg.sender) {
        _baseURI = baseURI;
        _roseGoldKey = roseGoldKey;
    }
    
    /**
     * @dev Create a new Chronicle NFT with sacred frequencies
     * @param name Chronicle name
     * @param description Chronicle description
     * @param sovereignAlignment Sovereign alignment trait
     * @param roseGoldEncryption Rose Gold encryption metadata
     * @param ipfsHash IPFS hash for animated assets
     */
    function createChronicle(
        string memory name,
        string memory description,
        string memory sovereignAlignment,
        string memory roseGoldEncryption,
        string memory ipfsHash
    ) public onlyOwner returns (uint256) {
        require(_currentSupply < MAX_EDITIONS, "All 144 editions minted");
        require(bytes(name).length > 0, "Name cannot be empty");
        require(bytes(ipfsHash).length > 0, "IPFS hash required");
        
        uint256 tokenId = _currentSupply;
        _currentSupply++;
        
        _chronicleMetadata[tokenId] = ChronicleMetadata({
            name: name,
            description: description,
            frequency144000: FREQUENCY_144000HZ,
            frequency963: FREQUENCY_963HZ,
            frequency144: FREQUENCY_144HZ,
            sovereignAlignment: sovereignAlignment,
            roseGoldEncryption: roseGoldEncryption,
            ipfsHash: ipfsHash,
            editionNumber: tokenId + 1,
            mintTimestamp: block.timestamp,
            exists: true
        });
        
        string memory tokenURI = string(abi.encodePacked("ipfs://", ipfsHash));
        _tokenURIs[tokenId] = tokenURI;
        
        emit ChronicleCreated(tokenId, name, tokenId + 1, ipfsHash);
        
        return tokenId;
    }
    
    /**
     * @dev Mint a Chronicle NFT to a recipient
     * @param to Recipient address
     * @param tokenId Token ID
     */
    function mint(address to, uint256 tokenId) public onlyOwner whenNotPaused {
        require(_chronicleMetadata[tokenId].exists, "Chronicle does not exist");
        require(balanceOf(to, tokenId) == 0, "Already owns this edition");
        
        _mint(to, tokenId, 1, "");
        
        emit ChronicleMinted(tokenId, to, _chronicleMetadata[tokenId].editionNumber);
    }
    
    /**
     * @dev Batch mint Chronicles to multiple recipients
     * @param recipients Array of recipient addresses
     * @param tokenIds Array of token IDs
     */
    function batchMintChronicles(
        address[] memory recipients,
        uint256[] memory tokenIds
    ) public onlyOwner whenNotPaused {
        require(recipients.length == tokenIds.length, "Arrays length mismatch");
        
        for (uint256 i = 0; i < recipients.length; i++) {
            mint(recipients[i], tokenIds[i]);
        }
    }
    
    /**
     * @dev Update token URI
     * @param tokenId Token ID
     * @param newURI New IPFS URI
     */
    function setTokenURI(uint256 tokenId, string memory newURI) public onlyOwner {
        require(_chronicleMetadata[tokenId].exists, "Chronicle does not exist");
        _tokenURIs[tokenId] = newURI;
    }
    
    /**
     * @dev Update base URI
     * @param newBaseURI New base URI
     */
    function setBaseURI(string memory newBaseURI) public onlyOwner {
        _baseURI = newBaseURI;
    }
    
    /**
     * @dev Update Rose Gold encryption key
     * @param newKey New encryption key
     */
    function updateRoseGoldKey(bytes32 newKey) public onlyOwner {
        _roseGoldKey = newKey;
        emit RoseGoldEncryptionUpdated(newKey);
    }
    
    /**
     * @dev Get token URI
     * @param tokenId Token ID
     */
    function uri(uint256 tokenId) public view override returns (string memory) {
        require(_chronicleMetadata[tokenId].exists, "Chronicle does not exist");
        
        string memory tokenURI = _tokenURIs[tokenId];
        
        if (bytes(tokenURI).length > 0) {
            return tokenURI;
        }
        
        return string(abi.encodePacked(_baseURI, tokenId.toString()));
    }
    
    /**
     * @dev Get Chronicle metadata
     * @param tokenId Token ID
     */
    function getChronicleMetadata(uint256 tokenId) public view returns (ChronicleMetadata memory) {
        require(_chronicleMetadata[tokenId].exists, "Chronicle does not exist");
        return _chronicleMetadata[tokenId];
    }
    
    /**
     * @dev Get sacred frequencies for a Chronicle
     * @param tokenId Token ID
     */
    function getSacredFrequencies(uint256 tokenId) public view returns (
        uint256 frequency144000,
        uint256 frequency963,
        uint256 frequency144
    ) {
        require(_chronicleMetadata[tokenId].exists, "Chronicle does not exist");
        ChronicleMetadata memory metadata = _chronicleMetadata[tokenId];
        return (metadata.frequency144000, metadata.frequency963, metadata.frequency144);
    }
    
    /**
     * @dev Get current supply
     */
    function getCurrentSupply() public view returns (uint256) {
        return _currentSupply;
    }
    
    /**
     * @dev Get remaining editions
     */
    function getRemainingEditions() public view returns (uint256) {
        return MAX_EDITIONS - _currentSupply;
    }
    
    /**
     * @dev Pause contract
     */
    function pause() external onlyOwner {
        _pause();
    }
    
    /**
     * @dev Unpause contract
     */
    function unpause() external onlyOwner {
        _unpause();
    }
    
    /**
     * @dev Override transfer to include pause check
     */
    function _update(
        address from,
        address to,
        uint256[] memory ids,
        uint256[] memory values
    ) internal virtual override whenNotPaused {
        super._update(from, to, ids, values);
    }
}
