import { useState, type ReactNode } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import { useEvents } from '../context/EventsContext';
import { useIncidents } from '../hooks/useIncidents';
import { Badge } from '../components/ui/Badge';
import { computeEventImpact } from '../utils/eventImpactScorer';

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="bg-[var(--card-bg)] border border-[var(--border)] rounded-[6px] p-5 mb-4" style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
      <div className="text-[13px] font-semibold text-[var(--text-primary)] mb-3 pb-2 border-b border-[var(--border)]">{title}</div>
      {children}
    </div>
  );
}

function DeltaBadge({ delta, unit = '', invert = false }: { delta: number; unit?: string; invert?: boolean }) {
  const isPositive = invert ? delta < 0 : delta > 0;
  const color = delta === 0 ? 'var(--text-muted)'
    : isPositive ? 'var(--red)' : 'var(--green)';
  const bg = delta === 0 ? 'var(--surface-3)'
    : isPositive ? 'rgba(176,58,46,0.10)' : 'rgba(39,174,96,0.10)';
  const prefix = delta > 0 ? '+' : '';
  return (
    <span style={{
      fontSize: 11, fontWeight: 700, color, background: bg,
      padding: '2px 7px', borderRadius: 4,
    }}>
      {prefix}{delta}{unit}
    </span>
  );
}

export default function EventDebrief() {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const { events, recordActualOutcome } = useEvents();
  const { incidents } = useIncidents();
  const event = events.find(e => e.id === `EVT00${eventId}` || e.id === eventId || e.id === `EVT0${eventId}`);

  const [actualOfficers, setActualOfficers] = useState('');
  const [actualDelayMins, setActualDelayMins] = useState('');
  const [outcomeRecorded, setOutcomeRecorded] = useState(false);

  if (!event) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="text-[20px] font-semibold text-[var(--text-primary)]">Event Not Found</div>
          <button onClick={() => navigate('/')} className="mt-4 px-4 py-2 bg-[var(--accent)] text-white rounded-[6px] text-[13px] hover:bg-[var(--accent-hover)]">Back</button>
        </div>
      </div>
    );
  }

  // Re-compute impact using scorer for consistency
  const impact = computeEventImpact(
    event.type,
    event.crowdSize,
    event.startTime,
    event.affectedCorridors,
    event.date,
  );

  const linkedIncidents = incidents.filter(i =>
    event.affectedCorridors.includes(i.corridor) &&
    i.timeOfIncident.startsWith(event.date.slice(0, 7))
  ).slice(0, 6);

  const deploymentData = [
    { junction: 'Main Gate', officers: Math.ceil((event.officersDeployed || 20) * 0.3), role: 'VIP / Entry Control' },
    { junction: 'Nearby Signal 1', officers: Math.ceil((event.officersDeployed || 20) * 0.25), role: 'Traffic Control' },
    { junction: 'Parking Zone', officers: Math.ceil((event.officersDeployed || 20) * 0.2), role: 'Parking Management' },
    { junction: 'Exit Route', officers: Math.ceil((event.officersDeployed || 20) * 0.25), role: 'Crowd Dispersal' },
  ];

  // ── Congestion Timeline Data for Area Chart ─────────────────────────────
  const { preBuildupMins, peakDurationMins, dispersalMins } = impact.congestionWindow;
  const totalMins = preBuildupMins + peakDurationMins + dispersalMins;

  const [startH, startM] = event.startTime.split(':').map(Number);
  const startMinTotal = startH * 60 + startM;
  const [endH, endM] = event.endTime.split(':').map(Number);
  const endMinTotal = endH * 60 + endM;

  const timelineData = [
    { time: 'Normal', level: 15, label: 'Before' },
    { time: `−${preBuildupMins}m`, level: 35, label: 'Build-up' },
    { time: event.startTime, level: 70, label: 'Event Start' },
    { time: 'Peak', level: 100, label: 'Peak' },
    { time: event.endTime, level: 85, label: 'Event End' },
    { time: `+${Math.round(dispersalMins / 2)}m`, level: 50, label: 'Dispersal' },
    { time: `+${dispersalMins}m`, level: 20, label: 'Normalising' },
    { time: 'Clear', level: 10, label: 'Clear' },
  ];

  // ── Plan vs Actual Delta ─────────────────────────────────────────────────
  const actualO = Number(actualOfficers) || (event as any).actualOfficers || null;
  const actualD = Number(actualDelayMins) || (event as any).actualDelayMins || null;
  const actualI = (event as any).actualIncidents ?? linkedIncidents.length;
  const plannedO = event.officersDeployed ?? 0;
  const plannedD = impact.congestionWindow.peakDurationMins;
  const predictedScore = event.predictedScore ?? impact.score;

  const handleRecordOutcome = () => {
    if (actualO && actualD) {
      recordActualOutcome(event.id, actualO, actualI, actualD);
      setOutcomeRecorded(true);
    }
  };

  // Learning correction this event produced
  const corrFactor = actualO && predictedScore
    ? Math.min(2, Math.max(0.5, (actualO / (plannedO || 1)))).toFixed(2)
    : null;

  return (
    <div className="overflow-y-auto h-full" style={{ background: 'var(--bg)' }}>
      <div className="max-w-3xl mx-auto px-6 py-6">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-[13px] text-[var(--text-secondary)] hover:text-[var(--accent)] mb-4">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
          Back
        </button>

        {/* ── Event Overview ── */}
        <Section title="Event Overview">
          <div className="flex items-start justify-between mb-3">
            <div>
              <div className="text-[20px] font-semibold text-[var(--text-primary)]">{event.name}</div>
              <div className="text-[13px] text-[var(--text-secondary)] mt-1">{event.venue}</div>
              <div className="text-[12px] text-[var(--text-muted)] mt-0.5">{event.date} · {event.startTime}–{event.endTime}</div>
            </div>
            <div className="flex gap-2 flex-col items-end">
              <Badge variant={event.status === 'completed' ? 'closed' : event.status === 'active' ? 'active' : 'planned'}>{event.status}</Badge>
              {event.impactLevel && <Badge variant={event.impactLevel.toLowerCase() as 'high'|'medium'|'low'}>{event.impactLevel} Impact</Badge>}
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3 mt-4">
            {[
              { label: 'Impact Score', value: event.predictedScore || impact.score, color: impact.score >= 75 ? 'var(--red)' : impact.score >= 50 ? 'var(--amber)' : 'var(--green)' },
              { label: 'Officers Deployed', value: event.officersDeployed || 0, color: 'var(--accent)' },
              { label: 'Crowd Size', value: event.crowdSize, color: 'var(--text-primary)' },
            ].map(s => (
              <div key={s.label} style={{ background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: 6, padding: '12px', textAlign: 'center' }}>
                <div style={{ fontSize: 22, fontWeight: 700, color: s.color, lineHeight: 1 }}>{s.value}</div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </Section>

        {/* ── Congestion Timeline (Gap 3) ── */}
        <Section title="Congestion Forecast Timeline">
          <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 12 }}>
            Predicted traffic congestion level (%) across the event window — from pre-event build-up to post-event dispersal.
          </div>
          <ResponsiveContainer width="100%" height={160}>
            <AreaChart data={timelineData} margin={{ top: 5, right: 8, left: -28, bottom: 0 }}>
              <defs>
                <linearGradient id="congGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--red)" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="var(--red)" stopOpacity={0.04} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="time" tick={{ fontSize: 9, fill: 'var(--text-muted)' }} />
              <YAxis tick={{ fontSize: 9, fill: 'var(--text-muted)' }} domain={[0, 100]} />
              <Tooltip
                contentStyle={{ background: 'var(--card-bg)', border: '1px solid var(--border)', borderRadius: 6, fontSize: 12 }}
                labelStyle={{ color: 'var(--text-primary)', fontWeight: 600 }}
                itemStyle={{ color: 'var(--text-secondary)' }}
                formatter={(v: any) => [`${v}%`, 'Congestion']}
              />
              <Area
                type="monotone"
                dataKey="level"
                stroke="var(--red)"
                strokeWidth={2}
                fill="url(#congGrad)"
                dot={{ fill: 'var(--red)', r: 3 }}
              />
            </AreaChart>
          </ResponsiveContainer>
          <div style={{ display: 'flex', gap: 16, marginTop: 10 }}>
            {[
              { label: `Pre-event build-up`, value: `${preBuildupMins} min`, color: 'var(--amber)' },
              { label: `Peak congestion window`, value: `${peakDurationMins} min`, color: 'var(--red)' },
              { label: `Post-event dispersal`, value: `${dispersalMins} min`, color: 'var(--text-muted)' },
            ].map(s => (
              <div key={s.label} style={{ flex: 1, textAlign: 'center', padding: '8px', background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: 6 }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: s.color }}>{s.value}</div>
                <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 2 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </Section>

        {/* ── Plan vs. Actual (Gap 5) ── */}
        <Section title="Plan vs. Reality">
          <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 12 }}>
            Compare what was planned before the event against what actually happened.
            {event.status !== 'completed' && <span style={{ color: 'var(--amber)', marginLeft: 4 }}>Enter actual figures below after event concludes.</span>}
          </div>
          <table className="w-full text-[13px]" style={{ borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)' }}>
                <th style={{ textAlign: 'left', padding: '8px 0', fontSize: 12, color: 'var(--text-secondary)', fontWeight: 600 }}>Metric</th>
                <th style={{ textAlign: 'center', padding: '8px 4px', fontSize: 12, color: 'var(--text-secondary)', fontWeight: 600 }}>Planned</th>
                <th style={{ textAlign: 'center', padding: '8px 4px', fontSize: 12, color: 'var(--text-secondary)', fontWeight: 600 }}>Actual</th>
                <th style={{ textAlign: 'center', padding: '8px 0', fontSize: 12, color: 'var(--text-secondary)', fontWeight: 600 }}>Delta</th>
              </tr>
            </thead>
            <tbody>
              {[
                {
                  metric: 'Officers Deployed',
                  planned: plannedO,
                  actual: actualO,
                  unit: '',
                  invert: false,
                },
                {
                  metric: 'Incidents Triggered',
                  planned: 0,
                  actual: actualI,
                  unit: '',
                  invert: false,
                },
                {
                  metric: 'Peak Delay',
                  planned: `${plannedD} min`,
                  actual: actualD ? `${actualD} min` : null,
                  unit: ' min',
                  delta: actualD ? actualD - plannedD : null,
                  invert: false,
                },
                {
                  metric: 'Affected Corridors',
                  planned: event.affectedCorridors.length,
                  actual: event.affectedCorridors.length,
                  unit: '',
                  invert: false,
                },
              ].map(row => {
                const delta = typeof row.delta !== 'undefined' ? row.delta
                  : typeof row.actual === 'number' && typeof row.planned === 'number'
                  ? row.actual - row.planned : null;
                return (
                  <tr key={row.metric} style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={{ padding: '10px 0', color: 'var(--text-primary)', fontWeight: 500 }}>{row.metric}</td>
                    <td style={{ padding: '10px 4px', textAlign: 'center', color: 'var(--text-secondary)' }}>
                      {typeof row.planned === 'string' ? row.planned : row.planned}
                    </td>
                    <td style={{ padding: '10px 4px', textAlign: 'center', color: 'var(--text-primary)', fontWeight: 600 }}>
                      {row.actual !== null && row.actual !== undefined ? row.actual : (
                        <span style={{ color: 'var(--text-muted)', fontWeight: 400, fontSize: 11 }}>—</span>
                      )}
                    </td>
                    <td style={{ padding: '10px 0', textAlign: 'center' }}>
                      {delta !== null && delta !== undefined
                        ? <DeltaBadge delta={delta} unit={row.unit || ''} invert={row.invert} />
                        : <span style={{ color: 'var(--text-muted)', fontSize: 11 }}>—</span>
                      }
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {/* Input actual outcome (Gap 2 + 5) */}
          {event.status === 'completed' && !outcomeRecorded && !(event as any).actualOfficers && (
            <div style={{ marginTop: 16, padding: '14px', background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: 8 }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 10 }}>
                Record Actual Outcome <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>(improves future predictions)</span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <div>
                  <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginBottom: 4 }}>Actual Officers Used</div>
                  <input
                    type="number" min={0}
                    value={actualOfficers}
                    onChange={e => setActualOfficers(e.target.value)}
                    placeholder="e.g. 95"
                    style={{
                      width: '100%', border: '1px solid var(--border)', background: 'var(--input-bg)',
                      borderRadius: 6, padding: '6px 10px', fontSize: 13, color: 'var(--text-primary)',
                    }}
                  />
                </div>
                <div>
                  <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginBottom: 4 }}>Actual Peak Delay (min)</div>
                  <input
                    type="number" min={0}
                    value={actualDelayMins}
                    onChange={e => setActualDelayMins(e.target.value)}
                    placeholder="e.g. 72"
                    style={{
                      width: '100%', border: '1px solid var(--border)', background: 'var(--input-bg)',
                      borderRadius: 6, padding: '6px 10px', fontSize: 13, color: 'var(--text-primary)',
                    }}
                  />
                </div>
              </div>
              <button
                onClick={handleRecordOutcome}
                disabled={!actualOfficers || !actualDelayMins}
                style={{
                  marginTop: 10, width: '100%', padding: '8px 0',
                  background: 'var(--accent)', color: '#fff', border: 'none',
                  borderRadius: 6, fontSize: 13, fontWeight: 600, cursor: 'pointer',
                  opacity: !actualOfficers || !actualDelayMins ? 0.5 : 1,
                }}
              >
                Save & Update Prediction Model
              </button>
            </div>
          )}

          {(outcomeRecorded || (event as any).actualOfficers) && (
            <div style={{ marginTop: 14, padding: '10px 14px', background: 'rgba(39,174,96,0.08)', border: '1px solid rgba(39,174,96,0.25)', borderRadius: 8 }}>
              <div style={{ fontSize: 12, color: 'var(--green)', fontWeight: 600 }}>
                ✓ Outcome recorded — future predictions for similar {event.type.replace(/_/g,' ')} events at this venue have been adjusted
                {corrFactor && corrFactor !== '1.00' && (
                  <span style={{ color: 'var(--text-muted)', fontWeight: 400, marginLeft: 6 }}>
                    (correction factor: {corrFactor}×)
                  </span>
                )}
              </div>
            </div>
          )}
        </Section>

        {/* ── Traffic Impact Summary ── */}
        <Section title="Traffic Impact Summary">
          <div className="space-y-2 text-[13px]">
            <div className="flex justify-between py-1.5 border-b border-[var(--border)]">
              <span className="text-[var(--text-secondary)]">Predicted Impact Score</span>
              <span className="font-semibold" style={{ color: impact.score >= 75 ? 'var(--red)' : impact.score >= 50 ? 'var(--amber)' : 'var(--green)' }}>{impact.score} / 100</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-[var(--border)]">
              <span className="text-[var(--text-secondary)]">Predicted Delay</span>
              <span className="font-medium text-[var(--text-primary)]">{impact.predictedDelay}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-[var(--border)]">
              <span className="text-[var(--text-secondary)]">Affected Corridors</span>
              <span className="font-medium text-[var(--text-primary)]">{event.affectedCorridors.length}</span>
            </div>
            <div className="flex justify-between py-1.5">
              <span className="text-[var(--text-secondary)]">Recommended Officers</span>
              <span className="font-medium" style={{ color: 'var(--green)' }}>{impact.recommendedOfficers}</span>
            </div>
          </div>
          <div className="mt-3">
            <div className="text-[12px] text-[var(--text-muted)] mb-2">Affected corridors:</div>
            <div className="flex flex-wrap gap-1">
              {event.affectedCorridors.map(c => (
                <span key={c} className="px-2 py-0.5 text-[11px] bg-[var(--section-events)] text-[var(--nav-active-text)] border border-[var(--section-events-border)] rounded">{c}</span>
              ))}
            </div>
          </div>
        </Section>

        {/* ── Officers Deployed ── */}
        <Section title="Officers Deployed">
          <table className="w-full text-[13px]">
            <thead>
              <tr className="border-b border-[var(--border)]">
                <th className="text-left py-2 text-[12px] font-medium text-[var(--text-secondary)]">Junction</th>
                <th className="text-center py-2 text-[12px] font-medium text-[var(--text-secondary)]">Officers</th>
                <th className="text-left py-2 text-[12px] font-medium text-[var(--text-secondary)]">Role</th>
              </tr>
            </thead>
            <tbody>
              {deploymentData.map((row, i) => (
                <tr key={i} className="border-b border-[var(--border)] last:border-0">
                  <td className="py-2 text-[var(--text-primary)]">{row.junction}</td>
                  <td className="py-2 text-center font-medium text-[var(--text-primary)]">{row.officers}</td>
                  <td className="py-2 text-[var(--text-secondary)]">{row.role}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Section>

        {/* ── Incidents During Event ── */}
        <Section title="Incidents During Event">
          {linkedIncidents.length === 0 ? (
            <div className="text-[13px] text-[var(--text-muted)]">No incidents recorded during this event period.</div>
          ) : (
            linkedIncidents.map(inc => (
              <div key={inc.id} className="flex items-center justify-between py-2 border-b border-[var(--border)] last:border-0">
                <div>
                  <div className="text-[13px] font-medium text-[var(--text-primary)]">{inc.id}</div>
                  <div className="text-[12px] text-[var(--text-secondary)]">{inc.cause.replace(/_/g,' ')} · {inc.junction}</div>
                </div>
                <Badge variant={inc.priority.toLowerCase() as 'high'|'medium'|'low'}>{inc.priority}</Badge>
              </div>
            ))
          )}
        </Section>

        {/* ── Recommendations for Next Time (Gap 2 — learning output) ── */}
        <Section title="Recommendations for Next Time">
          <ul className="space-y-2 text-[13px] text-[var(--text-secondary)]">
            <li>• Deploy <strong style={{ color: 'var(--text-primary)' }}>{Math.ceil(impact.recommendedOfficers * 1.1)}</strong> officers (10% buffer over model recommendation) for similar crowd sizes</li>
            <li>• Activate diversions <strong style={{ color: 'var(--text-primary)' }}>{impact.congestionWindow.preBuildupMins} minutes</strong> before event start to absorb pre-event build-up</li>
            <li>• Pre-position tow trucks at <strong style={{ color: 'var(--text-primary)' }}>{event.affectedCorridors[0]}</strong>{event.affectedCorridors[1] ? ` and ${event.affectedCorridors[1]}` : ''}</li>
            <li>• Issue public traffic advisory <strong style={{ color: 'var(--text-primary)' }}>24 hours in advance</strong> for {event.crowdSize} crowd events</li>
            <li>• Post-event dispersal requires <strong style={{ color: 'var(--text-primary)' }}>{impact.congestionWindow.dispersalMins} minutes</strong> of continued traffic management</li>
            {impact.barricadesNeeded > 0 && (
              <li>• Pre-deploy <strong style={{ color: 'var(--text-primary)' }}>{impact.barricadesNeeded} barricade sets</strong> across {event.affectedCorridors.length} affected corridors</li>
            )}
          </ul>
        </Section>
      </div>
    </div>
  );
}
