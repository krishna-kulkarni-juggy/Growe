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
  const [tempUser, setTempUser] = useState(null);

  // For testing - bypass AuthContext temporarily
  const currentUser = tempUser || user;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <Router>
        <Routes>
          <Route path="/shipper-intake" element={<ShipperIntake />} />
          <Route path="*" element={<SimpleLogin onLogin={setTempUser} />} />
        </Routes>
      </Router>
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