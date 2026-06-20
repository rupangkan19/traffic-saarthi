import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import BangaloreMap from '../components/map/BangaloreMap';
import { Badge } from '../components/ui/Badge';
import { useToast } from '../components/ui/Toast';
import { useMLScore } from '../hooks/useMLScore';
import { useIncidents } from '../hooks/useIncidents';
import { useEvents } from '../context/EventsContext';
import { CORRIDORS } from '../data/corridors';
import { JUNCTIONS } from '../data/junctions';
import { estimateManpower } from '../utils/manpowerEstimator';
import type { IncidentCause, Incident, ImpactLevel } from '../types';

const CAUSES: { value: IncidentCause; label: string }[] = [
  { value: 'accident', label: 'Accident' },
  { value: 'vehicle_breakdown', label: 'Vehicle Breakdown' },
  { value: 'construction', label: 'Construction' },
  { value: 'water_logging', label: 'Water Logging' },
  { value: 'tree_fall', label: 'Tree Fall' },
  { value: 'public_event', label: 'Public Event' },
  { value: 'vip_movement', label: 'VIP Movement' },
  { value: 'pot_holes', label: 'Pot Holes' },
  { value: 'others', label: 'Others' },
];

function generateId() {
  return 'TSID' + String(Math.floor(10000 + Math.random() * 90000));
}

export default function LogIncident() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { getScore } = useMLScore();
  const { addIncident } = useIncidents();
  const { events } = useEvents();
  const [step, setStep] = useState(1);
  const [clickPin, setClickPin] = useState<{ lat: number; lng: number } | null>(null);

  const [form, setForm] = useState({
    cause: '' as IncidentCause | '',
    corridor: '',
    junction: '',
    address: '',
    direction: '',
    timeOfIncident: new Date().toISOString().slice(0, 16),
    vehicleType: '',
    vehicleNumber: '',
    breakdownReason: '',
    description: '',
    requiresRoadClosure: false,
    lat: 12.9716,
    lng: 77.5946,
  });

  const set = (key: string, val: unknown) => setForm(f => ({ ...f, [key]: val }));

  const scoreData = form.cause && form.corridor && form.timeOfIncident
    ? getScore(form.cause as IncidentCause, form.corridor, form.timeOfIncident, form.requiresRoadClosure)
    : null;

  const handleMapClick = (lat: number, lng: number) => {
    setClickPin({ lat, lng });
    set('lat', lat);
    set('lng', lng);
  };

  // Gap 4 — Nearby event detection for public_event / vip_movement causes
  const nearbyEvents = useMemo(() => {
    if (form.cause !== 'public_event' && form.cause !== 'vip_movement') return [];
    const today = new Date().toISOString().slice(0, 10);
    return events.filter(evt =>
      (evt.status === 'planned' || evt.status === 'active') &&
      (evt.date === today || Math.abs(new Date(evt.date).getTime() - Date.now()) < 3 * 24 * 60 * 60 * 1000) &&
      (form.corridor === '' || evt.affectedCorridors.some(c => c === form.corridor || form.corridor === ''))
    ).slice(0, 3);
  }, [form.cause, form.corridor, events]);

  const handleSubmit = (isDraft: boolean) => {
    const now = new Date().toISOString();
    const incident: Incident = {
      id: generateId(),
      cause: form.cause as IncidentCause,
      corridor: form.corridor,
      junction: form.junction,
      address: form.address,
      lat: form.lat,
      lng: form.lng,
      priority: scoreData?.level || 'Low',
      status: isDraft ? 'draft' : 'active',
      requiresRoadClosure: form.requiresRoadClosure,
      vehicleType: form.vehicleType || undefined,
      vehicleNumber: form.vehicleNumber || undefined,
      breakdownReason: form.breakdownReason || undefined,
      description: form.description,
      direction: form.direction,
      timeOfIncident: form.timeOfIncident,
      createdAt: now,
      updatedAt: now,
      impactScore: scoreData?.score || 0,
      impactLevel: scoreData?.level || 'Low',
      officerNotes: [],
    };
    addIncident(incident);
    showToast(isDraft ? `Draft saved as ${incident.id}` : `Incident ${incident.id} logged successfully`, 'success');
    navigate('/');
  };

  const labelClass = 'block text-[12px] font-medium text-[var(--text-secondary)] mb-1';
  const inputClass = 'w-full border border-[var(--border)] bg-[var(--input-bg)] rounded-[6px] px-3 py-2 text-[13px] text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)]';

  return (
    <div className="relative w-full" style={{ height: 'calc(100vh - 48px)' }}>
      {/* Map fills the entire content area */}
      <div className="absolute inset-0" style={{ zIndex: 0 }}>
        <BangaloreMap height="100%" interactive={true} onMapClick={handleMapClick} clickPin={clickPin} />
      </div>

      {/* Backdrop — darkens map behind panel */}
      <div
        className="fixed bg-black/20"
        style={{ top: 48, left: 240, right: 400, bottom: 0, zIndex: 40, pointerEvents: 'none' }}
      />

      {/* Slide-in panel — fixed so nothing clips it */}
      <div
        className="fixed top-0 right-0 bottom-0 bg-[var(--surface-2)] border-l border-[var(--border)] flex flex-col"
        style={{ width: 400, top: 48, zIndex: 50, boxShadow: '-2px 0 8px rgba(0,0,0,0.12)' }}
      >
        {/* Header */}
        <div className="px-5 py-4 border-b border-[var(--border)]">
          <div className="text-[15px] font-semibold text-[var(--text-primary)]">Log Incident</div>
          <div className="flex items-center gap-2 mt-2">
            {[1,2,3].map(s => (
              <div key={s} className="flex items-center gap-2">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-semibold ${step >= s ? 'bg-[var(--accent)] text-white' : 'bg-[var(--surface-3)] text-[var(--text-muted)] border border-[var(--border)]'}`}>{s}</div>
                {s < 3 && <div className={`h-0.5 w-8 ${step > s ? 'bg-[var(--accent)]' : 'bg-[var(--border)]'}`} />}
              </div>
            ))}
            <span className="ml-2 text-[12px] text-[var(--text-muted)]">Step {step}/3</span>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4">
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <label className={labelClass}>Cause *</label>
                <select className={inputClass} value={form.cause} onChange={e => set('cause', e.target.value)}>
                  <option value="">Select cause</option>
                  {CAUSES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                </select>
              </div>
              <div>
                <label className={labelClass}>Corridor *</label>
                <select className={inputClass} value={form.corridor} onChange={e => set('corridor', e.target.value)}>
                  <option value="">Select corridor</option>
                  {CORRIDORS.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className={labelClass}>Junction</label>
                <select className={inputClass} value={form.junction} onChange={e => set('junction', e.target.value)}>
                  <option value="">Select junction</option>
                  {JUNCTIONS.map(j => <option key={j} value={j}>{j}</option>)}
                </select>
              </div>
              <div>
                <label className={labelClass}>Address</label>
                <input className={inputClass} value={form.address} onChange={e => set('address', e.target.value)} placeholder="Street address" />
              </div>
              <div>
                <label className={labelClass}>Direction of Travel</label>
                <input className={inputClass} value={form.direction} onChange={e => set('direction', e.target.value)} placeholder="e.g. North to South" />
              </div>
              <div>
                <label className={labelClass}>Time of Incident *</label>
                <input type="datetime-local" className={inputClass} value={form.timeOfIncident} onChange={e => set('timeOfIncident', e.target.value)} />
              </div>
              <div className="text-[12px] text-[var(--nav-active-text)] bg-[var(--nav-active-bg)] border border-[var(--section-events-border)] rounded p-2">
                Click on the map to pin the incident location
              </div>

              {/* Gap 4 — Sudden gathering / nearby event alert */}
              {nearbyEvents.length > 0 && (
                <div style={{
                  background: 'rgba(211,84,0,0.06)',
                  border: '1px solid rgba(211,84,0,0.25)',
                  borderRadius: 8,
                  padding: '10px 12px',
                  marginTop: 4,
                }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--amber)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                    ⚠ Nearby Planned Events Detected
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginBottom: 8 }}>
                    This incident may be related to a planned event. Consider linking it:
                  </div>
                  {nearbyEvents.map(evt => (
                    <div key={evt.id} style={{
                      display: 'flex', alignItems: 'center', gap: 8,
                      padding: '6px 0', borderBottom: '1px solid rgba(211,84,0,0.12)',
                    }}>
                      <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--amber)', flexShrink: 0 }} />
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)' }}>{evt.name}</div>
                        <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{evt.date} · {evt.startTime}–{evt.endTime} · {evt.venue}</div>
                      </div>
                      <span style={{ fontSize: 10, fontWeight: 700, background: evt.status === 'active' ? 'rgba(39,174,96,0.12)' : 'rgba(211,84,0,0.10)', color: evt.status === 'active' ? 'var(--green)' : 'var(--amber)', padding: '2px 6px', borderRadius: 4 }}>
                        {evt.status.toUpperCase()}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div>
                <label className={labelClass}>Vehicle Type</label>
                <select className={inputClass} value={form.vehicleType} onChange={e => set('vehicleType', e.target.value)}>
                  <option value="">Not applicable</option>
                  {['Car','Motorcycle','Bus','Truck','Auto','Other'].map(v => <option key={v} value={v}>{v}</option>)}
                </select>
              </div>
              {form.vehicleType && (
                <div>
                  <label className={labelClass}>Vehicle Number</label>
                  <input className={inputClass} value={form.vehicleNumber} onChange={e => set('vehicleNumber', e.target.value)} placeholder="KA01AB1234" />
                </div>
              )}
              {form.cause === 'vehicle_breakdown' && (
                <div>
                  <label className={labelClass}>Breakdown Reason</label>
                  <input className={inputClass} value={form.breakdownReason} onChange={e => set('breakdownReason', e.target.value)} placeholder="e.g. Engine failure" />
                </div>
              )}
              <div>
                <label className={labelClass}>Description *</label>
                <textarea
                  className={`${inputClass} resize-none`}
                  rows={4}
                  value={form.description}
                  onChange={e => set('description', e.target.value)}
                  placeholder="Describe the incident..."
                />
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="roadClosure"
                  checked={form.requiresRoadClosure}
                  onChange={e => set('requiresRoadClosure', e.target.checked)}
                  className="w-4 h-4"
                />
                <label htmlFor="roadClosure" className="text-[13px] text-[var(--text-primary)]">Requires Road Closure</label>
              </div>
            </div>
          )}

          {step === 3 && scoreData && (
            <div className="space-y-4">
              <div className="text-[14px] font-semibold text-[var(--text-primary)] mb-3">Impact Assessment</div>

              {/* Impact bars */}
              {[
                { label: 'Overall Impact', value: scoreData.score },
                { label: 'Traffic Severity', value: Math.round(scoreData.score * 0.85) },
                { label: 'Resolution Urgency', value: Math.round(scoreData.score * 0.9) },
              ].map(bar => (
                <div key={bar.label}>
                  <div className="flex justify-between text-[12px] text-[var(--text-secondary)] mb-1">
                    <span>{bar.label}</span>
                    <span className="font-medium text-[var(--text-primary)]">{bar.value}/100</span>
                  </div>
                  <div className="h-2 bg-[var(--surface-3)] rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${bar.value}%`,
                        background: bar.value >= 80 ? 'var(--red)' : bar.value >= 50 ? 'var(--amber)' : 'var(--green)'
                      }}
                    />
                  </div>
                </div>
              ))}

              <div className="flex items-center gap-2 mt-3">
                <span className="text-[13px] text-[var(--text-secondary)]">Impact Level:</span>
                <Badge variant={scoreData.level.toLowerCase() as 'high'|'medium'|'low'}>{scoreData.level}</Badge>
              </div>

              <div className="bg-[var(--surface-3)] rounded-[6px] p-3 space-y-2">
                <div className="flex justify-between text-[13px]">
                  <span className="text-[var(--text-secondary)]">Est. Clearance</span>
                  <span className="font-medium text-[var(--text-primary)]">{scoreData.clearance}</span>
                </div>
                <div className="flex justify-between text-[13px]">
                  <span className="text-[var(--text-secondary)]">Manpower</span>
                  <span className="font-medium text-[var(--text-primary)] text-right text-[12px]">{estimateManpower(scoreData.level as ImpactLevel, form.requiresRoadClosure)}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-4 border-t border-[var(--border)] flex gap-3">
          {step > 1 && (
            <button
              onClick={() => setStep(s => s - 1)}
              className="px-4 py-2 text-[13px] border border-[var(--border)] rounded-[6px] text-[var(--text-secondary)] hover:bg-[var(--surface-3)]"
            >Back</button>
          )}
          {step < 3 && (
            <button
              onClick={() => setStep(s => s + 1)}
              className="flex-1 px-4 py-2 text-[13px] bg-[var(--accent)] text-white rounded-[6px] hover:bg-[var(--accent-hover)] font-medium"
              disabled={!form.cause || !form.corridor}
            >Next</button>
          )}
          {step === 3 && (
            <>
              <button
                onClick={() => handleSubmit(false)}
                className="flex-1 px-4 py-2 text-[13px] bg-[var(--accent)] text-white rounded-[6px] hover:bg-[var(--accent-hover)] font-medium"
              >Submit Incident</button>
              <button
                onClick={() => handleSubmit(true)}
                className="px-4 py-2 text-[13px] border border-[var(--border)] rounded-[6px] text-[var(--text-secondary)] hover:bg-[var(--surface-3)]"
              >Save Draft</button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
