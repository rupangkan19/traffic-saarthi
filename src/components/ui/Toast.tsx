import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';

type ToastVariant = 'success' | 'error' | 'info';

interface Toast {
  id: number;
  message: string;
  variant: ToastVariant;
}

interface ToastContextType {
  showToast: (message: string, variant?: ToastVariant) => void;
}

const ToastContext = createContext<ToastContextType>({ showToast: () => {} });

export function useToast() {
  return useContext(ToastContext);
}

const borderColors: Record<ToastVariant, string> = {
  success: '#1A7F4B',
  error: '#C0392B',
  info: '#1A5276'
};

const icons: Record<ToastVariant, string> = {
  success: '✓',
  error: '✕',
  info: 'ℹ'
};

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  let counter = 0;

  const showToast = useCallback((message: string, variant: ToastVariant = 'info') => {
    const id = ++counter;
    setToasts(prev => [...prev, { id, message, variant }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 4000);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed bottom-4 right-4 flex flex-col gap-2 z-50">
        {toasts.map(toast => (
          <div
            key={toast.id}
            className="flex items-center gap-3 bg-white rounded-[6px] px-4 py-3 min-w-[280px]"
            style={{ boxShadow: '0 4px 12px rgba(0,0,0,0.15)', borderLeft: `4px solid ${borderColors[toast.variant]}` }}
          >
            <span style={{ color: borderColors[toast.variant], fontWeight: 600 }}>{icons[toast.variant]}</span>
            <span className="text-[13px] text-[#0F1923] flex-1">{toast.message}</span>
            <button
              onClick={() => setToasts(prev => prev.filter(t => t.id !== toast.id))}
              className="text-[#8896A5] hover:text-[#0F1923] text-[16px] leading-none"
            >×</button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
