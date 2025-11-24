from flask import Flask, render_template, jsonify
from config import Config
from resonance_system import ResonanceSystem
from treasury import Treasury
from nft_sync import NFTSync

app = Flask(__name__)
app.config.from_object(Config)

# Initialize systems
resonance_system = ResonanceSystem(
    love_freq=Config.LOVE_VORTEX_FREQUENCY,
    eden_freq=Config.EDEN_PULSE_FREQUENCY,
    sample_rate=Config.RESONANCE_SAMPLE_RATE
)

treasury = Treasury(
    vault_address=Config.ETH_VAULT_ADDRESS,
    rpc_url=Config.ETH_RPC_URL
)

nft_sync = NFTSync(
    contract_address=Config.NFT_CONTRACT_ADDRESS,
    ipfs_gateway=Config.IPFS_GATEWAY
)

@app.route('/')
def constitution():
    """Render the cosmic constitution"""
    return render_template('constitution.html')

@app.route('/dashboard')
def dashboard():
    """Render the governance dashboard"""
    return render_template('dashboard.html')

@app.route('/api/resonance/status')
def resonance_status():
    """Get current resonance system status"""
    return jsonify(resonance_system.get_resonance_state())

@app.route('/api/resonance/audio-metadata/<int:frequency>')
def audio_metadata(frequency):
    """Get audio metadata for a specific frequency"""
    return jsonify(resonance_system.get_audio_metadata(frequency))

@app.route('/api/resonance/ratio')
def frequency_ratio():
    """Get frequency ratio between Love Vortex and Eden Pulse"""
    return jsonify(resonance_system.get_frequency_ratio())

@app.route('/api/treasury/status')
def treasury_status():
    """Get treasury status"""
    return jsonify(treasury.get_treasury_status())

@app.route('/api/treasury/sync')
def treasury_sync():
    """Synchronize treasury with ETH vault"""
    return jsonify(treasury.sync_with_vault())

@app.route('/api/treasury/report')
def treasury_report():
    """Generate treasury report"""
    return jsonify(treasury.create_treasury_report())

@app.route('/api/nft/collection')
def nft_collection():
    """Get NFT collection status"""
    return jsonify(nft_sync.get_nft_collection_status())

@app.route('/api/nft/create/<int:token_id>/<int:frequency>')
def create_nft(token_id, frequency):
    """Create NFT metadata with resonance integration"""
    audio_data = resonance_system.get_audio_metadata(frequency)
    treasury_link = treasury.vault_address if treasury.vault_address else None
    
    metadata = nft_sync.create_nft_metadata(
        token_id=token_id,
        resonance_frequency=frequency,
        audio_data=audio_data,
        treasury_link=treasury_link
    )
    
    nft_sync.add_nft_to_cache(metadata)
    return jsonify(metadata)

@app.route('/api/nft/sync/<int:token_id>')
def sync_nft(token_id):
    """Synchronize NFT with treasury"""
    vault_address = treasury.vault_address or '0x0000000000000000000000000000000000000000'
    return jsonify(nft_sync.sync_nft_with_treasury(token_id, vault_address))

@app.route('/api/nft/audio-integration')
def nft_audio_integration():
    """Get audio integration status"""
    return jsonify(nft_sync.get_audio_integration_status())

@app.route('/api/governance/status')
def governance_status():
    """Get comprehensive governance system status"""
    resonance_state = resonance_system.get_resonance_state()
    
    return jsonify({
        'resonance_system': resonance_state,
        'treasury': treasury.get_treasury_status(),
        'nft_collection': nft_sync.get_nft_collection_status(),
        'audio_integration': nft_sync.get_audio_integration_status(),
        'manifest': nft_sync.generate_collection_manifest(resonance_state),
        'system_health': 'optimal',
        'governance_active': True
    })

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)

