import React, { useState, useEffect } from 'react';
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { CONTRACTS } from '../config/web3';
import { ScrollVerseDAO_ABI, ProposalType } from '../config/contracts';
import './DAOGovernance.css';

const DAOGovernance = () => {
  const { address, isConnected } = useAccount();
  const [proposals, setProposals] = useState([]);
  const [showCreateForm, setShowCreateForm] = useState(false);

  const { data: proposalCount } = useReadContract({
    address: CONTRACTS.ScrollVerseDAO,
    abi: ScrollVerseDAO_ABI,
    functionName: 'proposalCount',
    enabled: isConnected && !!CONTRACTS.ScrollVerseDAO,
  });

  useEffect(() => {
    if (proposalCount) {
      const count = Number(proposalCount);
      // Fetch proposals (simplified - in production, use proper pagination)
      const proposalIds = Array.from({ length: Math.min(count, 10) }, (_, i) => i);
      setProposals(proposalIds);
    }
  }, [proposalCount]);

  if (!isConnected) {
    return (
      <div className="dao-governance">
        <div className="dao-message">
          <h2>Connect Your Wallet</h2>
          <p>Please connect your wallet to participate in DAO governance</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dao-governance">
      <div className="dao-header">
        <h1>ScrollVerse DAO</h1>
        <p>Decentralized governance for the community</p>
        <button
          className="create-proposal-button"
          onClick={() => setShowCreateForm(!showCreateForm)}
        >
          {showCreateForm ? 'Cancel' : 'Create Proposal'}
        </button>
      </div>

      {showCreateForm && <CreateProposalForm onClose={() => setShowCreateForm(false)} />}

      <div className="proposals-section">
        <h2>Active Proposals</h2>
        <div className="proposals-list">
          {proposals.length > 0 ? (
            proposals.map((proposalId) => (
              <ProposalCard key={proposalId} proposalId={proposalId} />
            ))
          ) : (
            <p className="empty-message">No proposals yet. Create the first one!</p>
          )}
        </div>
      </div>
    </div>
  );
};

const CreateProposalForm = ({ onClose }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    proposalType: ProposalType.OTHER,
  });

  const { writeContract, isPending, error } = useWriteContract();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      await writeContract({
        address: CONTRACTS.ScrollVerseDAO,
        abi: ScrollVerseDAO_ABI,
        functionName: 'createProposal',
        args: [
          formData.title,
          formData.description,
          parseInt(formData.proposalType),
          '0x', // Empty bytes for now
        ],
      });
      
      onClose();
    } catch (err) {
      console.error('Error creating proposal:', err);
    }
  };

  return (
    <div className="create-proposal-form">
      <h2>Create New Proposal</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Title *</label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="Proposal title"
            required
          />
        </div>

        <div className="form-group">
          <label>Description *</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Detailed proposal description"
            rows="6"
            required
          />
        </div>

        <div className="form-group">
          <label>Type *</label>
          <select
            value={formData.proposalType}
            onChange={(e) => setFormData({ ...formData, proposalType: e.target.value })}
          >
            <option value={ProposalType.NFT_CLEANUP}>NFT Cleanup</option>
            <option value={ProposalType.PARAMETER_CHANGE}>Parameter Change</option>
            <option value={ProposalType.TREASURY_ACTION}>Treasury Action</option>
            <option value={ProposalType.OTHER}>Other</option>
          </select>
        </div>

        <div className="form-actions">
          <button type="submit" disabled={isPending} className="submit-button">
            {isPending ? 'Creating...' : 'Create Proposal'}
          </button>
          <button type="button" onClick={onClose} className="cancel-button">
            Cancel
          </button>
        </div>

        {error && (
          <div className="error-message">
            Error: {error.message}
          </div>
        )}
      </form>
    </div>
  );
};

const ProposalCard = ({ proposalId }) => {
  const { address } = useAccount();
  const [hasVoted, setHasVoted] = useState(false);

  const { data: proposal } = useReadContract({
    address: CONTRACTS.ScrollVerseDAO,
    abi: ScrollVerseDAO_ABI,
    functionName: 'getProposal',
    args: [proposalId],
    enabled: !!CONTRACTS.ScrollVerseDAO,
  });

  const { data: votingStatus } = useReadContract({
    address: CONTRACTS.ScrollVerseDAO,
    abi: ScrollVerseDAO_ABI,
    functionName: 'getVotingStatus',
    args: [proposalId, address],
    enabled: !!CONTRACTS.ScrollVerseDAO && !!address,
  });

  const { writeContract, isPending } = useWriteContract();

  useEffect(() => {
    if (votingStatus) {
      setHasVoted(votingStatus[0]); // voted boolean
    }
  }, [votingStatus]);

  const handleVote = async (support) => {
    try {
      await writeContract({
        address: CONTRACTS.ScrollVerseDAO,
        abi: ScrollVerseDAO_ABI,
        functionName: 'castVote',
        args: [proposalId, support],
      });
    } catch (err) {
      console.error('Error voting:', err);
    }
  };

  if (!proposal) {
    return <div className="proposal-card loading">Loading...</div>;
  }

  const proposalTypeLabels = ['NFT Cleanup', 'Parameter Change', 'Treasury Action', 'Other'];
  const totalVotes = Number(proposal.votesFor) + Number(proposal.votesAgainst);
  const forPercentage = totalVotes > 0 ? (Number(proposal.votesFor) / totalVotes) * 100 : 0;
  
  const isActive = !proposal.executed && Date.now() / 1000 < Number(proposal.endTime);

  return (
    <div className={`proposal-card ${proposal.executed ? 'executed' : 'active'}`}>
      <div className="proposal-header">
        <h3>{proposal.title}</h3>
        <span className={`status-badge ${isActive ? 'active' : 'ended'}`}>
          {isActive ? 'Active' : proposal.passed ? 'Passed' : 'Failed'}
        </span>
      </div>

      <p className="proposal-description">{proposal.description}</p>

      <div className="proposal-meta">
        <span className="type-badge">{proposalTypeLabels[proposal.proposalType]}</span>
        <span className="proposal-id">#{proposalId}</span>
      </div>

      <div className="voting-results">
        <div className="vote-bar">
          <div className="vote-bar-for" style={{ width: `${forPercentage}%` }}></div>
        </div>
        <div className="vote-counts">
          <span className="votes-for">For: {Number(proposal.votesFor)}</span>
          <span className="votes-against">Against: {Number(proposal.votesAgainst)}</span>
        </div>
      </div>

      {isActive && !hasVoted && (
        <div className="voting-actions">
          <button
            onClick={() => handleVote(true)}
            disabled={isPending}
            className="vote-button vote-for"
          >
            Vote For
          </button>
          <button
            onClick={() => handleVote(false)}
            disabled={isPending}
            className="vote-button vote-against"
          >
            Vote Against
          </button>
        </div>
      )}

      {hasVoted && (
        <div className="voted-badge">
          ✓ You voted {votingStatus[1] ? 'For' : 'Against'}
        </div>
      )}
    </div>
  );
};

export default DAOGovernance;
