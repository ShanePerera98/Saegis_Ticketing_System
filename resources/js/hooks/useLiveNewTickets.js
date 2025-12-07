import { useState, useEffect, useRef } from 'react';
import { ticketApi } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

export const useLiveNewTickets = (onNewTicket) => {
  const { user, loading, isAdmin, isSuperAdmin } = useAuth();
  const [newTickets, setNewTickets] = useState([]);
  const [isPolling, setIsPolling] = useState(false);
  const lastCheckRef = useRef(new Date().toISOString());
  const intervalRef = useRef(null);

  useEffect(() => {
    // TEMPORARILY DISABLED - Wait for auth to complete and only start polling for admins and super admins
    if (loading || !user || (!isAdmin() && !isSuperAdmin())) {
      return;
    }

    // TEMP: Disable polling to debug login issues
    return;

    const pollForNewTickets = async () => {
      try {
        setIsPolling(true);
        const response = await ticketApi.getLiveNewTickets(lastCheckRef.current);
        const data = response.data;

        if (data.new_tickets && data.new_tickets.length > 0) {
          // Add new tickets to existing list
          setNewTickets(prevTickets => {
            const existingIds = new Set(prevTickets.map(t => t.id));
            const uniqueNewTickets = data.new_tickets.filter(t => !existingIds.has(t.id));
            
            // Call callback for each new ticket
            uniqueNewTickets.forEach(ticket => {
              if (onNewTicket) {
                onNewTicket(ticket);
              }
            });

            return [...prevTickets, ...uniqueNewTickets];
          });

          // Update stats in real-time by triggering a stats refetch
          if (window.statsRefetch) {
            window.statsRefetch();
          }
        }

        lastCheckRef.current = data.last_check;
      } catch (error) {
        console.error('Error polling for new tickets:', error);
      } finally {
        setIsPolling(false);
      }
    };

    // Start polling every 1 second
    intervalRef.current = setInterval(pollForNewTickets, 1000);

    // Initial poll
    pollForNewTickets();

    // Cleanup on unmount
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [user, onNewTicket]);

  const clearNewTickets = () => {
    setNewTickets([]);
  };

  const removeNewTicket = (ticketId) => {
    setNewTickets(prev => prev.filter(t => t.id !== ticketId));
  };

  return {
    newTickets,
    isPolling,
    clearNewTickets,
    removeNewTicket
  };
};
