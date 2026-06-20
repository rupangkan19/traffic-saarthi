# TrafficSaarthi — ML Models

This directory contains reference implementations of all scoring/prediction
algorithms used by TrafficSaarthi. These are **not called by the frontend** —
they exist to:

1. Document the logic clearly
2. Serve as the source of truth for the exported lookup tables in
   [`src/data/modelData.ts`](../modelData.ts)
3. Run as offline batch jobs when retraining is needed

---

## Models

| File | Algorithm | TypeScript mirror |
|------|-----------|-------------------|
| [`eta_predictor.py`](./eta_predictor.py) | XGBoost Gradient Boosted Regression | `ETA_LOOKUP` / `ETA_FALLBACK` in `modelData.ts` |
| [`impact_scorer.py`](./impact_scorer.py) | Rule-Based Weighted Scoring | `computeIncidentScore()` in `impactScorer.ts` |
| [`diversion_suggester.py`](./diversion_suggester.py) | Rule-Based Graph Lookup | `getDiversionRoutes()` in `diversionSuggester.ts` |
| [`manpower_estimator.py`](./manpower_estimator.py) | SOP-Based Rule Engine | `estimateManpower()` in `manpowerEstimator.ts` |

---

## How the Frontend Uses These

The frontend **never calls Python directly**. The workflow is:

```
Historical Data (CSV) → Python ML Training → Lookup Tables (CSV)
                                                        ↓
                                              Copy to modelData.ts
                                                        ↓
                                              TypeScript utilities use it
```

---

## Running the Models Locally

```bash
# Predict ETA for an accident on Hosur Road at 8am
python eta_predictor.py --cause accident --corridor "Hosur Road" --hour 8

# Export updated lookup tables after retraining
python eta_predictor.py --export

# Run smoke tests on all models
python impact_scorer.py
python diversion_suggester.py
python manpower_estimator.py
```
