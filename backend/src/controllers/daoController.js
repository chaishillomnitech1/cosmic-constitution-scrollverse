const contractService = require('../utils/contractService');
const logger = require('../utils/logger');

class DAOController {
  // Get proposal by ID
  async getProposal(req, res) {
    try {
      const { proposalId } = req.params;
      
      if (!proposalId || isNaN(proposalId)) {
        return res.status(400).json({ error: 'Invalid proposal ID' });
      }

      const proposal = await contractService.getProposal(parseInt(proposalId));
      
      res.json({
        success: true,
        data: proposal,
      });
    } catch (error) {
      logger.error('Error in getProposal:', error);
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }

  // Get all proposals
  async getAllProposals(req, res) {
    try {
      const count = await contractService.getProposalCount();
      const proposalCount = parseInt(count);
      
      const proposals = [];
      const limit = Math.min(proposalCount, 50); // Limit to 50 proposals
      
      for (let i = 0; i < limit; i++) {
        const proposal = await contractService.getProposal(i);
        proposals.push(proposal);
      }
      
      res.json({
        success: true,
        data: {
          proposals,
          total: proposalCount,
        },
      });
    } catch (error) {
      logger.error('Error in getAllProposals:', error);
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }

  // Create proposal
  async createProposal(req, res) {
    try {
      const { title, description, proposalType, proposalData } = req.body;

      // Validation
      if (!title || !description) {
        return res.status(400).json({ error: 'Title and description are required' });
      }

      if (proposalType === undefined || isNaN(proposalType)) {
        return res.status(400).json({ error: 'Valid proposal type is required' });
      }

      const data = {
        title,
        description,
        proposalType: parseInt(proposalType),
        proposalData: proposalData || '0x',
      };

      const result = await contractService.createProposal(data);
      
      res.json({
        success: true,
        data: result,
      });
    } catch (error) {
      logger.error('Error in createProposal:', error);
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }

  // Get DAO stats
  async getStats(req, res) {
    try {
      const proposalCount = await contractService.getProposalCount();
      
      res.json({
        success: true,
        data: {
          proposalCount,
          contractAddress: contractService.getContract('dao').target,
        },
      });
    } catch (error) {
      logger.error('Error in getStats:', error);
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }
}

module.exports = new DAOController();
