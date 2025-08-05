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

  // Demo user for the prototype
  const currentUser = {
    id: "demo-admin", 
    email: "admin@growe.com",
    role: "admin",
    company_name: "Growe"
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
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
            <Route path="/map" element={<MapView />} />
            <Route path="/crm" element={<CRM />} />
            <Route path="/leases" element={<LeaseAdmin />} />
            <Route path="/shipper-intake" element={<ShipperIntake />} />
            <Route path="/portal" element={<ClientPortal />} />
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