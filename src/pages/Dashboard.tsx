import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { usePanel } from '../components/layout/Layout';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import BangaloreMap from '../components/map/BangaloreMap';
import { Badge } from '../components/ui/Badge';
import { useToast } from '../components/ui/Toast';
import { useIncidents } from '../hooks/useIncidents';
import { useMLScore } from '../hooks/useMLScore';
import { CORRIDORS } from '../data/corridors';
import { JUNCTIONS } from '../data/junctions';
import { estimateManpower } from '../utils/manpowerEstimator';
import { estimateClearanceTime } from '../utils/impactScorer';
import { getDiversionRoutes } from '../utils/diversionSuggester';
import type { Incident, IncidentCause, ImpactLevel } from '../types';

// ─── helpers ────────────────────────────────────────────────────────────────

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const min = Math.floor(diff / 60000);
  if (min < 60) return `${min}m ago`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr}h ago`;
  return `${Math.floor(hr / 24)}d ago`;
}

function generateId() {
  return 'TSID' + String(Math.floor(10000 + Math.random() * 90000));
}

const CAUSE_LABELS: Record<string, string> = {
  vehicle_breakdown: 'Vehicle Breakdown', accident: 'Accident',
  pot_holes: 'Pot Holes', construction: 'Construction',
  water_logging: 'Water Logging', tree_fall: 'Tree Fall',
  public_event: 'Public Event', vip_movement: 'VIP Movement', others: 'Others',
};
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

const CORRIDOR_COORDS_MAP: Record<string, [number, number][]> = {
  'Mysore Road':    [[12.9766, 77.5713], [12.9600, 77.5550], [12.9450, 77.5350], [12.9200, 77.5100]],
  'Bellary Road 1': [[13.0027, 77.5800], [13.0200, 77.5830], [13.0400, 77.5815], [13.0600, 77.5780]],
  'Bellary Road 2': [[13.0600, 77.5780], [13.0800, 77.5750], [13.1000, 77.5720], [13.1300, 77.5700]],
  'Tumkur Road':    [[12.9950, 77.5560], [13.0100, 77.5400], [13.0200, 77.5250], [13.0350, 77.5100]],
  'Hosur Road':     [[12.9352, 77.6245], [12.9150, 77.6350], [12.8900, 77.6430], [12.8600, 77.6500]],
  'ORR East 1':     [[12.9352, 77.6245], [12.9450, 77.6500], [12.9600, 77.6750], [12.9716, 77.7000]],
  'ORR East 2':     [[12.9716, 77.7000], [12.9900, 77.6950], [13.0050, 77.6870], [13.0200, 77.6800]],
  'ORR North 1':    [[13.0200, 77.5800], [13.0300, 77.5950], [13.0400, 77.6100], [13.0500, 77.6200]],
  'CBD 1':          [[12.9716, 77.5946], [12.9750, 77.6010], [12.9780, 77.6060], [12.9800, 77.6100]],
  'CBD 2':          [[12.9800, 77.6100], [12.9840, 77.6140], [12.9870, 77.6170], [12.9900, 77.6200]],
};
const OPEN_ROUTE_ALTS: Record<string, [number, number][]> = {
  'Mysore Road':    [[12.9766, 77.5713], [12.9580, 77.5600], [12.9380, 77.5420], [12.9200, 77.5200]],
  'Bellary Road 1': [[13.0027, 77.5800], [13.0200, 77.6000], [13.0450, 77.6050], [13.0600, 77.5900]],
  'Hosur Road':     [[12.9352, 77.6245], [12.9200, 77.6480], [12.8950, 77.6550], [12.8600, 77.6600]],
  'ORR East 1':     [[12.9352, 77.6245], [12.9500, 77.6600], [12.9650, 77.6850], [12.9716, 77.7000]],
  'Tumkur Road':    [[12.9950, 77.5560], [13.0050, 77.5300], [13.0150, 77.5150], [13.0350, 77.5000]],
};

type ActivePanel = 'none' | 'log' | 'plan' | 'detail' | 'recommendation';
type TabFilter = 'all' | 'active' | 'resolved' | 'high' | 'closure';

// ─── shared panel shell ──────────────────────────────────────────────────────

function PanelShell({ title, onClose, children, footer }: {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
  footer?: React.ReactNode;
}) {
  return (
    <div
      className="absolute right-0 bottom-0 flex flex-col"
      style={{
        width: 420,
        top: 0,
        zIndex: 50,
        background: 'var(--surface-2)',
        borderLeft: '1px solid var(--border)',
        boxShadow: '-4px 0 16px rgba(0,0,0,0.2)'
      }}
    >
      <div className="flex items-center justify-between px-5 py-3" style={{ borderBottom: '1px solid var(--border)' }}>
        <span className="text-[15px] font-semibold" style={{ color: 'var(--text-primary)' }}>{title}</span>
        <button onClick={onClose} className="text-xl leading-none" style={{ color: 'var(--text-secondary)' }}>×</button>
      </div>
      <div className="flex-1 overflow-y-auto px-5 py-4">{children}</div>
      {footer && (
        <div className="px-5 py-4 flex gap-3" style={{ borderTop: '1px solid var(--border)' }}>{footer}</div>
      )}
    </div>
  );
}

// ─── Log Incident panel ───────────────────────────────────────────────────────

function LogIncidentPanel({ onClose, clickPin, onSubmitted }: {
  onClose: () => void;
  clickPin: { lat: number; lng: number } | null;
  onSubmitted?: (incident: Incident) => void;
}) {
  const { showToast } = useToast();
  const { getScore } = useMLScore();
  const { addIncident, incidents } = useIncidents();
  const [step, setStep] = useState(1);
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
    lat: clickPin?.lat ?? 12.9716,
    lng: clickPin?.lng ?? 77.5946,
  });

  const set = (key: string, val: unknown) => setForm(f => ({ ...f, [key]: val }));

  const scoreData = form.cause && form.corridor
    ? getScore(form.cause as IncidentCause, form.corridor, form.timeOfIncident, form.requiresRoadClosure)
    : null;

  const handleSubmit = (isDraft: boolean) => {
    const now = new Date().toISOString();
    const incident: Incident = {
      id: generateId(),
      cause: form.cause as IncidentCause,
      corridor: form.corridor,
      junction: form.junction,
      address: form.address,
      lat: clickPin?.lat ?? form.lat,
      lng: clickPin?.lng ?? form.lng,
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
    showToast(isDraft ? `Draft saved — ${incident.id}` : `Incident logged — ${incident.id}`, 'success');
    if (!isDraft && onSubmitted) {
      onSubmitted(incident);
    } else {
      onClose();
    }
  };

  const lbl = 'block text-[12px] font-medium mb-1 text-[var(--text-secondary)]';
  const inp = 'w-full border border-[var(--border)] bg-[var(--surface-2)] rounded px-3 py-2 text-[13px] text-[var(--text-primary)] focus:outline-none focus:border-[#2E86C1]';

  return (
    <PanelShell
      title="Log Incident"
      onClose={onClose}
      footer={
        <>
          {step > 1 && <button onClick={() => setStep(s => s - 1)} className="px-4 py-2 text-[13px] border border-[var(--border)] rounded text-[var(--text-secondary)] hover:bg-[var(--surface-3)]">Back</button>}
          {step < 3 && (
            <button
              onClick={() => setStep(s => s + 1)}
              disabled={!form.cause || !form.corridor}
              className="flex-1 px-4 py-2 text-[13px] bg-[var(--accent)] text-white rounded font-medium hover:bg-[var(--accent-hover)] disabled:opacity-40"
            >Next</button>
          )}
          {step === 3 && (
            <>
              <button onClick={() => handleSubmit(false)} className="flex-1 px-4 py-2 text-[13px] bg-[var(--accent)] text-white rounded font-medium hover:bg-[var(--accent-hover)]">Submit Incident</button>
              <button onClick={() => handleSubmit(true)} className="px-4 py-2 text-[13px] border border-[var(--border)] rounded text-[var(--text-secondary)] hover:bg-[var(--surface-3)]">Save Draft</button>
            </>
          )}
        </>
      }
    >
      {/* Step indicator */}
      <div className="flex items-center gap-2 mb-5">
        {[1, 2, 3].map(s => (
          <div key={s} className="flex items-center gap-2">
            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-semibold ${step >= s ? 'bg-[var(--accent)] text-white' : 'bg-[var(--surface-3)] text-[var(--text-muted)] border border-[var(--border)]'}`}>{s}</div>
            {s < 3 && <div className={`h-0.5 w-8 ${step > s ? 'bg-[var(--accent)]' : 'bg-[var(--border)]'}`} />}
          </div>
        ))}
        <span className="ml-2 text-[12px] text-[var(--text-muted)]">Step {step}/3</span>
      </div>

      {step === 1 && (
        <div className="space-y-4">
          <div><label className={lbl}>Cause *</label>
            <select className={inp} value={form.cause} onChange={e => set('cause', e.target.value)}>
              <option value="">Select cause</option>
              {CAUSES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
            </select>
          </div>
          <div><label className={lbl}>Corridor *</label>
            <select className={inp} value={form.corridor} onChange={e => set('corridor', e.target.value)}>
              <option value="">Select corridor</option>
              {CORRIDORS.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div><label className={lbl}>Junction</label>
            <select className={inp} value={form.junction} onChange={e => set('junction', e.target.value)}>
              <option value="">Select junction</option>
              {JUNCTIONS.map(j => <option key={j} value={j}>{j}</option>)}
            </select>
          </div>
          {form.corridor && (() => {
            const now = Date.now();
            const thirtyDays = 30 * 24 * 60 * 60 * 1000;
            const priorCount = incidents.filter(i =>
              i.corridor === form.corridor &&
              (now - new Date(i.createdAt).getTime()) < thirtyDays
            ).length;
            return priorCount > 0 ? (
              <div className="text-[12px] text-[var(--nav-active-text)] bg-[var(--nav-active-bg)] border border-[var(--section-events-border)] rounded p-2.5 flex items-start gap-2">
                <span>ℹ</span>
                <span>{priorCount} prior incident{priorCount !== 1 ? 's' : ''} on {form.corridor} in the last 30 days</span>
              </div>
            ) : null;
          })()}
          <div><label className={lbl}>Address</label>
            <input className={inp} value={form.address} onChange={e => set('address', e.target.value)} placeholder="Street address" />
          </div>
          <div><label className={lbl}>Direction of Travel</label>
            <input className={inp} value={form.direction} onChange={e => set('direction', e.target.value)} placeholder="e.g. North to South" />
          </div>
          <div><label className={lbl}>Time of Incident</label>
            <input type="datetime-local" className={inp} value={form.timeOfIncident} onChange={e => set('timeOfIncident', e.target.value)} />
          </div>
          <div className="text-[12px] text-[var(--nav-active-text)] bg-[var(--nav-active-bg)] border border-[var(--section-events-border)] rounded p-2.5">
            📍 Click on the map to pin the exact incident location
            {clickPin && <div className="mt-1 text-[11px] text-[var(--text-secondary)]">Pinned: {clickPin.lat.toFixed(4)}, {clickPin.lng.toFixed(4)}</div>}
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-4">
          <div><label className={lbl}>Vehicle Type</label>
            <select className={inp} value={form.vehicleType} onChange={e => set('vehicleType', e.target.value)}>
              <option value="">Not applicable</option>
              {['Car', 'Motorcycle', 'Bus', 'Truck', 'Auto', 'Other'].map(v => <option key={v} value={v}>{v}</option>)}
            </select>
          </div>
          {form.vehicleType && (
            <div><label className={lbl}>Vehicle Number</label>
              <input className={inp} value={form.vehicleNumber} onChange={e => set('vehicleNumber', e.target.value)} placeholder="KA01AB1234" />
            </div>
          )}
          {form.cause === 'vehicle_breakdown' && (
            <div><label className={lbl}>Breakdown Reason</label>
              <input className={inp} value={form.breakdownReason} onChange={e => set('breakdownReason', e.target.value)} placeholder="e.g. Engine failure" />
            </div>
          )}
          <div><label className={lbl}>Description</label>
            <textarea className={`${inp} resize-none`} rows={4} value={form.description} onChange={e => set('description', e.target.value)} placeholder="Describe the incident…" />
          </div>
          <div className="flex items-center gap-3">
            <input type="checkbox" id="rc" checked={form.requiresRoadClosure} onChange={e => set('requiresRoadClosure', e.target.checked)} className="w-4 h-4" />
            <label htmlFor="rc" className="text-[13px] text-[var(--text-primary)]">Requires Road Closure</label>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="space-y-4">
          <div className="text-[13px] font-semibold text-[var(--text-primary)] uppercase tracking-wide">Impact Assessment</div>
          {scoreData ? (
            <>
              <div className="flex items-center gap-3">
                <Badge variant={scoreData.level.toLowerCase() as 'high' | 'medium' | 'low'}>{scoreData.level} Impact</Badge>
                <span className="text-[13px] text-[var(--text-secondary)]">Score: {scoreData.score}/100</span>
              </div>
              {[
                { label: 'Cause Severity', value: scoreData.score },
                { label: 'Corridor Weight', value: Math.round(scoreData.score * 0.9) },
                { label: 'Time Factor', value: Math.round(scoreData.score * 0.8) },
              ].map(bar => (
                <div key={bar.label}>
                  <div className="flex justify-between text-[12px] text-[var(--text-secondary)] mb-1">
                    <span>{bar.label}</span><span className="font-medium">{bar.value}/100</span>
                  </div>
                  <div className="h-2 bg-[var(--surface-3)] rounded overflow-hidden">
                    <div className="h-full rounded" style={{ width: `${bar.value}%`, background: bar.value >= 80 ? '#B03A2E' : bar.value >= 50 ? '#D35400' : '#27AE60' }} />
                  </div>
                </div>
              ))}
              <div className="bg-[var(--surface-3)] rounded p-3 space-y-2 text-[13px]">
                <div className="flex justify-between"><span className="text-[var(--text-secondary)]">Est. Clearance</span><span className="font-medium text-[var(--text-primary)]">{estimateClearanceTime(form.cause, form.corridor)}</span></div>
                <div className="flex justify-between"><span className="text-[var(--text-secondary)]">Manpower</span><span className="font-medium text-[var(--text-primary)] text-right text-[12px]">{estimateManpower(scoreData.level as ImpactLevel, form.requiresRoadClosure)}</span></div>
              </div>
            </>
          ) : (
            <div className="text-[13px] text-[var(--text-muted)]">Complete steps 1 & 2 to see assessment.</div>
          )}
        </div>
      )}
    </PanelShell>
  );
}

// ─── Incident Detail panel ────────────────────────────────────────────────────

const DEPLOYMENT_POINTS: Record<string, string[]> = {
  'Hosur Road': ['Silk Board Junction', 'BTM Layout Signal', 'Electronic City Toll'],
  'Bellary Road 1': ['Hebbal Flyover', 'Mekhri Circle', 'Yelahanka Junction'],
  'Bellary Road 2': ['Yelahanka Junction', 'Doddaballapura Road', 'Devanahalli Junction'],
  'Mysore Road': ['Kengeri Signal', 'Nayandahalli Junction', 'Mysore Road NICE Interchange'],
  'Tumkur Road': ['Yeshwanthpur Junction', 'Peenya Junction', 'Jalahalli Cross'],
  'ORR East 1': ['Silk Board Junction', 'HSR Layout Junction', 'Marathahalli Bridge'],
  'ORR East 2': ['Marathahalli Bridge', 'KR Puram Bridge', 'ITPL Junction'],
  'CBD 1': ['MG Road Junction', 'Brigade Road Signal', 'Shivajinagar Bus Stand'],
  'CBD 2': ['Vidhana Soudha', 'Cubbon Park Gate', 'Infantry Road'],
  'Airport Road': ['Domlur Flyover', 'Old Airport Road Junction', 'Hebbal'],
};

function getOfficerCount(priority: string, requiresRoadClosure: boolean): string {
  if (priority === 'High' && requiresRoadClosure) return '8–12 officers';
  if (priority === 'High') return '5–8 officers';
  if (priority === 'Medium' && requiresRoadClosure) return '5–8 officers';
  if (priority === 'Medium') return '3–5 officers';
  return '2–3 officers';
}

function IncidentDetailPanel({ incident, onClose }: { incident: Incident; onClose: () => void }) {
  const { incidents, updateIncident } = useIncidents();
  const { showToast } = useToast();
  const [note, setNote] = useState('');
  const [status, setStatus] = useState(incident.status);
  const [showThankYou, setShowThankYou] = useState(false);

  const diversionRoutes = getDiversionRoutes(incident.corridor);
  const c = incident.priority === 'High' ? '#B03A2E' : incident.priority === 'Medium' ? '#D35400' : '#27AE60';
  const deployPoints = DEPLOYMENT_POINTS[incident.corridor] || ['Junction Point A', 'Junction Point B', 'Junction Point C'];
  const corridorHistory = incidents.filter(i => i.corridor === incident.corridor && i.id !== incident.id).slice(0, 3);
  const trafficVolume = incident.priority === 'High' ? '~18,000 vehicles/hour' : incident.priority === 'Medium' ? '~9,000 vehicles/hour' : '~3,000 vehicles/hour';

  const addNote = () => {
    if (!note.trim()) return;
    const n = { text: note.trim(), timestamp: new Date().toISOString(), author: 'Admin' };
    updateIncident(incident.id, { officerNotes: [...incident.officerNotes, n] });
    setNote('');
    showToast('Note added', 'success');
  };

  const updateStatus = () => {
    updateIncident(incident.id, { status, updatedAt: new Date().toISOString(), resolvedAt: status === 'resolved' ? new Date().toISOString() : undefined });
    showToast('Status updated', 'success');
    if (status === 'closed') setShowThankYou(true);
  };

  const divider = <div style={{ height: 1, background: 'var(--border)', margin: '12px 0' }} />;

  return (
    <PanelShell title="Incident Detail" onClose={onClose}>
      {showThankYou && (
        <div style={{ position: 'absolute', inset: 0, background: 'var(--surface)', zIndex: 100, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: 32 }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>✓</div>
          <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 8 }}>Incident Closed</div>
          <div style={{ fontSize: 15, color: 'var(--green)', fontWeight: 600, marginBottom: 16 }}>Thank you for your prompt response!</div>
          <div style={{ fontSize: 13, color: 'var(--text-secondary)', maxWidth: 280, lineHeight: 1.6 }}>
            Your data is helping us improve our AI model and response recommendations for future incidents across Bengaluru.
          </div>
          <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 16, fontStyle: 'italic' }}>
            Model update queued · Traffic Saarthi AI
          </div>
          <button
            onClick={() => { setShowThankYou(false); onClose(); }}
            style={{ marginTop: 24, padding: '10px 24px', background: 'var(--accent)', color: 'white', border: 'none', borderRadius: 6, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}
          >
            Return to Dashboard
          </button>
        </div>
      )}
      {/* Section 1 — Header */}
      <div className="mb-3">
        <div className="flex items-center gap-2 mb-1.5 flex-wrap">
          <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: c }} />
          <span className="text-[13px] font-bold" style={{ color: 'var(--text-primary)' }}>{incident.id}</span>
          <Badge variant={incident.priority.toLowerCase() as 'high' | 'medium' | 'low'}>{incident.priority}</Badge>
          <Badge variant={incident.status as 'active' | 'resolved' | 'closed'}>{incident.status}</Badge>
        </div>
        <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>{CAUSE_LABELS[incident.cause] || incident.cause}</div>
        <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{incident.corridor}{incident.junction ? ` · ${incident.junction}` : ''}</div>
        <div className="flex items-center gap-2 mt-1">
          <span style={{ fontSize: 11, color: 'var(--text-secondary)' }}>Logged {timeAgo(incident.createdAt)}</span>
          {incident.requiresRoadClosure && (
            <span style={{ fontSize: 11, fontWeight: 600, color: '#B03A2E', background: 'rgba(176,58,46,0.1)', padding: '2px 8px', borderRadius: 10 }}>Road Closed</span>
          )}
        </div>
      </div>

      {divider}

      {/* Section 2 — Update Status */}
      <div className="mb-1">
        <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8 }}>Update Status</div>
        <div className="flex gap-2">
          <select
            style={{
              flex: 1,
              border: '1px solid var(--border)',
              background: 'var(--surface-3)',
              borderRadius: 4,
              padding: '6px 12px',
              fontSize: 13,
              color: 'var(--text-primary)',
              outline: 'none'
            }}
            value={status}
            onChange={e => setStatus(e.target.value as typeof status)}
          >
            <option value="active">Active</option>
            <option value="resolved">Resolved</option>
            <option value="closed">Closed</option>
          </select>
          <button onClick={updateStatus} className="px-4 py-2 bg-[#2E86C1] text-white text-[13px] rounded font-medium hover:bg-[#1F51C6]">Update</button>
        </div>
      </div>

      {divider}

      {/* Section 3 — Resource Allocation */}
      <div style={{ background: 'var(--section-resources)', border: '1px solid var(--section-resources-border)', borderRadius: 6, padding: 12 }}>
        <div className="flex items-center gap-2 mb-2">
          <div style={{ fontSize: 11, fontWeight: 700, color: '#27AE60', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Resource Allocation</div>
          <span style={{ fontSize: 10, fontWeight: 700, color: '#27AE60', background: 'rgba(39, 174, 96, 0.15)', padding: '2px 6px', borderRadius: 4 }}>AUTO</span>
        </div>
        <div style={{ fontSize: 12, color: 'var(--text-primary)', marginBottom: 4 }}>Officers Required: <span style={{ fontWeight: 600 }}>{getOfficerCount(incident.priority, incident.requiresRoadClosure)}</span></div>
        <div style={{ fontSize: 12, color: 'var(--text-primary)', marginBottom: 8 }}>Barricades: <span style={{ fontWeight: 600 }}>{incident.priority === 'High' ? '4–6' : incident.priority === 'Medium' ? '2–4' : '1–2'}</span></div>
        <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 4 }}>Deployment Points:</div>
        {deployPoints.map((pt, i) => (
          <div key={i} style={{ fontSize: 11, color: 'var(--text-secondary)', display: 'flex', gap: 6, alignItems: 'start', marginBottom: 2 }}>
            <span style={{ color: '#27AE60' }}>•</span> {pt}
          </div>
        ))}
      </div>

      {divider}

      {/* Section 4 — Recommendations */}
      <div className="mb-1">
        <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8 }}>Recommendations</div>
        {incident.requiresRoadClosure && diversionRoutes.length > 0 && (
          <div style={{ background: 'var(--section-resources)', border: '1px solid var(--section-resources-border)', borderRadius: 6, padding: 12, marginBottom: 8 }}>
            <div className="flex items-center gap-2 mb-2">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#27AE60" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              <span style={{ fontSize: 12, fontWeight: 600, color: '#27AE60' }}>{diversionRoutes[0].label}</span>
              <span className="ml-auto" style={{ fontSize: 11, fontWeight: 500, color: 'var(--text-secondary)' }}>{diversionRoutes[0].estimatedDelay}</span>
            </div>
            <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginBottom: 4 }}>Divert at: {diversionRoutes[0].steps[0]}</div>
            <ol className="space-y-0.5 ml-3" style={{ listStyleType: 'decimal' }}>
              {diversionRoutes[0].steps.map((s, j) => (
                <li key={j} style={{ fontSize: 11, color: 'var(--text-secondary)' }}>{s}</li>
              ))}
            </ol>
            <div style={{ fontSize: 11, color: '#27AE60', fontWeight: 600, marginTop: 6 }}>Rejoin at: {diversionRoutes[0].rejoinsAt}</div>
          </div>
        )}
        <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 6 }}>
          This corridor has had <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{corridorHistory.length}</span> prior incident{corridorHistory.length !== 1 ? 's' : ''}.
        </div>
        {incident.priority === 'High' && (
          <div style={{ fontSize: 12, color: '#D35400', background: 'rgba(211,84,0,0.08)', borderRadius: 4, padding: 8 }}>
            ⚠ Deploy backup officers — ETA clearance: {estimateClearanceTime(incident.cause, incident.corridor)}
          </div>
        )}
      </div>

      {divider}

      {/* Section 5 — Impact */}
      <div className="mb-1">
        <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8 }}>Impact</div>
        <div className="flex justify-between mb-1" style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
          <span>Impact Score</span><span style={{ fontWeight: 500, color: 'var(--text-primary)' }}>{incident.impactScore}/100</span>
        </div>
        <div className="h-2 rounded overflow-hidden mb-3" style={{ background: 'var(--surface-3)' }}>
          <div className="h-full rounded" style={{ width: `${incident.impactScore}%`, background: c }} />
        </div>
        <div className="space-y-1.5" style={{ fontSize: 12 }}>
          <div className="flex justify-between"><span style={{ color: 'var(--text-secondary)' }}>Estimated clearance</span><span style={{ fontWeight: 500, color: 'var(--text-primary)' }}>{estimateClearanceTime(incident.cause, incident.corridor)}</span></div>
          <div className="flex justify-between"><span style={{ color: 'var(--text-secondary)' }}>Traffic volume</span><span style={{ fontWeight: 500, color: 'var(--text-primary)' }}>{trafficVolume}</span></div>
          <div className="flex justify-between"><span style={{ color: 'var(--text-secondary)' }}>Lane status</span><span style={{ fontWeight: 500, color: 'var(--text-primary)' }}>{incident.requiresRoadClosure ? 'Full lane closure' : 'Partial obstruction'}</span></div>
        </div>
      </div>

      {corridorHistory.length > 0 && (
        <>
          {divider}
          {/* Section 6 — History on This Corridor */}
          <div className="mb-1">
            <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8 }}>History on This Corridor</div>
            {corridorHistory.map(h => {
              const hc = h.priority === 'High' ? '#B03A2E' : h.priority === 'Medium' ? '#D35400' : '#27AE60';
              return (
                <div key={h.id} className="flex items-center gap-2 py-1.5 border-b border-[var(--border)] text-[12px]">
                  <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: hc }} />
                  <span style={{ color: '#6B8FD4', fontSize: 11, fontWeight: 600 }}>{h.id}</span>
                  <span style={{ color: 'var(--text-primary)' }}>{CAUSE_LABELS[h.cause] || h.cause}</span>
                  <span className="ml-auto" style={{ color: 'var(--text-muted)', fontSize: 11 }}>{timeAgo(h.createdAt)}</span>
                </div>
              );
            })}
          </div>
        </>
      )}

      {divider}

      {/* Section 7 — Officer Notes */}
      <div>
        <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8 }}>Officer Notes</div>
        {incident.officerNotes.length === 0 && <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 8 }}>No notes yet.</div>}
        {incident.officerNotes.map((n, i) => (
          <div key={i} style={{ background: 'var(--surface-3)', border: '1px solid var(--border)', borderRadius: 6, padding: 8, marginBottom: 8, fontSize: 12 }}>
            <div style={{ color: 'var(--text-primary)' }}>{n.text}</div>
            <div style={{ color: 'var(--text-secondary)', marginTop: 4, fontSize: 11 }}>{n.author} · {new Date(n.timestamp).toLocaleString()}</div>
          </div>
        ))}
        <div className="flex gap-2 mt-2">
          <input
            style={{
              flex: 1,
              border: '1px solid var(--border)',
              background: 'var(--surface-3)',
              borderRadius: 4,
              padding: '6px 12px',
              fontSize: 12,
              color: 'var(--text-primary)',
              outline: 'none'
            }}
            placeholder="Add a note…"
            value={note}
            onChange={e => setNote(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && addNote()}
          />
          <button onClick={addNote} className="px-3 py-1.5 bg-[#2E86C1] text-white text-[12px] rounded hover:bg-[#1F51C6]">Add</button>
        </div>
      </div>
    </PanelShell>
  );
}

// ─── Incident Recommendation — Map + Full Page ───────────────────────────────

const recRouteCache = new Map<string, [number, number][]>();
async function fetchRecRoute(waypoints: [number, number][]): Promise<[number, number][]> {
  const key = waypoints.map(p => p.join(',')).join(';');
  if (recRouteCache.has(key)) return recRouteCache.get(key)!;
  try {
    const coords = waypoints.map(([lat, lng]) => `${lng},${lat}`).join(';');
    const res = await fetch(`https://router.project-osrm.org/route/v1/driving/${coords}?overview=full&geometries=geojson`);
    const json = await res.json();
    if (json.code !== 'Ok' || !json.routes?.length) return waypoints;
    const pts: [number, number][] = json.routes[0].geometry.coordinates.map(([lng, lat]: [number, number]) => [lat, lng]);
    recRouteCache.set(key, pts);
    return pts;
  } catch { return waypoints; }
}

function RecMap({ incident, corridorCoords, altCoords }: {
  incident: Incident;
  corridorCoords: [number, number][];
  altCoords: [number, number][] | null;
}) {
  const divRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);

  useEffect(() => {
    const container = divRef.current;
    if (!container) return;
    if (mapRef.current) return; // already initialised

    const map = L.map(container, {
      center: [incident.lat, incident.lng],
      zoom: 14,
      zoomControl: true,
      scrollWheelZoom: true,
    });
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
    }).addTo(map);
    mapRef.current = map;

    // Red incident pin
    L.marker([incident.lat, incident.lng], {
      icon: L.divIcon({
        className: '',
        html: '<div style="width:18px;height:18px;border-radius:50%;background:#B03A2E;border:3px solid #fff;box-shadow:0 2px 8px rgba(0,0,0,0.5)"></div>',
        iconSize: [18, 18], iconAnchor: [9, 9],
      }),
    }).bindTooltip(incident.id, { permanent: true, direction: 'top', offset: [0, -12] }).addTo(map);

    // Draw routes after tiles load
    (async () => {
      if (!mapRef.current) return;

      const closedPts = await fetchRecRoute(corridorCoords);
      if (!mapRef.current) return;
      const closedLine = L.polyline(closedPts, { color: '#B03A2E', weight: 7, opacity: 0.9 });
      closedLine.bindTooltip('⛔ CLOSED: ' + incident.corridor, { sticky: true });
      closedLine.addTo(mapRef.current);

      if (altCoords) {
        const altPts = await fetchRecRoute(altCoords);
        if (!mapRef.current) return;
        const altLine = L.polyline(altPts, { color: '#27AE60', weight: 5, dashArray: '12 7', opacity: 0.95 });
        altLine.bindTooltip('✓ Alternate Route', { sticky: true });
        altLine.addTo(mapRef.current);

        const bounds = L.latLngBounds([...closedPts, ...altPts] as L.LatLngTuple[]);
        mapRef.current.fitBounds(bounds, { padding: [60, 60], maxZoom: 15 });
      } else {
        mapRef.current.setView([incident.lat, incident.lng], 14);
      }
      mapRef.current.invalidateSize();
    })();

    return () => {
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return <div ref={divRef} style={{ width: '100%', height: '100%' }} />;
}

// ─── Incident Recommendation Page ─────────────────────────────────────────────

function IncidentRecommendationPage({ incident, onClose }: { incident: Incident; onClose: () => void }) {
  const diversionRoutes = getDiversionRoutes(incident.corridor);
  const corridorCoords = CORRIDOR_COORDS_MAP[incident.corridor]
    || ([[incident.lat, incident.lng], [incident.lat + 0.005, incident.lng + 0.005]] as [number, number][]);
  const altCoords = OPEN_ROUTE_ALTS[incident.corridor] || null;
  const deployPoints = DEPLOYMENT_POINTS[incident.corridor] || ['Entry junction', 'Mid-point', 'Exit junction'];
  const diversion = diversionRoutes[0] || null;
  const clearanceTime = estimateClearanceTime(incident.cause, incident.corridor);

  const priorityColor = incident.priority === 'High' ? '#B03A2E'
    : incident.priority === 'Medium' ? '#D35400' : '#27AE60';
  const officerRange = incident.priority === 'High' && incident.requiresRoadClosure ? '8–12'
    : incident.priority === 'High' ? '5–8'
    : incident.priority === 'Medium' && incident.requiresRoadClosure ? '5–8'
    : incident.priority === 'Medium' ? '3–5' : '2–3';
  const barricadeRange = incident.priority === 'High' ? '4–6' : incident.priority === 'Medium' ? '2–4' : '1–2';
  const nextSteps = [
    `Deploy ${officerRange} officers to key points on ${incident.corridor}.`,
    incident.requiresRoadClosure ? `Setup ${barricadeRange} barricades at closure points and activate diversion.` : `Monitor traffic flow and clear any secondary lane obstructions.`,
    `Coordinate with Bengaluru Traffic Control Room for status updates.`
  ];

  return createPortal(
    <>
      {/* Dim backdrop */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed', inset: 0, zIndex: 9998,
          background: 'rgba(10,21,32,0.4)', backdropFilter: 'blur(3px)',
        }}
      />

      {/* Modal card — centered, max 92vw × 88vh */}
      <div style={{
        position: 'fixed',
        top: '50%', left: '50%',
        transform: 'translate(-50%, -50%)',
        zIndex: 9999,
        width: 'min(1080px, 92vw)',
        height: 'min(640px, 88vh)',
        background: 'var(--card-bg)',
        borderRadius: 12,
        border: '1px solid var(--border)',
        boxShadow: '0 24px 80px rgba(0,0,0,0.3)',
        display: 'grid',
        gridTemplateRows: '52px 1fr',
        gridTemplateColumns: '400px 1fr',
        overflow: 'hidden',
        fontFamily: 'Inter, system-ui, sans-serif',
      }}>

        {/* ── Header — full width ── */}
        <div style={{
          gridColumn: '1 / -1', gridRow: '1',
          background: 'var(--surface)',
          borderBottom: '1px solid var(--border)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '0 18px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, width: '100%', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              {/* Green success tick */}
              <div style={{
                width: 26, height: 26, borderRadius: '50%', background: '#27AE60',
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
              </div>
              <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' }}>
                Incident Logged —&nbsp;
                <span style={{ color: '#6B8FD4', fontWeight: 600 }}>{incident.id}</span>
              </span>
              <span style={{
                fontSize: 10, fontWeight: 700, padding: '2px 9px', borderRadius: 20,
                background: `${priorityColor}20`, color: priorityColor, border: `1px solid ${priorityColor}40`,
              }}>{incident.priority.toUpperCase()}</span>
              <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
                {CAUSE_LABELS[incident.cause] || incident.cause} &middot; {incident.corridor}
              </span>
            </div>
            <button
              onClick={onClose}
              style={{
                fontSize: 20, lineHeight: 1, color: 'var(--text-secondary)', background: 'transparent',
                border: 'none', cursor: 'pointer', padding: '4px 8px', borderRadius: 4,
              }}
              onMouseOver={e => (e.currentTarget.style.color = 'var(--text-primary)')}
              onMouseOut={e => (e.currentTarget.style.color = 'var(--text-secondary)')}
              title="Close"
            >×</button>
          </div>
        </div>

        {/* ── Left panel — scrollable summary ── */}
        <div style={{
          gridColumn: '1', gridRow: '2',
          background: 'var(--surface-2)',
          borderRight: '1px solid var(--border)',
          overflowY: 'auto',
          padding: '14px 16px',
          display: 'flex', flexDirection: 'column', gap: 10,
        }}>

          {/* Impact + clearance banner */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 0,
            background: 'var(--surface-3)', border: '1px solid var(--border)', borderRadius: 8,
            overflow: 'hidden',
          }}>
            <div style={{
              width: 6, alignSelf: 'stretch', flexShrink: 0,
              background: priorityColor,
            }} />
            <div style={{ display: 'flex', flex: 1, padding: '10px 12px', gap: 12, alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: 9, fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Impact</div>
                <div style={{ fontSize: 24, fontWeight: 800, color: priorityColor, lineHeight: 1 }}>{incident.impactScore}<span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>/100</span></div>
              </div>
              <div style={{ width: 1, height: 36, background: 'var(--border)', flexShrink: 0 }} />
              <div>
                <div style={{ fontSize: 9, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Clearance</div>
                <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)' }}>{clearanceTime}</div>
              </div>
              <div style={{ width: 1, height: 36, background: 'var(--border)', flexShrink: 0 }} />
              <div>
                <div style={{ fontSize: 9, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Traffic</div>
                <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)' }}>
                  {incident.priority === 'High' ? '18k/hr' : incident.priority === 'Medium' ? '9k/hr' : '3k/hr'}
                </div>
              </div>
            </div>
          </div>

          {/* Incident details */}
          <Section title="Incident Details">
            <Row label="Cause" value={CAUSE_LABELS[incident.cause] || incident.cause} />
            <Row label="Corridor" value={incident.corridor} />
            {incident.junction && <Row label="Junction" value={incident.junction} />}
            {incident.address && <Row label="Location" value={incident.address} />}
            <Row label="Road Closure" value={incident.requiresRoadClosure ? 'Yes — Full closure' : 'No'} valueColor={incident.requiresRoadClosure ? '#B03A2E' : '#27AE60'} />
          </Section>

          {/* Resource allocation */}
          <Section title="Resources Required" accent="#27AE60" badge="AUTO">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6, marginBottom: 8 }}>
              {[
                { label: 'Officers', value: officerRange },
                { label: 'Barricades', value: barricadeRange },
              ].map(r => (
                <div key={r.label} style={{
                  background: 'var(--surface-3)', borderRadius: 6, padding: '8px 10px',
                  border: '1px solid var(--border)', textAlign: 'center',
                }}>
                  <div style={{ fontSize: 18, fontWeight: 800, color: '#27AE60' }}>{r.value}</div>
                  <div style={{ fontSize: 10, color: 'var(--text-secondary)', marginTop: 2 }}>{r.label}</div>
                </div>
              ))}
            </div>
            {deployPoints.slice(0, 3).map((pt, i) => (
              <div key={i} style={{ display: 'flex', gap: 6, alignItems: 'flex-start', marginBottom: 3 }}>
                <span style={{ fontSize: 10, color: '#27AE60', fontWeight: 700, flexShrink: 0, marginTop: 1 }}>#{i + 1}</span>
                <span style={{ fontSize: 11.5, color: 'var(--text-secondary)' }}>{pt}</span>
              </div>
            ))}
          </Section>

          {/* Diversion plan */}
          {incident.requiresRoadClosure && (
            <Section title="Road Diversion" accent="#2E86C1">
              {diversion ? (
                <>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                    <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)' }}>{diversion.label}</span>
                    <span style={{ fontSize: 11, color: '#2E86C1', fontWeight: 700, background: '#2E86C118', padding: '2px 7px', borderRadius: 4 }}>{diversion.estimatedDelay}</span>
                  </div>
                  {diversion.steps.map((step, i) => (
                    <div key={i} style={{ display: 'flex', gap: 7, alignItems: 'flex-start', marginBottom: 5 }}>
                      <div style={{
                        width: 16, height: 16, borderRadius: '50%', background: '#2E86C1',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 9, fontWeight: 700, color: '#fff', flexShrink: 0, marginTop: 1,
                      }}>{i + 1}</div>
                      <span style={{ fontSize: 11.5, color: 'var(--text-secondary)', lineHeight: 1.4 }}>{step}</span>
                    </div>
                  ))}
                  <div style={{ marginTop: 6, fontSize: 11.5, color: '#27AE60', fontWeight: 600 }}>✓ Rejoins: {diversion.rejoinsAt}</div>
                </>
              ) : (
                <div style={{ fontSize: 11.5, color: 'var(--text-muted)' }}>No pre-configured diversion. Coordinate manually.</div>
              )}
            </Section>
          )}

          {/* Next steps */}
          <Section title="Immediate Next Steps">
            {nextSteps.map((step, i) => (
              <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'flex-start', marginBottom: 6 }}>
                <div style={{
                  width: 17, height: 17, borderRadius: '50%', background: 'var(--surface-3)',
                  border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 9, fontWeight: 700, color: '#2E86C1', flexShrink: 0, marginTop: 1,
                }}>{i + 1}</div>
                <span style={{ fontSize: 11.5, color: 'var(--text-secondary)', lineHeight: 1.4 }}>{step}</span>
              </div>
            ))}
          </Section>

        </div>

        {/* ── Right panel — map ── */}
        <div style={{ gridColumn: '2', gridRow: '2', position: 'relative', background: 'var(--surface)' }}>
          <RecMap incident={incident} corridorCoords={corridorCoords} altCoords={altCoords} />

          {/* Legend */}
          <div style={{
            position: 'absolute', bottom: 14, left: 14, zIndex: 500,
            background: 'var(--surface)',
            border: '1px solid var(--border)', borderRadius: 8, padding: '10px 14px',
            display: 'flex', flexDirection: 'column', gap: 7,
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
          }}>
            <div style={{ fontSize: 9, fontWeight: 700, color: 'var(--text-secondary)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Map Legend</div>
            <LegendRow color="#B03A2E" label={`Closed — ${incident.corridor}`} />
            {altCoords && <LegendRow color="#27AE60" dash label="Alternate route" />}
            <LegendRow color="#B03A2E" dot label="Incident location" />
            {diversion && (
              <div style={{ fontSize: 10, color: 'var(--text-secondary)', marginTop: 2 }}>
                Diversion delay: <span style={{ color: 'var(--accent)', fontWeight: 600 }}>{diversion.estimatedDelay}</span>
              </div>
            )}
          </div>
        </div>

      </div>
    </>,
    document.body
  );
}

// Small helpers used only inside IncidentRecommendationPage
function Section({ title, accent, badge, children }: {
  title: string; accent?: string; badge?: string; children: React.ReactNode;
}) {
  return (
    <div style={{ background: 'var(--surface-3)', border: '1px solid var(--border)', borderRadius: 8, padding: '12px 14px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10, borderBottom: '1px solid var(--border)', paddingBottom: 8 }}>
        {accent && <div style={{ width: 3, height: 14, borderRadius: 2, background: accent, flexShrink: 0 }} />}
        <span style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: accent || 'var(--text-secondary)' }}>{title}</span>
        {badge && <span style={{ fontSize: 9, fontWeight: 700, color: accent, background: `${accent}20`, padding: '1px 6px', borderRadius: 10, marginLeft: 2 }}>{badge}</span>}
      </div>
      {children}
    </div>
  );
}

function Row({ label, value, valueColor }: { label: string; value: string; valueColor?: string }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6, fontSize: 12, width: '100%' }}>
      <span style={{ color: 'var(--text-secondary)' }}>{label}</span>
      <span style={{ color: valueColor || 'var(--text-primary)', fontWeight: 500, marginLeft: 'auto' }}>{value}</span>
    </div>
  );
}

function LegendRow({ color, dash, dot, label }: { color: string; dash?: boolean; dot?: boolean; label: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 11, color: 'var(--text-secondary)' }}>
      {dot
        ? <div style={{ width: 10, height: 10, borderRadius: '50%', background: color, flexShrink: 0 }} />
        : <div style={{ width: 22, height: 4, borderRadius: 2, background: color, flexShrink: 0, ...(dash ? { backgroundImage: `repeating-linear-gradient(90deg, ${color} 0 8px, transparent 8px 12px)`, background: 'none', borderBottom: `4px dashed ${color}` } : {}) }} />
      }
      {label}
    </div>
  );
}

// ─── Dashboard ───────────────────────────────────────────────────────────────

export default function Dashboard() {
  const { incidents, activeCount, highPriorityCount } = useIncidents();
  const { panel: extPanel, setPanel: extSetPanel, selectedId, setSelectedId } = usePanel();
  const [panel, setPanel] = useState<ActivePanel>('none');
  const [clickPin, setClickPin] = useState<{ lat: number; lng: number } | null>(null);
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);
  const [tab, setTab] = useState<TabFilter>('active');
  const [submittedIncident, setSubmittedIncident] = useState<Incident | null>(null);

  const activePanel = (extPanel as ActivePanel) ?? panel;
  const setActivePanel = (extSetPanel as (p: ActivePanel) => void) ?? setPanel;

  useEffect(() => {
    if (selectedId) {
      const found = incidents.find(i => i.id === selectedId);
      if (found) {
        setSelectedIncident(found);
        setActivePanel('detail');
      }
    }
  }, [selectedId, incidents, setActivePanel]);

  const handleClose = () => {
    setActivePanel('none');
    setSelectedIncident(null);
    setClickPin(null);
    if (setSelectedId) setSelectedId(null);
  };

  const handleIncidentClick = (inc: Incident) => {
    setSelectedIncident(inc);
    setActivePanel('detail');
    if (setSelectedId) setSelectedId(inc.id);
  };

  const filtered = incidents.filter(i => {
    if (tab === 'active') return i.status === 'active';
    if (tab === 'resolved') return i.status === 'resolved';
    if (tab === 'high') return i.priority === 'High';
    if (tab === 'closure') return i.status === 'active' && i.requiresRoadClosure;
    return true;
  });

  const closedSegments = incidents
    .filter(i => i.status === 'active' && i.requiresRoadClosure)
    .map(i => ({
      coords: CORRIDOR_COORDS_MAP[i.corridor] || ([[i.lat, i.lng], [i.lat + 0.005, i.lng + 0.005]] as [number, number][]),
      label: `CLOSED: ${i.corridor}`,
      incident: i,
    }));

  const openRoutes = incidents
    .filter(i => i.status === 'active' && i.requiresRoadClosure && OPEN_ROUTE_ALTS[i.corridor])
    .map(i => ({ coords: OPEN_ROUTE_ALTS[i.corridor], label: 'Alternate route', incident: i }));

  const mapDiversionRoutes = incidents
    .filter(i => i.status === 'active' && i.requiresRoadClosure)
    .flatMap(i => getDiversionRoutes(i.corridor).map(r => ({ from: r.from, to: r.to, label: r.label, incident: i })));

  const roadClosureCount = closedSegments.length;

  return (
    <div className="relative w-full" style={{ height: 'calc(100vh - 48px)' }}>
      {/* Map — full background */}
      <div className="absolute inset-0" style={{ zIndex: 0 }}>
        <BangaloreMap
          incidents={filtered}
          selectedIncidentId={selectedIncident?.id}
          onIncidentClick={handleIncidentClick}
          onMapClick={activePanel === 'log' ? (lat, lng) => setClickPin({ lat, lng }) : undefined}
          clickPin={activePanel === 'log' ? clickPin : null}
          height="100%"
          interactive={true}
          closedSegments={closedSegments}
          openRoutes={openRoutes}
          diversionRoutes={mapDiversionRoutes}
        />
      </div>

      {/* Compact stats overlay — top left above map, shifted to avoid zoom controls */}
      <div className="absolute top-3 left-[60px] z-10 flex gap-2">
        <button 
          onClick={() => setTab('active')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded transition-all border ${tab === 'active' ? 'border-[#B03A2E]' : 'border-transparent'}`} 
          style={{ background: 'var(--card-bg)', color: 'var(--text-primary)', border: '1px solid var(--border)', boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }}
        >
          <div className="w-2 h-2 rounded-full bg-[#B03A2E]" />
          <span className="text-[12px] font-medium" style={{ color: 'var(--text-primary)' }}>{activeCount} Active</span>
        </button>
        <button 
          onClick={() => setTab('high')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded transition-all border ${tab === 'high' ? 'border-[#D35400]' : 'border-transparent'}`} 
          style={{ background: 'var(--card-bg)', color: 'var(--text-primary)', border: '1px solid var(--border)', boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }}
        >
          <div className="w-2 h-2 rounded-full bg-[#D35400]" />
          <span className="text-[12px] font-medium" style={{ color: 'var(--text-primary)' }}>{highPriorityCount} High Priority</span>
        </button>
        {roadClosureCount > 0 && (
          <button 
            onClick={() => setTab('closure')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded transition-all border ${tab === 'closure' ? 'border-[var(--text-primary)]' : 'border-transparent'}`} 
            style={{ background: 'var(--card-bg)', color: 'var(--text-primary)', border: '1px solid var(--border)', boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }}
          >
            <span className="text-[12px] font-medium" style={{ color: 'var(--text-primary)' }}>{roadClosureCount} Road Closure{roadClosureCount > 1 ? 's' : ''}</span>
          </button>
        )}
      </div>

      {/* Incident feed — bottom strip on map, tab-filtered */}
      <div
        className="absolute bottom-0 left-0 z-10 flex gap-0"
        style={{ right: activePanel !== 'none' ? 420 : 0 }}
      >
        {/* Tab bar */}
        <div
          className="flex flex-col"
          style={{ background: 'var(--surface)', borderTop: '1px solid var(--border)', width: '100%' }}
        >
          {/* Tabs */}
          <div className="flex items-center px-3 pt-2 gap-1" style={{ borderBottom: '1px solid var(--border)' }}>
            {(['all', 'active', 'resolved', 'high', 'closure'] as TabFilter[]).map(t => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`px-3 py-1.5 text-[11px] font-medium rounded-t capitalize transition-colors`}
                style={{
                  background: tab === t ? 'var(--surface-3)' : 'transparent',
                  color: tab === t ? 'var(--text-primary)' : 'var(--text-secondary)',
                  border: tab === t ? '1px solid var(--border)' : '1px solid transparent',
                  borderBottom: 'none'
                }}
              >
                {t === 'high' ? 'High Priority' : t === 'closure' ? 'Road Closures' : t}
              </button>
            ))}
            <span className="ml-auto text-[11px] pr-2" style={{ color: 'var(--text-secondary)' }}>{filtered.length} incidents</span>
          </div>

          {/* Horizontal scrolling cards */}
          <div className="flex overflow-x-auto gap-2 px-3 py-2" style={{ scrollbarWidth: 'none' }}>
            {filtered.length === 0 && (
              <div className="text-[12px] py-1" style={{ color: 'var(--text-secondary)' }}>No incidents match this filter.</div>
            )}
            {filtered.slice(0, 20).map(inc => (
              <button
                key={inc.id}
                onClick={() => handleIncidentClick(inc)}
                className="flex-shrink-0 text-left rounded p-2.5 transition-colors"
                style={{
                  minWidth: 180,
                  background: selectedIncident?.id === inc.id ? 'var(--surface-3)' : 'var(--surface-2)',
                  border: selectedIncident?.id === inc.id ? '1px solid var(--accent)' : '1px solid var(--border)',
                }}
              >
                <div className="flex items-center gap-1.5 mb-1">
                  <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${inc.priority === 'High' ? 'bg-[#B03A2E]' : inc.priority === 'Medium' ? 'bg-[#D35400]' : 'bg-[#27AE60]'}`} />
                  <span className="text-[11px] font-semibold" style={{ color: 'var(--text-primary)' }}>{inc.id}</span>
                  <Badge variant={inc.status as 'active' | 'resolved' | 'closed' | 'draft'}>{inc.status}</Badge>
                </div>
                <div className="text-[11px] font-medium" style={{ color: 'var(--text-primary)' }}>{CAUSE_LABELS[inc.cause] || inc.cause}</div>
                <div className="text-[10px]" style={{ color: 'var(--text-secondary)' }}>{inc.corridor}</div>
                <div className="text-[10px]" style={{ color: 'var(--text-muted)', marginTop: 2 }}>{timeAgo(inc.createdAt)}</div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Action buttons — bottom right corner */}
      {activePanel === 'none' && (
        <div className="absolute bottom-36 right-4 z-10 flex flex-col gap-2">
          <button
            onClick={() => setActivePanel('log')}
            className="flex items-center gap-2 px-4 py-2.5 text-[13px] font-medium text-white rounded"
            style={{ background: '#B03A2E', boxShadow: '0 2px 8px rgba(176,58,46,0.4)' }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
            Log Incident
          </button>
          <button
            onClick={() => setActivePanel('plan')}
            className="flex items-center gap-2 px-4 py-2.5 text-[13px] font-medium text-white rounded"
            style={{ background: '#2E86C1', boxShadow: '0 2px 8px rgba(46,134,193,0.4)' }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
            Plan Event
          </button>
        </div>
      )}

      {/* Backdrop when panel is open */}
      {activePanel !== 'none' && (
        <div
          className="absolute bg-black/15"
          style={{ top: 0, left: 0, right: 420, bottom: 0, zIndex: 5, pointerEvents: 'none' }}
        />
      )}

      {/* Panels */}
      {activePanel === 'log' && (
        <LogIncidentPanel
          onClose={handleClose}
          clickPin={clickPin}
          onSubmitted={(inc) => { setSubmittedIncident(inc); setActivePanel('none'); setClickPin(null); }}
        />
      )}
      {activePanel === 'detail' && selectedIncident && (
        <IncidentDetailPanel incident={selectedIncident} onClose={handleClose} />
      )}
      {activePanel === 'plan' && (
        <PlanEventPanel onClose={handleClose} />
      )}

      {submittedIncident && (
        <IncidentRecommendationPage
          incident={submittedIncident}
          onClose={() => setSubmittedIncident(null)}
        />
      )}
    </div>
  );
}

// ─── Plan Event panel (minimal, inline) ─────────────────────────────────────

import { useEvents } from '../context/EventsContext';
import { MOCK_INCIDENTS } from '../data/mockIncidents';

const EVENT_TYPES = [
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

function PlanEventPanel({ onClose }: { onClose: () => void }) {
  const { showToast } = useToast();
  const { events, addEvent } = useEvents();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ name: '', type: '', venue: '', date: '', startTime: '09:00', endTime: '18:00', crowdSize: '', corridors: [] as string[] });
  const set = (k: string, v: unknown) => setForm(f => ({ ...f, [k]: v }));
  const toggleCorridor = (c: string) => setForm(f => ({ ...f, corridors: f.corridors.includes(c) ? f.corridors.filter(x => x !== c) : [...f.corridors, c] }));

  const inp = 'w-full border border-[var(--border)] bg-[var(--surface-2)] rounded px-3 py-2 text-[13px] text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)]';
  const lbl = 'block text-[12px] font-medium mb-1 text-[var(--text-secondary)]';

  // Similar past events for context
  const similar = events.filter(e => e.type === form.type && e.status === 'completed').slice(0, 2);

  return (
    <PanelShell
      title="Plan Event"
      onClose={onClose}
      footer={
        <>
          {step > 1 && <button onClick={() => setStep(s => s - 1)} className="px-4 py-2 text-[13px] border border-[var(--border)] rounded text-[var(--text-secondary)] hover:bg-[var(--surface-3)]">Back</button>}
          {step < 3 && <button onClick={() => setStep(s => s + 1)} disabled={!form.name || !form.type} className="flex-1 px-4 py-2 text-[13px] bg-[var(--accent)] text-white rounded font-medium hover:bg-[var(--accent-hover)] disabled:opacity-40">Next</button>}
          {step === 3 && (
            <button 
              onClick={() => {
                const newEvent = {
                  id: `EVT0${events.length + 1}`,
                  name: form.name,
                  type: (form.type || 'other') as any,
                  venue: form.venue || 'Unknown Venue',
                  lat: 12.9716,
                  lng: 77.5946,
                  date: form.date || new Date().toISOString().slice(0, 10),
                  startTime: form.startTime,
                  endTime: form.endTime,
                  crowdSize: (form.crowdSize || 'Medium') as any,
                  affectedCorridors: form.corridors,
                  status: 'planned' as const,
                  impactLevel: (form.crowdSize === 'Massive' || form.crowdSize === 'Large' ? 'High' : 'Medium') as any,
                  predictedScore: form.crowdSize === 'Massive' ? 90 : form.crowdSize === 'Large' ? 75 : 55,
                  officersDeployed: 25,
                };
                addEvent(newEvent);
                showToast('Event planned successfully', 'success');
                onClose();
              }} 
              className="flex-1 px-4 py-2 text-[13px] bg-[var(--accent)] text-white rounded font-medium hover:bg-[var(--accent-hover)]"
            >
              Save Plan
            </button>
          )}
        </>
      }
    >
      <div className="flex items-center gap-2 mb-5">
        {[1, 2, 3].map(s => (
          <div key={s} className="flex items-center gap-2">
            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-semibold ${step >= s ? 'bg-[var(--accent)] text-white' : 'bg-[var(--surface-3)] text-[var(--text-muted)] border border-[var(--border)]'}`}>{s}</div>
            {s < 3 && <div className={`h-0.5 w-8 ${step > s ? 'bg-[var(--accent)]' : 'bg-[var(--border)]'}`} />}
          </div>
        ))}
      </div>

      {step === 1 && (
        <div className="space-y-4">
          <div><label className={lbl}>Event Name *</label><input className={inp} value={form.name} onChange={e => set('name', e.target.value)} placeholder="IPL 2024 — RCB vs MI" /></div>
          <div><label className={lbl}>Event Type *</label>
            <select className={inp} value={form.type} onChange={e => set('type', e.target.value)}>
              <option value="">Select type</option>
              {EVENT_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
            </select>
          </div>
          <div><label className={lbl}>Venue</label><input className={inp} value={form.venue} onChange={e => set('venue', e.target.value)} placeholder="Chinnaswamy Stadium" /></div>
          <div><label className={lbl}>Date</label><input type="date" className={inp} value={form.date} onChange={e => set('date', e.target.value)} /></div>
          <div className="grid grid-cols-2 gap-3">
            <div><label className={lbl}>Start</label><input type="time" className={inp} value={form.startTime} onChange={e => set('startTime', e.target.value)} /></div>
            <div><label className={lbl}>End</label><input type="time" className={inp} value={form.endTime} onChange={e => set('endTime', e.target.value)} /></div>
          </div>
          <div><label className={lbl}>Expected Crowd</label>
            <select className={inp} value={form.crowdSize} onChange={e => set('crowdSize', e.target.value)}>
              <option value="">Select crowd size</option>
              {['Small (<5,000)', 'Medium (5K–50K)', 'Large (50K–200K)', 'Massive (200K+)'].map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        </div>
      )}

      {step === 2 && (
        <div>
          <div className="text-[13px] font-medium text-[var(--text-primary)] mb-3">Select Affected Corridors</div>
          <div className="space-y-2">
            {CORRIDORS.map(c => (
              <label key={c} className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" checked={form.corridors.includes(c)} onChange={() => toggleCorridor(c)} className="w-4 h-4" />
                <span className="text-[13px] text-[var(--text-primary)]">{c}</span>
              </label>
            ))}
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="space-y-4">
          <div className="text-[13px] font-semibold text-[var(--text-primary)] uppercase tracking-wide">Deployment Plan</div>
          <div className="bg-[var(--nav-active-bg)] border border-[var(--section-events-border)] rounded p-3 text-[13px] text-[var(--nav-active-text)] font-medium">
            Recommended: {form.crowdSize?.includes('Massive') ? '20+' : form.crowdSize?.includes('Large') ? '12–16' : form.crowdSize?.includes('Medium') ? '8–12' : '4–6'} officers
          </div>
          {JUNCTIONS.slice(0, 5).map((j, i) => (
            <div key={j} className="flex justify-between items-center py-2 border-b border-[var(--border)] text-[13px]">
              <span className="text-[var(--text-primary)]">{j}</span>
              <span className="text-[var(--text-secondary)]">{[3, 4, 2, 3, 2][i]} officers</span>
            </div>
          ))}
          {/* Past Event Intelligence */}
          {(() => {
            const affectedIncidents = MOCK_INCIDENTS.filter(i => form.corridors.includes(i.corridor));
            const causeCounts = affectedIncidents.reduce((acc: Record<string, number>, i) => {
              acc[i.cause] = (acc[i.cause] || 0) + 1;
              return acc;
            }, {});
            const topCause = Object.entries(causeCounts).sort((a, b) => b[1] - a[1])[0];
            const lessonMap: Record<string, string> = {
              cricket_match: 'Post-match dispersal causes 45-min gridlock near stadium exits.',
              political_rally: 'Rally overrun common — extend closure window by 2 hours.',
              concert: 'Parking spillover blocks service roads. Pre-position tow trucks.',
              marathon: 'Water station areas become bottlenecks. Add 2 officers per station.',
              religious_procession: 'Procession often diverts spontaneously. Keep radio contact.',
            };
            return (
              <div className="rounded p-3 mb-3 border" style={{ background: 'var(--section-resources)', borderColor: 'var(--section-resources-border)' }}>
                <div className="text-[11px] font-semibold text-[var(--green)] uppercase tracking-wide mb-2">Past Event Intelligence</div>
                <div className="text-[12px] text-[var(--text-secondary)] mb-1">Similar events logged: <span className="font-semibold text-[var(--text-primary)]">{affectedIncidents.length}</span> incidents on affected corridors</div>
                {topCause && <div className="text-[12px] text-[var(--text-secondary)] mb-1">Most common issue: <span className="font-semibold text-[var(--text-primary)]">{topCause[0].replace(/_/g, ' ')}</span></div>}
                <div className="text-[12px] text-[var(--text-secondary)] mb-1">Recommended pre-deployment: <span className="font-semibold text-[var(--text-primary)]">90 min before start</span></div>
                {lessonMap[form.type] && <div className="text-[11px] text-[var(--green)] italic mt-1">{lessonMap[form.type]}</div>}
              </div>
            );
          })()}
          {similar.length > 0 && (
            <div>
              <div className="text-[11px] font-semibold text-[var(--text-muted)] uppercase tracking-wide mb-2">Similar Past Events</div>
              {similar.map(e => (
                <div key={e.id} className="bg-[var(--surface-3)] rounded p-2.5 mb-2 text-[12px]">
                  <div className="font-medium text-[var(--text-primary)]">{e.name}</div>
                  <div className="text-[var(--text-secondary)]">{e.date} · {e.impactLevel ?? '—'} impact</div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </PanelShell>
  );
}
