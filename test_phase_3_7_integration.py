#!/usr/bin/env python3
"""
Phase 3-7 Manus Integration Test

Tests all Phase 3-7 components working together:
- Analytics Dashboard
- Autonomous Protocols  
- Governance Pipelines
"""

import sys
import json
from datetime import datetime


def test_analytics_dashboard():
    """Test analytics dashboard components"""
    print("\n" + "="*60)
    print("Testing Analytics Dashboard")
    print("="*60)
    
    try:
        # Import and test metrics collector
        sys.path.insert(0, 'analytics-dashboard')
        from metrics_collector import MetricsCollector
        
        collector = MetricsCollector()
        
        # Collect all metrics
        metrics = collector.collect_all_metrics()
        
        assert 'quantumAI' in metrics, "Quantum AI metrics missing"
        assert 'zkEVM' in metrics, "zkEVM metrics missing"
        assert 'staking' in metrics, "Staking metrics missing"
        assert 'compatibility' in metrics, "Compatibility metrics missing"
        
        print("✓ Metrics collector working")
        print(f"✓ Collected {len(metrics)} data sources")
        
        # Test alerts
        alerts = collector.check_alerts(metrics)
        print(f"✓ Alert system operational ({len(alerts)} alerts)")
        
        return True
        
    except Exception as e:
        print(f"✗ Analytics dashboard test failed: {e}")
        return False


def test_autonomous_protocols():
    """Test autonomous protocols"""
    print("\n" + "="*60)
    print("Testing Autonomous Protocols")
    print("="*60)
    
    try:
        # Import and test protocol manager
        sys.path.insert(0, 'autonomous-protocols')
        from protocol_manager import AutonomousProtocolManager
        from quantum_security import QuantumSecurity
        from self_healing import SelfHealingAI
        
        # Test protocol manager
        manager = AutonomousProtocolManager()
        status = manager.monitor_all_protocols()
        
        assert 'protocols' in status, "Protocol status missing"
        assert status['overallHealth'] > 0, "No protocol health"
        
        print(f"✓ Protocol manager working")
        print(f"✓ Overall health: {status['overallHealth']:.2%}")
        print(f"✓ Active protocols: {len(status['protocols'])}")
        
        # Test quantum security
        qs = QuantumSecurity()
        test_data = b"Phase 3-7 Test Data"
        signature = qs.sign_data(test_data)
        is_valid = qs.verify_signature(test_data, signature)
        
        assert is_valid, "Signature verification failed"
        print("✓ Quantum security (PQC FALCON-SPHINCS+) working")
        
        # Test self-healing AI
        ai = SelfHealingAI()
        test_metrics = {
            'cpu_usage': 0.75,
            'memory_usage': 0.60,
            'response_time': 1.2,
            'error_rate': 0.02
        }
        
        anomaly = ai.detect_anomaly(test_metrics)
        print(f"✓ Self-healing AI operational")
        
        return True
        
    except Exception as e:
        print(f"✗ Autonomous protocols test failed: {e}")
        import traceback
        traceback.print_exc()
        return False


def test_governance_pipelines():
    """Test governance pipelines"""
    print("\n" + "="*60)
    print("Testing Governance Pipelines")
    print("="*60)
    
    try:
        # Import and test governance components
        sys.path.insert(0, 'governance-pipelines')
        from zkevm_integration import LayerZGovernance
        from dao_synchronizer import DAONodeSynchronizer
        
        # Test zkEVM integration
        governance = LayerZGovernance()
        
        # Create test proposal
        proposal_id = governance.create_proposal(
            proposal_type="parameter-change",
            title="Integration Test Proposal",
            description="Test proposal for Phase 3-7 integration",
            proposer="0xtest",
            parameters={'test': True}
        )
        
        assert proposal_id in governance.proposals, "Proposal creation failed"
        print("✓ zkEVM governance working")
        print(f"✓ Created test proposal: {proposal_id}")
        
        # Test DAO synchronizer
        synchronizer = DAONodeSynchronizer()
        sync_status = synchronizer.synchronize_nodes()
        
        assert 'nodes_synced' in sync_status, "Node sync failed"
        assert sync_status['consensus_reached'], "Consensus not reached"
        
        print("✓ DAO synchronization working")
        print(f"✓ Nodes synced: {sync_status['nodes_synced']}")
        print(f"✓ Consensus reached: {sync_status['consensus_reached']}")
        
        return True
        
    except Exception as e:
        print(f"✗ Governance pipelines test failed: {e}")
        import traceback
        traceback.print_exc()
        return False


def test_integration():
    """Test complete system integration"""
    print("\n" + "="*60)
    print("Testing System Integration")
    print("="*60)
    
    try:
        # Import from already loaded modules
        sys.path.insert(0, 'analytics-dashboard')
        sys.path.insert(0, 'autonomous-protocols')
        sys.path.insert(0, 'governance-pipelines')
        
        from metrics_collector import MetricsCollector
        from protocol_manager import AutonomousProtocolManager
        from zkevm_integration import LayerZGovernance
        
        collector = MetricsCollector()
        manager = AutonomousProtocolManager()
        governance = LayerZGovernance()
        
        # Collect integrated analytics
        analytics_data = collector.collect_all_metrics()
        protocol_data = manager.get_analytics_data()
        governance_data = governance.get_analytics_data()
        
        integrated_report = {
            'timestamp': datetime.utcnow().isoformat(),
            'analytics': analytics_data,
            'autonomous_protocols': protocol_data,
            'governance': governance_data
        }
        
        print("✓ All systems integrated successfully")
        print(f"✓ Data sources: {len(integrated_report)}")
        
        # Verify key metrics
        assert protocol_data['autonomousProtocolHealth'] > 0.8, "Protocol health too low"
        assert protocol_data['quantumCoherence'] > 0.9, "Quantum coherence too low"
        
        print(f"✓ Protocol health: {protocol_data['autonomousProtocolHealth']:.2%}")
        print(f"✓ Quantum coherence: {protocol_data['quantumCoherence']:.2%}")
        
        return True
        
    except Exception as e:
        print(f"✗ Integration test failed: {e}")
        import traceback
        traceback.print_exc()
        return False


def main():
    """Run all tests"""
    print("\n" + "="*60)
    print("Phase 3-7 Manus Integration Test Suite")
    print("="*60)
    print(f"Started at: {datetime.utcnow().isoformat()}")
    
    results = {
        'analytics_dashboard': test_analytics_dashboard(),
        'autonomous_protocols': test_autonomous_protocols(),
        'governance_pipelines': test_governance_pipelines(),
        'integration': test_integration()
    }
    
    print("\n" + "="*60)
    print("Test Results Summary")
    print("="*60)
    
    passed = sum(results.values())
    total = len(results)
    
    for test_name, result in results.items():
        status = "✓ PASS" if result else "✗ FAIL"
        print(f"{status}: {test_name}")
    
    print(f"\nTotal: {passed}/{total} tests passed")
    
    if passed == total:
        print("\n✅ All Phase 3-7 systems operational!")
        print("Deployment verified successfully.")
        return 0
    else:
        print("\n⚠️  Some tests failed. Review output above.")
        return 1


if __name__ == "__main__":
    sys.exit(main())
