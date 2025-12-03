import React from 'react';
import { useAuth } from '../contexts/AuthContext';

const AuthDebug = () => {
  const { user, loading } = useAuth();
  
  const token = localStorage.getItem('token') || sessionStorage.getItem('token');
  const savedUser = localStorage.getItem('user') || sessionStorage.getItem('user');

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Authentication Debug</h1>
      
      <div className="space-y-4">
        <div className="bg-gray-100 p-4 rounded-lg">
          <h2 className="text-lg font-semibold mb-2">Auth Context</h2>
          <p><strong>Loading:</strong> {loading ? 'true' : 'false'}</p>
          <p><strong>User:</strong> {user ? JSON.stringify(user, null, 2) : 'null'}</p>
        </div>
        
        <div className="bg-gray-100 p-4 rounded-lg">
          <h2 className="text-lg font-semibold mb-2">Local Storage</h2>
          <p><strong>Token:</strong> {localStorage.getItem('token') || 'not found'}</p>
          <p><strong>User:</strong> {localStorage.getItem('user') || 'not found'}</p>
        </div>
        
        <div className="bg-gray-100 p-4 rounded-lg">
          <h2 className="text-lg font-semibold mb-2">Session Storage</h2>
          <p><strong>Token:</strong> {sessionStorage.getItem('token') || 'not found'}</p>
          <p><strong>User:</strong> {sessionStorage.getItem('user') || 'not found'}</p>
        </div>
        
        <div className="bg-gray-100 p-4 rounded-lg">
          <h2 className="text-lg font-semibold mb-2">Effective Token</h2>
          <p><strong>Current Token:</strong> {token || 'no token found'}</p>
          <p><strong>Token Length:</strong> {token ? token.length : 0}</p>
        </div>
        
        <div className="bg-gray-100 p-4 rounded-lg">
          <h2 className="text-lg font-semibold mb-2">Parsed User</h2>
          <pre className="text-sm overflow-auto">
            {savedUser ? JSON.stringify(JSON.parse(savedUser), null, 2) : 'no saved user'}
          </pre>
        </div>
        
        <div className="bg-gray-100 p-4 rounded-lg">
          <h2 className="text-lg font-semibold mb-2">Template Access</h2>
          <p><strong>Can Access Templates:</strong> {
            user && (user.role === 'ADMIN' || user.role === 'SUPER_ADMIN') ? 'Yes' : 'No'
          }</p>
          <p><strong>User Role:</strong> {user?.role || 'no role'}</p>
        </div>
      </div>
    </div>
  );
};

export default AuthDebug;
