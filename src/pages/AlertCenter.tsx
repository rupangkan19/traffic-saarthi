import { useState } from 'react';
import { useIncidents } from '../hooks/useIncidents';
import { useEvents } from '../context/EventsContext';

type AlertSeverity = 'critical' | 'high' | 'medium' | 'info';
type AlertCategory = 'incident' | 'event' | 'system' | 'weather' | 'escalation';

interface Alert {
  id: string;
  title: string;
  description: string;
  severity: AlertSeverity;
  category: AlertCategory;
  time: string;
  location: string;
  acknowledged: boolean;
  escalatedTo?: string;
}

const STATIC_ALERTS: Alert[] = [
  { id: 'ALT001', title: 'Multi-vehicle pile-up — Silk Board', description: 'Reported 3-vehicle collision, 2 lanes blocked. Ambulance dispatched.', severity: 'critical', category: 'incident', time: '08:32', location: 'Silk Board Junction', acknowledged: false },
  { id: 'ALT002', title: 'VIP convoy movement — 10:00 AM', description: 'Chief Minister convoy expected on Bellary Road. Pre-clearance required.', severity: 'high', category: 'event', time: '07:45', location: 'Bellary Road 1', acknowledged: false, escalatedTo: 'DCP Traffic' },
  { id: 'ALT003', title: 'Waterlogging on Hosur Road', description: 'Flash flooding reported near Electronic City toll. Traffic severely impacted.', severity: 'high', category: 'weather', time: '09:10', location: 'Electronic City Phase 1', acknowledged: false },
  { id: 'ALT004', title: 'CCTV feed offline — ORR East camera 3', description: 'Camera at Marathahalli Bridge has been offline for >15 minutes.', severity: 'medium', category: 'system', time: '08:55', location: 'Marathahalli Bridge', acknowledged: true },
  { id: 'ALT005', title: 'Incident TSID00023 escalated to Control Room', description: 'Tree fall blocking entire Mysore Road — escalated for heavy machinery deployment.', severity: 'critical', category: 'escalation', time: '08:20', location: 'Mysore Road, near Kengeri', acknowledged: true, escalatedTo: 'Control Room' },
  { id: 'ALT006', title: 'Officer manpower shortfall — Tumkur Road', description: 'Only 2 officers covering 3 active incidents on Tumkur Road corridor.', severity: 'medium', category: 'escalation', time: '09:25', location: 'Tumkur Road', acknowledged: false },
  { id: 'ALT007', title: 'ORR East construction permit expiry', description: 'Construction permit for ORR East widening expires tomorrow. Renewal required.', severity: 'info', category: 'system', time: '06:00', location: 'ORR East 1 & 2', acknowledged: true },
  { id: 'ALT008', title: 'Heavy rain forecast — evening peak', description: 'IMD alert for heavy rainfall between 17:00–20:00. Pre-position drainage teams.', severity: 'medium', category: 'weather', time: '08:00', location: 'Bengaluru (all zones)', acknowledged: false },
];

const SEV_STYLE: Record<AlertSeverity, { color: string; bg: string; border: string; dot: string }> = {
  critical: { color: '#B03A2E', bg: 'rgba(176,58,46,0.07)', border: 'rgba(176,58,46,0.25)', dot: '#B03A2E' },
  high:     { color: '#D35400', bg: 'rgba(211,84,0,0.07)',   border: 'rgba(211,84,0,0.25)',   dot: '#D35400' },
  medium:   { color: '#8E44AD', bg: 'rgba(142,68,173,0.06)', border: 'rgba(142,68,173,0.20)', dot: '#8E44AD' },
  info:     { color: '#2E86C1', bg: 'rgba(46,134,193,0.06)', border: 'rgba(46,134,193,0.20)', dot: '#2E86C1' },
};

const CAT_ICON: Record<AlertCategory, string> = {
  incident: '🚨', event: '📅', system: '⚙️', weather: '🌧', escalation: '📤',
};

const CAT_LABELS: Record<AlertCategory, string> = {
  incident: 'Incident', event: 'Event', system: 'System', weather: 'Weather', escalation: 'Escalation',
};

export default function AlertCenter() {
  const { incidents } = useIncidents();
  const { events } = useEvents();
  const [alerts, setAlerts] = useState<Alert[]>(STATIC_ALERTS);
  const [filter, setFilter] = useState<'all' | AlertSeverity | AlertCategory>('all');
  const [showAcknowledged, setShowAcknowledged] = useState(false);

  // Merge live incident data as dynamic alerts
  const liveHighIncidents = incidents
    .filter(i => i.status === 'active' && i.priority === 'High')
    .slice(0, 3)
    .map(i => ({
      id: `DYN-${i.id}`,
      title: `High priority: ${i.cause.replace(/_/g, ' ')} at ${i.junction}`,
      description: i.description || 'Active high-priority incident requiring immediate attention.',
      severity: 'high' as AlertSeverity,
      category: 'incident' as AlertCategory,
      time: new Date(i.timeOfIncident).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }),
      location: i.corridor,
      acknowledged: false,
    }));

  const allAlerts = [...liveHighIncidents, ...alerts];
  const unack = allAlerts.filter(a => !a.acknowledged);
  const critical = allAlerts.filter(a => a.severity === 'critical' && !a.acknowledged);

  const filtered = allAlerts.filter(a => {
    if (!showAcknowledged && a.acknowledged) return false;
    if (filter === 'all') return true;
    return a.severity === filter || a.category === filter;
  });

  const acknowledge = (id: string) => {
    setAlerts(prev => prev.map(a => a.id === id ? { ...a, acknowledged: true } : a));
  };

  const card: React.CSSProperties = {
    background: 'var(--card-bg)', border: '1px solid var(--border)',
    borderRadius: 10, padding: '20px 24px', marginBottom: 16,
  };

  return (
    <div className="overflow-y-auto h-full" style={{ background: 'var(--bg)' }}>
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '28px 24px' }}>
        <div style={{ marginBottom: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--text-primary)' }}>Alert Center</div>
            {critical.length > 0 && (
              <span style={{ fontSize: 11, fontWeight: 700, color: '#fff', background: 'var(--red)', padding: '2px 8px', borderRadius: 10 }}>
                {critical.length} CRITICAL
              </span>
            )}
          </div>
          <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 3 }}>
            System alerts, escalations and field notifications
          </div>
        </div>

        {/* KPI Strip */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12, marginBottom: 20 }}>
          {[
            { label: 'Critical', value: allAlerts.filter(a => a.severity === 'critical').length, color: 'var(--red)' },
            { label: 'High', value: allAlerts.filter(a => a.severity === 'high').length, color: 'var(--amber)' },
            { label: 'Unacknowledged', value: unack.length, color: '#8E44AD' },
            { label: 'Escalated', value: allAlerts.filter(a => a.escalatedTo).length, color: 'var(--accent)' },
          ].map(s => (
            <div key={s.label} style={{ background: 'var(--card-bg)', border: '1px solid var(--border)', borderRadius: 8, padding: '14px 16px' }}>
              <div style={{ fontSize: 26, fontWeight: 800, color: s.color, lineHeight: 1 }}>{s.value}</div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div style={{ display: 'flex', gap: 6, marginBottom: 16, alignItems: 'center', flexWrap: 'wrap' }}>
          {(['all', 'critical', 'high', 'medium', 'incident', 'event', 'weather', 'system', 'escalation'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              style={{
                padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 600, cursor: 'pointer',
                border: `1px solid ${filter === f ? 'var(--accent)' : 'var(--border)'}`,
                background: filter === f ? 'var(--nav-active-bg)' : 'transparent',
                color: filter === f ? 'var(--accent)' : 'var(--text-secondary)',
                textTransform: 'capitalize', transition: 'all 0.2s ease',
              }}
            >
              {f}
            </button>
          ))}
          <label style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--text-secondary)', cursor: 'pointer' }}>
            <input type="checkbox" checked={showAcknowledged} onChange={e => setShowAcknowledged(e.target.checked)} />
            Show acknowledged
          </label>
        </div>

        {/* Alert List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {filtered.length === 0 && (
            <div style={{ textAlign: 'center', padding: '48px 0', color: 'var(--text-muted)', fontSize: 14 }}>
              No alerts match your filters.
            </div>
          )}
          {filtered.map(alert => {
            const sev = SEV_STYLE[alert.severity];
            return (
              <div
                key={alert.id}
                style={{
                  background: alert.acknowledged ? 'var(--card-bg)' : sev.bg,
                  border: `1px solid ${alert.acknowledged ? 'var(--border)' : sev.border}`,
                  borderRadius: 8, padding: '14px 18px',
                  opacity: alert.acknowledged ? 0.65 : 1,
                  transition: 'all 0.25s ease',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                  <span style={{ fontSize: 18, marginTop: 1, flexShrink: 0 }}>{CAT_ICON[alert.category]}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 3 }}>
                      <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)' }}>{alert.title}</span>
                      <span style={{ fontSize: 10, fontWeight: 700, color: sev.color, background: `${sev.color}18`, padding: '1px 7px', borderRadius: 10, textTransform: 'uppercase' }}>
                        {alert.severity}
                      </span>
                      {alert.acknowledged && (
                        <span style={{ fontSize: 10, fontWeight: 600, color: 'var(--green)', background: 'rgba(39,174,96,0.10)', padding: '1px 7px', borderRadius: 10 }}>✓ ACK</span>
                      )}
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 6 }}>{alert.description}</div>
                    <div style={{ display: 'flex', gap: 16, fontSize: 11, color: 'var(--text-muted)' }}>
                      <span>📍 {alert.location}</span>
                      <span>🕐 {alert.time}</span>
                      <span>🏷 {CAT_LABELS[alert.category]}</span>
                      {alert.escalatedTo && <span style={{ color: 'var(--accent)', fontWeight: 600 }}>↑ Escalated to {alert.escalatedTo}</span>}
                    </div>
                  </div>
                  {!alert.acknowledged && (
                    <button
                      onClick={() => acknowledge(alert.id)}
                      style={{
                        padding: '5px 12px', border: `1px solid ${sev.border}`,
                        borderRadius: 6, background: 'transparent', cursor: 'pointer',
                        fontSize: 11, fontWeight: 600, color: sev.color,
                        flexShrink: 0, transition: 'all 0.2s ease',
                      }}
                    >
                      Acknowledge
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
