import type { ImpactLevel } from '../types';

export function estimateManpower(impactLevel: ImpactLevel, requiresRoadClosure: boolean): string {
  const base = impactLevel === 'High' ? 12 : impactLevel === 'Medium' ? 6 : 3;
  const total = requiresRoadClosure ? base + 4 : base;
  const traffic = Math.ceil(total / 2);
  const crowd = Math.floor(total / 2);
  return `${total} officers (${traffic} traffic control + ${crowd} crowd mgmt${requiresRoadClosure ? ' + 4 barricade team' : ''})`;
}
