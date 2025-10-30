import React from 'react';
import { useAuth } from '../contexts/AuthContext';

const Sidebar = ({ selectedStatus, onStatusChange, ticketCounts = {} }) => {
  const { user } = useAuth();

  const getStatusOptions = () => {
    const role = user?.role;
    
    const baseStatuses = role === 'CLIENT' 
      ? [
          'New',
          'Acquired',
          'In Progress', 
          'Pending',
          'Resolved',
          'Canceled',
          'Closed',
          'Deleted'
        ]
      : [
          'New',
          'Acquired',
          'In Progress', 
          'Pending',
          'Resolved',
          'Canceled',
          'Closed',
          'Deleted'
        ];

    return baseStatuses;
  };

  const statusOptions = getStatusOptions();

  const getRoleLabel = () => {
    const role = user?.role;
    if (role === 'CLIENT') return 'Client';
    if (role === 'ADMIN') return 'Admin';
    if (role === 'SUPER_ADMIN') return 'Super Admin';
    return 'User';
  };

  return (
    <aside className="w-64 bg-white dark:bg-gray-800 shadow-sm border-r border-gray-200 dark:border-gray-700 min-h-screen transition-colors duration-200">
      <div className="p-4">
        {/* Role indicator */}
        <div className="text-sm text-gray-500 dark:text-gray-400 mb-4 transition-colors">{getRoleLabel()}</div>
        
        {/* Status buttons */}
        <div className="space-y-1">
          {statusOptions.map((status) => (
            <button
              key={status}
              onClick={() => onStatusChange(status)}
              className={`w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-colors duration-200 flex justify-between items-center ${
                selectedStatus === status
                  ? 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white'
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              <span>{status}</span>
              {ticketCounts[status] && (
                <span className={`text-xs px-2 py-1 rounded-full transition-colors ${
                  selectedStatus === status
                    ? 'bg-gray-300 dark:bg-gray-600 text-gray-800 dark:text-gray-200'
                    : 'bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-300'
                }`}>
                  {ticketCounts[status]}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
