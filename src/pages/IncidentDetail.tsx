import { lazy, Suspense, type ReactNode } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MOCK_INCIDENTS } from '../data/mockIncidents';
import { Badge } from '../components/ui/Badge';
import { estimateManpower } from '../utils/manpowerEstimator';
import { getDiversionRoutes } from '../utils/diversionSuggester';

const BangaloreMap = lazy(() => import('../components/map/BangaloreMap'));

const CAUSE_LABELS: Record<string, string> = {
  vehicle_breakdown: 'Vehicle Breakdown', accident: 'Accident', pot_holes: 'Pot Holes',
  construction: 'Construction', water_logging: 'Water Logging', tree_fall: 'Tree Fall',
  public_event: 'Public Event', vip_movement: 'VIP Movement', others: 'Others',
};

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="bg-[var(--card-bg)] border border-[var(--border)] rounded-[6px] p-5 mb-4" style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
      <div className="text-[13px] font-semibold text-[var(--text-primary)] mb-3 pb-2 border-b border-[var(--border)]">{title}</div>
      {children}
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="flex gap-4 py-1.5 border-b border-[var(--border)] last:border-0">
      <span className="text-[12px] text-[var(--text-secondary)] w-36 flex-shrink-0">{label}</span>
      <span className="text-[13px] text-[var(--text-primary)]">{value}</span>
    </div>
  );
}

export default function IncidentDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const incident = MOCK_INCIDENTS.find(i => i.id === id);

  if (!incident) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="text-[24px] font-semibold text-[var(--text-primary)]">Incident Not Found</div>
          <button onClick={() => navigate('/')} className="mt-4 px-4 py-2 bg-[var(--accent)] text-white rounded-[6px] text-[13px] hover:bg-[var(--accent-hover)]">Back to Dashboard</button>
        </div>
      </div>
    );
  }

  const diversions = incident.requiresRoadClosure ? getDiversionRoutes(incident.corridor) : [];
  const manpower = estimateManpower(incident.impactLevel, incident.requiresRoadClosure);

  return (
    <div className="overflow-y-auto h-full" style={{ background: 'var(--bg)' }}>
      <div className="max-w-4xl mx-auto px-6 py-6">
        {/* Back */}
        <button onClick={() => navigate('/')} className="flex items-center gap-2 text-[13px] text-[var(--text-secondary)] hover:text-[var(--accent)] mb-4">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
          Back to Dashboard
        </button>

        {/* Header */}
        <Section title="Incident Overview">
          <div className="flex items-start justify-between">
            <div>
              <div className="text-[22px] font-semibold text-[var(--text-primary)]">{incident.id}</div>
              <div className="text-[15px] text-[var(--text-secondary)] mt-1">{CAUSE_LABELS[incident.cause]}</div>
              <div className="text-[13px] text-[var(--text-muted)] mt-0.5">{new Date(incident.timeOfIncident).toLocaleString()}</div>
            </div>
            <div className="flex gap-2">
              <Badge variant={incident.priority.toLowerCase() as 'high'|'medium'|'low'}>{incident.priority} Priority</Badge>
              <Badge variant={incident.status as 'active'|'resolved'|'closed'|'draft'}>{incident.status}</Badge>
            </div>
          </div>
        </Section>

        {/* Location */}
        <Section title="Location">
          <InfoRow label="Corridor" value={incident.corridor} />
          <InfoRow label="Junction" value={incident.junction} />
          <InfoRow label="Address" value={incident.address} />
          <InfoRow label="Direction" value={incident.direction} />
          <div className="mt-3 rounded-[6px] overflow-hidden border border-[var(--border)]" style={{ height: 200 }}>
            <Suspense fallback={<div className="h-full bg-[var(--surface-2)] flex items-center justify-center text-[13px] text-[var(--text-muted)]">Loading map...</div>}>
              <BangaloreMap
                incidents={[incident]}
                height="200px"
                interactive={false}
              />
            </Suspense>
          </div>
        </Section>

        {/* Impact */}
        <Section title="Impact Assessment">
          <div className="mb-4">
            <div className="flex justify-between text-[12px] text-[var(--text-secondary)] mb-1">
              <span>Impact Score</span><span className="font-semibold text-[var(--text-primary)]">{incident.impactScore}/100</span>
            </div>
            <div className="h-2.5 bg-[var(--surface-3)] rounded-full overflow-hidden">
              <div
                className="h-full rounded-full"
                style={{
                  width: `${incident.impactScore}%`,
                  background: incident.impactScore >= 80 ? 'var(--red)' : incident.impactScore >= 50 ? 'var(--amber)' : 'var(--green)'
                }}
              />
            </div>
          </div>
          <InfoRow label="Impact Level" value={<Badge variant={incident.impactLevel.toLowerCase() as 'high'|'medium'|'low'}>{incident.impactLevel}</Badge>} />
          <InfoRow label="Manpower" value={manpower} />
          <InfoRow label="Road Closure" value={incident.requiresRoadClosure ? 'Yes' : 'No'} />
        </Section>

        {/* Vehicle Info */}
        {(incident.vehicleType || incident.vehicleNumber) && (
          <Section title="Vehicle Information">
            {incident.vehicleType && <InfoRow label="Vehicle Type" value={incident.vehicleType} />}
            {incident.vehicleNumber && <InfoRow label="Vehicle Number" value={incident.vehicleNumber} />}
            {incident.breakdownReason && <InfoRow label="Breakdown Reason" value={incident.breakdownReason} />}
          </Section>
        )}

        {/* Description */}
        <Section title="Description">
          <p className="text-[13px] text-[var(--text-secondary)] leading-relaxed">{incident.description}</p>
        </Section>

        {/* Timeline */}
        <Section title="Timeline">
          <InfoRow label="Created" value={new Date(incident.createdAt).toLocaleString()} />
          <InfoRow label="Last Updated" value={new Date(incident.updatedAt).toLocaleString()} />
          {incident.resolvedAt && <InfoRow label="Resolved" value={new Date(incident.resolvedAt).toLocaleString()} />}
          {incident.resolutionTimeMin && <InfoRow label="Resolution Time" value={`${incident.resolutionTimeMin} minutes`} />}
        </Section>

        {/* Diversion */}
        {diversions.length > 0 && (
          <Section title="Diversion Plan">
            <div className="mb-3 rounded-[6px] overflow-hidden border border-[var(--border)]" style={{ height: 200 }}>
              <Suspense fallback={<div className="h-full bg-[var(--surface-2)] flex items-center justify-center text-[13px] text-[var(--text-muted)]">Loading map...</div>}>
                <BangaloreMap
                  diversionRoutes={diversions}
                  height="200px"
                  interactive={false}
                />
              </Suspense>
            </div>
            {diversions.map((d, i) => (
              <div key={i} className="text-[13px] text-[var(--text-secondary)] py-1">• {d.label}</div>
            ))}
          </Section>
        )}

        {/* Officer Notes */}
        <Section title="Officer Notes">
          {incident.officerNotes.length === 0 ? (
            <div className="text-[13px] text-[var(--text-muted)]">No notes added yet.</div>
          ) : (
            incident.officerNotes.map((note, i) => (
              <div key={i} className="border-b border-[var(--border)] py-3 last:border-0">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[12px] font-medium text-[var(--text-primary)]">{note.author}</span>
                  <span className="text-[11px] text-[var(--text-muted)]">{new Date(note.timestamp).toLocaleString()}</span>
                </div>
                <p className="text-[13px] text-[var(--text-secondary)]">{note.text}</p>
              </div>
            ))
          )}
        </Section>
      </div>
    </div>
  );
}
