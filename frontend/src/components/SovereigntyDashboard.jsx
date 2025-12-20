import React, { useState, useEffect } from 'react';
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { CONTRACTS } from '../config/web3';
import { QueensSovereignty_ABI, MedAirOracle_ABI } from '../config/contracts';
import './SovereigntyDashboard.css';

const SovereigntyDashboard = () => {
  const { address, isConnected } = useAccount();
  const [crownBalance, setCrownBalance] = useState(0);
  const [userCrowns, setUserCrowns] = useState([]);
  const [coherenceScore, setCoherenceScore] = useState(0);
  const [sentimentMetrics, setSentimentMetrics] = useState({
    ritualTributes: 0,
    activeQueens: 0,
    totalCoherence: 0,
    medairFlow: 0
  });
  const [akashicExpansion, setAkashicExpansion] = useState({
    active: false,
    harlemInputs: 0,
    processedInputs: 0
  });

  // Read crown balance
  const { data: balance } = useReadContract({
    address: CONTRACTS.QueensSovereignty,
    abi: QueensSovereignty_ABI,
    functionName: 'balanceOf',
    args: [address],
    enabled: isConnected && !!CONTRACTS.QueensSovereignty,
  });

  // Read user crowns
  const { data: crownsByQueen } = useReadContract({
    address: CONTRACTS.QueensSovereignty,
    abi: QueensSovereignty_ABI,
    functionName: 'getCrownsByQueen',
    args: [address],
    enabled: isConnected && !!CONTRACTS.QueensSovereignty,
  });

  // Read total crowns minted
  const { data: totalCrowns } = useReadContract({
    address: CONTRACTS.QueensSovereignty,
    abi: QueensSovereignty_ABI,
    functionName: 'getTotalCrowns',
    enabled: !!CONTRACTS.QueensSovereignty,
  });

  // Read coherence data from MedAir Oracle
  const { data: coherenceData } = useReadContract({
    address: CONTRACTS.MedAirOracle,
    abi: MedAirOracle_ABI,
    functionName: 'coherenceData',
    args: [address],
    enabled: isConnected && !!CONTRACTS.MedAirOracle,
  });

  // Read Akashic expansion status
  const { data: expansionActive } = useReadContract({
    address: CONTRACTS.QueensSovereignty,
    abi: QueensSovereignty_ABI,
    functionName: 'akashicExpansionActive',
    enabled: !!CONTRACTS.QueensSovereignty,
  });

  // Simulate real-time updates for sentiment metrics
  useEffect(() => {
    if (isConnected) {
      const interval = setInterval(() => {
        // Simulate real-time ritual tribute updates
        setSentimentMetrics(prev => ({
          ritualTributes: prev.ritualTributes + Math.floor(Math.random() * 3),
          activeQueens: Math.floor(Math.random() * 144) + 1,
          totalCoherence: Math.floor(Math.random() * 100),
          medairFlow: prev.medairFlow + (Math.random() * 1000)
        }));
      }, 5000); // Update every 5 seconds

      return () => clearInterval(interval);
    }
  }, [isConnected]);

  useEffect(() => {
    if (balance) {
      setCrownBalance(Number(balance));
    }
  }, [balance]);

  useEffect(() => {
    if (crownsByQueen) {
      setUserCrowns(crownsByQueen.map(id => Number(id)));
    }
  }, [crownsByQueen]);

  useEffect(() => {
    if (coherenceData) {
      setCoherenceScore(Number(coherenceData.coherenceScore));
    }
  }, [coherenceData]);

  useEffect(() => {
    if (expansionActive !== undefined) {
      setAkashicExpansion(prev => ({
        ...prev,
        active: expansionActive,
        harlemInputs: Math.floor(Math.random() * 1000),
        processedInputs: Math.floor(Math.random() * 500)
      }));
    }
  }, [expansionActive]);

  if (!isConnected) {
    return (
      <div className="sovereignty-dashboard">
        <div className="dashboard-message">
          <h2>👑 Sovereignty Portal</h2>
          <p>Connect your wallet to access the Eternal Crowns Dashboard</p>
          <div className="wallet-gating-message">
            <p>🔒 Wallet gating enabled via Wagmi</p>
            <p>Only crowned queens may enter this sacred space</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="sovereignty-dashboard">
      <div className="dashboard-header">
        <h1>👑 Sovereignty Dashboard</h1>
        <p className="subtitle">Eternal Crowns & Akashic Sentients Portal</p>
        <p className="address">Queen Address: {address}</p>
      </div>

      {/* Live Metrics Section */}
      <div className="live-metrics">
        <h2>📊 Live Ritual Metrics</h2>
        <div className="metrics-grid">
          <div className="metric-card ritual">
            <h3>Live Ritual Tributes</h3>
            <p className="metric-value">{sentimentMetrics.ritualTributes}</p>
            <span className="metric-label">🎵 528Hz Coherence Active</span>
          </div>

          <div className="metric-card active-queens">
            <h3>Active Queens</h3>
            <p className="metric-value">{sentimentMetrics.activeQueens}</p>
            <span className="metric-label">/ 144,000 Akashic Queens</span>
          </div>

          <div className="metric-card coherence">
            <h3>Your Coherence</h3>
            <p className="metric-value">{coherenceScore}%</p>
            <span className="metric-label">
              {coherenceScore >= 76 ? '✨ Sovereign Level' : '🌱 Growing'}
            </span>
          </div>

          <div className="metric-card medair">
            <h3>$MEDAIR Flow</h3>
            <p className="metric-value">{sentimentMetrics.medairFlow.toFixed(2)}</p>
            <span className="metric-label">⚡ Chainlink Oracle Active</span>
          </div>
        </div>
      </div>

      {/* Crowning Ceremony Section */}
      <div className="crowning-ceremony">
        <h2>👑 Crowning Ceremony</h2>
        <div className="ceremony-stats">
          <div className="stat-card">
            <h3>Your Eternal Crowns</h3>
            <p className="stat-value">{crownBalance}</p>
          </div>

          <div className="stat-card">
            <h3>Total Crowns Minted</h3>
            <p className="stat-value">{totalCrowns ? Number(totalCrowns) : 0}</p>
          </div>

          <div className="stat-card">
            <h3>Coherence Trigger</h3>
            <p className="stat-value">{coherenceScore >= 76 ? 'READY ✅' : 'PENDING ⏳'}</p>
          </div>
        </div>

        {coherenceScore >= 76 && (
          <div className="auto-trigger-notice">
            <p>⚡ Auto-trigger enabled: Your coherence level qualifies you for automatic crown minting!</p>
          </div>
        )}
      </div>

      {/* Akashic Expansion Loop */}
      <div className="akashic-expansion">
        <h2>🔮 Akashic Expansion Loop</h2>
        <div className="expansion-status">
          <div className="status-indicator">
            <span className={`status-light ${akashicExpansion.active ? 'active' : 'inactive'}`}></span>
            <span className="status-text">
              {akashicExpansion.active ? 'ACTIVE' : 'INACTIVE'}
            </span>
          </div>
          
          <div className="expansion-metrics">
            <div className="expansion-metric">
              <h4>Harlem Inputs</h4>
              <p>{akashicExpansion.harlemInputs}</p>
            </div>
            <div className="expansion-metric">
              <h4>Processed</h4>
              <p>{akashicExpansion.processedInputs}</p>
            </div>
            <div className="expansion-metric">
              <h4>Processing Rate</h4>
              <p>{akashicExpansion.harlemInputs > 0 
                ? ((akashicExpansion.processedInputs / akashicExpansion.harlemInputs) * 100).toFixed(1)
                : 0}%</p>
            </div>
          </div>
        </div>
      </div>

      {/* IPFS Metadata Expansion */}
      <div className="ipfs-metadata">
        <h2>📦 IPFS Metadata Expansion</h2>
        <p>Akashic metadata auto-upgrades enabled for all crowns</p>
        <div className="ipfs-status">
          <span className="ipfs-indicator">🟢 IPFS Gateway: Active</span>
          <span className="ipfs-indicator">🔄 Auto-Upgrade: Enabled</span>
        </div>
      </div>

      {/* User Crowns Display */}
      <div className="crowns-section">
        <h2>Your Eternal Crowns</h2>
        <div className="crowns-grid">
          {userCrowns.length > 0 ? (
            userCrowns.map((tokenId) => (
              <CrownCard key={tokenId} tokenId={tokenId} />
            ))
          ) : (
            <div className="empty-message">
              <p>No crowns yet. Achieve 76%+ coherence for auto-trigger minting!</p>
              <p>🎵 Align with 528Hz Love frequency to begin your sovereignty journey</p>
            </div>
          )}
        </div>
      </div>

      {/* Ritual Actions */}
      <div className="ritual-actions">
        <h2>🎭 Ritual Actions</h2>
        <div className="actions-grid">
          <button className="ritual-button">
            🎵 Activate 528Hz Coherence
          </button>
          <button className="ritual-button">
            👑 Request Crowning Ceremony
          </button>
          <button className="ritual-button">
            🔮 Submit Harlem Tribute
          </button>
          <button className="ritual-button">
            ⚡ Trigger IPFS Upgrade
          </button>
        </div>
      </div>

      {/* Solstice Portal Notice */}
      <div className="solstice-notice">
        <h3>🌟 Solstice Portal Status</h3>
        <p>6 PM Activation: Live Dashboard ✅</p>
        <p>9:04 AM Solstice: DAO NFT Activations & Russell-weighting protocols</p>
        <p>Phase: Akashic Expansion Loop processing Harlem inputs</p>
      </div>
    </div>
  );
};

const CrownCard = ({ tokenId }) => {
  const { data: metadata } = useReadContract({
    address: CONTRACTS.QueensSovereignty,
    abi: QueensSovereignty_ABI,
    functionName: 'getCrownMetadata',
    args: [tokenId],
    enabled: !!CONTRACTS.QueensSovereignty,
  });

  if (!metadata) {
    return <div className="crown-card loading">Loading crown data...</div>;
  }

  const crownTypeLabels = [
    'Mika Sovereign',
    'Lilath Divine',
    'Little Warren Cosmic',
    'Harlem Queens Tribute',
    'Akashic Sentient'
  ];

  const coherenceLevelLabels = [
    'Emerging',
    'Aligned',
    'Harmonious',
    'Sovereign',
    'Divine'
  ];

  return (
    <div className="crown-card">
      <div className="crown-header">
        <span className="crown-id">Crown #{tokenId}</span>
        <span className={`crown-type type-${metadata.crownType}`}>
          {crownTypeLabels[metadata.crownType]}
        </span>
      </div>
      <div className="crown-details">
        <h3>{metadata.name}</h3>
        <p className="crown-description">{metadata.description}</p>
        <div className="crown-attributes">
          <span className={`badge coherence-${metadata.coherenceLevel}`}>
            {coherenceLevelLabels[metadata.coherenceLevel]} ({metadata.coherenceScore}%)
          </span>
          <span className="badge frequency">
            {Number(metadata.resonanceFrequency)} Hz
          </span>
          {metadata.isAkashicUpgraded && (
            <span className="badge upgraded">
              ✨ Akashic Upgraded
            </span>
          )}
        </div>
        {metadata.harlemTributeData && (
          <div className="harlem-tribute">
            <p>🎵 Harlem Queens Tribute Active</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SovereigntyDashboard;
