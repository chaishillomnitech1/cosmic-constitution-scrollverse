from flask import Flask, render_template, jsonify, request, redirect, session
from config import Config
from resonance_system import ResonanceSystem
from treasury import Treasury
from nft_sync import NFTSync
from auth import UAuthManager, require_auth, require_guardian_access, require_vault_access
from gemini_flash_protocol import GeminiFlashProtocol, PlanetaryNodeSystem
from wealth_grid_system import ZeroPointWealthSystem, FlashDrivenEconomy
from celestial_stability import (
    InterstellarSimulation, CelestialStabilityMetrics,
    DeterministicCoherenceEngine, CelestialMarketAnalyzer
)
from medair_api import setup_medair_routes

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

# Initialize Gemini 3 Flash Protocol Systems
flash_protocol = GeminiFlashProtocol(protocol_version="3.0", flash_mode=True)
planetary_nodes = PlanetaryNodeSystem(flash_protocol)
wealth_system = ZeroPointWealthSystem(flash_protocol)
flash_economy = FlashDrivenEconomy(wealth_system)

# Initialize Celestial Stability Systems
interstellar_sim = InterstellarSimulation(flash_protocol, target_year=2026)
celestial_stability = CelestialStabilityMetrics(flash_protocol)
coherence_engine = DeterministicCoherenceEngine(flash_protocol)
market_analyzer = CelestialMarketAnalyzer(celestial_stability)

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

@app.route('/medair')
def medair_dashboard():
    """Render the MedAir blockchain dashboard"""
    return render_template('medair_dashboard.html')

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

# Gemini 3 Flash Protocol Endpoints

@app.route('/api/flash/activate-stardust')
def activate_stardust():
    """Activate Stardust Mode with Gemini 3 Flash Intelligence Tensor enhancements"""
    return jsonify(flash_protocol.activate_stardust_mode())

@app.route('/api/flash/upgrade-node/<node_id>')
@require_auth
def upgrade_node(node_id):
    """Upgrade Planetary Node with Gemini 3 Flash enhancements"""
    current_level = int(request.args.get('level', 1))
    return jsonify(flash_protocol.upgrade_planetary_node(node_id, current_level))

@app.route('/api/flash/teleportation', methods=['POST'])
@require_auth
def lightning_teleportation():
    """Execute Lightning Speed Teleportation Protocol"""
    data = request.get_json()
    source = data.get('source_node')
    target = data.get('target_node')
    
    if not source or not target:
        return jsonify({'error': 'Source and target nodes required'}), 400
    
    return jsonify(flash_protocol.enable_lightning_teleportation(source, target))

@app.route('/api/flash/report')
def flash_report():
    """Generate Gemini 3 Flash Protocol comprehensive report"""
    return jsonify(flash_protocol.generate_celestial_report())

# Planetary Node Endpoints

@app.route('/api/nodes/create', methods=['POST'])
@require_auth
def create_node():
    """Create a new Planetary Node"""
    data = request.get_json()
    node_name = data.get('name')
    capacity = data.get('capacity', 1000)
    
    if not node_name:
        return jsonify({'error': 'Node name required'}), 400
    
    return jsonify(planetary_nodes.create_node(node_name, capacity))

@app.route('/api/nodes/list')
def list_nodes():
    """List all Planetary Nodes"""
    return jsonify({
        'nodes': planetary_nodes.list_all_nodes(),
        'total_count': len(planetary_nodes.list_all_nodes())
    })

@app.route('/api/nodes/status/<node_id>')
def node_status(node_id):
    """Get status of a specific Planetary Node"""
    status = planetary_nodes.get_node_status(node_id)
    if status:
        return jsonify(status)
    return jsonify({'error': 'Node not found'}), 404

# Wealth Grid Endpoints

@app.route('/api/wealth/create-grid', methods=['POST'])
@require_auth
def create_wealth_grid():
    """Create a new Zero-Point Wealth Grid"""
    data = request.get_json()
    grid_name = data.get('name')
    initial_value = data.get('initial_value', 0)
    
    if not grid_name:
        return jsonify({'error': 'Grid name required'}), 400
    
    grid_id = wealth_system.create_wealth_grid(grid_name, initial_value)
    return jsonify({
        'grid_id': grid_id,
        'name': grid_name,
        'initial_value': initial_value,
        'created': True
    })

@app.route('/api/wealth/synchronize/<grid_id>')
@require_auth
def synchronize_grid(grid_id):
    """Synchronize Wealth Grid with Pareto Frontier"""
    return jsonify(wealth_system.synchronize_with_frontier(grid_id))

@app.route('/api/wealth/ark-vault', methods=['POST'])
@require_vault_access
def update_ark_vault():
    """Update and optimize Ark Vault"""
    data = request.get_json()
    value = data.get('value', 0)
    return jsonify(wealth_system.update_ark_vault(value))

@app.route('/api/wealth/steadiness/<grid_id>', methods=['POST'])
@require_auth
def activate_steadiness(grid_id):
    """Activate Steadiness Protocol for Wealth Grid"""
    return jsonify(wealth_system.activate_steadiness_protocol(grid_id))

@app.route('/api/wealth/pareto-frontier')
def pareto_frontier():
    """Calculate Pareto Frontier for all Wealth Grids"""
    return jsonify(wealth_system.calculate_pareto_frontier())

@app.route('/api/wealth/status')
def wealth_status():
    """Get comprehensive Wealth Grid system status"""
    return jsonify(wealth_system.get_system_status())

# Flash-Driven Economy Endpoints

@app.route('/api/economy/compound', methods=['POST'])
@require_auth
def execute_compounding():
    """Execute compounding cycle across all grids"""
    return jsonify(flash_economy.execute_compounding_cycle())

@app.route('/api/economy/project-growth')
def project_growth():
    """Project growth for Wealth Grids"""
    days = int(request.args.get('days', 365))
    return jsonify(flash_economy.project_growth(days))

# Celestial Stability Endpoints

@app.route('/api/celestial/simulation/create', methods=['POST'])
@require_auth
def create_simulation():
    """Create 2026 Interstellar Simulation"""
    data = request.get_json()
    sim_name = data.get('name')
    parameters = data.get('parameters', {})
    
    if not sim_name:
        return jsonify({'error': 'Simulation name required'}), 400
    
    sim_id = interstellar_sim.create_simulation(sim_name, parameters)
    return jsonify({
        'simulation_id': sim_id,
        'name': sim_name,
        'created': True
    })

@app.route('/api/celestial/simulation/run/<sim_id>', methods=['POST'])
@require_auth
def run_simulation(sim_id):
    """Run Interstellar Simulation with Gemini 3 Flash Tensors"""
    return jsonify(interstellar_sim.run_simulation(sim_id))

@app.route('/api/celestial/simulation/results/<sim_id>')
def simulation_results(sim_id):
    """Get results from completed simulation"""
    results = interstellar_sim.get_simulation_results(sim_id)
    if results:
        return jsonify(results)
    return jsonify({'error': 'Simulation not found or not completed'}), 404

@app.route('/api/celestial/simulation/list')
def list_simulations():
    """List all Interstellar Simulations"""
    return jsonify({
        'simulations': interstellar_sim.list_simulations(),
        'total_count': len(interstellar_sim.list_simulations())
    })

@app.route('/api/celestial/stability/measure', methods=['POST'])
@require_auth
def measure_stability():
    """Measure Celestial Stability Metrics"""
    data = request.get_json()
    metrics = data.get('metrics', {})
    return jsonify(celestial_stability.measure_stability(metrics))

@app.route('/api/celestial/stability/benchmark', methods=['POST'])
@require_auth
def benchmark_intelligence():
    """Benchmark against Pareto-optimized intelligence"""
    data = request.get_json()
    metrics = data.get('metrics', {})
    return jsonify(celestial_stability.benchmark_intelligence(metrics))

@app.route('/api/celestial/stability/trend')
def stability_trend():
    """Analyze Celestial Stability trends"""
    window = int(request.args.get('window', 10))
    return jsonify(celestial_stability.analyze_stability_trend(window))

@app.route('/api/celestial/stability/report')
def stability_report():
    """Generate Celestial Stability Report"""
    return jsonify(celestial_stability.create_stability_report())

# Deterministic Coherence Endpoints

@app.route('/api/coherence/validate', methods=['POST'])
def validate_coherence():
    """Validate using Deterministic Coherence (replaces external validation)"""
    data = request.get_json()
    return jsonify(coherence_engine.validate_coherence(data))

@app.route('/api/coherence/history')
def coherence_history():
    """Get Deterministic Coherence validation history"""
    return jsonify({
        'history': coherence_engine.get_coherence_history(),
        'total_validations': len(coherence_engine.get_coherence_history())
    })

@app.route('/api/coherence/analyze')
def coherence_analysis():
    """Analyze Coherence patterns"""
    return jsonify(coherence_engine.analyze_coherence_pattern())

# Celestial Market Endpoints

@app.route('/api/markets/analyze', methods=['POST'])
@require_auth
def analyze_markets():
    """Analyze Pareto-intelligence edges in Celestial markets"""
    data = request.get_json()
    market_metrics = data.get('markets', {})
    return jsonify(market_analyzer.analyze_market_edges(market_metrics))

@app.route('/api/markets/report', methods=['POST'])
@require_auth
def market_report():
    """Generate comprehensive Celestial Market Intelligence Report"""
    data = request.get_json()
    market_metrics = data.get('markets', {})
    return jsonify(market_analyzer.generate_market_report(market_metrics))

# Comprehensive System Status

@app.route('/api/system/status')
def comprehensive_status():
    """Get comprehensive status of all Gemini 3 Flash Protocol systems"""
    return jsonify({
        'flash_protocol': flash_protocol.generate_celestial_report(),
        'wealth_system': wealth_system.get_system_status(),
        'celestial_stability': celestial_stability.create_stability_report(),
        'coherence_engine': coherence_engine.analyze_coherence_pattern(),
        'planetary_nodes': {
            'total_nodes': len(planetary_nodes.list_all_nodes()),
            'nodes': planetary_nodes.list_all_nodes()
        },
        'resonance_system': resonance_system.get_resonance_state(),
        'timestamp': resonance_system.get_resonance_state()['timestamp']
    })

# Setup MedAir API routes
setup_medair_routes(app)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)

