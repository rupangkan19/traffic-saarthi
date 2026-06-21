import { useState, type ReactNode, createContext, useContext } from 'react';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

export type PanelType = 'none' | 'log' | 'plan' | 'detail' | 'recommendation';

interface PanelContextValue {
  panel: PanelType;
  setPanel: (p: PanelType) => void;
  selectedId: string | null;
  setSelectedId: (id: string | null) => void;
}

export const PanelContext = createContext<PanelContextValue | null>(null);

export function usePanel() {
  const ctx = useContext(PanelContext);
  if (!ctx) {
    return {
      panel: 'none' as PanelType,
      setPanel: () => {},
      selectedId: null as string | null,
      setSelectedId: () => {},
    };
  }
  return ctx;
}

export default function Layout({ children }: { children: ReactNode }) {
  const [panel, setPanel] = useState<PanelType>('none');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <PanelContext.Provider value={{ panel, setPanel, selectedId, setSelectedId }}>
      <div className="flex h-screen overflow-hidden relative">
        {/* Overlay backdrop for mobile when sidebar is open */}
        {sidebarOpen && (
          <div
            onClick={() => setSidebarOpen(false)}
            className="md:hidden fixed inset-0 bg-black/50 z-40 backdrop-blur-sm"
          />
        )}

        <Sidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          onLogIncident={() => setPanel('log')}
          onPlanEvent={() => setPanel('plan')}
        />
        <div className="flex flex-col flex-1 overflow-hidden w-full">
          <Navbar onToggleSidebar={() => setSidebarOpen(o => !o)} />
          <main className="overflow-hidden relative" style={{ height: 'calc(100vh - 56px)', background: 'var(--bg)' }}>
            {children}
          </main>
        </div>
      </div>
    </PanelContext.Provider>
  );
}
