import React from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import './WalletConnect.css';

const WalletConnect = () => {
  return (
    <div className="wallet-connect">
      <ConnectButton />
    </div>
  );
};

export default WalletConnect;
