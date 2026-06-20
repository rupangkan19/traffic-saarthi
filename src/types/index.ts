export interface OfficerNote {
  text: string;
  timestamp: string;
  author: string;
}

export type IncidentCause = 'vehicle_breakdown'|'accident'|'pot_holes'|'construction'|'water_logging'|'tree_fall'|'public_event'|'vip_movement'|'others';
export type IncidentStatus = 'active'|'resolved'|'closed'|'draft';
export type Priority = 'High'|'Medium'|'Low';
export type ImpactLevel = 'High'|'Medium'|'Low';

export interface Incident {
  id: string;
  cause: IncidentCause;
  corridor: string;
  junction: string;
  address: string;
  lat: number;
  lng: number;
  priority: Priority;
  status: IncidentStatus;
  requiresRoadClosure: boolean;
  vehicleType?: string;
  vehicleNumber?: string;
  breakdownReason?: string;
  description: string;
  direction: string;
  timeOfIncident: string;
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string;
  resolutionTimeMin?: number;
  impactScore: number;
  impactLevel: ImpactLevel;
  officerNotes: OfficerNote[];
}

export type EventType = 'cricket_match'|'political_rally'|'kambala'|'concert'|'religious_procession'|'marathon'|'construction_permit'|'vip_movement'|'other';
export type CrowdSize = 'Small'|'Medium'|'Large'|'Massive';
export type EventStatus = 'planned'|'active'|'completed';

export interface CongestionWindow {
  preBuildupMins: number;
  peakDurationMins: number;
  dispersalMins: number;
}

export interface TrafficEvent {
  id: string;
  name: string;
  type: EventType;
  venue: string;
  lat: number;
  lng: number;
  date: string;
  startTime: string;
  endTime: string;
  crowdSize: CrowdSize;
  affectedCorridors: string[];
  status: EventStatus;
  impactLevel?: ImpactLevel;
  predictedScore?: number;
  officersDeployed?: number;
  // Planning details (Gap 1 + 3)
  plannedOfficers?: number;
  predictedDelayStr?: string;
  predictedBarricades?: number;
  congestionWindow?: CongestionWindow;
  // Actual outcome (Gap 2 + 5 — learning loop)
  actualOfficers?: number;
  actualIncidents?: number;
  actualDelayMins?: number;
}
