const { ethers } = require('ethers');
const config = require('../config');
const logger = require('./logger');

class Web3Provider {
  constructor() {
    this.provider = null;
    this.signer = null;
    this.initialize();
  }

  initialize() {
    try {
      // Initialize provider based on configuration
      if (config.alchemy.mumbaiUrl && config.nodeEnv === 'development') {
        this.provider = new ethers.JsonRpcProvider(config.alchemy.mumbaiUrl);
        logger.info('Connected to Alchemy Mumbai testnet');
      } else {
        this.provider = new ethers.JsonRpcProvider(config.eth.rpcUrl);
        logger.info('Connected to Ethereum mainnet');
      }

      // Initialize signer if private key is available
      if (config.eth.privateKey) {
        this.signer = new ethers.Wallet(config.eth.privateKey, this.provider);
        logger.info('Signer initialized');
      } else {
        logger.warn('No private key provided - read-only mode');
      }
    } catch (error) {
      logger.error('Failed to initialize Web3 provider:', error);
      throw error;
    }
  }

  getProvider() {
    return this.provider;
  }

  getSigner() {
    if (!this.signer) {
      throw new Error('Signer not available - private key required');
    }
    return this.signer;
  }

  async getBlockNumber() {
    try {
      return await this.provider.getBlockNumber();
    } catch (error) {
      logger.error('Error getting block number:', error);
      throw error;
    }
  }

  async getGasPrice() {
    try {
      const feeData = await this.provider.getFeeData();
      return feeData.gasPrice;
    } catch (error) {
      logger.error('Error getting gas price:', error);
      throw error;
    }
  }

  async estimateGas(transaction) {
    try {
      return await this.provider.estimateGas(transaction);
    } catch (error) {
      logger.error('Error estimating gas:', error);
      throw error;
    }
  }

  async getBalance(address) {
    try {
      const balance = await this.provider.getBalance(address);
      return ethers.formatEther(balance);
    } catch (error) {
      logger.error('Error getting balance:', error);
      throw error;
    }
  }

  async getTransactionReceipt(txHash) {
    try {
      return await this.provider.getTransactionReceipt(txHash);
    } catch (error) {
      logger.error('Error getting transaction receipt:', error);
      throw error;
    }
  }

  async waitForTransaction(txHash, confirmations = 1) {
    try {
      const receipt = await this.provider.waitForTransaction(txHash, confirmations);
      return receipt;
    } catch (error) {
      logger.error('Error waiting for transaction:', error);
      throw error;
    }
  }
}

// Singleton instance
const web3Provider = new Web3Provider();

module.exports = web3Provider;
