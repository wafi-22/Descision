import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import ResearchPage from './pages/ResearchPage';
import ReportPage from './pages/ReportPage';

function AppLayout({ children }) {
  const location = useLocation();
  const isLoginPage = location.pathname === '/login';

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 flex flex-col font-sans">
      {!isLoginPage && <Navbar />}
      <main className="flex-1">
        {children}
      </main>
      
      {!isLoginPage && (
        <footer className="no-print border-t border-slate-900 bg-navy-950/80 py-6 text-center text-xs text-slate-400">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2">
            <div className="flex items-center space-x-2">
              <span className="font-bold text-slate-300">DecisionMind AI</span>
              <span>•</span>
              <span>Scenario-Based Enterprise Decision Intelligence MVP</span>
            </div>
            <div className="text-slate-400">
              Offline Consensus Engine • Zero-Config Hackathon Architecture
            </div>
          </div>
        </footer>
      )}
    </div>
  );
}

function ProtectedRoute({ children }) {
  const { user } = useAuth();
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppLayout>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
            <Route path="/research" element={<ProtectedRoute><ResearchPage /></ProtectedRoute>} />
            <Route path="/report/:id" element={<ProtectedRoute><ReportPage /></ProtectedRoute>} />
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </AppLayout>
      </BrowserRouter>
    </AuthProvider>
  );
}
