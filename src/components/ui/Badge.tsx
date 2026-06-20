import type { ReactNode } from 'react';

type BadgeVariant = 'high'|'medium'|'low'|'critical'|'active'|'resolved'|'closed'|'planned'|'unplanned'|'draft'|'info';

const styles: Record<BadgeVariant, string> = {
  high: 'bg-[#FDEDEC] text-[#C0392B]',
  critical: 'bg-[#FDEDEC] text-[#C0392B]',
  medium: 'bg-[#FEF9E7] text-[#B7770D]',
  active: 'bg-[#FEF9E7] text-[#B7770D]',
  low: 'bg-[#EAFAF1] text-[#1A7F4B]',
  resolved: 'bg-[#EAFAF1] text-[#1A7F4B]',
  closed: 'bg-[#EAFAF1] text-[#1A7F4B]',
  planned: 'bg-[#EBF5FB] text-[#1A5276]',
  info: 'bg-[#EBF5FB] text-[#1A5276]',
  draft: 'bg-[#F8F9FA] text-[#8896A5]',
  unplanned: 'bg-[#F8F9FA] text-[#8896A5]',
};

export function Badge({ variant, children }: { variant: BadgeVariant; children: ReactNode }) {
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium ${styles[variant]}`}>
      {children}
    </span>
  );
}
