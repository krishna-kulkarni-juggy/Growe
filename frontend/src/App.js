import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Login from './components/Login';
import SimpleLogin from './components/SimpleLogin';
import Dashboard from './components/Dashboard';
import MapView from './components/MapView';
import CRM from './components/CRM';
import LeaseAdmin from './components/LeaseAdmin';
import ShipperIntake from './components/ShipperIntake';
import ClientPortal from './components/ClientPortal';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import './App.css';

function AppContent() {
  const { user, loading } = useAuth();
  const [authSetup, setAuthSetup] = useState(false);

  // EMERGENCY FIX: Setup authentication for demo user
  useEffect(() => {
    if (!authSetup) {
      console.log('Setting up demo authentication...');
      
      // Create a valid demo user and token
      const demoUser = {
        id: "demo-admin",
        email: "admin@growe.com", 
        role: "admin",
        company_name: "Growe"
      };
      
      // Get a real token by making login API call
      fetch('http://localhost:8001/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: 'admin@growe.com',
          password: 'admin123'
        })
      })
      .then(response => response.json())
      .then(data => {
        console.log('Demo authentication successful:', data);
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        
        // Set axios default header for all future requests
        if (window.axios) {
          window.axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
        }
        
        setAuthSetup(true);
        
        // Force page reload to reinitialize with proper auth
        window.location.reload();
      })
      .catch(error => {
        console.error('Demo authentication failed:', error);
        setAuthSetup(true); // Still proceed to avoid infinite loop
      });
    }
  }, [authSetup]);

  // Demo user for UI rendering
  const currentUser = {
    id: "demo-admin", 
    email: "admin@growe.com",
    role: "admin",
    company_name: "Growe"
  };

  if (loading || !authSetup) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
        <div className="ml-4 text-lg text-gray-600">Setting up demo authentication...</div>
      </div>
    );
  }

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="pt-16">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route 
              path="/map" 
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <MapView />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/crm" 
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <CRM />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/leases" 
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <LeaseAdmin />
                </ProtectedRoute>
              } 
            />
            <Route path="/shipper-intake" element={<ShipperIntake />} />
            <Route 
              path="/portal" 
              element={
                <ProtectedRoute allowedRoles={['3pl_partner']}>
                  <ClientPortal />
                </ProtectedRoute>
              } 
            />
            <Route path="*" element={<Navigate to="/dashboard" />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
      <Toaster position="top-right" />
    </AuthProvider>
  );
}

export default App;