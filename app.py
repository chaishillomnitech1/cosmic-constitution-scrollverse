from flask import Flask, render_template, jsonify, request, redirect, session
from config import Config
from resonance_system import ResonanceSystem
from treasury import Treasury
from nft_sync import NFTSync
from auth import UAuthManager, require_auth, require_guardian_access, require_vault_access

app = Flask(__name__)
app.config.from_object(Config)
app.secret_key = Config.SECRET_KEY

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

# Initialize UAuth Manager
uauth_manager = None
if Config.UAUTH_ENABLED:
    uauth_manager = UAuthManager(
        client_id=Config.UAUTH_CLIENT_ID,
        client_secret=Config.UAUTH_CLIENT_SECRET,
        redirect_uri=Config.UAUTH_REDIRECT_URI,
        secret_key=Config.SECRET_KEY
    )
    app.config['UAUTH_MANAGER'] = uauth_manager

@app.route('/')
def constitution():
    """Render the cosmic constitution"""
    return render_template('constitution.html')

@app.route('/login')
def login_page():
    """Render the login page"""
    return render_template('login.html')


@app.route('/dashboard')
def dashboard():
    """Render the governance dashboard"""
    return render_template('dashboard.html')

# Authentication endpoints
@app.route('/auth/login')
def auth_login():
    """Initiate UAuth login flow"""
    if not uauth_manager:
        return jsonify({
            'error': 'authentication_disabled',
            'message': 'UAuth authentication is not enabled'
        }), 503
    
    auth_data = uauth_manager.generate_authorization_url()
    return jsonify(auth_data)

@app.route('/auth/callback')
def auth_callback():
    """Handle UAuth OAuth callback"""
    if not uauth_manager:
        return jsonify({
            'error': 'authentication_disabled',
            'message': 'UAuth authentication is not enabled'
        }), 503
    
    code = request.args.get('code')
    state = request.args.get('state')
    
    if not code or not state:
        return jsonify({
            'error': 'invalid_request',
            'message': 'Missing code or state parameter'
        }), 400
    
    result = uauth_manager.verify_callback(code, state)
    
    if result['success']:
        # Store token in session
        session['auth_token'] = result['token']
        session['user'] = result['user']
        return redirect('/dashboard')
    else:
        return jsonify(result), 400

@app.route('/auth/logout')
def auth_logout():
    """Logout user and revoke session"""
    if 'auth_token' in session:
        token = session['auth_token']
        if uauth_manager:
            uauth_manager.revoke_session(token)
        session.clear()
    
    return jsonify({
        'success': True,
        'message': 'Logged out successfully'
    })

@app.route('/auth/status')
def auth_status():
    """Check authentication status"""
    if not uauth_manager:
        return jsonify({
            'authenticated': False,
            'uauth_enabled': False
        })
    
    auth_header = request.headers.get('Authorization')
    if auth_header:
        try:
            token = auth_header.split(' ')[1]
            user_info = uauth_manager.get_session_info(token)
            if user_info:
                return jsonify({
                    'authenticated': True,
                    'uauth_enabled': True,
                    'user': user_info
                })
        except:
            pass
    
    # Check session
    if 'auth_token' in session:
        user_info = uauth_manager.get_session_info(session['auth_token'])
        if user_info:
            return jsonify({
                'authenticated': True,
                'uauth_enabled': True,
                'user': user_info
            })
    
    return jsonify({
        'authenticated': False,
        'uauth_enabled': True
    })


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
@require_vault_access
def treasury_sync():
    """Synchronize treasury with ETH vault (requires vault access)"""
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
@require_auth
def create_nft(token_id, frequency):
    """Create NFT metadata with resonance integration (requires authentication)"""
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
@require_auth
def sync_nft(token_id):
    """Synchronize NFT with treasury (requires authentication)"""
    vault_address = treasury.vault_address or '0x0000000000000000000000000000000000000000'
    return jsonify(nft_sync.sync_nft_with_treasury(token_id, vault_address))

@app.route('/api/nft/audio-integration')
def nft_audio_integration():
    """Get audio integration status"""
    return jsonify(nft_sync.get_audio_integration_status())

@app.route('/api/governance/status')
@require_guardian_access
def governance_status():
    """Get comprehensive governance system status (requires guardian access)"""
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

