// Simplified ABIs for the smart contracts
// Full ABIs should be imported from compiled contract artifacts

export const ScrollVerseNFT_ABI = [
  "function mintNFT(address contributor, string name, string description, string uri, uint8 rarity, uint8 category, uint256 resonanceFrequency) public returns (uint256)",
  "function batchMint(address[] contributors, string[] names, string[] descriptions, string[] uris, uint8[] rarities, uint8[] categories, uint256[] frequencies) public returns (uint256[])",
  "function getNFTMetadata(uint256 tokenId) public view returns (tuple(string name, string description, string uri, uint8 rarity, uint8 category, uint256 resonanceFrequency, address contributor, uint256 mintTimestamp))",
  "function getNFTsByContributor(address contributor) public view returns (uint256[])",
  "function getNFTsByRarity(uint8 rarity) public view returns (uint256[])",
  "function getNFTsByCategory(uint8 category) public view returns (uint256[])",
  "function getTotalSupply() public view returns (uint256)",
  "function tokenURI(uint256 tokenId) public view returns (string)",
  "function balanceOf(address owner) public view returns (uint256)",
  "function ownerOf(uint256 tokenId) public view returns (address)",
  "event NFTMinted(uint256 indexed tokenId, address indexed contributor, string name, uint8 rarity, uint8 category)"
];

export const ScrollVerseMultiToken_ABI = [
  "function createToken(string name, string description, uint256 maxSupply, uint256 resonanceFrequency, string tokenURI) public returns (uint256)",
  "function mint(address to, uint256 tokenId, uint256 amount) public",
  "function mintBatch(address to, uint256[] tokenIds, uint256[] amounts) public",
  "function rewardContributors(address[] contributors, uint256 tokenId, uint256[] amounts) public",
  "function getTokenMetadata(uint256 tokenId) public view returns (tuple(string name, string description, uint256 maxSupply, uint256 currentSupply, uint256 resonanceFrequency, bool exists))",
  "function getTotalTokenTypes() public view returns (uint256)",
  "function balanceOf(address account, uint256 id) public view returns (uint256)",
  "function balanceOfBatch(address[] accounts, uint256[] ids) public view returns (uint256[])",
  "event TokenCreated(uint256 indexed tokenId, string name, uint256 maxSupply, uint256 resonanceFrequency)",
  "event TokenMinted(uint256 indexed tokenId, address indexed recipient, uint256 amount)"
];

export const ScrollVerseDAO_ABI = [
  "function createProposal(string title, string description, uint8 proposalType, bytes proposalData) public returns (uint256)",
  "function castVote(uint256 proposalId, bool support) public",
  "function executeProposal(uint256 proposalId) public",
  "function getProposal(uint256 proposalId) public view returns (tuple(uint256 id, string title, string description, address proposer, uint256 startTime, uint256 endTime, uint256 votesFor, uint256 votesAgainst, bool executed, bool passed, uint8 proposalType, bytes proposalData))",
  "function hasReachedQuorum(uint256 proposalId) public view returns (bool)",
  "function getVotingStatus(uint256 proposalId, address voter) public view returns (bool voted, bool support, uint256 weight)",
  "function proposalCount() public view returns (uint256)",
  "function votingPeriod() public view returns (uint256)",
  "function quorumPercentage() public view returns (uint256)",
  "event ProposalCreated(uint256 indexed proposalId, address indexed proposer, string title, uint8 proposalType, uint256 endTime)",
  "event VoteCast(uint256 indexed proposalId, address indexed voter, bool support, uint256 weight)",
  "event ProposalExecuted(uint256 indexed proposalId, bool passed)"
];

// Enums
export const Rarity = {
  COMMON: 0,
  UNCOMMON: 1,
  RARE: 2,
  EPIC: 3,
  LEGENDARY: 4
};

export const Category = {
  LUXURY_ITEM: 0,
  VEHICLE: 1,
  DIGITAL_ART: 2,
  COSMIC_SCROLL: 3,
  OTHER: 4
};

export const ProposalType = {
  NFT_CLEANUP: 0,
  PARAMETER_CHANGE: 1,
  TREASURY_ACTION: 2,
  OTHER: 3
};

// Queens Sovereignty Contract ABI
export const QueensSovereignty_ABI = [
  "function mintCrown(address queenAddress, string name, string description, string uri, uint8 crownType, uint256 coherenceScore, uint256 geminidRandomSeed) public returns (uint256)",
  "function batchMintCrowns(address[] queenAddresses, string[] names, string[] descriptions, string[] uris, uint8[] crownTypes, uint256[] coherenceScores, uint256[] geminidRandomSeeds) external returns (uint256[])",
  "function autoTriggerCoherenceMint(address queenAddress, string name, string description, string uri, uint8 crownType, uint256 coherenceScore, uint256 geminidRandomSeed) external returns (uint256)",
  "function updateCoherence(uint256 tokenId, uint256 newCoherenceScore) external",
  "function applyAkashicUpgrade(uint256 tokenId, string newMetadataURI) external",
  "function addHarlemTribute(uint256 tokenId, string tributeData) external",
  "function getCrownMetadata(uint256 tokenId) external view returns (tuple(string name, string description, string uri, uint8 crownType, uint8 coherenceLevel, uint256 resonanceFrequency, uint256 geminidRandomSeed, address queenAddress, uint256 crownTimestamp, uint256 coherenceScore, bool isAkashicUpgraded, string harlemTributeData))",
  "function getCrownsByQueen(address queenAddress) external view returns (uint256[])",
  "function getTotalMintedByCrownType(uint8 crownType) external view returns (uint256)",
  "function getTotalCrowns() external view returns (uint256)",
  "function balanceOf(address owner) public view returns (uint256)",
  "function ownerOf(uint256 tokenId) public view returns (address)",
  "function akashicExpansionActive() public view returns (bool)",
  "function coherenceOracle() public view returns (address)",
  "event CrownMinted(uint256 indexed tokenId, address indexed queenAddress, uint8 crownType, uint256 coherenceScore)",
  "event BatchCrownsMinted(uint256[] tokenIds, address[] queenAddresses, uint8[] crownTypes)",
  "event CoherenceUpdated(uint256 indexed tokenId, uint256 oldCoherence, uint256 newCoherence, uint8 newLevel)",
  "event AkashicUpgrade(uint256 indexed tokenId, string newMetadataURI)",
  "event HarlemTributeAdded(uint256 indexed tokenId, string tributeData)"
];

// MedAir Oracle ABI
export const MedAirOracle_ABI = [
  "function coherenceData(address user) public view returns (tuple(uint256 coherenceScore, uint256 frequencyAlignment, uint256 timestamp, bool validated))",
  "function updateCoherence(address user, uint256 coherenceScore, uint256 frequencyAlignment) external",
  "function getCoherenceScore(address user) public view returns (uint256)",
  "function authorizedReporters(address reporter) public view returns (bool)",
  "event CoherenceUpdated(address indexed user, uint256 coherenceScore, uint256 frequencyAlignment)"
];

// Crown Types
export const CrownType = {
  MIKA_SOVEREIGN: 0,
  LILATH_DIVINE: 1,
  LITTLE_WARREN_COSMIC: 2,
  HARLEM_QUEENS_TRIBUTE: 3,
  AKASHIC_SENTIENT: 4
};

// Coherence Levels
export const CoherenceLevel = {
  EMERGING: 0,
  ALIGNED: 1,
  HARMONIOUS: 2,
  SOVEREIGN: 3,
  DIVINE: 4
};
