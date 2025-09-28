import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const AdminNavigation = () => {
  const { user } = useAuth();
  const location = useLocation();

  if (!user || (user.role !== 'ADMIN' && user.role !== 'SUPER_ADMIN')) {
    return null;
  }

  const navItems = [
    { path: '/tickets', label: 'Tickets' },
    { path: '/cancelled-tickets', label: 'Cancelled Tickets' },
    { path: '/merge-center', label: 'Merge Center' },
    { path: '/reports', label: 'Reports' },
    { path: '/templates', label: 'Templates' },
    { path: '/activity-logs', label: 'Activity Logs' },
    { path: '/system-status', label: 'System Status' },
  ];

  return (
    <div className="border-t border-gray-200 px-4 sm:px-6 lg:px-8 py-4">
      <nav className="flex space-x-8">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`font-medium ${
              location.pathname === item.path
                ? 'text-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </div>
  );
};

export default AdminNavigation;
