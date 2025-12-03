import React, { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { ticketApi } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import CommonHeader from '../components/CommonHeader';
import HamburgerMenu from '../components/HamburgerMenu';
import Sidebar from '../components/Sidebar';
import TicketCard from '../components/TicketCard';
import Toast from '../components/Toast';

const Dashboard = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [selectedStatus, setSelectedStatus] = useState('New');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const [showCancelOptions, setShowCancelOptions] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success');

  // Fetch tickets using React Query
  const { data: tickets = [], isLoading, error, refetch } = useQuery({
    queryKey: ['tickets', selectedStatus],
    queryFn: () => {
      const params = { status: selectedStatus === 'New' ? 'NEW' : selectedStatus.toUpperCase() };
      // Don't add 'mine' parameter for admins to see all tickets
      return ticketApi.list(params);
    },
    select: (data) => data.data.data || data.data || [],
    staleTime: 30000, // 30 seconds
    refetchInterval: 60000, // Refetch every minute
  });

  // Fetch ticket statistics
  const { data: stats = {} } = useQuery({
    queryKey: ['ticket-stats'],
    queryFn: () => ticketApi.getStats(),
    select: (data) => data.data || {},
    staleTime: 60000, // 1 minute
  });

  const showToastMessage = (message, type = 'success') => {
    setToastMessage(message);
    setToastType(type);
    setShowToast(true);
  };

  const handleTicketAction = async (action, ticket, data = null) => {
    try {
      switch (action) {
        case 'get':
        case 'acquire':
          await ticketApi.acquire(ticket.id);
          showToastMessage(`Ticket ${ticket.ticket_number} has been acquired`, 'success');
          refetch();
          queryClient.invalidateQueries(['notifications']);
          break;

        case 'progress':
          await ticketApi.setInProgress(ticket.id);
          showToastMessage(`Ticket ${ticket.ticket_number} set to In Progress`, 'success');
          refetch();
          queryClient.invalidateQueries(['notifications']);
          break;

        case 'pause':
          await ticketApi.pause(ticket.id, data?.reason);
          showToastMessage(`Ticket ${ticket.ticket_number} has been paused`, 'success');
          refetch();
          queryClient.invalidateQueries(['notifications']);
          break;

        case 'resume':
          await ticketApi.resume(ticket.id);
          showToastMessage(`Ticket ${ticket.ticket_number} has been resumed`, 'success');
          refetch();
          queryClient.invalidateQueries(['notifications']);
          break;

        case 'resolve':
          await ticketApi.resolve(ticket.id, data?.note);
          showToastMessage(`Ticket ${ticket.ticket_number} has been resolved`, 'success');
          refetch();
          queryClient.invalidateQueries(['notifications']);
          break;

        case 'cancel':
          await ticketApi.cancel(ticket.id, data?.reason, data?.type || 'irrelevant');
          showToastMessage(`Ticket ${ticket.ticket_number} has been cancelled`, 'success');
          refetch();
          queryClient.invalidateQueries(['notifications']);
          break;

        case 'close':
          await ticketApi.close(ticket.id, data?.reason);
          showToastMessage(`Ticket ${ticket.ticket_number} has been closed`, 'success');
          refetch();
          queryClient.invalidateQueries(['notifications']);
          break;

        case 'delete':
          await ticketApi.deleteTicket(ticket.id);
          showToastMessage(`Ticket ${ticket.ticket_number} has been deleted`, 'success');
          refetch();
          queryClient.invalidateQueries(['notifications']);
          break;

        case 'rate':
          await ticketApi.rate(ticket.id, data?.rating, data?.feedback);
          showToastMessage(`Rating submitted for ticket ${ticket.ticket_number}`, 'success');
          refetch();
          queryClient.invalidateQueries(['notifications']);
          break;

        case 'assign':
          if (data?.assignee) {
            await ticketApi.assign(ticket.id, data.assignee);
            showToastMessage(`Ticket ${ticket.ticket_number} has been assigned`, 'success');
            refetch();
            queryClient.invalidateQueries(['notifications']);
          }
          break;

        case 'addCollaborator':
          if (data?.userId) {
            await ticketApi.addCollaborator(ticket.id, data.userId);
            showToastMessage(`Collaboration request sent for ticket ${ticket.ticket_number}`, 'success');
            refetch();
          }
          break;

        case 'view':
        case 'viewDetails':
          // These are handled in the TicketCard component itself
          break;

        default:
          console.log('Unknown action:', action, ticket, data);
      }
    } catch (error) {
      showToastMessage(error.response?.data?.message || 'Action failed', 'error');
    }
  };

  const handleCancelConfirm = async (reason) => {
    try {
      if (reason === 'Irrelevant') {
        await ticketApi.cancelIrrelevant(selectedTicket.id, reason);
        showToastMessage('Ticket moved to canceled queue', 'success');
      } else if (reason === 'Duplicate') {
        showToastMessage('Ticket moved to duplicate merge queue', 'info');
        // TODO: Implement duplicate merge API call
      }
      setShowCancelOptions(false);
      setSelectedTicket(null);
      refetch(); // Refresh the ticket list
    } catch (error) {
      showToastMessage(error.response?.data?.message || 'Failed to cancel ticket', 'error');
    }
  };

  const hideToast = () => {
    setShowToast(false);
  };

  const handleStatusChange = (status) => {
    setSelectedStatus(status);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Calculate ticket counts from stats API or fallback to default values
  const ticketCounts = {
    'New': stats.new || 0,
    'In Progress': stats.in_progress || 0,
    'Pending': stats.pending || 0,
    'Resolved': stats.resolved || 0,
    'Canceled': stats.canceled || 0,
    'Closed': stats.closed || 0,
    'Deleted': stats.deleted || 0,
    'See Others Queue': stats.others_queue || 0
  };

  // Filter tickets based on selected status
  const filteredTickets = tickets || [];

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-200 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading tickets...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-200 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 dark:text-red-400">Error loading tickets: {error.message}</p>
          <button 
            onClick={() => refetch()} 
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Retry
          </button>
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
        <Sidebar 
          selectedStatus={selectedStatus}
          onStatusChange={handleStatusChange}
          ticketCounts={ticketCounts}
        />

        {/* Main Content */}
        <main className="flex-1 p-6 elastic-scroll overflow-y-auto">
          <div className="space-y-4 scroll-shadow">
            {filteredTickets.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 dark:text-gray-400 transition-colors">No tickets found for "{selectedStatus}" status</p>
              </div>
            ) : (
              filteredTickets.map((ticket) => (
                <TicketCard
                  key={ticket.id}
                  ticket={ticket}
                  onAction={handleTicketAction}
                />
              ))
            )}
          </div>
        </main>
      </div>

      {/* Cancel Options Modal */}
      {showCancelOptions && (
        <div className="fixed inset-0 blur-overlay flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg max-w-md w-full mx-4 transition-colors">
            <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white transition-colors">Cancel Ticket</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6 transition-colors">
              Please select a reason for canceling this ticket:
            </p>
            
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <input
                  type="radio"
                  id="irrelevant"
                  name="cancelReason"
                  value="Irrelevant"
                  checked={cancelReason === 'Irrelevant'}
                  onChange={(e) => setCancelReason(e.target.value)}
                  className="w-4 h-4 text-blue-600 dark:text-blue-500"
                />
                <label htmlFor="irrelevant" className="text-gray-700 dark:text-gray-300 transition-colors">Irrelevant</label>
                
                <input
                  type="radio"
                  id="duplicate"
                  name="cancelReason"
                  value="Duplicate"
                  checked={cancelReason === 'Duplicate'}
                  onChange={(e) => setCancelReason(e.target.value)}
                  className="w-4 h-4 text-blue-600 dark:text-blue-500"
                />
                <label htmlFor="duplicate" className="text-gray-700 dark:text-gray-300 transition-colors">Duplicate</label>
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => {
                  setShowCancelOptions(false);
                  setCancelReason('');
                  setSelectedTicket(null);
                }}
                className="px-4 py-2 bg-orange-500 dark:bg-orange-600 text-white rounded-md hover:bg-orange-600 dark:hover:bg-orange-700 transition-colors"
              >
                Back
              </button>
              <button
                onClick={() => handleCancelConfirm(cancelReason)}
                disabled={!cancelReason}
                className="px-4 py-2 bg-green-500 dark:bg-green-600 text-white rounded-md hover:bg-green-600 dark:hover:bg-green-700 disabled:opacity-50 transition-colors"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Question Mark Help Icon */}
      <div className="fixed bottom-6 right-6">
        <div className="w-12 h-12 bg-gray-800 dark:bg-gray-700 text-white rounded-full flex items-center justify-center text-xl font-bold cursor-pointer hover:bg-gray-700 dark:hover:bg-gray-600 transition-colors">
          ?
        </div>
      </div>

      {/* Toast Notification */}
      <Toast
        message={toastMessage}
        type={toastType}
        isVisible={showToast}
        onClose={hideToast}
        duration={4000}
      />
    </div>
  );
};

export default Dashboard;
