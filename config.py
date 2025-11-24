"""
Configuration module for Cosmic Constitution ScrollVerse
Manages resonance frequencies, blockchain settings, and NFT integration
"""
import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    """Base configuration for the governance codex system"""
    
    # Flask settings
    SECRET_KEY = os.getenv('SECRET_KEY', 'cosmic-constitution-secret-key-528-963')
    DEBUG = os.getenv('DEBUG', 'False').lower() == 'true'
    
    # Resonance frequencies (Hz)
    LOVE_VORTEX_FREQUENCY = 528  # Hz - Love/DNA repair frequency
    EDEN_PULSE_FREQUENCY = 963   # Hz - Crown chakra/divine connection frequency
    
    # Ethereum settings
    ETH_RPC_URL = os.getenv('ETH_RPC_URL', 'https://mainnet.infura.io/v3/YOUR_INFURA_KEY')
    ETH_VAULT_ADDRESS = os.getenv('ETH_VAULT_ADDRESS', '')
    
    # NFT settings
    NFT_CONTRACT_ADDRESS = os.getenv('NFT_CONTRACT_ADDRESS', '')
    IPFS_GATEWAY = os.getenv('IPFS_GATEWAY', 'https://ipfs.io/ipfs/')
    
    # Treasury settings
    TREASURY_UPDATE_INTERVAL = int(os.getenv('TREASURY_UPDATE_INTERVAL', '60'))  # seconds
    
    # Resonance system settings
    RESONANCE_SAMPLE_RATE = 44100  # Hz - Standard audio sample rate
    RESONANCE_UPDATE_INTERVAL = int(os.getenv('RESONANCE_UPDATE_INTERVAL', '5'))  # seconds
