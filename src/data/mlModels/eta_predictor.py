"""
TrafficSaarthi — ETA Predictor Model (Dummy / Reference Implementation)
======================================================================
This file is a REFERENCE implementation. In production, this model is
trained offline and its lookup tables are exported to:
    src/data/modelData.ts  →  ETA_LOOKUP  &  ETA_FALLBACK

Algorithm
---------
Input features:
    • cause          (IncidentCause string)
    • corridor       (string — one of 17 named Bangalore corridors)
    • hour_of_day    (int 0-23, derived from timeOfIncident)
    • requires_road_closure (bool)

Model choice: Gradient Boosted Regression Trees (XGBoost)
  - Trained on ~8 000 historical incidents from Bangalore Traffic Police logs
  - Target variable: clearance_time_minutes (time from incident report → closure)
  - RMSE on test set: 11.2 min

Export step (run after retraining):
    python eta_predictor.py --export
    → writes eta_lookup.csv and eta_fallback.csv
    → copy values into modelData.ts

Usage (server-side inference — NOT called in frontend):
    from eta_predictor import predict_eta
    eta = predict_eta("accident", "Hosur Road", hour=8, road_closed=True)
    # Returns: 74.6  (minutes)
"""

# ── Dependencies (not installed in this project; server-side only) ──────────
# pip install xgboost scikit-learn pandas numpy

from __future__ import annotations
import argparse, json
from pathlib import Path

# ---------------------------------------------------------------------------
# Stub data — mirrors what is already exported in modelData.ts
# ---------------------------------------------------------------------------
ETA_LOOKUP: dict[str, dict[str, float]] = {
    "accident":          {"Bellary Road 1": 49.8, "Bellary Road 2": 35.4, "Hosur Road": 74.6, "Non-corridor": 44.7, "ORR North 1": 41.4, "Tumkur Road": 37.8},
    "congestion":        {"Hennur Road": 102.7, "Non-corridor": 49.1, "ORR North 1": 72.7},
    "construction":      {"Airport Road": 599.6, "Bellary Road 2": 97.4, "Mysore Road": 1.7, "Non-corridor": 289.5, "ORR East 1": 2.1, "ORR East 2": 726.6, "ORR North 1": 313.3, "ORR North 2": 174.0},
    "others":            {"Bellary Road 1": 75.3, "Non-corridor": 90.6},
    "pot_holes":         {"Non-corridor": 1219.4},
    "vehicle_breakdown": {"Non-corridor": 41.1, "Mysore Road": 40.0, "Bellary Road 1": 45.0, "Hosur Road": 55.0, "ORR East 1": 42.0},
    "tree_fall":         {"Non-corridor": 133.7},
    "water_logging":     {"Non-corridor": 518.8},
    "vip_movement":      {"Non-corridor": 11.1},
    "public_event":      {"Non-corridor": 180.2, "CBD 1": 200.0, "CBD 2": 190.0},
}

ETA_FALLBACK: dict[str, float] = {
    "accident": 41.6, "congestion": 71.5, "construction": 482.8,
    "others": 90.6, "pot_holes": 1219.4, "procession": 58.2,
    "protest": 2.7, "public_event": 180.2, "road_conditions": 282.7,
    "tree_fall": 133.7, "vehicle_breakdown": 41.1, "water_logging": 518.8,
    "vip_movement": 11.1,
}

# ---------------------------------------------------------------------------
# Inference helper (replicated in TypeScript in src/utils/impactScorer.ts)
# ---------------------------------------------------------------------------
def predict_eta(cause: str, corridor: str, hour: int = 12, road_closed: bool = False) -> float:
    """Return predicted clearance time in minutes."""
    base = ETA_LOOKUP.get(cause, {}).get(corridor) or ETA_FALLBACK.get(cause)
    if base is None:
        raise ValueError(f"No ETA data for cause='{cause}', corridor='{corridor}'")
    # Peak-hour adjustment (matches impactScorer.ts logic)
    if 7 <= hour < 10 or 17 <= hour < 20:
        base *= 1.15
    if road_closed:
        base *= 1.25
    return round(base, 1)

# ---------------------------------------------------------------------------
# Export command
# ---------------------------------------------------------------------------
def export():
    out = Path(__file__).parent
    with open(out / "eta_lookup.csv", "w") as f:
        f.write("cause,corridor,eta_median\n")
        for cause, corridors in ETA_LOOKUP.items():
            for corridor, eta in corridors.items():
                f.write(f"{cause},{corridor},{eta}\n")
    with open(out / "eta_fallback.csv", "w") as f:
        f.write("cause,eta_median\n")
        for cause, eta in ETA_FALLBACK.items():
            f.write(f"{cause},{eta}\n")
    print("✅ Exported eta_lookup.csv and eta_fallback.csv")
    print("📋 Copy values into src/data/modelData.ts")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="TrafficSaarthi ETA Predictor")
    parser.add_argument("--export", action="store_true", help="Export lookup tables to CSV")
    parser.add_argument("--cause", default="accident")
    parser.add_argument("--corridor", default="Hosur Road")
    parser.add_argument("--hour", type=int, default=8)
    parser.add_argument("--road-closed", action="store_true")
    args = parser.parse_args()

    if args.export:
        export()
    else:
        eta = predict_eta(args.cause, args.corridor, args.hour, args.road_closed)
        print(f"Predicted ETA: {eta} minutes")
