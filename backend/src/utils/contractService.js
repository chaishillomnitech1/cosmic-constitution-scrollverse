const { ethers } = require('ethers');
const web3Provider = require('../utils/web3Provider');
const config = require('../config');
const logger = require('../utils/logger');

// Import ABIs (in production, these would come from compiled contracts)
const ScrollVerseNFT_ABI = require('./abis/ScrollVerseNFT.json');
const ScrollVerseMultiToken_ABI = require('./abis/ScrollVerseMultiToken.json');
const ScrollVerseDAO_ABI = require('./abis/ScrollVerseDAO.json');

class ContractService {
  constructor() {
    this.provider = web3Provider.getProvider();
    this.contracts = {};
    this.initializeContracts();
  }

  initializeContracts() {
    try {
      // Initialize NFT contract
      if (config.contracts.nft) {
        this.contracts.nft = new ethers.Contract(
          config.contracts.nft,
          ScrollVerseNFT_ABI,
          this.provider
        );
        logger.info('NFT contract initialized');
      }

      // Initialize MultiToken contract
      if (config.contracts.multiToken) {
        this.contracts.multiToken = new ethers.Contract(
          config.contracts.multiToken,
          ScrollVerseMultiToken_ABI,
          this.provider
        );
        logger.info('MultiToken contract initialized');
      }

      // Initialize DAO contract
      if (config.contracts.dao) {
        this.contracts.dao = new ethers.Contract(
          config.contracts.dao,
          ScrollVerseDAO_ABI,
          this.provider
        );
        logger.info('DAO contract initialized');
      }
    } catch (error) {
      logger.error('Failed to initialize contracts:', error);
    }
  }

  getContract(contractName) {
    const contract = this.contracts[contractName];
    if (!contract) {
      throw new Error(`Contract ${contractName} not initialized`);
    }
    return contract;
  }

  getContractWithSigner(contractName) {
    const contract = this.getContract(contractName);
    const signer = web3Provider.getSigner();
    return contract.connect(signer);
  }

  // NFT Contract Methods
  async getNFTMetadata(tokenId) {
    try {
      const contract = this.getContract('nft');
      const metadata = await contract.getNFTMetadata(tokenId);
      return {
        name: metadata.name,
        description: metadata.description,
        uri: metadata.uri,
        rarity: metadata.rarity,
        category: metadata.category,
        resonanceFrequency: metadata.resonanceFrequency.toString(),
        contributor: metadata.contributor,
        mintTimestamp: metadata.mintTimestamp.toString(),
      };
    } catch (error) {
      logger.error('Error getting NFT metadata:', error);
      throw error;
    }
  }

  async getNFTsByContributor(address) {
    try {
      const contract = this.getContract('nft');
      const tokenIds = await contract.getNFTsByContributor(address);
      return tokenIds.map(id => id.toString());
    } catch (error) {
      logger.error('Error getting NFTs by contributor:', error);
      throw error;
    }
  }

  async getTotalNFTSupply() {
    try {
      const contract = this.getContract('nft');
      const supply = await contract.getTotalSupply();
      return supply.toString();
    } catch (error) {
      logger.error('Error getting total NFT supply:', error);
      throw error;
    }
  }

  async mintNFT(contributorAddress, nftData) {
    try {
      const contract = this.getContractWithSigner('nft');
      const tx = await contract.mintNFT(
        contributorAddress,
        nftData.name,
        nftData.description,
        nftData.uri,
        nftData.rarity,
        nftData.category,
        nftData.resonanceFrequency
      );
      
      logger.info(`NFT minting transaction sent: ${tx.hash}`);
      const receipt = await tx.wait();
      logger.info(`NFT minted successfully in block ${receipt.blockNumber}`);
      
      return {
        transactionHash: receipt.hash,
        blockNumber: receipt.blockNumber,
        gasUsed: receipt.gasUsed.toString(),
      };
    } catch (error) {
      logger.error('Error minting NFT:', error);
      throw error;
    }
  }

  // MultiToken Contract Methods
  async getTokenMetadata(tokenId) {
    try {
      const contract = this.getContract('multiToken');
      const metadata = await contract.getTokenMetadata(tokenId);
      return {
        name: metadata.name,
        description: metadata.description,
        maxSupply: metadata.maxSupply.toString(),
        currentSupply: metadata.currentSupply.toString(),
        resonanceFrequency: metadata.resonanceFrequency.toString(),
        exists: metadata.exists,
      };
    } catch (error) {
      logger.error('Error getting token metadata:', error);
      throw error;
    }
  }

  async createToken(tokenData) {
    try {
      const contract = this.getContractWithSigner('multiToken');
      const tx = await contract.createToken(
        tokenData.name,
        tokenData.description,
        tokenData.maxSupply,
        tokenData.resonanceFrequency,
        tokenData.uri
      );
      
      logger.info(`Token creation transaction sent: ${tx.hash}`);
      const receipt = await tx.wait();
      logger.info(`Token created successfully in block ${receipt.blockNumber}`);
      
      return {
        transactionHash: receipt.hash,
        blockNumber: receipt.blockNumber,
        gasUsed: receipt.gasUsed.toString(),
      };
    } catch (error) {
      logger.error('Error creating token:', error);
      throw error;
    }
  }

  // DAO Contract Methods
  async getProposal(proposalId) {
    try {
      const contract = this.getContract('dao');
      const proposal = await contract.getProposal(proposalId);
      return {
        id: proposal.id.toString(),
        title: proposal.title,
        description: proposal.description,
        proposer: proposal.proposer,
        startTime: proposal.startTime.toString(),
        endTime: proposal.endTime.toString(),
        votesFor: proposal.votesFor.toString(),
        votesAgainst: proposal.votesAgainst.toString(),
        executed: proposal.executed,
        passed: proposal.passed,
        proposalType: proposal.proposalType,
      };
    } catch (error) {
      logger.error('Error getting proposal:', error);
      throw error;
    }
  }

  async getProposalCount() {
    try {
      const contract = this.getContract('dao');
      const count = await contract.proposalCount();
      return count.toString();
    } catch (error) {
      logger.error('Error getting proposal count:', error);
      throw error;
    }
  }

  async createProposal(proposalData) {
    try {
      const contract = this.getContractWithSigner('dao');
      const tx = await contract.createProposal(
        proposalData.title,
        proposalData.description,
        proposalData.proposalType,
        proposalData.proposalData || '0x'
      );
      
      logger.info(`Proposal creation transaction sent: ${tx.hash}`);
      const receipt = await tx.wait();
      logger.info(`Proposal created successfully in block ${receipt.blockNumber}`);
      
      return {
        transactionHash: receipt.hash,
        blockNumber: receipt.blockNumber,
        gasUsed: receipt.gasUsed.toString(),
      };
    } catch (error) {
      logger.error('Error creating proposal:', error);
      throw error;
    }
  }
}

// Singleton instance
const contractService = new ContractService();

module.exports = contractService;
