import React, { useState, useEffect } from 'react';

const HeadsUpNotice = () => {
  const [notice, setNotice] = useState('');
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Fetch heads up notice from API (implement when backend is ready)
    const fetchNotice = async () => {
      try {
        // For now, simulate API call
        // const response = await noticeApi.getCurrent();
        // if (response.data && response.data.message) {
        //   setNotice(response.data.message);
        //   setIsVisible(true);
        // }
        
        // Simulate notice for demo
        const demoNotice = localStorage.getItem('headsUpNotice');
        if (demoNotice && demoNotice.trim()) {
          setNotice(demoNotice);
          setIsVisible(true);
        }
      } catch (error) {
        console.error('Failed to fetch heads up notice:', error);
      }
    };

    fetchNotice();
    
    // Poll for updates every 60 seconds
    const interval = setInterval(fetchNotice, 60000);
    return () => clearInterval(interval);
  }, []);

  if (!isVisible || !notice.trim()) {
    return null;
  }

  return (
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
        <button
          onClick={() => setIsVisible(false)}
          className="text-amber-600 dark:text-amber-400 hover:text-amber-800 dark:hover:text-amber-200 p-1 rounded transition-colors"
          title="Dismiss notice"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default HeadsUpNotice;
