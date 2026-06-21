import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useIncidents } from '../../hooks/useIncidents';
import { useEvents } from '../../context/EventsContext';
import logo from '../../assets/logo.jpg';

interface SidebarProps {
  onLogIncident?: () => void;
  onPlanEvent?: () => void;
}

// ── Icon helpers ─────────────────────────────────────────────────────────────
const Icon = ({ d, stroke = 'currentColor', w = 14 }: { d: string | React.ReactNode; stroke?: string; w?: number }) =>
  typeof d === 'string' ? (
    <svg width={w} height={w} viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d={d} />
    </svg>
  ) : d;

const ChevronDown = ({ open }: { open: boolean }) => (
  <svg
    width={12} height={12} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}
    style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s ease', flexShrink: 0 }}
  >
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

// ── NavItem (simple link) ────────────────────────────────────────────────────
function NavItem({
  to, label, icon, badge, accent,
}: {
  to: string; label: string; icon: React.ReactNode;
  badge?: number | string; accent?: string;
}) {
  return (
    <NavLink
      to={to}
      end={to === '/'}
      className={({ isActive }) =>
        `flex items-center gap-2.5 px-4 py-2 text-[12px] font-medium transition-all border-l-2 ${isActive
          ? 'border-[var(--accent)] bg-[var(--nav-active-bg)] text-[var(--text-primary)] font-semibold'
          : 'border-transparent text-[var(--sidebar-text)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-3)]'
        }`
      }
    >
      <span style={{ color: accent ?? 'currentColor', flexShrink: 0 }}>{icon}</span>
      <span style={{ flex: 1 }}>{label}</span>
      {badge !== undefined && badge !== 0 && (
        <span style={{
          fontSize: 10, fontWeight: 700, minWidth: 18, height: 16, display: 'flex',
          alignItems: 'center', justifyContent: 'center', borderRadius: 8,
          background: typeof badge === 'number' && badge > 0 ? 'var(--red)' : 'var(--surface-3)',
          color: typeof badge === 'number' && badge > 0 ? '#fff' : 'var(--text-muted)',
          padding: '0 4px',
        }}>
          {badge}
        </span>
      )}
    </NavLink>
  );
}

// ── NavButton (action, no route) ─────────────────────────────────────────────
function NavButton({ label, icon, onClick, accent }: {
  label: string; icon: React.ReactNode; onClick?: () => void; accent?: string;
}) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2.5 px-4 py-2 text-[12px] font-medium transition-all w-full text-left border-l-2 border-transparent text-[var(--sidebar-text)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-3)]"
    >
      <span style={{ color: accent ?? 'currentColor', flexShrink: 0 }}>{icon}</span>
      <span>{label}</span>
    </button>
  );
}

// ── Collapsible Group ────────────────────────────────────────────────────────
function NavGroup({
  label, icon, children, defaultOpen = false, badge,
}: {
  label: string; icon: React.ReactNode; children: React.ReactNode;
  defaultOpen?: boolean; badge?: number | string;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div>
      <button
        onClick={() => setOpen(o => !o)}
        className="flex items-center gap-2.5 px-4 py-2 w-full text-left text-[11px] font-semibold transition-all hover:bg-[var(--surface-3)]"
        style={{ color: 'var(--sidebar-text)', letterSpacing: '0.03em' }}
      >
        <span style={{ flexShrink: 0 }}>{icon}</span>
        <span style={{ flex: 1 }}>{label}</span>
        {badge !== undefined && badge !== 0 && (
          <span style={{
            fontSize: 10, fontWeight: 700, minWidth: 18, height: 16, display: 'flex',
            alignItems: 'center', justifyContent: 'center', borderRadius: 8,
            background: typeof badge === 'number' && badge > 0 ? 'rgba(176,58,46,0.85)' : 'var(--surface-3)',
            color: typeof badge === 'number' && badge > 0 ? '#fff' : 'var(--text-muted)',
            padding: '0 4px', marginRight: 4,
          }}>
            {badge}
          </span>
        )}
        <ChevronDown open={open} />
      </button>
      {open && (
        <div style={{ paddingLeft: 8 }}>
          {children}
        </div>
      )}
    </div>
  );
}

const Divider = () => <div style={{ height: 1, background: 'var(--sidebar-border)', margin: '4px 16px' }} />;

const SectionLabel = ({ label }: { label: string }) => (
  <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--sidebar-label)', padding: '10px 16px 4px' }}>
    {label}
  </div>
);

// ── Sidebar ──────────────────────────────────────────────────────────────────
export default function Sidebar({ onLogIncident, onPlanEvent }: SidebarProps) {
  const navigate = useNavigate();
  const { incidents } = useIncidents();
  const { events } = useEvents();

  const activeIncidents = incidents.filter(i => i.status === 'active').length;
  const highPriority = incidents.filter(i => i.status === 'active' && i.priority === 'High').length;
  const activeEvents = events.filter(e => e.status === 'active' || e.status === 'planned').length;

  const handleLogIncident = () => { navigate('/'); onLogIncident?.(); };
  const handlePlanEvent = () => { navigate('/'); onPlanEvent?.(); };

  // SVG icon paths
  const icons = {
    home: <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9,22 9,12 15,12 15,22"/></svg>,
    logInc: <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="#B03A2E" strokeWidth={2}><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>,
    calendar: <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
    clock: <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
    bars: <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>,
    list: <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><circle cx="3" cy="6" r="1"/><circle cx="3" cy="12" r="1"/><circle cx="3" cy="18" r="1"/></svg>,
    bulb: <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M9 18h6M10 22h4M12 2a7 7 0 017 7c0 2.6-1.4 4.9-3.5 6.2V17H8.5v-1.8A7 7 0 015 9a7 7 0 017-7z"/></svg>,
    users: <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></svg>,
    truck: <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>,
    bell: <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0"/></svg>,
    file: <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>,
    map: <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"/><line x1="8" y1="2" x2="8" y2="18"/><line x1="16" y1="6" x2="16" y2="22"/></svg>,
    incident: <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
    event: <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></svg>,
    shield: <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
    box: <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>,
    debrief: <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><path d="M9 13h6M9 17h6M9 9h1"/></svg>,
    gauge: <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M12 2a10 10 0 100 20A10 10 0 0012 2zM12 12l4-4"/><circle cx="12" cy="12" r="1"/></svg>,
  };

  return (
    <aside
      className="flex flex-col flex-shrink-0"
      style={{
        width: 240, height: '100vh', background: 'var(--sidebar-bg)',
        borderRight: '1px solid var(--sidebar-border)', overflowY: 'auto', overflowX: 'hidden',
      }}
    >
      {/* Brand */}
      <div style={{ padding: '14px 18px', borderBottom: '1px solid var(--sidebar-border)', display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
        <img src={logo} alt="Logo" style={{ width: 28, height: 28, borderRadius: 4, objectFit: 'cover', border: '1px solid var(--border)' }} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', color: 'var(--text-primary)', textTransform: 'uppercase', lineHeight: 1 }}>Traffic Saarthi</span>
          <span style={{ fontSize: 9, color: 'var(--sidebar-text)', fontWeight: 500, lineHeight: 1 }}>Bengaluru Command Center</span>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, paddingTop: 6, paddingBottom: 8, display: 'flex', flexDirection: 'column', gap: 1 }}>

        {/* Dashboard */}
        <NavItem to="/" label="Dashboard" icon={icons.home} />

        <Divider />

        {/* Quick Actions */}
        <SectionLabel label="Quick Actions" />
        <NavButton label="Log Incident" icon={icons.logInc} onClick={handleLogIncident} accent="#B03A2E" />
        <NavButton label="Plan Event" icon={icons.calendar} onClick={handlePlanEvent} accent="#2E86C1" />

        <Divider />

        {/* Operations */}
        <SectionLabel label="Operations" />

        <NavItem to="/today-plan" label="Today's Plan" icon={icons.clock} />
        <NavItem to="/recommendations" label="Recommendations" icon={icons.bulb} />

        {/* Incidents group */}
        <NavGroup label="Incidents" icon={icons.incident} defaultOpen={true} badge={activeIncidents}>
          <NavItem to="/history" label="Incident History" icon={icons.list} />
          <NavItem
            to="/history"
            label="High Priority"
            icon={<svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="#B03A2E" strokeWidth={2}><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>}
            badge={highPriority}
            accent="#B03A2E"
          />
        </NavGroup>

        {/* Events group */}
        <NavGroup label="Events" icon={icons.event} badge={activeEvents}>
          <NavItem to="/future-events" label="Upcoming Events" icon={icons.calendar} />
          <NavItem to="/plan-event" label="Plan New Event" icon={<svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>} />
          <NavItem to="/debrief/1" label="Event Debrief" icon={icons.debrief} />
        </NavGroup>

        <Divider />

        {/* Field */}
        <SectionLabel label="Field Management" />

        {/* Patrol group */}
        <NavGroup label="Patrol Units" icon={icons.users} defaultOpen={false}>
          <NavItem to="/patrol" label="Unit Overview" icon={<svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>} />
          <NavItem to="/patrol" label="Shift Schedule" icon={icons.clock} />
          <NavItem to="/patrol" label="Deployment Map" icon={icons.map} />
        </NavGroup>

        {/* Resources group */}
        <NavGroup label="Resources" icon={icons.box}>
          <NavItem to="/resources" label="Equipment Tracker" icon={icons.truck} />
          <NavItem to="/resources" label="Barricade Inventory" icon={<svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><rect x="1" y="3" width="22" height="13" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>} />
          <NavItem to="/resources" label="Store Locations" icon={<svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/></svg>} />
        </NavGroup>

        <Divider />

        {/* Intelligence */}
        <SectionLabel label="Intelligence" />
        <NavItem to="/analytics" label="Analytics" icon={icons.bars} />

        {/* Alerts group */}
        <NavGroup label="Alert Center" icon={icons.bell} badge={3}>
          <NavItem to="/alerts" label="All Alerts" icon={icons.bell} badge={3} />
          <NavItem to="/alerts" label="Escalations" icon={<svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="#D35400" strokeWidth={2}><polyline points="18 15 12 9 6 15"/></svg>} accent="#D35400" />
          <NavItem to="/alerts" label="Weather Alerts" icon={<svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M20 17.58A5 5 0 0018 8h-1.26A8 8 0 104 16.25"/><line x1="8" y1="16" x2="8.01" y2="16"/><line x1="8" y1="20" x2="8.01" y2="20"/><line x1="12" y1="18" x2="12.01" y2="18"/><line x1="12" y1="22" x2="12.01" y2="22"/><line x1="16" y1="16" x2="16.01" y2="16"/><line x1="16" y1="20" x2="16.01" y2="20"/></svg>} />
        </NavGroup>

        <Divider />

        {/* Reporting */}
        <SectionLabel label="Reporting" />
        <NavGroup label="Reports & Export" icon={icons.file}>
          <NavItem to="/reports" label="Generate Report" icon={<svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>} />
          <NavItem to="/reports" label="Daily Summary" icon={<svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>} />
          <NavItem to="/reports" label="Export Data" icon={<svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>} />
        </NavGroup>

      </nav>

      {/* Footer */}
      <div style={{ borderTop: '1px solid var(--sidebar-border)', padding: '10px 14px', display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
        <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#10B981', flexShrink: 0 }} />
        <span style={{ fontSize: 9, color: 'var(--sidebar-text)', fontWeight: 600 }}>BTP · Shift A · Online</span>
        <span style={{ marginLeft: 'auto', fontSize: 9, color: 'var(--text-muted)' }}>v2.4</span>
      </div>
    </aside>
  );
}
