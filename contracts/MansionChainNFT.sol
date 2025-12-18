// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title MansionChainNFT
 * @dev High-fidelity digital property twin NFT contract for elite real estate
 * Supports architectural metadata, interactive hotspots, virtual walkthrough events,
 * and blockchain plaque QR code signatures
 */
contract MansionChainNFT is ERC721, ERC721URIStorage, ERC721Enumerable, Ownable, ReentrancyGuard {
    
    uint256 private _tokenIdCounter;
    
    // Property Categories
    enum PropertyType { CHATEAU, MANSION, VILLA, ESTATE, PALACE, HISTORIC_MONUMENT }
    
    // Property Era
    enum PropertyEra { ANCIENT, MEDIEVAL, RENAISSANCE, BAROQUE, MODERN, CONTEMPORARY }
    
    // Interactive Hotspot structure
    struct Hotspot {
        string title;
        string description;
        string architecturalHighlight;
        string builderCredits;
        string materialHistory;
        uint256 positionX; // Coordinate in virtual space
        uint256 positionY;
        uint256 positionZ;
    }
    
    // Virtual Walkthrough Event structure
    struct VirtualWalkthrough {
        uint256 eventId;
        uint256 scheduledTimestamp;
        uint256 durationMinutes;
        string eventDescription;
        bool isExclusive; // Only for NFT holders
        bool isActive;
        mapping(address => bool) attendees;
        uint256 maxAttendees;
        uint256 currentAttendees;
    }
    
    // Property Digital Twin Metadata
    struct PropertyTwin {
        string propertyName;
        string location;
        PropertyType propertyType;
        PropertyEra era;
        string description;
        string unrealEngineModelURI; // Link to UE5 model
        string qrCodeHash; // Blockchain plaque QR signature
        string physicalPlaqueId; // Physical plaque identifier
        uint256 constructionYear;
        uint256 squareFootage;
        string architect;
        uint256 mintTimestamp;
        bool hasPhysicalTwin; // Whether physical property exists
    }
    
    // Chronicles of Stone Story structure
    struct StoneChronicle {
        string chronicleTitle;
        string storyContentURI; // IPFS link to story
        string videoContentURI; // 5-minute short film link
        uint256 videoDurationSeconds;
        string historicSignificance;
        string engineeringFeats;
        string modernSynergies; // Connection to modern designs
        bool fractionalMediaRights; // Enable fractional media rights
        uint256 mediaRightsPercentage; // Percentage for NFT holders
    }
    
    // Mapping from token ID to property metadata
    mapping(uint256 => PropertyTwin) private _propertyTwins;
    
    // Mapping from token ID to hotspots
    mapping(uint256 => Hotspot[]) private _hotspots;
    
    // Mapping from token ID to chronicles
    mapping(uint256 => StoneChronicle) private _stoneChronicles;
    
    // Mapping from token ID to virtual walkthroughs
    mapping(uint256 => uint256[]) private _propertyWalkthroughs;
    mapping(uint256 => VirtualWalkthrough) private _walkthroughs;
    uint256 private _walkthroughCounter;
    
    // Mapping from QR code hash to token ID
    mapping(string => uint256) private _qrToToken;
    
    // Mapping from physical plaque ID to token ID
    mapping(string => uint256) private _plaqueToToken;
    
    // Events
    event PropertyTwinMinted(
        uint256 indexed tokenId,
        string propertyName,
        PropertyType propertyType,
        string qrCodeHash
    );
    
    event HotspotAdded(
        uint256 indexed tokenId,
        string title,
        string architecturalHighlight
    );
    
    event ChronicleCreated(
        uint256 indexed tokenId,
        string chronicleTitle,
        string videoContentURI
    );
    
    event WalkthroughScheduled(
        uint256 indexed eventId,
        uint256 indexed tokenId,
        uint256 scheduledTimestamp,
        bool isExclusive
    );
    
    event WalkthroughAttendanceRegistered(
        uint256 indexed eventId,
        address indexed attendee
    );
    
    constructor() ERC721("Mansion Chain Digital Twin", "MANSION") Ownable(msg.sender) {}
    
    /**
     * @dev Mint a new property digital twin NFT
     * @param to Address to mint to
     * @param propertyName Name of the property
     * @param location Geographic location
     * @param propertyType Type of property
     * @param era Historical era
     * @param description Detailed description
     * @param unrealEngineModelURI Link to UE5 model
     * @param qrCodeHash Blockchain plaque QR signature
     * @param physicalPlaqueId Physical plaque identifier
     * @param constructionYear Year of construction
     * @param squareFootage Property size
     * @param architect Architect name
     * @param hasPhysicalTwin Whether physical property exists
     */
    function mintPropertyTwin(
        address to,
        string memory propertyName,
        string memory location,
        PropertyType propertyType,
        PropertyEra era,
        string memory description,
        string memory unrealEngineModelURI,
        string memory qrCodeHash,
        string memory physicalPlaqueId,
        uint256 constructionYear,
        uint256 squareFootage,
        string memory architect,
        bool hasPhysicalTwin
    ) public onlyOwner returns (uint256) {
        require(to != address(0), "Invalid address");
        require(bytes(propertyName).length > 0, "Property name required");
        require(bytes(qrCodeHash).length > 0, "QR code hash required");
        require(_qrToToken[qrCodeHash] == 0, "QR code already used");
        
        uint256 tokenId = _tokenIdCounter;
        _tokenIdCounter++;
        
        _safeMint(to, tokenId);
        
        _propertyTwins[tokenId] = PropertyTwin({
            propertyName: propertyName,
            location: location,
            propertyType: propertyType,
            era: era,
            description: description,
            unrealEngineModelURI: unrealEngineModelURI,
            qrCodeHash: qrCodeHash,
            physicalPlaqueId: physicalPlaqueId,
            constructionYear: constructionYear,
            squareFootage: squareFootage,
            architect: architect,
            mintTimestamp: block.timestamp,
            hasPhysicalTwin: hasPhysicalTwin
        });
        
        _qrToToken[qrCodeHash] = tokenId;
        if (bytes(physicalPlaqueId).length > 0) {
            _plaqueToToken[physicalPlaqueId] = tokenId;
        }
        
        emit PropertyTwinMinted(tokenId, propertyName, propertyType, qrCodeHash);
        
        return tokenId;
    }
    
    /**
     * @dev Add an interactive hotspot to a property
     * @param tokenId Token ID of the property
     * @param title Hotspot title
     * @param description Hotspot description
     * @param architecturalHighlight Architectural details
     * @param builderCredits Builder information
     * @param materialHistory Material history
     * @param positionX X coordinate
     * @param positionY Y coordinate
     * @param positionZ Z coordinate
     */
    function addHotspot(
        uint256 tokenId,
        string memory title,
        string memory description,
        string memory architecturalHighlight,
        string memory builderCredits,
        string memory materialHistory,
        uint256 positionX,
        uint256 positionY,
        uint256 positionZ
    ) public onlyOwner {
        require(_ownerOf(tokenId) != address(0), "Token does not exist");
        
        _hotspots[tokenId].push(Hotspot({
            title: title,
            description: description,
            architecturalHighlight: architecturalHighlight,
            builderCredits: builderCredits,
            materialHistory: materialHistory,
            positionX: positionX,
            positionY: positionY,
            positionZ: positionZ
        }));
        
        emit HotspotAdded(tokenId, title, architecturalHighlight);
    }
    
    /**
     * @dev Create a Chronicles of Stone story for a property
     * @param tokenId Token ID of the property
     * @param chronicleTitle Title of the chronicle
     * @param storyContentURI IPFS link to story content
     * @param videoContentURI Link to 5-minute video
     * @param videoDurationSeconds Video duration
     * @param historicSignificance Historic significance description
     * @param engineeringFeats Engineering accomplishments
     * @param modernSynergies Modern design connections
     * @param mediaRightsPercentage Fractional media rights percentage
     */
    function createChronicle(
        uint256 tokenId,
        string memory chronicleTitle,
        string memory storyContentURI,
        string memory videoContentURI,
        uint256 videoDurationSeconds,
        string memory historicSignificance,
        string memory engineeringFeats,
        string memory modernSynergies,
        uint256 mediaRightsPercentage
    ) public onlyOwner {
        require(_ownerOf(tokenId) != address(0), "Token does not exist");
        require(mediaRightsPercentage <= 10000, "Percentage too high"); // Max 100%
        
        _stoneChronicles[tokenId] = StoneChronicle({
            chronicleTitle: chronicleTitle,
            storyContentURI: storyContentURI,
            videoContentURI: videoContentURI,
            videoDurationSeconds: videoDurationSeconds,
            historicSignificance: historicSignificance,
            engineeringFeats: engineeringFeats,
            modernSynergies: modernSynergies,
            fractionalMediaRights: mediaRightsPercentage > 0,
            mediaRightsPercentage: mediaRightsPercentage
        });
        
        emit ChronicleCreated(tokenId, chronicleTitle, videoContentURI);
    }
    
    /**
     * @dev Schedule a virtual walkthrough event
     * @param tokenId Token ID of the property
     * @param scheduledTimestamp Event timestamp
     * @param durationMinutes Event duration
     * @param eventDescription Event description
     * @param isExclusive Whether event is exclusive to NFT holders
     * @param maxAttendees Maximum number of attendees
     */
    function scheduleWalkthrough(
        uint256 tokenId,
        uint256 scheduledTimestamp,
        uint256 durationMinutes,
        string memory eventDescription,
        bool isExclusive,
        uint256 maxAttendees
    ) public onlyOwner returns (uint256) {
        require(_ownerOf(tokenId) != address(0), "Token does not exist");
        require(scheduledTimestamp > block.timestamp, "Must be future timestamp");
        
        uint256 eventId = _walkthroughCounter;
        _walkthroughCounter++;
        
        VirtualWalkthrough storage walkthrough = _walkthroughs[eventId];
        walkthrough.eventId = eventId;
        walkthrough.scheduledTimestamp = scheduledTimestamp;
        walkthrough.durationMinutes = durationMinutes;
        walkthrough.eventDescription = eventDescription;
        walkthrough.isExclusive = isExclusive;
        walkthrough.isActive = true;
        walkthrough.maxAttendees = maxAttendees;
        walkthrough.currentAttendees = 0;
        
        _propertyWalkthroughs[tokenId].push(eventId);
        
        emit WalkthroughScheduled(eventId, tokenId, scheduledTimestamp, isExclusive);
        
        return eventId;
    }
    
    /**
     * @dev Register attendance for a virtual walkthrough
     * @param eventId Event ID
     */
    function registerForWalkthrough(uint256 eventId) public {
        VirtualWalkthrough storage walkthrough = _walkthroughs[eventId];
        require(walkthrough.isActive, "Event not active");
        require(!walkthrough.attendees[msg.sender], "Already registered");
        require(walkthrough.currentAttendees < walkthrough.maxAttendees, "Event full");
        
        if (walkthrough.isExclusive) {
            require(balanceOf(msg.sender) > 0, "Must own Mansion NFT");
        }
        
        walkthrough.attendees[msg.sender] = true;
        walkthrough.currentAttendees++;
        
        emit WalkthroughAttendanceRegistered(eventId, msg.sender);
    }
    
    /**
     * @dev Get property twin metadata
     * @param tokenId Token ID
     */
    function getPropertyTwin(uint256 tokenId) public view returns (PropertyTwin memory) {
        require(_ownerOf(tokenId) != address(0), "Token does not exist");
        return _propertyTwins[tokenId];
    }
    
    /**
     * @dev Get hotspots for a property
     * @param tokenId Token ID
     */
    function getHotspots(uint256 tokenId) public view returns (Hotspot[] memory) {
        require(_ownerOf(tokenId) != address(0), "Token does not exist");
        return _hotspots[tokenId];
    }
    
    /**
     * @dev Get chronicle for a property
     * @param tokenId Token ID
     */
    function getChronicle(uint256 tokenId) public view returns (StoneChronicle memory) {
        require(_ownerOf(tokenId) != address(0), "Token does not exist");
        return _stoneChronicles[tokenId];
    }
    
    /**
     * @dev Get property by QR code
     * @param qrCodeHash QR code hash
     */
    function getPropertyByQR(string memory qrCodeHash) public view returns (uint256) {
        uint256 tokenId = _qrToToken[qrCodeHash];
        require(tokenId > 0 || (tokenId == 0 && bytes(_propertyTwins[0].qrCodeHash).length > 0), "QR code not found");
        return tokenId;
    }
    
    /**
     * @dev Get property by plaque ID
     * @param physicalPlaqueId Physical plaque identifier
     */
    function getPropertyByPlaque(string memory physicalPlaqueId) public view returns (uint256) {
        uint256 tokenId = _plaqueToToken[physicalPlaqueId];
        require(tokenId > 0 || (tokenId == 0 && bytes(_propertyTwins[0].physicalPlaqueId).length > 0), "Plaque not found");
        return tokenId;
    }
    
    /**
     * @dev Check if address is registered for walkthrough
     * @param eventId Event ID
     * @param attendee Address to check
     */
    function isRegisteredForWalkthrough(uint256 eventId, address attendee) public view returns (bool) {
        return _walkthroughs[eventId].attendees[attendee];
    }
    
    /**
     * @dev Get walkthrough event IDs for a property
     * @param tokenId Token ID
     */
    function getPropertyWalkthroughs(uint256 tokenId) public view returns (uint256[] memory) {
        require(_ownerOf(tokenId) != address(0), "Token does not exist");
        return _propertyWalkthroughs[tokenId];
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
