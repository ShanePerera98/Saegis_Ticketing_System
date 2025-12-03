import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import UserAvatar from './UserAvatar';

const TicketCard = ({ ticket, onAction }) => {
  const { user } = useAuth();
  const [timer, setTimer] = useState('00:00:01');
  const [showActions, setShowActions] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedAssignee, setSelectedAssignee] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('');
  const [inputValue, setInputValue] = useState('');
  const [searchCollaborator, setSearchCollaborator] = useState('');
  const [availableCollaborators, setAvailableCollaborators] = useState([]);
  const [showCollaboratorSearch, setShowCollaboratorSearch] = useState(false);
  const [showDetailedView, setShowDetailedView] = useState(false);

  // Get priority class for gradient border
  const getPriorityClass = (priority) => {
    switch(priority?.toUpperCase()) {
      case 'CRITICAL':
        return 'priority-critical';
      case 'HIGH':
        return 'priority-high';
      case 'MEDIUM':
        return 'priority-medium';
      case 'LOW':
        return 'priority-low';
      default:
        return '';
    }
  };

  // Get priority badge styling
  const getPriorityBadge = (priority) => {
    const baseBadge = "px-2 py-1 rounded-full text-xs font-medium";
    switch(priority?.toUpperCase()) {
      case 'CRITICAL':
        return `${baseBadge} bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200`;
      case 'HIGH':
        return `${baseBadge} bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200`;
      case 'MEDIUM':
        return `${baseBadge} bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200`;
      case 'LOW':
        return `${baseBadge} bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200`;
      default:
        return `${baseBadge} bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200`;
    }
  };

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
      // Admins and Super Admins toggle action options
      setShowActions(!showActions);
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

  // Get available actions based on ticket status and user role
  const getAvailableActions = () => {
    const status = ticket.status?.toUpperCase();
    const isClient = user?.role === 'CLIENT';
    const isAssignee = ticket.current_assignee_id === user?.id;

    if (isClient) {
      // Client actions based on status
      switch (status) {
        case 'NEW':
        case 'ACQUIRED':
        case 'IN_PROGRESS':
          return [{ label: 'Delete', action: 'delete', style: 'bg-red-500 hover:bg-red-600' }];
        case 'RESOLVED':
          return [{ label: 'Rate', action: 'rate', style: 'bg-blue-500 hover:bg-blue-600' }];
        default:
          return [];
      }
    }

    // Admin/Super Admin actions based on status
    switch (status) {
      case 'NEW':
        const newTicketActions = [
          { label: 'Get', action: 'acquire', style: 'bg-green-500 hover:bg-green-600' },
          { label: 'Cancel', action: 'cancel', style: 'bg-red-500 hover:bg-red-600' }
        ];
        
        // Super Admin gets additional Assign button
        if (user?.role === 'SUPER_ADMIN') {
          newTicketActions.push({ label: 'Assign', action: 'assign', style: 'bg-blue-500 hover:bg-blue-600' });
        }
        
        return newTicketActions;
      
      case 'ACQUIRED':
        if (isAssignee) {
          return [
            { label: 'View more info', action: 'viewDetails', style: 'bg-indigo-500 hover:bg-indigo-600' },
            { label: 'In Progress', action: 'progress', style: 'bg-blue-500 hover:bg-blue-600' },
            { label: 'Cancel', action: 'cancel', style: 'bg-red-500 hover:bg-red-600' },
            { label: 'Close', action: 'close', style: 'bg-gray-500 hover:bg-gray-600' }
          ];
        }
        return [];
      
      case 'IN_PROGRESS':
        if (isAssignee) {
          return [
            { label: 'Pause', action: 'pause', style: 'bg-yellow-500 hover:bg-yellow-600' },
            { label: 'Resolve', action: 'resolve', style: 'bg-green-500 hover:bg-green-600' },
            { label: 'Cancel', action: 'cancel', style: 'bg-red-500 hover:bg-red-600' },
            { label: 'Close', action: 'close', style: 'bg-gray-500 hover:bg-gray-600' },
            { label: 'Add Collaborator', action: 'addCollaborator', style: 'bg-purple-500 hover:bg-purple-600' }
          ];
        }
        return [];
      
      case 'PENDING':
        if (isAssignee) {
          return [
            { label: 'Resume', action: 'resume', style: 'bg-blue-500 hover:bg-blue-600' },
            { label: 'Cancel', action: 'cancel', style: 'bg-red-500 hover:bg-red-600' },
            { label: 'Close', action: 'close', style: 'bg-gray-500 hover:bg-gray-600' }
          ];
        }
        return [];
      
      default:
        return [];
    }
  };

  const handleAction = (actionType) => {
    setShowActions(false);
    
    switch (actionType) {
      case 'cancel':
      case 'close':
      case 'pause':
      case 'resolve':
        setModalType(actionType);
        setShowModal(true);
        break;
      case 'addCollaborator':
        setShowCollaboratorSearch(true);
        break;
      case 'assign':
        setShowAssignModal(true);
        break;
      case 'rate':
        setModalType('rate');
        setShowModal(true);
        break;
      case 'viewDetails':
        setShowDetailedView(true);
        break;
      default:
        onAction(actionType, ticket);
    }
  };

  const handleModalConfirm = () => {
    const data = {
      reason: inputValue,
      note: inputValue,
      rating: modalType === 'rate' ? parseInt(inputValue) : undefined,
      feedback: modalType === 'rate' ? document.getElementById('feedback')?.value : undefined
    };
    
    onAction(modalType, ticket, data);
    setShowModal(false);
    setInputValue('');
  };

  const closeModal = () => {
    setShowModal(false);
    setModalType('');
    setInputValue('');
  };

  const confirmAssign = () => {
    if (selectedAssignee) {
      onAction('assign', ticket, { assignee: selectedAssignee });
      setShowAssignModal(false);
      setSelectedAssignee('');
    }
  };

  if (showAssignModal) {
    return (
      <div className={`bg-gray-200 dark:bg-gray-700 p-4 rounded-lg transition-colors ${getPriorityClass(ticket.priority)}`}>
        <div className="mb-4">
          <div className="font-medium text-gray-800 dark:text-gray-200 transition-colors">Issue Type: {ticket.title}</div>
          <div className="text-sm text-gray-600 dark:text-gray-300 mt-1 transition-colors">{ticket.description}</div>
          <div className="flex justify-between items-center text-xs text-gray-500 dark:text-gray-400 mt-2 transition-colors">
            <div className="flex items-center gap-3">
              <span>Location: {ticket.location || 'Not specified'}</span>
              <span>Raised by: Client id</span>
            </div>
            <div className="flex items-center gap-2">
              <span className={getPriorityBadge(ticket.priority)}>
                {ticket.priority || 'MEDIUM'}
              </span>
            </div>
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
    const actions = getAvailableActions();
    
    return (
      <div 
        className={`bg-gray-200 dark:bg-gray-700 p-4 cursor-pointer transition-colors hover:bg-gray-300 dark:hover:bg-gray-600 ${getPriorityClass(ticket.priority)}`}
        onClick={handleCardClick}
        title="Click to hide actions"
        style={{ borderRadius: '9px' }}
      >
        <div className="mb-4">
          <div className="font-medium text-gray-800 dark:text-gray-200 transition-colors">Issue Type: {ticket.title}</div>
          <div className="text-sm text-gray-600 dark:text-gray-300 mt-1 transition-colors">{ticket.description}</div>
          <div className="flex justify-between items-center text-xs text-gray-500 dark:text-gray-400 mt-2 transition-colors">
            <div className="flex items-center gap-3">
              <span>Location: {ticket.location || 'Not specified'}</span>
              <span>Raised by: {ticket.client?.name || 'Client'}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className={getPriorityBadge(ticket.priority)}>
                {ticket.priority || 'MEDIUM'}
              </span>
              <span className="text-xs text-gray-400 dark:text-gray-500">• Click to hide</span>
            </div>
          </div>
        </div>
        
        {/* Dynamic Action Buttons */}
        {actions.length > 0 && (
          <div className="flex flex-wrap gap-2 justify-end" onClick={(e) => e.stopPropagation()}>
            {actions.map((action, index) => (
              <button
                key={index}
                onClick={() => handleAction(action.action)}
                className={`px-3 py-2 text-white text-sm rounded-md transition-colors ${action.style}`}
              >
                {action.label}
              </button>
            ))}
          </div>
        )}

        {/* Add Collaborator Search */}
        {showCollaboratorSearch && (
          <div className="mt-4 p-3 bg-white dark:bg-gray-600 rounded-md border" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center gap-2 mb-3">
              <input
                type="text"
                placeholder="Search admin/super admin..."
                value={searchCollaborator}
                onChange={(e) => setSearchCollaborator(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-500 rounded-md text-sm"
              />
              <button
                onClick={() => {
                  // TODO: Add collaborator logic
                  setShowCollaboratorSearch(false);
                  setSearchCollaborator('');
                }}
                disabled={!searchCollaborator.trim()}
                className="px-3 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50 text-sm"
              >
                Add
              </button>
              <button
                onClick={() => {
                  setShowCollaboratorSearch(false);
                  setSearchCollaborator('');
                }}
                className="px-3 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 text-sm"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div 
      className={`bg-gray-200 dark:bg-gray-700 p-4 cursor-pointer hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-200 ${getPriorityClass(ticket.priority)}`}
      onClick={handleCardClick}
      title="Click to show actions"
      style={{ borderRadius: '9px' }}
    >
      <div className="flex justify-between items-start mb-2">
        <div className="font-medium text-gray-800 dark:text-gray-200 transition-colors">Issue Type: {ticket.title}</div>
        <div className="text-sm text-gray-600 dark:text-gray-300 transition-colors">{timer}</div>
      </div>
      
      <div className="text-sm text-gray-600 dark:text-gray-300 mb-3 transition-colors">
        {ticket.description}
      </div>
      
      <div className="flex justify-between items-center text-xs text-gray-500 dark:text-gray-400 transition-colors">
        <div className="flex items-center gap-3">
          <span>Location: {ticket.location || 'Not specified'}</span>
          <div className="flex items-center gap-1">
            <span>Raised by:</span>
            <UserAvatar user={ticket.client} size="xs" />
            <span>{ticket.client?.name || 'Client'}</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className={getPriorityBadge(ticket.priority)}>
            {ticket.priority || 'MEDIUM'}
          </span>
          {(user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN') && (
            <span className="text-xs text-gray-400 dark:text-gray-500">• Click for actions</span>
          )}
        </div>
      </div>

      {/* Modal for input dialogs */}
      {showModal && (
        <div className="fixed inset-0 blur-overlay flex items-center justify-center z-50" onClick={closeModal}>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg w-96 max-w-full mx-4" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">
              {modalType === 'cancel' && 'Cancel Ticket'}
              {modalType === 'close' && 'Close Ticket'}
              {modalType === 'pause' && 'Pause Ticket'}
              {modalType === 'resolve' && 'Resolve Ticket'}
              {modalType === 'rate' && 'Rate Ticket'}
            </h3>

            {modalType === 'rate' ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Rating (1-5 stars)
                  </label>
                  <select
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select rating...</option>
                    <option value="1">1 Star - Poor</option>
                    <option value="2">2 Stars - Fair</option>
                    <option value="3">3 Stars - Good</option>
                    <option value="4">4 Stars - Very Good</option>
                    <option value="5">5 Stars - Excellent</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Feedback (optional)
                  </label>
                  <textarea
                    id="feedback"
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Share your experience..."
                  />
                </div>
              </div>
            ) : (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {modalType === 'cancel' && 'Reason for cancellation (required)'}
                  {modalType === 'close' && 'Reason for closing (required)'}
                  {modalType === 'pause' && 'Reason for pausing (optional)'}
                  {modalType === 'resolve' && 'Resolution notes (optional)'}
                </label>
                <textarea
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  rows={3}
                  maxLength={200}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder={`Enter ${modalType} details...`}
                />
                <div className="text-right text-xs text-gray-500 mt-1">
                  {inputValue.length}/200
                </div>
              </div>
            )}

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={closeModal}
                className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleModalConfirm}
                disabled={
                  (modalType === 'cancel' || modalType === 'close') && !inputValue.trim() ||
                  modalType === 'rate' && !inputValue
                }
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Detailed View Modal */}
      {showDetailedView && (
        <div className="fixed inset-0 blur-overlay flex items-center justify-center z-50" onClick={() => setShowDetailedView(false)}>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                Ticket Details - #{ticket.ticket_number}
              </h3>
              <button
                onClick={() => setShowDetailedView(false)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left Column - Basic Info */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Issue Type</label>
                  <p className="text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-gray-700 p-3 rounded-md">{ticket.title}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
                  <div className="text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-gray-700 p-3 rounded-md whitespace-pre-wrap">
                    {ticket.description}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Priority</label>
                    <span className={`inline-block ${getPriorityBadge(ticket.priority)} px-3 py-2 rounded-md`}>
                      {ticket.priority || 'MEDIUM'}
                    </span>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Status</label>
                    <span className="inline-block bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 px-3 py-2 rounded-md text-sm font-medium">
                      {ticket.status}
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Location</label>
                  <p className="text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-gray-700 p-3 rounded-md">
                    {ticket.location || 'Not specified'}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Raised by</label>
                  <div className="flex items-center gap-3 bg-gray-50 dark:bg-gray-700 p-3 rounded-md">
                    <UserAvatar user={ticket.client} size="sm" />
                    <div className="text-gray-900 dark:text-gray-100">
                      <div className="font-medium">{ticket.client?.name || 'Client'}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">{ticket.client?.email || 'No email'}</div>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Created At</label>
                  <p className="text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-gray-700 p-3 rounded-md">
                    {new Date(ticket.created_at).toLocaleString()}
                  </p>
                </div>
              </div>

              {/* Right Column - Attachments and Additional Info */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Attachments</label>
                  <div className="space-y-3">
                    {ticket.attachments && ticket.attachments.length > 0 ? (
                      ticket.attachments.map((attachment, index) => (
                        <div key={index} className="border border-gray-300 dark:border-gray-600 rounded-md p-3">
                          {attachment.file_type?.startsWith('image/') ? (
                            <div>
                              <img
                                src={attachment.file_path}
                                alt={attachment.file_name}
                                className="w-full max-w-md mx-auto rounded-md shadow-sm"
                                style={{ maxHeight: '300px', objectFit: 'contain' }}
                              />
                              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 text-center">
                                {attachment.file_name}
                              </p>
                            </div>
                          ) : (
                            <div className="flex items-center space-x-3">
                              <div className="flex-shrink-0">
                                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                              </div>
                              <div>
                                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                  {attachment.file_name}
                                </p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                  {attachment.file_type}
                                </p>
                              </div>
                              <a
                                href={attachment.file_path}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
                              >
                                Download
                              </a>
                            </div>
                          )}
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8 text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-700 rounded-md">
                        <svg className="w-12 h-12 mx-auto mb-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                        </svg>
                        <p>No attachments uploaded</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Category Info */}
                {ticket.category && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Category</label>
                    <p className="text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-gray-700 p-3 rounded-md">
                      {ticket.category.name}
                    </p>
                  </div>
                )}

                {/* Current Assignee */}
                {ticket.current_assignee && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Assigned To</label>
                    <p className="text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-gray-700 p-3 rounded-md">
                      {ticket.current_assignee.name} ({ticket.current_assignee.role})
                    </p>
                  </div>
                )}

                {/* Timer Display */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Time Elapsed</label>
                  <p className="text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-gray-700 p-3 rounded-md font-mono text-lg">
                    {timer}
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons at Bottom */}
            <div className="flex justify-end space-x-3 mt-6 pt-6 border-t border-gray-200 dark:border-gray-600">
              <button
                onClick={() => setShowDetailedView(false)}
                className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
              >
                Close
              </button>
              <button
                onClick={() => {
                  setShowDetailedView(false);
                  handleAction('progress');
                }}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
              >
                Set In Progress
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TicketCard;
