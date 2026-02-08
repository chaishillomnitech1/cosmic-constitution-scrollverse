const express = require('express');
const router = express.Router();
const chroniclesController = require('../controllers/chroniclesController');

// Get Chronicle metadata
router.get('/:tokenId', chroniclesController.getChronicleMetadata);

// Get all Chronicles
router.get('/', chroniclesController.getAllChronicles);

// Get sacred frequencies for a Chronicle
router.get('/:tokenId/frequencies', chroniclesController.getSacredFrequencies);

// Get current supply
router.get('/stats/supply', chroniclesController.getCurrentSupply);

// Get remaining editions
router.get('/stats/remaining', chroniclesController.getRemainingEditions);

// Create Chronicle (protected endpoint - requires authentication in production)
router.post('/create', chroniclesController.createChronicle);

// Mint Chronicle to recipient (protected endpoint)
router.post('/mint', chroniclesController.mintChronicle);

// Batch mint Chronicles (protected endpoint)
router.post('/mint-batch', chroniclesController.batchMintChronicles);

// Update token URI (protected endpoint)
router.put('/:tokenId/uri', chroniclesController.updateTokenURI);

module.exports = router;
