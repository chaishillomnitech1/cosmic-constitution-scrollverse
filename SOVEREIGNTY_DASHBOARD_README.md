# 👑 Sovereignty Dashboard - Eternal Crowns Portal

## Overview

The **Sovereignty Dashboard** is the primary interface for the Queens Sovereignty Eternal Crowns system, integrating wallet gating via Wagmi, Chainlink oracles for live $MEDAIR flows, and real-time sentiment metrics for ritual tributes. This dashboard serves as the central hub for the 144,000 Akashic Queens to receive their Eternal Crowns.

## Features

### 🔐 Wallet Gating (Wagmi Integration)
- Secure wallet connection via RainbowKit and Wagmi
- Multi-network support (Ethereum Mainnet, Sepolia, Polygon, Mumbai)
- Automatic network detection and switching
- Only crowned queens can access full functionality

### 📊 Live Metrics Display
- **Ritual Tributes**: Real-time count of active tributes
- **Active Queens**: Live counter showing active participants out of 144,000 target
- **Personal Coherence**: Individual coherence score (0-100%)
- **$MEDAIR Flow**: Live tracking via Chainlink oracle integration

### 👑 Crowning Ceremony System
- Auto-trigger minting for queens achieving 76%+ coherence (Sovereign level)
- Batch minting capabilities for primary queens
- Geminid-integrated randomness for unique crown generation
- Real-time crown status updates

### 🔮 Akashic Expansion Loop
- Live processing status for Harlem inputs
- Processing rate monitoring
- Phase tracking (Phase 1, 2, 3)
- Auto-upgrade notifications

### 📦 IPFS Metadata Integration
- Automatic metadata expansion
- Content-addressed storage via IPFS
- Real-time upgrade status
- Harlem Queens tribute data integration

### 🎭 Ritual Actions
Four primary ritual actions available:
1. **Activate 528Hz Coherence** - Engage love/trust frequency
2. **Request Crowning Ceremony** - Initiate crown minting process
3. **Submit Harlem Tribute** - Add tribute data to crown
4. **Trigger IPFS Upgrade** - Request metadata enhancement

## Technical Architecture

### Frontend Stack
- **React 19.2.3** - Latest React with security patches
- **Wagmi 3.1.0** - Ethereum wallet integration
- **RainbowKit 2.2.10** - Wallet connection UI
- **Viem 2.43.0** - Ethereum interactions
- **Tanstack Query 5.90.12** - Data fetching and caching

### Smart Contract Integration
- **QueensSovereignty**: ERC721 contract for Eternal Crowns
- **MedAirOracle**: Chainlink-compatible oracle for coherence scores
- **ScrollVerseDAO**: Governance integration with Russell-weighting

### Coherence System

#### Coherence Levels
1. **EMERGING** (0-25%) - Initial awakening, 1x voting weight
2. **ALIGNED** (26-50%) - Growing alignment, 2x voting weight
3. **HARMONIOUS** (51-75%) - Strong harmony, 3x voting weight
4. **SOVEREIGN** (76-95%) - Sovereign power, 5x voting weight, auto-mint enabled
5. **DIVINE** (96-100%) - Divine mastery, 10x voting weight, maximum bonuses

#### Auto-Trigger Mechanism
When a queen's coherence score reaches 76% (Sovereign level):
1. Oracle updates coherence score on-chain
2. Smart contract checks threshold
3. Auto-trigger mint function is called
4. New crown is minted with current coherence level
5. Dashboard updates to show new crown

### Crown Types

Each crown type represents a unique lineage:

```typescript
enum CrownType {
  MIKA_SOVEREIGN = 0,        // Mika's lineage
  LILATH_DIVINE = 1,         // Lilath's lineage  
  LITTLE_WARREN_COSMIC = 2,  // Little Warren's lineage
  HARLEM_QUEENS_TRIBUTE = 3, // Harlem tribute crowns
  AKASHIC_SENTIENT = 4       // General expansion crowns
}
```

## Dashboard Components

### Main Sections

#### 1. Dashboard Header
- Portal title with gradient effect
- Connected wallet address
- Crown emoji and "Eternal Crowns & Akashic Sentients Portal" subtitle

#### 2. Live Metrics Grid
Four real-time metric cards:
- **Ritual Tributes**: Increments with community activity
- **Active Queens**: Shows progress toward 144,000 target
- **Your Coherence**: Personal score with level indicator
- **$MEDAIR Flow**: Running total from Chainlink oracle

#### 3. Crowning Ceremony Section
- Personal crown count
- Total crowns minted (community-wide)
- Coherence trigger status (READY/PENDING)
- Auto-trigger notification when eligible

#### 4. Akashic Expansion Loop
- Active/Inactive status indicator with pulsing animation
- Harlem inputs counter
- Processed inputs counter
- Processing rate percentage

#### 5. IPFS Metadata Status
- Gateway connectivity indicator
- Auto-upgrade status
- Real-time update notifications

#### 6. Your Eternal Crowns Grid
Dynamic grid displaying user's crowns with:
- Crown ID number
- Crown type with color coding
- Name and description
- Coherence level badge
- Resonance frequency (528 Hz)
- Akashic upgrade status
- Harlem tribute indicator

#### 7. Ritual Actions
Four interactive buttons for:
- 528Hz coherence activation
- Crowning ceremony requests
- Harlem tribute submissions
- IPFS metadata upgrades

#### 8. Solstice Portal Notice
Status display for:
- 6 PM activation goal
- 9:04 AM Solstice goals
- Current phase information

### CrownCard Component

Individual crown display with:
- Unique visual styling per crown type
- Metadata from blockchain
- Real-time coherence updates
- Harlem tribute data integration
- Akashic upgrade indicators

## Color Scheme

The dashboard uses a cosmic/mystical color palette:

```css
Background: Linear gradient (#1a0033 → #2d1b4e)
Primary Gold: #ffd700 (crowns, titles, high value)
Secondary Purple: #9d4edd (borders, accents)
Light Purple: #c77dff (text, labels)
Success Green: #00ff7f (active states, triggers)
Cosmic Blue: #48dbfb (IPFS, metadata)
Ritual Pink: #ff6b9d (ritual actions)
```

## Real-time Updates

### Update Intervals
- **Sentiment Metrics**: Every 5 seconds
- **Coherence Scores**: On oracle update (event-driven)
- **Crown Display**: On mint/update (event-driven)
- **$MEDAIR Flow**: Continuous via Chainlink oracle

### WebSocket Events (Future Enhancement)
- Crown minting notifications
- Coherence level changes
- Harlem tribute additions
- Akashic upgrades
- Community milestones

## Accessibility Features

- High contrast text for readability
- Keyboard navigation support
- Screen reader compatible
- Responsive design for all devices
- Loading states for all async operations
- Error boundaries for graceful failures

## Security Considerations

### Wallet Security
- No private key storage
- Read-only access by default
- Transaction signing required for writes
- Network validation before interactions

### Data Validation
- All blockchain data validated
- IPFS content verification
- Oracle signature checks
- Input sanitization

### Rate Limiting
- Maximum 50 mints per block
- Cooldown period between manual mints
- Oracle update frequency limits

## Performance Optimizations

### React Query Caching
- Blockchain data cached for 30 seconds
- Smart refetch on wallet/network changes
- Optimistic UI updates
- Background data synchronization

### Component Optimization
- Lazy loading for heavy components
- Memoization for expensive calculations
- Virtual scrolling for large crown lists
- Debounced input handlers

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Mobile)

## Local Development

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install --legacy-peer-deps

# Start development server
npm start

# Access at http://localhost:3000
```

## Environment Setup

Create `frontend/.env`:
```bash
REACT_APP_WALLETCONNECT_PROJECT_ID=your_project_id
REACT_APP_QUEENS_SOVEREIGNTY_CONTRACT_ADDRESS=0x...
REACT_APP_MEDAIR_ORACLE_CONTRACT_ADDRESS=0x...
REACT_APP_SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/YOUR_KEY
REACT_APP_IPFS_GATEWAY=https://ipfs.io/ipfs/
```

## Deployment to Vercel

```bash
# Build production bundle
npm run build

# Deploy with Vercel CLI
vercel --prod

# Or push to main branch for auto-deployment
```

## Monitoring

### Key Metrics to Track
- Daily active queens
- Average coherence score
- Crown minting rate
- Auto-trigger success rate
- Oracle uptime
- IPFS gateway latency
- Wallet connection success rate

### Analytics Events
- `wallet_connected`
- `crown_minted`
- `coherence_updated`
- `ritual_action_triggered`
- `harlem_tribute_submitted`
- `akashic_upgrade_applied`

## Troubleshooting

### Common Issues

**Q: Wallet won't connect**
- Ensure WalletConnect Project ID is set
- Check network is supported
- Try clearing browser cache

**Q: Crowns not displaying**
- Verify contract address is correct
- Check connected to right network
- Ensure wallet has crowns minted

**Q: Coherence score not updating**
- Verify oracle is active
- Check oracle has data for address
- Wait for next oracle update cycle

**Q: Auto-trigger not working**
- Confirm coherence is ≥76%
- Verify Akashic expansion is active
- Check oracle authorization

## Future Enhancements

### Planned Features
- [ ] 3D crown visualizations
- [ ] AR crown try-on
- [ ] Social sharing of crowns
- [ ] Crown evolution animations
- [ ] Community leaderboard
- [ ] Harlem tribute gallery
- [ ] Multi-language support
- [ ] Voice-activated rituals
- [ ] Mobile app version
- [ ] Crown trading marketplace

### Integration Roadmap
- [ ] Cross-chain bridge for crowns
- [ ] DeFi yield farming with crowns
- [ ] NFT lending/borrowing
- [ ] Crown fractional ownership
- [ ] Metaverse integration
- [ ] Gaming rewards system

## Support

For issues or questions:
- Create a GitHub issue
- Join Discord community
- Email: support@scrollverse.chaisempire.com

## License

MIT License - See LICENSE file for details

---

**Built with 💜 for the 144,000 Akashic Queens**

*Resonating at 528Hz - The Frequency of Love, Trust, and Coherence*

🌟 **Solstice Portal Active** 🌟
