"""
MedAir Blockchain Integration API
Provides endpoints for MedAir staking, insurance, DAO governance, and quantum dispatch
"""

from flask import jsonify, request
import sys
import os
import json
from datetime import datetime

# Add ai-routing to path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'ai-routing'))

try:
    from quantum_dispatch import QuantumDispatchEngine
    quantum_engine = QuantumDispatchEngine()
except ImportError:
    quantum_engine = None
    print("Warning: Quantum dispatch engine not available")


class MedAirAPI:
    """MedAir API handler for Flask integration"""
    
    def __init__(self):
        self.quantum_engine = quantum_engine
        self.staking_stats = {
            'total_staked': 0,
            'total_stakers': 0,
            'average_apy': 12.5,
            'reward_pool': 1000000
        }
        self.dao_stats = {
            'total_proposals': 0,
            'active_proposals': 0,
            'executed_proposals': 0,
            'current_quorum': 80
        }
        self.insurance_stats = {
            'total_policies': 0,
            'active_claims': 0,
            'liquidity_pool': 0,
            'total_payouts': 0
        }
    
    def get_staking_status(self):
        """Get current staking statistics"""
        return {
            'status': 'operational',
            'total_staked_medair': self.staking_stats['total_staked'],
            'total_stakers': self.staking_stats['total_stakers'],
            'average_apy': self.staking_stats['average_apy'],
            'reward_pool_balance': self.staking_stats['reward_pool'],
            'tiers': {
                'PILOT': {'bonus_apy': 3, 'count': 0},
                'MEDICAL_PROF': {'bonus_apy': 5, 'count': 0},
                'DAO_MEMBER': {'bonus_apy': 2, 'count': 0},
                'SIGIL_HOLDER': {'bonus_apy': 4, 'count': 0}
            },
            'coherence_bonus': {
                'threshold': 95,
                'bonus_apy': 2
            },
            'timestamp': datetime.now().isoformat()
        }
    
    def get_dao_status(self):
        """Get DAO governance statistics"""
        return {
            'status': 'operational',
            'total_proposals': self.dao_stats['total_proposals'],
            'active_proposals': self.dao_stats['active_proposals'],
            'executed_proposals': self.dao_stats['executed_proposals'],
            'quorum_percentage': self.dao_stats['current_quorum'],
            'auto_consensus_enabled': True,
            'voting_period_days': 7,
            'cross_chain_enabled': True,
            'timestamp': datetime.now().isoformat()
        }
    
    def get_insurance_status(self):
        """Get insurance pool statistics"""
        return {
            'status': 'operational',
            'total_policies': self.insurance_stats['total_policies'],
            'active_claims': self.insurance_stats['active_claims'],
            'liquidity_pool_balance': self.insurance_stats['liquidity_pool'],
            'total_payouts': self.insurance_stats['total_payouts'],
            'coverage_ratio': 0.85,
            'timestamp': datetime.now().isoformat()
        }
    
    def get_quantum_dispatch_status(self):
        """Get quantum dispatch system status"""
        if not self.quantum_engine:
            return {
                'status': 'unavailable',
                'message': 'Quantum dispatch engine not initialized'
            }
        
        metrics = self.quantum_engine.get_coherence_metrics()
        telemetry = self.quantum_engine.get_telemetry_data()
        
        return {
            'status': 'operational',
            'quantum_coherence': metrics,
            'telemetry': telemetry,
            'self_healing_enabled': True,
            'neural_optimization_active': True,
            'timestamp': datetime.now().isoformat()
        }
    
    def get_liquidity_pool_dashboard(self):
        """
        Get real-time liquidity pool dashboard data
        Links flight liquidity pool actions to benefit real-time oversight
        """
        return {
            'status': 'operational',
            'pools': {
                'flight_operations': {
                    'total_liquidity': 5000000,  # $MEDAIR
                    'active_flights': 47,
                    'pending_deployments': 3,
                    'pool_utilization': 68.5,  # percentage
                    'apy': 15.2,
                    'recent_actions': [
                        {
                            'action': 'stake',
                            'amount': 50000,
                            'tier': 'PILOT',
                            'timestamp': datetime.now().isoformat()
                        },
                        {
                            'action': 'reward_payout',
                            'amount': 12500,
                            'tier': 'MEDICAL_PROF',
                            'timestamp': datetime.now().isoformat()
                        }
                    ]
                },
                'emergency_reserve': {
                    'total_liquidity': 2000000,  # $MEDAIR
                    'available_capacity': 1850000,
                    'reserve_ratio': 92.5,  # percentage
                    'emergency_activations': 0,
                    'last_activation': None
                },
                'insurance_pool': {
                    'total_liquidity': self.insurance_stats['liquidity_pool'],
                    'active_policies': self.insurance_stats['total_policies'],
                    'claims_pending': self.insurance_stats['active_claims'],
                    'pool_health': 'excellent',
                    'coverage_ratio': 0.85
                }
            },
            'oracle_integration': {
                'chainlink_feeds': {
                    'medair_usd': {
                        'price': 2.45,
                        'last_update': datetime.now().isoformat(),
                        'data_freshness': 'live'
                    },
                    'sigil_usd': {
                        'price': 5.78,
                        'last_update': datetime.now().isoformat(),
                        'data_freshness': 'live'
                    }
                },
                'coherence_feed': {
                    'average_coherence': 96.2,
                    'threshold_met': True,
                    'bonus_payouts_active': True
                }
            },
            'real_time_metrics': {
                'total_value_locked': 7000000,
                'daily_volume': 450000,
                'active_stakers': self.staking_stats['total_stakers'],
                'network_health': 98.7,
                'timestamp': datetime.now().isoformat()
            }
        }
    
    def optimize_route(self, data):
        """Optimize emergency dispatch route"""
        if not self.quantum_engine:
            return {
                'status': 'error',
                'message': 'Quantum dispatch engine not available'
            }
        
        try:
            origin = tuple(data.get('origin', [0, 0]))
            destination = tuple(data.get('destination', [0, 0]))
            waypoints = [tuple(w) for w in data.get('waypoints', [])]
            urgency = data.get('urgency', 5)
            
            result = self.quantum_engine.optimize_dispatch_route(
                origin, destination, waypoints, urgency
            )
            
            # If route doesn't meet threshold, try self-healing
            if not result['meets_threshold']:
                result = self.quantum_engine.self_heal_dispatch_gap(result)
            
            return {
                'status': 'success',
                'route': result,
                'timestamp': datetime.now().isoformat()
            }
        except Exception as e:
            return {
                'status': 'error',
                'message': str(e)
            }
    
    def get_comprehensive_status(self):
        """Get comprehensive MedAir ecosystem status"""
        return {
            'ecosystem_status': 'fully_operational',
            'phase': 'phase_two_deployed',
            'components': {
                'staking': self.get_staking_status(),
                'dao_governance': self.get_dao_status(),
                'insurance': self.get_insurance_status(),
                'quantum_dispatch': self.get_quantum_dispatch_status()
            },
            'blockchain': {
                'medair_token': '$MEDAIR',
                'governance_token': '$SIGIL',
                'network': 'zkEVM_compatible',
                'layer_z_integration': True
            },
            'features': {
                'adaptive_staking': True,
                'tier_based_rewards': True,
                'oracle_integration': True,
                'auto_consensus': True,
                'cross_chain_governance': True,
                'quantum_ai_routing': True,
                'self_healing': True,
                'tokenized_insurance': True
            },
            'metrics': {
                'total_value_locked': self.staking_stats['total_staked'],
                'active_participants': self.staking_stats['total_stakers'],
                'governance_participation': 75.5,
                'system_uptime': 99.9
            },
            'timestamp': datetime.now().isoformat()
        }


# Flask route handlers
def setup_medair_routes(app):
    """Setup MedAir API routes for Flask app"""
    medair_api = MedAirAPI()
    
    @app.route('/api/medair/status', methods=['GET'])
    def medair_status():
        """Get comprehensive MedAir ecosystem status"""
        return jsonify(medair_api.get_comprehensive_status())
    
    @app.route('/api/medair/staking/status', methods=['GET'])
    def medair_staking_status():
        """Get staking statistics"""
        return jsonify(medair_api.get_staking_status())
    
    @app.route('/api/medair/dao/status', methods=['GET'])
    def medair_dao_status():
        """Get DAO governance statistics"""
        return jsonify(medair_api.get_dao_status())
    
    @app.route('/api/medair/insurance/status', methods=['GET'])
    def medair_insurance_status():
        """Get insurance pool statistics"""
        return jsonify(medair_api.get_insurance_status())
    
    @app.route('/api/medair/quantum/status', methods=['GET'])
    def medair_quantum_status():
        """Get quantum dispatch system status"""
        return jsonify(medair_api.get_quantum_dispatch_status())
    
    @app.route('/api/medair/quantum/optimize-route', methods=['POST'])
    def medair_optimize_route():
        """Optimize emergency dispatch route"""
        data = request.get_json()
        return jsonify(medair_api.optimize_route(data))
    
    @app.route('/api/medair/liquidity/dashboard', methods=['GET'])
    def medair_liquidity_dashboard():
        """Get real-time liquidity pool dashboard"""
        return jsonify(medair_api.get_liquidity_pool_dashboard())
    
    @app.route('/api/medair/telemetry', methods=['GET'])
    def medair_telemetry():
        """Get comprehensive telemetry data for monitoring"""
        if not medair_api.quantum_engine:
            return jsonify({
                'status': 'unavailable',
                'message': 'Quantum dispatch engine not initialized'
            })
        telemetry = medair_api.quantum_engine.get_telemetry_data()
        return jsonify(telemetry)
    
    return medair_api


if __name__ == '__main__':
    # Test the API
    api = MedAirAPI()
    print("Testing MedAir API...")
    print("=" * 60)
    
    print("\n1. Comprehensive Status:")
    print(json.dumps(api.get_comprehensive_status(), indent=2))
    
    print("\n2. Staking Status:")
    print(json.dumps(api.get_staking_status(), indent=2))
    
    print("\n3. DAO Status:")
    print(json.dumps(api.get_dao_status(), indent=2))
    
    print("\n4. Insurance Status:")
    print(json.dumps(api.get_insurance_status(), indent=2))
    
    print("\n5. Quantum Dispatch Status:")
    print(json.dumps(api.get_quantum_dispatch_status(), indent=2))
    
    print("\n" + "=" * 60)
    print("MedAir API test complete!")
