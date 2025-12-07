import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../lib/api';
// Note: Using console.log instead of react-hot-toast

const CollaborationNotification = ({ notification, onAction }) => {
  const queryClient = useQueryClient();
  const [isResponding, setIsResponding] = useState(false);
  const [responseNote, setResponseNote] = useState('');
  const [showResponseForm, setShowResponseForm] = useState(false);
  const [selectedAction, setSelectedAction] = useState(null);

  // Respond to collaboration mutation
  const respondMutation = useMutation({
    mutationFn: async ({ action, note }) => {
      const ticketId = notification.data.ticket_id;
      const response = await api.post(`/tickets/${ticketId}/respond-collaboration`, {
        action,
        note
      });
      return response.data;
    },
    onSuccess: (data) => {
      console.log(data.message);
      queryClient.invalidateQueries(['notifications']);
      queryClient.invalidateQueries(['tickets']);
      queryClient.invalidateQueries(['ticket', notification.data.ticket_id]);
      onAction?.(selectedAction);
    },
    onError: (error) => {
      console.error(error.response?.data?.message || 'Failed to respond to collaboration request');
      setIsResponding(false);
      setShowResponseForm(false);
    }
  });

  const handleQuickResponse = (action) => {
    setSelectedAction(action);
    setIsResponding(true);
    respondMutation.mutate({ action, note: '' });
  };

  const handleResponseWithNote = (action) => {
    setSelectedAction(action);
    setShowResponseForm(true);
  };

  const submitResponse = () => {
    setIsResponding(true);
    respondMutation.mutate({ 
      action: selectedAction, 
      note: responseNote 
    });
  };

  const cancelResponse = () => {
    setShowResponseForm(false);
    setSelectedAction(null);
    setResponseNote('');
  };

  const data = notification.data;
  const isCollaborationRequest = data.type === 'collaboration_request';

  if (!isCollaborationRequest) {
    return null;
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4 mb-3">
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
              </svg>
            </div>
          </div>
          <div className="ml-3">
            <h4 className="text-sm font-medium text-gray-900">{data.title}</h4>
            <p className="text-sm text-gray-600">{data.message}</p>
          </div>
        </div>
        <span className="text-xs text-gray-400">
          {new Date(notification.created_at).toLocaleDateString()}
        </span>
      </div>

      {/* Ticket Details */}
      <div className="bg-gray-50 rounded-md p-3 mb-3">
        <div className="text-sm font-medium text-gray-900">
          Ticket #{data.ticket_number}
        </div>
        <div className="text-sm text-gray-600 truncate">
          {data.ticket_subject}
        </div>
        <div className="text-xs text-gray-500 mt-1">
          Client: {data.client_name}
        </div>
        <div className="text-xs text-gray-500">
          Requested by: {data.requested_by.name}
        </div>
      </div>

      {/* Custom Message */}
      {data.custom_message && (
        <div className="mb-3 p-2 bg-blue-50 border-l-4 border-blue-200 rounded">
          <p className="text-sm text-gray-700">
            <span className="font-medium">Message:</span> {data.custom_message}
          </p>
        </div>
      )}

      {/* Response Form */}
      {showResponseForm ? (
        <div className="border-t pt-3">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Response Note (Optional)
          </label>
          <textarea
            value={responseNote}
            onChange={(e) => setResponseNote(e.target.value)}
            placeholder="Add a note with your response..."
            disabled={isResponding}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
            rows="2"
            maxLength="500"
          />
          <div className="text-xs text-gray-500 text-right mt-1 mb-3">
            {responseNote.length}/500
          </div>
          
          <div className="flex space-x-2">
            <button
              onClick={submitResponse}
              disabled={isResponding}
              className={`px-4 py-2 text-sm font-medium rounded-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center ${
                selectedAction === 'accept'
                  ? 'text-white bg-green-600 hover:bg-green-700 focus:ring-green-500'
                  : 'text-white bg-red-600 hover:bg-red-700 focus:ring-red-500'
              }`}
            >
              {isResponding ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Processing...
                </>
              ) : (
                selectedAction === 'accept' ? 'Accept' : 'Decline'
              )}
            </button>
            <button
              onClick={cancelResponse}
              disabled={isResponding}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        /* Action Buttons */
        <div className="flex space-x-2 pt-3 border-t">
          <button
            onClick={() => handleQuickResponse('accept')}
            disabled={isResponding}
            className="flex-1 px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {isResponding && selectedAction === 'accept' ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Accepting...
              </>
            ) : (
              'Accept'
            )}
          </button>
          
          <button
            onClick={() => handleQuickResponse('decline')}
            disabled={isResponding}
            className="flex-1 px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {isResponding && selectedAction === 'decline' ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Declining...
              </>
            ) : (
              'Decline'
            )}
          </button>
          
          <div className="relative">
            <button
              onClick={() => setShowResponseForm(true)}
              disabled={isResponding}
              className="px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
              title="Respond with note"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Quick Actions Link */}
      <div className="mt-3 text-center">
        <a
          href={data.url}
          className="text-sm text-blue-600 hover:text-blue-800 font-medium"
        >
          View Ticket Details →
        </a>
      </div>
    </div>
  );
};

export default CollaborationNotification;
