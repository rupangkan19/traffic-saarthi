import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import 'leaflet/dist/leaflet.css';
import './index.css';
import App from './App';
import { ToastProvider } from './components/ui/Toast';
import { IncidentsProvider } from './context/IncidentsContext';
import { ThemeProvider } from './context/ThemeContext';
import { EventsProvider } from './context/EventsContext';
import { AuthProvider } from './context/AuthContext';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <EventsProvider>
            <IncidentsProvider>
              <ToastProvider>
                <App />
              </ToastProvider>
            </IncidentsProvider>
          </EventsProvider>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>
);

