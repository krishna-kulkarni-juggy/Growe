import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { AlertTriangle } from 'lucide-react';

const Unauthorized = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full text-center">
        <div className="bg-white shadow-lg rounded-lg p-8">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-red-100 rounded-full">
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
          </div>
          
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>
          
          <p className="text-gray-600 mb-6">
            You don't have permission to access this page. This section is restricted to administrators only.
          </p>
          
          <div className="bg-blue-50 rounded-lg p-4 mb-6">
            <p className="text-sm text-blue-800">
              <strong>Your Role:</strong> {user?.role?.replace('_', ' ') || 'Unknown'}
            </p>
            <p className="text-sm text-blue-700 mt-1">
              Contact your administrator if you believe you should have access to this area.
            </p>
          </div>
          
          <button
            onClick={() => window.history.back()}
            className="btn-primary w-full"
          >
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default Unauthorized;