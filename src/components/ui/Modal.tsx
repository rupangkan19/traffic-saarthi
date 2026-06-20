import type { ReactNode } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  width?: string;
}

export function Modal({ isOpen, onClose, title, children, width = '480px' }: ModalProps) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white rounded-[6px] p-6" style={{ width, boxShadow: '0 8px 24px rgba(0,0,0,0.18)' }}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-[16px] font-semibold text-[#0F1923]">{title}</h2>
          <button onClick={onClose} className="text-[#8896A5] hover:text-[#0F1923] text-[20px] leading-none">×</button>
        </div>
        {children}
      </div>
    </div>
  );
}
