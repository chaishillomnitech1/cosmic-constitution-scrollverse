// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title PropertySigilCoin
 * @dev ERC-20 token representing property-partner "Sigil Coins" with heritage crests
 * Supports fractional royalty sharing, gamified policies, and estate revenue tracking
 */
contract PropertySigilCoin is ERC20, Ownable, ReentrancyGuard {
    
    // Sigil metadata structure
    struct SigilMetadata {
        string sigilName;
        string heritageCrest;
        string propertyId; // Link to property NFT
        uint256 totalSupply;
        uint256 mintTimestamp;
        bool isActive;
    }
    
    // Fractional royalty structure
    struct RoyaltyShare {
        address holder;
        uint256 sharePercentage; // Basis points (10000 = 100%)
        uint256 totalEarned;
        uint256 lastClaimTimestamp;
    }
    
    // Estate revenue tracking
    struct EstateRevenue {
        uint256 virtualRevenue;
        uint256 digitalRevenue;
        uint256 totalDistributed;
        uint256 pendingDistribution;
        uint256 lastUpdateTimestamp;
    }
    
    // Gamified policy structure
    struct GamifiedPolicy {
        string policyName;
        uint256 rewardMultiplier; // Multiplier for rewards (10000 = 1x)
        uint256 minimumHolding; // Minimum coins to qualify
        uint256 lockupPeriodDays; // Days tokens must be held
        bool isActive;
    }
    
    // Proof ledger timeline entry
    struct LedgerEntry {
        uint256 entryId;
        string entryType; // "MINT", "TRANSFER", "REVENUE", "CLAIM"
        uint256 amount;
        address participant;
        string metadata;
        uint256 timestamp;
    }
    
    // Sigil metadata
    mapping(string => SigilMetadata) private _sigils;
    string[] private _sigilNames;
    
    // Royalty shares
    mapping(address => RoyaltyShare) private _royaltyShares;
    address[] private _royaltyHolders;
    
    // Estate revenue tracking
    EstateRevenue private _estateRevenue;
    
    // Gamified policies
    mapping(uint256 => GamifiedPolicy) private _policies;
    uint256 private _policyCounter;
    
    // User policy participation
    mapping(address => mapping(uint256 => bool)) private _userPolicies;
    mapping(address => uint256) private _lockupExpiry;
    
    // Proof ledger
    LedgerEntry[] private _ledgerEntries;
    
    // Economic valuation
    uint256 private _economicValuation;
    uint256 private _lastValuationTimestamp;
    
    // Events
    event SigilCreated(string indexed sigilName, string heritageCrest, string propertyId);
    event RoyaltyShareUpdated(address indexed holder, uint256 sharePercentage);
    event RevenueDistributed(uint256 amount, uint256 timestamp);
    event RoyaltyClaimed(address indexed holder, uint256 amount);
    event PolicyCreated(uint256 indexed policyId, string policyName);
    event PolicyJoined(address indexed user, uint256 indexed policyId);
    event LedgerEntryAdded(uint256 indexed entryId, string entryType, address participant);
    event ValuationUpdated(uint256 newValuation, uint256 timestamp);
    
    constructor(
        string memory name,
        string memory symbol,
        uint256 initialSupply
    ) ERC20(name, symbol) Ownable(msg.sender) {
        _mint(msg.sender, initialSupply * 10 ** decimals());
    }
    
    /**
     * @dev Create a new Sigil metadata entry
     * @param sigilName Name of the sigil
     * @param heritageCrest Heritage crest description
     * @param propertyId Associated property identifier
     * @param supply Total supply for this sigil
     */
    function createSigil(
        string memory sigilName,
        string memory heritageCrest,
        string memory propertyId,
        uint256 supply
    ) public onlyOwner {
        require(bytes(sigilName).length > 0, "Sigil name required");
        require(!_sigils[sigilName].isActive, "Sigil already exists");
        
        _sigils[sigilName] = SigilMetadata({
            sigilName: sigilName,
            heritageCrest: heritageCrest,
            propertyId: propertyId,
            totalSupply: supply,
            mintTimestamp: block.timestamp,
            isActive: true
        });
        
        _sigilNames.push(sigilName);
        
        _addLedgerEntry("SIGIL_CREATE", supply, msg.sender, sigilName);
        
        emit SigilCreated(sigilName, heritageCrest, propertyId);
    }
    
    /**
     * @dev Set or update royalty share for a holder
     * @param holder Address of the holder
     * @param sharePercentage Share percentage in basis points (10000 = 100%)
     */
    function setRoyaltyShare(address holder, uint256 sharePercentage) public onlyOwner {
        require(holder != address(0), "Invalid address");
        require(sharePercentage <= 10000, "Share too high");
        
        if (_royaltyShares[holder].holder == address(0)) {
            _royaltyHolders.push(holder);
        }
        
        _royaltyShares[holder].holder = holder;
        _royaltyShares[holder].sharePercentage = sharePercentage;
        
        emit RoyaltyShareUpdated(holder, sharePercentage);
    }
    
    /**
     * @dev Record estate revenue (virtual and digital)
     * @param virtualRevenue Revenue from virtual estates
     * @param digitalRevenue Revenue from digital estates
     */
    function recordEstateRevenue(
        uint256 virtualRevenue,
        uint256 digitalRevenue
    ) public onlyOwner {
        _estateRevenue.virtualRevenue += virtualRevenue;
        _estateRevenue.digitalRevenue += digitalRevenue;
        _estateRevenue.pendingDistribution += virtualRevenue + digitalRevenue;
        _estateRevenue.lastUpdateTimestamp = block.timestamp;
        
        _addLedgerEntry("REVENUE", virtualRevenue + digitalRevenue, msg.sender, "Estate revenue recorded");
    }
    
    /**
     * @dev Distribute pending revenue to royalty holders
     */
    function distributeRevenue() public onlyOwner nonReentrant {
        uint256 totalPending = _estateRevenue.pendingDistribution;
        require(totalPending > 0, "No pending distribution");
        
        for (uint256 i = 0; i < _royaltyHolders.length; i++) {
            address holder = _royaltyHolders[i];
            RoyaltyShare storage share = _royaltyShares[holder];
            
            uint256 holderShare = (totalPending * share.sharePercentage) / 10000;
            share.totalEarned += holderShare;
        }
        
        _estateRevenue.totalDistributed += totalPending;
        _estateRevenue.pendingDistribution = 0;
        
        emit RevenueDistributed(totalPending, block.timestamp);
        _addLedgerEntry("DISTRIBUTE", totalPending, msg.sender, "Revenue distributed");
    }
    
    /**
     * @dev Claim accumulated royalties
     */
    function claimRoyalty() public nonReentrant {
        RoyaltyShare storage share = _royaltyShares[msg.sender];
        require(share.holder == msg.sender, "No royalty share");
        require(share.totalEarned > 0, "Nothing to claim");
        
        uint256 claimAmount = share.totalEarned;
        share.totalEarned = 0;
        share.lastClaimTimestamp = block.timestamp;
        
        // Transfer tokens as royalty payment
        _transfer(owner(), msg.sender, claimAmount);
        
        emit RoyaltyClaimed(msg.sender, claimAmount);
        _addLedgerEntry("CLAIM", claimAmount, msg.sender, "Royalty claimed");
    }
    
    /**
     * @dev Create a gamified policy
     * @param policyName Policy name
     * @param rewardMultiplier Reward multiplier in basis points
     * @param minimumHolding Minimum coins required
     * @param lockupPeriodDays Lockup period in days
     */
    function createGamifiedPolicy(
        string memory policyName,
        uint256 rewardMultiplier,
        uint256 minimumHolding,
        uint256 lockupPeriodDays
    ) public onlyOwner returns (uint256) {
        require(bytes(policyName).length > 0, "Policy name required");
        
        uint256 policyId = _policyCounter;
        _policyCounter++;
        
        _policies[policyId] = GamifiedPolicy({
            policyName: policyName,
            rewardMultiplier: rewardMultiplier,
            minimumHolding: minimumHolding,
            lockupPeriodDays: lockupPeriodDays,
            isActive: true
        });
        
        emit PolicyCreated(policyId, policyName);
        
        return policyId;
    }
    
    /**
     * @dev Join a gamified policy
     * @param policyId Policy ID to join
     */
    function joinPolicy(uint256 policyId) public {
        GamifiedPolicy storage policy = _policies[policyId];
        require(policy.isActive, "Policy not active");
        require(balanceOf(msg.sender) >= policy.minimumHolding, "Insufficient balance");
        require(!_userPolicies[msg.sender][policyId], "Already joined");
        
        _userPolicies[msg.sender][policyId] = true;
        _lockupExpiry[msg.sender] = block.timestamp + (policy.lockupPeriodDays * 1 days);
        
        emit PolicyJoined(msg.sender, policyId);
        _addLedgerEntry("POLICY_JOIN", policyId, msg.sender, policy.policyName);
    }
    
    /**
     * @dev Update economic valuation
     * @param newValuation New valuation amount
     */
    function updateEconomicValuation(uint256 newValuation) public onlyOwner {
        _economicValuation = newValuation;
        _lastValuationTimestamp = block.timestamp;
        
        emit ValuationUpdated(newValuation, block.timestamp);
        _addLedgerEntry("VALUATION", newValuation, msg.sender, "Economic valuation updated");
    }
    
    /**
     * @dev Add entry to proof ledger
     * @param entryType Type of entry
     * @param amount Amount involved
     * @param participant Participant address
     * @param metadata Additional metadata
     */
    function _addLedgerEntry(
        string memory entryType,
        uint256 amount,
        address participant,
        string memory metadata
    ) private {
        uint256 entryId = _ledgerEntries.length;
        
        _ledgerEntries.push(LedgerEntry({
            entryId: entryId,
            entryType: entryType,
            amount: amount,
            participant: participant,
            metadata: metadata,
            timestamp: block.timestamp
        }));
        
        emit LedgerEntryAdded(entryId, entryType, participant);
    }
    
    /**
     * @dev Get sigil metadata
     * @param sigilName Sigil name
     */
    function getSigil(string memory sigilName) public view returns (SigilMetadata memory) {
        require(_sigils[sigilName].isActive, "Sigil not found");
        return _sigils[sigilName];
    }
    
    /**
     * @dev Get all sigil names
     */
    function getAllSigils() public view returns (string[] memory) {
        return _sigilNames;
    }
    
    /**
     * @dev Get royalty share for holder
     * @param holder Holder address
     */
    function getRoyaltyShare(address holder) public view returns (RoyaltyShare memory) {
        return _royaltyShares[holder];
    }
    
    /**
     * @dev Get estate revenue summary
     */
    function getEstateRevenue() public view returns (EstateRevenue memory) {
        return _estateRevenue;
    }
    
    /**
     * @dev Get gamified policy
     * @param policyId Policy ID
     */
    function getPolicy(uint256 policyId) public view returns (GamifiedPolicy memory) {
        return _policies[policyId];
    }
    
    /**
     * @dev Check if user has joined policy
     * @param user User address
     * @param policyId Policy ID
     */
    function hasJoinedPolicy(address user, uint256 policyId) public view returns (bool) {
        return _userPolicies[user][policyId];
    }
    
    /**
     * @dev Get ledger entries count
     */
    function getLedgerEntriesCount() public view returns (uint256) {
        return _ledgerEntries.length;
    }
    
    /**
     * @dev Get ledger entry by ID
     * @param entryId Entry ID
     */
    function getLedgerEntry(uint256 entryId) public view returns (LedgerEntry memory) {
        require(entryId < _ledgerEntries.length, "Entry not found");
        return _ledgerEntries[entryId];
    }
    
    /**
     * @dev Get recent ledger entries
     * @param count Number of entries to return
     */
    function getRecentLedgerEntries(uint256 count) public view returns (LedgerEntry[] memory) {
        uint256 total = _ledgerEntries.length;
        uint256 returnCount = count > total ? total : count;
        
        LedgerEntry[] memory entries = new LedgerEntry[](returnCount);
        
        for (uint256 i = 0; i < returnCount; i++) {
            entries[i] = _ledgerEntries[total - returnCount + i];
        }
        
        return entries;
    }
    
    /**
     * @dev Get current economic valuation
     */
    function getEconomicValuation() public view returns (uint256, uint256) {
        return (_economicValuation, _lastValuationTimestamp);
    }
    
    /**
     * @dev Override transfer to enforce lockup periods
     */
    function _update(address from, address to, uint256 value) internal virtual override {
        if (from != address(0) && from != owner()) {
            require(block.timestamp >= _lockupExpiry[from], "Tokens locked");
        }
        super._update(from, to, value);
        
        if (from != address(0) && to != address(0)) {
            _addLedgerEntry("TRANSFER", value, from, "Token transfer");
        }
    }
}
