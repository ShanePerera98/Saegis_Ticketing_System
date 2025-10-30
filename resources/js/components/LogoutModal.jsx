import React from 'react';

const LogoutModal = ({ isOpen, onConfirm, onCancel }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Are You Sure?
        </h3>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          Do you want to logout from the system?
        </p>
        
        {/* Desktop Layout */}
        <div className="hidden sm:flex justify-between gap-4">
          <button
            onClick={onConfirm}
            className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
          >
            Yes
          </button>
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-700 rounded-lg font-medium transition-colors"
          >
            Cancel
          </button>
        </div>
        
        {/* Mobile Layout */}
        <div className="flex sm:hidden flex-col gap-3">
          <button
            onClick={onConfirm}
            className="w-full px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
          >
            Yes
          </button>
          <button
            onClick={onCancel}
            className="w-full px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-700 rounded-lg font-medium transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default LogoutModal;
