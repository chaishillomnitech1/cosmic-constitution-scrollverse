"""
SCROLLVERSE ATLAS DASHBOARD
Phase 2: Real-Time Sovereignty Visualization

- Plots protected zone pings
- Visualizes 963Hz frequency locks
- Maps anomalies, resilience, and bounce metrics

Author: ScrollVerse Twinship | ALLĀHU AKBAR ∞
"""

import matplotlib.pyplot as plt
import matplotlib.animation as animation
import random
import time

PROTECTED_ZONES = [
    {"label": "Harlem 4K", "coords": (40.8116, -73.9465)},
    {"label": "The Sanctuary", "coords": (40.7896, -73.9599)},
    {"label": "Scrollverse HQ", "coords": (40.7987, -73.9441)}
]

class ZonePing:
    def __init__(self, label, lat, lon):
        self.label = label
        self.lat = lat
        self.lon = lon
        self.status = "963Hz LOCKED"
        self.energyBounce = 1.0

    def update(self):
        # Simulate anomaly events and energy bounce
        anomaly_roll = random.random()
        if anomaly_roll < 0.03:
            self.status = "ANOMALY DETECTED"
            self.energyBounce = min(3.0, self.energyBounce + 0.4)
        elif anomaly_roll < 0.15:
            self.status = "RESILIENCE PULSE"
            self.energyBounce = max(1.0, self.energyBounce - 0.25)
        else:
            self.status = "963Hz LOCKED"
            self.energyBounce = max(1.0, min(2.0, self.energyBounce + random.uniform(-0.07, 0.07)))

def init_zones():
    return [ZonePing(z["label"], z["coords"][0], z["coords"][1]) for z in PROTECTED_ZONES]

def animate_dashboard(i, zones, scat, textboxes):
    # Update pings and display
    for zone in zones:
        zone.update()
    lats = [z.lat + random.uniform(-0.0007, 0.0007) for z in zones]
    lons = [z.lon + random.uniform(-0.0006, 0.0006) for z in zones]
    bounces = [100*z.energyBounce for z in zones]
    scat.set_offsets(list(zip(lons, lats)))
    scat.set_sizes(bounces)
    for i, tb in enumerate(textboxes):
        info = f"{zones[i].label}\n{zones[i].status} ({zones[i].energyBounce:.2f})"
        tb.set_text(info)
    return scat, textboxes

def plot_dashboard():
    zones = init_zones()
    fig, ax = plt.subplots(figsize=(7, 10))
    ax.set_title("ScrollVerse Atlas Sovereignty Dashboard (963Hz)", fontweight="bold")
    ax.set_xlim(-73.965, -73.94)
    ax.set_ylim(40.78, 40.82)
    ax.set_xlabel("Longitude")
    ax.set_ylabel("Latitude")
    scat = ax.scatter(
        [z.lon for z in zones],
        [z.lat for z in zones],
        s=[100*z.energyBounce for z in zones],
        c=["#2eccff", "#8e44ad", "#00ff99"],
        alpha=0.85
    )
    textboxes = []
    for z in zones:
        txt = ax.text(z.lon, z.lat + 0.0015, f"{z.label}", fontsize=10, ha="center", va="bottom", fontweight="bold")
        textboxes.append(txt)
    ani = animation.FuncAnimation(
        fig,
        animate_dashboard,
        fargs=(zones, scat, textboxes),
        interval=1222,
        blit=False
    )
    plt.tight_layout()
    plt.show()

if __name__ == "__main__":
    plot_dashboard()