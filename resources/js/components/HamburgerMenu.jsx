import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const HamburgerMenu = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const navigate = useNavigate();

  if (!isOpen) return null;

  const getMenuItems = () => {
    const role = user?.role;
    
    if (role === 'CLIENT') {
      return [
        { label: 'Basic Troubleshoot', action: () => navigate('/troubleshoot') }
      ];
    } else if (role === 'ADMIN') {
      return [
        { label: 'See Others Queue', action: () => console.log('See Others Queue') },
        { label: 'Duplicate Tickets', action: () => console.log('Duplicate Tickets') },
        { label: 'Configure Ticket Template', action: () => console.log('Configure Ticket Template') },
        { label: 'Manage Users', action: () => navigate('/users') },
        { label: 'My Ticket History', action: () => console.log('My Ticket History') }
      ];
    } else if (role === 'SUPER_ADMIN') {
      return [
        { label: 'See Others Queue', action: () => console.log('See Others Queue') },
        { label: 'Cancelled Tickets', action: () => console.log('Cancelled Tickets') },
        { label: 'Closed Tickets', action: () => console.log('Closed Tickets') },
        { label: 'Duplicate Tickets', action: () => console.log('Duplicate Tickets') },
        { label: 'Configure Ticket Template', action: () => console.log('Configure Ticket Template') },
        { label: 'Heads Up Notice', action: () => navigate('/headsup-notice') },
        { label: 'Manage Users', action: () => navigate('/users') },
        { label: 'My Ticket History', action: () => console.log('My Ticket History') },
        { label: 'Reports & History', action: () => console.log('Reports & History') },
        { label: 'Basic Troubleshoot', action: () => navigate('/troubleshoot') },
        { label: 'Archive', action: () => console.log('Archive') }
      ];
    }
    
    return [];
  };

  const menuItems = getMenuItems();

  return (
    <>
      {/* Overlay - only cover the right side content area */}
      <div 
        className="fixed top-0 right-0 bottom-0 bg-black bg-opacity-30 z-30 transition-all duration-300"
        style={{ left: '320px' }}
        onClick={onClose}
      ></div>
      
      {/* Menu */}
      <div className="fixed left-0 top-0 h-full w-80 bg-gray-100 dark:bg-gray-800 z-40 shadow-lg transition-colors duration-200">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-2">
              <img 
                src="/logo.svg" 
                alt="Saegis Logo" 
                className="w-8 h-8"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
              <span className="text-xl font-semibold text-gray-800 dark:text-gray-200 transition-colors">Saegis</span>
            </div>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-md text-gray-700 dark:text-gray-300 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Role indicator */}
          <div className="mb-6">
            <div className="bg-gray-200 dark:bg-gray-700 px-4 py-2 rounded-lg transition-colors">
              <span className="text-sm text-gray-600 dark:text-gray-300 transition-colors">
                {user?.role === 'CLIENT' ? 'Client' : 
                 user?.role === 'ADMIN' ? 'Admin' : 'Super Admin'}
              </span>
            </div>
          </div>

          {/* Menu Items */}
          <div className="space-y-2">
            {menuItems.map((item, index) => (
              <button
                key={index}
                onClick={() => {
                  item.action();
                  onClose();
                }}
                className="w-full text-left px-4 py-3 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 font-medium transition-colors duration-200"
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default HamburgerMenu;
