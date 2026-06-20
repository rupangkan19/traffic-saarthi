import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useIncidents } from '../hooks/useIncidents';
import { useEvents } from '../context/EventsContext';
import { getDiversionRoutes } from '../utils/diversionSuggester';

const CAUSE_LABELS: Record<string, string> = {
  vehicle_breakdown: 'Vehicle Breakdown',
  accident: 'Accident',
  pot_holes: 'Pot Holes',
  construction: 'Construction',
  water_logging: 'Water Logging',
  tree_fall: 'Tree Fall',
  public_event: 'Public Event',
  vip_movement: 'VIP Movement',
  others: 'Others',
};

const TYPE_LABELS: Record<string, string> = {
  cricket_match: 'Cricket Match',
  political_rally: 'Political Rally',
  kambala: 'Kambala',
  concert: 'Concert',
  religious_procession: 'Religious Procession',
  marathon: 'Marathon',
  construction_permit: 'Construction Permit',
  vip_movement: 'VIP Movement',
  other: 'Other',
};

const ChevronIcon = ({ expanded }: { expanded: boolean }) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    style={{
      transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
      transition: 'transform 0.2s ease',
      color: 'var(--text-secondary)'
    }}
  >
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

export default function TodayPlan() {
  const navigate = useNavigate();
  const { incidents } = useIncidents();
  const { events } = useEvents();
  const activeIncidents = incidents.filter(i => i.status === 'active');
  const currentEvents = events.filter(e => e.status === 'active' || e.status === 'planned');
  const closures = activeIncidents.filter(i => i.requiresRoadClosure);

  const [expandedIncidents, setExpandedIncidents] = useState<Record<string, boolean>>({});
  const [expandedEvents, setExpandedEvents] = useState<Record<string, boolean>>({});

  const toggleIncident = (id: string) => {
    setExpandedIncidents(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleEvent = (id: string) => {
    setExpandedEvents(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const cardStyle: React.CSSProperties = {
    background: 'var(--card-bg)',
    border: '1px solid var(--border)',
    borderRadius: 12,
    padding: '24px 28px',
    marginBottom: 20,
  };

  return (
    <div className="overflow-y-auto h-full" style={{ background: 'var(--bg)' }}>
      <div style={{ maxWidth: 960, margin: '0 auto', padding: '32px 24px' }}>
        {/* Header Section */}
        <div style={{ marginBottom: 28 }}>
          <div style={{ fontSize: 24, fontWeight: 700, color: 'var(--text-primary)' }}>Current Operational Status</div>
          <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 4 }}>
            Live status report for Bengaluru Command Center · {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
          </div>
        </div>

        {/* Quick Summary Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 24 }}>
          {[
            { label: 'Active Incidents', value: activeIncidents.length, color: '#B03A2E' },
            { label: 'Active & Planned Events', value: currentEvents.length, color: '#2E86C1' },
            { label: 'Road Closures', value: closures.length, color: '#D35400' },
          ].map(s => (
            <div key={s.label} style={{
              background: 'var(--card-bg)',
              border: '1px solid var(--border)',
              borderRadius: 12,
              padding: '20px 24px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
            }}>
              <div style={{ fontSize: 36, fontWeight: 700, color: s.color, lineHeight: '1.2' }}>{s.value}</div>
              <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 6, fontWeight: 600 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Active Incidents Block */}
        <div style={cardStyle}>
          <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#B03A2E', marginBottom: 18 }}>
            Active Incidents Requiring Attention
          </div>
          {activeIncidents.length === 0 ? (
            <div style={{ fontSize: 14, color: 'var(--text-muted)', textAlign: 'center', padding: '24px 0' }}>
              No active incidents reported. Traffic flowing smoothly!
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {activeIncidents.slice(0, 10).map(i => {
                const priorityColor = i.priority === 'High' ? '#B03A2E' : i.priority === 'Medium' ? '#D35400' : '#27AE60';
                const diversion = i.requiresRoadClosure ? getDiversionRoutes(i.corridor)[0] : null;
                const isExpanded = !!expandedIncidents[i.id];

                return (
                  <div
                    key={i.id}
                    onClick={() => toggleIncident(i.id)}
                    style={{
                      padding: '16px 20px',
                      border: '1px solid var(--border)',
                      borderLeft: `4px solid ${priorityColor}`,
                      borderRadius: 10,
                      background: 'var(--surface-2)',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      boxShadow: isExpanded ? '0 4px 12px rgba(0, 0, 0, 0.2)' : 'none',
                    }}
                    className="hover-card-highlight"
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, marginBottom: 6, flexWrap: 'wrap' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
                        <span style={{ fontSize: 13, color: '#6B8FD4', fontWeight: 600 }}>{i.id}</span>
                        <span style={{ fontSize: 13, fontWeight: 700, color: priorityColor }}>{i.priority} Priority</span>
                        <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>{CAUSE_LABELS[i.cause] || i.cause}</span>
                        {i.requiresRoadClosure && (
                          <span style={{
                            fontSize: 11,
                            color: '#D35400',
                            background: 'rgba(211, 84, 0, 0.12)',
                            padding: '2px 8px',
                            borderRadius: 4,
                            fontWeight: 700,
                            border: '1px solid rgba(211, 84, 0, 0.25)'
                          }}>
                            ROAD CLOSURE
                          </span>
                        )}
                      </div>
                      <ChevronIcon expanded={isExpanded} />
                    </div>
                    <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
                      Location: <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{i.corridor}</span>
                      {i.junction ? ` (Junction: ${i.junction})` : ''}
                    </div>

                    {isExpanded && (
                      <div style={{
                        marginTop: 14,
                        paddingTop: 14,
                        borderTop: '1px solid var(--border)',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 12
                      }}>
                        {i.description && (
                          <div>
                            <div style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 }}>Description</div>
                            <div style={{ fontSize: 13, color: 'var(--text-primary)', lineHeight: '1.5' }}>{i.description}</div>
                          </div>
                        )}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12 }}>
                          <div>
                            <div style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 }}>Time of Incident</div>
                            <div style={{ fontSize: 13, color: 'var(--text-primary)' }}>{new Date(i.timeOfIncident).toLocaleString('en-IN')}</div>
                          </div>
                          {i.impactScore && (
                            <div>
                              <div style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 }}>Impact Score</div>
                              <div style={{ fontSize: 13, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: 8 }}>
                                <span>{i.impactScore} / 100</span>
                                <div style={{ flex: 1, height: 6, background: 'var(--surface-3)', borderRadius: 3, overflow: 'hidden', maxWidth: 100 }}>
                                  <div style={{
                                    height: '100%',
                                    background: i.impactScore >= 80 ? '#B03A2E' : i.impactScore >= 50 ? '#D35400' : '#27AE60',
                                    width: `${i.impactScore}%`
                                  }} />
                                </div>
                              </div>
                            </div>
                          )}
                          {i.vehicleType && (
                            <div>
                              <div style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 }}>Vehicle Info</div>
                              <div style={{ fontSize: 13, color: 'var(--text-primary)' }}>{i.vehicleType} {i.vehicleNumber ? `(${i.vehicleNumber})` : ''}</div>
                            </div>
                          )}
                        </div>
                        {i.officerNotes && i.officerNotes.length > 0 && (
                          <div>
                            <div style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 6 }}>Officer Notes</div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                              {i.officerNotes.map((note, index) => (
                                <div key={index} style={{ background: 'var(--surface-3)', padding: '8px 12px', borderRadius: 6, border: '1px solid var(--border)' }}>
                                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--text-muted)', marginBottom: 2 }}>
                                    <span style={{ fontWeight: 600 }}>{note.author}</span>
                                    <span>{new Date(note.timestamp).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</span>
                                  </div>
                                  <div style={{ fontSize: 12, color: 'var(--text-primary)' }}>{note.text}</div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {diversion && (
                      <div style={{ fontSize: 13, color: '#27AE60', marginTop: 6, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}>
                        <span>↪</span> Suggested Diversion: {diversion.label} ({diversion.estimatedDelay} delay)
                      </div>
                    )}
                  </div>
                );
              })}
              {activeIncidents.length > 10 && (
                <div style={{ fontSize: 13, color: 'var(--text-muted)', textAlign: 'center', marginTop: 4 }}>
                  + {activeIncidents.length - 10} more incidents active
                </div>
              )}
            </div>
          )}
        </div>

        {/* Active & Planned Events Section */}
        {currentEvents.length > 0 && (
          <div style={cardStyle}>
            <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#2E86C1', marginBottom: 18 }}>
              Active & Planned Events
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {currentEvents.map(e => {
                const impactColor = e.impactLevel === 'High' ? '#B03A2E' : e.impactLevel === 'Medium' ? '#D35400' : '#27AE60';
                const isExpanded = !!expandedEvents[e.id];

                return (
                  <div
                    key={e.id}
                    onClick={() => toggleEvent(e.id)}
                    style={{
                      padding: '24px 28px',
                      background: 'var(--surface-2)',
                      borderRadius: 12,
                      border: '1px solid rgba(46, 134, 193, 0.25)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 16,
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      boxShadow: isExpanded ? '0 6px 16px rgba(0, 0, 0, 0.25)' : '0 2px 6px rgba(0, 0, 0, 0.15)'
                    }}
                    className="hover-card-highlight"
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16 }}>
                      <div>
                        <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4 }}>{e.name}</div>
                        <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
                          <span style={{ fontWeight: 600 }}>{TYPE_LABELS[e.type] || e.type}</span> · {e.venue}
                        </div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <div style={{ display: 'flex', gap: 8 }}>
                          <span style={{
                            fontSize: 11,
                            fontWeight: 700,
                            color: impactColor,
                            background: `${impactColor}15`,
                            padding: '4px 10px',
                            borderRadius: 6,
                            border: `1px solid ${impactColor}30`,
                            textTransform: 'uppercase',
                            letterSpacing: '0.05em'
                          }}>
                            {e.impactLevel} Impact
                          </span>
                          <span style={{
                            fontSize: 11,
                            fontWeight: 700,
                            color: '#2E86C1',
                            background: 'rgba(46, 134, 193, 0.1)',
                            padding: '4px 10px',
                            borderRadius: 6,
                            border: '1px solid rgba(46, 134, 193, 0.2)',
                            textTransform: 'uppercase',
                            letterSpacing: '0.05em'
                          }}>
                            {e.status}
                          </span>
                        </div>
                        <ChevronIcon expanded={isExpanded} />
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, borderTop: '1px solid var(--border)', paddingTop: 16 }}>
                      <div>
                        <div style={{ fontSize: 10, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 }}>Schedule & Date</div>
                        <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>
                          {new Date(e.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })} · {e.startTime} - {e.endTime}
                        </div>
                      </div>
                      <div>
                        <div style={{ fontSize: 10, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 }}>Crowd Density</div>
                        <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>{e.crowdSize}</div>
                      </div>
                      <div>
                        <div style={{ fontSize: 10, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 }}>Personnel Deployed</div>
                        <div style={{ fontSize: 13, fontWeight: 600, color: '#27AE60' }}>{e.officersDeployed} Officers</div>
                      </div>
                    </div>

                    {isExpanded && (
                      <div style={{
                        marginTop: 14,
                        paddingTop: 14,
                        borderTop: '1px solid var(--border)',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 14
                      }}>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
                          <div>
                            <div style={{ fontSize: 10, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 }}>Coordinates</div>
                            <div style={{ fontSize: 13, color: 'var(--text-primary)' }}>Lat: {e.lat.toFixed(4)}, Lng: {e.lng.toFixed(4)}</div>
                          </div>
                          {e.predictedScore && (
                            <div>
                              <div style={{ fontSize: 10, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 }}>Predicted Congestion</div>
                              <div style={{ fontSize: 13, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: 8 }}>
                                <span>{e.predictedScore}% Congestion Rating</span>
                                <div style={{ flex: 1, height: 6, background: 'var(--surface-3)', borderRadius: 3, overflow: 'hidden', maxWidth: 100 }}>
                                  <div style={{
                                    height: '100%',
                                    background: e.predictedScore >= 80 ? '#B03A2E' : e.predictedScore >= 50 ? '#D35400' : '#27AE60',
                                    width: `${e.predictedScore}%`
                                  }} />
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                        <div>
                          <div style={{ fontSize: 10, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 }}>Recommended Actions</div>
                          <div style={{ fontSize: 13, color: 'var(--text-primary)', lineHeight: '1.6' }}>
                            • Deploy additional traffic marshals at key intersections surrounding {e.venue}.<br />
                            • Inform commuters via VMS (Variable Message Signs) on {e.affectedCorridors.slice(0, 2).join(' and ')}.<br />
                            • Synchronize signals along the primary approach routes to accommodate peak crowd flow.
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 12 }}>
                            <button
                              onClick={(evt) => {
                                evt.stopPropagation();
                                navigate(`/debrief/${e.id}`);
                              }}
                              style={{
                                padding: '6px 14px',
                                background: 'var(--accent)',
                                color: 'white',
                                border: 'none',
                                borderRadius: 6,
                                fontSize: 12,
                                fontWeight: 600,
                                cursor: 'pointer',
                                transition: 'background 0.2s ease',
                              }}
                              className="hover:bg-[var(--accent-hover)]"
                            >
                              View Event Debrief & Analysis
                            </button>
                          </div>
                        </div>
                      </div>
                    )}

                    <div style={{ borderTop: '1px solid var(--border)', paddingTop: 12 }}>
                      <div style={{ fontSize: 10, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 6 }}>Affected Corridors</div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                        {e.affectedCorridors.map(corridor => (
                          <span key={corridor} style={{
                            fontSize: 11,
                            fontWeight: 500,
                            background: 'var(--surface-3)',
                            color: 'var(--text-secondary)',
                            padding: '3px 8px',
                            borderRadius: 4,
                            border: '1px solid var(--border)'
                          }}>
                            {corridor}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
