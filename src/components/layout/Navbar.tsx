import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useIncidentsContext } from '../../context/IncidentsContext';
import { useTheme } from '../../context/ThemeContext';
import { useEvents } from '../../context/EventsContext';
import { usePanel } from './Layout';
import { useAuth } from '../../context/AuthContext';
import logo from '../../assets/logo.jpg';

interface NavbarProps {
  onToggleSidebar?: () => void;
}

export default function Navbar({ onToggleSidebar }: NavbarProps) {
  const _navigate = useNavigate();
  const { activeCount, incidents } = useIncidentsContext();
  const { theme, toggleTheme } = useTheme();
  const { setSelectedId, setPanel } = usePanel();
  const { events } = useEvents();
  const { logout } = useAuth();
  
  const [incDropOpen, setIncDropOpen] = useState(false);
  const [evtDropOpen, setEvtDropOpen] = useState(false);
  const [time, setTime] = useState(new Date());
  const [profileOpen, setProfileOpen] = useState(false);

  const todayEvents = events.filter(e => e.status === 'active' || e.status === 'planned');

  useEffect(() => {
    const id = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const pad = (n: number) => String(n).padStart(2, '0');
  const timeStr = `${pad(time.getHours())}:${pad(time.getMinutes())}:${pad(time.getSeconds())}`;
  const dateStr = time.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });

  const dropStyle: React.CSSProperties = {
    position: 'absolute',
    top: 'calc(100% + 8px)',
    left: 0,
    background: 'var(--surface-2)',
    border: '1px solid var(--border)',
    borderRadius: 8,
    minWidth: 240,
    zIndex: 100,
    boxShadow: '0 4px 16px rgba(0,0,0,0.3)',
  };

  return (
    <nav className="flex items-center justify-between px-4 flex-shrink-0" style={{ height: 56, background: 'var(--surface)', borderBottom: '1px solid var(--border)' }}>
      {/* Left: branding */}
      <div className="flex items-center gap-3">
        {/* Mobile Sidebar Hamburger Toggle Button */}
        <button
          onClick={onToggleSidebar}
          className="md:hidden p-1.5 rounded hover:bg-[var(--surface-3)]"
          style={{ color: 'var(--text-primary)', border: 'none', background: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>

        <img src={logo} alt="Logo" style={{ width: 32, height: 32, borderRadius: 4, objectFit: 'cover', border: '1px solid var(--border)' }} />
        <div className="hidden xs:block">
          <div className="text-[14px] md:text-[16px] font-semibold leading-tight" style={{ color: 'var(--text-primary)' }}>Traffic Saarthi</div>
          <div className="text-[10px] md:text-[12px] leading-tight" style={{ color: 'var(--text-secondary)' }}>Bengaluru Traffic Police</div>
        </div>
      </div>

      {/* Center: clock + pills */}
      <div className="flex flex-col items-center gap-1" style={{ position: 'relative' }}>
        <div className="flex items-center gap-3 text-[12px]">
          <span className="font-medium" style={{ color: 'var(--text-primary)' }}>{dateStr}</span>
          <span className="font-mono font-semibold text-[#4A8FE8]">{timeStr}</span>
        </div>
        <div className="flex items-center gap-3" style={{ position: 'relative' }}>
          {/* Active incidents pill */}
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => { setIncDropOpen(v => !v); setEvtDropOpen(false); }}
              className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FDEDEC] hover:bg-[#fad7d3] transition-colors"
            >
              <div className="w-1.5 h-1.5 rounded-full bg-[#B03A2E]" />
              <span className="text-[12px] font-medium text-[#B03A2E]">{activeCount} active incidents</span>
            </button>
            {incDropOpen && (
              <div style={dropStyle}>
                <div style={{ padding: '8px 12px', borderBottom: '1px solid var(--border)', fontSize: 11, fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  Active Incidents
                </div>
                {incidents.filter(i => i.status === 'active').slice(0, 5).map(i => (
                  <button
                    key={i.id}
                    onClick={() => {
                      setSelectedId(i.id);
                      setPanel('detail');
                      _navigate('/');
                      setIncDropOpen(false);
                    }}
                    style={{
                      width: '100%',
                      textAlign: 'left',
                      padding: '8px 12px',
                      background: 'transparent',
                      border: 'none',
                      borderBottom: '1px solid var(--border)',
                      cursor: 'pointer',
                      display: 'block',
                      transition: 'background 0.2s ease',
                    }}
                    className="hover:bg-white/[0.05]"
                  >
                    <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)' }}>{i.id}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginTop: 2 }}>{i.cause.replace(/_/g, ' ')} · {i.corridor}</div>
                  </button>
                ))}
                {incidents.filter(i => i.status === 'active').length === 0 && (
                  <div style={{ padding: '10px 12px', fontSize: 12, color: 'var(--text-muted)' }}>No active incidents</div>
                )}
              </div>
            )}
          </div>

          {/* Events pill */}
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => { setEvtDropOpen(v => !v); setIncDropOpen(false); }}
              className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EBF5FB] hover:bg-[#d0eaf7] transition-colors cursor-pointer"
            >
              <div className="w-1.5 h-1.5 rounded-full bg-[#1A5276]" />
              <span className="text-[12px] font-medium text-[#1A5276]">{todayEvents.length} active events</span>
            </button>
            {evtDropOpen && (
              <div style={dropStyle}>
                <div style={{ padding: '8px 12px', borderBottom: '1px solid var(--border)', fontSize: 11, fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  Active / Planned Events
                </div>
                {todayEvents.slice(0, 5).map(e => (
                  <button
                    key={e.id}
                    onClick={() => {
                      _navigate(`/debrief/${e.id}`);
                      setEvtDropOpen(false);
                    }}
                    style={{
                      width: '100%',
                      textAlign: 'left',
                      padding: '8px 12px',
                      background: 'transparent',
                      border: 'none',
                      borderBottom: '1px solid var(--border)',
                      cursor: 'pointer',
                      display: 'block',
                      transition: 'background 0.2s ease',
                    }}
                    className="hover:bg-white/[0.05]"
                  >
                    <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)' }}>{e.name}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginTop: 2 }}>{e.date} · {e.status}</div>
                  </button>
                ))}
                {todayEvents.length === 0 && (
                  <div style={{ padding: '10px 12px', fontSize: 12, color: 'var(--text-muted)' }}>No active events</div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Right: theme toggle + officer */}
      <div className="flex items-center gap-3">
        <button
          onClick={toggleTheme}
          style={{
            background: 'transparent',
            border: 'none',
            borderRadius: '50%',
            width: 32,
            height: 32,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            color: 'var(--text-secondary)',
            transition: 'all 0.2s ease',
          }}
          className="hover:text-[#4A8FE8] hover:bg-white/[0.05]"
          title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          {theme === 'dark' ? (
            /* Sun Icon */
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="5" />
              <line x1="12" y1="1" x2="12" y2="3" />
              <line x1="12" y1="21" x2="12" y2="23" />
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
              <line x1="1" y1="12" x2="3" y2="12" />
              <line x1="21" y1="12" x2="23" y2="12" />
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
              <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
            </svg>
          ) : (
            /* Moon Icon */
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
            </svg>
          )}
        </button>

        <div className="flex items-center gap-3">
          <button 
            onClick={() => setProfileOpen(true)}
            style={{
              background: 'transparent',
              border: 'none',
              padding: '2px 6px',
              borderRadius: 6,
              cursor: 'pointer',
              textAlign: 'right',
              transition: 'background 0.2s'
            }}
            className="hover:bg-white/[0.05]"
          >
            <div className="text-[13px] font-medium" style={{ color: 'var(--text-primary)' }}>Admin</div>
            <div className="text-[11px]" style={{ color: 'var(--text-secondary)' }}>Traffic Control</div>
          </button>
          
          <button 
            onClick={logout}
            style={{
              background: 'transparent',
              border: 'none',
              padding: 4,
              cursor: 'pointer',
              color: 'var(--text-secondary)',
              transition: 'color 0.2s'
            }}
            className="hover:text-[var(--red)]"
            title="Log Out"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9"/>
            </svg>
          </button>
        </div>
      </div>

      {profileOpen && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.5)',
          backdropFilter: 'blur(4px)',
          zIndex: 10000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          {/* Card */}
          <div style={{
            background: 'var(--card-bg)',
            border: '1px solid var(--border)',
            borderRadius: 12,
            padding: '28px 24px',
            width: 340,
            boxShadow: '0 8px 32px rgba(0,0,0,0.25)',
            display: 'flex',
            flexDirection: 'column',
            gap: 20
          }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Officer Profile</div>
              <button 
                onClick={() => setProfileOpen(false)}
                style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', fontSize: 18, cursor: 'pointer', lineHeight: '1' }}
              >
                ✕
              </button>
            </div>

            {/* Avatar & Basic Info */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, borderBottom: '1px solid var(--border)', paddingBottom: 16 }}>
              <div style={{
                width: 56,
                height: 56,
                borderRadius: '50%',
                background: 'var(--surface-3)',
                border: '2px solid var(--accent)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 24
              }}>
                👮
              </div>
              <div>
                <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)' }}>Admin User</div>
                <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Badge #BTP-2026-991</div>
              </div>
            </div>

            {/* Profile Fields */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[
                { label: 'Role', value: 'Traffic Control Supervisor' },
                { label: 'Precinct', value: 'Bengaluru Command Center' },
                { label: 'Shift Code', value: 'A (Morning Duty)' },
                { label: 'Assigned Corridor', value: 'CBD Traffic Control Group' },
              ].map(f => (
                <div key={f.label} style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontSize: 10, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{f.label}</span>
                  <span style={{ fontSize: 13, color: 'var(--text-primary)', fontWeight: 500, marginTop: 2 }}>{f.value}</span>
                </div>
              ))}
            </div>

            {/* Logout button */}
            <button
              onClick={() => {
                setProfileOpen(false);
                logout();
              }}
              style={{
                width: '100%',
                padding: '10px 14px',
                background: 'var(--red)',
                color: 'white',
                border: 'none',
                borderRadius: 6,
                fontSize: 13,
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'background 0.2s',
                marginTop: 8
              }}
              className="hover:opacity-90"
            >
              Log Out of Command Center
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
