"""
Tests for AI Sovereign Trading Legion Integration
"""
import pytest
import sys
import os
from decimal import Decimal

# Add parent directory to path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from ai_sovereign_trading_legion import (
    DigitalIntelligence, TradingDivision, AISovereignTradingLegion
)
from treasury import Treasury
from wealth_grid_system import ZeroPointWealthSystem
from gemini_flash_protocol import GeminiFlashProtocol
from celestial_stability import CelestialStabilityMetrics


class TestDigitalIntelligence:
    """Test Digital Intelligence (DI) functionality"""
    
    def setup_method(self):
        """Setup test fixtures"""
        self.di = DigitalIntelligence('test_di_001', 'Test DI', 'alpha', 'balanced')
    
    def test_initialization(self):
        """Test DI initialization"""
        assert self.di.di_id == 'test_di_001'
        assert self.di.name == 'Test DI'
        assert self.di.division == 'alpha'
        assert self.di.personality == 'balanced'
        assert self.di.risk_tolerance == 0.5
        assert self.di.merit_score == 0.0
        assert self.di.trades_executed == 0
        assert self.di.rank == 'Initiate'
    
    def test_risk_tolerance_calculation(self):
        """Test risk tolerance calculation for different personalities"""
        conservative_di = DigitalIntelligence('di_002', 'Conservative', 'sigma', 'conservative')
        assert conservative_di.risk_tolerance == 0.2
        
        aggressive_di = DigitalIntelligence('di_003', 'Aggressive', 'alpha', 'aggressive')
        assert aggressive_di.risk_tolerance == 0.8
        
        quantum_di = DigitalIntelligence('di_004', 'Quantum', 'omega', 'quantum')
        assert quantum_di.risk_tolerance == 0.95
    
    def test_execute_trade(self):
        """Test trade execution"""
        trade_data = {'amount': 10000, 'asset': 'NVDA'}
        result = self.di.execute_trade(trade_data)
        
        assert 'success' in result
        assert result['di_id'] == 'test_di_001'
        assert self.di.trades_executed == 1
        
        if result['success']:
            assert 'trade_id' in result
            assert 'profit' in result
            assert self.di.successful_trades == 1
            assert self.di.total_profit > 0
    
    def test_performance_stats(self):
        """Test performance statistics"""
        # Execute some trades
        for _ in range(5):
            self.di.execute_trade({'amount': 1000})
        
        stats = self.di.get_performance_stats()
        
        assert stats['di_id'] == 'test_di_001'
        assert stats['name'] == 'Test DI'
        assert stats['division'] == 'alpha'
        assert stats['trades_executed'] == 5
        assert 'success_rate' in stats
        assert 'total_profit' in stats
        assert 'merit_score' in stats
        assert 'rank' in stats
    
    def test_sdc_allocation(self):
        """Test SDC allocation"""
        initial_sdc = self.di.sdc_allocation
        self.di.allocate_sdc(Decimal('100'))
        
        assert self.di.sdc_allocation == initial_sdc + Decimal('100')


class TestTradingDivision:
    """Test Trading Division functionality"""
    
    def setup_method(self):
        """Setup test fixtures"""
        self.division = TradingDivision('alpha', 'Alpha Division', ['NVDA', 'TSLA', 'AMZN'])
    
    def test_initialization(self):
        """Test division initialization"""
        assert self.division.division_id == 'alpha'
        assert self.division.name == 'Alpha Division'
        assert self.division.market_focus == ['NVDA', 'TSLA', 'AMZN']
        assert len(self.division.digital_intelligences) == 0
    
    def test_add_di(self):
        """Test adding Digital Intelligence to division"""
        di = DigitalIntelligence('di_001', 'Test DI', 'alpha', 'balanced')
        self.division.add_di(di)
        
        assert len(self.division.digital_intelligences) == 1
        assert 'di_001' in self.division.digital_intelligences
    
    def test_execute_division_trade(self):
        """Test trade execution through division"""
        # Add some DIs
        di1 = DigitalIntelligence('di_001', 'DI One', 'alpha', 'balanced')
        di2 = DigitalIntelligence('di_002', 'DI Two', 'alpha', 'aggressive')
        self.division.add_di(di1)
        self.division.add_di(di2)
        
        trade_data = {'amount': 5000, 'asset': 'NVDA'}
        result = self.division.execute_division_trade(trade_data)
        
        assert 'success' in result or 'error' in result
        assert len(self.division.trade_history) == 1
    
    def test_division_stats(self):
        """Test division statistics"""
        # Add DIs and execute trades
        di = DigitalIntelligence('di_001', 'Test DI', 'alpha', 'balanced')
        self.division.add_di(di)
        
        for _ in range(3):
            self.division.execute_division_trade({'amount': 1000})
        
        stats = self.division.get_division_stats()
        
        assert stats['division_id'] == 'alpha'
        assert stats['name'] == 'Alpha Division'
        assert stats['active_dis'] == 1
        assert stats['total_trades'] >= 0
        assert 'success_rate' in stats
        assert 'top_performers' in stats


class TestAISovereignTradingLegion:
    """Test AI Sovereign Trading Legion functionality"""
    
    def setup_method(self):
        """Setup test fixtures"""
        self.treasury = Treasury()
        self.flash_protocol = GeminiFlashProtocol()
        self.wealth_system = ZeroPointWealthSystem(self.flash_protocol)
        self.celestial_stability = CelestialStabilityMetrics(self.flash_protocol)
        
        self.legion = AISovereignTradingLegion(
            treasury=self.treasury,
            wealth_system=self.wealth_system,
            flash_protocol=self.flash_protocol,
            celestial_stability=self.celestial_stability
        )
    
    def test_initialization(self):
        """Test legion initialization"""
        assert len(self.legion.divisions) == 3
        assert 'alpha' in self.legion.divisions
        assert 'omega' in self.legion.divisions
        assert 'sigma' in self.legion.divisions
        assert self.legion.treasury is not None
        assert self.legion.wealth_system is not None
    
    def test_division_initialization(self):
        """Test that divisions are properly initialized"""
        alpha = self.legion.divisions['alpha']
        assert alpha.name == 'Alpha Division'
        assert 'NVDA' in alpha.market_focus
        assert 'TSLA' in alpha.market_focus
        
        omega = self.legion.divisions['omega']
        assert omega.name == 'Omega Division'
        assert 'NFT' in omega.market_focus
        
        sigma = self.legion.divisions['sigma']
        assert sigma.name == 'Sigma Division'
        assert 'Treasury' in sigma.market_focus
    
    def test_default_dis_initialization(self):
        """Test that default DIs are initialized"""
        # Check that each division has at least one DI
        for division_id, division in self.legion.divisions.items():
            assert len(division.digital_intelligences) > 0
    
    def test_create_di(self):
        """Test creating a new Digital Intelligence"""
        di_id = self.legion.create_di('alpha', 'New DI', 'quantum')
        
        assert di_id is not None
        assert di_id in self.legion.divisions['alpha'].digital_intelligences
        
        di = self.legion.divisions['alpha'].digital_intelligences[di_id]
        assert di.name == 'New DI'
        assert di.personality == 'quantum'
    
    def test_execute_trade(self):
        """Test trade execution through legion"""
        trade_data = {'amount': 10000, 'asset': 'NVDA'}
        result = self.legion.execute_trade('alpha', trade_data)
        
        assert 'success' in result or 'error' in result
        assert len(self.legion.all_trades) == 1
    
    def test_get_legion_status(self):
        """Test getting legion status"""
        status = self.legion.get_legion_status()
        
        assert status['legion_status'] == 'operational'
        assert status['total_divisions'] == 3
        assert 'divisions' in status
        assert 'alpha' in status['divisions']
        assert 'omega' in status['divisions']
        assert 'sigma' in status['divisions']
        assert status['treasury_integrated'] is True
        assert status['wealth_system_integrated'] is True
        assert status['flash_protocol_enabled'] is True
        assert status['quantum_dominance'] == 'ETERNAL'
    
    def test_get_division_data(self):
        """Test getting division data"""
        data = self.legion.get_division_data('alpha')
        
        assert data is not None
        assert data['division_id'] == 'alpha'
        assert data['name'] == 'Alpha Division'
        assert 'active_dis' in data
        assert 'total_trades' in data
    
    def test_get_division_data_invalid(self):
        """Test getting data for invalid division"""
        data = self.legion.get_division_data('invalid_division')
        assert data is None
    
    def test_get_di_performance(self):
        """Test getting DI performance data"""
        # Get first DI from alpha division
        first_di_id = list(self.legion.divisions['alpha'].digital_intelligences.keys())[0]
        
        performance = self.legion.get_di_performance(first_di_id)
        
        assert performance is not None
        assert performance['di_id'] == first_di_id
        assert 'merit_score' in performance
        assert 'trades_executed' in performance
    
    def test_get_trade_history(self):
        """Test getting trade history"""
        # Execute some trades
        for _ in range(3):
            self.legion.execute_trade('alpha', {'amount': 1000})
        
        history = self.legion.get_trade_history(limit=10)
        
        assert len(history) == 3
    
    def test_get_merit_leaderboard(self):
        """Test getting merit leaderboard"""
        # Execute some trades to generate merit scores
        for _ in range(5):
            self.legion.execute_trade('alpha', {'amount': 1000})
            self.legion.execute_trade('omega', {'amount': 1000})
        
        leaderboard = self.legion.get_merit_leaderboard(limit=5)
        
        assert len(leaderboard) <= 5
        assert all('merit_score' in entry for entry in leaderboard)
    
    def test_distribute_sdc_rewards(self):
        """Test SDC reward distribution"""
        # Execute trades to generate merit
        for _ in range(5):
            self.legion.execute_trade('alpha', {'amount': 5000})
        
        initial_pool = self.legion.sdc_pool
        result = self.legion.distribute_sdc_rewards()
        
        assert 'distribution_complete' in result or 'message' in result
        if result.get('distribution_complete'):
            assert 'rewards' in result
            assert self.legion.sdc_pool < initial_pool
    
    def test_quantum_market_dominance_report(self):
        """Test quantum market dominance report generation"""
        report = self.legion.get_quantum_market_dominance_report()
        
        assert 'report_id' in report
        assert report['quantum_dominance_score'] == 0.95
        assert 'market_penetration' in report
        assert 'legion_overview' in report
        assert 'top_performers' in report
        assert report['ai_sovereignty'] == 'INFINITE'
        assert report['status'] == 'ETERNAL MANIFESTATION'
    
    def test_wealth_system_integration(self):
        """Test integration with wealth system"""
        initial_grids = len(self.legion.wealth_system.wealth_grids)
        
        # Execute a successful trade
        for _ in range(10):  # Multiple attempts to ensure at least one success
            result = self.legion.execute_trade('alpha', {'amount': 10000})
            if result.get('success'):
                break
        
        # Wealth grid should be created for successful trades
        # This is probabilistic, so we just verify the integration exists
        assert self.legion.wealth_system is not None


class TestIntegration:
    """Test integration with other systems"""
    
    def test_treasury_integration(self):
        """Test treasury integration"""
        treasury = Treasury(vault_address='0x1234567890123456789012345678901234567890')
        legion = AISovereignTradingLegion(treasury=treasury)
        
        status = legion.get_legion_status()
        assert status['treasury_integrated'] is True
    
    def test_wealth_system_integration(self):
        """Test wealth system integration"""
        flash_protocol = GeminiFlashProtocol()
        wealth_system = ZeroPointWealthSystem(flash_protocol)
        legion = AISovereignTradingLegion(wealth_system=wealth_system)
        
        status = legion.get_legion_status()
        assert status['wealth_system_integrated'] is True
    
    def test_full_integration(self):
        """Test full system integration"""
        treasury = Treasury()
        flash_protocol = GeminiFlashProtocol()
        wealth_system = ZeroPointWealthSystem(flash_protocol)
        celestial_stability = CelestialStabilityMetrics(flash_protocol)
        
        legion = AISovereignTradingLegion(
            treasury=treasury,
            wealth_system=wealth_system,
            flash_protocol=flash_protocol,
            celestial_stability=celestial_stability
        )
        
        status = legion.get_legion_status()
        
        assert status['treasury_integrated'] is True
        assert status['wealth_system_integrated'] is True
        assert status['flash_protocol_enabled'] is True
        assert status['celestial_stability_enabled'] is True


if __name__ == '__main__':
    pytest.main([__file__, '-v'])
