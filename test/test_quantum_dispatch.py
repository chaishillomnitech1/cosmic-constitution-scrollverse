"""
Test suite for Quantum Dispatch System
Tests self-healing mechanics, telemetry, and coherence monitoring
"""

import sys
import os
import unittest
import json
from datetime import datetime

# Add ai-routing to path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', 'ai-routing'))

from quantum_dispatch import QuantumDispatchEngine


class TestQuantumDispatch(unittest.TestCase):
    """Test cases for Quantum Dispatch Engine"""
    
    def setUp(self):
        """Set up test fixtures"""
        self.engine = QuantumDispatchEngine()
        self.origin = (34.0522, -118.2437)  # Los Angeles
        self.destination = (36.7783, -119.4179)  # Fresno
        
    def test_quantum_coherence_calculation(self):
        """Test quantum coherence calculation between two points"""
        coherence = self.engine.calculate_quantum_coherence(
            self.origin,
            self.destination,
            urgency_level=9
        )
        
        self.assertIsInstance(coherence, float)
        self.assertGreaterEqual(coherence, 0.0)
        self.assertLessEqual(coherence, 1.0)
        
    def test_dispatch_route_optimization(self):
        """Test route optimization with quantum algorithms"""
        result = self.engine.optimize_dispatch_route(
            self.origin,
            self.destination,
            waypoints=[],
            urgency=9
        )
        
        self.assertIn('origin', result)
        self.assertIn('destination', result)
        self.assertIn('average_coherence', result)
        self.assertIn('meets_threshold', result)
        self.assertIn('recommendation', result)
        self.assertIn('route_segments', result)
        
    def test_self_healing_mechanism(self):
        """Test self-healing dispatch gap closure"""
        # Create a route that may need healing
        initial_route = self.engine.optimize_dispatch_route(
            self.origin,
            self.destination,
            waypoints=[],
            urgency=5
        )
        
        # If route doesn't meet threshold, test self-healing
        if not initial_route['meets_threshold']:
            healed_route = self.engine.self_heal_dispatch_gap(initial_route)
            
            self.assertIn('healed', healed_route)
            self.assertTrue(healed_route['healed'])
            self.assertIn('improvement', healed_route)
            self.assertGreater(
                healed_route['average_coherence'],
                initial_route['average_coherence']
            )
        else:
            # Route already optimal
            self.assertTrue(initial_route['meets_threshold'])
            
    def test_coherence_metrics(self):
        """Test coherence metrics tracking"""
        # Generate some dispatch data
        for urgency in [7, 8, 9, 10]:
            self.engine.optimize_dispatch_route(
                self.origin,
                self.destination,
                waypoints=[],
                urgency=urgency
            )
        
        metrics = self.engine.get_coherence_metrics()
        
        self.assertIn('current_average_coherence', metrics)
        self.assertIn('min_coherence', metrics)
        self.assertIn('max_coherence', metrics)
        self.assertIn('coherence_threshold', metrics)
        self.assertIn('above_threshold_percentage', metrics)
        self.assertIn('total_records', metrics)
        
        self.assertEqual(metrics['total_records'], 4)
        
    def test_telemetry_data(self):
        """Test comprehensive telemetry data collection"""
        # Generate dispatch data
        for i in range(10):
            self.engine.optimize_dispatch_route(
                self.origin,
                self.destination,
                waypoints=[],
                urgency=8
            )
        
        telemetry = self.engine.get_telemetry_data()
        
        self.assertIn('status', telemetry)
        self.assertEqual(telemetry['status'], 'operational')
        self.assertIn('network_health', telemetry)
        self.assertIn('telemetry', telemetry)
        self.assertIn('real_time_metrics', telemetry)
        self.assertIn('self_restoring_flows', telemetry)
        
        # Verify telemetry structure
        self.assertIn('average_coherence', telemetry['telemetry'])
        self.assertIn('coherence_stability', telemetry['telemetry'])
        self.assertIn('self_healing_active', telemetry['telemetry'])
        
    def test_neural_coherence_optimization(self):
        """Test AI-driven neural optimization"""
        # Generate historical data
        dispatch_data = []
        for urgency in [7, 8, 9, 10, 8, 9]:
            result = self.engine.optimize_dispatch_route(
                self.origin,
                self.destination,
                waypoints=[],
                urgency=urgency
            )
            dispatch_data.append(result)
        
        optimization = self.engine.neural_coherence_optimization(dispatch_data)
        
        self.assertIn('average_coherence', optimization)
        self.assertIn('coherence_std_dev', optimization)
        self.assertIn('high_urgency_success_rate', optimization)
        self.assertIn('recommendations', optimization)
        self.assertIn('total_dispatches_analyzed', optimization)
        
        self.assertEqual(optimization['total_dispatches_analyzed'], 6)
        
    def test_waypoint_optimization(self):
        """Test route optimization with waypoints"""
        waypoints = [(35.3733, -119.0187)]
        
        result = self.engine.optimize_dispatch_route(
            self.origin,
            self.destination,
            waypoints=waypoints,
            urgency=9
        )
        
        self.assertEqual(len(result['route_segments']), 2)
        self.assertEqual(len(result['waypoints']), 1)
        
    def test_high_urgency_dispatch(self):
        """Test high urgency dispatch optimization"""
        result = self.engine.optimize_dispatch_route(
            self.origin,
            self.destination,
            waypoints=[],
            urgency=10
        )
        
        self.assertEqual(result['urgency'], 10)
        self.assertIn('recommendation', result)
        
    def test_coherence_threshold_compliance(self):
        """Test coherence threshold compliance tracking"""
        # Generate multiple dispatches
        for _ in range(20):
            self.engine.optimize_dispatch_route(
                self.origin,
                self.destination,
                waypoints=[],
                urgency=9
            )
        
        metrics = self.engine.get_coherence_metrics()
        telemetry = self.engine.get_telemetry_data()
        
        self.assertIn('above_threshold_percentage', metrics)
        self.assertIn('threshold_compliance_rate', telemetry['telemetry'])
        
    def test_self_restoring_network_flows(self):
        """Test self-restoring network flow mechanisms"""
        # Create dispatches with varying coherence
        for urgency in [5, 6, 7, 8, 9, 10]:
            self.engine.optimize_dispatch_route(
                self.origin,
                self.destination,
                waypoints=[],
                urgency=urgency
            )
        
        telemetry = self.engine.get_telemetry_data()
        
        self.assertIn('self_restoring_flows', telemetry)
        self.assertTrue(telemetry['self_restoring_flows']['enabled'])
        self.assertIn('network_resilience', telemetry['self_restoring_flows'])
        self.assertIn('restoration_count', telemetry['self_restoring_flows'])
        
    def test_real_time_metrics(self):
        """Test real-time metrics generation"""
        self.engine.optimize_dispatch_route(
            self.origin,
            self.destination,
            waypoints=[],
            urgency=9
        )
        
        telemetry = self.engine.get_telemetry_data()
        
        self.assertIn('real_time_metrics', telemetry)
        self.assertIn('last_coherence', telemetry['real_time_metrics'])
        self.assertIn('last_urgency', telemetry['real_time_metrics'])
        self.assertIn('timestamp', telemetry['real_time_metrics'])
        self.assertEqual(telemetry['real_time_metrics']['uptime_status'], 'online')
        self.assertTrue(telemetry['real_time_metrics']['auto_update_enabled'])
        
    def test_network_health_calculation(self):
        """Test network health score calculation"""
        # Generate stable dispatch pattern
        for _ in range(15):
            self.engine.optimize_dispatch_route(
                self.origin,
                self.destination,
                waypoints=[],
                urgency=8
            )
        
        telemetry = self.engine.get_telemetry_data()
        
        self.assertIn('network_health', telemetry)
        self.assertGreaterEqual(telemetry['network_health'], 0)
        self.assertLessEqual(telemetry['network_health'], 100)


class TestMedAirAPI(unittest.TestCase):
    """Test cases for MedAir API integration"""
    
    def setUp(self):
        """Set up API test fixtures"""
        sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))
        from medair_api import MedAirAPI
        self.api = MedAirAPI()
        
    def test_staking_status(self):
        """Test staking status endpoint"""
        status = self.api.get_staking_status()
        
        self.assertEqual(status['status'], 'operational')
        self.assertIn('total_staked_medair', status)
        self.assertIn('tiers', status)
        self.assertIn('coherence_bonus', status)
        
    def test_dao_status(self):
        """Test DAO governance status"""
        status = self.api.get_dao_status()
        
        self.assertEqual(status['status'], 'operational')
        self.assertIn('quorum_percentage', status)
        self.assertTrue(status['auto_consensus_enabled'])
        
    def test_quantum_dispatch_status(self):
        """Test quantum dispatch status"""
        status = self.api.get_quantum_dispatch_status()
        
        if status['status'] == 'operational':
            self.assertIn('quantum_coherence', status)
            self.assertIn('telemetry', status)
            self.assertTrue(status['self_healing_enabled'])
            
    def test_liquidity_pool_dashboard(self):
        """Test liquidity pool dashboard data"""
        dashboard = self.api.get_liquidity_pool_dashboard()
        
        self.assertEqual(dashboard['status'], 'operational')
        self.assertIn('pools', dashboard)
        self.assertIn('flight_operations', dashboard['pools'])
        self.assertIn('emergency_reserve', dashboard['pools'])
        self.assertIn('insurance_pool', dashboard['pools'])
        self.assertIn('oracle_integration', dashboard)
        self.assertIn('real_time_metrics', dashboard)
        
    def test_comprehensive_status(self):
        """Test comprehensive ecosystem status"""
        status = self.api.get_comprehensive_status()
        
        self.assertEqual(status['ecosystem_status'], 'fully_operational')
        self.assertIn('components', status)
        self.assertIn('staking', status['components'])
        self.assertIn('dao_governance', status['components'])
        self.assertIn('quantum_dispatch', status['components'])
        self.assertIn('features', status)
        
        # Verify all features are enabled
        features = status['features']
        self.assertTrue(features['adaptive_staking'])
        self.assertTrue(features['tier_based_rewards'])
        self.assertTrue(features['oracle_integration'])
        self.assertTrue(features['auto_consensus'])
        self.assertTrue(features['quantum_ai_routing'])
        self.assertTrue(features['self_healing'])


if __name__ == '__main__':
    unittest.main(verbosity=2)
