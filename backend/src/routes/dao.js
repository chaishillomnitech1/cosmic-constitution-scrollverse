const express = require('express');
const router = express.Router();
const daoController = require('../controllers/daoController');

// Get proposal by ID
router.get('/proposals/:proposalId', daoController.getProposal);

// Get all proposals
router.get('/proposals', daoController.getAllProposals);

// Create proposal (protected endpoint - requires authentication in production)
router.post('/proposals', daoController.createProposal);

// Get DAO stats
router.get('/stats', daoController.getStats);

module.exports = router;
