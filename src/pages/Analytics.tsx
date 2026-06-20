import { type ReactNode, useEffect, useRef } from 'react';
import {
  BarChart, Bar, PieChart, Pie, Cell, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import analyticsData from '../data/analyticsData.json';
import { useTheme } from '../context/ThemeContext';

const CAUSE_COLORS: Record<string, string> = {
  accident: '#B03A2E',            // Deep crimson red
  vehicle_breakdown: '#D35400',    // Muted orange-amber
  construction: '#2E86C1',        // Muted steel blue
  water_logging: '#34495E',        // Dark slate gray
  tree_fall: '#27AE60',           // Forest green
  public_event: '#8E44AD',        // Muted violet
  vip_movement: '#16A085',        // Deep teal
  pot_holes: '#A04000',           // Deep brown-orange
  road_conditions: '#7F8C8D',     // Cool gray
  congestion: '#9A7D0A',          // Dark gold-green
  others: '#5D6D7E',              // Slate gray
};

const PRIORITY_COLORS: Record<string, string> = {
  High: '#B03A2E',
  Medium: '#D35400',
  Low: '#27AE60',
};

function ChartCard({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div
      style={{
        background: 'var(--card-bg)',
        border: '1px solid var(--border)',
        borderRadius: 6,
        padding: '10px 14px',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
      }}
    >
      <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>
        {title}
      </div>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        {children}
      </div>
    </div>
  );
}

function drawDots(map: L.Map, canvas: HTMLCanvasElement) {
  const size = map.getSize();
  canvas.width = size.x;
  canvas.height = size.y;
  const ctx = canvas.getContext('2d')!;
  ctx.clearRect(0, 0, size.x, size.y);

  analyticsData.hotspots.forEach(inc => {
    try {
      const pt = map.latLngToContainerPoint(L.latLng(inc.lat, inc.lng));
      
      // Priority-based dots
      let color = 'rgba(93, 109, 126, 0.6)';
      if (inc.priority === 'High') color = 'rgba(176, 58, 46, 0.8)';      // Crimson
      else if (inc.priority === 'Medium') color = 'rgba(211, 84, 0, 0.8)';  // Orange
      else if (inc.priority === 'Low') color = 'rgba(39, 174, 96, 0.8)';    // Green

      ctx.beginPath();
      ctx.arc(pt.x, pt.y, 3, 0, 2 * Math.PI); // Radius 3 for dense representation
      ctx.fillStyle = color;
      ctx.fill();
      
      // Subtle border for contrast
      ctx.lineWidth = 0.5;
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
      ctx.stroke();
    } catch {
      // Coordinate mapping safety
    }
  });
}

function HotspotMap() {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el || el.querySelector('.leaflet-pane')) return;

    // Calculate map centroid dynamically based on dataset coords to prevent centering bugs
    const coords = analyticsData.hotspots;
    let centerLat = 12.9716;
    let centerLng = 77.5946;
    if (coords.length > 0) {
      const sumLat = coords.reduce((sum, c) => sum + c.lat, 0);
      const sumLng = coords.reduce((sum, c) => sum + c.lng, 0);
      centerLat = sumLat / coords.length;
      centerLng = sumLng / coords.length;
    }

    let map: L.Map;
    try {
      // Zoomed-in view (13) centered on actual density center
      map = L.map(el, { center: [centerLat, centerLng], zoom: 13, zoomControl: true });
    } catch { return; }
    mapRef.current = map;

    // Premium dark/clean street map styling
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
    }).addTo(map);

    const canvas = document.createElement('canvas');
    canvas.style.cssText = 'position:absolute;top:0;left:0;pointer-events:none;z-index:450;';
    el.appendChild(canvas);

    const redraw = () => drawDots(map, canvas);
    map.on('moveend zoomend resize', redraw);
    map.whenReady(() => setTimeout(redraw, 200));

    return () => {
      try { map.remove(); } catch { /* */ }
      mapRef.current = null;
    };
  }, []);

  return (
    <div style={{ background: 'var(--card-bg)', border: '1px solid var(--border)', borderRadius: 6, padding: '10px 14px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
        <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
          Geographical Incident Distribution (Detailed View)
        </div>
        <div style={{ fontSize: 9, color: 'var(--text-muted)' }}>
          {analyticsData.hotspots.length.toLocaleString()} plotted points
        </div>
      </div>
      
      {/* Map Legend */}
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, marginBottom: 8, alignItems: 'center', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#B03A2E' }} />
            <span style={{ fontSize: 9, color: 'var(--text-secondary)' }}>High</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#D35400' }} />
            <span style={{ fontSize: 9, color: 'var(--text-secondary)' }}>Medium</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#27AE60' }} />
            <span style={{ fontSize: 9, color: 'var(--text-secondary)' }}>Low</span>
          </div>
        </div>
        <div style={{ fontSize: 9, color: 'var(--text-muted)' }}>
          Scroll wheel / pinch to zoom in detail
        </div>
      </div>
      
      <div ref={containerRef} style={{ height: 380, borderRadius: 4, overflow: 'hidden', position: 'relative' }} />
    </div>
  );
}

function StatTile({ label, value, accent, sub }: { label: string; value: string | number; accent: string; sub?: string }) {
  return (
    <div style={{ background: 'var(--card-bg)', border: '1px solid var(--border)', borderRadius: 6, padding: '8px 12px' }}>
      <div style={{ fontSize: 9, color: 'var(--text-secondary)', marginBottom: 2, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{label}</div>
      <div style={{ fontSize: 20, fontWeight: 700, color: accent, lineHeight: 1.1 }}>{value}</div>
      {sub && <div style={{ fontSize: 9, color: 'var(--text-muted)', marginTop: 2 }}>{sub}</div>}
    </div>
  );
}

export default function Analytics() {
  const { theme } = useTheme();
  const kpi = analyticsData.kpis;

  const darkTooltipStyle = {
    contentStyle: {
      background: theme === 'light' ? '#FFFFFF' : '#0C1219',
      border: theme === 'light' ? '1px solid #DDE1E7' : '1px solid #1E2D3D',
      borderRadius: 4,
      color: theme === 'light' ? '#0F1923' : '#E2E8F0',
      fontSize: 10,
      padding: '6px 10px'
    },
    labelStyle: {
      color: theme === 'light' ? '#4A5568' : '#8896A5',
      fontWeight: 600,
      marginBottom: 2
    },
  };

  const axisStyle = {
    tick: { fill: theme === 'light' ? '#4A5568' : '#8896A5', fontSize: 9 },
    axisLine: { stroke: theme === 'light' ? '#DDE1E7' : '#1E2D3D' },
    tickLine: { stroke: theme === 'light' ? '#DDE1E7' : '#1E2D3D' }
  };

  const formatResTime = (totalMin: number) => {
    if (totalMin < 60) return `${totalMin}m`;
    const h = Math.floor(totalMin / 60);
    const m = totalMin % 60;
    return `${h}h ${m}m`;
  };

  return (
    <div className="overflow-y-auto h-full" style={{ background: 'var(--bg)' }}>
      <div style={{ maxWidth: 1500, margin: '0 auto', padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 12 }}>

        {/* Header - Compact */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)' }}>Saarthi Traffic Analytics Dashboard</div>
            <div style={{ fontSize: 10, color: 'var(--text-secondary)', marginTop: 1 }}>
              Real-time spatial-temporal analysis and incident diagnostics
            </div>
          </div>
          <div style={{ fontSize: 9, color: 'var(--text-muted)', background: 'var(--card-bg)', border: '1px solid var(--border)', padding: '4px 8px', borderRadius: 4 }}>
            System database: {kpi.total_incidents.toLocaleString()} records
          </div>
        </div>

        {/* KPI Grid - Dense */}
        <div className="grid grid-cols-5 gap-2">
          <StatTile 
            label="Total Incidents" 
            value={kpi.total_incidents.toLocaleString()} 
            accent="var(--text-primary)" 
            sub="Logged dataset history" 
          />
          <StatTile 
            label="Active Load" 
            value={kpi.active_incidents.toLocaleString()} 
            accent="#B03A2E" 
            sub={`${Math.round((kpi.active_incidents / kpi.total_incidents) * 100)}% active dispatch`} 
          />
          <StatTile 
            label="High Priority" 
            value={kpi.high_priority_incidents.toLocaleString()} 
            accent="#D35400" 
            sub={`${Math.round((kpi.high_priority_incidents / kpi.total_incidents) * 100)}% critical flags`} 
          />
          <StatTile 
            label="Road Closures" 
            value={kpi.road_closures.toLocaleString()} 
            accent="#B03A2E" 
            sub={`${Math.round((kpi.road_closures / kpi.total_incidents) * 100)}% barricaded routes`} 
          />
          <StatTile 
            label="Avg Clearance Time" 
            value={formatResTime(kpi.avg_resolution_time_min)} 
            accent="#27AE60" 
            sub="Average dispatch to clear" 
          />
        </div>

        {/* Layout Grid: Map (Left 7 cols) & Core Breakdown (Right 5 cols) */}
        <div className="grid grid-cols-12 gap-3">
          
          {/* LEFT PANEL */}
          <div className="col-span-7 flex flex-col gap-3">
            <div>
              <HotspotMap />
            </div>

            {/* Row with two dense widgets */}
            <div className="grid grid-cols-2 gap-3" style={{ height: 210 }}>
              <ChartCard title="Incidents by Hour of Day">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={analyticsData.hourly_trend} margin={{ top: 5, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                    <XAxis dataKey="hour" {...axisStyle} interval={3} />
                    <YAxis {...axisStyle} />
                    <Tooltip {...darkTooltipStyle} />
                    <Bar dataKey="count" fill="var(--accent)" radius={[1, 1, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </ChartCard>

              <ChartCard title="Regional Distribution (Zones)">
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', gap: 10 }}>
                  <ResponsiveContainer width="45%" height="100%">
                    <PieChart>
                      <Pie 
                        data={analyticsData.by_zone.slice(0, 5)} 
                        cx="50%" 
                        cy="50%" 
                        innerRadius={28} 
                        outerRadius={42} 
                        dataKey="value" 
                        paddingAngle={2}
                      >
                        {analyticsData.by_zone.slice(0, 5).map((_, idx) => {
                          const palette = ['#2E86C1', '#34495E', '#27AE60', '#D35400', '#8E44AD'];
                          return <Cell key={idx} fill={palette[idx % palette.length]} />;
                        })}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 4, width: '55%', overflow: 'hidden' }}>
                    {analyticsData.by_zone.slice(0, 5).map((entry, idx) => {
                      const palette = ['#2E86C1', '#34495E', '#27AE60', '#D35400', '#8E44AD'];
                      const totalZoneCount = analyticsData.by_zone.reduce((s, z) => s + z.value, 0);
                      return (
                        <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 9 }}>
                          <div style={{ width: 6, height: 6, borderRadius: 1, background: palette[idx % palette.length], flexShrink: 0 }} />
                          <span style={{ color: 'var(--text-secondary)', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap', width: 65 }} title={entry.name}>
                            {entry.name}
                          </span>
                          <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{entry.value}</span>
                          <span style={{ color: 'var(--text-muted)' }}>{Math.round((entry.value / totalZoneCount) * 100)}%</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </ChartCard>
            </div>
          </div>

          {/* RIGHT PANEL */}
          <div className="col-span-5 flex flex-col gap-3">
            
            {/* Primary Cause Bar Chart */}
            <div style={{ height: 180 }}>
              <ChartCard title="Incident volume by Cause">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={analyticsData.by_cause.slice(0, 6)} layout="vertical" margin={{ left: -10, top: 5, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" horizontal={false} />
                    <XAxis type="number" {...axisStyle} />
                    <YAxis dataKey="name" type="category" {...axisStyle} width={100} />
                    <Tooltip {...darkTooltipStyle} />
                    <Bar dataKey="value" radius={[0, 2, 2, 0]}>
                      {analyticsData.by_cause.slice(0, 6).map((entry, idx) => (
                        <Cell key={idx} fill={CAUSE_COLORS[entry.raw] || '#5D6D7E'} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </ChartCard>
            </div>

            {/* Row: Priority & Vehicle Breakdown */}
            <div className="grid grid-cols-2 gap-3" style={{ height: 180 }}>
              <ChartCard title="Priority Distribution">
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                  <ResponsiveContainer width="100%" height={80}>
                    <PieChart>
                      <Pie
                        data={analyticsData.by_priority}
                        cx="50%"
                        cy="50%"
                        innerRadius={24}
                        outerRadius={38}
                        dataKey="value"
                        paddingAngle={2}
                      >
                        {analyticsData.by_priority.map((entry, idx) => (
                          <Cell key={idx} fill={PRIORITY_COLORS[entry.name] || '#5D6D7E'} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 2, width: '100%' }}>
                    {analyticsData.by_priority.map(entry => (
                      <div key={entry.name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 9 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                          <div style={{ width: 6, height: 6, borderRadius: 1, background: PRIORITY_COLORS[entry.name] }} />
                          <span style={{ color: 'var(--text-secondary)' }}>{entry.name}</span>
                        </div>
                        <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>
                          {Math.round((entry.value / kpi.total_incidents) * 100)}%
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </ChartCard>

              <ChartCard title="By Vehicle Type">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={analyticsData.by_vehicle_type.slice(0, 5)} layout="vertical" margin={{ left: -20, top: 5, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" horizontal={false} />
                    <XAxis type="number" {...axisStyle} />
                    <YAxis dataKey="name" type="category" {...axisStyle} width={75} />
                    <Tooltip {...darkTooltipStyle} />
                    <Bar dataKey="value" fill="#2E86C1" radius={[0, 1.5, 1.5, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </ChartCard>
            </div>

            {/* Top Congested Corridors list */}
            <div style={{ height: 232 }}>
              <ChartCard title="Top Congested Corridors (Ranked)">
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6, height: '100%', justifyContent: 'space-around' }}>
                  {(() => {
                    const topCorridors = analyticsData.by_corridor.filter(c => c.name !== 'Non-corridor').slice(0, 5);
                    const maxVal = topCorridors[0]?.value || 1;
                    return topCorridors.map((c, i) => (
                      <div key={i}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, marginBottom: 2 }}>
                          <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{c.name}</span>
                          <span style={{ color: 'var(--text-secondary)' }}>{c.value.toLocaleString()} incidents</span>
                        </div>
                        <div style={{ height: 4, background: 'var(--border)', borderRadius: 2, overflow: 'hidden' }}>
                          <div 
                            style={{ 
                              height: '100%', 
                              width: `${(c.value / maxVal) * 100}%`, 
                              background: '#2E86C1', 
                              borderRadius: 2 
                            }} 
                          />
                        </div>
                      </div>
                    ));
                  })()}
                </div>
              </ChartCard>
            </div>

          </div>

        </div>

        {/* BOTTOM PANEL: Monthly Trends & Diagnostic Charts (DENSE 4-col breakdown) */}
        <div className="grid grid-cols-12 gap-3">
          
          <div className="col-span-6" style={{ height: 220 }}>
            <ChartCard title="Chronological Trend (Incidents by Priority)">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={analyticsData.monthly_trend} margin={{ top: 5, bottom: 5, right: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="month" {...axisStyle} />
                  <YAxis {...axisStyle} />
                  <Tooltip {...darkTooltipStyle} />
                  <Legend wrapperStyle={{ fontSize: 9, color: 'var(--text-secondary)', paddingTop: 2 }} />
                  <Area type="monotone" dataKey="high" stackId="1" stroke="#B03A2E" fill="rgba(176,58,46,0.2)" name="High" />
                  <Area type="monotone" dataKey="medium" stackId="1" stroke="#D35400" fill="rgba(211,84,0,0.2)" name="Medium" />
                  <Area type="monotone" dataKey="low" stackId="1" stroke="#27AE60" fill="rgba(39,174,96,0.2)" name="Low" />
                </AreaChart>
              </ResponsiveContainer>
            </ChartCard>
          </div>

          <div className="col-span-3" style={{ height: 220 }}>
            <ChartCard title="Avg Resolution Time (Minutes)">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={analyticsData.avg_res_by_cause.slice(0, 5)} layout="vertical" margin={{ left: -10, top: 5, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" horizontal={false} />
                  <XAxis type="number" {...axisStyle} />
                  <YAxis dataKey="name" type="category" {...axisStyle} width={75} />
                  <Tooltip {...darkTooltipStyle} formatter={(val) => [`${val} minutes`, 'Avg Time']} />
                  <Bar dataKey="minutes" fill="#27AE60" radius={[0, 1.5, 1.5, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>
          </div>

          <div className="col-span-3" style={{ height: 220 }}>
            <ChartCard title="Road Closures by Cause">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={analyticsData.closures_by_cause.slice(0, 5)} layout="vertical" margin={{ left: -10, top: 5, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" horizontal={false} />
                  <XAxis type="number" {...axisStyle} />
                  <YAxis dataKey="name" type="category" {...axisStyle} width={75} />
                  <Tooltip {...darkTooltipStyle} />
                  <Bar dataKey="value" fill="#B03A2E" radius={[0, 1.5, 1.5, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>
          </div>

        </div>

      </div>
    </div>
  );
}
