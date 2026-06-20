"""
TrafficSaarthi — Manpower Estimator (Dummy / Reference Implementation)
======================================================================
Estimates the number of police officers required for incident management.
The formula is also replicated in TypeScript:
    src/utils/manpowerEstimator.ts → estimateManpower()

Algorithm
---------
This is a SIMPLE RULE-BASED ESTIMATOR.
Rules based on Standard Operating Procedures (SOPs) from
Bangalore Traffic Police manual, adapted for automated scoring.

Estimation formula:
  base_officers = 12 (High) | 6 (Medium) | 3 (Low)
  total = base_officers + 4 (if road closure required)
  traffic_control = ceil(total / 2)
  crowd_management = floor(total / 2)

Future enhancement:
  - Integrate with CCTV crowd density estimation (YOLOv8)
  - Use time-series demand forecasting for manpower pre-deployment
"""

from __future__ import annotations
import math

IMPACT_BASE: dict[str, int] = {
    "High":   12,
    "Medium":  6,
    "Low":     3,
}


def estimate_manpower(impact_level: str, requires_road_closure: bool) -> dict:
    """
    Returns a dict with manpower breakdown.

    Parameters
    ----------
    impact_level         : 'High' | 'Medium' | 'Low'
    requires_road_closure: bool

    Returns
    -------
    {
      "total": int,
      "traffic_control": int,
      "crowd_management": int,
      "barricade_team": int,
      "description": str
    }
    """
    base = IMPACT_BASE.get(impact_level, 3)
    barricade = 4 if requires_road_closure else 0
    total = base + barricade
    traffic = math.ceil(total / 2)
    crowd = math.floor(total / 2)

    desc = (
        f"{total} officers "
        f"({traffic} traffic control + {crowd} crowd mgmt"
        f"{' + 4 barricade team' if requires_road_closure else ''})"
    )
    return {
        "total": total,
        "traffic_control": traffic,
        "crowd_management": crowd,
        "barricade_team": barricade,
        "description": desc,
    }


# ── Quick smoke-test ─────────────────────────────────────────────────────────
if __name__ == "__main__":
    for level in ["High", "Medium", "Low"]:
        for closure in [True, False]:
            result = estimate_manpower(level, closure)
            print(f"{level:6} | closure={closure!s:5} → {result['description']}")
