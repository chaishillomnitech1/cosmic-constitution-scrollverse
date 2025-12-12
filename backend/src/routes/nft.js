const express = require('express');
const router = express.Router();
const nftController = require('../controllers/nftController');

// Get NFT metadata
router.get('/:tokenId', nftController.getMetadata);

// Get NFTs by contributor
router.get('/contributor/:address', nftController.getByContributor);

// Get total supply
router.get('/stats/supply', nftController.getTotalSupply);

// Get collection stats
router.get('/stats/collection', nftController.getCollectionStats);

// Mint NFT (protected endpoint - requires authentication in production)
router.post('/mint', nftController.mint);

module.exports = router;
