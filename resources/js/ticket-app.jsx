import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Import elastic scroll system for enhanced UX
import './utils/elasticScroll.js';

import { AuthProvider, useAuth } from './contexts/AuthContext';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import ClientTickets from './pages/ClientTickets';
import TicketDetails from './pages/TicketDetails';
import CancelledTickets from './pages/CancelledTickets';
import MergeCenter from './pages/MergeCenter';
import Reports from './pages/Reports';
import UserManagement from './pages/UserManagement';
import ProfileManagement from './pages/ProfileManagement_new';
import HeadsUpNoticeManager from './pages/HeadsUpNoticeManager';
import TroubleshootDocuments from './pages/TroubleshootDocuments';
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
    return <Navigate to="/tickets" />;
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
                  path="/activity-logs"
                  element={
                    <ProtectedRoute>
                      <ActivityLogs />
                    </ProtectedRoute>
                  }
                />
                
                <Route
                  path="/users"
                  element={
                    <ProtectedRoute>
                      <UserManagement />
                    </ProtectedRoute>
                  }
                />
                
                <Route
                  path="/profile"
                  element={
                    <ProtectedRoute>
                      <ProfileManagement />
                    </ProtectedRoute>
                  }
                />
                
                <Route
                  path="/headsup-notice"
                  element={
                    <ProtectedRoute>
                      <HeadsUpNoticeManager />
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
                
                <Route
                  path="/troubleshoot"
                  element={
                    <ProtectedRoute>
                      <TroubleshootDocuments />
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
    </QueryClientProvider>
  );
};

// Render the app
console.log('Script loaded, starting React app...');

const container = document.getElementById('ticket-app');
console.log('Looking for ticket-app element...');
console.log('Container found:', container);

if (container) {
  try {
    const root = createRoot(container);
    console.log('Ticket-app mounting...');
    root.render(<App />);
    console.log('React app rendered successfully');
  } catch (error) {
    console.error('Error rendering React app:', error);
    container.innerHTML = `<div style="color: red; padding: 20px;">Error: ${error.message}</div>`;
  }
} else {
  console.error('Could not find ticket-app element!');
}
