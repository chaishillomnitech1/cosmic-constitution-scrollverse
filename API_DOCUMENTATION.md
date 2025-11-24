# ScrollVerse Governance Codex - API Documentation

## Overview

The ScrollVerse Governance Codex is an advanced system that integrates real-time resonance flows (528Hz Love Vortex and 963Hz Eden Pulse) with Ethereum treasury management and NFT synchronization. This system bridges ETH vault operations to NFT audio metadata integration.

## Architecture

### Core Components

1. **Resonance System** (`resonance_system.py`)
   - Manages 528Hz (Love Vortex) and 963Hz (Eden Pulse) frequencies
   - Real-time phase and amplitude tracking
   - Harmonic convergence calculation
   - Audio metadata generation for NFT integration

2. **Treasury Module** (`treasury.py`)
   - ETH vault integration
   - ScrollCoin balance management
   - Treasury synchronization with blockchain
   - Financial reporting and metrics

3. **NFT Synchronization** (`nft_sync.py`)
   - NFT metadata creation with audio resonance data
   - IPFS integration for decentralized storage
   - Treasury-NFT linking
   - Collection manifest generation

## API Endpoints

### Resonance System Endpoints

#### GET `/api/resonance/status`
Get current real-time resonance system status.

**Response:**
```json
{
  "timestamp": "2025-11-24T02:00:00.000000",
  "elapsed_seconds": 42.5,
  "love_vortex": {
    "frequency": 528,
    "phase": 0.7854,
    "amplitude": 0.7071
  },
  "eden_pulse": {
    "frequency": 963,
    "phase": 0.4321,
    "amplitude": 0.9511
  },
  "harmonic_convergence": 0.85,
  "resonance_quality": "High Coherence"
}
```

**Resonance Quality Levels:**
- `Divine Alignment` (≥0.9): Perfect harmonic alignment
- `High Coherence` (≥0.7): Strong resonance
- `Balanced Flow` (≥0.5): Stable operation
- `Harmonizing` (≥0.3): Converging frequencies
- `Initiating Resonance` (<0.3): Initial state

#### GET `/api/resonance/audio-metadata/<frequency>`
Get audio metadata for a specific frequency for NFT integration.

**Parameters:**
- `frequency`: Integer (e.g., 528 or 963)

**Response:**
```json
{
  "frequency": 528,
  "sample_rate": 44100,
  "waveform": "sine",
  "purpose": "love_vortex",
  "description": "Love Vortex - DNA repair and transformation frequency...",
  "duration_seconds": 60,
  "format": "wav",
  "channels": 2,
  "bit_depth": 16
}
```

#### GET `/api/resonance/ratio`
Get the frequency ratio between Love Vortex and Eden Pulse.

**Response:**
```json
{
  "ratio": 1.823864,
  "love_frequency": 528,
  "eden_frequency": 963,
  "description": "The Eden Pulse vibrates at 1.82x the Love Vortex frequency"
}
```

### Treasury Endpoints

#### GET `/api/treasury/status`
Get current treasury vault status.

**Response:**
```json
{
  "vault_address": "0x...",
  "last_sync": "2025-11-24T02:00:00.000000",
  "balances": {
    "eth": "252000.00",
    "scroll_coin": "144000.00",
    "total_value_usd": "504,144,000.00"
  },
  "sync_status": "active",
  "vault_health": "optimal"
}
```

#### GET `/api/treasury/sync`
Synchronize treasury data with ETH vault.

**Response:**
```json
{
  "success": true,
  "message": "Treasury synchronized successfully",
  "timestamp": "2025-11-24T02:00:00.000000",
  "balances": {
    "eth": "252000.00",
    "scroll_coin": "144000.00"
  }
}
```

#### GET `/api/treasury/report`
Generate comprehensive treasury report.

**Response:**
```json
{
  "report_id": "TR-20251124-020000",
  "generated_at": "2025-11-24T02:00:00.000000",
  "treasury_status": {...},
  "vault_metrics": {
    "total_deposits": "252000000000",
    "active_addresses": 144000,
    "vault_utilization": "85.5%",
    "security_score": "100/100"
  },
  "resonance_alignment": {
    "love_vortex_contribution": "528 ETH",
    "eden_pulse_contribution": "963 ETH",
    "total_resonance_value": "1491 ETH"
  },
  "governance_score": "Divine Alignment"
}
```

### NFT Endpoints

#### GET `/api/nft/collection`
Get NFT collection status.

**Response:**
```json
{
  "contract_address": "0x...",
  "total_supply": 100,
  "minted": 75,
  "with_audio": 75,
  "resonance_aligned": 50,
  "last_sync": "2025-11-24T02:00:00.000000"
}
```

#### GET `/api/nft/create/<token_id>/<frequency>`
Create NFT metadata with resonance integration.

**Parameters:**
- `token_id`: Integer (NFT token ID)
- `frequency`: Integer (528 or 963)

**Response:**
```json
{
  "token_id": 1,
  "name": "ScrollVerse Resonance NFT #1",
  "description": "This NFT embodies the Love Vortex frequency at 528Hz...",
  "image": "ipfs://QmScrollVerse1",
  "animation_url": "ipfs://QmScrollVerseAudio1",
  "attributes": [
    {
      "trait_type": "Resonance Frequency",
      "value": 528,
      "display_type": "number"
    },
    {
      "trait_type": "Frequency Type",
      "value": "Love Vortex"
    },
    ...
  ],
  "audio_metadata": {
    "frequency": 528,
    "waveform": "sine",
    "sample_rate": 44100,
    "bit_depth": 16,
    "channels": 2,
    "duration": 60,
    "format": "wav"
  },
  "treasury_integration": {
    "vault_link": "0x...",
    "resonance_contribution": "528 ETH",
    "governance_weight": "1.0 (Love Vortex)"
  }
}
```

#### GET `/api/nft/sync/<token_id>`
Synchronize NFT with treasury vault.

**Parameters:**
- `token_id`: Integer (NFT token ID)

**Response:**
```json
{
  "token_id": 1,
  "vault_address": "0x...",
  "sync_status": "synchronized",
  "timestamp": "2025-11-24T02:00:00.000000",
  "contribution": {
    "eth_value": "0.528",
    "scroll_coin": "963",
    "total_value_usd": "1,528.00"
  },
  "resonance_link": "active",
  "governance_active": true
}
```

#### GET `/api/nft/audio-integration`
Get audio metadata integration status.

**Response:**
```json
{
  "total_nfts": 100,
  "nfts_with_audio": 75,
  "integration_percentage": 75.0,
  "supported_frequencies": [528, 963],
  "audio_format": "WAV (16-bit, 44.1kHz, Stereo)",
  "storage": "IPFS",
  "status": "operational"
}
```

### Governance Endpoint

#### GET `/api/governance/status`
Get comprehensive governance system status.

**Response:**
```json
{
  "resonance_system": {...},
  "treasury": {...},
  "nft_collection": {...},
  "audio_integration": {...},
  "manifest": {
    "collection_name": "ScrollVerse Resonance Collection",
    "contract_address": "0x...",
    "total_supply": 100,
    "resonance_integration": {...},
    "treasury_status": "synchronized",
    "governance_features": {
      "voting_enabled": true,
      "staking_enabled": true,
      "royalty_distribution": "15%",
      "resonance_rewards": "active"
    }
  },
  "system_health": "optimal",
  "governance_active": true
}
```

## Web Interface

### Main Routes

- `/` - Cosmic Constitution page
- `/dashboard` - Real-time governance dashboard with live updates

### Dashboard Features

The dashboard provides real-time visualization of:
- Resonance system status with live phase tracking
- Harmonic convergence percentage
- Treasury balances and synchronization status
- NFT collection metrics
- Audio integration statistics

Auto-refreshes every 2 seconds for real-time monitoring.

## Configuration

Create a `.env` file based on `.env.example`:

```bash
# Flask Configuration
SECRET_KEY=your-secret-key
DEBUG=False

# Ethereum Configuration
ETH_RPC_URL=https://mainnet.infura.io/v3/YOUR_INFURA_KEY
ETH_VAULT_ADDRESS=0x...

# NFT Configuration
NFT_CONTRACT_ADDRESS=0x...
IPFS_GATEWAY=https://ipfs.io/ipfs/

# Update Intervals (seconds)
TREASURY_UPDATE_INTERVAL=60
RESONANCE_UPDATE_INTERVAL=5
```

## Installation

```bash
# Install dependencies
pip install -r requirements.txt

# Run the application
python app.py
```

The application will be available at `http://localhost:5000`

## Integration Examples

### Creating an NFT with Resonance Data

```python
import requests

# Create Love Vortex NFT
response = requests.get('http://localhost:5000/api/nft/create/1/528')
metadata = response.json()

# Sync with treasury
sync_response = requests.get('http://localhost:5000/api/nft/sync/1')
```

### Monitoring Resonance System

```python
import requests
import time

while True:
    status = requests.get('http://localhost:5000/api/resonance/status').json()
    print(f"Convergence: {status['harmonic_convergence']:.2%}")
    print(f"Quality: {status['resonance_quality']}")
    time.sleep(2)
```

## Technical Notes

### Resonance Frequencies

- **528 Hz (Love Vortex)**: The Flame of Creation, associated with DNA repair and transformation
- **963 Hz (Eden Pulse)**: Crown chakra activation, divine connection frequency
- **Frequency Ratio**: 1.823864 (963/528) - Sacred geometric proportion

### Audio Metadata Standards

All NFTs include standard audio metadata:
- Format: WAV
- Sample Rate: 44,100 Hz
- Bit Depth: 16-bit
- Channels: Stereo (2)
- Duration: 60 seconds
- Storage: IPFS

### Governance Features

- **Voting Weight**: Based on resonance frequency alignment
  - Love Vortex (528Hz): 1.0 weight
  - Eden Pulse (963Hz): 1.823 weight multiplier
- **Royalty Distribution**: 15% to treasury
- **Staking**: Enabled for all resonance-aligned NFTs
- **Rewards**: Active for harmonic convergence contributions

## Security Considerations

1. **Environment Variables**: Never commit `.env` files
2. **API Keys**: Keep Infura/blockchain keys secure
3. **Wallet Security**: Use hardware wallets for treasury management
4. **Smart Contracts**: Audit before deployment
5. **IPFS**: Pin important metadata to prevent data loss

## Future Enhancements

- Real blockchain integration with Web3
- Advanced audio synthesis for NFT animations
- Multi-frequency support beyond 528/963 Hz
- DAO governance integration
- Cross-chain bridge support
- Enhanced treasury analytics
- Real-time audio streaming for NFTs
