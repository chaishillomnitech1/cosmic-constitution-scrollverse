// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

/**
 * @title ScrollVerseMultiToken
 * @dev ERC-1155 Multi-Token contract for ScrollVerse
 * Supports multiple token types, batch minting, and flexible asset management
 */
contract ScrollVerseMultiToken is ERC1155, Ownable {
    using Strings for uint256;
    
    // Token metadata
    struct TokenMetadata {
        string name;
        string description;
        uint256 maxSupply;
        uint256 currentSupply;
        uint256 resonanceFrequency;
        bool exists;
    }
    
    // Mapping from token ID to metadata
    mapping(uint256 => TokenMetadata) private _tokenMetadata;
    
    // Mapping from token ID to URI
    mapping(uint256 => string) private _tokenURIs;
    
    // Counter for token IDs
    uint256 private _tokenIdCounter;
    
    // Base URI for metadata
    string private _baseURI;
    
    // Events
    event TokenCreated(
        uint256 indexed tokenId,
        string name,
        uint256 maxSupply,
        uint256 resonanceFrequency
    );
    
    event TokenMinted(
        uint256 indexed tokenId,
        address indexed recipient,
        uint256 amount
    );
    
    event URIUpdated(uint256 indexed tokenId, string uri);
    
    constructor(string memory baseURI) ERC1155(baseURI) Ownable(msg.sender) {
        _baseURI = baseURI;
    }
    
    /**
     * @dev Create a new token type
     * @param name Token name
     * @param description Token description
     * @param maxSupply Maximum supply (0 for unlimited)
     * @param resonanceFrequency Resonance frequency
     * @param tokenURI Token-specific URI
     */
    function createToken(
        string memory name,
        string memory description,
        uint256 maxSupply,
        uint256 resonanceFrequency,
        string memory tokenURI
    ) public onlyOwner returns (uint256) {
        require(bytes(name).length > 0, "Name cannot be empty");
        
        uint256 tokenId = _tokenIdCounter;
        _tokenIdCounter++;
        
        _tokenMetadata[tokenId] = TokenMetadata({
            name: name,
            description: description,
            maxSupply: maxSupply,
            currentSupply: 0,
            resonanceFrequency: resonanceFrequency,
            exists: true
        });
        
        _tokenURIs[tokenId] = tokenURI;
        
        emit TokenCreated(tokenId, name, maxSupply, resonanceFrequency);
        
        return tokenId;
    }
    
    /**
     * @dev Mint tokens to a recipient
     * @param to Recipient address
     * @param tokenId Token ID
     * @param amount Amount to mint
     */
    function mint(
        address to,
        uint256 tokenId,
        uint256 amount
    ) public onlyOwner {
        require(_tokenMetadata[tokenId].exists, "Token does not exist");
        
        TokenMetadata storage metadata = _tokenMetadata[tokenId];
        
        if (metadata.maxSupply > 0) {
            require(
                metadata.currentSupply + amount <= metadata.maxSupply,
                "Exceeds max supply"
            );
        }
        
        metadata.currentSupply += amount;
        
        _mint(to, tokenId, amount, "");
        
        emit TokenMinted(tokenId, to, amount);
    }
    
    /**
     * @dev Batch mint multiple token types to a recipient
     * @param to Recipient address
     * @param tokenIds Array of token IDs
     * @param amounts Array of amounts
     */
    function mintBatch(
        address to,
        uint256[] memory tokenIds,
        uint256[] memory amounts
    ) public onlyOwner {
        require(tokenIds.length == amounts.length, "Arrays length mismatch");
        
        for (uint256 i = 0; i < tokenIds.length; i++) {
            require(_tokenMetadata[tokenIds[i]].exists, "Token does not exist");
            
            TokenMetadata storage metadata = _tokenMetadata[tokenIds[i]];
            
            if (metadata.maxSupply > 0) {
                require(
                    metadata.currentSupply + amounts[i] <= metadata.maxSupply,
                    "Exceeds max supply"
                );
            }
            
            metadata.currentSupply += amounts[i];
            emit TokenMinted(tokenIds[i], to, amounts[i]);
        }
        
        _mintBatch(to, tokenIds, amounts, "");
    }
    
    /**
     * @dev Reward contributors with tokens
     * @param contributors Array of contributor addresses
     * @param tokenId Token ID to mint
     * @param amounts Array of amounts for each contributor
     */
    function rewardContributors(
        address[] memory contributors,
        uint256 tokenId,
        uint256[] memory amounts
    ) public onlyOwner {
        require(contributors.length == amounts.length, "Arrays length mismatch");
        require(_tokenMetadata[tokenId].exists, "Token does not exist");
        
        for (uint256 i = 0; i < contributors.length; i++) {
            mint(contributors[i], tokenId, amounts[i]);
        }
    }
    
    /**
     * @dev Update token URI
     * @param tokenId Token ID
     * @param newURI New URI
     */
    function setTokenURI(uint256 tokenId, string memory newURI) public onlyOwner {
        require(_tokenMetadata[tokenId].exists, "Token does not exist");
        _tokenURIs[tokenId] = newURI;
        emit URIUpdated(tokenId, newURI);
    }
    
    /**
     * @dev Update base URI
     * @param newBaseURI New base URI
     */
    function setBaseURI(string memory newBaseURI) public onlyOwner {
        _baseURI = newBaseURI;
    }
    
    /**
     * @dev Get token URI
     * @param tokenId Token ID
     */
    function uri(uint256 tokenId) public view override returns (string memory) {
        require(_tokenMetadata[tokenId].exists, "Token does not exist");
        
        string memory tokenURI = _tokenURIs[tokenId];
        
        if (bytes(tokenURI).length > 0) {
            return tokenURI;
        }
        
        return string(abi.encodePacked(_baseURI, tokenId.toString()));
    }
    
    /**
     * @dev Get token metadata
     * @param tokenId Token ID
     */
    function getTokenMetadata(uint256 tokenId) public view returns (TokenMetadata memory) {
        require(_tokenMetadata[tokenId].exists, "Token does not exist");
        return _tokenMetadata[tokenId];
    }
    
    /**
     * @dev Get total number of token types created
     */
    function getTotalTokenTypes() public view returns (uint256) {
        return _tokenIdCounter;
    }
    
    /**
     * @dev Check if token exists
     * @param tokenId Token ID
     */
    function tokenExists(uint256 tokenId) public view returns (bool) {
        return _tokenMetadata[tokenId].exists;
    }
}
