# ScrollVerse Backend API

Backend API server for the ScrollVerse NFT Platform, providing tokenization workflows and smart contract interactions.

## Features

- RESTful API for NFT operations
- Smart contract integration (ERC-721, ERC-1155, DAO)
- Alchemy/Infura RPC provider support
- Rate limiting and security middleware
- Comprehensive logging
- Error handling

## Prerequisites

- Node.js 16.x or higher
- npm or yarn
- Ethereum RPC endpoint (Infura/Alchemy)
- Deployed smart contracts

## Installation

```bash
# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Edit .env with your configuration
```

## Configuration

Edit `.env` file with your settings:

- `PORT`: Server port (default: 3001)
- `ETH_RPC_URL`: Ethereum RPC endpoint
- `PRIVATE_KEY`: Private key for signing transactions (optional for read-only)
- `NFT_CONTRACT_ADDRESS`: Deployed NFT contract address
- `MULTI_TOKEN_CONTRACT_ADDRESS`: Deployed MultiToken contract address
- `DAO_CONTRACT_ADDRESS`: Deployed DAO contract address

## Running the Server

```bash
# Development mode with auto-reload
npm run dev

# Production mode
npm start
```

## API Endpoints

### Health Check
- `GET /health` - Server health status

### NFT Endpoints
- `GET /api/nft/:tokenId` - Get NFT metadata
- `GET /api/nft/contributor/:address` - Get NFTs by contributor address
- `GET /api/nft/stats/supply` - Get total NFT supply
- `GET /api/nft/stats/collection` - Get collection statistics
- `POST /api/nft/mint` - Mint new NFT

### DAO Endpoints
- `GET /api/dao/proposals` - Get all proposals
- `GET /api/dao/proposals/:proposalId` - Get specific proposal
- `POST /api/dao/proposals` - Create new proposal
- `GET /api/dao/stats` - Get DAO statistics

## Example Requests

### Mint NFT
```bash
curl -X POST http://localhost:3001/api/nft/mint \
  -H "Content-Type: application/json" \
  -d '{
    "contributorAddress": "0x...",
    "name": "Cosmic Scroll #1",
    "description": "A unique cosmic artifact",
    "uri": "ipfs://...",
    "rarity": 2,
    "category": 3,
    "resonanceFrequency": 528
  }'
```

### Get NFT Metadata
```bash
curl http://localhost:3001/api/nft/0
```

### Create DAO Proposal
```bash
curl -X POST http://localhost:3001/api/dao/proposals \
  -H "Content-Type: application/json" \
  -d '{
    "title": "NFT Cleanup Proposal",
    "description": "Proposal to clean up inactive NFTs",
    "proposalType": 0
  }'
```

## Security

- Rate limiting: 100 requests per 15 minutes per IP
- Helmet.js for security headers
- CORS configured for frontend origin
- Request validation and sanitization
- Comprehensive error logging

## Logging

Logs are stored in:
- `logs/error.log` - Error logs
- `logs/combined.log` - All logs
- Console output in development mode

## Development

```bash
# Run tests
npm test

# Run with nodemon for auto-reload
npm run dev
```

## Integration with Alchemy/Infura

The backend supports both Alchemy and Infura as RPC providers:

### Alchemy
```env
ALCHEMY_MUMBAI_URL=https://polygon-mumbai.g.alchemy.com/v2/YOUR_API_KEY
```

### Infura
```env
ETH_RPC_URL=https://mainnet.infura.io/v3/YOUR_INFURA_KEY
INFURA_PROJECT_ID=YOUR_PROJECT_ID
```

## Production Deployment

1. Set `NODE_ENV=production`
2. Use a process manager (PM2, systemd)
3. Configure reverse proxy (nginx, Apache)
4. Set up SSL/TLS certificates
5. Configure firewall rules
6. Set up monitoring and alerting

## License

MIT
