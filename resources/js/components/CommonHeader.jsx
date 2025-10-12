import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const CommonHeader = ({ onMenuToggle, isMenuOpen }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [notifications, setNotifications] = useState([]); // Track notifications
  const [hasUnreadNotifications, setHasUnreadNotifications] = useState(false);

  // Initialize dark mode from localStorage or system preference
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'dark' || (!savedTheme && systemPrefersDark)) {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
      document.body.classList.add('dark');
    } else {
      setIsDarkMode(false);
      document.documentElement.classList.remove('dark');
      document.body.classList.remove('dark');
    }
  }, []);

  // Simulate fetching notifications (replace with actual API call)
  useEffect(() => {
    // For now, we'll assume no notifications
    // You can replace this with actual notification fetching logic
    const fetchNotifications = () => {
      // Example: const response = await notificationApi.getUnread();
      // setNotifications(response.data);
      // setHasUnreadNotifications(response.data.length > 0);
      
      // For now, set to false (no notifications)
      setNotifications([]);
      setHasUnreadNotifications(false);
    };

    fetchNotifications();
  }, []);

  const toggleDarkMode = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    
    if (newMode) {
      document.documentElement.classList.add('dark');
      document.body.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.body.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  const toggleProfileDropdown = () => {
    setShowProfileDropdown(!showProfileDropdown);
  };

  const handleNotificationClick = () => {
    // Handle notification click - could open a dropdown or navigate to notifications page
    console.log('Notifications clicked');
    // For testing: toggle notification state
    // setHasUnreadNotifications(!hasUnreadNotifications);
  };

  // Navigation handler for the title
  const handleTitleClick = () => {
    const role = user?.role;
    
    if (role === 'CLIENT') {
      navigate('/client/tickets');
    } else if (role === 'ADMIN' || role === 'SUPER_ADMIN') {
      navigate('/dashboard');
    } else {
      // Fallback navigation
      navigate('/');
    }
  };

  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 transition-colors duration-200">
      <div className="flex items-center justify-between px-6 py-4">
        {/* Left Section */}
        <div className="flex items-center space-x-4">
          {/* Hamburger Menu */}
          <button 
            onClick={onMenuToggle}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
          >
            <div className="w-6 h-6 flex flex-col justify-center space-y-1">
              <div className="w-full h-0.5 bg-gray-600 dark:bg-gray-300 transition-colors"></div>
              <div className="w-full h-0.5 bg-gray-600 dark:bg-gray-300 transition-colors"></div>
              <div className="w-full h-0.5 bg-gray-600 dark:bg-gray-300 transition-colors"></div>
            </div>
          </button>
          
          {/* Company Logo and Name */}
          <div className="flex items-center space-x-2">
            <img 
              src="/logo.svg" 
              alt="Saegis Logo" 
              className="w-8 h-8"
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
            <span className="text-xl font-semibold text-gray-800 dark:text-gray-200 transition-colors">Saegis Campus</span>
          </div>
        </div>
        
        {/* Center Section - App Name */}
        <div 
          className="bg-gray-200 dark:bg-gray-600 px-6 py-2 rounded-full transition-colors cursor-pointer hover:bg-gray-300 dark:hover:bg-gray-500"
          onClick={handleTitleClick}
          title="Go to Home"
        >
          <h1 className="text-lg font-medium text-gray-700 dark:text-gray-200 transition-colors">Saegis Help Desk</h1>
        </div>
        
        {/* Right Section - Icons */}
        <div className="flex items-center space-x-4">
          {/* Dark/Light Mode Toggle */}
          <button 
            onClick={toggleDarkMode}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200 transform hover:scale-110"
            title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            {isDarkMode ? (
              // Premium Sun Icon for Light Mode
              <svg className="w-6 h-6 text-yellow-500" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM18.894 6.166a.75.75 0 00-1.06-1.06l-1.591 1.59a.75.75 0 101.06 1.061l1.591-1.59zM21.75 12a.75.75 0 01-.75.75h-2.25a.75.75 0 010-1.5H21a.75.75 0 01.75.75zM17.834 18.894a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 10-1.061 1.06l1.59 1.591zM12 18a.75.75 0 01.75.75V21a.75.75 0 01-1.5 0v-2.25A.75.75 0 0112 18zM7.758 17.303a.75.75 0 00-1.061-1.06l-1.591 1.59a.75.75 0 001.06 1.061l1.591-1.59zM6 12a.75.75 0 01-.75.75H3a.75.75 0 010-1.5h2.25A.75.75 0 016 12zM6.697 7.757a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 00-1.061 1.06l1.59 1.591z" />
              </svg>
            ) : (
              // Premium Moon Crescent Icon for Dark Mode
              <svg className="w-6 h-6 text-slate-600 dark:text-slate-300" fill="currentColor" viewBox="0 0 24 24">
                <path fillRule="evenodd" d="M9.528 1.718a.75.75 0 01.162.819A8.97 8.97 0 009 6a9 9 0 009 9 8.97 8.97 0 003.463-.69.75.75 0 01.981.98 10.503 10.503 0 01-9.694 6.46c-5.799 0-10.5-4.701-10.5-10.5 0-4.368 2.667-8.112 6.46-9.694a.75.75 0 01.818.162z" clipRule="evenodd" />
              </svg>
            )}
          </button>
          
          {/* Notifications */}
          <button 
            onClick={handleNotificationClick}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 relative transition-colors"
            title="Notifications"
          >
            <svg className="w-6 h-6 text-gray-600 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-3.405-3.405A2.032 2.032 0 0116 12.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C5.67 6.165 4 8.388 4 11v1.159c0 .538-.214 1.055-.595 1.436L0 17h5m10 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            {/* Notification badge - only show when there are unread notifications */}
            {hasUnreadNotifications && (
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white dark:border-gray-800"></span>
            )}
          </button>
          
          {/* Profile Icon with Dropdown */}
          <div className="relative">
            <button 
              onClick={toggleProfileDropdown}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors" 
              title="Profile Menu"
            >
              <svg className="w-6 h-6 text-gray-600 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </button>
            
            {/* User info and logout dropdown */}
            {showProfileDropdown && (
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-600 z-50 transition-colors">
                <div className="py-2 px-4 border-b border-gray-200 dark:border-gray-600">
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{user?.name}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 uppercase">{user?.role}</p>
                </div>
                <button
                  onClick={() => {
                    logout();
                    setShowProfileDropdown(false);
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Overlay to close dropdown when clicking outside */}
      {showProfileDropdown && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setShowProfileDropdown(false)}
        ></div>
      )}
    </header>
  );
};

export default CommonHeader;
