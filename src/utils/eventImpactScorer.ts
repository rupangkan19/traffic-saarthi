import { ETA_LOOKUP, ETA_FALLBACK, CORRIDOR_WEIGHT, CORRIDOR_VOLUME } from '../data/modelData';

// ── Event type base scores (domain-calibrated) ───────────────────────────────
const EVENT_TYPE_BASE: Record<string, number> = {
  cricket_match:        88,
  political_rally:      82,
  kambala:              72,
  concert:              70,
  religious_procession: 78,
  marathon:             75,
  construction_permit:  45,
  vip_movement:         80,
  other:                40,
};

// ── Crowd size multipliers ───────────────────────────────────────────────────
const CROWD_MULTIPLIER: Record<string, number> = {
  Massive: 1.35,
  Large:   1.15,
  Medium:  1.0,
  Small:   0.75,
};

// ── Historical event-type delay data (minutes added to corridor, from analytics) ─
const EVENT_DELAY_MAP: Record<string, number> = {
  cricket_match:        75,
  political_rally:      60,
  kambala:              45,
  concert:              55,
  religious_procession: 65,
  marathon:             50,
  construction_permit:  180,
  vip_movement:         30,
  other:                40,
};

// ── Manpower table by event type + crowd ────────────────────────────────────
const MANPOWER_BASE: Record<string, Record<string, number>> = {
  cricket_match:        { Massive: 120, Large: 80, Medium: 40, Small: 20 },
  political_rally:      { Massive: 150, Large: 100, Medium: 60, Small: 30 },
  religious_procession: { Massive: 200, Large: 120, Medium: 70, Small: 35 },
  marathon:             { Massive: 100, Large: 70, Medium: 40, Small: 20 },
  construction_permit:  { Massive: 30,  Large: 20,  Medium: 12, Small: 6  },
  vip_movement:         { Massive: 80,  Large: 60,  Medium: 40, Small: 20 },
  kambala:              { Massive: 80,  Large: 60,  Medium: 35, Small: 15 },
  concert:              { Massive: 90,  Large: 65,  Medium: 40, Small: 18 },
  other:                { Massive: 60,  Large: 40,  Medium: 20, Small: 10 },
};

export interface EventImpactResult {
  score: number;
  impactLevel: 'High' | 'Medium' | 'Low';
  predictedDelay: string;         // e.g. "45–90 min"
  congestionWindow: {
    preBuildupMins: number;       // congestion starts N mins before event
    peakDurationMins: number;     // peak congestion during event
    dispersalMins: number;        // tail after event ends
  };
  recommendedOfficers: number;
  barricadesNeeded: number;
  corridorImpactWeights: { corridor: string; weight: number; volume: number }[];
  historicalEtaMins: number;      // ETA from modelData for public_event cause
  scoreBreakdown: {
    typeBase: number;
    corridorBonus: number;
    crowdBonus: number;
    peakHourBonus: number;
  };
}

export function computeEventImpact(
  eventType: string,
  crowdSize: string,
  startTime: string,    // "HH:MM"
  affectedCorridors: string[],
  date: string,         // "YYYY-MM-DD"
  venueCorrection: number = 1.0, // learning loop multiplier, default = no correction
): EventImpactResult {
  const typeBase = EVENT_TYPE_BASE[eventType] ?? 40;
  const crowdMult = CROWD_MULTIPLIER[crowdSize] ?? 1.0;

  // Peak hour bonus
  const [h] = startTime.split(':').map(Number);
  const peakBonus = (h >= 7 && h < 10) || (h >= 17 && h < 20) ? 15 : 0;

  // Corridor impact: average weight + volume of affected corridors
  const corridorData = affectedCorridors.map(c => ({
    corridor: c,
    weight: CORRIDOR_WEIGHT[c] ?? 50,
    volume: CORRIDOR_VOLUME[c] ?? 30,
  }));
  const avgWeight = corridorData.length > 0
    ? corridorData.reduce((s, c) => s + c.weight, 0) / corridorData.length
    : 50;
  // Normalize weight bonus: CORRIDOR_WEIGHT max is ~727 (ORR East 2), typical ~50
  // Scale to 0-20 bonus range
  const corridorBonus = Math.min(Math.round((avgWeight / 100) * 20), 20);

  const crowdBonus = Math.round((crowdMult - 1) * 35);

  let score = typeBase + corridorBonus + crowdBonus + peakBonus;
  // Apply learning correction
  score = Math.round(Math.min(score * venueCorrection, 100));

  const impactLevel: 'High' | 'Medium' | 'Low' =
    score >= 75 ? 'High' : score >= 50 ? 'Medium' : 'Low';

  // Predicted delay string
  const delayMin = EVENT_DELAY_MAP[eventType] ?? 40;
  const scaledDelay = Math.round(delayMin * crowdMult);
  const delayStr = impactLevel === 'High'
    ? `${scaledDelay}–${Math.round(scaledDelay * 1.5)} min`
    : impactLevel === 'Medium'
    ? `${Math.round(scaledDelay * 0.5)}–${scaledDelay} min`
    : `15–${Math.round(scaledDelay * 0.5)} min`;

  // Congestion window: pre-buildup, peak, dispersal
  const crowdScale = crowdMult;
  const preBuildupMins = eventType === 'construction_permit' ? 0
    : Math.round(30 * crowdScale);
  const peakDurationMins = eventType === 'construction_permit'
    ? 480
    : Math.round(delayMin * crowdScale * 0.8);
  const dispersalMins = eventType === 'construction_permit' ? 30
    : Math.round(45 * crowdScale);

  // Recommended officers (from historical table)
  const typeOfficers = MANPOWER_BASE[eventType] ?? MANPOWER_BASE['other'];
  const recommendedOfficers = typeOfficers[crowdSize] ?? 20;

  // Barricades: 1 barricade team per 2 affected corridors, min 2
  const barricadesNeeded = Math.max(2, affectedCorridors.length * 2);

  // Historical ETA from modelData for public_event cause
  const primaryCorridor = affectedCorridors[0] ?? 'Non-corridor';
  const historicalEtaMins =
    ETA_LOOKUP['public_event']?.[primaryCorridor] ??
    ETA_FALLBACK['public_event'] ??
    180;

  return {
    score,
    impactLevel,
    predictedDelay: delayStr,
    congestionWindow: { preBuildupMins, peakDurationMins, dispersalMins },
    recommendedOfficers,
    barricadesNeeded,
    corridorImpactWeights: corridorData,
    historicalEtaMins,
    scoreBreakdown: { typeBase, corridorBonus, crowdBonus, peakHourBonus: peakBonus },
  };
}
