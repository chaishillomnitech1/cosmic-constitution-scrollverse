// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

/**
 * @title ScrollVerseNFT
 * @dev ERC-721 NFT contract for ScrollVerse digital assets
 * Supports metadata fields, rarity levels, and category grouping
 */
contract ScrollVerseNFT is ERC721, ERC721URIStorage, ERC721Enumerable, Ownable {
    using Counters for Counters.Counter;
    
    Counters.Counter private _tokenIdCounter;
    
    // Rarity levels
    enum Rarity { COMMON, UNCOMMON, RARE, EPIC, LEGENDARY }
    
    // Categories
    enum Category { LUXURY_ITEM, VEHICLE, DIGITAL_ART, COSMIC_SCROLL, OTHER }
    
    // NFT Metadata structure
    struct NFTMetadata {
        string name;
        string description;
        string uri;
        Rarity rarity;
        Category category;
        uint256 resonanceFrequency;
        address contributor;
        uint256 mintTimestamp;
    }
    
    // Mapping from token ID to metadata
    mapping(uint256 => NFTMetadata) private _nftMetadata;
    
    // Mapping from contributor to their NFTs
    mapping(address => uint256[]) private _contributorNFTs;
    
    // Events
    event NFTMinted(
        uint256 indexed tokenId,
        address indexed contributor,
        string name,
        Rarity rarity,
        Category category
    );
    
    event MetadataUpdated(uint256 indexed tokenId, string uri);
    
    constructor() ERC721("ScrollVerse NFT", "SCROLL") Ownable(msg.sender) {}
    
    /**
     * @dev Mint NFT to reward contributor
     * @param contributor Address of the contributor
     * @param name Name of the NFT
     * @param description Description of the NFT
     * @param uri Token URI for metadata
     * @param rarity Rarity level of the NFT
     * @param category Category of the NFT
     * @param resonanceFrequency Resonance frequency (528 Hz or 963 Hz)
     */
    function mintNFT(
        address contributor,
        string memory name,
        string memory description,
        string memory uri,
        Rarity rarity,
        Category category,
        uint256 resonanceFrequency
    ) public onlyOwner returns (uint256) {
        require(contributor != address(0), "Invalid contributor address");
        require(bytes(name).length > 0, "Name cannot be empty");
        require(bytes(uri).length > 0, "URI cannot be empty");
        
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        
        _safeMint(contributor, tokenId);
        _setTokenURI(tokenId, uri);
        
        _nftMetadata[tokenId] = NFTMetadata({
            name: name,
            description: description,
            uri: uri,
            rarity: rarity,
            category: category,
            resonanceFrequency: resonanceFrequency,
            contributor: contributor,
            mintTimestamp: block.timestamp
        });
        
        _contributorNFTs[contributor].push(tokenId);
        
        emit NFTMinted(tokenId, contributor, name, rarity, category);
        
        return tokenId;
    }
    
    /**
     * @dev Batch mint multiple NFTs
     * @param contributors Array of contributor addresses
     * @param names Array of NFT names
     * @param descriptions Array of NFT descriptions
     * @param uris Array of token URIs
     * @param rarities Array of rarity levels
     * @param categories Array of categories
     * @param frequencies Array of resonance frequencies
     */
    function batchMint(
        address[] memory contributors,
        string[] memory names,
        string[] memory descriptions,
        string[] memory uris,
        Rarity[] memory rarities,
        Category[] memory categories,
        uint256[] memory frequencies
    ) public onlyOwner returns (uint256[] memory) {
        require(
            contributors.length == names.length &&
            names.length == descriptions.length &&
            descriptions.length == uris.length &&
            uris.length == rarities.length &&
            rarities.length == categories.length &&
            categories.length == frequencies.length,
            "Array lengths must match"
        );
        
        uint256[] memory tokenIds = new uint256[](contributors.length);
        
        for (uint256 i = 0; i < contributors.length; i++) {
            tokenIds[i] = mintNFT(
                contributors[i],
                names[i],
                descriptions[i],
                uris[i],
                rarities[i],
                categories[i],
                frequencies[i]
            );
        }
        
        return tokenIds;
    }
    
    /**
     * @dev Update token URI
     * @param tokenId Token ID
     * @param uri New token URI
     */
    function updateTokenURI(uint256 tokenId, string memory uri) public onlyOwner {
        require(_ownerOf(tokenId) != address(0), "Token does not exist");
        _setTokenURI(tokenId, uri);
        _nftMetadata[tokenId].uri = uri;
        emit MetadataUpdated(tokenId, uri);
    }
    
    /**
     * @dev Get NFT metadata
     * @param tokenId Token ID
     */
    function getNFTMetadata(uint256 tokenId) public view returns (NFTMetadata memory) {
        require(_ownerOf(tokenId) != address(0), "Token does not exist");
        return _nftMetadata[tokenId];
    }
    
    /**
     * @dev Get NFTs by contributor
     * @param contributor Contributor address
     */
    function getNFTsByContributor(address contributor) public view returns (uint256[] memory) {
        return _contributorNFTs[contributor];
    }
    
    /**
     * @dev Get NFTs by rarity
     * @param rarity Rarity level
     */
    function getNFTsByRarity(Rarity rarity) public view returns (uint256[] memory) {
        uint256 totalSupply = _tokenIdCounter.current();
        uint256 count = 0;
        
        // Count matching tokens
        for (uint256 i = 0; i < totalSupply; i++) {
            if (_nftMetadata[i].rarity == rarity) {
                count++;
            }
        }
        
        // Create result array
        uint256[] memory result = new uint256[](count);
        uint256 index = 0;
        
        for (uint256 i = 0; i < totalSupply; i++) {
            if (_nftMetadata[i].rarity == rarity) {
                result[index] = i;
                index++;
            }
        }
        
        return result;
    }
    
    /**
     * @dev Get NFTs by category
     * @param category Category type
     */
    function getNFTsByCategory(Category category) public view returns (uint256[] memory) {
        uint256 totalSupply = _tokenIdCounter.current();
        uint256 count = 0;
        
        // Count matching tokens
        for (uint256 i = 0; i < totalSupply; i++) {
            if (_nftMetadata[i].category == category) {
                count++;
            }
        }
        
        // Create result array
        uint256[] memory result = new uint256[](count);
        uint256 index = 0;
        
        for (uint256 i = 0; i < totalSupply; i++) {
            if (_nftMetadata[i].category == category) {
                result[index] = i;
                index++;
            }
        }
        
        return result;
    }
    
    /**
     * @dev Get total supply
     */
    function getTotalSupply() public view returns (uint256) {
        return _tokenIdCounter.current();
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
