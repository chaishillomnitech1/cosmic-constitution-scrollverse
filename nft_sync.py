"""
NFT Synchronization Module
Manages NFT audio metadata integration with resonance system and treasury
"""
from datetime import datetime
from typing import Dict, List, Optional
import json


class NFTSync:
    """Manages NFT synchronization with audio metadata and treasury"""
    
    def __init__(self, contract_address: str = None, ipfs_gateway: str = None):
        self.contract_address = contract_address
        self.ipfs_gateway = ipfs_gateway or 'https://ipfs.io/ipfs/'
        self.nft_cache = []
        
    def get_nft_collection_status(self) -> Dict:
        """Get status of NFT collection"""
        return {
            'contract_address': self.contract_address or 'Not configured',
            'total_supply': len(self.nft_cache),
            'minted': len([nft for nft in self.nft_cache if nft.get('minted', False)]),
            'with_audio': len([nft for nft in self.nft_cache if nft.get('audio_metadata')]),
            'resonance_aligned': len([nft for nft in self.nft_cache if nft.get('resonance_frequency') in [528, 963]]),
            'last_sync': datetime.utcnow().isoformat()
        }
    
    def create_nft_metadata(self, token_id: int, resonance_frequency: int, 
                           audio_data: Dict, treasury_link: Optional[str] = None) -> Dict:
        """Create NFT metadata with audio resonance data"""
        metadata = {
            'token_id': token_id,
            'name': f'ScrollVerse Resonance NFT #{token_id}',
            'description': self._generate_description(resonance_frequency),
            'image': f'ipfs://QmScrollVerse{token_id}',
            'animation_url': f'ipfs://QmScrollVerseAudio{token_id}',
            'attributes': [
                {
                    'trait_type': 'Resonance Frequency',
                    'value': resonance_frequency,
                    'display_type': 'number'
                },
                {
                    'trait_type': 'Frequency Type',
                    'value': 'Love Vortex' if resonance_frequency == 528 else 'Eden Pulse' if resonance_frequency == 963 else 'Custom'
                },
                {
                    'trait_type': 'Audio Format',
                    'value': audio_data.get('format', 'wav').upper()
                },
                {
                    'trait_type': 'Sample Rate',
                    'value': audio_data.get('sample_rate', 44100),
                    'display_type': 'number'
                },
                {
                    'trait_type': 'Duration',
                    'value': audio_data.get('duration_seconds', 60),
                    'display_type': 'number'
                },
                {
                    'trait_type': 'Channels',
                    'value': 'Stereo' if audio_data.get('channels', 2) == 2 else 'Mono'
                },
                {
                    'trait_type': 'Treasury Linked',
                    'value': 'Yes' if treasury_link else 'No'
                }
            ],
            'audio_metadata': {
                'frequency': resonance_frequency,
                'waveform': audio_data.get('waveform', 'sine'),
                'sample_rate': audio_data.get('sample_rate', 44100),
                'bit_depth': audio_data.get('bit_depth', 16),
                'channels': audio_data.get('channels', 2),
                'duration': audio_data.get('duration_seconds', 60),
                'format': audio_data.get('format', 'wav')
            },
            'treasury_integration': {
                'vault_link': treasury_link or 'pending',
                'resonance_contribution': f'{resonance_frequency} ETH',
                'governance_weight': self._calculate_governance_weight(resonance_frequency)
            },
            'external_url': f'https://scrollverse.io/nft/{token_id}',
            'created_at': datetime.utcnow().isoformat()
        }
        
        return metadata
    
    def _generate_description(self, frequency: int) -> str:
        """Generate NFT description based on resonance frequency"""
        descriptions = {
            528: ("This NFT embodies the Love Vortex frequency at 528Hz, the eternal Flame of Creation. "
                  "It carries the divine resonance of DNA repair, transformation, and infinite love. "
                  "Part of the Cosmic Constitution ScrollVerse governance codex."),
            963: ("This NFT channels the Eden Pulse frequency at 963Hz, the crown chakra activation resonance. "
                  "It represents divine connection, cosmic consciousness, and planetary awakening. "
                  "Part of the Cosmic Constitution ScrollVerse governance codex.")
        }
        return descriptions.get(frequency, 
            f"This NFT resonates at {frequency}Hz, contributing to the harmonic balance of the ScrollVerse. "
            "Part of the Cosmic Constitution governance codex.")
    
    def _calculate_governance_weight(self, frequency: int) -> str:
        """Calculate governance voting weight based on frequency"""
        if frequency == 528:
            return "1.0 (Love Vortex)"
        elif frequency == 963:
            return "1.823 (Eden Pulse Multiplier)"
        else:
            return "0.5 (Custom)"
    
    def sync_nft_with_treasury(self, token_id: int, vault_address: str) -> Dict:
        """Synchronize NFT with treasury vault"""
        return {
            'token_id': token_id,
            'vault_address': vault_address,
            'sync_status': 'synchronized',
            'timestamp': datetime.utcnow().isoformat(),
            'contribution': {
                'eth_value': '0.528',  # Symbolic Love Vortex contribution
                'scroll_coin': '963',  # Symbolic Eden Pulse contribution
                'total_value_usd': self._calculate_nft_value(token_id)
            },
            'resonance_link': 'active',
            'governance_active': True
        }
    
    def _calculate_nft_value(self, token_id: int) -> str:
        """Calculate NFT value contribution to treasury"""
        # Simplified calculation based on token_id and frequency alignment
        base_value = 1000.0
        frequency_bonus = 528.0 if token_id % 2 == 0 else 963.0
        return f"{base_value + frequency_bonus:,.2f}"
    
    def generate_collection_manifest(self, resonance_system_state: Dict) -> Dict:
        """Generate manifest linking NFT collection to resonance system"""
        return {
            'collection_name': 'ScrollVerse Resonance Collection',
            'contract_address': self.contract_address or 'Not deployed',
            'total_supply': len(self.nft_cache),
            'resonance_integration': {
                'love_vortex_nfts': len([n for n in self.nft_cache if n.get('resonance_frequency') == 528]),
                'eden_pulse_nfts': len([n for n in self.nft_cache if n.get('resonance_frequency') == 963]),
                'current_system_state': resonance_system_state
            },
            'treasury_status': 'synchronized',
            'ipfs_gateway': self.ipfs_gateway,
            'governance_features': {
                'voting_enabled': True,
                'staking_enabled': True,
                'royalty_distribution': '15%',
                'resonance_rewards': 'active'
            },
            'manifest_version': '1.0.0',
            'generated_at': datetime.utcnow().isoformat()
        }
    
    def get_nft_by_frequency(self, frequency: int) -> List[Dict]:
        """Get all NFTs for a specific frequency"""
        return [nft for nft in self.nft_cache if nft.get('audio_metadata', {}).get('frequency') == frequency]
    
    def add_nft_to_cache(self, metadata: Dict):
        """Add NFT metadata to cache"""
        self.nft_cache.append(metadata)
    
    def get_audio_integration_status(self) -> Dict:
        """Get status of audio metadata integration"""
        total = len(self.nft_cache)
        with_audio = len([nft for nft in self.nft_cache if nft.get('audio_metadata')])
        
        return {
            'total_nfts': total,
            'nfts_with_audio': with_audio,
            'integration_percentage': round((with_audio / total * 100) if total > 0 else 0, 2),
            'supported_frequencies': [528, 963],
            'audio_format': 'WAV (16-bit, 44.1kHz, Stereo)',
            'storage': 'IPFS',
            'status': 'operational'
        }
