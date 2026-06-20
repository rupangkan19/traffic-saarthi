import { useIncidents } from '../hooks/useIncidents';
import { getDiversionRoutes } from '../utils/diversionSuggester';

const CAUSE_LABELS: Record<string, string> = {
  vehicle_breakdown: 'Vehicle Breakdown', accident: 'Accident', pot_holes: 'Pot Holes',
  construction: 'Construction', water_logging: 'Water Logging', tree_fall: 'Tree Fall',
  public_event: 'Public Event', vip_movement: 'VIP Movement', others: 'Others',
};

export default function Recommendations() {
  const { incidents } = useIncidents();
  const activeIncidents = incidents.filter(i => i.status === 'active');
  const closureIncidents = activeIncidents.filter(i => i.requiresRoadClosure);

  const totalOfficers = activeIncidents.reduce((sum, i) => {
    if (i.priority === 'High' && i.requiresRoadClosure) return sum + 12;
    if (i.priority === 'High') return sum + 7;
    if (i.priority === 'Medium' && i.requiresRoadClosure) return sum + 7;
    if (i.priority === 'Medium') return sum + 4;
    return sum + 2;
  }, 0);

  const totalBarricades = closureIncidents.reduce((sum, i) => {
    return sum + (i.priority === 'High' ? 6 : i.priority === 'Medium' ? 4 : 2);
  }, 0);

  const cardStyle: React.CSSProperties = {
    background: 'var(--card-bg)', border: '1px solid var(--border)',
    borderRadius: 10, padding: '20px 24px', marginBottom: 16,
  };

  const sectionHead = (label: string, color: string) => (
    <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color, marginBottom: 16 }}>
      {label}
    </div>
  );

  return (
    <div className="overflow-y-auto h-full" style={{ background: 'var(--bg)' }}>
      <div style={{ maxWidth: 960, margin: '0 auto', padding: '28px 24px' }}>
        <div style={{ marginBottom: 24 }}>
          <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--text-primary)' }}>Operational Recommendations</div>
          <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 3 }}>Auto-calculated based on {activeIncidents.length} active incidents</div>
        </div>

        {/* Manpower Summary */}
        <div style={cardStyle}>
          {sectionHead('Manpower Required', '#27AE60')}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16, marginBottom: 20 }}>
            {[
              { label: 'Total Officers Needed', value: totalOfficers, sub: 'across all active incidents', color: '#27AE60' },
              { label: 'High Priority Incidents', value: activeIncidents.filter(i => i.priority === 'High').length, sub: 'requiring immediate dispatch', color: '#B03A2E' },
              { label: 'Road Closures Active', value: closureIncidents.length, sub: 'needing barrier teams', color: '#D35400' },
            ].map(s => (
              <div key={s.label} style={{ background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: 8, padding: '16px' }}>
                <div style={{ fontSize: 28, fontWeight: 700, color: s.color, lineHeight: 1 }}>{s.value}</div>
                <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', marginTop: 4 }}>{s.label}</div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>{s.sub}</div>
              </div>
            ))}
          </div>
          <div style={{ borderTop: '1px solid var(--border)', paddingTop: 16 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 10 }}>Per-Incident Deployment</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {activeIncidents.slice(0, 8).map(i => {
                const needed = i.priority === 'High' && i.requiresRoadClosure ? '10–14' :
                  i.priority === 'High' ? '6–8' : i.priority === 'Medium' && i.requiresRoadClosure ? '5–7' :
                  i.priority === 'Medium' ? '3–5' : '2–3';
                const c = i.priority === 'High' ? '#B03A2E' : i.priority === 'Medium' ? '#D35400' : '#27AE60';
                return (
                  <div key={i.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '8px 12px', background: 'var(--surface-2)', borderRadius: 6, border: '1px solid var(--border)' }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: c, flexShrink: 0 }} />
                    <span style={{ fontSize: 12, color: '#6B8FD4', fontWeight: 600, minWidth: 80 }}>{i.id}</span>
                    <span style={{ fontSize: 12, color: 'var(--text-secondary)', flex: 1 }}>{CAUSE_LABELS[i.cause]} · {i.corridor}</span>
                    <span style={{ fontSize: 12, fontWeight: 600, color: c }}>{needed} officers</span>
                    {i.requiresRoadClosure && <span style={{ fontSize: 10, color: '#D35400', background: 'rgba(211,84,0,0.12)', padding: '2px 6px', borderRadius: 4, fontWeight: 600 }}>CLOSURE</span>}
                  </div>
                );
              })}
              {activeIncidents.length > 8 && (
                <div style={{ fontSize: 12, color: 'var(--text-muted)', textAlign: 'center', padding: '4px 0' }}>+{activeIncidents.length - 8} more incidents</div>
              )}
            </div>
          </div>
        </div>

        {/* Barricades */}
        <div style={cardStyle}>
          {sectionHead('Barricade Deployment', '#D35400')}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 16, marginBottom: 16 }}>
            {[
              { label: 'Total Barricades Needed', value: totalBarricades, color: '#D35400' },
              { label: 'Closure Points', value: closureIncidents.length, color: '#B03A2E' },
            ].map(s => (
              <div key={s.label} style={{ background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: 8, padding: '16px' }}>
                <div style={{ fontSize: 28, fontWeight: 700, color: s.color }}>{s.value}</div>
                <div style={{ fontSize: 13, color: 'var(--text-primary)', marginTop: 4, fontWeight: 600 }}>{s.label}</div>
              </div>
            ))}
          </div>
          {closureIncidents.length === 0 && (
            <div style={{ fontSize: 13, color: 'var(--text-muted)', textAlign: 'center', padding: '16px 0' }}>No road closures currently active.</div>
          )}
          {closureIncidents.map(i => {
            const b = i.priority === 'High' ? '5–7' : i.priority === 'Medium' ? '3–5' : '2–3';
            return (
              <div key={i.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 14px', marginBottom: 8, background: 'rgba(211,84,0,0.06)', border: '1px solid rgba(211,84,0,0.2)', borderRadius: 8 }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#D35400" strokeWidth="2.5"><rect x="1" y="3" width="22" height="13" rx="2"/></svg>
                <span style={{ fontSize: 13, color: 'var(--text-primary)', flex: 1, fontWeight: 500 }}>{i.corridor}</span>
                <span style={{ fontSize: 12, color: '#D35400', fontWeight: 600 }}>{b} barricades</span>
              </div>
            );
          })}
        </div>

        {/* Diversions */}
        <div style={cardStyle}>
          {sectionHead('Recommended Diversions', '#2E86C1')}
          {closureIncidents.length === 0 && (
            <div style={{ fontSize: 13, color: 'var(--text-muted)', textAlign: 'center', padding: '16px 0' }}>No active road closures requiring diversions.</div>
          )}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {closureIncidents.map(i => {
              const routes = getDiversionRoutes(i.corridor);
              const r = routes[0];
              return (
                <div key={i.id} style={{ border: '1px solid var(--border)', borderRadius: 8, overflow: 'hidden' }}>
                  <div style={{ padding: '12px 16px', background: 'rgba(176,58,46,0.08)', borderBottom: '1px solid rgba(176,58,46,0.2)', display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#B03A2E' }} />
                    <span style={{ fontSize: 13, fontWeight: 600, color: '#B03A2E' }}>CLOSED: {i.corridor}</span>
                    <span style={{ marginLeft: 'auto', fontSize: 11, color: 'var(--text-muted)' }}>{i.id}</span>
                  </div>
                  {r ? (
                    <div style={{ padding: '12px 16px', background: 'rgba(39,174,96,0.04)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#27AE60" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                        <span style={{ fontSize: 13, fontWeight: 600, color: '#27AE60' }}>{r.label}</span>
                        <span style={{ marginLeft: 'auto', fontSize: 11, color: '#27AE60', fontWeight: 600 }}>{r.estimatedDelay}</span>
                      </div>
                      <ol style={{ paddingLeft: 0, margin: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 4 }}>
                        {r.steps.map((step, idx) => (
                          <li key={idx} style={{ display: 'flex', gap: 10, fontSize: 12, color: 'var(--text-secondary)' }}>
                            <span style={{ width: 18, height: 18, borderRadius: '50%', background: '#2E86C1', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700, flexShrink: 0 }}>{idx + 1}</span>
                            {step}
                          </li>
                        ))}
                      </ol>
                      <div style={{ fontSize: 12, color: '#27AE60', marginTop: 8, fontWeight: 500 }}>Rejoin at: {r.rejoinsAt}</div>
                    </div>
                  ) : (
                    <div style={{ padding: '12px 16px', fontSize: 12, color: 'var(--text-muted)' }}>Coordinate diversion manually with control room.</div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}
