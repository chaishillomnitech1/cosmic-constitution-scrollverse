import React, { useState, useEffect } from 'react';
import { useAccount, useReadContract } from 'wagmi';
import { CONTRACTS } from '../config/web3';
import { ScrollVerseNFT_ABI, ScrollVerseMultiToken_ABI } from '../config/contracts';
import './Dashboard.css';

const Dashboard = () => {
  const { address, isConnected } = useAccount();
  const [nftBalance, setNftBalance] = useState(0);
  const [userNFTs, setUserNFTs] = useState([]);

  // Read NFT balance
  const { data: balance } = useReadContract({
    address: CONTRACTS.ScrollVerseNFT,
    abi: ScrollVerseNFT_ABI,
    functionName: 'balanceOf',
    args: [address],
    enabled: isConnected && !!CONTRACTS.ScrollVerseNFT,
  });

  // Read user NFTs
  const { data: contributorNFTs } = useReadContract({
    address: CONTRACTS.ScrollVerseNFT,
    abi: ScrollVerseNFT_ABI,
    functionName: 'getNFTsByContributor',
    args: [address],
    enabled: isConnected && !!CONTRACTS.ScrollVerseNFT,
  });

  useEffect(() => {
    if (balance) {
      setNftBalance(Number(balance));
    }
  }, [balance]);

  useEffect(() => {
    if (contributorNFTs) {
      setUserNFTs(contributorNFTs.map(id => Number(id)));
    }
  }, [contributorNFTs]);

  if (!isConnected) {
    return (
      <div className="dashboard">
        <div className="dashboard-message">
          <h2>Connect Your Wallet</h2>
          <p>Please connect your wallet to access the dashboard</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>ScrollVerse Dashboard</h1>
        <p className="address">Connected: {address}</p>
      </div>

      <div className="dashboard-stats">
        <div className="stat-card">
          <h3>NFT Balance</h3>
          <p className="stat-value">{nftBalance}</p>
        </div>

        <div className="stat-card">
          <h3>Total Minted</h3>
          <p className="stat-value">{userNFTs.length}</p>
        </div>

        <div className="stat-card">
          <h3>Voting Power</h3>
          <p className="stat-value">{nftBalance}</p>
        </div>
      </div>

      <div className="dashboard-section">
        <h2>Your NFTs</h2>
        <div className="nft-grid">
          {userNFTs.length > 0 ? (
            userNFTs.map((tokenId) => (
              <NFTCard key={tokenId} tokenId={tokenId} />
            ))
          ) : (
            <p className="empty-message">You don't have any NFTs yet. Start minting!</p>
          )}
        </div>
      </div>
    </div>
  );
};

const NFTCard = ({ tokenId }) => {
  const { data: metadata } = useReadContract({
    address: CONTRACTS.ScrollVerseNFT,
    abi: ScrollVerseNFT_ABI,
    functionName: 'getNFTMetadata',
    args: [tokenId],
    enabled: !!CONTRACTS.ScrollVerseNFT,
  });

  if (!metadata) {
    return <div className="nft-card loading">Loading...</div>;
  }

  const rarityLabels = ['Common', 'Uncommon', 'Rare', 'Epic', 'Legendary'];
  const categoryLabels = ['Luxury Item', 'Vehicle', 'Digital Art', 'Cosmic Scroll', 'Other'];

  return (
    <div className="nft-card">
      <div className="nft-image">
        <span className="token-id">#{tokenId}</span>
      </div>
      <div className="nft-details">
        <h3>{metadata.name}</h3>
        <p className="nft-description">{metadata.description}</p>
        <div className="nft-attributes">
          <span className={`badge rarity-${metadata.rarity}`}>
            {rarityLabels[metadata.rarity]}
          </span>
          <span className="badge category">
            {categoryLabels[metadata.category]}
          </span>
          <span className="badge frequency">
            {Number(metadata.resonanceFrequency)} Hz
          </span>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
