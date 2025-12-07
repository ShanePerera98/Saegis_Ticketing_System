import React, { useState, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { ticketApi } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { useLiveNewTickets } from '../hooks/useLiveNewTickets';
import LiveNewTicketsAlert from '../components/LiveNewTicketsAlert';
import CommonHeader from '../components/CommonHeader';
import HamburgerMenu from '../components/HamburgerMenu';
import Sidebar from '../components/Sidebar';
import TicketCard from '../components/TicketCard';
import Toast from '../components/Toast';

const Dashboard = () => {
  const { user, isAdmin, isSuperAdmin } = useAuth();
  const queryClient = useQueryClient();
  const [selectedStatus, setSelectedStatus] = useState('New');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const [showCancelOptions, setShowCancelOptions] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success');

  // Audio notification handler
  const handleNewTicketAlert = (newTicket) => {
    // Play audio notification
    try {
      const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmYdBjyY2e++'); 
      audio.volume = 0.3;
      audio.play().catch(() => {}); // Ignore errors if audio fails
    } catch (e) {
      // Ignore audio errors
    }
    
    showToastMessage(`🚨 New ticket available: #${newTicket.ticket_number} - ${newTicket.title}`, 'info');
  };

  // Initialize live new tickets hook BEFORE using newTickets in queries
  const { newTickets = [], clearNewTickets, removeNewTicket } = useLiveNewTickets(
    handleNewTicketAlert
  );

  // Fetch real-time individual profile tickets (no caching, always fresh data)
  const { data: tickets = [], isLoading, error, refetch } = useQuery({
    queryKey: ['tickets', user?.id, selectedStatus], // Removed Date.now() to prevent constant unique queries
    queryFn: () => {
      let status;
      if (selectedStatus === 'New') {
        status = 'NEW';
      } else if (selectedStatus === 'Acquired') {
        status = 'ACQUIRED';
      } else if (selectedStatus === 'Deleted') {
        status = 'DELETED';
      } else {
        status = selectedStatus.toUpperCase().replace(' ', '_');
      }
      
      const params = { status };
      return ticketApi.list(params);
    },
    select: (data) => {
      const fetchedTickets = data.data.data || data.data || [];
      
      // If we're viewing "New" status and there are live new tickets, merge them
      if (selectedStatus === 'New' && newTickets && newTickets.length > 0 && (isAdmin() || isSuperAdmin())) {
        const existingIds = new Set(fetchedTickets.map(t => t.id));
        const uniqueNewTickets = newTickets
          .filter(t => !existingIds.has(t.id))
          .map(t => ({
            id: t.id,
            ticket_number: t.ticket_number,
            title: t.title,
            priority: t.priority,
            status: 'NEW',
            client: { name: t.client_name },
            category: { name: t.category },
            created_at: t.created_at,
            current_assignee_id: null
          }));
        
        return [...uniqueNewTickets, ...fetchedTickets];
      }
      
      return fetchedTickets;
    },
    staleTime: 0, // Always stale, always refetch for real-time data
    cacheTime: 0, // No cache
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    refetchInterval: false, // Disabled automatic refetching to prevent conflicts during auth
    enabled: !!user, // Only run when user is loaded
  });

  // Fetch real-time individual profile statistics (no caching, always fresh data)
  const { data: stats = {}, refetch: refetchStats } = useQuery({
    queryKey: ['ticket-stats', user?.id], // Removed Date.now() to prevent constant unique queries
    queryFn: () => ticketApi.getStats(),
    select: (data) => data.data || {},
    staleTime: 0, // Always stale, always refetch for real-time data
    cacheTime: 0, // No cache
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    refetchInterval: false, // Disabled automatic refetching to prevent conflicts during auth
    enabled: !!user, // Only run when user is loaded
  });

  const showToastMessage = (message, type = 'success') => {
    setToastMessage(message);
    setToastType(type);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleNewTicketClick = async (ticket) => {
    try {
      // Acquire the ticket immediately
      await ticketApi.acquire(ticket.id);
      removeNewTicket(ticket.id);
      showToastMessage(`Ticket #${ticket.ticket_number} acquired successfully!`, 'success');
      
      // Refresh to show the acquired ticket in user's queue
      refetch();
      refetchStats();
    } catch (error) {
      if (error.response?.status === 409) {
        // Ticket was already acquired by someone else
        removeNewTicket(ticket.id);
        showToastMessage('Ticket already acquired by another user', 'warning');
        
        // Refresh to get the latest state
        refetch();
        refetchStats();
      } else {
        console.error('Error acquiring ticket:', error);
        showToastMessage('Failed to acquire ticket', 'error');
      }
    }
  };

  // Rest of the component logic...
  const handleAcquire = async (ticketId) => {
    try {
      await ticketApi.acquire(ticketId);
      showToastMessage('Ticket acquired successfully!', 'success');
      refetch();
      refetchStats();
    } catch (error) {
      if (error.response?.status === 409) {
        showToastMessage('Ticket already acquired by another user', 'warning');
        refetch();
      } else {
        console.error('Error acquiring ticket:', error);
        showToastMessage('Failed to acquire ticket', 'error');
      }
    }
  };

  const handleComplete = async (ticketId) => {
    try {
      await ticketApi.complete(ticketId);
      showToastMessage('Ticket completed successfully!', 'success');
      refetch();
      refetchStats();
    } catch (error) {
      console.error('Error completing ticket:', error);
      showToastMessage('Failed to complete ticket', 'error');
    }
  };

  const handleCancel = async (ticketId, reason = '') => {
    try {
      await ticketApi.cancel(ticketId, reason);
      showToastMessage('Ticket cancelled successfully!', 'success');
      setShowCancelOptions(false);
      setSelectedTicket(null);
      setCancelReason('');
      refetch();
      refetchStats();
    } catch (error) {
      console.error('Error cancelling ticket:', error);
      showToastMessage('Failed to cancel ticket', 'error');
    }
  };

  const handleCancelClick = (ticket) => {
    setSelectedTicket(ticket);
    setShowCancelOptions(true);
  };

  const handleCancelSubmit = () => {
    if (selectedTicket) {
      handleCancel(selectedTicket.id, cancelReason);
    }
  };

  const handleRelease = async (ticketId) => {
    try {
      await ticketApi.release(ticketId);
      showToastMessage('Ticket released successfully!', 'success');
      refetch();
      refetchStats();
    } catch (error) {
      console.error('Error releasing ticket:', error);
      showToastMessage('Failed to release ticket', 'error');
    }
  };

  const handleReopen = async (ticketId) => {
    try {
      await ticketApi.reopen(ticketId);
      showToastMessage('Ticket reopened successfully!', 'success');
      refetch();
      refetchStats();
    } catch (error) {
      console.error('Error reopening ticket:', error);
      showToastMessage('Failed to reopen ticket', 'error');
    }
  };

  const handleReassign = async (ticketId, assigneeId) => {
    try {
      await ticketApi.reassign(ticketId, assigneeId);
      showToastMessage('Ticket reassigned successfully!', 'success');
      refetch();
      refetchStats();
    } catch (error) {
      console.error('Error reassigning ticket:', error);
      showToastMessage('Failed to reassign ticket', 'error');
    }
  };

  const handleInProgress = async (ticketId) => {
    try {
      await ticketApi.updateStatus(ticketId, 'IN_PROGRESS');
      showToastMessage('Ticket marked as in progress!', 'success');
      refetch();
      refetchStats();
    } catch (error) {
      console.error('Error updating ticket status:', error);
      showToastMessage('Failed to update ticket status', 'error');
    }
  };

  const handleDelete = async (ticketId) => {
    try {
      await ticketApi.delete(ticketId);
      showToastMessage('Ticket deleted successfully!', 'success');
      refetch();
      refetchStats();
    } catch (error) {
      console.error('Error deleting ticket:', error);
      showToastMessage('Failed to delete ticket', 'error');
    }
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error loading tickets: {error.message}</div>;
  }

  const statuses = ['New', 'Acquired', 'In Progress', 'Completed', 'Cancelled', 'Deleted'];
  
  const ticketCounts = {
    'New': (stats.new || 0) + (newTickets && newTickets.length ? newTickets.length : 0), // Add live new tickets count
    'Acquired': stats.acquired || 0,
    'In Progress': stats.in_progress || 0,
    'Completed': stats.completed || 0,
    'Cancelled': stats.cancelled || 0,
    'Deleted': stats.deleted || 0,
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <CommonHeader />
      
      <div className="flex">
        <HamburgerMenu isOpen={isMenuOpen} setIsOpen={setIsMenuOpen} />
        <Sidebar 
          selectedStatus={selectedStatus}
          setSelectedStatus={setSelectedStatus}
          ticketCounts={ticketCounts}
          isMenuOpen={isMenuOpen}
        />
        
        <main className="flex-1 p-6">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              {selectedStatus} Tickets ({ticketCounts[selectedStatus] || 0})
            </h1>
          </div>

          {/* Live New Tickets Alert for Admins/Super Admins */}
          {(isAdmin() || isSuperAdmin()) && (
            <LiveNewTicketsAlert
              newTickets={newTickets}
              onTicketClick={handleNewTicketClick}
              onDismissAll={clearNewTickets}
            />
          )}

          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
            </div>
          ) : tickets.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-500 dark:text-gray-400 text-lg">
                No {selectedStatus.toLowerCase()} tickets found
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tickets.map((ticket) => (
                <TicketCard
                  key={ticket.id}
                  ticket={ticket}
                  onAcquire={handleAcquire}
                  onComplete={handleComplete}
                  onCancel={handleCancelClick}
                  onRelease={handleRelease}
                  onReopen={handleReopen}
                  onReassign={handleReassign}
                  onInProgress={handleInProgress}
                  onDelete={handleDelete}
                  currentUser={user}
                />
              ))}
            </div>
          )}
        </main>
      </div>

      {/* Cancel Modal */}
      {showCancelOptions && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
              Cancel Ticket #{selectedTicket?.ticket_number}
            </h3>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Cancellation Reason (Optional)
              </label>
              <textarea
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                rows={3}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                placeholder="Enter reason for cancellation..."
              />
            </div>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowCancelOptions(false);
                  setSelectedTicket(null);
                  setCancelReason('');
                }}
                className="px-4 py-2 text-gray-600 bg-gray-200 rounded-md hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-300 dark:hover:bg-gray-500"
              >
                Cancel
              </button>
              <button
                onClick={handleCancelSubmit}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Confirm Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <Toast
        show={showToast}
        message={toastMessage}
        type={toastType}
        onClose={() => setShowToast(false)}
      />
    </div>
  );
};

export default Dashboard;
