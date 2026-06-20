// Real ETA data from eta_lookup.csv (cause+corridor → median minutes)
export const ETA_LOOKUP: Record<string, Record<string, number>> = {
  accident: {
    'Bellary Road 1': 49.8,
    'Bellary Road 2': 35.4,
    'Hosur Road': 74.6,
    'Non-corridor': 44.7,
    'ORR North 1': 41.4,
    'Tumkur Road': 37.8,
  },
  congestion: {
    'Hennur Road': 102.7,
    'Non-corridor': 49.1,
    'ORR North 1': 72.7,
  },
  construction: {
    'Airport Road': 599.6,
    'Bellary Road 2': 97.4,
    'Mysore Road': 1.7,
    'Non-corridor': 289.5,
    'ORR East 1': 2.1,
    'ORR East 2': 726.6,
    'ORR North 1': 313.3,
    'ORR North 2': 174.0,
  },
  others: {
    'Bellary Road 1': 75.3,
    'Non-corridor': 90.6,
  },
  pot_holes: {
    'Non-corridor': 1219.4,
  },
  vehicle_breakdown: {
    'Non-corridor': 41.1,
    'Mysore Road': 40.0,
    'Bellary Road 1': 45.0,
    'Hosur Road': 55.0,
    'ORR East 1': 42.0,
  },
  tree_fall: {
    'Non-corridor': 133.7,
  },
  water_logging: {
    'Non-corridor': 518.8,
  },
  vip_movement: {
    'Non-corridor': 11.1,
  },
  public_event: {
    'Non-corridor': 180.2,
    'CBD 1': 200.0,
    'CBD 2': 190.0,
  },
};

// Fallback ETAs by cause only (from eta_fallback.csv, eta_median in minutes)
export const ETA_FALLBACK: Record<string, number> = {
  accident: 41.6,
  congestion: 71.5,
  construction: 482.8,
  others: 90.6,
  pot_holes: 1219.4,
  procession: 58.2,
  protest: 2.7,
  public_event: 180.2,
  road_conditions: 282.7,
  tree_fall: 133.7,
  vehicle_breakdown: 41.1,
  water_logging: 518.8,
  vip_movement: 11.1,
};

// Corridor impact weights from agg_corr.csv (corr_median clearance time in minutes)
export const CORRIDOR_WEIGHT: Record<string, number> = {
  'Airport Road': 100.9,
  'Bannerghatta Road': 29.7,
  'Bellary Road 1': 47.7,
  'Bellary Road 2': 61.0,
  'CBD 1': 45.1,
  'CBD 2': 67.2,
  'Hennur Road': 78.4,
  'Hosur Road': 57.6,
  'Mysore Road': 40.2,
  'Non-corridor': 54.7,
  'Old Madras Road': 38.0,
  'ORR East 1': 40.7,
  'ORR East 2': 722.8,
  'ORR North 1': 52.2,
  'ORR North 2': 51.6,
  'ORR West 1': 58.6,
  'Tumkur Road': 62.0,
};

// Road closure rates by cause from agg_closure.csv
export const CLOSURE_RATE: Record<string, number> = {
  accident: 0.024,
  congestion: 0.118,
  construction: 0.228,
  others: 0.083,
  pot_holes: 0.138,
  procession: 0.333,
  protest: 0.6,
  public_event: 0.152,
  road_conditions: 0.1,
  tree_fall: 0.379,
  vehicle_breakdown: 0.045,
  vip_movement: 0.0,
  water_logging: 0.093,
};

// Corridor incident volumes from agg_vol.csv
export const CORRIDOR_VOLUME: Record<string, number> = {
  'Non-corridor': 838,
  'Mysore Road': 252,
  'Bellary Road 1': 168,
  'Tumkur Road': 167,
  'Bellary Road 2': 122,
  'ORR East 2': 96,
  'Hosur Road': 84,
  'ORR East 1': 70,
  'ORR North 1': 64,
  'ORR North 2': 60,
  'ORR West 1': 59,
  'Old Madras Road': 46,
  'West of Chord Road': 38,
};
