const contractService = require('../utils/contractService');
const logger = require('../utils/logger');

class NFTController {
  // Get NFT metadata
  async getMetadata(req, res) {
    try {
      const { tokenId } = req.params;
      
      if (!tokenId || isNaN(tokenId)) {
        return res.status(400).json({ error: 'Invalid token ID' });
      }

      const metadata = await contractService.getNFTMetadata(parseInt(tokenId));
      
      res.json({
        success: true,
        data: metadata,
      });
    } catch (error) {
      logger.error('Error in getMetadata:', error);
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }

  // Get NFTs by contributor
  async getByContributor(req, res) {
    try {
      const { address } = req.params;
      
      if (!address || !/^0x[a-fA-F0-9]{40}$/.test(address)) {
        return res.status(400).json({ error: 'Invalid Ethereum address' });
      }

      const tokenIds = await contractService.getNFTsByContributor(address);
      
      res.json({
        success: true,
        data: {
          address,
          tokenIds,
          count: tokenIds.length,
        },
      });
    } catch (error) {
      logger.error('Error in getByContributor:', error);
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }

  // Get total supply
  async getTotalSupply(req, res) {
    try {
      const totalSupply = await contractService.getTotalNFTSupply();
      
      res.json({
        success: true,
        data: {
          totalSupply,
        },
      });
    } catch (error) {
      logger.error('Error in getTotalSupply:', error);
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }

  // Mint NFT
  async mint(req, res) {
    try {
      const { contributorAddress, name, description, uri, rarity, category, resonanceFrequency } = req.body;

      // Validation
      if (!contributorAddress || !/^0x[a-fA-F0-9]{40}$/.test(contributorAddress)) {
        return res.status(400).json({ error: 'Invalid contributor address' });
      }

      if (!name || !description || !uri) {
        return res.status(400).json({ error: 'Name, description, and URI are required' });
      }

      const nftData = {
        name,
        description,
        uri,
        rarity: parseInt(rarity) || 0,
        category: parseInt(category) || 0,
        resonanceFrequency: parseInt(resonanceFrequency) || 528,
      };

      const result = await contractService.mintNFT(contributorAddress, nftData);
      
      res.json({
        success: true,
        data: result,
      });
    } catch (error) {
      logger.error('Error in mint:', error);
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }

  // Get NFT collection stats
  async getCollectionStats(req, res) {
    try {
      const totalSupply = await contractService.getTotalNFTSupply();
      
      res.json({
        success: true,
        data: {
          totalSupply,
          contractAddress: contractService.getContract('nft').target,
        },
      });
    } catch (error) {
      logger.error('Error in getCollectionStats:', error);
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }
}

module.exports = new NFTController();
