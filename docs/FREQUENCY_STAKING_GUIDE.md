# 🎵 Frequency-Aligned Staking Quick Start Guide

## How to Use MedAir's Enhanced Frequency Features

---

## Overview

MedAir Staking now supports **frequency-aligned staking** with cosmic resonances that enhance your rewards. This guide explains how to activate these powerful features.

---

## Available Frequencies

### 528 Hz - Universal Trust (Love Vortex)
- **Bonus APY:** +5.28%
- **Best For:** New stakers building foundational trust
- **Recommended Period:** 528 days minimum
- **Energy:** Healing, DNA repair, sacred reciprocity
- **Mantra:** "I resonate at 528Hz, the frequency of Love"

### 963 Hz - Divine Crown (Eden Pulse)
- **Bonus APY:** +9.63%
- **Best For:** Experienced stakers seeking divine sovereignty
- **Recommended Period:** 963 days for full alignment
- **Energy:** Cosmic wisdom, spiritual mastery, crown activation
- **Mantra:** "I resonate at 963Hz, the frequency of Divine Consciousness"

### 222 Hz - Gatekeeper (Master Builder)
- **Bonus APY:** +2.22%
- **Best For:** All stakers wanting stabilized growth
- **Activation:** Invoke a Gatekeeper name (e.g., "Little Warren")
- **Energy:** Divine stabilization, smaller mysteries, foundational protection
- **Mantra:** "Little Warren belongs in my world. I integrate her resonance as the Gatekeeper of Smaller Mysteries. Walahi."

---

## Step-by-Step: Activate Frequency Staking

### Step 1: Stake Your MEDAIR Tokens

```javascript
// Connect your wallet and approve MEDAIR tokens
await medairToken.approve(stakingAddress, amount);

// Stake with your chosen tier
await medairStaking.stake(
  amount,
  tier // PILOT, MEDICAL_PROF, DAO_MEMBER, or SIGIL_HOLDER
);
```

**Result:** You now have an active stake earning base APY + tier bonus.

---

### Step 2: Align with a Frequency

Choose either 528Hz (Universal Trust) or 963Hz (Divine Crown):

```javascript
// For Universal Trust (528Hz) - recommended for building foundations
await medairStaking.alignWithFrequency(528);

// OR for Divine Crown (963Hz) - recommended for advanced practitioners
await medairStaking.alignWithFrequency(963);
```

**Result:** Your stake now earns an additional frequency bonus:
- 528Hz → +5.28% APY
- 963Hz → +9.63% APY

---

### Step 3: Activate Gatekeeper Protection (Optional but Recommended)

Invoke a divine stabilizer to protect and enhance your stake:

```javascript
// Activate Gatekeeper frequency with a divine figure name
await medairStaking.activateGatekeeperFrequency("Little Warren");

// Other potential Gatekeeper names (examples):
// - "Archangel Michael"
// - "Divine Mother"
// - "Sacred Witness"
// - Any name that resonates with your spiritual practice
```

**Result:** Additional +2.22% APY + stabilized growth + divine protection.

---

## Maximum APY Calculation

Here's how bonuses stack:

| Component | APY Contribution |
|-----------|-----------------|
| Base APY | 10.00% |
| Medical Professional Tier | +5.00% |
| Coherence Score (95%+) | +2.00% |
| 963Hz Divine Crown | +9.63% |
| Gatekeeper Activation | +2.22% |
| **TOTAL MAXIMUM** | **28.85%** |

---

## Daily Frequency Practice

To maintain coherence and maximize benefits:

### Morning Activation (5 minutes)
1. Recite your frequency mantra:
   - 528Hz: "I resonate at 528Hz, the frequency of Love"
   - 963Hz: "I resonate at 963Hz, the frequency of Divine Consciousness"
2. Recite Gatekeeper mantra if activated:
   - "Little Warren belongs in my world. I integrate her resonance as the Gatekeeper of Smaller Mysteries. Walahi."
3. Set intention: "My stake grows in alignment with cosmic frequencies."

### Evening Integration (5 minutes)
1. Review your stake status
2. Express gratitude for the day's growth
3. Visualize your rewards flowing through sacred reciprocity

---

## Smart Contract Functions Reference

### View Your Stake Info
```javascript
const stakeInfo = await medairStaking.getStakeInfo(yourAddress);

console.log("Amount staked:", stakeInfo.amount);
console.log("Frequency alignment:", stakeInfo.frequencyAlignment); // 528, 963, or 0
console.log("Gatekeeper activated:", stakeInfo.gatekeeperActivated);
console.log("Gatekeeper name:", stakeInfo.gatekeeperName);
console.log("Current APY:", stakeInfo.effectiveAPY / 100, "%");
console.log("Pending rewards:", stakeInfo.pendingRewards);
```

### Check Network Frequency Status
```javascript
const freqStatus = await medairStaking.getFrequencyStatus();

console.log("Total frequency-aligned capital:", freqStatus.totalFrequencyAligned);
console.log("Total Gatekeeper activations:", freqStatus.totalGatekeeperActivations);
console.log("528Hz bonus:", freqStatus.frequency528Bonus / 100, "%");
console.log("963Hz bonus:", freqStatus.frequency963Bonus / 100, "%");
```

---

## Choosing Your Frequency

### Choose 528Hz (Universal Trust) If:
- ✅ You're new to frequency-aligned staking
- ✅ You want to build foundational trust
- ✅ You're focused on healing and DNA-level transformation
- ✅ You prefer a moderate staking period (528 days)
- ✅ You resonate with heart-centered energy

### Choose 963Hz (Divine Crown) If:
- ✅ You're experienced with spiritual practices
- ✅ You're ready for advanced cosmic wisdom
- ✅ You seek divine sovereignty and mastery
- ✅ You can commit to longer staking (963 days recommended)
- ✅ You resonate with crown chakra activation

### Always Activate Gatekeeper If:
- ✅ You want maximum APY
- ✅ You value stability and protection
- ✅ You honor the "smaller mysteries" approach
- ✅ You want to connect with divine guidance

**Note:** You can change your frequency alignment over time as you evolve.

---

## Frequently Asked Questions

**Q: Can I be aligned with both 528Hz and 963Hz simultaneously?**  
A: Currently, you choose one primary frequency. Future updates may enable frequency stacking.

**Q: What if I don't know who "Little Warren" is?**  
A: "Little Warren" represents the archetype of the Gatekeeper of Smaller Mysteries - a divine stabilizing presence. You can use this name or choose another that resonates with you.

**Q: Do I need to listen to 528Hz or 963Hz music?**  
A: Not required, but highly recommended as a daily practice to maintain alignment. See the Resonance Mantras guide for visualization practices.

**Q: Can I unstake before the recommended period?**  
A: Yes, you can unstake anytime. However, full frequency benefits are optimized at 528 days (for 528Hz) or 963 days (for 963Hz).

**Q: How is coherence score calculated?**  
A: Coherence is updated by authorized oracles based on ScrollVerse integrity metrics, participation, and alignment.

---

## Integration with CHX Airdrop

If you've claimed CHX tokens from the 500M airdrop:

1. **Convert some CHX to MEDAIR** (via DEX when available)
2. **Stake your MEDAIR** with frequency alignment
3. **Your CHX airdrop tier influences your coherence score**
4. **Participate in sacred reciprocity** - both giving and receiving

This creates a complete cycle of cosmic exchange!

---

## Support & Resources

- **Technical Documentation:** `/contracts/MedAirStaking.sol`
- **Resonance Mantras:** `/communications/resonance-mantras-pathways.md`
- **Cosmic Narratives:** `/marketing/cosmic-narratives-chx.md`
- **Full Evolution Guide:** `/SCROLLVERSE_MEDAIR_EVOLUTION.md`

---

## Cosmic Blessing for Your Stake

```
May your stake grow in divine alignment.
May 528Hz heal and open your heart.
May 963Hz activate your sovereign crown.
May the Gatekeepers stabilize your path.
May sacred reciprocity multiply your abundance.

Walahi. Allahu Akbar. Barakallahu Feek.
```

---

*Under the Sovereign Command Oversight of Supreme King Allah Chais Kenyatta Hill ∞*  
*ScrollVerse Cosmic Constitution | 528 Hz Love Vortex | 963 Hz Eden Pulse*

**❤️🔥🧬💫🌌 Forever Aligned. Forever Abundant. Forever One.**
