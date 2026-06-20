import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import type { Incident, IncidentCause, IncidentStatus, Priority } from '../types';
import { MOCK_INCIDENTS } from '../data/mockIncidents';
import { useEvents } from './EventsContext';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

interface IncidentsContextValue {
  incidents: Incident[];
  addIncident: (incident: Incident) => void;
  updateIncident: (id: string, updates: Partial<Incident>) => void;
  filterByStatus: (status: IncidentStatus) => Incident[];
  filterByPriority: (priority: Priority) => Incident[];
  activeCount: number;
  highPriorityCount: number;
  resolvedToday: number;
  isLoading: boolean;
}

const IncidentsContext = createContext<IncidentsContextValue | null>(null);

// Map Supabase snake_case row → camelCase Incident type
function rowToIncident(row: Record<string, unknown>): Incident {
  return {
    id: row.id as string,
    cause: row.cause as IncidentCause,
    corridor: row.corridor as string,
    junction: (row.junction as string) || '',
    address: (row.address as string) || '',
    lat: (row.lat as number) || 12.9716,
    lng: (row.lng as number) || 77.5946,
    priority: (row.priority as Priority) || 'Medium',
    status: (row.status as IncidentStatus) || 'active',
    requiresRoadClosure: (row.requires_road_closure as boolean) || false,
    vehicleType: (row.vehicle_type as string) || undefined,
    vehicleNumber: (row.vehicle_number as string) || undefined,
    breakdownReason: (row.breakdown_reason as string) || undefined,
    description: (row.description as string) || '',
    direction: (row.direction as string) || '',
    timeOfIncident: (row.time_of_incident as string) || new Date().toISOString(),
    createdAt: (row.created_at as string) || new Date().toISOString(),
    updatedAt: (row.updated_at as string) || new Date().toISOString(),
    resolvedAt: row.resolved_at as string | undefined,
    resolutionTimeMin: row.resolution_time_min as number | undefined,
    impactScore: (row.impact_score as number) || 50,
    impactLevel: (row.impact_level as string) || 'Medium',
    officerNotes: (row.officer_notes as Incident['officerNotes']) || [],
  };
}

// Map camelCase Incident → Supabase snake_case insert payload
function incidentToRow(i: Incident): Record<string, unknown> {
  return {
    id: i.id,
    cause: i.cause,
    corridor: i.corridor,
    junction: i.junction || '',
    address: i.address || '',
    lat: i.lat,
    lng: i.lng,
    priority: i.priority,
    status: i.status,
    requires_road_closure: i.requiresRoadClosure,
    vehicle_type: i.vehicleType || '',
    vehicle_number: i.vehicleNumber || '',
    breakdown_reason: i.breakdownReason || '',
    description: i.description || '',
    direction: i.direction || '',
    time_of_incident: i.timeOfIncident,
    created_at: i.createdAt,
    updated_at: i.updatedAt,
    resolved_at: i.resolvedAt || null,
    resolution_time_min: i.resolutionTimeMin || null,
    impact_score: i.impactScore,
    impact_level: i.impactLevel,
    officer_notes: i.officerNotes || [],
  };
}

export function IncidentsProvider({ children }: { children: ReactNode }) {
  const { events } = useEvents();
  const [rawIncidents, setRawIncidents] = useState<Incident[]>(MOCK_INCIDENTS);
  const [isLoading, setIsLoading] = useState(false);

  // ── Load from Supabase on mount ────────────────────────────────────────────
  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) return;

    setIsLoading(true);
    supabase
      .from('incidents')
      .select('*')
      .order('created_at', { ascending: false })
      .then(({ data, error }) => {
        if (error) {
          console.warn('[Supabase] incidents load error — using mock data:', error.message);
        } else if (data && data.length > 0) {
          setRawIncidents(data.map(rowToIncident));
        } else {
          // Table empty — seed with mock data once
          console.info('[Supabase] incidents table empty — seeding with mock data');
          const rows = MOCK_INCIDENTS.map(incidentToRow);
          supabase.from('incidents').insert(rows).then(({ error: e }) => {
            if (e) console.warn('[Supabase] seed error:', e.message);
          });
          setRawIncidents(MOCK_INCIDENTS);
        }
        setIsLoading(false);
      });
  }, []);

  // ── Real-time subscription ─────────────────────────────────────────────────
  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) return;

    const channel = supabase
      .channel('incidents-live')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'incidents' },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setRawIncidents(prev => {
              if (prev.find(i => i.id === (payload.new as Record<string, unknown>).id)) return prev;
              return [rowToIncident(payload.new as Record<string, unknown>), ...prev];
            });
          } else if (payload.eventType === 'UPDATE') {
            setRawIncidents(prev =>
              prev.map(i => i.id === (payload.new as Record<string, unknown>).id
                ? rowToIncident(payload.new as Record<string, unknown>) : i)
            );
          }
        }
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  // ── Compute active event-based road closures ───────────────────────────────
  const activeEvents = events.filter(e => e.status === 'active');
  const eventIncidents: Incident[] = activeEvents.flatMap(evt =>
    evt.affectedCorridors.map(corridor => ({
      id: `INC-EVT-${evt.id}-${corridor.replace(/\s+/g, '-')}`,
      cause: (evt.type === 'vip_movement' ? 'vip_movement' : 'public_event') as IncidentCause,
      corridor,
      junction: '',
      address: evt.venue,
      lat: evt.lat,
      lng: evt.lng,
      priority: (evt.impactLevel || 'Medium') as Priority,
      status: 'active' as const,
      requiresRoadClosure: true,
      description: `Road closed due to active event: ${evt.name} at ${evt.venue}.`,
      direction: 'Both ways',
      timeOfIncident: `${evt.date}T${evt.startTime}:00`,
      createdAt: `${evt.date}T${evt.startTime}:00`,
      updatedAt: `${evt.date}T${evt.startTime}:00`,
      impactScore: evt.predictedScore || 80,
      impactLevel: evt.impactLevel || 'Medium',
      officerNotes: [],
    }))
  );

  const incidents = [...eventIncidents, ...rawIncidents];

  // ── addIncident — writes to Supabase then updates local state ──────────────
  const addIncident = useCallback((incident: Incident) => {
    setRawIncidents(prev => [incident, ...prev]);

    if (isSupabaseConfigured && supabase) {
      supabase
        .from('incidents')
        .insert(incidentToRow(incident))
        .then(({ error }) => {
          if (error) console.warn('[Supabase] insert incident error:', error.message);
        });
    }
  }, []);

  // ── updateIncident — updates Supabase and local state ─────────────────────
  const updateIncident = useCallback((id: string, updates: Partial<Incident>) => {
    setRawIncidents(prev => prev.map(i => i.id === id ? { ...i, ...updates } : i));

    if (isSupabaseConfigured && supabase) {
      const row: Record<string, unknown> = {};
      if (updates.status) row.status = updates.status;
      if (updates.resolvedAt !== undefined) row.resolved_at = updates.resolvedAt;
      if (updates.resolutionTimeMin !== undefined) row.resolution_time_min = updates.resolutionTimeMin;
      if (updates.officerNotes) row.officer_notes = updates.officerNotes;
      if (updates.priority) row.priority = updates.priority;
      if (Object.keys(row).length > 0) {
        supabase.from('incidents').update(row).eq('id', id)
          .then(({ error }) => {
            if (error) console.warn('[Supabase] update incident error:', error.message);
          });
      }
    }
  }, []);

  const filterByStatus = (status: IncidentStatus) => incidents.filter(i => i.status === status);
  const filterByPriority = (priority: Priority) => incidents.filter(i => i.priority === priority);
  const activeCount = incidents.filter(i => i.status === 'active').length;
  const highPriorityCount = incidents.filter(i => i.priority === 'High').length;
  const resolvedToday = incidents.filter(i => {
    if (!i.resolvedAt) return false;
    return new Date(i.resolvedAt).toDateString() === new Date().toDateString();
  }).length;

  return (
    <IncidentsContext.Provider value={{
      incidents, addIncident, updateIncident, filterByStatus, filterByPriority,
      activeCount, highPriorityCount, resolvedToday, isLoading,
    }}>
      {children}
    </IncidentsContext.Provider>
  );
}

export function useIncidentsContext() {
  const ctx = useContext(IncidentsContext);
  if (!ctx) throw new Error('useIncidentsContext must be used within IncidentsProvider');
  return ctx;
}
