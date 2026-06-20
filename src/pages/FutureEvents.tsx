import { useEvents } from '../context/EventsContext';
import { useNavigate } from 'react-router-dom';
import { computeEventImpact } from '../utils/eventImpactScorer';

const TYPE_LABELS: Record<string, string> = {
  cricket_match: 'Cricket Match', political_rally: 'Political Rally',
  kambala: 'Kambala', concert: 'Concert', religious_procession: 'Religious Procession',
  marathon: 'Marathon', construction_permit: 'Construction Permit', vip_movement: 'VIP Movement', other: 'Other',
};

const TYPE_ICONS: Record<string, string> = {
  cricket_match: '🏏', political_rally: '📣', kambala: '🐃', concert: '🎵',
  religious_procession: '🪔', marathon: '🏃', construction_permit: '🚧', vip_movement: '🚗', other: '📌',
};

export default function FutureEvents() {
  const { events } = useEvents();
  const navigate = useNavigate();
  const planned = events.filter(e => e.status === 'planned' || e.status === 'active');
  const today = new Date().toISOString().slice(0, 10);

  return (
    <div className="overflow-y-auto h-full" style={{ background: 'var(--bg)' }}>
      <div style={{ maxWidth: 960, margin: '0 auto', padding: '28px 24px' }}>
        <div style={{ marginBottom: 24 }}>
          <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--text-primary)' }}>Future Events</div>
          <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 3 }}>
            Upcoming events that may impact Bengaluru traffic — with impact forecast and congestion windows
          </div>
        </div>

        {planned.length === 0 && (
          <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-muted)', fontSize: 14 }}>
            No upcoming events scheduled.
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {planned.map(e => {
            const impact = computeEventImpact(e.type, e.crowdSize, e.startTime, e.affectedCorridors, e.date);
            const impactColor = impact.score >= 75 ? 'var(--red)' : impact.score >= 50 ? 'var(--amber)' : 'var(--green)';
            const impactBg = impact.score >= 75 ? 'rgba(176,58,46,0.08)' : impact.score >= 50 ? 'rgba(211,84,0,0.08)' : 'rgba(39,174,96,0.08)';
            const isToday = e.date === today;
            const { preBuildupMins, peakDurationMins, dispersalMins } = impact.congestionWindow;
            const totalWindow = preBuildupMins + peakDurationMins + dispersalMins;

            return (
              <div
                key={e.id}
                style={{
                  background: 'var(--card-bg)',
                  border: `1px solid ${isToday ? 'var(--accent)' : 'var(--border)'}`,
                  borderRadius: 10,
                  overflow: 'hidden',
                  boxShadow: isToday ? '0 0 0 2px rgba(46,134,193,0.12)' : '0 1px 3px rgba(0,0,0,0.06)',
                }}
              >
                {/* Header row */}
                <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'flex-start', gap: 14 }}>
                  <div style={{
                    width: 40, height: 40, borderRadius: 8, background: impactBg,
                    border: `1px solid ${impactColor}30`, display: 'flex', alignItems: 'center',
                    justifyContent: 'center', fontSize: 20, flexShrink: 0,
                  }}>
                    {TYPE_ICONS[e.type] || '📌'}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3 }}>
                      {isToday && (
                        <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--accent)', background: 'rgba(46,134,193,0.12)', padding: '2px 7px', borderRadius: 4, letterSpacing: '0.05em' }}>TODAY</span>
                      )}
                      {e.status === 'active' && (
                        <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--green)', background: 'rgba(39,174,96,0.12)', padding: '2px 7px', borderRadius: 4 }}>LIVE</span>
                      )}
                      <span style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)' }}>{e.name}</span>
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{TYPE_LABELS[e.type] || e.type} · {e.venue}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>{e.date} · {e.startTime}–{e.endTime}</div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4 }}>
                    <span style={{ fontSize: 22, fontWeight: 800, color: impactColor, lineHeight: 1 }}>{impact.score}</span>
                    <span style={{ fontSize: 10, fontWeight: 700, color: impactColor, background: impactBg, padding: '2px 7px', borderRadius: 4 }}>{impact.impactLevel.toUpperCase()}</span>
                  </div>
                </div>

                {/* Congestion Window Bar (Gap 3) */}
                <div style={{ padding: '12px 20px', borderBottom: '1px solid var(--border)', background: 'var(--surface-2)' }}>
                  <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 6 }}>
                    Congestion Window
                  </div>
                  <div style={{ display: 'flex', gap: 2, borderRadius: 4, overflow: 'hidden', height: 16 }}>
                    {preBuildupMins > 0 && (
                      <div
                        title={`Pre-event build-up: ${preBuildupMins} min`}
                        style={{
                          flex: preBuildupMins / totalWindow,
                          background: 'rgba(211,84,0,0.30)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: 8, color: 'var(--amber)', fontWeight: 700,
                        }}
                      >
                        {preBuildupMins > 20 ? `${preBuildupMins}m` : ''}
                      </div>
                    )}
                    <div
                      title={`Peak congestion: ${peakDurationMins} min`}
                      style={{
                        flex: peakDurationMins / totalWindow,
                        background: 'rgba(176,58,46,0.45)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 8, color: '#fff', fontWeight: 700,
                      }}
                    >
                      {peakDurationMins > 30 ? `Peak ${peakDurationMins}m` : 'Peak'}
                    </div>
                    <div
                      title={`Post-event dispersal: ${dispersalMins} min`}
                      style={{
                        flex: dispersalMins / totalWindow,
                        background: 'rgba(211,84,0,0.18)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 8, color: 'var(--text-muted)', fontWeight: 700,
                      }}
                    >
                      {dispersalMins > 20 ? `+${dispersalMins}m` : ''}
                    </div>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4, fontSize: 10, color: 'var(--text-muted)' }}>
                    <span>−{preBuildupMins}min pre</span>
                    <span style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>
                      {e.startTime} → {e.endTime}
                    </span>
                    <span>+{dispersalMins}min post</span>
                  </div>
                </div>

                {/* Stats row */}
                <div style={{ padding: '12px 20px', display: 'flex', gap: 24, alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', gap: 24 }}>
                    <div>
                      <div style={{ fontSize: 10, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 3 }}>Rec. Officers</div>
                      <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--green)' }}>{impact.recommendedOfficers}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: 10, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 3 }}>Barricades</div>
                      <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--amber)' }}>{impact.barricadesNeeded}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: 10, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 3 }}>Delay Forecast</div>
                      <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{impact.predictedDelay}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: 10, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 3 }}>Corridors</div>
                      <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
                        {e.affectedCorridors.slice(0, 2).join(', ')}{e.affectedCorridors.length > 2 ? ` +${e.affectedCorridors.length - 2}` : ''}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => navigate(`/debrief/${e.id}`)}
                    style={{
                      padding: '6px 14px', background: 'transparent',
                      border: '1px solid var(--border)', borderRadius: 6,
                      color: 'var(--text-secondary)', fontSize: 11, fontWeight: 600,
                      cursor: 'pointer', whiteSpace: 'nowrap', transition: 'all 0.2s ease',
                    }}
                    className="hover:border-[var(--accent)] hover:text-[var(--accent)]"
                  >
                    View Debrief →
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
