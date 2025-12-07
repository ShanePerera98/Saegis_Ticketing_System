import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../contexts/AuthContext';
import api from '../lib/api';
import TicketAssignmentModal from '../components/TicketAssignmentModal';
import CollaborationNotification from '../components/CollaborationNotification';
// Note: Using console.log instead of react-hot-toast

const TicketAssignmentDemo = () => {
  const { user } = useAuth();
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [showAssignmentModal, setShowAssignmentModal] = useState(false);

  // Fetch tickets
  const { data: tickets = [], isLoading: ticketsLoading } = useQuery({
    queryKey: ['tickets-demo'],
    queryFn: async () => {
      const response = await api.get('/tickets?status=NEW&limit=10');
      return response.data.data || [];
    },
  });

  // Fetch notifications
  const { data: notifications = [], isLoading: notificationsLoading } = useQuery({
    queryKey: ['notifications'],
    queryFn: async () => {
      const response = await api.get('/notifications/unread');
      return response.data.notifications || [];
    },
  });

  const handleAssignTicket = (ticket) => {
    setSelectedTicket(ticket);
    setShowAssignmentModal(true);
  };

  const handleCloseModal = () => {
    setShowAssignmentModal(false);
    setSelectedTicket(null);
  };

  const collaborationNotifications = notifications.filter(
    notification => notification.data?.type === 'collaboration_request'
  );

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Collaborative Ticket Assignment System</h1>
        <p className="text-gray-600 mt-2">
          Search and assign tickets to staff members with collaborative workflow
        </p>
      </div>

      {/* User Role Information */}
      <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h3 className="text-lg font-medium text-blue-900 mb-2">Your Role & Capabilities</h3>
        <div className="text-sm text-blue-800">
          <p><strong>Role:</strong> {user?.role === 'super_admin' ? 'Super Admin' : 'Admin'}</p>
          {user?.role === 'super_admin' ? (
            <div className="mt-2">
              <p><strong>✅ Direct Assignment:</strong> You can directly assign tickets to any staff member</p>
              <p><strong>✅ Collaboration Requests:</strong> You can request collaboration on your assigned tickets</p>
            </div>
          ) : (
            <div className="mt-2">
              <p><strong>❌ Direct Assignment:</strong> Only Super Admins can directly assign tickets</p>
              <p><strong>✅ Collaboration Requests:</strong> You can request collaboration on your assigned tickets</p>
            </div>
          )}
        </div>
      </div>

      {/* Collaboration Notifications */}
      {collaborationNotifications.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Pending Collaboration Requests ({collaborationNotifications.length})
          </h2>
          <div className="space-y-4">
            {collaborationNotifications.map((notification) => (
              <CollaborationNotification
                key={notification.id}
                notification={notification}
                onAction={(action) => {
                  console.log(`Collaboration ${action}ed successfully`);
                }}
              />
            ))}
          </div>
        </div>
      )}

      {/* Tickets List */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Available Tickets for Assignment</h2>
        
        {ticketsLoading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : tickets.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No tickets available for assignment
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {tickets.map((ticket) => (
              <div key={ticket.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="font-medium text-gray-900 truncate">
                    #{ticket.ticket_number}
                  </h3>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    ticket.status === 'NEW' ? 'bg-blue-100 text-blue-800' :
                    ticket.status === 'ACQUIRED' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {ticket.status}
                  </span>
                </div>
                
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                  {ticket.subject || 'No subject'}
                </p>
                
                <div className="text-xs text-gray-500 mb-3 space-y-1">
                  <p><strong>Client:</strong> {ticket.client?.name || 'Unknown'}</p>
                  <p><strong>Category:</strong> {ticket.category?.name || 'Uncategorized'}</p>
                  <p><strong>Priority:</strong> {ticket.priority || 'MEDIUM'}</p>
                  {ticket.current_assignee && (
                    <p><strong>Assigned to:</strong> {ticket.current_assignee.name}</p>
                  )}
                </div>
                
                <button
                  onClick={() => handleAssignTicket(ticket)}
                  className="w-full px-3 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  {user?.role === 'super_admin' ? 'Assign Ticket' : 'Request Collaboration'}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Assignment Modal */}
      <TicketAssignmentModal
        ticket={selectedTicket}
        isOpen={showAssignmentModal}
        onClose={handleCloseModal}
      />

      {/* Help Section */}
      <div className="mt-12 p-6 bg-gray-50 border border-gray-200 rounded-lg">
        <h3 className="text-lg font-medium text-gray-900 mb-3">How the System Works</h3>
        <div className="space-y-3 text-sm text-gray-700">
          <div>
            <strong>Super Admin Assignment:</strong>
            <p>Super Admins can directly assign any ticket to any staff member. The assigned staff receives a notification and the ticket status changes to "ACQUIRED".</p>
          </div>
          <div>
            <strong>Admin Collaboration:</strong>
            <p>Admins who are assigned to a ticket can request collaboration from other staff members. The requested staff can accept or decline the collaboration.</p>
          </div>
          <div>
            <strong>Search Functionality:</strong>
            <p>Staff members can be searched by name or email. The search is real-time and shows active staff members with their roles.</p>
          </div>
          <div>
            <strong>Notifications:</strong>
            <p>All assignment and collaboration activities generate notifications to keep everyone informed about ticket changes.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TicketAssignmentDemo;
