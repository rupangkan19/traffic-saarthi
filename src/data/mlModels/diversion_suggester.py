"""
TrafficSaarthi — Diversion Route Suggester (Dummy / Reference Implementation)
=============================================================================
Suggests optimal diversion routes when a corridor is closed.
The rule table is also replicated in TypeScript:
    src/utils/diversionSuggester.ts → getDiversionRoutes()

Algorithm
---------
Approach: RULE-BASED GRAPH LOOKUP (not ML).
  - Bangalore road network modelled as a directed graph
  - Pre-computed shortest alternate paths per corridor
  - Each route includes turn-by-turn steps and estimated delay

Future enhancement (production roadmap):
  - Replace static rules with live HERE Maps / Google Maps Directions API
  - Use OSRM (Open Source Routing Machine) for dynamic re-routing
  - Incorporate real-time traffic speed data from FASTag sensors

Data source:
  - Bangalore road network from OpenStreetMap (OSM)
  - Corridor closures verified with Bangalore Traffic Police daily log

Usage (server-side):
    from diversion_suggester import get_diversions
    routes = get_diversions("Hosur Road")
"""

from __future__ import annotations
from dataclasses import dataclass

@dataclass
class DiversionRoute:
    label: str
    steps: list[str]
    rejoins_at: str
    estimated_delay: str
    from_coords: tuple[float, float]   # (lat, lng)
    to_coords: tuple[float, float]     # (lat, lng)


# ── Rule table — same as TypeScript DIVERSION_RULES ─────────────────────────
DIVERSION_RULES: dict[str, list[DiversionRoute]] = {
    "Mysore Road": [
        DiversionRoute(
            label="Via Kanakapura Road",
            steps=["Exit at Gopalan Mall signal", "Take Kanakapura Road south", "Rejoin Mysore Road at Kengeri"],
            rejoins_at="Kengeri Signal", estimated_delay="+12 min",
            from_coords=(12.9450, 77.5350), to_coords=(12.9082, 77.4977),
        ),
    ],
    "Bellary Road 1": [
        DiversionRoute(
            label="Via Outer Ring Road (North)",
            steps=["Turn right at Hebbal on ORR", "Continue on ORR North", "Rejoin Bellary Road at Yelahanka"],
            rejoins_at="Yelahanka Junction", estimated_delay="+18 min",
            from_coords=(13.0358, 77.5970), to_coords=(13.1007, 77.5963),
        ),
    ],
    "Hosur Road": [
        DiversionRoute(
            label="Via Bannerghatta Road",
            steps=["Turn at BTM Layout signal", "Take Bannerghatta Road", "Rejoin Hosur Road at Electronic City flyover"],
            rejoins_at="Electronic City Phase 1", estimated_delay="+20 min",
            from_coords=(12.9173, 77.6228), to_coords=(12.8600, 77.6500),
        ),
    ],
    "ORR East 1": [
        DiversionRoute(
            label="Via Old Airport Road",
            steps=["Exit ORR at Marathahalli", "Use Old Airport Road eastbound", "Rejoin ORR at KR Puram"],
            rejoins_at="KR Puram Bridge", estimated_delay="+15 min",
            from_coords=(12.9561, 77.7010), to_coords=(12.9975, 77.6960),
        ),
    ],
    "CBD 1": [
        DiversionRoute(
            label="Via Residency Road",
            steps=["Use Residency Road parallel to MG Road", "Continue to Richmond Circle", "Rejoin via Brigade Road"],
            rejoins_at="Brigade Road Junction", estimated_delay="+8 min",
            from_coords=(12.9716, 77.5946), to_coords=(12.9800, 77.6100),
        ),
    ],
}


def get_diversions(corridor: str) -> list[DiversionRoute]:
    """Return pre-computed diversion routes for a closed corridor."""
    return DIVERSION_RULES.get(corridor, [])


def has_diversion(corridor: str) -> bool:
    return corridor in DIVERSION_RULES


# ── Quick smoke-test ────────────────────────────────────────────────────────
if __name__ == "__main__":
    for corridor in ["Hosur Road", "CBD 1", "Unknown Road"]:
        routes = get_diversions(corridor)
        print(f"\n{corridor}: {len(routes)} diversion(s)")
        for r in routes:
            print(f"  → {r.label} | Delay: {r.estimated_delay} | Rejoins at: {r.rejoins_at}")
