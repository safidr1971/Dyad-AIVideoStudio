import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LandingPage } from './pages/LandingPage';
import { AuthModal } from './components/AuthModal';
import { DashboardOverview } from './pages/DashboardOverview';
import { ReelWizard } from './pages/ReelWizard';
import { VideoProjects } from './pages/VideoProjects';
import { ContentSeries } from './pages/ContentSeries';
import { PublishCalendar } from './pages/PublishCalendar';
import { CreditsBilling } from './pages/CreditsBilling';
import { SettingsPage } from './pages/SettingsPage';
import NotFound from './pages/NotFound';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen bg-[#09090b] flex items-center justify-center text-zinc-400 font-mono text-sm">
        Initializing Firebase ai-video-studio-fac95 session...
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

const AppRoutes: React.FC = () => {
  const [authOpen, setAuthOpen] = useState(false);

  return (
    <>
      <Routes>
        <Route path="/" element={<LandingPage onOpenAuth={() => setAuthOpen(true)} />} />
        
        {/* Protected Dashboard Routes */}
        <Route path="/dashboard" element={<ProtectedRoute><DashboardOverview /></ProtectedRoute>} />
        <Route path="/dashboard/wizard" element={<ProtectedRoute><ReelWizard /></ProtectedRoute>} />
        <Route path="/dashboard/videos" element={<ProtectedRoute><VideoProjects /></ProtectedRoute>} />
        <Route path="/dashboard/series" element={<ProtectedRoute><ContentSeries /></ProtectedRoute>} />
        <Route path="/dashboard/calendar" element={<ProtectedRoute><PublishCalendar /></ProtectedRoute>} />
        <Route path="/dashboard/credits" element={<ProtectedRoute><CreditsBilling /></ProtectedRoute>} />
        <Route path="/dashboard/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />

        <Route path="*" element={<NotFound />} />
      </Routes>

      <AuthModal isOpen={authOpen} onClose={() => setAuthOpen(false)} />
    </>
  );
};

export function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}

export default App;
