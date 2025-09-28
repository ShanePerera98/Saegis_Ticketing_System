import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

import { AuthProvider, useAuth } from './contexts/AuthContext';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import ClientTickets from './pages/ClientTickets';
import TicketDetails from './pages/TicketDetails';
import CancelledTickets from './pages/CancelledTickets';
import MergeCenter from './pages/MergeCenter';
import Reports from './pages/Reports';
import TemplateBuilder from './pages/TemplateBuilder';
import ActivityLogs from './components/ActivityLogs';
import SystemStatus from './components/SystemStatus';
import ErrorBoundary from './components/ErrorBoundary';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
    },
  },
});

// Protected Route Component
const ProtectedRoute = ({ children, requiredRole = null }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }
  
  if (!user) {
    return <Navigate to="/login" />;
  }
  
  // Check role if required
  if (requiredRole && user.role !== requiredRole) {
    // Redirect based on user role
    if (user.role === 'CLIENT') {
      return <Navigate to="/client/tickets" />;
    } else {
      return <Navigate to="/dashboard" />;
    }
  }
  
  return children;
};

// Role-based redirect component
const RoleBasedRedirect = () => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }
  
  if (!user) {
    return <Navigate to="/login" />;
  }
  
  // Redirect based on role
  if (user.role === 'CLIENT') {
    return <Navigate to="/client/tickets" />;
  } else {
    return <Navigate to="/dashboard" />;
  }
};

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <ErrorBoundary>
        <AuthProvider>
          <Router>
            <div className="min-h-screen bg-gray-50">
              <Routes>
                {/* Login route */}
                <Route path="/login" element={<Login />} />
                
                {/* Root redirect */}
                <Route path="/" element={<RoleBasedRedirect />} />
                
                {/* Admin/Super Admin routes */}
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  }
                />
                
                <Route
                  path="/cancelled-tickets"
                  element={
                    <ProtectedRoute>
                      <CancelledTickets />
                    </ProtectedRoute>
                  }
                />
                
                <Route
                  path="/merge-center"
                  element={
                    <ProtectedRoute>
                      <MergeCenter />
                    </ProtectedRoute>
                  }
                />
                
                <Route
                  path="/reports"
                  element={
                    <ProtectedRoute>
                      <Reports />
                    </ProtectedRoute>
                  }
                />
                
                <Route
                  path="/templates"
                  element={
                    <ProtectedRoute>
                      <TemplateBuilder />
                    </ProtectedRoute>
                  }
                />
                
                <Route
                  path="/activity-logs"
                  element={
                    <ProtectedRoute>
                      <ActivityLogs />
                    </ProtectedRoute>
                  }
                />
                
                <Route
                  path="/system-status"
                  element={
                    <ProtectedRoute>
                      <SystemStatus />
                    </ProtectedRoute>
                  }
                />
                
                {/* Client routes */}
                <Route
                  path="/client/tickets"
                  element={
                    <ProtectedRoute requiredRole="CLIENT">
                      <ClientTickets />
                    </ProtectedRoute>
                  }
                />
                
                {/* Shared routes */}
                <Route
                  path="/tickets/:id"
                  element={
                    <ProtectedRoute>
                      <TicketDetails />
                    </ProtectedRoute>
                  }
                />

                {/* Direct tickets path -> role-based redirect so server can point to /tickets */}
                <Route
                  path="/tickets"
                  element={<RoleBasedRedirect />}
                />
                
                {/* Catch all */}
                <Route path="*" element={<Navigate to="/" />} />
              </Routes>
            </div>
          </Router>
        </AuthProvider>
      </ErrorBoundary>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
};

// Render the app
const container = document.getElementById('ticket-app');
if (container) {
  const root = createRoot(container);
  root.render(<App />);
}
