import type { IncidentCause, ImpactLevel } from '../types';
import { ETA_LOOKUP, ETA_FALLBACK } from '../data/modelData';

const CAUSE_BASE: Record<IncidentCause, number> = {
  accident: 90,
  vip_movement: 85,
  public_event: 80,
  tree_fall: 70,
  water_logging: 65,
  construction: 60,
  vehicle_breakdown: 50,
  pot_holes: 35,
  others: 30,
};

const HIGH_IMPACT_CORRIDORS = [
  'Mysore Road','Bellary Road 1','Bellary Road 2','Tumkur Road','Hosur Road',
  'ORR East 1','ORR East 2','ORR North 1','CBD 1','CBD 2'
];

export function computeIncidentScore(
  cause: IncidentCause,
  corridor: string,
  timeOfIncident: string,
  requiresRoadClosure: boolean
): number {
  let score = CAUSE_BASE[cause];
  if (HIGH_IMPACT_CORRIDORS.includes(corridor)) score *= 1.3;
  const hour = new Date(timeOfIncident).getHours();
  if ((hour >= 7 && hour < 10) || (hour >= 17 && hour < 20)) score *= 1.25;
  else if (hour >= 10 && hour < 17) score *= 1.0;
  else score *= 0.8;
  if (requiresRoadClosure) score += 15;
  return Math.round(Math.min(score, 100));
}

export function scoreToLevel(score: number): ImpactLevel {
  if (score >= 80) return 'High';
  if (score >= 50) return 'Medium';
  return 'Low';
}

export function estimateClearanceTime(cause: IncidentCause | string, corridor: string): string {
  const causeKey = cause as string;
  const etaMin = ETA_LOOKUP[causeKey]?.[corridor] ?? ETA_FALLBACK[causeKey];
  if (etaMin == null) return 'Unknown';
  if (etaMin < 60) return `${Math.round(etaMin)} min`;
  const hrs = Math.floor(etaMin / 60);
  const mins = Math.round(etaMin % 60);
  return mins > 0 ? `${hrs}h ${mins}m` : `${hrs}h`;
}
