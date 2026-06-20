import { useState, useMemo } from 'react';
import { useIncidents } from '../hooks/useIncidents';
import { ALL_INCIDENTS } from '../data/mockIncidents';
import { CORRIDORS } from '../data/corridors';
import type { IncidentStatus, Priority } from '../types';

const PAGE_SIZE = 25;

const CAUSE_LABELS: Record<string, string> = {
  vehicle_breakdown: 'Vehicle Breakdown', accident: 'Accident', pot_holes: 'Pot Holes',
  construction: 'Construction', water_logging: 'Water Logging', tree_fall: 'Tree Fall',
  public_event: 'Public Event', vip_movement: 'VIP Movement', others: 'Others',
};

const PRIORITY_DOT: Record<string, string> = { High: '#B03A2E', Medium: '#D35400', Low: '#27AE60' };
const STATUS_COLOR: Record<string, { text: string; bg: string }> = {
  active:   { text: '#B03A2E', bg: 'rgba(176,58,46,0.12)' },
  resolved: { text: '#27AE60', bg: 'rgba(39,174,96,0.12)' },
  closed:   { text: '#8896A5', bg: 'rgba(136,150,165,0.10)' },
  draft:    { text: '#D35400', bg: 'rgba(211,84,0,0.12)' },
};

function StatusPill({ status }: { status: string }) {
  const s = STATUS_COLOR[status] || STATUS_COLOR.closed;
  return (
    <span style={{ fontSize: 11, fontWeight: 600, color: s.text, background: s.bg, padding: '2px 8px', borderRadius: 10, textTransform: 'capitalize' }}>
      {status}
    </span>
  );
}

export default function IncidentHistory() {
  const { incidents: ctxIncidents } = useIncidents();
  const incidents = useMemo(
    () => [...ctxIncidents, ...ALL_INCIDENTS.filter(a => !ctxIncidents.find(c => c.id === a.id))],
    [ctxIncidents]
  );
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterPriority, setFilterPriority] = useState('');
  const [filterCorridor, setFilterCorridor] = useState('');
  const [page, setPage] = useState(1);
  const [sortKey, setSortKey] = useState<string>('createdAt');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');

  const filtered = useMemo(() => {
    return incidents.filter(i => {
      const q = search.toLowerCase();
      if (q && !i.id.toLowerCase().includes(q) && !(i.address || '').toLowerCase().includes(q) && !i.cause.includes(q) && !i.corridor.toLowerCase().includes(q)) return false;
      if (filterStatus && i.status !== filterStatus) return false;
      if (filterPriority && i.priority !== filterPriority) return false;
      if (filterCorridor && i.corridor !== filterCorridor) return false;
      return true;
    }).sort((a, b) => {
      const av = (a as unknown as Record<string, unknown>)[sortKey];
      const bv = (b as unknown as Record<string, unknown>)[sortKey];
      if (av === null || av === undefined) return 1;
      if (bv === null || bv === undefined) return -1;
      const cmp = String(av) < String(bv) ? -1 : String(av) > String(bv) ? 1 : 0;
      return sortDir === 'asc' ? cmp : -cmp;
    });
  }, [incidents, search, filterStatus, filterPriority, filterCorridor, sortKey, sortDir]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  // Summary row
  const highCount = filtered.filter(i => i.priority === 'High').length;
  const activeCount = filtered.filter(i => i.status === 'active').length;
  const resolvedCount = filtered.filter(i => i.resolutionTimeMin).length;
  const avgRes = resolvedCount
    ? Math.round(filtered.filter(i => i.resolutionTimeMin).reduce((s, i) => s + (i.resolutionTimeMin || 0), 0) / resolvedCount)
    : 0;

  const handleSort = (key: string) => {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortKey(key); setSortDir('desc'); }
  };

  const SortIcon = ({ k }: { k: string }) => (
    <span style={{ marginLeft: 4, color: sortKey === k ? '#1B4FBF' : '#2A3F55', fontSize: 10 }}>
      {sortKey === k ? (sortDir === 'asc' ? '▲' : '▼') : '⇅'}
    </span>
  );

  const inputStyle: React.CSSProperties = {
    background: 'var(--input-bg)', border: '1px solid var(--input-border)', borderRadius: 6,
    padding: '8px 12px', fontSize: 13, color: 'var(--input-text)', outline: 'none',
  };
  const selectStyle: React.CSSProperties = { ...inputStyle, cursor: 'pointer' };

  const thStyle: React.CSSProperties = {
    padding: '10px 14px', fontSize: 11, fontWeight: 600, color: 'var(--text-secondary)',
    textTransform: 'uppercase', letterSpacing: '0.05em', textAlign: 'left',
    borderBottom: '1px solid var(--border)', cursor: 'pointer', userSelect: 'none',
    background: 'var(--surface-3)', whiteSpace: 'nowrap',
  };

  return (
    <div className="overflow-y-auto h-full" style={{ background: 'var(--bg)' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '24px' }}>

        {/* Header */}
        <div style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)' }}>Incident History</div>
          <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 2 }}>Full record of all incidents logged in Traffic Saarthi</div>
        </div>

        {/* Summary row */}
        <div className="grid grid-cols-4 gap-3 mb-4">
          {[
            { label: 'Matching', value: filtered.length, color: 'var(--text-primary)' },
            { label: 'Active', value: activeCount, color: 'var(--red)' },
            { label: 'High Priority', value: highCount, color: 'var(--amber)' },
            { label: 'Avg Resolution', value: avgRes ? `${avgRes}m` : '—', color: 'var(--green)' },
          ].map(s => (
            <div key={s.label} style={{ background: 'var(--card-bg)', border: '1px solid var(--border)', borderRadius: 8, padding: '12px 16px' }}>
              <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{s.label}</div>
              <div style={{ fontSize: 22, fontWeight: 700, color: s.color }}>{s.value}</div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div style={{ background: 'var(--card-bg)', border: '1px solid var(--border)', borderRadius: 8, padding: '12px 16px', marginBottom: 16, display: 'flex', flexWrap: 'wrap', gap: 10 }}>
          <input
            style={{ ...inputStyle, flex: 1, minWidth: 200 }}
            placeholder="Search by ID, corridor, cause…"
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }}
          />
          <select style={selectStyle} value={filterStatus} onChange={e => { setFilterStatus(e.target.value); setPage(1); }}>
            <option value="">All Statuses</option>
            {(['active','resolved','closed','draft'] as IncidentStatus[]).map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <select style={selectStyle} value={filterPriority} onChange={e => { setFilterPriority(e.target.value); setPage(1); }}>
            <option value="">All Priorities</option>
            {(['High','Medium','Low'] as Priority[]).map(p => <option key={p} value={p}>{p}</option>)}
          </select>
          <select style={selectStyle} value={filterCorridor} onChange={e => { setFilterCorridor(e.target.value); setPage(1); }}>
            <option value="">All Corridors</option>
            {CORRIDORS.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          {(search || filterStatus || filterPriority || filterCorridor) && (
            <button
              onClick={() => { setSearch(''); setFilterStatus(''); setFilterPriority(''); setFilterCorridor(''); setPage(1); }}
              style={{ background: 'transparent', border: '1px solid var(--border)', borderRadius: 6, padding: '8px 12px', fontSize: 12, color: 'var(--text-secondary)', cursor: 'pointer' }}
            >Clear</button>
          )}
        </div>

        {/* Table */}
        <div style={{ background: 'var(--card-bg)', border: '1px solid var(--border)', borderRadius: 8, overflow: 'hidden', marginBottom: 16 }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  {[
                    { key: 'id', label: 'Incident ID' },
                    { key: 'priority', label: 'Priority' },
                    { key: 'cause', label: 'Cause' },
                    { key: 'corridor', label: 'Corridor' },
                    { key: 'junction', label: 'Junction' },
                    { key: 'status', label: 'Status' },
                    { key: 'timeOfIncident', label: 'Time' },
                    { key: 'resolutionTimeMin', label: 'Resolution' },
                    { key: 'impactScore', label: 'Impact' },
                  ].map(col => (
                    <th key={col.key} style={thStyle} onClick={() => handleSort(col.key)}>
                      {col.label}<SortIcon k={col.key} />
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {paginated.length === 0 && (
                  <tr>
                    <td colSpan={9} style={{ padding: '32px', textAlign: 'center', color: 'var(--text-secondary)', fontSize: 13 }}>
                      No incidents match this filter
                    </td>
                  </tr>
                )}
                {paginated.map((inc, idx) => (
                  <tr
                    key={inc.id}
                    style={{ background: idx % 2 === 0 ? 'transparent' : 'var(--surface-2)', borderBottom: '1px solid var(--border)' }}
                  >
                    <td style={{ padding: '10px 14px' }}>
                      <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--nav-active-text)' }}>{inc.id}</span>
                    </td>
                    <td style={{ padding: '10px 14px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <div style={{ width: 7, height: 7, borderRadius: '50%', background: PRIORITY_DOT[inc.priority] || '#8896A5', flexShrink: 0 }} />
                        <span style={{ fontSize: 12, color: PRIORITY_DOT[inc.priority] || '#8896A5', fontWeight: 600 }}>{inc.priority}</span>
                      </div>
                    </td>
                    <td style={{ padding: '10px 14px', fontSize: 12, color: 'var(--text-primary)' }}>{CAUSE_LABELS[inc.cause] || inc.cause}</td>
                    <td style={{ padding: '10px 14px', fontSize: 12, color: 'var(--text-secondary)' }}>{inc.corridor}</td>
                    <td style={{ padding: '10px 14px', fontSize: 12, color: 'var(--text-secondary)' }}>{inc.junction || '—'}</td>
                    <td style={{ padding: '10px 14px' }}><StatusPill status={inc.status} /></td>
                    <td style={{ padding: '10px 14px', fontSize: 12, color: 'var(--text-secondary)', whiteSpace: 'nowrap' }}>
                      {new Date(inc.timeOfIncident).toLocaleString('en-IN', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td style={{ padding: '10px 14px', fontSize: 12, color: inc.resolutionTimeMin ? 'var(--green)' : 'var(--text-muted)' }}>
                      {inc.resolutionTimeMin ? `${inc.resolutionTimeMin}m` : '—'}
                    </td>
                    <td style={{ padding: '10px 14px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <div style={{ width: 40, height: 4, borderRadius: 2, background: 'var(--surface-3)', overflow: 'hidden' }}>
                          <div style={{ height: '100%', width: `${inc.impactScore}%`, background: 'var(--accent)', borderRadius: 2 }} />
                        </div>
                        <span style={{ fontSize: 11, color: 'var(--text-secondary)' }}>{inc.impactScore}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
            Showing {filtered.length === 0 ? 0 : (page-1)*PAGE_SIZE+1}–{Math.min(page*PAGE_SIZE, filtered.length)} of {filtered.length}
          </div>
          <div style={{ display: 'flex', gap: 6 }}>
            <button
              disabled={page === 1}
              onClick={() => setPage(p => p - 1)}
              style={{ padding: '6px 12px', fontSize: 12, background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: 6, color: 'var(--text-secondary)', cursor: page === 1 ? 'not-allowed' : 'pointer', opacity: page === 1 ? 0.4 : 1 }}
            >Prev</button>
            {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => i + 1).map(p => (
              <button
                key={p}
                onClick={() => setPage(p)}
                style={{ padding: '6px 10px', fontSize: 12, background: p === page ? 'var(--accent)' : 'var(--surface-2)', border: `1px solid ${p === page ? 'var(--accent)' : 'var(--border)'}`, borderRadius: 6, color: p === page ? '#fff' : 'var(--text-secondary)', cursor: 'pointer' }}
              >{p}</button>
            ))}
            <button
              disabled={page === totalPages || totalPages === 0}
              onClick={() => setPage(p => p + 1)}
              style={{ padding: '6px 12px', fontSize: 12, background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: 6, color: 'var(--text-secondary)', cursor: page === totalPages ? 'not-allowed' : 'pointer', opacity: page === totalPages || totalPages === 0 ? 0.4 : 1 }}
            >Next</button>
          </div>
        </div>

      </div>
    </div>
  );
}
