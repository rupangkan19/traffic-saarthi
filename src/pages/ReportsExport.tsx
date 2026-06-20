import { useState } from 'react';
import { useIncidents } from '../hooks/useIncidents';
import { useEvents } from '../context/EventsContext';
import { ALL_INCIDENTS } from '../data/mockIncidents';

const REPORT_TEMPLATES = [
  {
    id: 'daily-summary',
    name: 'Daily Operations Summary',
    description: 'Total incidents, resolutions, active closures, average clearance time for the day',
    icon: '📋',
    category: 'Operations',
  },
  {
    id: 'corridor-heatmap',
    name: 'Corridor Incident Report',
    description: 'Incident frequency, avg impact score and resolution time per corridor',
    icon: '🗺',
    category: 'Traffic',
  },
  {
    id: 'event-impact',
    name: 'Event Traffic Impact Report',
    description: 'Pre/post impact analysis for all planned events this month',
    icon: '📅',
    category: 'Events',
  },
  {
    id: 'manpower-util',
    name: 'Manpower Utilisation Report',
    description: 'Officer deployment vs. incident demand by shift and corridor',
    icon: '👮',
    category: 'Operations',
  },
  {
    id: 'equipment-status',
    name: 'Equipment Status Report',
    description: 'Inventory deployment rates, low-stock alerts, maintenance due items',
    icon: '🚧',
    category: 'Resources',
  },
  {
    id: 'resolution-sla',
    name: 'Resolution SLA Report',
    description: 'Incidents resolved within SLA (30 min High, 60 min Medium, 120 min Low)',
    icon: '⏱',
    category: 'Operations',
  },
];

const RECENT_REPORTS = [
  { name: 'Daily Summary — 20 Jun 2026', size: '284 KB', format: 'PDF', date: '2026-06-20', by: 'Admin' },
  { name: 'Corridor Heatmap — Week 24', size: '1.2 MB', format: 'XLSX', date: '2026-06-17', by: 'SI Priya Nair' },
  { name: 'Event Impact — IPL Match RCB vs MI', size: '512 KB', format: 'PDF', date: '2026-06-15', by: 'Admin' },
  { name: 'Manpower Utilisation — May 2026', size: '890 KB', format: 'XLSX', date: '2026-06-01', by: 'Admin' },
  { name: 'Daily Summary — 19 Jun 2026', size: '271 KB', format: 'PDF', date: '2026-06-19', by: 'SI Mohan Das' },
];

const CATEGORIES = ['All', 'Operations', 'Traffic', 'Events', 'Resources'];

export default function ReportsExport() {
  const { incidents } = useIncidents();
  const { events } = useEvents();
  const [cat, setCat] = useState('All');
  const [generating, setGenerating] = useState<string | null>(null);
  const [generated, setGenerated] = useState<string[]>([]);

  const allIncidents = [...incidents, ...ALL_INCIDENTS.filter(a => !incidents.find(c => c.id === a.id))];
  const resolvedToday = allIncidents.filter(i => i.status === 'resolved' || i.status === 'closed').length;
  const active = allIncidents.filter(i => i.status === 'active').length;
  const avgScore = Math.round(allIncidents.reduce((s, i) => s + (i.impactScore || 0), 0) / allIncidents.length);

  const handleGenerate = (id: string) => {
    setGenerating(id);
    setTimeout(() => {
      setGenerating(null);
      setGenerated(prev => [...prev, id]);
    }, 1800);
  };

  const filtered = REPORT_TEMPLATES.filter(r => cat === 'All' || r.category === cat);

  const card: React.CSSProperties = {
    background: 'var(--card-bg)', border: '1px solid var(--border)',
    borderRadius: 10, padding: '20px 24px', marginBottom: 16,
  };

  return (
    <div className="overflow-y-auto h-full" style={{ background: 'var(--bg)' }}>
      <div style={{ maxWidth: 960, margin: '0 auto', padding: '28px 24px' }}>
        <div style={{ marginBottom: 24 }}>
          <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--text-primary)' }}>Reports & Export</div>
          <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 3 }}>
            Generate operational reports and export data for command review and audit
          </div>
        </div>

        {/* Live Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12, marginBottom: 20 }}>
          {[
            { label: 'Total Incidents', value: allIncidents.length, color: 'var(--text-primary)' },
            { label: 'Active Now', value: active, color: 'var(--red)' },
            { label: 'Resolved/Closed', value: resolvedToday, color: 'var(--green)' },
            { label: 'Avg. Impact Score', value: avgScore, color: 'var(--amber)' },
          ].map(s => (
            <div key={s.label} style={{ background: 'var(--card-bg)', border: '1px solid var(--border)', borderRadius: 8, padding: '14px 16px' }}>
              <div style={{ fontSize: 26, fontWeight: 800, color: s.color, lineHeight: 1 }}>{s.value}</div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Report Templates */}
        <div style={card}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
            <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-muted)', flex: 1 }}>Report Templates</div>
            {CATEGORIES.map(c => (
              <button
                key={c}
                onClick={() => setCat(c)}
                style={{
                  padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 600, cursor: 'pointer',
                  border: `1px solid ${cat === c ? 'var(--accent)' : 'var(--border)'}`,
                  background: cat === c ? 'var(--nav-active-bg)' : 'transparent',
                  color: cat === c ? 'var(--accent)' : 'var(--text-secondary)',
                  transition: 'all 0.2s ease',
                }}
              >
                {c}
              </button>
            ))}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 10 }}>
            {filtered.map(r => {
              const isDone = generated.includes(r.id);
              const isGen = generating === r.id;
              return (
                <div
                  key={r.id}
                  style={{
                    padding: '16px', background: 'var(--surface-2)', border: '1px solid var(--border)',
                    borderRadius: 8, display: 'flex', alignItems: 'flex-start', gap: 12,
                  }}
                >
                  <span style={{ fontSize: 22, flexShrink: 0, marginTop: 2 }}>{r.icon}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 3 }}>{r.name}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: 10 }}>{r.description}</div>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button
                        onClick={() => !isDone && !isGen && handleGenerate(r.id)}
                        disabled={isGen}
                        style={{
                          padding: '5px 12px', borderRadius: 6, fontSize: 11, fontWeight: 600, cursor: isGen ? 'wait' : 'pointer',
                          border: 'none',
                          background: isDone ? 'rgba(39,174,96,0.15)' : 'var(--accent)',
                          color: isDone ? 'var(--green)' : '#fff',
                          transition: 'all 0.2s ease',
                          opacity: isGen ? 0.7 : 1,
                        }}
                      >
                        {isGen ? '⏳ Generating...' : isDone ? '✓ Download PDF' : 'Generate Report'}
                      </button>
                      {isDone && (
                        <button
                          style={{
                            padding: '5px 12px', borderRadius: 6, fontSize: 11, fontWeight: 600, cursor: 'pointer',
                            border: '1px solid var(--border)', background: 'transparent', color: 'var(--text-secondary)',
                          }}
                        >
                          Export XLSX
                        </button>
                      )}
                    </div>
                  </div>
                  <span style={{ fontSize: 10, fontWeight: 600, color: 'var(--text-muted)', background: 'var(--surface-3)', padding: '2px 6px', borderRadius: 4, flexShrink: 0 }}>{r.category}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent Reports */}
        <div style={card}>
          <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-muted)', marginBottom: 12 }}>Recent Reports</div>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)' }}>
                {['Report Name', 'Date', 'Format', 'Size', 'Generated By', ''].map(h => (
                  <th key={h} style={{ textAlign: 'left', padding: '7px 10px', fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {RECENT_REPORTS.map(r => (
                <tr key={r.name} style={{ borderBottom: '1px solid var(--border)' }}>
                  <td style={{ padding: '10px 10px', color: 'var(--text-primary)', fontWeight: 500 }}>{r.name}</td>
                  <td style={{ padding: '10px 10px', color: 'var(--text-secondary)' }}>{r.date}</td>
                  <td style={{ padding: '10px 10px' }}>
                    <span style={{ fontSize: 11, fontWeight: 700, color: r.format === 'PDF' ? 'var(--red)' : 'var(--green)', background: r.format === 'PDF' ? 'rgba(176,58,46,0.10)' : 'rgba(39,174,96,0.10)', padding: '2px 7px', borderRadius: 4 }}>{r.format}</span>
                  </td>
                  <td style={{ padding: '10px 10px', color: 'var(--text-muted)' }}>{r.size}</td>
                  <td style={{ padding: '10px 10px', color: 'var(--text-secondary)' }}>{r.by}</td>
                  <td style={{ padding: '10px 10px' }}>
                    <button style={{ fontSize: 11, color: 'var(--accent)', fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>↓ Download</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
