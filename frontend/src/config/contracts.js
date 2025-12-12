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
