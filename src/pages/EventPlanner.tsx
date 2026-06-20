import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import BangaloreMap from '../components/map/BangaloreMap';
import { useToast } from '../components/ui/Toast';
import { CORRIDORS } from '../data/corridors';
import { JUNCTIONS } from '../data/junctions';
import type { EventType, CrowdSize } from '../types';
import { useEvents } from '../context/EventsContext';
import { computeEventImpact } from '../utils/eventImpactScorer';

const EVENT_TYPES: { value: EventType; label: string }[] = [
  { value: 'cricket_match', label: 'Cricket Match' },
  { value: 'political_rally', label: 'Political Rally' },
  { value: 'kambala', label: 'Kambala' },
  { value: 'concert', label: 'Concert' },
  { value: 'religious_procession', label: 'Religious Procession' },
  { value: 'marathon', label: 'Marathon' },
  { value: 'construction_permit', label: 'Construction Permit' },
  { value: 'vip_movement', label: 'VIP Movement' },
  { value: 'other', label: 'Other' },
];

interface DeployRow {
  junction: string;
  officers: number;
  role: string;
}

export default function EventPlanner() {
  const { showToast } = useToast();
  const navigate = useNavigate();
  const { events, addEvent, getLearningCorrection } = useEvents();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    name: '',
    type: '' as EventType | '',
    venue: '',
    date: '',
    startTime: '09:00',
    endTime: '18:00',
    crowdSize: '' as CrowdSize | '',
    affectedCorridors: [] as string[],
  });
  const [deployment, setDeployment] = useState<DeployRow[]>(
    JUNCTIONS.slice(0, 5).map(j => ({ junction: j, officers: 4, role: 'Traffic Control' }))
  );

  const set = (key: string, val: unknown) => setForm(f => ({ ...f, [key]: val }));
  const toggleCorridor = (c: string) =>
    setForm(f => ({
      ...f,
      affectedCorridors: f.affectedCorridors.includes(c)
        ? f.affectedCorridors.filter(x => x !== c)
        : [...f.affectedCorridors, c]
    }));

  const totalOfficers = deployment.reduce((s, r) => s + r.officers, 0);

  // Compute live impact score using historical scorer
  const impact = useMemo(() => {
    if (!form.type || !form.crowdSize || !form.startTime) return null;
    const correction = form.type && form.venue
      ? getLearningCorrection(form.type, form.venue)
      : 1.0;
    return computeEventImpact(
      form.type,
      form.crowdSize,
      form.startTime,
      form.affectedCorridors,
      form.date || new Date().toISOString().slice(0, 10),
      correction
    );
  }, [form.type, form.crowdSize, form.startTime, form.affectedCorridors, form.date, form.venue, getLearningCorrection]);

  // Auto-update officer counts when impact changes
  const handleProceedToStep3 = () => {
    if (impact) {
      const perJunction = Math.ceil(impact.recommendedOfficers / 5);
      setDeployment(JUNCTIONS.slice(0, 5).map((j, i) => ({
        junction: j,
        officers: i === 0 ? Math.ceil(perJunction * 1.3) : perJunction,
        role: ['Entry/Exit Control', 'Traffic Control', 'Parking Management', 'Crowd Dispersal', 'Diversion Point'][i],
      })));
    }
    setStep(3);
  };

  const scoreColor = !impact ? 'var(--text-muted)'
    : impact.score >= 75 ? 'var(--red)'
    : impact.score >= 50 ? 'var(--amber)'
    : 'var(--green)';

  const inputClass = 'w-full border border-[var(--border)] bg-[var(--input-bg)] rounded-[6px] px-3 py-2 text-[13px] text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)]';
  const labelClass = 'block text-[12px] font-medium text-[var(--text-secondary)] mb-1';

  return (
    <div className="relative w-full" style={{ height: 'calc(100vh - 48px)' }}>
      <div className="absolute inset-0" style={{ zIndex: 0 }}>
        <BangaloreMap
          height="100%"
          interactive={true}
          affectedCorridors={form.affectedCorridors}
        />
      </div>
      <div
        className="fixed bg-black/20"
        style={{ top: 48, left: 240, right: 420, bottom: 0, zIndex: 40, pointerEvents: 'none' }}
      />

      <div
        className="fixed right-0 bottom-0 bg-[var(--surface-2)] border-l border-[var(--border)] flex flex-col"
        style={{ width: 420, top: 48, zIndex: 50, boxShadow: '-2px 0 8px rgba(0,0,0,0.12)' }}
      >
        <div className="px-5 py-4 border-b border-[var(--border)]">
          <div className="text-[15px] font-semibold text-[var(--text-primary)]">Plan Event</div>
          <div className="flex items-center gap-2 mt-2">
            {[1,2,3].map(s => (
              <div key={s} className="flex items-center gap-2">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-semibold ${step >= s ? 'bg-[var(--accent)] text-white' : 'bg-[var(--surface-3)] text-[var(--text-muted)] border border-[var(--border)]'}`}>{s}</div>
                {s < 3 && <div className={`h-0.5 w-8 ${step > s ? 'bg-[var(--accent)]' : 'bg-[var(--border)]'}`} />}
              </div>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4">
          {/* ── Step 1: Event Details ── */}
          {step === 1 && (
            <div className="space-y-4">
              <div><label className={labelClass}>Event Name *</label><input className={inputClass} value={form.name} onChange={e => set('name', e.target.value)} placeholder="IPL 2024 - RCB vs MI" /></div>
              <div>
                <label className={labelClass}>Event Type *</label>
                <select className={inputClass} value={form.type} onChange={e => set('type', e.target.value)}>
                  <option value="">Select type</option>
                  {EVENT_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                </select>
              </div>
              <div><label className={labelClass}>Venue</label><input className={inputClass} value={form.venue} onChange={e => set('venue', e.target.value)} placeholder="Chinnaswamy Stadium" /></div>
              <div><label className={labelClass}>Date</label><input type="date" className={inputClass} value={form.date} onChange={e => set('date', e.target.value)} /></div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className={labelClass}>Start Time</label><input type="time" className={inputClass} value={form.startTime} onChange={e => set('startTime', e.target.value)} /></div>
                <div><label className={labelClass}>End Time</label><input type="time" className={inputClass} value={form.endTime} onChange={e => set('endTime', e.target.value)} /></div>
              </div>
              <div>
                <label className={labelClass}>Crowd Size</label>
                <select className={inputClass} value={form.crowdSize} onChange={e => set('crowdSize', e.target.value)}>
                  <option value="">Select crowd size</option>
                  {['Small','Medium','Large','Massive'].map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>

              {/* Live impact preview (Gap 1) */}
              {impact && (
                <div style={{
                  background: 'var(--surface-3)',
                  border: '1px solid var(--border)',
                  borderRadius: 8,
                  padding: '12px 14px',
                }}>
                  <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 8 }}>Impact Forecast</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                    <div style={{
                      fontSize: 28, fontWeight: 700, color: scoreColor, lineHeight: 1,
                    }}>{impact.score}</div>
                    <div>
                      <div style={{ fontSize: 12, fontWeight: 600, color: scoreColor }}>{impact.impactLevel} Impact</div>
                      <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Predicted delay: {impact.predictedDelay}</div>
                    </div>
                  </div>
                  {/* Score bar */}
                  <div style={{ height: 6, background: 'var(--border)', borderRadius: 3, overflow: 'hidden', marginBottom: 10 }}>
                    <div style={{ height: '100%', width: `${impact.score}%`, background: scoreColor, borderRadius: 3, transition: 'width 0.4s ease' }} />
                  </div>
                  {/* Breakdown */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px 12px' }}>
                    {[
                      { label: 'Event Type', value: `+${impact.scoreBreakdown.typeBase}` },
                      { label: 'Corridor Weight', value: `+${impact.scoreBreakdown.corridorBonus}` },
                      { label: 'Crowd Size', value: `+${impact.scoreBreakdown.crowdBonus}` },
                      { label: 'Peak Hour', value: `+${impact.scoreBreakdown.peakHourBonus}` },
                    ].map(row => (
                      <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--text-secondary)', padding: '2px 0' }}>
                        <span>{row.label}</span>
                        <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{row.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ── Step 2: Corridors ── */}
          {step === 2 && (
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 4 }}>Select Affected Corridors</div>
              {impact && (
                <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 12 }}>
                  More corridors selected → higher impact score
                </div>
              )}
              <div className="space-y-2">
                {CORRIDORS.map(c => (
                  <label key={c} className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form.affectedCorridors.includes(c)}
                      onChange={() => toggleCorridor(c)}
                      className="w-4 h-4"
                    />
                    <span className="text-[13px] text-[var(--text-primary)]">{c}</span>
                    {CORRIDOR_WEIGHT_LABEL[c] && (
                      <span style={{ marginLeft: 'auto', fontSize: 10, color: 'var(--text-muted)', fontWeight: 600 }}>
                        {CORRIDOR_WEIGHT_LABEL[c]}
                      </span>
                    )}
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* ── Step 3: Deployment ── */}
          {step === 3 && (
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 10 }}>Deployment Plan</div>

              {/* Impact summary strip */}
              {impact && (
                <div style={{
                  background: 'var(--surface-3)',
                  border: '1px solid var(--border)',
                  borderRadius: 8,
                  padding: '10px 14px',
                  marginBottom: 14,
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, 1fr)',
                  gap: 8,
                }}>
                  {[
                    { label: 'Impact Score', value: String(impact.score), color: scoreColor },
                    { label: 'Rec. Officers', value: String(impact.recommendedOfficers), color: 'var(--green)' },
                    { label: 'Barricades', value: String(impact.barricadesNeeded), color: 'var(--amber)' },
                  ].map(s => (
                    <div key={s.label} style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: 18, fontWeight: 700, color: s.color }}>{s.value}</div>
                      <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 1 }}>{s.label}</div>
                    </div>
                  ))}
                </div>
              )}

              <div className="mb-3 text-[12px] text-[var(--nav-active-text)] bg-[var(--nav-active-bg)] border border-[var(--section-events-border)] rounded p-2">
                Total Officers: <span className="font-semibold text-[var(--accent)]">{totalOfficers}</span>
                {impact && totalOfficers < impact.recommendedOfficers && (
                  <span style={{ marginLeft: 8, color: 'var(--amber)', fontSize: 11 }}>
                    ⚠ Below recommended ({impact.recommendedOfficers})
                  </span>
                )}
              </div>

              <table className="w-full text-[12px]">
                <thead>
                  <tr className="border-b border-[var(--border)]">
                    <th className="text-left py-2 text-[var(--text-secondary)] font-medium">Junction</th>
                    <th className="text-center py-2 text-[var(--text-secondary)] font-medium">Officers</th>
                    <th className="text-left py-2 text-[var(--text-secondary)] font-medium">Role</th>
                  </tr>
                </thead>
                <tbody>
                  {deployment.map((row, i) => (
                    <tr key={i} className="border-b border-[var(--border)]">
                      <td className="py-2 text-[var(--text-primary)] text-[11px]">{row.junction}</td>
                      <td className="py-2 text-center">
                        <input
                          type="number"
                          min={1}
                          className="w-12 border border-[var(--border)] bg-[var(--input-bg)] text-[var(--text-primary)] rounded px-1 py-0.5 text-center text-[12px]"
                          value={row.officers}
                          onChange={e => setDeployment(d => d.map((r, j) => j === i ? { ...r, officers: Number(e.target.value) } : r))}
                        />
                      </td>
                      <td className="py-2 text-[var(--text-secondary)]">{row.role}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Congestion window preview */}
              {impact && (
                <div style={{ marginTop: 16, padding: '12px 14px', background: 'var(--surface-3)', border: '1px solid var(--border)', borderRadius: 8 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 8 }}>Congestion Window</div>
                  <div style={{ display: 'flex', gap: 0, borderRadius: 4, overflow: 'hidden', height: 20, marginBottom: 6 }}>
                    {impact.congestionWindow.preBuildupMins > 0 && (
                      <div style={{ flex: impact.congestionWindow.preBuildupMins, background: 'rgba(211,84,0,0.35)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, color: 'var(--amber)', fontWeight: 600 }}>
                        Pre
                      </div>
                    )}
                    <div style={{ flex: impact.congestionWindow.peakDurationMins, background: 'rgba(176,58,46,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, color: 'var(--red)', fontWeight: 700 }}>
                      Peak
                    </div>
                    <div style={{ flex: impact.congestionWindow.dispersalMins, background: 'rgba(211,84,0,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, color: 'var(--text-muted)', fontWeight: 600 }}>
                      Tail
                    </div>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: 'var(--text-muted)' }}>
                    <span>−{impact.congestionWindow.preBuildupMins}min</span>
                    <span>Event</span>
                    <span>+{impact.congestionWindow.dispersalMins}min</span>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="px-5 py-4 border-t border-[var(--border)] flex gap-3">
          {step > 1 && <button onClick={() => setStep(s => s-1)} className="px-4 py-2 text-[13px] border border-[var(--border)] rounded-[6px] text-[var(--text-secondary)] hover:bg-[var(--surface-3)]">Back</button>}
          {step < 3 && (
            <button
              onClick={() => step === 2 ? handleProceedToStep3() : setStep(s => s+1)}
              className="flex-1 px-4 py-2 text-[13px] bg-[var(--accent)] text-white rounded-[6px] hover:bg-[var(--accent-hover)] font-medium"
            >Next</button>
          )}
          {step === 3 && (
            <>
              <button
                onClick={() => {
                  const newEvent = {
                    id: `EVT0${events.length + 1}`,
                    name: form.name || 'Planned Event',
                    type: (form.type || 'other') as any,
                    venue: form.venue || 'Unknown Venue',
                    lat: 12.9716,
                    lng: 77.5946,
                    date: form.date || new Date().toISOString().slice(0, 10),
                    startTime: form.startTime,
                    endTime: form.endTime,
                    crowdSize: (form.crowdSize || 'Medium') as any,
                    affectedCorridors: form.affectedCorridors,
                    status: 'planned' as const,
                    impactLevel: (impact?.impactLevel ?? 'Medium') as any,
                    predictedScore: impact?.score ?? 55,
                    officersDeployed: totalOfficers,
                    plannedOfficers: totalOfficers,
                    predictedDelayStr: impact?.predictedDelay,
                    predictedBarricades: impact?.barricadesNeeded,
                    congestionWindow: impact?.congestionWindow,
                  };
                  addEvent(newEvent);
                  showToast('Deployment plan saved', 'success');
                  navigate('/today-plan');
                }}
                className="flex-1 px-4 py-2 text-[13px] bg-[var(--accent)] text-white rounded-[6px] hover:bg-[var(--accent-hover)] font-medium"
              >
                Save Plan
              </button>
              <button onClick={() => showToast('Exported as PDF', 'info')} className="px-4 py-2 text-[13px] border border-[var(--border)] rounded-[6px] text-[var(--text-secondary)] hover:bg-[var(--surface-3)]">Export</button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// Corridor weight labels for display
const CORRIDOR_WEIGHT_LABEL: Record<string, string> = {
  'Airport Road': 'Very High',
  'ORR East 2': 'Very High',
  'CBD 1': 'High',
  'CBD 2': 'High',
  'Hosur Road': 'High',
  'Bellary Road 2': 'High',
  'Tumkur Road': 'High',
  'Hennur Road': 'High',
  'Mysore Road': 'Medium',
  'ORR East 1': 'Medium',
  'ORR North 1': 'Medium',
};
