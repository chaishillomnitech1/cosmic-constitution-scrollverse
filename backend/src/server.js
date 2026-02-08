const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const config = require('./config');
const logger = require('./utils/logger');

// Import routes
const nftRoutes = require('./routes/nft');
const daoRoutes = require('./routes/dao');
const githubRoutes = require('./routes/github');
const chroniclesRoutes = require('./routes/chronicles');

const app = express();

// Security middleware
app.use(helmet());

// CORS configuration
app.use(cors(config.cors));

// Request logging
app.use(morgan('combined', {
  stream: {
    write: (message) => logger.info(message.trim())
  }
}));

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rate limiting
const limiter = rateLimit(config.rateLimit);
app.use('/api/', limiter);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// API routes
app.use('/api/nft', nftRoutes);
app.use('/api/dao', daoRoutes);
app.use('/api/github', githubRoutes);
app.use('/api/chronicles', chroniclesRoutes);

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    name: 'ScrollVerse NFT Platform API',
    version: '1.0.0',
    description: 'Backend API for tokenization workflows and smart contract interactions',
    endpoints: {
      health: '/health',
      nft: {
        getMetadata: '/api/nft/:tokenId',
        getByContributor: '/api/nft/contributor/:address',
        getTotalSupply: '/api/nft/stats/supply',
        getCollectionStats: '/api/nft/stats/collection',
        mint: '/api/nft/mint (POST)',
      },
      dao: {
        getProposal: '/api/dao/proposals/:proposalId',
        getAllProposals: '/api/dao/proposals',
        createProposal: '/api/dao/proposals (POST)',
        getStats: '/api/dao/stats',
      },
      github: {
        oauth: '/api/github/oauth/authorize',
        webhooks: '/api/github/webhook/*',
        rewards: '/api/github/rewards/*',
        employee: '/api/github/employee/*',
        education: '/api/github/education/*',
        token: '/api/github/token/*',
        staking: '/api/github/staking/*',
        aiMerit: '/api/github/ai-merit/*',
      },
      chronicles: {
        getMetadata: '/api/chronicles/:tokenId',
        getAll: '/api/chronicles',
        getFrequencies: '/api/chronicles/:tokenId/frequencies',
        getSupply: '/api/chronicles/stats/supply',
        create: '/api/chronicles/create (POST)',
        mint: '/api/chronicles/mint (POST)',
      },
    },
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: 'The requested resource does not exist',
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  logger.error('Unhandled error:', err);
  
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error',
    ...(config.nodeEnv === 'development' && { stack: err.stack }),
  });
});

// Start server
const PORT = config.port;

app.listen(PORT, () => {
  logger.info(`ScrollVerse Backend API running on port ${PORT}`);
  logger.info(`Environment: ${config.nodeEnv}`);
  logger.info(`NFT Contract: ${config.contracts.nft || 'Not configured'}`);
  logger.info(`MultiToken Contract: ${config.contracts.multiToken || 'Not configured'}`);
  logger.info(`DAO Contract: ${config.contracts.dao || 'Not configured'}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    logger.info('HTTP server closed');
  });
});

module.exports = app;
