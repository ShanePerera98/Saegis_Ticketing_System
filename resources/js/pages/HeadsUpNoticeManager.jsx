import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import CommonHeader from '../components/CommonHeader';
import HamburgerMenu from '../components/HamburgerMenu';
import Sidebar from '../components/Sidebar';
import Toast from '../components/Toast';

const HeadsUpNoticeManager = () => {
  const { user } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [notice, setNotice] = useState('');
  const [isActive, setIsActive] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success');
  const [isLoading, setIsLoading] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [lastSavedNotice, setLastSavedNotice] = useState('');
  const [lastSavedStatus, setLastSavedStatus] = useState(false);

  useEffect(() => {
    // Load current notice from localStorage (replace with API call)
    const currentNotice = localStorage.getItem('headsUpNotice') || '';
    const currentStatus = localStorage.getItem('headsUpNoticeActive') === 'true';
    setNotice(currentNotice);
    setIsActive(currentStatus);
    setLastSavedNotice(currentNotice);
    setLastSavedStatus(currentStatus);
    setHasUnsavedChanges(false);
  }, []);

  // Track changes to detect unsaved changes
  useEffect(() => {
    const hasChanges = notice !== lastSavedNotice || isActive !== lastSavedStatus;
    setHasUnsavedChanges(hasChanges);
  }, [notice, isActive, lastSavedNotice, lastSavedStatus]);

  const showToastMessage = (message, type = 'success') => {
    setToastMessage(message);
    setToastType(type);
    setShowToast(true);
  };

  const hideToast = () => {
    setShowToast(false);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      // Simulate API call with delay for better UX
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Save to localStorage (replace with API call)
      localStorage.setItem('headsUpNotice', notice);
      localStorage.setItem('headsUpNoticeActive', isActive.toString());
      
      // Update the last saved states
      setLastSavedNotice(notice);
      setLastSavedStatus(isActive);
      setHasUnsavedChanges(false);
      
      showToastMessage('Heads Up Notice is being published successfully', 'success');
    } catch (error) {
      showToastMessage('Failed to publish heads up notice', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = async () => {
    setIsLoading(true);
    try {
      // Simulate API call with delay for better UX
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setNotice('');
      setIsActive(false);
      localStorage.removeItem('headsUpNotice');
      localStorage.removeItem('headsUpNoticeActive');
      
      // Update the last saved states
      setLastSavedNotice('');
      setLastSavedStatus(false);
      setHasUnsavedChanges(false);
      
      showToastMessage('Heads up notice cleared successfully', 'success');
    } catch (error) {
      showToastMessage('Failed to clear heads up notice', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  if (user?.role !== 'SUPER_ADMIN') {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Access Denied</h1>
          <p className="text-gray-600 dark:text-gray-400">You don't have permission to access this page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-200">
      {/* Common Header */}
      <CommonHeader onMenuToggle={toggleMenu} isMenuOpen={isMenuOpen} />
      
      {/* Hamburger Menu */}
      <HamburgerMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />

      <div className="flex">
        {/* Sidebar */}
        <Sidebar />

        {/* Main Content */}
        <div className="flex-1 p-6">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Heads Up Notice Manager
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Manage important notices that appear to all clients on their ticket creation page
              </p>
            </div>

            {/* Notice Form */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6 transition-colors">
              {/* Status Toggle */}
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                    Notice Status
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Toggle to show or hide the notice to all clients
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isActive}
                    onChange={(e) => setIsActive(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                  <span className="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300">
                    {isActive ? 'Active' : 'Inactive'}
                  </span>
                </label>
              </div>

              {/* Notice Content */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Notice Message
                  </label>
                  <span className={`text-sm ${
                    notice.length > 500 
                      ? 'text-red-500' 
                      : notice.length > 400 
                        ? 'text-amber-500' 
                        : 'text-gray-500 dark:text-gray-400'
                  }`}>
                    {notice.length}/500
                  </span>
                </div>
                <textarea
                  value={notice}
                  onChange={(e) => {
                    if (e.target.value.length <= 500) {
                      setNotice(e.target.value);
                    }
                  }}
                  placeholder="Enter your important notice message here... (e.g., 'We're having a power cut. Apologize for the inconvenience.')"
                  rows={4}
                  className={`w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none transition-colors ${
                    notice.length > 500
                      ? 'border-red-300 dark:border-red-600'
                      : 'border-gray-300 dark:border-gray-600'
                  }`}
                />
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                  This message will be displayed prominently on the client ticket creation page.
                </p>
              </div>

              {/* Preview */}
              {notice && (
                <div className="mb-6">
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Preview (How it will appear to clients):
                  </h4>
                  <div className="headsup-notice">
                    <div className="flex items-start gap-3">
                      <svg className="w-6 h-6 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.664-.833-2.464 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z" />
                      </svg>
                      <div className="flex-1">
                        <h3 className="mb-1">Important Notice</h3>
                        <p className="text-sm text-gray-700 dark:text-amber-100 leading-relaxed">
                          {notice}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3">
                {/* Save Button - Only show if there are unsaved changes */}
                {hasUnsavedChanges && (
                  <button
                    onClick={handleSave}
                    disabled={isLoading}
                    className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors flex items-center gap-2"
                  >
                    {isLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                        Publishing...
                      </>
                    ) : (
                      <>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Save Changes
                      </>
                    )}
                  </button>
                )}
                
                {/* Clear Button - Always show if there's content to clear */}
                {(lastSavedNotice || notice) && (
                  <button
                    onClick={handleClear}
                    disabled={isLoading}
                    className="px-6 py-2 bg-red-600 hover:bg-red-700 disabled:bg-red-400 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors flex items-center gap-2"
                  >
                    {isLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                        Clearing...
                      </>
                    ) : (
                      <>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        Clear Notice
                      </>
                    )}
                  </button>
                )}
                
                {/* Success State Message */}
                {!hasUnsavedChanges && (lastSavedNotice || lastSavedStatus) && !isLoading && (
                  <div className="flex items-center gap-2 text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 px-4 py-2 rounded-lg border border-green-200 dark:border-green-800">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-sm font-medium">Notice published successfully</span>
                  </div>
                )}
              </div>
              
              {/* Change Indicator */}
              {hasUnsavedChanges && (
                <div className="mt-4 flex items-center gap-2 text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 px-4 py-2 rounded-lg border border-amber-200 dark:border-amber-800">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.664-.833-2.464 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                  <span className="text-sm font-medium">You have unsaved changes</span>
                </div>
              )}
            </div>

            {/* Usage Guidelines */}
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-3">
                Usage Guidelines
              </h3>
              <ul className="space-y-2 text-sm text-blue-800 dark:text-blue-200">
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 dark:text-blue-400 mt-0.5">•</span>
                  Use this feature for system-wide announcements or urgent notifications
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 dark:text-blue-400 mt-0.5">•</span>
                  The notice will appear above the ticket creation form for all clients
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 dark:text-blue-400 mt-0.5">•</span>
                  Clients can dismiss the notice, but it will reappear on page refresh if still active
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 dark:text-blue-400 mt-0.5">•</span>
                  Keep messages concise and informative for better user experience
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Toast Notifications */}
      {showToast && (
        <Toast
          message={toastMessage}
          type={toastType}
          onClose={hideToast}
          duration={5000}
        />
      )}
    </div>
  );
};

export default HeadsUpNoticeManager;
