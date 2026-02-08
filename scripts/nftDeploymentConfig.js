/**
 * NFT Deployment Configuration
 * Comprehensive configuration for all NFT contracts in the ScrollVerse ecosystem
 */

const NFT_CONTRACTS = {
  ScrollSoulPleiadian: {
    name: "ScrollSoulPleiadian",
    description: "Enhanced Soul NFT with Pleiadian consciousness integration",
    features: [
      "Starseed Quest Integration",
      "LAM Transmission Gateway",
      "Sound Healing Metadata",
      "Russell Storytelling NFTs",
      "Unity Grid Chronicles",
      "Gaia Policy Funding",
      "DAO Governance Integration"
    ],
    resonanceFrequencies: [528, 963],
    priority: 1,
    verification: true,
    mintOnDeploy: false
  },
  
  ScrollVerseNFT: {
    name: "ScrollVerseNFT",
    description: "Core ScrollVerse NFT collection",
    features: [
      "ERC721 Standard",
      "URI Storage",
      "Enumerable",
      "Access Control"
    ],
    priority: 2,
    verification: true,
    mintOnDeploy: false
  },
  
  MansionChainNFT: {
    name: "MansionChainNFT",
    description: "Property and real estate NFTs",
    features: [
      "Property Rights Management",
      "Fractional Ownership",
      "Rental Integration",
      "DAO Governance"
    ],
    priority: 3,
    verification: true,
    mintOnDeploy: false
  },
  
  LegacyMusicCatalog: {
    name: "LegacyMusicCatalog",
    description: "Music rights and catalog NFTs",
    features: [
      "Music Rights Management",
      "Royalty Distribution",
      "Streaming Integration",
      "Artist Attribution"
    ],
    priority: 4,
    verification: true,
    mintOnDeploy: false
  },
  
  PhysicalAssetMachine3D: {
    name: "PhysicalAssetMachine3D",
    description: "Physical asset tokenization with 3D metadata",
    features: [
      "3D Asset Representation",
      "Physical Asset Linking",
      "Authenticity Verification",
      "Custody Tracking"
    ],
    priority: 5,
    verification: true,
    mintOnDeploy: false
  }
};

const DAO_CONTRACTS = {
  ScrollVerseDAO: {
    name: "ScrollVerseDAO",
    description: "Main governance DAO for ScrollVerse",
    dependencies: ["ScrollVerseNFT"],
    priority: 10,
    verification: true
  },
  
  MansionChainDAO: {
    name: "MansionChainDAO",
    description: "Property governance DAO",
    dependencies: ["MansionChainNFT"],
    priority: 11,
    verification: true
  },
  
  MedAirDAO: {
    name: "MedAirDAO",
    description: "Medical air quality governance DAO",
    dependencies: [],
    priority: 12,
    verification: true
  }
};

const TOKEN_CONTRACTS = {
  MedAirToken: {
    name: "MedAirToken",
    description: "MedAir utility token",
    priority: 20,
    verification: true
  },
  
  LegacyCoin: {
    name: "LegacyCoin",
    description: "Legacy music catalog token",
    priority: 21,
    verification: true
  },
  
  PropertySigilCoin: {
    name: "PropertySigilCoin",
    description: "Property-backed token",
    priority: 22,
    verification: true
  },
  
  SigilToken: {
    name: "SigilToken",
    description: "Core sigil utility token",
    priority: 23,
    verification: true
  }
};

const GOVERNANCE_CONTRACTS = {
  QueensSovereignty: {
    name: "QueensSovereignty",
    description: "Queens Sovereignty governance token",
    priority: 30,
    verification: true
  },
  
  MasterBuilder1222Governance: {
    name: "MasterBuilder1222Governance",
    description: "Master Builder 1222 meta-governance",
    priority: 31,
    verification: true
  },
  
  TruthLoom: {
    name: "TruthLoom",
    description: "Truth verification and governance",
    priority: 32,
    verification: true
  }
};

const ORACLE_CONTRACTS = {
  MedAirOracle: {
    name: "MedAirOracle",
    description: "Medical air quality oracle",
    priority: 40,
    verification: true
  }
};

const STAKING_CONTRACTS = {
  MedAirStaking: {
    name: "MedAirStaking",
    description: "MedAir token staking",
    dependencies: ["MedAirToken"],
    priority: 50,
    verification: true
  },
  
  MedAirInsurance: {
    name: "MedAirInsurance",
    description: "MedAir insurance pool",
    dependencies: ["MedAirToken"],
    priority: 51,
    verification: true
  }
};

const LEDGER_CONTRACTS = {
  AuraResonanceLedger: {
    name: "AuraResonanceLedger",
    description: "Aura and resonance tracking ledger",
    priority: 60,
    verification: true
  },
  
  AkashicRecordsLedger: {
    name: "AkashicRecordsLedger",
    description: "Akashic records storage ledger",
    priority: 61,
    verification: true
  }
};

const MULTITOKEN_CONTRACTS = {
  ScrollVerseMultiToken: {
    name: "ScrollVerseMultiToken",
    description: "ERC1155 multi-token implementation",
    priority: 70,
    verification: true
  }
};

// Network configurations
const NETWORK_CONFIG = {
  localhost: {
    confirmations: 1,
    gasPrice: "auto",
    timeout: 60000,
    verifyContracts: false
  },
  hardhat: {
    confirmations: 1,
    gasPrice: "auto",
    timeout: 60000,
    verifyContracts: false
  },
  sepolia: {
    confirmations: 5,
    gasPrice: "auto",
    timeout: 300000,
    verifyContracts: true
  },
  mumbai: {
    confirmations: 5,
    gasPrice: "auto",
    timeout: 300000,
    verifyContracts: true
  },
  polygon: {
    confirmations: 5,
    gasPrice: "auto",
    timeout: 300000,
    verifyContracts: true
  },
  mainnet: {
    confirmations: 10,
    gasPrice: "auto",
    timeout: 600000,
    verifyContracts: true
  }
};

// Deployment stages
const DEPLOYMENT_STAGES = {
  CORE_NFT: {
    name: "Core NFT Contracts",
    contracts: NFT_CONTRACTS,
    order: 1
  },
  GOVERNANCE: {
    name: "Governance Contracts",
    contracts: GOVERNANCE_CONTRACTS,
    order: 2
  },
  TOKENS: {
    name: "Token Contracts",
    contracts: TOKEN_CONTRACTS,
    order: 3
  },
  DAO: {
    name: "DAO Contracts",
    contracts: DAO_CONTRACTS,
    order: 4
  },
  ORACLE: {
    name: "Oracle Contracts",
    contracts: ORACLE_CONTRACTS,
    order: 5
  },
  STAKING: {
    name: "Staking Contracts",
    contracts: STAKING_CONTRACTS,
    order: 6
  },
  LEDGER: {
    name: "Ledger Contracts",
    contracts: LEDGER_CONTRACTS,
    order: 7
  },
  MULTITOKEN: {
    name: "Multi-Token Contracts",
    contracts: MULTITOKEN_CONTRACTS,
    order: 8
  }
};

// Export all configurations
export default {
  NFT_CONTRACTS,
  DAO_CONTRACTS,
  TOKEN_CONTRACTS,
  GOVERNANCE_CONTRACTS,
  ORACLE_CONTRACTS,
  STAKING_CONTRACTS,
  LEDGER_CONTRACTS,
  MULTITOKEN_CONTRACTS,
  NETWORK_CONFIG,
  DEPLOYMENT_STAGES,
  
  // Helper function to get all contracts
  getAllContracts: () => ({
    ...NFT_CONTRACTS,
    ...DAO_CONTRACTS,
    ...TOKEN_CONTRACTS,
    ...GOVERNANCE_CONTRACTS,
    ...ORACLE_CONTRACTS,
    ...STAKING_CONTRACTS,
    ...LEDGER_CONTRACTS,
    ...MULTITOKEN_CONTRACTS
  }),
  
  // Helper function to get contracts by stage
  getContractsByStage: (stage) => {
    return DEPLOYMENT_STAGES[stage]?.contracts || {};
  },
  
  // Helper function to get deployment order
  getDeploymentOrder: () => {
    return Object.entries(DEPLOYMENT_STAGES)
      .sort(([, a], [, b]) => a.order - b.order)
      .map(([key, value]) => ({ key, ...value }));
  }
};
