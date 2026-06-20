import { useState } from 'react';

const EQUIPMENT = [
  { id: 'EQ-001', name: 'Barricade Sets', category: 'Traffic Control', total: 240, deployed: 86, unit: 'sets', icon: '🚧' },
  { id: 'EQ-002', name: 'Traffic Cones', category: 'Traffic Control', total: 1200, deployed: 430, unit: 'pcs', icon: '🔴' },
  { id: 'EQ-003', name: 'Reflective Vests', category: 'Officer Gear', total: 320, deployed: 108, unit: 'pcs', icon: '🦺' },
  { id: 'EQ-004', name: 'Handheld Radios', category: 'Communication', total: 180, deployed: 72, unit: 'units', icon: '📻' },
  { id: 'EQ-005', name: 'Speed Guns', category: 'Enforcement', total: 28, deployed: 14, unit: 'units', icon: '🎯' },
  { id: 'EQ-006', name: 'Portable Signs', category: 'Traffic Control', total: 80, deployed: 34, unit: 'sets', icon: '🪧' },
  { id: 'EQ-007', name: 'First Aid Kits', category: 'Safety', total: 60, deployed: 18, unit: 'kits', icon: '🩺' },
  { id: 'EQ-008', name: 'CCTV Mobile Units', category: 'Surveillance', total: 12, deployed: 5, unit: 'units', icon: '📷' },
  { id: 'EQ-009', name: 'Tow Trucks', category: 'Vehicles', total: 8, deployed: 3, unit: 'vehicles', icon: '🚛' },
  { id: 'EQ-010', name: 'PCR Vehicles', category: 'Vehicles', total: 24, deployed: 16, unit: 'vehicles', icon: '🚔' },
  { id: 'EQ-011', name: 'Motorcycles', category: 'Vehicles', total: 36, deployed: 22, unit: 'vehicles', icon: '🏍' },
  { id: 'EQ-012', name: 'Breathalysers', category: 'Enforcement', total: 40, deployed: 16, unit: 'units', icon: '🫁' },
];

const CATEGORIES = ['All', ...Array.from(new Set(EQUIPMENT.map(e => e.category)))];

const STORES = [
  { name: 'Central Store – Hebbal', lat: 13.0358, items: 12, capacity: '85%' },
  { name: 'South Zone Store – BTM Layout', lat: 12.9172, items: 9, capacity: '62%' },
  { name: 'East Zone Store – Whitefield', lat: 12.9716, items: 7, capacity: '48%' },
  { name: 'Airport Road Depot', lat: 13.0488, items: 5, capacity: '30%' },
];

export default function ResourcesEquipment() {
  const [cat, setCat] = useState('All');
  const [search, setSearch] = useState('');

  const filtered = EQUIPMENT.filter(e =>
    (cat === 'All' || e.category === cat) &&
    e.name.toLowerCase().includes(search.toLowerCase())
  );

  const totalDeployed = EQUIPMENT.reduce((s, e) => s + e.deployed, 0);
  const totalCapacity = EQUIPMENT.reduce((s, e) => s + e.total, 0);
  const utilizationPct = Math.round((totalDeployed / totalCapacity) * 100);

  const card: React.CSSProperties = {
    background: 'var(--card-bg)', border: '1px solid var(--border)',
    borderRadius: 10, padding: '20px 24px', marginBottom: 16,
  };

  return (
    <div className="overflow-y-auto h-full" style={{ background: 'var(--bg)' }}>
      <div style={{ maxWidth: 1000, margin: '0 auto', padding: '28px 24px' }}>
        <div style={{ marginBottom: 24 }}>
          <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--text-primary)' }}>Resources & Equipment</div>
          <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 3 }}>
            Track inventory, deployment status and store locations across all traffic zones
          </div>
        </div>

        {/* KPIs */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12, marginBottom: 20 }}>
          {[
            { label: 'Total Asset Types', value: EQUIPMENT.length, color: 'var(--accent)' },
            { label: 'Total Items', value: totalCapacity.toLocaleString(), color: 'var(--text-primary)' },
            { label: 'Currently Deployed', value: totalDeployed.toLocaleString(), color: 'var(--amber)' },
            { label: 'Utilisation', value: `${utilizationPct}%`, color: utilizationPct > 70 ? 'var(--red)' : 'var(--green)' },
          ].map(s => (
            <div key={s.label} style={{ background: 'var(--card-bg)', border: '1px solid var(--border)', borderRadius: 8, padding: '14px 16px' }}>
              <div style={{ fontSize: 26, fontWeight: 800, color: s.color, lineHeight: 1 }}>{s.value}</div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Inventory Table */}
        <div style={card}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14, flexWrap: 'wrap' }}>
            <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-muted)', marginRight: 4 }}>Inventory</div>
            <div style={{ display: 'flex', gap: 6, flex: 1, flexWrap: 'wrap' }}>
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
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search..."
              style={{ border: '1px solid var(--border)', background: 'var(--input-bg)', borderRadius: 6, padding: '4px 10px', fontSize: 12, color: 'var(--text-primary)', width: 160 }}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {filtered.map(e => {
              const pct = Math.round((e.deployed / e.total) * 100);
              const barColor = pct >= 80 ? 'var(--red)' : pct >= 50 ? 'var(--amber)' : 'var(--green)';
              const available = e.total - e.deployed;
              return (
                <div key={e.id} style={{
                  display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 180px 80px',
                  alignItems: 'center', gap: 12, padding: '10px 14px',
                  background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: 8,
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ fontSize: 18 }}>{e.icon}</span>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>{e.name}</div>
                      <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{e.category}</div>
                    </div>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--amber)' }}>{e.deployed} <span style={{ fontSize: 10, color: 'var(--text-muted)', fontWeight: 400 }}>{e.unit}</span></div>
                    <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>Deployed</div>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--green)' }}>{available} <span style={{ fontSize: 10, color: 'var(--text-muted)', fontWeight: 400 }}>{e.unit}</span></div>
                    <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>Available</div>
                  </div>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
                      <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>Utilisation</span>
                      <span style={{ fontSize: 10, fontWeight: 700, color: barColor }}>{pct}%</span>
                    </div>
                    <div style={{ height: 5, background: 'var(--border)', borderRadius: 3, overflow: 'hidden' }}>
                      <div style={{ width: `${pct}%`, height: '100%', background: barColor, borderRadius: 3, transition: 'width 0.4s ease' }} />
                    </div>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <span style={{ fontSize: 11, fontWeight: 600, color: available < 5 ? 'var(--red)' : 'var(--text-muted)', background: available < 5 ? 'rgba(176,58,46,0.10)' : 'var(--surface-3)', padding: '2px 8px', borderRadius: 4 }}>
                      {available < 5 ? '⚠ Low Stock' : 'OK'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Store Locations */}
        <div style={card}>
          <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-muted)', marginBottom: 12 }}>Store Locations</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 10 }}>
            {STORES.map(s => (
              <div key={s.name} style={{ padding: '14px 16px', background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: 8 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                  <span style={{ fontSize: 16 }}>🏭</span>
                  <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>{s.name}</span>
                </div>
                <div style={{ display: 'flex', gap: 16, fontSize: 12, color: 'var(--text-secondary)' }}>
                  <span>{s.items} asset types stocked</span>
                  <span>Capacity: <strong style={{ color: 'var(--text-primary)' }}>{s.capacity}</strong></span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
