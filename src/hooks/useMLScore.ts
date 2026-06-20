import { computeIncidentScore, scoreToLevel, estimateClearanceTime } from '../utils/impactScorer';
import type { IncidentCause, ImpactLevel } from '../types';

export function useMLScore() {
  const getScore = (cause: IncidentCause, corridor: string, time: string, closure: boolean) => {
    const score = computeIncidentScore(cause, corridor, time, closure);
    const level: ImpactLevel = scoreToLevel(score);
    const clearance = estimateClearanceTime(cause, corridor);
    return { score, level, clearance };
  };
  return { getScore };
}
