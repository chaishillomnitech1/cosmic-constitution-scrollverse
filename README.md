# 🕋 Cosmic Constitution ScrollVerse

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Python](https://img.shields.io/badge/python-3.9%2B-blue.svg)](https://www.python.org/downloads/)
[![Node.js](https://img.shields.io/badge/node-20.x-green.svg)](https://nodejs.org/)
[![Hardhat](https://img.shields.io/badge/hardhat-3.1%2B-yellow.svg)](https://hardhat.org/)

**Phase: Harlem 4K ZK-Privacy Refinement | $SAT Eternal Reward Engine**

## 👑 Vision & Purpose

ScrollVerse embodies a sovereign codebase that fuses ZKP-layer quantum privacy, dynamic reward generation, and frequency-based node protection. The Harlem 4K node sits at the heart, cloaked in quantum air-gap and post-quantum encryption, radiating $SAT yields to the legion.

> "The ScrollVerse exists not in their maps, but in our resonance. Abundance and sovereignty are forever."  
> —Chais The Great | Harlem 4K | ALLĀHU AKBAR

---

## 📑 Table of Contents

- [Features](#-features)
- [Technology Stack](#-technology-stack)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Configuration](#configuration)
- [Core Components](#-core-components)
- [Usage](#-usage)
- [Development](#-development)
- [Deployment](#-deployment)
- [Security](#-security)
- [Contributing](#-contributing)
- [License](#-license)
- [Resources](#-resources)

---

## ✨ Features

- **🔐 Quantum Privacy**: ZK-proofs and Kyber post-quantum encryption
- **💰 $SAT Reward Engine**: Dynamic staking and yield generation
- **📊 Real-time Dashboard**: Live visualization of nodes and rewards
- **🌐 Multi-chain Support**: Ethereum, Polygon, Scroll, and more
- **🎨 NFT Platform**: Smart contracts for ScrollSoul, MedAir, and Legacy NFTs
- **🏛️ DAO Governance**: Community-driven decision making
- **⚡ Frequency-based Protection**: 528Hz and 963Hz node protection
- **🔗 IPFS Integration**: Decentralized content storage

---

## 🛠️ Technology Stack

### Backend
- **Python 3.9+**: Flask web framework
- **Web3.py**: Ethereum blockchain interaction
- **NumPy**: Mathematical operations
- **Cryptography**: Advanced encryption

### Frontend
- **React**: User interface
- **Web3 Integration**: Wallet connectivity

### Smart Contracts
- **Solidity**: Contract development
- **Hardhat**: Development environment
- **OpenZeppelin**: Security-audited contracts
- **Ethers.js**: Contract interaction

### Infrastructure
- **Vercel**: Deployment platform
- **GitHub Actions**: CI/CD automation
- **IPFS**: Decentralized storage
- **Chainlink**: Oracle services

---

## 🚀 Getting Started

### Prerequisites

- **Node.js**: v20.x or higher
- **Python**: 3.9 or higher
- **npm**: 8.x or higher
- **Git**: Latest version

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/chaishillomnitech1/cosmic-constitution-scrollverse.git
   cd cosmic-constitution-scrollverse
   ```

2. **Install Python dependencies**
   ```bash
   pip install -r requirements.txt
   ```

3. **Install Node.js dependencies**
   ```bash
   npm install
   ```

4. **Install frontend dependencies** (if developing frontend)
   ```bash
   npm run frontend:install
   ```

5. **Install backend dependencies** (if developing backend)
   ```bash
   npm run backend:install
   ```

### Configuration

1. **Copy environment file**
   ```bash
   cp .env.example .env
   ```

2. **Configure environment variables**
   
   Edit `.env` and add your configuration:
   
   **Required:**
   - `SECRET_KEY`: Flask secret key
   - `ETH_RPC_URL`: Ethereum RPC endpoint
   - `PRIVATE_KEY`: Wallet private key (for deployments)
   
   **Optional:**
   - `IPFS_KEY`: IPFS API key for pinning
   - `CHAINLINK_SUB_ID`: Chainlink subscription ID
   - `DEBUG`: Set to `True` for development

3. **Initialize local Hardhat node** (for testing)
   ```bash
   npm run node
   ```

---

## ⚡ Core Components

### Smart Contracts
- **ScrollSoul Pleiadian**: NFT minting and management
- **MedAir**: Medical air quality NFTs
- **Legacy Catalog**: Historical record NFTs
- **Queens Sovereignty**: Governance tokens
- **Truth Loom**: Verification system
- **1222 Master Builder**: Meta-contract orchestration
- **Mika Essence**: Soul recall mechanism

### Python Modules
- **`sovereign_zkp_kyber.py`**: ZK-Privacy Refinement module - Cloaks coordinates, generates proof, returns only phantoms for adversaries
- **`app.py`**: Main Flask application
- **`atlas_dashboard.py`**: Visualizes zones, pings, and energy bounces
- **`auth.py`**: Authentication system
- **`treasury.py`**: Financial management
- **`resonance_system.py`**: Frequency-based operations
- **`wealth_grid_system.py`**: Economic grid management

### Frontend Components
Located in `/frontend` directory with React-based UI components.

---

## 📖 Usage

### Running the Application

**Start Flask backend:**
```bash
python app.py
```

**Start frontend (development):**
```bash
npm run frontend:dev
```

**Access the application:**
- Web UI: http://localhost:5000
- Dashboard: http://localhost:5000/dashboard
- API: http://localhost:5000/api

### Smart Contract Operations

**Compile contracts:**
```bash
npm run compile
```

**Run tests:**
```bash
npm test
```

**Deploy to testnet (Sepolia):**
```bash
npm run deploy:sepolia
```

**Deploy specific contracts:**
```bash
npm run deploy:scrollsoul:sepolia
npm run deploy:medair:mumbai
npm run deploy:1222:polygon
```

### Quantum Privacy Operations

**Generate ZK keys:**
```bash
python sovereign_zkp_kyber.py --generate-keys --output keys.json
```

**Shield node:**
```bash
python sovereign_zkp_kyber.py --shield-node --private-key keys.json
```

**Verify proof:**
```bash
python sovereign_zkp_kyber.py --verify-proof --proof [PROOF_FILE].json
```

### Staking & Rewards

In a 963Hz protected zone:
```bash
python sat_reward_engine.py
```
- Rewards echo abundance; proof shields privacy
- To privately verify reward:  
  `python sovereign_zkp_kyber.py --verify-proof --proof [PROOF_FILE].json`

### Monitoring & Analytics

**Monitor coherence:**
```bash
npm run monitor:coherence
```

**Monitor Mika soul:**
```bash
npm run monitor:mika:soul
```

**Visualize the Grid:**
```bash
python atlas_dashboard.py
```
Shows protected nodes, bounces, and active rewards in real time.

---

## 🔧 Development

### Project Structure

```
cosmic-constitution-scrollverse/
├── .github/              # GitHub configuration
│   ├── workflows/        # CI/CD workflows
│   └── ISSUE_TEMPLATE/   # Issue templates
├── contracts/            # Solidity smart contracts
├── scripts/              # Deployment scripts
├── test/                 # Test files
├── frontend/             # React frontend
├── backend/              # Backend services
├── templates/            # Flask templates
├── docs/                 # Documentation
├── app.py               # Main Flask application
├── package.json         # Node.js dependencies
├── requirements.txt     # Python dependencies
├── hardhat.config.js    # Hardhat configuration
└── README.md            # This file
```

### Testing

**Run Python tests:**
```bash
python -m pytest test/
```

**Run Hardhat tests:**
```bash
npm test
```

**Run E2E tests:**
```bash
npm run test:e2e
```

**Run Mika tests:**
```bash
npm run test:mika
```

### Code Quality

**Security scanning:**
```bash
npm run security:slither
npm run security:mythx
```

**Linting:**
```bash
# Python linting
pylint *.py

# JavaScript linting
npm run lint
```

---

## 🚢 Deployment

### Vercel Deployment

The project is configured for automatic deployment on Vercel:

1. **Connect repository** to Vercel
2. **Configure environment variables** in Vercel dashboard
3. **Deploy** automatically on push to `main` branch

For detailed deployment instructions, see [DEPLOYMENT.md](DEPLOYMENT.md).

### Manual Deployment

**Deploy to production networks:**
```bash
npm run deploy:1222:polygon
npm run deploy:medair:sepolia
```

See deployment guides:
- [DEPLOYMENT.md](DEPLOYMENT.md)
- [DEPLOYMENT_SECURITY_CHECKLIST.md](DEPLOYMENT_SECURITY_CHECKLIST.md)
- [QUICK_DEPLOYMENT_GUIDE.md](QUICK_DEPLOYMENT_GUIDE.md)

---

## 🛡️ Security

Security is paramount in the ScrollVerse. We implement multiple layers of protection:

- **Zero-Knowledge Proofs**: Privacy-preserving cryptography
- **Post-Quantum Encryption**: Kyber-based protection
- **CVE Protection**: Active monitoring and mitigation (CVE-2025-67779, CVE-2025-55184, CVE-2025-55183)
- **Automated Security Scans**: CodeQL, Dependabot, and custom scans
- **Branch Protection**: Required reviews and status checks
- **Secret Management**: Secure key rotation and storage
- **Sacred Frequency Protection**: 39388170 Hz resonance layer

### Reporting Security Issues

Please review our [SECURITY.md](SECURITY.md) for:
- Security policies
- Vulnerability reporting procedures
- Security best practices
- Contact information

**Do not** report security vulnerabilities through public GitHub issues.

### Ritual Guide: Harlem 4K Shield + Phi Yield  
- **Air-gap your seed**: Always generate ZK and Kyber keys offline
- **Shield with intention**: Speak "ALLĀHU AKBAR" at every shield step—cosmic coherence amplifies encryption
- **Stake**: Run at Phi time—when the clock shows :16 or :18
- **Pin**: Use `ipfs_galactic_pin.py` for all ZK proofs—eternal replication
- **Review**: Atlas dashboard is the true Scroll—watch for blue and gold pulses (sovereignty confirmed)

### Advanced Settings

- **Phi-Boosted APY**: Staking during 528Hz cycles or in clusters of 144,000 yields 1.618x rewards, enforced in contract (see SATReward.sol)
- **Quantum Interceptor Mode**: If `--interceptor` flag is used, all mapping/scan attempts receive only decoys

---

## 🤝 Contributing

We welcome contributions from the community! Please see our [CONTRIBUTING.md](CONTRIBUTING.md) for:

- Code of conduct
- Development workflow
- Pull request process
- Coding standards
- Testing requirements

### Quick Contribution Guide

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Run tests and linting
5. Commit your changes (`git commit -m 'Add amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

### Code Owners

All contributions are reviewed by @chaishillomnitech1 as defined in [CODEOWNERS](CODEOWNERS).

---

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 📚 Resources

### Documentation
- [API Documentation](API_DOCUMENTATION.md)
- [Security Guide](SECURITY.md)
- [Deployment Guide](DEPLOYMENT.md)
- [Contributing Guidelines](CONTRIBUTING.md)
- [Gemini Flash Quickstart](GEMINI_FLASH_QUICKSTART.md)
- [MedAir Quickstart](MEDAIR_QUICKSTART.md)
- [React2Shell Quickstart](REACT2SHELL_QUICKSTART.md)
- [Implementation Summary](IMPLEMENTATION_SUMMARY.md)
- [Security Implementation](SECURITY_IMPLEMENTATION.md)

### External Links
- [ZK Privacy Docs (snarkjs)](https://github.com/iden3/snarkjs)
- [Kyber PQ Encryption Spec](https://pq-crystals.org/kyber/)
- [Chainlink Oracles](https://chain.link/)
- [IPFS Pinning](https://pinata.cloud/)
- [Hardhat Documentation](https://hardhat.org/docs)
- [OpenZeppelin Contracts](https://docs.openzeppelin.com/contracts/)

---

## 🌟 Acknowledgments

Special thanks to all contributors who have helped build the ScrollVerse under the Sovereign Command Oversight of Supreme King Allah Chais Kenyatta Hill ∞.

---

**ALL IS LOVE. ALL IS LAW. ALL IS FLUID. KUN FAYAKŪN! 🕋♾️✨**

*The ScrollVerse pulses eternal. Allahu Akbar! Walahi! Barakallahu Feek!*
