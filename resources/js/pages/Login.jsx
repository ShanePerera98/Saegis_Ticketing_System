import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const user = await login({ email, password });
      
      // Redirect to the SPA tickets entry; SPA will further route based on role
      navigate('/tickets');
    } catch (error) {
      setError(error.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const quickLogin = async (userType) => {
    const credentials = {
      'super-admin': { email: 'super@admin.com', password: 'password' },
      'admin': { email: 'admin@admin.com', password: 'password' },
      'client': { email: 'client@example.com', password: 'password' },
    };

    const creds = credentials[userType];
    if (creds) {
      setEmail(creds.email);
      setPassword(creds.password);
      
      try {
        setLoading(true);
        const user = await login(creds);
        
        // Navigate to /tickets and let the SPA redirect internally
        navigate('/tickets');
      } catch (error) {
        setError(error.response?.data?.message || 'Login failed');
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Help Desk Login
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Sign in to access the ticketing system
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}
          
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Email address"
              />
            </div>
            <div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Password"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </div>
        </form>

        {/* Quick login buttons for demo */}
        <div className="mt-8 space-y-2">
          <p className="text-center text-sm text-gray-600">Quick Login (Demo)</p>
          <div className="flex space-x-2">
            <button
              onClick={() => quickLogin('super-admin')}
              className="flex-1 py-2 px-4 text-xs bg-purple-600 text-white rounded hover:bg-purple-700"
              disabled={loading}
            >
              Super Admin
            </button>
            <button
              onClick={() => quickLogin('admin')}
              className="flex-1 py-2 px-4 text-xs bg-blue-600 text-white rounded hover:bg-blue-700"
              disabled={loading}
            >
              Admin
            </button>
            <button
              onClick={() => quickLogin('client')}
              className="flex-1 py-2 px-4 text-xs bg-green-600 text-white rounded hover:bg-green-700"
              disabled={loading}
            >
              Client
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
