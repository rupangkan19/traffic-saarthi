"""
TrafficSaarthi — Impact Scorer Model (Dummy / Reference Implementation)
=======================================================================
Computes a 0-100 impact score for any logged incident.
The scoring formula is also replicated in TypeScript:
    src/utils/impactScorer.ts → computeIncidentScore()

Algorithm
---------
This is a RULE-BASED WEIGHTED SCORING model (not a neural net).
Rules were derived from:
  1. Domain expertise from Bangalore Traffic Police
  2. Historical data analysis (agg_corr.csv, agg_closure.csv)

Score components:
  BASE_SCORE     : by cause type  (30-90 pts)
  CORRIDOR_BONUS : high-impact corridors get +30% 
  PEAK_HOUR_BONUS: morning / evening peak → +25%
  CLOSURE_BONUS  : road closure required → +15 pts hard bonus

Final score = min(base * corridor_mult * hour_mult + closure_bonus, 100)
"""

from __future__ import annotations

# ── Base scores per cause (matches TypeScript CAUSE_BASE) ──────────────────
CAUSE_BASE: dict[str, float] = {
    "accident":          90.0,
    "vip_movement":      85.0,
    "public_event":      80.0,
    "tree_fall":         70.0,
    "water_logging":     65.0,
    "construction":      60.0,
    "vehicle_breakdown": 50.0,
    "pot_holes":         35.0,
    "others":            30.0,
}

HIGH_IMPACT_CORRIDORS = {
    "Mysore Road", "Bellary Road 1", "Bellary Road 2", "Tumkur Road",
    "Hosur Road", "ORR East 1", "ORR East 2", "ORR North 1", "CBD 1", "CBD 2",
}

def compute_impact_score(
    cause: str,
    corridor: str,
    time_of_incident: str,
    requires_road_closure: bool,
) -> tuple[int, str]:
    """
    Returns (score: int, level: str) where level ∈ {'High','Medium','Low'}.
    
    Parameters
    ----------
    cause               : Incident cause (e.g. 'accident')
    corridor            : Named corridor (e.g. 'Hosur Road')
    time_of_incident    : ISO datetime string
    requires_road_closure: Whether the incident requires a road closure
    """
    from datetime import datetime

    score: float = CAUSE_BASE.get(cause, 30.0)

    if corridor in HIGH_IMPACT_CORRIDORS:
        score *= 1.30

    hour = datetime.fromisoformat(time_of_incident).hour
    if 7 <= hour < 10 or 17 <= hour < 20:
        score *= 1.25
    elif 10 <= hour < 17:
        score *= 1.0
    else:
        score *= 0.80

    if requires_road_closure:
        score += 15

    score = min(round(score), 100)
    level = "High" if score >= 80 else ("Medium" if score >= 50 else "Low")
    return score, level


# ── Quick smoke-test ────────────────────────────────────────────────────────
if __name__ == "__main__":
    test_cases = [
        ("accident",          "Hosur Road",      "2024-03-15T08:30:00", True),
        ("vehicle_breakdown", "Non-corridor",    "2024-03-15T14:00:00", False),
        ("construction",      "ORR East 2",      "2024-03-15T09:00:00", True),
        ("vip_movement",      "CBD 1",           "2024-03-15T18:00:00", False),
    ]
    print(f"{'Cause':<22}{'Corridor':<22}{'Score':>6}  Level")
    print("-" * 55)
    for cause, corridor, t, closure in test_cases:
        score, level = compute_impact_score(cause, corridor, t, closure)
        print(f"{cause:<22}{corridor:<22}{score:>6}  {level}")
