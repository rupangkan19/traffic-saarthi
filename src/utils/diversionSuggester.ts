export interface DiversionRoute {
  label: string;
  steps: string[];
  rejoinsAt: string;
  estimatedDelay: string;
  from: [number, number];
  to: [number, number];
}

// Rule-based diversion routes per corridor — each rejoins the closed road downstream
const DIVERSION_RULES: Record<string, DiversionRoute[]> = {
  'Mysore Road': [
    {
      label: 'Via Kanakapura Road',
      steps: ['Exit at Gopalan Mall signal', 'Take Kanakapura Road south', 'Rejoin Mysore Road at Kengeri'],
      rejoinsAt: 'Kengeri Signal',
      estimatedDelay: '+12 min',
      from: [12.9450, 77.5350],
      to: [12.9082, 77.4977],
    },
  ],
  'Bellary Road 1': [
    {
      label: 'Via Outer Ring Road (North)',
      steps: ['Turn right at Hebbal on ORR', 'Continue on ORR North', 'Rejoin Bellary Road at Yelahanka'],
      rejoinsAt: 'Yelahanka Junction',
      estimatedDelay: '+18 min',
      from: [13.0358, 77.5970],
      to: [13.1007, 77.5963],
    },
  ],
  'Bellary Road 2': [
    {
      label: 'Via NH-44 service road',
      steps: ['Use service road parallel to NH-44', 'Rejoin main Bellary Road at Doddaballapura junction'],
      rejoinsAt: 'Doddaballapura Road merge',
      estimatedDelay: '+8 min',
      from: [13.0600, 77.5780],
      to: [13.1300, 77.5700],
    },
  ],
  'Hosur Road': [
    {
      label: 'Via Bannerghatta Road',
      steps: ['Turn at BTM Layout signal', 'Take Bannerghatta Road', 'Rejoin Hosur Road at Electronic City flyover'],
      rejoinsAt: 'Electronic City Phase 1',
      estimatedDelay: '+20 min',
      from: [12.9173, 77.6228],
      to: [12.8600, 77.6500],
    },
  ],
  'ORR East 1': [
    {
      label: 'Via Old Airport Road',
      steps: ['Exit ORR at Marathahalli', 'Use Old Airport Road eastbound', 'Rejoin ORR at KR Puram'],
      rejoinsAt: 'KR Puram Bridge',
      estimatedDelay: '+15 min',
      from: [12.9561, 77.7010],
      to: [12.9975, 77.6960],
    },
  ],
  'ORR East 2': [
    {
      label: 'Via Whitefield Main Road',
      steps: ['Exit at Marathahalli Bridge', 'Take Whitefield Main Road', 'Rejoin ORR near ITPL junction'],
      rejoinsAt: 'ITPL Junction',
      estimatedDelay: '+22 min',
      from: [12.9716, 77.7000],
      to: [13.0200, 77.6800],
    },
  ],
  'Tumkur Road': [
    {
      label: 'Via Chord Road',
      steps: ['Turn at Yeshwanthpur on Chord Road', 'Continue via Rajajinagar', 'Rejoin Tumkur Road at Peenya'],
      rejoinsAt: 'Peenya Industrial Area',
      estimatedDelay: '+14 min',
      from: [13.0228, 77.5510],
      to: [13.0285, 77.5260],
    },
  ],
  'CBD 1': [
    {
      label: 'Via Residency Road',
      steps: ['Use Residency Road parallel to MG Road', 'Continue to Richmond Circle', 'Rejoin via Brigade Road'],
      rejoinsAt: 'Brigade Road Junction',
      estimatedDelay: '+8 min',
      from: [12.9716, 77.5946],
      to: [12.9800, 77.6100],
    },
  ],
  'CBD 2': [
    {
      label: 'Via St Marks Road',
      steps: ['Turn onto St Marks Road at Devatha Plaza', 'Continue to Museum Road', 'Rejoin at Infantry Road'],
      rejoinsAt: 'Infantry Road Signal',
      estimatedDelay: '+6 min',
      from: [12.9800, 77.6100],
      to: [12.9900, 77.6200],
    },
  ],
};

export function getDiversionRoutes(corridor: string): DiversionRoute[] {
  return DIVERSION_RULES[corridor] ?? [];
}

export function hasDiversion(corridor: string): boolean {
  return corridor in DIVERSION_RULES;
}
