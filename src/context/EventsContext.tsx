import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import type { TrafficEvent, EventStatus } from '../types';
import { MOCK_EVENTS } from '../data/mockEvents';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

type LearningMap = Record<string, number>;
const LEARNING_KEY = 'ts_event_learning_v1';

function loadLearning(): LearningMap {
  try { return JSON.parse(localStorage.getItem(LEARNING_KEY) || '{}'); }
  catch { return {}; }
}

function rowToEvent(row: Record<string, unknown>): TrafficEvent {
  return {
    id: row.id as string,
    name: row.name as string,
    type: row.type as TrafficEvent['type'],
    venue: (row.venue as string) || '',
    lat: (row.lat as number) || 12.9716,
    lng: (row.lng as number) || 77.5946,
    date: row.date as string,
    startTime: row.start_time as string,
    endTime: row.end_time as string,
    crowdSize: (row.crowd_size as TrafficEvent['crowdSize']) || 'Medium',
    affectedCorridors: (row.affected_corridors as string[]) || [],
    status: (row.status as EventStatus) || 'planned',
    impactLevel: row.impact_level as TrafficEvent['impactLevel'],
    predictedScore: row.predicted_score as number | undefined,
    officersDeployed: row.officers_deployed as number | undefined,
    plannedOfficers: row.planned_officers as number | undefined,
    predictedDelayStr: row.predicted_delay_str as string | undefined,
    predictedBarricades: row.predicted_barricades as number | undefined,
    congestionWindow: row.congestion_window as TrafficEvent['congestionWindow'],
    actualOfficers: row.actual_officers as number | undefined,
    actualIncidents: row.actual_incidents as number | undefined,
    actualDelayMins: row.actual_delay_mins as number | undefined,
  };
}

function eventToRow(e: TrafficEvent): Record<string, unknown> {
  return {
    id: e.id,
    name: e.name,
    type: e.type,
    venue: e.venue || '',
    lat: e.lat,
    lng: e.lng,
    date: e.date,
    start_time: e.startTime,
    end_time: e.endTime,
    crowd_size: e.crowdSize,
    affected_corridors: e.affectedCorridors,
    status: e.status,
    impact_level: e.impactLevel || 'Medium',
    predicted_score: e.predictedScore || 50,
    officers_deployed: e.officersDeployed || 0,
    planned_officers: e.plannedOfficers || 0,
    predicted_delay_str: e.predictedDelayStr || '',
    predicted_barricades: e.predictedBarricades || 0,
    congestion_window: e.congestionWindow || null,
    actual_officers: e.actualOfficers || null,
    actual_incidents: e.actualIncidents || null,
    actual_delay_mins: e.actualDelayMins || null,
  };
}

interface EventsContextValue {
  events: TrafficEvent[];
  addEvent: (evt: TrafficEvent) => void;
  updateEvent: (id: string, patch: Partial<TrafficEvent>) => void;
  recordActualOutcome: (id: string, actualOfficers: number, actualIncidents: number, actualDelayMins: number) => void;
  getLearningCorrection: (eventType: string, venue: string) => number;
}

const EventsContext = createContext<EventsContextValue | null>(null);

export function EventsProvider({ children }: { children: ReactNode }) {
  const [rawEvents, setRawEvents] = useState<TrafficEvent[]>(MOCK_EVENTS);
  const [events, setEvents] = useState<TrafficEvent[]>(MOCK_EVENTS);
  const [learning, setLearning] = useState<LearningMap>(loadLearning);

  // ── Load from Supabase on mount ────────────────────────────────────────────
  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) return;

    supabase
      .from('events')
      .select('*')
      .order('created_at', { ascending: false })
      .then(({ data, error }) => {
        if (error) {
          console.warn('[Supabase] events load error — using mock data:', error.message);
        } else if (data && data.length > 0) {
          setRawEvents(data.map(rowToEvent));
        } else {
          // Seed mock events into Supabase on first run
          const rows = MOCK_EVENTS.map(eventToRow);
          if (supabase) {
            supabase.from('events').insert(rows).then(({ error: e }) => {
              if (e) console.warn('[Supabase] events seed error:', e.message);
            });
          }
          setRawEvents(MOCK_EVENTS);
        }
      });
  }, []);

  const addEvent = useCallback((evt: TrafficEvent) => {
    setRawEvents(prev => [...prev, evt]);
    if (isSupabaseConfigured && supabase) {
      supabase.from('events').insert(eventToRow(evt))
        .then(({ error }) => { if (error) console.warn('[Supabase] insert event:', error.message); });
    }
  }, []);

  const updateEvent = useCallback((id: string, patch: Partial<TrafficEvent>) => {
    setRawEvents(prev => prev.map(e => e.id === id ? { ...e, ...patch } : e));
    if (isSupabaseConfigured && supabase) {
      const row: Record<string, unknown> = {};
      if (patch.status) row.status = patch.status;
      if (patch.actualOfficers !== undefined) row.actual_officers = patch.actualOfficers;
      if (patch.actualIncidents !== undefined) row.actual_incidents = patch.actualIncidents;
      if (patch.actualDelayMins !== undefined) row.actual_delay_mins = patch.actualDelayMins;
      if (Object.keys(row).length > 0) {
        supabase.from('events').update(row).eq('id', id)
          .then(({ error }) => { if (error) console.warn('[Supabase] update event:', error.message); });
      }
    }
  }, []);

  const recordActualOutcome = useCallback((
    id: string,
    actualOfficers: number,
    actualIncidents: number,
    actualDelayMins: number
  ) => {
    setRawEvents(prev => {
      const event = prev.find(e => e.id === id);
      if (!event) return prev;
      const predictedScore = event.predictedScore ?? 50;
      const actualScore = Math.min(100, Math.round(
        (actualIncidents * 20) + (actualDelayMins / 3) +
        (actualOfficers > (event.officersDeployed ?? 20) ? 10 : 0)
      ));
      const correction = actualScore > 0 && predictedScore > 0
        ? Math.max(0.5, Math.min(2.0, actualScore / predictedScore)) : 1.0;
      const key = `${event.type}_${event.venue.slice(0, 20)}`;
      const newLearning = { ...learning, [key]: correction };
      setLearning(newLearning);
      localStorage.setItem(LEARNING_KEY, JSON.stringify(newLearning));
      return prev.map(e => e.id === id ? {
        ...e, status: 'completed' as EventStatus, actualOfficers, actualIncidents, actualDelayMins,
      } : e);
    });

    if (isSupabaseConfigured && supabase) {
      supabase.from('events').update({
        status: 'completed', actual_officers: actualOfficers,
        actual_incidents: actualIncidents, actual_delay_mins: actualDelayMins,
      }).eq('id', id).then(({ error }) => {
        if (error) console.warn('[Supabase] recordActualOutcome error:', error.message);
      });
    }
  }, [learning]);

  const getLearningCorrection = useCallback((eventType: string, venue: string): number => {
    const key = `${eventType}_${venue.slice(0, 20)}`;
    return learning[key] ?? 1.0;
  }, [learning]);

  // ── Status auto-update (time-based) ───────────────────────────────────────
  useEffect(() => {
    const updateEventStatuses = () => {
      const now = new Date();
      const currentDateStr = now.toISOString().slice(0, 10);
      const currentMin = now.getHours() * 60 + now.getMinutes();

      const updated = rawEvents.map(evt => {
        let status: EventStatus = evt.status;
        if (evt.date === currentDateStr) {
          const [startH, startM] = evt.startTime.split(':').map(Number);
          const [endH, endM] = evt.endTime.split(':').map(Number);
          const startMin = startH * 60 + startM;
          const endMin = endH * 60 + endM;
          if (currentMin >= startMin && currentMin <= endMin) status = 'active';
          else if (currentMin > endMin) status = 'completed';
          else status = 'planned';
        } else if (evt.date < currentDateStr) {
          status = 'completed';
        } else {
          status = 'planned';
        }
        return { ...evt, status };
      });
      setEvents(updated);
    };

    updateEventStatuses();
    const interval = setInterval(updateEventStatuses, 1000);
    return () => clearInterval(interval);
  }, [rawEvents]);

  return (
    <EventsContext.Provider value={{ events, addEvent, updateEvent, recordActualOutcome, getLearningCorrection }}>
      {children}
    </EventsContext.Provider>
  );
}

export function useEvents() {
  const ctx = useContext(EventsContext);
  if (!ctx) throw new Error('useEvents must be used within EventsProvider');
  return ctx;
}
