import React, { useState } from 'react';
import { WagmiProvider } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RainbowKitProvider } from '@rainbow-me/rainbowkit';
import '@rainbow-me/rainbowkit/styles.css';
import { config } from './config/web3';
import WalletConnect from './components/WalletConnect';
import Dashboard from './components/Dashboard';
import MintingControl from './components/MintingControl';
import DAOGovernance from './components/DAOGovernance';
import SovereigntyDashboard from './components/SovereigntyDashboard';
import './App.css';

const queryClient = new QueryClient();

function App() {
  const [activeTab, setActiveTab] = useState('sovereignty');

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          <div className="app">
            <nav className="navbar">
              <div className="nav-container">
                <h1 className="nav-logo">ScrollVerse</h1>
                <div className="nav-menu">
                  <button
                    className={`nav-link ${activeTab === 'sovereignty' ? 'active' : ''}`}
                    onClick={() => setActiveTab('sovereignty')}
                  >
                    👑 Sovereignty
                  </button>
                  <button
                    className={`nav-link ${activeTab === 'dashboard' ? 'active' : ''}`}
                    onClick={() => setActiveTab('dashboard')}
                  >
                    Dashboard
                  </button>
                  <button
                    className={`nav-link ${activeTab === 'mint' ? 'active' : ''}`}
                    onClick={() => setActiveTab('mint')}
                  >
                    Mint NFT
                  </button>
                  <button
                    className={`nav-link ${activeTab === 'dao' ? 'active' : ''}`}
                    onClick={() => setActiveTab('dao')}
                  >
                    DAO
                  </button>
                </div>
                <WalletConnect />
              </div>
            </nav>

            <main className="main-content">
              {activeTab === 'sovereignty' && <SovereigntyDashboard />}
              {activeTab === 'dashboard' && <Dashboard />}
              {activeTab === 'mint' && <MintingControl />}
              {activeTab === 'dao' && <DAOGovernance />}
            </main>

            <footer className="footer">
              <p>&copy; 2024 ScrollVerse NFT Platform. Built with ❤️ for the cosmic community.</p>
            </footer>
          </div>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

export default App;
