const contractService = require('../utils/contractService');
const logger = require('../utils/logger');

class ChroniclesController {
  // Get Chronicle metadata
  async getChronicleMetadata(req, res) {
    try {
      const { tokenId } = req.params;
      
      if (!tokenId || isNaN(tokenId)) {
        return res.status(400).json({ error: 'Invalid token ID' });
      }

      const metadata = await contractService.getChronicleMetadata(parseInt(tokenId));
      
      res.json({
        success: true,
        data: metadata,
      });
    } catch (error) {
      logger.error('Error in getChronicleMetadata:', error);
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }

  // Get all Chronicles
  async getAllChronicles(req, res) {
    try {
      const currentSupply = await contractService.getCurrentChroniclesSupply();
      const chronicles = [];

      for (let i = 0; i < currentSupply; i++) {
        const metadata = await contractService.getChronicleMetadata(i);
        chronicles.push({ tokenId: i, ...metadata });
      }
      
      res.json({
        success: true,
        data: {
          chronicles,
          totalSupply: currentSupply,
          maxEditions: 144,
        },
      });
    } catch (error) {
      logger.error('Error in getAllChronicles:', error);
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }

  // Get sacred frequencies for a Chronicle
  async getSacredFrequencies(req, res) {
    try {
      const { tokenId } = req.params;
      
      if (!tokenId || isNaN(tokenId)) {
        return res.status(400).json({ error: 'Invalid token ID' });
      }

      const frequencies = await contractService.getSacredFrequencies(parseInt(tokenId));
      
      res.json({
        success: true,
        data: {
          tokenId: parseInt(tokenId),
          frequencies: {
            frequency144000Hz: frequencies[0],
            frequency963Hz: frequencies[1],
            frequency144Hz: frequencies[2],
          },
        },
      });
    } catch (error) {
      logger.error('Error in getSacredFrequencies:', error);
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }

  // Get current supply
  async getCurrentSupply(req, res) {
    try {
      const currentSupply = await contractService.getCurrentChroniclesSupply();
      
      res.json({
        success: true,
        data: {
          currentSupply,
          maxEditions: 144,
        },
      });
    } catch (error) {
      logger.error('Error in getCurrentSupply:', error);
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }

  // Get remaining editions
  async getRemainingEditions(req, res) {
    try {
      const remaining = await contractService.getRemainingChroniclesEditions();
      
      res.json({
        success: true,
        data: {
          remainingEditions: remaining,
          maxEditions: 144,
        },
      });
    } catch (error) {
      logger.error('Error in getRemainingEditions:', error);
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }

  // Create Chronicle
  async createChronicle(req, res) {
    try {
      const { 
        name, 
        description, 
        sovereignAlignment, 
        roseGoldEncryption, 
        ipfsHash 
      } = req.body;

      // Validation
      if (!name || !description || !ipfsHash) {
        return res.status(400).json({ 
          error: 'Name, description, and IPFS hash are required' 
        });
      }

      const chronicleData = {
        name,
        description,
        sovereignAlignment: sovereignAlignment || 'Supreme King Chaisallah Sovereignty',
        roseGoldEncryption: roseGoldEncryption || 'Rose Gold 963Hz Quantum Encryption',
        ipfsHash,
      };

      const result = await contractService.createChronicle(chronicleData);
      
      res.json({
        success: true,
        data: result,
      });
    } catch (error) {
      logger.error('Error in createChronicle:', error);
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }

  // Mint Chronicle
  async mintChronicle(req, res) {
    try {
      const { recipientAddress, tokenId } = req.body;

      // Validation
      if (!recipientAddress || !/^0x[a-fA-F0-9]{40}$/.test(recipientAddress)) {
        return res.status(400).json({ error: 'Invalid recipient address' });
      }

      if (tokenId === undefined || isNaN(tokenId)) {
        return res.status(400).json({ error: 'Invalid token ID' });
      }

      const result = await contractService.mintChronicle(recipientAddress, parseInt(tokenId));
      
      res.json({
        success: true,
        data: result,
      });
    } catch (error) {
      logger.error('Error in mintChronicle:', error);
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }

  // Batch mint Chronicles
  async batchMintChronicles(req, res) {
    try {
      const { recipients, tokenIds } = req.body;

      // Validation
      if (!Array.isArray(recipients) || !Array.isArray(tokenIds)) {
        return res.status(400).json({ 
          error: 'Recipients and tokenIds must be arrays' 
        });
      }

      if (recipients.length !== tokenIds.length) {
        return res.status(400).json({ 
          error: 'Recipients and tokenIds arrays must have the same length' 
        });
      }

      // Validate all addresses
      for (const address of recipients) {
        if (!/^0x[a-fA-F0-9]{40}$/.test(address)) {
          return res.status(400).json({ 
            error: `Invalid address: ${address}` 
          });
        }
      }

      const result = await contractService.batchMintChronicles(recipients, tokenIds);
      
      res.json({
        success: true,
        data: result,
      });
    } catch (error) {
      logger.error('Error in batchMintChronicles:', error);
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }

  // Update token URI
  async updateTokenURI(req, res) {
    try {
      const { tokenId } = req.params;
      const { uri } = req.body;

      if (!tokenId || isNaN(tokenId)) {
        return res.status(400).json({ error: 'Invalid token ID' });
      }

      if (!uri) {
        return res.status(400).json({ error: 'URI is required' });
      }

      const result = await contractService.updateChronicleURI(parseInt(tokenId), uri);
      
      res.json({
        success: true,
        data: result,
      });
    } catch (error) {
      logger.error('Error in updateTokenURI:', error);
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }
}

module.exports = new ChroniclesController();
