import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

const TicketCard = ({ ticket, onAction }) => {
  const { user } = useAuth();
  const [timer, setTimer] = useState('00:00:01');
  const [showActions, setShowActions] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedAssignee, setSelectedAssignee] = useState('');

  // Timer logic - starts from ticket creation and counts up
  useEffect(() => {
    const startTime = new Date(ticket.created_at);
    
    const updateTimer = () => {
      const now = new Date();
      const diff = now - startTime;
      
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      
      setTimer(
        `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
      );
    };

    // Update timer every second only if ticket is not resolved
    const interval = ticket.status !== 'RESOLVED' ? setInterval(updateTimer, 1000) : null;
    updateTimer(); // Initial call

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [ticket.created_at, ticket.status]);

  const handleCardClick = () => {
    if (user?.role === 'CLIENT') {
      // Clients just view details
      onAction('view', ticket);
    } else {
      // Admins and Super Admins see action options
      setShowActions(true);
    }
  };

  const handleGet = () => {
    onAction('get', ticket);
    setShowActions(false);
  };

  const handleCancel = () => {
    onAction('cancel', ticket);
    setShowActions(false);
  };

  const handleAssign = () => {
    setShowAssignModal(true);
    setShowActions(false);
  };

  const confirmAssign = () => {
    if (selectedAssignee) {
      onAction('assign', ticket, selectedAssignee);
      setShowAssignModal(false);
      setSelectedAssignee('');
    }
  };

  if (showAssignModal) {
    return (
      <div className="bg-gray-200 dark:bg-gray-700 p-4 rounded-lg transition-colors">
        <div className="mb-4">
          <div className="font-medium text-gray-800 dark:text-gray-200 transition-colors">Issue Type: {ticket.title}</div>
          <div className="text-sm text-gray-600 dark:text-gray-300 mt-1 transition-colors">{ticket.description}</div>
          <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-2 transition-colors">
            <span>Location: {ticket.location || 'Not specified'}</span>
            <span>Raised by: Client id</span>
            <span>Priority: {ticket.priority}</span>
          </div>
        </div>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 transition-colors">
            Select: Staff
          </label>
          <select
            value={selectedAssignee}
            onChange={(e) => setSelectedAssignee(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
          >
            <option value="">Choose staff member...</option>
            <option value="admin1">Admin User 1</option>
            <option value="admin2">Admin User 2</option>
            <option value="superadmin1">Super Admin 1</option>
          </select>
        </div>
        
        <div className="flex justify-end space-x-2">
          <button
            onClick={() => setShowAssignModal(false)}
            className="px-4 py-2 bg-orange-500 dark:bg-orange-600 text-white rounded-md hover:bg-orange-600 dark:hover:bg-orange-700 transition-colors"
          >
            Back
          </button>
          <button
            onClick={confirmAssign}
            disabled={!selectedAssignee}
            className="px-4 py-2 bg-green-500 dark:bg-green-600 text-white rounded-md hover:bg-green-600 dark:hover:bg-green-700 disabled:opacity-50 transition-colors"
          >
            Confirm
          </button>
        </div>
      </div>
    );
  }

  if (showActions) {
    return (
      <div className="bg-gray-200 dark:bg-gray-700 p-4 rounded-lg transition-colors">
        <div className="mb-4">
          <div className="font-medium text-gray-800 dark:text-gray-200 transition-colors">Issue Type: {ticket.title}</div>
          <div className="text-sm text-gray-600 dark:text-gray-300 mt-1 transition-colors">{ticket.description}</div>
          <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-2 transition-colors">
            <span>Location: {ticket.location || 'Not specified'}</span>
            <span>Raised by: Client id</span>
            <span>Priority: {ticket.priority}</span>
          </div>
        </div>
        
        <div className="flex justify-end space-x-2">
          <button
            onClick={handleGet}
            className="px-4 py-2 bg-green-500 dark:bg-green-600 text-white rounded-md hover:bg-green-600 dark:hover:bg-green-700 transition-colors"
          >
            Get
          </button>
          <button
            onClick={handleCancel}
            className="px-4 py-2 bg-orange-500 dark:bg-orange-600 text-white rounded-md hover:bg-orange-600 dark:hover:bg-orange-700 transition-colors"
          >
            Cancel
          </button>
          {user?.role === 'SUPER_ADMIN' && (
            <button
              onClick={handleAssign}
              className="px-4 py-2 bg-blue-500 dark:bg-blue-600 text-white rounded-md hover:bg-blue-600 dark:hover:bg-blue-700 transition-colors"
            >
              Assign
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div 
      className="bg-gray-200 dark:bg-gray-700 p-4 rounded-lg cursor-pointer hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-200"
      onClick={handleCardClick}
    >
      <div className="flex justify-between items-start mb-2">
        <div className="font-medium text-gray-800 dark:text-gray-200 transition-colors">Issue Type: {ticket.title}</div>
        <div className="text-sm text-gray-600 dark:text-gray-300 transition-colors">{timer}</div>
      </div>
      
      <div className="text-sm text-gray-600 dark:text-gray-300 mb-3 transition-colors">
        {ticket.description}
      </div>
      
      <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 transition-colors">
        <span>Location: {ticket.location || 'Not specified'}</span>
        <span>Raised by: Client id</span>
        <span>Priority: {ticket.priority}</span>
      </div>
    </div>
  );
};

export default TicketCard;
