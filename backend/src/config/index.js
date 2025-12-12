require('dotenv').config();

module.exports = {
  // Server configuration
  port: process.env.PORT || 3001,
  nodeEnv: process.env.NODE_ENV || 'development',
  
  // Blockchain configuration
  eth: {
    rpcUrl: process.env.ETH_RPC_URL || 'https://mainnet.infura.io/v3/YOUR_INFURA_KEY',
    privateKey: process.env.PRIVATE_KEY,
    chainId: parseInt(process.env.CHAIN_ID) || 1,
  },
  
  // Alchemy/Infura configuration
  alchemy: {
    apiKey: process.env.ALCHEMY_API_KEY,
    mumbaiUrl: process.env.ALCHEMY_MUMBAI_URL,
  },
  
  infura: {
    projectId: process.env.INFURA_PROJECT_ID,
    projectSecret: process.env.INFURA_PROJECT_SECRET,
  },
  
  // Contract addresses
  contracts: {
    nft: process.env.NFT_CONTRACT_ADDRESS,
    multiToken: process.env.MULTI_TOKEN_CONTRACT_ADDRESS,
    dao: process.env.DAO_CONTRACT_ADDRESS,
  },
  
  // IPFS configuration
  ipfs: {
    gateway: process.env.IPFS_GATEWAY || 'https://ipfs.io/ipfs/',
    projectId: process.env.IPFS_PROJECT_ID,
    projectSecret: process.env.IPFS_PROJECT_SECRET,
  },
  
  // Rate limiting
  rateLimit: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
  },
  
  // CORS configuration
  cors: {
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    credentials: true,
  },
  
  // Logging
  logging: {
    level: process.env.LOG_LEVEL || 'info',
  },
};
