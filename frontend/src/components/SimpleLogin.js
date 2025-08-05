import React, { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const SimpleLogin = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    alert('Button clicked!'); // This should show if click handler works
    console.log('🔐 Simple login attempt');
    setLoading(true);
    
    try {
      console.log('Making direct axios call to backend...');
      const response = await axios.post('http://localhost:8001/api/auth/login', {
        email,
        password
      });
      
      console.log('✅ Login successful:', response.data);
      
      const { token, user } = response.data;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      toast.success('Login successful!');
      onLogin(user);
      
    } catch (error) {
      console.error('❌ Login failed:', error);
      toast.error(error.response?.data?.detail || 'Login failed');
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-blue-600 mb-2">GROWE</h1>
          <h2 className="text-xl font-semibold text-gray-900">Simple Login Test</h2>
        </div>
        
        <div className="space-y-4">
          <div>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded"
            />
          </div>
          <div>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded"
            />
          </div>
          <button
            onClick={() => {
              console.log('INLINE CLICK HANDLER WORKS!');
              alert('INLINE CLICK WORKS!');
              handleLogin();
            }}
            disabled={loading}
            className="w-full py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
          
          <div className="text-center text-sm text-gray-600">
            <p>Test: admin@growe.com / admin123</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimpleLogin;