import { useState } from 'react';
import { useIncidents } from '../hooks/useIncidents';

const SHIFTS = [
  { code: 'A', label: 'Morning Duty', time: '06:00 – 14:00', officers: 48, lead: 'Insp. Ramesh Kumar', color: '#27AE60' },
  { code: 'B', label: 'Afternoon Duty', time: '14:00 – 22:00', officers: 36, lead: 'SI Priya Nair', color: '#2E86C1' },
  { code: 'C', label: 'Night Duty', time: '22:00 – 06:00', officers: 24, lead: 'SI Mohan Das', color: '#8E44AD' },
];

const PATROL_UNITS = [
  { id: 'PCR-01', name: 'PCR Unit Alpha', corridor: 'CBD 1', status: 'on-duty', officers: 4, lat: 12.9716, action: 'Traffic Control – MG Road' },
  { id: 'PCR-02', name: 'PCR Unit Bravo', corridor: 'Hosur Road', status: 'on-duty', officers: 3, lat: 12.9172, action: 'Monitoring Silk Board Junction' },
  { id: 'PCR-03', name: 'PCR Unit Charlie', corridor: 'Bellary Road 1', status: 'responding', officers: 4, lat: 13.0358, action: 'Responding to TSID00045' },
  { id: 'PCR-04', name: 'PCR Unit Delta', corridor: 'Mysore Road', status: 'on-duty', officers: 3, lat: 12.9450, action: 'Routine Patrol' },
  { id: 'PCR-05', name: 'PCR Unit Echo', corridor: 'ORR East 1', status: 'break', officers: 2, lat: 12.9561, action: 'Short break at Marathahalli' },
  { id: 'PCR-06', name: 'Bike Unit 01', corridor: 'CBD 2', status: 'on-duty', officers: 2, lat: 12.9800, action: 'Rapid response – MG Road area' },
  { id: 'PCR-07', name: 'Bike Unit 02', corridor: 'Tumkur Road', status: 'on-duty', officers: 2, lat: 13.0228, action: 'Yeshwanthpur flyover watch' },
  { id: 'PCR-08', name: 'Tow Truck T-1', corridor: 'ORR East 2', status: 'deployed', officers: 2, lat: 12.9716, action: 'Vehicle clearance – Whitefield' },
];

const STATUS_STYLE: Record<string, { color: string; bg: string; label: string }> = {
  'on-duty':   { color: '#27AE60', bg: 'rgba(39,174,96,0.12)',  label: 'On Duty' },
  'responding':{ color: '#D35400', bg: 'rgba(211,84,0,0.12)',   label: 'Responding' },
  'break':     { color: '#8896A5', bg: 'rgba(136,150,165,0.10)', label: 'Break' },
  'deployed':  { color: '#2E86C1', bg: 'rgba(46,134,193,0.12)', label: 'Deployed' },
};

export default function PatrolManagement() {
  const { incidents } = useIncidents();
  const activeIncidents = incidents.filter(i => i.status === 'active');
  const [activeShift, setActiveShift] = useState('A');
  const [search, setSearch] = useState('');

  const filtered = PATROL_UNITS.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.corridor.toLowerCase().includes(search.toLowerCase()) ||
    u.action.toLowerCase().includes(search.toLowerCase())
  );

  const totalOnDuty = PATROL_UNITS.filter(u => u.status === 'on-duty' || u.status === 'responding' || u.status === 'deployed').reduce((s, u) => s + u.officers, 0);

  const card: React.CSSProperties = {
    background: 'var(--card-bg)', border: '1px solid var(--border)',
    borderRadius: 10, padding: '20px 24px', marginBottom: 16,
  };

  return (
    <div className="overflow-y-auto h-full" style={{ background: 'var(--bg)' }}>
      <div style={{ maxWidth: 1000, margin: '0 auto', padding: '28px 24px' }}>
        {/* Header */}
        <div style={{ marginBottom: 24 }}>
          <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--text-primary)' }}>Patrol Management</div>
          <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 3 }}>
            Live unit tracking, shift scheduling and field officer deployment
          </div>
        </div>

        {/* KPI Strip */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12, marginBottom: 20 }}>
          {[
            { label: 'Officers On Field', value: totalOnDuty, color: 'var(--green)' },
            { label: 'Active Units', value: PATROL_UNITS.filter(u => u.status !== 'break').length, color: 'var(--accent)' },
            { label: 'Responding', value: PATROL_UNITS.filter(u => u.status === 'responding').length, color: 'var(--amber)' },
            { label: 'Open Incidents', value: activeIncidents.length, color: 'var(--red)' },
          ].map(s => (
            <div key={s.label} style={{ background: 'var(--card-bg)', border: '1px solid var(--border)', borderRadius: 8, padding: '14px 16px' }}>
              <div style={{ fontSize: 26, fontWeight: 800, color: s.color, lineHeight: 1 }}>{s.value}</div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Shift Selector */}
        <div style={card}>
          <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-muted)', marginBottom: 12 }}>Current Shifts</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10 }}>
            {SHIFTS.map(s => (
              <button
                key={s.code}
                onClick={() => setActiveShift(s.code)}
                style={{
                  padding: '12px 16px', borderRadius: 8, textAlign: 'left', cursor: 'pointer',
                  border: `1.5px solid ${activeShift === s.code ? s.color : 'var(--border)'}`,
                  background: activeShift === s.code ? `${s.color}10` : 'var(--surface-2)',
                  transition: 'all 0.2s ease',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: s.color }} />
                  <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-primary)' }}>Shift {s.code} — {s.label}</span>
                </div>
                <div style={{ fontSize: 11, color: 'var(--text-secondary)' }}>{s.time}</div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>{s.officers} officers · {s.lead}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Patrol Units Table */}
        <div style={card}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
            <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-muted)' }}>Field Units</div>
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search unit or corridor..."
              style={{
                border: '1px solid var(--border)', background: 'var(--input-bg)', borderRadius: 6,
                padding: '5px 10px', fontSize: 12, color: 'var(--text-primary)', width: 200,
              }}
            />
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)' }}>
                {['Unit', 'Corridor', 'Officers', 'Status', 'Current Action'].map(h => (
                  <th key={h} style={{ textAlign: 'left', padding: '8px 10px', fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.07em' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(u => {
                const st = STATUS_STYLE[u.status];
                return (
                  <tr key={u.id} style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={{ padding: '10px 10px' }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--accent)' }}>{u.id}</div>
                      <div style={{ fontSize: 11, color: 'var(--text-secondary)' }}>{u.name}</div>
                    </td>
                    <td style={{ padding: '10px 10px', color: 'var(--text-primary)', fontSize: 12 }}>{u.corridor}</td>
                    <td style={{ padding: '10px 10px', textAlign: 'center', fontWeight: 700, color: 'var(--text-primary)' }}>{u.officers}</td>
                    <td style={{ padding: '10px 10px' }}>
                      <span style={{ fontSize: 11, fontWeight: 700, color: st.color, background: st.bg, padding: '3px 8px', borderRadius: 10 }}>{st.label}</span>
                    </td>
                    <td style={{ padding: '10px 10px', color: 'var(--text-secondary)', fontSize: 12 }}>{u.action}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Unattended Incidents Banner */}
        {activeIncidents.filter(i => i.requiresRoadClosure).length > 0 && (
          <div style={{ padding: '14px 18px', background: 'rgba(176,58,46,0.07)', border: '1px solid rgba(176,58,46,0.25)', borderRadius: 8, marginBottom: 16 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--red)', marginBottom: 6 }}>
              ⚠ {activeIncidents.filter(i => i.requiresRoadClosure).length} road closures require active officer presence
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {activeIncidents.filter(i => i.requiresRoadClosure).slice(0, 6).map(i => (
                <span key={i.id} style={{ fontSize: 11, color: 'var(--red)', background: 'rgba(176,58,46,0.10)', padding: '2px 8px', borderRadius: 4, fontWeight: 600 }}>
                  {i.id} · {i.corridor}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
