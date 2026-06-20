import { Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
import LogIncident from './pages/LogIncident';
import EventPlanner from './pages/EventPlanner';
import Analytics from './pages/Analytics';
import IncidentHistory from './pages/IncidentHistory';
import IncidentDetail from './pages/IncidentDetail';
import EventDebrief from './pages/EventDebrief';
import Recommendations from './pages/Recommendations';
import FutureEvents from './pages/FutureEvents';
import TodayPlan from './pages/TodayPlan';
import LoginPage from './pages/LoginPage';
import PatrolManagement from './pages/PatrolManagement';
import ResourcesEquipment from './pages/ResourcesEquipment';
import AlertCenter from './pages/AlertCenter';
import ReportsExport from './pages/ReportsExport';
import { useAuth } from './context/AuthContext';

export default function App() {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/log-incident" element={<LogIncident />} />
        <Route path="/plan-event" element={<EventPlanner />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/history" element={<IncidentHistory />} />
        <Route path="/incident/:id" element={<IncidentDetail />} />
        <Route path="/debrief/:eventId" element={<EventDebrief />} />
        <Route path="/recommendations" element={<Recommendations />} />
        <Route path="/future-events" element={<FutureEvents />} />
        <Route path="/today-plan" element={<TodayPlan />} />
        <Route path="/patrol" element={<PatrolManagement />} />
        <Route path="/resources" element={<ResourcesEquipment />} />
        <Route path="/alerts" element={<AlertCenter />} />
        <Route path="/reports" element={<ReportsExport />} />
      </Routes>
    </Layout>
  );
}
