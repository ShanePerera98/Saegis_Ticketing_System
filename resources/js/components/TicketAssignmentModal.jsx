import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../contexts/AuthContext';
import api from '../lib/api';
import StaffSearchInput from './StaffSearchInput';
// Note: Using existing Toast component instead of react-hot-toast

const TicketAssignmentModal = ({ ticket, isOpen, onClose }) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [assignmentNote, setAssignmentNote] = useState('');
  const [collaborationMessage, setCollaborationMessage] = useState('');
  const [isAssigning, setIsAssigning] = useState(false);

  // Determine available actions based on user role and ticket status
  const canDirectAssign = user?.role === 'super_admin';
  const canRequestCollaboration = ticket?.current_assignee_id === user?.id;
  const isTicketAssigned = ticket?.current_assignee_id && ticket?.status === 'ACQUIRED';

  // Direct assignment mutation (Super Admin only)
  const assignMutation = useMutation({
    mutationFn: async ({ staffId, note }) => {
      const response = await api.post(`/tickets/${ticket.id}/assign-staff`, {
        staff_id: staffId,
        note
      });
      return response.data;
    },
    onSuccess: (data) => {
      console.log(data.message);
      queryClient.invalidateQueries(['tickets']);
      queryClient.invalidateQueries(['ticket', ticket.id]);
      queryClient.invalidateQueries(['ticket-stats']);
      onClose();
      resetForm();
    },
    onError: (error) => {
      console.error(error.response?.data?.message || 'Failed to assign ticket');
    }
  });

  // Collaboration request mutation (Admin only)
  const collaborationMutation = useMutation({
    mutationFn: async ({ staffId, message }) => {
      const response = await api.post(`/tickets/${ticket.id}/request-collaboration`, {
        staff_id: staffId,
        message
      });
      return response.data;
    },
    onSuccess: (data) => {
      console.log(data.message);
      queryClient.invalidateQueries(['tickets']);
      queryClient.invalidateQueries(['ticket', ticket.id]);
      onClose();
      resetForm();
    },
    onError: (error) => {
      console.error(error.response?.data?.message || 'Failed to send collaboration request');
    }
  });

  const resetForm = () => {
    setSelectedStaff(null);
    setAssignmentNote('');
    setCollaborationMessage('');
    setIsAssigning(false);
  };

  const handleDirectAssign = () => {
    if (!selectedStaff) {
      console.error('Please select a staff member');
      return;
    }
    
    setIsAssigning(true);
    assignMutation.mutate({
      staffId: selectedStaff.id,
      note: assignmentNote
    });
  };

  const handleRequestCollaboration = () => {
    if (!selectedStaff) {
      console.error('Please select a staff member');
      return;
    }
    
    setIsAssigning(true);
    collaborationMutation.mutate({
      staffId: selectedStaff.id,
      message: collaborationMessage
    });
  };

  const handleClose = () => {
    if (!isAssigning) {
      resetForm();
      onClose();
    }
  };

  if (!isOpen || !ticket) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div className="mt-3">
          {/* Header */}
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-900">
              {canDirectAssign ? 'Assign Ticket' : 'Request Collaboration'}
            </h3>
            <button
              onClick={handleClose}
              disabled={isAssigning}
              className="text-gray-400 hover:text-gray-600 disabled:opacity-50"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Ticket Info */}
          <div className="mb-4 p-3 bg-gray-50 rounded-md">
            <div className="text-sm font-medium text-gray-900">
              Ticket #{ticket.ticket_number}
            </div>
            <div className="text-sm text-gray-600 truncate">
              {ticket.subject}
            </div>
            <div className="text-xs text-gray-500 mt-1">
              Status: <span className="font-medium">{ticket.status}</span>
              {ticket.current_assignee && (
                <span className="ml-2">
                  Assigned to: <span className="font-medium">{ticket.current_assignee.name}</span>
                </span>
              )}
            </div>
          </div>

          {/* Staff Search */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {canDirectAssign ? 'Assign to Staff Member' : 'Request Collaboration From'}
            </label>
            <StaffSearchInput
              onSelect={setSelectedStaff}
              placeholder="Search staff by name or email..."
              selectedStaff={selectedStaff}
              disabled={isAssigning}
            />
            
            {selectedStaff && (
              <div className="mt-2 p-2 bg-blue-50 border border-blue-200 rounded-md">
                <div className="text-sm font-medium text-blue-900">
                  Selected: {selectedStaff.name}
                </div>
                <div className="text-xs text-blue-700">
                  {selectedStaff.email} • {selectedStaff.role === 'super_admin' ? 'Super Admin' : 'Admin'}
                </div>
              </div>
            )}
          </div>

          {/* Note/Message Input */}
          {canDirectAssign ? (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Assignment Note (Optional)
              </label>
              <textarea
                value={assignmentNote}
                onChange={(e) => setAssignmentNote(e.target.value)}
                placeholder="Add any notes about this assignment..."
                disabled={isAssigning}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                rows="3"
                maxLength="500"
              />
              <div className="text-xs text-gray-500 text-right mt-1">
                {assignmentNote.length}/500
              </div>
            </div>
          ) : (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Collaboration Message (Optional)
              </label>
              <textarea
                value={collaborationMessage}
                onChange={(e) => setCollaborationMessage(e.target.value)}
                placeholder="Explain why you need collaboration on this ticket..."
                disabled={isAssigning}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                rows="3"
                maxLength="500"
              />
              <div className="text-xs text-gray-500 text-right mt-1">
                {collaborationMessage.length}/500
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex space-x-3 pt-4">
            <button
              onClick={handleClose}
              disabled={isAssigning}
              className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md shadow-sm hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            
            {canDirectAssign ? (
              <button
                onClick={handleDirectAssign}
                disabled={!selectedStaff || isAssigning}
                className="flex-1 px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {isAssigning ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Assigning...
                  </>
                ) : (
                  'Assign Ticket'
                )}
              </button>
            ) : (
              <button
                onClick={handleRequestCollaboration}
                disabled={!selectedStaff || isAssigning || !canRequestCollaboration}
                className="flex-1 px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {isAssigning ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Sending...
                  </>
                ) : (
                  'Request Collaboration'
                )}
              </button>
            )}
          </div>

          {/* Help Text */}
          <div className="mt-3 text-xs text-gray-500">
            {canDirectAssign ? (
              'As a Super Admin, you can directly assign this ticket to any staff member.'
            ) : canRequestCollaboration ? (
              'Send a collaboration request to another staff member to work together on this ticket.'
            ) : (
              'You can only request collaboration on tickets assigned to you.'
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TicketAssignmentModal;
