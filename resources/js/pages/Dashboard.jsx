import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ticketApi } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import CommonHeader from '../components/CommonHeader';
import HamburgerMenu from '../components/HamburgerMenu';
import Sidebar from '../components/Sidebar';
import TicketCard from '../components/TicketCard';
import Toast from '../components/Toast';

const Dashboard = () => {
  const { user } = useAuth();
  const [selectedStatus, setSelectedStatus] = useState('New');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const [showCancelOptions, setShowCancelOptions] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success');

  // Mock data for demonstration
  const mockTickets = [
    {
      id: 1,
      title: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
      description: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
      location: 'Floor 2, Hall A',
      priority: 'High',
      status: 'NEW',
      created_at: new Date(Date.now() - 60000).toISOString(), // 1 minute ago
      client_id: 'Client id'
    },
    {
      id: 2,
      title: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
      description: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
      location: 'Floor 1, Hall B',
      priority: 'Medium',
      status: 'NEW',
      created_at: new Date(Date.now() - 300000).toISOString(), // 5 minutes ago
      client_id: 'Client id'
    },
    {
      id: 3,
      title: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
      description: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
      location: 'Floor 3, Hall C',
      priority: 'Low',
      status: 'NEW',
      created_at: new Date(Date.now() - 600000).toISOString(), // 10 minutes ago
      client_id: 'Client id'
    },
    {
      id: 4,
      title: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
      description: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
      location: 'Floor 4, Hall D',
      priority: 'Urgent',
      status: 'NEW',
      created_at: new Date(Date.now() - 900000).toISOString(), // 15 minutes ago
      client_id: 'Client id'
    },
    {
      id: 5,
      title: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
      description: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
      location: 'Floor 5, Hall E',
      priority: 'High',
      status: 'NEW',
      created_at: new Date(Date.now() - 1200000).toISOString(), // 20 minutes ago
      client_id: 'Client id'
    }
  ];

  const handleTicketAction = (action, ticket, assignee = null) => {
    console.log(`Action: ${action}`, ticket, assignee);
    
    switch (action) {
      case 'get':
        // Move ticket to user's "New" queue
        alert(`Ticket ${ticket.id} has been added to your queue`);
        break;
      case 'cancel':
        setSelectedTicket(ticket);
        setShowCancelOptions(true);
        break;
      case 'assign':
        // Assign ticket to selected staff member
        alert(`Ticket ${ticket.id} has been assigned to ${assignee}`);
        break;
      case 'view':
        // Show ticket details for clients
        alert(`Viewing ticket details: ${ticket.title}`);
        break;
      default:
        console.log('Unknown action:', action);
    }
  };

  const handleCancelConfirm = (reason) => {
    console.log(`Ticket ${selectedTicket?.id} canceled with reason: ${reason}`);
    if (reason === 'Irrelevant') {
      alert('Ticket moved to canceled queue');
    } else if (reason === 'Duplicate') {
      alert('Ticket moved to duplicate merge queue');
    }
    setShowCancelOptions(false);
    setSelectedTicket(null);
  };

  const showToastMessage = (message, type = 'success') => {
    setToastMessage(message);
    setToastType(type);
    setShowToast(true);
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

  // Mock ticket counts for sidebar
  const ticketCounts = {
    'New': 5,
    'In Progress': 3,
    'Pending': 1,
    'Resolved': 12,
    'Canceled': 0,
    'Closed': 2,
    'Deleted': 0,
    'See Others Queue': 25
  };

  // Filter tickets based on selected status (this would be actual API call in real implementation)
  const filteredTickets = selectedStatus === 'New' ? mockTickets : [];

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
        <main className="flex-1 p-6">
          <div className="space-y-4">
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
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
