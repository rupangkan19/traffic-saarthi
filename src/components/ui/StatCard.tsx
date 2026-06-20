
interface StatCardProps {
  label: string;
  value: string | number;
  trend?: string;
  trendDir?: 'up' | 'down';
}

export function StatCard({ label, value, trend, trendDir }: StatCardProps) {
  return (
    <div className="bg-[var(--card-bg)] border border-[var(--border)] rounded-[6px] p-4" style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
      <div className="text-[12px] text-[var(--text-secondary)] mb-1">{label}</div>
      <div className="text-[24px] font-semibold text-[var(--text-primary)] tabular-nums">{value}</div>
      {trend && (
        <div className={`text-[11px] mt-1 ${trendDir === 'down' ? 'text-[var(--red)]' : 'text-[var(--green)]'}`}>
          {trend}
        </div>
      )}
    </div>
  );
}
