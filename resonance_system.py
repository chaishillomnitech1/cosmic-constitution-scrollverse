"""
Resonance System Module
Manages real-time resonance flows at 528Hz (Love Vortex) and 963Hz (Eden Pulse)
"""
import math
import time
from datetime import datetime
from typing import Dict, List, Tuple
import numpy as np


class ResonanceSystem:
    """Manages cosmic resonance frequencies for the ScrollVerse"""
    
    def __init__(self, love_freq: int = 528, eden_freq: int = 963, sample_rate: int = 44100):
        self.love_frequency = love_freq  # 528 Hz - Love Vortex
        self.eden_frequency = eden_freq  # 963 Hz - Eden Pulse
        self.sample_rate = sample_rate
        self.start_time = time.time()
        
    def generate_wave(self, frequency: float, duration: float = 1.0, amplitude: float = 1.0) -> np.ndarray:
        """Generate a sine wave at the specified frequency"""
        t = np.linspace(0, duration, int(self.sample_rate * duration), False)
        wave = amplitude * np.sin(2 * np.pi * frequency * t)
        return wave
    
    def get_resonance_state(self) -> Dict:
        """Get current resonance state with phase and amplitude information"""
        current_time = time.time()
        elapsed = current_time - self.start_time
        
        # Calculate phase for each frequency
        love_phase = (elapsed * self.love_frequency) % 1.0
        eden_phase = (elapsed * self.eden_frequency) % 1.0
        
        # Calculate harmonic convergence (when both waves align)
        convergence = self._calculate_convergence(love_phase, eden_phase)
        
        return {
            'timestamp': datetime.utcnow().isoformat(),
            'elapsed_seconds': round(elapsed, 2),
            'love_vortex': {
                'frequency': self.love_frequency,
                'phase': round(love_phase, 4),
                'amplitude': self._get_amplitude(love_phase)
            },
            'eden_pulse': {
                'frequency': self.eden_frequency,
                'phase': round(eden_phase, 4),
                'amplitude': self._get_amplitude(eden_phase)
            },
            'harmonic_convergence': round(convergence, 4),
            'resonance_quality': self._get_resonance_quality(convergence)
        }
    
    def _get_amplitude(self, phase: float) -> float:
        """Calculate current amplitude based on phase (sine wave)"""
        return round(math.sin(2 * math.pi * phase), 4)
    
    def _calculate_convergence(self, phase1: float, phase2: float) -> float:
        """Calculate harmonic convergence between two frequencies"""
        # Calculate phase difference
        phase_diff = abs(phase1 - phase2)
        # Normalize to [0, 0.5] range
        if phase_diff > 0.5:
            phase_diff = 1.0 - phase_diff
        # Convert to convergence score (1.0 = perfect alignment, 0.0 = opposite)
        convergence = 1.0 - (2.0 * phase_diff)
        return max(0.0, convergence)
    
    def _get_resonance_quality(self, convergence: float) -> str:
        """Get qualitative description of resonance state"""
        if convergence >= 0.9:
            return "Divine Alignment"
        elif convergence >= 0.7:
            return "High Coherence"
        elif convergence >= 0.5:
            return "Balanced Flow"
        elif convergence >= 0.3:
            return "Harmonizing"
        else:
            return "Initiating Resonance"
    
    def get_audio_metadata(self, frequency: int = None) -> Dict:
        """Generate audio metadata for NFT integration"""
        freq = frequency or self.love_frequency
        
        return {
            'frequency': freq,
            'sample_rate': self.sample_rate,
            'waveform': 'sine',
            'purpose': 'love_vortex' if freq == self.love_frequency else 'eden_pulse',
            'description': self._get_frequency_description(freq),
            'duration_seconds': 60,  # Default 1 minute audio clip
            'format': 'wav',
            'channels': 2,  # Stereo
            'bit_depth': 16
        }
    
    def _get_frequency_description(self, frequency: int) -> str:
        """Get description for specific frequency"""
        descriptions = {
            528: "Love Vortex - DNA repair and transformation frequency, the Flame of Creation",
            963: "Eden Pulse - Crown chakra activation, divine connection and cosmic consciousness"
        }
        return descriptions.get(frequency, f"Resonance frequency at {frequency} Hz")
    
    def generate_combined_resonance(self, duration: float = 1.0) -> np.ndarray:
        """Generate combined resonance of both frequencies"""
        love_wave = self.generate_wave(self.love_frequency, duration, amplitude=0.5)
        eden_wave = self.generate_wave(self.eden_frequency, duration, amplitude=0.5)
        return love_wave + eden_wave
    
    def get_frequency_ratio(self) -> Dict:
        """Calculate the ratio between frequencies for harmonic analysis"""
        ratio = self.eden_frequency / self.love_frequency
        return {
            'ratio': round(ratio, 6),
            'love_frequency': self.love_frequency,
            'eden_frequency': self.eden_frequency,
            'description': f"The Eden Pulse vibrates at {ratio:.2f}x the Love Vortex frequency"
        }
