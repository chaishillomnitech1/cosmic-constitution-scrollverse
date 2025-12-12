import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { mainnet, sepolia, polygon, polygonMumbai } from 'wagmi/chains';

export const config = getDefaultConfig({
  appName: 'ScrollVerse NFT Platform',
  projectId: process.env.REACT_APP_WALLETCONNECT_PROJECT_ID || 'YOUR_PROJECT_ID',
  chains: [
    mainnet,
    sepolia,
    polygon,
    polygonMumbai,
    ...(process.env.REACT_APP_ENABLE_TESTNETS === 'true' ? [sepolia, polygonMumbai] : []),
  ],
  ssr: false,
});

// Contract addresses
export const CONTRACTS = {
  ScrollVerseNFT: process.env.REACT_APP_NFT_CONTRACT_ADDRESS || '',
  ScrollVerseMultiToken: process.env.REACT_APP_MULTI_TOKEN_CONTRACT_ADDRESS || '',
  ScrollVerseDAO: process.env.REACT_APP_DAO_CONTRACT_ADDRESS || '',
};

// Network configuration
export const NETWORKS = {
  mainnet: {
    chainId: 1,
    name: 'Ethereum Mainnet',
    rpcUrl: process.env.REACT_APP_ETH_RPC_URL,
  },
  sepolia: {
    chainId: 11155111,
    name: 'Sepolia Testnet',
    rpcUrl: process.env.REACT_APP_SEPOLIA_RPC_URL,
  },
  polygon: {
    chainId: 137,
    name: 'Polygon',
    rpcUrl: process.env.REACT_APP_POLYGON_RPC_URL,
  },
  mumbai: {
    chainId: 80001,
    name: 'Mumbai Testnet',
    rpcUrl: process.env.REACT_APP_MUMBAI_RPC_URL,
  },
};

// IPFS configuration
export const IPFS_GATEWAY = process.env.REACT_APP_IPFS_GATEWAY || 'https://ipfs.io/ipfs/';
