import React, { useState } from 'react';
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { CONTRACTS } from '../config/web3';
import { ScrollVerseNFT_ABI, Rarity, Category } from '../config/contracts';
import './MintingControl.css';

const MintingControl = () => {
  const { address, isConnected } = useAccount();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    uri: '',
    rarity: Rarity.COMMON,
    category: Category.COSMIC_SCROLL,
    resonanceFrequency: 528,
  });

  const { data: hash, writeContract, isPending, error } = useWriteContract();

  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleMint = async (e) => {
    e.preventDefault();
    
    if (!isConnected) {
      alert('Please connect your wallet first');
      return;
    }

    if (!CONTRACTS.ScrollVerseNFT) {
      alert('NFT contract address not configured');
      return;
    }

    try {
      await writeContract({
        address: CONTRACTS.ScrollVerseNFT,
        abi: ScrollVerseNFT_ABI,
        functionName: 'mintNFT',
        args: [
          address,
          formData.name,
          formData.description,
          formData.uri,
          parseInt(formData.rarity),
          parseInt(formData.category),
          parseInt(formData.resonanceFrequency),
        ],
      });
    } catch (err) {
      console.error('Minting error:', err);
    }
  };

  if (!isConnected) {
    return (
      <div className="minting-control">
        <div className="minting-message">
          <h2>Connect Your Wallet</h2>
          <p>Please connect your wallet to mint NFTs</p>
        </div>
      </div>
    );
  }

  return (
    <div className="minting-control">
      <div className="minting-header">
        <h1>Mint ScrollVerse NFT</h1>
        <p>Create and mint your cosmic NFT with resonance frequencies</p>
      </div>

      <form onSubmit={handleMint} className="minting-form">
        <div className="form-group">
          <label htmlFor="name">NFT Name *</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="Enter NFT name"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Description *</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Enter NFT description"
            rows="4"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="uri">Token URI (IPFS) *</label>
          <input
            type="text"
            id="uri"
            name="uri"
            value={formData.uri}
            onChange={handleInputChange}
            placeholder="ipfs://..."
            required
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="rarity">Rarity *</label>
            <select
              id="rarity"
              name="rarity"
              value={formData.rarity}
              onChange={handleInputChange}
            >
              <option value={Rarity.COMMON}>Common</option>
              <option value={Rarity.UNCOMMON}>Uncommon</option>
              <option value={Rarity.RARE}>Rare</option>
              <option value={Rarity.EPIC}>Epic</option>
              <option value={Rarity.LEGENDARY}>Legendary</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="category">Category *</label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleInputChange}
            >
              <option value={Category.LUXURY_ITEM}>Luxury Item</option>
              <option value={Category.VEHICLE}>Vehicle</option>
              <option value={Category.DIGITAL_ART}>Digital Art</option>
              <option value={Category.COSMIC_SCROLL}>Cosmic Scroll</option>
              <option value={Category.OTHER}>Other</option>
            </select>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="resonanceFrequency">Resonance Frequency (Hz) *</label>
          <select
            id="resonanceFrequency"
            name="resonanceFrequency"
            value={formData.resonanceFrequency}
            onChange={handleInputChange}
          >
            <option value="528">528 Hz - Love Vortex</option>
            <option value="963">963 Hz - Eden Pulse</option>
            <option value="432">432 Hz - Universal Harmony</option>
            <option value="639">639 Hz - Connecting Relationships</option>
            <option value="741">741 Hz - Awakening Intuition</option>
          </select>
        </div>

        <button
          type="submit"
          className="mint-button"
          disabled={isPending || isConfirming}
        >
          {isPending ? 'Confirming...' : isConfirming ? 'Minting...' : 'Mint NFT'}
        </button>

        {hash && (
          <div className="transaction-status">
            <p>Transaction Hash: {hash.slice(0, 10)}...{hash.slice(-8)}</p>
            {isConfirming && <p className="status-pending">Waiting for confirmation...</p>}
            {isConfirmed && <p className="status-success">✓ NFT Minted Successfully!</p>}
          </div>
        )}

        {error && (
          <div className="error-message">
            <p>Error: {error.message}</p>
          </div>
        )}
      </form>
    </div>
  );
};

export default MintingControl;
